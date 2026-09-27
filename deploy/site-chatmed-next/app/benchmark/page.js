'use client'

import { Nav, Footer } from '../components'

export default function Benchmark() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFBFC', fontFamily: 'Georgia, serif', color: '#1A1A2E' }}>
      <Nav active="/benchmark" />
      <div style={{ paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: '#005B96', marginBottom: 16 }}>TESTES PRELIMINARES</div>
          <h1 style={{ fontSize: 44, color: '#003C6B', marginBottom: 8 }}>Benchmark clínico <em style={{ color: '#005B96', fontStyle: 'italic' }}>cego</em></h1>
          <p style={{ fontSize: 17, color: '#5A6A7A', marginBottom: 48, maxWidth: 600 }}>277 casos clínicos reais brasileiros, modelos mascarados, avaliação automática + revisão cega pendente.</p>

          <div style={{ background: '#fff', border: '1px solid #D0DCE4', borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: '0 4px 20px rgba(0,50,100,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, color: '#003C6B' }}>📊 Resultados — Avaliação Automática</h3>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#5A6A7A' }}>n=277 · 23 especialidades</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #D0DCE4' }}>
                  <th style={{ textAlign: 'left', padding: '10px 16px', color: '#5A6A7A', fontWeight: 500, fontSize: 11, textTransform: 'uppercase' }}>Modelo</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', color: '#5A6A7A', fontWeight: 500, fontSize: 11, textTransform: 'uppercase' }}>Cobertura</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', color: '#5A6A7A', fontWeight: 500, fontSize: 11, textTransform: 'uppercase' }}>Abstenções</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Modelo D', '0,486', '20'], ['Modelo E', '0,437', '11'], ['Modelo A', '0,396', '3'], ['Modelo I', '0,392', '12'],
                  ['Modelo G', '0,377', '15'], ['Modelo F', '0,347', '6'], ['Modelo H', '0,254', '20'], ['Modelo B', '0,274', '18'], ['Modelo C', '0,235', '2'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #D0DCE4' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'Georgia, serif', fontSize: 14, color: '#1A1A2E' }}>{row[0]}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: i === 0 ? '#2D7A4F' : '#1A1A2E' }}>{row[1]}</td>
                    <td style={{ padding: '12px 16px', color: '#5A6A7A' }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: 12, color: '#5A6A7A', fontStyle: 'italic', marginTop: 16, paddingTop: 16, borderTop: '1px solid #D0DCE4' }}>
              A avaliação automática mede correspondência literal de texto. A revisão humana cega corrige essa limitação.
            </p>
          </div>

          <div style={{ background: '#E8F1F8', borderRadius: 12, padding: 20, borderLeft: '5px solid #005B96' }}>
            <p style={{ fontSize: 15, color: '#1A1A2E' }}>
              <strong style={{ color: '#005B96' }}>O caso que definiu o vencedor:</strong> paciente idoso, clearance renal 28 mL/min, rivaroxabana 20mg/dia. O modelo vencedor foi o único que (a) identificou a dose como excessiva, (b) recomendou 10mg/dia citando a fonte regulatória, e (c) mencionou o reversor específico.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a href="https://teste.beanshealth.com.br" target="_blank"
              style={{ display: 'inline-block', background: '#005B96', color: '#fff', padding: '16px 32px', borderRadius: 10, fontFamily: 'Inter, sans-serif', fontSize: 15, textDecoration: 'none' }}>
              🧪 Participar da avaliação →
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
