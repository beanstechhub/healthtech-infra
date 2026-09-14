# 01 — Multimodal Médico e Imagem

Papers que fundamentam os modelos de visão + linguagem médica da stack do drhealth.tech: **MedGemma 27B**, **MedGemma 1.5 4B**, **MedSigLIP**, **CheXagent-2-3b**, **Prov-GigaPath** e **Lingshu-I-8B**.

Todos os títulos, autores, IDs, DOIs e números abaixo foram verificados por fetch direto (arXiv, Crossref, OpenAlex, Nature, PubMed, HuggingFace) em 07/09/2026. Comentários em PT-BR; títulos dos papers mantidos em inglês.

---

### MedGemma Technical Report
- **Autores:** Sellergren et al. (Google — Google Research/DeepMind; dezenas de autores)
- **Veículo/Ano:** arXiv 2025 (v1 a v3: jul/2025; v4: abr/2026)
- **Link:** https://arxiv.org/abs/2507.05201
- **Modelo que apoia:** `google/medgemma-27b-it` (e medgemma-4b-it); **introduz também o `google/MedSigLIP`**
- **Por que importa:** technical report oficial do Google da coleção MedGemma (Gemma 3 4B/27B): +2,6–10% em QA multimodal médico fora de distribuição, **+15,5–18,1% em classificação de achados em raio-x de tórax** e +10,8% em tarefas agênticas vs. os modelos-base; fine-tuning reduz em **50% os erros de recuperação de informação em EHR**. O mesmo paper introduz o **MedSigLIP**, codificador de imagem "medicamente afinado" derivado do SigLIP — ou seja, cobre os dois primeiros itens da stack em uma única fonte oficial.

### MedGemma 1.5 Technical Report
- **Autores:** Sellergren, Gao, Mahvar et al. (Google)
- **Veículo/Ano:** arXiv 2026 (abril)
- **Link:** https://arxiv.org/abs/2604.05081
- **Modelo que apoia:** `google/medgemma-1.5-4b-it`
- **Por que importa:** a geração 1.5 em apenas 4B adiciona **volumes 3D (CT/RMI) e lâminas inteiras de histopatologia**, localização anatômica e RX multi-tempo: +11% de acurácia em RMI 3D, **+47% macro-F1 em whole-slide pathology**, +35% de IoU em localização em tórax, **+5% em MedQA e +22% em EHRQA**, e 18% macro-F1 em extração de dados de **laudos laboratoriais** — exatamente os casos de uso de exames do drhealth.tech, rodando na GPU A10 de 24GB via Ollama.

### SigLIP 2: Multilingual Vision-Language Encoders with Improved Semantic Understanding, Localization, and Dense Features
- **Autores:** Tschannen et al. (Google DeepMind)
- **Veículo/Ano:** arXiv 2025
- **Link:** https://arxiv.org/abs/2502.14786
- **Modelo que apoia:** `google/MedSigLIP` (linhagem do codificador de imagem médica; geração atual SigLIP 2)
- **Por que importa:** família de codificadores imagem-texto que supera o SigLIP original em todas as escalas em classificação zero-shot, recuperação imagem-texto e transferência para VLMs, com ganhos fortes em localização e predição densa. É a base científica da geração de codificadores do ecossistema MedGemma; o MedSigLIP original deriva do SigLIP v1 (Zhai et al., **ICCV 2023 Oral**, arXiv 2303.15343), citado como base no próprio MedGemma TR.

### A Vision-Language Foundation Model to Enhance Efficiency of Chest X-ray Interpretation
- **Autores:** Chen et al. (Stanford AIMI — Stanford University)
- **Veículo/Ano:** arXiv 2024
- **Link:** https://arxiv.org/abs/2401.12208
- **Modelo que apoia:** `StanfordAIMI/CheXagent-2-3b` (o card oficial do modelo cita exatamente este paper; **não existe paper separado para o CheXagent-2** — verificado em 07/09/2026)
- **Por que importa:** o CheXagent, treinado no dataset CheXinstruct, é competitivo em 8 tipos de tarefa no benchmark CheXbench (RX de tórax). Na avaliação clínica com 8 radiologistas, rascunhos do modelo geraram **36% de economia de tempo para residentes** e melhora da eficiência de escrita em **81% dos casos (residentes) e 61% (attendings)**, sem perda de qualidade — evidência direta do ganho operacional de laudo assistido.

