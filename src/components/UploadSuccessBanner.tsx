'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { CheckCircle, X, Sparkles, Crown } from 'lucide-react'

interface UploadSuccessBannerProps {
    onClose: () => void
}

export default function UploadSuccessBanner({ onClose }: UploadSuccessBannerProps) {
    const { data: session } = useSession()
    const [isVisible, setIsVisible] = useState(true)

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(onClose, 300)
    }

    if (!isVisible) return null

    // Si user est connecté, différents messages selon plan
    if (session?.user) {
        const plan = session.user.plan || 'FREE'

        if (plan === 'FREE') {
            return (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slide-down">
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/30 rounded-lg p-3 shadow-lg backdrop-blur-sm">
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-300 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    ✨ Analyse terminée • Session locale
                                </p>
                                <Link
                                    href="/pricing"
                                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1 mt-0.5"
                                >
                                    <Crown className="w-3 h-3" />
                                    Upgrade pour sauvegarde cloud
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        // User PRO/SCALE/ENTERPRISE
        return (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-slide-down">
                <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 text-green-400 hover:text-green-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold">
                                Données importées avec succès ! 🎉
                            </h3>
                            <p className="text-sm text-secondary">
                                Sauvegardé dans le cloud • {plan} plan actif
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // User NON connecté → Inciter signup
    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slide-down">
            <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-3 shadow-lg backdrop-blur-sm">
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-medium">
                            ✨ Analyse terminée • Session temporaire
                        </p>
                        <Link
                            href="/auth/signup"
                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 mt-0.5"
                        >
                            <Sparkles className="w-3 h-3" />
                            Créer un compte gratuit pour sauvegarder
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
