/**
 * Posthog Analytics Provider
 *
 * Client-side wrapper for Posthog tracking
 * Tracks key events: signup, upload, AI analysis, export, plan upgrade
 */

'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        capture_pageview: false, // We'll handle this manually
        autocapture: false, // Disable auto-capture for cleaner events
    });
}

// ============================================
// POSTHOG PROVIDER WITH PAGE TRACKING
// ============================================

export function PosthogProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Track pageviews
    useEffect(() => {
        if (pathname) {
            let url = window.origin + pathname;
            if (searchParams && searchParams.toString()) {
                url = url + `?${searchParams.toString()}`;
            }
            posthog.capture('$pageview', {
                $current_url: url,
            });
        }
    }, [pathname, searchParams]);

    return <PHProvider client={posthog}>{children}</PHProvider>;
}

// ============================================
// ANALYTICS EVENT TRACKING HELPERS
// ============================================

export const analytics = {
    /**
     * Track user signup
     */
    trackSignup: (email: string, plan: string) => {
        posthog.capture('user.signup', {
            email,
            plan,
            timestamp: new Date().toISOString(),
        });
        posthog.identify(email, {
            email,
            plan,
            signupDate: new Date().toISOString(),
        });
    },

    /**
     * Track dashboard upload
     */
    trackUpload: (fileName: string, fileSize: number, companyId: string) => {
        posthog.capture('dashboard.upload', {
            fileName,
            fileSize,
            companyId,
            timestamp: new Date().toISOString(),
        });
    },

    /**
     * Track AI analysis request
     */
    trackAIAnalysis: (dashboardId: string, query: string) => {
        posthog.capture('ai.analysis_requested', {
            dashboardId,
            queryLength: query.length,
            timestamp: new Date().toISOString(),
        });
    },

    /**
     * Track file export (PDF, Excel)
     */
    trackExport: (format: 'pdf' | 'excel', dashboardId?: string) => {
        posthog.capture('file.export', {
            format,
            dashboardId,
            timestamp: new Date().toISOString(),
        });
    },

    /**
     * Track plan upgrade click
     */
    trackUpgradeClick: (currentPlan: string, targetPlan: string) => {
        posthog.capture('plan.upgrade_clicked', {
            currentPlan,
            targetPlan,
            timestamp: new Date().toISOString(),
        });
    },

    /**
     * Track Stripe checkout success
     */
    trackCheckoutSuccess: (plan: string, amount: number) => {
        posthog.capture('checkout.success', {
            plan,
            amount,
            timestamp: new Date().toISOString(),
        });
    },

    /**
     * Track company creation
     */
    trackCompanyCreated: (companyName: string, sector?: string) => {
        posthog.capture('company.created', {
            companyName,
            sector,
            timestamp: new Date().toISOString(),
        });
    },

    /**
     * Track API key generation
     */
    trackApiKeyGenerated: (keyName: string) => {
        posthog.capture('api_key.generated', {
            keyName,
            timestamp: new Date().toISOString(),
        });
    },

    /**
     * Track webhook creation
     */
    trackWebhookCreated: (url: string, events: string[]) => {
        posthog.capture('webhook.created', {
            url,
            eventsCount: events.length,
            timestamp: new Date().toISOString(),
        });
    },

    /**
     * Identify user (call after login)
     */
    identifyUser: (email: string, properties: Record<string, any>) => {
        posthog.identify(email, {
            email,
            ...properties,
        });
    },

    /**
     * Reset user (call after logout)
     */
    reset: () => {
        posthog.reset();
    },
};
