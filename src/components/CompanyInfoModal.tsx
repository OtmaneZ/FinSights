import React, { useState } from 'react';
import { XMarkIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

export type CompanySector = 'services' | 'commerce' | 'industrie' | 'saas';

interface CompanyInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (companyName: string, sector: CompanySector) => void;
}

export const CompanyInfoModal: React.FC<CompanyInfoModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [companyName, setCompanyName] = useState('');
    const [sector, setSector] = useState<CompanySector | ''>('');
    const [error, setError] = useState('');

    const sectors: Array<{ value: CompanySector; label: string; description: string }> = [
        {
            value: 'services',
            label: 'Services',
            description: 'Conseil, agences, prestations intellectuelles',
        },
        {
            value: 'commerce',
            label: 'Commerce',
            description: 'Vente de marchandises, distribution, retail',
        },
        {
            value: 'industrie',
            label: 'Industrie',
            description: 'Fabrication, production, transformation',
        },
        {
            value: 'saas',
            label: 'SaaS / Tech',
            description: 'Logiciel, plateforme, abonnements récurrents',
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!companyName.trim()) {
            setError('Veuillez saisir le nom de votre entreprise');
            return;
        }

        if (!sector) {
            setError('Veuillez sélectionner un secteur d\'activité');
            return;
        }

        onSubmit(companyName.trim(), sector);
        setCompanyName('');
        setSector('');
        setError('');
    };

    const handleClose = () => {
        // Fermer avec valeurs par défaut si l'utilisateur annule
        if (!companyName.trim()) {
            onSubmit('Entreprise', sector || 'services');
        }
        setCompanyName('');
        setSector('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <BuildingOfficeIcon className="w-8 h-8" />
                        <div>
                            <h2 className="text-2xl font-bold">Informations entreprise</h2>
                            <p className="text-blue-100 text-sm mt-1">
                                Pour personnaliser vos benchmarks sectoriels
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Company Name */}
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-semibold text-slate-700 mb-2">
                            Nom de votre entreprise *
                        </label>
                        <input
                            type="text"
                            id="companyName"
                            value={companyName}
                            onChange={(e) => {
                                setCompanyName(e.target.value);
                                setError('');
                            }}
                            placeholder="Ex: FinSight SAS"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Sector Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Secteur d'activité *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {sectors.map((sectorOption) => (
                                <button
                                    key={sectorOption.value}
                                    type="button"
                                    onClick={() => {
                                        setSector(sectorOption.value);
                                        setError('');
                                    }}
                                    className={`p-4 border-2 rounded-lg text-left transition-all ${sector === sectorOption.value
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="font-semibold text-slate-800 mb-1">
                                        {sectorOption.label}
                                    </div>
                                    <div className="text-xs text-slate-600">
                                        {sectorOption.description}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">💡 Pourquoi ces informations ?</span>
                            <br />
                            Nous comparons vos KPIs (DSO, marges, BFR...) aux standards de votre secteur
                            pour vous donner des recommandations personnalisées et pertinentes.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all"
                        >
                            Valider
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
