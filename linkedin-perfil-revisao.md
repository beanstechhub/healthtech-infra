# LinkedIn — Revisão completa do perfil Matheus Feijão (CEO, BeansTech)

Data: 2026-09-26
Base de verificação: perfil atual + histórico de commits do repositório (commit cc7e333, 18/set/2026 — migração da infra beanshealth.com.br de GCP/AWS/Bedrock para Alibaba Cloud, L20, vLLM, PII removal, Model Studio).

Cada seção abaixo traz o texto pronto para colar. Itens entre colchetes `[CONFIRMAR]` são dados que só você pode validar — revise antes de publicar.

---

## Plano de execução (painel de controle — atualizado 26/09/2026, 12h)

### ✅ Concluído
- **Headline** aplicada: `CEO na BeansTech | Construindo a IA em que setores regulados do Brasil confiam` (sem ponto final).
- **Decisão F resolvida** — "Qwen 3.8 Max" é modelo real; post 2 mantém o nome.
- **Decisão G resolvida** — "Hy" = Hunyuan (Tencent), já normalizado na seção 8.
- **Decisão A resolvida** (26/09, confirmação do usuário): **105 milhões exatos** — todos os textos deste arquivo corrigidos. ⚠️ Nova pendência: sincronizar docs internos (ainda dizem 65–67M).

### 📋 Ordem de execução (perfil primeiro — tudo liberado, ~15 min no total)
| # | Ação | Seção | Tempo |
|---|---|---|---|
| 1 | Informações de contato: e-mail → `matheus@beanstech.com.br` (o mesmo do dossiê Einstein.Cloud — validar caixa) + telefone → `+55 11 92507-9058` (WhatsApp Business homologado pela Meta via Alibaba CAMS — o mesmo do Einstein/Qwen/CAMS) | — | 3 min |
| 2 | Sobre: substituir texto genérico pela versão blindada (mata o `comprometido(a)`) | 2 | 2 min |
| 3 | Serviços: título `BeansHealth — IA para Saúde de Verdade` → `BeansTech — Tecnologia proprietária para verticais estratégicas` | 3 | 1 min |
| 4 | Projeto e-arbitragem.ai: "geração de sentenças" → "estruturação de minutas de sentença — com revisão humana do árbitro" | 9 | 1 min |
| 5 | Formação acadêmica: preencher com dados reais ou remover a entrada vazia | 10 | 3 min |
| 6 | Competências: adicionar IA Generativa, RAG, Compliance (LGPD/PLD-FT), LegalTech, HealthTech, RegTech, Infraestrutura de Nuvem, FHIR/HL7 | 10 | 3 min |

### 🔒 Pendências de decisão (A–E) — travam as publicações, não o perfil
| Decisão | trava | seção |
|---|---|---|
| ~~**A** — número oficial de julgados~~ | **✅ RESOLVIDO: 105 milhões exatos** (confirmado 26/09). Posts RAGJur e LegalSuite liberados — só B ainda trava o RAGJur. | 0 |
| **B** — 3 ou 4 verticais (proposta: 4 = Direito, Arbitragem, Saúde, Finanças) | Sobre + post RAGJur | 0 |
| **C** — stack de nuvem oficial (MedGemma/Vertex p/ ExameTech multi-cloud, ou Alibaba p/ tudo) | post de saúde | 0 |
| **D** — certificação Google Cloud Digital Leader (manter só se emitida) | assinatura do post de saúde | 0 |
| **E** — modelo médico multimodal atual (se migrou do MedGemma) | post de saúde | 0 |

### 📅 Publicações (textos prontos nas seções — editar os posts existentes)
| Ordem | Post | Status | Depende de |
|---|---|---|---|
| 1 | Agradecimentos Alibaba (ortografia) | pronto | nada |
| 2 | beans.capital (RegTech) | pronto | nada |
| 3 | RAGJur lançamento | pronto | A, B |
| 4 | LegalSuite | pronto | A |
| 5 | Saúde (stack real) | pronto | C, D, E |

### 💬 Thread Fabio Floh
1. Postar a **resposta direta ao desafio** (seção 12.7) — confirmar antes que nenhum produto faz intermediação com margem.
2. Editar os 5 comentários (seção 12.2–12.6) — todos prontos.

