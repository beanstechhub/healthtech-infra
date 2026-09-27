# Estudo de Parceria — Z.ai (z.cloud) × Tencent (hy.cloud) × BeansTech
### Datacenter soberano em ZPE + Redata (Lei 15.504): cenários, números reais e proposta
**Data-base: 24/09/2026 · Autor: Matheus Ximenes — advogado corporativo (12 anos, 7 como assessor de Ministro do STF), mestrando em Direito e Novas Tecnologias, pós-graduado em Cloud Computing e Proteção de Dados, fundador da BeansTech**

---

## 1. Sumário executivo — a tese em linguagem de conselho

A BeansTech opera hoje, de forma verificável, a infraestrutura de IA mais completa do mercado brasileiro de setores regulados: **12 modelos soberanos** (GLM-5.3 vencedor de benchmark clínico cego com 277 casos; Baichuan-M3-235B; AntAngelMed; família Granite/Lingshu/MedGemma; Hy4-preview da Tencent em implantação), 8 portais médicos no ar, cadeia anti-alucinação de 6 camadas com trilha de auditoria, e frota própria em 3 regiões (Brasil, Virgínia, Shenzhen). Tudo isso custa hoje **~US$ 100 mil/mês** — dentro de um crédito de US$ 81,9 mil restante, com runway de ~25 dias no modo mais agressivo.

**O que propomos às duas empresas não é um pedido de financiamento: é uma divisão de trabalho que nenhuma delas consegue fazer sozinha no Brasil.**

| O que cada lado tem | Z.ai / Tencent | BeansTech |
|---|---|---|
| Modelo de fronteira (750B) e a família Hunyuan | ✅ | — |
| Capacidade de investir US$ 300-350M | ✅ | — |
| Operação jurídica, regulatória e comercial no solo brasileiro | — | ✅ (advogado, mestrando em novas tecnologias, 12 anos) |
| Perímetro LGPD auditável com "provar o que se responde" | — | ✅ (rodando, 31 sondas públicas) |
| Setores regulados como mercado natural (saúde, jurídico, financeiro) | — | ✅ (8 portais em produção, benchmark médico) |
| Endereço energético e fiscal (ZPE + Redata + solar) | — | ✅ (comparativo com 3 sítios, dados 2026) |

A régua de honestidade deste estudo: **os cenários de datacenter têm VPL negativo no caso de referência (−R$ 100,1 M na V1) e só se tornam positivos com clientes âncora contratados.** Nenhum número abaixo presume benefício não aprovado, terreno não escriturado ou demanda não contratada. É o oposto do pitch padrão — e é exatamente por isso que deve ser lido.

---

## 2. Redata (Lei 15.504/2026) — o que a lei diz de verdade

Sancionada em 15/09/2026; em vigor na publicação. Altera a Lei 11.196/2005 para criar o Regime Especial de Tributação para serviços de datacenter — **incluindo explicitamente "treinamento e inferência de modelos de inteligência artificial"** (a lei foi escrita para este caso de uso).

**Benefícios (suspensão que converge em alíquota zero):** PIS/Pasep, Cofins (inclusive importação), IPI e II sobre componentes e produtos de TIC destinados ao ativo imobilizado de empresa habilitada. II suspenso apenas para componentes **sem produção nacional equivalente**; IPI não se aplica a produtos da Zona Franca de Manaus.

**Contrapartidas cumulativas (habilitação):**
1. **10% da capacidade** instalada com o benefício oferecida ao mercado interno (substituível por investimento adicional de 10%);
2. critérios de sustentabilidade (a regulamentar);
3. **100% da energia elétrica via contratos ou autoprodução renovável/baixa emissão**;
4. **WUE ≤ 0,05 L/kWh** com verificação anual;
5. **2% do valor dos produtos adquiridos** em P&D com ICTs/universidades brasileiras;
6. relatório anual de sustentabilidade com auditoria independente para as cessões.

**Regional (§7):** para instalações no Norte/Nordeste/Centro-Oeste, as contrapartidas 1 e 5 caem **20%** (capacidade efetiva: 8%; P&D efetivo: 1,6%) e **≥40% dos recursos de P&D** devem ficar na região.

**As três pegadas que o entusiasmo costuma engolir** (e que este estudo incorpora):

