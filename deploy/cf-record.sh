#!/usr/bin/env bash
# Cria/atualiza um registro A (DNS only) para um host qualquer de uma zona na Cloudflare.
# uso: cf-record.sh id.beanstech.com.br [ip=APPS_EIP]
set -euo pipefail
cd "$(dirname "$0")"; source ./env.sh
fqdn=${1:?fqdn}; ip=${2:-$APPS_EIP}
zone_name=$(echo "$fqdn" | awk -F. '{n=NF; if ($n=="br" && n>=3) print $(n-2)"."$(n-1)"."$n; else print $(n-1)"."$n}')
CF=https://api.cloudflare.com/client/v4
tok=$(aliyun kms GetSecretValue --region "$KMS_REGION" --SecretName CLOUDFLARE | python3 -c 'import sys,json;print(json.load(sys.stdin)["SecretData"],end="")')
cf() { curl -s -m 20 -H "Authorization: Bearer $tok" -H "Content-Type: application/json" "$@"; }
zone=$(cf "$CF/zones?name=$zone_name" | python3 -c 'import sys,json;r=json.load(sys.stdin).get("result") or [];print(r[0]["id"] if r else "")')
[ -n "$zone" ] || { echo "zona $zone_name não encontrada" >&2; exit 1; }
existing=$(cf "$CF/zones/$zone/dns_records?name=$fqdn" | python3 -c 'import sys,json;print(" ".join(r["id"] for r in json.load(sys.stdin)["result"] if r["type"] in ("A","AAAA","CNAME")))')
for rid in $existing; do cf -X DELETE "$CF/zones/$zone/dns_records/$rid" >/dev/null && echo "  removido $rid"; done
cf -X POST "$CF/zones/$zone/dns_records" --data "{\"type\":\"A\",\"name\":\"$fqdn\",\"content\":\"$ip\",\"ttl\":300,\"proxied\":false,\"comment\":\"br-apps sa-east-1\"}" \
  | python3 -c 'import sys,json;d=json.load(sys.stdin);print("  ok:" if d["success"] else "  ERRO:", (d.get("result") or {}).get("name"), d.get("errors") or "")'
unset tok
