/**
 * FEC Parser — Client-side Fichier des Écritures Comptables analyzer
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * RGPD by Design : parsing exclusivement client-side via FileReader API.
 * Aucune donnée comptable ne transite par le serveur.
 *
 * Format FEC (DGFIP) — 18 colonnes obligatoires :
 *   JournalCode | JournalLib | EcritureNum | EcritureDate | CompteNum |
 *   CompteLib | CompAuxNum | CompAuxLib | PieceRef | PieceDate |
 *   EcritureLib | Debit | Credit | EcrtureLet | DateLet |
 *   ValidDate | Montantdevise | Idevise
 *
 * Mapping PCG (Plan Comptable Général) :
 *   - CA          : Σ credits comptes 70x (ventes et produits)
 *   - Créances    : solde débiteur comptes 411x (clients)
 *   - Dettes fourn: solde créditeur comptes 401x (fournisseurs)
 *   - Charges     : Σ débits comptes classe 6
 *   - Trésorerie  : solde comptes 512x (banque)
 *   - Stocks      : solde débiteur comptes 3x (si disponible)
 *   - Dette nette : solde créditeur comptes 16x (emprunts)
 *
 * L'output est un objet prêt à injecter dans useCalculatorHistory.saveCalculation()
 * pour chaque calculateur du Wizard.
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** One row from the FEC file */
interface FECRow {
  journalCode: string
  ecritureDate: string    // YYYYMMDD
  compteNum: string
  compteLib: string
  debit: number
  credit: number
}

/** Aggregated financial data extracted from FEC */
export interface FECExtractedData {
  /** Chiffre d'affaires (annualisé) */
  ca: number
  /** Créances clients (solde) */
  creancesClients: number
  /** Dettes fournisseurs (solde) */
  dettesFournisseurs: number
  /** Total charges exploitation (classe 6) */
  chargesExploitation: number
  /** Trésorerie disponible (comptes 512) */
  tresorerie: number
  /** Stocks (comptes classe 3, solde débiteur) */
  stocks: number
  /** Dette financière (comptes 16x) */
  detteFinanciere: number
  /** Date de début exercice */
  dateDebut: string
  /** Date de fin exercice */
  dateFin: string
  /** Nombre de mois dans l'exercice */
  moisExercice: number
  /** Factor appliqué pour annualiser (12 / moisExercice) */
  facteurAnnualisation: number
  /** Nombre d'écritures traitées */
  nbEcritures: number
  /** Source file name */
  fileName: string
}

/** Calculated indicators ready for wizard injection */
export interface FECWizardData {
  /** DSO — Délai de paiement clients */
  dso: { value: number; inputs: { creances: number; ca: number } }
  /** BFR — Besoin en fonds de roulement */
  bfr: { value: number; inputs: { stocks: number; creances: number; dettes: number; ca: number } }
  /** Marge brute (approximée) */
  marge: { value: number; inputs: { prixVente: number; coutRevient: number } }
  /** EBITDA (CA - charges exploitation) */
  ebitda: { value: number; inputs: { ca: number; charges: number } }
  /** Burn Rate (charges mensuelles) */
  burnRate: { value: number; inputs: { depensesMensuelles: number } }
  /** Seuil de rentabilité (approx: charges comme fixes, marge brute) */
  seuilRentabilite: { value: number; inputs: { chargesFixes: number; tauxMarge: number } }
  /** Gearing (si dette financière et EBITDA disponibles) */
  gearing: { value: number; inputs: { detteNette: number; ebitda: number } } | null
}

export interface FECParseResult {
  success: true
  extracted: FECExtractedData
  wizard: FECWizardData
  /** Indicators that couldn't be computed (missing data) */
  warnings: string[]
  /** Quality score 0-100 (how many indicators computed / total) */
  dataQuality: number
}

export interface FECParseError {
  success: false
  error: string
  details?: string
}

