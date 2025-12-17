/**
 * Dashboard Results Page
 * /dashboard/results
 *
 * Affiche les KPIs financiers après upload de fichier
 */

'use client';

import { Suspense } from 'react';
import FinancialDashboardV2 from '@/components/FinancialDashboardV2';
import Header from '@/components/Header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DashboardResultsPage() {
    const router = useRouter();
    const { status } = useSession();

    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
        router.push('/auth/signin');
        return null;
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-accent-primary-border border-t-accent-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-secondary">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary">
            <Header />

            <div className="pt-4">
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-accent-primary-border border-t-accent-primary rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-secondary">Analyse en cours...</p>
                        </div>
                    </div>
                }>
                    <FinancialDashboardV2 />
                </Suspense>
            </div>
        </div>
    );
}
