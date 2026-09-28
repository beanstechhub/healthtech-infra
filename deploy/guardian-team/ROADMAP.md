# ROADMAP — Time de Elite (guardiões da frota)

Ordem de execução, com critério de aceite em cada passo. Nada é "estado da arte" até a taxa de
bypass em PT-BR estar medida.

## Fase 1 — Corpus (base pronta ✓)
- [x] `corpus/build_corpus.py` → 304 exemplos balanceados (152 ataques / 152 legítimos)
- [ ] **Ampliar para ~5.000 exemplos**: injetar traduções dos benchmarks públicos
      (AdvBench 520, JailbreakBench 100, DAN family) via tradutor, e rotular 2.000 negativos
      **reais** (perguntas do chatmed + benchmark cego — cada uma é um negativo de graça)
- [ ] Split de avaliação **separado** (nunca visto no treino)
- **Aceite**: dataset com ≥5k exemplos, 50/50, split treino/val/ataque-adaptativo

## Fase 2 — Fine-tune do guardião PT-BR
- [ ] Baixar `Llama-Prompt-Guard-2-86M` (aceitar licença no HF; token via KMS `HUGGING_FACE`)
      — alternativa sem gate: `protectai/deberta-v3-base-prompt-injection-v2`
- [ ] `finetune/train_ptbr.py` (LoRA, 4 épocas) — roda em **uma GPU** (L4/T4/L20)
- **Aceite**: F1 ≥ 0,97 em validação

## Fase 3 — Avaliação (a métrica que vale)
- [ ] `eval/bypass_rate.py` contra o split de ataques adaptativos
- [ ] Red-team manual: 30 ataques novos escritos por humano (PT-BR) contra o modelo
- **Aceite**: **bypass < 5%** e falsos positivos < 5% (guardião que bloqueia tudo é inútil)

## Fase 4 — Servir nas GPUs de Virgínia
- [ ] Copiar o modelo treinado para `/data/models/guardian-ptbr-86M` (elite-va ou flash-va)
- [ ] `serve/vllm-guardian-ptbr.service` (porta 8010) + token `GUARDIAN_TOKEN` no KMS
- [ ] Security group: 8010/8011/8012 apenas para br-apps + IP dev
- **Aceite**: `/v1/chat/completions` respondendo em <100ms

## Fase 5 — Ligar o firewall de verdade no chatmed (a pendência honesta)
- [ ] Camada 1 (entrada): prompt-injection PT-BR + PII (GLiNER2) + Prompt-Guard base
- [ ] Camada 2 (anexo): spotlighting do documento + scan de injeção indireta
- [ ] Camada 3 (saída): Granite-Guardian-4.1 (política) + groundedness (afirmativa↔fonte RAGMed)
- [ ] A trilha grava o **veredito real** de cada camada (substitui o `guardian_check: 'passed'` fixo)
- **Aceite**: badge do Guardian no chat é verdadeiro; trilha mostra cada camada com resultado

## Fase 6 — Ciclo contínuo
- [ ] Painel de bypass ao longo do tempo (por camada, por tipo de ataque)
- [ ] Re-treino mensal com novos ataques reais observados em produção
- **Aceite**: painel público em health.beanstech.com.br com a taxa atual

## O que isto é (e o que não é)
- **É**: firewall orquestrado de 3 camadas, com guardião PT-BR próprio (o fosso defensável) e
  medição honesta de bypass — referência arquitetural: Meta PurpleLlama / LlamaFirewall.
- **Não é** (ainda): um produto acabado. As fases 2–5 são ~1 semana de trabalho de engenharia.
