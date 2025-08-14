// app/api/ai/solver/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { 
      optimalSolution, 
      businessContext, 
      objectives, 
      tradeOffs,
      industry = 'restaurant' 
    } = await request.json()

    // Validar datos requeridos
    if (!optimalSolution || !objectives) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Preparar el prompt para Gemini
    const prompt = `
Como consultor experto en optimización financiera para ${industry}, analiza esta solución de optimización multi-objetivo:

CONTEXTO DEL NEGOCIO:
${JSON.stringify(businessContext, null, 2)}

OBJETIVOS DE OPTIMIZACIÓN:
${objectives.map((obj: any) => `- ${obj.name}: ${obj.type} (peso: ${obj.weight}%)`).join('\n')}

SOLUCIÓN ÓPTIMA ENCONTRADA:
${JSON.stringify(optimalSolution, null, 2)}

TRADE-OFFS IDENTIFICADOS:
${tradeOffs?.map((t: any) => `- ${t.objective1} vs ${t.objective2}: correlación ${t.correlation.toFixed(2)}`).join('\n') || 'No especificados'}

Por favor proporciona:

1. INTERPRETACIÓN EJECUTIVA (2-3 frases)
Explica en términos simples qué significa esta solución para el negocio.

2. ANÁLISIS DE VIABILIDAD
- ¿Es realista implementar estos cambios?
- ¿Qué obstáculos principales podrían surgir?
- Nivel de dificultad: [Bajo/Medio/Alto]

3. QUICK WINS (máximo 3)
Acciones inmediatas con alto impacto y bajo esfuerzo.

4. PLAN DE IMPLEMENTACIÓN FASADO
Fase 1 (Semana 1-2): [Acciones]
Fase 2 (Semana 3-4): [Acciones]
Fase 3 (Mes 2): [Acciones]

5. RIESGOS ESPECÍFICOS DEL SECTOR
Identifica 2-3 riesgos particulares para un ${industry}.

6. MÉTRICAS DE SEGUIMIENTO
3 KPIs clave para monitorear el éxito.

7. INVERSIÓN ESTIMADA
Rango aproximado de inversión necesaria.

Responde en formato JSON con estas secciones. Sé específico y práctico.`

    // Configurar el modelo
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    })

    // Generar respuesta
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Intentar parsear como JSON
    let structuredResponse
    try {
      // Limpiar el texto para extraer JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        structuredResponse = JSON.parse(jsonMatch[0])
      } else {
        // Si no es JSON, estructurar la respuesta
        structuredResponse = parseTextResponse(text)
      }
    } catch (parseError) {
      // Fallback: estructurar la respuesta manualmente
      structuredResponse = parseTextResponse(text)
    }

    // Agregar metadatos
    const enrichedResponse = {
      ...structuredResponse,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'gemini-pro',
        confidence: calculateConfidence(optimalSolution),
        processingTime: (() => {
          const startTime = Number(request.headers.get('x-start-time'))
          return isNaN(startTime) ? 0 : Date.now() - startTime
        })()
      }
    }

    return NextResponse.json(enrichedResponse)

  } catch (error) {
    console.error('Error en solver API:', error)
    
    // Respuesta de fallback con datos útiles
    return NextResponse.json({
      interpretation: 'La optimización busca equilibrar múltiples objetivos del negocio para maximizar el rendimiento general.',
      feasibility: {
        isRealistic: true,
        obstacles: [
          'Resistencia al cambio en procesos establecidos',
          'Necesidad de capacitación del personal',
          'Inversión inicial requerida'
        ],
        difficulty: 'Medio'
      },
      quickWins: [
        {
          action: 'Ajustar precios en productos de alto margen',
          impact: 'Mejora inmediata en rentabilidad',
          timeframe: '1 semana'
        },
        {
          action: 'Optimizar inventario de productos de baja rotación',
          impact: 'Reducción de costos de almacenamiento',
          timeframe: '2 semanas'
        },
        {
          action: 'Implementar controles básicos de gastos',
          impact: 'Ahorro del 5-10% en costos operativos',
          timeframe: '1 semana'
        }
      ],
      implementationPlan: {
        phase1: {
          weeks: '1-2',
          actions: [
            'Análisis detallado de la situación actual',
            'Comunicación del plan al equipo',
            'Implementación de quick wins'
          ]
        },
        phase2: {
          weeks: '3-4',
          actions: [
            'Ajustes operativos principales',
            'Capacitación del personal',
            'Implementación de nuevos procesos'
          ]
        },
        phase3: {
          weeks: '5-8',
          actions: [
            'Optimización continua',
            'Medición de resultados',
            'Ajustes basados en feedback'
          ]
        }
      },
      risks: [
        {
          risk: 'Pérdida temporal de clientes por cambios en precios',
          mitigation: 'Comunicación clara del valor agregado'
        },
        {
          risk: 'Sobrecarga operativa durante la transición',
          mitigation: 'Implementación gradual y por fases'
        }
      ],
      metrics: [
        'Margen de utilidad neta',
        'Satisfacción del cliente (NPS)',
        'Eficiencia operativa (costos/ventas)'
      ],
      investment: {
        min: 5000,
        max: 15000,
        currency: 'USD',
        description: 'Inversión en tecnología, capacitación y marketing'
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'fallback',
        confidence: 75
      }
    })
  }
}

