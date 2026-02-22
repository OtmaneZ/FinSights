import { notFound } from 'next/navigation'
import Link from 'next/link'
import { list } from '@vercel/blob'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PillarScores {
  cash: number | null
  margin: number | null
  resilience: number | null
  risk: number | null
}

interface Synthesis {
  level: string
  levelColor: string
  forces: string[]
  vulnerabilites: string[]
  priorite: string
  cashImpact: string | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function scoreColor(score: number): string {
  if (score >= 75) return '#10b981'
  if (score >= 55) return '#3b82f6'
  if (score >= 35) return '#f59e0b'
  return '#ef4444'
}

function scoreBg(score: number): string {
  if (score >= 75) return 'bg-emerald-500/10 border-emerald-500/20'
  if (score >= 55) return 'bg-blue-500/10 border-blue-500/20'
  if (score >= 35) return 'bg-amber-500/10 border-amber-500/20'
  return 'bg-red-500/10 border-red-500/20'
}

function pillarBar(score: number | null): { width: string; color: string } {
  if (score === null) return { width: '0%', color: '#334155' }
  const pct = Math.round((score / 25) * 100)
  const color =
    pct >= 75 ? '#10b981'
    : pct >= 55 ? '#3b82f6'
    : pct >= 35 ? '#f59e0b'
    : '#ef4444'
  return { width: `${pct}%`, color }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function RapportPage({
  params,
}: {
  params: { token: string }
}) {
  // Fetch rapport from Vercel Blob
  let report: {
    token: string
    email: string
    newsletterOptIn: boolean
    sector: string
    totalScore: number
    pillarScores: PillarScores
    synthesis: Synthesis
    results: Record<string, unknown>
    expiresAt: string
    createdAt: string
  } | null = null

  try {
    // List blobs matching the token prefix to get the public URL
    const { blobs } = await list({ prefix: `reports/${params.token}` })
    if (blobs.length === 0) notFound()

    const blobUrl = blobs[0].url
    const res = await fetch(blobUrl, { next: { revalidate: 0 } })
    if (!res.ok) notFound()
    report = await res.json()
  } catch {
    notFound()
  }

  if (!report) notFound()

  // Check expiry
  if (new Date() > new Date(report.expiresAt)) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <p className="text-4xl mb-4">⏱</p>
          <h1 className="text-xl font-bold text-white mb-2">Rapport expiré</h1>
          <p className="text-sm text-slate-400 mb-6">Ce rapport était valable 30 jours. Relancez le diagnostic pour en obtenir un nouveau.</p>
          <Link href="/diagnostic/guide" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
            Nouveau diagnostic →
          </Link>
        </div>
      </div>
    )
  }

  // Increment view count (fire-and-forget — no-op in blob storage, skip)

  const pillarScores = report.pillarScores as PillarScores
  const synthesis = report.synthesis as Synthesis
  const globalScore = report.totalScore ?? 0
  const color = scoreColor(globalScore)
  const bgClass = scoreBg(globalScore)

  const PILLAR_META = [
    { key: 'cash' as const, label: 'CASH', sublabel: 'Trésorerie & Liquidité', emoji: '💧' },
    { key: 'margin' as const, label: 'MARGIN', sublabel: 'Rentabilité & Performance', emoji: '📈' },
    { key: 'resilience' as const, label: 'RESILIENCE', sublabel: 'Stabilité Structurelle', emoji: '🏛' },
    { key: 'risk' as const, label: 'RISQUES', sublabel: 'Anomalies & Croisements', emoji: '⚡' },
  ]

