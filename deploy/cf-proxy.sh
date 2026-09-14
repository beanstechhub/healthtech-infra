#!/usr/bin/env bash
# Liga/desliga o proxy da Cloudflare (nuvem laranja) nos registros de @ e www de um domínio.
# Decisão 2026-09-14: healthtech roda "tudo no ECS" — Cloudflare só como DNS (off). Reversível com "on".
# uso: cf-proxy.sh <domínio> on|off
set -euo pipefail
cd "$(dirname "$0")"; source ./env.sh
domain=${1:?domínio}; mode=${2:?on|off}
case "$mode" in on) proxied=true;; off) proxied=false;; *) echo "on|off" >&2; exit 2;; esac
CF=https://api.cloudflare.com/client/v4
tok=$(aliyun kms GetSecretValue --region "$KMS_REGION" --SecretName CLOUDFLARE | python3 -c 'import sys,json;print(json.load(sys.stdin)["SecretData"],end="")')
cf() { curl -s -m 20 -H "Authorization: Bearer $tok" -H "Content-Type: application/json" "$@"; }
zone=$(cf "$CF/zones?name=$domain" | python3 -c 'import sys,json;r=json.load(sys.stdin).get("result") or [];print(r[0]["id"] if r else "")')
[ -n "$zone" ] || { echo "zona $domain não encontrada" >&2; exit 1; }
cf "$CF/zones/$zone/dns_records?per_page=500" | python3 -c "
import sys,json
for r in json.load(sys.stdin)['result']:
    if r['name'] in ('$domain','www.$domain') and r['type'] in ('A','AAAA','CNAME') and r['proxied'] != $( [ $proxied = true ] && echo True || echo False ):
        print(r['id'], r['name'], r['type'], r['content'])" | while read -r rid name typ content; do
  cf -X PATCH "$CF/zones/$zone/dns_records/$rid" --data "{\"proxied\":$proxied}" \
    | python3 -c "import sys,json;d=json.load(sys.stdin);print('  ' + ('ok' if d['success'] else 'ERRO'), '$name $typ $content → proxied=$proxied', d.get('errors') or '')"
done
unset tok
echo "$domain: proxy $mode"
