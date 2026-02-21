import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur DSO 2026 – Délai de Paiement Client en 30s | PME & Dirigeants',
    description: 'Calculez votre DSO en 30 secondes et découvrez combien de trésorerie est immobilisée chez vos clients. Benchmarks sectoriels 2026, interprétation DAF, leviers d\'optimisation. Outil pour dirigeants PME.',
    keywords: 'calculateur dso 2026, dso calcul, calculer dso en ligne, formule dso, days sales outstanding, délai paiement clients, dso moyen secteur, créances clients pme, réduire dso, pré-diagnostic financier, dso pme',
    openGraph: {
        title: 'Calculateur DSO 2026 – Délai de Paiement Client en 30s | PME',
        description: 'Calculez votre DSO en 30 secondes. Benchmarks sectoriels 2026, cash immobilisé, leviers d\'optimisation. Outil de diagnostic DAF pour PME.',
        url: 'https://finsight.zineinsight.com/calculateurs/dso',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-calculateur-dso.png',
                width: 1200,
                height: 630,
                alt: 'Analyse DSO FinSight - Formule et benchmarks sectoriels',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Calculateur DSO 2026 – Délai de Paiement en 30s | PME',
        description: 'DSO en 30 secondes + benchmarks sectoriels + leviers d\'optimisation cash.',
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
