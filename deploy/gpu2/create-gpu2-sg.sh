#!/usr/bin/env bash
# 2ª instância GPU em Singapura com os modelos médicos — réplica exata da elite-health via imagem customizada.
#
# Por que imagem e não bootstrap: o time residente (medgemma:27b, medgemma-1.5-4b, granite4.1:30b-q4,
# granite3-guardian:8b, qwen3-vl:8b, whisper, chexagent) já está afinado na elite-health (2 serviços Ollama,
# pin CUDA por GPU, correções de cgroup/Vulkan documentadas em alibaba/dados/SERVIDOR-GPU-CONFIG-2026-09-13.md).
# Uma imagem clona os 73 GB de pesos + config em ~10 min; o bootstrap.sh antigo está deprecated.
#
# Custo (fatura real 2026-09): ecs.gn8is-2x.8xlarge ≈ US$ 5,89/h ≈ US$ 4.300/mês PAYG + ESSD 200 GB + tráfego.
# Passos: 1) imagem da elite-health  2) RunInstances  3) EIP  4) SG 8080 p/ br-apps  5) token no KMS  6) smoke test
# uso: gpu2/create-gpu2-sg.sh image | create | all
set -euo pipefail
cd "$(dirname "$0")/.."; source ./env.sh
IMG_NAME="elite-health-medical-$(date -u +%Y%m%d)"
GPU2_NAME="beanstech-elite-health-2"

step_image() {
  local id
  id=$(aliyun ecs DescribeImages --region "$SG_REGION" --RegionId "$SG_REGION" --ImageOwnerAlias self --ImageName "$IMG_NAME" --Status Creating,Available,Waiting | grep -o '"ImageId": *"[^"]*"' | head -1 | grep -o 'm-[a-z0-9]*' || true)
  if [ -z "$id" ]; then
    id=$(aliyun ecs CreateImage --region "$SG_REGION" --RegionId "$SG_REGION" --InstanceId "$ECS_GPU1" --ImageName "$IMG_NAME" \
          --Description "elite-health c/ modelos médicos residentes (ollama×2, whisper, chexagent, router)" | grep -o 'm-[a-z0-9]*')
    echo "imagem $id criando (snapshot de 200 GB ESSD; ~10–20 min)"
  fi
  while :; do
    st=$(aliyun ecs DescribeImages --region "$SG_REGION" --RegionId "$SG_REGION" --ImageId "$id" --Status Creating,Available,Waiting,CreateFailed | grep -o '"Status": *"[A-Za-z]*"' | head -1 | grep -o '[A-Za-z]*"$' | tr -d '"')
    pr=$(aliyun ecs DescribeImages --region "$SG_REGION" --RegionId "$SG_REGION" --ImageId "$id" --Status Creating,Available,Waiting,CreateFailed | grep -o '"Progress": *"[^"]*"' | head -1)
    echo "  $id $st $pr"; [ "$st" = "Available" ] && break; sleep 30
  done
  echo "$id" > gpu2/.image-id; echo "ok: imagem $id"
}

step_create() {
  local img; img=$(cat gpu2/.image-id)
  local sg; sg=$(aliyun ecs DescribeInstanceAttribute --region "$SG_REGION" --InstanceId "$ECS_GPU1" | grep -o 'sg-[a-z0-9]*' | head -1)
  local vsw; vsw=$(aliyun ecs DescribeInstanceAttribute --region "$SG_REGION" --InstanceId "$ECS_GPU1" | grep -o 'vsw-[a-z0-9]*' | head -1)
  local userdata; userdata=$(base64 -w0 <<'EOF'
#!/bin/bash
hostnamectl set-hostname elite-health-2
# token próprio do gateway nesta réplica (o da elite-health fica só lá); vai ao KMS pelo passo seguinte
head -c 36 /dev/urandom | base64 | tr -d '=+/\n' | head -c 48 > /usr/local/etc/ollama-gateway-token
chmod 600 /usr/local/etc/ollama-gateway-token
systemctl restart ollama-router.service ollama-auth.service 2>/dev/null || true
EOF
)
  local out id
  out=$(aliyun ecs RunInstances --region "$SG_REGION" --RegionId "$SG_REGION" --ImageId "$img" --InstanceType "$GPU_INSTANCE_TYPE" \
        --ZoneId "$GPU_ZONE" --VSwitchId "$vsw" --SecurityGroupId "$sg" --InstanceName "$GPU2_NAME" --HostName elite-health-2 \
        --InstanceChargeType PostPaid --InternetChargeType PayByTraffic --InternetMaxBandwidthOut 100 \
        --SystemDisk.Category cloud_essd --SystemDisk.PerformanceLevel PL1 --SystemDisk.Size 200 \
        --KeyPairName beanstech-gpu --RamRoleName "$RAM_ROLE_RUNTIME" --UserData "$userdata" --Amount 1 \
        --Tag.1.Key vertical --Tag.1.Value healthtech --Tag.2.Key role --Tag.2.Value gpu-medical)
  id=$(echo "$out" | grep -o 'i-[a-z0-9]*' | head -1); [ -n "$id" ] || { echo "$out"; exit 1; }
  echo "$id" > gpu2/.instance-id; echo "instância $id criada — aguardando Running"
  for i in $(seq 1 40); do
    st=$(aliyun ecs DescribeInstances --region "$SG_REGION" --RegionId "$SG_REGION" --InstanceIds "[\"$id\"]" | grep -o '"Status": *"[A-Za-z]*"' | head -1 | grep -o '[A-Za-z]*"$' | tr -d '"')
    [ "$st" = "Running" ] && break; sleep 10
  done
  local ip; ip=$(aliyun ecs DescribeInstances --region "$SG_REGION" --RegionId "$SG_REGION" --InstanceIds "[\"$id\"]" | python3 -c 'import sys,json;d=json.load(sys.stdin);print(d["Instances"]["Instance"][0]["PublicIpAddress"]["IpAddress"][0])')
  echo "$ip" > gpu2/.public-ip; echo "ok: $id Running, IP público $ip (SG já libera 8080 só para br-apps $APPS_EIP)"
}

step_token() {
  local id; id=$(cat gpu2/.instance-id)
  printf '#!/bin/bash\nsleep 20; cat /usr/local/etc/ollama-gateway-token\n' > /tmp/gt.sh
  local tok; tok=$(ecs_run "$SG_REGION" "$id" /tmp/gt.sh 90 | tr -d '\n\r ')
  [ ${#tok} -ge 40 ] && printf '%s' "$tok" | ./kms-put.sh GPU2_GATEWAY_TOKEN - ; rm -f /tmp/gt.sh; unset tok
}

step_smoke() {
  local id; id=$(cat gpu2/.instance-id)
  cat > /tmp/gs.sh <<'EOF'
#!/bin/bash
nvidia-smi --query-gpu=name,memory.used,memory.total --format=csv
for p in 11434 11435; do curl -s http://127.0.0.1:$p/api/ps | python3 -c "import sys,json;[print(':$p',m['name']) for m in json.load(sys.stdin)['models']]"; done
systemctl is-active ollama ollama-gpu1 ollama-router whisper | paste -sd' '
EOF
  ecs_run "$SG_REGION" "$id" /tmp/gs.sh 120; rm -f /tmp/gs.sh
}

case "${1:-all}" in
  image)  step_image ;;
  create) step_create ;;
  token)  step_token ;;
  smoke)  step_smoke ;;
  all)    step_image; step_create; echo "aguardando boot + warm-models (~5 min)"; sleep 240; step_token; step_smoke ;;
esac
