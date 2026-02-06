'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, ArrowRight, AlertCircle, CheckCircle, CheckCircle2, Zap, Clock, Target, BarChart3, FileText } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BenchmarkBar } from '@/components/BenchmarkBar'
import StructuredData from '@/components/StructuredData'
import { generateHowToJsonLd } from '@/lib/seo'
import { trackCalculatorUse, trackCTAClick } from '@/lib/analytics'

export default function CalculateurDSO() {
    const [creances, setCreances] = useState<string>('')
    const [ca, setCA] = useState<string>('')
    const [dso, setDSO] = useState<number | null>(null)
    const [secteur, setSecteur] = useState<'services' | 'commerce' | 'industrie' | 'saas'>('services')

    // Structured data for SEO
    const structuredData = generateHowToJsonLd({
        name: 'Calculer son DSO (Days Sales Outstanding)',
        description: 'Guide pas à pas pour calculer le délai moyen de paiement clients',
        slug: 'dso',
        steps: [
            {
                name: 'Rassembler les données nécessaires',
                text: 'Récupérez le montant de vos créances clients en attente et votre chiffre d\'affaires annuel'
            },
            {
                name: 'Entrer le montant des créances clients',
                text: 'Saisissez le total des factures non encore encaissées en euros'
            },
            {
                name: 'Entrer le chiffre d\'affaires annuel',
                text: 'Indiquez votre CA sur les 12 derniers mois en euros'
            },
            {
                name: 'Sélectionner votre secteur d\'activité',
                text: 'Choisissez parmi Services, Commerce, Industrie ou SaaS pour obtenir des benchmarks adaptés'
            },
            {
                name: 'Calculer et interpréter le résultat',
                text: 'Le calculateur affiche votre DSO en jours avec une interprétation automatique selon les standards de votre secteur'
            }
        ]
    })

    // FAQ Schema for rich snippets
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Comment calculer le DSO ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Le DSO (Days Sales Outstanding) se calcule avec la formule : DSO = (Créances clients / Chiffre d'affaires annuel) × 365. Ce ratio indique le délai moyen en jours que vos clients prennent pour vous payer."
                }
            },
            {
                "@type": "Question",
                "name": "Qu'est-ce qu'un bon DSO ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Un bon DSO dépend de votre secteur : Services (< 45 jours), Commerce (< 60 jours), Industrie (< 90 jours), SaaS (< 30 jours). Plus le DSO est faible, meilleure est votre trésorerie."
                }
            },
            {
                "@type": "Question",
                "name": "Pourquoi mon DSO est-il important ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Un DSO élevé signifie que votre argent est bloqué chez vos clients. Chaque jour de DSO supplémentaire représente du cash immobilisé qui pourrait servir à payer vos fournisseurs, investir ou assurer votre croissance."
                }
            },
            {
                "@type": "Question",
                "name": "Comment réduire mon DSO ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Pour réduire votre DSO : 1) Facturez rapidement après livraison, 2) Relancez systématiquement avant échéance, 3) Offrez des escomptes pour paiement anticipé, 4) Utilisez l'affacturage pour les gros montants, 5) Automatisez vos relances."
                }
            }
        ]
    }

    const calculer = () => {
        const creancesNum = parseFloat(creances)
        const caNum = parseFloat(ca)

        if (caNum > 0 && creancesNum >= 0) {
            const dsoCalcule = Math.round((creancesNum / caNum) * 365)
            setDSO(dsoCalcule)

            // Track calculator usage
            trackCalculatorUse('DSO', dsoCalcule, {
                creances: creancesNum,
                ca: caNum,
                secteur
            })
        }
    }

    const reset = () => {
        setCreances('')
        setCA('')
        setDSO(null)
    }

    const getInterpretation = (dso: number, secteur: string) => {
        const seuils = {
            services: { excellent: 30, bon: 45, surveiller: 60 },
            commerce: { excellent: 45, bon: 60, surveiller: 75 },
            industrie: { excellent: 60, bon: 90, surveiller: 120 },
            saas: { excellent: 15, bon: 30, surveiller: 45 }
        }

        const s = seuils[secteur as keyof typeof seuils]

        if (dso < s.excellent) {
            return {
                niveau: 'excellent',
                icone: <CheckCircle className="w-6 h-6 text-green-500" />,
                titre: '✅ Excellent',
                couleur: 'text-green-600',
                bgCouleur: 'bg-green-50 border-green-200',
                message: 'Votre DSO est remarquable ! Vos clients paient rapidement, ce qui optimise votre trésorerie.'
            }
        } else if (dso < s.bon) {
            return {
                niveau: 'bon',
                icone: <CheckCircle className="w-6 h-6 text-blue-500" />,
                titre: '✅ Bon',
                couleur: 'text-blue-600',
                bgCouleur: 'bg-blue-50 border-blue-200',
                message: 'Votre DSO est dans la norme du secteur ' + secteur + '. Continuez ce rythme !'
            }
        } else if (dso < s.surveiller) {
            return {
                niveau: 'surveiller',
                icone: <AlertCircle className="w-6 h-6 text-amber-500" />,
                titre: '⚠️ À surveiller',
                couleur: 'text-amber-600',
                bgCouleur: 'bg-amber-50 border-amber-200',
                message: 'Votre DSO commence à être élevé. Il est temps d\'accélérer les relances clients.'
            }
        } else {
            return {
                niveau: 'critique',
                icone: <AlertCircle className="w-6 h-6 text-red-500" />,
                titre: '🚨 Critique',
                couleur: 'text-red-600',
                bgCouleur: 'bg-red-50 border-red-200',
                message: 'Votre DSO est trop élevé ! Cela bloque votre trésorerie et augmente le risque d\'impayés.'
            }
        }
    }

    const interpretation = dso !== null ? getInterpretation(dso, secteur) : null

    return (
        <div className="min-h-screen bg-white">
            <StructuredData data={structuredData} />
            <StructuredData data={faqSchema} />
            <Header />

            <main>
                {/* Hero Section - Style Agents */}
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-20">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src="/images/bureau-nuit.png"
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
                                    Calculateur Gratuit
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Calculateur DSO
                                <span className="block text-accent-primary mt-2">
                                    Days Sales Outstanding
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Calculez votre délai moyen de paiement clients en 30 secondes 
                                et comparez-le aux benchmarks de votre secteur.
                            </p>

                            {/* Stats Row */}
                            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">30s</div>
                                    <div className="text-sm text-slate-400">Calcul instantané</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">4</div>
                                    <div className="text-sm text-slate-400">Secteurs benchmarkés</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">100%</div>
                                    <div className="text-sm text-slate-400">Gratuit</div>
                                </div>
                            </div>

                            {/* CTA Scroll */}
                            <a
                                href="#calculateur"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                            >
                                Calculer mon DSO
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* ========== CONTENU SEO - 800 mots optimisés ========== */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <article className="prose prose-lg max-w-none">
                                {/* H2 - Comment calculer */}
                                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <Calculator className="w-8 h-8 text-accent-primary" />
                                    Comment calculer le DSO (Days Sales Outstanding) ?
                                </h2>
                                
                                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                                    Le <strong>DSO (Days Sales Outstanding)</strong>, ou délai moyen de paiement clients, est un indicateur financier essentiel 
                                    qui mesure le <strong>nombre de jours moyen que vos clients prennent pour régler leurs factures</strong>. 
                                    C&apos;est l&apos;un des KPIs les plus surveillés par les CFO et DAF pour piloter la trésorerie d&apos;une PME.
                                </p>

                                {/* Formule mise en avant */}
                                <div className="not-prose bg-gradient-to-r from-accent-primary/10 to-blue-50 border-l-4 border-accent-primary p-6 rounded-r-xl mb-8">
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">📐 Formule du DSO</h3>
                                    <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
                                        <code className="text-xl font-mono text-accent-primary">
                                            DSO = (Créances clients ÷ Chiffre d&apos;affaires annuel) × 365
                                        </code>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Le résultat s&apos;exprime en <strong>jours</strong>. Plus le DSO est faible, plus vos clients paient rapidement.
                                    </p>
                                </div>

                                {/* Exemple pratique */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Target className="w-6 h-6 text-accent-primary" />
                                    Exemple pratique de calcul DSO
                                </h3>
                                
                                <div className="not-prose bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
                                    <p className="font-semibold text-slate-900 mb-4 text-lg">
                                        🏢 PME Services - 2M€ de chiffre d&apos;affaires annuel
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <p className="text-sm text-slate-500">Créances clients en attente</p>
                                            <p className="text-2xl font-bold text-slate-900">250 000 €</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <p className="text-sm text-slate-500">CA annuel</p>
                                            <p className="text-2xl font-bold text-slate-900">2 000 000 €</p>
                                        </div>
                                    </div>
                                    <div className="bg-accent-primary/10 p-4 rounded-lg">
                                        <p className="text-sm text-slate-600 mb-1">Calcul :</p>
                                        <p className="font-mono text-slate-900">(250 000 ÷ 2 000 000) × 365 = <strong className="text-accent-primary text-xl">45,6 jours</strong></p>
                                    </div>
                                    <p className="mt-4 text-slate-700 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-accent-primary" />
                                        → Vos clients paient en moyenne <strong>46 jours après facturation</strong>.
                                    </p>
                                </div>

                                {/* Tableau benchmarks */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-6 h-6 text-accent-primary" />
                                    Qu&apos;est-ce qu&apos;un bon DSO ? (Benchmarks 2026)
                                </h3>
                                
                                <p className="text-slate-700 mb-4">
                                    Un &quot;bon&quot; DSO dépend fortement de votre <strong>secteur d&apos;activité</strong>. Voici les références françaises actualisées :
                                </p>

                                <div className="not-prose overflow-x-auto mb-8">
                                    <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                                        <thead>
                                            <tr className="bg-slate-900 text-white">
                                                <th className="p-4 text-left font-semibold">Secteur</th>
                                                <th className="p-4 text-center font-semibold">✅ Excellent</th>
                                                <th className="p-4 text-center font-semibold">⚠️ Moyen</th>
                                                <th className="p-4 text-center font-semibold">🚨 Critique</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-slate-200">
                                                <td className="p-4 font-semibold text-slate-900">Services B2B</td>
                                                <td className="p-4 text-center text-green-600 font-semibold">&lt; 30 jours</td>
                                                <td className="p-4 text-center text-amber-600">30-60 jours</td>
                                                <td className="p-4 text-center text-red-600">&gt; 60 jours</td>
                                            </tr>
                                            <tr className="border-b border-slate-200 bg-slate-50">
                                                <td className="p-4 font-semibold text-slate-900">Commerce / Distribution</td>
                                                <td className="p-4 text-center text-green-600 font-semibold">&lt; 45 jours</td>
                                                <td className="p-4 text-center text-amber-600">45-75 jours</td>
                                                <td className="p-4 text-center text-red-600">&gt; 75 jours</td>
                                            </tr>
                                            <tr className="border-b border-slate-200">
                                                <td className="p-4 font-semibold text-slate-900">Industrie / BTP</td>
                                                <td className="p-4 text-center text-green-600 font-semibold">&lt; 60 jours</td>
                                                <td className="p-4 text-center text-amber-600">60-120 jours</td>
                                                <td className="p-4 text-center text-red-600">&gt; 120 jours</td>
                                            </tr>
                                            <tr className="bg-slate-50">
                                                <td className="p-4 font-semibold text-slate-900">SaaS / Tech B2B</td>
                                                <td className="p-4 text-center text-green-600 font-semibold">&lt; 15 jours</td>
                                                <td className="p-4 text-center text-amber-600">15-45 jours</td>
                                                <td className="p-4 text-center text-red-600">&gt; 45 jours</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <p className="text-xs text-slate-500 mt-2 text-right">
                                        Source : Observatoire du BFR, DFCG France - Données 2025/2026
                                    </p>
                                </div>

                                {/* Pourquoi suivre son DSO */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-6 h-6 text-accent-primary" />
                                    Pourquoi suivre son DSO est crucial ?
                                </h3>
                                
                                <p className="text-slate-700 mb-4">
                                    Un DSO élevé signifie que votre argent est <strong>bloqué chez vos clients</strong>. 
                                    Chaque jour de DSO supplémentaire représente du cash immobilisé qui pourrait servir à :
                                </p>

                                <ul className="not-prose grid sm:grid-cols-2 gap-3 mb-6">
                                    {[
                                        'Payer vos fournisseurs (et négocier de meilleures conditions)',
                                        'Investir dans votre croissance (recrutement, marketing)',
                                        'Constituer une trésorerie de sécurité',
                                        'Éviter les financements court-terme coûteux'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Alerte impact chiffré */}
                                <div className="not-prose bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-8">
                                    <p className="font-bold text-red-800 mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" />
                                        Exemple d&apos;impact : PME 5M€ CA
                                    </p>
                                    <p className="text-red-700">
                                        Passer d&apos;un DSO de <strong>60 jours à 45 jours</strong> libère instantanément 
                                        <strong> 205 000€ de trésorerie</strong> (calcul : 15 jours × 5M€ ÷ 365).
                                    </p>
                                </div>

                                {/* Comment réduire */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-accent-primary" />
                                    Comment réduire son DSO rapidement ?
                                </h3>
                                
                                <div className="not-prose grid gap-4 mb-8">
                                    {[
                                        { num: '1', title: 'Facturez immédiatement', desc: 'Envoyez vos factures dès livraison/prestation, pas une semaine après' },
                                        { num: '2', title: 'Conditions claires', desc: 'Affichez "Paiement à 30 jours" sur devis ET factures' },
                                        { num: '3', title: 'Relances automatiques', desc: 'Emails à J-7, J+7, J+15 avec outils comme Pennylane ou Axonaut' },
                                        { num: '4', title: 'Escompte paiement anticipé', desc: '-2% si payé sous 10 jours (très efficace en B2B)' },
                                        { num: '5', title: 'Prélèvement SEPA', desc: 'Idéal pour abonnements et contrats récurrents' },
                                        { num: '6', title: 'Scoring clients', desc: 'Conditions différentes selon historique de paiement' }
                                    ].map((action) => (
                                        <div key={action.num} className="flex items-start gap-4 bg-white p-4 rounded-xl border border-slate-200 hover:border-accent-primary hover:shadow-md transition-all">
                                            <div className="w-10 h-10 rounded-lg bg-accent-primary flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-bold">{action.num}</span>
                                            </div>
                                            <div>
                                                <strong className="text-slate-900">{action.title}</strong>
                                                <p className="text-sm text-slate-600">{action.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA vers consulting */}
                                <div className="not-prose bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-center">
                                    <p className="text-accent-primary font-semibold mb-2">💡 Besoin d&apos;aide pour piloter votre DSO ?</p>
                                    <p className="text-white text-lg mb-6">
                                        En tant que <strong>DAF externalisé</strong>, je vous aide à mettre en place un pilotage de trésorerie 
                                        sur 90 jours avec suivi automatique du DSO et alertes.
                                    </p>
                                    <Link 
                                        href="/consulting" 
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all shadow-lg"
                                    >
                                        Voir mes offres d&apos;accompagnement
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                {/* ========== FIN CONTENU SEO ========== */}

                {/* Calculateur Section */}
                <section id="calculateur" className="py-16 bg-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl"
                            >
                                {/* Formule */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-semibold text-slate-900">Formule DSO</span>
                                    </div>
                                    <code className="text-sm font-mono text-accent-primary">
                                        DSO = (Créances clients / CA annuel) × 365
                                    </code>
                                </div>

                                {/* Inputs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                                            Créances clients (€)
                                        </label>
                                        <input
                                            type="number"
                                            value={creances}
                                            onChange={(e) => setCreances(e.target.value)}
                                            placeholder="150 000"
                                            className="w-full px-4 py-4 border border-slate-200 rounded-xl bg-white focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all text-lg"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">
                                            Montant total des factures non encore encaissées
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                                            Chiffre d&apos;affaires annuel (€)
                                        </label>
                                        <input
                                            type="number"
                                            value={ca}
                                            onChange={(e) => setCA(e.target.value)}
                                            placeholder="1 200 000"
                                            className="w-full px-4 py-4 border border-slate-200 rounded-xl bg-white focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all text-lg"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">
                                            CA sur les 12 derniers mois
                                        </p>
                                    </div>
                                </div>

                                {/* Secteur */}
                                <div className="mb-8">
                                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                                        Secteur d&apos;activité
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {['services', 'commerce', 'industrie', 'saas'].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSecteur(s as typeof secteur)}
                                                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${secteur === s
                                                    ? 'bg-slate-900 text-white shadow-lg'
                                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md'
                                                }`}
                                            >
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={calculer}
                                        disabled={!creances || !ca}
                                        className="flex-1 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-primary/25 hover:shadow-xl hover:shadow-accent-primary/30"
                                    >
                                        Calculer mon DSO
                                    </button>
                                    {dso !== null && (
                                        <button
                                            onClick={reset}
                                            className="px-6 py-4 border-2 border-slate-200 hover:border-slate-300 rounded-xl font-semibold transition-all"
                                        >
                                            Réinitialiser
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Résultat Section */}
                {dso !== null && interpretation && (
                    <section className="py-16 bg-slate-50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-4xl mx-auto space-y-8">
                                {/* Résultat principal */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-10 text-center shadow-2xl"
                                >
                                    <p className="text-slate-400 mb-4 text-lg">Votre DSO</p>
                                    <p className="text-7xl sm:text-8xl font-bold text-white mb-2">
                                        {dso} <span className="text-4xl text-accent-primary">jours</span>
                                    </p>
                                    <p className="text-slate-400 mb-8">
                                        Formule : ({parseFloat(creances).toLocaleString('fr-FR')} / {parseFloat(ca).toLocaleString('fr-FR')}) × 365
                                    </p>

                                    {/* Benchmark */}
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
                                        <p className="text-sm text-slate-300 mb-4">
                                            Comparaison avec le secteur {secteur}
                                        </p>
                                        <BenchmarkBar
                                            kpiName="DSO"
                                            currentValue={dso}
                                            sector={secteur as 'services' | 'commerce' | 'industrie' | 'saas'}
                                            unit="jours"
                                            inverse={true}
                                        />
                                    </div>

                                    {/* Interpretation */}
                                    <div className={`p-6 rounded-xl border-2 ${interpretation.bgCouleur}`}>
                                        <div className="flex items-center justify-center gap-3">
                                            {interpretation.icone}
                                            <h3 className={`text-xl font-bold ${interpretation.couleur}`}>
                                                {interpretation.titre}
                                            </h3>
                                        </div>
                                        <p className="text-slate-600 mt-2 max-w-lg mx-auto">
                                            {interpretation.message}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Actions recommandées */}
                                {interpretation.niveau !== 'excellent' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
                                                <TrendingUp className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900">
                                                Comment améliorer votre DSO ?
                                            </h3>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {[
                                                { title: 'Automatisez vos relances', desc: 'Emails à J+15, J+30 et J+45 automatiques' },
                                                { title: 'Proposez un escompte', desc: '2% de remise pour paiement sous 8 jours' },
                                                { title: 'Facture électronique', desc: 'Obligatoire 2026, accélère le traitement' },
                                                { title: 'Demandez des acomptes', desc: '30-50% à la commande pour les prestations longues' },
                                                { title: 'Prélèvement automatique', desc: 'Idéal pour les abonnements SaaS/services' },
                                            ].map((action, i) => (
                                                <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                                                    <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                                                    </div>
                                                    <div>
                                                        <strong className="text-slate-900">{action.title}</strong>
                                                        <p className="text-sm text-slate-600">{action.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* CTA FinSight - Style Agents */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-10 overflow-hidden"
                                >
                                    {/* Background subtle */}
                                    <div className="absolute inset-0 opacity-10">
                                        <Image
                                            src="/images/bureau.png"
                                            alt=""
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="relative z-10">
                                        {/* Badge */}
                                        <div className="flex justify-center mb-6">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/20 border border-accent-primary/30">
                                                <Zap className="w-4 h-4 text-accent-primary" />
                                                <span className="text-sm text-accent-primary font-medium">
                                                    Automatisez votre suivi
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
                                            Suivez votre DSO automatiquement
                                        </h3>
                                        <p className="text-lg text-slate-300 text-center mb-8 max-w-2xl mx-auto">
                                            FinSight analyse vos exports comptables et calcule votre DSO en temps réel. 
                                            Plus de calculs manuels.
                                        </p>

                                        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
                                            {[
                                                'DSO calculé automatiquement chaque jour',
                                                'Alertes quand le DSO dépasse votre seuil',
                                                'Liste des factures en retard',
                                                'Benchmarks sectoriels inclus'
                                            ].map((feature, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-5 h-5 rounded-full bg-accent-primary/20 flex items-center justify-center">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary" />
                                                    </div>
                                                    <span className="text-slate-300 text-sm">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Link
                                                href="/dashboard"
                                                onClick={() => trackCTAClick('calculateur-dso', '/dashboard', 'essayer-gratuitement')}
                                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                                            >
                                                Essayer gratuitement
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                href="https://calendly.com/zineinsight"
                                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                                            >
                                                Demander une démo
                                            </Link>
                                        </div>

                                        <p className="text-sm text-slate-400 text-center mt-6">
                                            ✅ Sans engagement • ✅ 10 questions IA gratuites • ✅ Dashboard complet
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Section Articles - Style Agents Cards */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                                    En savoir plus sur le DSO
                                </h2>
                                <p className="text-lg text-slate-600">
                                    Guides, benchmarks et stratégies pour optimiser vos encaissements
                                </p>
                            </motion.div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    {
                                        href: '/blog/reduire-dso-50-pourcent-90-jours',
                                        icon: <TrendingUp className="w-6 h-6 text-white" />,
                                        title: 'Réduire son DSO de 50% en 90 jours',
                                        desc: '10 actions concrètes pour accélérer vos encaissements'
                                    },
                                    {
                                        href: '/blog/dso-vs-dpo-optimiser-tresorerie',
                                        icon: <BarChart3 className="w-6 h-6 text-white" />,
                                        title: 'DSO vs DPO : Optimiser votre trésorerie',
                                        desc: 'Comprendre le Cash Conversion Cycle'
                                    },
                                    {
                                        href: '/blog/calcul-dso-formule-2025',
                                        icon: <Calculator className="w-6 h-6 text-white" />,
                                        title: 'Guide complet : Formule DSO',
                                        desc: 'Exemples concrets et benchmarks sectoriels'
                                    },
                                    {
                                        href: '/calculateurs/bfr',
                                        icon: <Target className="w-6 h-6 text-white" />,
                                        title: 'Calculateur BFR gratuit',
                                        desc: 'Impact du DSO sur votre Besoin en Fonds de Roulement'
                                    }
                                ].map((article, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                    >
                                        <Link
                                            href={article.href}
                                            className="group block bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4 group-hover:bg-accent-primary transition-colors duration-300">
                                                {article.icon}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-accent-primary transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-slate-600 text-sm mb-4">
                                                {article.desc}
                                            </p>
                                            <span className="inline-flex items-center text-slate-900 font-semibold group-hover:text-accent-primary transition-colors">
                                                En savoir plus
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Articles connexes - SEO Boost */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    📚 Aller plus loin sur le DSO
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Guides pratiques pour optimiser votre délai de paiement clients
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Article 1 */}
                                <Link
                                    href="/blog/calcul-dso-formule-2025"
                                    className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-accent-primary"
                                >
                                    <div className="flex items-center gap-2 text-sm text-accent-primary font-semibold mb-3">
                                        <FileText className="w-4 h-4" />
                                        Guide
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-accent-primary transition-colors">
                                        Comment calculer son DSO (formule PCG 2025)
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Guide complet avec exemples pratiques et benchmarks sectoriels français
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-accent-primary font-semibold">
                                        Lire l'article
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>

                                {/* Article 2 */}
                                <Link
                                    href="/blog/reduire-dso-50-pourcent-90-jours"
                                    className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-accent-primary"
                                >
                                    <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold mb-3">
                                        <Target className="w-4 h-4" />
                                        Méthode
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-accent-primary transition-colors">
                                        Réduire son DSO de 50% en 90 jours
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        10 actions concrètes pour améliorer votre recouvrement + cas client PME
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-accent-primary font-semibold">
                                        Voir la méthode
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>

                                {/* Article 3 */}
                                <Link
                                    href="/blog/dso-vs-dpo-optimiser-tresorerie"
                                    className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-accent-primary"
                                >
                                    <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold mb-3">
                                        <BarChart3 className="w-4 h-4" />
                                        Analyse
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-accent-primary transition-colors">
                                        DSO vs DPO : Optimiser l'équilibre
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Comprendre le Cash Conversion Cycle pour libérer de la trésorerie
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-accent-primary font-semibold">
                                        Découvrir
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA - Style Agents */}
                <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/vue-NY.png"
                            alt="Background"
                            fill
                            className="object-cover opacity-10"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/90" />
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
                                Prêt à optimiser votre trésorerie ?
                            </h2>
                            <p className="text-lg text-slate-300 mb-8">
                                Découvrez comment FinSight peut automatiser le suivi de votre DSO 
                                et vous aider à libérer de la trésorerie.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                                >
                                    Essayer gratuitement
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="https://calendly.com/zineinsight"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                                >
                                    Réserver une démo
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
