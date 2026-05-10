'use client'

import Link from 'next/link'
import FadeIn from '@/components/ui/FadeIn'

const BLOCKS = [
  {
    title: 'Blog',
    description: '31 articles sur le pilotage financier PME',
    cta: 'Lire le blog →',
    href: '/blog',
  },
  {
    title: 'Guide pilotage PME',
    description: 'Méthode complète pour structurer votre pilotage',
    cta: 'Lire le guide →',
    href: '/pilotage-financier-pme',
  },
  {
    title: 'Fondamentaux',
    description: 'Cash, marges, résilience — les bases',
    cta: 'Voir les fondamentaux →',
    href: '/fondamentaux',
  },
] as const

export default function LatestResourcesBlock() {
  return (
    <section className="py-24 lg:py-32 bg-white" aria-labelledby="ressources-heading">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="text-center mb-14 lg:mb-16">
          <span className="text-accent-primary text-sm font-medium tracking-widest uppercase">
            RESSOURCES
          </span>
          <h2
            id="ressources-heading"
            className="font-serif text-4xl lg:text-5xl font-medium text-gray-900 mt-4 mb-5"
          >
            Apprendre la finance d&apos;entreprise
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Articles, guides et fondamentaux pour structurer votre pilotage.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {BLOCKS.map((block, i) => (
            <FadeIn key={block.href} delay={i * 0.08}>
              <div className="h-full rounded-xl border border-gray-200 bg-white p-8 flex flex-col shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{block.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">
                  {block.description}
                </p>
                <Link
                  href={block.href}
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent-primary hover:opacity-90 transition-opacity"
                >
                  {block.cta}
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
