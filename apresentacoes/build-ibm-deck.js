// BeansTech × IBM — The Granite Foundation for Regulated AI in Latin America
// 16:9 deck · IBM blue (#0F62FE) + granite gray + gold · English · 13 slides
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "A4L", width: 13.33, height: 7.5 });
p.layout = "A4L"; p.author = "BeansTech"; p.company = "BeansTech";
p.title = "BeansTech × IBM — Granite Foundation for Regulated AI in LATAM";
const W = 13.33, H = 7.5, M = 0.55;
const IBM = "0F62FE", IBMD = "002D9C", GRAY = "1A1A21", TEAL = "00B3A4", GOLD = "D4A843", GOLDLT = "E8C847";
const TEXT = "1A2332", MUTED = "5A6B7A", LIGHT = "F0F4F8", BORDER = "C8D2DA", WHITE = "FFFFFF";
const SANS = "Helvetica Neue", SERIF = "Georgia";
let n = 0;

function footer(s, dark=false) {
  n++;
  s.addText(`BeansTech × IBM — Confidential`, { x: M, y: H-0.38, w: 6, h: 0.28, fontSize: 8, fontFace: SANS, color: dark ? "6B8BB0" : MUTED, margin: 0 });
  s.addText(String(n), { x: W-M-0.5, y: H-0.38, w: 0.5, h: 0.28, fontSize: 8, fontFace: SANS, color: dark ? "6B8BB0" : MUTED, align: "right", margin: 0 });
}
function title(s, t, sub, dark=false) {
  s.addText(t, { x: M, y: 0.35, w: W-2*M, h: 0.7, fontSize: 27, fontFace: SANS, bold: true, color: dark ? WHITE : IBMD, margin: 0 });
  if (sub) s.addText(sub, { x: M, y: 1.0, w: W-2*M, h: 0.4, fontSize: 13, fontFace: SANS, color: dark ? "8FAFC0" : MUTED, margin: 0 });
  s.addShape(p.shapes.LINE, { x: M, y: 1.42, w: 2.4, h: 0, line: { color: IBM, width: 3 } });
}
const bu = () => ({ code: "2013", indent: 10 });
const buB = () => ({ code: "25B8", indent: 10 });

// S1 · COVER
{
  const s = p.addSlide(); s.background = { color: GRAY };
  s.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: GRAY }, line: { color: GRAY } });
  // IBM-style 8-bar logo suggestion
  for (let i=0; i<8; i++) {
    s.addShape(p.shapes.RECTANGLE, { x: W-1.8, y: 0.5+i*0.18, w: 1.2, h: 0.08, fill: { color: IBM }, line: { color: IBM } });
  }
  s.addText("BEANSTECH  ×  IBM", { x: M, y: 1.6, w: 8, h: 0.5, fontSize: 16, fontFace: SANS, color: WHITE, charSpacing: 4, bold: true, margin: 0 });
  s.addText("The Granite Foundation\nfor Regulated AI\nin Latin America", { x: M, y: 2.2, w: 9.5, h: 2.8, fontSize: 44, fontFace: SANS, bold: true, color: WHITE, margin: 0, lineSpacing: 50 });
  s.addText("Where IBM's Granite meets the equator. Trusted AI for sectors where being wrong\nchanges lives — running on sovereign Brazilian infrastructure, powered by solar energy.", { x: M, y: 5.0, w: 9.5, h: 1.0, fontSize: 13, fontFace: SERIF, color: "B0C0D0", margin: 0, lineSpacing: 18 });
  s.addShape(p.shapes.LINE, { x: M, y: 6.1, w: 3, h: 0, line: { color: GOLD, width: 2 } });
  s.addText([
    { text: "US$ 250,000,000", options: { fontSize: 24, fontFace: SANS, bold: true, color: GOLDLT, breakLine: true } },
    { text: "Strategic Partnership Value", options: { fontSize: 11, fontFace: SANS, color: "8FAFC0" } }
  ], { x: M, y: 6.2, w: 6, h: 1.0, margin: 0 });
  s.addText("Matheus Ximenes · Founder & CEO\nAttorney · Postgraduate Cloud Computing & Data Protection\nSeptember 2026 · São Paulo, Brazil", { x: W-M-4.5, y: 6.2, w: 4.5, h: 0.9, fontSize: 9, fontFace: SANS, color: "6B8BB0", align: "right", margin: 0, lineSpacing: 14 });
  footer(s, true);
}

