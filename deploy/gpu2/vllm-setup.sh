#!/bin/bash
# Roda NA elite-health-2. Converte a máquina de Ollama (réplica do medgemma) para vLLM com o time novo:
#   :8001 GPU0  Lingshu-32B (Qwen2.5-VL, MIT)      bf16 67 GB → carregado em 4 bits via bitsandbytes (~20 GB)
#   :8002 GPU1  Baichuan-M2-32B-GPTQ-Int4 (Apache)  19 GB
#   :8003 GPU1  Lingshu-I-8B (InternVL, MIT)         16 GB bf16
# Todos OpenAI-compatible com --api-key = GPU2_GATEWAY_TOKEN (KMS). Downloads via aria2 (16 conexões) em background;
# cada serviço sobe quando o seu modelo termina. medgemma sai desta máquina (já vive na elite-health).
set -euo pipefail
export HOME=/root DEBIAN_FRONTEND=noninteractive
systemctl disable --now warm-models ollama-gpu1 ollama ollama-router ollama-auth 2>/dev/null || true
pkill -f restore-medgemma-q8 || true; pkill -f "[o]llama pull" || true
apt-get install -y -qq docker.io aria2 curl gnupg >/dev/null 2>&1 || (apt-get update -qq && apt-get install -y -qq docker.io aria2 curl gnupg >/dev/null)
if ! docker info 2>/dev/null | grep -q nvidia; then
  curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
  curl -fsSL https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' > /etc/apt/sources.list.d/nvidia-container-toolkit.list
  apt-get update -qq && apt-get install -y -qq nvidia-container-toolkit >/dev/null; nvidia-ctk runtime configure --runtime=docker >/dev/null; systemctl restart docker
fi
aliyun configure set --profile ecs --mode EcsRamRole --ram-role-name btech-ecs-runtime --region ap-southeast-1 >/dev/null
install -d -m 0700 /etc/vllm; aliyun --profile ecs kms GetSecretValue --region ap-southeast-1 --SecretName GPU2_GATEWAY_TOKEN | python3 -c 'import sys,json;print("VLLM_API_KEY="+json.load(sys.stdin)["SecretData"])' > /etc/vllm/env; chmod 600 /etc/vllm/env
mkdir -p /data/models; ln -sfn /data/models /models
# libera espaço: medgemma (Q4 errado) e blobs órfãos do ollama
ollama rm medgemma:27b medgemma-1.5-4b:latest hf.co/unsloth/MedGemma-27B-it-GGUF:Q8_0 >/dev/null 2>&1 || true

unit() { # nome porta gpu modelo extra-args
cat > /etc/systemd/system/vllm-$1.service <<U
[Unit]
Description=vLLM $1 ($4)
After=docker.service
Requires=docker.service
[Service]
EnvironmentFile=/etc/vllm/env
Restart=always
RestartSec=15
TimeoutStartSec=0
ExecStartPre=-/usr/bin/docker rm -f vllm-$1
ExecStart=/usr/bin/docker run --name vllm-$1 --gpus '"device=$3"' --ipc=host --shm-size 16g -p 0.0.0.0:$2:8000 -v /data/models:/models:ro -v /data/hfcache:/root/.cache/huggingface -e VLLM_API_KEY=\${VLLM_API_KEY} vllm/vllm-openai:latest --model /models/$4 --served-model-name $1 --host 0.0.0.0 --port 8000 --max-num-seqs 16 --enable-prefix-caching $5
ExecStop=/usr/bin/docker stop vllm-$1
[Install]
WantedBy=multi-user.target
U
}
unit lingshu-32b 8001 0 Lingshu-32B "--quantization bitsandbytes --load-format bitsandbytes --max-model-len 16384 --gpu-memory-utilization 0.90 --limit-mm-per-prompt image=4"
unit baichuan-m2 8002 1 Baichuan-M2-32B-GPTQ-Int4 "--max-model-len 16384 --gpu-memory-utilization 0.50"
unit lingshu-i-8b 8003 1 Lingshu-I-8B "--max-model-len 8192 --gpu-memory-utilization 0.42 --limit-mm-per-prompt image=4 --trust-remote-code"
systemctl daemon-reload

cat > /usr/local/bin/gpu2-fetch.sh <<'X'
#!/bin/bash
# baixa um repo HF inteiro com aria2 e sobe o serviço vLLM correspondente
exec >> /var/log/gpu2-fetch.log 2>&1
repo=$1; dir=$2; svc=$3; D=/data/models/$dir; mkdir -p $D
curl -s -m 30 "https://huggingface.co/api/models/$repo" | python3 -c "
import sys,json
for s in json.load(sys.stdin)['siblings']:
    f=s['rfilename']
    if f.startswith(('.git','README')) or f.endswith(('.md','.png','.jpg')): continue
    print('https://huggingface.co/$repo/resolve/main/'+f); print('  out='+f)" > $D.list
aria2c -i $D.list -d $D -x16 -s16 -j3 -k 8M --continue=true --auto-file-renaming=false --allow-overwrite=true --file-allocation=falloc --console-log-level=warn --summary-interval=120
echo "$(date -Is) $repo → aria2 exit $? · $(du -sh $D | cut -f1)"; [ -f $D/config.json ] && systemctl enable --now vllm-$svc && echo "$(date -Is) vllm-$svc iniciado"
X
chmod 700 /usr/local/bin/gpu2-fetch.sh
cat > /usr/local/bin/gpu2-fetch-all.sh <<'X'
#!/bin/bash
/usr/local/bin/gpu2-fetch.sh baichuan-inc/Baichuan-M2-32B-GPTQ-Int4 Baichuan-M2-32B-GPTQ-Int4 baichuan-m2
/usr/local/bin/gpu2-fetch.sh lingshu-medical-mllm/Lingshu-I-8B Lingshu-I-8B lingshu-i-8b
/usr/local/bin/gpu2-fetch.sh lingshu-medical-mllm/Lingshu-32B Lingshu-32B lingshu-32b
X
chmod 700 /usr/local/bin/gpu2-fetch-all.sh
docker pull -q vllm/vllm-openai:latest >/dev/null 2>&1 &
nohup /usr/local/bin/gpu2-fetch-all.sh >/dev/null 2>&1 &
echo "ok: ollama parado · vLLM units criadas (8001/8002/8003) · downloads iniciados (~100 GB, ~2,5 h a 100 Mbps)"
nvidia-smi --query-gpu=memory.used --format=csv,noheader | paste -sd' '; df -h / | tail -1
