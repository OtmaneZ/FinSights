/**
 * TRESORIS Components - Composants modulaires pour l'agent trésorerie
 * 
 * Architecture:
 * - TresorisAgentUI: Dashboard principal complet
 * - RiskSimulator: Simulateur interactif de facture (killer feature)
 * - CashRunwayGauge: Jauge visuelle du runway en semaines
 * - ClientRiskMatrix: Matrice scoring clients A/B/C/D
 * - EarlyWarningPanel: Panneau alertes avec severity
 * - ActionRecommendations: Actions P1/P2/P3 avec validation
 * - AgentReactionTimeline: Timeline temps réel réaction agent
 * - ForecastTimeline: Prévisions encaissements S1-S4
 */

// Main UI
export { default as TresorisAgentUI } from './TresorisAgentUI'

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
