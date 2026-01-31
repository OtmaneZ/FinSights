'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function AnalyticsDebugger() {
  const [debug, setDebug] = useState({
    cookieConsent: false,
    ga4Loaded: false,
    gtmLoaded: false,
    clarityLoaded: false,
    gtagAvailable: false,
    analytics: {
      GA_ID: process.env.NEXT_PUBLIC_GA_ID || 'DEFAULT',
      GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || 'DEFAULT',
      CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID || 'DEFAULT'
    }
  })

  useEffect(() => {
    const checkAnalytics = () => {
      const consent = localStorage.getItem('cookie-consent')
      const consentData = consent ? JSON.parse(consent) : null
      
      setDebug(prev => ({
        ...prev,
        cookieConsent: consentData?.analytics === true,
        ga4Loaded: !!window.dataLayer,
        gtmLoaded: !!(window as any).google_tag_manager,
        clarityLoaded: !!(window as any).clarity,
        gtagAvailable: !!(window as any).gtag
      }))
    }

    // Check immédiat
    checkAnalytics()

    // Check après 2s (scripts load)
    const timer = setTimeout(checkAnalytics, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Only show in development or if explicitly enabled
  if (process.env.NODE_ENV === 'production' && !localStorage.getItem('debug-analytics')) {
    return null
  }

  const checks = [
    { label: 'Cookie Consent', status: debug.cookieConsent },
    { label: 'GA4 Script', status: debug.ga4Loaded },
    { label: 'GTM Script', status: debug.gtmLoaded },
    { label: 'Clarity Script', status: debug.clarityLoaded },
    { label: 'Gtag Function', status: debug.gtagAvailable }
  ]

  const allGood = checks.every(c => c.status)

  return (
    <div className="fixed bottom-20 right-4 z-50 max-w-sm bg-white rounded-lg shadow-xl border-2 border-blue-500 p-4 text-xs">
      <div className="mb-3">
        <div className="flex items-center gap-2 font-bold text-blue-900">
          {allGood ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-orange-600" />
          )}
          Analytics Status
        </div>
      </div>

      <div className="space-y-2 mb-3">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {check.status ? (
              <CheckCircle className="w-3 h-3 text-green-600" />
            ) : (
              <XCircle className="w-3 h-3 text-red-600" />
            )}
            <span className={check.status ? 'text-gray-700' : 'text-red-700'}>
              {check.label}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t pt-2 text-xs text-gray-600 space-y-1">
        <div><strong>GA ID:</strong> {debug.analytics.GA_ID}</div>
        <div><strong>GTM ID:</strong> {debug.analytics.GTM_ID}</div>
        <div><strong>Clarity ID:</strong> {debug.analytics.CLARITY_ID}</div>
      </div>

      <button
        onClick={() => {
          localStorage.setItem('cookie-consent', JSON.stringify({
            necessary: true,
            analytics: true,
            timestamp: new Date().toISOString()
          }))
          window.location.reload()
        }}
        className="mt-3 w-full px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
      >
        Force Consentement Analytics
      </button>
    </div>
  )
}
