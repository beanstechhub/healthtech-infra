# 02 — Clínica e Raciocínio (+ NER clínico/SNOMED e embeddings de RAG)

Papers que fundamentam o raciocínio clínico da stack (`Intelligent-Internet/II-Medical-8B`), a extração de entidades clínicas/laboratoriais (`OpenMed/OpenMed-NER-*` com normalização SNOMED/UMLS) e os embeddings de RAG médico (`sentence-transformers/embeddinggemma-300m`, `BAAI/bge-m3`).

Verificados por fetch em 07/09/2026. Comentários em PT-BR; títulos em inglês.

---

### II-Medical-8B: Medical Reasoning Model
- **Autores:** Intelligent Internet (organização; citação oficial é `@misc{2025II-Medical-8B}`)
- **Veículo/Ano:** Hugging Face (model card oficial), 2025 — **não existe paper peer-reviewed do modelo** (verificado em 07/09/2026 via arXiv, OpenAlex, Semantic Scholar e busca web)
- **Link:** https://huggingface.co/Intelligent-Internet/II-Medical-8B
- **Modelo que apoia:** `Intelligent-Internet/II-Medical-8B` (raciocínio clínico / chat médico)
- **Por que importa:** ⚠️ *Transparência para auditoria:* a comprovação científica aqui é o **card oficial + linhagem**, não um paper. O card reporta **87,82% no MedQA** e média **70,49 em 10 benchmarks de QA médico** (MedMCQA, MedQA, PubMedQA, MMLU-Pro, GPQA, Lancet, NEJM etc.) — desempenho comparável ao HuatuoGPT-o1-**72B** (71,13) com 9× menos parâmetros — e **40% no HealthBench da OpenAI**, "comparável ao o1 e ao GPT-4.5" segundo o próprio card. Base: Qwen3-8B, treinado com traces de raciocínio destilados de DeepSeek-R1 (dataset `AM-DeepSeek-R1-Distilled-1.4M`, arXiv 2503.19633, link declarado no card). O card também declara explicitamente *"It's not suitable for medical use"* — usar sempre com humano-no-loop.

### DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning
- **Autores:** DeepSeek-AI / Guo et al. (DeepSeek)
- **Veículo/Ano:** arXiv 2025
- **Link:** https://arxiv.org/abs/2501.12948
- **Modelo que apoia:** `II-Medical-8B` (fonte do raciocínio destilado) — e toda a família de modelos raciocinadores open-weight
- **Por que importa:** demonstra que raciocínio complexo (autoverificação, reflexão, adaptação de estratégia) **emerge de reinforcement learning puro**, sem trajetórias anotadas por humanos — a base científica do "pensar passo a passo" clínico que o II-Medical-8B destila para 8B (e que pode rodar na A10 junto ao Ollama).

### 1.4 Million Open-Source Distilled Reasoning Dataset to Empower Large Language Model Training
- **Autores:** Zhao et al. (a-m-team / AI-MO)
- **Veículo/Ano:** arXiv 2025
- **Link:** https://arxiv.org/abs/2503.19633
- **Modelo que apoia:** `II-Medical-8B` (dataset de treinamento declarado no card oficial — é o link arXiv taggeado no modelo no HuggingFace)
- **Por que importa:** dataset de 1,4 milhão de traces de raciocínio destilados (majoritariamente de DeepSeek-R1) com **verificação rigorosa** (respostas de referência, test cases de código, reward model) e descontaminação de test sets — usado pelo II-Medical-8B, dá rastreabilidade à qualidade do dado de treino.

### Publicly Available Clinical BERT Embeddings
- **Autores:** Alsentzer et al. (MIT / Massachusetts General Hospital / Harvard Medical School)
- **Veículo/Ano:** 2nd Clinical NLP Workshop @ NAACL 2019 / arXiv 2019
- **Link:** https://arxiv.org/abs/1904.03323 (DOI 10.18653/v1/w19-1909)
- **Modelo que apoia:** linhagem ClinicalBERT — modelos de linguagem clínica sobre os quais a NLP de prontuário (NER, sumarização) se construiu
- **Por que importa:** primeiros BERT públicos para texto clínico (notas genéricas + sumários de alta, do MIMIC-III); modelos de domínio superaram embeddings genéricos em 3 tarefas de NLP clínico — o alicerce histórico citado até hoje para justificar modelos adaptados a texto de prontuário (inclusive PT-BR clínico).

