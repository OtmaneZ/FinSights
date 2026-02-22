'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calculator, PieChart, ArrowRight, AlertCircle, CheckCircle, Target, TrendingUp, DollarSign, BarChart3, Percent, AlertTriangle, FileText, Clock, CheckCircle2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { generateHowToJsonLd } from '@/lib/seo'
import { trackCalculatorUse, trackCTAClick } from '@/lib/analytics'
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory'

export default function CalculateurMarge() {
    const [prixAchat, setPrixAchat] = useState<string>('')
    const [prixVente, setPrixVente] = useState<string>('')
    const [tauxMarge, setTauxMarge] = useState<number | null>(null)
    const [tauxMarque, setTauxMarque] = useState<number | null>(null)
    const [margeEuros, setMargeEuros] = useState<number | null>(null)
    const [coefficient, setCoefficient] = useState<number | null>(null)
    const { saveCalculation } = useCalculatorHistory()

    // Structured data for SEO
    const structuredData = generateHowToJsonLd({
        name: 'Calculer sa Marge Commerciale (Taux de Marge et Taux de Marque)',
        description: 'Guide pour calculer le taux de marge et le taux de marque sur vos produits ou services',
        slug: 'marge',
        steps: [
            {
                name: 'Identifier le prix d\'achat HT',
                text: 'Le coût d\'acquisition de votre produit ou le coût de revient de votre service'
            },
            {
                name: 'Définir le prix de vente HT',
                text: 'Le prix auquel vous vendez à vos clients, hors taxes'
            },
            {
                name: 'Calculer la marge en euros',
                text: 'Marge = Prix de vente - Prix d\'achat'
            },
            {
                name: 'Calculer le taux de marge',
                text: 'Taux de marge = (Marge / Prix d\'achat) × 100'
            },
            {
                name: 'Calculer le taux de marque',
                text: 'Taux de marque = (Marge / Prix de vente) × 100'
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
                "name": "Quelle est la différence entre taux de marge et taux de marque ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Le taux de marge se calcule sur le prix d'achat (Marge/Prix achat × 100), tandis que le taux de marque se calcule sur le prix de vente (Marge/Prix vente × 100). Le taux de marge est toujours supérieur au taux de marque pour un même produit."
                }
            },
            {
                "@type": "Question",
                "name": "Comment calculer le taux de marge ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Taux de marge = ((Prix de vente - Prix d'achat) / Prix d'achat) × 100. Par exemple, si vous achetez à 100€ et vendez à 150€, votre taux de marge est de 50%."
                }
            },
            {
                "@type": "Question",
                "name": "Qu'est-ce qu'un bon taux de marge ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Un bon taux de marge varie selon le secteur : Commerce de détail (30-50%), Distribution (20-40%), Services (50-80%), E-commerce (40-60%). Il faut toujours comparer avec les standards de son secteur."
                }
            },
            {
                "@type": "Question",
                "name": "Comment calculer un prix de vente à partir d'un taux de marge ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Prix de vente = Prix d'achat × (1 + Taux de marge / 100). Par exemple, pour un produit acheté 100€ avec un taux de marge souhaité de 40% : 100 × 1.40 = 140€."
                }
            }
        ]
    }

    const calculer = () => {
        const achat = parseFloat(prixAchat)
        const vente = parseFloat(prixVente)

        if (achat > 0 && vente > 0) {
            const marge = vente - achat
            const tMarge = Math.round((marge / achat) * 100)
            const tMarque = Math.round((marge / vente) * 100)
            const coef = Math.round((vente / achat) * 100) / 100

            setMargeEuros(marge)
            setTauxMarge(tMarge)
            setTauxMarque(tMarque)
            setCoefficient(coef)

            trackCalculatorUse('Marge', tMarge, {
                prixAchat: achat,
                prixVente: vente,
                margeEuros: marge
            })

            // Sauvegarder dans l'historique local
            saveCalculation({
                type: 'marge',
                value: tMarge,
                inputs: { prixAchat: achat, prixVente: vente },
                unit: '%',
            })
        }
    }

    const reset = () => {
        setPrixAchat('')
        setPrixVente('')
        setTauxMarge(null)
        setTauxMarque(null)
        setMargeEuros(null)
        setCoefficient(null)
    }

    const getInterpretation = (tauxMarge: number) => {
        if (tauxMarge >= 100) {
            return {
                niveau: 'excellent',
                icone: <CheckCircle className="w-6 h-6 text-green-500" />,
                titre: '✅ Marge Excellente',
                couleur: 'text-green-600',
                bgCouleur: 'bg-green-50 border-green-200',
                message: 'Taux de marge supérieur à 100% ! Vous doublez votre mise. Rentabilité optimale.'
            }
        } else if (tauxMarge >= 50) {
            return {
                niveau: 'bon',
                icone: <CheckCircle className="w-6 h-6 text-blue-500" />,
                titre: '✅ Bonne Marge',
                couleur: 'text-blue-600',
                bgCouleur: 'bg-blue-50 border-blue-200',
                message: 'Marge saine entre 50-100%. Vous couvrez bien vos charges et dégagez du bénéfice.'
            }
        } else if (tauxMarge >= 25) {
            return {
                niveau: 'moyen',
                icone: <AlertCircle className="w-6 h-6 text-amber-500" />,
                titre: '⚠️ Marge Moyenne',
                couleur: 'text-amber-600',
                bgCouleur: 'bg-amber-50 border-amber-200',
                message: 'Marge 25-50%. Attention à bien maîtriser vos charges fixes pour rester rentable.'
            }
        } else if (tauxMarge > 0) {
            return {
                niveau: 'faible',
                icone: <AlertCircle className="w-6 h-6 text-red-500" />,
                titre: '🚨 Marge Faible',
                couleur: 'text-red-600',
                bgCouleur: 'bg-red-50 border-red-200',
                message: 'Marge inférieure à 25%. Risque de non-rentabilité. Revoyez vos prix ou négociez vos achats.'
            }
        } else {
            return {
                niveau: 'negatif',
                icone: <AlertCircle className="w-6 h-6 text-red-600" />,
                titre: '🚨 Marge Négative',
                couleur: 'text-red-700',
                bgCouleur: 'bg-red-100 border-red-300',
                message: 'Vous vendez à perte ! Action urgente requise : augmentez vos prix ou changez de fournisseur.'
            }
        }
    }

    const interpretation = tauxMarge !== null ? getInterpretation(tauxMarge) : null

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
                                <Calculator className="w-4 h-4 text-orange-400" />
                                <span className="text-sm text-white/90 font-medium">
                                    Calculateur Gratuit
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Marge Commerciale
                                <span className="block text-orange-400 mt-2">
                                    Taux de Marge & Taux de Marque
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Calculez instantanément votre taux de marge, taux de marque 
                                et coefficient multiplicateur.
                            </p>

                            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">30s</div>
                                    <div className="text-sm text-slate-400">Calcul instantané</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">4</div>
                                    <div className="text-sm text-slate-400">Indicateurs calculés</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">100%</div>
                                    <div className="text-sm text-slate-400">Gratuit</div>
                                </div>
                            </div>

                            <a
                                href="#calculateur"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-lg shadow-orange-500/25"
                            >
                                Calculer ma marge
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
                                    <PieChart className="w-8 h-8 text-orange-500" />
                                    Comment calculer sa marge commerciale ?
                                </h2>
                                
                                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                                    La <strong>marge commerciale</strong> est la différence entre le prix de vente et le prix d&apos;achat d&apos;un produit. 
                                    Elle peut s&apos;exprimer de deux façons : le <strong>taux de marge</strong> (calculé sur le prix d&apos;achat) 
                                    et le <strong>taux de marque</strong> (calculé sur le prix de vente).
                                </p>

                                {/* Formules */}
                                <div className="not-prose grid md:grid-cols-2 gap-4 mb-8">
                                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">📐 Taux de Marge</h3>
                                        <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
                                            <code className="text-lg font-mono text-orange-600">
                                                (Marge ÷ Prix d&apos;achat) × 100
                                            </code>
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            Combien vous gagnez par rapport à ce que vous avez payé.
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">📐 Taux de Marque</h3>
                                        <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
                                            <code className="text-lg font-mono text-amber-600">
                                                (Marge ÷ Prix de vente) × 100
                                            </code>
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            Part de marge dans votre prix de vente.
                                        </p>
                                    </div>
                                </div>

                                {/* Exemple pratique */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Target className="w-6 h-6 text-orange-500" />
                                    Exemple de calcul de marge
                                </h3>
                                
                                <div className="not-prose bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
                                    <p className="font-semibold text-slate-900 mb-4 text-lg">
                                        🛒 Produit vendu en e-commerce
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <p className="text-sm text-slate-500">Prix d&apos;achat HT</p>
                                            <p className="text-2xl font-bold text-slate-900">80 €</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <p className="text-sm text-slate-500">Prix de vente HT</p>
                                            <p className="text-2xl font-bold text-slate-900">120 €</p>
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-3 gap-3">
                                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                            <p className="text-sm text-slate-600 mb-1">Marge en €</p>
                                            <p className="font-bold text-orange-600 text-xl">40 €</p>
                                        </div>
                                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                            <p className="text-sm text-slate-600 mb-1">Taux de marge</p>
                                            <p className="font-bold text-orange-600 text-xl">50%</p>
                                            <p className="text-xs text-slate-500">(40/80 × 100)</p>
                                        </div>
                                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                            <p className="text-sm text-slate-600 mb-1">Taux de marque</p>
                                            <p className="font-bold text-amber-600 text-xl">33%</p>
                                            <p className="text-xs text-slate-500">(40/120 × 100)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tableau benchmarks */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-6 h-6 text-orange-500" />
                                    Benchmarks par secteur
                                </h3>

                                <div className="not-prose overflow-x-auto mb-8">
                                    <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                        <thead>
                                            <tr className="bg-slate-100">
                                                <th className="px-6 py-4 text-left font-bold text-slate-900">Secteur</th>
                                                <th className="px-6 py-4 text-left font-bold text-slate-900">Taux de marge moyen</th>
                                                <th className="px-6 py-4 text-left font-bold text-slate-900">Coefficient</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-t border-slate-200">
                                                <td className="px-6 py-3 text-slate-700 font-medium">Commerce de détail</td>
                                                <td className="px-6 py-3 text-slate-700">30 - 50%</td>
                                                <td className="px-6 py-3 text-slate-700">1.3 - 1.5</td>
                                            </tr>
                                            <tr className="border-t border-slate-200 bg-slate-50">
                                                <td className="px-6 py-3 text-slate-700 font-medium">E-commerce</td>
                                                <td className="px-6 py-3 text-slate-700">40 - 60%</td>
                                                <td className="px-6 py-3 text-slate-700">1.4 - 1.6</td>
                                            </tr>
                                            <tr className="border-t border-slate-200">
                                                <td className="px-6 py-3 text-slate-700 font-medium">Restauration</td>
                                                <td className="px-6 py-3 text-slate-700">200 - 400%</td>
                                                <td className="px-6 py-3 text-slate-700">3.0 - 5.0</td>
                                            </tr>
                                            <tr className="border-t border-slate-200 bg-slate-50">
                                                <td className="px-6 py-3 text-slate-700 font-medium">Services / Conseil</td>
                                                <td className="px-6 py-3 text-slate-700">50 - 100%</td>
                                                <td className="px-6 py-3 text-slate-700">1.5 - 2.0</td>
                                            </tr>
                                            <tr className="border-t border-slate-200">
                                                <td className="px-6 py-3 text-slate-700 font-medium">Distribution B2B</td>
                                                <td className="px-6 py-3 text-slate-700">15 - 30%</td>
                                                <td className="px-6 py-3 text-slate-700">1.15 - 1.3</td>
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
                                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <PieChart className="w-7 h-7" />
                                        Calculez votre Marge Commerciale
                                    </h2>
                                    <p className="text-orange-100 mt-2">Taux de marge, taux de marque et coefficient</p>
                                </div>

                                <div className="p-8">
                                    {!tauxMarge ? (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Prix d&apos;achat HT
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={prixAchat}
                                                        onChange={(e) => setPrixAchat(e.target.value)}
                                                        placeholder="Ex: 100"
                                                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-lg"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">Coût d&apos;achat ou coût de revient</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Prix de vente HT
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={prixVente}
                                                        onChange={(e) => setPrixVente(e.target.value)}
                                                        placeholder="Ex: 150"
                                                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-lg"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">Prix facturé au client</p>
                                            </div>

                                            <button
                                                onClick={calculer}
                                                disabled={!prixAchat || !prixVente}
                                                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                                            >
                                                <Calculator className="w-5 h-5" />
                                                Calculer ma marge
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Résultats */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                                                    <p className="text-slate-600 mb-1 text-sm font-medium">Taux de Marge</p>
                                                    <p className="text-4xl font-bold text-orange-600">{tauxMarge}%</p>
                                                </div>
                                                <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200">
                                                    <p className="text-slate-600 mb-1 text-sm font-medium">Taux de Marque</p>
                                                    <p className="text-4xl font-bold text-amber-600">{tauxMarque}%</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                    <p className="text-slate-500 text-sm">Marge en €</p>
                                                    <p className="text-2xl font-bold text-slate-700">{margeEuros?.toLocaleString('fr-FR')} €</p>
                                                </div>
                                                <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                    <p className="text-slate-500 text-sm">Coefficient</p>
                                                    <p className="text-2xl font-bold text-slate-700">× {coefficient}</p>
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

                                            {/* 🔥 NOUVEAU : Diagnostic personnalisé - Déclencheur conversion si marge faible */}
                                            {tauxMarge !== null && tauxMarge < 50 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200"
                                                >
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                                                        <div>
                                                            <h3 className="text-lg font-bold text-amber-900 mb-2">
                                                                ⚡ Votre marge est sous la barre des 50%
                                                            </h3>
                                                            <p className="text-slate-700 text-sm mb-3">
                                                                Avec un taux de marge de <strong>{tauxMarge}%</strong> (taux de marque: {tauxMarque}%), 
                                                                vous risquez de sacrifier de la rentabilité. Une marge saine sécurise votre trésorerie 
                                                                et finance votre croissance.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white rounded-lg p-4 border border-amber-200 mb-4">
                                                        <p className="text-sm font-semibold text-slate-700 mb-2">
                                                            💡 En optimisant votre mix produit/tarifs, vous pourriez :
                                                        </p>
                                                        <ul className="space-y-1 text-sm text-slate-600">
                                                            <li className="flex items-start gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                                <span>Relever vos prix de 8-15% sans perdre vos clients (repositionnement, valeur perçue)</span>
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                                <span>Réduire vos coûts d'achat de 10-20% (renégociation fournisseurs, volumes)</span>
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                                <span>Identifier les produits/clients qui détruisent votre marge (analyse ABC)</span>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <p className="text-sm text-slate-600 mb-4">
                                                        <strong className="text-slate-900">Mon rôle :</strong> analyser la structure de vos marges 
                                                        (par produit, par client, par canal), identifier les pertes cachées et définir une politique 
                                                        tarifaire optimale.
                                                    </p>

                                                    <div className="grid sm:grid-cols-2 gap-3">
                                                        <a
                                                            href="https://calendly.com/zineinsight"
                                                            onClick={() => trackCTAClick('marge-diagnostic', 'calendly', `marge-${tauxMarge}`)}
                                                            className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-amber-900 font-semibold rounded-lg hover:bg-amber-50 transition-all border-2 border-amber-300 hover:border-amber-400"
                                                        >
                                                            <Clock className="w-5 h-5" />
                                                            Identifier mes leviers financiers
                                                        </a>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Recommandations */}
                                            {tauxMarge < 50 && (
                                                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                        <TrendingUp className="w-5 h-5 text-orange-500" />
                                                        Comment améliorer votre marge ?
                                                    </h4>
                                                    <ul className="space-y-3">
                                                        <li className="flex items-start gap-3">
                                                            <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                                            <span className="text-slate-600">Renégociez vos prix d&apos;achat (-10% = quasi doublement de la marge)</span>
                                                        </li>
                                                        <li className="flex items-start gap-3">
                                                            <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                                            <span className="text-slate-600">Valorisez votre offre pour justifier un prix plus élevé</span>
                                                        </li>
                                                        <li className="flex items-start gap-3">
                                                            <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                                            <span className="text-slate-600">Optimisez vos coûts logistiques et de stockage</span>
                                                        </li>
                                                        <li className="flex items-start gap-3">
                                                            <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                                            <span className="text-slate-600">Analysez la marge par produit pour prioriser les plus rentables</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}

                                            {/* 🔥 NOUVEAU : Parcours Guidé - Next Steps */}
                                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
                                                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                    🚀 Parcours guidé pour optimiser vos marges
                                                </h4>
                                                <p className="text-sm text-slate-600 mb-5">
                                                    Vos marges déterminent directement votre rentabilité et votre capacité d'investissement. 
                                                    Voici comment les piloter efficacement :
                                                </p>

                                                <div className="space-y-4">
                                                    {/* Step 1 */}
                                                    <Link
                                                        href="/calculateurs/seuil-rentabilite"
                                                        onClick={() => trackCTAClick('marge-next-seuil', '/calculateurs/seuil-rentabilite', `marge-${tauxMarge}`)}
                                                        className="block bg-white rounded-lg p-4 border-2 border-orange-200 hover:border-orange-400 hover:shadow-md transition-all group"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                                                                1
                                                            </div>
                                                            <div className="flex-1">
                                                                <h5 className="font-bold text-slate-900 group-hover:text-orange-600 flex items-center gap-2">
                                                                    Calculez votre seuil de rentabilité
                                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                                </h5>
                                                                <p className="text-sm text-slate-600 mt-1">
                                                                    Une marge faible augmente votre seuil de rentabilité et fragilise votre équilibre. 
                                                                    Vérifiez combien de CA il vous faut pour couvrir vos charges fixes.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>

                                                    {/* Step 2 */}
                                                    <Link
                                                        href="/blog/optimiser-marges-pme-strategie-pricing"
                                                        className="block bg-white rounded-lg p-4 border-2 border-orange-200 hover:border-orange-400 hover:shadow-md transition-all group"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                                                                2
                                                            </div>
                                                            <div className="flex-1">
                                                                <h5 className="font-bold text-slate-900 group-hover:text-orange-600 flex items-center gap-2">
                                                                    Lisez notre guide : "7 leviers pour améliorer vos marges"
                                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                                </h5>
                                                                <p className="text-sm text-slate-600 mt-1">
                                                                    Stratégie tarifaire, renégociation fournisseurs, mix produit, analyse ABC... 
                                                                    Les tactiques qui fonctionnent en PME.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>

                                                    {/* Step 3 */}
                                                    <a
                                                        href="https://calendly.com/zineinsight"
                                                        onClick={() => trackCTAClick('marge-parcours-final', 'calendly', `marge-${tauxMarge}-guided`)}
                                                        className="block bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg p-4 hover:from-orange-600 hover:to-amber-600 transition-all group"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-orange-600 flex items-center justify-center font-bold">
                                                                3
                                                            </div>
                                                            <div className="flex-1">
                                                                <h5 className="font-bold text-white flex items-center gap-2">
                                                                    Discutons de votre structure tarifaire
                                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                                </h5>
                                                                <p className="text-sm text-orange-100 mt-1">
                                                                    Analysez vos marges par produit/client, 
                                                                    identifiez les pertes cachées et définissez une stratégie pricing claire.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>

                                                <div className="mt-5 pt-5 border-t border-orange-200">
                                                    <p className="text-xs text-slate-600 italic">
                                                        💬 <strong>Retour d'expérience :</strong> "J'ai vu des PME perdre de l'argent sur 30% de leurs ventes 
                                                        sans s'en rendre compte. Une analyse marge par produit et par client révèle souvent 
                                                        des surprises... et libère 5-15% de rentabilité en quelques semaines."
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
                                                    � Vos marges stagnent ou baissent ?
                                                </p>
                                                <p className="text-white text-sm mb-4 leading-relaxed">
                                                    Je vous aide à analyser la structure de vos marges (par produit, client, canal), 
                                                    identifier les pertes cachées et définir une politique tarifaire optimale.
                                                </p>
                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    <Link
                                                        href="/consulting"
                                                        onClick={() => trackCTAClick('marge-result', '/consulting', 'audit-strategique')}
                                                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-all"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        Voir l'Audit Stratégique (1 990€)
                                                    </Link>
                                                    <a
                                                        href="https://calendly.com/zineinsight"
                                                        onClick={() => trackCTAClick('marge-result', 'calendly', `diagnostic-marge-${tauxMarge}`)}
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
                                <p className="text-accent-primary font-semibold mb-2">💡 Vos marges stagnent ou baissent ?</p>
                                <p className="text-white text-lg mb-6">
                                    Mon <strong>Audit Stratégique (1 990€)</strong> analyse en profondeur votre structure tarifaire, 
                                    identifie vos produits/clients non rentables et propose des leviers concrets pour relever vos marges. 
                                    Je vous aide ensuite à piloter cette optimisation mois après mois.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link 
                                        href="/consulting"
                                        onClick={() => trackCTAClick('marge-middle', '/consulting', 'audit-strategique')}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all"
                                    >
                                        <FileText className="w-5 h-5" />
                                        Voir l&apos;Audit Stratégique (1 990€)
                                    </Link>
                                    <a
                                        href="https://calendly.com/zineinsight"
                                        onClick={() => trackCTAClick('marge-middle', 'calendly', 'diagnostic-30min')}
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

                {/* CTA Score FinSight — Boucle retour */}
                <section className="py-12 bg-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-xl mx-auto text-center">
                            <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary-subtle)] flex items-center justify-center mx-auto mb-4">
                                <Target className="w-6 h-6 text-[var(--accent-primary)]" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Votre marge est enregistrée</h3>
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
                                    La marge n'est qu'un indicateur. Analysez l'ensemble de votre santé financière.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Seuil Rentabilité */}
                                <Link
                                    href="/calculateurs/seuil-rentabilite"
                                    className="group bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border-2 border-red-200 hover:border-red-400 hover:shadow-xl transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <BarChart3 className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600">
                                        Seuil de Rentabilité
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Une marge faible augmente votre seuil de rentabilité. Vérifiez si vous êtes à l'équilibre.
                                    </p>
                                    <div className="flex items-center text-red-600 font-semibold text-sm">
                                        Calculer mon seuil
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
                                        Vos marges financent vos investissements. Mesurez le retour sur vos projets stratégiques.
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

                {/* FAQ */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                                Questions fréquentes sur la Marge Commerciale
                            </h2>

                            <div className="space-y-4">
                                {[
                                    {
                                        q: "Quelle est la différence entre taux de marge et taux de marque ?",
                                        a: "Le taux de marge se calcule sur le prix d'achat (Marge/Prix achat × 100), tandis que le taux de marque se calcule sur le prix de vente (Marge/Prix vente × 100). Le taux de marge est toujours supérieur au taux de marque."
                                    },
                                    {
                                        q: "Comment calculer un prix de vente à partir d'un taux de marge ?",
                                        a: "Prix de vente = Prix d'achat × (1 + Taux de marge / 100). Exemple : pour un produit à 100€ avec 40% de marge → 100 × 1.40 = 140€."
                                    },
                                    {
                                        q: "Qu'est-ce que le coefficient multiplicateur ?",
                                        a: "C'est le rapport Prix de vente / Prix d'achat. Un coefficient de 1.5 signifie que vous multipliez votre prix d'achat par 1.5 pour obtenir le prix de vente (soit 50% de taux de marge)."
                                    },
                                    {
                                        q: "Comment améliorer sa marge commerciale ?",
                                        a: "Deux leviers : 1) Réduire le prix d'achat (négociation fournisseurs, achats groupés) ou 2) Augmenter le prix de vente (différenciation, valeur perçue, services additionnels)."
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
