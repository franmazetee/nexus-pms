import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const priorityColors = { crítica: '#FF3C3C', alta: '#FF6B35', média: '#FFB800', baixa: '#00FFB2' }
const statusColors = { pendente: '#FFB800', em_andamento: '#00C8FF', concluído: '#00FFB2', cancelado: '#4A5568' }

function genCrNumber() {
  return `CR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`
}

const empty = () => ({ cr_number: genCrNumber(), project_id: null, system_name: '', type: 'personalização', description: '', priority: 'média', assigned_to: '', status: 'pendente', notes: '' })

export default function ChangeRequests() {
  const [crs, setCrs] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty())
  const [editing, setEditing] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('todos')
  const [saveError, setSaveError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const [{ data: crData }, { data: projData }] = await Promise.all([
      supabase.from('change_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('id,name,client').order('name'),
    ])
    setCrs(crData || [])
    setProjects(projData || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    if (!form.project_id) { setSaveError('Selecione um projeto antes de salvar.'); return }
    if (!form.description.trim()) { setSaveError('Preencha a descrição da mudança.'); return }
    setSaving(true); setSaveError(null)
    const { error } = editing
      ? await supabase.from('change_requests').update({ ...form, updated_at: new Date() }).eq('id', editing)
      : await supabase.from('change_requests').insert(form)
    setSaving(false)
    if (error) { setSaveError(error.message); return }
    setShowForm(false); setForm(empty()); setEditing(null); load()
  }

  async function updateStatus(id, status) {
    await supabase.from('change_requests').update({ status, updated_at: new Date() }).eq('id', id)
    load()
  }

  function openEdit(c) {
    setForm({ cr_number: c.cr_number, project_id: c.project_id || null, system_name: c.system_name, type: c.type, description: c.description, priority: c.priority, assigned_to: c.assigned_to || '', status: c.status, notes: c.notes || '' })
    setEditing(c.id); setShowForm(true)
  }

  function openNew() {
    setForm(empty()); setEditing(null); setShowForm(true)
  }

  const filtered = filter === 'todos' ? crs : crs.filter(c => c.status === filter || c.priority === filter)

  const inp = (field, label, type = 'text', opts = null, disabled = false) => (
    <div>
      <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '1px', marginBottom: '6px' }}>{label}</div>
      {opts ? (
        <select value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} style={inpStyle} disabled={disabled}>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} rows={3} style={{ ...inpStyle, resize: 'vertical' }} disabled={disabled} />
      ) : (
        <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} style={{ ...inpStyle, ...(disabled ? { color: '#43E8D8', cursor: 'default', opacity: 0.8 } : {}) }} disabled={disabled} />
      )}
    </div>
  )

  if (loading) return <div style={{ color: '#4A5568', fontSize: '13px' }}>Carregando...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '13px', color: '#43E8D8' }}>Cada mudança rastreada — de um botão ao sistema inteiro.</div>
          <div style={{ fontSize: '11px', color: '#4A5568', marginTop: '4px' }}>{crs.length} registros · {crs.filter(c => c.status === 'pendente').length} pendentes</div>
        </div>
        <button onClick={openNew} style={btnPrimary}>+ NOVA MUDANÇA</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[['todos', 'Todos'], ['pendente', 'Pendentes'], ['em_andamento', 'Em Andamento'], ['concluído', 'Concluídos'], ['crítica', 'Críticos']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            padding: '6px 14px', background: filter === val ? '#43E8D820' : '#1A2035',
            border: filter === val ? '1px solid #43E8D8' : '1px solid #2D3748',
            borderRadius: '20px', fontSize: '10px', color: filter === val ? '#43E8D8' : '#718096', cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: '#0D1220', border: '1px solid #43E8D840', borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#43E8D8', letterSpacing: '1px', marginBottom: '20px' }}>
            {editing ? '✏ EDITAR MUDANÇA' : '+ NOVA SOLICITAÇÃO DE MUDANÇA'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {inp('cr_number', 'NÚMERO CR', 'text', null, true)}
            <div>
              <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '1px', marginBottom: '6px' }}>SISTEMA / PROJETO</div>
              <select
                value={form.project_id || ''}
                onChange={e => {
                  const proj = projects.find(p => p.id === e.target.value)
                  setForm({ ...form, project_id: proj?.id || null, system_name: proj ? `${proj.name} — ${proj.client}` : '' })
                }}
                style={inpStyle}
              >
                <option value=''>— Selecione um projeto —</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — {p.client}</option>
                ))}
              </select>
            </div>
            {inp('type', 'TIPO', 'text', ['personalização', 'funcionalidade', 'correção', 'melhoria', 'implantação'])}
            {inp('priority', 'PRIORIDADE', 'text', ['baixa', 'média', 'alta', 'crítica'])}
            {inp('assigned_to', 'RESPONSÁVEL PELA TAREFA')}
            {inp('status', 'STATUS', 'text', ['pendente', 'em_andamento', 'concluído', 'cancelado'])}
          </div>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {inp('description', 'DESCRIÇÃO DA MUDANÇA', 'textarea')}
            {inp('notes', 'OBSERVAÇÕES / RETORNO', 'textarea')}
          </div>
          {saveError && (
            <div style={{ marginTop: '14px', padding: '10px 14px', background: '#FF3C3C18', border: '1px solid #FF3C3C60', borderRadius: '6px', fontSize: '11px', color: '#FF3C3C' }}>
              {saveError}
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Salvando...' : 'SALVAR'}</button>
            <button onClick={() => { setShowForm(false); setSaveError(null) }} style={btnSecondary}>CANCELAR</button>
          </div>
        </div>
      )}

      {/* CR Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(c => (
          <div key={c.id} style={{ background: '#0D1220', border: `1px solid ${expanded === c.id ? '#43E8D840' : '#1A2035'}`, borderRadius: '12px', overflow: 'hidden', borderLeft: `3px solid ${priorityColors[c.priority]}` }}>
            <div onClick={() => setExpanded(expanded === c.id ? null : c.id)}
              style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#43E8D8', flexShrink: 0, minWidth: '110px' }}>{c.cr_number}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: '#E8ECF4', marginBottom: '4px' }}>{c.description}</div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#4A5568' }}>
                  <span>🖥 {c.system_name}</span>
                  <span>🏷 {c.type}</span>
                  {c.assigned_to && <span>👤 {c.assigned_to}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '9px', background: `${priorityColors[c.priority]}18`, color: priorityColors[c.priority], border: `1px solid ${priorityColors[c.priority]}40` }}>{c.priority?.toUpperCase()}</span>
                <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '9px', background: `${statusColors[c.status]}18`, color: statusColors[c.status] }}>{c.status?.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>

            {expanded === c.id && (
              <div style={{ padding: '0 20px 20px', borderTop: '1px solid #1A2035' }}>
                {c.notes && (
                  <div style={{ marginTop: '14px', padding: '12px 16px', background: '#121828', borderRadius: '8px', borderLeft: '2px solid #43E8D8' }}>
                    <div style={{ fontSize: '9px', color: '#43E8D8', letterSpacing: '1px', marginBottom: '6px' }}>RETORNO / OBSERVAÇÕES</div>
                    <div style={{ fontSize: '12px', color: '#E8ECF4' }}>{c.notes}</div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                  {c.status === 'pendente' && (
                    <button onClick={() => updateStatus(c.id, 'em_andamento')} style={{ ...btnPrimary, background: 'linear-gradient(135deg,#00C8FF,#43E8D8)' }}>▶ INICIAR TAREFA</button>
                  )}
                  {c.status === 'em_andamento' && (
                    <button onClick={() => updateStatus(c.id, 'concluído')} style={{ ...btnPrimary, background: 'linear-gradient(135deg,#00FFB2,#43E8D8)' }}>✓ MARCAR CONCLUÍDO</button>
                  )}
                  <button onClick={() => openEdit(c)} style={btnSecondary}>✏ Editar</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div style={{ color: '#4A5568', fontSize: '13px', padding: '20px', textAlign: 'center' }}>Nenhuma mudança encontrada.</div>}
      </div>
    </div>
  )
}

const inpStyle = { width: '100%', background: '#121828', border: '1px solid #2D3748', borderRadius: '6px', padding: '9px 12px', color: '#E8ECF4', fontSize: '12px', fontFamily: 'inherit', outline: 'none' }
const btnPrimary = { padding: '9px 20px', background: 'linear-gradient(135deg,#43E8D8,#00C8FF)', border: 'none', borderRadius: '7px', fontSize: '11px', fontWeight: 'bold', color: '#080B14', cursor: 'pointer', letterSpacing: '1px' }
const btnSecondary = { padding: '8px 14px', background: '#1A2035', border: '1px solid #2D3748', borderRadius: '7px', fontSize: '10px', color: '#718096', cursor: 'pointer' }
