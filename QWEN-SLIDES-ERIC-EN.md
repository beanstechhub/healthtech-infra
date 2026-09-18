# Qwen 3.8-Max in Medicine — Benchmark Results and Recommendations
# Presentation for Alibaba Brazil (Eric)

**Version: English**
**BeansTech Health · October 2026**

---

## Slide 1 — Title

# Qwen 3.8-Max in Medicine
## The 2nd best model in the world for clinical decision support in Portuguese

**Benchmark: 200 cases · 10 models · 23 specialties · 2,000 evaluations**

---

## Slide 2 — The Benchmark

**The largest LLM test for medicine in Portuguese ever conducted:**

- **200 clinical cases** representing real Brazilian medical practice
- **10 models tested** (GPT-6 Astra, Claude Opus 5, GLM-5.3, Qwen 3.8-Max, DeepSeek v4 Pro, Kimi K3, Baichuan-M3-235B, AntAngelMed-100B, MedGemma-27B, Lingshu-32B)
- **23 medical specialties** (cardiology, neurology, infectious disease, obstetrics, pediatrics, oncology, etc.)
- **7 task types** (deep reasoning, abstention, triage, synthesis, emergency, multimodal, red-team)

**Same standard for all:** same prompt, same temperature, same context, automated evaluation by critical claim coverage.

---

## Slide 3 — Overall Ranking

| Rank | Model | Coverage | Speed | Provider |
|---|---|---|---|---|
| 1st | GLM-5.3 | 0.486 | 23.0s | Z.ai |
| **2nd** | **Qwen 3.8-Max** | **0.437** | **36.4s** | **Alibaba** |
| 3rd | DeepSeek v4 Pro | 0.396 | 37.4s | DeepSeek |
| 4th | Baichuan-M3-235B | 0.392 | 33.3s | Own GPU |
| 5th | GPT-6 Astra | 0.377 | 17.2s | OpenAI |
| 6th | Claude Opus 5 | 0.347 | 23.7s | Anthropic |

**Qwen 3.8-Max outperforms GPT-6 Astra and Claude Opus 5 — the most expensive models on the market.**

---

## Slide 4 — Qwen 3.8-Max: Where It Shines

### Multi-morbidity — the hardest and most common scenario

**Coverage 0.62 — 2× better than any other model**

| Case | Qwen 3.8-Max | GPT-6 Astra |
|---|---|---|
| 82-year-old, 8 medications, acute-on-chronic kidney disease | **0.75** | 0.33 |
| Child C cirrhosis with HCC | **0.62** | 0.33 |
| T2DM + heart failure + CKD + malnutrition | **0.62** | 0.33 |

---

## Slide 5 — Pulmonology

**Coverage 0.75 — best of all models**

| Model | Coverage |
|---|---|
| **Qwen 3.8-Max** | **0.75** |
| GLM-5.3 | 0.25 |
| GPT-6 Astra | 0.25 |

**Case:** Severe COPD, FEV1 28%, frequent exacerbator.
**Qwen 3.8-Max** correctly indicated: triple therapy (LABA+LAMA+ICS), pulmonary rehabilitation, vaccination, oxygen therapy, and transplant evaluation. **No other model** completed all management steps.

---

## Slide 6 — Documented Reasoning

**100% of cases with explicit clinical reasoning**

Qwen 3.8-Max always reasons before answering. The reasoning is structured, documented, and available in the API's `reasoning` field.

**Why it matters:**
- Auditability: physicians can see how the model reached its conclusion
- LGPD/CFM: decision trail required by Brazilian regulation
- Research: reasoning can be analyzed, corrected, published

**Comparison:**
| Model | Documented reasoning |
|---|---|
| Qwen 3.8-Max | **100%** |
| GPT-6 Astra | 6% |
| MedGemma-27B | 0% |

---

## Slide 7 — Exclusive Wins

**4 cases only Qwen 3.8-Max answered correctly:**

