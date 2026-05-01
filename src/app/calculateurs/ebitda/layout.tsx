import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur EBITDA PME 2026 — Marge EBITDA & Benchmark Sectoriel | FinSight',
    description: 'Calculez votre EBITDA en 30 secondes : résultat opérationnel, marge EBITDA (%) et comparaison sectorielle (industrie, services, commerce). Outil gratuit pour dirigeants PME.',
    keywords: 'calculateur ebitda pme, formule ebitda, marge ebitda, simulateur ebitda, benchmark ebitda secteur, ebitda industrie services commerce',
    alternates: {
        canonical: 'https://finsight.zineinsight.com/calculateurs/ebitda',
    },
    openGraph: {
        title: 'Calculateur EBITDA PME — Marge & Benchmark | FinSight',
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
