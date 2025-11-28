'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, TrendingUp, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
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
                message: `Votre DSO est remarquable ! Vos clients paient rapidement, ce qui optimise votre trésorerie.`
            }
        } else if (dso < s.bon) {
            return {
                niveau: 'bon',
                icone: <CheckCircle className="w-6 h-6 text-blue-500" />,
                titre: '✅ Bon',
                couleur: 'text-blue-600',
                bgCouleur: 'bg-blue-50 border-blue-200',
                message: `Votre DSO est dans la norme du secteur ${secteur}. Continuez ce rythme !`
            }
        } else if (dso < s.surveiller) {
            return {
                niveau: 'surveiller',
                icone: <AlertCircle className="w-6 h-6 text-amber-500" />,
                titre: '⚠️ À surveiller',
                couleur: 'text-amber-600',
                bgCouleur: 'bg-amber-50 border-amber-200',
                message: `Votre DSO commence à être élevé. Il est temps d'accélérer les relances clients.`
            }
        } else {
            return {
                niveau: 'critique',
                icone: <AlertCircle className="w-6 h-6 text-red-500" />,
                titre: '🚨 Critique',
                couleur: 'text-red-600',
                bgCouleur: 'bg-red-50 border-red-200',
                message: `Votre DSO est trop élevé ! Cela bloque votre trésorerie et augmente le risque d'impayés.`
            }
        }
    }

    const interpretation = dso !== null ? getInterpretation(dso, secteur) : null

    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <StructuredData data={structuredData} />
            <Header />

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Hero */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-6">
                        <Calculator className="w-4 h-4 text-accent-primary" />
                        <span className="text-accent-primary text-sm font-medium">Calculateur Gratuit</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-4">
                        Calculateur DSO
                    </h1>
                    <p className="text-xl text-secondary max-w-2xl mx-auto">
                        Calculez votre Days Sales Outstanding en 30 secondes et comparez-le aux benchmarks de votre secteur
                    </p>
                </div>

                {/* Calculateur */}
                <div className="surface rounded-2xl p-8 border border-border-default mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Créances clients (€)
                            </label>
                            <input
                                type="number"
                                value={creances}
                                onChange={(e) => setCreances(e.target.value)}
                                placeholder="150 000"
                                className="w-full px-4 py-3 border border-border-default rounded-lg bg-surface-elevated focus:border-accent-primary focus:ring-2 focus:ring-accent-primary-subtle outline-none transition-all"
                            />
                            <p className="text-xs text-tertiary mt-1">
                                Montant total des factures non encore encaissées
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Chiffre d'affaires annuel (€)
                            </label>
                            <input
                                type="number"
                                value={ca}
                                onChange={(e) => setCA(e.target.value)}
                                placeholder="1 200 000"
                                className="w-full px-4 py-3 border border-border-default rounded-lg bg-surface-elevated focus:border-accent-primary focus:ring-2 focus:ring-accent-primary-subtle outline-none transition-all"
                            />
                            <p className="text-xs text-tertiary mt-1">
                                CA sur les 12 derniers mois
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Secteur d'activité
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['services', 'commerce', 'industrie', 'saas'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSecteur(s as any)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        secteur === s
                                            ? 'bg-accent-primary text-white'
                                            : 'bg-surface-elevated border border-border-default hover:border-accent-primary'
                                    }`}
                                >
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={calculer}
                            disabled={!creances || !ca}
                            className="flex-1 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Calculer mon DSO
                        </button>
                        {dso !== null && (
                            <button
                                onClick={reset}
                                className="px-6 py-3 border-2 border-border-default hover:border-accent-primary rounded-lg font-semibold transition-all"
                            >
                                Réinitialiser
                            </button>
                        )}
                    </div>
                </div>

                {/* Résultat */}
                {dso !== null && interpretation && (
                    <div className="space-y-6 mb-8">
                        <div className="surface rounded-2xl p-8 border-2 border-accent-primary">
                            <div className="text-center mb-6">
                                <p className="text-secondary mb-2">Votre DSO</p>
                                <p className="text-6xl font-bold text-accent-primary mb-2">
                                    {dso} <span className="text-3xl">jours</span>
                                </p>
                                <p className="text-secondary">
                                    Formule : ({parseFloat(creances).toLocaleString('fr-FR')} / {parseFloat(ca).toLocaleString('fr-FR')}) × 365
                                </p>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-secondary mb-3 text-center">
                                    Comparaison avec le secteur {secteur}
                                </p>
                                <BenchmarkBar 
                                    kpiName="DSO" 
                                    currentValue={dso} 
                                    sector={secteur as any}
                                    unit="jours"
                                    inverse={true}
                                />
                            </div>

                            <div className={`p-4 rounded-lg border-2 ${interpretation.bgCouleur}`}>
                                <div className="flex items-start gap-3">
                                    {interpretation.icone}
                                    <div className="flex-1">
                                        <h3 className={`text-lg font-bold mb-1 ${interpretation.couleur}`}>
                                            {interpretation.titre}
                                        </h3>
                                        <p className="text-sm text-secondary">
                                            {interpretation.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions recommandées */}
                        {interpretation.niveau !== 'excellent' && (
                            <div className="surface rounded-2xl p-8 border border-border-default">
                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-accent-primary" />
                                    Comment améliorer votre DSO ?
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-accent-primary font-bold">1.</span>
                                        <div>
                                            <strong>Automatisez vos relances</strong>
                                            <p className="text-sm text-secondary">Mettez en place des relances automatiques à J+15, J+30 et J+45</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-accent-primary font-bold">2.</span>
                                        <div>
                                            <strong>Proposez un escompte</strong>
                                            <p className="text-sm text-secondary">Offrez 2% de remise pour paiement sous 8 jours</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-accent-primary font-bold">3.</span>
                                        <div>
                                            <strong>Passez à la facture électronique</strong>
                                            <p className="text-sm text-secondary">Obligatoire en 2026, elle accélère le traitement</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-accent-primary font-bold">4.</span>
                                        <div>
                                            <strong>Demandez des acomptes</strong>
                                            <p className="text-sm text-secondary">30-50% à la commande pour les prestations longues</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-accent-primary font-bold">5.</span>
                                        <div>
                                            <strong>Suivez votre DSO en temps réel</strong>
                                            <p className="text-sm text-secondary">Utilisez un dashboard automatique comme FinSight</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* CTA FinSight */}
                        <div className="surface rounded-2xl p-8 border-2 border-accent-primary bg-accent-primary-subtle">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold mb-4">
                                    🚀 Suivez votre DSO automatiquement avec FinSight
                                </h3>
                                <p className="text-lg text-secondary mb-6 max-w-2xl mx-auto">
                                    Plus besoin de calculer manuellement. FinSight analyse vos exports comptables 
                                    et calcule votre DSO en temps réel.
                                </p>
                                <ul className="text-left max-w-md mx-auto space-y-2 mb-6">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-accent-primary flex-shrink-0" />
                                        <span>DSO calculé automatiquement chaque jour</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-accent-primary flex-shrink-0" />
                                        <span>Alertes quand le DSO dépasse votre seuil</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-accent-primary flex-shrink-0" />
                                        <span>Liste des factures en retard</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-accent-primary flex-shrink-0" />
                                        <span>Comparaison avec benchmarks sectoriels</span>
                                    </li>
                                </ul>
                                <Link
                                    href="/dashboard"
                                    onClick={() => trackCTAClick('calculateur-dso', '/dashboard', 'essayer-gratuitement')}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-lg transition-all hover:shadow-lg"
                                >
                                    Essayer gratuitement
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <p className="text-sm text-tertiary mt-4">
                                    ✅ Sans engagement • ✅ 10 questions IA gratuites • ✅ Dashboard complet
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info complémentaires */}
                <div className="surface rounded-2xl p-8 border border-border-default">
                    <h3 className="text-2xl font-bold mb-4">📚 En savoir plus sur le DSO</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/blog/calcul-dso-formule-2025"
                            className="p-4 border border-border-default rounded-lg hover:border-accent-primary transition-all group"
                        >
                            <h4 className="font-semibold mb-2 group-hover:text-accent-primary">
                                Guide complet : Comment calculer son DSO →
                            </h4>
                            <p className="text-sm text-secondary">
                                Formule détaillée, exemples concrets et benchmarks sectoriels 2025
                            </p>
                        </Link>
                        <Link
                            href="/blog/5-kpis-financiers-pme"
                            className="p-4 border border-border-default rounded-lg hover:border-accent-primary transition-all group"
                        >
                            <h4 className="font-semibold mb-2 group-hover:text-accent-primary">
                                Les 5 KPIs essentiels pour PME →
                            </h4>
                            <p className="text-sm text-secondary">
                                DSO, marge nette, BFR, trésorerie... Les indicateurs à suivre absolument
                            </p>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
