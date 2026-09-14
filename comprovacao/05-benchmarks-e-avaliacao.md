# 05 — Benchmarks e Avaliação (+ adoção clínica de LLM)

Benchmarks usados para medir os modelos da stack (MMLU, MedQA, HealthBench, MultiMedQA) e papers de **avaliação clínica e adoção de LLM em ambiente médico** — o contexto comercial para o hospital (ex.: Einstein) e a base de honestidade técnica para auditoria.

Verificados por fetch em 07/09/2026. Comentários em PT-BR; títulos em inglês.

---

## Benchmarks

### Measuring Massive Multitask Language Understanding
- **Autores:** Hendrycks et al. (UC Berkeley)
- **Veículo/Ano:** ICLR 2021 / arXiv 2020
- **Link:** https://arxiv.org/abs/2009.03300
- **Modelo que apoia:** todos os LLM da stack (metric universal de conhecimento, incluindo questões de medicina)
- **Por que importa:** criou o MMLU — **57 tarefas** incluindo medicina, genética e anatomia; até hoje é o termômetro padrão de conhecimento geral/médico de qualquer LLM (o II-Medical-8B reporta MMLU-Pro na sua tabela oficial).

### What Disease Does This Patient Have? A Large-Scale Open Domain Question Answering Dataset from Medical Exams
- **Autores:** Jin et al. (Peking University)
- **Veículo/Ano:** Applied Sciences 11(14):6421, 2021
- **Link:** https://doi.org/10.3390/app11146421
- **Modelo que apoia:** benchmark de QA clínico para II-Medical-8B, MedGemma e Lingshu (todos reportam MedQA)
- **Por que importa:** o **MedQA** — 12.723 questões (EN) de provas reais de licenciamento médico (board exams), mais 34.251 e 14.123 em chinês; é o benchmark de referência "USMLE-style" citado em todos os papers médicos da stack (ex.: 87,82% do II-Medical-8B; 86,5% do Med-PaLM 2).

### Large language models encode clinical knowledge
- **Autores:** Singhal et al. (Google)
- **Veículo/Ano:** Nature, 2023
- **Link:** https://www.nature.com/articles/s41586-023-06291-2 (DOI 10.1038/s41586-023-06291-2; arXiv 2212.13138)
- **Modelo que apoia:** referência de avaliação clínica de LLM (framework MultiMedQA)
- **Por que importa:** primeiro LLM médico publicado na **Nature**: introduz o MultiMedQA (7 datasets, incluindo MedQA/MedMCQA/PubMedQA) e o framework de avaliação humana por eixos (**factualidade, precisão, dano potencial, viés**); o Med-PaLM foi o primeiro modelo a "passar" em questões estilo USMLE, com 67,2% no MedQA (número citado no abstract do Med-PaLM 2). É o marco que legitima "LLM em medicina" em veículo top.

### Toward expert-level medical question answering with large language models
- **Autores:** Singhal et al. (Google)
- **Veículo/Ano:** Nature Medicine, 2025 (arXiv 2305.09617, 2023)
- **Link:** https://www.nature.com/articles/s41591-024-03423-7 (DOI 10.1038/s41591-024-03423-7)
- **Modelo que apoia:** referência do teto de desempenho em QA clínico (Med-PaLM 2)
- **Por que importa:** Med-PaLM 2 alcançou **86,5% no MedQA** (contra 67,2% do Med-PaLM — ganho de mais de 19 pontos, novo SOTA na época) e, em comparação pareada de 1.066 perguntas médicas, **médicos preferiram as respostas do Med-PaLM 2 às de outros médicos em 8 de 9 eixos de utilidade clínica** (p<0,001) — o padrão-ouro de "nível especialista" que os modelos open-weight da stack perseguem.

### Towards conversational diagnostic artificial intelligence
- **Autores:** Tu et al. (Google Research / DeepMind)
- **Veículo/Ano:** Nature, 2025 (arXiv 2401.05654, 2024)
- **Link:** https://www.nature.com/articles/s41586-025-08866-7 (DOI 10.1038/s41586-025-08866-7)
- **Modelo que apoia:** referência de diálogo diagnóstico (AMIE) — o alvo da experiência conversacional do drhealth.tech
- **Por que importa:** estudo **randomizado, duplo-cego e cruzado** com consulta por texto estilo OSCE (159 casos, 20 médicos de atenção primária, avaliadores especialistas e patient-actors): o AMIE apresentou **maior acurácia diagnóstica e desempenho superior em 30 de 32 eixos** (avaliação de especialistas) e **25 de 26** (pacientes-atores) frente a médicos reais. Prova científica em veículo top de que diálogo clínico assistido por LLM é mensurável e competitivo.

### Introducing HealthBench
- **Autores:** OpenAI (equipe HealthBench)
- **Veículo/Ano:** OpenAI, maio/2025 — anúncio + relatório técnico + dados abertos (não é artigo de journal; a fonte primária é a própria OpenAI)
- **Link:** https://openai.com/index/healthbench/ (relatório técnico em PDF: https://cdn.openai.com/pdf/bd7a39d5-9e9f-47b3-903c-8b847ca650c7/healthbench_paper.pdf)
- **Modelo que apoia:** benchmark de saúde para o II-Medical-8B (reporta 40% no card) e para o acompanhamento de qualidade dos LLM da stack
- **Por que importa:** benchmark aberto da OpenAI com **5.000 conversas de saúde realistas** avaliadas por **48.562 critérios de rubrica** escritos por **262 médicos de 60 países** (26 especialidades, 49 idiomas) — mede utilidade clínica de verdade em vez de múltipla escolha; os modelos frontier da OpenAI melhoraram **28%** no HealthBench em poucos meses. Subconjuntos: Consensus (3.671 exemplos com consenso médico) e Hard (1.000 difíceis).

