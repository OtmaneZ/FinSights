import { Metadata } from 'next'
import Link from 'next/link'
import { Download, BookOpen, FileText, CheckSquare, TrendingUp, ArrowRight, Check, Calculator, FileSpreadsheet, BookMarked, MessageSquare, BarChart3, Users } from 'lucide-react'
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
            'Checklist jour par jour (J-5 à J+3)',
            '23 points de contrôle essentiels',
            'Timing optimisé pour closing rapide',
            'Process bancaire & fournisseurs',
            'Contrôles pré-reporting',
            'Format PDF imprimable ou digital'
        ],
        downloadUrl: '/ressources/guides/checklist-closing-financier.pdf',
        color: 'border-l-4 border-green-600 bg-gray-50',
        badge: 'Gain de temps',
        topics: ['Closing', 'Process', 'Checklist', 'Comptabilité']
    },
    {
        id: '15-ratios-financiers',
        title: '15 Ratios Financiers Expliqués',
        description: 'Le guide exhaustif des ratios financiers pour analyser la santé de votre entreprise',
        pages: '13 pages',
        icon: TrendingUp,
        features: [
            '5 Ratios de Liquidité (Current, Quick, Cash...)',
            '5 Ratios de Rentabilité (ROE, ROA, ROCE...)',
            '5 Ratios de Structure (Endettement, Autonomie...)',
            'Formules détaillées + exemples chiffrés',
            'Seuils d\'alerte & benchmarks France',
            'Interprétation par secteur d\'activité'
        ],
        downloadUrl: '/ressources/guides/15-ratios-financiers-expliques.pdf',
        color: 'border-l-4 border-blue-600 bg-gray-50',
        badge: 'Le plus complet',
        topics: ['Ratios', 'Analyse', 'Solvabilité', 'Performance']
    },
    {
        id: 'guide-bfr-optimiser-tresorerie',
        title: 'Guide BFR : Optimiser sa Trésorerie',
        description: 'Maîtrisez le Besoin en Fonds de Roulement pour améliorer votre cash-flow',
        pages: '9 pages',
        icon: TrendingUp,
        features: [
            'Comprendre le BFR : formule et composantes',
            'Calculer votre BFR en pratique',
            '10 leviers pour réduire votre BFR',
            'Optimiser DSO, DIO et DPO',
            'Cas pratiques avec calculs détaillés',
            'Checklist d\'actions immédiates'
        ],
        downloadUrl: '/ressources/guides/guide-bfr-optimiser-tresorerie.pdf',
        color: 'border-l-4 border-teal-600 bg-gray-50',
        badge: 'Actionnable',
        topics: ['BFR', 'Trésorerie', 'Cash-flow', 'Optimisation']
    },
    {
        id: 'tableau-de-bord-cfo-20-kpis',
        title: 'Tableau de Bord CFO : 20 KPIs Essentiels',
        description: 'Le dashboard complet pour piloter votre entreprise avec 20 indicateurs clés',
        pages: '11 pages',
        icon: TrendingUp,
        features: [
            '20 KPIs répartis en 4 catégories',
            '5 KPIs Croissance (ARR, MRR, CAC, LTV, Churn)',
            '5 KPIs Rentabilité (Marge, EBITDA, Burn, Break-even, ROI)',
            '5 KPIs Trésorerie (Runway, DSO, Quick ratio, BFR, FCF)',
            '5 KPIs Opérationnels (NPS, LTV/CAC, Payback, Productivité, Conversion)',
            'Formules + Benchmarks + Exemples chiffrés'
        ],
        downloadUrl: '/ressources/guides/tableau-de-bord-cfo-20-kpis.pdf',
        color: 'border-l-4 border-purple-600 bg-gray-50',
        badge: 'Complet',
        topics: ['KPIs', 'Dashboard', 'Performance', 'Pilotage']
    }
]

