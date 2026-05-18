import { getBenchmarkByBdfCode } from '@/lib/benchmarks/bdf-sectoriels'

export const SOURCE_MULTIPLES_MA = 'Données M&A PME France 2024'

export interface MultiplesSecteur {
    bdfCode: string
    label: string
    multipleMin: number
    multipleMedian: number
    multipleMax: number
    note: string
}

export const MULTIPLES_SECTORIELS: MultiplesSecteur[] = [
    {
        bdfCode: '56',
        label: 'Restauration',
        multipleMin: 3.5,
        multipleMedian: 4.5,
        multipleMax: 6.0,
        note: 'Cyclique, dépendant localisation',
    },
    {
        bdfCode: '55',
        label: 'Hôtellerie',
        multipleMin: 5.0,
        multipleMedian: 7.0,
        multipleMax: 10.0,
        note: 'Forte intensité capitalistique',
    },
    {
        bdfCode: 'F',
        label: 'BTP / Construction',
        multipleMin: 3.0,
        multipleMedian: 4.5,
        multipleMax: 6.5,
        note: 'Cyclique, carnet commandes clé',
    },
    {
        bdfCode: '47',
        label: 'Commerce de détail',
        multipleMin: 3.0,
        multipleMedian: 4.5,
        multipleMax: 6.0,
        note: 'Dépend du concept et emplacement',
    },
    {
        bdfCode: '46',
        label: 'Commerce de gros',
        multipleMin: 4.0,
        multipleMedian: 5.5,
        multipleMax: 7.5,
        note: 'Valorise les contrats récurrents',
    },
    {
        bdfCode: 'C',
        label: 'Industrie',
        multipleMin: 4.0,
        multipleMedian: 5.5,
        multipleMax: 7.5,
        note: 'Dépend intensité capitalistique',
    },
    {
        bdfCode: '62',
        label: 'Tech & Informatique',
        multipleMin: 5.0,
        multipleMedian: 7.5,
        multipleMax: 12.0,
        note: 'Prime si revenus récurrents (ARR)',
    },
    {
        bdfCode: '69',
        label: 'Conseil / Expertise',
        multipleMin: 4.0,
        multipleMedian: 6.0,
        multipleMax: 8.5,
        note: 'Dépend de la dépendance au dirigeant',
    },
    {
        bdfCode: '49',
        label: 'Transport',
        multipleMin: 3.5,
        multipleMedian: 5.0,
        multipleMax: 7.0,
        note: 'Valorise le parc et les contrats',
    },
    {
        bdfCode: '86',
        label: 'Santé',
        multipleMin: 5.0,
        multipleMedian: 7.5,
        multipleMax: 11.0,
        note: 'Forte demande acquéreurs stratégiques',
    },
    {
        bdfCode: '68',
        label: 'Immobilier',
        multipleMin: 8.0,
        multipleMedian: 12.0,
        multipleMax: 20.0,
        note: 'Hors norme — valorisation patrimoniale',
    },
]

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
