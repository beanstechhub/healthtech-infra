# ZPE-DATACENTER — Arquitetura Soberana z.cloud × hy.cloud
### Dados reais do comparativo (ZPE-DATACENTER-COMPARATIVO.xlsx) + medições de rede da frota (24/09/2026)

---

## 1. A tese em uma frase

**Parnaíba (PI) é a melhor ZPE do Brasil para datacenter de IA — o menor custo de energia do país (R$ 250-350/MWh, 100-300 MW disponíveis, energização em 12-24 meses) — e Caucaia (CE) é o seu gateway para o mundo (7+ cabos internacionais, 11 ms de São Paulo).** Juntas, as duas ZPEs entregam o que nem a Alibaba entrega hoje: GPU de datacenter no solo brasileiro. Ilhéus fica como banco de terra para o campus de 20 anos.

Veredito da planilha (aba Resumo Executivo):
- **Parnaíba — BUILD: compute em massa** (energia barata + solar/gás, Sudene integral + incentivos PI agressivos)
- **Caucaia — BUILD: gateway** (primeiro DC + interconexão, ecossistema Ascenty/Scala/ODATA + TikTok)
- **Ilhéus — RESERVAR** (10 mil a 10 milhões m² com opção de compra, 30-120 R$/m²)

---

## 2. Latência — o que muda de verdade (medições reais + dados do comparativo)

Valores medidos hoje (24/09/2026, RTT real da frota):
- br-apps (SP) → **Virgínia (frota atual)**: 355 ms (pico 1.485 ms com a rede degradada)
- br-apps → **Frankfurt (Alibaba EU)**: 560-650 ms — o tráfego BR→Europa roteia via EUA
- br-apps → Singapura (frota antiga, hoje liberada): 580 ms

| Destino | Hoje: frota VA | **ZPE Caucaia** | **ZPE Parnaíba** | Melhoria vs. hoje |
|---|---|---|---|---|
| São Paulo (usuários dos portais) | ~114-355 ms | **11 ms** | 25 ms | **até 30×** |
| Rio de Janeiro | ~130-370 ms | 16 ms | 30 ms | ~10× |
| **Costa dos EUA (Monet/FIRMINO)** | ~114-355 ms | **85 ms** | 98 ms | **~25-80%** |
| **Europa (Ellalink → Sines)** | **~560 ms** | **68 ms** | 78 ms | **~85% (8×)** |
| LATAM Norte (Bogotá/Caribe) | ~150 ms | **30 ms** | 80 ms | **5×** |
| África (SACS → Luanda) | — | 45 ms | 55 ms | novo mercado |

**Os três números que vendem o datacenter:**
1. **Europa a 68 ms** — hoje o Brasil fala com a Europa a 560 ms. Com o gateway de Caucaia, o serviço europeu fica mais perto de São Paulo do que a frota atual de Virgínia está. *A LATAM deixa de ser periferia de rede.*
2. **LATAM-Norte a 30 ms** — a América espanhola (Colômbia, Caribe, México via Malbec/AMX-1) vira mercado adjacente, não distante.
3. **São Paulo a 11 ms** — a IA clínica/jurídica de decisão (a cadeia anti-alucinação inteira) entra no regime de latência de aplicação local.

Backhaul: Parnaíba ↔ Fortaleza ~500 km (em parte existente via Teresina, a reforçar) — +10-13 ms sobre o landing.

---

## 3. Fase 2 — O primeiro nó soberano (Caucaia, 2027-H1)

**O objeto: 1 servidor HGX H200 (8× H200 141 GB = 1,13 TB VRAM, NVLink)** — o único formato que roda os dois motores com as receitas oficiais:
- **z.cloud: GLM-5.3 (750B) FP8** — 755 GB de pesos, TP=8 NVLink, receita oficial vLLM (é para isso que o modelo foi desenhado; o vencedor do benchmark clínico)
- **hy.cloud: Hy4-preview / família Hunyuan** — no mesmo nó ou nó gêmeo; o Hy4-Q4 de 467 GB que já provamos subir (Shenzhen) migra para casa

| Item | US$ (estimativa 2026, validar com OEM) |
|---|---|
| Servidor HGX 8× H200 (in-factory, internacional) | ~US$ 420.000 |
| **Economia de importação ZPE plena** (II 14% + IPI 10% + PIS/COFINS 11,75% + ICMS 18% suspensos) | **~US$ 215.000 economizados** (51% do custo tributário) |
| Custo real do nó importado via ZPE | **~US$ 210.000** |
| Colo 20 kW em Caucaia (US$ 120-180/kW/mês, padrão Fortaleza) | US$ 2.400-3.600/mês |
| Energia 20 kW (tarifa CE R$ 350-480/MWh) | ~US$ 1.000-1.400/mês |
| Networking (cross-connect ao IX + backhaul Parnaíba depois) | ~US$ 1.500-3.000/mês |
| **OPEX total do nó GLM-5.3 + Hy4 soberanos** | **~US$ 5.000-8.000/mês** |

