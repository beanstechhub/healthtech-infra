'use client'

import { Nav, Footer } from '../components'

export default function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B1420', fontFamily: 'Georgia, serif', color: '#E8ECF0' }}>
      <Nav active="/dashboard" />
      <div style={{ paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#C99633', marginBottom: 16 }}>FROTA EM TEMPO REAL</div>
          <h1 style={{ fontSize: 48, color: '#E8ECF0', marginBottom: 8 }}>Dashboard <em style={{ color: '#C9963C', fontStyle: 'italic' }}>3D</em></h1>
          <p style={{ fontSize: 18, color: '#8A9AA8', marginBottom: 48, maxWidth: 600 }}>A frota inteira visualizada. Cada host, cada modelo, cada status — ao vivo.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
            <div style={{ background: '#142236', border: '1px solid #1E3248', borderRadius: 16, padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 48, color: '#C9963C', fontFamily: 'Georgia, serif' }}>14</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#8A9AA8', textTransform: 'uppercase', letterSpacing: 2 }}>modelos soberanos</div>
            </div>
            <div style={{ background: '#142236', border: '1px solid #1E3248', borderRadius: 16, padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 48, color: '#3B82A8', fontFamily: 'Georgia, serif' }}>1,62 TB</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#8A9AA8', textTransform: 'uppercase', letterSpacing: 2 }}>VRAM total</div>
            </div>
            <div style={{ background: '#142236', border: '1px solid #1E3248', borderRadius: 16, padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 48, color: '#4ade80', fontFamily: 'Georgia, serif' }}>100k+</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#8A9AA8', textTransform: 'uppercase', letterSpacing: 2 }}>chats comprovados</div>
            </div>
            <div style={{ background: '#142236', border: '1px solid #1E3248', borderRadius: 16, padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 48, color: '#4A90C4', fontFamily: 'Georgia, serif' }}>114ms</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#8A9AA8', textTransform: 'uppercase', letterSpacing: 2 }}>latência SP→VA</div>
            </div>
          </div>

          <div style={{ background: '#142236', border: '1px solid #1E3248', borderRadius: 16, padding: 32, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, color: '#E8ECF0', marginBottom: 16 }}>Endpoints da Frota</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                'M3-235B · m3-va :8000', 'MedGemma-27B · elite-va :8001', 'Lingshu-32B · elite-va :8002',
                'AntAngelMed · elite-va :8000', 'Granite-4.1 · flash-va :8002', 'Granite-Guardian · flash-va :8003',
                'MedGemma-4B · flash-va :8004', 'Lingshu-I · flash-va :8005', 'Baichuan-M2 · flash-va :8006',
                'Theia · flash-va :8007', 'HunyuanOCR · flash-va :8008', 'Hunyuan3D · flash-va :8009',
                'Qwen3-Embedding · flash-va :8010', 'Whisper-turbo · flash-va :8011',
                'GLM-5.3 · Model Studio API', 'DeepSeek-V4 · Model Studio API',
              ].map((ep, i) => (
                <span key={i} style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 11, padding: '6px 12px',
                  background: '#0F1A28', border: '1px solid #1E3248', borderRadius: 8,
                  color: '#E8ECF0', display: 'inline-flex', alignItems: 'center', gap: 6
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
                  {ep}
                </span>
              ))}
            </div>
          </div>

          <div style={{ background: '#142236', border: '1px solid #1E3248', borderRadius: 16, padding: 32 }}>
            <h3 style={{ fontSize: 18, color: '#E8ECF0', marginBottom: 16 }}>Monitoramento ao Vivo</h3>
            <p style={{ fontSize: 14, color: '#8A9AA8' }}>
              31 sondas ativas em <a href="https://health.beanstech.com.br" target="_blank" style={{ color: '#3B82A8' }}>health.beanstech.com.br</a> — portais, GPUs, Elastic, Postgres, Keycloak. Tudo público.
            </p>
            <a href="https://health.beanstech.com.br" target="_blank"
              style={{ display: 'inline-block', marginTop: 16, padding: '12px 24px', background: '#3B82A8', color: '#fff', borderRadius: 8, fontFamily: 'Inter, sans-serif', fontSize: 13, textDecoration: 'none' }}>
              Abrir monitoramento →
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
