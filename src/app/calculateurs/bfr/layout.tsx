import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur BFR gratuit - Besoin en Fonds de Roulement | FinSight',
    description: 'Calculez votre Besoin en Fonds de Roulement gratuitement. Formule PCG, interprétation automatique et conseils d\'optimisation pour votre trésorerie.',
    keywords: 'calculateur bfr, besoin fonds roulement, trésorerie, working capital, stocks, fournisseurs, pme',
    openGraph: {
        title: 'Calculateur BFR gratuit - FinSight',
        description: 'Outil gratuit pour calculer votre BFR et optimiser votre trésorerie',
        url: 'https://finsight.zineinsight.com/calculateurs/bfr',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Calculateur BFR gratuit',
        description: 'Calculez votre Besoin en Fonds de Roulement en quelques clics',
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/calculateurs/bfr',
    },
}

export default function BFRLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
