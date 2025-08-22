'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

export interface TimeRange {
  start: Date
  end: Date
  label: string
  granularity: 'day' | 'week' | 'month' | 'quarter' | 'year'
  comparison?: {
    start: Date
    end: Date
    label: string
  }
}

interface AdvancedTimeSelectorProps {
  onRangeChange: (range: TimeRange) => void
}

const AdvancedTimeSelector: React.FC<AdvancedTimeSelectorProps> = ({ onRangeChange }) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange | null>(null)
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  // Calcular rangos predefinidos
  const calculateRange = (type: string): TimeRange => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    switch(type) {
      case 'today':
        return {
          start: new Date(today.setHours(0, 0, 0, 0)),
          end: new Date(today.setHours(23, 59, 59, 999)),
          label: 'Hoy',
          granularity: 'day',
          comparison: {
            start: new Date(yesterday.setHours(0, 0, 0, 0)),
            end: new Date(yesterday.setHours(23, 59, 59, 999)),
            label: 'Ayer'
          }
        }
      
      case 'yesterday':
        const dayBefore = new Date(yesterday)
        dayBefore.setDate(dayBefore.getDate() - 1)
        return {
          start: new Date(yesterday.setHours(0, 0, 0, 0)),
          end: new Date(yesterday.setHours(23, 59, 59, 999)),
          label: 'Ayer',
          granularity: 'day',
          comparison: {
            start: new Date(dayBefore.setHours(0, 0, 0, 0)),
            end: new Date(dayBefore.setHours(23, 59, 59, 999)),
            label: 'Anteayer'
          }
        }
      
      case 'this_week': {
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        
        const lastWeekStart = new Date(startOfWeek)
        lastWeekStart.setDate(lastWeekStart.getDate() - 7)
        const lastWeekEnd = new Date(lastWeekStart)
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6)
        
        return {
          start: startOfWeek,
          end: endOfWeek,
          label: 'Esta Semana',
          granularity: 'week',
          comparison: {
            start: lastWeekStart,
            end: lastWeekEnd,
            label: 'Semana Pasada'
          }
        }
      }
      
      case 'this_month': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
        
        return {
          start: startOfMonth,
          end: endOfMonth,
          label: `${startOfMonth.toLocaleString('es', { month: 'long' })} ${startOfMonth.getFullYear()}`,
          granularity: 'month',
          comparison: {
            start: lastMonthStart,
            end: lastMonthEnd,
            label: `${lastMonthStart.toLocaleString('es', { month: 'long' })} ${lastMonthStart.getFullYear()}`
          }
        }
      }
      
      case 'last_month': {
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
        
        const twoMonthsAgoStart = new Date(today.getFullYear(), today.getMonth() - 2, 1)
        const twoMonthsAgoEnd = new Date(today.getFullYear(), today.getMonth() - 1, 0)
        
        return {
          start: lastMonthStart,
          end: lastMonthEnd,
          label: `${lastMonthStart.toLocaleString('es', { month: 'long' })} ${lastMonthStart.getFullYear()}`,
          granularity: 'month',
          comparison: {
            start: twoMonthsAgoStart,
            end: twoMonthsAgoEnd,
            label: `${twoMonthsAgoStart.toLocaleString('es', { month: 'long' })} ${twoMonthsAgoStart.getFullYear()}`
          }
        }
      }
      
      case 'this_year': {
        const startOfYear = new Date(today.getFullYear(), 0, 1)
        const endOfYear = new Date(today.getFullYear(), 11, 31)
        
        const lastYearStart = new Date(today.getFullYear() - 1, 0, 1)
        const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31)
        
        return {
          start: startOfYear,
          end: endOfYear,
          label: `${startOfYear.getFullYear()}`,
          granularity: 'year',
          comparison: {
            start: lastYearStart,
            end: lastYearEnd,
            label: `${lastYearStart.getFullYear()}`
          }
        }
      }
      
      default:
        return calculateRange('this_month')
    }
  }

  const presetRanges = [
    { label: 'Hoy', value: 'today', icon: '📅' },
    { label: 'Ayer', value: 'yesterday', icon: '📆' },
    { label: 'Esta Semana', value: 'this_week', icon: '📊' },
    { label: 'Este Mes', value: 'this_month', icon: '📈' },
    { label: 'Mes Pasado', value: 'last_month', icon: '📉' },
    { label: 'Este Año', value: 'this_year', icon: '🎯' },
    { label: 'Personalizado', value: 'custom', icon: '⚙️' }
  ]

  useEffect(() => {
    // Seleccionar "Este Mes" por defecto
    const defaultRange = calculateRange('this_month')
    setSelectedRange(defaultRange)
    onRangeChange(defaultRange)
  }, [])

  const handleRangeSelect = (value: string) => {
    if (value === 'custom') {
      setShowCustomPicker(true)
    } else {
      const range = calculateRange(value)
      setSelectedRange(range)
      onRangeChange(range)
      setShowCustomPicker(false)
    }
  }

  const handleCustomRange = () => {
    if (customStart && customEnd) {
      const start = new Date(customStart)
      const end = new Date(customEnd)
      
      // Calcular período de comparación (mismo número de días antes)
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24))
      const compStart = new Date(start)
      compStart.setDate(compStart.getDate() - daysDiff - 1)
      const compEnd = new Date(start)
      compEnd.setDate(compEnd.getDate() - 1)
      
      const range: TimeRange = {
        start,
        end,
        label: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
        granularity: daysDiff > 90 ? 'month' : daysDiff > 30 ? 'week' : 'day',
        comparison: {
          start: compStart,
          end: compEnd,
          label: `${compStart.toLocaleDateString()} - ${compEnd.toLocaleDateString()}`
        }
      }
      
      setSelectedRange(range)
      onRangeChange(range)
      setShowCustomPicker(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Análisis Temporal Inteligente
        </h3>
        {selectedRange && (
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <span>Comparando con:</span>
            <span className="text-purple-400 font-medium">
              {selectedRange.comparison?.label}
            </span>
          </div>
        )}
      </div>
      
      {/* Grid de períodos predefinidos */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {presetRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => handleRangeSelect(range.value)}
            className={`
              px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${selectedRange?.label === range.label && range.value !== 'custom'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white'
              }
            `}
          >
            <span className="mr-2">{range.icon}</span>
            {range.label}
          </button>
        ))}
      </div>
      
      {/* Selector de fechas personalizado */}
      {showCustomPicker && (
        <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-white/60 text-xs mb-1 block">Fecha Inicio</label>
              <input 
                type="date" 
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">Fecha Fin</label>
              <input 
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>
          </div>
          <button
            onClick={handleCustomRange}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Aplicar Rango Personalizado
          </button>
        </div>
      )}
      
      {/* Información del período seleccionado */}
      {selectedRange && (
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white/60">
              Período actual:
              <span className="text-white ml-2 font-medium">{selectedRange.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-white/10 rounded transition-colors">
                <ChevronLeft className="w-4 h-4 text-white/60" />
              </button>
              <button className="p-1 hover:bg-white/10 rounded transition-colors">
                <ChevronRight className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedTimeSelector
