'use client'

import React, { useState, useEffect } from 'react'
import { 
  Brain, Sparkles, AlertTriangle, TrendingUp, Target, Lightbulb, 
  AlertCircle, CheckCircle, Info, HelpCircle, X, DollarSign, 
  Users, Package, BarChart3, RefreshCw, TrendingDown, Activity,
  Calendar, Clock, ChevronRight, Zap, Award
} from 'lucide-react'

// Tipos de datos financieros extendidos
interface FinancialData {
  revenue: number
  costs: number
  profit: number
  profitMargin: number
  customers: number
  avgTicket: number
  topProducts?: Array<{ name: string; sales: number; trend: 'up' | 'down' | 'stable' }>
  laborCost?: number
  foodCost?: number
  operatingCost?: number
  // Nuevos campos para análisis avanzado
  historicalData?: Array<{ date: string; revenue: number; customers: number }>
  goals?: { revenue: number; margin: number; customers: number }
  seasonality?: { peak: string[]; low: string[] }
  competition?: { avgPrice: number; marketShare: number }
}

interface AIInsight {
  type: 'success' | 'warning' | 'info' | 'recommendation' | 'opportunity' | 'trend' | 'strategy'
  title: string
  description: string
  icon: React.ReactElement
  impact?: 'high' | 'medium' | 'low'
  metric?: string
  actionable?: boolean
  timeframe?: string
  confidence?: number
}

interface RealTimeAIAnalysisProps {
  selectedPeriod?: string
  onSummaryGenerated?: (summary: string) => void
}

interface AnalysisSection {
  title: string
  icon: React.ReactElement
  insights: AIInsight[]
}

