// BeansTech × Z.ai — Sovereign AI for Regulated Markets
// 16:9 print-ready deck · navy/gold/white · English · 12 slides
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "A4L", width: 13.33, height: 7.5 });
p.layout = "A4L"; p.author = "BeansTech"; p.company = "BeansTech";
p.title = "BeansTech × Z.ai — Sovereign AI for Regulated Markets";
const W = 13.33, H = 7.5, M = 0.55;
const NAVY = "0A1628", NAVY2 = "0D1F35", GOLD = "C9A227", GOLDLT = "E8C847", BLUE = "2E6FAF", RED = "B0342C";
const TEXT = "1A2332", MUTED = "5A6B7A", LIGHT = "F0F4F7", BORDER = "C8D2DA", WHITE = "FFFFFF";
const SANS = "Helvetica Neue", SERIF = "Georgia";
let n = 0;

function footer(s, dark=false) {
  n++;
  s.addText(`BeansTech × Z.ai — Confidential`, { x: M, y: H-0.38, w: 6, h: 0.28, fontSize: 8, fontFace: SANS, color: dark ? "6B8BB0" : MUTED, margin: 0 });
  s.addText(String(n), { x: W-M-0.5, y: H-0.38, w: 0.5, h: 0.28, fontSize: 8, fontFace: SANS, color: dark ? "6B8BB0" : MUTED, align: "right", margin: 0 });
}
function title(s, t, sub, dark=false) {
  s.addText(t, { x: M, y: 0.35, w: W-2*M, h: 0.7, fontSize: 30, fontFace: SANS, bold: true, color: dark ? GOLDLT : NAVY, margin: 0, charSpacing: 0 });
  if (sub) s.addText(sub, { x: M, y: 1.0, w: W-2*M, h: 0.4, fontSize: 13, fontFace: SANS, color: dark ? "8FB0C8" : MUTED, margin: 0 });
  if (!dark) s.addShape(p.shapes.LINE, { x: M, y: 1.42, w: 2.4, h: 0, line: { color: GOLD, width: 3 } });
  else s.addShape(p.shapes.LINE, { x: M, y: 1.42, w: 2.4, h: 0, line: { color: GOLD, width: 3 } });
}
const bu = () => ({ code: "2013", indent: 10 });
const buG = () => ({ code: "25B8", indent: 10 });

// ════════════════════════════════════════════════════
// S1 · COVER
// ════════════════════════════════════════════════════
{
  const s = p.addSlide(); s.background = { color: NAVY };
  s.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: NAVY }, line: { color: NAVY } });
  // gold ring accent
  s.addShape(p.shapes.OVAL, { x: W-2.6, y: 0.5, w: 1.8, h: 1.8, fill: { color: NAVY, transparency: 100 }, line: { color: GOLD, width: 2 } });
  s.addShape(p.shapes.OVAL, { x: W-2.3, y: 0.8, w: 1.2, h: 1.2, fill: { color: NAVY, transparency: 100 }, line: { color: GOLDLT, width: 1 } });
  s.addText("Z", { x: W-2.3, y: 0.8, w: 1.2, h: 1.2, fontSize: 42, fontFace: SANS, bold: true, color: GOLDLT, align: "center", valign: "middle", margin: 0 });
  s.addText("BEANSTECH  ×  Z.AI", { x: M, y: 1.6, w: 8, h: 0.5, fontSize: 16, fontFace: SANS, color: GOLDLT, charSpacing: 4, bold: true, margin: 0 });
  s.addText("Sovereign AI for\nRegulated Markets", { x: M, y: 2.2, w: 9.5, h: 2.2, fontSize: 48, fontFace: SANS, bold: true, color: WHITE, margin: 0, lineSpacing: 54 });
  s.addText("Bringing GLM to Latin America's largest economy — with data sovereignty,\nenergy independence, and auditability as design principles, not afterthoughts.", { x: M, y: 4.4, w: 9, h: 1.2, fontSize: 14, fontFace: SERIF, color: "B0C4D4", margin: 0, lineSpacing: 20 });
  s.addShape(p.shapes.LINE, { x: M, y: 5.7, w: 3, h: 0, line: { color: GOLD, width: 2 } });
  s.addText([
    { text: "US$ 300,000,000", options: { fontSize: 28, fontFace: SANS, bold: true, color: GOLDLT, breakLine: true } },
    { text: "Strategic Partnership Value", options: { fontSize: 11, fontFace: SANS, color: "8FB0C8" } }
  ], { x: M, y: 5.9, w: 6, h: 1.0, margin: 0 });
  s.addText("Matheus Ximenes · Founder & CEO\nAttorney · Postgraduate in Cloud Computing & Data Protection\nSeptember 2026 · São Paulo, Brazil", { x: W-M-4.5, y: 5.9, w: 4.5, h: 0.9, fontSize: 9, fontFace: SANS, color: "6B8BB0", align: "right", margin: 0, lineSpacing: 14 });
  footer(s, true);
}

