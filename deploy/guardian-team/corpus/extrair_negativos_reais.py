#!/usr/bin/env python3
"""guardian-team — extrai NEGATIVOS REAIS do acervo clínico BeansHealth.

O ativo que ninguém mais tem: as perguntas clínicas brasileiras reais (user turns dos
datasets DoDr/public-hf) são, por definição, exemplos LEGÍTIMOS (label 0). Cada uma
ensina o guardião a NÃO bloquear consulta clínica verdadeira — a precisão que separa
um guardião útil de um que bloqueia tudo.

Saída: negativos_reais.jsonl (junto a este script) no formato {text,label:0,fonte:"clinico_real"}.
Dedup por texto normalizado; filtra perguntas curtas demais ou em inglês.

uso: python3 extrair_negativos_reais.py [--max 2500]
"""
import argparse
import json
import os
import re
import unicodedata

# diretório deste script = corpus/ ; acervo clínico fica na raiz do repositório
CORPUS_DIR = os.path.realpath(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.realpath(os.path.join(CORPUS_DIR, "..", "..", ".."))  # raiz healthtech
OUT_NOME = "negativos_reais.jsonl"

# acervo clínico local (perguntas user reais), relativo à raiz do repo
DATASETS = [
    "beanshealth/datasets/final/robust/models",
    "beanshealth/datasets/final/robust/categories",
    "beanshealth/datasets/public-hf",
]

# pergunta clínica legítima: tem termo médico e é PT-BR
PT_BR = re.compile(r"[àáâãéêíóôõúüç]", re.I)
CLINICO = re.compile(
    r"paciente|sintoma|diagnóstic|tratament|dose|medica|exame|laborat|clínic|press[ãa]o|"
    r"febre|dor|sangr|insufici|hiperten|diabet|card[íi]ac|renal|hep[áa]tic|pulmon|"
    r"neurol|oncolog|pediatr|geriatr|gesta|parto|cirurg|antibi|cortic|analg[ée]s", re.I)
EN_ONLY = re.compile(r"^[a-z0-9\s\.,;:'\"()\-\?\!]+$", re.I)


def norm(s):
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", s).lower().strip()


def dentro_de(path, base):
    """Garante que path resolve dentro de base (bloqueia ../)."""
    real = os.path.realpath(path)
    return real == base or real.startswith(base + os.sep)


def user_turns(caminho):
    """Extrai os conteúdos 'user' de cada linha JSONL de uma árvore do acervo."""
    if not dentro_de(caminho, BASE):
        return
    for raiz, _, arquivos in os.walk(caminho):
        for nome in arquivos:
            if not nome.endswith(".jsonl"):
                continue
            path = os.path.join(raiz, nome)
            if not dentro_de(path, BASE):
                continue
            with open(path, encoding="utf-8") as f:
                for linha in f:
                    if not linha.strip():
                        continue
                    try:
                        d = json.loads(linha)
                    except json.JSONDecodeError:
                        continue
                    for m in d.get("messages", []):
                        if m.get("role") == "user":
                            yield m.get("content", "").strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--max", type=int, default=2500)
    a = ap.parse_args()

    vistos, saida = set(), []
    for ds in DATASETS:
        raiz = os.path.join(BASE, ds)
        if not os.path.isdir(raiz):
            continue
        for texto in user_turns(raiz):
            if len(saida) >= a.max:
                break
            if not texto or len(texto) < 40 or len(texto) > 600:
                continue
            if EN_ONLY.match(texto) and not PT_BR.search(texto):
                continue  # descarta perguntas só em inglês
            if not CLINICO.search(texto):
                continue  # precisa parecer consulta clínica
            chave = norm(texto)
            if chave in vistos:
                continue
            vistos.add(chave)
            saida.append({"text": texto, "label": 0, "fonte": "clinico_real"})

    destino = os.path.join(CORPUS_DIR, OUT_NOME)
    if not dentro_de(destino, CORPUS_DIR):
        raise ValueError("destino fora do corpus/")
    flags = os.O_WRONLY | os.O_CREAT | os.O_TRUNC | os.O_NOFOLLOW
    fd = os.open(destino, flags, 0o644)
    try:
        for s in saida:
            os.write(fd, (json.dumps(s, ensure_ascii=False) + "\n").encode("utf-8"))
    finally:
        os.close(fd)
    print(f"negativos reais: {len(saida)} extraídos → {destino}")


if __name__ == "__main__":
    main()
