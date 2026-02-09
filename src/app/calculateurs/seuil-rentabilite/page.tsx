'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calculator, BarChart3, ArrowRight, AlertCircle, CheckCircle, Target, TrendingUp, DollarSign, Percent } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { generateHowToJsonLd } from '@/lib/seo'
import { trackCalculatorUse, trackCTAClick } from '@/lib/analytics'

export default function CalculateurSeuilRentabilite() {
    const [chargesFixes, setChargesFixes] = useState<string>('')
    const [tauxMarge, setTauxMarge] = useState<string>('')
    const [seuil, setSeuil] = useState<number | null>(null)
    const [seuilJour, setSeuilJour] = useState<number | null>(null)

    // Structured data for SEO
    const structuredData = generateHowToJsonLd({
        name: 'Calculer son Seuil de Rentabilité (Point Mort)',
        description: 'Guide pas à pas pour calculer le chiffre d\'affaires minimum nécessaire pour couvrir vos charges fixes',
        slug: 'seuil-rentabilite',
        steps: [
            {
                name: 'Identifier vos charges fixes mensuelles',
                text: 'Additionnez tous vos coûts fixes : loyers, salaires, assurances, abonnements, amortissements'
            },
            {
                name: 'Calculer votre taux de marge sur coûts variables',
                text: 'Taux = (Prix de vente - Coût variable) / Prix de vente × 100'
            },
            {
                name: 'Appliquer la formule du seuil',
                text: 'Seuil de Rentabilité = Charges Fixes / Taux de Marge'
            },
            {
                name: 'Interpréter le résultat',
                text: 'Le seuil indique le CA minimum mensuel pour ne pas perdre d\'argent. Au-delà, vous êtes rentable.'
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
                "name": "Comment calculer son seuil de rentabilité ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Le seuil de rentabilité (ou point mort) se calcule avec la formule : Charges Fixes / Taux de Marge sur Coûts Variables. Il correspond au chiffre d'affaires minimum à réaliser pour couvrir l'ensemble de vos charges sans réaliser de perte."
                }
            },
            {
                "@type": "Question",
                "name": "Quelle est la différence entre seuil de rentabilité et point mort ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Le seuil de rentabilité s'exprime en montant de chiffre d'affaires (euros), tandis que le point mort exprime la même donnée en nombre de jours. Le point mort indique à quel moment de l'année votre entreprise commence à générer des bénéfices."
                }
            },
            {
                "@type": "Question",
                "name": "Comment abaisser son seuil de rentabilité ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Pour abaisser votre seuil de rentabilité, vous pouvez soit réduire vos charges fixes (loyers, abonnements), soit augmenter votre taux de marge brute en renégociant vos achats ou en augmentant vos prix de vente."
                }
            }
        ]
    }

    const calculer = () => {
        const chargesNum = parseFloat(chargesFixes)
        const tauxNum = parseFloat(tauxMarge)

        if (chargesNum > 0 && tauxNum > 0 && tauxNum <= 100) {
            const seuilCalcule = Math.round(chargesNum / (tauxNum / 100))
            const seuilJourCalcule = Math.round(seuilCalcule / 22) // 22 jours ouvrés
            setSeuil(seuilCalcule)
            setSeuilJour(seuilJourCalcule)

            // Track calculator usage
            trackCalculatorUse('SeuilRentabilite', seuilCalcule, {
                chargesFixes: chargesNum,
                tauxMarge: tauxNum
            })
        }
    }

    const reset = () => {
        setChargesFixes('')
        setTauxMarge('')
        setSeuil(null)
        setSeuilJour(null)
    }

    const getInterpretation = (tauxMarge: number) => {
        if (tauxMarge >= 60) {
            return {
                niveau: 'excellent',
                icone: <CheckCircle className="w-6 h-6 text-green-500" />,
                titre: '✅ Modèle Solide',
                couleur: 'text-green-600',
                bgCouleur: 'bg-green-50 border-green-200',
                message: 'Excellent taux de marge ! Votre seuil de rentabilité est facilement atteignable. Chaque euro de CA supplémentaire génère une marge confortable.'
            }
        } else if (tauxMarge >= 40) {
            return {
                niveau: 'bon',
                icone: <CheckCircle className="w-6 h-6 text-blue-500" />,
                titre: '✅ Modèle Viable',
                couleur: 'text-blue-600',
                bgCouleur: 'bg-blue-50 border-blue-200',
                message: 'Bon taux de marge. Votre seuil de rentabilité est raisonnable. Surveillez vos charges fixes pour maintenir l\'équilibre.'
            }
        } else if (tauxMarge >= 25) {
            return {
                niveau: 'surveiller',
                icone: <AlertCircle className="w-6 h-6 text-amber-500" />,
                titre: '⚠️ À Optimiser',
                couleur: 'text-amber-600',
                bgCouleur: 'bg-amber-50 border-amber-200',
                message: 'Taux de marge moyen. Votre seuil de rentabilité est élevé. Travaillez à réduire vos charges fixes ou augmenter vos prix.'
            }
        } else {
            return {
                niveau: 'critique',
                icone: <AlertCircle className="w-6 h-6 text-red-500" />,
                titre: '🚨 Modèle Risqué',
                couleur: 'text-red-600',
                bgCouleur: 'bg-red-50 border-red-200',
                message: 'Taux de marge trop faible ! Votre seuil de rentabilité est très difficile à atteindre. Revoyez urgentement votre pricing ou vos coûts.'
            }
        }
    }

    const interpretation = seuil !== null ? getInterpretation(parseFloat(tauxMarge)) : null

    return (
        <div className="min-h-screen bg-white">
            <StructuredData data={structuredData} />
            <StructuredData data={faqSchema} />
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-20">
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
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                                <Calculator className="w-4 h-4 text-red-400" />
                                <span className="text-sm text-white/90 font-medium">
                                    Calculateur Gratuit
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Seuil de Rentabilité
                                <span className="block text-red-400 mt-2">
                                    Point Mort & Break-Even
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Calculez le chiffre d&apos;affaires minimum pour couvrir vos charges fixes 
                                et commencer à générer du profit.
                            </p>

                            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">30s</div>
                                    <div className="text-sm text-slate-400">Calcul instantané</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">CA</div>
                                    <div className="text-sm text-slate-400">Objectif mensuel</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">100%</div>
                                    <div className="text-sm text-slate-400">Gratuit</div>
                                </div>
                            </div>

                            <a
                                href="#calculateur"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/25"
                            >
                                Calculer mon seuil
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* Contenu SEO */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <article className="prose prose-lg max-w-none">
                                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <BarChart3 className="w-8 h-8 text-red-500" />
                                    Qu&apos;est-ce que le Seuil de Rentabilité ?
                                </h2>
                                
                                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                                    Le <strong>seuil de rentabilité</strong> (ou <strong>point mort</strong>, <em>break-even point</em> en anglais) 
                                    est le niveau de <strong>chiffre d&apos;affaires à partir duquel votre entreprise ne perd plus d&apos;argent</strong>. 
                                    C&apos;est l&apos;indicateur essentiel pour tout dirigeant de PME qui veut piloter sa rentabilité.
                                </p>

                                {/* Formule mise en avant */}
                                <div className="not-prose bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-8">
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">📐 Formule du Seuil de Rentabilité</h3>
                                    <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
                                        <code className="text-xl font-mono text-red-600">
                                            Seuil de Rentabilité = Charges Fixes ÷ Taux de Marge sur Coûts Variables
                                        </code>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Le résultat s&apos;exprime en <strong>euros de CA</strong>. En dessous, vous perdez de l&apos;argent. Au-dessus, vous êtes rentable.
                                    </p>
                                </div>

                                {/* Exemple pratique */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Target className="w-6 h-6 text-red-500" />
                                    Exemple pratique
                                </h3>
                                
                                <div className="not-prose bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
                                    <p className="font-semibold text-slate-900 mb-4 text-lg">
                                        🏢 Agence de conseil - Charges fixes 8 000€/mois
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <p className="text-sm text-slate-500">Charges fixes mensuelles</p>
                                            <p className="text-2xl font-bold text-slate-900">8 000 €</p>
                                            <p className="text-xs text-slate-400 mt-1">Loyer, salaires, abonnements...</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <p className="text-sm text-slate-500">Taux de marge variable</p>
                                            <p className="text-2xl font-bold text-slate-900">60%</p>
                                            <p className="text-xs text-slate-400 mt-1">(Prix vente - Coût variable) / Prix vente</p>
                                        </div>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                        <p className="text-sm text-slate-600 mb-1">Calcul :</p>
                                        <p className="font-mono text-slate-900">8 000 € ÷ 0.60 = <strong className="text-red-600 text-xl">13 333 €/mois</strong></p>
                                    </div>
                                    <p className="mt-4 text-slate-700 flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-red-500" />
                                        → Pour être rentable, vous devez facturer <strong>au minimum 13 333 €</strong> par mois.
                                    </p>
                                </div>

                                {/* Tableau charges fixes vs variables */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Percent className="w-6 h-6 text-red-500" />
                                    Charges Fixes vs Charges Variables
                                </h3>

                                <div className="not-prose overflow-x-auto mb-8">
                                    <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                        <thead>
                                            <tr className="bg-slate-100">
                                                <th className="px-6 py-4 text-left font-bold text-slate-900">Charges Fixes</th>
                                                <th className="px-6 py-4 text-left font-bold text-slate-900">Charges Variables</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-t border-slate-200">
                                                <td className="px-6 py-3 text-slate-700">Loyers, assurances</td>
                                                <td className="px-6 py-3 text-slate-700">Matières premières</td>
                                            </tr>
                                            <tr className="border-t border-slate-200 bg-slate-50">
                                                <td className="px-6 py-3 text-slate-700">Salaires fixes</td>
                                                <td className="px-6 py-3 text-slate-700">Commissions commerciales</td>
                                            </tr>
                                            <tr className="border-t border-slate-200">
                                                <td className="px-6 py-3 text-slate-700">Abonnements (logiciels, téléphone)</td>
                                                <td className="px-6 py-3 text-slate-700">Frais de livraison</td>
                                            </tr>
                                            <tr className="border-t border-slate-200 bg-slate-50">
                                                <td className="px-6 py-3 text-slate-700">Amortissements</td>
                                                <td className="px-6 py-3 text-slate-700">Sous-traitance à la production</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                {/* Calculateur */}
                <section id="calculateur" className="py-16 bg-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <BarChart3 className="w-7 h-7" />
                                        Calculez votre Seuil de Rentabilité
                                    </h2>
                                    <p className="text-red-100 mt-2">Résultat instantané avec interprétation</p>
                                </div>

                                <div className="p-8">
                                    {!seuil ? (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Charges fixes mensuelles
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={chargesFixes}
                                                        onChange={(e) => setChargesFixes(e.target.value)}
                                                        placeholder="Ex: 15000"
                                                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all text-lg"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">Loyers, salaires, assurances, abonnements...</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Taux de marge sur coûts variables
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={tauxMarge}
                                                        onChange={(e) => setTauxMarge(e.target.value)}
                                                        placeholder="Ex: 40"
                                                        min="1"
                                                        max="100"
                                                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all text-lg"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    (Prix de vente - Coût variable) / Prix de vente × 100
                                                </p>
                                            </div>

                                            <button
                                                onClick={calculer}
                                                disabled={!chargesFixes || !tauxMarge}
                                                className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                                            >
                                                <Calculator className="w-5 h-5" />
                                                Calculer mon seuil
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Résultat principal */}
                                            <div className="text-center p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200">
                                                <p className="text-slate-600 mb-2 font-medium">Votre Seuil de Rentabilité</p>
                                                <p className="text-5xl font-bold text-red-600 mb-2">
                                                    {seuil.toLocaleString('fr-FR')} €
                                                    <span className="text-2xl text-slate-500 font-normal">/mois</span>
                                                </p>
                                                <div className="mt-4 pt-4 border-t border-red-200 grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-slate-500">CA annuel minimum</p>
                                                        <p className="text-xl font-bold text-slate-700">{(seuil * 12).toLocaleString('fr-FR')} €</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-500">CA journalier</p>
                                                        <p className="text-xl font-bold text-slate-700">{seuilJour?.toLocaleString('fr-FR')} €</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Interprétation */}
                                            {interpretation && (
                                                <div className={`p-5 rounded-xl border-2 ${interpretation.bgCouleur}`}>
                                                    <div className="flex items-start gap-3">
                                                        {interpretation.icone}
                                                        <div>
                                                            <h3 className={`font-bold text-lg ${interpretation.couleur}`}>
                                                                {interpretation.titre}
                                                            </h3>
                                                            <p className="text-slate-600 mt-1">
                                                                {interpretation.message}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Recommandations */}
                                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                    <TrendingUp className="w-5 h-5 text-red-500" />
                                                    Leviers pour réduire votre seuil
                                                </h4>
                                                <ul className="space-y-3">
                                                    <li className="flex items-start gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                                        <span className="text-slate-600">Réduisez vos charges fixes (télétravail, renégociation baux, externalisation)</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                                        <span className="text-slate-600">Augmentez votre taux de marge (renégociez fournisseurs, augmentez vos prix)</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                                        <span className="text-slate-600">Transformez des charges fixes en variables (freelances vs CDI, cloud vs serveurs)</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                                        <span className="text-slate-600">Suivez votre seuil mensuellement et ajustez votre stratégie commerciale</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <button
                                                onClick={reset}
                                                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
                                            >
                                                Nouveau calcul
                                            </button>

                                            {/* CTA */}
                                            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-center">
                                                <p className="text-white font-semibold mb-2">
                                                    🚀 Automatisez le suivi de votre rentabilité
                                                </p>
                                                <p className="text-red-100 text-sm mb-4">
                                                    FinSight calcule automatiquement votre seuil de rentabilité et vous alerte si vous passez en dessous.
                                                </p>
                                                <Link
                                                    href="/contact"
                                                    onClick={() => trackCTAClick('seuil_rentabilite', '/contact', 'cta_demo')}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-all"
                                                >
                                                    Demander une démo
                                                    <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                                Questions fréquentes sur le Seuil de Rentabilité
                            </h2>

                            <div className="space-y-4">
                                {[
                                    {
                                        q: "Comment calculer le seuil de rentabilité ?",
                                        a: "Le seuil de rentabilité se calcule avec la formule : Seuil = Charges Fixes ÷ Taux de Marge sur Coûts Variables. Par exemple, avec 50 000€ de charges fixes et un taux de marge de 40%, le seuil est de 125 000€ de CA."
                                    },
                                    {
                                        q: "Quelle est la différence entre seuil de rentabilité et point mort ?",
                                        a: "Ce sont deux termes pour le même concept. Le seuil de rentabilité (ou point mort, break-even point) représente le niveau de chiffre d'affaires à partir duquel l'entreprise ne perd plus d'argent."
                                    },
                                    {
                                        q: "Comment réduire son seuil de rentabilité ?",
                                        a: "Deux leviers principaux : 1) Réduire les charges fixes (télétravail, négociation loyers, externalisation) ou 2) Augmenter le taux de marge (renégocier fournisseurs, augmenter prix, réduire coûts variables)."
                                    },
                                    {
                                        q: "Qu'est-ce qu'un bon taux de marge sur coûts variables ?",
                                        a: "Un bon taux de marge dépend du secteur : Services (60-80%), Commerce (30-50%), Industrie (40-60%), SaaS (70-90%). Plus le taux est élevé, plus le seuil de rentabilité sera bas."
                                    }
                                ].map((faq, idx) => (
                                    <div key={idx} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                        <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                                        <p className="text-slate-600">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Navigation vers autres calculateurs */}
                <section className="py-16 bg-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">
                                Autres calculateurs financiers gratuits
                            </h2>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <Link href="/calculateurs/dso" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all group">
                                    <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600">Calculateur DSO</h3>
                                    <p className="text-sm text-slate-500 mt-1">Délai paiement clients</p>
                                </Link>
                                <Link href="/calculateurs/bfr" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-green-500 hover:shadow-lg transition-all group">
                                    <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-3" />
                                    <h3 className="font-bold text-slate-900 group-hover:text-green-600">Calculateur BFR</h3>
                                    <p className="text-sm text-slate-500 mt-1">Besoin fonds roulement</p>
                                </Link>
                                <Link href="/calculateurs/marge" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-orange-500 hover:shadow-lg transition-all group">
                                    <Target className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                                    <h3 className="font-bold text-slate-900 group-hover:text-orange-600">Calculateur Marge</h3>
                                    <p className="text-sm text-slate-500 mt-1">Taux de marge & marque</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
