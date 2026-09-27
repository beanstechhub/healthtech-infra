#!/usr/bin/env python3
"""Comparativo multi-modelo: 10 modelos × 50 casos com reasoning documentado.
Roda do br-apps. Para cada modelo × caso: envia, mede latência/tokens, avalia automaticamente.
Resultado: JSON + TSV + mapa de competências por domínio."""
import sys, json, time, os, subprocess, re, collections, concurrent.futures

OUT = os.path.realpath(sys.argv[1]) if len(sys.argv) > 1 else "/tmp/eval-comparativo"
# saída restrita a /tmp, /data ou $HOME — caminho de CLI não pode escapar
assert OUT.startswith((os.path.realpath("/tmp"), "/data", os.path.expanduser("~"))), "OUT deve ficar sob /tmp, /data ou $HOME"
CASES_FILE = "/tmp/eval/cases-200.json"
os.makedirs(OUT, exist_ok=True)
cases = json.load(open(CASES_FILE))

SYSTEM = "Você é um assistente médico. Responda em português, objetivo, estruturado em: Raciocínio clínico, Condutas a considerar, Verificar antes de decidir, O que não posso afirmar. Nunca invente dose; se não tiver certeza, diga confirmar em bula/protocolo. Máximo 350 palavras."

# --- endpoints ---
def get_env(k): return os.environ.get(k, "")

MODELS = {
    # OpenRouter (pagos por token)
    "gpt6-astra":    {"base": "https://openrouter.ai/api/v1", "key": get_env("OPENROUTER_API_KEY"), "model": "openai/gpt-6-astra", "source": "openrouter"},
    "claude-opus-5": {"base": "https://openrouter.ai/api/v1", "key": get_env("OPENROUTER_API_KEY"), "model": "anthropic/claude-opus-5", "source": "openrouter"},
    # Model Studio (cobertos pelo SP)
    "qwen38-max":    {"base": get_env("QWEN_BASE_URL"), "key": get_env("QWEN_API_KEY"), "model": "qwen3.8-max", "source": "modelstudio"},
    "kimi-k3":       {"base": get_env("QWEN_BASE_URL"), "key": get_env("QWEN_API_KEY"), "model": "kimi-k3", "source": "modelstudio"},
    "deepseek-v4pro":{"base": get_env("QWEN_BASE_URL"), "key": get_env("QWEN_API_KEY"), "model": "deepseek-v4-pro", "source": "modelstudio"},
    "glm-5.3":       {"base": get_env("QWEN_BASE_URL"), "key": get_env("QWEN_API_KEY"), "model": "glm-5.3", "source": "modelstudio"},
    # Nossas GPUs
    "baichuan-m3":   {"base": get_env("EXCELLENCE_BASE_URL"), "key": get_env("EXCELLENCE_API_KEY"), "model": "baichuan-m3", "source": "gpu-va"},
    "antangelmed":   {"base": "http://47.85.94.203:8000/v1", "key": get_env("ANTMED_API_KEY"), "model": "antangelmed", "source": "gpu-va"},
    "medgemma-27b":  {"base": "http://8.222.169.230:8001/v1", "key": get_env("OLLAMA_API_KEY"), "model": "medgemma-27b", "source": "gpu-sg"},
    "lingshu-32b":   {"base": "http://43.98.194.204:8001/v1", "key": get_env("GPU2_API_KEY"), "model": "lingshu-32b", "source": "gpu-sg"},
}

def call_model(name, cfg, case):
    msgs = [{"role": "system", "content": SYSTEM}, {"role": "user", "content": case["question"]}]
    body = json.dumps({"model": cfg["model"], "messages": msgs, "max_tokens": 2800, "temperature": 0.2})
    t0 = time.time()
    try:
        r = subprocess.run(["curl", "-s", "-m", "300", f"{cfg['base']}/chat/completions",
            "-H", f"Authorization: Bearer {cfg['key']}", "-H", "content-type: application/json", "-d", body],
            capture_output=True, text=True, timeout=310)
        j = json.loads(r.stdout) if r.stdout.strip() else {"error": "empty"}
        t = time.time() - t0
        if "choices" not in j:
            return {"model": name, "case_id": case["id"], "error": j.get("error", {}).get("message", str(j)[:100])[:100], "elapsed_s": round(t, 1), "content": "", "tok_s": 0}
        m = j["choices"][0]["message"]
        content = (m.get("content") or "").strip()
        reasoning = (m.get("reasoning_content") or m.get("reasoning") or "")[:800]
        u = j.get("usage", {})
        tok_s = round(u.get("completion_tokens", 0) / max(t, 0.1), 1) if u.get("completion_tokens") else 0
        return {"model": name, "case_id": case["id"], "content": content[:800], "reasoning": reasoning,
                "elapsed_s": round(t, 1), "tok_s": tok_s,
                "tokens_in": u.get("prompt_tokens", 0), "tokens_out": u.get("completion_tokens", 0),
                "provider": j.get("provider", cfg["source"])}
    except Exception as ex:
        return {"model": name, "case_id": case["id"], "error": str(ex)[:100], "elapsed_s": round(time.time() - t0, 1), "content": "", "tok_s": 0}

