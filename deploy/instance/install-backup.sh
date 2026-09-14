#!/usr/bin/env bash
# Roda NA instância. Instala ossutil (autenticação pela RAM role da ECS — sem AK/SK) e um backup diário para
# oss://beanstech-backup-br (São Paulo, endpoint interno = sem custo de tráfego).
#
#  backup-config   (todos os hosts, 03:10 BRT)  → config/<host>/<data>.tar.gz
#     caddy, manifestos *.secrets (NÃO os .env renderizados — são reproduzíveis pelo KMS), CA, units systemd,
#     medpubr/api.py, docker-compose do ES, postgresql.conf/pg_hba, crontabs, inventário docker
#  backup-postgres (só br-db, 03:30 BRT)        → postgres/<data>/globals.sql.gz + <db>.dump (pg_dump -Fc)
#
# Retenção é feita pelo lifecycle do bucket (config 90 d, postgres 60 d); a role não tem permissão de delete.
set -euo pipefail
BUCKET=beanstech-backup-br
ENDPOINT=oss-sa-east-1-internal.aliyuncs.com
ROLE=btech-ecs-runtime

if ! command -v ossutil64 >/dev/null; then
  command -v unzip >/dev/null || { export DEBIAN_FRONTEND=noninteractive; apt-get install -y -qq unzip >/dev/null 2>&1 || (apt-get update -qq && apt-get install -y -qq unzip >/dev/null); }
  curl -fsSL -o /tmp/ossutil.zip https://gosspublic.alicdn.com/ossutil/1.7.19/ossutil-v1.7.19-linux-amd64.zip
  (cd /tmp && rm -rf ossutil-v1.7.19-linux-amd64 && unzip -oq ossutil.zip && install -m 0755 ossutil-v1.7.19-linux-amd64/ossutil64 /usr/local/bin/ossutil64)
fi
install -d -m 0700 /root/.ossutil
cat > /root/.ossutilconfig <<EOF
[Credentials]
language=EN
endpoint=$ENDPOINT
mode=EcsRamRole
ecsRoleName=$ROLE
EOF
chmod 0600 /root/.ossutilconfig
ossutil64 ls oss://$BUCKET >/dev/null && echo "ok: ossutil autenticado via RAM role"

cat > /usr/local/bin/backup-config <<'EOF'
#!/bin/bash
set -euo pipefail
H=$(hostname); D=$(date -u +%Y%m%d-%H%M); T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
mkdir -p "$T/$H"
copy() { [ -e "$1" ] || return 0; mkdir -p "$T/$H/$(dirname "$1")"; cp -a "$1" "$T/$H/$(dirname "$1")/" 2>/dev/null || echo "aviso: não copiou $1"; }
copy /etc/caddy; copy /etc/healthtech/ca; copy /etc/systemd/system
for f in /etc/healthtech/*.secrets; do copy "$f"; done
copy /opt/medpubr/api.py; copy /data/docker-compose.yml; copy /data/compose.env
copy /etc/postgresql; copy /etc/pgbackrest.conf; copy /usr/local/bin
rm -rf "$T/$H/etc/systemd/system/multi-user.target.wants" "$T/$H/usr/local/bin/aliyun" "$T/$H/usr/local/bin/ossutil64" 2>/dev/null || true   # binários grandes, reinstaláveis
find "$T/$H" -name '*.env' -delete 2>/dev/null || true          # nunca versionar segredos renderizados
crontab -l > "$T/$H/crontab.root" 2>/dev/null || true
docker ps -a --format '{{.Names}}\t{{.Image}}\t{{.Ports}}' > "$T/$H/docker-ps.tsv" 2>/dev/null || true
ss -tlnp > "$T/$H/listening.txt" 2>/dev/null || true
tar -C "$T" -czf "$T/$H-$D.tar.gz" "$H"
ossutil64 cp -f "$T/$H-$D.tar.gz" "oss://beanstech-backup-br/config/$H/$H-$D.tar.gz" >/dev/null
echo "$(date -Is) ok config/$H/$H-$D.tar.gz $(du -h "$T/$H-$D.tar.gz" | cut -f1)"
EOF
chmod 0755 /usr/local/bin/backup-config

if command -v pg_dump >/dev/null && systemctl is-active -q 'postgresql@*' 2>/dev/null; then
cat > /usr/local/bin/backup-postgres <<'EOF'
#!/bin/bash
# dump lógico de todos os bancos (formato custom = restauração seletiva com pg_restore) + globals (roles)
set -euo pipefail
D=$(date -u +%Y%m%d-%H%M); T=$(mktemp -d); trap 'rm -rf "$T"' EXIT; chmod 0755 "$T"
sudo -u postgres pg_dumpall --globals-only | gzip -6 > "$T/globals.sql.gz"
for db in $(sudo -u postgres psql -Atc "select datname from pg_database where not datistemplate"); do
  sudo -u postgres pg_dump -Fc -Z6 "$db" > "$T/$db.dump"
done
sha256sum "$T"/* > "$T/SHA256SUMS"
ossutil64 cp -rf "$T" "oss://beanstech-backup-br/postgres/$D/" >/dev/null
echo "$(date -Is) ok postgres/$D/ $(ls "$T" | wc -l) arquivos $(du -sh "$T" | cut -f1)"
EOF
chmod 0755 /usr/local/bin/backup-postgres
{ crontab -l 2>/dev/null | grep -v backup-postgres || true; echo "30 6 * * * /usr/local/bin/backup-postgres >> /var/log/backup-postgres.log 2>&1"; } | crontab -
/usr/local/bin/backup-postgres
fi
{ crontab -l 2>/dev/null | grep -v backup-config || true; echo "10 6 * * * /usr/local/bin/backup-config >> /var/log/backup-config.log 2>&1"; } | crontab -
/usr/local/bin/backup-config
crontab -l
