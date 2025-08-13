// lib/utils/goal-algorithms.ts
// Algoritmos matemáticos para encontrar caminos hacia objetivos financieros

export interface GoalPath {
  id: string
  strategy: string
  description: string
  changes: {
    revenue?: number    // % cambio
    costs?: number      // % cambio
    prices?: number     // % cambio
    volume?: number     // % cambio
    efficiency?: number // % cambio
  }
  feasibility: number   // 0-100%
  risk: 'low' | 'medium' | 'high'
  timeToImplement: number // meses
  monthlyMilestones: {
    month: number
    target: number
    actions: string[]
  }[]
  requiredInvestment: number
  roi: number
  breakeven: number
}

export interface CurrentMetrics {
  revenue: number
  costs: number
  profit: number
  margin: number
  customers: number
  avgTicket: number
  fixedCosts?: number
  variableCosts?: number
}

export interface GoalTarget {
  metric: 'revenue' | 'profit' | 'margin' | 'customers' | 'marketShare'
  currentValue: number
  targetValue: number
  timeframe: number // días
}

export interface Constraints {
  maxPriceIncrease: number
  maxCostReduction: number
  maxLaborReduction: number
  minQualityScore: number
  maxInvestment?: number
}

// Algoritmo principal para encontrar caminos hacia el objetivo
export function findPathsToGoal(
  current: CurrentMetrics,
  target: GoalTarget,
  constraints: Constraints
): GoalPath[] {
  const paths: GoalPath[] = []
  const gap = calculateGap(current, target)
  
  // Path 1: Estrategia de incremento de precios
  const pricePath = calculatePriceStrategy(current, gap, constraints, target.timeframe)
  if (pricePath.feasibility > 30) paths.push(pricePath)
  
  // Path 2: Estrategia de volumen
  const volumePath = calculateVolumeStrategy(current, gap, constraints, target.timeframe)
  if (volumePath.feasibility > 30) paths.push(volumePath)
  
  // Path 3: Estrategia de optimización de costos
  const costPath = calculateCostOptimizationStrategy(current, gap, constraints, target.timeframe)
  if (costPath.feasibility > 30) paths.push(costPath)
  
  // Path 4: Estrategia mixta (precio + volumen)
  const mixedPath = calculateMixedStrategy(current, gap, constraints, target.timeframe)
  if (mixedPath.feasibility > 30) paths.push(mixedPath)
  
  // Path 5: Estrategia de transformación digital
  const digitalPath = calculateDigitalTransformationStrategy(current, gap, constraints, target.timeframe)
  if (digitalPath.feasibility > 30) paths.push(digitalPath)
  
  // Ordenar por factibilidad
  return paths.sort((a, b) => b.feasibility - a.feasibility).slice(0, 5)
}

// Calcular el gap entre el estado actual y el objetivo
function calculateGap(current: CurrentMetrics, target: GoalTarget) {
  const currentValue = getCurrentValue(current, target.metric)
  return {
    absolute: target.targetValue - currentValue,
    percentage: ((target.targetValue / currentValue) - 1) * 100,
    metric: target.metric,
    currentValue,
    targetValue: target.targetValue
  }
}

function getCurrentValue(current: CurrentMetrics, metric: string): number {
  switch(metric) {
    case 'revenue': return current.revenue
    case 'profit': return current.profit
    case 'margin': return current.margin
    case 'customers': return current.customers
    default: return 0
  }
}

