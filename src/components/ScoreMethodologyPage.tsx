'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
    TrendingUp,
    DollarSign,
    Shield,
    AlertTriangle,
    CheckCircle2,
    Info,
    Calculator,
    BarChart3,
    ArrowRight,
    Target,
    Layers,
    Eye,
    FileText,
    Lock,
    Sparkles,
    Users
} from 'lucide-react'
import Header from './Header'
import Footer from './Footer'

export default function ScoreMethodologyPage() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-24">
                {/* Background */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/vue-NY.png"
                        alt="Background"
                        fill
                        className="object-cover opacity-15"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                            <Calculator className="w-4 h-4 text-accent-primary" />
                            <span className="text-sm text-white/90 font-medium">
                                Transparence Totale
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Méthodologie du
                            <span className="block text-accent-primary mt-2">
                                Score FinSight™
                            </span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-white font-medium mb-4 max-w-2xl mx-auto leading-relaxed">
                            Le chiffre d'affaires ne dit rien de votre santé financière.
                            <span className="block text-slate-300 mt-2">Le Score FinSight™, si.</span>
                        </p>
                        
                        <p className="text-base text-slate-400 mb-10 max-w-2xl mx-auto">
                            Une méthodologie transparente, auditable et conforme aux principes du PCG 
                            et aux pratiques financières 2025.
                        </p>

                        {/* Score Scale */}
                        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-10">
                            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-2xl sm:text-3xl font-bold text-red-400 mb-1">0-39</div>
                                <div className="text-xs text-slate-400">Critique</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-2xl sm:text-3xl font-bold text-orange-400 mb-1">40-59</div>
                                <div className="text-xs text-slate-400">Fragile</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">60-79</div>
                                <div className="text-xs text-slate-400">Bon</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-2xl sm:text-3xl font-bold text-accent-primary mb-1">80-100</div>
                                <div className="text-xs text-slate-400">Excellent</div>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Link
                                href="/mon-diagnostic"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                            >
                                <Calculator className="w-5 h-5" />
                                Calculer mon Score FinSight™
                            </Link>
                            <a
                                href="https://calendly.com/zineinsight"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                            >
                                <ArrowRight className="w-5 h-5" />
                                Réserver un échange stratégique
                            </a>
                            <span
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-sm text-white/50 font-medium rounded-xl border border-white/10 cursor-default"
                                title="Bientôt disponible"
                            >
                                <FileText className="w-5 h-5" />
                                Exemple de rapport — à venir
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Pillars Overview */}
            <section id="methodology" className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            4 piliers, une vision complète
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
                            Chaque pilier est noté sur 25 points. Ensemble, ils composent 
                            un score global de 0 à 100 qui reflète la santé financière réelle de votre entreprise.
                        </p>
                        
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 border border-slate-200">
                            <Info className="w-4 h-4 text-slate-600" />
                            <p className="text-sm text-slate-700">
                                Le Score FinSight™ n'est pas une note morale. C'est un <span className="font-semibold">instrument d'aide à la décision</span>.
                            </p>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* CASH Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-5">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-xs font-semibold text-accent-primary uppercase tracking-wider mb-2">Pilier 1</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">CASH</h3>
                            <p className="text-slate-500 text-sm mb-4">Trésorerie & Liquidité</p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                <span className="text-slate-500 text-sm">Poids</span>
                                <span className="text-lg font-bold text-slate-900">25 pts</span>
                            </div>
                        </motion.div>

                        {/* MARGIN Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-5">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Pilier 2</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">MARGIN</h3>
                            <p className="text-slate-500 text-sm mb-4">Rentabilité & Croissance</p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                <span className="text-slate-500 text-sm">Poids</span>
                                <span className="text-lg font-bold text-slate-900">25 pts</span>
                            </div>
                        </motion.div>

                        {/* RESILIENCE Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-5">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2">Pilier 3</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">RESILIENCE</h3>
                            <p className="text-slate-500 text-sm mb-4">Stabilité & Diversification</p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                <span className="text-slate-500 text-sm">Poids</span>
                                <span className="text-lg font-bold text-slate-900">25 pts</span>
                            </div>
                        </motion.div>

                        {/* RISK Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-5">
                                <AlertTriangle className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">Pilier 4</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">RISK</h3>
                            <p className="text-slate-500 text-sm mb-4">Anomalies & Volatilité</p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                <span className="text-slate-500 text-sm">Poids</span>
                                <span className="text-lg font-bold text-slate-900">25 pts</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* EXEMPLE CONCRET — Avant / Après */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 mb-6">
                            <Eye className="w-4 h-4 text-accent-primary" />
                            <span className="text-sm text-slate-700 font-medium">Exemple réel</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Ce que le Score révèle en pratique
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Une PME services, 7M€ de CA. Le dirigeant pensait piloter correctement son cash.
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">PME Services · 7M€ CA</p>
                                    <p className="text-slate-900 font-semibold">Diagnostic FinSight™ — Illustration</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
                                        <span className="text-orange-700 font-bold text-xl">58</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-orange-700">Fragile</p>
                                        <p className="text-xs text-slate-500">Score global /100</p>
                                    </div>
                                </div>
                            </div>

                            {/* Piliers */}
                            <div className="grid sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                                {[
                                    { pillar: 'Cash', score: 12, max: 25, label: 'Runway 3 mois', color: 'text-red-600', bg: 'bg-red-50' },
                                    { pillar: 'Marges', score: 15, max: 25, label: 'Marge nette 8%', color: 'text-orange-600', bg: 'bg-orange-50' },
                                    { pillar: 'Résilience', score: 18, max: 25, label: 'Charges fixes 45%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { pillar: 'Risques', score: 13, max: 25, label: '1 client = 38% CA', color: 'text-orange-600', bg: 'bg-orange-50' },
                                ].map((p) => (
                                    <div key={p.pillar} className={`px-6 py-5 ${p.bg}`}>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{p.pillar}</p>
                                        <p className={`text-2xl font-bold ${p.color} mb-1`}>{p.score}<span className="text-sm font-normal text-slate-400">/{p.max}</span></p>
                                        <p className="text-xs text-slate-500">{p.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Plan d'action */}
                            <div className="px-8 py-6 bg-slate-900">
                                <p className="text-xs font-semibold text-accent-primary uppercase tracking-wider mb-4">Plan d&apos;action — 3 leviers prioritaires</p>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    {[
                                        { n: '1', action: 'Réduire le DSO de 10 jours', impact: '+42k€ cash libéré immédiat' },
                                        { n: '2', action: 'Baisser les charges fixes de 5 pts', impact: '+35k€ marge nette annuelle' },
                                        { n: '3', action: 'Sécuriser la trésorerie 90j', impact: 'Runway 6 mois → zone Bon' },
                                    ].map((l) => (
                                        <div key={l.n} className="flex items-start gap-3">
                                            <span className="w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{l.n}</span>
                                            <div>
                                                <p className="text-white text-sm font-medium">{l.action}</p>
                                                <p className="text-slate-400 text-xs mt-0.5">{l.impact}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Disclaimer légal + PCG */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="mt-6 flex flex-col sm:flex-row gap-4"
                        >
                            <div className="flex items-start gap-3 flex-1 bg-white rounded-xl px-5 py-4 border border-slate-200">
                                <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-slate-600">
                                    <span className="font-medium text-slate-800">Ce score ne remplace pas un audit légal.</span>{' '}
                                    Il sert à piloter, anticiper et prioriser — pas à certifier des comptes.
                                </p>
                            </div>
                            <div className="flex items-start gap-3 flex-1 bg-white rounded-xl px-5 py-4 border border-slate-200">
                                <Lock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-slate-600">
                                    Les indicateurs s&apos;appuient sur les ratios usuels de contrôle de gestion et l&apos;analyse financière standard (PCG + bonnes pratiques CFO).
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CASH Section */}
            <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-primary/10 via-transparent to-transparent" />

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                                <DollarSign className="w-4 h-4 text-accent-primary" />
                                <span className="text-sm text-white/90 font-medium">Pilier 1 — 25 points</span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                CASH
                            </h2>
                            <p className="text-xl text-accent-primary font-medium mb-6">
                                Trésorerie & Liquidité
                            </p>

                            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                                Ce pilier évalue votre capacité à faire face à vos obligations financières 
                                à court terme. Il analyse votre runway, votre cash-flow net et vos délais 
                                de paiement clients.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                                    </div>
                                    <p className="text-slate-300">
                                        <span className="text-white font-medium">Runway</span> — Nombre de mois de trésorerie disponible (15 pts max)
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                                    </div>
                                    <p className="text-slate-300">
                                        <span className="text-white font-medium">Cash Flow Net</span> — Entrées moins sorties sur la période (5 pts max)
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                                    </div>
                                    <p className="text-slate-300">
                                        <span className="text-white font-medium">DSO</span> — Délai moyen de paiement clients (5 pts max)
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Scoring Table */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Calculator className="w-5 h-5 text-accent-primary" />
                                    <span className="text-white font-semibold">Barème de notation</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-xs text-emerald-400 font-medium">Confiance: High</span>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Runway */}
                                <div>
                                    <p className="text-white font-medium mb-3">Runway (15 pts max)</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">≥ 12 mois</span>
                                            <span className="text-emerald-400 font-semibold">15 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">6-12 mois</span>
                                            <span className="text-emerald-400 font-semibold">12 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">3-6 mois</span>
                                            <span className="text-orange-400 font-semibold">8 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-slate-300">&lt; 3 mois</span>
                                            <span className="text-red-400 font-semibold">3 pts</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cash Flow */}
                                <div>
                                    <p className="text-white font-medium mb-3">Cash Flow Net (5 pts max)</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">Positif</span>
                                            <span className="text-emerald-400 font-semibold">5 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">Légèrement négatif</span>
                                            <span className="text-orange-400 font-semibold">2 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-slate-300">Très négatif</span>
                                            <span className="text-red-400 font-semibold">0 pt</span>
                                        </div>
                                    </div>
                                </div>

                                {/* DSO */}
                                <div>
                                    <p className="text-white font-medium mb-3">DSO (5 pts max)</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">≤ 30 jours</span>
                                            <span className="text-emerald-400 font-semibold">5 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">30-45 jours</span>
                                            <span className="text-emerald-400 font-semibold">3 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">45-60 jours</span>
                                            <span className="text-orange-400 font-semibold">1 pt</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-slate-300">&gt; 60 jours</span>
                                            <span className="text-red-400 font-semibold">0 pt</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* MARGIN Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Scoring Table - Left */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="order-2 lg:order-1 bg-slate-50 rounded-2xl p-8 border border-slate-200"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Calculator className="w-5 h-5 text-slate-900" />
                                    <span className="text-slate-900 font-semibold">Barème de notation</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-xs text-emerald-700 font-medium">Confiance: High</span>
                                </div>
                            </div>
                            
                            <div className="mb-6 p-3 rounded-lg bg-blue-50 border border-blue-100">
                                <p className="text-xs text-blue-800">
                                    <span className="font-semibold">Seuils adaptatifs :</span> Les barèmes peuvent être ajustés selon votre secteur (SaaS, Commerce, Services, BTP...).
                                </p>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Marge Nette */}
                                <div>
                                    <p className="text-slate-900 font-medium mb-3">Marge Nette (15 pts max)</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-slate-600">≥ 20%</span>
                                            <span className="text-emerald-600 font-semibold">15 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-slate-600">15-20%</span>
                                            <span className="text-emerald-600 font-semibold">12 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-slate-600">10-15%</span>
                                            <span className="text-emerald-600 font-semibold">9 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-slate-600">5-10%</span>
                                            <span className="text-orange-600 font-semibold">5 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-slate-600">0-5%</span>
                                            <span className="text-orange-600 font-semibold">2 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-slate-600">&lt; 0%</span>
                                            <span className="text-red-600 font-semibold">0 pt</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Croissance CA */}
                                <div>
                                    <p className="text-slate-900 font-medium mb-3">Croissance CA (5 pts max)</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-slate-600">≥ 15%</span>
                                            <span className="text-emerald-600 font-semibold">5 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-slate-600">5-15%</span>
                                            <span className="text-emerald-600 font-semibold">3 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-slate-600">0-5%</span>
                                            <span className="text-orange-600 font-semibold">1 pt</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-slate-600">&lt; 0%</span>
                                            <span className="text-red-600 font-semibold">0 pt</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contrôle Charges */}
                                <div>
                                    <p className="text-slate-900 font-medium mb-3">Contrôle des Charges (5 pts max)</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-slate-600">Réduction des charges</span>
                                            <span className="text-emerald-600 font-semibold">5 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-slate-600">Charges &lt; croissance CA</span>
                                            <span className="text-emerald-600 font-semibold">3 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-slate-600">Charges contrôlées</span>
                                            <span className="text-orange-600 font-semibold">1 pt</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-slate-600">Charges &gt;&gt; CA</span>
                                            <span className="text-red-600 font-semibold">0 pt</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Content - Right */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="order-1 lg:order-2"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 mb-6">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm text-slate-700 font-medium">Pilier 2 — 25 points</span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                                MARGIN
                            </h2>
                            <p className="text-xl text-emerald-600 font-medium mb-6">
                                Rentabilité & Croissance
                            </p>

                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Ce pilier mesure votre capacité à générer des profits et à croître 
                                de manière durable. Il analyse votre marge nette, votre croissance 
                                et votre capacité à maîtriser vos coûts.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <p className="text-slate-600">
                                        <span className="text-slate-900 font-medium">Marge Nette</span> — Ratio résultat net / chiffre d'affaires (15 pts max)
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <p className="text-slate-600">
                                        <span className="text-slate-900 font-medium">Croissance CA</span> — Évolution du chiffre d'affaires (5 pts max)
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <p className="text-slate-600">
                                        <span className="text-slate-900 font-medium">Contrôle des Charges</span> — Maîtrise des coûts opérationnels (5 pts max)
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* RESILIENCE Section */}
            <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                                <Shield className="w-4 h-4 text-purple-400" />
                                <span className="text-sm text-white/90 font-medium">Pilier 3 — 25 points</span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                RESILIENCE
                            </h2>
                            <p className="text-xl text-purple-400 font-medium mb-6">
                                Stabilité & Diversification
                            </p>

                            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                                Ce pilier évalue votre capacité à absorber les chocs et à maintenir 
                                votre activité en cas de difficulté. Il analyse vos charges fixes, 
                                votre dépendance client et votre diversification.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <p className="text-slate-300">
                                        <span className="text-white font-medium">Charges Fixes</span> — Ratio charges fixes / CA (10 pts max)
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <p className="text-slate-300">
                                        <span className="text-white font-medium">Dépendance Client</span> — Part du CA du top client (10 pts max)
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <p className="text-slate-300">
                                        <span className="text-white font-medium">Diversité</span> — Nombre de catégories d'activité (5 pts max)
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Scoring Table */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Calculator className="w-5 h-5 text-purple-400" />
                                    <span className="text-white font-semibold">Barème de notation</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-xs text-emerald-400 font-medium">Confiance: High</span>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Charges Fixes */}
                                <div>
                                    <p className="text-white font-medium mb-3">Charges Fixes (10 pts max)</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">≤ 30% du CA</span>
                                            <span className="text-emerald-400 font-semibold">10 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">30-50% du CA</span>
                                            <span className="text-emerald-400 font-semibold">7 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">50-70% du CA</span>
                                            <span className="text-orange-400 font-semibold">4 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-slate-300">&gt; 70% du CA</span>
                                            <span className="text-red-400 font-semibold">1 pt</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dépendance Client */}
                                <div>
                                    <p className="text-white font-medium mb-3">Dépendance Client (10 pts max)</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">≤ 20% du CA</span>
                                            <span className="text-emerald-400 font-semibold">10 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">20-35% du CA</span>
                                            <span className="text-emerald-400 font-semibold">7 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">35-50% du CA</span>
                                            <span className="text-orange-400 font-semibold">4 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-slate-300">&gt; 50% du CA</span>
                                            <span className="text-red-400 font-semibold">1 pt</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Diversité */}
                                <div>
                                    <p className="text-white font-medium mb-3">Diversité Catégories (5 pts max)</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">≥ 8 catégories</span>
                                            <span className="text-emerald-400 font-semibold">5 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">5-7 catégories</span>
                                            <span className="text-emerald-400 font-semibold">3 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-700">
                                            <span className="text-slate-300">3-4 catégories</span>
                                            <span className="text-orange-400 font-semibold">1 pt</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-slate-300">&lt; 3 catégories</span>
                                            <span className="text-red-400 font-semibold">0 pt</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* RISK Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Scoring Table - Left */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="order-2 lg:order-1 bg-slate-50 rounded-2xl p-8 border border-slate-200"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Calculator className="w-5 h-5 text-slate-900" />
                                    <span className="text-slate-900 font-semibold">Barème de notation</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200">
                                    <Eye className="w-3.5 h-3.5 text-orange-600" />
                                    <span className="text-xs text-orange-700 font-medium">Confiance: Medium</span>
                                </div>
                            </div>

                            <div className="bg-orange-50 rounded-xl p-4 mb-6 border border-orange-100">
                                <p className="text-sm text-orange-800">
                                    <span className="font-semibold">Note :</span> Ce pilier fonctionne par déduction. 
                                    On part de 25 points et on retire des points selon les anomalies détectées.
                                </p>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Anomalies Critiques */}
                                <div>
                                    <p className="text-slate-900 font-medium mb-3">Anomalies Critiques (ML)</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-slate-600">Par anomalie critique</span>
                                            <span className="text-red-600 font-semibold">-3 pts</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-slate-600">Maximum</span>
                                            <span className="text-red-600 font-semibold">-10 pts</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Anomalies Totales */}
                                <div>
                                    <p className="text-slate-900 font-medium mb-3">Anomalies Totales</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-slate-600">Par anomalie</span>
                                            <span className="text-orange-600 font-semibold">-0.5 pt</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-slate-600">Maximum</span>
                                            <span className="text-orange-600 font-semibold">-5 pts</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Volatilité */}
                                <div>
                                    <p className="text-slate-900 font-medium mb-3">Volatilité des Flux</p>
                                    <p className="text-xs text-slate-500 mb-3 italic">
                                        (Mesure de la "montagne russe" de votre cash)
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                            <span className="text-slate-600">Coefficient de variation × 10</span>
                                            <span className="text-orange-600 font-semibold">Variable</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-slate-600">Maximum</span>
                                            <span className="text-red-600 font-semibold">-10 pts</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Content - Right */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="order-1 lg:order-2"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 mb-6">
                                <AlertTriangle className="w-4 h-4 text-orange-600" />
                                <span className="text-sm text-slate-700 font-medium">Pilier 4 — 25 points</span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                                RISK
                            </h2>
                            <p className="text-xl text-orange-600 font-medium mb-6">
                                Anomalies & Volatilité
                            </p>

                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Ce pilier identifie les signaux faibles et les risques cachés dans vos données. 
                                Il utilise des algorithmes de Machine Learning pour détecter les anomalies 
                                et mesurer la volatilité de vos flux.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Eye className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <p className="text-slate-600">
                                        <span className="text-slate-900 font-medium">Z-Score</span> — Détecte les montants aberrants
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Layers className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <p className="text-slate-600">
                                        <span className="text-slate-900 font-medium">IQR</span> — Identifie les outliers statistiques
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Target className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <p className="text-slate-600">
                                        <span className="text-slate-900 font-medium">Patterns temporels</span> — Repère les ruptures de tendance
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Questions fréquentes
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Tout ce que vous devez savoir sur le Score FinSight™
                        </p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {/* FAQ Items */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="bg-white rounded-xl p-6 border border-slate-200"
                        >
                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-3">
                                <Info className="w-5 h-5 text-accent-primary flex-shrink-0" />
                                Comment gérez-vous les données manquantes ?
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed pl-8">
                                Nous utilisons un système de confiance à 3 niveaux (<span className="font-semibold text-emerald-600">High</span>, <span className="font-semibold text-orange-600">Medium</span>, <span className="font-semibold text-red-600">Low</span>) 
                                basé sur la qualité et la complétude des données. Le score est toujours affiché avec son niveau 
                                de confiance pour une <span className="font-semibold">transparence totale</span>. Si des données clés manquent, l'impact estimé est quantifié.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="bg-white rounded-xl p-6 border border-slate-200"
                        >
                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-3">
                                <FileText className="w-5 h-5 text-accent-primary flex-shrink-0" />
                                Le score est-il auditable ?
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed pl-8">
                                Oui, 100% transparent. Chaque score inclut la décomposition des 4 piliers, 
                                les KPIs utilisés, les seuils appliqués et le niveau de confiance. Un 
                                expert-comptable peut recalculer manuellement le score.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="bg-white rounded-xl p-6 border border-slate-200"
                        >
                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-3">
                                <BarChart3 className="w-5 h-5 text-accent-primary flex-shrink-0" />
                                Le score est-il comparable entre secteurs ?
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed pl-8">
                                Partiellement. Les seuils sont calibrés pour être universels, mais nous 
                                affichons des benchmarks sectoriels pour contextualiser le score selon 
                                votre industrie (SaaS, Commerce, Services, etc.).
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="bg-white rounded-xl p-6 border border-slate-200"
                        >
                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-3">
                                <Lock className="w-5 h-5 text-accent-primary flex-shrink-0" />
                                Conformité RGPD et sécurité des données ?
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed pl-8">
                                Données 100% chiffrées (AES-256 au repos, TLS 1.3 en transit), hébergées 
                                en Europe. Aucune revente de données à des tiers. Droit à l'oubli garanti.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-primary/20 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                            Besoin d'aide pour piloter votre santé financière ?
                        </h2>
                        <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                            Nos experts finance et nos agents IA vous accompagnent pour transformer 
                            votre Score FinSight™ en plan d'action concret.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/consulting"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                            >
                                <BarChart3 className="w-5 h-5" />
                                Conseil Finance & Pilotage
                            </Link>
                            <Link
                                href="/agents"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                            >
                                Découvrir les agents IA
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <p className="text-slate-400 text-sm mt-8">
                            Diagnostic gratuit 30 min · Sans engagement · Réponse sous 24h
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
        <Footer />
        </>
    )
}
