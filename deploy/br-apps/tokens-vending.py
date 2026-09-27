"""tokens.beanstech — ponto de venda de tokens de IA para os portais BeansTech.
Vende pacotes (Pix BR Code estático), emite API keys bth_* com saldo, e o
ollama-shim debita por request. SQLite local em /var/lib/tokens-vending.
Padrão de segredos: /usr/local/etc/tokens/<NOME> (mesmo esquema do shim).
"""
from __future__ import annotations
import hmac, os, re, secrets, sqlite3, time
from datetime import datetime, timezone
from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel

DB = os.environ.get("VENDING_DB", "/var/lib/tokens-vending/vending.db")
TOKENS_DIR = "/usr/local/etc/tokens"
ADMIN = open(f"{TOKENS_DIR}/VENDING_ADMIN_TOKEN").read().strip() if os.path.exists(f"{TOKENS_DIR}/VENDING_ADMIN_TOKEN") else os.environ.get("VENDING_ADMIN_TOKEN", "")
PIX_KEY = open(f"{TOKENS_DIR}/PIX_KEY").read().strip() if os.path.exists(f"{TOKENS_DIR}/PIX_KEY") else os.environ.get("PIX_KEY", "")
MERCHANT = os.environ.get("PIX_MERCHANT", "BEANS TECH")
CITY = os.environ.get("PIX_CITY", "Fortaleza")

# pacotes: id → (tokens, preço R$)
PACKS = {
    "starter": {"tokens": 100,   "preco": 19.90, "nome": "Starter"},
    "pro":      {"tokens": 500,   "preco": 79.00, "nome": "Pro"},
    "clinica":  {"tokens": 2000,  "preco": 249.00, "nome": "Clínica"},
}

def db() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(DB), exist_ok=True)
    c = sqlite3.connect(DB, timeout=10)
    c.execute("PRAGMA journal_mode=WAL")
    c.executescript("""
    CREATE TABLE IF NOT EXISTS api_keys(
      key TEXT PRIMARY KEY, label TEXT NOT NULL, balance INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS orders(
      id TEXT PRIMARY KEY, pack TEXT NOT NULL, tokens INTEGER NOT NULL, amount REAL NOT NULL,
      key TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL, paid_at TEXT);
    CREATE TABLE IF NOT EXISTS ledger(
      id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT NOT NULL, delta INTEGER NOT NULL,
      reason TEXT NOT NULL, ts TEXT NOT NULL);
    """)
    return c

def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")

def crc16(payload: str) -> str:
    crc = 0xFFFF
    for ch in payload.encode():
        crc ^= ch << 8
        for _ in range(8):
            crc = ((crc << 1) ^ 0x1021) if (crc & 0x8000) else (crc << 1)
            crc &= 0xFFFF
    return f"{crc:04X}"

def emv(tag: str, value: str) -> str:
    return f"{tag}{len(value):02d}{value}"

def pix_brcode(key: str, amount: float, txid: str) -> str:
    """BR Code estático (EMV QRCPS-MPM) com valor e referência. Sem URL dinâmica."""
    if not re.match(r"^[A-Za-z0-9@.\-+]{4,77}$", key):
        raise ValueError("chave Pix inválida")
    txid = re.sub(r"[^A-Za-z0-9]", "", txid)[:25]
    payload = (emv("00", "01")
               + emv("01", "12")
               + emv("26", emv("00", "BR.GOV.BCB.PIX") + emv("01", key))
               + emv("52", "0000") + emv("53", "986")
               + emv("54", f"{amount:.2f}")
               + emv("58", "BR") + emv("59", MERCHANT[:25]) + emv("60", CITY[:15])
               + emv("62", emv("05", txid or "***")))
    return payload + "6304" + crc16(payload + "6304")

def new_key() -> str:
    return "bth_" + secrets.token_urlsafe(30)[:38]

def require_admin(admin: str | None):
    if not ADMIN or not admin or not hmac.compare_digest(admin, ADMIN):
        raise HTTPException(403, "admin token inválido")

class Buy(BaseModel):
    pack: str
    email: str

