# ROADMAP CONSOLIDADO — BeansTech 2026-2027
## Todos os produtos, decisões estratégicas e próximos passos

**Data:** 18 de Setembro de 2026 · **Autor:** Matheus Feijão

---

## 1. VISÃO GERAL

A BeansTech opera em duas frentes: **infraestrutura de IA para saúde** (BeansHealth) e **plataformas de produto** (portais). A infraestrutura é o ativo; os portais são a distribuição.

```
                    BEANSTECH (empresa)
                         │
         ┌───────────────┼──────────────────┐
         │               │                  │
    INFRAESTRUTURA   PRODUTOS         COMPLIANCE
    (BeansHealth)   (portais)        (pldbr.tech)
         │               │                  │
   ┌─────┴─────┐   ┌────┴────┐      ┌─────┴─────┐
   │           │   │         │      │           │
 einstein.cloud│  beansmed  consultorio│
 (proposta)   │  (B2B)    (B2C)     │
   │           │   │         │      │
   │           │   │         │    LGPD engine
   │           │   │         │    TISS/ANS
   │           │   │         │    API pública
   │           │   │         │    SOC 2
```

---

## 2. PRODUTOS E STATUS

| Produto | Domínio | Status | Modelo | Preço |
|---|---|---|---|---|
| DoDr | dodr.ai | ✓ no ar | Freemium | Grátis / API $0,50 |
| BeansHealth | beanshealth.com.br | ✓ no ar | Plataforma | — |
| Exame | exame.tech | ✓ no ar | Portal | Grátis |
| Prontuário | prontuario.tech | ✓ no ar | SaaS | — |
| Drogaria | drogaria.tech | ✓ no ar | Portal | Grátis |
| DrHealth | drhealth.tech | ✓ no ar | Dashboard | — |
| Dentista | portaldodentista.ai | ✓ no ar | Portal | Grátis |
| PetIQ | petiq.tech | ✓ no ar | Portal | Grátis |
| PLD/AML | pldbr.tech | ✓ no ar | B2B API | Sob consulta |
| Teste | teste.beanshealth.com.br | ✓ no ar | Científico | Grátis (convite) |
| Transparência | /transparencia | ✓ no ar | Confiança | — |
| RIPD | /ripd | ✓ no ar | LGPD | — |
| **Einstein.Cloud** | — | **proposta** | Institucional | R$ 530K (Fase 0-3) |
| **Beansmed** | beansmed.com.br | **DNS criado** | B2B Nuvem | R$ 149 a R$ 9.900/mês |
| **Consultório** | consultorio.tech | **404 (não deployado)** | B2C SaaS | R$ 197/mês |

---

## 3. DECISÃO: EINSTEIN.CLOUD — NÃO COMPRAR O DOMÍNIO

**Recomendação: NÃO comprar einstein.cloud por US$ 250 mil.**

| Razão | Detalhe |
|---|---|
| O domínio já tem dono | Está estacionado (à venda) — o preço é do vendedor, não do projeto |
| O nome "Einstein" não é seu | Marca notoriamente conhecida (art. 125 LPI) — usar sem autorização é risco legal |
| O momento é ERRADO | Comprar ANTES da parceria = gastar US$ 250K num nome que só vale SE a parceria acontecer |
| O piloto inteiro custa menos | R$ 530 mil (Fase 0-3) < US$ 250 mil ≈ R$ 1,35 milhão |
| A PI já está protegida | Commit `1a57c20` (18/09/2026) + SHA-256 — anterioridade comprovada sem gastar |

**Momento certo para comprar:** APÓS o Einstein aceitar a parceria. Nesse ponto:
1. O Einstein cede a licença de uso da marca
2. O vendedor do domínio perde o poder (você pode usar "einstein" com autorização)
3. O preço cai ou o Einstein compra diretamente

**Sequência de envio da proposta (2 etapas):**

**Etapa 1 — Carta de apresentação (sem detalhes técnicos):**
- Uma página: "propomos nuvem médica privada e soberana"
- Pedir 45 minutos para demonstração
- **NDA antes da apresentação técnica**

**Etapa 2 — Documento técnico (após NDA):**
- PROJETO-EINSTEIN-CLOUD-OFICIAL.md completo
- Arquitetura, roadmap, custos, conformidade

---

## 4. PLDBR.TECH — ROBUSTECER PARA MULTISETOR

**Hoje:** motor PLD/AML para 12+ plataformas do ecossistema BeansTech.
**Alvo:** plataforma de compliance multi-setor certificada (SOC 2).

| Fase | Duração | Entregável | Investimento |
|---|---|---|---|
| 1. LGPD engine | 3 meses | Score de risco de dados, relatório ANPD | R$ 80 mil |
| 2. TISS/ANS engine | 4 meses | Validação de guias, auditoria de sinistros | R$ 120 mil |
| 3. API pública | 2 meses | pldbr.com/api — qualquer empresa | R$ 50 mil |
| 4. Certificação SOC 2 | 6 meses | Auditoria externa, certificado | R$ 200 mil |
| **Total** | **15 meses** | **Plataforma multi-setor certificada** | **R$ 450 mil** |

