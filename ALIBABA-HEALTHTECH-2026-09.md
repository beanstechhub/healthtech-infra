# Healthtech na Alibaba Cloud — arquitetura, deploy e reprecificação

**Data:** 2026-09-13 · **Conta:** `beanstechbrasil@gmail.com` (UID 5838574299307916) · **Substitui** o deploy GCP (Cloud Run/Cloud Build/Secret Manager) de todos os `cloudbuild.yaml` desta pasta.
**Complementa:** [`../REBUILD-ALIBABA-2026-09.md`](../REBUILD-ALIBABA-2026-09.md) (conta, Cloudflare, e-mail) · [`RAGMED-PORTAIS-DATASETS-FLUXOS.md`](RAGMED-PORTAIS-DATASETS-FLUXOS.md) (produto DoDr/RagMed) · [`../alibaba/dados/SERVIDOR-GPU-GUIA-2026-09-13.md`](../alibaba/dados/SERVIDOR-GPU-GUIA-2026-09-13.md) (GPU).

> Tudo abaixo foi **verificado por API em 2026-09-13** ou **executado nesta sessão** (marcado ✅). Preços vêm da fatura real de setembro (`QueryInstanceBill`), não de tabela.

---

## 1. Decisões e o que mudou

| Pedido | Decisão | Motivo |
|---|---|---|
| Deploy em **SAE** | ❌ **Não existe SAE em São Paulo** (`DescribeRegions`: só Singapura, Jacarta, Tóquio, Frankfurt, EUA e China). Sites vão no **ECS `br-apps`** (Caddy + Docker), imagens no **ACR** | Dado clínico e portais ficam no Brasil; SAE em Singapura colocaria o app fora do país e o SP universal não cobre SAE |
| **ACR** | ✅ ACR Enterprise `btech` (Singapura) — namespace `healthtech` criado, ACL liberada para `br-apps`, dev e GPU | Já pago (US$ 555/mês — ver §6, candidato a downgrade) |
| **Model Studio** | ✅ Camada 2 (síntese) via DashScope intl OpenAI-compatible, chave `DASHSCOPE_API_KEY` no KMS | Queima os SPs pagos (LLM Inference US$ 5.000; AI GP US$ 1.000/mês) |
| **PolarDB MySQL para senhas** | ✅ Cluster `pc-0jxewaahd2vjs1w9p` (sa-east-1, pré-pago até 2027-09-13): database `ht_auth` + conta `ht_auth` + schema de identidade (Argon2id, sessões, chaves de API, auditoria LGPD) | Credenciais de **usuários finais** ficam aqui; segredos de **infra** ficam no KMS |
| **KMS 3.0 como segredo** | ✅ RAM role `btech-ecs-runtime` anexada às ECS; `kms-env` renderiza `/etc/healthtech/<app>.env` na hora do deploy. **Nenhum AK/SK ou senha em unit/Dockerfile** | Corrige o anti-padrão encontrado: `alirealty.service` tinha senha do Postgres e `AUTH_SECRET` em texto puro |
| **RagJur no ECS Brasil = 1ª camada** | ✅ Elasticsearch 9.5.3 no `br-es` (172.16.1.53) é a recuperação; senha guardada no KMS (`ESBR_SELFHOSTED_PASSWORD`) | Sem trecho recuperado, nenhum modelo é chamado |
| **Postgres "no outro ECS"** | ✅ PostgreSQL 17 já existia no `br-db`; criados 8 roles/DBs `ht_*` com senhas geradas → KMS | Um role por app, `pg_hba` restrito à VPC |
| **2 ECS GPU Singapura com modelos médicos** | ✅ `elite-health` existente + **`elite-health-2`** clonada por imagem customizada (mesmos 5 modelos residentes + whisper + chexagent) | Imagem clona 73 GB de pesos afinados em minutos; bootstrap antigo está deprecated |
| **CPU Brasil com modelos médicos** | ✅ `medpubr` (r9i.2xlarge, 172.16.0.21): BGE-M3 embeddings, bge-reranker-v2-m3, PII/NER PT-BR, verificação de suporte — substitui o stub `api.py` | Dado clínico não sai do país para embedding/rerank/PII |
| **Reformular os sites** | ✅ Camada de IA unificada: `shared/evidence-chain` (5 camadas) + env padrão; sites já usavam `OLLAMA_*`/`QWEN_*` → apontados para a stack nova sem tocar em UI | Redesign visual é etapa seguinte, por portal |

---

## 2. Arquitetura (estado após esta sessão)

