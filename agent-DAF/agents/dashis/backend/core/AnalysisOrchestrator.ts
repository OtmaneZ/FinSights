/**
 * DASHIS - AnalysisOrchestrator
 * 
 * Orchestrates the entire AI/ML/Scoring analysis sequence:
 * 1. ML Anomaly Detection (detectAnomalies)
 * 2. AI Cash Flow Predictions (generateCashFlowPredictions)
 * 3. AI Advanced Patterns (detectAdvancedPatterns)
 * 4. Scoring FinSight™ (calculateFinSightScore)
 * 
 * Pure orchestration logic, no UI dependencies.
 */

import type {
    FinancialData,
    FinancialRecord,
    AnalysisResult,
    Anomaly,
    CashFlowPrediction,
    PredictionAlert,
    AdvancedPattern,
    FinSightScore
} from './types';

// External dependencies (existing modules in src/lib)
import { AnomalyDetector } from '@/lib/ml/anomalyDetector';
import { generateCashFlowPredictions } from '@/lib/ai/predictions';
import { detectAdvancedPatterns } from '@/lib/ai/patterns';
import { calculateFinSightScore } from '@/lib/scoring/finSightScore';
import { logger } from '@/lib/logger';

export interface AnalysisConfig {
    // ML Detection
    enableAnomalyDetection: boolean;
    anomalyThreshold?: number;

    // AI Predictions
    enableCashFlowPredictions: boolean;
    minRecordsForPrediction: number;

    // AI Patterns
    enablePatternDetection: boolean;
    minRecordsForPatterns: number;

    // Scoring
    enableScoring: boolean;

    // Context
    sector?: string;
    companyName?: string;
    teamSize?: number;
}

const DEFAULT_CONFIG: AnalysisConfig = {
    enableAnomalyDetection: true,
    anomalyThreshold: 3,
    enableCashFlowPredictions: true,
    minRecordsForPrediction: 10,
    enablePatternDetection: true,
    minRecordsForPatterns: 20,
    enableScoring: true
};

export class AnalysisOrchestrator {
    private config: AnalysisConfig;
    private anomalyDetector: AnomalyDetector;

    constructor(config: Partial<AnalysisConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.anomalyDetector = new AnomalyDetector({
            zScoreThreshold: this.config.anomalyThreshold
        });
    }

