/**
 * Google Analytics 4 Event Tracking
 * Helper functions to track custom events in GA4
 * 
 * Usage: trackFileUpload('demo-data.csv', 15000)
 */

// Type safe GA4 events
type GA4EventName = 
  | 'view_item'
  | 'view_item_list'
  | 'select_item'
  | 'search'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'begin_checkout'
  | 'add_payment_info'
  | 'add_shipping_info'
  | 'purchase'
  | 'refund'
  | 'login'
  | 'sign_up'
  | 'file_upload'
  | 'ai_analysis'
  | 'report_download'
  | 'calculator_use'

interface GA4EventParams {
  [key: string]: string | number | boolean | string[]
}

/**
 * Track event in GA4
 * @param eventName GA4 event name
 * @param params Event parameters
 */
export function trackGA4Event(eventName: GA4EventName, params?: GA4EventParams) {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('⚠️ GA4: gtag not available yet')
    return
  }

  try {
    window.gtag('event', eventName, {
      timestamp: new Date().toISOString(),
      ...params
    })
    console.log(`📊 GA4 Event: ${eventName}`, params)
  } catch (error) {
    console.error(`❌ GA4 Event tracking failed: ${eventName}`, error)
  }
}

/**
 * Track file upload
 */
export function trackFileUpload(fileName: string, fileSize: number, format: string) {
  trackGA4Event('file_upload', {
    file_name: fileName,
    file_size: fileSize,
    file_format: format,
    event_category: 'Engagement',
    event_label: `Upload: ${fileName}`
  })
}

/**
 * Track AI analysis request
 */
export function trackAIAnalysis(query: string, resultCount: number) {
  trackGA4Event('ai_analysis', {
    query: query.substring(0, 100), // Limit to 100 chars
    result_count: resultCount,
    event_category: 'Engagement',
    event_label: 'AI Analysis Request'
  })
}

/**
 * Track report download/export
 */
export function trackReportDownload(format: 'pdf' | 'excel' | 'csv', fileName: string) {
  trackGA4Event('report_download', {
    file_format: format,
    file_name: fileName,
    event_category: 'Engagement',
    event_label: `Export: ${format.toUpperCase()}`
  })
}

/**
 * Track calculator usage
 */
export function trackCalculatorUse(calculatorType: string, result: number) {
  trackGA4Event('calculator_use', {
    calculator_type: calculatorType,
    result_value: result,
    event_category: 'Tools',
    event_label: `Calculator: ${calculatorType}`
  })
}

/**
 * Track user signup
 */
export function trackSignup(method: 'email' | 'google' | 'linkedin', plan: string) {
  trackGA4Event('sign_up', {
    method,
    plan,
    event_category: 'Acquisition',
    event_label: `Signup via ${method}`
  })
}

/**
 * Track login
 */
export function trackLogin(method: 'email' | 'google' | 'linkedin') {
  trackGA4Event('login', {
    method,
    event_category: 'User',
    event_label: `Login via ${method}`
  })
}

/**
 * Track search/query
 */
export function trackSearch(query: string, resultsCount: number) {
  trackGA4Event('search', {
    search_term: query,
    results_count: resultsCount,
    event_category: 'Engagement',
    event_label: `Search: ${query}`
  })
}

/**
 * Track item view (for products/features)
 */
export function trackViewItem(itemId: string, itemName: string, value?: number) {
  trackGA4Event('view_item', {
    item_id: itemId,
    item_name: itemName,
    value: value || 0,
    event_category: 'ecommerce',
    event_label: itemName
  })
}

/**
 * Track purchase/upgrade
 */
export function trackPurchase(orderId: string, value: number, currency: string = 'EUR', items?: string[]) {
  trackGA4Event('purchase', {
    order_id: orderId,
    value,
    currency,
    items: items || [],
    event_category: 'ecommerce',
    event_label: `Purchase: ${orderId}`
  })
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}

const gaEvents = {
  trackFileUpload,
  trackAIAnalysis,
  trackReportDownload,
  trackCalculatorUse,
  trackSignup,
  trackLogin,
  trackSearch,
  trackViewItem,
  trackPurchase,
  trackGA4Event
}

export default gaEvents
