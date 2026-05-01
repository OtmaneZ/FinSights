'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowRight, Loader2, Lock, Sparkles } from 'lucide-react'
import type { CalculatorSlug } from '@/components/EmailCaptureModal'

type PremiumUpsellCardProps = {
  calculatorType: CalculatorSlug
  hasResult: boolean
  result: Record<string, unknown>
  inputs: Record<string, unknown>
}

function readHintEmail(): string {
  if (typeof window === 'undefined') return ''
  try {
    const captured = localStorage.getItem('finsight_email_captured')
    if (captured && captured.includes('@')) {
      return captured.trim().toLowerCase()
    }
    const stored = localStorage.getItem('finsight_user_email')
    if (stored && stored.includes('@')) {
      return stored.trim().toLowerCase()
    }
  } catch {
    // ignore
  }
  return ''
}

export default function PremiumUpsellCard({
  calculatorType,
  hasResult,
  result,
  inputs,
}: PremiumUpsellCardProps) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!hasResult) {
      setVisible(false)
      return
    }
    const t = window.setTimeout(() => setVisible(true), 3800)
    return () => window.clearTimeout(t)
  }, [hasResult, calculatorType])

  useEffect(() => {
    if (!hasResult) return
    const hint = readHintEmail()
    if (hint) setEmail(hint)
  }, [hasResult])

  const persistEmail = (value: string) => {
    if (typeof window === 'undefined') return
    const trimmed = value.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return
    try {
      localStorage.setItem('finsight_user_email', trimmed)
    } catch {
      // ignore
    }
  }

  const startCheckout = async () => {
    setError('')
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Veuillez saisir une adresse email valide.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/stripe/create-calculator-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculatorType,
          result,
          inputs,
          email: trimmed,
          cancelPath: pathname && pathname.startsWith('/calculateurs') ? pathname : `/calculateurs/${calculatorType}`,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || 'Impossible de créer la session de paiement')
      }

      const url = (data as { url?: string }).url
      if (!url) throw new Error('URL Stripe manquante')

      persistEmail(trimmed)
      window.location.href = url
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  if (!hasResult || !visible) return null

  return (
    <section className="py-8">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              <Sparkles className="h-3.5 w-3.5" />
              Premium
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Rapport complet + Plan d&apos;action 90 jours</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="text-accent-primary font-bold">·</span>
                Benchmark sectoriel détaillé
              </li>
              <li className="flex gap-2">
                <span className="text-accent-primary font-bold">·</span>
                5 recommandations prioritaires chiffrées
              </li>
              <li className="flex gap-2">
                <span className="text-accent-primary font-bold">·</span>
                Simulation d&apos;impact à 90 jours
              </li>
            </ul>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-2xl font-extrabold text-slate-900">9€</p>
            <p className="text-sm text-slate-600">Accès immédiat</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label htmlFor="premium-email" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Email de livraison du PDF
            </label>
            <input
              id="premium-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => persistEmail(email)}
              disabled={loading}
              placeholder="vous@entreprise.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/15 disabled:opacity-60"
            />
          </div>
          <button
            type="button"
            onClick={startCheckout}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-primary px-5 py-3 text-sm font-semibold text-white hover:bg-accent-primary-hover disabled:opacity-60 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirection…
              </>
            ) : (
              <>
                Obtenir mon rapport premium
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5" />
          Paiement sécurisé Stripe · PDF reçu par email · Sans abonnement
        </p>
      </div>
    </section>
  )
}
