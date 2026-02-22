import { Metadata } from 'next'
import {
    AGGREGATE_RATING_VALUE,
    AGGREGATE_REVIEW_COUNT,
    BEST_RATING,
    WORST_RATING,
} from '@/config/social-proof'

export const metadata: Metadata = {
    title: 'FinSight Advanced : Avis & Test — Diagnostic PME en 7 min | Analyse Prédictive',
    description: 'FinSight Advanced : avis honnête et test complet. Analyse financière prédictive pour PME 2–20 M€ — Score FinSight™ 0→100, 4 piliers, benchmarks Banque de France. Résultat en 7 minutes, 0 donnée transmise.',
    keywords: [
        'analyse financière prédictive finsight advanced avis',
        'finsight advanced test',
        'diagnostic financier pme',
        'score finsight',
        'analyse prédictive pme',
        'logiciel analyse financière pme',
        'outil diagnostic financier dirigeant',
        'benchmark sectoriel banque de france',
    ],
    openGraph: {
        title: 'FinSight Advanced : Avis & Test — Analyse Financière Prédictive PME',
        description: 'Score FinSight™ 0→100, 4 piliers (CASH, MARGIN, RÉSILIENCE, RISQUE), benchmarks sectoriels réels. Diagnostic complet en 7 minutes. Avis utilisateurs et méthodologie transparente.',
        url: 'https://finsight.zineinsight.com/analyse-predictive',
        siteName: 'FinSight',
        locale: 'fr_FR',
        type: 'article',
        images: [
            {
                url: 'https://finsight.zineinsight.com/images/og-analyse-predictive.png',
                width: 1200,
                height: 630,
                alt: 'FinSight Advanced — Analyse financière prédictive PME, avis et test',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FinSight Advanced : Avis & Test — Diagnostic PME en 7 min',
        description: 'Score FinSight™ 0→100, analyse prédictive, benchmarks Banque de France 2024. Avis complet et test en conditions réelles.',
    },
    alternates: {
        canonical: 'https://finsight.zineinsight.com/analyse-predictive',
    },
    robots: {
        index: true,
        follow: true,
    },
}

// ---------------------------------------------------------------------------
// JSON-LD — Review + FAQPage schema
// ---------------------------------------------------------------------------
const reviewJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FinSight Advanced',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: 'https://finsight.zineinsight.com/diagnostic/guide',
    description: 'Outil d\'analyse financière prédictive pour PME — Score FinSight™ sur 100, 4 piliers, benchmarks sectoriels Banque de France 2024.',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        description: 'Diagnostic gratuit en 7 minutes',
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: AGGREGATE_RATING_VALUE,
        reviewCount: AGGREGATE_REVIEW_COUNT,
        bestRating: BEST_RATING,
        worstRating: WORST_RATING,
    },
    review: [
        {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Jean D.' },
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
            reviewBody: 'Le diagnostic a mis le doigt sur 180 k€ de cash immobilisé dans nos créances. Résultat en 7 minutes, sans fioriture.',
        },
        {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Directrice Administrative, PME industrie' },
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
            reviewBody: 'Enfin un outil qui positionne nos ratios par rapport aux vrais benchmarks sectoriels. Le Score RÉSILIENCE a identifié notre endettement trop élevé bien avant notre banquier.',
        },
    ],
}

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'Qu\'est-ce que FinSight Advanced ?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'FinSight Advanced est un outil d\'analyse financière prédictive pour PME (2–20 M€). Il génère un Score FinSight™ de 0 à 100 en analysant 4 piliers financiers — CASH, MARGIN, RÉSILIENCE, RISQUE — comparés aux médianes sectorielles Banque de France 2024.',
            },
        },
        {
            '@type': 'Question',
            name: 'Combien de temps dure le diagnostic FinSight ?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Le diagnostic complet dure environ 7 minutes. Il analyse 9 indicateurs financiers répartis sur 4 piliers, avec comparaison sectorielle automatique.',
            },
        },
        {
            '@type': 'Question',
            name: 'Mes données financières sont-elles en sécurité ?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Oui. Toutes les données restent dans votre navigateur (localStorage). Aucune donnée n\'est transmise à nos serveurs. RGPD : aucune inscription requise.',
            },
        },
        {
            '@type': 'Question',
            name: 'Quels benchmarks utilise FinSight ?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'FinSight utilise les médianes sectorielles publiées par la Banque de France (rapport 2024) et les données Altares pour 7 secteurs : Commerce, Industrie, Services B2B, BTP, Distribution, Tech/SaaS et Tous secteurs.',
            },
        },
        {
            '@type': 'Question',
            name: 'Quelle est la différence entre FinSight et un cabinet comptable ?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'FinSight est un outil de pré-diagnostic qui vous donne une vision instantanée et structurée de votre santé financière. Il identifie les signaux d\'alerte et priorise les actions. Pour un accompagnement DAF externalisé complet, FinSight propose ensuite un Audit Stratégique à 1 990€.',
            },
        },
    ],
}

export default function AnalysePredictiveLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            {children}
        </>
    )
}
