# Arquitetura chat.beanstech.ai — chatvm · chatvc · control plane
### O hub de IA soberana para setores regulados · Setembro 2026

---

## 1. Visão geral — três camadas, uma plataforma

```
┌─────────────────────────────────────────────────────┐
│           chat.beanstech.ai (CONTROL PLANE)          │
│  Token metering · model routing · latency · health  │
│  Dashboard 3D · endpoints · buckets de artigos      │
└────────────────────┬──────────────────┬─────────────┘
                     │                  │
        ┌────────────▼─────┐  ┌────────▼──────────┐
        │  chatvm.          │  │  chatvc.           │
        │  beanstech.ai     │  │  beanstech.ai      │
        │  (MEDICAL/EINSTEIN)│  │ (COMPLIANCE/BANKS)│
        │                   │  │                    │
        │ Upload: imagem,   │  │ Upload: PDF,      │
        │ PDF, manuscrito   │  │ docs, transações   │
        │                   │  │                    │
        │ Pipeline: OCR →   │  │ Pipeline: OCR →   │
        │ Lingshu-I →       │  │ Theia → Graph →   │
        │ MedGemma-27b →    │  │ Granite-4.1 →     │
        │ M3-235b (excel.)  │  │ GLM-5.3 (excel.)  │
        │                   │  │                    │
        │ Cadeia 6 camadas  │  │ Cadeia 6 camadas  │
        │ anti-alucinação   │  │ anti-alucinação    │
        └───────────────────┘  └───────────────────┘
```

---

## 2. chat.beanstech.ai — o control plane

**Papel:** Hub central. O profissional entra aqui e vê tudo — modelos, tokens, latência, saúde da frota. Daqui acessa os verticais.

**Funcionalidades:**

| Feature | Implementação |
|---------|---------------|
| Dashboard 3D | Three.js + meshes Hunyuan3D (já no ar) |
| Token metering | Middleware que conta tokens por request → dashboard |
| Model routing | Tabela: `model → endpoint → região → latência real` |
| Latência real | Ping contínuo a todos os endpoints (31 sondas) |
| Health check | health.beanstech.com.br integrado |
| Buckets de artigos | Curadoria científica por modelo e domínio |
| Frota completa | vLLM fleet + Model Studio API + regição |

**Página do modelo (ex: GLM-5.3):**
- Endpoint, região, latência média
- Tokens consumidos hoje/semana/mês
- Artigos científicos relacionados
- Benchmark scores
- Link para testar

---

## 3. chatvm.beanstech.ai — Einstein/Médico

**Público:** Médicos do Einstein e parceiros. A interface que o Einstein veria na fase "cloud for science".

**Design:**
- Cores: branco/quente (confiança médica), acento verde-saúde
- 3D: mesh do hospital (já gerado) como entrada animada
- Tipografia: serifada (tradição médica) para títulos, sans para dados

**Pipeline de documentos (o que você pediu):**

```
Upload (drag & drop ou clique)
    ↓
┌── Detecção automática de tipo ──┐
│                                  │
│  Imagem (JPG/PNG)              │
│    → HunyuanOCR (:8008)        │  ← extrai texto
│    → Lingshu-I-8B (:8005)      │  ← interpreta visual
│    → MedGemma-27b (:8001)      │  ← raciocínio clínico
│                                  │
│  PDF                            │
│    → PyMuPDF (server-side)     │  ← extrai páginas
│    → HunyuanOCR por página     │  ← texto + layout
│    → MedGemma-27b              │  ← análise
│                                  │
│  Áudio (ditado)                │
│    → Whisper-turbo (:8011)     │  ← transcreve
│    → MedGemma-27b              │  ← estrutura
│                                  │
│  Manuscrito (foto)             │
│    → HunyuanOCR                │  ← OCR manuscrito
│    → Lingshu-I                 │  ← interpreta
│    → MedGemma-27b              │  ← raciocina
│                                  │
└──────────────────────────────────┘
    ↓
Cadeia de 6 camadas (PII → guardião → síntese →
verificação de citação → excelência → auditoria)
    ↓
Resposta com fonte, confiança e trilha
```

**Interface do chat médico:**
```
┌──────────────────────────────────────────┐
│  🏥 chatvm.beanstech.ai — Einstein      │
│  [3D hospital mesh como header]          │
├──────────────────────────────────────────┤
│                                          │
│  [Upload: 📎 imagem · 📄 PDF · 🎤 áudio]│
│                                          │
│  Dr. Silva: "Paciente 68a, DPOC,        │
│  SatO2 86%, pH 7.28. Conduta?"          │
│                                          │
│  [Imagem anexada: radiografia]           │
│                                          │
│  ──────────────────────────────────     │
│                                          │
│  IA (M3-235b + MedGemma-27b):           │
│  "VNI primeira escolha (pH<7,35 com     │
│  hipercapnia). Critérios de falência... │
│                                          │
│  📚 Fonte: PCDT-DPOC 2024, p. 15        │
│  🔒 Trilha: id=abc123 · 6 camadas ✓    │
│  ⚡ 114ms · 847 tokens · lat. real      │
│                                          │
└──────────────────────────────────────────┘
```

---

## 4. chatvc.beanstech.ai — Compliance/Bancos

**Público:** Compliance officers de 740 instituições. A interface para o beansbank/beans.credit.

**Design:**
- Cores: azul escuro/âmbar (segurança financeira)
- 3D: mesh do banco (já gerado) como entrada
- Tipografia: sans-serif (modernidade fintech)

**Pipeline de documentos:**

```
Upload (PDF, imagem, CSV de transações)
    ↓
┌── Análise ─────────────────────────────┐
│                                         │
│  Documentos regulatórios:              │
│    → HunyuanOCR → estrutura            │
│    → Granite-4.1 → compliance check    │
│    → GLM-5.3 → análise de risco        │
│                                         │
│  Transações (CSV):                     │
│    → Theia-8B → on-chain + patterns    │
│    → Graph → entity linking            │
│    → GLM-5.3 → SAR narrative           │
│                                         │
│  Documentos judiciais:                 │
│    → OCR → 100M decisões (ES)          │
│    → Granite-4.1 → verificação         │
│    → GLM-5.3 → parecer                 │
│                                         │
└─────────────────────────────────────────┘
    ↓
Cadeia de 6 camadas + trilha auditável
    ↓
Resposta com fonte, risco, ação recomendada
```

---

## 5. Artigos científicos — a curadoria

### Medical AI (para chatvm / Einstein)

| Paper | Autores | Venue/Ano | Key Finding |
|-------|---------|-----------|-------------|
| **AMIE** — Articulate Medical Intelligence Explorer | Tu et al. (Google DeepMind) | Nature Medicine, 2024 | Superou PCPs em raciocínio diagnóstico em consultas simuladas (OSCE-style) |
| **Med-PaLM 2** | Singhal et al. (Google) | arXiv, 2023 | ≥86.5% em MedQA (nível especialista); "expert-level" |
| **MedGemma** | Google Research | 2025 | Modelos multimodais médicos (4B/27B) — radiologia, dermatologia, oftalmologia |
| **AMIE Follow-up: Safety** | Tu et al. | npj Digital Medicine, 2024 | Framework de segurança para IA clínica conversacional |
| **Clinical Decision Support LLMs: A Survey** | Multiple | JAMIA, 2024-25 | Revisão sistemática de LLMs em CDS: promessa + riscos |
| **MedQA/Benchmark cego em PT-BR** | BeansTech (nosso) | 2026 | 277 casos, GLM-5.3 vencedor — o único que detectou dose excessiva com fonte |

### Compliance AI (para chatvc / bancos)

| Paper | Autores | Venue/Ano | Key Finding |
|-------|---------|-----------|-------------|
| **LLM for Financial Regulatory Compliance** | Deußer et al. | arXiv, 2026 | RAG adaptado para QA regulatório em serviços financeiros |
| **GPT-4 for AML Detection** | Multiple | 2024-25 | LLMs aplicados a detecção de lavagem de dinheiro: triagem + narrativa SAR |
| **Document Understanding with VLMs** | Ak et al. | EMNLP 2026 | Pipelines VLM para QA de documentos longos |
| **ARGUS: Event Knowledge Graphs** | Kannan et al. | 2026 | Estruturação de documentos de queixa legal |

### Document/OCR/Handwriting (para ambos)

| Paper/Tech | Fonte | Aplicação |
|------------|-------|-----------|
| **HunyuanOCR** | Tencent, 2025 | OCR de documentos impressos e manuscritos |
| **Whisper-large-v3-turbo** | OpenAI, 2024 | Transcrição de áudio → texto (ditado médico) |
| **Lingshu-I-8B** | Lingshu Medical, 2025 | Interpretação de exames e imagens médicas |
| **SigLIP2** | Google, 2025 | Embeddings multimodais para busca de documentos |

### Referências de infraestrutura

| Tech | Fonte | Status na frota |
|------|-------|-----------------|
| vLLM 0.29/0.30 | vllm.ai | ✅ 10+ modelos servidos |
| GLM-5.3 | zai-org | ✅ benchmark vencedor (via API) |
| Hunyuan3D-2 | tencent | ✅ meshes 3D gerados |
| Redata (Lei 15.504) | Planalto | ✅ estudado e aplicado |
| Sigura/LGPD | Lei 13.709 | ✅ conforme |

---

## 6. Implementação técnica

### chat.beanstech.ai (control plane) — JÁ NO AR

Melhorias necessárias:
- [ ] Token metering: middleware Python que intercepta cada request → conta tokens → grava em Postgres
- [ ] Tabela de modelos viva: latência real medida continuamente (não estática)
- [ ] Buckets de artigos: expandir as 12 referências para 30+ com categorização

### chatvm.beanstech.ai (medical) — A CONSTRUIR

Stack:
- Frontend: HTML/CSS/JS com Three.js (mesh hospital como hero)
- Backend: FastAPI no br-apps
- Upload: POST /upload → detecta tipo → roteia pipeline
- Chat: WebSocket para streaming
- Auth: Keycloak (id.beanstech.com.br)
- Raciocínio: M3-235b (excelência) + MedGemma-27b (visão) + GLM-5.3 (via API)

### chatvc.beanstech.ai (compliance) — A CONSTRUIR

Stack:
- Frontend: HTML/CSS/JS com Three.js (mesh banco como hero)
- Backend: FastAPI no br-apps
- Upload: POST /upload → OCR + análise
- Chat: WebSocket
- Auth: Keycloak
- Raciocínio: GLM-5.3 + Granite-4.1 + Theia

### Shared infrastructure

| Componente | Host | Porta |
|-----------|------|-------|
| HunyuanOCR | flash-va | 8008 |
| Hunyuan3D | flash-va | 8009 |
| Lingshu-I-8B | flash-va | 8005 |
| MedGemma-27b | elite-va | 8001 |
| M3-235b | m3-va | 8000 |
| GLM-5.3 | Model Studio API | — |
| Whisper-turbo | flash-va | 8011 |
| Granite-4.1 | flash-va | 8002 |
| Theia-8b | flash-va | 8007 |
| Qwen3-Embedding | flash-va | 8010 |
| Elasticsearch | br-es/br-es2 | 9200 |

---

*Documento de arquitetura. Implementação por etapas: chat.beanstech.ai (done) → chatvm (next) → chatvc (following).*