- **Janela PIS/Cofins: efeitos apenas até 31/12/2026** (EC 132/2023 e LC 214/2025 — transição para CBS/IBS). O benefício relevante de longo prazo é IPI+II. Quem computar economia de PIS/Cofins para 2027 está superestimando o regime.
- **WUE ≤ 0,05 L/kWh** é seletivo: praticamente exige cooling a líquido em circuito fechado ou free cooling sem evaporação. O premissas do nosso CAPEX (liquid cooling, 100-130 kW/rack) atende por desenho; o litoral de Parnaíba (noites secas) e o vento de Caucaia ajudam. **É um filtro que elimina concorrentes desatentos — e nos favorece.**
- **Energia 100% renovável contratada** vira a solar de Parnaíba (1,2 MW/ha, melhor irradiação do comparativo) e o projeto de Santa Terezinha (PB) de custo para **requisito de lei** — o que muda o valor econômico da independência solar: de narrativa ESG para condição de habilitação.

**Interação com a ZPE:** o Redata **não exige exportação** (a ZPE de serviços exige projeto exportador sem receita doméstica — art. 21-C da Lei 11.508/2007). São regimes complementares: Redata para o capex do mercado interno; ZPE para a receita de exportação (≥ 80%). O desenho z.cloud/hy.cloud — vender inferência para dentro e para fora — usa os dois, em sociedades separadas, com substância operacional própria em cada uma (a advertência do estudo de investimento segue de pé: **não criar SPE estrangeira para refaturar consumo brasileiro como exportação**).

**Pendente de regulamentação:** condições de habilitação, lista de produtos, fator multiplicador, critérios de sustentabilidade, fundo de P&D. A habilitação é pela Receita Federal. Penalidades: devolução com multa e juros; suspensão de 180 dias e impedimento de 2 anos.

---

## 3. Cenários de datacenter — sequência realista, não a dos brochures

O estudo interno de investimento (10 anos, 15% a.a.) é a régua: **V1 de R$ 150 M tem VPL de −R$ 100,1 M no cenário de referência e +R$ 9,0 M no favorável**; a trajetória até a V2 (R$ 300 M acumulados) vai de −R$ 117,6 M a +R$ 71,3 M. Tradução executiva: **o projeto só existe com clientes âncora e parceiro de capex. Sem Z.ai ou Tencent, a resposta honesta é colocation e não construir.** A ordem abaixo reflete isso.

### Cenário 1 — HOJE (operacional, verificável): frota híbrida
- 12 modelos soberanos (3 hosts GPU próprios + Brasil CPU) + GLM-5.3 e DeepSeek-V4-Flash via API
- Custo: **~US$ 100 mil/mês** (modo agressivo com o Hy4 em Shenzhen; otimizável a ~US$ 74 mil/mês)
- Latência medida: SP→Virgínia 114-355 ms; SP→Europa ~560 ms
- Papel: valida o produto, a cadeia anti-alucinação e o benchmark — **é o ativo demonstrável que os parceiros não têm: prova de produção em mercado regulado**

### Cenário 2 — 2027: o primeiro nó soberano em colocation (Caucaia/Fortaleza)
- 1 servidor **HGX H200 (8× 141 GB, NVLink)**: roda GLM-5.3-750B FP8 com a receita oficial vLLM (TP=8) + Hy4
- **US$ ~210 mil via ZPE** (economia tributária de ~US$ 215 mil) · OPEX **US$ 5-8 mil/mês** em colo
- Latência: **11 ms de São Paulo, 68 ms da Europa, 85 ms da costa EUA, 30 ms da LATAM-Norte** — hoje SP→Europa é 560 ms: uma melhoria de **8×** que nenhum hyperscaler entrega ao mercado brasileiro hoje
- Break-even vs. API: poucas centenas de milhões de tokens/mês — atingível com 2-3 hospitais-âncora
- **O pedido a Z.ai/Tencent aqui: co-investimento de showcase (US$ 250-500 mil) — não os R$ 150 M**

### Cenário 3 — 2028-2030: campus próprio em Parnaíba (PI) com a ZPE como braço de exportação
- 10 MW de TI (~80 nós, 90 TB VRAM — a frota inteira + réplicas + treinamento)
- CAPEX: civil ~US$ 100 M (US$ 10/W) + GPUs ~US$ 32,5 M + solar/BESS ~US$ 13-16 M + backhaul ~US$ 3-5 M ≈ **US$ 150-155 M**, com **~US$ 50-80 M de economia ZPE/Redata** (com as ressalvas do §2 — IPI/II, não PIS/Cofins pós-2026)
- Energia: R$ 250-350/MWh, região de excedente, energização 12-24 meses — **a melhor ZPE-energia do país** (planilha própria, 2026)
- Caucaia permanece como gateway (cabos) e Ilhéus como reserva de terra (opção a R$ 30-120/m²)
- **O pedido aqui: o investidor do capex — e é a proposta de joint venture de US$ 350 M da Tencent**

### A régua de decisão entre os cenários
Pesos propostos (do estudo interno): energia 25%, margem/custo total 25%, latência 20%, segurança 15%, prazo 10%, incentivos confirmados 5%. Incapacidade contratual elimina alternativa sem pontuação. **Nenhum cenário presume terreno não escriturado ou benefício não aprovado.**

