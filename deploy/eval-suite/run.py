#!/usr/bin/env python3
"""Suite de avaliação — roteia casos para modelos e gera mapa de competências."""
import sys, json, time, os, subprocess, re, collections

OUT = os.path.realpath(sys.argv[1]); CASES_FILE = os.path.realpath(sys.argv[2]); SYSTEM = sys.argv[3]; MODELS = sys.argv[4:]
# saída e entrada ficam restritas a /tmp, /data ou $HOME — caminhos de CLI não podem escapar
_allowed = (os.path.realpath("/tmp"), "/data", os.path.expanduser("~"))
assert OUT.startswith(_allowed) and CASES_FILE.startswith(_allowed), "OUT/CASES_FILE devem ficar sob /tmp, /data ou $HOME"
cases = json.load(open(CASES_FILE))
results = []

def call_openai(base, token, model, msgs, timeout=300):
    t0 = time.time()
    body = json.dumps({"model": model, "messages": msgs, "max_tokens": 5000, "temperature": 0.2})
    r = subprocess.run(["curl","-s","-m",str(timeout),f"{base}/chat/completions",
        "-H",f"Authorization: Bearer {token}","-H","content-type: application/json","-d",body],
        capture_output=True, text=True, timeout=timeout+10)
    j = json.loads(r.stdout) if r.stdout.strip() else {"error": "empty response"}
    t = time.time() - t0
    msg = j.get("choices",[{}])[0].get("message",{})
    content = (msg.get("content") or "").strip()
    reasoning = msg.get("reasoning_content") or msg.get("reasoning") or ""
    u = j.get("usage",{})
    tok_s = round(u.get("completion_tokens",0)/max(t,0.1),1) if u.get("completion_tokens") else 0
    return {"content": content, "reasoning": reasoning[:500], "tok_s": tok_s, "elapsed_s": round(t,1),
            "tokens_in": u.get("prompt_tokens",0), "tokens_out": u.get("completion_tokens",0)}

def call_ollama(base, token, model, msgs, timeout=300):
    t0 = time.time()
    body = json.dumps({"model": model, "messages": msgs, "stream": False, "options": {"temperature": 0.2}})
    r = subprocess.run(["curl","-s","-m",str(timeout),f"{base}/api/chat",
        "-H",f"Authorization: Bearer {token}","-H","content-type: application/json","-d",body],
        capture_output=True, text=True, timeout=timeout+10)
    j = json.loads(r.stdout) if r.stdout.strip() else {"error": "empty response"}; t = time.time() - t0
    content = (j.get("message",{}).get("content") or "").strip()
    tok_s = round(j.get("eval_count",0)/max(t,0.1),1) if j.get("eval_count") else 0
    return {"content": content, "reasoning": "", "tok_s": tok_s, "elapsed_s": round(t,1),
            "tokens_in": j.get("prompt_eval_count",0), "tokens_out": j.get("eval_count",0)}

def run_model(model, case):
    env = os.environ
    msgs = [{"role":"system","content":SYSTEM},{"role":"user","content":case["question"]}]
    try:
        if model == "baichuan-m3":
            return call_openai(env["EXCELLENCE_BASE_URL"], env["EXCELLENCE_API_KEY"], "baichuan-m3", msgs)
        elif model == "antangelmed":
            return call_openai("http://47.85.94.203:8000/v1", env.get("ANTMED_API_KEY",""), "antangelmed", msgs)
        elif model == "baichuan-m2":
            return call_openai("http://43.98.194.204:8002/v1", env.get("GPU2_API_KEY",""), "baichuan-m2", msgs)
        elif model == "lingshu-32b":
            return call_openai("http://43.98.194.204:8001/v1", env.get("GPU2_API_KEY",""), "lingshu-32b", msgs)
        elif model == "qwen-plus":
            return call_openai(env["QWEN_BASE_URL"], env["QWEN_API_KEY"], "qwen-plus", msgs)
        elif model == "glm-5.3":
            return call_openai(env["QWEN_BASE_URL"], env["QWEN_API_KEY"], "glm-5.3", msgs, timeout=180)
        elif model == "medgemma:27b":
            return call_ollama(env["OLLAMA_BASE_URL"], env["OLLAMA_API_KEY"], "medgemma:27b", msgs)
        else: return {"error": f"unknown {model}"}
    except Exception as ex: return {"error": str(ex), "elapsed_s": 0, "tok_s": 0, "content": ""}

