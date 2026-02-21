import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'DASHIS — Agent IA de Pilotage Financier Temps Réel | FinSight',
    description: 'DASHIS analyse vos données financières en continu et génère des tableaux de bord automatiques. Alertes intelligentes, détection d\'anomalies, vision 360° de votre PME. Démo gratuite.',
    keywords: [
        'dashis agent ia',
        'dashboard financier automatique',
        'pilotage financier temps réel',
        'tableau de bord ia pme',
        'alertes financières automatiques',
        'analyse financière automatisée',
        'agent ia tableau de bord',
    ],
    openGraph: {
        title: 'DASHIS — Agent IA Tableau de Bord Financier | FinSight',
        description: 'Pilotage financier 24/7 : DASHIS génère vos tableaux de bord, détecte les anomalies et vous alerte en temps réel.',
        url: 'https://finsight.zineinsight.com/agents/dashis',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [{
            url: 'https://finsight.zineinsight.com/og-agents.png',
            width: 1200,
            height: 630,
            alt: 'DASHIS - Agent IA Pilotage Financier'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DASHIS | Agent IA Tableau de Bord Financier - FinSight',
        description: 'Dashboards financiers automatiques, alertes 24/7 et détection d\'anomalies pour PME.',
        images: ['https://finsight.zineinsight.com/og-agents.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/agents/dashis'
    },
    robots: { index: true, follow: true }
}

export default function DashisLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
