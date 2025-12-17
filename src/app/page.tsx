'use client'

import Link from 'next/link'
import {
    Sparkles,
    Zap,
    DollarSign,
    BarChart3,
    AlertTriangle,
    Shield
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Testimonials from '@/components/Testimonials'
import DashboardPreview from '@/components/landing/DashboardPreview'
import ConsultingSection from '@/components/landing/ConsultingSection'
import AnimatedScoreDisplay from '@/components/landing/AnimatedScoreDisplay'

export default function Home() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            {/* Hero Section - Premium 2 Columns Layout */}
            <section className="relative bg-gradient-to-br from-blue-50 via-blue-50/50 to-white overflow-hidden">
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,120,212,0.05),transparent_50%)]"></div>

                <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-36 lg:pt-36 lg:pb-44">
                    <div className="grid lg:grid-cols-2 gap-20 lg:gap-24 items-center">                        {/* LEFT: Content */}
                        <div className="space-y-8">
                            {/* Trust Badge - Corporate */}
                            <div className="inline-flex items-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl shadow-md">
                                <Shield className="w-5 h-5 text-accent-primary" />
                                <span className="text-base font-bold text-gray-800">
                                    Réponse instantanée • RGPD France • Sans engagement
                                </span>
                            </div>

                            {/* H1 Corporate */}
                            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tighter text-gray-900">
                                Dashboards FP&A sur-mesure<br />
                                <span className="text-accent-primary">
                                    pour dirigeants de Scale-ups & PME
                                </span>
                            </h1>

                            {/* Value Proposition */}
                            <p className="text-lg text-gray-700 leading-relaxed max-w-xl font-medium">
                                Prévisions de trésorerie, budgets automatisés et métriques SaaS
                                <br />
                                <span className="text-gray-900">pour décider avant que le cash ne décide à votre place.</span>
                            </p>

                            {/* Positioning Statement */}
                            <div className="p-6 bg-gradient-to-r from-blue-50 to-white border-l-4 border-accent-primary rounded-lg max-w-xl">
                                <p className="text-base text-gray-800 leading-relaxed">
                                    <span className="font-bold text-gray-900">FinSight est la vitrine technique.</span>
                                    <br />
                                    L'expertise : 10 ans de finance & data au service des décisions.
                                </p>
                            </div>

                            {/* CTAs Consulting-First */}
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="/pour-qui"
                                        className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-accent-primary hover:bg-accent-primary-hover text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        <BarChart3 className="w-5 h-5" />
                                        Voir des réalisations
                                    </Link>

                                    <a
                                        href="https://calendly.com/zineinsight"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white border-3 border-gray-300 hover:border-accent-primary hover:text-accent-primary text-lg font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <Zap className="w-5 h-5" />
                                        Discutons 30 min
                                    </a>
                                </div>

                                {/* Secondary CTA - Demo tool */}
                                <div className="text-center sm:text-left">
                                    <Link
                                        href="/demo"
                                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-accent-primary transition-colors font-medium"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        💡 Vous pouvez tester la démo FinSight gratuitement avant d'échanger
                                    </Link>
                                </div>
                            </div>

                            {/* Social Proof - Clean */}
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    <span>Sans installation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    <span>RGPD conforme</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    <span>Sans engagement</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Dashboard Preview Animé */}
                        <div className="relative lg:block hidden">
                            <DashboardPreview />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Consulting Banner - Subtle */}
            <div className="max-w-6xl mx-auto px-6 -mt-8 mb-12 relative z-10">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-accent-primary rounded-xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent-primary-subtle flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-accent-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Besoin d'un accompagnement personnalisé ?
                            </p>
                            <p className="text-xs text-gray-600">
                                Audit express, dashboard IA sur-mesure ou refonte data complète
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/consulting"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent-primary text-white text-sm font-semibold rounded-lg hover:bg-accent-primary-hover transition-colors whitespace-nowrap"
                    >
                        Voir nos offres
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Score FinSight™ Section - Corporate Premium with Animation */}
            <section className="relative py-28 lg:py-36 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">

                    {/* Badge Corporate */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg shadow-sm">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Notre indicateur signature</span>
                        </div>
                    </div>

                    {/* Header Corporate */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-gray-900">
                            Le Score FinSight™
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Nous analysons <span className="font-semibold text-accent-primary">12+ KPIs financiers</span> et les condensons en un score unique de{' '}
                            <span className="font-semibold text-accent-primary">0 à 100</span>.
                            <br />
                            Simple à comprendre. Impossible à ignorer.
                        </p>
                    </div>

                    {/* Composant animé avec les 4 piliers + jauge */}
                    <AnimatedScoreDisplay />
                </div>
            </section>

            {/* Before/After Section - Pennylane Style */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-gray-900">
                            La différence FinSight
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Passez d'une gestion financière réactive à une stratégie anticipative basée sur l'intelligence de données
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                        {/* AVANT - Sans FinSight */}
                        <div className="relative bg-gray-50 rounded-2xl p-8 border border-gray-200">
                            {/* Badge sobre */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-600 rounded-md mb-6 text-xs font-semibold uppercase tracking-wider">
                                Sans FinSight
                            </div>

                            <h3 className="text-xl font-bold mb-6 text-gray-900">
                                Vision partielle et réactive
                            </h3>

                            <ul className="space-y-3.5">
                                {[
                                    { text: 'Analyse financière manuelle et chronophage', metric: '15h/mois' },
                                    { text: 'Risques invisibles jusqu\'à leur matérialisation', metric: null },
                                    { text: 'Prévisions approximatives via tableurs', metric: '±20%' },
                                    { text: 'Tensions de trésorerie découvertes trop tard', metric: null }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm">
                                        <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-2.5 h-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <span className="leading-relaxed">{item.text}</span>
                                            {item.metric && (
                                                <span className="ml-2 text-xs text-gray-400 font-mono">{item.metric}</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* APRÈS - Avec FinSight */}
                        <div className="relative bg-gradient-to-br from-blue-50/50 to-white rounded-2xl p-8 border border-blue-100/60 shadow-sm">
                            {/* Badge premium */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-primary text-white rounded-md mb-6 text-xs font-semibold uppercase tracking-wider shadow-sm">
                                Avec FinSight
                            </div>

                            <h3 className="text-xl font-bold mb-6 text-gray-900">
                                Intelligence financière complète
                            </h3>

                            <ul className="space-y-3.5">
                                {[
                                    { text: 'Score FinSight™ : santé financière en un coup d\'œil', metric: '0-100' },
                                    { text: 'Détection précoce des signaux faibles critiques', metric: 'ML' },
                                    { text: 'Prévisions fiables avec scénarios multiples', metric: '±5%' },
                                    { text: 'Anticipation des tensions de trésorerie', metric: '90j' }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-900 text-sm">
                                        <div className="w-4 h-4 rounded-full bg-accent-primary-subtle flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-2.5 h-2.5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <span className="leading-relaxed font-medium">{item.text}</span>
                                            {item.metric && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold bg-accent-primary-subtle text-accent-primary">
                                                    {item.metric}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Subtle indicator */}
                            <div className="mt-6 pt-6 border-t border-blue-100">
                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                    <svg className="w-3.5 h-3.5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Résultat en 10 secondes • 100% confidentiel
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid - 4 Piliers Premium Stripe Style */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-gray-900">
                            Notre approche en 4 piliers
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Une approche structurée qui transforme vos données financières en décisions stratégiques actionnables
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pilier 1 - Analyse Stratégique */}
                        <div className="group relative bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-10 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden">
                            {/* Gradient border animé au hover */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-400 via-purple-400 to-blue-400 bg-[length:200%_200%] animate-gradient p-[2px]">
                                <div className="w-full h-full bg-white rounded-2xl"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/50 transition-all">
                                        <BarChart3 className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <div className="inline-block px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-bold uppercase tracking-wider rounded mb-1">
                                            Pilier 1
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Analyse Stratégique</h3>
                                    </div>
                                </div>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Structure de marge et rentabilité</span>
                                        </div>
                                        <span className="text-xs font-semibold text-accent-primary bg-accent-primary-subtle px-2 py-1 rounded">28%</span>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Signaux faibles de trésorerie</span>
                                        </div>
                                        <span className="text-xs font-semibold text-accent-primary bg-accent-primary-subtle px-2 py-1 rounded">3 KPIs</span>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Dépendance clients (concentration)</span>
                                        </div>
                                        <span className="text-xs font-semibold text-accent-primary bg-accent-primary-subtle px-2 py-1 rounded">Top 5</span>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Analyse des cycles de paiement</span>
                                        </div>
                                        <span className="text-xs font-semibold text-accent-primary bg-accent-primary-subtle px-2 py-1 rounded">DSO</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Pilier 2 - Prévisions & Scénarios */}
                        <div className="group relative bg-gradient-to-br from-white to-green-50/30 rounded-2xl p-10 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-green-400 via-emerald-400 to-green-400 bg-[length:200%_200%] animate-gradient p-[2px]">
                                <div className="w-full h-full bg-white rounded-2xl"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:shadow-xl group-hover:shadow-green-500/50 transition-all">
                                        <Sparkles className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <div className="inline-block px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded mb-1">
                                            Pilier 2
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Prévisions & Scénarios</h3>
                                    </div>
                                </div>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Cash-flow prévisionnel</span>
                                        </div>
                                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">3-12 mois</span>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Stress tests automatiques</span>
                                        </div>
                                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">-10/-30%</span>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Simulations retards clients / charges</span>
                                        </div>
                                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">15-60j</span>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Scénarios what-if en temps réel</span>
                                        </div>
                                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">Instantané</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Pilier 3 - Moteur de Risque */}
                        <div className="group relative bg-gradient-to-br from-white to-orange-50/30 rounded-2xl p-10 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-400 via-red-400 to-orange-400 bg-[length:200%_200%] animate-gradient p-[2px]">
                                <div className="w-full h-full bg-white rounded-2xl"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-xl group-hover:shadow-orange-500/50 transition-all">
                                        <AlertTriangle className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <div className="inline-block px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded mb-1">
                                            Pilier 3
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Moteur de Risque</h3>
                                    </div>
                                </div>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Risque rupture de trésorerie</span>
                                        </div>
                                        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">Runway</span>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Dette cachée (créances &gt;60j)</span>
                                        </div>
                                        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">Aging</span>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Score FinSight™ (santé 0-100)</span>
                                        </div>
                                        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">72/100</span>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Détection anomalies ML</span>
                                        </div>
                                        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">Z-score</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Pilier 4 - CFO Virtuel */}
                        <div className="group relative bg-gradient-to-br from-white to-purple-50/30 rounded-2xl p-10 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-purple-400 via-pink-400 to-purple-400 bg-[length:200%_200%] animate-gradient p-[2px]">
                                <div className="w-full h-full bg-white rounded-2xl"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/50 transition-all">
                                        <Sparkles className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <div className="inline-block px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold uppercase tracking-wider rounded mb-1">
                                            Pilier 4
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">CFO Virtuel</h3>
                                    </div>
                                </div>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Analyse en langage naturel</span>
                                        </div>
                                        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">GPT-4</span>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Plans d'action priorisés</span>
                                        </div>
                                        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">Top 5</span>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Synthèse PDF "consultant" prête</span>
                                        </div>
                                        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">Export</span>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Recommandations contextualisées</span>
                                        </div>
                                        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">IA</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Free Resources Section - Corporate */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg mb-6">
                            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Ressources Gratuites</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-gray-900">
                            Outils gratuits pour DAF et Contrôleurs de Gestion
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Templates Excel, guides PDF et calculateurs pour piloter votre PME
                        </p>
                    </div>

                    {/* Resources Grid */}
                    <div className="grid md:grid-cols-3 gap-8">

                        {/* Templates Excel */}
                        <Link
                            href="/ressources/templates"
                            className="group relative bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 hover:border-accent-primary shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        >
                            <div className="flex flex-col h-full">
                                {/* Icon */}
                                <div className="mb-6">
                                    <div className="w-16 h-16 rounded-xl bg-accent-primary-subtle border-2 border-blue-100 flex items-center justify-center group-hover:bg-accent-primary-subtle group-hover:border-accent-primary transition-colors">
                                        <svg className="w-8 h-8 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-accent-primary transition-colors">
                                    Templates Excel
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed flex-grow font-medium">
                                    Budget prévisionnel 2025, Tracker DSO et Dashboard Cash Flow avec formules automatiques
                                </p>

                                {/* CTA */}
                                <div className="flex items-center gap-2 text-accent-primary font-bold group-hover:gap-3 transition-all">
                                    <span>Découvrir</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        {/* Guides PDF */}
                        <Link
                            href="/ressources/guides"
                            className="group relative bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 hover:border-green-500 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        >
                            <div className="flex flex-col h-full">
                                {/* Icon */}
                                <div className="mb-6">
                                    <div className="w-14 h-14 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                        <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                                    Guides PDF
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                                    Checklist closing mensuel, 15 ratios financiers, Guide BFR et 20 KPIs essentiels
                                </p>

                                {/* CTA */}
                                <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all">
                                    <span>Découvrir</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        {/* Calculateurs */}
                        <Link
                            href="/calculateurs"
                            className="group relative bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 hover:border-purple-500 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        >
                            <div className="flex flex-col h-full">
                                {/* Icon */}
                                <div className="mb-6">
                                    <div className="w-14 h-14 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                        <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                                    Calculateurs
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                                    Calculateurs DSO et BFR avec résultats instantanés et explications détaillées
                                </p>

                                {/* CTA */}
                                <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                                    <span>Découvrir</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Bottom Trust Bar */}
                    <div className="mt-12 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Sans inscription • Téléchargement immédiat • RGPD France</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Consulting Section (brief offers) */}
            <ConsultingSection />

            {/* Témoignages clients – preuve sociale FP&A */}
            <section className="max-w-5xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold mb-10 text-center text-primary">
                    Ils m'ont confié leur pilotage financier
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Témoignage 1 */}
                    <div className="surface rounded-xl p-8 border-2 border-border-default hover:border-accent-primary transition-all">
                        <p className="text-secondary mb-6 italic leading-relaxed">
                            "Nous avons enfin une lecture claire de notre situation financière et
                            des indicateurs réellement utiles pour décider.
                            Otmane a structuré un pilotage adapté à notre réalité métier."
                        </p>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-lg">DA</span>
                            </div>

                            <div>
                                <p className="font-semibold text-primary">
                                    Directrice Administrative
                                </p>
                                <p className="text-sm text-tertiary">
                                    Groupe de formation professionnelle
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Témoignage 2 */}
                    <div className="surface rounded-xl p-8 border-2 border-border-default hover:border-accent-primary transition-all">
                        <p className="text-secondary mb-6 italic leading-relaxed">
                            "Le suivi financier est devenu fiable et exploitable sans dépendre
                            de fichiers manuels.
                            Nous avons gagné en clarté et en sérénité dans nos décisions."
                        </p>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-purple-600 font-bold text-lg">LB</span>
                            </div>

                            <div>
                                <p className="font-semibold text-primary">Gérante</p>
                                <p className="text-sm text-tertiary">
                                    Agence de placement de guides
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cas d'usage techniques */}
            <Testimonials />

            <Footer />
        </div>
    )
}

