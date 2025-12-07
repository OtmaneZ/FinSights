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

            {/* Score FinSight™ Section - NEW V3 */}
            <section className="max-w-4xl mx-auto px-6 pb-24">
                <div className="surface rounded-3xl p-12 border-2 border-accent-primary relative overflow-hidden shadow-2xl">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-transparent"></div>

                    <div className="relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-full mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-bold">Concept Signature FinSight</span>
                        </div>

                        <h2 className="text-4xl font-bold mb-4 text-primary">
                            Score FinSight™
                        </h2>
                        <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
                            Votre santé financière, notée de <span className="font-bold text-accent-primary">0 à 100</span>
                        </p>

                        {/* Score Breakdown */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-surface-elevated rounded-xl p-6 border border-border-default">
                                <div className="text-3xl font-bold text-accent-primary mb-2">25</div>
                                <div className="text-sm text-secondary font-medium">Cash & Liquidité</div>
                            </div>
                            <div className="bg-surface-elevated rounded-xl p-6 border border-border-default">
                                <div className="text-3xl font-bold text-accent-primary mb-2">25</div>
                                <div className="text-sm text-secondary font-medium">Marges & Rentabilité</div>
                            </div>
                            <div className="bg-surface-elevated rounded-xl p-6 border border-border-default">
                                <div className="text-3xl font-bold text-accent-primary mb-2">25</div>
                                <div className="text-sm text-secondary font-medium">Résilience</div>
                            </div>
                            <div className="bg-surface-elevated rounded-xl p-6 border border-border-default">
                                <div className="text-3xl font-bold text-accent-primary mb-2">25</div>
                                <div className="text-sm text-secondary font-medium">Gestion Risques</div>
                            </div>
                        </div>

                        {/* Example Score */}
                        <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl">
                            <div className="text-6xl font-bold text-yellow-600">67</div>
                            <div className="text-left">
                                <div className="text-sm text-yellow-800 font-semibold">Exemple : Note instantanée</div>
                                <div className="text-xs text-yellow-700">Zone Orange — Attention requise</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Before/After Section */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
                        Sans FinSight <span className="text-red-500">vs</span> Avec FinSight
                    </h2>
                    <p className="text-lg text-secondary max-w-2xl mx-auto">
                        Passez de l'incertitude financière à la maîtrise stratégique.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* AVANT - Sans FinSight */}
                    <div className="surface rounded-2xl p-8 border-2 border-border-default relative">
                        <div className="absolute -top-4 left-6 px-4 py-1 bg-red-50 border border-red-200 rounded-full">
                            <span className="text-red-700 text-sm font-semibold">❌ Sans FinSight</span>
                        </div>

                        <h3 className="text-2xl font-bold mt-4 mb-6 text-primary">Vision partielle et réactive</h3>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-secondary">
                                <span className="text-red-500 font-bold text-xl flex-shrink-0">×</span>
                                <span className="leading-relaxed">Vision partielle de votre santé financière globale</span>
                            </li>
                            <li className="flex items-start gap-3 text-secondary">
                                <span className="text-red-500 font-bold text-xl flex-shrink-0">×</span>
                                <span className="leading-relaxed">Risques invisibles (cash, marges, dépendance clients)</span>
                            </li>
                            <li className="flex items-start gap-3 text-secondary">
                                <span className="text-red-500 font-bold text-xl flex-shrink-0">×</span>
                                <span className="leading-relaxed">Prévisions approximatives basées sur tableurs manuels</span>
                            </li>
                            <li className="flex items-start gap-3 text-secondary">
                                <span className="text-red-500 font-bold text-xl flex-shrink-0">×</span>
                                <span className="leading-relaxed">Décisions stratégiques basées sur l'intuition</span>
                            </li>
                            <li className="flex items-start gap-3 text-secondary">
                                <span className="text-red-500 font-bold text-xl flex-shrink-0">×</span>
                                <span className="leading-relaxed">Difficulté à anticiper les tensions de trésorerie</span>
                            </li>
                        </ul>

                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800 italic leading-relaxed">
                                "Je découvre les problèmes trop tard, quand ils sont déjà critiques."
                            </p>
                            <p className="text-xs text-red-600 mt-2 font-semibold">
                                — CFO, PME 80 personnes
                            </p>
                        </div>
                    </div>

                    {/* APRÈS - Avec FinSight */}
                    <div className="surface rounded-2xl p-8 border-2 border-accent-primary relative bg-gradient-to-br from-accent-primary-subtle to-primary">
                        <div className="absolute -top-4 left-6 px-4 py-1 bg-accent-primary text-white rounded-full shadow-lg">
                            <span className="text-sm font-semibold">✨ Avec FinSight</span>
                        </div>

                        <h3 className="text-2xl font-bold mt-4 mb-6 text-primary">Intelligence financière complète</h3>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-primary">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span className="leading-relaxed font-medium">Lecture complète de votre santé économique (Score FinSight™)</span>
                            </li>
                            <li className="flex items-start gap-3 text-primary">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span className="leading-relaxed font-medium">Prévisions fiables et stress tests (-10%, -20%, -30%)</span>
                            </li>
                            <li className="flex items-start gap-3 text-primary">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span className="leading-relaxed font-medium">Moteur de risques intelligent (rupture cash, dette cachée)</span>
                            </li>
                            <li className="flex items-start gap-3 text-primary">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span className="leading-relaxed font-medium">CFO virtuel avec recommandations actionnables</span>
                            </li>
                            <li className="flex items-start gap-3 text-primary">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span className="leading-relaxed font-medium">Détection signaux faibles avant qu'ils deviennent critiques</span>
                            </li>
                        </ul>

                        <div className="p-4 bg-white border-2 border-accent-primary rounded-lg shadow-sm">
                            <p className="text-sm text-primary font-medium leading-relaxed">
                                "FinSight m'a alerté d'un risque de rupture cash à 45 jours. J'ai pu agir à temps."
                            </p>
                            <p className="text-xs text-accent-primary mt-2 font-bold">
                                — DAF, Scale-up 150 personnes
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid - 4 Piliers V3 */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <h2 className="text-3xl font-bold text-center mb-4 text-primary">Les 4 piliers FinSight</h2>
                <p className="text-lg text-secondary text-center mb-12 max-w-2xl mx-auto">
                    Le moteur d'intelligence financière qui transforme vos données en décisions stratégiques
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pilier 1 - Analyse Stratégique */}
                    <div className="surface rounded-xl p-8 surface-hover group border-2 border-border-default hover:border-accent-primary transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-accent-primary-subtle flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-accent-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-primary">1. Analyse Stratégique</h3>
                        </div>
                        <ul className="space-y-3 text-secondary">
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Structure de marge et rentabilité</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Signaux faibles de trésorerie</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Dépendance clients (concentration)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Résilience des charges fixes</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Analyse des cycles de paiement</span>
                            </li>
                        </ul>
                    </div>

                    {/* Pilier 2 - Prévisions & Scénarios */}
                    <div className="surface rounded-xl p-8 surface-hover group border-2 border-border-default hover:border-accent-primary transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-accent-primary-subtle flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-accent-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-primary">2. Prévisions & Scénarios</h3>
                        </div>
                        <ul className="space-y-3 text-secondary">
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Cash-flow prévisionnel 3–12 mois</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Stress tests automatiques (-10/-20/-30%)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Simulations retards clients / prix / charges</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Seuil critique et runway fiable</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Scénarios what-if en temps réel</span>
                            </li>
                        </ul>
                    </div>

                    {/* Pilier 3 - Moteur de Risque */}
                    <div className="surface rounded-xl p-8 surface-hover group border-2 border-border-default hover:border-accent-primary transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-accent-primary-subtle flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-accent-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-primary">3. Moteur de Risque</h3>
                        </div>
                        <ul className="space-y-3 text-secondary">
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Risque rupture de trésorerie</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Risque dette cachée (créances vieillissantes)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Score FinSight™ (santé financière 0-100)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Volatilité charges et revenus</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Détection anomalies ML (Z-score, patterns)</span>
                            </li>
                        </ul>
                    </div>

                    {/* Pilier 4 - CFO Virtuel */}
                    <div className="surface rounded-xl p-8 surface-hover group border-2 border-border-default hover:border-accent-primary transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-accent-primary-subtle flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-accent-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-primary">4. CFO Virtuel</h3>
                        </div>
                        <ul className="space-y-3 text-secondary">
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Analyse automatique en langage naturel</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Plans d'action priorisés et actionnables</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Synthèse PDF "consultant" prête</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Recommandations contextualisées</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-primary mt-1">→</span>
                                <span>Explications pédagogiques des KPIs</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* By the Numbers Section */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-primary">Résultats concrets</h2>
                    <p className="text-lg text-secondary max-w-2xl mx-auto">
                        Des métriques claires qui mesurent l'impact de FinSight sur votre pilotage financier
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Stat 1 */}
                    <div className="surface rounded-2xl p-8 text-center border-2 border-accent-primary-border hover:border-accent-primary transition-all group">
                        <div className="text-5xl font-bold text-accent-primary mb-3 group-hover:scale-110 transition-transform">
                            10s
                        </div>
                        <p className="text-sm text-secondary font-medium">
                            Score FinSight™ instantané
                        </p>
                    </div>

                    {/* Stat 2 */}
                    <div className="surface rounded-2xl p-8 text-center border-2 border-accent-primary-border hover:border-accent-primary transition-all group">
                        <div className="text-5xl font-bold text-accent-primary mb-3 group-hover:scale-110 transition-transform">
                            4
                        </div>
                        <p className="text-sm text-secondary font-medium">
                            Analyses stratégiques majeures
                        </p>
                    </div>

                    {/* Stat 3 */}
                    <div className="surface rounded-2xl p-8 text-center border-2 border-accent-primary-border hover:border-accent-primary transition-all group">
                        <div className="text-5xl font-bold text-accent-primary mb-3 group-hover:scale-110 transition-transform">
                            12
                        </div>
                        <p className="text-sm text-secondary font-medium">
                            Mois de prévisions cash-flow
                        </p>
                    </div>

                    {/* Stat 4 */}
                    <div className="surface rounded-2xl p-8 text-center border-2 border-accent-primary-border hover:border-accent-primary transition-all group">
                        <div className="text-5xl font-bold text-accent-primary mb-3 group-hover:scale-110 transition-transform">
                            0€
                        </div>
                        <p className="text-sm text-secondary font-medium">
                            Pour tester (sans CB)
                        </p>
                    </div>
                </div>
            </section>

            {/* Security & Compliance Section */}
            <section className="max-w-6xl mx-auto px-6 py-24 border-t border-border-default">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-primary">Sécurité & Conformité</h2>
                    <p className="text-lg text-secondary max-w-2xl mx-auto">
                        Vos données restent en France. Aucune transmission externe. Chiffrement de bout en bout.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="surface rounded-2xl p-10 text-center border-2 border-accent-primary-border">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary-subtle rounded-2xl mb-6">
                            <Shield className="w-10 h-10 text-accent-primary" />
                        </div>

                        <ul className="text-base text-secondary space-y-4 text-left max-w-xl mx-auto">
                            <li className="flex items-start gap-3">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span><strong className="text-primary">Données en France</strong> — hébergement serveurs OVH Paris</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span><strong className="text-primary">Chiffrement de bout en bout</strong> — vos données sont protégées</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span><strong className="text-primary">RGPD conforme</strong> — droit d'accès, rectification, suppression</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span><strong className="text-primary">Aucun transfert tiers</strong> — vos données ne sont jamais revendues</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-accent-primary font-bold text-xl flex-shrink-0">✓</span>
                                <span><strong className="text-primary">Suppression sur demande</strong> — contrôle total de vos données</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Consulting CTA Section */}
            <section className="max-w-5xl mx-auto px-6 py-24">
                <div className="surface rounded-3xl p-12 border-2 border-accent-primary relative overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-radial from-accent-primary/10 via-transparent to-transparent opacity-50"></div>

                    <div className="relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-accent-primary" />
                            <span className="text-accent-primary text-sm font-medium">Services Consulting</span>
                        </div>

                        <h2 className="text-4xl font-bold mb-4 text-primary">
                            Besoin d'un dashboard 100% sur-mesure ?
                        </h2>
                        <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
                            Je conçois des dashboards IA personnalisés, connectés à votre ERP (Sage, Cegid, QuickBooks).<br />
                            <span className="font-semibold text-primary">Audit, développement, formation</span> — de 2 500€ à 12k€.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/consulting"
                                className="inline-flex items-center gap-2 px-10 py-5 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:-translate-y-1"
                            >
                                <Zap className="w-5 h-5" />
                                Voir les services consulting
                            </Link>
                        </div>

                        <p className="text-sm text-tertiary mt-6">
                            TJM 500€ • Consultant Data Finance • 10+ ans d'expérience
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

