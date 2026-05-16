import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur DSO : cash bloqué chez vos clients | FinSight',
    description:
        'Combien vos clients vous doivent en jours et en euros ? DSO en 30 s, benchmark sectoriel et leviers pour encaisser plus vite. Outil gratuit pour PME.',
    keywords: 'calculateur dso gratuit, dso calcul en ligne, simulateur calcul dso, formule dso, days sales outstanding pme, réduire dso, délai paiement clients, dso moyen secteur banque de france, créances clients pme, cash immobilisé dso',
    openGraph: {
        title: 'Calculateur DSO : cash bloqué chez vos clients | FinSight',
        description:
            'Combien vos clients vous doivent en jours et en euros ? DSO en 30 s, benchmark sectoriel et leviers pour encaisser plus vite. Outil gratuit pour PME.',
        url: 'https://finsight.zineinsight.com/calculateurs/dso',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-calculateur-dso.png',
                width: 1200,
                height: 630,
                alt: 'Calculateur DSO FinSight - Benchmarks sectoriels & cash immobilisé',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Calculateur DSO : cash bloqué chez vos clients | FinSight',
        description:
            'Combien vos clients vous doivent en jours et en euros ? DSO en 30 s, benchmark sectoriel et leviers pour encaisser plus vite. Outil gratuit pour PME.',
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/calculateurs/dso',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function DSOLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
