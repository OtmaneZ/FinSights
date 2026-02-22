import { type Metadata } from 'next'
import HomeClient from './HomeClient'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Pourquoi faire appel à un DAF externalisé pour sa PME ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Un DAF externalisé apporte l'expertise stratégique d'un directeur financier senior sans le coût d'un recrutement fixe. Il aide les dirigeants de PME (2 à 20M€ CA) à sécuriser leur trésorerie, optimiser leurs marges et piloter leur croissance avec des données fiables.",
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
  name: 'FinSight — Direction Financière Externalisée',
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
  title: 'FinSight | Direction Financière Externalisée pour Dirigeants PME (2M€ à 20M€)',
  description: "Pilotez votre PME avec 3 mois d'avance. Score FinSight™ (0-100), audit stratégique, tableaux de bord et agents IA finance. Échange stratégique 30 min offert.",
  keywords: [
    'direction financière externalisée pme',
    'daf externalisé',
    'pilotage financier stratégique',
    'score finsight',
    'audit financier pme',
    'agents ia finance',
    'tableau de bord financier pme',
    'anticipation trésorerie',
    'consulting finance pme',
    'structuration financière',
  ],
  alternates: {
    canonical: 'https://finsight.zineinsight.com',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://finsight.zineinsight.com',
    siteName: 'FinSight',
    title: 'FinSight | Direction Financière Externalisée pour PME',
    description: "Décidez avec 3 mois d'avance. Score FinSight™, audit stratégique et agents IA finance pour dirigeants PME ambitieux.",
    images: [{
      url: 'https://finsight.zineinsight.com/images/og-default.png',
      width: 1200,
      height: 630,
      alt: 'FinSight - DAF Externalisé pour PME 2M€-20M€',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinSight | Direction Financière Externalisée PME',
    description: 'Score FinSight™ + audit stratégique + agents IA. Pilotage financier pour dirigeants PME ambitieux.',
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
