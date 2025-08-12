export interface RestaurantData {
  date: Date
  sales: {
    total: number
    food: number
    beverages: number
    alcohol: number
    delivery: number
    dineIn: number
    takeout: number
  }
  costs: {
    food: number
    labor: number
    overhead: number
    marketing: number
    utilities: number
    rent: number
  }
  metrics: {
    covers: number
    avgTicket: number
    tablesTurned: number
    laborHours: number
    foodCostPercentage: number
    laborCostPercentage: number
    primeGost: number
  }
  kpis: {
    grossProfit: number
    netProfit: number
    ebitda: number
    cashFlow: number
  }
}

export class RestaurantDataGenerator {
  private static baseMetrics = {
    avgDailySales: 4500,
    avgCovers: 120,
    avgTicket: 37.50,
    targetFoodCost: 0.30,
    targetLaborCost: 0.28,
    rent: 250, // daily
    utilities: 150 // daily
  }

  // Factores realistas por día de la semana
  private static dayFactors = {
    0: { sales: 1.3, covers: 1.2 },   // Domingo
    1: { sales: 0.6, covers: 0.5 },   // Lunes
    2: { sales: 0.65, covers: 0.55 }, // Martes
    3: { sales: 0.75, covers: 0.7 },  // Miércoles
    4: { sales: 0.95, covers: 0.9 },  // Jueves
    5: { sales: 1.5, covers: 1.4 },   // Viernes
    6: { sales: 1.6, covers: 1.5 }    // Sábado
  }

  // Factores estacionales por mes
  private static monthFactors = {
    0: 0.85,  // Enero (post-holidays slump)
    1: 0.9,   // Febrero
    2: 0.95,  // Marzo
    3: 1.0,   // Abril
    4: 1.1,   // Mayo
    5: 1.15,  // Junio
    6: 1.2,   // Julio (summer peak)
    7: 1.18,  // Agosto
    8: 1.05,  // Septiembre
    9: 1.0,   // Octubre
    10: 1.1,  // Noviembre (holidays start)
    11: 1.25  // Diciembre (holiday peak)
  }

  static generateDayData(date: Date): RestaurantData {
    const dayOfWeek = date.getDay()
    const month = date.getMonth()
    const dayFactor = this.dayFactors[dayOfWeek as keyof typeof this.dayFactors]
    const monthFactor = this.monthFactors[month as keyof typeof this.monthFactors]
    
    // Variación aleatoria para hacer los datos más realistas
    const randomVariation = 0.85 + Math.random() * 0.3
    
    // Calcular ventas totales
    const totalSales = this.baseMetrics.avgDailySales * 
                      dayFactor.sales * 
                      monthFactor * 
                      randomVariation

    // Calcular covers (clientes)
    const covers = Math.floor(
      this.baseMetrics.avgCovers * 
      dayFactor.covers * 
      monthFactor * 
      randomVariation
    )

    // Desglose de ventas
    const sales = {
      total: totalSales,
      food: totalSales * 0.62,
      beverages: totalSales * 0.18,
      alcohol: totalSales * 0.15,
      delivery: totalSales * 0.05,
      dineIn: totalSales * 0.75,
      takeout: totalSales * 0.20
    }

    // Calcular costos con variación realista
    const foodCostVariation = 0.28 + Math.random() * 0.06 // 28-34%
    const laborCostVariation = 0.26 + Math.random() * 0.06 // 26-32%
    
    const costs = {
      food: sales.food * foodCostVariation,
      labor: totalSales * laborCostVariation,
      overhead: totalSales * 0.08,
      marketing: totalSales * 0.03,
      utilities: this.baseMetrics.utilities * (0.9 + Math.random() * 0.2),
      rent: this.baseMetrics.rent
    }

    // Calcular métricas operativas
    const avgTicket = totalSales / covers
    const laborHours = 8 + (dayFactor.sales * 20) + (Math.random() * 5)
    
    const metrics = {
      covers,
      avgTicket,
      tablesTurned: dayFactor.covers * 2.5 + Math.random(),
      laborHours,
      foodCostPercentage: (costs.food / sales.food) * 100,
      laborCostPercentage: (costs.labor / totalSales) * 100,
      primeGost: ((costs.food + costs.labor) / totalSales) * 100
    }

    // Calcular KPIs financieros
    const totalCosts = Object.values(costs).reduce((sum, cost) => sum + cost, 0)
    const grossProfit = totalSales - costs.food
    const netProfit = totalSales - totalCosts
    const ebitda = netProfit + costs.overhead // Simplified EBITDA
    
    const kpis = {
      grossProfit,
      netProfit,
      ebitda,
      cashFlow: netProfit * 0.85 // Assuming 85% cash conversion
    }

    return {
      date,
      sales,
      costs,
      metrics,
      kpis
    }
  }

