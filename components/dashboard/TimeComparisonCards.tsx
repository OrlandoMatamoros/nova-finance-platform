'use client'

import React from 'react'
import { ArrowUp, ArrowDown, Minus, TrendingUp, DollarSign, Users, ShoppingBag } from 'lucide-react'

interface MetricData {
  current: number
  previous: number
  label: string
  format: 'currency' | 'number' | 'percentage'
  icon: React.ReactNode
  gradient: string
}

interface TimeComparisonCardsProps {
  currentPeriod: string
  previousPeriod: string
  data: {
    sales: { current: number; previous: number }
    profit: { current: number; previous: number }
    covers: { current: number; previous: number }
    avgTicket: { current: number; previous: number }
  }
}

const TimeComparisonCards: React.FC<TimeComparisonCardsProps> = ({
  currentPeriod,
  previousPeriod,
  data
}) => {
  const formatValue = (value: number, format: string) => {
    switch(format) {
      case 'currency':
        return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
      case 'percentage':
        return `${value.toFixed(1)}%`
      default:
        return value.toLocaleString('en-US')
    }
  }

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return { percentage: 0, absolute: current }
    const percentage = ((current - previous) / previous) * 100
    const absolute = current - previous
    return { percentage, absolute }
  }

  const metrics: MetricData[] = [
    {
      current: data.sales.current,
      previous: data.sales.previous,
      label: 'Ventas Totales',
      format: 'currency',
      icon: <DollarSign className="w-5 h-5" />,
      gradient: 'from-blue-600 to-blue-800'
    },
    {
      current: data.profit.current,
      previous: data.profit.previous,
      label: 'Utilidad Neta',
      format: 'currency',
      icon: <TrendingUp className="w-5 h-5" />,
      gradient: 'from-purple-600 to-purple-800'
    },
    {
      current: data.covers.current,
      previous: data.covers.previous,
      label: 'Clientes Atendidos',
      format: 'number',
      icon: <Users className="w-5 h-5" />,
      gradient: 'from-indigo-600 to-indigo-800'
    },
    {
      current: data.avgTicket.current,
      previous: data.avgTicket.previous,
      label: 'Ticket Promedio',
      format: 'currency',
      icon: <ShoppingBag className="w-5 h-5" />,
      gradient: 'from-violet-600 to-violet-800'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const change = calculateChange(metric.current, metric.previous)
        const isPositive = change.percentage > 0
        const isNeutral = change.percentage === 0
        
        return (
          <div
            key={index}
            className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                     rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all
                     hover:shadow-2xl hover:shadow-purple-500/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${metric.gradient}`}>
                <div className="text-white">
                  {metric.icon}
                </div>
              </div>
              <span className={`
                flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold
                ${isPositive 
                  ? 'bg-green-500/20 text-green-400' 
                  : isNeutral 
                  ? 'bg-gray-500/20 text-gray-400'
                  : 'bg-red-500/20 text-red-400'
                }
              `}>
                {isPositive ? <ArrowUp className="w-3 h-3" /> : 
                 isNeutral ? <Minus className="w-3 h-3" /> : 
                 <ArrowDown className="w-3 h-3" />}
                {Math.abs(change.percentage).toFixed(1)}%
              </span>
            </div>
            
            {/* Current Value */}
            <div className="mb-4">
              <p className="text-white/50 text-xs mb-1">{currentPeriod}</p>
              <p className="text-3xl font-bold text-white">
                {formatValue(metric.current, metric.format)}
              </p>
              <p className="text-white/70 text-sm mt-1">{metric.label}</p>
            </div>
            
            {/* Comparison */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">{previousPeriod}</span>
                <span className="text-white/80 font-medium">
                  {formatValue(metric.previous, metric.format)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-white/50">Variación</span>
                <span className={`font-bold ${
                  isPositive ? 'text-green-400' : 
                  isNeutral ? 'text-gray-400' : 
                  'text-red-400'
                }`}>
                  {metric.format === 'currency' 
                    ? `${isPositive ? '+' : ''}${formatValue(change.absolute, 'currency')}`
                    : `${isPositive ? '+' : ''}${change.absolute.toLocaleString()}`
                  }
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TimeComparisonCards
