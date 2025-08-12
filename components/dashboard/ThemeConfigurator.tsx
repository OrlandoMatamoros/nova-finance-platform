'use client'

import React, { useState, useEffect } from 'react'
import { Palette, Check, Sparkles, Download, Upload } from 'lucide-react'
import { themes, ThemeConfig, applyTheme } from '@/lib/config/themeConfig'

interface ThemeConfiguratorProps {
  onThemeChange?: (theme: ThemeConfig) => void
  currentTheme?: string
}

const ThemeConfigurator: React.FC<ThemeConfiguratorProps> = ({ 
  onThemeChange, 
  currentTheme = 'spaceBlue' 
}) => {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [customColors, setCustomColors] = useState({
    primary: '#0066ff',
    secondary: '#a855f7',
    accent: '#d946ef'
  })
  const [clientBranding, setClientBranding] = useState({
    businessName: 'Brooklyn Bistro',
    logo: null as string | null,
    industry: 'restaurant'
  })

  useEffect(() => {
    const theme = themes[selectedTheme]
    if (theme) {
      applyTheme(theme)
      onThemeChange?.(theme)
    }
  }, [selectedTheme])

  const handleThemeSelect = (themeName: string) => {
    setSelectedTheme(themeName)
  }

  const handleCustomColorChange = (colorType: string, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [colorType]: value
    }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setClientBranding(prev => ({
          ...prev,
          logo: event.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const saveConfiguration = () => {
    const config = {
      theme: selectedTheme,
      customColors,
      branding: clientBranding,
      timestamp: new Date().toISOString()
    }
    
    // Guardar en localStorage para demo
    localStorage.setItem('dashboardConfig', JSON.stringify(config))
    
    // En producción, esto se guardaría en Firebase
    console.log('Configuración guardada:', config)
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                    rounded-2xl border border-white/10">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                Configuración de Identidad Visual
              </h3>
              <p className="text-white/60 text-sm">
                Personaliza el dashboard con los colores de tu marca
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCustomizer(!showCustomizer)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 
                     hover:text-white transition-all text-sm font-medium"
          >
            {showCustomizer ? 'Ocultar' : 'Personalizar'}
          </button>
        </div>
      </div>

      {/* Información del Cliente */}
      <div className="p-6 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-white/60 text-xs block mb-2">Nombre del Negocio</label>
            <input
              type="text"
              value={clientBranding.businessName}
              onChange={(e) => setClientBranding(prev => ({ ...prev, businessName: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                       text-white placeholder-white/40 focus:bg-white/20 focus:border-white/40 
                       transition-all"
              placeholder="Nombre de tu negocio"
            />
          </div>
          
          <div>
            <label className="text-white/60 text-xs block mb-2">Industria</label>
            <select
              value={clientBranding.industry}
              onChange={(e) => setClientBranding(prev => ({ ...prev, industry: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:bg-white/20 focus:border-white/40 transition-all"
            >
              <option value="restaurant">Restaurante</option>
              <option value="retail">Retail</option>
              <option value="minimarket">Minimarket</option>
              <option value="service">Servicios</option>
              <option value="healthcare">Salud</option>
              <option value="other">Otro</option>
            </select>
          </div>
          
          <div>
            <label className="text-white/60 text-xs block mb-2">Logo de la Empresa</label>
            <div className="flex items-center gap-2">
              {clientBranding.logo ? (
                <img 
                  src={clientBranding.logo} 
                  alt="Logo" 
                  className="w-10 h-10 rounded-lg object-cover bg-white/10"
                />
              ) : (
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white/40" />
                </div>
              )}
              <label className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg 
                              text-white/80 hover:text-white transition-all text-sm 
                              font-medium cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                Subir Logo
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Temas Predefinidos */}
      <div className="p-6">
        <h4 className="text-white font-semibold mb-4">Temas Predefinidos</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => handleThemeSelect(key)}
              className={`
                relative p-4 rounded-xl border-2 transition-all
                ${selectedTheme === key 
                  ? 'border-purple-500 bg-white/10' 
                  : 'border-white/10 hover:border-white/20 bg-white/5'
                }
              `}
            >
              {/* Preview de colores */}
              <div className="flex gap-2 mb-3">
                <div 
                  className="w-8 h-8 rounded-lg shadow-sm"
                  style={{ backgroundColor: theme.primary[500] }}
                />
                <div 
                  className="w-8 h-8 rounded-lg shadow-sm"
                  style={{ backgroundColor: theme.primary[700] }}
                />
                <div 
                  className="w-8 h-8 rounded-lg shadow-sm"
                  style={{ backgroundColor: theme.accent[500] }}
                />
              </div>
              
              <p className="text-white text-sm font-medium text-left">
                {theme.name}
              </p>
              
              {/* Industrias recomendadas */}
              <p className="text-white/40 text-xs text-left mt-1">
                {key === 'spaceBlue' && 'Tech, SaaS'}
                {key === 'emeraldGreen' && 'Eco, Salud'}
                {key === 'fireRed' && 'Food, Delivery'}
                {key === 'royalPurple' && 'Premium, Lujo'}
                {key === 'professionalGray' && 'B2B, Consultoría'}
                {key === 'goldPremium' && 'Joyería, Fashion'}
              </p>
              
              {selectedTheme === key && (
                <div className="absolute top-2 right-2 p-1 bg-purple-500 rounded-full">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Personalizador Avanzado */}
      {showCustomizer && (
        <div className="p-6 border-t border-white/10">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Personalización Avanzada
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-white/60 text-xs block mb-2">
                Color Primario
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={customColors.primary}
                  onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                           text-white text-sm font-mono"
                />
              </div>
            </div>
            
            <div>
              <label className="text-white/60 text-xs block mb-2">
                Color Secundario
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColors.secondary}
                  onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={customColors.secondary}
                  onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                           text-white text-sm font-mono"
                />
              </div>
            </div>
            
            <div>
              <label className="text-white/60 text-xs block mb-2">
                Color de Acento
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColors.accent}
                  onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={customColors.accent}
                  onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                           text-white text-sm font-mono"
                />
              </div>
            </div>
          </div>
          
          {/* Vista previa en tiempo real */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl">
            <p className="text-white/60 text-xs mb-3">Vista Previa</p>
            <div className="flex gap-4">
              <div 
                className="flex-1 h-20 rounded-lg shadow-lg flex items-center justify-center text-white font-semibold"
                style={{ 
                  background: `linear-gradient(135deg, ${customColors.primary}, ${customColors.secondary})`
                }}
              >
                Gradiente Principal
              </div>
              <div 
                className="flex-1 h-20 rounded-lg shadow-lg flex items-center justify-center text-white font-semibold"
                style={{ 
                  background: `linear-gradient(135deg, ${customColors.secondary}, ${customColors.accent})`
                }}
              >
                Gradiente Acento
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botones de Acción */}
      <div className="p-6 border-t border-white/10 flex justify-between">
        <button
          onClick={() => {
            const config = localStorage.getItem('dashboardConfig')
            if (config) {
              const parsed = JSON.parse(config)
              setSelectedTheme(parsed.theme)
              setCustomColors(parsed.customColors)
              setClientBranding(parsed.branding)
            }
          }}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 
                   hover:text-white transition-all text-sm font-medium flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Cargar Configuración
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedTheme('spaceBlue')
              setCustomColors({
                primary: '#0066ff',
                secondary: '#a855f7',
                accent: '#d946ef'
              })
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 
                     hover:text-white transition-all text-sm font-medium"
          >
            Restablecer
          </button>
          
          <button
            onClick={saveConfiguration}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                     rounded-lg font-medium hover:shadow-lg transition-all hover:scale-[1.02]
                     flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  )
}

export default ThemeConfigurator