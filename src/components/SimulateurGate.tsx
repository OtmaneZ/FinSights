import { cookies } from 'next/headers'
import Link from 'next/link'

interface SimulateurGateProps {
  children: React.ReactNode
}

/**
 * Server Component — affiche le contenu si le cookie sim_access est présent,
 * sinon affiche un mur d'accès avec CTA vers /simulateurs/acces.
 */
export default async function SimulateurGate({ children }: SimulateurGateProps) {
  const cookieStore = await cookies()
  const hasAccess = cookieStore.get('sim_access')?.value === '1'

  if (hasAccess) {
    return <>{children}</>
  }

  // Mur d'accès
  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-8 md:p-12 text-center backdrop-blur-sm">
      <div className="w-14 h-14 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-white mb-3">
        Accès gratuit sur demande
      </h2>
      <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
        Ce simulateur est réservé aux dirigeants et DAF. 
        Entrez votre email pour recevoir un lien d'accès instantané — aucun mot de passe.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/simulateurs/acces"
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl px-6 py-3 text-sm transition-colors"
        >
          Accéder gratuitement →
        </Link>
        <Link
          href="/simulateurs"
          className="text-slate-500 hover:text-slate-400 text-sm transition"
        >
          Voir tous les simulateurs
        </Link>
      </div>

      <p className="text-xs text-slate-600 mt-6">
        Lien valable 24h · Aucun spam · Désabonnement en 1 clic
      </p>
    </div>
  )
}
