# deploy/ — runbook healthtech na Alibaba Cloud

Sem SSH: tudo roda por **Cloud Assistant** (`ecs_run` em `env.sh`). Segredos só no **KMS 3.0** (alias/btech); os hosts leem pela **RAM role** `btech-ecs-runtime`.
Contexto e preços: [`../ALIBABA-HEALTHTECH-2026-09.md`](../ALIBABA-HEALTHTECH-2026-09.md).

## Subir ou atualizar um site

```bash
cd healthtech/deploy
./acr-build.sh dodr-site          # build linux/amd64 + push :sha e :latest no ACR (namespace healthtech)
./ecs-deploy.sh dodr-site         # KMS → /etc/healthtech/dodr-site.env · pull · container 127.0.0.1:4100 · vhost Caddy · health
./cf-repoint.sh dodr.ai           # só na primeira vez: apex+www → 43.118.160.51, DNS only (remove origens GCP)
./cf-proxy.sh dodr.ai on|off      # religar/desligar o proxy da Cloudflare (padrão: off — tudo no ECS)
```

Catálogo em `apps.tsv` (contexto, Dockerfile, build-args, porta container/host, domínios). Manifesto de env em `apps/<app>.secrets`:

```
DATABASE_URL=HT_DODR_DATABASE_URL      # ENV=nome do segredo no KMS
NEXT_PUBLIC_APP_URL:=https://dodr.ai   # ENV:=literal (não sensível)
```

Rollback: `./ecs-deploy.sh dodr-site <sha-anterior>` (tags ficam em `.last-builds.tsv`).

## Segredos

```bash
./kms-put.sh NOME 'valor'            # cria ou versiona
./kms-put.sh NOME --generate 32      # senha aleatória
printf '%s' "$x" | ./kms-put.sh NOME -   # via stdin (não passa pelo histórico)
```
Depois de rotacionar: `./ecs-deploy.sh <app>` re-renderiza o env e recria o container.

## Bancos

```bash
./pg-create-db.sh <app>              # br-db (PostgreSQL 17): role ht_<app>, db ht_<app>, senha → KMS, pg_hba na VPC
./polardb-init.sh                    # PolarDB MySQL: aplica polardb-auth.sql em ht_auth (idempotente)
```

## Hosts novos

```bash
./host-bootstrap.sh apps|medpubr|db|gpu1|all   # aliyun CLI (EcsRamRole) + kms-env + acr-login
```
Adicionar o IP público do host na ACL do ACR se ele precisar puxar imagem (`CreateInstanceEndpointAclPolicy`).

## medpubr (modelos CPU no Brasil)

`./medpubr/install.sh` — API em `http://172.16.0.21:8300` (`/health`, `/v1/embed`, `/v1/rerank`, `/v1/pii`, `/v1/ner`, `/v1/support`). Primeiro start baixa ~4,5 GB de modelos.

## 2ª GPU em Singapura

`./gpu2/create-gpu2-sg.sh image` (imagem da elite-health) → `create` → `token` (GPU2_GATEWAY_TOKEN no KMS) → `smoke`.
Parar sem cobrar compute: `aliyun ecs StopInstance --InstanceId <id> --StoppedMode StopCharging`.

## Verificação rápida

```bash
for d in dodr.ai exame.tech prontuario.tech petiq.tech drhealth.tech beanshealth.com.br drogaria.tech; do
  printf '%-20s %s\n' $d "$(curl -s -o /dev/null -w '%{http_code}' -m 20 https://$d/)"; done
```

## Backup (§8 do plano)

`./instance/install-backup.sh` (via `ecs_run`) instala `ossutil64` (RAM role) + cron: `backup-config` 03:10 BRT em todos os hosts, `backup-postgres` 03:30 BRT no `br-db`. Destino `oss://beanstech-backup-br` (versionado, sem delete pela role). Logs em `/var/log/backup-*.log`.

## BeansTech ID (Keycloak) — §9 do plano

`./keycloak/deploy.sh` sobe/atualiza o IdP em `id.beanstech.com.br` (realm `beanstech` importado só na primeira vez; `configure.sh` idempotente). Novo portal: adicionar client no `keycloak/realm-beanstech.json` **e** no console (o import não altera realm existente), `AUTH_KEYCLOAK_ISSUER/ID/SECRET` no manifesto, provider `keycloak` no Auth.js. Console admin: `https://id.beanstech.com.br/admin/` (só VPC/IP do dev); usuário `admin` (master) com senha em `KEYCLOAK_ADMIN_PASSWORD`.

## CMS (Directus) — §10 do plano

`./ecs-deploy.sh directus` (imagem em `directus/Dockerfile`, manifesto `apps/directus.secrets`). Admin: `https://cms.beanstech.com.br/admin` — botão "BeansTech ID" (usuário precisa existir no Directus com o mesmo e-mail) ou admin local (`DIRECTUS_ADMIN_PASSWORD` no KMS). Mídia vai para `oss://beanstech-cms-media`.
