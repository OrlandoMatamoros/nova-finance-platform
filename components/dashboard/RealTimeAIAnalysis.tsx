'use client'

import React, { useState, useEffect } from 'react'
import { Brain, Sparkles, AlertTriangle, TrendingUp, Target, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react'
import { RestaurantDataGenerator } from '@/lib/data/restaurantDataGenerator'

interface AIInsight {
  type: 'success' | 'warning' | 'critical' | 'opportunity'
  title: string
  message: string
  impact: string
  action: string
  confidence: number
}

interface AIPrediction {
  metric: string
  value: number
  trend: 'up' | 'down' | 'stable'
  confidence: number
  timeframe: string
}

interface RealTimeAIAnalysisProps {
  data: any
  period: string
}

const RealTimeAIAnalysis: React.FC<RealTimeAIAnalysisProps> = ({ data, period }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [predictions, setPredictions] = useState<AIPrediction[]>([])
  const [summary, setSummary] = useState('')

  useEffect(() => {
    analyzeData()
  }, [data, period])

  const analyzeData = async () => {
    setIsAnalyzing(true)
    
    // Simular procesamiento de IA
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Análisis basado en los datos reales
    const foodCostPercentage = data?.averages?.foodCostPercentage || 30
    const laborCostPercentage = data?.averages?.laborCostPercentage || 28
    const dailySales = data?.averages?.dailySales || 4500
    const netProfit = data?.totals?.netProfit || 0
    const salesTrend = data?.totals?.sales > (data?.comparison?.sales || 0) ? 'up' : 'down'
    
    // Generar insights dinámicos basados en los datos
    const newInsights: AIInsight[] = []
    
    // Análisis de costos de alimentos
    if (foodCostPercentage > 32) {
      newInsights.push({
        type: 'critical',
        title: 'Costos de Alimentos Críticos',
        message: `Tus costos de alimentos están en ${foodCostPercentage.toFixed(1)}%, excediendo el objetivo del 30%`,
        impact: `Pérdida potencial de $${((foodCostPercentage - 30) * dailySales * 30 / 100).toFixed(0)} mensual`,
        action: 'Revisar porciones, negociar con proveedores, auditar desperdicios',
        confidence: 92
      })
    } else if (foodCostPercentage > 30) {
      newInsights.push({
        type: 'warning',
        title: 'Costos de Alimentos Elevados',
        message: `Costos en ${foodCostPercentage.toFixed(1)}%, ligeramente sobre el objetivo`,
        impact: `Oportunidad de ahorro de $${((foodCostPercentage - 30) * dailySales * 30 / 100).toFixed(0)}`,
        action: 'Optimizar menú y revisar proveedores alternativos',
        confidence: 85
      })
    } else {
      newInsights.push({
        type: 'success',
        title: 'Costos de Alimentos Optimizados',
        message: `Excelente control en ${foodCostPercentage.toFixed(1)}%`,
        impact: `Ahorro de $${((30 - foodCostPercentage) * dailySales * 30 / 100).toFixed(0)} vs objetivo`,
        action: 'Mantener controles actuales y documentar mejores prácticas',
        confidence: 88
      })
    }
    
    // Análisis de tendencias de ventas
    if (salesTrend === 'up') {
      const growthRate = ((data?.totals?.sales - (data?.comparison?.sales || 0)) / (data?.comparison?.sales || 1)) * 100
      newInsights.push({
        type: 'success',
        title: 'Crecimiento en Ventas',
        message: `Ventas aumentaron ${growthRate.toFixed(1)}% vs período anterior`,
        impact: `Ingreso adicional de $${(data?.totals?.sales - (data?.comparison?.sales || 0)).toFixed(0)}`,
        action: 'Analizar drivers de crecimiento para replicar éxito',
        confidence: 90
      })
    }
    
    // Análisis de días lentos
    if (data?.breakdown?.dailyPattern) {
      newInsights.push({
        type: 'opportunity',
        title: 'Oportunidad en Días Lentos',
        message: 'Martes y miércoles con 40% menos ventas que el promedio',
        impact: 'Potencial de $12,000 mensuales adicionales',
        action: 'Lanzar promoción "Martes de Tapas" y "Miércoles de Vinos"',
        confidence: 78
      })
    }
    
    // Análisis de productividad laboral
    const laborProductivity = dailySales / (laborCostPercentage * dailySales / 100)
    if (laborProductivity < 3.5) {
      newInsights.push({
        type: 'warning',
        title: 'Productividad Laboral Baja',
        message: `Ratio de productividad en ${laborProductivity.toFixed(1)}x, bajo el estándar de 3.5x`,
        impact: 'Sobrecosto laboral de aproximadamente 15%',
        action: 'Revisar scheduling, cross-training del personal',
        confidence: 82
      })
    }
    
    setInsights(newInsights)
    
    // Generar predicciones
    const newPredictions: AIPrediction[] = [
      {
        metric: 'Ventas Próximo Mes',
        value: dailySales * 30 * 1.05,
        trend: 'up',
        confidence: 78,
        timeframe: '30 días'
      },
      {
        metric: 'Flujo de Caja',
        value: netProfit * 0.85,
        trend: 'stable',
        confidence: 82,
        timeframe: '30 días'
      },
      {
        metric: 'Costo Laboral',
        value: laborCostPercentage - 0.5,
        trend: 'down',
        confidence: 71,
        timeframe: '30 días'
      },
      {
        metric: 'Ticket Promedio',
        value: (data?.averages?.ticketSize || 35) * 1.03,
        trend: 'up',
        confidence: 75,
        timeframe: '15 días'
      }
    ]
    
    setPredictions(newPredictions)
    
    // Generar resumen ejecutivo
    const profitMargin = (netProfit / (data?.totals?.sales || 1)) * 100
    setSummary(
      `Durante ${period}, tu restaurante ${salesTrend === 'up' ? 'creció' : 'decreció'} en ventas con un margen neto del ${profitMargin.toFixed(1)}%. ` +
      `Los principales drivers fueron ${salesTrend === 'up' ? 'el incremento en ticket promedio y mayor tráfico de fin de semana' : 'la reducción en días lentos y costos elevados'}. ` +
      `Nova identificó ${newInsights.filter(i => i.type === 'opportunity').length} oportunidades de mejora con un potencial impacto de ` +
      `$${newInsights.filter(i => i.type === 'opportunity').reduce((sum, i) => sum + parseInt(i.impact.match(/\d+/)?.[0] || '0'), 0).toLocaleString()}.`
    )
    
    setIsAnalyzing(false)
  }

  const getInsightIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-5 h-5" />
      case 'warning': return <AlertTriangle className="w-5 h-5" />
      case 'critical': return <AlertCircle className="w-5 h-5" />
      case 'opportunity': return <Lightbulb className="w-5 h-5" />
      default: return <Brain className="w-5 h-5" />
    }
  }

  const getInsightColor = (type: string) => {
    switch(type) {
      case 'success': return 'from-green-600 to-green-800'
      case 'warning': return 'from-yellow-600 to-yellow-800'
      case 'critical': return 'from-red-600 to-red-800'
      case 'opportunity': return 'from-blue-600 to-blue-800'
      default: return 'from-purple-600 to-purple-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      default: return '➡️'
    }
  }

  if (isAnalyzing) {
    return (
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                      rounded-2xl p-8 border border-white/10">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <Brain className="w-12 h-12 text-purple-400 animate-pulse" />
            <div className="absolute -inset-4 bg-purple-500/20 rounded-full animate-ping" />
          </div>
          <p className="text-white/80 text-lg font-medium">Nova está analizando tus datos...</p>
          <p className="text-white/60 text-sm">Procesando patrones y generando insights personalizados</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con resumen ejecutivo */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                      rounded-2xl p-6 border border-white/10">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
              Análisis Inteligente de Nova AI
              <span className="px-2 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300 font-normal">
                Actualizado hace 2 min
              </span>
            </h3>
            <p className="text-white/80 leading-relaxed text-base">
              {summary}
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Insights */}
      <div>
        <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Insights Accionables
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur rounded-xl p-5 border border-white/10 
                       hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${getInsightColor(insight.type)} 
                              shadow-lg group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {getInsightIcon(insight.type)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-white font-semibold text-sm">
                      {insight.title}
                    </h5>
                    <span className="text-white/40 text-xs">
                      {insight.confidence}% certeza
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mb-2">
                    {insight.message}
                  </p>
                  <p className="text-yellow-400/80 text-xs mb-2">
                    💰 {insight.impact}
                  </p>
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-purple-400 text-xs font-medium">
                      ✨ Acción recomendada:
                    </p>
                    <p className="text-white/80 text-xs mt-1">
                      {insight.action}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predicciones */}
      <div>
        <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          Predicciones Inteligentes
        </h4>
        <div className="bg-white/5 backdrop-blur rounded-xl p-5 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.map((pred, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTrendIcon(pred.trend)}</span>
                  <div>
                    <p className="text-white/90 text-sm font-medium">{pred.metric}</p>
                    <p className="text-white/50 text-xs">{pred.timeframe}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">
                    {pred.metric.includes('Costo') || pred.metric.includes('%') 
                      ? `${pred.value.toFixed(1)}%`
                      : `$${pred.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                    }
                  </p>
                  <p className="text-white/40 text-xs">
                    {pred.confidence}% confianza
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RealTimeAIAnalysis
