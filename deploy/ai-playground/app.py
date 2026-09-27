"""beanstech.ai — AI Playground & Health Dashboard
Access code: 11088703 (header X-Access-Code)
Tests all models: Model Studio (169), GPU fleet (vLLM), medpubr, whisper
Shows: GPU status, model health, response quality, latency, tokens/s
"""
from __future__ import annotations
import asyncio, os, time, json, httpx
from datetime import datetime, timezone
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from typing import Optional

E = os.environ
ACCESS_CODE = "11088703"

# ─── Model registry ─────────────────────────────────────────────────────────
MODEL_STUDIO = {
    "base": E.get("QWEN_BASE_URL", ""),
    "key": E.get("QWEN_API_KEY", ""),
    "models": ["qwen-plus", "qwen-max", "qwen3.8-max", "qwen3.8-flash", "glm-5.3", "qwen3.5-omni-flash"],
    "label": "Model Studio (DashScope)",
    "region": "Singapore (API)",
}

ELITE = E.get("ELITE_URL", "http://47.85.187.149")      # gn9gc-4x · 4× L20N 72GB Blackwell
FLASH = E.get("FLASH_URL", "http://47.85.207.155")      # gn9gc-8x · 8× L20N 72GB Blackwell

GPU_FLEET = [
    # elite-va (4× L20N)
    {"name": "MedGemma-27B FP8", "port": 8001, "host": ELITE, "gpu": 0, "label": "elite-va GPU 0", "type": "vllm"},
    {"name": "Lingshu-32B FP8", "port": 8002, "host": ELITE, "gpu": 1, "label": "elite-va GPU 1", "type": "vllm"},
    {"name": "AntAngelMed-100B FP8", "port": 8000, "host": ELITE, "gpu": "2-3 (TP=2)", "label": "elite-va GPUs 2-3", "type": "vllm"},
    # flash-va (8× L20N)
    {"name": "GLM-5.3-Flash FP8", "port": 8001, "host": FLASH, "gpu": "0-7 (TP=8)", "label": "flash-va 8 GPUs", "type": "vllm"},
    {"name": "Granite-4.1-30B FP8", "port": 8002, "host": FLASH, "gpu": "4-7 (TP=4)", "label": "flash-va GPUs 4-7", "type": "vllm"},
    {"name": "Granite-Guardian-3.2", "port": 8003, "host": FLASH, "gpu": 0, "label": "flash-va GPU 0", "type": "vllm"},
    {"name": "MedGemma-1.5-4B FP8", "port": 8004, "host": FLASH, "gpu": 1, "label": "flash-va GPU 1", "type": "vllm"},
    {"name": "Lingshu-I-8B", "port": 8005, "host": FLASH, "gpu": "0-1 (TP=2)", "label": "flash-va GPUs 0-1", "type": "vllm"},
    {"name": "Baichuan-M2-32B INT4", "port": 8006, "host": FLASH, "gpu": "2-3 (TP=2)", "label": "flash-va GPUs 2-3", "type": "vllm"},
    {"name": "Theia (Web3/Compliance)", "port": 8007, "host": FLASH, "gpu": 4, "label": "flash-va GPU 4", "type": "vllm"},
    # m3-va (4× L20)
    {"name": "Baichuan-M3-235B INT4", "port": 8000, "host": E.get("M3_URL", "http://47.85.201.160"), "gpu": "0-3", "label": "m3-va Virginia", "type": "vllm"},
]

GPUS = [
    {"name": "elite-va (Blackwell 4× L20N)", "host": ELITE, "type": "4× L20N 72GB", "models": ["medgemma-27b", "lingshu-32b", "antangelmed"]},
    {"name": "flash-va (Blackwell 8× L20N)", "host": FLASH, "type": "8× L20N 72GB", "models": ["glm-5.3-flash", "granite-4.1", "granite-guardian", "medgemma-4b", "lingshu-i-8b", "baichuan-m2", "theia"]},
    {"name": "m3-va (4× L20, TP=4)", "host": E.get("M3_URL", "http://47.85.201.160"), "type": "4× L20 48GB", "models": ["baichuan-m3-235b"]},
]

STATE: dict = {"at": None, "models": [], "gpus": []}

# ─── Auth ───────────────────────────────────────────────────────────────────
async def check_auth(request: Request):
    code = request.headers.get("X-Access-Code", request.query_params.get("code", ""))
    if code != ACCESS_CODE:
        raise HTTPException(401, "Invalid access code")

# ─── Health probes ──────────────────────────────────────────────────────────
async def probe_model(client, model_id, base_url, api_key, model_type="openai"):
    t = time.perf_counter()
    try:
        if model_type == "openai":
            r = await client.get(f"{base_url}/v1/models" if "dashscope" not in base_url else f"{base_url}/models",
                                 headers={"Authorization": f"Bearer {api_key}"}, timeout=8)
        else:  # vllm
            r = await client.get(f"{base_url}/v1/models", timeout=8)
        ms = int((time.perf_counter() - t) * 1000)
        detail = ""
        if r.status_code == 200:
            try:
                d = r.json()
                ids = [m["id"] for m in d.get("data", [])[:3]]
                detail = ", ".join(ids)
            except: detail = "ok"
        return {"model": model_id, "ok": r.status_code == 200, "code": r.status_code, "ms": ms, "detail": detail}
    except Exception as ex:
        return {"model": model_id, "ok": False, "code": 0, "ms": int((time.perf_counter() - t) * 1000), "detail": type(ex).__name__}

async def probe_medpubr(client):
    t = time.perf_counter()
    try:
        r = await client.get(f'{E.get("MEDPUBR_URL", "http://172.16.0.21:8300")}/health', timeout=5)
        ms = int((time.perf_counter() - t) * 1000)
        d = r.json() if r.status_code == 200 else {}
        models = d.get('models', {})
        return {'model': 'medpubr (embed/rerank/PII)', 'ok': r.status_code == 200, 'code': r.status_code, 'ms': ms,
                'detail': ', '.join(k for k, v in models.items() if v)}
    except Exception as ex:
        return {'model': 'medpubr (embed/rerank/PII)', 'ok': False, 'code': 0, 'ms': 0, 'detail': type(ex).__name__}

def _token_for(g):
    n = g["name"].lower()
    if "glm-5.3-flash" in n or "theia" in n: return E.get("FLASH_TOKEN", "")
    if "m3-235b" in n: return E.get("M3_TOKEN", "")
    if "antangelmed" in n: return E.get("ANTMED_TOKEN", "")
    if "lingshu-32b" in n or "baichuan-m2" in n or "lingshu-i" in n: return E.get("GPU2_TOKEN", "")
    return E.get("GPU_TOKEN", "")

async def probe_gpu(client, gpu):
    try:
        r = await client.get(f"{gpu['host']}:9200/gpu-status" if False else f"{gpu['host']}/v1/models", timeout=5)
        return {**gpu, "status": "online" if r.status_code in (200, 401) else "unreachable", "code": r.status_code}
    except:
        return {**gpu, "status": "offline", "code": 0}

async def refresh():
    async with httpx.AsyncClient(verify=False, follow_redirects=False) as c:
        tasks = []
        # Model Studio
        for m in MODEL_STUDIO["models"]:
            tasks.append(probe_model(c, m, MODEL_STUDIO["base"], MODEL_STUDIO["key"]))
        # GPU fleet
        for g in GPU_FLEET:
            token = _token_for(g)
            tasks.append(probe_model(c, g["name"], f"{g['host']}:{g['port']}", token))
        # medpubr
        tasks.append(asyncio.ensure_future(probe_medpubr(c)))
        results = [r for r in await asyncio.gather(*tasks) if r is not None]
        gpus = await asyncio.gather(*[probe_gpu(c, g) for g in GPUS])
    STATE["models"] = list(results); STATE["gpus"] = list(gpus)
    STATE["at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")

async def loop():
    while True:
        try: await refresh()
        except Exception: pass
        await asyncio.sleep(60)

app = FastAPI(title="beanstech.ai — AI Playground")
@app.on_event("startup")
async def _s(): asyncio.create_task(loop())

@app.get("/api/status")
async def status(request: Request):
    await check_auth(request)
    return JSONResponse(STATE)

@app.post("/api/test")
async def test_model(request: Request):
    """Send a test prompt to a specific model."""
    await check_auth(request)
    body = await request.json()
    model = body.get("model", "")
    prompt = body.get("prompt", "Say hello in Portuguese.")
    t = time.perf_counter()
    try:
        if model in MODEL_STUDIO["models"]:
            r = await httpx.AsyncClient().post(
                f"{MODEL_STUDIO['base']}/chat/completions",
                headers={"Authorization": f"Bearer {MODEL_STUDIO['key']}", "content-type": "application/json"},
                json={"model": model, "messages": [{"role": "user", "content": prompt}], "max_tokens": 200, "temperature": 0.2},
                timeout=60)
        else:
            # Find in GPU fleet
            g = next((g for g in GPU_FLEET if g["name"] == model), None)
            if not g: return JSONResponse({"error": f"unknown model: {model}"}, status_code=400)
            token = _token_for(g)
            r = await httpx.AsyncClient().post(
                f"{g['host']}:{g['port']}/v1/chat/completions",
                headers={"Authorization": f"Bearer {token}", "content-type": "application/json"},
                json={"model": g["name"], "messages": [{"role": "user", "content": prompt}], "max_tokens": 200, "temperature": 0.2},
                timeout=120)
        elapsed = time.perf_counter() - t
        d = r.json()
        content = d.get("choices", [{}])[0].get("message", {}).get("content", "")
        usage = d.get("usage", {})
        return {"model": model, "response": content[:2000], "elapsed_s": round(elapsed, 1),
                "tokens_in": usage.get("prompt_tokens", 0), "tokens_out": usage.get("completion_tokens", 0),
                "tok_s": round(usage.get("completion_tokens", 0) / max(elapsed, 0.1), 1)}
    except Exception as ex:
        return JSONResponse({"error": str(ex), "elapsed_s": round(time.perf_counter() - t, 1)}, status_code=500)

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    code = request.query_params.get("code", "")
    if code != ACCESS_CODE:
        return HTMLResponse("""<html><body style="background:#0A1628;color:#B0C4D4;font:16px/1.6 Arial;display:flex;align-items:center;justify-content:center;height:100vh">
        <div style="text-align:center"><h2 style="color:#00B8A9">beanstech.ai</h2>
        <form method="GET"><input name="code" type="password" placeholder="Access code" style="padding:12px;font-size:18px;border-radius:8px;border:1px solid #1A2F2B;background:#0D2839;color:white">
        <button style="padding:12px 24px;font-size:18px;background:#00B8A9;color:#0A1628;border:none;border-radius:8px;cursor:pointer">Enter</button></form></div></body></html>""")
    return HTML_RESPONSE

