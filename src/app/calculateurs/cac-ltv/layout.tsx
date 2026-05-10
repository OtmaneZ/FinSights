import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur CAC & LTV 2026 - Rentabilité client | FinSight',
    description: 'Calculez votre coût d\'acquisition et valeur vie client. Ratio LTV/CAC, benchmark SaaS et PME. Gratuit.',
    keywords: 'calculateur cac ltv, ratio ltv cac, calcul ltv saas, calcul cac marketing, simulateur rentabilité client, ltv cac pme',
    alternates: {
        canonical: 'https://finsight.zineinsight.com/calculateurs/cac-ltv',
    },
    openGraph: {
        title: 'Calculateur CAC/LTV - Rentabilité Client | FinSight',
        description: 'Mesurez CAC, LTV et ratio LTV/CAC avec interprétation stratégique immédiate.',
        url: 'https://finsight.zineinsight.com/calculateurs/cac-ltv',
        type: 'website',
    },
}

export default function CacLtvPathLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
