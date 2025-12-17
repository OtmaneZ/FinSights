'use client''use client'



import Link from 'next/link'import Link from 'next/link'

import Image from 'next/image'import Image from 'next/image'

import {import {

    Check,    Check,

    Sparkles,    Sparkles,

    Zap,    Zap,

    Users,    Users,

    Building2,    Building2,

    Rocket,    Rocket,

    Clock,    Clock,

    Shield,    Shield,

    Code,    Code,

    FileCheck,    FileCheck,

    Linkedin,    Linkedin,

    Mail,    Mail,

    ArrowRight,    ArrowRight,

    CheckCircle2,    CheckCircle2,

    TrendingUp,    TrendingUp,

    Database,    Database,

    BarChart3    BarChart3

} from 'lucide-react'} from 'lucide-react'

import Header from '@/components/Header'import Header from '@/components/Header'

import Footer from '@/components/Footer'import Footer from '@/components/Footer'



export default function ConsultingPage() {export default function ConsultingPage() {

    return (    return (

        <div className="min-h-screen bg-primary text-primary font-sans">        <div className="min-h-screen bg-primary text-primary font-sans">

            <Header />            <Header />



            {/* Hero Section */}            {/* Hero Section */}

            <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">            <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">

                {/* Radial gradient glow effect */}                {/* Radial gradient glow effect */}

                <div className="absolute inset-x-0 top-0 h-[400px] pointer-events-none overflow-hidden">                <div className="absolute inset-x-0 top-0 h-[400px] pointer-events-none overflow-hidden">

                    <div className="absolute inset-0 bg-gradient-radial from-accent-primary/20 via-accent-primary/5 to-transparent blur-3xl"                    <div className="absolute inset-0 bg-gradient-radial from-accent-primary/20 via-accent-primary/5 to-transparent blur-3xl"

                        style={{                        style={{

                            background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 40%, transparent 70%)'                            background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 40%, transparent 70%)'

                        }}>                        }}>

                    </div>                    </div>

                </div>                </div>



                <div className="relative z-10">                <div className="relative z-10">

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-8">                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-8">

                        <Sparkles className="w-4 h-4 text-accent-primary" />                        <Sparkles className="w-4 h-4 text-accent-primary" />

                        <span className="text-accent-primary text-sm font-medium">Consultant Data Finance • Dashboards IA & Automatisation ERP</span>                        <span className="text-accent-primary text-sm font-medium">Consultant Data Finance • Dashboards IA & Automatisation ERP</span>

                    </div>                    </div>



                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">

                        FinSight™ n’est pas un simple logiciel.<br />                        Transformez vos données financières<br />

                        <span className="text-accent-primary">C’est un moteur d’intelligence financière.</span>                        <span className="text-accent-primary">en décisions rapides et fiables</span>

                    </h1>                    </h1>



                    <p className="text-xl text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">                    <p className="text-xl text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">

                        Nous ne vous donnons pas juste un outil, nous construisons avec vous le système de décision qui fera passer votre entreprise au niveau supérieur.                        KPIs sur-mesure, trésorerie prédictive, automatisation ERP et dashboards IA.<br />

                    </p>                        <span className="font-semibold text-primary">Livrables en 1-4 semaines</span>, accompagnement main dans la main.

                    </p>

                    <div className="flex items-center justify-center gap-6 text-sm text-tertiary mb-8">

                        <div className="flex items-center gap-2">                    <div className="flex items-center justify-center gap-6 text-sm text-tertiary mb-8">

                            <CheckCircle2 className="w-5 h-5 text-accent-primary" />                        <div className="flex items-center gap-2">

                            <span>10+ ans finance & data</span>                            <CheckCircle2 className="w-5 h-5 text-accent-primary" />

                        </div>                            <span>10+ ans finance & data</span>

                        <div className="flex items-center gap-2">                        </div>

                            <CheckCircle2 className="w-5 h-5 text-accent-primary" />                        <div className="flex items-center gap-2">

                            <span>Python, SQL, BI, ERP</span>                            <CheckCircle2 className="w-5 h-5 text-accent-primary" />

                        </div>                            <span>Python, SQL, BI, ERP</span>

                        <div className="flex items-center gap-2">                        </div>

                            <CheckCircle2 className="w-5 h-5 text-accent-primary" />                        <div className="flex items-center gap-2">

                            <span>TJM 500€</span>                            <CheckCircle2 className="w-5 h-5 text-accent-primary" />

                        </div>                            <span>TJM 500€</span>

                    </div>                        </div>

                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

                        <a                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

                            href="https://calendly.com/zineinsight"                        <a

                            target="_blank"                            href="https://calendly.com/zineinsight"

                            rel="noopener noreferrer"                            target="_blank"

                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-base transition-all hover:shadow-lg"                            rel="noopener noreferrer"

                        >                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-base transition-all hover:shadow-lg"

                            <Zap className="w-5 h-5" />                        >

                            Discutons de votre projet                            <Zap className="w-5 h-5" />

                        </a>                            Discutons de votre projet

                        <a                        </a>

                            href="https://www.malt.fr/profile/otmaneboulahia"                        <a

                            target="_blank"                            href="https://www.malt.fr/profile/otmaneboulahia"

                            rel="noopener noreferrer"                            target="_blank"

                            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border-default hover:border-accent-primary text-primary rounded-lg font-semibold text-base transition-all hover:bg-surface-elevated"                            rel="noopener noreferrer"

                        >                            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border-default hover:border-accent-primary text-primary rounded-lg font-semibold text-base transition-all hover:bg-surface-elevated"

                            Voir profil Malt →                        >

                        </a>                            Voir profil Malt →

                    </div>                        </a>

                </div>                    </div>

            </section>                </div>

            </section>

            {/* Packages Section */}

            <section className="max-w-7xl mx-auto px-6 pb-32">            {/* Packages Section */}

                <div className="text-center mb-16">            <section className="max-w-7xl mx-auto px-6 pb-32">

                    <h2 className="text-4xl font-bold mb-4 text-primary">Formules d'accompagnement</h2>                <div className="text-center mb-16">

                    <p className="text-xl text-secondary max-w-2xl mx-auto">                    <h2 className="text-4xl font-bold mb-4 text-primary">Formules d'accompagnement</h2>

                        Du diagnostic express à la refonte complète de votre stack data                    <p className="text-xl text-secondary max-w-2xl mx-auto">

                    </p>                        Du diagnostic express à la refonte complète de votre stack data

                </div>                    </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Package 1: Diagnostic FinSight™ Express */}

                    <div className="surface rounded-2xl p-8 border border-border-subtle surface-hover flex flex-col">                    {/* Package 0: Diagnostic FinSight™ - NEW */}

                        <div className="flex items-center gap-3 mb-4">                    <div className="surface rounded-2xl p-8 border border-border-subtle surface-hover">

                            <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center">                        <div className="flex items-center gap-3 mb-4">

                                <Sparkles className="w-6 h-6 text-blue-600" />                            <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center">

                            </div>                                <Sparkles className="w-6 h-6 text-blue-600" />

                            <div>                            </div>

                                <h3 className="text-xl font-bold leading-tight">Diagnostic FinSight™ Express</h3>                            <div>

                            </div>                                <h3 className="text-2xl font-bold">Diagnostic FinSight™</h3>

                        </div>                                <p className="text-tertiary text-sm">Découverte</p>

                            </div>

                        <div className="mb-4">                        </div>

                            <div className="flex items-baseline gap-2 mb-1">

                                <span className="text-4xl font-bold text-blue-600">990€</span>                        <div className="mb-6">

                            </div>                            <div className="flex items-baseline gap-2 mb-2">

                            <p className="text-secondary text-sm">Livrable en 48h</p>                                <span className="text-5xl font-bold text-blue-600">590€</span>

                        </div>                            </div>

                            <p className="text-secondary text-sm">Livrable en 48h</p>

                        <p className="text-sm text-secondary mb-6 italic">                        </div>

                            "Votre santé financière scannée par l'IA et validée par un expert."

                        </p>                        <ul className="space-y-3 mb-8">

                            <li className="flex items-start gap-3">

                        <ul className="space-y-3 mb-8 flex-grow">                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />

                            <li className="flex items-start gap-3">                                <span className="text-sm text-secondary">Score FinSight™ détaillé</span>

                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />                            </li>

                                <span className="text-sm text-secondary">Connexion sécurisée à vos données</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />

                            <li className="flex items-start gap-3">                                <span className="text-sm text-secondary">Lecture instantanée trésorerie</span>

                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />                            </li>

                                <span className="text-sm text-secondary">Analyse automatique de 50+ points de contrôle</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />

                            <li className="flex items-start gap-3">                                <span className="text-sm text-secondary">Identification signaux faibles (BFR, marges, variabilité)</span>

                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />                            </li>

                                <span className="text-sm text-secondary">Rapport PDF "Flash Audit" : Santé Cash, Risques, Opportunités</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />

                            <li className="flex items-start gap-3">                                <span className="text-sm text-secondary">Lecture experte + recommandations humaines</span>

                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />                            </li>

                                <span className="text-sm text-secondary">1h de restitution expert avec un CFO FinSight</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />

                        </ul>                                <span className="text-sm text-secondary">3 actions prioritaires</span>

                            </li>

                        <div className="mt-auto">                            <li className="flex items-start gap-3">

                            <a                                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />

                                href="https://calendly.com/zineinsight"                                <span className="text-sm text-secondary">Livrable condensé et exploitable</span>

                                target="_blank"                            </li>

                                rel="noopener noreferrer"                        </ul>

                                className="block w-full px-6 py-3 border-2 border-blue-600 hover:bg-blue-50 text-blue-600 rounded-lg font-semibold text-center transition-all"

                            >                        <a

                                Lancer le diagnostic                            href="https://calendly.com/zineinsight"

                            </a>                            target="_blank"

                            <p className="text-xs text-tertiary mt-4 text-center">                            rel="noopener noreferrer"

                                Idéal pour : Valider une intuition ou préparer une levée.                            className="block w-full px-6 py-3 border-2 border-blue-600 hover:bg-blue-50 text-blue-600 rounded-lg font-semibold text-center transition-all"

                            </p>                        >

                        </div>                            Lancer le diagnostic

                    </div>                        </a>



                    {/* Package 2: Audit FinSight™ Stratégique */}                        <p className="text-xs text-tertiary mt-4 text-center">

                    <div className="surface rounded-2xl p-8 border border-border-subtle surface-hover flex flex-col">                            Sans engagement • Vision claire immédiate

                        <div className="flex items-center gap-3 mb-4">                        </p>

                            <div className="w-12 h-12 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">                    </div>

                                <BarChart3 className="w-6 h-6 text-accent-primary" />

                            </div>                    {/* Package 1: Audit FinSight™ (ancien Audit Express) */}

                            <div>                    <div className="surface rounded-2xl p-8 border border-border-subtle surface-hover">

                                <h3 className="text-xl font-bold leading-tight">Audit FinSight™ Stratégique</h3>                        <div className="flex items-center gap-3 mb-4">

                            </div>                            <div className="w-12 h-12 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">

                        </div>                                <BarChart3 className="w-6 h-6 text-accent-primary" />

                            </div>

                        <div className="mb-4">                            <div>

                            <div className="flex items-baseline gap-2 mb-1">                                <h3 className="text-2xl font-bold">Audit FinSight™</h3>

                                <span className="text-4xl font-bold text-accent-primary">4 900€</span>                                <p className="text-tertiary text-sm">Analyse approfondie</p>

                            </div>                            </div>

                            <p className="text-secondary text-sm">Livrable en 10-15 jours</p>                        </div>

                        </div>

                        <div className="mb-6">

                        <p className="text-sm text-secondary mb-6 italic">                            <div className="flex items-baseline gap-2 mb-2">

                            "La feuille de route précise pour débloquer votre rentabilité."                                <span className="text-5xl font-bold text-accent-primary">4 900€</span>

                        </p>                            </div>

                            <p className="text-secondary text-sm">Livrable en 3-5 jours</p>

                        <ul className="space-y-3 mb-8 flex-grow">                        </div>

                            <li className="flex items-start gap-3">

                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />                        <ul className="space-y-3 mb-8">

                                <span className="text-sm text-secondary font-semibold">Tout le Diagnostic Express +</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                            <li className="flex items-start gap-3">                                <span className="text-sm text-secondary font-semibold">Tout Diagnostic FinSight™ +</span>

                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />                            </li>

                                <span className="text-sm text-secondary">Immersion dans vos processus financiers (Facturation, Recouvrement, Achats)</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                            <li className="flex items-start gap-3">                                <span className="text-sm text-secondary">Audit de votre stack data (Excel, BI tools, ERP)</span>

                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />                            </li>

                                <span className="text-sm text-secondary">Nettoyage et structuration de vos données historiques</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                            <li className="flex items-start gap-3">                                <span className="text-sm text-secondary">Analyse KPIs avancée (DSO, BFR, marge, cash flow)</span>

                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />                            </li>

                                <span className="text-sm text-secondary">Construction du Modèle de Rentabilité Analytique (par client/offre)</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                            <li className="flex items-start gap-3">                                <span className="text-sm text-secondary">Décisions priorisées à 90 jours</span>

                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />                            </li>

                                <span className="text-sm text-secondary">Plan d'action "Quick Wins" chiffré (Gains potentiels à 3 mois)</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                        </ul>                                <span className="text-sm text-secondary">Recommandations priorisées (quick wins + roadmap)</span>

                            </li>

                        <div className="mt-auto">                            <li className="flex items-start gap-3">

                            <a                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                                href="https://calendly.com/zineinsight"                                <span className="text-sm text-secondary">1 session stratégique (2h avec CFO/DAF)</span>

                                target="_blank"                            </li>

                                rel="noopener noreferrer"                            <li className="flex items-start gap-3">

                                className="block w-full px-6 py-3 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-lg font-semibold text-center transition-all hover:bg-surface-elevated"                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                            >                                <span className="text-sm text-secondary">Rapport détaillé (PDF + slides)</span>

                                Réserver un audit                            </li>

                            </a>                        </ul>

                            <p className="text-xs text-tertiary mt-4 text-center">

                                Livrable : Le "BluePrint FinSight" de votre croissance.                        <a

                            </p>                            href="https://calendly.com/zineinsight"

                        </div>                            target="_blank"

                    </div>                            rel="noopener noreferrer"

                            className="block w-full px-6 py-3 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-lg font-semibold text-center transition-all hover:bg-surface-elevated"

                    {/* Package 3: FinSight™ Decision System */}                        >

                    <div className="surface rounded-2xl p-8 border-2 border-accent-primary relative overflow-hidden flex flex-col">                            Réserver un audit

                        {/* Badge "Recommandé" */}                        </a>

                        <div className="absolute top-0 right-0 bg-accent-primary text-white px-4 py-1 text-xs font-semibold rounded-bl-lg">

                            ⭐ Recommandé                        <p className="text-xs text-tertiary mt-4 text-center">

                        </div>                            Idéal pour : PME, Scale-ups, Pré-levée

                        </p>

                        <div className="flex items-center gap-3 mb-4">                    </div>

                            <div className="w-12 h-12 rounded-xl bg-accent-primary flex items-center justify-center">

                                <TrendingUp className="w-6 h-6 text-white" />                    {/* Package 2: Dashboard IA Custom (Recommandé) */}

                            </div>                    <div className="surface rounded-2xl p-8 border-2 border-accent-primary relative overflow-hidden">

                            <div>                        {/* Badge "Recommandé" */}

                                <h3 className="text-xl font-bold leading-tight">FinSight™ Decision System</h3>                        <div className="absolute top-0 right-0 bg-accent-primary text-white px-4 py-1 text-xs font-semibold rounded-bl-lg">

                            </div>                            ⭐ Le plus demandé

                        </div>                        </div>



                        <div className="mb-4">                        <div className="flex items-center gap-3 mb-4">

                            <div className="flex items-baseline gap-2 mb-1">                            <div className="w-12 h-12 rounded-xl bg-accent-primary flex items-center justify-center">

                                <span className="text-4xl font-bold text-accent-primary">9 900€</span>                                <TrendingUp className="w-6 h-6 text-white" />

                            </div>                            </div>

                            <p className="text-secondary text-sm">Livrable en 2-3 semaines</p>                            <div>

                        </div>                                <h3 className="text-2xl font-bold">Dashboard IA</h3>

                                <p className="text-tertiary text-sm">Sur-mesure</p>

                        <p className="text-sm text-secondary mb-6 italic">                            </div>

                            "Votre cockpit financier automatisé et intelligent, clé en main."                        </div>

                        </p>

                        <div className="mb-6">

                        <ul className="space-y-3 mb-8 flex-grow">                            <div className="flex items-baseline gap-2 mb-2">

                            <li className="flex items-start gap-3">                                <span className="text-5xl font-bold text-accent-primary">9 900€</span>

                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />                            </div>

                                <span className="text-sm text-secondary">Mise en place de l'infrastructure Data Finance complète</span>                            <p className="text-secondary text-sm">Livrable en 2-3 semaines</p>

                            </li>                        </div>

                            <li className="flex items-start gap-3">

                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />                        <ul className="space-y-3 mb-8">

                                <span className="text-sm text-secondary">Dashboards Automatisés (P&L, Trésorerie, Commercial)</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                            <li className="flex items-start gap-3">                                <span className="text-sm text-secondary font-semibold">Tout Audit FinSight™ +</span>

                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />                            </li>

                                <span className="text-sm text-secondary">Intégration IA FinSight (Chatbot CFO sur vos données)</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                            <li className="flex items-start gap-3">                                <span className="text-sm text-secondary">Dashboard financier IA personnalisé (Next.js + Python)</span>

                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />                            </li>

                                <span className="text-sm text-secondary">Formation de vos équipes à l'outil</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                            <li className="flex items-start gap-3">                                <span className="text-sm text-secondary">Connexion automatique ERP/CSV (Sage, Cegid, QuickBooks)</span>

                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />                            </li>

                                <span className="text-sm text-secondary">3 mois de support et d'ajustements inclus</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                        </ul>                                <span className="text-sm text-secondary">KPIs décisionnels configurés (cash, marges, BFR, runway)</span>

                            </li>

                        <div className="mt-auto">                            <li className="flex items-start gap-3">

                            <a                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                                href="https://calendly.com/zineinsight"                                <span className="text-sm text-secondary">AI Copilot GPT-4 pour requêtes naturelles</span>

                                target="_blank"                            </li>

                                rel="noopener noreferrer"                            <li className="flex items-start gap-3">

                                className="block w-full px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-center transition-all hover:shadow-xl"                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                            >                                <span className="text-sm text-secondary">Formation équipe finance (4h)</span>

                                Planifier un appel                            </li>

                            </a>                            <li className="flex items-start gap-3">

                            <p className="text-xs text-tertiary mt-4 text-center">                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                                Résultat : Votre direction financière en pilote automatique.                                <span className="text-sm text-secondary">1 mois support post-livraison inclus</span>

                            </p>                            </li>

                        </div>                        </ul>

                    </div>

                        <a

                    {/* Package 4: FinSight™ Enterprise Platform */}                            href="https://calendly.com/zineinsight"

                    <div className="surface rounded-2xl p-8 border border-border-subtle surface-hover flex flex-col">                            target="_blank"

                        <div className="flex items-center gap-3 mb-4">                            rel="noopener noreferrer"

                            <div className="w-12 h-12 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">                            className="block w-full px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-center transition-all hover:shadow-xl"

                                <Database className="w-6 h-6 text-accent-primary" />                        >

                            </div>                            Planifier un appel

                            <div>                        </a>

                                <h3 className="text-xl font-bold leading-tight">FinSight™ Enterprise Platform</h3>

                            </div>                        <p className="text-xs text-tertiary mt-4 text-center">

                        </div>                            Idéal pour : Scale-ups 50-200 pers., Refonte data

                        </p>

                        <div className="mb-4">                    </div>

                            <div className="flex items-baseline gap-2 mb-1">

                                <span className="text-3xl font-bold text-accent-primary">Sur devis</span>                    {/* Package 3: Transformation Data Complète */}

                            </div>                    <div className="surface rounded-2xl p-8 border border-border-subtle surface-hover">

                            <p className="text-secondary text-sm">À partir de 15k€ • Sur mesure</p>                        <div className="flex items-center gap-3 mb-4">

                        </div>                            <div className="w-12 h-12 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">

                                <Database className="w-6 h-6 text-accent-primary" />

                        <p className="text-sm text-secondary mb-6 italic">                            </div>

                            "La puissance de FinSight intégrée au cœur de votre SI."                            <div>

                        </p>                                <h3 className="text-2xl font-bold">Data Platform</h3>

                                <p className="text-tertiary text-sm">Enterprise-grade</p>

                        <ul className="space-y-3 mb-8 flex-grow">                            </div>

                            <li className="flex items-start gap-3">                        </div>

                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                                <span className="text-sm text-secondary">Déploiement sur infrastructure dédiée (On-Premise ou Cloud Privé)</span>                        <div className="mb-6">

                            </li>                            <div className="flex items-baseline gap-2 mb-2">

                            <li className="flex items-start gap-3">                                <span className="text-3xl font-bold text-accent-primary">À partir de 12k€</span>

                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />                            </div>

                                <span className="text-sm text-secondary">Connecteurs sur-mesure (ERP spécifiques, CRM maison)</span>                            <p className="text-secondary text-sm">4-8 semaines (selon scope)</p>

                            </li>                        </div>

                            <li className="flex items-start gap-3">

                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />                        <ul className="space-y-3 mb-8">

                                <span className="text-sm text-secondary">Algorithmes prédictifs personnalisés (Saisonnalité complexe, Churn)</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                            <li className="flex items-start gap-3">                                <span className="text-sm text-secondary font-semibold">Tout Dashboard IA +</span>

                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />                            </li>

                                <span className="text-sm text-secondary">Gouvernance des données et Sécurité avancée (SSO, RBAC)</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                            <li className="flex items-start gap-3">                                <span className="text-sm text-secondary">Data warehouse moderne (Snowflake, BigQuery ou similaire)</span>

                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />                            </li>

                                <span className="text-sm text-secondary">SLA garanti et Account Manager dédié</span>                            <li className="flex items-start gap-3">

                            </li>                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                        </ul>                                <span className="text-sm text-secondary">Pipelines ETL automatisés (Airflow, Fivetran)</span>

                            </li>

                        <div className="mt-auto">                            <li className="flex items-start gap-3">

                            <a                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                                href="https://calendly.com/zineinsight"                                <span className="text-sm text-secondary">Modèles prédictifs ML (churn, forecasting cash flow)</span>

                                target="_blank"                            </li>

                                rel="noopener noreferrer"                            <li className="flex items-start gap-3">

                                className="block w-full px-6 py-3 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-lg font-semibold text-center transition-all hover:bg-surface-elevated"                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                            >                                <span className="text-sm text-secondary">Dashboards multi-départements (Finance, Sales, Ops)</span>

                                Discutons du projet                            </li>

                            </a>                            <li className="flex items-start gap-3">

                            <p className="text-xs text-tertiary mt-4 text-center">                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                                Pour : ETI et Scale-ups avec enjeux data complexes.                                <span className="text-sm text-secondary">Documentation technique complète</span>

                            </p>                            </li>

                        </div>                            <li className="flex items-start gap-3">

                    </div>                                <Check className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />

                </div>                                <span className="text-sm text-secondary">3 mois support & évolutions inclus</span>

                            </li>

                {/* Régie / TJM */}                        </ul>

                <div className="mt-12 text-center p-8 surface rounded-2xl border border-accent-primary-border">

                    <h3 className="text-2xl font-bold mb-3">Mission en régie</h3>                        <a

                    <p className="text-secondary mb-4">                            href="https://calendly.com/zineinsight"

                        Besoin d'un renfort temporaire dans votre équipe data/finance ? Je peux intervenir en régie.                            target="_blank"

                    </p>                            rel="noopener noreferrer"

                    <div className="flex items-center justify-center gap-4 mb-4">                            className="block w-full px-6 py-3 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-lg font-semibold text-center transition-all hover:bg-surface-elevated"

                        <span className="text-4xl font-bold text-accent-primary">500€</span>                        >

                        <span className="text-xl text-secondary">/ jour</span>                            Discutons du projet

                    </div>                        </a>

                    <p className="text-sm text-tertiary mb-6">

                        Minimum 5 jours • Remote ou présentiel (Paris/IDF)                        <p className="text-xs text-tertiary mt-4 text-center">

                    </p>                            Idéal pour : ETI 200-500 pers., Transformation data

                    <a                        </p>

                        href="https://www.malt.fr/profile/otmaneboulahia"                    </div>

                        target="_blank"                </div>

                        rel="noopener noreferrer"

                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all"                {/* Régie / TJM */}

                    >                <div className="mt-12 text-center p-8 surface rounded-2xl border border-accent-primary-border">

                        Réserver sur Malt                    <h3 className="text-2xl font-bold mb-3">Mission en régie</h3>

                        <ArrowRight className="w-4 h-4" />                    <p className="text-secondary mb-4">

                    </a>                        Besoin d'un renfort temporaire dans votre équipe data/finance ? Je peux intervenir en régie.

                </div>                    </p>

            </section>                    <div className="flex items-center justify-center gap-4 mb-4">

                        <span className="text-4xl font-bold text-accent-primary">500€</span>

            {/* Réalisations récentes */}                        <span className="text-xl text-secondary">/ jour</span>

            <section className="max-w-6xl mx-auto px-6 pb-24">                    </div>

                <div className="text-center mb-12">                    <p className="text-sm text-tertiary mb-6">

                    <h2 className="text-3xl font-bold mb-4">Réalisations récentes</h2>                        Minimum 5 jours • Remote ou présentiel (Paris/IDF)

                    <p className="text-secondary text-lg">                    </p>

                        Exemples de projets data/finance livrés                    <a

                    </p>                        href="https://www.malt.fr/profile/otmaneboulahia"

                </div>                        target="_blank"

                        rel="noopener noreferrer"

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all"

                    {/* Mission 1: PowerBI IDM */}                    >

                    <div className="surface rounded-xl p-8 border-2 border-border-default hover:border-accent-primary transition-all">                        Réserver sur Malt

                        <div className="flex items-start justify-between mb-4">                        <ArrowRight className="w-4 h-4" />

                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">                    </a>

                                <BarChart3 className="w-6 h-6 text-blue-600" />                </div>

                            </div>            </section>

                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">

                                Livré            {/* Réalisations récentes */}

                            </span>            <section className="max-w-6xl mx-auto px-6 pb-24">

                        </div>                <div className="text-center mb-12">

                        <h3 className="text-xl font-bold mb-2">Dashboard PowerBI RH & Finance</h3>                    <h2 className="text-3xl font-bold mb-4">Réalisations récentes</h2>

                        <p className="text-sm text-tertiary mb-4">                    <p className="text-secondary text-lg">

                            Groupe formation professionnelle • 500M€ CA                        Exemples de projets data/finance livrés

                        </p>                    </p>

                        <p className="text-secondary mb-6">                </div>

                            Création dashboard PowerBI multi-sources (RH + comptabilité) avec KPIs personnalisés, automatisation refresh quotidien, formation équipe finance.

                        </p>                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className="flex flex-wrap gap-2 mb-6">                    {/* Mission 1: PowerBI IDM */}

                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">                    <div className="surface rounded-xl p-8 border-2 border-border-default hover:border-accent-primary transition-all">

                                Power BI                        <div className="flex items-start justify-between mb-4">

                            </span>                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">

                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">                                <BarChart3 className="w-6 h-6 text-blue-600" />

                                ETL                            </div>

                            </span>                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">

                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">                                Livré

                                DAX                            </span>

                            </span>                        </div>

                        </div>                        <h3 className="text-xl font-bold mb-2">Dashboard PowerBI RH & Finance</h3>

                        <div className="flex items-center gap-4 text-sm">                        <p className="text-sm text-tertiary mb-4">

                            <span className="flex items-center gap-1 text-tertiary">                            Groupe formation professionnelle • 500M€ CA

                                <Clock className="w-4 h-4" />                        </p>

                                3 semaines                        <p className="text-secondary mb-6">

                            </span>                            Création dashboard PowerBI multi-sources (RH + comptabilité) avec KPIs personnalisés, automatisation refresh quotidien, formation équipe finance.

                            <span className="flex items-center gap-1 text-tertiary">                        </p>

                                <CheckCircle2 className="w-4 h-4 text-green-600" />                        <div className="flex flex-wrap gap-2 mb-6">

                                Octobre 2025                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">

                            </span>                                Power BI

                        </div>                            </span>

                    </div>                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">

                                ETL

                    {/* Mission 2: Le Bal de Saint Bonnet */}                            </span>

                    <div className="surface rounded-xl p-8 border-2 border-border-default hover:border-accent-primary transition-all">                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">

                        <div className="flex items-start justify-between mb-4">                                DAX

                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">                            </span>

                                <Users className="w-6 h-6 text-purple-600" />                        </div>

                            </div>                        <div className="flex items-center gap-4 text-sm">

                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">                            <span className="flex items-center gap-1 text-tertiary">

                                Livré                                <Clock className="w-4 h-4" />

                            </span>                                3 semaines

                        </div>                            </span>

                        <h3 className="text-xl font-bold mb-2">Dashboard Suivi Placements Guides</h3>                            <span className="flex items-center gap-1 text-tertiary">

                        <p className="text-sm text-tertiary mb-4">                                <CheckCircle2 className="w-4 h-4 text-green-600" />

                            Agence placement guides touristiques                                Octobre 2025

                        </p>                            </span>

                        <p className="text-secondary mb-6">                        </div>

                            Dashboard Excel/PowerBI pour suivi placements, disponibilités guides, facturation automatisée, KPIs occupation et CA par guide.                    </div>

                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">                    {/* Mission 2: Le Bal de Saint Bonnet */}

                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">                    <div className="surface rounded-xl p-8 border-2 border-border-default hover:border-accent-primary transition-all">

                                Excel Pro                        <div className="flex items-start justify-between mb-4">

                            </span>                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">

                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">                                <Users className="w-6 h-6 text-purple-600" />

                                Automatisation                            </div>

                            </span>                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">

                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">                                Livré

                                KPIs métier                            </span>

                            </span>                        </div>

                        </div>                        <h3 className="text-xl font-bold mb-2">Dashboard Suivi Placements Guides</h3>

                        <div className="flex items-center gap-4 text-sm">                        <p className="text-sm text-tertiary mb-4">

                            <span className="flex items-center gap-1 text-tertiary">                            Agence placement guides touristiques

                                <Clock className="w-4 h-4" />                        </p>

                                2 semaines                        <p className="text-secondary mb-6">

                            </span>                            Dashboard Excel/PowerBI pour suivi placements, disponibilités guides, facturation automatisée, KPIs occupation et CA par guide.

                            <span className="flex items-center gap-1 text-tertiary">                        </p>

                                <CheckCircle2 className="w-4 h-4 text-green-600" />                        <div className="flex flex-wrap gap-2 mb-6">

                                Novembre 2025                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">

                            </span>                                Excel Pro

                        </div>                            </span>

                    </div>                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">

                                Automatisation

                    {/* Mission 3: FinSight (démo capacités) */}                            </span>

                    <div className="surface rounded-xl p-8 border-2 border-accent-primary md:col-span-2">                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">

                        <div className="flex items-start justify-between mb-4">                                KPIs métier

                            <div className="w-12 h-12 rounded-lg bg-accent-primary flex items-center justify-center">                            </span>

                                <Sparkles className="w-6 h-6 text-white" />                        </div>

                            </div>                        <div className="flex items-center gap-4 text-sm">

                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">                            <span className="flex items-center gap-1 text-tertiary">

                                Démo technique                                <Clock className="w-4 h-4" />

                            </span>                                2 semaines

                        </div>                            </span>

                        <h3 className="text-xl font-bold mb-2">FinSight - Plateforme FP&A IA</h3>                            <span className="flex items-center gap-1 text-tertiary">

                        <p className="text-sm text-tertiary mb-4">                                <CheckCircle2 className="w-4 h-4 text-green-600" />

                            Projet personnel • Démonstration full-stack + IA                                Novembre 2025

                        </p>                            </span>

                        <p className="text-secondary mb-6">                        </div>

                            Plateforme SaaS complète : 50+ KPIs automatiques, AI Copilot GPT-4, détection anomalies ML, Score FinSight™, exports PDF/Excel, collaboration temps réel. Démontre capacités techniques pour projets data/finance sur-mesure.                    </div>

                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">                    {/* Mission 3: FinSight (démo capacités) */}

                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">                    <div className="surface rounded-xl p-8 border-2 border-accent-primary md:col-span-2">

                                Next.js 14                        <div className="flex items-start justify-between mb-4">

                            </span>                            <div className="w-12 h-12 rounded-lg bg-accent-primary flex items-center justify-center">

                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">                                <Sparkles className="w-6 h-6 text-white" />

                                TypeScript                            </div>

                            </span>                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">

                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">                                Démo technique

                                FastAPI Python                            </span>

                            </span>                        </div>

                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">                        <h3 className="text-xl font-bold mb-2">FinSight - Plateforme FP&A IA</h3>

                                OpenAI GPT-4                        <p className="text-sm text-tertiary mb-4">

                            </span>                            Projet personnel • Démonstration full-stack + IA

                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">                        </p>

                                ML                        <p className="text-secondary mb-6">

                            </span>                            Plateforme SaaS complète : 50+ KPIs automatiques, AI Copilot GPT-4, détection anomalies ML, Score FinSight™, exports PDF/Excel, collaboration temps réel. Démontre capacités techniques pour projets data/finance sur-mesure.

                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">                        </p>

                                PostgreSQL                        <div className="flex flex-wrap gap-2 mb-6">

                            </span>                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">

                        </div>                                Next.js 14

                        <div className="flex items-center gap-6 text-sm">                            </span>

                            <Link                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">

                                href="/dashboard"                                TypeScript

                                className="inline-flex items-center gap-2 text-accent-primary font-semibold hover:underline"                            </span>

                            >                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">

                                Tester la démo                                FastAPI Python

                                <ArrowRight className="w-4 h-4" />                            </span>

                            </Link>                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">

                            <span className="flex items-center gap-1 text-tertiary">                                OpenAI GPT-4

                                <CheckCircle2 className="w-4 h-4 text-accent-primary" />                            </span>

                                En production                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">

                            </span>                                ML

                        </div>                            </span>

                    </div>                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">

                </div>                                PostgreSQL

            </section>                            </span>

                        </div>

            {/* Expertises Section */}                        <div className="flex items-center gap-6 text-sm">

            <section className="max-w-6xl mx-auto px-6 pb-24">                            <Link

                <div className="text-center mb-12">                                href="/dashboard"

                    <h2 className="text-3xl font-bold mb-4">Domaines d'expertise</h2>                                className="inline-flex items-center gap-2 text-accent-primary font-semibold hover:underline"

                    <p className="text-secondary text-lg">                            >

                        10+ ans d'expérience consultant data finance, spécialisé PME & scale-ups                                Tester la démo

                    </p>                                <ArrowRight className="w-4 h-4" />

                </div>                            </Link>

                            <span className="flex items-center gap-1 text-tertiary">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">                                <CheckCircle2 className="w-4 h-4 text-accent-primary" />

                    <div className="surface rounded-xl p-6">                                En production

                        <Code className="w-10 h-10 text-accent-primary mb-4" />                            </span>

                        <h3 className="font-semibold mb-2">Stack Technique</h3>                        </div>

                        <p className="text-sm text-secondary">                    </div>

                            Python, SQL, Next.js, React, TypeScript, FastAPI, Pandas, NumPy, Plotly, Airflow                </div>

                        </p>            </section>

                    </div>

            {/* Expertises Section */}

                    <div className="surface rounded-xl p-6">            <section className="max-w-6xl mx-auto px-6 pb-24">

                        <Database className="w-10 h-10 text-accent-primary mb-4" />                <div className="text-center mb-12">

                        <h3 className="font-semibold mb-2">Data & BI</h3>                    <h2 className="text-3xl font-bold mb-4">Domaines d'expertise</h2>

                        <p className="text-sm text-secondary">                    <p className="text-secondary text-lg">

                            PostgreSQL, BigQuery, Snowflake, Power BI, Tableau, Metabase, dbt, ETL pipelines                        10+ ans d'expérience consultant data finance, spécialisé PME & scale-ups

                        </p>                    </p>

                    </div>                </div>



                    <div className="surface rounded-xl p-6">                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <TrendingUp className="w-10 h-10 text-accent-primary mb-4" />                    <div className="surface rounded-xl p-6">

                        <h3 className="font-semibold mb-2">Finance & ML</h3>                        <Code className="w-10 h-10 text-accent-primary mb-4" />

                        <p className="text-sm text-secondary">                        <h3 className="font-semibold mb-2">Stack Technique</h3>

                            KPIs financiers (DSO, BFR, ARR, churn), forecasting, modèles prédictifs, OpenAI GPT-4                        <p className="text-sm text-secondary">

                        </p>                            Python, SQL, Next.js, React, TypeScript, FastAPI, Pandas, NumPy, Plotly, Airflow

                    </div>                        </p>

                </div>                    </div>

            </section>

                    <div className="surface rounded-xl p-6">

            {/* Process Section */}                        <Database className="w-10 h-10 text-accent-primary mb-4" />

            <section className="max-w-5xl mx-auto px-6 pb-24">                        <h3 className="font-semibold mb-2">Data & BI</h3>

                <div className="text-center mb-16">                        <p className="text-sm text-secondary">

                    <h2 className="text-4xl font-bold mb-4">Comment ça se passe ?</h2>                            PostgreSQL, BigQuery, Snowflake, Power BI, Tableau, Metabase, dbt, ETL pipelines

                    <p className="text-xl text-secondary">Un process simple et transparent</p>                        </p>

                </div>                    </div>



                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">                    <div className="surface rounded-xl p-6">

                    <div className="text-center">                        <TrendingUp className="w-10 h-10 text-accent-primary mb-4" />

                        <div className="w-16 h-16 rounded-full bg-accent-primary-subtle border-2 border-accent-primary flex items-center justify-center mx-auto mb-4">                        <h3 className="font-semibold mb-2">Finance & ML</h3>

                            <span className="text-2xl font-bold text-accent-primary">1</span>                        <p className="text-sm text-secondary">

                        </div>                            KPIs financiers (DSO, BFR, ARR, churn), forecasting, modèles prédictifs, OpenAI GPT-4

                        <h3 className="font-semibold mb-2">Appel découverte</h3>                        </p>

                        <p className="text-sm text-secondary">                    </div>

                            30 min gratuit pour comprendre vos besoins et enjeux                </div>

                        </p>            </section>

                    </div>

            {/* Process Section */}

                    <div className="text-center">            <section className="max-w-5xl mx-auto px-6 pb-24">

                        <div className="w-16 h-16 rounded-full bg-accent-primary-subtle border-2 border-accent-primary flex items-center justify-center mx-auto mb-4">                <div className="text-center mb-16">

                            <span className="text-2xl font-bold text-accent-primary">2</span>                    <h2 className="text-4xl font-bold mb-4">Comment ça se passe ?</h2>

                        </div>                    <p className="text-xl text-secondary">Un process simple et transparent</p>

                        <h3 className="font-semibold mb-2">Proposition détaillée</h3>                </div>

                        <p className="text-sm text-secondary">

                            Scope précis, livrables, timeline et budget sous 48h                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                        </p>                    <div className="text-center">

                    </div>                        <div className="w-16 h-16 rounded-full bg-accent-primary-subtle border-2 border-accent-primary flex items-center justify-center mx-auto mb-4">

                            <span className="text-2xl font-bold text-accent-primary">1</span>

                    <div className="text-center">                        </div>

                        <div className="w-16 h-16 rounded-full bg-accent-primary-subtle border-2 border-accent-primary flex items-center justify-center mx-auto mb-4">                        <h3 className="font-semibold mb-2">Appel découverte</h3>

                            <span className="text-2xl font-bold text-accent-primary">3</span>                        <p className="text-sm text-secondary">

                        </div>                            30 min gratuit pour comprendre vos besoins et enjeux

                        <h3 className="font-semibold mb-2">Exécution agile</h3>                        </p>

                        <p className="text-sm text-secondary">                    </div>

                            Points hebdo, livraisons incrémentielles, feedback continu

                        </p>                    <div className="text-center">

                    </div>                        <div className="w-16 h-16 rounded-full bg-accent-primary-subtle border-2 border-accent-primary flex items-center justify-center mx-auto mb-4">

                            <span className="text-2xl font-bold text-accent-primary">2</span>

                    <div className="text-center">                        </div>

                        <div className="w-16 h-16 rounded-full bg-accent-primary-subtle border-2 border-accent-primary flex items-center justify-center mx-auto mb-4">                        <h3 className="font-semibold mb-2">Proposition détaillée</h3>

                            <span className="text-2xl font-bold text-accent-primary">4</span>                        <p className="text-sm text-secondary">

                        </div>                            Scope précis, livrables, timeline et budget sous 48h

                        <h3 className="font-semibold mb-2">Formation & Suivi</h3>                        </p>

                        <p className="text-sm text-secondary">                    </div>

                            Transfert de compétences, documentation, support post-projet

                        </p>                    <div className="text-center">

                    </div>                        <div className="w-16 h-16 rounded-full bg-accent-primary-subtle border-2 border-accent-primary flex items-center justify-center mx-auto mb-4">

                </div>                            <span className="text-2xl font-bold text-accent-primary">3</span>

            </section>                        </div>

                        <h3 className="font-semibold mb-2">Exécution agile</h3>

            {/* CTA Final */}                        <p className="text-sm text-secondary">

            <section className="max-w-4xl mx-auto px-6 pb-32">                            Points hebdo, livraisons incrémentielles, feedback continu

                <div className="surface rounded-2xl p-12 text-center border-2 border-accent-primary-border relative overflow-hidden">                        </p>

                    {/* Background gradient */}                    </div>

                    <div className="absolute inset-0 bg-gradient-radial from-accent-primary/10 via-transparent to-transparent opacity-50"></div>

                    <div className="text-center">

                    <div className="relative z-10">                        <div className="w-16 h-16 rounded-full bg-accent-primary-subtle border-2 border-accent-primary flex items-center justify-center mx-auto mb-4">

                        <h2 className="text-4xl font-bold mb-4">Prêt à transformer vos données ?</h2>                            <span className="text-2xl font-bold text-accent-primary">4</span>

                        <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">                        </div>

                            Discutons de votre projet lors d'un appel de 30 minutes (gratuit, sans engagement)                        <h3 className="font-semibold mb-2">Formation & Suivi</h3>

                        </p>                        <p className="text-sm text-secondary">

                            Transfert de compétences, documentation, support post-projet

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">                        </p>

                            <a                    </div>

                                href="https://calendly.com/zineinsight"                </div>

                                target="_blank"            </section>

                                rel="noopener noreferrer"

                                className="inline-flex items-center gap-2 px-10 py-5 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:-translate-y-1"            {/* CTA Final */}

                            >            <section className="max-w-4xl mx-auto px-6 pb-32">

                                Réserver un appel gratuit                <div className="surface rounded-2xl p-12 text-center border-2 border-accent-primary-border relative overflow-hidden">

                                <ArrowRight className="w-5 h-5" />                    {/* Background gradient */}

                            </a>                    <div className="absolute inset-0 bg-gradient-radial from-accent-primary/10 via-transparent to-transparent opacity-50"></div>

                            <a

                                href="mailto:contact@zineinsight.com"                    <div className="relative z-10">

                                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-xl font-semibold text-lg transition-all hover:bg-surface-elevated"                        <h2 className="text-4xl font-bold mb-4">Prêt à transformer vos données ?</h2>

                            >                        <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">

                                <Mail className="w-5 h-5" />                            Discutons de votre projet lors d'un appel de 30 minutes (gratuit, sans engagement)

                                Envoyer un email                        </p>

                            </a>

                        </div>                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

                            <a

                        <p className="text-sm text-tertiary mt-6">                                href="https://calendly.com/zineinsight"

                            Réponse sous 24h • Disponibilité immédiate                                target="_blank"

                        </p>                                rel="noopener noreferrer"

                    </div>                                className="inline-flex items-center gap-2 px-10 py-5 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:-translate-y-1"

                </div>                            >

            </section>                                Réserver un appel gratuit

                                <ArrowRight className="w-5 h-5" />

            <Footer />                            </a>

        </div>                            <a

    )                                href="mailto:contact@zineinsight.com"

}                                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-border-default hover:border-accent-primary-border text-primary rounded-xl font-semibold text-lg transition-all hover:bg-surface-elevated"

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
