'use client'

import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts'

interface ExpenseBreakdownProps {
  period: string
}

const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({ period }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const data = [
    { name: 'Alimentos', value: 35, amount: 35000, color: '#3b82f6' },
    { name: 'Personal', value: 30, amount: 30000, color: '#8b5cf6' },
    { name: 'Renta', value: 20, amount: 20000, color: '#ec4899' },
    { name: 'Utilities', value: 10, amount: 10000, color: '#f59e0b' },
    { name: 'Marketing', value: 5, amount: 5000, color: '#10b981' }
  ]

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props

    return (
      <g>
        <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={fill} className="text-2xl font-bold">
          {value}%
        </text>
        <text x={cx} y={cy} dy={15} textAnchor="middle" fill="#666" className="text-sm">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    )
  }

  // Solo renderizar el contenido completo después del montaje
  if (!mounted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Distribución de Gastos
        </h3>
        <div className="h-[400px] animate-pulse bg-gray-100 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Distribución de Gastos
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => `${value}%`} />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onMouseEnter={() => setActiveIndex(index)}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full shadow-sm" 
                style={{ backgroundColor: item.color }} 
              />
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{item.value}%</span>
              <span className="text-xs text-gray-500">
                ${item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExpenseBreakdown
