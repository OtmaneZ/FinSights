'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TresorisAgentUI, DemoOrchestrator } from '@/components/tresoris';
import {
  Shield,
  Play,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowDown,
  Eye,
  Target,
  Clock,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles,
  Rocket
} from 'lucide-react';

// =============================================================================
// DEMO TRÉSORIS - Page Premium Interactive
// =============================================================================
// Objectif : Montrer la puissance de l'agent IA en action, pas expliquer
// Principe : "Testez maintenant" > "Découvrez comment ça marche"
// =============================================================================

export default function DemoTresorisPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToDemo = () => {
    setShowDemo(true);
    setTimeout(() => {
      demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handlers pour DemoOrchestrator
  const handleStartDemo = useCallback(async () => {
    try {
      await fetch('/api/tresoris/agent/start', { method: 'POST' });
    } catch (err) {
      console.error('Failed to start agent:', err);
    }
  }, []);

  const handleStopDemo = useCallback(async () => {
    try {
      await fetch('/api/tresoris/agent/stop', { method: 'POST' });
    } catch (err) {
      console.error('Failed to stop agent:', err);
    }
  }, []);

  const handleSimulateRisk = useCallback(async (clientName: string, amount: number, daysOverdue: number) => {
    try {
      await fetch('/api/tresoris/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          amount,
          days_overdue: daysOverdue
        })
      });
    } catch (err) {
      console.error('Failed to simulate:', err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      {/* ═══════════════════════════════════════════════════════════════════
          HERO - Premium, Focus Action
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm text-emerald-400 font-medium">Agent IA Autonome</span>
            </div>

            {/* Logo */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight">
                TRÉSORIS
              </h1>
            </div>

            {/* Headline Premium */}
            <p className="text-xl sm:text-2xl text-slate-300 mb-4 max-w-2xl mx-auto">
              L&apos;agent qui surveille votre trésorerie
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-8">
              <span className="text-emerald-400">pendant que vous dormez</span>
            </p>

            {/* Value Props - 3 colonnes */}
            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">26</div>
                <div className="text-xs text-slate-400">situations surveillées</div>
              </div>
              <div className="text-center border-x border-slate-700">
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-xs text-slate-400">surveillance active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">&lt;30s</div>
                <div className="text-xs text-slate-400">temps de réaction</div>
              </div>
            </div>

            {/* CTA Principal */}
            <motion.button
              onClick={scrollToDemo}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300"
            >
              <Play className="w-6 h-6" />
              Tester l&apos;agent maintenant
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </motion.button>

            <p className="mt-4 text-sm text-slate-500">
              Aucune inscription • Données démo incluses • 100% interactif
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-6 h-6 text-slate-500" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          QUICK VALUE - Ce que fait l'agent (pas comment)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ce que TRÉSORIS fait pour vous
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Un vrai agent autonome, pas un simple dashboard
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Surveille */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="group p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Surveille</h3>
              <p className="text-sm text-slate-400">26 situations de risque en continu</p>
            </motion.div>

            {/* Détecte */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Détecte</h3>
              <p className="text-sm text-slate-400">Les signaux faibles avant le risque</p>
            </motion.div>

            {/* Priorise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Priorise</h3>
              <p className="text-sm text-slate-400">Actions P1/P2/P3 avec ROI estimé</p>
            </motion.div>

            {/* Attend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Attend</h3>
              <p className="text-sm text-slate-400">Votre validation avant d'agir</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DEMO INTERACTIVE - Le coeur de la page
      ═══════════════════════════════════════════════════════════════════ */}
      <section ref={demoRef} className="py-12 bg-slate-50" id="demo">
        {/* Intro Bar */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg">Démo Interactive</span>
                  <span className="hidden sm:inline text-emerald-100 ml-3">
                    Regardez l&apos;agent travailler de manière autonome
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="hidden md:flex items-center text-sm text-emerald-100 bg-white/10 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse" />
                  NovaTech Solutions — Scale-up SaaS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Watch Me Work - Orchestre la démo */}
        <div className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                <Rocket className="w-4 h-4" />
                Mode &quot;Watch Me Work&quot;
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Regardez l&apos;agent détecter un risque en temps réel
              </h3>
              <p className="text-slate-600 max-w-xl mx-auto">
                Aucune action requise de votre part. L&apos;agent scanne, détecte et recommande automatiquement.
              </p>
            </div>
            
            <DemoOrchestrator 
              onStartDemo={handleStartDemo}
              onStopDemo={handleStopDemo}
              onSimulateRisk={handleSimulateRisk}
            />
          </div>
        </div>

        {/* Séparateur visuel */}
        <div className="bg-slate-100 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
              <span className="h-px bg-slate-300 flex-1" />
              <span className="flex items-center gap-2 px-4">
                <Eye className="w-4 h-4" />
                Ou explorez le dashboard complet ci-dessous
              </span>
              <span className="h-px bg-slate-300 flex-1" />
            </div>
          </div>
        </div>

        {/* Agent UI - Dashboard complet */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence>
            {(showDemo || isLoaded) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <TresorisAgentUI />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PUISSANCE - Bénéfices, pas technique
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              La puissance sous le capot
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              6 moteurs d&apos;analyse travaillent en parallèle pour vous protéger
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: 'Analyse des Patterns',
                benefit: 'Détecte les dérives de paiement avant qu\'elles ne deviennent critiques',
                example: 'TechCorp paie de plus en plus tard : +2j/mois depuis 4 mois'
              },
              {
                icon: Target,
                title: 'Scoring Client A/B/C/D',
                benefit: '12 indicateurs pondérés pour classifier le risque de chaque client',
                example: 'Rating dégradé : B → C (fiabilité en baisse de 15%)'
              },
              {
                icon: TrendingUp,
                title: 'Prévisions Cash-flow',
                benefit: 'Anticipe votre trésorerie sur 30/60/90 jours avec confiance',
                example: 'Semaine 8 : 142K€ ± 18K€ (confiance 85%)'
              },
              {
                icon: AlertTriangle,
                title: 'Signaux Faibles',
                benefit: 'Détection précoce avant matérialisation du risque',
                example: 'Alerte : concentration client > 25% du CA'
              },
              {
                icon: CheckCircle2,
                title: 'Actions Prioritaires',
                benefit: 'Recommandations P1/P2/P3 avec ROI estimé',
                example: 'Relance TechCorp → impact +68K€ en 15min'
              },
              {
                icon: Users,
                title: 'Ajustement Saisonnier',
                benefit: 'Corrige les prévisions selon votre secteur',
                example: 'Août : +30% de délais moyens (vacances)'
              }
            ].map((engine, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                  <engine.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{engine.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{engine.benefit}</p>
                <div className="text-xs text-emerald-400/80 bg-emerald-500/10 px-3 py-2 rounded-lg">
                  💡 {engine.example}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA FINAL
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Convaincu par la démo ?
            </h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto text-lg">
              Déployez TRÉSORIS sur vos données réelles en moins de 24 heures.
              Vos équipes seront formées et opérationnelles en 2 jours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="https://calendly.com/zineinsight"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-colors shadow-xl"
              >
                Réserver ma démo privée
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/agents"
                className="w-full sm:w-auto border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Voir tous les agents
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
