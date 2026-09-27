# PROPOSTA TÉCNICA — RAGJur para o Sistema de Justiça Cearense
## Biblioteca de pesquisa jurídica com IA de dados próprios, GPUs dedicadas e OCR integrado

**Destinatários:** Tribunal de Justiça do Ceará (TJCE) · Ministério Público do Estado do Ceará (MPCE) · Defensoria Pública do Estado do Ceará (DPE-CE)
**Proponente:** Beans Tech Inova Simples (I.S.) — CNPJ 64.160.205/0001-17 — São Paulo/SP
**Data:** setembro/2026

---

## 1. APRESENTAÇÃO

A BeansTech propõe ao Sistema de Justiça Cearense a implantação do **RAGJur** — biblioteca de
pesquisa e jurimetria sobre a maior base privada de jurisprudência brasileira — com
processamento por inteligência artificial executado em **GPUs dedicadas e sob controle
institucional**, e ferramenta de **OCR integrada** aos sistemas judiciais, garantindo que
**nenhum dado da instituição saia de seu ambiente**.

## 2. O PROBLEMA

- **Volume:** o Brasil produz dezenas de milhões de decisões; servidores e membros pesquisam
  em sistemas de consulta que devolvem listas, não respostas.
- **Tempo:** localizar precedente aplicável consome horas que a instituição não tem.
- **Risco:** ferramentas genéricas de IA produzem citações inexistentes ("alucinações") —
  risco ético e institucional inaceitável em peças e decisões.
- **Soberania:** as alternativas de mercado operam em nuvens estrangeiras, com dados
  submetidos a jurisdição externa.

## 3. A SOLUÇÃO

**RAGJur** — plataforma de pesquisa, jurimetria e redação assistida:

1. **Base auditável:** mais de **106 milhões de julgados** coletados de ~90 fontes oficiais,
   com número de processo, tribunal, relator e ementa verificáveis — cada citação retornada
   é rastreável ao documento-fonte.
2. **Busca semântica e filtrada:** por tema, tribunal, turma, relator, classe e período —
   resultados em milissegundos.
3. **Jurimetria institucional:** perfil de órgãos julgadores, taxas de provimento, tempo de
   tramitação, divergências entre turmas, previsão estatística de desfecho.
4. **Redação assistida com verificação de citação:** minutas fundamentadas em que **toda
   referência processual é verificada contra a base antes de chegar ao usuário**.
5. **API e conectores:** integração aos fluxos da instituição por REST e MCP (compatível
   com os principais assistentes de IA do mercado).

**OCR integrado:** digitalização e leitura de processos físicos e documentos, com o texto
indexado na mesma base — o acervo histórico da instituição torna-se pesquisável.

## 4. POR QUE O MODELO QWEN — BENCHMARKS E ESTUDOS

O motor de linguagem adotado é a família **Qwen** (Alibaba), selecionada por desempenho
comprovado em avaliações públicas e independentes:

**4.1. Língua portuguesa e multilinguismo**
- **PoETa v2** (NLP@USP / Maritaca, 2025) — benchmark de **44 tarefas nativas de língua
  portuguesa**, 12 delas desenhadas regionalmente: os modelos Qwen alcançam os **maiores
  resultados entre os open-source avaliados** (Qwen2.5-14B ≈ 71,0 e Qwen3-14B ≈ 70,5 de
  nota média ponderada). — arXiv:2511.17808
- **MMMLU** (OpenAI, 2024) — MMLU traduzido por humanos para 14 línguas, incluído
  português: Qwen3-235B ≈ 0,867 de média. — openai/simple-evals
- **MATH-PT** (2026) — primeiro benchmark nativo de português (pt-BR e pt-PT) de
  raciocínio matemático, com a família Qwen3 como baseline. — arXiv:2604.25926

**4.2. Domínio financeiro e bancário**
- **FinEval** (SUFE AIFLM Lab, NAACL 2025) — 4.661 questões de conhecimento financeiro
  (finanças, contabilidade, economia): **Qwen2.5-72B-Instruct é o melhor modelo open-source
  do ranking** (69,4 zero-shot), atrás apenas do melhor modelo proprietário da época
  (72,9); lidera a categoria "Financial Academic Knowledge" (76,5). — arXiv:2308.09975
- **FinBen / Open FinLLM Leaderboard** (TheFinAI + FINOS, NeurIPS 2024) — 42 datasets, 24
  tarefas e 8 domínios financeiros (crédito, **fraude**, compliance, previsão, ESG): a
  família Qwen é base pública e reprodutível para especialização bancária. —
  arXiv:2402.12659 · arXiv:2501.10963
- **MultiFinBen** (ACL 2026) — primeiro benchmark financeiro multilíngue e multimodal
  (5 línguas; texto, visão e áudio), anotado por especialistas. — arXiv:2506.14028
- **Qwen-DianJin** (Alibaba, 2025) — LLM financeiro construído sobre Qwen, avaliado em
  CFLUE, FinQA e GSM8K. — github.com/aliyun/qwen-dianjin · arXiv:2504.15716

**4.3. Raciocínio**
- **LiveBench** (2024/2025) — benchmark anti-contaminação com questões renovadas: Qwen3-235B
  ≈ 77,1 e Qwen3-Thinking-2507 ≈ 78,4 — **topo entre modelos abertos**. — livebench.ai

**4.4. Por que isso importa para o Tribunal**
Pela combinação: **nota máxima em português entre open-source + liderança open-source em
conhecimento financeiro + pesos abertos** — o que permite: rodar em **GPUs da própria
instituição** (sem envio de dados a serviços externos, sem *lock-in*, sem custo por
consulta), com especialização verificável para o contencioso econômico-financeiro e a
criminalidade patrimonial — e custos de implantação soberana.

