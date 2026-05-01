import jsPDF from 'jspdf'
import {
  derivePerformanceTier,
  describeUserVsBenchmark,
  getBenchmarkTable,
  getPremiumActionPlan,
} from '@/lib/pdf/calculatorPremiumContent'

// Palette aligned with generateDiagnosticPDF.ts (navy / accent / muted)
const C = {
  navy: [15, 23, 42] as const,
  text: [51, 65, 85] as const,
  muted: [100, 116, 139] as const,
  light: [148, 163, 184] as const,
  border: [226, 232, 240] as const,
  bg: [248, 250, 252] as const,
  accent: [0, 82, 204] as const,
  green: [16, 185, 129] as const,
  amber: [217, 119, 6] as const,
  red: [220, 38, 38] as const,
  white: [255, 255, 255] as const,
} as const

type RGB = readonly [number, number, number]
function rgb(c: RGB) {
  return c as unknown as [number, number, number]
}

function clean(text: string): string {
  return text
    .replace(/\u00A0/g, ' ')
    .replace(/\u202F/g, ' ')
    .replace(/[\u2000-\u200B]/g, ' ')
    .trim()
}

function wrapText(pdf: jsPDF, text: string, maxWidth: number): string[] {
  return pdf.splitTextToSize(clean(text), maxWidth)
}

function levelColor(level?: string): RGB {
  const l = (level || '').toLowerCase()
  if (l.includes('crit') || l.includes('danger') || l.includes('rouge')) return C.red
  if (l.includes('vigil') || l.includes('surveill') || l.includes('orange') || l.includes('attention')) return C.amber
  if (l.includes('excellent') || l.includes('vert') || l.includes('sain') || l.includes('solide') || l.includes('bon')) return C.green
  return C.accent
}

function stringifyVal(v: unknown): string {
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  if (typeof v === 'boolean') return v ? 'oui' : 'non'
  try {
    return JSON.stringify(v)
  } catch {
    return String(v)
  }
}

export type CalculatorPDFCalculatorType =
  | 'dso'
  | 'bfr'
  | 'roi'
  | 'marge'
  | 'seuil-rentabilite'
  | 'ebitda'
  | 'cac-ltv'
  | 'burn-rate'
  | 'valorisation'

const CALC_DISPLAY: Record<CalculatorPDFCalculatorType, string> = {
  dso: 'DSO',
  bfr: 'BFR',
  roi: 'ROI',
  marge: 'Marge',
  'seuil-rentabilite': 'Seuil de rentabilité',
  ebitda: 'EBITDA',
  'cac-ltv': 'CAC / LTV',
  'burn-rate': 'Burn rate',
  valorisation: 'Valorisation',
}

export interface GenerateCalculatorPDFParams {
  calculatorType: CalculatorPDFCalculatorType
  calculatorName?: string
  email: string
  result: Record<string, unknown>
  inputs: Record<string, unknown>
  generatedAtIso?: string
  /** Pages 2–3 : plan d’action + benchmark sectoriel */
  isPremium?: boolean
}

/**
 * Returns base64 PDF content (without data: URI prefix).
 */
