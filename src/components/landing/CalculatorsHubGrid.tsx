'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  Clock,
  Wallet,
  Percent,
  TrendingUp,
  BarChart3,
  Flame,
  Users,
  Target,
  Gem,
} from 'lucide-react'
import FadeIn, { StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'

type CalculatorItem = {
  href: string
  title: string
  subtitle: string
  Icon: LucideIcon
}

const CALCULATORS: CalculatorItem[] = [
  {
    href: '/calculateurs/dso',
    title: 'DSO - Délai client moyen',
    subtitle: 'Encaissements, créances et délai d&apos;encaissement.',
    Icon: Clock,
  },
  {
    href: '/calculateurs/bfr',
    title: 'BFR - Besoin en fonds de roulement',
    subtitle: 'Stocks, créances, dettes - cycle et besoin de financement.',
    Icon: Wallet,
  },
  {
    href: '/calculateurs/marge',
    title: 'Marge - Taux de marge brute',
    subtitle: 'Rentabilité directe et levier opérationnel.',
    Icon: Percent,
  },
  {
    href: '/calculateurs/roi',
    title: 'ROI - Retour sur investissement',
    subtitle: 'Rentabilité projet et priorisation des investissements.',
    Icon: TrendingUp,
  },
  {
    href: '/calculateurs/ebitda',
    title: 'EBITDA - Rentabilité opérationnelle',
    subtitle: 'Performance avant amortissements et charges financières.',
    Icon: BarChart3,
  },
  {
    href: '/calculateurs/burn-rate',
    title: 'Burn rate - Consommation cash',
    subtitle: 'Runway et rythme de dépense du cash.',
    Icon: Flame,
  },
  {
    href: '/calculateurs/cac-ltv',
    title: 'CAC / LTV - Acquisition client',
    subtitle: 'Coût d&apos;acquisition vs valeur vie client.',
    Icon: Users,
  },
  {
    href: '/calculateurs/seuil-rentabilite',
    title: 'Seuil de rentabilité',
    subtitle: 'Point mort, volume critique et structure de coûts.',
    Icon: Target,
  },
  {
    href: '/calculateurs/valorisation',
    title: 'Valorisation',
    subtitle: 'Estimation de valeur et références sectorielles.',
    Icon: Gem,
  },
]

export default function CalculatorsHubGrid() {
  return (
    <section
      id="calculateurs"
      className="py-24 lg:py-32 bg-white scroll-mt-24"
      aria-labelledby="calculateurs-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="text-center mb-14 lg:mb-16">
          <span className="text-accent-primary text-sm font-medium tracking-widest uppercase">
            GRATUIT · SANS INSCRIPTION
          </span>
          <h2
            id="calculateurs-heading"
            className="font-serif text-4xl lg:text-5xl font-medium text-gray-900 mt-4 mb-5"
          >
            9 outils pour mesurer votre santé financière
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Calculez en 2 minutes. Résultat immédiat. Rapport premium optionnel.
          </p>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          staggerDelay={0.08}
        >
          {CALCULATORS.map(({ href, title, subtitle, Icon }) => (
            <StaggerItem key={href}>
              <Link
                href={href}
                className="group flex flex-col h-full rounded-xl p-6 border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-accent-primary hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-accent-primary/10 transition-colors">
                    <Icon className="w-5 h-5 text-gray-700 group-hover:text-accent-primary transition-colors" />
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium tracking-wide shrink-0">
                    Gratuit · 2 min
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-accent-primary transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{subtitle}</p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.15} className="mt-12 lg:mt-14 text-center max-w-3xl mx-auto">
          <p className="text-sm text-gray-500 leading-relaxed">
            Besoin d&apos;un rapport approfondi ? Chaque calculateur propose un rapport
            premium PDF avec analyse personnalisée et plan d&apos;action - 9€
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
