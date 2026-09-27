"""health.beanstech.com.br — painel de acompanhamento da plataforma BeansTech Health.
Sonda tudo que importa a cada 60 s (HTTP, latência, GPUs via vLLM/Ollama, Elastic, Postgres, medpubr, Keycloak, Directus)
e mostra numa página única. Segredos vêm do env renderizado pelo kms-env. Só leitura.
"""
from __future__ import annotations
import asyncio, os, time, json
from datetime import datetime, timezone
import httpx
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse

E = os.environ
SITES = ["dodr.ai", "app.dodr.ai", "beanshealth.com.br", "exame.tech", "prontuario.tech", "drogaria.tech", "drhealth.tech", "portaldodentista.ai", "petiq.tech", "id.beanstech.com.br", "cms.beanstech.com.br", "chat.beanstech.ai"]
DECISAO = ["beanshealth.com.br", "dodr.ai", "drogaria.tech", "exame.tech", "prontuario.tech", "petiq.tech", "drhealth.tech", "portaldodentista.ai"]
ELITE = "http://47.85.187.149"   # gn9gc-4x Blackwell (medgemma-27b, lingshu-32b, antangelmed)
FLASH = "http://47.85.207.155"   # gn9gc-8x Blackwell (glm-5.3-flash, granite, guardian, medgemma-4b, lingshu-i, baichuan-m2, theia)
STATE: dict = {"at": None, "checks": []}

async def probe(client, name, group, url, ok=(200,), headers=None, extract=None):
    t = time.perf_counter()
    try:
        r = await client.get(url, headers=headers or {}, timeout=12)
        ms = int((time.perf_counter() - t) * 1000)
        detail = ""
        if extract:
            try: detail = extract(r)
            except Exception as ex: detail = f"?{ex}"
        return {"name": name, "group": group, "ok": r.status_code in ok, "code": r.status_code, "ms": ms, "detail": detail}
    except Exception as ex:
        return {"name": name, "group": group, "ok": False, "code": 0, "ms": int((time.perf_counter() - t) * 1000), "detail": type(ex).__name__}

def ollama_ps(r):
    ms = r.json().get("models", [])
    return ", ".join(f"{m['name'].split(':')[0]} {round(m.get('size_vram',0)/1e9,1)}G" for m in ms) or "nenhum residente"

