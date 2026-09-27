#!/bin/bash
# Build do llama.cpp com o patch hyv4 (AngelSlim/Hy4-preview-GGUF) para servir Hy4-preview Q4_K_M.
# Motivo: "Neither file runs on stock llama.cpp. The hyv4 architecture is not upstream."
# Base exigida pelo patch: commit 0cea36222. GPU: RTX PRO 5000 72GB Blackwell (sm_120).
# Docker Hub está bloqueado em cn-shenzhen → toolkit CUDA 13.0 nativo via repo apt da NVIDIA.
exec >> /var/log/hy4-build.log 2>&1
set -x
date -Is
SRC=/data/llama.cpp
PATCH=/data/models/Hy4-preview-Q4/hy4-preview-patch/0001-hyv4-architecture.patch

# 1) nvcc (CUDA 13.0)
if ! /usr/local/cuda-13.0/bin/nvcc --version >/dev/null 2>&1; then
  curl -fsSL -o /tmp/cuda-keyring.deb https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb
  dpkg -i /tmp/cuda-keyring.deb
  apt-get update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq cuda-toolkit-13-0
fi
/usr/local/cuda-13.0/bin/nvcc --version | tail -1

# 2) fontes no commit exato (espelhos: ghfast.top → gh-proxy → codeload direto)
if [ ! -f $SRC/CMakeLists.txt ]; then
  rm -rf $SRC; mkdir -p $SRC
  for u in \
    "https://ghfast.top/https://github.com/ggml-org/llama.cpp/archive/0cea36222.tar.gz" \
    "https://gh-proxy.com/https://github.com/ggml-org/llama.cpp/archive/0cea36222.tar.gz" \
    "https://codeload.github.com/ggml-org/llama.cpp/tar.gz/0cea36222"; do
    echo "source try: $u"
    curl -fL --retry 3 -m 3600 -o /tmp/llamacpp.tgz "$u" && break
  done
  tar xzf /tmp/llamacpp.tgz -C $SRC --strip-components=1
fi
if ! grep -q hyv4 $SRC/src/llama-arch.cpp; then
  (cd $SRC && git apply $PATCH) || (cd $SRC && patch -p1 --fuzz=3 < $PATCH)
fi
grep -c hyv4 $SRC/src/llama-arch.cpp

# 3) build (llama-server é o alvo; llama-cli para sanidade)
export PATH=/usr/local/cuda-13.0/bin:$PATH CUDACXX=/usr/local/cuda-13.0/bin/nvcc
cmake -S $SRC -B $SRC/build-cuda -DGGML_CUDA=ON -DLLAMA_CURL=OFF -DGGML_NATIVE=OFF \
  -DCMAKE_BUILD_TYPE=Release -DCMAKE_CUDA_ARCHITECTURES=120 \
  -DLLAMA_BUILD_UI=OFF -DLLAMA_USE_PREBUILT_UI=OFF
cmake --build $SRC/build-cuda --target llama-server llama-cli -j 128
ls -la $SRC/build-cuda/bin/
date -Is
echo BUILD_DONE
