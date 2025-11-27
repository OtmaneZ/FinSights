'use client'

import { Download, FileSpreadsheet } from 'lucide-react'

interface Template {
    name: string
    description: string
    file: string
    icon: string
    color: string
}

const templates: Template[] = [
    {
        name: 'Sage Compta',
        description: 'Format export Sage compatible PCG 2025',
        file: '/templates/template-sage.csv',
        icon: '🟦',
        color: 'blue'
    },
    {
        name: 'Cegid',
        description: 'Structure export Cegid classique',
        file: '/templates/template-cegid.csv',
        icon: '🟨',
        color: 'yellow'
    },
    {
        name: 'QuickBooks',
        description: 'Import/Export QuickBooks Online',
        file: '/templates/template-quickbooks.csv',
        icon: '🟩',
        color: 'green'
    },
    {
        name: 'Excel Générique',
        description: 'Template simple pour saisie manuelle',
        file: '/templates/template-excel.csv',
        icon: '📊',
        color: 'purple'
    }
]

export default function TemplateDownload() {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template) => (
                    <a
                        key={template.name}
                        href={template.file}
                        download
                        className="surface rounded-xl p-6 surface-hover group transition-all hover:scale-105"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="text-4xl">{template.icon}</div>
                            <Download className="w-5 h-5 text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <h4 className="font-semibold mb-2">{template.name}</h4>
                        <p className="text-sm text-secondary leading-relaxed">
                            {template.description}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-xs text-accent-primary">
                            <FileSpreadsheet className="w-4 h-4" />
                            <span>Télécharger CSV</span>
                        </div>
                    </a>
                ))}
            </div>

            <div className="mt-8 surface rounded-lg p-4 text-sm text-secondary">
                <p className="mb-2"><strong className="text-primary">💡 Conseils :</strong></p>
                <ul className="space-y-1 pl-5">
                    <li>• Colonnes obligatoires : Date, Montant, Type (income/expense)</li>
                    <li>• Format dates : DD/MM/YYYY (ex: 15/11/2024)</li>
                    <li>• Montants : Pas de symbole € ni espaces (15000 et non 15 000€)</li>
                    <li>• Encodage : UTF-8 pour caractères spéciaux (é, è, à)</li>
                </ul>
            </div>
        </div>
    )
}