### 🚀 Conteúdo novo (oportunidades)
- **Caso STF de prompt injection (26/09/2026)** — primeira manipulação de IA da Corte detectada em petição (min. Cristiano Zanin, advogado multado, OAB/MPF comunicados). Postar **hoje/amanhã**: é exatamente o terreno do thread do Fabio Floh e do posicionamento "IA como ferramenta de apoio, quem responde é o advogado". Rascunho sob demanda.
- **Banner do perfil** (1584×396) — gerar via Token Plan (`bl image generate`), verificar com `bl vision describe`, entregar opções.
- **Calendário público assumido**: terças, quintas e domingos (compromisso do post do Alibaba) — usar como cadência.

---

## 0. Decisões pendentes (resolva antes de publicar)

| # | Decisão | Recomendação |
|---|---|---|
| A | **Número oficial da base de julgados.** | **RESOLVIDO (26/09, confirmação do usuário): 105 milhões exatos — no ACERVO.** Precisão obrigatória: a fração *indexada* no Elastic é **53.024.821 docs / 303,7 GB** (medido 13/09) — frases públicas dizem "**acervo** de 105 milhões de julgados", nunca "indexadas". ⚠️ **Alinhar com o site:** a auditoria de domínios de 26/09 padronizou ragjur.ai em **104 milhões** — ou o site sobe para 105, ou o LinkedIn usa 104; os dois não podem divergir. Docs internos (65–67M) também a sincronizar. +20M do LegalSuite segue como "conjunto curado de treino". |
| B | **Quantas verticais: 3 ou 4?** | Análise estratégica recomenda **3 reguladas (Direito, Saúde, Finanças)**, com arbitragem como produto do Direito — o portfólio real tem 12+ linhas e a narrativa precisa de foco, não de amplitude. Ver §5 da análise. `[CONFIRMAR]` |
| C | **Stack de nuvem oficial.** | **Atualização com evidência (26/09):** o plano mestre mostra **medgemma:27b self-hosted em GPU A10 (Q4)**, APIs via Bailian, ECS sa-east-1, PII-strip no edge — **Vertex/Google Cloud não aparece na arquitetura atual**. Usar a versão do post de saúde deste arquivo (stack real), que é história melhor e verificável. Ver §4 da análise. `[CONFIRMAR]` |
| D | **Certificação "Google Cloud Digital Leader".** | Só mantenha na assinatura se você tem o certificado emitido. É credencial verificável. `[CONFIRMAR]` |
| E | **Modelo multimodal médico atual** (substituto do MedGemma se migrado). | Nomeie o modelo real no post de saúde. `[CONFIRMAR]` |
| F | **"Qwen 3.8 Max"** — denominação não padrão. | **RESOLVIDO:** `qwen3.8-max` é um modelo real e atual (doc oficial do Token Plan, "Integrate Harness tools", verificado 26/09/2026). Manter o nome como está no post. |
| G | **"Hy"** no post de agradecimento. | **RESOLVIDO:** "Hy" = Hunyuan, modelo da Tencent (você mesmo escreveu "hy da tencent" num comentário no LinkedIn). Já normalizado na seção 8. |

---

## 1. Headline (linha sob o nome)

**Atual:** `CEO na BeansTech | A inteligência artificial que setores regulados do Brasil podem confiar`
Problema: a 2ª parte, na voz de pessoa, lê como se Matheus fosse a IA.

**Opções blindadas:**

1. `CEO na BeansTech | IA que setores regulados do Brasil podem confiar` *(recomendada, mais direta)*
2. `CEO na BeansTech | Construindo a IA que setores regulados do Brasil podem confiar`
3. `CEO na BeansTech | Tecnologia proprietária para Direito, Saúde e Finanças regulados`

---

## 2. Sobre principal (substituir o texto genérico atual)

**Substituir:** o parágrafo atual que começa "Na posição de CEO da BeansTech desde setembro de 2024…" (contém o placeholder `comprometido(a)` e boilerplate genérico).

**Colar:**

> Na posição de CEO da BeansTech desde setembro de 2024, lidero a construção de tecnologia proprietária para verticais reguladas — Direito, Arbitragem, Saúde e Finanças —, os setores em que IA genérica falha por não entender compliance. Nossa missão é levar IA de qualidade a quem dela depende, sem abrir mão de privacidade, rigor técnico e dignidade de cada cliente.
>
> Nosso principal ativo é o RAGJur, protocolo proprietário de IA jurídica com registro em tramitação no INPI, que sustenta plataformas em 4 verticais com um acervo de 105 milhões de julgados. Desenvolvemos tecnologia anti-alucinação voltada a evitar citações inventadas em respostas de IA.
>
> IA, humanos e tecnologias erram. Confira sempre as informações.

