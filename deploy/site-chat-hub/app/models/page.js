'use client'

import { Nav, Footer } from '../components'

const MODELS = [
  { name: 'Baichuan-M3-235B', tag: 'A REVOLUÇÃO', role: 'Raciocínio clínico de decisão', desc: 'Supera GPT-52 em HealthBench, SCAN-bench e avaliação de alucinação. Fact-Aware RL: sistematicamente reduz alucinação. Primeiro lugar nas três dimensões: Investigação Clínica, Testes Laboratoriais e Diagnóstico.', zh: '百川M3', zh_pt: 'Baichuan M3', specs: { arch: 'MoE 235B/A22B', quant: 'GPTQ INT4', vram: '124,5 GB', lat: '0.76s' }, paper: 'arXiv:2412.15261', host: 'm3-va', color: '#005B96' },
  { name: 'MedGemma-27B', tag: 'EXTREMAMENTE BOM', role: 'Visão médica multimodal', desc: 'Interpreta radiografia, dermatologia, oftalmologia, patologia. Encoder SigLIP. O estado da arte em visão médica.', zh: 'Google', zh_pt: 'Google Research', specs: { arch: 'Multimodal 27B', quant: 'FP8', vram: '49,4 GB', lat: '0.97s' }, paper: 'arXiv:2507.05201', host: 'elite-va', color: '#C9963C' },
  { name: 'AntAngelMed-100B', tag: 'O PRIMEIRO APROVADO', role: 'Clínico geral de apoio', desc: 'Um dos primeiros modelos médicos aprovados para uso clínico assistido. Do ecossistema do Grupo Ant. 48 sequências simultâneas em 2 GPUs.', zh: '蚂蚁集团', zh_pt: 'Grupo Ant · Modelo de IA médica', specs: { arch: 'MoE ~100B', quant: 'FP8', vram: '65,5×2 GB', lat: '0.7s' }, paper: '', host: 'elite-va', color: '#003C6B' },
  { name: 'MedGemma-1.5-4B', tag: 'TRIAGEM', role: 'Onde a internet não chega', desc: '4B parâmetros com treino médico que supera modelos 10× maiores em triagem. Para postos de saúde, unidades rurais, o campo. Se cabe num edge, serve no Amazonas. E serve no Einstein como primeiro filtro.', zh: 'Google', zh_pt: 'Google', specs: { arch: '4B denso', quant: 'FP8', vram: '7,1 GB', lat: '<0.5s' }, paper: '', host: 'flash-va', color: '#2D7A4F' },
  { name: 'Lingshu-32B', tag: 'VISÃO + TEXTO', role: 'Interpretação de exames', desc: 'Modelo médico multimodal da Lingshu Medical. FP8, processa texto e imagem com raciocínio clínico.', zh: '灵枢医疗', zh_pt: 'Lingshu Medical · Modelo de linguagem médica', specs: { arch: '32B VL', quant: 'FP8', vram: '54,6 GB', lat: '~1s' }, paper: '', host: 'elite-va', color: '#4A90C4' },
  { name: 'Lingshu-I-8B', tag: 'VISÃO LEVE', role: 'Exames de imagem', desc: 'Modelo de visão médica compacto. Para interpretar exames com latência mínima.', zh: '灵枢医疗', zh_pt: 'Lingshu Medical · Modelo de visão', specs: { arch: '8B VL', quant: 'FP8', vram: '17,3 GB', lat: '<0.5s' }, paper: '', host: 'flash-va', color: '#4A90C4' },
  { name: 'Baichuan-M2-32B', tag: 'ESPECIALISTA', role: 'Apoio clínico', desc: 'Modelo médico denso 32B, antecessor do M3. Especializado em medicina em PT e ZH. GPTQ INT4.', zh: '百川智能', zh_pt: 'Baichuan AI · M2-32B', specs: { arch: '32B denso', quant: 'GPTQ INT4', vram: '27,4 GB', lat: '~1s' }, paper: '', host: 'flash-va', color: '#005B96' },
  { name: 'Granite-4.1-30B', tag: 'SÍNTESE', role: 'Camada de verificação', desc: 'IBM Granite 4.1 30B FP8. Síntese e verificação na cadeia anti-alucinação. A camada 3 das 6.', zh: 'IBM', zh_pt: 'IBM · Granite 4.1', specs: { arch: '30B MoE', quant: 'FP8', vram: '44,4 GB', lat: '~0.5s' }, paper: '', host: 'flash-va', color: '#666' },
  { name: 'Granite-Guardian-3B', tag: 'GUARDIÃO', role: 'Segurança clínica', desc: 'IBM Granite Guardian. A camada 2 da cadeia: barreiras de segurança antes da resposta.', zh: 'IBM', zh_pt: 'IBM · Granite Guardian', specs: { arch: '3B', quant: 'BF16', vram: '8,9 GB', lat: '<0.3s' }, paper: '', host: 'flash-va', color: '#666' },
  { name: 'Theia-8B', tag: 'COMPLIANCE', role: 'Análise financeira', desc: 'Chainbase Theia 8B FP8. Análise de dados on-chain e compliance PLD/FT. O modelo que rastreia ativos.', zh: 'Chainbase', zh_pt: 'Chainbase · Theia', specs: { arch: '8B', quant: 'FP8', vram: '8,5 GB', lat: '<0.5s' }, paper: '', host: 'flash-va', color: '#C9963C' },
]

