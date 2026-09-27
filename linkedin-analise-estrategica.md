# LinkedIn — Análise Estratégica Completa (pré-execução)

Data: 26/09/2026 · Método: verificação de ativos (DNS/HTTPS dos domínios citados), inventário dos repositórios (healthtech + projetos irmãos), cruzamento das afirmações públicas × documentação interna (plano mestre, apps.tsv, pareceres).

> Complementa `linkedin-perfil-revisao.md` (correções de texto prontas para colar). Este documento é a análise **estratégica** — o que fazer e por quê, antes de executar.

---

## 1. Sumário executivo — 10 achados

1. **3 produtos promovidos no LinkedIn estão fora do ar**: `portaldoadvogado.ai` (DNS ok, HTTPS quebra), `recurso.tech` (404 — aponta pra IP do Google), `beans.capital` (404). O pior: o post **beans.capital é o de melhor engajamento (153 impressões) e o CTA aponta para um 404**.
2. **Número oficial definido: 105 milhões exatos** (confirmação do usuário, 26/09) — todos os textos públicos corrigidos para 105M. ⚠️ A pendência migrou para **dentro**: a documentação interna (plano mestre 08/09, 40+ menções em legaltech/healthtech) ainda diz **65–67M** — sincronizar os docs, senão a clivagem de due diligence persiste por dentro.
3. **O stack público não bate com o interno**: o post de saúde alega Google Cloud/Vertex AI/MedGemma; a arquitetura real (plano mestre + commit cc7e333) é **ECS sa-east-1 + RDS BR + Cloudflare, medgemma:27b self-hosted em GPU A10 (Q4), APIs Bailian (GLM-5.3/qwen3.8), Elastic AWS, PII-strip no edge antes de o dado sair do Brasil**. Vertex/Google Cloud não aparece na arquitetura atual.
4. **O portfólio real é mais amplo que a narrativa**: a história diz "4 verticais"; o portfólio tem **12+ linhas** (health, legal, fintech/PLD, proptech, contech, bettech, defesatech, mastersearch + negócio de infraestrutura de nuvem: hy.cloud, granitic.cloud, brazil.z.cloud, parceria Z.ai/z.cloud, ecossistema chat beanstech.ai). O problema não é 3×4 verticais — é amplitude sem foco na narrativa.
5. **A blindagem jurídica já existe em casa e não é usada**: `PARECER-CFM-APOIO-DECISAO-CLINICA.md` (saúde), `PARECER-LGPD-TRANSFERENCIA-SINGAPURA.md` (LGPD), metodologia de benchmark auditável (`AVALIACAO-METODOS-AUDITAVEIS.md`, benchmark cego). O discurso público diz "confiável"; a casa tem **pareceres e método auditável** — e não cita.
6. **O alcance é minúsculo**: ~10 seguidores, 19 visualizações de perfil/semana, **0 aparições em busca**. Nesta fase, polimento gera pouco retorno; consistência (não contradizer-se), cadência e **comentários em threads de terceiros** são o que constrói alcance.
7. **O que performa é o concreto**: beans.capital (números técnicos, 153) > e-arbitragem/LegalSuite (66/74) > lançamento RAGJur (5 — soterrado pelo texto quebrado) > agradecimentos emocionais (2–3). Padrão claro: **especificidade técnica vence**.
8. **O terreno regulatório esquentou**: thread OAB (Fabio Floh) + **caso STF de prompt injection (26/09)** — primeira manipulação de IA da Corte detectada em petição. Ao mesmo tempo em que afirmações absolutas ("zero alucinação", "0 citações falsas") ficam mais arriscadas, o **posicionamento "IA como ferramenta de apoio, dados limpos, quem responde é o advogado"** fica mais valioso — e é o que a arquitetura interna (PII-strip, rerank em produção) sustenta de verdade.
9. **A timeline pública se contraduz**: fundação set/2024 (Sobre + Experiência) × "Após 3 anos" (lançamento) × "2 anos 1 mês" (badge automático). Internamente o RAGJur é projeto desde 2023 — reconciliável, mas precisa ser dito uma vez, do mesmo jeito, em todo lugar.
10. **As ferramentas de produção agora são próprias**: Token Plan ativo (imagem/vídeo/visão/TTS + harness tools) permite produzir os assets (banner, imagens de post, verificação) sem dependência externa — e a geração pode ser verificada pelo próprio modelo de visão.

---

## 2. Verificação de ativos — domínio por domínio