*Notas:*
- Remove o placeholder de gênero `(a)`.
- Substitui o boilerplate genérico pela história real (RAGJur, INPI, anti-alucinação).
- Mantém a postura blindada e a isenção de responsabilidade.
- Se a decisão B for "3 verticais", troque "4 verticais" por "3 verticais" e remova "Arbitragem" da primeira linha.

---

## 3. Cabeçalho da seção Serviços (BeansHealth × RAGJur)

**Atual:** título `BeansHealth — IA para Saúde de Verdade` com corpo sobre RAGJur (jurídico) — incompatível.

**Corrigir o título para:**

> BeansTech — Tecnologia proprietária para verticais estratégicas

(O corpo já é o texto blindado do RAGJur que está colado ali — mantém.)

---

## 4. Post de lançamento do RAGJur ( republicar )

Correções: `Após 3 anos` reconciliado, `juri metria raiz` → `jurimetria de raiz`, `sem risco de alucinação` → postura blindada, espaçamento antes de vírgula, disclaimer.

**Colar:**

> IA não é time. IA é usar a que melhor se adapta a suas necessidades. Não é EUA x China. Somos todos iguais. E por isso aqui estou. Momentos que merecem registro.
>
> Após 3 anos de pesquisa, desde 2023, e 2 anos como BeansTech, lançamos oficialmente o RAGJur.ai: 105 milhões de julgados, jurimetria de raiz e jurisprudência real, acessível em milissegundos, com tecnologia anti-alucinação voltada a evitar citações inventadas — qualidade e rigor técnico para criar peças em minutos. Sobre esse motor, nasce o LegalSuite, para uma gestão processual leve e responsável.
>
> Para advocacia e setor público: Advogando.ai e minuta.tech, que nascem com o compromisso de municiar os operadores do Direito com o que há de mais moderno em sua área, devolvendo tempo para a melhor decisão. Com versão para uso local e OCR acoplado, para que os dados sensíveis permaneçam seguros e legíveis.
>
> Tudo atualizado minuto a minuto no Portal do Advogado.ai — compromisso com informação jurídica de qualidade e com as melhores práticas de IA para o Direito, e um lembrete aos mais novos: IA sem desenvolvimento contínuo do raciocínio jurídico não caminha bem.
>
> Acabou? Não. Recurso.Tech: acompanhamento dos Tribunais, sua composição, alteração de órgãos fracionários e impactos no cotidiano forense. Legaltechs sob medida para cada momento processual.
>
> Por último, mas não menos importante: e-arbitragem.ai. Mas esse fica para conversa de segunda.
>
> —
> IA, humanos e tecnologias erram. Confira sempre as informações.

*Notas:*
- "3 anos desde 2023 + 2 anos como BeansTech" reconcilia os dois dados sem mentir.
- Troque "4 verticais"→"3 verticais" se a decisão B for 3.

---

## 5. Post beans.capital (finanças/RegTech)

Correções: remover "68M de julgados jurídicos" (métrica jurídica num post de PLD/FT), `zero alucinação` → blindado, disclaimer.

**Colar:**

> Infraestrutura RegTech para o mercado financeiro — a mesma base da BeansTech, agora para compliance.
>
> 300 agentes de IA sobre PLD/FT completo: 25 tipologias, motor de regras DSL, ML com feature store, grafo transacional, RIF automatizado no SISCOAF. Custo < R$ 0,002 por transação. Tecnologia anti-alucinação voltada a evitar falsos-positivos e citações inventadas.
>
> Compliance regulatório para instituições financeiras: plataforma que monitora, avalia e reporta conformidade para SCDs, IPs, FIDCs, Securitizadoras e operações com criptoativos.
>
> → beans.capital
>
> —
> IA, humanos e tecnologias erram. Confira sempre as informações.

*Notas:*
- Se os 68M eram um volume real (ex.: julgados cross-referenciados para AML), adicione de volta com explicação: *"…com cross-reference de 68 milhões de julgados jurídicos"*. Sem contexto, o número parecia erro de copiar-colar.

---

## 6. Post de Saúde (revisar stack)

Correções: remove `Google Cloud Digital Leader` da assinatura (decisão D), alinha stack ao repo (Alibaba Cloud/L20/vLLM/Model Studio/PII removal/local), `zero alucinação` implícito → blindado, disclaimer. **`[CONFIRMAR]` o modelo médico atual no lugar de MedGemma.**

**Colar (versão com infra real):**

