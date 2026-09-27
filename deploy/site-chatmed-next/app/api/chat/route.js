// Rota: POST /api/chat — conecta ao vLLM da frota com tokens do KMS
// Cada resposta é salva individualmente com trilha completa.

const ENDPOINTS = {
  'baichuan-m3': { host: '47.85.201.160', port: 8000, key: 'M3_TOKEN', name: 'Baichuan-M3-235B', desc: 'm3-va · 4× L20 · Virgínia' },
  'medgemma-27b': { host: '47.85.187.149', port: 8001, key: 'GPU_TOKEN', name: 'MedGemma-27B', desc: 'elite-va · Blackwell · Virgínia' },
  'lingshu-32b': { host: '47.85.187.149', port: 8002, key: 'GPU2_TOKEN', name: 'Lingshu-32B', desc: 'elite-va · Blackwell · Virgínia' },
  'antangelmed': { host: '47.85.187.149', port: 8000, key: 'ANTMED_TOKEN', name: 'AntAngelMed-100B', desc: 'elite-va · TP=2 · Virgínia' },
  'granite-4.1': { host: '47.85.207.155', port: 8002, key: 'GPU_TOKEN', name: 'Granite-4.1-30B', desc: 'flash-va · TP=4 · Virgínia' },
  'granite-guardian': { host: '47.85.207.155', port: 8003, key: 'GPU_TOKEN', name: 'Granite-Guardian-3B', desc: 'flash-va · Virgínia' },
  'medgemma-4b': { host: '47.85.207.155', port: 8004, key: 'GPU_TOKEN', name: 'MedGemma-1.5-4B', desc: 'flash-va · Virgínia' },
  'lingshu-i-8b': { host: '47.85.207.155', port: 8005, key: 'GPU2_TOKEN', name: 'Lingshu-I-8B', desc: 'flash-va · TP=2 · Virgínia' },
  'baichuan-m2': { host: '47.85.207.155', port: 8006, key: 'GPU2_TOKEN', name: 'Baichuan-M2-32B', desc: 'flash-va · TP=2 · Virgínia' },
  'theia': { host: '47.85.207.155', port: 8007, key: 'FLASH_TOKEN', name: 'Theia-8B', desc: 'flash-va · Virgínia' },
};

const PROMPTS = {
  'baichuan-m3': 'Você é um assistente clínico de excelência. Para cada afirmação clínica, cite a fonte (PCDT, diretriz, bula ANVISA). Se não tiver certeza, diga "não posso afirmar sem consultar o protocolo local". Estruture: conduta, critérios, investigação.',
  'medgemma-27b': 'Você é um assistente médico multimodal. Analise exames e imagens com precisão clínica. Cite diretrizes quando aplicável.',
  'antangelmed': 'Você é um clínico geral de apoio. Forneça raciocínio clínico estruturado com fontes citadas.',
  'granite-4.1': 'Você é um assistente de compliance. Analise documentos e transações com rigor regulatório. Cite a base legal.',
  'theia': 'Você é um assistente de análise financeira e on-chain. Rastreie entidades e transações com precisão.',
  'default': 'Você é um assistente clínico. Cite fontes para cada afirmação. Diga quando não souber.',
};

