/**
 * CommandPalette - Command menu Cmd+K style
 * Raccourcis clavier pour actions rapides dashboard
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { Command } from 'cmdk';
import {
    MagnifyingGlassIcon,
    DocumentArrowDownIcon,
    SparklesIcon,
    ExclamationTriangleIcon,
    MoonIcon,
    SunIcon,
    QuestionMarkCircleIcon,
    ChartBarIcon,
    ArrowPathIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onExportPDF?: () => void;
    onExportExcel?: () => void;
    onOpenCopilot?: () => void;
    onToggleAnomalies?: () => void;
    onToggleTheme?: () => void;
    onRefreshData?: () => void;
    isDarkMode?: boolean;
}

export default function CommandPalette({
    isOpen,
    onClose,
    onExportPDF,
    onExportExcel,
    onOpenCopilot,
    onToggleAnomalies,
    onToggleTheme,
    onRefreshData,
    isDarkMode = false,
}: CommandPaletteProps) {
    const [search, setSearch] = useState('');

    // Close on Escape
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [onClose]);

    // Reset search when opening
    useEffect(() => {
        if (isOpen) {
            setSearch('');
        }
    }, [isOpen]);

    const handleAction = useCallback((action: () => void | undefined) => {
        if (action) {
            action();
        }
        onClose();
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Command Menu */}
            <Command
                className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slideDown"
                value={search}
                onValueChange={setSearch}
            >
                {/* Search Input */}
                <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <Command.Input
                        placeholder="Rechercher une action... (Cmd+K)"
                        className="flex-1 py-4 bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-400"
                        value={search}
                        onValueChange={setSearch}
                    />
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Commands List */}
                <Command.List className="max-h-96 overflow-y-auto p-2">
                    <Command.Empty className="py-12 text-center text-gray-500 dark:text-gray-400">
                        Aucune action trouvée
                    </Command.Empty>

                    {/* Export Group */}
                    <Command.Group heading="📊 Export" className="mb-2">
                        <Command.Item
                            onSelect={() => handleAction(onExportPDF || (() => { }))}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-900/20"
                        >
                            <DocumentArrowDownIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">
                                    Exporter PDF
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Télécharger rapport financier complet
                                </div>
                            </div>
                            <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                                ⌘E
                            </kbd>
                        </Command.Item>

                        <Command.Item
                            onSelect={() => handleAction(onExportExcel || (() => { }))}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors data-[selected=true]:bg-green-50 dark:data-[selected=true]:bg-green-900/20"
                        >
                            <DocumentArrowDownIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">
                                    Exporter Excel
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Télécharger données brutes (XLSX)
                                </div>
                            </div>
                            <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                                ⇧⌘E
                            </kbd>
                        </Command.Item>
                    </Command.Group>

                    {/* AI & Analytics Group */}
                    <Command.Group heading="🤖 Intelligence" className="mb-2">
                        <Command.Item
                            onSelect={() => handleAction(onOpenCopilot || (() => { }))}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors data-[selected=true]:bg-purple-50 dark:data-[selected=true]:bg-purple-900/20"
                        >
                            <SparklesIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">
                                    Ouvrir Copilot IA
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Poser une question à l'assistant IA
                                </div>
                            </div>
                            <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                                ⌘A
                            </kbd>
                        </Command.Item>

                        <Command.Item
                            onSelect={() => handleAction(onToggleAnomalies || (() => { }))}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors data-[selected=true]:bg-orange-50 dark:data-[selected=true]:bg-orange-900/20"
                        >
                            <ExclamationTriangleIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">
                                    Anomalies ML
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Afficher/masquer détections ML
                                </div>
                            </div>
                            <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                                ⌘M
                            </kbd>
                        </Command.Item>
                    </Command.Group>

                    {/* View & Actions Group */}
                    <Command.Group heading="⚙️ Actions" className="mb-2">
                        <Command.Item
                            onSelect={() => handleAction(onRefreshData || (() => { }))}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors data-[selected=true]:bg-gray-50 dark:data-[selected=true]:bg-gray-800"
                        >
                            <ArrowPathIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">
                                    Actualiser données
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Recalculer KPIs et graphiques
                                </div>
                            </div>
                            <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                                ⌘R
                            </kbd>
                        </Command.Item>

                        <Command.Item
                            onSelect={() => handleAction(onToggleTheme || (() => { }))}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors data-[selected=true]:bg-gray-50 dark:data-[selected=true]:bg-gray-800"
                        >
                            {isDarkMode ? (
                                <SunIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                            ) : (
                                <MoonIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            )}
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">
                                    {isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Changer le thème de l'interface
                                </div>
                            </div>
                            <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                                ⌘T
                            </kbd>
                        </Command.Item>
                    </Command.Group>

                    {/* Help Group */}
                    <Command.Group heading="❓ Aide">
                        <Command.Item
                            onSelect={() => window.open('https://github.com/OtmaneZ/FinSights#readme', '_blank')}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors data-[selected=true]:bg-gray-50 dark:data-[selected=true]:bg-gray-800"
                        >
                            <QuestionMarkCircleIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">
                                    Documentation
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Guide complet d'utilisation
                                </div>
                            </div>
                            <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                                ⌘/
                            </kbd>
                        </Command.Item>

                        <Command.Item
                            onSelect={() => window.open('/methodologie', '_blank')}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors data-[selected=true]:bg-gray-50 dark:data-[selected=true]:bg-gray-800"
                        >
                            <ChartBarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">
                                    Méthodologie
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Formules et calculs financiers
                                </div>
                            </div>
                        </Command.Item>
                    </Command.Group>
                </Command.List>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↑</kbd>
                            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↓</kbd>
                            <span className="ml-1">naviguer</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↵</kbd>
                            <span className="ml-1">sélectionner</span>
                        </span>
                    </div>
                    <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Esc</kbd>
                        <span className="ml-1">fermer</span>
                    </span>
                </div>
            </Command>
        </div>
    );
}
