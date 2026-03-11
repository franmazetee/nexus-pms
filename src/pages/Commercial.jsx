import { useState, useEffect } from 'react'
import { getClientLeads, createClientLead, updateClientLead, deleteClientLead } from '../services/clients.js'
import { getProposals, createProposal, updateProposal, deleteProposal, getContracts, createContract, updateContract, deleteContract } from '../services/commercial.js'

const COLOR = '#FFB800'

const PIPELINE_STAGES = ['lead', 'qualificado', 'proposta', 'negociação', 'fechado', 'perdido']
const stageColors = {
  lead: '#4A5568', qualificado: '#00C8FF', proposta: '#FFB800',
  negociação: '#FF6B35', fechado: '#00FFB2', perdido: '#FF3C3C',
}

const PROPOSAL_STATUSES = ['rascunho', 'enviada', 'aceita', 'recusada']
const proposalColors = { rascunho: '#4A5568', enviada: '#00C8FF', aceita: '#00FFB2', recusada: '#FF3C3C' }

const CONTRACT_STATUSES = ['pendente', 'ativo', 'encerrado']
const contractColors = { pendente: '#FFB800', ativo: '#00FFB2', encerrado: '#4A5568' }

const inpStyle = {
  width: '100%', background: '#121828', border: '1px solid #2D3748',
  borderRadius: '6px', padding: '9px 12px', color: '#E8ECF4',
  fontSize: '12px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
}
const btnPrimary = {
  padding: '9px 20px', background: 'linear-gradient(135deg,#FFB800,#FF6B35)',
  border: 'none', borderRadius: '7px', fontSize: '11px', fontWeight: 'bold',
  color: '#080B14', cursor: 'pointer', letterSpacing: '1px',
}
const btnSecondary = {
  padding: '8px 14px', background: '#1A2035', border: '1px solid #2D3748',
  borderRadius: '7px', fontSize: '10px', color: '#718096', cursor: 'pointer',
}

function Field({ label, value, onChange, type = 'text', opts }) {
  return (
    <div>
      <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '1px', marginBottom: '6px' }}>{label}</div>
      {opts ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={inpStyle}>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} style={{ ...inpStyle, resize: 'vertical' }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} style={inpStyle} />
      )}
    </div>
  )
}

