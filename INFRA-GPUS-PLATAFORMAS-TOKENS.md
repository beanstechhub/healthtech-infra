# Acesso às GPUs, Distribuição às Plataformas, Roteamento e Venda de Tokens
### A arquitetura da frota BeansTech — como tudo se conecta e como se cobra
**Data: 28/09/2026 · Valido: 11 modelos em produção, 3 regiões, 4 plataformas + API**

---

## 1. A frota GPU (quem serve o quê)

| Instância | Tipo | Região | Serve | Token KMS |
|---|---|---|---|---|
| **m3-va** | ecs.gn8is-4x.16xlarge · 4× L20 (192 GB) | us-east-1 (Virgínia) | Baichuan-M3-235B :8000 | M3_API_TOKEN |
| **elite-va** | 2× L20 | us-east-1 | MedGemma-27B :8001 · Lingshu-32B :8002 · AntAngelMed :8000 | GPU_GATEWAY_TOKEN / GPU2_GATEWAY_TOKEN / ANTMED_API_TOKEN |
| **flash-va** | ecs.gn9gc-8x.64xlarge · 8× RTX PRO 5000 72G (587 GB) | us-east-1 | Granite-4.1 :8002 · Guardian :8003 · MedGemma-4B :8004 · Lingshu-I :8005 · M2 :8006 · Theia :8007 · **Hunyuan3D :8009** | GPU_GATEWAY_TOKEN / GPU2_GATEWAY_TOKEN / FLASH_API_TOKEN |
| **hy4-sz** | 8× RTX PRO 5000 72G | cn-shenzhen (Shenzhen) | **Hy4-Preview-780B** :8001 (llama.cpp + patch hyv4) | HY4_TOKEN |
| **br-apps** | g9i.2xlarge | sa-east-1 (São Paulo) | Caddy TLS + apps Next.js + shim Ollama | (RAM role btech-ecs-runtime) |
| **br-db / br-es / medpubr** | r9i | sa-east-1 | PostgreSQL · Elasticsearch (RagJur) · modelos CPU + **remoção de PII** | — |

**Como criar um nó novo** (receita comprovada — usada no m3-va e hy4-sz): script em `deploy/gpu-*/create-*.sh` → `aliyun ecs RunInstances` com UserData (docker + nvidia toolkit + aliyun CLI) → token no KMS (`deploy/kms-put.sh NOME --generate 36`) → vLLM como unidade systemd (`/etc/systemd/system/vllm-*.service`) → security group liberando a porta **apenas** para o EIP do br-apps (43.118.160.51) e o IP dev. Preço de referência medido (on-demand us-east-1): gn9i-2x (2× RTX PRO 6000, 192 GB) = US$ 8/h.

## 2. Distribuição às plataformas (como a resposta chega ao usuário)

```
Usuário → https://chatmed.beanstech.ai (Caddy, TLS, sa-east-1)
        → container ht-chatmed-next (Next.js standalone :4077)
        → POST /api/chat {model, messages, attachment}
        → escolha de rota:
            granite-guardian → JSON direto (classificador)
            baichuan-m3      → resposta inteira + stream simulado (heartbeat + typewriter)
            demais 9 modelos → SSE token-a-token (node:http → TransformStream)
        → vLLM/llama.cpp no nó GPU (token do KMS via /etc/healthtech/<app>.env)
```

- **Fluxo de dados LGPD**: o dado identificante é removido no Brasil (medpubr, São Paulo) **antes** de cruzar a fronteira; às GPUs chega o caso despersonalizado. Latência SP→Virgínia: 114 ms.
- **Publicação**: `deploy/acr-build.sh <app>` (build+push ACR) → `deploy/ecs-deploy.sh <app>` (renderiza env do KMS, docker pull, recria container, grava site Caddy, health check). Catálogo de apps/portas: `deploy/apps.tsv`.
- **Mesma API para todos os portais**: dodr.ai, exame.tech, prontuario.tech, drogaria.tech etc. usam o mesmo contrato — só muda o domínio no Caddy.
- **Compatibilidade Ollama**: shim em br-apps:8080 (`deploy/br-apps/ollama-shim.py`) traduz o formato Ollama para o vLLM da frota — apps legados rodam sem alteração.

## 3. Roteamento de modelos (quem decide qual modelo responde)

- **Na UI (chatmed)**: o usuário escolhe o chip — 11 modelos, os de visão marcados com 👁; imagem anexada troca automaticamente para um modelo de visão.
- **Na cadeia institucional (portais /decisao)**: ordem fixa de 6 camadas — PII removida (BR) → Guardião (classifica entrada) → modelo clínico por papel (M3 excelência / MedGemma-4B triagem / Granite síntese) → Guardião saída → citação verificada → trilha de auditoria gravada.
- **Quirks de modelo tratados na rota** (a camada de engenharia que ninguém vê): MedGemma separa raciocínio com marcador interno (extraído); M3 tem bug de stream no vLLM (stream simulado); Hy4 precisa `/no_think` no início; Guardian não aceita system prompt e tem max_model_len 2048. A plataforma absorve o modelo — o cliente nunca vê isso.
- **Streaming**: SSE com eventos `{start}`, `{reasoning}` (indicador 🧠), `{delta}` (texto ao vivo) e `{meta}` final (fontes, tokens, latência, trilha de 6 camadas).

## 4. Venda de tokens (como se cobra)

**Dois modelos comerciais, mesma frota** (o vídeo "Tokens e API" da série):

1. **Plano de tokens (assinatura)**: pacote mensal com volume incluso, preço por token reduzido — para operação contínua (hospital, operadora, farmacêutica). Previsibilidade; escalas de faixa.
2. **Pagamento por API (uso)**: pague por token consumido, sem compromisso — para integrar, testar, escalar por demanda. Sem lock-in.

**Parâmetros de custo reais** (base para precificar): o M3 entrega ~69 tok/s por fluxo (~275 tok/s em lote) → ~500 respostas/hora por nó; uma resposta típica consome ~2.500 tokens (1.900 de raciocínio + 600 de resposta). O gn9i-2x de 192 GB custa US$ 8/h → **um cliente médio (R$ 30 mil/mês) cobre o nó inteiro**; o custo marginal por resposta em modelos leves (Granite/MedGemma-4B) é fração de centavo.

**Governança de cobrança**: cada resposta já carrega a trilha com `tokens` contados (prompt/completion/total) — a medição para faturar **é a mesma trilha de auditoria** que o cliente exige. Um sistema, duas funções: provar e medir.

---
*Referências operacionais: `deploy/env.sh` (IDs e EIPs), `deploy/apps.tsv` (catálogo), `deploy/kms-put.sh` (segredos), `GUIA-WAN-VIDEO-SOTA.md`, `INVENTARIO-FARMA-MODELOS.md` (stack do nó farmacêutico). Tudo verificado em produção em 28/09/2026: 11/11 modelos respondendo com streaming.*
