'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, ArrowRight, AlertCircle, CheckCircle, CheckCircle2, Zap, Clock, Target, BarChart3, FileText, AlertTriangle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BenchmarkBar } from '@/components/BenchmarkBar'
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory'
import StructuredData from '@/components/StructuredData'
import { generateHowToJsonLd } from '@/lib/seo'
import { trackCalculatorUse, trackCTAClick } from '@/lib/analytics'
import DiagnosticReturnBanner from '@/components/DiagnosticReturnBanner'
import EmailCaptureModal from '@/components/EmailCaptureModal'
import PremiumUpsellCard from '@/components/PremiumUpsellCard'

export default function CalculateurDSO() {
    const [creances, setCreances] = useState<string>('')
    const [ca, setCA] = useState<string>('')
    const [dso, setDSO] = useState<number | null>(null)
    const [secteur, setSecteur] = useState<'services' | 'commerce' | 'industrie' | 'saas'>('services')
    const { saveCalculation } = useCalculatorHistory()

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
                "name": "Comment calculer son DSO simplement ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Le DSO (Days Sales Outstanding) se calcule avec la formule suivante : (Créances clients / Chiffre d'affaires TTC) x nombre de jours sur la période. Un DSO élevé indique que vos clients mettent trop de temps à payer vos factures."
                }
            },
            {
                "@type": "Question",
                "name": "Quel est un bon niveau de DSO en France ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Le DSO moyen en France varie selon les secteurs : environ 40 jours dans les services et jusqu'à 60 jours dans l'industrie ou le BTP. Un bon DSO est généralement inférieur à 45 jours pour garantir une trésorerie saine."
                }
            },
            {
                "@type": "Question",
                "name": "Comment réduire son DSO et libérer du cash ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Pour réduire votre DSO, vous pouvez automatiser vos relances clients, exiger des acomptes à la commande, ou encore proposer l'escompte pour paiement anticipé. Réduire son DSO de 10 jours peut libérer plusieurs milliers d'euros de trésorerie immédiatement."
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

            // Sauvegarder dans l'historique local
            saveCalculation({
                type: 'dso',
                value: dsoCalcule,
                inputs: { creances: creancesNum, ca: caNum },
                secteur,
                unit: 'jours',
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

    const reportInputs = useMemo(() => {
        if (dso === null) return {}
        return {
            creances: parseFloat(creances) || 0,
            ca: parseFloat(ca) || 0,
            secteur,
        }
    }, [dso, creances, ca, secteur])

    const reportResult = useMemo(() => {
        if (dso === null || !interpretation) return {}
        return {
            dso,
            secteur,
            niveau: interpretation.niveau,
            titre: interpretation.titre,
            message: interpretation.message,
            interpretationLines: [interpretation.message],
            summary: [
                { label: 'DSO', value: `${dso} jours` },
                { label: 'Secteur', value: secteur },
                { label: 'Niveau', value: interpretation.niveau },
            ],
        }
    }, [dso, secteur, interpretation])

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
                                Calculateur DSO : cash bloqué chez vos clients
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
                                <div className="not-prose bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-lg bg-accent-primary/10 flex items-center justify-center shrink-0">
                                        <Target className="w-4 h-4 text-accent-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 mb-1">Aller au-delà du calcul</p>
                                        <p className="text-sm text-slate-600">
                                            Positionnez votre DSO face aux médianes sectorielles et obtenez un score global sur 100 avec notre{' '}
                                            <Link href="/diagnostic/guide" className="text-accent-primary hover:underline font-medium">
                                                diagnostic DSO complet
                                            </Link>
                                            {' '}- ou découvrez comment le DSO s'intègre dans votre{' '}
                                            <Link href="/pilotage-financier-pme" className="text-accent-primary hover:underline font-medium">
                                                tableau de bord de pilotage financier
                                            </Link>.
                                        </p>
                                    </div>
                                </div>
                                <div className="not-prose bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-center">
                                    <p className="text-accent-primary font-semibold mb-2">💡 Besoin d&apos;aide pour piloter votre DSO ?</p>
                                    <p className="text-white text-lg mb-6">
                                        Avec mon <strong>Diagnostic FinSight™ 90J (2 490€ HT)</strong>, j&apos;analyse votre DSO en détail et vous propose 
                                        un plan d&apos;action personnalisé pour libérer du cash. Je vous aide ensuite à optimiser ces ratios en réel 
                                        avec un pilotage de trésorerie sur 90 jours.
                                    </p>
                                    <Link 
                                        href="/consulting" 
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all shadow-lg"
                                    >
                                        Découvrir l&apos;Audit Stratégique
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
                        <div className="max-w-7xl mx-auto">
                            <div className="grid lg:grid-cols-4 gap-8">
                                {/* Sidebar - Calculateurs liés (desktop only) */}
                                <div className="lg:col-span-1 hidden lg:block">
                                    <div className="sticky top-24 space-y-6">
                                        {/* Calculateurs liés */}
                                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <Calculator className="w-5 h-5 text-accent-primary" />
                                                Calculateurs liés
                                            </h3>
                                            <div className="space-y-3">
                                                <Link 
                                                    href="/calculateurs/bfr"
                                                    className="group block p-4 bg-slate-50 rounded-lg hover:bg-accent-primary hover:shadow-md transition-all"
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <BarChart3 className="w-4 h-4 text-accent-primary group-hover:text-white" />
                                                        <p className="font-semibold text-sm text-slate-900 group-hover:text-white">Calculateur BFR</p>
                                                    </div>
                                                    <p className="text-xs text-slate-600 group-hover:text-white/90">
                                                        Impact du DSO sur votre trésorerie
                                                    </p>
                                                </Link>

                                                <Link 
                                                    href="/calculateurs/roi"
                                                    className="group block p-4 bg-slate-50 rounded-lg hover:bg-accent-primary hover:shadow-md transition-all"
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Target className="w-4 h-4 text-accent-primary group-hover:text-white" />
                                                        <p className="font-semibold text-sm text-slate-900 group-hover:text-white">Calculateur ROI</p>
                                                    </div>
                                                    <p className="text-xs text-slate-600 group-hover:text-white/90">
                                                        Rentabilité d'un investissement
                                                    </p>
                                                </Link>

                                                <Link 
                                                    href="/calculateurs/marge"
                                                    className="group block p-4 bg-slate-50 rounded-lg hover:bg-accent-primary hover:shadow-md transition-all"
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <TrendingUp className="w-4 h-4 text-accent-primary group-hover:text-white" />
                                                        <p className="font-semibold text-sm text-slate-900 group-hover:text-white">Calculateur Marge</p>
                                                    </div>
                                                    <p className="text-xs text-slate-600 group-hover:text-white/90">
                                                        Taux de marge et de marque
                                                    </p>
                                                </Link>

                                                <Link 
                                                    href="/calculateurs"
                                                    className="block p-3 text-center bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-sm font-semibold"
                                                >
                                                    Voir tous les calculateurs →
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Pilotage CTA */}
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Aller plus loin</p>
                                            <div className="space-y-2">
                                                <Link
                                                    href="/pilotage-financier-pme"
                                                    className="flex items-center gap-2 text-sm text-slate-700 hover:text-accent-primary transition-colors group"
                                                >
                                                    <span className="w-5 h-5 rounded bg-slate-200 group-hover:bg-accent-primary/10 flex items-center justify-center shrink-0">
                                                        <TrendingUp className="w-3 h-3 text-slate-500 group-hover:text-accent-primary" />
                                                    </span>
                                                    Pilotage financier PME
                                                </Link>
                                                <Link
                                                    href="/diagnostic/guide"
                                                    className="flex items-center gap-2 text-sm text-slate-700 hover:text-accent-primary transition-colors group"
                                                >
                                                    <span className="w-5 h-5 rounded bg-slate-200 group-hover:bg-accent-primary/10 flex items-center justify-center shrink-0">
                                                        <Target className="w-3 h-3 text-slate-500 group-hover:text-accent-primary" />
                                                    </span>
                                                    Diagnostic DSO complet
                                                </Link>
                                            </div>
                                        </div>

                                        {/* CTA Audit */}
                                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6">
                                            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center mb-4">
                                                <Target className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="font-bold text-gray-900 mb-2">
                                                Besoin d'aide ?
                                            </p>
                                            <p className="text-sm text-gray-700 mb-4">
                                                Besoin d'aide pour réduire votre DSO rapidement ?
                                            </p>
                                            <a
                                                href="https://calendly.com/zineinsight"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full px-4 py-3 bg-accent-primary text-white text-center font-semibold rounded-lg hover:bg-accent-primary-hover transition-all text-sm"
                                            >
                                                Identifier mes leviers
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="lg:col-span-3">
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

                                {/* 🔥 NOUVEAU : Diagnostic Personnalisé - Bridge to Consulting */}
                                {dso > 45 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-8 shadow-xl"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                                                <AlertTriangle className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                    Votre DSO bloque {Math.round((parseFloat(creances) / parseFloat(ca)) * parseFloat(ca)).toLocaleString('fr-FR')}€ de trésorerie
                                                </h3>
                                                <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                                                    Avec un DSO de <strong>{dso} jours</strong>, vous perdez l'équivalent de{' '}
                                                    <strong className="text-amber-700">{(dso / 30).toFixed(1)} mois de chiffre d'affaires</strong> immobilisé.
                                                    <br />
                                                    En le réduisant à 30 jours, vous libérez immédiatement{' '}
                                                    <strong className="text-green-600">
                                                        {Math.round((parseFloat(creances) * (dso - 30)) / dso).toLocaleString('fr-FR')}€
                                                    </strong>.
                                                </p>
                                                
                                                {/* Impact chiffré */}
                                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 mb-6 border border-amber-200">
                                                    <div className="grid md:grid-cols-3 gap-4 text-center">
                                                        <div>
                                                            <p className="text-sm text-gray-600 mb-1">Cash actuellement bloqué</p>
                                                            <p className="text-2xl font-bold text-red-600">
                                                                {parseFloat(creances).toLocaleString('fr-FR')}€
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600 mb-1">Cash libérable (DSO à 30j)</p>
                                                            <p className="text-2xl font-bold text-green-600">
                                                                +{Math.round((parseFloat(creances) * (dso - 30)) / dso).toLocaleString('fr-FR')}€
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600 mb-1">Gain mensuel potentiel</p>
                                                            <p className="text-2xl font-bold text-accent-primary">
                                                                {Math.round(((parseFloat(creances) * (dso - 30)) / dso) * 0.03).toLocaleString('fr-FR')}€/mois
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* CTAs */}
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <a
                                                        href="https://calendly.com/zineinsight"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={() => trackCTAClick('dso-diagnostic', 'calendly', `audit-dso-${dso}-${secteur}`)}
                                                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-accent-primary text-white font-bold rounded-xl hover:bg-accent-primary-hover transition-all shadow-lg hover:shadow-xl"
                                                    >
                                                        <Target className="w-5 h-5" />
                                                        Échangeons 30 min : Comment réduire mon DSO ?
                                                    </a>
                                                    <Link
                                                        href="/consulting"
                                                        onClick={() => trackCTAClick('dso-diagnostic', '/consulting', 'audit-strategique')}
                                                        className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-amber-500 text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-all"
                                                    >
                                                        <FileText className="w-5 h-5" />
                                                        Voir l'offre Audit Stratégique
                                                    </Link>
                                                </div>

                                                {/* Trust indicators */}
                                                <div className="flex items-center gap-6 text-sm text-gray-600 mt-4 pt-4 border-t border-amber-200">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                        <span>Réponse sous 24h</span>
                                                    </div>
                                                    <span className="text-gray-400">•</span>
                                                    <span>Plan d'action personnalisé</span>
                                                    <span className="text-gray-400">•</span>
                                                    <span>Résultats en 60-90 jours</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Actions recommandées */}
                                {interpretation.niveau !== 'excellent' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
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

                                {/* 🔥 NOUVEAU : Parcours Guidé - Next Steps */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                                            <Target className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            🎯 Prochaines étapes recommandées
                                        </h3>
                                    </div>
                                    
                                    <p className="text-gray-700 mb-6">
                                        Maintenant que vous connaissez votre DSO, voici comment aller plus loin :
                                    </p>

                                    <div className="space-y-4">
                                        {/* Étape 1 : BFR */}
                                        <Link 
                                            href="/calculateurs/bfr"
                                            onClick={() => trackCTAClick('dso-result', '/calculateurs/bfr', `next-step-bfr-dso-${dso}`)}
                                            className="group flex items-center gap-4 p-5 bg-white rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-300"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0 text-lg">
                                                1
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                                    Calculez votre BFR (Besoin en Fonds de Roulement)
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Le DSO impacte directement votre BFR. Découvrez combien de cash est immobilisé dans votre cycle d'exploitation.
                                                </p>
                                            </div>
                                            <ArrowRight className="w-6 h-6 text-blue-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                        </Link>

                                        {/* Étape 2 : Guide */}
                                        <Link 
                                            href="/blog/reduire-dso-50-pourcent-90-jours"
                                            onClick={() => trackCTAClick('dso-result', '/blog/reduire-dso', `guide-dso-${dso}`)}
                                            className="group flex items-center gap-4 p-5 bg-white rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-300"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0 text-lg">
                                                2
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                                    Lisez le guide : Réduire son DSO de 50% en 90 jours
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    10 actions concrètes à implémenter dès demain + cas client réel PME 7M€ CA.
                                                </p>
                                            </div>
                                            <ArrowRight className="w-6 h-6 text-blue-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                        </Link>

                                        {/* Étape 3 : Audit */}
                                        <a
                                            href="https://calendly.com/zineinsight"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => trackCTAClick('dso-result', 'calendly', `audit-30min-dso-${dso}`)}
                                            className="group flex items-center gap-4 p-5 bg-gradient-to-r from-accent-primary to-blue-600 text-white rounded-xl hover:shadow-xl transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-bold flex-shrink-0 text-lg">
                                                3
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-lg">
                                                    Échangeons 30 minutes sur vos enjeux
                                                </p>
                                                <p className="text-sm text-white/90 mt-1">
                                                    Je vous explique comment réduire votre DSO sans relances manuelles + plan d'action personnalisé en 48h.
                                                </p>
                                            </div>
                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                        </a>
                                    </div>

                                    {/* Metric */}
                                    <div className="mt-6 pt-6 border-t border-blue-200 flex items-center justify-center gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>En moyenne, mes clients libèrent <strong className="text-gray-900">15-30% de cash</strong> en réduisant leur DSO de 20 jours</span>
                                    </div>
                                </motion.div>

                                {/* CTA Score FinSight - Boucle retour */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.25 }}
                                    className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 text-center"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary-subtle)] flex items-center justify-center mx-auto mb-4">
                                        <Target className="w-6 h-6 text-[var(--accent-primary)]" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Votre DSO est enregistré</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Ce résultat alimente le pilier <strong>Cash</strong> de votre Score FinSight™. 
                                        Continuez avec 1 ou 2 indicateurs de plus pour obtenir un diagnostic exploitable.
                                    </p>
                                    <Link
                                        href="/mon-diagnostic"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors shadow-md"
                                    >
                                        Voir mon Score FinSight™
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>

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
                                                href="/consulting"
                                                onClick={() => trackCTAClick('calculateur-dso', '/consulting', 'audit-strategique')}
                                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                                            >
                                                <Target className="w-5 h-5" />
                                                Voir l'Diagnostic FinSight™ 90J (2 490€ HT)
                                            </Link>
                                            <a
                                                href="https://calendly.com/zineinsight"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => trackCTAClick('calculateur-dso', 'calendly', '30min-diagnostic')}
                                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                                            >
                                                Identifier mes leviers financiers
                                            </a>
                                        </div>

                                        <p className="text-sm text-slate-400 text-center mt-6">
                                            Sans engagement · Plan d'action personnalisé · Résultats sous 48h
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Bannière retour diagnostic */}
                {dso !== null && (
                    <section className="bg-white">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-4xl mx-auto">
                                <DiagnosticReturnBanner show={true} />
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

                {/* 🔥 NOUVEAU : Section "Complétez votre diagnostic" - Maillage interne */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    🔗 Complétez votre diagnostic financier
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Le DSO n'est qu'un indicateur. Analysez l'ensemble de votre santé financière.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {/* BFR */}
                                <Link
                                    href="/calculateurs/bfr"
                                    className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <BarChart3 className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                                        Calculateur BFR
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Mesurez combien de cash est bloqué dans votre cycle d'exploitation (stocks + créances - dettes).
                                    </p>
                                    <div className="flex items-center text-blue-600 font-semibold text-sm">
                                        Calculer mon BFR
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>

                                {/* ROI */}
                                <Link
                                    href="/calculateurs/roi"
                                    className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600">
                                        Calculateur ROI
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Évaluez la rentabilité de vos investissements (équipement, marketing, recrutement).
                                    </p>
                                    <div className="flex items-center text-purple-600 font-semibold text-sm">
                                        Calculer mon ROI
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>

                                {/* Tous les calculateurs */}
                                <Link
                                    href="/calculateurs"
                                    className="group bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 border-2 border-slate-300 hover:border-slate-400 hover:shadow-xl transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Calculator className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        9 calculateurs gratuits
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        DSO, BFR, ROI, Marge, Seuil de rentabilité, EBITDA, CAC/LTV, Burn Rate, Valorisation.
                                    </p>
                                    <div className="flex items-center text-slate-900 font-semibold text-sm">
                                        Voir tous les calculateurs
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
                                Besoin d'aide pour réduire votre DSO et libérer du cash ?
                            </h2>
                            <p className="text-lg text-slate-300 mb-8">
                                En tant qu'architecte de pilotage financier, je vous aide à structurer votre recouvrement et optimiser votre trésorerie.
                                <br />
                                <strong className="text-white">Résultats visibles sous 60-90 jours.</strong>
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="https://calendly.com/zineinsight"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => trackCTAClick('dso-final-cta', 'calendly', 'diagnostic-30min')}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-bold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                                >
                                    <Clock className="w-5 h-5" />
                                    Identifier mes leviers financiers
                                </a>
                                <Link
                                    href="/consulting"
                                    onClick={() => trackCTAClick('dso-final-cta', '/consulting', 'voir-offres')}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                                >
                                    Voir mes offres DAF
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                            
                            {/* Trust indicators */}
                            <div className="flex items-center justify-center gap-6 text-sm text-slate-400 mt-8">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                    <span>Réponse sous 24h</span>
                                </div>
                                <span className="text-slate-600">•</span>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                    <span>Plan d'action personnalisé</span>
                                </div>
                                <span className="text-slate-600">•</span>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                    <span>Sans engagement</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <EmailCaptureModal
                calculatorType="dso"
                hasResult={dso !== null}
                result={reportResult}
                inputs={reportInputs}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pb-10">
                <PremiumUpsellCard
                    calculatorType="dso"
                    hasResult={dso !== null}
                    result={reportResult}
                    inputs={reportInputs}
                />
            </div>

            <Footer />
        </div>
    )
}
