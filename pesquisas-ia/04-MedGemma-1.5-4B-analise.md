# 📝 MedGemma-1.5-4B — Por que usar (e por que NÃO usar)

## ✅ Por que USAR o MedGemma-1.5-4B

| Vantagem | Detalhe |
|----------|---------|
| **Velocidade** | 3x mais rápido que o 27B (4B params vs 27B) |
| **Baixo custo** | Cabe em RTX 4090 com folga (~3GB VRAM) |
| **Qualidade** | GPT-4 level em resumos médicos (MedQA: 68%) |
| **Multimodal** | Entende imagens médicas (raio-X, dermatologia) |
| **Versão mais nova** | "1.5" = atualizado com mais dados médicos que versão original |
| **PT-BR** | Funciona bem em português (Gemma 3 base é multilíngue) |
| **Já temos** | `medgemma-1.5-4b-it-Q4_K_M.gguf` (2.4GB) baixado localmente |

### Benchmarks MedGemma-1.5-4B (do HuggingFace):
- **MedQA (USMLE)**: 68% (vs 65% do 27B original, vs 72% do 27B-it)
- **PubMedQA**: 78%
- **MedMCQA**: 55%
- **Image-based QA**: 65% (raio-X, dermatologia)

### Quando usar MedGemma-1.5-4B:
1. **Resumo de prontuários** (texto longo → sumário)
2. **Triagem rápida** (primeira resposta, depois confirma com 27B)
3. **Dispositivos com menos GPU** (RTX 4090, celular)
4. **PetIQ.tech** (veterinária — menos crítico)
5. **dodr.ai mobile** (Flutter app)

## ❌ Por que NÃO usar (limitações)

| Limitação | Detalhe |
|-----------|---------|
| **Raciocínio complexo** | 27B é muito melhor em diagnóstico diferencial |
| **Casos raros** | 4B alucina mais em doenças raras |
| **Imagem detalhada** | 27B tem melhor acurácia em radiologia |
| **Einstein demo** | Precisa impressionar → use 27B |

## 🎯 Estratégia: Time em Camadas

```
┌─────────────────────────────────────────────┐
│  CAMADA 1: RÁPIDA (medgemma-1.5-4b)         │
│  → Triagem, resumo, primeira resposta       │
│  → ~100 tokens/s na GPU                     │
├─────────────────────────────────────────────┤
│  CAMADA 2: PRECISA (medgemma-27b-it)        │
│  → Diagnóstico, imagem, casos complexos    │
│  → ~30 tokens/s na GPU                     │
├─────────────────────────────────────────────┤
│  CAMADA 3: INTELIGENTE (GLM-4.7-Flash)      │
│  → Raciocínio, PT-BR, explicação paciente   │
│  → ~80 tokens/s na GPU                     │
└─────────────────────────────────────────────┘
```

### Fluxo de inferência:
1. **Pergunta chega** → medgemma-1.5-4b faz triagem rápida
2. **Se médico confirma** → medgemma-27b faz diagnóstico detalhado
3. **GLM-4.7** traduz/explica em PT-BR para o paciente
