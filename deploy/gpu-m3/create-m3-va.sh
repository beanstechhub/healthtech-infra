#!/usr/bin/env bash
# Baichuan-M3-235B (Qwen3-MoE 235B/A22B, Apache-2.0) — GPTQ-INT4 oficial (124,5 GB) em vLLM, tensor-parallel 4.
# ecs.gn8is-4x.16xlarge (4× L20 48 GB = 192 GB) em us-east-1a (Virgínia; ~15% mais barato que SG, único com estoque).
# Contrato OpenAI-compatible em :8000 com token (KMS M3_API_TOKEN) — mesmo contrato do Model Studio no evidence-chain.
# uso: gpu-m3/create-m3-va.sh [ondemand|spot]     (spot ≈ −80%, pode ser retomado com 5 min de aviso — só p/ benchmark)
set -euo pipefail
cd "$(dirname "$0")/.."; source ./env.sh
MODE=${1:-ondemand}
R=us-east-1; Z=us-east-1a; VPC=vpc-0xidmmyx6he0yalgu39ga; VSW=vsw-0xi1cax5caujbpplqm6ls
TYPE=ecs.gn8is-4x.16xlarge
IMG=ubuntu_24_04_x64_100G_with_gpu_driver_and_cuda_alibase_20260519.vhd
NAME=beanstech-m3-va
MODEL=baichuan-inc/Baichuan-M3-235B-GPTQ-INT4
VLLM_IMAGE=vllm/vllm-openai:latest      # fixar no digest após a validação (regra: nunca :latest em produção)

# segredos
aliyun kms DescribeSecret --region "$KMS_REGION" --SecretName M3_API_TOKEN >/dev/null 2>&1 || ./kms-put.sh M3_API_TOKEN --generate 36
if ! aliyun ecs DescribeKeyPairs --region $R --RegionId $R --KeyPairName beanstech-gpu-va | grep -q beanstech-gpu-va; then
  aliyun ecs CreateKeyPair --region $R --RegionId $R --KeyPairName beanstech-gpu-va | python3 -c 'import sys,json;print(json.load(sys.stdin)["PrivateKeyBody"],end="")' | ./kms-put.sh SSH_KEY_GPU_VA -
fi
# security group
SG=$(aliyun ecs DescribeSecurityGroups --region $R --RegionId $R --VpcId $VPC --SecurityGroupName btech-m3-va | grep -o 'sg-[a-z0-9]*' | head -1 || true)
if [ -z "$SG" ]; then
  SG=$(aliyun ecs CreateSecurityGroup --region $R --RegionId $R --VpcId $VPC --SecurityGroupName btech-m3-va --Description "vLLM Baichuan-M3" | grep -o 'sg-[a-z0-9]*')
  aliyun ecs AuthorizeSecurityGroup --region $R --RegionId $R --SecurityGroupId $SG --IpProtocol tcp --PortRange 22/22 --SourceCidrIp 189.100.71.89/32 --Description dev >/dev/null
  for src in "$APPS_EIP/32 br-apps" "189.100.71.89/32 dev"; do set -- $src; aliyun ecs AuthorizeSecurityGroup --region $R --RegionId $R --SecurityGroupId $SG --IpProtocol tcp --PortRange 8000/8000 --SourceCidrIp $1 --Description "vllm $2" >/dev/null; done
fi
echo "SG $SG"

