// lib/utils/optimization-algorithms.ts
/**
 * Algoritmos de Optimización Multi-objetivo para SolverOptimizer
 * Versión 3.0 - Implementación completa con matemáticas reales
 */

export interface Objective {
  id: string
  name: string
  type: 'maximize' | 'minimize' | 'target'
  weight: number
  current: number
  target?: number
  unit: string
  constraints?: {
    min?: number
    max?: number
  }
}

export interface Variable {
  id: string
  name: string
  currentValue: number
  minValue: number
  maxValue: number
  stepSize: number
  unit: string
  impact: {
    revenue: number  // Impacto en revenue por unidad de cambio
    cost: number     // Impacto en costos por unidad de cambio
    quality: number  // Impacto en calidad por unidad de cambio
    customers: number // Impacto en clientes por unidad de cambio
  }
}

export interface OptimizationConstraint {
  id: string
  name: string
  type: 'budget' | 'capacity' | 'quality' | 'dependency'
  validate: (solution: Solution) => boolean
  limit?: number
}

export interface Solution {
  variables: Map<string, number>
  objectives: Map<string, number>
  score: number
  feasible: boolean
  dominatedBy?: string[]
}

export interface OptimizationResult {
  optimal: Solution
  paretoFront: Solution[]
  tradeOffs: TradeOff[]
  convergenceHistory: number[]
  iterations: number
  executionTime: number
}

export interface TradeOff {
  objective1: string
  objective2: string
  correlation: number
  sensitivity: number
  optimalBalance: {
    obj1Value: number
    obj2Value: number
  }
}

/**
 * Normaliza un valor entre 0 y 1
 */
function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5
  return (value - min) / (max - min)
}

/**
 * Desnormaliza un valor de [0,1] a [min,max]
 */
function denormalize(value: number, min: number, max: number): number {
  return value * (max - min) + min
}

/**
 * Calcula el score de una solución usando Weighted Sum Method
 */
export function calculateWeightedScore(
  solution: Solution,
  objectives: Objective[]
): number {
  let totalScore = 0
  let totalWeight = 0

  objectives.forEach(obj => {
    const value = solution.objectives.get(obj.id) || obj.current
    let normalizedValue = 0

    // Calcular min y max para normalización
    const min = obj.constraints?.min ?? obj.current * 0.5
    const max = obj.constraints?.max ?? obj.current * 1.5

    if (obj.type === 'maximize') {
      normalizedValue = normalize(value, min, max)
    } else if (obj.type === 'minimize') {
      normalizedValue = 1 - normalize(value, min, max)
    } else if (obj.type === 'target' && obj.target) {
      // Para objetivos target, penalizar distancia al target
      const distance = Math.abs(value - obj.target)
      const maxDistance = Math.max(Math.abs(max - obj.target), Math.abs(min - obj.target))
      normalizedValue = 1 - (distance / maxDistance)
    }

    totalScore += normalizedValue * obj.weight
    totalWeight += obj.weight
  })

  return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0
}

/**
 * Genera una solución inicial aleatoria
 */
function generateRandomSolution(
  variables: Variable[],
  objectives: Objective[]
): Solution {
  const solution: Solution = {
    variables: new Map(),
    objectives: new Map(),
    score: 0,
    feasible: true
  }

  // Asignar valores aleatorios a las variables
  variables.forEach(v => {
    const randomValue = Math.random() * (v.maxValue - v.minValue) + v.minValue
    solution.variables.set(v.id, randomValue)
  })

  // Calcular objetivos basados en las variables
  calculateObjectives(solution, variables, objectives)
  solution.score = calculateWeightedScore(solution, objectives)

  return solution
}

/**
 * Calcula los valores de los objetivos basados en las variables
 */
function calculateObjectives(
  solution: Solution,
  variables: Variable[],
  objectives: Objective[]
): void {
  // Calcular métricas base
  let revenue = 125000 // Base revenue
  let costs = 82000    // Base costs
  let quality = 85     // Base quality
  let customers = 2850  // Base customers

  // Aplicar impactos de las variables
  variables.forEach(v => {
    const value = solution.variables.get(v.id) || v.currentValue
    const change = (value - v.currentValue) / v.currentValue

    revenue += revenue * change * v.impact.revenue
    costs += costs * change * v.impact.cost
    quality += quality * change * v.impact.quality
    customers += customers * change * v.impact.customers
  })

  // Mapear a objetivos
  solution.objectives.set('revenue', revenue)
  solution.objectives.set('costs', costs)
  solution.objectives.set('profit', revenue - costs)
  solution.objectives.set('margin', ((revenue - costs) / revenue) * 100)
  solution.objectives.set('quality', quality)
  solution.objectives.set('customers', customers)
}

