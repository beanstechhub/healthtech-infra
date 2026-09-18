# Nuvem privada BeansTech — manual de integração e tabela de venda

**Para:** ativo.tech (página "Nuvem privada de IA") · portais BeansTech · parceiros de API
**Versão:** 2026-09-15 · **Estado das máquinas:** verificado por API e Cloud Assistant nesta data

> Preços de custo vêm da fatura real de setembro/2026 (`QueryInstanceBill`). Throughputs marcados `[ref]` são valores de referência de vLLM/Ollama em L20 para a quantização indicada, não medição nossa — a medição entra quando os três serviços novos estiverem no ar. Ninguém deve anunciar número de desempenho clínico: ainda não existe.

---

## 1. A frota — o que já responde e o que está subindo

| Máquina | Região | GPU | Endpoint | Modelo servido | Estado 15/09 |
|---|---|---|---|---|---|
| **elite-health** | Singapura | 2× L20 48 GB | `http://8.222.169.230:8080` (router Ollama, Bearer `GPU_GATEWAY_TOKEN`) | `medgemma:27b` (Q8) · `medgemma-1.5-4b` · `granite4.1:30b-q4` · `granite3-guardian:8b` · `qwen3-vl:8b` · whisper `:8200` (só local) | **produção** — 5 modelos residentes |
| **elite-health-2** | Singapura | 2× L20 48 GB | `http://43.98.194.204` · `:8001` `lingshu-32b` · `:8002` `baichuan-m2` · `:8003` `lingshu-i-8b` (vLLM 0.29, Bearer `GPU2_GATEWAY_TOKEN`) | GPU0: Lingshu-32B (VL, **FP8 em carga**, ctx 12k) · GPU1: Baichuan-M2-32B INT4 (ctx 12k) + Lingshu-I-8B (VL, ctx 8k) | **no ar** (15/09 14:28 UTC) — 44,7 / 45,0 GB por GPU |
| **m3-va** | Virgínia | 4× L20 48 GB (TP=4) | `http://47.85.201.160:8000/v1` (vLLM 0.29, Bearer `M3_API_TOKEN`, `--reasoning-parser qwen3`) | `baichuan-m3` — Baichuan-M3-235B GPTQ-INT4, ctx 32k, 42 GB/GPU | **no ar** (15/09) — modelo pensante: ~1,5 k tokens de raciocínio por resposta (separados do `content`) |
| **Model Studio** | Singapura (API) | — | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` (`DASHSCOPE_API_KEY`) | `qwen-plus`, `qwen-max`, `qwen3.8-max`, `text-embedding-v4`, `qwen3-rerank`, GLM-5.3 | produção; coberto por SP US$ 4.917 + US$ 1.000/mês |
| **medpubr** | São Paulo | CPU r9i.2xlarge | `http://172.16.0.21:8300` (VPC) | BGE-M3 embed · bge-reranker-v2-m3 · NER PT-BR · PII · `/v1/support` | produção |

Segurança de rede: cada porta GPU só aceita o EIP do `br-apps` (43.118.160.51) e o IP do dev. Cliente externo **nunca** fala com a GPU: fala com `api.dodr.ai` / gateway do ativo.tech, que autentica pelo BeansTech ID e repassa.

**Outras GPUs em Singapura** (verificado `DescribeAvailableResource`, zona `a` com estoque): `gn8is.2xlarge` (1× L20, 8 vCPU) · `gn8is.4xlarge` (1× L20, 16 vCPU) · `gn8is-4x.16xlarge` (4× L20) · `gn8is-8x.32xlarge` (8× L20). Não há L20N (gn9gc) em Singapura — só Virgínia. Spot `gn8is-4x` em VA: US$ 1,98/h (−80 %).

---

## 2. Manual de integração — portais BeansTech

### 2.1 Regra única
Portal **não** chama modelo. Portal chama `answer()` da `@beanstech/evidence-chain` (`healthtech/shared/evidence-chain`), que percorre as 6 camadas e devolve o contrato com citações. Chamada direta a modelo é permitida só em dois casos: (a) tarefa não-clínica (resumo de e-mail, título de artigo) e (b) benchmark. Nos dois, ainda passa pelo gateway com token.

### 2.2 Variáveis (renderizadas pelo `kms-env`, nunca em código)

