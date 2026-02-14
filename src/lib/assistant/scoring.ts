/**
 * FinSight AI Assistant — Scoring & Enrichment Engine
 *
 * Pipeline Architecture:
 *   1. Raw user data (calculator history) → Scoring
 *   2. Scoring → Benchmark comparison (per-metric)
 *   3. Benchmark results → Alerts + Impact calculations
 *   4. Alerts → Pre-computed recommendations
 *   5. All of the above → Enriched context injected into GPT prompt
 *
 * Le LLM ne calcule RIEN. Il traduit en langage naturel un diagnostic
 * déjà qualifié, chiffré et benchmarké.
 */

import type { Calculation, CalculatorType } from '@/hooks/useCalculatorHistory'
import {
  evaluateAgainstBenchmark,
  normalizeSector,
  type BenchmarkResult,
  type Sector,
} from './benchmarks'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PillarKey = 'cash' | 'margin' | 'resilience' | 'risk'

export interface PillarScore {
  key: PillarKey
  label: string
  score: number | null     // 0-25, null = pas de données
  max: 25
  level: 'excellent' | 'bon' | 'median' | 'vigilance' | 'critique' | 'incomplet'
  calculators: { type: CalculatorType; done: boolean }[]
}

export interface DiagnosticScore {
  total: number | null     // 0-100
  pillars: Record<PillarKey, PillarScore>
  level: 'excellent' | 'bon' | 'vigilance' | 'action' | 'incomplet'
  confidence: 'haute' | 'moyenne' | 'faible'
  completedPillars: number
}

export interface Alert {
  severity: 'critique' | 'warning' | 'info'
  pillar: PillarKey
  metric: string
  title: string
  description: string
  impact?: string           // chiffrage de l'impact estimé
  action: string            // recommandation concrète
  calculatorLink?: string   // lien vers le calculateur pertinent
  articleSlugs?: string[]   // articles blog pertinents (pour RAG-lite)
}

