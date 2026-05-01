import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function RapportPremiumSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const sessionId = searchParams.session_id

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-28 pb-24">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-primary">FinSight™ Premium</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">Merci !</h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Votre rapport premium est en cours de génération.
          </p>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Vous le recevrez par email en moins d&apos;une minute.
          </p>
          {sessionId && (
            <p className="mt-6 text-xs text-slate-400 break-all">Référence : {sessionId}</p>
          )}
          <div className="mt-10">
            <Link
              href="/mon-diagnostic"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-primary px-6 py-3 text-sm font-semibold text-white hover:bg-accent-primary-hover transition-colors"
            >
              Voir mon Score FinSight™ complet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
