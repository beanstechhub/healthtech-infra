#!/bin/bash
# Roda NO br-db. Ativa pgBackRest: repositório S3-compatível no OSS (São Paulo, endpoint interno),
# criptografado no cliente (AES-256, chave no KMS), arquivamento contínuo de WAL, full semanal + incremental diário.
# Segredos vêm do KMS pela RAM role da instância; ficam só em /etc/pgbackrest/pgbackrest.conf (postgres, 0600).
set -euo pipefail
kms() { aliyun --profile ecs kms GetSecretValue --region ap-southeast-1 --SecretName "$1" | python3 -c 'import sys,json;print(json.load(sys.stdin)["SecretData"],end="")'; }
AK=$(kms PGBACKREST_OSS_AK); SK=$(kms PGBACKREST_OSS_SK); CIPHER=$(kms PGBACKREST_REPO_CIPHER)
PGDATA=$(sudo -u postgres psql -Atc "show data_directory")
echo "pgbackrest $(pgbackrest version | awk '{print $2}') · PGDATA=$PGDATA"

install -d -m 0750 -o postgres -g postgres /etc/pgbackrest /var/log/pgbackrest /var/spool/pgbackrest
[ -f /etc/pgbackrest.conf ] && mv /etc/pgbackrest.conf /etc/pgbackrest.conf.dist   # config vazia do pacote; a real é /etc/pgbackrest/pgbackrest.conf
cat > /etc/pgbackrest/pgbackrest.conf <<EOF
[global]
repo1-type=s3
repo1-s3-bucket=beanstech-backup-br
repo1-s3-endpoint=oss-sa-east-1-internal.aliyuncs.com
repo1-s3-region=sa-east-1
repo1-s3-uri-style=host
repo1-s3-key=$AK
repo1-s3-key-secret=$SK
repo1-path=/pgbackrest
repo1-cipher-type=aes-256-cbc
repo1-cipher-pass=$CIPHER
repo1-retention-full=4
repo1-retention-archive-type=full
repo1-bundle=y
repo1-block=y
process-max=4
compress-type=zst
compress-level=3
start-fast=y
delta=y
archive-async=y
spool-path=/var/spool/pgbackrest
log-level-console=warn
log-level-file=info
log-path=/var/log/pgbackrest

[main]
pg1-path=$PGDATA
pg1-port=5432
pg1-user=postgres
EOF
chown postgres:postgres /etc/pgbackrest/pgbackrest.conf; chmod 0600 /etc/pgbackrest/pgbackrest.conf
unset AK SK CIPHER

cat > /etc/postgresql/17/main/conf.d/pgbackrest.conf <<'EOF'
# arquivamento contínuo de WAL → pgBackRest → OSS (restauração a ponto no tempo)
wal_level = replica
archive_mode = on
archive_command = 'pgbackrest --stanza=main archive-push %p'
archive_timeout = 300          # fecha um segmento a cada 5 min mesmo com pouca escrita → perda máxima ≈ 5 min
max_wal_senders = 10
EOF
systemctl restart postgresql@17-main
sleep 3; sudo -u postgres psql -Atc "select 'archive_mode='||current_setting('archive_mode')||' wal_level='||current_setting('wal_level')"

echo "== stanza-create / check (valida archive_command ponta a ponta):"
sudo -u postgres pgbackrest --stanza=main stanza-create
sudo -u postgres pgbackrest --stanza=main check && echo "check ok"
echo "== backup full inicial:"
time sudo -u postgres pgbackrest --stanza=main --type=full backup
sudo -u postgres pgbackrest info

# agenda (usuário postgres): full domingo 04:00 BRT (07:00 UTC), incremental seg–sáb; expire junto
( sudo -u postgres crontab -l 2>/dev/null | grep -v pgbackrest || true
  echo "0 7 * * 0 pgbackrest --stanza=main --type=full backup >> /var/log/pgbackrest/cron.log 2>&1"
  echo "0 7 * * 1-6 pgbackrest --stanza=main --type=incr backup >> /var/log/pgbackrest/cron.log 2>&1" ) | sudo -u postgres crontab -
echo "== cron postgres:"; sudo -u postgres crontab -l
