export interface ThemeConfig {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  border: string
}

export const themes: ThemeConfig[] = [
  {
    name: 'Espacial Azul',
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    background: 'from-slate-900 via-blue-900 to-purple-900',
    surface: 'bg-white/10',
    text: 'text-white',
    border: 'border-white/20'
  },
  {
    name: 'Verde Empresarial',
    primary: '#10B981',
    secondary: '#14B8A6',
    accent: '#F59E0B',
    background: 'from-emerald-900 via-green-900 to-teal-900',
    surface: 'bg-white/10',
    text: 'text-white',
    border: 'border-white/20'
  },
  {
    name: 'Rojo Ejecutivo',
    primary: '#EF4444',
    secondary: '#F97316',
    accent: '#FBBF24',
    background: 'from-red-900 via-orange-900 to-yellow-900',
    surface: 'bg-white/10',
    text: 'text-white',
    border: 'border-white/20'
  },
  {
    name: 'Púrpura Premium',
    primary: '#9333EA',
    secondary: '#C026D3',
    accent: '#E11D48',
    background: 'from-purple-900 via-pink-900 to-rose-900',
    surface: 'bg-white/10',
    text: 'text-white',
    border: 'border-white/20'
  },
  {
    name: 'Gris Minimalista',
    primary: '#6B7280',
    secondary: '#9CA3AF',
    accent: '#3B82F6',
    background: 'from-gray-900 via-slate-900 to-zinc-900',
    surface: 'bg-white/10',
    text: 'text-white',
    border: 'border-white/20'
  },
  {
    name: 'Tropical (El Conuco)',
    primary: '#2ECC71',
    secondary: '#E67E22',
    accent: '#F39C12',
    background: 'from-green-900 via-emerald-900 to-orange-900',
    surface: 'bg-white/10',
    text: 'text-white',
    border: 'border-white/20'
  }
]

export const applyTheme = (theme: ThemeConfig) => {
  // Esta función aplicaría el tema al dashboard
  // Por ahora solo retorna el tema seleccionado
  return theme
}