### HealthBench Professional: Evaluating Large Language Models on Real Clinician Chats
- **Autores:** Soskin Hicks, Trofimov et al. (OpenAI)
- **Veículo/Ano:** arXiv 2026 (abril)
- **Link:** https://arxiv.org/abs/2604.27470
- **Modelo que apoia:** benchmark dos casos de uso reais do drhealth.tech com clínicos
- **Por que importa:** evolui o HealthBench para **conversas reais de médicos com o ChatGPT for Clinicians** — organizado nos três casos de uso centrais da prática (consultoria de cuidado, **escrita e documentação**, pesquisa médica), com rubrics escritas e adjudicadas por **3+ médicos em três fases** e ~1/3 de testes adversariais deliberados; inclui **baseline humano** (médicos especialistas, tempo ilimitado, com web) — o melhor sistema superou médicos e demais modelos.

## Avaliação clínica e adoção (contexto comercial)

### Large language models in medicine
- **Autores:** Thirunavukarasu et al. (University of Cambridge / Singapore Eye Research Institute / Duke-NUS)
- **Veículo/Ano:** Nature Medicine 29(8):1930–1940, 2023
- **Link:** https://www.nature.com/articles/s41591-023-02448-8 (DOI 10.1038/s41591-023-02448-8)
- **Modelo que apoia:** survey de referência para o discurso com a diretoria médica
- **Por que importa:** o "primer" de LLM em medicina mais citado, escrito para clínicos: como LLMs funcionam, onde já foram implantados, forças e limitações — cita que chatbots biomédicos já rodam em vários contextos "com resultados impressionantes, porém mistos". É a porta de entrada intelectual para o comitê clínico do hospital.

### Comparing Physician and Artificial Intelligence Chatbot Responses to Patient Questions Posted to a Public Social Media Forum
- **Autores:** Ayers et al. (UC San Diego)
- **Veículo/Ano:** JAMA Internal Medicine, 2023
- **Link:** https://doi.org/10.1001/jamainternmed.2023.1838 (PMC: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10148230/)
- **Modelo que apoia:** qualidade de resposta a perguntas de pacientes (fluxos de patient engagement do drhealth)
- **Por que importa:** estudo em JAMA IM: avaliadores licenciados **preferiram a resposta do chatbot à do médico em 78,6%** das 585 avaliações (195 perguntas do r/AskDocs), com qualidade e empatia superiores — evidência clássica de valor para triagem/respondimento assistido de mensagens de pacientes.

### Adapted large language models can outperform medical experts in clinical text summarization
- **Autores:** Van Veen et al. (Stanford Center for AI in Medicine and Imaging — **coautores incluem o Hospital Albert Einstein, São Paulo**)
- **Veículo/Ano:** Nature Medicine 30(4):1134–1142, 2024
- **Link:** https://www.nature.com/articles/s41591-024-02855-5 (DOI 10.1038/s41591-024-02855-5)
- **Modelo que apoia:** sumarização clínica (evolução, alta, diálogo médico-paciente) — o coração do produto de documentação
- **Por que importa:** 8 LLMs adaptados em 4 tarefas de sumarização clínica; em leitura cega por 10 médicos, os sumários do melhor LLM adaptado foram julgados **equivalentes (45%) ou superiores (36%) aos de especialistas médicos** — 81% no total — com análise de segurança categorizando tipos de informação fabricada. **E o coautor Eduardo Pontes Reis é do Einstein**: âncora institucional brasileira direta para a conversa comercial.

### Evaluation and mitigation of the limitations of large language models in clinical decision-making
- **Autores:** Hager et al. (MIT CSAIL)
- **Veículo/Ano:** Nature Medicine, 2024
- **Link:** https://www.nature.com/articles/s41591-024-03097-1 (DOI 10.1038/s41591-024-03097-1)
- **Modelo que apoia:** contrapeso de honestidade técnica — justifica o desenho com humano-no-loop de TODOS os fluxos da stack
- **Por que importa:** em **2.400 casos reais do MIMIC-IV** (4 patologias abdominais comuns), LLMs state-of-the-art diagnosticaram **significativamente pior que médicos**, não seguiram guidelines diagnósticas nem terapêuticas e não interpretaram resultados laboratoriais; conclusão: "LLMs não estão prontos para decisão clínica autônoma". Citar este paper em propostas comerciais diferencia a BeansTech de vendedores de "mágica" e é exatamente o que um comitê de auditoria quer ver.

---

## Como usar esta seção (resumo operacional)

| Pergunta do cliente | Paper para abrir |
|---|---|
| "Como vocês comparam a qualidade dos modelos?" | HealthBench (OpenAI) + MedQA + MMLU |
| "Isso já foi validado em ambiente clínico real?" | AMIE (Nature 2025), Van Veen (Nat Med 2024), Tanno (Nat Med 2024, arquivo 01) |
| "O médico perde o controle?" | Hager (Nat Med 2024) + Careless Whisper (FAccT 2024) — desenho human-in-the-loop |
| "Qual a referência acadêmica do hype de LLM médico?" | Thirunavukarasu (Nat Med 2023) + Med-PaLM (Nature 2023) |
