'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Sparkles, X } from 'lucide-react'
import { useState } from 'react'

export default function AuthBanner() {
    const { data: session, status } = useSession()
    const [isDismissed, setIsDismissed] = useState(false)

    // Don't show banner if user is logged in or if dismissed
    if (status === 'authenticated' || isDismissed) {
        return null
    }

    // Don't show during loading to avoid flash
    if (status === 'loading') {
        return null
    }

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-accent-primary/10 via-accent-primary/5 to-accent-primary/10 border border-accent-primary/20 rounded-xl p-4 mb-6">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-primary/5 to-transparent animate-pulse" />

            <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-accent-primary/10 rounded-lg">
                        <Sparkles className="w-5 h-5 text-accent-primary" />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-primary mb-1">
                            Testez toutes les fonctionnalités gratuitement
                        </h3>
                        <p className="text-xs text-secondary">
                            Créez un compte gratuit pour sauvegarder vos dashboards, accéder à l'IA Copilot illimité et recevoir des alertes automatiques
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/auth/signup"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-sm transition-all hover:shadow-lg whitespace-nowrap"
                    >
                        <Sparkles className="w-4 h-4" />
                        Essai gratuit
                    </Link>

                    <Link
                        href="/auth/signin"
                        className="hidden sm:inline-flex items-center px-4 py-2.5 text-accent-primary hover:bg-accent-primary/5 rounded-lg font-medium text-sm transition-all whitespace-nowrap"
                    >
                        Se connecter
                    </Link>

                    <button
                        onClick={() => setIsDismissed(true)}
                        className="p-2 text-tertiary hover:text-primary hover:bg-surface-elevated rounded-lg transition-all"
                        aria-label="Fermer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
