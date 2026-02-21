import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Ratios Financiers Essentiels PME : Calcul & Interprétation (2026) | FinSight',
    description: 'Les ratios financiers clés à maîtriser pour piloter votre PME : liquidité, rentabilité, endettement, activité. Formules, benchmarks sectoriels et seuils d\'alerte.',
    keywords: [
        'ratios financiers pme',
        'ratio de liquidité',
        'ratio d\'endettement',
        'ratio de rentabilité',
        'ratio rotation stocks',
        'analyser ratios financiers',
        'indicateurs financiers pme',
    ],
    openGraph: {
        title: 'Ratios Financiers Essentiels PME | Formules & Benchmarks - FinSight',
        description: 'Liquidité, rentabilité, endettement : les ratios financiers clés pour PME avec formules et benchmarks sectoriels.',
        url: 'https://finsight.zineinsight.com/fondamentaux/ratios-essentiels',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'article',
        images: [{
            url: 'https://finsight.zineinsight.com/images/og-default.png',
            width: 1200,
            height: 630,
            alt: 'Ratios financiers essentiels PME - FinSight'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ratios Financiers PME | Formules & Benchmarks - FinSight',
        description: 'Les ratios clés : liquidité, rentabilité, endettement, activité — avec benchmarks.',
        images: ['https://finsight.zineinsight.com/images/og-default.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/fondamentaux/ratios-essentiels'
    },
    robots: { index: true, follow: true }
}

export default function RatiosEssentielsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
