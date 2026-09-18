// BeansTech × Tencent Cloud — Sovereign AI Ecosystem & LATAM Latency Optimization
// 16:9 deck · navy/teal/gold (Tencent blue + eco green) · English · 13 slides
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "A4L", width: 13.33, height: 7.5 });
p.layout = "A4L"; p.author = "BeansTech"; p.company = "BeansTech";
p.title = "BeansTech × Tencent Cloud — Sovereign AI Ecosystem for LATAM";
const W = 13.33, H = 7.5, M = 0.55;
const NAVY = "0A1F2E", NAVY2 = "0D2839", TEAL = "00B8A9", GOLD = "D4A843", GOLDLT = "E8C847";
const TEXT = "1A2332", MUTED = "5A6B7A", LIGHT = "F0F5F7", BORDER = "C8D5DC", WHITE = "FFFFFF";
const TBLUE = "2E6FAF"; // Tencent blue
const SANS = "Helvetica Neue", SERIF = "Georgia";
let n = 0;

function footer(s, dark=false) {
  n++;
  s.addText(`BeansTech × Tencent Cloud — Confidential`, { x: M, y: H-0.38, w: 6, h: 0.28, fontSize: 8, fontFace: SANS, color: dark ? "6B9BB0" : MUTED, margin: 0 });
  s.addText(String(n), { x: W-M-0.5, y: H-0.38, w: 0.5, h: 0.28, fontSize: 8, fontFace: SANS, color: dark ? "6B9BB0" : MUTED, align: "right", margin: 0 });
}
function title(s, t, sub, dark=false) {
  s.addText(t, { x: M, y: 0.35, w: W-2*M, h: 0.7, fontSize: 28, fontFace: SANS, bold: true, color: dark ? TEAL : NAVY, margin: 0 });
  if (sub) s.addText(sub, { x: M, y: 1.0, w: W-2*M, h: 0.4, fontSize: 13, fontFace: SANS, color: dark ? "8FC0D0" : MUTED, margin: 0 });
  s.addShape(p.shapes.LINE, { x: M, y: 1.42, w: 2.4, h: 0, line: { color: GOLD, width: 3 } });
}
const bu = () => ({ code: "2013", indent: 10 });
const buG = () => ({ code: "25B8", indent: 10 });

// S1 · COVER
{
  const s = p.addSlide(); s.background = { color: NAVY };
  s.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: NAVY }, line: { color: NAVY } });
  s.addShape(p.shapes.OVAL, { x: W-2.6, y: 0.5, w: 1.8, h: 1.8, fill: { color: NAVY, transparency: 100 }, line: { color: TEAL, width: 2 } });
  s.addShape(p.shapes.OVAL, { x: W-2.3, y: 0.8, w: 1.2, h: 1.2, fill: { color: NAVY, transparency: 100 }, line: { color: TEAL, width: 1 } });
  s.addText("hy", { x: W-2.3, y: 0.8, w: 1.2, h: 1.2, fontSize: 36, fontFace: SANS, bold: true, color: TEAL, align: "center", valign: "middle", margin: 0 });
  s.addText("BEANSTECH  ×  TENCENT CLOUD", { x: M, y: 1.6, w: 8, h: 0.5, fontSize: 16, fontFace: SANS, color: TEAL, charSpacing: 4, bold: true, margin: 0 });
  s.addText("Sovereign AI Ecosystem\n& LATAM Latency Optimization", { x: M, y: 2.2, w: 9.5, h: 2.2, fontSize: 44, fontFace: SANS, bold: true, color: WHITE, margin: 0, lineSpacing: 50 });
  s.addText("The world's largest sovereign, carbon-free cloud ecosystem — merging Beans Tech's regulated AI verticals with hy.cloud's autonomous infrastructure blueprint and Tencent's Hunyuan compute architecture.", { x: M, y: 4.4, w: 9, h: 1.2, fontSize: 13, fontFace: SERIF, color: "B0C8D8", margin: 0, lineSpacing: 18 });
  s.addShape(p.shapes.LINE, { x: M, y: 5.7, w: 3, h: 0, line: { color: GOLD, width: 2 } });
  s.addText([
    { text: "US$ 350,000,000", options: { fontSize: 26, fontFace: SANS, bold: true, color: GOLDLT, breakLine: true } },
    { text: "Initial Capital Intake", options: { fontSize: 11, fontFace: SANS, color: "8FC0D0" } }
  ], { x: M, y: 5.9, w: 6, h: 1.0, margin: 0 });
  s.addText("Matheus Ximenes · Founder & CEO\nAttorney · Postgraduate in Cloud Computing & Data Protection\nSeptember 2026 · São Paulo, Brazil", { x: W-M-4.5, y: 5.9, w: 4.5, h: 0.9, fontSize: 9, fontFace: SANS, color: "6B9BB0", align: "right", margin: 0, lineSpacing: 14 });
  footer(s, true);
}

