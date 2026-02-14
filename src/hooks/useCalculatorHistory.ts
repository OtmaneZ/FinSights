'use client'

import { useCallback, useSyncExternalStore } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CalculatorType =
  | 'dso'
  | 'bfr'
  | 'roi'
  | 'marge'
  | 'seuil-rentabilite'
  | 'ebitda'
  | 'cac-ltv'
  | 'burn-rate'
  | 'valorisation'

export interface Calculation {
  /** Identifiant du calculateur */
  type: CalculatorType
  /** Résultat principal du calcul */
  value: number
  /** Champs saisis par l'utilisateur */
  inputs: Record<string, number>
  /** Secteur d'activité sélectionné */
  secteur?: string
  /** Date ISO du calcul */
  date: string
  /** Interprétation textuelle (ex: "Excellent", "Critique") */
  interpretation?: string
  /** Unité du résultat (jours, €, %) */
  unit?: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'finsight_history'
const MAX_ENTRIES = 20
const EVENT_SAVED = 'finsight-calculation-saved'
const EVENT_CLEARED = 'finsight-history-cleared'

// ---------------------------------------------------------------------------
// External store (SSR-safe)
// ---------------------------------------------------------------------------

/** Listeners abonnés aux changements de l'historique */
let listeners: (() => void)[] = []

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function getSnapshot(): string {
  if (typeof window === 'undefined') return '[]'
  return localStorage.getItem(STORAGE_KEY) || '[]'
}

function getServerSnapshot(): string {
  return '[]'
}

// Écouter les événements globaux pour synchroniser tous les composants
if (typeof window !== 'undefined') {
  window.addEventListener(EVENT_SAVED, emitChange)
  window.addEventListener(EVENT_CLEARED, emitChange)
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCalculatorHistory() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const history: Calculation[] = JSON.parse(raw)

  /** Sauvegarde un calcul en tête de l'historique (LIFO) */
  const saveCalculation = useCallback((calc: Omit<Calculation, 'date'>) => {
    const existing: Calculation[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )

    const entry: Calculation = {
      ...calc,
      date: new Date().toISOString(),
    }

    // Dédupliquer : retirer l'ancien calcul du même type s'il existe
    const filtered = existing.filter((c) => c.type !== calc.type)
    const updated = [entry, ...filtered].slice(0, MAX_ENTRIES)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event(EVENT_SAVED))
  }, [])

  /** Retourne le dernier calcul d'un type donné */
  const getLatestByType = useCallback(
    (type: CalculatorType): Calculation | undefined => {
      return history.find((c) => c.type === type)
    },
    [history]
  )

  /** Nombre de types de calculateurs distincts complétés */
  const completedTypes = useCallback((): CalculatorType[] => {
    const types = new Set(history.map((c) => c.type))
    return Array.from(types) as CalculatorType[]
  }, [history])

  /** Efface tout l'historique */
  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event(EVENT_CLEARED))
  }, [])

  return {
    history,
    saveCalculation,
    getLatestByType,
    completedTypes,
    clearHistory,
  }
}
