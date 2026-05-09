'use client'

import { X } from 'lucide-react'

export interface FreePreviewReminderBannerProps {
  visible: boolean
  onDismiss: () => void
  /** Même intention que le CTA Stripe : scroll vers le bloc paywall */
  onUnlock: () => void
}

export function FreePreviewReminderBanner({
  visible,
  onDismiss,
  onUnlock,
}: FreePreviewReminderBannerProps) {
  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] flex items-center gap-3 px-4 py-3 md:px-6 md:py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.25)] border-t border-slate-700/80"
      style={{ backgroundColor: '#0f172a' }}
      role="status"
    >
      <p className="flex-1 text-sm text-white leading-snug pr-2">
        Aperçu téléchargé · Les recommandations prioritaires et le Pack Banquier sont verrouillés
      </p>
      <button
        type="button"
        onClick={onUnlock}
        className="flex-shrink-0 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
      >
        Débloquer → 49€
      </button>
      <button
        type="button"
        onClick={onDismiss}
        className="flex-shrink-0 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        aria-label="Fermer"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}