// Estrategia 1: Incremento de precios
function calculatePriceStrategy(
  current: CurrentMetrics,
  gap: any,
  constraints: Constraints,
  timeframe: number
): GoalPath {
  const requiredPriceIncrease = calculateRequiredPriceIncrease(current, gap)
  const feasibleIncrease = Math.min(requiredPriceIncrease, constraints.maxPriceIncrease)
  
  // Calcular impacto en volumen (elasticidad precio-demanda)
  const priceElasticity = -1.2 // Típico para restaurantes
  const volumeImpact = feasibleIncrease * priceElasticity
  
  // Calcular nuevo revenue y profit
  const newRevenue = current.revenue * (1 + feasibleIncrease/100) * (1 + volumeImpact/100)
  const newProfit = newRevenue - current.costs
  
  // Calcular factibilidad
  const feasibility = calculateFeasibility({
    priceChange: feasibleIncrease,
    volumeChange: volumeImpact,
    timeRequired: timeframe,
    constraints
  })
  
  // Generar hitos mensuales
  const monthlyMilestones = generateMonthlyMilestones(
    current.revenue,
    newRevenue,
    timeframe,
    'price'
  )
  
  return {
    id: 'price-optimization',
    strategy: 'Optimización de Precios',
    description: 'Ajuste estratégico de precios con análisis de elasticidad para maximizar ingresos',
    changes: {
      prices: feasibleIncrease,
      volume: volumeImpact,
      revenue: ((newRevenue / current.revenue) - 1) * 100
    },
    feasibility,
    risk: feasibleIncrease > 10 ? 'high' : feasibleIncrease > 5 ? 'medium' : 'low',
    timeToImplement: Math.ceil(timeframe / 30),
    monthlyMilestones,
    requiredInvestment: 5000, // Marketing para comunicar cambios
    roi: ((newProfit - current.profit) / 5000) * 100,
    breakeven: 1
  }
}

// Estrategia 2: Incremento de volumen
function calculateVolumeStrategy(
  current: CurrentMetrics,
  gap: any,
  constraints: Constraints,
  timeframe: number
): GoalPath {
  const requiredVolumeIncrease = (gap.percentage / (1 - current.costs/current.revenue)) * 1.2
  
  // Calcular inversión necesaria para aumentar volumen
  const marketingInvestment = current.revenue * 0.03 * (requiredVolumeIncrease / 20)
  const operationalInvestment = current.costs * 0.02 * (requiredVolumeIncrease / 20)
  const totalInvestment = marketingInvestment + operationalInvestment
  
  // Calcular nuevo revenue y profit
  const newCustomers = current.customers * (1 + requiredVolumeIncrease/100)
  const newRevenue = current.avgTicket * newCustomers
  const variableCostRatio = 0.65 // Típico para restaurantes
  const newCosts = current.costs * 0.35 + (newRevenue * variableCostRatio)
  const newProfit = newRevenue - newCosts - (totalInvestment / 12)
  
  const feasibility = calculateFeasibility({
    volumeChange: requiredVolumeIncrease,
    investmentRequired: totalInvestment,
    timeRequired: timeframe,
    constraints
  })
  
  const monthlyMilestones = generateMonthlyMilestones(
    current.revenue,
    newRevenue,
    timeframe,
    'volume'
  )
  
  return {
    id: 'volume-growth',
    strategy: 'Crecimiento de Volumen',
    description: 'Expansión de base de clientes mediante marketing y mejora de capacidad operativa',
    changes: {
      volume: requiredVolumeIncrease,
      revenue: ((newRevenue / current.revenue) - 1) * 100,
      costs: ((newCosts / current.costs) - 1) * 100
    },
    feasibility,
    risk: requiredVolumeIncrease > 30 ? 'high' : requiredVolumeIncrease > 15 ? 'medium' : 'low',
    timeToImplement: Math.ceil(timeframe / 30),
    monthlyMilestones,
    requiredInvestment: totalInvestment,
    roi: ((newProfit - current.profit) * 12 / totalInvestment) * 100,
    breakeven: Math.ceil(totalInvestment / (newProfit - current.profit))
  }
}

