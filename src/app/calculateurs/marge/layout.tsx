import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Analyse Marge Commerciale — Taux de Marge & Taux de Marque | FinSight',
    description: 'Vos prix reflètent-ils votre valeur ? Analysez vos marges, comparez aux benchmarks sectoriels (Commerce, SaaS, Services) et identifiez vos leviers tarifaires.',
    keywords: 'analyse marge commerciale, taux de marge calcul, taux de marque formule, marge brute entreprise, coefficient multiplicateur, prix de vente calcul, rentabilité produit, marge bénéficiaire, diagnostic marge',
    openGraph: {
        title: 'Analyse Marge Commerciale | Taux de Marge & Marque | FinSight',
        description: 'Analysez vos marges + benchmarks sectoriels + leviers tarifaires. Premier niveau de diagnostic financier.',
        url: 'https://finsight.zineinsight.com/calculateurs/marge',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-calculateur-marge.png',
                width: 1200,
                height: 630,
                alt: 'Analyse Marge Commerciale FinSight',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Analyse Marge Commerciale | FinSight',
        description: 'Taux de marge + taux de marque + benchmarks sectoriels + recommandations d\'expert.',
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/calculateurs/marge',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function MargeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
