/**
 * UPLOAD SUCCESS BANNER - DASHIS
 * 
 * Banner affiché après un upload réussi
 * Style McKinsey : sobre, professionnel, informations clés
 * Auto-dismiss après 5 secondes
 */

'use client'

import { useEffect } from 'react'
import { CheckCircle2, Download, X } from 'lucide-react'

interface UploadSuccessBannerProps {
    transactionCount: number;
    processingTime: number; // en secondes
    onDismiss: () => void;
    onExport?: () => void;
}

export default function UploadSuccessBannerDashis({
    transactionCount,
    processingTime,
    onDismiss,
    onExport
}: UploadSuccessBannerProps) {

    // Auto-dismiss après 5 secondes
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className="mb-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Success Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    
                    {/* Message */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            ✅ Analyse terminée en {processingTime}s
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                            {transactionCount.toLocaleString()} transactions détectées et analysées avec succès
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {onExport && (
                        <button
                            onClick={onExport}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Exporter
                        </button>
                    )}
                    
                    <button
                        onClick={onDismiss}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                        title="Fermer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
