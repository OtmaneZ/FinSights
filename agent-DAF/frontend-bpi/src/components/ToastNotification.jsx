import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, TrendingDown, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ToastNotification({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 8000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  const getIcon = () => {
    switch (message?.type) {
      case 'critical': return <AlertCircle className="w-6 h-6 text-red-400" />
      case 'warning': return <TrendingDown className="w-6 h-6 text-amber-400" />
      default: return <Clock className="w-6 h-6 text-blue-400" />
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, x: 100 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="fixed top-6 right-6 z-50 max-w-md"
      >
        <div className="card bg-slate-900/95 border-l-4 border-red-500">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-white mb-1">
                {message?.title || '🚨 Alerte Critique'}
              </h4>
              <p className="text-white/80 text-sm mb-2">
                {message?.description || 'Facture impayée détectée'}
              </p>
              {message?.details && (
                <div className="flex gap-3 text-xs text-white/60">
                  <span className="font-semibold text-red-400">
                    {message.details.amount}
                  </span>
                  <span>•</span>
                  <span>{message.details.days} jours de retard</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(onClose, 300)
              }}
              className="flex-shrink-0 text-white/40 hover:text-white/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {message?.action && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={message.action.onClick}
              className="mt-4 w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium transition-colors"
            >
              {message.action.label || 'Analyser maintenant →'}
            </motion.button>
          )}

          {/* Progress bar */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 8, ease: 'linear' }}
            className="absolute bottom-0 left-0 h-1 bg-red-500/50"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
