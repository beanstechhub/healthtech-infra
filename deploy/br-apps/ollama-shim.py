#!/usr/bin/env python3
"""Shim Ollama-API → vLLM (OpenAI) para os portais BeansTech.
Substitui o ollama-router da Singapura: expõe /api/chat, /api/generate, /api/tags,
/api/ps, /api/version com auth Bearer (mesmo token GPU_GATEWAY_TOKEN) e converte
para os vLLM da frota Virginia (elite-va/flash-va), streaming incluso.

Modelos (nome Ollama → vLLM):
  medgemma:27b, medgemma-27b      → elite-va:8001  medgemma-27b
  medgemma:4b, medgemma-1.5-4b    → flash-va:8004  medgemma-4b
  granite4.1, granite-4.1         → flash-va:8002  granite-4.1
  granite3-guardian, granite-guardian → flash-va:8003 granite-guardian
  qwen3-vl, lingshu-i             → flash-va:8005  lingshu-i-8b
  baichuan-m2                     → flash-va:8006  baichuan-m2
  lingshu-32b                     → elite-va:8002  lingshu-32b
  antangelmed                     → elite-va:8000  antangelmed
  demais (default)                → elite-va:8001  medgemma-27b
"""
import http.client, json, re, sys, threading, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ELITE = "47.85.187.149"
FLASH = "47.85.207.155"
M3VA = "47.85.201.160"   # m3-va (Virgínia) — camada de excelência 235B

TOKEN = open("/usr/local/etc/ollama-shim-token").read().strip()

# ── venda de tokens: keys bth_* compradas no tokens-vending (Pix) ──
VENDING_DB = "/var/lib/tokens-vending/vending.db"
CUST_COST = 1  # tokens debitados por request de chat/generate

def _cust(k: str, charge: bool, cost: int = 1):
    """Valida key de cliente no SQLite do vending; se charge=True, debita cost tokens."""
    if not k.startswith("bth_"):
        return False
    import sqlite3
    con = sqlite3.connect(VENDING_DB, timeout=10)
    try:
        with con:
            r = con.execute("SELECT balance FROM api_keys WHERE key=? AND active=1", (k,)).fetchone()
            if not r or r[0] < (cost if charge else 0):
                return False
            if charge:
                con.execute("UPDATE api_keys SET balance=balance-? WHERE key=?", (cost, k))
                con.execute("INSERT INTO ledger(key,delta,reason,ts) VALUES(?,?,?,datetime('now'))", (k, -cost, "shim"))
        return True
    except Exception:
        return False
    finally:
        con.close()

ROUTES = {
    "medgemma-27b":     (ELITE,  8001, "medgemma-27b",   "GPU_GATEWAY_TOKEN"),
    "medgemma:27b":     (ELITE,  8001, "medgemma-27b",   "GPU_GATEWAY_TOKEN"),
    "medgemma:4b":      (FLASH,  8004, "medgemma-4b",    "GPU_GATEWAY_TOKEN"),
    "medgemma-1.5-4b":  (FLASH,  8004, "medgemma-4b",    "GPU_GATEWAY_TOKEN"),
    "granite4.1":       (FLASH,  8002, "granite-4.1",    "GPU_GATEWAY_TOKEN"),
    "granite3-guardian":(FLASH,  8003, "granite-guardian","GPU_GATEWAY_TOKEN"),
    "granite-guardian": (FLASH,  8003, "granite-guardian","GPU_GATEWAY_TOKEN"),
    "qwen3-vl":         (FLASH,  8005, "lingshu-i-8b",   "GPU2_GATEWAY_TOKEN"),
    "lingshu-i":        (FLASH,  8005, "lingshu-i-8b",   "GPU2_GATEWAY_TOKEN"),
    "baichuan-m2":      (FLASH,  8006, "baichuan-m2",    "GPU2_GATEWAY_TOKEN"),
    "lingshu-32b":      (ELITE,  8002, "lingshu-32b",    "GPU2_GATEWAY_TOKEN"),
    "antangelmed":      (ELITE,  8000, "antangelmed",    "ANTMED_API_TOKEN"),
    # Roteamento de Excelência — Baichuan-M3-235B (m3-va, Virgínia), 5 tokens/request
    "excellence":       (M3VA,   8000, "baichuan-m3",   "M3_API_TOKEN"),
    "baichuan-m3":      (M3VA,   8000, "baichuan-m3",   "M3_API_TOKEN"),
    "m3":               (M3VA,   8000, "baichuan-m3",   "M3_API_TOKEN"),
    "m3-235b":          (M3VA,   8000, "baichuan-m3",   "M3_API_TOKEN"),
}
DEFAULT = (ELITE, 8001, "medgemma-27b", "GPU_GATEWAY_TOKEN")
TOKENS = {}  # preenchido no boot a partir do KMS local

# custo em tokens por modelo (clientes bth_*) — excelência custa 5, demais 1
CUST_COST = {"baichuan-m3": 5}

def resolve(model: str):
    m = (model or "").strip().lower()
    if m in ROUTES: return ROUTES[m]
    for k, v in ROUTES.items():
        if m.startswith(k.split(":")[0]): return v
    return DEFAULT

def auth_for(keyname: str) -> str:
    return TOKENS.get(keyname, "")