**Posicionamento:** "O compliance engine do Brasil. LGPD, PLD/AML, TISS, CFM, ANVISA — num único lugar."

---

## 5. BEANSMED.COM.BR — A NUVEM PARA MÉDICOS E CLÍNICAS

O Einstein.Cloud é para o hospital de referência. O beansmed.com.br é para:
- Clínica de 5 médicos que quer IA clínica sem contratar TI
- Hospital municipal que quer ferramenta de apoio sem gastar R$ 500 mil
- Operadora de plano que quer auditoria de sinistros com IA

| Produto | Preço | Para quem | Margem |
|---|---|---|---|
| Professional | R$ 149/mês | médico individual | 80% |
| Clínica | R$ 990/mês | 5-10 médicos | 75% |
| Instituição | R$ 9.900/mês | hospital médio | 65% |
| GPU dedicada 1× L20 | US$ 3.900/mês | clínicas com volume | 45% |
| API tokens | US$ 0,50/resposta | IAs parceiras | >70% |

**Status:** DNS criado, apontando para br-apps. Precisa de:
1. Landing page (planos, preços, features)
2. Gateway de cobrança (Stripe/PagSeguro)
3. Portal do desenvolvedor (/docs com API)
4. Dashboard do cliente (tokens, uso, faturas)

---

## 6. CONSULTORIO.TECH — O ESCRIVÃO VIRTUAL

O produto que o médico ama usar. Não infraestrutura, não compliance — a ferramenta do dia a dia.

**O que faz:**
- O médico fala → IA transcreve (whisper)
- IA converte transcrição → SOAP estruturado (medgemma-4b)
- IA gera prescrição com verificação de interação
- IA prepara guia TISS pronta para envio
- IA sugere retorno baseado na conduta
- Médico revisa e assina: 30 segundos em vez de 15 minutos

**Preço:** R$ 197/mês por médico
**ROI:** 2 horas/dia de documentação recuperadas = R$ 3.000/mês de valor
**Status:** DNS existe mas 404 (não deployado). Precisa ser construído.

---

## 7. FINANCEIRO CONSOLIDADO

| Item | Custo mensal |
|---|---|
| 3 GPUs (elite-health, elite-health-2, m3-va) | US$ 15.800 |
| 4 hosts BR (br-apps, br-db, br-es, medpubr) | US$ 1.325 |
| PolarDB MySQL (pré-pago até 09/2027) | US$ 218 |
| ACR Enterprise | US$ 555 |
| Outros (KMS, tráfego, Cloudflare) | US$ ~100 |
| **TOTAL** | **US$ ~18.000/mês** |

**Receita necessária para break-even:**
- 2 contratos GPU dedicada 4× (US$ 12.900 cada) = US$ 25.800 ✓
- Ou 60 clínicas (R$ 990) + 300 profissionais (R$ 149) = R$ 104.400 ≈ US$ 19.700 ✓

---

## 8. PRÓXIMOS PASSOS (POR PRIORIDADE)

| # | Ação | Quando | Dependência |
|---|---|---|---|
| 1 | Enviar carta ao Einstein (Etapa 1, com NDA) | Esta semana | NDA redigido |
| 2 | NDA mútuo com o Einstein | Esta semana | Advogado |
| 3 | Enviar documento técnico (Etapa 2) | Após NDA | Einstein aceitar reunião |
| 4 | Deploy consultorio.tech (landing + escrivão) | 2 semanas | Design da interface |
| 5 | Deploy beansmed.com.br (planos + gateway) | 3 semanas | Gateway de pagamento |
| 6 | pldbr.tech Fase 1 (LGPD engine) | 3 meses | R$ 80 mil |
| 7 | Migrar coletores jurídicos do br-apps | Urgente | Estabilidade dos portais |
| 8 | Revisão cega dos médicos (200 casos) | 2-4 semanas | Enviar links |
| 9 | Atualizar /decisao para GLM-5.3 como principal | 1 semana | — |
| 10 | Replicar componentes de confiança nos 7 outros portais | 2 semanas | — |

---

## 9. PROTEÇÃO DE PI (JÁ FEITA)

| Item | Evidência |
|---|---|
| Git commit | `1a57c208778982774440ef6423bfac884e8211da` (18/09/2026) |
| SHA-256 do IP | `ef47c821306b2356c665dd84eb094f413cf79274873fa91d56bf190b1a9f2ff0` |
| Arquivo | SEGREDO-COMERCIAL-IP-BEANSTECH.txt |
| Documentação | BENCHMARK-CLINICO-IA-METODOLOGIA-COMPLETA.docx (15 seções + Anexo A) |
| Benchmark | 200 casos, 2.000 avaliações, reprodutível |
| Código | healthtech-infra (privado) + einstein-benchmark (privado) |

---

*Matheus Feijão · matheus@beanstech.com.br · WhatsApp +55 11 92507-9058 · dpo@beanstech.com.br*
