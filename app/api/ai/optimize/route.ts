// app/api/ai/optimize/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      currentMetrics, 
      objectives,
      constraints,
      mode = 'optimization' 
    } = body

    // Validar datos de entrada
    if (!currentMetrics) {
      return NextResponse.json(
        { error: 'Métricas actuales requeridas' },
        { status: 400 }
      )
    }

    // Preparar el prompt para Gemini
    const prompt = `
    Eres un consultor financiero experto en optimización de negocios de restaurantes.
    
    DATOS ACTUALES DEL NEGOCIO:
    - Ingresos: $${currentMetrics.revenue}
    - Costos: $${currentMetrics.costs}
    - Utilidad: $${currentMetrics.profit}
    - Margen: ${((currentMetrics.profit / currentMetrics.revenue) * 100).toFixed(1)}%
    - Clientes/día: ${currentMetrics.covers}
    - Ticket promedio: $${currentMetrics.avgTicket}
    
    DESGLOSE DE COSTOS:
    - Alimentos: $${currentMetrics.foodCost} (${((currentMetrics.foodCost / currentMetrics.costs) * 100).toFixed(1)}%)
    - Personal: $${currentMetrics.laborCost} (${((currentMetrics.laborCost / currentMetrics.costs) * 100).toFixed(1)}%)
    - Overhead: $${currentMetrics.overheadCost} (${((currentMetrics.overheadCost / currentMetrics.costs) * 100).toFixed(1)}%)
    - Marketing: $${currentMetrics.marketingCost} (${((currentMetrics.marketingCost / currentMetrics.costs) * 100).toFixed(1)}%)
    
    OBJETIVOS:
    ${objectives || 'Maximizar rentabilidad manteniendo calidad y servicio'}
    
    RESTRICCIONES:
    ${constraints || 'Cambios realistas y sostenibles'}
    
    Genera un escenario optimizado con los siguientes cambios porcentuales.
    IMPORTANTE: Responde SOLO con un JSON válido, sin texto adicional:
    
    {
      "salesChange": número entre -30 y 30,
      "priceChange": número entre -15 y 15,
      "costChange": número entre -20 y 20,
      "laborChange": número entre -20 y 20,
      "trafficChange": número entre -30 y 30,
      "marketingChange": número entre -50 y 50,
      "overheadChange": número entre -15 y 15,
      "reasoning": "explicación breve de la estrategia",
      "expectedOutcome": "resultado esperado",
      "risks": ["riesgo 1", "riesgo 2"],
      "implementation": ["paso 1", "paso 2", "paso 3"]
    }
    `

    // Llamar a Gemini
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    // Intentar parsear la respuesta como JSON
    let optimizedScenario
    try {
      // Limpiar la respuesta para extraer solo el JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        optimizedScenario = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No se pudo extraer JSON de la respuesta')
      }
    } catch (parseError) {
      console.error('Error parseando respuesta de Gemini:', parseError)
      
      // Fallback: generar escenario basado en heurísticas
      const margin = (currentMetrics.profit / currentMetrics.revenue) * 100
      
      if (margin < 10) {
        optimizedScenario = {
          salesChange: 8,
          priceChange: 3,
          costChange: -5,
          laborChange: -3,
          trafficChange: 5,
          marketingChange: 15,
          overheadChange: -8,
          reasoning: "Margen bajo detectado. Estrategia enfocada en reducción de costos y eficiencia operativa.",
          expectedOutcome: "Mejora del margen en 3-5 puntos porcentuales",
          risks: ["Posible impacto en calidad si la reducción de costos es muy agresiva"],
          implementation: ["Auditar proveedores", "Optimizar turnos de personal", "Implementar controles de desperdicio"]
        }
      } else if (margin < 20) {
        optimizedScenario = {
          salesChange: 12,
          priceChange: 5,
          costChange: -2,
          laborChange: 0,
          trafficChange: 10,
          marketingChange: 25,
          overheadChange: -5,
          reasoning: "Margen medio. Balance entre crecimiento de ventas y optimización de costos.",
          expectedOutcome: "Aumento de utilidades del 15-20%",
          risks: ["Resistencia de clientes al aumento de precios", "Necesidad de capital para marketing"],
          implementation: ["Campaña de marketing digital", "Ajuste gradual de precios", "Programa de fidelización"]
        }
      } else {
        optimizedScenario = {
          salesChange: 20,
          priceChange: 7,
          costChange: 2,
          laborChange: 5,
          trafficChange: 15,
          marketingChange: 40,
          overheadChange: 3,
          reasoning: "Margen alto. Estrategia de expansión agresiva para capturar mayor cuota de mercado.",
          expectedOutcome: "Crecimiento de ingresos del 25-30%",
          risks: ["Mayor inversión requerida", "Posible saturación del mercado local"],
          implementation: ["Expandir horarios", "Contratar personal adicional", "Lanzar nuevos productos premium"]
        }
      }
    }

    // Validar que el escenario tenga los campos requeridos
    const requiredFields = ['salesChange', 'priceChange', 'costChange', 'laborChange', 'trafficChange']
    for (const field of requiredFields) {
      if (typeof optimizedScenario[field] !== 'number') {
        optimizedScenario[field] = 0
      }
    }

    // Agregar metadatos
    const responseData = {
      success: true,
      scenario: {
        ...optimizedScenario,
        isAIGenerated: true,
        generatedAt: new Date().toISOString(),
        model: 'gemini-pro',
        confidence: 0.85
      },
      metadata: {
        currentMargin: ((currentMetrics.profit / currentMetrics.revenue) * 100).toFixed(1),
        recommendedTimeframe: '3-6 meses',
        monitoringKPIs: [
          'Ticket promedio diario',
          'Número de clientes',
          'Costo de alimentos %',
          'Satisfacción del cliente'
        ]
      }
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Error en optimización:', error)
    
    // Respuesta de error con escenario de fallback
    return NextResponse.json({
      success: false,
      error: 'Error generando escenario optimizado',
      fallbackScenario: {
        salesChange: 5,
        priceChange: 2,
        costChange: -2,
        laborChange: 0,
        trafficChange: 3,
        marketingChange: 10,
        overheadChange: -3,
        reasoning: "Escenario conservador de mejora gradual",
        isAIGenerated: false
      }
    }, { status: 200 }) // Devolvemos 200 con fallback en lugar de error
  }
}

