# Base do fine-tune clínico — decisão e desenho (RagMed / Evidence-BR)

**Data:** 2026-10-01 · **Status:** proposta para decisão
**Contexto:** o guardião PT-BR (86M) já tem dataset de 5.270 pronto. Este documento
fixa a base do **outro** fine-tune — o modelo clínico que responde com citação
obrigatória sobre o corpus Evidence-BR (PCDT/bulas/diretrizes coletados).

---

## 1. O equívoco a evitar: "Qwen 3.8 27B" não é uma base de fine-tune

No catálogo BeansTech existem coisas parecidas que **não** são a mesma:

| Nome no catálogo | O que é de fato | Fine-tunável? |
|---|---|---|
| `Qwen3.8-Max` | MoE **fechado**, só por API Model Studio (US$1,40/M in) | ❌ não — é serviço, não peso |
| `Qwen3.5-Omni-*` | multimodal fechado por API | ❌ não |
| `medgemma:27b` | **MedGemma-27B** (Google, aberto) — roda em elite-va:8001 | ✅ sim, mas licença Google |
| `Lingshu-32B` | Qwen2.5-VL + fine-tune médico DAMO (já é tunado) | ⚠ já especializado em imagem |
| `Baichuan-M3-235B` | MoE 235B/A22B, Apache-2.0 — camada de excelência | ⚠ MoE, difícil de tunar |

**Conclusão:** não existe "Qwen 3.8 27B" aberto para treinar. As bases densas reais
disponíveis são **Qwen3 denso (8B–32B)**, **MedGemma-27B** ou **Granite-4.1**.

---

## 2. Recomendação: destilar o M3 para um aluno denso Qwen3

Não treinar o M3-235B diretamente. Em vez disso, **destilar** conhecimento do M3
(professor) para um **aluno denso menor** e treinar o aluno no corpus Evidence-BR.

### Por que não o M3 direto
- É **MoE 235B/A22B**: LoRA em adapters por expert sofre desbalanceamento de roteamento;
  full fine-tune de 235B é proibitivo (dezenas de GPUs, semanas).
- É **centrado em chinês/medicina chinesa** — o ganho real está na adaptação PT-BR,
  que um aluno denso absorve mais barato.
- Servir 235B custa um nó inteiro (m3-va, 4× L20). Um aluno 8–32B roda na flash-va
  ao lado dos outros modelos.

### Por que um aluno denso Qwen3
- **Apache-2.0** (sem restrição de licença, diferente do MedGemma/Google).
- Denso → LoRA/QLoRA limpo, sem o problema de MoE.
- Já há Qwen3 na frota (qwen3-embedding em flash-va:8010); a stack vLLM é a mesma.
- 8B cabe em 1× L20N; 32B em 2× — ambos dentro do que a flash-va (8× 72G) já tem.

### Desenho da destilação
```
M3-235B (professor, excelência)
   │  gera: pergunta clínica PT-BR → resposta raciocinada + citação
   │  (só sobre trechos recuperados do Elastic — nunca de memória)
   ▼
pares professor (respostas do M3 com citação verificada)
   │  + gate Evidence-BR (trecho_original confere verbatim com a fonte)
   │  + revisão humana (status: candidato → revisado_por)
   ▼
fine-tune Qwen3-8B/32B (aluno) — LoRA/QLoRA, 1–3 épocas
   ▼
aluno clínico PT-BR: mais barato de servir, auditável, cita fonte
   (M3 continua como camada de excelência via API interna p/ casos difíceis)
```

O aluno **não substitui** o M3 — assume o volume (casos comuns, resposta rápida),
enquanto o M3 fica para os casos complexos que já acionam a camada 6 de excelência.

---

## 3. Comparativo das bases candidatas

| Base | Tam. | Licença | Custo de servir | Risco | Veredito |
|---|---|---|---|---|---|
| **Qwen3 denso** | 8B/32B | Apache-2.0 | baixo (1–2× L20N) | baixo | ✅ **escolhida** |
| MedGemma-27B | 27B | Google (restrita) | médio | licença p/ uso comercial | alternativa |
| Granite-4.1 | 30B | Apache-2.0 | médio | não-médico de origem | alternativa geral |
| Lingshu-32B | 32B | aberto | médio | já é tunado p/ imagem | não p/ texto |
| Baichuan-M3 | 235B MoE | Apache-2.0 | alto (nó inteiro) | difícil de tunar | só como professor |

---

## 4. O que é preciso para executar (ordem)

1. **Corpus Evidence-BR** — em andamento: coletores PT-BR (PCDT/CONITEC/SUS/ANVISA)
   → `ingest.py` → Elastic (br-es) → `build_pares_evidence_br.py` → pares candidatos.
2. **Pares professor** — M3 gera resposta+citação sobre trechos recuperados; gate
   verbatim reprova o que não confere; médico revisa (2.000–10.000 pares).
3. **Base aluno** — baixar Qwen3-8B (início) ou 32B (produção) via token HF no KMS.
4. **Fine-tune** — LoRA/QLoRA, 1–3 épocas, na flash-va (spot se preciso).
   QLoRA 4-bit em 32B cabe em 1–2× L20N.
5. **Eval clínico cego** — ampliar os 51 casos do benchmark; revisão independente.
6. **Servir** — vLLM na flash-va, token no KMS, integrado à cadeia de evidência.

---

## 5. Estimativa honesta de tempo/custo (aluno Qwen3-32B, QLoRA)

Sobre **50–200 mil pares curados** (não o acervo de 100M — isso é RAG, não treino):

| Pares de treino | Tokens/época | Tempo (8× L20N, QLoRA) | Custo |
|---|---|---|---|
| 50 mil | ~40 M | ~3 h | dezenas de US$ |
| 200 mil | ~160 M | ~11 h | ~US$ 100–200 |

**O gargalo não é GPU nem tempo — é revisão humana dos pares.** Os coletores e o
M3 geram candidatos; cada par só vira treino com `revisado_por` de médico. É o
mesmo princípio do guardião: volume sem curadoria ensina o modelo a fabricar.

---

*Relacionados: `deploy/ragmed/COLETORES-PTBR.md` (coletores), `deploy/ragmed/ingest.py`
(ingestão Elastic), `deploy/ragmed/build_pares_evidence_br.py` (gate de citação),
`deploy/guardian-team/ROADMAP.md` (guardião 86M), `RAGMED-PORTAIS-DATASETS-FLUXOS.md`
(piloto Evidence-BR 2.000 casos).*
