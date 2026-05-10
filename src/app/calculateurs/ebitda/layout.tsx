import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur EBITDA PME 2026 - Rentabilité opérationnelle | FinSight',
    description: 'Calculez votre EBITDA et taux de marge opérationnelle. Benchmark sectoriel et interprétation DAF.',
    keywords: 'calculateur ebitda pme, formule ebitda, marge ebitda, simulateur ebitda, benchmark ebitda secteur, ebitda industrie services commerce',
    alternates: {
        canonical: 'https://finsight.zineinsight.com/calculateurs/ebitda',
    },
    openGraph: {
        title: 'Calculateur EBITDA PME - Marge & Benchmark | FinSight',
        description: 'Mesurez votre EBITDA, votre marge EBITDA et comparez-vous aux standards sectoriels.',
        url: 'https://finsight.zineinsight.com/calculateurs/ebitda',
        type: 'website',
    },
}

export default function EBITDAPathLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
