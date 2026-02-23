/**
 * DIAGNOSTIC PDF GENERATOR — Executive Edition v2.0
 *
 * Generates a 5-page A4 portrait consulting-grade report.
 * Pure jsPDF — no DOM capture, no html2canvas dependency.
 *
 * Page 1: Cover
 * Page 2: Executive Summary (score + pillars + signaux clés)
 * Page 3: Priorités d'action (result-oriented) + Cash Impact Pareto
 * Page 4: Comparaison sectorielle (real values) + Synthèse de Solvabilité
 * Page 5: Méthodologie + Legal disclaimer
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
} from '@/lib/scoring/diagnosticScore'
import type { Calculation, CalculatorType } from '@/hooks/useCalculatorHistory'

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  navy:     [15, 23, 42]   as const,
  dark:     [30, 41, 59]   as const,
  text:     [51, 65, 85]   as const,
  muted:    [100, 116, 139] as const,
  light:    [148, 163, 184] as const,
  border:   [226, 232, 240] as const,
  bg:       [248, 250, 252] as const,
  bgWarm:   [241, 245, 249] as const,
  accent:   [0, 82, 204]   as const,
  green:    [16, 185, 129]  as const,
  amber:    [217, 119, 6]   as const,
  red:      [220, 38, 38]   as const,
  white:    [255, 255, 255] as const,
} as const

type RGB = readonly [number, number, number]

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

function addPageHeader(pdf: jsPDF, margin: number) {
  const w = pdf.internal.pageSize.getWidth()
  pdf.setFontSize(7)
  pdf.setTextColor(...rgb(C.light))
  pdf.setFont('helvetica', 'normal')
  pdf.text('FinSight', margin, 10)
  pdf.text('Diagnostic de Performance Financiere', w - margin, 10, { align: 'right' })
  pdf.setDrawColor(...rgb(C.border))
  pdf.setLineWidth(0.3)
  pdf.line(margin, 13, w - margin, 13)
}

function addPageFooter(pdf: jsPDF, margin: number, pageNum: number) {
  const w = pdf.internal.pageSize.getWidth()
  const h = pdf.internal.pageSize.getHeight()
  pdf.setDrawColor(...rgb(C.border))
  pdf.setLineWidth(0.3)
  pdf.line(margin, h - 15, w - margin, h - 15)
  pdf.setFontSize(6.5)
  pdf.setTextColor(...rgb(C.light))
  pdf.setFont('helvetica', 'normal')
  pdf.text('Document confidentiel', margin, h - 10)
  pdf.text('Powered by SCORIS v1', w / 2, h - 10, { align: 'center' })
  pdf.text(`${pageNum}`, w - margin, h - 10, { align: 'right' })
}

function sectionTitle(pdf: jsPDF, text: string, x: number, y: number): number {
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.accent))
  pdf.text(text, x, y)
  return y + 10
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
}

// ─── Main Generator ─────────────────────────────────────────────────────────

export async function generateDiagnosticPDF(data: DiagnosticPDFData): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const W = pdf.internal.pageSize.getWidth()
  const H = pdf.internal.pageSize.getHeight()
  const M = 20
  const CW = W - 2 * M
  const FOOTER_H = 18
  let pageNum = 0

  const bench = SECTOR_BENCHMARKS[data.sector]
  const get = (t: CalculatorType) => getCalc(data.history, t)
  const dso = get('dso')
  const bfr = get('bfr')
  const marge = get('marge')
  const ebitda = get('ebitda')
  const seuil = get('seuil-rentabilite')
  const caAnnuel = estimateCA((t: CalculatorType) => get(t))

  // Pre-compute cash impact
  let cashImpactAmount = 0
  let cashGapJours = 0
  if (dso && dso.value > bench.dsoMedian && caAnnuel && caAnnuel > 0) {
    cashGapJours = dso.value - bench.dsoMedian
    cashImpactAmount = Math.round((cashGapJours / 365) * caAnnuel)
  }

  const footer = () => { pageNum++; addPageFooter(pdf, M, pageNum) }

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 1 — COVER
  // ═══════════════════════════════════════════════════════════════════════════
  pageNum = 1

  pdf.setFillColor(...rgb(C.accent))
  pdf.rect(0, 0, W, 3, 'F')

  pdf.setFontSize(28)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.navy))
  pdf.text('FinSight', M, 40)

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...rgb(C.muted))
  pdf.text('Intelligence Financiere Augmentee', M, 48)

  pdf.setDrawColor(...rgb(C.accent))
  pdf.setLineWidth(0.8)
  pdf.line(M, 58, M + 40, 58)

  pdf.setFontSize(32)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.navy))
  pdf.text('Diagnostic de', M, 90)
  pdf.text('Performance Financiere', M, 103)

  const displayName = data.companyName || data.fileName || 'Mon Entreprise'
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...rgb(C.text))
  pdf.text(clean(displayName), M, 125)

  const metaY = 150
  pdf.setFontSize(9)
  pdf.setTextColor(...rgb(C.muted))
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const metaLines = [
    `Date du rapport : ${dateStr}`,
    `Secteur d'analyse : ${bench.label}`,
    `Indicateurs analyses : ${data.completedCount} / ${data.totalCalculators}`,
    'Moteur : SCORIS v1',
  ]
  if (data.fecMeta) {
    metaLines.push(`Source : FEC (${fmt(data.fecMeta.nbEcritures)} ecritures)`)
  }
  metaLines.forEach((line, i) => { pdf.text(clean(line), M, metaY + i * 7) })

  pdf.setFillColor(...rgb(C.navy))
  pdf.rect(0, H - 30, W, 30, 'F')
  pdf.setFontSize(8)
  pdf.setTextColor(...rgb(C.white))
  pdf.text('Document confidentiel', M, H - 18)
  pdf.setFontSize(7)
  pdf.text('Powered by SCORIS v1', M, H - 12)
  pdf.text('finsight.zineinsight.com', W - M, H - 12, { align: 'right' })

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 2 — EXECUTIVE SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════
  pdf.addPage()
  pageNum = 2
  addPageHeader(pdf, M)
  let y = M + 18

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
    const synthText = data.diagnostic.total >= 75
      ? 'Situation financiere solide avec des fondamentaux sains. Axes d\'optimisation identifies pour renforcer la trajectoire.'
      : data.diagnostic.total >= 50
      ? 'Situation intermediaire avec des leviers d\'amelioration significatifs. Un plan d\'action cible permettrait de gagner 10 a 20 points.'
      : 'Situation tendue necessitant une attention immediate sur les fondamentaux cash et marges. Intervention recommandee sous 30 jours.'

    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'italic')
    pdf.setTextColor(...rgb(C.text))
    const synthLines = wrapText(pdf, `"${synthText}"`, CW - 10)
    synthLines.forEach((line, i) => { pdf.text(line, M + 5, y + i * 5) })
    y += synthLines.length * 5 + 5

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

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 3 — PRIORITÉS D'ACTION (result-oriented, no vuln repeats)
  // ═══════════════════════════════════════════════════════════════════════════
  pdf.addPage()
  pageNum = 3
  addPageHeader(pdf, M)
  y = M + 18

  y = sectionTitle(pdf, 'PRIORITES D\'ACTION', M, y)

  // Build 3 result-oriented priority items
  const priorities: Array<{ title: string; detail: string; urgency: 'critique' | 'haute' | 'moyenne' }> = []

  if (data.insights.priorite) {
    priorities.push({
      title: 'Levier cash prioritaire',
      detail: data.insights.priorite,
      urgency: 'critique',
    })
  }

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

  priorities.slice(0, 3).forEach((prio, idx) => {
    y = ensureSpace(pdf, y, 40, M, H, FOOTER_H, footer)

    const cardH = 32
    pdf.setFillColor(...rgb(C.bg))
    pdf.roundedRect(M, y, CW, cardH, 2, 2, 'F')
    pdf.setDrawColor(...rgb(C.border))
    pdf.setLineWidth(0.3)
    pdf.roundedRect(M, y, CW, cardH, 2, 2, 'S')

    const badgeColor: RGB = prio.urgency === 'critique' ? C.red : prio.urgency === 'haute' ? C.amber : C.accent
    pdf.setFillColor(...rgb(badgeColor))
    pdf.roundedRect(M + 5, y + 4, 18, 18, 2, 2, 'F')
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...rgb(C.white))
    pdf.text(`#${idx + 1}`, M + 8.5, y + 16)

    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...rgb(C.navy))
    pdf.text(clean(prio.title), M + 30, y + 10)

    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...rgb(C.text))
    wrapText(pdf, prio.detail, CW - 38).slice(0, 3).forEach((line, li) => {
      pdf.text(line, M + 30, y + 16 + li * 4)
    })

    y += cardH + 6
  })

  // ── Cash Impact Pareto — encadré redesigné ──
  y = ensureSpace(pdf, y, 65, M, H, FOOTER_H, footer)
  y += 5

  y = sectionTitle(pdf, 'IMPACT CASH — LEVIER PARETO', M, y)

  const paretoH = 50
  // Light grey background
  pdf.setFillColor(...rgb(C.bgWarm))
  pdf.roundedRect(M, y, CW, paretoH, 3, 3, 'F')
  // Thick navy-blue left border (2.5mm)
  pdf.setFillColor(...rgb(C.navy))
  pdf.rect(M, y, 2.5, paretoH, 'F')

  const ppx = M + 10

  if (cashImpactAmount > 0) {
    pdf.setFontSize(22)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...rgb(C.navy))
    pdf.text(clean(`${fmt(cashImpactAmount)} EUR`), ppx, y + 14)

    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...rgb(C.text))
    pdf.text(`${cashGapJours}j de DSO au-dessus de la mediane sectorielle (${bench.dsoMedian}j)`, ppx, y + 24)

    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...rgb(C.accent))
    pdf.text('Impact immediat sur le disponible bancaire', ppx, y + 34)

    pdf.setFontSize(7.5)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...rgb(C.muted))
    pdf.text('Reserve de cash mobilisable par simple optimisation du recouvrement clients.', ppx, y + 42)
  } else {
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...rgb(C.navy))
    pdf.text('DSO aligne sur la mediane sectorielle', ppx, y + 14)

    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...rgb(C.text))
    pdf.text('Pas de cash immobilise identifie sur le poste clients. Bonne maitrise du cycle.', ppx, y + 24)

    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...rgb(C.accent))
    pdf.text('Impact immediat sur le disponible bancaire : aucun levier DSO supplementaire', ppx, y + 34)
  }

  y += paretoH + 5

  footer()

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 4 — COMPARAISON SECTORIELLE + NOTE DE SOLVABILITÉ
  // ═══════════════════════════════════════════════════════════════════════════
  pdf.addPage()
  pageNum = 4
  addPageHeader(pdf, M)
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
  })

  y += rows.length * 9 + 6
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'italic')
  pdf.setTextColor(...rgb(C.muted))
  pdf.text(`Secteur : ${bench.label} — Sources : Banque de France, INSEE, Altares (2024)`, M, y)
  y += 15

  // ── NOTE DE SOLVABILITÉ ──
  y = ensureSpace(pdf, y, 120, M, H, FOOTER_H, footer)
  y = sectionTitle(pdf, 'SYNTHESE DE SOLVABILITE & CAPACITE DE FINANCEMENT', M, y)

  pdf.setFontSize(7.5)
  pdf.setFont('helvetica', 'italic')
  pdf.setTextColor(...rgb(C.muted))
  pdf.text('Indicateurs cles de creditworthiness — a destination des partenaires financiers', M, y)
  y += 10

  interface BankerKPI { label: string; value: string; sublabel: string; detail: string; color: RGB }
  const kpis: BankerKPI[] = []

  // KPI 1: Capacité d'Autofinancement (EBITDA)
  if (ebitda && caAnnuel && caAnnuel > 0) {
    const pct = Math.round((ebitda.value / caAnnuel) * 100)
    const topLabel = pct >= bench.ebitdaMedian * 2 ? 'Top 5% sectoriel'
      : pct >= bench.ebitdaMedian * 1.5 ? 'Top 15% sectoriel'
      : pct >= bench.ebitdaMedian ? 'Au-dessus de la mediane' : 'Sous la mediane sectorielle'
    const profile = pct >= bench.ebitdaMedian * 1.5
      ? 'Profil de rentabilite exceptionnel'
      : pct >= bench.ebitdaMedian ? 'Profil de rentabilite solide' : 'Profil de rentabilite a renforcer'
    kpis.push({ label: 'Capacite d\'Autofinancement (EBITDA)', value: `${pct}%`, sublabel: topLabel, detail: profile, color: pct >= bench.ebitdaMedian ? C.green : C.amber })
  } else {
    kpis.push({ label: 'Capacite d\'Autofinancement (EBITDA)', value: '--', sublabel: 'Donnee non disponible', detail: 'Completez EBITDA et CA pour activer cet indicateur.', color: C.light })
  }

  // KPI 2: Marge de sécurité
  if (seuil && caAnnuel && caAnnuel > 0) {
    const ms = caAnnuel - seuil.value
    const pct = Math.round((ms / caAnnuel) * 100)
    kpis.push({
      label: 'Marge de Securite',
      value: `${pct}%`,
      sublabel: ms > 0 ? `L'entreprise peut absorber une baisse de CA de ${fmt(ms)} EUR` : 'CA sous le seuil de rentabilite',
      detail: ms > 0 ? 'avant d\'atteindre son seuil de rentabilite.' : 'Situation deficitaire — intervention urgente recommandee.',
      color: pct >= 30 ? C.green : pct >= 10 ? C.amber : C.red,
    })
  } else {
    kpis.push({ label: 'Marge de Securite', value: '--', sublabel: 'Donnee non disponible', detail: 'Completez le seuil de rentabilite pour activer.', color: C.light })
  }

  // KPI 3: Garantie de liquidité
  if (cashImpactAmount > 0) {
    kpis.push({ label: 'Garantie de Liquidite', value: `${fmt(cashImpactAmount)} EUR`, sublabel: 'Reserve de cash mobilisable', detail: 'par simple optimisation du recouvrement clients.', color: C.accent })
  } else if (dso && caAnnuel) {
    kpis.push({ label: 'Garantie de Liquidite', value: 'Optimal', sublabel: 'DSO aligne sur la mediane', detail: 'Pas de cash immobilise supplementaire identifie.', color: C.green })
  } else {
    kpis.push({ label: 'Garantie de Liquidite', value: '--', sublabel: 'Donnee non disponible', detail: 'Completez DSO et CA pour activer.', color: C.light })
  }

  const kpiH = 28
  kpis.forEach((kpi) => {
    y = ensureSpace(pdf, y, kpiH + 6, M, H, FOOTER_H, footer)

    pdf.setFillColor(...rgb(C.white))
    pdf.roundedRect(M, y, CW, kpiH, 2, 2, 'F')
    pdf.setDrawColor(...rgb(C.border))
    pdf.setLineWidth(0.3)
    pdf.roundedRect(M, y, CW, kpiH, 2, 2, 'S')

    // Left accent bar
    pdf.setFillColor(...rgb(kpi.color))
    pdf.rect(M, y, 2, kpiH, 'F')

    // Label
    pdf.setFontSize(7.5)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...rgb(C.muted))
    pdf.text(clean(kpi.label).toUpperCase(), M + 8, y + 7)

    // Value
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...rgb(kpi.color))
    pdf.text(clean(kpi.value), M + 8, y + 18)

    // Sublabel + detail
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...rgb(C.dark))
    const subs = wrapText(pdf, kpi.sublabel, 85)
    subs.forEach((l, li) => { pdf.text(l, M + 70, y + 10 + li * 4) })

    pdf.setFontSize(7)
    pdf.setTextColor(...rgb(C.muted))
    const dets = wrapText(pdf, kpi.detail, 85)
    dets.forEach((l, li) => { pdf.text(l, M + 70, y + 10 + subs.length * 4 + 2 + li * 3.5) })

    y += kpiH + 5
  })

  footer()

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 5 — MÉTHODOLOGIE + LEGAL
  // ═══════════════════════════════════════════════════════════════════════════
  pdf.addPage()
  pageNum = 5
  addPageHeader(pdf, M)
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
