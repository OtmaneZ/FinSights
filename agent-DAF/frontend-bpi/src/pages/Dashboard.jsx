import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Upload } from 'lucide-react'
import useWebSocket from '../hooks/useWebSocket'
import AgentStatus from '../components/AgentStatus'
import ResultsDashboard from '../components/ResultsDashboard'
import EventTimeline from '../components/EventTimeline'
import ToastNotification from '../components/ToastNotification'

const API_BASE = 'http://localhost:8000'
const WS_URL = 'ws://localhost:8000/ws'

export default function Dashboard() {
  const navigate = useNavigate()
  const [autonomousStatus, setAutonomousStatus] = useState(null)
  const [lastAnalysis, setLastAnalysis] = useState(null)
  const [events, setEvents] = useState([])
  const [toast, setToast] = useState(null)
  const { isConnected, lastMessage } = useWebSocket(WS_URL)

  // Fetch autonomous status
  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/agent/autonomous/status`)
      if (response.ok) {
        const data = await response.json()
        setAutonomousStatus(data)
      }
    } catch (err) {
      console.error('Erreur status:', err)
    }
  }

  // Fetch latest run
  const fetchLatestRun = async () => {
    try {
      const response = await fetch(`${API_BASE}/agent/runs/latest`)
      if (response.ok) {
        const data = await response.json()
        if (data.run_id) {
          setLastAnalysis(data)
        }
      }
    } catch (err) {
      console.error('Erreur latest run:', err)
    }
  }

  // Toggle autonomous mode
  const toggleAutonomousMode = async () => {
    try {
      const endpoint = autonomousStatus?.running ? 'stop' : 'start'
      const response = await fetch(`${API_BASE}/agent/autonomous/${endpoint}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchStatus()
      }
    } catch (err) {
      console.error('Erreur toggle:', err)
    }
  }

  // Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage) return

    const { type, data } = lastMessage

    switch (type) {
      case 'data_changed':
        addEvent({
          type: 'detection',
          title: '📊 Changement détecté',
          description: `${data.changes_count || 1} modification(s) dans ${data.file || 'les données'}`,
          time: new Date().toLocaleTimeString('fr-FR')
        })
        
        // Show toast simple sans détails
        setToast({
          type: 'warning',
          title: '📊 Données modifiées',
          description: `${data.changes_count || 1} modification(s) détectée(s) - Analyse en cours...`
        })
        fetchStatus()
        break

      case 'decision_made':
        addEvent({
          type: 'trigger',
          title: '🔔 Trigger activé',
          description: data.reason || 'Analyse déclenchée',
          time: new Date().toLocaleTimeString('fr-FR')
        })
        fetchStatus()
        break

      case 'analysis_started':
        addEvent({
          type: 'analysis',
          title: '⚡ Analyse lancée',
          description: `Raison: ${data.trigger_reason}`,
          time: new Date().toLocaleTimeString('fr-FR')
        })
        fetchStatus()
        break
      
      case 'decision_narrative':
        // FIX 3: Gestion narrative intelligente
        const isSkip = data.decision === 'skip'
        const narrativeIcon = isSkip ? '🧠' : (data.severity === 'CRITICAL' ? '🔴' : '🟡')
        
        addEvent({
          type: isSkip ? 'skip' : 'analysis',
          title: `${narrativeIcon} ${isSkip ? 'Skip Intelligent' : 'Analyse Lancée'}`,
          description: data.narrative || data.reason,
          time: new Date().toLocaleTimeString('fr-FR'),
          details: `Sévérité: ${data.severity}`
        })
        
        // Toast pour skip intelligent (différenciation clé)
        if (isSkip) {
          setToast({
            type: 'info',
            title: '🧠 Agent Intelligence',
            description: data.narrative || "L'agent a choisi de ne pas analyser",
            details: {
              reason: data.reason,
              severity: data.severity
            }
          })
        }
        break
      
      case 'run_skipped':
        // FIX 3: Gestion skip (fallback si pas de decision_narrative)
        addEvent({
          type: 'skip',
          title: '⏭️ Analyse non nécessaire',
          description: data.decision_reason || 'Aucun seuil franchi',
          time: new Date().toLocaleTimeString('fr-FR'),
          details: `Changements: ${data.context_summary?.recent_changes || 0}`
        })
        break

      case 'analysis_completed':
      case 'run_completed_moderate':
        // FIX 3: Gestion des runs complets ET partiels
        const isModerate = type === 'run_completed_moderate'
        
        addEvent({
          type: 'completed',
          title: isModerate ? '🟡 Analyse modérée terminée' : '✅ Analyse terminée',
          description: `Run ID: ${data.run_id?.slice(0, 8)}`,
          time: new Date().toLocaleTimeString('fr-FR'),
          details: isModerate ? data.message : `Raison: ${data.trigger_reason}`
        })
        
        // Set last analysis avec les données complètes
        if (data.deliverables) {
          setLastAnalysis({
            run_id: data.run_id,
            timestamp: data.timestamp,
            trigger_reason: data.trigger_reason,
            deliverables: data.deliverables
          })
        } else {
          // Sinon recharger depuis l'API
          fetchLatestRun()
        }
        
        // Show toast
        setToast({
          type: 'critical',
          title: '🚨 Analyse terminée',
          description: 'Nouveaux résultats disponibles',
          action: {
            label: 'Voir les résultats →',
            onClick: () => {
              setToast(null)
              // Scroll to results
              window.scrollTo({ top: 400, behavior: 'smooth' })
            }
          }
        })
        fetchStatus()
        break

      case 'autonomous_mode_started':
      case 'autonomous_mode_stopped':
        fetchStatus()
        break
    }
  }, [lastMessage])

  // Add event to timeline
  const addEvent = (event) => {
    setEvents(prev => [{...event, id: Date.now()}, ...prev].slice(0, 10))
  }

  // Initial fetch
  useEffect(() => {
    fetchStatus()
    fetchLatestRun() // Charger le dernier run au démarrage
    const interval = setInterval(() => {
      fetchStatus()
      fetchLatestRun() // Rafraîchir régulièrement
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold text-white">
            Tableau de Bord DAF
          </h1>
          <button
            onClick={() => navigate('/import')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
          >
            <Upload className="w-5 h-5" />
            Importer un encours
          </button>
        </div>
        <p className="text-white/60">
          Agent IA de surveillance de trésorerie • Analyse autonome des risques cash • {isConnected ? '🟢 Temps réel' : '🔴 Déconnecté'}
        </p>
      </motion.div>

      {/* Main content */}
      <div className="space-y-8">
        {/* Agent Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AgentStatus
            status={autonomousStatus}
            onToggle={toggleAutonomousMode}
          />
        </motion.div>

        {/* Results Dashboard */}
        {lastAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ResultsDashboard result={lastAnalysis} />
          </motion.div>
        )}

        {/* Event Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <EventTimeline events={events} />
        </motion.div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <ToastNotification
          message={toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
