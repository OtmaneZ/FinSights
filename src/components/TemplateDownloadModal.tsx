'use client'

import { useEffect, useState } from 'react'
import { X, Loader2, Mail } from 'lucide-react'

export type TemplateSlug = 'budget-previsionnel' | 'tracker-dso' | 'dashboard-cashflow'

export type TemplateDownloadModalProps = {
  templateName: string
  templateSlug: TemplateSlug
  xlsxPath: string
  isOpen: boolean
  onClose: () => void
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

export default function TemplateDownloadModal({
  templateName,
  templateSlug,
  xlsxPath,
  isOpen,
  onClose,
}: TemplateDownloadModalProps) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<SubmitState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setFirstName('')
      setEmail('')
      setState('idle')
      setErrorMsg('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = firstName.trim()
    const trimmedEmail = email.trim().toLowerCase()

    if (trimmedName.length < 2) {
      setState('error')
      setErrorMsg('Merci de saisir votre prénom.')
      return
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setState('error')
      setErrorMsg('Merci de saisir une adresse email valide.')
      return
    }

    setState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: trimmedName,
          email: trimmedEmail,
          source: `template_${templateSlug}`,
          leadMagnet: templateName,
          newsletter_opt_in: true,
          xlsxPath,
        }),
      })

      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string }

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Une erreur est survenue.')
      }

      setState('success')
    } catch (err) {
      setState('error')
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue. Merci de réessayer.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      <button
        type="button"
        aria-label="Fermer"
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-border-default bg-primary shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border-default px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-primary">Télécharger {templateName}</h2>
            <p className="text-sm text-secondary mt-1">Recevez le fichier directement par email.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-tertiary hover:bg-gray-100 hover:text-primary"
            aria-label="Fermer la fenêtre"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4">
          {state === 'success' ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="font-semibold text-green-900">Vérifiez votre boîte email !</p>
              <p className="text-sm text-green-800 mt-2">
                Le fichier Excel vous a été envoyé en pièce jointe.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 text-sm font-semibold text-accent-primary underline"
              >
                Fermer
              </button>
              <div className="mt-5 pt-4 border-t border-green-200">
                <p className="text-sm text-green-900 font-medium mb-2">
                  Vous souhaitez analyser votre BFR réel ?
                </p>
                <a
                  href="/calculateurs/bfr"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-primary hover:underline"
                >
                  Calculer mon BFR gratuitement →
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="template-firstname" className="block text-sm font-semibold text-primary mb-1">
                  Prénom <span className="text-red-600">*</span>
                </label>
                <input
                  id="template-firstname"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={state === 'loading'}
                  required
                  className="w-full rounded-xl border border-border-default bg-primary px-4 py-3 text-sm outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/15 disabled:opacity-60"
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label htmlFor="template-email" className="block text-sm font-semibold text-primary mb-1">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  id="template-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={state === 'loading'}
                  required
                  className="w-full rounded-xl border border-border-default bg-primary px-4 py-3 text-sm outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/15 disabled:opacity-60"
                  placeholder="vous@entreprise.com"
                />
              </div>

              <p className="text-xs text-tertiary">Gratuit · Sans spam · Désabonnement en 1 clic</p>

              {state === 'error' && errorMsg && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={state === 'loading'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent-primary px-4 py-3 text-sm font-semibold text-white hover:bg-accent-primary-hover disabled:opacity-60"
              >
                {state === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Recevoir le template →
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