```
# camada 1 — recuperação (Elastic BR, HTTPS com CA própria)
RAGMED_ES_URL=https://172.16.1.53:9200   RAGMED_ES_USER=elastic   RAGMED_ES_PASSWORD=<KMS ESBR_SELFHOSTED_PASSWORD>
NODE_EXTRA_CA_CERTS=/etc/healthtech/ca/es-br.crt   RAGMED_ES_INDEX=evidence-chunks-v1
# camada 2 — síntese rápida (Model Studio)
QWEN_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1   QWEN_API_KEY=<KMS DASHSCOPE_API_KEY>   QWEN_MODEL=qwen-plus
# camada 3 — identidade (PolarDB) · camada 4 — KMS (implícito)
AUTH_MYSQL_URL=<KMS HT_AUTH_MYSQL_URL>   AUTH_KEYCLOAK_ISSUER=https://id.beanstech.com.br/realms/beanstech
# camada 5 — verificação BR + especialista SG
MEDPUBR_URL=http://172.16.0.21:8300
OLLAMA_BASE_URL=http://8.222.169.230:8080   OLLAMA_API_KEY=<KMS GPU_GATEWAY_TOKEN>   OLLAMA_CHAT_MODEL=medgemma:27b
# camada 6 — excelência (Virgínia)
EXCELLENCE_BASE_URL=http://47.85.201.160:8000/v1   EXCELLENCE_API_KEY=<KMS M3_API_TOKEN>   EXCELLENCE_MODEL=baichuan-m3
# candidatos (elite-health-2) — só para benchmark e tarefas multimodais
GPU2_BASE_URL=http://43.98.194.204   GPU2_API_KEY=<KMS GPU2_GATEWAY_TOKEN>
```
Todos os manifestos `deploy/apps/*.secrets` já carregam isso (exceto `GPU2_*`, adicionar quando o benchmark começar).

### 2.3 Chamada padrão (Next.js route handler, server-side)

```ts
import { answer, configFromEnv } from "@beanstech/evidence-chain";
export async function POST(req: Request) {
  const session = await auth();                       // BeansTech ID (Keycloak) — obrigatório
  if (!session?.user) return new Response("unauthorized", { status: 401 });
  const { question, complex } = await req.json();
  const res = await answer(configFromEnv(), question, { tenant: "dodr", complex });
  return Response.json(res);                          // {status, claims[{text,evidence[],support}], missing_information[], layers}
}
```
`complex: true` força a camada 6 (M3). Sem trecho recuperado → `status: "insufficient"` e nenhum modelo é chamado — o portal deve mostrar isso como resposta, não como erro.

### 2.4 Chamada direta a um modelo (não-clínica ou benchmark)

Todos os endpoints falam o mesmo contrato OpenAI (`/v1/chat/completions`), exceto o router Ollama da elite-health (`/api/generate`, `/api/chat`):

```ts
// vLLM (elite-health-2, m3-va) e Model Studio — idêntico, só muda base/key/model
const r = await fetch(`${base}/chat/completions`, { method: "POST",
  headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
  body: JSON.stringify({ model, messages, temperature: 0.1, max_tokens: 600 }) });
// Ollama (elite-health)
const r = await fetch(`${process.env.OLLAMA_BASE_URL}/api/chat`, { method: "POST",
  headers: { authorization: `Bearer ${process.env.OLLAMA_API_KEY}`, "content-type": "application/json" },
  body: JSON.stringify({ model: "medgemma:27b", messages, stream: false }) });
```
Multimodal (Lingshu): `messages[].content = [{type:"text",text}, {type:"image_url",image_url:{url:"data:image/png;base64,..."}}]`. A imagem passa pela camada PII antes (`medpubr /v1/pii` não trata pixels — remover cabeçalho DICOM e faixa de identificação no portal).

### 2.5 Roteamento recomendado por tarefa

| Tarefa | Modelo | Por quê |
|---|---|---|
| Resposta com evidência ao usuário | cadeia completa (qwen-plus → verificação → M3 se `partial`) | única via com citação verificada |
| Revisão clínica de rascunho, guardrail | `medgemma:27b` + `granite3-guardian:8b` (elite-health) | residentes, latência baixa |
| Laudo/imagem (RX, foto de lesão) | `lingshu-32b` → confirmação `medgemma:27b` | multimodal médico; Lingshu-I-8B para triagem rápida |
| Compliance / PLD / narrativa regulatória | `granite4.1:30b-q4` | treinado para isso; vertical fintech |
| OCR, tabela, formulário | `qwen3-vl:8b` | leve, bom em documento |
| Caso difícil, segunda opinião, pesquisa | `baichuan-m3` | 235B MoE; só com trechos |
| Embedding / rerank / PII | `medpubr` (BR) — nunca API externa para texto clínico | residência de dado |
| Transcrição | whisper na elite-health (`:8200`, abrir rota com token quando um portal precisar) | ASR médico |

### 2.6 Observabilidade e cota
Cada resposta grava `layers{}` e `model_revision`; o gateway do ativo.tech registra `tokens_in/out`, `model`, `tenant`, `api_key` em `auth_audit` (PolarDB). Cota mensal por chave (`api_keys.monthly_budget_usd`) é checada **antes** da camada 2.

---