  const createdDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(report.createdAt))
  const expiryDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(report.expiresAt))

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      {/* Top bar */}
      <div className="border-b border-slate-800/60 bg-[#0f172a]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold text-white tracking-tight">
            Fin<span className="text-blue-400">Sight</span>
          </Link>
          <p className="text-[11px] text-slate-500">Rapport confidentiel · {createdDate}</p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">

        {/* Header */}
        <div>
          <p className="text-[11px] font-semibold tracking-[0.15em] text-slate-500 uppercase mb-2">
            Score FinSight™ · Diagnostic financier
          </p>
          <h1 className="text-3xl font-bold text-white leading-tight mb-1">
            Votre rapport financier
          </h1>
          <p className="text-sm text-slate-400">
            Secteur : <span className="text-slate-300 font-medium">{report.sector}</span>
            &nbsp;·&nbsp;
            Expire le <span className="text-slate-300">{expiryDate}</span>
          </p>
        </div>

        {/* Score hero */}
        <div className={`rounded-2xl border p-8 ${bgClass}`}>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase mb-1">Score global</p>
              <p className="text-7xl font-bold leading-none" style={{ color }}>
                {globalScore}
                <span className="text-3xl text-slate-500">/100</span>
              </p>
              <p className="text-base font-semibold mt-2" style={{ color }}>{synthesis.level}</p>
            </div>
            {synthesis.cashImpact && (
              <div className="bg-slate-800/60 rounded-xl border border-slate-700/60 px-5 py-4 max-w-xs">
                <p className="text-[10px] font-semibold tracking-[0.12em] text-slate-500 uppercase mb-1">Cash immobilisé estimé</p>
                <p className="text-lg font-bold text-amber-400">{synthesis.cashImpact}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pillar grid */}
        <div>
          <p className="text-[11px] font-semibold tracking-[0.15em] text-slate-500 uppercase mb-4">Analyse par pilier</p>
          <div className="space-y-3">
            {PILLAR_META.map((p) => {
              const s = pillarScores[p.key]
              const bar = pillarBar(s)
              return (
                <div key={p.key} className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{p.emoji}</span>
                      <div>
                        <p className="text-xs font-bold tracking-wide text-white">{p.label}</p>
                        <p className="text-[11px] text-slate-500">{p.sublabel}</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold" style={{ color: bar.color }}>
                      {s !== null ? `${s}/25` : '—'}
                    </p>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: bar.width, backgroundColor: bar.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Forces & Vulns */}
        {(synthesis.forces.length > 0 || synthesis.vulnerabilites.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {synthesis.forces.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-5">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-emerald-400/60 uppercase mb-3">Points forts</p>
                <ul className="space-y-2.5">
                  {synthesis.forces.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed">
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {synthesis.vulnerabilites.length > 0 && (
              <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-5">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-red-400/60 uppercase mb-3">Points de vigilance</p>
                <ul className="space-y-2.5">
                  {synthesis.vulnerabilites.map((v, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed">
                      <span className="text-amber-400 mt-0.5 flex-shrink-0">⚠</span>
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Priorité */}
        {synthesis.priorite && (
          <div className="bg-slate-900/60 border-l-4 border-blue-500 rounded-r-xl pl-5 pr-6 py-4">
            <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-500 uppercase mb-1">Priorité d'action identifiée</p>
            <p className="text-sm text-slate-200 leading-relaxed">{synthesis.priorite}</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-slate-900/40 border border-slate-800/40 rounded-xl p-5">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-slate-600 uppercase mb-1.5">Limite de ce diagnostic</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ce score repose sur des données déclaratives et des médianes sectorielles publiques (Banque de France 2024, Altares).
            Il constitue un premier niveau de lecture et doit être interprété en tenant compte de la saisonnalité éventuelle.
            Passer d'un diagnostic à un plan d'action priorisé nécessite un audit approfondi.
          </p>
        </div>

        {/* CTA block */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase mb-3">Prochaine étape</p>
          <h2 className="text-xl font-bold text-white mb-2">Transformer ce diagnostic en plan d'action</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
            Échange stratégique 30 min — analyse de vos priorités, identification des leviers, plan d'action personnalisé. Confidentiel, sans engagement.
          </p>
          <a
            href="https://calendly.com/zineinsight"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
          >
            Réserver l'échange 30 min →
          </a>
          <p className="mt-4 text-[11px] text-slate-600">ou</p>
          <Link href="/diagnostic/guide" className="inline-block mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2">
            Refaire le diagnostic avec de nouvelles données
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 pb-8 border-t border-slate-800/40">
          <p className="text-xs text-slate-600">
            FinSight · Direction Financière Externalisée pour PME 2–20M€
            &nbsp;·&nbsp;
            <a href="https://finsight.zineinsight.com" className="hover:text-slate-400 transition-colors">finsight.zineinsight.com</a>
          </p>
        </div>

      </main>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }: { params: { token: string } }) {
  return {
    title: 'Rapport Score FinSight™ | Diagnostic Financier',
    description: 'Votre rapport de diagnostic financier personnalisé — Score FinSight™, analyse par pilier, priorités d\'action.',
    robots: 'noindex, nofollow', // Rapport privé
  }
}
