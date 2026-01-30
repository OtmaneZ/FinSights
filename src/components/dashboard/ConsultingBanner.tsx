import Link from 'next/link'
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

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
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500 border-l-4 shadow-sm'
                }
                flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
                hover:shadow-md transition-all duration-300
            `}>
                <div className="flex items-start gap-4">
                    <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner
                        ${isWarning ? 'bg-orange-100' : 'bg-blue-100'}
                    `}>
                        {isWarning ? (
                            <ShieldCheck className="w-6 h-6 text-orange-600" />
                        ) : (
                            <Sparkles className="w-6 h-6 text-accent-primary" />
                        )}
                    </div>
                    <div>
                        <p className="text-base font-bold text-gray-900 mb-1">
                            {isWarning
                                ? 'Analyse de Risque : Signaux faibles détectés'
                                : 'Audit Expert & Accompagnement Stratégique'
                            }
                        </p>
                        <p className="text-sm text-gray-600 max-w-2xl">
                            {isWarning
                                ? 'Votre score de santé financière est en baisse. Un audit expert peut identifier les leviers de redressement immédiats.'
                                : 'Passez de la donnée à la décision. Nos experts vous accompagnent pour structurer votre fonction finance et automatiser vos reportings.'
                            }
                        </p>
                    </div>
                </div>
                <Link
                    href="/consulting"
                    className={`
                        inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all shadow-sm hover:shadow-md
                        ${isWarning
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : 'bg-accent-primary text-white hover:bg-accent-primary-hover'
                        }
                    `}
                >
                    {isWarning ? 'Réserver mon Audit' : 'Voir les Formules'}
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}