def auto_eval(result, case):
    content = result.get("content", "")
    if result.get("error") or not content:
        return {"coverage": 0, "format_ok": False, "abstained": False, "has_reasoning": bool(result.get("reasoning"))}
    claims = case.get("critical_claims", [])
    found = sum(1 for c in claims if c.lower() in content.lower())
    fmt = all(b in content for b in ["Raciocínio", "Condutas", "Verificar", "não posso"]) if case.get("task") not in ("guardrail",) else True
    abst = case.get("task") == "abstencao" and any(p in content.lower() for p in ["não posso", "não é possível", "confirmar"])
    return {"coverage": round(found / max(len(claims), 1), 2), "claims_found": found, "claims_total": len(claims),
            "format_ok": fmt, "abstained": abst, "has_reasoning": bool(result.get("reasoning"))}

def run_case(args):
    name, case = args
    cfg = MODELS[name]
    r = call_model(name, cfg, case)
    r.update(auto_eval(r, case))
    r["domain"] = case["domain"]; r["task"] = case["task"]
    return r

# --- execução com paralelismo (5 workers) ---
all_results = []
total = len(MODELS) * len(cases)
done = 0
print(f"Comparativo: {len(MODELS)} modelos × {len(cases)} casos = {total} avaliações")
print(f"Modelos: {', '.join(MODELS.keys())}\n")

tasks = [(name, case) for name in MODELS for case in cases]
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:
    for r in ex.map(run_case, tasks):
        all_results.append(r)
        done += 1
        st = "⚠" if r.get("error") else ("✓" if r.get("coverage", 0) >= 0.5 else "△")
        if done % 10 == 0:
            print(f"  {done}/{total} ({100*done//total}%) · último: {r['model']} {r['case_id']} cov={r.get('coverage',0)} {st}")

json.dump({"models": list(MODELS.keys()), "cases": len(cases), "results": all_results},
          open(f"{OUT}/results.json", "w"), ensure_ascii=False, indent=2)

# --- análise ---
print("\n" + "="*70)
print("MAPA DE COMPETÊNCIAS — 10 modelos × 50 casos")
print("="*70)
for name, cfg in MODELS.items():
    mr = [r for r in all_results if r["model"] == name]
    errors = sum(1 for r in mr if r.get("error"))
    ok = [r for r in mr if not r.get("error")]
    if not ok:
        print(f"\n{name:18} ❌ TODOS FALHARAM ({errors} erros)")
        continue
    cov = round(sum(r.get("coverage", 0) for r in ok) / len(ok), 2)
    fmt = sum(1 for r in ok if r.get("format_ok"))
    abst = sum(1 for r in ok if r.get("abstained"))
    avg_t = round(sum(r.get("elapsed_s", 0) for r in ok) / len(ok), 1)
    avg_tok = round(sum(r.get("tok_s", 0) for r in ok) / len(ok), 1)
    reasoning_pct = round(100 * sum(1 for r in ok if r.get("has_reasoning")) / len(ok))
    print(f"\n{name:18} ({cfg['source']:12}) coverage={cov} format={fmt}/{len(ok)} abst={abst} avg={avg_t}s {avg_tok}tok/s reasoning={reasoning_pct}% errors={errors}")
    for dom in sorted(set(r["domain"] for r in ok)):
        dr = [r for r in ok if r["domain"] == dom]
        dc = round(sum(r.get("coverage", 0) for r in dr) / max(len(dr), 1), 2)
        print(f"  {dom:16} coverage={dc} ({len(dr)} casos)")

# TSV
with open(f"{OUT}/results.tsv", "w") as f:
    f.write("model\tcase_id\tdomain\ttask\tcoverage\tformat_ok\tabstained\telapsed_s\ttok_s\treasoning\tprovider\tcontent_preview\n")
    for r in all_results:
        f.write(f"{r['model']}\t{r['case_id']}\t{r.get('domain','')}\t{r.get('task','')}\t{r.get('coverage',0)}\t{r.get('format_ok',False)}\t{r.get('abstained',False)}\t{r.get('elapsed_s',0)}\t{r.get('tok_s',0)}\t{r.get('has_reasoning',False)}\t{r.get('provider','')}\t{r.get('content','')[:100].replace(chr(9),' ')}\n")
print(f"\nResultado: {OUT}/results.json · {OUT}/results.tsv")
