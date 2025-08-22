'use client'

import React from 'react'

interface Period {
  value: string
  label: string
  emoji: string
}

interface PeriodSelectorProps {
  selectedPeriod: string
  setSelectedPeriod: (period: string) => void
}

export default function PeriodSelector({ selectedPeriod, setSelectedPeriod }: PeriodSelectorProps) {
  const periods: Period[] = [
    { value: 'day', label: 'Día', emoji: '☀️' },
    { value: 'week', label: 'Semana', emoji: '📅' },
    { value: 'month', label: 'Mes', emoji: '🗓️' },
    { value: 'quarter', label: 'Trimestre', emoji: '📊' },
    { value: 'year', label: 'Año', emoji: '🎯' }
  ]

  return (
    <div className="flex justify-center">
      <div className="flex flex-wrap gap-2 bg-white/80 backdrop-blur-lg rounded-2xl p-2 shadow-xl">
        {periods.map(period => (
          <button
            key={period.value}
            onClick={() => setSelectedPeriod(period.value)}
            className={`
              px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300
              ${selectedPeriod === period.value 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' 
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <span className="mr-1">{period.emoji}</span>
            {period.label}
          </button>
        ))}
      </div>
    </div>
  )
}