HTML_RESPONSE = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>beanstech.ai — AI Playground</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font:14px/1.6 -apple-system,'Segoe UI',Arial;background:#0A1628;color:#B0C4D4;padding:20px}
h1{color:#00B8A9;font-size:1.6em;margin-bottom:4px}
h2{color:#D4A843;font-size:1.1em;margin:20px 0 10px;border-bottom:1px solid #1A2F2B;padding-bottom:6px}
.muted{color:#5A7A8A;font-size:.85em}
table{width:100%;border-collapse:collapse;margin:10px 0}
th{background:#0D2839;color:#00B8A9;padding:8px 10px;text-align:left;font-size:.8em}
td{padding:7px 10px;border-bottom:1px solid #1A2F2B}
.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px}
.on{background:#00C853}.off{background:#FF5252}.warn{background:#FFC107}
.test-btn{background:#0D2839;color:#00B8A9;border:1px solid #1A4A44;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:.8em}
.test-btn:hover{background:#1A3A35}
#chat{background:#0D2839;border:1px solid #1A4A44;border-radius:8px;padding:16px;margin:12px 0;min-height:100px}
#chat .model{color:#D4A843;font-weight:600;font-size:.9em;margin-bottom:8px}
#chat .response{white-space:pre-wrap;color:#E0E8EC;font-size:.92em}
#chat .meta{color:#5A7A8A;font-size:.75em;margin-top:12px;border-top:1px solid #1A2F2B;padding-top:8px}
select,input[type=text]{background:#0D2839;color:white;border:1px solid #1A4A44;padding:8px 12px;border-radius:4px;width:100%}
textarea{background:#0D2839;color:white;border:1px solid #1A4A44;padding:10px;border-radius:4px;width:100%;min-height:80px;font-family:inherit}
.refresh{float:right;color:#5A7A8A;font-size:.8em;cursor:pointer}
.gpu-card{background:#0D2839;border:1px solid #1A4A44;border-radius:8px;padding:12px;margin:6px 0;display:inline-block;width:calc(50% - 8px)}
.gpu-card .name{color:#D4A843;font-weight:600}
.gpu-card .type{color:#5A7A8A;font-size:.85em}
.gpu-card .models{color:#00B8A9;font-size:.8em;margin-top:4px}
</style>
</head>
<body>
<h1>🧪 beanstech.ai — AI Playground</h1>
<p class="muted">All models, one place · <span id="last-update">loading...</span> · <span class="refresh" onclick="location.reload()">↻ refresh</span></p>

<h2>🖥️ GPU Fleet Status</h2>
<div id="gpus"></div>

<h2>🤖 Model Health</h2>
<table id="models"><thead><tr><th>Status</th><th>Model</th><th>Source</th><th>Latency</th><th></th></tr></thead><tbody></tbody></table>

<h2>💬 Test Any Model</h2>
<div style="display:flex;gap:12px;margin:10px 0">
<select id="model-select" style="flex:1"></select>
</div>
<textarea id="prompt" placeholder="Type your test prompt here...">Diga olá em português e explique o que você é capaz de fazer em 2 frases.</textarea>
<br><br>
<button class="test-btn" style="font-size:1em;padding:10px 24px" onclick="testModel()">▶ Test Model</button>
<div id="chat"><p class="muted">Select a model and click Test to see responses here.</p></div>

<script>
const CODE = new URLSearchParams(location.search).get('code') || localStorage.getItem('ai_code');
if(CODE) localStorage.setItem('ai_code', CODE);

async function load() {
  const r = await fetch('/api/status?code=' + CODE);
  const d = await r.json();
  document.getElementById('last-update').textContent = 'updated ' + d.at;

  // GPUs
  let g = '';
  d.gpus.forEach(gpu => {
    g += `<div class="gpu-card"><span class="dot ${gpu.status==='online'?'on':'off'}"></span>
      <span class="name">${gpu.name}</span><br><span class="type">${gpu.type}</span>
      <div class="models">${gpu.models.join(' · ')}</div></div>`;
  });
  document.getElementById('gpus').innerHTML = g;

  // Models
  const tb = document.querySelector('#models tbody');
  tb.innerHTML = d.models.map(m => {
    const src = m.model.includes('qwen')||m.model.includes('glm') ? 'Model Studio' : m.model.includes('medpubr') ? 'CPU (BR)' : 'GPU Fleet';
    return `<tr><td><span class="dot ${m.ok?'on':'off'}"></span></td><td>${m.model}</td><td>${src}</td><td>${m.ms}ms</td>
    <td><button class="test-btn" onclick="selectModel('${m.model}')">test</button></td></tr>`;
  }).join('');

  // Model selector
  const sel = document.getElementById('model-select');
  sel.innerHTML = d.models.map(m => `<option value="${m.model}">${m.model} ${m.ok?'✓':'✗'}</option>`).join('');
}

function selectModel(m) { document.getElementById('model-select').value = m; document.getElementById('prompt').focus(); }

async function testModel() {
  const model = document.getElementById('model-select').value;
  const prompt = document.getElementById('prompt').value;
  const chat = document.getElementById('chat');
  chat.innerHTML = '<p class="muted">⏳ Testing ' + model + '...</p>';
  try {
    const r = await fetch('/api/test?code=' + CODE, {
      method: 'POST', headers: {'Content-Type': 'application/json', 'X-Access-Code': CODE},
      body: JSON.stringify({model, prompt})
    });
    const d = await r.json();
    if(d.error) { chat.innerHTML = `<p style="color:#FF5252">Error: ${d.error}</p>`; return; }
    chat.innerHTML = `<div class="model">🤖 ${d.model}</div><div class="response">${d.response}</div>
      <div class="meta">${d.elapsed_s}s · ${d.tokens_in} in / ${d.tokens_out} out · ${d.tok_s} tok/s</div>`;
  } catch(e) { chat.innerHTML = `<p style="color:#FF5252">Error: ${e.message}</p>`; }
}

load(); setInterval(load, 60000);
</script>
</body>
</html>"""