async def refresh():
    async with httpx.AsyncClient(verify=False, follow_redirects=False) as c:
        tasks = []
        for s in SITES: tasks.append(probe(c, s, "Portais", f"https://{s}/", ok=(200, 301, 302, 307, 308)))
        for s in DECISAO: tasks.append(probe(c, f"{s}/decisao", "Apoio à decisão", f"https://{s}/decisao"))
        tok1 = E.get("GPU_API_KEY", ""); tok2 = E.get("GPU2_API_KEY", ""); tok3 = E.get("EXCELLENCE_API_KEY", ""); tok4 = E.get("FLASH_API_KEY", ""); tok5 = E.get("ANTMED_API_KEY", "")
        # elite-va (gn9gc-4x Blackwell)
        tasks.append(probe(c, "elite-va · medgemma-27b :8001", "GPUs", f"{ELITE}:8001/v1/models", headers={"Authorization": f"Bearer {tok1}"}, extract=lambda r: ", ".join(m["id"] for m in r.json()["data"])))
        tasks.append(probe(c, "elite-va · lingshu-32b :8002", "GPUs", f"{ELITE}:8002/v1/models", headers={"Authorization": f"Bearer {tok2}"}, extract=lambda r: ", ".join(m["id"] for m in r.json()["data"])))
        tasks.append(probe(c, "elite-va · antangelmed :8000 (TP=2)", "GPUs", f"{ELITE}:8000/v1/models", headers={"Authorization": f"Bearer {tok5}"}, extract=lambda r: ", ".join(m["id"] for m in r.json()["data"])))
        # flash-va (gn9gc-8x Blackwell)
        tasks.append(probe(c, "flash-va · glm-5.3-flash :8001 (TP=8)", "GPUs", f"{FLASH}:8001/v1/models", headers={"Authorization": f"Bearer {tok4}"}, extract=lambda r: ", ".join(m["id"] for m in r.json()["data"])))
        tasks.append(probe(c, "flash-va · granite-4.1 :8002", "GPUs", f"{FLASH}:8002/v1/models", headers={"Authorization": f"Bearer {tok1}"}, extract=lambda r: ", ".join(m["id"] for m in r.json()["data"])))
        tasks.append(probe(c, "flash-va · granite-guardian :8003", "GPUs", f"{FLASH}:8003/v1/models", headers={"Authorization": f"Bearer {tok1}"}, extract=lambda r: ", ".join(m["id"] for m in r.json()["data"])))
        tasks.append(probe(c, "flash-va · medgemma-4b :8004", "GPUs", f"{FLASH}:8004/v1/models", headers={"Authorization": f"Bearer {tok1}"}, extract=lambda r: ", ".join(m["id"] for m in r.json()["data"])))
        tasks.append(probe(c, "flash-va · lingshu-i-8b :8005", "GPUs", f"{FLASH}:8005/v1/models", headers={"Authorization": f"Bearer {tok2}"}, extract=lambda r: ", ".join(m["id"] for m in r.json()["data"])))
        tasks.append(probe(c, "flash-va · baichuan-m2 :8006", "GPUs", f"{FLASH}:8006/v1/models", headers={"Authorization": f"Bearer {tok2}"}, extract=lambda r: ", ".join(m["id"] for m in r.json()["data"])))
        tasks.append(probe(c, "flash-va · theia :8007", "GPUs", f"{FLASH}:8007/v1/models", headers={"Authorization": f"Bearer {tok4}"}, extract=lambda r: ", ".join(m["id"] for m in r.json()["data"])))
        tasks.append(probe(c, "flash-va · hunyuan-ocr :8008", "GPUs", f"{FLASH}:8008/v1/models", headers={"Authorization": f"Bearer {tok4}"}, extract=lambda r: ", ".join(m["id"] for m in r.json()["data"])))
        tasks.append(probe(c, "flash-va · qwen3-embedding :8010", "GPUs", f"{FLASH}:8010/v1/models", headers={"Authorization": f"Bearer {tok4}"}, extract=lambda r: ", ".join(m["id"] for m in r.json()["data"])))
        # serviços multimídia (sem contrato OpenAI — sonda TCP/HTTP crua)
        tasks.append(probe(c, "flash-va · hunyuan3d :8009 (3D)", "GPUs", f"{FLASH}:8009/", ok=(200, 400, 404, 405)))
        tasks.append(probe(c, "flash-va · compliance deepfake :8011", "GPUs", f"{FLASH}:8011/health", ok=(200, 404)))
        # hy4-sz (Shenzhen) — Hy4-preview 780B Q4_K_M via llama.cpp
        if E.get("HY4_SZ_URL"):
            tasks.append(probe(c, "hy4-sz · Hy4-preview 780B (llama.cpp)", "GPUs", f"{E['HY4_SZ_URL']}/v1/models", headers={"Authorization": f"Bearer {E.get('HY4_API_KEY','')}"}, extract=lambda r: ", ".join(m["id"] for m in r.json()["data"])))
        tasks.append(probe(c, "m3-va · baichuan-m3 (Virgínia)", "GPUs", f"{E.get('EXCELLENCE_BASE_URL','')}/models", headers={"Authorization": f"Bearer {tok3}"}, extract=lambda r: ", ".join(m["id"] for m in r.json()["data"])))
        tasks.append(probe(c, "Model Studio · qwen", "GPUs", f"{E.get('QWEN_BASE_URL','')}/models", headers={"Authorization": f"Bearer {E.get('QWEN_API_KEY','')}"}, extract=lambda r: f"{len(r.json().get('data',[]))} modelos"))
        tasks.append(probe(c, "medpubr (CPU BR)", "Brasil", f"{E.get('MEDPUBR_URL','')}/health", extract=lambda r: ", ".join(k for k, v in r.json()["models"].items() if v)))
        es_auth = httpx.BasicAuth(E.get("RAGMED_ES_USER", "elastic"), E.get("RAGMED_ES_PASSWORD", ""))
        async def es():
            t = time.perf_counter()
            try:
                r = await c.get(f"{E.get('RAGMED_ES_URL','')}/_cluster/health", auth=es_auth, timeout=10); j = r.json()
                return {"name": "Elasticsearch br-es", "group": "Brasil", "ok": j.get("status") in ("green", "yellow"), "code": r.status_code, "ms": int((time.perf_counter()-t)*1000), "detail": f"{j.get('status')} · {j.get('number_of_nodes')} nó · {j.get('active_primary_shards')} shards"}
            except Exception as ex: return {"name": "Elasticsearch br-es", "group": "Brasil", "ok": False, "code": 0, "ms": 0, "detail": type(ex).__name__}
        tasks.append(es())
        tasks.append(probe(c, "BeansTech ID (OIDC discovery)", "Brasil", "https://id.beanstech.com.br/realms/beanstech/.well-known/openid-configuration", extract=lambda r: r.json()["issuer"]))
        tasks.append(probe(c, "Directus CMS", "Brasil", "https://cms.beanstech.com.br/server/ping", ok=(200,), extract=lambda r: "pong · e-mail SMTP pendente (senha Direct Mail)"))
        res = await asyncio.gather(*tasks)
    # Postgres / PolarDB via TCP
    async def tcp(name, host, port):
        t = time.perf_counter()
        try:
            _, w = await asyncio.wait_for(asyncio.open_connection(host, port), 5); w.close()
            return {"name": name, "group": "Brasil", "ok": True, "code": 200, "ms": int((time.perf_counter()-t)*1000), "detail": f"{host}:{port}"}
        except Exception as ex: return {"name": name, "group": "Brasil", "ok": False, "code": 0, "ms": 0, "detail": type(ex).__name__}
    res += await asyncio.gather(tcp("PostgreSQL br-db", "172.16.1.52", 5432), tcp("PolarDB MySQL", "pc-0jxewaahd2vjs1w9p.rwlb.sa-east-1.rds.aliyuncs.com", 3306))
    STATE["checks"] = list(res); STATE["at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")