// Estrategia 3: Optimización de costos
function calculateCostOptimizationStrategy(
  current: CurrentMetrics,
  gap: any,
  constraints: Constraints,
  timeframe: number
): GoalPath {
  const currentCostRatio = current.costs / current.revenue
  const targetCostReduction = Math.min(gap.absolute / 2, current.costs * constraints.maxCostReduction / 100)
  
  // Distribución de reducción de costos
  const laborReduction = targetCostReduction * 0.3
  const supplierOptimization = targetCostReduction * 0.4
  const operationalEfficiency = targetCostReduction * 0.3
  
  const newCosts = current.costs - targetCostReduction
  const newProfit = current.revenue - newCosts
  const costReductionPercentage = (targetCostReduction / current.costs) * 100
  
  const feasibility = calculateFeasibility({
    costChange: -costReductionPercentage,
    laborChange: -(laborReduction / current.costs) * 100,
    timeRequired: timeframe,
    constraints
  })
  
  const monthlyMilestones = generateMonthlyMilestones(
    current.profit,
    newProfit,
    timeframe,
    'cost'
  )
  
  return {
    id: 'cost-optimization',
    strategy: 'Optimización de Costos',
    description: 'Reducción sistemática de costos sin afectar calidad mediante eficiencia operativa',
    changes: {
      costs: -costReductionPercentage,
      efficiency: 15
    },
    feasibility,
    risk: costReductionPercentage > 15 ? 'medium' : 'low',
    timeToImplement: Math.ceil(timeframe / 30),
    monthlyMilestones,
    requiredInvestment: 10000, // Consultoría y sistemas
    roi: ((newProfit - current.profit) * 12 / 10000) * 100,
    breakeven: Math.ceil(10000 / (newProfit - current.profit))
  }
}

// Estrategia 4: Mixta (precio + volumen)
function calculateMixedStrategy(
  current: CurrentMetrics,
  gap: any,
  constraints: Constraints,
  timeframe: number
): GoalPath {
  // Distribución balanceada 40% precio, 60% volumen
  const priceComponent = Math.min(gap.percentage * 0.4, constraints.maxPriceIncrease)
  const volumeComponent = gap.percentage * 0.6
  
  // Calcular impactos combinados
  const priceElasticity = -0.8 // Menor elasticidad con estrategia mixta
  const volumeFromPrice = priceComponent * priceElasticity
  const totalVolumeIncrease = volumeComponent + volumeFromPrice
  
  const newRevenue = current.revenue * (1 + priceComponent/100) * (1 + totalVolumeIncrease/100)
  const newCosts = current.costs * (1 + totalVolumeIncrease/100 * 0.7) // 70% costos variables
  const newProfit = newRevenue - newCosts
  
  const feasibility = calculateFeasibility({
    priceChange: priceComponent,
    volumeChange: totalVolumeIncrease,
    timeRequired: timeframe,
    constraints
  })
  
  const monthlyMilestones = generateMonthlyMilestones(
    current.revenue,
    newRevenue,
    timeframe,
    'mixed'
  )
  
  return {
    id: 'balanced-growth',
    strategy: 'Crecimiento Balanceado',
    description: 'Combinación óptima de ajuste de precios y expansión de mercado',
    changes: {
      prices: priceComponent,
      volume: totalVolumeIncrease,
      revenue: ((newRevenue / current.revenue) - 1) * 100,
      costs: ((newCosts / current.costs) - 1) * 100
    },
    feasibility,
    risk: 'medium',
    timeToImplement: Math.ceil(timeframe / 30),
    monthlyMilestones,
    requiredInvestment: 15000,
    roi: ((newProfit - current.profit) * 12 / 15000) * 100,
    breakeven: Math.ceil(15000 / (newProfit - current.profit))
  }
}

