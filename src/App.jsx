import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
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
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/changes" element={<ChangeRequests />} />
        <Route path="/versions" element={<Versions />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/commercial" element={<Commercial />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/erp" element={<ERP />} />
        <Route path="/users" element={<Users />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}
