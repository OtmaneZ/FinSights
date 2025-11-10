'use client'

import FinancialDashboard from '@/components/FinancialDashboard'
import Link from 'next/link'

export default function DashboardV1Page() {
    return (
        <div>
            {/* Navigation pour comparer */}
            <div className="fixed top-4 right-4 z-50 flex gap-2">
                <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Voir V2
                </Link>
            </div>

            {/* Dashboard V1 Original */}
            <FinancialDashboard />
        </div>
    )
}
