/**
 * useCompanies Hook
 * Gestion des entreprises utilisateur avec CRUD operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useActiveCompany } from '@/lib/companyContext';
import { logger } from '@/lib/logger';

export interface Company {
    id: string;
    name: string;
    sector: string | null;
    dashboardsCount: number;
    createdAt: string;
}

interface UseCompaniesReturn {
    companies: Company[];
    loading: boolean;
    error: string | null;
    activeCompanyId: string | null;
    setActiveCompanyId: (id: string) => void;
    fetchCompanies: () => Promise<void>;
    createCompany: (name: string, sector?: string) => Promise<{ success: boolean; company?: Company; error?: string }>;
    updateCompany: (id: string, name: string, sector?: string) => Promise<{ success: boolean; error?: string }>;
    deleteCompany: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function useCompanies(): UseCompaniesReturn {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { activeCompanyId, setActiveCompanyId } = useActiveCompany();

    // Fetch all companies
    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/companies');
            const data = await response.json();

            if (response.ok) {
                setCompanies(data.companies || []);

                // Auto-select first company if none selected
                if (!activeCompanyId && data.companies?.length > 0) {
                    setActiveCompanyId(data.companies[0].id);
                }
            } else {
                setError(data.error || 'Failed to fetch companies');
            }
        } catch (err) {
            logger.error('useCompanies fetch error:', err);
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, [activeCompanyId, setActiveCompanyId]);

    // Create new company
    const createCompany = async (name: string, sector?: string): Promise<{ success: boolean; company?: Company; error?: string }> => {
        try {
            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, sector })
            });

            const data = await response.json();

            if (response.ok) {
                await fetchCompanies(); // Refresh list
                return { success: true, company: data.company };
            } else {
                return { success: false, error: data.error || data.message || 'Failed to create company' };
            }
        } catch (err) {
            logger.error('createCompany error:', err);
            return { success: false, error: 'Network error' };
        }
    };

    // Update company
    const updateCompany = async (id: string, name: string, sector?: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch('/api/companies', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name, sector })
            });

            const data = await response.json();

            if (response.ok) {
                await fetchCompanies(); // Refresh list
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Failed to update company' };
            }
        } catch (err) {
            logger.error('updateCompany error:', err);
            return { success: false, error: 'Network error' };
        }
    };

    // Delete company
    const deleteCompany = async (id: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`/api/companies?id=${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                // If deleted company was active, switch to first available
                if (activeCompanyId === id) {
                    const remaining = companies.filter(c => c.id !== id);
                    if (remaining.length > 0) {
                        setActiveCompanyId(remaining[0].id);
                    }
                }
                await fetchCompanies(); // Refresh list
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Failed to delete company' };
            }
        } catch (err) {
            logger.error('deleteCompany error:', err);
            return { success: false, error: 'Network error' };
        }
    };

    // Fetch on mount
    useEffect(() => {
        fetchCompanies();
    }, []);

    return {
        companies,
        loading,
        error,
        activeCompanyId,
        setActiveCompanyId,
        fetchCompanies,
        createCompany,
        updateCompany,
        deleteCompany
    };
}
