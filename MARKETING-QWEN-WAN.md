# Marketing — Qwen × Wan 3.0
**Campanha completa com tudo do Qwen (Model Studio) e geração de vídeo Wan 3.0**
**27/09/2026**

---

## 1. Arsenal disponível (172 modelos na Model Studio + Wan)

| Ferramenta | Uso na campanha | Custo |
|---|---|---|
| **qwen-max** | copywriting longo, roteiros, localização PT↔EN↔ES | tokens API (crédito) |
| **qwen-plus** | variações de headline A/B em escala | tokens API |
| **qwen3-vl** (via flash-va local) | ler prints/exames para criativos | GPU própria |
| **qwen-tts** | locução dos vídeos | pendente (endpoint quebrado — corrigir) |
| **Wan 3.0** (via `bl video generate --config media`) | vídeos da campanha | crédito Promotional |
| **qwen-image-edit / qwen-image-max** | thumbnails, cartões, adaptação de arte | tokens API |

Pipeline local já existe: `marketing/campanha-wan.sh` (lote de vídeos Wan 3.0).

## 2. Estratégia — 3 ondas

### Onda 1 · "Prova" (2 semanas) — BeansMed tokens
**Público**: médicos e dentistas (CRM/CRO em mãos via portais).
**Mensagem**: *IA médica que mostra o raciocínio e cita a fonte — ou se cala.*
- 1 vídeo hero (Wan 3.0, 16:9 + 9:16): o loop "pergunta → cadeia de 6 camadas → resposta com citação" animado
- 6 curtas verticais (1 por profissão: clínico, odonto, enfermagem, psicologia, fisio, biomedicina)
- CTA único: **beansmed.com.br** — pacote Starter R$ 19,90
- Canal: LinkedIn orgânico + grupos de WhatsApp de conselhos/classe + Google Ads no nome dos portais

### Onda 2 · "Autoridade" (mês 2) — /decisao e o Parecer CFM
**Público**: diretores clínicos, cooperativas, PMEs de saúde.
**Mensagem**: *O apoio à decisão com trilha de auditoria — o parecer juridicamente estruturado já existe.*
- 1 longa (90 s, Wan 3.0 + locução qwen-tts): a história da cadeia anti-alucinação
- 1 whitepaper PDF (PARECER-CFM existente) como isca de conversão
- CTA: agendar demonstração + pacote Clínica
- Canal: LinkedIn (artigos do fundador — 12 anos Judiciário) + e-mail para base Einstein/liquidação

### Onda 3 · "Território" (mês 3) — ZPE e Tencent
**Público**: imprensa de tecnologia/negócios, investidores, parceiros institucionais.
**Mensagem**: *o primeiro datacenter de IA soberana do Brasil — 68 ms da Europa.*
- Vídeo institucional (Wan 3.0): Caucaia → Ilhéus → mundo (mapa animado com latência)
- Um-pager PDF (ONE-PAGER-BEANSTECH-TENCENT-EN) anexo aos e-mails da JV
- Canal: press-release + LinkedIn do fundador + eventos (Big Data Brazil, Web Summit Rio)

## 3. Roteiros prontos (para Wan 3.0)

**HERO 30s — "A IA que se recusa a errar"**
- 0-5s: mãos digitando pergunta clínica (macro, luz fria) — V.O.: "Você perguntaria a uma IA qual antibiótico dar?"
- 5-15s: o fluxo visual: pergunta → 6 camadas acendendo em sequência (guardian em vermelho, excelência em azul)
- 15-25s: a resposta com citação aparecendo em card; corte para "abstenção: sem evidência suficiente, confirme o protocolo"
- 25-30s: logo BeansMed · **beansmed.com.br** · "Tokens de Excelência"

**CURTA 15s × 6 (uma por profissão)** — template:
- 0-3s: dor da profissão ("Convênio paga em 60 dias" / "Plantão dobrado" / "Sem segunda opinião às 3h")
- 3-10s: a pergunta no /decisao respondida com raciocínio visível
- 10-15s: CTA Starter R$ 19,90

**INSTITUCIONAL 90s — "68 milissegundos"**
- narração: história do cearense que voltou pra Caucaia construir o datacenter que liga o Brasil à Europa
- visual: mapa com pulsos de luz Fortaleza→Lisboa (68ms), Ilhéus→NYC, Shenzhen→São Paulo (o Hy4)
- fechamento: "Beans Tech. Brasileiro. Sem ganância. Com fé."

## 4. Volume e orçamento

| Peça | Qtd | Custo estimado |
|---|---|---|
| Vídeos Wan 3.0 (hero + curtas + institucional) | 8 | crédito Promotional (tokens Wan) |
| Locução qwen-tts | 8 | tokens API |
| Copy + variações (qwen-max/plus) | ~60 textos | tokens API |
| Imagens (qwen-image) | ~20 | tokens API |
| Google/LinkedIn Ads (teste Onda 1) | R$ 3-5k | caixa |

Tudo criativo gerado por nossos próprios modelos — a campanha é, ela mesma, a demostração do produto.

## 5. Métricas de sucesso

| Onda | Métrica | Meta |
|---|---|---|
| 1 | visitas → checkout beansmed | CTR ≥ 2%, 500 visitas/semana |
| 1 | vendas Starter | 100 pacotes no mês 1 |
| 2 | leads demo (whitepaper) | 50 leads qualificados |
| 3 | cobertura imprensa | 3 veículos + 1 convite de evento |
