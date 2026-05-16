/** Formule EBITDA de référence (add-back) — utilisée partout sur FinSight. */
export const EBITDA_FORMULA_CANONICAL =
  'EBITDA = Résultat net + Impôts + Intérêts + Amortissements & Dépréciations'

/** Approche top-down conservée sur le calculateur PME pour l’UX. */
export const EBITDA_FORMULA_TOP_DOWN_PME =
  'EBITDA ≈ CA − achats − charges externes − impôts/taxes − charges personnel'

export const EBITDA_NOTE_TOP_DOWN =
  'Note : approche top-down — résultat équivalent à la formule add-back pour une PME standard.'
