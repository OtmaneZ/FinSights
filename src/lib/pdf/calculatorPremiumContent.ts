import type { CalculatorPDFCalculatorType } from '@/lib/pdf/generateCalculatorPDF'

export type PerformanceTier = 'bon' | 'moyen' | 'critique'

export function derivePerformanceTier(
  calculatorType: CalculatorPDFCalculatorType,
  result: Record<string, unknown>,
): PerformanceTier {
  const n = typeof result.niveau === 'string' ? result.niveau.toLowerCase() : ''
  if (
    n.includes('crit') ||
    n.includes('nég') ||
    n.includes('neg') ||
    n.includes('danger') ||
    n.includes('rouge') ||
    n.includes('faible')
  ) {
    return 'critique'
  }
  if (n.includes('excellent') || n.includes('solide') || n.includes('sain') || n.includes('vert') || n.includes('bon')) {
    return 'bon'
  }
  if (n.includes('surveill') || n.includes('attention') || n.includes('vigil') || n.includes('orange') || n.includes('info')) {
    return 'moyen'
  }

  // Heuristiques si `niveau` absent ou ambigu
  if (calculatorType === 'cac-ltv') {
    const ratio = typeof result.ratio === 'number' ? result.ratio : Number(result.ratio)
    if (!Number.isFinite(ratio)) return 'moyen'
    if (ratio < 1) return 'critique'
    if (ratio > 3) return 'bon'
    return 'moyen'
  }
  if (calculatorType === 'burn-rate') {
    const runway = result.runway === null || result.runway === undefined ? null : Number(result.runway)
    const burn = Number(result.burnNet)
    if (Number.isFinite(burn) && burn <= 0) return 'bon'
    if (runway !== null && Number.isFinite(runway)) {
      if (runway < 4) return 'critique'
      if (runway < 9) return 'moyen'
      return 'bon'
    }
  }
  if (calculatorType === 'roi') {
    const roi = Number(result.roi)
    if (Number.isFinite(roi) && roi < 0) return 'critique'
    if (Number.isFinite(roi) && roi >= 50) return 'bon'
    if (Number.isFinite(roi) && roi >= 20) return 'moyen'
    if (Number.isFinite(roi)) return 'critique'
  }
  if (calculatorType === 'marge') {
    const tm = Number(result.tauxMarge)
    if (Number.isFinite(tm) && tm < 0) return 'critique'
    if (Number.isFinite(tm) && tm >= 50) return 'bon'
    if (Number.isFinite(tm) && tm >= 25) return 'moyen'
    if (Number.isFinite(tm)) return 'critique'
  }

  return 'moyen'
}