export type FECResult = FECParseResult | FECParseError

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FEC COLUMN DEFINITIONS (DGFIP standard)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Required FEC column names — case-insensitive matching */
const REQUIRED_COLUMNS = [
  'journalcode',
  'ecrituredate',
  'comptenum',
  'debit',
  'credit',
] as const

/** Optional but useful columns */
const OPTIONAL_COLUMNS = ['comptelib', 'journallib', 'ecriturelib'] as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN PARSER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Parse a FEC file (txt or csv) and extract financial indicators.
 * 100% client-side — uses FileReader API.
 *
 * @param file - File object from input or drag & drop
 * @param onProgress - Optional callback for progress tracking (0-100)
 */
export async function parseFEC(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<FECResult> {
  // ── Validate file type ──
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!ext || !['txt', 'csv', 'tsv'].includes(ext)) {
    return {
      success: false,
      error: 'Format de fichier non supporté',
      details: `Extension ".${ext}" non reconnue. Formats acceptés : .txt, .csv (format FEC DGFIP).`,
    }
  }

  // ── Read file content ──
  onProgress?.(5)
  let content: string
  try {
    content = await readFileAsText(file)
  } catch {
    return {
      success: false,
      error: 'Impossible de lire le fichier',
      details: 'Le fichier est peut-être corrompu ou trop volumineux.',
    }
  }

  if (!content.trim()) {
    return { success: false, error: 'Le fichier est vide' }
  }

  onProgress?.(15)

  // ── Detect separator ──
  const separator = detectSeparator(content)

  // ── Parse header ──
  const lines = content.split(/\r?\n/)
  if (lines.length < 2) {
    return { success: false, error: 'Le fichier ne contient pas assez de lignes (header + au moins 1 écriture)' }
  }

  const headerLine = lines[0]
  const headers = headerLine.split(separator).map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase())

  // ── Validate required columns ──
  const columnMap = buildColumnMap(headers)
  const missingCols = REQUIRED_COLUMNS.filter((col) => columnMap[col] === undefined)
  if (missingCols.length > 0) {
    return {
      success: false,
      error: 'Colonnes FEC obligatoires manquantes',
      details: `Colonnes introuvables : ${missingCols.join(', ')}. Vérifiez que votre fichier est au format FEC standard (DGFIP).`,
    }
  }

  onProgress?.(25)

  // ── Parse rows ──
  const rows: FECRow[] = []
  const totalLines = lines.length - 1 // minus header

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const cols = parseLine(line, separator)
    const row = mapToFECRow(cols, columnMap)
    if (row) rows.push(row)

    // Progress: 25% → 70% during row parsing
    if (i % 500 === 0) {
      onProgress?.(25 + Math.round(((i / totalLines) * 45)))
    }
  }

  if (rows.length === 0) {
    return { success: false, error: 'Aucune écriture comptable valide trouvée dans le fichier' }
  }

  onProgress?.(75)

  // ── Aggregate financial data ──
  const extracted = aggregateFinancials(rows, file.name)

  onProgress?.(85)

  // ── Compute wizard indicators ──
  const { wizard, warnings } = computeWizardData(extracted)

  // ── Data quality ──
  const totalIndicators = 7 // dso, bfr, marge, ebitda, burnRate, seuil, gearing
  const computed = [
    extracted.ca > 0,
    extracted.creancesClients > 0,
    extracted.chargesExploitation > 0,
    extracted.tresorerie !== 0,
    wizard.gearing !== null,
    extracted.stocks > 0,
    extracted.dettesFournisseurs > 0,
  ].filter(Boolean).length
  const dataQuality = Math.round((computed / totalIndicators) * 100)

  onProgress?.(100)

  return {
    success: true,
    extracted,
    wizard,
    warnings,
    dataQuality,
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILE READING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    // Try UTF-8 first, FEC files are typically ISO-8859-1 or UTF-8
    reader.readAsText(file, 'UTF-8')
  })
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SEPARATOR DETECTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function detectSeparator(content: string): string {
  const firstLine = content.split(/\r?\n/)[0] || ''

  // Count occurrences of common separators
  const counts: Record<string, number> = {
    '\t': (firstLine.match(/\t/g) || []).length,
    '|': (firstLine.match(/\|/g) || []).length,
    ';': (firstLine.match(/;/g) || []).length,
    ',': (firstLine.match(/,/g) || []).length,
  }

  // FEC standard is tab-separated, but some tools export with | or ;
  // Pick the separator with the most occurrences
  let best = '\t'
  let max = 0
  for (const [sep, count] of Object.entries(counts)) {
    if (count > max) {
      max = count
      best = sep
    }
  }

  return best
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COLUMN MAPPING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type ColumnKey = (typeof REQUIRED_COLUMNS)[number] | (typeof OPTIONAL_COLUMNS)[number]

function buildColumnMap(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {}

  // Normalize column names: remove accents, lowercase, remove spaces
  const normalize = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '')

  const allColumns = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS]

  for (const col of allColumns) {
    const normalized = normalize(col)
    const idx = headers.findIndex((h) => normalize(h) === normalized)
    if (idx !== -1) {
      map[col] = idx
    }
  }

  return map
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LINE PARSING — handles quoted fields
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function parseLine(line: string, separator: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === separator && !inQuotes) {
      fields.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current.trim())

  return fields
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROW MAPPING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function mapToFECRow(cols: string[], columnMap: Record<string, number>): FECRow | null {
  try {
    const compteNum = cols[columnMap['comptenum']] || ''
    if (!compteNum) return null

    return {
      journalCode: cols[columnMap['journalcode']] || '',
      ecritureDate: cols[columnMap['ecrituredate']] || '',
      compteNum: compteNum.replace(/\s/g, ''),
      compteLib: cols[columnMap['comptelib'] ?? -1] || '',
      debit: parseAmount(cols[columnMap['debit']]),
      credit: parseAmount(cols[columnMap['credit']]),
    }
  } catch {
    return null
  }
}

