#!/usr/bin/env python3
"""hy.beanstech.ai — API proxy para o Hy4-preview 780B em Shenzhen.
Traduz /api/chat (simple) → /completion no llama.cpp (que funciona com este modelo).
"""
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
import http.client, json, time, urllib.parse

HY4_HOST = "47.112.128.3"
HY4_PORT = 8001
HY4_KEY = "17dcJpIETTbXaO_Js-SBfkCIuCNAwISyyBmLmxy6W0gDXDEb"
PORT = 4075

class Handler(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/":
            # serve index.html
            with open("/srv/hycloud-chat/index.html", "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self._cors()
            self.end_headers()
            self.wfile.write(content)
        elif path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._cors()
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ok", "model": "Hy4-preview-780B-Q4_K_M"}).encode())
        else:
            self.send_response(404)
            self._cors()
            self.end_headers()

    def do_POST(self):
        path = self.path.split("?")[0]
        if path != "/api/chat":
            self.send_response(404)
            self._cors()
            self.end_headers()
            return

        n = int(self.headers.get("Content-Length", 0) or 0)
        body = self.rfile.read(n) if n else b"{}"
        try:
            req = json.loads(body)
        except:
            self.send_response(400)
            self._cors()
            self.end_headers()
            self.wfile.write(b'{"error":"json invalido"}')
            return

        message = req.get("message", req.get("prompt", ""))
        max_tokens = req.get("max_tokens", 500)
        if not message:
            self.send_response(400)
            self._cors()
            self.end_headers()
            self.wfile.write(b'{"error":"mensagem vazia"}')
            return

        t0 = time.time()
        # usa /completion (funciona sem o template chat que trava em reasoning)
        prompt = f"[INST] {message} [/INST]"
        payload = json.dumps({"prompt": prompt, "n_predict": max_tokens, "temperature": 0.7}).encode()

        conn = http.client.HTTPConnection(HY4_HOST, HY4_PORT, timeout=300)
        try:
            conn.request("POST", "/completion", body=payload,
                        headers={"Authorization": f"Bearer {HY4_KEY}",
                                 "Content-Type": "application/json"})
            resp = conn.getresponse()
            data = json.loads(resp.read())
        except Exception as e:
            self.send_response(502)
            self._cors()
            self.end_headers()
            self.wfile.write(json.dumps({"error": f"upstream: {e}"}).encode())
            return
        finally:
            conn.close()

        elapsed = time.time() - t0
        content = data.get("content", "")
        # remove o prompt se vier no content
        if content.startswith("[INST]"):
            content = content.split("[/INST]", 1)[-1].strip()

        out = {
            "response": content,
            "reasoning": None,
            "tokens": data.get("tokens_predicted", 0),
            "latency_ms": round(elapsed * 1000),
            "model": "Hy4-preview-780B-Q4_K_M",
            "host": "hy4-sz (Shenzhen)"
        }
        out_bytes = json.dumps(out, ensure_ascii=False).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(out_bytes)))
        self._cors()
        self.end_headers()
        self.wfile.write(out_bytes)

    def log_message(self, fmt, *args):
        pass

if __name__ == "__main__":
    srv = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    srv.daemon_threads = True
    print(f"hy.beanstech.ai API listening on :{PORT}")
    srv.serve_forever()
