/**
 * TRESORIS Agent State Management
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Gère l'état de l'agent autonome côté serveur (en mémoire).
 * Simule le comportement du vrai agent Python pour la démo.
 * 
 * Architecture:
 * - Singleton pattern pour état global
 * - Machine à états: IDLE → MONITORING → ANALYZING → WAITING
 * - Logs d'activité avec timestamps
 * - Auto-trigger basé sur conditions
 */

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type AgentMode = 'idle' | 'monitoring' | 'analyzing' | 'waiting_validation'

export interface AgentLog {
    id: string
    timestamp: string
    type: 'info' | 'trigger' | 'analysis' | 'decision' | 'warning' | 'error' | 'scan'
    message: string
    details?: Record<string, unknown>
}

export interface AgentDecision {
    should_trigger: boolean
    reason: string
    timestamp: string
    trigger_source?: 'manual' | 'auto_dso' | 'auto_concentration' | 'auto_retard' | 'simulation' | 'periodic'
}

export interface AgentAnalysis {
    id: string
    timestamp: string
    trigger_reason: string
    risks_count: number
    critical_count: number
    actions_count: number
    summary: string
    duration_ms: number
}

export interface AgentState {
    // État principal
    running: boolean
    mode: AgentMode
    
    // Timing
    started_at: string | null
    last_check_at: string | null
    uptime_seconds: number
    
    // Décisions
    last_decision: AgentDecision | null
    decisions_count: number
    triggers_count: number
    
    // Analyses
    current_analysis: AgentAnalysis | null
    analyses_history: AgentAnalysis[]
    
    // Logs (derniers 50)
    logs: AgentLog[]
    
    // Thresholds
    thresholds: {
        dso_threshold: number
        concentration_max: number
        retard_critical_days: number
        check_interval_seconds: number
    }
}

// ═══════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════

const createInitialState = (): AgentState => ({
    running: false,
    mode: 'idle',
    
    started_at: null,
    last_check_at: null,
    uptime_seconds: 0,
    
    last_decision: null,
    decisions_count: 0,
    triggers_count: 0,
    
    current_analysis: null,
    analyses_history: [],
    
    logs: [],
    
    thresholds: {
        dso_threshold: 45,
        concentration_max: 0.30,
        retard_critical_days: 30,
        check_interval_seconds: 30
    }
})

// ═══════════════════════════════════════════════════════════════════
// SINGLETON STATE
// ═══════════════════════════════════════════════════════════════════

// État global en mémoire (reset au redémarrage serveur)
let agentState: AgentState = createInitialState()

// ═══════════════════════════════════════════════════════════════════
// LOGGING
// ═══════════════════════════════════════════════════════════════════

const generateLogId = (): string => {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
}

export const addLog = (
    type: AgentLog['type'],
    message: string,
    details?: Record<string, unknown>
): void => {
    const log: AgentLog = {
        id: generateLogId(),
        timestamp: new Date().toISOString(),
        type,
        message,
        details
    }
    
    agentState.logs = [log, ...agentState.logs].slice(0, 50) // Keep last 50
}

// ═══════════════════════════════════════════════════════════════════
// STATE ACCESSORS
// ═══════════════════════════════════════════════════════════════════

export const getAgentState = (): AgentState => {
    // Update uptime if running
    if (agentState.running && agentState.started_at) {
        const startTime = new Date(agentState.started_at).getTime()
        agentState.uptime_seconds = Math.floor((Date.now() - startTime) / 1000)
    }
    
    return { ...agentState }
}

export const getAgentStatus = () => {
    const state = getAgentState()
    return {
        running: state.running,
        mode: state.mode,
        uptime_seconds: state.uptime_seconds,
        last_decision: state.last_decision,
        current_analysis: state.current_analysis,
        decisions_count: state.decisions_count,
        triggers_count: state.triggers_count,
        thresholds: state.thresholds
    }
}

export const getAgentLogs = (limit: number = 20): AgentLog[] => {
    return agentState.logs.slice(0, limit)
}

// ═══════════════════════════════════════════════════════════════════
// STATE MUTATIONS
// ═══════════════════════════════════════════════════════════════════

export const startAgent = (): { success: boolean; message: string } => {
    if (agentState.running) {
        return { success: false, message: 'Agent déjà en cours d\'exécution' }
    }
    
    agentState.running = true
    agentState.mode = 'monitoring'
    agentState.started_at = new Date().toISOString()
    agentState.uptime_seconds = 0
    
    addLog('info', 'Agent TRESORIS démarré', { mode: 'monitoring' })
    addLog('info', 'Mode surveillance active - Analyse des patterns clients', {
        thresholds: agentState.thresholds
    })
    
    return { success: true, message: 'Agent démarré en mode surveillance' }
}

