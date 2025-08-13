import { GoogleGenerativeAI } from '@google/generative-ai'

// Tu API Key de Gemini
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''

export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
export const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

export async function analyzeFinancialData(data: any) {
  try {
    const prompt = `
      Analiza estos datos financieros y proporciona:
      1. 3 insights clave sobre el rendimiento
      2. 2 alertas o puntos de atención
      3. 3 recomendaciones específicas para mejorar
      
      Datos: ${JSON.stringify(data)}
      
      Responde en formato JSON con la estructura:
      {
        "insights": ["insight1", "insight2", "insight3"],
        "alerts": ["alert1", "alert2"],
        "recommendations": ["rec1", "rec2", "rec3"]
      }
    `
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Parsear la respuesta JSON
    try {
      return JSON.parse(text)
    } catch {
      // Si no es JSON válido, crear estructura por defecto
      return {
        insights: [text.slice(0, 100)],
        alerts: ["Revisar datos"],
        recommendations: ["Optimizar procesos"]
      }
    }
  } catch (error) {
    console.error('Error en análisis Gemini:', error)
    return null
  }
}