/**
 * Verifica si una solución domina a otra (para Pareto)
 */
function dominates(s1: Solution, s2: Solution, objectives: Objective[]): boolean {
  let betterInOne = false
  let worseInOne = false

  for (const obj of objectives) {
    const v1 = s1.objectives.get(obj.id) || 0
    const v2 = s2.objectives.get(obj.id) || 0

    if (obj.type === 'maximize') {
      if (v1 > v2) betterInOne = true
      if (v1 < v2) worseInOne = true
    } else if (obj.type === 'minimize') {
      if (v1 < v2) betterInOne = true
      if (v1 > v2) worseInOne = true
    } else if (obj.type === 'target' && obj.target) {
      const d1 = Math.abs(v1 - obj.target)
      const d2 = Math.abs(v2 - obj.target)
      if (d1 < d2) betterInOne = true
      if (d1 > d2) worseInOne = true
    }
  }

  return betterInOne && !worseInOne
}

/**
 * Encuentra el frente de Pareto de un conjunto de soluciones
 */
export function findParetoFront(
  solutions: Solution[],
  objectives: Objective[]
): Solution[] {
  const paretoFront: Solution[] = []

  for (let i = 0; i < solutions.length; i++) {
    let isDominated = false
    
    for (let j = 0; j < solutions.length; j++) {
      if (i !== j && dominates(solutions[j], solutions[i], objectives)) {
        isDominated = true
        solutions[i].dominatedBy = solutions[i].dominatedBy || []
        solutions[i].dominatedBy.push(`Solution ${j}`)
        break
      }
    }

    if (!isDominated) {
      paretoFront.push(solutions[i])
    }
  }

  return paretoFront
}

/**
 * Algoritmo de Hill Climbing para optimización local
 */
function hillClimbing(
  initial: Solution,
  variables: Variable[],
  objectives: Objective[],
  maxIterations: number = 100
): Solution {
  let current = { ...initial }
  let bestScore = current.score

  for (let iter = 0; iter < maxIterations; iter++) {
    let improved = false

    // Intentar mejorar cada variable
    for (const variable of variables) {
      const currentValue = current.variables.get(variable.id) || variable.currentValue
      
      // Probar incremento y decremento
      for (const delta of [-variable.stepSize, variable.stepSize]) {
        const newValue = Math.max(
          variable.minValue,
          Math.min(variable.maxValue, currentValue + delta)
        )

        if (newValue === currentValue) continue

        // Crear solución vecina
        const neighbor: Solution = {
          variables: new Map(current.variables),
          objectives: new Map(),
          score: 0,
          feasible: true
        }
        neighbor.variables.set(variable.id, newValue)

        // Recalcular objetivos y score
        calculateObjectives(neighbor, variables, objectives)
        neighbor.score = calculateWeightedScore(neighbor, objectives)

        // Aceptar si mejora
        if (neighbor.score > bestScore) {
          current = neighbor
          bestScore = neighbor.score
          improved = true
        }
      }
    }

    if (!improved) break // Convergencia local
  }

  return current
}

/**
 * Algoritmo principal de optimización multi-objetivo
 * Combina Weighted Sum Method con búsqueda de Pareto
 */
