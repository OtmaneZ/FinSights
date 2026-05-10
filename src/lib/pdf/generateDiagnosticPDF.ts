/**
 * DIAGNOSTIC PDF GENERATOR — Executive Edition v3.0
 *
 * Generates an 8-page (Standard) or 12-page (Stratégique) A4 portrait consulting-grade report.
 * Pure jsPDF — no DOM capture, no html2canvas dependency.
 *
 * Page 1: Couverture
 * Page 2: Table des matières
 * Page 3: Synthèse executive (score + piliers + signaux clés)
 * Page 4: Analyse narrative par pilier + radar
 * Page 5: Priorités d'action + Cash Impact Pareto
 * Page 6: Pack banquier (Q/R)
 * Page 7: Comparaison sectorielle + Radars J+30
 * [Stratégique] Page 8: Z-Score Altman — Page 9: SWOT — Page 10: Positionnement — Page 11: Valorisation
 * Dernière page: Méthodologie + Legal disclaimer
 *
 * Design: Big Four audit aesthetic — navy/white, minimal, impactful.
 * Footer: "Document confidentiel" + "Powered by SCORIS™ v1" on every page.
 */

import jsPDF from 'jspdf'
import {
  type DiagnosticScore,
  type SectorKey,
  type Insight,
  SECTOR_BENCHMARKS,
  LEVEL_CONFIG,
  estimateCA,
  computeZScoreBreakdownFromInputs,
} from '@/lib/scoring/diagnosticScore'
import type { Calculation, CalculatorType } from '@/hooks/useCalculatorHistory'
import type {
  ScoreContext,
  RecommendationPlan,
  OpusPriority,
  StrategiqueContextPayload,
} from '@/lib/opus-engine'

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  navy:     [15, 23, 42]   as const,    // #0f172a
  dark:     [37, 99, 235]  as const,    // #2563eb
  text:     [51, 65, 85]   as const,    // #334155
  muted:    [71, 85, 105]  as const,    // #475569
  light:    [148, 163, 184] as const,
  border:   [226, 232, 240] as const,
  bg:       [248, 250, 252] as const,
  bgWarm:   [241, 245, 249] as const,
  accent:   [37, 99, 235]   as const,   // #2563eb
  green:    [22, 163, 74]   as const,   // #16a34a
  amber:    [234, 88, 12]   as const,   // #ea580c
  red:      [220, 38, 38]   as const,   // #dc2626
  white:    [255, 255, 255] as const,
} as const

type RGB = readonly [number, number, number]

/** Pastels SWOT (jsPDF fill) */
const SWOT_FAIB: RGB = [254, 226, 226] as const
const SWOT_OPP: RGB = [219, 234, 254] as const
const SWOT_MEN: RGB = [255, 237, 213] as const

// ─── Helpers ────────────────────────────────────────────────────────────────

function rgb(c: RGB) { return c as unknown as [number, number, number] }

function clean(text: string): string {
  return text
    .replace(/\u00A0/g, ' ')
    .replace(/\u202F/g, ' ')
    .replace(/[\u2000-\u200B]/g, ' ')
    .trim()
}

function fmt(n: number): string {
  return n.toLocaleString('fr-FR')
}

function wrapText(pdf: jsPDF, text: string, maxWidth: number): string[] {
  return pdf.splitTextToSize(clean(text), maxWidth)
}

const TYPO = {
  sectionTitle: 15,
  subtitle: 11.5,
  body: 9.5,
  note: 8,
  lineBody: 5.2,
  lineOpus: 5.8,
} as const

function ensureSpace(
  pdf: jsPDF, y: number, needed: number,
  margin: number, pageH: number, footerH: number,
  onNewPage: () => void,
): number {
  if (y + needed > pageH - margin - footerH) {
    onNewPage()
    pdf.addPage()
    addPageHeader(pdf, margin)
    return margin + 18
  }
  return y
}

function addPageHeader(pdf: jsPDF, margin: number, companyName = 'Entreprise', dateStr = '') {
  const w = pdf.internal.pageSize.getWidth()
  pdf.setFontSize(8)
  pdf.setTextColor(...rgb(C.navy))
  pdf.setFont('helvetica', 'bold')
  pdf.text('FinSight', margin, 10)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...rgb(C.muted))
  pdf.text(`Confidentiel — ${clean(companyName)} — ${dateStr}`, w - margin, 10, { align: 'right' })
  pdf.setDrawColor(...rgb(C.border))
  pdf.setLineWidth(0.3)
  pdf.line(margin, 13, w - margin, 13)
}

function addPageFooter(pdf: jsPDF, margin: number, pageNum: number, totalPages: number, sectionName: string) {
  const w = pdf.internal.pageSize.getWidth()
  const h = pdf.internal.pageSize.getHeight()
  pdf.setDrawColor(...rgb(C.border))
  pdf.setLineWidth(0.3)
  pdf.line(margin, h - 15, w - margin, h - 15)
  pdf.setFontSize(7)
  pdf.setTextColor(...rgb(C.muted))
  pdf.setFont('helvetica', 'normal')
  pdf.text(clean(sectionName), margin, h - 10)
  pdf.text(`${pageNum} / ${totalPages}`, w / 2, h - 10, { align: 'center' })
  pdf.text('Powered by SCORIS™', w - margin, h - 10, { align: 'right' })
}

function sectionTitle(pdf: jsPDF, text: string, x: number, y: number): number {
  pdf.setFontSize(TYPO.sectionTitle)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.navy))
  pdf.text(clean(text.toUpperCase()), x, y)
  return y + 12
}

/** Freemium — fond #e2e8f0, CTA vers le rapport complet */
const LOCK_FILL: RGB = [226, 232, 240]

/** Pas d'emoji : Helvetica/jsPDF ne les encode pas → mojibake (ex. Ø=Ý) dans le PDF */
const LOCK_PREFIX = '[Verrouille] '
const LOCK_CTA = 'Obtenir le rapport complet sur finsight.zineinsight.com'

const LOCK_PAD_T = 7
const LOCK_PAD_B = 8
const LOCK_GAP_HEAD_CTA = 5
const LOCK_LH_HEAD = 4.25
const LOCK_LH_CTA = 4

function measureLockedBlockHeight(pdf: jsPDF, contentWidth: number, headline: string): number {
  pdf.setFontSize(8.5)
  pdf.setFont('helvetica', 'bold')
  const headLines = wrapText(pdf, `${LOCK_PREFIX}${clean(headline)}`, contentWidth - 10)
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'normal')
  const ctaLines = wrapText(pdf, LOCK_CTA, contentWidth - 10)
  return (
    LOCK_PAD_T +
    headLines.length * LOCK_LH_HEAD +
    LOCK_GAP_HEAD_CTA +
    ctaLines.length * LOCK_LH_CTA +
    LOCK_PAD_B
  )
}

/** Dessine le bloc gris ; la hauteur suit le texte (plus de troncature). Retourne la hauteur utilisée (mm). */
function drawLockedContentBlock(
  pdf: jsPDF,
  x: number,
  y: number,
  w: number,
  headline: string,
): number {
  pdf.setFontSize(8.5)
  pdf.setFont('helvetica', 'bold')
  const headLines = wrapText(pdf, `${LOCK_PREFIX}${clean(headline)}`, w - 10)
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'normal')
  const ctaLines = wrapText(pdf, LOCK_CTA, w - 10)

  const h = Math.max(
    26,
    LOCK_PAD_T +
      headLines.length * LOCK_LH_HEAD +
      LOCK_GAP_HEAD_CTA +
      ctaLines.length * LOCK_LH_CTA +
      LOCK_PAD_B,
  )

  pdf.setFillColor(...rgb(LOCK_FILL))
  pdf.roundedRect(x, y, w, h, 2, 2, 'F')
  pdf.setDrawColor(...rgb(C.border))
  pdf.setLineWidth(0.3)
  pdf.roundedRect(x, y, w, h, 2, 2, 'S')

  let ly = y + LOCK_PAD_T
  pdf.setFontSize(8.5)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.navy))
  headLines.forEach((line) => {
    pdf.text(line, x + 5, ly)
    ly += LOCK_LH_HEAD
  })
  ly += 1
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...rgb(C.muted))
  ctaLines.forEach((line) => {
    pdf.text(line, x + 5, ly)
    ly += LOCK_LH_CTA
  })

  return h
}

