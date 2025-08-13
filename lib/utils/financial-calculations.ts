// lib/utils/financial-calculations.ts

export interface FinancialMetrics {
  revenue: number
  costs: number
  profit: number
  margin: number
  covers: number
  avgTicket: number
  foodCost: number
  laborCost: number
  overheadCost: number
  marketingCost: number
  otherCosts: number
}

export interface ScenarioVariables {
  salesChange: number
  priceChange: number
  costChange: number
  laborChange: number
  trafficChange: number
  marketingChange?: number
  overheadChange?: number
}

export interface SimulationResult {
  revenue: number
  costs: number
  profit: number
  margin: number
  breakeven: number
  roi: number
  cashFlow: number
  paybackPeriod: number
  npv: number
  irr: number
}

export class FinancialCalculator {
  /**
   * Calcula el impacto de cambios en las variables del negocio
   */
  static simulateScenario(
    baseMetrics: FinancialMetrics,
    variables: ScenarioVariables
  ): SimulationResult {
    // Calcular nuevo tráfico de clientes
    const newTraffic = baseMetrics.covers * (1 + (variables.trafficChange || 0) / 100)
    
    // Calcular nuevo ticket promedio con cambio de precio
    const newAvgTicket = baseMetrics.avgTicket * (1 + (variables.priceChange || 0) / 100)
    
    // Calcular impacto en volumen de ventas
    const volumeImpact = 1 + (variables.salesChange || 0) / 100
    
    // Calcular nuevos ingresos (tráfico × ticket × volumen)
    const newRevenue = newTraffic * newAvgTicket * volumeImpact
    
    // Calcular cada categoría de costos con sus cambios
    const newFoodCost = baseMetrics.foodCost * (1 + (variables.costChange || 0) / 100)
    const newLaborCost = baseMetrics.laborCost * (1 + (variables.laborChange || 0) / 100)
    const newOverheadCost = baseMetrics.overheadCost * (1 + (variables.overheadChange || 0) / 100)
    const newMarketingCost = baseMetrics.marketingCost * (1 + (variables.marketingChange || 0) / 100)
    const newOtherCosts = baseMetrics.otherCosts // Costos fijos
    
    // Calcular costos totales
    const newCosts = newFoodCost + newLaborCost + newOverheadCost + newMarketingCost + newOtherCosts
    
    // Calcular utilidad y márgenes
    const newProfit = newRevenue - newCosts
    const newMargin = (newProfit / newRevenue) * 100
    
    // Calcular punto de equilibrio
    const fixedCosts = newOverheadCost + newOtherCosts
    const variableCostRatio = (newFoodCost + newLaborCost) / newRevenue
    const breakeven = fixedCosts / (1 - variableCostRatio)
    
    // Calcular ROI
    const investmentRequired = Math.abs(variables.marketingChange || 0) * baseMetrics.marketingCost / 100
    const roi = investmentRequired > 0 ? ((newProfit - baseMetrics.profit) / investmentRequired) * 100 : 0
    
    // Calcular flujo de caja (simplificado)
    const cashFlow = newProfit * 0.85 // Asumiendo 85% de conversión a efectivo
    
    // Calcular período de recuperación
    const paybackPeriod = investmentRequired > 0 ? investmentRequired / (newProfit / 12) : 0
    
    // Calcular VPN (Net Present Value) - simplificado a 5 años
    const discountRate = 0.10 // 10% de tasa de descuento
    let npv = -investmentRequired
    for (let year = 1; year <= 5; year++) {
      npv += (newProfit * 12) / Math.pow(1 + discountRate, year)
    }
    
    // Calcular TIR (Internal Rate of Return) - aproximación
    const irr = investmentRequired > 0 ? ((newProfit * 12) / investmentRequired - 1) * 100 : 0
    
    return {
      revenue: newRevenue,
      costs: newCosts,
      profit: newProfit,
      margin: newMargin,
      breakeven,
      roi,
      cashFlow,
      paybackPeriod,
      npv,
      irr
    }
  }

