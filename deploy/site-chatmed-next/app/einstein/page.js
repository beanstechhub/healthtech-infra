'use client'

import { Nav, Footer } from '../components'

export default function Einstein() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFBFC', fontFamily: 'Georgia, serif', color: '#1A1A2E' }}>
      <Nav active="/einstein" />
      <div style={{ paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#005B96', marginBottom: 16 }}>PROPOSTA PARA O EINSTEIN</div>
          <h1 style={{ fontSize: 48, color: '#003C6B', marginBottom: 8 }}>GPUs <em style={{ color: '#005B96', fontStyle: 'italic' }}>locais</em>. Território <em style={{ color: '#005B96', fontStyle: 'italic' }}>brasileiro</em>.</h1>
          <p style={{ fontSize: 18, color: '#5A6A7A', marginBottom: 48, maxWidth: 640 }}>
            A proposta não é "use nossa nuvem". É: os modelos rodam dentro do datacenter do Einstein, em GPUs locais, no território do hospital. Vossa infraestrutura, vosso controle, vossos dados.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr)', gap: 24, marginBottom: 48 }}>
            {[
              { icon: '🏥', title: 'GPU no vosso datacenter', desc: 'M3-235B ou MedGemma-27B em GPUs instaladas no Einstein. Sem nuvem externa, sem API remota, sem dado cruzando a fronteira do hospital.' },
              { icon: '🇧🇷', title: 'Território brasileiro', desc: 'Todo o processamento dentro do perímetro LGPD do Einstein. Nenhum dado de paciente sai do hospital. A trilha de auditoria fica no vosso domínio.' },
              { icon: '⚙️', title: 'Vossa infraestrutura', desc: 'O Einstein controla: hardware, atualização de modelos, acesso, integração com sistemas existentes. Nós fornecemos a tecnologia e o suporte de engenharia.' },
              { icon: '🔬', title: 'Co-autoria científica', desc: 'A validação é publicável. Einstein como co-autor da metodologia de benchmark cego — referência para o Brasil e para a América Latina.' },
            ].map((card, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #D0DCE4', borderRadius: 16, padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{card.icon}</div>
                <h4 style={{ fontSize: 18, color: '#003C6B', marginBottom: 8 }}>{card.title}</h4>
                <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.7 }}>{card.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #D0DCE4', borderRadius: 16, padding: 32, marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, color: '#003C6B', marginBottom: 16 }}>Orçamento resumido</h3>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200, background: '#E8F1F8', padding: 20, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 32, color: '#2D7A4F', fontFamily: 'Georgia, serif' }}>US$ 210k</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#5A6A7A', textTransform: 'uppercase' }}>CAPEX (HGX H200 + Redata)</div>
              </div>
              <div style={{ flex: 1, minWidth: 200, background: '#E8F1F8', padding: 20, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 32, color: '#005B96', fontFamily: 'Georgia, serif' }}>US$ 6.5k/mês</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#5A6A7A', textTransform: 'uppercase' }}>OPEX (colo + energia)</div>
              </div>
              <div style={{ flex: 1, minWidth: 200, background: '#E8F1F8', padding: 20, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 32, color: '#C9963C', fontFamily: 'Georgia, serif' }}>3-4 meses</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#5A6A7A', textTransform: 'uppercase' }}>Break-even vs. API</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 32 }}>
            <a href="mailto:matheus@beanstech.com.br?subject=Einstein%20-%20Deploy%20Local%20GPU"
              style={{ display: 'inline-block', background: '#005B96', color: '#fff', padding: '16px 32px', borderRadius: 10, fontFamily: 'Inter, sans-serif', fontSize: 15, textDecoration: 'none', boxShadow: '0 6px 24px rgba(0,91,150,0.35)' }}>
              Responder ao convite →
            </a>
            <a href="https://teste.beanshealth.com.br"
              style={{ display: 'inline-block', border: '2px solid #005B96', color: '#005B96', padding: '14px 30px', borderRadius: 10, fontFamily: 'Inter, sans-serif', fontSize: 15, textDecoration: 'none' }}>
              🧪 Testar agora →
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
