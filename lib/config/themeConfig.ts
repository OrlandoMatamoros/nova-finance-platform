// Configuración de temas y colores personalizables por cliente
export interface ThemeConfig {
  name: string
  primary: {
    50: string
    100: string
    300: string
    500: string
    700: string
    900: string
  }
  accent: {
    300: string
    500: string
    700: string
  }
  gradients: {
    primary: string
    secondary: string
    accent: string
  }
}

// Temas predefinidos
export const themes: Record<string, ThemeConfig> = {
  // Tema por defecto - Azul Espacial y Púrpura
  spaceBlue: {
    name: 'Space Blue',
    primary: {
      50: '#e6f1ff',
      100: '#b3d4ff',
      300: '#4d9fff',
      500: '#0066ff',
      700: '#0052cc',
      900: '#003d99'
    },
    accent: {
      300: '#d946ef',
      500: '#a855f7',
      700: '#7e22ce'
    },
    gradients: {
      primary: 'from-blue-600 to-blue-800',
      secondary: 'from-purple-600 to-purple-800',
      accent: 'from-blue-600 to-purple-600'
    }
  },
  
  // Tema Verde Esmeralda - Para negocios eco-friendly
  emeraldGreen: {
    name: 'Emerald Green',
    primary: {
      50: '#e6fffa',
      100: '#b3ffe5',
      300: '#4dffcc',
      500: '#00cc88',
      700: '#009966',
      900: '#006644'
    },
    accent: {
      300: '#fbbf24',
      500: '#f59e0b',
      700: '#d97706'
    },
    gradients: {
      primary: 'from-emerald-600 to-emerald-800',
      secondary: 'from-teal-600 to-teal-800',
      accent: 'from-emerald-600 to-teal-600'
    }
  },
  
  // Tema Rojo Fuego - Para restaurantes y food trucks
  fireRed: {
    name: 'Fire Red',
    primary: {
      50: '#fff1f1',
      100: '#ffcccc',
      300: '#ff6666',
      500: '#ff0000',
      700: '#cc0000',
      900: '#990000'
    },
    accent: {
      300: '#fb923c',
      500: '#f97316',
      700: '#ea580c'
    },
    gradients: {
      primary: 'from-red-600 to-red-800',
      secondary: 'from-orange-600 to-orange-800',
      accent: 'from-red-600 to-orange-600'
    }
  },
  
  // Tema Morado Royal - Para servicios premium
  royalPurple: {
    name: 'Royal Purple',
    primary: {
      50: '#f3e6ff',
      100: '#d9b3ff',
      300: '#a64dff',
      500: '#7300e6',
      700: '#5900b3',
      900: '#400080'
    },
    accent: {
      300: '#e879f9',
      500: '#d946ef',
      700: '#a21caf'
    },
    gradients: {
      primary: 'from-purple-600 to-purple-800',
      secondary: 'from-pink-600 to-pink-800',
      accent: 'from-purple-600 to-pink-600'
    }
  },
  
  // Tema Gris Profesional - Para consultorías y B2B
  professionalGray: {
    name: 'Professional Gray',
    primary: {
      50: '#f8fafc',
      100: '#e2e8f0',
      300: '#94a3b8',
      500: '#475569',
      700: '#334155',
      900: '#0f172a'
    },
    accent: {
      300: '#60a5fa',
      500: '#3b82f6',
      700: '#1d4ed8'
    },
    gradients: {
      primary: 'from-slate-600 to-slate-800',
      secondary: 'from-gray-600 to-gray-800',
      accent: 'from-slate-600 to-blue-600'
    }
  },
  
  // Tema Dorado Premium - Para joyerías y luxury retail
  goldPremium: {
    name: 'Gold Premium',
    primary: {
      50: '#fffbeb',
      100: '#fef3c7',
      300: '#fcd34d',
      500: '#f59e0b',
      700: '#d97706',
      900: '#92400e'
    },
    accent: {
      300: '#c084fc',
      500: '#a855f7',
      700: '#7e22ce'
    },
    gradients: {
      primary: 'from-yellow-600 to-yellow-800',
      secondary: 'from-amber-600 to-amber-800',
      accent: 'from-yellow-600 to-amber-600'
    }
  }
}

// Función para obtener el tema actual
export const getCurrentTheme = (themeName: string = 'spaceBlue'): ThemeConfig => {
  return themes[themeName] || themes.spaceBlue
}

// Función para aplicar tema dinámicamente
export const applyTheme = (theme: ThemeConfig) => {
  // Esto se puede usar para inyectar CSS variables
  const root = document.documentElement
  
  // Aplicar colores primarios
  Object.entries(theme.primary).forEach(([key, value]) => {
    root.style.setProperty(`--color-primary-${key}`, value)
  })
  
  // Aplicar colores de acento
  Object.entries(theme.accent).forEach(([key, value]) => {
    root.style.setProperty(`--color-accent-${key}`, value)
  })
}
