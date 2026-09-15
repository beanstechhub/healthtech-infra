#!/usr/bin/env bash
# Deploy de um app no ECS br-apps (Caddy + docker) via Cloud Assistant, sem SSH.
#  1. envia o manifesto deploy/apps/<app>.secrets → /etc/healthtech/<app>.secrets e renderiza o .env pelo KMS
#  2. acr-login (RAM role) → docker pull → recria o container ht-<app> em 127.0.0.1:<porta-host>
#  3. grava /etc/caddy/sites/<app>.caddy (domínios → porta) e recarrega o Caddy (TLS automático)
#  4. health check local
# uso: ecs-deploy.sh <app> [tag]      (tag default: latest)
set -euo pipefail
cd "$(dirname "$0")"; source ./env.sh
app=${1:?app}; tag=${2:-latest}
line=$(grep -P "^${app}\t" apps.tsv) || { echo "app '$app' não está em apps.tsv" >&2; exit 1; }
IFS=$'\t' read -r _ ctx df args cport hport domains <<< "$line"
image="$ACR_REGISTRY/$ACR_NAMESPACE/$app:$tag"
manifest="apps/$app.secrets"; [ -f "$manifest" ] || manifest="apps/_default.secrets"
caddy_domains=$(echo "$domains" | tr ',' ' ' | sed 's/ $//' | sed 's/ /, /g')

script=$(mktemp)
cat > "$script" <<EOF
#!/bin/bash
set -euo pipefail
install -d -m 0700 /etc/healthtech; install -d -m 0755 /etc/caddy/sites
cat > /etc/healthtech/$app.secrets <<'__M__'
$(cat "$manifest")
__M__
kms-env $app
acr-login >/dev/null
docker pull -q $image
docker rm -f ht-$app >/dev/null 2>&1 || true
docker run -d --name ht-$app --restart unless-stopped \\
  -p 127.0.0.1:$hport:$cport --env-file /etc/healthtech/$app.env \\
  --memory 1500m --log-opt max-size=20m --log-opt max-file=3 \\
  -v /etc/healthtech/ca:/etc/healthtech/ca:ro \\
  --add-host br-db:$DB_PRIVATE_IP --add-host br-es:$ES_PRIVATE_IP --add-host medpubr:$MEDPUBR_PRIVATE_IP \\
  $image >/dev/null
cat > /etc/caddy/sites/$app.caddy <<'__C__'
$caddy_domains {
    encode zstd gzip
$( [ "$app" = healthdash ] && printf '    basicauth {\n        beans __HTPASS__\n    }\n' )
    request_body {
        max_size 25MB
    }
    @static path /_next/static/* /images/* /fonts/* *.ico *.svg *.png *.jpg *.webp *.woff2
    header @static Cache-Control "public, max-age=31536000, immutable"
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options nosniff
        Referrer-Policy strict-origin-when-cross-origin
        -Server
    }
    reverse_proxy 127.0.0.1:$hport
}
__C__
[ "$app" = healthdash ] && sed -i "s|__HTPASS__|\$(cat /etc/healthtech/healthdash.htpass.b64)|" /etc/caddy/sites/$app.caddy
grep -q '^import /etc/caddy/sites/\*.caddy' /etc/caddy/Caddyfile || sed -i '1i import /etc/caddy/sites/*.caddy' /etc/caddy/Caddyfile
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null && systemctl reload caddy
for i in \$(seq 1 30); do
  code=\$(curl -s -o /dev/null -w '%{http_code}' -m 5 http://127.0.0.1:$hport/ || true)
  case "\$code" in 200|301|302|307|308) echo "ok: ht-$app respondeu \$code em :$hport"; exit 0;; esac
  sleep 2
done
echo "FALHA: ht-$app não respondeu (último código: \$code)"; docker logs --tail 40 ht-$app; exit 1
EOF
echo "== deploy $app ← $image  → 127.0.0.1:$hport  [$caddy_domains]"
ecs_run "$BR_REGION" "$ECS_APPS" "$script" 300
rm -f "$script"
