'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getGlossaryEntry, KPI_TO_GLOSSARY_MAP } from '@/lib/financialGlossary';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface KPITooltipProps {
    kpiTitle: string;
    children?: React.ReactNode;
}

export default function KPITooltip({ kpiTitle, children }: KPITooltipProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
    const tooltipRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const glossaryId = KPI_TO_GLOSSARY_MAP[kpiTitle];
    const glossaryEntry = glossaryId ? getGlossaryEntry(glossaryId) : null;

    // ✅ Hook AVANT le return conditionnel (règle React)
    useEffect(() => {
        if (isOpen && tooltipRef.current && triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - triggerRect.bottom;
            const spaceAbove = triggerRect.top;

            // Positionner en haut si pas assez d'espace en bas
            if (spaceBelow < 400 && spaceAbove > spaceBelow) {
                setPosition('top');
            } else {
                setPosition('bottom');
            }
        }
    }, [isOpen]);

    // Si pas de définition dans le glossaire, ne rien afficher
    if (!glossaryEntry) {
        return <>{children}</>;
    }

    // Feature en développement : comparaison avec seuils sectoriels
    const getRiskLevelColor = (value: number, thresholds: any) => {
        return 'text-gray-600';
    };

    return (
        <div className="relative inline-block">
            <button
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors group"
                aria-label={`Informations sur ${kpiTitle}`}
            >
                <InformationCircleIcon className="w-5 h-5 text-gray-400 group-hover:text-accent-primary transition-colors" />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop pour fermer au clic extérieur */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Tooltip */}
                    <div
                        ref={tooltipRef}
                        className={`absolute z-50 w-96 surface border-2 border-blue-200 rounded-xl shadow-2xl
                            ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
                            left-1/2 transform -translate-x-1/2`}
                        style={{ maxHeight: '500px', overflowY: 'auto' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-accent-primary to-indigo-600 text-white p-4 rounded-t-lg">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{glossaryEntry.title}</h3>
                                    <p className="text-sm text-blue-100 mt-1">{glossaryEntry.shortName}</p>
                                </div>
                                <span className="px-3 py-1 surface/20 rounded-full text-xs font-medium">
                                    {glossaryEntry.category.charAt(0).toUpperCase() + glossaryEntry.category.slice(1)}
                                </span>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-4">
                            {/* Définition */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    📖 Définition
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {glossaryEntry.definition}
                                </p>
                            </div>

                            {/* Formule */}
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                    🧮 Formule de calcul
                                </h4>
                                <code className="block text-sm font-mono surface p-2 rounded border border-blue-300 text-blue-800 mb-2">
                                    {glossaryEntry.formula}
                                </code>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    {glossaryEntry.formulaExplanation}
                                </p>
                            </div>

                            {/* Interprétation */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    📊 Interprétation
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-green-600 font-bold">✅</span>
                                        <span className="text-gray-700">{glossaryEntry.interpretation.excellent}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-accent-primary font-bold">👍</span>
                                        <span className="text-gray-700">{glossaryEntry.interpretation.good}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-orange-600 font-bold">⚠️</span>
                                        <span className="text-gray-700">{glossaryEntry.interpretation.warning}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-red-600 font-bold">🚨</span>
                                        <span className="text-gray-700">{glossaryEntry.interpretation.critical}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Benchmarks sectoriels */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    🎯 Benchmarks sectoriels
                                </h4>
                                <div className="space-y-2">
                                    {glossaryEntry.benchmarks.map((benchmark, idx) => (
                                        <div key={idx} className="bg-gray-50 rounded p-2 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-800">
                                                    {benchmark.sector}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                                                <span>Min: <strong>{benchmark.min}{benchmark.unit}</strong></span>
                                                <span className="text-accent-primary">Médiane: <strong>{benchmark.median}{benchmark.unit}</strong></span>
                                                <span>Max: <strong>{benchmark.max}{benchmark.unit}</strong></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Exemple */}
                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                                    💡 Exemple concret
                                </h4>
                                <code className="text-sm text-green-800 font-mono">
                                    {glossaryEntry.example}
                                </code>
                            </div>

                            {/* Actions recommandées */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    🎬 Actions recommandées
                                </h4>
                                <ul className="space-y-1.5">
                                    {glossaryEntry.actionableInsights.map((insight, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="text-blue-500 font-bold">→</span>
                                            <span>{insight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* KPIs liés */}
                            {glossaryEntry.relatedKPIs.length > 0 && (
                                <div className="border-t border-gray-200 pt-3">
                                    <h4 className="text-xs font-semibold text-gray-500 mb-2">
                                        🔗 KPIs LIÉS
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {glossaryEntry.relatedKPIs.map((kpi, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-full border border-gray-300"
                                            >
                                                {kpi}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-4 py-3 rounded-b-lg border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                                Sources : PCG 2025 • DFCG • Normes IFRS
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
