# 03 — Genética e Laboratorial

Papers que fundamentam o modelo genético da stack (`zhihan1996/DNABERT-2-117M`) e a parte laboratorial do NER (`OpenMed/OpenMed-NER-*` sobre BC5CDR), com os benchmarks independentes de foundation models de DNA.

Verificados por fetch em 07/09/2026. Comentários em PT-BR; títulos em inglês.

---

### DNABERT-2: Efficient Foundation Model and Benchmark For Multi-Species Genome
- **Autores:** Zhou et al. (Northwestern University — MAGICS Lab)
- **Veículo/Ano:** ICLR 2024 (poster — aceitação confirmada no OpenReview e nos Proceedings do ICLR 2024) / arXiv 2023
- **Link:** https://arxiv.org/abs/2306.15006 (OpenReview: https://openreview.net/forum?id=oMLQB4EZE1)
- **Modelo que apoia:** `zhihan1996/DNABERT-2-117M` (genética/DNA da stack)
- **Por que importa:** troca a tokenização k-mer (com sobreposição) por **BPE sobre o genoma**, com estratégias para entradas longas e menor custo de tempo/memória — segundo os slides oficiais do ICLR 2024, ~3× mais rápido que o DNABERT original com comprimento de entrada ilimitado e melhor desempenho. O paper também introduz o **GUE (Genome Understanding Evaluation)**: 36 datasets, 9 tarefas, sequências de 70 a 10.000 nucleotídeos — o benchmark padrão da área. É o modelo de DNA com melhor relação tamanho/qualidade para a A10 (117M parâmetros).

### Nucleotide Transformer: building and evaluating robust foundation models for human genomics
- **Autores:** Dalla-Torre et al. (InstaDeep)
- **Veículo/Ano:** Nature Methods, 2024
- **Link:** https://www.nature.com/articles/s41592-024-02523-z (DOI 10.1038/s41592-024-02523-z)
- **Modelo que apoia:** contexto científico do `DNABERT-2-117M` (é um dos modelos que o paper do DNABERT-2 usa como par e compara)
- **Por que importa:** estudo extenso de foundation models de DNA de **50M a 2,5B parâmetros pré-treinados em 3.202 genomas humanos + 850 genomas de outras espécies**; as representações contextuais predizem fenótipos moleculares com pouco dado anotado — a validação *peer-reviewed em journal top* da abordagem que o DNABERT-2 usa na stack.

### Sequence modeling and design from molecular to genome scale with Evo
- **Autores:** Nguyen et al. (Arc Institute)
- **Veículo/Ano:** Science, 2024
- **Link:** https://doi.org/10.1126/science.ado9336
- **Modelo que apoia:** contexto de genômica de longa distância (evidência do estado da arte em modelos de sequência de DNA)
- **Por que importa:** foundation model de contexto longo treinado em milhões de genomas procariontes e de fagos: predição de função zero-shot competitiva e **geração de sistemas CRISPR-Cas e transposons funcionais** — primeira co-design proteína-RNA/DNA por modelo de linguagem. Evidência de que modelos de sequência genômica escalam, ancorando a linha genética da stack.

### Benchmarking DNA foundation models for genomic and genetic tasks
- **Autores:** Feng et al.
- **Veículo/Ano:** Nature Communications, 2025
- **Link:** https://www.nature.com/articles/s41467-025-65823-8 (DOI 10.1038/s41467-025-65823-8)
- **Modelo que apoia:** `zhihan1996/DNABERT-2-117M` (validação independente e imparcial)
- **Por que importa:** benchmark abrangente e sem conflito de interesse de **5 modelos** (DNABERT-2, Nucleotide Transformer V2, HyenaDNA, Caduceus-Ph e GROVER) em classificação de sequências, predição de expressão gênica, quantificação de efeito de variantes e reconhecimento de TAD, usando embeddings zero-shot; mostra que o pooling *mean token embedding* consistentemente supera outras estratégias — material objetivo para relatório de auditoria sobre por que DNABERT-2 e onde ele não é a melhor escolha.

### BioCreative V CDR task corpus: a resource for chemical disease relation extraction
- **Autores:** Li et al. (National Center for Biotechnology Information — NCBI/NIH)
- **Veículo/Ano:** Database (Oxford), 2016
- **Link:** https://doi.org/10.1093/database/baw068
- **Modelo que apoia:** `OpenMed/OpenMed-NER-ChemicalDetect-*` e `OpenMed/OpenMed-NER-DiseaseDetect-*` (NER laboratorial — corpus de treino/avaliação)
- **Por que importa:** corpus de referência internacional de **1.500 artigos PubMed com anotação manual** de menções de químicos e doenças (ex.: 5.818 entidades de doença) e das relações químico-doença — o benchmark no qual os modelos DiseaseDetect/ChemicalDetect da OpenMed foram treinados e validados (F1 ~0,91 no card do modelo). Como é público e curado por anotadores profissionais, dá rastreabilidade à camada laboratorial do NER.

---

## Notas de auditoria desta seção

1. **DNABERT-2 = ICLR 2024 (poster)**, conforme OpenReview/Proceedings — atenção: circula informação errônea de "ICML 2024"; o registro correto é ICLR 2024 (o comentário no arXiv e o OpenReview confirmam).
2. A cadeia laboratorial completa da stack é: **BC5CDR (corpus anotado) → OpenMed NER (SOTA 10/12 benchmarks, arXiv 2508.01630) → SapBERT/UMLS-SNOMED (codificação de conceitos, NAACL 2021)** — ver arquivo 02 para os dois últimos.
3. Para variantes clínicas específicas (ex. interpretação de variantes patogênicas), os papers acima cobrem a base (benchmark de variant effect no paper da Nat Commun 2025); qualquer promessa clínica adicional exige validação local.
