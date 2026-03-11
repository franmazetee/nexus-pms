import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { useNavigate } from 'react-router-dom'

const statusColors = { implantação: '#00FFB2', desenvolvimento: '#00C8FF', homologação: '#FFB800', levantamento: '#B44FFF' }
const priorityColors = { crítica: '#FF3C3C', alta: '#FF6B35', média: '#FFB800', baixa: '#00FFB2' }
const changeStatusColors = { pendente: '#FFB800', em_andamento: '#00C8FF', concluído: '#00FFB2' }
const versionTypeColors = { major: '#FF6B35', minor: '#00C8FF', patch: '#00FFB2' }

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{ background: '#0D1220', border: `1px solid ${color}30`, borderRadius: '12px', padding: '20px', borderTop: `2px solid ${color}` }}>
      <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '1px', marginBottom: '12px' }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: '36px', fontWeight: 'bold', color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: '#4A5568', marginTop: '8px' }}>{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [changes, setChanges] = useState([])
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const [{ data: p }, { data: c }, { data: v }] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('change_requests').select('*').order('created_at', { ascending: false }).limit(4),
        supabase.from('version_logs').select('*').order('created_at', { ascending: false }).limit(4),
      ])
      setProjects(p || [])
      setChanges(c || [])
      setVersions(v || [])
      setLoading(false)
    }
    load()
  }, [])

  const active = projects.filter(p => p.status !== 'encerrado').length
  const deploying = projects.filter(p => p.status === 'implantação').length
  const pending = changes.filter(c => c.status === 'pendente').length

  if (loading) return <div style={{ color: '#4A5568', fontSize: '13px' }}>Carregando dados...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
        <StatCard label="Projetos Ativos" value={active} color="#00FFB2" sub="total em andamento" />
        <StatCard label="Em Implantação" value={deploying} color="#00C8FF" sub="aguardando go-live" />
        <StatCard label="Mudanças Pendentes" value={pending} color="#FFB800" sub="aguardam execução" />
        <StatCard label="Versões Registradas" value={versions.length} color="#B44FFF" sub="no histórico" />
      </div>

      {/* Projects Table */}
      <div style={{ background: '#0D1220', border: '1px solid #1A2035', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1A2035', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: '#00C8FF' }}>◈ PROJETOS EM ANDAMENTO</span>
          <button onClick={() => navigate('/projects')} style={{ fontSize: '10px', color: '#4A5568', background: 'none', border: 'none', cursor: 'pointer' }}>ver todos →</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1A2035' }}>
              {['PROJETO', 'CLIENTE', 'STATUS', 'VERSÃO', 'PROGRESSO', 'RESPONSÁVEL', 'PRIORIDADE'].map(h => (
                <th key={h} style={{ padding: '10px 16px', fontSize: '9px', color: '#4A5568', letterSpacing: '1px', textAlign: 'left', fontWeight: 'normal' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #0F1525', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#121828'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => navigate('/projects')}>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: '#E8ECF4', fontWeight: 'bold' }}>{p.name}</td>
                <td style={{ padding: '12px 16px', fontSize: '11px', color: '#718096' }}>{p.client}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '9px', background: `${statusColors[p.status]}18`, color: statusColors[p.status], border: `1px solid ${statusColors[p.status]}40` }}>
                    {p.status?.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '11px', color: '#B44FFF', fontFamily: 'monospace' }}>{p.version}</td>
                <td style={{ padding: '12px 16px', minWidth: '120px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '4px', background: '#1A2035', borderRadius: '2px' }}>
                      <div style={{ width: `${p.progress}%`, height: '100%', borderRadius: '2px', background: 'linear-gradient(90deg,#00FFB2,#00C8FF)' }} />
                    </div>
                    <span style={{ fontSize: '10px', color: '#718096', minWidth: '28px' }}>{p.progress}%</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '11px', color: '#718096' }}>{p.owner}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '10px', color: priorityColors[p.priority] }}>● {p.priority}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: '#0D1220', border: '1px solid #1A2035', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #1A2035', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#FFB800', letterSpacing: '1px' }}>↻ MUDANÇAS RECENTES</span>
            <button onClick={() => navigate('/changes')} style={{ fontSize: '10px', color: '#4A5568', background: 'none', border: 'none', cursor: 'pointer' }}>ver todas →</button>
          </div>
          {changes.map((c) => (
            <div key={c.id} style={{ padding: '12px 18px', borderBottom: '1px solid #0F1525', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#4A5568', fontFamily: 'monospace', marginBottom: '4px' }}>{c.cr_number}</div>
                <div style={{ fontSize: '11px', color: '#E8ECF4', maxWidth: '240px', lineHeight: 1.4 }}>{c.description?.substring(0, 50)}...</div>
                <div style={{ fontSize: '10px', color: '#4A5568', marginTop: '4px' }}>{c.system_name}</div>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '9px', background: `${changeStatusColors[c.status]}18`, color: changeStatusColors[c.status], flexShrink: 0, marginLeft: '8px' }}>
                {c.status?.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>

        <div style={{ background: '#0D1220', border: '1px solid #1A2035', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #1A2035', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#B44FFF', letterSpacing: '1px' }}>⊕ LOG DE VERSÕES</span>
            <button onClick={() => navigate('/versions')} style={{ fontSize: '10px', color: '#4A5568', background: 'none', border: 'none', cursor: 'pointer' }}>ver todos →</button>
          </div>
          {versions.map((v) => (
            <div key={v.id} style={{ padding: '12px 18px', borderBottom: '1px solid #0F1525', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontFamily: 'monospace', background: `${versionTypeColors[v.type]}20`, color: versionTypeColors[v.type], flexShrink: 0 }}>
                {v.type?.toUpperCase()}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '11px', color: '#E8ECF4' }}>{v.system_name}</div>
                <div style={{ fontSize: '10px', color: '#4A5568' }}>{v.notes?.substring(0, 40)}...</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '11px', color: '#B44FFF', fontFamily: 'monospace' }}>{v.version}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