class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def _reply(self, code, body=b"{}", ctype="application/json"):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _authed(self):
        a = self.headers.get("Authorization", "")
        if a == f"Bearer {TOKEN}":
            return True
        return _cust(a.removeprefix("Bearer ").strip(), charge=False)

    def _charge(self, target_model):
        """Roteamento de Excelência: debita o custo do modelo (bth_*).
        False = bloqueado (já respondeu 402)."""
        k = self.headers.get("Authorization", "").removeprefix("Bearer ").strip()
        if not k.startswith("bth_"):
            return True
        cost = CUST_COST.get(target_model, 1)
        if _cust(k, charge=True, cost=cost):
            return True
        self._reply(402, json.dumps({"error": f"saldo de tokens insuficiente para {target_model} (custa {cost}) — recarregue em beansmed.com.br"}).encode())
        return False

    def do_GET(self):
        p = self.path.split("?")[0]
        if not self._authed(): return self._reply(401, b'{"error":"unauthorized"}')
        if p == "/api/version":
            return self._reply(200, json.dumps({"version": "0.6.9-beanstech-shim"}).encode())
        if p == "/api/tags":
            models = [{"name": k, "model": k, "size": 0, "digest": "", "modified_at": ""} for k in ROUTES]
            return self._reply(200, json.dumps({"models": models}).encode())
        if p == "/api/ps":
            return self._reply(200, json.dumps({"models": []}).encode())
        return self._reply(404, b'{"error":"route not exposed"}')

    def do_POST(self):
        p = self.path.split("?")[0]
        if not self._authed(): return self._reply(401, b'{"error":"unauthorized"}')
        if p not in ("/api/chat", "/api/generate"):
            return self._reply(404, b'{"error":"route not exposed"}')
        try:
            n = int(self.headers.get("Content-Length", "0") or 0)
        except ValueError:
            n = 0
        raw = self.rfile.read(n) if n else b"{}"
        try:
            req = json.loads(raw or b"{}")
        except Exception:
            return self._reply(400, b'{"error":"json invalido"}')
        host, port, target_model, keyname = resolve(req.get("model", ""))
        if not self._charge(target_model):  # débito de tokens (clientes bth_*, custo por camada)
            return
        stream = bool(req.get("stream", False))

        if p == "/api/chat":
            payload = {"model": target_model, "messages": req.get("messages", []),
                       "stream": stream, "options": req.get("options", {})}
            if "format" in req: payload["response_format"] = {"type": "json_object"} if req["format"] == "json" else {"type": "text"}
        else:  # /api/generate
            prompt = req.get("prompt", "")
            sysmsg = (req.get("system") or "").strip()
            content = (sysmsg + "\n" if sysmsg else "") + prompt
            payload = {"model": target_model, "messages": [{"role": "user", "content": content}],
                       "stream": stream, "options": req.get("options", {})}

        body = json.dumps(payload).encode()
        conn = http.client.HTTPConnection(host, port, timeout=600)
        try:
            headers = {"Authorization": f"Bearer {auth_for(keyname)}", "Content-Type": "application/json",
                       "Content-Length": str(len(body))}
            if stream: headers["Accept"] = "text/event-stream"
            conn.request("POST", "/v1/chat/completions", body=body, headers=headers)
            resp = conn.getresponse()
        except Exception as ex:
            return self._reply(502, json.dumps({"error": f"upstream: {type(ex).__name__}"}).encode())

        if not stream:
            data = resp.read()
            try:
                d = json.loads(data)
                content = d["choices"][0]["message"]["content"]
                usage = d.get("usage", {})
            except Exception:
                return self._reply(resp.status, data if data else b'{"error":"upstream"}')
            now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            if p == "/api/chat":
                out = {"model": req.get("model", target_model), "created_at": now,
                       "message": {"role": "assistant", "content": content}, "done": True,
                       "total_duration": 0, "eval_count": usage.get("completion_tokens", 0),
                       "prompt_eval_count": usage.get("prompt_tokens", 0)}
            else:
                out = {"model": req.get("model", target_model), "created_at": now,
                       "response": content, "done": True, "eval_count": usage.get("completion_tokens", 0)}
            return self._reply(200, json.dumps(out).encode())

        # streaming: SSE → JSON-lines Ollama
        self.send_response(200)
        self.send_header("Content-Type", "application/x-ndjson")
        self.send_header("Transfer-Encoding", "chunked")
        self.end_headers()
        model_name = req.get("model", target_model)
        now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        try:
            for line in resp:
                line = line.strip()
                if not line or not line.startswith(b"data:"): continue
                chunk = line[5:].strip()
                if chunk == b"[DONE]": break
                try: d = json.loads(chunk)
                except Exception: continue
                delta = d.get("choices", [{}])[0].get("delta", {})
                piece = delta.get("content", "")
                if not piece: continue
                field = "message" if p == "/api/chat" else "response"
                out = {"model": model_name, "created_at": now, "done": False, field: {"content": piece} if p == "/api/chat" else piece}
                data = (json.dumps(out) + "\n").encode()
                self.wfile.write(f"{len(data):X}\r\n".encode() + data + b"\r\n")
                self.wfile.flush()
            final = {"model": model_name, "created_at": now, "done": True}
            data = (json.dumps(final) + "\n").encode()
            self.wfile.write(f"{len(data):X}\r\n".encode() + data + b"\r\n")
            self.wfile.write(b"0\r\n\r\n")
            self.wfile.flush()
        except Exception:
            pass
        finally:
            conn.close()

    def log_message(self, fmt, *args):
        sys.stderr.write(f"[shim] {self.address_string()} {fmt % args}\n")

def load_tokens():
    # carrega exatamente os segredos que as ROUTES declaram (padrão /usr/local/etc/tokens/<NOME>)
    for name in sorted({r[3] for r in ROUTES.values()}):
        try:
            TOKENS[name] = open(f"/usr/local/etc/tokens/{name}").read().strip()
        except Exception:
            TOKENS[name] = ""

if __name__ == "__main__":
    load_tokens()
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    srv = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    srv.daemon_threads = True
    print(f"ollama-shim escutando :{port}", flush=True)
    srv.serve_forever()
