/**
 * UI Adapters - Convertit les types de l'agent vers les types attendus par les composants UI
 */

import type { MarginData, TopClient, Anomaly as DashisAnomaly } from './types';
import type { Anomaly as UIAnomaly } from '@/lib/ml/types';

/**
 * Adapte MarginData (agent) vers le format attendu par MarginEvolutionChart
 */
export function adaptMarginDataForChart(marginData: MarginData[]): Array<{
    month: string;
    marginPercentage: number;
}> {
    return marginData.map(item => ({
        month: item.month,
        marginPercentage: item.marginPercent // marginPercent → marginPercentage
    }));
}

/**
 * Adapte TopClient (agent) vers le format attendu par TopClientsVerticalChart
 */
export function adaptTopClientsForChart(topClients: TopClient[]): Array<{
    name: string;
    value: number;
}> {
    return topClients.map(client => ({
        name: client.name,
        value: client.revenue // revenue → value
    }));
}

/**
 * Adapte Anomaly (agent) vers le format attendu par AnomalyPanel
 */
export function adaptAnomaliesForUI(anomalies: DashisAnomaly[]): UIAnomaly[] {
    return anomalies.map(anomaly => ({
        id: anomaly.id,
        type: mapAnomalyType(anomaly.type),
        riskLevel: mapSeverityToRiskLevel(anomaly.severity),
        title: anomaly.title,
        description: anomaly.description,
        value: anomaly.value || 0,
        expectedValue: anomaly.expectedRange?.min,
        deviation: anomaly.confidence ? (1 - anomaly.confidence) * 100 : undefined,
        affectedRecord: anomaly.metadata,
        detectedAt: new Date(),
        confidence: anomaly.confidence,
        metadata: anomaly.metadata
    }));
}

/**
 * Mappe les types d'anomalies (agent) vers les types UI
 */
function mapAnomalyType(type: DashisAnomaly['type']): UIAnomaly['type'] {
    // 'duplicate' n'existe pas dans UI, on le mappe vers 'amount_outlier'
    if (type === 'duplicate') return 'amount_outlier';
    return type;
}

/**
 * Mappe severity (agent) vers riskLevel (UI)
 */
function mapSeverityToRiskLevel(severity: 'high' | 'medium' | 'low'): 'critical' | 'high' | 'medium' | 'low' {
    if (severity === 'high') return 'critical';
    return severity;
}
