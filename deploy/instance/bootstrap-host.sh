#!/usr/bin/env bash
# Prepara um host ECS (Ubuntu 24.04) para receber deploys healthtech:
#  - aliyun CLI com perfil "ecs" (EcsRamRole btech-ecs-runtime) — lê KMS e loga no ACR sem AK/SK
#  - /usr/local/bin/kms-env  (renderiza env files a partir do KMS)
#  - /usr/local/bin/acr-login (docker login no ACR EE com token temporário da RAM role)
#  - /etc/healthtech/ (manifestos e envs, 0700)
# Idempotente. Executado via Cloud Assistant por deploy/host-bootstrap.sh.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

if ! command -v aliyun >/dev/null; then
  cd /tmp
  curl -fsSL -o aliyun-cli.tgz https://aliyuncli.alicdn.com/aliyun-cli-linux-latest-amd64.tgz
  tar xzf aliyun-cli.tgz && install -m 0755 aliyun /usr/local/bin/aliyun && rm -f aliyun aliyun-cli.tgz
fi
aliyun configure set --profile ecs --mode EcsRamRole --ram-role-name btech-ecs-runtime --region ap-southeast-1 >/dev/null
aliyun configure set --profile ecs-br --mode EcsRamRole --ram-role-name btech-ecs-runtime --region sa-east-1 >/dev/null

command -v docker >/dev/null || { apt-get update -qq && apt-get install -y -qq docker.io docker-compose-v2 >/dev/null; systemctl enable --now docker; }
command -v python3 >/dev/null || apt-get install -y -qq python3 >/dev/null

install -d -m 0700 /etc/healthtech
install -m 0755 /tmp/kms-env /usr/local/bin/kms-env

cat > /usr/local/bin/acr-login <<'EOF'
#!/usr/bin/env bash
# docker login no ACR EE usando credencial temporária obtida com a RAM role da instância
set -euo pipefail
REG=btech-registry.ap-southeast-1.cr.aliyuncs.com
j=$(aliyun --profile ecs cr GetAuthorizationToken --region ap-southeast-1 --version 2018-12-01 --InstanceId cri-b03npmgpr3bf1tex)
user=$(echo "$j" | python3 -c 'import sys,json;print(json.load(sys.stdin)["TempUsername"])')
echo "$j" | python3 -c 'import sys,json;print(json.load(sys.stdin)["AuthorizationToken"])' \
  | docker login --username "$user" --password-stdin "$REG" >/dev/null
echo "ok: login $REG"
EOF
chmod 0755 /usr/local/bin/acr-login

# teste: RAM role responde e KMS é legível
aliyun --profile ecs sts GetCallerIdentity | grep -q Arn && echo "ok: RAM role ativa"
aliyun --profile ecs kms DescribeSecret --region ap-southeast-1 --SecretName DASHSCOPE_API_KEY >/dev/null && echo "ok: KMS legível"
acr-login || echo "aviso: ACR ACL não inclui o IP público deste host (ok para hosts que não puxam imagem)"
echo "bootstrap concluído em $(hostname)"
