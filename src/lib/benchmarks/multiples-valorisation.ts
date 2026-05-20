import maRaw from '../../../data/données_entreprise/multiples_ma_pme_france_2024.json'
import { getBenchmarkByBdfCode } from '@/lib/benchmarks/bdf-sectoriels'

type MaSecteurJson = {
    bdf_code: string
    label: string
    multiple_min: number
    multiple_median: number
    multiple_max: number
    note: string
}

type MaJson = {
    _meta: {
        source: string
        perimetre: string
        nb_transactions: string
        methodologie: string
    }
    secteurs: MaSecteurJson[]
}

const maData = maRaw as MaJson

export const SOURCE_MULTIPLES_MA =
    'Multiples M&A PME France 2020-2024 — transactions < 50M€ — fourchette Q1/Q3 observée'

export const MULTIPLES_MA_METHODOLOGIE = `${maData._meta.methodologie}. Périmètre : ${maData._meta.perimetre}. ${maData._meta.nb_transactions}.`

/** @deprecated Utiliser SOURCE_MULTIPLES_MA — conservé pour l’API benchmarks secteur */
export const SOURCE_MULTIPLES_MA_LEGACY = maData._meta.source

export interface MultiplesSecteur {
    bdfCode: string
    label: string
    multipleMin: number
    multipleMedian: number
    multipleMax: number
    note: string
}

function mapSecteur(s: MaSecteurJson): MultiplesSecteur {
    return {
        bdfCode: s.bdf_code,
        label: s.label,
        multipleMin: s.multiple_min,
        multipleMedian: s.multiple_median,
        multipleMax: s.multiple_max,
        note: s.note,
    }
}

export const MULTIPLES_SECTORIELS: MultiplesSecteur[] = maData.secteurs.map(mapSecteur)

/** Clés secteur CalculatorHub (legacy) → code BDF */
const HUB_SECTOR_TO_BDF: Record<string, string> = {
    services: '69',
    conseil: '69',
    saas: '62',
    tech: '62',
    informatique: '62',
    industrie: 'C',
    manufacturing: 'C',
    commerce: '47',
    retail: '47',
    gros: '46',
    transport: '49',
    sante: '86',
    santé: '86',
    restauration: '56',
    hotel: '55',
    hôtellerie: '55',
    btp: 'F',
    construction: 'F',
    immobilier: '68',
}

export type QualificationMultiple = 'prime' | 'standard' | 'discount'

export interface MultipleSuggereResult {
    multiple: number
    fourchette: { min: number; max: number }
    qualification: QualificationMultiple
    qualificationDetail: string
    raisonnement: string
    note: string
    quartilesBdf: { Q1: number; Q2: number; Q3: number }
}

const multiplesByBdfCode = new Map(MULTIPLES_SECTORIELS.map((m) => [m.bdfCode, m]))
const multiplesByLabel = new Map(MULTIPLES_SECTORIELS.map((m) => [m.label.toLowerCase(), m]))

export function getMultiplesByBdfCode(bdfCode: string): MultiplesSecteur | null {
    return multiplesByBdfCode.get(bdfCode) ?? null
}

export function getMultiplesByLabel(label: string): MultiplesSecteur | null {
    return multiplesByLabel.get(label.trim().toLowerCase()) ?? null
}

/** Résout un libellé ou clé hub vers les multiples M&A sectoriels. */
export function resolveMultiplesForSectorInput(secteurInput: string): MultiplesSecteur | null {
    const key = secteurInput.trim().toLowerCase()
    if (!key) return null
    const byLabel = getMultiplesByLabel(secteurInput)
    if (byLabel) return byLabel
    const bdfCode = HUB_SECTOR_TO_BDF[key]
    if (bdfCode) return getMultiplesByBdfCode(bdfCode)
    return null
}

function interpolate(value: number, min: number, max: number, t: number): number {
    const clamped = Math.min(1, Math.max(0, t))
    return min + clamped * (max - min)
}

function roundMultiple(value: number): number {
    return Math.round(value * 10) / 10
}

