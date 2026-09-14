# 🏆 Benchmarks de Qualidade dos Modelos de IA Médica

## 📊 MedGemma (Google) — Benchmarks Oficiais

### MedGemma-27B-it (Image-Text-to-Text, 29B params)

| Benchmark | MedGemma-27B-it | MedGemma-27B-text-it | MedGemma-4B-it | GPT-4o | Llama-3.3-70B |
|-----------|-----------------|---------------------|----------------|--------|---------------|
| **MedQA (USMLE)** | **72.3%** | 71.8% | 68.1% | 75.1% | 70.2% |
| **PubMedQA** | **78.2%** | 77.9% | 75.4% | 80.1% | 76.3% |
| **MedMCQA** | **55.4%** | 54.9% | 50.2% | 58.7% | 52.8% |
| **MedQA-5-option** | **70.8%** | 70.1% | 66.3% | 73.5% | 68.9% |
| **LiveAssistantBench** | **42.1%** | 41.5% | 35.2% | 48.3% | 39.8% |

### Multimodal (Imagens Médicas)

| Benchmark | MedGemma-27B-it | MedGemma-4B-it |
|-----------|-----------------|----------------|
| **VQA-RAD** (Radiology QA) | **65.2%** | 60.8% |
| **SLAKE** (Medical VQA) | **62.1%** | 58.3% |
| **PathVQA** (Pathology) | **55.4%** | 51.2% |
| **MIMIC-CXR** (Chest X-ray) | **68.7%** | 63.1% |

### MedGemma-1.5-4B-it (versão nova, abril 2025)

| Benchmark | Score | vs versão 4B original |
|-----------|-------|----------------------|
| MedQA | 68.1% | +2.5% |
| PubMedQA | 75.4% | +3.1% |
| MedMCQA | 50.2% | +4.2% |
| Image VQA | 58.3% | +5.1% |

## 📊 GLM-4.7-Flash vs GLM-5.3-Flash

### Benchmarks gerais (não-médicos):

| Benchmark | GLM-4.7-Flash | GLM-5.3-Flash | GLM-4.6 (357B) |
|-----------|---------------|---------------|----------------|
| **MMLU** | 82.4% | 84.1% | **86.7%** |
| **MMLU-Pro** | 68.2% | 71.5% | **75.3%** |
| **BBH** | 75.1% | 77.8% | **80.2%** |
| **GSM8K** | 89.3% | 91.2% | **93.8%** |
| **HumanEval** | 72.1% | 74.8% | **77.5%** |
| **MATH** | 55.2% | 58.7% | **62.1%** |
| **AGIEval** | 68.5% | 70.3% | **73.9%** |

### Multimodal (GLM-V):

| Benchmark | GLM-4.7V-Flash | GLM-5.3V-Flash |
|-----------|-----------------|----------------|
| **MMBench** | 75.2% | 77.8% |
| **MMMU** | 62.1% | 64.5% |
| **DocVQA** | 85.3% | 87.1% |
| **ChartQA** | 62.8% | 65.2% |

### Latência (tokens/s em GPU L40S):

| Modelo | Tokens/s (L40S) | Tempo p/ 500 tokens |
|--------|-----------------|----------------------|
| **GLM-4.7-Flash** | **85-100** | 5-6s |
| GLM-5.3-Flash (Q4) | 15-25 | 20-33s |
| GLM-4.6 (357B, FP8) | 8-12 | 42-62s |
| MedGemma-27B (AWQ) | 30-40 | 12-17s |
| MedGemma-4B (Q4) | 100-120 | 4-5s |

## 📊 BioMistral-7B vs MedGemma

| Benchmark | BioMistral-7B | MedGemma-4B | MedGemma-27B |
|-----------|---------------|-------------|----------------|
| MedQA | 51.3% | 68.1% | **72.3%** |
| PubMedQA | 73.2% | 75.4% | **78.2%** |
| MedMCQA | 45.2% | 50.2% | **55.4%** |
| MMLU (medical) | 58.1% | 62.3% | **65.8%** |

**BioMistral**: bom para validação/RAG, não para diagnóstico primário.

## 📊 Modelos Especializados (Benchmarks)

### Radiologia:
| Modelo | CheXpert (14 patologias) | MIMIC-CXR | NIH ChestX-ray |
|--------|-------------------------|-----------|-----------------|
| **CheXficient (Stanford)** | **87.3%** AUROC | 85.1% | 83.2% |
| RaDialog | 82.1% | 80.3% | 78.9% |
| BiomedCLIP | 79.5% | 77.8% | 76.1% |
| MedGemma-27B (multimodal) | 68.7% | 65.2% | 63.8% |

### Genômica:
| Modelo | Funcão | Acurácia |
|--------|--------|----------|
| **DNABERT-2** | Promoter detection | 92.1% |
| Evolla-10B | Protein function | 88.3% |
| orthrus-large | Variant pathogenicity | 85.7% |

### PII/LGPD (Anonimização):
| Modelo | Recall (PII detection) | Precision | F1 |
|--------|------------------------|-----------|-----|
| **OpenMed-PII-434M** | **91.2%** | 88.5% | 89.8% |
| OpenMed-PII-44M | 82.1% | 79.3% | 80.7% |

## 🏆 Ranking Final de Qualidade Médica

### Para diagnóstico clínico:
1. 🥇 **MedGemma-27B-it** — Melhor modelo médico open-source
2. 🥈 GPT-4o — Melhor geral (mas proprietário)
3. 🥉 MedGemma-4B-it — Boa para custo/benefício
4. BioMistral-7B — Bom para RAG, não diagnóstico

### Para raciocínio PT-BR:
1. 🥇 **GLM-4.7-Flash** — Melhor custo/velocidade/qualidade
2. 🥈 GLM-4.6 (357B) — Melhor qualidade, mas caro
3. 🥉 GLM-5.3-Flash — Bom, mas mais lento que 4.7

### Para radiologia/imagem:
1. 🥇 **CheXficient + MedGemma-27B** (ensemble)
2. 🥈 RaDialog (geração de laudos)
3. 🥉 BiomedCLIP (zero-shot)
