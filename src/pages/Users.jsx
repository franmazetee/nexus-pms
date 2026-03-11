import { useState, useEffect } from 'react'
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../services/team.js'

const statusColors = { ativo: '#00FFB2', inativo: '#4A5568', ferias: '#FFB800', afastado: '#FF6B35' }
const typeColors = { funcionario: '#00C8FF', freelancer: '#B44FFF', socio: '#FF3CAC', admin: '#FF3C3C' }
const typeLabels = { funcionario: 'Funcionário', freelancer: 'Freelancer', socio: 'Sócio', admin: 'Admin' }
const statusLabels = { ativo: 'Ativo', inativo: 'Inativo', ferias: 'Férias', afastado: 'Afastado' }

const emptyMember = () => ({ name: '', email: '', role: '', department: '', phone: '', status: 'ativo', type: 'funcionario', hire_date: '', notes: '' })

export default function Users() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyMember())
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    try { setMembers(await getTeamMembers()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    const data = { ...form, hire_date: form.hire_date || null }
    try {
      if (editing) await updateTeamMember(editing, data)
      else await createTeamMember(data)
      setShowForm(false); setForm(emptyMember()); setEditing(null); load()
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  function openEdit(m) {
    setForm({ name: m.name, email: m.email || '', role: m.role || '', department: m.department || '', phone: m.phone || '', status: m.status || 'ativo', type: m.type || 'funcionario', hire_date: m.hire_date || '', notes: m.notes || '' })
    setEditing(m.id); setShowForm(true)
  }

  function openNew() { setForm(emptyMember()); setEditing(null); setShowForm(true) }

  async function remove(id) {
    if (!confirm('Remover este membro da equipe?')) return
    try { await deleteTeamMember(id); load() }
    catch (e) { setError(e.message) }
  }

  const inp = (field, label, type, opts) => (
    <div>
      <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '1px', marginBottom: '6px' }}>{label}</div>
      {opts ? (
        <select value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} style={inpStyle}>
          {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} rows={2} style={{ ...inpStyle, resize: 'vertical' }} />
      ) : (
        <input type={type || 'text'} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} style={inpStyle} />
      )}
    </div>
  )

  if (loading) return <div style={{ color: '#4A5568', fontSize: '13px' }}>Carregando equipe...</div>
  if (error) return <div style={{ color: '#FF3C3C', fontSize: '13px' }}>Erro: {error}</div>

  const active = members.filter(m => m.status === 'ativo').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', color: '#7EB8FF' }}>{members.length} membros cadastrados · {active} ativos</div>
        <button onClick={openNew} style={btnPrimary}>+ NOVO MEMBRO</button>
      </div>

      {showForm && (
        <div style={{ background: '#0D1220', border: '1px solid #7EB8FF40', borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#7EB8FF', letterSpacing: '1px', marginBottom: '20px' }}>
            {editing ? 'EDITAR MEMBRO' : '+ NOVO MEMBRO DA EQUIPE'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {inp('name', 'NOME COMPLETO')}
            {inp('email', 'EMAIL', 'email')}
            {inp('role', 'CARGO / FUNÇÃO')}
            {inp('department', 'DEPARTAMENTO')}
            {inp('phone', 'TELEFONE')}
            {inp('hire_date', 'DATA DE ADMISSÃO', 'date')}
            {inp('type', 'TIPO', null, [['funcionario','Funcionário'],['freelancer','Freelancer'],['socio','Sócio'],['admin','Admin']])}
            {inp('status', 'STATUS', null, [['ativo','Ativo'],['inativo','Inativo'],['ferias','Férias'],['afastado','Afastado']])}
          </div>
          <div style={{ marginTop: '12px' }}>{inp('notes', 'OBSERVAÇÕES', 'textarea')}</div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Salvando...' : 'SALVAR'}</button>
            <button onClick={() => setShowForm(false)} style={btnSecondary}>CANCELAR</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
        {members.map(m => (
          <div key={m.id} style={{ background: '#0D1220', border: '1px solid #1A2035', borderRadius: '12px', padding: '18px', borderTop: '2px solid ' + (statusColors[m.status] || '#4A5568') }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#E8ECF4' }}>{m.name}</div>
                <div style={{ fontSize: '11px', color: '#718096', marginTop: '2px' }}>{m.role || '—'}</div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '9px', background: (typeColors[m.type] || '#4A5568') + '18', color: typeColors[m.type] || '#4A5568' }}>{typeLabels[m.type] || m.type}</span>
                <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '9px', background: (statusColors[m.status] || '#4A5568') + '18', color: statusColors[m.status] || '#4A5568' }}>{statusLabels[m.status] || m.status}</span>
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#4A5568', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {m.department && <span>🏢 {m.department}</span>}
              {m.email && <span>✉ {m.email}</span>}
              {m.phone && <span>📞 {m.phone}</span>}
              {m.hire_date && <span>📅 Desde {m.hire_date}</span>}
              {m.notes && <span style={{ marginTop: '4px' }}>{m.notes}</span>}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button onClick={() => openEdit(m)} style={btnSecondary}>✏ Editar</button>
              <button onClick={() => remove(m.id)} style={{ ...btnSecondary, color: '#FF3C3C', borderColor: '#FF3C3C40' }}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && !showForm && (
        <div style={{ color: '#4A5568', fontSize: '13px', textAlign: 'center', padding: '40px' }}>Nenhum membro cadastrado ainda.</div>
      )}
    </div>
  )
}

const inpStyle = { width: '100%', background: '#121828', border: '1px solid #2D3748', borderRadius: '6px', padding: '9px 12px', color: '#E8ECF4', fontSize: '12px', fontFamily: 'inherit', outline: 'none' }
const btnPrimary = { padding: '9px 20px', background: 'linear-gradient(135deg,#7EB8FF,#00C8FF)', border: 'none', borderRadius: '7px', fontSize: '11px', fontWeight: 'bold', color: '#080B14', cursor: 'pointer', letterSpacing: '1px' }
const btnSecondary = { padding: '8px 14px', background: '#1A2035', border: '1px solid #2D3748', borderRadius: '7px', fontSize: '10px', color: '#718096', cursor: 'pointer' }
