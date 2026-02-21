import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur Seuil de Rentabilité 2026 – Point Mort en 30s | PME & Dirigeants',
    description: 'Calculez votre point mort en 30 secondes : à partir de quel CA êtes-vous rentable ? Benchmarks sectoriels 2026, marge sur coûts variables, leviers de réduction charges. Outil DAF pour PME.',
    keywords: 'calculateur seuil rentabilité 2026, point mort entreprise, break even point, seuil rentabilité formule, charges fixes variables, ca minimum rentable, point mort calcul, équilibre financier pme, diagnostic rentabilité pme',
    openGraph: {
        title: 'Calculateur Seuil de Rentabilité 2026 – Point Mort en 30s | PME',
        description: 'Point mort en 30 secondes. CA minimum pour être rentable, benchmarks sectoriels 2026, leviers de réduction charges. Outil DAF pour dirigeants PME.',
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
        title: 'Calculateur Point Mort 2026 – Seuil de Rentabilité en 30s | PME',
        description: 'Point mort en 30 secondes + CA minimum rentable + benchmarks + recommandations DAF.',
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