USERDATA=$(base64 -w0 <<'EOF'
#!/bin/bash
exec > /var/log/m3-bootstrap.log 2>&1; set -x
export DEBIAN_FRONTEND=noninteractive
hostnamectl set-hostname m3-va
# disco de dados (modelos) → /data
d=$(lsblk -dpno NAME,TYPE | awk '$2=="disk"' | grep -v "$(findmnt -no SOURCE / | sed 's/p\?[0-9]*$//')" | head -1 | cut -d' ' -f1)
[ -n "$d" ] && { blkid "$d" >/dev/null || mkfs.ext4 -q -L data "$d"; mkdir -p /data; grep -q LABEL=data /etc/fstab || echo 'LABEL=data /data ext4 defaults,nofail 0 2' >> /etc/fstab; mount -a; }
mkdir -p /data/hf
# docker + nvidia toolkit
apt-get update -qq; apt-get install -y -qq docker.io curl gnupg >/dev/null
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -fsSL https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' > /etc/apt/sources.list.d/nvidia-container-toolkit.list
apt-get update -qq; apt-get install -y -qq nvidia-container-toolkit >/dev/null
nvidia-ctk runtime configure --runtime=docker >/dev/null; systemctl restart docker
# aliyun CLI (RAM role) → token do KMS
cd /tmp && curl -fsSL -o a.tgz https://aliyuncli.alicdn.com/aliyun-cli-linux-latest-amd64.tgz && tar xzf a.tgz && install -m0755 aliyun /usr/local/bin/aliyun
aliyun configure set --profile ecs --mode EcsRamRole --ram-role-name btech-ecs-runtime --region ap-southeast-1
install -d -m 0700 /etc/m3
aliyun --profile ecs kms GetSecretValue --region ap-southeast-1 --SecretName M3_API_TOKEN | python3 -c 'import sys,json;print("VLLM_API_KEY="+json.load(sys.stdin)["SecretData"])' > /etc/m3/env; chmod 600 /etc/m3/env
cat > /etc/systemd/system/vllm-m3.service <<'U'
[Unit]
Description=vLLM — Baichuan-M3-235B GPTQ-INT4 (TP=4)
After=docker.service network-online.target
Requires=docker.service
[Service]
EnvironmentFile=/etc/m3/env
Restart=always
RestartSec=10
TimeoutStartSec=0
ExecStartPre=-/usr/bin/docker rm -f vllm-m3
ExecStart=/usr/bin/docker run --name vllm-m3 --gpus all --ipc=host --shm-size 32g -p 0.0.0.0:8000:8000 \
  -v /data/hf:/root/.cache/huggingface -e HF_HUB_ENABLE_HF_TRANSFER=1 -e VLLM_API_KEY=${VLLM_API_KEY} \
  __VLLM_IMAGE__ --model __MODEL__ --served-model-name baichuan-m3 \
  --tensor-parallel-size 4 --max-model-len 32768 --gpu-memory-utilization 0.92 \
  --enable-prefix-caching --max-num-seqs 32 --host 0.0.0.0 --port 8000
ExecStop=/usr/bin/docker stop vllm-m3
[Install]
WantedBy=multi-user.target
U
sed -i "s|__VLLM_IMAGE__|VLLM_IMAGE_PLACEHOLDER|; s|__MODEL__|MODEL_PLACEHOLDER|" /etc/systemd/system/vllm-m3.service
systemctl daemon-reload; systemctl enable --now vllm-m3
echo "bootstrap done $(date -Is)"
EOF
)
USERDATA=$(echo "$USERDATA" | base64 -d | sed "s|VLLM_IMAGE_PLACEHOLDER|$VLLM_IMAGE|; s|MODEL_PLACEHOLDER|$MODEL|" | base64 -w0)

SPOT=(); [ "$MODE" = spot ] && SPOT=(--SpotStrategy SpotAsPriceGo --SpotDuration 0)
out=$(aliyun ecs RunInstances --region $R --RegionId $R --ZoneId $Z --InstanceType $TYPE --ImageId $IMG --VSwitchId $VSW --SecurityGroupId $SG \
  --InstanceName $NAME --HostName m3-va --InstanceChargeType PostPaid "${SPOT[@]}" \
  --InternetChargeType PayByTraffic --InternetMaxBandwidthOut 100 \
  --SystemDisk.Category cloud_essd --SystemDisk.Size 100 --DataDisk.1.Category cloud_essd --DataDisk.1.Size 800 --DataDisk.1.PerformanceLevel PL1 \
  --KeyPairName beanstech-gpu-va --RamRoleName "$RAM_ROLE_RUNTIME" --UserData "$USERDATA" --Amount 1 \
  --Tag.1.Key vertical --Tag.1.Value healthtech --Tag.2.Key role --Tag.2.Value gpu-m3)
id=$(echo "$out" | grep -o 'i-[a-z0-9]*' | head -1); [ -n "$id" ] || { echo "$out"; exit 1; }
mkdir -p gpu-m3; echo "$id" > gpu-m3/.instance-id
for i in $(seq 1 40); do st=$(aliyun ecs DescribeInstances --region $R --RegionId $R --InstanceIds "[\"$id\"]" | grep -o '"Status": *"[A-Za-z]*"' | head -1 | grep -o '[A-Za-z]*"$' | tr -d '"'); [ "$st" = Running ] && break; sleep 10; done
ip=$(aliyun ecs DescribeInstances --region $R --RegionId $R --InstanceIds "[\"$id\"]" | python3 -c 'import sys,json;print(json.load(sys.stdin)["Instances"]["Instance"][0]["PublicIpAddress"]["IpAddress"][0])')
echo "$ip" > gpu-m3/.public-ip
echo "ok: $id ($MODE) Running · IP $ip · vLLM em http://$ip:8000/v1 (token M3_API_TOKEN) — download de 125 GB + carga: ~30–45 min"
echo "acompanhar: ecs_run us-east-1 $id <script com: tail /var/log/m3-bootstrap.log; docker logs --tail 20 vllm-m3>"
