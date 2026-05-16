'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, TrendingUp, DollarSign, BarChart3, Check, Clock, PieChart } from 'lucide-react'
import TemplateDownloadModal, { type TemplateSlug } from '@/components/TemplateDownloadModal'
import { StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'

interface Template {
  id: TemplateSlug
  title: string
  description: string
  icon: typeof TrendingUp
  features: string[]
  downloadUrl: string
  featured?: boolean
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
    featured: true,
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
  },
  {
    id: 'previsionnel-tresorerie-90j',
    title: 'Prévisionnel Trésorerie 90j',
    description: 'Anticipez vos besoins de trésorerie sur 3 mois avec alertes conditionnelles',
    icon: Clock,
    features: [
      'Encaissements & décaissements semaine/mois',
      'Projection glissante 90 jours',
      'Alertes solde minimum automatiques',
      'Graphiques de trésorerie prévisionnelle',
      'Scénarios optimiste / pessimiste',
    ],
    downloadUrl: '/templates/excel/previsionnel-tresorerie-90j.xlsx',
    badge: 'Nouveau',
  },
  {
    id: 'calculateur-ebitda-mensuel',
    title: 'Calculateur EBITDA Mensuel',
    description: 'Calculez votre EBITDA mois par mois et préparez votre dossier bancaire',
    icon: PieChart,
    features: [
      'Calcul EBITDA automatique (12 mois)',
      'Marge EBITDA vs benchmarks secteur',
      'Ratio Dette nette / EBITDA',
      'Graphiques banque-ready',
      'Comparatif résultat net vs EBITDA',
    ],
    downloadUrl: '/templates/excel/FinSight_EBITDA_Mensuel.xlsx',
    badge: 'Nouveau',
  },
  {
    id: 'tableau-flux-tresorerie',
    title: 'Tableau de Flux de Trésorerie',
    description: 'Construisez le troisième état financier et comprenez d\'où vient (et où part) votre cash',
    icon: BarChart3,
    features: [
      'Structure PCG : exploitation / investissement / financement',
      'Réconciliation résultat net vers cash automatique',
      'Calcul variation BFR intégré',
      'Méthode indirecte prête pour le commissaire aux comptes',
      'Comparatif N vs N-1',
    ],
    downloadUrl: '/templates/excel/Tableau_Flux_Tresorerie_FinSight_2026.xlsx',
    badge: 'Nouveau',
  },
]

export default function TemplatesResourceCards() {
  const [selected, setSelected] = useState<Template | null>(null)

  return (
    <>
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 pt-4">
        {templates.map((template) => {
          const Icon = template.icon
          const cardBorder = template.featured
            ? 'border border-accent-primary/40 shadow-md ring-1 ring-accent-primary/20'
            : 'border border-gray-200 shadow-sm'

          return (
            <StaggerItem key={template.id}>
              <div
                className={`relative bg-white rounded-2xl ${cardBorder} hover:shadow-md hover:border-accent-primary/30 transition-all duration-200 group`}
              >
                {template.badge && (
                  <div className="absolute -top-3 left-6 z-10 px-3 py-1 bg-accent-primary text-white text-xs font-medium rounded-full tracking-wide shadow-sm">
                    {template.badge}
                  </div>
                )}

                <div className="p-8 pt-8 border-b border-gray-100">
                  <Icon className="w-10 h-10 mb-4 text-gray-700" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{template.description}</p>
                </div>

                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {template.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                        <Check className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => setSelected(template)}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gray-900 text-white font-semibold text-sm tracking-wide border border-gray-800 shadow-sm hover:bg-gray-800 transition-all duration-200 group-hover:shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    Recevoir Excel (.xlsx)
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                    <FileSpreadsheet className="w-3.5 h-3.5 inline" />
                    Envoi par email · Excel 2016+ / Google Sheets
                  </p>
                </div>
              </div>
            </StaggerItem>
          )
        })}
      </StaggerContainer>

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


