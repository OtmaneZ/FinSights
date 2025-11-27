'use client'

import { useState } from 'react'

interface PricingToggleProps {
    value: 'monthly' | 'yearly'
    onChange: (value: 'monthly' | 'yearly') => void
}

export default function PricingToggle({ value, onChange }: PricingToggleProps) {
    return (
        <div className="flex items-center justify-center gap-3 mb-12">
            <span className={`text-sm font-medium ${value === 'monthly' ? 'text-primary' : 'text-secondary'}`}>
                Mensuel
            </span>
            
            <button
                onClick={() => onChange(value === 'monthly' ? 'yearly' : 'monthly')}
                className={`
                    relative w-14 h-7 rounded-full transition-all duration-300
                    ${value === 'yearly' ? 'bg-accent-primary' : 'bg-surface-elevated border-2 border-border-default'}
                `}
            >
                <div className={`
                    absolute top-0.5 w-6 h-6 surface rounded-full shadow-md transition-transform duration-300
                    ${value === 'yearly' ? 'translate-x-7' : 'translate-x-0.5'}
                `} />
            </button>
            
            <span className={`text-sm font-medium ${value === 'yearly' ? 'text-primary' : 'text-secondary'}`}>
                Annuel
            </span>
            
            {value === 'yearly' && (
                <span className="ml-2 px-2 py-1 bg-accent-green-subtle text-accent-green text-xs font-bold rounded-md">
                    -20%
                </span>
            )}
        </div>
    )
}
