import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface ConsultingBannerProps {
    variant?: 'subtle' | 'warning'
    score?: number
}

/**
 * Banner CTA pour promouvoir les offres consulting dans le dashboard
 * - variant "subtle": message générique après upload
 * - variant "warning": message personnalisé si score < 60
 */
export default function ConsultingBanner({ variant = 'subtle', score }: ConsultingBannerProps) {
    if (variant === 'warning' && (!score || score >= 60)) {
        return null // Ne pas afficher si score >= 60
    }

    const isWarning = variant === 'warning'

    return (
        <div className={`mb-8 ${isWarning ? 'animate-in fade-in duration-500' : ''}`}>
            <div className={`
                rounded-xl p-6 border-l-4
                ${isWarning
                    ? 'bg-orange-50/50 border-orange-500 border border-orange-200'
                    : 'bg-blue-50/50 border-blue-500 border border-blue-200'
                }
                flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
                hover:shadow-md transition-shadow
            `}>
                <div className="flex items-start gap-3">
                    <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                        ${isWarning ? 'bg-orange-100' : 'bg-blue-100'}
                    `}>
                        <Sparkles className={`w-5 h-5 ${isWarning ? 'text-orange-600' : 'text-accent-primary'}`} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                            {isWarning
                                ? 'Votre score révèle des signaux faibles'
                                : 'Besoin d\'un regard expert ?'
                            }
                        </p>
                        <p className="text-xs text-gray-600">
                            {isWarning
                                ? 'Un audit approfondi peut identifier les leviers d\'action prioritaires et vous aider à redresser la situation.'
                                : 'Nos consultants analysent votre situation et vous proposent des recommandations concrètes — du diagnostic express (2 500€) au dashboard IA sur-mesure (6 500€).'
                            }
                        </p>
                    </div>
                </div>
                <Link
                    href="/consulting"
                    className={`
                        inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all
                        ${isWarning
                            ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg'
                            : 'bg-accent-primary text-white hover:bg-accent-primary-hover'
                        }
                    `}
                >
                    {isWarning ? 'Réserver un audit' : 'Découvrir nos offres'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    )
}