| Domínio | Status | Onde é citado no LinkedIn | Consequência |
|---|---|---|---|
| beanstech.com.br | ✅ 200 | contato, site do perfil | ok |
| beanshealth.com.br | ✅ 200 | — | ok |
| dodr.ai / app.dodr.ai | ✅ 200 | post de saúde | ok |
| exame.tech | ✅ 200 | post de saúde (como "ExameTech") | nome divergente — usar o domínio real |
| prontuario.tech | ✅ 200 | post de saúde (como "ProntuarioTech") | idem |
| portaldodentista.ai | ✅ 200 | post de saúde | ok |
| ragjur.ai | ✅ 200 | lançamento | ok |
| advogando.ai | ✅ 200 | lançamento | ok |
| minuta.tech | ✅ 200 | lançamento | ok |
| e-arbitragem.ai | ✅ 200 | lançamento + projeto | ok |
| legalsuite.com.br | ✅ 200 | post LegalSuite | ok |
| **portaldoadvogado.ai** | ❌ HTTPS falha (DNS resolve) | lançamento ("atualizado minuto a minuto") | corrigir ou remover a menção |
| **recurso.tech** | ❌ 404 (IP Google) | lançamento | corrigir ou remover |
| **beans.capital** | ❌ 404 (IP Google) | post RegTech (CTA principal) | **prioridade máxima** — melhor post com CTA quebrado |

**Regra que se impõe:** nenhum post deve citar produto que não responde 200. Ou o produto sobe, ou o post menciona "em lançamento/ Beta" — nunca link morto.

**Atualização 26/09 (após auditoria interna `1.RagJUR/docs/AUDITORIA-RAGJUR-DOMINIOS-2026-09-26.md`):**
- **ragjur.ai está SAUDÁVEL** — site, api, status e mcp respondem 200 na infra própria (br-web); o número da homepage foi corrigido hoje de "95 milhões" para **104 milhões** em toda a superfície. Os apps voltaram após a reconstrução de 10/09.
- **beans.capital e recurso.tech são placeholders no Google Sites** — nunca foram produtos no ar; o CTA do post RegTech aponta para um placeholder. Portaldoadvogado.ai resolve (lote medpubr 2) mas o HTTPS falha.
- **Número em três camadas**: acervo bruto (OSS) = 104–105M (usuário confirma 105 exato) · índice Elastic medido = 53,02M docs/303,7 GB · superfície do site = 104M. Frase pública correta: "**acervo** de 105 milhões de julgados" — não "indexadas".
- **Domínios com prazo (não-LinkedIn, urgente):** proptechbr.com em redenção até **10/10** (crítico) · feijaoadvocacia.com.br expirado (carência até 19/12) · jogolimpo.com.br (20/10) · **feijaojustech.com.br (31/10 — é o domínio do e-mail hoje exposto no LinkedIn; mais um motivo para trocar para @beanstech)**.
- Portfólio total sob gestão: **~158 domínios** em 3 provedores — reforça a recomendação de narrativa focada.

---

## 3. Números — o que a casa diz vs. o que o LinkedIn diz

| Fonte | Número |
|---|---|
| Plano mestre (08/09/2026), matriz de plataformas | **67M julgados** (RAGJur/legaltech) |
| Menções internas mais frequentes | 65M julgados (×28), 67,1M decisões (×8) |
| LinkedIn — lançamento RAGJur (hoje) | 100M → **corrigido para 105M** (26/09) |
| LinkedIn — beans.capital (3 meses) | 68M → remover do post (métrica fora de contexto) |
| LinkedIn — LegalSuite (1 mês) | +20M (treino) |

**Decisão A resolvida (26/09): 105 milhões exatos**, confirmado pelo usuário — é o número público oficial. Ações decorrentes: (1) todos os textos do `linkedin-perfil-revisao.md` já usam 105M; (2) **sincronizar a documentação interna** (plano mestre e as 40+ menções de 65–67M em legaltech/healthtech) para 105M — sem isso, a clivagem continua existindo, só que por dentro; (3) "maior base de IA jurídica do Brasil" segue exigindo fonte comparativa — sem ela, "uma das maiores". O +20M de treino do LegalSuite é compatível (subset) e fica, explicitado como "conjunto curado de treino".

---

## 4. Stack — público × real

| Camada | O LinkedIn diz (post de saúde) | O interno diz |
|---|---|---|
| Nuvem | Google Cloud Healthcare API | ECS sa-east-1 + RDS BR + Cloudflare; beanshealth.com.br migrado p/ Alibaba (commit 18/09) |
| Modelo médico | MedGemma via Vertex AI | **medgemma:27b self-hosted em A10 24GB (Q4)** + medgemma:1.5-4b; overflow Qwen3-VL-235B |
| Texto | — | GLM-5.3 / qwen3.8 via Bailian (savings plan SP) |
| RAG | — | text-embedding-v4 + qwen3-rerank — **"JÁ EM PRODUÇÃO"** (plano mestre) |
| Privacidade | LGPD/FHIR/HL7 (menção) | **PII-strip no edge antes de qualquer dado sair do Brasil** + parecer LGPD da transferência p/ Singapura |
| Assinatura | "Google Cloud Digital Leader" | sem evidência nos repositórios |

**Recomendação (resolve C, D, E):** reescrever o post de saúde com o stack real — que é **melhor história** que a versão Google: "modelo médico 27B rodando em GPU própria em solo brasileiro, PII removido no edge antes de qualquer inferência, com parecer LGPD para transferência internacional" é uma narrativa mais forte e verificável do que "rodamos no Vertex". Manter "Google Cloud Digital Leader" na assinatura **só** se o certificado existir.

---

