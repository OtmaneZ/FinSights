'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Compass } from 'lucide-react'
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
    { type: 'calculator', slug: 'seuil-rentabilite', href: '/calculateurs/seuil-rentabilite', label: 'Seuil de rentabilité', reason: 'Un DSO élevé augmente votre point mort.' },
    { type: 'article', href: '/blog/reduire-dso-50-pourcent-90-jours', label: 'Réduire son DSO de 50 % en 90 jours', reason: 'Guide méthodologique.' },
  ],
  bfr: [
    { type: 'calculator', slug: 'dso', href: '/calculateurs/dso', label: 'Calculateur DSO', reason: 'Les créances clients représentent en moyenne 40 % du BFR.' },
    { type: 'calculator', slug: 'roi', href: '/calculateurs/roi', label: 'Calculateur ROI', reason: 'Évaluez le retour d\'un projet d\'optimisation BFR.' },
    { type: 'article', href: '/blog/bfr-negatif-bon-ou-mauvais', label: 'BFR négatif : bonne ou mauvaise nouvelle ?', reason: 'Analyse approfondie.' },
  ],
  roi: [
    { type: 'calculator', slug: 'bfr', href: '/calculateurs/bfr', label: 'Calculateur BFR', reason: 'Un investissement peut augmenter votre besoin en fonds de roulement.' },
    { type: 'calculator', slug: 'seuil-rentabilite', href: '/calculateurs/seuil-rentabilite', label: 'Seuil de rentabilité', reason: 'Vérifiez si le projet est rentable dès le départ.' },
  ],
  marge: [
    { type: 'calculator', slug: 'seuil-rentabilite', href: '/calculateurs/seuil-rentabilite', label: 'Seuil de rentabilité', reason: 'Votre taux de marge détermine votre point mort.' },
    { type: 'calculator', slug: 'roi', href: '/calculateurs/roi', label: 'Calculateur ROI', reason: 'Mesurez le retour d\'une action d\'amélioration de marge.' },
  ],
  'seuil-rentabilite': [
    { type: 'calculator', slug: 'marge', href: '/calculateurs/marge', label: 'Calculateur Marge', reason: 'Le taux de marge détermine directement votre seuil.' },
    { type: 'calculator', slug: 'bfr', href: '/calculateurs/bfr', label: 'Calculateur BFR', reason: 'Un BFR élevé mobilise du cash en cas de ralentissement.' },
  ],
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

  // Filtrer les calculateurs déjà réalisés
  const completed = new Set(completedTypes())
  const filteredRecs = recs.filter((r) => {
    if (r.type === 'calculator' && r.slug && completed.has(r.slug as CalculatorType)) return false
    return true
  })

  if (filteredRecs.length === 0) return null

  const LABELS: Record<string, string> = {
    dso: 'DSO',
    bfr: 'BFR',
    roi: 'ROI',
    marge: 'Marge',
    'seuil-rentabilite': 'Seuil de rentabilité',
  }

  return (
    <section className="mb-12">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* En-tête */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <Compass className="w-4 h-4 text-slate-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Parcours recommandé
            </h3>
            <p className="text-xs text-gray-500">
              Suite logique après votre calcul {LABELS[lastCalc.type] || lastCalc.type.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Liste des recommandations */}
        <div className="divide-y divide-slate-100">
          {filteredRecs.map((rec, idx) => (
            <Link
              key={idx}
              href={rec.href}
              className="group flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                  {rec.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {rec.reason}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