## 3. Custo real por token — base da precificação

**Regime:** máquinas pagas por hora, então custo por token = custo/hora ÷ tokens/hora. Ocupação é a variável que decide tudo.

**Medido em 15/09/2026** (`deploy/bench-gpu.sh`, do `br-apps`, **1 requisição por vez, 256 tokens, incluindo latência de rede BR→SG/VA**). Em vLLM com lote (batch 8–16) o agregado costuma ficar 3–6× acima do valor de fluxo único; a coluna "agregado" usa **×4** como hipótese conservadora até medirmos com carga.

| Recurso | US$/h (fatura set/26) | Medido, 1 fluxo | Agregado estimado (×4) | US$ por 1M tokens gerados a **100 %** | a **30 %** | a **10 %** |
|---|---|---|---|---|---|---|
| elite-health, `medgemma:27b` Q8 (GPU 0, Ollama) | 2,94 | **26,1 tok/s** (prompt 388) | ~105 tok/s ≈ 375 k/h | **7,8** | 26 | 78 |
| elite-health, `medgemma-1.5-4b` · `qwen3-vl:8b` · `guardian` (GPU 1) | 2,94 | **170 · 131 · 146 tok/s** | ~600 tok/s ≈ 2,1 M/h | **1,4** | 4,6 | 14 |
| elite-health, `granite4.1:30b-q4` (GPU 1) | — | **41,6 tok/s** (prompt 1 510) | ~165 tok/s | 5,0 | 17 | 50 |
| elite-health-2, `baichuan-m2` INT4 (½ GPU 1, vLLM) | 1,47 | **37,8 tok/s** | ~150 tok/s ≈ 540 k/h | **2,7** | 9 | 27 |
| elite-health-2, `lingshu-i-8b` (½ GPU 1, vLLM) | 1,47 | **46,8 tok/s** | ~190 tok/s | 2,2 | 7 | 22 |
| elite-health-2, `lingshu-32b` FP8 (GPU 0, vLLM) | 2,94 | **20,8 tok/s** | ~85 tok/s ≈ 300 k/h | **9,8** | 33 | 98 |
| m3-va, `baichuan-m3` INT4 TP=4 (4 L20, vLLM) | 9,89 (spot 1,98) | **68,7 tok/s** (+ ~1,5 k tokens de raciocínio/resposta) | ~275 tok/s ≈ 1 M/h | **10** (spot 2) | 33 | 99 |
| Model Studio `qwen-plus` (referência) | — | 42,6 tok/s | — | ~1,2 out / 0,4 in | — | — |
| Model Studio `qwen-plus` (referência de mercado) | — | — | ~1,2 out / 0,4 in | — | — |
| medpubr (CPU, embed/rerank) | 0,55 | ~2 M tokens embed/h | **0,3** | 0,9 | 2,8 |

Leituras que importam:
- **A GPU própria só fica mais barata que a API acima de ~30 % de ocupação.** Abaixo disso, o correto é o que a cadeia já faz: síntese na API (coberta pelo SP) e GPU só para o que a API não faz (modelo médico, multimodal, dado que não pode sair, excelência).
- **Tokens de entrada** custam ~1/8 do de saída nos modelos residentes (prompt eval é 5–10× mais rápido). Precificar in/out separado, como o mercado.
- **O M3 é caro por token e barato por decisão**: a 30 % de ocupação, uma resposta com 1,5 k tokens de raciocínio + 0,5 k de texto custa ≈ **US$ 0,07** (US$ 0,014 em spot). Vende-se como "segunda opinião", não como chat. O raciocínio fica em `reasoning_content`; só o `content` vai ao usuário.
- **Medição real vs. referência:** o M3 ficou **acima** da referência (68,7 vs. ~30 tok/s por fluxo esperado num MoE INT4 TP=4); medgemma Q8 no Ollama ficou **abaixo** (26 vs. 60). Se a produção clínica exigir mais do medgemma, o caminho é servi-lo em vLLM (Q8/FP8) em vez de Ollama.

---

## 4. Tabela de venda — ativo.tech "Nuvem privada de IA médica"

Posicionamento: *tokens que não saem do Brasil, com modelo aberto que você pode auditar, e verificação de citação incluída.* Preço acima de API pública (Qwen/GPT) porque o produto é outro: residência, modelo médico, trilha, abstenção.

### 4.1 Por token (API `api.dodr.ai` / gateway ativo.tech) — US$ por 1 M tokens

