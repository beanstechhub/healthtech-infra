// Rota: GET /api/responses — lista respostas salvas (uma a uma)
// O médico pode voltar depois e ver tudo que já testou.

export async function GET(request) {
  const dbUrl = process.env.CHATMED_TEST_DB_URL;
  if (!dbUrl) {
    return Response.json({ error: 'DB não configurado', responses: [] });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const { Client } = await import('pg');
    const client = new Client({ connectionString: dbUrl });
    await client.connect();
    
    let query = 'SELECT * FROM chatmed_test_responses';
    let params = [];
    
    if (sessionId) {
      query += ' WHERE session_id = $1 ORDER BY created_at DESC LIMIT $2';
      params = [sessionId, limit];
    } else {
      query += ' ORDER BY created_at DESC LIMIT $1';
      params = [limit];
    }
    
    const result = await client.query(query, params);
    await client.end();
    
    return Response.json({
      count: result.rows.length,
      responses: result.rows.map(r => ({
        id: r.id,
        session: r.session_id,
        model: r.model_name,
        model_id: r.model,
        question: r.question?.substring(0, 200),
        answer: r.answer,
        sources: typeof r.sources === 'string' ? JSON.parse(r.sources) : r.sources,
        tokens: { prompt: r.tokens_prompt, completion: r.tokens_completion },
        latency: { vllm: r.latency_vllm, total: r.latency_total },
        trail: typeof r.trail === 'string' ? JSON.parse(r.trail) : r.trail,
        timestamp: r.created_at,
      }))
    });
    
  } catch (err) {
    return Response.json({ error: err.message, responses: [] }, { status: 500 });
  }
}
