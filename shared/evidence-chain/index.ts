/**
 * evidence-chain — cadeia anti-alucinação compartilhada dos portais healthtech (BeansTech, stack Alibaba).
 *
 * Ordem das camadas (decisão 2026-09-13):
 *   1. RagJur/RagMed  — recuperação em Elasticsearch self-hosted no ECS br-es (sa-east-1). Nada é respondido sem trecho.
 *   2. Model Studio   — DashScope intl (OpenAI-compatible): qwen-plus/qwen-max + tools. Síntese SÓ sobre os trechos da camada 1.
 *   3. PolarDB MySQL  — fatos estruturados e identidade (tenant, usuário, chave de API, orçamento). Fonte da verdade transacional.
 *   4. KMS 3.0        — todo segredo vem do env renderizado pelo kms-env (RAM role); esta lib nunca lê chave de arquivo.
 *   5. Ferramenta robusta — medpubr (CPU BR: rerank + verificação de suporte + PII) e, para casos difíceis,
 *      o especialista GPU em Singapura (medgemma:27b / granite-guardian) via gateway com token.
 *   6. Excelência — Baichuan-M3-235B (Qwen3-MoE, vLLM 4×L20 em Virgínia, OpenAI-compatible com token): re-síntese
 *      quando a camada 2 devolve "partial"/inválido ou a pergunta é marcada complexa. Mesmo contrato, mesma regra:
 *      só sobre os trechos recuperados. Configurado por EXCELLENCE_BASE_URL/API_KEY/MODEL; ausente = camada desligada.
 *
 * Contrato de saída = §9 do RAGMED-PORTAIS-DATASETS-FLUXOS.md (claims com evidência, status supported|partial|insufficient).
 * Uso: server-side apenas (Next route handlers / Hono / FastAPI via HTTP). Sem dependências além de fetch.
 */

export type EvidenceHit = {
  document_id: string;
  revision?: string;
  chunk_id: string;
  page?: number;
  title?: string;
  source_url?: string;
  text: string;
  score: number;
};

export type Claim = {
  text: string;
  evidence: Array<Pick<EvidenceHit, "document_id" | "revision" | "chunk_id" | "page">>;
  support: "supported" | "partial" | "unsupported";
  support_score: number;
};

export type EvidenceAnswer = {
  answer_id: string;
  status: "supported" | "partial" | "insufficient";
  language: "pt-BR" | "en";
  claims: Claim[];
  missing_information: string[];
  corpus_release: string;
  model_revision: string;
  layers: { retrieval: string; synthesis: string; verifier: string; escalated_to_gpu: boolean };
  pii_redacted: boolean;
};

export type ChainConfig = {
  esUrl: string; esUser: string; esPassword: string; esIndex: string;
  qwenBaseUrl: string; qwenApiKey: string; qwenModel: string;
  medpubrUrl: string;
  gpuUrl?: string; gpuToken?: string; gpuModel?: string;
  excellenceBaseUrl?: string; excellenceApiKey?: string; excellenceModel?: string;
  corpusRelease?: string;
  minHits?: number;          // abaixo disso → "insufficient", sem chamar LLM
  minSupport?: number;       // claim abaixo → unsupported → escalonar/abster
};

export function configFromEnv(env: NodeJS.ProcessEnv = process.env): ChainConfig {
  const need = (k: string) => { const v = env[k]; if (!v) throw new Error(`env ausente: ${k} (renderizar com kms-env)`); return v; };
  return {
    esUrl: need("RAGMED_ES_URL"), esUser: env.RAGMED_ES_USER ?? "elastic", esPassword: need("RAGMED_ES_PASSWORD"),
    esIndex: env.RAGMED_ES_INDEX ?? "evidence-chunks-v1",
    qwenBaseUrl: need("QWEN_BASE_URL"), qwenApiKey: need("QWEN_API_KEY"), qwenModel: env.QWEN_MODEL ?? "qwen-plus",
    medpubrUrl: need("MEDPUBR_URL"),
    gpuUrl: env.OLLAMA_BASE_URL, gpuToken: env.OLLAMA_API_KEY, gpuModel: env.OLLAMA_CHAT_MODEL ?? "medgemma:27b",
    excellenceBaseUrl: env.EXCELLENCE_BASE_URL, excellenceApiKey: env.EXCELLENCE_API_KEY, excellenceModel: env.EXCELLENCE_MODEL ?? "baichuan-m3",
    corpusRelease: env.RAGMED_CORPUS_RELEASE ?? "dev",
    minHits: Number(env.RAGMED_MIN_HITS ?? 2), minSupport: Number(env.RAGMED_MIN_SUPPORT ?? 0.45),
  };
}

