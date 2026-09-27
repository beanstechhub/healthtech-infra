'use client'

import { Nav, Footer } from '../components'

export default function Security() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFBFC', fontFamily: 'Georgia, serif', color: '#1A1A2E' }}>
      <Nav active="/security" />
      <div style={{ paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#005B96', marginBottom: 16 }}>SEGURANÇA</div>
          <h1 style={{ fontSize: 48, color: '#003C6B', marginBottom: 8 }}>Por que este link é <em style={{ color: '#005B96', fontStyle: 'italic' }}>seguro</em></h1>
          <p style={{ fontSize: 18, color: '#5A6A7A', marginBottom: 48, maxWidth: 600 }}>Como garantimos que não há vírus, malware ou conteúdo malicioso.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { icon: '🔒', title: 'TLS 1.3 + HSTS', desc: 'Todo tráfego criptografado ponta a ponta. Certificate transparency ativa. HSTS com max-age de 1 ano.', verified: 'ssl_verify_result=0' },
              { icon: '🛡️', title: 'Nenhum executável baixado', desc: 'Esta página é HTML+JavaScript server-rendered. Não há downloads, anexos ou executáveis. Nada roda no seu computador além do browser.', verified: 'Zero downloads · Zero binários' },
              { icon: '🔗', title: 'Links verificados', desc: 'Todos os links externos apontam para arxiv.org e huggingface.co — fontes acadêmicas confiáveis com HTTPS próprio. Nenhum link encurtado.', verified: 'Apenas arXiv + HuggingFace' },
              { icon: '🗄️', title: 'Sem execução no cliente', desc: 'O JavaScript desta página é apenas visual. Nenhum código externo é carregado dinamicamente. Nenhum iframe de terceiros.', verified: 'CSP friendly · Sem eval()' },
              { icon: '🏢', title: 'Infraestrutura própria', desc: 'Hospedado na nossa infraestrutura Alibaba Cloud. Sem CDN de terceiros para conteúdo dinâmico. Firewall em camadas.', verified: 'br-apps sa-east-1 · Caddy' },
              { icon: '📊', title: 'Auditável em tempo real', desc: 'O estado da frota é público: health.beanstech.com.br com 31 sondas ativas.', verified: '31 sondas · Público' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #D0DCE4', borderRadius: 14, padding: 28, transition: 'all .2s' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                <h4 style={{ fontSize: 17, color: '#1A1A2E', marginBottom: 6 }}>{s.title}</h4>
                <p style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.6 }}>{s.desc}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#2D7A4F', marginTop: 10, padding: '4px 10px', background: 'rgba(45,122,79,0.08)', borderRadius: 4 }}>
                  ✓ {s.verified}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, padding: 24, background: '#E8F1F8', borderRadius: 14, borderLeft: '5px solid #005B96' }}>
            <p style={{ fontSize: 14, color: '#1A1A2E' }}>
              <strong style={{ color: '#005B96' }}>Como verificar você mesmo:</strong>
              <br />(1) Clique no cadeado do browser → certificado válido emitido para chat.beanstech.ai
              <br />(2) Abra DevTools → Network → nenhuma requisição para domínios suspeitos
              <br />(3) Todos os links de paper apontam para arxiv.org — confirme na barra de status antes de clicar
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
