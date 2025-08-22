'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, Package, Calculator, Target, Sparkles } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatters'

interface KPICardProps {
  title: string
  value: string | number
  change: number
  icon: React.ReactElement
  gradient: string
  target?: number
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, gradient, target }) => {
  const [mounted, setMounted] = useState(false)
  const isPositive = change >= 0
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className={`absolute inset-0 opacity-5 ${gradient}`} />
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${gradient} shadow-lg`}>
            <div className="w-6 h-6 text-white">
              {icon}
            </div>
          </div>
          
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 text-white ${
            isPositive 
              ? 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-green-500/25' 
              : 'bg-gradient-to-r from-red-400 to-rose-500 shadow-lg shadow-red-500/25'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </span>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {value}
            </p>
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
        </div>

        {target && mounted && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Meta</span>
              <span className="font-bold">{formatCurrency(target)}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                style={{ width: `${Math.min((Number(value.toString().replace(/[^0-9]/g, '')) / target) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface KPICardsProps {
  period: string
}

const KPICards: React.FC<KPICardsProps> = ({ period }) => {
  const kpis = [
    {
      title: 'Ventas del Período',
      value: '$105,280',
      change: 12.5,
      icon: <DollarSign className="w-6 h-6" />,
      gradient: 'bg-gradient-to-br from-blue-500 to-purple-600',
      target: 120000
    },
    {
      title: 'Costos (COGS)',
      value: '$31,500',
      change: -5.2,
      icon: <Package className="w-6 h-6" />,
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
      target: undefined
    },
    {
      title: 'Nómina',
      value: '$36,750',
      change: -3.8,
      icon: <Users className="w-6 h-6" />,
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      target: undefined
    },
    {
      title: 'Gastos Operativos',
      value: '$21,000',
      change: -4.5,
      icon: <Calculator className="w-6 h-6" />,
      gradient: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      target: undefined
    },
    {
      title: 'Utilidad Neta',
      value: '$16,030',
      change: 26.2,
      icon: <Target className="w-6 h-6" />,
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-500',
      target: 20000
    },
    {
      title: 'Rentabilidad %',
      value: '15.2%',
      change: 13.5,
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: 'bg-gradient-to-br from-indigo-500 to-blue-600',
      target: 18
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpis.map((kpi, index) => (
        <KPICard 
          key={index}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          icon={kpi.icon}
          gradient={kpi.gradient}
          target={kpi.target}
        />
      ))}
    </div>
  )
}

export default KPICards
