import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />
  }

  return children
}