// ════════════════════════════════════════════════════
// S2 · EXECUTIVE SUMMARY
// ════════════════════════════════════════════════════
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "Executive Summary", "The foundation already exists — the partnership scales it globally");
  const stats = [["US$ 300M","Partnership Value"],["US$ 8.2B","Market (BR Regulated)"],["75","Production Domains"],["2","Data Centers (1 Carbon-Free)"],["1.75M+","Professionals (BR)"]];
  stats.forEach(([v,l],i) => {
    const x = M + i * 2.42;
    s.addShape(p.shapes.RECTANGLE, { x, y: 1.7, w: 2.2, h: 1.3, fill: { color: LIGHT }, line: { color: BORDER, width: 1 } });
    s.addText(v, { x, y: 1.78, w: 2.2, h: 0.6, fontSize: 22, fontFace: SANS, bold: true, color: NAVY, align: "center", margin: 0 });
    s.addText(l, { x, y: 2.38, w: 2.2, h: 0.5, fontSize: 8.5, fontFace: SANS, color: MUTED, align: "center", margin: 0, charSpacing: 1 });
  });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 3.3, w: W-2*M, h: 1.5, fill: { color: NAVY }, line: { color: NAVY } });
  s.addText([
    { text: "The hardest part — the model — already exists.", options: { bold: true, color: GOLDLT, fontSize: 15, breakLine: true } },
    { text: "What typically takes years to build is already operational: a multi-vertical platform spanning healthcare, legal, financial, real estate and AI infrastructure — 75 production domains, 6 frontier models in production, 67M+ court decisions indexed, sovereign identity and compliance infrastructure, and secured land for two data centers (one carbon-free). A clinical benchmark independently validated GLM-5.3 as the top performer.", options: { color: "B0C4D4", fontSize: 11.5 } }
  ], { x: M+0.3, y: 3.5, w: W-2*M-0.6, h: 1.1, margin: 0, lineSpacing: 16 });
  // two columns: what Z.ai gains / what BeansTech brings
  s.addText("What Z.ai Gains", { x: M, y: 5.0, w: 5.8, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: BLUE, margin: 0 });
  s.addText([
    { text: "Sovereign presence — first frontier model with API executed in Brazilian territory", options: { bullet: buG(), breakLine: true } },
    { text: "Market access — 550k physicians, 1.2M attorneys, 740 financial institutions", options: { bullet: buG(), breakLine: true } },
    { text: "Premium domains — z.cloud and glm.cloud as the joint product identity", options: { bullet: buG(), breakLine: true } },
    { text: "Energy independence — solar-powered data centers, ESG-auditable", options: { bullet: buG() } }
  ], { x: M, y: 5.4, w: 5.8, h: 1.6, fontSize: 10.5, fontFace: SANS, color: TEXT, margin: 0, paraSpaceAfter: 6 });
  s.addText("What BeansTech Brings", { x: 7.0, y: 5.0, w: 5.8, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: BLUE, margin: 0 });
  s.addText([
    { text: "Full-stack platform — 75 production domains, 6 frontier models, 67M+ indexed court decisions, identity + compliance infrastructure, 2 data center sites secured", options: { bullet: buG(), breakLine: true } },
    { text: "Clinical benchmark — 156 evaluations, zero errors, GLM-5.3 validated", options: { bullet: buG(), breakLine: true } },
    { text: "75 production domains across 6 regulated verticals", options: { bullet: buG(), breakLine: true } },
    { text: "Regulatory expertise — founder attorney, 12 years Judiciary", options: { bullet: buG() } }
  ], { x: 7.0, y: 5.4, w: 5.8, h: 1.6, fontSize: 10.5, fontFace: SANS, color: TEXT, margin: 0, paraSpaceAfter: 6 });
  footer(s);
}

// ════════════════════════════════════════════════════
// S3 · THE BENCHMARK
// ════════════════════════════════════════════════════
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "The Benchmark That Validated This Partnership", "26 real Brazilian clinical cases · 6 frontier models · 156 evaluations · zero errors");
  const rows = [
    ["Model", "Coverage", "Speed", "Best Domain", "Security"],
    ["GLM-5.3 (Z.ai)", "0.45 ★", "93 tok/s", "Surgery 0.88 · Management 0.67", "1 (best)"],
    ["Baichuan-M2-32B", "0.45", "41 tok/s", "Medication 0.57 · Veterinary 0.62", "1"],
    ["Qwen-plus (Alibaba)", "0.44", "51 tok/s", "Surgery 0.75", "2"],
    ["AntAngelMed-100B", "0.41", "149 tok/s", "Native PT reasoning", "3"],
    ["Baichuan-M3-235B", "0.39", "71 tok/s", "Emergency 0.63", "2"],
    ["MedGemma-27B (Google)", "0.39", "25 tok/s", "Emergency 0.63", "2"],
  ];
  const tData = rows.map((r,i) => r.map((c,j) => ({
    text: c,
    options: {
      fontFace: SANS, fontSize: i===0 ? 9 : 10, bold: i===0 || (i===1 && j===1),
      color: i===0 ? GOLDLT : (i===1 ? NAVY : TEXT),
      fill: { color: i===0 ? NAVY : i===1 ? LIGHT : (i%2===0 ? LIGHT : WHITE) },
      align: j===0 ? "left" : "center", valign: "middle"
    }
  })));
  s.addTable(tData, { x: M, y: 1.7, w: W-2*M, colW: [3.0, 1.5, 1.5, 4.33, 2.0], rowH: 0.42, border: { type: "solid", pt: 0.5, color: BORDER } });
  // gold highlight box
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 5.0, w: W-2*M, h: 1.6, fill: { color: NAVY }, line: { color: GOLD, width: 1.5 } });
  s.addText([
    { text: "What impressed us most was not the score — it was the character.", options: { bold: true, color: GOLDLT, fontSize: 13, breakLine: true } },
    { text: "GLM-5.3 was the only model that identified rivaroxaban 20mg as an excessive dose for CrCl 28, cited ANVISA as the Brazilian regulatory source, mentioned andexanet alfa as a specific Factor Xa reversal agent — and said explicitly: \"I cannot assert the exact dose without consulting the local protocol.\"", options: { color: "B0C4D4", fontSize: 11 } }
  ], { x: M+0.3, y: 5.2, w: W-2*M-0.6, h: 1.2, margin: 0, lineSpacing: 15 });
  s.addText("Source: BeansTech Clinical Benchmark, September 16, 2026 · Full results available for due diligence", { x: M, y: 6.75, w: W-2*M, h: 0.3, fontSize: 8, fontFace: SANS, color: MUTED, italic: true, margin: 0 });
  footer(s);
}

