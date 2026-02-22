'use client'

/**
 * FECDropzone — Premium drag & drop FEC file upload with auto-fill magic
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * RGPD by Design : parsing 100% client-side, aucune donnée transmise.
 *
 * Flow:
 *   1. Drag & drop or click to select FEC file (.txt / .csv)
 *   2. Quick header validation → instant feedback
 *   3. Full parse with progress bar
 *   4. Recap card showing extracted indicators
 *   5. "Lancer le diagnostic" → injects into localStorage via saveCalculation
 *
 * Used in:
 *   - diagnostic/guide/page.tsx (intro phase, Option B)
 */

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Zap,
  ArrowRight,
  X,
  TrendingUp,
  DollarSign,
  Clock,
  BarChart3,
  Loader2,
} from 'lucide-react'
import {
  parseFEC,
  quickValidateFEC,
  type FECParseResult,
  type FECExtractedData,
  type FECWizardData,
} from '@/lib/scoris/fecParser'
import type { CalculatorType } from '@/hooks/useCalculatorHistory'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type DropzoneState =
  | 'idle'        // Waiting for file
  | 'validating'  // Quick header check
  | 'parsing'     // Full FEC parse in progress
  | 'preview'     // Parsed data recap shown
  | 'error'       // Validation / parse error

interface FECDropzoneProps {
  /** Callback when user confirms injection → wizard should advance */
  onDataReady: (wizard: FECWizardData, extracted: FECExtractedData) => void
  /** Callback to switch back to manual entry */
  onSwitchToManual?: () => void
  /** CSS class */
  className?: string
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INDICATOR LABELS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const INDICATOR_META: {
  key: string
  label: string
  icon: typeof DollarSign
  format: (v: number) => string
  calcType: CalculatorType
}[] = [
  { key: 'dso', label: 'DSO', icon: Clock, format: (v) => `${v} jours`, calcType: 'dso' },
  { key: 'bfr', label: 'BFR', icon: BarChart3, format: (v) => `${v.toLocaleString('fr-FR')} €`, calcType: 'bfr' },
  { key: 'marge', label: 'Marge brute', icon: TrendingUp, format: (v) => `${v}%`, calcType: 'marge' },
  { key: 'ebitda', label: 'EBITDA', icon: DollarSign, format: (v) => `${v.toLocaleString('fr-FR')} €`, calcType: 'ebitda' },
  { key: 'burnRate', label: 'Burn Rate', icon: Zap, format: (v) => `${v.toLocaleString('fr-FR')} €/mois`, calcType: 'burn-rate' },
  { key: 'seuilRentabilite', label: 'Seuil rentabilité', icon: BarChart3, format: (v) => `${v.toLocaleString('fr-FR')} €`, calcType: 'seuil-rentabilite' },
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function FECDropzone({ onDataReady, onSwitchToManual, className = '' }: FECDropzoneProps) {
  const [state, setState] = useState<DropzoneState>('idle')
  const [isDragOver, setIsDragOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<FECParseResult | null>(null)
  const [error, setError] = useState<{ title: string; detail?: string } | null>(null)
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const progressRAF = useRef<number | null>(null)
  const pendingProgress = useRef(0)

  // ── Smooth progress updates via requestAnimationFrame ──
  const updateProgress = useCallback((p: number) => {
    pendingProgress.current = p
    if (progressRAF.current === null) {
      progressRAF.current = requestAnimationFrame(() => {
        setProgress(pendingProgress.current)
        progressRAF.current = null
      })
    }
  }, [])

  // ── File handling ──

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name)
    setFileSize(file.size)
    setError(null)
    setResult(null)

    // Step 1: Quick validation
    setState('validating')
    setProgress(0)
    const validation = await quickValidateFEC(file)

    if (!validation.valid) {
      setState('error')
      setError({
        title: 'Fichier non reconnu',
        detail: validation.reason,
      })
      return
    }

    // Step 2: Full parse
    setState('parsing')
    const parseResult = await parseFEC(file, updateProgress)

    if (!parseResult.success) {
      setState('error')
      setError({
        title: parseResult.error,
        detail: parseResult.details,
      })
      return
    }

    // Step 3: Preview
    setResult(parseResult)
    setState('preview')
  }, [updateProgress])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleConfirm = useCallback(() => {
    if (result) {
      onDataReady(result.wizard, result.extracted)
    }
  }, [result, onDataReady])

