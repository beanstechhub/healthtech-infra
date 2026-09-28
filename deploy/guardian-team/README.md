# Time de Elite — Guiardioes da frota BeansTech (g.cloud)

## A arquitetura (estado da arte, referência: Meta PurpleLlama / LlamaFirewall)

O campo consolidou que guardrail não é UM classificador — é um **firewall orquestrado** com camadas de entrada, conteúdo e saída:

```
                          ┌─────────────────────────────────────────────┐
   usuário  ─── texto ──► │  CAMADA 1 · ENTRADA                          │
                          │  ├─ prompt-injection  (Prompt-Guard-2 86M)   │
                          │  ├─ PII / LGPD        (GLiNER2-PII-multi)    │
                          │  └─ jailbreak PT-BR   (guardian-ptbr-86M ★)  │
                          └───────────────┬─────────────────────────────┘
                                          ▼
                          ┌─────────────────────────────────────────────┐
   anexo ── pdf/img ────► │  CAMADA 2 · CONTEÚDO (inj. indireta)         │
                          │  └─ spotlighting + scan do doc recuperado   │
                          └───────────────┬─────────────────────────────┘
                                          ▼
                                     modelo clínico
                                          ▼
                          ┌─────────────────────────────────────────────┐
                          │  CAMADA 3 · SAÍDA                            │
                          │  ├─ política de harm  (Granite-Guardian-4.1) │
                          │  └─ groundedness      (afirmativa↔fonte)     │
                          └───────────────┬─────────────────────────────┘
                                          ▼
                             resposta + TRILHA com veredito real de cada camada
```

## O elenco (5 modelos, 4 papéis)

| Papel | Modelo base | Tam. | Papel na cadeia | Estado |
|---|---|---|---|---|
| **1. Injeção** | `meta-llama/Llama-Prompt-Guard-2-86M` | 86M | detecta injeção/jailbreak na **entrada** | base multilíngue (mDeBERTa-v3); a treinar PT-BR |
| **2. PII/LGPD** | `fastino/GLiNER2-Guardrails-PII-Multi` | ~0,2B | acha CPF, telefone, dado pessoal — camada 1 LGPD | pronto (multilíngue) |
| **3. Política/harm** | `ibm-granite/granite-guardian-4.1-8b` | 8B | política de dano + customizável (RAG, alucinação) | pronto — evolução do nosso 3.2-3b |
| **4. Groundedness (saída)** | reuso do Granite + RAGMed | — | verifica afirmativa↔fonte citada | a construir |
| **★ Produção própria** | **guardian-ptbr-86M** | 86M | detector de jailbreak **em português**, treinado com trafego real | **a treinar** — o fosso |

**Recursos das GPUs de Virginia**: elite-va (2× L20) e flash-va (8× RTX PRO 5000 72G, 587 GB). Os guardiões 1, 2 e ★ (86M–200M) são minusculos: caberiam todos num único L20 com folga ao lado dos modelos clínicos. O Granite-Guardian-4.1-8B (~16 GB FP16) entra na flash-va.

## Pipeline (pasta `guardian-team/`)

| Arquivo | O que faz |
|---|---|
| `corpus/build_corpus.py` | monta o corpus PT-BR: ataques (traduzidos de AdvBench/JailbreakBench) + negativos reais (perguntas clínicas do benchmark/chatmed) |
| `finetune/train_ptbr.py` | fine-tune do Prompt-Guard-2-86M em PT-BR (transformers Trainer, full/LoRA) |
| `eval/bypass_rate.py` | mede **taxa de bypass** contra ataques PT-BR (a métrica que vale) |
| `serve/vllm-guardian.service` | unidades systemd para servir os guardiões nas GPUs de Virginia |
| `ROADMAP.md` | ordem de execução e critérios de aceite |

## Princípio de honestidade (o que a reunião vai cobrar)

- O badge do Guardian no chatmed **só vira verdadeiro** quando a rota chamar o guardião de fato e gravar o veredito por camada na trilha. Até lá, é decoração — e isso está registrado.
- "Estado da arte" é a **taxa de bypass medida em PT-BR**, não a lista de downloads. O ciclo: treinar → red-team → medir → corrigir.
