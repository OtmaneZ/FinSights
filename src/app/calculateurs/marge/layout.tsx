import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur Marge Commerciale : Taux de Marge & Taux de Marque',
    description: 'Calculez votre marge commerciale en 30s. Taux de marge, taux de marque, coefficient multiplicateur. Formule + benchmarks par secteur + conseils DAF pour optimiser vos marges. Sans inscription.',
    keywords: 'calculateur marge commerciale, taux de marge calcul, taux de marque formule, marge brute entreprise, coefficient multiplicateur, prix de vente calcul, rentabilité produit, marge bénéficiaire',
    openGraph: {
        title: 'Calculateur Marge Commerciale | Taux de Marge en 30s',
        description: 'Calculez taux de marge et taux de marque instantanément. Formule + benchmarks sectoriels + conseils pour améliorer vos marges.',
        url: 'https://finsight.zineinsight.com/calculateurs/marge',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-calculateur-marge.png',
                width: 1200,
                height: 630,
                alt: 'Calculateur Marge Commerciale gratuit FinSight',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Calculateur Marge Commerciale | Taux de Marge & Marque',
        description: 'Taux de marge + taux de marque en 30s. Formule + conseils DAF. Sans inscription.',
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
