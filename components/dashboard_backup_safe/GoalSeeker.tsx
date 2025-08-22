import React, { useState, useEffect } from 'react'
import { 
  Target, TrendingUp, Calculator, Zap, AlertCircle, CheckCircle, 
  ArrowRight, Brain, Loader2, ChevronDown, ChevronUp, DollarSign,
  Users, Percent, BarChart3, Clock, Shield, Rocket, Info,
  Download, Share2, RefreshCw, Settings, Award, HelpCircle,
  BookOpen, X, ExternalLink
} from 'lucide-react'
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell 
} from 'recharts'

// Interfaces
interface GoalPath {
  id: string
  strategy: string
  description: string
  changes: {
    revenue?: number
    costs?: number
    prices?: number
    volume?: number
    efficiency?: number
  }
  feasibility: number
  risk: 'low' | 'medium' | 'high'
  timeToImplement: number
  monthlyMilestones: {
    month: number
    target: number
    actions: string[]
  }[]
  requiredInvestment: number
  roi: number
  breakeven: number
}

interface CurrentMetrics {
  revenue: number
  costs: number
  profit: number
  margin: number
  customers: number
  avgTicket: number
}

interface GoalTarget {
  metric: 'revenue' | 'profit' | 'margin' | 'customers'
  currentValue: number
  targetValue: number
  timeframe: number
}

interface DetailedPlan {
  implementation?: any
  kpis?: any
  budget?: any
  risks?: any
  quickWins?: any
  tools?: any
  communication?: any
}

interface GoalSeekerProps {
  currentData: any
}

