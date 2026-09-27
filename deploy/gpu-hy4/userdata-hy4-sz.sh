#!/bin/bash
# bootstrap: beanstech-hy4-sz (gn9gc-8x, 8× L20N 72G) — Hy4-preview Q4_K_M via llama.cpp
# Hy4-preview (780B MoE, Tencent) — GGUF Q4_K_M 467 GB, única forma que cabe num gn9gc
exec > /var/log/hy4-bootstrap.log 2>&1; set -x
export DEBIAN_FRONTEND=noninteractive
hostnamectl set-hostname hy4-sz
d=$(lsblk -dpno NAME,TYPE | awk '$2=="disk"' | grep -v "$(findmnt -no SOURCE / | sed 's/p\?[0-9]*$//')" | head -1 | cut -d' ' -f1)
[ -n "$d" ] && { blkid "$d" >/dev/null || mkfs.ext4 -q -L data "$d"; mkdir -p /data; grep -q LABEL=data /etc/fstab || echo 'LABEL=data /data ext4 defaults,nofail 0 2' >> /etc/fstab; mount -a; }
mkdir -p /data/models /data/hf; ln -sfn /data/models /models
apt-get update -qq; apt-get install -y -qq docker.io aria2 curl gnupg python3 python3-venv python3-pip >/dev/null
if ! docker info 2>/dev/null | grep -q nvidia; then
  curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
  curl -fsSL https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' > /etc/apt/sources.list.d/nvidia-container-toolkit.list
  apt-get update -qq; apt-get install -y -qq nvidia-container-toolkit >/dev/null
  nvidia-ctk runtime configure --runtime=docker >/dev/null; systemctl restart docker
fi
# mirrors de registry p/ China (Docker Hub/ghcr lentos ou bloqueados)
mkdir -p /etc/docker
[ -f /etc/docker/daemon.json ] || cat > /etc/docker/daemon.json <<'J'
{"registry-mirrors": ["https://docker.m.daocloud.io", "https://docker.1ms.run", "https://hub.rat.dev"]}
J
systemctl restart docker
cd /tmp && curl -fsSL -o a.tgz https://aliyuncli.alicdn.com/aliyun-cli-linux-latest-amd64.tgz && tar xzf a.tgz && install -m0755 aliyun /usr/local/bin/aliyun
aliyun configure set --profile ecs --mode EcsRamRole --ram-role-name btech-ecs-runtime --region ap-southeast-1 >/dev/null
install -d -m 0700 /etc/vllm
for t in HUNYUAN_API_TOKEN HUGGING_FACE; do
  aliyun --profile ecs kms GetSecretValue --region ap-southeast-1 --SecretName $t 2>/dev/null | python3 -c "import sys,json;print('$t='+json.load(sys.stdin)['SecretData'])" >> /etc/vllm/tokens || true
done
chmod 600 /etc/vllm/tokens

# hf CLI + espelho CN (hf-mirror.com é rápido dentro da China)
python3 -m venv /opt/hfenv && /opt/hfenv/bin/pip install -q -U huggingface_hub
cat > /usr/local/bin/fetch-hy4.sh <<'X'
#!/bin/bash
exec >> /var/log/hy4-dl.log 2>&1
HF=$(grep ^HUGGING_FACE= /etc/vllm/tokens | cut -d= -f2)
export HF_TOKEN=$HF HF_HUB_ENABLE_HF_TRANSFER=1 HF_ENDPOINT=https://hf-mirror.com
D=/data/models/Hy4-preview-Q4; mkdir -p $D
/opt/hfenv/bin/hf download AngelSlim/Hy4-preview-GGUF --include "Q4_K_M/*" --local-dir $D
echo "$(date -Is) hy4 exit $?"
X
chmod 700 /usr/local/bin/fetch-hy4.sh

# imagem llama.cpp (server-cuda) — via espelho
cat > /usr/local/bin/pull-llamacpp.sh <<'X'
#!/bin/bash
exec >> /var/log/llamacpp-pull-sz.log 2>&1
for img in "ghcr.io/ggml-org/llama.cpp:server-cuda" "ghcr.nju.edu.cn/ggml-org/llama.cpp:server-cuda"; do
  docker pull $img 2>&1 | tail -1 && docker images | grep -q llama.cpp && { echo "ok: $img"; break; }
done
X
chmod 700 /usr/local/bin/pull-llamacpp.sh

# unit llama.cpp — Hy4 Q4_K_M nas 8 GPUs
TOK=$(grep ^HUNYUAN_API_TOKEN /etc/vllm/tokens | cut -d= -f2)
cat > /etc/systemd/system/llama-hy4.service <<U
[Unit]
Description=llama.cpp — Hy4-preview Q4_K_M (780B, 8 GPUs)
After=docker.service
Requires=docker.service
[Service]
Restart=always
RestartSec=30
TimeoutStartSec=0
ExecStartPre=-/usr/bin/docker rm -f llama-hy4
ExecStart=/usr/bin/docker run --name llama-hy4 --gpus all --ipc=host -p 0.0.0.0:8001:8001 -v /data/models:/models:ro ghcr.io/ggml-org/llama.cpp:server-cuda --host 0.0.0.0 --port 8001 -m /models/Hy4-preview-Q4/Q4_K_M/Hy4-preview-Q4_K_M.gguf -ngl 999 --ctx-size 32768 --parallel 8 --api-key $TOK --jinja
ExecStop=/usr/bin/docker stop llama-hy4
[Install]
WantedBy=multi-user.target
U
systemctl daemon-reload

# watcher: sobe o serviço quando o download completar
cat > /usr/local/bin/hy4-watcher.sh <<'X'
#!/bin/bash
exec >> /var/log/hy4-watcher.log 2>&1
while true; do
  sz=$(du -s --apparent-size -BM /data/models/Hy4-preview-Q4 2>/dev/null | cut -dM -f1)
  n=$(ls /data/models/Hy4-preview-Q4/Q4_K_M/Hy4-preview-Q4_K_M.gguf 2>/dev/null | wc -l)
  if [ -n "$sz" ] && [ "$sz" -ge 467000 ] && [ "$n" -ge 1 ]; then
    if ! systemctl is-active --quiet llama-hy4; then systemctl start llama-hy4 && echo "$(date -Is) llama-hy4 started"; fi
  fi
  sleep 300
done
X
chmod 700 /usr/local/bin/hy4-watcher.sh
nohup /usr/local/bin/pull-llamacpp.sh >/dev/null 2>&1 &
nohup /usr/local/bin/fetch-hy4.sh >/dev/null 2>&1 &
nohup /usr/local/bin/hy4-watcher.sh >/dev/null 2>&1 &
echo "bootstrap hy4-sz done $(date -Is)"
