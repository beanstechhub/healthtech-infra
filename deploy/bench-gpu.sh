#!/usr/bin/env bash
# Mede tokens/s reais de cada endpoint (substitui os valores [ref] de NUVEM-PRIVADA-INTEGRACAO-E-PRECOS.md §3).
# Roda a partir do br-apps (único host com acesso a todos os gateways). uso: bench-gpu.sh
set -euo pipefail
cd "$(dirname "$0")"; source ./env.sh
cat > /tmp/bench.sh <<'B'
#!/bin/bash
set -a; . /etc/healthtech/drogaria.env; set +a
GPU2=$(aliyun --profile ecs kms GetSecretValue --region ap-southeast-1 --SecretName GPU2_GATEWAY_TOKEN | python3 -c 'import sys,json;print(json.load(sys.stdin)["SecretData"],end="")')
P="Explique em detalhe, em português, os cuidados na prescrição de anticoagulantes orais em idosos com insuficiência renal."
oa() { # openai-compatible: base key model
  s=$(date +%s.%N); r=$(curl -s -m 300 "$1/chat/completions" -H "Authorization: Bearer $2" -H 'content-type: application/json' -d "{\"model\":\"$3\",\"messages\":[{\"role\":\"user\",\"content\":\"$P\"}],\"max_tokens\":256,\"temperature\":0.2}"); e=$(date +%s.%N)
  echo "$r" | python3 -c "import sys,json;d=json.load(sys.stdin);u=d.get('usage',{});t=$e-$s;print(f'  {\"$3\":22} out {u.get(\"completion_tokens\",0):4} tok em {t:5.1f}s → {u.get(\"completion_tokens\",0)/t:6.1f} tok/s')" 2>/dev/null || echo "  $3: sem resposta"
}
ol() { curl -s -m 300 "$OLLAMA_BASE_URL/api/generate" -H "Authorization: Bearer $OLLAMA_API_KEY" -d "{\"model\":\"$1\",\"prompt\":\"$P\",\"stream\":false,\"options\":{\"num_predict\":256}}" | python3 -c "import sys,json;d=json.load(sys.stdin);print(f'  {\"$1\":22} out {d[\"eval_count\"]:4} tok → {d[\"eval_count\"]/(d[\"eval_duration\"]/1e9):6.1f} tok/s | prompt {d[\"prompt_eval_count\"]/(d[\"prompt_eval_duration\"]/1e9):7.1f} tok/s')" 2>/dev/null || echo "  $1: sem resposta"; }
echo "== elite-health (Ollama)"; for m in medgemma:27b medgemma-1.5-4b:latest granite4.1:30b-q4 granite3-guardian:8b qwen3-vl:8b; do ol $m; done
echo "== elite-health-2 (vLLM)"; oa http://43.98.194.204:8002/v1 "$GPU2" baichuan-m2; oa http://43.98.194.204:8003/v1 "$GPU2" lingshu-i-8b; oa http://43.98.194.204:8001/v1 "$GPU2" lingshu-32b
echo "== m3-va (vLLM)"; oa "$EXCELLENCE_BASE_URL" "$EXCELLENCE_API_KEY" baichuan-m3
echo "== Model Studio"; oa "$QWEN_BASE_URL" "$QWEN_API_KEY" qwen-plus
B
ecs_run "$BR_REGION" "$ECS_APPS" /tmp/bench.sh 900; rm -f /tmp/bench.sh
