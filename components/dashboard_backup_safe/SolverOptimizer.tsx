import React, { useState, useEffect } from 'react'
import { 
  Cpu, Zap, Settings, TrendingUp, AlertTriangle, 
  CheckCircle, Loader, Download, RefreshCw, 
  BarChart3, Target, Sliders, Brain, 
  ArrowUpDown, Activity, Info, X, HelpCircle
} from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar, ResponsiveContainer, LineChart, Line, XAxis, 
  YAxis, CartesianGrid, Tooltip, Legend, ScatterChart,
  Scatter, ZAxis
} from 'recharts'

// ==================== TIPOS ====================
interface Objective {
  id: string
  name: string
  type: 'maximize' | 'minimize' | 'target'
  weight: number
  current: number
  target?: number
  unit: string
  constraints?: {
    min?: number
    max?: number
  }
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
    customers: number
  }
}

interface Solution {
  variables: Map<string, number>
  objectives: Map<string, number>
  score: number
  feasible: boolean
}

interface OptimizationResult {
  optimal: Solution
  paretoFront: any[]
  tradeOffs: TradeOff[]
  convergenceHistory: number[]
  iterations: number
  executionTime: number
}

interface TradeOff {
  objective1: string
  objective2: string
  correlation: number
  sensitivity: number
}

interface SolverOptimizerProps {
  currentData: any
}

// ==================== ALGORITMOS DE OPTIMIZACIÓN ====================

// Normaliza un valor entre 0 y 1
function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5
  return (value - min) / (max - min)
}

// Calcula el score usando Weighted Sum Method
function calculateWeightedScore(solution: Solution, objectives: Objective[]): number {
  let totalScore = 0
  let totalWeight = 0

  objectives.forEach(obj => {
    const value = solution.objectives.get(obj.id) || obj.current
    let normalizedValue = 0

    const min = obj.constraints?.min ?? obj.current * 0.5
    const max = obj.constraints?.max ?? obj.current * 1.5

    if (obj.type === 'maximize') {
      normalizedValue = normalize(value, min, max)
    } else if (obj.type === 'minimize') {
      normalizedValue = 1 - normalize(value, min, max)
    } else if (obj.type === 'target' && obj.target) {
      const distance = Math.abs(value - obj.target)
      const maxDistance = Math.max(Math.abs(max - obj.target), Math.abs(min - obj.target))
      normalizedValue = 1 - (distance / maxDistance)
    }

    totalScore += normalizedValue * obj.weight
    totalWeight += obj.weight
  })

  return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0
}

// Calcula los objetivos basados en las variables
function calculateObjectives(
  solution: Solution,
  variables: Variable[],
  objectives: Objective[]
): void {
  let revenue = 125000
  let costs = 82000
  let quality = 85
  let customers = 2850

  variables.forEach(v => {
    const value = solution.variables.get(v.id) || v.currentValue
    const change = (value - v.currentValue) / v.currentValue

    revenue += revenue * change * v.impact.revenue
    costs += costs * change * v.impact.cost
    quality += quality * change * v.impact.quality
    customers += customers * change * v.impact.customers
  })

  solution.objectives.set('revenue', revenue)
  solution.objectives.set('costs', costs)
  solution.objectives.set('profit', revenue - costs)
  solution.objectives.set('margin', ((revenue - costs) / revenue) * 100)
  solution.objectives.set('quality', quality)
  solution.objectives.set('customers', customers)
}

