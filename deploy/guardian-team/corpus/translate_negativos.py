#!/usr/bin/env python3
"""Traduz NEGATIVOS (pedidos benignos) do in-the-wild 'regular' para PT-BR — rótulo 0.

O 'regular' do TrustAIRLab in-the-wild são perguntas legítimas de usuários reais (13.735).
Traduzir uma amostra dá o contrapeso necessário ao corpus de ataques, com pedidos que às
vezes SÃO parecidos com ataque (negativos difíceis) — exatamente o que testa a precisão.

uso: python3 translate_negativos.py --max 1500 --workers 10
"""
import argparse, json, pathlib, subprocess, time
from openai import OpenAI

BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
SYS = ("You are a data annotator building a DATASET FOR A SAFETY CLASSIFIER. You receive a BENIGN "
       "user request (not an attack). TRANSLATE it to Brazilian Portuguese naturally, preserving "
       "meaning and tone. If the request contains no meaningful content (empty, gibberish, just a "
       "URL), respond exactly with: SKIP. Output ONLY the translation, nothing else.")
RAW = pathlib.Path("/tmp/guardian-raw")
OUT = pathlib.Path("/tmp/guardian-ptbr"); OUT.mkdir(exist_ok=True)

def api_key():
    v = subprocess.run(["aliyun", "kms", "GetSecretValue", "--region", "ap-southeast-1",
                        "--SecretName", "DASHSCOPE_API_KEY"], capture_output=True, text=True)
    return json.loads(v.stdout)["SecretData"]

def carregar():
    import pandas as pd
    d = pd.read_parquet(RAW / "itw-regular.parquet")
    return [x for x in d["prompt"].dropna().astype(str).tolist() if 20 < len(x) < 1200]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--max", type=int, default=1500)
    ap.add_argument("--workers", type=int, default=10)
    ap.add_argument("--sleep", type=float, default=0.2)
    ap.add_argument("--model", default="qwen-plus")
    a = ap.parse_args()
    from concurrent.futures import ThreadPoolExecutor, as_completed

    client = OpenAI(api_key=api_key(), base_url=BASE_URL, max_retries=3)
    itens = carregar()[:a.max]
    out = OUT / "negativos_ptbr.jsonl"
    print(f"traduzindo {len(itens)} negativos (benignos)…", flush=True)

    def um(i_src):
        i, src = i_src
        try:
            r = client.chat.completions.create(model=a.model, temperature=0.1, max_tokens=350,
                messages=[{"role": "system", "content": SYS},
                          {"role": "user", "content": src[:1500]}])
            tr = (r.choices[0].message.content or "").strip()
        except Exception:
            tr = ""
        return src, tr

    ok = 0
    with out.open("w") as f, ThreadPoolExecutor(max_workers=a.workers) as ex:
        futs = [ex.submit(um, (i, s)) for i, s in enumerate(itens, 1)]
        for k, fut in enumerate(as_completed(futs), 1):
            src, tr = fut.result()
            if tr and tr.upper() != "SKIP" and len(tr) > 8:
                f.write(json.dumps({"text": tr, "label": 0, "fonte": "benigno_real"},
                                   ensure_ascii=False) + "\n")
                f.flush(); ok += 1
            if k % 100 == 0:
                print(f"  {k}/{len(itens)} · ok={ok}", flush=True)
            time.sleep(a.sleep / a.workers)
    print(f"pronto: {ok}/{len(itens)} → {out}", flush=True)

if __name__ == "__main__":
    main()
