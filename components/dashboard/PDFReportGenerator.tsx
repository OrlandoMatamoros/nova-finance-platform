'use client'

import React, { useState } from 'react'
import { FileText, Download, Mail, Calendar, Clock, CheckCircle, Loader } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface ReportConfig {
  type: 'executive' | 'detailed' | 'summary'
  period: string
  includeCharts: boolean
  includeInsights: boolean
  includePredictions: boolean
  format: 'pdf' | 'excel' | 'powerpoint'
  delivery: 'download' | 'email' | 'whatsapp'
}

interface PDFReportGeneratorProps {
  dashboardData: any
  period: string
  businessName?: string
}

const PDFReportGenerator: React.FC<PDFReportGeneratorProps> = ({ 
  dashboardData, 
  period,
  businessName = 'Brooklyn Bistro'
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: 'executive',
    period: period,
    includeCharts: true,
    includeInsights: true,
    includePredictions: true,
    format: 'pdf',
    delivery: 'download'
  })
  const [scheduledReports, setScheduledReports] = useState([
    { id: 1, frequency: 'Diario', time: '07:00', type: 'summary', active: true },
    { id: 2, frequency: 'Semanal', time: 'Lunes 08:00', type: 'executive', active: false },
    { id: 3, frequency: 'Mensual', time: 'Día 1, 09:00', type: 'detailed', active: true }
  ])

  const generatePDF = async () => {
    setIsGenerating(true)
    
    try {
      // Crear nuevo documento PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      // Colores del tema
      const primaryColor = [0, 102, 255] // Azul espacial
      const accentColor = [168, 85, 247] // Púrpura
      
      // Página 1: Portada
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      pdf.rect(0, 0, pageWidth, 60, 'F')
      
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(28)
      pdf.text(businessName, pageWidth / 2, 25, { align: 'center' })
      
      pdf.setFontSize(16)
      pdf.text('Reporte Financiero Inteligente', pageWidth / 2, 40, { align: 'center' })
      
      pdf.setFontSize(12)
      pdf.text(period, pageWidth / 2, 50, { align: 'center' })
      
      // Logo de Impulsa Lab
      pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2])
      pdf.setFontSize(10)
      pdf.text('Powered by Impulsa Lab & Nova AI', pageWidth / 2, pageHeight - 20, { align: 'center' })
      
      // Página 2: Resumen Ejecutivo
      pdf.addPage()
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(18)
      pdf.text('Resumen Ejecutivo', 20, 30)
      
      pdf.setFontSize(11)
      pdf.setTextColor(60, 60, 60)
      let yPosition = 45
      
      // Métricas principales
      const metrics = [
        { label: 'Ventas Totales', value: `$${dashboardData?.totals?.sales?.toLocaleString() || '0'}` },
        { label: 'Utilidad Neta', value: `$${dashboardData?.totals?.netProfit?.toLocaleString() || '0'}` },
        { label: 'Margen de Utilidad', value: `${((dashboardData?.totals?.netProfit / dashboardData?.totals?.sales) * 100).toFixed(1)}%` },
        { label: 'Clientes Atendidos', value: dashboardData?.totals?.covers?.toLocaleString() || '0' },
        { label: 'Ticket Promedio', value: `$${dashboardData?.averages?.ticketSize?.toFixed(2) || '0'}` }
      ]
      
      metrics.forEach(metric => {
        pdf.setFont(undefined, 'bold')
        pdf.text(metric.label + ':', 20, yPosition)
        pdf.setFont(undefined, 'normal')
        pdf.text(metric.value, 80, yPosition)
        yPosition += 10
      })
      
      // Insights principales
      if (reportConfig.includeInsights) {
        yPosition += 10
        pdf.setFontSize(14)
        pdf.setTextColor(0, 0, 0)
        pdf.text('Insights Clave de Nova AI', 20, yPosition)
        yPosition += 10
        
        pdf.setFontSize(10)
        pdf.setTextColor(60, 60, 60)
        const insights = [
          '• Ventas aumentaron 12.5% vs período anterior',
          '• Costos de alimentos 5% sobre objetivo - Acción requerida',
          '• Oportunidad: Martes y miércoles con 40% menos ventas',
          '• Predicción: Crecimiento del 5% próximo mes con 78% certeza'
        ]
        
        insights.forEach(insight => {
          pdf.text(insight, 20, yPosition)
          yPosition += 8
        })
      }
      
      // Página 3: Gráficos (si están incluidos)
      if (reportConfig.includeCharts) {
        pdf.addPage()
        pdf.setFontSize(18)
        pdf.setTextColor(0, 0, 0)
        pdf.text('Análisis Visual', 20, 30)
        
        // Aquí normalmente capturaríamos los gráficos con html2canvas
        // Por ahora, agregamos un placeholder
        pdf.setFillColor(240, 240, 240)
        pdf.rect(20, 40, pageWidth - 40, 80, 'F')
        pdf.setTextColor(150, 150, 150)
        pdf.setFontSize(12)
        pdf.text('Gráfico de Tendencia de Ingresos', pageWidth / 2, 80, { align: 'center' })
        
        pdf.rect(20, 130, pageWidth - 40, 80, 'F')
        pdf.text('Distribución de Gastos', pageWidth / 2, 170, { align: 'center' })
      }
      
      // Página 4: Recomendaciones
      pdf.addPage()
      pdf.setFontSize(18)
      pdf.setTextColor(0, 0, 0)
      pdf.text('Recomendaciones Estratégicas', 20, 30)
      
      yPosition = 45
      pdf.setFontSize(11)
      pdf.setTextColor(60, 60, 60)
      
      const recommendations = [
        { priority: 'Alta', action: 'Renegociar contratos con 3 proveedores principales', impact: '$15,000/mes' },
        { priority: 'Media', action: 'Lanzar promoción "Martes de Tapas"', impact: '$8,000/mes' },
        { priority: 'Media', action: 'Optimizar horarios del personal', impact: '$5,000/mes' },
        { priority: 'Baja', action: 'Actualizar menú con platos de mayor margen', impact: '$3,000/mes' }
      ]
      
      recommendations.forEach(rec => {
        // Color según prioridad
        if (rec.priority === 'Alta') pdf.setTextColor(255, 0, 0)
        else if (rec.priority === 'Media') pdf.setTextColor(255, 165, 0)
        else pdf.setTextColor(0, 128, 0)
        
        pdf.text(`[${rec.priority}]`, 20, yPosition)
        
        pdf.setTextColor(60, 60, 60)
        pdf.text(rec.action, 40, yPosition)
        pdf.text(`Impacto: ${rec.impact}`, 140, yPosition)
        yPosition += 10
      })
      
      // Footer en todas las páginas
      const pageCount = pdf.internal.pages.length - 1 // -1 porque jsPDF cuenta desde 1
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setTextColor(150, 150, 150)
        pdf.text(`Página ${i} de ${pageCount}`, pageWidth - 20, pageHeight - 10, { align: 'right' })
        pdf.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 20, pageHeight - 10)
      }
      
      // Guardar el PDF
      pdf.save(`${businessName}_Reporte_${period.replace(/\s/g, '_')}.pdf`)
      
    } catch (error) {
      console.error('Error generando PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleScheduleToggle = (reportId: number) => {
    setScheduledReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, active: !report.active }
          : report
      )
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                    rounded-2xl border border-white/10">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                Generador de Reportes Inteligentes
              </h3>
              <p className="text-white/60 text-sm">
                Crea reportes profesionales con análisis de IA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuración del Reporte */}
      <div className="p-6 border-b border-white/10">
        <h4 className="text-white font-semibold mb-4">Configuración del Reporte</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tipo de Reporte */}
          <div>
            <label className="text-white/60 text-xs block mb-2">Tipo de Reporte</label>
            <select
              value={reportConfig.type}
              onChange={(e) => setReportConfig(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:bg-white/20 focus:border-white/40 transition-all"
            >
              <option value="executive">Ejecutivo (2 páginas)</option>
              <option value="detailed">Detallado (5+ páginas)</option>
              <option value="summary">Resumen (1 página)</option>
            </select>
          </div>
          
          {/* Formato */}
          <div>
            <label className="text-white/60 text-xs block mb-2">Formato</label>
            <select
              value={reportConfig.format}
              onChange={(e) => setReportConfig(prev => ({ ...prev, format: e.target.value as any }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:bg-white/20 focus:border-white/40 transition-all"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel (próximamente)</option>
              <option value="powerpoint">PowerPoint (próximamente)</option>
            </select>
          </div>
          
          {/* Método de Entrega */}
          <div>
            <label className="text-white/60 text-xs block mb-2">Entrega</label>
            <select
              value={reportConfig.delivery}
              onChange={(e) => setReportConfig(prev => ({ ...prev, delivery: e.target.value as any }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                       text-white focus:bg-white/20 focus:border-white/40 transition-all"
            >
              <option value="download">Descargar</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
        </div>
        
        {/* Opciones de Contenido */}
        <div className="mt-4 space-y-2">
          <label className="text-white/60 text-xs block mb-2">Incluir en el Reporte</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-white/80 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={reportConfig.includeCharts}
                onChange={(e) => setReportConfig(prev => ({ ...prev, includeCharts: e.target.checked }))}
                className="w-4 h-4 rounded bg-white/10 border-white/20"
              />
              Gráficos
            </label>
            <label className="flex items-center gap-2 text-white/80 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={reportConfig.includeInsights}
                onChange={(e) => setReportConfig(prev => ({ ...prev, includeInsights: e.target.checked }))}
                className="w-4 h-4 rounded bg-white/10 border-white/20"
              />
              Insights de IA
            </label>
            <label className="flex items-center gap-2 text-white/80 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={reportConfig.includePredictions}
                onChange={(e) => setReportConfig(prev => ({ ...prev, includePredictions: e.target.checked }))}
                className="w-4 h-4 rounded bg-white/10 border-white/20"
              />
              Predicciones
            </label>
          </div>
        </div>
      </div>

      {/* Reportes Programados */}
      <div className="p-6 border-b border-white/10">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-400" />
          Reportes Automáticos Programados
        </h4>
        
        <div className="space-y-3">
          {scheduledReports.map(report => (
            <div 
              key={report.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleScheduleToggle(report.id)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    report.active ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-all transform ${
                    report.active ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
                <div>
                  <p className="text-white text-sm font-medium">
                    Reporte {report.type === 'executive' ? 'Ejecutivo' : report.type === 'detailed' ? 'Detallado' : 'Resumido'}
                  </p>
                  <p className="text-white/60 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {report.frequency} - {report.time}
                  </p>
                </div>
              </div>
              {report.active && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Botón de Generar */}
      <div className="p-6">
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                   rounded-xl font-medium hover:shadow-lg transition-all hover:scale-[1.02]
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center 
                   justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Generando Reporte...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Generar Reporte Ahora
            </>
          )}
        </button>
        
        {reportConfig.delivery === 'email' && (
          <p className="text-white/60 text-xs text-center mt-2">
            Se enviará a: admin@brooklynbistro.com
          </p>
        )}
        
        {reportConfig.delivery === 'whatsapp' && (
          <p className="text-white/60 text-xs text-center mt-2">
            Se enviará a: +1 (555) 123-4567
          </p>
        )}
      </div>
    </div>
  )
}

export default PDFReportGenerator