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
            <section className="relative bg-gradient-to-br from-blue-50/40 to-white">
                <div className="max-w-7xl mx-auto px-6 pt-24 pb-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* LEFT: Content */}
                        <div className="space-y-8">
                            {/* Trust Badge - Corporate */}
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-blue-200 rounded-xl shadow-sm">
                                <Shield className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-semibold text-gray-700">
                                    Réponse instantanée • RGPD France • Sans engagement
                                </span>
                            </div>

                            {/* H1 Corporate */}
                            <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-gray-900">
                                Comprenez votre{' '}
                                <span className="text-blue-600">
                                    santé financière
                                </span>
                                {' '}en 10 secondes
                            </h1>

                            {/* Description */}
                            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                                Le moteur d'intelligence financière qui détecte les signaux faibles,
                                simule vos scénarios et vous donne votre{' '}
                                <span className="font-bold text-gray-900">Score FinSight™</span> instantané.
                            </p>

                            {/* CTAs Corporate */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Obtenir mon Score FinSight™
                                </Link>

                                <Link
                                    href="/auth/signup"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-300 hover:border-blue-600 rounded-xl font-semibold text-gray-900 transition-colors"
                                >
                                    Voir la démo
                                </Link>
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
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-blue-600" />
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
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                        Voir nos offres
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Score FinSight™ Section - Corporate Premium with Animation */}
            <section className="relative py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">

                    {/* Badge Corporate */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Notre indicateur signature</span>
                        </div>
                    </div>

                    {/* Header Corporate */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
                            Le Score FinSight™
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Nous analysons <span className="font-semibold text-blue-600">12+ KPIs financiers</span> et les condensons en un score unique de{' '}
                            <span className="font-semibold text-blue-600">0 à 100</span>.
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
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
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
                        <div className="relative bg-gradient-to-br from-blue-50/50 to-white rounded-2xl p-8 border border-blue-200/60 shadow-sm">
                            {/* Badge premium */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md mb-6 text-xs font-semibold uppercase tracking-wider shadow-sm">
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
                                        <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-2.5 h-2.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <span className="leading-relaxed font-medium">{item.text}</span>
                                            {item.metric && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold bg-blue-100 text-blue-700">
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
                                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
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
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Structure de marge et rentabilité</span>
                                        </div>
                                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">28%</span>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Signaux faibles de trésorerie</span>
                                        </div>
                                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">3 KPIs</span>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Dépendance clients (concentration)</span>
                                        </div>
                                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Top 5</span>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                            <span className="group-hover/item:text-gray-900 transition-colors">Analyse des cycles de paiement</span>
                                        </div>
                                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">DSO</span>
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

            {/* Consulting Section (brief offers) */}
            <ConsultingSection />

            {/* Testimonials */}
            <Testimonials />

            <Footer />
        </div>
    )
}

