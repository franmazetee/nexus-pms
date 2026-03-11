import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RegisterUser() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { isAdmin: isCurrentUserAdmin } = useAuth()
  const navigate = useNavigate()

  // Redireciona se não for admin
  if (!isCurrentUserAdmin()) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Opção 1: Usar Edge Function (recomendado)
      const functionUrl = import.meta.env.VITE_SUPABASE_FUNCTION_URL
      
      if (functionUrl) {
        const response = await fetch(`${functionUrl}/create-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email,
            password,
            fullName,
            isAdmin,
          }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Erro ao criar usuário')
        
        setSuccess('Usuário criado com sucesso!')
      } else {
        // Opção 2: Se Edge Function não estiver configurada
        setError('❌ Edge Function não está configurada. Consulte SETUP_AUTH.md para instruções.')
      }

      setEmail('')
      setPassword('')
      setFullName('')
      setIsAdmin(false)
    } catch (err) {
      setError(err.message || 'Erro ao criar usuário')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      fontFamily: "'DM Mono', 'Courier New', monospace",
      background: '#080B14',
      minHeight: '100vh',
      padding: '48px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#E8ECF4'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: '#0A0E1A',
        border: '1px solid #1A2035',
        borderRadius: '8px',
        padding: '32px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
      }}>
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#E8ECF4'
          }}>
            Criar Novo Usuário
          </h2>
          <p style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#718096'
          }}>
            Apenas administradores podem criar novos usuários
          </p>
        </div>

        {error && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#7C2D2D',
            border: '1px solid #C53030',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#FED7D7'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#22543D',
            border: '1px solid #22863A',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#C6EFCE'
          }}>
            {success}
          </div>
        )}

        <form style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleSubmit}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '500',
              color: '#CBD5E0',
              marginBottom: '6px'
            }}>
              Nome Completo
            </label>
            <input
              type="text"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #2D3748',
                borderRadius: '6px',
                background: '#1A2035',
                color: '#E8ECF4',
                fontSize: '12px',
                boxSizing: 'border-box'
              }}
              placeholder="Nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
              Email
            </label>
            <input
              type="email"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #2D3748',
                borderRadius: '6px',
                background: '#1A2035',
                color: '#E8ECF4',
                fontSize: '12px',
                boxSizing: 'border-box'
              }}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #2D3748',
                borderRadius: '6px',
                background: '#1A2035',
                color: '#E8ECF4',
                fontSize: '12px',
                boxSizing: 'border-box'
              }}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p style={{
              marginTop: '6px',
              fontSize: '10px',
              color: '#718096'
            }}>
              O usuário poderá alterar a senha após o primeiro login
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <input
              id="isAdmin"
              type="checkbox"
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer',
                accentColor: '#00FFB2'
              }}
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            <label htmlFor="isAdmin" style={{
              fontSize: '12px',
              color: '#CBD5E0',
              cursor: 'pointer'
            }}>
              Atribuir permissão de administrador
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                background: '#00FFB2',
                color: '#080B14',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Criando...' : 'Criar Usuário'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/users')}
              style={{
                flex: 1,
                padding: '8px 16px',
                border: '1px solid #2D3748',
                borderRadius: '6px',
                background: 'transparent',
                color: '#CBD5E0',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
