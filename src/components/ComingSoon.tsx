'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export interface ComingSoonProps {
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
}

/**
 * Carte statique « Bientôt disponible » - utilisée en mode veille pour les démos agents.
 */
export default function ComingSoon({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
}: ComingSoonProps) {
  return (
    <section className="flex min-h-[55vh] w-full items-center justify-center px-4 py-16">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>
        <Link
          href={ctaHref}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-accent-primary dark:hover:bg-accent-primary-hover"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  )
}

export function ComingSoonTresoris() {
  return (
    <ComingSoon
      title="Tresoris - Bientôt disponible"
      subtitle="L'agent IA de pilotage trésorerie arrive prochainement."
      ctaLabel="Présentation de l'agent"
      ctaHref="/agents/tresoris"
    />
  )
}

export function ComingSoonDashis() {
  return (
    <ComingSoon
      title="Dashis - Bientôt disponible"
      subtitle="L'agent IA d'analyse financière arrive prochainement."
      ctaLabel="Présentation de l'agent"
      ctaHref="/agents/dashis"
    />
  )
}
