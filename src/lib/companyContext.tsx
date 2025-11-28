/**
 * CompanyContext
 * Global context pour gérer la company active à travers l'application
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CompanyContextType {
    activeCompanyId: string | null;
    setActiveCompanyId: (id: string) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
    const [activeCompanyId, setActiveCompanyIdState] = useState<string | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('activeCompanyId');
        if (saved) {
            setActiveCompanyIdState(saved);
        }
    }, []);

    // Save to localStorage when changed
    const setActiveCompanyId = (id: string) => {
        setActiveCompanyIdState(id);
        localStorage.setItem('activeCompanyId', id);
    };

    return (
        <CompanyContext.Provider value={{ activeCompanyId, setActiveCompanyId }}>
            {children}
        </CompanyContext.Provider>
    );
}

export function useActiveCompany() {
    const context = useContext(CompanyContext);
    if (context === undefined) {
        throw new Error('useActiveCompany must be used within CompanyProvider');
    }
    return context;
}