```
Cloudflare = só DNS (registro A, sem proxy — decisão 2026-09-14: tudo no ECS)  ──►  sa-east-1 · VPC beanstech-br 172.16.0.0/16
                                      ├─ br-apps   g9i.2xlarge  43.118.160.51   Caddy = borda única (TLS Let's Encrypt, HTTP/3, zstd, timeouts, cache de estáticos) → docker ht-<app> 127.0.0.1:41xx   ✅ 8 sites no ar (ver §3)
                                      ├─ br-db     r9i.2xlarge  172.16.1.52     PostgreSQL 17 · ht_dodr ht_exame ht_prontuario ht_drogaria ht_beanshealth ht_portaldodentista ht_drhealth ht_petiq
                                      ├─ br-es     r9i.4xlarge  172.16.1.53     Elasticsearch 9.5.3 + Kibana (RagJur/RagMed), HTTPS c/ CA própria ← camada 1
                                      ├─ medpubr   r9i.2xlarge  172.16.0.21     :8300 BGE-M3 · rerank · PII/NER · /v1/support           ← camada 5a
                                      └─ PolarDB MySQL 8.0 (2 nós g2.large)     ht_auth (identidade, senhas Argon2id, api_keys, auditoria) ← camada 3
KMS 3.0 alias/btech (ap-southeast-1)  ← camada 4: RAM role btech-ecs-runtime → kms-env → /etc/healthtech/<app>.env
ap-southeast-1
  ├─ Model Studio / DashScope intl   qwen-plus / qwen-max / GLM-5.3 (SPs pagos)                                       ← camada 2
  ├─ elite-health    gn8is-2x.8xlarge 2×L20  8.222.169.230:8080 (token)  GPU0 medgemma:27b+1.5-4b+whisper · GPU1 granite4.1+guardian+qwen3-vl  ← camada 5b
  ├─ elite-health-2  gn8is-2x.8xlarge 2×L20  i-t4n2xmqbiwu59fpl2omj  43.98.194.204:8080 (réplica por imagem m-t4n7upyvb0d051s5zaw9; token GPU2_GATEWAY_TOKEN) ✅ criada
  └─ ACR EE btech · namespace healthtech · btech-registry.ap-southeast-1.cr.aliyuncs.com/healthtech/<app>:<sha>
```

### Cadeia anti-alucinação (ordem fixa, `shared/evidence-chain/index.ts`)

1. **RagJur/RagMed** — PII removida (medpubr) → BM25 + kNN(BGE-M3) no `br-es` com filtro `access_scope` antes da recuperação → rerank. `< 2` trechos ⇒ `insufficient`, **nenhum modelo é chamado**.
2. **Model Studio** — `qwen-plus` sintetiza **só** sobre os trechos, saída JSON com `cites[]` por afirmação.
3. **PolarDB MySQL** — tenant, usuário, chave de API, orçamento mensal: quem pode perguntar o quê e quanto custa.
4. **KMS 3.0** — nenhuma credencial em código; env renderizado no host pela RAM role.
5. **Ferramenta robusta** — `medpubr /v1/support` verifica cada afirmação contra os trechos citados (reranker como NLI aproximado); afirmações sem suporte são **removidas**; conflito escalona para `medgemma:27b`/`granite-guardian` na GPU como **revisão**, nunca como fonte.

Contrato de resposta: o JSON do §9 do RAGMED (claims + evidência + `status`), agora com `layers{}` e `pii_redacted`.

---

## 3. Ferramental (`healthtech/deploy/`)

| Script | Função | Estado |
|---|---|---|
| `env.sh` | IDs fixos (instâncias, VPC, ACR, KMS, PolarDB) + `ecs_run` (Cloud Assistant, sem SSH) | ✅ |
| `kms-put.sh NOME valor\|-\|--generate` | cria/versiona segredo no KMS, chave alias/btech, nunca imprime | ✅ |
| `instance/kms-env` + `instance/bootstrap-host.sh` + `host-bootstrap.sh` | instala aliyun CLI (EcsRamRole), `kms-env`, `acr-login` nos hosts | ✅ br-apps, medpubr, br-db, gpu1 |
| `pg-create-db.sh <app>` | role + DB + extensões no `br-db`, senha → KMS `HT_<APP>_DB_PASSWORD` / `_DATABASE_URL`, linha `pg_hba` por app | ✅ 8 apps |
| `polardb-auth.sql` + `polardb-init.sh` | schema de identidade aplicado via `br-apps` (endpoint privado) | ✅ 6 tabelas, 8 tenants |
| `apps.tsv` + `apps/<app>.secrets` | catálogo (contexto, porta, domínios) e manifesto `ENV=SEGREDO_KMS` / `ENV:=literal` | ✅ 8 apps |
| `acr-build.sh <app>\|--all` | build linux/amd64 + push `:sha` e `:latest` | ✅ |
| `ecs-deploy.sh <app> [tag]` | KMS→env, pull, recria container em `127.0.0.1:41xx`, vhost Caddy com TLS automático, health check | ✅ |
| `cf-repoint.sh <domínio>` · `cf-proxy.sh <domínio> on\|off` | apex+www → A `43.118.160.51` **DNS only** (padrão); `PROXIED=true` ou `cf-proxy.sh on` religa a nuvem laranja se um dia for preciso | ✅ 8 zonas em DNS only; TLS é o do Caddy |
| `medpubr/api.py` + `medpubr/install.sh` | serviço CPU BR (FastAPI/uvicorn, systemd) | ✅ instalado; BGE-M3 (2.598 s) e reranker (1.307 s) carregados; NER PT-BR baixando (download HF→SP ≈ 3 MB/s) |
| `gpu2/create-gpu2-sg.sh image\|create\|token\|smoke` | 2ª GPU por imagem da `elite-health` | ✅ imagem + instância `i-t4n2xmqbiwu59fpl2omj` (43.98.194.204); modelos re-verificando no 1º boot, warm-up agendado |

