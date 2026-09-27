# ZPE-DATACENTER — Sovereign Architecture: z.cloud × hy.cloud
### Real data from the comparison (ZPE-DATACENTER-COMPARATIVO-EN.xlsx) + fleet network measurements (Sep 24, 2026)

---

## 1. The thesis in one sentence

**Parnaíba (Piauí) is the best export-processing zone in Brazil for an AI datacenter — the lowest power cost in the country (R$ 250-350/MWh, 100-300 MW available, energization in 12-24 months) — and Caucaia (Ceará) is its gateway to the world (7+ international cables, 11 ms to São Paulo).** Together, the two ZPEs deliver what not even Alibaba delivers today: datacenter-class GPUs on Brazilian soil. Ilhéus remains the land bank for the 20-year campus.

Verdict from the spreadsheet (Executive Summary sheet):
- **Parnaíba — BUILD: mass compute** (cheap power + solar/gas, full Sudene + aggressive Piauí state incentives)
- **Caucaia — BUILD: gateway** (first DC + interconnection, Ascenty/Scala/ODATA ecosystem + TikTok)
- **Ilhéus — RESERVE** (10k to 10M m² under purchase option, R$ 30-120/m²)

---

## 2. Latency — what actually changes (live measurements + comparison data)

Values measured today (Sep 24, 2026, real RTT from our fleet):
- br-apps (São Paulo) → **Virginia (current fleet)**: 355 ms (peaking at 1,485 ms during network degradation)
- br-apps → **Frankfurt (Alibaba EU)**: 560-650 ms — BR→Europe traffic routes via the US
- br-apps → Singapore (old fleet, released today): 580 ms

| Destination | Today: VA fleet | **ZPE Caucaia** | **ZPE Parnaíba** | Improvement |
|---|---|---|---|---|
| São Paulo (portal users) | ~114-355 ms | **11 ms** | 25 ms | **up to 30×** |
| Rio de Janeiro | ~130-370 ms | 16 ms | 30 ms | ~10× |
| **US East Coast (Monet/FIRMINO)** | ~114-355 ms | **85 ms** | 98 ms | **~25-80%** |
| **Europe (Ellalink → Sines)** | **~560 ms** | **68 ms** | 78 ms | **~85% (8×)** |
| LATAM North (Bogotá/Caribbean) | ~150 ms | **30 ms** | 80 ms | **5×** |
| Africa (SACS → Luanda) | — | 45 ms | 55 ms | new market |

**The three numbers that sell the datacenter:**
1. **Europe at 68 ms** — today Brazil talks to Europe at 560 ms. With the Caucaia gateway, the European service sits closer to São Paulo than our current Virginia fleet does. *LATAM stops being a network periphery.*
2. **LATAM-North at 30 ms** — Spanish-speaking America (Colombia, the Caribbean, Mexico via Malbec/AMX-1) becomes an adjacent market, not a distant one.
3. **São Paulo at 11 ms** — decision-grade clinical/legal AI (the entire anti-hallucination chain) enters local-application latency territory.

Backhaul: Parnaíba ↔ Fortaleza ~500 km (partly existing via Teresina, to be reinforced) — adds 10-13 ms over the landing.

---

## 3. Phase 2 — The first sovereign node (Caucaia, H1-2027)

**The object: 1 HGX H200 server (8× H200 141 GB = 1.13 TB VRAM, NVLink)** — the only form factor that runs both engines on their official recipes:
- **z.cloud: GLM-5.3 (750B) FP8** — 755 GB of weights, TP=8 NVLink, official vLLM recipe (the model was designed for exactly this; the winner of our clinical benchmark)
- **hy.cloud: Hy4-preview / the Hunyuan family** — on the same node or a twin; the 467 GB Q4 Hy4 we have already proven deployable (Shenzhen) migrates home

| Item | US$ (2026 estimate, to validate with OEM) |
|---|---|
| HGX 8× H200 server (factory, international) | ~US$ 420,000 |
| **Import savings under full ZPE** (II 14% + IPI 10% + PIS/COFINS 11.75% + ICMS 18% suspended) | **~US$ 215,000 saved** (51% of the tax burden) |
| Real node cost imported via ZPE | **~US$ 210,000** |
| Colocation 20 kW in Caucaia (US$ 120-180/kW/month, Fortaleza standard) | US$ 2,400-3,600/month |
| Power 20 kW (CE tariff R$ 350-480/MWh) | ~US$ 1,000-1,400/month |
| Networking (cross-connect to the IX + Parnaíba backhaul later) | ~US$ 1,500-3,000/month |
| **Total OPEX of the sovereign GLM-5.3 + Hy4 node** | **~US$ 5,000-8,000/month** |

