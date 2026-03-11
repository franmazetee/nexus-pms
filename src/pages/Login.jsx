import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      fontFamily: "'DM Mono', 'Courier New', monospace",
      background: '#080B14',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      color: '#E8ECF4'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: '#0A0E1A',
        border: '1px solid #1A2035',
        borderRadius: '8px',
        padding: '48px 32px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg,#00FFB2,#00C8FF)',
            clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)'
          }} />
          <div>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              color: '#00FFB2'
            }}>NEXUS</div>
            <div style={{
              fontSize: '10px',
              color: '#718096',
              letterSpacing: '1px'
            }}>PMS LOGIN</div>
          </div>
        </div>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          Bem-vindo ao Nexus
        </h2>
        <p style={{
          fontSize: '12px',
          color: '#718096',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Entre com sua conta
        </p>

        {error && (
          <div style={{
            padding: '12px',
            background: '#7C2D2D',
            border: '1px solid #C53030',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#FED7D7',
            marginBottom: '24px'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }} onSubmit={handleSubmit}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '500',
              color: '#CBD5E0',
              marginBottom: '6px'
            }}>
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #2D3748',
                borderRadius: '6px',
                background: '#1A2035',
                color: '#E8ECF4',
                fontSize: '12px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#00FFB2'}
              onBlur={(e) => e.target.style.borderColor = '#2D3748'}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '500',
              color: '#CBD5E0',
              marginBottom: '6px'
            }}>
              Senha
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #2D3748',
                borderRadius: '6px',
                background: '#1A2035',
                color: '#E8ECF4',
                fontSize: '12px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#00FFB2'}
              onBlur={(e) => e.target.style.borderColor = '#2D3748'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              background: '#00FFB2',
              color: '#080B14',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            {loading ? '⏳ Entrando...' : '🔓 Entrar'}
          </button>
        </form>

        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #2D3748',
          fontSize: '11px',
          color: '#718096',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0 }}>
            Sistema de Gerenciamento de Projetos
          </p>
          <p style={{ margin: '4px 0 0 0' }}>
            © 2024-2026 Nexus PMS
          </p>
        </div>
      </div>
    </div>
  )
}