async def loop():
    while True:
        try: await refresh()
        except Exception: pass
        await asyncio.sleep(60)

app = FastAPI(title="health.beanstech")
@app.on_event("startup")
async def _s(): asyncio.create_task(loop())
@app.get("/api/status")
async def status(): return JSONResponse(STATE)
@app.get("/healthz")
async def hz(): return {"ok": True}

@app.get("/", response_class=HTMLResponse)
async def index():
    chk = STATE["checks"]; groups: dict[str, list] = {}
    for c in chk: groups.setdefault(c["group"], []).append(c)
    up = sum(1 for c in chk if c["ok"]); tot = len(chk)
    rows = ""
    for g in ["Apoio à decisão", "Portais", "GPUs", "Brasil"]:
        if g not in groups: continue
        rows += f'<h2>{g}</h2><table>'
        for c in groups[g]:
            dot = "🟢" if c["ok"] else "🔴"
            rows += f'<tr><td>{dot}</td><td><b>{c["name"]}</b></td><td>{c["code"] or "—"}</td><td>{c["ms"]} ms</td><td class=d>{c["detail"]}</td></tr>'
        rows += "</table>"
    return f"""<!doctype html><html lang=pt-br><meta charset=utf-8><meta http-equiv=refresh content=60><title>BeansTech Health — status</title>
<style>body{{font:15px/1.5 -apple-system,Segoe UI,Inter,Arial;background:#0b1512;color:#e8f0ee;margin:0;padding:28px}}h1{{margin:0 0 4px;font-size:26px}}h2{{color:#7fd1c1;font-size:15px;letter-spacing:.06em;text-transform:uppercase;margin:26px 0 8px}}table{{border-collapse:collapse;width:100%;max-width:1100px}}td{{padding:7px 10px;border-bottom:1px solid #1f2f2b;vertical-align:top}}td:first-child{{width:24px}}td:nth-child(3){{color:#8fa7a2;width:50px}}td:nth-child(4){{color:#8fa7a2;width:80px}}.d{{color:#a9bcb8;font-size:13px}}.sum{{color:#8fa7a2;margin-bottom:6px}}.big{{font-size:44px;font-weight:700;color:{'#7fd1c1' if up==tot else '#f2a65a'}}}a{{color:#7fd1c1}}</style>
<h1>BeansTech Health — status da plataforma</h1><div class=sum>atualizado {STATE['at'] or '…'} UTC · sonda a cada 60 s · <a href=/api/status>JSON</a></div>
<div class=big>{up}/{tot} <span style="font-size:16px;color:#8fa7a2;font-weight:400">serviços respondendo</span></div>{rows}
<p class=sum style="margin-top:30px">Documentação: healthtech-infra (GitHub) · Leads: <a href=https://cms.beanstech.com.br/admin/content/leads>cms.beanstech.com.br</a> · Login: <a href=https://id.beanstech.com.br/admin/>id.beanstech.com.br</a></p></html>"""
