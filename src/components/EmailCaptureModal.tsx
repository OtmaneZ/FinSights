'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Mail, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

const STORAGE_KEY = 'finsight_email_captured'

export type EmailCaptureStatus = 'idle' | 'loading' | 'success' | 'error'

export type CalculatorSlug =
  | 'dso'
  | 'bfr'
  | 'roi'
  | 'marge'
  | 'seuil-rentabilite'
  | 'ebitda'
  | 'cac-ltv'
  | 'burn-rate'
  | 'valorisation'

type EmailCaptureModalProps = {
  calculatorType: CalculatorSlug
  hasResult: boolean
  result: Record<string, unknown>
  inputs: Record<string, unknown>
}

function readCaptured(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function markCaptured() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // ignore
  }
}

export default function EmailCaptureModal({
  calculatorType,
  hasResult,
  result,
  inputs,
}: EmailCaptureModalProps) {
  const alreadyCaptured = useMemo(() => readCaptured(), [])
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<EmailCaptureStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const canPrompt = !alreadyCaptured

  useEffect(() => {
    if (!canPrompt || !hasResult) return
    const t = window.setTimeout(() => setOpen(true), 2000)
    return () => window.clearTimeout(t)
  }, [canPrompt, hasResult, calculatorType])

  const close = useCallback(() => {
    setOpen(false)
    setStatus('idle')
    setErrorMsg('')
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error')
      setErrorMsg('Adresse email invalide.')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          calculatorType,
          result,
          inputs,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error || 'Erreur serveur')
      }

      markCaptured()
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue.')
    }
  }

  if (!canPrompt) return null

  return (
    <>
      {hasResult && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 ring-1 ring-white/10 hover:bg-slate-800 transition-colors"
        >
          <Mail className="h-4 w-4" />
          Recevoir mon rapport PDF
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
          <button
            type="button"
            aria-label="Fermer"
            className="absolute inset-0 bg-slate-900/50"
            onClick={close}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">FinSight™</p>
                <h2 className="text-lg font-bold text-slate-900">Recevoir mon rapport PDF gratuit</h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                aria-label="Fermer la fenêtre"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-4">
              {status === 'success' ? (
                <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">C&apos;est envoyé</p>
                    <p className="text-sm text-green-800 mt-1">
                      Vérifiez votre boîte mail (et vos spams) dans les prochaines minutes.
                    </p>
                    <button
                      type="button"
                      onClick={close}
                      className="mt-3 text-sm font-semibold text-green-900 underline"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-800" htmlFor="finsight-capture-email">
                    Votre email professionnel
                  </label>
                  <input
                    id="finsight-capture-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    placeholder="vous@entreprise.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/15 disabled:opacity-60"
                  />
                  <p className="text-xs text-slate-500">
                    Rapport PDF personnalisé + benchmark sectoriel. Gratuit, sans engagement.
                  </p>

                  {status === 'error' && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{errorMsg || 'Impossible d’envoyer le rapport.'}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent-primary px-4 py-3 text-sm font-semibold text-white hover:bg-accent-primary-hover disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        Recevoir mon rapport gratuit
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
