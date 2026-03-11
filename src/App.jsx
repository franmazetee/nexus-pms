import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import RegisterUser from './pages/RegisterUser.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import ChangeRequests from './pages/ChangeRequests.jsx'
import Versions from './pages/Versions.jsx'
import Tasks from './pages/Tasks.jsx'
import Commercial from './pages/Commercial.jsx'
import Docs from './pages/Docs.jsx'
import ERP from './pages/ERP.jsx'
import Users from './pages/Users.jsx'
import Clients from './pages/Clients.jsx'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Layout>
              <Projects />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/changes"
        element={
          <ProtectedRoute>
            <Layout>
              <ChangeRequests />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/versions"
        element={
          <ProtectedRoute>
            <Layout>
              <Versions />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Layout>
              <Tasks />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/commercial"
        element={
          <ProtectedRoute>
            <Layout>
              <Commercial />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/docs"
        element={
          <ProtectedRoute>
            <Layout>
              <Docs />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/erp"
        element={
          <ProtectedRoute>
            <Layout>
              <ERP />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Layout>
              <Users />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/users/new"
        element={
          <AdminRoute>
            <RegisterUser />
          </AdminRoute>
        }
      />
      
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <Layout>
              <Clients />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
