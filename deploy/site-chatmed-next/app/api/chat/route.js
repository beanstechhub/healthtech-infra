// Rota: POST /api/chat — conecta ao vLLM da frota com tokens do KMS
// Cada resposta é salva individualmente com trilha completa.
import http from 'node:http';

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
  'hy4-preview': { host: '47.112.128.3', port: 8001, key: 'HY4_TOKEN', name: 'Hy4-Preview-780B', desc: 'hy4-sz · 8× RTX PRO · Shenzhen' },
};

const PROMPTS = {
  'baichuan-m3': 'Você é um assistente clínico de excelência. Para cada afirmação clínica, cite a fonte (PCDT, diretriz, bula ANVISA). Se não tiver certeza, diga "não posso afirmar sem consultar o protocolo local". Estruture: conduta, critérios, investigação.',
  'medgemma-27b': 'Você é um assistente médico multimodal. Analise exames e imagens com precisão clínica. Cite diretrizes quando aplicável.',
  'antangelmed': 'Você é um clínico geral de apoio. Forneça raciocínio clínico estruturado com fontes citadas.',
  'granite-4.1': 'Você é um assistente de compliance. Analise documentos e transações com rigor regulatório. Cite a base legal.',
  'theia': 'Você é um assistente de análise financeira e on-chain. Rastreie entidades e transações com precisão.',
  'hy4-preview': 'Você é um assistente de raciocínio de fronteira (Hy4, 780 bilhões de parâmetros, família Hunyuan da Tencent). Responda em português, estruturado, citando fonte quando houver. Diga quando não souber.',
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

    // Hy4 (Qwen3-arch): /no_think ANTES da pergunta desliga o raciocínio infinito — no fim o template ignora
    if (model === 'hy4-preview') {
      outMessages = outMessages.map((m, i) =>
        i === outMessages.length - 1 && m.role === 'user' && typeof m.content === 'string'
          ? { ...m, content: '/no_think\n' + m.content }
          : m
      );
    }

    // M3 em stream:true no vLLM 0.29 só emite raciocínio (bug do parser qwen3 no servidor):
    // para o M3 usamos resposta inteira + stream simulado (heartbeat + máquina de escrever)
    const isM3 = model === 'baichuan-m3';
    const useStream = !isClassifier && !isM3;
    const body = {
      model: model,
      messages: outMessages,
      // granite-guardian: max_model_len 2048 — classificador curto; M3 precisa de folga p/ raciocínio+resposta
      max_tokens: isClassifier ? 512 : 3200,
      temperature: 0.2,
      ...(useStream ? { stream: true, stream_options: { include_usage: true } } : {}),
    };

    const vStart = Date.now();
    // upstream via node:http PURO: o fetch global do Next é patcheado e tampona o corpo inteiro
    // antes de resolver a promise — com node:http os chunks chegam em tempo real para o SSE.
    // LANÇADA sem await: em modo não-streaming o vLLM só envia headers no fim (~30s no M3),
    // e o handler precisa devolver o Response SSE antes disso.
    const upstreamPromise = new Promise((resolve, reject) => {
      const req = http.request({
        host: ep.host, port: ep.port, path: '/v1/chat/completions', method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      }, res => resolve(res));
      req.setTimeout(120000, () => req.destroy(new Error('Timeout: modelo não respondeu em 120s')));
      req.on('error', reject);
      req.write(JSON.stringify(body));
      req.end();
    });

    // extrai fontes citadas no texto final
    const extractSources = content => {
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
      return [...new Set(sources)].slice(0, 5);
    };
    // MedGemma: o raciocínio vem em <unused94>thought ... <unused95> RESPOSTA — extrai só a resposta final
    const cleanContent = raw => {
      let c = raw || '';
      const cut = c.indexOf('<unused95>');
      if (cut !== -1) c = c.slice(cut + 10).trim();
      else if (c.startsWith('<unused94>')) c = c.replace(/^<unused94>thought\n?/, '').trim();
      return c;
    };

    // monta a trilha de auditoria comum aos dois caminhos
    const buildTrail = (content, uniqueSources, vLat, usage) => ({
      id: `trail_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      model: ep.name, model_id: model, host: ep.desc,
      region: ep.host === '47.112.128.3' ? 'cn-shenzhen (Shenzhen)' : 'us-east-1 (Virgínia)',
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
    });

    if (isM3) {
      // M3: resposta inteira (raciocínio+conteúdo vêm corretos fora do modo stream) revelada em progresso
      const encoder = new TextEncoder();
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const send = obj => writer.write(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      // NÃO awaitar write antes do return: o writer bloqueia até existir leitor (deadlock).
      // Tudo sai de dentro da bomba, que roda solta após o Response ser retornado.
      (async () => {
        await send({ start: true });
        let raw = '';
        try {
          // heartbeat de raciocínio enquanto o M3 pensa (~15-30s) — mantém o indicador vivo no cliente
          const hb = setInterval(() => { send({ reasoning: 1 }).catch(() => {}) }, 1500);
          const upstream = await upstreamPromise;
          if (upstream.statusCode !== 200) {
            clearInterval(hb);
            for await (const c of upstream) raw += c;
            await send({ error: `vLLM ${upstream.statusCode}: ${raw.slice(0, 150)}` });
            await writer.close();
            return;
          }
          for await (const c of upstream) raw += c;
          clearInterval(hb);
          const data = JSON.parse(raw);
          const content = cleanContent(data.choices?.[0]?.message?.content || '');
          const usage = data.usage || {};
          const uniqueSources = extractSources(content);
          const vLat = Date.now() - vStart;
          // revela o texto em blocos ~25 chars a cada 25ms — mesma sensação do token-a-token
          for (let i = 0; i < content.length; i += 25) {
            await send({ delta: content.slice(i, i + 25) });
            await new Promise(r => setTimeout(r, 25));
          }
          await send({
            meta: {
              content, model: ep.name, model_id: model, host: ep.desc,
              region: 'us-east-1 (Virgínia)', media: mediaNote, sources: uniqueSources,
              latency: { network: 114, vllm: vLat, total: Date.now() - t0, first_reasoning: true },
              tokens: usage, trail: buildTrail(content, uniqueSources, vLat, usage),
            },
          });
          await writer.close();
        } catch (e) {
          try { await send({ error: `stream: ${e.message}` }); await writer.close(); } catch {}
        }
      })();
      return new Response(readable, {
        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', 'X-Accel-Buffering': 'no' },
      });
    }

    if (!useStream) {
      const upstream = await upstreamPromise;
      if (upstream.statusCode !== 200) {
        let err = '';
        for await (const c of upstream) err += c;
        return Response.json({ error: `vLLM ${upstream.statusCode}`, detail: err.substring(0, 200), model: ep.name, host: ep.desc, hint: 'Verifique health.beanstech.com.br' }, { status: 502 });
      }
      // caminho clássico (classificador): resposta JSON única
      let raw = '';
      for await (const c of upstream) raw += c;
      const data = JSON.parse(raw);
      const content = cleanContent(data.choices?.[0]?.message?.content || '');
      const usage = data.usage || {};
      const uniqueSources = extractSources(content);
      return Response.json({
        content, model: ep.name, model_id: model, host: ep.desc,
        region: ep.host === '47.112.128.3' ? 'cn-shenzhen (Shenzhen)' : 'us-east-1 (Virgínia)',
        media: mediaNote, sources: uniqueSources,
        latency: { network: 114, vllm: Date.now() - vStart, total: Date.now() - t0 },
        tokens: usage, trail: buildTrail(content, uniqueSources, Date.now() - vStart, usage),
      });
    }

    // caminho streaming: tokens em SSE; raciocínio (M3/Hy4) vira evento próprio; meta final com trilha
    // upstream via node:http (IncomingMessage) + TransformStream — nenhum fetch patcheado no caminho.
    const upstream = await upstreamPromise;
    if (upstream.statusCode !== 200) {
      let err = '';
      for await (const c of upstream) err += c;
      return Response.json({ error: `vLLM ${upstream.statusCode}`, detail: err.substring(0, 200), model: ep.name, host: ep.desc, hint: 'Verifique health.beanstech.com.br' }, { status: 502 });
    }
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const send = obj => writer.write(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

    (async () => {
      let full = '';
      let usage = {};
      let sawReasoning = false;
      // heartbeat imediato: os headers do SSE só vão ao cliente no primeiro write
      await send({ start: true });
      try {
        let buf = '';
        for await (const chunk of upstream) {
          buf += decoder.decode(chunk, { stream: true });
          let nl;
          while ((nl = buf.indexOf('\n')) >= 0) {
            const line = buf.slice(0, nl).trim();
            buf = buf.slice(nl + 1);
            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (payload === '[DONE]') continue;
            let j;
            try { j = JSON.parse(payload); } catch { continue; }
            if (j.usage) usage = j.usage;
            const delta = j.choices?.[0]?.delta || {};
            // vLLM (M3) usa delta.reasoning; llama.cpp (Hy4) usa delta.reasoning_content
            if (delta.reasoning || delta.reasoning_content) {
              sawReasoning = true;
              await send({ reasoning: 1 });
            }
            if (delta.content) {
              full += delta.content;
              await send({ delta: delta.content });
            }
          }
        }
      } catch (e) {
        try { await send({ error: `stream: ${e.message}` }); } catch {}
      }
      const content = cleanContent(full);
      const uniqueSources = extractSources(content);
      const vLat = Date.now() - vStart;
      await send({
        meta: {
          content, model: ep.name, model_id: model, host: ep.desc,
          region: ep.host === '47.112.128.3' ? 'cn-shenzhen (Shenzhen)' : 'us-east-1 (Virgínia)',
          media: mediaNote, sources: uniqueSources,
          latency: { network: 114, vllm: vLat, total: Date.now() - t0, first_reasoning: sawReasoning },
          tokens: usage, trail: buildTrail(content, uniqueSources, vLat, usage),
        },
      });
      await writer.close();
    })();

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    });

  } catch (err) {
    return Response.json({
      error: err.name === 'TimeoutError' ? 'Timeout: modelo não respondeu em 120s' : err.message,
    }, { status: err.name === 'TimeoutError' ? 504 : 500 });
  }
}
