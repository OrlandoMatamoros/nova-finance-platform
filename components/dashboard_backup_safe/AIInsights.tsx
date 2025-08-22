'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, AlertTriangle, Lightbulb, CheckCircle, Sparkles } from 'lucide-react'

interface Insight {
  type: 'success' | 'warning' | 'tip' | 'info'
  title: string
  description: string
  icon: React.ReactElement
}

const AIInsights: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<Insight[]>([])

  useEffect(() => {
    // Simular carga de insights
    setTimeout(() => {
      setInsights([
        {
          type: 'success',
          title: 'Excelente desempeño',
          description: 'Las ventas aumentaron 12.5% comparado con el período anterior. Mantén esta tendencia.',
          icon: <TrendingUp className="w-5 h-5" />
        },
        {
          type: 'warning',
          title: 'Costos de alimentos elevados',
          description: 'El 35% en costos de alimentos está 5% por encima del objetivo. Revisa proveedores.',
          icon: <AlertTriangle className="w-5 h-5" />
        },
        {
          type: 'tip',
          title: 'Oportunidad de mejora',
          description: 'Los martes tienen 30% menos ventas. Considera una promoción especial.',
          icon: <Lightbulb className="w-5 h-5" />
        },
        {
          type: 'info',
          title: 'Meta alcanzable',
          description: 'Estás a solo $3,970 de alcanzar tu meta mensual. ¡Puedes lograrlo!',
          icon: <CheckCircle className="w-5 h-5" />
        }
      ])
      setLoading(false)
    }, 1500)
  }, [])

  const getInsightStyles = (type: string) => {
    switch(type) {
      case 'success':
        return 'border-green-500 bg-green-50'
      case 'warning':
        return 'border-yellow-500 bg-yellow-50'
      case 'tip':
        return 'border-blue-500 bg-blue-50'
      case 'info':
        return 'border-purple-500 bg-purple-50'
      default:
        return 'border-gray-500 bg-gray-50'
    }
  }

  const getIconStyles = (type: string) => {
    switch(type) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'tip':
        return 'text-blue-600 bg-blue-100'
      case 'info':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Insights Inteligentes de Nova AI
        </h3>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          Ver análisis completo →
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`border-l-4 rounded-lg p-4 transition-all hover:shadow-md ${getInsightStyles(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getIconStyles(insight.type)}`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AIInsights