// S2 · EXECUTIVE SUMMARY
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "Executive Summary", "A production-ready sovereign AI platform with immediate market penetration into regulated sectors");
  const stats = [["US$ 350M","Capital Intake"],["4","AI Verticals (Regulated)"],["2","Data Centers (Dual-Hub)"],["650M","LATAM Population"],["77M+","Court Decisions Indexed"]];
  stats.forEach(([v,l],i) => {
    const x = M + i * 2.42;
    s.addShape(p.shapes.RECTANGLE, { x, y: 1.7, w: 2.2, h: 1.3, fill: { color: LIGHT }, line: { color: BORDER, width: 1 } });
    s.addText(v, { x, y: 1.78, w: 2.2, h: 0.6, fontSize: 22, fontFace: SANS, bold: true, color: NAVY, align: "center", margin: 0 });
    s.addText(l, { x, y: 2.38, w: 2.2, h: 0.5, fontSize: 8.5, fontFace: SANS, color: MUTED, align: "center", margin: 0, charSpacing: 1 });
  });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 3.3, w: W-2*M, h: 1.5, fill: { color: NAVY }, line: { color: NAVY } });
  s.addText([
    { text: "The foundation already exists — and it is sovereign.", options: { bold: true, color: TEAL, fontSize: 15, breakLine: true } },
    { text: "Beans Tech operates production-ready AI verticals across 4 regulated sectors (Legal, Compliance, Healthcare, Real Estate) with 77M+ court decisions indexed, sovereign identity and compliance infrastructure, and secured land for two data centers — one carbon-free with solar autonomy, one adjacent to international submarine cable landing stations.", options: { color: "B0C8D8", fontSize: 11.5 } }
  ], { x: M+0.3, y: 3.5, w: W-2*M-0.6, h: 1.1, margin: 0, lineSpacing: 16 });
  s.addText("What Tencent Cloud Gains", { x: M, y: 5.0, w: 5.8, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: TBLUE, margin: 0 });
  s.addText([
    { text: "Sovereign presence in LATAM — first major cloud with AI in a tax-free ZPE zone", options: { bullet: buG(), breakLine: true } },
    { text: "Network multiplier — direct subsea cable access reduces latency for all Tencent services in South America", options: { bullet: buG(), breakLine: true } },
    { text: "Turnkey monetization — compute paired with production-ready regulated AI verticals", options: { bullet: buG(), breakLine: true } },
    { text: "Hunyuan deployment — Hy4 model family embedded into regulated sector infrastructure", options: { bullet: buG() } }
  ], { x: M, y: 5.4, w: 5.8, h: 1.7, fontSize: 10.5, fontFace: SANS, color: TEXT, margin: 0, paraSpaceAfter: 6 });
  s.addText("What Beans Tech Brings", { x: 7.0, y: 5.0, w: 5.8, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: TBLUE, margin: 0 });
  s.addText([
    { text: "4 regulated verticals in production (Legal, Compliance, Health, Real Estate)", options: { bullet: buG(), breakLine: true } },
    { text: "77M+ indexed court decisions (ragjur.ai) — the largest legal RAG in Brazil", options: { bullet: buG(), breakLine: true } },
    { text: "Sovereign compliance infrastructure — LGPD, CFM, BACEN by design", options: { bullet: buG(), breakLine: true } },
    { text: "Dual-hub data center sites: ZPE Caucaia (subsea) + Santa Terezinha (solar off-grid)", options: { bullet: buG() } }
  ], { x: 7.0, y: 5.4, w: 5.8, h: 1.7, fontSize: 10.5, fontFace: SANS, color: TEXT, margin: 0, paraSpaceAfter: 6 });
  footer(s);
}

