/**
 * CompanySwitcher Component
 * Dropdown pour sélectionner l'entreprise active
 * Affichage dans le header du dashboard
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Plus, Check } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { useRouter } from 'next/navigation';

export function CompanySwitcher() {
    const router = useRouter();
    const { companies, activeCompanyId, setActiveCompanyId, loading } = useCompanies();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeCompany = companies.find(c => c.id === activeCompanyId);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    if (loading || companies.length === 0) {
        return null; // Don't show until companies are loaded
    }

    const handleSelectCompany = (companyId: string) => {
        setActiveCompanyId(companyId);
        setIsOpen(false);
    };

    const handleManageCompanies = () => {
        setIsOpen(false);
        router.push('/dashboard/settings/companies');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors"
            >
                <Building2 className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-primary max-w-[150px] truncate">
                    {activeCompany?.name || 'Sélectionner...'}
                </span>
                <ChevronDown className={`w-4 h-4 text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-72 bg-surface border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-border">
                        <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
                            Mes Entreprises
                        </p>
                    </div>

                    {/* Companies List */}
                    <div className="max-h-64 overflow-y-auto">
                        {companies.map((company) => (
                            <button
                                key={company.id}
                                onClick={() => handleSelectCompany(company.id)}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-colors text-left"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-primary truncate">
                                        {company.name}
                                    </p>
                                    {company.sector && (
                                        <p className="text-xs text-secondary mt-0.5">
                                            {company.sector}
                                        </p>
                                    )}
                                </div>
                                {activeCompanyId === company.id && (
                                    <Check className="w-4 h-4 text-accent-primary flex-shrink-0 ml-2" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-border">
                        <button
                            onClick={handleManageCompanies}
                            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-surface-hover transition-colors text-left"
                        >
                            <Plus className="w-4 h-4 text-accent-primary" />
                            <span className="text-sm font-medium text-accent-primary">
                                Gérer mes entreprises
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
