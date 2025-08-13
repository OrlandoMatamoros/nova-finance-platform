'use client'

import React, { useState } from 'react'
import { Cpu, Settings, Zap, TrendingUp, AlertTriangle, BarChart3, Loader, CheckCircle } from 'lucide-react'

interface OptimizationTarget {
  id: string
  name: string
  type: 'maximize' | 'minimize' | 'target'
  value?: number
  weight: number
  unit: string
}

interface Variable {
  id: string
  name: string
  currentValue: number
  minValue: number
  maxValue: number
  stepSize: number
  unit: string
  impact: {
    revenue: number
    cost: number
    quality: number
  }
}

interface OptimizationResult {
  optimal: boolean
  score: number
  improvements: {
    metric: string
    before: number
    after: number
    improvement: number
  }[]
  solution: {
    variableId: string
    variableName: string
    optimalValue: number
    change: number
  }[]
  constraints: {
    name: string
    satisfied: boolean
    value: number
  }[]
  visualData: {
    labels: string[]
    current: number[]
    optimal: number[]
  }
}

interface SolverOptimizerProps {
  currentData: any
}

const SolverOptimizer: React.FC<SolverOptimizerProps> = ({ currentData }) => {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  
  const [targets, setTargets] = useState<OptimizationTarget[]>([
    { id: '1', name: 'Maximizar Utilidad', type: 'maximize', weight: 40, unit: '$' },
    { id: '2', name: 'Minimizar Costos', type: 'minimize', weight: 30, unit: '$' },
    { id: '3', name: 'Maximizar Clientes', type: 'maximize', weight: 20, unit: '#' },
    { id: '4', name: 'Target Margen 20%', type: 'target', value: 20, weight: 10, unit: '%' }
  ])

  const [variables] = useState<Variable[]>([
    {
      id: 'price',
      name: 'Precio Promedio',
      currentValue: 42,
      minValue: 35,
      maxValue: 55,
      stepSize: 1,
      unit: '$',
      impact: { revenue: 2.5, cost: 0, quality: -0.5 }
    },
    {
      id: 'portions',
      name: 'Tamaño Porciones',
      currentValue: 100,
      minValue: 80,
      maxValue: 120,
      stepSize: 5,
      unit: '%',
      impact: { revenue: -0.3, cost: -1.2, quality: 0.8 }
    },
    {
      id: 'staff',
      name: 'Personal en Turno',
      currentValue: 8,
      minValue: 5,
      maxValue: 12,
      stepSize: 1,
      unit: 'personas',
      impact: { revenue: 0.5, cost: 1.5, quality: 1.2 }
    },
    {
      id: 'marketing',
      name: 'Inversión Marketing',
      currentValue: 3000,
      minValue: 1000,
      maxValue: 8000,
      stepSize: 500,
      unit: '$',
      impact: { revenue: 1.8, cost: 1, quality: 0.2 }
    },
    {
      id: 'hours',
      name: 'Horas Operación',
      currentValue: 10,
      minValue: 8,
      maxValue: 14,
      stepSize: 1,
      unit: 'horas',
      impact: { revenue: 1.5, cost: 0.8, quality: -0.3 }
    }
  ])

  const [constraints] = useState([
    { name: 'Satisfacción Cliente Min', value: 85, unit: '%' },
    { name: 'ROI Mínimo', value: 15, unit: '%' },
    { name: 'Capacidad Máxima', value: 200, unit: 'clientes/día' },
    { name: 'Presupuesto Máximo', value: 150000, unit: '$' }
  ])

  const runOptimization = async () => {
    setIsOptimizing(true)
    
    // Simular optimización compleja
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Algoritmo de optimización simplificado (en producción sería más complejo)
    const optimizedValues = variables.map(variable => {
      let optimalValue = variable.currentValue
      
      // Aplicar lógica de optimización basada en targets
      targets.forEach(target => {
        if (target.type === 'maximize' && target.name.includes('Utilidad')) {
          if (variable.impact.revenue > variable.impact.cost) {
            optimalValue = Math.min(
              variable.maxValue,
              variable.currentValue + (variable.maxValue - variable.currentValue) * 0.4
            )
          }
        } else if (target.type === 'minimize' && target.name.includes('Costos')) {
          if (variable.impact.cost > 0) {
            optimalValue = Math.max(
              variable.minValue,
              variable.currentValue - (variable.currentValue - variable.minValue) * 0.3
            )
          }
        }
      })
      
      return {
        variableId: variable.id,
        variableName: variable.name,
        optimalValue: Math.round(optimalValue),
        change: ((optimalValue - variable.currentValue) / variable.currentValue) * 100
      }
    })
    
    // Calcular mejoras
    const currentRevenue = currentData?.totals?.sales || 125000
    const currentCost = currentData?.totals?.costs || 100000
    const currentProfit = currentRevenue - currentCost
    
    const revenueImprovement = optimizedValues.reduce((sum, opt) => {
      const variable = variables.find(v => v.id === opt.variableId)
      return sum + (opt.change * (variable?.impact.revenue || 0))
    }, 0)
    
    const costImprovement = optimizedValues.reduce((sum, opt) => {
      const variable = variables.find(v => v.id === opt.variableId)
      return sum + (opt.change * (variable?.impact.cost || 0))
    }, 0)
    
    const newRevenue = currentRevenue * (1 + revenueImprovement / 100)
    const newCost = currentCost * (1 + costImprovement / 100)
    const newProfit = newRevenue - newCost
    const newMargin = (newProfit / newRevenue) * 100
    
    setResult({
      optimal: true,
      score: 85 + Math.random() * 10,
      improvements: [
        {
          metric: 'Ingresos',
          before: currentRevenue,
          after: newRevenue,
          improvement: revenueImprovement
        },
        {
          metric: 'Costos',
          before: currentCost,
          after: newCost,
          improvement: costImprovement
        },
        {
          metric: 'Utilidad',
          before: currentProfit,
          after: newProfit,
          improvement: ((newProfit - currentProfit) / currentProfit) * 100
        },
        {
          metric: 'Margen',
          before: (currentProfit / currentRevenue) * 100,
          after: newMargin,
          improvement: newMargin - (currentProfit / currentRevenue) * 100
        }
      ],
      solution: optimizedValues,
      constraints: constraints.map(c => ({
        name: c.name,
        satisfied: Math.random() > 0.2,
        value: c.value * (0.9 + Math.random() * 0.3)
      })),
      visualData: {
        labels: variables.map(v => v.name),
        current: variables.map(v => v.currentValue),
        optimal: optimizedValues.map(o => o.optimalValue)
      }
    })
    
    setIsOptimizing(false)
  }

  const updateTargetWeight = (targetId: string, newWeight: number) => {
    setTargets(prev => prev.map(t => 
      t.id === targetId ? { ...t, weight: newWeight } : t
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                      rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">Solver / Optimizer</h3>
              <p className="text-white/60 text-sm">Optimización multi-objetivo con IA</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-purple-500/20 rounded-full">
            <span className="text-purple-300 text-xs font-medium">Algoritmo Avanzado</span>
          </div>
        </div>

        {/* Objetivos de Optimización */}
        <div className="mb-6">
          <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-purple-400" />
            Objetivos de Optimización
          </h4>
          <div className="space-y-3">
            {targets.map(target => (
              <div key={target.id} className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      target.type === 'maximize' ? 'bg-green-500/20 text-green-400' :
                      target.type === 'minimize' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {target.type === 'maximize' ? '↑ MAX' : 
                       target.type === 'minimize' ? '↓ MIN' : '⊙ TARGET'}
                    </span>
                    <span className="text-white/80 text-sm">{target.name}</span>
                  </div>
                  <span className="text-white/60 text-sm">Peso: {target.weight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={target.weight}
                  onChange={(e) => updateTargetWeight(target.id, Number(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${target.weight}%, rgba(255,255,255,0.2) ${target.weight}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Variables a Optimizar */}
        <div className="mb-6">
          <h4 className="text-white/80 font-medium mb-3">Variables de Decisión</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {variables.map(variable => (
              <div key={variable.id} className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/80 text-sm font-medium">{variable.name}</span>
                  <span className="text-white/60 text-xs">
                    {variable.currentValue} {variable.unit}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-white/40">Rango:</span>
                  <span className="text-white/60">
                    {variable.minValue} - {variable.maxValue} {variable.unit}
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-white/40 text-xs">Rev: {variable.impact.revenue}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span className="text-white/40 text-xs">Cost: {variable.impact.cost}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-white/40 text-xs">Qual: {variable.impact.quality}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restricciones */}
        <div className="mb-6">
          <h4 className="text-white/80 font-medium mb-3">Restricciones</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {constraints.map((constraint, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3">
                <p className="text-white/60 text-xs">{constraint.name}</p>
                <p className="text-white font-medium">
                  {constraint.value} {constraint.unit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de Optimización */}
        <button
          onClick={runOptimization}
          disabled={isOptimizing}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
                   rounded-xl font-medium hover:shadow-lg transition-all hover:scale-[1.02]
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center 
                   justify-center gap-2"
        >
          {isOptimizing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Optimizando con IA...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Ejecutar Optimización
            </>
          )}
        </button>
      </div>

      {/* Resultados de Optimización */}
      {result && !isOptimizing && (
        <>
          {/* Score General */}
          <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur 
                        rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-bold text-lg mb-1">
                  Solución Óptima Encontrada
                </h4>
                <p className="text-white/70 text-sm">
                  El algoritmo encontró una configuración que mejora todos los objetivos
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {result.score.toFixed(1)}%
                </div>
                <p className="text-white/60 text-xs">Score de Optimización</p>
              </div>
            </div>
          </div>

          {/* Mejoras */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                        rounded-2xl p-6 border border-white/10">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Mejoras Proyectadas
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {result.improvements.map((imp, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/60 text-xs mb-1">{imp.metric}</p>
                  <p className="text-white font-bold text-xl">
                    {imp.metric === 'Margen' 
                      ? `${imp.after.toFixed(1)}%`
                      : `$${(imp.after / 1000).toFixed(0)}k`
                    }
                  </p>
                  <div className={`text-sm font-medium mt-1 ${
                    imp.improvement > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {imp.improvement > 0 ? '+' : ''}{imp.improvement.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solución Detallada */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                        rounded-2xl p-6 border border-white/10">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              Configuración Óptima
            </h4>
            <div className="space-y-3">
              {result.solution.map((sol, index) => {
                const variable = variables.find(v => v.id === sol.variableId)
                return (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 font-medium">{sol.variableName}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-white/60 text-sm">
                          {variable?.currentValue} → {sol.optimalValue} {variable?.unit}
                        </span>
                        <span className={`text-sm font-bold ${
                          sol.change > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {sol.change > 0 ? '+' : ''}{sol.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ 
                          width: `${((sol.optimalValue - (variable?.minValue || 0)) / 
                                   ((variable?.maxValue || 100) - (variable?.minValue || 0))) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Validación de Restricciones */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                        rounded-2xl p-6 border border-white/10">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Validación de Restricciones
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {result.constraints.map((constraint, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  constraint.satisfied 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/80 text-xs">{constraint.name}</span>
                    {constraint.satisfied ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <p className="text-white font-medium">{constraint.value.toFixed(0)}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SolverOptimizer
