import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur Seuil de Rentabilité : Point Mort & Break-Even',
    description: 'Calculez votre seuil de rentabilité (point mort) en 30s. Découvrez le CA minimum pour couvrir vos charges fixes. Formule + interprétation DAF expert + leviers d\'optimisation. Sans inscription.',
    keywords: 'seuil rentabilité calcul, point mort entreprise, break even point, calculateur seuil rentabilité, charges fixes variables, ca minimum rentable, point mort formule, équilibre financier pme',
    openGraph: {
        title: 'Calculateur Seuil de Rentabilité | Point Mort en 30s',
        description: 'Découvrez le CA minimum pour être rentable. Formule du point mort + analyse DAF + recommandations pour réduire votre seuil.',
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
