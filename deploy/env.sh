# IDs fixos da conta Alibaba (verificados por API em 2026-09-13). Carregar com: source deploy/env.sh
# Nada aqui é segredo — segredos vivem no KMS 3.0 (alias/btech, ap-southeast-1).

export ACCOUNT_UID=5838574299307916
export KMS_REGION=ap-southeast-1
export KMS_KEY_ID=key-sgp6a9e9eedrekuuisku3          # alias/btech
export RAM_ROLE_RUNTIME=btech-ecs-runtime            # anexada a br-apps, br-db, medpubr, sg-gpu

# ACR Enterprise (Singapura) — namespace healthtech, repos criados automaticamente no push
export ACR_INSTANCE_ID=cri-b03npmgpr3bf1tex
export ACR_REGION=ap-southeast-1
export ACR_REGISTRY=btech-registry.ap-southeast-1.cr.aliyuncs.com
export ACR_NAMESPACE=healthtech

# São Paulo (sa-east-1) — VPC beanstech-br 172.16.0.0/16
export BR_REGION=sa-east-1
export BR_VPC=vpc-0jx5nh4bs27v35i8nklmg
export BR_VSWITCH_A=vsw-0jxinhbz4dobw2z2h0ewl        # 172.16.1.0/24 (apps/db/es)
export BR_VSWITCH_B=vsw-0jxn1rfhp5qpioeur11or        # 172.16.0.0/24 (medpubr, polardb)
export ECS_APPS=i-0jx5vm3bzpr06d0bkd1g               # beanstech-br-apps  g9i.2xlarge  172.16.1.51  EIP 43.118.160.51  (Caddy :80/:443)
export ECS_DB=i-0jxes777ld90nth4u4kl                 # beanstech-br-db    r9i.2xlarge  172.16.1.52  PostgreSQL 17
export ECS_ES=i-0jx5vm3bzpr06mvh4mx3                 # beanstech-br-es    r9i.4xlarge  172.16.1.53  Elasticsearch 9.5 (RagJur)
export ECS_MEDPUBR=i-0jxgltk4xaqltn8feuxf            # medpubr            r9i.2xlarge  172.16.0.21  modelos médicos CPU
export APPS_EIP=43.118.160.51
export APPS_PRIVATE_IP=172.16.1.51
export DB_PRIVATE_IP=172.16.1.52
export ES_PRIVATE_IP=172.16.1.53
export MEDPUBR_PRIVATE_IP=172.16.0.21
export APPS_SG=sg-0jx29rcxrm0a33a869dv

# PolarDB MySQL 8.0 (sa-east-1, pré-pago até 2027-09-13) — banco de identidade/senhas
export POLARDB_CLUSTER=pc-0jxewaahd2vjs1w9p
export POLARDB_HOST=pc-0jxewaahd2vjs1w9p.rwlb.sa-east-1.rds.aliyuncs.com   # endpoint Cluster (RW)
export POLARDB_SUPER_USER=beanstechbr

# Singapura (ap-southeast-1) — GPU
export SG_REGION=ap-southeast-1
export ECS_GPU1=i-t4n52mpqtwdizc6v6heu               # beanstech-elite-health gn8is-2x.8xlarge 2×L20  8.222.169.230  router :8080
export GPU1_PUBLIC_IP=8.222.169.230
export GPU_INSTANCE_TYPE=ecs.gn8is-2x.8xlarge
export GPU_ZONE=ap-southeast-1a

# Model Studio (DashScope intl) — chave no KMS: DASHSCOPE_API_KEY
export DASHSCOPE_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1

# Helpers -----------------------------------------------------------------------------------
# Executa um script bash numa ECS via Cloud Assistant e espera o resultado.
# uso: ecs_run <region> <instance-id> <arquivo.sh> [timeout-s]
ecs_run() {
  local region=$1 inst=$2 file=$3 timeout=${4:-300}
  local b64 id
  b64=$(base64 -w0 "$file")
  id=$(aliyun ecs RunCommand --region "$region" --RegionId "$region" --Type RunShellScript \
        --CommandContent "$b64" --ContentEncoding Base64 --InstanceId.1 "$inst" --Timeout "$timeout" 2>&1 | grep -o 't-[a-z0-9]*')
  [ -z "$id" ] && { echo "RunCommand falhou" >&2; return 1; }
  local status="" i=0
  while [ $i -lt $((timeout/5+2)) ]; do
    sleep 5; i=$((i+1))
    status=$(aliyun ecs DescribeInvocationResults --region "$region" --RegionId "$region" --InvokeId "$id" 2>/dev/null | grep -o '"InvocationStatus": *"[A-Za-z]*"' | head -1 | grep -o '[A-Za-z]*"$' | tr -d '"')
    case "$status" in Success|Failed|Timeout|Stopped|Error) break;; esac
  done
  aliyun ecs DescribeInvocationResults --region "$region" --RegionId "$region" --InvokeId "$id" | python3 -c '
import sys,json,base64
d=json.load(sys.stdin)
for r in d["Invocation"]["InvocationResults"]["InvocationResult"]:
    print(base64.b64decode(r.get("Output","")).decode("utf-8","replace"))
    st=r.get("InvocationStatus")
    if st!="Success": print("### STATUS:",st, "exit:",r.get("ExitCode")); sys.exit(1)'
}
