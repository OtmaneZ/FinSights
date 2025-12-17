'use client'

import React from 'react'
import { Database, CheckCircle2, Clock, ExternalLink, Plus, Workflow } from 'lucide-react'
import Link from 'next/link'

export default function DataSourcesPanel() {
    const sources = [
        {
            id: 'pennylane',
            name: 'Pennylane',
            status: 'available',
            type: 'Comptabilité',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png', // Placeholder
            description: 'Flux quotidien via n8n/Make'
        },
        {
            id: 'sage',
            name: 'Sage',
            status: 'available',
            type: 'ERP',
            logo: '',
            description: 'Import automatisé'
        },
        {
            id: 'sellsy',
            name: 'Sellsy',
            status: 'available',
            type: 'CRM',
            description: 'Synchronisation factures'
        }
    ]

    return (
        <div className="surface rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-accent-primary" />
                    <h3 className="font-bold text-gray-900">Sources de données</h3>
                </div>
                <Link
                    href="/integrations"
                    className="text-xs font-semibold text-accent-primary hover:underline flex items-center gap-1"
                >
                    Gérer <ExternalLink className="w-3 h-3" />
                </Link>
            </div>

            <div className="p-4 space-y-3">
                {/* Active Source (CSV by default) */}
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Fichier Local (CSV/Excel)</p>
                            <p className="text-[10px] text-emerald-700 font-medium uppercase tracking-wider">Connecté • Temps réel</p>
                        </div>
                    </div>
                </div>

                {/* Available Integrations */}
                {sources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-blue-200 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                {source.name[0]}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">{source.name}</p>
                                <p className="text-[10px] text-gray-500">{source.description}</p>
                            </div>
                        </div>
                        <Link
                            href={`/integrations/${source.id === 'pennylane' ? 'n8n' : source.id === 'sage' ? 'make' : 'zapier'}`}
                            className="p-1.5 hover:bg-blue-50 rounded-md text-gray-400 hover:text-accent-primary transition-colors"
                            title="Configurer l'intégration"
                        >
                            <Plus className="w-4 h-4" />
                        </Link>
                    </div>
                ))}

                <Link
                    href="/consulting"
                    className="block w-full mt-4 p-3 border-2 border-dashed border-gray-200 rounded-lg text-center hover:border-accent-primary hover:bg-blue-50/30 transition-all group"
                >
                    <div className="flex items-center justify-center gap-2 text-gray-500 group-hover:text-accent-primary">
                        <Workflow className="w-4 h-4" />
                        <span className="text-xs font-medium">Besoin d'un connecteur sur-mesure ?</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}
