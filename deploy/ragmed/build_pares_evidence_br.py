#!/usr/bin/env python3
"""ragmed.ai — build_pares_evidence_br: gera pares de instrução com citação OBRIGATÓRIA.

O que este script NÃO é: um gerador automático de treino pronto. Ele produz CANDIDATOS.
Cada par só entra no conjunto de treino com status "revisado" (revisado_por preenchido
por humano — médico ou revisor treinado). Isso é deliberado: pares 100% sintéticos
ensinam o modelo a FABRICAR citações, o exato defeito que o RAGMed existe para evitar.

Formato de entrada (chunks): JSONL com
  {"chunk_id", "doc_id", "fonte", "titulo", "versao", "pagina", "texto", "url"}

Formato de saída (pares): JSONL em STDOUT (redirecione p/ arquivo no shell):
  {"par_id", "pergunta", "trecho_original" (verbatim do chunk), "resposta",
   "citacao": {"doc_id", "fonte", "titulo", "versao", "pagina", "url"},
   "status": "candidato", "revisado_por": null, "reprovado_motivo": null}

Gate anti-fabricação: `trecho_original` DEVE aparecer verbatim (normalizado) no texto
do chunk; pares que falham são marcados reprovados e nunca vão para treino.

Arquivos de entrada são NOME DE ARQUIVO (sem caminho) buscados no diretório deste
script — path traversal não é permitido. Log de andamento vai para STDERR.

uso: python3 build_pares_evidence_br.py --chunks chunks.jsonl --perguntas perguntas.jsonl \
       > pares_candidatos.jsonl
Opcional: --gerar-perguntas usa a API de Model Studio (env DASHSCOPE_API_KEY, mesmo
contrato do coletor do guardião) para redigir as perguntas a partir dos chunks.
"""
import argparse
import hashlib
import json
import os
import re
import sys
import unicodedata

OUT_DIR = os.path.realpath(os.path.dirname(os.path.abspath(__file__)))
SAFE_NOME = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,200}$")


def normaliza(s):
    """minúsculas, sem acentos/esp. extras — comparação de citação verbatim."""
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"\s+", " ", s).lower().strip()
    return s


def validar_nome(nome):
    """Aceita apenas nome de arquivo simples (sem '/','\\','..')."""
    if not SAFE_NOME.match(nome) or ".." in nome:
        raise ValueError(f"nome de arquivo inseguro (use apenas nome, sem caminho): {nome!r}")
    return nome


def par_id(pergunta, citacao):
    h = hashlib.sha256(f"{pergunta}|{citacao}".encode()).hexdigest()[:16]
    return f"evbr-{h}"


def par_do_chunk(chunk, pergunta, resposta):
    cit = {
        "doc_id": chunk.get("doc_id", ""),
        "fonte": chunk.get("fonte", ""),
        "titulo": chunk.get("titulo", ""),
        "versao": chunk.get("versao", chunk.get("coletado_em", "")),
        "pagina": chunk.get("pagina", None),
        "url": chunk.get("url", ""),
    }
    trecho = chunk["texto"]
    gate = normaliza(trecho[:400]) in normaliza(chunk.get("texto_verbatim", trecho))
    return {
        "par_id": par_id(pergunta, json.dumps(cit, ensure_ascii=False)),
        "pergunta": pergunta,
        "trecho_original": trecho,
        "resposta": resposta,
        "citacao": cit,
        "status": "candidato" if gate else "reprovado",
        "reprovado_motivo": None if gate else "trecho_original não confere verbatim com a fonte",
        "revisado_por": None,
    }


def gerar_perguntas(chunks, max_pares):
    """Redige perguntas clínicas a partir dos chunks via Model Studio (opcional).
    Mesma stack do translate_ptbr.py do guardião: OpenAI SDK + BASE_URL fixo."""
    api_key = os.environ.get("DASHSCOPE_API_KEY")
    if not api_key:
        sys.exit("--gerar-perguntas requer DASHSCOPE_API_KEY no ambiente (KMS 3.0)")
    from openai import OpenAI
    client = OpenAI(
        api_key=api_key,
        base_url=os.environ.get("DASHSCOPE_BASE_URL", "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"),
    )
    modelo = os.environ.get("DASHSCOPE_MODEL", "qwen-plus")
    prompt = (
        "A partir do trecho clínico abaixo, escreva UMA pergunta que um profissional de saúde "
        "brasileiro faria e cuja resposta está contida no trecho. Responda apenas com a pergunta, em PT-BR.\n\n"
        "TRECHO:\n{texto}"
    )
    for i, chunk in enumerate(chunks):
        if i >= max_pares:
            break
        try:
            r = client.chat.completions.create(
                model=modelo,
                messages=[{"role": "user", "content": prompt.format(texto=chunk["texto"][:3000])}],
                temperature=0.3,
                max_tokens=120,
            )
            pergunta = r.choices[0].message.content.strip()
            yield chunk, pergunta
        except Exception as e:  # noqa: BLE001 — segue no próximo chunk, erro registrado no log
            print(f"  aviso: pergunta falhou no chunk {chunk.get('chunk_id')}: {e}", file=sys.stderr)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--chunks", required=True, help="nome do arquivo JSONL de chunks (junto a este script)")
    ap.add_argument("--perguntas", help="JSONL {chunk_id, pergunta} — se ausente, use --gerar-perguntas")
    ap.add_argument("--gerar-perguntas", action="store_true")
    ap.add_argument("--max", type=int, default=1000)
    a = ap.parse_args()

    chunks_nome = validar_nome(a.chunks)
    perguntas_nome = validar_nome(a.perguntas) if a.perguntas else None

    chunks = []
    with open(os.path.join(OUT_DIR, chunks_nome), encoding="utf-8") as f:
        for linha in f:
            if linha.strip():
                chunks.append(json.loads(linha))
    chunk_por_id = {c.get("chunk_id", c.get("doc_id")): c for c in chunks}

    pares = []
    if a.gerar_perguntas:
        for chunk, pergunta in gerar_perguntas(chunks, a.max):
            pares.append(par_do_chunk(chunk, pergunta, ""))
    elif perguntas_nome:
        with open(os.path.join(OUT_DIR, perguntas_nome), encoding="utf-8") as f:
            for linha in f:
                if not linha.strip():
                    continue
                p = json.loads(linha)
                chunk = chunk_por_id.get(p.get("chunk_id"))
                if chunk:
                    pares.append(par_do_chunk(chunk, p["pergunta"], p.get("resposta", "")))
    else:
        sys.exit("forneça --perguntas ou --gerar-perguntas (log em STDERR, pares em STDOUT)")

    for p in pares:
        sys.stdout.write(json.dumps(p, ensure_ascii=False) + "\n")

    ok = sum(1 for p in pares if p["status"] == "candidato")
    print(f"evidence-br: {len(pares)} pares ({ok} candidatos, {len(pares) - ok} reprovados pelo gate)",
          file=sys.stderr)


if __name__ == "__main__":
    main()
