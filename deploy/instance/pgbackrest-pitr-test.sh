#!/bin/bash
# Roda NO br-db. Ensaio de restauração a ponto no tempo (PITR) sem tocar no cluster de produção:
#  1. grava linha "antes" em ht_dodr, anota T, grava "depois"
#  2. força arquivamento do WAL e faz backup incremental
#  3. restaura em /var/lib/postgresql/17/pitr até T e sobe um cluster temporário na porta 5433
#  4. verifica que só "antes" existe; derruba e apaga o temporário; remove a tabela de prova da produção
set -euo pipefail
R=/var/lib/postgresql/17/pitr; PORT=5433
cleanup() { sudo -u postgres /usr/lib/postgresql/17/bin/pg_ctl -D $R stop -m immediate >/dev/null 2>&1 || true; rm -rf $R /tmp/pitr-conf; sudo -u postgres psql -Atqc "drop table if exists public.pitr_probe" ht_dodr >/dev/null 2>&1 || true; }
trap cleanup EXIT

sudo -u postgres psql -v ON_ERROR_STOP=1 -Atq ht_dodr <<'SQL'
create table if not exists public.pitr_probe(id serial primary key, t timestamptz default now(), note text);
insert into pitr_probe(note) values ('antes');
SQL
sleep 3; T=$(sudo -u postgres psql -Atqc "select to_char(now() at time zone 'UTC','YYYY-MM-DD HH24:MI:SS.MS')||'+00'"); sleep 3
sudo -u postgres psql -Atqc "insert into pitr_probe(note) values ('depois')" ht_dodr >/dev/null
sudo -u postgres psql -Atqc "select pg_switch_wal()" >/dev/null
sleep 8
sudo -u postgres pgbackrest --stanza=main --type=incr backup
echo "alvo PITR: $T   (produção agora: $(sudo -u postgres psql -Atqc "select string_agg(note,',' order by id) from pitr_probe" ht_dodr))"

install -d -m 0700 -o postgres -g postgres $R
sudo -u postgres pgbackrest --stanza=main --type=time "--target=$T" --target-action=promote --pg1-path=$R --log-level-console=warn restore
echo "restore ok → $R"
# config do cluster temporário: cópia da produção com porta/dirs próprios e SEM arquivar WAL (não contaminar o repo)
mkdir -p /tmp/pitr-conf; cp /etc/postgresql/17/main/postgresql.conf /tmp/pitr-conf/; cp /etc/postgresql/17/main/pg_hba.conf /etc/postgresql/17/main/pg_ident.conf /tmp/pitr-conf/
cat >> /tmp/pitr-conf/postgresql.conf <<EOF
data_directory = '$R'
hba_file = '/tmp/pitr-conf/pg_hba.conf'
ident_file = '/tmp/pitr-conf/pg_ident.conf'
port = $PORT
listen_addresses = 'localhost'
unix_socket_directories = '/tmp'
external_pid_file = ''
include_dir = ''
archive_mode = off
shared_buffers = 512MB
EOF
sed -i "/^include_dir/d" /tmp/pitr-conf/postgresql.conf; chown -R postgres:postgres /tmp/pitr-conf
sudo -u postgres /usr/lib/postgresql/17/bin/pg_ctl -D $R -o "-c config_file=/tmp/pitr-conf/postgresql.conf" -l /tmp/pitr-conf/pg.log -w -t 90 start >/dev/null
for i in $(seq 1 30); do sudo -u postgres psql -h /tmp -p $PORT -Atqc "select pg_is_in_recovery()" postgres 2>/dev/null | grep -q f && break; sleep 2; done
echo "cluster temporário :$PORT em recovery=$(sudo -u postgres psql -h /tmp -p $PORT -Atqc 'select pg_is_in_recovery()' postgres)"
got=$(sudo -u postgres psql -h /tmp -p $PORT -Atqc "select string_agg(note,',' order by id) from pitr_probe" ht_dodr)
echo "restaurado até $T contém: [$got]"
[ "$got" = "antes" ] && echo "PITR OK: a linha 'depois' (gravada após o alvo) não existe no restaurado" || { echo "PITR FALHOU"; exit 1; }
sudo -u postgres psql -h /tmp -p $PORT -Atqc "select datname from pg_database where datname like 'ht_%' order by 1" postgres | paste -sd' '
echo "== recovery log:"; grep -E 'recovery stopping|last completed transaction|promot' /tmp/pitr-conf/pg.log | head -4
