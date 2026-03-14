// ─────────────────────────────────────────────
// NEXUS PMS — Estilos compartilhados
// Importe daqui em qualquer página/componente
// ─────────────────────────────────────────────

export const colors = {
  bg:       '#080B14',
  surface:  '#0D1220',
  surface2: '#121828',
  border:   '#1A2035',
  border2:  '#2D3748',
  text:     '#E8ECF4',
  muted:    '#718096',
  faint:    '#4A5568',

  green:    '#00FFB2',
  blue:     '#00C8FF',
  purple:   '#B44FFF',
  yellow:   '#FFB800',
  orange:   '#FF6B35',
  red:      '#FF3C3C',
  pink:     '#FF3CAC',
  cyan:     '#43E8D8',
  amber:    '#FFF176',
  sky:      '#7EB8FF',
  coral:    '#FF8C42',
}

export const inpStyle = {
  width: '100%',
  background: colors.surface2,
  border: `1px solid ${colors.border2}`,
  borderRadius: '6px',
  padding: '9px 12px',
  color: colors.text,
  fontSize: '12px',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
}

export const btnSecondary = {
  padding: '8px 14px',
  background: colors.border,
  border: `1px solid ${colors.border2}`,
  borderRadius: '7px',
  fontSize: '10px',
  color: colors.muted,
  cursor: 'pointer',
}

export const btnDanger = {
  ...btnSecondary,
  color: colors.red,
  borderColor: `${colors.red}40`,
}

export const btnMini = {
  padding: '4px 10px',
  background: 'transparent',
  border: `1px solid ${colors.border2}`,
  borderRadius: '5px',
  fontSize: '9px',
  cursor: 'pointer',
}

// Cada módulo tem seu próprio btnPrimary com cor diferente
export function makePrimary(from, to, textColor = colors.bg) {
  return {
    padding: '9px 20px',
    background: `linear-gradient(135deg,${from},${to})`,
    border: 'none',
    borderRadius: '7px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: textColor,
    cursor: 'pointer',
    letterSpacing: '1px',
  }
}

// Cores por módulo
export const modulePrimary = {
  projects:   makePrimary(colors.green,  colors.blue),
  changes:    makePrimary(colors.cyan,   colors.blue),
  versions:   makePrimary(colors.purple, colors.pink, '#fff'),
  tasks:      makePrimary(colors.amber,  colors.yellow),
  clients:    makePrimary(colors.coral,  colors.yellow),
  commercial: makePrimary(colors.yellow, colors.orange),
  users:      makePrimary(colors.sky,    colors.blue),
}

// Card genérico de stat
export const statCard = (color) => ({
  background: colors.surface,
  border: `1px solid ${color}30`,
  borderRadius: '12px',
  padding: '20px',
  borderTop: `2px solid ${color}`,
})

// Card de item de lista
export const listCard = (accentColor) => ({
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  padding: '18px 20px',
  borderLeft: `3px solid ${accentColor || colors.faint}`,
})

// Painel de formulário
export const formPanel = (accentColor) => ({
  background: colors.surface,
  border: `1px solid ${accentColor}40`,
  borderRadius: '12px',
  padding: '24px',
})

// Badge de status genérico
export function badge(color) {
  return {
    padding: '2px 10px',
    borderRadius: '20px',
    fontSize: '9px',
    background: `${color}18`,
    color,
    border: `1px solid ${color}40`,
  }
}

// Label de campo
export const fieldLabel = {
  fontSize: '10px',
  color: colors.faint,
  letterSpacing: '1px',
  marginBottom: '6px',
}
