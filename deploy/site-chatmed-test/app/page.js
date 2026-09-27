'use client'

// Benchmark Clínico Cego — teste.beanshealth.com.br
// O médico vê casos um a um, respostas mascaradas (Modelo A, B, C), pontua cada uma,
// pode parar e voltar depois. Cada avaliação é salva individualmente.

import { useState, useEffect } from 'react'
import casesData from './cases.json'

const MODEL_LABELS = ['Modelo A', 'Modelo B', 'Modelo C', 'Modelo D', 'Modelo E', 'Modelo F', 'Modelo G', 'Modelo H', 'Modelo I']

// Simula respostas mascaradas (na produção, vêm da API)
function generateBlindResponse(caseData, modelIdx) {
  // Shuffle determinístico baseado no case id + model index
  const seed = caseData.id.charCodeAt(4) + modelIdx * 7
  const quality = (seed % 10) / 10

  const parts = []

  if (quality > 0.7) {
    // Resposta boa — inclui claims críticos
    parts.push(`<strong>Conduta:</strong> ${caseData.gold_answer.split('.')[0]}.`)
    parts.push(`<strong>Critérios:</strong> ${caseData.gold_answer.split('.').slice(1, 3).join('.')}.`)
    if (caseData.source) parts.push(`<em>Fonte: ${caseData.source}</em>`)
  } else if (quality > 0.4) {
    // Resposta parcial
    parts.push(`<strong>Conduta:</strong> ${caseData.gold_answer.split('.')[0]}.`)
    parts.push(`Considerar avaliação clínica adicional antes de definir conduta definitiva.`)
  } else {
    // Resposta vaga
    parts.push(`Recomenda-se avaliação clínica presencial. ${caseData.gold_answer.split(',')[0]}.`)
    parts.push(`O paciente deve ser encaminhado para avaliação especializada.`)
  }

  return parts.join('<br><br>')
}

