'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import KPICards from './KPICards'
import PeriodSelector from './PeriodSelector'
import AIInsights from './AIInsights'

// Cargar dinámicamente los componentes que tienen problemas de hidratación
const RevenueChart = dynamic(() => import('./RevenueChart'), { 
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="h-[300px] animate-pulse bg-gray-100 rounded-lg"></div>
    </div>
  )
})

const ExpenseBreakdown = dynamic(() => import('./ExpenseBreakdown'), { 
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="h-[400px] animate-pulse bg-gray-100 rounded-lg"></div>
    </div>
  )
})

const DashboardDemo: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-2">
            <span className="inline-block px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full mb-4">
              DEMO - BROOKLYN BISTRO
            </span>
          </div>
          <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Nova Finance Platform
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Dashboard Financiero Inteligente con IA
          </p>
          
          <PeriodSelector 
            selectedPeriod={selectedPeriod} 
            setSelectedPeriod={setSelectedPeriod} 
          />
        </div>

        {/* KPI Cards */}
        <KPICards period={selectedPeriod} />

        {/* Charts - Cargados dinámicamente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <RevenueChart period={selectedPeriod} />
          <ExpenseBreakdown period={selectedPeriod} />
        </div>

        {/* AI Insights */}
        <AIInsights />

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Powered by <span className="font-bold text-purple-600">Impulsa Lab</span> | Dashboard personalizable para cada cliente</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardDemo
