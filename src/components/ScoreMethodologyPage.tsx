'use client'

import React from 'react'
import {
    TrendingUp,
    DollarSign,
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Info,
    Calculator,
    BarChart3
} from 'lucide-react'

export default function ScoreMethodologyPage() {
    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                    <Calculator className="w-4 h-4 text-accent-primary" />
                    <span className="text-accent-primary text-sm font-semibold">Transparence Totale</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                    Méthodologie du Score FinSight™
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Découvrez comment nous calculons votre score de santé financière de 0 à 100.<br />
                    Une méthodologie transparente, auditable et conforme aux standards PCG 2025.
                </p>
            </div>

            {/* Introduction */}
            <section className="surface rounded-2xl p-8 lg:p-12 border-2 border-border-default">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Comment fonctionne le Score FinSight™ ?</h2>

                <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p className="text-lg">
                        Le <strong>Score FinSight™</strong> est un indicateur unique qui condense l'analyse de
                        <strong> 12+ KPIs financiers</strong> en un score de <strong>0 à 100</strong>,
                        permettant d'évaluer instantanément la santé financière d'une entreprise.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 my-8">
                        <div className="border-l-4 border-accent-primary bg-blue-50 p-6 rounded-r-lg">
                            <h3 className="font-bold text-gray-900 mb-2">Pourquoi 0-100 ?</h3>
                            <p className="text-sm text-gray-600">
                                Une échelle universelle, facile à comprendre et à communiquer.
                                Comme un score de crédit, mais pour votre santé financière globale.
                            </p>
                        </div>

                        <div className="border-l-4 border-green-600 bg-green-50 p-6 rounded-r-lg">
                            <h3 className="font-bold text-gray-900 mb-2">Pourquoi 4 piliers ?</h3>
                            <p className="text-sm text-gray-600">
                                Une structure équilibrée qui couvre les 4 dimensions critiques :
                                Liquidité, Rentabilité, Résilience et Risque.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5 text-accent-primary" />
                            Interprétation du score
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600 mb-1">0-39</div>
                                <div className="text-xs text-gray-600">Critique</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600 mb-1">40-59</div>
                                <div className="text-xs text-gray-600">Fragile</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 mb-1">60-79</div>
                                <div className="text-xs text-gray-600">Bon</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-accent-primary mb-1">80-100</div>
                                <div className="text-xs text-gray-600">Excellent</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Méthodologie de Calcul - 4 Piliers */}
            <section>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Méthodologie de Calcul</h2>
                    <p className="text-lg text-gray-600">
                        4 piliers équilibrés, chacun noté sur 25 points
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Pilier 1 : CASH */}
                    <div className="surface rounded-2xl border-2 border-border-default overflow-hidden">
                        <div className="border-l-4 border-accent-primary bg-blue-50 p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-accent-primary flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-accent-primary uppercase tracking-wider mb-1">Pilier 1</div>
                                    <h3 className="text-2xl font-bold text-gray-900">CASH • Trésorerie & Liquidité</h3>
                                    <p className="text-sm text-gray-600 mt-1">0 à 25 points</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                                <div className="w-20 text-center">
                                    <div className="text-2xl font-bold text-accent-primary">15pts</div>
                                    <div className="text-xs text-gray-500">max</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-2">Runway (mois de trésorerie)</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>≥ 12 mois : <strong>15 points</strong> (excellent)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>6-12 mois : <strong>12 points</strong> (bon)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                                            <span>3-6 mois : <strong>8 points</strong> (attention)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span>&lt; 3 mois : <strong>3 points</strong> (critique)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                                <div className="w-20 text-center">
                                    <div className="text-2xl font-bold text-accent-primary">5pts</div>
                                    <div className="text-xs text-gray-500">max</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-2">Cash Flow Net</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>Positif : <strong>5 points</strong></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                                            <span>Légèrement négatif (&lt; -50k€) : <strong>2 points</strong></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span>Très négatif : <strong>0 point</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-20 text-center">
                                    <div className="text-2xl font-bold text-accent-primary">5pts</div>
                                    <div className="text-xs text-gray-500">max</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-2">DSO (Days Sales Outstanding)</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>≤ 30 jours : <strong>5 points</strong> (excellent)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>30-45 jours : <strong>3 points</strong> (bon)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                                            <span>45-60 jours : <strong>1 point</strong> (moyen)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span>&gt; 60 jours : <strong>0 point</strong> (problème)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pilier 2 : MARGIN */}
                    <div className="surface rounded-2xl border-2 border-border-default overflow-hidden">
                        <div className="border-l-4 border-green-600 bg-green-50 p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Pilier 2</div>
                                    <h3 className="text-2xl font-bold text-gray-900">MARGIN • Rentabilité & Croissance</h3>
                                    <p className="text-sm text-gray-600 mt-1">0 à 25 points</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                                <div className="w-20 text-center">
                                    <div className="text-2xl font-bold text-green-600">15pts</div>
                                    <div className="text-xs text-gray-500">max</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-2">Marge Nette (%)</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>≥ 20% : <strong>15 points</strong> (excellent)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>15-20% : <strong>12 points</strong> (très bon)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>10-15% : <strong>9 points</strong> (bon)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                                            <span>5-10% : <strong>5 points</strong> (faible)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                                            <span>0-5% : <strong>2 points</strong> (très faible)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span>&lt; 0% : <strong>0 point</strong> (perte)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                                <div className="w-20 text-center">
                                    <div className="text-2xl font-bold text-green-600">5pts</div>
                                    <div className="text-xs text-gray-500">max</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-2">Croissance CA (%)</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>≥ 15% : <strong>5 points</strong> (forte croissance)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>5-15% : <strong>3 points</strong> (croissance modérée)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                                            <span>0-5% : <strong>1 point</strong> (stagnation)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span>&lt; 0% : <strong>0 point</strong> (décroissance)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-20 text-center">
                                    <div className="text-2xl font-bold text-green-600">5pts</div>
                                    <div className="text-xs text-gray-500">max</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-2">Contrôle des Charges</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>Réduction charges : <strong>5 points</strong></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>Charges &lt; croissance CA : <strong>3 points</strong></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                                            <span>Charges contrôlées : <strong>1 point</strong></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span>Charges &gt;&gt; CA : <strong>0 point</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pilier 3 : RESILIENCE */}
                    <div className="surface rounded-2xl border-2 border-border-default overflow-hidden">
                        <div className="border-l-4 border-purple-600 bg-purple-50 p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Pilier 3</div>
                                    <h3 className="text-2xl font-bold text-gray-900">RESILIENCE • Stabilité & Diversification</h3>
                                    <p className="text-sm text-gray-600 mt-1">0 à 25 points</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                                <div className="w-20 text-center">
                                    <div className="text-2xl font-bold text-purple-600">10pts</div>
                                    <div className="text-xs text-gray-500">max</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-2">Charges Fixes (% CA)</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>≤ 30% : <strong>10 points</strong> (excellent)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>30-50% : <strong>7 points</strong> (bon)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                                            <span>50-70% : <strong>4 points</strong> (moyen)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span>&gt; 70% : <strong>1 point</strong> (risque)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                                <div className="w-20 text-center">
                                    <div className="text-2xl font-bold text-purple-600">10pts</div>
                                    <div className="text-xs text-gray-500">max</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-2">Dépendance Client (% CA du top client)</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>≤ 20% : <strong>10 points</strong> (excellent)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>20-35% : <strong>7 points</strong> (bon)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                                            <span>35-50% : <strong>4 points</strong> (risque)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span>&gt; 50% : <strong>1 point</strong> (critique)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-20 text-center">
                                    <div className="text-2xl font-bold text-purple-600">5pts</div>
                                    <div className="text-xs text-gray-500">max</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-2">Diversité Catégories</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>≥ 8 catégories : <strong>5 points</strong> (très diversifié)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>5-7 catégories : <strong>3 points</strong> (diversification correcte)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                                            <span>3-4 catégories : <strong>1 point</strong> (peu diversifié)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span>&lt; 3 catégories : <strong>0 point</strong> (concentré)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pilier 4 : RISK */}
                    <div className="surface rounded-2xl border-2 border-border-default overflow-hidden">
                        <div className="border-l-4 border-orange-600 bg-orange-50 p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-orange-600 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Pilier 4</div>
                                    <h3 className="text-2xl font-bold text-gray-900">RISK • Détection Anomalies & Volatilité</h3>
                                    <p className="text-sm text-gray-600 mt-1">0 à 25 points (déduction)</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                                <p className="text-sm text-orange-800">
                                    <strong>Note :</strong> Ce pilier fonctionne par déduction. On part de 25 points
                                    et on retire des points en fonction des anomalies et de la volatilité détectées.
                                </p>
                            </div>

                            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                                <div className="w-20 text-center">
                                    <div className="text-2xl font-bold text-orange-600">-10pts</div>
                                    <div className="text-xs text-gray-500">max</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-2">Anomalies Critiques (ML)</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span>Chaque anomalie critique : <strong>-3 points</strong></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Info className="w-4 h-4 text-accent-primary" />
                                            <span>Maximum : -10 points (plafonné)</span>
                                        </li>
                                        <li className="text-xs text-gray-500 mt-2">
                                            Exemples : Transactions suspectes, montants aberrants, patterns inhabituels
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                                <div className="w-20 text-center">
                                    <div className="text-2xl font-bold text-orange-600">-5pts</div>
                                    <div className="text-xs text-gray-500">max</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-2">Anomalies Totales</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                                            <span>Chaque anomalie (toute gravité) : <strong>-0.5 point</strong></span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Info className="w-4 h-4 text-accent-primary" />
                                            <span>Maximum : -5 points (plafonné)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-20 text-center">
                                    <div className="text-2xl font-bold text-orange-600">-10pts</div>
                                    <div className="text-xs text-gray-500">max</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-2">Volatilité des Flux</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                                            <span>Coefficient de variation normalisé (0-1) × 10</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Info className="w-4 h-4 text-accent-primary" />
                                            <span>Maximum : -10 points (plafonné)</span>
                                        </li>
                                        <li className="text-xs text-gray-500 mt-2">
                                            Mesure de l'irrégularité des flux de trésorerie (écart-type / moyenne)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Exemples Concrets */}
            <section className="surface rounded-2xl p-8 lg:p-12 border-2 border-border-default">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Exemples Concrets</h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Entreprise A - Excellent */}
                    <div className="border-2 border-green-200 rounded-xl overflow-hidden">
                        <div className="bg-green-50 p-6 border-b border-green-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-gray-900">Entreprise A</h3>
                                <div className="text-4xl font-bold text-green-600">85/100</div>
                            </div>
                            <p className="text-sm text-gray-600">Scale-up SaaS B2B • 50 employés • 5M€ CA</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-accent-primary" />
                                    <span className="font-medium">CASH</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-accent-primary">23</span>
                                    <span className="text-sm text-gray-500">/25</span>
                                </div>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1 ml-6">
                                <li>• Runway : 18 mois → 15pts</li>
                                <li>• Cash Flow : +250k€ → 5pts</li>
                                <li>• DSO : 28 jours → 5pts</li>
                            </ul>

                            <div className="flex items-center justify-between pb-2 border-b">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="font-medium">MARGIN</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-green-600">21</span>
                                    <span className="text-sm text-gray-500">/25</span>
                                </div>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1 ml-6">
                                <li>• Marge nette : 18% → 12pts</li>
                                <li>• Croissance CA : +45% → 5pts</li>
                                <li>• Contrôle charges : bon → 3pts</li>
                            </ul>

                            <div className="flex items-center justify-between pb-2 border-b">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-purple-600" />
                                    <span className="font-medium">RESILIENCE</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-purple-600">22</span>
                                    <span className="text-sm text-gray-500">/25</span>
                                </div>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1 ml-6">
                                <li>• Charges fixes : 28% → 10pts</li>
                                <li>• Top client : 18% CA → 10pts</li>
                                <li>• Diversité : 6 catégories → 3pts</li>
                            </ul>

                            <div className="flex items-center justify-between pb-2 border-b">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                                    <span className="font-medium">RISK</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-orange-600">19</span>
                                    <span className="text-sm text-gray-500">/25</span>
                                </div>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1 ml-6">
                                <li>• Anomalies critiques : 0 → 0pts</li>
                                <li>• Anomalies totales : 3 → -1.5pts</li>
                                <li>• Volatilité : faible → -4.5pts</li>
                            </ul>
                        </div>
                    </div>

                    {/* Entreprise B - Fragile */}
                    <div className="border-2 border-orange-200 rounded-xl overflow-hidden">
                        <div className="bg-orange-50 p-6 border-b border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-gray-900">Entreprise B</h3>
                                <div className="text-4xl font-bold text-orange-600">42/100</div>
                            </div>
                            <p className="text-sm text-gray-600">PME Commerce • 15 employés • 1.2M€ CA</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-accent-primary" />
                                    <span className="font-medium">CASH</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-accent-primary">9</span>
                                    <span className="text-sm text-gray-500">/25</span>
                                </div>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1 ml-6">
                                <li>• Runway : 4 mois → 8pts</li>
                                <li>• Cash Flow : -30k€ → 2pts</li>
                                <li>• DSO : 72 jours → 0pt</li>
                            </ul>

                            <div className="flex items-center justify-between pb-2 border-b">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="font-medium">MARGIN</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-green-600">12</span>
                                    <span className="text-sm text-gray-500">/25</span>
                                </div>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1 ml-6">
                                <li>• Marge nette : 6% → 5pts</li>
                                <li>• Croissance CA : +8% → 3pts</li>
                                <li>• Contrôle charges : moyen → 1pt</li>
                            </ul>

                            <div className="flex items-center justify-between pb-2 border-b">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-purple-600" />
                                    <span className="font-medium">RESILIENCE</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-purple-600">8</span>
                                    <span className="text-sm text-gray-500">/25</span>
                                </div>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1 ml-6">
                                <li>• Charges fixes : 68% → 4pts</li>
                                <li>• Top client : 52% CA → 1pt</li>
                                <li>• Diversité : 8 catégories → 5pts</li>
                            </ul>

                            <div className="flex items-center justify-between pb-2 border-b">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                                    <span className="font-medium">RISK</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-orange-600">13</span>
                                    <span className="text-sm text-gray-500">/25</span>
                                </div>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1 ml-6">
                                <li>• Anomalies critiques : 2 → -6pts</li>
                                <li>• Anomalies totales : 8 → -4pts</li>
                                <li>• Volatilité : élevée → -8pts</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Technique */}
            <section className="surface rounded-2xl p-8 lg:p-12 border-2 border-border-default">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">FAQ Technique</h2>

                <div className="space-y-6">
                    <div className="border-l-4 border-accent-primary bg-blue-50 p-6 rounded-r-lg">
                        <h3 className="font-bold text-gray-900 mb-2">Comment gérez-vous les données manquantes ?</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Nous utilisons un <strong>système de confiance à 3 niveaux</strong> :
                        </p>
                        <ul className="text-sm text-gray-600 mt-3 space-y-1 ml-4">
                            <li>• <strong>High</strong> : &gt;30 transactions, contreparties identifiées, historique &gt;3 mois</li>
                            <li>• <strong>Medium</strong> : Quelques warnings (ex: contreparties manquantes &lt;50%)</li>
                            <li>• <strong>Low</strong> : Données insuffisantes (&lt;10 transactions, pas de revenus, etc.)</li>
                        </ul>
                        <p className="text-sm text-gray-600 mt-3">
                            Le score est affiché avec son niveau de confiance. Un score "Low" indique qu'il faut enrichir les données.
                        </p>
                    </div>

                    <div className="border-l-4 border-green-600 bg-green-50 p-6 rounded-r-lg">
                        <h3 className="font-bold text-gray-900 mb-2">Le score est-il auditable ?</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            <strong>Oui, 100% transparent</strong>. Chaque score inclut :
                        </p>
                        <ul className="text-sm text-gray-600 mt-3 space-y-1 ml-4">
                            <li>• La décomposition des 4 piliers (25pts chacun)</li>
                            <li>• Les KPIs utilisés pour chaque calcul</li>
                            <li>• Les seuils appliqués (ex: runway &gt;12 mois = 15pts)</li>
                            <li>• Le niveau de confiance (high/medium/low)</li>
                        </ul>
                        <p className="text-sm text-gray-600 mt-3">
                            Un expert-comptable ou auditeur peut recalculer manuellement le score à partir de ces éléments.
                        </p>
                    </div>

                    <div className="border-l-4 border-purple-600 bg-purple-50 p-6 rounded-r-lg">
                        <h3 className="font-bold text-gray-900 mb-2">Quelle est la fréquence de recalcul ?</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Le score est recalculé <strong>à chaque upload de données</strong>. Il reflète donc toujours
                            l'état le plus récent de votre entreprise. Nous recommandons :
                        </p>
                        <ul className="text-sm text-gray-600 mt-3 space-y-1 ml-4">
                            <li>• <strong>Mensuel</strong> : Pour un suivi régulier (closing mensuel)</li>
                            <li>• <strong>Trimestriel</strong> : Pour une analyse approfondie</li>
                            <li>• <strong>Ad-hoc</strong> : Avant une levée de fonds, due diligence, board meeting</li>
                        </ul>
                    </div>

                    <div className="border-l-4 border-orange-600 bg-orange-50 p-6 rounded-r-lg">
                        <h3 className="font-bold text-gray-900 mb-2">Comment fonctionnent les anomalies ML ?</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Nous utilisons <strong>3 techniques de Machine Learning</strong> complémentaires :
                        </p>
                        <ul className="text-sm text-gray-600 mt-3 space-y-1 ml-4">
                            <li>• <strong>Z-score</strong> : Détecte les montants aberrants (±3 écarts-types)</li>
                            <li>• <strong>IQR (Interquartile Range)</strong> : Identifie les outliers statistiques</li>
                            <li>• <strong>Patterns temporels</strong> : Repère les ruptures de tendance</li>
                        </ul>
                        <p className="text-sm text-gray-600 mt-3">
                            Chaque anomalie est notée de 0 à 1 (confiance) et classée par niveau de risque (low/medium/high/critical).
                        </p>
                    </div>

                    <div className="border-l-4 border-gray-600 bg-gray-50 p-6 rounded-r-lg">
                        <h3 className="font-bold text-gray-900 mb-2">Le score est-il comparable entre secteurs ?</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            <strong>Partiellement</strong>. Les seuils sont calibrés pour être universels, mais certains secteurs
                            ont des profils différents :
                        </p>
                        <ul className="text-sm text-gray-600 mt-3 space-y-1 ml-4">
                            <li>• <strong>SaaS</strong> : Marges élevées (20-30%), runway long, charges fixes élevées</li>
                            <li>• <strong>Commerce</strong> : Marges faibles (5-10%), rotation rapide, DSO court</li>
                            <li>• <strong>Services</strong> : Marges moyennes (15-25%), dépendance client variable</li>
                        </ul>
                        <p className="text-sm text-gray-600 mt-3">
                            Nous affichons des <strong>benchmarks sectoriels</strong> pour contextualiser le score.
                        </p>
                    </div>

                    <div className="border-l-4 border-red-600 bg-red-50 p-6 rounded-r-lg">
                        <h3 className="font-bold text-gray-900 mb-2">Conformité RGPD et sécurité des données ?</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            <strong>Données 100% chiffrées et hébergées en France</strong> :
                        </p>
                        <ul className="text-sm text-gray-600 mt-3 space-y-1 ml-4">
                            <li>• Chiffrement AES-256 au repos et TLS 1.3 en transit</li>
                            <li>• Hébergement Vercel (infrastructure européenne)</li>
                            <li>• Base de données PostgreSQL chiffrée (Supabase EU)</li>
                            <li>• Aucune revente de données à des tiers</li>
                            <li>• Droit à l'oubli : suppression définitive sur demande</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="text-center bg-gradient-to-br from-blue-50 to-white rounded-2xl p-12 border-2 border-blue-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Prêt à calculer votre Score FinSight™ ?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Uploadez votre export comptable et obtenez votre score en moins de 2 minutes.<br />
                    Gratuit, sans engagement, 100% confidentiel.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all shadow-lg"
                    >
                        <BarChart3 className="w-5 h-5" />
                        Calculer mon score gratuitement
                    </a>
                    <a
                        href="/pricing"
                        className="inline-flex items-center gap-2 px-8 py-4 border-2 border-accent-primary text-accent-primary hover:bg-blue-50 rounded-lg font-semibold transition-all"
                    >
                        Voir les formules Business
                    </a>
                </div>
            </section>
        </div>
    )
}
