/**
 * DASHIS Agent - Main State Machine
 * 
 * Autonomous financial dashboard agent with complete lifecycle:
 * - Data processing (upload → validation → enrichment)
 * - KPI calculation (5 KPIs + 8 chart datasets)
 * - AI/ML analysis (anomalies, predictions, patterns, scoring)
 * - What-If simulations
 * - State management
 * 
 * ZERO UI dependencies. Pure business logic.
 */

import type {
    AgentConfig,
    AgentState,
    AgentCapability,
    DashisState,
    FinancialData,
    FinancialRecord,
    KPI,
    ChartDataset,
    AnalysisResult,
    SimulationParams,
    SimulationResult,
    IFinancialAgent
} from './types';

import { DataProcessor } from './DataProcessor';
import { KPIEngine } from './KPIEngine';
import { SimulationEngine } from './SimulationEngine';
import { AnalysisOrchestrator } from './AnalysisOrchestrator';
import { logger } from '@/lib/logger';

export class DashisAgent implements IFinancialAgent {
    public readonly id: string = 'dashis';
    public readonly name: string = 'DASHIS - Financial Dashboard Agent';
    public readonly version: string = '1.0.0';
    public readonly capabilities: AgentCapability[] = [
        'data-processing',
        'kpi-calculation',
        'ml-analysis',
        'ai-predictions',
        'simulation',
        'scoring'
    ];

    // Core engines
    private dataProcessor: DataProcessor;
    private kpiEngine: KPIEngine;
    private simulationEngine: SimulationEngine;
    private analysisOrchestrator: AnalysisOrchestrator;

    // Agent state
    private state: AgentState;

    // Configuration
    private config: AgentConfig;

    constructor(config: AgentConfig = { enableCache: true }) {
        this.config = config;

        // Initialize engines
        this.dataProcessor = new DataProcessor();
        this.kpiEngine = new KPIEngine();
        this.simulationEngine = new SimulationEngine();
        this.analysisOrchestrator = new AnalysisOrchestrator({
            sector: config.sector,
            companyName: config.companyName,
            teamSize: config.teamSize
        });

        // Initialize state
        this.state = {
            current: 'idle',
            data: null,
            kpis: [],
            charts: null,
            analysis: null,
            simulation: null,
            error: null,
            metadata: {
                recordsCount: 0
            }
        };

        logger.debug('[DashisAgent] ✅ Initialized', {
            id: this.id,
            version: this.version,
            capabilities: this.capabilities
        });
    }

    /**
     * Initialize agent (lifecycle method)
     */
    public async initialize(config: AgentConfig): Promise<void> {
        this.config = { ...this.config, ...config };

        // Update orchestrator context
        this.analysisOrchestrator.updateConfig({
            sector: config.sector,
            companyName: config.companyName,
            teamSize: config.teamSize
        });

        logger.debug('[DashisAgent] ♻️ Reinitialized with new config');
    }

    /**
     * Shutdown agent (cleanup)
     */
    public async shutdown(): Promise<void> {
        this.state = {
            current: 'idle',
            data: null,
            kpis: [],
            charts: null,
            analysis: null,
            simulation: null,
            error: null,
            metadata: {
                recordsCount: 0
            }
        };

        logger.debug('[DashisAgent] 🛑 Shutdown complete');
    }

    /**
     * Process raw financial data (STEP 1)
     * Upload → Validation → Enrichment → Ready
     */
    public async processData(rawRecords: FinancialRecord[]): Promise<FinancialData> {
        this.setState('loading');

        try {
            logger.debug('[DashisAgent] 📤 Processing data...', {
                recordCount: rawRecords.length
            });

            // STEP 1: Process raw data
            const data = this.dataProcessor.process(rawRecords);

            // STEP 2: Calculate KPIs
            const kpiResult = this.kpiEngine.calculateKPIs(data);
            const kpis = Object.values(kpiResult);

            // STEP 3: Generate chart datasets
            const charts = this.kpiEngine.calculateAllCharts(data.records);

            // Update state
            this.state.data = data;
            this.state.kpis = kpis;
            this.state.charts = charts;
            this.state.metadata = {
                loadedAt: new Date(),
                recordsCount: rawRecords.length
            };
            this.setState('ready');

            logger.debug('[DashisAgent] ✅ Data processed', {
                kpiCount: kpis.length,
                chartCount: Object.keys(charts).length
            });

            return data;

        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Data processing failed';
            this.setError(errorMsg);
            throw error;
        }
    }

    /**
     * Run complete AI/ML analysis (STEP 2)
     * Anomalies → Predictions → Patterns → Scoring
     */
    public async analyze(data?: FinancialData): Promise<AnalysisResult> {
        const targetData = data || this.state.data;

        if (!targetData) {
            throw new Error('No data available for analysis. Call processData() first.');
        }

        this.setState('analyzing');

        try {
            logger.debug('[DashisAgent] 🤖 Running AI/ML analysis...');

            const analysis = await this.analysisOrchestrator.analyze(
                targetData,
                targetData.records
            );

            this.state.analysis = analysis;
            this.setState('ready');

            logger.debug('[DashisAgent] ✅ Analysis complete', {
                anomalies: analysis.anomalies.length,
                predictions: analysis.cashFlowPredictions.length,
                patterns: analysis.patterns.length,
                score: analysis.finSightScore?.total
            });

            return analysis;

        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Analysis failed';
            this.setError(errorMsg);
            throw error;
        }
    }

