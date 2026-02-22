'use client'

/**
 * GuideDownloadCTA — Call-to-action pour télécharger le guide PDF
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * Affiché dans la synthesis du wizard diagnostic, après les levers d'action.
 * Propose le guide "Optimisez votre Cash Flow" comme complément naturel
 * au diagnostic FinSight™ qu'on vient de terminer.
 *
 * Design: card soft, avec liste à puces, input email + button.
 *
 * Used in:
 *   - diagnostic/guide/page.tsx (synthesis section)
 */

import { useState } from 'react'
import { FileText, Loader2, CheckCircle2 } from 'lucide-react'

interface GuideDownloadCTAProps {
  score?: number | null
  className?: string
}

export function GuideDownloadCTA({ score, className = '' }: GuideDownloadCTAProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

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
        body: JSON.stringify({
          email,
          source: 'diagnostic_synthesis',
          leadMagnet: 'guide_cash_pdf',
          diagnosticScore: score,
        }),
      })

      if (res.ok) {
        setStatus('success')
        if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
          ;(window as any).gtag('event', 'lead_magnet_submit', {
            source: 'diagnostic_synthesis',
            lead_magnet: 'guide_cash_pdf',
            score: score ?? 0,
            email_domain: email.split('@')[1] || 'unknown',
          })
        }
        // Keep success state visible
        setEmail('')
      } else {
        throw new Error('submission_failed')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  if (status === 'success') {
    return (
      <div className={`px-5 py-6 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-center ${className}`}>
        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-white mb-1">Guide envoyé ✓</p>
        <p className="text-xs text-gray-400">Vérifiez votre boîte mail — le guide arrive dans les 2 minutes.</p>
      </div>
    )
  }

  return (
    <div className={`px-5 py-5 bg-white/[0.03] border border-white/10 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <FileText className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-1">
            Bonus — Guide gratuit PDF
          </p>
          <h4 className="text-sm font-semibold text-white leading-snug">
            Optimisez votre Cash Flow — 7 leviers pour PME
          </h4>
        </div>
      </div>

      {/* Benefits */}
      <ul className="space-y-1.5 mb-4 ml-11">
        {[
          '7 leviers actionnables pour réduire votre BFR',
          'Benchmarks Banque de France 2024',
          'Template de suivi prêt à l\'emploi',
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-gray-400">
            <span className="inline-block w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
          autoComplete="email"
          inputMode="email"
          disabled={status === 'loading'}
          className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400/50 disabled:opacity-50"
          aria-label="Votre adresse email"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
        >
          {status === 'loading' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            'Recevoir'
          )}
        </button>
      </form>

      {/* Error */}
      {errorMsg && (
        <p className="text-[11px] text-red-400 mt-2">{errorMsg}</p>
      )}

      {/* Footer */}
      <p className="text-[10px] text-gray-600 mt-3 leading-relaxed">
        Pas de spam — désabonnement en 1 clic. Conformément au RGPD.
      </p>
    </div>
  )
}
