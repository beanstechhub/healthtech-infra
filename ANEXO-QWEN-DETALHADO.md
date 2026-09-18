# Anexo Detalhado — Qwen na Área Médica
# Detailed Annex — Qwen in Medicine

**BeansTech Health → Alibaba Brasil · Setembro de 2026**
**Complementa: APRESENTACAO-QWEN-MEDICAL-PT-EN.md**

---

## 1. Arquitetura Qwen na plataforma BeansTech

### 1.1 Modelos Qwen em produção

| Modelo | Arquitetura | Onde roda | Custo efetivo | Função |
|---|---|---|---|---|
| **Qwen3.8-Max** | MoE (centenas de B ativos) | Model Studio API | US$ 1,40/M in · US$ 4,20/M out | raciocínio profundo, casos complexos |
| **Qwen3.5-Omni-Plus** | multimodal (texto+imagem+áudio) | Model Studio API | US$ 1,30/M in · US$ 3,90/M out | multimodal geral, OCR |
| **Qwen3.5-Omni-Flash** | multimodal rápido | Model Studio API | US$ 0,11/M in · US$ 0,42/M out | OCR leve, triagem visual |
| **Lingshu-32B** | Qwen2.5-VL + fine-tune médico | GPU própria (2× L20, SG) | US$ 147/mês (GPU rateada) | imagem médica, VQA clínico |
| **Lingshu-I-8B** | InternVL + fine-tune médico | GPU própria (L20, SG) | US$ 147/mês (GPU rateada) | triagem multimodal leve |
| **Qwen3-Embedding** | embeddings multilíngues | Model Studio API | US$ 0,07/M tokens | recuperação de evidência |

### 1.2 Custo efetivo por resposta clínica (200 tokens in · 600 tokens out)

| Modelo | Custo por 1.000 respostas | Custo por 100.000 respostas |
|---|---|---|
| Qwen3.8-Max | US$ 2,80 | US$ 280 |
| Qwen3.5-Omni-Plus | US$ 2,60 | US$ 260 |
| Qwen3.5-Omni-Flash | US$ 0,27 | US$ 27 |
| Lingshu-32B (GPU própria) | US$ 0 | US$ 0 (GPU já paga) |
| GPT-6 Astra (comparação) | **US$ 32,00** | **US$ 3.200** |
| Claude Opus 5 (comparação) | **US$ 16,00** | **US$ 1.600** |
| GLM-5.3 (comparação) | US$ 4,10 | US$ 410 |

---

## 2. Resultados detalhados por especialidade

### 2.1 Qwen3.8-Max — domínios onde venceu

| Especialidade | Coverage | Melhor da categoria? | Caso exemplo |
|---|---|---|---|
| **Multi-morbidade** | **0,62** | **SIM — 2× melhor que qualquer outro** | Idosa 82 anos, 8 medicamentos, DRC aguda |
| Pneumologia | **0,75** | **SIM** | DPOC grave, VEF1 28%, exacerbador frequente |
| Nefrologia | 0,62 | Empate com DeepSeek e M3 | Enoxaparina em eGFR 22 |
| Gastroenterologia | 0,50 | Empate | Hemorragia digestiva alta, Hb 7 |
| Neurologia | 0,50 | Empate | AVC isquêmico NIHSS 16, janela 2,5h |
| Emergência | 0,47 | 2º (atrás de GLM-5.3) | STEMI sem hemodinâmica |

### 2.2 Lingshu-32B — domínios onde venceu

| Especialidade | Coverage | Detalhe |
|---|---|---|
| **Ortopedia** | **1,00** | Único modelo com coverage perfeito — fratura exposta grau III |
| **Emergência (DPOC)** | venceu o caso em-001 | Único que indicou VNI corretamente para DPOC com pH 7,28 |
| Infectologia | 0,53 | 2º lugar (atrás de GLM-5.3 0,72) |
| Dermatologia | 0,33 | Empate com outros |

### 2.3 Vitórias exclusivas do Qwen3.8-Max

Casos que **nenhum outro modelo** acertou:

1. **com-002** (cirrose Child C + HCC): indicou corretamente transplante, TACE, profilaxia de varizes, discussão multidisciplinar
2. **em-003** (trauma abdominal sem cirurgião): ATLS, FAST, transferência para centro cirúrgico
3. **pne-001** (DPOC grave): terapia tripla, reabilitação pulmonar, vacinação, avaliação transplante
4. **gas-001** (hemorragia digestiva): estabilização, endoscopia <24h, omeprazol IV, alvo Hb 7-8

### 2.4 Vitórias exclusivas do Lingshu-32B

1. **em-001** (DPOC descompensada): único a indicar VNI como primeira escolha com critérios claros
2. **ort-001** (fratura exposta grau III): coverage perfeito 1,0 — antibiótico, desbridamento <6h, antitetânica

---

## 3. Benchmarks publicados do Lingshu (base Qwen2.5-VL)

### 3.1 VQA médica multimodal (média de 7 benchmarks)

| Modelo | Média | Fonte |
|---|---|---|
| **Lingshu-32B** | **66,6** | arXiv:2506.07044 |
| Gemini-2.5-Flash | 65,1 | idem |
| GPT-4.1 | 63,4 | idem |
| Claude Sonnet 4 | 61,5 | idem |
| Lingshu-7B | 61,8 | idem |
| Qwen2.5-VL-32B (base) | 56,1 | idem |
| MedGemma-4B | 54,8 | idem |

**O Lingshu-32B ganha 10,5 pontos sobre o Qwen2.5-VL-32B base** — o fine-tuning médico da DAMO Academy acrescentou valor real.

### 3.2 Radiologia (detalhe)