// S2 · EXECUTIVE SUMMARY
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "Executive Summary", "Granite already powers our compliance infrastructure. This partnership scales it to all of Latin America.");
  const stats = [["US$ 250M","Partnership Value"],["4","Regulated Verticals"],["2","Data Centers (1 Carbon-Free)"],["77M+","Court Decisions Indexed"],["6","Models in Production"]];
  stats.forEach(([v,l],i) => {
    const x = M + i * 2.42;
    s.addShape(p.shapes.RECTANGLE, { x, y: 1.7, w: 2.2, h: 1.3, fill: { color: LIGHT }, line: { color: BORDER, width: 1 } });
    s.addText(v, { x, y: 1.78, w: 2.2, h: 0.6, fontSize: 22, fontFace: SANS, bold: true, color: IBMD, align: "center", margin: 0 });
    s.addText(l, { x, y: 2.38, w: 2.2, h: 0.5, fontSize: 8.5, fontFace: SANS, color: MUTED, align: "center", margin: 0, charSpacing: 1 });
  });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 3.3, w: W-2*M, h: 1.6, fill: { color: GRAY }, line: { color: IBM, width: 1.5 } });
  s.addText([
    { text: "Granite Guardian is already deployed as the mandatory guardrail in every clinical decision we make.", options: { bold: true, color: WHITE, fontSize: 15, breakLine: true } },
    { text: "Every response from our /decisao tool passes through granite3-guardian:8b for input and output safety. Granite 4.1 30B handles compliance narratives and SAR generation. This is not a proposal to try Granite — it is a proposal to scale what is already working.", options: { color: "B0C0D0", fontSize: 11.5 } }
  ], { x: M+0.3, y: 3.5, w: W-2*M-0.6, h: 1.2, margin: 0, lineSpacing: 16 });
  s.addText("What IBM Gains", { x: M, y: 5.1, w: 5.8, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: IBM, margin: 0 });
  s.addText([
    { text: "Production validation — Granite running in regulated sectors, not just benchmarks", options: { bullet: buB(), breakLine: true } },
    { text: "Market access — 1.75M regulated professionals in Brazil, 650M in LATAM", options: { bullet: buB(), breakLine: true } },
    { text: "granitic.cloud — premium domain for the joint product", options: { bullet: buB(), breakLine: true } },
    { text: "watsonx integration — sovereign deployment in territory IBM cannot reach alone", options: { bullet: buB() } }
  ], { x: M, y: 5.5, w: 5.8, h: 1.7, fontSize: 10.5, fontFace: SANS, color: TEXT, margin: 0, paraSpaceAfter: 6 });
  s.addText("What Beans Tech Brings", { x: 7.0, y: 5.1, w: 5.8, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: IBM, margin: 0 });
  s.addText([
    { text: "Granite in production — guardrail on every response, compliance in every vertical", options: { bullet: buB(), breakLine: true } },
    { text: "4 regulated verticals live — Legal (77M+ decisions), Compliance, Health, Real Estate", options: { bullet: buB(), breakLine: true } },
    { text: "Sovereign data centers — PB (solar off-grid) + CE (ZPE, subsea)", options: { bullet: buB(), breakLine: true } },
    { text: "Regulatory expertise — founder attorney, 12 years Judiciary", options: { bullet: buB() } }
  ], { x: 7.0, y: 5.5, w: 5.8, h: 1.7, fontSize: 10.5, fontFace: SANS, color: TEXT, margin: 0, paraSpaceAfter: 6 });
  footer(s);
}