// Estrategia 5: Transformación digital
function calculateDigitalTransformationStrategy(
  current: CurrentMetrics,
  gap: any,
  constraints: Constraints,
  timeframe: number
): GoalPath {
  // Asumir 25% de incremento en eficiencia con digitalización
  const efficiencyGain = 25
  const onlineRevenueAddition = current.revenue * 0.2 // 20% adicional por canal digital
  const costSavings = current.costs * 0.1 // 10% ahorro en costos
  
  const newRevenue = current.revenue + onlineRevenueAddition
  const newCosts = current.costs - costSavings
  const newProfit = newRevenue - newCosts
  
  const feasibility = calculateFeasibility({
    digitalTransformation: true,
    revenueIncrease: (onlineRevenueAddition / current.revenue) * 100,
    costReduction: (costSavings / current.costs) * 100,
    timeRequired: timeframe,
    constraints
  })
  
  const monthlyMilestones = [
    {
      month: 1,
      target: current.profit * 1.05,
      actions: [
        'Implementar sistema POS digital',
        'Configurar plataforma de pedidos online',
        'Capacitar personal en nuevas herramientas'
      ]
    },
    {
      month: 2,
      target: current.profit * 1.15,
      actions: [
        'Lanzar app móvil para clientes',
        'Integrar delivery con terceros',
        'Automatizar gestión de inventarios'
      ]
    },
    {
      month: 3,
      target: current.profit * 1.25,
      actions: [
        'Implementar programa de lealtad digital',
        'Optimizar menú basado en datos',
        'Expandir marketing digital'
      ]
    },
    {
      month: 4,
      target: newProfit,
      actions: [
        'Analizar métricas y optimizar',
        'Escalar operaciones digitales',
        'Implementar IA para predicciones'
      ]
    }
  ]
  
  return {
    id: 'digital-transformation',
    strategy: 'Transformación Digital',
    description: 'Modernización tecnológica para nuevos canales de venta y eficiencia operativa',
    changes: {
      revenue: ((newRevenue / current.revenue) - 1) * 100,
      costs: -((costSavings / current.costs) * 100),
      efficiency: efficiencyGain
    },
    feasibility,
    risk: 'medium',
    timeToImplement: Math.ceil(timeframe / 30),
    monthlyMilestones,
    requiredInvestment: 25000,
    roi: ((newProfit - current.profit) * 12 / 25000) * 100,
    breakeven: Math.ceil(25000 / (newProfit - current.profit))
  }
}

// Calcular factibilidad basado en múltiples factores
function calculateFeasibility(factors: any): number {
  let score = 100
  
  // Penalizaciones por cambios drásticos
  if (factors.priceChange > 15) score -= 20
  if (factors.volumeChange > 50) score -= 25
  if (factors.costChange < -20) score -= 15
  if (factors.laborChange < -15) score -= 20
  
  // Penalización por tiempo
  if (factors.timeRequired < 30) score -= 15
  if (factors.timeRequired < 15) score -= 25
  
  // Penalización por inversión alta
  if (factors.investmentRequired > 50000) score -= 10
  if (factors.investmentRequired > 100000) score -= 20
  
  // Bonus por transformación digital
  if (factors.digitalTransformation) score += 10
  
  // Ajustar por restricciones
  if (factors.constraints) {
    if (factors.priceChange > factors.constraints.maxPriceIncrease) score -= 30
    if (Math.abs(factors.costChange || 0) > factors.constraints.maxCostReduction) score -= 30
    if (Math.abs(factors.laborChange || 0) > factors.constraints.maxLaborReduction) score -= 30
  }
  
  return Math.max(0, Math.min(100, score))
}

// Generar hitos mensuales
function generateMonthlyMilestones(
  currentValue: number,
  targetValue: number,
  timeframeDays: number,
  strategy: string
): any[] {
  const months = Math.ceil(timeframeDays / 30)
  const increment = (targetValue - currentValue) / months
  const milestones = []
  
  for (let i = 1; i <= Math.min(months, 4); i++) {
    const monthTarget = currentValue + (increment * i)
    const actions = getMilestoneActions(strategy, i, months)
    
    milestones.push({
      month: i,
      target: Math.round(monthTarget),
      actions
    })
  }
  
  return milestones
}