Fluxo por site: `./acr-build.sh dodr-site && ./ecs-deploy.sh dodr-site && ./cf-repoint.sh dodr.ai`.

### Sites no ar (verificados direto na ECS em 2026-09-14, HTTP 200, cert Let's Encrypt válido até 2026-12-12)

| App | Porta | Domínios | DB | Estado |
|---|---|---|---|---|
| dodr-site | 4100 | dodr.ai | ht_dodr | ✅ (BUILD_TARGET=site; rotas clínicas GCP pendentes §5) |
| exame-web | 4110 | exame.tech | ht_exame (API Hono depois) | ✅ (fix `js-yaml` ^3 p/ gray-matter) |
| prontuario-web | 4120 | prontuario.tech | ht_prontuario | ✅ |
| drogaria | 4130 | drogaria.tech | — | ✅ |
| beanshealth-web | 4140 | beanshealth.com.br | — | ✅ |
| dentista-web | 4150 | portaldodentista.ai | ht_portaldodentista | ✅ (estava 500 no GCP) |
| drhealth-web | 4160 | drhealth.tech | ht_drhealth | ✅ (estava 500 no GCP) |
| petiq-web | 4170 | petiq.tech | ht_petiq | ✅ (estava 500 no GCP) |

Todos os containers recebem o mesmo env padrão (`apps/_default.secrets`): GPU gateway + token, Model Studio, Elastic (https + CA montada em `/etc/healthtech/ca`), medpubr, PolarDB. Testado do `br-apps`: GPU responde (`medgemma-1.5-4b`), Model Studio responde (`qwen-plus`), Elastic `_cluster/health` ok com CA.

---

## 4. Segredos no KMS 3.0 (criados nesta sessão)

`HT_{DODR,EXAME,PRONTUARIO,DROGARIA,BEANSHEALTH,PORTALDODENTISTA,DRHEALTH,PETIQ}_DB_PASSWORD` e `_DATABASE_URL` · `HT_AUTH_MYSQL_PASSWORD` / `HT_AUTH_MYSQL_URL` (PolarDB) · `HT_DODR_AUTH_SECRET` · `HT_PORTALDODENTISTA_AUTH_SECRET` · `GPU_GATEWAY_TOKEN` (elite-health) · `GPU2_GATEWAY_TOKEN` (elite-health-2) · `ESBR_SELFHOSTED_PASSWORD` (Elastic br-es).
Já existiam e são reutilizados: `DASHSCOPE_API_KEY`, `MODELSTUDIO`, `CLOUDFLARE` (v2 = API token), `ALIBABA_AK/SK`.

Política: RAM role `btech-ecs-runtime` só tem `kms:GetSecretValue` + `cr:Pull*`. Rotação = `kms-put.sh` (nova versão) + `ecs-deploy.sh` (re-renderiza).

---

## 5. Pendências que bloqueiam funcionalidade (não infraestrutura)

| Item | Onde | O que fazer |
|---|---|---|
| **dodr.ai/web e portaldodentista/web usam GCP Healthcare API (FHIR/DICOM), Document AI, Speech-to-Text, endpoint Vertex MedGemma** (38 e 17 arquivos) | código | Deploy `BUILD_TARGET=site` sobe o portal público; as rotas clínicas precisam de substitutos: FHIR → Postgres `ht_dodr` (schema FHIR-lite) · DICOM → OSS + OHIF · Speech → whisper na GPU (`:8200`, abrir rota com token) · MedGemma → `medgemma:27b` no gateway |
| `beanshealth-site/api` (FastAPI, 168 agentes, google-adk + Vertex) | código | Trocar `google-adk`/Vertex por DashScope OpenAI-compatible; Cloud SQL → `ht_beanshealth`; Memorystore → Tair free tier ou Redis no br-apps |
| APIs Go/Hono (`exame.tech/api`, `prontuario.tech/api`, `petiq.tech/api`, `dodr.ai/api`, `portaldodentista/api`) | deploy | Mesmo pipeline (`apps.tsv` + manifesto com `DATABASE_URL=HT_<APP>_DATABASE_URL`); subdomínios `api.*` |
| **Credencial AWS vazada** em `beanshealth-site/web/cloudbuild.yaml` (`AWS_ACCESS_KEY_ID=AKIAZDCKH…`) e senhas em `PROXIMOS-PASSOS.md` (linhas 162–168) e `api/app/config.py` | repositório | Revogar na AWS, remover dos arquivos, apagar todos os `cloudbuild.yaml`/`.gcloudignore` |
| Índice `evidence-chunks-v1` no br-es ainda não existe (br-es tem só os julgados do RagJur) | dados | Pipeline de ingestão PCDT/Anvisa/SciELO do RAGMED §5 com `embedding` = BGE-M3 via `medpubr /v1/embed` (dense_vector 1024, cosine) |
| SG do br-apps não libera 8300/9200 de fora — correto; `medpubr` e `br-es` só na VPC | rede | Nada a fazer; os containers usam IPs privados via `--add-host` |