## 5. GUARDRAILS — CONFORMIDADE POR ARQUITETURA

A plataforma incorpora, por projeto (não por promessa), os seguintes mecanismos:

1. **Verificação obrigatória de citações (anti-alucinação):** toda referência processual
   em resposta gerada é conferida contra a base antes de exibição; citação não localizada
   **bloqueia a resposta** e devolve ao modelo a exigência de reformulação — o usuário
   nunca recebe citação não verificada.
2. **Trilha de auditoria:** registro JSONL de consultas, respostas, bloqueios e
   reformulações — auditável a qualquer tempo.
3. **Revisão humana como decisão final:** o sistema entrega **tempo e fundamento**; a
   decisão permanece do Magistrado ou membro — a expertise é e sempre será
   **imprescindível e insubstituível**.
4. **LGPD e sigilo:** dados pessoais e de autos permanecem no ambiente institucional;
   **nenhum dado de processo é utilizado para treinamento de modelos**; operação por RAG
   sobre jurisprudência pública e acervo digitalizado da própria instituição.
5. **Soberania computacional:** implantação **on-premise** (datacenter da instituição) ou
   nuvem soberana por ela contratada — **GPUs dedicadas**, sem tráfego externo.
6. **Sinalização de incerteza:** quando a base não sustenta a resposta, o sistema o declara
   expressamente, em vez de completar lacunas.

## 6. ESCOPO DE IMPLANTAÇÃO (FASES)

| Fase | Conteúdo | Prazo |
|---|---|---|
| 1. Diagnóstico | Levantamento de sistemas (PJe/e-SAJ/eproc/protocolo), acervo físico a digitalizar, perfis de uso | 2 semanas |
| 2. Piloto | Implantação em órgão-piloto (varas/câmaras/procuradorias selecionadas), carga da base + OCR do acervo do órgão, 20–50 usuários | 90 dias |
| 3. Avaliação | Métricas acordadas: tempo médio de pesquisa, citações verificadas, adoção | 2 semanas |
| 4. Ampliação | Extensão ao restante da instituição e integração plena do OCR aos sistemas | a contratar |

## 7. CAPACITAÇÃO E SUPORTE (CONTRAPARTIDAS DA PROPONENTE)

- **Treinamento: 1 (um) dia a cada 15 (quinze) dias**, durante o período de implantação,
  para servidores, membros e equipes técnicas — presencial ou remoto.
- **Suporte integral remoto por 6 (seis) meses** às equipes de implementação da
  instituição, em horário comercial.
- **Transferência de conhecimento:** documentação completa de operação, arquitetura e
  administração da instalação.

## 8. FORMAS DE CONTRATAÇÃO

1. **Piloto sem ônus** (termo de cooperação para as fases 1–3), seguindo para aquisição
   após avaliação de resultados;
2. **Processo licitatório** convencional, com esta proposta como referência técnica;
3. **Programa de pesquisa e desenvolvimento** com co-financiamento (editais de inovação
   do Poder Judiciário e órgãos de fomento);
4. **Termo de Colaboração com vocação restaurativa** — instrumento de colaboração
   tecnológica com **contrapartida social integral da proponente** nas fases 1 a 3
   (piloto, capacitação 1 dia a cada 15 dias e suporte de 6 meses), inspirado nos
   princípios da **Justiça Restaurativa** (CNJ, Resolução nº 385/2021 — Política
   Nacional de Justiça Restaurativa): a tecnologia como **restituição de tempo e de
   capacidade** à comunidade judiciária e às pessoas por ela atendidas, com foco no
   **acesso à justiça** — vocação naturalmente alinhada à missão da Defensoria Pública.

As condições comerciais definitivas (licenciamento, manutenção após os 6 meses, hardware)
serão objeto de instrumento próprio, conforme o rito escolhido.

## 9. A EMPRESA

A **Beans Tech Inova Simples (I.S.)** desenvolve infraestrutura de IA para setores
regulados desde 2024 — base própria de jurisprudência (RAGJur), implantações em nuvem
nacional com GPUs dedicadas e arquitetura de compliance por projeto. Produtos em operação:
ragjur.ai (pesquisa e jurimetria) e suíte de aplicativos jurídicos.

**Demonstração ao vivo** da plataforma em operação (a verificação de citações e a busca
sobre os 106 milhões de julgados) está disponível a qualquer momento, presencial ou remota.

## 10. ANEXOS

Seguem, em anexo, os títulos acadêmicos e comprovações do proponente e da equipe técnica:
- **3 (três) títulos de pós-graduação** do proponente;
- **certificados de cursos e certificações** técnico-profissionais correlatos.

## 11. CONSIGNAÇÃO FINAL

O proponente registra que esta proposta tem, também, um sentido pessoal: **o Ceará é a
terra de seus avós e o Estado de seus pais** — entregar ao sistema de justiça cearense
ferramentas de excelência é, para ele, uma forma de **honrar esse legado**.

E de fazê-lo no espírito correto: o que a tecnologia oferece é **tempo** — mais horas
para o que nenhuma máquina pode fazer. A decisão, a experiência e a expertise do membro
ou do Magistrado **sempre foram e sempre serão imprescindíveis**; o RAGJur existe para
devolver a elas o espaço que a burocracia consome.

**Contato:** [nome, cargo, telefone, e-mail]

---

*Documento para apresentação institucional. Dados técnicos verificáveis em demonstração:
volume da base, arquitetura de implantação, mecanismo de verificação de citações.
Benchmarks citados com fonte pública (arXiv/OpenAI/USP/NAACL/NeurIPS/ACL/livebench.ai).*
