export const DSO_BENCHMARKS = {
    'services-b2b': {
        label: 'Services B2B',
        good: 35,
        median: 45,
        bad: 60,
        source: 'Altares 2024 / DFCG',
    },
    commerce: {
        label: 'Commerce',
        good: 20,
        median: 30,
        bad: 45,
        source: 'Altares 2024 / DFCG',
    },
    industrie: {
        label: 'Industrie / BTP',
        good: 40,
        median: 55,
        bad: 75,
        source: 'Altares 2024 / DFCG',
    },
    'saas-tech': {
        label: 'SaaS / Tech',
        good: 15,
        median: 25,
        bad: 45,
        source: 'Altares 2024 / DFCG',
    },
    btp: {
        label: 'BTP',
        good: 50,
        median: 65,
        bad: 90,
        source: 'Altares 2024 / DFCG',
    },
    chr: {
        label: 'CHR / Restauration',
        good: 5,
        median: 10,
        bad: 20,
        source: 'Altares 2024 / DFCG',
    },
    autre: {
        label: 'Autre',
        good: 30,
        median: 45,
        bad: 60,
        source: 'Altares 2024 / DFCG',
    },
} as const

export type DsoSectorKey = keyof typeof DSO_BENCHMARKS

export const DSO_SECTOR_KEYS = Object.keys(DSO_BENCHMARKS) as DsoSectorKey[]

/** Anciennes clés calculateur (4 secteurs) → clés unifiées */
const LEGACY_DSO_SECTOR_MAP: Record<string, DsoSectorKey> = {
    services: 'services-b2b',
    saas: 'saas-tech',
    commerce: 'commerce',
    industrie: 'industrie',
}

export function resolveDsoSectorKey(secteur: string): DsoSectorKey | null {
    if (secteur in DSO_BENCHMARKS) {
        return secteur as DsoSectorKey
    }
    return LEGACY_DSO_SECTOR_MAP[secteur] ?? null
}

export type DsoInterpretationLevel = 'excellent' | 'bon' | 'surveiller' | 'critique'

export interface DsoInterpretationTier {
    label: string
    color: 'green' | 'blue' | 'orange' | 'red'
    niveau: DsoInterpretationLevel
}

export function getDsoInterpretationTier(
    dso: number,
    sectorKey: DsoSectorKey,
): DsoInterpretationTier {
    const bench = DSO_BENCHMARKS[sectorKey]
    if (dso <= bench.good) {
        return { label: 'Excellent', color: 'green', niveau: 'excellent' }
    }
    if (dso <= bench.median) {
        return { label: 'Bon', color: 'blue', niveau: 'bon' }
    }
    if (dso <= bench.bad) {
        return { label: 'À surveiller', color: 'orange', niveau: 'surveiller' }
    }
    return { label: 'Critique', color: 'red', niveau: 'critique' }
}

export function computeDsoGapVendeur(
    dso: number,
    caAnnualise: number,
    sectorKey: DsoSectorKey,
): { gapJours: number; gapEuros: number; sousMediane: boolean } {
    const bench = DSO_BENCHMARKS[sectorKey]
    const gapJours = dso - bench.median
    const gapEuros = Math.round((gapJours / 365) * caAnnualise)
    return {
        gapJours,
        gapEuros,
        sousMediane: gapEuros > 0,
    }
}