const json = async <T,>(r: Response): Promise<T> => { if (!r.ok) throw new Error(`${r.url} → ${r.status} ${await r.text().catch(() => "")}`); return r.json() as Promise<T>; };
const withTimeout = (ms: number) => AbortSignal.timeout(ms);

/* ---------- camada 5a: medpubr (CPU Brasil) ---------- */
export async function embed(cfg: ChainConfig, texts: string[]): Promise<number[][]> {
  const r = await fetch(`${cfg.medpubrUrl}/v1/embed`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ texts }), signal: withTimeout(30_000) });
  return (await json<{ embeddings: number[][] }>(r)).embeddings;
}
export async function rerank(cfg: ChainConfig, query: string, documents: string[], top_n = 8) {
  const r = await fetch(`${cfg.medpubrUrl}/v1/rerank`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query, documents, top_n }), signal: withTimeout(30_000) });
  return (await json<{ results: { index: number; score: number }[] }>(r)).results;
}
export async function redactPII(cfg: ChainConfig, text: string) {
  const r = await fetch(`${cfg.medpubrUrl}/v1/pii`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }), signal: withTimeout(15_000) });
  return json<{ redacted: string; has_pii: boolean }>(r);
}
export async function checkSupport(cfg: ChainConfig, claim: string, evidence: string[]) {
  const r = await fetch(`${cfg.medpubrUrl}/v1/support`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ claim, evidence }), signal: withTimeout(30_000) });
  return json<{ status: Claim["support"]; best_evidence_index: number; score: number }>(r);
}

/* ---------- camada 1: RagJur/RagMed no Elasticsearch (BM25 + kNN, filtros de acesso antes da recuperação) ---------- */
export async function retrieve(cfg: ChainConfig, query: string, opts: { tenant?: string; k?: number; filters?: Record<string, unknown>[] } = {}): Promise<EvidenceHit[]> {
  const k = opts.k ?? 20;
  const [qv] = await embed(cfg, [query]);
  const filter = [{ term: { access_scope: "public-approved" } }, ...(opts.filters ?? [])];
  const body = {
    size: k, _source: ["document_id", "revision", "chunk_id", "page", "title", "source_url", "text"],
    query: { bool: { filter, should: [{ match: { text: { query, operator: "or" } } }], minimum_should_match: 0 } },
    knn: { field: "embedding", query_vector: qv, k, num_candidates: k * 5, filter: { bool: { filter } } },
    rank: { rrf: {} },
  };
  const r = await fetch(`${cfg.esUrl}/${cfg.esIndex}/_search`, {
    method: "POST", headers: { "content-type": "application/json", authorization: "Basic " + Buffer.from(`${cfg.esUser}:${cfg.esPassword}`).toString("base64") },
    body: JSON.stringify(body), signal: withTimeout(20_000),
  });
  const res = await json<{ hits: { hits: { _score: number; _source: Omit<EvidenceHit, "score"> }[] } }>(r);
  const hits = res.hits.hits.map(h => ({ ...h._source, score: h._score }));
  if (hits.length === 0) return [];
  const rr = await rerank(cfg, query, hits.map(h => h.text), Math.min(8, hits.length));
  return rr.map(x => ({ ...hits[x.index], score: x.score }));
}

/* ---------- camada 2: Model Studio (síntese restrita aos trechos) ---------- */
const SYSTEM_PT = `Você é um assistente de evidência médica. Responda SOMENTE com base nos trechos fornecidos.
Cada afirmação deve citar [n] o(s) trecho(s) que a sustentam. Se os trechos não bastarem, diga exatamente o que falta.
Nunca invente doses, nomes comerciais, datas ou referências. Não dê diagnóstico individual; descreva o que a evidência diz e para qual população.
Formato: JSON {"claims":[{"text":"...","cites":[1,2]}],"missing_information":["..."]}`;

async function chat(cfg: ChainConfig, messages: { role: string; content: string }[], model = cfg.qwenModel, base = cfg.qwenBaseUrl, key = cfg.qwenApiKey) {
  const r = await fetch(`${base}/chat/completions`, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages, temperature: 0.1, response_format: { type: "json_object" } }), signal: withTimeout(60_000),
  });
  const res = await json<{ choices: { message: { content: string } }[]; model?: string }>(r);
  return { content: res.choices[0].message.content, model: res.model ?? model };
}

