import { type Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'FinSight | Direction Financière Externalisée pour Dirigeants PME (1-100M€)',
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
      alt: 'FinSight - DAF Externalisé pour PME 1-100M€',
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
  return <HomeClient />
}
