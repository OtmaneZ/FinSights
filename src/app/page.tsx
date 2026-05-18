import { type Metadata } from 'next'
import HomeClient from './HomeClient'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quels services propose FinSight pour les PME ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "FinSight propose des outils self-serve gratuits (calculateurs, Score FinSight™ à 49€) et des missions expert BI Finance : audit Power BI (2 490€ HT), modélisation sur devis, missions longues en régie via Malt.",
      },
    },
    {
      '@type': 'Question',
      name: "Qu'est-ce que le Score FinSight™ ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Le Score FinSight™ est un indicateur de santé financière noté sur 100. Il analyse 4 piliers : Cash, Marges, Résilience et Risques, avec rapport PDF et recommandations IA.",
      },
    },
    {
      '@type': 'Question',
      name: 'Comment démarrer un audit Power BI ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Un échange de 15 minutes permet de cadrer votre modèle .pbix. L'audit forfaitaire (2 490€ HT) livre un rapport technique complet et une restitution d'1 heure en 5 jours ouvrés.",
      },
    },
  ],
}

const aggregateRatingSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'FinSight - Pilotage Financier par la Data',
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
  title: 'FinSight | Audit Power BI & Modélisation Data Finance pour PME',
  description: 'Audit Power BI, modélisation de données et automatisation pour PME et ETI. Consultant BI Finance · FinSight™ outils gratuits.',
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
    title: 'FinSight | Audit Power BI & Modélisation Data Finance',
    description: 'Audit Power BI, modélisation de données et automatisation pour PME et ETI. Consultant BI Finance · FinSight™ outils gratuits.',
    images: [{
      url: 'https://finsight.zineinsight.com/images/og-default.png',
      width: 1200,
      height: 630,
      alt: 'FinSight - Audit Power BI & Modélisation Data Finance',
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
