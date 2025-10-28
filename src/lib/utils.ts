// Utility functions for financial calculations and formatting

export const formatCurrency = (
    amount: number,
    currency: string = 'EUR',
    locale: string = 'fr-FR'
): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount)
}

export const formatPercentage = (
    value: number,
    decimals: number = 1
): string => {
    return `${value.toFixed(decimals)}%`
}

export const calculateGrowthRate = (
    current: number,
    previous: number
): number => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
}

export const calculateMovingAverage = (
    values: number[],
    periods: number
): number[] => {
    const result: number[] = []

    for (let i = 0; i < values.length; i++) {
        if (i < periods - 1) {
            result.push(0) // Not enough data for moving average
        } else {
            const sum = values.slice(i - periods + 1, i + 1).reduce((a, b) => a + b, 0)
            result.push(sum / periods)
        }
    }

    return result
}

export const calculateDSO = (
    accountsReceivable: number,
    revenue: number,
    days: number = 365
): number => {
    return (accountsReceivable / revenue) * days
}

export const calculateCurrentRatio = (
    currentAssets: number,
    currentLiabilities: number
): number => {
    if (currentLiabilities === 0) return 0
    return currentAssets / currentLiabilities
}

export const calculateWorkingCapital = (
    currentAssets: number,
    currentLiabilities: number
): number => {
    return currentAssets - currentLiabilities
}

export const predictCashFlow = (
    historicalData: number[],
    periods: number = 3
): number[] => {
    // Simple linear regression for cash flow prediction
    if (historicalData.length < 2) return []

    const n = historicalData.length
    const x = Array.from({ length: n }, (_, i) => i)
    const y = historicalData

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0)
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    const predictions: number[] = []
    for (let i = 0; i < periods; i++) {
        const futureX = n + i
        predictions.push(slope * futureX + intercept)
    }

    return predictions
}

export const detectAnomalies = (
    values: number[],
    threshold: number = 2
): number[] => {
    if (values.length < 3) return []

    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length
    const standardDeviation = Math.sqrt(variance)

    return values
        .map((value, index) => ({
            index,
            value,
            zScore: Math.abs((value - mean) / standardDeviation)
        }))
        .filter(item => item.zScore > threshold)
        .map(item => item.index)
}

export const getFinancialInsight = (
    metric: string,
    currentValue: number,
    previousValue: number,
    threshold?: number
): string => {
    const change = calculateGrowthRate(currentValue, previousValue)

    switch (metric.toLowerCase()) {
        case 'cashflow':
        case 'trésorerie':
            if (change > 10) return 'Excellente progression de trésorerie'
            if (change < -15) return 'Attention: dégradation de la trésorerie'
            return 'Trésorerie stable'

        case 'marge':
        case 'margin':
            if (change > 5) return 'Amélioration notable de la marge'
            if (change < -3) return 'Érosion de la marge à surveiller'
            return 'Marge maintenue'

        case 'dso':
        case 'délai':
            if (change > 10) return 'Allongement préoccupant des délais de paiement'
            if (change < -5) return 'Amélioration des délais de recouvrement'
            return 'Délais de paiement stables'

        default:
            return change > 0 ? 'Tendance positive' : 'Tendance négative'
    }
}