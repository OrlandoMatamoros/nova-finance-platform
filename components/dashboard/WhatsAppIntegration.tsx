'use client'

import React, { useState } from 'react'
import { MessageCircle, Bell, Send, Clock, CheckCircle, AlertTriangle, TrendingUp, Calendar, Settings, Smartphone, Users, BarChart3, DollarSign, HelpCircle, Info, X } from 'lucide-react'

interface Alert {
  id: string
  name: string
  description: string
  trigger: string
  frequency: 'instant' | 'daily' | 'weekly'
  enabled: boolean
  lastSent?: Date
  icon: React.ReactElement
}

const WhatsAppIntegrationDocumented: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [testingSend, setTestingSend] = useState(false)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      name: 'Ventas Diarias',
      description: 'Resumen de ventas al cierre del día',
      trigger: 'Todos los días a las 9:00 PM',
      frequency: 'daily',
      enabled: true,
      lastSent: new Date(Date.now() - 86400000),
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      id: '2',
      name: 'Alerta de Inventario Bajo',
      description: 'Notifica cuando un producto está por agotarse',
      trigger: 'Cuando inventario < 10 unidades',
      frequency: 'instant',
      enabled: true,
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      id: '3',
      name: 'Meta Semanal',
      description: 'Progreso hacia la meta de ventas semanal',
      trigger: 'Lunes y Viernes a las 10:00 AM',
      frequency: 'weekly',
      enabled: false,
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: '4',
      name: 'Recordatorio de Pagos',
      description: 'Facturas pendientes de pago',
      trigger: '3 días antes del vencimiento',
      frequency: 'instant',
      enabled: true,
      icon: <Calendar className="w-4 h-4" />
    }
  ])

  const connectWhatsApp = () => {
    if (phoneNumber.length >= 10) {
      setIsConnected(true)
      setTimeout(() => {
        // Simular conexión exitosa
      }, 1000)
    }
  }

  const sendTestMessage = () => {
    setTestingSend(true)
    setTimeout(() => {
      setTestingSend(false)
      alert('✅ Mensaje de prueba enviado exitosamente')
    }, 2000)
  }

  const toggleAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert
    ))
  }

  return (
    <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-xl flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-green-400" />
          Integración WhatsApp Business
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
              Configuración y guía de uso
            </p>
          </div>
        </button>
      </div>

      {/* Panel de Ayuda */}
      {showHelp && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 relative">
          <button
            onClick={() => setShowHelp(false)}
            className="absolute right-2 top-2 p-1 hover:bg-white/10 rounded"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
          
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-white/80 space-y-3">
              <div>
                <p className="font-semibold text-white mb-2">📱 ¿Para qué sirve?</p>
                <p>Recibe alertas automáticas de tu negocio directamente en WhatsApp:</p>
                <ul className="mt-1 ml-4 list-disc space-y-0.5">
                  <li>Resumen de ventas diarias</li>
                  <li>Alertas de inventario bajo</li>
                  <li>Recordatorios de pagos pendientes</li>
                  <li>Progreso hacia metas</li>
                  <li>Anomalías detectadas por IA</li>
                </ul>
              </div>
              
              <div>
                <p className="font-semibold text-white mb-2">⚙️ ¿Cómo configurarlo?</p>
                <ol className="ml-4 list-decimal space-y-0.5">
                  <li><strong>Número:</strong> Ingresa tu WhatsApp Business</li>
                  <li><strong>Verificar:</strong> Recibirás un código de 6 dígitos</li>
                  <li><strong>Activar alertas:</strong> Selecciona las que necesites</li>
                  <li><strong>Personalizar:</strong> Ajusta horarios y frecuencia</li>
                  <li><strong>Probar:</strong> Envía mensaje de prueba</li>
                </ol>
              </div>
              
              <div>
                <p className="font-semibold text-white mb-2">💡 Resultados esperados:</p>
                <ul className="ml-4 list-disc space-y-0.5">
                  <li>Estar informado sin abrir el dashboard</li>
                  <li>Reaccionar rápido a situaciones críticas</li>
                  <li>Compartir reportes con tu equipo</li>
                  <li>Historial de métricas en tu chat</li>
                </ul>
              </div>

              <div className="mt-3 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-xs text-green-200">
                  ✅ <strong>Seguridad:</strong> Usamos WhatsApp Business API oficial. Tus datos están encriptados end-to-end.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuración de conexión */}
      <div className="bg-white/5 rounded-lg p-4 mb-6">
        <h4 className="text-white/80 text-sm font-semibold mb-3">Configuración de WhatsApp</h4>
        
        <div className="space-y-3">
          <div className="relative">
            <label className="text-white/60 text-sm mb-2 block">Número de WhatsApp Business</label>
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 234 567 8900"
                  disabled={isConnected}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50"
                />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 rounded text-white text-xs opacity-0 group-hover:opacity-100 invisible group-hover:visible">
                  Incluye código de país
                </div>
              </div>
              
              <button
                onClick={isConnected ? () => setIsConnected(false) : connectWhatsApp}
                disabled={phoneNumber.length < 10 && !isConnected}
                className={`px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50
                  ${isConnected 
                    ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                    : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                  }`}
              >
                {isConnected ? 'Desconectar' : 'Conectar'}
              </button>
            </div>
          </div>

          {/* Estado de conexión */}
          {isConnected && (
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-300 text-sm">WhatsApp conectado exitosamente</span>
              </div>
              <button
                onClick={sendTestMessage}
                disabled={testingSend}
                onMouseEnter={() => setShowTooltip('test')}
                onMouseLeave={() => setShowTooltip(null)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-sm transition-all relative"
              >
                {testingSend ? 'Enviando...' : 'Enviar Prueba'}
                
                {showTooltip === 'test' && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-black/90 rounded-lg z-50">
                    <p className="text-white text-xs">
                      Envía un mensaje de prueba para verificar la conexión
                    </p>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alertas configurables */}
      <div className="space-y-3 mb-6">
        <h4 className="text-white/80 text-sm font-semibold">Alertas Automáticas</h4>
        
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${alert.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {alert.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-white font-semibold">{alert.name}</h5>
                    <span className={`px-2 py-0.5 rounded-full text-xs
                      ${alert.frequency === 'instant' ? 'bg-red-500/20 text-red-300' :
                        alert.frequency === 'daily' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-purple-500/20 text-purple-300'}
                    `}>
                      {alert.frequency === 'instant' ? 'Instantáneo' :
                       alert.frequency === 'daily' ? 'Diario' : 'Semanal'}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-2">{alert.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-white/40 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.trigger}
                    </span>
                    {alert.lastSent && (
                      <span className="text-white/40">
                        Último envío: {alert.lastSent.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Toggle switch con tooltip */}
              <div className="relative">
                <button
                  onClick={() => toggleAlert(alert.id)}
                  onMouseEnter={() => setShowTooltip(alert.id)}
                  onMouseLeave={() => setShowTooltip(null)}
                  disabled={!isConnected}
                  className={`relative w-12 h-6 rounded-full transition-all disabled:opacity-50
                    ${alert.enabled ? 'bg-green-500' : 'bg-gray-500'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all
                    ${alert.enabled ? 'left-7' : 'left-1'}`} />
                </button>
                
                {showTooltip === alert.id && (
                  <div className="absolute bottom-full right-0 mb-2 w-32 p-2 bg-black/90 rounded-lg z-50">
                    <p className="text-white text-xs">
                      {alert.enabled ? 'Desactivar alerta' : 'Activar alerta'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón de configuración avanzada */}
      <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-sm transition-all flex items-center justify-center gap-2">
        <Settings className="w-4 h-4" />
        Configuración Avanzada
      </button>

      {/* Estadísticas */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">127</p>
            <p className="text-white/60 text-xs">Mensajes enviados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">4</p>
            <p className="text-white/60 text-xs">Alertas activas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">98%</p>
            <p className="text-white/60 text-xs">Tasa de entrega</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-white/40 text-xs text-center">
          WhatsApp Business API | Powered by Impulsa Lab
        </p>
      </div>
    </div>
  )
}

export default WhatsAppIntegrationDocumented
