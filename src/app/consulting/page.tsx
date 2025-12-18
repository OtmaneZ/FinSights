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

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                        FinSight™ n’est pas un simple logiciel.<br />
                        <span className="text-accent-primary">C’est un moteur d’intelligence financière.</span>
                    </h1>

                    <p className="text-xl text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
                        Nous ne vous donnons pas juste un outil, nous construisons avec vous le système de décision qui fera passer votre entreprise au niveau supérieur. Chaque mission est conçue pour s’inscrire dans la continuité de la plateforme FinSight™.
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

                    {/* Package 1: Diagnostic FinSight™ Express */}
                    <div className="surface rounded-2xl p-8 border border-border-subtle surface-hover flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold leading-tight">Diagnostic FinSight™ Express</h3>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-4xl font-bold text-blue-600">990€</span>
                            </div>
                            <p className="text-secondary text-sm">Livrable en 48h</p>
                        </div>

                        <p className="text-sm text-secondary mb-6 italic">
                            "Votre santé financière scannée par l'IA et validée par un expert."
                        </p>

                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Connexion sécurisée à vos données</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Analyse automatique de 50+ points de contrôle</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Rapport PDF "Flash Audit" : Santé Cash, Risques, Opportunités</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">1h de restitution avec un expert finance FinSight</span>
                            </li>
                        </ul>

                        <div className="mt-auto">
                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full px-6 py-3 border-2 border-blue-600 hover:bg-blue-50 text-blue-600 rounded-lg font-semibold text-center transition-all"
                            >
                                Lancer le diagnostic
                            </a>
                            <p className="text-xs text-tertiary mt-4 text-center">
                                Idéal pour : Valider une intuition ou préparer une levée.
                            </p>
                        </div>
                    </div>

                    {/* Package 2: Audit FinSight™ Stratégique */}
                    <div className="surface rounded-2xl p-8 border border-border-subtle surface-hover flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-accent-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold leading-tight">Audit FinSight™ Stratégique</h3>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-4xl font-bold text-accent-primary">4 900€</span>
                            </div>
                            <p className="text-secondary text-sm">Livrable en 10-15 jours</p>
                        </div>

                        <p className="text-sm text-secondary mb-6 italic">
                            "La feuille de route précise pour débloquer votre rentabilité."
                        </p>

                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary font-semibold">Tout le Diagnostic Express +</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Immersion dans vos processus financiers (Facturation, Recouvrement, Achats)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Nettoyage et structuration de vos données historiques</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Construction du Modèle de Rentabilité Analytique (par client/offre)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Plan d'action "Quick Wins" chiffré (Gains potentiels à 3 mois)</span>
                            </li>
                        </ul>

                        <div className="mt-auto">
                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full px-6 py-3 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-lg font-semibold text-center transition-all hover:bg-surface-elevated"
                            >
                                Réserver un audit
                            </a>
                            <p className="text-xs text-tertiary mt-4 text-center">
                                Livrable : Le "BluePrint FinSight" de votre croissance.
                            </p>
                        </div>
                    </div>

                    {/* Package 3: FinSight™ Decision System */}
                    <div className="surface rounded-2xl p-8 border-2 border-accent-primary relative overflow-hidden flex flex-col">
                        {/* Badge "Recommandé" */}
                        <div className="absolute top-0 right-0 bg-accent-primary text-white px-4 py-1 text-xs font-semibold rounded-bl-lg">
                            ⭐ Recommandé
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-primary flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold leading-tight">FinSight™ Decision System</h3>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-4xl font-bold text-accent-primary">9 900€</span>
                            </div>
                            <p className="text-secondary text-sm">Livrable en 2-3 semaines</p>
                        </div>

                        <p className="text-sm text-secondary mb-6 italic">
                            "Votre cockpit financier automatisé et intelligent, clé en main."
                        </p>

                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Mise en place de l'infrastructure Data Finance complète</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Dashboards Automatisés (P&L, Trésorerie, Commercial)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Intégration IA FinSight (Chatbot CFO sur vos données)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Formation de vos équipes à l'outil</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">3 mois de support et d'ajustements inclus</span>
                            </li>
                        </ul>

                        <div className="mt-auto">
                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-center transition-all hover:shadow-xl"
                            >
                                Planifier un appel
                            </a>
                            <p className="text-xs text-tertiary mt-4 text-center">
                                Résultat : Votre direction financière en pilote automatique.
                            </p>
                        </div>
                    </div>

                    {/* Package 4: FinSight™ Enterprise Platform */}
                    <div className="surface rounded-2xl p-8 border border-border-subtle surface-hover flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">
                                <Database className="w-6 h-6 text-accent-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold leading-tight">FinSight™ Enterprise Platform</h3>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-bold text-accent-primary">Sur devis</span>
                            </div>
                            <p className="text-secondary text-sm">À partir de 15k€ • Sur mesure</p>
                        </div>

                        <p className="text-sm text-secondary mb-6 italic">
                            "La puissance de FinSight intégrée au cœur de votre SI."
                        </p>

                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Déploiement sur infrastructure dédiée (On-Premise ou Cloud Privé)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Connecteurs sur-mesure (ERP spécifiques, CRM maison)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Algorithmes prédictifs personnalisés (Saisonnalité complexe, Churn)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">Gouvernance des données et Sécurité avancée (SSO, RBAC)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-secondary">SLA garanti et Account Manager dédié</span>
                            </li>
                        </ul>

                        <div className="mt-auto">
                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full px-6 py-3 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-lg font-semibold text-center transition-all hover:bg-surface-elevated"
                            >
                                Discutons du projet
                            </a>
                            <p className="text-xs text-tertiary mt-4 text-center">
                                Pour : ETI et Scale-ups avec enjeux data complexes.
                            </p>
                        </div>
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
                                Octobre 2025
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
                                Novembre 2025
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

            {/* À propos Section avec Photo */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="surface rounded-2xl p-12 border border-border-subtle">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Photo */}
                        <div className="relative">
                            <div className="aspect-square rounded-2xl overflow-hidden border-4 border-accent-primary-border shadow-2xl">
                                <Image
                                    src="/images/otmane-boulahia.jpg"
                                    alt="Otmane Boulahia - Consultant Data Finance & IA"
                                    width={500}
                                    height={500}
                                    className="object-cover w-full h-full"
                                    priority
                                />
                            </div>
                            {/* Badge flottant */}
                            <div className="absolute -bottom-4 -right-4 bg-accent-primary text-white px-6 py-3 rounded-xl shadow-lg">
                                <div className="text-sm font-semibold">10+ ans d'expérience</div>
                                <div className="text-xs opacity-90">Finance × Data × IA</div>
                            </div>
                        </div>

                        {/* Contenu */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Otmane Boulahia</h2>
                                <p className="text-xl text-accent-primary font-semibold mb-4">
                                    Consultant Data Finance & Intelligence Artificielle
                                </p>
                            </div>

                            <div className="space-y-4 text-secondary">
                                <p className="leading-relaxed">
                                    Après 10 ans passés entre Direction Financière et équipes Data de scale-ups françaises,
                                    j'ai créé <span className="font-semibold text-accent-primary">FinSight™</span> pour démocratiser
                                    l'accès à l'intelligence financière augmentée.
                                </p>
                                <p className="leading-relaxed">
                                    Ma mission : transformer des données brutes en décisions stratégiques claires,
                                    en combinant expertise finance, maîtrise technique et puissance de l'IA.
                                </p>
                                <p className="leading-relaxed">
                                    <span className="font-semibold text-primary">FinSight n'est pas qu'un outil</span> —
                                    c'est la vitrine de ma méthodologie et le prolongement de mes missions consulting.
                                </p>
                            </div>

                            {/* CTAs Réseaux */}
                            <div className="flex gap-4 pt-4">
                                <a
                                    href="https://www.linkedin.com/in/otmane-boulahia/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-lg font-semibold transition-all"
                                >
                                    <Linkedin className="w-5 h-5" />
                                    LinkedIn
                                </a>
                                <a
                                    href="https://calendly.com/zineinsight"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-accent-primary-border hover:bg-accent-primary-subtle text-accent-primary rounded-lg font-semibold transition-all"
                                >
                                    <Zap className="w-5 h-5" />
                                    Discutons
                                </a>
                            </div>
                        </div>
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
