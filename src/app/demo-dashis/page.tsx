import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ComingSoonDashis } from '@/components/ComingSoon'

export default function DemoDashisPage() {
    return (
        <div className="min-h-screen bg-primary text-primary flex flex-col">
            <Header />
            <main className="flex flex-1 flex-col">
                <ComingSoonDashis />
            </main>
            <Footer />
        </div>
    )
}


// [VEILLE] import { Suspense } from 'react'
// [VEILLE] import DashisAgentUI from '@/components/DashisAgentUI'
// [VEILLE] import Header from '@/components/Header'
// [VEILLE] import Footer from '@/components/Footer'
// [VEILLE] import Link from 'next/link'
// [VEILLE] import { ArrowLeft, Sparkles, BarChart3, Brain, Zap } from 'lucide-react'
// [VEILLE]
// [VEILLE] // Loading component for Suspense
// [VEILLE] function DashboardLoading() {
// [VEILLE]     return (
// [VEILLE]         <div className="flex items-center justify-center min-h-[600px]">
// [VEILLE]             <div className="text-center">
// [VEILLE]                 <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
// [VEILLE]                 <p className="text-secondary">Chargement du dashboard DASHIS...</p>
// [VEILLE]             </div>
// [VEILLE]         </div>
// [VEILLE]     )
// [VEILLE] }
// [VEILLE]
// [VEILLE] export default function DemoDashisPage() {
// [VEILLE]     return (
// [VEILLE]         <div className="min-h-screen bg-primary text-primary flex flex-col">
// [VEILLE]             {/* Header - Cohérent avec tout le site */}
// [VEILLE]             <Header />
// [VEILLE]
// [VEILLE]             {/* Context Bar - DASHIS specific */}
// [VEILLE]             <div className="bg-gradient-to-r from-accent-primary/5 via-accent-primary/10 to-accent-primary/5 border-b border-border-subtle">
// [VEILLE]                 <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
// [VEILLE]                     <div className="flex items-center gap-4">
// [VEILLE]                         <Link 
// [VEILLE]                             href="/agents" 
// [VEILLE]                             className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
// [VEILLE]                         >
// [VEILLE]                             <ArrowLeft className="w-4 h-4" />
// [VEILLE]                             Tous les agents
// [VEILLE]                         </Link>
// [VEILLE]                         <div className="w-px h-4 bg-border-subtle" />
// [VEILLE]                         <div className="flex items-center gap-2">
// [VEILLE]                             <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center">
// [VEILLE]                                 <Sparkles className="w-4 h-4 text-accent-primary" />
// [VEILLE]                             </div>
// [VEILLE]                             <span className="font-semibold text-primary">DASHIS</span>
// [VEILLE]                             <span className="px-2 py-0.5 text-xs font-medium bg-accent-primary/10 text-accent-primary rounded-full">
// [VEILLE]                                 Demo Interactive
// [VEILLE]                             </span>
// [VEILLE]                         </div>
// [VEILLE]                     </div>
// [VEILLE]                     <Link 
// [VEILLE]                         href="/agents/dashis" 
// [VEILLE]                         className="text-sm text-accent-primary hover:text-accent-primary/80 transition-colors font-medium"
// [VEILLE]                     >
// [VEILLE]                         En savoir plus →
// [VEILLE]                     </Link>
// [VEILLE]                 </div>
// [VEILLE]             </div>
// [VEILLE]
// [VEILLE]             {/* Main Content */}
// [VEILLE]             <main className="flex-1">
// [VEILLE]                 {/* Dashboard */}
// [VEILLE]                 <Suspense fallback={<DashboardLoading />}>
// [VEILLE]                     <DashisAgentUI />
// [VEILLE]                 </Suspense>
// [VEILLE]
// [VEILLE]                 {/* Capabilities Summary - Business-focused, not dev-focused */}
// [VEILLE]                 <section className="bg-secondary border-t border-border-subtle">
// [VEILLE]                     <div className="max-w-7xl mx-auto px-6 py-12">
// [VEILLE]                         <div className="text-center mb-8">
// [VEILLE]                             <h2 className="text-xl font-semibold text-primary mb-2">
// [VEILLE]                                 Ce que DASHIS analyse pour vous
// [VEILLE]                             </h2>
// [VEILLE]                             <p className="text-secondary">
// [VEILLE]                                 Vision 360° de votre performance financière en quelques secondes
// [VEILLE]                             </p>
// [VEILLE]                         </div>
// [VEILLE]                         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
// [VEILLE]                             <div className="text-center p-6 bg-primary rounded-xl border border-border-subtle">
// [VEILLE]                                 <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center mx-auto mb-4">
// [VEILLE]                                     <BarChart3 className="w-6 h-6 text-accent-primary" />
// [VEILLE]                                 </div>
// [VEILLE]                                 <h3 className="font-semibold text-primary mb-2">5 KPIs Clés</h3>
// [VEILLE]                                 <p className="text-sm text-tertiary">
// [VEILLE]                                     CA, Charges, Marge, Cash Flow, DSO calculés automatiquement
// [VEILLE]                                 </p>
// [VEILLE]                             </div>
// [VEILLE]                             <div className="text-center p-6 bg-primary rounded-xl border border-border-subtle">
// [VEILLE]                                 <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
// [VEILLE]                                     <Brain className="w-6 h-6 text-emerald-500" />
// [VEILLE]                                 </div>
// [VEILLE]                                 <h3 className="font-semibold text-primary mb-2">IA Prédictive</h3>
// [VEILLE]                                 <p className="text-sm text-tertiary">
// [VEILLE]                                     Détection d'anomalies et prévisions à 90 jours
// [VEILLE]                                 </p>
// [VEILLE]                             </div>
// [VEILLE]                             <div className="text-center p-6 bg-primary rounded-xl border border-border-subtle">
// [VEILLE]                                 <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
// [VEILLE]                                     <Sparkles className="w-6 h-6 text-blue-500" />
// [VEILLE]                                 </div>
// [VEILLE]                                 <h3 className="font-semibold text-primary mb-2">Score FinSight™</h3>
// [VEILLE]                                 <p className="text-sm text-tertiary">
// [VEILLE]                                     Note de santé financière de 0 à 100
// [VEILLE]                                 </p>
// [VEILLE]                             </div>
// [VEILLE]                             <div className="text-center p-6 bg-primary rounded-xl border border-border-subtle">
// [VEILLE]                                 <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
// [VEILLE]                                     <Zap className="w-6 h-6 text-purple-500" />
// [VEILLE]                                 </div>
// [VEILLE]                                 <h3 className="font-semibold text-primary mb-2">Simulations</h3>
// [VEILLE]                                 <p className="text-sm text-tertiary">
// [VEILLE]                                     Testez vos scénarios What-If en temps réel
// [VEILLE]                                 </p>
// [VEILLE]                             </div>
// [VEILLE]                         </div>
// [VEILLE]                         <div className="text-center mt-8">
// [VEILLE]                             <Link 
// [VEILLE]                                 href="/agents/dashis"
// [VEILLE]                                 className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-primary/80 transition-colors font-medium"
// [VEILLE]                             >
// [VEILLE]                                 Découvrir toutes les fonctionnalités DASHIS
// [VEILLE]                                 <ArrowLeft className="w-4 h-4 rotate-180" />
// [VEILLE]                             </Link>
// [VEILLE]                         </div>
// [VEILLE]                     </div>
// [VEILLE]                 </section>
// [VEILLE]             </main>
// [VEILLE]
// [VEILLE]             {/* Footer - Cohérent avec tout le site */}
// [VEILLE]             <Footer />
// [VEILLE]         </div>
// [VEILLE]     )
// [VEILLE] }