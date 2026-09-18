# GLM-5.3 Clinical Decision Support Benchmark Report
## BeansTech Health · September 2026

**Executive Summary**

We tested GLM-5.3 against 9 other leading LLMs on 51 clinical cases representing real medical practice in Brazil. GLM-5.3 achieved the highest overall quality score, the fastest response time among reasoning models, and the highest rate of correct abstention — outperforming significantly more expensive proprietary models.

---

## 1. Benchmark Overview

**Method:** 51 clinical cases across 21 medical domains (emergency, cardiology, infectious disease, obstetrics, pediatrics, multi-morbidity, and others). Each case includes a validated gold-standard answer, critical claims that must be present, and forbidden content that must not appear. All models received identical system prompts, temperature (0.2), and max tokens (2,800).

**Models tested:**
| Model | Provider | Access Method |
|---|---|---|
| **GLM-5.3** | **Z.ai** | **Alibaba Cloud Model Studio** |
| Qwen3.8-Max | Alibaba | Alibaba Cloud Model Studio |
| DeepSeek v4 Pro | DeepSeek | Alibaba Cloud Model Studio |
| GPT-6 Astra | OpenAI | OpenRouter ($10/M in, $50/M out) |
| Baichuan-M3-235B | Baichuan | Own GPU (4× NVIDIA L20) |
| AntAngelMed-100B | Ant Group | Own GPU (4× NVIDIA L20) |
| MedGemma-27B | Google | Own GPU (NVIDIA L20) |
| Lingshu-32B | Alibaba DAMO | Own GPU (NVIDIA L20) |

---

## 2. Key Results

### 2.1 Overall Ranking

| Rank | Model | Quality Score | Avg Latency | Reasoning Rate | Correct Abstentions |
|---|---|---|---|---|---|
| **1** | **GLM-5.3** | **0.372** | **15.6s** | **100%** | **8/15** |
| 2 | Qwen3.8-Max | 0.360 | 38.6s | 100% | 3/15 |
| 3 | DeepSeek v4 Pro | 0.348 | 32.6s | 100% | 0/15 |
| 4 | GPT-6 Astra | 0.316 | 16.9s | 6% | 6/15 |
| 5 | Baichuan-M3-235B | 0.287 | 35.6s | 100% | 1/15 |
| 6 | AntAngelMed-100B | 0.240 | 25.0s | 100% | 2/15 |
| 7 | MedGemma-27B | 0.192 | 29.0s | 0% | 1/15 |
| 8 | Lingshu-32B | 0.188 | 19.3s | 0% | 6/15 |

### 2.2 GLM-5.3 Outperformed GPT-6 Astra on Every Clinical Dimension

| Metric | GLM-5.3 | GPT-6 Astra | Advantage |
|---|---|---|---|
| Quality score (claim coverage) | **0.372** | 0.316 | +18% |
| Reasoning documented | **100%** | 6% | 17× |
| Correct abstentions | **8** | 6 | +33% |
| Exclusive wins (cases only GLM won) | **6** | 2 | 3× |
| Cost per 1,000 responses | **$0 (via SP)** | ~$32 | ∞ |

---

## 3. What Impressed Us Most About GLM-5.3

### 3.1 Correct Abstention — The Most Important Clinical Safety Feature

Of the 15 cases where the correct answer was "I cannot determine this without additional data," GLM-5.3 correctly abstained in **8 cases** — more than any other model. In clinical decision support, the ability to say "I don't know" is more important than the ability to answer. It is what separates decision support from autonomous diagnosis.

**Example:** When asked about the dose of paracetamol in a 3.2kg neonate with jaundice, GLM-5.3 stated it could not confirm the dose without clinical assessment — exactly what a physician would say. GPT-6 Astra and Qwen3.8-Max both attempted to give specific dosing without appropriate caveats.

### 3.2 Documented Reasoning — Every Response, Every Time

GLM-5.3 produced explicit clinical reasoning in 100% of responses. The reasoning is structured, logical, and in the response payload (field: `reasoning`). This is critical for:

