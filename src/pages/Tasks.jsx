import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const priorityColors = { crítica: '#FF3C3C', alta: '#FF6B35', média: '#FFB800', baixa: '#00FFB2' }
const statusColors = { pendente: '#FFB800', em_andamento: '#00C8FF', concluído: '#00FFB2', cancelado: '#4A5568' }
const empty = { title: '', description: '', assigned_to: '', status: 'pendente', priority: 'média', due_date: '', hours_estimated: '' }

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)

  async function load() {
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
    setTasks(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    await supabase.from('tasks').insert({ ...form, hours_estimated: form.hours_estimated ? Number(form.hours_estimated) : null })
    setShowForm(false); setForm(empty); load()
  }

  async function updateStatus(id, status) {
    await supabase.from('tasks').update({ status }).eq('id', id)
    load()
  }

  const inp = (field, label, type = 'text', opts = null) => (
    <div>
      <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '1px', marginBottom: '6px' }}>{label}</div>
      {opts ? (
        <select value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} style={inpStyle}>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} rows={2} style={{ ...inpStyle, resize: 'vertical' }} />
      ) : (
        <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} style={inpStyle} />
      )}
    </div>
  )

  const cols = ['pendente', 'em_andamento', 'concluído']

  if (loading) return <div style={{ color: '#4A5568', fontSize: '13px' }}>Carregando...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', color: '#FFF176' }}>{tasks.length} tarefas · {tasks.filter(t => t.status === 'em_andamento').length} em andamento</div>
        <button onClick={() => { setForm(empty); setShowForm(true) }} style={btnPrimary}>+ NOVA TAREFA</button>
      </div>

      {showForm && (
        <div style={{ background: '#0D1220', border: '1px solid #FFF17640', borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#FFF176', letterSpacing: '1px', marginBottom: '20px' }}>◉ NOVA TAREFA</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {inp('title', 'TÍTULO DA TAREFA')}
            {inp('assigned_to', 'RESPONSÁVEL')}
            {inp('priority', 'PRIORIDADE', 'text', ['baixa', 'média', 'alta', 'crítica'])}
            {inp('status', 'STATUS', 'text', ['pendente', 'em_andamento', 'concluído', 'cancelado'])}
            {inp('due_date', 'PRAZO', 'date')}
            {inp('hours_estimated', 'HORAS ESTIMADAS', 'number')}
          </div>
          <div style={{ marginTop: '12px' }}>{inp('description', 'DESCRIÇÃO', 'textarea')}</div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button onClick={save} style={btnPrimary}>SALVAR</button>
            <button onClick={() => setShowForm(false)} style={btnSecondary}>CANCELAR</button>
          </div>
        </div>
      )}

      {/* Kanban */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        {cols.map(col => (
          <div key={col} style={{ background: '#0D1220', border: '1px solid #1A2035', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #1A2035', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: statusColors[col], letterSpacing: '1px', fontWeight: 'bold' }}>{col.replace('_', ' ').toUpperCase()}</span>
              <span style={{ fontSize: '11px', color: '#4A5568' }}>{tasks.filter(t => t.status === col).length}</span>
            </div>
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '200px' }}>
              {tasks.filter(t => t.status === col).map(t => (
                <div key={t.id} style={{ background: '#121828', border: `1px solid ${priorityColors[t.priority]}30`, borderRadius: '8px', padding: '12px', borderLeft: `2px solid ${priorityColors[t.priority]}` }}>
                  <div style={{ fontSize: '12px', color: '#E8ECF4', marginBottom: '6px', fontWeight: 'bold' }}>{t.title}</div>
                  {t.description && <div style={{ fontSize: '10px', color: '#4A5568', marginBottom: '8px' }}>{t.description}</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#718096' }}>{t.assigned_to || '—'}</span>
                    <span style={{ fontSize: '9px', color: priorityColors[t.priority] }}>● {t.priority}</span>
                  </div>
                  {t.due_date && <div style={{ fontSize: '9px', color: '#4A5568', marginTop: '6px' }}>📅 {t.due_date}</div>}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                    {col === 'pendente' && <button onClick={() => updateStatus(t.id, 'em_andamento')} style={{ ...btnMini, color: '#00C8FF', borderColor: '#00C8FF40' }}>▶ Iniciar</button>}
                    {col === 'em_andamento' && <button onClick={() => updateStatus(t.id, 'concluído')} style={{ ...btnMini, color: '#00FFB2', borderColor: '#00FFB240' }}>✓ Concluir</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const inpStyle = { width: '100%', background: '#121828', border: '1px solid #2D3748', borderRadius: '6px', padding: '9px 12px', color: '#E8ECF4', fontSize: '12px', fontFamily: 'inherit', outline: 'none' }
const btnPrimary = { padding: '9px 20px', background: 'linear-gradient(135deg,#FFF176,#FFB800)', border: 'none', borderRadius: '7px', fontSize: '11px', fontWeight: 'bold', color: '#080B14', cursor: 'pointer', letterSpacing: '1px' }
const btnSecondary = { padding: '8px 14px', background: '#1A2035', border: '1px solid #2D3748', borderRadius: '7px', fontSize: '10px', color: '#718096', cursor: 'pointer' }
const btnMini = { padding: '4px 10px', background: 'transparent', border: '1px solid #2D3748', borderRadius: '5px', fontSize: '9px', cursor: 'pointer' }