export default function GuidesPage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <div className="max-w-6xl mx-auto px-6 py-20">
                {/* Hero Section - Corporate Clean avec stats */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 leading-tight text-primary tracking-tight">
                        Ressources Finance & Pilotage
                    </h1>

                    <p className="text-xl text-secondary max-w-2xl mx-auto mb-6 leading-relaxed">
                        Guides méthodologiques gratuits pour structurer votre pilotage financier
                    </p>

                    <div className="flex items-center justify-center gap-6 text-sm text-tertiary mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-accent-primary"></div>
                            <span>4 guides</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-accent-primary"></div>
                            <span>43 pages</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-accent-primary"></div>
                            <span>Téléchargement direct</span>
                        </div>
                    </div>
                </div>

                {/* Guides disponibles - Grid 2x2 */}
                <section className="mb-20">
                    <div className="grid md:grid-cols-2 gap-8">
                        {guides.map((guide) => {
                            const Icon = guide.icon
                            return (
                                <div
                                    key={guide.id}
                                    className="surface rounded-xl p-8 border border-border-default hover:border-accent-primary transition-all group"
                                >
                                    {/* Header avec icon + title */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-lg border border-border-default flex items-center justify-center group-hover:border-accent-primary transition-all flex-shrink-0">
                                            <Icon className="w-6 h-6 text-accent-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-primary mb-1 leading-tight">
                                                {guide.title}
                                            </h3>
                                            <span className="text-xs text-tertiary uppercase tracking-wider font-medium">
                                                {guide.pages}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-secondary mb-6 leading-relaxed text-sm">
                                        {guide.description}
                                    </p>

                                    {/* Features - Top 3 seulement */}
                                    <ul className="space-y-2 mb-6">
                                        {guide.features.slice(0, 3).map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-secondary">
                                                <div className="w-1 h-1 rounded-full bg-accent-primary flex-shrink-0 mt-2"></div>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <a
                                        href={guide.downloadUrl}
                                        download
                                        className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all hover:shadow-md"
                                    >
                                        <Download className="w-4 h-4" />
                                        Télécharger le guide
                                    </a>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* CTA Consulting - Corporate sobre */}
                <section className="mb-20">
                    <div className="surface rounded-xl p-12 border border-accent-primary-border">
                        <div className="max-w-3xl mx-auto text-center">
                            <h3 className="text-3xl font-bold mb-4 text-primary">
                                Besoin d'un accompagnement sur-mesure ?
                            </h3>
                            <p className="text-lg text-secondary mb-8 leading-relaxed">
                                Construction de dashboards FP&A, automatisation reporting, modélisation financière.
                                <span className="text-primary font-medium"> 10 ans d'expérience finance & data analytics.</span>
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <a
                                    href="https://calendly.com/zineinsight"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all hover:shadow-lg"
                                >
                                    Réserver un échange
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                                <Link
                                    href="/consulting"
                                    className="inline-flex items-center gap-2 px-8 py-4 border border-border-default hover:border-accent-primary text-primary rounded-lg font-semibold transition-all"
                                >
                                    Voir les réalisations
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Autres Ressources - Plus sobre */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-8 text-primary">Autres ressources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            href="/calculateurs"
                            className="surface rounded-lg p-6 border border-border-default hover:border-accent-primary transition-all group"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg border border-border-default flex items-center justify-center group-hover:border-accent-primary transition-all">
                                    <Calculator className="w-5 h-5 text-accent-primary" />
                                </div>
                                <h3 className="text-lg font-semibold group-hover:text-accent-primary transition-colors">
                                    Calculateurs
                                </h3>
                            </div>
                            <p className="text-secondary text-sm leading-relaxed">
                                DSO, BFR, ROI, CAC/LTV, Burn Rate, Valorisation
                            </p>
                        </Link>

                        <Link
                            href="/ressources/templates"
                            className="surface rounded-lg p-6 border border-border-default hover:border-accent-primary transition-all group"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg border border-border-default flex items-center justify-center group-hover:border-accent-primary transition-all">
                                    <FileSpreadsheet className="w-5 h-5 text-accent-primary" />
                                </div>
                                <h3 className="text-lg font-semibold group-hover:text-accent-primary transition-colors">
                                    Templates Excel
                                </h3>
                            </div>
                            <p className="text-secondary text-sm leading-relaxed">
                                Budget, DSO, Cash Flow avec formules automatiques
                            </p>
                        </Link>

                        <Link
                            href="/blog"
                            className="surface rounded-lg p-6 border border-border-default hover:border-accent-primary transition-all group"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg border border-border-default flex items-center justify-center group-hover:border-accent-primary transition-all">
                                    <BookMarked className="w-5 h-5 text-accent-primary" />
                                </div>
                                <h3 className="text-lg font-semibold group-hover:text-accent-primary transition-colors">
                                    Articles
                                </h3>
                            </div>
                            <p className="text-secondary text-sm leading-relaxed">
                                Guides pratiques KPIs et pilotage financier
                            </p>
                        </Link>
                    </div>
                </section>


            </div>

            <Footer />
        </div>
    )
}
