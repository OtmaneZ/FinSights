export interface CalculatorRef {
    slug: string
    label: string
    description: string
}

export const ARTICLE_CALCULATOR_MAP: Record<string, CalculatorRef> = {
    // DSO
    'calcul-dso-formule-2025': {
        slug: 'dso',
        label: 'Calculateur DSO',
        description: 'Votre DSO est-il au-dessus de la médiane sectorielle ? Calculez-le en 2 minutes.',
    },
    'dso-superieur-mediane-sectorielle': {
        slug: 'dso',
        label: 'Calculateur DSO',
        description: 'Calculez votre DSO réel et comparez-le aux benchmarks sectoriels.',
    },
    'reduire-dso-50-pourcent-90-jours': {
        slug: 'dso',
        label: 'Calculateur DSO',
        description: 'Mesurez votre DSO actuel avant de le réduire.',
    },
    'dso-vs-dpo-optimiser-tresorerie': {
        slug: 'dso',
        label: 'Calculateur DSO',
        description: 'Calculez votre DSO et DPO pour optimiser votre cycle de trésorerie.',
    },
    // BFR
    'bfr-formule-calcul-optimisation-2025': {
        slug: 'bfr',
        label: 'Calculateur BFR',
        description: 'Calculez votre BFR en 2 minutes avec benchmarks sectoriels.',
    },
    'calculer-bfr-excel-template-gratuit-2026': {
        slug: 'bfr',
        label: 'Calculateur BFR',
        description: 'Calculez votre BFR instantanément - résultat et interprétation immédiats.',
    },
    'bfr-negatif-bon-ou-mauvais': {
        slug: 'bfr',
        label: 'Calculateur BFR',
        description: "Calculez votre BFR et découvrez s'il est négatif ou positif.",
    },
    'bfr-structurellement-eleve': {
        slug: 'bfr',
        label: 'Calculateur BFR',
        description: "Mesurez votre BFR structurel et identifiez les leviers d'optimisation.",
    },
    // MARGE
    'marge-nette-vs-marge-brute': {
        slug: 'marge',
        label: 'Calculateur Marge',
        description: 'Calculez vos taux de marge brute et nette en 2 minutes.',
    },
    'marge-nette-vs-marge-brute-differences-calculs': {
        slug: 'marge',
        label: 'Calculateur Marge',
        description: 'Calculez vos taux de marge brute et nette en 2 minutes.',
    },
    'marge-correcte-cash-fragile': {
        slug: 'marge',
        label: 'Calculateur Marge',
        description: 'Vérifiez si votre marge est réellement saine.',
    },
    // TRÉSORERIE / CASH FLOW
    'cash-flow-previsionnel-methode-pratique-pme': {
        slug: 'burn-rate',
        label: 'Calculateur Burn Rate',
        description: 'Calculez votre consommation de cash et votre runway.',
    },
    'pilotage-tresorerie-90-jours': {
        slug: 'bfr',
        label: 'Calculateur BFR',
        description: 'Commencez par mesurer votre BFR avant de piloter à 90 jours.',
    },
    'tresorerie-pme-5-erreurs-eviter': {
        slug: 'burn-rate',
        label: 'Calculateur Burn Rate',
        description: 'Calculez votre runway actuel en 2 minutes.',
    },
    '5-erreurs-tresorerie-pme': {
        slug: 'burn-rate',
        label: 'Calculateur Burn Rate',
        description: 'Calculez votre consommation de cash hebdomadaire.',
    },
    'pme-libere-240k-cash-4-mois': {
        slug: 'bfr',
        label: 'Calculateur BFR',
        description: 'Calculez votre BFR et identifiez le cash immobilisé.',
    },
    'pourquoi-70-pme-sous-estiment-fragilite-cash': {
        slug: 'burn-rate',
        label: 'Calculateur Burn Rate',
        description: "Calculez votre runway - combien de mois de trésorerie avez-vous ?",
    },
    // KPIs / GESTION
    '5-kpis-financiers-essentiels-pme': {
        slug: 'ebitda',
        label: 'Calculateur EBITDA',
        description: "Calculez votre EBITDA - l'indicateur de référence pour les dirigeants PME.",
    },
    'lire-bilan-compte-resultat-guide-pratique': {
        slug: 'marge',
        label: 'Calculateur Marge',
        description: "Passez de la lecture à l'action : calculez vos taux de marge.",
    },
    'pourquoi-entreprise-rentable-detruit-valeur': {
        slug: 'valorisation',
        label: 'Calculateur Valorisation',
        description: 'Estimez la valeur réelle de votre entreprise.',
    },
    // RECOUVREMENT
    'creances-clients-reduire-impayes': {
        slug: 'dso',
        label: 'Calculateur DSO',
        description: "Mesurez l'impact des impayés sur votre DSO.",
    },
    'comment-reduire-dso-62-41-jours': {
        slug: 'dso',
        label: 'Calculateur DSO',
        description: 'Calculez votre DSO actuel - point de départ de toute optimisation.',
    },
    // CAC/LTV
    'top-7-kpis-financiers-startups-saas': {
        slug: 'cac-ltv',
        label: 'Calculateur CAC & LTV',
        description: 'Calculez votre CAC, LTV et ratio LTV/CAC en 2 minutes.',
    },
    // ROI
    'arbitrage-projets-roi-priorites': {
        slug: 'roi',
        label: 'Calculateur ROI',
        description: 'Calculez le ROI de vos projets avant de les prioriser.',
    },
    // DAF
    'daf-externalise-pme-prix-tarifs-roi-2026': {
        slug: 'ebitda',
        label: 'Calculateur EBITDA',
        description: "Calculez votre EBITDA - le premier indicateur qu'analyse un DAF.",
    },
    'fractional-cfo-france-guide-complet-2026': {
        slug: 'ebitda',
        label: 'Calculateur EBITDA',
        description: 'Calculez votre EBITDA avant votre premier RDV avec un DAF.',
    },
    // SEUIL
    'reduire-seuil-rentabilite-pme': {
        slug: 'seuil-rentabilite',
        label: 'Calculateur Seuil de Rentabilité',
        description: 'Calculez votre point mort en 2 minutes.',
    },
}
