// app/api/ai/goalplan/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentMetrics, targetGoal, selectedPath, timeframe } = body

    // Validar datos de entrada
    if (!currentMetrics || !targetGoal || !selectedPath) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      )
    }

    // Preparar el prompt para Gemini
    const prompt = `
    Eres un consultor financiero experto especializado en estrategia de negocios para restaurantes y PYMES.
    
    SITUACIÓN ACTUAL DEL NEGOCIO:
    - Ingresos mensuales: $${currentMetrics.revenue.toLocaleString()}
    - Costos mensuales: $${currentMetrics.costs.toLocaleString()}
    - Utilidad mensual: $${currentMetrics.profit.toLocaleString()}
    - Margen de utilidad: ${currentMetrics.margin.toFixed(1)}%
    - Clientes mensuales: ${currentMetrics.customers.toLocaleString()}
    - Ticket promedio: $${currentMetrics.avgTicket.toFixed(2)}
    
    OBJETIVO A ALCANZAR:
    - Métrica objetivo: ${targetGoal.metric}
    - Valor actual: ${targetGoal.currentValue.toLocaleString()}
    - Valor objetivo: ${targetGoal.targetValue.toLocaleString()}
    - Plazo: ${timeframe} días
    
    ESTRATEGIA SELECCIONADA:
    - Nombre: ${selectedPath.strategy}
    - Descripción: ${selectedPath.description}
    - Cambios principales:
      ${selectedPath.changes.prices ? `• Precios: ${selectedPath.changes.prices.toFixed(1)}%` : ''}
      ${selectedPath.changes.volume ? `• Volumen: ${selectedPath.changes.volume.toFixed(1)}%` : ''}
      ${selectedPath.changes.costs ? `• Costos: ${selectedPath.changes.costs.toFixed(1)}%` : ''}
      ${selectedPath.changes.efficiency ? `• Eficiencia: ${selectedPath.changes.efficiency.toFixed(1)}%` : ''}
    - Inversión requerida: $${selectedPath.requiredInvestment.toLocaleString()}
    - ROI esperado: ${selectedPath.roi.toFixed(1)}%
    - Nivel de riesgo: ${selectedPath.risk}
    
    Por favor, genera un plan de acción DETALLADO y ESPECÍFICO que incluya:
    
    1. PLAN DE IMPLEMENTACIÓN SEMANAL (primeras 4 semanas):
       - Acciones específicas día a día para la primera semana
       - Hitos semanales para las siguientes 3 semanas
       - Responsables sugeridos para cada acción
       - Recursos necesarios
    
    2. KPIs A MONITOREAR:
       - Métricas clave diarias
       - Métricas semanales
       - Métricas mensuales
       - Valores objetivo para cada KPI
       - Señales de alerta temprana
    
    3. RECURSOS Y PRESUPUESTO:
       - Desglose detallado de la inversión
       - Cronograma de desembolsos
       - ROI proyectado mes a mes
       - Fuentes de financiamiento sugeridas
    
    4. RIESGOS Y MITIGACIONES:
       - Top 5 riesgos específicos
       - Probabilidad e impacto de cada riesgo
       - Plan de mitigación para cada uno
       - Plan de contingencia si falla la estrategia
    
    5. QUICK WINS (primeros 7 días):
       - 3-5 acciones de impacto inmediato
       - Costo cero o mínimo
       - Resultados medibles en 7 días
    
    6. HERRAMIENTAS Y TECNOLOGÍA:
       - Software recomendado
       - Automatizaciones sugeridas
       - Integraciones necesarias
       - Capacitación requerida
    
    7. COMUNICACIÓN Y CHANGE MANAGEMENT:
       - Cómo comunicar los cambios al equipo
       - Cómo comunicar a los clientes (si aplica)
       - Manejo de resistencia al cambio
       - Celebración de logros
    
    Responde en formato JSON estructurado con todas las secciones mencionadas.
    Sé MUY específico y práctico. Evita generalidades.
    Incluye ejemplos concretos, scripts de comunicación, templates, etc.
    `

    // Llamar a Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Intentar parsear la respuesta como JSON
    let detailedPlan
    try {
      // Limpiar la respuesta de posibles markdown backticks
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      detailedPlan = JSON.parse(cleanedText)
    } catch (parseError) {
      // Si no se puede parsear, estructurar la respuesta
      detailedPlan = {
        success: true,
        plan: {
          implementation: {
            week1: {
              daily: generateDailyPlan(selectedPath),
              resources: ['Equipo de gestión', 'Sistema de análisis', 'Presupuesto inicial']
            },
            weeks2to4: generateWeeklyMilestones(selectedPath, timeframe)
          },
          kpis: generateKPIs(selectedPath, currentMetrics, targetGoal),
          budget: generateBudgetBreakdown(selectedPath),
          risks: generateRiskMatrix(selectedPath),
          quickWins: generateQuickWins(selectedPath, currentMetrics),
          tools: generateToolRecommendations(selectedPath),
          communication: generateCommunicationPlan(selectedPath),
          rawAnalysis: text // Guardar el análisis original de Gemini
        }
      }
    }

    return NextResponse.json({
      success: true,
      plan: detailedPlan,
      summary: generateExecutiveSummary(selectedPath, targetGoal, timeframe)
    })

  } catch (error) {
    console.error('Error en goal planning:', error)
    
    // Reintentar obtener el body en caso de error
    let body
    try {
      body = await request.json()
    } catch {
      body = {}
    }

    // Respuesta de fallback con plan generado localmente
    return NextResponse.json({
      success: true,
      plan: generateFallbackPlan(body),
      summary: 'Plan generado con algoritmos locales (Gemini no disponible)'
    })
  }
}

// Funciones auxiliares para generar componentes del plan

function generateDailyPlan(path: any) {
  return [
    {
      day: 1,
      actions: [
        'Reunión de kickoff con el equipo directivo',
        'Definir responsables y roles',
        'Comunicar la visión y objetivos'
      ]
    },
    {
      day: 2,
      actions: [
        'Auditoría de estado actual',
        'Identificar quick wins',
        'Configurar herramientas de medición'
      ]
    },
    {
      day: 3,
      actions: [
        'Implementar primera acción de mejora',
        'Capacitar al personal clave',
        'Establecer sistema de reporte diario'
      ]
    },
    {
      day: 4,
      actions: [
        'Lanzar piloto de cambios',
        'Monitorear primeras métricas',
        'Ajustar según feedback inicial'
      ]
    },
    {
      day: 5,
      actions: [
        'Evaluar resultados preliminares',
        'Documentar aprendizajes',
        'Preparar reporte semanal'
      ]
    },
    {
      day: 6,
      actions: [
        'Reunión de revisión con stakeholders',
        'Ajustar plan según resultados',
        'Comunicar próximos pasos'
      ]
    },
    {
      day: 7,
      actions: [
        'Consolidar cambios de la semana',
        'Celebrar primeros logros',
        'Planificar semana 2'
      ]
    }
  ]
}

function generateWeeklyMilestones(path: any, timeframe: number) {
  const weeks = Math.ceil(timeframe / 7)
  return Array.from({ length: Math.min(3, weeks - 1) }, (_, i) => ({
    week: i + 2,
    milestone: path.monthlyMilestones?.[i]?.actions?.[0] || `Consolidar fase ${i + 2}`,
    target: `Alcanzar ${25 * (i + 2)}% del objetivo`,
    actions: path.monthlyMilestones?.[i]?.actions || [
      'Continuar implementación',
      'Monitorear y ajustar',
      'Escalar lo que funciona'
    ]
  }))
}

function generateKPIs(path: any, current: any, target: any) {
  return {
    daily: [
      { name: 'Ventas del día', target: current.revenue / 30 * 1.1, unit: '$' },
      { name: 'Clientes atendidos', target: Math.round(current.customers / 30 * 1.1), unit: '' },
      { name: 'Ticket promedio', target: current.avgTicket * 1.05, unit: '$' }
    ],
    weekly: [
      { name: 'Revenue semanal', target: current.revenue / 4 * 1.15, unit: '$' },
      { name: 'Margen de utilidad', target: current.margin + 1, unit: '%' },
      { name: 'Satisfacción cliente', target: 85, unit: '%' }
    ],
    monthly: [
      { name: target.metric, target: target.targetValue, unit: getUnit(target.metric) },
      { name: 'ROI acumulado', target: path.roi, unit: '%' },
      { name: 'Eficiencia operativa', target: 90, unit: '%' }
    ],
    alerts: [
      'Ventas diarias < 90% del objetivo',
      'Margen < valor inicial',
      'Quejas de clientes > 5%',
      'Costos > presupuesto + 10%'
    ]
  }
}

