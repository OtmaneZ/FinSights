import Link from 'next/link'

export const metadata = {
  title: 'Desinscription confirmee | FinSight',
  description: 'Votre desinscription a bien ete prise en compte.',
}

export default function DesinscriptionConfirmeePage() {
  return (
    <main className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-6 py-16">
      <section className="max-w-xl w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Desinscription confirmee</h1>
        <p className="text-slate-600 leading-relaxed">
          Votre adresse email a bien ete retiree des envois newsletter FinSight.
        </p>
        <p className="text-slate-600 leading-relaxed mt-2">
          Vous ne recevrez plus d&apos;emails hebdomadaires.
        </p>
        <Link
          href="/"
          className="inline-flex mt-6 px-5 py-2.5 rounded-lg bg-[#1B3A5C] text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Retour a l&apos;accueil
        </Link>
      </section>
    </main>
  )
}
