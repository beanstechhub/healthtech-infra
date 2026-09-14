#!/usr/bin/env bash
# Grava (ou cria) um segredo no KMS 3.0, chave alias/btech. Nunca imprime o valor.
# uso: kms-put.sh NOME valor          | kms-put.sh NOME -   (lê de stdin)
#      kms-put.sh NOME --generate 32  (senha aleatória url-safe de N bytes; imprime só "ok")
set -euo pipefail
source "$(dirname "$0")/env.sh"

name=${1:?nome do segredo}; shift
case "${1:-}" in
  -)          value=$(cat) ;;
  --generate) value=$(openssl rand -base64 "${2:-32}" | tr '+/' '-_' | tr -d '=\n') ;;
  "")         echo "valor ausente" >&2; exit 2 ;;
  *)          value=$1 ;;
esac

if aliyun kms DescribeSecret --region "$KMS_REGION" --SecretName "$name" >/dev/null 2>&1; then
  aliyun kms PutSecretValue --region "$KMS_REGION" --SecretName "$name" --SecretData "$value" \
    --VersionId "v$(date -u +%Y%m%d%H%M%S)" >/dev/null
  echo "ok: $name (nova versão)"
else
  aliyun kms CreateSecret --region "$KMS_REGION" --SecretName "$name" --SecretData "$value" \
    --VersionId v1 --EncryptionKeyId "$KMS_KEY_ID" --Description "healthtech" >/dev/null
  echo "ok: $name (criado)"
fi