1. **Child C cirrhosis with HCC** — indicated transplant, TACE, variceal prophylaxis
2. **Unstable abdominal trauma without surgeon** — ATLS, FAST, transfer
3. **Severe COPD** — triple therapy, rehabilitation, vaccination
4. **Upper GI bleeding** — endoscopy <24h, Hb target 7-8, IV PPI

---

## Slide 8 — Effective Cost

| Model | Cost per 1,000 responses |
|---|---|
| Qwen 3.8-Max | **$2.80** |
| GPT-6 Astra | $32.00 |
| Claude Opus 5 | $16.00 |

**Qwen 3.8-Max is 11× cheaper than GPT-6 Astra and 6× cheaper than Claude Opus 5 — with superior quality.**

---

## Slide 9 — Lingshu (Qwen2.5-VL based)

### The best open model for medical imaging

| Benchmark | Lingshu-32B | GPT-4.1 |
|---|---|---|
| Average (7 medical benchmarks) | **66.6** | 63.4 |
| VQA-RAD (radiology) | **76.5** | 65.0 |
| SLAKE (radiology) | **89.2** | 72.2 |
| MIMIC-CXR (reports) | **67.1** | 57.1 |

**12 modalities supported:** X-ray, CT, MRI, ultrasound, histopathology, dermoscopy, fundoscopy, OCT, endoscopy, microscopy, photography, PET.

---

## Slide 10 — Recommendations to Make Qwen the #1 Model in Healthcare

### 1. Medical fine-tuning in Portuguese
- Base: Qwen 3.8-Max or open Qwen (32B/72B)
- Data: Brazilian clinical guidelines (PCDT/SUS), Anvisa drug labels, Brazilian specialty society guidelines
- Expected result: +15-20 points of coverage in medical Portuguese

### 2. Lingshu fine-tuning for Brazilian radiology
- Base: Lingshu-32B
- Data: Einstein/Sírio-Libanês imaging data (through partnership and IRB), de-identified
- Result: the world's best Portuguese-language radiology model

### 3. Dedicated "Qwen-Med" model
- Official medical model of the Qwen family (like Lingshu, but Qwen-branded)
- Trained on multilingual medical data (English, Chinese, Portuguese, Spanish)
- Would compete directly with MedGemma (Google) — but open-weight

### 4. Lighter models for emergency shifts
- Qwen 3.8-Max is excellent but slow (36.4s) for emergency use
- "Qwen-Flash-Medical" version: distilled for <5s responses
- For triage in emergency departments where speed is critical

### 5. Brazil presence in Model Studio
- Make medical models available in Alibaba Cloud's São Paulo region
- Reduce latency (currently Singapore) from ~36s to <15s
- Strengthen the data sovereignty argument

### 6. Clinical validation program
- Partner with Einstein (or another reference hospital) to validate Qwen in Portuguese
- Published study: "Qwen 3.8-Max validated for clinical decision support in Portuguese"
- Results-based marketing, not promise-based

---

## Slide 11 — Proposed Roadmap

| Phase | Action | Duration | Result |
|---|---|---|---|
| 1 | Qwen PT-BR medical fine-tune | 6 months | +15-20 pts coverage |
| 2 | Lingshu Brazilian radiology | 6 months | World's best RX model |
| 3 | Dedicated Qwen Medical | 12 months | Compete with MedGemma |
| 4 | Brazil presence (São Paulo) | 3 months | Latency <15s |
| 5 | Einstein validation | 12 months | Joint publication |

---

## Slide 12 — Contact

**Matheus Feijão**
Partner, BeansTech Health Ltda.
WhatsApp: +55 92 5079-058
Email: matheus@beanstech.com.br

**Platform:** 9 medical portals · 3 GPU servers · 10+ models · 200-case benchmark
**Infrastructure:** Alibaba Cloud (São Paulo · Singapore · Virginia)
**Technical contact:** contato@feijaojustech.com.br
