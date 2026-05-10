'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, TrendingUp, DollarSign, BarChart3, Check } from 'lucide-react'
import TemplateDownloadModal, { type TemplateSlug } from '@/components/TemplateDownloadModal'

interface Template {
  id: TemplateSlug
  title: string
  description: string
  icon: typeof TrendingUp
  features: string[]
  downloadUrl: string
  color: string
  badge?: string
}

const templates: Template[] = [
  {
    id: 'budget-previsionnel',
    title: 'Budget Prévisionnel 2026',
    description: 'Planifiez votre année avec un budget prévisionnel complet sur 12 mois',
    icon: TrendingUp,
    features: [
      '12 mois de prévisions CA/Charges',
      'Formules automatiques',
      'Graphiques d\'évolution intégrés',
      'Calcul auto des marges et cash flow',
      'Scénarios optimiste / pessimiste inclus',
    ],
        downloadUrl: '/templates/excel/budget-previsionnel-2026.xlsx',
    color: 'border-l-4 border-blue-600 bg-gray-50',
    badge: 'Le plus téléchargé',
  },
  {
    id: 'tracker-dso',
    title: 'Tracker DSO Clients',
    description: 'Suivez vos délais de paiement clients et réduisez les impayés',
    icon: DollarSign,
    features: [
      'Liste clients + factures',
      'Calcul DSO automatique',
      'Alertes conditionnelles (>60j)',
      'Suivi des relances',
      'Tableau de bord relances intégré',
    ],
    downloadUrl: '/templates/excel/tracker-dso.xlsx',
    color: 'border-l-4 border-green-600 bg-gray-50',
  },
  {
    id: 'dashboard-cashflow',
    title: 'Dashboard Cash Flow',
    description: 'Pilotez votre trésorerie avec un tableau de bord complet',
    icon: BarChart3,
    features: [
      'Encaissements vs Décaissements',
      'Projection 6 mois glissants',
      'Graphiques automatiques',
      'Indicateurs de seuil',
      'Projection 3 scénarios automatiques',
    ],
    downloadUrl: '/templates/excel/dashboard-cashflow.xlsx',
    color: 'border-l-4 border-purple-600 bg-gray-50',
  },
]

export default function TemplatesResourceCards() {
  const [selected, setSelected] = useState<Template | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {templates.map((template) => {
          const Icon = template.icon
          return (
            <div
              key={template.id}
              className="surface rounded-xl overflow-hidden border-2 border-border-default hover:border-accent-primary transition-all group"
            >
              <div className={`${template.color} p-8 relative`}>
                {template.badge && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded">
                    {template.badge}
                  </div>
                )}
                <Icon className="w-12 h-12 mb-4 text-gray-700" />
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{template.title}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>

              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {template.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-secondary leading-relaxed">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelected(template)}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all group-hover:shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    Recevoir Excel (.xlsx)
                  </button>
                </div>

                <p className="text-xs text-tertiary text-center mt-3 flex items-center justify-center gap-1">
                  <FileSpreadsheet className="w-3.5 h-3.5 inline" />
                  Envoi par email · Excel 2016+ / Google Sheets
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <TemplateDownloadModal
        templateName={selected?.title ?? ''}
        templateSlug={selected?.id ?? 'budget-previsionnel'}
        xlsxPath={selected?.downloadUrl ?? ''}
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
