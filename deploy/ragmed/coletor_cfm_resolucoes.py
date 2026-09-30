#!/usr/bin/env python3
"""ragmed.ai — coletor 3: Resoluções CFM (Conselho Federal de Medicina).

Status verificado 28/09/2026:
  - portal.cfm.org.br é WordPress; a listagem renderiza por JS e a REST API de
    conteúdo está restrita (Kadence Security 401) — só /wp-json/wp/v2/search funciona.
  - sistemas.cfm.org.br/normas/visualizar/... é um viewer PDF.js; o arquivo real em
    /normas/arquivos/... NÃO é servido por GET direto (timeout/bloqueio programático).
Conclusão honesta: não há fonte server-side automática do CFM. O coletor usa --seeds
(arquivo com URLs dos PDFs oficiais, uma por linha, mantida à mão a partir do portal).

uso: python3 coletor_cfm_resolucoes.py --seeds seeds-cfm.txt [--max N]
"""
import argparse
import os
import sys
import time

from ragmed_common import PAUSE_S, fetch_pdf_doc, fonte_dir

ALLOW = (".cfm.org.br", ".gov.br")


def coletar(seeds, max_docs):
    d = fonte_dir("cfm-resolucoes")
    baixados, pulados, erros = 0, 0, []
    with open(seeds, encoding="utf-8") as f:
        urls = [u.strip() for u in f if u.strip().startswith("http")]
    for url in urls[:max_docs]:
        titulo = url.rstrip("/").split("/")[-1]
        try:
            path, novo = fetch_pdf_doc("cfm-resolucoes", url, titulo, allowlist=ALLOW)
            baixados += 1 if novo else 0
            pulados += 0 if novo else 1
            print(f"  {'novo' if novo else 'já tem'}: {titulo}")
            time.sleep(PAUSE_S)
        except (RuntimeError, ValueError) as e:
            erros.append(f"{url[:100]}: {e}")
    print(f"cfm-resolucoes: {baixados} novos, {pulados} já presentes, {len(erros)} erros → {d}")
    for e in erros[:20]:
        print(f"  ERRO {e}")
    return 0 if baixados or pulados else 1


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--seeds", required=True, help="arquivo com URLs dos PDFs das resoluções (uma por linha)")
    ap.add_argument("--max", type=int, default=500)
    a = ap.parse_args()
    if not os.path.exists(a.seeds):
        sys.exit(f"arquivo de seeds não encontrado: {a.seeds}")
    sys.exit(coletar(a.seeds, a.max))