export function getPremiumActionPlan(
  calculatorType: CalculatorPDFCalculatorType,
  tier: PerformanceTier,
): string[] {
  const common = {
    bon: [
      'Consolider vos process (relances, pilotage hebdo) pour éviter la dérive.',
      'Documenter vos hypothèses et scénarios « stress » (CA -10%, délais +15j).',
      'Industrialiser un tableau de bord trésorerie / rentabilité partagé avec les opérationnels.',
      'Capitaliser : formaliser 3 leviers qui expliquent votre performance actuelle.',
      'Planifier une revue trimestrielle des prix, mix produit et politique commerciale.',
    ],
    moyen: [
      'Prioriser 2 chantiers à fort impact cash (encaissement, stocks, prix) sur 30 jours.',
      'Mettre en place un suivi hebdo des écarts vs budget (CA, marge, BFR).',
      'Identifier 5 postes de charges à arbitrer (externes, abonnements, sous-traitance).',
      'Renforcer la prévision de trésorerie 13 semaines pour anticiper les tensions.',
      'Aligner équipes commerciales / ops sur un objectif chiffré de réduction de délai ou de marge.',
    ],
    critique: [
      'Stopper les fuites : bloquer les dépenses non critiques et sécuriser la trésorerie sous 7 jours.',
      'Négocier délais fournisseurs / acomptes clients pour gagner du cash immédiat.',
      'Refaire un pricing ciblé sur les lignes à faible marge ou forte complexité.',
      'Mettre en place des relances clients à J+0/J+7/J+15 avec pénalités claires.',
      'Construire un plan de retour à la rentabilité avec jalons à 30 / 60 / 90 jours.',
    ],
  } as const

  const specific: Record<CalculatorPDFCalculatorType, Record<PerformanceTier, string[]>> = {
    dso: {
      bon: [
        'Automatiser le suivi DSO (aging balances) et les alertes clients à risque.',
        'Formaliser une politique d’acomptes / pénalités de retard alignée marché.',
        'Accélérer le recouvrement : mandat SEPA / prélèvement pour abonnements.',
        'Réduire les délais de facturation (facture à J0, relance J+3).',
        'Benchmarker votre DSO par segment client pour cibler les 20% les plus lents.',
      ],
      moyen: [...common.moyen],
      critique: [...common.critique],
    },
    bfr: {
      bon: [
        'Sécuriser le modèle : capitaliser sur le BFR négatif sans fragiliser fournisseurs.',
        'Surveiller les stocks et créances pour éviter une remontée brutale du BFR.',
        'Négocier des conditions fournisseurs stables (échéancier, remises volume).',
        'Anticiper la croissance : modéliser l’impact CA +20% sur stocks et créances.',
        'Mettre un indicateur BFR / CA hebdo dans le pilotage.',
      ],
      moyen: [...common.moyen],
      critique: [...common.critique],
    },
    roi: {
      bon: [
        'Répliquer le playbook sur d’autres projets (standardiser le business case).',
        'Réinvestir une partie du gain sur des actifs à ROI comparable.',
        'Mettre en place un contrôle post-investissement (bénéfices réels vs prévus).',
        'Optimiser le capex : mutualiser outils, mutualiser licences.',
        'Prioriser les projets avec ROI > coût du capital et payback maîtrisé.',
      ],
      moyen: [...common.moyen],
      critique: [...common.critique],
    },
    marge: {
      bon: [
        'Protéger la marge : indexer prix / renégocier achats sur les matières volatiles.',
        'Segmenter la marge par produit pour tuer les « produits toxiques ».',
        'Renforcer la valeur perçue (packaging, service) pour soutenir les prix.',
        'Mettre en place un tableau de bord marge brute par canal.',
        'Tester des hausses ciblées sur le top 10% clients à faible sensibilité prix.',
      ],
      moyen: [...common.moyen],
      critique: [...common.critique],
    },
    'seuil-rentabilite': {
      bon: [
        'Passer du seuil à la croissance : fixer un objectif de marge supplémentaire par trimestre.',
        'Simuler l’impact d’une hausse de prix de 2–3% sur le point mort.',
        'Réduire charges fixes non stratégiques pour abaisser le seuil.',
        'Travailler le mix produit vers les lignes à plus forte marge sur coûts variables.',
        'Mettre le seuil de rentabilité dans le budget mensuel (OKR finance).',
      ],
      moyen: [...common.moyen],
      critique: [...common.critique],
    },
    ebitda: {
      bon: [
        'Structurer un plan de croissance rentable (règle : marge d’abord, volume ensuite).',
        'Investir sur la productivité (outils, automatisation) pour défendre la marge EBITDA.',
        'Mettre en place un reporting EBITDA mensuel par centre de profit.',
        'Comparer EBITDA vs benchmark secteur chaque trimestre.',
        'Préparer une valorisation / levée avec historique d’EBITDA normalisé.',
      ],
      moyen: [...common.moyen],
      critique: [...common.critique],
    },
    'cac-ltv': {
      bon: [
        'Réinvestir sur la rétention (CS, produit) pour prolonger la durée de vie client.',
        'Tester des canaux scalables avec garde-fou LTV/CAC > 3.',
        'Mettre en place cohortes et payback CAC par canal.',
        'Optimiser pricing / upsell pour augmenter LTV sans hausse de CAC.',
        'Documenter les unit economics pour lever / scaler.',
      ],
      moyen: [...common.moyen],
      critique: [...common.critique],
    },
    'burn-rate': {
      bon: [
        'Conserver une discipline de dépenses malgré runway confortable.',
        'Constituer une réserve (6–9 mois) avant accélération commerciale.',
        'Scénariser un plan B si revenus retardent de 2 trimestres.',
        'Tracer burn par poste (R&D, sales, G&A) pour arbitrer.',
        'Aligner recrutements sur jalons de traction chiffrés.',
      ],
      moyen: [...common.moyen],
      critique: [...common.critique],
    },
    valorisation: {
      bon: [
        'Préparer un data room : historique EBITDA, qualité des revenus, concentration clients.',
        'Comparer multiple vs transactions comparables (secteur / taille).',
        'Nettoyer dette / postes exceptionnels pour une valorisation « propre ».',
        'Simuler sensibilité multiple ±1 sur equity value.',
        'Traduire la valorisation en plan de création de valeur sur 12 mois.',
      ],
      moyen: [...common.moyen],
      critique: [...common.critique],
    },
  }

  return specific[calculatorType][tier]
}

