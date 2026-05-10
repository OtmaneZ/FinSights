'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ComingSoonTresoris } from '@/components/ComingSoon';

export default function DemoTresorisPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="flex flex-1 flex-col">
        <ComingSoonTresoris />
      </main>
      <Footer />
    </div>
  );
}


// [VEILLE] 'use client';
// [VEILLE]
// [VEILLE] import { useState, useEffect, useRef, useCallback } from 'react';
// [VEILLE] import { motion, AnimatePresence } from 'framer-motion';
// [VEILLE] import Link from 'next/link';
// [VEILLE] import Header from '@/components/Header';
// [VEILLE] import Footer from '@/components/Footer';
// [VEILLE] import { TresorisAgentUI, DemoOrchestrator } from '@/components/tresoris';
// [VEILLE] import {
// [VEILLE]   Shield,
// [VEILLE]   Play,
// [VEILLE]   Zap,
// [VEILLE]   TrendingUp,
// [VEILLE]   AlertTriangle,
// [VEILLE]   CheckCircle2,
// [VEILLE]   ArrowDown,
// [VEILLE]   Eye,
// [VEILLE]   Target,
// [VEILLE]   Clock,
// [VEILLE]   Users,
// [VEILLE]   BarChart3,
// [VEILLE]   ArrowRight,
// [VEILLE]   Sparkles,
// [VEILLE]   Rocket
// [VEILLE] } from 'lucide-react';
// [VEILLE]
// [VEILLE] // =============================================================================
// [VEILLE] // DEMO TRÉSORIS - Page Premium Interactive
// [VEILLE] // =============================================================================
// [VEILLE] // Objectif : Montrer la puissance de l'agent IA en action, pas expliquer
// [VEILLE] // Principe : "Testez maintenant" > "Découvrez comment ça marche"
// [VEILLE] // =============================================================================
// [VEILLE]
// [VEILLE] export default function DemoTresorisPage() {
// [VEILLE]   const [isLoaded, setIsLoaded] = useState(false);
// [VEILLE]   const [showDemo, setShowDemo] = useState(false);
// [VEILLE]   const demoRef = useRef<HTMLDivElement>(null);
// [VEILLE]
// [VEILLE]   useEffect(() => {
// [VEILLE]     setIsLoaded(true);
// [VEILLE]   }, []);
// [VEILLE]
// [VEILLE]   const scrollToDemo = () => {
// [VEILLE]     setShowDemo(true);
// [VEILLE]     setTimeout(() => {
// [VEILLE]       demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
// [VEILLE]     }, 100);
// [VEILLE]   };
// [VEILLE]
// [VEILLE]   // Handlers pour DemoOrchestrator
// [VEILLE]   const handleStartDemo = useCallback(async () => {
// [VEILLE]     try {
// [VEILLE]       console.log('🚀 Starting TRESORIS agent...')
// [VEILLE]       const response = await fetch('/api/tresoris/agent/start', { method: 'POST' })
// [VEILLE]       const data = await response.json()
// [VEILLE]
// [VEILLE]       if (!response.ok) {
// [VEILLE]         console.error('❌ Failed to start agent:', data)
// [VEILLE]         throw new Error(data.error || 'Failed to start agent')
// [VEILLE]       }
// [VEILLE]
// [VEILLE]       console.log('✅ Agent started successfully:', data)
// [VEILLE]     } catch (err) {
// [VEILLE]       console.error('❌ Error starting agent:', err)
// [VEILLE]       // Ne pas bloquer la démo, continuer quand même
// [VEILLE]     }
// [VEILLE]   }, [])
// [VEILLE]
// [VEILLE]   const handleStopDemo = useCallback(async () => {
// [VEILLE]     try {
// [VEILLE]       console.log('🛑 Stopping TRESORIS agent...')
// [VEILLE]       const response = await fetch('/api/tresoris/agent/stop', { method: 'POST' })
// [VEILLE]       const data = await response.json()
// [VEILLE]
// [VEILLE]       if (!response.ok) {
// [VEILLE]         console.error('❌ Failed to stop agent:', data)
// [VEILLE]       }
// [VEILLE]
// [VEILLE]       console.log('✅ Agent stopped successfully:', data)
// [VEILLE]     } catch (err) {
// [VEILLE]       console.error('❌ Error stopping agent:', err)
// [VEILLE]     }
// [VEILLE]   }, [])
// [VEILLE]
// [VEILLE]   const handleSimulateRisk = useCallback(async (clientName: string, amount: number, daysOverdue: number) => {
// [VEILLE]     try {
// [VEILLE]       console.log('💥 Simulating risk:', { clientName, amount, daysOverdue })
// [VEILLE]       const response = await fetch('/api/tresoris/simulate', {
// [VEILLE]         method: 'POST',
// [VEILLE]         headers: { 'Content-Type': 'application/json' },
// [VEILLE]         body: JSON.stringify({
// [VEILLE]           client_name: clientName,
// [VEILLE]           amount,
// [VEILLE]           days_overdue: daysOverdue
// [VEILLE]         })
// [VEILLE]       })
// [VEILLE]
// [VEILLE]       const data = await response.json()
// [VEILLE]
// [VEILLE]       if (!response.ok) {
// [VEILLE]         console.error('❌ Simulation failed:', data)
// [VEILLE]         throw new Error(data.details || data.error || 'Simulation failed')
// [VEILLE]       }
// [VEILLE]
// [VEILLE]       console.log('✅ Simulation complete:', data)
// [VEILLE]     } catch (err) {
// [VEILLE]       console.error('❌ Simulation error:', err)
// [VEILLE]       // Ne pas bloquer la démo
// [VEILLE]     }
// [VEILLE]   }, []);
// [VEILLE]
// [VEILLE]   return (
// [VEILLE]     <div className="min-h-screen bg-slate-950">
// [VEILLE]       <Header />
// [VEILLE]
// [VEILLE]       {/* ═══════════════════════════════════════════════════════════════════
// [VEILLE]           HERO - Premium, Focus Action
// [VEILLE]       ═══════════════════════════════════════════════════════════════════ */}
// [VEILLE]       <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
// [VEILLE]         {/* Background Effects */}
// [VEILLE]         <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-950" />
// [VEILLE]         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
// [VEILLE]
// [VEILLE]         {/* Grid Pattern */}
// [VEILLE]         <div className="absolute inset-0 opacity-20">
// [VEILLE]           <div className="absolute inset-0" style={{
// [VEILLE]             backgroundImage: 'linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)',
// [VEILLE]             backgroundSize: '60px 60px'
// [VEILLE]           }} />
// [VEILLE]         </div>
// [VEILLE]
// [VEILLE]         <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
// [VEILLE]           <motion.div
// [VEILLE]             initial={{ opacity: 0, y: 30 }}
// [VEILLE]             animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
// [VEILLE]             transition={{ duration: 0.8 }}
// [VEILLE]           >
// [VEILLE]             {/* Badge */}
// [VEILLE]             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-8">
// [VEILLE]               <span className="relative flex h-2 w-2">
// [VEILLE]                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
// [VEILLE]                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
// [VEILLE]               </span>
// [VEILLE]               <span className="text-sm text-emerald-400 font-medium">Agent IA Autonome</span>
// [VEILLE]             </div>
// [VEILLE]
// [VEILLE]             {/* Logo */}
// [VEILLE]             <div className="flex items-center justify-center gap-4 mb-8">
// [VEILLE]               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
// [VEILLE]                 <Shield className="w-8 h-8 text-white" />
// [VEILLE]               </div>
// [VEILLE]               <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight">
// [VEILLE]                 TRÉSORIS
// [VEILLE]               </h1>
// [VEILLE]             </div>
// [VEILLE]
// [VEILLE]             {/* Headline Premium */}
// [VEILLE]             <p className="text-xl sm:text-2xl text-slate-300 mb-4 max-w-2xl mx-auto">
// [VEILLE]               L&apos;agent qui surveille votre trésorerie
// [VEILLE]             </p>
// [VEILLE]             <p className="text-3xl sm:text-4xl font-bold text-white mb-8">
// [VEILLE]               <span className="text-emerald-400">pendant que vous dormez</span>
// [VEILLE]             </p>
// [VEILLE]
// [VEILLE]             {/* Value Props - 3 colonnes */}
// [VEILLE]             <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-12">
// [VEILLE]               <div className="text-center">
// [VEILLE]                 <div className="text-2xl font-bold text-white mb-1">26</div>
// [VEILLE]                 <div className="text-xs text-slate-400">situations surveillées</div>
// [VEILLE]               </div>
// [VEILLE]               <div className="text-center border-x border-slate-700">
// [VEILLE]                 <div className="text-2xl font-bold text-white mb-1">24/7</div>
// [VEILLE]                 <div className="text-xs text-slate-400">surveillance active</div>
// [VEILLE]               </div>
// [VEILLE]               <div className="text-center">
// [VEILLE]                 <div className="text-2xl font-bold text-white mb-1">&lt;30s</div>
// [VEILLE]                 <div className="text-xs text-slate-400">temps de réaction</div>
// [VEILLE]               </div>
// [VEILLE]             </div>
// [VEILLE]
// [VEILLE]             {/* CTA Principal */}
// [VEILLE]             <motion.button
// [VEILLE]               onClick={scrollToDemo}
// [VEILLE]               whileHover={{ scale: 1.02 }}
// [VEILLE]               whileTap={{ scale: 0.98 }}
// [VEILLE]               className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300"
// [VEILLE]             >
// [VEILLE]               <Play className="w-6 h-6" />
// [VEILLE]               Tester l&apos;agent maintenant
// [VEILLE]               <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
// [VEILLE]             </motion.button>
// [VEILLE]
// [VEILLE]             <p className="mt-4 text-sm text-slate-500">
// [VEILLE]               Aucune inscription • Données démo incluses • 100% interactif
// [VEILLE]             </p>
// [VEILLE]           </motion.div>
// [VEILLE]         </div>
// [VEILLE]
// [VEILLE]         {/* Scroll Indicator */}
// [VEILLE]         <motion.div 
// [VEILLE]           className="absolute bottom-8 left-1/2 -translate-x-1/2"
// [VEILLE]           animate={{ y: [0, 10, 0] }}
// [VEILLE]           transition={{ duration: 2, repeat: Infinity }}
// [VEILLE]         >
// [VEILLE]           <ArrowDown className="w-6 h-6 text-slate-500" />
// [VEILLE]         </motion.div>
// [VEILLE]       </section>
// [VEILLE]
// [VEILLE]       {/* ═══════════════════════════════════════════════════════════════════
// [VEILLE]           QUICK VALUE - Ce que fait l'agent (pas comment)
// [VEILLE]       ═══════════════════════════════════════════════════════════════════ */}
// [VEILLE]       <section className="py-20 bg-slate-900 border-t border-slate-800">
// [VEILLE]         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
// [VEILLE]           <motion.div
// [VEILLE]             initial={{ opacity: 0, y: 20 }}
// [VEILLE]             whileInView={{ opacity: 1, y: 0 }}
// [VEILLE]             viewport={{ once: true }}
// [VEILLE]             className="text-center mb-16"
// [VEILLE]           >
// [VEILLE]             <h2 className="text-3xl font-bold text-white mb-4">
// [VEILLE]               Ce que TRÉSORIS fait pour vous
// [VEILLE]             </h2>
// [VEILLE]             <p className="text-slate-400 max-w-xl mx-auto">
// [VEILLE]               Un vrai agent autonome, pas un simple dashboard
// [VEILLE]             </p>
// [VEILLE]           </motion.div>
// [VEILLE]
// [VEILLE]           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
// [VEILLE]             {/* Surveille */}
// [VEILLE]             <motion.div
// [VEILLE]               initial={{ opacity: 0, y: 20 }}
// [VEILLE]               whileInView={{ opacity: 1, y: 0 }}
// [VEILLE]               viewport={{ once: true }}
// [VEILLE]               transition={{ delay: 0 }}
// [VEILLE]               className="group p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all"
// [VEILLE]             >
// [VEILLE]               <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
// [VEILLE]                 <Eye className="w-6 h-6 text-emerald-400" />
// [VEILLE]               </div>
// [VEILLE]               <h3 className="text-lg font-semibold text-white mb-2">Surveille</h3>
// [VEILLE]               <p className="text-sm text-slate-400">26 situations de risque en continu</p>
// [VEILLE]             </motion.div>
// [VEILLE]
// [VEILLE]             {/* Détecte */}
// [VEILLE]             <motion.div
// [VEILLE]               initial={{ opacity: 0, y: 20 }}
// [VEILLE]               whileInView={{ opacity: 1, y: 0 }}
// [VEILLE]               viewport={{ once: true }}
// [VEILLE]               transition={{ delay: 0.1 }}
// [VEILLE]               className="group p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all"
// [VEILLE]             >
// [VEILLE]               <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
// [VEILLE]                 <AlertTriangle className="w-6 h-6 text-amber-400" />
// [VEILLE]               </div>
// [VEILLE]               <h3 className="text-lg font-semibold text-white mb-2">Détecte</h3>
// [VEILLE]               <p className="text-sm text-slate-400">Les signaux faibles avant le risque</p>
// [VEILLE]             </motion.div>
// [VEILLE]
// [VEILLE]             {/* Priorise */}
// [VEILLE]             <motion.div
// [VEILLE]               initial={{ opacity: 0, y: 20 }}
// [VEILLE]               whileInView={{ opacity: 1, y: 0 }}
// [VEILLE]               viewport={{ once: true }}
// [VEILLE]               transition={{ delay: 0.2 }}
// [VEILLE]               className="group p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all"
// [VEILLE]             >
// [VEILLE]               <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
// [VEILLE]                 <Target className="w-6 h-6 text-blue-400" />
// [VEILLE]               </div>
// [VEILLE]               <h3 className="text-lg font-semibold text-white mb-2">Priorise</h3>
// [VEILLE]               <p className="text-sm text-slate-400">Actions P1/P2/P3 avec ROI estimé</p>
// [VEILLE]             </motion.div>
// [VEILLE]
// [VEILLE]             {/* Attend */}
// [VEILLE]             <motion.div
// [VEILLE]               initial={{ opacity: 0, y: 20 }}
// [VEILLE]               whileInView={{ opacity: 1, y: 0 }}
// [VEILLE]               viewport={{ once: true }}
// [VEILLE]               transition={{ delay: 0.3 }}
// [VEILLE]               className="group p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all"
// [VEILLE]             >
// [VEILLE]               <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
// [VEILLE]                 <Clock className="w-6 h-6 text-purple-400" />
// [VEILLE]               </div>
// [VEILLE]               <h3 className="text-lg font-semibold text-white mb-2">Attend</h3>
// [VEILLE]               <p className="text-sm text-slate-400">Votre validation avant d'agir</p>
// [VEILLE]             </motion.div>
// [VEILLE]           </div>
// [VEILLE]         </div>
// [VEILLE]       </section>
// [VEILLE]
// [VEILLE]       {/* ═══════════════════════════════════════════════════════════════════
// [VEILLE]           DEMO INTERACTIVE - Le coeur de la page
// [VEILLE]       ═══════════════════════════════════════════════════════════════════ */}
// [VEILLE]       <section ref={demoRef} className="py-12 bg-slate-50" id="demo">
// [VEILLE]         {/* Intro Bar */}
// [VEILLE]         <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
// [VEILLE]           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
// [VEILLE]             <div className="flex items-center justify-between">
// [VEILLE]               <div className="flex items-center space-x-3">
// [VEILLE]                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
// [VEILLE]                   <Zap className="w-5 h-5 text-white" />
// [VEILLE]                 </div>
// [VEILLE]                 <div>
// [VEILLE]                   <span className="font-bold text-lg">Démo Interactive</span>
// [VEILLE]                   <span className="hidden sm:inline text-emerald-100 ml-3">
// [VEILLE]                     Regardez l&apos;agent travailler de manière autonome
// [VEILLE]                   </span>
// [VEILLE]                 </div>
// [VEILLE]               </div>
// [VEILLE]
// [VEILLE]               <div className="flex items-center gap-3">
// [VEILLE]                 <span className="hidden md:flex items-center text-sm text-emerald-100 bg-white/10 px-3 py-1.5 rounded-full">
// [VEILLE]                   <span className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse" />
// [VEILLE]                   NovaTech Solutions - Scale-up SaaS
// [VEILLE]                 </span>
// [VEILLE]               </div>
// [VEILLE]             </div>
// [VEILLE]           </div>
// [VEILLE]         </div>
// [VEILLE]
// [VEILLE]         {/* Mode Watch Me Work - Orchestre la démo */}
// [VEILLE]         <div className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
// [VEILLE]           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
// [VEILLE]             <div className="text-center mb-6">
// [VEILLE]               <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
// [VEILLE]                 <Rocket className="w-4 h-4" />
// [VEILLE]                 Mode &quot;Watch Me Work&quot;
// [VEILLE]               </div>
// [VEILLE]               <h3 className="text-2xl font-bold text-slate-900 mb-2">
// [VEILLE]                 Regardez l&apos;agent détecter un risque en temps réel
// [VEILLE]               </h3>
// [VEILLE]               <p className="text-slate-600 max-w-xl mx-auto">
// [VEILLE]                 Aucune action requise de votre part. L&apos;agent scanne, détecte et recommande automatiquement.
// [VEILLE]               </p>
// [VEILLE]             </div>
// [VEILLE]
// [VEILLE]             <DemoOrchestrator 
// [VEILLE]               onStartDemo={handleStartDemo}
// [VEILLE]               onStopDemo={handleStopDemo}
// [VEILLE]               onSimulateRisk={handleSimulateRisk}
// [VEILLE]             />
// [VEILLE]           </div>
// [VEILLE]         </div>
// [VEILLE]
// [VEILLE]         {/* Séparateur visuel */}
// [VEILLE]         <div className="bg-slate-100 border-y border-slate-200">
// [VEILLE]           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
// [VEILLE]             <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
// [VEILLE]               <span className="h-px bg-slate-300 flex-1" />
// [VEILLE]               <span className="flex items-center gap-2 px-4">
// [VEILLE]                 <Eye className="w-4 h-4" />
// [VEILLE]                 Ou explorez le dashboard complet ci-dessous
// [VEILLE]               </span>
// [VEILLE]               <span className="h-px bg-slate-300 flex-1" />
// [VEILLE]             </div>
// [VEILLE]           </div>
// [VEILLE]         </div>
// [VEILLE]
// [VEILLE]         {/* Agent UI - Dashboard complet */}
// [VEILLE]         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// [VEILLE]           <AnimatePresence>
// [VEILLE]             {(showDemo || isLoaded) && (
// [VEILLE]               <motion.div
// [VEILLE]                 initial={{ opacity: 0, y: 30 }}
// [VEILLE]                 animate={{ opacity: 1, y: 0 }}
// [VEILLE]                 transition={{ duration: 0.6 }}
// [VEILLE]               >
// [VEILLE]                 <TresorisAgentUI />
// [VEILLE]               </motion.div>
// [VEILLE]             )}
// [VEILLE]           </AnimatePresence>
// [VEILLE]         </div>
// [VEILLE]       </section>
// [VEILLE]
// [VEILLE]       {/* ═══════════════════════════════════════════════════════════════════
// [VEILLE]           PUISSANCE - Bénéfices, pas technique
// [VEILLE]       ═══════════════════════════════════════════════════════════════════ */}
// [VEILLE]       <section className="py-20 bg-slate-900">
// [VEILLE]         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
// [VEILLE]           <motion.div
// [VEILLE]             initial={{ opacity: 0, y: 20 }}
// [VEILLE]             whileInView={{ opacity: 1, y: 0 }}
// [VEILLE]             viewport={{ once: true }}
// [VEILLE]             className="text-center mb-16"
// [VEILLE]           >
// [VEILLE]             <h2 className="text-3xl font-bold text-white mb-4">
// [VEILLE]               La puissance sous le capot
// [VEILLE]             </h2>
// [VEILLE]             <p className="text-slate-400 max-w-xl mx-auto">
// [VEILLE]               6 moteurs d&apos;analyse travaillent en parallèle pour vous protéger
// [VEILLE]             </p>
// [VEILLE]           </motion.div>
// [VEILLE]
// [VEILLE]           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
// [VEILLE]             {[
// [VEILLE]               {
// [VEILLE]                 icon: BarChart3,
// [VEILLE]                 title: 'Analyse des Patterns',
// [VEILLE]                 benefit: 'Détecte les dérives de paiement avant qu\'elles ne deviennent critiques',
// [VEILLE]                 example: 'TechCorp paie de plus en plus tard : +2j/mois depuis 4 mois'
// [VEILLE]               },
// [VEILLE]               {
// [VEILLE]                 icon: Target,
// [VEILLE]                 title: 'Scoring Client A/B/C/D',
// [VEILLE]                 benefit: '12 indicateurs pondérés pour classifier le risque de chaque client',
// [VEILLE]                 example: 'Rating dégradé : B → C (fiabilité en baisse de 15%)'
// [VEILLE]               },
// [VEILLE]               {
// [VEILLE]                 icon: TrendingUp,
// [VEILLE]                 title: 'Prévisions Cash-flow',
// [VEILLE]                 benefit: 'Anticipe votre trésorerie sur 30/60/90 jours avec confiance',
// [VEILLE]                 example: 'Semaine 8 : 142K€ ± 18K€ (confiance 85%)'
// [VEILLE]               },
// [VEILLE]               {
// [VEILLE]                 icon: AlertTriangle,
// [VEILLE]                 title: 'Signaux Faibles',
// [VEILLE]                 benefit: 'Détection précoce avant matérialisation du risque',
// [VEILLE]                 example: 'Alerte : concentration client > 25% du CA'
// [VEILLE]               },
// [VEILLE]               {
// [VEILLE]                 icon: CheckCircle2,
// [VEILLE]                 title: 'Actions Prioritaires',
// [VEILLE]                 benefit: 'Recommandations P1/P2/P3 avec ROI estimé',
// [VEILLE]                 example: 'Relance TechCorp → impact +68K€ en 15min'
// [VEILLE]               },
// [VEILLE]               {
// [VEILLE]                 icon: Users,
// [VEILLE]                 title: 'Ajustement Saisonnier',
// [VEILLE]                 benefit: 'Corrige les prévisions selon votre secteur',
// [VEILLE]                 example: 'Août : +30% de délais moyens (vacances)'
// [VEILLE]               }
// [VEILLE]             ].map((engine, idx) => (
// [VEILLE]               <motion.div
// [VEILLE]                 key={idx}
// [VEILLE]                 initial={{ opacity: 0, y: 20 }}
// [VEILLE]                 whileInView={{ opacity: 1, y: 0 }}
// [VEILLE]                 viewport={{ once: true }}
// [VEILLE]                 transition={{ delay: idx * 0.1 }}
// [VEILLE]                 className="group p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all"
// [VEILLE]               >
// [VEILLE]                 <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
// [VEILLE]                   <engine.icon className="w-6 h-6 text-emerald-400" />
// [VEILLE]                 </div>
// [VEILLE]                 <h3 className="text-lg font-semibold text-white mb-2">{engine.title}</h3>
// [VEILLE]                 <p className="text-sm text-slate-400 mb-4">{engine.benefit}</p>
// [VEILLE]                 <div className="text-xs text-emerald-400/80 bg-emerald-500/10 px-3 py-2 rounded-lg">
// [VEILLE]                   💡 {engine.example}
// [VEILLE]                 </div>
// [VEILLE]               </motion.div>
// [VEILLE]             ))}
// [VEILLE]           </div>
// [VEILLE]         </div>
// [VEILLE]       </section>
// [VEILLE]
// [VEILLE]       {/* ═══════════════════════════════════════════════════════════════════
// [VEILLE]           CTA FINAL
// [VEILLE]       ═══════════════════════════════════════════════════════════════════ */}
// [VEILLE]       <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
// [VEILLE]         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
// [VEILLE]           <motion.div
// [VEILLE]             initial={{ opacity: 0, y: 20 }}
// [VEILLE]             whileInView={{ opacity: 1, y: 0 }}
// [VEILLE]             viewport={{ once: true }}
// [VEILLE]           >
// [VEILLE]             <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
// [VEILLE]               Convaincu par la démo ?
// [VEILLE]             </h2>
// [VEILLE]             <p className="text-emerald-100 mb-8 max-w-2xl mx-auto text-lg">
// [VEILLE]               Déployez TRÉSORIS sur vos données réelles en moins de 24 heures.
// [VEILLE]               Vos équipes seront formées et opérationnelles en 2 jours.
// [VEILLE]             </p>
// [VEILLE]             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
// [VEILLE]               <Link
// [VEILLE]                 href="https://calendly.com/zineinsight"
// [VEILLE]                 className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-colors shadow-xl"
// [VEILLE]               >
// [VEILLE]                 Réserver ma démo privée
// [VEILLE]                 <ArrowRight className="w-5 h-5" />
// [VEILLE]               </Link>
// [VEILLE]               <Link
// [VEILLE]                 href="/agents"
// [VEILLE]                 className="w-full sm:w-auto border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
// [VEILLE]               >
// [VEILLE]                 Voir tous les agents
// [VEILLE]               </Link>
// [VEILLE]             </div>
// [VEILLE]           </motion.div>
// [VEILLE]         </div>
// [VEILLE]       </section>
// [VEILLE]
// [VEILLE]       <Footer />
// [VEILLE]     </div>
// [VEILLE]   );
// [VEILLE] }