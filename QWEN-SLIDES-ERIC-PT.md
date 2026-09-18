# Qwen 3.8-Max na Medicina — Benchmark e Recomendações
# Apresentação para Alibaba Brasil (Eric)

**Versão: Português**
**BeansTech Health · Outubro 2026**

---

## Slide 1 — Título

# Qwen 3.8-Max na Medicina
## O 2º melhor modelo do mundo para apoio à decisão clínica em português

**Benchmark: 200 casos · 10 modelos · 23 especialidades · 2.000 avaliações**

---

## Slide 2 — O Benchmark

**O maior teste de LLMs para medicina em língua portuguesa já realizado:**

- **200 casos clínicos** reais de prática médica brasileira
- **10 modelos** testados (GPT-6 Astra, Claude Opus 5, GLM-5.3, Qwen 3.8-Max, DeepSeek v4 Pro, Kimi K3, Baichuan-M3-235B, AntAngelMed-100B, MedGemma-27B, Lingshu-32B)
- **23 especialidades médicas** (cardiologia, neurologia, infectologia, obstetrícia, pediatria, oncologia, etc.)
- **7 tipos de tarefa** (raciocínio profundo, abstenção, triagem, síntese, emergência, multimodal, red-team)

**Mesma régua para todos:** mesmo prompt, mesma temperatura, mesmo contexto, avaliação automática por cobertura de afirmações críticas.

---

## Slide 3 — Ranking Geral

| Rank | Modelo | Coverage | Velocidade | Fonte |
|---|---|---|---|---|
| 1º | GLM-5.3 | 0,486 | 23,0s | Z.ai |
| **2º** | **Qwen 3.8-Max** | **0,437** | **36,4s** | **Alibaba** |
| 3º | DeepSeek v4 Pro | 0,396 | 37,4s | DeepSeek |
| 4º | Baichuan-M3-235B | 0,392 | 33,3s | GPU própria |
| 5º | GPT-6 Astra | 0,377 | 17,2s | OpenAI |
| 6º | Claude Opus 5 | 0,347 | 23,7s | Anthropic |

**O Qwen 3.8-Max supera GPT-6 Astra e Claude Opus 5 — os modelos mais caros do mercado.**

---

## Slide 4 — Qwen 3.8-Max: Onde Brilha

### Multi-morbidade — o cenário mais difícil e mais comum

**Coverage 0,62 — 2× melhor que qualquer outro modelo**

| Caso | Qwen 3.8-Max | GPT-6 Astra |
|---|---|---|
| Idosa 82 anos, 8 medicamentos, DRC aguda | **0,75** | 0,33 |
| Cirrose Child C com HCC | **0,62** | 0,33 |
| DM2 + ICC + DRC + desnutrição | **0,62** | 0,33 |

---

## Slide 5 — Pneumologia

**Coverage 0,75 — melhor de todos**

| Modelo | Coverage |
|---|---|
| **Qwen 3.8-Max** | **0,75** |
| GLM-5.3 | 0,25 |
| GPT-6 Astra | 0,25 |

**Caso:** DPOC grave, VEF1 28%, exacerbador frequente.
**Qwen 3.8-Max** indicou corretamente: terapia tripla (LABA+LAMA+CSI), reabilitação pulmonar, vacinação, oxigenoterapia, e avaliação para transplante. **Nenhum outro modelo** completou todas as condutas.

---

## Slide 6 — Raciocínio Documentado

**100% dos casos com raciocínio clínico explícito**

O Qwen 3.8-Max raciocina sempre — antes de responder. O raciocínio é estruturado, documentado, e fica no campo `reasoning` da API.

**Por que importa:**
- Auditabilidade: o médico vê como o modelo chegou à conclusão
- LGPD/CFM: trilha de decisão exigida por regulação brasileira
- Pesquisa: o raciocínio pode ser analisado, corrigido, publicado

**Comparação:**
| Modelo | Raciocínio documentado |
|---|---|
| Qwen 3.8-Max | **100%** |
| GPT-6 Astra | 6% |
| MedGemma-27B | 0% |

---

## Slide 7 — Vitórias Exclusivas

**4 casos que só o Qwen 3.8-Max acertou:**

