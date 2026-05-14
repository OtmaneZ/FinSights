'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2, AlertCircle, Mail } from 'lucide-react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function AgentsWaitlistForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setState('error')
      setErrorMsg('Adresse email invalide.')
      return
    }

    setState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          source: 'agents_waitlist',
          leadMagnet: 'Agents IA Finance — Accès prioritaire fin août 2026',
        }),
      })

      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string }

      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'Erreur serveur. Réessayez dans un instant.')
      }

      setState('success')
    } catch (err) {
      setState('error')
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue.')
    }
  }

  if (state === 'success') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-5 text-left max-w-md mx-auto">
        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-green-900">Inscription confirmée !</p>
          <p className="text-sm text-green-800 mt-1">
            Vous serez notifié en priorité dès l&apos;ouverture des agents IA, fin août 2026.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 max-w-md mx-auto">
      <label htmlFor="agents-waitlist-email" className="sr-only">
        Votre email professionnel
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="agents-waitlist-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={state === 'loading'}
            placeholder="vous@entreprise.com"
            required
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/15 disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={state === 'loading'}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent-primary text-white text-sm font-semibold rounded-xl hover:bg-accent-primary-hover disabled:opacity-60 transition-all duration-200 whitespace-nowrap"
        >
          {state === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Envoi…
            </>
          ) : (
            'M\'inscrire →'
          )}
        </button>
      </div>

      {state === 'error' && errorMsg && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <p className="text-xs text-slate-400 text-center">
        Gratuit · Sans engagement · Désabonnement en 1 clic
      </p>
    </form>
  )
}