---

## 6. Reprecificação (fatura real de setembro → mês cheio)

Taxas derivadas de `QueryInstanceBill` 2026-09 (horas acumuladas ÷ valor): GPU **US$ 5,886/h**, `r9i.4xlarge` **≈1,04/h**, `r9i.2xlarge` **≈0,54/h**, `g9i.2xlarge` **≈0,42/h**. ESSD PL1 sa-east-1 200 GB = US$ 0,0557/h (API). Câmbio não aplicado (US$).

### 6.1 Infra que o healthtech usa (compartilhada com as outras verticais onde indicado)

| Recurso | Região | US$/mês | Cobertura | Observação |
|---|---|---|---|---|
| `elite-health` GPU 2×L20 | SG | **4.297** | PAYG (SP universal daria −16,4% no console) | 5 modelos residentes; carga medida ~0 até os portais ligarem |
| **`elite-health-2`** GPU 2×L20 (nova) | SG | **4.297** | PAYG | réplica: HA + 2× capacidade; **desligar fora do horário = −65%** (`StopInstance` com `StoppedMode=StopCharging` não cobra compute) |
| `br-es` r9i.4xlarge (Elastic RagJur/RagMed) | SP | 759 | SP universal (quando contratado) | compartilhado com legaltech |
| `br-db` r9i.2xlarge (Postgres 17) | SP | 391 | idem | compartilhado (alirealty + 8 DBs healthtech) |
| `br-apps` g9i.2xlarge (Caddy/Docker) | SP | 303 | idem | compartilhado (alirealty, useco2, 9 sites healthtech + Keycloak) |
| `medpubr` r9i.2xlarge (modelos CPU) | SP | 404 | idem | 100% healthtech |
| ESSD 4×100 GB (SP) + 2×200 GB (SG) | — | ~165 | SP universal cobre Cloud Disk | |
| Snapshot da imagem `elite-health-medical` 200 GB | SG | ~6 | — | manter para rebuild |
| PolarDB MySQL 2 nós g2.large (pré-pago 12 m) | SP | 218 (2.613,87/ano) | pago | staging Always-Free 2C8G não foi usado; este é o cluster real |
| ACR Enterprise Basic | SG | **555** | — | **candidato a corte**: ACR Personal é grátis e atende 8 repos; economia US$ 555/mês |
| Tráfego EIP (PayByTraffic ~US$ 0,12/GB SP) | — | ~30–80 | — | proporcional ao público |
| Model Studio (qwen-plus intl ≈ US$ 0,4/M in · 1,2/M out) | SG | **0 até esgotar SPs** | LLM Inference US$ 4.917 restantes · AI GP US$ 1.000/mês | ordem: cota grátis → pacote → SP → PAYG |
| Cloudflare (só DNS) · Direct Mail · KMS (27) · RAM/ActionTrail | — | ~30 | — | |
| Snapshots ECS (~300 GB usados, incremental) + OSS backup (~1 GB) | SP/SG | ~15 `[estimativa]` | — | §8 |

**Total com 2 GPUs (pedido):** ≈ **US$ 11.500/mês** (dos quais 8.594 são as GPUs).
**Alavancas imediatas:** parar `elite-health-2` fora do horário comercial (−2.800) · cortar ACR EE → Personal (−555) · liberar `iZt4nd4zowzp88kkw40xa0Z` (e-c1m2, ociosa em SG; grátis até 2026-12-01, depois ~US$ 60) · SP universal p/ compute BR **só após 30 dias de consumo medido** (§6 do REBUILD).
**Cenário enxuto (1 GPU sempre ligada + 2ª sob demanda 8h/dia útil):** ≈ **US$ 7.900/mês**.

### 6.2 Custo unitário para precificar o produto

Com a cadeia acima, uma resposta "supported" típica (1 pergunta → 20 trechos → rerank → qwen-plus ~3k tokens in / 600 out → 3 verificações):
- Model Studio: ~US$ 0,002 (coberto pelo SP → **0** até 2027-03)
- medpubr/ES/apps: custo fixo rateado; a 50 k respostas/mês ≈ US$ 0,03/resposta
- GPU (só escalonamento, ~10% das perguntas): 4.297 ÷ (0,1 × 50 k) ≈ US$ 0,86/resposta escalonada

