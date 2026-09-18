# Tabela de Preços — BeansTech Health (R$)

**Câmbio:** US$ 1 = R$ 5,40 (setembro/2026, conservador)
**Custos baseados em:** infraestrutura real medida (fatura Alibaba set/2026, benchmark 16/09/2026)

---

## Custos Reais por Modelo (nossa infraestrutura)

| Modelo | Onde roda | Custo infra US$/1M tok | Custo R$/1M tok | Como roda |
|---|---|---|---|---|
| **qwen-plus** | API (SP cobre) | US$ 1,20 | R$ 6,48 | Model Studio — sintetiza, volume |
| **glm-5.3** | API (SP cobre) | US$ 0,60 | R$ 3,24 | Model Studio — análise profunda |
| **qwen3.8-max** | API (SP cobre) | US$ 2,40 | R$ 12,96 | Model Studio — máxima qualidade |
| **Granite-Guardian-8B** | GPU SG (1/2 L20) | US$ 5,60 | R$ 30,24 | Guardrail — toda resposta passa |
| **Granite-Guardian-3.2-3B** | GPU SG (1/2 L20) | US$ 3,50 | R$ 18,90 | Guardrail leve (MoE 800M) |
| **Granite-4.1-30B FP8** | GPU SG (1/2 L20) | US$ 19,50 | R$ 105,30 | Compliance, SAR, PLD/FT |
| **Baichuan-M2-32B INT4** | GPU SG (1/2 L20) | US$ 21,50 | R$ 116,10 | Medicamento, veterinária |
| **MedGemma-27B FP8** | GPU SG (1/2 L20) | US$ 31,40 | R$ 169,56 | Emergência, clínico puro |
| **Lingshu-32B FP8** | GPU SG (1/2 L20) | US$ 38,90 | R$ 210,06 | Imagem médica (multimodal) |
| **AntAngelMed-100B FP8** | GPU VA (4×L20) | US$ 20,70 | R$ 111,78 | Raciocínio PT, volume |
| **Baichuan-M3-235B INT4** | GPU VA (4×L20) | US$ 39,80 | R$ 214,92 | Excelência, caso complexo |
| **medpubr** (embed/rerank/PII) | CPU BR (r9i) | ~US$ 0,28 | R$ 1,51 | Embeddings, PII removal, NER |

---

## Preços de Venda por Token (API)

### Por 1 milhão de tokens (input + output combinados)

| Categoria | Custo R$ | Preço R$ | Margem | Uso típico |
|---|---|---|---|---|
| **Síntese Rápida** (qwen-plus) | R$ 6,48 | **R$ 18,00** | 64% | Volume, triagem |
| **Síntese Profunda** (glm-5.3) | R$ 3,24 | **R$ 12,00** | 73% | Análise jurídica/clinical |
| **Guardrail** (granite-guardian) | R$ 18,90 | **R$ 45,00** | 58% | Segurança, compliance check |
| **Clínico** (medgemma-27b) | R$ 169,56 | **R$ 350,00** | 52% | Decisão clínica |
| **Medicamento** (baichuan-m2) | R$ 116,10 | **R$ 250,00** | 54% | Interações, dosagem |
| **Compliance** (granite-4.1-30b) | R$ 105,30 | **R$ 220,00** | 52% | SAR, PLD/FT, BACEN |
| **Imagem Médica** (lingshu-32b) | R$ 210,06 | **R$ 450,00** | 53% | RX, TC, laudo |
| **Excelência** (baichuan-m3-235b) | R$ 214,92 | **R$ 480,00** | 55% | Caso difícil, 2ª opinião |
| **Resposta Verificada** (cadeia completa) | R$ 8-25 | **R$ 45,00** | 45-82% | Evidência com citação |

---

## Assinaturas Mensais (pessoa física / jurídica)

| Plano | R$/mês | Respostas | Modelos | Custo R$ | Margem |
|---|---|---|---|---|---|
| **Gratuito** | R$ 0 | 20 | qwen-plus | R$ 0,40 | — (lead) |
| **Estudante** | R$ 29 | 100 | qwen-plus + guardian | R$ 5,00 | 83% |
| **Profissional** | R$ 149 | 500 | qwen + glm + medgemma + guardian | R$ 30,00 | 80% |
| **Profissional+** | R$ 299 | 1.500 | todos exceto M3-235B | R$ 75,00 | 75% |
| **Clínica** (10 prof.) | R$ 990 | 5.000 + 200 imagens | todos + lingshu | R$ 300,00 | 70% |
| **Hospital** (50 prof.) | R$ 4.900 | 30.000 + 1.000 imagens | todos + SSO | R$ 1.800,00 | 63% |
| **Instituição** | R$ 9.900 | 60.000 + 3.000 imagens + API | todos + auditoria | R$ 3.500,00 | 65% |
| **Rede** (100+ prof.) | R$ 19.900 | 200.000 + todas features | tudo + dedicated | R$ 8.000,00 | 60% |

---

## API para IAs Parceiras / Integração

| Produto | Preço | Unidade | Volume mínimo |
|---|---|---|---|
| **Resposta com evidência** | R$ 2,80 | por resposta | 100/mês |
| **Token clínico** (medgemma) | R$ 350,00 | 1M tokens | 10M/mês |
| **Token excelência** (M3-235B) | R$ 480,00 | 1M tokens | 5M/mês |
| **Embedding** (medpubr, BR) | R$ 8,00 | 1M tokens | 100M/mês |
| **Guardrail check** | R$ 45,00 | 1M tokens | 10M/mês |
| **GPU dedicada** 2×L20 | R$ 23.200/mês | máquina inteira | contrato 3 meses |
| **GPU dedicada** 4×L20 | R$ 69.700/mês | máquina inteira | contrato 3 meses |

---

## Comparação com Mercado

| Provedor | Modelo | Preço out/1M | Nossa oferta | Vantagem |
|---|---|---|---|---|
| OpenAI | GPT-6 | US$ 60 (R$ 324) | — | — |
| Anthropic | Claude Opus | US$ 75 (R$ 405) | M3-235B: R$ 480 | Dado em BR, com guardrail |
| Google | Gemini Pro | US$ 21 (R$ 113) | medgemma: R$ 350 | Clínico puro + PII removal |
| Alibaba | qwen-plus | US$ 1,20 (R$ 6,48) | qwen-plus: R$ 18 | Mesma infra, com cadeia |
| — | — | — | **Resposta verificada: R$ 2,80** | Nenhum concorrente oferece |

---

## Notas de Cálculo

1. **Custos GPU**: instância ÷ nº de modelos que dividem a GPU (elite-health: 4 modelos ÷ 2 GPUs = cada modelo usa ~½ GPU; m3-va: 1 modelo ÷ 4 GPUs)
2. **Custos API (Model Studio)**: cobertos pelo Savings Plan AI General-purpose (US$ 1.000/mês já pago) → custo real ≈ 0 até esgotar
3. **Custos CPU (medpubr)**: r9i.2xlarge (US$ 404/mês) ÷ 3 funções (embed + rerank + PII) = US$ 135/mês por função
4. **Margens calculadas sobre**: custo real de infra + custo de revisão médica estimada (R$ 0,15/resposta)
5. **Preços em R$**: câmbio conservador R$ 5,40/US$ (se subir para R$ 6,00, margem aumenta)
6. **Break-even da frota atual** (US$ 25.811/mês): 130 assinaturas Profissional OU 15 Clínicas OU 3 Instituições