function getCalc(history: Calculation[], type: CalculatorType): Calculation | undefined {
  return history.find(c => c.type === type)
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DiagnosticPDFData {
  diagnostic: DiagnosticScore
  insights: Insight
  sector: SectorKey
  history: Calculation[]
  companyName?: string
  fileName?: string
  fecMeta?: {
    source: string
    fileName: string
    nbEcritures: number
    dateDebut: string
    dateFin: string
    dataQuality: number
  } | null
  completedCount: number
  totalCalculators: number
  /** false = version gratuite partielle ; undefined/true = rapport complet */
  isPremium?: boolean
  /** Standard = 8 pages · Stratégique = 12 pages */
  scorisLevel?: 'standard' | 'strategique'
  /** Données wizard stratégique — requis si scorisLevel === 'strategique' */
  strategique?: StrategiqueContextPayload
}

// ─── Opus plan fetcher (client-side → /api/diagnostic/opus-plan) ─────────────

async function fetchOpusPlan(data: DiagnosticPDFData): Promise<RecommendationPlan | null> {
  try {
    const bench = SECTOR_BENCHMARKS[data.sector]
    const get = (t: CalculatorType) => data.history.find(c => c.type === t)
    const dso = get('dso')
    const bfr = get('bfr')
    const marge = get('marge')
    const ebitda = get('ebitda')
    const caAnnuel = estimateCA((t: CalculatorType) => get(t))

    const context: ScoreContext = {
      score: data.diagnostic.total ?? 0,
      pillars: {
        cash: data.diagnostic.pillars.cash.score ?? 0,
        margin: data.diagnostic.pillars.margin.score ?? 0,
        resilience: data.diagnostic.pillars.resilience.score ?? 0,
        risk: data.diagnostic.pillars.risk.score ?? 0,
      },
      sector: data.sector,
      companyName: data.companyName,
      caAnnuel: caAnnuel ?? undefined,
      indicators: {
        dso: dso?.value,
        dsoMedian: bench.dsoMedian,
        bfrJours: bfr && caAnnuel && caAnnuel > 0
          ? Math.round((bfr.value / caAnnuel) * 365)
          : undefined,
        bfrJoursMedian: bench.bfrJoursMedian,
        marge: marge?.value,
        margeMedian: bench.margeMedian,
        ebitdaPct: ebitda && caAnnuel && caAnnuel > 0
          ? Math.round((ebitda.value / caAnnuel) * 100)
          : undefined,
        ebitdaMedian: bench.ebitdaMedian,
      },
      forces: data.insights.forces ?? [],
      vulnerabilites: data.insights.vulnerabilites ?? [],
      prioriteScorisFallback: data.insights.priorite ?? undefined,
      ...(data.scorisLevel === 'strategique' && data.strategique
        ? { strategique: data.strategique }
        : {}),
    }

    const res = await fetch('/api/diagnostic/opus-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, mode: 'full' }),
    })

    if (!res.ok) return null
    const json = await res.json()
    return json.plan ?? null

  } catch {
    // Non-bloquant — le PDF sera généré avec le fallback
    return null
  }
}

// ─── Main Generator ─────────────────────────────────────────────────────────

