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

            {/* Before/After Section - Corporate */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-6">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
                            La différence FinSight
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Passez d'une gestion financière réactive à une stratégie anticipative basée sur l'intelligence de données
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">

                        {/* AVANT - Sans FinSight */}
                        <div className="bg-gray-50 rounded-2xl p-10 border border-gray-200">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg mb-6 text-sm font-semibold">
                                SANS FINSIGHT
                            </div>

                            <h3 className="text-2xl font-bold mb-8 text-gray-900">
                                Vision partielle et réactive
                            </h3>

                            <ul className="space-y-4">
                                {[
                                    'Analyse financière manuelle et chronophage',
                                    'Risques invisibles jusqu\'à leur matérialisation',
                                    'Prévisions approximatives via tableurs',
                                    'Décisions stratégiques basées sur l\'intuition',
                                    'Tensions de trésorerie découvertes trop tard'
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-red-600 text-xs font-bold">×</span>
                                        </div>
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* APRÈS - Avec FinSight */}
                        <div className="bg-white rounded-2xl p-10 border-2 border-blue-200 shadow-lg relative">
                            {/* Subtle glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-2xl -z-10"></div>

                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg mb-6 text-sm font-semibold shadow-sm">
                                AVEC FINSIGHT
                            </div>

                            <h3 className="text-2xl font-bold mb-8 text-gray-900">
                                Intelligence financière complète
                            </h3>

                            <ul className="space-y-4">
                                {[
                                    'Score FinSight™ : santé financière en un coup d\'œil',
                                    'Détection précoce des signaux faibles critiques',
                                    'Prévisions fiables avec scénarios multiples',
                                    'Recommandations actionnables par l\'IA',
                                    'Anticipation des tensions de trésorerie à 90 jours'
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-900">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-blue-600 text-xs font-bold">✓</span>
                                        </div>
                                        <span className="leading-relaxed font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid - 4 Piliers Corporate */}
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
                        <div className="bg-white rounded-2xl p-10 border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                    <BarChart3 className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">PILIER 1</div>
                                    <h3 className="text-xl font-bold text-gray-900">Analyse Stratégique</h3>
                                </div>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                                    <span>Structure de marge et rentabilité</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                                    <span>Signaux faibles de trésorerie</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                                    <span>Dépendance clients (concentration)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                                    <span>Analyse des cycles de paiement</span>
                                </li>
                            </ul>
                        </div>

                        {/* Pilier 2 - Prévisions & Scénarios */}
                        <div className="bg-white rounded-2xl p-10 border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-600 transition-colors">
                                    <Sparkles className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">PILIER 2</div>
                                    <h3 className="text-xl font-bold text-gray-900">Prévisions & Scénarios</h3>
                                </div>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                                    <span>Cash-flow prévisionnel 3–12 mois</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                                    <span>Stress tests automatiques (-10/-20/-30%)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                                    <span>Simulations retards clients / prix / charges</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                                    <span>Scénarios what-if en temps réel</span>
                                </li>
                            </ul>
                        </div>

                        {/* Pilier 3 - Moteur de Risque */}
                        <div className="bg-white rounded-2xl p-10 border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                                    <AlertTriangle className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">PILIER 3</div>
                                    <h3 className="text-xl font-bold text-gray-900">Moteur de Risque</h3>
                                </div>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2 flex-shrink-0"></div>
                                    <span>Risque rupture de trésorerie</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2 flex-shrink-0"></div>
                                    <span>Risque dette cachée (créances vieillissantes)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2 flex-shrink-0"></div>
                                    <span>Score FinSight™ (santé financière 0-100)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2 flex-shrink-0"></div>
                                    <span>Détection anomalies ML (Z-score, patterns)</span>
                                </li>
                            </ul>
                        </div>

                        {/* Pilier 4 - CFO Virtuel */}
                        <div className="bg-white rounded-2xl p-10 border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                                    <DollarSign className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">PILIER 4</div>
                                    <h3 className="text-xl font-bold text-gray-900">CFO Virtuel</h3>
                                </div>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0"></div>
                                    <span>Analyse automatique en langage naturel</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0"></div>
                                    <span>Plans d'action priorisés et actionnables</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0"></div>
                                    <span>Synthèse PDF "consultant" prête</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0"></div>
                                    <span>Recommandations contextualisées</span>
                                </li>
                            </ul>
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

