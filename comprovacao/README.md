# Comprovação Científica — Stack de IA Médica do drhealth.tech (BeansTech)

**Data:** 07/09/2026 · **Stack:** GPU RTX PRO 6000 96GB (Hostinger) + Ollama, 100% self-hosted (LGPD/soberania); plano de contingência: ECS A10 24GB (Alibaba) · **Uso:** vendas (hospital Einstein e similares) e auditoria técnica.

**O que é este dossiê:** 36 entradas (35 papers + 1 model card documentado) que fundamentam cientificamente cada modelo da stack. **Cada título, autor, arXiv ID, DOI e link foi verificado por fetch direto** (páginas abs do arXiv, Crossref, OpenAlex, Nature, PubMed/Europe PMC, cards oficiais do HuggingFace, OpenReview, Wayback Machine) em 07/09/2026 — nada foi escrito de memória. Onde um modelo **não tem paper peer-reviewed**, isso está dito explicitamente.

---

## Índice executivo — Modelo → Paper

| # | Modelo | Paper principal | Veículo/Ano | Link | Papel no drhealth.tech |
|---|--------|----------------|-------------|------|------------------------|
| 1 | `google/medgemma-27b-it` | MedGemma Technical Report | arXiv 2025 (Google) | https://arxiv.org/abs/2507.05201 | Multimodal médico principal (texto+imagem; EHR; CXR; +15,5–18,1% CXR) |
| 2 | `google/medgemma-1.5-4b-it` | MedGemma 1.5 Technical Report | arXiv 2026 (Google) | https://arxiv.org/abs/2604.05081 | Multimodal 4B leve: CT/RMI 3D, lâminas inteiras, laudos lab (+22% EHRQA) |
| 3 | `google/MedSigLIP` | MedGemma TR (introduz o MedSigLIP) + SigLIP/SigLIP 2 | arXiv 2023–2025 | https://arxiv.org/abs/2507.05201 · https://arxiv.org/abs/2502.14786 | Embeddings de imagem médica (classificação/recuperação) |
| 4 | `StanfordAIMI/CheXagent-2-3b` | A Vision-Language Foundation Model to Enhance Efficiency of Chest X-ray Interpretation | arXiv 2024 (Stanford) | https://arxiv.org/abs/2401.12208 | Laudo de RX de tórax (rascunho p/ radiologista; 36% de tempo p/ residentes) |
| 5 | `prov-gigapath/prov-gigapath` | A whole-slide foundation model for digital pathology from real-world data | **Nature** 2024 | https://www.nature.com/articles/s41586-024-07441-w | Patologia digital whole-slide (SOTA em 25/26 tarefas) |
| 6 | `lingshu-medical-mllm/Lingshu-I-8B` | Lingshu: A Generalist Foundation Model for Unified Multimodal Medical Understanding and Reasoning | arXiv 2025 (+ IEEE TPAMI 2026) | https://arxiv.org/abs/2506.07044 | MLLM diagnóstico / VQA médico |
| 7 | `Intelligent-Internet/II-Medical-8B` | Model card oficial + DeepSeek-R1 (linhagem) | HuggingFace 2025 / arXiv 2025 | https://huggingface.co/Intelligent-Internet/II-Medical-8B | Raciocínio clínico (87,82% MedQA; 40% HealthBench) — **sem paper próprio** |
| 8 | `zhihan1996/DNABERT-2-117M` | DNABERT-2 | **ICLR 2024** | https://arxiv.org/abs/2306.15006 | Genética/genômica (tokenização BPE; benchmark GUE) |
| 9 | `OpenMed/OpenMed-NER-*` | OpenMed NER | arXiv 2025 | https://arxiv.org/abs/2508.01630 | NER clínico/laboratorial (SOTA 10/12 benchmarks; +SNOMED/UMLS via SapBERT) |
| 10 | `sentence-transformers/embeddinggemma-300m` | EmbeddingGemma | arXiv 2025 (Google) | https://arxiv.org/abs/2509.20354 | Embeddings RAG médico leve (SOTA MTEB <500M) |
| 11 | `BAAI/bge-m3` | M3-Embedding | Findings of ACL 2024 | https://arxiv.org/abs/2402.03216 | Embeddings RAG multilíngue (denso + esparso + multi-vetor; 100+ idiomas) |
| 12 | `openai/whisper-large-v3-turbo` | Robust Speech Recognition via Large-Scale Weak Supervision | arXiv 2022 (OpenAI) | https://arxiv.org/abs/2212.04356 | Transcrição de consultas (680k h; zero-shot; PT-BR) |
| 13 | `pyannote/speaker-diarization-3.1` | pyannote.audio 2.1 + Powerset loss | Interspeech 2023 | https://doi.org/10.21437/interspeech.2023-105 | Separação de falantes médico/paciente |
| 14 | Avaliação de qualidade (stack inteira) | HealthBench + MedQA + MMLU + Med-PaLM 1/2 + AMIE | 2021–2026 | https://openai.com/index/healthbench/ | Benchmarks e adoção clínica (arquivo 05) |

---

## Como usar em VENDAS (Einstein e hospitais de ponta)

