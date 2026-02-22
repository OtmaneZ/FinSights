import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Méthodologie Score FinSight™ | 4 Piliers Finance PCG - FinSight',
    description: 'Découvrez la méthodologie du Score FinSight™ : 4 piliers (CASH, MARGIN, RESILIENCE, RISK) basés sur le Plan Comptable Général français. Score de 0 à 100 avec seuils adaptatifs et benchmarks sectoriels. Transparence totale de notre algorithme.',
    keywords: [
        'score financier pme',
        'méthodologie audit financier',
        'plan comptable général',
        'indicateurs financiers',
        'ratios financiers pcg',
        'santé financière entreprise',
        'algorithme scoring financier'
    ],
    openGraph: {
        title: 'Méthodologie Score FinSight™ | 4 Piliers Finance',
        description: 'CASH, MARGIN, RESILIENCE, RISK : découvrez comment nous évaluons la santé financière de votre entreprise selon le PCG français.',
        url: 'https://finsight.zineinsight.com/methodologie',
        siteName: 'FinSight',
        images: [
            {
                url: 'https://finsight.zineinsight.com/og-methodologie.png',
                width: 1200,
                height: 630,
                alt: 'FinSight - Méthodologie Score 4 Piliers'
            }
        ],
        locale: 'fr_FR',
        type: 'website'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Méthodologie Score FinSight™ | 4 Piliers Finance',
        description: 'CASH, MARGIN, RESILIENCE, RISK : transparence totale sur notre algorithme de scoring financier.',
        images: ['https://finsight.zineinsight.com/og-methodologie.png']
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/methodologie'
    }
}

// ---------------------------------------------------------------------------
// JSON-LD Structured Data — FAQPage schema
// ---------------------------------------------------------------------------
const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'Comment le Score FinSight™ gère-t-il les données manquantes ?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'FinSight utilise un système de confiance à 3 niveaux (High, Medium, Low) basé sur la qualité et la complétude des données. Le score est toujours affiché avec son niveau de confiance pour une transparence totale. Si des données clés manquent, l\'impact estimé est quantifié.'
            }
        },
        {
            '@type': 'Question',
            name: 'Le Score FinSight™ est-il auditable ?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Oui, 100% transparent. Chaque score inclut la décomposition des 4 piliers (CASH, MARGIN, RESILIENCE, RISK), les KPIs utilisés, les seuils appliqués et le niveau de confiance. Un expert-comptable peut recalculer manuellement le score.'
            }
        },
        {
            '@type': 'Question',
            name: 'Le Score FinSight™ est-il comparable entre secteurs ?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Partiellement. Les seuils sont calibrés pour être universels, mais FinSight affiche des benchmarks sectoriels (SaaS, Commerce, Services, BTP, Industrie, CHR) pour contextualiser le score selon votre industrie. Les sources incluent la Banque de France et Altares 2024.'
            }
        },
        {
            '@type': 'Question',
            name: 'Quelle est la conformité RGPD et la sécurité des données FinSight ?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Données 100% chiffrées (AES-256 au repos, TLS 1.3 en transit), hébergées en Europe. Aucune revente de données à des tiers. Droit à l\'oubli garanti.'
            }
        },
        {
            '@type': 'Question',
            name: 'Quels sont les 4 piliers du Score FinSight™ ?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Le Score FinSight™ évalue la santé financière sur 4 piliers, chacun noté sur 25 points : CASH (trésorerie et liquidité — DSO, BFR, burn rate), MARGIN (rentabilité — marge brute, seuil de rentabilité, ROI, EBITDA), RESILIENCE (stabilité structurelle — endettement, LTV/CAC, valorisation), et RISK (anomalies croisées — signaux de fragilité combinés).'
            }
        }
    ]
}

export default function MethodologieLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            {children}
        </>
    )
}