// ──────────────────────────────────────────────
// TAB: PIPELINE
// ──────────────────────────────────────────────
function PipelineTab() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', stage: 'lead', value: 0, notes: '' })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    try { setLeads(await getClientLeads()) } catch (e) { setError(e.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    try {
      if (editing) await updateClientLead(editing, form)
      else await createClientLead(form)
      setShowForm(false); setForm({ name: '', company: '', email: '', phone: '', stage: 'lead', value: 0, notes: '' }); setEditing(null)
      load()
    } catch (e) { setError(e.message) } finally { setSaving(false) }
  }

  async function remove(id) {
    if (!confirm('Remover este lead?')) return
    try { await deleteClientLead(id); load() } catch (e) { setError(e.message) }
  }

  function openEdit(l) {
    setForm({ name: l.name || '', company: l.company || '', email: l.email || '', phone: l.phone || '', stage: l.stage || 'lead', value: l.value || 0, notes: l.notes || '' })
    setEditing(l.id); setShowForm(true)
  }

  function f(field, val) { setForm(p => ({ ...p, [field]: val })) }

  if (loading) return <div style={{ color: '#4A5568', fontSize: '13px' }}>Carregando pipeline...</div>
  if (error) return <div style={{ color: '#FF3C3C', fontSize: '13px' }}>Erro: {error}</div>

  const total = leads.reduce((s, l) => s + (Number(l.value) || 0), 0)
  const fechados = leads.filter(l => l.stage === 'fechado').reduce((s, l) => s + (Number(l.value) || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span style={{ fontSize: '12px', color: '#4A5568' }}>{leads.length} leads <span style={{ color: COLOR }}>·</span> pipeline total: <span style={{ color: COLOR }}>R$ {total.toLocaleString('pt-BR')}</span></span>
          <span style={{ fontSize: '12px', color: '#4A5568' }}>fechados: <span style={{ color: '#00FFB2' }}>R$ {fechados.toLocaleString('pt-BR')}</span></span>
        </div>
        <button onClick={() => { setForm({ name: '', company: '', email: '', phone: '', stage: 'lead', value: 0, notes: '' }); setEditing(null); setShowForm(true) }} style={btnPrimary}>+ NOVO LEAD</button>
      </div>

      {showForm && (
        <div style={{ background: '#0D1220', border: `1px solid ${COLOR}40`, borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: COLOR, letterSpacing: '1px', marginBottom: '20px' }}>
            {editing ? '✏ EDITAR LEAD' : '+ NOVO LEAD'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="NOME" value={form.name} onChange={v => f('name', v)} />
            <Field label="EMPRESA" value={form.company} onChange={v => f('company', v)} />
            <Field label="E-MAIL" value={form.email} onChange={v => f('email', v)} />
            <Field label="TELEFONE" value={form.phone} onChange={v => f('phone', v)} />
            <Field label="ETAPA" value={form.stage} onChange={v => f('stage', v)} opts={PIPELINE_STAGES} />
            <Field label="VALOR ESTIMADO (R$)" value={form.value} onChange={v => f('value', v)} type="number" />
          </div>
          <div style={{ marginTop: '16px' }}>
            <Field label="OBSERVAÇÕES" value={form.notes} onChange={v => f('notes', v)} type="textarea" />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Salvando...' : 'SALVAR'}</button>
            <button onClick={() => setShowForm(false)} style={btnSecondary}>CANCELAR</button>
          </div>
        </div>
      )}

      {/* Kanban */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', overflowX: 'auto' }}>
        {PIPELINE_STAGES.map(stage => {
          const stageleads = leads.filter(l => (l.stage || 'lead') === stage)
          const stageVal = stageleads.reduce((s, l) => s + (Number(l.value) || 0), 0)
          return (
            <div key={stage} style={{ background: '#0D1220', border: `1px solid ${stageColors[stage]}30`, borderRadius: '10px', overflow: 'hidden', minWidth: '160px' }}>
              <div style={{ padding: '10px 12px', borderBottom: `1px solid ${stageColors[stage]}30`, borderTop: `2px solid ${stageColors[stage]}` }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: stageColors[stage], letterSpacing: '1px' }}>{stage.toUpperCase()}</div>
                <div style={{ fontSize: '10px', color: '#4A5568', marginTop: '2px' }}>{stageleads.length} · R$ {stageVal.toLocaleString('pt-BR')}</div>
              </div>
              <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px', minHeight: '80px' }}>
                {stageleads.map(l => (
                  <div key={l.id} style={{ background: '#121828', border: '1px solid #1A2035', borderRadius: '6px', padding: '8px', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${stageColors[stage]}50`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#1A2035'}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#E8ECF4', marginBottom: '2px' }}>{l.name}</div>
                    {l.company && <div style={{ fontSize: '10px', color: '#718096' }}>{l.company}</div>}
                    {l.value > 0 && <div style={{ fontSize: '10px', color: stageColors[stage], marginTop: '4px' }}>R$ {Number(l.value).toLocaleString('pt-BR')}</div>}
                    <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                      <button onClick={() => openEdit(l)} style={{ ...btnSecondary, padding: '3px 8px', fontSize: '9px' }}>✏</button>
                      <button onClick={() => remove(l.id)} style={{ ...btnSecondary, padding: '3px 8px', fontSize: '9px', color: '#FF3C3C', borderColor: '#FF3C3C40' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// TAB: PROPOSTAS
// ──────────────────────────────────────────────
const emptyProposal = { title: '', client: '', value: 0, status: 'rascunho', validity_date: '', description: '' }

function PropostasTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyProposal)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    try { setItems(await getProposals()) } catch (e) { setError(e.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    try {
      if (editing) await updateProposal(editing, form)
      else await createProposal(form)
      setShowForm(false); setForm(emptyProposal); setEditing(null); load()
    } catch (e) { setError(e.message) } finally { setSaving(false) }
  }

  async function remove(id) {
    if (!confirm('Remover esta proposta?')) return
    try { await deleteProposal(id); load() } catch (e) { setError(e.message) }
  }

  function openEdit(p) {
    setForm({ title: p.title || '', client: p.client || '', value: p.value || 0, status: p.status || 'rascunho', validity_date: p.validity_date || '', description: p.description || '' })
    setEditing(p.id); setShowForm(true)
  }

  function f(field, val) { setForm(p => ({ ...p, [field]: val })) }

  if (loading) return <div style={{ color: '#4A5568', fontSize: '13px' }}>Carregando propostas...</div>
  if (error) return <div style={{ color: '#FF3C3C', fontSize: '13px' }}>Erro: {error}</div>

  const total = items.filter(i => i.status !== 'recusada').reduce((s, i) => s + (Number(i.value) || 0), 0)
  const aceitas = items.filter(i => i.status === 'aceita').reduce((s, i) => s + (Number(i.value) || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', color: '#4A5568' }}>
          {items.length} propostas · em aberto: <span style={{ color: COLOR }}>R$ {total.toLocaleString('pt-BR')}</span>
          · aceitas: <span style={{ color: '#00FFB2' }}>R$ {aceitas.toLocaleString('pt-BR')}</span>
        </div>
        <button onClick={() => { setForm(emptyProposal); setEditing(null); setShowForm(true) }} style={btnPrimary}>+ NOVA PROPOSTA</button>
      </div>

      {showForm && (
        <div style={{ background: '#0D1220', border: `1px solid ${COLOR}40`, borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: COLOR, letterSpacing: '1px', marginBottom: '20px' }}>
            {editing ? '✏ EDITAR PROPOSTA' : '+ NOVA PROPOSTA'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="TÍTULO" value={form.title} onChange={v => f('title', v)} />
            <Field label="CLIENTE" value={form.client} onChange={v => f('client', v)} />
            <Field label="VALOR (R$)" value={form.value} onChange={v => f('value', v)} type="number" />
            <Field label="STATUS" value={form.status} onChange={v => f('status', v)} opts={PROPOSAL_STATUSES} />
            <Field label="VALIDADE" value={form.validity_date} onChange={v => f('validity_date', v)} type="date" />
          </div>
          <div style={{ marginTop: '16px' }}>
            <Field label="DESCRIÇÃO / ESCOPO" value={form.description} onChange={v => f('description', v)} type="textarea" />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Salvando...' : 'SALVAR'}</button>
            <button onClick={() => setShowForm(false)} style={btnSecondary}>CANCELAR</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.length === 0 && <div style={{ color: '#4A5568', fontSize: '12px', textAlign: 'center', padding: '40px' }}>Nenhuma proposta cadastrada.</div>}
        {items.map(p => (
          <div key={p.id} style={{ background: '#0D1220', border: '1px solid #1A2035', borderRadius: '10px', padding: '16px 20px', borderLeft: `3px solid ${proposalColors[p.status] || '#4A5568'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#E8ECF4' }}>{p.title}</span>
                  <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '9px', background: `${proposalColors[p.status]}18`, color: proposalColors[p.status], border: `1px solid ${proposalColors[p.status]}40` }}>
                    {p.status?.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#718096', marginBottom: '4px' }}>
                  {p.client} {p.validity_date && `· válida até ${new Date(p.validity_date).toLocaleDateString('pt-BR')}`}
                </div>
                {p.description && <div style={{ fontSize: '11px', color: '#4A5568' }}>{p.description}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, marginLeft: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: COLOR }}>R$ {Number(p.value).toLocaleString('pt-BR')}</span>
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

// ──────────────────────────────────────────────
// TAB: CONTRATOS & SLA
// ──────────────────────────────────────────────
const emptyContract = { title: '', client: '', value: 0, status: 'pendente', start_date: '', end_date: '', sla_hours: 8, description: '' }

function ContratosTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyContract)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    try { setItems(await getContracts()) } catch (e) { setError(e.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    try {
      if (editing) await updateContract(editing, form)
      else await createContract(form)
      setShowForm(false); setForm(emptyContract); setEditing(null); load()
    } catch (e) { setError(e.message) } finally { setSaving(false) }
  }

  async function remove(id) {
    if (!confirm('Remover este contrato?')) return
    try { await deleteContract(id); load() } catch (e) { setError(e.message) }
  }

  function openEdit(c) {
    setForm({ title: c.title || '', client: c.client || '', value: c.value || 0, status: c.status || 'pendente', start_date: c.start_date || '', end_date: c.end_date || '', sla_hours: c.sla_hours || 8, description: c.description || '' })
    setEditing(c.id); setShowForm(true)
  }

  function f(field, val) { setForm(p => ({ ...p, [field]: val })) }

  if (loading) return <div style={{ color: '#4A5568', fontSize: '13px' }}>Carregando contratos...</div>
  if (error) return <div style={{ color: '#FF3C3C', fontSize: '13px' }}>Erro: {error}</div>

  const ativos = items.filter(i => i.status === 'ativo')
  const mrr = ativos.reduce((s, i) => s + (Number(i.value) || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', color: '#4A5568' }}>
          {items.length} contratos · ativos: <span style={{ color: '#00FFB2' }}>{ativos.length}</span>
          · MRR: <span style={{ color: COLOR }}>R$ {mrr.toLocaleString('pt-BR')}</span>
        </div>
        <button onClick={() => { setForm(emptyContract); setEditing(null); setShowForm(true) }} style={btnPrimary}>+ NOVO CONTRATO</button>
      </div>

      {showForm && (
        <div style={{ background: '#0D1220', border: `1px solid ${COLOR}40`, borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: COLOR, letterSpacing: '1px', marginBottom: '20px' }}>
            {editing ? '✏ EDITAR CONTRATO' : '+ NOVO CONTRATO'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="TÍTULO" value={form.title} onChange={v => f('title', v)} />
            <Field label="CLIENTE" value={form.client} onChange={v => f('client', v)} />
            <Field label="VALOR MENSAL (R$)" value={form.value} onChange={v => f('value', v)} type="number" />
            <Field label="STATUS" value={form.status} onChange={v => f('status', v)} opts={CONTRACT_STATUSES} />
            <Field label="INÍCIO" value={form.start_date} onChange={v => f('start_date', v)} type="date" />
            <Field label="TÉRMINO" value={form.end_date} onChange={v => f('end_date', v)} type="date" />
            <Field label="SLA (HORAS RESPOSTA)" value={form.sla_hours} onChange={v => f('sla_hours', v)} type="number" />
          </div>
          <div style={{ marginTop: '16px' }}>
            <Field label="DESCRIÇÃO / ESCOPO" value={form.description} onChange={v => f('description', v)} type="textarea" />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Salvando...' : 'SALVAR'}</button>
            <button onClick={() => setShowForm(false)} style={btnSecondary}>CANCELAR</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.length === 0 && <div style={{ color: '#4A5568', fontSize: '12px', textAlign: 'center', padding: '40px' }}>Nenhum contrato cadastrado.</div>}
        {items.map(c => {
          const now = new Date()
          const end = c.end_date ? new Date(c.end_date) : null
          const daysLeft = end ? Math.ceil((end - now) / 86400000) : null
          return (
            <div key={c.id} style={{ background: '#0D1220', border: '1px solid #1A2035', borderRadius: '10px', padding: '16px 20px', borderLeft: `3px solid ${contractColors[c.status] || '#4A5568'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#E8ECF4' }}>{c.title}</span>
                    <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '9px', background: `${contractColors[c.status]}18`, color: contractColors[c.status], border: `1px solid ${contractColors[c.status]}40` }}>
                      {c.status?.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '10px', color: '#B44FFF' }}>SLA {c.sla_hours}h</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#718096', marginBottom: '4px' }}>
                    {c.client}
                    {c.start_date && ` · início: ${new Date(c.start_date).toLocaleDateString('pt-BR')}`}
                    {c.end_date && ` · término: ${new Date(c.end_date).toLocaleDateString('pt-BR')}`}
                    {daysLeft !== null && daysLeft > 0 && daysLeft <= 30 && <span style={{ color: '#FF6B35' }}> · vence em {daysLeft}d</span>}
                    {daysLeft !== null && daysLeft <= 0 && <span style={{ color: '#FF3C3C' }}> · VENCIDO</span>}
                  </div>
                  {c.description && <div style={{ fontSize: '11px', color: '#4A5568' }}>{c.description}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, marginLeft: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLOR }}>R$ {Number(c.value).toLocaleString('pt-BR')}</div>
                    <div style={{ fontSize: '9px', color: '#4A5568' }}>/ mês</div>
                  </div>
                  <button onClick={() => openEdit(c)} style={btnSecondary}>✏ Editar</button>
                  <button onClick={() => remove(c.id)} style={{ ...btnSecondary, color: '#FF3C3C', borderColor: '#FF3C3C40' }}>✕</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// TAB: RELATÓRIOS
// ──────────────────────────────────────────────
function RelatoriosTab() {
  const [leads, setLeads] = useState([])
  const [proposals, setProposals] = useState([])
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [l, p, c] = await Promise.all([getClientLeads(), getProposals(), getContracts()])
        setLeads(l); setProposals(p); setContracts(c)
      } finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <div style={{ color: '#4A5568', fontSize: '13px' }}>Carregando relatórios...</div>

  const pipelineVal = leads.reduce((s, l) => s + (Number(l.value) || 0), 0)
  const proposalVal = proposals.filter(p => p.status !== 'recusada').reduce((s, p) => s + (Number(p.value) || 0), 0)
  const mrr = contracts.filter(c => c.status === 'ativo').reduce((s, c) => s + (Number(c.value) || 0), 0)
  const taxaFechamento = leads.length > 0 ? ((leads.filter(l => l.stage === 'fechado').length / leads.length) * 100).toFixed(0) : 0
  const taxaAceite = proposals.length > 0 ? ((proposals.filter(p => p.status === 'aceita').length / proposals.length) * 100).toFixed(0) : 0

  const stageCount = PIPELINE_STAGES.map(s => ({ stage: s, count: leads.filter(l => (l.stage || 'lead') === s).length, val: leads.filter(l => (l.stage || 'lead') === s).reduce((sum, l) => sum + (Number(l.value) || 0), 0) }))
  const maxCount = Math.max(...stageCount.map(s => s.count), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
        {[
          { label: 'MRR', value: `R$ ${mrr.toLocaleString('pt-BR')}`, color: '#00FFB2', sub: `${contracts.filter(c => c.status === 'ativo').length} contratos ativos` },
          { label: 'PIPELINE', value: `R$ ${pipelineVal.toLocaleString('pt-BR')}`, color: COLOR, sub: `${leads.length} leads totais` },
          { label: 'PROPOSTAS ABERTAS', value: `R$ ${proposalVal.toLocaleString('pt-BR')}`, color: '#00C8FF', sub: `${proposals.filter(p => ['rascunho','enviada'].includes(p.status)).length} em aberto` },
          { label: 'TAXA DE FECHAMENTO', value: `${taxaFechamento}%`, color: '#B44FFF', sub: `aceite propostas: ${taxaAceite}%` },
        ].map(({ label, value, color, sub }) => (
          <div key={label} style={{ background: '#0D1220', border: `1px solid ${color}30`, borderRadius: '12px', padding: '20px', borderTop: `2px solid ${color}` }}>
            <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '1px', marginBottom: '10px' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '10px', color: '#4A5568', marginTop: '8px' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Funil */}
      <div style={{ background: '#0D1220', border: '1px solid #1A2035', borderRadius: '12px', padding: '20px' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: COLOR, letterSpacing: '1px', marginBottom: '16px' }}>FUNIL DE VENDAS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {stageCount.map(({ stage, count, val }) => (
            <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '90px', fontSize: '10px', color: stageColors[stage], letterSpacing: '0.5px' }}>{stage.toUpperCase()}</div>
              <div style={{ flex: 1, height: '24px', background: '#121828', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(count / maxCount) * 100}%`, height: '100%', background: `${stageColors[stage]}60`, borderRadius: '4px', transition: 'width 0.5s', display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
                  <span style={{ fontSize: '10px', color: stageColors[stage], fontWeight: 'bold' }}>{count}</span>
                </div>
              </div>
              <div style={{ width: '120px', fontSize: '10px', color: '#4A5568', textAlign: 'right' }}>R$ {val.toLocaleString('pt-BR')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status propostas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: '#0D1220', border: '1px solid #1A2035', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#00C8FF', letterSpacing: '1px', marginBottom: '14px' }}>PROPOSTAS POR STATUS</div>
          {PROPOSAL_STATUSES.map(s => {
            const count = proposals.filter(p => p.status === s).length
            const val = proposals.filter(p => p.status === s).reduce((sum, p) => sum + (Number(p.value) || 0), 0)
            return (
              <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #0F1525' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: proposalColors[s] }} />
                  <span style={{ fontSize: '11px', color: '#718096' }}>{s}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: proposalColors[s], fontWeight: 'bold' }}>{count}</span>
                  <span style={{ fontSize: '10px', color: '#4A5568', marginLeft: '8px' }}>R$ {val.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ background: '#0D1220', border: '1px solid #1A2035', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#00FFB2', letterSpacing: '1px', marginBottom: '14px' }}>CONTRATOS POR STATUS</div>
          {CONTRACT_STATUSES.map(s => {
            const ctrs = contracts.filter(c => c.status === s)
            const val = ctrs.reduce((sum, c) => sum + (Number(c.value) || 0), 0)
            return (
              <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #0F1525' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: contractColors[s] }} />
                  <span style={{ fontSize: '11px', color: '#718096' }}>{s}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: contractColors[s], fontWeight: 'bold' }}>{ctrs.length}</span>
                  <span style={{ fontSize: '10px', color: '#4A5568', marginLeft: '8px' }}>R$ {val.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────
const TABS = [
  { id: 'pipeline', label: 'Pipeline de Vendas' },
  { id: 'propostas', label: 'Propostas' },
  { id: 'contratos', label: 'Contratos & SLA' },
  { id: 'relatorios', label: 'Relatórios' },
]

export default function Commercial() {
  const [tab, setTab] = useState('pipeline')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: `1px solid #1A2035`, paddingBottom: '0' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '11px', fontWeight: tab === t.id ? 'bold' : 'normal', letterSpacing: '0.5px',
            color: tab === t.id ? COLOR : '#4A5568',
            borderBottom: tab === t.id ? `2px solid ${COLOR}` : '2px solid transparent',
            marginBottom: '-1px', transition: 'all 0.2s',
          }}>
            {t.label.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === 'pipeline'   && <PipelineTab />}
      {tab === 'propostas'  && <PropostasTab />}
      {tab === 'contratos'  && <ContratosTab />}
      {tab === 'relatorios' && <RelatoriosTab />}
    </div>
  )
}
