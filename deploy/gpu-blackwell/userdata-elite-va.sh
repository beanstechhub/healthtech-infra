#!/bin/bash
# bootstrap: beanstech-elite-va (gn9gc-4x, 4× L20N 72G)
# medgemma-27b :8001 (GPU0) · lingshu-32b :8002 (GPU1) · antangelmed :8000 (TP2 GPU2-3) · TRELLIS.2 (serviço fase 2)
exec > /var/log/blackwell-bootstrap.log 2>&1; set -x
export DEBIAN_FRONTEND=noninteractive
hostnamectl set-hostname elite-va
d=$(lsblk -dpno NAME,TYPE | awk '$2=="disk"' | grep -v "$(findmnt -no SOURCE / | sed 's/p\?[0-9]*$//')" | head -1 | cut -d' ' -f1)
[ -n "$d" ] && { blkid "$d" >/dev/null || mkfs.ext4 -q -L data "$d"; mkdir -p /data; grep -q LABEL=data /etc/fstab || echo 'LABEL=data /data ext4 defaults,nofail 0 2' >> /etc/fstab; mount -a; }
mkdir -p /data/models /data/hf; ln -sfn /data/models /models
apt-get update -qq; apt-get install -y -qq docker.io aria2 curl gnupg python3 >/dev/null
if ! docker info 2>/dev/null | grep -q nvidia; then
  curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
  curl -fsSL https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' > /etc/apt/sources.list.d/nvidia-container-toolkit.list
  apt-get update -qq; apt-get install -y -qq nvidia-container-toolkit >/dev/null
  nvidia-ctk runtime configure --runtime=docker >/dev/null; systemctl restart docker
fi
cd /tmp && curl -fsSL -o a.tgz https://aliyuncli.alicdn.com/aliyun-cli-linux-latest-amd64.tgz && tar xzf a.tgz && install -m0755 aliyun /usr/local/bin/aliyun
aliyun configure set --profile ecs --mode EcsRamRole --ram-role-name btech-ecs-runtime --region ap-southeast-1 >/dev/null
install -d -m 0700 /etc/vllm
for t in GPU_GATEWAY_TOKEN GPU2_GATEWAY_TOKEN ANTMED_API_TOKEN FLASH_API_TOKEN HUGGING_FACE; do
  aliyun --profile ecs kms GetSecretValue --region ap-southeast-1 --SecretName $t 2>/dev/null | python3 -c "import sys,json;print('$t='+json.load(sys.stdin)['SecretData'])" >> /etc/vllm/tokens || true
done
chmod 600 /etc/vllm/tokens

VLLM_IMAGE=vllm/vllm-openai:v0.29.0
docker pull -q $VLLM_IMAGE &

cat > /usr/local/bin/fetch.sh <<'X'
#!/bin/bash
exec >> /var/log/fetch.log 2>&1
repo=$1; dir=$2; svc=$3; D=/data/models/$2; mkdir -p $D
HF=$(grep ^HUGGING_FACE= /etc/vllm/tokens | cut -d= -f2)
curl -s -m 30 -H "Authorization: Bearer $HF" "https://huggingface.co/api/models/$repo" | python3 -c "
import sys,json
for s in json.load(sys.stdin)['siblings']:
    f=s['rfilename']
    if f.startswith(('.git','README')) or f.endswith(('.md','.png','.jpg')): continue
    print('https://huggingface.co/$repo/resolve/main/'+f); print('  out='+f)" > $D.list
A=(); [ -n "$HF" ] && A=(--header "Authorization: Bearer $HF")
aria2c -i $D.list -d $D -x16 -s16 -j4 -k 8M --continue=true --auto-file-renaming=false --allow-overwrite=true "${A[@]}" --file-allocation=falloc --console-log-level=warn --summary-interval=300
echo "$(date -Is) $repo -> exit $? $(du -sh $D | cut -f1)"
[ -f $D/config.json ] && systemctl enable --now vllm-$svc 2>&1 && echo "$(date -Is) vllm-$svc iniciado"
X
chmod 700 /usr/local/bin/fetch.sh

mkunit() { # nome porta cvd modelopath extrargs tokensecret
cat > /etc/systemd/system/vllm-$1.service <<U
[Unit]
Description=vLLM $1
After=docker.service
Requires=docker.service
[Service]
EnvironmentFile=/etc/vllm/env-$1
Restart=always
RestartSec=15
TimeoutStartSec=0
ExecStartPre=-/usr/bin/docker rm -f vllm-$1
ExecStart=/usr/bin/docker run --name vllm-$1 --gpus all -e CUDA_VISIBLE_DEVICES=$3 --ipc=host --shm-size 16g -p 0.0.0.0:$2:8000 -v /data/models:/models:ro -v /data/hf:/root/.cache/huggingface vllm/vllm-openai:v0.29.0 --model /models/$4 --served-model-name $1 --host 0.0.0.0 --port 8000 $5
ExecStop=/usr/bin/docker stop vllm-$1
[Install]
WantedBy=multi-user.target
U
grep -E "^$6" /etc/vllm/tokens | sed "s/^$6=/VLLM_API_KEY=/" > /etc/vllm/env-$1; chmod 600 /etc/vllm/env-$1
}

mkunit medgemma-27b   8001 0   MedGemma-27B-FP8   "--quantization fp8 --max-model-len 16384 --gpu-memory-utilization 0.72 --max-num-seqs 16 --enable-prefix-caching" GPU_GATEWAY_TOKEN
mkunit lingshu-32b   8002 1   Lingshu-32B        "--quantization fp8 --max-model-len 12288 --gpu-memory-utilization 0.78 --max-num-seqs 16 --enable-prefix-caching --limit-mm-per-prompt "{\\\"image\\\":4}"" GPU2_GATEWAY_TOKEN
mkunit antangelmed   8000 2,3 AntAngelMed-FP8    "--tensor-parallel-size 2 --max-model-len 32768 --gpu-memory-utilization 0.90 --max-num-seqs 48 --enable-prefix-caching --trust-remote-code --reasoning-parser qwen3" ANTMED_API_TOKEN
systemctl daemon-reload

cat > /usr/local/bin/fetch-all.sh <<'X'
#!/bin/bash
fetch.sh google/medgemma-27b-it MedGemma-27B-FP8 medgemma-27b
fetch.sh lingshu-medical-mllm/Lingshu-32B Lingshu-32B lingshu-32b
fetch.sh MedAIBase/AntAngelMed-FP8 AntAngelMed-FP8 antangelmed
fetch.sh microsoft/TRELLIS.2-4B TRELLIS.2-4B none   # serviço próprio (fase 2) — só download
X
chmod 700 /usr/local/bin/fetch-all.sh
nohup /usr/local/bin/fetch-all.sh >/dev/null 2>&1 &
echo "bootstrap elite-va done $(date -Is)"