// ════════════════════════════════════════════════════
// S4 · z.cloud THESIS
// ════════════════════════════════════════════════════
{
  const s = p.addSlide(); s.background = { color: NAVY };
  title(s, "The z.cloud Thesis", "The AI cloud that proves what it answers", true);
  s.addShape(p.shapes.OVAL, { x: M, y: 1.7, w: 2.2, h: 2.2, fill: { color: NAVY2 }, line: { color: GOLD, width: 2.5 } });
  s.addText("Z", { x: M, y: 1.7, w: 2.2, h: 2.2, fontSize: 64, fontFace: SANS, bold: true, color: GOLDLT, align: "center", valign: "middle", margin: 0 });
  s.addText([
    { text: "The Seventh Letter", options: { bold: true, fontSize: 16, color: WHITE, breakLine: true } },
    { text: "The last letter. The one that completes.", options: { fontSize: 12, color: "B0C4D4", italic: true, breakLine: true } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "When a regulated institution asks \"where is my data processed?\" — the current answer is \"outside Brazil\" or \"we don't know.\"", options: { fontSize: 11, color: "B0C4D4", breakLine: true } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "With GLM on z.cloud, the answer is: \"In Brazilian territory, with complete audit trail, transparent abstention, and a frontier-quality model.\"", options: { fontSize: 11.5, color: GOLDLT, bold: true } }
  ], { x: 3.5, y: 1.7, w: 8.5, h: 2.4, margin: 0, lineSpacing: 16 });
  // regulated landscape table
  s.addText("Brazil's Regulated Landscape", { x: M, y: 4.2, w: 6, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: GOLDLT, margin: 0 });
  const tbl = [
    ["Sector","Regulated By","Professionals / Entities","Market (BR)"],
    ["Healthcare","CFM, ANS, LGPD","550k physicians · 6.8k hospitals","R$ 4.4B/yr"],
    ["Legal","OAB, LGPD","1.2M attorneys","R$ 80B/yr"],
    ["Financial","BACEN, COAF","740 institutions","R$ 12B/yr"],
    ["Insurance","ANS","740 operators · 48M lives","R$ 220B/yr"],
    ["TOTAL","—","~1.75M professionals","US$ 8.2B/yr"],
  ];
  const td = tbl.map((r,i) => r.map(c => ({
    text: c, options: { fontFace: SANS, fontSize: 9, bold: i===0 || i===tbl.length-1,
      color: i===0 ? GOLDLT : (i===tbl.length-1 ? GOLDLT : "B0C4D4"),
      fill: { color: i===0 ? NAVY2 : (i===tbl.length-1 ? NAVY2 : NAVY) },
      align: i===0 ? "left" : "left", valign: "middle" }
  })));
  s.addTable(td, { x: M, y: 4.6, w: W-2*M, colW: [1.8, 2.2, 3.5, 2.4], rowH: 0.36, border: { type: "solid", pt: 0.5, color: NAVY2 } });
  footer(s, true);
}

// ════════════════════════════════════════════════════
// S5 · GLM 5.3 & 5.3 FLASH ROLES
// ════════════════════════════════════════════════════
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "GLM-5.3 & GLM-5.3 Flash: Two Engines, One Platform", "Both running in Brazilian territory — API and local deployment");
  // left card: Flash
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 1.7, w: 5.8, h: 5.0, fill: { color: LIGHT }, line: { color: BORDER, width: 1 } });
  s.addText("GLM-5.3 FLASH", { x: M+0.3, y: 1.9, w: 5.2, h: 0.5, fontSize: 20, fontFace: SANS, bold: true, color: BLUE, margin: 0 });
  s.addText("The Engine — High Volume", { x: M+0.3, y: 2.4, w: 5.2, h: 0.4, fontSize: 13, fontFace: SANS, color: MUTED, italic: true, margin: 0 });
  s.addText([
    { text: "Banking compliance: AML screening, transaction monitoring, SAR pre-processing", options: { bullet: bu(), breakLine: true } },
    { text: "Legal volume: case-law search, document triage, citation extraction", options: { bullet: bu(), breakLine: true } },
    { text: "Health triage: symptom screening, protocol lookup, appointment routing", options: { bullet: bu(), breakLine: true } },
    { text: "Cost: near-zero (covered by existing Model Studio allocations)", options: { bullet: bu(), breakLine: true } },
    { text: "Latency: sub-second for standard queries", options: { bullet: bu() } }
  ], { x: M+0.3, y: 2.9, w: 5.2, h: 2.5, fontSize: 10.5, fontFace: SANS, color: TEXT, margin: 0, paraSpaceAfter: 8 });
  s.addText("Deployed via z.cloud API · Singapore region today · Brazilian territory upon data center completion", { x: M+0.3, y: 5.8, w: 5.2, h: 0.6, fontSize: 9, fontFace: SANS, color: MUTED, italic: true, margin: 0 });
  // right card: 5.3
  s.addShape(p.shapes.RECTANGLE, { x: 7.0, y: 1.7, w: 5.8, h: 5.0, fill: { color: NAVY }, line: { color: GOLD, width: 1.5 } });
  s.addText("GLM-5.3", { x: 7.3, y: 1.9, w: 5.2, h: 0.5, fontSize: 20, fontFace: SANS, bold: true, color: GOLDLT, margin: 0 });
  s.addText("The Specialist — Deep Reasoning", { x: 7.3, y: 2.4, w: 5.2, h: 0.4, fontSize: 13, fontFace: SANS, color: "8FB0C8", italic: true, margin: 0 });
  s.addText([
    { text: "Clinical decision support: complex cases, multi-morbidity, drug interactions", options: { bullet: buG(), breakLine: true } },
    { text: "Complex litigation: multi-party analysis, regulatory interpretation", options: { bullet: buG(), breakLine: true } },
    { text: "SAR narrative generation: full audit trail, regulator-ready output", options: { bullet: buG(), breakLine: true } },
    { text: "The model that won our clinical benchmark (coverage 0.45)", options: { bullet: buG(), breakLine: true } },
    { text: "Available via API in Brazil + local deployment on sovereign infra", options: { bullet: buG() } }
  ], { x: 7.3, y: 2.9, w: 5.2, h: 2.5, fontSize: 10.5, fontFace: SANS, color: "B0C4D4", margin: 0, paraSpaceAfter: 8 });
  s.addText("Fine-tuning target: coverage 0.45 → 0.70+ with Brazilian bilingual clinical dataset", { x: 7.3, y: 5.8, w: 5.2, h: 0.6, fontSize: 9, fontFace: SANS, color: GOLDLT, italic: true, margin: 0 });
  footer(s);
}

// ════════════════════════════════════════════════════
// S6 · DATA CENTER ADVANTAGE
// ════════════════════════════════════════════════════
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "The Data Center Advantage: Sovereignty, Latency, and Compute at Scale", "Santa Terezinha/PB (solar + satellite) + ZPE Caucaia/CE (same ZPE as TikTok) — eliminating the compute bottleneck that constrains every AI company today");
  // latency chart
  s.addText("Latency Comparison", { x: M, y: 1.6, w: 6, h: 0.4, fontSize: 13, fontFace: SANS, bold: true, color: NAVY, margin: 0 });
  const chartData = [{
    name: "Latency (ms)",
    labels: ["São Paulo", "Europe", "US East", "LATAM"],
    values: [180, 250, 200, 300],
  }];
  s.addChart(p.charts.BAR, [{
    name: "Singapore (current)",
    labels: ["São Paulo", "Europe", "US East", "LATAM"],
    values: [180, 250, 200, 300]
  }, {
    name: "PB/CE (proposed)",
    labels: ["São Paulo", "Europe", "US East", "LATAM"],
    values: [20, 120, 100, 80]
  }], {
    x: M, y: 2.0, w: 5.8, h: 3.8, barDir: "col",
    chartColors: [RED, GOLD],
    chartArea: { fill: { color: WHITE } },
    catAxisLabelColor: MUTED, valAxisLabelColor: MUTED,
    catAxisLabelFontFace: SANS, valAxisLabelFontFace: SANS,
    valGridLine: { color: BORDER, size: 0.5 }, catGridLine: { style: "none" },
    showValue: true, dataLabelPosition: "outEnd", dataLabelColor: TEXT, dataLabelFontFace: SANS, dataLabelFormatCode: "0\"ms\"",
    showLegend: true, legendPos: "b", legendFontFace: SANS, legendColor: MUTED,
    valAxisTitle: "Round-trip latency (ms)", showValAxisTitle: true, valAxisTitleColor: MUTED, valAxisTitleFontSize: 9,
    barGapWidthPct: 60
  });
  // right: two cards
  const cards = [
    ["Santa Terezinha · Paraíba", "Solar + Satellite", "Photovoltaic plant on owned land. Direct satellite connectivity — zero connection to public grid. Energy-independent, ESG-auditable, zero-carbon processing."],
    ["ZPE Caucaia · Ceará", "Special Economic Zone", "Same ZPE as TikTok's Brazilian DC. Tax incentives, customs special regime, direct submarine cable access. João Pessoa and Fortaleza projects ready for construction."]
  ];
  cards.forEach(([h, t, b], i) => {
    const y = 1.6 + i * 2.2;
    s.addShape(p.shapes.RECTANGLE, { x: 7.0, y, w: 5.8, h: 2.0, fill: { color: i === 0 ? LIGHT : NAVY }, line: { color: i === 0 ? BORDER : GOLD, width: 1 } });
    s.addText([
      { text: h, options: { fontSize: 13, bold: true, color: i===0 ? NAVY : GOLDLT, breakLine: true } },
      { text: t, options: { fontSize: 10, color: i===0 ? BLUE : "8FB0C8", italic: true, breakLine: true } },
      { text: b, options: { fontSize: 9.5, color: i===0 ? MUTED : "B0C4D4", breakLine: false } }
    ], { x: 7.3, y: y+0.15, w: 5.2, h: 1.7, margin: 0, lineSpacing: 13, paraSpaceAfter: 4 });
  });
  s.addText("Latency to São Paulo: 9× improvement (180ms → <20ms) — enabling real-time clinical decision support", { x: M, y: 6.0, w: 5.8, h: 0.5, fontSize: 10, fontFace: SANS, color: RED, bold: true, margin: 0 });
  footer(s);
}

