import nafCodesRaw from '../../../data/données_entreprise/naf_codes.json'
import sectorReferencesRaw from '../../../data/données_entreprise/sector_references.json'
import {
    type BdfEbitdaBenchmark,
    getBenchmarkByBdfCode,
} from '@/lib/benchmarks/bdf-sectoriels'

const nafCodes = nafCodesRaw as Record<string, string>
const sectorReferences = sectorReferencesRaw as unknown as Record<string, SectorReferenceJson>

export type NafConfidence = 'exact' | 'section' | 'none'

export interface SectorReference {
    nafCode: string
    label: string
    sampleSize: number
    margeEbitda: [number, number, number]
    margeNette: [number, number, number]
    ratioChargesPersonnel: [number, number, number]
    ratioChargesExternes: [number, number, number]
    ratioAchats: [number, number, number]
}

export interface NafResolutionResult {
    nafCode: string
    nafLabel: string | null
    bdfCode: string | null
    secteurLabel: string | null
    benchmark: BdfEbitdaBenchmark | null
    sectorReference: SectorReference | null
    confidence: NafConfidence
    approximationNote: string | null
}

type SectorReferenceJson = {
    label: string
    sample_size: number
    marge_ebitda: [number, number, number]
    marge_nette: [number, number, number]
    ratio_charges_personnel: [number, number, number]
    ratio_charges_externes: [number, number, number]
    ratio_achats: [number, number, number]
}

/** Formate un code NAF saisi (ex. « 5610A » → « 56.10A »). */
export function formatNafCode(raw: string): string | null {
    const trimmed = raw.trim().toUpperCase()
    if (!trimmed) return null

    const dotted = trimmed.replace(/\s/g, '')
    if (/^\d{2}\.\d{2}[A-Z]$/.test(dotted)) {
        return dotted
    }

    const cleaned = trimmed.replace(/[^0-9A-Z]/g, '')
    const match = cleaned.match(/^(\d{2})(\d{2})([A-Z])?$/)
    if (!match) return null

    const [, div, sub, letter] = match
    const suffix = letter ?? 'Z'
    return `${div}.${sub}${suffix}`
}

function parseSectorReference(code: string, data: SectorReferenceJson): SectorReference {
    return {
        nafCode: code,
        label: data.label,
        sampleSize: data.sample_size,
        margeEbitda: data.marge_ebitda,
        margeNette: data.marge_nette,
        ratioChargesPersonnel: data.ratio_charges_personnel,
        ratioChargesExternes: data.ratio_charges_externes,
        ratioAchats: data.ratio_achats,
    }
}

function lookupSectorReference(formattedCode: string): SectorReference | null {
    const direct = sectorReferences[formattedCode]
    if (direct) return parseSectorReference(formattedCode, direct)

    if (!/[A-Z]$/.test(formattedCode)) {
        const withZ = `${formattedCode}Z`
        const ref = sectorReferences[withZ]
        if (ref) return parseSectorReference(withZ, ref)
    }

    return null
}

/** Résout un code NAF vers son libellé INSEE. */
export function resolveNafLabel(nafCode: string): string | null {
    const formatted = formatNafCode(nafCode)
    if (!formatted) return null

    const sectorRef = lookupSectorReference(formatted)
    if (sectorRef) return sectorRef.label

    return nafCodes[formatted] ?? null
}

function getDivision(formattedCode: string): string {
    return formattedCode.slice(0, 2)
}

/**
 * Mappe un code NAF vers le code_naf BDF (ex. « 56.10A » → « 56 », « 41.20A » → « F »).
 */
export function resolveNafToBdfCode(nafCode: string): string | null {
    const formatted = formatNafCode(nafCode)
    if (!formatted) return null

    const division = getDivision(formatted)
    const divNum = parseInt(division, 10)

    const directMap: Record<string, string> = {
        '55': '55',
        '56': '56',
        '46': '46',
        '47': '47',
        '49': '49',
        '62': '62',
        '63': '62',
        '68': '68',
        '69': '69',
        '70': '69',
        '71': '69',
        '72': '69',
        '73': '69',
        '74': '69',
        '86': '86',
    }

    if (directMap[division]) {
        return directMap[division]
    }

    if (divNum >= 41 && divNum <= 43) {
        return 'F'
    }

    if (divNum >= 10 && divNum <= 33) {
        return 'C'
    }

    return null
}

function buildApproximationNote(formattedCode: string, secteurLabel: string): string {
    return `Secteur approximé — votre activité (NAF ${formattedCode}) est rattachée à la section BDF ${secteurLabel}`
}

/** Résolution complète : NAF → benchmark BDF + référence sectorielle si disponible. */
export function resolveNafToBenchmark(nafCode: string): NafResolutionResult | null {
    const formatted = formatNafCode(nafCode)
    if (!formatted) return null

    const nafLabel = resolveNafLabel(nafCode)
    const sectorReference = lookupSectorReference(formatted)
    const bdfCode = resolveNafToBdfCode(nafCode)
    const benchmark = bdfCode ? getBenchmarkByBdfCode(bdfCode) : null
    const secteurLabel = benchmark?.labelCourt ?? null

    let confidence: NafConfidence = 'none'
    if (!benchmark) {
        confidence = 'none'
    } else if (sectorReference) {
        confidence = 'exact'
    } else {
        confidence = 'section'
    }

    const approximationNote =
        confidence === 'section' && secteurLabel
            ? buildApproximationNote(formatted, secteurLabel)
            : null

    return {
        nafCode: formatted,
        nafLabel,
        bdfCode,
        secteurLabel,
        benchmark,
        sectorReference,
        confidence,
        approximationNote,
    }
}