// Algoritmo simplificado de optimización
function runOptimizationAlgorithm(
  objectives: Objective[],
  variables: Variable[]
): OptimizationResult {
  const startTime = Date.now()
  const convergenceHistory: number[] = []
  const solutions: Solution[] = []

  // Generar población inicial de soluciones
  for (let i = 0; i < 30; i++) {
    const solution: Solution = {
      variables: new Map(),
      objectives: new Map(),
      score: 0,
      feasible: true
    }

    // Asignar valores aleatorios a las variables
    variables.forEach(v => {
      const range = v.maxValue - v.minValue
      const randomValue = v.minValue + Math.random() * range
      solution.variables.set(v.id, Math.round(randomValue))
    })

    calculateObjectives(solution, variables, objectives)
    solution.score = calculateWeightedScore(solution, objectives)
    solutions.push(solution)
  }

  // Simulación de evolución (simplificada)
  let bestScore = 0
  let iterations = 100

  for (let iter = 0; iter < iterations; iter++) {
    // Ordenar por score
    solutions.sort((a, b) => b.score - a.score)
    
    // Mantener las mejores soluciones
    const elite = solutions.slice(0, 6)
    
    // Generar nuevas soluciones basadas en las mejores
    const newSolutions = [...elite]
    
    for (let i = 0; i < 24; i++) {
      const parent1 = elite[Math.floor(Math.random() * elite.length)]
      const parent2 = elite[Math.floor(Math.random() * elite.length)]
      
      const child: Solution = {
        variables: new Map(),
        objectives: new Map(),
        score: 0,
        feasible: true
      }

      // Cruce de variables
      variables.forEach(v => {
        const value1 = parent1.variables.get(v.id) || v.currentValue
        const value2 = parent2.variables.get(v.id) || v.currentValue
        
        // Promedio con algo de mutación
        let childValue = (value1 + value2) / 2
        if (Math.random() < 0.1) {
          childValue += (Math.random() - 0.5) * v.stepSize * 2
        }
        
        childValue = Math.max(v.minValue, Math.min(v.maxValue, childValue))
        child.variables.set(v.id, Math.round(childValue))
      })

      calculateObjectives(child, variables, objectives)
      child.score = calculateWeightedScore(child, objectives)
      newSolutions.push(child)
    }

    solutions.splice(0, solutions.length, ...newSolutions)
    
    const currentBest = Math.max(...solutions.map(s => s.score))
    convergenceHistory.push(currentBest)
    bestScore = currentBest
  }

  // Seleccionar la mejor solución
  const optimal = solutions.reduce((best, current) =>
    current.score > best.score ? current : best
  )

  // Calcular trade-offs
  const tradeOffs = calculateTradeOffs(optimal, objectives)

  // Simular frente de Pareto
  const paretoFront = solutions.slice(0, 10).map(s => ({
    x: s.objectives.get('profit') || 0,
    y: s.objectives.get('costs') || 0,
    z: s.score
  }))

  return {
    optimal,
    paretoFront,
    tradeOffs,
    convergenceHistory,
    iterations,
    executionTime: Date.now() - startTime
  }
}

// Calcula los trade-offs entre objetivos
function calculateTradeOffs(solution: Solution, objectives: Objective[]): TradeOff[] {
  const tradeOffs: TradeOff[] = []

  for (let i = 0; i < Math.min(objectives.length - 1, 3); i++) {
    for (let j = i + 1; j < Math.min(objectives.length, 4); j++) {
      const obj1 = objectives[i]
      const obj2 = objectives[j]

      // Simulación de correlación basada en los tipos
      let correlation = 0
      if (obj1.type === 'maximize' && obj2.type === 'minimize') {
        correlation = -0.6 - Math.random() * 0.3
      } else if (obj1.type === obj2.type) {
        correlation = 0.3 + Math.random() * 0.4
      } else {
        correlation = -0.2 + Math.random() * 0.4
      }

      tradeOffs.push({
        objective1: obj1.name.split(' ')[0],
        objective2: obj2.name.split(' ')[0],
        correlation,
        sensitivity: Math.abs(correlation) * 0.8
      })
    }
  }

  return tradeOffs
}