### OpenMed NER: Open-Source, Domain-Adapted State-of-the-Art Transformers for Biomedical NER Across 12 Public Datasets
- **Autores:** Panahi (OpenMed)
- **Veículo/Ano:** arXiv 2025
- **Link:** https://arxiv.org/abs/2508.01630
- **Modelo que apoia:** família `OpenMed/OpenMed-NER-*` (30+ modelos: DiseaseDetect, ChemicalDetect, PharmaDetect, GenomeDetect, ProteinDetect, PathologyDetect, BloodCancerDetect etc.)
- **Por que importa:** combina pré-treinamento adaptado a domínio (DAPT sobre corpus ético de 350k passagens de PubMed, arXiv e notas desidentificadas do MIMIC-III, em backbones DeBERTa-v3 / PubMedBERT / BioELECTRA) com **LoRA treinando <1,5% dos parâmetros**: **novo SOTA de micro-F1 em 10 de 12 benchmarks biomédicos** de NER (ex.: +2,70 pp em BC5CDR-Disease; ganhos de +5,3 e +9,7 pp em corpora de genes e linhagens celulares). Extração de doenças/medicamentos/valores de exames a custo mínimo — roda em CPU ou sobra de GPU.

### Self-Alignment Pretraining for Biomedical Entity Representations (SapBERT)
- **Autores:** Liu et al. (University of Cambridge)
- **Veículo/Ano:** NAACL 2021
- **Link:** https://aclanthology.org/2021.naacl-main.334/ (DOI 10.18653/v1/2021.naacl-main.334)
- **Modelo que apoia:** camada de **normalização de conceitos clínicos → UMLS/SNOMED CT** para o pipeline de NER da stack
- **Por que importa:** o SapBERT auto-alinha o espaço de representação dos **4M+ conceitos do UMLS** (metatesauro que integra o **SNOMED CT**) com um único modelo, alcançando SOTA em 6 benchmarks de *medical entity linking* — a referência científica para ligar menções livres do prontuário ("DM2", "HAS", "creatinina alta") a conceitos padronizados de terminologia.

### EmbeddingGemma: Powerful and Lightweight Text Representations
- **Autores:** Vera et al. (Google / sentence-transformers)
- **Veículo/Ano:** arXiv 2025
- **Link:** https://arxiv.org/abs/2509.20354
- **Modelo que apoia:** `sentence-transformers/embeddinggemma-300m` (busca semântica / RAG médico leve)
- **Por que importa:** embeddings de **300M parâmetros** treinados com inicialização encoder-decoder + destilação geométrica + regularizador spread-out: **estado da arte no MTEB entre modelos <500M** e desempenho comparável a modelos do dobro do tamanho, com custo-benefício excepcional. No drhealth.tech deixa a A10 livre para o MedGemma enquanto o embeddinggemma roda junto ao RAG de prontuários. (O MTEB — *Muennighoff et al., EACL 2023, arXiv 2210.07316*, 8 tarefas / 58 datasets / 112 idiomas — é o benchmark de referência.)

### M3-Embedding: Multi-Linguality, Multi-Functionality, Multi-Granularity Text Embeddings Through Self-Knowledge Distillation
- **Autores:** Chen et al. (BAAI — Beijing Academy of Artificial Intelligence)
- **Veículo/Ano:** Findings of ACL 2024 / arXiv 2024
- **Link:** https://arxiv.org/abs/2402.03216 (DOI 10.18653/v1/2024.findings-acl.137)
- **Modelo que apoia:** `BAAI/bge-m3` (RAG médico multilíngue)
- **Por que importa:** o bge-m3 é o modelo do paper **M3-Embedding**: suporta **100+ idiomas**, contexto de 8.192 tokens e **três modos de recuperação no mesmo modelo** (denso, esparso lexical e multi-vetor) com destilação de conhecimento próprio — recuperador robusto para prontuários PT-BR/EN com documentos longos (lançamentos, sumários de alta) e consultas híbridas.

---

## Notas de auditoria desta seção

1. **II-Medical-8B é o elo mais fraco em comprovação formal** (sem paper peer-reviewed). Mitigação: sempre apresentar o card oficial (87,82% MedQA; 40% HealthBench) + papers da linhagem (DeepSeek-R1, dataset AM) + benchmarks independentes (HealthBench/MedQA — ver arquivo 05) e o alerta do próprio fabricante de não uso clínico autônomo.
2. **SNOMED:** os modelos OpenMed-NER cobrem NER biomédico/clínico; a ligação a códigos SNOMED CT/UMLS se apoia na linha SapBERT (entity linking). Em auditoria, citar os dois papers separadamente (extração ≠ codificação).
3. **ModelosClinicalBERT/BioBERT** são a base histórica; para produção, OpenMed-NER (2025, SOTA) é a referência atual.
