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
            id: 'cfo-scaleup',
            icon: TrendingUp,
            title: 'CFO de Scale-up SaaS',
            tagline: 'Hypercroissance & Levées de fonds',
            iconColor: 'text-purple-600',
            iconBg: 'bg-purple-100',
            borderColor: 'border-purple-200',
            problems: [
                'Burn rate élevé, investors demandent du forecast fiable',
                'Excel n\'est plus adapté pour piloter la croissance',
                'Besoin de dashboard MRR/ARR pour le board',
                'Préparation levée : pitch deck avec métriques solides'
            ],
            solutions: [
                'Dashboard MRR/ARR/Churn temps réel',
                'Runway monitoring avec alertes automatiques',
                'Forecasts 12-18 mois par scénarios',
                'Board report mensuel automatique (PDF)'
            ],
            metrics: [
                { label: 'MRR', value: 'Suivi temps réel' },
                { label: 'Burn Rate', value: 'Alertes -6 mois' },
                { label: 'LTV/CAC', value: 'Unit economics' }
            ],
            cta: {
                primary: 'Audit SaaS - 2 900€',
                secondary: 'Dashboard IA - 6 900€',
                link: '/consulting'
            },
            testimonial: {
                quote: 'Dashboard intégré dans notre pitch deck Série A. Levée de 2M€ réussie.',
                author: 'Scale-up EdTech, 1.2M€ ARR'
            }
        },
        {
            id: 'daf-pme',
            icon: Building2,
            title: 'DAF de PME (2-10M€ CA)',
            tagline: 'Pilotage & Contrôle budgétaire',
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100',
            borderColor: 'border-blue-200',
            problems: [
                'Excel bordélique, budget dépassé chaque mois',
                'Pas de visibilité trésorerie à J+90',
                'Reporting manuel chronophage (2-3 jours/mois)',
                'Direction demande du prévisionnel fiable'
            ],
            solutions: [
                'Dashboard Budget vs Réalisé automatique',
                'Alertes hebdo sur dépassements',
                'Prévisions trésorerie 3-6 mois',
                'Export PDF clean pour CODIR'
            ],
            metrics: [
                { label: 'Budget', value: 'vs Réalisé auto' },
                { label: 'Cash Flow', value: 'Forecast 90j' },
                { label: 'Alertes', value: 'Dépassements' }
            ],
            cta: {
                primary: 'Audit Express - 2 900€',
                secondary: 'Dashboard sur-mesure - 6 900€',
                link: '/consulting'
            },
            testimonial: {
                quote: '-18% charges en 4 mois. Visibilité totale sur la trésorerie.',
                author: 'PME Services, 800k€ CA'
            }
        },
        {
            id: 'cabinet-comptable',
            icon: Users,
            title: 'Cabinet d\'Expertise Comptable',
            tagline: 'Upgrade des livrables clients',
            iconColor: 'text-green-600',
            iconBg: 'bg-green-100',
            borderColor: 'border-green-200',
            problems: [
                'Clients veulent du conseil, pas que de la compta',
                'Livrables basiques = pas de différenciation',
                'Impossible de monter en gamme (prix)',
                'Perte de clients vers cabinets "digitaux"'
            ],
            solutions: [
                'Template dashboard FP&A white-label',
                'Livrables premium pour vos clients PME',
                'Formation équipe (1 jour)',
                'Maintenance et support inclus'
            ],
            metrics: [
                { label: 'Facturation', value: '+35%/client' },
                { label: 'Rétention', value: 'Churn -40%' },
                { label: 'Différenciation', value: 'Positionnement premium' }
            ],
            cta: {
                primary: 'Partenariat Cabinet',
                secondary: 'Démo personnalisée',
                link: '/consulting'
            },
            testimonial: {
                quote: '+35% facturation moyenne/client. Outil différenciant face à la concurrence.',
                author: 'Cabinet 35 clients PME'
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
                            Discutons 30 min gratuitement
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
