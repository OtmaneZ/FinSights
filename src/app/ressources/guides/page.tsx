import { Metadata } from 'next'
import Link from 'next/link'
import { Download, BookOpen, FileText, CheckSquare, TrendingUp, ArrowRight, Check, Calculator, FileSpreadsheet, BookMarked, MessageSquare, BarChart3, Users, Shield, Briefcase } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'Notes Méthodologiques Finance | Grilles d\'Analyse DAF | FinSight',
    description: 'Accédez aux notes méthodologiques FinSight : grilles d\'analyse financière, méthodologie 4 piliers, ratios, BFR, KPIs. Pour dirigeants de PME 1M€–20M€.',
    openGraph: {
        title: 'Notes Méthodologiques Finance | FinSight',
        description: 'Méthodologies et grilles d\'analyse pour structurer votre pilotage financier',
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
    level: 1 | 2 | 3
}

const levelLabels: Record<number, { label: string; description: string }> = {
    1: { label: 'Outils opérationnels', description: 'Grilles de contrôle et formules applicables immédiatement' },
    2: { label: 'Lecture stratégique', description: 'Interprétation des indicateurs et diagnostic structurel' },
    3: { label: 'Accompagnement DAF', description: 'Méthodologie complète de direction financière externalisée' }
}

const guides: Guide[] = [
    {
        id: 'checklist-closing',
        title: 'Checklist Closing Financier Mensuel',
        description: 'Grille de contrôle complète pour structurer votre clôture mensuelle',
        pages: '10 pages',
        icon: CheckSquare,
        features: [
            'Séquençage jour par jour (J-5 à J+3)',
            '23 points de contrôle essentiels',
            'Timing optimisé pour closing rapide',
            'Process bancaire & fournisseurs',
            'Contrôles pré-reporting',
            'Format PDF imprimable ou digital'
        ],
        downloadUrl: '/ressources/guides/checklist-closing-financier.pdf',
        color: 'border-l-4 border-green-600 bg-gray-50',
        badge: 'Opérationnel',
        topics: ['Closing', 'Process', 'Checklist', 'Comptabilité'],
        level: 1
    },
    {
        id: '15-ratios-financiers',
        title: '15 Ratios Financiers : Grille d\'Analyse',
        description: 'Grille d\'analyse exhaustive des ratios financiers avec seuils d\'alerte et interprétation sectorielle',
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
        badge: 'Référence',
        topics: ['Ratios', 'Analyse', 'Solvabilité', 'Performance'],
        level: 2
    },
    {
        id: 'guide-bfr-optimiser-tresorerie',
        title: 'Note BFR : Diagnostic et Leviers d\'Optimisation',
        description: 'Méthodologie d\'analyse du Besoin en Fonds de Roulement avec grille de lecture et leviers d\'action',
        pages: '9 pages',
        icon: TrendingUp,
        features: [
            'Décomposition structurelle du BFR',
            'Calcul et interprétation en pratique',
            '10 leviers de réduction documentés',
            'Optimisation DSO, DIO et DPO',
            'Cas pratiques avec calculs détaillés',
            'Grille d\'actions immédiates'
        ],
        downloadUrl: '/ressources/guides/guide-bfr-optimiser-tresorerie.pdf',
        color: 'border-l-4 border-teal-600 bg-gray-50',
        badge: 'Actionnable',
        topics: ['BFR', 'Trésorerie', 'Cash-flow', 'Optimisation'],
        level: 2
    },
    {
        id: 'tableau-de-bord-cfo-20-kpis',
        title: 'Tableau de Bord Dirigeant : 20 KPIs Structurés',
        description: 'Architecture de tableau de bord mensuel avec 20 indicateurs clés répartis en 4 piliers',
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
        badge: 'Structurant',
        topics: ['KPIs', 'Dashboard', 'Performance', 'Pilotage'],
        level: 2
    }
]

export default function GuidesPage() {
    const level1Guides = guides.filter(g => g.level === 1)
    const level2Guides = guides.filter(g => g.level === 2)

    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <div className="max-w-6xl mx-auto px-6 py-20">
                {/* Hero Section - Repositionné cabinet */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-primary tracking-tight font-serif">
                        Notes Méthodologiques
                    </h1>

                    <p className="text-xl text-secondary max-w-2xl mx-auto mb-6 leading-relaxed">
                        Grilles d&apos;analyse, méthodologies de diagnostic et référentiels
                        pour structurer votre pilotage financier
                    </p>

                    <div className="flex items-center justify-center gap-6 text-sm text-tertiary mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-accent-primary"></div>
                            <span>4 notes méthodologiques</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-accent-primary"></div>
                            <span>43 pages</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-accent-primary"></div>
                            <span>Accès direct</span>
                        </div>
                    </div>
                </div>

                {/* Section cible — Filtre d'audience */}
                <section className="mb-16">
                    <div className="surface rounded-xl p-8 border border-border-default">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-primary mb-2">À qui s&apos;adressent ces ressources</h3>
                                <p className="text-secondary leading-relaxed">
                                    Ces notes méthodologiques s&apos;adressent aux dirigeants de PME entre 1M&euro; et 20M&euro; de chiffre d&apos;affaires
                                    souhaitant structurer leur pilotage financier avec une logique de direction financière.
                                    Elles ne remplacent pas un accompagnement. Elles en posent les fondations.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hiérarchie stratégique visible — 3 niveaux */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-8 text-primary font-serif">Progression méthodologique</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((level) => {
                            const config = levelLabels[level]
                            const count = guides.filter(g => g.level === level).length
                            const isActive = level <= 2
                            return (
                                <div
                                    key={level}
                                    className={`rounded-xl p-6 border transition-all ${
                                        level === 3
                                            ? 'bg-slate-950 border-slate-800 text-white'
                                            : 'surface border-border-default'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`text-xs font-bold uppercase tracking-wider ${
                                            level === 3 ? 'text-slate-400' : 'text-tertiary'
                                        }`}>
                                            Niveau {level}
                                        </span>
                                        {level === 3 && (
                                            <span className="text-xs px-2 py-0.5 bg-white/10 text-slate-300 rounded-full border border-white/20">
                                                Sur mandat
                                            </span>
                                        )}
                                    </div>
                                    <h3 className={`text-lg font-bold mb-2 ${
                                        level === 3 ? 'text-white' : 'text-primary'
                                    }`}>
                                        {config.label}
                                    </h3>
                                    <p className={`text-sm leading-relaxed ${
                                        level === 3 ? 'text-slate-400' : 'text-secondary'
                                    }`}>
                                        {config.description}
                                    </p>
                                    {isActive && count > 0 && (
                                        <p className="text-xs text-tertiary mt-3">
                                            {count} {count > 1 ? 'notes disponibles' : 'note disponible'}
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Niveau 1 — Outils opérationnels */}
                {level1Guides.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-xs font-bold uppercase tracking-wider text-tertiary">Niveau 1</span>
                            <div className="h-px flex-1 bg-border-default"></div>
                            <span className="text-sm text-tertiary">Outils opérationnels</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {level1Guides.map((guide) => {
                                const Icon = guide.icon
                                return (
                                    <div
                                        key={guide.id}
                                        className="surface rounded-xl p-8 border border-border-default hover:border-accent-primary transition-all group"
                                    >
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
                                        <p className="text-secondary mb-6 leading-relaxed text-sm">
                                            {guide.description}
                                        </p>
                                        <ul className="space-y-2 mb-6">
                                            {guide.features.slice(0, 3).map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-secondary">
                                                    <div className="w-1 h-1 rounded-full bg-accent-primary flex-shrink-0 mt-2"></div>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <a
                                            href={guide.downloadUrl}
                                            download
                                            className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all hover:shadow-md"
                                        >
                                            <Download className="w-4 h-4" />
                                            Accéder à la grille de contrôle
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* Niveau 2 — Lecture stratégique */}
                {level2Guides.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-xs font-bold uppercase tracking-wider text-tertiary">Niveau 2</span>
                            <div className="h-px flex-1 bg-border-default"></div>
                            <span className="text-sm text-tertiary">Lecture stratégique</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {level2Guides.map((guide) => {
                                const Icon = guide.icon
                                return (
                                    <div
                                        key={guide.id}
                                        className="surface rounded-xl p-8 border border-border-default hover:border-accent-primary transition-all group"
                                    >
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
                                        <p className="text-secondary mb-6 leading-relaxed text-sm">
                                            {guide.description}
                                        </p>
                                        <ul className="space-y-2 mb-6">
                                            {guide.features.slice(0, 3).map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-secondary">
                                                    <div className="w-1 h-1 rounded-full bg-accent-primary flex-shrink-0 mt-2"></div>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <a
                                            href={guide.downloadUrl}
                                            download
                                            className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all hover:shadow-md"
                                        >
                                            <Download className="w-4 h-4" />
                                            Consulter la note méthodologique
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* Niveau 3 — Accompagnement DAF (Guide Signature) */}
                <section className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-xs font-bold uppercase tracking-wider text-tertiary">Niveau 3</span>
                        <div className="h-px flex-1 bg-border-default"></div>
                        <span className="text-sm text-tertiary">Accompagnement DAF</span>
                    </div>
                    <div className="bg-slate-950 rounded-xl p-8 md:p-12 border border-slate-800">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1 font-serif leading-tight">
                                    Méthodologie FinSight&trade;
                                </h3>
                                <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                                    Structurer une Direction Financière Externalisée
                                </span>
                            </div>
                        </div>
                        <p className="text-slate-400 mb-8 leading-relaxed max-w-2xl">
                            Architecture 4 piliers, logique de priorisation, lecture cash 90 jours,
                            arbitrage croissance vs liquidité. Ce document décrit comment pense un DAF,
                            pas comment fonctionne un outil.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {['Architecture 4 piliers', 'Priorisation cash', 'Cas PME structuré', 'Plan 6 mois'].map((item) => (
                                <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
                                    <div className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0"></div>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="https://calendly.com/zineinsight/15min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-all text-sm"
                            >
                                Recevoir la méthodologie complète
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <Link
                                href="/consulting"
                                className="inline-flex items-center gap-2 px-6 py-3 border border-slate-700 text-slate-300 rounded-lg font-semibold hover:border-slate-500 transition-all text-sm"
                            >
                                En savoir plus sur l&apos;accompagnement
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Mission DAF — Repositionné */}
                <section className="mb-20">
                    <div className="surface rounded-xl p-12 border border-border-default">
                        <div className="max-w-3xl mx-auto text-center">
                            <h3 className="text-2xl font-bold mb-4 text-primary font-serif">
                                De la méthodologie au plan d&apos;action
                            </h3>
                            <p className="text-lg text-secondary mb-8 leading-relaxed">
                                Ces notes posent les fondations. L&apos;accompagnement les transforme en décisions.
                                <span className="text-primary font-medium"> Pilotage cash, arbitrage marge, structuration reporting.</span>
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <a
                                    href="https://calendly.com/zineinsight/15min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all hover:shadow-lg"
                                >
                                    Réserver un échange stratégique
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

                {/* Autres Ressources */}
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
                                    Notes stratégiques
                                </h3>
                            </div>
                            <p className="text-secondary text-sm leading-relaxed">
                                Analyses structurelles et positionnement DAF
                            </p>
                        </Link>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    )
}
