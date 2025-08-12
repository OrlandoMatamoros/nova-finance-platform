// Función para formatear números de manera consistente
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const formatCurrency = (num: number): string => {
  return '$' + formatNumber(num)
}

export const formatPercentage = (num: number): string => {
  return num.toFixed(1) + '%'
}