**Custo marginal ≈ US$ 0,03–0,12 por resposta**; a GPU é o que define o piso. Preço de lista sugerido para API de evidência (`api.dodr.ai`): **US$ 0,50/resposta** ou plano profissional **R$ 149/mês** (500 respostas) — margem > 70% mesmo com a 2ª GPU ligada, desde que o volume passe de ~25 k respostas/mês; abaixo disso, a 2ª GPU deve ficar desligada.

---

## 7. Sequência restante

| # | Ação | Comando |
|---|---|---|
| 1 | Terminar builds/deploys: drhealth-web, exame-web, prontuario-web, petiq-web, dodr-site, dentista-web | `acr-build.sh <app> && ecs-deploy.sh <app> && cf-repoint.sh <domínio>` |
| 2 | `elite-health-2`: `gpu2/create-gpu2-sg.sh create && token && smoke` quando a imagem ficar `Available` | ver `gpu2/.image-id` |
| 3 | Borda única no ECS: EIP visível por design; proteção = Anti-DDoS Basic (grátis, automático no EIP) + security group + timeouts do Caddy. Mídia pesada (imagens/artigos) → OSS quando o volume justificar (egress EIP ≈ US$ 0,12/GB) | — |
| 4 | Ingestão da coleção inicial (PCDT + Anvisa + SciELO) no br-es com embeddings do medpubr | RAGMED §5 |
| 5 | Substituir GCP Healthcare/DocAI/Speech/Vertex nos apps `dodr` e `portaldodentista` | §5 |
| 6 | APIs (`api.*`) no mesmo pipeline; `beanshealth-site/api` para DashScope | `apps.tsv` |
| 7 | Revogar AWS key vazada; apagar `cloudbuild.yaml`/`.gcloudignore`; Code Security nos repos (vence 2026-10-07) | — |
| 8 | Medir 30 dias → decidir SP universal (compute BR) e SP para GPU; política de desligamento da GPU-2 | `QueryInstanceBill` |

---

## 8. Backup e restauração (configurado 2026-09-14)

| O quê | Como | Destino | Frequência / retenção |
|---|---|---|---|
| Discos das 4 ECS BR (sistema + dados, exceto o disco de 4 TB do Elastic) | política `sp-0jx3olklszfj65sbs6rk` | snapshots ECS (sa-east-1) | diária 03:00 BRT · 14 dias |
| Discos das 2 GPUs SG | política `sp-t4n6nq8skyjj05d22mpj` | snapshots ECS (ap-southeast-1) | semanal dom · 28 dias |
| `br-apps` ponto de restauração da borda | snapshot manual `s-0jxgltk4xaqm806hpcco` + imagem `elite-health-medical` p/ GPU | — | 30 dias |
| **PostgreSQL — contínuo (PITR)** | **pgBackRest 2.59**: `archive_mode=on`, WAL enviado ao OSS a cada segmento (≤ 5 min), full domingo + incremental diário, repo **cifrado AES-256 no cliente** (chave `PGBACKREST_REPO_CIPHER` no KMS), chave S3 do usuário RAM `pgbackrest-brdb` restrita ao prefixo | `oss://beanstech-backup-br/pgbackrest/` | contínuo · 4 fulls (≈ 4 semanas) |
| **PostgreSQL — dump lógico** (12 bancos + roles) | `backup-postgres`: `pg_dump -Fc` por banco + `pg_dumpall --globals-only` + SHA256SUMS (camada independente, restauração seletiva simples) | `oss://beanstech-backup-br/postgres/<data>/` | diária 03:30 BRT · 60 dias |
| Configuração dos 4 hosts (Caddy, manifestos `.secrets`, CA, units systemd, medpubr, compose do ES, postgresql.conf/pg_hba, crontab, inventário docker) | `backup-config` | `oss://beanstech-backup-br/config/<host>/` | diária 03:10 BRT · 90 dias |
| Elasticsearch (RagJur/RagMed) | snapshot nativo já existente | `oss://beanstech-es-backup/es-snapshots/` | (configurado antes desta sessão) |
| Ferramental de infra + docs | git | `github.com/beanstechhub/healthtech-infra` (privado) | a cada mudança |

Bucket `beanstech-backup-br`: São Paulo, privado, **versionamento ligado**, lifecycle faz a expiração. A RAM role dos hosts só tem `Put/Get/List` — **sem delete** (um host comprometido não apaga o histórico). Upload pelo endpoint interno (sem custo de tráfego). Os `.env` renderizados **não** são copiados: são reproduzíveis a partir do KMS.

### Restaurar

