'use client'

import { useState, useRef, useEffect } from 'react'
import { Nav, Footer } from './components'

const MODELS = [
  { id: 'baichuan-m3', label: 'M3-235B', role: 'Decisão' },
  { id: 'medgemma-27b', label: 'MedGemma-27B', role: 'Visão' },
  { id: 'antangelmed', label: 'AntAngelMed', role: 'Clínico' },
  { id: 'medgemma-4b', label: 'MedGemma-4B', role: 'Triagem' },
  { id: 'lingshu-32b', label: 'Lingshu-32B', role: 'Exames' },
  { id: 'baichuan-m2', label: 'Baichuan-M2', role: 'Apoio' },
  { id: 'granite-4.1', label: 'Granite-4.1', role: 'Verificação' },
  { id: 'granite-guardian', label: 'Guardian', role: 'Segurança' },
  { id: 'lingshu-i-8b', label: 'Lingshu-I', role: 'Imagem' },
  { id: 'theia', label: 'Theia', role: 'Compliance' },
]

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'user', content: 'Paciente 74a, DPOC exacerbada, SatO2 86%, pH 7,28, pCO2 68. Conduta?' },
    { role: 'assistant', content: 'Conduta: VNI primeira escolha (pH<7,35 com hipercapnia). Venturi 88-92%.\nFalência VNI: pH<7,25 após 1-2h.\nIntubação: se contraindicação ou falha.', sources: ['PCDT-DPOC 2024', 'GOLD 2024'], model: 'Baichuan-M3-235B', tokens: 847, latency: 760 },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState('baichuan-m3')
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

      <Nav active="/" />

      <div style={{ paddingTop: 80 }}>
        <div style={{ padding: '16px 32px', background: '#0F1A28', borderBottom: '1px solid #1E3248', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {MODELS.map(m => (
            <button key={m.id} className={`chip ${model === m.id ? 'on' : ''}`} onClick={() => setModel(m.id)}>
              {m.label} <span style={{ fontSize: 9, opacity: 0.7 }}>{m.role}</span>
            </button>
          ))}
        </div>

        <div ref={chatRef} style={{ padding: '24px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 'calc(100vh - 260px)' }}>
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
              Consultando {MODELS.find(m => m.id === model)?.label}...
            </div>
          )}
        </div>

        <div style={{ padding: '16px 32px', borderTop: '1px solid #1E3248', background: '#0F1A28', display: 'flex', gap: 12 }}>
          <textarea
            className="inp"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Descreva o caso, pergunta clínica, ou análise de compliance..."
            rows={1}
          />
          <button className="btn" onClick={send} disabled={loading || !input.trim()}>
            Consultar
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
