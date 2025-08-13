// app/api/ai/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GeminiService } from '@/lib/services/gemini'

// Manejar OPTIONS para CORS
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
    // Parsear el body
    const body = await request.json()
    const { prompt, test } = body

    // Si es una llamada de test, solo responder OK
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

    // Verificar si tenemos API key
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
    
    if (!apiKey) {
      console.error('No API key found in environment variables')
      
      // En lugar de fallar, devolver un análisis de demo
      return NextResponse.json({
        success: true,
        response: generateDemoAnalysis(),
        demo: true
      })
    }

    // Usar el servicio de Gemini
    const gemini = new GeminiService(apiKey)
    const result = await gemini.generateContent(prompt)

    if (!result.success) {
      console.error('Gemini service error:', result.error)
      
      // Si falla Gemini, devolver análisis de demo
      return NextResponse.json({
        success: true,
        response: generateDemoAnalysis(),
        demo: true,
        originalError: result.error
      })
    }

    // Respuesta exitosa de Gemini
    return NextResponse.json({
      success: true,
      response: result.response,
      demo: false
    })

  } catch (error) {
    console.error('API Route Error:', error)
    
    // En caso de error, devolver análisis de demo
    return NextResponse.json({
      success: true,
      response: generateDemoAnalysis(),
      demo: true,
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

// Función para generar análisis de demo cuando Gemini no está disponible
function generateDemoAnalysis(): string {
  const insights = [
    {
      tipo: 'success',
      titulo: 'Margen de Ganancia Saludable',
      descripcion: 'Tu margen del 35% supera el promedio del sector (30%). Mantén esta eficiencia operativa.',
      impacto: 'high',
      metrica: '35%',
      accion: false
    },
    {
      tipo: 'warning',
      titulo: 'Costos Laborales Elevados',
      descripcion: 'Los costos de personal (28%) exceden el objetivo del 25%. Revisa horarios en horas valle.',
      impacto: 'medium',
      metrica: '28%',
      accion: true
    },
    {
      tipo: 'opportunity',
      titulo: 'Potencial en Ticket Promedio',
      descripcion: 'Aumentar $5 el ticket promedio generaría $15,000 adicionales al mes.',
      impacto: 'high',
      metrica: '+$15K',
      accion: true
    },
    {
      tipo: 'opportunity',
      titulo: 'Optimización de Inventario',
      descripcion: 'Reducir inventario lento en 20% liberaría $8,000 en capital de trabajo.',
      impacto: 'medium',
      metrica: '$8K',
      accion: true
    },
    {
      tipo: 'info',
      titulo: 'Crecimiento de Clientes',
      descripcion: 'Base de clientes creció 15% este mes. Implementa programa de fidelización.',
      impacto: 'medium',
      metrica: '+15%',
      accion: false
    }
  ]

  // Formatear como respuesta de Gemini
  return insights.map(insight => `
[TIPO]: ${insight.tipo}
[TÍTULO]: ${insight.titulo}
[DESCRIPCIÓN]: ${insight.descripcion}
[IMPACTO]: ${insight.impacto}
[MÉTRICA]: ${insight.metrica}
[ACCIÓN]: ${insight.accion}
  `).join('\n\n')
}