import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Agents IA Finance | Automatisez votre Pilotage Financier - FinSight',
    description: 'Découvrez nos 4 agents IA spécialisés en finance : Trésoris (trésorerie), Margo (marges), Résilius (résilience) et Vigilo (risques). Automatisez l\'analyse de vos données comptables et obtenez des insights actionnables en temps réel.',
    keywords: [
        'agent ia finance',
        'automatisation comptable',
        'analyse financière ia',
        'trésorerie automatisée',
        'pilotage financier pme',
        'daf virtuel',
        'assistant financier ia'
    ],
    openGraph: {
        title: 'Agents IA Finance | Automatisez votre Pilotage Financier',
        description: '4 agents IA spécialisés pour piloter votre trésorerie, marges, résilience et risques. Gagnez 15h/mois sur votre reporting financier.',
        url: 'https://finsight.zineinsight.com/agents',
        siteName: 'FinSight',
        images: [
            {
                url: 'https://finsight.zineinsight.com/og-agents.png',
                width: 1200,
                height: 630,
                alt: 'FinSight - 4 Agents IA Finance'
            }
        ],
        locale: 'fr_FR',
        type: 'website'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Agents IA Finance | Automatisez votre Pilotage Financier',
        description: '4 agents IA spécialisés pour piloter votre trésorerie, marges, résilience et risques.',
        images: ['https://finsight.zineinsight.com/og-agents.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/agents'
    }
}

export default function AgentsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
