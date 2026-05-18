/**
 * Contrat unifié pour les deux moteurs de scoring FinSight.
 * Types uniquement — aucune logique métier.
 */

import type { ProcessedData } from '../../dataModel'
import type { SectorKey } from '../diagnosticScore'
import type { Calculation } from '@/hooks/useCalculatorHistory'

export type { SectorKey }

/** Source du score : transactions bancaires ou saisie déclarative (calculateurs / wizard). */
export type ScoringMode = 'transactional' | 'declarative'

/**
 * Niveau de santé financière sur l'échelle 0-100 unifiée.
 * Seuils : excellent ≥ 80, good ≥ 60, warning ≥ 40, critical < 40.
 */
export type ScoreLevel = 'critical' | 'warning' | 'good' | 'excellent'

/** Degré de confiance dans le score, selon la qualité et la couverture des données. */
export type ScoreConfidence = 'low' | 'medium' | 'high'

/**
 * Répartition du score total sur les quatre piliers (25 points chacun).
 * Même granularité pour les modes transactionnel et déclaratif.
 */
export interface UnifiedBreakdown {
  /** Pilier trésorerie et liquidité (0-25). */
  cash: number
  /** Pilier marges et rentabilité (0-25). */
  margin: number
  /** Pilier résilience structurelle (0-25). */
  resilience: number
  /** Pilier risques et signaux d'alerte (0-25). */
  risk: number
}

/**
 * Résultat du Z-Score Altman (indicateur distinct du score /100).
 * x2 peut être null si non disponible ; ne pas confondre avec une valeur forcée à 0.
 */
export interface AltmanResult {
  /** Score Z composite. */
  z: number
  /** BFR / actif total (ou équivalent X1). */
  x1: number
  /** Résultat réinvesti / actif ; null si non saisi. */
  x2: number | null
  /** Résultat d'exploitation approximatif / actif. */
  x3: number
  /** Capitaux propres / dettes. */
  x4: number
  /** Chiffre d'affaires / actif. */
  x5: number
  /** Zone de risque de défaillance. */
  zone: 'danger' | 'grey' | 'healthy'
  /** true si x2 a été estimé ou reste indisponible (null). */
  x2Estimated: boolean
}

/**
 * Score FinSight unifié exposé à l'UI, l'API et les exports (PDF, agents).
 * Remplace les sorties divergentes de finSightScore et diagnosticScore.
 */
export interface UnifiedScore {
  /** Score global 0-100 (somme des quatre piliers, éventuellement normalisée). */
  total: number
  level: ScoreLevel
  confidence: ScoreConfidence
  breakdown: UnifiedBreakdown
  /** Présent lorsque les données bilan permettent le calcul Altman. */
  altman?: AltmanResult
  mode: ScoringMode
  sector: SectorKey
  insights: string[]
  recommendations: string[]
  calculatedAt: Date
  /** Ratio de piliers effectivement calculés sur 4 (0 à 1). */
  dataCompleteness: number
}

/** Entrée commune : union discriminée selon le mode de scoring. */
export type UnifiedScoreInput = TransactionalInput | DeclarativeInput

/**
 * Entrée du moteur transactionnel (upload / DASHIS).
 * Consomme des transactions normalisées en ProcessedData.
 */
export interface TransactionalInput {
  mode: 'transactional'
  data: ProcessedData
  sector: SectorKey
}

/**
 * Entrée du moteur déclaratif SCORIS (calculateurs, wizard, API v1).
 * Option strategic pour un Altman complet (actif, capitaux propres, dette).
 */
export interface DeclarativeInput {
  mode: 'declarative'
  calculations: Calculation[]
  sector: SectorKey
  strategic?: {
    actifTotal: number
    capitauxPropres: number
    detteBancaire: number
    /** Résultat net N-1 pour X2 Altman (résultat réinvesti / actif). */
    resultatNetN1: number
  }
}
