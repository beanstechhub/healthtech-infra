#!/usr/bin/env bash
# Instala/atualiza o serviço medpubr (modelos médicos CPU, Brasil) na ECS medpubr via Cloud Assistant.
# - reaproveita o venv /opt/medpubr (torch 2.14, transformers 5.17, sentence-transformers 6, FlagEmbedding já instalados)
# - substitui o stub api.py pela API real (deploy/medpubr/api.py), escuta em 0.0.0.0:8300 (VPC; SG restringe)
# - baixa BGE-M3 + bge-reranker-v2-m3 (+ NER PT-BR opcional) no primeiro start (~2,5 GB) para /opt/medpubr/models
set -euo pipefail
cd "$(dirname "$0")/.."; source ./env.sh
script=$(mktemp)
{
  echo '#!/bin/bash'; echo 'set -euo pipefail'
  echo "cat > /opt/medpubr/api.py <<'__PY__'"; cat medpubr/api.py; echo "__PY__"
  cat <<'EOF'
/opt/medpubr/bin/pip install -q --disable-pip-version-check "fastapi>=0.115" "uvicorn[standard]>=0.30" "pydantic>=2" 2>&1 | tail -1 || true
install -d -m 0755 /opt/medpubr/models
cat > /etc/systemd/system/medpubr-api.service <<'UNIT'
[Unit]
Description=medpubr — modelos médicos CPU (BGE-M3 embed, rerank, PII/NER) — Brasil
After=network-online.target
Wants=network-online.target

[Service]
Environment=HF_HOME=/opt/medpubr/models
Environment=MEDPUBR_EMBED_MODEL=BAAI/bge-m3
Environment=MEDPUBR_RERANK_MODEL=BAAI/bge-reranker-v2-m3
Environment=MEDPUBR_NER_MODEL=pucpr/clinicalnerpt-medical
Environment=OMP_NUM_THREADS=7
WorkingDirectory=/opt/medpubr
ExecStart=/opt/medpubr/bin/python3 -m uvicorn api:app --host 0.0.0.0 --port 8300 --workers 1 --timeout-keep-alive 30
Restart=always
RestartSec=5
User=root
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable --now medpubr-api.service
systemctl restart medpubr-api.service
echo "aguardando download/carga dos modelos (até 15 min)..."
for i in $(seq 1 180); do
  s=$(curl -s -m 3 http://127.0.0.1:8300/health || true)
  echo "$s" | grep -q '"status": *"ok"' && { echo "ok: $s"; exit 0; }
  sleep 5
done
echo "ainda carregando — ver: journalctl -u medpubr-api -n 50"; journalctl -u medpubr-api -n 30 --no-pager; exit 1
EOF
} > "$script"
ecs_run "$BR_REGION" "$ECS_MEDPUBR" "$script" 1200
rm -f "$script"
