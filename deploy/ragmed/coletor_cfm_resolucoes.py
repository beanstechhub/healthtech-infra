#!/usr/bin/env python3
"""ragmed.ai — coletor 3: Resoluções CFM (Conselho Federal de Medicina).

⚠ Verificado 28/09/2026: portal.cfm.org.br renderiza as listagens por JS e o
"Gerenciamento de Normas" (sistemas.cfm.org.br/normas) exige login. O coletor então
usa --seeds (arquivo com URLs dos PDFs oficiais das resoluções, uma por linha —
mantida à mão a partir do portal) e o crawler serve para páginas que renderizam
server-side. Baixa PDFs p/ RAGMED_RAW/cfm-resolucoes/ com manifest auditável.

uso: python3 coletor_cfm_resolucoes.py [--max N] [--seeds seeds-cfm.txt]
"""
import argparse
import os
import re
import sys
import time

from ragmed_common import PAUSE_S, extrair_links, fetch, fetch_pdf_doc, fonte_dir

SEMENTES = [
    "https://portal.cfm.org.br/",
]
ALLOW = (".gov.br", ".cfm.org.br")
PADRAO_PDF = re.compile(r"\.pdf($|\?)", re.I)
PADRAO_TEMA = re.compile(r"resolu[cç][aã]o|resolucoes", re.I)
PROFUNDIDADE_MAX = 2  # semente → página de listagem → PDF


def coletar_seeds(seeds, max_docs):
    baixados, pulados, erros = 0, 0, []
    with open(seeds, encoding="utf-8") as f:
        urls = [u.strip() for u in f if u.strip()]
    for url in urls[:max_docs]:
        titulo = url.rstrip("/").split("/")[-1]
        try:
            path, novo = fetch_pdf_doc("cfm-resolucoes", url, titulo, allowlist=ALLOW)
            baixados += 1 if novo else 0
            pulados += 0 if novo else 1
            print(f"  {'novo' if novo else 'já tem'}: {path}")
            time.sleep(PAUSE_S)
        except (RuntimeError, ValueError) as e:
            erros.append(f"{url[:100]}: {e}")
    return baixados, pulados, erros


def coletar(max_docs):
    d = fonte_dir("cfm-resolucoes")
    baixados, pulados, erros = 0, 0, []
    pdfs_vistos = {}
    paginas_vistas = set()

    def varre(url, prof):
        nonlocal baixados, pulados
        if url in paginas_vistas or prof > PROFUNDIDADE_MAX or baixados >= max_docs:
            return
        paginas_vistas.add(url)
        try:
            html = fetch(url, allowlist=ALLOW)
        except RuntimeError as e:
            erros.append(f"{url[:100]}: {e}")
            return
        for pdf_url, titulo in extrair_links(html, PADRAO_PDF, base_url=url):
            if baixados >= max_docs:
                return
            if pdf_url in pdfs_vistos:
                continue
            if not PADRAO_TEMA.search(pdf_url + " " + titulo):
                continue
            pdfs_vistos[pdf_url] = titulo
            try:
                path, novo = fetch_pdf_doc("cfm-resolucoes", pdf_url, titulo, allowlist=ALLOW)
                baixados += 1 if novo else 0
                pulados += 0 if novo else 1
                time.sleep(PAUSE_S)
            except (RuntimeError, ValueError) as e:
                erros.append(f"{pdf_url[:100]}: {e}")
        # desce em links internos que pareçam listagens de resoluções
        for sub, _ in extrair_links(html, PADRAO_TEMA, base_url=url):
            if sub not in paginas_vistas and not PADRAO_PDF.search(sub):
                varre(sub, prof + 1)
                if baixados >= max_docs:
                    return

    for semente in SEMENTES:
        varre(semente, 1)
        if baixados >= max_docs:
            break
    print(f"cfm-resolucoes: {baixados} novos, {pulados} já presentes, {len(erros)} erros → {d}")
    for e in erros[:20]:
        print(f"  ERRO {e}")
    return 0 if baixados or pulados else 1


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--max", type=int, default=500)
    ap.add_argument("--seeds", default="", help="arquivo com URLs de PDFs de resoluções (uma por linha)")
    a = ap.parse_args()
    if a.seeds and os.path.exists(a.seeds):
        b, p, e = coletar_seeds(a.seeds, a.max)
        print(f"cfm-resolucoes (seeds): {b} novos, {p} já presentes, {len(e)} erros")
        for x in e[:20]:
            print(f"  ERRO {x}")
        sys.exit(0 if b or p else 1)
    sys.exit(coletar(a.max))
