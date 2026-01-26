import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Pour qui ? | FinSight - Solutions FP&A sur-mesure',
    description: 'Solutions FP&A adaptées à votre profil : CFO de Scale-up SaaS, DAF de PME ou Cabinet d\'expertise comptable. Découvrez comment FinSight peut transformer votre pilotage financier.',
    keywords: [
        'FP&A pour SaaS',
        'dashboard CFO',
        'DAF PME',
        'cabinet expertise comptable',
        'MRR ARR dashboard',
        'budget vs réalisé',
        'prévisionnel trésorerie',
        'consultant finance data'
    ],
    openGraph: {
        title: 'Pour qui est FinSight ? Solutions FP&A par profil',
        description: 'CFO Scale-up SaaS, DAF PME ou Cabinet comptable : identifiez votre profil et découvrez la solution FP&A adaptée.',
        url: 'https://getfinsight.fr/pour-qui',
        type: 'website',
        images: [
            {
                url: 'https://getfinsight.fr/images/og-pour-qui.png',
                width: 1200,
                height: 630,
                alt: 'FinSight - Solutions FP&A par profil'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pour qui est FinSight ? Solutions FP&A sur-mesure',
        description: 'CFO SaaS, DAF PME ou Cabinet comptable : la solution FP&A adaptée à votre métier',
        images: ['https://getfinsight.fr/images/og-pour-qui.png']
    },
    alternates: {
        canonical: 'https://getfinsight.fr/pour-qui'
    }
}
