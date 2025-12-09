import { Metadata } from 'next'
import Link from 'next/link'
import { Download, FileSpreadsheet, TrendingUp, DollarSign, BarChart3, ArrowRight, Check, Zap, RefreshCw, GraduationCap } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'Templates Excel Gratuits Finance | Budget, DSO, Cash Flow | FinSight',
    description: 'Téléchargez gratuitement nos templates Excel professionnels : Budget prévisionnel 2025, Tracker DSO, Dashboard Cash Flow. Prêts à l\'emploi avec formules automatiques.',
    openGraph: {
        title: 'Templates Excel Gratuits pour CFO/DAF | FinSight',
        description: '3 templates Excel professionnels gratuits pour piloter votre PME',
        type: 'website'
    }
}

interface Template {
    id: string
    title: string
    description: string
    icon: any
    features: string[]
    downloadUrl: string
    downloadUrlPdf: string
    color: string
    badge?: string
}

const templates: Template[] = [
    {
        id: 'budget-previsionnel',
        title: 'Budget Prévisionnel 2025',
        description: 'Planifiez votre année avec un budget prévisionnel complet sur 12 mois',
        icon: TrendingUp,
        features: [
            '12 mois de prévisions CA/Charges',
            'Formules automatiques',
            'Graphiques d\'évolution intégrés',
            'Calcul auto des marges et cash flow',
            'Compatible import FinSight'
        ],
        downloadUrl: '/templates/excel/budget-previsionnel-2025.xlsx',
        downloadUrlPdf: '/templates/pdf/budget-previsionnel-2025.pdf',
        color: 'border-l-4 border-blue-600 bg-gray-50',
        badge: 'Le plus téléchargé'
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
            'Export vers FinSight en 1 clic'
        ],
        downloadUrl: '/templates/excel/tracker-dso.xlsx',
        downloadUrlPdf: '/templates/pdf/tracker-dso.pdf',
        color: 'border-l-4 border-green-600 bg-gray-50'
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
            'Analyse mensuelle'
        ],
        downloadUrl: '/templates/excel/dashboard-cashflow.xlsx',
        downloadUrlPdf: '/templates/pdf/dashboard-cashflow.pdf',
        color: 'border-l-4 border-purple-600 bg-gray-50'
    }
]

export default function TemplatesPage() {
    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-6">
                        <FileSpreadsheet className="w-4 h-4 text-accent-primary" />
                        <span className="text-accent-primary text-sm font-semibold">100% Gratuits</span>
                    </div>

                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Templates Excel Professionnels<br />
                        <span className="text-accent-primary">pour CFO/DAF</span>
                    </h1>

                    <p className="text-xl text-secondary max-w-3xl mx-auto mb-4">
                        3 fichiers Excel prêts à l'emploi avec formules automatiques,<br />
                        graphiques intégrés et compatibles import FinSight
                    </p>

                    <p className="text-sm text-tertiary">
                        Téléchargement direct • Aucune inscription requise • Compatible Excel/Google Sheets
                    </p>
                </div>

                {/* Value Proposition Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="surface rounded-xl p-6 border-2 border-border-default">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 mx-auto">
                            <Zap className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold mb-2 text-center">Prêts à l'emploi</h3>
                        <p className="text-sm text-secondary text-center">
                            Ouvrez et utilisez immédiatement, formules déjà configurées
                        </p>
                    </div>
                    <div className="surface rounded-xl p-6 border-2 border-border-default">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 mx-auto">
                            <RefreshCw className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-bold mb-2 text-center">Import FinSight</h3>
                        <p className="text-sm text-secondary text-center">
                            Exportez vos données vers FinSight pour analyse IA instantanée
                        </p>
                    </div>
                    <div className="surface rounded-xl p-6 border-2 border-border-default">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                            <GraduationCap className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-bold mb-2 text-center">100% Finance FR</h3>
                        <p className="text-sm text-secondary text-center">
                            Conformes PCG 2025, terminologie française, benchmarks sectoriels
                        </p>
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {templates.map((template) => {
                        const Icon = template.icon
                        return (
                            <div
                                key={template.id}
                                className="surface rounded-xl overflow-hidden border-2 border-border-default hover:border-accent-primary transition-all group"
                            >
                                {/* Header */}
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

                                {/* Features */}
                                <div className="p-6">
                                    <ul className="space-y-3 mb-6">
                                        {template.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-secondary leading-relaxed">
                                                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Download Buttons */}
                                    <div className="space-y-2">
                                        <a
                                            href={template.downloadUrl}
                                            download
                                            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all group-hover:shadow-lg"
                                        >
                                            <Download className="w-5 h-5" />
                                            Télécharger Excel (.xlsx)
                                        </a>

                                        <a
                                            href={template.downloadUrlPdf}
                                            download
                                            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white hover:bg-gray-50 text-accent-primary border-2 border-accent-primary rounded-lg font-semibold transition-all"
                                        >
                                            <Download className="w-5 h-5" />
                                            Télécharger PDF
                                        </a>
                                    </div>

                                    <p className="text-xs text-tertiary text-center mt-3">
                                        Excel 2016+ / Google Sheets • PDF universel
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* CTA Section */}
                <div className="surface rounded-2xl p-12 border-2 border-accent-primary-border bg-gradient-to-br from-accent-primary-subtle to-primary text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Vous voulez automatiser tout ça avec l'IA ?
                    </h2>
                    <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
                        FinSight importe vos fichiers Excel et calcule automatiquement 15+ KPIs<br />
                        en 10 secondes. Plus besoin de formules manuelles.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/auth/signup"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all shadow-lg"
                        >
                            Essayer FinSight Gratuitement
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white rounded-lg font-semibold transition-all"
                        >
                            Voir la démo (30 sec)
                        </Link>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-10">Questions fréquentes</h2>

                    <div className="space-y-6">
                        <div className="surface rounded-xl p-6 border-2 border-border-default">
                            <h3 className="font-bold mb-2">Pourquoi c'est gratuit ?</h3>
                            <p className="text-secondary text-sm">
                                Ces templates sont offerts pour vous aider à améliorer votre gestion financière.
                                Si vous voulez aller plus loin avec l'analyse IA, découvrez FinSight.
                            </p>
                        </div>

                        <div className="surface rounded-xl p-6 border-2 border-border-default">
                            <h3 className="font-bold mb-2">Comment importer dans FinSight ?</h3>
                            <p className="text-secondary text-sm">
                                Remplissez le template Excel → Exportez en CSV → Uploadez sur FinSight.
                                Le dashboard se génère automatiquement avec tous les KPIs.
                            </p>
                        </div>

                        <div className="surface rounded-xl p-6 border-2 border-border-default">
                            <h3 className="font-bold mb-2">Compatible Google Sheets ?</h3>
                            <p className="text-secondary text-sm">
                                Oui ! Uploadez le fichier .xlsx sur Google Sheets. Les formules sont compatibles
                                (quelques ajustements mineurs possibles sur certaines fonctions avancées).
                            </p>
                        </div>

                        <div className="surface rounded-xl p-6 border-2 border-border-default">
                            <h3 className="font-bold mb-2">Mes données sont-elles sécurisées ?</h3>
                            <p className="text-secondary text-sm">
                                Les templates s'exécutent 100% sur votre ordinateur. Aucune donnée n'est envoyée
                                à FinSight tant que vous ne l'uploadez pas volontairement.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
