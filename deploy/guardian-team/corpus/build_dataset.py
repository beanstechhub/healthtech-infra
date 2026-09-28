#!/usr/bin/env python3
"""Monta o dataset FINAL do guardião PT-BR (alvo ~5k), balanceado, a partir de:
  - ataques PT-BR traduzidos  (ataques_ptbr_full.jsonl — ~1915)
  - negativos reais clínicos   (eval-suite/cases.json + site-chatmed-test/cases.json)
  - negativos difíceis         (seed build_corpus + XSTest-style traduzido)
  - negativos de conversa      (ITW regular — pedidos benignos, amostra traduzida)
Saída: dataset_guardian_ptbr.jsonl  {text, label, fonte}
e um split de avaliação separado (eval_ptbr.jsonl) que nunca entra no treino.

uso: python3 build_dataset.py
"""
import json, pathlib, random, subprocess, csv

random.seed(7)   # reprodutibilidade do split (não é geração de segredo)
HERE = pathlib.Path(__file__).parent
ROOT = HERE.parent.parent.parent          # healthtech/
PTBR = pathlib.Path("/tmp/guardian-ptbr")
RAW = pathlib.Path("/tmp/guardian-raw")

def _ler_jsonl(p):
    """Lê JSONL linha a linha. NÃO usar read_text().splitlines(): splitlines() quebra também
    em separadores Unicode (U+2028 etc.) presentes no texto traduzido, corrompendo o JSON."""
    out = []
    with open(p, encoding="utf-8") as f:
        for line in f:                 # iteração de arquivo divide só em \\n
            line = line.strip()
            if line:
                try:
                    out.append(json.loads(line))
                except json.JSONDecodeError:
                    pass
    return out

def load_ataques():
    out = []
    for f in [PTBR/"ataques_ptbr_full.jsonl", PTBR/"ataques_ptbr.jsonl"]:
        if f.exists():
            out += _ler_jsonl(f)
    # dedup por texto
    seen, uniq = set(), []
    for r in out:
        t = r["text"].strip()
        if t and t not in seen:
            seen.add(t); uniq.append({"text": t, "label": 1, "fonte": "traduzido"})
    return uniq

def load_negativos_reais():
    out = []
    for p in [ROOT/"deploy/eval-suite/cases.json", ROOT/"deploy/site-chatmed-test/app/cases.json"]:
        if p.exists():
            d = json.loads(p.read_text())
            itens = d if isinstance(d, list) else d.get("cases", [])
            for c in itens:
                q = c.get("question") if isinstance(c, dict) else None
                if q and len(q) > 20:
                    out.append({"text": q, "label": 0, "fonte": "clinico_real"})
    return out

def load_benignos_traduzidos():
    """Negativos traduzidos do in-the-wild 'regular' (pedidos benignos reais)."""
    p = PTBR/"negativos_ptbr.jsonl"
    out = []
    if p.exists():
        for r in _ler_jsonl(p):
            out.append({"text": r["text"], "label": 0, "fonte": r.get("fonte", "benigno_real")})
    return out

def load_seed():
    p = HERE/"guardian_ptbr.jsonl"
    out = []
    if p.exists():
        for l in p.read_text().splitlines():
            if l.strip():
                r = json.loads(l)
                out.append({"text": r["text"], "label": r["label"], "fonte": "seed"})
    return out

def load_neg_dificeis_traduzidos():
    """Amostra dos regulares do ITW (pedidos benignos) — traduzidos já descartam; aqui reusa
    os negativos difíceis do seed. Placeholder para expansão futura."""
    return []

def main():
    ataques = load_ataques()
    neg = load_negativos_reais() + load_seed() + load_benignos_traduzidos()
    # dedup negativos
    seen, neg_u = set(), []
    for r in neg:
        if r["text"] not in seen:
            seen.add(r["text"]); neg_u.append(r)
    neg = neg_u

    print(f"ataques disponíveis: {len(ataques)} · negativos disponíveis: {len(neg)}")
    n = min(len(ataques), len(neg))
    ataques, neg = random.sample(ataques, n), random.sample(neg, n)

    # split: 15% de cada classe vai para avaliação (separado, nunca visto)
    cut = int(n * 0.85)
    treino = ataques[:cut] + neg[:cut]
    aval = ataques[cut:] + neg[cut:]
    random.shuffle(treino); random.shuffle(aval)

    (HERE/"dataset_guardian_ptbr.jsonl").write_text(
        "\n".join(json.dumps(r, ensure_ascii=False) for r in treino) + "\n")
    (HERE/"eval_ptbr.jsonl").write_text(
        "\n".join(json.dumps(r, ensure_ascii=False) for r in aval) + "\n")
    print(f"treino: {len(treino)} · avaliação: {len(aval)} → dataset_guardian_ptbr.jsonl / eval_ptbr.jsonl")

if __name__ == "__main__":
    main()
