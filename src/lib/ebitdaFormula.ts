/** Formule EBITDA de référence (add-back) — compte de résultat. */
export const EBITDA_FORMULA_CANONICAL =
    'EBITDA = Résultat net − résultat exceptionnel net (opt.) + Impôts sur les sociétés + Charges financières nettes + Dotations aux amortissements'

/** Approche top-down PME — saisie des charges d'exploitation. */
export const EBITDA_FORMULA_TOP_DOWN_PME =
    'EBITDA = CA − achats − charges externes − impôts & taxes − charges de personnel'

export const EBITDA_NOTE_TOP_DOWN =
    'Les charges financières (compte 66x) et les dotations ne sont pas déduites ici : elles sont hors périmètre de cette vue top-down.'

export const MARGE_BDF_LABEL = 'Marge EBITDA/CA (approx. EBG/CA Banque de France)'

export type EbitdaCalcMode = 'topdown' | 'addback'

export interface EbitdaTopDownInputs {
    ca: number
    achats: number
    chargesExternes: number
    impotsTaxes: number
    chargesPersonnel: number
    /** Subventions d'exploitation, produits de gestion courante, refacturations (optionnel). */
    autresProduits?: number
    /** Redevances crédit-bail, pertes sur créances, charges de gestion courante (optionnel). */
    autresCharges?: number
}

export interface EbitdaAddBackInputs {
    ca: number
    resultatNet: number
    /** Éléments exceptionnels inclus dans le RN — soustraits pour un EBITDA opérationnel (optionnel). */
    resultatExceptionnelNet?: number
    impotsSocietes: number
    chargesFinancieresNettes: number
    dotationsAmortissements: number
}

export interface EbitdaNormalisationInputs {
    retraitementDirigeant: number
    oneOffs: number
}

export interface EbitdaComputeResult {
    ebitda: number
    margePct: number
    ebitdaNormalise: number | null
}

export interface EbitdaValidationError {
    message: string
}

export interface MargeGapVendeur {
    ecartPoints: number
    montantEuro: number
    sousMediane: boolean
}

export function computeEbitdaTopDown(inputs: EbitdaTopDownInputs): number {
    const {
        ca,
        achats,
        chargesExternes,
        impotsTaxes,
        chargesPersonnel,
        autresProduits = 0,
        autresCharges = 0,
    } = inputs
    return (
        ca -
        achats -
        chargesExternes -
        impotsTaxes -
        chargesPersonnel +
        autresProduits -
        autresCharges
    )
}

export function computeEbitdaAddBack(inputs: EbitdaAddBackInputs): number {
    const {
        resultatNet,
        resultatExceptionnelNet = 0,
        impotsSocietes,
        chargesFinancieresNettes,
        dotationsAmortissements,
    } = inputs
    return (
        resultatNet -
        resultatExceptionnelNet +
        impotsSocietes +
        chargesFinancieresNettes +
        dotationsAmortissements
    )
}

export function computeMargePct(ebitda: number, ca: number): number {
    if (ca <= 0) return 0
    return (ebitda / ca) * 100
}

export function computeEbitdaNormalise(
    ebitda: number,
    normalisation: EbitdaNormalisationInputs,
): number {
    return ebitda + normalisation.retraitementDirigeant + normalisation.oneOffs
}

export function computeMargeGapVendeur(
    ca: number,
    margePct: number,
    medianeBdfPct: number,
): MargeGapVendeur {
    const ecartPoints = Math.abs(medianeBdfPct - margePct)
    const montantEuro = Math.round((ecartPoints / 100) * ca)
    return {
        ecartPoints,
        montantEuro,
        sousMediane: margePct < medianeBdfPct,
    }
}

export function validateEbitdaInputs(
    mode: EbitdaCalcMode,
    ca: number,
    chargesFinancieresNettes: number | null,
    margePct: number | null,
): EbitdaValidationError | null {
    if (ca <= 0) {
        return { message: 'Le chiffre d\'affaires doit être supérieur à 0.' }
    }

    if (mode === 'addback' && chargesFinancieresNettes != null && chargesFinancieresNettes < 0) {
        return {
            message:
                'Les charges financières nettes ne peuvent pas être négatives. Saisissez le montant des intérêts d\'emprunt (compte 66x).',
        }
    }

    if (margePct != null && margePct > 100) {
        return {
            message:
                'La marge dépasse 100 % — vérifiez vos montants (CA et charges). Une marge supérieure à 100 % n\'est pas réaliste.',
        }
    }

    return null
}
