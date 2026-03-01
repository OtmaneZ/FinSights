'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, BarChart3 } from 'lucide-react'

export default function CinematicHero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // Ensure autoplay resumes after any browser interruption
    video.play().catch(() => {
      // Autoplay blocked — video stays paused, content remains visible
    })
  }, [])

  return (
    <section
      aria-label="Hero"
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* ── 1. Background video ── */}
      <video
        ref={videoRef}
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* ── 2. Deep navy gradient overlay ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-gradient-to-br from-black/80 via-[#0a1628]/75 to-[#0d1f3c]/70"
      />

      {/* ── 3. Subtle backdrop blur layer (depth without fog) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 backdrop-blur-[1px]"
      />

      {/* ── 4. Vignette edge shadow for cinematic framing ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 [background:radial-gradient(ellipse_at_center,_transparent_55%,_rgba(0,0,0,0.55)_100%)]"
      />

      {/* ── 5. Content ── */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-8 text-center">

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium tracking-widest text-slate-300 uppercase">
            Analyse financière pilotée par l'IA
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
          Pilotez vos finances{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">
            avec précision
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300/90 leading-relaxed mb-10">
          FinSight transforme vos données comptables en décisions stratégiques.
          Tableaux de bord interactifs, détection d'anomalies et copilote IA
          pour les CFO et DAF exigeants.
        </p>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-800/50"
          >
            Démarrer gratuitement
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/demo-tresoris"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm tracking-wide backdrop-blur-sm transition-all duration-200"
          >
            Voir la démo
          </Link>
        </div>

        {/* Trust row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-slate-400">
          {[
            { icon: TrendingUp, label: 'Analyse en temps réel' },
            { icon: Shield, label: 'Données 100 % privées' },
            { icon: BarChart3, label: 'Benchmarks sectoriels' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. Subtle bottom fade to page background ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-24 z-20 bg-gradient-to-t from-slate-950/80 to-transparent"
      />

      {/* ── 7. Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-50">
        <span className="text-[10px] tracking-widest text-slate-400 uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-400 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
