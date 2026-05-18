import {
    BDF_FIBEN_SOURCE_PREFIX,
    type BdfEbitdaBenchmark,
    getBenchmarkBySecteur,
} from '@/lib/benchmarks/bdf-sectoriels'
import {
    getMultiplesByBdfCode,
    SOURCE_MULTIPLES_MA,
} from '@/lib/benchmarks/multiples-valorisation'
import type { NafResolutionResult } from '@/lib/benchmarks/nafResolver'

export interface BenchmarkSecteurApiResponse {
    secteur: string | null
    code_naf: string | null
    nb_entreprises: number | null
    quartiles: { Q1: number; Q2: number; Q3: number } | null
    quartiles_marge: { Q1: number; Q2: number; Q3: number } | null
    multiples: { min: number; median: number; max: number; note: string } | null
    interpretation_mediane: string | null
    avertissement_comparabilite: string | null
    source: string
    source_marges: string
    source_multiples: string
    confidence: 'exact' | 'section' | 'none'
    naf_label: string | null
    naf_code: string | null
    approximation_note: string | null
    sector_reference: NafResolutionResult['sectorReference']
}

function buildMultiplesPayload(benchmark: BdfEbitdaBenchmark) {
    const multiples = getMultiplesByBdfCode(benchmark.codeNaf)
    if (!multiples) return null
    return {
        min: multiples.multipleMin,
        median: multiples.multipleMedian,
        max: multiples.multipleMax,
        note: multiples.note,
    }
}

function buildFromBenchmark(
    benchmark: BdfEbitdaBenchmark,
    extras: Partial<BenchmarkSecteurApiResponse> = {},
): BenchmarkSecteurApiResponse {
    const quartiles = {
        Q1: benchmark.quartiles.Q1,
        Q2: benchmark.quartiles.Q2,
        Q3: benchmark.quartiles.Q3,
    }
    return {
        secteur: benchmark.labelCourt,
        code_naf: benchmark.codeNaf,
        nb_entreprises: benchmark.nbEntreprises,
        quartiles,
        quartiles_marge: quartiles,
        multiples: buildMultiplesPayload(benchmark),
        interpretation_mediane: benchmark.interpretationMediane,
        avertissement_comparabilite: benchmark.avertissementComparabilite ?? null,
        source: BDF_FIBEN_SOURCE_PREFIX,
        source_marges: BDF_FIBEN_SOURCE_PREFIX,
        source_multiples: SOURCE_MULTIPLES_MA,
        confidence: 'section',
        naf_label: null,
        naf_code: null,
        approximation_note: null,
        sector_reference: null,
        ...extras,
    }
}

export function buildBenchmarkSecteurFromLabel(label: string): BenchmarkSecteurApiResponse | null {
    const benchmark = getBenchmarkBySecteur(label)
    if (!benchmark) return null
    return buildFromBenchmark(benchmark)
}

export function buildBenchmarkSecteurFromResolution(
    resolution: NafResolutionResult,
): BenchmarkSecteurApiResponse {
    if (!resolution.benchmark) {
        return {
            secteur: null,
            code_naf: resolution.bdfCode,
            nb_entreprises: null,
            quartiles: null,
            quartiles_marge: null,
            multiples: null,
            interpretation_mediane: null,
            avertissement_comparabilite: null,
            source: BDF_FIBEN_SOURCE_PREFIX,
            source_marges: BDF_FIBEN_SOURCE_PREFIX,
            source_multiples: SOURCE_MULTIPLES_MA,
            confidence: 'none',
            naf_label: resolution.nafLabel,
            naf_code: resolution.nafCode,
            approximation_note: resolution.approximationNote,
            sector_reference: resolution.sectorReference,
        }
    }

    return buildFromBenchmark(resolution.benchmark, {
        confidence: resolution.confidence,
        naf_label: resolution.nafLabel,
        naf_code: resolution.nafCode,
        approximation_note: resolution.approximationNote,
        sector_reference: resolution.sectorReference,
    })
}
