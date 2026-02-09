import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur DSO Gratuit : Mesurez votre Délai de Paiement Client',
    description: 'Calculez votre DSO en 30s. Inclus : Formule DSO = (Créances/CA) × 365, benchmarks sectoriels (Services, Commerce, Industrie, SaaS) et conseils de DAF pour réduire vos retards de paiement. Sans inscription.',
    keywords: 'calculateur dso gratuit, dso calcul, calculer dso en ligne, formule dso, days sales outstanding, délai paiement clients, dso moyen secteur, créances clients pme, réduire dso',
    openGraph: {
        title: 'Calculateur DSO Gratuit | Mesurez votre Délai de Paiement Client',
        description: 'Calculez votre Days Sales Outstanding en 30s. Formule + benchmarks sectoriels + conseils DAF pour optimiser vos encaissements. Sans inscription.',
        url: 'https://finsight.zineinsight.com/calculateurs/dso',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-calculateur-dso.png',
                width: 1200,
                height: 630,
                alt: 'Calculateur DSO gratuit FinSight - Formule et benchmarks sectoriels',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Calculateur DSO Gratuit | Délai de Paiement Client',
        description: 'Formule DSO + benchmarks sectoriels + conseils DAF. Sans inscription.',
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