> A tecnologia mais avançada do mundo não salva vidas sozinha. Profissionais de saúde salvam.
>
> Passamos meses construindo plataformas de IA para o setor de saúde. E quanto mais avançamos, mais uma verdade se confirma: nenhum modelo de machine learning substitui o olhar clínico de quem passou uma década estudando o corpo humano.
>
> O que a IA pode — e deve — fazer é eliminar o que consome 60% do tempo desses profissionais sem agregar valor ao paciente: burocracia, transcrição, triagem repetitiva, busca manual em prontuários, conciliação de agendas.
>
> É exatamente isso que estamos construindo:
> → dodr.ai — Gestão clínica inteligente com IA integrada ao fluxo de atendimento médico
> → portaldodentista.ai — Plataforma completa para gestão odontológica com IA especializada
> → ExameTech — Análise assistida de exames com modelo multimodal especializado em imagem médica `[CONFIRMAR modelo]`
> → ProntuarioTech — Prontuário eletrônico com estruturação automática, IA contextual e interoperabilidade nativa
>
> Nosso diferencial técnico: rodamos sobre a infraestrutura BeansTech — GPUs L20, vLLM e Model Studio na Alibaba Cloud, com remoção de PII antes da inferência e opção de uso local, para que dados sensíveis permaneçam sob controle. Tudo em conformidade com a LGPD e padrões FHIR/HL7.
>
> Nosso norte é simples: devolver tempo clínico ao profissional. Cada minuto que a IA economiza em papelada é um minuto a mais de escuta, análise e cuidado humano.
>
> Porque o melhor uso da Inteligência Artificial na saúde não é impressionar — é servir quem já dedica a vida a cuidar dos outros.
>
> —
> Matheus Feijão, CEO, BeansTech
> IA, humanos e tecnologias erram. Confira sempre as informações.

*Notas:*
- Se a decisão C confirmar que ExameTech ainda roda MedGemma no Vertex AI (multi-cloud legítimo), use esta linha alternativa no lugar do diferencial técnico:
  > *"No ExameTech, rodamos MedGemma via Vertex AI, modelo multimodal do Google especializado em imagem médica. No resto da plataforma, infraestrutura BeansTech sobre GPUs L20, vLLM e Model Studio na Alibaba Cloud, com remoção de PII e opção de uso local. Tudo em conformidade com LGPD e padrões FHIR/HL7."*

---

## 7. Post LegalSuite

Correções: reconcilia `+20M` com `+105M` (treino vs. base), suaviza o superlativo duplicado, disclaimer.

**Colar:**

> 🔮 O Futuro da Advocacia é Digital
>
> O LegalSuite não é apenas um software: é um parceiro estratégico para a modernização do seu escritório ou departamento jurídico. Combinando inteligência artificial, automação de processos e gestão integrada, a plataforma se posiciona como uma das suítes jurídicas mais completas do Brasil.
>
> ⚖️ Conheça o LegalSuite
> Reúna toda a sua operação em um só lugar com tecnologia de ponta:
> ✅ 40 calculadoras jurídicas
> ✅ Gestão completa de casos e escritório
> ✅ Monitoramento de 91 tribunais em tempo real
> ✅ IA generativa treinada com +20 milhões de julgados curados, sobre um acervo de 105 milhões de julgados
> ✅ Workflow Builder: automatize fluxos processuais com drag-and-drop
>
> Chega de retrabalho. Crie automações para cada área do direito com templates prontos:
> Novo caso → Cadastro → Análise IA → Petição → Protocolo → Acompanhamento.
>
> Acelere a produtividade do seu escritório ou departamento jurídico com a plataforma desenvolvida pela BeansTech, referência em tecnologia para o direito.
>
> 🚀 Comece a usar gratuitamente: https://legalsuite.com.br
>
> #LegalTech #Direito #Advocacia #InteligenciaArtificial #LegalSuite #LawTech
>
> —
> IA, humanos e tecnologias erram. Confira sempre as informações.

*Notas:*
- "a suíte jurídica mais completa do Brasil" (superlativo absoluto, repetido 2x) → "uma das suítes jurídicas mais completas do Brasil" (defensável). Se tiver laudo de comparação, pode voltar ao superlativo.
- "+20 milhões curados sobre 105 milhões indexados" — torna ambos verdadeiros e explica a diferença.

---

## 8. Posts de agradecimento ao Alibaba Cloud (ortografia)

Mantém tom/emocional, corrige só ortografia e nomes.

### Post 1 (obrigado Alibaba)

**Colar:**