/** Parse French number format: "1 234,56" → 1234.56 */
function parseAmount(raw: string | undefined): number {
  if (!raw) return 0
  const cleaned = raw
    .replace(/"/g, '')
    .replace(/\s/g, '')
    .replace(/,/g, '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FINANCIAL AGGREGATION — PCG mapping
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function aggregateFinancials(rows: FECRow[], fileName: string): FECExtractedData {
  let caCredits = 0           // Comptes 70x: crédits = ventes
  let creancesDebit = 0       // Comptes 411x: débit
  let creancesCredit = 0      // Comptes 411x: crédit
  let dettesFournDebit = 0    // Comptes 401x: débit
  let dettesFournCredit = 0   // Comptes 401x: crédit
  let chargesDebit = 0        // Comptes classe 6: débit
  let tresorerieDebit = 0     // Comptes 512x: débit
  let tresorerieCredit = 0    // Comptes 512x: crédit
  let stocksDebit = 0         // Comptes classe 3: débit
  let stocksCredit = 0        // Comptes classe 3: crédit
  let detteFinDebit = 0       // Comptes 16x: débit (remboursements)
  let detteFinCredit = 0      // Comptes 16x: crédit (emprunts)

  let dateMin = '99999999'
  let dateMax = '00000000'

  for (const row of rows) {
    const num = row.compteNum

    // ── Track date range
    if (row.ecritureDate && row.ecritureDate.length === 8) {
      if (row.ecritureDate < dateMin) dateMin = row.ecritureDate
      if (row.ecritureDate > dateMax) dateMax = row.ecritureDate
    }

    // ── CA: comptes 70x (ventes) — on prend les crédits
    if (num.startsWith('70')) {
      caCredits += row.credit
    }

    // ── Créances clients: comptes 411x
    if (num.startsWith('411')) {
      creancesDebit += row.debit
      creancesCredit += row.credit
    }

    // ── Dettes fournisseurs: comptes 401x
    if (num.startsWith('401')) {
      dettesFournDebit += row.debit
      dettesFournCredit += row.credit
    }

    // ── Charges exploitation: classe 6
    if (num.startsWith('6')) {
      chargesDebit += row.debit
    }

    // ── Trésorerie: comptes 512x (banque)
    if (num.startsWith('512')) {
      tresorerieDebit += row.debit
      tresorerieCredit += row.credit
    }

    // ── Stocks: comptes classe 3
    if (num.startsWith('3')) {
      stocksDebit += row.debit
      stocksCredit += row.credit
    }

    // ── Dettes financières: comptes 16x
    if (num.startsWith('16')) {
      detteFinDebit += row.debit
      detteFinCredit += row.credit
    }
  }

  // ── Date range & annualization
  const dateDebut = formatFECDate(dateMin)
  const dateFin = formatFECDate(dateMax)
  const moisExercice = computeMonthsBetween(dateMin, dateMax)
  const facteurAnnualisation = moisExercice > 0 && moisExercice < 12
    ? 12 / moisExercice
    : 1

  // ── Apply annualization to flow accounts (CA, charges)
  const ca = Math.round(caCredits * facteurAnnualisation)
  const chargesExploitation = Math.round(chargesDebit * facteurAnnualisation)

  // ── Balance accounts: solde = débit - crédit
  const creancesClients = Math.max(0, Math.round(creancesDebit - creancesCredit))
  const dettesFournisseurs = Math.max(0, Math.round(dettesFournCredit - dettesFournDebit))
  const tresorerie = Math.round(tresorerieDebit - tresorerieCredit)
  const stocks = Math.max(0, Math.round(stocksDebit - stocksCredit))
  const detteFinanciere = Math.max(0, Math.round(detteFinCredit - detteFinDebit))

  return {
    ca,
    creancesClients,
    dettesFournisseurs,
    chargesExploitation,
    tresorerie,
    stocks,
    detteFinanciere,
    dateDebut,
    dateFin,
    moisExercice,
    facteurAnnualisation,
    nbEcritures: rows.length,
    fileName,
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WIZARD DATA COMPUTATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function computeWizardData(data: FECExtractedData): {
  wizard: FECWizardData
  warnings: string[]
} {
  const warnings: string[] = []

  // ── DSO
  const dsoValue = data.ca > 0
    ? Math.round((data.creancesClients / data.ca) * 365)
    : 0
  if (data.creancesClients === 0) warnings.push('Aucune créance client détectée (comptes 411x)')

  // ── BFR
  const bfrValue = data.stocks + data.creancesClients - data.dettesFournisseurs

  // ── Marge brute (approximation: CA vs charges)
  // On approxime le prix de vente unitaire à 100 et le coût comme ratio charges/CA
  const margeValue = data.ca > 0
    ? Math.round(((data.ca - data.chargesExploitation) / data.ca) * 100)
    : 0
  // Clamp marge to reasonable range
  const margeClamped = Math.max(-50, Math.min(95, margeValue))

  // Pour le wizard: prix = 100, cout = 100 - marge
  const prixVente = 100
  const coutRevient = Math.round(100 - Math.max(0, margeClamped))

  // ── EBITDA
  const ebitdaValue = data.ca - data.chargesExploitation
  if (data.chargesExploitation === 0) warnings.push('Aucune charge d\'exploitation détectée (classe 6)')

  // ── Burn Rate
  const burnRate = data.chargesExploitation > 0
    ? Math.round(data.chargesExploitation / 12)
    : 0

  // ── Seuil de rentabilité (approximation: on utilise charges comme fixes)
  // Taux de marge variable approximé
  const tauxMarge = Math.max(1, margeClamped)
  const seuilRentabilite = tauxMarge > 0
    ? Math.round(data.chargesExploitation / (tauxMarge / 100))
    : 0

  // ── Gearing
  let gearing: FECWizardData['gearing'] = null
  if (data.detteFinanciere > 0 && ebitdaValue > 0) {
    const detteNette = data.detteFinanciere - Math.max(0, data.tresorerie)
    gearing = {
      value: Math.round((detteNette / ebitdaValue) * 10) / 10,
      inputs: { detteNette, ebitda: ebitdaValue },
    }
  }

  if (data.facteurAnnualisation > 1) {
    warnings.push(
      `Exercice de ${data.moisExercice} mois détecté — CA et charges annualisés (×${data.facteurAnnualisation.toFixed(1)})`,
    )
  }

  if (data.ca === 0) {
    warnings.push('Aucun chiffre d\'affaires détecté (comptes 70x) — vérifiez le fichier')
  }

  return {
    wizard: {
      dso: { value: dsoValue, inputs: { creances: data.creancesClients, ca: data.ca } },
      bfr: { value: bfrValue, inputs: { stocks: data.stocks, creances: data.creancesClients, dettes: data.dettesFournisseurs, ca: data.ca } },
      marge: { value: margeClamped, inputs: { prixVente, coutRevient } },
      ebitda: { value: ebitdaValue, inputs: { ca: data.ca, charges: data.chargesExploitation } },
      burnRate: { value: burnRate, inputs: { depensesMensuelles: burnRate } },
      seuilRentabilite: { value: seuilRentabilite, inputs: { chargesFixes: data.chargesExploitation, tauxMarge } },
      gearing,
    },
    warnings,
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATE HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Format "YYYYMMDD" → "DD/MM/YYYY" */
function formatFECDate(yyyymmdd: string): string {
  if (!yyyymmdd || yyyymmdd.length !== 8) return 'Inconnue'
  return `${yyyymmdd.slice(6, 8)}/${yyyymmdd.slice(4, 6)}/${yyyymmdd.slice(0, 4)}`
}

/** Compute months between two YYYYMMDD dates */
function computeMonthsBetween(dateMin: string, dateMax: string): number {
  if (dateMin.length !== 8 || dateMax.length !== 8) return 12
  const y1 = parseInt(dateMin.slice(0, 4))
  const m1 = parseInt(dateMin.slice(4, 6))
  const y2 = parseInt(dateMax.slice(0, 4))
  const m2 = parseInt(dateMax.slice(4, 6))

  if (isNaN(y1) || isNaN(m1) || isNaN(y2) || isNaN(m2)) return 12

  const months = (y2 - y1) * 12 + (m2 - m1) + 1 // inclusive
  return Math.max(1, Math.min(24, months)) // clamp 1-24
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VALIDATION HELPER — Quick check if a file looks like a valid FEC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Quick header-only validation without parsing the entire file.
 * Useful for instant feedback on drag & drop.
 */
export async function quickValidateFEC(file: File): Promise<{
  valid: boolean
  reason?: string
}> {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!ext || !['txt', 'csv', 'tsv'].includes(ext)) {
    return { valid: false, reason: `Format ".${ext}" non supporté. Utilisez un fichier .txt ou .csv.` }
  }

  // Read only the first 2KB for header check
  const slice = file.slice(0, 2048)
  const text = await new Promise<string>((resolve) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.readAsText(slice, 'UTF-8')
  })

  const firstLine = text.split(/\r?\n/)[0]?.toLowerCase() || ''
  const hasCompteNum = firstLine.includes('comptenum')
  const hasEcritureDate = firstLine.includes('ecrituredate')

  if (!hasCompteNum || !hasEcritureDate) {
    return {
      valid: false,
      reason: 'En-tête FEC non reconnu. Colonnes "CompteNum" et "EcritureDate" introuvables.',
    }
  }

  return { valid: true }
}
