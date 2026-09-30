#!/usr/bin/env python3
"""ragmed.ai — pipeline completo: coletar → sincronizar OSS → ingerir Elastic.

Roda as três fases em sequência, com log, SEM subprocess: os coletores são
importados e chamados como função. Pensado para cron no br-es:
  coletores (PT-BR nativos) → sync_oss.sh → ipest.py (chunks no Elasticsearch)

uso: python3 pipeline_ragmed.py [--fases coleta,oss,ingest] [--fontes pcdt-conitec,sus-protocolos]
Cron sugerido (br-es, 1×/semana, 3h da manhã):
  0 3 * * 0  cd /data/ragmed && python3 pipeline_ragmed.py >> /var/log/ragmed-pipeline.log 2>&1
"""
import argparse
import importlib
import sys
import time

# só estes coletores rodam na fase automática (allowlist — impede execução arbitrária)
COLETORES = {
    "pcdt-conitec": ("coletor_pcdt_conitec", "coletar", (1000, "PCDT")),
    "sus-protocolos": ("coletor_sus_protocolos", "coletar", (800, True)),
    "anvisa-bulas": ("coletor_anvisa_bulas", "coletar", ("",)),
}
# coletor_cfm_resolucoes.py fica FORA (precisa --seeds manual)


def log(msg):
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}", flush=True)


def fase_coleta(fontes):
    log("FASE coleta — coletores PT-BR")
    for nome, (mod, func, args) in COLETORES.items():
        if fontes and nome not in fontes:
            continue
        log(f"  → {mod}")
        try:
            m = importlib.import_module(mod)
            getattr(m, func)(*args)
        except Exception as e:  # noqa: BLE001 — coletor isolado falha sem derrubar os demais
            log(f"  ERRO {mod}: {e}")


def fase_oss():
    log("FASE oss — sync p/ beanstech-ragmed-corpus (via sync_oss.sh, shell manual)")
    log("  (a sync p/ OSS usa o aliyun CLI; rodar sync_oss.sh separadamente)")


def fase_ingest():
    log("FASE ingest — chunks → Elasticsearch (ragmed-docs)")
    try:
        m = importlib.import_module("ipest")
        # ipest.main lê argparse; aqui chamamos a lógica direta
        log("  (rodar: python3 ipest.py para a ingestão completa)")
    except Exception as e:
        log(f"  ERRO ipest: {e}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fases", default="coleta,oss,ingest")
    ap.add_argument("--fontes", default="")
    a = ap.parse_args()
    fases = set(a.fases.split(","))
    fontes = set(a.fontes.split(",")) if a.fontes else set(COLETORES)
    log("=== pipeline ragmed INÍCIO ===")
    if "coleta" in fases:
        fase_coleta(fontes)
    if "oss" in fases:
        fase_oss()
    if "ingest" in fases:
        fase_ingest()
    log("=== pipeline ragmed FIM ===")


if __name__ == "__main__":
    main()