### A whole-slide foundation model for digital pathology from real-world data
- **Autores:** Xu et al. (Paige AI / Providence Health & Services — rede com 28 centros de câncer nos EUA)
- **Veículo/Ano:** Nature, 2024
- **Link:** https://www.nature.com/articles/s41586-024-07441-w (DOI 10.1038/s41586-024-07441-w)
- **Modelo que apoia:** `prov-gigapath/prov-gigapath` (patologia digital whole-slide)
- **Por que importa:** o Prov-GigaPath foi pré-treinado em **1,3 bilhão de tiles 256×256 de 171.189 lâminas** (>30 mil pacientes, 31 tipos de tecido) de dados clínicos reais e atinge **estado da arte em 25 de 26 tarefas** (9 de subtipagem de câncer + 17 pathomics), superando o segundo colocado em 18 delas. É o único foundation model de patologia publicado na Nature — o argumento mais forte da stack para anatomia patológica.

### Lingshu: A Generalist Foundation Model for Unified Multimodal Medical Understanding and Reasoning
- **Autores:** LASA Team / Xu et al. (Shanghai AI Laboratory / Alibaba DAMO Academy)
- **Veículo/Ano:** arXiv 2025 (versão de journal publicada no IEEE TPAMI, 2026)
- **Link:** https://arxiv.org/abs/2506.07044
- **Modelo que apoia:** `lingshu-medical-mllm/Lingshu-I-8B` (o card oficial da família aponta este paper; o Lingshu-I-8B é a variante 8B construída sobre InternVL3, "SOTA em VQA médico" segundo o card)
- **Por que importa:** MLLM médico generalista com curadoria multimodal de dados (texto médico extenso + legendas/VQA/amostras de raciocínio sintéticas e verificadas), treinamento em múltiplos estágios e exploração de RL com recompensas verificáveis; o trabalho também entrega o **MedEvalKit**, kit unificado de avaliação médica multimodal — linha de defesa contra alucinação via dados bem curados.

### Collaboration between clinicians and vision–language models in radiology report generation
- **Autores:** Tanno et al. (Google DeepMind)
- **Veículo/Ano:** Nature Medicine, 2024
- **Link:** https://www.nature.com/articles/s41591-024-03302-1 (DOI 10.1038/s41591-024-03302-1)
- **Modelo que apoia:** contexto de adoção clínica para CheXagent-2/MedGemma em laudos de radiologia
- **Por que importa:** painel de radiologistas certificados julgou **77,7% dos laudos gerados por VLM como preferíveis ou equivalentes aos humanos** (ambulatório/internação; 94% nos casos sem achados relevantes), e erros clinicamente significativos existem dos dois lados (22,8% só IA vs. 14,0% só humano). Define o desenho certo: **radiologista editando rascunho de IA** (human-in-the-loop), não IA autônoma.

---

## Referências complementares (verificadas, sem entrada própria)

- **Campanella et al.**, "A clinical benchmark of public self-supervised pathology foundation models" — *Nature Communications*, 2025 — DOI 10.1038/s41467-025-58796-1. Benchmark clínico independente de modelos de patologia: útil para justificar a escolha do GigaPath frente às alternativas em auditoria.
- **Zhai et al.**, "Sigmoid Loss for Language Image Pre-Training" (SigLIP) — *ICCV 2023 Oral* — https://arxiv.org/abs/2303.15343. Codificador-base do qual o MedSigLIP original deriva ("a medically-tuned vision encoder derived from SigLIP", MedGemma TR).
- **MedGemma 1.5 / MedSigLIP 2 no HuggingFace:** `google/medgemma-1.5-4b-it` (tags de paper: arXiv 2604.05081, SigLIP 2303.15343) — https://huggingface.co/google/medgemma-1.5-4b-it.