export interface EnrichedContext {
  diagnostic: DiagnosticScore
  benchmarks: BenchmarkResult[]
  alerts: Alert[]
  sector: Sector
  summary: string           // résumé structuré pour le system prompt
  missingAnalyses: CalculatorType[]
  completedCount: number
  totalCount: number
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PILLAR_CALCULATORS: Record<PillarKey, CalculatorType[]> = {
  cash: ['dso', 'bfr', 'burn-rate'],
  margin: ['marge', 'roi', 'seuil-rentabilite', 'ebitda'],
  resilience: ['cac-ltv', 'valorisation'],
  risk: ['dso', 'marge', 'seuil-rentabilite'],
}

const ALL_CALCULATORS: CalculatorType[] = [
  'dso', 'bfr', 'roi', 'marge', 'seuil-rentabilite',
  'ebitda', 'cac-ltv', 'burn-rate', 'valorisation',
]

// ---------------------------------------------------------------------------
// Core Scoring — extracted & enhanced from mon-diagnostic/page.tsx
// ---------------------------------------------------------------------------

export function computeDiagnosticScore(history: Calculation[]): DiagnosticScore {
  const get = (t: CalculatorType) => history.find((c) => c.type === t)

  // --- Pilier CASH (25 pts) ---
  const dso = get('dso')
  const bfr = get('bfr')
  const burnRate = get('burn-rate')
  const cashHasData = dso || bfr || burnRate

  let cashScore: number | null = null
  let cashLevel: PillarScore['level'] = 'incomplet'

  if (cashHasData) {
    let pts = 0
    let maxPossible = 0

    if (dso) {
      maxPossible += 10
      if (dso.value <= 30) pts += 10
      else if (dso.value <= 45) pts += 7
      else if (dso.value <= 60) pts += 4
      else pts += 1
    }

    if (bfr) {
      maxPossible += 10
      if (bfr.value < 0) {
        pts += 10
      } else if (bfr.inputs?.ca && bfr.inputs.ca > 0) {
        const joursCA = Math.round((bfr.value / bfr.inputs.ca) * 365)
        if (joursCA < 15) pts += 10
        else if (joursCA < 30) pts += 7
        else if (joursCA < 45) pts += 4
        else pts += 1
      } else {
        pts += 3
      }
    }

    if (burnRate) {
      maxPossible += 5
      if (burnRate.value < 5000) pts += 5
      else if (burnRate.value < 15000) pts += 3
      else if (burnRate.value < 50000) pts += 1
    }

    cashScore = maxPossible > 0 ? Math.round((pts / maxPossible) * 25) : null
    if (cashScore !== null) {
      cashLevel = cashScore >= 20 ? 'excellent' : cashScore >= 15 ? 'bon' : cashScore >= 10 ? 'median' : cashScore >= 5 ? 'vigilance' : 'critique'
    }
  }

  // --- Pilier MARGIN (25 pts) ---
  const marge = get('marge')
  const roi = get('roi')
  const seuil = get('seuil-rentabilite')
  const ebitda = get('ebitda')
  const marginHasData = marge || roi || seuil || ebitda

  let marginScore: number | null = null
  let marginLevel: PillarScore['level'] = 'incomplet'

  if (marginHasData) {
    let pts = 0
    let maxPossible = 0

    if (marge) {
      maxPossible += 8
      if (marge.value >= 60) pts += 8
      else if (marge.value >= 40) pts += 6
      else if (marge.value >= 25) pts += 4
      else if (marge.value >= 10) pts += 2
      else pts += 1
    }

    if (roi) {
      maxPossible += 7
      if (roi.value >= 100) pts += 7
      else if (roi.value >= 50) pts += 5
      else if (roi.value >= 20) pts += 3
      else if (roi.value >= 0) pts += 1
    }

    if (seuil) {
      maxPossible += 6
      const tauxMarge = seuil.inputs?.tauxMarge
      if (tauxMarge && tauxMarge >= 60) pts += 6
      else if (tauxMarge && tauxMarge >= 40) pts += 4
      else if (tauxMarge && tauxMarge >= 25) pts += 2
      else pts += 1
    }

    if (ebitda) {
      maxPossible += 4
      if (ebitda.value > 0) pts += 4
      else pts += 1
    }

    marginScore = maxPossible > 0 ? Math.round((pts / maxPossible) * 25) : null
    if (marginScore !== null) {
      marginLevel = marginScore >= 20 ? 'excellent' : marginScore >= 15 ? 'bon' : marginScore >= 10 ? 'median' : marginScore >= 5 ? 'vigilance' : 'critique'
    }
  }

  // --- Pilier RESILIENCE (25 pts) ---
  const cacLtv = get('cac-ltv')
  const valorisation = get('valorisation')
  const resilienceHasData = cacLtv || valorisation

  let resilienceScore: number | null = null
  let resilienceLevel: PillarScore['level'] = 'incomplet'

  if (resilienceHasData) {
    let pts = 0
    let maxPossible = 0

    if (cacLtv) {
      maxPossible += 15
      if (cacLtv.value >= 3) pts += 15
      else if (cacLtv.value >= 2) pts += 10
      else if (cacLtv.value >= 1) pts += 5
      else pts += 1
    }

    if (valorisation) {
      maxPossible += 10
      if (valorisation.value > 0) pts += 10
      else pts += 2
    }

    resilienceScore = maxPossible > 0 ? Math.round((pts / maxPossible) * 25) : null
    if (resilienceScore !== null) {
      resilienceLevel = resilienceScore >= 20 ? 'excellent' : resilienceScore >= 15 ? 'bon' : resilienceScore >= 10 ? 'median' : resilienceScore >= 5 ? 'vigilance' : 'critique'
    }
  }

  // --- Pilier RISK (25 pts) — cross-analysis ---
  const riskHasData = (dso || bfr) && (marge || seuil)

  let riskScore: number | null = null
  let riskLevel: PillarScore['level'] = 'incomplet'

  if (riskHasData) {
    let pts = 25

    if (dso && dso.value > 60) pts -= 5
    else if (dso && dso.value > 45) pts -= 2

    if (bfr && bfr.inputs?.ca && bfr.inputs.ca > 0) {
      const joursCA = Math.round((bfr.value / bfr.inputs.ca) * 365)
      if (joursCA > 60) pts -= 6
      else if (joursCA > 45) pts -= 3
    }

    if (marge && marge.value < 15) pts -= 5
    else if (marge && marge.value < 25) pts -= 2

    if (seuil) {
      const tm = seuil.inputs?.tauxMarge
      if (tm && tm < 20) pts -= 6
      else if (tm && tm < 30) pts -= 3
    }

    if (dso && dso.value > 45 && marge && marge.value < 25) pts -= 3

    riskScore = Math.max(0, Math.min(25, pts))
    riskLevel = riskScore >= 20 ? 'excellent' : riskScore >= 15 ? 'bon' : riskScore >= 10 ? 'median' : riskScore >= 5 ? 'vigilance' : 'critique'
  }

  // --- Assemblage ---
  const pillars: Record<PillarKey, PillarScore> = {
    cash: {
      key: 'cash',
      label: 'CASH — Trésorerie et Liquidité',
      score: cashScore,
      max: 25,
      level: cashLevel,
      calculators: PILLAR_CALCULATORS.cash.map((t) => ({ type: t, done: !!get(t) })),
    },
    margin: {
      key: 'margin',
      label: 'MARGIN — Rentabilité et Croissance',
      score: marginScore,
      max: 25,
      level: marginLevel,
      calculators: PILLAR_CALCULATORS.margin.map((t) => ({ type: t, done: !!get(t) })),
    },
    resilience: {
      key: 'resilience',
      label: 'RESILIENCE — Stabilité et Diversification',
      score: resilienceScore,
      max: 25,
      level: resilienceLevel,
      calculators: PILLAR_CALCULATORS.resilience.map((t) => ({ type: t, done: !!get(t) })),
    },
    risk: {
      key: 'risk',
      label: 'RISK — Anomalies et Volatilité',
      score: riskScore,
      max: 25,
      level: riskLevel,
      calculators: PILLAR_CALCULATORS.risk.map((t) => ({ type: t, done: !!get(t) })),
    },
  }

  const scored = Object.values(pillars).filter((p) => p.score !== null)
  const completedPillars = scored.length

  let total: number | null = null
  if (completedPillars > 0) {
    const sum = scored.reduce((acc, p) => acc + (p.score ?? 0), 0)
    total = completedPillars === 4 ? sum : Math.round((sum / completedPillars) * 4)
  }

  let level: DiagnosticScore['level'] = 'incomplet'
  if (total !== null) {
    if (total >= 75) level = 'excellent'
    else if (total >= 55) level = 'bon'
    else if (total >= 35) level = 'vigilance'
    else level = 'action'
  }

  const confidence: DiagnosticScore['confidence'] =
    completedPillars >= 4 ? 'haute' : completedPillars >= 2 ? 'moyenne' : 'faible'

  return { total, pillars, level, confidence, completedPillars }
}

// ---------------------------------------------------------------------------
// Benchmark Evaluation — run all available metrics
// ---------------------------------------------------------------------------

function evaluateAllBenchmarks(
  history: Calculation[],
  sector: Sector
): BenchmarkResult[] {
  const results: BenchmarkResult[] = []
  const get = (t: CalculatorType) => history.find((c) => c.type === t)

  // DSO
  const dso = get('dso')
  if (dso) {
    const r = evaluateAgainstBenchmark('dso', dso.value, sector)
    if (r) results.push(r)
  }

  // BFR en jours de CA
  const bfr = get('bfr')
  if (bfr && bfr.inputs?.ca && bfr.inputs.ca > 0) {
    const joursCA = Math.round((bfr.value / bfr.inputs.ca) * 365)
    const r = evaluateAgainstBenchmark('bfr_jours', joursCA, sector)
    if (r) results.push(r)
  }

  // Marge
  const marge = get('marge')
  if (marge) {
    const r = evaluateAgainstBenchmark('marge', marge.value, sector)
    if (r) results.push(r)
  }

  // ROI
  const roi = get('roi')
  if (roi) {
    const r = evaluateAgainstBenchmark('roi', roi.value, sector)
    if (r) results.push(r)
  }

  // CAC/LTV
  const cacLtv = get('cac-ltv')
  if (cacLtv) {
    const r = evaluateAgainstBenchmark('cac-ltv', cacLtv.value, sector)
    if (r) results.push(r)
  }

  return results
}

// ---------------------------------------------------------------------------
// Alert Generation — pre-computed, context-aware
// ---------------------------------------------------------------------------

function generateAlerts(
  history: Calculation[],
  benchmarks: BenchmarkResult[],
  diagnostic: DiagnosticScore
): Alert[] {
  const alerts: Alert[] = []
  const get = (t: CalculatorType) => history.find((c) => c.type === t)

  // --- Critiques : risques immédiats ---
  const dso = get('dso')
  const bfr = get('bfr')
  const marge = get('marge')

  // DSO critique
  if (dso && dso.value > 60) {
    const cashImpact = bfr && bfr.inputs?.ca
      ? Math.round((bfr.inputs.ca / 365) * (dso.value - 45))
      : undefined

    alerts.push({
      severity: 'critique',
      pillar: 'cash',
      metric: 'DSO',
      title: 'Délai de paiement clients excessif',
      description: `DSO de ${dso.value} jours — chaque jour de retard immobilise du cash inutilement.`,
      impact: cashImpact
        ? `Environ ${cashImpact.toLocaleString('fr-FR')} € immobilisés par le dépassement vs la cible de 45 jours.`
        : undefined,
      action: 'Mettre en place des relances automatiques à J+30, négocier des acomptes, et envisager l\'affacturage pour les plus gros encours.',
      calculatorLink: '/calculateurs/dso',
      articleSlugs: ['reduire-dso-50-pourcent-90-jours', 'creances-clients-reduire-impayes', 'calcul-dso-formule-2025'],
    })
  }

  // BFR critique
  if (bfr && bfr.inputs?.ca && bfr.inputs.ca > 0) {
    const joursCA = Math.round((bfr.value / bfr.inputs.ca) * 365)
    if (joursCA > 60) {
      alerts.push({
        severity: 'critique',
        pillar: 'cash',
        metric: 'BFR',
        title: 'Besoin en fonds de roulement élevé',
        description: `BFR de ${joursCA} jours de CA — le cycle d'exploitation immobilise trop de capital.`,
        impact: `${bfr.value.toLocaleString('fr-FR')} € bloqués dans le cycle d'exploitation.`,
        action: 'Réduire les délais clients (DSO), négocier des délais fournisseurs plus longs, optimiser la rotation des stocks.',
        calculatorLink: '/calculateurs/bfr',
        articleSlugs: ['bfr-formule-optimisation', 'bfr-negatif-bon-ou-mauvais', 'dso-vs-dpo-optimiser-tresorerie'],
      })
    }
  }

  // Marge critique
  if (marge && marge.value < 10) {
    alerts.push({
      severity: 'critique',
      pillar: 'margin',
      metric: 'Marge',
      title: 'Marge insuffisante',
      description: `Marge de ${marge.value}% — le moindre aléa peut mettre l'entreprise en difficulté.`,
      action: 'Revoir la politique tarifaire, analyser les postes de charges les plus élevés, identifier les produits/services non rentables.',
      calculatorLink: '/calculateurs/marge',
      articleSlugs: ['marge-nette-vs-brute', '5-kpis-financiers-pme'],
    })
  }

  // --- Warnings : vigilance ---

  // DSO warning
  if (dso && dso.value > 45 && dso.value <= 60) {
    alerts.push({
      severity: 'warning',
      pillar: 'cash',
      metric: 'DSO',
      title: 'Délai de paiement clients à surveiller',
      description: `DSO de ${dso.value} jours — au-dessus de la médiane sectorielle pour la plupart des secteurs.`,
      action: 'Renforcer le processus de relance et envisager des conditions de paiement plus strictes pour les nouveaux clients.',
      calculatorLink: '/calculateurs/dso',
      articleSlugs: ['calcul-dso-formule-2025', 'dso-vs-dpo-optimiser-tresorerie'],
    })
  }

  // Marge warning
  if (marge && marge.value >= 10 && marge.value < 25) {
    alerts.push({
      severity: 'warning',
      pillar: 'margin',
      metric: 'Marge',
      title: 'Marge à optimiser',
      description: `Marge de ${marge.value}% — une marge sous les 25% limite la capacité d'investissement.`,
      action: 'Analyser le mix produit/service pour identifier les leviers de marge les plus rapides.',
      calculatorLink: '/calculateurs/marge',
      articleSlugs: ['marge-nette-vs-brute'],
    })
  }

  // Risque croisé : DSO élevé + marge faible
  if (dso && dso.value > 45 && marge && marge.value < 25) {
    alerts.push({
      severity: 'critique',
      pillar: 'risk',
      metric: 'Croisé DSO/Marge',
      title: 'Double risque : trésorerie tendue et marge faible',
      description: `DSO ${dso.value}j + marge ${marge.value}% — la combinaison met la trésorerie sous forte pression.`,
      impact: 'Le retard de paiement des clients consomme une part disproportionnée de la marge disponible.',
      action: 'Priorité absolue : sécuriser le cash (relances, affacturage) tout en travaillant la structure de coûts.',
      articleSlugs: ['probleme-tresorerie-pme-10-signes', 'tresorerie-pme-5-erreurs-eviter', '5-erreurs-tresorerie-pme'],
    })
  }

  // CAC/LTV warning
  const cacLtv = get('cac-ltv')
  if (cacLtv && cacLtv.value < 2) {
    alerts.push({
      severity: cacLtv.value < 1 ? 'critique' : 'warning',
      pillar: 'resilience',
      metric: 'LTV/CAC',
      title: cacLtv.value < 1 ? 'Acquisition clients non rentable' : 'Ratio LTV/CAC à améliorer',
      description: `Ratio LTV/CAC de ${cacLtv.value}x — ${cacLtv.value < 1 ? 'chaque client coûte plus qu\'il ne rapporte' : 'la rentabilité de l\'acquisition est fragile'}.`,
      action: cacLtv.value < 1
        ? 'Revoir urgemment les canaux d\'acquisition et la proposition de valeur. Le modèle actuel n\'est pas soutenable.'
        : 'Optimiser le coût d\'acquisition (ciblage, canaux) et travailler la rétention pour augmenter la LTV.',
      articleSlugs: ['top-7-kpis-startups-saas'],
    })
  }

  // --- Infos : opportunités ---

  // Score incomplet
  const missing = ALL_CALCULATORS.filter((t) => !history.find((c) => c.type === t))
  if (missing.length > 4) {
    alerts.push({
      severity: 'info',
      pillar: 'risk',
      metric: 'Couverture',
      title: 'Diagnostic partiel',
      description: `Seulement ${ALL_CALCULATORS.length - missing.length} indicateurs sur ${ALL_CALCULATORS.length} complétés. Le score manque de fiabilité.`,
      action: 'Compléter au minimum DSO, BFR et Marge pour un diagnostic exploitable.',
      calculatorLink: '/calculateurs',
    })
  }

  // Benchmark superior
  for (const b of benchmarks) {
    if (b.level === 'excellent') {
      alerts.push({
        severity: 'info',
        pillar: b.metric === 'dso' || b.metric === 'bfr_jours' ? 'cash' : b.metric === 'marge' || b.metric === 'roi' ? 'margin' : 'resilience',
        metric: b.metric,
        title: `Performance supérieure : ${b.metric.toUpperCase()}`,
        description: b.interpretation,
        action: 'Position de force — capitaliser sur cet avantage concurrentiel.',
      })
    }
  }

  return alerts
}

// ---------------------------------------------------------------------------
// Summary Builder — structured text for system prompt
// ---------------------------------------------------------------------------

function buildSummary(
  diagnostic: DiagnosticScore,
  benchmarks: BenchmarkResult[],
  alerts: Alert[],
  sector: Sector,
  missingAnalyses: CalculatorType[]
): string {
  const lines: string[] = []

  // Header
  if (diagnostic.total !== null) {
    lines.push(`SCORE FINSIGHT : ${diagnostic.total}/100 (niveau : ${diagnostic.level}, confiance : ${diagnostic.confidence})`)
  } else {
    lines.push('SCORE FINSIGHT : Données insuffisantes pour un score global.')
  }

  // Pillars
  lines.push('')
  lines.push('SCORES PAR PILIER :')
  for (const [, pillar] of Object.entries(diagnostic.pillars)) {
    if (pillar.score !== null) {
      lines.push(`- ${pillar.label} : ${pillar.score}/${pillar.max} (${pillar.level})`)
    } else {
      lines.push(`- ${pillar.label} : Pas de données`)
    }
  }

  // Benchmarks
  if (benchmarks.length > 0) {
    lines.push('')
    lines.push('POSITIONNEMENT SECTORIEL :')
    for (const b of benchmarks) {
      lines.push(`- ${b.interpretation}`)
      lines.push(`  → ${b.vsMedianLabel}`)
    }
  }

  // Critical alerts
  const critiques = alerts.filter((a) => a.severity === 'critique')
  if (critiques.length > 0) {
    lines.push('')
    lines.push('ALERTES CRITIQUES :')
    for (const a of critiques) {
      lines.push(`- [${a.metric}] ${a.title}`)
      if (a.impact) lines.push(`  Impact : ${a.impact}`)
      lines.push(`  Action : ${a.action}`)
    }
  }

  // Warnings
  const warnings = alerts.filter((a) => a.severity === 'warning')
  if (warnings.length > 0) {
    lines.push('')
    lines.push('POINTS DE VIGILANCE :')
    for (const a of warnings) {
      lines.push(`- [${a.metric}] ${a.title} — ${a.description}`)
    }
  }

  // Missing
  if (missingAnalyses.length > 0) {
    lines.push('')
    lines.push(`ANALYSES MANQUANTES (${missingAnalyses.length}/${ALL_CALCULATORS.length}) : ${missingAnalyses.join(', ')}`)
  }

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Main Enrichment Pipeline — entry point
// ---------------------------------------------------------------------------

/**
 * Pipeline principal : données brutes → contexte enrichi.
 * Appelé côté serveur (API route) avant injection dans le system prompt GPT.
 */
export function enrichContext(history: Calculation[]): EnrichedContext {
  // 1. Detect sector (use the most recent calculation with a sector)
  const withSector = history.find((c) => c.secteur)
  const sector = normalizeSector(withSector?.secteur)

  // 2. Compute diagnostic score (4 pillars)
  const diagnostic = computeDiagnosticScore(history)

  // 3. Evaluate against benchmarks
  const benchmarks = evaluateAllBenchmarks(history, sector)

  // 4. Generate pre-computed alerts
  const alerts = generateAlerts(history, benchmarks, diagnostic)

  // 5. Find missing analyses
  const completedTypes = new Set(history.map((c) => c.type))
  const missingAnalyses = ALL_CALCULATORS.filter((t) => !completedTypes.has(t))

  // 6. Build structured summary for prompt
  const summary = buildSummary(diagnostic, benchmarks, alerts, sector, missingAnalyses)

  return {
    diagnostic,
    benchmarks,
    alerts,
    sector,
    summary,
    missingAnalyses,
    completedCount: completedTypes.size,
    totalCount: ALL_CALCULATORS.length,
  }
}
