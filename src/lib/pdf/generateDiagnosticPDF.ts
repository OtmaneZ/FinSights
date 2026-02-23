/**
 * DIAGNOSTIC PDF GENERATOR — Big Four Edition
 *
 * Generates a 4-page A4 portrait consulting-grade report.
 * Pure jsPDF — no DOM capture, no html2canvas dependency.
 *
 * Page 1: Cover
 * Page 2: Executive Summary (score + pillars)
 * Page 3: Priorités d'action (cash impact, DSO lever)
 * Page 4: Benchmarks & Méthodologie + Legal disclaimer
 */

import jsPDF from 'jspdf'
import {
  type DiagnosticScore,
  type SectorKey,
  type Insight,
  SECTOR_BENCHMARKS,
  LEVEL_CONFIG,
} from '@/lib/scoring/diagnosticScore'

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  navy:     [15, 23, 42]   as const,  // slate-950
  dark:     [30, 41, 59]   as const,  // slate-800
  text:     [51, 65, 85]   as const,  // slate-600
  muted:    [100, 116, 139] as const, // slate-500
  light:    [148, 163, 184] as const, // slate-400
  border:   [226, 232, 240] as const, // slate-200
  bg:       [248, 250, 252] as const, // slate-50
  accent:   [0, 82, 204]   as const,  // deep blue
  green:    [16, 185, 129]  as const,  // emerald-500
  amber:    [217, 119, 6]   as const,  // amber-600
  red:      [220, 38, 38]   as const,  // red-600
  white:    [255, 255, 255] as const,
} as const

type RGB = readonly [number, number, number]

// ─── Helpers ────────────────────────────────────────────────────────────────

function rgb(c: RGB) { return c as unknown as [number, number, number] }

/** Clean non-breaking spaces for jsPDF */
function clean(text: string): string {
  return text
    .replace(/\u00A0/g, ' ')
    .replace(/\u202F/g, ' ')
    .replace(/[\u2000-\u200B]/g, ' ')
    .trim()
}

/** Wrap text into lines that fit maxWidth (mm) */
function wrapText(pdf: jsPDF, text: string, maxWidth: number): string[] {
  return pdf.splitTextToSize(clean(text), maxWidth)
}