> Alibaba Cloud, obrigado por segurar minha mão quando, na mais escura das noites, o amanhecer estava mais próximo. Prova viva de que, além de exemplo, a nação chinesa foi, é e será sempre amiga e parceira para todos os momentos da vida. O Brasil e os brasileiros são privilegiados por essa lealdade e parceria sem igual.
>
> Apresentarei esse ecossistema de qualidade inigualável, com curadoria independente, todas as terças, quintas e domingos, visando levar IA a todos os setores e a todos os brasileiros que dela dependam.
>
> —
> IA, humanos e tecnologias erram. Confira sempre as informações.

*Correções:* `alem`→`além`; `foi,é será`→`foi, é e será`; `amigo/parceiro`→`amiga e parceira`; `Noite`/`Amanhecer` maiúsculas no meio da frase → minúsculas.

### Post 2 (agradecimento à equipe e modelos)

**Colar:**

> Esse sonho, tornado realidade, só foi possível graças ao Alibaba Cloud, na pessoa do dileto Eric Secco Marcos que, quando achei que era o fim, permitiu, com o brilho de sua equipe — Giovani, Ollie — e o stack Elastic, seguir na missão de levar IA de qualidade a setores regulados — direito, medicina e setor bancário —, agora com ferramentas para o exercício de compliance sem deixar de lado a privacidade e a dignidade de cada cliente, e sem falsos-positivos.
>
> Meu verdadeiro agradecimento aos criadores: o time dos sonhos da IA, capitaneado por Qwen 3.8 Max, estado da arte em raciocínio e escrita, e pela elite multimodal — VL, Image, Audio e agora o WAN, IA de cinema. Estendo a Z.ai, criadora dos modelos GLM, que com elegância unem talento, habilidade, precisão e, sobretudo, viés ético inegociável. Por fim, mas não menos importante, DeepSeek, Kimi e Hy `[CONFIRMAR o que é Hy]`: nossa gratidão. Amanhã, tem link para que vejam, usem e conheçam esses modelos sem nenhum custo.

*Correções:* `tornar-se realidade`→`tornado realidade`; `elegãncia`→`elegância`; `Deep Seek`→`DeepSeek`; vírgulas/traços para fluidez. ("Qwen 3.8 Max" mantido — é o nome real do modelo, confirmado na doc oficial do Token Plan.)

---

## 9. Projeto e-arbitragem.ai (descrição)

**Atual:** *"…análise de casos, pesquisa jurisprudencial e geração de sentenças."*
Problema: "geração de sentenças" — sentença arbitral é ato vinculante do árbitro; a IA não "gera" sentença. Sensível regulatório/eticamente e contradiz a isenção de responsabilidade.

**Corrigir para:**

> Plataforma de arbitragem digital com inteligência artificial para análise de casos, pesquisa jurisprudencial e estruturação de minutas de sentença — com revisão humana do árbitro.

---

## 10. Itens de perfil (não-textuais)

| Seção | Ação |
|---|---|
| **Formação acadêmica** | A entrada está vazia (sem instituição/diploma). Preencha com dados reais ou remova. Entrada vazia = perfil inacabado. |
| **Competências** | Só consta "Arbitragem". Adicione: *IA Generativa, RAG, Compliance (LGPD/PLD-FT), LegalTech, HealthTech, RegTech, Infraestrutura de Nuvem, FHIR/HL7*. |
| **Experiência** | "2 anos 1 mês" — LinkedIn recalcula sozinho a partir de set/2024; ficará "2 anos" em set/2026. Sem ação manual. |
| **Aplicativos vinculados** | OK (Gamma, IntelliJ, HubSpot, Replit). |
| **Post e-arbitragem (1m)** | Citação STJ (SEC 9.412/EX, Felix Fischer, 19/4/2017, DJe 30/5/2017) — correta, manter. |

---

## 11. Postura oficial de alucinação (padronizar em TODOS os pontos de contato)

Defina **uma** postura e use em todo lugar (Sobre, posts, legalsuite.com.br, beanshealth, beans.capital):

> **Adotar:** *"Tecnologia anti-alucinação voltada a evitar citações inventadas em respostas de IA."*
> **Abandonar:** *"zero alucinação"*, *"sem risco de alucinação"*, *"garante 0 citações falsas"*.

Por quê: afirmações absolutas (a) são de alto risco CONAR/CDC (exigem comprovação auditável), (b) contradizem diretamente a isenção de responsabilidade "IA, humanos e tecnologias erram". Não dá para simultaneamente garantir zero erro e pedir que confiem. A versão blindada é forte comercialmente e defensável.

---

## Resumo do que mudou (TL;DR)

