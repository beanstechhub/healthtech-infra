// DoDr / BeansTech — deck para Einstein, São Luiz (Rede D'Or), Notre Dame, SulAmérica e CRM-SP · 2026-09-15
// Paleta: evergreen clínico + off-white + âmbar de evidência. Fontes: Georgia (títulos) / Arial (corpo).
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; pres.author = "BeansTech"; pres.title = "DoDr — Medicina com evidência";
const W = 13.33, H = 7.5, M = 0.6;
const BG = "FFFFFF", DARK = "0F2F2C", PRIMARY = "155E56", ACCENT = "D97B1E", TEXT = "18211F", MUTED = "5F6F6C", TINT = "EAF2F0", LINE = "CFDCD9";
const TF = "Georgia", BF = "Arial";
const T = (s, o = {}) => ({ text: s, options: o });
let n = 0;
function base(dark = false) {
  const s = pres.addSlide(); s.background = { color: dark ? DARK : BG }; n++;
  s.addText(`BeansTech · DoDr · Confidencial`, { x: M, y: H - 0.45, w: 6, h: 0.3, fontSize: 11, fontFace: BF, color: dark ? "8FB3AD" : MUTED, margin: 0 });
  s.addText(String(n), { x: W - M - 0.6, y: H - 0.45, w: 0.6, h: 0.3, fontSize: 11, fontFace: BF, color: dark ? "8FB3AD" : MUTED, align: "right", margin: 0 });
  return s;
}
function title(s, t, sub, dark = false) {
  s.addText(t, { x: M, y: 0.45, w: W - 2 * M, h: 0.8, fontSize: 32, fontFace: TF, bold: true, color: dark ? "FFFFFF" : PRIMARY, margin: 0 });
  if (sub) s.addText(sub, { x: M, y: 1.22, w: W - 2 * M, h: 0.45, fontSize: 16, fontFace: BF, color: dark ? "B9D3CF" : MUTED, margin: 0 });
}
const src = (s, t) => s.addText(t, { x: M, y: H - 0.8, w: W - 2 * M, h: 0.3, fontSize: 11, fontFace: BF, color: MUTED, italic: true, margin: 0 });
const bu = () => ({ code: "25B8", indent: 12 });

