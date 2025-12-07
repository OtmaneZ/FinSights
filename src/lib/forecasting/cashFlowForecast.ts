/**
 * CASH FLOW FORECAST - Algorithme de prévisions 3-12 mois
 *
 * Méthode: Régression linéaire + détection saisonnalité + scénarios
 */

import { FinancialRecord } from '../dataModel';
import { logger } from '@/lib/logger';
import {
    CashFlowForecast,
    ForecastDataPoint,
    ForecastInsight,
    SeasonalityPattern,
    ForecastConfig
} from './types';

const DEFAULT_CONFIG: ForecastConfig = {
    horizon: 6,
    optimisticMultiplier: 1.15,
    pessimisticMultiplier: 0.80,
    minHistoricalMonths: 2,
    includeSeasonality: true
};

/**
 * Fonction principale : Génère prévisions cash flow
 */
export function forecastCashFlow(
    records: FinancialRecord[],
    config: Partial<ForecastConfig> = {}
): CashFlowForecast | null {
    const cfg = { ...DEFAULT_CONFIG, ...config };

    // Validation données minimum
    if (!records || records.length < 10) {
        logger.warn('Forecast: Pas assez de données (min 10 transactions)');
        return null;
    }

    // 1. Agréger par mois
    const monthlyData = aggregateByMonth(records);

    // Vérifier nombre de mois
    if (monthlyData.length < cfg.minHistoricalMonths) {
        logger.warn(`Forecast: Besoin de ${cfg.minHistoricalMonths} mois, trouvé ${monthlyData.length}`);
        return null;
    }

    // 2. Calculer tendance (régression linéaire)
    const trend = calculateTrend(monthlyData);

    // 3. Détecter saisonnalité (si assez de données)
    const seasonality = cfg.includeSeasonality && monthlyData.length >= 6
        ? detectSeasonality(monthlyData)
        : { detected: false, strength: 0, peakMonths: [], lowMonths: [] };

    // 4. Générer prévisions baseline
    const baseline = generateBaselineForecasts(
        monthlyData,
        trend,
        seasonality,
        cfg.horizon
    );

    // 5. Générer scénarios optimiste/pessimiste
    const optimistic = applyScenarioMultiplier(baseline, cfg.optimisticMultiplier);
    const pessimistic = applyScenarioMultiplier(baseline, cfg.pessimisticMultiplier);

    // 6. Préparer données historiques pour le graphique
    const historical = prepareHistoricalData(monthlyData);

    // 7. Calculer métriques (runway, risque, etc.)
    const metrics = calculateMetrics(baseline, pessimistic, monthlyData);

    // 8. Générer insights
    const insights = generateInsights(metrics, trend, seasonality);

    return {
        historical,
        baseline,
        optimistic,
        pessimistic,
        metrics,
        insights,
        generatedAt: new Date(),
        horizon: cfg.horizon,
        minDataMonths: monthlyData.length
    };
}

/**
 * 1. Agrégation mensuelle du cash flow
 */
interface MonthlyAggregate {
    date: Date;
    cashFlow: number;  // Net (revenus - dépenses)
    revenue: number;
    expenses: number;
}

