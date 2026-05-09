'use client'

/**
 * ScorePaywall — Composant paywall SCORIS 49€
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Affiche le bloc de conversion entre le score global et les 4 piliers.
 * Gère :
 *   - Capture email (lead magnet)
 *   - Bouton Stripe Checkout (49€ one-time)
 *   - Fallback sans Stripe : capture email seul + message "en cours"
 *   - État loading / erreur
 *
 * Props :
 *   score    — Score global pour affichage contextualisé
 *   sector   — Secteur pour metadata Stripe
 *   onUnlock — Callback appelé si ?success=true dans l'URL (déjà payé)
 */

import { useState } from 'react'
import { Lock, Mail, FileText, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { ScorisLevel } from '@/lib/scoring/diagnosticScore'

export interface ScorePaywallProps {
  score: number | null
  sector: string
  /** Niveau SCORIS choisi — détermine le prix Stripe et le libellé */
  scorisLevel?: ScorisLevel
  /** Aperçu PDF gratuit (sections verrouillées) — ex. handleDownloadPDF({ isPremium: false }) */
  onPreviewDownload?: () => void | Promise<void>
  /** Affiche un état chargement sur le lien aperçu */
  previewLoading?: boolean
}

const BULLET_POINTS_STANDARD = [
  'Score détaillé par pilier — Trésorerie, Rentabilité, Résilience, Risques',
  'Plan d\'action 90 jours — 3 priorités calibrées sur vos chiffres réels',
  'Synthèse rédigée par IA — ton DAF senior, benchmarks sectoriels BdF 2024',
  'Format consulting A4 — 9 pages, prêt à présenter à votre banque ou associés',
]

const BULLET_POINTS_STRATEGIQUE = [
  'Tout le rapport SCORIS Standard — 4 piliers, plan 90 jours, benchmarks BdF 2024',
  'Z-Score Altman — zone de risque de défaillance (distinct du score /100)',
  'Analyse SWOT par IA — forces / menaces à partir de vos réponses',
  'Valorisation & Porter simplifié — lecture stratégique enrichie',
  'Format consulting A4 étendu — 13 pages, pack banquier & dirigeant',
]

export default function ScorePaywall({
  score,
  sector,
  scorisLevel = 'standard',
  onPreviewDownload,
  previewLoading = false,
}: ScorePaywallProps) {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)
  const [leadSaved, setLeadSaved] = useState(false)
  const [stripeUnavailable, setStripeUnavailable] = useState(false)
  const [error, setError] = useState('')

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')
    setError('')

    if (!isValidEmail(email)) {
      setEmailError('Adresse email invalide')
      return
    }

    setLoading(true)

    // 1. Capturer le lead en DB (non-bloquant)
    try {
      await fetch('/api/diagnostic/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, score, sector }),
      })
      setLeadSaved(true)
    } catch {
      // Non-bloquant
    }

    // 2. Créer la session Stripe Checkout
    try {
      const returnPath =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : '/diagnostic/guide'
      const checkoutRes = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          score,
          sector,
          product: scorisLevel === 'strategique' ? 'scoris_strategique' : 'scoris_report',
          scorisLevel,
          returnPath,
        }),
      })

      const checkoutData = await checkoutRes.json()

      if (checkoutData.error === 'stripe_not_configured') {
        // Fallback : Stripe non configuré → lead capturé, message de confirmation
        setStripeUnavailable(true)
        setLoading(false)
        return
      }

      if (!checkoutData.success || !checkoutData.url) {
        throw new Error(checkoutData.error || 'Erreur lors de la création du paiement')
      }

      // Redirect vers Stripe Checkout
      window.location.href = checkoutData.url

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoading(false)
    }
  }

  // ── Fallback : Stripe non configuré ─────────────────────────────────────
  if (stripeUnavailable) {
    return (
      <div className="relative rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-serif text-xl font-medium text-gray-900 mb-2">
          Votre rapport est en préparation
        </h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
          Nous avons enregistré votre email. Vous recevrez votre rapport SCORIS™ personnalisé
          dès que le service de paiement sera disponible.
        </p>
        <p className="text-xs text-gray-400 mt-4">
          Ou contactez-nous directement : <a href="mailto:otmane@zineinsight.com" className="underline">otmane@zineinsight.com</a>
        </p>
      </div>
    )
  }

  // ── Composant principal ──────────────────────────────────────────────────
  return (
    <div
      id="scoris-paywall"
      className="relative rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden scroll-mt-24"
    >
      {/* Halo décoratif */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-8 lg:p-10">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Lock className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
            Rapport complet
          </span>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start">
          {/* Colonne gauche — pitch */}
          <div>
            <h2 className="font-serif text-2xl lg:text-3xl font-medium text-white leading-tight mb-4">
              Votre score détaillé
              <br />
              <span className="text-blue-400">+ plan d'action personnalisé</span>
            </h2>

            {score !== null && (
              <div className="flex items-baseline gap-2 mb-5">
                <span className="font-serif text-4xl font-medium text-white">{score}</span>
                <span className="text-gray-500 font-medium">/ 100</span>
                <span className="text-xs font-semibold text-gray-400 ml-2">score calculé ✓</span>
              </div>
            )}

            <ul className="space-y-3 mb-6">
              {(scorisLevel === 'strategique' ? BULLET_POINTS_STRATEGIQUE : BULLET_POINTS_STANDARD).map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300 leading-snug">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span>Généré par IA · Benchmarks Banque de France 2024 · Livré par email</span>
            </div>
          </div>

          {/* Colonne droite — formulaire */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
              {/* Prix */}
              <div className="flex items-baseline gap-2 mb-5">
                <span className="font-serif text-4xl font-bold text-white">
                  {scorisLevel === 'strategique' ? '99 €' : '49 €'}
                </span>
                <span className="text-sm text-gray-400">· paiement unique</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                    Email de livraison
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                      placeholder="vous@entreprise.com"
                      required
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all"
                    />
                  </div>
                  {emailError && (
                    <p className="text-xs text-red-400 mt-1">{emailError}</p>
                  )}
                </div>

                {error && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                {/* CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Redirection vers le paiement…
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Obtenir mon rapport complet
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Mentions */}
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-1">
                  {['Paiement sécurisé Stripe', 'Rapport PDF', 'Livré par email'].map((m) => (
                    <span key={m} className="text-[10px] text-gray-500 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-gray-600" />
                      {m}
                    </span>
                  ))}
                </div>

                {onPreviewDownload && (
                  <div className="pt-3 text-center border-t border-white/10 mt-3">
                    <button
                      type="button"
                      onClick={() => void onPreviewDownload()}
                      disabled={previewLoading || loading}
                      className="text-[11px] text-gray-500 hover:text-gray-400 underline-offset-2 hover:underline disabled:opacity-50 disabled:no-underline transition-colors"
                    >
                      {previewLoading ? 'Génération de l’aperçu…' : 'Voir l\'aperçu gratuit (sections clés verrouillées) →'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
