#!/usr/bin/env python3
"""ragmed.ai — coletor 2: Bulário ANVISA (dados abertos, bulk-first).

Fonte oficial verificada 28/09/2026: https://dados.anvisa.gov.br/dados/ (listing h5ai,
hrefs server-side). O acervo de bulas vive em /dados/CONSULTAS/:
  DOCUMENTOS/TA_CONSULTA_BULA_DOCUMENTO.CSV — catálogo dos documentos de bula (ID, tipo)
  DOCUMENTOS/TA_CONSULTA_BULA_PRODUTO.CSV   — vínculo produto ↔ bula
  PRODUTOS/TA_CONSULTA_MEDICAMENTOS.CSV     — catálogo de medicamentos (princípio ativo)
Os PDFs individuais das bulas ficam atrás do WAF do Bulário Eletrônico
(consultas.anvisa.gov.br respondeu 403 p/ cliente não-navegador em 28/09/2026) —
a coleta de PDF em massa NÃO é feita por aqui; o caminho é OCR/extração via parcerias
ou os repositórios-mirror já cobertos pelo collect_github.sh (aleckyann/bulario).

uso: python3 coletor_anvisa_bulas.py [--csv-adicionais arquivo.txt]
"""
import argparse
import os
import sys

from ragmed_common import PAUSE_S, extrair_links, fetch, fonte_dir, save
import re
import time

BASE = "https://dados.anvisa.gov.br/dados/CONSULTAS"
ALLOW = (".anvisa.gov.br", "dados.anvisa.gov.br")
CSV_ALVO = [
    (f"{BASE}/DOCUMENTOS/TA_CONSULTA_BULA_DOCUMENTO.CSV", "catálogo documentos de bula"),
    (f"{BASE}/DOCUMENTOS/TA_CONSULTA_BULA_PRODUTO.CSV", "vínculo produto-bula"),
    (f"{BASE}/PRODUTOS/TA_CONSULTA_MEDICAMENTOS.CSV", "catálogo medicamentos"),
    (f"{BASE}/DOCUMENTOS/TA_CONSULTA_PARECER_AVAL_MEDICAMENTOS.CSV", "pareceres de avaliação"),
]


def coletar(csv_adicionais):
    d = fonte_dir("anvisa-bulas")
    novos, erros = 0, []
    alvos = list(CSV_ALVO)
    if csv_adicionais and os.path.exists(csv_adicionais):
        with open(csv_adicionais, encoding="utf-8") as f:
            alvos += [(u.strip(), "csv adicional (lista manual)") for u in f if u.strip().startswith("http")]

    for url, titulo in alvos:
        nome = url.rstrip("/").split("/")[-1]
        try:
            data = fetch(url, allowlist=ALLOW, binary=True)
            path, novo = save("anvisa-bulas", nome, data, {"url": url, "titulo": titulo, "tipo": "catalogo-csv"})
            novos += 1 if novo else 0
            print(f"  ok: {nome} ({len(data)} bytes)")
        except (RuntimeError, ValueError) as e:
            erros.append(f"{nome}: {e}")
        time.sleep(PAUSE_S)

    # descoberta complementar: novos CSVs de bula que apareçam em /dados/
    try:
        html = fetch(f"{BASE}/DOCUMENTOS/", allowlist=ALLOW)
        for u, t in extrair_links(html, re.compile(r"BULA.*\.CSV", re.I), base_url=f"{BASE}/DOCUMENTOS/"):
            if any(u.endswith(a) for a in ("TA_CONSULTA_BULA_DOCUMENTO.CSV", "TA_CONSULTA_BULA_PRODUTO.CSV")):
                continue
            nome = u.rstrip("/").split("/")[-1]
            data = fetch(u, allowlist=ALLOW, binary=True)
            path, novo = save("anvisa-bulas", nome, data, {"url": u, "titulo": t, "tipo": "catalogo-csv"})
            novos += 1 if novo else 0
            print(f"  novo descoberto: {nome}")
            time.sleep(PAUSE_S)
    except RuntimeError as e:
        erros.append(f"descoberta: {e}")

    print(f"anvisa-bulas: {novos} novos, {len(erros)} erros → {d}")
    for e in erros[:20]:
        print(f"  ERRO {e}")
    return 0 if novos or not erros else 1


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv-adicionais", default="", help="arquivo com URLs .CSV adicionais, uma por linha")
    a = ap.parse_args()
    sys.exit(coletar(a.csv_adicionais))