// S3 · THE MARKET FRICTION
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "The Core Market Friction", "High-barrier sectors cannot adopt unsecure, non-compliant, or volatile infrastructure");
  s.addText("The Challenge", { x: M, y: 1.7, w: 5.8, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: NAVY, margin: 0 });
  s.addText([
    { text: "Government & Judiciary", options: { bullet: bu(), bold: true, breakLine: true } },
    { text: "Cannot use cloud AI on public networks — data sovereignty is statutory", options: { bullet: false, fontSize: 9.5, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Healthcare", options: { bullet: bu(), bold: true, breakLine: true } },
    { text: "Patient data cannot cross borders without explicit contractual basis (LGPD art. 33)", options: { bullet: false, fontSize: 9.5, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Finance & Compliance", options: { bullet: bu(), bold: true, breakLine: true } },
    { text: "BACEN and COAF require audit trails and ring-fenced processing", options: { bullet: false, fontSize: 9.5, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Power Grid Volatility", options: { bullet: bu(), bold: true, breakLine: true } },
    { text: "Brazilian national grid instability creates operational risk for high-duty AI workloads", options: { bullet: false, fontSize: 9.5, color: MUTED } }
  ], { x: M, y: 2.1, w: 5.8, h: 4.3, margin: 0, paraSpaceAfter: 4, lineSpacing: 14 });
  s.addText("The Entryway", { x: 7.0, y: 1.7, w: 5.8, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: TEAL, margin: 0 });
  s.addShape(p.shapes.RECTANGLE, { x: 7.0, y: 2.1, w: 5.8, h: 4.2, fill: { color: NAVY }, line: { color: TEAL, width: 1 } });
  s.addText([
    { text: "A localized, fully sovereign cloud environment", options: { fontSize: 15, bold: true, color: TEAL, breakLine: true } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "Built by design to fulfill:", options: { fontSize: 11, color: "B0C8D8", breakLine: true } },
    { text: "  • Strict statutory data residency (LGPD)", options: { fontSize: 10.5, color: "B0C8D8", breakLine: true } },
    { text: "  • Absolute data isolation and audit trail", options: { fontSize: 10.5, color: "B0C8D8", breakLine: true } },
    { text: "  • Environmental (ESG) mandates — carbon-free", options: { fontSize: 10.5, color: "B0C8D8", breakLine: true } },
    { text: "  • Energy independence from public grid", options: { fontSize: 10.5, color: "B0C8D8", breakLine: true } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "Powered by:", options: { fontSize: 11, color: "B0C8D8", breakLine: true } },
    { text: "  • Tencent Hunyuan/Hy4 compute architecture", options: { fontSize: 10.5, color: GOLDLT, breakLine: true } },
    { text: "  • Beans Tech regulated AI verticals (production-ready)", options: { fontSize: 10.5, color: GOLDLT, breakLine: true } },
    { text: "  • hy.cloud autonomous eco-infrastructure", options: { fontSize: 10.5, color: GOLDLT } }
  ], { x: 7.2, y: 2.25, w: 5.4, h: 3.9, margin: 0, lineSpacing: 15, paraSpaceAfter: 3 });
  footer(s);
}

// S4 · THE 4 VERTICALS
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "The 4 Regulated AI Verticals", "Instant monetization — Tencent compute paired with production-ready AI engines");
  const verts = [
    ["⚖️ Legal & Compliance", "ragjur.ai · legalsuite.tech", "Multi-jurisdictional RAG engines · anti-hallucination decision support · 77M+ indexed court decisions · auditable judicial compliance", "1.2M attorneys · R$ 80B/yr"],
    ["🛡️ Compliance / RegTech", "pldbr.tech · beansbank", "Automated governance, AML, regulatory monitoring · SAR narrative generation · complex Latin American legal frameworks", "740 institutions · R$ 12B/yr"],
    ["🏥 Healthcare", "dodr.ai · ragmed.ai", "Ring-fenced clinical environments · sovereign processing of medical records · clinical decision support with audit trail", "550k physicians · R$ 4.4B/yr"],
    ["🏢 Real Estate", "alirealty.com.br · proptechbr.ai", "Intelligent transaction auditing · compliance engines for high-value asset acquisitions · document analysis at scale", "R$ 15B/yr (proptech)"],
  ];
  verts.forEach(([v, dom, desc, mkt], i) => {
    const x = M + (i % 2) * 6.15, y = 1.7 + Math.floor(i / 2) * 2.6;
    s.addShape(p.shapes.RECTANGLE, { x, y, w: 5.9, h: 2.3, fill: { color: LIGHT }, line: { color: BORDER, width: 1 } });
    s.addText([
      { text: v, options: { fontSize: 14, bold: true, color: NAVY, breakLine: true } },
      { text: dom, options: { fontSize: 10, color: TBLUE, italic: true, breakLine: true } },
      { text: " ", options: { fontSize: 4, breakLine: true } },
      { text: desc, options: { fontSize: 9.5, color: MUTED, breakLine: true } },
      { text: " ", options: { fontSize: 4, breakLine: true } },
      { text: mkt, options: { fontSize: 10, bold: true, color: TEAL } }
    ], { x: x+0.25, y: y+0.15, w: 5.4, h: 2.0, margin: 0, lineSpacing: 13, paraSpaceAfter: 3 });
  });
  s.addText("All verticals share: the same model engine (Hunyuan/Hy4) · the same identity (OIDC) · the same compliance stack · the same principle — prove what you answer.", { x: M, y: 6.78, w: W-2*M, h: 0.35, fontSize: 9.5, fontFace: SANS, color: NAVY, bold: true, align: "center", margin: 0 });
  footer(s);
}

// S5 · INFRASTRUCTURE BLUEPRINT — THE "HY" MODEL
{
  const s = p.addSlide(); s.background = { color: NAVY };
  title(s, 'The "hy" Model — Infrastructure Blueprint', "Complete sovereignty: logical, physical, and energy independence", true);
  s.addText("HY-per-Secure Hybridization", { x: M, y: 1.7, w: 5.8, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: TEAL, margin: 0 });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 2.1, w: 5.8, h: 2.5, fill: { color: NAVY2 }, line: { color: TEAL, width: 1 } });
  s.addText([
    { text: "Complete logical and physical segregation of institutional data", options: { bullet: buG(), color: "B0C8D8", breakLine: true } },
    { text: "Absolute data sovereignty — inference data terminates within local hardware boundaries", options: { bullet: buG(), color: "B0C8D8", breakLine: true } },
    { text: "Ring-fenced enclaves per vertical (Legal, Compliance, Health, Real Estate)", options: { bullet: buG(), color: "B0C8D8", breakLine: true } },
    { text: "LGPD statutory isolation satisfied by architectural design, not contract amendment", options: { bullet: buG(), color: GOLDLT } }
  ], { x: M+0.25, y: 2.25, w: 5.3, h: 2.2, margin: 0, fontSize: 10.5, paraSpaceAfter: 6, lineSpacing: 14 });
  s.addText("HY-dro-Solar Autonomy", { x: 7.0, y: 1.7, w: 5.8, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: TEAL, margin: 0 });
  s.addShape(p.shapes.RECTANGLE, { x: 7.0, y: 2.1, w: 5.8, h: 2.5, fill: { color: NAVY2 }, line: { color: GOLD, width: 1 } });
  s.addText([
    { text: "100% off-grid — zero connection to public power grid", options: { bullet: buG(), color: "B0C8D8", breakLine: true } },
    { text: "Dedicated photovoltaic solar plant on owned land", options: { bullet: buG(), color: "B0C8D8", breakLine: true } },
    { text: "High-throughput satellite transmission backup", options: { bullet: buG(), color: "B0C8D8", breakLine: true } },
    { text: "Carbon-free processing — ESG-auditable, zero-carbon per GPU-hour", options: { bullet: buG(), color: GOLDLT, breakLine: true } },
    { text: "Complete insulation from public grid failures and energy price volatility", options: { bullet: buG(), color: GOLDLT } }
  ], { x: 7.25, y: 2.25, w: 5.3, h: 2.2, margin: 0, fontSize: 10.5, paraSpaceAfter: 6, lineSpacing: 14 });
  // bottom: the dual-hub diagram
  s.addText("The Dual-Hub Deployment Model", { x: M, y: 4.8, w: 6, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: TEAL, margin: 0 });
  const hubs = [
    ["Hub 1: ZPE Caucaia, CE", "Subsea Link & Tax-Free Zone", "Adjacent to submarine cable landing stations · duty-free GPU ingestion · direct transatlantic fiber"],
    ["Hub 2: Santa Terezinha, PB", "Solar Autonomy & Satellite", "100% off-grid photovoltaic plant · satellite transmission · carbon-free · owned land"],
  ];
  hubs.forEach(([h, t, b], i) => {
    const x = M + i * 6.15;
    s.addShape(p.shapes.RECTANGLE, { x, y: 5.2, w: 5.9, h: 1.5, fill: { color: NAVY2 }, line: { color: i === 0 ? TBLUE : GOLD, width: 1 } });
    s.addText([
      { text: h, options: { fontSize: 12, bold: true, color: i === 0 ? TEAL : GOLDLT, breakLine: true } },
      { text: t, options: { fontSize: 10, color: "8FC0D0", italic: true, breakLine: true } },
      { text: b, options: { fontSize: 9, color: "B0C8D8" } }
    ], { x: x+0.2, y: 5.3, w: 5.5, h: 1.3, margin: 0, lineSpacing: 13, paraSpaceAfter: 4 });
  });
  footer(s, true);
}

// S6 · ZPE CAUCAIA NETWORK ADVANTAGE
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "ZPE Caucaia — The Subsea Cable Advantage", "Direct integration with international submarine cable landing stations");
  // latency chart
  s.addChart(p.charts.BAR, [{
    name: "Traditional (inland multi-hop)",
    labels: ["US East", "Europe", "Intra-LATAM"],
    values: [122, 145, 60]
  }, {
    name: "ZPE Caucaia (direct subsea)",
    labels: ["US East", "Europe", "Intra-LATAM"],
    values: [62, 61, 21]
  }], {
    x: M, y: 1.7, w: 5.8, h: 3.5, barDir: "col",
    chartColors: [TBLUE, TEAL],
    chartArea: { fill: { color: WHITE } },
    catAxisLabelColor: MUTED, valAxisLabelColor: MUTED,
    catAxisLabelFontFace: SANS, valAxisLabelFontFace: SANS,
    valGridLine: { color: BORDER, size: 0.5 }, catGridLine: { style: "none" },
    showValue: true, dataLabelPosition: "outEnd", dataLabelColor: NAVY, dataLabelFontFace: SANS, dataLabelFormatCode: '0"ms"',
    showLegend: true, legendPos: "b", legendFontFace: SANS, legendColor: MUTED,
    valAxisTitle: "Round-trip latency (ms)", showValAxisTitle: true, valAxisTitleColor: MUTED, valAxisTitleFontSize: 9,
    barGapWidthPct: 60
  });
  s.addText("Submarine Cable Systems at Node", { x: 7.0, y: 1.7, w: 5.8, h: 0.4, fontSize: 13, fontFace: SANS, bold: true, color: NAVY, margin: 0 });
  const cables = [
    ["Monet & Seabras-1", "Direct ultra-low-latency paths to US East (Virginia, New Jersey, Miami) — 42-48% latency reduction"],
    ["EllaLink", "Direct optical link to Europe (Sines/Lisbon, Portugal) — bypassing US jurisdiction — 55-60% reduction"],
    ["SACS", "Direct southern routing toward Africa (Luanda) and onward to Asia-Pacific"],
    ["Junior & Malbec", "High-capacity coastal backbones to São Paulo, Rio, Buenos Aires"],
  ];
  cables.forEach(([h, b], i) => {
    const y = 2.05 + i * 0.95;
    s.addShape(p.shapes.RECTANGLE, { x: 7.0, y, w: 5.8, h: 0.85, fill: { color: LIGHT }, line: { color: BORDER, width: 0.75 } });
    s.addText([
      { text: h, options: { fontSize: 11, bold: true, color: TBLUE, breakLine: true } },
      { text: b, options: { fontSize: 9, color: MUTED } }
    ], { x: 7.15, y: y+0.05, w: 5.5, h: 0.8, margin: 0, lineSpacing: 12, paraSpaceAfter: 2 });
  });
  s.addText("Tencent Connectivity Multiplier: anchoring compute at this node optimizes latency for the entirety of Tencent Cloud's corporate service catalog across South America.", { x: M, y: 5.75, w: W-2*M, h: 0.40, fontSize: 10.5, bold: true, align: "center", margin: 0 });
  footer(s);
}

