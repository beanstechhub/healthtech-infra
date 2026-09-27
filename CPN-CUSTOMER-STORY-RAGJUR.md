# Customer Story — para submissão no Anthropic Partner Hub
### Formato CPN: problema → solução → resultado medido

---

**Título:** ragjur.ai — 100 million Brazilian court decisions, searchable and auditable, built ~90% with Claude

**Firma:** BeansTech (beanstech.com.br) · Partner Delivery Lead: Matheus Ximenes (matheus@beanstech.com.br)
**Contato histórico:** beanstechbrasil@gmail.com (conta usada antes do ingresso no Claude Partner Network — certificações e atividade da Academy a consolidar na conta da firma)

---

**O cliente / o problema**

O Judiciário brasileiro produz dezenas de milhões de decisões por ano, e o acesso a esse acervo é lento, caro e opaco: busca por palavras-chave em portais governamentais, leitura manual, sem trilha de auditoria. Para 1,2 milhão de advogados e para os setores regulados que dependem de precedente (bancos, tribunais, agências), não existia — no Brasil ou na América Latina — um sistema de busca semântica sobre o acervo inteiro que **citasse a decisão-fonte de cada afirmação** e mantivesse o dado sob perímetro nacional (LGPD).

**A solução**

A BeansTech construiu o **ragjur.ai**: o maior corpus jurídico da América Latina — **100 milhões de decisões indexadas em Elasticsearch self-hosted** no VPC próprio da empresa (busca soberana em escala nacional), com pipeline de ingestão, camada de verificação de citações e trilha de auditoria completa (modelo, versão, raciocínio, tokens, fontes). O stack de engenharia foi **construído ~90% com Claude**: pipelines de ingestão, topologia de indexação, camada de verificação e os portais foram majoritariamente escritos em sessões de Claude Code ao longo do projeto. A mesma base alimenta 17+ domínios legaltech em produção e os oito portais médicos da empresa, com a cadeia anti-alucinação de 6 camadas (remoção de PII → guardião → síntese → verificação de citação → excelência → auditoria).

**Resultados medidos (auditáveis em tempo real)**

- **100 milhões de decisões** indexadas e auditáveis no Elasticsearch self-hosted
- **100.000+ chats comprovados** e **400+ sessões de usuário** através dos portais em produção
- **8 portais médicos + 17 domínios legaltech** no ar
- **31 sondas públicas de monitoramento** — health.beanstech.com.br
- Validação técnica em benchmarking cego com protocolo de revisão independente — detalhes reservados aos parceiros, nos termos da própria revisão
- Cadeia de verificação em produção: cada resposta rastreável até a decisão-fonte

**O que torna esta story uma joint story**

O produto central da firma foi construído com Claude como co-construtor principal — não é um caso de "usamos a API num recurso", é o stack inteiro: do pipeline de dados à camada de verificação. O deploy é local, soberano e auditável — o perfil exato de workload regulado que o programa de parceiros existe para reconhecer.

---

*Submeter em: Partner Hub → Customer Stories. Materiais de apoio: ONE-PAGER-BEANSTECH.md · health.beanstech.com.br (monitoramento ao vivo)*
