'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { RestaurantDataGenerator } from '@/lib/data/restaurantDataGenerator'
import AdvancedTimeSelector, { TimeRange } from './AdvancedTimeSelector'
import TimeComparisonCards from './TimeComparisonCards'
import RealTimeAIAnalysis from './RealTimeAIAnalysis'
import { 
  RefreshCw, Download, Share2, Settings, Sliders, 
  Brain, FileText, Palette, Target, Database, Upload,
  Cpu, MessageCircle, Menu, X
} from 'lucide-react'

// Cargar componentes pesados dinámicamente
const RevenueChart = dynamic(() => import('./RevenueChart'), { ssr: false })
const ExpenseBreakdown = dynamic(() => import('./ExpenseBreakdown'), { ssr: false })
const WhatIfSimulator = dynamic(() => import('./WhatIfSimulator'), { ssr: false })
const ThemeConfigurator = dynamic(() => import('./ThemeConfigurator'), { ssr: false })
const PDFReportGenerator = dynamic(() => import('./PDFReportGenerator'), { ssr: false })
const GoalSeeker = dynamic(() => import('./GoalSeeker'), { ssr: false })
const SolverOptimizer = dynamic(() => import('./SolverOptimizer'), { ssr: false })
const DataConnector = dynamic(() => import('./DataConnector'), { ssr: false })
const WhatsAppIntegration = dynamic(() => import('./WhatsAppIntegration'), { ssr: false })

// Vista de pestañas para organizar mejor
type ViewMode = 'dashboard' | 'whatif' | 'reports' | 'theme' | 'goalseek' | 'solver' | 'data' | 'whatsapp'

const AdvancedDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange | null>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  const [activeView, setActiveView] = useState<ViewMode>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  const handleDataImport = (data: any) => {
    console.log('Datos importados:', data)
    // Aquí procesarías los datos importados
    alert('Datos importados exitosamente. Se actualizará el dashboard.')
  }

  // Menú de navegación mejorado con TODOS los componentes
  const navigationItems = [
    { 
      id: 'dashboard' as ViewMode, 
      label: 'Dashboard', 
      icon: <Brain className="w-4 h-4" />,
      color: 'from-blue-600 to-purple-600',
      description: 'Vista principal con KPIs'
    },
    { 
      id: 'whatif' as ViewMode, 
      label: 'What-If', 
      icon: <Sliders className="w-4 h-4" />,
      color: 'from-purple-600 to-pink-600',
      description: 'Simulador de escenarios'
    },
    { 
      id: 'goalseek' as ViewMode, 
      label: 'Goal Seeker', 
      icon: <Target className="w-4 h-4" />,
      color: 'from-green-600 to-teal-600',
      description: 'Busca cómo alcanzar tus metas'
    },
    { 
      id: 'solver' as ViewMode, 
      label: 'Solver', 
      icon: <Cpu className="w-4 h-4" />,
      color: 'from-indigo-600 to-purple-600',
      description: 'Optimización multi-objetivo',
      badge: 'AI'
    },
    { 
      id: 'reports' as ViewMode, 
      label: 'Reportes', 
      icon: <FileText className="w-4 h-4" />,
      color: 'from-orange-600 to-red-600',
      description: 'Genera reportes PDF'
    },
    { 
      id: 'data' as ViewMode, 
      label: 'Datos', 
      icon: <Database className="w-4 h-4" />,
      color: 'from-cyan-600 to-blue-600',
      description: 'Carga CSV y conecta POS'
    },
    { 
      id: 'whatsapp' as ViewMode, 
      label: 'WhatsApp', 
      icon: <MessageCircle className="w-4 h-4" />,
      color: 'from-green-600 to-green-700',
      description: 'Alertas automáticas',
      badge: 'Nuevo'
    },
    { 
      id: 'theme' as ViewMode, 
      label: 'Tema', 
      icon: <Palette className="w-4 h-4" />,
      color: 'from-pink-600 to-purple-600',
      description: 'Personaliza colores'
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

      <div className="relative z-10 flex">
        {/* Sidebar para desktop */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-black/40 backdrop-blur-xl 
          border-r border-white/10 transform transition-transform duration-300 lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">Nova Finance</h2>
              <p className="text-white/60 text-xs mt-1">Platform v2.0</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {navigationItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id)
                      setSidebarOpen(false)
                    }}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl transition-all
                      ${activeView === item.id 
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : 'hover:bg-white/10 text-white/80 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-xs opacity-60">{item.description}</p>
                        </div>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </nav>

            {/* User info */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  B
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Brooklyn Bistro</p>
                  <p className="text-white/60 text-xs">Plan Premium</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {/* Header */}
          <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Mobile menu button */}
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                  </button>
                  
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      {navigationItems.find(item => item.id === activeView)?.label}
                    </h1>
                    <p className="text-white/60 text-sm">
                      {navigationItems.find(item => item.id === activeView)?.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {mounted && lastUpdate && (
                    <span className="text-white/40 text-sm hidden md:block">
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
                    <Settings className="w-4 h-4 text-white/80 group-hover:text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-4 md:p-8">
            {/* Time Selector - Visible en dashboard y what-if */}
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
            {activeView === 'goalseek' && dashboardData && (
              <GoalSeeker currentData={dashboardData} />
            )}

            {/* Vista Solver/Optimizer */}
            {activeView === 'solver' && dashboardData && (
              <SolverOptimizer currentData={dashboardData} />
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
              <DataConnector onDataImport={handleDataImport} />
            )}

            {/* Vista WhatsApp */}
            {activeView === 'whatsapp' && (
              <WhatsAppIntegration businessData={dashboardData} />
            )}

            {/* Vista Theme Configurator */}
            {activeView === 'theme' && (
              <ThemeConfigurator 
                currentTheme="spaceBlue"
                onThemeChange={(theme) => console.log('Tema cambiado:', theme)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay cuando el sidebar está abierto */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default AdvancedDashboard
