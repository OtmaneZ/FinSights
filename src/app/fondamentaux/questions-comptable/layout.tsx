import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Questions à Poser à son Expert-Comptable | Guide Dirigeant PME - FinSight',
    description: 'Les 20 questions essentielles à poser à votre expert-comptable lors de la remise du bilan. Bilan, compte de résultat, trésorerie, ratios : obtenez des réponses actionnables.',
    keywords: [
        'questions expert-comptable',
        'que demander à son comptable',
        'bilan remise questions',
        'comprendre bilan comptable',
        'expert-comptable pme',
        'questions finances dirigeant',
    ],
    openGraph: {
        title: 'Questions à Poser à son Expert-Comptable | Guide PME - FinSight',
        description: '20 questions essentielles pour reprendre le contrôle de vos finances lors de la remise du bilan annuel.',
        url: 'https://finsight.zineinsight.com/fondamentaux/questions-comptable',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'article',
        images: [{
            url: 'https://finsight.zineinsight.com/images/og-default.png',
            width: 1200,
            height: 630,
            alt: 'Questions à poser à son expert-comptable - FinSight'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Questions à Poser à son Comptable | Guide PME - FinSight',
        description: '20 questions clés pour comprendre votre bilan et reprendre le contrôle de vos finances.',
        images: ['https://finsight.zineinsight.com/images/og-default.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/fondamentaux/questions-comptable'
    },
    robots: { index: true, follow: true }
}

export default function QuestionsComptableLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