  const handleReset = useCallback(() => {
    setState('idle')
    setResult(null)
    setError(null)
    setFileName('')
    setFileSize(0)
    setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  // ── Render ──

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {/* ════════════ IDLE / DRAG ZONE ════════════ */}
        {(state === 'idle' || state === 'validating') && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`
                relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center
                transition-all duration-300 group
                ${isDragOver
                  ? 'border-blue-400 bg-blue-500/10 scale-[1.01]'
                  : 'border-gray-700 bg-slate-900/50 hover:border-gray-500 hover:bg-slate-900/70'
                }
                ${state === 'validating' ? 'pointer-events-none opacity-80' : ''}
              `}
              role="button"
              tabIndex={0}
              aria-label="Glissez votre fichier FEC ici ou cliquez pour sélectionner"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".txt,.csv,.tsv"
                onChange={handleInputChange}
                className="hidden"
                aria-hidden="true"
              />

              {state === 'validating' ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                  <p className="text-sm text-gray-400">Vérification du fichier…</p>
                </div>
              ) : (
                <>
                  <div className={`
                    w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4
                    transition-colors duration-300
                    ${isDragOver ? 'bg-blue-500/20' : 'bg-slate-800 group-hover:bg-slate-700'}
                  `}>
                    <Upload className={`w-6 h-6 transition-colors ${isDragOver ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  </div>

                  <p className="text-sm font-semibold text-white mb-1">
                    Glissez votre FEC ici
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    ou cliquez pour sélectionner · .txt, .csv · Format DGFIP standard
                  </p>

                  {/* RGPD badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-medium text-emerald-400">
                      Analyse locale sécurisée : vos données ne quittent jamais votre navigateur
                    </span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* ════════════ PARSING PROGRESS ════════════ */}
        {state === 'parsing' && (
          <motion.div
            key="parsing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-gray-700 bg-slate-900/50 p-8"
          >
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-gray-700" />
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32" cy="32" r="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${progress * 1.76} 176`}
                    className="text-blue-400 transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
              </div>

              <p className="text-sm font-semibold text-white mb-1">Analyse du FEC en cours</p>
              <p className="text-xs text-gray-500 mb-3">{fileName}</p>

              <div className="w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-[10px] text-gray-600 mt-2 tabular-nums">{progress}%</p>
            </div>
          </motion.div>
        )}

        {/* ════════════ PREVIEW / RECAP ════════════ */}
        {state === 'preview' && result && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-gray-700 bg-slate-900/50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-emerald-500/5 border-b border-emerald-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">FEC analysé avec succès</p>
                  <p className="text-[11px] text-gray-500">
                    {result.extracted.nbEcritures.toLocaleString('fr-FR')} écritures
                    · {result.extracted.dateDebut} → {result.extracted.dateFin}
                    · {fileSize > 0 ? `${(fileSize / (1024 * 1024)).toFixed(1)} Mo` : ''}
                    · Qualité {result.dataQuality}%
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                aria-label="Réinitialiser"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

            {/* Extracted indicators grid */}
            <div className="px-6 py-5">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">
                Indicateurs extraits automatiquement
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INDICATOR_META.map((ind) => {
                  const data = result.wizard[ind.key as keyof FECWizardData]
                  if (!data || (typeof data === 'object' && 'value' in data && data.value === 0 && ind.key !== 'bfr')) {
                    return (
                      <div key={ind.key} className="px-3 py-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50 opacity-40">
                        <div className="flex items-center gap-1.5 mb-1">
                          <ind.icon className="w-3 h-3 text-gray-600" />
                          <span className="text-[10px] font-medium text-gray-600">{ind.label}</span>
                        </div>
                        <p className="text-xs text-gray-700">—</p>
                      </div>
                    )
                  }
                  const val = (data as { value: number }).value
                  return (
                    <motion.div
                      key={ind.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * INDICATOR_META.indexOf(ind), duration: 0.3 }}
                      className="px-3 py-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <ind.icon className="w-3 h-3 text-blue-400" />
                        <span className="text-[10px] font-medium text-gray-400">{ind.label}</span>
                      </div>
                      <p className="text-sm font-semibold text-white tabular-nums">{ind.format(val)}</p>
                    </motion.div>
                  )
                })}

                {/* Gearing — special treatment (nullable) */}
                {result.wizard.gearing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                    className="px-3 py-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <BarChart3 className="w-3 h-3 text-blue-400" />
                      <span className="text-[10px] font-medium text-gray-400">Gearing</span>
                    </div>
                    <p className="text-sm font-semibold text-white tabular-nums">{result.wizard.gearing.value}x</p>
                  </motion.div>
                )}
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="mt-4 space-y-1.5">
                  {result.warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-amber-400/70">
                      <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CA highlight */}
              {result.extracted.ca > 0 && (
                <div className="mt-4 px-4 py-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                  <p className="text-xs text-blue-300">
                    <span className="font-semibold">CA détecté : {result.extracted.ca.toLocaleString('fr-FR')} €</span>
                    {result.extracted.facteurAnnualisation > 1 && (
                      <span className="text-blue-400/60">
                        {' '}(annualisé — exercice de {result.extracted.moisExercice} mois)
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="px-6 py-4 bg-slate-900/80 border-t border-gray-800">
              <button
                onClick={handleConfirm}
                className="group w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-slate-950 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg shadow-white/10"
              >
                <Zap className="w-4 h-4" />
                Lancer le diagnostic avec ces données
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-4 mt-3">
                <button
                  onClick={handleReset}
                  className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2"
                >
                  Charger un autre fichier
                </button>
                {onSwitchToManual && (
                  <>
                    <span className="text-gray-800 text-[10px]">·</span>
                    <button
                      onClick={onSwitchToManual}
                      className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2"
                    >
                      Saisie manuelle
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ════════════ ERROR STATE ════════════ */}
        {state === 'error' && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-red-500/20 bg-red-500/5 p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white mb-1">{error.title}</p>
                {error.detail && (
                  <p className="text-xs text-gray-400 leading-relaxed">{error.detail}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Réessayer
              </button>
              {onSwitchToManual && (
                <button
                  onClick={onSwitchToManual}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-lg border border-gray-700 transition-colors"
                >
                  Passer à la saisie manuelle
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