/* ---------- camada 5b: especialista GPU (Singapura) — só para escalonamento, nunca para chat público ---------- */
async function gpuReview(cfg: ChainConfig, question: string, context: string): Promise<string | null> {
  if (!cfg.gpuUrl || !cfg.gpuToken) return null;
  const r = await fetch(`${cfg.gpuUrl}/api/generate`, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${cfg.gpuToken}` },
    body: JSON.stringify({ model: cfg.gpuModel, stream: false, prompt: `Trechos:\n${context}\n\nPergunta: ${question}\n\nRevise clinicamente e responda apenas com base nos trechos; aponte contradições.` }),
    signal: withTimeout(120_000),
  });
  return (await json<{ response: string }>(r)).response;
}

/* ---------- orquestração ---------- */
export async function answer(cfg: ChainConfig, question: string, opts: { tenant?: string; language?: "pt-BR" | "en"; complex?: boolean } = {}): Promise<EvidenceAnswer> {
  const answer_id = crypto.randomUUID();
  const pii = await redactPII(cfg, question);                      // dados pessoais nunca chegam ao Model Studio/GPU
  const q = pii.redacted;
  const hits = await retrieve(cfg, q, { tenant: opts.tenant });
  const base = { answer_id, language: opts.language ?? "pt-BR", corpus_release: cfg.corpusRelease!, pii_redacted: pii.has_pii } as const;

  if (hits.length < (cfg.minHits ?? 2)) {
    return { ...base, status: "insufficient", claims: [], missing_information: ["Sem evidência suficiente no acervo autorizado para esta pergunta."], model_revision: "none",
      layers: { retrieval: cfg.esIndex, synthesis: "skipped", verifier: "skipped", escalated_to_gpu: false } };
  }
  const context = hits.map((h, i) => `[${i + 1}] (${h.title ?? h.document_id}${h.page ? `, p.${h.page}` : ""}) ${h.text}`).join("\n\n");
  const { content, model } = await chat(cfg, [{ role: "system", content: SYSTEM_PT }, { role: "user", content: `Trechos:\n${context}\n\nPergunta: ${q}` }]);

  let parsed: { claims: { text: string; cites: number[] }[]; missing_information?: string[] };
  let synthesisModel = model;
  try { parsed = JSON.parse(content); } catch { parsed = { claims: [], missing_information: ["Saída do modelo inválida; resposta retida."] }; }

  // camada 6: excelência — re-síntese pelo modelo grande quando a rápida falhou ou o caso foi marcado complexo
  const needsExcellence = opts.complex || parsed.claims.length === 0;
  if (needsExcellence && cfg.excellenceBaseUrl && cfg.excellenceApiKey) {
    try {
      const ex = await chat(cfg, [{ role: "system", content: SYSTEM_PT }, { role: "user", content: `Trechos:\n${context}\n\nPergunta: ${q}` }], cfg.excellenceModel, cfg.excellenceBaseUrl, cfg.excellenceApiKey);
      const p2 = JSON.parse(ex.content);
      if (Array.isArray(p2.claims) && p2.claims.length > 0) { parsed = p2; synthesisModel = `${ex.model} (excellence)`; }
    } catch { /* excelência indisponível → segue com o resultado da camada 2 */ }
  }

  const claims: Claim[] = [];
  for (const c of parsed.claims ?? []) {
    const cited = (c.cites ?? []).map(n => hits[n - 1]).filter(Boolean);
    const sup = cited.length ? await checkSupport(cfg, c.text, cited.map(h => h.text)) : { status: "unsupported" as const, score: 0, best_evidence_index: -1 };
    claims.push({ text: c.text, support: sup.status, support_score: sup.score,
      evidence: cited.map(h => ({ document_id: h.document_id, revision: h.revision, chunk_id: h.chunk_id, page: h.page })) });
  }
  const unsupported = claims.filter(c => c.support === "unsupported");
  let escalated = false;
  if (unsupported.length > 0 && cfg.gpuUrl) {                       // conflito → segunda opinião do especialista local; não substitui evidência
    const review = await gpuReview(cfg, q, context).catch(() => null);
    escalated = review !== null;
    if (review) parsed.missing_information = [...(parsed.missing_information ?? []), `Revisão do especialista: ${review.slice(0, 600)}`];
  }
  const status: EvidenceAnswer["status"] = claims.length === 0 ? "insufficient" : unsupported.length === 0 && claims.every(c => c.support === "supported") ? "supported" : "partial";
  return { ...base, status, claims: claims.filter(c => c.support !== "unsupported"), missing_information: parsed.missing_information ?? [], model_revision: synthesisModel,
    layers: { retrieval: cfg.esIndex, synthesis: synthesisModel, verifier: "medpubr/bge-reranker-v2-m3", escalated_to_gpu: escalated } };
}
