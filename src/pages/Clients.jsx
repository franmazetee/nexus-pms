import { useState, useEffect } from 'react'
import { getClients, createClient, updateClient, deleteClient, getClientLeads, createClientLead, updateClientLead, deleteClientLead } from '../services/clients.js'

const clientStatusColors = { ativo: '#00FFB2', inativo: '#4A5568', suspenso: '#FFB800' }
const visitStatusColors = { agendada: '#00C8FF', realizada: '#00FFB2', cancelada: '#4A5568', convertido: '#B44FFF' }

const emptyClient = () => ({ name: '', contact_name: '', email: '', phone: '', status: 'ativo', contract_value: '', contract_start: '', contract_end: '', notes: '' })
const emptyLead = () => ({ company_name: '', contact_name: '', email: '', phone: '', visit_date: '', visit_status: 'agendada', interest: '', notes: '' })

export default function Clients() {
  const [tab, setTab] = useState('clients')
  const [clients, setClients] = useState([])
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyClient())
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    try {
      const [c, l] = await Promise.all([getClients(), getClientLeads()])
      setClients(c); setLeads(l)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function switchTab(t) {
    setTab(t); setShowForm(false); setEditing(null)
    setForm(t === 'clients' ? emptyClient() : emptyLead())
  }

  async function save() {
    setSaving(true)
    try {
      if (tab === 'clients') {
        const data = {
          ...form,
          contract_value: form.contract_value ? Number(form.contract_value) : null,
          contract_start: form.contract_start || null,
          contract_end: form.contract_end || null,
        }
        if (editing) await updateClient(editing, data)
        else await createClient(data)
        setForm(emptyClient())
      } else {
        const data = { ...form, visit_date: form.visit_date || null }
        if (editing) await updateClientLead(editing, data)
        else await createClientLead(data)
        setForm(emptyLead())
      }
      setShowForm(false); setEditing(null); load()
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  function openEdit(item) {
    if (tab === 'clients') {
      setForm({ name: item.name, contact_name: item.contact_name || '', email: item.email || '', phone: item.phone || '', status: item.status || 'ativo', contract_value: item.contract_value || '', contract_start: item.contract_start || '', contract_end: item.contract_end || '', notes: item.notes || '' })
    } else {
      setForm({ company_name: item.company_name, contact_name: item.contact_name || '', email: item.email || '', phone: item.phone || '', visit_date: item.visit_date || '', visit_status: item.visit_status || 'agendada', interest: item.interest || '', notes: item.notes || '' })
    }
    setEditing(item.id); setShowForm(true)
  }

  function openNew() {
    setForm(tab === 'clients' ? emptyClient() : emptyLead())
    setEditing(null); setShowForm(true)
  }

  async function remove(id) {
    if (!confirm('Remover este registro?')) return
    try {
      if (tab === 'clients') await deleteClient(id)
      else await deleteClientLead(id)
      load()
    } catch (e) { setError(e.message) }
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

  if (loading) return <div style={{ color: '#4A5568', fontSize: '13px' }}>Carregando...</div>
  if (error) return <div style={{ color: '#FF3C3C', fontSize: '13px' }}>Erro: {error}</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Abas */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button onClick={() => switchTab('clients')} style={{ padding: '8px 20px', background: tab === 'clients' ? '#FF8C4220' : '#1A2035', border: tab === 'clients' ? '1px solid #FF8C42' : '1px solid #2D3748', borderRadius: '8px', fontSize: '11px', color: tab === 'clients' ? '#FF8C42' : '#718096', cursor: 'pointer', fontWeight: tab === 'clients' ? 'bold' : 'normal' }}>
          CLIENTES ({clients.length})
        </button>
        <button onClick={() => switchTab('leads')} style={{ padding: '8px 20px', background: tab === 'leads' ? '#00C8FF20' : '#1A2035', border: tab === 'leads' ? '1px solid #00C8FF' : '1px solid #2D3748', borderRadius: '8px', fontSize: '11px', color: tab === 'leads' ? '#00C8FF' : '#718096', cursor: 'pointer', fontWeight: tab === 'leads' ? 'bold' : 'normal' }}>
          PRE-CADASTROS / VISITAS ({leads.length})
        </button>
        <div style={{ flex: 1 }} />
        <button onClick={openNew} style={btnPrimary}>+ {tab === 'clients' ? 'NOVO CLIENTE' : 'NOVA VISITA'}</button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div style={{ background: '#0D1220', border: '1px solid #FF8C4240', borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#FF8C42', letterSpacing: '1px', marginBottom: '20px' }}>
            {editing ? 'EDITAR' : '+'} {tab === 'clients' ? 'CLIENTE' : 'PRE-CADASTRO / VISITA TECNICA'}
          </div>

          {tab === 'clients' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {inp('name', 'NOME DA EMPRESA')}
                {inp('contact_name', 'NOME DO CONTATO')}
                {inp('email', 'EMAIL', 'email')}
                {inp('phone', 'TELEFONE')}
                {inp('status', 'STATUS', null, [['ativo','Ativo'],['inativo','Inativo'],['suspenso','Suspenso']])}
                {inp('contract_value', 'VALOR DO CONTRATO (R$)', 'number')}
                {inp('contract_start', 'INICIO DO CONTRATO', 'date')}
                {inp('contract_end', 'FIM DO CONTRATO', 'date')}
              </div>
              <div style={{ marginTop: '12px' }}>{inp('notes', 'OBSERVACOES', 'textarea')}</div>
            </>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {inp('company_name', 'EMPRESA')}
                {inp('contact_name', 'NOME DO CONTATO')}
                {inp('email', 'EMAIL', 'email')}
                {inp('phone', 'TELEFONE')}
                {inp('visit_date', 'DATA DA VISITA', 'date')}
                {inp('visit_status', 'STATUS DA VISITA', null, [['agendada','Agendada'],['realizada','Realizada'],['cancelada','Cancelada'],['convertido','Convertido em Cliente']])}
                {inp('interest', 'INTERESSE / PRODUTO')}
              </div>
              <div style={{ marginTop: '12px' }}>{inp('notes', 'OBSERVACOES', 'textarea')}</div>
            </>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Salvando...' : 'SALVAR'}</button>
            <button onClick={() => setShowForm(false)} style={btnSecondary}>CANCELAR</button>
          </div>
        </div>
      )}

      {/* Lista Clientes */}
      {tab === 'clients' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {clients.map(c => (
            <div key={c.id} style={{ background: '#0D1220', border: '1px solid #1A2035', borderRadius: '12px', padding: '18px 20px', borderLeft: '3px solid ' + (clientStatusColors[c.status] || '#4A5568') }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#E8ECF4' }}>{c.name}</span>
                    <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '9px', background: (clientStatusColors[c.status] || '#4A5568') + '18', color: clientStatusColors[c.status] || '#4A5568' }}>{c.status?.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#718096', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {c.contact_name && <span>👤 {c.contact_name}</span>}
                    {c.email && <span>✉ {c.email}</span>}
                    {c.phone && <span>📞 {c.phone}</span>}
                    {c.contract_value && <span style={{ color: '#00FFB2' }}>💰 R$ {Number(c.contract_value).toLocaleString('pt-BR')}</span>}
                  </div>
                  {(c.contract_start || c.contract_end) && (
                    <div style={{ fontSize: '10px', color: '#4A5568', marginTop: '6px' }}>
                      Contrato: {c.contract_start || '—'} até {c.contract_end || 'indeterminado'}
                    </div>
                  )}
                  {c.notes && <div style={{ fontSize: '10px', color: '#4A5568', marginTop: '4px' }}>{c.notes}</div>}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '16px' }}>
                  <button onClick={() => openEdit(c)} style={btnSecondary}>✏ Editar</button>
                  <button onClick={() => remove(c.id)} style={{ ...btnSecondary, color: '#FF3C3C', borderColor: '#FF3C3C40' }}>✕</button>
                </div>
              </div>
            </div>
          ))}
          {clients.length === 0 && <div style={{ color: '#4A5568', fontSize: '13px', textAlign: 'center', padding: '40px' }}>Nenhum cliente cadastrado.</div>}
        </div>
      )}

      {/* Lista Pré-Cadastros */}
      {tab === 'leads' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {leads.map(l => (
            <div key={l.id} style={{ background: '#0D1220', border: '1px solid #1A2035', borderRadius: '12px', padding: '18px 20px', borderLeft: '3px solid ' + (visitStatusColors[l.visit_status] || '#4A5568') }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#E8ECF4' }}>{l.company_name}</span>
                    <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '9px', background: (visitStatusColors[l.visit_status] || '#4A5568') + '18', color: visitStatusColors[l.visit_status] || '#4A5568' }}>{l.visit_status?.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#718096', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {l.contact_name && <span>👤 {l.contact_name}</span>}
                    {l.email && <span>✉ {l.email}</span>}
                    {l.phone && <span>📞 {l.phone}</span>}
                    {l.visit_date && <span>📅 Visita: {l.visit_date}</span>}
                    {l.interest && <span>💡 {l.interest}</span>}
                  </div>
                  {l.notes && <div style={{ fontSize: '10px', color: '#4A5568', marginTop: '6px' }}>{l.notes}</div>}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '16px' }}>
                  <button onClick={() => openEdit(l)} style={btnSecondary}>✏ Editar</button>
                  <button onClick={() => remove(l.id)} style={{ ...btnSecondary, color: '#FF3C3C', borderColor: '#FF3C3C40' }}>✕</button>
                </div>
              </div>
            </div>
          ))}
          {leads.length === 0 && <div style={{ color: '#4A5568', fontSize: '13px', textAlign: 'center', padding: '40px' }}>Nenhum pré-cadastro registrado.</div>}
        </div>
      )}
    </div>
  )
}

const inpStyle = { width: '100%', background: '#121828', border: '1px solid #2D3748', borderRadius: '6px', padding: '9px 12px', color: '#E8ECF4', fontSize: '12px', fontFamily: 'inherit', outline: 'none' }
const btnPrimary = { padding: '9px 20px', background: 'linear-gradient(135deg,#FF8C42,#FFB800)', border: 'none', borderRadius: '7px', fontSize: '11px', fontWeight: 'bold', color: '#080B14', cursor: 'pointer', letterSpacing: '1px' }
const btnSecondary = { padding: '8px 14px', background: '#1A2035', border: '1px solid #2D3748', borderRadius: '7px', fontSize: '10px', color: '#718096', cursor: 'pointer' }
