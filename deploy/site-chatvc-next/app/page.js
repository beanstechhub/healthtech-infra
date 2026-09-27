'use client'

import { useState, useRef, useEffect } from 'react'
import { Nav, Footer } from './components'

const MODELS = [
  { id: 'granite-4.1', label: 'Granite-4.1', role: 'Verificação' },
  { id: 'theia', label: 'Theia-8B', role: 'On-chain' },
  { id: 'baichuan-m3', label: 'M3-235B', role: 'Decisão' },
  { id: 'granite-guardian', label: 'Guardian', role: 'Segurança' },
  { id: 'medgemma-27b', label: 'MedGemma-27B', role: 'Visão' },
  { id: 'antangelmed', label: 'AntAngelMed', role: 'Clínico' },
  { id: 'medgemma-4b', label: 'MedGemma-4B', role: 'Triagem' },
  { id: 'lingshu-32b', label: 'Lingshu-32B', role: 'Exames' },
  { id: 'baichuan-m2', label: 'Baichuan-M2', role: 'Apoio' },
  { id: 'lingshu-i-8b', label: 'Lingshu-I', role: 'Imagem' },
]

export default function ChatVC() {
  const [messages, setMessages] = useState([
    { role: 'user', content: 'Cliente PJ movimentou R$ 15M em 30 dias, 47 transferências para 12 beneficiários, 6 recém-criados. Um tem CNPJ no mesmo endereço. Análise?' },
    { role: 'assistant', content: 'Indício de estruturação (smurfing): fracionamento para burla de limite.\nEntidades: 12 beneficiários, 6 CNPJ < 90 dias, 1 endereço compartilhado (laranja).\nRisco: ALTO — recomenda-se SAR ao COAF.', sources: ['Lei 9.613/98 art. 1º', 'Circular BCB 3.978/20'], model: 'GLM-5.3 + Granite-4.1', tokens: 1247, latency: 850 },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState('granite-4.1')
  const chatRef = useRef(null)

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: text }] }),
      })
      const data = await resp.json()
      setLoading(false)
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Erro: ${data.error}`, error: true }])
        return
      }
      setMessages(prev => [...prev, { role: 'assistant', content: data.content, sources: data.sources || [], model: data.model, tokens: data.tokens?.total || 0, latency: data.latency?.vllm || 0 }])
    } catch (e) {
      setLoading(false)
      setMessages(prev => [...prev, { role: 'assistant', content: `Conexão falhou: ${e.message}`, error: true }])
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B1420', fontFamily: 'Georgia, serif', color: '#E8ECF0' }}>
      <Nav active="/" />
      <style>{`
        .chip{font-family:Inter,sans-serif;font-size:11px;padding:5px 14px;border-radius:16px;border:1px solid #1E3248;color:#8A9AA8;cursor:pointer;background:#142236;transition:all .2s}
        .chip:hover{border-color:#C9963C;color:#C9963C}
        .chip.on{background:#C9963C;color:#0B1420;border-color:#C9963C}
        .msg-u{align-self:flex-end;background:#3B82A8;color:#fff;border-radius:14px 4px 14px 14px;padding:14px 20px;font-size:14px;line-height:1.8;max-width:82%}
        .msg-a{align-self:flex-start;background:#142236;color:#E8ECF0;border-radius:4px 14px 14px 14px;padding:14px 20px;font-size:14px;line-height:1.8;max-width:82%;border:1px solid #1E3248}
        .src{font-family:Inter,sans-serif;font-size:11px;color:#4ade80;margin-top:10px;padding-top:10px;border-top:1px solid #1E3248}
        .meta{font-family:JetBrains Mono,monospace;font-size:10px;color:#6B7B8A;margin-top:6px}
        .meta b{color:#C9963C}
        .inp{flex:1;background:#0B1420;border:1px solid #1E3248;border-radius:10px;padding:14px 20px;font-family:Georgia,serif;font-size:14px;color:#E8ECF0;resize:none;outline:none;min-height:52px}
        .inp:focus{border-color:#C9963C}
        .btn{background:#C9963C;color:#0B1420;border:none;border-radius:10px;padding:14px 28px;font-family:Inter,sans-serif;font-size:14px;cursor:pointer}
        .btn:disabled{background:#1E3248;color:#6B7B8A;cursor:not-allowed}
      `}</style>

      <header style={{ background: '#060E16', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E3248' }}>
        <h1 style={{ fontSize: 24, color: '#C9963C' }}>chat<em style={{ color: '#3B82A8', fontStyle: 'italic' }}>vc</em></h1>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#6B7B8A' }}>740 instituições · PLD/FT · Trilha auditável</div>
      </header>

      <div style={{ padding: '12px 32px', background: '#0F1A28', borderBottom: '1px solid #1E3248', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {MODELS.map(m => (
          <button key={m.id} className={`chip ${model === m.id ? 'on' : ''}`} onClick={() => setModel(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      <div ref={chatRef} style={{ padding: '24px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 'calc(100vh - 220px)' }}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'msg-u' : 'msg-a'}>
            {msg.content}
            {msg.role === 'assistant' && !msg.error && msg.sources && msg.sources.length > 0 && (
              <div className="src">
                {msg.sources.map((s, j) => <div key={j}>📚 {s}</div>)}
              </div>
            )}
            {msg.role === 'assistant' && !msg.error && (
              <div className="meta">
                <b>{msg.model}</b> · {msg.tokens} tokens · {msg.latency}ms · 6 camadas ✓
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="msg-a" style={{ color: '#6B7B8A', fontStyle: 'italic', fontSize: 13 }}>
            Analisando via {MODELS.find(m => m.id === model)?.label}...
          </div>
        )}
      </div>

      <div style={{ padding: '16px 32px', borderTop: '1px solid #1E3248', background: '#0F1A28', display: 'flex', gap: 12 }}>
        <textarea
          className="inp"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Descreva a operação suspeita, cole transações, ou envie documentos..."
          rows={1}
        />
        <button className="btn" onClick={send} disabled={loading || !input.trim()}>
          Analisar
        </button>
      </div>

      <footer style={{ padding: '12px 32px', background: '#060E16', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#6B7B8A' }}>
        🔒 LGPD · 6 camadas · auditável · Trilha para regulador · Alibaba Cloud
      </footer>
      <Footer />
    </div>
  )
}
