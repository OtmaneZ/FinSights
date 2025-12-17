'use client'

import { Check } from 'lucide-react'

interface PricingCardProps {
    name: string
    description?: string
    tagline?: string
    color?: 'green' | 'blue' | 'orange' | 'red'
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
    description,
    tagline,
    color,
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

    // Color indicator based on plan
    const colorClasses = {
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500'
    }

    return (
        <div className={`
            relative surface rounded-2xl p-8
            ${highlight ? 'ring-2 ring-accent-primary shadow-2xl scale-105' : 'surface-hover'}
            transition-all duration-300
        `}>
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-primary rounded-full text-xs font-bold text-white">
                    POPULAIRE
                </div>
            )}

            <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                    {color && (
                        <div className={`w-3 h-3 rounded-full ${colorClasses[color]}`} />
                    )}
                    <h3 className="text-2xl font-bold">{name}</h3>
                </div>
                {description && (
                    <p className="text-sm text-secondary font-semibold mb-3">{description}</p>
                )}
                <div className="flex items-baseline justify-center gap-2">
                    {price === null ? (
                        <span className="text-4xl font-bold">Sur devis</span>
                    ) : price === 0 ? (
                        <span className="text-4xl font-bold">Gratuit</span>
                    ) : (
                        <>
                            <span className="text-5xl font-bold">{displayPrice}€</span>
                            <span className="text-secondary text-sm">
                                {billingPeriod === 'yearly' ? '/an' : '/mois'}
                            </span>
                        </>
                    )}
                </div>
                {monthlyEquivalent && (
                    <p className="text-sm text-tertiary mt-1">
                        Soit {monthlyEquivalent}€/mois
                    </p>
                )}
                {tagline && (
                    <div className="mt-4 px-3 py-2 bg-surface-elevated rounded-lg border border-border-subtle">
                        <p className="text-xs text-secondary italic leading-relaxed">
                            {tagline}
                        </p>
                    </div>
                )}
            </div>

            <button
                onClick={ctaAction}
                className={`
                    w-full py-3 rounded-lg font-semibold text-sm transition-all mb-8
                    ${highlight
                        ? 'bg-accent-primary hover:bg-accent-primary-hover text-white shadow-lg hover:shadow-xl'
                        : 'border-2 border-border-default hover:border-accent-primary-border text-primary hover:bg-surface-elevated'
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
                                <Check className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
                            ) : (
                                <div className="w-5 h-5 flex-shrink-0 mt-0.5 text-disabled">✕</div>
                            )}
                            <span className={`text-sm ${isIncluded ? 'text-primary' : 'text-tertiary'}`}>
                                {cleanFeature}
                            </span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
