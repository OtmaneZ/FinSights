/**
 * FinSight AI Assistant — Benchmarks Database
 *
 * Référentiel sectoriel français (Banque de France, moyennes sectorielles 2025).
 * Chaque métrique possède des seuils P25/P50/P75 par secteur.
 *
 * Architecture: données statiques pré-calculées, aucun appel externe.
 * Le LLM ne calcule RIEN — il reçoit le diagnostic déjà qualifié.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Sector =
  | 'services'
  | 'commerce'
  | 'industrie'
  | 'saas'
  | 'construction'
  | 'restauration'
  | 'general'

export interface SectorThresholds {
  excellent: number  // P25 — top quartile
  median: number     // P50 — médiane sectorielle
  warning: number    // P75 — seuil de vigilance
  critical: number   // Au-delà : zone critique
  unit: string
  direction: 'lower-is-better' | 'higher-is-better'
}

export interface BenchmarkMetric {
  key: string
  label: string
  description: string
  sectors: Partial<Record<Sector, SectorThresholds>>
}

// ---------------------------------------------------------------------------
// DSO — Days Sales Outstanding (jours)
// Source : Banque de France / Altares, Étude comportement de paiement 2024-2025
// ---------------------------------------------------------------------------

const DSO_BENCHMARKS: BenchmarkMetric = {
  key: 'dso',
  label: 'DSO',
  description: 'Délai moyen de paiement clients (jours)',
  sectors: {
    services: {
      excellent: 30,
      median: 45,
      warning: 60,
      critical: 80,
      unit: 'jours',
      direction: 'lower-is-better',
    },
    commerce: {
      excellent: 15,
      median: 30,
      warning: 45,
      critical: 60,
      unit: 'jours',
      direction: 'lower-is-better',
    },
    industrie: {
      excellent: 45,
      median: 60,
      warning: 75,
      critical: 100,
      unit: 'jours',
      direction: 'lower-is-better',
    },
    saas: {
      excellent: 10,
      median: 25,
      warning: 40,
      critical: 60,
      unit: 'jours',
      direction: 'lower-is-better',
    },
    construction: {
      excellent: 50,
      median: 70,
      warning: 90,
      critical: 120,
      unit: 'jours',
      direction: 'lower-is-better',
    },
    restauration: {
      excellent: 5,
      median: 10,
      warning: 20,
      critical: 30,
      unit: 'jours',
      direction: 'lower-is-better',
    },
    general: {
      excellent: 30,
      median: 45,
      warning: 60,
      critical: 90,
      unit: 'jours',
      direction: 'lower-is-better',
    },
  },
}

// ---------------------------------------------------------------------------
// BFR — Besoin en Fonds de Roulement (jours de CA)
// Source : Banque de France, moyennes sectorielles 2025
// ---------------------------------------------------------------------------

const BFR_BENCHMARKS: BenchmarkMetric = {
  key: 'bfr_jours',
  label: 'BFR en jours de CA',
  description: 'Besoin en Fonds de Roulement rapporté au chiffre d\'affaires',
  sectors: {
    services: {
      excellent: 15,
      median: 30,
      warning: 60,
      critical: 90,
      unit: 'jours CA',
      direction: 'lower-is-better',
    },
    commerce: {
      excellent: 20,
      median: 45,
      warning: 90,
      critical: 120,
      unit: 'jours CA',
      direction: 'lower-is-better',
    },
    industrie: {
      excellent: 30,
      median: 60,
      warning: 120,
      critical: 150,
      unit: 'jours CA',
      direction: 'lower-is-better',
    },
    saas: {
      excellent: -30, // BFR négatif = excellent en SaaS
      median: 0,
      warning: 30,
      critical: 60,
      unit: 'jours CA',
      direction: 'lower-is-better',
    },
    construction: {
      excellent: 20,
      median: 50,
      warning: 90,
      critical: 130,
      unit: 'jours CA',
      direction: 'lower-is-better',
    },
    restauration: {
      excellent: -10,
      median: 5,
      warning: 20,
      critical: 40,
      unit: 'jours CA',
      direction: 'lower-is-better',
    },
    general: {
      excellent: 15,
      median: 35,
      warning: 70,
      critical: 100,
      unit: 'jours CA',
      direction: 'lower-is-better',
    },
  },
}

// ---------------------------------------------------------------------------
// Marge Nette (%)
// Source : INSEE / Banque de France, comptes d'entreprises 2024
// ---------------------------------------------------------------------------

const MARGE_BENCHMARKS: BenchmarkMetric = {
  key: 'marge',
  label: 'Marge nette',
  description: 'Taux de marge nette après charges',
  sectors: {
    services: {
      excellent: 15,
      median: 8,
      warning: 3,
      critical: 0,
      unit: '%',
      direction: 'higher-is-better',
    },
    commerce: {
      excellent: 8,
      median: 4,
      warning: 2,
      critical: 0,
      unit: '%',
      direction: 'higher-is-better',
    },
    industrie: {
      excellent: 12,
      median: 6,
      warning: 2,
      critical: 0,
      unit: '%',
      direction: 'higher-is-better',
    },
    saas: {
      excellent: 25,
      median: 15,
      warning: 5,
      critical: -5,
      unit: '%',
      direction: 'higher-is-better',
    },
    construction: {
      excellent: 8,
      median: 4,
      warning: 1,
      critical: -2,
      unit: '%',
      direction: 'higher-is-better',
    },
    restauration: {
      excellent: 10,
      median: 5,
      warning: 2,
      critical: 0,
      unit: '%',
      direction: 'higher-is-better',
    },
    general: {
      excellent: 12,
      median: 6,
      warning: 2,
      critical: 0,
      unit: '%',
      direction: 'higher-is-better',
    },
  },
}

// ---------------------------------------------------------------------------
// ROI — Retour sur Investissement (%)
// ---------------------------------------------------------------------------

const ROI_BENCHMARKS: BenchmarkMetric = {
  key: 'roi',
  label: 'ROI',
  description: 'Retour sur investissement annualisé',
  sectors: {
    general: {
      excellent: 50,
      median: 20,
      warning: 5,
      critical: 0,
      unit: '%',
      direction: 'higher-is-better',
    },
    saas: {
      excellent: 100,
      median: 40,
      warning: 10,
      critical: 0,
      unit: '%',
      direction: 'higher-is-better',
    },
    services: {
      excellent: 40,
      median: 20,
      warning: 5,
      critical: 0,
      unit: '%',
      direction: 'higher-is-better',
    },
    commerce: {
      excellent: 30,
      median: 15,
      warning: 5,
      critical: 0,
      unit: '%',
      direction: 'higher-is-better',
    },
    industrie: {
      excellent: 25,
      median: 12,
      warning: 3,
      critical: 0,
      unit: '%',
      direction: 'higher-is-better',
    },
  },
}

// ---------------------------------------------------------------------------
// CAC/LTV Ratio
// ---------------------------------------------------------------------------

const CAC_LTV_BENCHMARKS: BenchmarkMetric = {
  key: 'cac-ltv',
  label: 'Ratio LTV/CAC',
  description: 'Lifetime Value divisée par le Coût d\'Acquisition Client',
  sectors: {
    saas: {
      excellent: 5,
      median: 3,
      warning: 1.5,
      critical: 1,
      unit: 'x',
      direction: 'higher-is-better',
    },
    services: {
      excellent: 4,
      median: 2.5,
      warning: 1.5,
      critical: 1,
      unit: 'x',
      direction: 'higher-is-better',
    },
    commerce: {
      excellent: 3.5,
      median: 2,
      warning: 1.2,
      critical: 0.8,
      unit: 'x',
      direction: 'higher-is-better',
    },
    general: {
      excellent: 4,
      median: 2.5,
      warning: 1.5,
      critical: 1,
      unit: 'x',
      direction: 'higher-is-better',
    },
  },
}

// ---------------------------------------------------------------------------
// Burn Rate — Runway (mois)
// ---------------------------------------------------------------------------

const BURN_RATE_BENCHMARKS: BenchmarkMetric = {
  key: 'burn-rate',
  label: 'Burn Rate / Runway',
  description: 'Nombre de mois de trésorerie restants au rythme actuel',
  sectors: {
    saas: {
      excellent: 24,
      median: 12,
      warning: 6,
      critical: 3,
      unit: 'mois runway',
      direction: 'higher-is-better',
    },
    general: {
      excellent: 18,
      median: 9,
      warning: 4,
      critical: 2,
      unit: 'mois runway',
      direction: 'higher-is-better',
    },
  },
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const BENCHMARKS: Record<string, BenchmarkMetric> = {
  dso: DSO_BENCHMARKS,
  bfr_jours: BFR_BENCHMARKS,
  marge: MARGE_BENCHMARKS,
  roi: ROI_BENCHMARKS,
  'cac-ltv': CAC_LTV_BENCHMARKS,
  'burn-rate': BURN_RATE_BENCHMARKS,
}

// ---------------------------------------------------------------------------
// Benchmark Evaluation
// ---------------------------------------------------------------------------

export type BenchmarkLevel = 'excellent' | 'bon' | 'median' | 'vigilance' | 'critique'

export interface BenchmarkResult {
  metric: string
  value: number
  sector: Sector
  level: BenchmarkLevel
  percentile: string         // "P25", "P50", "P75", "P90+"
  vsMedian: number           // écart vs médiane en % (+12%, -30%…)
  vsMedianLabel: string      // "12% au-dessus de la médiane" | "30% en-dessous"
  thresholds: SectorThresholds
  interpretation: string     // phrase concise pré-calculée
}

/**
 * Évalue une valeur par rapport aux benchmarks sectoriels.
 * Retourne un diagnostic complet et pré-qualifié.
 */
