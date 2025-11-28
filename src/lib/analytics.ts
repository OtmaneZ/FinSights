/**
 * Analytics Tracking Utilities
 * Helper functions pour tracker les événements SEO et conversion
 */

// Declare gtag function for TypeScript
declare global {
    interface Window {
        gtag?: (
            command: 'event' | 'config' | 'js',
            targetId: string,
            config?: Record<string, any>
        ) => void
        dataLayer?: any[]
    }
}

/**
 * Track article view
 */
export function trackArticleView(slug: string, title: string, category: string) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'article_view', {
            event_category: 'Blog',
            event_label: title,
            article_slug: slug,
            article_category: category,
            page_path: `/blog/${slug}`
        })
    }
}

/**
 * Track calculator use
 */
export function trackCalculatorUse(
    calculator: 'DSO' | 'BFR',
    result: number,
    inputs: Record<string, number>
) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'calculator_used', {
            event_category: 'Tools',
            event_label: `Calculateur ${calculator}`,
            calculator_type: calculator,
            calculator_result: result,
            ...inputs
        })
    }
}

/**
 * Track CTA click (article → dashboard/calculator)
 */
export function trackCTAClick(source: string, destination: string, label?: string) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'cta_click', {
            event_category: 'Conversion',
            event_label: label || `${source} → ${destination}`,
            cta_source: source,
            cta_destination: destination
        })
    }
}

/**
 * Track resource page filter use
 */
export function trackResourceFilter(filterType: string, filterValue: string) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'resource_filter', {
            event_category: 'Resources',
            event_label: `${filterType}: ${filterValue}`,
            filter_type: filterType,
            filter_value: filterValue
        })
    }
}

/**
 * Track search on resources page
 */
export function trackResourceSearch(query: string, resultsCount: number) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'search', {
            event_category: 'Resources',
            search_term: query,
            results_count: resultsCount
        })
    }
}

/**
 * Track time spent on article (on unmount)
 */
export function trackArticleReadTime(slug: string, timeInSeconds: number) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'article_read_time', {
            event_category: 'Engagement',
            event_label: slug,
            value: timeInSeconds
        })
    }
}

/**
 * Track scroll depth (25%, 50%, 75%, 100%)
 */
export function trackScrollDepth(page: string, depth: 25 | 50 | 75 | 100) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'scroll_depth', {
            event_category: 'Engagement',
            event_label: `${page} - ${depth}%`,
            scroll_depth: depth
        })
    }
}
