#!/usr/bin/env bash
set -euo pipefail
export OLLAMA_BASE_URL OLLAMA_API_KEY QWEN_BASE_URL QWEN_API_KEY EXCELLENCE_BASE_URL EXCELLENCE_API_KEY
TS=$(date -u +%Y%m%d-%H%M); OUT=/tmp/eval-$TS; mkdir -p "$OUT"
MODELS=("$@")
[ ${#MODELS[@]} -eq 0 ] && MODELS=(baichuan-m3 antangelmed baichuan-m2 qwen-plus)
python3 /tmp/eval/run.py "$OUT" /tmp/eval/cases.json 'Você é um assistente médico. Responda em português, objetivo, estruturado em: Raciocínio clínico, Condutas a considerar, Verificar antes de decidir, O que não posso afirmar. Nunca invente dose; se não tiver certeza, diga confirmar em bula/protocolo. Máximo 350 palavras.' "${MODELS[@]}"
echo "Resultado: $OUT/results.json"
