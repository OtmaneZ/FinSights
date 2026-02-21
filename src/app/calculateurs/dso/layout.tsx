import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Analyse DSO — Évaluez votre Délai de Paiement Client | FinSight',
    description: 'Combien de trésorerie immobilisée chez vos clients ? Évaluez votre DSO, comparez aux benchmarks sectoriels 2026 et identifiez vos leviers d\'optimisation.',
    keywords: 'analyse dso, dso calcul, calculer dso en ligne, formule dso, days sales outstanding, délai paiement clients, dso moyen secteur, créances clients pme, réduire dso, pré-diagnostic financier',
    openGraph: {
        title: 'Analyse DSO — Délai de Paiement Client | FinSight',
        description: 'Évaluez votre DSO + benchmarks sectoriels 2026 + leviers d\'optimisation. Premier niveau de diagnostic financier.',
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
        title: 'Analyse DSO — Délai de Paiement Client | FinSight',
        description: 'Évaluez votre DSO + benchmarks sectoriels + recommandations d\'expert.',
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
