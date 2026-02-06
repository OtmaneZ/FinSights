'use client'

import Link from 'next/link'
import { ArrowRight, Calculator, PiggyBank, Users, FileText, BarChart3 } from 'lucide-react'

interface InternalLink {
    href: string
    title: string
    description: string
    icon: 'calculator' | 'piggybank' | 'users' | 'article' | 'chart'
}

interface InternalLinksProps {
    title?: string
    subtitle?: string
    links?: InternalLink[]
    variant?: 'default' | 'compact' | 'cards'
}

const defaultLinks: InternalLink[] = [
    {
        href: '/calculateurs/dso',
        title: 'Calculateur DSO',
        description: 'Calculez votre délai moyen de paiement clients en 30 secondes',
        icon: 'calculator'
    },
    {
        href: '/calculateurs/bfr',
        title: 'Calculateur BFR',
        description: 'Estimez votre besoin en fonds de roulement',
        icon: 'piggybank'
    },
    {
        href: '/consulting',
        title: 'Conseil DAF externalisé',
        description: 'Accompagnement finance stratégique pour PME',
        icon: 'users'
    },
    {
        href: '/daf-externalise-pme',
        title: 'DAF Externalisé PME',
        description: 'Pilotez votre trésorerie sans recruter',
        icon: 'chart'
    }
]

const iconMap = {
    calculator: Calculator,
    piggybank: PiggyBank,
    users: Users,
    article: FileText,
    chart: BarChart3
}

export default function InternalLinks({
    title = '📚 Ressources complémentaires',
    subtitle = 'Outils et guides pour piloter vos finances',
    links = defaultLinks,
    variant = 'default'
}: InternalLinksProps) {
    if (variant === 'compact') {
        return (
            <div className="bg-blue-50 rounded-xl p-6 my-8">
                <h3 className="font-bold text-gray-900 mb-4">{title}</h3>
                <ul className="space-y-2">
                    {links.map((link, i) => (
                        <li key={i}>
                            <Link 
                                href={link.href} 
                                className="text-accent-primary hover:underline flex items-center gap-2"
                            >
                                <ArrowRight className="w-4 h-4" />
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    if (variant === 'cards') {
        return (
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
                            <p className="text-gray-600">{subtitle}</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {links.map((link, i) => {
                                const IconComponent = iconMap[link.icon]
                                return (
                                    <Link
                                        key={i}
                                        href={link.href}
                                        className="group flex items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 hover:border-accent-primary hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-accent-primary/10 flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
                                            <IconComponent className="w-6 h-6 text-accent-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 group-hover:text-accent-primary transition-colors">
                                                {link.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">{link.description}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 group-hover:text-accent-primary transition-all" />
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    // Default variant
    return (
        <div className="bg-slate-50 rounded-2xl p-8 my-8 border border-slate-200">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600">{subtitle}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {links.map((link, i) => {
                    const IconComponent = iconMap[link.icon]
                    return (
                        <Link
                            key={i}
                            href={link.href}
                            className="group flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200 hover:border-accent-primary hover:shadow-md transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-accent-primary/10 transition-colors flex-shrink-0">
                                <IconComponent className="w-5 h-5 text-slate-600 group-hover:text-accent-primary transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-900 group-hover:text-accent-primary transition-colors">
                                    {link.title}
                                </h4>
                                <p className="text-sm text-slate-500 truncate">{link.description}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-accent-primary transition-all flex-shrink-0 mt-1" />
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

// Pre-configured link sets for different contexts
export const calculatorLinks: InternalLink[] = [
    {
        href: '/calculateurs/dso',
        title: 'Calculateur DSO gratuit',
        description: 'Délai moyen de paiement clients',
        icon: 'calculator'
    },
    {
        href: '/calculateurs/bfr',
        title: 'Calculateur BFR gratuit',
        description: 'Besoin en fonds de roulement',
        icon: 'piggybank'
    }
]

export const consultingLinks: InternalLink[] = [
    {
        href: '/consulting',
        title: 'Services de conseil',
        description: 'Audit financier et accompagnement DAF',
        icon: 'users'
    },
    {
        href: '/daf-externalise-pme',
        title: 'DAF Externalisé PME',
        description: 'Direction financière à temps partagé',
        icon: 'chart'
    }
]

export const blogLinks: InternalLink[] = [
    {
        href: '/blog/calcul-dso-formule-2025',
        title: 'Guide : Formule DSO complète',
        description: 'Exemples et benchmarks sectoriels',
        icon: 'article'
    },
    {
        href: '/blog/reduire-dso-50-pourcent-90-jours',
        title: 'Réduire son DSO de 50%',
        description: 'Méthode en 90 jours',
        icon: 'article'
    },
    {
        href: '/blog/dso-vs-dpo-optimiser-tresorerie',
        title: 'DSO vs DPO',
        description: 'Optimiser le Cash Conversion Cycle',
        icon: 'chart'
    }
]
