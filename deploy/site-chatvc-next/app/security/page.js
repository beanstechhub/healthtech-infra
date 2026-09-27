'use client'

import { Nav, Footer } from '../components'

export default function Security() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B1420', fontFamily: 'Georgia, serif', color: '#E8ECF0' }}>
      <Nav active="/security" />
      <div style={{ paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#C9963C', marginBottom: 16 }}>SEGURANÇA</div>
          <h1 style={{ fontSize: 44, color: '#E8ECF0', marginBottom: 8 }}>Por que este link é <em style={{ color: '#C9963C', fontStyle: 'italic' }}>seguro</em></h1>
          <p style={{ fontSize: 17, color: '#8A9AA8', marginBottom: 48, maxWidth: 600 }}>Como garantimos que não há vírus, malware ou conteúdo malicioso.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { icon: '🔒', title: 'TLS 1.3 + HSTS', desc: 'Todo tráfego criptografado ponta a ponta.', verified: 'ssl_verify_result=0' },
              { icon: '🛡️', title: 'Nenhum executável', desc: 'HTML+JS server-rendered. Zero downloads, zero binários.', verified: 'Zero downloads' },
              { icon: '🔗', title: 'Links verificados', desc: 'Externos apenas para arxiv.org e huggingface.co.', verified: 'Apenas arXiv + HF' },
              { icon: '🗄️', title: 'Sem execução no cliente', desc: 'JS é apenas visual. Sem eval(), sem iframe.', verified: 'CSP friendly' },
              { icon: '🏢', title: 'Infra própria', desc: 'Alibaba Cloud. Sem CDN de terceiros.', verified: 'sa-east-1 + us-east-1' },
              { icon: '📊', title: 'Auditável ao vivo', desc: 'health.beanstech.com.br com 31 sondas.', verified: '31 sondas' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#142236', border: '1px solid #1E3248', borderRadius: 14, padding: 28 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                <h4 style={{ fontSize: 17, color: '#E8ECF0', marginBottom: 6 }}>{s.title}</h4>
                <p style={{ fontSize: 13, color: '#8A9AA8', lineHeight: 1.6 }}>{s.desc}</p>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#4ade80', marginTop: 10, padding: '4px 10px', background: 'rgba(74,222,128,0.1)', borderRadius: 4, display: 'inline-block' }}>✓ {s.verified}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, padding: 24, background: '#142236', borderRadius: 14, borderLeft: '5px solid #C9963C' }}>
            <p style={{ fontSize: 14, color: '#E8ECF0' }}>
              <strong style={{ color: '#C9963C' }}>Como verificar você mesmo:</strong>
              <br />(1) Clique no cadeado → certificado válido para chatvc.beanstech.ai
              <br />(2) Abra DevTools → Network → nenhuma requisição suspeita
              <br />(3) Links de paper apontam para arxiv.org
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