function aggregateByMonth(records: FinancialRecord[]): MonthlyAggregate[] {
    const byMonth = new Map<string, { revenue: number; expenses: number }>();

    records.forEach(record => {
        const date = new Date(record.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!byMonth.has(monthKey)) {
            byMonth.set(monthKey, { revenue: 0, expenses: 0 });
        }

        const month = byMonth.get(monthKey)!;

        if (record.type === 'income') {
            month.revenue += record.amount;
        } else {
            month.expenses += Math.abs(record.amount);
        }
    });

    // Convertir Map en array trié
    return Array.from(byMonth.entries())
        .map(([monthKey, data]) => {
            const [year, month] = monthKey.split('-').map(Number);
            return {
                date: new Date(year, month - 1, 1),
                cashFlow: data.revenue - data.expenses,
                revenue: data.revenue,
                expenses: data.expenses
            };
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * 2. Calcul de tendance (régression linéaire simple)
 */
interface Trend {
    slope: number;       // Pente (€/mois)
    intercept: number;
    r2: number;          // Qualité du fit (0-1)
    direction: 'improving' | 'stable' | 'declining';
}

function calculateTrend(monthlyData: MonthlyAggregate[]): Trend {
    const n = monthlyData.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = monthlyData.map(m => m.cashFlow);

    // Calculs régression linéaire
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
    const sumYY = y.reduce((acc, yi) => acc + yi * yi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Coefficient de détermination R²
    const meanY = sumY / n;
    const ssTotal = sumYY - n * meanY * meanY;
    const ssResidual = y.reduce((acc, yi, i) => {
        const predicted = slope * x[i] + intercept;
        return acc + Math.pow(yi - predicted, 2);
    }, 0);
    const r2 = Math.max(0, 1 - (ssResidual / ssTotal));

    // Direction de la tendance
    let direction: Trend['direction'];
    if (slope > 1000) {
        direction = 'improving';  // > 1k€/mois amélioration
    } else if (slope < -1000) {
        direction = 'declining';  // < -1k€/mois déclin
    } else {
        direction = 'stable';
    }

    return { slope, intercept, r2, direction };
}

/**
 * 3. Détection saisonnalité (patterns mensuels)
 */
function detectSeasonality(monthlyData: MonthlyAggregate[]): SeasonalityPattern {
    // Besoin d'au moins 6 mois pour détecter patterns
    if (monthlyData.length < 6) {
        return { detected: false, strength: 0, peakMonths: [], lowMonths: [] };
    }

    // Grouper par mois de l'année (1-12)
    const byMonthOfYear = new Map<number, number[]>();

    monthlyData.forEach(m => {
        const monthNum = m.date.getMonth() + 1; // 1-12
        if (!byMonthOfYear.has(monthNum)) {
            byMonthOfYear.set(monthNum, []);
        }
        byMonthOfYear.get(monthNum)!.push(m.cashFlow);
    });

    // Calculer moyenne par mois
    const monthAverages = Array.from(byMonthOfYear.entries())
        .map(([month, values]) => ({
            month,
            avg: values.reduce((a, b) => a + b, 0) / values.length
        }));

    if (monthAverages.length < 4) {
        return { detected: false, strength: 0, peakMonths: [], lowMonths: [] };
    }

    // Calculer écart-type des moyennes mensuelles
    const overallAvg = monthAverages.reduce((sum, m) => sum + m.avg, 0) / monthAverages.length;
    const variance = monthAverages.reduce((sum, m) => sum + Math.pow(m.avg - overallAvg, 2), 0) / monthAverages.length;
    const stdDev = Math.sqrt(variance);

    // Force de la saisonnalité = coefficient de variation
    const strength = Math.abs(overallAvg) > 0 ? Math.min(1, stdDev / Math.abs(overallAvg)) : 0;

    // Identifier mois pics et creux (±0.5 std dev)
    const peakMonths = monthAverages
        .filter(m => m.avg > overallAvg + stdDev * 0.5)
        .map(m => m.month);

    const lowMonths = monthAverages
        .filter(m => m.avg < overallAvg - stdDev * 0.5)
        .map(m => m.month);

    const detected = strength > 0.2 && (peakMonths.length > 0 || lowMonths.length > 0);

    return { detected, strength, peakMonths, lowMonths };
}

/**
 * 4. Génération prévisions baseline
 */
function generateBaselineForecasts(
    monthlyData: MonthlyAggregate[],
    trend: Trend,
    seasonality: SeasonalityPattern,
    horizon: number
): ForecastDataPoint[] {
    const forecasts: ForecastDataPoint[] = [];
    const lastMonth = monthlyData[monthlyData.length - 1];
    const lastIndex = monthlyData.length - 1;

    for (let i = 1; i <= horizon; i++) {
        const futureDate = new Date(lastMonth.date);
        futureDate.setMonth(futureDate.getMonth() + i);

        // Valeur baseline = tendance linéaire
        let predictedValue = trend.slope * (lastIndex + i) + trend.intercept;

        // Ajuster avec saisonnalité si détectée
        if (seasonality.detected && seasonality.strength > 0.3) {
            const monthNum = futureDate.getMonth() + 1;
            const isPeak = seasonality.peakMonths.includes(monthNum);
            const isLow = seasonality.lowMonths.includes(monthNum);

            if (isPeak) {
                predictedValue *= (1 + seasonality.strength * 0.3); // Boost pics
            } else if (isLow) {
                predictedValue *= (1 - seasonality.strength * 0.3); // Réduction creux
            }
        }

        forecasts.push({
            date: futureDate,
            value: Math.round(predictedValue),
            type: 'forecast',
            scenario: 'baseline'
        });
    }

    return forecasts;
}

/**
 * 5. Application multiplicateur scénario (optimiste/pessimiste)
 */
function applyScenarioMultiplier(
    baseline: ForecastDataPoint[],
    multiplier: number
): ForecastDataPoint[] {
    return baseline.map(point => ({
        ...point,
        value: Math.round(point.value * multiplier),
        scenario: multiplier > 1 ? 'optimistic' : 'pessimistic'
    }));
}

/**
 * 6. Préparation données historiques pour graphique
 */
function prepareHistoricalData(monthlyData: MonthlyAggregate[]): ForecastDataPoint[] {
    // Prendre les 3 derniers mois max pour le graphique
    const recentMonths = monthlyData.slice(-3);

    return recentMonths.map(m => ({
        date: m.date,
        value: Math.round(m.cashFlow),
        type: 'historical' as const
    }));
}

/**
 * 7. Calcul métriques clés
 */
function calculateMetrics(
    baseline: ForecastDataPoint[],
    pessimistic: ForecastDataPoint[],
    historicalData: MonthlyAggregate[]
): CashFlowForecast['metrics'] {
    const currentCash = historicalData[historicalData.length - 1].cashFlow;

    // Calculer runway (mois avant rupture) sur scénario pessimiste
    let runway = 12; // Max par défaut
    let runwayDate: Date | null = null;
    let cumulativeCash = currentCash;

    for (let i = 0; i < pessimistic.length; i++) {
        cumulativeCash += pessimistic[i].value;

        if (cumulativeCash < 0) {
            runway = i + 1;
            runwayDate = pessimistic[i].date;
            break;
        }
    }

    // Si pas de rupture détectée dans l'horizon, runway = horizon max
    if (runwayDate === null && pessimistic.length > 0) {
        runway = pessimistic.length;
    }

    // Déterminer tendance globale
    const firstForecast = baseline[0]?.value || 0;
    const lastForecast = baseline[baseline.length - 1]?.value || 0;
    const trendDiff = lastForecast - firstForecast;

    let trend: 'improving' | 'stable' | 'declining';
    if (trendDiff > 5000) trend = 'improving';
    else if (trendDiff < -5000) trend = 'declining';
    else trend = 'stable';

    // Calculer confiance (basée sur stabilité historique)
    const historicalVariance = calculateVariance(historicalData.map(m => m.cashFlow));
    const historicalMean = historicalData.reduce((sum, m) => sum + m.cashFlow, 0) / historicalData.length;
    const cv = Math.abs(historicalMean) > 0 ? Math.sqrt(historicalVariance) / Math.abs(historicalMean) : 1;
    const confidence = Math.max(0.3, Math.min(0.95, 1 - cv)); // Entre 30% et 95%

    // Niveau de risque
    let riskLevel: 'safe' | 'warning' | 'critical';
    if (runway >= 6) riskLevel = 'safe';
    else if (runway >= 3) riskLevel = 'warning';
    else riskLevel = 'critical';

    return {
        runway,
        runwayDate,
        trend,
        confidence,
        riskLevel
    };
}

function calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
}

/**
 * 8. Génération insights automatiques
 */
function generateInsights(
    metrics: CashFlowForecast['metrics'],
    trend: Trend,
    seasonality: SeasonalityPattern
): ForecastInsight[] {
    const insights: ForecastInsight[] = [];

    // Insight #1: Runway
    if (metrics.riskLevel === 'critical') {
        insights.push({
            type: 'critical',
            title: '🚨 Runway critique',
            description: `Risque de rupture de trésorerie dans ${metrics.runway} mois (${metrics.runwayDate?.toLocaleDateString('fr-FR') || 'N/A'})`,
            recommendation: 'Action immédiate requise: lever fonds, réduire charges ou accélérer encaissements'
        });
    } else if (metrics.riskLevel === 'warning') {
        insights.push({
            type: 'warning',
            title: '⚠️ Runway serré',
            description: `${metrics.runway} mois de trésorerie restants en scénario pessimiste`,
            recommendation: 'Sécuriser ligne de crédit ou préparer levée de fonds'
        });
    } else {
        insights.push({
            type: 'positive',
            title: '✅ Runway sain',
            description: `${metrics.runway}+ mois de trésorerie assurés`,
            recommendation: 'Position favorable pour investir dans la croissance'
        });
    }

    // Insight #2: Tendance
    if (metrics.trend === 'improving') {
        insights.push({
            type: 'positive',
            title: '📈 Tendance positive',
            description: 'Cash flow en amélioration sur les 6 prochains mois',
            recommendation: 'Maintenir la dynamique actuelle'
        });
    } else if (metrics.trend === 'declining') {
        insights.push({
            type: 'warning',
            title: '📉 Tendance baissière',
            description: 'Dégradation prévue du cash flow',
            recommendation: 'Audit charges + révision prix urgents'
        });
    }

    // Insight #3: Saisonnalité
    if (seasonality.detected) {
        const peakMonthNames = seasonality.peakMonths.map(m =>
            new Date(2024, m - 1, 1).toLocaleString('fr-FR', { month: 'long' })
        );
        const lowMonthNames = seasonality.lowMonths.map(m =>
            new Date(2024, m - 1, 1).toLocaleString('fr-FR', { month: 'long' })
        );

        if (peakMonthNames.length > 0) {
            insights.push({
                type: 'positive',
                title: '📊 Saisonnalité détectée',
                description: `Mois forts: ${peakMonthNames.join(', ')}. Mois faibles: ${lowMonthNames.join(', ')}`,
                recommendation: 'Anticiper creux: constituer réserve durant pics'
            });
        }
    }

    // Insight #4: Confiance prévision
    if (metrics.confidence < 0.6) {
        insights.push({
            type: 'warning',
            title: '⚠️ Volatilité élevée',
            description: `Confiance prévision: ${Math.round(metrics.confidence * 100)}% (données volatiles)`,
            recommendation: 'Monitorer hebdomadaire + préparer scénarios de secours'
        });
    }

    return insights;
}
