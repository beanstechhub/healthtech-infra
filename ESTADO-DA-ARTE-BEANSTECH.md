# Beanstech — Estado da Arte da Plataforma
**Documento master · 27/09/2026 · fonte única de verdade da infraestrutura**

---

## 1. Mapa da frota

### GPUs (Alibaba Cloud)

| Host | IP | Região | Hardware | Uso | Serviços (porta) |
|---|---|---|---|---|---|
| **flash-va** | 47.85.207.155 | us-east-1 | gn9gc-8x (8× L20N 72G) | 153/587 GB | granite-4.1 (8002), granite-guardian (8003), medgemma-4b (8004), lingshu-i-8b (8005), baichuan-m2 (8006), theia (8007), **hunyuan3d** (8009), qwen3-embedding (8010), **compliance deepfake** (8011, 132 ms) |
| **elite-va** | 47.85.187.149 | us-east-1 | gn9gc-4x.32x (4× L20N 72G) | 235/293 GB | **medgemma-27b** (8001), lingshu-32b (8002), antangelmed (8000, TP2) |
| **m3-va** | 47.85.201.160 | us-east-1 | gn8is-4x (4× L20) | ~135 GB | **Baichuan-M3-235B-INT4** (8000, TP4) — camada de excelência |
| **hy4-sz** | 47.112.128.3 | cn-shenzhen | gn9gc-8x (8× L20N 72G) | 467/587 GB | **Hy4-preview 780B Q4_K_M** (8001, llama.cpp — fora da órbita Z.ai/Tencent) |

Desativados: hunyuan-ocr (crash-loop no profiling do encoder); GLM-5.3-Flash self-host (incompatível com SM120 — roda via Model Studio).

### CPU (Brasil, ap-southeast-1)

| Host | Papel |
|---|---|
| **br-apps** (EIP 43.118.160.51, g9i.2xlarge) | Caddy ~35 vhosts · ollama-shim :8080 (débito de tokens) · tokens-vending :4095 (BeansMed) · healthdash :4060 · ~20 containers de portais |
| **br-db** (172.16.1.52) | PostgreSQL 17 |
| **br-es** (172.16.1.53) | Elasticsearch 9.5 — RagJur, 100M decisões |
| **medpubr** (172.16.0.21) | modelos médicos CPU |
| ECS proxy (43.110.16.225, us-west-1) | túnel SOCKS GitHub (IP fixo) |

### Acesso
- SSH GPU: keypair `beanstech-gpu-va` (KMS `SSH_KEY_GPU_VA`) — porta 22 liberada só para br-apps (jump fixo) e IP dev (dinâmico)
- SG `btech-blackwell-va` (sg-0xi5g0cw9xpydb0cmozu): 8000-8011 de br-apps/dev
- API Alibaba indisponível localmente → operar via br-apps (role RAM `btech-ecs-runtime` lê KMS) ou túnel SOCKS

## 2. Portais e produtos no ar

| Domínio | O que é |
|---|---|
| **beansmed.com.br** | BeansMed — ponto de venda de tokens (Pix, keys bth_*, excelência 5 tokens/chat 1) |
| chat.beanstech.ai/tokens | venda de tokens (alias) + dashboard 3D (Three.js, Hunyuan3D via /api/3d) |
| dodr.ai · app.dodr.ai · beanshealth.com.br · exame.tech · prontuario.tech · drogaria.tech · drhealth.tech · portaldodentista.ai · petiq.tech | 8-9 portais de saúde com **/decisao** |
| health.beanstech.com.br | healthdash — status de tudo (43 checks) |
| id.beanstech.com.br | Keycloak (OIDC) |
| cms.beanstech.com.br | Directus (leads) |
| ragmed.ai / ragjur | coleta de corpora médicos + 100M decisões |

## 3. Roteamento (resumo — detalhe em ROTEAMENTO-EXCELENCIA.md)

Shim br-apps:8080 converte Ollama-API → vLLM. 16 rotas. Cadeia /decisao: PII → guardian → síntese → citação → **excelência M3-235B** → auditoria. Clientes `bth_*` pagam por request (5 tokens excelência, 1 chat) — saldo em SQLite WAL.

