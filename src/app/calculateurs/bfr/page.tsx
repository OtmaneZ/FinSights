'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, ArrowRight, AlertCircle, CheckCircle, CheckCircle2, Zap, Info, Target, BarChart3, Package, Users, CreditCard } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { generateHowToJsonLd } from '@/lib/seo'
import { trackCalculatorUse, trackCTAClick } from '@/lib/analytics'

export default function CalculateurBFR() {
    const [stocks, setStocks] = useState<string>('')
    const [creances, setCreances] = useState<string>('')
    const [dettes, setDettes] = useState<string>('')
    const [ca, setCA] = useState<string>('')
    const [bfr, setBFR] = useState<number | null>(null)
    const [joursCA, setJoursCA] = useState<number | null>(null)

    // Structured data for SEO
    const structuredData = generateHowToJsonLd({
        name: 'Calculer son BFR (Besoin en Fonds de Roulement)',
        description: 'Guide pas à pas pour calculer le besoin en fonds de roulement et optimiser sa trésorerie',
        slug: 'bfr',
        steps: [
            {
                name: 'Identifier vos stocks',
                text: 'Calculez la valeur totale de vos stocks (matières premières, produits finis, marchandises)'
            },
            {
                name: 'Calculer vos créances clients',
                text: 'Additionnez toutes les factures émises non encore encaissées'
            },
            {
                name: 'Évaluer vos dettes fournisseurs',
                text: 'Totalisez les factures fournisseurs non encore réglées'
            },
            {
                name: 'Appliquer la formule BFR',
                text: 'BFR = Stocks + Créances clients - Dettes fournisseurs'
            },
            {
                name: 'Analyser le résultat',
                text: 'Un BFR négatif est excellent (vos fournisseurs financent votre activité). Un BFR positif doit être financé.'
            }
        ]
    })

    const calculer = () => {
        const stocksNum = parseFloat(stocks) || 0
        const creancesNum = parseFloat(creances) || 0
        const dettesNum = parseFloat(dettes) || 0
        const caNum = parseFloat(ca) || 0

        const bfrCalcule = stocksNum + creancesNum - dettesNum
        setBFR(bfrCalcule)

        if (caNum > 0) {
            const jours = Math.round((bfrCalcule / caNum) * 365)
            setJoursCA(jours)
        } else {
            setJoursCA(null)
        }

        // Track calculator usage
        trackCalculatorUse('BFR', bfrCalcule, {
            stocks: stocksNum,
            creances: creancesNum,
            dettes: dettesNum,
            ca: caNum,
            joursCA: joursCA || 0
        })
    }

    const reset = () => {
        setStocks('')
        setCreances('')
        setDettes('')
        setCA('')
        setBFR(null)
        setJoursCA(null)
    }

    const getInterpretation = (bfr: number, jours: number | null) => {
        if (bfr < 0) {
            return {
                niveau: 'excellent',
                icone: <CheckCircle className="w-6 h-6 text-green-500" />,
                titre: '✅ Excellent - BFR négatif',
                couleur: 'text-green-600',
                bgCouleur: 'bg-green-50 border-green-200',
                message: 'Situation idéale ! Vos fournisseurs financent votre activité. Vous encaissez avant de payer.'
            }
        }

        if (!jours) {
            return {
                niveau: 'info',
                icone: <Info className="w-6 h-6 text-blue-500" />,
                titre: 'ℹ️ BFR positif',
                couleur: 'text-blue-600',
                bgCouleur: 'bg-blue-50 border-blue-200',
                message: 'Vous devez financer votre cycle d\'exploitation. Renseignez votre CA pour une analyse complète.'
            }
        }

        if (jours < 30) {
            return {
                niveau: 'bon',
                icone: <CheckCircle className="w-6 h-6 text-blue-500" />,
                titre: '✅ Bon - BFR maîtrisé',
                couleur: 'text-blue-600',
                bgCouleur: 'bg-blue-50 border-blue-200',
                message: 'Votre BFR représente moins d\'un mois de CA. C\'est une bonne gestion du cycle d\'exploitation.'
            }
        } else if (jours < 60) {
            return {
                niveau: 'surveiller',
                icone: <AlertCircle className="w-6 h-6 text-amber-500" />,
                titre: '⚠️ À surveiller',
                couleur: 'text-amber-600',
                bgCouleur: 'bg-amber-50 border-amber-200',
                message: 'Votre BFR représente ' + jours + ' jours de CA. Optimisez vos délais de paiement clients et fournisseurs.'
            }
        } else if (jours < 90) {
            return {
                niveau: 'attention',
                icone: <AlertCircle className="w-6 h-6 text-orange-500" />,
                titre: '⚠️ Attention',
                couleur: 'text-orange-600',
                bgCouleur: 'bg-orange-50 border-orange-200',
                message: 'Votre BFR est élevé (' + jours + ' jours de CA). Il mobilise beaucoup de trésorerie.'
            }
        } else {
            return {
                niveau: 'critique',
                icone: <AlertCircle className="w-6 h-6 text-red-500" />,
                titre: '🚨 Critique',
                couleur: 'text-red-600',
                bgCouleur: 'bg-red-50 border-red-200',
                message: 'Votre BFR est très élevé (' + jours + ' jours de CA) ! Action urgente requise pour libérer de la trésorerie.'
            }
        }
    }

    const interpretation = bfr !== null ? getInterpretation(bfr, joursCA) : null

    // FAQ Schema for rich snippets
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Comment calculer le Besoin en Fonds de Roulement (BFR) ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Le BFR se calcule avec la formule suivante : (Stocks + Créances Clients) - Dettes Fournisseurs. Il représente le montant des ressources financières qu'une entreprise doit mobiliser pour couvrir les décalages de flux de trésorerie entre ses dépenses et ses encaissements."
                }
            },
            {
                "@type": "Question",
                "name": "Pourquoi un BFR élevé est-il risqué pour une PME ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Un BFR élevé signifie qu'une part importante de votre trésorerie est immobilisée dans vos stocks ou vos factures non payées. Cela réduit votre cash disponible pour investir ou recruter, et augmente le risque de crise de liquidité si votre croissance s'accélère trop vite."
                }
            },
            {
                "@type": "Question",
                "name": "Qu'est-ce qu'un BFR négatif ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Un BFR négatif signifie que votre entreprise génère une ressource de trésorerie : vos fournisseurs vous financent car vous encaissez vos clients avant de payer vos dettes. C'est le modèle type de la grande distribution ou du SaaS (paiements annuels d'avance)."
                }
            }
        ]
    }

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
                                    Simulateur Gratuit
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Simulateur BFR
                                <span className="block text-accent-primary mt-2">
                                    Besoin en Fonds de Roulement
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Calculez votre BFR en 1 minute et identifiez vos leviers 
                                d&apos;optimisation de trésorerie.
                            </p>

                            {/* Stats Row */}
                            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">1 min</div>
                                    <div className="text-sm text-slate-400">Calcul complet</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">3</div>
                                    <div className="text-sm text-slate-400">Composantes analysées</div>
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
                                Calculer mon BFR
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
                                    Comment calculer le BFR (Besoin en Fonds de Roulement) ?
                                </h2>
                                
                                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                                    Le <strong>BFR (Besoin en Fonds de Roulement)</strong> représente le <strong>montant d&apos;argent nécessaire pour financer votre cycle d&apos;exploitation</strong>. 
                                    C&apos;est un indicateur clé de la santé financière de votre PME. Un BFR élevé signifie que vous devez mobiliser beaucoup de cash pour faire tourner l&apos;entreprise.
                                </p>

                                {/* Formule mise en avant */}
                                <div className="not-prose bg-gradient-to-r from-accent-primary/10 to-blue-50 border-l-4 border-accent-primary p-6 rounded-r-xl mb-8">
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">📐 Formule du BFR</h3>
                                    <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
                                        <code className="text-xl font-mono text-accent-primary">
                                            BFR = Stocks + Créances clients − Dettes fournisseurs
                                        </code>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Un <strong>BFR négatif</strong> est excellent (vos fournisseurs financent votre activité). 
                                        Un <strong>BFR positif</strong> doit être financé par vos fonds propres ou crédit bancaire.
                                    </p>
                                </div>

                                {/* Exemple pratique */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Target className="w-6 h-6 text-accent-primary" />
                                    Exemple pratique de calcul BFR
                                </h3>
                                
                                <div className="not-prose bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
                                    <p className="font-semibold text-slate-900 mb-4 text-lg">
                                        🏢 PME Commerce - 3M€ de chiffre d&apos;affaires annuel
                                    </p>
                                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <p className="text-sm text-slate-500">Stocks</p>
                                            <p className="text-2xl font-bold text-blue-600">120 000 €</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <p className="text-sm text-slate-500">Créances clients</p>
                                            <p className="text-2xl font-bold text-green-600">250 000 €</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <p className="text-sm text-slate-500">Dettes fournisseurs</p>
                                            <p className="text-2xl font-bold text-red-600">180 000 €</p>
                                        </div>
                                    </div>
                                    <div className="bg-accent-primary/10 p-4 rounded-lg">
                                        <p className="text-sm text-slate-600 mb-1">Calcul :</p>
                                        <p className="font-mono text-slate-900">120 000 + 250 000 − 180 000 = <strong className="text-accent-primary text-xl">190 000 €</strong></p>
                                    </div>
                                    <p className="mt-4 text-slate-700 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-orange-500" />
                                        → Vous devez <strong>financer 190 000€</strong> pour faire tourner l&apos;entreprise (stocks + créances en attente − crédit fournisseurs).
                                    </p>
                                </div>

                                {/* Interprétation BFR */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-6 h-6 text-accent-primary" />
                                    Comment interpréter le BFR ?
                                </h3>
                                
                                <div className="not-prose grid md:grid-cols-2 gap-4 mb-8">
                                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                            <h4 className="text-xl font-bold text-green-800">BFR Négatif = Excellent</h4>
                                        </div>
                                        <p className="text-green-700 mb-3">
                                            Situation idéale : vous encaissez vos clients <strong>avant</strong> de payer vos fournisseurs.
                                        </p>
                                        <p className="text-sm text-green-600 font-semibold">
                                            Exemples : Grande distribution, SaaS avec paiement annuel d&apos;avance
                                        </p>
                                    </div>
                                    
                                    <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <AlertCircle className="w-6 h-6 text-orange-600" />
                                            <h4 className="text-xl font-bold text-orange-800">BFR Positif = À surveiller</h4>
                                        </div>
                                        <p className="text-orange-700 mb-3">
                                            Vous devez <strong>avancer du cash</strong> pour financer votre activité (stocks + délais de paiement).
                                        </p>
                                        <p className="text-sm text-orange-600 font-semibold">
                                            Exemples : Commerce, Industrie, Services B2B
                                        </p>
                                    </div>
                                </div>

                                {/* Tableau benchmarks */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                    Benchmarks BFR par secteur (en jours de CA)
                                </h3>
                                
                                <div className="not-prose overflow-x-auto mb-8">
                                    <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                                        <thead>
                                            <tr className="bg-slate-900 text-white">
                                                <th className="p-4 text-left font-semibold">Secteur</th>
                                                <th className="p-4 text-center font-semibold">BFR Optimal</th>
                                                <th className="p-4 text-center font-semibold">BFR Moyen</th>
                                                <th className="p-4 text-center font-semibold">BFR Critique</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-slate-200">
                                                <td className="p-4 font-semibold text-slate-900">Services B2B</td>
                                                <td className="p-4 text-center text-green-600 font-semibold">&lt; 30 jours</td>
                                                <td className="p-4 text-center text-amber-600">30-60 jours</td>
                                                <td className="p-4 text-center text-red-600">&gt; 90 jours</td>
                                            </tr>
                                            <tr className="border-b border-slate-200 bg-slate-50">
                                                <td className="p-4 font-semibold text-slate-900">Commerce / Distribution</td>
                                                <td className="p-4 text-center text-green-600 font-semibold">&lt; 45 jours</td>
                                                <td className="p-4 text-center text-amber-600">45-90 jours</td>
                                                <td className="p-4 text-center text-red-600">&gt; 120 jours</td>
                                            </tr>
                                            <tr className="border-b border-slate-200">
                                                <td className="p-4 font-semibold text-slate-900">Industrie / BTP</td>
                                                <td className="p-4 text-center text-green-600 font-semibold">&lt; 60 jours</td>
                                                <td className="p-4 text-center text-amber-600">60-120 jours</td>
                                                <td className="p-4 text-center text-red-600">&gt; 150 jours</td>
                                            </tr>
                                            <tr className="bg-slate-50">
                                                <td className="p-4 font-semibold text-slate-900">SaaS / Tech B2B</td>
                                                <td className="p-4 text-center text-green-600 font-semibold">Négatif</td>
                                                <td className="p-4 text-center text-amber-600">0-30 jours</td>
                                                <td className="p-4 text-center text-red-600">&gt; 60 jours</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <p className="text-xs text-slate-500 mt-2 text-right">
                                        Source : Banque de France, moyennes sectorielles 2025
                                    </p>
                                </div>

                                {/* Pourquoi c'est critique */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-6 h-6 text-accent-primary" />
                                    Pourquoi le BFR est-il si important ?
                                </h3>
                                
                                <p className="text-slate-700 mb-4">
                                    Un BFR mal maîtrisé est la <strong>cause n°1 des défaillances d&apos;entreprises</strong>. 
                                    Vous pouvez être rentable sur le papier mais tomber en cessation de paiement si votre BFR explose.
                                </p>

                                <ul className="not-prose grid sm:grid-cols-2 gap-3 mb-6">
                                    {[
                                        'Croissance rapide = BFR qui explose (vous devez financer plus de stocks + créances)',
                                        'Délais de paiement longs = cash bloqué chez les clients',
                                        'Stocks qui traînent = argent immobilisé inutilement',
                                        'Fournisseurs mal négociés = vous payez trop vite'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg">
                                            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Impact chiffré */}
                                <div className="not-prose bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-8">
                                    <p className="font-bold text-red-800 mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" />
                                        Exemple d&apos;impact : Croissance 50% en 1 an
                                    </p>
                                    <p className="text-red-700">
                                        PME 2M€ CA → 3M€ CA : Le BFR passe de 150k€ à 225k€ soit <strong>75k€ de cash supplémentaire</strong> à financer immédiatement.
                                        Sans préparation, c&apos;est la rupture de trésorerie assurée.
                                    </p>
                                </div>

                                {/* Comment réduire */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-accent-primary" />
                                    6 leviers pour réduire votre BFR
                                </h3>
                                
                                <div className="not-prose grid gap-4 mb-8">
                                    {[
                                        { num: '1', title: 'Réduire le DSO (délai paiement clients)', desc: 'Relances automatiques, escompte 2% si paiement J+10, affacturage ponctuel' },
                                        { num: '2', title: 'Augmenter le DPO (délai paiement fournisseurs)', desc: 'Négocier 60 jours au lieu de 30, grouper les commandes pour obtenir crédit' },
                                        { num: '3', title: 'Optimiser les stocks', desc: 'Just-in-time si possible, vendre les stocks dormants, suivre rotation des stocks' },
                                        { num: '4', title: 'Demander des acomptes', desc: '30-50% à la commande pour les projets longs ou gros montants' },
                                        { num: '5', title: 'Piloter en temps réel', desc: 'Dashboard BFR mis à jour chaque semaine, alertes automatiques si dérapage' },
                                        { num: '6', title: 'Financement adapté', desc: 'Ligne de crédit BFR bancaire ou affacturage pour absorber les variations' }
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
                                    <p className="text-accent-primary font-semibold mb-2">💡 BFR qui explose avec votre croissance ?</p>
                                    <p className="text-white text-lg mb-6">
                                        En tant que <strong>DAF externalisé</strong>, je vous aide à structurer le pilotage de votre BFR 
                                        avec prévisionnel 90 jours et alertes automatiques.
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
                                className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-xl"
                            >
                                {/* Formule */}
                                <div className="bg-white p-4 rounded-xl border border-slate-200 mb-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-semibold text-slate-900">Formule BFR</span>
                                    </div>
                                    <code className="text-sm font-mono text-accent-primary">
                                        BFR = Stocks + Créances clients - Dettes fournisseurs
                                    </code>
                                </div>

                                {/* Inputs */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                                            <Package className="w-4 h-4 inline mr-2 text-blue-600" />
                                            Stocks (€)
                                        </label>
                                        <input
                                            type="number"
                                            value={stocks}
                                            onChange={(e) => setStocks(e.target.value)}
                                            placeholder="50 000"
                                            className="w-full px-4 py-4 border border-slate-200 rounded-xl bg-white focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all text-lg"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">
                                            Valeur des marchandises en stock
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                                            <Users className="w-4 h-4 inline mr-2 text-green-600" />
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
                                            Factures clients non encaissées
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                                            <CreditCard className="w-4 h-4 inline mr-2 text-red-600" />
                                            Dettes fournisseurs (€)
                                        </label>
                                        <input
                                            type="number"
                                            value={dettes}
                                            onChange={(e) => setDettes(e.target.value)}
                                            placeholder="80 000"
                                            className="w-full px-4 py-4 border border-slate-200 rounded-xl bg-white focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all text-lg"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">
                                            Factures fournisseurs non payées
                                        </p>
                                    </div>
                                </div>

                                {/* CA optionnel */}
                                <div className="mb-8">
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        CA annuel (€) <span className="text-slate-400 font-normal">(optionnel - pour calcul en jours)</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={ca}
                                        onChange={(e) => setCA(e.target.value)}
                                        placeholder="1 200 000"
                                        className="w-full md:w-1/2 px-4 py-4 border border-slate-200 rounded-xl bg-white focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all text-lg"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={calculer}
                                        disabled={!stocks && !creances && !dettes}
                                        className="flex-1 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-primary/25 hover:shadow-xl hover:shadow-accent-primary/30"
                                    >
                                        Calculer mon BFR
                                    </button>
                                    {bfr !== null && (
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
                {bfr !== null && interpretation && (
                    <section className="py-16 bg-slate-50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-4xl mx-auto space-y-8">
                                {/* Résultat principal */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-10 shadow-2xl"
                                >
                                    {/* Décomposition */}
                                    <div className="grid grid-cols-3 gap-6 mb-8">
                                        <div className="text-center p-4 bg-white/5 rounded-xl">
                                            <Package className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                            <p className="text-sm text-slate-400 mb-1">Stocks</p>
                                            <p className="text-xl font-bold text-white">
                                                {parseFloat(stocks || '0').toLocaleString('fr-FR')} €
                                            </p>
                                        </div>
                                        <div className="text-center p-4 bg-white/5 rounded-xl">
                                            <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                                            <p className="text-sm text-slate-400 mb-1">+ Créances</p>
                                            <p className="text-xl font-bold text-white">
                                                {parseFloat(creances || '0').toLocaleString('fr-FR')} €
                                            </p>
                                        </div>
                                        <div className="text-center p-4 bg-white/5 rounded-xl">
                                            <CreditCard className="w-6 h-6 text-red-400 mx-auto mb-2" />
                                            <p className="text-sm text-slate-400 mb-1">- Dettes</p>
                                            <p className="text-xl font-bold text-white">
                                                {parseFloat(dettes || '0').toLocaleString('fr-FR')} €
                                            </p>
                                        </div>
                                    </div>

                                    {/* Résultat */}
                                    <div className="text-center border-t border-white/10 pt-8">
                                        <p className="text-slate-400 mb-4 text-lg">Votre BFR</p>
                                        <p className={`text-7xl sm:text-8xl font-bold mb-2 ${bfr < 0 ? 'text-green-400' : 'text-white'}`}>
                                            {bfr.toLocaleString('fr-FR')} <span className="text-4xl text-accent-primary">€</span>
                                        </p>
                                        {joursCA !== null && (
                                            <p className="text-slate-400 mb-8">
                                                Soit <span className="text-white font-semibold">{joursCA} jours</span> de CA
                                            </p>
                                        )}

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
                                    </div>
                                </motion.div>

                                {/* Analyse détaillée */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg"
                                >
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6">📊 Analyse détaillée</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                            <h4 className="font-semibold mb-2 text-blue-700">Stocks</h4>
                                            <p className="text-2xl font-bold text-blue-600 mb-1">
                                                {parseFloat(stocks || '0').toLocaleString('fr-FR')} €
                                            </p>
                                            <p className="text-xs text-blue-600/70">
                                                {bfr > 0 && stocks && parseFloat(stocks) > 0
                                                    ? Math.round((parseFloat(stocks) / bfr) * 100) + '% du BFR'
                                                    : 'Pas de stock immobilisé'}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                            <h4 className="font-semibold mb-2 text-green-700">Créances clients</h4>
                                            <p className="text-2xl font-bold text-green-600 mb-1">
                                                {parseFloat(creances || '0').toLocaleString('fr-FR')} €
                                            </p>
                                            <p className="text-xs text-green-600/70">
                                                {ca && creances
                                                    ? 'DSO estimé: ' + Math.round((parseFloat(creances) / parseFloat(ca)) * 365) + ' jours'
                                                    : 'Renseignez le CA pour calcul DSO'}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                            <h4 className="font-semibold mb-2 text-red-700">Dettes fournisseurs</h4>
                                            <p className="text-2xl font-bold text-red-600 mb-1">
                                                {parseFloat(dettes || '0').toLocaleString('fr-FR')} €
                                            </p>
                                            <p className="text-xs text-red-600/70">
                                                {dettes && parseFloat(dettes) > 0
                                                    ? 'Crédit fournisseur favorable'
                                                    : 'Pas de crédit fournisseur'}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Actions recommandées */}
                                {bfr > 0 && (
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
                                                Comment réduire votre BFR ?
                                            </h3>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {[
                                                { title: 'Réduire les stocks', desc: 'Optimisez vos rotations et évitez le sur-stockage' },
                                                { title: 'Accélérer les encaissements', desc: 'Relances automatiques et escomptes paiement anticipé' },
                                                { title: 'Négocier délais fournisseurs', desc: 'Demandez 45-60 jours au lieu de 30 jours' },
                                                { title: 'Facture électronique', desc: 'Obligatoire 2026, réduit les délais de paiement' },
                                                { title: 'Demander des acomptes', desc: '30-50% à la commande pour les gros projets' },
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
                                            Suivez votre BFR automatiquement
                                        </h3>
                                        <p className="text-lg text-slate-300 text-center mb-8 max-w-2xl mx-auto">
                                            FinSight calcule votre BFR en temps réel depuis vos exports comptables. 
                                            Plus de calculs manuels.
                                        </p>

                                        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
                                            {[
                                                'BFR mis à jour automatiquement',
                                                'Évolution mensuelle visualisée',
                                                'Alertes si BFR dépasse seuil',
                                                '15 autres KPIs (DSO, tréso, marges...)'
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
                                                onClick={() => trackCTAClick('calculateur-bfr', '/dashboard', 'essayer-gratuitement')}
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
                                            ✅ Sans engagement • ✅ Dashboard complet • ✅ Export PDF/Excel
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
                                    Ressources utiles
                                </h2>
                                <p className="text-lg text-slate-600">
                                    Guides et outils pour optimiser votre besoin en fonds de roulement
                                </p>
                            </motion.div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    {
                                        href: '/blog/bfr-negatif-bon-ou-mauvais',
                                        icon: <BarChart3 className="w-6 h-6 text-white" />,
                                        title: 'BFR Négatif : Bon ou Mauvais ?',
                                        desc: 'Comprendre quand un BFR négatif est une force ou un signal d\'alerte'
                                    },
                                    {
                                        href: '/calculateurs/dso',
                                        icon: <Calculator className="w-6 h-6 text-white" />,
                                        title: 'Calculateur DSO',
                                        desc: 'Calculez votre délai moyen de paiement clients'
                                    },
                                    {
                                        href: '/blog/reduire-dso-50-pourcent-90-jours',
                                        icon: <TrendingUp className="w-6 h-6 text-white" />,
                                        title: 'Réduire son DSO de 50%',
                                        desc: '10 actions pour accélérer les encaissements et réduire le BFR'
                                    },
                                    {
                                        href: '/blog/5-kpi-financiers-pme',
                                        icon: <Target className="w-6 h-6 text-white" />,
                                        title: '5 KPIs essentiels PME',
                                        desc: 'Les indicateurs financiers à suivre absolument'
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
                                Prêt à optimiser votre BFR ?
                            </h2>
                            <p className="text-lg text-slate-300 mb-8">
                                Découvrez comment FinSight peut automatiser le suivi de votre trésorerie 
                                et vous aider à libérer du cash.
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
