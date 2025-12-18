/**
 * Hook: Fetch saved dashboards from API
 * Usage: const { dashboards, loading, error, refetch, deleteDashboard } = useSavedDashboards()
 */

import { useState, useEffect } from 'react';

interface Company {
    id: string;
    name: string;
    sector: string;
}

interface Dashboard {
    id: string;
    fileName: string;
    fileUrl: string;
    kpis: any;
    company: Company;
    createdAt: string;
    updatedAt: string;
}

interface UseSavedDashboardsResult {
    dashboards: Dashboard[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    deleteDashboard: (id: string) => Promise<void>;
    pagination: {
        page: number;
        totalPages: number;
        total: number;
    };
    setPage: (page: number) => void;
}

export function useSavedDashboards(companyId?: string): UseSavedDashboardsResult {
    const [dashboards, setDashboards] = useState<Dashboard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0,
    });

    const fetchDashboards = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
            });

            if (companyId) {
                params.append('companyId', companyId);
            }

            const response = await fetch(`/api/dashboards?${params}`);

            if (!response.ok) {
                throw new Error('Erreur lors du chargement des dashboards');
            }

            const data = await response.json();
            setDashboards(data.dashboards);
            setPagination(data.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const deleteDashboard = async (id: string) => {
        try {
            const response = await fetch(`/api/dashboards?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression');
            }

            // Refresh list
            await fetchDashboards();
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : 'Erreur suppression');
        }
    };

    useEffect(() => {
        fetchDashboards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, companyId]);

    return {
        dashboards,
        loading,
        error,
        refetch: fetchDashboards,
        deleteDashboard,
        pagination,
        setPage,
    };
}
