'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, TrendingUp, ArrowRight, AlertCircle, CheckCircle, Info } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CalculateurBFR() {
    const [stocks, setStocks] = useState<string>('')
    const [creances, setCreances] = useState<string>('')
    const [dettes, setDettes] = useState<string>('')
    const [ca, setCA] = useState<string>('')
    const [bfr, setBFR] = useState<number | null>(null)
    const [joursCA, setJoursCA] = useState<number | null>(null)

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
                message: `Situation idéale ! Vos fournisseurs financent votre activité. Vous encaissez avant de payer.`
            }
        }

        if (!jours) {
            return {
                niveau: 'info',
                icone: <Info className="w-6 h-6 text-blue-500" />,
                titre: 'ℹ️ BFR positif',
                couleur: 'text-blue-600',
                bgCouleur: 'bg-blue-50 border-blue-200',
                message: `Vous devez financer votre cycle d'exploitation. Renseignez votre CA pour une analyse complète.`
            }
        }

        if (jours < 30) {
            return {
                niveau: 'bon',
                icone: <CheckCircle className="w-6 h-6 text-blue-500" />,
                titre: '✅ Bon - BFR maîtrisé',
                couleur: 'text-blue-600',
                bgCouleur: 'bg-blue-50 border-blue-200',
                message: `Votre BFR représente moins d'un mois de CA. C'est une bonne gestion du cycle d'exploitation.`
            }
        } else if (jours < 60) {
            return {
                niveau: 'surveiller',
                icone: <AlertCircle className="w-6 h-6 text-amber-500" />,
                titre: '⚠️ À surveiller',
                couleur: 'text-amber-600',
                bgCouleur: 'bg-amber-50 border-amber-200',
                message: `Votre BFR représente ${jours} jours de CA. Optimisez vos délais de paiement clients et fournisseurs.`
            }
        } else if (jours < 90) {
            return {
                niveau: 'attention',
                icone: <AlertCircle className="w-6 h-6 text-orange-500" />,
                titre: '⚠️ Attention',
                couleur: 'text-orange-600',
                bgCouleur: 'bg-orange-50 border-orange-200',
                message: `Votre BFR est élevé (${jours} jours de CA). Il mobilise beaucoup de trésorerie.`
            }
        } else {
            return {
                niveau: 'critique',
                icone: <AlertCircle className="w-6 h-6 text-red-500" />,
                titre: '🚨 Critique',
                couleur: 'text-red-600',
                bgCouleur: 'bg-red-50 border-red-200',
                message: `Votre BFR est très élevé (${jours} jours de CA) ! Action urgente requise pour libérer de la trésorerie.`
            }
        }
    }

    const interpretation = bfr !== null ? getInterpretation(bfr, joursCA) : null

    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Hero */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-6">
                        <Calculator className="w-4 h-4 text-accent-primary" />
                        <span className="text-accent-primary text-sm font-medium">Calculateur Gratuit</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-4">
                        Calculateur BFR
                    </h1>
                    <p className="text-xl text-secondary max-w-2xl mx-auto">
                        Calculez votre Besoin en Fonds de Roulement et identifiez vos leviers d'optimisation
                    </p>
                </div>

                {/* Info BFR */}
                <div className="surface rounded-xl p-6 border border-blue-200 bg-blue-50 mb-8">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        Qu'est-ce que le BFR ?
                    </h3>
                    <p className="text-sm text-secondary mb-3">
                        Le <strong>Besoin en Fonds de Roulement (BFR)</strong> représente l'argent immobilisé 
                        dans votre cycle d'exploitation. C'est la différence entre ce qu'on vous doit 
                        (stocks + créances clients) et ce que vous devez (dettes fournisseurs).
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <code className="text-sm font-mono text-blue-700">
                            BFR = Stocks + Créances clients - Dettes fournisseurs
                        </code>
                    </div>
                </div>

                {/* Calculateur */}
                <div className="surface rounded-2xl p-8 border border-border-default mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Stocks (€)
                            </label>
                            <input
                                type="number"
                                value={stocks}
                                onChange={(e) => setStocks(e.target.value)}
                                placeholder="50 000"
                                className="w-full px-4 py-3 border border-border-default rounded-lg bg-surface-elevated focus:border-accent-primary focus:ring-2 focus:ring-accent-primary-subtle outline-none transition-all"
                            />
                            <p className="text-xs text-tertiary mt-1">
                                Valeur des marchandises en stock
                            </p>
                        </div>

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
                                Factures clients non encaissées
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Dettes fournisseurs (€)
                            </label>
                            <input
                                type="number"
                                value={dettes}
                                onChange={(e) => setDettes(e.target.value)}
                                placeholder="80 000"
                                className="w-full px-4 py-3 border border-border-default rounded-lg bg-surface-elevated focus:border-accent-primary focus:ring-2 focus:ring-accent-primary-subtle outline-none transition-all"
                            />
                            <p className="text-xs text-tertiary mt-1">
                                Factures fournisseurs non payées
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                CA annuel (€) <span className="text-tertiary">(optionnel)</span>
                            </label>
                            <input
                                type="number"
                                value={ca}
                                onChange={(e) => setCA(e.target.value)}
                                placeholder="1 200 000"
                                className="w-full px-4 py-3 border border-border-default rounded-lg bg-surface-elevated focus:border-accent-primary focus:ring-2 focus:ring-accent-primary-subtle outline-none transition-all"
                            />
                            <p className="text-xs text-tertiary mt-1">
                                Pour calculer le BFR en jours de CA
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={calculer}
                            disabled={!stocks && !creances && !dettes}
                            className="flex-1 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Calculer mon BFR
                        </button>
                        {bfr !== null && (
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
                {bfr !== null && interpretation && (
                    <div className="space-y-6 mb-8">
                        <div className="surface rounded-2xl p-8 border-2 border-accent-primary">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="text-center">
                                    <p className="text-sm text-secondary mb-2">Stocks</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {parseFloat(stocks || '0').toLocaleString('fr-FR')} €
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-secondary mb-2">+ Créances clients</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {parseFloat(creances || '0').toLocaleString('fr-FR')} €
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-secondary mb-2">- Dettes fournisseurs</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {parseFloat(dettes || '0').toLocaleString('fr-FR')} €
                                    </p>
                                </div>
                            </div>

                            <div className="text-center pt-6 border-t-2 border-border-default">
                                <p className="text-secondary mb-2">Votre BFR</p>
                                <p className={`text-6xl font-bold mb-2 ${bfr < 0 ? 'text-green-600' : 'text-accent-primary'}`}>
                                    {bfr.toLocaleString('fr-FR')} €
                                </p>
                                {joursCA !== null && (
                                    <p className="text-lg text-secondary">
                                        Soit <strong>{joursCA} jours de CA</strong>
                                    </p>
                                )}
                            </div>

                            <div className={`mt-6 p-4 rounded-lg border-2 ${interpretation.bgCouleur}`}>
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

                        {/* Analyse détaillée */}
                        <div className="surface rounded-2xl p-8 border border-border-default">
                            <h3 className="text-2xl font-bold mb-4">📊 Analyse détaillée</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 bg-surface-elevated rounded-lg">
                                    <h4 className="font-semibold mb-2 text-blue-600">Stocks</h4>
                                    <p className="text-sm text-secondary mb-2">
                                        {parseFloat(stocks || '0').toLocaleString('fr-FR')} €
                                    </p>
                                    <p className="text-xs text-tertiary">
                                        {bfr > 0 && stocks && parseFloat(stocks) > 0
                                            ? `${Math.round((parseFloat(stocks) / bfr) * 100)}% du BFR`
                                            : 'Pas de stock immobilisé'}
                                    </p>
                                </div>

                                <div className="p-4 bg-surface-elevated rounded-lg">
                                    <h4 className="font-semibold mb-2 text-green-600">Créances clients</h4>
                                    <p className="text-sm text-secondary mb-2">
                                        {parseFloat(creances || '0').toLocaleString('fr-FR')} €
                                    </p>
                                    <p className="text-xs text-tertiary">
                                        {ca && creances
                                            ? `DSO estimé: ${Math.round((parseFloat(creances) / parseFloat(ca)) * 365)} jours`
                                            : 'Renseignez le CA pour calcul DSO'}
                                    </p>
                                </div>

                                <div className="p-4 bg-surface-elevated rounded-lg">
                                    <h4 className="font-semibold mb-2 text-red-600">Dettes fournisseurs</h4>
                                    <p className="text-sm text-secondary mb-2">
                                        {parseFloat(dettes || '0').toLocaleString('fr-FR')} €
                                    </p>
                                    <p className="text-xs text-tertiary">
                                        {dettes && parseFloat(dettes) > 0
                                            ? 'Crédit fournisseur favorable'
                                            : 'Pas de crédit fournisseur'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions recommandées */}
                        {bfr > 0 && (
                            <div className="surface rounded-2xl p-8 border border-border-default">
                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-accent-primary" />
                                    Comment réduire votre BFR ?
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-accent-primary font-bold">1.</span>
                                        <div>
                                            <strong>Réduire les stocks</strong>
                                            <p className="text-sm text-secondary">Optimisez vos rotations et évitez le sur-stockage</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-accent-primary font-bold">2.</span>
                                        <div>
                                            <strong>Accélérer les encaissements clients</strong>
                                            <p className="text-sm text-secondary">Réduisez votre DSO via relances automatiques et escomptes</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-accent-primary font-bold">3.</span>
                                        <div>
                                            <strong>Négocier les délais fournisseurs</strong>
                                            <p className="text-sm text-secondary">Demandez 45-60 jours au lieu de 30 jours</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-accent-primary font-bold">4.</span>
                                        <div>
                                            <strong>Facturation électronique</strong>
                                            <p className="text-sm text-secondary">Obligatoire 2026, elle réduit les délais de paiement</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-accent-primary font-bold">5.</span>
                                        <div>
                                            <strong>Suivre votre BFR mensuellement</strong>
                                            <p className="text-sm text-secondary">Anticipez les besoins de trésorerie avec un dashboard</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* CTA FinSight */}
                        <div className="surface rounded-2xl p-8 border-2 border-accent-primary bg-accent-primary-subtle">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold mb-4">
                                    🚀 Suivez votre BFR automatiquement avec FinSight
                                </h3>
                                <p className="text-lg text-secondary mb-6 max-w-2xl mx-auto">
                                    FinSight calcule votre BFR en temps réel depuis vos exports comptables
                                </p>
                                <ul className="text-left max-w-md mx-auto space-y-2 mb-6">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-accent-primary flex-shrink-0" />
                                        <span>BFR mis à jour automatiquement</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-accent-primary flex-shrink-0" />
                                        <span>Évolution mensuelle visualisée</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-accent-primary flex-shrink-0" />
                                        <span>Alertes si BFR dépasse seuil</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-accent-primary flex-shrink-0" />
                                        <span>15 autres KPIs calculés (DSO, tréso, marges...)</span>
                                    </li>
                                </ul>
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-lg transition-all hover:shadow-lg"
                                >
                                    Essayer gratuitement
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <p className="text-sm text-tertiary mt-4">
                                    ✅ Sans engagement • ✅ Dashboard complet • ✅ Export PDF/Excel
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Liens utiles */}
                <div className="surface rounded-2xl p-8 border border-border-default">
                    <h3 className="text-2xl font-bold mb-4">📚 Ressources utiles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/calculateurs/dso"
                            className="p-4 border border-border-default rounded-lg hover:border-accent-primary transition-all group"
                        >
                            <h4 className="font-semibold mb-2 group-hover:text-accent-primary">
                                Calculateur DSO →
                            </h4>
                            <p className="text-sm text-secondary">
                                Calculez votre délai moyen de paiement clients
                            </p>
                        </Link>
                        <Link
                            href="/blog/5-kpis-financiers-pme"
                            className="p-4 border border-border-default rounded-lg hover:border-accent-primary transition-all group"
                        >
                            <h4 className="font-semibold mb-2 group-hover:text-accent-primary">
                                Les 5 KPIs essentiels →
                            </h4>
                            <p className="text-sm text-secondary">
                                BFR, DSO, marges... Les indicateurs à suivre absolument
                            </p>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
