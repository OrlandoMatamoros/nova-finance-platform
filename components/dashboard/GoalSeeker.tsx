'use client'

import React, { useState, useEffect } from 'react'
import { Target, TrendingUp, Calculator, Zap, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'

interface GoalConfig {
  targetMetric: 'revenue' | 'profit' | 'margin' | 'customers' | 'custom'
  targetValue: number
  timeframe: number // días
  constraints: {
    maxPriceIncrease: number
    maxCostReduction: number
    maxLaborReduction: number
    minQualityScore: number
  }
}

interface Solution {
  achievable: boolean
  confidence: number
  requiredChanges: {
    variable: string
    currentValue: number
    targetValue: number
    change: number
    unit: string
  }[]
  timeline: {
    week: number
    milestone: string
    target: number
  }[]
  risks: string[]
  alternatives: string[]
}

interface GoalSeekerProps {
  currentData: any
}

const GoalSeeker: React.FC<GoalSeekerProps> = ({ currentData }) => {
  const [goalConfig, setGoalConfig] = useState<GoalConfig>({
    targetMetric: 'profit',
    targetValue: 50000,
    timeframe: 30,
    constraints: {
      maxPriceIncrease: 10,
      maxCostReduction: 15,
      maxLaborReduction: 10,
      minQualityScore: 85
    }
  })
  
  const [isCalculating, setIsCalculating] = useState(false)
  const [solution, setSolution] = useState<Solution | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Plantillas de metas predefinidas
  const goalTemplates = [
    {
      name: 'Aumentar Utilidad 20%',
      icon: '💰',
      config: {
        targetMetric: 'profit' as const,
        targetValue: (currentData?.totals?.netProfit || 25000) * 1.2,
        timeframe: 30
      }
    },
    {
      name: 'Alcanzar Break-Even',
      icon: '⚖️',
      config: {
        targetMetric: 'profit' as const,
        targetValue: 0,
        timeframe: 15
      }
    },
    {
      name: 'Duplicar Clientes',
      icon: '👥',
      config: {
        targetMetric: 'customers' as const,
        targetValue: (currentData?.totals?.covers || 3000) * 2,
        timeframe: 60
      }
    },
    {
      name: 'Margen 25%',
      icon: '📈',
      config: {
        targetMetric: 'margin' as const,
        targetValue: 25,
        timeframe: 45
      }
    }
  ]

  const calculateSolution = async () => {
    setIsCalculating(true)
    
    // Simular cálculo complejo
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Datos actuales
    const currentRevenue = currentData?.totals?.sales || 125000
    const currentProfit = currentData?.totals?.netProfit || 25000
    const currentMargin = (currentProfit / currentRevenue) * 100
    const currentCustomers = currentData?.totals?.covers || 3000
    
    // Determinar el gap
    let targetGap = 0
    let currentValue = 0
    
    switch(goalConfig.targetMetric) {
      case 'profit':
        currentValue = currentProfit
        targetGap = goalConfig.targetValue - currentProfit
        break
      case 'revenue':
        currentValue = currentRevenue
        targetGap = goalConfig.targetValue - currentRevenue
        break
      case 'margin':
        currentValue = currentMargin
        targetGap = goalConfig.targetValue - currentMargin
        break
      case 'customers':
        currentValue = currentCustomers
        targetGap = goalConfig.targetValue - currentCustomers
        break
    }
    
    // Calcular cambios necesarios (algoritmo simplificado)
    const requiredRevenueIncrease = (targetGap / currentRevenue) * 100
    const feasiblePriceIncrease = Math.min(requiredRevenueIncrease * 0.3, goalConfig.constraints.maxPriceIncrease)
    const feasibleVolumeIncrease = requiredRevenueIncrease - feasiblePriceIncrease
    const feasibleCostReduction = Math.min(targetGap / currentProfit * 10, goalConfig.constraints.maxCostReduction)
    
    // Determinar si es alcanzable
    const achievable = requiredRevenueIncrease < 50 && feasibleCostReduction < goalConfig.constraints.maxCostReduction
    
    // Generar solución
    const newSolution: Solution = {
      achievable,
      confidence: achievable ? 75 + Math.random() * 20 : 30 + Math.random() * 20,
      requiredChanges: [
        {
          variable: 'Precio Promedio',
          currentValue: currentData?.averages?.ticketSize || 42,
          targetValue: (currentData?.averages?.ticketSize || 42) * (1 + feasiblePriceIncrease / 100),
          change: feasiblePriceIncrease,
          unit: '%'
        },
        {
          variable: 'Volumen de Ventas',
          currentValue: currentCustomers,
          targetValue: currentCustomers * (1 + feasibleVolumeIncrease / 100),
          change: feasibleVolumeIncrease,
          unit: '%'
        },
        {
          variable: 'Costos Operativos',
          currentValue: currentData?.totals?.costs || 100000,
          targetValue: (currentData?.totals?.costs || 100000) * (1 - feasibleCostReduction / 100),
          change: -feasibleCostReduction,
          unit: '%'
        },
        {
          variable: 'Conversión Digital',
          currentValue: 15,
          targetValue: 25,
          change: 10,
          unit: 'pts'
        }
      ],
      timeline: [
        { week: 1, milestone: 'Optimizar menú y precios', target: currentValue * 1.05 },
        { week: 2, milestone: 'Lanzar campaña marketing', target: currentValue * 1.10 },
        { week: 3, milestone: 'Implementar upselling', target: currentValue * 1.15 },
        { week: 4, milestone: 'Revisar y ajustar', target: goalConfig.targetValue }
      ],
      risks: [
        'Resistencia del cliente al aumento de precios',
        'Competencia puede reaccionar con promociones',
        'Capacidad operativa limitada para mayor volumen'
      ],
      alternatives: [
        'Introducir línea premium con mayor margen',
        'Expandir horario de operación',
        'Agregar servicio de catering corporativo'
      ]
    }
    
    setSolution(newSolution)
    setIsCalculating(false)
  }

  const getMetricInfo = (metric: string) => {
    switch(metric) {
      case 'profit': return { label: 'Utilidad Neta', unit: '$', icon: '💰' }
      case 'revenue': return { label: 'Ingresos Totales', unit: '$', icon: '📊' }
      case 'margin': return { label: 'Margen de Utilidad', unit: '%', icon: '📈' }
      case 'customers': return { label: 'Clientes', unit: '', icon: '👥' }
      default: return { label: 'Métrica Personalizada', unit: '', icon: '��' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                      rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">Goal Seeker</h3>
              <p className="text-white/60 text-sm">Define tu meta y encuentra el camino</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            {showAdvanced ? 'Ocultar' : 'Avanzado'} →
          </button>
        </div>

        {/* Templates de Metas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {goalTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => {
                setGoalConfig(prev => ({
                  ...prev,
                  ...template.config
                }))
              }}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 
                       hover:border-white/20 transition-all text-left"
            >
              <div className="text-2xl mb-1">{template.icon}</div>
              <p className="text-white/80 text-sm font-medium">{template.name}</p>
            </button>
          ))}
        </div>

        {/* Configuración de Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-white/60 text-xs block mb-2">Métrica Objetivo</label>
            <select
              value={goalConfig.targetMetric}
              onChange={(e) => setGoalConfig(prev => ({ 
                ...prev, 
                targetMetric: e.target.value as any 
              }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:bg-white/20 focus:border-white/40 transition-all"
            >
              <option value="profit">Utilidad Neta</option>
              <option value="revenue">Ingresos Totales</option>
              <option value="margin">Margen %</option>
              <option value="customers">Número de Clientes</option>
              <option value="custom">Personalizada</option>
            </select>
          </div>

          <div>
            <label className="text-white/60 text-xs block mb-2">
              Valor Objetivo {getMetricInfo(goalConfig.targetMetric).unit}
            </label>
            <input
              type="number"
              value={goalConfig.targetValue}
              onChange={(e) => setGoalConfig(prev => ({ 
                ...prev, 
                targetValue: Number(e.target.value) 
              }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:bg-white/20 focus:border-white/40 transition-all"
            />
          </div>

          <div>
            <label className="text-white/60 text-xs block mb-2">Plazo (días)</label>
            <input
              type="number"
              value={goalConfig.timeframe}
              onChange={(e) => setGoalConfig(prev => ({ 
                ...prev, 
                timeframe: Number(e.target.value) 
              }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:bg-white/20 focus:border-white/40 transition-all"
            />
          </div>
        </div>

        {/* Restricciones Avanzadas */}
        {showAdvanced && (
          <div className="mt-6 p-4 bg-white/5 rounded-xl">
            <h4 className="text-white/80 text-sm font-medium mb-3">Restricciones</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-white/60 text-xs block mb-1">Max Aumento Precio</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={goalConfig.constraints.maxPriceIncrease}
                    onChange={(e) => setGoalConfig(prev => ({
                      ...prev,
                      constraints: {
                        ...prev.constraints,
                        maxPriceIncrease: Number(e.target.value)
                      }
                    }))}
                    className="flex-1"
                  />
                  <span className="text-white/80 text-sm w-10">
                    {goalConfig.constraints.maxPriceIncrease}%
                  </span>
                </div>
              </div>

              <div>
                <label className="text-white/60 text-xs block mb-1">Max Reducción Costos</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={goalConfig.constraints.maxCostReduction}
                    onChange={(e) => setGoalConfig(prev => ({
                      ...prev,
                      constraints: {
                        ...prev.constraints,
                        maxCostReduction: Number(e.target.value)
                      }
                    }))}
                    className="flex-1"
                  />
                  <span className="text-white/80 text-sm w-10">
                    {goalConfig.constraints.maxCostReduction}%
                  </span>
                </div>
              </div>

              <div>
                <label className="text-white/60 text-xs block mb-1">Max Reducción Personal</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={goalConfig.constraints.maxLaborReduction}
                    onChange={(e) => setGoalConfig(prev => ({
                      ...prev,
                      constraints: {
                        ...prev.constraints,
                        maxLaborReduction: Number(e.target.value)
                      }
                    }))}
                    className="flex-1"
                  />
                  <span className="text-white/80 text-sm w-10">
                    {goalConfig.constraints.maxLaborReduction}%
                  </span>
                </div>
              </div>

              <div>
                <label className="text-white/60 text-xs block mb-1">Min Calidad</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={goalConfig.constraints.minQualityScore}
                    onChange={(e) => setGoalConfig(prev => ({
                      ...prev,
                      constraints: {
                        ...prev.constraints,
                        minQualityScore: Number(e.target.value)
                      }
                    }))}
                    className="flex-1"
                  />
                  <span className="text-white/80 text-sm w-10">
                    {goalConfig.constraints.minQualityScore}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botón Buscar Solución */}
        <button
          onClick={calculateSolution}
          disabled={isCalculating}
          className="w-full mt-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white 
                   rounded-xl font-medium hover:shadow-lg transition-all hover:scale-[1.02]
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center 
                   justify-center gap-2"
        >
          {isCalculating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Calculando ruta óptima...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Buscar Solución
            </>
          )}
        </button>
      </div>

      {/* Resultados */}
      {solution && !isCalculating && (
        <div className="space-y-6">
          {/* Estado de la Solución */}
          <div className={`p-6 rounded-2xl border ${
            solution.achievable 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}>
            <div className="flex items-start gap-3">
              {solution.achievable ? (
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h4 className="text-white font-semibold text-lg mb-1">
                  {solution.achievable ? '¡Meta Alcanzable!' : 'Meta Desafiante'}
                </h4>
                <p className="text-white/70 text-sm">
                  {solution.achievable 
                    ? `Con los ajustes correctos, puedes alcanzar tu meta en ${goalConfig.timeframe} días con ${solution.confidence.toFixed(0)}% de certeza.`
                    : `La meta es ambiciosa. Considera extender el plazo o ajustar el objetivo. Confianza actual: ${solution.confidence.toFixed(0)}%.`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Cambios Requeridos */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                        rounded-2xl p-6 border border-white/10">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-400" />
              Cambios Necesarios
            </h4>
            
            <div className="space-y-3">
              {solution.requiredChanges.map((change, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80 font-medium">{change.variable}</span>
                    <span className={`text-sm font-bold ${
                      change.change > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {change.change > 0 ? '+' : ''}{change.change.toFixed(1)}{change.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                        style={{ 
                          width: `${Math.min(100, Math.abs(change.change) * 3)}%` 
                        }}
                      />
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40" />
                    <span className="text-white/60 text-sm">
                      {change.unit === '$' || change.unit === '%' 
                        ? `${change.unit}${change.targetValue.toFixed(0)}`
                        : `${change.targetValue.toFixed(0)}${change.unit}`
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                        rounded-2xl p-6 border border-white/10">
            <h4 className="text-white font-semibold mb-4">Hoja de Ruta</h4>
            <div className="space-y-3">
              {solution.timeline.map((milestone, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-center">
                    <div className="text-white/40 text-xs">Semana</div>
                    <div className="text-white font-bold">{milestone.week}</div>
                  </div>
                  <div className="flex-1 p-3 bg-white/5 rounded-lg">
                    <p className="text-white/80 text-sm">{milestone.milestone}</p>
                    <p className="text-white/50 text-xs mt-1">
                      Meta: ${milestone.target.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Riesgos y Alternativas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h5 className="text-white/80 font-medium mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                Riesgos Identificados
              </h5>
              <ul className="space-y-2">
                {solution.risks.map((risk, index) => (
                  <li key={index} className="text-white/60 text-sm flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h5 className="text-white/80 font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Alternativas Sugeridas
              </h5>
              <ul className="space-y-2">
                {solution.alternatives.map((alt, index) => (
                  <li key={index} className="text-white/60 text-sm flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    {alt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoalSeeker
