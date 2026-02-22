'use client'

import Link from 'next/link'
import {
    TrendingUp,
    Users,
    Building2,
    Target,
    Zap,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    BarChart3,
    DollarSign,
    Clock,
    Shield,
    AlertTriangle
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PourQuiPage() {
    const personas = [
        {
            id: 'dirigeant-pme-tension',
            icon: AlertTriangle,
            title: 'Dirigeant PME sous tension',
            tagline: 'Trésorerie imprévisible · Marges floues · Décisions à l\'aveugle',
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100',
            borderColor: 'border-red-200',
            problems: [
                'Pas de visibilité trésorerie au-delà de 30 jours',
                'Marges réelles par activité inconnues',
                'Décisions prises sur des données en retard',
                'Reporting manuel, chronophage, peu fiable'
            ],
            solutions: [
                'Diagnostic FinSight™ : Score 0-100 + 3 leviers chiffrés',
                'Visibilité cash fiabilisée à 90 jours',
                'Identification des fuites de marge cachées',
                'Plan d\'action immédiat en 5 jours ouvrés'
            ],
            metrics: [
                { label: 'Résultat', value: '5 jours' },
                { label: 'Leviers', value: '3 chiffrés' },
                { label: 'Score', value: '0–100' }
            ],
            cta: {
                primary: 'Diagnostic FinSight™ — 2 490€',
                secondary: 'Réserver un échange stratégique',
                link: '/consulting'
            },
            testimonial: {
                quote: 'Nous avons enfin une vision exploitable de nos chantiers, du cash et des marges.',
                author: 'Dirigeant PME BTP / Services, 7M€'
            }
        },
        {
            id: 'dirigeant-pme-croissance',
            icon: TrendingUp,
            title: 'Dirigeant PME en croissance',
            tagline: 'Activité qui fonctionne · Pilotage à structurer · Décisions à accélérer',
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100',
            borderColor: 'border-blue-200',
            problems: [
                'Croissance rapide, mais rentabilité réelle opaque',
                'Pas de modèle fiable pour arbitrer les investissements',
                'Tableau de bord inexistant ou sous-utilisé',
                'Besoin de structurer avant la prochaine étape'
            ],
            solutions: [
                'Audit Complet : rentabilité analytique par activité',
                'Tableau de bord dirigeant clé en main',
                'Scénarios de croissance simulés avant décision',
                'Plan d\'action chiffré sur 6 mois'
            ],
            metrics: [
                { label: 'Durée', value: '3–6 sem.' },
                { label: 'Horizon', value: '6 mois' },
                { label: 'Dashboard', value: 'Clé en main' }
            ],
            cta: {
                primary: 'Audit Complet — 6 990€',
                secondary: 'Réserver un échange stratégique',
                link: '/consulting'
            },
            testimonial: {
                quote: 'Nous disposons désormais d\'un cadre de pilotage fiable et homogène, utilisable au quotidien.',
                author: 'Directrice Administrative, Groupe Formation 500M€'
            }
        },
        {
            id: 'dirigeant-systeme',
            icon: BarChart3,
            title: 'Dirigeant qui veut un système',
            tagline: 'Pilotage automatisé · Décisions en continu · Vision long terme',
            iconColor: 'text-slate-700',
            iconBg: 'bg-slate-100',
            borderColor: 'border-slate-200',
            problems: [
                'Dirigeant qui revient chaque mois aux mêmes questions',
                'Équipe qui passe du temps à reconstituer des chiffres',
                'Pas d\'alertes fiables sur les signaux faibles',
                'Aucune simulation avant décision stratégique'
            ],
            solutions: [
                'Decision System : cockpit décisionnel temps réel',
                'Alertes automatiques sur anomalies cash et marges',
                'Scénarios simulés en continu (what-if)',
                'Formation équipe + 3 mois d\'accompagnement'
            ],
            metrics: [
                { label: 'Autonomie', value: 'Totale' },
                { label: 'Alertes', value: 'Automatiques' },
                { label: 'Support', value: '3 mois' }
            ],
            cta: {
                primary: 'Decision System — 12 500€',
                secondary: 'Réserver un échange stratégique',
                link: '/consulting'
            },
            testimonial: {
                quote: 'Le travail réalisé a permis de structurer un cadre de pilotage robuste, utilisable en comité de direction.',
                author: 'CFO, PME Services / Conseil'
            }
        }
    ]

    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            {/* Hero Section */}
            <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
                <div className="absolute inset-x-0 top-0 h-[400px] pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-radial from-accent-primary/20 via-accent-primary/5 to-transparent blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-8">
                        <Target className="w-4 h-4 text-accent-primary" />
                        <span className="text-accent-primary text-sm font-medium">Solutions FP&A sur-mesure</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                        Quelle solution FP&A<br />
                        <span className="text-accent-primary">correspond à votre profil</span> ?
                    </h1>

                    <p className="text-xl text-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
                        Dashboards sur-mesure, automatisation budgétaire et prévisions trésorerie
                        <br />
                        <span className="font-semibold text-primary">adaptés aux enjeux spécifiques de votre métier.</span>
                    </p>
                </div>
            </section>

            {/* Personas Grid */}
            <section className="max-w-7xl mx-auto px-6 pb-32">
                <div className="space-y-24">
                    {personas.map((persona, index) => (
                        <div
                            key={persona.id}
                            className={`surface rounded-2xl p-10 border-2 ${persona.borderColor} hover:shadow-2xl transition-all duration-300`}
                        >
                            {/* Header */}
                            <div className="flex items-start gap-6 mb-8">
                                <div className={`w-16 h-16 rounded-xl ${persona.iconBg} flex items-center justify-center flex-shrink-0`}>
                                    <persona.icon className={`w-8 h-8 ${persona.iconColor}`} />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-2 text-primary">{persona.title}</h2>
                                    <p className="text-lg text-accent-primary font-semibold">{persona.tagline}</p>
                                </div>
                                <div className="hidden lg:block">
                                    <span className="inline-block px-4 py-2 bg-accent-primary-subtle text-accent-primary rounded-lg text-sm font-semibold">
                                        Solution {index + 1}/3
                                    </span>
                                </div>
                            </div>

                            {/* Two columns: Problems + Solutions */}
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                {/* Problems */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4 text-red-600 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        Vos défis actuels
                                    </h3>
                                    <ul className="space-y-3">
                                        {persona.problems.map((problem, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-red-600 text-xs font-bold">✗</span>
                                                </div>
                                                <span className="text-sm text-secondary">{problem}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Solutions */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4 text-green-600 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Ma solution pour vous
                                    </h3>
                                    <ul className="space-y-3">
                                        {persona.solutions.map((solution, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-primary font-medium">{solution}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-surface-elevated rounded-xl">
                                {persona.metrics.map((metric, idx) => (
                                    <div key={idx} className="text-center">
                                        <div className="text-2xl font-bold text-accent-primary mb-1">{metric.value}</div>
                                        <div className="text-xs text-tertiary font-medium">{metric.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Testimonial */}
                            <div className="mb-8 p-6 bg-accent-primary-subtle border-l-4 border-accent-primary rounded-lg">
                                <p className="text-sm italic text-secondary mb-2">"{persona.testimonial.quote}"</p>
                                <p className="text-xs text-tertiary font-semibold">— {persona.testimonial.author}</p>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={persona.cta.link}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-base transition-all hover:shadow-lg"
                                >
                                    <Zap className="w-5 h-5" />
                                    {persona.cta.primary}
                                </Link>
                                <Link
                                    href={persona.cta.link}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 border-2 border-border-default hover:border-accent-primary text-primary rounded-lg font-semibold text-base transition-all hover:bg-surface-elevated"
                                >
                                    {persona.cta.secondary}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Final Section */}
            <section className="bg-gradient-to-br from-accent-primary-subtle to-white py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6 text-primary">
                        Votre profil n'apparaît pas ?
                    </h2>
                    <p className="text-xl text-secondary mb-8 leading-relaxed">
                        Chaque entreprise a des besoins uniques.
                        <br />
                        Échangeons sur vos enjeux spécifiques pour construire la solution adaptée.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-base transition-all hover:shadow-lg"
                        >
                            <Zap className="w-5 h-5" />
                            Réserver un échange stratégique
                        </a>
                        <Link
                            href="/consulting"
                            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white rounded-lg font-semibold text-base transition-all"
                        >
                            Voir toutes les offres
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
