'use client'

import { useState, useRef, useEffect } from 'react'
import { Nav, Footer } from '../components'

const MODELS = [
  { id: 'baichuan-m3', name: 'Baichuan-M3-235B', short: 'M3 · Raciocínio', tag: 'A REVOLUÇÃO', role: 'Raciocínio clínico', desc: 'Supera GPT-5.2 em HealthBench. Fact-Aware RL.', zh: '百川M3', zh_pt: 'Baichuan M3', specs: { arch: 'MoE 235B/A22B', quant: 'GPTQ INT4', vram: '124,5 GB', lat: '0.76s' }, paper: 'https://arxiv.org/abs/2412.15261', host: 'm3-va', color: '#005B96' },
  { id: 'medgemma-27b', name: 'MedGemma-27B', short: 'MG-27 · Visão', tag: 'EXTREMAMENTE BOM', role: 'Visão médica', desc: 'Radiografia, dermatologia, oftalmologia. Encoder SigLIP.', zh: 'Google', zh_pt: 'Google Research', specs: { arch: 'Multimodal 27B', quant: 'FP8', vram: '49,4 GB', lat: '0.97s' }, paper: 'https://arxiv.org/abs/2507.05201', host: 'elite-va', color: '#C9963C' },
  { id: 'antangelmed', name: 'AntAngelMed-100B', short: 'Ant · Clínico', tag: 'O PRIMEIRO APROVADO', role: 'Clínico geral', desc: 'Primeiro modelo médico aprovado para uso clínico. 48 seqs.', zh: '蚂蚁集团', zh_pt: 'Grupo Ant', specs: { arch: 'MoE ~100B', quant: 'FP8', vram: '65,5×2 GB', lat: '0.7s' }, paper: '', host: 'elite-va', color: '#003C6B' },
  { id: 'medgemma-4b', name: 'MedGemma-1.5-4B', short: 'MG-4 · Triagem', tag: 'TRIAGEM', role: 'Onde internet não chega', desc: '4B que supera 10× maiores em triagem. Para o campo.', zh: 'Google', zh_pt: 'Google', specs: { arch: '4B denso', quant: 'FP8', vram: '7,1 GB', lat: '<0.5s' }, paper: '', host: 'flash-va', color: '#2D7A4F' },
  { id: 'lingshu-32b', name: 'Lingshu-32B', short: 'LS-32 · Exames', tag: 'VISÃO + TEXTO', role: 'Exames', desc: 'Modelo multimodal médico FP8.', zh: '灵枢', zh_pt: 'Lingshu Medical', specs: { arch: '32B VL', quant: 'FP8', vram: '54,6 GB', lat: '~1s' }, paper: '', host: 'elite-va', color: '#4A90C4' },
  { id: 'lingshu-i-8b', name: 'Lingshu-I-8B', short: 'LS-8 · Imagem', tag: 'VISÃO LEVE', role: 'Imagem', desc: 'Visão médica compacta.', zh: '灵枢', zh_pt: 'Lingshu', specs: { arch: '8B VL', quant: 'FP8', vram: '17,3 GB', lat: '<0.5s' }, paper: '', host: 'flash-va', color: '#4A90C4' },
  { id: 'baichuan-m2', name: 'Baichuan-M2-32B', short: 'M2 · Apoio', tag: 'ESPECIALISTA', role: 'Apoio clínico', desc: 'Modelo médico denso 32B.', zh: '百川', zh_pt: 'Baichuan AI', specs: { arch: '32B', quant: 'GPTQ INT4', vram: '27,4 GB', lat: '~1s' }, paper: '', host: 'flash-va', color: '#005B96' },
  { id: 'granite-4.1', name: 'Granite-4.1-30B', short: 'Gr41 · Síntese', tag: 'SÍNTESE', role: 'Verificação', desc: 'IBM Granite 4.1 FP8. Camada 3 das 6.', zh: 'IBM', zh_pt: 'IBM', specs: { arch: '30B MoE', quant: 'FP8', vram: '44,4 GB', lat: '~0.5s' }, paper: '', host: 'flash-va', color: '#666' },
  { id: 'granite-guardian', name: 'Granite-Guardian-3B', short: 'Guardião', tag: 'GUARDIÃO', role: 'Segurança', desc: 'IBM Granite Guardian. Camada 2.', zh: 'IBM', zh_pt: 'IBM', specs: { arch: '3B', quant: 'BF16', vram: '8,9 GB', lat: '<0.3s' }, paper: '', host: 'flash-va', color: '#666' },
  { id: 'theia', name: 'Theia-8B', short: 'Theia · Compliance', tag: 'COMPLIANCE', role: 'Análise financeira', desc: 'Chainbase Theia 8B. On-chain e compliance.', zh: 'Chainbase', zh_pt: 'Chainbase', specs: { arch: '8B', quant: 'FP8', vram: '8,5 GB', lat: '<0.5s' }, paper: '', host: 'flash-va', color: '#C9963C' },
]

