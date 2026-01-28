import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur DSO Gratuit 2026 : Formule + Benchmarks Sectoriels',
    description: 'Calculez votre DSO (délai de paiement clients) en 30 secondes. Formule DSO = (Créances/CA) × 365 + interprétation automatique + benchmarks Services, Commerce, Industrie, SaaS.',
    keywords: 'calculateur dso, dso calcul, calculer dso, formule dso, days sales outstanding, délai paiement clients, dso moyen secteur, créances clients pme',
    openGraph: {
        title: 'Calculateur DSO Gratuit 2026 | Formule + Benchmarks',
        description: 'Calculez votre Days Sales Outstanding en 30 secondes. Comparez votre délai de paiement clients aux standards de votre secteur.',
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
        title: 'Calculateur DSO Gratuit 2026 | FinSight',
        description: 'DSO = (Créances/CA) × 365. Calculez et comparez votre délai de paiement clients.',
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