const GoalSeeker: React.FC<GoalSeekerProps> = ({ currentData }) => {
  const [goalTarget, setGoalTarget] = useState<GoalTarget>({
    metric: 'profit',
    currentValue: 0,
    targetValue: 50000,
    timeframe: 30
  })
  
  const [constraints, setConstraints] = useState({
    maxPriceIncrease: 10,
    maxCostReduction: 15,
    maxLaborReduction: 10,
    minQualityScore: 85,
    maxInvestment: 50000
  })
  
  const [isCalculating, setIsCalculating] = useState(false)
  const [paths, setPaths] = useState<GoalPath[]>([])
  const [selectedPath, setSelectedPath] = useState<GoalPath | null>(null)
  const [detailedPlan, setDetailedPlan] = useState<DetailedPlan | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeTab, setActiveTab] = useState<'strategies' | 'timeline' | 'kpis' | 'risks'>('strategies')
  const [showQuickGuide, setShowQuickGuide] = useState(false)
  const [showFullDocs, setShowFullDocs] = useState(false)
  
  // Calcular métricas actuales
  const currentMetrics: CurrentMetrics = {
    revenue: currentData?.totals?.sales || 125000,
    costs: currentData?.totals?.costs || 82000,
    profit: currentData?.totals?.netProfit || 43000,
    margin: ((currentData?.totals?.netProfit || 43000) / (currentData?.totals?.sales || 125000)) * 100,
    customers: currentData?.totals?.covers || 2850,
    avgTicket: currentData?.averages?.ticketSize || 44
  }
  
  // Función para obtener valor actual
  function getCurrentValue(metrics: CurrentMetrics, metric: string): number {
    switch(metric) {
      case 'revenue': return metrics.revenue
      case 'profit': return metrics.profit
      case 'margin': return metrics.margin
      case 'customers': return metrics.customers
      default: return 0
    }
  }
  
  // Actualizar valor actual cuando cambia la métrica
  useEffect(() => {
    const currentValue = getCurrentValue(currentMetrics, goalTarget.metric)
    setGoalTarget(prev => ({ ...prev, currentValue }))
  }, [goalTarget.metric, currentData])
  
  // Templates de metas
  const goalTemplates = [
    {
      name: 'Aumentar Utilidad 20%',
      icon: '💰',
      metric: 'profit' as const,
      value: currentMetrics.profit * 1.2,
      timeframe: 30,
      color: 'from-blue-600/20 to-purple-600/20',
      borderColor: 'border-blue-500/30 hover:border-blue-400/50'
    },
    {
      name: 'Revenue +50K',
      icon: '📈',
      metric: 'revenue' as const,
      value: currentMetrics.revenue + 50000,
      timeframe: 45,
      color: 'from-purple-600/20 to-pink-600/20',
      borderColor: 'border-purple-500/30 hover:border-purple-400/50'
    },
    {
      name: 'Duplicar Clientes',
      icon: '👥',
      metric: 'customers' as const,
      value: currentMetrics.customers * 2,
      timeframe: 60,
      color: 'from-indigo-600/20 to-blue-600/20',
      borderColor: 'border-indigo-500/30 hover:border-indigo-400/50'
    },
    {
      name: 'Margen 40%',
      icon: '🎯',
      metric: 'margin' as const,
      value: 40,
      timeframe: 45,
      color: 'from-violet-600/20 to-purple-600/20',
      borderColor: 'border-violet-500/30 hover:border-violet-400/50'
    }
  ]
  
  // Generar hitos mensuales
  const generateMilestones = (current: any, target: any, strategy: string) => {
    const months = Math.min(4, Math.ceil(target.timeframe / 30))
    const increment = (target.targetValue - target.currentValue) / months
    
    return Array.from({ length: months }, (_, i) => ({
      month: i + 1,
      target: Math.round(target.currentValue + (increment * (i + 1))),
      actions: getMonthlyActions(strategy, i + 1)
    }))
  }
  
  // Obtener acciones mensuales
  const getMonthlyActions = (strategy: string, month: number): string[] => {
    const actions: any = {
      price: {
        1: ['Análisis de elasticidad', 'Benchmark competitivo', 'Test A/B precios'],
        2: ['Implementar nuevos precios', 'Comunicar valor', 'Monitorear ventas'],
        3: ['Ajustar según resultados', 'Optimizar mix', 'Refinar estrategia'],
        4: ['Consolidar cambios', 'Evaluar impacto', 'Planificar siguiente fase']
      },
      volume: {
        1: ['Campaña de marketing', 'Programa referidos', 'Mejorar SEO/SEM'],
        2: ['Expandir horarios', 'Promociones', 'Partnerships'],
        3: ['Eventos especiales', 'Fidelización', 'Optimizar conversión'],
        4: ['Escalar exitosos', 'Retención', 'Análisis ROI']
      },
      cost: {
        1: ['Auditoría de gastos', 'Negociar proveedores', 'Mapear procesos'],
        2: ['Implementar controles', 'Reducir desperdicios', 'Automatizar'],
        3: ['Optimizar staff', 'Mejorar productividad', 'Sistemas lean'],
        4: ['Monitorear ahorros', 'Documentar', 'Mejora continua']
      },
      digital: {
        1: ['Setup e-commerce', 'App móvil', 'Delivery partners'],
        2: ['Marketing digital', 'CRM implementation', 'Analytics'],
        3: ['Automatización', 'IA predictiva', 'Omnichannel'],
        4: ['Optimización', 'Escalar digital', 'Data-driven']
      },
      mixed: {
        1: ['Quick wins', 'Setup sistemas', 'Team alignment'],
        2: ['Ejecutar cambios', 'Medir impacto', 'Ajustar'],
        3: ['Escalar éxitos', 'Corregir fallos', 'Optimizar'],
        4: ['Consolidar', 'Evaluar', 'Plan futuro']
      }
    }
    
    return actions[strategy]?.[month] || actions.mixed[month] || []
  }
  
  // Algoritmo simplificado local
  const findPathsToGoal = (
    current: CurrentMetrics,
    target: GoalTarget,
    constraints: any
  ): GoalPath[] => {
    const paths: GoalPath[] = []
    const gap = ((target.targetValue / target.currentValue) - 1) * 100
    
    // Path 1: Optimización de precios
    if (gap <= 50) {
      paths.push({
        id: 'price-optimization',
        strategy: 'Optimización de Precios',
        description: 'Ajuste estratégico de precios con análisis de elasticidad',
        changes: {
          prices: Math.min(gap * 0.3, constraints.maxPriceIncrease),
          volume: -Math.min(gap * 0.1, 5),
          revenue: gap
        },
        feasibility: 85 - (gap * 0.5),
        risk: gap > 20 ? 'high' : 'medium',
        timeToImplement: Math.ceil(target.timeframe / 30),
        monthlyMilestones: generateMilestones(current, target, 'price'),
        requiredInvestment: 5000,
        roi: 250,
        breakeven: 1
      })
    }
    
    // Path 2: Crecimiento de volumen
    paths.push({
      id: 'volume-growth',
      strategy: 'Expansión de Mercado',
      description: 'Captación agresiva de nuevos clientes y aumento de frecuencia',
      changes: {
        volume: gap * 1.2,
        costs: gap * 0.7,
        revenue: gap
      },
      feasibility: 70 - (gap * 0.3),
      risk: gap > 30 ? 'high' : 'medium',
      timeToImplement: Math.ceil(target.timeframe / 30),
      monthlyMilestones: generateMilestones(current, target, 'volume'),
      requiredInvestment: 15000,
      roi: 180,
      breakeven: 2
    })
    
    // Path 3: Optimización de costos
    if (target.metric === 'profit' || target.metric === 'margin') {
      paths.push({
        id: 'cost-optimization',
        strategy: 'Eficiencia Operativa',
        description: 'Reducción sistemática de costos sin afectar calidad',
        changes: {
          costs: -Math.min(gap * 0.5, constraints.maxCostReduction),
          efficiency: 20
        },
        feasibility: 80 - (gap * 0.2),
        risk: 'low',
        timeToImplement: Math.ceil(target.timeframe / 30),
        monthlyMilestones: generateMilestones(current, target, 'cost'),
        requiredInvestment: 8000,
        roi: 200,
        breakeven: 1.5
      })
    }
    
    // Path 4: Transformación digital
    paths.push({
      id: 'digital-transformation',
      strategy: 'Transformación Digital',
      description: 'Digitalización completa para nuevos canales y eficiencia',
      changes: {
        revenue: gap * 0.8,
        costs: -10,
        efficiency: 30
      },
      feasibility: 65,
      risk: 'medium',
      timeToImplement: Math.ceil(target.timeframe / 30),
      monthlyMilestones: generateMilestones(current, target, 'digital'),
      requiredInvestment: 25000,
      roi: 300,
      breakeven: 3
    })
    
    // Path 5: Estrategia mixta
    paths.push({
      id: 'balanced-approach',
      strategy: 'Estrategia Integral',
      description: 'Combinación balanceada de todas las estrategias',
      changes: {
        prices: Math.min(gap * 0.2, constraints.maxPriceIncrease / 2),
        volume: gap * 0.4,
        costs: -Math.min(gap * 0.2, constraints.maxCostReduction / 2),
        efficiency: 15
      },
      feasibility: 75,
      risk: 'medium',
      timeToImplement: Math.ceil(target.timeframe / 30),
      monthlyMilestones: generateMilestones(current, target, 'mixed'),
      requiredInvestment: 12000,
      roi: 220,
      breakeven: 2
    })
    
    return paths.filter(p => p.feasibility > 30).sort((a, b) => b.feasibility - a.feasibility)
  }
  
  // Calcular caminos hacia el objetivo
  const calculatePaths = async () => {
    setIsCalculating(true)
    setPaths([])
    setSelectedPath(null)
    setDetailedPlan(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const calculatedPaths = findPathsToGoal(currentMetrics, goalTarget, constraints)
      setPaths(calculatedPaths)
      
      if (calculatedPaths.length > 0) {
        setSelectedPath(calculatedPaths[0])
      }
    } catch (error) {
      console.error('Error calculando paths:', error)
    } finally {
      setIsCalculating(false)
    }
  }
  
  // Obtener plan detallado con IA
  const getDetailedPlan = async (path: GoalPath) => {
    try {
      const response = await fetch('/api/ai/goalplan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentMetrics,
          targetGoal: goalTarget,
          selectedPath: path,
          timeframe: goalTarget.timeframe
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setDetailedPlan(data.plan)
      }
    } catch (error) {
      console.error('Error obteniendo plan detallado:', error)
      setDetailedPlan(generateLocalPlan(path))
    }
  }
  
  // Generar plan local como fallback
  const generateLocalPlan = (path: GoalPath) => ({
    quickWins: [
      { action: 'Optimizar menú con items de alto margen', impact: '+5% profit', cost: '$0' },
      { action: 'Implementar happy hour estratégico', impact: '+10% volume', cost: '$200' },
      { action: 'Programa de referidos', impact: '+15 clientes/día', cost: '$100' }
    ],
    kpis: {
      daily: ['Ventas', 'Clientes', 'Ticket promedio'],
      weekly: ['Margen', 'Satisfacción', 'Eficiencia'],
      monthly: ['ROI', 'Market share', 'Retención']
    }
  })
  
  return (
    <div className="space-y-6">
      {/* Modal de Guía Rápida */}
      {showQuickGuide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Rocket className="w-6 h-6 text-purple-400" />
                Guía Rápida - GoalSeeker AI
              </h2>
              <button
                onClick={() => setShowQuickGuide(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] prose prose-invert max-w-none">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">¿Qué es GoalSeeker AI?</h3>
                  <p className="text-white/80">
                    Tu copiloto inteligente para alcanzar objetivos financieros. Analiza tu negocio y encuentra el mejor camino hacia tus metas usando algoritmos avanzados.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">⚡ Inicio Rápido en 3 Pasos</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</span>
                      <div>
                        <p className="text-white font-medium">Define tu Meta</p>
                        <p className="text-white/60 text-sm">Usa un template o configura: métrica → valor → plazo</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">2</span>
                      <div>
                        <p className="text-white font-medium">Busca Estrategias</p>
                        <p className="text-white/60 text-sm">Clic en "Buscar Caminos Óptimos" y espera el análisis</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">3</span>
                      <div>
                        <p className="text-white font-medium">Elige y Ejecuta</p>
                        <p className="text-white/60 text-sm">Revisa estrategias, selecciona y obtén el plan detallado</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">📊 Interpretación Rápida</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-green-500/20 rounded-lg">
                      <span className="text-green-400">🟢</span>
                      <div>
                        <span className="text-white font-medium">Factibilidad Alta (&gt;70%)</span>
                        <span className="text-white/60 text-sm ml-2">¡Adelante! Alta probabilidad de éxito</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/20 rounded-lg">
                      <span className="text-yellow-400">🟡</span>
                      <div>
                        <span className="text-white font-medium">Factibilidad Media (40-70%)</span>
                        <span className="text-white/60 text-sm ml-2">Procede con monitoreo cercano</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-500/20 rounded-lg">
                      <span className="text-red-400">🔴</span>
                      <div>
                        <span className="text-white font-medium">Factibilidad Baja (&lt;40%)</span>
                        <span className="text-white/60 text-sm ml-2">Reconsidera objetivo o plazo</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">✅ Tips Rápidos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-green-400 font-medium mb-2">Haz esto:</p>
                      <ul className="space-y-1 text-white/80 text-sm">
                        <li>✅ Objetivos del 20-30%</li>
                        <li>✅ Plazos de 30-90 días</li>
                        <li>✅ Revisa todas las estrategias</li>
                        <li>✅ Considera tu capacidad real</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-red-400 font-medium mb-2">Evita esto:</p>
                      <ul className="space-y-1 text-white/80 text-sm">
                        <li>❌ Objetivos irreales (&gt;100%)</li>
                        <li>❌ Ignorar el riesgo</li>
                        <li>❌ Elegir solo por ROI</li>
                        <li>❌ Cambiar muy rápido</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      setShowQuickGuide(false)
                      setShowFullDocs(true)
                    }}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    Ver Documentación Completa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Documentación Completa */}
      {showFullDocs && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-400" />
                Manual Completo - GoalSeeker AI
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open('/docs/goalseeker', '_blank')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Abrir en nueva pestaña"
                >
                  <ExternalLink className="w-5 h-5 text-white/60" />
                </button>
                <button
                  onClick={() => setShowFullDocs(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <div className="prose prose-invert max-w-none">
                <p className="text-purple-400 font-medium mb-4">
                  📖 Navegación Rápida: Usa el scroll o Ctrl+F para buscar
                </p>
                
                {/* Tabla de Contenidos */}
                <div className="bg-white/5 rounded-xl p-4 mb-6">
                  <h3 className="text-white font-semibold mb-3">📚 Contenido</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <a href="#intro" className="text-blue-400 hover:text-blue-300">1. Introducción</a>
                    <a href="#strategies" className="text-blue-400 hover:text-blue-300">2. Estrategias</a>
                    <a href="#metrics" className="text-blue-400 hover:text-blue-300">3. Métricas</a>
                    <a href="#cases" className="text-blue-400 hover:text-blue-300">4. Casos de Uso</a>
                    <a href="#faq" className="text-blue-400 hover:text-blue-300">5. FAQ</a>
                    <a href="#glossary" className="text-blue-400 hover:text-blue-300">6. Glosario</a>
                  </div>
                </div>

                {/* Contenido principal - versión resumida para el modal */}
                <div className="space-y-8">
                  <section id="intro">
                    <h2 className="text-2xl font-bold text-white mb-4">🎯 ¿Qué es GoalSeeker AI?</h2>
                    <p className="text-white/80 mb-4">
                      GoalSeeker AI es una herramienta de inteligencia artificial que ayuda a los dueños de negocios a encontrar el camino más efectivo para alcanzar sus objetivos financieros.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-500/10 p-4 rounded-lg">
                        <h4 className="text-blue-400 font-semibold mb-2">5 Estrategias</h4>
                        <p className="text-white/60 text-sm">Calculadas matemáticamente para tu situación</p>
                      </div>
                      <div className="bg-purple-500/10 p-4 rounded-lg">
                        <h4 className="text-purple-400 font-semibold mb-2">Análisis IA</h4>
                        <p className="text-white/60 text-sm">Planes detallados con inteligencia artificial</p>
                      </div>
                      <div className="bg-green-500/10 p-4 rounded-lg">
                        <h4 className="text-green-400 font-semibold mb-2">ROI Calculado</h4>
                        <p className="text-white/60 text-sm">Inversión y retorno esperado</p>
                      </div>
                    </div>
                  </section>

                  <section id="strategies">
                    <h2 className="text-2xl font-bold text-white mb-4">🚀 Las 5 Estrategias</h2>
                    <div className="space-y-4">
                      {[
                        { icon: '💎', name: 'Optimización de Precios', desc: 'Ajuste estratégico basado en elasticidad', inv: 'Baja' },
                        { icon: '📈', name: 'Expansión de Mercado', desc: 'Crecimiento de base de clientes', inv: 'Media' },
                        { icon: '⚡', name: 'Eficiencia Operativa', desc: 'Reducción de costos sin afectar calidad', inv: 'Baja' },
                        { icon: '🚀', name: 'Transformación Digital', desc: 'Nuevos canales y automatización', inv: 'Alta' },
                        { icon: '🎯', name: 'Estrategia Integral', desc: 'Combinación balanceada', inv: 'Media' }
                      ].map((strategy, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                          <span className="text-2xl">{strategy.icon}</span>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{strategy.name}</h4>
                            <p className="text-white/60 text-sm">{strategy.desc}</p>
                          </div>
                          <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                            Inv: {strategy.inv}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section id="metrics">
                    <h2 className="text-2xl font-bold text-white mb-4">📊 Métricas Clave</h2>
                    <div className="bg-white/5 rounded-lg p-4">
                      <dl className="space-y-3">
                        <div className="flex justify-between">
                          <dt className="text-white/60">ROI (Return on Investment)</dt>
                          <dd className="text-white font-medium">&gt;200% = Excelente</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-white/60">Payback</dt>
                          <dd className="text-white font-medium">&lt;3 meses = Ideal</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-white/60">Factibilidad</dt>
                          <dd className="text-white font-medium">&gt;70% = Alta probabilidad</dd>
                        </div>
                      </dl>
                    </div>
                  </section>

                  <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                    <p className="text-white text-center">
                      Para la documentación completa con todos los detalles, casos de uso, FAQ y glosario,
                      <button
                        onClick={() => window.open('/docs/goalseeker', '_blank')}
                        className="text-blue-400 hover:text-blue-300 underline ml-1"
                      >
                        visita la página completa →
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header del componente */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                      rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">Goal Seeker AI</h3>
              <p className="text-white/60 text-sm">Encuentra el camino óptimo hacia tus objetivos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold rounded-full animate-pulse">
              PREMIUM
            </span>
            <button
              onClick={() => setShowQuickGuide(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
              title="Guía Rápida"
            >
              <HelpCircle className="w-5 h-5 text-white/60 group-hover:text-white" />
            </button>
            <button
              onClick={() => setShowFullDocs(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
              title="Manual Completo"
            >
              <BookOpen className="w-5 h-5 text-white/60 group-hover:text-white" />
            </button>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              {showAdvanced ? 'Ocultar' : 'Avanzado'}
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Templates de Metas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {goalTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => {
                setGoalTarget({
                  metric: template.metric,
                  currentValue: getCurrentValue(currentMetrics, template.metric),
                  targetValue: template.value,
                  timeframe: template.timeframe
                })
              }}
              className={`p-4 bg-gradient-to-br ${template.color} backdrop-blur-sm
                         rounded-xl border ${template.borderColor} transition-all 
                         text-left group hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20`}
            >
              <div className="text-2xl mb-2">{template.icon}</div>
              <p className="text-white/90 text-sm font-medium">{template.name}</p>
              <p className="text-white/60 text-xs mt-1">
                {template.timeframe} días
              </p>
            </button>
          ))}
        </div>

        {/* Configuración de Meta */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-white/60 text-xs block mb-2">Métrica Objetivo</label>
            <select
              value={goalTarget.metric}
              onChange={(e) => {
                const metric = e.target.value as any
                setGoalTarget(prev => ({
                  ...prev,
                  metric,
                  currentValue: getCurrentValue(currentMetrics, metric)
                }))
              }}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:bg-white/20 focus:border-white/40 transition-all"
            >
              <option value="profit">Utilidad ($)</option>
              <option value="revenue">Ingresos ($)</option>
              <option value="margin">Margen (%)</option>
              <option value="customers">Clientes (#)</option>
            </select>
          </div>

          <div>
            <label className="text-white/60 text-xs block mb-2">
              Valor Actual
            </label>
            <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80">
              {goalTarget.metric === 'margin' 
                ? `${goalTarget.currentValue.toFixed(1)}%`
                : goalTarget.metric === 'customers'
                ? goalTarget.currentValue.toLocaleString()
                : `$${goalTarget.currentValue.toLocaleString()}`
              }
            </div>
          </div>

          <div>
            <label className="text-white/60 text-xs block mb-2">
              Valor Objetivo
            </label>
            <input
              type="number"
              value={goalTarget.targetValue}
              onChange={(e) => setGoalTarget(prev => ({ 
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
              value={goalTarget.timeframe}
              onChange={(e) => setGoalTarget(prev => ({ 
                ...prev, 
                timeframe: Number(e.target.value) 
              }))}
              min="7"
              max="365"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:bg-white/20 focus:border-white/40 transition-all"
            />
          </div>
        </div>

        {/* Restricciones Avanzadas */}
        {showAdvanced && (
          <div className="mt-6 p-4 bg-white/5 rounded-xl space-y-4">
            <h4 className="text-white/80 text-sm font-medium mb-3">Restricciones y Límites</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-white/60 text-xs block mb-2">Max Aumento Precio</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={constraints.maxPriceIncrease}
                    onChange={(e) => setConstraints(prev => ({
                      ...prev,
                      maxPriceIncrease: Number(e.target.value)
                    }))}
                    className="flex-1"
                  />
                  <span className="text-white/80 text-sm w-12 text-right">
                    {constraints.maxPriceIncrease}%
                  </span>
                </div>
              </div>

              <div>
                <label className="text-white/60 text-xs block mb-2">Max Reducción Costos</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={constraints.maxCostReduction}
                    onChange={(e) => setConstraints(prev => ({
                      ...prev,
                      maxCostReduction: Number(e.target.value)
                    }))}
                    className="flex-1"
                  />
                  <span className="text-white/80 text-sm w-12 text-right">
                    {constraints.maxCostReduction}%
                  </span>
                </div>
              </div>

              <div>
                <label className="text-white/60 text-xs block mb-2">Max Inversión</label>
                <input
                  type="number"
                  value={constraints.maxInvestment}
                  onChange={(e) => setConstraints(prev => ({
                    ...prev,
                    maxInvestment: Number(e.target.value)
                  }))}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                  step="5000"
                />
              </div>
            </div>
          </div>
        )}

        {/* Botón Buscar Solución */}
        <button
          onClick={calculatePaths}
          disabled={isCalculating || goalTarget.targetValue <= goalTarget.currentValue}
          className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                   rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all 
                   hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center 
                   justify-center gap-2"
        >
          {isCalculating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analizando estrategias con IA...
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              Buscar Caminos Óptimos
            </>
          )}
        </button>

        {/* Validación */}
        {goalTarget.targetValue <= goalTarget.currentValue && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              El objetivo debe ser mayor al valor actual
            </p>
          </div>
        )}
      </div>

      {/* Resultados */}
      {paths.length > 0 && (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
            {(['strategies', 'timeline', 'kpis', 'risks'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab === 'strategies' && 'Estrategias'}
                {tab === 'timeline' && 'Timeline'}
                {tab === 'kpis' && 'KPIs'}
                {tab === 'risks' && 'Riesgos'}
              </button>
            ))}
          </div>

          {/* Contenido según tab */}
          {activeTab === 'strategies' && (
            <div className="grid gap-4">
              {paths.map((path) => (
                <div 
                  key={path.id}
                  className={`p-5 rounded-xl border transition-all cursor-pointer
                    ${selectedPath?.id === path.id 
                      ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-purple-500/50' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  onClick={() => {
                    setSelectedPath(path)
                    getDetailedPlan(path)
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-semibold text-lg">{path.strategy}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${path.risk === 'low' ? 'bg-green-500/20 text-green-400' : 
                            path.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                            'bg-red-500/20 text-red-400'}`}>
                          Riesgo {path.risk === 'low' ? 'Bajo' : path.risk === 'medium' ? 'Medio' : 'Alto'}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm mb-3">{path.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{path.feasibility}%</div>
                      <div className="text-xs text-white/60">Factibilidad</div>
                    </div>
                  </div>

                  {/* Métricas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white/5 rounded-lg p-2">
                      <div className="text-white/60 text-xs mb-1">Inversión</div>
                      <div className="text-white font-medium">${path.requiredInvestment.toLocaleString()}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <div className="text-white/60 text-xs mb-1">ROI</div>
                      <div className="text-green-400 font-medium">{path.roi}%</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <div className="text-white/60 text-xs mb-1">Payback</div>
                      <div className="text-white font-medium">{path.breakeven} meses</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <div className="text-white/60 text-xs mb-1">Tiempo</div>
                      <div className="text-white font-medium">{path.timeToImplement} meses</div>
                    </div>
                  </div>

                  {/* Cambios */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(path.changes).filter(([_, value]) => value).map(([key, value]) => (
                      <span key={key} className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/80">
                        {key === 'prices' && `Precios ${value > 0 ? '+' : ''}${value}%`}
                        {key === 'volume' && `Volumen ${value > 0 ? '+' : ''}${value}%`}
                        {key === 'costs' && `Costos ${value}%`}
                        {key === 'efficiency' && `Eficiencia +${value}%`}
                        {key === 'revenue' && `Revenue ${value > 0 ? '+' : ''}${value}%`}
                      </span>
                    ))}
                  </div>

                  {selectedPath?.id === path.id && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          getDetailedPlan(path)
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 
                                 text-white rounded-lg text-sm hover:shadow-lg transition-all"
                      >
                        Ver Plan Detallado con IA →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'timeline' && selectedPath && (
            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="text-white font-semibold mb-4">Timeline de Implementación</h4>
              <div className="space-y-4">
                {selectedPath.monthlyMilestones.map((milestone, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-20 text-center">
                      <div className="text-white/40 text-xs">Mes</div>
                      <div className="text-white font-bold text-lg">{milestone.month}</div>
                    </div>
                    <div className="flex-1">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="text-white/80 font-medium mb-2">
                          Objetivo: ${milestone.target.toLocaleString()}
                        </div>
                        <ul className="space-y-1">
                          {milestone.actions.map((action, idx) => (
                            <li key={idx} className="text-white/60 text-sm flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'kpis' && selectedPath && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-5">
                <h5 className="text-white/80 font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  KPIs Diarios
                </h5>
                <ul className="space-y-2">
                  <li className="text-white/60 text-sm">• Ventas vs objetivo</li>
                  <li className="text-white/60 text-sm">• Clientes nuevos</li>
                  <li className="text-white/60 text-sm">• Ticket promedio</li>
                  <li className="text-white/60 text-sm">• Conversión</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-5">
                <h5 className="text-white/80 font-medium mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-400" />
                  KPIs Semanales
                </h5>
                <ul className="space-y-2">
                  <li className="text-white/60 text-sm">• Revenue acumulado</li>
                  <li className="text-white/60 text-sm">• Margen bruto</li>
                  <li className="text-white/60 text-sm">• Satisfacción NPS</li>
                  <li className="text-white/60 text-sm">• Eficiencia operativa</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-5">
                <h5 className="text-white/80 font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  KPIs Mensuales
                </h5>
                <ul className="space-y-2">
                  <li className="text-white/60 text-sm">• ROI acumulado</li>
                  <li className="text-white/60 text-sm">• Market share</li>
                  <li className="text-white/60 text-sm">• Retención clientes</li>
                  <li className="text-white/60 text-sm">• Crecimiento YoY</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'risks' && selectedPath && (
            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-400" />
                Matriz de Riesgos y Mitigaciones
              </h4>
              <div className="space-y-3">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-white font-medium mb-1">Resistencia del mercado</h5>
                      <p className="text-white/60 text-sm">
                        Mitigación: Implementación gradual, comunicación de valor, segmentación
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-white font-medium mb-1">Capacidad operativa</h5>
                      <p className="text-white/60 text-sm">
                        Mitigación: Contratación temporal, automatización, optimización de procesos
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-white font-medium mb-1">Competencia</h5>
                      <p className="text-white/60 text-sm">
                        Mitigación: Diferenciación, programa de lealtad, respuesta ágil
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Plan Detallado */}
          {detailedPlan && selectedPath && (
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-purple-400" />
                Quick Wins - Primeros 7 Días
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(detailedPlan.quickWins || []).slice(0, 3).map((win: any, index: number) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/90 font-medium text-sm mb-1">{win.action}</div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-400">{win.impact}</span>
                      <span className="text-white/60">{win.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-white/40 text-xs">
        Powered by Impulsa Lab AI • Algoritmos Avanzados de Optimización
      </div>
    </div>
  )
}

export default GoalSeeker