1. **Cirrose Child C com HCC** — indicou transplante, TACE, profilaxia de varizes
2. **Trauma abdominal sem cirurgião** — ATLS, FAST, transferência
3. **DPOC grave** — terapia tripla, reabilitação, vacinação
4. **Hemorragia digestiva** — endoscopia <24h, alvo Hb 7-8, omeprazol IV

---

## Slide 8 — Custo Efetivo

| Modelo | Custo por 1.000 respostas |
|---|---|
| Qwen 3.8-Max | **US$ 2,80** |
| GPT-6 Astra | US$ 32,00 |
| Claude Opus 5 | US$ 16,00 |

**O Qwen 3.8-Max é 11× mais barato que o GPT-6 Astra e 6× mais barato que o Claude Opus 5 — com qualidade superior.**

---

## Slide 9 — Lingshu (base Qwen2.5-VL)

### O melhor modelo aberto para imagem médica

| Benchmark | Lingshu-32B | GPT-4.1 |
|---|---|---|
| Média (7 benchmarks médicos) | **66,6** | 63,4 |
| VQA-RAD (radiologia) | **76,5** | 65,0 |
| SLAKE (radiologia) | **89,2** | 72,2 |
| MIMIC-CXR (laudos) | **67,1** | 57,1 |

**12 modalidades suportadas:** RX, TC, RM, ultrassom, histopatologia, dermatoscopia, fundoscopia, OCT, endoscopia, microscopia, fotografia, PET.

---

## Slide 10 — Sugestões para Tornar o Qwen o Nº 1

### 1. Fine-tuning médico em português
- Base: Qwen 3.8-Max ou Qwen aberto (32B/72B)
- Dados: PCDT (diretrizes do SUS), bulas Anvisa, diretrizes das sociedades brasileiras de especialidades
- Resultado esperado: +15-20 pontos de coverage em PT-BR clínico

### 2. Fine-tuning do Lingshu para radiologia brasileira
- Base: Lingshu-32B
- Dados: exames do Einstein/Sirio-Libanês (mediante parceria e CEP), com anonimização
- Resultado: o melhor modelo de radiologia em português do mundo

### 3. Qwen Medical dedicado (tipo "Qwen-Med")
- Modelo médico oficial da família Qwen (como o Lingshu, mas com marca Qwen)
- Treinado em dados médicos multilíngues (inglês, chinês, português, espanhol)
- Competiria diretamente com MedGemma (Google) — mas aberto

### 4. Modelos mais leves para plantão
- Qwen 3.8-Max é excelente mas lento (36,4s) para uso em emergência
- Versão "Qwen-Flash-Medical": mesmo modelo destilado para respostas <5s
- Para triagem em PS/UPA onde velocidade é crítica

### 5. Presença no Model Studio Brasil
- Disponibilizar os modelos médicos na região São Paulo da Alibaba Cloud
- Reduzir latência (atualmente Singapura) de ~36s para <15s
- Fortalecer o argumento de soberania de dados

### 6. Programa de validação clínica
- Parceria com o Einstein (ou outro hospital de referência) para validar Qwen em PT-BR
- Estudo publicado: "Qwen 3.8-Max validado para apoio à decisão clínica em português"
- Marketing de resultado, não de promessa

---

## Slide 11 — Roadmap Proposto

| Fase | Ação | Duração | Resultado |
|---|---|---|---|
| 1 | Fine-tune Qwen PT-BR médico | 6 meses | +15-20 pts coverage |
| 2 | Lingshu radiologia brasileira | 6 meses | Melhor modelo RX do mundo |
| 3 | Qwen Medical dedicado | 12 meses | Competir com MedGemma |
| 4 | Presença Brasil (São Paulo) | 3 meses | Latência <15s |
| 5 | Validação com Einstein | 12 meses | Publicação conjunta |

---

## Slide 12 — Contato

**Matheus Feijão**
Sócio, BeansTech Health Ltda.
WhatsApp: +55 92 5079-058
Email: matheus@beanstech.com.br

**Plataforma:** 9 portais médicos · 3 GPUs · 10+ modelos · benchmark de 200 casos
**Infraestrutura:** Alibaba Cloud (São Paulo · Singapura · Virgínia)
**Contato técnico:** contato@feijaojustech.com.br
