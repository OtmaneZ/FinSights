'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { X, FileText, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

// GA4 helper
function trackGA4Event(eventName: string, params: Record<string, string>) {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('event', eventName, params)
  }
}

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const hasShown = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback(() => {
    if (hasShown.current) return
    hasShown.current = true
    setIsVisible(true)
    trackGA4Event('exit_intent_popup_shown', { trigger: 'mouse_leave_top' })
  }, [])

  useEffect(() => {
    // Wait 8s minimum before enabling exit intent (avoid false positives on load)
    timeoutRef.current = setTimeout(() => {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 10) show()
      }
      document.addEventListener('mouseleave', handleMouseLeave)
      return () => document.removeEventListener('mouseleave', handleMouseLeave)
    }, 8000)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [show])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Veuillez saisir une adresse email valide.')
      return
    }
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'exit_intent', leadMagnet: 'guide_cash_pdf' }),
      })

      if (res.ok) {
        setStatus('success')
        trackGA4Event('lead_magnet_submit', {
          source: 'exit_intent_popup',
          lead_magnet: 'guide_cash_pdf',
          email_domain: email.split('@')[1] || 'unknown',
        })
        // Auto-close after 3s
        setTimeout(() => setIsVisible(false), 3500)
      } else {
        throw new Error('server_error')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    trackGA4Event('exit_intent_popup_dismissed', { email_filled: email ? 'yes' : 'no' })
  }

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Télécharger le guide gratuit"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Header accent */}
        <div className="bg-slate-900 px-8 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Guide gratuit · PDF</span>
          </div>
          <h2 className="text-xl font-bold text-white leading-snug">
            Optimisez votre Cash Flow :<br />
            <span className="text-blue-300">le guide complet pour PME</span>
          </h2>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">
            15 pages · Benchmarks Banque de France 2024 · Plan d&apos;action en 7 étapes
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {status === 'success' ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 mb-1">C&apos;est envoyé !</p>
              <p className="text-sm text-gray-500">
                Vérifiez votre boîte mail — le guide arrive dans les 2 minutes.
              </p>
            </div>
          ) : (
            <>
              <ul className="space-y-2 mb-5">
                {[
                  '7 leviers actionnables pour réduire votre BFR',
                  'Benchmarks sectoriels DSO / BFR (Banque de France)',
                  'Template de suivi de trésorerie prêt à l\'emploi',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} noValidate>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    autoComplete="email"
                    inputMode="email"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary placeholder-gray-400 min-w-0"
                    aria-label="Votre adresse email professionnelle"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-4 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 flex-shrink-0 disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Recevoir
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-500 mt-2">{errorMsg}</p>
                )}

                <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
                  En soumettant ce formulaire, vous acceptez de recevoir le guide par email.
                  Pas de spam — désabonnement en 1 clic. Conformément au{' '}
                  <a href="/politique-confidentialite" className="underline hover:text-gray-600">
                    RGPD
                  </a>
                  .
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