export function multiObjectiveOptimize(
  objectives: Objective[],
  variables: Variable[],
  constraints: OptimizationConstraint[],
  config: {
    populationSize?: number
    maxIterations?: number
    convergenceThreshold?: number
  } = {}
): OptimizationResult {
  const startTime = Date.now()
  const {
    populationSize = 50,
    maxIterations = 200,
    convergenceThreshold = 0.001
  } = config

  const convergenceHistory: number[] = []
  let population: Solution[] = []

  // Generar población inicial
  for (let i = 0; i < populationSize; i++) {
    const solution = generateRandomSolution(variables, objectives)
    
    // Verificar constraints
    solution.feasible = constraints.every(c => c.validate(solution))
    
    // Optimización local con hill climbing
    const optimized = hillClimbing(solution, variables, objectives, 20)
    population.push(optimized)
  }

  // Evolución de la población
  let bestScore = 0
  let iterations = 0
  let converged = false

  while (iterations < maxIterations && !converged) {
    // Selección y cruce (simplified genetic algorithm)
    const newPopulation: Solution[] = []

    // Mantener élite (mejores 20%)
    population.sort((a, b) => b.score - a.score)
    const elite = population.slice(0, Math.floor(populationSize * 0.2))
    newPopulation.push(...elite)

    // Generar nuevas soluciones por cruce y mutación
    while (newPopulation.length < populationSize) {
      // Seleccionar padres (tournament selection)
      const parent1 = population[Math.floor(Math.random() * population.length)]
      const parent2 = population[Math.floor(Math.random() * population.length)]

      // Cruce (crossover)
      const child: Solution = {
        variables: new Map(),
        objectives: new Map(),
        score: 0,
        feasible: true
      }

      variables.forEach(v => {
        // 50% probabilidad de heredar de cada padre
        const value = Math.random() < 0.5
          ? parent1.variables.get(v.id) || v.currentValue
          : parent2.variables.get(v.id) || v.currentValue

        // Mutación (10% probabilidad)
        if (Math.random() < 0.1) {
          const mutation = (Math.random() - 0.5) * v.stepSize * 2
          child.variables.set(v.id, Math.max(v.minValue, Math.min(v.maxValue, value + mutation)))
        } else {
          child.variables.set(v.id, value)
        }
      })

      // Calcular fitness y verificar constraints
      calculateObjectives(child, variables, objectives)
      child.score = calculateWeightedScore(child, objectives)
      child.feasible = constraints.every(c => c.validate(child))

      // Optimización local
      const optimizedChild = hillClimbing(child, variables, objectives, 10)
      newPopulation.push(optimizedChild)
    }

    population = newPopulation

    // Tracking convergencia
    const currentBest = Math.max(...population.map(s => s.score))
    convergenceHistory.push(currentBest)

    if (Math.abs(currentBest - bestScore) < convergenceThreshold) {
      converged = true
    }
    bestScore = currentBest
    iterations++
  }

  // Encontrar frente de Pareto
  const paretoFront = findParetoFront(population, objectives)

  // Seleccionar mejor solución global
  const optimal = population.reduce((best, current) =>
    current.score > best.score ? current : best
  )

  // Calcular trade-offs
  const tradeOffs = calculateTradeOffs(optimal, variables, objectives)

  return {
    optimal,
    paretoFront,
    tradeOffs,
    convergenceHistory,
    iterations,
    executionTime: Date.now() - startTime
  }
}

/**
 * Calcula los trade-offs entre objetivos
 */
export function calculateTradeOffs(
  solution: Solution,
  variables: Variable[],
  objectives: Objective[]
): TradeOff[] {
  const tradeOffs: TradeOff[] = []

  // Analizar pares de objetivos
  for (let i = 0; i < objectives.length; i++) {
    for (let j = i + 1; j < objectives.length; j++) {
      const obj1 = objectives[i]
      const obj2 = objectives[j]

      // Calcular correlación mediante perturbación
      const samples: { o1: number; o2: number }[] = []

      variables.forEach(v => {
        const testSolution: Solution = {
          variables: new Map(solution.variables),
          objectives: new Map(),
          score: 0,
          feasible: true
        }

        // Perturbar variable
        const currentValue = solution.variables.get(v.id) || v.currentValue
        testSolution.variables.set(v.id, currentValue * 1.1)

        calculateObjectives(testSolution, variables, objectives)

        samples.push({
          o1: testSolution.objectives.get(obj1.id) || 0,
          o2: testSolution.objectives.get(obj2.id) || 0
        })
      })

      // Calcular correlación de Pearson
      const correlation = calculatePearsonCorrelation(samples)

      // Calcular sensibilidad
      const sensitivity = Math.abs(correlation) * 
        ((obj1.weight + obj2.weight) / 200)

      tradeOffs.push({
        objective1: obj1.name,
        objective2: obj2.name,
        correlation,
        sensitivity,
        optimalBalance: {
          obj1Value: solution.objectives.get(obj1.id) || 0,
          obj2Value: solution.objectives.get(obj2.id) || 0
        }
      })
    }
  }

  return tradeOffs
}

/**
 * Calcula la correlación de Pearson
 */
