#!/bin/bash
# ragmed.ai — sync do corpus local para o OSS BR (beanstech-ragmed-corpus, sa-east-1, KMS)
# via RAM role da instância (EcsRamRole) — sem credenciais em disco.
set -uo pipefail
export HOME=/root
aliyun oss cp -rf /data/ragmed/raw oss://beanstech-ragmed-corpus/raw --region sa-east-1 --update 2>&1 | tail -3
echo "sync: $(date -Is) — total local: $(du -sh /data/ragmed/raw 2>/dev/null | cut -f1)"
