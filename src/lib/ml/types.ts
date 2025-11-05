/**
 * Types et interfaces pour le système de détection d'anomalies ML
 */

export type AnomalyType = 
    | 'amount_outlier'        // Montant suspect (>> moyenne)
    | 'payment_delay'         // Retard de paiement
    | 'category_spike'        // Spike inhabituel dans catégorie
    | 'frequency_anomaly'     // Fréquence anormale transactions
    | 'pattern_change';       // Changement de pattern

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Anomaly {
    id: string;                    // ID unique
    type: AnomalyType;             // Type d'anomalie
    riskLevel: RiskLevel;          // Niveau de risque
    title: string;                 // Titre court
    description: string;           // Description détaillée
    value: number;                 // Valeur concernée
    expectedValue?: number;        // Valeur attendue (pour comparaison)
    deviation?: number;            // Écart en % ou absolu
    affectedRecord?: any;          // Enregistrement concerné
    detectedAt: Date;              // Date de détection
    confidence: number;            // Confiance (0-1)
    metadata?: {                   // Métadonnées additionnelles
        category?: string;
        client?: string;
        date?: string;
        zScore?: number;
        threshold?: number;
        daysLate?: number;
        spikeFactor?: number;
        [key: string]: any;        // Flexibilité pour autres métadonnées
    };
}

export interface DetectionConfig {
    zScoreThreshold: number;       // Seuil Z-score (défaut: 3)
    iqrMultiplier: number;         // Multiplicateur IQR (défaut: 1.5)
    paymentDelayDays: number;      // Jours avant alerte retard (défaut: 30)
    categorySpikeFactor: number;   // Facteur spike catégorie (défaut: 2.5)
    minConfidence: number;         // Confiance minimale (défaut: 0.7)
    enabledDetectors: AnomalyType[]; // Détecteurs activés
}

export interface DetectionResult {
    anomalies: Anomaly[];
    summary: {
        total: number;
        byRisk: Record<RiskLevel, number>;
        byType: Record<AnomalyType, number>;
    };
    executionTime: number;         // Temps d'exécution (ms)
}

export const DEFAULT_CONFIG: DetectionConfig = {
    zScoreThreshold: 3,
    iqrMultiplier: 1.5,
    paymentDelayDays: 30,
    categorySpikeFactor: 2.5,
    minConfidence: 0.7,
    enabledDetectors: [
        'amount_outlier',
        'payment_delay',
        'category_spike'
    ]
};
