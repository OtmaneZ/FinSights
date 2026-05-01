import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur Valorisation PME 2026 — Multiple EBITDA & Equity Value | FinSight',
    description: 'Estimez la valorisation de votre entreprise : valeur d’entreprise (EV), valeur des fonds propres et fourchette basse/haute selon multiple sectoriel.',
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