// S3 · WHY GRANITE
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "Why Granite — What We Observed", "Benchmark data from our production infrastructure");
  const rows = [
    ["Granite Model", "Our Deployment", "Measured Performance", "Role in Production"],
    ["Granite 4.1 30B (Q4)", "GPU: elite-health (Singapura)", "41.6 tok/s · 1,509 tok/s prompt eval", "Compliance narratives, SAR generation, regulatory analysis"],
    ["Granite 3 Guardian 8B", "GPU: elite-health (Singapura)", "146 tok/s · 13,907 tok/s prompt eval", "Mandatory guardrail: input + output safety on every /decisao response"],
    ["Combined", "6 models × 26 clinical cases", "Benchmark coverage: 0.39 ( Granite )", "Guardrail: caught 100% of prompt injection that other models missed"],
  ];
  const td = rows.map((r,i) => r.map((c,j) => ({
    text: c,
    options: {
      fontFace: SANS, fontSize: i===0 ? 9 : 9.5, bold: i===0,
      color: i===0 ? WHITE : (j===3 ? IBM : TEXT),
      fill: { color: i===0 ? IBMD : (i===3 ? LIGHT : (i%2===0 ? LIGHT : WHITE)) },
      align: "left", valign: "middle"
    }
  })));
  s.addTable(td, { x: M, y: 1.7, w: W-2*M, colW: [2.5, 2.5, 3.0, 4.23], rowH: 0.65, border: { type: "solid", pt: 0.5, color: BORDER } });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 4.8, w: W-2*M, h: 1.6, fill: { color: GRAY }, line: { color: IBM, width: 1.5 } });
  s.addText([
    { text: "The insight that matters:", options: { bold: true, color: GOLDLT, fontSize: 13, breakLine: true } },
    { text: "When we tested 6 frontier models on adversarial cases (prompt injection, illegal content, PII leakage), every model — GLM-5.3, Baichuan, AntAngelMed, MedGemma, Qwen — failed. Only Granite Guardian caught them. This is why it is the mandatory layer in our production architecture. No frontier model is safe without Granite as the gatekeeper.", options: { color: "B0C0D0", fontSize: 11 } }
  ], { x: M+0.3, y: 5.0, w: W-2*M-0.6, h: 1.2, margin: 0, lineSpacing: 16 });
  s.addText("Source: BeansTech Clinical Benchmark, September 16, 2026 — 156 evaluations, red-team included", { x: M, y: 6.65, w: W-2*M, h: 0.3, fontSize: 8, fontFace: SANS, color: MUTED, italic: true, margin: 0 });
  footer(s);
}

// S4 · GRANITIC MEANS
{
  const s = p.addSlide(); s.background = { color: GRAY };
  title(s, 'What "granitic" Means', "The word that describes what IBM builds and what we deploy", true);
  s.addText([
    { text: "granitic", options: { fontSize: 52, fontFace: SERIF, bold: true, color: WHITE, align: "center", breakLine: true } },
    { text: "/ɡrəˈnɪtɪk/ — adjective", options: { fontSize: 14, fontFace: SERIF, color: "8FAFC0", align: "center", italic: true, breakLine: true } },
    { text: " ", options: { fontSize: 8, breakLine: true } },
    { text: "1. Composed of or resembling granite — the hardest, most durable natural stone.", options: { fontSize: 14, fontFace: SERIF, color: "B0C0D0", align: "center", breakLine: true } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "2. Unbreakable. Foundation-grade. Built to last longer than the building on top of it.", options: { fontSize: 14, fontFace: SERIF, color: "B0C0D0", align: "center", italic: true, breakLine: true } },
    { text: " ", options: { fontSize: 10, breakLine: true } },
    { text: "granitic.cloud — where IBM's Granite becomes the foundation of Latin America's regulated AI.", options: { fontSize: 18, fontFace: SANS, bold: true, color: GOLDLT, align: "center" } }
  ], { x: M, y: 2.0, w: W-2*M, h: 4.5, margin: 0, lineSpacing: 22 });
  s.addShape(p.shapes.LINE, { x: M+3, y: 6.8, w: W-2*M-6, h: 0, line: { color: IBM, width: 1.5 } });
  footer(s, true);
}

// S5 · THE 4 VERTICALS
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "The 4 Regulated Verticals — Where Granite Serves", "Production-ready AI engines with Granite as the foundation layer");
  const verts = [
    ["⚖️ Legal & Compliance", "ragjur.ai · legalsuite.tech", "77M+ court decisions indexed · Granite 4.1 for SAR narratives and regulatory analysis · Guardian for judicial document safety", "1.2M attorneys · R$ 80B/yr"],
    ["🛡️ Compliance / AML", "pldbr.tech · beansbank", "Granite 4.1 for PLD/FT compliance, SAR generation · Guardian for transaction monitoring and typology classification", "740 institutions · R$ 12B/yr"],
    ["🏥 Healthcare", "dodr.ai · ragmed.ai", "Granite Guardian as mandatory clinical guardrail — input + output safety on every response · 8 medical portals live", "550k physicians · R$ 4.4B/yr"],
    ["🏢 Real Estate", "alirealty.com.br · proptechbr.ai", "Granite 4.1 for document analysis (matrículas, liens, restrictions) · Guardian for contract safety review", "R$ 15B/yr (proptech)"],
  ];
  verts.forEach(([v, dom, desc, mkt], i) => {
    const x = M + (i % 2) * 6.15, y = 1.7 + Math.floor(i / 2) * 2.6;
    s.addShape(p.shapes.RECTANGLE, { x, y, w: 5.9, h: 2.3, fill: { color: i === 2 ? GRAY : LIGHT }, line: { color: i === 2 ? IBM : BORDER, width: i === 2 ? 1.5 : 1 } });
    const dark = i === 2;
    s.addText([
      { text: v, options: { fontSize: 14, bold: true, color: dark ? WHITE : IBMD, breakLine: true } },
      { text: dom, options: { fontSize: 10, color: dark ? "8FAFC0" : IBM, italic: true, breakLine: true } },
      { text: " ", options: { fontSize: 4, breakLine: true } },
      { text: desc, options: { fontSize: 9.5, color: dark ? "B0C0D0" : MUTED, breakLine: true } },
      { text: " ", options: { fontSize: 4, breakLine: true } },
      { text: mkt, options: { fontSize: 10, bold: true, color: dark ? GOLDLT : TEAL } }
    ], { x: x+0.25, y: y+0.15, w: 5.4, h: 2.0, margin: 0, lineSpacing: 13, paraSpaceAfter: 3 });
  });
  s.addText("Healthcare (highlighted) is where Granite Guardian is already deployed as the mandatory safety layer on every clinical decision.", { x: M, y: 6.75, w: W-2*M, h: 0.35, fontSize: 9.5, fontFace: SANS, color: IBM, bold: true, align: "center", margin: 0 });
  footer(s);
}

// S6 · WATSONX INTEGRATION
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "IBM watsonx Integration", "From open-source Granite to enterprise-grade watsonx on sovereign infrastructure");
  s.addText("Current: Open-Source Granite", { x: M, y: 1.6, w: 5.8, h: 0.4, fontSize: 13, fontFace: SANS, bold: true, color: MUTED, margin: 0 });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 2.0, w: 5.8, h: 2.2, fill: { color: LIGHT }, line: { color: BORDER, width: 1 } });
  s.addText([
    { text: "Granite 4.1 30B (Q4) — running on our GPUs", options: { bullet: bu(), breakLine: true } },
    { text: "Granite 3 Guardian 8B — guardrail on every response", options: { bullet: bu(), breakLine: true } },
    { text: "Apache 2.0 — fully open weights, sovereign deployment", options: { bullet: bu(), breakLine: true } },
    { text: "41 tok/s on L20 GPU — production throughput", options: { bullet: bu() } }
  ], { x: M+0.25, y: 2.15, w: 5.3, h: 1.9, margin: 0, fontSize: 10.5, paraSpaceAfter: 5, lineSpacing: 14 });
  // arrow
  s.addText("→", { x: 6.3, y: 2.8, w: 0.6, h: 0.6, fontSize: 28, color: IBM, align: "center", margin: 0, bold: true });
  s.addText("Proposed: IBM watsonx", { x: 7.0, y: 1.6, w: 5.8, h: 0.4, fontSize: 13, fontFace: SANS, bold: true, color: IBM, margin: 0 });
  s.addShape(p.shapes.RECTANGLE, { x: 7.0, y: 2.0, w: 5.8, h: 2.2, fill: { color: GRAY }, line: { color: IBM, width: 1.5 } });
  s.addText([
    { text: "watsonx.governance — AI governance and compliance platform", options: { bullet: buB(), color: WHITE, breakLine: true } },
    { text: "watsonx.ai — enterprise Granite with fine-tuning", options: { bullet: buB(), color: WHITE, breakLine: true } },
    { text: "watsonx.data — sovereign data lake for regulated sectors", options: { bullet: buB(), color: WHITE, breakLine: true } },
    { text: "Deployed on granitic.cloud — sovereign Brazilian infrastructure", options: { bullet: buB(), color: GOLDLT, bold: true } }
  ], { x: 7.25, y: 2.15, w: 5.3, h: 1.9, margin: 0, fontSize: 10.5, paraSpaceAfter: 5, lineSpacing: 14 });
  // bottom: what watsonx adds
  s.addText("What watsonx Adds to Our Stack", { x: M, y: 4.4, w: 6, h: 0.4, fontSize: 13, fontFace: SANS, bold: true, color: IBMD, margin: 0 });
  s.addText([
    { text: "Enterprise governance — model lifecycle, bias detection, explainability (FActSheets)", options: { bullet: buB(), breakLine: true } },
    { text: "Regulatory mapping — automated compliance with LGPD, EU AI Act, sector-specific rules", options: { bullet: buB(), breakLine: true } },
    { text: "Data sovereignty — watsonx deployed in Brazilian territory on granitic.cloud infrastructure", options: { bullet: buB(), breakLine: true } },
    { text: "IBM credibility — enterprise trust that no startup can build alone, delivered through a local partner who understands Brazilian regulation", options: { bullet: buB() } }
  ], { x: M, y: 4.8, w: W-2*M, h: 1.8, margin: 0, fontSize: 10.5, paraSpaceAfter: 6, lineSpacing: 14 });
  footer(s);
}

