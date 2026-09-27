#!/usr/bin/env bash
# Cria a frota Blackwell em us-east-1a: elite-va (gn9gc-4x) + flash-va (gn9gc-8x).
# uso: gpu-blackwell/create-blackwell.sh [elite|flash|both]
set -euo pipefail
cd "$(dirname "$0")/.."; source ./env.sh
R=us-east-1; Z=us-east-1a; VPC=vpc-0xidmmyx6he0yalgu39ga; VSW=vsw-0xi1cax5caujbpplqm6ls
IMG=ubuntu_24_04_x64_100G_with_open_source_gpu_driver_and_cuda_alibase_20260519.vhd
WHAT=${1:-both}

# token novo da frota flash (idempotente)
aliyun kms DescribeSecret --region "$KMS_REGION" --SecretName FLASH_API_TOKEN >/dev/null 2>&1 || ./kms-put.sh FLASH_API_TOKEN --generate 36

# security group única
SG=$(aliyun ecs DescribeSecurityGroups --region $R --RegionId $R --VpcId $VPC --SecurityGroupName btech-blackwell-va 2>/dev/null | grep -o 'sg-[a-z0-9]*' | head -1 || true)
if [ -z "$SG" ]; then
  SG=$(aliyun ecs CreateSecurityGroup --region $R --RegionId $R --VpcId $VPC --SecurityGroupName btech-blackwell-va --Description "vLLM Blackwell fleet VA" | grep -o 'sg-[a-z0-9]*')
  aliyun ecs AuthorizeSecurityGroup --region $R --RegionId $R --SecurityGroupId $SG --IpProtocol tcp --PortRange 22/22 --SourceCidrIp 189.100.71.89/32 --Description dev >/dev/null
  for src in "$APPS_EIP/32 br-apps" "189.100.71.89/32 dev"; do set -- $src
    aliyun ecs AuthorizeSecurityGroup --region $R --RegionId $R --SecurityGroupId $SG --IpProtocol tcp --PortRange 8000/8010 --SourceCidrIp $1 --Description "vllm $2" >/dev/null; done
fi
echo "SG $SG"

wait_running() { # id
  for i in $(seq 1 40); do
    st=$(aliyun ecs DescribeInstances --region $R --RegionId $R --InstanceIds "[\"$1\"]" | grep -o '"Status": *"[A-Za-z]*"' | head -1 | grep -o '[A-Za-z]*"$' | tr -d '"')
    [ "$st" = Running ] && return 0; sleep 10; done; return 1
}
pubip() { aliyun ecs DescribeInstances --region $R --RegionId $R --InstanceIds "[\"$1\"]" | python3 -c 'import sys,json;print(json.load(sys.stdin)["Instances"]["Instance"][0]["PublicIpAddress"]["IpAddress"][0])'; }

create() { # tipo nome host userdata disk
  local TYPE=$1 NAME=$2 HOST=$3 UD=$4 DISK=$5
  local USERDATA=$(base64 -w0 "gpu-blackwell/$UD")
  local out=$(aliyun ecs RunInstances --region $R --RegionId $R --ZoneId $Z --InstanceType $TYPE --ImageId $IMG --VSwitchId $VSW --SecurityGroupId $SG \
    --InstanceName $NAME --HostName $HOST --InstanceChargeType PostPaid \
    --InternetChargeType PayByTraffic --InternetMaxBandwidthOut 100 \
    --SystemDisk.Category cloud_essd --SystemDisk.Size 100 --DataDisk.1.Category cloud_essd --DataDisk.1.Size $DISK --DataDisk.1.PerformanceLevel PL1 \
    --KeyPairName beanstech-gpu-va --RamRoleName "$RAM_ROLE_RUNTIME" --UserData "$USERDATA" --Amount 1 \
    --Tag.1.Key vertical --Tag.1.Value healthtech --Tag.2.Key role --Tag.2.Value gpu-blackwell)
  local id=$(echo "$out" | grep -o 'i-[a-z0-9]*' | head -1); [ -n "$id" ] || { echo "$out"; exit 1; }
  echo "$id" > "gpu-blackwell/.${HOST}-id"
  wait_running "$id"
  local ip=$(pubip "$id"); echo "$ip" > "gpu-blackwell/.${HOST}-ip"
  echo "ok: $NAME $TYPE $id Running · IP $ip"
}

[ "$WHAT" = elite ] || [ "$WHAT" = both ] && create ecs.gn9gc-4x.32xlarge beanstech-elite-va elite-va userdata-elite-va.sh 500
[ "$WHAT" = flash ] || [ "$WHAT" = both ] && create ecs.gn9gc-8x.64xlarge beanstech-flash-va flash-va userdata-flash-va.sh 1000
echo "acompanhar: ecs_run us-east-1 <id> 'tail -5 /var/log/blackwell-bootstrap.log /var/log/fetch.log; docker ps'"
