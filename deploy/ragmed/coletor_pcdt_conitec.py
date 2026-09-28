#!/usr/bin/env python3
"""ragmed.ai — coletor 1: PCDT (Protocolos Clínicos e Diretrizes Terapêuticas) / CONITEC.

Fonte oficial: https://www.gov.br/conitec/pt-br/protocolos-clinicos-e-diretrizes-terapeuticas.
⚠ Verificado 28/09/2026: o índice do CONITEC renderiza a lista por JS (0 links de PDF no
HTML server-side). Por isso o coletor aceita --seeds (arquivo com URLs de PDFs/páginas de
PCDT, uma por linha — mantida à mão ou sincronizada do mirror conitec-pcdt-downloader
coberto pelo collect_github.sh); o crawler serve para páginas que renderizam server-side.

Os PDFs são mantidos íntegros: a numeração de página do arquivo é o que sustenta a citação
"versão/página" no Evidence-BR.

uso: python3 coletor_pcdt_conitec.py [--max N] [--so-protocolos] [--seeds seeds-pcdt.txt]
"""
import argparse
import os
import re
import sys
import time

from ragmed_common import PAUSE_S, extrair_links, fetch, fetch_pdf_doc, fonte_dir

INDICE = "https://www.gov.br/conitec/pt-br/protocolos-clinicos-e-diretrizes-terapeuticas"
# gov.br pagina com ?bcpAntiCache e filtros; o índice completo usa paginação por query
PAGINAS = [INDICE] + [f"{INDICE}?page={n}" for n in range(2, 12)]
PADRAO_PDF = re.compile(r"\.pdf($|\?)", re.I)
FILTRA_RUIDO = re.compile(r"cartilha|manual-para-avaliacao|formulario|template", re.I)


def coletar_seeds(seeds, max_docs):
    baixados, pulados, erros = 0, 0, []
    with open(seeds, encoding="utf-8") as f:
        urls = [u.strip() for u in f if u.strip()]
    for url in urls[:max_docs]:
        titulo = url.rstrip("/").split("/")[-1]
        try:
            if PADRAO_PDF.search(url):
                path, novo = fetch_pdf_doc("pcdt-conitec", url, titulo)
            else:
                # página do protocolo: extrai o link do PDF dela
                html = fetch(url)
                pdfs = extrair_links(html, PADRAO_PDF, base_url=url)
                if not pdfs:
                    erros.append(f"{url[:90]}: nenhum PDF na página")
                    continue
                path, novo = fetch_pdf_doc("pcdt-conitec", pdfs[0][0], titulo)
            baixados += 1 if novo else 0
            pulados += 0 if novo else 1
            print(f"  {'novo' if novo else 'já tem'}: {path}")
            time.sleep(PAUSE_S)
        except (RuntimeError, ValueError) as e:
            erros.append(f"{url[:100]}: {e}")
    return baixados, pulados, erros


def coletar(max_docs, so_protocolos):
    d = fonte_dir("pcdt-conitec")
    baixados, pulados, erros = 0, 0, []
    vistos = set()
    for pagina in PAGINAS:
        if baixados >= max_docs:
            break
        try:
            html = fetch(pagina)
        except RuntimeError as e:
            erros.append(f"índice {pagina}: {e}")
            continue
        links = extrair_links(html, PADRAO_PDF, base_url=pagina)
        if not links and pagina != INDICE:
            break  # última página
        for url, titulo in links:
            if len(vistos) >= max_docs:
                break
            if url in vistos or FILTRA_RUIDO.search(url) or FILTRA_RUIDO.search(titulo):
                continue
            if so_protocolos and not re.search(r"pcdt|protocolo", url + " " + titulo, re.I):
                continue
            vistos.add(url)
            try:
                path, novo = fetch_pdf_doc("pcdt-conitec", url, titulo)
                if novo:
                    baixados += 1
                    print(f"  novo: {path}")
                else:
                    pulados += 1
                time.sleep(PAUSE_S)
            except (RuntimeError, ValueError) as e:
                erros.append(f"{url[:100]}: {e}")
    print(f"pcdt-conitec: {baixados} novos, {pulados} já presentes, {len(erros)} erros → {d}")
    for e in erros[:20]:
        print(f"  ERRO {e}")
    return 0 if baixados or pulados else (1 if erros else 0)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--max", type=int, default=1000)
    ap.add_argument("--so-protocolos", action="store_true")
    ap.add_argument("--seeds", default="", help="arquivo com URLs de PDFs/páginas de PCDT (uma por linha)")
    a = ap.parse_args()
    if a.seeds and os.path.exists(a.seeds):
        b, p, e = coletar_seeds(a.seeds, a.max)
        print(f"pcdt-conitec (seeds): {b} novos, {p} já presentes, {len(e)} erros")
        for x in e[:20]:
            print(f"  ERRO {x}")
        sys.exit(0 if b or p else 1)
    sys.exit(coletar(a.max, a.so_protocolos))
