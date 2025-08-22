'use client'

import React, { useState, useEffect } from 'react'
import { Calculator, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Users, Package, Percent } from 'lucide-react'

interface Scenario {
  name: string
  variables: {
    salesChange: number
    priceChange: number
    costChange: number
    laborChange: number
    trafficChange: number
  }
  results?: {
    revenue: number
    costs: number
    profit: number
    margin: number
    breakeven: number
  }
}

interface WhatIfSimulatorProps {
  currentData: any
  onScenarioApply?: (scenario: Scenario) => void
}

const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ currentData, onScenarioApply }) => {
  const [activeScenario, setActiveScenario] = useState<'optimistic' | 'realistic' | 'pessimistic' | 'custom'>('realistic')
  const [customValues, setCustomValues] = useState({
    salesChange: 0,
    priceChange: 0,
    costChange: 0,
    laborChange: 0,
    trafficChange: 0
  })
  const [scenarios, setScenarios] = useState<Record<string, Scenario>>({
    optimistic: {
      name: 'Escenario Optimista',
      variables: {
        salesChange: 15,
        priceChange: 5,
        costChange: -3,
        laborChange: -2,
        trafficChange: 10
      }
    },
    realistic: {
      name: 'Escenario Realista',
      variables: {
        salesChange: 5,
        priceChange: 2,
        costChange: 2,
        laborChange: 0,
        trafficChange: 3
      }
    },
    pessimistic: {
      name: 'Escenario Pesimista',
      variables: {
        salesChange: -10,
        priceChange: 0,
        costChange: 5,
        laborChange: 3,
        trafficChange: -15
      }
    },
    custom: {
      name: 'Escenario Personalizado',
      variables: customValues
    }
  })

  const [results, setResults] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Datos base del negocio
  const baseMetrics = {
    revenue: currentData?.totals?.sales || 125000,
    costs: currentData?.totals?.costs || 100000,
    profit: currentData?.totals?.netProfit || 25000,
    covers: currentData?.totals?.covers || 3000,
    avgTicket: currentData?.averages?.ticketSize || 42
  }

  useEffect(() => {
    calculateScenario()
  }, [activeScenario, customValues])

  const calculateScenario = () => {
    setIsCalculating(true)
    
    const scenario = scenarios[activeScenario]
    const vars = activeScenario === 'custom' ? customValues : scenario.variables
    
    // Calcular impacto en ingresos
    const newRevenue = baseMetrics.revenue * (1 + vars.salesChange / 100) * (1 + vars.priceChange / 100)
    
    // Calcular impacto en costos
    const foodCosts = (baseMetrics.costs * 0.35) * (1 + vars.costChange / 100)
    const laborCosts = (baseMetrics.costs * 0.30) * (1 + vars.laborChange / 100)
    const fixedCosts = baseMetrics.costs * 0.35 // Los costos fijos no cambian
    const newCosts = foodCosts + laborCosts + fixedCosts
    
    // Calcular nuevas métricas
    const newProfit = newRevenue - newCosts
    const newMargin = (newProfit / newRevenue) * 100
    const breakeven = fixedCosts / (1 - (foodCosts + laborCosts) / newRevenue)
    
    // Calcular cambios porcentuales
    const revenueChange = ((newRevenue - baseMetrics.revenue) / baseMetrics.revenue) * 100
    const profitChange = ((newProfit - baseMetrics.profit) / baseMetrics.profit) * 100
    const marginChange = newMargin - (baseMetrics.profit / baseMetrics.revenue) * 100
    
    setTimeout(() => {
      setResults({
        revenue: newRevenue,
        costs: newCosts,
        profit: newProfit,
        margin: newMargin,
        breakeven: breakeven,
        changes: {
          revenue: revenueChange,
          profit: profitChange,
          margin: marginChange
        },
        impact: {
          daily: newProfit / 30,
          weekly: newProfit / 4,
          monthly: newProfit,
          yearly: newProfit * 12
        }
      })
      setIsCalculating(false)
    }, 500)
  }

  const handleSliderChange = (variable: keyof typeof customValues, value: number) => {
    setCustomValues(prev => ({
      ...prev,
      [variable]: value
    }))
  }

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

  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                    rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-xl flex items-center gap-3">
          <Calculator className="w-6 h-6 text-purple-400" />
        <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold rounded-full animate-pulse">PREMIUM</span>
          Simulador What-If
        </h3>
        <span className="text-white/60 text-sm">
          Analiza el impacto de cambios en tu negocio
        </span>
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
            {scenario.name}
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
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #22c55e 50%, #10b981 100%)`
              }}
            />
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
          </div>
        </div>
      </div>

      {/* Resultados */}
      {results && !isCalculating && (
        <div className="space-y-4">
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

          {/* Recomendación de IA */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm mb-1">
                  Análisis de Nova AI
                </p>
                <p className="text-white/70 text-sm">
                  {results.changes.profit > 20 
                    ? "Escenario muy favorable. Considera implementar estos cambios gradualmente para validar el impacto real."
                    : results.changes.profit > 0
                    ? "Escenario positivo. Los ajustes propuestos pueden mejorar tu rentabilidad sin riesgos significativos."
                    : results.changes.profit > -10
                    ? "Escenario de precaución. Evalúa cuidadosamente cada variable antes de implementar cambios."
                    : "Escenario de alto riesgo. Recomiendo ajustar las variables para encontrar un balance más sostenible."
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Botón de Aplicar */}
          <button
            onClick={() => onScenarioApply && onScenarioApply(scenarios[activeScenario])}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl 
                     font-medium hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            Aplicar Escenario al Dashboard
          </button>
        </div>
      )}

      {isCalculating && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      )}
    </div>
  )
}

export default WhatIfSimulator