export function evaluateAgainstBenchmark(
  metricKey: string,
  value: number,
  sector: Sector = 'general'
): BenchmarkResult | null {
  const metric = BENCHMARKS[metricKey]
  if (!metric) return null

  const thresholds = metric.sectors[sector] || metric.sectors.general
  if (!thresholds) return null

  const { excellent, median, warning, critical, direction } = thresholds

  // Determine level
  let level: BenchmarkLevel
  let percentile: string

  if (direction === 'lower-is-better') {
    if (value <= excellent) { level = 'excellent'; percentile = 'P25' }
    else if (value <= median) { level = 'bon'; percentile = 'P25-P50' }
    else if (value <= warning) { level = 'median'; percentile = 'P50-P75' }
    else if (value <= critical) { level = 'vigilance'; percentile = 'P75+' }
    else { level = 'critique'; percentile = 'P90+' }
  } else {
    if (value >= excellent) { level = 'excellent'; percentile = 'P25' }
    else if (value >= median) { level = 'bon'; percentile = 'P25-P50' }
    else if (value >= warning) { level = 'median'; percentile = 'P50-P75' }
    else if (value >= critical) { level = 'vigilance'; percentile = 'P75+' }
    else { level = 'critique'; percentile = 'P90+' }
  }

  // Compute vs median
  let vsMedian: number
  if (median === 0) {
    vsMedian = value > 0 ? 100 : value < 0 ? -100 : 0
  } else {
    vsMedian = Math.round(((value - median) / Math.abs(median)) * 100)
  }

  // For lower-is-better metrics, invert the sign for the label
  const isAboveMedian = direction === 'lower-is-better' ? value < median : value > median
  const isBelowMedian = direction === 'lower-is-better' ? value > median : value < median
  const absGap = Math.abs(vsMedian)

  let vsMedianLabel: string
  if (absGap <= 5) {
    vsMedianLabel = 'au niveau de la médiane sectorielle'
  } else if (isAboveMedian) {
    vsMedianLabel = `${absGap}% ${direction === 'lower-is-better' ? 'en-dessous' : 'au-dessus'} de la médiane sectorielle`
  } else if (isBelowMedian) {
    vsMedianLabel = `${absGap}% ${direction === 'lower-is-better' ? 'au-dessus' : 'en-dessous'} de la médiane sectorielle`
  } else {
    vsMedianLabel = 'au niveau de la médiane sectorielle'
  }

  // Pre-computed interpretation
  const interpretation = buildInterpretation(metric.label, value, thresholds, level, sector)

  return {
    metric: metricKey,
    value,
    sector,
    level,
    percentile,
    vsMedian,
    vsMedianLabel,
    thresholds,
    interpretation,
  }
}

