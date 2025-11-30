import { Metadata } from 'next'
import Link from 'next/link'
import { Download, BookOpen, FileText, CheckSquare, TrendingUp, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'Guides PDF Gratuits Finance | 4 Guides CFO/DAF | FinSight',
    description: 'Téléchargez gratuitement 4 guides PDF pour CFO/DAF : Checklist closing, 15 Ratios financiers, Guide BFR, 20 KPIs essentiels. Contenu professionnel actionnable.',
    openGraph: {
        title: '4 Guides PDF Gratuits pour CFO/DAF | FinSight',
        description: 'Guides professionnels gratuits pour maîtriser vos finances',
        type: 'website'
    }
}

interface Guide {
    id: string
    title: string
    description: string
    pages: string
    icon: any
    features: string[]
    downloadUrl: string
    color: string
    badge?: string
    topics: string[]
}

const guides: Guide[] = [
    {
        id: 'checklist-closing',
        title: 'Checklist Closing Financier Mensuel',
        description: 'La checklist complète pour réussir votre clôture mensuelle sans rien oublier',
        pages: '10 pages',
        icon: CheckSquare,
        features: [
            '✅ Checklist jour par jour (J-5 à J+3)',
            '📝 23 points de contrôle essentiels',
            '⏱️ Timing optimisé pour closing rapide',
            '🔄 Process bancaire & fournisseurs',
            '📊 Contrôles pré-reporting',
            '📄 Format PDF imprimable ou digital'
        ],
        downloadUrl: '/ressources/guides/checklist-closing-financier.pdf',
        color: 'from-green-500 to-green-600',
        badge: '⚡ Gain de temps',
        topics: ['Closing', 'Process', 'Checklist', 'Comptabilité']
    },
    {
        id: '15-ratios-financiers',
        title: '15 Ratios Financiers Expliqués',
        description: 'Le guide exhaustif des ratios financiers pour analyser la santé de votre entreprise',
        pages: '13 pages',
        icon: TrendingUp,
        features: [
            '📊 5 Ratios de Liquidité (Current, Quick, Cash...)',
            '💰 5 Ratios de Rentabilité (ROE, ROA, ROCE...)',
            '📈 5 Ratios de Structure (Endettement, Autonomie...)',
            '✅ Formules détaillées + exemples chiffrés',
            '🎯 Seuils d\'alerte & benchmarks France',
            '📖 Interprétation par secteur d\'activité'
        ],
        downloadUrl: '/ressources/guides/15-ratios-financiers-expliques.pdf',
        color: 'from-blue-500 to-blue-600',
        badge: '🔥 Le plus complet',
        topics: ['Ratios', 'Analyse', 'Solvabilité', 'Performance']
    },
    {
        id: 'guide-bfr-optimiser-tresorerie',
        title: 'Guide BFR : Optimiser sa Trésorerie',
        description: 'Maîtrisez le Besoin en Fonds de Roulement pour améliorer votre cash-flow',
        pages: '9 pages',
        icon: TrendingUp,
        features: [
            '💰 Comprendre le BFR : formule et composantes',
            '📊 Calculer votre BFR en pratique',
            '⚡ 10 leviers pour réduire votre BFR',
            '🎯 Optimiser DSO, DIO et DPO',
            '📈 Cas pratiques avec calculs détaillés',
            '✅ Checklist d\'actions immédiates'
        ],
        downloadUrl: '/ressources/guides/guide-bfr-optimiser-tresorerie.pdf',
        color: 'from-green-500 to-teal-600',
        badge: '💡 Actionnable',
        topics: ['BFR', 'Trésorerie', 'Cash-flow', 'Optimisation']
    },
    {
        id: 'tableau-de-bord-cfo-20-kpis',
        title: 'Tableau de Bord CFO : 20 KPIs Essentiels',
        description: 'Le dashboard complet pour piloter votre entreprise avec 20 indicateurs clés',
        pages: '11 pages',
        icon: TrendingUp,
        features: [
            '📊 20 KPIs répartis en 4 catégories',
            '📈 5 KPIs Croissance (ARR, MRR, CAC, LTV, Churn)',
            '💰 5 KPIs Rentabilité (Marge, EBITDA, Burn, Break-even, ROI)',
            '🏦 5 KPIs Trésorerie (Runway, DSO, Quick ratio, BFR, FCF)',
            '⚙️ 5 KPIs Opérationnels (NPS, LTV/CAC, Payback, Productivité, Conversion)',
            '✅ Formules + Benchmarks + Exemples chiffrés'
        ],
        downloadUrl: '/ressources/guides/tableau-de-bord-cfo-20-kpis.pdf',
        color: 'from-purple-500 to-blue-600',
        badge: '🎯 Complet',
        topics: ['KPIs', 'Dashboard', 'Performance', 'Pilotage']
    },
    {
        id: 'guide-levee-fonds-cfo',
        title: 'Guide Levée de Fonds pour CFO',
        description: 'Préparez votre levée de fonds avec la checklist financière complète',
        pages: '22 pages',
        icon: FileText,
        features: [
            '💰 Due diligence financière : documents requis',
            '📊 Business plan financier : 5 ans de prévisions',
            '💳 Valorisation : méthodes DCF, multiples, comparables',
            '⏰ Timeline fundraising : 6 mois étape par étape',
            '📋 Term sheet : clauses à négocier',
            '🎯 Red flags investisseurs & comment les éviter'
        ],
        downloadUrl: '/ressources/guides/guide-levee-fonds-cfo.pdf',
        color: 'from-purple-500 to-purple-600',
        badge: '🚀 Bientôt disponible',
        topics: ['Levée de fonds', 'Valorisation', 'Fundraising', 'Investisseurs']
    }
]

