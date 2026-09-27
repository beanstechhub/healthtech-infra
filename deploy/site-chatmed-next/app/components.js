'use client'

// chatmed.beanstech.ai — Navegação compartilhada (Einstein)
export const NAV = [
  { href: '/', label: 'Apresentação' },
  { href: '/chat', label: 'Chat' },
  { href: '/models', label: 'Modelos' },
  { href: '/benchmark', label: 'Benchmark' },
  { href: '/einstein', label: 'Einstein' },
  { href: '/security', label: 'Segurança' },
]

export function Nav({ active }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      background: 'rgba(0,60,107,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #D0DCE4', zIndex: 100, padding: '12px 0'
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ fontSize: 22, color: '#fff', textDecoration: 'none', fontFamily: 'Georgia, serif' }}>
          chat<em style={{ color: '#C9963C', fontStyle: 'italic' }}>med</em>
        </a>
        <div style={{ display: 'flex', gap: 28, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
          {NAV.map(item => (
            <a key={item.href} href={item.href}
              style={{ color: active === item.href ? '#C9963C' : '#4A90C4', textDecoration: 'none' }}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

export function Footer() {
  return (
    <footer style={{ background: '#003C6B', padding: '48px 32px' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
        <div>
          <div style={{ fontSize: 24, color: '#fff', fontFamily: 'Georgia, serif' }}>chat<em style={{ color: '#4A90C4', fontStyle: 'italic' }}>med</em>.beanstech.ai</div>
          <div style={{ marginTop: 8, fontSize: 14, color: '#4A90C4', fontStyle: 'italic', maxWidth: 420, lineHeight: 1.8, fontFamily: 'Georgia, serif' }}>
            "Alibaba Cloud — Um Novo Conceito de Nuvem. Com gratidão e respeito: a frota que sustenta cada resposta nasceu e cresceu nas suas mãos."
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, fontFamily: 'Inter, sans-serif', fontSize: 12 }}>
          <a href="https://beanstech.com.br" style={{ color: '#4A90C4', textDecoration: 'none' }}>beanstech.com.br</a>
          <a href="https://chat.beanstech.ai" style={{ color: '#4A90C4', textDecoration: 'none' }}>chat.beanstech.ai</a>
          <a href="https://teste.beanshealth.com.br" style={{ color: '#4A90C4', textDecoration: 'none' }}>teste</a>
          <a href="mailto:matheus@beanstech.com.br" style={{ color: '#4A90C4', textDecoration: 'none' }}>contato</a>
        </div>
      </div>
    </footer>
  )
}
