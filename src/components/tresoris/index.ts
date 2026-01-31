/**
 * TRESORIS Components - Composants modulaires pour l'agent trésorerie
 * 
 * Architecture:
 * - TresorisAgentUI: Dashboard principal complet
 * - AutonomousAgentPanel: Panneau contrôle agent (START/STOP, machine à états, AUTO-SCAN)
 * - AgentActivityLog: Log terminal temps réel enrichi
 * - AgentAnalysisTimeline: Timeline visuelle Before/During/After
 * - DAFValidationModal: Modal validation actions DAF
 * - DemoModeBadge: Badge Live/Demo mode
 * - RiskSimulator: Simulateur interactif de facture (killer feature)
 * - CashRunwayGauge: Jauge visuelle du runway en semaines
 * - ClientRiskMatrix: Matrice scoring clients A/B/C/D
 * - EarlyWarningPanel: Panneau alertes avec severity
 * - ActionRecommendations: Actions P1/P2/P3 avec validation
 * - AgentReactionTimeline: Timeline temps réel réaction agent
 */

// Main UI
export { default as TresorisAgentUI } from './TresorisAgentUI'
export { default as DemoOrchestrator } from './DemoOrchestrator'

// Agent Control (V2 Enhanced)
export { default as AutonomousAgentPanel } from './AutonomousAgentPanel'
export { default as AgentActivityLog } from './AgentActivityLog'
export { default as AgentAnalysisTimeline } from './AgentAnalysisTimeline'
export { default as DAFValidationModal } from './DAFValidationModal'
export { default as DemoModeBadge, DemoModeInlineBadge } from './DemoModeBadge'

// Killer Feature
export { default as RiskSimulator } from './RiskSimulator'

// Dashboard Components
export { default as CashRunwayGauge } from './CashRunwayGauge'
export { default as ClientRiskMatrix } from './ClientRiskMatrix'
export { default as EarlyWarningPanel } from './EarlyWarningPanel'
export { default as ActionRecommendations } from './ActionRecommendations'
export { default as AgentReactionTimeline } from './AgentReactionTimeline'

// Types
export * from './types'