## 5. Portfólio real × narrativa "4 verticais"

Linhas encontradas nos repositórios: health (8+ portais), legal (RAGJur, RagBanc, Advogando, e-arbitragem, Beansadv, contrato-analyzer, defesa.tech, constituicao.tech, Vade Mecum, judicial-sentiment…), fintech (pldbr-tech, beans.capital), proptech, contech, bettech, defesatech, mastersearch, automação, bio + **infraestrutura de nuvem como negócio** (hy.cloud, granitic.cloud, brazil.z.cloud, parceria Z.ai, chat beanstech.ai).

**O problema não é o número — é a escolha da história.** Três opções honestas:
- **Foco regulado (recomendada):** "IA para 3 setores regulados — Direito, Saúde, Finanças — com infraestrutura própria e dados em solo brasileiro". Arbitragem entra como produto do Direito (3 verticais, não 4).
- **Plataforma:** "construímos a infraestrutura de IA que opera nossos produtos e a de parceiros (z.cloud, hy.cloud)" — conta a amplitude, mas dilui o foco e exige explicar negócio de revenda de nuvem.
- **Híbrida:** foco regulado no perfil; a linha de infraestrutura como diferencial técnico ("não dependemos de nuvem de terceiros") e não como vertical.

Existe doc de limpeza (`LIMPEZA-PLATAFORMAS.md`) — a housekeeping já é consciência interna; o LinkedIn deve refletir o pós-limpeza.

---

## 6. Audiência e engajamento (fase atual)

- ~10 seguidores · 19 views/semana · **0 aparições em busca** · 9 conexões.
- Impressões por post: beans.capital **153** · LegalSuite 74 · e-arbitragem 66 · saúde 52 · RAGJur (lançamento) **5** · agradecimentos 2–3.
- Leitura: **posts técnicos-específicos performam 10–30× mais que posts emocionais**; o lançamento da vitrine morreu (texto quebrado + sem rede).
- Implicação de fase: o retorno marginal de "polir post antigo" é baixo; o retorno de (a) eliminar contradições que um due diligence acharia, (b) **comentar em threads grandes de terceiros** (Fabio Floh, case STF), (c) cadência terças/quintas/domingos já prometida publicamente — é alto.

---

## 7. Riscos e blindagens disponíveis

| Risco | Grau | Blindagem disponível |
|---|---|---|
| Números divergentes (100M/68M público × 65–67M interno) | **alto** → parcialmente resolvido | 105M público oficial (confirmado); falta sincronizar docs internos |
| "Zero alucinação"/"0 citações" | **alto** (CONAR/CDC + contradição com o disclaimer) | postura blindada já redigida (seção 11 da revisão) |
| CTA quebrado (beans.capital) | **alto** (experiência) | subir o produto ou trocar o CTA |
| Stack Google Cloud sem lastro | médio | reescrita com stack real (melhor história) |
| Crítica a MP/Juiz no comentário | médio | suavização já redigida (seção 12.5) |
| Afirmações de saúde (CFM) | médio | **Parecer CFM já existe** — citar "com parecer de conformidade" |
| LGPD/transferência | baixo (se citado corretamente) | **Parecer LGPD Singapura** + PII-strip real no edge |
| "Maior base do Brasil" | médio (superlativo) | "uma das maiores" até fonte comparativa |

---

## 8. Recomendações — ordem revisada

**Fase 0 — consertar o chão (antes de qualquer publicação):**
1. ~~Definir número oficial~~ ✅ **105M exatos** (confirmado pelo usuário, 26/09). Pendência: sincronizar docs internos (ainda 65–67M).
2. Decidir vertical: **3 reguladas** (proposta).
3. beans.capital: subir ou trocar CTA do post. portaldoadvogado.ai / recurso.tech: corrigir ou marcar "Beta".
4. Certificado Google: confirmar ou remover da assinatura.

**Fase 1 — perfil (15 min, já liberado):** itens 1–6 do painel de controle (contato, Sobre, Serviços, projeto, formação, competências).

**Fase 2 — thread Fabio Floh (hoje):** resposta direta ao desafio (coluna 1/2, quem assina responde, sem margem) + 5 comentários corrigidos. Maior alavanca de alcance da fase.

**Fase 3 — conteúdo novo (timing):**
- Post sobre o **caso STF de prompt injection** (hoje/amanhã): terreno exato do posicionamento; conectar com PII-strip/dados limpos sem explorar o caso de terceiros.
- Banner do perfil (1584×396) via Token Plan + verificação por visão.
- Cadência assumida: terças/quintas/domingos.

**Fase 4 — posts existentes:** agradecimentos e beans.capital já (com CTA resolvido); RAGJur/LegalSuite/saúde após Fase 0.

---

*Fontes: DNS/HTTPS verificados em 26/09/2026 12h10; `deploy/apps.tsv`; `TIME-ELITE-IA-PLANO-MESTRE.md` (08/09); grep de números em legaltech/ e healthtech/; commit cc7e333 (18/09). Números internos podem ter evoluído — confirmar com o usuário antes de fixar o público.*
