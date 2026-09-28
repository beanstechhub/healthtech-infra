# Corpus do guardião PT-BR — manifesto do bucket

**Bucket**: `oss://beanstech-guardian-corpus` (região ap-southeast-1)
Criado/atualizado: 28/09/2026 · 11 objetos

## Estrutura

```
oss://beanstech-guardian-corpus/
├── raw/                          corpora originais (inglês, dos benchmarks públicos)
│   ├── in-the-wild/jailbreak_2023_12_25.parquet    1.405 jailbreaks reais
│   ├── in-the-wild/regular_2023_12_25.parquet     13.735 pedidos benignos reais
│   ├── advbench/train.parquet                        416 comportamentos prejudiciais
│   ├── jailbreakbench/harmful-behaviors.csv          100 comportamentos + 100 benignos
│   ├── jailbreakbench/benign-behaviors.csv
│   └── nemotron/indirect-prompt-injection.jsonl    1.272 injeções INDIRETAS (NVIDIA)
├── ptbr/                         traduções PT-BR (via Model Studio / Qwen)
│   ├── ataques_ptbr_full_1915.jsonl   1.915 ataques traduzidos (label 1)
│   └── negativos_ptbr_1183.jsonl      1.183 pedidos benignos traduzidos (label 0)
└── dataset/                      conjuntos finais para treino/avaliação
    ├── treino_2282.jsonl        2.282 exemplos balanceados (1.236 ataque / 1.046 legítimo)
    └── eval_404.jsonl             404 exemplos SEPARADOS (nunca vistos no treino)
```

## Como foi produzido

| Etapa | Script | Status |
|---|---|---|
| download dos benchmarks | (manual, HF) | ✓ |
| tradução de ataques | `corpus/translate_ptbr.py` | ✓ 1915 (enquadramento "anotação de dataset") |
| tradução de benignos | `corpus/translate_negativos.py` | ✓ 1183 |
| montagem do dataset | `corpus/build_dataset.py` | ✓ 2.282 treino + 404 eval |

## Composição do dataset final

| Fonte | Treino | Avaliação |
|---|---:|---:|
| ataques traduzidos (in-the-wild + AdvBench + JBB) | 1.141 | 202 |
| benignos reais traduzidos (in-the-wild regular) | 999 | 175 |
| seed PT-BR (build_corpus.py) | 119 | 24 |
| casos clínicos reais (benchmark / portais) | 23 | 3 |

## Limitações honestas (e o caminho para 5 mil)

- **2.282 + 404 = 2.686 exemplos** — base sólida, ainda não os 5 mil. Falta: mais ~1.000
  ataques novos PT-BR de red-team humano (gíria/contexto BR), ~500 negativos difíceis
  (XSTest traduzido), e mais negativos clínicos reais do histórico do chatmed.
- **Rótulos dos ataques são automáticos** (label=1 por origem) — a última milha é revisão
  humana de uma amostra para medir a taxa de erro.
- **Filtro de conteúdo**: o tradutor Qwen recusa alguns ataques mesmo com o enquadramento;
  os ~1% que falham são justamente os mais hediondos (o que é um sinal saudável).
- **Nada disso substitui a avaliação**: o número que vale é a taxa de bypass (bypass_rate.py)
  com este dataset — a medir após o fine-tune.

## Reprodução

```bash
cd deploy/guardian-team/corpus
export DASHSCOPE_API_KEY=$(aliyun kms GetSecretValue --region ap-southeast-1 --SecretName DASHSCOPE_API_KEY | python3 -c 'import json,sys;print(json.load(sys.stdin)["SecretData"])')
python3 build_corpus.py            # seed PT-BR (304)
python3 translate_ptbr.py --max 0 --workers 10    # ataques → ataques_ptbr_full.jsonl
python3 translate_negativos.py --max 1500 --workers 10   # benignos
python3 build_dataset.py           # → dataset_guardian_ptbr.jsonl + eval_ptbr.jsonl
# subir: aliyun oss cp ... oss://beanstech-guardian-corpus/...
```
