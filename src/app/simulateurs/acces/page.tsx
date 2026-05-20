'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type State = 'idle' | 'loading' | 'sent' | 'error'

const ERROR_MESSAGES: Record<string, string> = {
  expired: 'Ce lien a expiré. Demandez-en un nouveau ci-dessous.',
  invalid: 'Lien invalide. Demandez-en un nouveau ci-dessous.',
  missing: 'Paramètre manquant. Demandez un nouveau lien.',
  used: 'Ce lien a déjà été utilisé. Demandez-en un nouveau ci-dessous.',
  server: 'Erreur serveur. Veuillez réessayer.',
}

function AccesContent() {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-accent-primary">FinSight</span>
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {state === 'sent' ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Vérifiez votre boîte mail</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Un lien d&apos;accès vient d&apos;être envoyé à <strong className="text-gray-900">{email}</strong>.
                <br />Il est valable <strong className="text-accent-primary">24 heures</strong>.
              </p>
              <p className="text-xs text-gray-400">
                Pas reçu ? Vérifiez vos spams ou{' '}
                <button onClick={() => { setState('idle'); setEmail('') }} className="text-accent-primary underline hover:opacity-80">
                  réessayez
                </button>.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 shadow-sm mb-5">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs font-medium tracking-widest text-accent-primary uppercase">Accès gratuit</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Accédez aux simulateurs</h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Entrez votre email professionnel pour recevoir un lien d&apos;accès instantané.
                  Aucun mot de passe, aucun engagement.
                </p>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email professionnel
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@entreprise.com"
                    required
                    className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={state === 'loading' || !email}
                  className="w-full bg-accent-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold rounded-xl py-3 text-sm transition-opacity shadow-sm"
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
                    "Recevoir mon lien d'accès →"
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-4">
                En continuant, vous acceptez de recevoir des emails de FinSight.
                <br />Nous ne partageons jamais vos données.
              </p>
            </>
          )}
        </div>

        <p className="text-center mt-6">
          <Link href="/simulateurs" className="text-gray-400 hover:text-gray-600 text-sm transition">
            ← Retour aux simulateurs
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SimulateursAccesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Chargement…</div>
      </div>
    }>
      <AccesContent />
    </Suspense>
  )
}
