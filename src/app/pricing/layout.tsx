export const metadata = {
    title: 'Tarifs FinSight - Dashboard Financier IA dès 79€/mois | Essai Gratuit',
    description: 'Plans Gratuit, Pro (79€/mois) et Scale (249€/mois). IA illimitée, API REST, alertes temps réel, export PDF/Excel. Essayez gratuitement sans CB.',
    keywords: ['tarifs dashboard financier', 'prix FinSight', 'abonnement CFO', 'essai gratuit finance', 'pricing SaaS finance'],
    openGraph: {
        title: 'Tarifs FinSight - Essai Gratuit',
        description: 'Plan Gratuit illimité, Pro 79€/mois, Scale 249€/mois. IA GPT-4, API REST, alertes email.',
        url: 'https://finsight.zineinsight.com/pricing',
        images: [{
            url: 'https://finsight.zineinsight.com/images/og-pricing.png',
            width: 1200,
            height: 630,
            alt: 'Tarifs FinSight'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tarifs FinSight - Essai Gratuit',
        description: 'Plan Gratuit illimité, Pro 79€/mois, Scale 249€/mois',
        images: ['https://finsight.zineinsight.com/images/og-pricing.png']
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
