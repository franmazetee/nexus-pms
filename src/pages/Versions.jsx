import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const typeColors = { major: '#FF6B35', minor: '#00C8FF', patch: '#00FFB2' }
const empty = { system_name: '', version: '', type: 'patch', changes_count: 0, responsible: '', notes: '', released_at: new Date().toISOString().split('T')[0] }

export default function Versions() {
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)

  async function load() {
    const { data } = await supabase.from('version_logs').select('*').order('created_at', { ascending: false })
    setVersions(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    await supabase.from('version_logs').insert(form)
    setShowForm(false); setForm(empty); load()
  }

  const inp = (field, label, type = 'text', opts = null) => (
    <div>
      <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '1px', marginBottom: '6px' }}>{label}</div>
      {opts ? (
        <select value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} style={inpStyle}>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: type === 'number' ? Number(e.target.value) : e.target.value })} style={inpStyle} />
      )}
    </div>
  )

  if (loading) return <div style={{ color: '#4A5568', fontSize: '13px' }}>Carregando...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', color: '#B44FFF' }}>{versions.length} versões registradas no histórico</div>
        <button onClick={() => setShowForm(!showForm)} style={btnPrimary}>+ REGISTRAR VERSÃO</button>
      </div>

      {showForm && (
        <div style={{ background: '#0D1220', border: '1px solid #B44FFF40', borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#B44FFF', letterSpacing: '1px', marginBottom: '20px' }}>⊕ REGISTRAR NOVA VERSÃO</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {inp('system_name', 'SISTEMA')}
            {inp('version', 'VERSÃO (ex: v1.2.0)')}
            {inp('type', 'TIPO', 'text', ['patch', 'minor', 'major'])}
            {inp('changes_count', 'QTD. ALTERAÇÕES', 'number')}
            {inp('responsible', 'RESPONSÁVEL')}
            {inp('released_at', 'DATA RELEASE', 'date')}
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '10px', color: '#4A5568', letterSpacing: '1px', marginBottom: '6px' }}>NOTAS DA VERSÃO</div>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} style={{ ...inpStyle, resize: 'vertical', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={save} style={btnPrimary}>SALVAR</button>
            <button onClick={() => setShowForm(false)} style={btnSecondary}>CANCELAR</button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div style={{ background: '#0D1220', border: '1px solid #1A2035', borderRadius: '12px', padding: '24px' }}>
        {versions.map((v, i) => (
          <div key={v.id} style={{ display: 'flex', gap: '16px', marginBottom: i < versions.length - 1 ? '0' : '0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${typeColors[v.type]}20`, border: `2px solid ${typeColors[v.type]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>⊕</div>
              {i < versions.length - 1 && <div style={{ width: '1px', flex: 1, background: '#1A2035', minHeight: '24px', margin: '4px 0' }} />}
            </div>
            <div style={{ flex: 1, paddingBottom: i < versions.length - 1 ? '20px' : '0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '14px', fontFamily: 'monospace', color: typeColors[v.type], fontWeight: 'bold' }}>{v.version}</span>
                  <span style={{ fontSize: '11px', color: '#718096', marginLeft: '12px' }}>{v.system_name}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ padding: '2px 10px', borderRadius: '4px', fontSize: '9px', background: `${typeColors[v.type]}20`, color: typeColors[v.type] }}>{v.type?.toUpperCase()}</span>
                  <span style={{ fontSize: '10px', color: '#4A5568' }}>{v.released_at}</span>
                </div>
              </div>
              <div style={{ background: '#121828', borderRadius: '8px', padding: '12px 16px' }}>
                <div style={{ fontSize: '12px', color: '#E8ECF4', marginBottom: '8px' }}>{v.notes}</div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '10px', color: '#4A5568' }}>
                  {v.changes_count > 0 && <span>📝 {v.changes_count} alterações</span>}
                  {v.responsible && <span>👤 {v.responsible}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
        {versions.length === 0 && <div style={{ color: '#4A5568', fontSize: '13px', textAlign: 'center', padding: '20px' }}>Nenhuma versão registrada ainda.</div>}
      </div>
    </div>
  )
}

const inpStyle = { width: '100%', background: '#121828', border: '1px solid #2D3748', borderRadius: '6px', padding: '9px 12px', color: '#E8ECF4', fontSize: '12px', fontFamily: 'inherit', outline: 'none' }
const btnPrimary = { padding: '9px 20px', background: 'linear-gradient(135deg,#B44FFF,#FF3CAC)', border: 'none', borderRadius: '7px', fontSize: '11px', fontWeight: 'bold', color: '#fff', cursor: 'pointer', letterSpacing: '1px' }
const btnSecondary = { padding: '8px 14px', background: '#1A2035', border: '1px solid #2D3748', borderRadius: '7px', fontSize: '10px', color: '#718096', cursor: 'pointer' }