---

## 4. A proposta à Z.ai — o modelo guardião

### O produto que a Z.ai não consegue vender sozinha no Brasil

O GLM-5.3 é o melhor modelo que testamos (o único que detectou a dose excessiva de rivaroxabana com clearance 28 e citou a fonte regulatória; o único que disse "não posso afirmar sem consultar o protocolo local"). Mas vendê-lo a um hospital brasileiro, a um banco sob resoluções do BACEN, ou a um tribunal exige três coisas que **não são features do modelo — são infraestrutura institucional**:

1. **Perímetro LGPD por design**: o dado clínico não pode cruzar a fronteira sem base legal. O modelo tem que rodar **dentro do datacenter do hospital, do banco, do tribunal** — implantação integral on-premise, não API externa.
2. **Trilha de auditoria que resista a um processo**: cada resposta com modelo, versão, raciocínio, tokens, camadas de verificação e PII removido — o que a nossa cadeia de 6 camadas já produz.
3. **Um interlocutor juridicamente responsável do lado de cá**: quem assina o contrato sob a legislação brasileira, responde tecnicamente ao DPO do cliente, e traduz LGPD/CFM/BACEN em arquitetura.

Isso é o **modelo guardião** — e é o papel da BeansTech: *guardião por educação e respeito* (a régua de "provar o que se responde" aplicada ao modelo da Z.ai, para o setor onde errar muda vidas). A Z.ai fornece a excelência do modelo; a BeansTech fornece a custódia que o mercado regulado exige. **Nenhum hyperscaler internacional monta isso no Brasil a custo racional — o custo jurídico-institucional é o fosso.**

### O que a Z.ai ganha (concreto, sem adjetivos)

1. **Beachhead regulado em LATAM com capex próximo de zero**: o primeiro nó (Cenário 2) a US$ 210-500 mil valida o GLM-5.3 no mercado de IA mais protegido do hemisfério — 220 milhões de pessoas, LGPD como régua, zero concorrente com trilha de auditoria clínica
2. **O caso de uso que falta ao portfólio**: implantação integral em datacenter de hospital/banco — referência replicável em qualquer jurisdição de dados rígidos (UE, Índia, Oriente Médio). A prova brasileira é o marketing global
3. **Receita recorrente de licença + serviços**: o modelo rodando em N datacenters de clientes regulados, com a BeansTech como operadora de custódia — divisão de receita em licença de pesos, suporte de engenharia e co-marketing
4. **A ponte institucional**: advogado corporativo com 12 anos de Judiciário (7 em gabinete de Ministro do STF), mestrando em direito e novas tecnologias — o perfil que abre a porta de compliance de banco e hospital, que engenheiro de vendas não abre
5. **O US$ 300 M como valor de negócio conjunto** (como proposto no e-mail à liderança): a parcela de infraestrutura do calculado em cima do mercado regulado endereçável de US$ 8,2 bi/ano (saúde R$ 4,4 bi + jurídico R$ 80 bi + PLD/FT 740 instituições) — não um orçamento operacional

### O que pedimos (escalonado e modesto no começo)

| Fase | Pedido | Contrapartida BeansTech |
|---|---|---|
| 1 (now) | Suporte de engenharia (deploy on-prem do GLM-5.3 em piloto hospitalar) + licença de pesos para implantação regulada | nó showcase co-financiado, operação, dados de benchmark publicáveis, o canal jurídico-regulatório |
| 2 (2027) | co-investimento no nó Caucaia (US$ 250-500 mil) | receita compartilhada de licenças on-prem nos setores regulados |
| 3 (2028+) | participação no campus Parnaíba como âncora tecnológica | o z.cloud como a camada de excelência da nuvem soberana, com receita de exportação para LATAM/Europa pela ZPE |

**O que NÃO pedimos**: que a Z.ai pague os R$ 150 M do campus antes de existir cliente âncora — o nosso próprio estudo diz que isso destrói valor. A sequência é: piloto → nó → campus.

---

## 5. A proposta à Tencent — explodir o hy.cloud

A tese da Tencent é mais simples e mais agressiva — porque a Tencent já tem o precedente **na nossa vizinhança**: a ByteDance/Omnia opera no Setor II da ZPE Ceará, em Caucaia, com a Casa dos Ventos. O caminho regulatório-institucional para uma chinesa de tecnologia no Ceará **já está aberto por outra chinesa de tecnologia** — e a BeansTech oferece o que falta ao precedente: a demanda regulada contratável (hospitais, bancos, tribunais) e o operador jurídico local.

