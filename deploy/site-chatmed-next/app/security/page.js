'use client'

import { Nav, Footer } from '../components'

export default function Security() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFBFC', fontFamily: 'Georgia, serif', color: '#1A1A2E' }}>
      <Nav active="/security" />
      <div style={{ paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#005B96', marginBottom: 16 }}>SEGURANÇA</div>
          <h1 style={{ fontSize: 44, color: '#003C6B', marginBottom: 8 }}>Por que este link é <em style={{ color: '#005B96', fontStyle: 'italic' }}>seguro</em></h1>
          <p style={{ fontSize: 17, color: '#5A6A7A', marginBottom: 48, maxWidth: 600 }}>Como garantimos que não há vírus, malware ou conteúdo malicioso.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { icon: '🔒', title: 'TLS 1.3 + HSTS', desc: 'Todo tráfego criptografado ponta a ponta. Certificate transparency ativa.', verified: 'ssl_verify_result=0' },
              { icon: '🛡️', title: 'Nenhum executável', desc: 'HTML+JavaScript server-rendered. Não há downloads, anexos ou binários.', verified: 'Zero downloads' },
              { icon: '🔗', title: 'Links verificados', desc: 'Externos apenas para arxiv.org e huggingface.co. Nenhum link encurtado.', verified: 'Apenas arXiv + HF' },
              { icon: '🗄️', title: 'Sem execução no cliente', desc: 'JavaScript é apenas visual. Sem eval(), sem iframe de terceiros.', verified: 'CSP friendly' },
              { icon: '🏢', title: 'Infraestrutura própria', desc: 'Alibaba Cloud. Sem CDN de terceiros para conteúdo dinâmico.', verified: 'sa-east-1 + us-east-1' },
              { icon: '📊', title: 'Auditável ao vivo', desc: 'health.beanstech.com.br com 31 sondas públicas.', verified: '31 sondas' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #D0DCE4', borderRadius: 14, padding: 28 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                <h4 style={{ fontSize: 17, marginBottom: 6 }}>{s.title}</h4>
                <p style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.6 }}>{s.desc}</p>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#2D7A4F', marginTop: 10, padding: '4px 10px', background: 'rgba(45,122,79,0.08)', borderRadius: 4, display: 'inline-block' }}>✓ {s.verified}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, padding: 24, background: '#E8F1F8', borderRadius: 14, borderLeft: '5px solid #005B96' }}>
            <p style={{ fontSize: 14, color: '#1A1A2E' }}>
              <strong style={{ color: '#005B96' }}>Como verificar você mesmo:</strong>
              <br />(1) Clique no cadeado → certificado válido para chatmed.beanstech.ai
              <br />(2) Abra DevTools → Network → nenhuma requisição suspeita
              <br />(3) Links de paper apontam para arxiv.org — confirme antes de clicar
            </p>
          </div>

          <div style={{ marginTop: 48 }}>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#005B96', marginBottom: 16 }}>RELATÓRIO DO BENCHMARK</div>
            <h2 style={{ fontSize: 30, color: '#003C6B', marginBottom: 8 }}>Benchmark clínico <em style={{ color: '#005B96', fontStyle: 'italic' }}>cego</em></h2>
            <p style={{ fontSize: 15, color: '#5A6A7A', marginBottom: 24, maxWidth: 640 }}>
              Casos clínicos brasileiros reais apresentados a modelos mascarados — o avaliador não sabe qual IA responde.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
              {[
                { n: '51', label: 'casos clínicos avaliados', sub: 'de um acervo de 277 · 23 especialidades' },
                { n: '10', label: 'modelos testados', sub: 'identidade mascarada durante a avaliação' },
                { n: '510', label: 'avaliações individuais', sub: '51 casos × 10 modelos, metodologia idêntica' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #D0DCE4', borderRadius: 14, padding: 24, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 44, color: '#005B96' }}>{s.n}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#1A1A2E', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#5A6A7A', marginTop: 6 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: 20, background: 'rgba(201,150,60,0.08)', border: '1px solid rgba(201,150,60,0.35)', borderRadius: 12, marginBottom: 24 }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#8A6A1F', lineHeight: 1.7 }}>
                <strong>⚠ Fase de estudo.</strong> Este benchmark está em fase preliminar de estudo: a avaliação atual é automática (correspondência textual) e a revisão humana cega está pendente. Os números não constituem validação clínica e não devem ser usados como única base para decisão assistencial. Participação de profissionais: <a href="https://teste.beanshealth.com.br" style={{ color: '#005B96' }}>teste.beanshealth.com.br</a>.
              </p>
            </div>

            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#5A6A7A' }}>
              Metodologia e resultados parciais: <a href="/benchmark" style={{ color: '#005B96' }}>página do benchmark</a> · Participar da avaliação: <a href="https://teste.beanshealth.com.br" style={{ color: '#005B96' }}>benchmark cego público</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