function calculatePearsonCorrelation(samples: { o1: number; o2: number }[]): number {
  const n = samples.length
  if (n === 0) return 0

  const sumO1 = samples.reduce((sum, s) => sum + s.o1, 0)
  const sumO2 = samples.reduce((sum, s) => sum + s.o2, 0)
  const sumO1Sq = samples.reduce((sum, s) => sum + s.o1 * s.o1, 0)
  const sumO2Sq = samples.reduce((sum, s) => sum + s.o2 * s.o2, 0)
  const sumO1O2 = samples.reduce((sum, s) => sum + s.o1 * s.o2, 0)

  const num = n * sumO1O2 - sumO1 * sumO2
  const den = Math.sqrt((n * sumO1Sq - sumO1 * sumO1) * (n * sumO2Sq - sumO2 * sumO2))

  return den === 0 ? 0 : num / den
}

/**
 * Genera recomendaciones basadas en la solución óptima
 */
export function generateRecommendations(
  result: OptimizationResult,
  variables: Variable[],
  objectives: Objective[]
): Array<{
  priority: 'high' | 'medium' | 'low'
  action: string
  impact: string
  timeframe: string
  resources: string[]
  risk: string
}> {
  const recommendations = []
  const solution = result.optimal

  // Analizar cambios en variables
  variables.forEach(v => {
    const currentValue = v.currentValue
    const optimalValue = solution.variables.get(v.id) || currentValue
    const change = ((optimalValue - currentValue) / currentValue) * 100

    if (Math.abs(change) > 5) {
      const priority = Math.abs(change) > 15 ? 'high' : 
                      Math.abs(change) > 10 ? 'medium' : 'low'

      recommendations.push({
        priority,
        action: `${change > 0 ? 'Aumentar' : 'Reducir'} ${v.name} de ${currentValue}${v.unit} a ${optimalValue.toFixed(1)}${v.unit}`,
        impact: `Cambio del ${Math.abs(change).toFixed(1)}% en ${v.name}`,
        timeframe: priority === 'high' ? '1-2 semanas' : 
                   priority === 'medium' ? '2-4 semanas' : '1-2 meses',
        resources: determineResources(v.id),
        risk: assessRisk(change, v.id)
      })
    }
  })

  // Agregar recomendaciones basadas en trade-offs
  result.tradeOffs
    .filter(t => Math.abs(t.correlation) > 0.7)
    .forEach(t => {
      const conflictType = t.correlation < 0 ? 'conflicto' : 'sinergia'
      
      recommendations.push({
        priority: 'medium',
        action: `Balancear ${t.objective1} y ${t.objective2} (${conflictType} detectado)`,
        impact: `Correlación de ${t.correlation.toFixed(2)} entre objetivos`,
        timeframe: '2-3 semanas',
        resources: ['Análisis detallado', 'Ajuste de estrategia'],
        risk: conflictType === 'conflicto' ? 'Medio - Objetivos en conflicto' : 'Bajo - Objetivos sinérgicos'
      })
    })

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

/**
 * Determina recursos necesarios para un cambio
 */
function determineResources(variableId: string): string[] {
  const resourceMap: { [key: string]: string[] } = {
    price: ['Análisis de mercado', 'Comunicación con clientes', 'Actualización de menús'],
    staff: ['Recursos humanos', 'Capacitación', 'Reorganización de turnos'],
    marketing: ['Presupuesto publicitario', 'Agencia/Consultor', 'Herramientas digitales'],
    inventory: ['Sistema de inventario', 'Proveedores', 'Almacenamiento'],
    menu: ['Chef/Cocina', 'Proveedores', 'Costeo de recetas']
  }

  return resourceMap[variableId] || ['Equipo interno', 'Presupuesto operativo']
}

/**
 * Evalúa el riesgo de un cambio
 */
function assessRisk(changePercent: number, variableId: string): string {
  const absChange = Math.abs(changePercent)
  
  if (variableId === 'price' && absChange > 15) {
    return 'Alto - Cambio significativo en precios puede afectar demanda'
  }
  if (variableId === 'staff' && changePercent < -10) {
    return 'Alto - Reducción de personal puede afectar servicio'
  }
  if (absChange > 20) {
    return 'Alto - Cambio drástico requiere gestión cuidadosa'
  }
  if (absChange > 10) {
    return 'Medio - Cambio moderado con impacto controlable'
  }
  
  return 'Bajo - Ajuste incremental con riesgo mínimo'
}