    /**
     * Run complete analysis sequence on financial data
     * Returns comprehensive AnalysisResult with all insights
     */
    public async analyze(
        data: FinancialData,
        rawRecords: FinancialRecord[]
    ): Promise<AnalysisResult> {
        const startTime = Date.now();

        logger.debug('[AnalysisOrchestrator] 🚀 Starting analysis sequence...', {
            recordCount: rawRecords.length,
            enabledModules: {
                anomalies: this.config.enableAnomalyDetection,
                predictions: this.config.enableCashFlowPredictions,
                patterns: this.config.enablePatternDetection,
                scoring: this.config.enableScoring
            }
        });

        const result: AnalysisResult = {
            anomalies: [],
            cashFlowPredictions: [],
            predictionAlerts: [],
            patterns: [],
            finSightScore: null,
            seasonalityDetected: false,
            metadata: {
                analyzedAt: new Date(),
                recordCount: rawRecords.length,
                modulesExecuted: [],
                executionTimeMs: 0
            }
        };

        try {
            // STEP 1: ML Anomaly Detection
            if (this.config.enableAnomalyDetection && rawRecords.length > 0) {
                result.anomalies = await this.detectAnomalies(rawRecords);
                result.metadata.modulesExecuted.push('anomaly_detection');
                logger.debug(`[AnalysisOrchestrator] ✅ ML: ${result.anomalies.length} anomalies detected`);
            }

            // STEP 2: AI Cash Flow Predictions
            if (
                this.config.enableCashFlowPredictions &&
                rawRecords.length >= this.config.minRecordsForPrediction
            ) {
                const predResult = await this.generatePredictions(rawRecords);
                result.cashFlowPredictions = predResult.predictions;
                result.predictionAlerts = predResult.alerts;
                result.seasonalityDetected = predResult.seasonalityDetected;
                result.metadata.modulesExecuted.push('cash_flow_predictions');
                logger.debug(`[AnalysisOrchestrator] ✅ AI: ${result.cashFlowPredictions.length} months predicted`);
            }

            // STEP 3: AI Advanced Patterns
            if (
                this.config.enablePatternDetection &&
                rawRecords.length >= this.config.minRecordsForPatterns
            ) {
                result.patterns = await this.detectPatterns(rawRecords);
                result.metadata.modulesExecuted.push('pattern_detection');
                logger.debug(`[AnalysisOrchestrator] ✅ AI: ${result.patterns.length} patterns detected`);
            }

            // STEP 4: FinSight™ Score
            if (this.config.enableScoring && data) {
                result.finSightScore = await this.calculateScore(data);
                result.metadata.modulesExecuted.push('finsight_scoring');
                logger.debug(`[AnalysisOrchestrator] ✅ Score: ${result.finSightScore?.total}/100`);
            }

            const executionTime = Date.now() - startTime;
            result.metadata.executionTimeMs = executionTime;

            logger.debug(`[AnalysisOrchestrator] 🎉 Analysis complete in ${executionTime}ms`, {
                anomalies: result.anomalies.length,
                predictions: result.cashFlowPredictions.length,
                patterns: result.patterns.length,
                score: result.finSightScore?.total
            });

            return result;

        } catch (error) {
            logger.error('[AnalysisOrchestrator] ❌ Analysis failed:', error);
            throw new Error(`Analysis orchestration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * STEP 1: Detect anomalies using ML
     * Wraps AnomalyDetector and returns Anomaly[] array
     */
    private async detectAnomalies(rawRecords: FinancialRecord[]): Promise<Anomaly[]> {
        try {
            const detectionResult = this.anomalyDetector.detect(rawRecords);

            // Map from ML types to our types (handle missing properties gracefully)
            const anomalies: Anomaly[] = detectionResult.anomalies.map((a: any) => ({
                id: a.id,
                date: a.date,
                type: a.type as 'amount_outlier' | 'payment_delay' | 'category_spike' | 'duplicate',
                severity: a.severity as 'high' | 'medium' | 'low',
                title: a.description || 'Anomalie détectée',
                description: a.details || a.description,
                confidence: a.confidence,
                value: a.transaction?.amount,
                expectedRange: a.expectedValue !== undefined && a.deviation !== undefined
                    ? {
                        min: a.expectedValue - a.deviation,
                        max: a.expectedValue + a.deviation
                    }
                    : undefined,
                metadata: {
                    amount: a.transaction?.amount,
                    counterparty: a.transaction?.counterparty,
                    category: a.transaction?.category,
                    expectedValue: a.expectedValue,
                    actualValue: a.actualValue,
                    deviation: a.deviation
                }
            }));

            return anomalies;

        } catch (error) {
            logger.error('[AnalysisOrchestrator] Anomaly detection error:', error);
            return []; // Non-blocking: return empty array
        }
    }

    /**
     * STEP 2: Generate cash flow predictions with AI
     * Calls /api/ai/predictions (server-side GPT-4)
     */
    private async generatePredictions(rawRecords: FinancialRecord[]): Promise<{
        predictions: CashFlowPrediction[];
        alerts: PredictionAlert[];
        seasonalityDetected: boolean;
    }> {
        try {
            const result = await generateCashFlowPredictions(rawRecords);

            if (!result.success) {
                logger.warn('[AnalysisOrchestrator] Predictions failed:', result.error);
                return { predictions: [], alerts: [], seasonalityDetected: false };
            }

            return {
                predictions: result.predictions || [],
                alerts: result.alerts || [],
                seasonalityDetected: result.seasonalityDetected || false
            };

        } catch (error) {
            logger.error('[AnalysisOrchestrator] Predictions error:', error);
            return { predictions: [], alerts: [], seasonalityDetected: false };
        }
    }

    /**
     * STEP 3: Detect advanced patterns with AI
     * Calls /api/ai/patterns (server-side GPT-4)
     */
    private async detectPatterns(rawRecords: FinancialRecord[]): Promise<AdvancedPattern[]> {
        try {
            const result = await detectAdvancedPatterns(rawRecords, {
                sector: this.config.sector,
                companyName: this.config.companyName,
                teamSize: this.config.teamSize
            });

            if (!result.success) {
                logger.warn('[AnalysisOrchestrator] Patterns detection failed:', result.error);
                return [];
            }

            // Map patterns to include missing fields
            const patterns = (result.patterns || []).map((p: any) => ({
                ...p,
                id: p.id || `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }));