app = FastAPI(title="tokens.beanstech")

@app.get("/healthz")
def hz(): return {"ok": True, "pix": bool(PIX_KEY)}

@app.post("/buy")
def buy(b: Buy):
    pack = PACKS.get(b.pack)
    if not pack:
        raise HTTPException(400, "pacote inexistente")
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", b.email):
        raise HTTPException(400, "e-mail inválido")
    c = db()
    key = new_key()
    oid = "PD" + secrets.token_hex(8)
    with c:
        c.execute("INSERT INTO api_keys(key,label,created_at) VALUES(?,?,?)", (key, b.email, now()))
        c.execute("INSERT INTO orders(id,pack,tokens,amount,key,created_at) VALUES(?,?,?,?,?,?)",
                  (oid, b.pack, pack["tokens"], pack["preco"], key, now()))
    brcode = pix_brcode(PIX_KEY, pack["preco"], oid) if PIX_KEY else None
    qr_svg = None
    if brcode:
        import qrcode, qrcode.image.svg
        img = qrcode.make(brcode, image_factory=qrcode.image.svg.SvgPathImage, box_size=10)
        import io
        buf = io.StringIO()
        img.save(buf)
        qr_svg = buf.getvalue()
    return {"order": oid, "key": key, "tokens": pack["tokens"], "preco": pack["preco"],
            "pix_brcode": brcode, "pix_key": PIX_KEY or None, "qr_svg": qr_svg,
            "instrucoes": "Pague pelo Pix copia-e-cola (ou QR) e o saldo é liberado após confirmação do financeiro."}

@app.get("/order/{oid}")
def order(oid: str):
    if not re.match(r"^PD[0-9a-f]{16}$", oid):
        raise HTTPException(400, "id inválido")
    c = db()
    r = c.execute("SELECT id,pack,tokens,amount,status,created_at,paid_at FROM orders WHERE id=?", (oid,)).fetchone()
    c.close()
    if not r:
        raise HTTPException(404, "pedido não encontrado")
    return dict(zip(("order", "pack", "tokens", "amount", "status", "created_at", "paid_at"), r))

@app.get("/balance")
def balance(authorization: str = Header(default="")):
    k = authorization.removeprefix("Bearer ").strip()
    if not k.startswith("bth_"):
        raise HTTPException(401, "use Authorization: Bearer bth_...")
    c = db()
    r = c.execute("SELECT balance, active FROM api_keys WHERE key=?", (k,)).fetchone()
    c.close()
    if not r or not r[1]:
        raise HTTPException(401, "key inválida ou inativa")
    return {"balance": r[0]}

@app.post("/internal/deduct")
def deduct(body: dict, authorization: str = Header(default="")):
    """Debito usado pelo ollama-shim (mesma máquina) — exige token admin."""
    require_admin(authorization.removeprefix("Bearer ").strip())
    k, cost, reason = body.get("key", ""), int(body.get("cost", 1)), body.get("reason", "request")[:100]
    if not k.startswith("bth_"):
        raise HTTPException(400, "key inválida")
    c = db()
    with c:
        r = c.execute("SELECT balance FROM api_keys WHERE key=? AND active=1", (k,)).fetchone()
        if not r:
            c.close()
            raise HTTPException(404, "key não encontrada")
        if r[0] < cost:
            c.close()
            raise HTTPException(402, "saldo insuficiente")
        c.execute("UPDATE api_keys SET balance=balance-? WHERE key=?", (cost, k))
        c.execute("INSERT INTO ledger(key,delta,reason,ts) VALUES(?,?,?,?)", (k, -cost, reason, now()))
    return {"balance": r[0] - cost}

