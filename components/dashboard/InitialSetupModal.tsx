'use client'

import React, { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react'

interface SetupData {
  businessName: string
  industry: string
  location: string
  employees: string
  posSystem: string
  dataSource: string
  apiKey: string
}

export default function InitialSetupModal({ onComplete }: { onComplete: (data: SetupData) => void }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<SetupData>({
    businessName: '',
    industry: '',
    location: '',
    employees: '',
    posSystem: '',
    dataSource: '',
    apiKey: ''
  })

  const steps = [
    { title: 'Información Básica', fields: ['businessName', 'industry', 'location'] },
    { title: 'Operaciones', fields: ['employees', 'posSystem'] },
    { title: 'Datos y IA', fields: ['dataSource', 'apiKey'] }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Configuración Inicial
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Paso {step} de {steps.length}: {steps[step - 1].title}
              </p>
            </div>
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-1 rounded-full ${
                    i < step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Negocio
                </label>
                <input
                  type="text"
                  value={data.businessName}
                  onChange={(e) => setData({ ...data, businessName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: El Conuco de Mamá"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industria
                </label>
                <select
                  value={data.industry}
                  onChange={(e) => setData({ ...data, industry: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="restaurant">Restaurante</option>
                  <option value="minimarket">Minimarket</option>
                  <option value="retail">Retail</option>
                  <option value="salon">Salón de Belleza</option>
                  <option value="service">Servicios</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <select
                  value={data.location}
                  onChange={(e) => setData({ ...data, location: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="brooklyn">Brooklyn</option>
                  <option value="queens">Queens</option>
                  <option value="manhattan">Manhattan</option>
                  <option value="bronx">Bronx</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Empleados
                </label>
                <select
                  value={data.employees}
                  onChange={(e) => setData({ ...data, employees: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="1-5">1-5</option>
                  <option value="6-10">6-10</option>
                  <option value="11-20">11-20</option>
                  <option value="21-50">21-50</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sistema POS Actual
                </label>
                <select
                  value={data.posSystem}
                  onChange={(e) => setData({ ...data, posSystem: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="square">Square</option>
                  <option value="toast">Toast</option>
                  <option value="clover">Clover</option>
                  <option value="shopify">Shopify POS</option>
                  <option value="excel">Excel/Manual</option>
                  <option value="none">Ninguno</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuente de Datos
                </label>
                <select
                  value={data.dataSource}
                  onChange={(e) => setData({ ...data, dataSource: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="api">Conexión API con POS</option>
                  <option value="csv">Carga Manual CSV/Excel</option>
                  <option value="manual">Entrada Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key de Gemini (para análisis IA)
                </label>
                <input
                  type="text"
                  value={data.apiKey}
                  onChange={(e) => setData({ ...data, apiKey: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="AIzaSy..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Obtén tu key en: https://makersuite.google.com/app/apikey
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 inline mr-1" />
            Anterior
          </button>

          {step < steps.length ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Siguiente
              <ChevronRight className="w-5 h-5 inline ml-1" />
            </button>
          ) : (
            <button
              onClick={() => onComplete(data)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Check className="w-5 h-5 inline mr-1" />
              Completar Configuración
            </button>
          )}
        </div>
      </div>
    </div>
  )
}