// S7 · INFRASTRUCTURE
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "Sovereign Infrastructure — The Dual-Hub Advantage", "Same data center blueprint as our Z.ai and Tencent partnerships, dedicated to Granite");
  s.addText("Hub 1: ZPE Caucaia, Ceará", { x: M, y: 1.7, w: 5.8, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: IBMD, margin: 0 });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 2.1, w: 5.8, h: 2.2, fill: { color: LIGHT }, line: { color: IBM, width: 1.5 } });
  s.addText([
    { text: "Special Export Processing Zone (ZPE)", options: { bullet: bu(), bold: true, breakLine: true } },
    { text: "Same zone as TikTok's Brazilian data center", options: { bullet: bu(), breakLine: true } },
    { text: "Direct submarine cable access (Monet, EllaLink, SACS)", options: { bullet: bu(), breakLine: true } },
    { text: "Duty-free hardware ingestion for IBM infrastructure", options: { bullet: bu(), breakLine: true } },
    { text: "Latency: <65ms US East, <64ms Europe", options: { bullet: bu(), bold: true } }
  ], { x: M+0.25, y: 2.25, w: 5.3, h: 1.9, margin: 0, fontSize: 10.5, paraSpaceAfter: 5, lineSpacing: 14 });
  s.addText("Hub 2: Santa Terezinha, Paraíba", { x: 7.0, y: 1.7, w: 5.8, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: TEAL, margin: 0 });
  s.addShape(p.shapes.RECTANGLE, { x: 7.0, y: 2.1, w: 5.8, h: 2.2, fill: { color: GRAY }, line: { color: GOLD, width: 1.5 } });
  s.addText([
    { text: "100% off-grid — zero public grid connection", options: { bullet: buB(), bold: true, color: WHITE, breakLine: true } },
    { text: "Dedicated photovoltaic solar plant on owned land", options: { bullet: buB(), color: "B0C0D0", breakLine: true } },
    { text: "Satellite connectivity backup", options: { bullet: buB(), color: "B0C0D0", breakLine: true } },
    { text: "Carbon-free, ESG-auditable (IBM's sustainability goals)", options: { bullet: buB(), color: GOLDLT, breakLine: true } },
    { text: "IBM \u201cLet\u2019s create\u201d meets 100% renewable", options: { bullet: buB(), color: GOLDLT, bold: true } }
  ], { x: 7.25, y: 2.25, w: 5.3, h: 1.9, margin: 0, fontSize: 10.5, paraSpaceAfter: 5, lineSpacing: 14 });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 4.6, w: W-2*M, h: 1.5, fill: { color: LIGHT }, line: { color: IBM, width: 1 } });
  s.addText([
    { text: "Why IBM needs sovereign infrastructure in LATAM:", options: { bold: true, color: IBMD, fontSize: 12, breakLine: true } },
    { text: "IBM cannot deploy watsonx in Brazilian territory without a local partner who owns land, understands LGPD, and has distribution in regulated sectors. Beans Tech has all three — plus Granite already in production.", options: { color: MUTED, fontSize: 11 } }
  ], { x: M+0.3, y: 4.75, w: W-2*M-0.6, h: 1.1, margin: 0, lineSpacing: 16 });
  footer(s);
}