  /**
   * Calcula el cambio porcentual entre dos valores
   */
  static calculatePercentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return 0
    return ((newValue - oldValue) / oldValue) * 100
  }

  /**
   * Determina el color del indicador basado en el cambio
   */
  static getImpactLevel(changePercent: number): 'critical' | 'warning' | 'neutral' | 'good' | 'excellent' {
    if (changePercent < -20) return 'critical'
    if (changePercent < -5) return 'warning'
    if (changePercent < 5) return 'neutral'
    if (changePercent < 20) return 'good'
    return 'excellent'
  }

  /**
   * Genera recomendaciones basadas en los resultados
   */
  static generateRecommendations(
    baseMetrics: FinancialMetrics,
    results: SimulationResult
  ): string[] {
    const recommendations: string[] = []
    const profitChange = this.calculatePercentageChange(baseMetrics.profit, results.profit)
    const marginChange = results.margin - (baseMetrics.profit / baseMetrics.revenue) * 100
    
    // Análisis de rentabilidad
    if (profitChange > 20) {
      recommendations.push('Escenario altamente favorable. Considera implementación gradual para validar supuestos.')
    } else if (profitChange > 0) {
      recommendations.push('Mejora en rentabilidad detectada. Procede con monitoreo constante.')
    } else {
      recommendations.push('Pérdida de rentabilidad proyectada. Revisa las variables críticas.')
    }
    
    // Análisis de margen
    if (marginChange > 5) {
      recommendations.push('Excelente mejora en márgenes. Esto indica mayor eficiencia operativa.')
    } else if (marginChange < -5) {
      recommendations.push('Deterioro significativo en márgenes. Evalúa la estructura de costos.')
    }
    
    // Análisis de punto de equilibrio
    if (results.breakeven < baseMetrics.revenue * 0.6) {
      recommendations.push('Punto de equilibrio saludable. Tienes buen margen de seguridad.')
    } else if (results.breakeven > baseMetrics.revenue * 0.85) {
      recommendations.push('⚠️ Punto de equilibrio muy alto. Riesgo elevado ante caída de ventas.')
    }
    
    // Análisis de ROI
    if (results.roi > 100) {
      recommendations.push('ROI excepcional. Prioriza esta iniciativa en tu estrategia.')
    } else if (results.roi > 30) {
      recommendations.push('ROI atractivo. Vale la pena la inversión.')
    } else if (results.roi < 10 && results.roi > 0) {
      recommendations.push('ROI bajo. Considera alternativas o ajusta las variables.')
    }
    
    // Análisis de flujo de caja
    if (results.cashFlow > baseMetrics.profit) {
      recommendations.push('Mejora en flujo de caja proyectado. Esto fortalecerá tu liquidez.')
    }
    
    return recommendations
  }

  /**
   * Calcula métricas de sensibilidad (qué tan sensible es el resultado a cada variable)
   */
  static calculateSensitivity(
    baseMetrics: FinancialMetrics,
    variables: ScenarioVariables
  ): Record<keyof ScenarioVariables, number> {
    const baseResult = this.simulateScenario(baseMetrics, variables)
    const sensitivity: Partial<Record<keyof ScenarioVariables, number>> = {}
    
    // Calcular sensibilidad para cada variable (cambio de 1%)
    const testVariables: (keyof ScenarioVariables)[] = [
      'salesChange', 'priceChange', 'costChange', 
      'laborChange', 'trafficChange', 'marketingChange', 'overheadChange'
    ]
    
    testVariables.forEach(variable => {
      const testScenario = { ...variables }
      testScenario[variable] = (testScenario[variable] || 0) + 1
      const testResult = this.simulateScenario(baseMetrics, testScenario)
      sensitivity[variable] = ((testResult.profit - baseResult.profit) / baseResult.profit) * 100
    })
    
    return sensitivity as Record<keyof ScenarioVariables, number>
  }

  /**
   * Encuentra el valor óptimo para una variable objetivo
   */
  static goalSeek(
    baseMetrics: FinancialMetrics,
    targetProfit: number,
    variableToAdjust: keyof ScenarioVariables,
    otherVariables: Partial<ScenarioVariables> = {}
  ): number | null {
    let low = -50
    let high = 50
    let iterations = 0
    const maxIterations = 100
    const tolerance = 100 // $100 de tolerancia
    
    while (iterations < maxIterations) {
      const mid = (low + high) / 2
      const testVariables = { ...otherVariables, [variableToAdjust]: mid } as ScenarioVariables
      const result = this.simulateScenario(baseMetrics, testVariables)
      
      if (Math.abs(result.profit - targetProfit) < tolerance) {
        return mid
      }
      
      if (result.profit < targetProfit) {
        low = mid
      } else {
        high = mid
      }
      
      iterations++
    }
    
    return null // No se encontró solución
  }

  /**
   * Genera escenario optimizado usando heurísticas
   */
  static generateOptimizedScenario(
    baseMetrics: FinancialMetrics,
    constraints: {
      maxPriceIncrease?: number
      maxCostReduction?: number
      targetProfitIncrease?: number
    } = {}
  ): ScenarioVariables {
    const currentMargin = (baseMetrics.profit / baseMetrics.revenue) * 100
    
    // Heurísticas basadas en el margen actual
    if (currentMargin < 10) {
      // Margen bajo: enfoque en eficiencia de costos
      return {
        salesChange: 5,
        priceChange: Math.min(constraints.maxPriceIncrease || 3, 3),
        costChange: Math.max(constraints.maxCostReduction || -8, -8),
        laborChange: -5,
        trafficChange: 3,
        marketingChange: 10,
        overheadChange: -10
      }
    } else if (currentMargin < 20) {
      // Margen medio: balance entre crecimiento y eficiencia
      return {
        salesChange: 10,
        priceChange: Math.min(constraints.maxPriceIncrease || 5, 5),
        costChange: Math.max(constraints.maxCostReduction || -3, -3),
        laborChange: 0,
        trafficChange: 8,
        marketingChange: 20,
        overheadChange: -5
      }
    } else {
      // Margen alto: enfoque en crecimiento
      return {
        salesChange: 15,
        priceChange: Math.min(constraints.maxPriceIncrease || 7, 7),
        costChange: 2,
        laborChange: 5,
        trafficChange: 12,
        marketingChange: 35,
        overheadChange: 3
      }
    }
  }

  /**
   * Valida que las variables del escenario sean realistas
   */
  static validateScenario(variables: ScenarioVariables): {
    isValid: boolean
    warnings: string[]
  } {
    const warnings: string[] = []
    
    // Validar cambios extremos
    if (Math.abs(variables.salesChange) > 30) {
      warnings.push('Cambio en ventas mayor al 30% puede ser poco realista')
    }
    
    if (variables.priceChange > 15) {
      warnings.push('Aumento de precio mayor al 15% puede afectar significativamente la demanda')
    }
    
    if (variables.costChange < -15) {
      warnings.push('Reducción de costos mayor al 15% puede comprometer la calidad')
    }
    
    if (variables.laborChange < -20) {
      warnings.push('Reducción de personal mayor al 20% puede afectar el servicio')
    }
    
    // Validar combinaciones contradictorias
    if (variables.trafficChange > 20 && variables.laborChange < -10) {
      warnings.push('Aumentar tráfico mientras reduces personal puede causar problemas de servicio')
    }
    
    if (variables.priceChange > 10 && variables.trafficChange > 10) {
      warnings.push('Aumentar precios y esperar más tráfico es optimista - valida con datos históricos')
    }
    
    return {
      isValid: warnings.length === 0,
      warnings
    }
  }
}

export default FinancialCalculator