            return patterns as AdvancedPattern[];

        } catch (error) {
            logger.error('[AnalysisOrchestrator] Patterns error:', error);
            return [];
        }
    }

    /**
     * STEP 4: Calculate FinSight™ Score (0-100)
     * Evaluates financial health across 4 pillars: Cash, Margin, Resilience, Risk
     */
    private async calculateScore(data: FinancialData): Promise<FinSightScore | null> {
        try {
            // Convert FinancialData → ProcessedData (required by scoring module)
            const processedData = {
                ...data,
                sourceId: 'dashis-agent',
                summary: {
                    totalRecords: data.records.length,
                    dateRange: {
                        start: data.records[0]?.date || '',
                        end: data.records[data.records.length - 1]?.date || ''
                    },
                    totalRevenue: data.totalRevenue,
                    totalExpenses: data.totalExpenses,
                    netCashFlow: data.totalRevenue - data.totalExpenses
                },
                kpis: [],
                qualityMetrics: {
                    completeness: 100,
                    accuracy: 100,
                    consistency: 100
                }
            };

            const score = await calculateFinSightScore(processedData as any);
            return score;

        } catch (error) {
            logger.error('[AnalysisOrchestrator] Scoring error:', error);
            return null;
        }
    }

    /**
     * Run analysis modules in parallel for better performance
     * (Optional optimization method)
     */
    public async analyzeParallel(
        data: FinancialData,
        rawRecords: FinancialRecord[]
    ): Promise<AnalysisResult> {
        const startTime = Date.now();

        logger.debug('[AnalysisOrchestrator] 🚀 Starting PARALLEL analysis...');

        try {
            // Run all modules in parallel (non-blocking)
            const [anomalies, predResult, patterns, score] = await Promise.allSettled([
                // ML Anomalies
                this.config.enableAnomalyDetection && rawRecords.length > 0
                    ? this.detectAnomalies(rawRecords)
                    : Promise.resolve([]),

                // AI Predictions
                this.config.enableCashFlowPredictions && rawRecords.length >= this.config.minRecordsForPrediction
                    ? this.generatePredictions(rawRecords)
                    : Promise.resolve({ predictions: [], alerts: [], seasonalityDetected: false }),

                // AI Patterns
                this.config.enablePatternDetection && rawRecords.length >= this.config.minRecordsForPatterns
                    ? this.detectPatterns(rawRecords)
                    : Promise.resolve([]),

                // FinSight Score
                this.config.enableScoring && data
                    ? this.calculateScore(data)
                    : Promise.resolve(null)
            ]);

            const result: AnalysisResult = {
                anomalies: anomalies.status === 'fulfilled' ? anomalies.value : [],
                cashFlowPredictions: predResult.status === 'fulfilled' ? predResult.value.predictions : [],
                predictionAlerts: predResult.status === 'fulfilled' ? predResult.value.alerts : [],
                patterns: patterns.status === 'fulfilled' ? patterns.value : [],
                finSightScore: score.status === 'fulfilled' ? score.value : null,
                seasonalityDetected: predResult.status === 'fulfilled' ? predResult.value.seasonalityDetected : false,
                metadata: {
                    analyzedAt: new Date(),
                    recordCount: rawRecords.length,
                    modulesExecuted: [],
                    executionTimeMs: Date.now() - startTime
                }
            };

            // Track which modules succeeded
            if (anomalies.status === 'fulfilled' && result.anomalies.length > 0) {
                result.metadata.modulesExecuted.push('anomaly_detection');
            }
            if (predResult.status === 'fulfilled' && result.cashFlowPredictions.length > 0) {
                result.metadata.modulesExecuted.push('cash_flow_predictions');
            }
            if (patterns.status === 'fulfilled' && result.patterns.length > 0) {
                result.metadata.modulesExecuted.push('pattern_detection');
            }
            if (score.status === 'fulfilled' && result.finSightScore !== null) {
                result.metadata.modulesExecuted.push('finsight_scoring');
            }

            logger.debug(`[AnalysisOrchestrator] 🎉 Parallel analysis complete in ${result.metadata.executionTimeMs}ms`);

            return result;

        } catch (error) {
            logger.error('[AnalysisOrchestrator] Parallel analysis failed:', error);
            throw new Error(`Parallel analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update configuration at runtime
     */
    public updateConfig(config: Partial<AnalysisConfig>): void {
        this.config = { ...this.config, ...config };

        // Recreate detector if threshold changed
        if (config.anomalyThreshold !== undefined) {
            this.anomalyDetector = new AnomalyDetector({
                zScoreThreshold: config.anomalyThreshold
            });
        }
    }

    /**
     * Get current configuration
     */
    public getConfig(): AnalysisConfig {
        return { ...this.config };
    }
}
