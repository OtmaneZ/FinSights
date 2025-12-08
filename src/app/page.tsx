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
                        <span className="text-2xl">🤝</span>
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

            {/* Score FinSight™ Section - Corporate Premium */}
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
                            Score FinSight™
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Un indicateur composite qui évalue la santé financière de votre entreprise sur une échelle de{' '}
                            <span className="font-semibold text-blue-600">0 à 100</span>
                        </p>
                    </div>

                    {/* Score Pillars Grid - Corporate Clean */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        {[
                            { icon: DollarSign, label: 'Cash & Liquidité', value: 25, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
                            { icon: BarChart3, label: 'Marges & Rentabilité', value: 25, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
                            { icon: Shield, label: 'Résilience', value: 25, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
                            { icon: AlertTriangle, label: 'Gestion Risques', value: 25, iconBg: 'bg-orange-50', iconColor: 'text-orange-600' }
                        ].map((pillar, idx) => {
                            const Icon = pillar.icon
                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all"
                                >
                                    <div className={`w-12 h-12 ${pillar.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                                        <Icon className={`w-6 h-6 ${pillar.iconColor}`} />
                                    </div>
                                    <div className="text-4xl font-bold text-gray-900 mb-2">
                                        {pillar.value}
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium leading-snug">
                                        {pillar.label}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Example Score - Corporate Professional */}
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-8 px-12 py-8 bg-white border-2 border-blue-200 rounded-2xl shadow-lg">
                            <div className="text-7xl font-bold text-blue-600 leading-none">
                                67
                            </div>
                            <div className="text-left border-l-2 border-gray-200 pl-8">
                                <div className="text-sm text-gray-500 font-medium mb-2">
                                    EXEMPLE DE NOTATION
                                </div>
                                <div className="text-lg font-semibold text-gray-900 mb-1">
                                    Attention requise
                                </div>
                                <div className="inline-flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    Zone orange
                                </div>
                            </div>
                        </div>
                    </div>
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

            {/* Consulting Offers Section */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-600 text-sm font-semibold">Accompagnement sur-mesure</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
                            Allons plus loin ensemble
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Du diagnostic express au dashboard IA personnalisé, choisissez l'accompagnement adapté à vos besoins
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Offer 1 - Audit Express */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Audit Express</h3>
                                    <p className="text-xs text-gray-500">Diagnostic rapide</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-blue-600">2 500€</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Livrable en 3-5 jours</p>
                            </div>

                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                                    <span>Audit stack data (Excel, ERP, BI)</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                                    <span>Analyse KPIs critiques</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                                    <span>Recommandations priorisées</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                                    <span>Session stratégique 2h</span>
                                </li>
                            </ul>

                            <p className="text-xs text-gray-500 mb-4">
                                Idéal pour : PME, Scale-ups, Diagnostic pré-levée
                            </p>
                        </div>

                        {/* Offer 2 - Dashboard IA (Recommandé) */}
                        <div className="bg-white rounded-2xl p-8 border-2 border-blue-500 hover:shadow-xl transition-all relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 text-xs font-semibold rounded-full shadow-lg">
                                ⭐ Le plus demandé
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Dashboard IA</h3>
                                    <p className="text-xs text-gray-500">Sur-mesure</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-blue-600">6 500€</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Livrable en 2-3 semaines</p>
                            </div>

                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                                    <span className="font-semibold">Tout Audit Express +</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                                    <span>Dashboard financier IA personnalisé</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                                    <span>Connexion auto ERP/CSV</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                                    <span>AI Copilot GPT-4</span>
                                </li>
                            </ul>

                            <p className="text-xs text-gray-500 mb-4">
                                Idéal pour : Scale-ups 50-200 pers., Refonte stack data
                            </p>
                        </div>

                        {/* Offer 3 - Data Platform */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Data Platform</h3>
                                    <p className="text-xs text-gray-500">Enterprise-grade</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-blue-600">12k€</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">4-8 semaines (selon scope)</p>
                            </div>

                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                                    <span className="font-semibold">Tout Dashboard IA +</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                                    <span>Data warehouse moderne</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                                    <span>Pipelines ETL automatisés</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                                    <span>Dashboards multi-départements</span>
                                </li>
                            </ul>

                            <p className="text-xs text-gray-500 mb-4">
                                Idéal pour : ETI 200-500 pers., Transformation data
                            </p>
                        </div>
                    </div>

                    {/* CTA Principal */}
                    <div className="text-center">
                        <Link
                            href="/consulting"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
                        >
                            <Sparkles className="w-5 h-5" />
                            Découvrir toutes nos offres
                        </Link>
                        <p className="text-sm text-gray-500 mt-4">
                            💬 Premier échange gratuit de 30min pour cadrer votre besoin
                        </p>
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