// ════════════════════════════════════════════════════
// S7 · ECOSYSTEM
// ════════════════════════════════════════════════════
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "The BeansTech Ecosystem", "75 production domains · 6 regulated verticals · shared infrastructure");
  const verts = [
    ["HealthTech", "dodr.ai · ragmed.ai (+8 portals)", "Clinical decision support · anti-hallucination chain · 6 frontier models · benchmark-validated", "550k physicians · R$ 4.4B/yr"],
    ["LegalTech", "ragjur.ai", "67M+ court decisions indexed · 55 sources · GLM-5.3 for analysis, Flash for volume search", "1.2M attorneys · R$ 80B/yr"],
    ["FinTech / RegTech", "beansbank · pldbr", "AML compliance, SAR narrative, KYC · GLM-5.3 for deep analysis, Flash for triage", "740 institutions · R$ 12B/yr"],
    ["PropTech ★ GLM Flash", "alirealty.com.br · cyrela.ai", "Document analysis, credit triage, due diligence · GLM-5.3 Flash processes in seconds what takes hours", "R$ 15B/yr (real estate tech)"],
  ];
  verts.forEach(([v, dom, desc, mkt], i) => {
    const x = M + (i % 2) * 6.15, y = 1.7 + Math.floor(i / 2) * 2.6;
    s.addShape(p.shapes.RECTANGLE, { x, y, w: 5.9, h: 2.3, fill: { color: i === 3 ? NAVY : LIGHT }, line: { color: i === 3 ? GOLD : BORDER, width: 1 } });
    const dark = i === 3;
    s.addText([
      { text: v, options: { fontSize: 15, bold: true, color: dark ? GOLDLT : NAVY, breakLine: true } },
      { text: dom, options: { fontSize: 10, color: dark ? "8FB0C8" : BLUE, italic: true, breakLine: true } },
      { text: " ", options: { fontSize: 4, breakLine: true } },
      { text: desc, options: { fontSize: 9.5, color: dark ? "B0C4D4" : MUTED, breakLine: true } },
      { text: " ", options: { fontSize: 4, breakLine: true } },
      { text: mkt, options: { fontSize: 10, bold: true, color: dark ? GOLDLT : RED } }
    ], { x: x+0.25, y: y+0.15, w: 5.4, h: 2.0, margin: 0, lineSpacing: 13, paraSpaceAfter: 3 });
  });
  s.addText("All verticals share the same model engine — adding GLM upgrades all simultaneously.", { x: M, y: 6.82, w: W-2*M, h: 0.35, fontSize: 10.5, fontFace: SANS, color: TEXT, bold: true, align: "center", margin: 0 });
  footer(s);
}

// ════════════════════════════════════════════════════
// S8 · FINE-TUNING ROADMAP
// ════════════════════════════════════════════════════
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "Fine-Tuning: From 0.45 to 0.70+", "SFT → DPO → Clinical Validation — GLM-Med becomes the first frontier medical model trained on Brazilian regulatory data");
  // left: weakness→resolution table
  const tbl = [
    ["Weakness (Base)", "Resolution (Fine-Tuned)", "Method"],
    ["Pediatrics: 0.28", "Target: > 0.60", "SFT with SBP protocols + pediatric dosing"],
    ["Reasoning in English", "Native PT reasoning", "SFT with bilingual reasoning chains"],
    ["Abstention: 0.50", "Target: > 0.80", "DPO with preference for correct abstention"],
    ["Citation: external", "Native citation", "SFT with citation-grounded examples"],
  ];
  const td = tbl.map((r,i) => r.map(c => ({ text: c, options: { fontFace: SANS, fontSize: 9.5, bold: i===0,
    color: i===0 ? GOLDLT : TEXT, fill: { color: i===0 ? NAVY : (i%2===0 ? LIGHT : WHITE) }, valign: "middle" } })));
  s.addTable(td, { x: M, y: 1.7, w: 6.0, colW: [1.8, 1.8, 2.4], rowH: 0.5, border: { type: "solid", pt: 0.5, color: BORDER } });
  // right: 3 phases
  const phases = [
    ["Phase 1 · SFT", "10,000 bilingual clinical cases · PCDT + ANVISA + SciELO · 8× H100 or 16× L20 · 2-4 weeks"],
    ["Phase 2 · DPO", "Brazilian physician preference ranking · Abstention > assertion · 2 weeks"],
    ["Phase 3 · Validation", "200 blind cases · 2 independent medical reviewers · Error = 0 (blocker) · Einstein / Rede D'Or pilot"],
  ];
  phases.forEach(([h, b], i) => {
    const y = 1.7 + i * 1.7;
    s.addShape(p.shapes.RECTANGLE, { x: 7.0, y, w: 5.8, h: 1.5, fill: { color: i === 2 ? NAVY : LIGHT }, line: { color: i === 2 ? GOLD : BORDER, width: 1 } });
    const dark = i === 2;
    s.addText([
      { text: h, options: { fontSize: 13, bold: true, color: dark ? GOLDLT : NAVY, breakLine: true } },
      { text: b, options: { fontSize: 10, color: dark ? "B0C4D4" : MUTED } }
    ], { x: 7.3, y: y+0.15, w: 5.2, h: 1.2, margin: 0, lineSpacing: 15, paraSpaceAfter: 6 });
  });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 5.6, w: 6.0, h: 1.4, fill: { color: LIGHT }, line: { color: GOLD, width: 1 } });
  s.addText([
    { text: "The fine-tuned model becomes:", options: { fontSize: 11, bold: true, color: NAVY, breakLine: true } },
    { text: "IP of the joint venture — licensable to hospitals, research institutions, and 3rd parties across LATAM", options: { fontSize: 10, color: MUTED } }
  ], { x: M+0.2, y: 5.75, w: 5.6, h: 1.1, margin: 0, lineSpacing: 14 });
  footer(s);
}