function generateBudgetBreakdown(path: any) {
  const total = path.requiredInvestment
  return {
    total,
    breakdown: [
      { category: 'Marketing y ventas', amount: total * 0.3, percentage: 30 },
      { category: 'Tecnología y sistemas', amount: total * 0.25, percentage: 25 },
      { category: 'Capacitación', amount: total * 0.15, percentage: 15 },
      { category: 'Consultoría', amount: total * 0.15, percentage: 15 },
      { category: 'Contingencia', amount: total * 0.15, percentage: 15 }
    ],
    timeline: [
      { month: 1, amount: total * 0.5, description: 'Inversión inicial' },
      { month: 2, amount: total * 0.3, description: 'Optimización y escala' },
      { month: 3, amount: total * 0.2, description: 'Consolidación' }
    ],
    funding: [
      'Capital de trabajo existente',
      'Línea de crédito bancaria',
      'Reinversión de utilidades',
      'Financiamiento alternativo'
    ]
  }
}

function generateRiskMatrix(path: any) {
  const risks = [
    {
      risk: 'Resistencia del mercado a cambios de precio',
      probability: path.changes.prices > 10 ? 'Alta' : 'Media',
      impact: 'Alto',
      mitigation: 'Comunicación de valor, implementación gradual, segmentación de clientes'
    },
    {
      risk: 'Capacidad operativa insuficiente',
      probability: path.changes.volume > 30 ? 'Alta' : 'Baja',
      impact: 'Medio',
      mitigation: 'Contratación temporal, automatización, optimización de procesos'
    },
    {
      risk: 'Competencia agresiva',
      probability: 'Media',
      impact: 'Alto',
      mitigation: 'Diferenciación, fidelización, respuesta rápida'
    },
    {
      risk: 'Problemas de flujo de caja',
      probability: path.requiredInvestment > 30000 ? 'Media' : 'Baja',
      impact: 'Alto',
      mitigation: 'Línea de crédito, gestión de cobros, control de gastos'
    },
    {
      risk: 'Falta de adopción tecnológica',
      probability: path.strategy.includes('Digital') ? 'Media' : 'Baja',
      impact: 'Medio',
      mitigation: 'Capacitación intensiva, soporte 24/7, implementación gradual'
    }
  ]
  
  return {
    risks,
    contingencyPlan: {
      trigger: 'KPIs < 70% del objetivo por 2 semanas consecutivas',
      actions: [
        'Reunión de crisis con stakeholders',
        'Revisión completa de estrategia',
        'Activar plan B (estrategia alternativa)',
        'Considerar pivote o ajuste de objetivos'
      ]
    }
  }
}

function generateQuickWins(path: any, current: any) {
  return [
    {
      action: 'Optimizar horarios de mayor demanda',
      cost: 0,
      impact: 'Aumento 5% en ventas',
      timeline: '3 días'
    },
    {
      action: 'Revisar y ajustar 3 productos de bajo margen',
      cost: 0,
      impact: 'Mejora 2% en margen',
      timeline: '2 días'
    },
    {
      action: 'Implementar upselling en punto de venta',
      cost: 100,
      impact: 'Aumento 8% ticket promedio',
      timeline: '5 días'
    },
    {
      action: 'Lanzar promoción en redes sociales',
      cost: 200,
      impact: '15% más tráfico',
      timeline: '1 día'
    },
    {
      action: 'Renegociar términos con 2 proveedores principales',
      cost: 0,
      impact: 'Reducción 3% en costos',
      timeline: '7 días'
    }
  ]
}

