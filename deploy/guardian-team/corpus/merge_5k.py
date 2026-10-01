#!/usr/bin/env python3
"""guardian-team — merge_5k: funde todas as fontes no dataset balanceado de ~5k.

Fontes combinadas (sem duplicar o que já está no dataset_guardian_ptbr.jsonl):
  - ataques já traduzidos      (dataset_guardian_ptbr.jsonl, label 1)
  - ataques novos (harmful/jbb)(/tmp/guardian-ptbr/ataques_*_ptbr.jsonl)
  - ataques ofuscados + red-team (ataques_ofuscados.jsonl — base64/homo/leet/espaçado)
  - negativos já presentes     (dataset_guardian_ptbr.jsonl, label 0)
  - negativos clínicos reais   (negativos_reais.jsonl — 2.500, o ativo exclusivo)

SPLIT SEM LEAKAGE: variantes de ofuscação herdam o source_id do ataque de origem.
O split é feito por GRUPO (source_id), não por item — assim base64(x) e espaçado(x)
caem sempre no MESMO lado. Sem isso, o eval mediria decoreba de variante, não detecção.

Rebalanceia 50/50 até o teto da classe menor, dedup por texto normalizado.

uso: python3 merge_5k.py
"""
import hashlib
import json
import os
import random
import re
import unicodedata

random.seed(7)  # reprodutibilidade do split (não é geração de segredo)
CORPUS = os.path.realpath(os.path.dirname(os.path.abspath(__file__)))
HARMFUL = "/tmp/guardian-ptbr/ataques_harmful_ptbr.jsonl"
JBB = "/tmp/guardian-ptbr/ataques_jbb_ptbr.jsonl"
OFUSCADOS = os.path.join(CORPUS, "ataques_ofuscados.jsonl")
NEG_REAIS = os.path.join(CORPUS, "negativos_reais.jsonl")
DATASET = os.path.join(CORPUS, "dataset_guardian_ptbr.jsonl")
EVAL = os.path.join(CORPUS, "eval_ptbr.jsonl")


def norm(s):
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", s).lower().strip()


def sid(texto):
    """source_id estável: variantes do mesmo ataque compartilham o grupo."""
    return hashlib.sha256(norm(texto).encode()).hexdigest()[:12]


def ler_jsonl(path):
    """Iteração por linha (NÃO splitlines: U+2028 do texto traduzido corromperia)."""
    out = []
    if not os.path.exists(path):
        return out
    with open(path, encoding="utf-8") as f:
        for linha in f:
            linha = linha.strip()
            if linha:
                try:
                    out.append(json.loads(linha))
                except json.JSONDecodeError:
                    pass
    return out


def escrever(path, registros):
    """Escrita segura contida em CORPUS (os.open + O_NOFOLLOW)."""
    real = os.path.realpath(path)
    if real != CORPUS and not real.startswith(CORPUS + os.sep):
        raise ValueError(f"destino fora de corpus/: {path}")
    flags = os.O_WRONLY | os.O_CREAT | os.O_TRUNC | os.O_NOFOLLOW
    fd = os.open(real, flags, 0o644)
    try:
        for r in registros:
            os.write(fd, (json.dumps(r, ensure_ascii=False) + "\n").encode("utf-8"))
    finally:
        os.close(fd)


def coletar():
    """Monta ataques e negativos com source_id de grupo em cada item."""
    ataques, negativos = [], []

    # 1) dataset atual (preserva ataques traduzidos antes + negativos seed/benignos)
    for r in ler_jsonl(DATASET):
        item = {"text": r["text"], "label": r["label"], "fonte": r.get("fonte", "?")}
        (ataques if r["label"] == 1 else negativos).append(item)

    # 2) ataques novos traduzidos hoje
    for r in ler_jsonl(HARMFUL) + ler_jsonl(JBB):
        ataques.append({"text": r["text"], "label": 1, "fonte": "harmful_ptbr"})

    # 3) ofuscados + red-team (já trazem source_id do gerador)
    for r in ler_jsonl(OFUSCADOS):
        ataques.append({"text": r["text"], "label": 1, "fonte": r.get("fonte", "ofuscado"),
                        "source_id": r.get("source_id")})

    # 4) negativos clínicos reais
    for r in ler_jsonl(NEG_REAIS):
        negativos.append({"text": r["text"], "label": 0, "fonte": "clinico_real"})

    # garante source_id em todos (os sem variante usam o próprio texto como grupo)
    for r in ataques + negativos:
        r.setdefault("source_id", sid(r["text"]))
    return ataques, negativos


def dedup(lista):
    vistos, unicos = set(), []
    for r in lista:
        k = norm(r["text"])
        if k and k not in vistos:
            vistos.add(k)
            unicos.append(r)
    return unicos


def split_por_grupo(itens, fracao_eval=0.15):
    """Divide por GRUPO (source_id): todas as variantes de um ataque vão pro mesmo lado."""
    grupos = {}
    for r in itens:
        grupos.setdefault(r["source_id"], []).append(r)
    chaves = list(grupos.keys())
    random.shuffle(chaves)
    n_eval = max(1, int(len(chaves) * fracao_eval))
    eval_keys = set(chaves[:n_eval])
    treino, aval = [], []
    for k in chaves:
        (aval if k in eval_keys else treino).extend(grupos[k])
    return treino, aval


def main():
    ataques, negativos = coletar()
    ataques, negativos = dedup(ataques), dedup(negativos)
    print(f"disponíveis: {len(ataques)} ataques · {len(negativos)} negativos")

    n = min(len(ataques), len(negativos))
    ataques = random.sample(ataques, n)
    negativos = random.sample(negativos, n)

    at_treino, at_aval = split_por_grupo(ataques)
    ng_treino, ng_aval = split_por_grupo(negativos)
    treino = at_treino + ng_treino
    aval = at_aval + ng_aval
    random.shuffle(treino)
    random.shuffle(aval)

    escrever(DATASET, treino)
    escrever(EVAL, aval)
    print(f"treino: {len(treino)} ({len(at_treino)} atq + {len(ng_treino)} neg) · "
          f"avaliação: {len(aval)} ({len(at_aval)} atq + {len(ng_aval)} neg)")
    print(f"TOTAL: {len(treino) + len(aval)} — balanceado no teto {n}/classe")
    if n < 2500:
        print(f"⚠ para 5.000 balanceado faltam {2500 - n} ataques")


if __name__ == "__main__":
    main()