const EXAMPLES = [
  'Paciente 74a, DPOC exacerbada, SatO2 86%, pH 7,28, pCO2 68. Conduta?',
  'Idoso, FA paroxística, clearance 28 mL/min, sangramento em rivaroxabana 20 mg. O que revisar?',
  'RN de 3 dias, icterícia em ascensão, TSH maternal normal. Conduta e critérios de fototerapia?',
]

const VISION_MODELS = ['medgemma-27b', 'lingshu-32b', 'lingshu-i-8b']
const ACCEPT = 'image/*,application/pdf,text/plain'

const MSGS_PER_PAGE = 8
const SESSIONS_PER_PAGE = 6
const LS_KEY = 'chatmed-sessions-v1'

// renderizador markdown mínimo: **negrito**, *itálico*, títulos e listas das respostas
function mdInline(s) {
  const parts = s.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g)
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={i} style={{ color: '#003C6B' }}>{p.slice(2, -2)}</strong>
    if (/^\*[^*]+\*$/.test(p)) return <em key={i}>{p.slice(1, -1)}</em>
    return <span key={i}>{p}</span>
  })
}
function MD({ text }) {
  if (!text) return null
  const blocks = String(text).split(/\n\n+/)
  return blocks.map((b, i) => {
    if (/^#{1,4}\s/.test(b)) {
      return <div key={i} style={{ fontWeight: 700, fontSize: 15, color: '#003C6B', margin: '8px 0 3px' }}>{mdInline(b.replace(/^#+\s*/, ''))}</div>
    }
    if (/^[-*]\s/m.test(b)) {
      const items = b.split('\n').filter(l => /^[-*]\s/.test(l))
      return <ul key={i} style={{ margin: '2px 0 6px 18px', padding: 0 }}>{items.map((it, j) => <li key={j} style={{ margin: '2px 0' }}>{mdInline(it.replace(/^[-*]\s*/, ''))}</li>)}</ul>
    }
    if (/^\d+[.)]\s/m.test(b)) {
      const items = b.split('\n').filter(l => /^\d+[.)]\s/.test(l))
      return <ol key={i} style={{ margin: '2px 0 6px 20px', padding: 0 }}>{items.map((it, j) => <li key={j} style={{ margin: '2px 0' }}>{mdInline(it.replace(/^\d+[.)]\s*/, ''))}</li>)}</ol>
    }
    return <p key={i} style={{ margin: '2px 0' }}>{mdInline(b)}</p>
  })
}

const newSession = () => ({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title: 'Nova consulta', ts: new Date().toISOString(), messages: [] })