// S7 · LATENCY QUANTIFICATION TABLE
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "Quantitative Latency Benchmarks", "Engineered vs. traditional routing — measured round-trip times (RTT)");
  const rows = [
    ["Traffic Route", "Traditional Path (Inland/Multi-Hop)", "ZPE Caucaia Direct Subsea", "RTT Reduction"],
    ["Fortaleza ↔ US East (Virginia/Miami)", "~110-135 ms (via SP loop)", "~60-65 ms", "42-48%"],
    ["Fortaleza ↔ Europe (Lisbon/Madrid)", "~130-160 ms (via US routing)", "~58-64 ms (via EllaLink)", "55-60%"],
    ["Intra-LATAM ↔ Regional Nodes", "~45-75 ms", "~15-28 ms (direct fiber)", "~50%"],
  ];
  const td = rows.map((r,i) => r.map((c,j) => ({
    text: c,
    options: {
      fontFace: SANS, fontSize: i===0 ? 9 : 10, bold: i===0 || j===3,
      color: i===0 ? GOLDLT : (j===3 ? TEAL : TEXT),
      fill: { color: i===0 ? NAVY : (i%2===0 ? LIGHT : WHITE) },
      align: j===3 ? "center" : "left", valign: "middle"
    }
  })));
  s.addTable(td, { x: M, y: 1.7, w: W-2*M, colW: [3.5, 3.2, 3.0, 2.03], rowH: 0.55, border: { type: "solid", pt: 0.5, color: BORDER } });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 4.3, w: W-2*M, h: 1.2, fill: { color: NAVY }, line: { color: TEAL, width: 1 } });
  s.addText([
    { text: "What this means for Tencent Cloud:", options: { bold: true, color: TEAL, fontSize: 12, breakLine: true } },
    { text: "Every Tencent service — WeChat API, Tencent Meeting, cloud compute, gaming, and Hunyuan inference — gains a direct low-latency edge node in South America. No longer routing through US or São Paulo intermediaries. 42-60% improvement for 650 million potential users.", options: { color: "B0C8D8", fontSize: 10.5 } }
  ], { x: M+0.3, y: 4.4, w: W-2*M-0.6, h: 0.9, margin: 0, lineSpacing: 15 });
  s.addText("Source: Beans Tech Technical Architecture Note TAN-LATAM-2026-09 — available for engineering review", { x: M, y: 6.75, w: W-2*M, h: 0.3, fontSize: 8, fontFace: SANS, color: MUTED, italic: true, margin: 0 });
  footer(s);
}