1. **Abertura com peso acadêmico:** cada componente tem fonte de primeira linha rastreável — MedGemma (Google, TR oficial), GigaPath (**Nature** 2024), CheXagent (Stanford AIMI), AMIE (**Nature** 2025), Med-PaLM (**Nature** 2023). Nada é "caixa preta de vendor".
2. **Âncora Einstein:** o paper **Van Veen et al. (Nature Medicine 2024)** — LLMs adaptados superando especialistas em sumarização clínica (81% dos sumários equivalentes ou superiores) — tem como coautor **Eduardo Pontes Reis, do Hospital Albert Einstein (São Paulo)**. O próprio Einstein integra a pesquisa que valida a categoria de produto que vendemos.
3. **Números de operação, não promessa:** CheXagent = **36% de economia de tempo** de residentes em laudos; WhisperX = **12× mais rápido** com timestamps por palavra; EmbeddingGemma = SOTA com 300M parâmetros (custo de GPU encaixado na A10 24GB).
4. **Soberania/LGPD:** toda a stack roda self-hosted (Ollama), nenhum dado clínico sai do hospital — e os papers são de **modelos abertos**, permitindo auditoria de pesos e dados de treino (ex.: GigaPath treinado em dados reais de 28 centros de câncer).
5. **Precedentes de adoção:** Tanno (Nat Med 2024: 77,7% dos laudos de VLM preferíveis/equivalentes), Ayers (JAMA IM 2023: 78,6% de preferência por respostas de chatbot), HealthBench Professional (OpenAI 2026: casos de uso reais de clínicos — consult, **documentação**, pesquisa).

## Como usar em AUDITORIA / COMPLIANCE

1. **Rastreabilidade total:** modelo → paper → benchmark → limitação, em 5 arquivos temáticos; cite sempre o **arXiv ID/DOI exato** (coluna "Link") em contratos, propostas e relatórios.
2. **Limitações assumidas publicamente** (isso diferencia a BeansTech): Hager (Nat Med 2024: LLMs **abaixo** de médicos em decisão clínica autônoma); Careless Whisper (FAccT 2024: alucinação de ASR); card do II-Medical ("*not suitable for medical use*"). Consequência de desenho: **humano-no-loop em 100% dos fluxos**.
3. **Casos sem paper próprio, documentados como tal:** II-Medical-8B (card oficial + linhagem DeepSeek-R1 + dataset verificado) e CheXagent-2-3b (checkpoint cujo card cita o paper do CheXagent). Regra: nunca apresentar como peer-reviewed o que não é.
4. **Reprodutibilidade das fontes:** arXiv (páginas `abs`), Crossref/OpenAlex (DOI), PubMed, OpenReview (ICLR 2024 do DNABERT-2), Wayback (páginas da OpenAI) — qualquer auditor pode refazer a verificação.
5. **Estratégia anti-link-rot:** guardar snapshots (a OpenAI já bloqueia crawler — usamos Wayback) e citar DOI sempre que existir.

## Lacunas conhecidas (transparência)

- **II-Medical-8B:** sem paper peer-reviewed — comprovação via card oficial (87,82% MedQA; 40% HealthBench) + linhagem (DeepSeek-R1, dataset AM 1.4M). Elo mais fraco do dossiê; mitigado com benchmarks independentes.
- **CheXagent-2-3b:** não tem paper dedicado — o card aponta o paper da família CheXagent (arXiv 2401.12208).
- **HealthBench (original):** é relatório técnico/anúncio da OpenAI (maio/2025), não artigo de journal — cite a página oficial + PDF.
- **MMLU/MedQA:** medem exame, não uso clínico real — para isso existem HealthBench/HealthBench Professional (rubric escritas por 262/3+ médicos).
- **PT-BR clínico:** validação local de ASR é interna (projeto `whisper-medical-ptbr`); complementar com WER próprio em corpus de consultas brasileiras (papers de base no arquivo 04).

---

## Estrutura dos arquivos

| Arquivo | Entradas | Conteúdo |
|---------|----------|----------|
| `01-multimodal-e-imagem.md` | 7 | MedGemma 27B/1.5, MedSigLIP/SigLIP 2, CheXagent, GigaPath (Nature), Lingshu, Tanno (Nat Med) |
| `02-clinica-raciocinio.md` | 8 | II-Medical-8B, DeepSeek-R1, dataset AM, ClinicalBERT, OpenMed NER, SapBERT (SNOMED/UMLS), EmbeddingGemma, BGE-M3 |
| `03-genetica-laboratorial.md` | 5 | DNABERT-2 (ICLR 2024), Nucleotide Transformer (Nat Methods), Evo (Science), benchmark DNA (Nat Commun), BC5CDR |
| `04-audio-e-transcricao.md` | 5 | Whisper, WhisperX, pyannote 2.1, Powerset, Careless Whisper (FAccT) |
| `05-benchmarks-e-avaliacao.md` | 11 | MMLU, MedQA, Med-PaLM 1/2, AMIE (Nature), HealthBench + Professional, Thirunavukarasu, Ayers, Van Veen, Hager |

**Total: 36 entradas = 35 papers verificados + 1 model card documentado.** Todos verificados por fetch em 07/09/2026.
