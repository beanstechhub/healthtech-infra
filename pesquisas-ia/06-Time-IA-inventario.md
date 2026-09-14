# 📋 Time de IA BeansHealth — Inventário Completo

## 📁 Material Encontrado nas Pastas

### 1. beansm/ (10 Fases do BeansMind AI)
```
fase01-fundacao/
fase02-inference-gateway/
  └── inference_gateway.py       ← Gateway de inferência Python
fase03-integracao-produtos/
  ├── model_router.ts             ← Roteador de modelos TypeScript
  └── product_config.yaml         ← Config de produtos
fase05-avaliacao-benchmark/
  └── prompts_benchmark.py        ← Prompts para benchmark médico
fase06-deploy-gpu/
fase07-lgpd-compliance/
fase08-fine-tune/
fase09-monitoramento/
fase10-expansao/
```

### 2. beanshealth/shared/ (Agentes + Notebooks)
```
agents/
  instructions/
    └── all_agents.py             ← Instructions de TODOS os agentes médicos
fine-tune-dodr-med.ipynb          ← Notebook de fine-tune para dodr.ai
```

### 3. prontuario.tech/api/ (Audio + AI Scribe)
```
api/dist/services/
  └── ai-scribe.js                ← Transcrição de áudio → SOAP médico
api/.env.example                  ← OPENAI_API_KEY, WHISPER_MODEL
```

### 4. whisper-medical-ptbr/
```
colab_finetune_whisper_medical.py ← Fine-tune Whisper PT-BR médico
README.md                         ← Como treinar
```

### 5. beanshealth/datasets/
```
CID-10, radiologia, SOAP, odontologia, veterinária
scripts/azureml-medgemma-vllm/    ← Scripts de deploy vLLM prontos!
```

## 🧠 Time de IA Atual (do model_router.ts)

O `model_router.ts` já define o roteamento:

| Agente | Modelo | Função | Portal |
|--------|--------|--------|--------|
| **Diagnosticador** | MedGemma-27B | Diagnóstico clínico | dodr.ai, drhealth.tech |
| **Resumidor** | MedGemma-1.5-4B | Resumo de prontuário | prontuario.tech |
| **Raciocínio** | GLM-4.7-Flash | Raciocínio + PT-BR | Todos |
| **Genômica** | DNABERT-2 | Análise de DNA | Laboratórios |
| **Radiologia** | RaDialog + CheXficient | Laudo de raio-X | exame.tech |
| **LGPD/PII** | OpenMed-PII-434M | Anonimização | prontuario.tech |
| **Áudio** | Whisper PT-BR + medasr | Transcrição médica | prontuario.tech |
| **Embeddings** | BioLORD-2023 | RAG médico | Todos |
| **Reranking** | zerank-2-reranker | Ranking de busca | Todos |

## 🔊 Áudio no prontuario.tech

### Como funciona (do ai-scribe.js):
1. Médico fala no app (Flutter/web)
2. **Whisper PT-BR médico** transcreve áudio → texto
3. **MedGemma-1.5-4B** estrutura em formato SOAP:
   - **S**: Subjetivo (queixa do paciente)
   - **O**: Objetivo (sinais/vitais)
   - **A**: Avaliação (diagnóstico)
   - **P**: Plano (conduta)
4. **GLM-4.7** revisa e formata em PT-BR

### Modelos de áudio:
| Modelo | Params | Função | Onde rodar |
|--------|--------|--------|-----------|
| **whisper-medical-ptbr** | 1.5B | STT médico PT-BR | RTX 4090 (fine-tuned) |
| **google/medasr** | 0.1B | ASR médico Google | GPU ou API |
| **Whisper large-v3** | 1.5B | STT geral | GPU |

## 📊 Configuração product_config.yaml (portais → modelos)

```yaml
dodr.ai:
  models: [medgemma-27b-it, glm-4.7-flash, whisper-medical-ptbr]
  gpu: L40S
  
portaldodentista.ai:
  models: [medgemma-27b-it, biomistral-7b, biolord-2023]
  gpu: L40S

exame.tech:
  models: [medgemma-27b-it, radialog, chexficient, biomedclip]
  gpu: B200 (imagens são pesadas)

prontuario.tech:
  models: [medgemma-1.5-4b, glm-4.7-flash, whisper-ptbr, openmed-pii-434m]
  gpu: RTX 4090

drhealth.tech:
  models: [medgemma-27b-it, glm-4.7-flash, biomistral-7b]
  gpu: L40S

petiq.tech:
  models: [medgemma-1.5-4b, biolord-2023]
  gpu: RTX 4090

beansmed.com.br:
  models: ALL (demo)
  gpu: B200 sob demanda
```
