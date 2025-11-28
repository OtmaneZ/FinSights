/**
 * Page: Mes Dashboards
 * List all saved dashboards with search, filters, pagination
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FolderOpen, Search, ArrowLeft, Loader2 } from 'lucide-react';
import { useSavedDashboards } from '@/hooks/useSavedDashboards';
import DashboardCard from '@/components/DashboardCard';

export default function DashboardListPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [searchQuery, setSearchQuery] = useState('');

    const { dashboards, loading, error, deleteDashboard, pagination, setPage } =
        useSavedDashboards();

    // Redirect if not authenticated
    if (status === 'unauthenticated') {
        router.push('/auth/signin');
        return null;
    }

    // Filter dashboards by search
    const filteredDashboards = dashboards.filter((d) =>
        d.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenDashboard = (dashboardId: string) => {
        // Navigate to main dashboard with ID parameter
        router.push(`/dashboard?id=${dashboardId}`);
    };

    return (
        <div className="min-h-screen bg-primary text-primary">
            {/* Header */}
            <header className="border-b border-border-subtle backdrop-blur-sm bg-primary/80 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-lg font-semibold">Retour au Dashboard</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Title Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <FolderOpen className="w-10 h-10 text-accent-primary" />
                        Mes Dashboards
                    </h1>
                    <p className="text-secondary text-lg">
                        {loading
                            ? 'Chargement...'
                            : `${pagination.total} dashboard${pagination.total > 1 ? 's' : ''} sauvegardé${pagination.total > 1 ? 's' : ''}`}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                        <input
                            type="text"
                            placeholder="Rechercher un dashboard..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-surface border border-border-default rounded-lg text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="surface rounded-xl p-8 text-center">
                        <p className="text-accent-danger mb-4">❌ {error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2.5 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-sm transition-all"
                        >
                            Réessayer
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredDashboards.length === 0 && (
                    <div className="surface rounded-xl p-12 text-center">
                        <FolderOpen className="w-16 h-16 text-tertiary mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">
                            {searchQuery ? 'Aucun résultat' : 'Aucun dashboard sauvegardé'}
                        </h3>
                        <p className="text-secondary mb-6">
                            {searchQuery
                                ? `Aucun dashboard ne correspond à "${searchQuery}"`
                                : 'Importez votre premier fichier CSV/Excel pour commencer'}
                        </p>
                        {!searchQuery && (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold text-sm transition-all hover:shadow-lg"
                            >
                                Importer des données
                            </Link>
                        )}
                    </div>
                )}

                {/* Dashboards Grid */}
                {!loading && !error && filteredDashboards.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {filteredDashboards.map((dashboard) => (
                                <DashboardCard
                                    key={dashboard.id}
                                    id={dashboard.id}
                                    fileName={dashboard.fileName}
                                    fileUrl={dashboard.fileUrl}
                                    kpis={dashboard.kpis}
                                    company={dashboard.company}
                                    createdAt={dashboard.createdAt}
                                    onOpen={handleOpenDashboard}
                                    onDelete={deleteDashboard}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3">
                                <button
                                    onClick={() => setPage(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="px-4 py-2 border border-border-default rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-elevated transition-all"
                                >
                                    Précédent
                                </button>

                                <span className="text-sm text-secondary">
                                    Page {pagination.page} sur {pagination.totalPages}
                                </span>

                                <button
                                    onClick={() => setPage(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="px-4 py-2 border border-border-default rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-elevated transition-all"
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