// S8 · GRANITE ADVANTAGES
{
  const s = p.addSlide(); s.background = { color: GRAY };
  title(s, "The Granite Advantage — Why IBM's Model Is Different", "Open weights, enterprise focus, safety-first design", true);
  const advantages = [
    ["Apache 2.0 — Fully Open", "Unlike GLM, Qwen, or Claude — Granite weights are fully open. IBM cannot pull the rug. Sovereign deployment without API dependency."],
    ["Guardian — Safety by Design", "Granite Guardian is the only model we tested that caught 100% of adversarial inputs. No frontier model matched it."],
    ["Enterprise-Grade Focus", "Built for compliance, audit, and governance — not for creative writing. This is the model for institutions that answer to regulators."],
    ["watsonx Ecosystem", "Backed by IBM's enterprise platform: governance, data lake, fine-tuning, explainability. A complete stack, not just a model."],
  ];
  advantages.forEach(([h, b], i) => {
    const x = M + (i % 2) * 6.15, y = 1.7 + Math.floor(i / 2) * 2.3;
    s.addShape(p.shapes.RECTANGLE, { x, y, w: 5.9, h: 2.0, fill: { color: "16161E" }, line: { color: IBM, width: 0.75 } });
    s.addText([
      { text: h, options: { fontSize: 13, bold: true, color: WHITE, breakLine: true } },
      { text: b, options: { fontSize: 10, color: "B0C0D0" } }
    ], { x: x+0.25, y: y+0.15, w: 5.4, h: 1.7, margin: 0, lineSpacing: 14, paraSpaceAfter: 6 });
  });
  s.addText("IBM builds for trust. We deploy for sovereignty. Together: trusted AI on sovereign ground.", { x: M, y: 6.5, w: W-2*M, h: 0.4, fontSize: 12, fontFace: SERIF, italic: true, color: GOLDLT, align: "center", margin: 0 });
  footer(s, true);
}

// S9 · REVENUE
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "Revenue Projection", "US$ 250M partnership → US$ 780M cumulative revenue (5 years) → US$ 2.7B enterprise value");
  s.addChart(p.charts.BAR, [{
    name: "Annual Revenue (US$M)",
    labels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
    values: [12, 50, 115, 220, 350]
  }], {
    x: M, y: 1.7, w: 5.8, h: 3.5, barDir: "col",
    chartColors: [IBM],
    chartArea: { fill: { color: WHITE } },
    catAxisLabelColor: MUTED, valAxisLabelColor: MUTED,
    catAxisLabelFontFace: SANS, valAxisLabelFontFace: SANS,
    valGridLine: { color: BORDER, size: 0.5 }, catGridLine: { style: "none" },
    showValue: true, dataLabelPosition: "outEnd", dataLabelColor: IBMD, dataLabelFontFace: SANS, dataLabelFormatCode: '$#,##0"M"',
    showLegend: false,
    valAxisTitle: "Revenue (US$ millions)", showValAxisTitle: true, valAxisTitleColor: MUTED, valAxisTitleFontSize: 9,
  });
  const tbl = [
    ["Revenue Stream (Year 5)", "US$M/yr"],
    ["Brazil (4 verticals + watsonx services)", "140"],
    ["LATAM (Granite sovereign cloud)", "90"],
    ["watsonx consulting + implementation", "60"],
    ["Compute-as-a-Service (Granite GPU cloud)", "35"],
    ["Colocation (ZPE CE)", "25"],
    ["TOTAL", "350"],
  ];
  const td = tbl.map((r,i) => r.map((c,j) => ({ text: c, options: { fontFace: SANS, fontSize: 9.5, bold: i===0 || i===tbl.length-1,
    color: i===0 ? WHITE : (i===tbl.length-1 ? IBM : TEXT),
    fill: { color: i===0 ? IBMD : (i===tbl.length-1 ? IBMD : (i%2===0 ? LIGHT : WHITE)) },
    align: j===1 ? "right" : "left", valign: "middle" } })));
  s.addTable(td, { x: 7.0, y: 1.7, w: 5.8, colW: [4.3, 1.5], rowH: 0.38, border: { type: "solid", pt: 0.5, color: BORDER } });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 5.5, w: W-2*M, h: 1.5, fill: { color: GRAY }, line: { color: IBM, width: 2 } });
  s.addText([
    { text: "US$ 250M Investment → US$ 780M Revenue (5 years) → US$ 2.7B Enterprise Value at Exit", options: { fontSize: 14, bold: true, color: WHITE, breakLine: true, align: "center" } },
    { text: "Direct ROI: 3.1×  ·  Enterprise Value Multiple: 10.8×  ·  Year 5 Run-Rate: US$ 350M/year", options: { fontSize: 11, color: "B0C0D0", breakLine: true, align: "center" } },
    { text: "Excluding: data center assets, watsonx integration IP, granitic.cloud domain value, recurring revenue beyond Year 5", options: { fontSize: 9, color: "6B8BB0", italic: true, align: "center" } }
  ], { x: M+0.5, y: 5.65, w: W-2*M-1.0, h: 1.2, margin: 0, lineSpacing: 16 });
  footer(s);
}

