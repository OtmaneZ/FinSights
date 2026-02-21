import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Analyse Seuil de Rentabilité — Point Mort & Break-Even | FinSight',
    description: 'À partir de combien de ventes êtes-vous rentable ? Évaluez votre point mort, comparez aux benchmarks sectoriels et identifiez vos leviers de réduction de charges.',
    keywords: 'analyse seuil rentabilité, point mort entreprise, break even point, calculateur seuil rentabilité, charges fixes variables, ca minimum rentable, point mort formule, équilibre financier pme, diagnostic rentabilité',
    openGraph: {
        title: 'Analyse Seuil de Rentabilité — Point Mort | FinSight',
        description: 'Évaluez votre point mort + benchmarks sectoriels + leviers de réduction. Premier niveau de diagnostic financier.',
        url: 'https://finsight.zineinsight.com/calculateurs/seuil-rentabilite',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-calculateur-seuil.png',
                width: 1200,
                height: 630,
                alt: 'Analyse Seuil de Rentabilité FinSight',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Analyse Seuil de Rentabilité — Point Mort | FinSight',
        description: 'CA minimum pour être rentable + benchmarks + recommandations d\'expert.',
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/calculateurs/seuil-rentabilite',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function SeuilRentabiliteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
