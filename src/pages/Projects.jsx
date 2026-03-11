import { useState, useEffect } from 'react'
import { getProjects, createProject, updateProject, deleteProject } from '../services/projects.js'

const statusColors = { implantação: '#00FFB2', desenvolvimento: '#00C8FF', homologação: '#FFB800', levantamento: '#B44FFF', encerrado: '#4A5568' }
const priorityColors = { crítica: '#FF3C3C', alta: '#FF6B35', média: '#FFB800', baixa: '#00FFB2' }

const empty = { name: '', client: '', status: 'levantamento', version: 'v0.1.0', progress: 0, owner: '', priority: 'média', description: '', stack: '' }

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    try {
      setProjects(await getProjects())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    try {
      if (editing) {
        await updateProject(editing, form)
      } else {
        await createProject(form)
      }
      setShowForm(false)
      setForm(empty)
      setEditing(null)
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  function openEdit(p) {
    setForm({ name: p.name, client: p.client, status: p.status, version: p.version, progress: p.progress, owner: p.owner || '', priority: p.priority, description: p.description || '', stack: p.stack || '' })
    setEditing(p.id)
    setShowForm(true)
  }

  async function remove(id) {
    if (!confirm('Remover este projeto?')) return
    try {
      await deleteProject(id)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const inp = (field, label, type = 'text', opts = null) => (
    <div>
      <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '1px', marginBottom: '6px' }}>{label}</div>
      {opts ? (
        <select value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} style={inpStyle}>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} rows={3} style={{ ...inpStyle, resize: 'vertical' }} />
      ) : (
        <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: type === 'number' ? Number(e.target.value) : e.target.value })} style={inpStyle} />
      )}
    </div>
  )

  if (loading) return <div style={{ color: '#4A5568', fontSize: '13px' }}>Carregando projetos...</div>
  if (error) return <div style={{ color: '#FF3C3C', fontSize: '13px' }}>Erro: {error}</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', color: '#00C8FF' }}>{projects.length} projetos cadastrados</div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true) }} style={btnPrimary}>+ NOVO PROJETO</button>
      </div>

      {showForm && (
        <div style={{ background: '#0D1220', border: '1px solid #00C8FF40', borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#00C8FF', letterSpacing: '1px', marginBottom: '20px' }}>
            {editing ? '✏ EDITAR PROJETO' : '+ NOVO PROJETO'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {inp('name', 'NOME DO PROJETO')}
            {inp('client', 'CLIENTE')}
            {inp('owner', 'RESPONSÁVEL')}
            {inp('version', 'VERSÃO ATUAL')}
            {inp('status', 'STATUS', 'text', ['levantamento', 'desenvolvimento', 'homologação', 'implantação', 'encerrado'])}
            {inp('priority', 'PRIORIDADE', 'text', ['baixa', 'média', 'alta', 'crítica'])}
            {inp('progress', 'PROGRESSO (%)', 'number')}
            {inp('stack', 'STACK / TECNOLOGIAS')}
          </div>
          <div style={{ marginTop: '16px' }}>{inp('description', 'DESCRIÇÃO', 'textarea')}</div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Salvando...' : 'SALVAR'}</button>
            <button onClick={() => setShowForm(false)} style={btnSecondary}>CANCELAR</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {projects.map(p => (
          <div key={p.id} style={{ background: '#0D1220', border: '1px solid #1A2035', borderRadius: '12px', padding: '18px 20px', borderLeft: `3px solid ${statusColors[p.status] || '#4A5568'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#E8ECF4' }}>{p.name}</span>
                  <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '9px', background: `${statusColors[p.status]}18`, color: statusColors[p.status], border: `1px solid ${statusColors[p.status]}40` }}>{p.status?.toUpperCase()}</span>
                  <span style={{ fontSize: '11px', color: '#B44FFF', fontFamily: 'monospace' }}>{p.version}</span>
                  <span style={{ fontSize: '10px', color: priorityColors[p.priority] }}>● {p.priority}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#718096', marginBottom: '10px' }}>
                  {p.client} {p.owner && `· ${p.owner}`} {p.stack && `· ${p.stack}`}
                </div>
                {p.description && <div style={{ fontSize: '11px', color: '#4A5568', marginBottom: '10px' }}>{p.description}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '200px', height: '5px', background: '#1A2035', borderRadius: '3px' }}>
                    <div style={{ width: `${p.progress}%`, height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg,#00FFB2,#00C8FF)' }} />
                  </div>
                  <span style={{ fontSize: '11px', color: '#718096' }}>{p.progress}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '16px' }}>
                <button onClick={() => openEdit(p)} style={btnSecondary}>✏ Editar</button>
                <button onClick={() => remove(p.id)} style={{ ...btnSecondary, color: '#FF3C3C', borderColor: '#FF3C3C40' }}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const inpStyle = { width: '100%', background: '#121828', border: '1px solid #2D3748', borderRadius: '6px', padding: '9px 12px', color: '#E8ECF4', fontSize: '12px', fontFamily: 'inherit', outline: 'none' }
const btnPrimary = { padding: '9px 20px', background: 'linear-gradient(135deg,#00FFB2,#00C8FF)', border: 'none', borderRadius: '7px', fontSize: '11px', fontWeight: 'bold', color: '#080B14', cursor: 'pointer', letterSpacing: '1px' }
const btnSecondary = { padding: '8px 14px', background: '#1A2035', border: '1px solid #2D3748', borderRadius: '7px', fontSize: '10px', color: '#718096', cursor: 'pointer' }