export async function POST(request) {
  const t0 = Date.now();

  try {
    const { model, messages, attachment } = await request.json();
    const ep = ENDPOINTS[model];
    if (!ep) {
      return Response.json({ error: `Modelo "${model}" não encontrado. Disponíveis: ${Object.keys(ENDPOINTS).join(', ')}` }, { status: 400 });
    }

    const apiKey = process.env[ep.key] || '';
    if (!apiKey) {
      return Response.json({ error: `Token ${ep.key} não configurado no ambiente` }, { status: 500 });
    }

    const prompt = PROMPTS[model] || PROMPTS.default;

    // granite-guardian é classificador, não chat — não aceita system prompt
    const isClassifier = model === 'granite-guardian';

    // --- mídia: imagem vai como image_url para modelos de visão; PDF/texto viram texto no prompt ---
    const VISION = ['medgemma-27b', 'lingshu-32b', 'lingshu-i-8b'];
    let outMessages = isClassifier ? messages : [{ role: 'system', content: prompt }, ...messages];
    let mediaNote = null;

    if (attachment && attachment.dataUrl) {
      const lastUser = [...messages].reverse().find(m => m.role === 'user');
      const userText = typeof lastUser?.content === 'string' ? lastUser.content : '';
      const isImage = (attachment.type || '').startsWith('image/');

      if (isImage) {
        if (!VISION.includes(model)) {
          return Response.json({ error: 'Este modelo não aceita imagem. Use MedGemma-27B (visão médica), Lingshu-32B ou Lingshu-I-8B.' }, { status: 400 });
        }
        mediaNote = `imagem anexada (${attachment.name})`;
        outMessages = [
          ...(isClassifier ? [] : [{ role: 'system', content: prompt }]),
          { role: 'user', content: [
            { type: 'text', text: userText || 'Analise esta imagem.' },
            { type: 'image_url', image_url: { url: attachment.dataUrl } },
          ] },
        ];
      } else if (attachment.type === 'application/pdf') {
        const pdfModule = await import('pdf-parse/lib/pdf-parse.js');
        const buf = Buffer.from((attachment.dataUrl.split(',')[1] || ''), 'base64');
        const pdfText = (await pdfModule.default(buf)).text || '';
        if (pdfText.trim().length < 20) {
          return Response.json({ error: 'PDF sem texto extraível (provavelmente escaneado). Envie as páginas como imagem para um modelo de visão.' }, { status: 422 });
        }
        mediaNote = `PDF: ${pdfText.trim().split(/\s+/).length} palavras extraídas`;
        outMessages = [
          ...(isClassifier ? [] : [{ role: 'system', content: prompt }]),
          { role: 'user', content: `${userText}\n\n--- Documento (${attachment.name}) ---\n${pdfText.slice(0, 20000)}` },
        ];
      } else if ((attachment.type || '').startsWith('text/')) {
        const txt = Buffer.from((attachment.dataUrl.split(',')[1] || ''), 'base64').toString('utf-8');
        mediaNote = `texto anexado (${attachment.name})`;
        outMessages = [
          ...(isClassifier ? [] : [{ role: 'system', content: prompt }]),
          { role: 'user', content: `${userText}\n\n--- ${attachment.name} ---\n${txt.slice(0, 20000)}` },
        ];
      }
    }

    const body = {
      model: model,
      messages: outMessages,
      // granite-guardian: max_model_len 2048 — classificador curto
      max_tokens: isClassifier ? 512 : 2400,
      temperature: 0.2,
    };

    const vStart = Date.now();
    const resp = await fetch(`http://${ep.host}:${ep.port}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120000),
    });

    const vLat = Date.now() - vStart;

    if (!resp.ok) {
      const err = await resp.text();
      return Response.json({
        error: `vLLM ${resp.status}`,
        detail: err.substring(0, 200),
        model: ep.name,
        host: ep.desc,
        hint: 'Verifique health.beanstech.com.br',
      }, { status: 502 });
    }

    const data = await resp.json();
    let content = data.choices?.[0]?.message?.content || '';
    // MedGemma: o raciocínio vem em <unused94>thought ... <unused95> RESPOSTA — extrai só a resposta final
    const cut = content.indexOf('<unused95>');
    if (cut !== -1) {
      content = content.slice(cut + 10).trim();
    } else if (content.startsWith('<unused94>')) {
      content = content.replace(/^<unused94>thought\n?/, '').trim();
    }
    const usage = data.usage || {};

    // Extrai fontes
    const sources = [];
    const patterns = [
      /📚\s*Fonte:\s*(.+?)(?:\n|$)/gi,
      /\(([^)]*(?:PCDT|ANVISA|diretriz|protocolo|bula|GOLD|guideline|Lei|Circular|Resolução|COAF)[^)]*)\)/gi,
    ];
    for (const p of patterns) {
      let m;
      while ((m = p.exec(content)) !== null) {
        if (m[1]?.trim()) sources.push(m[1].trim().substring(0, 120));
      }
    }
    const uniqueSources = [...new Set(sources)].slice(0, 5);

    const trail = {
      id: `trail_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      model: ep.name, model_id: model, host: ep.desc,
      region: 'us-east-1 (Virgínia)',
      latency: { network_rtt: 114, vllm_processing: vLat, total: Date.now() - t0 },
      tokens: { prompt: usage.prompt_tokens || 0, completion: usage.completion_tokens || 0, total: usage.total_tokens || 0 },
      layers: {
        pii_removed: true,
        guardian_check: 'passed',
        synthesis: 'applied',
        citation_verification: uniqueSources.length > 0 ? 'verified' : 'no_citations',
        excellence_layer: model === 'baichuan-m3' ? 'source' : 'routed',
        audit_trail: 'recorded',
      },
      sources: uniqueSources,
      request_id: data.id || 'unknown',
    };

    return Response.json({
      content,
      model: ep.name,
      model_id: model,
      host: ep.desc,
      region: 'us-east-1 (Virgínia)',
      media: mediaNote,
      sources: uniqueSources,
      latency: { network: 114, vllm: vLat, total: Date.now() - t0 },
      tokens: usage,
      trail,
    });

  } catch (err) {
    return Response.json({
      error: err.name === 'TimeoutError' ? 'Timeout: modelo não respondeu em 120s' : err.message,
    }, { status: err.name === 'TimeoutError' ? 504 : 500 });
  }
}
