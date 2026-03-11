import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const modules = [
  { path: '/',           icon: '⬡', label: 'Dashboard',  color: '#00FFB2' },
  { path: '/projects',   icon: '◈', label: 'Projetos',   color: '#00C8FF' },
  { path: '/commercial', icon: '◎', label: 'Comercial',  color: '#FFB800' },
  { path: '/erp',        icon: '⬢', label: 'ERP',        color: '#FF6B35' },
  { path: '/versions',   icon: '⊕', label: 'Versões',    color: '#B44FFF' },
  { path: '/docs',       icon: '◇', label: 'Docs IA',    color: '#FF3CAC' },
  { path: '/changes',    icon: '↻', label: 'Mudanças',   color: '#43E8D8' },
  { path: '/tasks',      icon: '◉', label: 'Tarefas',    color: '#FFF176' },
  { path: '/users',      icon: '⊙', label: 'Equipe',     color: '#7EB8FF' },
  { path: '/clients',    icon: '◍', label: 'Clientes',   color: '#FF8C42' },
]

const S = {
  app: { fontFamily: "'DM Mono', 'Courier New', monospace", background: '#080B14', minHeight: '100vh', color: '#E8ECF4', display: 'flex', overflow: 'hidden' },
  sidebar: (open) => ({ width: open ? '220px' : '64px', background: 'linear-gradient(180deg,#0D1220 0%,#080B14 100%)', borderRight: '1px solid #1A2035', display: 'flex', flexDirection: 'column', transition: 'width 0.3s cubic-bezier(.4,0,.2,1)', zIndex: 10, flexShrink: 0 }),
  logoBox: { padding: '20px 16px 16px', borderBottom: '1px solid #1A2035' },
  hex: { width: '32px', height: '32px', flexShrink: 0, background: 'linear-gradient(135deg,#00FFB2,#00C8FF)', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' },
  nav: { flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' },
  main: { flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' },
  topbar: { padding: '16px 28px', borderBottom: '1px solid #1A2035', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0A0E1A', position: 'sticky', top: 0, zIndex: 5 },
  content: { padding: '24px 28px', flex: 1 },
}

export default function Layout({ children }) {
  const [open, setOpen] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { userProfile, logout, isAdmin } = useAuth()
  const current = modules.find(m => m.path === location.pathname) || modules[0]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={S.app}>
      <div style={S.sidebar(open)}>
        <div style={S.logoBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={S.hex} />
            {open && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '2px', color: '#00FFB2' }}>NEXUS</div>
                <div style={{ fontSize: '9px', color: '#4A5568', letterSpacing: '1px' }}>PROJECT OS</div>
              </div>
            )}
          </div>
        </div>
        <nav style={S.nav}>
          {modules.map(m => {
            const active = location.pathname === m.path
            return (
              <button key={m.path} onClick={() => navigate(m.path)} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px',
                borderRadius: '8px', border: 'none', background: active ? `${m.color}18` : 'transparent',
                cursor: 'pointer', borderLeft: active ? `2px solid ${m.color}` : '2px solid transparent', transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: '16px', color: active ? m.color : '#4A5568', flexShrink: 0 }}>{m.icon}</span>
                {open && <span style={{ fontSize: '11px', color: active ? m.color : '#718096', letterSpacing: '0.5px', fontWeight: active ? 'bold' : 'normal' }}>{m.label}</span>}
              </button>
            )
          })}
        </nav>
        <div style={{ padding: '12px 8px', borderTop: '1px solid #1A2035' }}>
          <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: '8px', background: '#1A2035', border: 'none', borderRadius: '6px', color: '#4A5568', cursor: 'pointer', fontSize: '12px' }}>
            {open ? '◂' : '▸'}
          </button>
        </div>
      </div>
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>{current.label}</div>
            <div style={{ fontSize: '10px', color: '#4A5568', marginTop: '2px' }}>
              NEXUS PROJECT OS · {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', position: 'relative' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00FFB2', boxShadow: '0 0 8px #00FFB2' }} />
            <span style={{ fontSize: '11px', color: '#4A5568' }}>SISTEMA ONLINE</span>
            <div 
              style={{ 
                padding: '6px 14px', 
                background: '#1A2035', 
                borderRadius: '20px', 
                fontSize: '11px', 
                color: '#718096', 
                border: '1px solid #2D3748',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span>👤</span>
              <span>{userProfile?.full_name || userProfile?.email || 'Usuário'}</span>
              {isAdmin() && <span style={{ fontSize: '9px', color: '#00FFB2' }}>(ADMIN)</span>}
              <span style={{ fontSize: '10px' }}>▼</span>
            </div>
            
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '8px',
                background: '#1A2035',
                border: '1px solid #2D3748',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                zIndex: 20,
                minWidth: '180px'
              }}>
                {isAdmin() && (
                  <button
                    onClick={() => {
                      navigate('/users/new')
                      setShowUserMenu(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: 'none',
                      background: 'transparent',
                      color: '#00FFB2',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textAlign: 'left',
                      borderRadius: '0'
                    }}
                  >
                    ➕ Criar Usuário
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: isAdmin() ? '1px solid #2D3748' : 'none',
                    borderTop: isAdmin() ? '1px solid #2D3748' : 'none',
                    background: 'transparent',
                    color: '#FF6B6B',
                    cursor: 'pointer',
                    fontSize: '11px',
                    textAlign: 'left',
                    borderRadius: '0'
                  }}
                >
                  🚪 Sair
                </button>
              </div>
            )}
          </div>
        </div>
        <div style={S.content}>{children}</div>
      </div>
    </div>
  )
}