**Comparação brutal:** rodar GLM-5.3 via Model Studio a volume alto custa dezenas de milhares de US$/mês em tokens; rodar no nó próprio custa **~US$ 6,5 mil/mês fixos** — o break-even aparece com poucas centenas de milhões de tokens/mês, e a soberania (LGPD, auditoria, "provar o que se responde") vem junto de graça.

Prazo: colo pronto em Fortaleza existe hoje (Ascenty/Scala/ODATA); projeto CZPE típico 6-12 meses — **o papel da ZPE precisa entrar agora para o nó existir antes da 2ª reunião com os parceiros.**

---

## 4. Fase 3 — Parnaíba: o campus de compute com independência solar

**A conta de energia que justifica o estado:** R$ 250-350/MWh (menor do país), região de excedente (100-300 MW curto prazo), **energização em 12-24 meses** — contra a fila ANEEL de 24-36 meses de Caucaia.

**Independência solar — viável e melhor do país:**
- Irradiação de Parnaíba: **~1,2 MW/ha** (melhor índice do comparativo)
- Um campus Fase 1 de **10 MW de TI** (~80 nós HGX = 90 TB de VRAM — a frota inteira: GLM-5.3 + Hy4 + réplicas + todos os modelos hoje na Alibaba) exige **~15 MWp solar + bateria** (CF ~0,25-0,30 com armazenamento):
  - Solar 15 MWp: **US$ 9-11 milhões** (US$ 600-750k/MW, utility 2026)
  - BESS ~40 MWh (4h): **US$ 4-5 milhões**
  - Ou PPA solar/gás PI no lugar do capex: R$ 250-350/MWh já fechado
- Santa Terezinha (PB, terreno próprio) permanece como a segunda fonte solar da arquitetura — redundância energética entre dois estados.

**CAPEX do campus 10 MW (premissas da planilha: civil US$ 8-13/W, GPU US$ 2,5-4M/MW):**

| Bloco | US$ |
|---|---|
| Civil (10 MW TI, liquid cooling, 100-130 kW/rack) a US$ 10/W | **~US$ 100 M** |
| GPUs (80 nós H200) a ~US$ 3,25M/MW | **~US$ 32,5 M** |
| Energia própria (solar + BESS) | ~US$ 13-16 M |
| Backhaul Parnaíba↔Fortaleza (500 km, reforço) | ~US$ 3-5 M |
| **Total Fase 3** | **~US$ 150-155 M** |
| **Economia ZPE/Redata sobre GPUs+equipamentos (II/IPI/PIS/COFINS/ICMS)** | **~US$ 50-80 M** |

O regime Redata (Lei 15.504, em vigor desde 15/09/2026) aplica-se aos três sítios (todos Nordeste — contrapartidas reduzidas 20%): isenção de PIS/COFINS/IPI em equipamentos de TIC **sem exigência de exportação**, complementar à ZPE (que suspende tudo, mas exige ≥ 80% de receita de exportação — o modelo z.cloud/hy.cloud vendendo inferência para fora encaixa perfeitamente).

---

## 5. Os pedidos aos parceiros (o que cada um assina)

| Parceiro | O que a BeansTech oferece | O que pede |
|---|---|---|
| **Z.ai (z.cloud, US$ 300M)** | GLM-5.3 rodando soberano no solo BR (nó HGX próprio), 220M de mercado regulado, LGPD por design | co-investimento do nó de Caucaia (~US$ 210k + colo) como showcase; desconto de licença/weights para o campus |
| **Tencent (hy.cloud, US$ 350M)** | Hy4-preview + família Hunyuan em produção (já provado em Shenzhen), a ZPE vizinha do TikTok, energia solar | capex do campus de Parnaíba (o maior investidor); stack Hunyuan como padrão do compute |

A narrativa técnica que os dados sustentam: *duas nuvens soberanas (z.cloud/hy.cloud), um gateway a 11 ms de São Paulo e 68 ms da Europa, um campus de energia mais barata do país com independência solar — e a régua de auditoria "provar o que se responde" já rodando em 12 modelos.*

---

## 6. Sequência imediata (o que já está em movimento)

1. ✅ Frota Blackwell Virginia/Shenzhen consolidada (12 modelos soberanos + 2 via API) — a ponte até 2027
2. ✅ Hy4-preview provando o flagship Tencent em Shenzhen (download em andamento)
3. ✅ Comparativo ZPE com dados de mercado 2026 (este documento)
4. ⬜ **3 LOIs na mesma semana**: opção de terra Ilhéus + estudo energético Parnaíba (cartas COELBA/Chesf/Coelce) + planta Caucaia — meta: papel antes da reunião Tencent
5. ⬜ Protocolo CZPE/MDIC do projeto (prazo típico 6-12 meses)
6. ⬜ Medição real de latência com probes nos 3 sítios (validar os RTT estimados)

*Valores = estimativas de mercado 2026, a validar com CZPE, ANEEL/distribuidoras, operadoras de fibra e OEMs. Fontes e premissas: ZPE-DATACENTER-COMPARATIVO.xlsx (abas Premissas, Comparativo Completo, Incentivos & Impostos, Rede & Latência).*
