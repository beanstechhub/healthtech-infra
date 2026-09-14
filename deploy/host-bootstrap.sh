#!/usr/bin/env bash
# Prepara hosts ECS via Cloud Assistant (sem SSH): instala aliyun CLI (RAM role), kms-env, acr-login.
# uso: host-bootstrap.sh apps | medpubr | db | gpu1 | all
set -euo pipefail
cd "$(dirname "$0")"; source ./env.sh

pack() {  # gera um único script auto-contido: kms-env embutido + bootstrap
  local f; f=$(mktemp)
  {
    echo "#!/bin/bash"   # Cloud Assistant usa /bin/sh (dash) sem shebang; precisamos de bash
    echo "cat > /tmp/kms-env <<'__KMSENV__'"; cat instance/kms-env; echo "__KMSENV__"
    cat instance/bootstrap-host.sh
  } > "$f"; echo "$f"
}
script=$(pack)
run() { echo "== $1 ($2)"; ecs_run "$3" "$2" "$script" 400; }
case "${1:-all}" in
  apps)    run br-apps "$ECS_APPS" "$BR_REGION" ;;
  medpubr) run medpubr "$ECS_MEDPUBR" "$BR_REGION" ;;
  db)      run br-db "$ECS_DB" "$BR_REGION" ;;
  gpu1)    run gpu1 "$ECS_GPU1" "$SG_REGION" ;;
  all)     run br-apps "$ECS_APPS" "$BR_REGION"; run medpubr "$ECS_MEDPUBR" "$BR_REGION"; run br-db "$ECS_DB" "$BR_REGION"; run gpu1 "$ECS_GPU1" "$SG_REGION" ;;
esac
rm -f "$script"
