import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur CAC LTV 2026 — Ratio LTV/CAC SaaS & PME | FinSight',
    description: 'Calculez votre CAC, votre LTV et votre ratio LTV/CAC en 30 secondes. Interprétation claire : danger, attention, sain. Outil gratuit pour piloter votre acquisition.',
    keywords: 'calculateur cac ltv, ratio ltv cac, calcul ltv saas, calcul cac marketing, simulateur rentabilité client, ltv cac pme',
    alternates: {
        canonical: 'https://finsight.zineinsight.com/calculateurs/cac-ltv',
    },
    openGraph: {
        title: 'Calculateur CAC/LTV — Rentabilité Client | FinSight',
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