**The brutal comparison:** running GLM-5.3 via Model Studio at high volume costs tens of thousands of US$/month in tokens; running it on our own node costs **~US$ 6.5k/month fixed** — break-even appears at a few hundred million tokens per month, and sovereignty (LGPD, auditability, "prove what you answer") comes free.

Timeline: Fortaleza colocation exists today (Ascenty/Scala/ODATA); typical CZPE project cycle is 6-12 months — **the ZPE filing needs to start now for the node to exist before the second partner meeting.**

---

## 4. Phase 3 — Parnaíba: the compute campus with solar independence

**The power math that justifies the state:** R$ 250-350/MWh (lowest in the country), a surplus region (100-300 MW short term), **energization in 12-24 months** — against Caucaia's 24-36-month ANEEL queue.

**Solar independence — viable and the best in the country:**
- Parnaíba irradiance: **~1.2 MW/ha** (best index in the comparison)
- A Phase-1 campus of **10 MW of IT** (~80 HGX nodes = 90 TB VRAM — the entire fleet: GLM-5.3 + Hy4 + replicas + every model currently on Alibaba) requires **~15 MWp solar + battery** (CF ~0.25-0.30 with storage):
  - 15 MWp solar: **US$ 9-11 million** (US$ 600-750k/MW, utility-scale 2026)
  - ~40 MWh BESS (4h): **US$ 4-5 million**
  - Or a PI solar/gas PPA instead of capex: R$ 250-350/MWh already available
- Santa Terezinha (PB, owned land) remains the architecture's second solar source — energy redundancy across two states.

**Phase-3 10 MW campus CAPEX (spreadsheet premises: civil US$ 8-13/W, GPU US$ 2.5-4M/MW):**

| Block | US$ |
|---|---|
| Civil (10 MW IT, liquid cooling, 100-130 kW/rack) at US$ 10/W | **~US$ 100 M** |
| GPUs (80 H200 nodes) at ~US$ 3.25M/MW | **~US$ 32.5 M** |
| Own energy (solar + BESS) | ~US$ 13-16 M |
| Parnaíba↔Fortaleza backhaul (500 km, reinforcement) | ~US$ 3-5 M |
| **Phase 3 total** | **~US$ 150-155 M** |
| **ZPE/Redata savings on GPUs + equipment (II/IPI/PIS/COFINS/ICMS)** | **~US$ 50-80 M** |

The Redata regime (Law 15,504, in force since Sep 15, 2026) applies to all three sites (all Northeast — commitments reduced 20%): PIS/COFINS/IPI exemption on ICT equipment **with no export requirement**, complementary to the ZPE (which suspends everything but requires ≥ 80% export revenue — the z.cloud/hy.cloud model selling inference abroad fits perfectly).

---

## 5. The asks to the partners (what each one signs)

| Partner | What BeansTech offers | What we ask |
|---|---|---|
| **Z.ai (z.cloud, US$ 300M)** | GLM-5.3 running sovereign on Brazilian soil (own HGX node), a 220M regulated market, LGPD by design | co-investment in the Caucaia node (~US$ 210k + colo) as a showcase; weights-license discounts for the campus |
| **Tencent (hy.cloud, US$ 350M)** | Hy4-preview + the Hunyuan family in production (already proven in Shenzhen), the ZPE next to TikTok, solar power | the Parnaíba campus capex (the anchor investor); Hunyuan stack as the campus compute standard |

The technical narrative the data supports: *two sovereign clouds (z.cloud/hy.cloud), a gateway 11 ms from São Paulo and 68 ms from Europe, a campus on the cheapest power in the country with solar independence — and the "prove what you answer" audit bar already running across 12 models.*

---

## 6. Immediate sequence (what is already in motion)

1. ✅ Blackwell fleet consolidated across Virginia/Shenzhen (12 sovereign models + 2 via API) — the bridge until 2027
2. ✅ Hy4-preview proving the Tencent flagship in Shenzhen (download in progress)
3. ✅ ZPE comparison with 2026 market data (this document + spreadsheet)
4. ⬜ **3 LOIs in the same week**: Ilhéus land option + Parnaíba power study (COELBA/Chesf/Coelce letters) + Caucaia site plan — goal: paper signed before the Tencent meeting
5. ⬜ CZPE/MDIC project filing (typical 6-12 months)
6. ⬜ Real latency measurement with probes at all 3 sites (validate the estimated RTTs)

*Values = 2026 market estimates, to be validated with CZPE, ANEEL/utilities, fiber carriers and OEMs. Sources and assumptions: ZPE-DATACENTER-COMPARATIVO-EN.xlsx (Assumptions, Full Comparison, Incentives & Taxes, Network & Latency sheets).*
