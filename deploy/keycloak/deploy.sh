#!/usr/bin/env bash
# Deploy do Keycloak no br-apps (não usa ecs-deploy.sh porque precisa renderizar o realm com segredos do KMS
# e montar em /opt/keycloak/data/import). Idempotente: --import-realm só cria o realm se ele não existir;
# mudanças posteriores são feitas no console/admin API e ficam no PolarDB.
# uso: keycloak/deploy.sh [tag]
set -euo pipefail
cd "$(dirname "$0")/.."; source ./env.sh
tag=${1:-latest}; image="$ACR_REGISTRY/$ACR_NAMESPACE/keycloak:$tag"; hport=4090
script=$(mktemp)
cat > "$script" <<EOF
#!/bin/bash
set -euo pipefail
install -d -m 0700 /etc/healthtech; install -d -m 0755 /etc/caddy/sites
cat > /etc/healthtech/keycloak.secrets <<'__M__'
$(cat apps/keycloak.secrets)
__M__
kms-env keycloak
# realm renderizado a partir do env (placeholders \${VAR}); dono 1000 = usuário keycloak do container
install -d -m 0750 -o 1000 -g 1000 /etc/healthtech/keycloak-import
python3 - <<'PY'
import os,re
env={}
for line in open('/etc/healthtech/keycloak.env'):
    line=line.rstrip('\n')
    if '=' in line: k,v=line.split('=',1); env[k]=v
tpl=open('/tmp/realm-beanstech.json').read()
missing=set()
def sub(m):
    k=m.group(1)
    if k not in env: missing.add(k); return m.group(0)
    return env[k].replace('\\\\','\\\\\\\\').replace('"','\\\\"')
out=re.sub(r'\\\$\\{([A-Z0-9_]+)\\}',sub,tpl)
if missing: raise SystemExit(f"placeholders sem valor: {sorted(missing)}")
open('/etc/healthtech/keycloak-import/realm-beanstech.json','w').write(out)
PY
chown 1000:1000 /etc/healthtech/keycloak-import/realm-beanstech.json; chmod 0600 /etc/healthtech/keycloak-import/realm-beanstech.json
install -m 0600 /tmp/client-scope-beanstech.json /etc/healthtech/client-scope-beanstech.json; rm -f /etc/healthtech/keycloak-import/client-scope-beanstech.json
# env do container: só o que o Keycloak usa (sem os KC_SMTP/KC_CLIENT_* que ficaram no realm)
grep -E '^(KC_DB|KC_HOSTNAME|KC_HTTP_ENABLED|KC_PROXY_HEADERS|KC_BOOTSTRAP_ADMIN)' /etc/healthtech/keycloak.env > /etc/healthtech/keycloak.container.env
chmod 0600 /etc/healthtech/keycloak.container.env
acr-login >/dev/null
docker pull -q $image
docker rm -f ht-keycloak >/dev/null 2>&1 || true
docker run -d --name ht-keycloak --restart unless-stopped \\
  -p 127.0.0.1:$hport:8080 --env-file /etc/healthtech/keycloak.container.env \\
  -v /etc/healthtech/keycloak-import:/opt/keycloak/data/import:ro \\
  --memory 1800m --log-opt max-size=20m --log-opt max-file=3 \\
  $image >/dev/null
cat > /etc/caddy/sites/keycloak.caddy <<'__C__'
id.beanstech.com.br {
    encode zstd gzip
    request_body {
        max_size 2MB
    }
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options nosniff
        Referrer-Policy strict-origin-when-cross-origin
        -Server
    }
    # console de administração só de dentro da VPC / IP do dev — o resto do IdP é público
    @admin path /admin/*
    handle @admin {
        @allowed remote_ip 172.16.0.0/16 189.100.71.89/32
        handle @allowed {
            reverse_proxy 127.0.0.1:$hport
        }
        respond "forbidden" 403
    }
    reverse_proxy 127.0.0.1:$hport
}
__C__
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null && systemctl reload caddy
for i in \$(seq 1 60); do
  code=\$(curl -s -o /dev/null -w '%{http_code}' -m 5 http://127.0.0.1:$hport/realms/beanstech/.well-known/openid-configuration || true)
  [ "\$code" = 200 ] && { echo "ok: keycloak up, realm beanstech em :$hport"; docker logs ht-keycloak 2>&1 | grep -iE 'import|Realm|ERROR|WARN.*(db|smtp)' | tail -5; bash /tmp/kc-configure.sh; exit 0; }
  sleep 5
done
echo "FALHA (último código \$code)"; docker logs --tail 60 ht-keycloak; exit 1
EOF
# o realm template vai junto no script (não fica no host fora do render)
{ echo '#!/bin/bash'; echo "cat > /tmp/realm-beanstech.json <<'__R__'"; cat keycloak/realm-beanstech.json; echo; echo "__R__"; echo "cat > /tmp/client-scope-beanstech.json <<'__S__'"; cat keycloak/client-scope-beanstech.json; echo; echo "__S__"; echo "cat > /tmp/kc-configure.sh <<'__K__'"; cat keycloak/configure.sh; echo; echo "__K__"; tail -n +2 "$script"; echo "rm -f /tmp/realm-beanstech.json /tmp/client-scope-beanstech.json /tmp/kc-configure.sh"; } > "$script.full"
echo "== deploy keycloak ← $image → 127.0.0.1:$hport [id.beanstech.com.br]"
ecs_run "$BR_REGION" "$ECS_APPS" "$script.full" 420
rm -f "$script" "$script.full"