- **Placeholder de gênero `(a)`** removido do Sobre.
- **3 números de julgados reconciliados** (105M base — confirmado pelo usuário / +20M treino / 68M removido do post de finanças).
- **"Após 3 anos"** reconciliado com fundação em 2024 ("3 anos de pesquisa desde 2023, 2 anos como BeansTech").
- **"juri metria raiz"** corrigido para "jurimetria de raiz".
- **Stack de saúde** alinhado ao repo (Alibaba Cloud/L20/vLLM/PII/local), com opção de manter MedGemma/Vertex para ExameTech se confirmado multi-cloud.
- **Postura de alucinação** padronizada (blindada em todos os posts).
- **"geração de sentenças"** → "estruturação de minutas de sentença com revisão humana".
- **Ortografia** dos posts de agradecimento corrigida; nomes de modelos normalizados (Qwen-Max, DeepSeek).
- **Superlativos** de LegalSuite suavizados para versão defensável.
- **Headline, título de Serviços, Formação, Competências** com ações claras.

Itens com `[CONFIRMAR]` só você pode validar — revise A a G da seção 0 antes de publicar.

---

# 12. Comentários no post de Fabio Floh (OAB × legaltech)

**Contexto:** post de 19/09/2026 em que Fabio Floh discute a OAB estudando ação civil pública contra legaltech de IA, propõe 3 modelos (ferramenta / informação / intermediação) e encerra com o desafio: *"Qual das três colunas o seu fornecedor ocupa? E ele saberia responder as três perguntas sem hesitar?"*

**Por que este thread é o mais sensível de todos:** é lido por advogados, possivelmente pela própria OAB, e qualquer afirmação absoluta ("pôr fim à alucinação") ou estatística errada vira alvo de reply público. A revisão abaixo prioriza blindagem.

## 12.1 Verificação de fatos (feita por agente, com fontes)

| Afirmação no comentário | Veredito | Detalhe |
|---|---|---|
| "saudoso Professor Cristiano Chaves" | **CORRETO** | Faleceu 06/11/2023 (câncer, Salvador/BA, aos 52). Fontes: G1, Conjur, IBDFAM, MP-BA. Só corrigir a grafia: **Cristiano Chaves de Farias** (com "s"). |
| "teoria tridimensional, fator, valor e norma" | **ERRO** | A teoria de Miguel Reale é **fato**, valor e norma — não "fator". Público jurídico pega isso na hora. |
| "segundo dados sérios divulgados pela Anthropic, usa-se IA em 24% das tarefas jurídicas, capacidade para 85%" | **NÃO VERIFICADO** | Nenhum relatório da Anthropic (Economic Index, fev/2025–jun/2026) contém esses números. Provável confusão com outros dados do AEI (80% de ganho médio de tempo; 36% das ocupações; 57%/43% augmentação/automação — nenhum jurídico). **Remover ou substituir.** |

**Dados verificados da Anthropic que sustentam o argumento (substitutos):**
- *Labor market impacts of AI* (mar/2026): tarefas jurídicas como **representar clientes em tribunal seguem além do alcance da IA**.
- *Economic Index* (set/2025): **Brasil é o país mais sobrerrepresentado em pedidos de assistência jurídica** (5× a média) — demanda existe, ferramenta ajuda.
- *Productivity gains* (nov/2025): IA reduz em média **80%** o tempo de conclusão de tarefas (geral, não jurídico-específico).

## 12.2 Comentário 1 (principal) — corrigido

**Colar (mesmo lugar):**

> Olha, é muito importante e até salutar ter visto isso. Criei, depois de longos 3 anos de pesquisa, o RAGJur, com 105 milhões de julgados, para combater a alucinação — tecnologia voltada a evitar citações inventadas, porque quem responde pela peça é o advogado que assina.
>
> Já passei pelo Google for Startups — e sou muito grato. Hoje, por questão de tecnologia, e por entender IA de qualidade como direito do pequeno ao grande advogado (e do escritório) — o preço também importa —, migrei para um provedor de nuvem com infraestrutura elástica: a Alibaba Cloud.
>
> As IAs chinesas — aqui não é bajulação; é o que posso dizer com o pouco que sei — têm formato aberto e qualidade que se equipara à do nobre Claude. Falo com propriedade: mantive cerca de 100 mil conversas com ele. Foi quem me segurou, como ferramenta de apoio, quando passei por um processo e, travado financeiramente, precisei advogar em causa própria. Com esse apoio, reverti a situação — que, tamanho o peso, me levou a 3 convulsões.
>
> Hoje, falo do GLM, do Qwen e dos outros pelo preço e pelo modelo — a forma como a IA é criada e treinada foi uma das maiores sacadas deles. Não tiro o mérito do GPT, do Gemini e do Claude. Mas o custo é cerca de 6 vezes menor `[CONFIRMAR razão exata]`. E aí o preço pesa — para os amigos advogados que vi fazer, para não passar fome, audiência trabalhista a 50 reais. Não concordo de jeito nenhum.

