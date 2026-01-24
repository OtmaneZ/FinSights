import { motion } from 'framer-motion'
import { Bot, Activity, Pause, Play } from 'lucide-react'

export default function AgentStatus({ status, onToggle }) {
  const isRunning = status?.running || false
  const mode = status?.mode || 'idle'
  const lastCheck = status?.monitor?.last_check
  const changesDetected = status?.monitor?.changes_detected || 0

  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'Jamais'
    const date = new Date(isoString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    
    if (seconds < 60) return `Il y a ${seconds}s`
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)}min`
    return `Il y a ${Math.floor(seconds / 3600)}h`
  }

  const modeLabels = {
    idle: 'Inactif',
    monitoring: 'Surveillance active',
    analyzing: 'Analyse en cours',
    waiting_validation: 'Validation requise',
    stopped: 'Arrêté'
  }

  const modeColors = {
    idle: 'bg-gray-500',
    monitoring: 'bg-blue-500 animate-pulse',
    analyzing: 'bg-amber-500 animate-pulse',
    waiting_validation: 'bg-green-500',
    stopped: 'bg-red-500'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            {isRunning && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"
              />
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Agent de Surveillance
            </h2>
            <div className="flex items-center gap-3">
              <span className={`badge ${isRunning ? 'badge-success' : 'badge-danger'}`}>
                {modeLabels[mode] || mode}
              </span>
              {isRunning && (
                <>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60 text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Dernière vérification: {formatTimeAgo(lastCheck)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors ${
            isRunning
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              Arrêter
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Démarrer
            </>
          )}
        </motion.button>
      </div>

      {/* Stats bar */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 pt-6 border-t border-white/10"
        >
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-white/40 text-xs mb-1">Modifications détectées</div>
              <div className="text-2xl font-bold text-white">{changesDetected}</div>
            </div>
            <div>
              <div className="text-white/40 text-xs mb-1">Règles de surveillance</div>
              <div className="text-2xl font-bold text-white">
                {status?.triggers?.enabled_rules || 0}
              </div>
            </div>
            <div>
              <div className="text-white/40 text-xs mb-1">Analyses effectuées</div>
              <div className="text-2xl font-bold text-white">
                {status?.memory?.total_runs || 0}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
