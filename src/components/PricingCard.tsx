'use client'

import { Check } from 'lucide-react'

interface PricingCardProps {
    name: string
    price: number | null
    priceYearly?: number
    billingPeriod: 'monthly' | 'yearly'
    features: string[]
    cta: string
    highlight?: boolean
    popular?: boolean
    ctaAction?: () => void
}

export default function PricingCard({
    name,
    price,
    priceYearly,
    billingPeriod,
    features,
    cta,
    highlight = false,
    popular = false,
    ctaAction
}: PricingCardProps) {
    const displayPrice = billingPeriod === 'yearly' && priceYearly ? priceYearly : price
    const monthlyEquivalent = billingPeriod === 'yearly' && priceYearly ? Math.round(priceYearly / 12) : null

    return (
        <div className={`
            relative surface rounded-2xl p-8
            ${highlight ? 'ring-2 ring-accent-gold shadow-2xl scale-105' : 'surface-hover'}
            transition-all duration-300 hover:scale-105
        `}>
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-gold rounded-full text-xs font-bold text-white">
                    POPULAIRE
                </div>
            )}

            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{name}</h3>
                <div className="flex items-baseline justify-center gap-2">
                    {price === null ? (
                        <span className="text-4xl font-bold">Sur devis</span>
                    ) : price === 0 ? (
                        <span className="text-4xl font-bold">Gratuit</span>
                    ) : (
                        <>
                            <span className="text-5xl font-bold">{displayPrice}€</span>
                            <span className="text-text-secondary text-sm">
                                {billingPeriod === 'yearly' ? '/an' : '/mois'}
                            </span>
                        </>
                    )}
                </div>
                {monthlyEquivalent && (
                    <p className="text-sm text-text-tertiary mt-1">
                        Soit {monthlyEquivalent}€/mois
                    </p>
                )}
            </div>

            <button
                onClick={ctaAction}
                className={`
                    w-full py-3 rounded-lg font-semibold text-sm transition-all mb-8
                    ${highlight
                        ? 'bg-accent-gold hover:bg-accent-gold-hover text-white shadow-lg hover:shadow-xl'
                        : 'border-2 border-border-default hover:border-accent-gold-border text-text-primary hover:bg-surface-elevated'
                    }
                `}
            >
                {cta}
            </button>

            <ul className="space-y-3">
                {features.map((feature, index) => {
                    const isIncluded = feature.startsWith('✅')
                    const cleanFeature = feature.replace(/^[✅❌]\s*/, '')

                    return (
                        <li key={index} className="flex items-start gap-3">
                            {isIncluded ? (
                                <Check className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" />
                            ) : (
                                <div className="w-5 h-5 flex-shrink-0 mt-0.5 text-text-disabled">✕</div>
                            )}
                            <span className={`text-sm ${isIncluded ? 'text-text-primary' : 'text-text-tertiary'}`}>
                                {cleanFeature}
                            </span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
