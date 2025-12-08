'use client'

import { TrendingUp, Shield, Sparkles, AlertTriangle, Target, Brain } from 'lucide-react'

interface UseCase {
    icon: React.ElementType
    title: string
    description: string
    persona: string
    pillar: string
}

const useCases: UseCase[] = [
    {
        icon: AlertTriangle,
        title: "Alerte rupture cash détectée",
        description: "Détectez un risque de trésorerie négative 45 jours à l'avance grâce aux prévisions ML",
        persona: "CFO Scale-up",
        pillar: "Prévisions & Scénarios"
    },
    {
        icon: TrendingUp,
        title: "Stress tests automatiques",
        description: "Simulez l'impact d'une baisse CA de -30% sur votre runway en 1 clic",
        persona: "DAF PME",
        pillar: "Moteur de Risque"
    },
    {
        icon: Target,
        title: "Signaux faibles identifiés",
        description: "Repérez automatiquement un client qui paie systématiquement en retard",
        persona: "Contrôleur Finance",
        pillar: "Analyse Stratégique"
    },
    {
        icon: Shield,
        title: "Dépendance clients analysée",
        description: "Top 3 clients = 68% CA → Score FinSight™ alerte sur risque concentration",
        persona: "CFO ETI",
        pillar: "Structure de marge"
    },
    {
        icon: Sparkles,
        title: "Prévisions cash-flow fiables",
        description: "Cash-flow prévisionnel 12 mois basé sur patterns historiques et ML",
        persona: "DAF",
        pillar: "Prévisions & Scénarios"
    },
    {
        icon: Brain,
        title: "CFO Virtuel contextuel",
        description: "\"Pourquoi ma marge baisse ?\" → Analyse GPT-4 avec vos données réelles",
        persona: "Dirigeant PME",
        pillar: "CFO Virtuel"
    }
]

export default function Testimonials() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Cas d'usage FinSight</h2>
                <p className="text-secondary text-lg max-w-2xl mx-auto">
                    Comment le moteur d'intelligence financière aide les dirigeants au quotidien
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {useCases.map((useCase, index) => {
                    const Icon = useCase.icon
                    return (
                        <div
                            key={index}
                            className="surface rounded-xl p-6 surface-hover transition-all duration-300 hover:scale-105 border border-border-default"
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-accent-primary-subtle flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-accent-primary" />
                                </div>
                                <h3 className="font-bold text-base leading-tight">{useCase.title}</h3>
                            </div>

                            <p className="text-secondary text-sm leading-relaxed mb-4">
                                {useCase.description}
                            </p>

                            <div className="border-t border-border-subtle pt-3 flex items-center justify-between">
                                <span className="text-xs text-tertiary">{useCase.persona}</span>
                                <span className="text-xs text-accent-primary font-medium">{useCase.pillar}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
