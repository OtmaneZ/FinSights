"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Clock,
  Target,
  BarChart3,
  LineChart,
  Calendar,
  Users,
  DollarSign,
  Play,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TresorisPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-24">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/bureau-nuit.png"
              alt="Background"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                <Shield className="w-4 h-4 text-accent-primary" />
                <span className="text-sm text-white/90 font-medium">
                  Agent IA — Production Ready
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                TRESORIS
                <span className="block text-accent-primary mt-2">
                  Votre DAF Virtuel IA
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Anticipez les retards de paiement avec une <span className="text-white font-semibold">précision validée sur datasets PME</span>.
                Détection précoce observée entre 15 et 60 jours selon l'historique et la structure client.
              </p>

              {/* Validation Badges */}
              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-medium">Validé sur l'ensemble de nos scénarios de test</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-medium">Détection 15-60j selon historique</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-medium">0 faux positif sur tests de référence</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="https://calendly.com/zineinsight"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                >
                  Demander une démo personnalisée
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#video-demo"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  <Play className="w-5 h-5" />
                  Voir la démonstration
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problème → Solution */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Le défi de tout dirigeant de PME
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Savoir <span className="text-accent-primary font-semibold">qui va payer en retard</span>, 
                  avant que ça n'impacte votre trésorerie
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 mb-16">
                {/* Problème */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-red-50 rounded-2xl p-8 border-2 border-red-200"
                >
                  <AlertTriangle className="w-12 h-12 text-red-600 mb-6" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Sans TRESORIS
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 mt-1">❌</span>
                      <span>Vous découvrez les retards <strong>après coup</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 mt-1">❌</span>
                      <span>Vous perdez des <strong>jours à relancer</strong> tous les clients</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 mt-1">❌</span>
                      <span>Vous ne savez pas <strong>par où commencer</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 mt-1">❌</span>
                      <span>Tensions de trésorerie <strong>non anticipées</strong></span>
                    </li>
                  </ul>
                </motion.div>

                {/* Solution */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-green-50 rounded-2xl p-8 border-2 border-green-200"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-600 mb-6" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Avec TRESORIS
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✅</span>
                      <span><strong>15 à 60 jours d'avance</strong> selon historique client</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✅</span>
                      <span>Actions <strong>automatiquement priorisées</strong> par impact</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✅</span>
                      <span>Scoring clients <strong>A/B/C/D</strong> en temps réel</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✅</span>
                      <span><strong>Gain de temps substantiel</strong> sur le recouvrement</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Vidéo Démo */}
        <section id="video-demo" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Découvrez TRESORIS en action
                </h2>
                <p className="text-xl text-slate-200 mb-8">
                  Démonstration complète de l'analyse prédictive en moins de 5 minutes
                </p>
                
                {/* Framing AVANT la vidéo */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-left max-w-3xl mx-auto mb-8">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Ce que vous allez voir
                  </h3>
                  <p className="text-slate-200 leading-relaxed">
                    Cette démonstration montre comment TRESORIS analyse une situation PME réelle, 
                    détecte une dérive avant qu'elle n'impacte la trésorerie, et propose des actions priorisées.
                    <br /><br />
                    <span className="text-accent-primary font-medium">
                      TRESORIS n'exécute aucune action et fonctionne toujours comme un copilote décisionnel accompagné.
                    </span>
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-200 bg-slate-900 group cursor-pointer"
              >
                {/* Video Element - Lazy loaded */}
                <video
                  id="demo-video"
                  className="w-full h-full object-cover"
                  controls
                  controlsList="nodownload"
                  preload="none"
                  poster="/images/vue-NY.png"
                >
                  <source
                    src="/video/agentIA-presentation-bpi.mp4"
                    type="video/mp4"
                  />
                  Votre navigateur ne supporte pas la lecture vidéo HTML5.
                </video>

                {/* Loading indicator */}
                <div id="video-loading" className="absolute inset-0 items-center justify-center bg-slate-900/40 backdrop-blur-sm group-hover:bg-slate-900/50 transition-all" style={{ display: 'none' }}>
                  <div className="text-center flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-400 border-t-accent-primary animate-spin mb-4" />
                    <p className="text-white text-sm">Chargement de la vidéo...</p>
                  </div>
                </div>
              </motion.div>

              <p className="text-center text-slate-300 italic mt-6">
                * Présentation réalisée devant la BPI — Chargement à la demande pour meilleure performance
              </p>

              {/* Wording APRÈS la vidéo - Ce que TRESORIS est (et n'est pas) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-left mt-12"
              >
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Ce que TRESORIS est (et n'est pas)
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Ce que TRESORIS EST */}
                  <div>
                    <h4 className="text-lg font-semibold text-accent-primary mb-4">
                      TRESORIS est :
                    </h4>
                    <ul className="space-y-3 text-slate-200">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>un moteur d'analyse décisionnelle de trésorerie,</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>déployé et paramétré avec vous,</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>utilisé en accompagnement DAF / dirigeant,</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>conçu pour anticiper les tensions, pas pour automatiser aveuglément.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Ce que TRESORIS N'EST PAS */}
                  <div>
                    <h4 className="text-lg font-semibold text-red-400 mb-4">
                      TRESORIS n'est pas :
                    </h4>
                    <ul className="space-y-3 text-slate-200">
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span>un SaaS en libre-service,</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span>un outil de paiement ou de blocage,</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span>un système infaillible,</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span>un remplacement du jugement humain.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              <script dangerouslySetInnerHTML={{__html: `
                (function() {
                  const video = document.getElementById('demo-video');
                  const loading = document.getElementById('video-loading');
                  
                  if (video) {
                    video.addEventListener('play', function() {
                      if (loading) loading.style.display = 'none';
                    });
                    
                    video.addEventListener('playing', function() {
                      if (loading) loading.style.display = 'none';
                    });
                    
                    video.addEventListener('waiting', function() {
                      if (loading) loading.style.display = 'flex';
                    });
                  }
                })();
              `}} />
            </div>
          </div>
        </section>

        {/* 3 Features Principales */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  3 capacités uniques
                </h2>
                <p className="text-xl text-slate-600">
                  L'intelligence artificielle au service de votre trésorerie
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Scoring Clients A/B/C/D
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Chaque client analysé et classé automatiquement selon sa fiabilité de paiement. 
                    Score 0-100 avec facteurs de risque détaillés.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>A : Excellent (score &lt;35)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>B : Bon (score 35-47)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-600" />
                      <span>C : Surveillé (score 47-73)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-600" />
                      <span>D : À risque (score ≥73)</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Feature 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-6">
                    <AlertTriangle className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Alertes Précoces
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Détection des signaux faibles 15 à 60 jours avant le problème. 
                    4 types d'alertes avec probabilité et impact sur votre runway.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>Dégradation progressive délais</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>Augmentation fréquence retards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>Risque concentration client</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>Périodes saisonnières à risque</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Feature 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-6">
                    <TrendingUp className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Actions Prioritaires
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Algorithme de priorisation automatique basé sur l'impact cash (×0.7) 
                    et la facilité d'exécution (×0.3).
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>P0 : Urgent (score &gt;80)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>P1 : Important (score 60-80)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Quick wins identifiés</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Temps requis + deadline</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 Engines IA - Architecture technique */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-6">
                  <span className="text-sm text-slate-600 font-medium">Architecture technique</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  6 moteurs d'analyse spécialisés
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Chaque moteur est conçu pour une fonction précise. Ensemble, ils forment un système 
                  d'analyse financière complet et cohérent.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Engine 1 - Payment Patterns */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                >
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
                        <LineChart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Engine 01</div>
                        <h3 className="text-lg font-bold text-slate-900">Payment Patterns</h3>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Analyse l'historique de paiement de chaque client pour identifier les comportements 
                      récurrents et les dérives progressives.
                    </p>
                  </div>
                  <div className="p-6 bg-slate-50">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Métriques calculées</div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Délai moyen, médian, écart-type</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Taux de paiement à temps vs retard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Tendance : stable, amélioration, dégradation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Score de fiabilité 0-100</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>

                {/* Engine 2 - Client Scoring */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                >
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Engine 02</div>
                        <h3 className="text-lg font-bold text-slate-900">Client Scoring</h3>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Attribue un score de risque pondéré à chaque client, combinant comportement historique, 
                      tendance et exposition financière.
                    </p>
                  </div>
                  <div className="p-6 bg-slate-50">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Formule de scoring</div>
                    <div className="bg-white rounded-lg border border-slate-200 p-3 mb-3">
                      <code className="text-xs text-slate-700 font-mono block break-words">
                        score = behavior × 0.4 + trend × 0.3 + stability × 0.2 + amount × 0.1
                      </code>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Rating A/B/C/D avec seuils calibrés</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Explication textuelle pour le DAF</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>

                {/* Engine 3 - Smart Forecast */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                >
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Engine 03</div>
                        <h3 className="text-lg font-bold text-slate-900">Smart Forecast</h3>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Prédit la date probable de paiement de chaque facture en attente, avec intervalles 
                      de confiance et probabilités.
                    </p>
                  </div>
                  <div className="p-6 bg-slate-50">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Sorties du modèle</div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Date de paiement attendue</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Intervalle de confiance (min/max)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Probabilité de paiement à la date prévue</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Impact sur le runway de trésorerie</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>

                {/* Engine 4 - Early Warning */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                >
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Engine 04</div>
                        <h3 className="text-lg font-bold text-slate-900">Early Warning</h3>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Détecte les signaux faibles annonciateurs de problèmes, 15 à 60 jours avant leur 
                      impact réel sur la trésorerie.
                    </p>
                  </div>
                  <div className="p-6 bg-slate-50">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Types de signaux détectés</div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Dégradation progressive des délais</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Paiements partiels répétés</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Concentration du risque client</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Périodes saisonnières à risque</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>

                {/* Engine 5 - Action Optimizer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                >
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Engine 05</div>
                        <h3 className="text-lg font-bold text-slate-900">Action Optimizer</h3>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Priorise les actions recommandées selon leur impact potentiel et leur facilité 
                      d'exécution, pour maximiser l'efficacité.
                    </p>
                  </div>
                  <div className="p-6 bg-slate-50">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Algorithme de priorisation</div>
                    <div className="bg-white rounded-lg border border-slate-200 p-3 mb-3">
                      <code className="text-xs text-slate-700 font-mono block">
                        priority = impact × 0.7 + ease × 0.3
                      </code>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Maximum 3 actions par analyse</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Identification des quick wins</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>

                {/* Engine 6 - Seasonality */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                >
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Engine 06</div>
                        <h3 className="text-lg font-bold text-slate-900">Seasonality</h3>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Ajuste les prévisions et les alertes en fonction des variations saisonnières 
                      connues du comportement de paiement.
                    </p>
                  </div>
                  <div className="p-6 bg-slate-50">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Facteurs saisonniers</div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Août : +30% de retards attendus</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Décembre : +15% (clôtures)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Avril : +10% (période fiscale)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                        <span>Calibrage possible par secteur</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/bureau-nuit.png"
              alt="Background"
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Simple et rapide
                </h2>
                <p className="text-xl text-slate-200">
                  De vos données à vos insights en 3 étapes
                </p>
              </motion.div>

              <div className="space-y-8">
                {/* Étape 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-primary text-white font-bold text-xl flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Connectez vos données
                    </h3>
                    <p className="text-slate-200 leading-relaxed">
                      Import Excel/CSV de vos factures ou connexion directe à votre comptabilité 
                      (Pennylane, Quickbooks, Sage). Minimum 8-10 factures payées par client pour une analyse fiable.
                    </p>
                  </div>
                </motion.div>

                {/* Étape 2 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-primary text-white font-bold text-xl flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      L'IA analyse en moins d'1 minute
                    </h3>
                    <p className="text-slate-200 leading-relaxed">
                      6 engines spécialisés travaillent en parallèle : analyse patterns, scoring risque, 
                      détection signaux faibles, prévisions paiement, priorisation actions, ajustements saisonniers.
                    </p>
                  </div>
                </motion.div>

                {/* Étape 3 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-primary text-white font-bold text-xl flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Agissez sur vos priorités
                    </h3>
                    <p className="text-slate-200 leading-relaxed">
                      Dashboard en temps réel avec scores clients, alertes urgentes, actions recommandées. 
                      Export PDF, notifications email/Slack, API REST pour intégration dans vos outils.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Validation & Crédibilité */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Validation terrain
                </h2>
                <p className="text-xl text-slate-600">
                  Testé et validé par des CFO et dirigeants de PME
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Métriques */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-slate-50 rounded-2xl p-8"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    Métriques de Performance
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-700">Précision détection</span>
                        <span className="text-green-600 font-bold">Validée</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Sur l'ensemble de nos scénarios PME avec seuils conservateurs
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-700">Détection précoce</span>
                        <span className="text-green-600 font-bold">Validée</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Détection entre 15 et 60 jours selon historique et structure client
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-700">Faux positifs observés</span>
                        <span className="text-green-600 font-bold">0%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Aucun faux positif sur scénarios de référence avec seuils calibrés
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-700">Pertinence actions</span>
                        <span className="text-green-600 font-bold">Validée</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Sur l'ensemble de nos tests avec priorisation impact×facilité
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-4 italic">
                    * Résultats sur nos scénarios de test PME (84 factures, 7 clients).
                    Les performances réelles peuvent varier selon la qualité des données et la complexité de votre structure.
                  </p>
                </motion.div>

                {/* Tests */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-50 rounded-2xl p-8"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    Testé par
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-accent-primary" />
                      <span className="text-slate-700">CFO de PME</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-accent-primary" />
                      <span className="text-slate-700">Dirigeants de PME</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-accent-primary" />
                      <span className="text-slate-700">BPI France (présentation validée)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-accent-primary" />
                      <span className="text-slate-700">Experts comptables partenaires</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Tech Stack */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white"
              >
                <h3 className="text-xl font-bold mb-6">Architecture Technique</h3>
                <div className="grid sm:grid-cols-3 gap-6 text-sm">
                  <div>
                    <div className="text-accent-primary font-semibold mb-2">6 Engines IA</div>
                    <ul className="space-y-1 text-slate-300">
                      <li>• Payment Patterns</li>
                      <li>• Client Scoring</li>
                      <li>• Smart Forecast</li>
                      <li>• Early Warning</li>
                      <li>• Action Optimizer</li>
                      <li>• Seasonality</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-accent-primary font-semibold mb-2">Stack Tech</div>
                    <ul className="space-y-1 text-slate-300">
                      <li>• Python 3.10+</li>
                      <li>• pandas & numpy</li>
                      <li>• scikit-learn</li>
                      <li>• PostgreSQL</li>
                      <li>• FastAPI</li>
                      <li>• Docker</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-accent-primary font-semibold mb-2">Sécurité</div>
                    <ul className="space-y-1 text-slate-300">
                      <li>• RGPD Compliant</li>
                      <li>• Données en France</li>
                      <li>• Chiffrement AES-256</li>
                      <li>• Backups quotidiens</li>
                      <li>• SSL/TLS</li>
                      <li>• Audit logs</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section Workflow de l'agent */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-6">
                  <span className="text-sm text-slate-600 font-medium">Fonctionnement</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Comment l'agent analyse et décide
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Un cycle complet en 6 étapes, de l'ingestion des données jusqu'à 
                  la validation humaine et l'apprentissage continu.
                </p>
              </motion.div>

              {/* Timeline verticale */}
              <div className="relative">
                {/* Ligne verticale */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200 hidden md:block"></div>

                <div className="space-y-8">
                  {/* Étape 1 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative flex gap-6"
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center z-10">
                      01
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Ingestion des données</h3>
                      <p className="text-slate-600 mb-4">
                        Import des factures clients depuis votre logiciel comptable ou fichier CSV. 
                        Colonnes attendues : identifiant client, date d'échéance, date de paiement, montant, statut.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-slate-600 border border-slate-200">CSV / Excel</span>
                        <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-slate-600 border border-slate-200">Pennylane API</span>
                        <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-slate-600 border border-slate-200">Quickbooks</span>
                        <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-slate-600 border border-slate-200">Sage</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Étape 2 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="relative flex gap-6"
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center z-10">
                      02
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Analyse parallèle</h3>
                      <p className="text-slate-600 mb-4">
                        Les 6 moteurs s'exécutent simultanément sur l'ensemble du portefeuille. 
                        Temps de traitement inférieur à 60 secondes pour 100 factures.
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-white rounded-lg p-2 border border-slate-200 text-center text-slate-600">Payment Patterns</div>
                        <div className="bg-white rounded-lg p-2 border border-slate-200 text-center text-slate-600">Client Scoring</div>
                        <div className="bg-white rounded-lg p-2 border border-slate-200 text-center text-slate-600">Smart Forecast</div>
                        <div className="bg-white rounded-lg p-2 border border-slate-200 text-center text-slate-600">Early Warning</div>
                        <div className="bg-white rounded-lg p-2 border border-slate-200 text-center text-slate-600">Action Optimizer</div>
                        <div className="bg-white rounded-lg p-2 border border-slate-200 text-center text-slate-600">Seasonality</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Étape 3 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative flex gap-6"
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center z-10">
                      03
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Requalification des risques</h3>
                      <p className="text-slate-600 mb-4">
                        Chaque encaissement attendu est classé selon sa probabilité de réalisation.
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white rounded-lg p-3 border border-slate-200">
                          <div className="text-sm font-semibold text-slate-900 mb-1">CERTAIN</div>
                          <div className="text-xs text-slate-500">Score &gt; 85</div>
                          <div className="text-xs text-slate-500">Encaissement très probable</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-slate-200">
                          <div className="text-sm font-semibold text-slate-900 mb-1">INCERTAIN</div>
                          <div className="text-xs text-slate-500">Score 60-85</div>
                          <div className="text-xs text-slate-500">Doute raisonnable</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-slate-200">
                          <div className="text-sm font-semibold text-slate-900 mb-1">CRITIQUE</div>
                          <div className="text-xs text-slate-500">Score &lt; 60</div>
                          <div className="text-xs text-slate-500">Action requise</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Étape 4 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="relative flex gap-6"
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center z-10">
                      04
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Proposition d'actions</h3>
                      <p className="text-slate-600 mb-4">
                        L'agent génère maximum 3 actions prioritaires, chacune liée à un risque identifié. 
                        Chaque action inclut sa justification et son impact estimé.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-slate-200">
                          <span className="px-2 py-1 bg-slate-900 text-white text-xs font-bold rounded">P1</span>
                          <span className="text-sm text-slate-700">Action immédiate — Impact élevé</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-slate-200">
                          <span className="px-2 py-1 bg-slate-700 text-white text-xs font-bold rounded">P2</span>
                          <span className="text-sm text-slate-700">Action cette semaine — Impact modéré</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-slate-200">
                          <span className="px-2 py-1 bg-slate-500 text-white text-xs font-bold rounded">P3</span>
                          <span className="text-sm text-slate-700">Action sous 2 semaines — Prévention</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Étape 5 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="relative flex gap-6"
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center z-10">
                      05
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Validation humaine</h3>
                      <p className="text-slate-600 mb-4">
                        L'agent attend systématiquement la validation du DAF ou du dirigeant avant toute considération d'action. 
                        Aucune décision n'est exécutée automatiquement.
                      </p>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-slate-600" />
                          <span className="text-sm text-slate-700">Approuver</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
                          <AlertTriangle className="w-4 h-4 text-slate-600" />
                          <span className="text-sm text-slate-700">Rejeter</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
                          <Clock className="w-4 h-4 text-slate-600" />
                          <span className="text-sm text-slate-700">Reporter</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Étape 6 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="relative flex gap-6"
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center z-10">
                      06
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Apprentissage continu</h3>
                      <p className="text-slate-600">
                        4 semaines après chaque analyse, le système compare ses prédictions aux résultats réels. 
                        Ce feedback permet d'affiner les modèles et d'améliorer la précision au fil du temps.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Audit Trail & Gouvernance */}
        <section className="py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-6">
                  <span className="text-sm text-slate-600 font-medium">Traçabilité et conformité</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Audit trail complet
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Chaque analyse, chaque décision, chaque résultat est enregistré. 
                  Pour la gouvernance, la conformité et l'amélioration continue.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Colonne gauche - Ce qui est tracé */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">Ce qui est enregistré</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">Analyses</div>
                        <div className="text-sm text-slate-600">Risques détectés, scores calculés, alertes générées</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">Décisions DAF</div>
                        <div className="text-sm text-slate-600">Actions approuvées, rejetées, commentaires</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">Résultats réels</div>
                        <div className="text-sm text-slate-600">Paiements effectifs vs prédictions, écarts observés</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">Horodatage complet</div>
                        <div className="text-sm text-slate-600">Date et heure de chaque événement, durée des analyses</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Colonne droite - Exemple de trace */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">Exemple de trace</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4 font-mono text-xs">
                      {/* Trace 1 */}
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-500">29/01/2026 09:15:22</span>
                          <span className="px-2 py-0.5 bg-slate-200 rounded text-slate-600">ANALYSIS</span>
                        </div>
                        <div className="text-slate-700">
                          5 risques détectés sur 7 clients<br />
                          Montant exposé : 280 000 EUR<br />
                          3 actions proposées
                        </div>
                      </div>
                      {/* Trace 2 */}
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-500">29/01/2026 10:42:08</span>
                          <span className="px-2 py-0.5 bg-slate-200 rounded text-slate-600">DECISION</span>
                        </div>
                        <div className="text-slate-700">
                          Action P1 approuvée par M. Dupont<br />
                          Action P2 approuvée<br />
                          Action P3 rejetée : &quot;Non prioritaire&quot;
                        </div>
                      </div>
                      {/* Trace 3 */}
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-500">26/02/2026 09:00:00</span>
                          <span className="px-2 py-0.5 bg-slate-200 rounded text-slate-600">OUTCOME</span>
                        </div>
                        <div className="text-slate-700">
                          Client CLI_005 : paiement reçu J-5<br />
                          Prédiction validée, scoring renforcé<br />
                          Gain trésorerie : +50 000 EUR
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bénéfices */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid sm:grid-cols-3 gap-6"
              >
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-slate-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Conformité</h4>
                  <p className="text-sm text-slate-600">
                    Piste d'audit complète pour les commissaires aux comptes et auditeurs
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-slate-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Amélioration</h4>
                  <p className="text-sm text-slate-600">
                    Comparaison prédictions vs réalité pour affiner les modèles
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-6 h-6 text-slate-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">ROI mesurable</h4>
                  <p className="text-sm text-slate-600">
                    Quantification précise des gains de trésorerie générés
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/bureau-nuit.png"
              alt="Background"
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Investissement
                </h2>
                <p className="text-xl text-slate-200">
                  Solution clé en main pour piloter votre trésorerie
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-white relative overflow-hidden"
              >
                {/* Badge */}
                <div className="absolute top-8 right-8">
                  <div className="px-4 py-2 bg-accent-primary rounded-full text-sm font-semibold">
                    Offre Lancement
                  </div>
                </div>

                <div className="max-w-5xl mx-auto text-center">
                  <h3 className="text-3xl font-bold mb-4">
                    TRESORIS Entreprise
                  </h3>
                  <p className="text-slate-300 mb-8 text-lg">
                    Déploiement accompagné, paramétrage personnalisé, formation équipe
                  </p>

                  <div className="mb-8">
                    <div className="text-6xl font-bold mb-2">
                      15 000 €
                    </div>
                    <div className="text-slate-400 text-lg">
                      Installation complète
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-8 mb-8 text-left">
                    <div className="font-semibold mb-4 text-lg">Ce qui est inclus :</div>
                    <ul className="grid md:grid-cols-2 gap-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent-primary flex-shrink-0" />
                        <span>Déploiement accompagné (environnement Docker sécurisé)</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent-primary flex-shrink-0" />
                        <span>Connexion à votre logiciel comptable</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent-primary flex-shrink-0" />
                        <span>Formation de vos équipes (2 sessions)</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent-primary flex-shrink-0" />
                        <span>Paramétrage des seuils selon votre secteur</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent-primary flex-shrink-0" />
                        <span>Dashboard personnalisé avec votre branding</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent-primary flex-shrink-0" />
                        <span>Support prioritaire 6 mois inclus</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent-primary flex-shrink-0" />
                        <span>Mises à jour et améliorations continues</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent-primary flex-shrink-0" />
                        <span>API REST pour intégration à vos outils</span>
                      </li>
                    </ul>
                    <p className="text-sm text-slate-300 mt-6 border-t border-white/10 pt-4">
                      Livraison d'un environnement Docker Compose prêt à l'emploi, paramétré selon votre structure, 
                      accompagné à l'installation et à la prise en main.
                    </p>
                  </div>

                  <Link
                    href="https://calendly.com/zineinsight"
                    className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-accent-primary text-white font-bold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25 text-lg"
                  >
                    Réserver un diagnostic gratuit
                    <Calendar className="w-5 h-5" />
                  </Link>

                  <p className="text-slate-400 text-sm mt-6">
                    Diagnostic personnalisé de 30min pour évaluer votre besoin
                  </p>
                </div>
              </motion.div>

              {/* Garanties */}
              <div className="grid sm:grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="font-semibold text-white mb-1">Satisfaction garantie</div>
                  <div className="text-sm text-slate-300">30 jours pour tester</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="font-semibold text-white mb-1">Livraison rapide</div>
                  <div className="text-sm text-slate-300">Généralement sous 7 jours</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="font-semibold text-white mb-1">Accompagnement</div>
                  <div className="text-sm text-slate-300">Support dédié inclus</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Questions fréquentes
                </h2>
              </motion.div>

              <div className="space-y-6">
                {/* Q1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-slate-50 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    Combien de données historiques minimum ?
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Pour une analyse fiable, nous recommandons au moins <strong>8-10 factures payées par client</strong>. 
                    Plus vous avez d'historique (6-12 mois idéalement), plus les prévisions seront précises. 
                    Les résultats peuvent varier selon la qualité et la régularité de vos données.
                  </p>
                </motion.div>

                {/* Q2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-50 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    Mes données sont-elles sécurisées ?
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Oui, absolument. Hébergement en France, chiffrement AES-256, conformité RGPD complète. 
                    Vos données ne sont jamais partagées avec des tiers et vous pouvez les supprimer à tout moment.
                  </p>
                </motion.div>

                {/* Q3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-50 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    Compatible avec mon logiciel comptable ?
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    TRESORIS se connecte à Pennylane, Quickbooks, Sage, Cegid, et accepte aussi les imports Excel/CSV. 
                    Si votre logiciel n'est pas listé, nous pouvons développer un connecteur sur mesure.
                  </p>
                </motion.div>

                {/* Q4 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-50 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    Combien de temps pour voir les premiers résultats ?
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Déploiement accompagné généralement en <strong>7 jours ouvrés</strong>. Vous aurez vos premiers insights 
                    dès la connexion de vos données. Les alertes précoces apparaissent après 2-3 semaines d'utilisation, 
                    le temps que le système accumule suffisamment d'historique pour détecter les patterns.
                  </p>
                </motion.div>

                {/* Q5 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-slate-50 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    Que se passe-t-il après les 6 mois de support inclus ?
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Vous pouvez souscrire à un contrat de maintenance annuel (1500€/an) incluant support, mises à jour, 
                    et évolutions. Ou utiliser TRESORIS en autonomie totale.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/vue-NY.png"
              alt="Background"
              fill
              className="object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Prêt à anticiper vos encaissements ?
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                Commencez par un diagnostic gratuit de 30 minutes pour évaluer 
                l'impact potentiel de TRESORIS sur votre trésorerie.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="https://calendly.com/zineinsight"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                >
                  <Calendar className="w-5 h-5" />
                  Réserver mon diagnostic gratuit
                </Link>
                <Link
                  href="/agents"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Découvrir les autres agents
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <p className="text-slate-400 text-sm mt-8">
                ✓ Sans engagement &nbsp;•&nbsp; ✓ Diagnostic personnalisé &nbsp;•&nbsp; ✓ Réponse sous 24h
              </p>
            </motion.div>
          </div>
        </section>

        {/* Integration Section - Lien vers /agents */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                  TRESORIS fonctionne mieux avec les autres agents
                </h2>
                <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                  Découvrez comment combiner TRESORIS avec MARGIS (marges réelles) et SCENARIS (scénarios cash) 
                  pour une vision complète de votre finance.
                </p>
                <Link
                  href="/agents#tresoris"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                >
                  Voir les intégrations
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