export const stopAgent = (): { success: boolean; message: string } => {
    if (!agentState.running) {
        return { success: false, message: 'Agent non actif' }
    }
    
    const uptime = agentState.uptime_seconds
    
    agentState.running = false
    agentState.mode = 'idle'
    
    addLog('info', 'Agent TRESORIS arrêté', {
        uptime_seconds: uptime,
        decisions_count: agentState.decisions_count,
        triggers_count: agentState.triggers_count
    })
    
    return { success: true, message: 'Agent arrêté' }
}

// ═══════════════════════════════════════════════════════════════════
// DECISION SYSTEM
// ═══════════════════════════════════════════════════════════════════

export interface TriggerContext {
    dso_moyen: number
    concentration_max_client: number
    factures_retard_critique: number
    nouvelle_simulation?: boolean
    simulation_risk_level?: string
}

export const recordDecision = (
    should_trigger: boolean,
    reason: string,
    source: AgentDecision['trigger_source'] = 'manual'
): void => {
    const decision: AgentDecision = {
        should_trigger,
        reason,
        timestamp: new Date().toISOString(),
        trigger_source: source
    }
    
    agentState.last_decision = decision
    agentState.decisions_count++
    agentState.last_check_at = new Date().toISOString()
    
    if (should_trigger) {
        agentState.triggers_count++
        addLog('trigger', `Trigger: ${reason}`, { source })
    } else {
        addLog('decision', `Check: ${reason}`, { source })
    }
}

export const evaluateTrigger = (context: TriggerContext): {
    should_trigger: boolean
    reason: string
    source: AgentDecision['trigger_source']
} => {
    const { thresholds } = agentState
    
    // Check 1: Simulation avec risque critique
    if (context.nouvelle_simulation && context.simulation_risk_level === 'CRITICAL') {
        return {
            should_trigger: true,
            reason: `Simulation détecte risque CRITIQUE - Analyse automatique requise`,
            source: 'simulation'
        }
    }
    
    // Check 2: DSO élevé
    if (context.dso_moyen > thresholds.dso_threshold) {
        return {
            should_trigger: true,
            reason: `DSO élevé: ${context.dso_moyen.toFixed(1)}j > seuil ${thresholds.dso_threshold}j`,
            source: 'auto_dso'
        }
    }
    
    // Check 3: Concentration client
    if (context.concentration_max_client > thresholds.concentration_max) {
        return {
            should_trigger: true,
            reason: `Concentration: ${(context.concentration_max_client * 100).toFixed(1)}% > seuil ${thresholds.concentration_max * 100}%`,
            source: 'auto_concentration'
        }
    }
    
    // Check 4: Factures en retard critique
    if (context.factures_retard_critique > 0) {
        return {
            should_trigger: true,
            reason: `${context.factures_retard_critique} facture(s) > ${thresholds.retard_critical_days}j de retard`,
            source: 'auto_retard'
        }
    }
    
    // Pas de trigger
    return {
        should_trigger: false,
        reason: 'Aucune anomalie détectée - Surveillance continue',
        source: 'manual'
    }
}

// ═══════════════════════════════════════════════════════════════════
// ANALYSIS MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

export const startAnalysis = (trigger_reason: string): string => {
    if (agentState.mode === 'analyzing') {
        return agentState.current_analysis?.id || ''
    }
    
    const analysisId = `ANALYSIS_${Date.now()}`
    agentState.mode = 'analyzing'
    
    agentState.current_analysis = {
        id: analysisId,
        timestamp: new Date().toISOString(),
        trigger_reason,
        risks_count: 0,
        critical_count: 0,
        actions_count: 0,
        summary: '',
        duration_ms: 0
    }
    
    addLog('analysis', 'Analyse en cours...', { 
        analysis_id: analysisId,
        trigger_reason 
    })
    
    return analysisId
}

export const completeAnalysis = (results: {
    risks_count: number
    critical_count: number
    actions_count: number
    summary: string
}): void => {
    if (!agentState.current_analysis) return
    
    const startTime = new Date(agentState.current_analysis.timestamp).getTime()
    const duration_ms = Date.now() - startTime
    
    agentState.current_analysis = {
        ...agentState.current_analysis,
        ...results,
        duration_ms
    }
    
    // Add to history
    agentState.analyses_history = [
        agentState.current_analysis,
        ...agentState.analyses_history
    ].slice(0, 10) // Keep last 10
    
    // Transition to waiting
    agentState.mode = 'waiting_validation'
    
    addLog('analysis', 'Analyse terminée', {
        duration_ms,
        risks: results.risks_count,
        critical: results.critical_count,
        actions: results.actions_count
    })
    
    addLog('info', 'En attente de validation DAF', {
        actions_pending: results.actions_count
    })
}

export const resumeMonitoring = (): void => {
    if (agentState.running) {
        agentState.mode = 'monitoring'
        addLog('info', 'Retour en mode surveillance', {})
    }
}

// ═══════════════════════════════════════════════════════════════════
// RESET (for testing)
// ═══════════════════════════════════════════════════════════════════

export const resetAgentState = (): void => {
    agentState = createInitialState()
}