  static generateMonthData(month: number, year: number): RestaurantData[] {
    const daysInMonth = new Date(year, month, 0).getDate()
    const data: RestaurantData[] = []
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      data.push(this.generateDayData(date))
    }
    
    return data
  }

  static generateYearData(year: number): RestaurantData[] {
    const data: RestaurantData[] = []
    
    for (let month = 1; month <= 12; month++) {
      const monthData = this.generateMonthData(month, year)
      data.push(...monthData)
    }
    
    return data
  }

  // Agregar datos por período
  static aggregateData(
    data: RestaurantData[], 
    startDate: Date, 
    endDate: Date
  ): {
    totals: {
      sales: number
      costs: number
      grossProfit: number
      netProfit: number
      covers: number
    }
    averages: {
      dailySales: number
      ticketSize: number
      foodCostPercentage: number
      laborCostPercentage: number
      primeGost: number
    }
    breakdown: {
      salesByCategory: { [key: string]: number }
      costsByCategory: { [key: string]: number }
    }
  } {
    const filteredData = data.filter(d => 
      d.date >= startDate && d.date <= endDate
    )

    const totals = {
      sales: filteredData.reduce((sum, d) => sum + d.sales.total, 0),
      costs: filteredData.reduce((sum, d) => 
        sum + Object.values(d.costs).reduce((s, c) => s + c, 0), 0
      ),
      grossProfit: filteredData.reduce((sum, d) => sum + d.kpis.grossProfit, 0),
      netProfit: filteredData.reduce((sum, d) => sum + d.kpis.netProfit, 0),
      covers: filteredData.reduce((sum, d) => sum + d.metrics.covers, 0)
    }

    const averages = {
      dailySales: totals.sales / filteredData.length,
      ticketSize: totals.sales / totals.covers,
      foodCostPercentage: filteredData.reduce((sum, d) => 
        sum + d.metrics.foodCostPercentage, 0
      ) / filteredData.length,
      laborCostPercentage: filteredData.reduce((sum, d) => 
        sum + d.metrics.laborCostPercentage, 0
      ) / filteredData.length,
      primeGost: filteredData.reduce((sum, d) => 
        sum + d.metrics.primeGost, 0
      ) / filteredData.length
    }

    const salesByCategory = {
      'Alimentos': filteredData.reduce((sum, d) => sum + d.sales.food, 0),
      'Bebidas': filteredData.reduce((sum, d) => sum + d.sales.beverages, 0),
      'Alcohol': filteredData.reduce((sum, d) => sum + d.sales.alcohol, 0),
      'Delivery': filteredData.reduce((sum, d) => sum + d.sales.delivery, 0)
    }

    const costsByCategory = {
      'Alimentos': filteredData.reduce((sum, d) => sum + d.costs.food, 0),
      'Personal': filteredData.reduce((sum, d) => sum + d.costs.labor, 0),
      'Overhead': filteredData.reduce((sum, d) => sum + d.costs.overhead, 0),
      'Marketing': filteredData.reduce((sum, d) => sum + d.costs.marketing, 0),
      'Utilities': filteredData.reduce((sum, d) => sum + d.costs.utilities, 0),
      'Renta': filteredData.reduce((sum, d) => sum + d.costs.rent, 0)
    }

    return {
      totals,
      averages,
      breakdown: {
        salesByCategory,
        costsByCategory
      }
    }
  }
}
