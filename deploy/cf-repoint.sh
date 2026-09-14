#!/usr/bin/env bash
# Reponta um domínio na Cloudflare para a origem nova (br-apps) — token lido do KMS (CLOUDFLARE), nunca impresso.
#  - apex e www → A <APPS_EIP>, DNS only (decisão 2026-09-14: tudo no ECS; PROXIED=true para ligar a nuvem laranja)
#  - remove A/AAAA/CNAME antigos desses dois nomes (origens GCP mortas)
#  - SSL mode → "full" (Caddy serve cert Let's Encrypt na origem; "flexible" causaria loop de redirect)
#  - Always Use HTTPS on
# uso: cf-repoint.sh drogaria.tech [www]      (--dry-run para só listar)
set -euo pipefail
cd "$(dirname "$0")"; source ./env.sh
domain=${1:?domínio}; dry=${DRY_RUN:-0}
CF=https://api.cloudflare.com/client/v4
tok=$(aliyun kms GetSecretValue --region "$KMS_REGION" --SecretName CLOUDFLARE | python3 -c 'import sys,json;print(json.load(sys.stdin)["SecretData"],end="")')
cf() { curl -s -m 20 -H "Authorization: Bearer $tok" -H "Content-Type: application/json" "$@"; }

zone=$(cf "$CF/zones?name=$domain" | python3 -c 'import sys,json;d=json.load(sys.stdin);r=d.get("result") or [];print(r[0]["id"] if r else "")')
[ -n "$zone" ] || { echo "zona $domain não encontrada na conta do token" >&2; exit 1; }
recs=$(cf "$CF/zones/$zone/dns_records?per_page=500")
echo "== $domain (zona $zone) — registros atuais de @ e www:"
echo "$recs" | python3 -c "
import sys,json
for r in json.load(sys.stdin)['result']:
    if r['name'] in ('$domain','www.$domain') and r['type'] in ('A','AAAA','CNAME'):
        print(f\"  {r['type']:5} {r['name']:30} {r['content']:40} proxied={r['proxied']}\")"
[ "$dry" = 1 ] && exit 0

for name in "$domain" "www.$domain"; do
  # apaga registros antigos desse nome
  echo "$recs" | python3 -c "
import sys,json
for r in json.load(sys.stdin)['result']:
    if r['name']=='$name' and r['type'] in ('A','AAAA','CNAME'): print(r['id'])" | while read -r rid; do
      cf -X DELETE "$CF/zones/$zone/dns_records/$rid" >/dev/null && echo "  removido $rid ($name)"
  done
  cf -X POST "$CF/zones/$zone/dns_records" --data "{\"type\":\"A\",\"name\":\"$name\",\"content\":\"$APPS_EIP\",\"ttl\":300,\"proxied\":${PROXIED:-false},\"comment\":\"br-apps sa-east-1 (rebuild Alibaba 2026-09)\"}" \
    | python3 -c 'import sys,json;d=json.load(sys.stdin);print("  ok:" if d["success"] else "  ERRO:", d.get("result",{}).get("name"), d.get("errors"))'
done
for setting in ssl:full always_use_https:on; do
  k=${setting%%:*}; v=${setting#*:}
  cf -X PATCH "$CF/zones/$zone/settings/$k" --data "{\"value\":\"$v\"}" | python3 -c '
import sys,json;d=json.load(sys.stdin);r=d.get("result") or {}
print("  '"$k"':", r.get("value") if d.get("success") else "SEM PERMISSÃO no token (Zone Settings:Edit) — ajustar no console: SSL/TLS = Full")'
done
unset tok
echo "verificar: curl -sI https://$domain | head -3"