export async function generateDiagnosticPDF(data: DiagnosticPDFData): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const W = pdf.internal.pageSize.getWidth()
  const H = pdf.internal.pageSize.getHeight()
  const M = 20
  const CW = W - 2 * M
  const FOOTER_H = 18
  const isStrategicPdf = data.scorisLevel === 'strategique' && !!data.strategique
  const totalPages = isStrategicPdf ? 12 : 8

  const isPremium = data.isPremium !== false

  const bench = SECTOR_BENCHMARKS[data.sector]
  const get = (t: CalculatorType) => getCalc(data.history, t)
  const dso = get('dso')
  const bfr = get('bfr')
  const marge = get('marge')
  const ebitda = get('ebitda')
  const seuil = get('seuil-rentabilite')
  const caAnnuel = estimateCA((t: CalculatorType) => get(t))
  const displayName = data.companyName || data.fileName || 'Mon Entreprise'
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  // Pre-compute cash impact
  let cashImpactAmount = 0
  let cashGapJours = 0
  if (dso && dso.value > bench.dsoMedian && caAnnuel && caAnnuel > 0) {
    cashGapJours = dso.value - bench.dsoMedian
    cashImpactAmount = Math.round((cashGapJours / 365) * caAnnuel)
  }

  // ── Fetch Opus plan avant de commencer le rendu (non-bloquant si indisponible) ──
  const opusPlan = await fetchOpusPlan(data)

  let currentSection = 'Couverture'
  let pageNum = 1
  const footer = () => { addPageFooter(pdf, M, pageNum, totalPages, currentSection) }

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 1 — COUVERTURE
  // ═══════════════════════════════════════════════════════════════════════════
  const coverLevelColor: RGB = data.diagnostic.total !== null
    ? data.diagnostic.total >= 75 ? C.green : data.diagnostic.total >= 55 ? C.accent : data.diagnostic.total >= 35 ? C.amber : C.red
    : C.amber

  pdf.setFillColor(...rgb(coverLevelColor))
  pdf.rect(0, 0, 20, H, 'F')
  pdf.setFillColor(...rgb(C.accent))
  pdf.rect(20, 0, W - 20, 3, 'F')

  pdf.setFontSize(28)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.navy))
  pdf.text('FinSight', M + 8, 40)

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...rgb(C.muted))
  pdf.text('Intelligence Financiere Augmentee', M + 8, 48)

  pdf.setDrawColor(...rgb(C.accent))
  pdf.setLineWidth(0.8)
  pdf.line(M + 8, 58, M + 48, 58)

  pdf.setFontSize(32)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.navy))
  pdf.text('Diagnostic de', M + 8, 90)
  pdf.text('Performance Financiere', M + 8, 103)

  if (isStrategicPdf) {
    pdf.setFillColor(...rgb(C.accent))
    pdf.roundedRect(M + 8, 108, 64, 11, 2, 2, 'F')
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...rgb(C.white))
    pdf.text('SCORIS STRATEGIQUE', M + 12, 115.5)
  }

  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...rgb(C.text))
  pdf.text(clean(displayName), M + 8, 125)

  const scoreValCover = data.diagnostic.total !== null ? `${data.diagnostic.total}/100` : '--/100'
  pdf.setFontSize(26)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(coverLevelColor))
  pdf.text(scoreValCover, M + 8, 140)
  pdf.setFontSize(10)
  pdf.setTextColor(...rgb(C.muted))
  pdf.text(clean(LEVEL_CONFIG[data.diagnostic.level].label), M + 8, 147)

  const metaY = isStrategicPdf ? 158 : 150
  pdf.setFontSize(9)
  pdf.setTextColor(...rgb(C.muted))
  const metaLines = [
    `Date du rapport : ${dateStr}`,
    `Secteur d'analyse : ${bench.label}`,
    `Indicateurs analyses : ${data.completedCount} / ${data.totalCalculators}`,
    'Moteur : SCORIS v1',
  ]
  if (data.fecMeta) {
    metaLines.push(`Source : FEC (${fmt(data.fecMeta.nbEcritures)} ecritures)`)
  }
  metaLines.forEach((line, i) => { pdf.text(clean(line), M + 8, metaY + i * 7) })

  pdf.setFillColor(...rgb(C.navy))
  pdf.rect(0, H - 30, W, 30, 'F')
  pdf.setFontSize(8)
  pdf.setTextColor(...rgb(C.white))
  pdf.text('Document confidentiel', M + 8, H - 18)
  pdf.setFontSize(7)
  pdf.text('Powered by SCORIS v1', M + 8, H - 12)
  pdf.text('finsight.zineinsight.com', W - M, H - 12, { align: 'right' })
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'italic')
  pdf.setTextColor(...rgb(C.light))
  pdf.text('Rapport confidentiel — Usage exclusif du dirigeant', M + 8, H - 6)
  addPageFooter(pdf, M, pageNum, totalPages, currentSection)

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 2 — TABLE DES MATIÈRES
  // ═══════════════════════════════════════════════════════════════════════════
  pdf.addPage()
  pageNum = 2
  currentSection = 'Table des matières'
  addPageHeader(pdf, M, displayName, dateStr)
  let y = M + 18
  y = sectionTitle(pdf, 'TABLE DES MATIERES', M, y)
  const toc = isStrategicPdf
    ? [
        ['Couverture', '1'],
        ['Table des matières', '2'],
        ['Synthèse executive', '3'],
        ['Analyse par pilier', '4'],
        ['Priorités d’action', '5'],
        ['Pack banquier', '6'],
        ['Benchmark et radars J+30', '7'],
        ['Z-Score Altman', '8'],
        ['Analyse SWOT', '9'],
        ['Positionnement stratégique', '10'],
        ['Valorisation & financement', '11'],
        ['Méthodologie et disclaimer', '12'],
      ]
    : [
        ['Couverture', '1'],
        ['Table des matières', '2'],
        ['Synthèse executive', '3'],
        ['Analyse par pilier', '4'],
        ['Priorités d’action', '5'],
        ['Pack banquier', '6'],
        ['Benchmark et radars J+30', '7'],
        ['Méthodologie et disclaimer', '8'],
      ]
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(TYPO.subtitle)
  pdf.setTextColor(...rgb(C.text))
  toc.forEach(([label, p]) => {
    pdf.text(clean(label), M, y)
    pdf.text(`........ ${p}`, W - M, y, { align: 'right' })
    y += 10
  })
  addPageFooter(pdf, M, pageNum, totalPages, currentSection)

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 3 — EXECUTIVE SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════
  pdf.addPage()
  pageNum = 3
  currentSection = 'Synthèse executive'
  addPageHeader(pdf, M, displayName, dateStr)
  y = M + 18

  y = sectionTitle(pdf, 'SYNTHESE EXECUTIVE', M, y)

  const levelCfg = LEVEL_CONFIG[data.diagnostic.level]
  const scoreColor: RGB = data.diagnostic.level === 'excellent' || data.diagnostic.level === 'bon'
    ? C.green
    : data.diagnostic.level === 'vigilance' ? C.amber : C.red

  pdf.setFillColor(...rgb(C.bg))
  pdf.roundedRect(M, y, CW, 45, 3, 3, 'F')
  pdf.setDrawColor(...rgb(C.border))
  pdf.setLineWidth(0.3)
  pdf.roundedRect(M, y, CW, 45, 3, 3, 'S')

  const scoreVal = data.diagnostic.total !== null ? `${data.diagnostic.total}` : '--'
  pdf.setFontSize(48)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(scoreColor))
  pdf.text(scoreVal, M + 15, y + 32)
  pdf.setFontSize(16)
  pdf.setTextColor(...rgb(C.light))
  pdf.text('/ 100', M + 55, y + 32)

  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(scoreColor))
  pdf.text(clean(levelCfg.label), M + 90, y + 20)

  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...rgb(C.muted))
  pdf.text(`Indice de confiance : ${data.diagnostic.confidence}`, M + 90, y + 30)
  pdf.text(`${data.diagnostic.completedPillars}/4 piliers completes`, M + 90, y + 37)

  y += 55

  // DAF Virtuel synthesis
  if (data.diagnostic.total !== null) {
    const synthText = opusPlan?.executiveSummary?.trim()
      ? opusPlan.executiveSummary.trim()
      : data.diagnostic.total >= 75
      ? 'Situation financiere solide avec des fondamentaux sains. Axes d\'optimisation identifies pour renforcer la trajectoire.'
      : data.diagnostic.total >= 50
      ? 'Situation intermediaire avec des leviers d\'amelioration significatifs. Un plan d\'action cible permettrait de gagner 10 a 20 points.'
      : 'Situation tendue necessitant une attention immediate sur les fondamentaux cash et marges. Intervention recommandee sous 30 jours.'

    pdf.setFontSize(TYPO.body)
    pdf.setFont('helvetica', 'italic')
    pdf.setTextColor(...rgb(C.text))
    const synthLines = wrapText(pdf, `"${synthText}"`, CW - 10)
    synthLines.forEach((line, i) => { pdf.text(line, M + 5, y + i * TYPO.lineOpus) })
    y += synthLines.length * TYPO.lineOpus + 6

    pdf.setFontSize(7)
    pdf.setTextColor(...rgb(C.light))
    pdf.text('-- DAF Virtuel FinSight', M + 5, y)
    y += 12
  }

  // ── 4 Pillars ──
  y = sectionTitle(pdf, 'PERFORMANCE PAR PILIER', M, y)

  const pillarOrder = [
    { key: 'cash', label: 'Tresorerie & Cash' },
    { key: 'margin', label: 'Rentabilite & Marges' },
    { key: 'resilience', label: 'Resilience & Croissance' },
    { key: 'risk', label: 'Risques & Anomalies' },
  ]

  const pW = (CW - 6) / 2
  const pH = 32

  pillarOrder.forEach((p, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const px = M + col * (pW + 6)
    const py = y + row * (pH + 6)
    const pillar = data.diagnostic.pillars[p.key as keyof typeof data.diagnostic.pillars]

    pdf.setFillColor(...rgb(C.white))
    pdf.roundedRect(px, py, pW, pH, 2, 2, 'F')
    pdf.setDrawColor(...rgb(C.border))
    pdf.setLineWidth(0.3)
    pdf.roundedRect(px, py, pW, pH, 2, 2, 'S')

    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...rgb(C.dark))
    pdf.text(clean(p.label), px + 5, py + 9)

    if (pillar.score !== null) {
      const barX = px + 5, barY = py + 14, barW = pW - 10, barH = 4
      pdf.setFillColor(...rgb(C.bg))
      pdf.roundedRect(barX, barY, barW, barH, 1, 1, 'F')
      const pct = Math.min(pillar.score / 25, 1)
      const fill: RGB = pct >= 0.7 ? C.green : pct >= 0.4 ? C.amber : C.red
      pdf.setFillColor(...rgb(fill))
      pdf.roundedRect(barX, barY, barW * pct, barH, 1, 1, 'F')

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...rgb(fill))
      pdf.text(`${pillar.score}/25`, px + 5, py + 28)

      const done = pillar.calculators.filter(c => c.done).length
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...rgb(C.muted))
      pdf.text(`${done} indicateur${done > 1 ? 's' : ''}`, px + pW - 5, py + 28, { align: 'right' })
    } else {
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'italic')
      pdf.setTextColor(...rgb(C.light))
      pdf.text('Donnees insuffisantes', px + 5, py + 22)
    }
  })

  y += 2 * (pH + 6) + 4

  // ── Signaux clés ──
  y = ensureSpace(pdf, y, 40, M, H, FOOTER_H, footer)
  const forces = data.insights.forces.slice(0, 3)
  const vulns = data.insights.vulnerabilites.slice(0, 3)

  if (forces.length > 0 || vulns.length > 0) {
    y = sectionTitle(pdf, 'SIGNAUX CLES', M, y)

    const renderList = (items: string[], startY: number, color: RGB, bullet: string): number => {
      let cy = startY
      items.forEach(text => {
        cy = ensureSpace(pdf, cy, 12, M, H, FOOTER_H, footer)
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(...rgb(color))
        pdf.text(bullet, M + 2, cy)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(...rgb(C.dark))
        wrapText(pdf, text, CW - 12).forEach(line => { pdf.text(line, M + 8, cy); cy += 4.5 })
        cy += 2
      })
      return cy
    }

    if (forces.length > 0) {
      pdf.setFontSize(7); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...rgb(C.green))
      pdf.text('FORCES', M + 2, y); y += 5
      y = renderList(forces, y, C.green, '+'); y += 3
    }
    if (vulns.length > 0) {
      pdf.setFontSize(7); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...rgb(C.red))
      pdf.text('VULNERABILITES', M + 2, y); y += 5
      y = renderList(vulns, y, C.red, '!')
    }
  }

  footer()

  // Prepare Opus enriched blocks with robust local fallback
  const narrativeParPilier = opusPlan?.narrativeParPilier ?? {
    cash: data.insights.forces[0] ?? 'Le pilier CASH nécessite une lecture complémentaire avec vos flux d\'encaissement et décaissement.',
    margin: data.insights.vulnerabilites[0] ?? 'Le pilier MARGIN doit être consolidé par un suivi de la marge et des coûts variables.',
    resilience: data.insights.priorite ?? 'Le pilier RÉSILIENCE demande un renforcement progressif des marges de manœuvre.',
    risques: data.insights.vulnerabilites[1] ?? 'Le pilier RISQUES est piloté via la surveillance des signaux croisés.',
  }

  const weakestPillars = Object.entries(data.diagnostic.pillars)
    .sort(([, a], [, b]) => (a.score ?? 99) - (b.score ?? 99))
    .map(([k]) => k)

  const packBanquier = opusPlan?.packBanquier?.length
    ? opusPlan.packBanquier
    : [
        {
          question: 'Quelle est votre trajectoire de trésorerie sur les 90 prochains jours ?',
          reponse: `Nous pilotons un plan trimestriel avec un suivi des écarts au benchmark ${bench.label}.`,
        },
        {
          question: 'Quels leviers activez-vous pour sécuriser la rentabilité ?',
          reponse: `Nos actions priorisent la marge opérationnelle et la discipline de coûts sur les postes les plus volatils.`,
        },
        {
          question: 'Quels indicateurs vous alerteront en premier en cas de dérive ?',
          reponse: 'Nous suivons DSO, BFR, marge et score de risque avec déclenchement d’actions correctives immédiates.',
        },
      ]

  const radarFallback: Array<{ signal: string; seuil: string; action: string }> = weakestPillars.slice(0, 2).map((pillar) => {
    if (pillar === 'cash') {
      return {
        signal: 'Ralentissement des encaissements clients',
        seuil: `Si DSO > ${bench.dsoMedian + 10}j`,
        action: 'Renforcer les relances et contractualiser des acomptes sous 7 jours.',
      }
    }
    if (pillar === 'margin') {
      return {
        signal: 'Dégradation de la marge brute',
        seuil: `Si marge < ${Math.max(0, bench.margeMedian - 5)}%`,
        action: 'Réviser prix/mix offre et réduire les coûts variables non essentiels.',
      }
    }
    return {
      signal: 'Accumulation de signaux de risque',
      seuil: 'Si score pilier < 12/25',
      action: 'Déclencher un plan de stabilisation hebdomadaire et prioriser le cash.',
    }
  })
  const radarsJ30 = opusPlan?.radarsJ30?.length ? opusPlan.radarsJ30 : radarFallback

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 4 — ANALYSE PAR PILIER
  // ═══════════════════════════════════════════════════════════════════════════
  pdf.addPage()
  pageNum = 4
  currentSection = 'Analyse par pilier'
  addPageHeader(pdf, M, displayName, dateStr)
  y = M + 18

  y = sectionTitle(pdf, 'ANALYSE PAR PILIER', M, y)

  const pillarNarratives: Array<{ key: keyof DiagnosticScore['pillars']; label: string; text: string }> = [
    { key: 'cash', label: 'CASH', text: narrativeParPilier.cash },
    { key: 'margin', label: 'MARGIN', text: narrativeParPilier.margin },
    { key: 'resilience', label: 'RÉSILIENCE', text: narrativeParPilier.resilience },
    { key: 'risk', label: 'RISQUES', text: narrativeParPilier.risques },
  ]

  pillarNarratives.forEach((item, idx) => {
    const lockHeadline = 'Débloquez l\'analyse complète — 49€'
    const lockX = M + 5
    const lockW = CW - 10
    const lockY = y + 15.5
    const pillar = data.diagnostic.pillars[item.key]
    const score = pillar.score ?? 0
    const levelColor: RGB = score >= 18 ? C.green : score >= 12 ? C.amber : C.red

    const cardH = isPremium
      ? 30
      : 15.5 + measureLockedBlockHeight(pdf, lockW, lockHeadline) + 5

    y = ensureSpace(pdf, y, cardH + 8, M, H, FOOTER_H, footer)

    pdf.setFillColor(...rgb(C.white))
    pdf.roundedRect(M, y, CW, cardH, 2, 2, 'F')
    pdf.setDrawColor(...rgb(C.border))
    pdf.roundedRect(M, y, CW, cardH, 2, 2, 'S')

    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...rgb(C.navy))
    pdf.text(item.label, M + 5, y + 7)
    pdf.setTextColor(...rgb(levelColor))
    pdf.text(`${score}/25`, M + CW - 5, y + 7, { align: 'right' })

    // Positionnement vs médiane de référence (12.5/25)
    const barX = M + 5
    const barY = y + 10
    const barW = CW - 10
    pdf.setFillColor(...rgb(C.bg))
    pdf.roundedRect(barX, barY, barW, 3.5, 1, 1, 'F')
    pdf.setFillColor(...rgb(levelColor))
    pdf.roundedRect(barX, barY, barW * Math.min(score / 25, 1), 3.5, 1, 1, 'F')
    pdf.setDrawColor(...rgb(C.light))
    const medianX = barX + barW * 0.5
    pdf.line(medianX, barY - 0.5, medianX, barY + 4)

    if (isPremium) {
      pdf.setFontSize(7.5)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...rgb(C.text))
      wrapText(pdf, item.text, CW - 10).slice(0, 4).forEach((line, li) => {
        pdf.text(line, M + 5, y + 19 + li * 3.8)
      })
    } else {
      drawLockedContentBlock(pdf, lockX, lockY, lockW, lockHeadline)
    }

    y += cardH + 4
    if (idx < pillarNarratives.length - 1) {
      pdf.setDrawColor(...rgb(C.border))
      pdf.line(M, y - 2, M + CW, y - 2)
    }
  })

  // Radar chart (score actuel vs médiane 12.5/25)
  try {
    y = ensureSpace(pdf, y, 55, M, H, FOOTER_H, footer)
    y += 2
    pdf.setFontSize(TYPO.subtitle)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...rgb(C.navy))
    pdf.text('POSITIONNEMENT GLOBAL (RADAR)', M, y)
    y += 6

    const cx = M + CW / 2
    const cy = y + 22
    const radius = 18
    const keys: Array<keyof DiagnosticScore['pillars']> = ['cash', 'margin', 'resilience', 'risk']
    const angleOf = (i: number) => (-Math.PI / 2) + i * ((Math.PI * 2) / keys.length)
    const point = (value: number, i: number) => {
      const r = radius * Math.max(0, Math.min(1, value / 25))
      const a = angleOf(i)
      return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
    }

    pdf.setDrawColor(...rgb(C.border))
    ;[0.25, 0.5, 0.75, 1].forEach((k) => {
      const rr = radius * k
      const pts = keys.map((_, i) => ({ x: cx + rr * Math.cos(angleOf(i)), y: cy + rr * Math.sin(angleOf(i)) }))
      pts.forEach((p, i) => {
        const n = pts[(i + 1) % pts.length]
        pdf.line(p.x, p.y, n.x, n.y)
      })
    })

    keys.forEach((k, i) => {
      const a = angleOf(i)
      const ox = cx + (radius + 4) * Math.cos(a)
      const oy = cy + (radius + 4) * Math.sin(a)
      pdf.setFontSize(7)
      pdf.setTextColor(...rgb(C.muted))
      pdf.text(k.toUpperCase(), ox, oy, { align: 'center' })
    })

    const medianPts = keys.map((_, i) => point(12.5, i))
    pdf.setDrawColor(...rgb(C.light))
    medianPts.forEach((p, i) => {
      const n = medianPts[(i + 1) % medianPts.length]
      pdf.line(p.x, p.y, n.x, n.y)
    })

    const actualPts = keys.map((k, i) => point(data.diagnostic.pillars[k].score ?? 0, i))
    pdf.setDrawColor(...rgb(C.accent))
    actualPts.forEach((p, i) => {
      const n = actualPts[(i + 1) % actualPts.length]
      pdf.line(p.x, p.y, n.x, n.y)
    })
  } catch {
    pdf.setFontSize(TYPO.note)
    pdf.setFont('helvetica', 'italic')
    pdf.setTextColor(...rgb(C.muted))
    pdf.text('Graphique radar indisponible — lecture détaillée disponible dans les blocs par pilier.', M, y + 10)
  }

  footer()

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 5 — PRIORITÉS D'ACTION (result-oriented, no vuln repeats)
  // ═══════════════════════════════════════════════════════════════════════════
  pdf.addPage()
  pageNum = 5
  currentSection = 'Priorités d’action'
  addPageHeader(pdf, M, displayName, dateStr)
  y = M + 18

  y = sectionTitle(pdf, 'PRIORITES D\'ACTION', M, y)

  type PriorityItem = { title: string; detail: string; urgency: 'critique' | 'haute' | 'moyenne' }
  let priorities: PriorityItem[]

  if (opusPlan && opusPlan.priorities.length === 3) {
    priorities = opusPlan.priorities.map((p: OpusPriority) => ({ title: p.title, detail: p.detail, urgency: p.urgency }))
  } else {
    priorities = []
    if (data.insights.priorite) priorities.push({ title: 'Levier cash prioritaire', detail: data.insights.priorite, urgency: 'critique' })
    priorities.push({
      title: 'Restructuration du poste clients',
      detail: 'Implementer une politique de facturation avec acomptes systematiques de 30% pour reduire l\'exposition au risque. Objectif : securiser le flux d\'encaissements et diminuer le DSO de 15 a 25 jours.',
      urgency: 'haute',
    })
    priorities.push({
      title: 'Optimisation du BFR',
      detail: 'Negocier l\'alignement des delais fournisseurs sur les delais clients pour stabiliser le cycle d\'exploitation. Cible : remonter 10 a 15 jours de tresorerie immobilisee.',
      urgency: 'moyenne',
    })
  }

  const prioLockHeadline = 'Débloquez l\'analyse complète — 49€'

  priorities.slice(0, 3).forEach((prio, idx) => {
    const lockInnerW = CW - 10
    const lockX = M + 5

    let cardH = 32
    if (!isPremium && idx > 0) {
      const lockTop = y + 28
      cardH = lockTop - y + measureLockedBlockHeight(pdf, lockInnerW, prioLockHeadline) + 8
    } else if (!isPremium && idx === 0) {
      const detailLockW = CW - 36
      cardH = Math.max(32, 16 + measureLockedBlockHeight(pdf, detailLockW, prioLockHeadline) + 8)
    }

    y = ensureSpace(pdf, y, cardH + 12, M, H, FOOTER_H, footer)

    pdf.setFillColor(...rgb(C.bg))
    pdf.roundedRect(M, y, CW, cardH, 2, 2, 'F')
    pdf.setDrawColor(...rgb(C.border))
    pdf.roundedRect(M, y, CW, cardH, 2, 2, 'S')
    const badgeColor: RGB = prio.urgency === 'critique' ? C.red : prio.urgency === 'haute' ? C.amber : C.accent
    pdf.setFillColor(...rgb(badgeColor))
    pdf.roundedRect(M + 5, y + 4, 18, 18, 2, 2, 'F')
    pdf.setFontSize(12); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...rgb(C.white)); pdf.text(`#${idx + 1}`, M + 8.5, y + 16)
    pdf.setFontSize(9); pdf.setTextColor(...rgb(C.navy)); pdf.text(clean(prio.title), M + 30, y + 10)

    if (!isPremium && idx > 0) {
      drawLockedContentBlock(pdf, lockX, y + 28, lockInnerW, prioLockHeadline)
      y += cardH + 6
      return
    }
    if (!isPremium && idx === 0) {
      drawLockedContentBlock(pdf, M + 28, y + 16, CW - 36, prioLockHeadline)
      y += cardH + 6
      return
    }

    pdf.setFontSize(8); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...rgb(C.text))
    wrapText(pdf, prio.detail, CW - 38).slice(0, 3).forEach((line, li) => pdf.text(line, M + 30, y + 16 + li * 4))
    y += cardH + 6
  })

  y = ensureSpace(pdf, y, 65, M, H, FOOTER_H, footer)
  y += 5
  y = sectionTitle(pdf, 'IMPACT CASH — LEVIER PARETO', M, y)

  const paretoH = 50
  pdf.setFillColor(...rgb(C.bgWarm))
  pdf.roundedRect(M, y, CW, paretoH, 3, 3, 'F')
  pdf.setFillColor(...rgb(C.navy))
  pdf.rect(M, y, 2.5, paretoH, 'F')
  const ppx = M + 10
  if (cashImpactAmount > 0) {
    pdf.setFontSize(22); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...rgb(C.navy)); pdf.text(clean(`${fmt(cashImpactAmount)} EUR`), ppx, y + 14)
    pdf.setFontSize(8); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...rgb(C.text)); pdf.text(`${cashGapJours}j de DSO au-dessus de la mediane sectorielle (${bench.dsoMedian}j)`, ppx, y + 24)
    pdf.setFontSize(9); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...rgb(C.accent)); pdf.text('Impact immediat sur le disponible bancaire', ppx, y + 34)
    pdf.setFontSize(7.5); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...rgb(C.muted)); pdf.text('Reserve de cash mobilisable par simple optimisation du recouvrement clients.', ppx, y + 42)
  } else {
    pdf.setFontSize(10); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...rgb(C.navy)); pdf.text('DSO aligne sur la mediane sectorielle', ppx, y + 14)
    pdf.setFontSize(8); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...rgb(C.text)); pdf.text('Pas de cash immobilise identifie sur le poste clients. Bonne maitrise du cycle.', ppx, y + 24)
    pdf.setFontSize(9); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...rgb(C.accent)); pdf.text('Impact immediat sur le disponible bancaire : aucun levier DSO supplementaire', ppx, y + 34)
  }

  footer()

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 6 — PACK BANQUIER
  // ═══════════════════════════════════════════════════════════════════════════
  pdf.addPage()
  pageNum = 6
  currentSection = 'Pack banquier'
  addPageHeader(pdf, M, displayName, dateStr)
  y = M + 18

  if (!isPremium) {
    const packHeadline =
      'Pack Banquier — 5 questions préparées avec vos chiffres réels · Débloquez pour 49€'
    const blockH = measureLockedBlockHeight(pdf, CW, packHeadline)
    const contentTop = M + 18
    const contentBottom = H - FOOTER_H - M
    const blockY = contentTop + Math.max(0, (contentBottom - contentTop - blockH) / 2)
    drawLockedContentBlock(pdf, M, blockY, CW, packHeadline)
  } else {
    y = sectionTitle(pdf, 'PREPAREZ VOTRE RENDEZ-VOUS BANCAIRE', M, y)
    pdf.setFontSize(8)
    pdf.setTextColor(...rgb(C.muted))
    pdf.text('5 questions que votre banquier va poser — et vos réponses préparées', M, y)
    y += 8

    packBanquier.slice(0, 5).forEach((qa, idx) => {
      y = ensureSpace(pdf, y, 24, M, H, FOOTER_H, footer)
      pdf.setFontSize(8.5)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...rgb(C.navy))
      pdf.text(`${idx + 1}. ${clean(qa.question)}`, M, y)
      y += 5
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...rgb(C.text))
      wrapText(pdf, qa.reponse, CW).forEach((line) => { pdf.text(line, M + 2, y); y += 4 })
      y += 3
    })
  }

  footer()

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 7 — COMPARAISON SECTORIELLE + RADARS J+30
  // ═══════════════════════════════════════════════════════════════════════════
  pdf.addPage()
  pageNum = 7
  currentSection = 'Benchmark et radars J+30'
  addPageHeader(pdf, M, displayName, dateStr)
  y = M + 18

  y = sectionTitle(pdf, 'COMPARAISON SECTORIELLE', M, y)

  // Benchmark table with REAL values
  const bHeaders = ['Indicateur', 'Mediane sectorielle', 'Votre valeur', 'Ecart']
  const bCols = [45, 40, 40, 45]

  pdf.setFillColor(...rgb(C.navy))
  pdf.rect(M, y, CW, 8, 'F')
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.white))
  let cx = M
  bHeaders.forEach((h, i) => { pdf.text(h, cx + 3, y + 5.5); cx += bCols[i] })
  y += 8

  interface BRow { label: string; median: string; actual: string; ecart: string; ecartColor: RGB }
  const rows: BRow[] = []

  // DSO
  if (dso) {
    const g = dso.value - bench.dsoMedian
    rows.push({ label: 'DSO (delai encaissement)', median: `${bench.dsoMedian}j`, actual: `${dso.value}j`, ecart: g > 0 ? `+${g}j (defavorable)` : `${g}j (favorable)`, ecartColor: g > 0 ? C.red : C.green })
  } else {
    rows.push({ label: 'DSO (delai encaissement)', median: `${bench.dsoMedian}j`, actual: 'Non mesure', ecart: '--', ecartColor: C.light })
  }

  // Marge brute
  if (marge) {
    const g = marge.value - bench.margeMedian
    rows.push({ label: 'Marge brute', median: `${bench.margeMedian}%`, actual: `${marge.value}%`, ecart: g >= 0 ? `+${g}pts (favorable)` : `${g}pts (defavorable)`, ecartColor: g >= 0 ? C.green : C.red })
  } else {
    rows.push({ label: 'Marge brute', median: `${bench.margeMedian}%`, actual: 'Non mesure', ecart: '--', ecartColor: C.light })
  }

  // BFR
  if (bfr && bfr.inputs?.ca && bfr.inputs.ca > 0) {
    const j = Math.round((bfr.value / bfr.inputs.ca) * 365)
    const g = j - bench.bfrJoursMedian
    rows.push({ label: 'BFR (jours de CA)', median: `${bench.bfrJoursMedian}j`, actual: `${j}j`, ecart: g > 0 ? `+${g}j (defavorable)` : `${g}j (favorable)`, ecartColor: g > 0 ? C.red : C.green })
  } else {
    rows.push({ label: 'BFR (jours de CA)', median: `${bench.bfrJoursMedian}j`, actual: 'Non mesure', ecart: '--', ecartColor: C.light })
  }

  // EBITDA %
  if (ebitda && caAnnuel && caAnnuel > 0) {
    const pct = Math.round((ebitda.value / caAnnuel) * 100)
    const g = pct - bench.ebitdaMedian
    rows.push({ label: 'EBITDA (% du CA)', median: `${bench.ebitdaMedian}%`, actual: `${pct}%`, ecart: g >= 0 ? `+${g}pts (favorable)` : `${g}pts (defavorable)`, ecartColor: g >= 0 ? C.green : C.red })
  } else {
    rows.push({ label: 'EBITDA (% du CA)', median: `${bench.ebitdaMedian}%`, actual: 'Non mesure', ecart: '--', ecartColor: C.light })
  }

  rows.forEach((row, i) => {
    const ry = y + i * 9
    pdf.setFillColor(...rgb(i % 2 === 0 ? C.bg : C.white))
    pdf.rect(M, ry, CW, 9, 'F')

    pdf.setFontSize(7.5)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...rgb(C.dark))

    let rx = M
    pdf.text(row.label, rx + 3, ry + 6)
    rx += bCols[0]
    pdf.text(row.median, rx + 3, ry + 6)
    rx += bCols[1]

    pdf.setFont('helvetica', 'bold')
    pdf.text(row.actual, rx + 3, ry + 6)
    rx += bCols[2]

    pdf.setTextColor(...rgb(row.ecartColor))
    pdf.text(row.ecart, rx + 3, ry + 6)

    // mini gauge
    const gaugeW = 26
    const gaugeX = M + CW - gaugeW - 4
    const gaugeY = ry + 1.5
    pdf.setFillColor(...rgb(C.bg))
    pdf.roundedRect(gaugeX, gaugeY, gaugeW, 2.5, 1, 1, 'F')
    const fillRatio = Math.max(0, Math.min(1, row.ecart.includes('favorable') ? 0.75 : row.ecart.includes('defavorable') ? 0.35 : 0.5))
    pdf.setFillColor(...rgb(row.ecartColor))
    pdf.roundedRect(gaugeX, gaugeY, gaugeW * fillRatio, 2.5, 1, 1, 'F')
  })

  y += rows.length * 9 + 6
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'italic')
  pdf.setTextColor(...rgb(C.muted))
  pdf.text(`Secteur : ${bench.label} — Sources : Banque de France, INSEE, Altares (2024)`, M, y)
  y += 15

  y += 10
  y = sectionTitle(pdf, 'SIGNAUX A SURVEILLER — 30 PROCHAINS JOURS', M, y)
  if (isPremium) {
    radarsJ30.slice(0, 3).forEach((radar, i) => {
      y = ensureSpace(pdf, y, 24, M, H, FOOTER_H, footer)
      const isCrit = /critique|>\s*\d+/i.test(radar.seuil)
      const color = isCrit ? C.red : C.amber
      pdf.setFillColor(...rgb(C.white))
      pdf.roundedRect(M, y, CW, 20, 2, 2, 'F')
      pdf.setDrawColor(...rgb(C.border))
      pdf.roundedRect(M, y, CW, 20, 2, 2, 'S')
      pdf.setFillColor(...rgb(color))
      pdf.rect(M, y, 2, 20, 'F')
      pdf.setFontSize(8.5); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...rgb(C.navy)); pdf.text(`${i + 1}. ${clean(radar.signal)}`, M + 5, y + 7)
      pdf.setFontSize(7.5); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...rgb(C.muted)); pdf.text(`Seuil : ${clean(radar.seuil)}`, M + 5, y + 12)
      pdf.setTextColor(...rgb(C.text)); pdf.text(clean(radar.action), M + 5, y + 17)
      y += 24
    })
  } else {
    const radarLockHeadline = 'Débloquez l\'analyse complète — 49€'
    const lockH = measureLockedBlockHeight(pdf, CW, radarLockHeadline)
    y = ensureSpace(pdf, y, lockH + 10, M, H, FOOTER_H, footer)
    drawLockedContentBlock(pdf, M, y, CW, radarLockHeadline)
  }

  footer()

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGES 8–11 — SCORIS STRATÉGIQUE (Z-Score, SWOT, positionnement, valorisation)
  // ═══════════════════════════════════════════════════════════════════════════
  if (isStrategicPdf && data.strategique) {
    const strat = data.strategique
    const margeBrute = Number(seuil?.inputs?.margeBrute ?? marge?.value ?? 0)
    const chargesFixesMensuelles = Number(seuil?.inputs?.chargesFixesMensuelles ?? 0)
    const bfrEuros = Number(bfr?.value ?? 0)
    const zBreakdown =
      strat.actifTotal > 0
        ? computeZScoreBreakdownFromInputs({
            actifTotal: strat.actifTotal,
            capitauxPropres: strat.capitauxPropres,
            bfrEuros,
            caAnnuel: caAnnuel ?? 0,
            margeBrute,
            chargesFixesMensuelles,
          })
        : null

    const as = opusPlan?.analyseStrategique
    const ebitdaPctForVal =
      ebitda && caAnnuel && caAnnuel > 0
        ? Math.round((ebitda.value / caAnnuel) * 100)
        : undefined
    const ebitdaEstimable = !!(caAnnuel && caAnnuel > 0 && ebitdaPctForVal != null && ebitdaPctForVal > 0)

    // ── Page 8 : Z-Score Altman
    pdf.addPage()
    pageNum = 8
    currentSection = 'Z-Score Altman'
    addPageHeader(pdf, M, displayName, dateStr)
    y = M + 18
    y = sectionTitle(pdf, 'INDICE DE SOLIDITE FINANCIERE — Z-SCORE ALTMAN', M, y)
    pdf.setFontSize(TYPO.subtitle)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...rgb(C.muted))
    pdf.text('Modele predictif de defaillance a 24 mois (approximation declarative PME)', M, y)
    y += 14

    if (strat.actifTotal > 0 && zBreakdown) {
      const barW = CW
      const barH = 9
      const barY = y
      const zShow = zBreakdown.zScore
      const scaleMin = 0
      const scaleMax = 5
      const t1 = (1.23 - scaleMin) / (scaleMax - scaleMin)
      const t2 = (2.9 - scaleMin) / (scaleMax - scaleMin)
      const wR = barW * t1
      const wO = barW * (t2 - t1)
      const wG = barW - wR - wO
      pdf.setFillColor(...rgb(C.red))
      pdf.rect(M, barY, wR, barH, 'F')
      pdf.setFillColor(...rgb(C.amber))
      pdf.rect(M + wR, barY, wO, barH, 'F')
      pdf.setFillColor(...rgb(C.green))
      pdf.rect(M + wR + wO, barY, wG, barH, 'F')
      const markerX = M + Math.max(0, Math.min(barW, ((zShow - scaleMin) / (scaleMax - scaleMin)) * barW))
      pdf.setDrawColor(...rgb(C.navy))
      pdf.setLineWidth(0.8)
      pdf.line(markerX, barY - 2, markerX, barY + barH + 2)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...rgb(C.navy))
      pdf.text(`${zShow.toFixed(2)}`, markerX, barY + barH + 8, { align: 'center' })
      y = barY + barH + 16

      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...rgb(C.muted))
      pdf.text('Rouge < 1,23 · Orange 1,23–2,9 · Vert > 2,9', M, y)
      y += 10

      pdf.setFontSize(7.5)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...rgb(C.navy))
      pdf.text('Composantes (formulation PME)', M, y)
      y += 6

      const tableHead = ['Indicateur', 'Valeur', 'Poids', 'Contribution']
      const colW = [72, 28, 22, 38]
      pdf.setFillColor(...rgb(C.navy))
      pdf.rect(M, y, CW, 7, 'F')
      pdf.setFontSize(6.5)
      pdf.setTextColor(...rgb(C.white))
      let hx = M + 2
      tableHead.forEach((h, i) => {
        pdf.text(h, hx, y + 5)
        hx += colW[i]
      })
      y += 8

      zBreakdown.rows.forEach((row, i) => {
        pdf.setFillColor(...rgb(i % 2 === 0 ? C.bg : C.white))
        pdf.rect(M, y, CW, 8, 'F')
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(...rgb(C.dark))
        let rx = M + 2
        const cells = [
          clean(row.indicateur),
          row.valeur.toFixed(4),
          row.poids.toFixed(3),
          row.contribution.toFixed(4),
        ]
        cells.forEach((c, j) => {
          pdf.text(c, rx, y + 5.5)
          rx += colW[j]
        })
        y += 8
      })
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...rgb(C.navy))
      pdf.text('Z-Score total', M + 2, y + 5)
      pdf.text(zBreakdown.zScore.toFixed(4), M + CW - 40, y + 5)
      y += 12
    } else {
      pdf.setFontSize(9)
      pdf.setTextColor(...rgb(C.muted))
      wrapText(pdf, 'Z-Score non affiche : renseigner un actif total positif pour calculer l\'indicateur.', CW).forEach((ln) => {
        pdf.text(ln, M, y)
        y += 5
      })
      y += 8
    }

    const zComm = as?.zScoreCommentaire?.trim()
      ? clean(as.zScoreCommentaire)
      : 'Interpretation : croiser ce signal avec le pilotage cash court terme et la structure du bilan.'
    pdf.setFontSize(TYPO.body)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...rgb(C.text))
    wrapText(pdf, zComm, CW).forEach((ln) => {
      y = ensureSpace(pdf, y, 8, M, H, FOOTER_H, footer)
      pdf.text(ln, M, y)
      y += TYPO.lineBody
    })
    y += 4
    pdf.setFontSize(7)
    pdf.setFont('helvetica', 'italic')
    pdf.setTextColor(...rgb(C.muted))
    pdf.text('Source : Modele Altman Z-Score adapte PME (1983, revise 2000) — X2 non saisi.', M, y)
    footer()

    // ── Page 9 : SWOT
    pdf.addPage()
    pageNum = 9
    currentSection = 'Analyse SWOT'
    addPageHeader(pdf, M, displayName, dateStr)
    y = M + 18
    y = sectionTitle(pdf, 'ANALYSE SWOT — DIAGNOSTIC STRATEGIQUE', M, y)

    const sw = as?.swotStructure
    const quad = (title: string, lines: string[], fill: RGB, x: number, qy: number, qw: number, qh: number) => {
      pdf.setFillColor(...rgb(fill))
      pdf.roundedRect(x, qy, qw, qh, 2, 2, 'F')
      pdf.setDrawColor(...rgb(C.border))
      pdf.roundedRect(x, qy, qw, qh, 2, 2, 'S')
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...rgb(C.navy))
      pdf.text(title, x + 4, qy + 7)
      let ly = qy + 12
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(7)
      pdf.setTextColor(...rgb(C.text))
      lines.slice(0, 8).forEach((line) => {
        wrapText(pdf, `• ${clean(line)}`, qw - 8).forEach((wl) => {
          if (ly > qy + qh - 4) return
          pdf.text(wl, x + 4, ly)
          ly += 3.6
        })
      })
    }

    const qw = (CW - 6) / 2
    const qh = 62
    const qy0 = y
    quad(
      'FORCES',
      [
        ...data.insights.forces.map((f) => `Financier : ${f}`),
        strat.swotForce.trim() ? `Declare dirigeant : « ${clean(strat.swotForce)} »` : '',
        ...(sw?.forces ?? []),
      ].filter(Boolean),
      C.green,
      M,
      qy0,
      qw,
      qh,
    )
    quad(
      'FAIBLESSES',
      [
        ...data.insights.vulnerabilites.map((v) => `Financier : ${v}`),
        ...(sw?.faiblesses ?? []),
      ].filter(Boolean),
      SWOT_FAIB,
      M + qw + 6,
      qy0,
      qw,
      qh,
    )
    const qy1 = qy0 + qh + 6
    quad(
      'OPPORTUNITES',
      sw?.opportunites?.length ? sw.opportunites : [`Objectif 12 mois : ${clean(strat.objectif12mois)}`],
      SWOT_OPP,
      M,
      qy1,
      qw,
      qh,
    )
    quad(
      'MENACES',
      [
        ...(sw?.menaces ?? []),
        strat.swotMenace.trim() ? `Declare dirigeant : « ${clean(strat.swotMenace)} »` : '',
      ].filter(Boolean),
      SWOT_MEN,
      M + qw + 6,
      qy1,
      qw,
      qh,
    )

    footer()

    // ── Page 10 : Positionnement stratégique
    pdf.addPage()
    pageNum = 10
    currentSection = 'Positionnement stratégique'
    addPageHeader(pdf, M, displayName, dateStr)
    y = M + 18
    y = sectionTitle(pdf, 'FEUILLE DE ROUTE STRATEGIQUE — 12 MOIS', M, y)

    pdf.setFillColor(...rgb(C.bgWarm))
    pdf.roundedRect(M, y, CW, 22, 3, 3, 'F')
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...rgb(C.navy))
    pdf.text('Objectif principal', M + 6, y + 10)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...rgb(C.text))
    wrapText(pdf, clean(strat.objectif12mois), CW - 12).forEach((ln, i) => {
      pdf.text(ln, M + 6, y + 16 + i * 4.5)
    })
    y += 30

    const steps = opusPlan?.actionPlan90j?.length ? opusPlan.actionPlan90j : []
    const colW2 = (CW - 8) / 3
    const headers = ['0-30 jours', '30-90 jours', '90-365 jours']
    const buckets: string[][] = [[], [], []]
    steps.forEach((st, idx) => {
      const line = `${clean(st.semaine)} — ${clean(st.action)}`
      if (idx % 3 === 0) buckets[0].push(line)
      else if (idx % 3 === 1) buckets[1].push(line)
      else buckets[2].push(line)
    })
    if (buckets.every((b) => b.length === 0)) {
      buckets[0].push('Prioriser le cash et les encaissements.')
      buckets[1].push('Consolider marge et BFR selon benchmarks.')
      buckets[2].push('Aligner investissements sur l\'objectif 12 mois.')
    }

    const timelineTop = y
    headers.forEach((h, i) => {
      const cx = M + i * (colW2 + 4)
      pdf.setFillColor(...rgb(C.navy))
      pdf.rect(cx, timelineTop, colW2, 8, 'F')
      pdf.setFontSize(7.5)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...rgb(C.white))
      pdf.text(h, cx + 3, timelineTop + 5.5)
    })
    let maxColY = timelineTop + 12
    headers.forEach((_, i) => {
      const cx = M + i * (colW2 + 4)
      let ly = timelineTop + 12
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(6.8)
      pdf.setTextColor(...rgb(C.text))
      buckets[i].forEach((txt) => {
        wrapText(pdf, txt, colW2 - 4).forEach((wl) => {
          ly = ensureSpace(pdf, ly, 6, M, H, FOOTER_H, footer)
          pdf.text(wl, cx + 2, ly)
          ly += 3.5
        })
      })
      maxColY = Math.max(maxColY, ly)
    })
    y = maxColY + 10

    y = sectionTitle(pdf, 'RECOMMANDATION FINANCEMENT', M, y)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...rgb(C.text))
    wrapText(pdf, clean(as?.recommendationFinancement ?? 'Structurer la dette court terme et securiser les lignes de tresorerie en lien avec votre banque.'), CW).forEach((ln) => {
      y = ensureSpace(pdf, y, 6, M, H, FOOTER_H, footer)
      pdf.text(ln, M, y)
      y += 4.5
    })
    footer()

    // ── Page 11 : Valorisation
    pdf.addPage()
    pageNum = 11
    currentSection = 'Valorisation & financement'
    addPageHeader(pdf, M, displayName, dateStr)
    y = M + 18
    y = sectionTitle(pdf, 'ESTIMATION DE LA VALEUR D\'ENTREPRISE', M, y)
    pdf.setFontSize(TYPO.subtitle)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...rgb(C.muted))
    pdf.text('Fourchette indicative — usage exclusif interne', M, y)
    y += 12

    if (ebitdaEstimable && as?.valorisationFourchette) {
      const vf = as.valorisationFourchette
      const cardW = (CW - 8) / 2
      pdf.setFillColor(...rgb(C.bg))
      pdf.roundedRect(M, y, cardW, 28, 2, 2, 'F')
      pdf.roundedRect(M + cardW + 8, y, cardW, 28, 2, 2, 'F')
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...rgb(C.navy))
      pdf.text('Valeur basse', M + 6, y + 10)
      pdf.text('Valeur haute', M + cardW + 14, y + 10)
      pdf.setFontSize(14)
      pdf.text(`${fmt(vf.basse)} EUR`, M + 6, y + 20)
      pdf.text(`${fmt(vf.haute)} EUR`, M + cardW + 14, y + 20)
      y += 34
      pdf.setFontSize(7.5)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...rgb(C.text))
      wrapText(pdf, clean(vf.methode), CW).forEach((ln) => {
        pdf.text(ln, M, y)
        y += 4
      })
    } else {
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...rgb(C.muted))
      pdf.text('Valorisation non calculable.', M, y)
      y += 5
      wrapText(pdf, 'Renseignez un EBITDA estimé pour activer cette section.', CW).forEach((ln) => {
        pdf.text(ln, M, y)
        y += 5
      })
    }

    y += 8
    if (ebitdaEstimable && as?.valorisationFourchette) {
      pdf.setFillColor(...rgb(C.bg))
      pdf.roundedRect(M, y, CW, 18, 2, 2, 'F')
      pdf.setFontSize(6.5)
      pdf.setTextColor(...rgb(C.muted))
      wrapText(
        pdf,
        'Cette estimation repose sur des donnees declaratives et des multiples sectoriels. Elle ne constitue pas une evaluation officielle et ne peut etre utilisee dans un acte juridique.',
        CW - 6,
      ).forEach((ln, i) => {
        pdf.text(ln, M + 3, y + 6 + i * 3.5)
      })
    }
    footer()
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Dernière page — MÉTHODOLOGIE + LEGAL
  // ═══════════════════════════════════════════════════════════════════════════
  pdf.addPage()
  pageNum = isStrategicPdf ? 12 : 8
  currentSection = 'Méthodologie et disclaimer'
  addPageHeader(pdf, M, displayName, dateStr)
  y = M + 18

  y = sectionTitle(pdf, 'METHODOLOGIE', M, y)

  pdf.setFontSize(7.5)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...rgb(C.text))

  const methodo = [
    'Score FinSight : score composite 0-100 calcule sur 4 piliers ponderes (Tresorerie 25, Rentabilite 25, Resilience 25, Risques 25).',
    '',
    'Chaque indicateur est compare aux medianes sectorielles francaises (Banque de France, INSEE, Altares 2024). Les seuils sont relatifs : un burn rate de 15k EUR/mois est maitrise pour une entreprise a 600k EUR CA, mais critique a 100k EUR CA.',
    '',
    'Moteurs d\'analyse : SCORIS (scoring multi-pilier), TRESORIS (analyse causale de tresorerie), DASHIS (simulations What-If).',
    '',
    'Confiance : Haute (4/4 piliers) / Moyenne (2-3) / Faible (1). Score extrapole sur 100 a partir des piliers disponibles.',
    '',
    'Import FEC : parsing 100% local (navigateur). Le fichier n\'est jamais stocke sur un serveur ni transmis a un tiers.',
    '',
    'Note de solvabilite : les indicateurs bancaires (EBITDA %, marge de securite, garantie de liquidite) sont calcules a partir des donnees declarees. Ils ne constituent pas une notation de credit officielle.',
  ]

  methodo.forEach(line => {
    if (line === '') { y += 2; return }
    y = ensureSpace(pdf, y, 10, M, H, FOOTER_H, footer)
    wrapText(pdf, line, CW).forEach(wl => { pdf.text(wl, M, y); y += 4 })
    y += 1
  })

  y += 15

  // ── Legal Disclaimer ──
  y = ensureSpace(pdf, y, 35, M, H, FOOTER_H, footer)

  pdf.setFillColor(...rgb(C.bg))
  pdf.roundedRect(M, y, CW, 30, 2, 2, 'F')
  pdf.setDrawColor(...rgb(C.border))
  pdf.setLineWidth(0.3)
  pdf.roundedRect(M, y, CW, 30, 2, 2, 'S')

  pdf.setFontSize(6.5)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.muted))
  pdf.text('AVERTISSEMENT', M + 5, y + 6)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(6)
  wrapText(
    pdf,
    'Ce document est genere automatiquement a titre informatif. Il ne constitue en aucun cas un conseil financier, fiscal ou juridique. Les scores et recommandations sont bases sur les donnees declarees et les medianes sectorielles publiques. FinSight decline toute responsabilite en cas de decision fondee exclusivement sur ce rapport. Pour un audit complet, consulter un expert-comptable ou un DAF qualifie.',
    CW - 10,
  ).forEach((line, i) => { pdf.text(line, M + 5, y + 11 + i * 3.2) })

  footer()

  // ═══════════════════════════════════════════════════════════════════════════
  // SAVE
  // ═══════════════════════════════════════════════════════════════════════════
  const safeName = (data.companyName || data.fileName || 'diagnostic')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 40)
  pdf.save(`FinSight_Diagnostic_${safeName}.pdf`)
}
