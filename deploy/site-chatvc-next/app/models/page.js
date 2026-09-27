'use client'

import { Nav, Footer } from '../components'

const MODELS = [
  { name: 'Granite-4.1-30B', tag: 'SÍNTESE', role: 'Camada de verificação', desc: 'IBM Granite 4.1 30B FP8. Síntese e verificação na cadeia anti-alucinação.', specs: { arch: '30B MoE', quant: 'FP8', vram: '44,4 GB', lat: '~0.5s' }, host: 'flash-va' },
  { name: 'Theia-8B', tag: 'ON-CHAIN', role: 'Análise de blockchain', desc: 'Chainbase Theia 8B. Análise de transações e rastreamento de ativos.', specs: { arch: '8B', quant: 'FP8', vram: '8,5 GB', lat: '<0.5s' }, host: 'flash-va' },
  { name: 'Baichuan-M3-235B', tag: 'DECISÃO', role: 'Raciocínio', desc: 'O modelo de excelência para análise de risco e decisão.', specs: { arch: 'MoE 235B/A22B', quant: 'GPTQ INT4', vram: '124,5 GB', lat: '0.76s' }, host: 'm3-va' },
  { name: 'Granite-Guardian-3B', tag: 'GUARDIÃO', role: 'Segurança', desc: 'Barreiras de segurança na camada 2 da cadeia.', specs: { arch: '3B', quant: 'BF16', vram: '8,9 GB', lat: '<0.3s' }, host: 'flash-va' },
  { name: 'MedGemma-27B', tag: 'VISÃO', role: 'Documentos', desc: 'Análise de documentos com imagens (extratos, documentos fiscais).', specs: { arch: 'Multimodal 27B', quant: 'FP8', vram: '49,4 GB', lat: '0.97s' }, host: 'elite-va' },
  { name: 'AntAngelMed-100B', tag: 'CLÍNICO', role: 'Apoio', desc: 'Clínico geral para compliance de saúde.', specs: { arch: 'MoE ~100B', quant: 'FP8', vram: '65,5×2 GB', lat: '0.7s' }, host: 'elite-va' },
  { name: 'MedGemma-1.5-4B', tag: 'TRIAGEM', role: 'Rápido', desc: 'Triagem leve de documentos.', specs: { arch: '4B', quant: 'FP8', vram: '7,1 GB', lat: '<0.5s' }, host: 'flash-va' },
  { name: 'Lingshu-32B', tag: 'EXAMES', role: 'Análise', desc: 'Análise de exames e relatórios.', specs: { arch: '32B VL', quant: 'FP8', vram: '54,6 GB', lat: '~1s' }, host: 'elite-va' },
  { name: 'Baichuan-M2-32B', tag: 'APOIO', role: 'Especialista', desc: 'Apoio clínico e documental.', specs: { arch: '32B', quant: 'GPTQ INT4', vram: '27,4 GB', lat: '~1s' }, host: 'flash-va' },
  { name: 'Lingshu-I-8B', tag: 'IMAGEM', role: 'Visual', desc: 'Interpretação de imagens.', specs: { arch: '8B VL', quant: 'FP8', vram: '17,3 GB', lat: '<0.5s' }, host: 'flash-va' },
]

export default function Models() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B1420', fontFamily: 'Georgia, serif', color: '#E8ECF0' }}>
      <Nav active="/models" />
      <div style={{ paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#C9963C', marginBottom: 16 }}>MODELOS DE COMPLIANCE</div>
          <h1 style={{ fontSize: 44, color: '#E8ECF0', marginBottom: 8 }}>As <em style={{ color: '#C9963C', fontStyle: 'italic' }}>10 IAs</em> da frota</h1>
          <p style={{ fontSize: 17, color: '#8A9AA8', marginBottom: 48, maxWidth: 600 }}>Cada modelo com papel no pipeline de compliance: OCR → análise → verificação → trilha.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {MODELS.map((m, i) => (
              <div key={i} style={{ background: '#142236', border: '1px solid #1E3248', borderRadius: 14, padding: 28 }}>
                <h3 style={{ fontSize: 20, color: '#E8ECF0', marginBottom: 2 }}>{m.name}</h3>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#C9963C', textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', marginBottom: 8 }}>{m.tag}</span>
                <span style={{ fontSize: 13, color: '#8A9AA8', display: 'block', marginBottom: 12 }}>{m.role}</span>
                <p style={{ fontSize: 13, color: '#6B7B8A', lineHeight: 1.7 }}>{m.desc}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, padding: '3px 8px', background: '#0F1A28', border: '1px solid #1E3248', color: '#8A9AA8', borderRadius: 4 }}>{m.specs.arch}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, padding: '3px 8px', background: '#0F1A28', border: '1px solid #1E3248', color: '#8A9AA8', borderRadius: 4 }}>{m.specs.quant}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, padding: '3px 8px', background: '#0F1A28', border: '1px solid #1E3248', color: '#4ade80', borderRadius: 4 }}>{m.specs.lat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
