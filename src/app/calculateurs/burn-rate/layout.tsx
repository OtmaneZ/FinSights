import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Calculateur Burn Rate & Runway 2026 | FinSight',
    description: 'Calculez votre consommation de cash et runway en 2 minutes. Alertes et benchmark pour PME et startups.',
    keywords: 'calculateur burn rate, runway pme, simulation trésorerie startup, date rupture cash, burn rate net, calcul runway',
    alternates: {
        canonical: 'https://finsight.zineinsight.com/calculateurs/burn-rate',
    },
    openGraph: {
        title: 'Calculateur Burn Rate & Runway - Alerte Cash | FinSight',
        description: 'Anticipez votre rupture de trésorerie avec burn rate net + runway en mois.',
        url: 'https://finsight.zineinsight.com/calculateurs/burn-rate',
        type: 'website',
    },
}

export default function BurnRatePathLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
