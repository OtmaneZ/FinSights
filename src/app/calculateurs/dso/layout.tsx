import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur DSO gratuit - Délai paiement clients | FinSight',
    description: 'Calculez votre Days Sales Outstanding (délai de paiement clients) en 30 secondes. Formule PCG 2025, benchmarks sectoriels et interprétation automatique.',
    keywords: 'calculateur dso, days sales outstanding, délai paiement, créances clients, kpi financier, pme, recouvrement',
    openGraph: {
        title: 'Calculateur DSO gratuit - FinSight',
        description: 'Outil gratuit pour calculer votre DSO avec benchmarks sectoriels',
        url: 'https://getfinsight.fr/calculateurs/dso',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Calculateur DSO gratuit',
        description: 'Calculez votre délai de paiement clients en 30 secondes',
    },
    alternates: {
        canonical: 'https://getfinsight.fr/calculateurs/dso',
    },
}

export default function DSOLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