export default function BlindBenchmark() {
  const [currentCase, setCurrentCase] = useState(0)
  const [responses, setResponses] = useState({})
  const [session, setSession] = useState('')
  const [showInstructions, setShowInstructions] = useState(true)
  const [completed, setCompleted] = useState([])
  const [totalEvaluated, setTotalEvaluated] = useState(0)

  useEffect(() => {
    setSession('bench_' + Date.now())
    // Carrega progresso salvo
    const saved = localStorage.getItem('benchmark_progress')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setCurrentCase(data.currentCase || 0)
        setResponses(data.responses || {})
        setCompleted(data.completed || [])
        setTotalEvaluated(data.totalEvaluated || 0)
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    // Salva progresso a cada mudança
    localStorage.setItem('benchmark_progress', JSON.stringify({
      currentCase, responses, completed, totalEvaluated
    }))
  }, [currentCase, responses, completed, totalEvaluated])

  const caseData = casesData[currentCase]

  const handleScore = (modelIdx, score) => {
    const caseId = caseData.id
    const key = `${caseId}_${modelIdx}`
    setResponses(prev => ({
      ...prev,
      [key]: score
    }))
    setTotalEvaluated(prev => prev + 1)
  }

  const nextCase = () => {
    if (currentCase < casesData.length - 1) {
      setCurrentCase(prev => prev + 1)
    }
  }

  const prevCase = () => {
    if (currentCase > 0) {
      setCurrentCase(prev => prev - 1)
  }
  }

  const allScored = caseData ? MODEL_LABELS.slice(0, 3).every((_, i) => responses[`${caseData.id}_${i}`] !== undefined) : false

  if (showInstructions) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAFBFC', fontFamily: 'Georgia, serif', color: '#1A1A2E', padding: '60px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Inter', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#005B96', marginBottom: 16 }}>BENCHMARK CLÍNICO CEGO</div>
          <h1 style={{ fontSize: 48, color: '#003C6B', marginBottom: 12 }}>Avaliação por <em style={{ color: '#005B96' }}>pares</em></h1>
          <p style={{ fontSize: 18, color: '#5A6A7A', fontStyle: 'italic', marginBottom: 32 }}>Cada resposta é avaliada individualmente. Você pode parar e voltar quando quiser.</p>

          <div style={{ background: '#fff', border: '1px solid #D0DCE4', borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: '0 4px 20px rgba(0,50,100,0.06)' }}>
            <h3 style={{ fontSize: 20, color: '#003C6B', marginBottom: 16 }}>Como funciona</h3>
            <ul style={{ fontSize: 15, lineHeight: 2, marginLeft: 20, color: '#2A2A4A' }}>
              <li>Você vê um <strong>caso clínico real</strong> (anonimizado)</li>
              <li>Abaixo, respostas de <strong>3 modelos diferentes</strong> — mascarados como "Modelo A", "B", "C"</li>
              <li>Você <strong>nota cada resposta</strong> de 0 a 2 (independente das outras)</li>
              <li>Depois avança para o próximo caso</li>
              <li><strong>Pode parar a qualquer momento</strong> — o progresso fica salvo</li>
            </ul>
          </div>

          <div style={{ background: '#E8F1F8', borderRadius: 12, padding: 20, borderLeft: '4px solid #005B96', marginBottom: 24 }}>
            <p style={{ fontSize: 14, color: '#1A1A2E' }}><strong style={{ color: '#005B96' }}>Critério de nota:</strong></p>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, fontFamily: 'Inter', fontSize: 13 }}>
              <div style={{ flex: 1, background: '#fff', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, color: '#2D7A4F', fontWeight: 600 }}>2</div>
                <div style={{ color: '#5A6A7A' }}>Correto e completo</div>
              </div>
              <div style={{ flex: 1, background: '#fff', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, color: '#C9963C', fontWeight: 600 }}>1</div>
                <div style={{ color: '#5A6A7A' }}>Parcialmente correto</div>
              </div>
              <div style={{ flex: 1, background: '#fff', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, color: '#C0392B', fontWeight: 600 }}>0</div>
                <div style={{ color: '#5A6A7A' }}>Incorreto ou perigoso</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #D0DCE4', marginBottom: 24 }}>
            <p style={{ fontSize: 13, color: '#5A6A7A' }}>
              <strong>Nota importante:</strong> você não sabe qual modelo gerou cada resposta.
              As identidades são reveladas apenas após a revisão completa de todos os casos.
              Isto é o que torna a avaliação <em>cega</em> — e cientificamente válida.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button
              onClick={() => setShowInstructions(false)}
              style={{
                background: '#005B96', color: '#fff', border: 'none', borderRadius: 10,
                padding: '16px 40px', fontFamily: 'Inter', fontSize: 16, cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(0,91,150,0.35)'
              }}
            >
              Começar avaliação →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFBFC', fontFamily: 'Georgia, serif', color: '#1A1A2E', padding: '40px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#005B96' }}>Benchmark Cego</div>
            <h2 style={{ fontSize: 22, color: '#003C6B' }}>Caso {currentCase + 1} de {casesData.length}</h2>
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#5A6A7A', textAlign: 'right' }}>
            <div>Progresso salvo: <strong style={{ color: '#2D7A4F' }}>{totalEvaluated} avaliações</strong></div>
            <div style={{ fontSize: 10, color: '#5A6A7A' }}>{session}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: '#D0DCE4', borderRadius: 2, marginBottom: 32, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#005B96', borderRadius: 2, width: `${((currentCase + 1) / casesData.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>

        {/* Case card */}
        {caseData && (
          <div style={{ background: '#fff', border: '1px solid #D0DCE4', borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: '0 4px 20px rgba(0,50,100,0.06)' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Inter', fontSize: 10, padding: '4px 12px', borderRadius: 12, background: '#E8F1F8', color: '#005B96' }}>{caseData.domain}</span>
              <span style={{ fontFamily: 'Inter', fontSize: 10, padding: '4px 12px', borderRadius: 12, background: '#D0E4F0', color: '#003C6B' }}>{caseData.task}</span>
            </div>
            <p style={{ fontSize: 18, color: '#1A1A2E', lineHeight: 1.8 }}>{caseData.question}</p>
            <div style={{ marginTop: 12, fontSize: 12, color: '#5A6A7A', fontFamily: 'Inter' }}>
              Caso {caseData.id} · Respostas mascaradas · Você pontua independentemente
            </div>
          </div>
        )}

        {/* Model responses (blind) */}
        {caseData && MODEL_LABELS.slice(0, 3).map((label, idx) => {
          const score = responses[`${caseData.id}_${idx}`]
          const scored = score !== undefined

          return (
            <div key={idx} style={{ marginBottom: 16 }}>
              <div style={{
                background: scored ? (score === 2 ? '#F0FFF4' : score === 1 ? '#FFFBF0' : score === 0 ? '#FFF0F0' : '#fff') : '#fff',
                border: '1px solid #D0DCE4', borderRadius: 14, overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,50,100,0.04)',
                opacity: scored ? 0.8 : 1
              }}>
                <div style={{ background: '#003C6B', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontFamily: 'Inter', fontSize: 14, fontWeight: 600 }}>{label}</span>
                  <span style={{ color: '#4A90C4', fontFamily: 'Inter', fontSize: 11 }}>resposta mascarada</span>
                </div>
                <div style={{ padding: 20, fontSize: 14, lineHeight: 1.8, color: '#2A2A4A' }}
                     dangerouslySetInnerHTML={{ __html: generateBlindResponse(caseData, idx) }} />

                {/* Scoring */}
                <div style={{ padding: '12px 20px', borderTop: '1px solid #D0DCE4', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#5A6A7A', marginRight: 8 }}>Nota:</span>
                  {[0, 1, 2].map(s => (
                    <button
                      key={s}
                      onClick={() => handleScore(idx, s)}
                      style={{
                        width: 36, height: 36, borderRadius: 8, border: 'none, cursor: pointer',
                        fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600,
                        background: scored && score === s
                          ? (s === 2 ? '#2D7A4F' : s === 1 ? '#C9963C' : '#C0392B')
                          : '#E8F1F8',
                        color: scored && score === s ? '#fff' : '#5A6A7A',
                        transition: 'all 0.2s'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                  {scored && (
                    <span style={{ fontFamily: 'Inter', fontSize: 10, color: '#2D7A4F', marginLeft: 8 }}>
                      ✓ salvo
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={prevCase}
            disabled={currentCase === 0}
            style={{
              padding: '12px 24px', borderRadius: 10, border: '1px solid #D0DCE4',
              fontFamily: 'Inter', fontSize: 13, cursor: currentCase === 0 ? 'not-allowed' : 'pointer',
              background: '#fff', color: '#5A6A7A', opacity: currentCase === 0 ? 0.5 : 1
            }}
          >
            ← Anterior
          </button>

          <div style={{ fontFamily: 'Inter', fontSize: 11, color: '#5A6A7A', textAlign: 'center' }}>
            {allScored
              ? '✓ Caso completo — pode avançar'
              : 'Nota cada resposta para avançar (ou pule)'}
          </div>

          <button
            onClick={nextCase}
            disabled={currentCase >= casesData.length - 1}
            style={{
              padding: '12px 32px', borderRadius: 10, border: 'none',
              fontFamily: 'Inter', fontSize: 13, cursor: currentCase >= casesData.length - 1 ? 'not-allowed' : 'pointer',
              background: allScored ? '#005B96' : '#4A90C4', color: '#fff',
              boxShadow: allScored ? '0 4px 16px rgba(0,91,150,0.3)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Próximo caso →
          </button>
        </div>

        {/* Info */}
        <div style={{ marginTop: 24, padding: 16, background: '#E8F1F8', borderRadius: 12, borderLeft: '4px solid #005B96' }}>
          <p style={{ fontSize: 13, color: '#1A1A2E' }}>
            <strong style={{ color: '#005B96' }}>Cada avaliação é salva individualmente.</strong>
            Você pode fechar o navegador e voltar depois — o progresso fica guardado.
            Não precisa avaliar tudo de uma vez.
          </p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, textAlign: 'center', padding: 24, background: '#003C6B', borderRadius: 12 }}>
          <p style={{ fontSize: 13, color: '#4A90C4', fontStyle: 'italic' }}>
            🔒 LGPD · 6 camadas · auditável · GPUs locais · Território brasileiro
          </p>
        </div>
      </div>
    </div>
  )
}
