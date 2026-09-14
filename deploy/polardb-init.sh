#!/usr/bin/env bash
# Aplica deploy/polardb-auth.sql no PolarDB MySQL (endpoint privado) a partir do br-apps, que está na VPC.
# A senha vem do KMS via RAM role do host (kms-env); nunca passa por argumento nem por este terminal.
set -euo pipefail
cd "$(dirname "$0")"; source ./env.sh
script=$(mktemp)
{
  echo '#!/bin/bash'; echo 'set -euo pipefail'
  echo 'command -v mysql >/dev/null || { apt-get update -qq && apt-get install -y -qq mysql-client-core-8.0 >/dev/null; }'
  echo "cat > /etc/healthtech/polardb-auth.secrets <<'EOF'"
  echo "MYSQL_PWD=HT_AUTH_MYSQL_PASSWORD"; echo "EOF"
  echo 'kms-env polardb-auth >/dev/null'
  echo "cat > /tmp/polardb-auth.sql <<'__SQL__'"; cat polardb-auth.sql; echo "__SQL__"
  echo "set -a; . /etc/healthtech/polardb-auth.env; set +a"
  echo "mysql --host=$POLARDB_HOST --port=3306 --user=ht_auth --ssl-mode=PREFERRED ht_auth < /tmp/polardb-auth.sql"
  echo "mysql --host=$POLARDB_HOST --port=3306 --user=ht_auth ht_auth -e 'SHOW TABLES; SELECT slug FROM tenants ORDER BY slug;'"
  echo "rm -f /tmp/polardb-auth.sql; unset MYSQL_PWD"
} > "$script"
ecs_run "$BR_REGION" "$ECS_APPS" "$script" 300
rm -f "$script"
