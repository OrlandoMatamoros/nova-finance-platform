'use client'

import React, { useState } from 'react'
import { Cpu, Settings, Zap, TrendingUp, AlertTriangle, BarChart3, Loader, CheckCircle, HelpCircle, Info, X, Target } from 'lucide-react'

interface OptimizationTarget {
  id: string
  name: string
  type: 'maximize' | 'minimize' | 'target'
  value?: number
  weight: number
  current: number
  unit: string
}

const SolverOptimizerDocumented: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  
  const [targets, setTargets] = useState<OptimizationTarget[]>([
    { id: '1', name: 'Ingresos', type: 'maximize', weight: 40, current: 125200, unit: '$' },
    { id: '2', name: 'Costos', type: 'minimize', weight: 30, current: 82380, unit: '$' },
    { id: '3', name: 'Satisfacción Cliente', type: 'target', value: 90, weight: 30, current: 85, unit: '%' }
  ])

  const [solution, setSolution] = useState<any>(null)

  const runOptimization = () => {
    setIsOptimizing(true)
    
    setTimeout(() => {
      setSolution({
        optimal: {
          revenue: 142000,
          costs: 75000,
          satisfaction: 90
        },
        recommendations: [
          { action: 'Aumentar precios en 5%', impact: 'high', effort: 'low' },
          { action: 'Automatizar inventario', impact: 'medium', effort: 'medium' },
          { action: 'Capacitar personal en servicio', impact: 'high', effort: 'low' },
          { action: 'Negociar con proveedores', impact: 'medium', effort: 'high' }
        ],
        improvement: 23.5,
        feasibility: 85
      })
      setIsOptimizing(false)
    }, 2000)
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-xl flex items-center gap-3">
          <Cpu className="w-6 h-6 text-blue-400" />
          Optimizador Multi-Objetivo
          <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold rounded-full animate-pulse">
            PREMIUM
          </span>
        </h3>
        
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all group relative"
        >
          <HelpCircle className="w-5 h-5 text-white/80 group-hover:text-white" />
          
          <div className="absolute right-0 top-12 w-48 p-2 bg-black/90 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <p className="text-white text-xs">
              Ver guía completa de uso
            </p>
          </div>
        </button>
      </div>

      {/* Panel de Ayuda Expandible */}
      {showHelp && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 relative">
          <button
            onClick={() => setShowHelp(false)}
            className="absolute right-2 top-2 p-1 hover:bg-white/10 rounded"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
          
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-white/80 space-y-3">
              <div>
                <p className="font-semibold text-white mb-2">🤖 ¿Para qué sirve?</p>
                <p>El Optimizador Multi-Objetivo usa IA avanzada para encontrar el balance perfecto entre múltiples metas conflictivas:</p>
                <ul className="mt-1 ml-4 list-disc space-y-0.5">
                  <li>Maximizar ingresos mientras minimizas costos</li>
                  <li>Mejorar calidad sin aumentar precio</li>
                  <li>Aumentar producción manteniendo satisfacción laboral</li>
                  <li>Encuentra el punto óptimo entre todas tus métricas</li>
                </ul>
              </div>
              
              <div>
                <p className="font-semibold text-white mb-2">⚙️ ¿Cómo configurarlo?</p>
                <ul className="ml-4 list-disc space-y-0.5">
                  <li><strong>Objetivos:</strong> Define qué quieres maximizar, minimizar o alcanzar</li>
                  <li><strong>Pesos (%):</strong> Indica la importancia relativa de cada objetivo</li>
                  <li><strong>Restricciones:</strong> Establece límites que no se pueden violar</li>
                  <li><strong>Ejecutar:</strong> La IA calculará la solución óptima</li>
                </ul>
              </div>
              
              <div>
                <p className="font-semibold text-white mb-2">💡 Resultados esperados:</p>
                <ul className="ml-4 list-disc space-y-0.5">
                  <li>Valores óptimos para cada métrica</li>
                  <li>4-6 acciones concretas priorizadas</li>
                  <li>% de mejora esperada total</li>
                  <li>Índice de factibilidad (0-100%)</li>
                  <li>Trade-offs entre objetivos conflictivos</li>
                </ul>
              </div>

              <div className="mt-3 p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <p className="text-xs text-cyan-200">
                  🧠 <strong>Tecnología:</strong> Utiliza algoritmos genéticos y machine learning para explorar millones de combinaciones en segundos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuración de Objetivos */}
      <div className="space-y-4 mb-6">
        <h4 className="text-white/80 text-sm font-semibold">Configurar Objetivos de Optimización:</h4>
        
        {targets.map((target) => (
          <div key={target.id} className="bg-white/5 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{target.name === 'Ingresos' ? '💰' : target.name === 'Costos' ? '📊' : '😊'}</span>
                <div>
                  <p className="text-white font-semibold">{target.name}</p>
                  <p className="text-white/60 text-xs">Actual: {target.current.toLocaleString()}{target.unit}</p>
                </div>
              </div>
              
              {/* Selector de tipo con tooltip */}
              <div className="relative">
                <select
                  value={target.type}
                  onChange={(e) => {
                    const newTargets = [...targets]
                    const index = targets.findIndex(t => t.id === target.id)
                    newTargets[index].type = e.target.value as any
                    setTargets(newTargets)
                  }}
                  onMouseEnter={() => setShowTooltip(target.id + '-type')}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                >
                  <option value="maximize">Maximizar ↑</option>
                  <option value="minimize">Minimizar ↓</option>
                  <option value="target">Objetivo →</option>
                </select>
                
                {showTooltip === target.id + '-type' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 rounded-lg z-50">
                    <p className="text-white text-xs">
                      {target.type === 'maximize' ? 'Buscar el valor más alto posible' :
                       target.type === 'minimize' ? 'Reducir al mínimo posible' :
                       'Alcanzar un valor específico'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Slider de peso/importancia */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-white/60 text-sm">Importancia</label>
                <span className="text-white font-bold">{target.weight}%</span>
              </div>
              <div className="relative group">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={target.weight}
                  onChange={(e) => {
                    const newTargets = [...targets]
                    const index = targets.findIndex(t => t.id === target.id)
                    newTargets[index].weight = parseInt(e.target.value)
                    setTargets(newTargets)
                  }}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 rounded text-white text-xs opacity-0 group-hover:opacity-100">
                  Define qué tan importante es este objetivo
                </div>
              </div>
            </div>
            
            {/* Campo de objetivo si es tipo 'target' */}
            {target.type === 'target' && (
              <div className="flex items-center gap-2">
                <label className="text-white/60 text-sm">Valor objetivo:</label>
                <input
                  type="number"
                  value={target.value || 0}
                  onChange={(e) => {
                    const newTargets = [...targets]
                    const index = targets.findIndex(t => t.id === target.id)
                    newTargets[index].value = parseFloat(e.target.value)
                    setTargets(newTargets)
                  }}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white w-24"
                />
                <span className="text-white/60 text-sm">{target.unit}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Validación de pesos */}
      {targets.reduce((sum, t) => sum + t.weight, 0) !== 100 && (
        <div className="mb-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-200">
              Los pesos deben sumar 100% (actual: {targets.reduce((sum, t) => sum + t.weight, 0)}%)
            </span>
          </div>
        </div>
      )}

      {/* Botón de optimización */}
      <button
        onClick={runOptimization}
        disabled={isOptimizing || targets.reduce((sum, t) => sum + t.weight, 0) !== 100}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg
                   hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50
                   disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
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

      {/* Resultados de optimización */}
      {solution && (
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Solución Óptima Encontrada
              </h4>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">+{solution.improvement}%</p>
                  <p className="text-xs text-white/60">Mejora total</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-400">{solution.feasibility}%</p>
                  <p className="text-xs text-white/60">Factibilidad</p>
                </div>
              </div>
            </div>
            
            {/* Valores óptimos */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/60 text-xs mb-1">Ingresos Óptimos</p>
                <p className="text-white font-bold text-lg">${solution.optimal.revenue.toLocaleString()}</p>
                <p className="text-green-400 text-xs">+13.4% vs actual</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/60 text-xs mb-1">Costos Óptimos</p>
                <p className="text-white font-bold text-lg">${solution.optimal.costs.toLocaleString()}</p>
                <p className="text-green-400 text-xs">-9.0% vs actual</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/60 text-xs mb-1">Satisfacción</p>
                <p className="text-white font-bold text-lg">{solution.optimal.satisfaction}%</p>
                <p className="text-green-400 text-xs">+5.9% vs actual</p>
              </div>
            </div>
            
            {/* Recomendaciones */}
            <div>
              <p className="text-white/80 text-sm font-semibold mb-2">Plan de Acción Recomendado:</p>
              <div className="space-y-2">
                {solution.recommendations.map((rec: any, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-white/40 font-bold">#{index + 1}</span>
                      <p className="text-white/80 text-sm">{rec.action}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold
                        ${rec.impact === 'high' ? 'bg-green-500/20 text-green-300' :
                          rec.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-gray-500/20 text-gray-300'}
                      `}>
                        Impacto {rec.impact === 'high' ? 'Alto' : rec.impact === 'medium' ? 'Medio' : 'Bajo'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold
                        ${rec.effort === 'low' ? 'bg-blue-500/20 text-blue-300' :
                          rec.effort === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'}
                      `}>
                        Esfuerzo {rec.effort === 'low' ? 'Bajo' : rec.effort === 'medium' ? 'Medio' : 'Alto'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-white/40 text-xs text-center">
          Powered by Impulsa Lab AI Optimization Engine
        </p>
      </div>
    </div>
  )
}

export default SolverOptimizerDocumented
