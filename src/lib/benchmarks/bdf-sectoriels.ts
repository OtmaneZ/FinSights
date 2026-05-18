import bdfRaw from '../../../data/données_entreprise/benchmarks_sectoriels_bdf_2024_1.json'

export const BDF_FIBEN_SOURCE_PREFIX = 'Banque de France, FIBEN 2024'

export interface BdfQuartiles {
    Q1: number
    Q2: number
    Q3: number
    unite: string
}

export interface BdfEbitdaBenchmark {
    codeNaf: string
    label: string
    labelCourt: string
    nbEntreprises: number | null
    quartiles: BdfQuartiles
    interpretationMediane: string
    sourceCitation: string
    /** Secteurs atypiques (ex. immobilier) — ne pas comparer aux autres secteurs. */
    avertissementComparabilite?: string
}

export type EbitdaPositionnement =
    | 'sous_Q1'
    | 'entre_Q1_et_Q2'
    | 'entre_Q2_et_Q3'
    | 'au_dessus_Q3'

type BdfSecteurJson = {
    code_naf: string
    label: string
    label_court: string
    nb_entreprises: number | null
    taux_excedent_brut_ca: { Q1: number; Q2: number; Q3: number; unite: string } | null
    interpretation_mediane?: string
    avertissement_comparabilite?: string
}

type BdfJson = {
    secteurs: BdfSecteurJson[]
}

const bdfData = bdfRaw as BdfJson

function formatSourceCitation(nbEntreprises: number | null): string {
    if (nbEntreprises != null && nbEntreprises > 0) {
        return `${BDF_FIBEN_SOURCE_PREFIX} – ${nbEntreprises.toLocaleString('fr-FR')} entreprises`
    }
    return BDF_FIBEN_SOURCE_PREFIX
}

function normalizeLabel(value: string): string {
    return value.trim().toLowerCase()
}

function secteurToBenchmark(s: BdfSecteurJson): BdfEbitdaBenchmark | null {
    const taux = s.taux_excedent_brut_ca
    if (!taux) return null

    return {
        codeNaf: s.code_naf,
        label: s.label,
        labelCourt: s.label_court,
        nbEntreprises: s.nb_entreprises,
        quartiles: {
            Q1: taux.Q1,
            Q2: taux.Q2,
            Q3: taux.Q3,
            unite: taux.unite,
        },
        interpretationMediane: s.interpretation_mediane ?? '',
        sourceCitation: formatSourceCitation(s.nb_entreprises),
        avertissementComparabilite: s.avertissement_comparabilite,
    }
}

/** Secteurs BDF avec données EBITDA/CA (EBG/CA) disponibles, triés par libellé court. */
export function getSecteursDisponibles(): BdfEbitdaBenchmark[] {
    return bdfData.secteurs
        .map(secteurToBenchmark)
        .filter((s): s is BdfEbitdaBenchmark => s !== null)
        .sort((a, b) => a.labelCourt.localeCompare(b.labelCourt, 'fr'))
}

/** Libellés courts pour le select sectoriel (ex. « BTP / Construction »). */
export function getSecteurLabels(): string[] {
    return getSecteursDisponibles().map((s) => s.labelCourt)
}

/**
 * Retourne les quartiles EBG/CA (proxy EBITDA/CA) et l'interprétation médiane BDF.
 * @param secteurLabel — `label_court` ou `label` du JSON BDF
 */
/** Benchmark par code NAF BDF (ex. « 56 », « F », « C »). */
export function getBenchmarkByBdfCode(bdfCode: string): BdfEbitdaBenchmark | null {
    const match = bdfData.secteurs.find((s) => s.code_naf === bdfCode)
    if (!match) return null
    return secteurToBenchmark(match)
}

export interface SecteurBdfSummary {
    labelCourt: string
    codeNaf: string
    medianeQ2: number
    nbEntreprises: number | null
    sourceCitation: string
}

/** Liste des 11 secteurs pour l’API /all. */
export function getSecteursSummary(): SecteurBdfSummary[] {
    return getSecteursDisponibles().map((s) => ({
        labelCourt: s.labelCourt,
        codeNaf: s.codeNaf,
        medianeQ2: s.quartiles.Q2,
        nbEntreprises: s.nbEntreprises,
        sourceCitation: s.sourceCitation,
    }))
}

export function getBenchmarkBySecteur(secteurLabel: string): BdfEbitdaBenchmark | null {
    const needle = normalizeLabel(secteurLabel)
    const match = bdfData.secteurs.find(
        (s) =>
            normalizeLabel(s.label_court) === needle ||
            normalizeLabel(s.label) === needle ||
            normalizeLabel(s.code_naf) === needle,
    )
    if (!match) return null
    return secteurToBenchmark(match)
}

export function getPositionnementEbitda(margePct: number, quartiles: BdfQuartiles): EbitdaPositionnement {
    if (margePct < quartiles.Q1) return 'sous_Q1'
    if (margePct < quartiles.Q2) return 'entre_Q1_et_Q2'
    if (margePct <= quartiles.Q3) return 'entre_Q2_et_Q3'
    return 'au_dessus_Q3'
}

export function getInterpretationEbitda(
    margePct: number,
    benchmark: BdfEbitdaBenchmark,
): { title: string; cls: string; text: string } {
    const { quartiles, labelCourt, interpretationMediane } = benchmark
    const pos = getPositionnementEbitda(margePct, quartiles)

    switch (pos) {
        case 'au_dessus_Q3':
            return {
                title: 'Top 25% du secteur',
                cls: 'bg-green-50 border-green-200 text-green-700',
                text: `Votre marge EBITDA (${margePct.toFixed(1)}%) dépasse le 3ᵉ quartile (${quartiles.Q3}%) — ${labelCourt}.`,
            }
        case 'entre_Q2_et_Q3':
            return {
                title: 'Au-dessus de la médiane',
                cls: 'bg-green-50 border-green-200 text-green-700',
                text: `Votre marge EBITDA (${margePct.toFixed(1)}%) est dans la moitié haute du secteur ${labelCourt} (médiane ${quartiles.Q2}%).`,
            }
        case 'entre_Q1_et_Q2':
            return {
                title: 'Sous la médiane sectorielle',
                cls: 'bg-amber-50 border-amber-200 text-amber-700',
                text: `Votre marge EBITDA (${margePct.toFixed(1)}%) est sous la médiane (${quartiles.Q2}%) — ${interpretationMediane || labelCourt}.`,
            }
        case 'sous_Q1':
        default:
            return {
                title: 'Sous le 1er quartile',
                cls: 'bg-red-50 border-red-200 text-red-700',
                text: `Votre marge EBITDA (${margePct.toFixed(1)}%) est sous le 1er quartile (${quartiles.Q1}%) — rentabilité opérationnelle faible pour ${labelCourt}.`,
            }
    }
}
