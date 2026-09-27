# Venda de Tokens — Cálculo Completo
**Casa: beansmed.com.br · Atualizado: 27/09/2026 · Valores medidos na frota real**

---

## 1. Produto e precificação (vigente)

| Pacote | Tokens | Preço | R$/token | Uso típico |
|---|---|---|---|---|
| **Starter** | 100 | R$ 19,90 | R$ 0,199 | teste — 100 chats ou 20 consultas de excelência |
| **Pro** | 500 | R$ 79,00 | R$ 0,158 | profissional individual — 100 consultas de excelência/mês |
| **Clínica** | 2.000 | R$ 249,00 | R$ 0,1245 | equipe — 400 consultas de excelência/mês |

**Tabela de custo em tokens por operação (implementada no shim):**

| Operação | Modelos acionados | Custo |
|---|---|---|
| Chat clínico | medgemma-27b ou medgemma-4b | **1 token** |
| Consulta de excelência | Baichuan-M3-235B (m3-va, TP4) | **5 tokens** |
| Guarda de segurança (granite-guardian) | interna do /decisao | sem cobrança |

Portanto: **consulta de excelência custa ao cliente R$ 0,62 (Clínica) a R$ 1,00 (Starter)**; chat custa R$ 0,12-0,20. Referência de mercado: consulta médica humana R$ 150-300; ferramentas internacionais de decisão (UpToDate) ~R$ 1.000/ano por médico.

## 2. Custo marginal por operação (medido)

| Camada | Hardware | Custo GPU/hora | Tempo/op (concorrência) | Custo/op |
|---|---|---|---|---|
| Chat (medgemma-4b, flash-va) | 8× L20N PostPaid ~US$ 1,32/h amortizado p/ instância | ~US$ 0,08 | 5-8 s ÷ concorrência 16-32 | **~US$ 0,0003 → R$ 0,002** |
| Chat (medgemma-27b, elite-va) | 4× L20N | ~US$ 0,25 | 8-12 s ÷ concorrência 8-16 | ~US$ 0,001 → R$ 0,006 |
| **Excelência (M3-235B-INT4, m3-va)** | 4× L20 TP4 | ~US$ 0,68 | 15-30 s ÷ concorrência 4-8 | ~US$ 0,003 → **R$ 0,018** |
| Cadeia /decisao completa (guardian+síntese+M3) | 3 hosts | — | ~25-40 s | ~US$ 0,005 → **R$ 0,03** |

## 3. Margem

| Produto | Preço | Custo | **Margem bruta** |
|---|---|---|---|
| Chat (1 token, Pro) | R$ 0,158 | R$ 0,006 | **96,2%** |
| Excelência (5 tokens, Pro) | R$ 0,79 | R$ 0,018 | **97,7%** |
| Excelência (5 tokens, Clínica) | R$ 0,62 | R$ 0,018 | **97,1%** |

## 4. Capacidade da frota (teto vendível)

| Camada | Throughput sustentável | Ops/dia |
|---|---|---|
| Pequenos (medgemma-4b, granites, baichuan-m2, lingshu-i) | ~2-4 req/s | 170-350 mil |
| medgemma-27b (elite-va) | ~1,5/s | 50-70 mil |
| M3 excelência (m3-va) | ~0,5-1/s | 25-60 mil consultas |
| **Teto total** | | **~2-4,5 milhões de requests/mês** |

No plano consolidado (elite + 4x nova + 2x nova): mesma capacidade nos pequenos, M3 na 4x com mais cache KV.

## 5. Cenários de receita

| Cenário | Assinaturas | Receita/mês | Custo GPU/mês | Resultado |
|---|---|---|---|---|
| Semente (100 clínicas) | 100× Clínica | **R$ 24.900** | ~R$ 6k (crédito) | margem R$ 19k |
| Primeira escala (1.000 profissionais) | 1.000× Pro | **R$ 79.000** | ~R$ 8k | margem R$ 71k |
| Decolagem (10.000 profissionais = 1,1% do mercado) | 10.000× Pro | **R$ 790.000** | ~R$ 25k | margem R$ 765k |
| Demanda 100% (teto da frota) | ~2,4M consultas de excelência | **R$ 1,5M-3M** | ~R$ 110k (frota cheia) | precisa 3ª máquina |
| Mercado endereçável | 575k médicos + 320k dentistas + 2M enfermeiros + 345k psicólogos | R$ 3,3 bi/ano (1× Pro cada) | — | — |

## 6. Break-even

| Estrutura de custo | Mensal | Break-even (pacote Pro) | Break-even (Clínica) |
|---|---|---|---|
| Plano consolidado subscription | US$ 19.952 ≈ **R$ 110k** | **1.393 pacotes** | **442 clínicas** |
| Só custo marginal (frota já paga, crédito) | ~R$ 30k | 379 pacotes | 120 clínicas |
| Hoje (4 hosts PostPaid, crédito US$ 49k) | ~R$ 182k (mas pago pelo crédito) | 2.300 pacotes | 732 clínicas |

**Leitura**: com crédito cobrindo a frota atual, cada pacote vendido é praticamente 100% lucro até o crédito acabar; a subscription quebra em ~1.400 pacotes/mês — 0,16% do mercado médico.

## 7. Fluxo operacional (como está implementado)

1. Cliente compra em **beansmed.com.br** → Pix BR Code (EMV estático c/ valor e txid) + QR
2. Recebe API key `bth_*` + saldo após confirmação do financeiro (`POST /admin/confirm/{id}`)
3. Usa a key em qualquer endpoint do shim (`:8080/api/chat`, model `m3` ou chat)
4. Shim valida saldo (SQLite WAL), **debita 5 p/ excelência ou 1 p/ chat**, proxy para vLLM
5. Saldo insuficiente → HTTP 402 com instrução de recarga
6. Dashboard: `GET /admin/stats` (vendas, receita, consumo, top clientes) — probe no healthdash

**Pendência única**: chave Pix real (`/usr/local/etc/tokens/PIX_KEY` no br-apps). Sem ela o checkout emite o código mas a página avisa.

## 8. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Confirm. de pagamento manual | próximo passo: conciliação automática (webhook do banco / extrato) |
| Chave Pix única | sem antifraude — valores baixos (≤R$ 249) limitam exposição |
| Abuso de key (compartilhada) | rate-limit por key no shim (fase 2) + padrão de consumo visível no /admin/stats |
| Spot/queda de host | frota tem redundância elite↔flash; M3 é ponto único (migra p/ 4x nova) |
| Crédito expira | break-even da subscription é 0,16% do mercado — o crédito é ponte, não apoio estrutural |
