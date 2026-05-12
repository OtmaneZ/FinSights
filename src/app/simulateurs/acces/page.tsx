'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type State = 'idle' | 'loading' | 'sent' | 'error'

const ERROR_MESSAGES: Record<string, string> = {
  expired: 'Ce lien a expiré. Demandez-en un nouveau ci-dessous.',
  invalid: 'Lien invalide. Demandez-en un nouveau ci-dessous.',
  missing: 'Paramètre manquant. Demandez un nouveau lien.',
  server: 'Erreur serveur. Veuillez réessayer.',
}

export default function SimulateursAccesPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const err = searchParams?.get('error')
    if (err && ERROR_MESSAGES[err]) {
      setErrorMsg(ERROR_MESSAGES[err])
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/simulateurs/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Erreur inconnue.')
        setState('error')
      } else {
        setState('sent')
      }
    } catch {
      setErrorMsg('Erreur réseau. Vérifiez votre connexion.')
      setState('error')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-amber-400">FinSight</span>
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {state === 'sent' ? (
            /* État : lien envoyé */
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Vérifiez votre boîte mail</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Un lien d'accès vient d'être envoyé à <strong className="text-slate-200">{email}</strong>.
                <br />Il est valable <strong className="text-amber-400">24 heures</strong>.
              </p>
              <p className="text-xs text-slate-500">
                Pas reçu ? Vérifiez vos spams ou{' '}
                <button
                  onClick={() => { setState('idle'); setEmail('') }}
                  className="text-amber-400 underline hover:text-amber-300"
                >
                  réessayez
                </button>.
              </p>
            </div>
          ) : (
            /* État : formulaire */
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Accès gratuit
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Accédez aux simulateurs
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Entrez votre email professionnel pour recevoir un lien d'accès instantané.
                  Aucun mot de passe, aucun engagement.
                </p>
              </div>

              {/* Message d'erreur (depuis query param ou fetch) */}
              {errorMsg && (
                <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm rounded-lg px-4 py-3 mb-4">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Email professionnel
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@entreprise.com"
                    required
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={state === 'loading' || !email}
                  className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl py-3 text-sm transition-colors"
                >
                  {state === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Envoi en cours…
                    </span>
                  ) : (
                    'Recevoir mon lien d\'accès →'
                  )}
                </button>
              </form>

              <p className="text-xs text-slate-600 text-center mt-4">
                En continuant, vous acceptez de recevoir des emails de FinSight.
                <br />Nous ne partageons jamais vos données.
              </p>
            </>
          )}
        </div>

        <p className="text-center mt-6">
          <Link href="/simulateurs" className="text-slate-500 hover:text-slate-400 text-sm transition">
            ← Retour aux simulateurs
          </Link>
        </p>
      </div>
    </div>
  )
}