| Plano de modelo | Entrada | Saída | Margem a 30 % de ocupação | Comparável público |
|---|---|---|---|---|
| **Rápido** (`qwen-plus` via BeansTech, com PII e trilha) | 1,00 | 3,00 | > 60 % (custo coberto pelo SP) | Qwen intl 0,40 / 1,20 |
| **Clínico** (`medgemma:27b`, `granite`, `guardian`) | 8,00 | 40,00 | ~ 0 % a 30 %, > 70 % a 60 % | sem equivalente público hospedado no BR |
| **Leve** (`medgemma-1.5-4b`, `qwen3-vl:8b`, `lingshu-i-8b`, `baichuan-m2`) | 2,00 | 10,00 | ~ 30 % a 30 % | GPT-6 mini ~0,15 / 0,60 |
| **Multimodal** (`lingshu-32b`) | 15,00 + 0,01/imagem | 60,00 | ~ 0 % a 30 % | Gemini 3 Flash imagem ~0,10/img |
| **Excelência** (`baichuan-m3`) | 20,00 | 90,00 | ~15 % a 30 % (60 % com spot) | Claude Opus 5 15 / 75 |
| **Evidência verificada** (cadeia completa, por resposta) | **US$ 0,50 / resposta** (≤ 4 k tokens) | — | > 70 % acima de 25 k resp./mês | nenhum |
| Embedding/rerank BR (`medpubr`) | 0,50 | — | > 40 % | text-embedding-v4 0,07 |

### 4.2 Assinaturas (o que o ativo.tech deve vender de fato — ocupação previsível)

| Plano | Preço | Inclui | Custo estimado | Margem |
|---|---|---|---|---|
| **Profissional** | R$ 149/mês | 500 respostas com evidência · BeansTech ID · histórico | ~R$ 25 (rateio) | ~80 % |
| **Clínica** (até 10 profissionais) | R$ 990/mês | 5 000 respostas · 200 imagens · API 100 k tokens clínicos | ~R$ 250 | ~75 % |
| **Instituição** | R$ 9 900/mês | 60 000 respostas · 3 000 imagens · 2 M tokens clínicos · SSO · relatório de auditoria | ~R$ 3 200 | ~65 % |
| **GPU dedicada** (1× L20 reservada, modelo à escolha, 24×7) | **US$ 3 900/mês** | 720 h de uma L20, sem fila, VRAM isolada, modelo e versão fixados | US$ 2 150 (½ gn8is-2x) | ~45 % |
| **GPU dedicada 4× L20** (M3 ou modelo próprio, TP=4) | **US$ 12 900/mês** | máquina inteira em SG ou VA; imagem própria; snapshot | US$ 7 250 | ~44 % |
| **Excelência sob demanda** | US$ 0,25/decisão | M3 por resposta, sem reserva | ~US$ 0,05 | ~80 % |

Conversão R$ 5,3/US$ nos custos; os planos em R$ absorvem câmbio até ~R$ 6,2 sem perder margem.

### 4.3 Regras comerciais que protegem a margem
1. **Sem plano ilimitado.** Tudo tem teto de tokens ou respostas; excedente cobra a tabela 4.1.
2. **GPU dedicada só com contrato mínimo de 3 meses** — o que permite comprar o Savings Plan (−16,4 % verificado no console) e subir a margem para ~55 %.
3. **Excelência não entra em plano fixo** abaixo de "Instituição": é o item de maior custo unitário.
4. **Ocupação-alvo 30 %** nas GPUs compartilhadas; acima de 60 % sustentado, abre-se a próxima máquina (estoque `gn8is-2x` e `4x` em SG-a, VA-a).
5. Enquanto a ocupação real for < 10 % (hoje: 16 requisições/dia), **elite-health-2 e m3-va ficam desligadas fora de benchmark/demonstração** (`StopCharging`) — a tabela acima só fecha com clientes assinados.

### 4.4 Ponto de equilíbrio da frota atual (3 máquinas ligadas 24×7 ≈ US$ 15 800/mês + BR ≈ US$ 2 000)
- 2 contratos "GPU dedicada 4×" **ou**
- 1 "GPU dedicada 4×" + 5 "Instituição" **ou**
- 60 clínicas + 300 profissionais.
Abaixo disso, manter só a elite-health e ligar as outras sob demanda.

---

## 5. O que falta para vender (ordem)
1. **Medir throughput real** (script `deploy/bench-gpu.sh`) quando M2/Lingshu/M3 subirem — substitui os `[ref]` desta tabela.
2. **Gateway de cobrança**: `api.dodr.ai` com chave por tenant (Keycloak `client_credentials`), contagem de tokens e cota (`auth_audit`/`api_keys` no PolarDB) — 2–3 dias.
3. Página `/nuvem-privada` no ativo.tech com as tabelas 4.1/4.2 (o site vivo está em Cloudflare Pages; o repositório local é o MVP antigo — decidir onde vive o código).
4. Benchmark cego PT-BR (RAGMED §11) para poder dizer qualquer coisa sobre qualidade; até lá, a venda é de infraestrutura e método, não de acurácia.