## 4. Venda de tokens (resumo — detalhe e cálculo completo em VENDA-TOKENS-CALCULO.md)

Starter R$19,90/100 · Pro R$79/500 · Clínica R$249/2.000. Margem 96-97%. Teto da frota: 2-4,5M requests/mês. Break-even da frota consolidada: ~1.400 pacotes/mês (0,16% do mercado médico). Pendência única: chave Pix real.

## 5. GitHub e código

- Org **btechbrasil** (Enterprise Beans-Tech): 93 repos privados — 5 verticais + produtos + 4 placeholders
- Migração completa de beanstechhub/beanstechbr (27/09) — orgs antigas prontas para arquivar
- Legados GCP mapeados na descrição de cada repo (cloudbuild.yaml, hashicorp/google, .gcloudignore)

## 6. Segredos e segurança

- KMS Singapura (perfil beanstech-sg): 121 secrets; hosts leem via RAM role
- Tokens de inferência em `/usr/local/etc/tokens/` (600) — shim carrega dinamicamente das ROUTES
- Admin do vending: `VENDING_ADMIN_TOKEN` (idem) — comparação HMAC
- Mimosa scan 27/09: 381 findings (159 high) — SSRF nas rotas /decisao replicadas e cmd-inj em scripts de treino são as famílias principais; fixes aplicados em eval-suite e collect_hf

## 7. Domínios — 118+

Cloudflare 77-78 zonas (41 com conteúdo) · Alibaba 41 · Hostinger 41 · todos sondados, 0 quebrados.

## 8. Crédito e custos

- Crédito promocional: **US$ 49.036** restantes (PostPaid) — ~15 dias na frota atual
- Plano consolidado (mantido): comprar gn9gc-4x.32xlarge (US$13.318/mês, M3+granites) + gn9gc-2x.16xlarge (US$6.634/mês, pequenos) em subscription; liberar flash-va e m3-va
- hy4-sz fica (780B não cabe em menos) · hy.cloud + ZPE = estratégia Tencent (ONE-PAGER-BEANSTECH-TENCENT-EN)

## 9. Dashboards das verticais

| Vertical | Dashboard | Estado |
|---|---|---|
| Saúde/plataforma | health.beanstech.com.br | 43 checks: portais, GPUs (elite/flash/m3/hy4), Brasil (tokens BeansMed, shim, ES, Keycloak, Directus, PolarDB) |
| Tokens (BeansMed) | `GET beansmed.com.br/admin/stats` | vendas, receita, consumo, top clientes |
| 3D/chat | chat.beanstech.ai | Three.js, 9 modelos, 3D por drag&drop |
| Legal/finance/afins | cobertos pelo healthdash (APIs) + /admin/stats | — |

## 10. Pendências abertas

1. **Chave Pix real** (1 comando) — único bloqueio de vendas
2. Wire GigaPath / Boltz-2 / Evo-2 (baixados, sem servir)
3. Whisper (faster-whisper) e qwen3-tts (campanha Wan precisa da locução)
4. Conciliação automática de Pix (webhook/extrato)
5. Limpeza GCP nos produtos migrados
6. Rate-limit por key no shim (fase 2)

## 11. Índice de documentos

| Doc | Assunto |
|---|---|
| VENDA-TOKENS-CALCULO.md | tudo da venda de tokens |
| ROTEAMENTO-EXCELENCIA.md | rotas, cadeia /decisao, runbooks |
| MARKETING-QWEN-WAN.md | campanha Qwen × Wan 3.0 |
| MIGRACAO-GITHUB-BTECHBRASIL.md | migração 93 repos |
| PARECER-CFM-APOIO-DECISAO-CLINICA.md | parecer jurídico do /decisao |
| ONE-PAGER-BEANSTECH-TENCENT-EN.(md\|pdf) | JV Tencent US$ 350M |
| ESTUDO-PARCERIA-ZAI-TENCENT-DATACENTER.md · ZPE-DATACENTER-ARCHITECTURE-PARTNERS-EN.md | estratégia ZPE/hy.cloud |

---

*Beans Tech. Brasileiro. Sem ganância. Com fé.*