// ---------------------------------------------------------------------------
// Interpretation builder (pre-computed, NOT generated by LLM)
// ---------------------------------------------------------------------------

function buildInterpretation(
  label: string,
  value: number,
  thresholds: SectorThresholds,
  level: BenchmarkLevel,
  sector: Sector
): string {
  const sectorLabel = SECTOR_LABELS[sector] || sector

  switch (level) {
    case 'excellent':
      return `${label} de ${value}${thresholds.unit === '%' ? '%' : ' ' + thresholds.unit} — performance top quartile (${sectorLabel}). Position concurrentielle forte.`
    case 'bon':
      return `${label} de ${value}${thresholds.unit === '%' ? '%' : ' ' + thresholds.unit} — supérieur à la médiane (${sectorLabel}). Bonne maîtrise.`
    case 'median':
      return `${label} de ${value}${thresholds.unit === '%' ? '%' : ' ' + thresholds.unit} — dans la moyenne sectorielle (${sectorLabel}). Des marges d'optimisation existent.`
    case 'vigilance':
      return `${label} de ${value}${thresholds.unit === '%' ? '%' : ' ' + thresholds.unit} — en-dessous de la moyenne sectorielle (${sectorLabel}). Analyse approfondie recommandée.`
    case 'critique':
      return `${label} de ${value}${thresholds.unit === '%' ? '%' : ' ' + thresholds.unit} — zone critique (${sectorLabel}). Action corrective prioritaire.`
  }
}

// ---------------------------------------------------------------------------
// Sector labels
// ---------------------------------------------------------------------------

export const SECTOR_LABELS: Record<Sector, string> = {
  services: 'Services B2B',
  commerce: 'Commerce / Distribution',
  industrie: 'Industrie',
  saas: 'SaaS / Tech',
  construction: 'BTP / Construction',
  restauration: 'Restauration / CHR',
  general: 'Tous secteurs',
}

/**
 * Normalise un secteur saisi par l'utilisateur vers notre enum Sector.
 */
export function normalizeSector(input?: string): Sector {
  if (!input) return 'general'
  const lower = input.toLowerCase().trim()

  if (lower.includes('saas') || lower.includes('tech') || lower.includes('logiciel')) return 'saas'
  if (lower.includes('service')) return 'services'
  if (lower.includes('commerce') || lower.includes('retail') || lower.includes('distribution')) return 'commerce'
  if (lower.includes('industri') || lower.includes('manufactur')) return 'industrie'
  if (lower.includes('construct') || lower.includes('btp') || lower.includes('batiment')) return 'construction'
  if (lower.includes('restaurant') || lower.includes('hotel') || lower.includes('chr')) return 'restauration'

  return 'general'
}
