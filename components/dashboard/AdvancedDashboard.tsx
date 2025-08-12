'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { RestaurantDataGenerator } from '@/lib/data/restaurantDataGenerator'
import AdvancedTimeSelector, { TimeRange } from './AdvancedTimeSelector'
import TimeComparisonCards from './TimeComparisonCards'
import RealTimeAIAnalysis from './RealTimeAIAnalysis'
import { 
  RefreshCw, Download, Share2, Settings, Sliders, 
  Brain, FileText, Palette, Target, Database, Upload
} from 'lucide-react'

// Cargar componentes pesados dinámicamente
const RevenueChart = dynamic(() => import('./RevenueChart'), { ssr: false })
const ExpenseBreakdown = dynamic(() => import('./ExpenseBreakdown'), { ssr: false })
const WhatIfSimulator = dynamic(() => import('./WhatIfSimulator'), { ssr: false })
const ThemeConfigurator = dynamic(() => import('./ThemeConfigurator'), { ssr: false })
const PDFReportGenerator = dynamic(() => import('./PDFReportGenerator'), { ssr: false })

// Vista de pestañas para organizar mejor
type ViewMode = 'dashboard' | 'whatif' | 'reports' | 'theme' | 'goalseek' | 'data'

const AdvancedDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange | null>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  const [activeView, setActiveView] = useState<ViewMode>('dashboard')

  useEffect(() => {
    setMounted(true)
    updateTimestamp()
  }, [])

  useEffect(() => {
    if (timeRange) {
      loadDashboardData(timeRange)
    }
  }, [timeRange])

  const updateTimestamp = () => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
    setLastUpdate(timeString)
  }

  const loadDashboardData = async (range: TimeRange) => {
    setIsLoading(true)
    
    const yearData = RestaurantDataGenerator.generateYearData(range.start.getFullYear())
    const currentData = RestaurantDataGenerator.aggregateData(
      yearData,
      range.start,
      range.end
    )
    
    let comparisonData = null
    if (range.comparison) {
      comparisonData = RestaurantDataGenerator.aggregateData(
        yearData,
        range.comparison.start,
        range.comparison.end
      )
    }
    
    const data = {
      current: currentData,
      comparison: comparisonData,
      timeRange: range,
      cards: {
        sales: {
          current: currentData.totals.sales,
          previous: comparisonData?.totals.sales || 0
        },
        profit: {
          current: currentData.totals.netProfit,
          previous: comparisonData?.totals.netProfit || 0
        },
        covers: {
          current: currentData.totals.covers,
          previous: comparisonData?.totals.covers || 0
        },
        avgTicket: {
          current: currentData.averages.ticketSize,
          previous: comparisonData?.averages.ticketSize || 0
        }
      },
      ...currentData
    }
    
    setDashboardData(data)
    updateTimestamp()
    
    setTimeout(() => setIsLoading(false), 500)
  }

  const handleRefresh = () => {
    if (timeRange) {
      loadDashboardData(timeRange)
    }
  }

  const handleScenarioApply = (scenario: any) => {
    console.log('Aplicando escenario:', scenario)
  }

  // Menú de navegación con iconos
  const navigationItems = [
    { 
      id: 'dashboard' as ViewMode, 
      label: 'Dashboard', 
      icon: <Brain className="w-4 h-4" />,
      color: 'from-blue-600 to-purple-600'
    },
    { 
      id: 'whatif' as ViewMode, 
      label: 'What-If', 
      icon: <Sliders className="w-4 h-4" />,
      color: 'from-purple-600 to-pink-600'
    },
    { 
      id: 'goalseek' as ViewMode, 
      label: 'Goal Seeker', 
      icon: <Target className="w-4 h-4" />,
      color: 'from-green-600 to-teal-600',
      badge: 'Nuevo'
    },
    { 
      id: 'reports' as ViewMode, 
      label: 'Reportes', 
      icon: <FileText className="w-4 h-4" />,
      color: 'from-orange-600 to-red-600'
    },
    { 
      id: 'data' as ViewMode, 
      label: 'Datos', 
      icon: <Database className="w-4 h-4" />,
      color: 'from-indigo-600 to-blue-600',
      badge: 'CSV'
    },
    { 
      id: 'theme' as ViewMode, 
      label: 'Tema', 
      icon: <Palette className="w-4 h-4" />,
      color: 'from-pink-600 to-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Efectos de fondo animados */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Nova Finance Platform
                </h1>
                <p className="text-white/60 text-sm">
                  Dashboard Inteligente para Brooklyn Bistro
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {mounted && lastUpdate && (
                  <span className="text-white/40 text-sm">
                    Última actualización: {lastUpdate}
                  </span>
                )}
                
                <button
                  onClick={handleRefresh}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group"
                >
                  <RefreshCw className={`w-4 h-4 text-white/80 group-hover:text-white ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group">
                  <Share2 className="w-4 h-4 text-white/80 group-hover:text-white" />
                </button>
                
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group">
                  <Settings className="w-4 h-4 text-white/80 group-hover:text-white" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="container mx-auto px-4">
            <div className="flex gap-2 pb-3 overflow-x-auto">
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`
                    px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap
                    ${activeView === item.id 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                      : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
                    }
                  `}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Time Selector - Siempre visible */}
          {(activeView === 'dashboard' || activeView === 'whatif') && (
            <div className="mb-8">
              <AdvancedTimeSelector onRangeChange={setTimeRange} />
            </div>
          )}

          {/* Vista del Dashboard Principal */}
          {activeView === 'dashboard' && (
            isLoading && !dashboardData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white/10 backdrop-blur rounded-2xl h-48 animate-pulse" />
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur rounded-2xl h-96 animate-pulse" />
                  <div className="bg-white/10 backdrop-blur rounded-2xl h-96 animate-pulse" />
                </div>
              </div>
            ) : dashboardData ? (
              <div className="space-y-8">
                <TimeComparisonCards
                  currentPeriod={timeRange?.label || ''}
                  previousPeriod={timeRange?.comparison?.label || ''}
                  data={dashboardData.cards}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                                rounded-2xl p-6 border border-white/10">
                    <h3 className="text-white font-semibold text-lg mb-4">Tendencia de Ingresos</h3>
                    <RevenueChart period={timeRange?.granularity || 'month'} />
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                                rounded-2xl p-6 border border-white/10">
                    <h3 className="text-white font-semibold text-lg mb-4">Distribución de Costos</h3>
                    <ExpenseBreakdown period={timeRange?.granularity || 'month'} />
                  </div>
                </div>

                <RealTimeAIAnalysis 
                  data={dashboardData}
                  period={timeRange?.label || ''}
                />
              </div>
            ) : null
          )}

          {/* Vista What-If Simulator */}
          {activeView === 'whatif' && dashboardData && (
            <WhatIfSimulator 
              currentData={dashboardData}
              onScenarioApply={handleScenarioApply}
            />
          )}

          {/* Vista Goal Seeker */}
          {activeView === 'goalseek' && (
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                          rounded-2xl p-8 border border-white/10 text-center">
              <Target className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white text-2xl font-bold mb-2">Goal Seeker</h3>
              <p className="text-white/60 mb-6">
                Define tu meta y Nova calculará exactamente qué necesitas hacer para alcanzarla
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white 
                             rounded-xl font-medium hover:shadow-lg transition-all">
                Próximamente
              </button>
            </div>
          )}

          {/* Vista Reportes */}
          {activeView === 'reports' && dashboardData && (
            <PDFReportGenerator 
              dashboardData={dashboardData}
              period={timeRange?.label || 'Período Actual'}
              businessName="Brooklyn Bistro"
            />
          )}

          {/* Vista Data Connector */}
          {activeView === 'data' && (
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                          rounded-2xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <Database className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                <h3 className="text-white text-2xl font-bold mb-2">Conector de Datos</h3>
                <p className="text-white/60">
                  Carga tus datos desde CSV, Excel o conecta directamente tu POS
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 
                               hover:border-white/20 transition-all group">
                  <Upload className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-white font-medium">Subir CSV</p>
                  <p className="text-white/60 text-sm mt-1">Arrastra o selecciona</p>
                </button>
                
                <button className="p-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 
                               hover:border-white/20 transition-all group">
                  <FileText className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-white font-medium">Excel</p>
                  <p className="text-white/60 text-sm mt-1">Importar .xlsx</p>
                </button>
                
                <button className="p-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 
                               hover:border-white/20 transition-all group">
                  <Database className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-white font-medium">Conectar POS</p>
                  <p className="text-white/60 text-sm mt-1">Square, Clover, Toast</p>
                </button>
              </div>
            </div>
          )}

          {/* Vista Theme Configurator */}
          {activeView === 'theme' && (
            <ThemeConfigurator 
              currentTheme="spaceBlue"
              onThemeChange={(theme) => console.log('Tema cambiado:', theme)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="container mx-auto px-4 py-6 mt-12 border-t border-white/10">
          <div className="text-center text-white/40 text-sm">
            <p>
              Powered by <span className="font-bold text-purple-400">Impulsa Lab</span> 
              {' '}• Sistema Multi-tenant de Inteligencia Financiera con IA
              {' '}• Demo Completo v1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedDashboard
