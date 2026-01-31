'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TresorisAgentUI } from '@/components/tresoris';

// =============================================================================
// DEMO TRÉSORIS - Agent Intelligent de Gestion du Risque Client
// =============================================================================
// Page de démonstration interactive du module TRÉSORIS
// Showcases: Risk Simulation, Early Warning, Cash Runway, Action Recommendations
// =============================================================================

export default function DemoTresorisPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Context Bar - Same style as demo-dashis */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <span className="font-semibold">TRÉSORIS</span>
                <span className="hidden sm:inline text-emerald-100 ml-2">
                  — Agent de Gestion du Risque Client & Cash Flow
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="hidden md:flex items-center text-sm text-emerald-100">
                <span className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse" />
                Démo Interactive
              </span>
              <a 
                href="/agents/tresoris"
                className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors backdrop-blur-sm"
              >
                Documentation technique →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Agent IA en action</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Anticipez les risques clients
                <span className="block text-emerald-600 mt-1">avant qu'ils n'impactent votre trésorerie</span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-8">
                TRÉSORIS analyse en temps réel les comportements de paiement, détecte les signaux 
                d'alerte précoces et recommande des actions concrètes pour protéger votre cash flow.
              </p>

              {/* Key Capabilities */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {[
                  { label: '6 Moteurs V2', sublabel: 'Analyse multi-dimensionnelle' },
                  { label: 'Temps réel', sublabel: 'WebSocket streaming' },
                  { label: 'Prédictif', sublabel: 'ML Pattern Recognition' },
                  { label: 'Actionnable', sublabel: 'Recommandations P1/P2/P3' }
                ].map((cap, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                    <div className="font-semibold text-slate-900 text-sm">{cap.label}</div>
                    <div className="text-xs text-slate-500">{cap.sublabel}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Demo Instructions */}
        <section className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800 mb-1">Comment tester cette démo</h3>
                <p className="text-sm text-amber-700">
                  <strong>1.</strong> Explorez le tableau de bord avec les données de <em>TechNova Solutions</em> (Scale-up SaaS fictive).{' '}
                  <strong>2.</strong> Cliquez sur <strong>"Simuler un Incident"</strong> pour tester l'agent.{' '}
                  <strong>3.</strong> Entrez un nom de client, un montant et un délai de retard — observez la réaction en temps réel de l'agent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Agent Dashboard */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <TresorisAgentUI />
            </motion.div>
          </div>
        </section>

        {/* Technical Proof Section */}
        <section className="bg-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Architecture Technique</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                TRÉSORIS s'appuie sur 6 moteurs d'analyse V2, chacun spécialisé 
                dans une dimension du risque client et du cash flow.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  engine: 'ClientPaymentAnalyzer',
                  module: 'payment_patterns.py',
                  description: 'Analyse les historiques de paiement pour identifier les comportements récurrents et les dérives.'
                },
                {
                  engine: 'ClientRiskScorer',
                  module: 'client_scoring.py',
                  description: 'Calcule un score de risque A/B/C/D basé sur 12 indicateurs pondérés.'
                },
                {
                  engine: 'SmartForecaster',
                  module: 'smart_forecast.py',
                  description: 'Prévisions de trésorerie sur 30/60/90 jours avec intervalles de confiance.'
                },
                {
                  engine: 'EarlyWarningDetector',
                  module: 'early_warning.py',
                  description: 'Détection précoce des signaux faibles avant matérialisation du risque.'
                },
                {
                  engine: 'ActionPrioritizer',
                  module: 'action_optimizer.py',
                  description: 'Génère des recommandations priorisées P1/P2/P3 avec ROI estimé.'
                },
                {
                  engine: 'SeasonalityAdjuster',
                  module: 'seasonality.py',
                  description: 'Corrige les prévisions selon les patterns saisonniers du secteur.'
                }
              ].map((engine, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{engine.engine}</h3>
                      <code className="text-xs text-emerald-400">{engine.module}</code>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">{engine.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Prêt à sécuriser votre trésorerie ?
            </h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Déployez TRÉSORIS sur vos données réelles et obtenez une vision complète 
              de votre risque client en moins de 24 heures.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/contact"
                className="w-full sm:w-auto bg-white text-emerald-700 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Demander une démo personnalisée
              </a>
              <a
                href="/agents/tresoris"
                className="w-full sm:w-auto border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Voir la documentation technique
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
