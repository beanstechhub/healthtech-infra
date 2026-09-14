#!/usr/bin/env bash
# Build local (linux/amd64) + push para o ACR Enterprise (namespace healthtech).
# uso: acr-build.sh <app>            (app do apps.tsv)
#      acr-build.sh --all
# Tag = <git sha curto | data>. Também atualiza :latest. Login no ACR com o perfil aliyun local (beanstech-sg).
set -euo pipefail
cd "$(dirname "$0")"; source ./env.sh
ROOT=$(cd .. && pwd)

acr_login() {
  local j user
  j=$(aliyun cr GetAuthorizationToken --region "$ACR_REGION" --version 2018-12-01 --InstanceId "$ACR_INSTANCE_ID")
  user=$(echo "$j" | python3 -c 'import sys,json;print(json.load(sys.stdin)["TempUsername"])')
  echo "$j" | python3 -c 'import sys,json;print(json.load(sys.stdin)["AuthorizationToken"])' \
    | docker login --username "$user" --password-stdin "$ACR_REGISTRY" >/dev/null
}

build_one() {
  local app=$1 line ctx df args cport hport domains
  line=$(grep -P "^${app}\t" apps.tsv) || { echo "app '$app' não está em apps.tsv" >&2; return 1; }
  IFS=$'\t' read -r app ctx df args cport hport domains <<< "$line"
  local dir="$ROOT/$ctx"
  local tag; tag=$(git -C "$dir" rev-parse --short HEAD 2>/dev/null || date -u +%Y%m%d%H%M)
  local image="$ACR_REGISTRY/$ACR_NAMESPACE/$app"
  local -a ba=()
  if [ "$args" != "-" ]; then IFS=',' read -ra kv <<< "$args"; for x in "${kv[@]}"; do ba+=(--build-arg "$x"); done; fi
  echo "== build $app  ($ctx → $image:$tag)"
  DOCKER_BUILDKIT=1 docker build --platform linux/amd64 -f "$dir/$df" "${ba[@]}" -t "$image:$tag" -t "$image:latest" "$dir" 2>&1 | tail -3
  docker push "$image:$tag" | tail -1
  docker push "$image:latest" | tail -1
  echo "$app	$image:$tag" >> .last-builds.tsv
  echo "ok: $image:$tag"
}

acr_login
if [ "${1:-}" = "--all" ]; then
  grep -vE '^#|^$' apps.tsv | cut -f1 | while read -r a; do build_one "$a"; done
else
  build_one "${1:?app}"
fi