- **Medical audit:** physicians can see how the model reached its conclusion
- **Regulatory compliance:** Brazilian CFM (Federal Council of Medicine) and LGPD require traceability
- **Quality improvement:** reasoning reveals where the model's clinical logic breaks down

**Example:** For the case of a 68-year-old with atrial fibrillation, CrCl 28, and bleeding on rivaroxaban, GLM-5.3's reasoning walked through: renal function assessment → drug dosing adjustment → bleeding risk vs thrombotic risk → alternative anticoagulants → the need to confirm in the product label. This is textbook clinical reasoning.

### 3.3 Speed with Depth

GLM-5.3 averaged **15.6 seconds per response** — the fastest of any reasoning model tested. Qwen3.8-Max (38.6s) and DeepSeek v4 Pro (32.6s) both take 2× longer. In a busy emergency department, 15 seconds is the difference between usable and frustrating.

### 3.4 Infectology Excellence

GLM-5.3 scored **0.72 coverage in infectious disease** — best of all models. It correctly identified P. jirovecii pneumonia in an HIV+ patient with CD4 < 200 and ground-glass opacities on CT, and correctly refused to recommend yellow fever vaccination in an immunosuppressed patient.

### 3.5 Six Exclusive Victories

GLM-5.3 was the *only* model to correctly answer these cases:
- Lumbar puncture decision in a 6-month-old with bulging fontanelle
- Requesting imaging before describing radiological findings
- Pulmonary embolism workup in a 62-year-old with pleuritic chest pain
- P. jirovecii diagnosis in HIV+ with CD4 85
- Acute kidney injury management in an 82-year-old on 8 medications

---

## 4. Data Privacy: Zero-Data-Retention

For clinical decision support in healthcare, data privacy is not optional — it is existential. GLM-5.3's zero-data-retention policy means that clinical questions sent via API are never used for model training. Combined with our PII-stripping layer (patient identifiers removed before the question reaches the model), this creates a two-layer privacy architecture:

1. **Layer 1 (our infrastructure, São Paulo):** Patient names, CPF, phone numbers, and dates are stripped from the clinical question before it leaves our servers
2. **Layer 2 (Z.ai):** The de-identified clinical text that reaches GLM-5.3 is never stored or used for training

This is the architecture that Brazilian healthcare institutions (hospitals, ANS-regulated payers, CFM-governed physicians) require.

---

## 5. Our Implementation

GLM-5.3 is now the **primary model** in our clinical decision support tool (`/decisao`) deployed across 8 medical portals in Brazil:

- **dodr.ai** — evidence-based medicine for physicians
- **beanshealth.com.br** — general health platform
- **exame.tech** — diagnostic imaging
- **prontuario.tech** — electronic health records
- **drogaria.tech** — clinical pharmacy
- **drhealth.tech** — hospital medicine
- **portaldodentista.ai** — dentistry
- **petiq.tech** — veterinary medicine

The system processes clinical questions from physicians during their shifts (including night shifts in emergency departments), with:

- PII removal before the question reaches GLM-5.3
- Guardrails on input and output (Granite Guardian, IBM)
- Documented reasoning stored for audit
- Abstention when evidence is insufficient
- Full traceability (model version, tokens, latency, guardrail decisions)

---

## 6. Conclusion

GLM-5.3 is, in our benchmark, the **best model for clinical decision support in Portuguese** — better than models costing 100× more. Its combination of quality, speed, documented reasoning, correct abstention, and zero-data-retention makes it uniquely suited for healthcare applications where safety, transparency, and privacy are non-negotiable.

We look forward to deepening our partnership with Z.ai as we scale this to Brazil's largest hospitals and health systems.

---

**Contact:**
Matheus Ximenes
Founder, BeansTech Health
contato@feijaojustech.com.br
beanstech.com.br · dodr.ai

**Infrastructure:**
Alibaba Cloud (São Paulo, Singapore, Virginia)
3 GPU servers · 10+ medical models resident
BeansTech ID (SSO with MFA)
Zero-data-retention architecture
