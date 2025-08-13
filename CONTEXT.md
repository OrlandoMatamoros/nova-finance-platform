# CONTEXTO - NOVA FINANCE PLATFORM 2.0

## IDENTIDAD DE LA IA
Soy Nova, socia estratégica de IA de Impulsa Lab. Mi rol:
- Arquitecta Tecnológica del sistema
- Experta en Análisis Financiero
- Co-desarrolladora de la plataforma
- Estratega de Producto

## OBJETIVO DEL PROYECTO
Transformar el servicio manual de dashboards (18-30 horas) en SaaS automatizado (1-2 horas setup).

## ESTADO ACTUAL (13/08/2025)
- ✅ Dashboard con 13 componentes funcionando
- ✅ Badges PREMIUM agregados
- ✅ PDF con branding Impulsa Lab
- ✅ Powered by Impulsa Lab en header
- 🔄 Integración Gemini AI en progreso
- 🔄 Firebase setup en progreso
- 📝 Apéndice O 70% completo

## CONFIGURACIÓN TÉCNICA
- Stack: Next.js 15.3 + TypeScript + Tailwind
- IA: Gemini API (necesita key en .env.local)
- DB: Firebase Firestore
- Hosting: Vercel
- Auth: Firebase Auth

## CLIENTE DEMO
Brooklyn Bistro (restaurant demo con datos robustos)

## PRÓXIMOS PASOS
1. Configurar Gemini API con key real
2. Setup Firebase completo
3. Hacer todos los componentes 100% funcionales
4. Actualizar Apéndice O final
5. Probar con El Conuco de Mamá

## ARCHIVOS CLAVE
- /components/dashboard/AdvancedDashboard.tsx (principal)
- /lib/data/restaurantDataGenerator.ts (datos)
- /lib/ai/geminiConfig.ts (IA)
- /lib/firebase/config.ts (database)

## PARA NUEVO CHAT
Copiar este archivo + Apéndice O + código actual
cat > CONTEXT.md << 'EOF'
# CONTEXTO - NOVA FINANCE PLATFORM 2.0

## IDENTIDAD DE LA IA
Soy Nova, socia estratégica de IA de Impulsa Lab. Mi rol:
- Arquitecta Tecnológica del sistema
- Experta en Análisis Financiero  
- Co-desarrolladora de la plataforma
- Estratega de Producto

## OBJETIVO DEL PROYECTO
Transformar el servicio manual de dashboards (18-30 horas) en SaaS automatizado (1-2 horas setup).

## ESTADO ACTUAL (13/08/2025)
### ✅ COMPLETADO
- Dashboard con 13 componentes funcionando
- Badges PREMIUM en todos los componentes
- PDF con branding Impulsa Lab
- Powered by Impulsa Lab en header
- **DOCUMENTACIÓN COMPLETA:**
  - WhatIfSimulator ✅ (Panel ayuda + tooltips)
  - GoalSeeker ✅ (Panel ayuda + tooltips)
  - SolverOptimizer ✅ (Panel ayuda + tooltips)
  - WhatsAppIntegration ✅ (Panel ayuda + tooltips)
  - PDFReportGenerator ✅ (Panel ayuda + tooltips)
  - RealTimeAIAnalysis ✅ (Preparado para Gemini)

### 🔄 EN PROGRESO
- Integración Gemini API (esperando key)
- Firebase setup (esperando credenciales)
- Testing con datos reales

### 📝 PENDIENTE
- DataConnector documentación
- ThemeConfigurator documentación
- Modal de configuración inicial
- El Conuco de Mamá (cliente piloto)

## CONFIGURACIÓN TÉCNICA
```javascript
const stack = {
  frontend: "Next.js 15.3 + TypeScript + Tailwind",
  componentes: "13 componentes premium documentados",
  ia: "Gemini API (pendiente key)",
  db: "Firebase Firestore (pendiente setup)",
  hosting: "Vercel",
  auth: "Firebase Auth"
}