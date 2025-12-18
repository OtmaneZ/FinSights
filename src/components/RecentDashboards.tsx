/**
 * Recent Dashboards Component
 * Affiche les 5 derniers dashboards uploadés par l'user
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface Dashboard {
    id: string;
    fileName: string;
    createdAt: string;
    company: {
        name: string;
    };
}

export default function RecentDashboards() {
    const router = useRouter();
    const [dashboards, setDashboards] = useState<Dashboard[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && dashboards.length === 0) {
            fetchRecentDashboards();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const fetchRecentDashboards = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/dashboards/recent?limit=5');
            if (res.ok) {
                const data = await res.json();
                setDashboards(data.dashboards || []);
            }
        } catch (error) {
            // Silent fail - user can still access dashboards via main navigation
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Aujourd\'hui';
        if (days === 1) return 'Hier';
        if (days < 7) return `Il y a ${days} jours`;
        return date.toLocaleDateString('fr-FR');
    };

    const handleDashboardClick = (dashboardId: string) => {
        // FinancialDashboardV2 reads searchParams.get('id')
        router.push(`/dashboard/results?id=${dashboardId}`);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 surface-elevated hover:bg-surface-hover rounded-lg transition-all text-sm font-medium text-secondary"
            >
                <Clock className="w-4 h-4" />
                <span>Récents</span>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                ) : (
                    <ChevronDown className="w-4 h-4" />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 surface-elevated border border-border-default rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b border-border-default">
                        <h3 className="font-semibold text-primary">Dashboards récents</h3>
                        <p className="text-xs text-secondary mt-1">
                            Vos 5 derniers imports
                        </p>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="w-8 h-8 border-2 border-accent-primary-border border-t-accent-primary rounded-full animate-spin mx-auto mb-2"></div>
                                <p className="text-xs text-secondary">Chargement...</p>
                            </div>
                        ) : dashboards.length === 0 ? (
                            <div className="p-8 text-center">
                                <FileText className="w-12 h-12 text-tertiary mx-auto mb-2" />
                                <p className="text-sm text-secondary">
                                    Aucun dashboard encore
                                </p>
                                <p className="text-xs text-tertiary mt-1">
                                    Importez votre premier fichier
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border-subtle">
                                {dashboards.map((dashboard) => (
                                    <button
                                        key={dashboard.id}
                                        onClick={() => handleDashboardClick(dashboard.id)}
                                        className="w-full p-4 hover:bg-surface-hover transition-colors text-left"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FileText className="w-4 h-4 text-accent-primary flex-shrink-0" />
                                                    <span className="text-sm font-medium text-primary truncate">
                                                        {dashboard.fileName}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-secondary mb-1">
                                                    {dashboard.company.name}
                                                </p>
                                                <p className="text-xs text-tertiary">
                                                    {formatDate(dashboard.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {dashboards.length > 0 && (
                        <div className="p-3 border-t border-border-default">
                            <button
                                onClick={() => {
                                    router.push('/dashboard/history');
                                    setIsOpen(false);
                                }}
                                className="w-full text-center text-sm text-accent-primary hover:text-accent-primary-hover font-medium transition-colors"
                            >
                                Voir tout l'historique →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
