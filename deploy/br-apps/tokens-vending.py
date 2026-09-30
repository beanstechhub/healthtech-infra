"""BeansMed tokens — ponto de venda de tokens de IA para os portais Beanstech.
Casa: beansmed.com.br (também em chat.beanstech.ai/tokens). Vende pacotes
(Pix BR Code estático), emite API keys bth_* com saldo, e o ollama-shim debita
por request. SQLite local em /var/lib/tokens-vending.
Padrão de segredos: /usr/local/etc/tokens/<NOME> (mesmo esquema do shim).
"""
from __future__ import annotations
import hmac, json, os, re, secrets, sqlite3, time
from datetime import datetime, timezone
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel

DB = os.environ.get("VENDING_DB", "/var/lib/tokens-vending/vending.db")
TOKENS_DIR = "/usr/local/etc/tokens"
ADMIN = open(f"{TOKENS_DIR}/VENDING_ADMIN_TOKEN").read().strip() if os.path.exists(f"{TOKENS_DIR}/VENDING_ADMIN_TOKEN") else os.environ.get("VENDING_ADMIN_TOKEN", "")
PIX_KEY = open(f"{TOKENS_DIR}/PIX_KEY").read().strip() if os.path.exists(f"{TOKENS_DIR}/PIX_KEY") else os.environ.get("PIX_KEY", "")
STRIPE_KEY = open(f"{TOKENS_DIR}/STRIPE_SECRET_KEY").read().strip() if os.path.exists(f"{TOKENS_DIR}/STRIPE_SECRET_KEY") else ""
STRIPE_WEBHOOK = open(f"{TOKENS_DIR}/STRIPE_WEBHOOK_SECRET").read().strip() if os.path.exists(f"{TOKENS_DIR}/STRIPE_WEBHOOK_SECRET") else ""
MERCHANT = os.environ.get("PIX_MERCHANT", "BEANS TECH")
CITY = os.environ.get("PIX_CITY", "Fortaleza")
BASE_URL = os.environ.get("BASE_URL", "https://beansmed.com.br")

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

def _stripe_post(path: str, data: dict):
    """POST no api.stripe.com (host fixo, form-encoded). Sem URL dinâmica."""
    import http.client, urllib.parse
    if not STRIPE_KEY:
        return None, 0
    conn = http.client.HTTPSConnection("api.stripe.com", timeout=30)
    body = urllib.parse.urlencode(data)
    conn.request("POST", path, body, {"Authorization": f"Bearer {STRIPE_KEY}",
                                      "Content-Type": "application/x-www-form-urlencoded"})
    r = conn.getresponse()
    out = json.loads(r.read() or b"{}")
    conn.close()
    return out, r.status

def _credit(order_id: str) -> dict:
    """Marca pedido como pago e credita os tokens (idempotente)."""
    c = db()
    with c:
        o = c.execute("SELECT tokens, key, status FROM orders WHERE id=?", (order_id,)).fetchone()
        if not o:
            c.close()
            raise HTTPException(404, "pedido não encontrado")
        if o[2] != "paid":
            c.execute("UPDATE orders SET status='paid', paid_at=? WHERE id=?", (now(), order_id))
            c.execute("UPDATE api_keys SET balance=balance+? WHERE key=?", (o[0], o[1]))
            c.execute("INSERT INTO ledger(key,delta,reason,ts) VALUES(?,?,?,?)", (o[1], o[0], f"stripe {order_id}", now()))
    return {"status": "paid", "key": o[1], "saldo": o[0]}

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
    # pagamento: Stripe (Pix automático via webhook) ou BR Code estático
    stripe_url = None
    if STRIPE_KEY:
        sess, code = _stripe_post("/v1/checkout/sessions", {
            "mode": "payment",
            "payment_method_types[0]": "pix",
            "line_items[0][quantity]": "1",
            "line_items[0][price_data][currency]": "brl",
            "line_items[0][price_data][unit_amount]": str(int(round(pack["preco"] * 100))),
            "line_items[0][price_data][product_data][name]": f"BeansMed {pack['nome']} — {pack['tokens']} tokens",
            "metadata[order]": oid,
            "success_url": f"{BASE_URL}/?paid=1",
            "cancel_url": f"{BASE_URL}/?cancel=1",
        })
        if code == 200:
            stripe_url = sess.get("url")
    brcode = pix_brcode(PIX_KEY, pack["preco"], oid) if PIX_KEY else None
    qr_svg = None
    if brcode:
        import qrcode, qrcode.image.svg, io
        img = qrcode.make(brcode, image_factory=qrcode.image.svg.SvgPathImage, box_size=10)
        buf = io.StringIO(); img.save(buf); qr_svg = buf.getvalue()
    return {"order": oid, "key": key, "tokens": pack["tokens"], "preco": pack["preco"],
            "stripe_url": stripe_url,
            "pix_brcode": brcode, "pix_key": PIX_KEY or None, "qr_svg": qr_svg,
            "instrucoes": "Pague pelo Pix (QR ou copia-e-cola). Com Stripe o saldo libera sozinho após o pagamento; sem Stripe, após confirmação do financeiro."}

