'use client'

import { useRef, useEffect } from 'react'
import { ArrowRight, Calendar, CheckCircle2 } from 'lucide-react'

export default function CinematicHero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {
      // Autoplay blocked — content stays fully visible
    })
  }, [])

  return (
    <section
      aria-label="Hero"
      className="relative w-full h-screen min-h-[640px] flex items-center justify-center overflow-hidden"
    >
      {/* ── 1. Background video ── */}
      <video
        ref={videoRef}
        src="/video/hero.mp4"
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

      {/* ── 3. Subtle backdrop blur for depth ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 backdrop-blur-[1px]"
      />

      {/* ── 4. Cinematic vignette ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 [background:radial-gradient(ellipse_at_center,_transparent_55%,_rgba(0,0,0,0.55)_100%)]"
      />

      {/* ── 5. Content ── */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-6 sm:px-10 lg:px-8 text-center">

        {/* Eyebrow — positionne l'expert, pas le produit */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium tracking-widest text-slate-300 uppercase">
            Direction Financière Externalisée · PME 2M€ – 20M€
          </span>
        </div>

        {/* Headline — promesse de valeur dirigeant */}
        <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold tracking-tight text-white leading-[1.1] mb-6">
          Décidez avec{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">
            trois mois d&apos;avance.
          </span>
        </h1>

        {/* Sub-headline — crédibilité + cible */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300/85 leading-relaxed mb-10">
          Score FinSight™, vision cash à 90 jours, marges réelles par activité.
          Un diagnostic stratégique pour les dirigeants qui veulent piloter,
          pas subir.
        </p>

        {/* Proof points — résultats concrets, pas des features */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-10 text-sm text-slate-300">
          {[
            '−28 jours de DSO · PME Services',
            '+340k€ de cash libéré · PME BTP',
            '+6 pts de marge nette · Groupe 500M€',
          ].map((proof) => (
            <div key={proof} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-300/80">{proof}</span>
            </div>
          ))}
        </div>

        {/* CTA — un seul chemin clair */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <a
            href="https://calendly.com/zineinsight"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-slate-900 font-semibold text-sm tracking-wide transition-all duration-200 hover:bg-slate-100 shadow-lg shadow-black/30"
          >
            <Calendar className="w-4 h-4 shrink-0" />
            Demander mon diagnostic stratégique
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>

          <a
            href="#diagnostic"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-sm tracking-wide backdrop-blur-sm transition-all duration-200"
          >
            Voir le Score FinSight™
          </a>
        </div>

        {/* Micro-réassurance */}
        <p className="text-xs text-slate-400 tracking-wide">
          Réponse sous 24h · Confidentiel · Sans engagement
        </p>
      </div>

      {/* ── 6. Bottom fade ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-24 z-20 bg-gradient-to-t from-slate-950/80 to-transparent"
      />

      {/* ── 7. Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-40">
        <span className="text-[10px] tracking-widest text-slate-400 uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-400 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
