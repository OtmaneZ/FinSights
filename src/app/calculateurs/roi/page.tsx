'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calculator, Target, ArrowRight, AlertCircle, CheckCircle, TrendingUp, DollarSign, BarChart3, Clock, Zap } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { generateHowToJsonLd } from '@/lib/seo'
import { trackCalculatorUse, trackCTAClick } from '@/lib/analytics'

export default function CalculateurROI() {
    const [investissement, setInvestissement] = useState<string>('')
    const [gainsAnnuels, setGainsAnnuels] = useState<string>('')
    const [dureeAns, setDureeAns] = useState<string>('1')
    const [roi, setRoi] = useState<number | null>(null)
    const [payback, setPayback] = useState<number | null>(null)
    const [gainNet, setGainNet] = useState<number | null>(null)

    // Structured data for SEO
    const structuredData = generateHowToJsonLd({
        name: 'Calculer le ROI (Return on Investment)',
        description: 'Guide pour calculer le retour sur investissement et le délai de récupération d\'un projet',
        slug: 'roi',
        steps: [
            {
                name: 'Définir l\'investissement initial',
                text: 'Le montant total investi dans le projet (achat, développement, déploiement...)'
            },
            {
                name: 'Estimer les gains annuels',
                text: 'Les revenus ou économies générés par l\'investissement chaque année'
            },
            {
                name: 'Calculer le ROI',
                text: 'ROI = ((Gains totaux - Investissement) / Investissement) × 100'
            },
            {
                name: 'Calculer le payback period',
                text: 'Délai de récupération = Investissement / Gains annuels (en mois)'
            }
        ]
    })

    // FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Quelle est la formule du ROI (Retour sur Investissement) ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "La formule classique du ROI est : (Gain de l'investissement - Coût de l'investissement) / Coût de l'investissement. Le résultat s'exprime généralement en pourcentage pour mesurer la rentabilité d'une action par rapport à son coût initial."
                }
            },
            {
                "@type": "Question",
                "name": "Qu'est-ce qu'un bon ROI pour une PME ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Un 'bon' ROI dépend de l'industrie et du risque. En général, un ROI est considéré comme positif s'il est supérieur au coût du capital (WACC). Pour des actions marketing ou technologiques, on cherche souvent un ROI de 3:1 ou plus (3€ générés pour 1€ investi)."
                }
            },
            {
                "@type": "Question",
                "name": "Pourquoi calculer le ROI de ses projets financiers ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Calculer le ROI permet d'arbitrer entre différents projets et de prioriser les investissements les plus rentables pour la trésorerie. C'est un outil d'aide à la décision indispensable pour sécuriser la croissance d'une PME."
                }
            }
        ]
    }

    const calculer = () => {
        const invest = parseFloat(investissement)
        const gains = parseFloat(gainsAnnuels)
        const duree = parseFloat(dureeAns) || 1

        if (invest > 0 && gains >= 0) {
            const gainsTotaux = gains * duree
            const gainNetCalc = gainsTotaux - invest
            const roiCalc = Math.round(((gainsTotaux - invest) / invest) * 100)
            const paybackMois = gains > 0 ? Math.round((invest / gains) * 12) : 999

            setGainNet(gainNetCalc)
            setRoi(roiCalc)
            setPayback(paybackMois)

            trackCalculatorUse('ROI', roiCalc, {
                investissement: invest,
                gainsAnnuels: gains,
                dureeAns: duree
            })
        }
    }

    const reset = () => {
        setInvestissement('')
        setGainsAnnuels('')
        setDureeAns('1')
        setRoi(null)
        setPayback(null)
        setGainNet(null)
    }

    const getInterpretation = (roi: number, payback: number) => {
        if (roi >= 100) {
            return {
                niveau: 'excellent',
                icone: <CheckCircle className="w-6 h-6 text-green-500" />,
                titre: '✅ ROI Excellent',
                couleur: 'text-green-600',
                bgCouleur: 'bg-green-50 border-green-200',
                message: 'Investissement exceptionnel ! Vous doublez ou plus votre mise. Projet à prioriser.'
            }
        } else if (roi >= 50) {
            return {
                niveau: 'tres_bon',
                icone: <CheckCircle className="w-6 h-6 text-green-500" />,
                titre: '✅ Très Bon ROI',
                couleur: 'text-green-600',
                bgCouleur: 'bg-green-50 border-green-200',
                message: 'Très bonne rentabilité. Investissement solide avec un retour rapide.'
            }
        } else if (roi >= 20) {
            return {
                niveau: 'bon',
                icone: <CheckCircle className="w-6 h-6 text-blue-500" />,
                titre: '✅ Bon ROI',
                couleur: 'text-blue-600',
                bgCouleur: 'bg-blue-50 border-blue-200',
                message: 'Rentabilité correcte. Projet viable, à comparer avec d\'autres opportunités.'
            }
        } else if (roi > 0) {
            return {
                niveau: 'faible',
                icone: <AlertCircle className="w-6 h-6 text-amber-500" />,
                titre: '⚠️ ROI Faible',
                couleur: 'text-amber-600',
                bgCouleur: 'bg-amber-50 border-amber-200',
                message: 'Rentabilité limitée. Évaluez si le risque justifie ce faible retour.'
            }
        } else {
            return {
                niveau: 'negatif',
                icone: <AlertCircle className="w-6 h-6 text-red-500" />,
                titre: '🚨 ROI Négatif',
                couleur: 'text-red-600',
                bgCouleur: 'bg-red-50 border-red-200',
                message: 'Investissement non rentable ! Vous perdez de l\'argent. Reconsidérez le projet.'
            }
        }
    }

    const interpretation = roi !== null && payback !== null ? getInterpretation(roi, payback) : null

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
                                <Calculator className="w-4 h-4 text-purple-400" />
                                <span className="text-sm text-white/90 font-medium">
                                    Calculateur Gratuit
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Calculateur ROI
                                <span className="block text-purple-400 mt-2">
                                    Return on Investment
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Mesurez la rentabilité de vos projets : taux de retour 
                                et délai de récupération de votre investissement.
                            </p>

                            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">30s</div>
                                    <div className="text-sm text-slate-400">Calcul instantané</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">ROI</div>
                                    <div className="text-sm text-slate-400">+ Payback period</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">100%</div>
                                    <div className="text-sm text-slate-400">Gratuit</div>
                                </div>
                            </div>

                            <a
                                href="#calculateur"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition-all duration-300 shadow-lg shadow-purple-500/25"
                            >
                                Calculer mon ROI
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
                                    <Target className="w-8 h-8 text-purple-500" />
                                    Comment calculer le ROI (Return on Investment) ?
                                </h2>
                                
                                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                                    Le <strong>ROI (Return on Investment)</strong> ou <strong>retour sur investissement</strong> mesure 
                                    la <strong>rentabilité d&apos;un projet ou d&apos;une dépense</strong>. C&apos;est l&apos;indicateur clé 
                                    pour comparer différents investissements et prendre des décisions éclairées.
                                </p>

                                {/* Formules */}
                                <div className="not-prose grid md:grid-cols-2 gap-4 mb-8">
                                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">📐 Formule du ROI</h3>
                                        <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
                                            <code className="text-lg font-mono text-purple-600">
                                                ((Gains - Investissement) ÷ Investissement) × 100
                                            </code>
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            Résultat en % : positif = gain, négatif = perte.
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500 p-6 rounded-r-xl">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">⏱️ Payback Period</h3>
                                        <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
                                            <code className="text-lg font-mono text-indigo-600">
                                                Investissement ÷ Gains annuels × 12
                                            </code>
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            Délai en mois pour récupérer votre mise.
                                        </p>
                                    </div>
                                </div>

                                {/* Exemple pratique */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Zap className="w-6 h-6 text-purple-500" />
                                    Exemple de calcul ROI
                                </h3>
                                
                                <div className="not-prose bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
                                    <p className="font-semibold text-slate-900 mb-4 text-lg">
                                        💻 Projet d&apos;automatisation (logiciel + formation)
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <p className="text-sm text-slate-500">Investissement initial</p>
                                            <p className="text-2xl font-bold text-slate-900">25 000 €</p>
                                            <p className="text-xs text-slate-400 mt-1">Licence + déploiement + formation</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <p className="text-sm text-slate-500">Économies annuelles</p>
                                            <p className="text-2xl font-bold text-slate-900">15 000 €</p>
                                            <p className="text-xs text-slate-400 mt-1">Temps gagné + erreurs évitées</p>
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-3 gap-3">
                                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                            <p className="text-sm text-slate-600 mb-1">ROI sur 2 ans</p>
                                            <p className="font-bold text-purple-600 text-xl">20%</p>
                                            <p className="text-xs text-slate-500">((30k-25k)/25k)×100</p>
                                        </div>
                                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                                            <p className="text-sm text-slate-600 mb-1">Payback</p>
                                            <p className="font-bold text-indigo-600 text-xl">20 mois</p>
                                            <p className="text-xs text-slate-500">25k/15k × 12</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <p className="text-sm text-slate-600 mb-1">Gain net</p>
                                            <p className="font-bold text-green-600 text-xl">+5 000 €</p>
                                            <p className="text-xs text-slate-500">30k - 25k</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Benchmarks ROI */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-6 h-6 text-purple-500" />
                                    Qu&apos;est-ce qu&apos;un bon ROI ?
                                </h3>

                                <div className="not-prose overflow-x-auto mb-8">
                                    <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                        <thead>
                                            <tr className="bg-slate-100">
                                                <th className="px-6 py-4 text-left font-bold text-slate-900">Type de projet</th>
                                                <th className="px-6 py-4 text-left font-bold text-slate-900">ROI attendu</th>
                                                <th className="px-6 py-4 text-left font-bold text-slate-900">Payback idéal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-t border-slate-200">
                                                <td className="px-6 py-3 text-slate-700 font-medium">Projet IT / SaaS</td>
                                                <td className="px-6 py-3 text-slate-700">30 - 100%</td>
                                                <td className="px-6 py-3 text-slate-700">6 - 18 mois</td>
                                            </tr>
                                            <tr className="border-t border-slate-200 bg-slate-50">
                                                <td className="px-6 py-3 text-slate-700 font-medium">Marketing / Acquisition</td>
                                                <td className="px-6 py-3 text-slate-700">100 - 500%</td>
                                                <td className="px-6 py-3 text-slate-700">1 - 6 mois</td>
                                            </tr>
                                            <tr className="border-t border-slate-200">
                                                <td className="px-6 py-3 text-slate-700 font-medium">Équipement industriel</td>
                                                <td className="px-6 py-3 text-slate-700">15 - 30%</td>
                                                <td className="px-6 py-3 text-slate-700">24 - 60 mois</td>
                                            </tr>
                                            <tr className="border-t border-slate-200 bg-slate-50">
                                                <td className="px-6 py-3 text-slate-700 font-medium">Immobilier locatif</td>
                                                <td className="px-6 py-3 text-slate-700">5 - 15%</td>
                                                <td className="px-6 py-3 text-slate-700">8 - 15 ans</td>
                                            </tr>
                                            <tr className="border-t border-slate-200">
                                                <td className="px-6 py-3 text-slate-700 font-medium">Formation / Recrutement</td>
                                                <td className="px-6 py-3 text-slate-700">50 - 200%</td>
                                                <td className="px-6 py-3 text-slate-700">6 - 24 mois</td>
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
                                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <Target className="w-7 h-7" />
                                        Calculez votre ROI
                                    </h2>
                                    <p className="text-purple-100 mt-2">Taux de retour + délai de récupération</p>
                                </div>

                                <div className="p-8">
                                    {roi === null ? (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Investissement initial
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={investissement}
                                                        onChange={(e) => setInvestissement(e.target.value)}
                                                        placeholder="Ex: 50000"
                                                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-lg"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">Coût total du projet</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Gains / Économies annuels
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={gainsAnnuels}
                                                        onChange={(e) => setGainsAnnuels(e.target.value)}
                                                        placeholder="Ex: 20000"
                                                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-lg"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€/an</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">Revenus ou économies générés par an</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Durée du projet
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={dureeAns}
                                                        onChange={(e) => setDureeAns(e.target.value)}
                                                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-lg appearance-none bg-white"
                                                    >
                                                        <option value="1">1 an</option>
                                                        <option value="2">2 ans</option>
                                                        <option value="3">3 ans</option>
                                                        <option value="5">5 ans</option>
                                                        <option value="10">10 ans</option>
                                                    </select>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">Sur combien d&apos;années calculer le ROI</p>
                                            </div>

                                            <button
                                                onClick={calculer}
                                                disabled={!investissement || !gainsAnnuels}
                                                className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                                            >
                                                <Calculator className="w-5 h-5" />
                                                Calculer mon ROI
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Résultat principal */}
                                            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-200">
                                                <p className="text-slate-600 mb-2 font-medium">Votre ROI sur {dureeAns} an(s)</p>
                                                <p className={`text-5xl font-bold mb-2 ${roi >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                                                    {roi >= 0 ? '+' : ''}{roi}%
                                                </p>
                                                <div className="mt-4 pt-4 border-t border-purple-200 grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-slate-500">Payback period</p>
                                                        <p className="text-xl font-bold text-slate-700 flex items-center justify-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {payback && payback < 999 ? `${payback} mois` : '∞'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-500">Gain net</p>
                                                        <p className={`text-xl font-bold ${gainNet && gainNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {gainNet && gainNet >= 0 ? '+' : ''}{gainNet?.toLocaleString('fr-FR')} €
                                                        </p>
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
                                                    <TrendingUp className="w-5 h-5 text-purple-500" />
                                                    Comment améliorer ce ROI ?
                                                </h4>
                                                <ul className="space-y-3">
                                                    <li className="flex items-start gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                                        <span className="text-slate-600">Réduisez l&apos;investissement initial (négociation, phasage)</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                                        <span className="text-slate-600">Maximisez les gains (adoption utilisateurs, périmètre élargi)</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                                        <span className="text-slate-600">Raccourcissez le délai avant premiers gains (MVP, pilote)</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                                        <span className="text-slate-600">Comparez avec d&apos;autres projets avant de valider</span>
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
                                            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-6 text-center">
                                                <p className="text-white font-semibold mb-2">
                                                    🚀 Simulez tous vos projets avec FinSight
                                                </p>
                                                <p className="text-purple-100 text-sm mb-4">
                                                    Comparez le ROI de plusieurs scénarios et prenez les meilleures décisions d&apos;investissement.
                                                </p>
                                                <Link
                                                    href="/contact"
                                                    onClick={() => trackCTAClick('roi', '/contact', 'cta_demo')}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all"
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

                {/* FAQ */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                                Questions fréquentes sur le ROI
                            </h2>

                            <div className="space-y-4">
                                {[
                                    {
                                        q: "Comment calculer le ROI ?",
                                        a: "ROI = ((Gains - Investissement) / Investissement) × 100. Par exemple, si vous investissez 10 000€ et gagnez 15 000€, votre ROI est de 50%."
                                    },
                                    {
                                        q: "Qu'est-ce que le payback period ?",
                                        a: "Le payback period (délai de récupération) est le temps nécessaire pour récupérer votre investissement initial. Un payback de 12 mois signifie que vous récupérez votre mise en 1 an."
                                    },
                                    {
                                        q: "ROI annuel ou ROI total : lequel utiliser ?",
                                        a: "Le ROI total mesure la rentabilité sur toute la durée du projet. Le ROI annualisé (ROI total / nombre d'années) permet de comparer des projets de durées différentes."
                                    },
                                    {
                                        q: "Comment prendre en compte le risque dans le ROI ?",
                                        a: "Plus le projet est risqué, plus le ROI exigé doit être élevé. Un projet sûr peut se contenter de 10-15% de ROI, un projet risqué devrait viser 50%+ pour compenser l'incertitude."
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

                {/* Navigation */}
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
                                <Link href="/calculateurs/seuil-rentabilite" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-red-500 hover:shadow-lg transition-all group">
                                    <BarChart3 className="w-8 h-8 text-red-500 mx-auto mb-3" />
                                    <h3 className="font-bold text-slate-900 group-hover:text-red-600">Seuil de Rentabilité</h3>
                                    <p className="text-sm text-slate-500 mt-1">Point mort</p>
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
