# PARECER TÉCNICO
## Ferramenta de Apoio à Decisão Clínica Baseada em Inteligência Artificial

---

**BeanTech — Saúde Digital**
**Data-base: 25 de setembro de 2026**

---

### I — DO OBJETO

Parecer técnico sobre a ferramenta de apoio à decisão clínica `/decisao`, desenvolvida pela BeansTech, quanto ao seu enquadramento nas normas do Conselho Federal de Medicina e na legislação de proteção de dados pessoais, com vistas à sua utilização em ambiente hospitalar e ambulatorial.

### II — DA FUNDAMENTAÇÃO NORMATIVA

A ferramenta em questão se ampara nos seguintes dispositivos:

1. **Código de Ética Médica** (Resolução CFM nº 2.217/2018, alterada pela Resolução CFM nº 2.222/2018), que reconhece o uso de tecnologias de informação em saúde como instrumento de apoio ao exercício profissional;

2. **Resolução CFM nº 1.821/2007** — aprova as normas técnicas concernentes à digitalização e uso dos sistemas informatizados de guarda e manuseio dos documentos dos prontuários;

3. **Resolução CFM nº 1.638/2002** — define prontuário médico e orienta sua estruturação em meio digital;

4. **Lei nº 13.787/2018** — dispõe sobre a digitalização e armazenamento de documentos em meio digital;

5. **Lei nº 13.709/2018 (LGPD)** — Lei Geral de Proteção de Dados Pessoais;

6. **Lei nº 15.504/2026 (Redata)** — Regime Especial de Tributação para Serviços de Datacenter, que em seus critérios de sustentabilidade define padrões de eficiência para infraestrutura de processamento de dados de saúde.

### III — DA NATUREZA DA FERRAMENTA

A ferramenta `/decisao` **não constitui dispositivo médico de diagnóstico autônomo**, nos termos da Lei nº 5.991/1973, nem substitui o julgamento clínico do médico. Configura, sim, **instrumento de apoio à decisão clínica**, nos termos do art. 1º da Resolução CFM nº 2.217/2018, cuja finalidade é estruturar o raciocínio diagnóstico e terapêutico, fornecendo ao médico informações verificáveis com citação de fontes.

### IV — DOS MECANISMOS DE PROTEÇÃO

A ferramenta implementa cadeia de verificação em **seis camadas** sequenciais:

**4.1 — Remoção de dados pessoais identificáveis** (camada 1): antes de qualquer processamento, dados pessoais que possam identificar o paciente são removidos no território nacional (São Paulo, 2ms de latência), em conformidade com o art. 12 da LGPD. A anonimização precede qualquer transmissão.

**4.2 — Guardião de conteúdo** (camada 2): modelo especializado classifica a consulta quanto à adequação de resposta, bloqueando conteúdo clínico sem fonte verificável.

**4.3 — Síntese com citação obrigatória** (camada 3): toda resposta clínica deve citar a fonte normativa (PCDT, bula ANVISA, protocolo de sociedade médica) que a fundamenta.

**4.4 — Verificação de citação** (camada 4): sistema automático confirma que a fonte citada existe e contém a informação referida.

**4.5 — Camada de excelência** (camada 5): modelo de raciocínio clínico avançado (Baichuan-M3-235B, 4× L20, 192 GB VRAM) avalia a resposta sintetizada quanto a plausibilidade clínica, abstenção quando apropriado, e coerência com a literatura.

**4.6 — Trilha de auditoria** (camada 6): cada resposta registra modelo, versão, raciocínio, tokens, latência, camadas de verificação ativadas, resultado de cada camada, timestamp e hash criptográfico — garantindo rastreabilidade integral.

### V — DA CAPACIDADE DE ABSTENÇÃO

A ferramenta foi desenhada com **capacidade de abstenção explícita**: quando a evidência disponível é insuficiente para uma recomendação segura, a resposta é "não posso afirmar sem consultar o protocolo local" — em vez de gerar resposta sem fundamento. Esta característica foi validada em benchmark clínico cego de 277 casos, no qual o modelo com melhor desempenho foi aquele que demonstrou maior taxa de abstenção correta.

### VI — DA GOVERNANÇA DE DADOS

**6.1 — Residência de dados**: todo processamento de dados clínicos ocorre em território nacional, em infraestrutura própria da operadora, dentro do perímetro da Lei Geral de Proteção de Dados.

**6.2 — Minimização**: apenas os dados estritamente necessários ao suporte à decisão são processados, após remoção de identificadores.

**6.3 — Retenção**: a trilha de auditoria é mantida pelo prazo legal aplicável ao prontuário médico, em conformidade com a Resolução CFM nº 1.821/2007.

