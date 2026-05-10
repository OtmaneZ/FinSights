'use client'

import { useState, useCallback } from 'react'
import {
  BarChart3, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2,
  ChevronDown, Info, Loader2, Building2, Search
} from 'lucide-react'
import Header from '@/components/Header'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RatioQuartiles {
  q1: number | null
  median: number | null
  q3: number | null
}

interface BenchmarkRatio {
  name: string
  label: string
  category: string
  value: number
  sector: RatioQuartiles
  performance: 'top_quartile' | 'above_median' | 'at_median' | 'below_median' | 'bottom_quartile' | 'not_available'
  deviation_from_median: number
  is_strength: boolean
  is_weakness: boolean
}

interface BenchmarkResponse {
  company_id: string
  sector: {
    naf_code: string
    naf_label: string
    company_size: string
    reference_year: number
  }
  computed_at: string
  overall_score: number
  score_interpretation: string
  ratios: BenchmarkRatio[]
  strengths: string[]
  weaknesses: string[]
  data_source: string
  data_disclaimer: string
  error?: string
}

interface SectorItem {
  naf_code: string
  label: string
  sample_size: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PERFORMANCE_CONFIG = {
  top_quartile:    { label: 'Top 25%',         color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: TrendingUp },
  above_median:    { label: 'Au-dessus médiane', color: 'text-blue-700',   bg: 'bg-blue-50',    border: 'border-blue-200',    icon: TrendingUp },
  at_median:       { label: 'Dans la médiane',  color: 'text-gray-700',   bg: 'bg-gray-50',    border: 'border-gray-200',    icon: Minus },
  below_median:    { label: 'Sous la médiane',  color: 'text-amber-700',  bg: 'bg-amber-50',   border: 'border-amber-200',   icon: TrendingDown },
  bottom_quartile: { label: 'Bottom 25%',       color: 'text-red-700',    bg: 'bg-red-50',     border: 'border-red-200',     icon: TrendingDown },
  not_available:   { label: 'N/A',              color: 'text-gray-400',   bg: 'bg-gray-50',    border: 'border-gray-100',    icon: Minus },
}

const RATIO_LABELS: Record<string, string> = {
  marge_ebitda:              'Marge EBITDA (EBG%)',
  marge_nette:               'Marge nette',
  ratio_charges_personnel:   'Charges personnel / VA',
  ratio_charges_externes:    'Charges externes / CA',
  ratio_achats:              'Taux d\'approvisionnement',
}

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444'
  const label = score >= 70 ? 'Bonne performance' : score >= 45 ? 'Performance moyenne' : 'Performance faible'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="50" cy="50" r="42" fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={`${(score / 100) * 263.9} 263.9`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{Math.round(score)}</span>
          <span className="text-xs text-gray-400">/100</span>
        </div>
      </div>
      <span className="text-sm font-medium" style={{ color }}>{label}</span>
    </div>
  )
}