```bash
# 1) host inteiro: criar ECS a partir do snapshot/imagem, anexar RAM role btech-ecs-runtime, rodar deploy/host-bootstrap.sh
# 2) um banco:
ossutil64 cp oss://beanstech-backup-br/postgres/<data>/ht_dodr.dump /tmp/ && sudo -u postgres pg_restore -d ht_dodr --clean --if-exists /tmp/ht_dodr.dump
# 3) roles/senhas globais: zcat globals.sql.gz | sudo -u postgres psql
# 4) config de um host: ossutil64 cp oss://beanstech-backup-br/config/br-apps/<arquivo>.tar.gz /tmp/ && tar -xzf ... -C /  (depois: kms-env <app> para cada app e systemctl reload caddy)
# 5) apps: git clone healthtech-infra && ./acr-build.sh <app> && ./ecs-deploy.sh <app>   (imagens ficam no ACR)
```

**Ensaios de restauração executados em 2026-09-14:**
- Dump lógico: `ht_dodr` baixado do OSS → SHA-256 OK → `pg_restore` em banco temporário → estrutura idêntica → removido.
- **PITR (pgBackRest):** linha `antes` gravada → alvo T anotado → linha `depois` gravada → restore `--type=time --target=T` em cluster temporário na porta 5433 → contém **só `antes`** (`recovery stopping before commit of transaction 3592`) → cluster e diretório apagados, tabela de prova removida da produção. Script: `deploy/instance/pgbackrest-pitr-test.sh` (reexecutável).

Perda máxima de dados no `br-db` caiu de 24 h para ≈ 5 min (`archive_timeout=300`). Ainda é um nó só: réplica de streaming continua recomendada antes de carga clínica.

---

## 9. Identidade única — BeansTech ID (Keycloak) · configurado 2026-09-14

**Decisão:** login de todas as verticais num único IdP open-source, **Keycloak 26.4.7**, rodando no `br-apps` com o **PolarDB MySQL** como banco (database `keycloak`, conta própria). Sem Google, sem AWS, sem IDaaS (Alibaba não tem em SP). Os portais falam **OpenID Connect** com ele e nunca veem senha.

| Item | Valor |
|---|---|
| Endereço | `https://id.beanstech.com.br` (DNS only → Caddy → container `ht-keycloak` 127.0.0.1:4090) |
| Realm | `beanstech` — pt-BR, Argon2, senha ≥ 12, histórico 5, brute-force (8 falhas → espera crescente até 15 min), TOTP como ação padrão, passkeys (WebAuthn passwordless, rpId `beanstech.com.br`), termos de uso obrigatórios, eventos e admin-events auditados por 180 dias |
| Claims próprias (scope `beanstech`) | `vertical` (multi), `tenant`, `professional_registry` (CRM/CRO/OAB), `roles` |
| Papéis | `professional` · `patient` · `partner-api` · `vertical-admin`; grupos `healthtech/legaltech/fintech/proptech` |
| Clients | `dodr` (auth code + PKCE S256; callbacks `app.dodr.ai`, `dodr.ai`) · `ragmed-api` (client credentials para IAs parceiras, token 15 min) |
| Console admin | `/admin/*` só da VPC e do IP do dev (Caddy devolve 403 ao resto — testado de Singapura) |
| E-mail | Direct Mail `no-reply@ativo.tech` (SMTP 465) — **pendente a senha SMTP** (`DIRECTMAIL_SMTP_PASSWORD` no KMS está como placeholder; gerar no console) — até lá, sem e-mail de verificação/recuperação |
| Segredos (KMS) | `KEYCLOAK_DB_PASSWORD` · `KEYCLOAK_ADMIN_PASSWORD` (bootstrap `admin`, master realm) · `KEYCLOAK_REALM_ADMIN_PASSWORD` (`beanstech-admin`, temporária, exige troca + TOTP) · `KEYCLOAK_CLIENT_SECRET_DODR` · `KEYCLOAK_CLIENT_SECRET_RAGMED_API` |
| Backup | `backup-keycloak` 03:50 BRT → `oss://beanstech-backup-br/keycloak/<data>/` (export do realm com usuários) + PolarDB tem PITR gerenciado |
| Deploy | `deploy/keycloak/deploy.sh` (renderiza o realm com segredos do KMS → `--import-realm` só cria se não existir → `configure.sh` garante o scope `beanstech` de forma idempotente) |

**dodr.ai integrado:** `app.dodr.ai` (build `BUILD_TARGET=app`, porta 4101) usa Auth.js com provider `keycloak` (PKCE) no lugar do Google; schema Prisma aplicado em `ht_dodr`. Testado: `POST /api/auth/signin/keycloak` → `id.beanstech.com.br/.../auth?client_id=dodr&code_challenge_method=S256` → formulário "Entrar em BeansTech" (200). Login com usuário real depende só de criar o usuário (console admin ou API).

**Próximos portais:** criar um client por portal no realm (5 linhas no JSON ou no console), adicionar `AUTH_KEYCLOAK_*` ao manifesto e trocar o provider. Camada de identidade passa a ser uma só; as tabelas `users/sessions/api_keys` do `ht_auth` (§1) ficam substituídas pelo Keycloak — manter só `auth_audit` estendida e cotas.

