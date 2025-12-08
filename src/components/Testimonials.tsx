'use client'

import { TrendingUp, Shield, Sparkles, AlertTriangle, Target, Brain, XCircle, CheckCircle2 } from 'lucide-react'

interface UseCase {
    icon: React.ElementType
    title: string
    problemBefore: string
    solutionAfter: string
    pillar: string
    metricImprovement: string
}

const useCases: UseCase[] = [
    {
        icon: AlertTriangle,
        title: "Anticipation trésorerie",
        problemBefore: "Découverte des ruptures de cash seulement 1-2 semaines avant",
        solutionAfter: "Alerte automatique 45 jours à l'avance via prévisions ML",
        pillar: "Prévisions & Scénarios",
        metricImprovement: "45j vs 7j"
    },
    {
        icon: TrendingUp,
        title: "Stress tests scénarios",
        problemBefore: "Simulation manuelle sur Excel, sans vision multi-scénarios",
        solutionAfter: "Impact CA -30% sur runway calculé en 1 clic (optimiste/pessimiste/réaliste)",
        pillar: "Moteur de Risque",
        metricImprovement: "3 scénarios vs 0"
    },
    {
        icon: Target,
        title: "Détection signaux faibles",
        problemBefore: "Retards de paiement clients repérés manuellement après plusieurs mois",
        solutionAfter: "Identification automatique des patterns de retard systématiques",
        pillar: "Analyse Stratégique",
        metricImprovement: "Temps réel vs 3 mois"
    },
    {
        icon: Shield,
        title: "Analyse concentration clients",
        problemBefore: "Calcul manuel du top 3 clients, pas d'alerte sur dépendance",
        solutionAfter: "Score FinSight™ alerte si top 3 > 50% du CA (risque concentration)",
        pillar: "Résilience",
        metricImprovement: "Score 0-100"
    },
    {
        icon: Sparkles,
        title: "Prévisions cash-flow",
        problemBefore: "Projection linéaire sur Excel sans patterns historiques",
        solutionAfter: "Prévisionnel 12 mois basé sur historique + saisonnalité + ML",
        pillar: "Prévisions & Scénarios",
        metricImprovement: "Confiance 85%"
    },
    {
        icon: Brain,
        title: "CFO Virtuel contextuel",
        problemBefore: "Question \"Pourquoi ma marge baisse ?\" nécessite 2h d'analyse manuelle",
        solutionAfter: "Réponse GPT-4 en 30 secondes avec analyse détaillée de vos données",
        pillar: "CFO Virtuel",
        metricImprovement: "30s vs 2h"
    }
]

export default function Testimonials() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Cas d'usage FinSight</h2>
                <p className="text-secondary text-lg max-w-2xl mx-auto">
                    Comment le moteur d'intelligence financière transforme votre gestion au quotidien
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {useCases.map((useCase, index) => {
                    const Icon = useCase.icon
                    return (
                        <div
                            key={index}
                            className="surface rounded-xl p-6 surface-hover transition-all duration-300 hover:scale-[1.02] border border-border-default group"
                        >
                            {/* Header avec icône et titre */}
                            <div className="flex items-start gap-3 mb-5">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base leading-tight mb-1">{useCase.title}</h3>
                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                                        {useCase.metricImprovement}
                                    </div>
                                </div>
                            </div>

                            {/* Avant (Problème) */}
                            <div className="mb-4 pb-4 border-b border-border-subtle">
                                <div className="flex items-start gap-2 mb-2">
                                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Situation classique</span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed pl-6">
                                    {useCase.problemBefore}
                                </p>
                            </div>

                            {/* Après (Solution) */}
                            <div className="mb-4">
                                <div className="flex items-start gap-2 mb-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Avec FinSight</span>
                                </div>
                                <p className="text-sm text-gray-900 leading-relaxed font-medium pl-6">
                                    {useCase.solutionAfter}
                                </p>
                            </div>

                            {/* Footer avec pilier */}
                            <div className="pt-3 border-t border-border-subtle">
                                <span className="text-xs text-blue-600 font-medium">
                                    {useCase.pillar}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