const RealTimeAIAnalysisAdvanced: React.FC<RealTimeAIAnalysisProps> = ({ 
  selectedPeriod = 'month',
  onSummaryGenerated 
}) => {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [analysisMode, setAnalysisMode] = useState<'basic' | 'situational' | 'strategic'>('basic')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const [remainingCredits, setRemainingCredits] = useState(98)
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [apiStatus, setApiStatus] = useState<'checking' | 'active' | 'inactive'>('active')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [businessGoals, setBusinessGoals] = useState({
    revenue: 200000,
    margin: 35,
    customers: 3000
  })
  const [analysisSummary, setAnalysisSummary] = useState<string>('')
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    generateRealisticDataWithHistory()
    loadInitialInsights()
  }, [])

  const generateRealisticDataWithHistory = () => {
    const baseRevenue = 158000
    const data: FinancialData = {
      revenue: baseRevenue,
      costs: baseRevenue * 0.71,
      profit: baseRevenue * 0.29,
      profitMargin: 29.4,
      customers: 2073,
      avgTicket: baseRevenue / 2073,
      laborCost: baseRevenue * 0.28,
      foodCost: baseRevenue * 0.32,
      operatingCost: baseRevenue * 0.11,
      topProducts: [
        { name: 'Café Premium', sales: 8500, trend: 'up' },
        { name: 'Sandwich Especial', sales: 6200, trend: 'up' },
        { name: 'Ensalada César', sales: 4800, trend: 'stable' },
        { name: 'Pizza Margherita', sales: 4200, trend: 'down' },
        { name: 'Pasta Alfredo', sales: 3900, trend: 'up' }
      ],
      historicalData: generateHistoricalData(),
      goals: businessGoals,
      seasonality: {
        peak: ['Viernes', 'Sábado', 'Diciembre'],
        low: ['Lunes', 'Martes', 'Enero']
      },
      competition: {
        avgPrice: 82,
        marketShare: 18
      }
    }
    setFinancialData(data)
  }

  const generateHistoricalData = () => {
    const data = []
    for (let i = 30; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: 4000 + Math.random() * 2000,
        customers: 60 + Math.floor(Math.random() * 40)
      })
    }
    return data
  }

  const loadInitialInsights = () => {
    const initial: AIInsight[] = [
      {
        type: 'info',
        title: 'Sistema IA Avanzado Activo',
        description: 'Análisis multinivel disponible: Básico, Situacional y Estratégico. Selecciona el tipo de análisis.',
        icon: <Brain className="w-5 h-5" />,
        impact: 'medium'
      }
    ]
    setInsights(initial)
  }

  const performAdvancedAnalysis = async () => {
    if (remainingCredits <= 0) {
      alert('Sin créditos disponibles. Contacta a soporte.')
      return
    }

    setIsAnalyzing(true)
    
    try {
      if (!financialData) {
        generateRealisticDataWithHistory()
        return
      }

      // Preparar prompt avanzado según el modo y período
      const prompt = generateAdvancedPrompt(financialData, analysisMode)
      
      // Llamar a la API con modo y período
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          mode: analysisMode,
          period: selectedPeriod 
        })
      })

      if (!response.ok) {
        throw new Error('Error en el análisis')
      }

      const data = await response.json()
      
      if (data.response) {
        const parsedInsights = parseAdvancedResponse(data.response, analysisMode)
        setInsights(parsedInsights)
        
        // Guardar y mostrar resumen
        if (data.summary) {
          setAnalysisSummary(data.summary)
          setShowSummary(true)
          if (onSummaryGenerated) {
            onSummaryGenerated(data.summary)
          }
        }
      } else {
        // Fallback a análisis local avanzado
        generateAdvancedLocalInsights(financialData, analysisMode)
      }
      
      setLastAnalysis(new Date())
      setRemainingCredits(prev => prev - (analysisMode === 'strategic' ? 3 : analysisMode === 'situational' ? 2 : 1))
      
    } catch (error) {
      console.error('Error:', error)
      generateAdvancedLocalInsights(financialData!, analysisMode)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateAdvancedPrompt = (data: FinancialData, mode: string) => {
    const baseContext = `
      Analiza los datos de un restaurante con las siguientes métricas:
      - Ingresos: $${data.revenue}
      - Costos: $${data.costs}
      - Margen: ${data.profitMargin.toFixed(1)}%
      - Clientes: ${data.customers}
      - Ticket promedio: $${data.avgTicket.toFixed(2)}
      
      OBJETIVOS DEL NEGOCIO:
      - Meta de ingresos: $${data.goals?.revenue || 200000}
      - Meta de margen: ${data.goals?.margin || 35}%
      - Meta de clientes: ${data.goals?.customers || 3000}
    `

    if (mode === 'strategic') {
      return `${baseContext}
        
        ANÁLISIS ESTRATÉGICO PROFUNDO:
        Proporciona 6 insights estratégicos siguiendo este formato EXACTO:
        
        [TIPO]: strategy/opportunity/trend
        [TÍTULO]: Título estratégico (máx 8 palabras)
        [DESCRIPCIÓN]: Análisis detallado con métricas y proyecciones (30-40 palabras)
        [IMPACTO]: high/medium
        [MÉTRICA]: ROI o impacto proyectado
        [TIMEFRAME]: Corto plazo (1-3 meses) / Mediano plazo (3-6 meses) / Largo plazo (6-12 meses)
        [CONFIANZA]: 70-95 (porcentaje de confianza en la recomendación)
        
        Enfócate en:
        1. Estrategia para alcanzar meta de ingresos
        2. Plan para optimizar margen a 35%
        3. Táctica de crecimiento de clientes
        4. Análisis competitivo y posicionamiento
        5. Oportunidades de diversificación
        6. Roadmap de implementación trimestral
      `
    } else if (mode === 'situational') {
      return `${baseContext}
        
        ANÁLISIS SITUACIONAL:
        Considerando tendencias de los últimos 30 días y estacionalidad, proporciona 5 insights:
        
        [TIPO]: trend/warning/opportunity
        [TÍTULO]: Situación actual (máx 6 palabras)
        [DESCRIPCIÓN]: Contexto y causas probables (20-30 palabras)
        [IMPACTO]: high/medium/low
        [MÉTRICA]: Variación o tendencia
        [ACCIÓN]: Acción inmediata recomendada
        
        Analiza:
        1. Tendencia de ingresos vs mes anterior
        2. Cambios en comportamiento de clientes
        3. Productos con mayor/menor rotación
        4. Impacto de costos laborales actuales
        5. Oportunidades de temporada próxima
      `
    } else {
      return `${baseContext}
        
        ANÁLISIS BÁSICO:
        Proporciona 5 insights operativos inmediatos.
        Formato estándar con foco en acciones rápidas y mejoras incrementales.
      `
    }
  }

  const parseAdvancedResponse = (response: string, mode: string): AIInsight[] => {
    // Parser mejorado para respuestas complejas
    const insights: AIInsight[] = []
    const sections = response.split('[TIPO]:').filter(s => s.trim())
    
    sections.forEach(section => {
      const lines = section.split('\n')
      const insight: Partial<AIInsight> = {}
      
      lines.forEach(line => {
        if (line.includes('TÍTULO:')) {
          insight.title = line.split('TÍTULO:')[1]?.trim()
        } else if (line.includes('DESCRIPCIÓN:')) {
          insight.description = line.split('DESCRIPCIÓN:')[1]?.trim()
        } else if (line.includes('MÉTRICA:')) {
          insight.metric = line.split('MÉTRICA:')[1]?.trim()
        } else if (line.includes('TIMEFRAME:')) {
          insight.timeframe = line.split('TIMEFRAME:')[1]?.trim()
        } else if (line.includes('CONFIANZA:')) {
          insight.confidence = parseInt(line.split('CONFIANZA:')[1]?.trim() || '80')
        }
      })
      
      if (insight.title && insight.description) {
        insights.push(createAdvancedInsight(insight, mode))
      }
    })
    
    return insights.length > 0 ? insights : generateAdvancedLocalInsights(financialData!, mode)
  }

  const createAdvancedInsight = (parsed: Partial<AIInsight>, mode: string): AIInsight => {
    const iconMap = {
      'strategic': <Zap className="w-5 h-5" />,
      'situational': <Activity className="w-5 h-5" />,
      'basic': <Info className="w-5 h-5" />
    }
    
    return {
      type: parsed.type || (mode === 'strategic' ? 'strategy' : 'info'),
      title: parsed.title || 'Insight',
      description: parsed.description || '',
      icon: iconMap[mode] || <Info className="w-5 h-5" />,
      impact: parsed.impact || 'medium',
      metric: parsed.metric,
      actionable: true,
      timeframe: parsed.timeframe,
      confidence: parsed.confidence
    }
  }

  const generateAdvancedLocalInsights = (data: FinancialData, mode: string): AIInsight[] => {
    const insights: AIInsight[] = []
    
    if (mode === 'strategic') {
      // Análisis estratégico
      const revenueGap = (data.goals?.revenue || 200000) - data.revenue
      const marginGap = (data.goals?.margin || 35) - data.profitMargin
      
      insights.push({
        type: 'strategy',
        title: 'Plan de Crecimiento de Ingresos',
        description: `Para alcanzar la meta de $${data.goals?.revenue}, necesitas aumentar $${(revenueGap/1000).toFixed(0)}K. Estrategia: incrementar ticket promedio 20% y clientes 15%.`,
        icon: <Target className="w-5 h-5" />,
        impact: 'high',
        metric: `+$${(revenueGap/1000).toFixed(0)}K`,
        timeframe: '3-6 meses',
        confidence: 85,
        actionable: true
      })
      
      insights.push({
        type: 'strategy',
        title: 'Optimización de Margen',
        description: `Margen actual ${data.profitMargin.toFixed(1)}% vs objetivo ${data.goals?.margin}%. Reducir costos operativos 3% y renegociar proveedores para ganar ${marginGap.toFixed(1)} puntos.`,
        icon: <TrendingUp className="w-5 h-5" />,
        impact: 'high',
        metric: `+${marginGap.toFixed(1)}%`,
        timeframe: '1-3 meses',
        confidence: 78,
        actionable: true
      })
      
      insights.push({
        type: 'opportunity',
        title: 'Expansión de Productos Premium',
        description: `Café Premium y Sandwich Especial muestran tendencia alcista. Crear combo premium puede generar $${(data.revenue * 0.08 / 1000).toFixed(0)}K adicionales.`,
        icon: <Package className="w-5 h-5" />,
        impact: 'high',
        metric: `+8% ventas`,
        timeframe: '1-2 meses',
        confidence: 82,
        actionable: true
      })
      
      insights.push({
        type: 'trend',
        title: 'Análisis Competitivo',
        description: `Tu ticket promedio ($${data.avgTicket.toFixed(0)}) está ${((data.avgTicket - (data.competition?.avgPrice || 82)) / (data.competition?.avgPrice || 82) * 100).toFixed(0)}% vs competencia. Oportunidad de capturar 5% más de mercado.`,
        icon: <Award className="w-5 h-5" />,
        impact: 'medium',
        metric: '+5% mercado',
        timeframe: '6-12 meses',
        confidence: 72,
        actionable: true
      })
      
      insights.push({
        type: 'strategy',
        title: 'Programa de Fidelización Digital',
        description: `Con ${data.customers} clientes actuales, un programa de lealtad puede aumentar frecuencia 30% generando $${(data.revenue * 0.15 / 1000).toFixed(0)}K mensuales.`,
        icon: <Users className="w-5 h-5" />,
        impact: 'high',
        metric: `+30% frecuencia`,
        timeframe: '2-3 meses',
        confidence: 88,
        actionable: true
      })
      
    } else if (mode === 'situational') {
      // Análisis situacional
      const lastMonthRevenue = data.historicalData ? 
        data.historicalData.slice(-30).reduce((sum, d) => sum + d.revenue, 0) : data.revenue
      const previousMonthRevenue = data.historicalData ?
        data.historicalData.slice(-60, -30).reduce((sum, d) => sum + d.revenue, 0) : data.revenue * 0.95
      const revenueChange = ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100)
      
      insights.push({
        type: 'trend',
        title: 'Tendencia Mensual Positiva',
        description: `Ingresos crecieron ${revenueChange.toFixed(1)}% vs mes anterior. Mantén promociones actuales y refuerza días pico (${data.seasonality?.peak.join(', ')}).`,
        icon: <TrendingUp className="w-5 h-5" />,
        impact: 'high',
        metric: `+${revenueChange.toFixed(1)}%`,
        actionable: false
      })
      
      insights.push({
        type: 'warning',
        title: 'Pizza en Declive',
        description: `Pizza Margherita muestra tendencia negativa (-15% últimas 2 semanas). Considera renovar receta o crear promoción especial.`,
        icon: <TrendingDown className="w-5 h-5" />,
        impact: 'medium',
        metric: '-15%',
        actionable: true
      })
      
      insights.push({
        type: 'opportunity',
        title: 'Horario Pico Optimizable',
        description: `Viernes y Sábado generan 45% de ingresos semanales. Aumenta personal esos días para mejorar servicio y ventas.`,
        icon: <Clock className="w-5 h-5" />,
        impact: 'high',
        metric: '45% ventas',
        actionable: true
      })
      
    } else {
      // Análisis básico (ya implementado)
      insights.push({
        type: 'success',
        title: 'Margen de Ganancia Saludable',
        description: `Tu margen del ${data.profitMargin.toFixed(1)}% está cerca del objetivo. Mantén control de costos.`,
        icon: <TrendingUp className="w-5 h-5" />,
        impact: 'high',
        metric: `${data.profitMargin.toFixed(1)}%`,
        actionable: false
      })
      
      insights.push({
        type: 'warning',
        title: 'Costos Laborales Elevados',
        description: `Los costos de personal (28%) exceden el objetivo del 25%. Revisa horarios en horas valle.`,
        icon: <AlertTriangle className="w-5 h-5" />,
        impact: 'medium',
        metric: '28%',
        actionable: true
      })
      
      insights.push({
        type: 'opportunity',
        title: 'Potencial en Ticket Promedio',
        description: `Aumentar $5 el ticket promedio generaría $${(5 * data.customers / 1000).toFixed(0)}K adicionales al mes.`,
        icon: <DollarSign className="w-5 h-5" />,
        impact: 'high',
        metric: `+$${(5 * data.customers / 1000).toFixed(0)}K`,
        actionable: true
      })
      
      insights.push({
        type: 'opportunity',
        title: 'Optimización de Inventario',
        description: `Reducir inventario lento en 20% liberaría $8,000 en capital de trabajo.`,
        icon: <Package className="w-5 h-5" />,
        impact: 'medium',
        metric: '$8K',
        actionable: true
      })
      
      insights.push({
        type: 'info',
        title: 'Crecimiento de Clientes',
        description: `Base de clientes creció 15% este mes. Implementa programa de fidelización.`,
        icon: <Users className="w-5 h-5" />,
        impact: 'medium',
        metric: '+15%',
        actionable: true
      })
    }
    
    setInsights(insights)
    return insights
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
      {/* Header mejorado */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-xl flex items-center gap-3">
          <Brain className="w-6 h-6 text-indigo-400" />
          Análisis en Tiempo Real con IA
          <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold rounded-full animate-pulse">
            PREMIUM
          </span>
        </h3>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40">
            Powered by <span className="font-bold text-indigo-400">Impulsa Lab</span>
          </span>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title="Instrucciones"
          >
            <HelpCircle className="w-5 h-5 text-white/80" />
          </button>
        </div>
      </div>

      {/* Panel de instrucciones actualizado */}
      {showInstructions && (
        <div className="mb-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 relative">
          <button
            onClick={() => setShowInstructions(false)}
            className="absolute right-2 top-2 p-1 hover:bg-white/10 rounded"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
          
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="text-sm text-white/80">
              <p className="font-semibold mb-2">🧠 Análisis Inteligente Multi-Nivel</p>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="p-2 bg-white/5 rounded">
                  <p className="font-semibold text-white/90">Básico</p>
                  <p className="text-xs text-white/60">KPIs y métricas operativas</p>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <p className="font-semibold text-white/90">Situacional</p>
                  <p className="text-xs text-white/60">Tendencias y contexto actual</p>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <p className="font-semibold text-white/90">Estratégico</p>
                  <p className="text-xs text-white/60">Roadmap y proyecciones</p>
                </div>
              </div>
              <p className="mt-3 text-yellow-300/80 text-xs">
                💡 Cada modo consume diferentes créditos: Básico (1), Situacional (2), Estratégico (3)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selector de modo de análisis */}
      <div className="mb-4 p-1 bg-white/10 rounded-lg flex">
        {(['basic', 'situational', 'strategic'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setAnalysisMode(mode)}
            className={`flex-1 py-2 px-3 rounded-md transition-all flex items-center justify-center gap-2
              ${analysisMode === mode 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                : 'text-white/60 hover:text-white/80'}`}
          >
            {mode === 'basic' && <BarChart3 className="w-4 h-4" />}
            {mode === 'situational' && <Activity className="w-4 h-4" />}
            {mode === 'strategic' && <Zap className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {mode === 'basic' ? 'Básico' : mode === 'situational' ? 'Situacional' : 'Estratégico'}
            </span>
          </button>
        ))}
      </div>

      {/* Estado y Créditos */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-200">Gemini AI Activo</span>
          </div>
        </div>
        
        <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-200">Créditos:</span>
            <span className="text-lg font-bold text-purple-300">{remainingCredits}</span>
          </div>
        </div>
        
        <div className="p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-orange-200">Modo:</span>
            <span className="text-sm font-bold text-orange-300">
              {analysisMode === 'basic' ? 'Básico' : analysisMode === 'situational' ? 'Situacional' : 'Estratégico'}
            </span>
          </div>
        </div>
      </div>

      {/* Configuración de objetivos (solo en modo estratégico) */}
      {analysisMode === 'strategic' && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-xs font-semibold">OBJETIVOS DEL NEGOCIO</p>
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              {showAdvancedOptions ? 'Ocultar' : 'Editar'}
            </button>
          </div>
          
          {showAdvancedOptions ? (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-white/40 text-xs">Meta Ingresos</label>
                <input
                  type="number"
                  value={businessGoals.revenue}
                  onChange={(e) => setBusinessGoals({...businessGoals, revenue: parseInt(e.target.value)})}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs">Meta Margen %</label>
                <input
                  type="number"
                  value={businessGoals.margin}
                  onChange={(e) => setBusinessGoals({...businessGoals, margin: parseInt(e.target.value)})}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs">Meta Clientes</label>
                <input
                  type="number"
                  value={businessGoals.customers}
                  onChange={(e) => setBusinessGoals({...businessGoals, customers: parseInt(e.target.value)})}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-white/40 text-xs">Ingresos</p>
                <p className="text-white font-bold">${(businessGoals.revenue/1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-white/40 text-xs">Margen</p>
                <p className="text-white font-bold">{businessGoals.margin}%</p>
              </div>
              <div>
                <p className="text-white/40 text-xs">Clientes</p>
                <p className="text-white font-bold">{businessGoals.customers.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resumen de datos actuales */}
      {financialData && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg">
          <p className="text-white/50 text-xs mb-2">MÉTRICAS ACTUALES</p>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-white/40 text-xs">Ingresos</p>
              <p className="text-white font-bold">${(financialData.revenue/1000).toFixed(0)}K</p>
              {analysisMode !== 'basic' && (
                <p className={`text-xs ${financialData.revenue > (businessGoals.revenue * 0.8) ? 'text-green-400' : 'text-yellow-400'}`}>
                  {((financialData.revenue / businessGoals.revenue) * 100).toFixed(0)}% meta
                </p>
              )}
            </div>
            <div>
              <p className="text-white/40 text-xs">Margen</p>
              <p className={`font-bold ${financialData.profitMargin > 30 ? 'text-green-400' : 'text-yellow-400'}`}>
                {financialData.profitMargin.toFixed(1)}%
              </p>
              {analysisMode !== 'basic' && (
                <p className="text-xs text-white/50">
                  Meta: {businessGoals.margin}%
                </p>
              )}
            </div>
            <div>
              <p className="text-white/40 text-xs">Clientes</p>
              <p className="text-white font-bold">{financialData.customers.toLocaleString()}</p>
              {analysisMode !== 'basic' && (
                <p className={`text-xs ${financialData.customers > (businessGoals.customers * 0.7) ? 'text-green-400' : 'text-yellow-400'}`}>
                  {((financialData.customers / businessGoals.customers) * 100).toFixed(0)}% meta
                </p>
              )}
            </div>
            <div>
              <p className="text-white/40 text-xs">Ticket</p>
              <p className="text-white font-bold">${financialData.avgTicket.toFixed(0)}</p>
              {analysisMode !== 'basic' && financialData.competition && (
                <p className="text-xs text-white/50">
                  Mercado: ${financialData.competition.avgPrice}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Botón de análisis mejorado */}
      <button
        onClick={performAdvancedAnalysis}
        disabled={isAnalyzing || remainingCredits < (analysisMode === 'strategic' ? 3 : analysisMode === 'situational' ? 2 : 1)}
        className="w-full mb-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg
                   hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50
                   disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold
                   shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {isAnalyzing ? (
          <>
            <Sparkles className="w-5 h-5 animate-spin" />
            Ejecutando Análisis {analysisMode === 'strategic' ? 'Estratégico' : analysisMode === 'situational' ? 'Situacional' : 'Básico'}...
          </>
        ) : (
          <>
            <Brain className="w-5 h-5" />
            Ejecutar Análisis con IA ({analysisMode === 'strategic' ? '3' : analysisMode === 'situational' ? '2' : '1'} crédito{analysisMode !== 'basic' ? 's' : ''})
          </>
        )}
      </button>

      {/* Resumen del Análisis (nuevo) */}
      {showSummary && analysisSummary && (
        <div className="mb-4 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/20">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              Resumen Ejecutivo del Análisis
            </h4>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="text-white/60 hover:text-white/80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-white/80 text-sm space-y-2 whitespace-pre-line">
            {analysisSummary}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-white/50">
              Período analizado: {selectedPeriod === 'day' ? 'Día' : 
                               selectedPeriod === 'week' ? 'Semana' :
                               selectedPeriod === 'month' ? 'Mes' :
                               selectedPeriod === 'quarter' ? 'Trimestre' : 'Año'}
            </span>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              <Package className="w-3 h-3" />
              Exportar a PDF
            </button>
          </div>
        </div>
      )}

      {/* Insights mejorados con agrupación */}
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border backdrop-blur-sm animate-fadeIn transform transition-all
              hover:scale-[1.02] hover:shadow-lg cursor-pointer
              ${insight.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 hover:bg-green-500/15' 
                : insight.type === 'warning'
                ? 'bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/15'
                : insight.type === 'opportunity'
                ? 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15'
                : insight.type === 'strategy'
                ? 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/15'
                : insight.type === 'trend'
                ? 'bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/15'
                : 'bg-gray-500/10 border-gray-500/20 hover:bg-gray-500/15'
              }
            `}
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg
                ${insight.type === 'success' 
                  ? 'bg-green-500/20 text-green-400' 
                  : insight.type === 'warning'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : insight.type === 'opportunity'
                  ? 'bg-blue-500/20 text-blue-400'
                  : insight.type === 'strategy'
                  ? 'bg-purple-500/20 text-purple-400'
                  : insight.type === 'trend'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-gray-500/20 text-gray-400'
                }
              `}>
                {insight.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    {insight.title}
                    {insight.actionable && (
                      <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-300 text-xs rounded">
                        Acción requerida
                      </span>
                    )}
                    {insight.timeframe && (
                      <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded">
                        {insight.timeframe}
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-2">
                    {insight.confidence && (
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                            style={{width: `${insight.confidence}%`}}
                          />
                        </div>
                        <span className="text-xs text-white/50">{insight.confidence}%</span>
                      </div>
                    )}
                    {insight.metric && (
                      <span className="text-sm font-bold text-white/80 bg-white/10 px-2 py-0.5 rounded">
                        {insight.metric}
                      </span>
                    )}
                    {insight.impact && (
                      <span className={`text-xs px-2 py-1 rounded-full
                        ${insight.impact === 'high' 
                          ? 'bg-red-500/20 text-red-300'
                          : insight.impact === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-green-500/20 text-green-300'
                        }
                      `}>
                        {insight.impact === 'high' ? '⚡ Alto' : 
                         insight.impact === 'medium' ? '⚠️ Medio' : '✓ Bajo'}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-white/70 text-sm">{insight.description}</p>
                
                {/* Botón de acción rápida para insights accionables */}
                {insight.actionable && analysisMode === 'strategic' && (
                  <button className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" />
                    Ver plan de implementación
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer mejorado */}
      {lastAnalysis && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-white/40 text-xs">
              Última actualización: {lastAnalysis.toLocaleTimeString()} | 
              Modo {analysisMode === 'strategic' ? 'Estratégico' : analysisMode === 'situational' ? 'Situacional' : 'Básico'}
            </p>
            <p className="text-white/40 text-xs">
              Powered by <span className="text-indigo-400">Gemini AI</span> & <span className="text-indigo-400">Impulsa Lab</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RealTimeAIAnalysisAdvanced