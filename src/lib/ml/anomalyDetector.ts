/**
 * Détecteur d'anomalies financières avec Machine Learning côté client
 *
 * Algorithmes:
 * 1. Z-Score: Détection montants suspects (>> moyenne)
 * 2. IQR Outliers: Détection patterns multi-dimensionnels
 * 3. Payment Delays: Détection retards paiement
 */

import * as stats from 'simple-statistics';
import type {
    Anomaly,
    AnomalyType,
    RiskLevel,
    DetectionConfig,
    DetectionResult,
    DEFAULT_CONFIG
} from './types';

/**
 * Classe principale de détection d'anomalies
 */
export class AnomalyDetector {
    private config: DetectionConfig;

    constructor(config?: Partial<DetectionConfig>) {
        this.config = {
            zScoreThreshold: config?.zScoreThreshold ?? 3,
            iqrMultiplier: config?.iqrMultiplier ?? 1.5,
            paymentDelayDays: config?.paymentDelayDays ?? 30,
            categorySpikeFactor: config?.categorySpikeFactor ?? 2.5,
            minConfidence: config?.minConfidence ?? 0.7,
            enabledDetectors: config?.enabledDetectors ?? [
                'amount_outlier',
                'payment_delay',
                'category_spike'
            ]
        };
    }

    /**
     * Détecte toutes les anomalies dans un dataset
     */
    public detect(rawData: any[]): DetectionResult {
        const startTime = Date.now();
        const anomalies: Anomaly[] = [];

        if (!rawData || rawData.length === 0) {
            return this.emptyResult(startTime);
        }

        // Détection par type
        if (this.config.enabledDetectors.includes('amount_outlier')) {
            anomalies.push(...this.detectAmountOutliers(rawData));
        }

        if (this.config.enabledDetectors.includes('payment_delay')) {
            anomalies.push(...this.detectPaymentDelays(rawData));
        }

        if (this.config.enabledDetectors.includes('category_spike')) {
            anomalies.push(...this.detectCategorySpikes(rawData));
        }

        // Filtrer par confiance minimale
        const filteredAnomalies = anomalies.filter(
            a => a.confidence >= this.config.minConfidence
        );

        // Trier par niveau de risque (critical > high > medium > low)
        const sortedAnomalies = this.sortByRisk(filteredAnomalies);

        return {
            anomalies: sortedAnomalies,
            summary: this.generateSummary(sortedAnomalies),
            executionTime: Date.now() - startTime
        };
    }

    /**
     * 1. Détection montants suspects via Z-Score
     */
    private detectAmountOutliers(data: any[]): Anomaly[] {
        const anomalies: Anomaly[] = [];

        // Séparer revenus et dépenses
        const revenues = data.filter(r => r.type === 'income' || r.amount > 0);
        const expenses = data.filter(r => r.type === 'expense' || r.amount < 0);

        // Analyser revenues
        anomalies.push(...this.analyzeAmounts(revenues, 'revenue'));

        // Analyser expenses
        anomalies.push(...this.analyzeAmounts(expenses, 'expense'));

        return anomalies;
    }

    private analyzeAmounts(records: any[], recordType: 'revenue' | 'expense'): Anomaly[] {
        if (records.length < 3) return []; // Pas assez de données

        const amounts = records.map(r => Math.abs(r.amount));
        const mean = stats.mean(amounts);
        const stdDev = stats.standardDeviation(amounts);

        if (stdDev === 0) return []; // Pas de variabilité

        const anomalies: Anomaly[] = [];

        records.forEach((record, index) => {
            const amount = Math.abs(record.amount);
            const zScore = (amount - mean) / stdDev;

            if (Math.abs(zScore) > this.config.zScoreThreshold) {
                const deviation = ((amount - mean) / mean) * 100;
                const riskLevel = this.calculateRiskLevel(Math.abs(zScore), 'amount');

                anomalies.push({
                    id: `amount_${recordType}_${index}_${Date.now()}`,
                    type: 'amount_outlier',
                    riskLevel,
                    title: `Montant ${recordType === 'revenue' ? 'revenu' : 'dépense'} suspect`,
                    description: `Transaction de ${this.formatCurrency(amount)} détectée, ${deviation > 0 ? '+' : ''}${deviation.toFixed(0)}% vs. moyenne (${this.formatCurrency(mean)})`,
                    value: amount,
                    expectedValue: mean,
                    deviation,
                    affectedRecord: record,
                    detectedAt: new Date(),
                    confidence: Math.min(0.95, Math.abs(zScore) / 5), // Max 95% confidence
                    metadata: {
                        zScore: zScore,
                        threshold: this.config.zScoreThreshold,
                        client: record.client || record.Client,
                        category: record.category || record.Categorie,
                        date: record.date || record.Date
                    }
                });
            }
        });

        return anomalies;
    }

