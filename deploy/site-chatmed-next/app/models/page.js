'use client'

import { Nav, Footer } from '../components'

const MODELS = [
  { name: 'Baichuan-M3-235B', tag: 'A REVOLUÇÃO', role: 'Raciocínio clínico de decisão', desc: 'Supera GPT-5.2 em HealthBench, SCAN-bench e avaliação de alucinação. Fact-Aware RL. Primeiro lugar nas três dimensões: Investigação Clínica, Testes Laboratoriais e Diagnóstico.', zh: '百川M3', zh_pt: 'Baichuan M3 · Supera GPT-5.2', specs: { arch: 'MoE 235B/A22B', quant: 'GPTQ INT4', vram: '124,5 GB', lat: '0.76s' }, paper: 'https://arxiv.org/abs/2412.15261', host: 'm3-va' },
  { name: 'MedGemma-27B', tag: 'EXTREMAMENTE BOM', role: 'Visão médica multimodal', desc: 'Interpreta radiografia, dermatologia, oftalmologia, patologia. Encoder SigLIP. Estado da arte em visão médica.', zh: 'Google Research', zh_pt: 'Google Research · MedGemma', specs: { arch: 'Multimodal 27B', quant: 'FP8', vram: '49,4 GB', lat: '0.97s' }, paper: 'https://arxiv.org/abs/2507.05201', host: 'elite-va' },
  { name: 'AntAngelMed-100B', tag: 'O PRIMEIRO APROVADO', role: 'Clínico geral de apoio', desc: 'Um dos primeiros modelos médicos aprovados para uso clínico assistido. Do ecossistema do Grupo Ant. 48 seqs simultâneas.', zh: '蚂蚁集团 · 医疗大模型', zh_pt: 'Grupo Ant · Modelo de IA médica', specs: { arch: 'MoE ~100B', quant: 'FP8', vram: '65,5×2 GB', lat: '0.7s' }, paper: '', host: 'elite-va' },
  { name: 'MedGemma-1.5-4B', tag: 'TRIAGEM', role: 'Onde a internet não chega', desc: '4B que supera modelos 10× maiores em triagem. Para postos de saúde, unidades rurais, o campo.', zh: 'Google · MedGemma 4B', zh_pt: 'Google · MedGemma 4B', specs: { arch: '4B denso', quant: 'FP8', vram: '7,1 GB', lat: '<0.5s' }, paper: '', host: 'flash-va' },
  { name: 'Lingshu-32B', tag: 'VISÃO + TEXTO', role: 'Interpretação de exames', desc: 'Modelo médico multimodal da Lingshu Medical. FP8.', zh: '灵枢医疗 · 大语言模型', zh_pt: 'Lingshu Medical · Modelo de linguagem', specs: { arch: '32B VL', quant: 'FP8', vram: '54,6 GB', lat: '~1s' }, paper: '', host: 'elite-va' },
  { name: 'Lingshu-I-8B', tag: 'VISÃO LEVE', role: 'Exames de imagem', desc: 'Modelo de visão médica compacto.', zh: '灵枢医疗 · 视觉模型', zh_pt: 'Lingshu Medical · Modelo de visão', specs: { arch: '8B VL', quant: 'FP8', vram: '17,3 GB', lat: '<0.5s' }, paper: '', host: 'flash-va' },
  { name: 'Baichuan-M2-32B', tag: 'ESPECIALISTA', role: 'Apoio clínico', desc: 'Modelo médico denso 32B, antecessor do M3. Especializado em PT e ZH.', zh: '百川智能 · M2-32B', zh_pt: 'Baichuan AI · M2-32B', specs: { arch: '32B denso', quant: 'GPTQ INT4', vram: '27,4 GB', lat: '~1s' }, paper: '', host: 'flash-va' },
  { name: 'Granite-4.1-30B', tag: 'SÍNTESE', role: 'Camada de verificação', desc: 'IBM Granite 4.1 30B FP8. Síntese e verificação na cadeia anti-alucinação. A camada 3 das 6.', zh: 'IBM · Granite 4.1', zh_pt: 'IBM · Granite 4.1', specs: { arch: '30B MoE', quant: 'FP8', vram: '44,4 GB', lat: '~0.5s' }, paper: '', host: 'flash-va' },
  { name: 'Granite-Guardian-3B', tag: 'GUARDIÃO', role: 'Segurança clínica', desc: 'IBM Granite Guardian. A camada 2: barreiras de segurança antes da resposta.', zh: 'IBM · Granite Guardian', zh_pt: 'IBM · Granite Guardian', specs: { arch: '3B', quant: 'BF16', vram: '8,9 GB', lat: '<0.3s' }, paper: '', host: 'flash-va' },
  { name: 'Theia-8B', tag: 'COMPLIANCE', role: 'Análise financeira', desc: 'Chainbase Theia 8B FP8. Análise on-chain e compliance PLD/FT.', zh: 'Chainbase · Theia', zh_pt: 'Chainbase · Theia', specs: { arch: '8B', quant: 'FP8', vram: '8,5 GB', lat: '<0.5s' }, paper: '', host: 'flash-va' },
]

