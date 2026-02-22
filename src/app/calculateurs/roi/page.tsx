'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calculator, Target, ArrowRight, AlertCircle, CheckCircle, TrendingUp, DollarSign, BarChart3, Clock, Zap, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { generateHowToJsonLd } from '@/lib/seo'
import { trackCalculatorUse, trackCTAClick } from '@/lib/analytics'
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory'

export default function CalculateurROI() {
    const [investissement, setInvestissement] = useState<string>('')
    const [gainsAnnuels, setGainsAnnuels] = useState<string>('')
    const [dureeAns, setDureeAns] = useState<string>('1')
    const [roi, setRoi] = useState<number | null>(null)
    const [payback, setPayback] = useState<number | null>(null)
    const [gainNet, setGainNet] = useState<number | null>(null)
    const { saveCalculation } = useCalculatorHistory()

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
                "name": "ROI et délai de récupération (payback) : quelle différence ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Le ROI mesure la rentabilité totale en pourcentage : combien vous gagnez par rapport à votre investissement. Le payback (délai de récupération) mesure la vitesse de retour : en combien de mois récupérez-vous votre mise. Pour une PME, les deux sont complémentaires : un bon ROI à 5 ans peut créer une tension de trésorerie à 18 mois si le payback est trop long."
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

            // Sauvegarder dans l'historique local
            saveCalculation({
                type: 'roi',
                value: roiCalc,
                inputs: { investissement: invest, gainsAnnuels: gains, dureeAns: duree },
                unit: '%',
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
                                    Outil de décision financière · PME 1–20M€
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Calculateur ROI
                                <span className="block text-purple-400 mt-2">
                                    Décidez en 30 secondes
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                                ROI, payback period et interprétation par type de projet.
                                Structurez vos décisions d&apos;investissement avec une logique DAF.
                            </p>

                            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">30s</div>
                                    <div className="text-sm text-slate-400">Résultat immédiat</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">ROI</div>
                                    <div className="text-sm text-slate-400">+ Payback period</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">PME</div>
                                    <div className="text-sm text-slate-400">Benchmarks sectoriels</div>
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

                                {/* ─── Section interprétation experte ─── */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Target className="w-6 h-6 text-purple-500" />
                                    Comment interpréter votre ROI ?
                                </h3>

                                <div className="not-prose space-y-4 mb-8">
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                                        <h4 className="font-bold text-slate-900 mb-2 text-lg">
                                            Comment interpréter un ROI de 12% ?
                                        </h4>
                                        <p className="text-slate-700 leading-relaxed">
                                            Un ROI de 12% sur un projet à 3 ans signifie que pour 100€ investis, vous récupérez 112€.
                                            C&apos;est <strong>acceptable pour un équipement industriel</strong> (dont le benchmark est 15-30%),
                                            mais <strong>insuffisant pour un projet IT ou marketing</strong>. L&apos;interprétation dépend toujours
                                            du type d&apos;investissement, du risque et du coût de votre capital.
                                            Règle pratique : un ROI doit être supérieur au taux de votre emprunt + une prime de risque de 5-10%.
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                                        <h4 className="font-bold text-slate-900 mb-2 text-lg">
                                            À partir de quel ROI un projet est-il viable ?
                                        </h4>
                                        <p className="text-slate-700 leading-relaxed">
                                            Il n&apos;existe pas de seuil universel, mais deux règles pratiques pour les PME :
                                        </p>
                                        <ul className="mt-3 space-y-2 text-slate-700">
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-500 font-bold mt-0.5">1.</span>
                                                <span><strong>Règle du coût du capital :</strong> votre ROI doit dépasser le coût moyen de votre dette (taux crédit bancaire). Si vous empruntez à 4%, un ROI à 6% laisse une marge réelle de 2%.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-purple-500 font-bold mt-0.5">2.</span>
                                                <span><strong>Règle de l&apos;opportunité :</strong> comparez toujours vos projets entre eux. Si projet A offre 30% et projet B offre 15%, B n&apos;est viable que si A est impossible à financer.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                                        <h4 className="font-bold text-slate-900 mb-2 text-lg">
                                            ROI vs délai de récupération (payback) : quelle différence ?
                                        </h4>
                                        <p className="text-slate-700 leading-relaxed mb-3">
                                            Ces deux indicateurs mesurent des choses différentes et sont complémentaires :
                                        </p>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                                <p className="font-semibold text-purple-800 mb-1">ROI (%)</p>
                                                <p className="text-sm text-slate-700">Mesure la <strong>rentabilité totale</strong>. Répond à : &laquo; est-ce que ce projet crée de la valeur ? &raquo; Un ROI de 50% signifie que vous gagnez 1,5€ pour 1€ investi.</p>
                                            </div>
                                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                                                <p className="font-semibold text-indigo-800 mb-1">Payback (mois)</p>
                                                <p className="text-sm text-slate-700">Mesure la <strong>vitesse de retour</strong>. Répond à : &laquo; quand récupère-t-on la mise ? &raquo; Crucial pour les PME à trésorerie tendue — un bon ROI à 5 ans peut créer une tension cash à 18 mois.</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 mt-3 italic">
                                            Règle DAF : priorisez les projets à fort ROI <strong>et</strong> payback court. Quand les deux s&apos;opposent, l&apos;état de votre trésorerie fait l&apos;arbitrage.
                                        </p>
                                    </div>
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

                                            {/* 🔥 NOUVEAU : Diagnostic personnalisé - Déclencheur conversion si ROI faible */}
                                            {roi !== null && payback !== null && roi < 50 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200"
                                                >
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                                                        <div>
                                                            <h3 className="text-lg font-bold text-amber-900 mb-2">
                                                                ⚡ Votre ROI est sous la barre des 50%
                                                            </h3>
                                                            <p className="text-slate-700 text-sm mb-3">
                                                                Avec un ROI de <strong>{roi}%</strong> et un payback de <strong>{payback} mois</strong>, 
                                                                ce projet pourrait mobiliser du cash sans retour optimal.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white rounded-lg p-4 border border-amber-200 mb-4">
                                                        <p className="text-sm font-semibold text-slate-700 mb-2">
                                                            💡 En optimisant ce projet, vous pourriez :
                                                        </p>
                                                        <ul className="space-y-1 text-sm text-slate-600">
                                                            <li className="flex items-start gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                                <span>Réduire le coût initial de 20-30% (négociation, alternatives)</span>
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                                <span>Augmenter les gains de 15-40% (meilleure adoption, scope élargi)</span>
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                                <span>Raccourcir le délai de gains de 25% (pilote, MVP, phasage)</span>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <p className="text-sm text-slate-600 mb-4">
                                                        <strong className="text-slate-900">Mon rôle :</strong> analyser vos projets stratégiques, 
                                                        arbitrer selon le ROI et le risque, puis vous aider à piloter leur déploiement.
                                                    </p>

                                                    <div className="grid sm:grid-cols-2 gap-3">
                                                        <a
                                                            href="https://calendly.com/zineinsight"
                                                            onClick={() => trackCTAClick('roi-diagnostic', 'calendly', `roi-${roi}-payback-${payback}`)}
                                                            className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-amber-900 font-semibold rounded-lg hover:bg-amber-50 transition-all border-2 border-amber-300 hover:border-amber-400"
                                                        >
                                                            <Clock className="w-5 h-5" />
                                                            Identifier mes leviers financiers
                                                        </a>
                                                    </div>
                                                </motion.div>
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

                                            {/* 🔥 NOUVEAU : Parcours Guidé - Next Steps */}
                                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                                                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                    🚀 Parcours guidé pour optimiser votre ROI
                                                </h4>
                                                <p className="text-sm text-slate-600 mb-5">
                                                    Le ROI ne se suffit pas à lui-même. Suivez ces 3 étapes pour prendre une décision éclairée :
                                                </p>

                                                <div className="space-y-4">
                                                    {/* Step 1 */}
                                                    <Link
                                                        href="/calculateurs/bfr"
                                                        onClick={() => trackCTAClick('roi-next-bfr', '/calculateurs/bfr', `roi-${roi}`)}
                                                        className="block bg-white rounded-lg p-4 border-2 border-purple-200 hover:border-purple-400 hover:shadow-md transition-all group"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                                                                1
                                                            </div>
                                                            <div className="flex-1">
                                                                <h5 className="font-bold text-slate-900 group-hover:text-purple-600 flex items-center gap-2">
                                                                    Calculez votre BFR
                                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                                </h5>
                                                                <p className="text-sm text-slate-600 mt-1">
                                                                    Un investissement peut augmenter votre BFR (stocks, créances). 
                                                                    Vérifiez l'impact sur votre trésorerie avant de valider.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>

                                                    {/* Step 2 */}
                                                    <Link
                                                        href="/blog/arbitrage-projets-roi-priorites"
                                                        className="block bg-white rounded-lg p-4 border-2 border-purple-200 hover:border-purple-400 hover:shadow-md transition-all group"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                                                                2
                                                            </div>
                                                            <div className="flex-1">
                                                                <h5 className="font-bold text-slate-900 group-hover:text-purple-600 flex items-center gap-2">
                                                                    Lisez notre guide : "Comment arbitrer entre plusieurs projets ?"
                                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                                </h5>
                                                                <p className="text-sm text-slate-600 mt-1">
                                                                    Matrice de décision : ROI vs Risque vs Urgence stratégique. 
                                                                    Comment prioriser quand tout semble urgent.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>

                                                    {/* Step 3 */}
                                                    <a
                                                        href="https://calendly.com/zineinsight"
                                                        onClick={() => trackCTAClick('roi-parcours-final', 'calendly', `roi-${roi}-guided`)}
                                                        className="block bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-4 hover:from-purple-600 hover:to-indigo-600 transition-all group"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold">
                                                                3
                                                            </div>
                                                            <div className="flex-1">
                                                                <h5 className="font-bold text-white flex items-center gap-2">
                                                                    Discutons de votre stratégie d'investissement
                                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                                </h5>
                                                                <p className="text-sm text-purple-100 mt-1">
                                                                    Passez en revue vos projets, 
                                                                    calculez leur ROI réel et définissez un ordre de priorité clair.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>

                                                <div className="mt-5 pt-5 border-t border-purple-200">
                                                    <p className="text-xs text-slate-600 italic">
                                                        💬 <strong>Retour d'expérience :</strong> "Mes clients prennent souvent des décisions d'investissement 
                                                        sur la base du ROI seul. Mais il faut aussi regarder l'impact trésorerie (BFR), 
                                                        le risque d'exécution et l'alignement stratégique. C'est ce que je vous aide à clarifier."
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={reset}
                                                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
                                            >
                                                Nouveau calcul
                                            </button>

                                            {/* CTA - Reformulé pour conversion */}
                                            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-center">
                                                <p className="text-accent-primary font-semibold mb-2">
                                                    � Besoin d'aide pour arbitrer entre vos projets ?
                                                </p>
                                                <p className="text-white text-sm mb-4 leading-relaxed">
                                                    Je vous aide à évaluer le ROI réel de vos investissements (coûts cachés, gains sous-estimés) 
                                                    et à prioriser selon le couple ROI/Risque/Urgence.
                                                </p>
                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    <Link
                                                        href="/consulting"
                                                        onClick={() => trackCTAClick('roi-result', '/consulting', 'audit-strategique')}
                                                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-all"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        Voir l'Audit Stratégique (1 990€)
                                                    </Link>
                                                    <a
                                                        href="https://calendly.com/zineinsight"
                                                        onClick={() => trackCTAClick('roi-result', 'calendly', `diagnostic-roi-${roi}`)}
                                                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent-primary text-white rounded-lg font-semibold hover:bg-accent-primary-hover transition-all"
                                                    >
                                                        <Clock className="w-4 h-4" />
                                                        Identifier mes leviers financiers
                                                    </a>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-3">
                                                    Réponse sous 24h · Plan d'action personnalisé · Sans engagement
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CTA Audit Stratégique - Reformulé */}
                <section className="py-8 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto">
                            <div className="not-prose bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-center">
                                <p className="text-accent-primary font-semibold mb-2">💡 Besoin d&apos;aide pour arbitrer vos projets ?</p>
                                <p className="text-white text-lg mb-6">
                                    Mon <strong>Audit Stratégique (1 990€)</strong> analyse le ROI réel de vos investissements passés et futurs, 
                                    identifie vos meilleurs leviers de croissance et vous propose une stratégie d&apos;allocation budgétaire optimale. 
                                    Je vous aide ensuite à piloter ces projets en temps réel.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link 
                                        href="/consulting"
                                        onClick={() => trackCTAClick('roi-middle', '/consulting', 'audit-strategique')}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all"
                                    >
                                        <FileText className="w-5 h-5" />
                                        Voir l&apos;Audit Stratégique (1 990€)
                                    </Link>
                                    <a
                                        href="https://calendly.com/zineinsight"
                                        onClick={() => trackCTAClick('roi-middle', 'calendly', 'diagnostic-30min')}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-primary text-white font-semibold rounded-lg hover:bg-accent-primary-hover transition-all"
                                    >
                                        <Clock className="w-5 h-5" />
                                        Identifier mes leviers financiers
                                    </a>
                                </div>
                                <p className="text-xs text-slate-400 mt-4">
                                    Réponse sous 24h · Plan d'action personnalisé · Sans engagement
                                </p>
                            </div>
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
                                        a: "La formule du ROI est : ((Gains totaux – Investissement) ÷ Investissement) × 100. Exemple : vous investissez 20 000€ et générez 30 000€ de gains sur 2 ans → ROI = ((30 000 – 20 000) ÷ 20 000) × 100 = 50%. Un ROI positif signifie que le projet crée de la valeur. Un ROI négatif signifie que vous perdez de l'argent."
                                    },
                                    {
                                        q: "Quel est un bon ROI pour une PME ?",
                                        a: "Il n'existe pas de ROI universel 'bon' ou 'mauvais' — tout dépend du type de projet et du risque. Pour un projet IT ou SaaS, visez 30 à 100% avec un payback sous 18 mois. Pour un équipement industriel, 15 à 30% avec un payback de 24 à 60 mois est standard. Pour du marketing, un ratio 3:1 minimum (100% de ROI) est la règle. En pratique, votre ROI doit toujours dépasser le coût de votre dette plus une prime de risque."
                                    },
                                    {
                                        q: "ROI et délai de récupération : quelle différence ?",
                                        a: "Le ROI mesure la rentabilité totale d'un projet (en %). Le délai de récupération (payback period) mesure le temps nécessaire pour récupérer l'investissement initial (en mois). Ces deux indicateurs sont complémentaires : un projet peut avoir un excellent ROI sur 5 ans mais un payback de 36 mois qui crée une tension de trésorerie. Pour les PME à cash limité, le payback est souvent le premier critère d'arbitrage."
                                    },
                                    {
                                        q: "Comment prendre en compte le risque dans le ROI ?",
                                        a: "Le risque doit se traduire en prime de ROI exigé. Un projet sûr (remplacement d'équipement, économies certifiées) peut se contenter de 10-15% de ROI. Un projet incertain (nouveau marché, développement produit) devrait viser 50%+ pour compenser l'incertitude. En DAF, on parle de 'ROI pondéré par le risque' : un ROI de 80% avec 50% de chances de succès vaut effectivement 40%."
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

                {/* CTA Score FinSight — Boucle retour */}
                <section className="py-12 bg-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-xl mx-auto text-center">
                            <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary-subtle)] flex items-center justify-center mx-auto mb-4">
                                <Target className="w-6 h-6 text-[var(--accent-primary)]" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Votre ROI est enregistré</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Ce résultat alimente le pilier <strong>Rentabilité</strong> de votre Score FinSight™. 
                                Continuez avec 1 ou 2 indicateurs de plus pour obtenir un diagnostic exploitable.
                            </p>
                            <Link
                                href="/mon-diagnostic"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors shadow-md"
                            >
                                Voir mon Score FinSight™
                                <ArrowRight className="w-4 h-4" />
                            </Link>
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
                                    Le ROI n'est qu'un indicateur. Analysez l'ensemble de votre santé financière.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {/* BFR */}
                                <Link
                                    href="/calculateurs/bfr"
                                    className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <DollarSign className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600">
                                        Calculateur BFR
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Mesurez le cash immobilisé dans votre cycle d'exploitation. Un investissement peut augmenter votre BFR.
                                    </p>
                                    <div className="flex items-center text-green-600 font-semibold text-sm">
                                        Calculer mon BFR
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>

                                {/* DSO */}
                                <Link
                                    href="/calculateurs/dso"
                                    className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                                        Calculateur DSO
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Mesurez votre délai moyen de paiement clients. Un DSO élevé bloque du cash pour vos investissements.
                                    </p>
                                    <div className="flex items-center text-blue-600 font-semibold text-sm">
                                        Calculer mon DSO
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
