import { type Metadata } from 'next'
import HomeClient from './HomeClient'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Comment FinSight structure le pilotage financier d\'une PME ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "FinSight connecte vos données comptables et opérationnelles (ERP, exports, Excel) pour construire un pilotage fiable via Power BI, SQL et Python. Le Score FinSight™ (0-100) évalue 4 piliers — Cash, Marges, Résilience, Risques — pour vous donner une vision claire à 90 jours.",
      },
    },
    {
      '@type': 'Question',
      name: "Qu'est-ce que le Score FinSight™ ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Le Score FinSight™ est un indicateur exclusif de santé financière noté sur 100. Il analyse 4 piliers critiques de votre entreprise : Cash, Marges, Résilience et Risques, pour vous permettre de décider avec 3 mois d'avance.",
      },
    },
    {
      '@type': 'Question',
      name: 'Comment se déroule un diagnostic financier avec FinSight ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Le diagnostic débute par un échange stratégique de 30 minutes pour identifier vos enjeux. Nous réalisons ensuite un audit flash en 5 jours pour détecter vos fuites de cash et établir un plan d'action immédiat avec 3 recommandations chiffrées.",
      },
    },
  ],
}

const aggregateRatingSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'FinSight — Pilotage Financier par la Data',
  url: 'https://finsight.zineinsight.com',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '47',
    bestRating: '5',
    worstRating: '1',
  },
}

export const metadata: Metadata = {
  title: 'FinSight | Pilotage Financier & Data pour Dirigeants PME (2M€ à 20M€)',
  description: "Structurez votre pilotage financier par la data. Score FinSight™ (0-100), vision cash à 90 jours, tableaux de bord Power BI et agents IA finance. Diagnostic stratégique offert.",
  keywords: [
    'pilotage financier data pme',
    'score finsight',
    'structuration financière pme',
    'power bi finance pme',
    'audit financier pme',
    'agents ia finance',
    'tableau de bord financier pme',
    'anticipation trésorerie',
    'consulting finance data',
    'dso optimisation pme',
  ],
  alternates: {
    canonical: 'https://finsight.zineinsight.com',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://finsight.zineinsight.com',
    siteName: 'FinSight',
    title: 'FinSight | Pilotage Financier & Data pour PME',
    description: "Décidez avec 3 mois d'avance. Score FinSight™, structuration Power BI et agents IA finance pour dirigeants PME ambitieux.",
    images: [{
      url: 'https://finsight.zineinsight.com/images/og-default.png',
      width: 1200,
      height: 630,
      alt: 'FinSight - Pilotage Financier & Data pour PME 2M€-20M€',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinSight | Pilotage Financier & Data · PME',
    description: 'Score FinSight™ + structuration Power BI + agents IA. Pilotage financier data-driven pour dirigeants PME ambitieux.',
    images: ['https://finsight.zineinsight.com/images/og-default.png'],
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
      />
      <HomeClient />
    </>
  )
}
