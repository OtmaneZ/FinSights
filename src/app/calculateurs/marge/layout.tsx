import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur Marge Commerciale 2026 – Taux de Marge en 30s | PME & Dirigeants',
    description: 'Calculez votre taux de marge et taux de marque en 30 secondes. Benchmarks sectoriels 2026 (Commerce, SaaS, Services), interprétation DAF, leviers tarifaires. Outil pour dirigeants PME.',
    keywords: 'calculateur marge commerciale 2026, taux de marge calcul, taux de marque formule, marge brute pme, coefficient multiplicateur, prix de vente calcul, rentabilité produit, marge bénéficiaire, diagnostic marge pme',
    openGraph: {
        title: 'Calculateur Marge Commerciale 2026 – Taux de Marge en 30s | PME',
        description: 'Taux de marge en 30 secondes. Benchmarks sectoriels 2026, taux de marque, leviers tarifaires. Outil de diagnostic DAF pour dirigeants PME.',
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
        title: 'Calculateur Marge Commerciale 2026 – Taux de Marge en 30s | PME',
        description: 'Taux de marge + taux de marque en 30 secondes + benchmarks sectoriels 2026 + leviers tarifaires.',
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
