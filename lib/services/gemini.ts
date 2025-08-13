// lib/services/gemini.ts
// Servicio centralizado para manejar Gemini API

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
  usageMetadata?: {
    promptTokenCount?: number
    candidatesTokenCount?: number
    totalTokenCount?: number
  }
}

export class GeminiService {
  private apiKey: string
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
  }

  async generateContent(prompt: string): Promise<{ success: boolean; response?: string; error?: string }> {
    if (!this.apiKey) {
      return { 
        success: false, 
        error: 'API key no configurada. Por favor configura GEMINI_API_KEY en las variables de entorno.' 
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Gemini API Error:', errorData)
        
        // Manejo específico de errores comunes
        if (response.status === 403) {
          return { 
            success: false, 
            error: 'Acceso denegado. Verifica que tu API key sea válida y tenga los permisos necesarios.' 
          }
        }
        
        return { 
          success: false, 
          error: errorData.error?.message || `Error ${response.status}: ${response.statusText}` 
        }
      }

      const data: GeminiResponse = await response.json()
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!aiResponse) {
        return { 
          success: false, 
          error: 'No se recibió respuesta de Gemini AI' 
        }
      }

      return { 
        success: true, 
        response: aiResponse 
      }

    } catch (error) {
      console.error('Error calling Gemini:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido al conectar con Gemini' 
      }
    }
  }

  // Método para verificar si la API está disponible
  async checkStatus(): Promise<boolean> {
    if (!this.apiKey) return false
    
    try {
      const result = await this.generateContent('Hello, respond with "OK" if you receive this.')
      return result.success
    } catch {
      return false
    }
  }
}
