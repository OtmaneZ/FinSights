'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
    Check,
    Sparkles,
    Zap,
    Users,
    Building2,
    Rocket,
    Clock,
    Shield,
    Code,
    FileCheck,
    Linkedin,
    Mail,
    ArrowRight,
    CheckCircle2,
    TrendingUp,
    Database,
    BarChart3
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ConsultingPage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            {/* Hero Section */}
            <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
                {/* Radial gradient glow effect */}
                <div className="absolute inset-x-0 top-0 h-[400px] pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-radial from-accent-primary/20 via-accent-primary/5 to-transparent blur-3xl"
                        style={{
                            background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 40%, transparent 70%)'
                        }}>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-8">
                        <Sparkles className="w-4 h-4 text-accent-primary" />
                        <span className="text-accent-primary text-sm font-medium">Consultant Data Finance • Dashboards IA & Automatisation ERP</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                        Transformez vos données financières<br />
                        <span className="text-accent-primary">en décisions rapides et fiables</span>
                    </h1>

                    <p className="text-xl text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
                        KPIs sur-mesure, trésorerie prédictive, automatisation ERP et dashboards IA.<br />
                        <span className="font-semibold text-primary">Livrables en 1-4 semaines</span>, accompagnement main dans la main.
                    </p>

                    <div className="flex items-center justify-center gap-6 text-sm text-tertiary mb-8">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent-primary" />
                            <span>10+ ans finance & data</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent-primary" />
                            <span>Python, SQL, BI, ERP</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent-primary" />
                            <span>TJM 500€</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-base transition-all hover:shadow-lg"
                        >
                            <Zap className="w-5 h-5" />
                            Discutons de votre projet
                        </a>
                        <a
                            href="https://www.malt.fr/profile/otmaneboulahia"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border-default hover:border-accent-primary text-primary rounded-lg font-semibold text-base transition-all hover:bg-surface-elevated"
                        >
                            Voir profil Malt →
                        </a>
                    </div>
                </div>
            </section>

            {/* Packages Section */}
            <section className="max-w-7xl mx-auto px-6 pb-32">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-primary">Formules d'accompagnement</h2>
                    <p className="text-xl text-secondary max-w-2xl mx-auto">
                        Du diagnostic express à la refonte complète de votre stack data
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Package 0: Diagnostic FinSight™ - NEW */}
                    <div className="surface rounded-2xl p-8 border border-border-subtle surface-hover">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Diagnostic FinSight™</h3>
                                <p className="text-tertiary text-sm">Découverte</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-bold text-blue-600">290€</span>
                            </div>
                            <p className="text-secondary text-sm">Livrable en 48h</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Score FinSight™ détaillé</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Lecture instantanée trésorerie</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Identification signaux faibles (BFR, marges, variabilité)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">3 actions prioritaires</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Livrable condensé et exploitable</span>
                            </li>
                        </ul>

                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-6 py-3 border-2 border-blue-600 hover:bg-blue-50 text-blue-600 rounded-lg font-semibold text-center transition-all"
                        >
                            Commander
                        </a>

                        <p className="text-xs text-tertiary mt-4 text-center">
                            Sans engagement • Vision claire immédiate
                        </p>
                    </div>

                    {/* Package 1: Audit FinSight™ (ancien Audit Express) */}
                    <div className="surface rounded-2xl p-8 border border-border-subtle surface-hover">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-accent-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Audit FinSight™</h3>
                                <p className="text-tertiary text-sm">Analyse approfondie</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-bold text-accent-primary">2 900€</span>
                            </div>
                            <p className="text-secondary text-sm">Livrable en 3-5 jours</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary font-semibold">Tout Diagnostic FinSight™ +</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Audit de votre stack data (Excel, BI tools, ERP)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Analyse KPIs avancée (DSO, BFR, marge, cash flow)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Recommandations priorisées (quick wins + roadmap)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">1 session stratégique (2h avec CFO/DAF)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Rapport détaillé (PDF + slides)</span>
                            </li>
                        </ul>

                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-6 py-3 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-lg font-semibold text-center transition-all hover:bg-surface-elevated"
                        >
                            Réserver un audit
                        </a>

                        <p className="text-xs text-tertiary mt-4 text-center">
                            Idéal pour : PME, Scale-ups, Pré-levée
                        </p>
                    </div>

                    {/* Package 2: Dashboard IA Custom (Recommandé) */}
                    <div className="surface rounded-2xl p-8 border-2 border-accent-primary relative overflow-hidden">
                        {/* Badge "Recommandé" */}
                        <div className="absolute top-0 right-0 bg-accent-primary text-white px-4 py-1 text-xs font-semibold rounded-bl-lg">
                            ⭐ Le plus demandé
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-primary flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Dashboard IA</h3>
                                <p className="text-tertiary text-sm">Sur-mesure</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-bold text-accent-primary">6 900€</span>
                            </div>
                            <p className="text-secondary text-sm">Livrable en 2-3 semaines</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary font-semibold">Tout Audit FinSight™ +</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Dashboard financier IA personnalisé (Next.js + Python)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Connexion automatique ERP/CSV (Sage, Cegid, QuickBooks)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">KPIs métier configurés (15-20 indicateurs)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">AI Copilot GPT-4 pour requêtes naturelles</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Formation équipe finance (4h)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">1 mois support post-livraison inclus</span>
                            </li>
                        </ul>

                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-center transition-all hover:shadow-xl"
                        >
                            Planifier un appel
                        </a>

                        <p className="text-xs text-tertiary mt-4 text-center">
                            Idéal pour : Scale-ups 50-200 pers., Refonte data
                        </p>
                    </div>

                    {/* Package 3: Transformation Data Complète */}
                    <div className="surface rounded-2xl p-8 border border-border-subtle surface-hover">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">
                                <Database className="w-6 h-6 text-accent-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Data Platform</h3>
                                <p className="text-tertiary text-sm">Enterprise-grade</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-3xl font-bold text-accent-primary">À partir de 12k€</span>
                            </div>
                            <p className="text-secondary text-sm">4-8 semaines (selon scope)</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary font-semibold">Tout Dashboard IA +</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Data warehouse moderne (Snowflake, BigQuery ou similaire)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Pipelines ETL automatisés (Airflow, Fivetran)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Modèles prédictifs ML (churn, forecasting cash flow)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Dashboards multi-départements (Finance, Sales, Ops)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Documentation technique complète</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">3 mois support & évolutions inclus</span>
                            </li>
                        </ul>

                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-6 py-3 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-lg font-semibold text-center transition-all hover:bg-surface-elevated"
                        >
                            Discutons du projet
                        </a>

                        <p className="text-xs text-tertiary mt-4 text-center">
                            Idéal pour : ETI 200-500 pers., Transformation data
                        </p>
                    </div>
                </div>

                {/* Régie / TJM */}
                <div className="mt-12 text-center p-8 surface rounded-2xl border border-accent-primary-border">
                    <h3 className="text-2xl font-bold mb-3">Mission en régie</h3>
                    <p className="text-secondary mb-4">
                        Besoin d'un renfort temporaire dans votre équipe data/finance ? Je peux intervenir en régie.
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <span className="text-4xl font-bold text-accent-primary">500€</span>
                        <span className="text-xl text-secondary">/ jour</span>
                    </div>
                    <p className="text-sm text-tertiary mb-6">
                        Minimum 5 jours • Remote ou présentiel (Paris/IDF)
                    </p>
                    <a
                        href="https://www.malt.fr/profile/otmaneboulahia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all"
                    >
                        Réserver sur Malt
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </section>

            {/* Réalisations récentes */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Réalisations récentes</h2>
                    <p className="text-secondary text-lg">
                        Exemples de projets data/finance livrés
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Mission 1: PowerBI IDM */}
                    <div className="surface rounded-xl p-8 border-2 border-border-default hover:border-accent-primary transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                Livré
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Dashboard PowerBI RH & Finance</h3>
                        <p className="text-sm text-tertiary mb-4">
                            Groupe formation professionnelle • 500M€ CA
                        </p>
                        <p className="text-secondary mb-6">
                            Création dashboard PowerBI multi-sources (RH + comptabilité) avec KPIs personnalisés, automatisation refresh quotidien, formation équipe finance.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                Power BI
                            </span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                ETL
                            </span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                DAX
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-tertiary">
                                <Clock className="w-4 h-4" />
                                3 semaines
                            </span>
                            <span className="flex items-center gap-1 text-tertiary">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                Décembre 2024
                            </span>
                        </div>
                    </div>

                    {/* Mission 2: Le Bal de Saint Bonnet */}
                    <div className="surface rounded-xl p-8 border-2 border-border-default hover:border-accent-primary transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                Livré
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Dashboard Suivi Placements Guides</h3>
                        <p className="text-sm text-tertiary mb-4">
                            Agence placement guides touristiques
                        </p>
                        <p className="text-secondary mb-6">
                            Dashboard Excel/PowerBI pour suivi placements, disponibilités guides, facturation automatisée, KPIs occupation et CA par guide.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                Excel Pro
                            </span>
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                Automatisation
                            </span>
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                KPIs métier
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-tertiary">
                                <Clock className="w-4 h-4" />
                                2 semaines
                            </span>
                            <span className="flex items-center gap-1 text-tertiary">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                2024
                            </span>
                        </div>
                    </div>

                    {/* Mission 3: FinSight (démo capacités) */}
                    <div className="surface rounded-xl p-8 border-2 border-accent-primary md:col-span-2">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-accent-primary flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                                Démo technique
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">FinSight - Plateforme FP&A IA</h3>
                        <p className="text-sm text-tertiary mb-4">
                            Projet personnel • Démonstration full-stack + IA
                        </p>
                        <p className="text-secondary mb-6">
                            Plateforme SaaS complète : 50+ KPIs automatiques, AI Copilot GPT-4, détection anomalies ML, Score FinSight™, exports PDF/Excel, collaboration temps réel. Démontre capacités techniques pour projets data/finance sur-mesure.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                Next.js 14
                            </span>
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                TypeScript
                            </span>
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                FastAPI Python
                            </span>
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                OpenAI GPT-4
                            </span>
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                ML
                            </span>
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                PostgreSQL
                            </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 text-accent-primary font-semibold hover:underline"
                            >
                                Tester la démo
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <span className="flex items-center gap-1 text-tertiary">
                                <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                                En production
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expertises Section */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Domaines d'expertise</h2>
                    <p className="text-secondary text-lg">
                        10+ ans d'expérience consultant data finance, spécialisé PME & scale-ups
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="surface rounded-xl p-6">
                        <Code className="w-10 h-10 text-accent-primary mb-4" />
                        <h3 className="font-semibold mb-2">Stack Technique</h3>
                        <p className="text-sm text-secondary">
                            Python, SQL, Next.js, React, TypeScript, FastAPI, Pandas, NumPy, Plotly, Airflow
                        </p>
                    </div>

                    <div className="surface rounded-xl p-6">
                        <Database className="w-10 h-10 text-accent-primary mb-4" />
                        <h3 className="font-semibold mb-2">Data & BI</h3>
                        <p className="text-sm text-secondary">
                            PostgreSQL, BigQuery, Snowflake, Power BI, Tableau, Metabase, dbt, ETL pipelines
                        </p>
                    </div>

                    <div className="surface rounded-xl p-6">
                        <TrendingUp className="w-10 h-10 text-accent-primary mb-4" />
                        <h3 className="font-semibold mb-2">Finance & ML</h3>
                        <p className="text-sm text-secondary">
                            KPIs financiers (DSO, BFR, ARR, churn), forecasting, modèles prédictifs, OpenAI GPT-4
                        </p>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="max-w-5xl mx-auto px-6 pb-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Comment ça se passe ?</h2>
                    <p className="text-xl text-secondary">Un process simple et transparent</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-accent-primary-subtle border-2 border-accent-primary flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-accent-primary">1</span>
                        </div>
                        <h3 className="font-semibold mb-2">Appel découverte</h3>
                        <p className="text-sm text-secondary">
                            30 min gratuit pour comprendre vos besoins et enjeux
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-accent-primary-subtle border-2 border-accent-primary flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-accent-primary">2</span>
                        </div>
                        <h3 className="font-semibold mb-2">Proposition détaillée</h3>
                        <p className="text-sm text-secondary">
                            Scope précis, livrables, timeline et budget sous 48h
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-accent-primary-subtle border-2 border-accent-primary flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-accent-primary">3</span>
                        </div>
                        <h3 className="font-semibold mb-2">Exécution agile</h3>
                        <p className="text-sm text-secondary">
                            Points hebdo, livraisons incrémentielles, feedback continu
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-accent-primary-subtle border-2 border-accent-primary flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-accent-primary">4</span>
                        </div>
                        <h3 className="font-semibold mb-2">Formation & Suivi</h3>
                        <p className="text-sm text-secondary">
                            Transfert de compétences, documentation, support post-projet
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="max-w-4xl mx-auto px-6 pb-32">
                <div className="surface rounded-2xl p-12 text-center border-2 border-accent-primary-border relative overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-radial from-accent-primary/10 via-transparent to-transparent opacity-50"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-4">Prêt à transformer vos données ?</h2>
                        <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
                            Discutons de votre projet lors d'un appel de 30 minutes (gratuit, sans engagement)
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-10 py-5 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:-translate-y-1"
                            >
                                Réserver un appel gratuit
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:contact@zineinsight.com"
                                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-xl font-semibold text-lg transition-all hover:bg-surface-elevated"
                            >
                                <Mail className="w-5 h-5" />
                                Envoyer un email
                            </a>
                        </div>

                        <p className="text-sm text-tertiary mt-6">
                            Réponse sous 24h • Disponibilité immédiate
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
