'use client'

import React, { useState } from 'react'
import { 
  MessageCircle, Bell, Send, Clock, CheckCircle, 
  AlertTriangle, TrendingUp, Calendar, Settings,
  Smartphone, Users, BarChart3, DollarSign
} from 'lucide-react'

interface Alert {
  id: string
  name: string
  description: string
  trigger: string
  frequency: 'instant' | 'daily' | 'weekly' | 'monthly'
  enabled: boolean
  lastSent?: Date
  icon: React.ReactNode
  category: 'sales' | 'costs' | 'operations' | 'goals'
}

interface Contact {
  id: string
  name: string
  phone: string
  role: 'owner' | 'manager' | 'accountant' | 'other'
  notifications: string[]
  active: boolean
}

interface MessageTemplate {
  id: string
  name: string
  content: string
  variables: string[]
  category: string
}

interface WhatsAppIntegrationProps {
  businessData?: any
}

const WhatsAppIntegration: React.FC<WhatsAppIntegrationProps> = ({ businessData }) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'contacts' | 'templates' | 'test'>('alerts')
  const [testPhone, setTestPhone] = useState('')
  const [testMessage, setTestMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      name: 'Ventas Diarias',
      description: 'Resumen de ventas al cierre del día',
      trigger: 'Todos los días a las 10:00 PM',
      frequency: 'daily',
      enabled: true,
      lastSent: new Date(),
      icon: <DollarSign className="w-5 h-5" />,
      category: 'sales'
    },
    {
      id: '2',
      name: 'Alerta de Costos',
      description: 'Notificación cuando los costos exceden el 35%',
      trigger: 'Cuando food cost > 35%',
      frequency: 'instant',
      enabled: true,
      icon: <AlertTriangle className="w-5 h-5" />,
      category: 'costs'
    },
    {
      id: '3',
      name: 'Meta Alcanzada',
      description: 'Celebración cuando se alcanza la meta mensual',
      trigger: 'Al alcanzar meta de ventas',
      frequency: 'instant',
      enabled: false,
      icon: <TrendingUp className="w-5 h-5" />,
      category: 'goals'
    },
    {
      id: '4',
      name: 'Reporte Semanal',
      description: 'Análisis completo de la semana con insights de IA',
      trigger: 'Domingos a las 8:00 PM',
      frequency: 'weekly',
      enabled: true,
      lastSent: new Date(),
      icon: <BarChart3 className="w-5 h-5" />,
      category: 'operations'
    }
  ])

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Orlando Matamoros',
      phone: '+1 (555) 123-4567',
      role: 'owner',
      notifications: ['1', '2', '3', '4'],
      active: true
    },
    {
      id: '2',
      name: 'María García',
      phone: '+1 (555) 987-6543',
      role: 'manager',
      notifications: ['1', '4'],
      active: true
    },
    {
      id: '3',
      name: 'Carlos Rodríguez',
      phone: '+1 (555) 456-7890',
      role: 'accountant',
      notifications: ['2', '4'],
      active: false
    }
  ])

  const [templates] = useState<MessageTemplate[]>([
    {
      id: '1',
      name: 'Resumen Diario',
      content: `📊 *Resumen del Día - {fecha}*\n\n�� Ventas: ${'{ventas}'}\n👥 Clientes: {clientes}\n🎯 Ticket Promedio: ${'{ticket}'}\n📈 vs Ayer: {cambio}%\n\n_Powered by Nova AI_`,
      variables: ['fecha', 'ventas', 'clientes', 'ticket', 'cambio'],
      category: 'daily'
    },
    {
      id: '2',
      name: 'Alerta Crítica',
      content: `⚠️ *ALERTA: {tipo}*\n\n{mensaje}\n\nValor actual: {valor}\nObjetivo: {objetivo}\n\n*Acción recomendada:*\n{accion}\n\n_Requiere atención inmediata_`,
      variables: ['tipo', 'mensaje', 'valor', 'objetivo', 'accion'],
      category: 'alert'
    },
    {
      id: '3',
      name: 'Meta Alcanzada',
      content: `🎉 *¡FELICITACIONES!*\n\n✅ Has alcanzado tu meta de {meta}\n\n📊 Resultado: ${'{resultado}'}\n🎯 Objetivo: ${'{objetivo}'}\n📈 Superado por: {diferencia}%\n\n¡Sigue así! 💪`,
      variables: ['meta', 'resultado', 'objetivo', 'diferencia'],
      category: 'achievement'
    }
  ])

  const toggleAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert
    ))
  }

  const sendTestMessage = async () => {
    setIsSending(true)
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert(`Mensaje enviado a ${testPhone}`)
    setIsSending(false)
    setTestMessage('')
  }

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'sales': return 'from-green-600 to-emerald-600'
      case 'costs': return 'from-red-600 to-orange-600'
      case 'operations': return 'from-blue-600 to-indigo-600'
      case 'goals': return 'from-purple-600 to-pink-600'
      default: return 'from-gray-600 to-gray-700'
    }
  }

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'owner': return { label: 'Propietario', color: 'bg-purple-500/20 text-purple-400' }
      case 'manager': return { label: 'Gerente', color: 'bg-blue-500/20 text-blue-400' }
      case 'accountant': return { label: 'Contador', color: 'bg-green-500/20 text-green-400' }
      default: return { label: 'Otro', color: 'bg-gray-500/20 text-gray-400' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                      rounded-2xl border border-white/10">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">WhatsApp Business</h3>
                <p className="text-white/60 text-sm">Alertas y reportes automáticos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Conectado</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'alerts'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <Bell className="w-4 h-4 inline mr-2" />
              Alertas
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'contacts'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Contactos
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'templates'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Plantillas
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'test'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <Send className="w-4 h-4 inline mr-2" />
              Enviar Test
            </button>
          </div>
        </div>

        {/* Tab: Alerts */}
        {activeTab === 'alerts' && (
          <div className="p-6">
            <div className="space-y-3">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${getCategoryColor(alert.category)}`}>
                        <div className="text-white">
                          {alert.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium">{alert.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            alert.frequency === 'instant' ? 'bg-red-500/20 text-red-400' :
                            alert.frequency === 'daily' ? 'bg-blue-500/20 text-blue-400' :
                            alert.frequency === 'weekly' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {alert.frequency === 'instant' ? 'Instantáneo' :
                             alert.frequency === 'daily' ? 'Diario' :
                             alert.frequency === 'weekly' ? 'Semanal' : 'Mensual'}
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
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        alert.enabled ? 'bg-green-600' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        alert.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-white/60 text-xs mb-1">Alertas Activas</p>
                <p className="text-2xl font-bold text-white">
                  {alerts.filter(a => a.enabled).length}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-white/60 text-xs mb-1">Enviadas Hoy</p>
                <p className="text-2xl font-bold text-green-400">12</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-white/60 text-xs mb-1">Próxima Alerta</p>
                <p className="text-sm font-medium text-white">10:00 PM</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Contacts */}
        {activeTab === 'contacts' && (
          <div className="p-6">
            <div className="space-y-3">
              {contacts.map(contact => (
                <div
                  key={contact.id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 
                                    rounded-full flex items-center justify-center text-white font-bold">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">{contact.name}</p>
                          <span className={getRoleBadge(contact.role).color + ' px-2 py-0.5 rounded text-xs'}>
                            {getRoleBadge(contact.role).label}
                          </span>
                        </div>
                        <p className="text-white/60 text-sm flex items-center gap-2">
                          <Smartphone className="w-3 h-3" />
                          {contact.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/40 text-xs">
                        {contact.notifications.length} alertas
                      </span>
                      {contact.active ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full py-3 bg-white/10 hover:bg-white/20 text-white 
                           rounded-xl font-medium transition-all flex items-center 
                           justify-center gap-2">
              <Users className="w-5 h-5" />
              Agregar Contacto
            </button>
          </div>
        )}

        {/* Tab: Templates */}
        {activeTab === 'templates' && (
          <div className="p-6">
            <div className="space-y-4">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{template.name}</h4>
                      <p className="text-white/60 text-xs">
                        Variables: {template.variables.join(', ')}
                      </p>
                    </div>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <Settings className="w-4 h-4 text-white/80" />
                    </button>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <pre className="text-white/80 text-xs whitespace-pre-wrap font-mono">
                      {template.content}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Test */}
        {activeTab === 'test' && (
          <div className="p-6">
            <div className="max-w-lg mx-auto">
              <h4 className="text-white font-medium mb-4">Enviar Mensaje de Prueba</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm block mb-2">Número de WhatsApp</label>
                  <input
                    type="tel"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                             text-white placeholder-white/40 focus:bg-white/20 focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="text-white/60 text-sm block mb-2">Mensaje</label>
                  <textarea
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Escribe tu mensaje de prueba..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                             text-white placeholder-white/40 focus:bg-white/20 focus:border-white/40 
                             resize-none"
                  />
                </div>

                <button
                  onClick={sendTestMessage}
                  disabled={!testPhone || !testMessage || isSending}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white 
                           rounded-xl font-medium hover:shadow-lg transition-all 
                           disabled:opacity-50 disabled:cursor-not-allowed flex items-center 
                           justify-center gap-2"
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Mensaje de Prueba
                    </>
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-1">
                      Nota sobre el envío
                    </p>
                    <p className="text-white/60 text-xs">
                      Los mensajes se envían a través de la API oficial de WhatsApp Business. 
                      El número debe estar registrado y verificado en tu cuenta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WhatsAppIntegration
