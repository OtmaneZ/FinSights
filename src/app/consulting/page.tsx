'use client'

import Image from 'next/image'
import {
    Check,
    Sparkles,
    Zap,
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    TrendingUp,
    BarChart3,
    Linkedin,
    Mail,
    Clock,
    Target,
    Code,
    Shield
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ConsultingPage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            {/* Hero Section - Accroche dominante */}
            <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
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
                        <span className="text-accent-primary text-sm font-medium">DAF externalisé | Pilotage stratégique data-driven</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-[1.1]">
                        Vous avez du CA. Des ambitions.<br />
                        <span className="text-secondary">Pilotez-vous avec 3 mois d'avance ?</span>
                    </h1>

                    <p className="text-xl md:text-2xl font-semibold text-accent-primary mb-12 max-w-3xl mx-auto">
                        Stabiliser ou accélérer — le pilotage financier fiable transforme l'intuition en décision.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-base transition-all hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <Zap className="w-5 h-5" />
                            Réserver un appel stratégique
                        </a>
                    </div>

                    <p className="text-sm text-tertiary">
                        30 min gratuit • Réponse sous 24h
                    </p>
                </div>
            </section>

            {/* Problem Section - 2 Profils */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Deux profils. Un même besoin : piloter avec clarté.
                    </h2>
                    <p className="text-xl text-secondary max-w-3xl mx-auto">
                        Que vous soyez en mode résolution de problème ou en mode conquête de marché
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* COLONNE GAUCHE : Profil Défensif */}
                    <div className="surface rounded-2xl p-10 border-2 border-red-200 bg-red-50/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Pilotage sous tension</h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-6 italic">
                            Votre pilotage financier manque de visibilité. Vous devez stabiliser, clarifier, anticiper.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <AlertCircle className="w-3 h-3 text-red-600" />
                                </div>
                                <p className="text-base text-gray-700">
                                    <span className="font-semibold">Cash tendu</span> – Vous découvrez vos problèmes de trésorerie trop tard
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <AlertCircle className="w-3 h-3 text-red-600" />
                                </div>
                                <p className="text-base text-gray-700">
                                    <span className="font-semibold">Marges floues</span> – Vous ne savez pas où vous perdez de l'argent
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <AlertCircle className="w-3 h-3 text-red-600" />
                                </div>
                                <p className="text-base text-gray-700">
                                    <span className="font-semibold">Excel manuel</span> – Vous passez des heures sans vision claire
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <AlertCircle className="w-3 h-3 text-red-600" />
                                </div>
                                <p className="text-base text-gray-700">
                                    <span className="font-semibold">Décisions à l'aveugle</span> – Vous prenez des décisions sur des chiffres incomplets
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-red-200">
                            <p className="text-lg font-bold text-red-700 text-center">
                                → Besoin : Stabiliser. Clarifier. Anticiper.
                            </p>
                        </div>
                    </div>

                    {/* COLONNE DROITE : Profil Offensif */}
                    <div className="surface rounded-2xl p-10 border-2 border-green-200 bg-green-50/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Pilotage de croissance</h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-6 italic">
                            Votre activité fonctionne. Vous voulez structurer l’accélération. Gagner en visibilité stratégique. Identifier vos leviers clés.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <TrendingUp className="w-3 h-3 text-green-600" />
                                </div>
                                <p className="text-base text-gray-700">
                                    <span className="font-semibold">Croissance rapide</span> – Vous croissez mais perdez en visibilité stratégique
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <TrendingUp className="w-3 h-3 text-green-600" />
                                </div>
                                <p className="text-base text-gray-700">
                                    <span className="font-semibold">Leviers cachés</span> – Vous voulez identifier vos meilleurs clients, offres, canaux
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <TrendingUp className="w-3 h-3 text-green-600" />
                                </div>
                                <p className="text-base text-gray-700">
                                    <span className="font-semibold">Avantage concurrentiel</span> – Vous voulez dominer votre marché avec la data
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-green-200">
                            <p className="text-lg font-bold text-green-700 text-center">
                                → Besoin : Accélérer. Conquérir. Structurer un avantage durable.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* À propos Section avec Photo */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Qui suis-je</h2>
                </div>

                <div className="surface rounded-2xl p-12 border border-border-subtle">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Photo */}
                        <div className="relative">
                            <div className="aspect-square rounded-2xl overflow-hidden border-4 border-accent-primary-border shadow-2xl">
                                <Image
                                    src="/images/Photo_profil.jpeg"
                                    alt="Otmane Boulahia - Audit Stratégique Data & Finance"
                                    width={500}
                                    height={500}
                                    className="object-cover w-full h-full"
                                    priority
                                />
                            </div>
                            {/* Badge flottant */}
                            <div className="absolute -bottom-4 -right-4 bg-accent-primary text-white px-6 py-3 rounded-xl shadow-lg">
                                <div className="text-sm font-semibold">10+ ans</div>
                                <div className="text-xs opacity-90">Finance d'entreprise</div>
                            </div>
                        </div>

                        {/* Contenu */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-3xl font-bold mb-2">Otmane Boulahia</h3>
                                <p className="text-xl text-accent-primary font-semibold mb-4">
                                    Fondateur ZineInsights • Audit Stratégique Data & Finance
                                </p>
                            </div>

                            <div className="space-y-4 text-secondary leading-relaxed">
                                <p>
                                    10+ ans en finance d'entreprise et enseignement.
                                </p>
                                <p>
                                    Master Finance • Data Analyst • Professeur Sciences Économiques.
                                </p>
                                <p className="font-semibold text-primary">
                                    J'ai créé ZineInsights parce que trop de dirigeants pilotent leur boîte avec des chiffres en retard, incomplets, ou inexploitables.
                                </p>
                                <p>
                                    Ma mission : transformer vos données en décisions stratégiques claires — avec la rigueur d'un cabinet d'audit et la réactivité d'un expert terrain.
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

            {/* Réalisations récentes - Social Proof */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Réalisations récentes</h2>
                    <p className="text-secondary text-lg">
                        Impact concret, résultats mesurables
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Réalisation 1: PowerBI IDM */}
                    <div className="surface rounded-xl p-8 border-2 border-border-default hover:border-accent-primary transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                Livré
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Groupe formation professionnelle</h3>
                        <p className="text-sm text-tertiary mb-4">
                            500M€ CA
                        </p>

                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-xs font-semibold text-red-600 mb-1">❌ PROBLÈME</p>
                                <p className="text-sm text-secondary">
                                    Impossible de savoir quel centre de coût plombait la marge. Données RH et comptables dispersées.
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-blue-600 mb-1">🔧 SOLUTION</p>
                                <p className="text-sm text-secondary">
                                    Dashboard PowerBI multi-sources + analyse rentabilité par centre + ETL automatisé.
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-green-600 mb-1">✅ RÉSULTAT</p>
                                <p className="text-sm font-semibold text-primary">
                                    Identification de 2 budgets inutiles → récupération de trésorerie à court terme
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                Power BI
                            </span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                ETL
                            </span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                Rentabilité analytique
                            </span>
                        </div>

                        {/* Témoignage */}
                        <div className="mt-6 pt-6 border-t border-border-subtle">
                            <p className="text-sm text-secondary italic mb-2">
                                " Le travail mené a permis de mettre en évidence des points que nous n'avions pas identifiés en interne. L'analyse était structurée et les recommandations directement exploitables."
                            </p>
                            <p className="text-xs text-tertiary">
                                — Directeur Financier, Groupe formation professionnelle
                            </p>
                        </div>
                    </div>

                    {/* Réalisation 2: PME BTP/Services - OFFENSIF */}
                    <div className="surface rounded-xl p-8 border-2 border-border-default hover:border-green-300 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                Livré
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">PME BTP/Services en croissance</h3>
                        <p className="text-sm text-tertiary mb-4">
                            7M€ CA • Expansion rapide
                        </p>

                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-xs font-semibold text-orange-600 mb-1">🎯 CONTEXTE</p>
                                <p className="text-sm text-secondary">
                                    Croissance 40%/an mais perte de visibilité : marges par chantier floues, arbitrages difficiles, cash imprévisible.
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-blue-600 mb-1">🔧 SOLUTION</p>
                                <p className="text-sm text-secondary">
                                    Modèle rentabilité analytique par chantier/client + Dashboard temps réel + Prévisions cash 90j.
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-green-600 mb-1">✅ RÉSULTAT</p>
                                <p className="text-sm font-semibold text-primary">
                                    Vision exploitable cash & marges → Arbitrages rapides → Accélération croissance rentable
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                Rentabilité par projet
                            </span>
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                Cash flow prédictif
                            </span>
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                Dashboard temps réel
                            </span>
                        </div>

                        {/* Témoignage */}
                        <div className="mt-6 pt-6 border-t border-border-subtle">
                            <p className="text-sm text-secondary italic mb-2">
                                "Nous avons enfin une vision exploitable de nos chantiers, du cash et des marges, ce qui nous permet d'arbitrer rapidement et d'agir là où c'est nécessaire."
                            </p>
                            <p className="text-xs text-tertiary">
                                — Dirigeant, PME BTP/Services
                            </p>
                        </div>
                    </div>

                    {/* Réalisation 3: CFO PME Services/Conseil - AUTOMATISATION */}
                    <div className="surface rounded-xl p-8 border-2 border-border-default hover:border-purple-300 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                Livré
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">PME Services / Conseil</h3>
                        <p className="text-sm text-tertiary mb-4">
                            CFO • Structuration pilotage
                        </p>

                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-xs font-semibold text-red-600 mb-1">❌ PROBLÈME</p>
                                <p className="text-sm text-secondary">
                                    Dépendance totale à retraitements Excel manuels. Indicateurs non fiables pour comités de direction.
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-blue-600 mb-1">🔧 SOLUTION</p>
                                <p className="text-sm text-secondary">
                                    Cadre de pilotage robuste + Automatisation complète + KPIs exploitables temps réel.
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-green-600 mb-1">✅ RÉSULTAT</p>
                                <p className="text-sm font-semibold text-primary">
                                    Pilotage fiable sans retraitements manuels → Indicateurs exploitables en comité de direction
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                Automatisation
                            </span>
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                KPIs stratégiques
                            </span>
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                Dashboards CFO
                            </span>
                        </div>

                        {/* Témoignage */}
                        <div className="mt-6 pt-6 border-t border-border-subtle">
                            <p className="text-sm text-secondary italic mb-2">
                                "Le travail réalisé a permis de structurer un cadre de pilotage robuste et automatisé, sans dépendre de retraitements manuels, avec des indicateurs exploitables en comité de direction."
                            </p>
                            <p className="text-xs text-tertiary">
                                — CFO, PME Services / Conseil
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="max-w-5xl mx-auto px-6 pb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        FinSight, c'est l'audit stratégique data & finance<br />
                        <span className="text-accent-primary">qui transforme vos données en avantage concurrentiel.</span>
                    </h2>
                    <p className="text-xl text-secondary max-w-3xl mx-auto mb-8">
                        Nous ne faisons pas de dashboards "jolis".<br />
                        Nous construisons le système de pilotage qui vous permet de :
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Défensif */}
                    <div className="surface rounded-xl p-6 border border-border-subtle hover:border-red-300 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-red-600" />
                            </div>
                            <p className="text-lg font-semibold">Stabiliser & Sécuriser</p>
                        </div>
                        <p className="text-secondary">Anticiper vos problèmes de trésorerie 3 mois à l'avance, identifier les fuites de cash</p>
                    </div>

                    {/* Offensif */}
                    <div className="surface rounded-xl p-6 border border-border-subtle hover:border-green-300 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-lg font-semibold">Accélérer & Conquérir</p>
                        </div>
                        <p className="text-secondary">Identifier vos leviers de croissance, optimiser vos marges, dominer votre marché</p>
                    </div>

                    {/* Stratégique */}
                    <div className="surface rounded-xl p-6 border border-border-subtle hover:border-blue-300 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Target className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-lg font-semibold">Préparer & Structurer</p>
                        </div>
                        <p className="text-secondary">Levée de fonds, acquisition, expansion : chiffres béton et modèles fiables</p>
                    </div>

                    {/* Opérationnel */}
                    <div className="surface rounded-xl p-6 border border-border-subtle hover:border-purple-300 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-purple-600" />
                            </div>
                            <p className="text-lg font-semibold">Automatiser & Gagner du temps</p>
                        </div>
                        <p className="text-secondary">Arrêter Excel manuel, dashboards temps réel, alertes intelligentes</p>
                    </div>
                </div>
            </section>

            {/* Offres Section - 3 packages hiérarchisés */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-primary">3 formules d'accompagnement</h2>
                    <p className="text-xl text-secondary max-w-2xl mx-auto">
                        Hiérarchie claire, pricing progressif
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Offre 1: Diagnostic FinSight™ Stratégique */}
                    <div className="surface rounded-2xl p-6 border border-border-subtle hover:border-accent-primary-border transition-all flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold leading-tight">Diagnostic FinSight™ Stratégique</h3>
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-bold text-blue-600">1 490€</span>
                            </div>
                            <p className="text-secondary text-xs">Livrable en 3-5 jours</p>
                        </div>

                        <p className="text-xs text-secondary mb-4 italic">
                            "Votre santé financière analysée par un expert finance en 5 jours."
                        </p>

                        <ul className="space-y-2 mb-6 flex-grow">
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary">Connexion sécurisée à vos données (compta, banque, ERP)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary"><span className="font-semibold">Analyse complète + validation expert</span> : Cash flow, Rentabilité, Risques</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary">Rapport PDF "Diagnostic FinSight™" (12-15 pages)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary">1h de restitution en visio avec plan d'action immédiat</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary"><span className="font-semibold">3 Quick Wins chiffrés</span> (gains potentiels à 30 jours)</span>
                            </li>
                        </ul>

                        <div className="mt-auto">
                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full px-4 py-2.5 border-2 border-blue-600 hover:bg-blue-50 text-blue-600 rounded-lg font-semibold text-sm text-center transition-all"
                            >
                                Lancer le diagnostic
                            </a>
                            
                            {/* Idéal pour */}
                            <div className="mt-3 p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                                <p className="text-xs font-bold text-blue-900 mb-1.5">✅ IDÉAL POUR :</p>
                                <ul className="space-y-0.5 text-xs text-gray-700">
                                    <li>• Valider une intuition stratégique</li>
                                    <li>• Identifier 3 quick wins immédiats</li>
                                    <li>• Préparer une levée avec chiffres fiables</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Offre 2: Audit FinSight™ Complet - RECOMMANDÉ */}
                    <div className="surface rounded-2xl p-6 border-2 border-accent-primary relative overflow-hidden flex flex-col shadow-xl">
                        {/* Badge "Recommandé" */}
                        <div className="absolute top-0 right-0 bg-accent-primary text-white px-3 py-0.5 text-xs font-semibold rounded-bl-lg">
                            ⭐ Recommandé
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold leading-tight">Audit FinSight™ Complet</h3>
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-4xl font-bold text-accent-primary">4 990€</span>
                            </div>
                            <p className="text-secondary text-xs">Livrable en 10-15 jours</p>
                        </div>

                        <p className="text-xs text-secondary mb-4 italic">
                            "La feuille de route précise pour débloquer votre rentabilité."
                        </p>

                        <ul className="space-y-2 mb-6 flex-grow">
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary font-semibold">Tout le Diagnostic FinSight™ +</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary">Immersion dans vos processus financiers (Facturation, Recouvrement, Achats, Paie)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary">Nettoyage et structuration de vos données historiques (12-24 mois)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary"><span className="font-semibold">Modèle de Rentabilité Analytique</span> : par client, par offre/produit, par canal</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary">Dashboards automatisés (Power BI ou Tableau) : P&L, Trésorerie 90j, KPIs commerciaux</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary">Plan d'action stratégique chiffré (Gains à 3/6 mois, priorisés)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary">1 session de formation (2h) + 1 mois de support</span>
                            </li>
                        </ul>

                        <div className="mt-auto">
                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full px-4 py-2.5 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-sm text-center transition-all hover:shadow-xl"
                            >
                                Réserver un audit
                            </a>
                            
                            {/* Idéal pour */}
                            <div className="mt-3 p-3 bg-accent-primary/10 border border-accent-primary/30 rounded-lg">
                                <p className="text-xs font-bold text-accent-primary mb-1.5">🎯 IDÉAL POUR :</p>
                                <ul className="space-y-0.5 text-xs text-gray-700">
                                    <li>• PME ambitieuses structurant leur croissance</li>
                                    <li>• Dirigeants cherchant avantage concurrentiel</li>
                                    <li>• Process financiers à organiser/automatiser</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Offre 3: FinSight™ Decision System */}
                    <div className="surface rounded-2xl p-6 border border-border-subtle hover:border-accent-primary-border transition-all flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-accent-primary-subtle border border-accent-primary-border flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-accent-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold leading-tight">FinSight™ Decision System</h3>
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-4xl font-bold text-accent-primary">9 990€</span>
                            </div>
                            <p className="text-secondary text-xs">Livrable en 3-4 semaines</p>
                        </div>

                        <p className="text-xs text-secondary mb-4 italic">
                            "Votre cockpit financier automatisé et intelligent, clé en main."
                        </p>

                        <ul className="space-y-2 mb-6 flex-grow">
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary font-semibold">Tout l'Audit FinSight™ Complet +</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary">Infrastructure Data Finance complète : Connexion automatisée toutes sources + ETL automatisé</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary">Dashboards Avancés : P&L temps réel, Trésorerie 6 mois, Suivi commercial, Suivi RH</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary"><span className="font-semibold">IA FinSight™ (Chatbot CFO sur vos données)</span> :</span>
                            </li>
                            <li className="flex items-start gap-2 ml-6">
                                <span className="text-xs text-secondary">• Posez des questions en langage naturel ("Quel client me coûte le plus cher ?")</span>
                            </li>
                            <li className="flex items-start gap-2 ml-6">
                                <span className="text-xs text-secondary">• Détection automatique d'anomalies (retard paiement, dérive marge)</span>
                            </li>
                            <li className="flex items-start gap-2 ml-6">
                                <span className="text-xs text-secondary">• Alertes intelligentes (seuil trésorerie, concentration client)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary">Formation complète équipe (2 sessions de 2h)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-secondary">3 mois de support premium (ajustements illimités, réponse sous 48h, point mensuel)</span>
                            </li>
                        </ul>

                        <div className="mt-auto">
                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full px-4 py-2.5 border-2 border-accent-primary-border hover:bg-accent-primary-subtle text-accent-primary rounded-lg font-semibold text-sm text-center transition-all"
                            >
                                Planifier un appel
                            </a>
                            
                            {/* Idéal pour */}
                            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                <p className="text-xs font-bold text-purple-900 mb-1.5">🚀 IDÉAL POUR :</p>
                                <ul className="space-y-0.5 text-xs text-gray-700">
                                    <li>• Scale-ups voulant automatiser leur DAF</li>
                                    <li>• Dirigeants dominant leur marché avec la data</li>
                                    <li>• Expansion (acquisition, internationalisation)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stack technique - Section discrète en bas */}
            <section className="max-w-4xl mx-auto px-6 pb-24">
                <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold mb-2 text-secondary">Stack technique</h3>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    <span className="px-4 py-2 surface border border-border-subtle rounded-lg text-sm text-secondary">
                        Python
                    </span>
                    <span className="px-4 py-2 surface border border-border-subtle rounded-lg text-sm text-secondary">
                        SQL
                    </span>
                    <span className="px-4 py-2 surface border border-border-subtle rounded-lg text-sm text-secondary">
                        Power BI
                    </span>
                    <span className="px-4 py-2 surface border border-border-subtle rounded-lg text-sm text-secondary">
                        Tableau
                    </span>
                    <span className="px-4 py-2 surface border border-border-subtle rounded-lg text-sm text-secondary">
                        Next.js
                    </span>
                    <span className="px-4 py-2 surface border border-border-subtle rounded-lg text-sm text-secondary">
                        React
                    </span>
                    <span className="px-4 py-2 surface border border-border-subtle rounded-lg text-sm text-secondary">
                        TypeScript
                    </span>
                    <span className="px-4 py-2 surface border border-border-subtle rounded-lg text-sm text-secondary">
                        FastAPI
                    </span>
                    <span className="px-4 py-2 surface border border-border-subtle rounded-lg text-sm text-secondary">
                        PostgreSQL
                    </span>
                    <span className="px-4 py-2 surface border border-border-subtle rounded-lg text-sm text-secondary">
                        OpenAI GPT-4
                    </span>
                    <span className="px-4 py-2 surface border border-border-subtle rounded-lg text-sm text-secondary">
                        Pandas
                    </span>
                    <span className="px-4 py-2 surface border border-border-subtle rounded-lg text-sm text-secondary">
                        ETL
                    </span>
                </div>
            </section>

            {/* CTA Final */}
            <section className="max-w-4xl mx-auto px-6 pb-32">
                <div className="surface rounded-2xl p-12 text-center border-2 border-accent-primary-border relative overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-radial from-accent-primary/10 via-transparent to-transparent opacity-50"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-4">Prêt à prendre le contrôle de votre pilotage financier ?</h2>
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
                                Réserver un appel stratégique
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:otmane@zineinsight.com"
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