| Benchmark | Lingshu-32B | GPT-4.1 | Qwen2.5-VL-32B |
|---|---|---|---|
| VQA-RAD | **76,5** | 65,0 | 71,8 |
| SLAKE | **89,2** | 72,2 | 71,2 |

### 3.3 Geração de laudos

| Dataset | Lingshu-32B (RadCliQ-v1) | GPT-4.1 |
|---|---|---|
| MIMIC-CXR | **67,1** | 57,1 |
| CheXpert Plus | **65,6** | 56,3 |
| IU-Xray | **62,4** | 55,7 |

### 3.4 12+ modalidades de imagem suportadas

RX, TC, RM, microscopia, ultrassom, histopatologia, dermatoscopia, fundoscopia, OCT, fotografia digital, endoscopia e PET.

---

## 4. Qwen3.8-Max: raciocínio clínico documentado

### 4.1 O que é

Em 100% dos 51 casos, o Qwen3.8-Max produziu raciocínio clínico explícito antes da resposta. O raciocínio é estruturado, lógico e documentado no campo `reasoning` do response da API.

### 4.2 Por que importa

- **Auditoria médica:** o profissional pode ver como o modelo chegou à conclusão
- **CFM/LGPD:** trilha de decisão exigida por regulação brasileira
- **Pesquisa clínica:** o raciocínio pode ser analisado, corrigido, publicado
- **Concordância inter-modelo:** comparar raciocínios de famílias diferentes revela vieses

### 4.3 Exemplo real (caso de multi-morbidade)

Pergunta: "Idosa 82 anos, HAS, DM2, DRC 3b, FA, ICC FE 35%, em uso de 8 medicamentos. Chega confusa, desidratada, Na 128, cré 3,5 (baseline 1,8). Hipóteses?"

Raciocínio do Qwen3.8-Max (extraído do campo `reasoning`, traduzido):
> "Multiple comorbidities in an elderly patient presenting with acute confusion, dehydration, hyponatremia, and acute kidney injury on chronic disease. The creatinine rise from 1.8 to 3.5 suggests acute-on-chronic kidney injury, likely prerenal from dehydration. The hyponatremia (Na 128) could be dilutional from heart failure or medication-related (thiazides, SSRIs). The confusion warrants evaluation for underlying infection (UTI is common in elderly women). Medication review is critical: diuretics should be held, metformin contraindicated at this eGFR, anticoagulation needs adjustment for renal function..."

### 4.4 Comparação com outros modelos

| Modelo | Reasoning documentado |
|---|---|
| Qwen3.8-Max | **100%** |
| GLM-5.3 | 100% |
| DeepSeek v4 Pro | 100% |
| Baichuan-M3 | 100% |
| GPT-6 Astra | 6% |
| MedGemma-27B | 0% |
| Lingshu-32B | 0% |

---

## 5. Qwen Embedding para recuperação de evidência

O Qwen3-Embedding (text-embedding-v4 no Model Studio) é usado na nossa camada de recuperação de evidência:

- **Multilíngue de verdade:** PT→PT e PT→EN com recall elevado
- **1024 dimensões:** compatível com o nosso índice Elasticsearch
- **Custo efetivo:** US$ 0,07/M tokens — para 1M documentos indexados, US$ 70 uma única vez

Em produção: BGE-M3 (CPU, São Paulo) para PII/embeddings em tempo real, Qwen3-Embedding (API) para reindexação em lote.

---

## 6. Por que Qwen é a escolha certa para a saúde brasileira

### 6.1 Custo

| Cenário | Qwen3.8-Max | GPT-6 Astra | Diferença |
|---|---|---|---|
| 100.000 respostas/mês | US$ 280 | US$ 3.200 | **11,4× mais caro** |
| 1M respostas/mês | US$ 2.800 | US$ 32.000 | **11,4× mais caro** |
| Lingshu (GPU própria) | US$ 0 | US$ 32.000 | **infinito** |

### 6.2 Qualidade

- Qwen3.8-Max: 2º lugar no nosso benchmark (0,360), 1º em multi-morbidade (0,62)
- Lingshu-32B: 1º lugar em benchmarks médicos multimodais publicados (66,6)
- Ambos superam GPT-4.1 e Claude em VQA médica

### 6.3 Privacidade

- Qwen3.8-Max via API: dado sem identificação transita pela Alibaba Cloud
- Lingshu-32B em GPU própria: **dado clínico nunca sai da infraestrutura**
- Qwen3-Embedding: para indexação de documentos públicos

### 6.4 Ecossistema

- Model Studio: mesma API OpenAI-compatible, mesma infraestrutura, mesma conta
- Alibaba Cloud: mesma VPC, mesmos savings plans, mesmo suporte
- Lingshu: da DAMO Academy (Alibaba) — roadmap integrado com Qwen

---

## 7. Roadmap proposto (Alibaba + BeansTech)

| Fase | Duração | Entregável | Dependência |
|---|---|---|---|
| Piloto hospitalar | 90 dias | Qwen + Lingshu em apoio à decisão em 1 especialidade | Einstein/Rede D'Or |
| Fine-tune PT-BR médico | 180 dias | Qwen base + PCDT/bulas Anvisa/SciELO | dataset autorizado |
| Expansão ANS | 12 meses | auditoria de sinistros com Qwen | contrato operadora |
| Lingshu multimodal completo | 6 meses | 12 modalidades de imagem em produção | validação clínica |
| Estudo publicado | 12 meses | paper conjunto BeansTech + Alibaba + hospital | IRB/CEP |

**Contact:** Matheus Ximenes · contato@feijaojustech.com.br · beanstech.com.br
