# Migração GitHub → org btechbrasil

**Data:** 27/09/2026
**De:** `beanstechhub` (75 repos, produtos) + `beanstechbr` (17 repos, pessoais) + 4 verticais locais
**Para:** `github.com/btechbrasil` (Enterprise Beans-Tech)
**Proxy:** SOCKS via ECS 43.110.16.225 (us-west-1)

---

## 1. Repos verticais (infra por vertical) — CONCLUÍDO

| Repo | Conteúdo | Status |
|---|---|---|
| `healthtech-infra` | Infra completa Alibaba (deploy/, 39+ commits) | ✅ pushed |
| `legaltech-infra` | Docs infra (PADRAO-ALIBABA, CAMS, OCR) + índice | ✅ pushed — gitlinks removidos |
| `fintech-infra` | 2.893 arquivos fonte: Regtech agents, beansbank-v2, ouro.capital, pld, tributo | ✅ pushed (21,7 MB) |
| `proptech-infra` | 1.695 arquivos: beansproperties, gestaotechbr, cyrela/eztec/yuny-ai | ✅ pushed |
| `ai-platform-infra` | 29 arquivos plataforma | ✅ pushed (anterior) |

### Limpezas críticas feitas durante o push
- **legaltech**: 22.238 arquivos de `Julgados/` (dados de decisões — 3,7M linhas) NÃO foram ao git
- **fintech**: `git reset` abortou commit com 56.792 arquivos (**.env com segredos, node_modules, __pycache__, dist**) ANTES do push — **verificado no remoto: nunca chegaram lá, sem vazamento, sem rotação necessária**
- **fintech**: binários do provider Terraform `hashicorp/google` (105-111 MB cada) e `.exe` Windows removidos — isto era o legado GCP literal
- **legaltech**: PDFs/docx de processos reais (petições, processos 5001622, 5003919) excluídos por .gitignore
- Regra: `.env`, `node_modules/`, `__pycache__/`, `dist/`, `.terraform/`, `*.exe`, `*.pdf`, `*.docx`, `Julgados/` no .gitignore de todos

## 2. Mapeamento dos 92 repos por vertical

| Vertical | Qtd | Repos principais |
|---|---|---|
| **Legaltech** | 26 | ragjur (7 variantes), legalsuite, minutatech (+mobile), advogandoai (+mobile), e-arbitragem-ai, coworker-desktop, aceito-tech, portaldoadvogadoai, constituicao, dialogoai, advogandomobile, bensadvbr, peticaotech, digitaladv |
| **Healthtech** | 18 | beanshealth, dodr.ai (4), drhealth-tech, portaldodentista (2), prontuario-tech, prontuario-api, exame-tech, exame-api, vademecum-tech, petiq-app, petiq-web, alimobile, dentista-api |
| **Fintech** | 11 | beans-capital-web, recebertech (2), moneyp (3), beans-comply, iatributaria, aurum (3) |
| **Betting** | 16 | pixbet (3), legalbet (3), jogolimpo (4), bets (3), betprime (3) — stack completa web/dashboard/api + ML |
| **AI / Plataforma** | 13 | ativos-ai, mind, beansmind, agentes, coletores, einstein-benchmark, wave, visualbeans, beanstech-zai-application, gcloud-guardrail, .github (2) |
| **Corporativo** | 6 | beanstechsite, beanstech-cms, pitch-deck, useco2portal, direcional (2) |

## 3. Status da migração — CONCLUÍDO

**Org `btechbrasil`: 93 repos, todos privados.**

| Bloco | Qtd | Status |
|---|---|---|
| Repos verticais (infra) | 5 | healthtech, legaltech, fintech, proptech, ai-platform |
| Repos de produto com código | ~84 | full history via git push |
| Repos vazios na origem (placeholders) | 4 | ativos-ai, direcional, direcionalbt, jogolimpo-mobile |
| Pré-existentes | 2 | gcloud-agents, demo-repository |
| Casos especiais | 2 | legalsuite (1 GB — snapshot em commit único, clone impossível pela rede), minutatech-mobile (clone raso + unshallow) |

- 4 clones vazios: os repos de ORIGEM (beanstechbr) nunca receberam código
- legalsuite: baixado via tarball da API (2.111 arquivos, 996 MB, nenhum arquivo >6 MB) e subido como snapshot — histórico original fica só no beanstechhub
- Scan GCP por repo: contagem de refs GCP registrada na descrição de cada repo criado

## 3.1 Incidentes e causas-raiz resolvidos durante a migração

1. **Túnel SOCKS morto sob carga**: o env do shell força `HTTPS_PROXY=socks5://localhost:1080` (proxy via ECS 43.110.16.225). Quando o túnel caía, TUDO falhava instantaneamente ("Failed to connect via localhost") — inclusive testes "diretos", que nunca eram diretos. Resolução: migração final 100% DIRETA (github.com e api.github.com respondem sem proxy). O túnel continua necessário apenas se o IP allow-list da Enterprise for ativado.
2. **Race no git config global**: o script original ligava/desligava o proxy global entre pushes com paralelismo — corrigido.
3. **Push raso rejeitado** (minutatech-mobile): GitHub rejeita shallow push — resolvido com `git fetch --unshallow`.
4. **Repos 75-111 MB**: clones penduravam no túnel — resolvidos com clone direto paralelo.

## 4. O que há de bom e aproveitável (avaliação)

- **ragjur** — o ativo principal (100M decisões, self-hosted ES) — código fonte migrado
- **Regtech agents** (fintech) — 20+ agentes compliance (AML, KYC, COAF, CVM, Bacen) prontos para reviver
- **Stack betting completa** (bets-ml + web + api) — produto inteiro prêt-à-porter
- **devisao route.ts** replicado em 8 portais health — o motor /decisao do parecer CFM
- **PADRAO-ALIBABA-BEANSTECH.md** — documento de padrão corporativo pós-GCP

## 5. Legados GCP identificados a remover nos produtos

| Tipo | Onde | Ação |
|---|---|---|
| `cloudbuild.yaml` | Regtech, vários | remover/ignorar — build agora é ACR |
| `hashicorp/google` tf providers | pld/infra | já removidos do fintech-infra |
| `.gcloudignore` | Regtech/site | deletar |
| `gcloud-auth` em scripts | aceito-tech (20 refs), minutatech (6) | trocar por RAM role/KMS |
| App Engine / Cloud Run yamls | vários produtos | reescrever para SAE 2.0 |
| `gcloud-guardrail` repo | ai-platform | manter como referência histórica ou arquivar |

## 6. Pendências

- [x] Concluir pushes dos 92 repos — 93 repos na org, 100% privados
- [x] legalsuite (1 GB) — via tarball, snapshot em commit único
- [x] Repos que ficaram só com README — fintech/proptech/ai-platform têm fonte
- [ ] Remover cloudbuild.yaml/.gcloudignore dos produtos (limpeza pós-migração — refs GCP mapeadas na descrição de cada repo)
- [ ] Arquivar orgs beanstechhub/beanstechbr quando migração for validada
- [ ] Commitar e pushar as correções de segurança (eval-suite, collect_hf, healthdash) no healthtech-infra — API Alibaba inacessível durante a sessão, deploy do healthdash pendente
- [ ] Wire GigaPath/Boltz-2/Evo-2 + Whisper (bloqueado: API Alibaba fora do ar da rede local)
- [ ] Corrigir findings Mimosa restantes (381 static, 159 high — SSRF nas rotas /decisao replicadas, cmd-inj em scripts de treino)

---

*Beans Tech. Brasileiro. Sem ganância. Com fé.*