1. **hy.cloud em produção já**: o Hy4-preview (flagship 780B) está em implantação na nossa frota de Shenzhen neste momento — a prova de conceito viva para a reunião: *"o seu flagship roda na nossa infraestrutura, a 30 km do seu vizinho TikTok"*
2. **A família inteira tem papel arquitetado**: Hy-MT2 (tradução — ouro para o ragmed.ai trilíngue PT/EN/ES), WeMM (embeddings multimodais), Hunyuan3D (PropTech), HunyuanOCR (matrículas, prontuários) — já mapeados no nosso catálogo
3. **O pedido é o capex do Cenário 3** — a joint venture de US$ 350 M para o campus de Parnaíba: a Tencent como maior investidor, com a energia mais barata do país, solar obrigatória por lei (Redata), 20% de desconto regional nas contrapartidas, e a receita de exportação (≥ 80%) escoando pela ZPE com os cabos de Caucaia a 68 ms da Europa
4. **A dimensão que só este projeto tem**: guardião + guardado — o GLM-5.3 (z.ai) como excelência e a família Hunyuan (Tencent) como o volume multimodal, **no mesmo campus solar brasileiro**. Duas das maiores empresas de IA do mundo servindo o mercado regulado brasileiro de um datacenter que prova o que responde

---

## 6. Números reais (auditoráveis na hora da reunião)

| Métrica | Valor | Fonte |
|---|---|---|
| Modelos soberanos em produção | 12 (+2 via API) | health.beanstech.com.br, 31 sondas |
| Benchmark clínico cego | 277 casos, GLM-5.3 vencedor | suite própria, revisão cega |
| Portais em produção | 8 médicos + jurídicos | dodr.ai, prontuario.tech, exame.tech… |
| Frota hoje | 3 hosts GPU + Brasil, ~US$ 100 mil/mês | faturamento Alibaba (crédito: US$ 81,9 mil) |
| Nó HGX H200 via ZPE | ~US$ 210 mil (economia ~US$ 215 mil) | planilha ZPE + alíquotas reais |
| Campus 10 MW Parnaíba | ~US$ 150-155 M; VPL −R$100 M (ref.) / +R$ 9 M (fav.) na V1 sem parceria | estudo interno 15% a.a. |
| Latências ZPE Caucaia | SP 11 ms · Europa 68 ms · EUA 85 ms · LATAM-N 30 ms | planilha (RTT óptico, a medir) |
| Redata | IPI+II 5 anos; PIS/Cofins até 31/12/2026; WUE ≤ 0,05; energia 100% renovável; NE −20% | Lei 15.504/2026, texto consultado |
| Mercado endereçável regulado | US$ 8,2 bi/ano (saúde + jurídico + PLD/FT) | sizing do plano mestre |

## 7. Riscos — dito como advogado, não como vendedor

1. **Demanda**: o VPL negativo de referência é o risco real. Sem clientes âncora assinados antes do Cenário 3, o campus não se justifica — e este documento não o esconde
2. **Redata incompleto**: sustentabilidade, lista de produtos e fundo de P&D não regulamentados; PIS/Cofins expiram em 31/12/2026. Quem prometer mais que IPI/II está vendendo ilusão
3. **ZPE de serviços**: o art. 21-C exige projeto exportador sem receita doméstica — a segregação SPE/operadora precisa de substância real, não contábil
4. **Runway próprio**: 25 dias de crédito no modo agressivo — o lançamento comercial tem que converter dentro da janela, e o primeiro corte de despesa (liberar o 8x de Virgínia, −US$ 1.289/dia) já está identificado
5. **Terrenos e energia**: nenhum sítio tem escritura ou carta de disponibilidade assinada — as 3 LOIs são o próximo passo físico
6. **Concorrência**: hyperscalers podem copiar o desenho; **não copiam o custo jurídico-institucional cumulativo** (12 anos de Judiciário + cadeia anti-alucinação em produção + LGPD por design) — mas podem tentar

---

## 8. A frase que resume para cada conselho

**Para a Z.ai:** *"O seu melhor modelo, no datacenter do hospital, com a custódia jurídica que o mercado brasileiro exige, provando cada resposta — e o primeiro nó custa menos que um anúncio emowntown."*
**Para a Tencent:** *"O seu flagship já roda na nossa frota, a 30 km do TikTok, no estado com a energia mais barata do país — e a lei que acaba de ser sancionada obriga solar, que nós temos."*

---

*Estudo elaborado sobre: Lei 15.504/2026 (texto oficial), ZPE-DATACENTER-COMPARATIVO.xlsx (dados 2026), estudo-datacenter-beanstech/ (VPL e pareceres), dados operacionais medidos da frota (24/09/2026). Valores de mercado a validar com CZPE, ANEEL, operadoras e OEMs. Documento de trabalho para negociação — não é oferta vinculante.*