const CN_DOCS = [
  { zh: '百川M3-235B', pt: 'Baichuan M3-235B', zh_desc: '百川智能的新一代医疗大语言模型，在多个医疗基准中超越GPT-5.2。', pt_desc: 'O modelo de linguagem médica de nova geração da Baichuan AI, superando o GPT-5.2 em benchmarks médicos.', link: 'https://huggingface.co/baichuan-inc/Baichuan-M3-235B' },
  { zh: '蚂蚁集团 · 医疗大模型', pt: 'Grupo Ant · Modelo de IA Médica', zh_desc: '蚂蚁集团生态系统的高性能医疗大模型，FP8量化优化大规模临床部署。', pt_desc: 'Modelo de IA médica de alta performance do ecossistema do Grupo Ant, quantizado em FP8 para implantação clínica.', link: 'https://huggingface.co/MedAIBase/AntAngelMed-FP8' },
  { zh: '灵枢医疗 · 大语言模型', pt: 'Lingshu Medical · Modelo de Linguagem', zh_desc: '灵枢医疗大模型：多模态医学AI，支持图像理解、临床推理。', pt_desc: 'Modelo de linguagem médica Lingshu: IA médica multimodal, com compreensão de imagens e raciocínio clínico.', link: 'https://huggingface.co/lingshu-medical-mllm/Lingshu-I-8B' },
  { zh: '腾讯 · 混元3D', pt: 'Tencent · Hunyuan 3D', zh_desc: '腾讯混元3D-2：图像到3D生成。', pt_desc: 'Tencent Hunyuan 3D-2: geração de imagem para 3D.', link: 'https://huggingface.co/tencent/Hunyuan3D-2' },
  { zh: '腾讯 · 混元OCR', pt: 'Tencent · Hunyuan OCR', zh_desc: '腾讯混元OCR：文档识别，支持印刷和手写。', pt_desc: 'Tencent Hunyuan OCR: reconhecimento de documentos, suportando texto impresso e manuscrito.', link: 'https://huggingface.co/tencent/HunyuanOCR' },
]

export default function Models() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFBFC', fontFamily: 'Georgia, serif', color: '#1A1A2E' }}>
      <Nav active="/models" />
      <div style={{ paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#005B96', marginBottom: 16 }}>TODAS AS IAs DE EXCELÊNCIA</div>
          <h1 style={{ fontSize: 48, color: '#003C6B', marginBottom: 8 }}>Os <em style={{ color: '#005B96', fontStyle: 'italic' }}>14 modelos</em></h1>
          <p style={{ fontSize: 18, color: '#5A6A7A', marginBottom: 48, maxWidth: 600 }}>Cada um com papel definido na cadeia anti-alucinação de 6 camadas.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {MODELS.map((m, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #D0DCE4', borderRadius: 14, padding: 28, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: '#005B96' }} />
                <h3 style={{ fontSize: 20, color: '#1A1A2E', marginBottom: 2 }}>{m.name}</h3>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#005B96', textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', marginBottom: 8 }}>{m.tag}</span>
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
                  <a href={m.paper} target="_blank" style={{ display: 'inline-block', marginTop: 12, padding: '6px 14px', background: '#E8F1F8', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#005B96', textDecoration: 'none' }}>
                    📄 Paper →
                  </a>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #D0DCE4' }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#3333AA', marginBottom: 12 }}>模型文档 · TRADUZIDO COM RESPEITO</div>
            <h3 style={{ fontSize: 24, color: '#1A1A2E', marginBottom: 16 }}>Tecnologia médica chinesa — <span style={{ color: '#3333AA' }}>em português</span></h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              {CN_DOCS.map((d, i) => (
                <div key={i} style={{ background: '#FAFBFC', border: '1px solid #D0D8F0', borderRadius: 10, padding: 20 }}>
                  <h4 style={{ fontSize: 15, marginBottom: 4 }}><span style={{ color: '#3333AA' }}>{d.zh}</span> · {d.pt}</h4>
                  <span style={{ fontSize: 12, color: '#3333AA', display: 'block', marginBottom: 6 }}>{d.zh_desc}</span>
                  <span style={{ fontSize: 12, color: '#5A6A7A' }}>{d.pt_desc}</span>
                  <a href={d.link} target="_blank" style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#3333AA', marginTop: 8, display: 'inline-block' }}>→ Documentação</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
