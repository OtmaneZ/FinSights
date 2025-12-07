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
                <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm animate-slide-up">
                    <div className="bg-gradient-to-br from-blue-950/95 to-blue-900/95 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-4 shadow-2xl">
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                            <div className="flex-1 pt-1">
                                <h3 className="font-semibold text-base mb-1">
                                    Analyse terminée
                                </h3>
                                <p className="text-sm text-gray-400 mb-3">
                                    Session locale • Données non sauvegardées
                                </p>
                                <Link
                                    href="/pricing"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-blue-500/20"
                                >
                                    <Crown className="w-4 h-4" />
                                    Sauvegarder dans le cloud
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        // User PRO/SCALE/ENTERPRISE
        return (
            <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm animate-slide-up">
                <div className="bg-gradient-to-br from-green-950/95 to-emerald-900/95 backdrop-blur-xl border border-green-500/20 rounded-2xl p-4 shadow-2xl">
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-base">
                                Importé avec succès
                            </h3>
                            <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                Sauvegardé • Plan {plan}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // User NON connecté → Inciter signup
    return (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm animate-slide-up">
            <div className="bg-gradient-to-br from-slate-950/95 to-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-2xl">
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 pt-1">
                        <h3 className="font-semibold text-base mb-1">
                            Analyse terminée
                        </h3>
                        <p className="text-sm text-gray-400 mb-3">
                            Session temporaire • Non sauvegardée
                        </p>
                        <Link
                            href="/auth/signup"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-blue-500/20"
                        >
                            <Sparkles className="w-4 h-4" />
                            Créer un compte gratuit
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