// Obtener acciones específicas por estrategia y mes
function getMilestoneActions(strategy: string, month: number, totalMonths: number): string[] {
  const actionMap: any = {
    price: {
      1: ['Análisis de elasticidad precio-demanda', 'Benchmark competitivo', 'Segmentación de clientes'],
      2: ['Implementar ajuste gradual de precios', 'Comunicar valor agregado', 'Monitorear reacción del mercado'],
      3: ['Optimizar mix de productos', 'Ajustar promociones', 'Refinar estrategia de pricing'],
      4: ['Evaluar resultados', 'Ajustes finales', 'Establecer precio óptimo']
    },
    volume: {
      1: ['Campaña de captación de clientes', 'Mejorar presencia online', 'Programa de referidos'],
      2: ['Expandir horarios de atención', 'Promociones de temporada', 'Partnerships locales'],
      3: ['Optimizar capacidad operativa', 'Programa de fidelización', 'Eventos especiales'],
      4: ['Análisis de retención', 'Escalar operaciones', 'Consolidar base de clientes']
    },
    cost: {
      1: ['Auditoría de gastos', 'Renegociar con proveedores', 'Identificar ineficiencias'],
      2: ['Implementar controles de costo', 'Optimizar inventarios', 'Reducir desperdicios'],
      3: ['Automatizar procesos', 'Mejorar productividad', 'Revisar staffing'],
      4: ['Monitorear KPIs de eficiencia', 'Ajustes finales', 'Documentar mejores prácticas']
    },
    mixed: {
      1: ['Análisis integral del negocio', 'Definir quick wins', 'Preparar equipo para cambios'],
      2: ['Implementar ajustes de precio', 'Lanzar iniciativas de volumen', 'Optimizar operaciones'],
      3: ['Monitorear métricas clave', 'Ajustar estrategia', 'Escalar lo que funciona'],
      4: ['Consolidar ganancias', 'Planificar siguiente fase', 'Celebrar logros']
    }
  }
  
  const defaultActions = actionMap.mixed
  return actionMap[strategy]?.[month] || defaultActions[month] || defaultActions[1]
}

// Calcular precio requerido para alcanzar objetivo
function calculateRequiredPriceIncrease(current: CurrentMetrics, gap: any): number {
  // Fórmula simplificada: asume que el profit aumenta proporcionalmente con el precio
  // En realidad, debe considerar elasticidad y costos variables
  const currentMargin = current.profit / current.revenue
  const requiredRevenue = current.revenue + (gap.absolute / currentMargin)
  return ((requiredRevenue / current.revenue) - 1) * 100
}

// Evaluar riesgo de una estrategia
export function assessRisk(path: GoalPath): 'low' | 'medium' | 'high' {
  let riskScore = 0
  
  // Evaluar cambios
  if (Math.abs(path.changes.prices || 0) > 15) riskScore += 2
  if (Math.abs(path.changes.volume || 0) > 30) riskScore += 2
  if (Math.abs(path.changes.costs || 0) > 20) riskScore += 1
  
  // Evaluar inversión
  if (path.requiredInvestment > 50000) riskScore += 2
  if (path.requiredInvestment > 100000) riskScore += 3
  
  // Evaluar tiempo
  if (path.timeToImplement < 2) riskScore += 2
  
  // Evaluar ROI
  if (path.roi < 50) riskScore += 1
  if (path.roi < 20) riskScore += 2
  
  if (riskScore <= 2) return 'low'
  if (riskScore <= 5) return 'medium'
  return 'high'
}

// Validar si el objetivo es alcanzable
export function validateGoalAchievability(
  current: CurrentMetrics,
  target: GoalTarget,
  constraints: Constraints
): { achievable: boolean; reason?: string } {
  const gap = calculateGap(current, target)
  
  // Validaciones básicas
  if (target.targetValue <= 0) {
    return { achievable: false, reason: 'El objetivo debe ser mayor a cero' }
  }
  
  if (target.targetValue <= current[target.metric as keyof CurrentMetrics]) {
    return { achievable: false, reason: 'El objetivo debe ser mayor al valor actual' }
  }
  
  if (target.timeframe < 7) {
    return { achievable: false, reason: 'El plazo mínimo es de 7 días' }
  }
  
  // Validaciones de factibilidad
  if (gap.percentage > 200) {
    return { achievable: false, reason: 'El objetivo requiere más del 200% de crecimiento' }
  }
  
  if (gap.percentage > 100 && target.timeframe < 90) {
    return { achievable: false, reason: 'Duplicar métricas requiere al menos 90 días' }
  }
  
  // Si pasa todas las validaciones
  return { achievable: true }
}