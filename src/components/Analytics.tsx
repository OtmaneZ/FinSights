'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function Analytics() {
  const [hasConsent, setHasConsent] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  // Bloquer tout tracking en développement
  const isProduction = process.env.NODE_ENV === 'production'

  // IDs Google Analytics (fallback à des IDs de démo si pas d'env vars)
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-58BZSL7W'
  const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || 'ud37rbzjnx'
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-GEE0265TEB'

  // Vérifier le consentement au mount ET quand localStorage change
  useEffect(() => {
    setIsMounted(true)
    
    const checkConsent = () => {
      const consent = localStorage.getItem('cookie-consent')
      if (consent) {
        try {
          const consentData = JSON.parse(consent)
          setHasConsent(consentData.analytics === true)
        } catch (e) {
          console.error('❌ Invalid cookie consent data:', e)
          setHasConsent(false)
        }
      } else {
        setHasConsent(false)
      }
    }

    checkConsent()

    // Écouter les changements de localStorage (cross-tab)
    const handleStorageChange = () => {
      checkConsent()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Ne charger les scripts que si:
  // 1) Monté en client
  // 2) Utilisateur a consenti
  // 3) Environnement de production (exclut localhost)
  if (!isMounted || !hasConsent || !isProduction) {
    return null
  }

  return (
    <>
      {/* Google Analytics 4 - Load gtag library */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ Google Analytics script loaded')
        }}
      />

      {/* Google Analytics 4 - Initialize gtag */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure'
            });
            console.log('✅ GA4 initialized with ID: ${GA_ID}');
          `
        }}
      />

      {/* Google Tag Manager - For GTM container */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
            console.log('✅ GTM initialized with ID: ${GTM_ID}');
          `
        }}
      />

      {/* Microsoft Clarity - Behavior analytics */}
      <Script
        id="microsoft-clarity"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", '${CLARITY_ID}');
            console.log('✅ Microsoft Clarity initialized with ID: ${CLARITY_ID}');
          `
        }}
      />
    </>
  )
}