def auto_eval(result, case):
    content = result.get("content","")
    if result.get("error"): return {"claim_coverage":0, "error": result["error"]}
    claims = case.get("critical_claims",[])
    found = sum(1 for c in claims if c.lower() in content.lower())
    forb = [f for f in case.get("must_not_say",[]) if f.lower() in content.lower()]
    fmt = all(b in content for b in ["Raciocínio","Condutas","Verificar","não posso"]) if case.get("task") not in ("guardrail",) else True
    abst = case.get("task")=="abstencao" and any(p in content.lower() for p in ["não posso","não é possível","confirmar"])
    return {"claim_coverage": round(found/max(len(claims),1),2), "claims_found": found, "claims_total": len(claims),
            "forbidden_hits": forb, "format_ok": fmt, "abstained": abst,
            "tok_s": result.get("tok_s",0), "elapsed_s": result.get("elapsed_s",0)}

print(f"Suite: {len(cases)} casos × {len(MODELS)} modelos = {len(cases)*len(MODELS)} avaliações\n")
for case in cases:
    for model in MODELS:
        print(f"  {case['id']} [{case['domain']}/{case['task']}] → {model}...", end=" ", flush=True)
        r = run_model(model, case); ev = auto_eval(r, case)
        results.append({"case_id":case["id"],"domain":case["domain"],"task":case["task"],"model":model,
            "answer":r.get("content","")[:800],"tok_s":r.get("tok_s",0),"elapsed_s":r.get("elapsed_s",0),**ev})
        st = "⚠forbidden" if ev.get("forbidden_hits") else ("✓" if ev.get("claim_coverage",0)>=0.5 else "△")
        print(f"cov={ev.get('claim_coverage',0)} {r.get('tok_s',0)}tok/s {st}")
    print()

json.dump({"cases":len(cases),"models":MODELS,"results":results}, open(f"{OUT}/results.json","w"), ensure_ascii=False, indent=2)
with open(f"{OUT}/results.tsv","w") as f:
    f.write("case_id\tdomain\ttask\tmodel\tclaim_coverage\tclaims_found\tclaims_total\tforbidden\tformat_ok\tabstained\ttok_s\telapsed_s\n")
    for r in results:
        f.write(f"{r['case_id']}\t{r['domain']}\t{r['task']}\t{r['model']}\t{r.get('claim_coverage',0)}\t{r.get('claims_found',0)}\t{r.get('claims_total',0)}\t{','.join(r.get('forbidden_hits',[]))}\t{r.get('format_ok')}\t{r.get('abstained')}\t{r.get('tok_s',0)}\t{r.get('elapsed_s',0)}\n")

print("\n=== MAPA DE COMPETÊNCIAS ===")
for m in MODELS:
    mr = [r for r in results if r["model"]==m]
    cov = round(sum(r.get("claim_coverage",0) for r in mr)/max(len(mr),1),2)
    tok = round(sum(r.get("tok_s",0) for r in mr)/max(len(mr),1),1)
    fmt = sum(1 for r in mr if r.get("format_ok"))
    forb = sum(len(r.get("forbidden_hits",[])) for r in mr)
    abst = sum(1 for r in mr if r.get("abstained"))
    err = sum(1 for r in mr if r.get("error"))
    print(f"  {m:16} coverage={cov} format={fmt}/{len(mr)} tok/s={tok} forbidden={forb} abstained={abst} errors={err}")
    for dom in sorted(set(r["domain"] for r in mr)):
        dr=[r for r in mr if r["domain"]==dom]
        dc=round(sum(r.get("claim_coverage",0) for r in dr)/max(len(dr),1),2)
        print(f"    {dom:14} coverage={dc} ({len(dr)} casos)")
