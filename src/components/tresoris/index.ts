/**
 * TRESORIS Components - Composants modulaires pour l'agent trésorerie
 * 
 * Architecture:
 * - TresorisAgentUI: Dashboard principal complet
 * - AutonomousAgentPanel: Panneau contrôle agent (START/STOP, machine à états)
 * - AgentActivityLog: Log terminal temps réel
 * - RiskSimulator: Simulateur interactif de facture (killer feature)
 * - CashRunwayGauge: Jauge visuelle du runway en semaines
 * - ClientRiskMatrix: Matrice scoring clients A/B/C/D
 * - EarlyWarningPanel: Panneau alertes avec severity
 * - ActionRecommendations: Actions P1/P2/P3 avec validation
 * - AgentReactionTimeline: Timeline temps réel réaction agent
 */

// Main UI
export { default as TresorisAgentUI } from './TresorisAgentUI'

// Agent Control (NEW)
export { default as AutonomousAgentPanel } from './AutonomousAgentPanel'
export { default as AgentActivityLog } from './AgentActivityLog'

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
