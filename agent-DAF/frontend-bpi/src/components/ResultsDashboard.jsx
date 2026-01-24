import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react'

export default function ResultsDashboard({ result }) {
  if (!result) {
    return (
      <div className="card">
        <div className="text-center py-12 text-white/40">
          <p className="text-sm">Aucune analyse récente</p>
          <p className="text-xs mt-2">L'agent vous alertera lors de la prochaine détection</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatTimeAgo = (isoString) => {
    if (!isoString) return "À l'instant"
    const date = new Date(isoString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    
    if (seconds < 60) return `il y a ${seconds}s`
    if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)}min`
    if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)}h`
    return `il y a ${Math.floor(seconds / 86400)}j`
  }

  const summary = result.deliverables?.treasury || {}
  const risks = result.deliverables?.risks || []
  const actions = result.deliverables?.actions || []
  
  // Calculer l'impact total des risques critiques
  const criticalRisks = risks.filter(r => r.severity === 'critical')
  const totalCriticalImpact = criticalRisks.reduce((sum, r) => sum + (r.amount_at_risk || 0), 0)
  
  // Calculer la date de fin de runway
  const runwayEndDate = summary.as_of_date && summary.cash_runway_days 
    ? new Date(new Date(summary.as_of_date).getTime() + summary.cash_runway_days * 24 * 60 * 60 * 1000)
        .toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'N/A'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="card border-l-4 border-amber-500">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">
                📊 Synthèse de surveillance
              </h2>
              <span className="badge badge-warning">
                {formatTimeAgo(result.timestamp)}
              </span>
            </div>
            <p className="text-white/60 text-sm">
              Événement déclencheur : <span className="text-amber-400 font-medium">
                {result.trigger_reason?.includes('Facture critique') 
                  ? result.trigger_reason.replace('Facture critique détectée', 'Détection d\'un encours client critique')
                  : result.trigger_reason}
              </span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/40">Référence</div>
            <div className="text-xs text-white/60 font-mono">{result.run_id?.slice(0, 8)}</div>
          </div>
        </div>

        {/* Impact badge */}
        {criticalRisks.length > 0 && (
          <div className="flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-white/80">Exposition critique: </span>
            <span className="text-red-400 font-bold">
              {formatCurrency(totalCriticalImpact)}
            </span>
            <span className="text-white/50 text-sm ml-2">
              ({criticalRisks.length} dossier{criticalRisks.length > 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>

      {/* DÉCISION PRINCIPALE - Carte mise en avant */}
      {actions.length > 0 && actions[0] && (actions[0].category === 'pilotage' || actions[0].category === 'forecast' || actions[0].category === 'gouvernance') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card border-2 border-blue-500/50 bg-gradient-to-br from-blue-900/40 to-slate-900/40"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wide mb-2">
                🎯 Décision Principale
              </h3>
              <p className="text-xl font-bold text-white leading-relaxed mb-3 whitespace-pre-wrap">
                {actions[0].action}
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-white/60">
                  <span>Impact:</span>
                  <span className="text-blue-400 font-semibold">
                    {formatCurrency(actions[0].expected_impact)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <span>Date de décision:</span>
                  <span className="text-amber-400 font-semibold">
                    {new Date(actions[0].deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <div className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-xs font-medium uppercase">
                  {actions[0].category}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Solde */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Solde Trésorerie</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatCurrency(summary.current_balance || 0)}
          </div>
          {summary.balance_evolution && (
            <div className={`text-sm ${summary.balance_evolution > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {summary.balance_evolution > 0 ? '+' : ''}{formatCurrency(summary.balance_evolution)}
            </div>
          )}
        </motion.div>

        {/* Runway */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Cash Runway</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {summary.cash_runway_days || 0}j
          </div>
          <div className="text-sm text-white/60">
            Jusqu'au {runwayEndDate}
          </div>
        </motion.div>

        {/* Risques */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Risques identifiés</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {risks.length}
          </div>
          <div className="text-sm text-red-400">
            (dont {risks.filter(r => r.severity === 'critical').length} critique{risks.filter(r => r.severity === 'critical').length > 1 ? 's' : ''})
          </div>
        </motion.div>
      </div>

      {/* Top Risks */}
      {risks.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Dossiers prioritaires
          </h3>
          <div className="space-y-3">
            {risks.slice(0, 3).map((risk, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-white/5"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  risk.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  risk.severity === 'high' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-white font-medium">{risk.title}</h4>
                    {risk.days_overdue && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                        {risk.days_overdue}j de retard
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm">{risk.description}</p>
                  {risk.amount_at_risk > 0 && (
                    <div className="mt-2 text-sm font-semibold text-red-400">
                      💰 Montant à risque: {formatCurrency(risk.amount_at_risk)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Actions */}
      {actions.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            Décisions proposées par l'agent ({actions.length})
          </h3>
          <div className="space-y-3">
            {actions.slice(0, 5).map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className={`mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  action.priority === 1 ? 'bg-red-500/20 text-red-400' :
                  action.priority === 2 ? 'bg-orange-500/20 text-orange-400' :
                  action.priority === 3 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  P{action.priority}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">{action.action}</h4>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span>💰 Impact: {formatCurrency(action.expected_impact || 0)}</span>
                    <span>📅 {new Date(action.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                    <span className="badge badge-primary">{action.category}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/40 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Gouvernance disclaimer */}
      <div className="card bg-amber-500/5 border border-amber-500/20">
        <p className="text-sm text-amber-200/80 text-center">
          ⚠️ Les décisions proposées ne sont pas exécutées automatiquement. Validation DAF requise avant toute action impactant la trésorerie ou les flux.
        </p>
      </div>

      {/* Footer signature - discret */}
      <div className="text-center text-white/30 text-xs pt-4">
        Analyse générée automatiquement par l'Agent DAF • Données actualisées en temps réel
      </div>
    </motion.div>
  )
}
