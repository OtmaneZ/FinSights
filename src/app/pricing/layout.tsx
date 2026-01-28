import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Tarifs FinSight | Plans & Pricing Plateforme Finance - FinSight',
    description: 'Découvrez nos offres : Starter gratuit (Score FinSight™), Pro à 49€/mois (dashboard complet + agents IA), Scale sur-mesure. Essai gratuit 14 jours sans engagement. Transparent, scalable, adapté aux TPE/PME.',
    keywords: [
        'tarifs logiciel finance',
        'prix daf virtuel',
        'abonnement pilotage financier',
        'logiciel comptable pme prix',
        'saas finance tarifs',
        'dashboard financier gratuit'
    ],
    openGraph: {
        title: 'Tarifs FinSight | Plans Starter, Pro, Scale',
        description: 'De 0€ à 49€/mois. Essai gratuit 14 jours. Transparent, sans engagement, adapté aux TPE/PME.',
        url: 'https://finsight.zineinsight.com/pricing',
        siteName: 'FinSight',
        images: [
            {
                url: 'https://finsight.zineinsight.com/og-pricing.png',
                width: 1200,
                height: 630,
                alt: 'FinSight - Tarifs & Plans'
            }
        ],
        locale: 'fr_FR',
        type: 'website'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tarifs FinSight | Plans Starter, Pro, Scale',
        description: 'De 0€ à 49€/mois. Essai gratuit 14 jours. Transparent, sans engagement.',
        images: ['https://finsight.zineinsight.com/og-pricing.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/pricing'
    }
}

export default function PricingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