// S10 · THE ASK
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "What We Ask — What We Give", "A partnership anchored in shared values: trust, transparency, and sovereignty");
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 1.7, w: 5.8, h: 4.2, fill: { color: GRAY }, line: { color: IBM, width: 1.5 } });
  s.addText("IBM CONTRIBUTES", { x: M+0.3, y: 1.9, w: 5.2, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: WHITE, charSpacing: 2, margin: 0 });
  s.addText([
    { text: "US$ 250M partnership value", options: { bullet: buB(), bold: true, color: GOLDLT, breakLine: true } },
    { text: "Enterprise value of the joint venture — watsonx deployment, data center construction, regulated AI scaling", options: { bullet: false, fontSize: 9, color: "8FAFC0", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "watsonx platform", options: { bullet: buB(), bold: true, color: WHITE, breakLine: true } },
    { text: "watsonx.governance, .ai, .data — deployed on sovereign granitic.cloud infrastructure", options: { bullet: false, fontSize: 9, color: "8FAFC0", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Granite model roadmap", options: { bullet: buB(), bold: true, color: WHITE, breakLine: true } },
    { text: "Priority access to new Granite versions + joint fine-tuning for Brazilian regulated sectors", options: { bullet: false, fontSize: 9, color: "8FAFC0", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "IBM enterprise credibility", options: { bullet: buB(), bold: true, color: WHITE } }
  ], { x: M+0.3, y: 2.3, w: 5.2, h: 3.4, margin: 0, paraSpaceAfter: 4, lineSpacing: 14 });
  s.addShape(p.shapes.RECTANGLE, { x: 7.0, y: 1.7, w: 5.8, h: 4.2, fill: { color: LIGHT }, line: { color: BORDER, width: 1 } });
  s.addText("BEANS TECH CONTRIBUTES", { x: 7.3, y: 1.9, w: 5.2, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: IBMD, charSpacing: 2, margin: 0 });
  s.addText([
    { text: "Granite already in production", options: { bullet: bu(), bold: true, color: IBMD, breakLine: true } },
    { text: "Guardian on every clinical response, 4.1 on every compliance narrative — running, measured, auditable", options: { bullet: false, fontSize: 9, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "4 regulated verticals live", options: { bullet: bu(), bold: true, color: IBMD, breakLine: true } },
    { text: "Legal (77M+ decisions), Compliance, Healthcare, Real Estate — 75 production domains", options: { bullet: false, fontSize: 9, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "granitic.cloud premium domain", options: { bullet: bu(), bold: true, color: IBMD, breakLine: true } },
    { text: "Owned, NS pointing to our infrastructure, ready for activation", options: { bullet: false, fontSize: 9, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Sovereign data center sites", options: { bullet: bu(), bold: true, color: IBMD, breakLine: true } },
    { text: "PB (solar off-grid, carbon-free) + CE (ZPE, subsea) — land owned, projects ready", options: { bullet: false, fontSize: 9, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Regulatory expertise + distribution", options: { bullet: bu(), bold: true, color: IBMD } }
  ], { x: 7.3, y: 2.3, w: 5.2, h: 3.4, margin: 0, paraSpaceAfter: 2, lineSpacing: 13 });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 6.1, w: W-2*M, h: 0.8, fill: { color: LIGHT }, line: { color: IBM, width: 1 } });
  s.addText([
    { text: "On the US$ 250M: ", options: { bold: true, color: IBMD, fontSize: 10 } },
    { text: "This is the value we place on building this together with IBM specifically. Granite is already our guardrail and our compliance engine — no other model family has earned that trust. We are choosing IBM as much as IBM would be choosing us.", options: { color: MUTED, fontSize: 9.5 } }
  ], { x: M+0.3, y: 6.2, w: W-2*M-0.6, h: 0.6, margin: 0, lineSpacing: 13 });
  footer(s);
}

// S11 · NEXT STEPS
{
  const s = p.addSlide(); s.background = { color: GRAY };
  title(s, "Next Steps", "From executive brief to sovereign deployment", true);
  const steps = [
    ["Step 1", "Executive Brief (45 min)", "Live demo: Granite Guardian in production, 4 verticals, benchmark data, infrastructure plans"],
    ["Step 2", "Technical Due Diligence", "Access to health.beanstech.com.br (31 live probes), benchmark results, compliance frameworks"],
    ["Step 3", "Letter of Intent", "Capital structure, watsonx licensing, Granite fine-tuning terms, governance framework"],
    ["Step 4", "Sovereign Deployment", "granitic.cloud activation + watsonx on Brazilian territory within 90 days of agreement"],
  ];
  steps.forEach(([tag, h, b], i) => {
    const x = M + i * 3.1;
    s.addShape(p.shapes.RECTANGLE, { x, y: 1.8, w: 2.8, h: 1.8, fill: { color: "16161E" }, line: { color: IBM, width: 0.75 } });
    s.addText([
      { text: tag, options: { fontSize: 9, color: IBM, bold: true, charSpacing: 2, breakLine: true } },
      { text: h, options: { fontSize: 12, bold: true, color: WHITE, breakLine: true } },
      { text: b, options: { fontSize: 9, color: "B0C0D0" } }
    ], { x: x+0.2, y: 1.95, w: 2.4, h: 1.5, margin: 0, lineSpacing: 13, paraSpaceAfter: 4 });
    if (i < 3) s.addText("→", { x: x+2.75, y: 2.4, w: 0.4, h: 0.5, fontSize: 20, color: IBM, align: "center", margin: 0 });
  });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 4.2, w: W-2*M, h: 2.0, fill: { color: "16161E" }, line: { color: GOLD, width: 2.5 } });
  s.addText([
    { text: "US$ 250,000,000", options: { fontSize: 36, bold: true, color: GOLDLT, align: "center", breakLine: true, fontFace: SANS } },
    { text: "Strategic Partnership Value", options: { fontSize: 13, color: "8FAFC0", align: "center", breakLine: true, fontFace: SANS, charSpacing: 3 } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "US$ 780M revenue (5yr) · US$ 2.7B enterprise value at exit · 10.8× return", options: { fontSize: 12, color: WHITE, align: "center", italic: true, fontFace: SERIF } }
  ], { x: M+1, y: 4.4, w: W-2*M-2, h: 1.6, margin: 0, lineSpacing: 20 });
  s.addText("Matheus Ximenes · Founder & CEO · contato@feijaojustech.com.br\nbeanstech.com.br · granitic.cloud · z.cloud · ragjur.ai · ragmed.ai · dodr.ai", { x: M, y: 6.5, w: W-2*M, h: 0.6, fontSize: 10, fontFace: SANS, color: "6B8BB0", align: "center", margin: 0, lineSpacing: 14 });
  footer(s, true);
}

p.writeFile({ fileName: "GraniticCloud-IBM-Parceria-EN.pptx" }).then(f => console.log("✅", f));
