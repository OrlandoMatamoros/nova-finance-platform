'use client'

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface RevenueChartProps {
  period: string
}

const RevenueChart: React.FC<RevenueChartProps> = ({ period }) => {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const getData = () => {
    switch(period) {
      case 'day':
        return [
          { name: '6am', value: 450 },
          { name: '9am', value: 2100 },
          { name: '12pm', value: 4800 },
          { name: '3pm', value: 3200 },
          { name: '6pm', value: 5600 },
          { name: '9pm', value: 7200 },
          { name: '12am', value: 1800 }
        ]
      case 'week':
        return [
          { name: 'Lun', value: 4200 },
          { name: 'Mar', value: 3800 },
          { name: 'Mié', value: 5100 },
          { name: 'Jue', value: 4700 },
          { name: 'Vie', value: 6200 },
          { name: 'Sáb', value: 7800 },
          { name: 'Dom', value: 6500 }
        ]
      case 'month':
        return [
          { name: 'Sem 1', value: 28500 },
          { name: 'Sem 2', value: 31200 },
          { name: 'Sem 3', value: 29800 },
          { name: 'Sem 4', value: 35700 }
        ]
      default:
        return []
    }
  }

  const data = getData()
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Solo renderizar después del montaje
  if (!mounted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Tendencia de Ingresos
        </h3>
        <div className="h-[300px] animate-pulse bg-gray-100 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Tendencia de Ingresos
        </h3>
        <div className="text-right">
          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </p>
          <p className="text-xs text-gray-500">Total del período</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
            formatter={(value: any) => [`$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, 'Ventas']}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueChart
