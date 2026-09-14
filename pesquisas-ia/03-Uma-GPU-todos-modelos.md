# 🏥 Uma GPU para Todos os Modelos? — Análise

## 🎯 Resposta: SIM, cabe tudo numa L40S (48GB)

### Modelos que cabem simultaneamente na L40S (48GB VRAM):

| Modelo | VRAM (FP16) | VRAM (Q4/AWQ) | Cabe junto? |
|--------|-------------|----------------|-------------|
| **MedGemma-27B-it** | 54GB | ~16GB (AWQ) | ✅ |
| **GLM-4.7-Flash** | 18GB | ~5GB (Q4) | ✅ |
| **MedGemma-4b-it** | 8GB | ~3GB (Q4) | ✅ |
| **BioMistral-7B** | 14GB | ~4GB (Q4) | ✅ |
| **MedASR (Google)** | 0.2GB | 0.2GB | ✅ |
| **BioLORD-2023** | 0.4GB | 0.4GB | ✅ |
| **OpenMed-PII-434M** | 0.8GB | 0.4GB | ✅ |
| **TOTAL** | — | **~29GB** | ✅ **48GB VRAM suficiente** |

### Com vLLM Multi-Model Serving:
```bash
# vLLM suporta múltiplos modelos na mesma GPU
vllm serve google/medgemma-27b-it --port 8000 --gpu-memory-utilization 0.35
vllm serve zai-org/GLM-4.7-Flash --port 8001 --gpu-memory-utilization 0.15
vllm serve google/medgemma-4b-it --port 8002 --gpu-memory-utilization 0.10
vllm serve BioMistral/BioMistral-7B --port 8003 --gpu-memory-utilization 0.10
```

### Reserva de VRAM para contexto:
- 48GB - 29GB (modelos) = **19GB livres** para KV cache
- Cada modelo com `max-model-len 8192` usa ~2-4GB de KV cache
- **Funciona perfeitamente** com folga

## 💰 Custo: 92 créditos/hora × 24h = $2.208/dia

### Alternativa: RTX 4090 (24GB) — Mais barata

| Modelo | VRAM (Q4) | Cabe na 4090? |
|--------|-----------|----------------|
| GLM-4.7-Flash | 5GB | ✅ |
| MedGemma-4b-it | 3GB | ✅ |
| BioMistral-7B | 4GB | ✅ |
| MedGemma-27B (Q4) | 16GB | ✅ (sozinho) |

**Problema da 4090**: MedGemma-27B + GLM-4.7 juntos = 21GB → funciona mas sem folga para contexto.

### Plano recomendado:

| GPU | Modelos | Custo/h | Duração $5.998 |
|-----|---------|---------|----------------|
| **RTX 4090** | GLM-4.7 + MedGemma-4B + BioMistral | 38 | 6,5 dias |
| **L40S** | TODOS os modelos juntos | 92 | 2,7 dias |
| **B200** | GLM-4.6 (357B) para demo | 450 | 13 horas |

**Estratégia**: L40S para demo inicial (2-3 dias), depois migrar para RTX 4090 em produção contínua (6+ dias).