    /**
     * Run What-If simulation (STEP 3)
     */
    public async simulate(params: SimulationParams): Promise<SimulationResult> {
        if (!this.state.data || this.state.kpis.length === 0) {
            throw new Error('No data available for simulation. Call processData() first.');
        }

        this.setState('simulating');

        try {
            logger.debug('[DashisAgent] 🎯 Running simulation...', params);

            const result = this.simulationEngine.simulate(
                this.state.data,
                this.state.kpis,
                params
            );

            this.state.simulation = result;
            this.setState('ready');

            logger.debug('[DashisAgent] ✅ Simulation complete', {
                impact: result.impact
            });

            return result;

        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Simulation failed';
            this.setError(errorMsg);
            throw error;
        }
    }

    /**
     * Find best scenario from multiple parameter sets
     */
    public async findBestScenario(
        scenarios: Array<{ name: string; params: SimulationParams }>
    ): Promise<SimulationResult> {
        if (!this.state.data || this.state.kpis.length === 0) {
            throw new Error('No data available. Call processData() first.');
        }

        logger.debug('[DashisAgent] 🔍 Finding best scenario...', {
            scenarioCount: scenarios.length
        });

        const results = this.simulationEngine.findBestScenario(
            this.state.data,
            this.state.kpis,
            scenarios
        );

        // Return best one (first in list, highest score)
        const best = results[0];

        logger.debug('[DashisAgent] ✅ Best scenario found', {
            name: best.name,
            score: best.score,
            impact: best.result.impact
        });

        return best.result;
    }

    /**
     * Get current agent state
     */
    public getState(): AgentState {
        return { ...this.state };
    }

    /**
     * Get current KPIs
     */
    public getKPIs(): KPI[] {
        return [...this.state.kpis];
    }

    /**
     * Get chart datasets
     */
    public getCharts(): ChartDataset | null {
        return this.state.charts ? { ...this.state.charts } : null;
    }

    /**
     * Get analysis results
     */
    public getAnalysis(): AnalysisResult | null {
        return this.state.analysis ? { ...this.state.analysis } : null;
    }

    /**
     * Get simulation result
     */
    public getSimulation(): SimulationResult | null {
        return this.state.simulation ? { ...this.state.simulation } : null;
    }

    /**
     * Check if agent can fuse with another agent
     * (Future: for fusion architecture)
     */
    public canFuseWith(agent: IFinancialAgent): boolean {
        // DASHIS can fuse with:
        // - TRESORIS (cash flow optimization)
        // - MARGIS (margin analysis)
        // - SCORIS (advanced scoring)
        // - SCENARIS (scenario planning)
        const fusionCompatible = ['tresoris', 'margis', 'scoris', 'scenaris'];
        return fusionCompatible.includes(agent.id);
    }

    /**
     * Calculate compatibility score with another agent
     * Returns 0-1 (1 = perfect compatibility)
     */
    public getCompatibilityScore(agent: IFinancialAgent): number {
        if (!this.canFuseWith(agent)) return 0;

        // Check capability overlap
        const myCapabilities = new Set(this.capabilities);
        const theirCapabilities = new Set(agent.capabilities);

        const overlap = [...myCapabilities].filter(c => theirCapabilities.has(c));
        const union = new Set([...myCapabilities, ...theirCapabilities]);

        // Jaccard similarity: |intersection| / |union|
        const compatibility = overlap.length / union.size;

        logger.debug('[DashisAgent] 🔗 Compatibility check', {
            agent: agent.id,
            score: compatibility,
            overlap: overlap.length,
            union: union.size
        });

        return compatibility;
    }

    /**
     * Export agent state as JSON (for persistence/fusion)
     */
    public exportState(): string {
        return JSON.stringify({
            id: this.id,
            version: this.version,
            state: this.state,
            config: this.config,
            exportedAt: new Date().toISOString()
        });
    }

    /**
     * Import agent state from JSON
     */
    public importState(json: string): void {
        try {
            const imported = JSON.parse(json);

            if (imported.id !== this.id) {
                throw new Error(`State mismatch: expected ${this.id}, got ${imported.id}`);
            }

            this.state = imported.state;
            this.config = imported.config;

            logger.debug('[DashisAgent] ♻️ State imported', {
                from: imported.exportedAt
            });

        } catch (error) {
            logger.error('[DashisAgent] ❌ Import failed:', error);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PRIVATE HELPERS
    // ═══════════════════════════════════════════════════════════════════════════════

    private setState(newState: DashisState): void {
        const oldState = this.state.current;
        this.state.current = newState;
        this.state.error = null; // Clear error on state change

        logger.debug('[DashisAgent] 🔄 State transition', {
            from: oldState,
            to: newState
        });
    }

    private setError(message: string): void {
        this.state.current = 'error';
        this.state.error = message;

        logger.error('[DashisAgent] ❌ Error state', { message });
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FACTORY & HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create a new DASHIS agent instance
 */
export function createDashisAgent(config?: AgentConfig): DashisAgent {
    return new DashisAgent(config);
}

/**
 * Default export for easy imports
 */
export default DashisAgent;
