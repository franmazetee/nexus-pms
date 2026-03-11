function ModulePage({ color, icon, title, desc, items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: '#0D1220', border: `1px solid ${color}30`, borderRadius: '12px', padding: '28px', borderTop: `2px solid ${color}` }}>
        <div style={{ fontSize: '11px', color: '#4A5568', letterSpacing: '2px', marginBottom: '10px' }}>{icon} MÓDULO</div>
        <div style={{ fontSize: '22px', color, fontWeight: 'bold', marginBottom: '10px' }}>{title}</div>
        <div style={{ fontSize: '13px', color: '#718096' }}>{desc}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: '#0D1220', border: '1px solid #1A2035', borderRadius: '10px', padding: '20px', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}50`; e.currentTarget.style.background = '#121828' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1A2035'; e.currentTarget.style.background = '#0D1220' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color, marginBottom: '8px' }}>{item}</div>
            <div style={{ fontSize: '11px', color: '#4A5568' }}>Em desenvolvimento</div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default function ERP() {
  return <ModulePage color="#FF6B35" icon="⬢" title="ERP Interno" desc="Gestão financeira, RH, comunicação interna e relatórios da sua empresa." items={['Financeiro','RH & Equipe','Licenças & Ativos','Comunicação Interna','BI & Relatórios','Configurações']} />
}
