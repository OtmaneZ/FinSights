import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Méthodologie Score FinSight™ | 4 Piliers Finance PCG - FinSight',
    description: 'Découvrez la méthodologie du Score FinSight™ : 4 piliers (CASH, MARGIN, RESILIENCE, RISK) basés sur le Plan Comptable Général français. Score de 0 à 100 avec seuils adaptatifs et benchmarks sectoriels. Transparence totale de notre algorithme.',
    keywords: [
        'score financier pme',
        'méthodologie audit financier',
        'plan comptable général',
        'indicateurs financiers',
        'ratios financiers pcg',
        'santé financière entreprise',
        'algorithme scoring financier'
    ],
    openGraph: {
        title: 'Méthodologie Score FinSight™ | 4 Piliers Finance',
        description: 'CASH, MARGIN, RESILIENCE, RISK : découvrez comment nous évaluons la santé financière de votre entreprise selon le PCG français.',
        url: 'https://finsight.zineinsight.com/methodologie',
        siteName: 'FinSight',
        images: [
            {
                url: 'https://finsight.zineinsight.com/og-methodologie.png',
                width: 1200,
                height: 630,
                alt: 'FinSight - Méthodologie Score 4 Piliers'
            }
        ],
        locale: 'fr_FR',
        type: 'website'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Méthodologie Score FinSight™ | 4 Piliers Finance',
        description: 'CASH, MARGIN, RESILIENCE, RISK : transparence totale sur notre algorithme de scoring financier.',
        images: ['https://finsight.zineinsight.com/og-methodologie.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/methodologie'
    }
}

export default function MethodologieLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