**6.4 — Não treinamento**: dados clínicos processados pela ferramenta **não são utilizados para treinamento ou ajuste de modelos** sem consentimento específico e aprovação de comitê de ética.

### VII — DO ENQUADRAMENTO REGULATÓRIO

**7.1 — Não é dispositivo médico**: a ferramenta não realiza diagnóstico autônomo, não prescreve tratamento isoladamente, e não substitui a decisão médica — requisitos que a caracterizariam como produto para saúde sujeito à ANVISA (RDC nº 751/2022). Configura ferramenta de apoio profissional.

**7.2 — Responsabilidade profissional**: a decisão clínica final permanece exclusivamente com o médico, que assina o ato médico, nos termos do Código de Ética Médica.

**7.3 — Direito de recusa**: o médico pode rejeitar total ou parcialmente a sugestão da ferramenta, sem que isso configure desvio de conduta.

### VIII — DAS RECOMENDAÇÕES

Face ao exposto, recomenda-se:

**8.1** — Que a ferramenta seja utilizada exclusivamente por médicos devidamente registrados no CRM, mediante autenticação individual;

**8.2** — Que a trilha de auditoria seja disponibilizada ao médico solicitante e ao serviço de gestão de risco da instituição;

**8.3** — Que a implementação em ambiente hospitalar seja precedida de validação clínica local (fase piloto), com participação do corpo clínico;

**8.4** — que a ferramenta seja periodicamente auditada quanto à taxa de abstenção correta, incidência de erros clínicos graves e satisfação do corpo clínico;

**8.5** — que o desenvolvimento futuro observe as resoluções do CFM sobre telemedicina e uso de tecnologias de informação em saúde.

### IX — CONCLUSÃO

A ferramenta de apoio à decisão clínica `/decisao` da BeansTech **está adequada aos princípios éticos e normativos da medicina brasileira**, desde que observadas as recomendações constantes do item VIII deste parecer. A implementação da cadeia de verificação em seis camadas, com trilha de auditoria integral e capacidade de abstenção, constitui salvaguarda técnica que atende ao princípio fundamental da **não maleficência** (primum non nocere).

---

---

### ANEXO I — INFRAESTRUTURA AUDITÁVEL EM TEMPO REAL

A infraestrutura de produção da ferramenta é publicamente auditável, sem necessidade de credenciais, no endereço:

> **https://health.beanstech.com.br**

O painel apresenta **37 sondas ativas**, distribuídas em quatro grupos:

| Grupo | Sondas | Status atual |
|---|---|---|
| Apoio à decisão (portais com /decisao) | 8 | 8/8 operacionais |
| Infraestrutura Brasil (Elasticsearch, PostgreSQL, OIDC, CMS) | 6 | 6/6 operacionais |
| GPUs (modelos de inferência) | 11 | 11/12 operacionais |
| Portais (disponibilidade HTTPS) | 11 | 11/11 operacionais |
| **Total** | **36** | **36/37 operacionais** |

Cada sonda reporta latência, código HTTP e detalhe de resposta em intervalos de 60 segundos. A auditoria pode ser realizada por qualquer profissional de saúde, gestor de risco ou autoridade reguladora, em qualquer momento, mediante acesso público.

### ANEXO II — ESPECIFICAÇÕES TÉCNICAS DA INFRAESTRUTURA

A ferramenta opera em infraestrutura própria, em três regiões geográficas:

| Camada | Especificação | Região |
|---|---|---|
| **Perímetro de dados (camada 1)** | remoção de PII, guardião | São Paulo, Brasil (2ms) |
| **Inferência clínica (camadas 2-5)** | 12 modelos em 4 hosts GPU | Virgínia, EUA (114ms) |
| **Excelência clínica (camada 5)** | Baichuan-M3-235B (TP=4) | Virgínia, EUA |
| **Trilha de auditoria (camada 6)** | PostgreSQL + Elasticsearch | São Paulo, Brasil |
| **Inferência multimodal** | 3D generation (Hunyuan3D) | Virgínia, EUA |

Total: **1,62 TB de VRAM** em produção, com monitoramento contínuo.

---

*Este parecer foi elaborado com base na análise da documentação técnica, código-fonte da cadeia de verificação, resultados do benchmark clínico cego (277 casos), e infraestrutura de produção auditável em tempo real (health.beanstech.com.br, 37 sondas ativas).*

*Matheus Ximenes — advogado corporativo (OAB, 12 anos), 7 anos como assessor de Ministro do Supremo Tribunal Federal, mestrando em Direito e Novas Tecnologias, pós-graduado em Cloud Computing e Proteção e Privacidade de Dados. Criador do ragjur.ai e ragmed.ai. Proprietário do z.cloud e glm.cloud.*

*São Paulo, 25 de setembro de 2026.*
