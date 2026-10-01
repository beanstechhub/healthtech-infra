#!/bin/bash
# ragmed.ai — sync do corpus local para o OSS BR (beanstech-ragmed-corpus, sa-east-1, KMS)
# via RAM role da instância (EcsRamRole) — sem credenciais em disco.
# RAGMED_RAW permite sobrescrever a origem (padrão /data/ragmed/raw).
set -uo pipefail
export HOME=/root
RAW="${RAGMED_RAW:-/data/ragmed/raw}"
# flags longas: a forma curta combinada (-rf) e o -u curto falham nesta versão do CLI.
# trailing slash nos dois lados para sync recursivo de diretório.
aliyun oss cp "$RAW/" oss://beanstech-ragmed-corpus/raw/ \
  --recursive --force --update --region sa-east-1 2>&1 | tail -3
echo "sync: $(date -Is) — total local: $(du -sh "$RAW" 2>/dev/null | cut -f1)"
