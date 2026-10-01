#!/usr/bin/env python3
"""ragmed.ai — ingest: ingestor de documentos oficiais → Elasticsearch (br-es).

Fecha o ciclo dos coletores: lê os PDFs/CSVs de RAGMED_RAW/<fonte>/, extrai texto
POR PÁGINA (PyMuPDF — a numeração de página sustenta a citação Evidence-BR),
fragmenta em chunks por seção e indexa em bulk no Elasticsearch do br-es.

O documento no índice `ragmed-docs` tem o formato que o build_pares_evidence_br.py
e a camada RAG dos portais esperam:
  {"chunk_id","doc_id","fonte","titulo","versao","pagina","url","texto"}

Auth: mesmo padrão do healthdash — RAGMED_ES_URL + RAGMED_ES_USER/PASSWORD (+ CA).
uso: python3 ingest.py [--fonte pcdt-conitec] [--indice ragmed-docs] [--dry-run]
"""
import argparse
import hashlib
import json
import os
import re
import sys

RAW = os.environ.get("RAGMED_RAW", "/data/ragmed/raw")
ES_URL = os.environ.get("RAGMED_ES_URL", "https://172.16.1.53:9200")
ES_USER = os.environ.get("RAGMED_ES_USER", "elastic")
ES_PASS = os.environ.get("RAGMED_ES_PASSWORD", "")
ES_CA = os.environ.get("RAGMED_ES_CA", "")
INDICE = "ragmed-docs"
CHUNK_CHARS = 1800   # ~450 tokens: doce p/ recuperação, inteiro p/ citação de página


def ler_manifest(fonte_dir):
    """url/titulo/sha por arquivo, a partir do manifest-ragmed.jsonl da fonte."""
    meta = {}
    mpath = os.path.join(fonte_dir, "manifest-ragmed.jsonl")
    if os.path.exists(mpath):
        with open(mpath, encoding="utf-8") as f:
            for l in f:
                if l.strip():
                    m = json.loads(l)
                    meta[m["arquivo"]] = m
    return meta


def pdf_para_paginas(path):
    """Lista de (num_pagina, texto) de um PDF via PyMuPDF."""
    import pymupdf  # PyMuPDF (import novo; 'fitz' está deprecado)
    doc = pymupdf.open(path)
    return [(i + 1, p.get_text("text")) for i, p in enumerate(doc)]


def dividir_chunk(texto, max_chars=CHUNK_CHARS):
    """Divide texto em chunks respeitando parágrafos/frases (não corta no meio)."""
    texto = re.sub(r"[ \t]+", " ", texto).strip()
    if not texto:
        return []
    paragrafos = re.split(r"\n\s*\n|\n(?=\d+\.\d|\d+\.|[A-ZÁÉÍÓÚ][a-z])", texto)
    chunks, atual = [], ""
    for p in paragrafos:
        p = p.strip()
        if not p:
            continue
        if len(atual) + len(p) + 1 <= max_chars:
            atual = (atual + "\n" + p).strip()
        else:
            if atual:
                chunks.append(atual)
            atual = p
    if atual:
        chunks.append(atual)
    return chunks


def gerar_docs(fonte, path, meta):
    """Gera os docs de chunk de um PDF oficial."""
    arquivo = os.path.basename(path)
    m = meta.get(arquivo, {})
    doc_id = re.sub(r"\.pdf$", "", arquivo, flags=re.I)
    titulo = m.get("titulo", doc_id)
    url = m.get("url", "")
    for num_pagina, texto in pdf_para_paginas(path):
        for i, chunk in enumerate(dividir_chunk(texto)):
            yield {
                "chunk_id": f"{doc_id}-p{num_pagina}-{i}",
                "doc_id": doc_id,
                "fonte": fonte,
                "titulo": titulo,
                "versao": m.get("coletado_em", "")[:10],
                "pagina": num_pagina,
                "url": url,
                "texto": chunk,
            }


def bulk_indexar(docs, indice, dry_run):
    """Indexa em bulk no ES (ou só imprime no dry-run)."""
    import httpx
    if dry_run:
        for i, d in enumerate(docs):
            if i < 2:
                print(json.dumps(d, ensure_ascii=False)[:200])
        print(f"[dry-run] {len(docs)} chunks prontos p/ '{indice}'")
        return len(docs)
    auth = httpx.BasicAuth(ES_USER, ES_PASS)
    verify = ES_CA if ES_CA and os.path.exists(ES_CA) else False
    body = ""
    for d in docs:
        body += json.dumps({"index": {"_index": indice, "_id": d["chunk_id"]}}) + "\n"
        body += json.dumps(d, ensure_ascii=False) + "\n"
    with httpx.Client(verify=verify, timeout=120) as c:
        r = c.post(f"{ES_URL}/_bulk", content=body,
                   headers={"Content-Type": "application/x-ndjson"}, auth=auth)
        r.raise_for_status()
        res = r.json()
        errs = [i for i in res.get("items", []) if i.get("index", {}).get("error")]
        print(f"bulk: {len(res.get('items', []))} docs, {len(errs)} erros")
        return len(res.get("items", []))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fonte", default="", help="só uma fonte (padrão: todas)")
    ap.add_argument("--indice", default=INDICE)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--batch", type=int, default=200)
    a = ap.parse_args()

    fontes = [a.fonte] if a.fonte else sorted(
        d for d in os.listdir(RAW) if os.path.isdir(os.path.join(RAW, d)))
    total_docs, total_chunks = 0, 0
    for fonte in fontes:
        fd = os.path.join(RAW, fonte)
        meta = ler_manifest(fd)
        pdfs = [f for f in os.listdir(fd) if f.lower().endswith(".pdf")]
        print(f"== {fonte}: {len(pdfs)} PDFs")
        lote = []
        for pdf in pdfs:
            path = os.path.join(fd, pdf)
            try:
                for doc in gerar_docs(fonte, path, meta):
                    lote.append(doc)
                    if len(lote) >= a.batch:
                        total_chunks += bulk_indexar(lote, a.indice, a.dry_run)
                        lote = []
                total_docs += 1
            except Exception as e:
                print(f"  ERRO {pdf}: {e}")
        if lote:
            total_chunks += bulk_indexar(lote, a.indice, a.dry_run)
    print(f"ingest: {total_docs} documentos → {total_chunks} chunks indexados em '{a.indice}'")


if __name__ == "__main__":
    main()
