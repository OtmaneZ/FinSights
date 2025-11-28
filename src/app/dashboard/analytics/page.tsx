/**
 * Analytics Dashboard Page
 *
 * Displays Posthog event tracking data:
 * - User signup trends
 * - Dashboard uploads
 * - AI analysis requests
 * - Export activity
 * - Plan upgrade clicks
 * - User journey visualization
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    BarChart3,
    TrendingUp,
    Users,
    Upload,
    Sparkles,
    Download,
    Crown,
    Activity,
} from 'lucide-react';

interface AnalyticsData {
    signups: number;
    uploads: number;
    aiRequests: number;
    exports: number;
    upgradeClicks: number;
    activeUsers: number;
}

export default function AnalyticsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        signups: 0,
        uploads: 0,
        aiRequests: 0,
        exports: 0,
        upgradeClicks: 0,
        activeUsers: 0,
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        } else if (status === 'authenticated') {
            // Admin only
            if (session?.user?.plan !== 'ENTERPRISE') {
                router.push('/dashboard');
            } else {
                fetchAnalytics();
            }
        }
    }, [status, session, router]);

    const fetchAnalytics = async () => {
        try {
            // Mock data for now - will be replaced with real Posthog API
            setAnalytics({
                signups: 127,
                uploads: 342,
                aiRequests: 891,
                exports: 156,
                upgradeClicks: 23,
                activeUsers: 89,
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">Chargement...</div>
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: 'Inscriptions',
            value: analytics.signups,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            label: 'Uploads',
            value: analytics.uploads,
            icon: Upload,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            label: 'Requêtes IA',
            value: analytics.aiRequests,
            icon: Sparkles,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            label: 'Exports',
            value: analytics.exports,
            icon: Download,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
        },
        {
            label: 'Clics Upgrade',
            value: analytics.upgradeClicks,
            icon: Crown,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            label: 'Utilisateurs Actifs',
            value: analytics.activeUsers,
            icon: Activity,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
                    </div>
                    <p className="text-slate-600">
                        Tableau de bord des événements et comportements utilisateurs (Posthog)
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                        <Icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-600">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Event Timeline */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Événements récents</h2>
                    <div className="space-y-3">
                        {[
                            { event: 'dashboard.upload', user: 'user@example.com', time: '2 min ago' },
                            { event: 'ai.analysis_requested', user: 'cfo@startup.fr', time: '5 min ago' },
                            { event: 'plan.upgrade_clicked', user: 'daf@scale.com', time: '12 min ago' },
                            { event: 'file.export', user: 'finance@corp.fr', time: '23 min ago' },
                            { event: 'webhook.created', user: 'admin@saas.io', time: '34 min ago' },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    <div>
                                        <div className="font-medium text-slate-900">{item.event}</div>
                                        <div className="text-sm text-slate-600">{item.user}</div>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-500">{item.time}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Journey Funnel */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Conversion Funnel</h2>
                    <div className="space-y-3">
                        {[
                            { step: 'Visite Homepage', users: 1432, percent: 100 },
                            { step: 'Inscription', users: 127, percent: 8.9 },
                            { step: 'Premier Upload', users: 94, percent: 6.6 },
                            { step: 'Utilisation IA', users: 68, percent: 4.7 },
                            { step: 'Upgrade PRO', users: 23, percent: 1.6 },
                        ].map((stage, idx) => (
                            <div key={idx}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-700">{stage.step}</span>
                                    <span className="text-sm text-slate-600">
                                        {stage.users} utilisateurs ({stage.percent}%)
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full transition-all"
                                        style={{ width: `${stage.percent}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Integration Notice */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">📊 Configuration Posthog</h3>
                    <p className="text-sm text-blue-800 mb-3">
                        Pour activer le tracking en temps réel, ajoutez votre clé Posthog dans <code className="bg-blue-100 px-2 py-1 rounded">.env.local</code> :
                    </p>
                    <pre className="bg-blue-900 text-blue-50 p-3 rounded-lg text-xs overflow-x-auto">
                        NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
                        <br />
                        NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
                    </pre>
                    <p className="text-sm text-blue-800 mt-3">
                        Les événements sont déjà instrumentés dans le code (signup, upload, AI, export, upgrade).
                    </p>
                </div>
            </div>
        </div>
    );
}