export function generateCalculatorPDF(params: GenerateCalculatorPDFParams): string {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const W = pdf.internal.pageSize.getWidth()
  const H = pdf.internal.pageSize.getHeight()
  const M = 18
  const CW = W - 2 * M

  const title = params.calculatorName || CALC_DISPLAY[params.calculatorType]
  const when = params.generatedAtIso || new Date().toISOString()
  const printed = new Date(when).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })

  const niveau = typeof params.result.niveau === 'string' ? params.result.niveau : undefined
  const interpretationLines: string[] = Array.isArray(params.result.interpretationLines)
    ? (params.result.interpretationLines as unknown[]).map((x) => clean(String(x))).filter(Boolean)
    : typeof params.result.interpretationText === 'string'
      ? wrapText(pdf, String(params.result.interpretationText), CW)
      : []

  const summary = Array.isArray(params.result.summary)
    ? (params.result.summary as { label: string; value: string }[])
    : []

  // Header bar
  pdf.setFillColor(...rgb(C.accent))
  pdf.rect(0, 0, W, 3, 'F')

  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.navy))
  pdf.setFontSize(16)
  pdf.text(`Rapport FinSight™ — ${title}`, M, 22)

  if (params.isPremium) {
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8)
    pdf.setTextColor(...rgb(C.accent))
    pdf.text('PREMIUM', W - M - 22, 22)
  }

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9.5)
  pdf.setTextColor(...rgb(C.muted))
  pdf.text(`Date : ${printed}`, M, 30)
  pdf.text(`Email : ${clean(params.email)}`, M, 36)

  pdf.setDrawColor(...rgb(C.border))
  pdf.setLineWidth(0.3)
  pdf.line(M, 40, W - M, 40)

  let y = 48

  // Results
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(...rgb(C.accent))
  pdf.text('Résultats', M, y)
  y += 8

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(...rgb(C.text))

  if (summary.length) {
    for (const row of summary.slice(0, 8)) {
      const line = `${clean(row.label)} : ${clean(row.value)}`
      const lines = wrapText(pdf, line, CW)
      for (const l of lines) {
        pdf.text(l, M, y)
        y += 5.2
        if (y > H - 52) break
      }
      if (y > H - 52) break
    }
  } else {
    // Fallback: flatten result (excluding meta keys)
    const skip = new Set(['summary', 'interpretationLines', 'interpretationText', 'message', 'titre'])
    for (const [k, v] of Object.entries(params.result)) {
      if (skip.has(k)) continue
      const line = `${k} : ${stringifyVal(v)}`
      for (const l of wrapText(pdf, line, CW)) {
        pdf.text(l, M, y)
        y += 5.2
        if (y > H - 52) break
      }
      if (y > H - 52) break
    }
  }

  y += 4
  pdf.setDrawColor(...rgb(C.border))
  pdf.line(M, y, W - M, y)
  y += 8

  // Interpretation
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(...rgb(C.accent))
  pdf.text('Interprétation', M, y)
  y += 8

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  const interpColor = levelColor(niveau)
  pdf.setTextColor(...rgb(interpColor))

  const linesToPrint =
    interpretationLines.length > 0
      ? interpretationLines.slice(0, 3)
      : typeof params.result.message === 'string'
        ? wrapText(pdf, String(params.result.message), CW).slice(0, 3)
        : ['Analyse indicative à partir des données saisies.']

  for (const line of linesToPrint) {
    for (const l of wrapText(pdf, line, CW)) {
      pdf.text(l, M, y)
      y += 5.2
    }
  }

  y += 6
  pdf.setDrawColor(...rgb(C.border))
  pdf.line(M, y, W - M, y)
  y += 8

  // Next step
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(...rgb(C.accent))
  pdf.text('Prochaine étape', M, y)
  y += 8

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(...rgb(C.text))
  const next =
    'Votre Score FinSight™ agrège tous vos indicateurs → finsight.zineinsight.com/mon-diagnostic'
  for (const l of wrapText(pdf, next, CW)) {
    pdf.text(l, M, y)
    y += 5.2
  }

  // Footer band
  const footerY = H - 16
  pdf.setFillColor(...rgb(C.bg))
  pdf.rect(0, footerY - 6, W, 22, 'F')
  pdf.setDrawColor(...rgb(C.border))
  pdf.setLineWidth(0.3)
  pdf.line(0, footerY - 6, W, footerY - 6)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(...rgb(C.muted))
  pdf.text('FinSight by ZineInsight — finsight.zineinsight.com', M, footerY + 2)

  if (params.isPremium) {
    const tier = derivePerformanceTier(params.calculatorType, params.result)
    const actions = getPremiumActionPlan(params.calculatorType, tier)
    const bench = getBenchmarkTable(params.calculatorType)
    const positionLine = describeUserVsBenchmark(params.calculatorType, params.result, params.inputs)

    const addPremiumPageHeader = (pageTitle: string) => {
      pdf.setFillColor(...rgb(C.accent))
      pdf.rect(0, 0, W, 3, 'F')
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...rgb(C.navy))
      pdf.setFontSize(14)
      pdf.text(pageTitle, M, 20)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8.5)
      pdf.setTextColor(...rgb(C.muted))
      pdf.text(`${title} · ${clean(params.email)}`, M, 28)
      pdf.setDrawColor(...rgb(C.border))
      pdf.setLineWidth(0.3)
      pdf.line(M, 32, W - M, 32)
    }

    const addPremiumFooter = (pageLabel: string) => {
      const fy = H - 14
      pdf.setDrawColor(...rgb(C.border))
      pdf.line(M, fy - 4, W - M, fy - 4)
      pdf.setFontSize(7.5)
      pdf.setTextColor(...rgb(C.muted))
      pdf.setFont('helvetica', 'normal')
      pdf.text('FinSight™ Rapport Premium — Document indicatif (non audité)', M, fy)
      pdf.text(pageLabel, W - M, fy, { align: 'right' })
    }

    // —— Page 2 : Plan d’action 90 jours ——
    pdf.addPage()
    addPremiumPageHeader('Plan d’action 90 jours')
    let y2 = 40
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9.5)
    pdf.setTextColor(...rgb(C.text))
    const tierLabel = tier === 'bon' ? 'Bon' : tier === 'moyen' ? 'Moyen / à optimiser' : 'Critique'
    pdf.text(`Niveau détecté (heuristique) : ${tierLabel}`, M, y2)
    y2 += 10

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    pdf.setTextColor(...rgb(C.accent))
    pdf.text('5 recommandations prioritaires', M, y2)
    y2 += 8
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(...rgb(C.text))
    for (let idx = 0; idx < actions.length; idx++) {
      const bullet = `${idx + 1}. ${clean(actions[idx])}`
      for (const l of wrapText(pdf, bullet, CW)) {
        pdf.text(l, M, y2)
        y2 += 5.4
        if (y2 > H - 28) break
      }
      if (y2 > H - 28) {
        pdf.text('…', M, y2)
        break
      }
      y2 += 2
    }
    addPremiumFooter('Page 2 / 3')

    // —— Page 3 : Benchmark sectoriel ——
    pdf.addPage()
    addPremiumPageHeader('Benchmark sectoriel')
    let y3 = 40
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(...rgb(C.text))
    for (const l of wrapText(
      pdf,
      'Repères indicatifs (marché large) pour Services, Industrie et Commerce. À utiliser comme grille de lecture, pas comme norme comptable.',
      CW,
    )) {
      pdf.text(l, M, y3)
      y3 += 4.8
    }
    y3 += 6

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.setTextColor(...rgb(C.accent))
    pdf.text('Synthèse positionnement', M, y3)
    y3 += 7
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9.5)
    pdf.setTextColor(...rgb(C.text))
    for (const l of wrapText(pdf, positionLine, CW)) {
      pdf.text(l, M, y3)
      y3 += 5
    }
    y3 += 8

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.setTextColor(...rgb(C.accent))
    pdf.text('Moyennes sectorielles (indicatif)', M, y3)
    y3 += 8

    const colW = CW / 4
    const headers = ['Indicateur', 'Services', 'Industrie', 'Commerce']
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8.5)
    pdf.setTextColor(...rgb(C.navy))
    headers.forEach((h, i) => {
      pdf.text(h, M + i * colW, y3, { maxWidth: colW - 2 })
    })
    y3 += 6
    pdf.setDrawColor(...rgb(C.border))
    pdf.line(M, y3, W - M, y3)
    y3 += 5

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8.5)
    pdf.setTextColor(...rgb(C.text))
    for (const row of bench) {
      const cells = [row.label, row.services, row.industrie, row.commerce]
      let rowH = 6
      for (let i = 0; i < cells.length; i++) {
        const lines = wrapText(pdf, clean(cells[i]), colW - 2)
        rowH = Math.max(rowH, lines.length * 4.2)
        for (let li = 0; li < lines.length; li++) {
          pdf.text(lines[li], M + i * colW, y3 + li * 4.2)
        }
      }
      y3 += rowH + 2
      if (y3 > H - 30) break
    }

    addPremiumFooter('Page 3 / 3')
  }

  const dataUri = pdf.output('datauristring') as string
  const base64 = dataUri.split(',')[1] || ''
  return base64
}
