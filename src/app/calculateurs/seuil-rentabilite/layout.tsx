import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur Seuil de Rentabilité : Point Mort & Break-Even',
    description: 'À partir de combien de ventes êtes-vous rentable ? Calculez votre point mort sans inscription. Inclus : benchmarks sectoriels + leviers de réduction charges. Gratuit.',
    keywords: 'seuil rentabilité calcul, point mort entreprise, break even point, calculateur seuil rentabilité, charges fixes variables, ca minimum rentable, point mort formule, équilibre financier pme',
    openGraph: {
        title: 'Calculateur Seuil de Rentabilité | Point Mort en 30s',
        description: 'À partir de combien de ventes êtes-vous rentable ? Calculez point mort + benchmarks sectoriels + leviers réduction. Sans inscription.',
        url: 'https://finsight.zineinsight.com/calculateurs/seuil-rentabilite',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-calculateur-seuil.png',
                width: 1200,
                height: 630,
                alt: 'Calculateur Seuil de Rentabilité gratuit FinSight',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Calculateur Seuil de Rentabilité | Point Mort',
        description: 'CA minimum pour être rentable + formule + conseils DAF. Sans inscription.',
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
