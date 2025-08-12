'use client'

import dynamic from 'next/dynamic'

// Cargar el dashboard completo solo en el cliente para evitar problemas de hidratación
const AdvancedDashboard = dynamic(
  () => import('@/components/dashboard/AdvancedDashboard'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white mt-4">Cargando Nova Finance Platform...</p>
        </div>
      </div>
    )
  }
)

export default function Home() {
  return <AdvancedDashboard />
}
