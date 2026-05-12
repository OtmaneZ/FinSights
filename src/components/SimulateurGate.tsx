import { cookies } from 'next/headers'
import Link from 'next/link'

interface SimulateurGateProps {
  children: React.ReactNode
}

/**
 * Server Component — affiche le contenu si le cookie sim_access est présent,
 * sinon affiche un mur d'accès cohérent avec le design FinSight (blanc/gris, accents dorés).
 */
export default async function SimulateurGate({ children }: SimulateurGateProps) {
  const cookieStore = await cookies()
  const hasAccess = cookieStore.get('sim_access')?.value === '1'

  if (hasAccess) {
    return <>{children}</>
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 md:p-14 text-center shadow-sm">
      {/* Icône */}
      <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mx-auto mb-6">
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-white shadow-sm mb-5">
        <span className="text-xs font-medium tracking-widest text-accent-primary uppercase">Accès gratuit</span>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-3">
        Accès sur demande
      </h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
        Ce simulateur est réservé aux dirigeants et DAF.
        Indiquez votre email pour recevoir un lien d&apos;accès instantané — aucun mot de passe.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/simulateurs/acces"
          className="inline-flex items-center gap-2 bg-accent-primary hover:opacity-90 text-slate-900 font-semibold rounded-xl px-6 py-3 text-sm transition-opacity shadow-sm"
        >
          Accéder gratuitement →
        </Link>
        <Link
          href="/simulateurs"
          className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
        >
          Voir tous les simulateurs
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        Lien valable 24h · Aucun spam · Désabonnement en 1 clic
      </p>
    </div>
  )
}