/**
 * Qualifie la marge EBITDA/CA vs quartiles BDF et suggère un multiple de marché.
 */
export function getMultipleSuggere(
    bdfCode: string,
    margeEbitdaCa: number,
): MultipleSuggereResult | null {
    const multiples = getMultiplesByBdfCode(bdfCode)
    const bdf = getBenchmarkByBdfCode(bdfCode)
    if (!multiples || !bdf) return null

    const { Q1, Q2, Q3 } = bdf.quartiles
    let qualification: QualificationMultiple
    let qualificationDetail: string
    let multiple: number
    let raisonnement: string

    if (margeEbitdaCa >= Q3) {
        qualification = 'prime'
        qualificationDetail = 'Prime'
        const span = Math.max(Q3 * 0.5, 1)
        const t = Math.min(1, (margeEbitdaCa - Q3) / span)
        multiple = interpolate(
            multiples.multipleMedian,
            multiples.multipleMedian,
            multiples.multipleMax,
            0.5 + t * 0.5,
        )
        raisonnement = `Marge de ${margeEbitdaCa.toFixed(1)}% au-dessus du 3ᵉ quartile BDF (${Q3}%) — EBITDA perçu comme « prime » par le marché.`
    } else if (margeEbitdaCa >= Q2) {
        qualification = 'standard'
        qualificationDetail = 'Standard → Prime (limite haute)'
        const t = (margeEbitdaCa - Q2) / Math.max(Q3 - Q2, 0.1)
        multiple = interpolate(
            multiples.multipleMedian,
            multiples.multipleMedian,
            multiples.multipleMax,
            t * 0.6,
        )
        raisonnement = `Marge de ${margeEbitdaCa.toFixed(1)}% entre la médiane (${Q2}%) et le 3ᵉ quartile (${Q3}%) — profil standard avec tendance prime.`
    } else if (margeEbitdaCa >= Q1) {
        qualification = 'standard'
        qualificationDetail = 'Standard'
        const t = (margeEbitdaCa - Q1) / Math.max(Q2 - Q1, 0.1)
        multiple = interpolate(
            multiples.multipleMin,
            multiples.multipleMedian,
            multiples.multipleMedian,
            0.4 + t * 0.4,
        )
        raisonnement = `Marge de ${margeEbitdaCa.toFixed(1)}% entre Q1 (${Q1}%) et la médiane (${Q2}%) — multiple médian de marché.`
    } else {
        qualification = 'discount'
        qualificationDetail = 'Discount'
        const t = Math.min(1, (Q1 - margeEbitdaCa) / Math.max(Q1, 0.1))
        multiple = interpolate(
            multiples.multipleMin,
            multiples.multipleMin,
            multiples.multipleMedian,
            1 - t * 0.5,
        )
        raisonnement = `Marge de ${margeEbitdaCa.toFixed(1)}% sous le 1er quartile BDF (${Q1}%) — décote par rapport au marché.`
    }

    return {
        multiple: roundMultiple(multiple),
        fourchette: { min: multiples.multipleMin, max: multiples.multipleMax },
        qualification,
        qualificationDetail,
        raisonnement,
        note: multiples.note,
        quartilesBdf: { Q1, Q2, Q3 },
    }
}

export function describeMargeVsQuartiles(
    margeEbitdaCa: number,
    quartiles: { Q1: number; Q2: number; Q3: number },
): string {
    const { Q1, Q2, Q3 } = quartiles
    if (margeEbitdaCa >= Q3) {
        return `au-dessus du Q3 (${Q3}%)`
    }
    if (margeEbitdaCa >= Q2) {
        return `au-dessus de la médiane (${Q2}%), sous le Q3 (${Q3}%)`
    }
    if (margeEbitdaCa >= Q1) {
        return `entre Q1 (${Q1}%) et la médiane (${Q2}%)`
    }
    return `sous le Q1 (${Q1}%)`
}

export function encodeQualificationMultiple(q: QualificationMultiple | undefined): number {
    if (q === 'prime') return 3
    if (q === 'standard') return 2
    if (q === 'discount') return 1
    return 0
}
