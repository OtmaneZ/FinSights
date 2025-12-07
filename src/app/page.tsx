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

export default function Home() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            {/* Hero Section - Premium 2 Columns Layout */}
            <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-32">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT: Content */}
                    <div className="space-y-8">
                        {/* Trust Badge */}
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-xl border border-blue-200/50 rounded-2xl shadow-lg">
                            <Zap className="w-4 h-4 text-blue-600 animate-pulse" />
                            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                ⚡ Réponse en 10s • 🔒 RGPD France
                            </span>
                        </div>

                        {/* H1 Ultra Premium */}
                        <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-primary">
                            Comprenez votre{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                                santé financière
                            </span>
                            {' '}en 10 secondes
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-secondary leading-relaxed max-w-xl">
                            Le moteur d'intelligence financière qui détecte les signaux faibles,
                            simule vos scénarios et vous donne votre{' '}
                            <span className="font-bold text-primary">Score FinSight™</span> instantané.
                        </p>

                        {/* CTAs Premium */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/dashboard"
                                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105"
                            >
                                <span className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    Obtenir mon Score FinSight™
                                </span>
                            </Link>

                            <Link
                                href="/auth/signup"
                                className="px-8 py-4 bg-white/80 backdrop-blur-xl border-2 border-gray-200 hover:border-blue-400 rounded-xl font-semibold transition-all hover:scale-105 text-primary"
                            >
                                Voir la démo
                            </Link>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-tertiary">
                                ⚡ Sans installation • 🔒 RGPD conforme • ✓ Sans engagement
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: Dashboard Preview Animé */}
                    <div className="relative lg:block hidden">
                        <DashboardPreview />
                    </div>
                </div>
            </section>

            {/* Score FinSight™ Section - Corporate Premium */}
            <section className="relative py-32 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">

                    {/* Badge Corporate */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-sm">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-semibold">Notre indicateur signature</span>
                        </div>
                    </div>

                    {/* Header Corporate */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-6 text-gray-900">
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
                            { icon: DollarSign, label: 'Cash & Liquidité', value: 25, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
                            { icon: BarChart3, label: 'Marges & Rentabilité', value: 25, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
                            { icon: Shield, label: 'Résilience', value: 25, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
                            { icon: AlertTriangle, label: 'Gestion Risques', value: 25, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' }
                        ].map((pillar, idx) => {
                            const Icon = pillar.icon
                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
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
                            <div className="text-8xl font-bold text-blue-600">
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
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-6 text-gray-900">
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

                            <ul className="space-y-4 mb-8">
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

                            <div className="p-5 bg-white border border-gray-200 rounded-lg">
                                <p className="text-sm text-gray-700 italic leading-relaxed mb-3">
                                    "Je découvre les problèmes trop tard, quand ils sont déjà critiques."
                                </p>
                                <div className="text-xs text-gray-500 font-medium">
                                    CFO, PME 80 personnes
                                </div>
                            </div>
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

                            <ul className="space-y-4 mb-8">
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

                            <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-lg">
                                <p className="text-sm text-gray-900 font-medium leading-relaxed mb-3">
                                    "FinSight m'a alerté d'un risque de rupture cash à 45 jours. J'ai pu agir à temps."
                                </p>
                                <div className="text-xs text-blue-600 font-semibold">
                                    DAF, Scale-up 150 personnes
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid - 4 Piliers Corporate */}
            <section className="py-32 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-6 text-gray-900">
                            Notre approche en 4 piliers
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Une méthodologie éprouvée qui transforme vos données financières en décisions stratégiques actionnables
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pilier 1 - Analyse Stratégique */}
                        <div className="bg-white rounded-2xl p-10 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                    <BarChart3 className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-blue-600 mb-1">PILIER 1</div>
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
                        <div className="bg-white rounded-2xl p-10 border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition-colors">
                                    <Sparkles className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-green-600 mb-1">PILIER 2</div>
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
                        <div className="bg-white rounded-2xl p-10 border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                                    <AlertTriangle className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-orange-600 mb-1">PILIER 3</div>
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
                        <div className="bg-white rounded-2xl p-10 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                                    <DollarSign className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-purple-600 mb-1">PILIER 4</div>
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

            {/* Testimonials */}
            <Testimonials />

            <Footer />
        </div>
    )
}

