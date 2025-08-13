'use client'

import React, { useState, useEffect } from 'react'
import { 
  Calculator, TrendingUp, TrendingDown, AlertTriangle, 
  DollarSign, Users, Package, Percent, Brain, 
  Download, Save, Upload, BarChart3, Sparkles
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'

interface Scenario {
  id: string
  name: string
  description?: string
  variables: {
    salesChange: number
    priceChange: number
    costChange: number
    laborChange: number
    trafficChange: number
    marketingChange?: number
    overheadChange?: number
  }
  results?: SimulationResults
  createdAt?: Date
  isAIGenerated?: boolean
}

interface SimulationResults {
  revenue: number
  costs: number
  profit: number
  margin: number
  breakeven: number
  roi: number
  changes: {
    revenue: number
    profit: number
    margin: number
    costs: number
  }
  impact: {
    daily: number
    weekly: number
    monthly: number
    yearly: number
  }
  byCategory?: {
    food: { current: number; simulated: number }
    labor: { current: number; simulated: number }
    overhead: { current: number; simulated: number }
    marketing: { current: number; simulated: number }
  }
}

interface WhatIfSimulatorProps {
  currentData: any
  onScenarioApply?: (scenario: Scenario) => void
}

const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ currentData, onScenarioApply }) => {
  // Estados principales
  const [activeScenario, setActiveScenario] = useState<'optimistic' | 'realistic' | 'pessimistic' | 'custom'>('realistic')
  const [customValues, setCustomValues] = useState({
    salesChange: 0,
    priceChange: 0,
    costChange: 0,
    laborChange: 0,
    trafficChange: 0,
    marketingChange: 0,
    overheadChange: 0
  })
  
  // Escenarios predefinidos con lógica real
  const [scenarios, setScenarios] = useState<Record<string, Scenario>>({
    optimistic: {
      id: 'optimistic',
      name: 'Escenario Optimista',
      description: 'Crecimiento agresivo con eficiencias operativas',
      variables: {
        salesChange: 15,
        priceChange: 5,
        costChange: -3,
        laborChange: -2,
        trafficChange: 10,
        marketingChange: 20,
        overheadChange: -5
      }
    },
    realistic: {
      id: 'realistic',
      name: 'Escenario Realista',
      description: 'Crecimiento sostenible con inversión moderada',
      variables: {
        salesChange: 5,
        priceChange: 2,
        costChange: 2,
        laborChange: 0,
        trafficChange: 3,
        marketingChange: 10,
        overheadChange: 1
      }
    },
    pessimistic: {
      id: 'pessimistic',
      name: 'Escenario Pesimista',
      description: 'Recesión con aumento de costos',
      variables: {
        salesChange: -10,
        priceChange: 0,
        costChange: 5,
        laborChange: 3,
        trafficChange: -15,
        marketingChange: -30,
        overheadChange: 8
      }
    },
    custom: {
      id: 'custom',
      name: 'Escenario Personalizado',
      description: 'Define tus propios parámetros',
      variables: customValues
    }
  })

  const [results, setResults] = useState<SimulationResults | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>([])
  const [showComparison, setShowComparison] = useState(true)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  // Extraer métricas base del negocio con valores por defecto seguros
  const baseMetrics = {
    revenue: currentData?.totals?.sales || 125000,
    costs: currentData?.totals?.costs || 100000,
    profit: currentData?.totals?.netProfit || 25000,
    covers: currentData?.totals?.covers || 3000,
    avgTicket: currentData?.averages?.ticketSize || 42,
    // Desglose de costos basado en estándares de la industria
    foodCost: (currentData?.totals?.costs || 100000) * 0.35,
    laborCost: (currentData?.totals?.costs || 100000) * 0.30,
    overheadCost: (currentData?.totals?.costs || 100000) * 0.20,
    marketingCost: (currentData?.totals?.costs || 100000) * 0.10,
    otherCosts: (currentData?.totals?.costs || 100000) * 0.05
  }

  // Cargar escenarios guardados del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('whatif_scenarios')
    if (saved) {
      setSavedScenarios(JSON.parse(saved))
    }
  }, [])

  // Recalcular cuando cambian los valores
  useEffect(() => {
    calculateScenario()
  }, [activeScenario, customValues])

  // FUNCIÓN PRINCIPAL: Cálculos matemáticos reales
  const calculateScenario = () => {
    setIsCalculating(true)
    
    const scenario = scenarios[activeScenario]
    const vars = activeScenario === 'custom' ? customValues : scenario.variables
    
    // === CÁLCULOS MATEMÁTICOS REALES ===
    
    // 1. Calcular nuevo tráfico de clientes
    const newTraffic = baseMetrics.covers * (1 + vars.trafficChange / 100)
    
    // 2. Calcular nuevo ticket promedio con cambio de precio
    const newAvgTicket = baseMetrics.avgTicket * (1 + vars.priceChange / 100)
    
    // 3. Calcular impacto en volumen de ventas
    const volumeImpact = 1 + vars.salesChange / 100
    
    // 4. Calcular nuevos ingresos (tráfico × ticket × volumen)
    const newRevenue = newTraffic * newAvgTicket * volumeImpact
    
    // 5. Calcular cada categoría de costos con sus cambios
    const newFoodCost = baseMetrics.foodCost * (1 + vars.costChange / 100)
    const newLaborCost = baseMetrics.laborCost * (1 + vars.laborChange / 100)
    const newOverheadCost = baseMetrics.overheadCost * (1 + (vars.overheadChange || 0) / 100)
    const newMarketingCost = baseMetrics.marketingCost * (1 + (vars.marketingChange || 0) / 100)
    const newOtherCosts = baseMetrics.otherCosts // Costos fijos
    
    // 6. Calcular costos totales
    const newCosts = newFoodCost + newLaborCost + newOverheadCost + newMarketingCost + newOtherCosts
    
    // 7. Calcular utilidad y márgenes
    const newProfit = newRevenue - newCosts
    const newMargin = (newProfit / newRevenue) * 100
    const currentMargin = (baseMetrics.profit / baseMetrics.revenue) * 100
    
    // 8. Calcular punto de equilibrio
    const fixedCosts = newOverheadCost + newOtherCosts
    const variableCostRatio = (newFoodCost + newLaborCost) / newRevenue
    const breakeven = fixedCosts / (1 - variableCostRatio)
    
    // 9. Calcular ROI de los cambios
    const investmentRequired = Math.abs(vars.marketingChange || 0) * baseMetrics.marketingCost / 100
    const roi = investmentRequired > 0 ? ((newProfit - baseMetrics.profit) / investmentRequired) * 100 : 0
    
    // 10. Calcular cambios porcentuales
    const revenueChange = ((newRevenue - baseMetrics.revenue) / baseMetrics.revenue) * 100
    const profitChange = ((newProfit - baseMetrics.profit) / baseMetrics.profit) * 100
    const marginChange = newMargin - currentMargin
    const costsChange = ((newCosts - baseMetrics.costs) / baseMetrics.costs) * 100
    
    // Simular delay para mostrar que está procesando
    setTimeout(() => {
      setResults({
        revenue: newRevenue,
        costs: newCosts,
        profit: newProfit,
        margin: newMargin,
        breakeven: breakeven,
        roi: roi,
        changes: {
          revenue: revenueChange,
          profit: profitChange,
          margin: marginChange,
          costs: costsChange
        },
        impact: {
          daily: newProfit / 30,
          weekly: newProfit / 4.33,
          monthly: newProfit,
          yearly: newProfit * 12
        },
        byCategory: {
          food: { current: baseMetrics.foodCost, simulated: newFoodCost },
          labor: { current: baseMetrics.laborCost, simulated: newLaborCost },
          overhead: { current: baseMetrics.overheadCost, simulated: newOverheadCost },
          marketing: { current: baseMetrics.marketingCost, simulated: newMarketingCost }
        }
      })
      setIsCalculating(false)
    }, 300)
  }

  // Manejar cambios en sliders
  const handleSliderChange = (variable: keyof typeof customValues, value: number) => {
    setCustomValues(prev => ({
      ...prev,
      [variable]: value
    }))
  }

  // Guardar escenario personalizado
  const saveScenario = () => {
    const newScenario: Scenario = {
      id: `custom_${Date.now()}`,
      name: prompt('Nombre del escenario:') || 'Escenario sin nombre',
      description: prompt('Descripción (opcional):') || undefined,
      variables: { ...customValues },
      results: results || undefined,
      createdAt: new Date()
    }
    
    const updated = [...savedScenarios, newScenario]
    setSavedScenarios(updated)
    localStorage.setItem('whatif_scenarios', JSON.stringify(updated))
    alert('Escenario guardado exitosamente')
  }

  // Cargar escenario guardado
  const loadScenario = (scenario: Scenario) => {
    setCustomValues({
      ...scenario.variables,
      marketingChange: scenario.variables.marketingChange ?? 0,
      overheadChange: scenario.variables.overheadChange ?? 0
    })
    setActiveScenario('custom')
  }

  // Generar escenario óptimo con IA
  const generateAIScenario = async () => {
    setIsGeneratingAI(true)
    
    try {
      // Intentar usar la API de Gemini
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentMetrics: baseMetrics,
          objectives: 'Maximizar rentabilidad en 20% manteniendo calidad',
          constraints: 'Cambios realistas implementables en 3 meses',
          mode: 'optimization'
        })
      })

      const data = await response.json()
      
      if (data.success && data.scenario) {
        // Usar el escenario generado por Gemini
        const aiScenario = {
          salesChange: data.scenario.salesChange,
          priceChange: data.scenario.priceChange,
          costChange: data.scenario.costChange,
          laborChange: data.scenario.laborChange,
          trafficChange: data.scenario.trafficChange,
          marketingChange: data.scenario.marketingChange || 0,
          overheadChange: data.scenario.overheadChange || 0
        }
        
        setCustomValues(aiScenario)
        setActiveScenario('custom')
        
        // Guardar el escenario con metadata adicional
        const newAIScenario: Scenario = {
          id: `ai_${Date.now()}`,
          name: '🤖 Escenario IA Optimizado',
          description: data.scenario.reasoning || `Optimizado por Gemini AI`,
          variables: aiScenario,
          isAIGenerated: true,
          createdAt: new Date()
        }
        
        const updated = [...savedScenarios, newAIScenario]
        setSavedScenarios(updated)
        localStorage.setItem('whatif_scenarios', JSON.stringify(updated))
        
        // Mostrar notificación de éxito (opcional)
        console.log('Escenario optimizado generado:', data.scenario)
        
      } else if (data.fallbackScenario) {
        // Usar el escenario de fallback
        setCustomValues(data.fallbackScenario)
        setActiveScenario('custom')
      }
      
    } catch (error) {
      console.error('Error generando escenario con IA:', error)
      
      // Fallback local basado en heurísticas
      const margin = (baseMetrics.profit / baseMetrics.revenue) * 100
      
      let aiScenario: typeof customValues
      
      if (margin < 10) {
        // Margen bajo: enfoque en eficiencia
        aiScenario = {
          salesChange: 8,
          priceChange: 3,
          costChange: -5,
          laborChange: -3,
          trafficChange: 5,
          marketingChange: 15,
          overheadChange: -8
        }
      } else if (margin < 20) {
        // Margen medio: crecimiento balanceado
        aiScenario = {
          salesChange: 12,
          priceChange: 4,
          costChange: -2,
          laborChange: 2,
          trafficChange: 10,
          marketingChange: 25,
          overheadChange: -3
        }
      } else {
        // Margen alto: expansión agresiva
        aiScenario = {
          salesChange: 20,
          priceChange: 5,
          costChange: 3,
          laborChange: 5,
          trafficChange: 15,
          marketingChange: 40,
          overheadChange: 5
        }
      }
      
      setCustomValues(aiScenario)
      setActiveScenario('custom')
      
      // Agregar a escenarios con marca de IA (local)
      const newAIScenario: Scenario = {
        id: `ai_local_${Date.now()}`,
        name: '🤖 Escenario Optimizado (Local)',
        description: `Generado localmente para margen del ${margin.toFixed(1)}%`,
        variables: aiScenario,
        isAIGenerated: true
      }
      
      const updated = [...savedScenarios, newAIScenario]
      setSavedScenarios(updated)
      localStorage.setItem('whatif_scenarios', JSON.stringify(updated))
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // Exportar resultados
  const exportResults = () => {
    if (!results) return
    
    const exportData = {
      scenario: scenarios[activeScenario].name,
      timestamp: new Date().toISOString(),
      baseMetrics,
      variables: activeScenario === 'custom' ? customValues : scenarios[activeScenario].variables,
      results
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `whatif_scenario_${Date.now()}.json`
    a.click()
  }

  // Preparar datos para gráficos
  const comparisonData = results ? [
    {
      metric: 'Ingresos',
      actual: baseMetrics.revenue,
      simulado: results.revenue,
      cambio: results.changes.revenue
    },
    {
      metric: 'Costos',
      actual: baseMetrics.costs,
      simulado: results.costs,
      cambio: results.changes.costs
    },
    {
      metric: 'Utilidad',
      actual: baseMetrics.profit,
      simulado: results.profit,
      cambio: results.changes.profit
    }
  ] : []

  const radarData = results ? [
    {
      metric: 'Ventas',
      actual: 100,
      simulado: 100 + (activeScenario === 'custom' ? customValues.salesChange : scenarios[activeScenario].variables.salesChange)
    },
    {
      metric: 'Precios',
      actual: 100,
      simulado: 100 + (activeScenario === 'custom' ? customValues.priceChange : scenarios[activeScenario].variables.priceChange)
    },
    {
      metric: 'Costos',
      actual: 100,
      simulado: 100 - (activeScenario === 'custom' ? customValues.costChange : scenarios[activeScenario].variables.costChange)
    },
    {
      metric: 'Personal',
      actual: 100,
      simulado: 100 - (activeScenario === 'custom' ? customValues.laborChange : scenarios[activeScenario].variables.laborChange)
    },
    {
      metric: 'Tráfico',
      actual: 100,
      simulado: 100 + (activeScenario === 'custom' ? customValues.trafficChange : scenarios[activeScenario].variables.trafficChange)
    },
    {
      metric: 'Marketing',
      actual: 100,
      simulado: 100 + (activeScenario === 'custom' ? customValues.marketingChange : scenarios[activeScenario].variables.marketingChange || 0)
    }
  ] : []

  // Funciones de utilidad para colores
  const getImpactColor = (value: number) => {
    if (value > 10) return 'text-green-400'
    if (value > 0) return 'text-green-300'
    if (value === 0) return 'text-gray-400'
    if (value > -10) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getImpactIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4" />
    if (value < 0) return <TrendingDown className="w-4 h-4" />
    return <span className="w-4 h-4">→</span>
  }

  const getViabilityColor = (profit: number) => {
    const changePercent = ((profit - baseMetrics.profit) / baseMetrics.profit) * 100
    if (changePercent > 20) return 'bg-green-500'
    if (changePercent > 0) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                    rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6 text-purple-400" />
          <h3 className="text-white font-bold text-xl">Simulador What-If</h3>
          <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 
                         text-black text-xs font-bold rounded-full animate-pulse">
            PREMIUM
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generateAIScenario}
            disabled={isGeneratingAI}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 
                     text-white text-sm rounded-lg hover:shadow-lg transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGeneratingAI ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Optimizar con IA
              </>
            )}
          </button>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg 
                     hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {showComparison ? 'Ocultar' : 'Mostrar'} Gráficos
          </button>
          <button
            onClick={exportResults}
            disabled={!results}
            className="px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg 
                     hover:bg-white/20 transition-all disabled:opacity-50 
                     disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Selector de Escenarios */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {Object.entries(scenarios).map(([key, scenario]) => (
          <button
            key={key}
            onClick={() => setActiveScenario(key as any)}
            className={`
              px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${activeScenario === key
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white/80'
              }
            `}
          >
            <div className="text-left">
              <div className="font-medium">{scenario.name}</div>
              {scenario.description && (
                <div className="text-xs opacity-70 mt-1">{scenario.description}</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Variables de Ajuste */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ventas */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/80 text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-400" />
                Cambio en Ventas
              </label>
              <span className={`font-bold ${getImpactColor(activeScenario === 'custom' ? customValues.salesChange : scenarios[activeScenario].variables.salesChange)}`}>
                {activeScenario === 'custom' ? customValues.salesChange : scenarios[activeScenario].variables.salesChange}%
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={activeScenario === 'custom' ? customValues.salesChange : scenarios[activeScenario].variables.salesChange}
              onChange={(e) => {
                setActiveScenario('custom')
                handleSliderChange('salesChange', Number(e.target.value))
              }}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>-50%</span>
              <span>0</span>
              <span>+50%</span>
            </div>
          </div>

          {/* Precios */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/80 text-sm flex items-center gap-2">
                <Percent className="w-4 h-4 text-purple-400" />
                Cambio en Precios
              </label>
              <span className={`font-bold ${getImpactColor(activeScenario === 'custom' ? customValues.priceChange : scenarios[activeScenario].variables.priceChange)}`}>
                {activeScenario === 'custom' ? customValues.priceChange : scenarios[activeScenario].variables.priceChange}%
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              value={activeScenario === 'custom' ? customValues.priceChange : scenarios[activeScenario].variables.priceChange}
              onChange={(e) => {
                setActiveScenario('custom')
                handleSliderChange('priceChange', Number(e.target.value))
              }}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>-20%</span>
              <span>0</span>
              <span>+20%</span>
            </div>
          </div>

          {/* Costos */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/80 text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-400" />
                Cambio en Costos
              </label>
              <span className={`font-bold ${getImpactColor(-(activeScenario === 'custom' ? customValues.costChange : scenarios[activeScenario].variables.costChange))}`}>
                {activeScenario === 'custom' ? customValues.costChange : scenarios[activeScenario].variables.costChange}%
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              value={activeScenario === 'custom' ? customValues.costChange : scenarios[activeScenario].variables.costChange}
              onChange={(e) => {
                setActiveScenario('custom')
                handleSliderChange('costChange', Number(e.target.value))
              }}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>-20%</span>
              <span>0</span>
              <span>+20%</span>
            </div>
          </div>

          {/* Personal */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/80 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-green-400" />
                Cambio en Personal
              </label>
              <span className={`font-bold ${getImpactColor(-(activeScenario === 'custom' ? customValues.laborChange : scenarios[activeScenario].variables.laborChange))}`}>
                {activeScenario === 'custom' ? customValues.laborChange : scenarios[activeScenario].variables.laborChange}%
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              value={activeScenario === 'custom' ? customValues.laborChange : scenarios[activeScenario].variables.laborChange}
              onChange={(e) => {
                setActiveScenario('custom')
                handleSliderChange('laborChange', Number(e.target.value))
              }}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>-20%</span>
              <span>0</span>
              <span>+20%</span>
            </div>
          </div>
        </div>

        {/* Botones de acción para escenario personalizado */}
        {activeScenario === 'custom' && (
          <div className="flex gap-2">
            <button
              onClick={saveScenario}
              className="px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg 
                       hover:bg-green-600/30 transition-all flex items-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" />
              Guardar Escenario
            </button>
          </div>
        )}
      </div>

      {/* Resultados */}
      {results && !isCalculating && (
        <div className="space-y-4">
          {/* Semáforo de Viabilidad */}
          <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
            <div className={`w-3 h-3 rounded-full ${getViabilityColor(results.profit)}`} />
            <span className="text-white/80 text-sm">
              Viabilidad: {
                results.changes.profit > 20 ? 'Excelente' :
                results.changes.profit > 0 ? 'Buena' : 'Riesgosa'
              }
            </span>
            {results.roi > 0 && (
              <span className="ml-auto text-green-400 font-bold">
                ROI: {results.roi.toFixed(1)}%
              </span>
            )}
          </div>

          {/* Métricas Principales */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-white/60 text-xs mb-1">Ingresos Proyectados</p>
              <p className="text-2xl font-bold text-white">
                ${results.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
              <div className={`flex items-center gap-1 mt-2 ${getImpactColor(results.changes.revenue)}`}>
                {getImpactIcon(results.changes.revenue)}
                <span className="text-sm font-medium">
                  {results.changes.revenue > 0 ? '+' : ''}{results.changes.revenue.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-white/60 text-xs mb-1">Utilidad Proyectada</p>
              <p className="text-2xl font-bold text-white">
                ${results.profit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
              <div className={`flex items-center gap-1 mt-2 ${getImpactColor(results.changes.profit)}`}>
                {getImpactIcon(results.changes.profit)}
                <span className="text-sm font-medium">
                  {results.changes.profit > 0 ? '+' : ''}{results.changes.profit.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-white/60 text-xs mb-1">Margen Proyectado</p>
              <p className="text-2xl font-bold text-white">
                {results.margin.toFixed(1)}%
              </p>
              <div className={`flex items-center gap-1 mt-2 ${getImpactColor(results.changes.margin)}`}>
                {getImpactIcon(results.changes.margin)}
                <span className="text-sm font-medium">
                  {results.changes.margin > 0 ? '+' : ''}{results.changes.margin.toFixed(1)} pts
                </span>
              </div>
            </div>
          </div>

          {/* Gráficos de Comparación */}
          {showComparison && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gráfico de Barras */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-white text-sm font-medium mb-3">Comparación Actual vs Simulado</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="metric" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)' 
                      }}
                      formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                    />
                    <Bar dataKey="actual" fill="#3B82F6" />
                    <Bar dataKey="simulado" fill="#A855F7" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico Radar */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-white text-sm font-medium mb-3">Impacto por Variable</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="metric" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <PolarRadiusAxis stroke="rgba(255,255,255,0.1)" fontSize={10} />
                    <Radar name="Actual" dataKey="actual" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    <Radar name="Simulado" dataKey="simulado" stroke="#A855F7" fill="#A855F7" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Impacto Temporal */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-4 border border-purple-500/30">
            <p className="text-white/80 text-sm mb-3 font-medium">
              💰 Impacto Proyectado en Utilidades
            </p>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-white/60 text-xs">Diario</p>
                <p className="text-white font-bold">
                  ${results.impact.daily.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-white/60 text-xs">Semanal</p>
                <p className="text-white font-bold">
                  ${results.impact.weekly.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-white/60 text-xs">Mensual</p>
                <p className="text-white font-bold">
                  ${results.impact.monthly.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-white/60 text-xs">Anual</p>
                <p className="text-green-400 font-bold text-lg">
                  ${results.impact.yearly.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>

          {/* Desglose por Categoría */}
          {results.byCategory && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white text-sm font-medium mb-3">Desglose de Costos</h4>
              <div className="space-y-2">
                {Object.entries(results.byCategory).map(([category, values]) => (
                  <div key={category} className="flex items-center justify-between text-sm">
                    <span className="text-white/70 capitalize">{category}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-white/50">
                        ${values.current.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-white/30">→</span>
                      <span className={values.simulated > values.current ? 'text-red-400' : 'text-green-400'}>
                        ${values.simulated.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendación de IA */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm mb-1">
                  Análisis de Nova AI
                </p>
                <p className="text-white/70 text-sm">
                  {results.changes.profit > 20 
                    ? "Escenario muy favorable. Los indicadores muestran un crecimiento sostenible. Considera implementar estos cambios gradualmente para validar el impacto real y ajustar según los resultados."
                    : results.changes.profit > 0
                    ? "Escenario positivo. Los ajustes propuestos pueden mejorar tu rentabilidad sin riesgos significativos. Recomiendo monitorear de cerca los costos durante la implementación."
                    : results.changes.profit > -10
                    ? "Escenario de precaución. Aunque hay pérdida de rentabilidad, podría ser necesario para mantener competitividad. Evalúa cuidadosamente cada variable antes de implementar."
                    : "Escenario de alto riesgo. La pérdida proyectada es significativa. Recomiendo ajustar las variables para encontrar un balance más sostenible o considerar estrategias alternativas."
                  }
                </p>
                {results.roi > 50 && (
                  <div className="mt-2 p-2 bg-green-500/10 rounded-lg border border-green-500/30">
                    <p className="text-green-400 text-xs">
                      ✨ ROI excepcional detectado ({results.roi.toFixed(1)}%). Este escenario tiene alto potencial de retorno.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3">
            <button
              onClick={() => onScenarioApply && onScenarioApply(scenarios[activeScenario])}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl 
                       font-medium hover:shadow-lg transition-all hover:scale-[1.02] flex items-center 
                       justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Aplicar Escenario al Dashboard
            </button>
          </div>

          {/* Escenarios Guardados */}
          {savedScenarios.length > 0 && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white text-sm font-medium mb-3">Escenarios Guardados</h4>
              <div className="space-y-2">
                {savedScenarios.map((scenario) => (
                  <div key={scenario.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      {scenario.isAIGenerated && <Sparkles className="w-4 h-4 text-purple-400" />}
                      <span className="text-white/80 text-sm">{scenario.name}</span>
                    </div>
                    <button
                      onClick={() => loadScenario(scenario)}
                      className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs hover:bg-blue-600/30"
                    >
                      Cargar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isCalculating && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4" />
            <p className="text-white/60 text-sm">Calculando escenario...</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-white/40 text-xs">
          Powered by Impulsa Lab
        </p>
        <p className="text-white/40 text-xs">
          Última actualización: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

export default WhatIfSimulator