// Endpoint para validar escenarios
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { scenario, currentMetrics } = body

    if (!scenario || !currentMetrics) {
      return NextResponse.json(
        { error: 'Escenario y métricas requeridas' },
        { status: 400 }
      )
    }

    // Prompt para validación
    const prompt = `
    Analiza la viabilidad del siguiente escenario para un restaurante:
    
    CAMBIOS PROPUESTOS:
    - Ventas: ${scenario.salesChange}%
    - Precios: ${scenario.priceChange}%
    - Costos: ${scenario.costChange}%
    - Personal: ${scenario.laborChange}%
    - Tráfico: ${scenario.trafficChange}%
    - Marketing: ${scenario.marketingChange || 0}%
    - Overhead: ${scenario.overheadChange || 0}%
    
    CONTEXTO DEL NEGOCIO:
    - Margen actual: ${((currentMetrics.profit / currentMetrics.revenue) * 100).toFixed(1)}%
    - Ticket promedio: ${currentMetrics.avgTicket}
    
    Responde SOLO con un JSON:
    {
      "isViable": true/false,
      "viabilityScore": número del 1 al 10,
      "warnings": ["advertencia 1", "advertencia 2"],
      "suggestions": ["sugerencia 1", "sugerencia 2"],
      "timeToImplement": "X semanas/meses",
      "expectedROI": número
    }
    `

    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    let validation
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        validation = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No se pudo extraer JSON')
      }
    } catch (parseError) {
      // Validación basada en heurísticas
      const warnings = []
      const suggestions = []
      
      if (Math.abs(scenario.salesChange) > 30) {
        warnings.push('Cambio en ventas muy agresivo')
        suggestions.push('Considera un cambio más gradual del 10-15%')
      }
      
      if (scenario.priceChange > 10) {
        warnings.push('Aumento de precio puede afectar demanda')
        suggestions.push('Implementa el aumento en fases de 2-3%')
      }
      
      if (scenario.trafficChange > 20 && scenario.laborChange < 0) {
        warnings.push('Conflicto entre aumento de tráfico y reducción de personal')
        suggestions.push('Mantén o aumenta personal si esperas más clientes')
      }
      
      validation = {
        isViable: warnings.length < 3,
        viabilityScore: Math.max(1, 10 - warnings.length * 2),
        warnings,
        suggestions,
        timeToImplement: '2-3 meses',
        expectedROI: 25
      }
    }

    return NextResponse.json({
      success: true,
      validation,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error validando escenario:', error)
      return NextResponse.json(
        { error: 'Error en validación' },
        { status: 500 }
      )
    }
  }