**Métodos de entrada sem big tech:** e-mail+senha+TOTP · passkeys · código por e-mail (Direct Mail) · WhatsApp/SMS (CAMS, a ligar) · gov.br (broker OIDC, quando houver convênio) · certificado ICP-Brasil (X.509) · SSO do hospital (SAML/OIDC).

---

## 10. CMS — Directus 11.17.4 (`cms.beanstech.com.br`) · 2026-09-15

Decisão: **Directus** (Payload descartado por histórico; Strapi perde no SSO pago; SaaS descartados por custo/residência; WordPress descartado por superfície de ataque — o SEO vem do Next.js dos portais, não do CMS). Um CMS para todas as verticais: coleções com campo `site`, permissões por papel.

| Item | Valor |
|---|---|
| Runtime | container `ht-directus` (imagem espelhada no ACR, versão fixada) · `br-apps` 127.0.0.1:4080 · Caddy |
| Banco | Postgres `ht_cms` no `br-db` (PITR) |
| Mídia | `oss://beanstech-cms-media/media/` (SP, privado) via driver S3 pelo endpoint interno; usuário RAM `directus-cms` restrito ao bucket; **testado**: upload → objeto no OSS → download pelo Directus |
| Login | **só BeansTech ID** (client `directus`, OIDC, `AUTH_KEYCLOAK_ALLOW_PUBLIC_REGISTRATION=false` — o usuário precisa existir no Directus com o mesmo e-mail) + admin local `beanstechbrasil@gmail.com` (senha `DIRECTUS_ADMIN_PASSWORD` no KMS) |
| Segredos (KMS) | `DIRECTUS_KEY/SECRET/ADMIN_PASSWORD` · `DIRECTUS_OSS_AK/SK` · `HT_CMS_DB_PASSWORD` · `KEYCLOAK_CLIENT_SECRET_DIRECTUS` |
| CORS | os 9 domínios healthtech (ajustar ao adicionar verticais) |
| E-mail | Direct Mail — pendente senha SMTP (mesma pendência do Keycloak) |
| Regra de produto | artigo editorial é conteúdo, **não evidência**; o RagMed continua lendo só o acervo autorizado no Elastic. Um artigo pode referenciar `document_id`s do acervo |

Próximo passo editorial: modelar as coleções (`articles`, `authors`, `categories`, `sites`) e ligar o primeiro portal (dodr.ai `/blog`) via REST `GET /items/articles?filter[site][_eq]=dodr`.

---

## 11. Incidente 2026-09-15 · `br-apps` travado (~03:00–03:20 UTC)

Sintoma: TCP aceito pelo kernel, nada em user-space respondia (Caddy, Cloud Assistant). Sem OOM no journal. Estado do host: **sem swap**, 31 GB RAM, e além dos 10 containers healthtech + Keycloak, rodam ali advogandoai, minutatech, 3 containers e-arbitragem e **85 processos `coletor-*` (scrapers jurídicos)** — cenário clássico de livelock de memória. Recuperado com `RebootInstance --ForceStop` (tudo voltou em 20 s; Keycloak leva ~40 s a mais).

Mitigações aplicadas: swap 4 GB (`swappiness=10`) · `earlyoom` (mata python/node/next-server quando RAM < 5%, nunca caddy/docker/java/sshd) · **alarmes CloudMonitor** (memória > 90 %, CPU > 95 %, load5 > 16, 3 períodos) nos 4 hosts BR + **monitor HTTP** de `drogaria.tech`, `id.beanstech.com.br`, `app.dodr.ai` → `Default Contact Group` (beanstechbrasil@gmail.com).

**Recomendação estrutural:** tirar os coletores jurídicos do `br-apps` (uma ECS própria de legaltech ou o `br-es`, que tem 123 GB de RAM e 16 vCPU ociosos) — a borda dos 9 portais de saúde e do login do grupo não pode disputar memória com 85 scrapers.

---

## 12. Revisão das GPUs em Singapura · 2026-09-15

| | elite-health (`i-t4n52…`) | elite-health-2 (`i-t4n2xm…`) |
|---|---|---|
| Driver / Ollama | 595.84 / 0.33.3 | idem |
| Residentes | GPU0: medgemma:27b **Q8** (31,4 GB) + medgemma-1.5-4b · GPU1: granite4.1:30b-q4 + granite3-guardian:8b + qwen3-vl:8b — 42,5 + 38,1 GB | **estava errado**: o pull do 1º boot trouxe `medgemma:27b` **Q4** (17 GB) e a GPU1 vazia (`warm-models.sh` com aspa a mais → status 2). **Corrigido**: script reescrito; pull do Q8 (`unsloth/MedGemma-27B-it-GGUF:Q8_0`, ~30 GB) e warm-up rodando em background |
| Serviços | ollama×2, router (401 sem token ✅), whisper 200, nginx, chexagent (só arquivo) | idem + chexagent em execução |
| Uso real (24 h) | **16 requisições** ao router | **0** |
| Segurança | SG compartilhado OK: 22 só do IP do dev, 8080 só do `br-apps`, sem 3389; 80/443 abertos com nginx vazio (fechar ou usar) | idem |
| Manutenção | 9 updates pendentes, **reboot-required** | 11 updates |
| Disco / RAM | 74/197 GB · 8/247 GB | 63/197 GB · 5/247 GB |