function generateToolRecommendations(path: any) {
  return {
    essential: [
      {
        tool: 'Square/Toast POS',
        purpose: 'Gestión de ventas y análisis',
        cost: '$60-200/mes',
        priority: 'Alta'
      },
      {
        tool: 'Google Analytics',
        purpose: 'Análisis de tráfico y conversión',
        cost: 'Gratis',
        priority: 'Alta'
      },
      {
        tool: 'Whatsapp Business API',
        purpose: 'Comunicación con clientes',
        cost: '$50/mes',
        priority: 'Media'
      }
    ],
    recommended: [
      {
        tool: 'Tableau/PowerBI',
        purpose: 'Visualización avanzada de datos',
        cost: '$70/mes',
        priority: 'Media'
      },
      {
        tool: 'Mailchimp',
        purpose: 'Email marketing',
        cost: '$30/mes',
        priority: 'Baja'
      }
    ],
    automation: [
      'Reportes automáticos diarios',
      'Alertas de inventario bajo',
      'Respuestas automáticas en redes',
      'Facturación electrónica'
    ]
  }
}

function generateCommunicationPlan(path: any) {
  return {
    internal: {
      kickoff: {
        audience: 'Todo el equipo',
        message: 'Visión, objetivos y beneficios para todos',
        format: 'Reunión presencial + documento',
        timing: 'Día 1'
      },
      updates: {
        frequency: 'Semanal',
        format: 'Dashboard + reunión corta',
        responsible: 'Gerente de proyecto'
      },
      training: {
        topics: ['Nuevos procesos', 'Herramientas', 'KPIs'],
        format: 'Talleres prácticos',
        duration: '2-4 horas por semana'
      }
    },
    external: {
      customers: {
        message: 'Mejoras en servicio y valor',
        channels: ['Redes sociales', 'Email', 'En tienda'],
        timing: 'Gradual, según implementación'
      },
      suppliers: {
        message: 'Optimización de relación comercial',
        format: 'Reuniones individuales',
        timing: 'Semana 1-2'
      }
    },
    resistance: {
      identification: 'Encuestas anónimas, observación',
      handling: [
        'Escucha activa',
        'Involucrar en decisiones',
        'Mostrar beneficios personales',
        'Celebrar pequeños logros'
      ]
    },
    celebration: {
      milestones: [
        'Primera semana completada',
        '25% del objetivo alcanzado',
        '50% del objetivo alcanzado',
        'Objetivo final logrado'
      ],
      format: ['Reconocimiento público', 'Bonos', 'Celebración equipo']
    }
  }
}

function generateExecutiveSummary(path: any, target: any, timeframe: number) {
  return {
    headline: `Alcanzar ${target.metric}: ${target.targetValue.toLocaleString()} en ${timeframe} días`,
    strategy: path.strategy,
    keyChanges: Object.entries(path.changes)
      .filter(([_, value]) => value !== undefined && value !== 0)
      .map(([key, value]) => `${key}: ${value}%`),
    investment: path.requiredInvestment,
    expectedROI: path.roi,
    confidence: path.feasibility,
    criticalSuccess: [
      'Ejecución disciplinada del plan',
      'Monitoreo diario de KPIs',
      'Ajustes rápidos según resultados',
      'Compromiso total del equipo'
    ]
  }
}

function generateFallbackPlan(body: any) {
  const { currentMetrics, targetGoal, selectedPath, timeframe } = body
  
  return {
    implementation: {
      week1: {
        daily: generateDailyPlan(selectedPath),
        resources: ['Equipo', 'Presupuesto', 'Herramientas']
      },
      weeks2to4: generateWeeklyMilestones(selectedPath, timeframe)
    },
    kpis: generateKPIs(selectedPath, currentMetrics, targetGoal),
    budget: generateBudgetBreakdown(selectedPath),
    risks: generateRiskMatrix(selectedPath),
    quickWins: generateQuickWins(selectedPath, currentMetrics),
    tools: generateToolRecommendations(selectedPath),
    communication: generateCommunicationPlan(selectedPath)
  }
}

function getUnit(metric: string): string {
  switch(metric) {
    case 'revenue':
    case 'profit':
      return '$'
    case 'margin':
      return '%'
    case 'customers':
      return ''
    default:
      return ''
  }
}