// S8 · HUNYUAN INTEGRATION
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "Tencent Hunyuan / Hy4 — Model Integration", "Embedding Tencent's frontier AI architecture into Latin America's regulated sectors");
  s.addText("What Hunyuan Brings", { x: M, y: 1.6, w: 5.8, h: 0.4, fontSize: 13, fontFace: SANS, bold: true, color: TBLUE, margin: 0 });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 2.0, w: 5.8, h: 4.5, fill: { color: LIGHT }, line: { color: TBLUE, width: 1 } });
  s.addText([
    { text: "Hunyuan-Large (Hy4)", options: { bullet: bu(), bold: true, breakLine: true } },
    { text: "Frontier MoE architecture with 389B parameters — competitive with GLM-5.3, Qwen-3.8-Max, DeepSeek", options: { bullet: false, fontSize: 9.5, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Hunyuan-Flash", options: { bullet: bu(), bold: true, breakLine: true } },
    { text: "High-throughput variant for volume inference — document triage, compliance screening, legal search", options: { bullet: false, fontSize: 9.5, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Hunyuan Vision", options: { bullet: bu(), bold: true, breakLine: true } },
    { text: "Multimodal for medical imaging, document OCR, real estate photo analysis", options: { bullet: false, fontSize: 9.5, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Open weights (Apache/Custom)", options: { bullet: bu(), bold: true, breakLine: true } },
    { text: "Available for local deployment on sovereign infrastructure — no API dependency", options: { bullet: false, fontSize: 9.5, color: MUTED } }
  ], { x: M+0.25, y: 2.15, w: 5.3, h: 4.2, margin: 0, paraSpaceAfter: 3, lineSpacing: 14 });
  s.addText("How Beans Tech Deploys It", { x: 7.0, y: 1.6, w: 5.8, h: 0.4, fontSize: 13, fontFace: SANS, bold: true, color: TEAL, margin: 0 });
  s.addShape(p.shapes.RECTANGLE, { x: 7.0, y: 2.0, w: 5.8, h: 4.5, fill: { color: NAVY }, line: { color: TEAL, width: 1 } });
  s.addText([
    { text: "Legal (ragjur.ai)", options: { bullet: buG(), bold: true, color: TEAL, breakLine: true } },
    { text: "Hy4-Large for multi-party judicial analysis · Flash for 77M+ decision search volume", options: { bullet: false, fontSize: 9.5, color: "B0C8D8", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Compliance (pldbr.tech)", options: { bullet: buG(), bold: true, color: TEAL, breakLine: true } },
    { text: "Hy4 for SAR narratives and complex regulatory interpretation · Flash for transaction triage", options: { bullet: false, fontSize: 9.5, color: "B0C8D8", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Healthcare (dodr.ai)", options: { bullet: buG(), bold: true, color: TEAL, breakLine: true } },
    { text: "Hy4-Large for clinical decision support with anti-hallucination chain · Vision for imaging", options: { bullet: false, fontSize: 9.5, color: "B0C8D8", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Real Estate (proptechbr.ai)", options: { bullet: buG(), bold: true, color: TEAL, breakLine: true } },
    { text: "Flash for document analysis (matrículas, deeds, liens) in seconds vs. hours · Vision for property photos", options: { bullet: false, fontSize: 9.5, color: "B0C8D8" } }
  ], { x: 7.25, y: 2.15, w: 5.3, h: 4.2, margin: 0, paraSpaceAfter: 3, lineSpacing: 14 });
  footer(s);
}

// S9 · FISCAL & THERMODYNAMIC ADVANTAGES
{
  const s = p.addSlide(); s.background = { color: NAVY };
  title(s, "Fiscal & Thermodynamic Advantages", "Why ZPE Caucaia is the optimal sovereign deployment perimeter", true);
  s.addText("Tax-Exempt Ingestion (ZPE Regime)", { x: M, y: 1.7, w: 5.8, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: GOLDLT, margin: 0 });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 2.1, w: 5.8, h: 2.8, fill: { color: NAVY2 }, line: { color: GOLD, width: 1 } });
  s.addText([
    { text: "Under Brazilian Federal Law governing ZPE (Export Processing Zones):", options: { fontSize: 10, color: "B0C8D8", breakLine: true } },
    { text: "  • GPU clusters: import tariff suspension/exemption", options: { fontSize: 10, color: GOLDLT, breakLine: true } },
    { text: "  • Tensor processing units: zero import tax", options: { fontSize: 10, color: GOLDLT, breakLine: true } },
    { text: "  • Liquid-chilled racks: duty-free entry", options: { fontSize: 10, color: GOLDLT, breakLine: true } },
    { text: "  • Maximizing hardware density per dollar of capital intake", options: { fontSize: 10, color: GOLDLT, bold: true, breakLine: true } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "Result: Tencent's $350M investment buys significantly more GPU capacity than in any non-ZPE jurisdiction in the Americas.", options: { fontSize: 11, color: WHITE, bold: true } }
  ], { x: M+0.25, y: 2.25, w: 5.3, h: 2.5, margin: 0, lineSpacing: 14, paraSpaceAfter: 3 });
  s.addText("Thermal Efficiency", { x: 7.0, y: 1.7, w: 5.8, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: TEAL, margin: 0 });
  s.addShape(p.shapes.RECTANGLE, { x: 7.0, y: 2.1, w: 5.8, h: 2.8, fill: { color: NAVY2 }, line: { color: TEAL, width: 1 } });
  s.addText([
    { text: "Proximity to the Pecém Industrial Complex:", options: { fontSize: 10, color: "B0C8D8", breakLine: true } },
    { text: "  • Clean-energy grid interconnection (wind + solar)", options: { fontSize: 10, color: TEAL, breakLine: true } },
    { text: "  • Coastal cooling corridors for free-air cooling", options: { fontSize: 10, color: TEAL, breakLine: true } },
    { text: "  • PUE (Power Usage Effectiveness) optimized to international tier standards", options: { fontSize: 10, color: TEAL, breakLine: true } },
    { text: "  • Continuous high-duty AI workloads without thermal throttling", options: { fontSize: 10, color: TEAL, breakLine: true } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "Combined with Hub 2 (Santa Terezinha solar off-grid), the dual-hub model achieves complete energy independence.", options: { fontSize: 11, color: WHITE, bold: true } }
  ], { x: 7.25, y: 2.25, w: 5.3, h: 2.5, margin: 0, lineSpacing: 14, paraSpaceAfter: 3 });
  footer(s, true);
}

// S10 · ALLIANCE STRUCTURE
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "Alliance Structure & Capital Allocation", "US$ 350M initial intake — targeted deployment");
  s.addText("Capital Allocation", { x: M, y: 1.6, w: 6, h: 0.4, fontSize: 13, fontFace: SANS, bold: true, color: NAVY, margin: 0 });
  const alloc = [
    ["Enterprise Hardware Procurement", "GPU clusters (H100/L20), tensor units, liquid-cooled racks, optical transponders", "US$ 150M"],
    ["Localized Model Ingestion", "Hunyuan/Hy4 model weights, fine-tuning infrastructure, inference clusters", "US$ 80M"],
    ["Green Off-Grid Site Development", "Solar plant expansion, satellite connectivity, ZPE construction", "US$ 70M"],
    ["Regulated AI Vertical Scaling", "Production deployment across 4 verticals, compliance infrastructure, team", "US$ 50M"],
  ];
  alloc.forEach(([h, b, v], i) => {
    const y = 2.0 + i * 1.25;
    s.addShape(p.shapes.RECTANGLE, { x: M, y, w: 5.9, h: 1.1, fill: { color: i === 0 ? NAVY : LIGHT }, line: { color: i === 0 ? GOLD : BORDER, width: i === 0 ? 1.5 : 0.75 } });
    const dark = i === 0;
    s.addText([
      { text: h, options: { fontSize: 11, bold: true, color: dark ? GOLDLT : NAVY, breakLine: true } },
      { text: b, options: { fontSize: 9, color: dark ? "B0C8D8" : MUTED, breakLine: true } },
      { text: v, options: { fontSize: 11, bold: true, color: dark ? GOLDLT : TEAL } }
    ], { x: M+0.25, y: y+0.1, w: 5.4, h: 0.9, margin: 0, lineSpacing: 13, paraSpaceAfter: 2 });
  });
  s.addText("Value Synergy", { x: 7.0, y: 1.6, w: 5.8, h: 0.4, fontSize: 13, fontFace: SANS, bold: true, color: NAVY, margin: 0 });
  s.addText([
    { text: "Pre-engineered compliance frameworks", options: { bullet: buG(), bold: true, breakLine: true } },
    { text: "LGPD, CFM, BACEN, ANS compliance built into the architecture from day one — not bolted on", options: { bullet: false, fontSize: 9.5, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Localized deployment pipelines", options: { bullet: buG(), bold: true, breakLine: true } },
    { text: "Production infrastructure already running — 77M+ decisions indexed, 8 medical portals live, identity and compliance stack operational", options: { bullet: false, fontSize: 9.5, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Established institutional networks", options: { bullet: buG(), bold: true, breakLine: true } },
    { text: "Founder is a corporate attorney with 12 years in the Judiciary — direct access to tribunals, hospitals, and financial institutions", options: { bullet: false, fontSize: 9.5, color: MUTED, breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Sovereign land and premium domains", options: { bullet: buG(), bold: true, breakLine: true } },
    { text: "hy.cloud as product domain · land in PB (solar + satellite) and CE (ZPE, subsea) — ready for construction", options: { bullet: false, fontSize: 9.5, color: MUTED } }
  ], { x: 7.0, y: 2.0, w: 5.8, h: 4.5, margin: 0, paraSpaceAfter: 3, lineSpacing: 14 });
  footer(s);
}

// S11 · REVENUE PROJECTION
{
  const s = p.addSlide(); s.background = { color: WHITE };
  title(s, "Revenue Projection", "US$ 350M partnership → US$ 1.1B cumulative revenue (5 years) → US$ 3.8B enterprise value");
  s.addChart(p.charts.BAR, [{
    name: "Annual Revenue (US$M)",
    labels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
    values: [18, 72, 160, 310, 480]
  }], {
    x: M, y: 1.7, w: 5.8, h: 3.5, barDir: "col",
    chartColors: [TEAL],
    chartArea: { fill: { color: WHITE } },
    catAxisLabelColor: MUTED, valAxisLabelColor: MUTED,
    catAxisLabelFontFace: SANS, valAxisLabelFontFace: SANS,
    valGridLine: { color: BORDER, size: 0.5 }, catGridLine: { style: "none" },
    showValue: true, dataLabelPosition: "outEnd", dataLabelColor: NAVY, dataLabelFontFace: SANS, dataLabelFormatCode: '$#,##0"M"',
    showLegend: false,
    valAxisTitle: "Revenue (US$ millions)", showValAxisTitle: true, valAxisTitleColor: MUTED, valAxisTitleFontSize: 9,
  });
  const tbl = [
    ["Revenue Stream (Year 5)", "US$M/yr"],
    ["Brazil (4 verticals SaaS + API)", "180"],
    ["Latin America (Tencent edge services)", "120"],
    ["Compute-as-a-Service (GPU cloud)", "80"],
    ["Sovereign Cloud (hy.cloud API)", "60"],
    ["Colocation (ZPE CE)", "40"],
    ["TOTAL", "480"],
  ];
  const td = tbl.map((r,i) => r.map((c,j) => ({ text: c, options: { fontFace: SANS, fontSize: 9.5, bold: i===0 || i===tbl.length-1,
    color: i===0 ? GOLDLT : (i===tbl.length-1 ? GOLD : TEXT),
    fill: { color: i===0 ? NAVY : (i===tbl.length-1 ? NAVY : (i%2===0 ? LIGHT : WHITE)) },
    align: j===1 ? "right" : "left", valign: "middle" } })));
  s.addTable(td, { x: 7.0, y: 1.7, w: 5.8, colW: [4.3, 1.5], rowH: 0.38, border: { type: "solid", pt: 0.5, color: BORDER } });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 5.5, w: W-2*M, h: 1.5, fill: { color: NAVY }, line: { color: GOLD, width: 2 } });
  s.addText([
    { text: "US$ 350M Investment → US$ 1.1B Revenue (5 years) → US$ 3.8B Enterprise Value at Exit", options: { fontSize: 14, bold: true, color: GOLDLT, breakLine: true, align: "center" } },
    { text: "Direct ROI: 3.1×  ·  Enterprise Value Multiple: 10.9×  ·  Year 5 Run-Rate: US$ 480M/year", options: { fontSize: 11, color: "B0C8D8", breakLine: true, align: "center" } },
    { text: "Excluding: data center assets, Hunyuan fine-tuned model IP, domain portfolio, recurring revenue beyond Year 5", options: { fontSize: 9, color: "6B9BB0", italic: true, align: "center" } }
  ], { x: M+0.5, y: 5.65, w: W-2*M-1.0, h: 1.2, margin: 0, lineSpacing: 16 });
  footer(s);
}

// S12 · GOVERNANCE & THE ASK
{
  const s = p.addSlide(); s.background = { color: NAVY };
  title(s, "Alliance Proposal — What We Ask, What We Give", "A partnership of equals, anchored in shared vision for sovereign AI", true);
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 1.7, w: 5.8, h: 4.2, fill: { color: NAVY2 }, line: { color: GOLD, width: 1.5 } });
  s.addText("TENCENT CLOUD CONTRIBUTES", { x: M+0.3, y: 1.9, w: 5.2, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: GOLDLT, charSpacing: 2, margin: 0 });
  s.addText([
    { text: "US$ 350M capital intake", options: { bullet: buG(), bold: true, color: GOLDLT, breakLine: true } },
    { text: "Anchoring, scaling, and co-owning the sovereign ecosystem", options: { bullet: false, fontSize: 9, color: "8FC0D0", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Hunyuan / Hy4 model family", options: { bullet: buG(), bold: true, color: WHITE, breakLine: true } },
    { text: "Base weights + deployment rights for sovereign infrastructure in LATAM", options: { bullet: false, fontSize: 9, color: "8FC0D0", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Global network integration", options: { bullet: buG(), bold: true, color: WHITE, breakLine: true } },
    { text: "AS36351 BGP peering + subsea cable integration at ZPE Caucaia", options: { bullet: false, fontSize: 9, color: "8FC0D0", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Enterprise hardware pipeline", options: { bullet: buG(), bold: true, color: WHITE } }
  ], { x: M+0.3, y: 2.3, w: 5.2, h: 3.4, margin: 0, paraSpaceAfter: 4, lineSpacing: 14 });
  s.addShape(p.shapes.RECTANGLE, { x: 7.0, y: 1.7, w: 5.8, h: 4.2, fill: { color: NAVY2 }, line: { color: TEAL, width: 1 } });
  s.addText("BEANS TECH CONTRIBUTES", { x: 7.3, y: 1.9, w: 5.2, h: 0.4, fontSize: 14, fontFace: SANS, bold: true, color: TEAL, charSpacing: 2, margin: 0 });
  s.addText([
    { text: "4 regulated verticals in production", options: { bullet: buG(), bold: true, color: TEAL, breakLine: true } },
    { text: "Legal (77M+ decisions), Compliance, Healthcare, Real Estate — all live and auditable", options: { bullet: false, fontSize: 9, color: "8FC0D0", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Sovereign infrastructure sites", options: { bullet: buG(), bold: true, color: TEAL, breakLine: true } },
    { text: "ZPE Caucaia (subsea, tax-free) + Santa Terezinha (solar, off-grid) — land owned, projects ready", options: { bullet: false, fontSize: 9, color: "8FC0D0", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "hy.cloud premium domain", options: { bullet: buG(), bold: true, color: TEAL, breakLine: true } },
    { text: "Product domain for the sovereign cloud, positioned and ready", options: { bullet: false, fontSize: 9, color: "8FC0D0", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Regulatory expertise + institutional networks", options: { bullet: buG(), bold: true, color: TEAL, breakLine: true } },
    { text: "Founder attorney, 12 years Judiciary, postgraduate in Cloud + Data Protection", options: { bullet: false, fontSize: 9, color: "8FC0D0", breakLine: true } },
    { text: " ", options: { fontSize: 4, breakLine: true } },
    { text: "Compliance frameworks + deployment pipelines", options: { bullet: buG(), bold: true, color: TEAL } }
  ], { x: 7.3, y: 2.3, w: 5.2, h: 3.4, margin: 0, paraSpaceAfter: 2, lineSpacing: 13 });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 6.1, w: W-2*M, h: 0.8, fill: { color: NAVY2 }, line: { color: GOLD, width: 1 } });
  s.addText([
    { text: "On the US$ 350M: ", options: { bold: true, color: GOLDLT, fontSize: 10 } },
    { text: "This is the value we place on this alliance — and on building it together with Tencent Cloud specifically. We are choosing Tencent as much as Tencent would be choosing us. The combination of our sovereign infrastructure, regulated AI verticals, and Hunyuan's compute architecture is worth more than the sum of its parts.", options: { color: "B0C8D8", fontSize: 9.5 } }
  ], { x: M+0.3, y: 6.2, w: W-2*M-0.6, h: 0.6, margin: 0, lineSpacing: 13 });
  footer(s, true);
}

// S13 · NEXT STEPS + CLOSE
{
  const s = p.addSlide(); s.background = { color: NAVY };
  title(s, "Next Steps", "From executive brief to sovereign deployment", true);
  const steps = [
    ["Step 1", "Executive Brief (45 min)", "Live presentation: hy.cloud model, 4 verticals, technical architecture note, latency benchmarks"],
    ["Step 2", "Technical Due Diligence", "Access to infrastructure, benchmark results, compliance frameworks, site visits (CE and PB)"],
    ["Step 3", "Letter of Intent", "Capital structure, milestone schedule, governance framework, Hunyuan licensing terms"],
    ["Step 4", "Sovereign Deployment", "ZPE Caucaia construction + Hunyuan cluster deployment within 90 days of agreement"],
  ];
  steps.forEach(([tag, h, b], i) => {
    const x = M + i * 3.1;
    s.addShape(p.shapes.RECTANGLE, { x, y: 1.8, w: 2.8, h: 1.8, fill: { color: NAVY2 }, line: { color: TEAL, width: 0.75 } });
    s.addText([
      { text: tag, options: { fontSize: 9, color: TEAL, bold: true, charSpacing: 2, breakLine: true } },
      { text: h, options: { fontSize: 12, bold: true, color: WHITE, breakLine: true } },
      { text: b, options: { fontSize: 9, color: "B0C8D8" } }
    ], { x: x+0.2, y: 1.95, w: 2.4, h: 1.5, margin: 0, lineSpacing: 13, paraSpaceAfter: 4 });
    if (i < 3) s.addText("→", { x: x+2.75, y: 2.4, w: 0.4, h: 0.5, fontSize: 20, color: TEAL, align: "center", margin: 0 });
  });
  s.addShape(p.shapes.RECTANGLE, { x: M, y: 4.2, w: W-2*M, h: 2.0, fill: { color: NAVY2 }, line: { color: GOLD, width: 2.5 } });
  s.addText([
    { text: "US$ 350,000,000", options: { fontSize: 36, bold: true, color: GOLDLT, align: "center", breakLine: true, fontFace: SANS } },
    { text: "Initial Capital Intake", options: { fontSize: 13, color: "8FC0D0", align: "center", breakLine: true, fontFace: SANS, charSpacing: 3 } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "US$ 1.1B revenue (5yr) · US$ 3.8B enterprise value at exit · 10.9× return", options: { fontSize: 12, color: WHITE, align: "center", italic: true, fontFace: SERIF } }
  ], { x: M+1, y: 4.4, w: W-2*M-2, h: 1.6, margin: 0, lineSpacing: 20 });
  s.addText("Matheus Ximenes Feijão Guimarães · Founder, Beans Tech\nhy.cloud | brasileiro.tech\ncontato@feijaojustech.com.br · beanstech.com.br", { x: M, y: 6.5, w: W-2*M, h: 0.6, fontSize: 10, fontFace: SANS, color: "6B9BB0", align: "center", margin: 0, lineSpacing: 14 });
  footer(s, true);
}

p.writeFile({ fileName: "hyCloud-Tencent-Parceria-EN.pptx" }).then(f => console.log("✅", f));
