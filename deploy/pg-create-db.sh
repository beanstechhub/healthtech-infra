#!/usr/bin/env bash
# Cria role + database Postgres no br-db (PostgreSQL 17, 172.16.1.52) para um app healthtech.
# A senha é gerada aqui, gravada no KMS como HT_<APP>_DATABASE_URL e HT_<APP>_DB_PASSWORD,
# e enviada ao host UMA vez pelo Cloud Assistant (não fica em unit, log ou histórico).
# pg_hba recebe uma linha por app restrita à VPC (172.16.0.0/16).
# uso: pg-create-db.sh dodr [extensões: pgcrypto,uuid-ossp,pg_trgm]
set -euo pipefail
cd "$(dirname "$0")"; source ./env.sh
app=${1:?app (ex.: dodr)}; ext=${2:-pgcrypto,uuid-ossp,pg_trgm}
db="ht_${app//-/_}"; role="ht_${app//-/_}"
APP=$(echo "${app//-/_}" | tr a-z A-Z)

# reutiliza senha existente no KMS se já houver (idempotente); senão gera
if pw=$(aliyun kms GetSecretValue --region "$KMS_REGION" --SecretName "HT_${APP}_DB_PASSWORD" 2>/dev/null | python3 -c 'import sys,json;print(json.load(sys.stdin)["SecretData"],end="")'); then
  echo "senha existente no KMS reutilizada"
else
  pw=$(openssl rand -base64 30 | tr '+/' '-_' | tr -d '=\n')
  ./kms-put.sh "HT_${APP}_DB_PASSWORD" "$pw"
fi
./kms-put.sh "HT_${APP}_DATABASE_URL" "postgresql://${role}:${pw}@${DB_PRIVATE_IP}:5432/${db}?sslmode=disable"

script=$(mktemp)
cat > "$script" <<EOF
#!/bin/bash
set -euo pipefail
export PGPASSWORD_NEW='$pw'
sudo -u postgres psql -v ON_ERROR_STOP=1 -Atq <<'SQL'
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='$role') THEN
    CREATE ROLE $role LOGIN;
  END IF;
END \$\$;
SQL
sudo -u postgres psql -v ON_ERROR_STOP=1 -Atqc "ALTER ROLE $role PASSWORD '\$PGPASSWORD_NEW' CONNECTION LIMIT 60;"
if ! sudo -u postgres psql -Atqc "SELECT 1 FROM pg_database WHERE datname='$db'" | grep -q 1; then
  sudo -u postgres createdb -O $role -E UTF8 --locale=C.UTF-8 -T template0 $db
fi
for e in \$(echo "$ext" | tr ',' ' '); do sudo -u postgres psql -v ON_ERROR_STOP=1 -Atqc "CREATE EXTENSION IF NOT EXISTS \"\$e\";" $db; done
sudo -u postgres psql -Atqc "REVOKE ALL ON DATABASE $db FROM PUBLIC; GRANT ALL ON DATABASE $db TO $role;"
HBA=/etc/postgresql/17/main/pg_hba.conf
grep -q "^host $db $role 172.16.0.0/16" \$HBA || { echo "host $db $role 172.16.0.0/16 scram-sha-256" >> \$HBA; systemctl reload postgresql; }
unset PGPASSWORD_NEW
echo "ok: db=$db role=$role ext=$ext"
sudo -u postgres psql -Atqc "select datname, pg_size_pretty(pg_database_size(datname)) from pg_database where datname='$db';"
EOF
ecs_run "$BR_REGION" "$ECS_DB" "$script" 120
rm -f "$script"