// 1 · capa
{
  const s = base(true);
  s.addText("DoDr", { x: M, y: 1.6, w: 8, h: 1.2, fontSize: 72, fontFace: TF, bold: true, color: "FFFFFF", margin: 0 });
  s.addText("Medicina com evidência.", { x: M, y: 2.8, w: 10, h: 0.9, fontSize: 40, fontFace: TF, color: "FFFFFF", margin: 0 });
  s.addText("Infraestrutura brasileira de IA clínica que só responde o que consegue citar — modelos abertos, dado em São Paulo, trilha auditável.", { x: M, y: 3.9, w: 8.6, h: 1.0, fontSize: 18, fontFace: BF, color: "B9D3CF", margin: 0 });
  s.addShape(pres.shapes.LINE, { x: M, y: 5.25, w: 3.2, h: 0, line: { color: ACCENT, width: 2 } });
  s.addText("Proposta de validação clínica — Hospital Israelita Albert Einstein · São Luiz / Rede D'Or · Notre Dame Intermédica · SulAmérica · CRM-SP", { x: M, y: 5.4, w: 9.5, h: 0.7, fontSize: 14, fontFace: BF, color: "FFFFFF", margin: 0 });
  s.addText("Setembro de 2026 · BeansTech", { x: M, y: 6.15, w: 6, h: 0.4, fontSize: 13, fontFace: BF, color: "8FB3AD", margin: 0 });
}
// 2 · em uma tela
{
  const s = base(); title(s, "Em uma tela", "O que a BeansTech traz — e o que não traz");
  const stats = [["6", "camadas entre a pergunta e a resposta — nenhuma delas é 'confie no modelo'"], ["9", "portais médicos já no ar em ECS São Paulo (dodr.ai, exame.tech, prontuario.tech…)"], ["0", "bytes de dado clínico fora do Brasil: recuperação, PII e verificação rodam em SP"], ["4", "níveis de modelo, todos de peso aberto (Apache-2.0 / MIT) — trocáveis sem perder o acervo"]];
  stats.forEach(([k, v], i) => { const y = 1.95 + i * 1.15; s.addText(k, { x: M, y, w: 1.5, h: 1.0, fontSize: 60, fontFace: TF, bold: true, color: i === 2 ? ACCENT : PRIMARY, margin: 0, valign: "middle" }); s.addText(v, { x: M + 1.7, y: y + 0.12, w: 7.3, h: 0.8, fontSize: 17, fontFace: BF, color: TEXT, margin: 0, valign: "middle" }); if (i < 3) s.addShape(pres.shapes.LINE, { x: M, y: y + 1.08, w: 9, h: 0, line: { color: LINE, width: 0.75 } }); });
  s.addShape(pres.shapes.RECTANGLE, { x: 10.0, y: 1.95, w: 2.75, h: 4.5, fill: { color: TINT }, line: { color: TINT } });
  s.addText([T("O que não é", { bold: true, breakLine: true, color: PRIMARY }), T(" ", { breakLine: true, fontSize: 6 }), T("Não é diagnóstico autônomo.", { bullet: bu(), breakLine: true }), T("Não substitui o prontuário.", { bullet: bu(), breakLine: true }), T("Não usa dado do paciente para treinar.", { bullet: bu(), breakLine: true }), T("Não responde sem trecho de fonte autorizada.", { bullet: bu() })], { x: 10.2, y: 2.1, w: 2.4, h: 4.2, fontSize: 13.5, fontFace: BF, color: TEXT, margin: 0, paraSpaceAfter: 6, valign: "top" });
}
// 3 · o problema
{
  const s = base(); title(s, "Por que um chat genérico não serve ao hospital", "Três falhas estruturais das APIs de IA generativa no uso clínico");
  const cols = [["Alucina com confiança", "Modelos de linguagem completam texto; não sabem o que não sabem. Dose, nome comercial e referência inventados saem com a mesma fluência de um fato."], ["Muda sem avisar", "A mesma pergunta, seis meses depois, pode ter outra resposta — o modelo no servidor do fornecedor foi trocado. Pesquisa e protocolo deixam de ser reprodutíveis."], ["Leva o dado embora", "Prompt com histórico do paciente atravessa o Atlântico. LGPD art. 11 e o sigilo médico passam a depender de contrato com terceiro estrangeiro."]];
  cols.forEach(([h, b], i) => { const x = M + i * 4.1; s.addText(String(i + 1), { x, y: 1.9, w: 0.8, h: 0.9, fontSize: 54, fontFace: TF, bold: true, color: ACCENT, margin: 0 }); s.addText(h, { x, y: 2.85, w: 3.7, h: 0.6, fontSize: 21, fontFace: BF, bold: true, color: PRIMARY, margin: 0 }); s.addText(b, { x, y: 3.5, w: 3.7, h: 2.2, fontSize: 15, fontFace: BF, color: TEXT, margin: 0, valign: "top" }); });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.85, w: W, h: 0.85, fill: { color: TINT }, line: { color: TINT } });
  s.addText("A resposta da BeansTech não é um modelo melhor. É uma cadeia em que o modelo é a peça menos confiável — e é tratado como tal.", { x: M, y: 5.95, w: W - 2 * M, h: 0.65, fontSize: 17, fontFace: TF, italic: true, color: PRIMARY, margin: 0, valign: "middle" });
}
// 4 · cadeia anti-alucinação (fluxo)
{
  const s = base(); title(s, "A cadeia anti-alucinação", "Seis camadas, em ordem fixa. Sem trecho recuperado, nenhum modelo é chamado.");
  const steps = [["1", "RagMed", "Busca híbrida (BM25 + vetorial) no acervo autorizado — PCDT, Anvisa, SciELO — em Elasticsearch, São Paulo"], ["2", "Síntese", "Modelo rápido escreve só sobre os trechos, com citação por afirmação (JSON)"], ["3", "Identidade & cota", "Quem pergunta, por qual tenant, com que orçamento — PolarDB, São Paulo"], ["4", "Segredos", "Nenhuma chave em código: KMS 3.0, credenciais renderizadas por papel da máquina"], ["5", "Verificação", "Cada afirmação é conferida contra o trecho citado (reranker médico, CPU em SP); PII removida antes de qualquer modelo"], ["6", "Excelência", "Caso difícil ou síntese fraca → modelo de 235B refaz a resposta sobre os mesmos trechos"]];
  const bw = 1.95, gap = 0.1, y = 2.0;
  steps.forEach(([k, h, b], i) => { const x = M + i * (bw + gap); s.addShape(pres.shapes.RECTANGLE, { x, y, w: bw, h: 1.05, fill: { color: i === 0 || i === 4 ? PRIMARY : TINT }, line: { color: i === 0 || i === 4 ? PRIMARY : TINT } }); s.addText(k + "  " + h, { x: x + 0.12, y: y + 0.05, w: bw - 0.24, h: 0.95, fontSize: 15, fontFace: BF, bold: true, color: i === 0 || i === 4 ? "FFFFFF" : PRIMARY, margin: 0, valign: "middle" }); s.addText(b, { x: x + 0.05, y: y + 1.2, w: bw - 0.1, h: 2.3, fontSize: 12.5, fontFace: BF, color: TEXT, margin: 0, valign: "top" }); if (i < 5) s.addText("›", { x: x + bw - 0.02, y: y + 0.2, w: gap + 0.06, h: 0.6, fontSize: 22, fontFace: BF, color: MUTED, margin: 0, align: "center" }); });
  s.addShape(pres.shapes.LINE, { x: M, y: 5.75, w: W - 2 * M, h: 0, line: { color: LINE, width: 0.75 } });
  s.addText([T("Resultado: ", { bold: true, color: PRIMARY }), T("supported · partial · insufficient", { bold: true, color: ACCENT }), T(" — a resposta diz o que sustenta, o que falta e de onde veio (documento, revisão, página). Afirmação sem suporte é removida, não suavizada.", {})], { x: M, y: 5.85, w: W - 2 * M, h: 0.8, fontSize: 15, fontFace: BF, color: TEXT, margin: 0 });
  src(s, "Fonte: healthtech/shared/evidence-chain (BeansTech, 2026); RAGMED — portal, dados e fluxos §6–9.");
}
// 5 · contrato de resposta (exemplo)
{
  const s = base(); title(s, "O que o médico recebe", "Cada afirmação carrega sua prova. Exemplo ilustrativo do contrato de resposta.");
  s.addShape(pres.shapes.RECTANGLE, { x: M, y: 1.9, w: 7.3, h: 4.4, fill: { color: TINT }, line: { color: TINT } });
  const rows = [["Pergunta", "Dose pediátrica de dipirona por via oral?"], ["Afirmação", "A dose habitual em crianças é 10–15 mg/kg por dose, até 4 vezes ao dia. [1]"], ["Evidência [1]", "Bula profissional — Anvisa · registro · revisão sha256:9c1e… · p. 3"], ["Suporte", "supported (0,91 — verificador medpubr)"], ["Aplicabilidade", "Crianças > 3 meses; não cobre insuficiência renal"], ["Faltou", "Peso do paciente para calcular a dose absoluta"]];
  rows.forEach(([k, v], i) => { const y = 2.05 + i * 0.7; s.addText(k, { x: M + 0.2, y, w: 1.7, h: 0.6, fontSize: 13, fontFace: BF, bold: true, color: PRIMARY, margin: 0, valign: "middle" }); s.addText(v, { x: M + 2.0, y, w: 5.1, h: 0.6, fontSize: 13.5, fontFace: BF, color: i === 3 ? ACCENT : TEXT, bold: i === 3, margin: 0, valign: "middle" }); });
  s.addText([T("Por que isso importa", { bold: true, color: PRIMARY, breakLine: true }), T(" ", { fontSize: 6, breakLine: true }), T("O profissional abre o trecho original, compara versões e vê onde o conhecimento termina.", { bullet: bu(), breakLine: true }), T("Auditoria: resposta → trechos → documento → revisão. Reprodutível meses depois.", { bullet: bu(), breakLine: true }), T("A mesma API serve IAs parceiras e sistemas do hospital (OpenAPI, token por tenant).", { bullet: bu(), breakLine: true }), T("Abstenção é resposta válida: \"insufficient\" em vez de chute.", { bullet: bu() })], { x: 8.3, y: 1.9, w: 4.45, h: 4.4, fontSize: 14.5, fontFace: BF, color: TEXT, margin: 0, paraSpaceAfter: 8, valign: "top" });
  src(s, "Ilustrativo — valores e citação de exemplo; o formato é o do contrato JSON de resposta (RAGMED §9).");
}
// 6 · infraestrutura soberana (diagrama)
{
  const s = base(); title(s, "Onde cada coisa roda", "Dado clínico em São Paulo. Para fora vai texto sem identificação — e só quando há trecho.");
  const box = (x, y, w, h, fill, line) => s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: line, width: 1 } });
  box(M, 1.9, 6.3, 4.4, TINT, TINT); s.addText("São Paulo (sa-east-1) — Alibaba Cloud", { x: M + 0.2, y: 1.98, w: 5.9, h: 0.4, fontSize: 15, fontFace: BF, bold: true, color: PRIMARY, margin: 0 });
  const sp = [["Portais", "9 sites + BeansTech ID + CMS · Caddy/TLS"], ["Evidência", "Elasticsearch 9.5 (RagMed) · 4 TB"], ["Clínico", "PostgreSQL 17 · restauração a qualquer segundo"], ["Identidade", "PolarDB MySQL · 2 nós · failover automático"], ["Verificação", "medpubr: BGE-M3, reranker, PII/NER — CPU"], ["Cofre", "KMS 3.0 · backups cifrados em OSS"]];
  sp.forEach(([k, v], i) => { const y = 2.5 + i * 0.6; s.addText(k, { x: M + 0.25, y, w: 1.5, h: 0.5, fontSize: 13, fontFace: BF, bold: true, color: TEXT, margin: 0, valign: "middle" }); s.addText(v, { x: M + 1.8, y, w: 4.3, h: 0.5, fontSize: 13, fontFace: BF, color: TEXT, margin: 0, valign: "middle" }); });
  box(7.6, 1.9, 5.15, 2.0, "FFFFFF", LINE); s.addText("Singapura — modelos", { x: 7.8, y: 1.98, w: 4.8, h: 0.4, fontSize: 15, fontFace: BF, bold: true, color: PRIMARY, margin: 0 });
  s.addText([T("Model Studio (Qwen) — síntese rápida", { bullet: bu(), breakLine: true }), T("2× ECS 2×L20: medgemma 27B · Lingshu-32B · Baichuan-M2 · guardrails", { bullet: bu() })], { x: 7.8, y: 2.45, w: 4.8, h: 1.4, fontSize: 13, fontFace: BF, color: TEXT, margin: 0, paraSpaceAfter: 6 });
  box(7.6, 4.1, 5.15, 2.2, "FFFFFF", LINE); s.addText("Virgínia — excelência", { x: 7.8, y: 4.18, w: 4.8, h: 0.4, fontSize: 15, fontFace: BF, bold: true, color: PRIMARY, margin: 0 });
  s.addText([T("Baichuan-M3-235B (Qwen3-MoE, Apache-2.0) em 4× L20 — INT4 oficial, contexto 32k", { bullet: bu(), breakLine: true }), T("Acionado só em caso difícil; recebe os trechos, nunca o prontuário", { bullet: bu() })], { x: 7.8, y: 4.65, w: 4.8, h: 1.6, fontSize: 13, fontFace: BF, color: TEXT, margin: 0, paraSpaceAfter: 6 });
  s.addText("PII removida →", { x: 6.85, y: 3.05, w: 0.9, h: 0.6, fontSize: 11, fontFace: BF, bold: true, color: ACCENT, margin: 0, align: "center" });
  src(s, "Inventário verificado por API na conta Alibaba Cloud em 13–15/09/2026 (ALIBABA-HEALTHTECH-2026-09.md).");
}
// 7 · modelos (tabela)
{
  const s = base(); title(s, "Quatro níveis de modelo — todos de peso aberto", "Substituíveis sem perder o acervo, o benchmark ou a trilha. Escolha por medição, não por marca.");
  const hdr = ["Nível", "Modelo", "Licença", "Papel", "Onde"];
  const rows = [["Rápido", "Qwen (Model Studio)", "API Alibaba", "Síntese com citações; volume", "Singapura"], ["Clínico", "MedGemma 27B · Granite Guardian", "Gemma / Apache-2.0", "Revisão clínica; guardrails; PT-BR", "Singapura, GPU própria"], ["Multimodal", "Lingshu-32B · Lingshu-I-8B", "MIT", "Imagem médica + texto (candidatos)", "Singapura, GPU própria"], ["Excelência", "Baichuan-M3-235B (Qwen3-MoE)", "Apache-2.0", "Casos difíceis; segunda síntese", "Virgínia, 4× L20"]];
  const data = [hdr.map(h => ({ text: h, options: { bold: true, color: "FFFFFF", fill: { color: PRIMARY }, fontFace: BF, fontSize: 13 } })), ...rows.map((r, i) => r.map((c, j) => ({ text: c, options: { fontFace: BF, fontSize: 13, color: j === 0 ? PRIMARY : TEXT, bold: j === 0, fill: { color: i % 2 ? "FFFFFF" : TINT } } })))];
  s.addTable(data, { x: M, y: 1.95, w: W - 2 * M, colW: [1.6, 3.4, 2.0, 3.3, 1.83], rowH: 0.62, border: { type: "solid", pt: 0.5, color: LINE }, valign: "middle" });
  s.addText([T("Embeddings: ", { bold: true, color: PRIMARY }), T("BGE-M3 (multilíngue) como padrão; MedCPT e Qwen3-Embedding-Medical em avaliação por recall PT→PT e PT→EN. ", {}), T("Regra: ", { bold: true, color: PRIMARY }), T("modelo entra por benchmark cego com revisão clínica; concordância entre modelos não substitui evidência.", {})], { x: M, y: 5.35, w: W - 2 * M, h: 1.0, fontSize: 14, fontFace: BF, color: TEXT, margin: 0 });
  src(s, "Licenças conferidas nas model cards (Hugging Face) em 15/09/2026. Lingshu e Baichuan-M3 em implantação; desempenho clínico ainda não medido.");
}
// 8 · segurança e conformidade
{
  const s = base(); title(s, "Conformidade desde o desenho", "Não é um anexo jurídico: são controles já implantados e verificáveis");
  const items = [["Identidade única", "BeansTech ID (Keycloak, OIDC): senha Argon2, TOTP obrigatório para profissional, passkeys; pronto para gov.br e certificado ICP-Brasil; SSO da instituição por SAML/OIDC"], ["Segredos", "KMS 3.0: nenhuma credencial em código ou disco; rotação sem redeploy manual"], ["Dados clínicos", "Postgres em SP com arquivamento contínuo cifrado (AES-256): restauração a qualquer ponto no tempo — perda máxima ≈ 5 min; ensaio de restauração executado"], ["Trilha", "Login, acesso, chave de API e cada resposta (trechos, modelo, versão) auditáveis — LGPD art. 37; sigilo profissional (CFM)"], ["Minimização", "PII removida antes de qualquer modelo; treinamento com dado de paciente: nunca por padrão"], ["Resiliência", "Snapshots diários, backups sem permissão de exclusão, alarmes 24×7, réplica de GPU por imagem"]];
  items.forEach(([h, b], i) => { const col = i % 2, row = Math.floor(i / 2); const x = M + col * 6.2, y = 1.9 + row * 1.45; s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.08, w: 0.14, h: 0.14, fill: { color: ACCENT }, line: { color: ACCENT } }); s.addText(h, { x: x + 0.3, y, w: 5.6, h: 0.35, fontSize: 15, fontFace: BF, bold: true, color: PRIMARY, margin: 0 }); s.addText(b, { x: x + 0.3, y: y + 0.36, w: 5.6, h: 1.0, fontSize: 12.5, fontFace: BF, color: TEXT, margin: 0, valign: "top" }); });
  src(s, "Estado verificado em 15/09/2026. Adequação regulatória específica (CFM, ANS, CEP/CONEP) é definida com cada instituição no piloto.");
}
// 9 · estado atual
{
  const s = base(); title(s, "Não é conceito: está no ar", "Entregas verificáveis em 15 de setembro de 2026");
  const live = ["dodr.ai · app.dodr.ai", "exame.tech", "prontuario.tech", "drogaria.tech", "beanshealth.com.br", "portaldodentista.ai", "drhealth.tech", "petiq.tech", "id.beanstech.com.br (login)", "cms.beanstech.com.br (conteúdo)"];
  s.addText("No ar", { x: M, y: 1.9, w: 3, h: 0.4, fontSize: 15, fontFace: BF, bold: true, color: PRIMARY, margin: 0 });
  live.forEach((d, i) => { const col = i % 2, row = Math.floor(i / 2); s.addText(d, { x: M + col * 2.95, y: 2.35 + row * 0.5, w: 2.9, h: 0.45, fontSize: 13.5, fontFace: BF, color: TEXT, margin: 0, valign: "middle" }); });
  s.addShape(pres.shapes.LINE, { x: 6.6, y: 1.9, w: 0, h: 4.3, line: { color: LINE, width: 0.75 } });
  const k = [["3", "máquinas GPU próprias (2 em Singapura, 1 em Virgínia) com modelos médicos residentes"], ["12", "bancos Postgres + identidade gerenciada, com restauração a ponto no tempo"], ["1", "cadeia de evidência compartilhada por todos os portais e pela API para parceiros"]];
  k.forEach(([a, b], i) => { const y = 1.9 + i * 1.45; s.addText(a, { x: 6.9, y, w: 1.2, h: 1.1, fontSize: 54, fontFace: TF, bold: true, color: ACCENT, margin: 0, valign: "middle" }); s.addText(b, { x: 8.2, y: y + 0.15, w: 4.5, h: 0.9, fontSize: 14.5, fontFace: BF, color: TEXT, margin: 0, valign: "middle" }); });
  src(s, "Verificação: HTTP 200 nos domínios, inventário de ECS/PolarDB/KMS por API — ALIBABA-HEALTHTECH-2026-09.md §3, §9, §10, §13.");
}
// 10 · o que cada instituição leva (tabela)
{
  const s = base(); title(s, "O mesmo motor, cinco usos", "O que propomos validar com cada instituição — e o que ela ganha");
  const hdr = ["Instituição", "Uso proposto", "Ganho esperado", "O que validamos juntos"];
  const rows = [["Einstein", "Pesquisa clínica reprodutível: modelo, versão e corpus fixados por estudo; benchmark cego PT-BR", "Publicação com IA auditável; IP do modelo ajustado fica com o hospital", "Erro clínico adjudicado por especialistas; reprodutibilidade em 6 meses"], ["São Luiz / Rede D'Or", "Evidência à beira-leito e apoio a laudo com citação (protocolos e bulas vigentes)", "Menos tempo de busca; menos variação entre unidades", "Tempo por consulta de protocolo; taxa de abstenção correta"], ["Notre Dame Intermédica", "Escala em atenção primária: PCDT/SUS e linhas de cuidado padronizadas na rede", "Padronização em centenas de unidades; custo por resposta baixo", "Aderência a protocolo; custo por resposta aprovada"], ["SulAmérica", "Segunda opinião e auditoria de sinistro com evidência citável; API com cota por parceiro", "Decisão defensável perante beneficiário e ANS", "Concordância com auditor; trilha completa por decisão"], ["CRM-SP", "Referência ética: abstenção, sem diagnóstico autônomo, trilha por resposta", "Parâmetro público para IA médica no estado", "Critérios de transparência e responsabilidade profissional"]];
  const data = [hdr.map(h => ({ text: h, options: { bold: true, color: "FFFFFF", fill: { color: PRIMARY }, fontFace: BF, fontSize: 12.5 } })), ...rows.map((r, i) => r.map((c, j) => ({ text: c, options: { fontFace: BF, fontSize: 11.5, color: j === 0 ? PRIMARY : TEXT, bold: j === 0, fill: { color: i % 2 ? "FFFFFF" : TINT }, valign: "middle" } })))];
  s.addTable(data, { x: M, y: 1.85, w: W - 2 * M, colW: [2.0, 4.0, 3.2, 2.93], rowH: [0.45, 0.82, 0.82, 0.82, 0.82, 0.82], border: { type: "solid", pt: 0.5, color: LINE } });
  src(s, "Propostas de validação; não pressupõem parceria, endosso ou disponibilidade de dados das instituições.");
}
// 11 · piloto 90 dias
{
  const s = base(); title(s, "Piloto de 90 dias, com métricas combinadas antes", "Uma tarefa definida pela instituição; revisores independentes; relatório de erros e custo ao final");
  const ph = [["Dias 0–30", "Escopo e linha de base", "Especialidade e coleção (ex.: PCDT + bulas); 200 perguntas reais anonimizadas; medir como a equipe responde hoje"], ["Dias 30–60", "Piloto cego", "Respostas do DoDr vs. baseline, revisadas sem saber a origem; casos de abstenção e de atualização de diretriz"], ["Dias 60–90", "Relatório e decisão", "Erros com impacto clínico adjudicados; recall e fundamentação; tempo poupado; custo por resposta aprovada"]];
  ph.forEach(([d, h, b], i) => { const x = M + i * 4.1; s.addShape(pres.shapes.RECTANGLE, { x, y: 1.95, w: 3.85, h: 0.55, fill: { color: i === 1 ? ACCENT : PRIMARY }, line: { color: i === 1 ? ACCENT : PRIMARY } }); s.addText(d, { x: x + 0.15, y: 1.95, w: 3.6, h: 0.55, fontSize: 15, fontFace: BF, bold: true, color: "FFFFFF", margin: 0, valign: "middle" }); s.addText(h, { x, y: 2.65, w: 3.85, h: 0.45, fontSize: 18, fontFace: TF, bold: true, color: PRIMARY, margin: 0 }); s.addText(b, { x, y: 3.15, w: 3.85, h: 1.6, fontSize: 13.5, fontFace: BF, color: TEXT, margin: 0, valign: "top" }); });
  s.addShape(pres.shapes.LINE, { x: M, y: 4.95, w: W - 2 * M, h: 0, line: { color: LINE, width: 0.75 } });
  s.addText("Critérios de liberação", { x: M, y: 5.05, w: 4, h: 0.35, fontSize: 14, fontFace: BF, bold: true, color: PRIMARY, margin: 0 });
  const crit = ["Fundamentação: fração de afirmações realmente sustentadas pelo trecho citado", "Abstenção: nem responder sem evidência, nem recusar quando há suporte", "Clínica: erros graves não resolvidos bloqueiam a promoção — sem exceção", "Privacidade: zero vazamento entre tenants, logs e cache"];
  crit.forEach((c, i) => s.addText(c, { x: M + (i % 2) * 6.2, y: 5.45 + Math.floor(i / 2) * 0.42, w: 6.0, h: 0.4, fontSize: 12.5, fontFace: BF, color: TEXT, margin: 0, bullet: bu() }));
  src(s, "Metodologia: RAGMED §11 (dimensões de avaliação e critérios de liberação).");
}
// 12 · economia (gráfico)
{
  const s = base(); title(s, "Custo por resposta — e por que a escala muda tudo", "Estimativa com a infraestrutura atual; o piloto substitui a estimativa por medição");
  s.addChart(pres.charts.BAR, [{ name: "US$ por resposta", labels: ["10 mil/mês", "25 mil/mês", "50 mil/mês", "100 mil/mês"], values: [0.42, 0.19, 0.12, 0.07] }], { x: M, y: 1.9, w: 7.4, h: 4.3, barDir: "col", chartColors: [PRIMARY, PRIMARY, ACCENT, PRIMARY], varyColors: true, chartArea: { fill: { color: "FFFFFF" } }, catAxisLabelColor: MUTED, valAxisLabelColor: MUTED, catAxisLabelFontFace: BF, valAxisLabelFontFace: BF, valGridLine: { color: LINE, size: 0.5 }, catGridLine: { style: "none" }, showValue: true, dataLabelPosition: "outEnd", dataLabelColor: TEXT, dataLabelFontFace: BF, dataLabelFormatCode: "$0.00", showLegend: false, valAxisTitle: "US$ / resposta (infra rateada + GPU)", showValAxisTitle: true, valAxisTitleColor: MUTED, catAxisTitle: "respostas aprovadas por mês", showCatAxisTitle: true, catAxisTitleColor: MUTED });
  s.addText("US$ 0,03–0,12", { x: 8.4, y: 1.9, w: 4.4, h: 0.9, fontSize: 40, fontFace: TF, bold: true, color: ACCENT, margin: 0 });
  s.addText("custo marginal por resposta com evidência, acima de ~25 mil respostas/mês", { x: 8.4, y: 2.8, w: 4.3, h: 0.7, fontSize: 14, fontFace: BF, color: TEXT, margin: 0 });
  s.addText([T("O que pesa: ", { bold: true, color: PRIMARY }), T("a GPU de excelência (≈ US$ 7 mil/mês) — por isso ela só entra em caso difícil.", { breakLine: true }), T(" ", { fontSize: 6, breakLine: true }), T("O que não pesa: ", { bold: true, color: PRIMARY }), T("síntese rápida coberta por plano pré-pago; verificação em CPU no Brasil.", { breakLine: true }), T(" ", { fontSize: 6, breakLine: true }), T("Referência de lista: ", { bold: true, color: PRIMARY }), T("US$ 0,50 por resposta via API ou R$ 149/mês por profissional (500 respostas).", {})], { x: 8.4, y: 3.6, w: 4.3, h: 2.6, fontSize: 13, fontFace: BF, color: TEXT, margin: 0, valign: "top" });
  src(s, "Estimativa (ALIBABA-HEALTHTECH-2026-09.md §6.2), custos de infraestrutura da fatura de set/2026. Valores ilustrativos até a medição do piloto.");
}
// 13 · limites
{
  const s = base(); title(s, "O que ainda não está provado", "Dizer isso agora é parte do método");
  const lim = [["Modelos novos", "Lingshu-32B e Baichuan-M3 estão em implantação; nenhum número de desempenho clínico foi medido ainda."], ["Coleção inicial", "PCDT, bulas Anvisa e SciELO estão em ingestão; cada documento entra com licença, versão e vigência revisadas."], ["Uso pretendido", "Apoio à decisão e consulta a evidência. Não é dispositivo diagnóstico; qualquer uso regulado passa por CEP/CONEP e Anvisa."], ["Instituições", "Nada aqui pressupõe parceria, endosso ou dados de Einstein, Rede D'Or, Notre Dame, SulAmérica ou CRM-SP."]];
  lim.forEach(([h, b], i) => { const y = 1.95 + i * 1.05; s.addText(h, { x: M, y, w: 3.0, h: 0.9, fontSize: 17, fontFace: BF, bold: true, color: PRIMARY, margin: 0, valign: "middle" }); s.addText(b, { x: M + 3.2, y, w: 8.9, h: 0.9, fontSize: 14.5, fontFace: BF, color: TEXT, margin: 0, valign: "middle" }); if (i < 3) s.addShape(pres.shapes.LINE, { x: M, y: y + 0.98, w: W - 2 * M, h: 0, line: { color: LINE, width: 0.75 } }); });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 6.2, w: W, h: 0.6, fill: { color: TINT }, line: { color: TINT } });
  s.addText("O ativo que fica é o acervo autorizado, o benchmark clínico brasileiro e a trilha — os modelos são trocáveis.", { x: M, y: 6.25, w: W - 2 * M, h: 0.5, fontSize: 15, fontFace: TF, italic: true, color: PRIMARY, margin: 0, valign: "middle" });
}
// 14 · próximos passos
{
  const s = base(true); title(s, "Próximos passos", "O que pedimos a cada instituição", true);
  const steps = ["Reunião de 45 min com a equipe clínica e de dados para escolher a tarefa do piloto", "Definição conjunta das métricas e dos limiares de liberação antes de qualquer resposta ser gerada", "200 perguntas reais anonimizadas e dois revisores independentes", "Acordo de confidencialidade e, se aplicável, protocolo ao CEP", "Relatório de 90 dias: erros, abstenções, custo por resposta e recomendação de seguir ou parar"];
  steps.forEach((t, i) => { const y = 1.95 + i * 0.82; s.addText(String(i + 1), { x: M, y, w: 0.8, h: 0.7, fontSize: 34, fontFace: TF, bold: true, color: ACCENT, margin: 0, valign: "middle" }); s.addText(t, { x: M + 1.0, y, w: 8.2, h: 0.7, fontSize: 16, fontFace: BF, color: "FFFFFF", margin: 0, valign: "middle" }); });
  s.addShape(pres.shapes.LINE, { x: 10.2, y: 1.95, w: 0, h: 4.0, line: { color: "3E6B66", width: 0.75 } });
  s.addText([T("BeansTech", { bold: true, breakLine: true, fontSize: 20, fontFace: TF }), T(" ", { fontSize: 6, breakLine: true }), T("dodr.ai", { breakLine: true }), T("id.beanstech.com.br", { breakLine: true }), T("contato@feijaojustech.com.br", { breakLine: true }), T(" ", { fontSize: 6, breakLine: true }), T("Matheus Ximenes", { bold: true })], { x: 10.5, y: 2.0, w: 2.4, h: 3.5, fontSize: 13.5, fontFace: BF, color: "B9D3CF", margin: 0, valign: "top" });
}
pres.writeFile({ fileName: "DoDr_BeansTech_Instituicoes_2026-09.pptx" }).then(f => console.log("ok", f));
