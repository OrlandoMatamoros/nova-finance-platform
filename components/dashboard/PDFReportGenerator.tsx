'use client'

import React, { useState } from 'react'
import { FileText, Download, Mail, Calendar, Clock, CheckCircle, Loader, Sparkles, HelpCircle, Info, X, FileCheck } from 'lucide-react'
import jsPDF from 'jspdf'

interface ReportConfig {
  type: 'executive' | 'detailed' | 'summary'
  period: string
  includeCharts: boolean
  includeInsights: boolean
  includeRecommendations: boolean
  format: 'pdf' | 'excel'
  branding: boolean
}

const PDFReportGeneratorDocumented: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  
  const [config, setConfig] = useState<ReportConfig>({
    type: 'executive',
    period: 'month',
    includeCharts: true,
    includeInsights: true,
    includeRecommendations: true,
    format: 'pdf',
    branding: true
  })

  const generateReport = async () => {
    setIsGenerating(true)
    
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Portada con branding mejorado
    pdf.setFillColor(30, 41, 59)
    pdf.rect(0, 0, pageWidth, pageHeight, 'F')
    
    // Header Impulsa Lab
    pdf.setFillColor(147, 51, 234)
    pdf.rect(0, 0, pageWidth, 8, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(10)
    pdf.setFont(undefined, 'bold')
    pdf.text('IMPULSA LAB', pageWidth / 2, 5, { align: 'center' })
    
    // Título
    pdf.setFontSize(32)
    pdf.setTextColor(147, 51, 234)
    pdf.text('REPORTE', pageWidth / 2, 80, { align: 'center' })
    pdf.setTextColor(59, 130, 246)
    pdf.text('FINANCIERO', pageWidth / 2, 95, { align: 'center' })
    
    // Tipo de reporte
    pdf.setFontSize(14)
    pdf.setTextColor(200, 200, 200)
    const reportType = config.type === 'executive' ? 'EJECUTIVO' : 
                      config.type === 'detailed' ? 'DETALLADO' : 'RESUMEN'
    pdf.text(`REPORTE ${reportType}`, pageWidth / 2, 110, { align: 'center' })
    
    // Fecha
    pdf.setFontSize(10)
    pdf.setTextColor(150, 150, 150)
    const date = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    pdf.text(date, pageWidth / 2, 130, { align: 'center' })
    
    // Footer
    pdf.setTextColor(100, 100, 100)
    pdf.setFontSize(8)
    pdf.text('Powered by Impulsa Lab & Nova AI', pageWidth / 2, pageHeight - 20, { align: 'center' })
    
    // Guardar
    pdf.save(`Reporte_${config.type}_${new Date().toISOString().split('T')[0]}.pdf`)
    
    setTimeout(() => {
      setIsGenerating(false)
      setReportGenerated(true)
      setTimeout(() => setReportGenerated(false), 3000)
    }, 2000)
  }

  const reportTypes = [
    { value: 'executive', label: 'Ejecutivo', description: '2-3 páginas con KPIs clave' },
    { value: 'detailed', label: 'Detallado', description: '10+ páginas con análisis completo' },
    { value: 'summary', label: 'Resumen', description: '1 página con lo esencial' }
  ]

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-xl flex items-center gap-3">
          <FileText className="w-6 h-6 text-purple-400" />
          Generador de Reportes PDF
          <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold rounded-full animate-pulse">
            PREMIUM
          </span>
        </h3>
        
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all group relative"
        >
          <HelpCircle className="w-5 h-5 text-white/80 group-hover:text-white" />
          
          <div className="absolute right-0 top-12 w-48 p-2 bg-black/90 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <p className="text-white text-xs">
              Guía de generación de reportes
            </p>
          </div>
        </button>
      </div>

      {/* Panel de Ayuda */}
      {showHelp && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 relative">
          <button
            onClick={() => setShowHelp(false)}
            className="absolute right-2 top-2 p-1 hover:bg-white/10 rounded"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
          
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-white/80 space-y-3">
              <div>
                <p className="font-semibold text-white mb-2">📄 ¿Para qué sirve?</p>
                <p>Genera reportes profesionales automáticos para:</p>
                <ul className="mt-1 ml-4 list-disc space-y-0.5">
                  <li>Presentar a inversionistas o socios</li>
                  <li>Análisis mensual/trimestral del negocio</li>
                  <li>Documentación para préstamos bancarios</li>
                  <li>Reportes fiscales y contables</li>
                  <li>Compartir progreso con el equipo</li>
                </ul>
              </div>
              
              <div>
                <p className="font-semibold text-white mb-2">⚙️ ¿Cómo configurarlo?</p>
                <ul className="ml-4 list-disc space-y-0.5">
                  <li><strong>Tipo:</strong> Ejecutivo (corto), Detallado (completo), Resumen (1 página)</li>
                  <li><strong>Período:</strong> Día, semana, mes, trimestre o año</li>
                  <li><strong>Contenido:</strong> Selecciona qué incluir</li>
                  <li><strong>Formato:</strong> PDF para compartir, Excel para análisis</li>
                  <li><strong>Branding:</strong> Con logo y colores de tu empresa</li>
                </ul>
              </div>
              
              <div>
                <p className="font-semibold text-white mb-2">💡 Resultados esperados:</p>
                <ul className="ml-4 list-disc space-y-0.5">
                  <li>PDF profesional listo para imprimir</li>
                  <li>Gráficos y visualizaciones incluidas</li>
                  <li>Insights generados por IA</li>
                  <li>Formato consistente y corporativo</li>
                  <li>Descarga inmediata</li>
                </ul>
              </div>

              <div className="mt-3 p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <p className="text-xs text-purple-200">
                  📊 <strong>Tip:</strong> El reporte ejecutivo es ideal para reuniones rápidas. El detallado para análisis profundo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuración del reporte */}
      <div className="space-y-4 mb-6">
        {/* Tipo de reporte con tooltip */}
        <div>
          <label className="text-white/60 text-sm mb-2 block">Tipo de Reporte</label>
          <div className="grid grid-cols-3 gap-2">
            {reportTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setConfig({...config, type: type.value as any})}
                onMouseEnter={() => setShowTooltip(type.value)}
                onMouseLeave={() => setShowTooltip(null)}
                className={`relative p-3 rounded-lg border transition-all
                  ${config.type === type.value 
                    ? 'bg-purple-500/20 border-purple-500/40 text-white' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
              >
                <p className="font-semibold text-sm">{type.label}</p>
                
                {showTooltip === type.value && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 rounded-lg z-50">
                    <p className="text-white text-xs">{type.description}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Período */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <label className="text-white/60 text-sm mb-2 block">Período</label>
            <select
              value={config.period}
              onChange={(e) => setConfig({...config, period: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="day">Hoy</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
              <option value="quarter">Este Trimestre</option>
              <option value="year">Este Año</option>
              <option value="custom">Personalizado</option>
            </select>
            
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 rounded text-white text-xs opacity-0 group-hover:opacity-100 invisible group-hover:visible">
              Período de datos a incluir
            </div>
          </div>

          <div className="relative group">
            <label className="text-white/60 text-sm mb-2 block">Formato</label>
            <select
              value={config.format}
              onChange={(e) => setConfig({...config, format: e.target.value as any})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
            
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 rounded text-white text-xs opacity-0 group-hover:opacity-100 invisible group-hover:visible">
              PDF para presentar, Excel para analizar
            </div>
          </div>
        </div>

        {/* Opciones de contenido */}
        <div>
          <label className="text-white/60 text-sm mb-2 block">Incluir en el reporte:</label>
          <div className="space-y-2">
            {[
              { key: 'includeCharts', label: 'Gráficos y visualizaciones', icon: '📊' },
              { key: 'includeInsights', label: 'Análisis e insights con IA', icon: '🤖' },
              { key: 'includeRecommendations', label: 'Recomendaciones y acciones', icon: '💡' },
              { key: 'branding', label: 'Branding de Impulsa Lab', icon: '🎨' }
            ].map((option) => (
              <label key={option.key} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={config[option.key as keyof ReportConfig] as boolean}
                  onChange={(e) => setConfig({...config, [option.key]: e.target.checked})}
                  className="w-4 h-4 rounded"
                />
                <span className="text-white/80 text-sm flex items-center gap-2">
                  <span>{option.icon}</span>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Botón de generación */}
      <button
        onClick={generateReport}
        disabled={isGenerating}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold
                   hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 
                   disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Generando Reporte...
          </>
        ) : reportGenerated ? (
          <>
            <CheckCircle className="w-5 h-5" />
            ¡Reporte Generado!
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Generar Reporte {config.format.toUpperCase()}
          </>
        )}
      </button>

      {/* Acciones adicionales */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-sm transition-all flex items-center justify-center gap-2">
          <Mail className="w-4 h-4" />
          Enviar por Email
        </button>
        <button className="py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-sm transition-all flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" />
          Programar Envío
        </button>
      </div>

      {/* Historial de reportes */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-white/60 text-sm mb-3">Reportes Recientes</h4>
        <div className="space-y-2">
          {[
            { name: 'Reporte_Ejecutivo_Noviembre.pdf', date: '01/11/2024', size: '2.3 MB' },
            { name: 'Reporte_Detallado_Q3.pdf', date: '30/10/2024', size: '8.7 MB' },
            { name: 'Resumen_Octubre.pdf', date: '01/10/2024', size: '450 KB' }
          ].map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-white/80 text-sm">{file.name}</p>
                  <p className="text-white/40 text-xs">{file.date} • {file.size}</p>
                </div>
              </div>
              <button className="p-1 hover:bg-white/10 rounded">
                <Download className="w-4 h-4 text-white/60" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-white/40 text-xs text-center">
          PDF Generator Pro | Powered by Impulsa Lab
        </p>
      </div>
    </div>
  )
}

export default PDFReportGeneratorDocumented
