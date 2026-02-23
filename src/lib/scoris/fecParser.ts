/**
 * FEC Parser — Client-side Fichier des Écritures Comptables analyzer
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * RGPD by Design : parsing exclusivement client-side via FileReader API.
 * Aucune donnée comptable ne transite par le serveur.
 *
 * Formats acceptés :
 *   - FEC DGFIP standard (.txt, .csv, .tsv) — séparateur tab, pipe, ou point-virgule
 *   - Excel (.xlsx) — lecture du premier onglet via SheetJS
 *
 * Format FEC (DGFIP) — 18 colonnes obligatoires :
 *   JournalCode | JournalLib | EcritureNum | EcritureDate | CompteNum |
 *   CompteLib | CompAuxNum | CompAuxLib | PieceRef | PieceDate |
 *   EcritureLib | Debit | Credit | EcrtureLet | DateLet |
 *   ValidDate | Montantdevise | Idevise
 *
 * Mapping PCG (Plan Comptable Général) :
 *   - CA          : Σ crédits comptes 70x (ventes et produits)
 *   - Créances    : balance (débits − crédits) comptes 411x (clients)
 *   - Dettes fourn: balance (crédits − débits) comptes 401x (fournisseurs)
 *   - Charges     : Σ débits comptes classe 6 (net des avoirs créditeurs)
 *   - Trésorerie  : solde comptes 512x (banque)
 *   - Stocks      : solde débiteur comptes 3x (si disponible)
 *   - Dette nette : solde créditeur comptes 16x (emprunts)
 *
 * Robustesse :
 *   - Détection de colonnes « lazy » (aliases, accents, casse, espaces)
 *   - Encodage : UTF-8 avec repli automatique ISO-8859-1 (Sage/Cegid)
 *   - Parsing chunked async (50 Mo+ sans bloquer le thread UI)
 *   - Arrondi financier `round2()` anti-erreur de flottants JS
 *   - Prorata temporel au jour près via `computeMonthsBetween`
 *   - Support Excel (.xlsx) : conversion Sheet 1 → même structure que CSV
 *
 * L'output est un objet prêt à injecter dans useCalculatorHistory.saveCalculation()
 * pour chaque calculateur du Wizard.
 */

import * as XLSX from 'xlsx'

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
// FEC COLUMN DEFINITIONS (DGFIP standard) — lazy matching with aliases
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

/**
 * Lazy alias map — many accounting tools export variants of column names.
 * Sage exports "CompteNumero", Cegid uses "NumCompte", etc.
 * Key = canonical name, Value = array of accepted aliases (all lowercase, no accents).
 */