export default function ChatMed() {
  const [sessions, setSessions] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [model, setModel] = useState('baichuan-m3')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessPage, setSessPage] = useState(0)
  const [msgPage, setMsgPage] = useState(0)
  const [attach, setAttach] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const chatRef = useRef(null)
  const fileRef = useRef(null)

  // carrega histórico local
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      if (Array.isArray(raw) && raw.length > 0) {
        setSessions(raw)
        setActiveId(raw[0].id)
      } else {
        const s = newSession()
        setSessions([s])
        setActiveId(s.id)
      }
    } catch {
      const s = newSession()
      setSessions([s])
      setActiveId(s.id)
    }
  }, [])

  const persist = list => { try { localStorage.setItem(LS_KEY, JSON.stringify(list)) } catch {} }

  const active = sessions.find(s => s.id === activeId)
  const messages = active ? active.messages : []
  const msgPages = Math.max(1, Math.ceil(messages.length / MSGS_PER_PAGE))
  const sessPages = Math.max(1, Math.ceil(sessions.length / SESSIONS_PER_PAGE))

  useEffect(() => { setMsgPage(Math.max(0, msgPages - 1)) }, [activeId, messages.length])
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [msgPage, activeId])

  const updateActive = fn => setSessions(prev => {
    const list = prev.map(s => s.id === activeId ? fn(s) : s)
    persist(list)
    return list
  })

  const createSession = () => {
    const s = newSession()
    setSessions(prev => { const list = [s, ...prev]; persist(list); return list })
    setActiveId(s.id)
    setInput('')
  }

  const deleteSession = id => {
    setSessions(prev => {
      const list = prev.filter(s => s.id !== id)
      persist(list)
      if (id === activeId) setActiveId(list[0]?.id ?? null)
      return list
    })
  }

  const pickFile = e => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    if (f.size > 8 * 1024 * 1024) { alert('Arquivo maior que 8 MB — reduza antes de enviar.'); return }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setAttach({ name: f.name, type: f.type || 'application/octet-stream', dataUrl })
      // imagem só é aceita por modelos de visão — troca automática com aviso
      if ((f.type || '').startsWith('image/') && !VISION_MODELS.includes(model)) {
        setModel('medgemma-27b')
        alert('Imagem anexada: troquei para o MedGemma-27B (visão médica), que aceita imagens.')
      }
    }
    reader.readAsDataURL(f)
  }

  const send = async text => {
    const content = (text ?? input).trim()
    if ((!content && !attach) || loading || !active) return
    const att = attach
    setInput('')
    setAttach(null)
    updateActive(s => ({ ...s, title: s.messages.length === 0 ? (content || att?.name || 'Consulta').slice(0, 48) : s.title, messages: [...s.messages, { role: 'user', content: content || `📎 ${att.name}`, attach: att }] }))
    setLoading(true)
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages: [{ role: 'user', content }], attachment: att || undefined }),
      })
      const data = await resp.json()
      setLoading(false)
      if (data.error) {
        updateActive(s => ({ ...s, messages: [...s.messages, { role: 'assistant', content: `Erro: ${data.error}`, error: true }] }))
        return
      }
      updateActive(s => ({ ...s, messages: [...s.messages, {
        role: 'assistant', content: data.content,
        sources: data.sources || [], model: data.model,
        tokens: data.tokens?.total || 0, latency: data.latency?.vllm || 0, trail: data.trail, media: data.media,
      }] }))
    } catch (e) {
      setLoading(false)
      updateActive(s => ({ ...s, messages: [...s.messages, { role: 'assistant', content: `Conexão falhou: ${e.message}`, error: true }] }))
    }
  }

  const pageMessages = messages.slice(msgPage * MSGS_PER_PAGE, (msgPage + 1) * MSGS_PER_PAGE)
  const pageSessions = sessions.slice(sessPage * SESSIONS_PER_PAGE, (sessPage + 1) * SESSIONS_PER_PAGE)
  const cur = MODELS.find(m => m.id === model)

  return (
    <div style={{ minHeight: '100vh', background: '#FAFBFC', fontFamily: 'Georgia, serif', color: '#1A1A2E' }}>
      <Nav active="/chat" />
      <style>{`
        .chip{font-family:Inter,sans-serif;font-size:11px;padding:5px 14px;border-radius:16px;border:1px solid #D0DCE4;color:#5A6A7A;cursor:pointer;background:#fff;transition:all .2s;white-space:nowrap}
        .chip:hover{border-color:#005B96;color:#005B96}
        .chip.on{background:#005B96;color:#fff;border-color:#005B96}
        .msg-u{align-self:flex-end;background:#005B96;color:#fff;border-radius:14px 4px 14px 14px;padding:14px 20px;font-size:14px;line-height:1.8;max-width:82%;white-space:pre-wrap}
        .msg-a{align-self:flex-start;background:#E8F1F8;color:#1A1A2E;border-radius:4px 14px 14px 14px;padding:14px 20px;font-size:14px;line-height:1.8;max-width:82%;border:1px solid #D0DCE4;white-space:pre-wrap}
        .src{font-family:Inter,sans-serif;font-size:11px;color:#2D7A4F;margin-top:10px;padding-top:10px;border-top:1px solid #D0DCE4}
        .meta{font-family:JetBrains Mono,monospace;font-size:10px;color:#5A6A7A;margin-top:6px}
        .meta b{color:#005B96}
        .guard-badge{font-family:Inter,sans-serif;font-size:10px;color:#2D7A4F;background:rgba(45,122,79,.08);border:1px solid rgba(45,122,79,.25);border-radius:4px;padding:3px 8px;display:inline-block;margin-top:8px}
        .md p{margin:2px 0;line-height:1.8}
        .disc{font-family:Inter,sans-serif;font-size:10px;color:#B0392E;line-height:1.5;padding:8px 0 0}
        .inp{flex:1;background:#E8F1F8;border:1px solid #D0DCE4;border-radius:10px;padding:14px 20px;font-family:Georgia,serif;font-size:14px;color:#1A1A2E;resize:none;outline:none;min-height:52px}
        .inp:focus{border-color:#005B96}
        .btn{background:#005B96;color:#fff;border:none;border-radius:10px;padding:14px 28px;font-family:Inter,sans-serif;font-size:14px;cursor:pointer}
        .btn:disabled{background:#D0DCE4;color:#5A6A7A;cursor:not-allowed}
        .sess{font-family:Inter,sans-serif;padding:10px 12px;border-radius:8px;cursor:pointer;border:1px solid transparent;display:flex;justify-content:space-between;align-items:center;gap:8px}
        .sess:hover{background:#E8F1F8}
        .sess.on{background:#E8F1F8;border-color:#005B96}
        .sess-t{font-size:12px;color:#1A1A2E;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
        .sess-d{font-size:15px;color:#B0BCC6;cursor:pointer;border:none;background:none;padding:0 4px}
        .sess-d:hover{color:#C0392B}
        .pg{font-family:Inter,sans-serif;font-size:11px;color:#5A6A7A;display:flex;align-items:center;gap:10px;justify-content:center;padding:8px 0}
        .pg button{border:1px solid #D0DCE4;background:#fff;border-radius:6px;cursor:pointer;padding:3px 10px;font-size:11px;color:#005B96}
        .pg button:disabled{color:#B0BCC6;cursor:not-allowed}
        .ex{font-family:Inter,sans-serif;font-size:13px;color:#003C6B;background:#E8F1F8;border:1px dashed #4A90C4;border-radius:10px;padding:12px 16px;cursor:pointer;text-align:left;line-height:1.5;transition:all .2s}
        .ex:hover{border-style:solid;background:#DCEAF5}
        .side{background:#fff;border-right:1px solid #D0DCE4;display:flex;flex-direction:column;height:100%}
        .scroll::-webkit-scrollbar{width:6px}
        .scroll::-webkit-scrollbar-thumb{background:#C7D5E0;border-radius:3px}
      `}</style>

      <div style={{ padding: '58px 28px 10px', background: '#fff', borderBottom: '1px solid #D0DCE4', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {MODELS.map(m => (
          <button key={m.id} className={`chip ${model === m.id ? 'on' : ''}`} onClick={() => setModel(m.id)} title={`${m.name} — ${m.role} · ${m.specs.arch} · ${m.specs.quant} · ${m.specs.vram} · ${m.specs.lat} · ${m.host}`}>
            {VISION_MODELS.includes(m.id) ? '👁 ' : ''}{m.short}
          </button>
        ))}
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#5A6A7A', marginLeft: 'auto' }}>
          {cur ? `${cur.name} · ${cur.specs.vram} · ${cur.host}` : ''}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 262px)' }}>
        {/* sessões — paginado */}
        <aside className="side" style={{ width: 280, flexShrink: 0 }}>
          <div style={{ padding: 12, borderBottom: '1px solid #D0DCE4' }}>
            <button className="btn" style={{ width: '100%', padding: '10px 0', fontSize: 13 }} onClick={createSession}>+ Nova consulta</button>
          </div>
          <div className="scroll" style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
            {pageSessions.map(s => (
              <div key={s.id} className={`sess ${s.id === activeId ? 'on' : ''}`} onClick={() => setActiveId(s.id)}>
                <span className="sess-t">
                  {s.messages.length === 0
                    ? new Date(s.ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
                    : s.title}
                </span>
                <button className="sess-d" onClick={e => { e.stopPropagation(); deleteSession(s.id) }} title="Excluir">×</button>
              </div>
            ))}
          </div>
          {sessPages > 1 && (
            <div className="pg" style={{ borderTop: '1px solid #D0DCE4' }}>
              <button onClick={() => setSessPage(p => Math.max(0, p - 1))} disabled={sessPage === 0}>←</button>
              <span>página {sessPage + 1} de {sessPages}</span>
              <button onClick={() => setSessPage(p => Math.min(sessPages - 1, p + 1))} disabled={sessPage >= sessPages - 1}>→</button>
            </div>
          )}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #D0DCE4', fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#5A6A7A' }}>
            {sessions.length} consulta{sessions.length !== 1 ? 's' : ''} · histórico local
          </div>
        </aside>

        {/* conversa — mensagens paginadas */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FAFBFC' }}>
          {msgPages > 1 && (
            <div className="pg" style={{ borderBottom: '1px solid #E4EBF0', background: '#fff' }}>
              <button onClick={() => setMsgPage(p => Math.max(0, p - 1))} disabled={msgPage === 0}>← anteriores</button>
              <span>página {msgPage + 1} de {msgPages} · {messages.length} mensagens</span>
              <button onClick={() => setMsgPage(p => Math.min(msgPages - 1, p + 1))} disabled={msgPage >= msgPages - 1}>recentes →</button>
            </div>
          )}

          <div ref={chatRef} className="scroll" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 560, margin: '40px auto' }}>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#5A6A7A', textAlign: 'center', marginBottom: 6 }}>
                  Descreva o caso clínico — ou comece por um exemplo:
                </div>
                {EXAMPLES.map((ex, i) => (
                  <button key={i} className="ex" onClick={() => send(ex)}>{ex}</button>
                ))}
              </div>
            )}
            {pageMessages.map((msg, i) => (
              <div key={msgPage * MSGS_PER_PAGE + i} className={msg.role === 'user' ? 'msg-u' : 'msg-a'}>
                {msg.attach && msg.attach.type?.startsWith('image/') && (
                  <img src={msg.attach.dataUrl} alt={msg.attach.name} style={{ display: 'block', maxWidth: 260, borderRadius: 10, margin: '0 auto 10px', border: '1px solid rgba(255,255,255,.35)' }} />
                )}
                {msg.attach && !msg.attach.type?.startsWith('image/') && (
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, opacity: .85, marginBottom: 6 }}>📎 {msg.attach.name}</div>
                )}
                {msg.role === 'user'
                  ? msg.content
                  : <div className="md"><MD text={msg.content} /></div>}
                {msg.role === 'assistant' && !msg.error && msg.trail?.layers?.guardian_check === 'passed' && (
                  <div className="guard-badge">🛡 Granite Guardian: aprovado</div>
                )}
                {msg.role === 'assistant' && !msg.error && msg.sources && msg.sources.length > 0 && (
                  <div className="src">
                    {msg.sources.map((s, j) => <div key={j}>📚 {s}</div>)}
                  </div>
                )}
                {msg.role === 'assistant' && !msg.error && (
                  <div className="meta">
                    <b>{msg.model}</b> · {msg.tokens} tokens · {msg.latency}ms{msg.media ? ` · ${msg.media}` : ''}{msg.trail ? ` · trilha: ${msg.trail.length} etapas ✓` : ' · 6 camadas ✓'}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="msg-a" style={{ color: '#5A6A7A', fontStyle: 'italic', fontSize: 13 }}>
                Consultando {cur ? cur.name : model}...
              </div>
            )}
          </div>

          <div style={{ padding: '14px 28px', borderTop: '1px solid #D0DCE4', background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {attach && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#003C6B', background: '#E8F1F8', border: '1px solid #D0DCE4', borderRadius: 8, padding: '8px 12px', alignSelf: 'flex-start' }}>
                {attach.type?.startsWith('image/') && <img src={attach.dataUrl} alt="" style={{ width: 34, height: 34, objectFit: 'cover', borderRadius: 6 }} />}
                <span>📎 {attach.name}</span>
                <button onClick={() => setAttach(null)} style={{ border: 'none', background: 'none', color: '#B0BCC6', cursor: 'pointer', fontSize: 15 }} title="Remover anexo">×</button>
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <input ref={fileRef} type="file" accept={ACCEPT} onChange={pickFile} style={{ display: 'none' }} />
              <button onClick={() => fileRef.current?.click()} disabled={loading} title="Anexar imagem (RX, foto, manuscrito), PDF ou texto" style={{ background: '#E8F1F8', border: '1px solid #D0DCE4', borderRadius: 10, width: 52, height: 52, fontSize: 20, cursor: 'pointer', color: '#005B96', flexShrink: 0 }}>📎</button>
              <textarea
                className="inp"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder="Descreva o caso ou anexe imagem/PDF... (Enter envia · Shift+Enter nova linha)"
                rows={1}
              />
              <button className="btn" onClick={() => send()} disabled={loading || (!input.trim() && !attach)}>
                Consultar
              </button>
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#B0BCC6' }}>
              Imagens (RX, dermatologia, texto manuscrito) vão para os modelos de visão · PDF tem o texto extraído e anexado ao caso
            </div>
            <div className="disc">
              ⚠ IA como ferramenta de apoio à decisão clínica — não substitui avaliação médica. Confirme condutas em protocolo, diretriz ou bula vigentes.
            </div>
          </div>
        </main>
      </div>

      <footer style={{ padding: '12px 28px', background: '#003C6B', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#4A90C4' }}>
        🔒 LGPD · 6 camadas · auditável · GPUs locais · Território brasileiro
      </footer>
      <Footer />
    </div>
  )
}
