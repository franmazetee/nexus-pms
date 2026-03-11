import { createContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Verifica se há usuário logado ao carregar
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          // Busca o perfil do usuário
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (error && error.code !== 'PGRST116') {
            console.error('Erro ao buscar perfil:', error)
          }
          if (data) {
            setUserProfile(data)
          }
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          // Busca o perfil quando o usuário faz login
          const { data } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          if (data) {
            setUserProfile(data)
          }
        } else {
          setUser(null)
          setUserProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const register = async (email, password, fullName) => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) throw error

      // Cria o perfil do novo usuário
      if (data.user) {
        await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            is_admin: false,
            created_at: new Date()
          })
      }

      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setUserProfile(null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const isAdmin = () => {
    return userProfile?.is_admin === true
  }

  const value = {
    user,
    userProfile,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
