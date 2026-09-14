#!/bin/bash
# Roda NO br-apps após o Keycloak subir. Idempotente:
#  - garante o client scope "beanstech" (claims vertical/tenant/registro/roles) e o coloca como default do realm
#    e de todos os clients. Os scopes padrão (openid/profile/email/roles…) são criados pelo próprio Keycloak
#    ao criar o realm — por isso o realm JSON NÃO declara clientScopes.
set -euo pipefail
KC=http://127.0.0.1:4090; R=beanstech
. /etc/healthtech/keycloak.container.env
tok=$(curl -s -m 20 -X POST $KC/realms/master/protocol/openid-connect/token -d grant_type=password -d client_id=admin-cli -d username="$KC_BOOTSTRAP_ADMIN_USERNAME" -d "password=$KC_BOOTSTRAP_ADMIN_PASSWORD" | python3 -c 'import sys,json;print(json.load(sys.stdin)["access_token"])')
api() { curl -s -m 20 -H "Authorization: Bearer $tok" -H "Content-Type: application/json" "$@"; }
sid=$(api $KC/admin/realms/$R/client-scopes | python3 -c 'import sys,json;print(next((s["id"] for s in json.load(sys.stdin) if s["name"]=="beanstech"),""))')
if [ -z "$sid" ]; then
  api -X POST $KC/admin/realms/$R/client-scopes --data @/etc/healthtech/client-scope-beanstech.json -o /dev/null -w 'scope beanstech criado: %{http_code}\n'
  sid=$(api $KC/admin/realms/$R/client-scopes | python3 -c 'import sys,json;print(next(s["id"] for s in json.load(sys.stdin) if s["name"]=="beanstech"))')
fi
api -X PUT $KC/admin/realms/$R/default-default-client-scopes/$sid -o /dev/null
for cid in $(api "$KC/admin/realms/$R/clients?max=200" | python3 -c 'import sys,json;[print(c["id"]) for c in json.load(sys.stdin) if not c["clientId"].endswith(("-realm","broker","account","account-console","admin-cli","realm-management","security-admin-console"))]'); do
  api -X PUT $KC/admin/realms/$R/clients/$cid/default-client-scopes/$sid -o /dev/null
done
echo "scopes do realm: $(api $KC/admin/realms/$R/client-scopes | python3 -c 'import sys,json;print(sorted(s["name"] for s in json.load(sys.stdin)))')"
echo "dodr: $(api "$KC/admin/realms/$R/clients?clientId=dodr" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])' | xargs -I{} curl -s -m 20 -H "Authorization: Bearer $tok" $KC/admin/realms/$R/clients/{}/default-client-scopes | python3 -c 'import sys,json;print(sorted(s["name"] for s in json.load(sys.stdin)))')"
