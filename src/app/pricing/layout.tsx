export const metadata = {
    title: 'Tarifs FinSight - Dashboard Financier IA dès 99€/mois | Essai Gratuit',
    description: 'Plans Starter (gratuit), Business (99€/mois) et Growth (199€/mois). IA illimitée, API REST, alertes temps réel, export PDF/Excel. Essayez gratuitement sans CB.',
    keywords: ['tarifs dashboard financier', 'prix FinSight', 'abonnement CFO', 'essai gratuit finance', 'pricing SaaS finance'],
    openGraph: {
        title: 'Tarifs FinSight - Essai Gratuit',
        description: 'Plan Starter gratuit, Business 99€/mois, Growth 199€/mois. IA GPT-4, API REST, alertes email.',
        url: 'https://getfinsight.fr/pricing',
        images: [{
            url: 'https://getfinsight.fr/images/og-pricing.png',
            width: 1200,
            height: 630,
            alt: 'Tarifs FinSight'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tarifs FinSight - Essai Gratuit',
        description: 'Plan Starter gratuit, Business 99€/mois, Growth 199€/mois',
        images: ['https://getfinsight.fr/images/og-pricing.png']
    },
    alternates: {
        canonical: 'https://getfinsight.fr/pricing'
    }
}

export default function PricingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
