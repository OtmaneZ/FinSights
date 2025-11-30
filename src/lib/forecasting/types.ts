/**
 * Types pour les prévisions financières (Cash Flow Forecast)
 */

export interface ForecastDataPoint {
    date: Date;
    value: number;
    type: 'historical' | 'forecast';
    scenario?: 'baseline' | 'optimistic' | 'pessimistic';
}

export interface CashFlowForecast {
    // Données pour le graphique
    historical: ForecastDataPoint[];      // 2-3 derniers mois réels
    baseline: ForecastDataPoint[];        // Prévision centrale
    optimistic: ForecastDataPoint[];      // +15% scénario
    pessimistic: ForecastDataPoint[];     // -20% scénario
    
    // Métriques clés
    metrics: {
        runway: number;                    // Mois avant rupture cash
        runwayDate: Date | null;           // Date rupture estimée
        trend: 'improving' | 'stable' | 'declining';
        confidence: number;                // 0-1 (qualité prévision)
        riskLevel: 'safe' | 'warning' | 'critical';
    };
    
    // Insights générés
    insights: ForecastInsight[];
    
    // Meta
    generatedAt: Date;
    horizon: 3 | 6 | 12;                  // Mois prévus
    minDataMonths: number;                 // Mois historiques utilisés
}

export interface ForecastInsight {
    type: 'positive' | 'warning' | 'critical';
    title: string;
    description: string;
    recommendation?: string;
}

export interface SeasonalityPattern {
    detected: boolean;
    strength: number;                      // 0-1 (force du pattern)
    peakMonths: number[];                  // Mois de pic (1-12)
    lowMonths: number[];                   // Mois creux (1-12)
}

export interface ForecastConfig {
    horizon: 3 | 6 | 12;
    optimisticMultiplier: number;          // Default: 1.15 (+15%)
    pessimisticMultiplier: number;         // Default: 0.80 (-20%)
    minHistoricalMonths: number;           // Default: 2
    includeSeasonality: boolean;           // Default: true
}