export type BenchmarkRow = { label: string; services: string; industrie: string; commerce: string }

export function getBenchmarkTable(calculatorType: CalculatorPDFCalculatorType): BenchmarkRow[] {
  switch (calculatorType) {
    case 'dso':
      return [
        { label: 'DSO médian indicatif (j)', services: '45', industrie: '75', commerce: '55' },
        { label: 'Objectif « sain » (ordre de grandeur)', services: '< 50j', industrie: '< 85j', commerce: '< 60j' },
      ]
    case 'bfr':
      return [
        { label: 'BFR / CA annuel (ordre de grandeur)', services: '15–25%', industrie: '25–40%', commerce: '20–35%' },
        { label: 'Lecture', services: 'Plus bas = mieux', industrie: 'Surveiller stocks', commerce: 'Surveiller stocks' },
      ]
    case 'roi':
      return [
        { label: 'ROI projet « cible » indicatif', services: '> 25%', industrie: '> 20%', commerce: '> 30%' },
        { label: 'Payback max confort', services: '< 18 mois', industrie: '< 24 mois', commerce: '< 12 mois' },
      ]
    case 'marge':
      return [
        { label: 'Taux de marge brute médian', services: '50–70%', industrie: '25–40%', commerce: '30–45%' },
      ]
    case 'seuil-rentabilite':
      return [
        { label: 'Marge sur coûts variables « typique »', services: '45–60%', industrie: '25–40%', commerce: '30–45%' },
      ]
    case 'ebitda':
      return [
        { label: 'Marge EBITDA médiane indicative', services: '18–22%', industrie: '10–14%', commerce: '8–12%' },
      ]
    case 'cac-ltv':
      return [
        { label: 'LTV/CAC médian SaaS/B2B (ordre)', services: '3,0–4,5x', industrie: '2,5–3,5x', commerce: '2,0–3,0x' },
      ]
    case 'burn-rate':
      return [
        { label: 'Runway « confort »', services: '> 9 mois', industrie: '> 9 mois', commerce: '> 9 mois' },
        { label: 'Runway « tension »', services: '< 6 mois', industrie: '< 6 mois', commerce: '< 6 mois' },
      ]
    case 'valorisation':
      return [
        { label: 'Multiple EBITDA courant (fourchette large)', services: '6–10x', industrie: '5–8x', commerce: '4–7x' },
      ]
    default:
      return []
  }
}

export function describeUserVsBenchmark(
  calculatorType: CalculatorPDFCalculatorType,
  result: Record<string, unknown>,
  inputs: Record<string, unknown>,
): string {
  if (calculatorType === 'dso' && typeof result.dso === 'number') {
    const dso = result.dso
    const pos =
      dso <= 45 ? 'proche / favorable vs services (médiane indicative 45j)' : dso <= 60 ? 'zone intermédiaire' : 'au-delà des médianes indicatives - priorité encaissement'
    return `Votre DSO (${dso} j) : ${pos}.`
  }
  if (calculatorType === 'ebitda' && typeof result.margeEbitdaPct === 'number') {
    const m = result.margeEbitdaPct
    const sec = typeof inputs.secteur === 'string' ? inputs.secteur : 'services'
    return `Votre marge EBITDA (${m.toFixed(1)}%) vs grille indicative ${sec} (cf. tableau).`
  }
  if (calculatorType === 'cac-ltv' && typeof result.ratio === 'number') {
    return `Votre LTV/CAC (${result.ratio.toFixed(2)}x) : ${result.ratio >= 3 ? 'au-dessus du réflexe « sain »' : result.ratio >= 1 ? 'zone d’optimisation' : 'sous le seuil de rentabilité acquisition'}.`
  }
  if (calculatorType === 'burn-rate') {
    const runway = result.runway === null || result.runway === undefined ? null : Number(result.runway)
    if (runway === null) return 'Burn net ≤ 0 : priorité croissance maîtrisée plutôt que runway.'
    return `Votre runway (${runway} mois) positionné vs repères « confort » (>9 mois) et « tension » (<6 mois).`
  }
  const first = Array.isArray(result.summary) ? (result.summary as { label: string; value: string }[])[0] : null
  if (first) return `Indicateur principal : ${first.label} = ${first.value} (comparer aux médianes du tableau).`
  return 'Position indicative : comparez vos chiffres saisis aux ordres de grandeur sectoriels ci-dessous.'
}