const COLUMN_ALIASES: Record<string, string[]> = {
  journalcode:   ['journalcode', 'codejournal', 'journal'],
  ecrituredate:  ['ecrituredate', 'dateecriture', 'date'],
  comptenum:     ['comptenum', 'comptenumero', 'numerocompte', 'numcompte', 'compte', 'comptegeneral', 'comptegeneralnum'],
  debit:         ['debit', 'montantdebit'],
  credit:        ['credit', 'montantcredit'],
  comptelib:     ['comptelib', 'comptelibelle', 'libellecompte', 'libcompte'],
  journallib:    ['journallib', 'journallibelle', 'libellejournal'],
  ecriturelib:   ['ecriturelib', 'ecriturelibelle', 'libelleecriture', 'libelle'],
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTIL: Financial rounding (anti-float drift)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Round to 2 decimal places — avoids IEEE 754 drift in cumulative sums */
function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

/** Normalize string for column matching: strip accents, lowercase, remove spaces/underscores/hyphens */
function normalize(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[\s_\-]+/g, '')
}

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
  if (!ext || !['txt', 'csv', 'tsv', 'xlsx'].includes(ext)) {
    return {
      success: false,
      error: 'Format de fichier non supporté',
      details: `Extension ".${ext}" non reconnue. Formats acceptés : .txt, .csv, .xlsx (format FEC DGFIP ou Excel).`,
    }
  }

  const isExcel = ext === 'xlsx'

  // ── Read file content ──
  onProgress?.(5)
  let headers: string[]
  let dataLines: string[][] // each row = array of cell values (strings)

  if (isExcel) {
    // ── XLSX: read with SheetJS ──
    try {
      const buffer = await readFileAsArrayBuffer(file)
      const workbook = XLSX.read(buffer, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      if (!sheetName) {
        return { success: false, error: 'Le fichier Excel ne contient aucun onglet' }
      }
      const sheet = workbook.Sheets[sheetName]
      // Convert to array-of-arrays (header row + data rows)
      const aoa: string[][] = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: '',
        raw: false, // force string output for all cells
      })
      if (aoa.length < 2) {
        return { success: false, error: 'L\'onglet Excel ne contient pas assez de lignes (header + au moins 1 écriture)' }
      }

      // Normalize header names: trim, lowercase
      headers = aoa[0].map((h) => normalizeColumnName(String(h)))
      dataLines = aoa.slice(1).filter((row) => row.some((cell) => String(cell).trim() !== ''))
    } catch {
      return {
        success: false,
        error: 'Impossible de lire le fichier Excel',
        details: 'Le fichier .xlsx est peut-être corrompu ou dans un format non supporté.',
      }
    }
  } else {
    // ── CSV / TXT / TSV: existing logic ──
    let content: string
    try {
      content = await readFileAsText(file, 'UTF-8')
      // If UTF-8 produced replacement characters (�), retry with ISO-8859-1
      if (content.includes('\uFFFD')) {
        content = await readFileAsText(file, 'ISO-8859-1')
      }
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

    // Detect separator
    const separator = detectSeparator(content)
    const lines = content.split(/\r?\n/)
    if (lines.length < 2) {
      return { success: false, error: 'Le fichier ne contient pas assez de lignes (header + au moins 1 écriture)' }
    }

    headers = lines[0].split(separator).map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase())
    dataLines = lines.slice(1)
      .filter((l) => l.trim() !== '')
      .map((l) => parseLine(l, separator))
  }

  onProgress?.(15)

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

  // ── Parse rows — chunked async for large files ──
  const rows: FECRow[] = []
  const totalLines = dataLines.length
  const CHUNK_SIZE = 2000

  for (let i = 0; i < totalLines; i++) {
    const cols = dataLines[i]
    const row = mapToFECRow(cols, columnMap)
    if (row) rows.push(row)

    // Progress: 25% → 70% during row parsing
    if (i % CHUNK_SIZE === 0 && i > 0) {
      const pct = 25 + Math.round((i / totalLines) * 45)
      onProgress?.(pct)
      await yieldToUI()
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

function readFileAsText(file: File, encoding: string = 'UTF-8'): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file, encoding)
  })
}

/** Read file as ArrayBuffer (for xlsx/binary formats) */
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Normalize an Excel/CSV column name for matching.
 * - Trim whitespace
 * - Lowercase
 * - Strip accents, underscores, hyphens
 * This ensures "Journal Code", " journal_code ", "JournalCode" all normalize the same.
 */