export default function Models() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFBFC', fontFamily: 'Georgia, serif', color: '#1A1A2E' }}>
      <Nav active="/models" />
      <div style={{ paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#005B96', marginBottom: 16 }}>TODAS AS IAs</div>
          <h1 style={{ fontSize: 48, color: '#003C6B', marginBottom: 8 }}>Os <em style={{ color: '#005B96', fontStyle: 'italic' }}>14 modelos</em></h1>
          <p style={{ fontSize: 18, color: '#5A6A7A', marginBottom: 48, maxWidth: 600 }}>Cada um com papel definido na cadeia anti-alucinação. Todos em GPUs locais, território brasileiro.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {MODELS.map((m, i) => (
              <div key={i} style={{
                background: '#fff', border: '1px solid #D0DCE4', borderRadius: 14, padding: 28,
                position: 'relative', overflow: 'hidden', transition: 'all .2s'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: m.color }} />
                <h3 style={{ fontSize: 20, color: '#1A1A2E', marginBottom: 2 }}>{m.name}</h3>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: m.color, textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', marginBottom: 8 }}>{m.tag}</span>
                <span style={{ fontSize: 13, color: '#5A6A7A', display: 'block', marginBottom: 12 }}>{m.role}</span>
                <p style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.7, marginBottom: 12 }}>{m.desc}</p>
                <div style={{ fontSize: 11, color: '#8A9AA8', fontFamily: 'Inter, sans-serif' }}>
                  <span style={{ color: '#3333AA' }}>{m.zh}</span> <span style={{ color: '#5A6A7A' }}>· {m.zh_pt}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, padding: '3px 8px', background: '#E8F1F8', color: '#005B96', borderRadius: 4 }}>{m.specs.arch}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, padding: '3px 8px', background: '#E8F1F8', color: '#005B96', borderRadius: 4 }}>{m.specs.quant}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, padding: '3px 8px', background: '#E8F1F8', color: '#005B96', borderRadius: 4 }}>{m.specs.vram}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, padding: '3px 8px', background: '#E8F1F8', color: '#2D7A4F', borderRadius: 4 }}>{m.specs.lat}</span>
                </div>
                {m.paper && (
                  <a href={`https://arxiv.org/abs/${m.paper.replace('arXiv:', '')}`} target="_blank"
                    style={{ display: 'inline-block', marginTop: 12, padding: '6px 14px', background: '#E8F1F8', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#005B96', textDecoration: 'none' }}>
                    📄 Paper →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