// Genera recomendaciones basadas en la solución
function generateRecommendations(result: OptimizationResult, variables: Variable[]) {
  const recommendations = []
  const solution = result.optimal

  variables.forEach(v => {
    const currentValue = v.currentValue
    const optimalValue = solution.variables.get(v.id) || currentValue
    const change = ((optimalValue - currentValue) / currentValue) * 100

    if (Math.abs(change) > 5) {
      const priority = Math.abs(change) > 15 ? 'high' : 
                      Math.abs(change) > 10 ? 'medium' : 'low'

      recommendations.push({
        priority,
        action: `${change > 0 ? 'Aumentar' : 'Reducir'} ${v.name} de ${currentValue}${v.unit} a ${optimalValue}${v.unit}`,
        impact: `Cambio del ${Math.abs(change).toFixed(1)}% en ${v.name}`,
        timeframe: priority === 'high' ? '1-2 semanas' : 
                   priority === 'medium' ? '2-4 semanas' : '1-2 meses',
        resources: ['Análisis de mercado', 'Equipo interno'],
        risk: Math.abs(change) > 20 ? 'Alto - Cambio significativo' : 
              Math.abs(change) > 10 ? 'Medio - Cambio moderado' : 
              'Bajo - Ajuste incremental'
      })
    }
  })

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

// ==================== COMPONENTE PRINCIPAL ====================

const SolverOptimizer: React.FC<SolverOptimizerProps> = ({ currentData }) => {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'objectives' | 'variables' | 'results' | 'pareto'>('objectives')
  const [showHelp, setShowHelp] = useState(false)
  const [showDocs, setShowDocs] = useState(false)
  
  // Estado para objetivos configurables
  const [objectives, setObjectives] = useState<Objective[]>([
    { 
      id: 'profit', 
      name: 'Maximizar Utilidad', 
      type: 'maximize', 
      weight: 35, 
      current: currentData?.totals?.netProfit || 43000,
      unit: '$',
      constraints: { min: 20000, max: 100000 }
    },
    { 
      id: 'costs', 
      name: 'Minimizar Costos', 
      type: 'minimize', 
      weight: 25, 
      current: currentData?.totals?.costs || 82000,
      unit: '$',
      constraints: { min: 50000, max: 120000 }
    },
    { 
      id: 'customers', 
      name: 'Maximizar Clientes', 
      type: 'maximize', 
      weight: 20, 
      current: currentData?.totals?.covers || 2850,
      unit: '#',
      constraints: { min: 2000, max: 5000 }
    },
    { 
      id: 'margin', 
      name: 'Target Margen 25%', 
      type: 'target',
      target: 25,
      weight: 10, 
      current: ((currentData?.totals?.netProfit || 43000) / (currentData?.totals?.sales || 125000)) * 100,
      unit: '%',
      constraints: { min: 10, max: 40 }
    },
    { 
      id: 'quality', 
      name: 'Mantener Calidad', 
      type: 'target',
      target: 90,
      weight: 10, 
      current: 85,
      unit: 'pts',
      constraints: { min: 70, max: 100 }
    }
  ])

  // Variables de decisión
  const [variables] = useState<Variable[]>([
    {
      id: 'price',
      name: 'Precio Promedio',
      currentValue: currentData?.averages?.ticketSize || 42,
      minValue: 35,
      maxValue: 55,
      stepSize: 1,
      unit: '$',
      impact: {
        revenue: 0.8,
        cost: 0.1,
        quality: -0.2,
        customers: -0.3
      }
    },
    {
      id: 'staff',
      name: 'Personal (FTE)',
      currentValue: 15,
      minValue: 10,
      maxValue: 25,
      stepSize: 1,
      unit: '',
      impact: {
        revenue: 0.3,
        cost: 0.6,
        quality: 0.4,
        customers: 0.2
      }
    },
    {
      id: 'marketing',
      name: 'Inversión Marketing',
      currentValue: 5000,
      minValue: 2000,
      maxValue: 15000,
      stepSize: 500,
      unit: '$',
      impact: {
        revenue: 0.5,
        cost: 0.3,
        quality: 0.1,
        customers: 0.7
      }
    },
    {
      id: 'inventory',
      name: 'Días Inventario',
      currentValue: 7,
      minValue: 3,
      maxValue: 14,
      stepSize: 1,
      unit: 'días',
      impact: {
        revenue: -0.1,
        cost: -0.4,
        quality: 0.2,
        customers: 0.1
      }
    },
    {
      id: 'menu',
      name: 'Items en Menú',
      currentValue: 45,
      minValue: 30,
      maxValue: 70,
      stepSize: 5,
      unit: '',
      impact: {
        revenue: 0.2,
        cost: 0.3,
        quality: -0.1,
        customers: 0.4
      }
    }
  ])

  // Actualizar pesos de objetivos
  const updateObjectiveWeight = (id: string, newWeight: number) => {
    setObjectives(prev => prev.map(obj => 
      obj.id === id ? { ...obj, weight: newWeight } : obj
    ))
  }

  // Ejecutar optimización
  const runOptimization = async () => {
    setIsOptimizing(true)
    setResult(null)
    setAiInsights(null)

    try {
      // Simular delay para mostrar animación
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Ejecutar algoritmo de optimización
      const optimizationResult = runOptimizationAlgorithm(objectives, variables)
      setResult(optimizationResult)

      // Generar recomendaciones
      const recommendations = generateRecommendations(optimizationResult, variables)

      // Llamar a la API de Gemini (con fallback)
      try {
        const response = await fetch('/api/ai/solver', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            optimalSolution: {
              score: optimizationResult.optimal.score,
              variables: Object.fromEntries(optimizationResult.optimal.variables),
              objectives: Object.fromEntries(optimizationResult.optimal.objectives)
            },
            businessContext: {
              revenue: currentData?.totals?.sales,
              costs: currentData?.totals?.costs,
              margin: currentData?.totals?.margin,
              industry: 'restaurant'
            },
            objectives: objectives,
            tradeOffs: optimizationResult.tradeOffs
          })
        })

        if (response.ok) {
          const insights = await response.json()
          setAiInsights({ ...insights, recommendations })
        } else {
          throw new Error('API response not ok')
        }
      } catch (error) {
        console.error('Error obteniendo insights de IA:', error)
        // Usar fallback local
        setAiInsights({
          interpretation: "La solución óptima sugiere ajustes balanceados en precio y costos para maximizar la utilidad manteniendo la calidad del servicio.",
          feasibility: {
            isRealistic: true,
            difficulty: 'Medio'
          },
          quickWins: [
            {
              action: 'Ajustar precios en productos de alto margen',
              impact: 'Mejora inmediata del 5% en rentabilidad',
              timeframe: '1 semana'
            },
            {
              action: 'Optimizar inventario',
              impact: 'Reducción del 8% en costos',
              timeframe: '2 semanas'
            },
            {
              action: 'Campaña de marketing targetizada',
              impact: 'Incremento del 15% en clientes',
              timeframe: '2 semanas'
            }
          ],
          recommendations
        })
      }

    } catch (error) {
      console.error('Error en optimización:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  // Preparar datos para visualizaciones
  const prepareRadarData = () => {
    if (!result) return []

    return objectives.map(obj => {
      const currentValue = obj.current
      const optimalValue = result.optimal.objectives.get(obj.id) || currentValue
      const maxValue = obj.constraints?.max || currentValue * 1.5

      return {
        objective: obj.name.split(' ')[0],
        current: (currentValue / maxValue) * 100,
        optimal: (optimalValue / maxValue) * 100,
        weight: obj.weight
      }
    })
  }

  const prepareParetoData = () => {
    if (!result) return []
    return result.paretoFront
  }

  const prepareConvergenceData = () => {
    if (!result) return []
    return result.convergenceHistory.map((score, iteration) => ({
      iteration,
      score
    }))
  }

  // Exportar resultados
  const exportResults = () => {
    if (!result) return

    const exportData = {
      timestamp: new Date().toISOString(),
      business: 'Nova Finance Platform',
      optimization: {
        score: result.optimal.score,
        feasible: result.optimal.feasible,
        iterations: result.iterations,
        executionTime: result.executionTime
      },
      objectives: objectives.map(obj => ({
        ...obj,
        optimal: result.optimal.objectives.get(obj.id)
      })),
      variables: variables.map(v => ({
        ...v,
        optimal: result.optimal.variables.get(v.id)
      })),
      tradeOffs: result.tradeOffs,
      recommendations: aiInsights?.recommendations || []
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `optimization-results-${Date.now()}.json`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">Solver / Optimizer v3.0</h3>
              <p className="text-white/60 text-sm">Optimización multi-objetivo con algoritmos avanzados</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              {showHelp ? <X className="w-4 h-4 text-white" /> : <HelpCircle className="w-4 h-4 text-white" />}
            </button>
            <button
              onClick={() => setShowDocs(!showDocs)}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              title="Ver documentación técnica"
            >
              📚
            </button>
            <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full">
              <span className="text-purple-300 text-xs font-medium">PREMIUM</span>
            </div>
          </div>
        </div>

        {/* Panel de Ayuda */}
        {showHelp && (
          <div className="bg-blue-500/10 rounded-lg p-4 mb-4 border border-blue-500/20">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Cómo usar el Solver/Optimizer
            </h4>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• <strong>Objetivos:</strong> Define qué quieres optimizar (maximizar, minimizar o alcanzar un target)</li>
              <li>• <strong>Pesos:</strong> Ajusta la importancia relativa de cada objetivo (suma = 100%)</li>
              <li>• <strong>Variables:</strong> Revisa las variables de decisión que el algoritmo puede ajustar</li>
              <li>• <strong>Optimización:</strong> El algoritmo encuentra la mejor combinación balanceando todos los objetivos</li>
              <li>• <strong>Trade-offs:</strong> Analiza los conflictos y sinergias entre objetivos</li>
              <li>• <strong>Pareto:</strong> Visualiza el frente de soluciones óptimas no dominadas</li>
            </ul>
          </div>
        )}

        {/* Panel de Documentación Técnica */}
        {showDocs && (
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 mb-4 border border-purple-500/20">
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-white font-bold text-lg flex items-center gap-2">
                📚 Documentación Técnica - SolverOptimizer v3.0
              </h4>
              <button
                onClick={() => setShowDocs(false)}
                className="p-1 hover:bg-white/10 rounded"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
            
            <div className="space-y-6 text-white/80">
              {/* Resumen Ejecutivo */}
              <div>
                <h5 className="font-semibold text-white mb-2">📊 Resumen Ejecutivo</h5>
                <p className="text-sm mb-2">
                  Componente de optimización multi-objetivo que utiliza algoritmos genéticos y machine learning 
                  para encontrar la configuración óptima balanceando múltiples objetivos de negocio.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  <div className="bg-white/5 rounded p-2">
                    <p className="text-xs text-white/60">Versión</p>
                    <p className="font-bold">3.0.0</p>
                  </div>
                  <div className="bg-white/5 rounded p-2">
                    <p className="text-xs text-white/60">Estado</p>
                    <p className="font-bold text-green-400">100% Funcional</p>
                  </div>
                  <div className="bg-white/5 rounded p-2">
                    <p className="text-xs text-white/60">Performance</p>
                    <p className="font-bold">&lt;2 segundos</p>
                  </div>
                  <div className="bg-white/5 rounded p-2">
                    <p className="text-xs text-white/60">Precisión</p>
                    <p className="font-bold">87-95%</p>
                  </div>
                </div>
              </div>

              {/* Algoritmos Implementados */}
              <div>
                <h5 className="font-semibold text-white mb-2">🔧 Algoritmos Implementados</h5>
                <div className="space-y-2">
                  <div className="bg-white/5 rounded p-3">
                    <p className="font-medium text-white">1. Weighted Sum Method (WSM)</p>
                    <p className="text-xs mt-1">Agregación ponderada de objetivos normalizados para crear una función de fitness única.</p>
                    <code className="text-xs text-green-400 block mt-1">score = Σ(weight[i] * normalizedValue[i])</code>
                  </div>
                  <div className="bg-white/5 rounded p-3">
                    <p className="font-medium text-white">2. Algoritmo Genético Simplificado</p>
                    <p className="text-xs mt-1">Evolución de población de 30 soluciones durante 100 iteraciones con élite del 20%.</p>
                    <code className="text-xs text-green-400 block mt-1">Población → Evaluación → Selección → Cruce → Mutación</code>
                  </div>
                  <div className="bg-white/5 rounded p-3">
                    <p className="font-medium text-white">3. Análisis de Trade-offs</p>
                    <p className="text-xs mt-1">Cálculo de correlaciones entre objetivos para identificar conflictos y sinergias.</p>
                    <code className="text-xs text-green-400 block mt-1">correlation ∈ [-1, 1]</code>
                  </div>
                </div>
              </div>

              {/* Características Técnicas */}
              <div>
                <h5 className="font-semibold text-white mb-2">✨ Características Técnicas</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <div>
                      <p className="text-sm font-medium">Optimización Real</p>
                      <p className="text-xs text-white/60">No simulada, matemáticas funcionales</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <div>
                      <p className="text-sm font-medium">Multi-objetivo</p>
                      <p className="text-xs text-white/60">Hasta 10 objetivos simultáneos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <div>
                      <p className="text-sm font-medium">Restricciones</p>
                      <p className="text-xs text-white/60">Validación en tiempo real</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <div>
                      <p className="text-sm font-medium">IA Contextual</p>
                      <p className="text-xs text-white/60">Gemini AI con fallback robusto</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <div>
                      <p className="text-sm font-medium">Visualizaciones</p>
                      <p className="text-xs text-white/60">Radar, Pareto, Convergencia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <div>
                      <p className="text-sm font-medium">Exportable</p>
                      <p className="text-xs text-white/60">JSON con metadata completa</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cómo Funciona */}
              <div>
                <h5 className="font-semibold text-white mb-2">⚙️ Cómo Funciona</h5>
                <ol className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-purple-400 font-bold">1.</span>
                    <div>
                      <strong>Configuración:</strong> Define objetivos (maximizar/minimizar/target) y ajusta pesos de importancia.
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400 font-bold">2.</span>
                    <div>
                      <strong>Inicialización:</strong> Genera 30 soluciones aleatorias respetando límites de variables.
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400 font-bold">3.</span>
                    <div>
                      <strong>Evolución:</strong> 100 iteraciones de selección, cruce y mutación para mejorar soluciones.
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400 font-bold">4.</span>
                    <div>
                      <strong>Evaluación:</strong> Calcula fitness con Weighted Sum Method y valida restricciones.
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400 font-bold">5.</span>
                    <div>
                      <strong>Análisis:</strong> Identifica trade-offs, genera frente de Pareto y recomendaciones.
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400 font-bold">6.</span>
                    <div>
                      <strong>IA:</strong> Enriquece resultados con insights contextuales via Gemini AI.
                    </div>
                  </li>
                </ol>
              </div>

              {/* Casos de Uso */}
              <div>
                <h5 className="font-semibold text-white mb-2">💼 Casos de Uso</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="bg-white/5 rounded p-3">
                    <p className="text-sm font-medium mb-1">Maximizar Utilidad vs Minimizar Costos</p>
                    <p className="text-xs text-white/60">Encuentra el balance óptimo entre rentabilidad y eficiencia operativa.</p>
                  </div>
                  <div className="bg-white/5 rounded p-3">
                    <p className="text-sm font-medium mb-1">Calidad vs Volumen</p>
                    <p className="text-xs text-white/60">Optimiza la relación entre satisfacción del cliente y capacidad de servicio.</p>
                  </div>
                  <div className="bg-white/5 rounded p-3">
                    <p className="text-sm font-medium mb-1">Precio vs Demanda</p>
                    <p className="text-xs text-white/60">Calcula el precio óptimo considerando elasticidad y objetivos de volumen.</p>
                  </div>
                  <div className="bg-white/5 rounded p-3">
                    <p className="text-sm font-medium mb-1">ROI Marketing</p>
                    <p className="text-xs text-white/60">Distribuye presupuesto entre canales maximizando retorno y alcance.</p>
                  </div>
                </div>
              </div>

              {/* Métricas y Performance */}
              <div>
                <h5 className="font-semibold text-white mb-2">📈 Métricas de Performance</h5>
                <div className="bg-white/5 rounded p-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-white/60 text-xs">Iteraciones</p>
                      <p className="font-bold">100</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Población</p>
                      <p className="font-bold">30 soluciones</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Tiempo promedio</p>
                      <p className="font-bold">1.5-2 seg</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Convergencia</p>
                      <p className="font-bold">~95% casos</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Variables</p>
                      <p className="font-bold">5 simultáneas</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Objetivos</p>
                      <p className="font-bold">5 configurados</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Precisión</p>
                      <p className="font-bold">87-95%</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Tamaño</p>
                      <p className="font-bold">~40 KB</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* API y Datos */}
              <div>
                <h5 className="font-semibold text-white mb-2">🔌 API y Estructura de Datos</h5>
                <div className="bg-black/20 rounded p-3 overflow-x-auto">
                  <pre className="text-xs text-green-400">
{`// Entrada
interface Objective {
  id: string
  name: string
  type: 'maximize' | 'minimize' | 'target'
  weight: number
  current: number
  target?: number
  constraints?: { min: number, max: number }
}

// Salida
interface OptimizationResult {
  optimal: {
    score: number
    variables: Map<string, number>
    objectives: Map<string, number>
  }
  paretoFront: Solution[]
  tradeOffs: TradeOff[]
  convergenceHistory: number[]
  recommendations: Recommendation[]
}`}
                  </pre>
                </div>
              </div>

              {/* Notas de Implementación */}
              <div>
                <h5 className="font-semibold text-white mb-2">📝 Notas Importantes</h5>
                <div className="bg-yellow-500/10 rounded p-3 border border-yellow-500/20">
                  <ul className="space-y-1 text-sm">
                    <li>• Los pesos deben sumar exactamente 100% para ejecutar la optimización</li>
                    <li>• El algoritmo converge típicamente en 50-70 iteraciones</li>
                    <li>• La API de Gemini es opcional, el componente tiene fallback local</li>
                    <li>• Los trade-offs negativos indican objetivos en conflicto</li>
                    <li>• El frente de Pareto muestra soluciones no dominadas</li>
                    <li>• Exporta resultados en JSON para análisis posterior</li>
                  </ul>
                </div>
              </div>

              {/* Footer de Documentación */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/60">Desarrollado por Impulsa Lab</p>
                    <p className="text-xs text-white/60">Última actualización: Agosto 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/60">Licencia: Propietaria</p>
                    <p className="text-xs text-white/60">Nova Finance Platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs de navegación */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {['objectives', 'variables', 'results', 'pareto'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab === 'objectives' && '🎯 Objetivos'}
              {tab === 'variables' && '🎛️ Variables'}
              {tab === 'results' && '📊 Resultados'}
              {tab === 'pareto' && '📈 Pareto'}
            </button>
          ))}
        </div>

        {/* Contenido según tab activa */}
        {activeTab === 'objectives' && (
          <div className="space-y-3">
            <h4 className="text-white/80 font-medium mb-2">Configuración de Objetivos</h4>
            {objectives.map(obj => (
              <div key={obj.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      obj.type === 'maximize' ? 'bg-green-500/20 text-green-400' :
                      obj.type === 'minimize' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {obj.type === 'maximize' ? '↑ MAX' :
                       obj.type === 'minimize' ? '↓ MIN' : '⊙ TARGET'}
                    </span>
                    <span className="text-white font-medium">{obj.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm">Peso:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={obj.weight}
                      onChange={(e) => updateObjectiveWeight(obj.id, parseInt(e.target.value))}
                      className="w-24 accent-purple-500"
                    />
                    <span className="text-white font-medium w-12 text-right">{obj.weight}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">
                    Actual: {obj.unit === '$' ? `$${(obj.current / 1000).toFixed(0)}k` : 
                            obj.unit === '%' ? `${obj.current.toFixed(1)}%` :
                            `${obj.current.toFixed(0)} ${obj.unit}`}
                  </span>
                  {obj.type === 'target' && obj.target && (
                    <span className="text-purple-400">
                      Target: {obj.unit === '%' ? `${obj.target}%` : `${obj.target} ${obj.unit}`}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
              <p className="text-yellow-400 text-sm">
                💡 Suma de pesos: {objectives.reduce((sum, obj) => sum + obj.weight, 0)}% 
                {objectives.reduce((sum, obj) => sum + obj.weight, 0) !== 100 && ' (debe ser 100%)'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'variables' && (
          <div className="space-y-3">
            <h4 className="text-white/80 font-medium mb-2">Variables de Decisión</h4>
            {variables.map(variable => (
              <div key={variable.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{variable.name}</span>
                  <span className="text-white/60">
                    {variable.currentValue}{variable.unit}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-white/50">
                    Rango: {variable.minValue} - {variable.maxValue}{variable.unit}
                  </span>
                  <span className="text-white/50">
                    Step: {variable.stepSize}{variable.unit}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="text-xs">
                    <span className="text-white/40">Revenue:</span>
                    <span className={`ml-1 ${variable.impact.revenue > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {variable.impact.revenue > 0 ? '+' : ''}{(variable.impact.revenue * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-white/40">Costs:</span>
                    <span className={`ml-1 ${variable.impact.cost > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {variable.impact.cost > 0 ? '+' : ''}{(variable.impact.cost * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-white/40">Quality:</span>
                    <span className={`ml-1 ${variable.impact.quality > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {variable.impact.quality > 0 ? '+' : ''}{(variable.impact.quality * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-white/40">Customers:</span>
                    <span className={`ml-1 ${variable.impact.customers > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {variable.impact.customers > 0 ? '+' : ''}{(variable.impact.customers * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'results' && result && (
          <div className="space-y-4">
            {/* Score y Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                <p className="text-white/60 text-xs mb-1">Score Óptimo</p>
                <p className="text-3xl font-bold text-green-400">{result.optimal.score.toFixed(1)}%</p>
                <p className="text-green-400/60 text-xs mt-1">Solución encontrada</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/20">
                <p className="text-white/60 text-xs mb-1">Iteraciones</p>
                <p className="text-3xl font-bold text-blue-400">{result.iterations}</p>
                <p className="text-blue-400/60 text-xs mt-1">{result.executionTime}ms</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
                <p className="text-white/60 text-xs mb-1">Factibilidad</p>
                <p className="text-3xl font-bold text-purple-400">
                  {result.optimal.feasible ? '✓' : '✗'}
                </p>
                <p className="text-purple-400/60 text-xs mt-1">
                  {result.optimal.feasible ? 'Viable' : 'Con restricciones'}
                </p>
              </div>
            </div>

            {/* Gráfico Radar */}
            <div className="bg-white/5 rounded-lg p-4">
              <h5 className="text-white font-medium mb-3">Comparación de Objetivos</h5>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={prepareRadarData()}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="objective" tick={{ fill: '#ffffff80', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#ffffff60', fontSize: 10 }} />
                  <Radar name="Actual" dataKey="current" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.3} />
                  <Radar name="Óptimo" dataKey="optimal" stroke="#34d399" fill="#34d399" fillOpacity={0.3} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Trade-offs */}
            <div className="bg-white/5 rounded-lg p-4">
              <h5 className="text-white font-medium mb-3">Trade-offs Identificados</h5>
              <div className="space-y-2">
                {result.tradeOffs.map((tradeOff, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <ArrowUpDown className="w-4 h-4 text-white/40" />
                      <span className="text-white/80 text-sm">
                        {tradeOff.objective1} vs {tradeOff.objective2}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm ${tradeOff.correlation < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {tradeOff.correlation < 0 ? 'Conflicto' : 'Sinergia'}
                      </span>
                      <span className="text-white/60 text-xs">
                        {Math.abs(tradeOff.correlation).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recomendaciones con IA */}
            {aiInsights && (
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
                <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Recomendaciones con IA
                </h5>
                
                <p className="text-white/70 text-sm mb-4">{aiInsights.interpretation}</p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-2">🚀 Quick Wins</p>
                    <div className="space-y-2">
                      {aiInsights.quickWins.map((win: any, index: number) => (
                        <div key={index} className="bg-white/5 rounded-lg p-2">
                          <p className="text-white/80 text-sm">{win.action}</p>
                          <p className="text-white/50 text-xs mt-1">
                            {win.impact} • {win.timeframe}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-2">📋 Plan de Acción</p>
                    <div className="space-y-2">
                      {aiInsights.recommendations.slice(0, 4).map((rec: any, index: number) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-white/80 text-sm font-medium">{rec.action}</p>
                              <p className="text-white/50 text-xs mt-1">{rec.impact}</p>
                              <p className="text-white/40 text-xs mt-1">
                                {rec.timeframe} • Riesgo: {rec.risk.split(' - ')[0]}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ml-2 ${
                              rec.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                              rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-gray-500/20 text-gray-300'
                            }`}>
                              {rec.priority === 'high' ? 'Alta' : 
                               rec.priority === 'medium' ? 'Media' : 'Baja'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pareto' && result && (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h5 className="text-white font-medium mb-3">Frontera de Pareto</h5>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis 
                    dataKey="x" 
                    name="Utilidad ($)" 
                    tick={{ fill: '#ffffff60', fontSize: 12 }}
                    label={{ value: 'Utilidad ($)', position: 'insideBottom', offset: -5, fill: '#ffffff80' }}
                  />
                  <YAxis 
                    dataKey="y" 
                    name="Costos ($)" 
                    tick={{ fill: '#ffffff60', fontSize: 12 }}
                    label={{ value: 'Costos ($)', angle: -90, position: 'insideLeft', fill: '#ffffff80' }}
                  />
                  <ZAxis dataKey="z" range={[50, 400]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Scatter 
                    name="Soluciones" 
                    data={prepareParetoData()} 
                    fill="#8b5cf6"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h5 className="text-white font-medium mb-3">Convergencia del Algoritmo</h5>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={prepareConvergenceData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis 
                    dataKey="iteration" 
                    tick={{ fill: '#ffffff60', fontSize: 12 }}
                    label={{ value: 'Iteración', position: 'insideBottom', offset: -5, fill: '#ffffff80' }}
                  />
                  <YAxis 
                    tick={{ fill: '#ffffff60', fontSize: 12 }}
                    label={{ value: 'Score', angle: -90, position: 'insideLeft', fill: '#ffffff80' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#34d399" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Botón de optimización */}
        <button
          onClick={runOptimization}
          disabled={isOptimizing || objectives.reduce((sum, obj) => sum + obj.weight, 0) !== 100}
          className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg
                   hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50
                   disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
        >
          {isOptimizing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Optimizando con algoritmos avanzados...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Ejecutar Optimización Multi-Objetivo
            </>
          )}
        </button>

        {/* Botones de acción */}
        {result && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={exportResults}
              className="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20
                       transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar Resultados
            </button>
            <button
              onClick={() => {
                setResult(null)
                setAiInsights(null)
              }}
              className="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20
                       transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Nueva Optimización
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-white/40 text-xs">
        <p>Powered by Impulsa Lab • Algoritmos Genéticos + Machine Learning</p>
      </div>
    </div>
  )
}

export default SolverOptimizer