'use client'

import { Nav, Footer } from './components'

export default function Apresentacao() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFBFC', fontFamily: 'Georgia, serif', color: '#1A1A2E' }}>
      <Nav active="/" />
      <style>{`
        .ph{max-width:760px;margin:0 auto;padding:150px 32px 80px;text-align:center}
        .lbl{font-family:Inter,sans-serif;font-size:11px;letter-spacing:6px;text-transform:uppercase;color:#005B96;margin-bottom:28px}
        .gold{width:64px;height:2px;background:#C9963C;margin:36px auto}
        .sig{font-family:Inter,sans-serif;font-size:12px;letter-spacing:1px;color:#5A6A7A}
        .fade{opacity:0;animation:up .9s ease forwards}
        @keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
      `}</style>

      <div className="ph">
        <div className="lbl fade">Apresentação</div>

        <h1 className="fade" style={{ fontSize: 40, lineHeight: 1.35, color: '#003C6B', animationDelay: '.15s' }}>
          A inteligência artificial jamais substituirá<br />
          os profissionais a quem Deus entregou<br />
          <em style={{ color: '#005B96' }}>o dom da cura.</em>
        </h1>

        <div className="gold fade" style={{ animationDelay: '.3s' }} />

        <p className="fade" style={{ fontSize: 19, lineHeight: 1.9, color: '#3A4A5A', animationDelay: '.4s' }}>
          Ela é, e sempre será, uma <strong style={{ color: '#005B96' }}>ferramenta de apoio à decisão</strong> —
          um instrumento na mão de quem pensa, sente e decide.
        </p>

        <p className="fade" style={{ fontSize: 19, lineHeight: 1.9, color: '#3A4A5A', animationDelay: '.55s' }}>
          A BeansTech é apenas <em style={{ color: '#005B96' }}>coadjuvante</em> nesta história.
          O protagonismo é de quem cuida.
        </p>

        <div className="gold fade" style={{ animationDelay: '.7s' }} />

        <p className="fade" style={{ fontSize: 23, lineHeight: 1.6, color: '#003C6B', fontWeight: 700, animationDelay: '.75s' }}>
          Nosso objetivo é simples:<br />
          pessoas com saúde. <em style={{ color: '#C9963C' }}>Vidas salvas.</em>
        </p>

        <div className="gold fade" style={{ animationDelay: '.9s' }} />

        <div className="fade" style={{ animationDelay: '1s' }}>
          <div className="sig">Nosso carinho e respeito,</div>
          <div style={{ fontSize: 26, color: '#003C6B', marginTop: 8 }}>
            Beans<em style={{ color: '#C9963C', fontStyle: 'italic' }}>Tech</em>
          </div>
        </div>

        <div className="fade" style={{ marginTop: 64, animationDelay: '1.15s' }}>
          <a href="/chat" style={{
            display: 'inline-block', fontFamily: 'Inter, sans-serif', fontSize: 13,
            color: '#fff', background: '#005B96', padding: '14px 36px', borderRadius: 10,
            textDecoration: 'none'
          }}>
            Entrar no chat de apoio à decisão →
          </a>
          <div style={{ marginTop: 18, fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#B0392E' }}>
            ⚠ IA como ferramenta de apoio à decisão clínica — não substitui avaliação médica.
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