@app.get("/admin/stats")
def stats(authorization: str = Header(default="")):
    """Dashboard da vertical tokens: vendas, receita, consumo por key."""
    require_admin(authorization.removeprefix("Bearer ").strip())
    c = db()
    tot = c.execute("SELECT COUNT(*), COALESCE(SUM(amount),0), COALESCE(SUM(tokens),0) FROM orders WHERE status='paid'").fetchone()
    pend = c.execute("SELECT COUNT(*), COALESCE(SUM(amount),0) FROM orders WHERE status='pending'").fetchone()
    keys = c.execute("SELECT COUNT(*), COALESCE(SUM(balance),0) FROM api_keys WHERE active=1").fetchone()
    consumo = c.execute("SELECT COALESCE(SUM(-delta),0) FROM ledger WHERE delta<0").fetchone()[0]
    por_pack = c.execute("SELECT pack, COUNT(*), SUM(tokens) FROM orders WHERE status='paid' GROUP BY pack").fetchall()
    top_keys = c.execute("SELECT k.label, k.balance, COALESCE(SUM(-l.delta),0) FROM api_keys k LEFT JOIN ledger l ON l.key=k.key WHERE k.active=1 GROUP BY k.key ORDER BY 3 DESC LIMIT 10").fetchall()
    c.close()
    return {"vendas_pagas": {"pedidos": tot[0], "receita_brl": round(tot[1], 2), "tokens_vendidos": tot[2]},
            "vendas_pendentes": {"pedidos": pend[0], "valor_brl": round(pend[1], 2)},
            "keys_ativas": keys[0], "saldo_em_circulacao": keys[1],
            "tokens_consumidos": consumo,
            "por_pacote": [dict(zip(("pack", "pedidos", "tokens"), r)) for r in por_pack],
            "top_consumidores": [dict(zip(("email", "saldo", "consumidos"), r)) for r in top_keys]}

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

@app.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    """Webhook Stripe: checkout.session.completed → credita tokens automaticamente.
    Assinatura verificada com HMAC-SHA256 (Stripe-Signature: t=...,v1=...)."""
    if not STRIPE_WEBHOOK:
        raise HTTPException(503, "webhook Stripe não configurado")
    raw = await request.body()
    sig = request.headers.get("stripe-signature", "")
    parts = dict(p.split("=", 1) for p in sig.split(",") if "=" in p) if sig else {}
    ts, v1 = parts.get("t", ""), parts.get("v1", "")
    if not (ts.isdigit() and re.fullmatch(r"[0-9a-f]{64}", v1)):
        raise HTTPException(400, "assinatura malformada")
    import hmac as _hmac, hashlib
    signed = f"{ts}.".encode() + raw
    expected = _hmac.new(STRIPE_WEBHOOK.encode(), signed, hashlib.sha256).hexdigest()
    if not _hmac.compare_digest(expected, v1):
        raise HTTPException(400, "assinatura inválida")
    if abs(time.time() - int(ts)) > 300:  # janela anti-replay: 5 min
        raise HTTPException(400, "timestamp fora da janela")
    try:
        event = json.loads(raw)
    except Exception:
        raise HTTPException(400, "json inválido")
    if event.get("type") == "checkout.session.completed":
        oid = (event.get("data", {}).get("object", {}).get("metadata", {}) or {}).get("order")
        if oid and re.match(r"^PD[0-9a-f]{16}$", oid):
            return _credit(oid)
    return {"received": True}