/**
 * Parsea una respuesta de texto en estructura JSON
 */
function parseTextResponse(text: string): any {
  // Implementación básica de parsing
  const sections = text.split(/\d\./g)
  
  return {
    interpretation: sections[1]?.trim() || 'Optimización completada',
    feasibility: {
      isRealistic: text.includes('realista') || text.includes('viable'),
      obstacles: extractBulletPoints(sections[2] || ''),
      difficulty: extractDifficulty(text)
    },
    quickWins: extractQuickWins(sections[3] || ''),
    implementationPlan: extractPhases(sections[4] || ''),
    risks: extractRisks(sections[5] || ''),
    metrics: extractMetrics(sections[6] || ''),
    investment: extractInvestment(sections[7] || '')
  }
}

/**
 * Calcula el nivel de confianza basado en la solución
 */
function calculateConfidence(solution: any): number {
  let confidence = 50
  
  // Aumentar confianza si el score es alto
  if (solution.score > 80) confidence += 20
  else if (solution.score > 60) confidence += 10
  
  // Aumentar si es factible
  if (solution.feasible) confidence += 15
  
  // Ajustar por número de iteraciones
  if (solution.iterations > 100) confidence += 10
  
  return Math.min(95, confidence)
}

/**
 * Funciones auxiliares de parsing
 */
function extractBulletPoints(text: string): string[] {
  const lines = text.split('\n')
  return lines
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
    .map(line => line.replace(/^[-•]\s*/, '').trim())
    .filter(line => line.length > 0)
}

function extractDifficulty(text: string): string {
  if (text.toLowerCase().includes('alto')) return 'Alto'
  if (text.toLowerCase().includes('bajo')) return 'Bajo'
  return 'Medio'
}

function extractQuickWins(text: string): any[] {
  const items = extractBulletPoints(text)
  return items.slice(0, 3).map(item => ({
    action: item,
    impact: 'Impacto positivo',
    timeframe: '1-2 semanas'
  }))
}

function extractPhases(text: string): any {
  const phases: any = {}
  const phaseRegex = /Fase\s+(\d+)[:\s]*(.*?)(?=Fase\s+\d+|$)/gi
  let match
  
  while ((match = phaseRegex.exec(text)) !== null) {
    phases[`phase${match[1]}`] = {
      weeks: `${(parseInt(match[1]) - 1) * 2 + 1}-${parseInt(match[1]) * 2}`,
      actions: extractBulletPoints(match[2])
    }
  }
  
  return Object.keys(phases).length > 0 ? phases : {
    phase1: { weeks: '1-2', actions: ['Análisis inicial'] },
    phase2: { weeks: '3-4', actions: ['Implementación'] },
    phase3: { weeks: '5-8', actions: ['Optimización'] }
  }
}

function extractRisks(text: string): any[] {
  const items = extractBulletPoints(text)
  return items.slice(0, 3).map(item => ({
    risk: item,
    mitigation: 'Plan de mitigación a definir'
  }))
}

function extractMetrics(text: string): string[] {
  const items = extractBulletPoints(text)
  return items.length > 0 ? items.slice(0, 3) : [
    'ROI',
    'Margen de utilidad',
    'Satisfacción del cliente'
  ]
}

function extractInvestment(text: string): any {
  const numberRegex = /\$?([\d,]+)/g
  const numbers: number[] = []
  let match: RegExpExecArray | null
  while ((match = numberRegex.exec(text)) !== null) {
    numbers.push(parseInt(match[1].replace(/,/g, '')))
  }
  
  if (numbers.length >= 2) {
    return {
      min: Math.min(...numbers),
      max: Math.max(...numbers),
      currency: 'USD',
      description: 'Inversión estimada'
    }
  }
  
  return {
    min: 5000,
    max: 20000,
    currency: 'USD',
    description: 'Rango estimado de inversión'
  }
}