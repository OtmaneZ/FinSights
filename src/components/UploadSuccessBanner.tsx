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
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-slide-down">
                    <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 text-amber-400 hover:text-amber-300 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-start gap-4">
                            <Crown className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">
                                    Analyse terminée ! 🎉
                                </h3>
                                <p className="text-sm text-secondary mb-3">
                                    Vos données sont analysées en local. <strong>Upgrade PRO</strong> pour :
                                </p>
                                <ul className="text-sm text-secondary space-y-1 mb-4">
                                    <li>✅ Sauvegarde cloud sécurisée (90 jours)</li>
                                    <li>✅ CFO Virtuel illimité (actuellement 10/jour)</li>
                                    <li>✅ Prévisions & Stress tests avancés</li>
                                    <li>✅ Alertes signaux faibles temps réel</li>
                                </ul>
                                <Link
                                    href="/pricing"
                                    className="inline-block px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-all text-sm"
                                >
                                    Découvrir Business (99€/mois)
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
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-slide-down">
            <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-4">
                    <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">
                            Analyse terminée ! 🎉
                        </h3>
                        <p className="text-sm text-secondary mb-3">
                            Analyse locale (non sauvegardée).
                            Créez un compte <strong>gratuit</strong> pour :
                        </p>
                        <ul className="text-sm text-secondary space-y-1 mb-4">
                            <li>✅ Score FinSight™ instantané</li>
                            <li>✅ Analyse stratégique complète</li>
                            <li>✅ 10 questions CFO Virtuel/jour</li>
                            <li>✅ Détection signaux faibles</li>
                        </ul>
                        <div className="flex gap-3">
                            <Link
                                href="/auth/signup"
                                className="inline-block px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all text-sm"
                            >
                                Créer mon compte gratuit
                            </Link>
                            <Link
                                href="/pricing"
                                className="inline-block px-6 py-2 border border-blue-500/30 hover:bg-blue-500/10 text-blue-400 rounded-lg font-semibold transition-all text-sm"
                            >
                                Voir les plans
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