@app.get("/", response_class=HTMLResponse)
def index():
    packs = "".join(
        f'<div class=pack><div class=nome>{p["nome"]}</div><div class=tok>{p["tokens"]} tokens</div>'
        f'<div class=preco>R$ {p["preco"]:.2f}</div>'
        f'<button onclick="buy(\'{pid}\')">Comprar com Pix</button></div>'
        for pid, p in PACKS.items())
    pix_aviso = "" if PIX_KEY else '<p class=aviso>⚠ Chave Pix não configurada — configure /usr/local/etc/tokens/PIX_KEY</p>'
    return f"""<!doctype html><html lang=pt-br><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>BeansMed — Tokens de Excelência</title>
<style>body{{font:15px/1.5 -apple-system,Segoe UI,Inter,Arial;background:#0b1512;color:#e8f0ee;margin:0;padding:32px;max-width:1100px}}
h1{{font-size:26px;margin:0 0 6px}}h1 .b{{color:#7fd1c1}}.sub{{color:#8fa7a2;margin-bottom:26px}}
.packs{{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px}}
.pack{{border:1px solid #1f2f2b;border-radius:12px;padding:22px;text-align:center;background:#101c18}}
.nome{{font-weight:700;font-size:17px;color:#7fd1c1}}.tok{{margin:8px 0;color:#a9bcb8}}.preco{{font-size:24px;font-weight:700;margin:10px 0}}
button{{background:#7fd1c1;color:#06211a;border:0;border-radius:8px;padding:10px 18px;font-weight:700;cursor:pointer;font-size:14px}}
button:hover{{background:#96dbcd}}.aviso{{color:#f2a65a}}
#result{{display:none;margin-top:26px;border:1px solid #1f2f2b;border-radius:12px;padding:22px;background:#101c18}}
code{{display:block;background:#06211a;padding:12px;border-radius:8px;margin:8px 0;word-break:break-all;font-size:12px;color:#a9bcb8}}
.ok{{color:#7fd1c1;font-weight:700}}.qr{{margin:12px auto;width:220px}}
.chain{{border:1px solid #1f2f2b;border-radius:12px;padding:18px;margin-top:26px;background:#101c18;color:#a9bcb8;font-size:13.5px}}
.chain b{{color:#7fd1c1}}</style>
<h1>Beans<span class=b>Med</span> — Tokens de Excelência</h1>
<div class=sub>IA médica auditável para apoio à decisão clínica: consulta de excelência (235B com raciocínio), chat clínico (MedGemma-27B) e camada de segurança Granite. Pix, saldo imediato, API key própria.</div>
<div class=chain><b>O que um token aciona:</b> chat clínico = 1 token · consulta de excelência (Baichuan-M3 235B, 6 camadas de verificação anti-alucinação) = 5 tokens — o motor do <b>/decisao</b> presente em 8 portais.</div>
{pix_aviso}
<div class=packs>{packs}</div>
<div id=result></div>
<script>
async function buy(pid){{
  const email = prompt('Seu e-mail para receber a API key:');
  if(!email) return;
  const r = await fetch('buy',{{method:'POST',headers:{{'Content-Type':'application/json'}},body:JSON.stringify({{pack:pid,email}})}}).then(r=>r.json());
  const d = document.getElementById('result'); d.style.display='block';
  const pagamento = r.stripe_url
    ? `<p><a href="${{r.stripe_url}}" style="color:#7fd1c1;font-weight:700">→ Pagar com Pix (Stripe) — saldo libera sozinho</a></p>`
    : `<p>Pix copia-e-cola — R$ ${{r.preco.toFixed(2)}}:</p><code>${{r.pix_brcode || 'Pix não configurado — entre em contato: financeiro@beanstech.com.br'}}</code><div class=qr>${{r.qr_svg || ''}}</div>`;
  d.innerHTML = `<span class=ok>Pedido ${{r.order}} criado — saldo liberado após o pagamento.</span>
    <p>Sua API key (guarde-a):</p><code>${{r.key}}</code>
    ${{pagamento}}
    <p class=ok id=st>aguardando pagamento…</p>`;
  const poll = setInterval(async () => {{
    const o = await fetch('order/' + r.order).then(x=>x.json());
    if (o.status === 'paid') {{ document.getElementById('st').textContent = '✓ pagamento confirmado — saldo disponível!'; clearInterval(poll); }}
  }}, 15000);
}}
</script>"""

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=int(os.environ.get("PORT", "4095")), log_level="warning")
