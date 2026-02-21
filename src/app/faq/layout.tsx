import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'FAQ FinSight | Questions Fréquentes sur le DAF Externalisé & la Plateforme',
    description: 'Toutes les réponses à vos questions : DAF externalisé vs expert-comptable, sécurité des données, formats acceptés, tarifs, engagement. FinSight - PME 1-100M€.',
    keywords: [
        'faq daf externalisé',
        'questions finsight',
        'aide pilotage financier',
        'faq finance pme',
        'daf externalisé questions',
        'sécurité données financières',
    ],
    openGraph: {
        title: 'FAQ FinSight | Toutes vos questions sur le DAF Externalisé',
        description: 'DAF externalisé, sécurité des données, tarifs, formats : toutes les réponses aux questions des dirigeants de PME.',
        url: 'https://finsight.zineinsight.com/faq',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'website',
        images: [{
            url: 'https://finsight.zineinsight.com/images/og-default.png',
            width: 1200,
            height: 630,
            alt: 'FAQ FinSight - Direction Financière Externalisée'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FAQ FinSight | Questions sur le DAF Externalisé & la Plateforme',
        description: 'Réponses claires sur le DAF externalisé, la sécurité, les tarifs et l\'utilisation de FinSight.',
        images: ['https://finsight.zineinsight.com/images/og-default.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/faq'
    },
    robots: {
        index: true,
        follow: true,
    }
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