@app.post("/admin/confirm/{oid}")
def confirm(oid: str, authorization: str = Header(default="")):
    require_admin(authorization.removeprefix("Bearer ").strip())
    c = db()
    with c:
        o = c.execute("SELECT tokens, key, status FROM orders WHERE id=?", (oid,)).fetchone()
        if not o:
            c.close()
            raise HTTPException(404, "pedido não encontrado")
        if o[2] == "paid":
            c.close()
            return {"status": "paid", "ja_confirmado": True}
        c.execute("UPDATE orders SET status='paid', paid_at=? WHERE id=?", (now(), oid))
        c.execute("UPDATE api_keys SET balance=balance+? WHERE key=?", (o[0], o[1]))
        c.execute("INSERT INTO ledger(key,delta,reason,ts) VALUES(?,?,?,?)", (o[1], o[0], f"pix {oid}", now()))
    return {"status": "paid", "key": o[1], "saldo": o[0]}

@app.get("/")
def index():
    packs = "".join(
        f'<div class=pack><div class=nome>{p["nome"]}</div><div class=tok>{p["tokens"]} tokens</div>'
        f'<div class=preco>R$ {p["preco"]:.2f}</div>'
        f'<button onclick="buy(\'{pid}\')">Comprar com Pix</button></div>'
        for pid, p in PACKS.items())
    pix_aviso = "" if PIX_KEY else '<p class=aviso>⚠ Chave Pix não configurada — configure /usr/local/etc/tokens/PIX_KEY</p>'
    return f"""<!doctype html><html lang=pt-br><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>BeansTech — Tokens de IA</title>
<style>body{{font:15px/1.5 -apple-system,Segoe UI,Inter,Arial;background:#0b1512;color:#e8f0ee;margin:0;padding:32px;max-width:1100px}}
h1{{font-size:26px;margin:0 0 6px}}.sub{{color:#8fa7a2;margin-bottom:26px}}
.packs{{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px}}
.pack{{border:1px solid #1f2f2b;border-radius:12px;padding:22px;text-align:center;background:#101c18}}
.nome{{font-weight:700;font-size:17px;color:#7fd1c1}}.tok{{margin:8px 0;color:#a9bcb8}}.preco{{font-size:24px;font-weight:700;margin:10px 0}}
button{{background:#7fd1c1;color:#06211a;border:0;border-radius:8px;padding:10px 18px;font-weight:700;cursor:pointer;font-size:14px}}
button:hover{{background:#96dbcd}}.aviso{{color:#f2a65a}}
#result{{display:none;margin-top:26px;border:1px solid #1f2f2b;border-radius:12px;padding:22px;background:#101c18}}
code{{display:block;background:#06211a;padding:12px;border-radius:8px;margin:8px 0;word-break:break-all;font-size:12px;color:#a9bcb8}}
.ok{{color:#7fd1c1;font-weight:700}}.qr{{margin:12px auto;width:220px}}</style>
<h1>BeansTech — Tokens de IA</h1>
<div class=sub>Creditos para as ferramentas de apoio à decisão clínica (/decisao) e chat dos portais BeansTech. 1 token = 1 pergunta.</div>
{pix_aviso}
<div class=packs>{packs}</div>
<div id=result></div>
<script>
async function buy(pid){{
  const email = prompt('Seu e-mail para receber a API key:');
  if(!email) return;
  const r = await fetch('/tokens/buy',{{method:'POST',headers:{{'Content-Type':'application/json'}},body:JSON.stringify({{pack:pid,email}})}}).then(r=>r.json());
  const d = document.getElementById('result'); d.style.display='block';
  d.innerHTML = `<span class=ok>Pedido ${{r.order}} criado — saldo liberado após confirmação do pagamento.</span>
    <p>Sua API key (guarde-a):</p><code>${{r.key}}</code>
    <p>Pix copia-e-cola — R$ ${{r.preco.toFixed(2)}}:</p><code>${{r.pix_brcode || 'Pix não configurado — entre em contato: financeiro@beanstech.com.br'}}</code>
    <div class=qr>${{r.qr_svg || ''}}</div>
    <p class=ok id=st>aguardando pagamento…</p>`;
  const poll = setInterval(async () => {{
    const o = await fetch('/tokens/order/' + r.order).then(x=>x.json());
    if (o.status === 'paid') {{ document.getElementById('st').textContent = '✓ pagamento confirmado — saldo disponível!'; clearInterval(poll); }}
  }}, 15000);
}}
</script>"""

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=int(os.environ.get("PORT", "4095")), log_level="warning")
