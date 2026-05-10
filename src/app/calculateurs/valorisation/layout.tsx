import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur Valorisation PME 2026 — Multiples EBITDA | FinSight',
    description: 'Estimez la valeur de votre entreprise en 2 minutes. Multiples sectoriels, méthodes DCF et comparable.',
    keywords: 'calculateur valorisation entreprise, multiple ebitda, valeur entreprise pme, equity value, valorisation pme, simulateur valorisation',
    alternates: {
        canonical: 'https://finsight.zineinsight.com/calculateurs/valorisation',
    },
    openGraph: {
        title: 'Calculateur Valorisation PME — Multiple EBITDA | FinSight',
        description: 'Calculez EV, Equity Value et fourchette de valorisation selon votre multiple.',
        url: 'https://finsight.zineinsight.com/calculateurs/valorisation',
        type: 'website',
    },
}

export default function ValorisationPathLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