Leitura: as duas máquinas custam **US$ 8.594/mês** para 16 requisições/dia — a carga ainda não existe porque os portais só agora ganharam login e evidence-chain. Recomendação mantida: **parar a elite-health-2 com `StopCharging`** até haver tráfego medido (a imagem `elite-health-medical` recria em 10 min; só volta a cobrar quando ligar), e agendar janela para `apt upgrade` + reboot da elite-health. Bootstrap do `pull-models.sh` deve fixar o digest/tag Q8 explícito para não repetir o problema do Q4.

---

## 13. Camada de excelência e novo time de modelos · 2026-09-15

**Decisão (usuário):** Baichuan-M3-235B é a camada de excelência; medgemma fica só na `elite-health`; a `elite-health-2` passa a servir Lingshu + Baichuan-M2 em vLLM. Tudo OpenAI-compatible com token, mesmo contrato do Model Studio.

| Máquina | GPU | Modelo (licença) | Formato / VRAM | Porta | Estado |
|---|---|---|---|---|---|
| **`beanstech-m3-va`** `i-0xib5gcfcvbmr24i24wr` · `gn8is-4x.16xlarge` 4× L20 · **Virgínia** · 47.85.201.160 | 0–3 (TP=4) | **Baichuan-M3-235B** (Qwen3-MoE 235B/A22B, Apache-2.0) | GPTQ-INT4 oficial 124,5 GB, ctx 32k | 8000 `baichuan-m3` | download em curso (~3 h a 100 Mbps); serviço `vllm-m3` sobe sozinho ao fim |
| `elite-health-2` `i-t4n2xmqbiwu59fpl2omj` · SG | 0 | **Lingshu-32B** (Qwen2.5-VL, MIT) | bf16 67 GB → bitsandbytes 4 bits (~20 GB), ctx 16k, imagens | 8001 `lingshu-32b` | download |
| idem | 1 | **Baichuan-M2-32B** (Apache-2.0) | GPTQ-Int4 oficial 19 GB | 8002 `baichuan-m2` | download |
| idem | 1 | **Lingshu-I-8B** (InternVL, MIT) | bf16 16 GB, imagens | 8003 `lingshu-i-8b` | download |
| `elite-health` `i-t4n52…` · SG | 0/1 | medgemma:27b Q8 + 1.5-4b · granite4.1 + guardian + qwen3-vl | Ollama (inalterado) | 8080 (router) | produção; reboot pendente |

Detalhes operacionais: Ollama desativado na `elite-health-2` (medgemma removido de lá); disco de dados 500 GB ESSD (`d-t4n2xmqbiwu604lmq3w2`) montado em `/data` para pesos; downloads por `aria2c` (16 conexões/arquivo — HF e ModelScope entregam ~2 MB/s por conexão e a EIP por tráfego limita a entrada a **100 Mbps**, não alterável por API); vLLM `:latest` no bring-up → **fixar digest** após validar. Tokens: `M3_API_TOKEN` (VA), `GPU2_GATEWAY_TOKEN` (SG, reaproveitado); SGs liberam só `br-apps` + IP do dev.

**evidence-chain — camada 6 "excelência":** `EXCELLENCE_BASE_URL/API_KEY/MODEL` (já nos manifestos dos 8 portais). Aciona quando a síntese rápida devolve vazio/inválido ou `opts.complex=true`; re-sintetiza **só sobre os trechos recuperados**; se indisponível, segue com a camada 2. `model_revision` registra `baichuan-m3 (excellence)` quando usado.

**Custo novo:** M3 ≈ US$ 9,9/h sob demanda (≈ 7.250/mês) · spot na mesma máquina US$ 1,98/h (script aceita `spot`). Total GPU do grupo com as 3 máquinas ligadas ≈ **US$ 15.800/mês** — a decisão de manter as três 24×7 deve vir do benchmark cego PT-BR (RAGMED §11), não antes.

Lingshu-7B e Meditron3 (8B/70B/Phi4-14B), Gemma-3-27B-MeditronFO, Apertus-8B-MeditronFO: ficam como candidatos de rodada (subir sob demanda no lugar de um dos serviços acima). Embeddings (MedCPT, Qwen3-Embedding-Medical-0.6B, embeddinggemma-medical) → benchmark de recall no `medpubr` contra BGE-M3; troca implica reindexar.
