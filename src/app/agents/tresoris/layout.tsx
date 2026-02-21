import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'TRESORIS — Agent IA de Pilotage de Trésorerie 90 Jours | FinSight',
    description: 'TRESORIS surveille votre trésorerie 24/7, prédit vos flux à 90 jours et vous alerte avant les tensions. Détection automatique des risques cash pour PME. Démo gratuite.',
    keywords: [
        'tresoris agent ia',
        'agent ia trésorerie',
        'pilotage trésorerie automatique',
        'prévision trésorerie 90 jours',
        'surveillance cash pme',
        'alertes trésorerie automatiques',
        'gestion trésorerie ia',
    ],
    openGraph: {
        title: 'TRESORIS — Agent IA Trésorerie 90 Jours | FinSight',
        description: 'TRESORIS prédit vos flux de trésorerie à 90 jours, surveille votre cash 24/7 et vous alerte avant les tensions.',
        url: 'https://finsight.zineinsight.com/agents/tresoris',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [{
            url: 'https://finsight.zineinsight.com/og-agents.png',
            width: 1200,
            height: 630,
            alt: 'TRESORIS - Agent IA Trésorerie PME'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'TRESORIS | Agent IA Trésorerie 90 Jours - FinSight',
        description: 'Prévision trésorerie 90 jours, alertes cash automatiques et surveillance 24/7 pour PME.',
        images: ['https://finsight.zineinsight.com/og-agents.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/agents/tresoris'
    },
    robots: { index: true, follow: true }
}

export default function TresorisLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