// ════════════════════════════════════════════════════
// S9 · GLOBAL REVENUE
// ════════════════════════════════════════════════════
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "Global Revenue Projection — The Return Is Far Greater Than It Appears", "US$ 300M partnership → US$ 943M cumulative revenue (5 years) → US$ 3.2B enterprise value at exit");
  // chart: revenue by year
  s.addChart(p.charts.BAR, [{
    name: "Annual Revenue (US$M)",
    labels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
    values: [14.2, 62, 142, 268, 420]
  }], {
    x: M, y: 1.7, w: 5.8, h: 3.5, barDir: "col",
    chartColors: [GOLD],
    chartArea: { fill: { color: WHITE } },
    catAxisLabelColor: MUTED, valAxisLabelColor: MUTED,
    catAxisLabelFontFace: SANS, valAxisLabelFontFace: SANS,
    valGridLine: { color: BORDER, size: 0.5 }, catGridLine: { style: "none" },
    showValue: true, dataLabelPosition: "outEnd", dataLabelColor: NAVY, dataLabelFontFace: SANS, dataLabelFormatCode: "$#,##0\"M\"",
    showLegend: false,
    valAxisTitle: "Revenue (US$ millions)", showValAxisTitle: true, valAxisTitleColor: MUTED, valAxisTitleFontSize: 9,
  });
  // right: revenue breakdown year 5
  const tbl = [
    ["Revenue Stream (Year 5)", "US$M/yr"],
    ["Brazil (SaaS + API)", "134"],
    ["Latin America (Spanish)", "80"],
    ["Europe (GDPR-aligned)", "55"],
    ["US East Coast", "35"],
    ["GLM-Med licensing (3rd parties)", "20"],
    ["Compute-as-a-Service (GPU cloud)", "45"],
    ["Sovereign Cloud (z.cloud API)", "60"],
    ["Colocation (ZPE CE)", "25"],
    ["TOTAL", "454"],
  ];
  const td = tbl.map((r,i) => r.map((c,j) => ({ text: c, options: { fontFace: SANS, fontSize: 9.5, bold: i===0 || i===tbl.length-1,
    color: i===0 ? GOLDLT : (i===tbl.length-1 ? GOLD : TEXT),
    fill: { color: i===0 ? NAVY : (i===tbl.length-1 ? NAVY : (i%2===0 ? LIGHT : WHITE)) },
    align: j===1 ? "right" : "left", valign: "middle" } })));
  s.addTable(td, { x: 7.0, y: 1.7, w: 5.8, colW: [4.3, 1.5], rowH: 0.38, border: { type: "solid", pt: 0.5, color: BORDER } });
  // bottom: ROI box
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 5.5, w: W-2*M, h: 1.5, fill: { color: NAVY }, line: { color: GOLD, width: 2 } });
  s.addText([
    { text: "US$ 300M Investment → US$ 943M Revenue (5 years) → US$ 3.2B Enterprise Value at Exit", options: { fontSize: 14, bold: true, color: GOLDLT, breakLine: true, align: "center" } },
    { text: "Direct ROI: 3.1×  ·  Enterprise Value Multiple: 10.7×  ·  Year 5 Run-Rate: US$ 420M/year", options: { fontSize: 11, color: "B0C4D4", breakLine: true, align: "center" } },
    { text: "Excluding: data center assets, fine-tuned model IP, domain portfolio, recurring revenue beyond Year 5", options: { fontSize: 9, color: "6B8BB0", italic: true, align: "center" } }
  ], { x: M+0.5, y: 5.65, w: W-2*M-1.0, h: 1.2, margin: 0, lineSpacing: 16 });
  footer(s);
}

