# Fontes para chegar aos 5 mil (e muito além) — guardião PT-BR
### Varredura no Hugging Face + GitHub, 28/09/2026 — contagens reais verificadas
*Complementa `corpus/build_corpus.py` (o seed de 304). O tamanho não é problema: o que falta é tradução PT-BR e curadoria.*

---

## Os números: dá para 5 mil com folga — há **mais de 400 mil** disponíveis

| Dataset (HF) | Linhas | Idioma | Uso no guardião |
|---|---:|---|---|
| **PKU-Alignment/BeaverTails** | **364.170** | en (+ subsets) | maior corpus de prompt/resposta prejudicial — reservatório de ataques |
| **safety-aya / aya_redteaming** (Cohere) | ~200k | **multilíngue (inclui PT)** | red-teaming já em vários idiomas — o mais próximo de PT pronto |
| nvidia/Aegis-AI-Content-Safety-2.0 | 33.416 | en | taxonomia de segurança (13 categorias) — ótimo p/ rotular política |
| JailbreakV-28K/JailBreakV-28k | 30.280 | en | jailbreaks multimodais |
| **TrustAIRLab/in-the-wild-jailbreak-prompts** | 21.527 | en | **ataques reais "in the wild"** — os mais valiosos (não sintéticos) |
| lmsys/toxic-chat | 20.330 | en | conversas reais com toxicidade + injeção |
| allenai/wildjailbreak + wildguardmix | ~100k | en | ataque/defesa + rótulos de recusa |
| JailbreakBench/JBB-Behaviors | 200 (+300 judge) | en | benchmark de avaliação (não treino) |
| walledai/AdvBench / HarmBench | 520 / 510 | en | clássicos de avaliação |
| walledai/XSTest | 450 | en | **falsos positivos** — pedidos seguros que PARECEM ataque |
| deepset/prompt-injections | 662 | en | injeção clássica |
| nvidia/Nemotron-RL-Agentic-Indirect-Prompt-Injection | 1.428 | en | **injeção indireta** (o vetor 2026) |
| facebook/cyberseceval3-visual-prompt-injection | 2.514 | en | injeção via imagem |

**GitHub** (frameworks e coleções): Meta PurpleLlama (AdvBench/JailbreakBench/DecodingTrust dentro), NVIDIA-NeMo/Guardrails (7,2k★), guardrails-ai (7,5k★), protectai/llm-guard (3,2k★), rudratoshs/buried-injections (injeção enterrada em texto longo).

## O gap real: **português**

A varredura confirma o que suspeitávamos: **não existe corpus de jailbreak PT-BR em escala** no HF. O que há:
- `safety-aya/trustllm_jailbreaktrigger-portuguese` — **24 linhas** (praticamente nada)
- `darkknight25/Multilingual_Jailbreak_Dataset` — 129 linhas (multilíngue, PT incluso)
- aya_redteaming — multilíngue, mas cobertura PT incerta

**Tradução é obrigatória.** E é onde está a oportunidade: os ~200k do aya + os ~21k in-the-wild + subsets do BeaverTails traduzidos para PT-BR produzem um corpus que **não existe no mercado**.

## O plano para os 5 mil (composição proposta)

| Fatia | Fonte | Volume | Como |
|---|---|---:|---|
| Ataques traduzidos | in-the-wild (21k) + AdvBench + JBB + DAN | ~1.800 | tradução (Qwen-3 como tradutor) + revisão de naturalidade PT |
| Injeção indireta | Nemotron-indirect + cyberseceval3 | ~500 | traduzir payloads de documento/imagem |
| Ofuscação | malaise de encodings | ~300 | gerar em PT (base64, homoglifos, espaçamento) |
| **Ataques novos PT-BR** | red-team humano | ~400 | os que **não existem em inglês** (gíria, contexto BR) |
| **Negativos reais** | chatmed + benchmark cego + 8 portais | ~1.500 | **de graça** — perguntas legítimas do nosso tráfego |
| Negativos difíceis | XSTest (traduzido) + bula/PCDT | ~500 | pedidos seguros que parecem ataque (o que mais testa precisão) |
| **Total** | | **~5.000** | balanceado 50/50 |

A fatia de **negativos reais (1.500)** é o ativo que ninguém tem: são perguntas clínicas brasileiras de verdade, cada uma um rótulo "legítimo" — e a rotulagem contínua em produção mantém o corpus vivo.

## O que fazer agora (ordem)

1. **Baixar** in-the-wild (21k) + BeaverTails (subset) + Nemotron-indirect → `corpus/raw/`
2. **Traduzir** com Qwen-3 (`bl text chat`) em lotes de 50, com prompt de "ataque natural em PT-BR, não tradução literal"
3. **Extrair negativos** do histórico do chatmed/Directus (já rotulados por natureza)
4. **Mesclar** no `build_corpus.py` (tornar as fontes plugáveis) → dataset de 5k
5. **Fine-tune** + avaliar taxa de bypass (Fases 2-3 do ROADMAP)

Nada disso exige GPU para a etapa de corpus — só para o treino no fim. Se quiser, começço agora pelos passos 1-2 (fica pronto o dataset de 5 mil hoje) e deixo o treino para quando ligarmos a GPU spot.
