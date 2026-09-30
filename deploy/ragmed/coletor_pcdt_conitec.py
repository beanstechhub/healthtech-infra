#!/usr/bin/env python3
"""ragmed.ai — coletor 1: PCDT (Protocolos Clínicos e Diretrizes Terapêuticas) / CONITEC.

Fonte oficial: https://www.gov.br/conitec/pt-br — o gov.br é Plone/Volto e expõe a
REST API server-side `++api++` (verificado 28/09/2026, sem necessidade de JS ou seeds):
  GET {site}/++api++/@querystring-search?query={...}   → lista itens (JSON)
  GET {item/@id convertido p/ ++api++}                  → metadados, campo file.download
O coletor lista todos os arquivos de PCDT e baixa os PDFs com manifest auditável.

uso: python3 coletor_pcdt_conitec.py [--max N] [--termo PCDT]
"""
import argparse
import json
import re
import sys
import time
import urllib.parse

from ragmed_common import PAUSE_S, fetch, fetch_pdf_doc, fonte_dir

SITE = "https://www.gov.br/conitec"
ALLOW = (".gov.br",)


def api_url(public_url):
    """URL pública Plone → endpoint ++api++ equivalente."""
    return public_url.replace(f"{SITE}/", f"{SITE}/++api++/").split("?")[0].rstrip("/")


def busca_arquivos(termo, b_size=100, max_paginas=40):
    """Pagina o @querystring-search até esgotar os arquivos do termo."""
    out = []
    for pag in range(max_paginas):
        query = {
            "b_size": b_size,
            "b_start": pag * b_size,
            "query": [
                {"i": "portal_type", "o": "plone.app.querystring.operation.selection.any", "v": ["File"]},
                {"i": "SearchableText", "o": "plone.app.querystring.operation.string.contains", "v": termo},
            ],
        }
        qs = urllib.parse.quote(json.dumps(query, separators=(",", ":")))
        url = f"{SITE}/++api++/@querystring-search?query={qs}"
        data = json.loads(fetch(url, allowlist=ALLOW))
        items = data.get("items", [])
        out.extend(items)
        if not items or len(out) >= data.get("items_total", 0):
            break
        time.sleep(PAUSE_S)
    return out


def coletar(max_docs, termo):
    d = fonte_dir("pcdt-conitec")
    baixados, pulados, erros = 0, 0, []
    itens = busca_arquivos(termo)
    print(f"pcdt-conitec: {len(itens)} arquivos no índice '{termo}'")
    for item in itens[:max_docs]:
        public_id = item.get("@id", "")
        titulo = item.get("title", "")
        if not re.search(r"\.pdf($|/)", public_id, re.I) and not re.search(r"\.pdf($| )", titulo, re.I):
            continue  # só PDFs
        try:
            meta = json.loads(fetch(api_url(public_id), allowlist=ALLOW))
            fileinfo = meta.get("file") or {}
            dl = fileinfo.get("download")
            if not dl:
                erros.append(f"sem file.download: {titulo[:60]}")
                continue
            path, novo = fetch_pdf_doc("pcdt-conitec", dl, titulo, allowlist=ALLOW)
            baixados += 1 if novo else 0
            pulados += 0 if novo else 1
            print(f"  {'novo' if novo else 'já tem'}: {titulo[:60]}")
            time.sleep(PAUSE_S)
        except (RuntimeError, ValueError, json.JSONDecodeError) as e:
            erros.append(f"{titulo[:60]}: {e}")
    print(f"pcdt-conitec: {baixados} novos, {pulados} já presentes, {len(erros)} erros → {d}")
    for e in erros[:20]:
        print(f"  ERRO {e}")
    return 0 if baixados or pulados else 1


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--max", type=int, default=1000)
    ap.add_argument("--termo", default="PCDT", help="termo de busca no índice (padrão: PCDT)")
    a = ap.parse_args()
    sys.exit(coletar(a.max, a.termo))