    /**
     * 2. Détection retards de paiement
     */
    private detectPaymentDelays(data: any[]): Anomaly[] {
        const anomalies: Anomaly[] = [];
        const today = new Date();

        data.forEach((record, index) => {
            const status = record.status_paiement || record.Statut_paiement || '';
            const dueDate = this.parseDate(record.date_echeance || record.Date_echeance);

            // Si statut "En attente" ou "En cours" et date échéance dépassée
            if ((status.toLowerCase().includes('attente') || status.toLowerCase().includes('cours')) && dueDate) {
                const daysDiff = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

                if (daysDiff > this.config.paymentDelayDays) {
                    const amount = Math.abs(record.amount || record.Montant || 0);
                    const riskLevel = this.calculatePaymentRisk(daysDiff);

                    anomalies.push({
                        id: `payment_delay_${index}_${Date.now()}`,
                        type: 'payment_delay',
                        riskLevel,
                        title: 'Retard de paiement',
                        description: `Facture ${this.formatCurrency(amount)} en retard de ${daysDiff} jours (échéance: ${dueDate.toLocaleDateString('fr-FR')})`,
                        value: amount,
                        expectedValue: 0, // 0 jours de retard attendu
                        deviation: daysDiff,
                        affectedRecord: record,
                        detectedAt: new Date(),
                        confidence: 0.95, // Haute confiance (factuel)
                        metadata: {
                            client: record.client || record.Client,
                            category: record.category || record.Categorie,
                            date: record.date || record.Date,
                            daysLate: daysDiff
                        }
                    });
                }
            }
        });

        return anomalies;
    }

    /**
     * 3. Détection spikes par catégorie
     */
    private detectCategorySpikes(data: any[]): Anomaly[] {
        const anomalies: Anomaly[] = [];

        // Grouper par catégorie
        const byCategory: Record<string, any[]> = {};
        data.forEach(record => {
            const category = record.category || record.Categorie || 'Autres';
            if (!byCategory[category]) byCategory[category] = [];
            byCategory[category].push(record);
        });

        // Analyser chaque catégorie
        Object.entries(byCategory).forEach(([category, records]) => {
            if (records.length < 2) return; // Pas assez de données

            const amounts = records.map(r => Math.abs(r.amount || r.Montant || 0));
            const mean = stats.mean(amounts);
            const median = stats.median(amounts);

            records.forEach((record, index) => {
                const amount = Math.abs(record.amount || record.Montant || 0);

                // Si montant > 2.5× la moyenne de la catégorie
                if (amount > mean * this.config.categorySpikeFactor && mean > 0) {
                    const factor = amount / mean;
                    const riskLevel = this.calculateRiskLevel(factor, 'category');

                    anomalies.push({
                        id: `category_spike_${category}_${index}_${Date.now()}`,
                        type: 'category_spike',
                        riskLevel,
                        title: `Spike inhabituel - ${category}`,
                        description: `Transaction ${this.formatCurrency(amount)} dans "${category}", ${factor.toFixed(1)}× supérieure à la moyenne (${this.formatCurrency(mean)})`,
                        value: amount,
                        expectedValue: mean,
                        deviation: ((amount - mean) / mean) * 100,
                        affectedRecord: record,
                        detectedAt: new Date(),
                        confidence: Math.min(0.9, factor / 5),
                        metadata: {
                            category,
                            client: record.client || record.Client,
                            date: record.date || record.Date,
                            spikeFactor: factor
                        }
                    });
                }
            });
        });

        return anomalies;
    }

    /**
     * Utilitaires
     */
    private calculateRiskLevel(score: number, type: 'amount' | 'category'): RiskLevel {
        if (type === 'amount') {
            if (score >= 5) return 'critical';
            if (score >= 4) return 'high';
            if (score >= 3) return 'medium';
            return 'low';
        } else { // category
            if (score >= 5) return 'critical';
            if (score >= 3.5) return 'high';
            if (score >= 2.5) return 'medium';
            return 'low';
        }
    }

    private calculatePaymentRisk(daysLate: number): RiskLevel {
        if (daysLate >= 90) return 'critical';
        if (daysLate >= 60) return 'high';
        if (daysLate >= 30) return 'medium';
        return 'low';
    }

    private sortByRisk(anomalies: Anomaly[]): Anomaly[] {
        const riskOrder: Record<RiskLevel, number> = {
            critical: 4,
            high: 3,
            medium: 2,
            low: 1
        };

        return anomalies.sort((a, b) => riskOrder[b.riskLevel] - riskOrder[a.riskLevel]);
    }

    private generateSummary(anomalies: Anomaly[]) {
        const byRisk: Record<RiskLevel, number> = {
            low: 0,
            medium: 0,
            high: 0,
            critical: 0
        };

        const byType: Record<AnomalyType, number> = {
            amount_outlier: 0,
            payment_delay: 0,
            category_spike: 0,
            frequency_anomaly: 0,
            pattern_change: 0
        };

        anomalies.forEach(a => {
            byRisk[a.riskLevel]++;
            byType[a.type]++;
        });

        return {
            total: anomalies.length,
            byRisk,
            byType
        };
    }

    private parseDate(dateStr: string): Date | null {
        if (!dateStr) return null;

        // Try DD/MM/YYYY format
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // JS months are 0-indexed
            const year = parseInt(parts[2]);
            return new Date(year, month, day);
        }

        // Fallback to standard parsing
        const parsed = new Date(dateStr);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    private formatCurrency(value: number): string {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M€`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k€`;
        }
        return `${Math.round(value)}€`;
    }

    private emptyResult(startTime: number): DetectionResult {
        return {
            anomalies: [],
            summary: {
                total: 0,
                byRisk: { low: 0, medium: 0, high: 0, critical: 0 },
                byType: {
                    amount_outlier: 0,
                    payment_delay: 0,
                    category_spike: 0,
                    frequency_anomaly: 0,
                    pattern_change: 0
                }
            },
            executionTime: Date.now() - startTime
        };
    }
}

/**
 * Helper function pour usage simple
 */
export function detectAnomalies(rawData: any[], config?: Partial<DetectionConfig>): DetectionResult {
    const detector = new AnomalyDetector(config);
    return detector.detect(rawData);
}