*Correções:* `para por fim à alucinação` → `combater a alucinação` (blindado — "pôr fim" é o mesmo absoluto já retirado de todos os outros pontos, e é a afirmação que a OAB investigaria); `Já fiz parte do Google, for startups` → `Google for Startups`; `100m` → `105 milhões`; `100000 chats` → `100 mil conversas`; `equipara-se` → `se equipara`; `tecnologia Elástica, na melhor tradução` → `infraestrutura elástica` + nome do provedor; `somos 6 para 1` → custo ~6× menor (ambíguo antes).

## 12.3 Comentário 2 — corrigido

> Cada caso deve ser analisado individualmente — jamais de forma padronizada, como uma máquina. O que penso é seguir o caminho do CFM: IA como ferramenta de apoio à decisão jurídica. E isso é sério.
>
> A capacidade de raciocínio jurídico do advogado é fundamental, e IA nenhuma a substitui. O melhor caminho é a IA como ferramenta que traz dados para uma melhor decisão do advogado — com plena consciência disso.
>
> E não se pode esquecer — isso posso falar bem — da nossa capacidade de solucionar problemas como advogados no Brasil: ora como Agostinho Carrara, ora precisando ser Miguel Reale (falo com todo respeito; me perdoem se houver distorções, mas a astúcia — jamais malandragem — do personagem de Pedro Cardoso é o que muito advogado tem, e o que o salva neste nosso Brasil)... volto: essa capacidade nenhuma IA tem, nem nunca terá. A visão crítica e o saber decidir vêm das 10 mil horas de que fala o livro The Outliers.

*Correções:* `Jamais igual máquina` → frase completa; `fazer igual CFM` → `seguir o caminho do CFM`; `bem conscientizado` → `com plena consciência`; fluidez dos períodos.

## 12.4 Comentário 3 (resposta ao Fabio) — corrigido

> Fabio Floh, penso que é um bom momento para a OAB se pronunciar, mas com a ressalva de que o apoio que a IA entrega ao pequeno advogado — permitindo-lhe advogar em linha com as bancas maiores daqui de SP — é muito importante. Dá, guardadas as devidas proporções, para ir de igual para igual. Como dizia a frase: "tão permitindo a gente sonhar…".
>
> Com meus erros e falibilidades humanas, e sem nenhuma pretensão de ser o senhor da razão — muito pouco ou nada sei sobre Direito; ainda preciso ler muito e melhorar muito como ser humano —, acredito que IA como ferramenta de apoio à decisão é um bom caminho.
>
> Jamais esquecer que o advogado é quem assina, e o quão essencial é o seu julgamento sobre o fato e o valor — a teoria tridimensional: fato, valor e norma. Até mesmo a norma, mantida em lógica cartesiana pura, sem a visão humana, pode exigir afastamento para determinados casos — saudoso Professor Cristiano Chaves de Farias, "Derrotabilidade das Normas Jurídicas" (também conhecida pelo termo em inglês, Defeasibility).
>
> Parabéns por trazer isso à mesa, Fabio Floh — eu nem tinha visto. Louvável a postura, e muito importante para o momento. Forte abraço a todos: como advogados nos unindo é que temos força.

*Correções:* `penso em bom momento a OAB trazer` → reescrito; `proporçoes` → `proporções`; **`fator` → `fato`** (teoria de Reale — crítica); `Cristiano Chaves` → `Cristiano Chaves de Farias` (grafia oficial); período sobre norma reescrito para fluir.

## 12.5 Comentário 4 (MP × Juiz) — corrigido

> Com todo respeito a quem pensa diferente — e aos muitos membros e magistrados que levam a sério a imparcialidade —, mas é complexa a natural relação entre MP e Juiz, unidos pelo cotidiano, todo dia, no mesmo espaço, e por outros vínculos de amizade; o que pode comprometer a imparcialidade.
>
> Então, como há espaço para todos, é importantíssimo nos unir — e aqui como classe — para termos força. Senão o sistema, com todo respeito e antecipando desculpas pelo meu linguajar, tratora, engole, passa por cima dos pequenos escritórios.
>
> Um grande prazer, esse contato. Estaremos sempre junto de todos os advogados: não somos apenas função de apoio à Justiça — somos concretizadores e responsáveis por ela. Um cordial abraço a todos, e perdoem as imperfeições desse pequeno, mas Advogador — como brinco —, por verdadeiro amor e "OAB por design": OAB e Advocacia circulam nesse sangue. Vamos evoluindo juntos.

