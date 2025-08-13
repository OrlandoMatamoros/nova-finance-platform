// app/api/ai/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GeminiService } from '@/lib/services/gemini'

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(request: NextRequest) {
  console.log('API Route /api/ai/analyze called')
  
  try {
    const body = await request.json()
    const { prompt, mode = 'basic', period = 'month', test } = body

    // Si es una llamada de test
    if (test) {
      return NextResponse.json({ 
        success: true, 
        message: 'API route is working' 
      })
    }

    if (!prompt) {
      return NextResponse.json(
        { 
          success: false,
          error: 'El prompt es requerido' 
        },
        { status: 400 }
      )
    }

    // Verificar API key
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
    
    if (!apiKey) {
      console.error('No API key found')
      return NextResponse.json({
        success: true,
        response: generateDemoAnalysis(mode, period),
        summary: generateSummary(mode, period),
        demo: true
      })
    }

    // Enriquecer el prompt con instrucciones específicas según el modo
    const enrichedPrompt = enrichPromptByMode(prompt, mode, period)

    // Usar el servicio de Gemini
    const gemini = new GeminiService(apiKey)
    const result = await gemini.generateContent(enrichedPrompt)

    if (!result.success) {
      console.error('Gemini service error:', result.error)
      return NextResponse.json({
        success: true,
        response: generateDemoAnalysis(mode, period),
        summary: generateSummary(mode, period),
        demo: true,
        originalError: result.error
      })
    }

    // Generar resumen del análisis
    const summary = await generateAISummary(result.response || '', mode, period, gemini)

    return NextResponse.json({
      success: true,
      response: result.response,
      summary: summary,
      mode: mode,
      period: period,
      demo: false
    })

  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json({
      success: true,
      response: generateDemoAnalysis('basic', 'month'),
      summary: generateSummary('basic', 'month'),
      demo: true,
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

// Enriquecer el prompt según el modo de análisis
function enrichPromptByMode(basePrompt: string, mode: string, period: string): string {
  const periodText = {
    day: 'del día de hoy',
    week: 'de los últimos 7 días',
    month: 'del último mes',
    quarter: 'del último trimestre',
    year: 'del último año'
  }[period] || 'del período seleccionado'

  const modeInstructions = {
    basic: `
      MODO: ANÁLISIS BÁSICO OPERATIVO
      Genera exactamente 5 insights operativos ${periodText}.
      Formato requerido para cada insight:
      [TIPO]: success/warning/opportunity/info
      [TÍTULO]: Título corto y claro (máx 6 palabras)
      [DESCRIPCIÓN]: Descripción con números específicos (20-30 palabras)
      [IMPACTO]: high/medium/low
      [MÉTRICA]: Número o porcentaje clave
      [ACCIÓN]: true/false

      Enfócate en:
      1. KPIs operativos inmediatos
      2. Alertas de costos o eficiencia
      3. Oportunidades de mejora rápida
      4. Métricas de rendimiento actual
      5. Acciones correctivas urgentes
    `,
    situational: `
      MODO: ANÁLISIS SITUACIONAL Y TENDENCIAS
      Genera exactamente 6 insights situacionales ${periodText}.
      Formato requerido para cada insight:
      [TIPO]: trend/warning/opportunity/info
      [TÍTULO]: Situación o tendencia (máx 6 palabras)
      [DESCRIPCIÓN]: Contexto, causas y efectos (25-35 palabras)
      [IMPACTO]: high/medium/low
      [MÉTRICA]: Variación o tendencia porcentual
      [TENDENCIA]: up/down/stable
      [ACCIÓN]: Acción recomendada específica

      Analiza:
      1. Tendencias de ingresos y costos ${periodText}
      2. Cambios en comportamiento de clientes
      3. Variaciones estacionales o cíclicas
      4. Comparación con períodos anteriores
      5. Factores externos que afectan el negocio
      6. Proyección para el próximo período
    `,
    strategic: `
      MODO: ANÁLISIS ESTRATÉGICO PROFUNDO
      Genera exactamente 7 insights estratégicos para planificación ${periodText}.
      Formato requerido para cada insight:
      [TIPO]: strategy/opportunity/trend/recommendation
      [TÍTULO]: Estrategia o iniciativa (máx 8 palabras)
      [DESCRIPCIÓN]: Plan detallado con métricas y proyecciones (35-45 palabras)
      [IMPACTO]: high/medium
      [MÉTRICA]: ROI esperado o impacto proyectado
      [TIMEFRAME]: Corto plazo (1-3 meses)/Mediano plazo (3-6 meses)/Largo plazo (6-12 meses)
      [CONFIANZA]: 70-95 (porcentaje de confianza)
      [RECURSOS]: Recursos necesarios para implementación

      Desarrolla:
      1. Estrategia integral para alcanzar objetivos
      2. Plan de optimización de márgenes
      3. Roadmap de crecimiento de clientes
      4. Análisis competitivo y posicionamiento
      5. Oportunidades de innovación o diversificación
      6. Plan de implementación con hitos
      7. Métricas de seguimiento y KPIs
    `
  }

  return `${basePrompt}\n\n${modeInstructions[mode] || modeInstructions.basic}`
}

// Generar resumen del análisis con IA
async function generateAISummary(
  analysis: string, 
  mode: string, 
  period: string,
  gemini: GeminiService
): Promise<string> {
  const summaryPrompt = `
    Basándote en el siguiente análisis, genera un resumen ejecutivo de 3-4 párrafos:
    
    ${analysis}
    
    El resumen debe incluir:
    1. Párrafo 1: Estado general del negocio y principales fortalezas
    2. Párrafo 2: Principales desafíos y áreas de mejora
    3. Párrafo 3: Recomendaciones prioritarias y próximos pasos
    ${mode === 'strategic' ? '4. Párrafo 4: Proyección y oportunidades a largo plazo' : ''}
    
    Tono: Profesional pero accesible, con datos específicos.
    Longitud: ${mode === 'strategic' ? '150-200' : '100-150'} palabras total.
  `

  const result = await gemini.generateContent(summaryPrompt)
  
  if (result.success && result.response) {
    return result.response
  }
  
  // Fallback a resumen generado localmente
  return generateSummary(mode, period)
}

// Generar análisis de demo mejorado
function generateDemoAnalysis(mode: string, period: string): string {
  const analyses = {
    basic: `
[TIPO]: success
[TÍTULO]: Margen de Ganancia Saludable
[DESCRIPCIÓN]: Tu margen del 29.4% se mantiene cerca del objetivo del 30%. Los costos están controlados este ${period}.
[IMPACTO]: high
[MÉTRICA]: 29.4%
[ACCIÓN]: false

[TIPO]: warning
[TÍTULO]: Costos Laborales Elevados
[DESCRIPCIÓN]: Los costos de personal (28%) exceden el objetivo del 25% para el ${period}. Revisa horarios en horas valle.
[IMPACTO]: medium
[MÉTRICA]: 28%
[ACCIÓN]: true

[TIPO]: opportunity
[TÍTULO]: Potencial en Ticket Promedio
[DESCRIPCIÓN]: Aumentar $5 el ticket promedio generaría $10,365 adicionales en el ${period}.
[IMPACTO]: high
[MÉTRICA]: +$10.4K
[ACCIÓN]: true

[TIPO]: info
[TÍTULO]: Crecimiento de Clientes
[DESCRIPCIÓN]: Base de clientes creció 15% en el ${period}. Momento ideal para programa de fidelización.
[IMPACTO]: medium
[MÉTRICA]: +15%
[ACCIÓN]: true

[TIPO]: opportunity
[TÍTULO]: Optimización de Inventario
[DESCRIPCIÓN]: Reducir inventario lento 20% liberaría $8,000 en capital de trabajo.
[IMPACTO]: medium
[MÉTRICA]: $8K
[ACCIÓN]: true
    `,
    situational: `
[TIPO]: trend
[TÍTULO]: Tendencia de Ingresos Positiva
[DESCRIPCIÓN]: Ingresos crecieron 12% vs ${period} anterior. Viernes y sábados generan 45% del total. Mantén promociones exitosas.
[IMPACTO]: high
[MÉTRICA]: +12%
[TENDENCIA]: up
[ACCIÓN]: Reforzar estrategias de fin de semana

[TIPO]: warning
[TÍTULO]: Producto en Declive
[DESCRIPCIÓN]: Pizza Margherita bajó 18% en ventas durante el ${period}. Clientes prefieren opciones más saludables. Considera renovación del menú.
[IMPACTO]: medium
[MÉTRICA]: -18%
[TENDENCIA]: down
[ACCIÓN]: Renovar receta o crear promoción especial

[TIPO]: trend
[TÍTULO]: Cambio en Preferencias
[DESCRIPCIÓN]: Productos premium suben 22% mientras básicos bajan 8%. Clientes buscan experiencias gastronómicas superiores en el ${period}.
[IMPACTO]: high
[MÉTRICA]: +22%
[TENDENCIA]: up
[ACCIÓN]: Expandir línea premium

[TIPO]: opportunity
[TÍTULO]: Horario Pico Identificado
[DESCRIPCIÓN]: 12-2pm y 7-9pm concentran 65% de ventas diarias. Oportunidad de happy hour 3-5pm para el próximo ${period}.
[IMPACTO]: high
[MÉTRICA]: 65%
[TENDENCIA]: stable
[ACCIÓN]: Implementar happy hour estratégico

[TIPO]: info
[TÍTULO]: Estacionalidad Detectada
[DESCRIPCIÓN]: El ${period} muestra patrón estacional típico. Prepararse para aumento 20% en demanda próximas festividades.
[IMPACTO]: medium
[MÉTRICA]: +20%
[TENDENCIA]: up
[ACCIÓN]: Aumentar inventario y personal temporal

[TIPO]: trend
[TÍTULO]: Competencia Activa
[DESCRIPCIÓN]: 3 nuevos competidores en la zona este ${period}. Tu participación de mercado se mantiene en 18% gracias a fidelidad de clientes.
[IMPACTO]: medium
[MÉTRICA]: 18%
[TENDENCIA]: stable
[ACCIÓN]: Fortalecer programa de lealtad
    `,
    strategic: `
[TIPO]: strategy
[TÍTULO]: Plan Integral de Crecimiento 30%
[DESCRIPCIÓN]: Para alcanzar $200K mensuales, implementa: 1) Menú premium (+$15K), 2) Delivery propio (+$12K), 3) Catering corporativo (+$10K). ROI proyectado 180% en 6 meses.
[IMPACTO]: high
[MÉTRICA]: +30% ingresos
[TIMEFRAME]: Mediano plazo (3-6 meses)
[CONFIANZA]: 85
[RECURSOS]: $15K inversión inicial, 2 empleados adicionales

[TIPO]: strategy
[TÍTULO]: Optimización de Margen al 35%
[DESCRIPCIÓN]: Renegociar con 3 proveedores principales (ahorro 3%), automatizar inventario (ahorro 2%), ajustar porciones sin afectar calidad (ahorro 1.6%). Margen objetivo alcanzable en ${period}.
[IMPACTO]: high
[MÉTRICA]: +5.6% margen
[TIMEFRAME]: Corto plazo (1-3 meses)
[CONFIANZA]: 78
[RECURSOS]: Sistema POS avanzado, consultor de costos

[TIPO]: opportunity
[TÍTULO]: Expansión Digital y Delivery
[DESCRIPCIÓN]: Mercado delivery crece 25% anual. Implementar app propia + kitchen virtual puede capturar $25K adicionales/mes. Competencia tiene 40% ventas en digital, tú solo 15%.
[IMPACTO]: high
[MÉTRICA]: +$25K/mes
[TIMEFRAME]: Mediano plazo (3-6 meses)
[CONFIANZA]: 82
[RECURSOS]: $8K desarrollo app, acuerdo con riders

[TIPO]: strategy
[TÍTULO]: Programa de Fidelización Inteligente
[DESCRIPCIÓN]: CRM + programa puntos puede aumentar frecuencia 35% y ticket 20%. Con 2,073 clientes actuales, potencial de $31K adicionales/mes. Benchmarks indican retención del 75% vs 45% actual.
[IMPACTO]: high
[MÉTRICA]: +35% frecuencia
[TIMEFRAME]: Corto plazo (1-3 meses)
[CONFIANZA]: 88
[RECURSOS]: CRM ($99/mes), sistema de puntos

[TIPO]: trend
[TÍTULO]: Posicionamiento Premium vs Competencia
[DESCRIPCIÓN]: Tu ticket ($76) está 7% bajo competencia premium ($82). Oportunidad de reposicionamiento con renovación de marca y experiencia. Captura adicional 5% mercado = $40K/mes.
[IMPACTO]: high
[MÉTRICA]: +5% mercado
[TIMEFRAME]: Largo plazo (6-12 meses)
[CONFIANZA]: 72
[RECURSOS]: Rebranding ($5K), renovación parcial local

[TIPO]: recommendation
[TÍTULO]: Diversificación con Productos Preparados
[DESCRIPCIÓN]: Línea de productos preparados (salsas, aderezos) puede generar ingreso pasivo $15K/mes. Inversión inicial $10K, break-even mes 4. Casos éxito similares muestran márgenes 45%.
[IMPACTO]: medium
[MÉTRICA]: +$15K/mes
[TIMEFRAME]: Mediano plazo (3-6 meses)
[CONFIANZA]: 75
[RECURSOS]: Cocina industrial certificada, empaque, marketing

[TIPO]: strategy
[TÍTULO]: Roadmap Trimestral de Implementación
[DESCRIPCIÓN]: Q1: Optimización costos y fidelización. Q2: Lanzamiento delivery y menú premium. Q3: Expansión productos preparados. Q4: Evaluación y scaling. Proyección: $250K/mes en 12 meses.
[IMPACTO]: high
[MÉTRICA]: +58% anual
[TIMEFRAME]: Largo plazo (6-12 meses)
[CONFIANZA]: 80
[RECURSOS]: Team dedicado, $30K inversión total escalonada
    `
  }

  return analyses[mode] || analyses.basic
}

// Generar resumen ejecutivo
function generateSummary(mode: string, period: string): string {
  const summaries = {
    basic: `El negocio muestra un desempeño operativo sólido durante el ${period}, con un margen de ganancia del 29.4% que se acerca al objetivo del 30%. Los ingresos de $158K demuestran estabilidad, aunque existen oportunidades claras de mejora. La base de 2,073 clientes ha crecido un 15%, indicando una tendencia positiva en la captación.

Los principales desafíos identificados son los costos laborales elevados (28% vs objetivo 25%) y el potencial no aprovechado en el ticket promedio. Con ajustes operativos específicos, el negocio puede liberar $8K en capital de trabajo y generar $10K adicionales mensuales.

Las recomendaciones prioritarias incluyen optimizar horarios del personal en horas valle, implementar estrategias de upselling para aumentar el ticket promedio en $5, y capitalizar el crecimiento de clientes con un programa de fidelización estructurado.`,
    
    situational: `El análisis situacional del ${period} revela tendencias mixtas pero mayormente positivas. Los ingresos muestran un crecimiento del 12% respecto al período anterior, con una concentración significativa en viernes y sábados (45% del total). Se identifican cambios importantes en las preferencias del consumidor, con productos premium creciendo 22% mientras los básicos declinan 8%.

Alertas importantes incluyen el declive del 18% en Pizza Margherita y la entrada de 3 nuevos competidores en la zona. Sin embargo, la participación de mercado se mantiene estable en 18% gracias a la fidelidad de los clientes existentes. Los patrones de consumo muestran picos claros entre 12-2pm y 7-9pm.

Para capitalizar estas tendencias, se recomienda renovar productos en declive, implementar happy hour estratégico en horarios valle (3-5pm), expandir la línea premium respondiendo a la demanda, y fortalecer el programa de lealtad para mantener la ventaja competitiva. La preparación para la estacionalidad próxima es crítica.`,
    
    strategic: `El análisis estratégico proyecta un camino claro hacia el objetivo de $200K mensuales, requiriendo un crecimiento del 30% sobre los $158K actuales. Con la implementación sistemática del plan propuesto, este objetivo es alcanzable en 6 meses con un ROI proyectado del 180%. La estrategia se basa en tres pilares: expansión premium, digitalización/delivery, y diversificación de ingresos.

Los desafíos principales incluyen optimizar el margen del 29.4% actual al 35% objetivo y competir efectivamente con el 40% de ventas digitales de la competencia (vs 15% actual). Sin embargo, las oportunidades son significativas: el mercado delivery crece 25% anual, existe espacio para reposicionamiento premium, y la base de clientes actual permite implementar un programa de fidelización con potencial de $31K adicionales mensuales.

El roadmap trimestral propone: Q1 enfocado en optimización de costos y fidelización (inversión $5K), Q2 lanzamiento de delivery y menú premium ($10K), Q3 expansión con productos preparados ($10K), y Q4 evaluación y scaling ($5K). La inversión total de $30K se recupera en 4 meses.

La proyección a 12 meses indica ingresos de $250K mensuales (+58%), con márgenes del 35% y una base de clientes expandida a 3,500. Los factores críticos de éxito incluyen la ejecución disciplinada del plan, mantener la calidad durante la expansión, y la adaptación ágil a la respuesta del mercado.`
  }

  return summaries[mode] || summaries.basic
}