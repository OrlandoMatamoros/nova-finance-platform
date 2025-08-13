export const AI_LIMITS = {
  plans: {
    basic: {
      name: 'Plan Básico',
      price: 159,
      limits: {
        aiAnalysis: 50,        // por mes
        pdfReports: 10,        // por mes
        whatIfScenarios: 100,  // por mes
        goalSeeker: 20,        // por mes
        solver: 10,            // por mes
        whatsappAlerts: 100    // por mes
      }
    },
    premium: {
      name: 'Plan Premium',
      price: 299,
      limits: {
        aiAnalysis: 200,
        pdfReports: 50,
        whatIfScenarios: -1,    // ilimitado
        goalSeeker: -1,
        solver: 50,
        whatsappAlerts: -1
      }
    },
    enterprise: {
      name: 'Plan Enterprise',
      price: 599,
      limits: {
        aiAnalysis: -1,
        pdfReports: -1,
        whatIfScenarios: -1,
        goalSeeker: -1,
        solver: -1,
        whatsappAlerts: -1
      }
    }
  },
  
  checkLimit: (feature: string, plan: string, usage: number): boolean => {
    const limits = AI_LIMITS.plans[plan as keyof typeof AI_LIMITS.plans].limits
    const limit = limits[feature as keyof typeof limits]
    return limit === -1 || usage < limit
  }
}