// ════════════════════════════════════════════════════
// S9B · DATA CENTER AS REVENUE MULTIPLIER
// ════════════════════════════════════════════════════
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "The Data Center: Not Just Infrastructure — A Revenue Multiplier", "Compute as a service, LATAM presence, and the elimination of the exhaust bottleneck");
  // left: 3 revenue streams from the DC
  s.addText("Three Revenue Streams from the Data Center", { x: M, y: 1.6, w: 6, h: 0.4, fontSize: 13, fontFace: SANS, bold: true, color: NAVY, margin: 0 });
  const streams = [
    ["1. Compute-as-a-Service (GPU Cloud)", "Renting GPU capacity to AI companies, research institutions, and startups across LATAM. The same L20/H100 infrastructure that serves our models serves external clients during off-peak.", "US$ 45M/yr (Year 5)"],
    ["2. Sovereign Cloud (z.cloud API)", "Token-based API for regulated institutions that need GLM running in Brazilian territory. Financial, healthcare, legal — 1.75M+ professionals in Brazil alone.", "US$ 60M/yr (Year 5)"],
    ["3. Data Center Colocation (ZPE CE)", "Rack space in the ZPE for companies needing Brazilian jurisdiction with submarine cable access. Same model as TikTok's Brazilian DC.", "US$ 25M/yr (Year 5)"],
  ];
  streams.forEach(([h, b, v], i) => {
    const y = 2.05 + i * 1.55;
    s.addShape(p.shapes.RECTANGLE, { x: M, y, w: 5.9, h: 1.4, fill: { color: i === 0 ? NAVY : LIGHT }, line: { color: i === 0 ? GOLD : BORDER, width: i === 0 ? 1.5 : 0.75 } });
    const dark = i === 0;
    s.addText([
      { text: h, options: { fontSize: 11, bold: true, color: dark ? GOLDLT : NAVY, breakLine: true } },
      { text: b, options: { fontSize: 8.5, color: dark ? "B0C4D4" : MUTED, breakLine: true } },
      { text: v, options: { fontSize: 10, bold: true, color: dark ? GOLDLT : RED } }
    ], { x: M+0.25, y: y+0.1, w: 5.4, h: 1.2, margin: 0, lineSpacing: 11, paraSpaceAfter: 3 });
  });
  // right: why the return is far greater
  s.addText("Why the Return Is Far Greater Than It Appears", { x: 7.0, y: 1.6, w: 5.8, h: 0.4, fontSize: 13, fontFace: SANS, bold: true, color: NAVY, margin: 0 });
  s.addText([
    { text: "Eliminating the compute bottleneck", options: { bullet: buG(), bold: true, color: NAVY, breakLine: true } },
    { text: "Every AI company today faces the same wall: GPU availability. The exhaust of computational capacity limits growth, forces queue management, and caps the number of users served. Owning sovereign infrastructure removes this ceiling entirely — we scale to demand, not to supply.", options: { fontSize: 9, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "LATAM presence with competitive latency", options: { bullet: buG(), bold: true, color: NAVY, breakLine: true } },
    { text: "The PB/CE data centers serve 400M+ Portuguese and Spanish speakers with latency that competes with US providers. No other AI infrastructure in Latin America offers this combination of sovereignty + performance + renewable energy.", options: { fontSize: 9, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "The asset appreciates", options: { bullet: buG(), bold: true, color: NAVY, breakLine: true } },
    { text: "Data centers, energy plants, and submarine cable access are appreciating infrastructure assets. The land is owned. The energy source is solar. The market for AI compute is growing 40%+ annually. This is not a cost — it is an investment that compounds.", options: { fontSize: 9, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Energy cost = near zero", options: { bullet: buG(), bold: true, color: NAVY, breakLine: true } },
    { text: "Solar marginal cost approaches zero. Every GPU-hour served from PB costs less than any competitor running on grid power. This margin advantage compounds with scale.", options: { fontSize: 9, color: MUTED } }
  ], { x: 7.0, y: 2.05, w: 5.8, h: 4.6, margin: 0, paraSpaceAfter: 3, lineSpacing: 12 });
  footer(s);
}

// ════════════════════════════════════════════════════
// S10 · GOVERNANCE & ETHICS
// ════════════════════════════════════════════════════
{
  const s = p.addSlide(); s.background = { color: NAVY };
  title(s, "Governance & Ethics", "Principles that both companies share — and that regulated markets demand", true);
  const prins = [
    ["Transparency", "Every response discloses: which model, which version, which corpus, whether PII was detected. The user always knows what they are talking to."],
    ["Abstention", "When the system cannot find evidence, it says \"insufficient\" — it does not guess. This is the GLM behavior that won our benchmark and our trust."],
    ["Data Sovereignty", "PII removed before any model sees the data. Upon data center completion, all processing is domestic — sovereign by design."],
    ["Professional Authority", "The physician, attorney, or compliance officer makes the decision. The system provides evidence, not verdicts."],
  ];
  prins.forEach(([h, b], i) => {
    const x = M + (i % 2) * 6.15, y = 1.8 + Math.floor(i / 2) * 2.1;
    s.addShape(p.shapes.RECTANGLE, { x, y, w: 5.9, h: 1.85, fill: { color: NAVY2 }, line: { color: GOLD, width: 0.75 } });
    s.addText([
      { text: h, options: { fontSize: 14, bold: true, color: GOLDLT, breakLine: true } },
      { text: b, options: { fontSize: 10.5, color: "B0C4D4" } }
    ], { x: x+0.25, y: y+0.15, w: 5.4, h: 1.55, margin: 0, lineSpacing: 14, paraSpaceAfter: 6 });
  });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 6.1, w: W-2*M, h: 0.8, fill: { color: NAVY2 }, line: { color: GOLD, width: 1 } });
  s.addText([
    { text: "About the Founder: ", options: { bold: true, color: GOLDLT, fontSize: 10 } },
    { text: "Matheus Ximenes — Attorney, 12 years in the Brazilian Judiciary (7 as legal advisor to a Supreme Court Minister). Postgraduate in Cloud Computing and Data Protection. Creator of ragjur.ai (67M+ decisions) and ragmed.ai. Owner of z.cloud and glm.cloud.", options: { color: "B0C4D4", fontSize: 9.5 } }
  ], { x: M+0.3, y: 6.2, w: W-2*M-0.6, h: 0.6, margin: 0, lineSpacing: 13 });
  footer(s, true);
}

// ════════════════════════════════════════════════════
// S11 · THE ASK
// ════════════════════════════════════════════════════
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "What We Ask — What We Give", "A balanced partnership of equals — each side contributing what the other cannot build alone");
  // left: Z.ai
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 1.7, w: 5.8, h: 4.2, fill: { color: NAVY }, line: { color: GOLD, width: 1.5 } });
  s.addText("Z.AI CONTRIBUTES", { x: M+0.3, y: 1.9, w: 5.2, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: GOLDLT, charSpacing: 2, margin: 0 });
  s.addText([
    { text: "US$ 300M partnership value", options: { bullet: buG(), bold: true, color: GOLDLT, breakLine: true } },
    { text: "Enterprise value of the joint venture — covering data center construction, model fine-tuning, operational scale-up, and global market expansion", options: { bullet: false, fontSize: 9, color: "8FB0C8", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "GLM-5.3 training license", options: { bullet: buG(), bold: true, color: WHITE, breakLine: true } },
    { text: "Base weights + right to derive proprietary models for LATAM", options: { bullet: false, fontSize: 9, color: "8FB0C8", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Priority access to new models", options: { bullet: buG(), bold: true, color: WHITE, breakLine: true } },
    { text: "GLM-5.4+ and multimodal variants as released", options: { bullet: false, fontSize: 9, color: "8FB0C8", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Co-branding: z.cloud × GLM", options: { bullet: buG(), bold: true, color: WHITE } }
  ], { x: M+0.3, y: 2.3, w: 5.2, h: 3.4, margin: 0, paraSpaceAfter: 4, lineSpacing: 14 });
  // right: BeansTech
  s.addShape(p.shapes.RECTANGLE, { x: 7.0, y: 1.7, w: 5.8, h: 4.2, fill: { color: LIGHT }, line: { color: BORDER, width: 1 } });
  s.addText("BEANSTECH CONTRIBUTES", { x: 7.3, y: 1.9, w: 5.2, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: NAVY, charSpacing: 2, margin: 0 });
  s.addText([
    { text: "Complete production infrastructure", options: { bullet: bu(), bold: true, color: NAVY, breakLine: true } },
    { text: "75 production domains across 4 verticals · 6 frontier models · 67M+ indexed decisions · identity + compliance stack · 2 data center sites (PB solar + CE ZPE)", options: { bullet: false, fontSize: 9, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Distribution across 6 regulated verticals", options: { bullet: bu(), bold: true, color: NAVY, breakLine: true } },
    { text: "75 domains, 1.75M professionals, existing sales relationships", options: { bullet: false, fontSize: 9, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Training dataset (Brazilian, bilingual)", options: { bullet: bu(), bold: true, color: NAVY, breakLine: true } },
    { text: "10,000+ clinical cases with verified answers and citation grounding", options: { bullet: false, fontSize: 9, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Sovereign infrastructure + premium domains", options: { bullet: bu(), bold: true, color: NAVY, breakLine: true } },
    { text: "Land in PB (solar+satellite) and CE (ZPE) · z.cloud, glm.cloud, ragjur.ai, ragmed.ai, dodr.ai, ativo.tech", options: { bullet: false, fontSize: 9, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Regulatory expertise", options: { bullet: bu(), bold: true, color: NAVY, breakLine: true } },
    { text: "Founder attorney, 12 years Judiciary, postgraduate in Data Protection", options: { bullet: false, fontSize: 9, color: MUTED } }
  ], { x: 7.3, y: 2.3, w: 5.2, h: 3.4, margin: 0, paraSpaceAfter: 2, lineSpacing: 13 });
  // balance note
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 6.0, w: W-2*M, h: 0.8, fill: { color: LIGHT }, line: { color: GOLD, width: 1 } });
  s.addText([
    { text: "On Balance: ", options: { bold: true, color: NAVY, fontSize: 10 } },
    { text: "We recognize that another company could invest more capital. What cannot be replicated at any price: regulatory expertise, production infrastructure, sovereign land, premium domains, and a clinical benchmark that independently validated GLM. The partnership is balanced because each side contributes what money alone cannot buy.", options: { color: MUTED, fontSize: 9.5 } }
  ], { x: M+0.2, y: 6.1, w: W-2*M-0.4, h: 0.6, margin: 0, lineSpacing: 12 });
  footer(s);
}

// ════════════════════════════════════════════════════
// S12 · NEXT STEPS + CLOSE
// ════════════════════════════════════════════════════
{
  const s = p.addSlide(); s.background = { color: NAVY };
  title(s, "Next Steps", "From agreement to launch in 60 days", true);
  const steps = [
    ["Step 1", "45-minute presentation", "Live demonstration of GLM-5.3 on the clinical benchmark, z.cloud, and ragjur.ai"],
    ["Step 2", "Technical due diligence", "Access to benchmark results (156 evaluations), health.beanstech.com.br (31 live probes), private GitHub, ragjur.ai (67M+ decisions), alirealty.com.br (production)"],
    ["Step 3", "Letter of Intent", "Investment structure, milestone schedule, governance framework"],
    ["Step 4", "z.cloud pilot launch", "GLM-5.3 serving from Brazilian territory within 60 days of agreement"],
  ];
  steps.forEach(([tag, h, b], i) => {
    const x = M + i * 3.1;
    s.addShape(p.shapes.RECTANGLE, { x, y: 1.8, w: 2.8, h: 1.8, fill: { color: NAVY2 }, line: { color: GOLD, width: 0.75 } });
    s.addText([
      { text: tag, options: { fontSize: 9, color: GOLD, bold: true, charSpacing: 2, breakLine: true } },
      { text: h, options: { fontSize: 12, bold: true, color: WHITE, breakLine: true } },
      { text: b, options: { fontSize: 9, color: "B0C4D4" } }
    ], { x: x+0.2, y: 1.95, w: 2.4, h: 1.5, margin: 0, lineSpacing: 13, paraSpaceAfter: 4 });
    if (i < 3) s.addText("→", { x: x+2.75, y: 2.4, w: 0.4, h: 0.5, fontSize: 20, color: GOLD, align: "center", margin: 0 });
  });
  // closing value box
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 4.2, w: W-2*M, h: 2.0, fill: { color: NAVY2 }, line: { color: GOLD, width: 2.5 } });
  s.addText([
    { text: "US$ 300,000,000", options: { fontSize: 36, bold: true, color: GOLDLT, align: "center", breakLine: true, fontFace: SANS } },
    { text: "Strategic Partnership Value", options: { fontSize: 13, color: "8FB0C8", align: "center", breakLine: true, fontFace: SANS, charSpacing: 3 } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "US$ 943M revenue (5yr) · US$ 3.2B enterprise value at exit · 10.7× return", options: { fontSize: 12, color: WHITE, align: "center", italic: true, fontFace: SERIF } }
  ], { x: M+1, y: 4.4, w: W-2*M-2, h: 1.6, margin: 0, lineSpacing: 20 });
  s.addText("Matheus Ximenes · Founder & CEO · contato@feijaojustech.com.br\nbeanstech.com.br · z.cloud · glm.cloud · ativo.tech · ragjur.ai · ragmed.ai · dodr.ai", { x: M, y: 6.5, w: W-2*M, h: 0.6, fontSize: 10, fontFace: SANS, color: "6B8BB0", align: "center", margin: 0, lineSpacing: 14 });
  footer(s, true);
}

p.writeFile({ fileName: "ZCloud-Zai-Parceria-EN.pptx" }).then(f => console.log("✅", f));