function RatioBar({ ratio }: { ratio: BenchmarkRatio }) {
  const perf = PERFORMANCE_CONFIG[ratio.performance]
  const PerfIcon = perf.icon

  // Position the company value on a scale from Q1 to Q3
  const q1 = ratio.sector.q1 ?? 0
  const q3 = ratio.sector.q3 ?? 100
  const median = ratio.sector.median ?? (q1 + q3) / 2
  const range = q3 - q1 || 1
  const valuePos = Math.min(100, Math.max(0, ((ratio.value - q1) / range) * 100))
  const medianPos = Math.min(100, Math.max(0, ((median - q1) / range) * 100))

  return (
    <div className={`p-4 rounded-lg border ${perf.bg} ${perf.border}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {RATIO_LABELS[ratio.name] || ratio.label}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 capitalize">{ratio.category}</p>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${perf.bg} ${perf.color}`}>
          <PerfIcon className="w-3 h-3" />
          {perf.label}
        </div>
      </div>

      {/* Value + deviation */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-gray-900">{ratio.value.toFixed(1)}%</span>
        {ratio.deviation_from_median !== 0 && (
          <span className={`text-sm font-medium ${ratio.deviation_from_median > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {ratio.deviation_from_median > 0 ? '+' : ''}{ratio.deviation_from_median.toFixed(1)} pts vs médiane
          </span>
        )}
      </div>

      {/* Quartile bar */}
      {ratio.sector.q1 !== null && ratio.sector.q3 !== null && (
        <div className="space-y-1">
          <div className="relative h-4 bg-white rounded-full border border-gray-200 overflow-visible">
            {/* Q1 → Q3 band */}
            <div className="absolute inset-y-0 left-0 right-0 bg-gray-100 rounded-full" />
            {/* Median line */}
            <div
              className="absolute inset-y-0 w-0.5 bg-gray-400"
              style={{ left: `${medianPos}%` }}
            />
            {/* Company dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-900 border-2 border-white shadow-md z-10"
              style={{ left: `calc(${valuePos}% - 8px)` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Q1 {ratio.sector.q1.toFixed(1)}%</span>
            <span>Médiane {ratio.sector.median?.toFixed(1)}%</span>
            <span>Q3 {ratio.sector.q3.toFixed(1)}%</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BenchmarkPage() {
  const [nafCode, setNafCode] = useState('')
  const [sectors, setSectors] = useState<SectorItem[]>([])
  const [showSectorList, setShowSectorList] = useState(false)
  const [ebitdaInput, setEbitdaInput] = useState('')
  const [personnelInput, setPersonnelInput] = useState('')
  const [achatsInput, setAchatsInput] = useState('')
  const [chargesExtInput, setChargesExtInput] = useState('')
  const [caInput, setCaInput] = useState('')
  const [resultatInput, setResultatInput] = useState('')
  const [result, setResult] = useState<BenchmarkResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sectorsLoaded, setSectorsLoaded] = useState(false)

  const loadSectors = useCallback(async () => {
    if (sectorsLoaded) return
    try {
      const res = await fetch('/api/benchmark')
      if (res.ok) {
        const data = await res.json()
        setSectors(data.sectors || [])
        setSectorsLoaded(true)
      }
    } catch {
      // backend might not be running
    }
  }, [sectorsLoaded])

  const handleSectorFocus = () => {
    loadSectors()
    setShowSectorList(true)
  }

  const handleSectorSelect = (code: string) => {
    setNafCode(code)
    setShowSectorList(false)
  }

  const filteredSectors = sectors.filter(s =>
    s.naf_code.toLowerCase().includes(nafCode.toLowerCase()) ||
    s.label.toLowerCase().includes(nafCode.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    const ca = parseFloat(caInput) || 0
    const ebitda = parseFloat(ebitdaInput) || 0
    const resultat = parseFloat(resultatInput) || 0
    const personnel = parseFloat(personnelInput) || 0
    const achats = parseFloat(achatsInput) || 0
    const chargesExt = parseFloat(chargesExtInput) || 0

    // Build ebitda_lines using signed convention (CA = negative, charges = positive)
    const ebitda_lines: Record<string, number> = {
      "chiffre d'affaires": -Math.abs(ca),
    }
    if (personnel > 0) ebitda_lines["charges de personnel"] = Math.abs(personnel)
    if (achats > 0)    ebitda_lines["achats consommés"] = Math.abs(achats)
    if (chargesExt > 0) ebitda_lines["charges externes"] = Math.abs(chargesExt)

    // ebitda_total: négatif si rentable (pipeline convention)
    const ebitda_total = -Math.abs(ebitda)
    const resultat_total = -Math.abs(resultat)

    try {
      const res = await fetch('/api/benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          naf_code: nafCode,
          ebitda_lines,
          hors_ebitda_lines: {},
          ebitda_total,
          resultat_total,
          company_id: 'frontend-demo',
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || `Erreur ${res.status}`)
      } else {
        setResult(data)
      }
    } catch (err) {
      setError('Impossible de contacter le backend. Vérifiez que le serveur est démarré.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Benchmark Sectoriel</h1>
          </div>
          <p className="text-sm text-gray-500">
            Comparez vos ratios financiers aux médianes sectorielles officielles.
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-1.5 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Données certifiées - Banque de France FIBEN 2024 (publiées novembre 2025)
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Saisir vos données</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NAF Code */}
            <div className="md:col-span-2 relative">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Code NAF / Secteur <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={nafCode}
                  onChange={e => setNafCode(e.target.value)}
                  onFocus={handleSectorFocus}
                  onBlur={() => setTimeout(() => setShowSectorList(false), 200)}
                  placeholder="ex: 62.01Z ou tapez un secteur..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {showSectorList && filteredSectors.length > 0 && (
                <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {filteredSectors.map(s => (
                    <button
                      key={s.naf_code}
                      type="button"
                      onMouseDown={() => handleSectorSelect(s.naf_code)}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between group"
                    >
                      <div>
                        <span className="text-xs font-mono font-semibold text-gray-500 mr-2">{s.naf_code}</span>
                        <span className="text-sm text-gray-800">{s.label}</span>
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-gray-600">
                        N={s.sample_size.toLocaleString('fr-FR')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CA */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Chiffre d&apos;affaires (€) <span className="text-red-500">*</span>
              </label>
              <input
                type="number" min="0" step="1000"
                value={caInput}
                onChange={e => setCaInput(e.target.value)}
                placeholder="ex: 1 500 000"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>

            {/* EBITDA */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                EBITDA / EBE (€) <span className="text-red-500">*</span>
              </label>
              <input
                type="number" step="1000"
                value={ebitdaInput}
                onChange={e => setEbitdaInput(e.target.value)}
                placeholder="ex: 120 000"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>

            {/* Résultat net */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Résultat net (€)</label>
              <input
                type="number" step="1000"
                value={resultatInput}
                onChange={e => setResultatInput(e.target.value)}
                placeholder="ex: 85 000"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {/* Charges personnel */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Charges de personnel (€)</label>
              <input
                type="number" min="0" step="1000"
                value={personnelInput}
                onChange={e => setPersonnelInput(e.target.value)}
                placeholder="ex: 600 000"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {/* Achats */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Achats consommés (€)</label>
              <input
                type="number" min="0" step="1000"
                value={achatsInput}
                onChange={e => setAchatsInput(e.target.value)}
                placeholder="ex: 300 000"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {/* Charges externes */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Charges externes (€)</label>
              <input
                type="number" min="0" step="1000"
                value={chargesExtInput}
                onChange={e => setChargesExtInput(e.target.value)}
                placeholder="ex: 120 000"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !nafCode || !caInput || !ebitdaInput}
            className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analyse en cours...</>
            ) : (
              <><BarChart3 className="w-4 h-4" /> Lancer le benchmark</>
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">Erreur</p>
              <p className="text-sm text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-5">
            {/* Score + context */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ScoreGauge score={result.overall_score} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-mono text-gray-500">{result.sector.naf_code}</span>
                    <span className="text-sm text-gray-700 font-medium">{result.sector.naf_label}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{result.score_interpretation}</p>

                  {/* Strengths / Weaknesses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.strengths.length > 0 && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-emerald-800 mb-1.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Points forts
                        </p>
                        <ul className="space-y-1">
                          {result.strengths.map((s, i) => (
                            <li key={i} className="text-xs text-emerald-700">• {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.weaknesses.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-amber-800 mb-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Points d&apos;amélioration
                        </p>
                        <ul className="space-y-1">
                          {result.weaknesses.map((w, i) => (
                            <li key={i} className="text-xs text-amber-700">• {w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ratios detail */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Détail des ratios</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.ratios.map(ratio => (
                  <RatioBar key={ratio.name} ratio={ratio} />
                ))}
              </div>
            </div>

            {/* Source footer */}
            <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-700">Source des données sectorielles</p>
                <p className="text-xs text-gray-500 mt-0.5">{result.data_disclaimer}</p>
              </div>
            </div>
          </div>
        )}

        {result?.error && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800">{result.error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
