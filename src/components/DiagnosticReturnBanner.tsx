import Link from 'next/link'
import { ArrowRight, BarChart3 } from 'lucide-react'

/**
 * Bannière discrète affichée après un calcul individuel.
 * Invite l'utilisateur à consulter son Score FinSight™ sans interrompre le parcours.
 * Ne s'affiche que si un résultat vient d'être calculé (prop `show`).
 */
export default function DiagnosticReturnBanner({ show }: { show: boolean }) {
    if (!show) return null

    return (
        <div className="mt-6 w-full">
            <Link
                href="/mon-diagnostic"
                className="group flex items-center justify-between gap-4 px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-white transition-all duration-200"
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-950 flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            Résultat ajouté au Score FinSight™
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Consulter le tableau de bord complet — piliers, forces, priorités d'action
                        </p>
                    </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
        </div>
    )
}
