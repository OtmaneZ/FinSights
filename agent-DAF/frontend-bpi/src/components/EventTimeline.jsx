import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Zap, FileText, Clock } from 'lucide-react'

export default function EventTimeline({ events = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case 'detection': return <FileText className="w-4 h-4" />
      case 'trigger': return <AlertCircle className="w-4 h-4" />
      case 'analysis': return <Zap className="w-4 h-4" />
      case 'completed': return <CheckCircle2 className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getColor = (type) => {
    switch (type) {
      case 'detection': return 'text-blue-400 bg-blue-500/20'
      case 'trigger': return 'text-amber-400 bg-amber-500/20'
      case 'analysis': return 'text-purple-400 bg-purple-500/20'
      case 'completed': return 'text-green-400 bg-green-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  if (!events || events.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Journal de surveillance
        </h3>
        <p className="text-white/40 text-sm text-center py-8">
          Aucun événement récent
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-400" />
        Journal de surveillance
      </h3>

      <div className="space-y-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 items-start"
          >
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getColor(event.type)}`}>
                {getIcon(event.type)}
              </div>
              {index < events.length - 1 && (
                <div className="w-0.5 h-12 bg-white/10 mt-2" />
              )}
            </div>

            {/* Event content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">
                  {event.title}
                </span>
                <span className="text-xs text-white/40">
                  {event.time}
                </span>
              </div>
              <p className="text-sm text-white/60">
                {event.description}
              </p>
              {event.details && (
                <div className="mt-2 text-xs text-white/40">
                  {event.details}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
