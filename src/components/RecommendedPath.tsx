'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Compass, BookOpen } from 'lucide-react'
import { useCalculatorHistory, type CalculatorType } from '@/hooks/useCalculatorHistory'

// ---------------------------------------------------------------------------
// Configuration : parcours recommandés par type de calculateur
// ---------------------------------------------------------------------------

interface Recommendation {
  type: 'calculator' | 'article'
  slug?: string
  href: string
  label: string
  reason: string
}

const RECOMMENDATIONS: Partial<Record<CalculatorType, Recommendation[]>> = {
  dso: [
    { type: 'calculator', slug: 'bfr', href: '/calculateurs/bfr', label: 'Calculateur BFR', reason: 'Le DSO impacte directement votre besoin en fonds de roulement.' },
    { type: 'calculator', slug: 'seuil-rentabilite', href: '/calculateurs/seuil-rentabilite', label: 'Seuil de rentabilite', reason: 'Un DSO eleve augmente votre point mort operationnel.' },
    { type: 'article', href: '/blog/reduire-dso-50-pourcent-90-jours', label: 'Reduire son DSO de 50% en 90 jours', reason: 'Methodologie et plan d\'action.' },
  ],
  bfr: [
    { type: 'calculator', slug: 'dso', href: '/calculateurs/dso', label: 'Calculateur DSO', reason: 'Les creances clients representent en moyenne 40% du BFR.' },
    { type: 'calculator', slug: 'roi', href: '/calculateurs/roi', label: 'Calculateur ROI', reason: 'Evaluez le retour d\'un projet d\'optimisation BFR.' },
    { type: 'article', href: '/blog/bfr-negatif-bon-ou-mauvais', label: 'BFR negatif : analyse', reason: 'Implications strategiques et operationnelles.' },
  ],
  roi: [
    { type: 'calculator', slug: 'bfr', href: '/calculateurs/bfr', label: 'Calculateur BFR', reason: 'Un investissement peut augmenter votre besoin en fonds de roulement.' },
    { type: 'calculator', slug: 'seuil-rentabilite', href: '/calculateurs/seuil-rentabilite', label: 'Seuil de rentabilite', reason: 'Verifiez la rentabilite structurelle du projet.' },
  ],
  marge: [
    { type: 'calculator', slug: 'seuil-rentabilite', href: '/calculateurs/seuil-rentabilite', label: 'Seuil de rentabilite', reason: 'Votre taux de marge determine directement votre point mort.' },
    { type: 'calculator', slug: 'roi', href: '/calculateurs/roi', label: 'Calculateur ROI', reason: 'Mesurez le retour d\'une action d\'amelioration de marge.' },
  ],
  'seuil-rentabilite': [
    { type: 'calculator', slug: 'marge', href: '/calculateurs/marge', label: 'Calculateur Marge', reason: 'Le taux de marge determine directement votre seuil.' },
    { type: 'calculator', slug: 'bfr', href: '/calculateurs/bfr', label: 'Calculateur BFR', reason: 'Un BFR eleve mobilise du cash en phase de ralentissement.' },
  ],
}

const LABELS: Record<string, string> = {
  dso: 'DSO',
  bfr: 'BFR',
  roi: 'ROI',
  marge: 'Marge',
  'seuil-rentabilite': 'Seuil de rentabilite',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RecommendedPath() {
  const { history, completedTypes } = useCalculatorHistory()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || history.length === 0) return null

  const lastCalc = history[0]
  const recs = RECOMMENDATIONS[lastCalc.type]
  if (!recs || recs.length === 0) return null

  // Filtrer les calculateurs deja realises
  const completed = new Set(completedTypes())
  const filteredRecs = recs.filter((r) => {
    if (r.type === 'calculator' && r.slug && completed.has(r.slug as CalculatorType)) return false
    return true
  })

  if (filteredRecs.length === 0) return null

  return (
    <section className="mb-14">
      <div className="surface rounded-xl overflow-hidden">
        {/* En-tete */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary-subtle)] flex items-center justify-center">
            <Compass className="w-4 h-4 text-[var(--accent-primary)]" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary">
              Analyse suivante recommandee
            </p>
            <p className="text-xs text-tertiary">
              Suite logique apres le calcul {LABELS[lastCalc.type] || lastCalc.type.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Liste des recommandations */}
        <div className="divide-y divide-[var(--border-subtle)]">
          {filteredRecs.map((rec, idx) => (
            <Link
              key={idx}
              href={rec.href}
              className="group flex items-center justify-between px-6 py-4 hover:bg-[var(--surface-hover)] transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {rec.type === 'article' && (
                  <BookOpen className="w-4 h-4 text-tertiary flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary group-hover:text-[var(--accent-primary)] transition-colors">
                    {rec.label}
                  </p>
                  <p className="text-xs text-tertiary mt-0.5 truncate">
                    {rec.reason}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-tertiary group-hover:text-[var(--accent-primary)] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
