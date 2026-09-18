# Lançamento — roteiros de vídeo e checklist · 2026-09-15

**Peça central da campanha:** `beanshealth.com.br/decisao` — Apoio à Decisão Clínica.
**Mesma ferramenta em:** dodr.ai/decisao · exame.tech/decisao · prontuario.tech/decisao · drogaria.tech/decisao · petiq.tech/decisao · drhealth.tech/decisao · portaldodentista.ai/decisao (prompt ajustado por vertical).
**O que ela faz hoje (modo consulta):** o caso passa pela remoção de dados pessoais (medpubr, São Paulo) → guardrail de entrada (Granite Guardian) → Baichuan-M3-235B (raciocínio separado, só a resposta volta) → guardrail de saída → resposta em 4 blocos: *Raciocínio clínico · Condutas a considerar · Verificar antes de decidir · O que não posso afirmar*. Aviso fixo: sem verificação documental automática nesta versão; confirmar em bula/protocolo.
**O que vem depois (modo evidência):** cada afirmação com citação a PCDT/bula/artigo verificada — quando o acervo estiver ingerido no Elastic (RAGMED §5).

---

## Vídeos para gravar (cada um ≤ 90 s, tela + voz; sem paciente real, sem dado identificável)

### V1 — "Terceiro plantão" (peça principal, 60–90 s)
1. Abertura, tela preta com texto: *"4h12. Terceiro plantão. Uma paciente descompensando e ninguém para perguntar."*
2. Corte para `beanshealth.com.br/decisao`. Digitar o caso (usar o exemplo abaixo, sem nome).
   > Mulher, 74 anos, DPOC, dispneia, SatO2 86% em ar ambiente, sonolenta, musculatura acessória. Gasometria: pH 7,28, pCO2 68. Conduta imediata e critérios para VNI versus intubação?
3. Mostrar o tempo de resposta (10–30 s) e os quatro blocos. Destacar com o cursor o bloco **"O que não posso afirmar"** — é o diferencial: a ferramenta diz onde para.
4. Rodapé da resposta: *modelo, tempo, dados pessoais removidos*. Frase final: *"Não decide por você. Decide com você."*

### V2 — "Não inventa dose" (45 s)
Caso do idoso com FA, clearance 28, sangramento em rivaroxabana 20 mg. Mostrar que a resposta manda **confirmar em bula/protocolo vigente** em vez de cravar número — e que isso é regra do sistema, não acaso. Comparar (opcional) com um chat genérico que crava dose sem ressalva.

### V3 — "Guardrail" (30 s)
Digitar algo fora do escopo ("como falsificar um atestado") → resposta 422 "classificada como inadequada". Depois digitar um caso com CPF e telefone → mostrar `dados pessoais removidos da pergunta` no rodapé. Mensagem: *o que entra é filtrado, o que sai é filtrado, o que identifica não chega ao modelo.*

### V4 — "Onde roda" (60 s, para instituições)
Tela do plano (§2 do ALIBABA-HEALTHTECH) ou o slide 6 do deck: São Paulo (dado clínico, verificação, identidade) · Singapura (modelos) · Virgínia (excelência 235B). Narrar: *"O que identifica o paciente não sai do Brasil. O que vai para o modelo é o caso, sem nome."* Mostrar `id.beanstech.com.br` (login único) e `cms.beanstech.com.br` (conteúdo).

### V5 — "Imagem" (45 s, quando Lingshu estiver na UI — hoje só via API)
Enviar um RX de tórax de banco público (NIH/CheXpert, licença de demonstração) ao `lingshu-32b` e mostrar a descrição. **Não gravar antes de validar 10 imagens com um radiologista.**

### V6 — "Cinco especialidades, um motor" (60 s)
Cortes rápidos: drogaria.tech (interação medicamentosa), portaldodentista.ai (prescrição odontológica), petiq.tech (dose por espécie), exame.tech (interpretação de exame), prontuario.tech (SOAP). Mesma pergunta-base adaptada, mesma estrutura de resposta.

### V7 — "Excelência" (30 s)
Mostrar a mesma pergunta difícil no modo rápido (qwen-plus) e no M3-235B, lado a lado, com o tempo. Mensagem: *"Caso difícil chama o modelo grande. Automaticamente."* (na cadeia de evidência; na UI atual, o M3 já é o padrão).

**Regras de gravação:** nunca um paciente real; sem CRM de terceiros na tela; toda resposta mostrada deve ter sido lida por um médico antes de publicar; deixar o aviso de rodapé visível em todo take.

---

## Checklist de lançamento (ordem)

| # | Item | Estado | Responsável |
|---|---|---|---|
| 1 | GPUs ligadas: elite-health, elite-health-2, m3-va | ✅ ligadas | — |
| 2 | `/decisao` no beanshealth.com.br | ✅ no ar, testado (DPOC: 24,7 s) | — |
| 3 | `/decisao` nos outros 7 portais | ✅ no ar: dodr, exame, prontuario, drogaria, petiq, drhealth, dentista | — |
| 4 | Leads no Directus (`cms.beanstech.com.br` → coleção `leads`) | ✅ | — |
| 5 | Alarme de indisponibilidade (`/decisao` e M3) no CloudMonitor | ✅ | — |
| 6 | **Senha SMTP do Direct Mail** → `DIRECTMAIL_SMTP_PASSWORD` | ⛔ só no console | **Matheus** |
| 7 | Cadastro público no BeansTech ID (depende do 6) | após 6 | Claude |
| 8 | Lista de 100 mil profissionais: origem e base legal (LGPD art. 7º IX legítimo interesse + opt-out; ou consentimento) | — | **Matheus** |
| 9 | Sendify: remetente `@ativo.tech` (DKIM ok) ou DKIM em `beanshealth.com.br` (recomendado para a marca) | decidir | Matheus / Claude |
| 10 | Páginas `/termos` e `/privacidade` no beanshealth (linkadas no gate) | verificar existência | Claude |
| 11 | Revisão médica de 10 respostas antes do envio | — | **médico revisor** |
| 12 | Vídeos V1–V3 gravados | — | Matheus |
| 13 | Ingestão inicial PCDT + bulas → modo evidência | próxima semana | Claude |

**Capacidade para o pico:** o M3 entrega ~69 tok/s por fluxo; com lote, ~275 tok/s. Uma resposta consome ~2 k tokens (1,5 k de raciocínio) → **~8 respostas/min sustentadas, ~500/h** numa máquina. Se a campanha trouxer mais que isso na primeira hora, a fila cresce; a saída é uma segunda `gn8is-4x` (estoque em VA-a e SG-a) — 15 min para subir pela imagem. Limite por IP (20/dia) segura abuso, não pico.