/** Ensure Y won't overflow page; add new page if needed */
function ensureSpace(
  pdf: jsPDF,
  y: number,
  needed: number,
  margin: number,
  pageH: number,
  footerH: number,
  addFooter: () => void,
): number {
  if (y + needed > pageH - margin - footerH) {
    addFooter()
    pdf.addPage()
    addPageHeader(pdf, margin)
    return margin + 18 // after header
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
  pdf.setFontSize(7)
  pdf.setTextColor(...rgb(C.light))
  pdf.setFont('helvetica', 'normal')
  pdf.text('Document confidentiel — ne pas diffuser sans autorisation', margin, h - 10)
  pdf.text(`${pageNum}`, w - margin, h - 10, { align: 'right' })
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DiagnosticPDFData {
  diagnostic: DiagnosticScore
  insights: Insight
  sector: SectorKey
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
  const W = pdf.internal.pageSize.getWidth()   // 210
  const H = pdf.internal.pageSize.getHeight()  // 297
  const M = 20 // margin
  const CW = W - 2 * M // content width = 170
  const FOOTER_H = 18
  let pageNum = 0

  const footer = () => { pageNum++; addPageFooter(pdf, M, pageNum) }

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 1 — COVER
  // ═══════════════════════════════════════════════════════════════════════════
  pageNum = 1

  // Top line accent
  pdf.setFillColor(...rgb(C.accent))
  pdf.rect(0, 0, W, 3, 'F')

  // Logo text (clean, no image dependency)
  pdf.setFontSize(28)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.navy))
  pdf.text('FinSight', M, 40)

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...rgb(C.muted))
  pdf.text('Intelligence Financiere Augmentee', M, 48)

  // Separator
  pdf.setDrawColor(...rgb(C.accent))
  pdf.setLineWidth(0.8)
  pdf.line(M, 58, M + 40, 58)

  // Title block
  pdf.setFontSize(32)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.navy))
  pdf.text('Diagnostic de', M, 90)
  pdf.text('Performance Financiere', M, 103)

  // Company / file name
  const displayName = data.companyName || data.fileName || 'Mon Entreprise'
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...rgb(C.text))
  pdf.text(clean(displayName), M, 125)

  // Metadata block
  const metaY = 150
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...rgb(C.muted))

  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const metaLines = [
    `Date du rapport : ${dateStr}`,
    `Secteur d'analyse : ${SECTOR_BENCHMARKS[data.sector]?.label || 'Tous secteurs'}`,
    `Indicateurs analyses : ${data.completedCount} / ${data.totalCalculators}`,
    `Moteur : SCORIS v1 — Score FinSight`,
  ]
  if (data.fecMeta) {
    metaLines.push(`Source : FEC (${data.fecMeta.nbEcritures?.toLocaleString('fr-FR')} ecritures)`)
  }
  metaLines.forEach((line, i) => {
    pdf.text(clean(line), M, metaY + i * 7)
  })

  // Bottom bar
  pdf.setFillColor(...rgb(C.navy))
  pdf.rect(0, H - 30, W, 30, 'F')
  pdf.setFontSize(8)
  pdf.setTextColor(...rgb(C.white))
  pdf.setFont('helvetica', 'normal')
  pdf.text('Document confidentiel — ne pas diffuser sans autorisation', M, H - 15)
  pdf.text('finsight.zineinsight.com', W - M, H - 15, { align: 'right' })

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 2 — EXECUTIVE SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════
  pdf.addPage()
  pageNum = 2
  addPageHeader(pdf, M)
  let y = M + 18

  // Section title
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.accent))
  pdf.text('SYNTHESE EXECUTIVE', M, y)
  y += 10

  // Score block
  const levelCfg = LEVEL_CONFIG[data.diagnostic.level]
  const scoreColor: RGB = data.diagnostic.level === 'excellent' || data.diagnostic.level === 'bon'
    ? C.green
    : data.diagnostic.level === 'vigilance' ? C.amber : C.red

  // Score card background
  pdf.setFillColor(...rgb(C.bg))
  pdf.roundedRect(M, y, CW, 45, 3, 3, 'F')
  pdf.setDrawColor(...rgb(C.border))
  pdf.setLineWidth(0.3)
  pdf.roundedRect(M, y, CW, 45, 3, 3, 'S')

  // Score number
  const scoreVal = data.diagnostic.total !== null ? `${data.diagnostic.total}` : '--'
  pdf.setFontSize(48)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(scoreColor))
  pdf.text(scoreVal, M + 15, y + 32)

  // /100
  pdf.setFontSize(16)
  pdf.setTextColor(...rgb(C.light))
  pdf.text('/ 100', M + 55, y + 32)

  // Level label
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(scoreColor))
  pdf.text(clean(levelCfg.label), M + 90, y + 20)

  // Confidence
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...rgb(C.muted))
  pdf.text(`Indice de confiance : ${data.diagnostic.confidence}`, M + 90, y + 30)
  pdf.text(`${data.diagnostic.completedPillars}/4 piliers completes`, M + 90, y + 37)

  y += 55

  // DAF Virtuel synthesis line
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
    synthLines.forEach((line, i) => {
      pdf.text(line, M + 5, y + i * 5)
    })
    y += synthLines.length * 5 + 5

    pdf.setFontSize(7)
    pdf.setTextColor(...rgb(C.light))
    pdf.text('— DAF Virtuel FinSight', M + 5, y)
    y += 12
  }

  // ── 4 Pillars ──
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.accent))
  pdf.text('PERFORMANCE PAR PILIER', M, y)
  y += 8

  const pillarOrder: Array<{ key: string; label: string }> = [
    { key: 'cash', label: 'Tresorerie & Cash' },
    { key: 'margin', label: 'Rentabilite & Marges' },
    { key: 'resilience', label: 'Resilience & Croissance' },
    { key: 'risk', label: 'Risques & Anomalies' },
  ]

  const pillarCardW = (CW - 6) / 2
  const pillarCardH = 32

  pillarOrder.forEach((p, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const px = M + col * (pillarCardW + 6)
    const py = y + row * (pillarCardH + 6)
    const pillar = data.diagnostic.pillars[p.key as keyof typeof data.diagnostic.pillars]

    // Card bg
    pdf.setFillColor(...rgb(C.white))
    pdf.roundedRect(px, py, pillarCardW, pillarCardH, 2, 2, 'F')
    pdf.setDrawColor(...rgb(C.border))
    pdf.setLineWidth(0.3)
    pdf.roundedRect(px, py, pillarCardW, pillarCardH, 2, 2, 'S')

    // Pillar label
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...rgb(C.dark))
    pdf.text(clean(p.label), px + 5, py + 9)

    // Score or "Données insuffisantes"
    if (pillar.score !== null) {
      // Score bar background
      const barX = px + 5
      const barY = py + 14
      const barW = pillarCardW - 10
      const barH = 4
      pdf.setFillColor(...rgb(C.bg))
      pdf.roundedRect(barX, barY, barW, barH, 1, 1, 'F')

      // Score bar fill
      const pct = Math.min(pillar.score / 25, 1)
      const fillColor: RGB = pct >= 0.7 ? C.green : pct >= 0.4 ? C.amber : C.red
      pdf.setFillColor(...rgb(fillColor))
      pdf.roundedRect(barX, barY, barW * pct, barH, 1, 1, 'F')

      // Score value
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...rgb(fillColor))
      pdf.text(`${pillar.score}/25`, px + 5, py + 28)

      // Indicators count
      const doneCount = pillar.calculators.filter(c => c.done).length
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...rgb(C.muted))
      pdf.text(`${doneCount} indicateur${doneCount > 1 ? 's' : ''}`, px + pillarCardW - 5, py + 28, { align: 'right' })
    } else {
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'italic')
      pdf.setTextColor(...rgb(C.light))
      pdf.text('Donnees insuffisantes', px + 5, py + 22)
    }
  })

  y += 2 * (pillarCardH + 6) + 4

  // ── Insights summary (forces / vulnerabilities) ──
  y = ensureSpace(pdf, y, 40, M, H, FOOTER_H, footer)

  const forces = data.insights.forces.slice(0, 3)
  const vulns = data.insights.vulnerabilites.slice(0, 3)

  if (forces.length > 0 || vulns.length > 0) {
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...rgb(C.accent))
    pdf.text('SIGNAUX CLES', M, y)
    y += 7

    const renderStringList = (items: string[], startY: number, labelColor: RGB, bulletChar: string): number => {
      let cy = startY
      items.forEach(text => {
        cy = ensureSpace(pdf, cy, 12, M, H, FOOTER_H, footer)
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(...rgb(labelColor))
        pdf.text(bulletChar, M + 2, cy)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(...rgb(C.dark))
        const wrapped = wrapText(pdf, text, CW - 12)
        wrapped.forEach(line => {
          pdf.text(line, M + 8, cy)
          cy += 4.5
        })
        cy += 2
      })
      return cy
    }

    if (forces.length > 0) {
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...rgb(C.green))
      pdf.text('FORCES', M + 2, y)
      y += 5
      y = renderStringList(forces, y, C.green, '+')
      y += 3
    }

    if (vulns.length > 0) {
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...rgb(C.red))
      pdf.text('VULNERABILITES', M + 2, y)
      y += 5
      y = renderStringList(vulns, y, C.red, '!')
    }
  }

  footer()

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 3 — PRIORITES D'ACTION
  // ═══════════════════════════════════════════════════════════════════════════
  pdf.addPage()
  pageNum = 3
  addPageHeader(pdf, M)
  y = M + 18

  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.accent))
  pdf.text('PRIORITES D\'ACTION', M, y)
  y += 10

  // Build priority list from insights
  const priorityItems: string[] = []
  if (data.insights.priorite) priorityItems.push(data.insights.priorite)
  data.insights.vulnerabilites.forEach(v => priorityItems.push(v))

  if (priorityItems.length > 0) {
    priorityItems.slice(0, 5).forEach((text, idx) => {
      y = ensureSpace(pdf, y, 35, M, H, FOOTER_H, footer)

      // Priority card
      pdf.setFillColor(...rgb(C.bg))
      pdf.roundedRect(M, y, CW, 28, 2, 2, 'F')
      pdf.setDrawColor(...rgb(C.border))
      pdf.setLineWidth(0.3)
      pdf.roundedRect(M, y, CW, 28, 2, 2, 'S')

      // Priority number
      pdf.setFillColor(...rgb(idx === 0 ? C.red : C.amber))
      pdf.roundedRect(M + 5, y + 5, 18, 18, 2, 2, 'F')
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...rgb(C.white))
      pdf.text(`#${idx + 1}`, M + 9, y + 17)

      // Text
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...rgb(C.dark))
      const lines = wrapText(pdf, text, CW - 40)
      lines.slice(0, 2).forEach((line, li) => {
        pdf.text(line, M + 30, y + 12 + li * 5)
      })

      y += 34
    })
  } else {
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'italic')
    pdf.setTextColor(...rgb(C.muted))
    pdf.text('Aucune priorite critique identifiee — situation saine.', M, y + 5)
    y += 20
  }

  // ── Cash Impact Focus ──
  y = ensureSpace(pdf, y, 60, M, H, FOOTER_H, footer)
  y += 5

  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.accent))
  pdf.text('IMPACT CASH — LEVIER DSO', M, y)
  y += 8

  // Explanation block
  pdf.setFillColor(...rgb(C.white))
  pdf.roundedRect(M, y, CW, 50, 3, 3, 'F')
  pdf.setDrawColor(...rgb(C.accent))
  pdf.setLineWidth(0.5)
  pdf.line(M, y, M, y + 50) // left accent bar

  const cashPillar = data.diagnostic.pillars.cash
  const bench = SECTOR_BENCHMARKS[data.sector]

  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...rgb(C.text))

  const cashLines = [
    `Score Tresorerie : ${cashPillar.score !== null ? cashPillar.score + '/25' : 'Non calcule'}`,
    '',
    `DSO mediane sectorielle (${bench.label}) : ${bench.dsoMedian} jours`,
    `BFR mediane sectorielle : ${bench.bfrJoursMedian} jours de CA`,
    '',
    'Le DSO (Days Sales Outstanding) est le levier le plus direct pour',
    'ameliorer la tresorerie. Chaque jour de DSO reduit libere du cash',
    'disponible pour l\'exploitation et les investissements.',
    '',
    'Recommandation : automatiser les relances factures, negocier des',
    'acomptes sur les projets > 5 000 EUR, reviser les conditions de paiement.',
  ]

  cashLines.forEach((line, i) => {
    pdf.text(clean(line), M + 6, y + 6 + i * 4.2)
  })

  y += 58

  footer()

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 4 — BENCHMARKS & METHODOLOGIE
  // ═══════════════════════════════════════════════════════════════════════════
  pdf.addPage()
  pageNum = 4
  addPageHeader(pdf, M)
  y = M + 18

  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.accent))
  pdf.text('COMPARAISON SECTORIELLE', M, y)
  y += 8

  // Benchmark table
  const benchHeaders = ['Indicateur', 'Mediane sectorielle', 'Votre positionnement']
  const colWidths = [55, 55, 60]

  // Header row
  pdf.setFillColor(...rgb(C.navy))
  pdf.rect(M, y, CW, 8, 'F')
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.white))
  let colX = M
  benchHeaders.forEach((header, i) => {
    pdf.text(clean(header), colX + 3, y + 5.5)
    colX += colWidths[i]
  })
  y += 8

  // Data rows
  const benchRows = [
    { label: 'DSO (delai encaissement)', value: `${bench.dsoMedian} jours`, position: cashPillar.score !== null ? 'Analyse disponible' : 'Non mesure' },
    { label: 'Marge brute mediane', value: `${bench.margeMedian}%`, position: data.diagnostic.pillars.margin.score !== null ? 'Analyse disponible' : 'Non mesure' },
    { label: 'BFR (jours de CA)', value: `${bench.bfrJoursMedian} jours`, position: cashPillar.score !== null ? 'Analyse disponible' : 'Non mesure' },
    { label: 'EBITDA median', value: `${bench.ebitdaMedian}%`, position: data.diagnostic.pillars.margin.score !== null ? 'Analyse disponible' : 'Non mesure' },
  ]

  benchRows.forEach((row, i) => {
    const rowY = y + i * 8
    pdf.setFillColor(...rgb(i % 2 === 0 ? C.bg : C.white))
    pdf.rect(M, rowY, CW, 8, 'F')

    pdf.setFontSize(7.5)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...rgb(C.dark))

    let cx = M
    ;[row.label, row.value, row.position].forEach((cell, ci) => {
      pdf.text(clean(cell), cx + 3, rowY + 5.5)
      cx += colWidths[ci]
    })
  })

  y += benchRows.length * 8 + 10

  // Sector info
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'italic')
  pdf.setTextColor(...rgb(C.muted))
  pdf.text(`Secteur : ${bench.label} — Sources : Banque de France, INSEE, Altares (2024)`, M, y)
  y += 15

  // ── Methodology ──
  y = ensureSpace(pdf, y, 50, M, H, FOOTER_H, footer)

  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...rgb(C.accent))
  pdf.text('METHODOLOGIE', M, y)
  y += 8

  pdf.setFontSize(7.5)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...rgb(C.text))

  const methodoLines = [
    'Score FinSight : score composite 0-100 calcule sur 4 piliers ponderes (Tresorerie 25, Rentabilite 25, Resilience 25, Risques 25).',
    '',
    'Chaque indicateur est compare aux medianes sectorielles francaises (Banque de France, INSEE, Altares 2024). Les seuils sont relatifs, pas absolus : un burn rate de 15k EUR/mois est maitrise pour une entreprise a 600k EUR CA, mais critique a 100k EUR CA.',
    '',
    'Moteurs d\'analyse : SCORIS (scoring multi-pilier), TRESORIS (analyse causale de tresorerie), DASHIS (simulations What-If).',
    '',
    'Confiance : Haute (4/4 piliers) / Moyenne (2-3) / Faible (1). Score extrapole sur 100 a partir des piliers disponibles.',
    '',
    'Import FEC : parsing 100% local (navigateur). Le fichier n\'est jamais stocke sur un serveur ni transmis a un tiers.',
  ]

  methodoLines.forEach(line => {
    if (line === '') { y += 2; return }
    y = ensureSpace(pdf, y, 10, M, H, FOOTER_H, footer)
    const wrapped = wrapText(pdf, line, CW)
    wrapped.forEach(wl => {
      pdf.text(wl, M, y)
      y += 4
    })
    y += 1
  })

  y += 10

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
  const disclaimerLines = wrapText(
    pdf,
    'Ce document est genere automatiquement a titre informatif. Il ne constitue en aucun cas un conseil financier, fiscal ou juridique. Les scores et recommandations sont bases sur les donnees declarees par l\'utilisateur et les medianes sectorielles publiques. FinSight decline toute responsabilite en cas de decision fondee exclusivement sur ce rapport. Pour un audit complet, nous recommandons de consulter un expert-comptable ou un DAF qualifie.',
    CW - 10,
  )
  disclaimerLines.forEach((line, i) => {
    pdf.text(line, M + 5, y + 11 + i * 3.2)
  })

  footer()

  // ═══════════════════════════════════════════════════════════════════════════
  // SAVE
  // ═══════════════════════════════════════════════════════════════════════════
  const safeName = (data.companyName || data.fileName || 'diagnostic')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 40)
  pdf.save(`FinSight_Diagnostic_${safeName}.pdf`)
}
