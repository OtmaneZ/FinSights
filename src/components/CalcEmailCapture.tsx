'use client'

import { useState } from 'react'
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'

// GA4 helper
function trackGA4Event(eventName: string, params: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('event', eventName, params)
  }
}

interface CalcEmailCaptureProps {
  /** Calculator type — used for GA4 label */
  context: 'dso' | 'bfr' | 'marge' | 'seuil-rentabilite' | 'roi'
  /** Calculated value to display inline */
  contextValue: number | null
  /** Bold title text */
  label: string
  /** Explanatory sentence below the title */
  description: string
}

export default function CalcEmailCapture({
  context,
  contextValue,
  label,
  description,
}: CalcEmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Email invalide.')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: `calculator_${context}`,
          leadMagnet: `benchmark_${context}`,
          score: contextValue,
        }),
      })

      if (res.ok) {
        setStatus('success')
        trackGA4Event('calculator_email_capture', {
          calculator: context,
          result_value: contextValue ?? 0,
          email_domain: email.split('@')[1] || 'unknown',
        })
      } else {
        throw new Error()
      }
    } catch {
      setStatus('error')
      setErrorMsg('Une erreur est survenue. Réessayez.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 p-5 bg-green-50 border-2 border-green-200 rounded-xl">
        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-green-800 text-sm">Analyse envoyée !</p>
          <p className="text-xs text-green-700 mt-0.5">Vérifiez votre boîte mail dans les prochaines minutes.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl">
      <p className="font-bold text-gray-900 text-sm mb-1">📊 {label}</p>
      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{description}</p>

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
            className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 placeholder-gray-400 min-w-0 bg-white"
            aria-label="Votre adresse email professionnelle"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2.5 bg-accent-primary hover:bg-accent-primary-hover text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 flex-shrink-0 disabled:opacity-60"
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

        {errorMsg && <p className="text-xs text-red-500 mt-1.5">{errorMsg}</p>}
      </form>

      <p className="text-[11px] text-gray-400 mt-2">Gratuit · Sans spam · Désinscription en 1 clic</p>
    </div>
  )
}