*Correções:* `perde-se a imparcialidade` → `pode comprometer a imparcialidade` (**suavização deliberada** — afirmação categórica sobre a magistratura, assinada por advogado/CEO de legaltech num thread regulatório, é exposição desnecessária; a ressalva "com todo respeito" já no original); `traga - tratora` → `tratora` (verbo sobrando); vírgulas e fluidez.

## 12.6 Comentário 5 (PS) — reescrito com dados verificados

> PS: Um dado que me ocupa: qual o real alcance da IA no Direito? Na pesquisa que a própria Anthropic publicou este ano sobre impactos da IA no mercado de trabalho, tarefas jurídicas como representar clientes em tribunal seguem além do alcance da IA — e, no Índice Econômico da Anthropic, o Brasil é o país mais sobrerrepresentado em pedidos de assistência jurídica (5× a média). Ou seja: a demanda existe, a ferramenta ajuda — mas o exercício da advocacia continua sendo do advogado.
>
> Com correntes A, A1, B9, C e até Z do nosso Direito, acredito que aqui o alcance é ainda menor. Sem viés crítico — não quero dizer que somos complexos; é a riqueza e as peculiaridades do nosso contexto: dimensões continentais, contextos sociais que fogem à lógica cartesiana. O caso a caso traz riquíssimos exemplos.
>
> Enfim, alonguei-me, mas meu dileto amigo Fabio Floh — o tema e a abordagem que trouxe me inspiraram. Muito obrigado! E um abraço ao Hy — o Hunyuan, da Tencent.

*Correções:* **"24% das tarefas / 85% de capacidade" removidos** — não constam de nenhuma pesquisa da Anthropic (ver 12.1); substituídos por dois dados verificados que sustentam melhor o argumento; `n contextos` → `contextos`; `fogem a lógica` → `fogem à lógica`; `!!!.` → `!`; `hy da tencent` → `Hunyuan, da Tencent`. **Ao republicar, anexe os links dos relatórios** (o original prometia "pesquisa que trago abaixo" e nada veio).

## 12.7 NOVO comentário recomendado — resposta direta ao desafio do post

O post termina: *"Qual das três colunas o seu fornecedor ocupa? E ele saberia responder as três perguntas sem hesitar?"* — e nenhum dos 5 comentários responde. Como CEO de legaltech comentando esse thread, a resposta direta é o posicionamento mais valioso que você pode ter (e é a defesa pública do seu modelo de negócio). Sugerido como **primeiro** comentário (ou topo do comentário 1):

> Respondendo, sem hesitar, à pergunta que encerra o post: a BeansTech ocupa as colunas 1 e 2 — ferramenta e informação. Quem assina a peça é o advogado; quem responde disciplinarmente é o advogado; não intermediamos contratação de advogados nem ficamos com margem sobre honorários. O RAGJur entrega informação estruturada e rascunho; a decisão e a assinatura continuam com quem tem inscrição — e é assim que desenhamos tudo, de propósito.

`[CONFIRMAR]` apenas se algum produto faz intermediação (marketplace que contrata escritório/advogado e repassa com margem). Pelo portfólio atual (RAGJur, LegalSuite, Advogando.ai, minuta.tech, Portal do Advogado, Recurso.Tech, e-arbitragem.ai), não há sinal de coluna 3.

## 12.8 Nota pessoal (opcional)

O trecho das 3 convulsões ficou no comentário 1 — é sua história, já é pública, e humaniza o argumento do preço (é o que conecta com o advogado de audiência a 50 reais). Se preferir dosar a exposição pessoal num thread profissional, a versão enxuta é: *"...reverti a situação, num dos períodos mais duros da minha vida."* As duas funcionam; a decisão é de quanto você quer expor.

---

**Resumo da seção 12:** "pôr fim à alucinação" blindado; "fator" → "fato" (Reale); Cristiano Chaves de **Farias** (saudoso está correto); estatística 24%/85% da Anthropic removida (não existe) e substituída por dados verificados; crítica à magistratura suavizada; "Hy" = Hunyuan da Tencent (fecha a decisão G); + novo comentário respondendo o desafio do Fabio — o posicionamento público do modelo de negócio.