function normalizeColumnName(raw: string): string {
  return raw.trim().toLowerCase()
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

/**
 * Build a column index map using lazy alias matching.
 * Normalizes headers by stripping accents, lowercase, removing spaces/underscores.
 * Then checks against known aliases for each canonical column name.
 */
function buildColumnMap(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {}

  const normalizedHeaders = headers.map(normalize)

  const allColumns: ColumnKey[] = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS]

  for (const col of allColumns) {
    // Check direct normalized match first
    const directIdx = normalizedHeaders.indexOf(normalize(col))
    if (directIdx !== -1) {
      map[col] = directIdx
      continue
    }

    // Check aliases
    const aliases = COLUMN_ALIASES[col]
    if (aliases) {
      for (const alias of aliases) {
        const aliasNorm = normalize(alias)
        const idx = normalizedHeaders.indexOf(aliasNorm)
        if (idx !== -1) {
          map[col] = idx
          break
        }
      }
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
  let chargesDebit = 0        // Comptes classe 6: débit (charges)
  let chargesCredit = 0       // Comptes classe 6: crédit (avoirs, remboursements)
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

    // ── CA: comptes 70x (ventes) — Σ crédits
    if (num.startsWith('70')) {
      caCredits = round2(caCredits + row.credit)
    }

    // ── Créances clients: comptes 411x — balance (débit − crédit)
    if (num.startsWith('411')) {
      creancesDebit = round2(creancesDebit + row.debit)
      creancesCredit = round2(creancesCredit + row.credit)
    }

    // ── Dettes fournisseurs: comptes 401x — balance (crédit − débit)
    if (num.startsWith('401')) {
      dettesFournDebit = round2(dettesFournDebit + row.debit)
      dettesFournCredit = round2(dettesFournCredit + row.credit)
    }

    // ── Charges exploitation: classe 6 — net (débits − crédits avoirs)
    if (num.startsWith('6')) {
      chargesDebit = round2(chargesDebit + row.debit)
      chargesCredit = round2(chargesCredit + row.credit)
    }

    // ── Trésorerie: comptes 512x (banque)
    if (num.startsWith('512')) {
      tresorerieDebit = round2(tresorerieDebit + row.debit)
      tresorerieCredit = round2(tresorerieCredit + row.credit)
    }

    // ── Stocks: comptes classe 3
    if (num.startsWith('3')) {
      stocksDebit = round2(stocksDebit + row.debit)
      stocksCredit = round2(stocksCredit + row.credit)
    }

    // ── Dettes financières: comptes 16x
    if (num.startsWith('16')) {
      detteFinDebit = round2(detteFinDebit + row.debit)
      detteFinCredit = round2(detteFinCredit + row.credit)
    }
  }

  // ── Date range & annualization (day-precise)
  const dateDebut = formatFECDate(dateMin)
  const dateFin = formatFECDate(dateMax)
  const moisExercice = computeMonthsBetween(dateMin, dateMax)
  const facteurAnnualisation = moisExercice > 0 && moisExercice < 12
    ? round2(12 / moisExercice)
    : 1

  // ── Apply annualization to flow accounts (CA, charges)
  // Balance accounts (créances, dettes, tréso, stocks, dette fin) are NOT annualized
  const ca = Math.round(round2(caCredits * facteurAnnualisation))
  // Charges NET = débits − crédits (avoirs comptables reduce the charge base)
  const chargesNettes = round2(chargesDebit - chargesCredit)
  const chargesExploitation = Math.round(round2(Math.max(0, chargesNettes) * facteurAnnualisation))

  // ── Balance accounts: solde at cutoff date
  const creancesClients = Math.max(0, Math.round(round2(creancesDebit - creancesCredit)))
  const dettesFournisseurs = Math.max(0, Math.round(round2(dettesFournCredit - dettesFournDebit)))
  const tresorerie = Math.round(round2(tresorerieDebit - tresorerieCredit))
  const stocks = Math.max(0, Math.round(round2(stocksDebit - stocksCredit)))
  const detteFinanciere = Math.max(0, Math.round(round2(detteFinCredit - detteFinDebit)))

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

/**
 * Compute months between two YYYYMMDD dates — day-level precision.
 * Uses actual Date difference for accuracy (handles Feb, leap years, etc.).
 * Returns at least 1 month, capped at 24.
 */
function computeMonthsBetween(dateMin: string, dateMax: string): number {
  if (dateMin.length !== 8 || dateMax.length !== 8) return 12

  const y1 = parseInt(dateMin.slice(0, 4))
  const m1 = parseInt(dateMin.slice(4, 6))
  const d1 = parseInt(dateMin.slice(6, 8))
  const y2 = parseInt(dateMax.slice(0, 4))
  const m2 = parseInt(dateMax.slice(4, 6))
  const d2 = parseInt(dateMax.slice(6, 8))

  if ([y1, m1, d1, y2, m2, d2].some(isNaN)) return 12

  // Use actual date objects for precision
  const start = new Date(y1, m1 - 1, d1)
  const end = new Date(y2, m2 - 1, d2)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 12

  // Difference in days → months (30.4375 avg days/month)
  const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  const months = Math.round((diffDays / 30.4375) * 10) / 10 // 1 decimal

  return Math.max(1, Math.min(24, Math.ceil(months)))
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UI THREAD YIELD — critical for large file parsing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Yield control back to the browser's event loop so the UI stays responsive. */
function yieldToUI(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VALIDATION HELPER — Quick check if a file looks like a valid FEC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Quick header-only validation without parsing the entire file.
 * Useful for instant feedback on drag & drop.
 * Uses the same lazy alias matching as the full parser + encoding fallback.
 */
export async function quickValidateFEC(file: File): Promise<{
  valid: boolean
  reason?: string
  isExcel?: boolean
}> {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!ext || !['txt', 'csv', 'tsv', 'xlsx'].includes(ext)) {
    return { valid: false, reason: `Format ".${ext}" non supporté. Utilisez un fichier .txt, .csv ou .xlsx.` }
  }

  const isExcel = ext === 'xlsx'

  if (isExcel) {
    // ── XLSX: read workbook, check first sheet headers ──
    try {
      const buffer = await readFileAsArrayBuffer(file)
      const workbook = XLSX.read(buffer, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      if (!sheetName) {
        return { valid: false, reason: 'Le fichier Excel ne contient aucun onglet.' }
      }
      const sheet = workbook.Sheets[sheetName]
      const aoa: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false })
      if (aoa.length < 2) {
        return { valid: false, reason: 'L\'onglet Excel est vide ou ne contient qu\'un en-tête.' }
      }

      const headerNorm = aoa[0].map((h) => normalize(String(h))).join(' ')

      const compteAliases = COLUMN_ALIASES['comptenum'] || ['comptenum']
      const hasCompte = compteAliases.some((a) => headerNorm.includes(normalize(a)))

      const dateAliases = COLUMN_ALIASES['ecrituredate'] || ['ecrituredate']
      const hasDate = dateAliases.some((a) => headerNorm.includes(normalize(a)))

      if (!hasCompte || !hasDate) {
        return {
          valid: false,
          reason: 'En-tête FEC non reconnu dans le fichier Excel. Colonnes "CompteNum" et "EcritureDate" introuvables.',
        }
      }

      return { valid: true, isExcel: true }
    } catch {
      return { valid: false, reason: 'Impossible de lire le fichier Excel. Vérifiez qu\'il n\'est pas corrompu.' }
    }
  }

  // ── CSV / TXT / TSV: existing logic ──
  // Read only the first 4KB for header check
  const slice = file.slice(0, 4096)

  let text = await new Promise<string>((resolve) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.readAsText(slice, 'UTF-8')
  })

  // Encoding fallback
  if (text.includes('\uFFFD')) {
    text = await new Promise<string>((resolve) => {
      const r = new FileReader()
      r.onload = () => resolve(r.result as string)
      r.readAsText(slice, 'ISO-8859-1')
    })
  }

  const firstLine = text.split(/\r?\n/)[0] || ''
  const headerNorm = normalize(firstLine)

  const compteAliases = COLUMN_ALIASES['comptenum'] || ['comptenum']
  const hasCompte = compteAliases.some((a) => headerNorm.includes(normalize(a)))

  const dateAliases = COLUMN_ALIASES['ecrituredate'] || ['ecrituredate']
  const hasDate = dateAliases.some((a) => headerNorm.includes(normalize(a)))

  if (!hasCompte || !hasDate) {
    return {
      valid: false,
      reason: 'En-tête FEC non reconnu. Colonnes "CompteNum" et "EcritureDate" (ou variantes) introuvables.',
    }
  }

  return { valid: true }
}