export default function GuidesPage() {
    const availableGuides = guides.filter(g => g.badge !== '🚀 Bientôt disponible')
    const comingSoonGuides = guides.filter(g => g.badge === '🚀 Bientôt disponible')

    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-6">
                        <BookOpen className="w-4 h-4 text-accent-primary" />
                        <span className="text-accent-primary text-sm font-semibold">Téléchargement Direct • Sans Email</span>
                    </div>

                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Guides PDF Professionnels<br />
                        <span className="text-accent-primary">pour CFO & DAF</span>
                    </h1>

                    <p className="text-xl text-secondary max-w-3xl mx-auto mb-4">
                        Téléchargez gratuitement nos 4 guides pratiques :<br />
                        Closing mensuel • 15 Ratios financiers • Optimisation BFR • 20 KPIs dashboard
                    </p>

                    <div className="flex items-center justify-center gap-6 text-sm text-tertiary">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-green-500" />
                            <span>100% Gratuit</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Download className="w-4 h-4 text-blue-500" />
                            <span>Téléchargement instantané</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-500" />
                            <span>PDF Professionnel</span>
                        </div>
                    </div>
                </div>

                {/* Guides disponibles */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8">Guides Disponibles</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {availableGuides.map((guide) => {
                            const Icon = guide.icon
                            return (
                                <div
                                    key={guide.id}
                                    className="surface rounded-2xl p-8 border-2 border-border-default hover:border-accent-primary transition-all group"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`p-4 rounded-xl bg-gradient-to-br ${guide.color} text-white`}>
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        {guide.badge && (
                                            <span className="inline-block px-3 py-1 bg-accent-primary-subtle text-accent-primary text-xs font-bold rounded-full">
                                                {guide.badge}
                                            </span>
                                        )}
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-accent-primary transition-colors">
                                        {guide.title}
                                    </h3>
                                    <p className="text-secondary mb-4">
                                        {guide.description}
                                    </p>
                                    <p className="text-sm text-tertiary mb-6">
                                        📄 {guide.pages} • Format PDF
                                    </p>

                                    {/* Topics */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {guide.topics.map(topic => (
                                            <span
                                                key={topic}
                                                className="px-3 py-1 bg-surface-secondary text-secondary text-xs font-medium rounded-full"
                                            >
                                                #{topic}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-2 mb-8">
                                        {guide.features.map((feature, idx) => (
                                            <li key={idx} className="text-sm text-secondary flex items-start gap-2">
                                                <span className="mt-0.5">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <a
                                        href={guide.downloadUrl}
                                        download
                                        className={`inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r ${guide.color} hover:opacity-90 text-white rounded-lg font-bold text-lg transition-all hover:shadow-xl`}
                                    >
                                        <Download className="w-5 h-5" />
                                        Télécharger le guide
                                    </a>
                                    <p className="text-xs text-tertiary text-center mt-3">
                                        ✅ Aucun email requis • Téléchargement direct
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Coming Soon (si applicable) */}
                {comingSoonGuides.length > 0 && (
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-8">Bientôt Disponibles</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {comingSoonGuides.map((guide) => {
                                const Icon = guide.icon
                                return (
                                    <div
                                        key={guide.id}
                                        className="surface rounded-2xl p-8 border-2 border-dashed border-border-default opacity-75"
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className={`p-4 rounded-xl bg-gradient-to-br ${guide.color} text-white opacity-50`}>
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                                {guide.badge}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">
                                            {guide.title}
                                        </h3>
                                        <p className="text-secondary mb-4">
                                            {guide.description}
                                        </p>
                                        <p className="text-sm text-tertiary mb-6">
                                            📄 {guide.pages} • Disponible début décembre 2025
                                        </p>
                                        <ul className="space-y-2">
                                            {guide.features.slice(0, 3).map((feature, idx) => (
                                                <li key={idx} className="text-sm text-secondary flex items-start gap-2">
                                                    <span className="mt-0.5">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* Autres Ressources */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8">Autres Ressources Gratuites</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            href="/calculateurs"
                            className="surface rounded-xl p-6 border-2 border-border-default hover:border-accent-primary transition-all group"
                        >
                            <div className="text-4xl mb-4">🧮</div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-accent-primary transition-colors">
                                9 Calculateurs Gratuits
                            </h3>
                            <p className="text-secondary text-sm mb-4">
                                DSO, BFR, ROI, CAC/LTV, Burn Rate, Valorisation...
                            </p>
                            <div className="inline-flex items-center gap-2 text-accent-primary font-semibold text-sm">
                                Calculer maintenant
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>

                        <Link
                            href="/ressources/templates"
                            className="surface rounded-xl p-6 border-2 border-border-default hover:border-accent-primary transition-all group"
                        >
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-accent-primary transition-colors">
                                Templates Excel Pro
                            </h3>
                            <p className="text-secondary text-sm mb-4">
                                Budget, DSO, Cash Flow avec formules automatiques
                            </p>
                            <div className="inline-flex items-center gap-2 text-accent-primary font-semibold text-sm">
                                Télécharger les templates
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>

                        <Link
                            href="/blog"
                            className="surface rounded-xl p-6 border-2 border-border-default hover:border-accent-primary transition-all group"
                        >
                            <div className="text-4xl mb-4">📝</div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-accent-primary transition-colors">
                                Blog Finance PME
                            </h3>
                            <p className="text-secondary text-sm mb-4">
                                Articles pratiques sur les KPIs et la gestion financière
                            </p>
                            <div className="inline-flex items-center gap-2 text-accent-primary font-semibold text-sm">
                                Lire les articles
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </div>
                </section>

                {/* CTA Dashboard */}
                <section className="surface rounded-2xl p-12 border-2 border-accent-primary bg-accent-primary-subtle text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Automatisez votre pilotage financier avec FinSight
                    </h2>
                    <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
                        Fini les heures passées sur Excel. Uploadez votre compta et obtenez<br />
                        50+ KPIs calculés automatiquement + AI Copilot pour vos questions
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-lg transition-all hover:shadow-lg"
                    >
                        Essayer gratuitement
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <p className="text-sm text-tertiary mt-4">
                        ✅ Sans engagement • ✅ 10 questions IA gratuites • ✅ Dashboard complet
                    </p>
                </section>
            </div>

            <Footer />
        </div>
    )
}
