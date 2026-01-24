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
                Détection précoce en moyenne 15-60 jours à l'avance. Actions prioritaires automatiques.
              </p>

              {/* Validation Badges */}
              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-medium">100% validé sur nos tests PME</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-medium">Détection 15-60j d'avance</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-medium">Aucun faux positif observé</span>
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
                      <span><strong>15 à 60 jours d'avance</strong> sur les retards probables</span>
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
                      <span><strong>Jusqu'à 15h/mois économisées</strong> sur le recouvrement</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Vidéo Démo */}
        <section id="video-demo" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Découvrez TRESORIS en action
                </h2>
                <p className="text-xl text-slate-600">
                  Démonstration complète de l'analyse prédictive en moins de 3 minutes
                </p>
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

              <p className="text-center text-slate-500 italic mt-6">
                * Présentation réalisée devant la BPI — Chargement à la demande pour meilleure performance
              </p>

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

        {/* Comment ça marche */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Simple et rapide
                </h2>
                <p className="text-xl text-slate-600">
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
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Connectez vos données
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
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
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      L'IA analyse en moins d'1 seconde
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
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
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Agissez sur vos priorités
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
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
                        <span className="text-green-600 font-bold">100%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-700">Détection précoce</span>
                        <span className="text-green-600 font-bold">100%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-700">Faux positifs observés</span>
                        <span className="text-green-600 font-bold">0%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-700">Pertinence actions</span>
                        <span className="text-green-600 font-bold">100%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-4 italic">
                    * Résultats sur nos scénarios de test PME (84 factures, 7 clients)
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

        {/* Pricing */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Investissement
                </h2>
                <p className="text-xl text-slate-600">
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

                <div className="max-w-2xl mx-auto text-center">
                  <h3 className="text-3xl font-bold mb-4">
                    TRESORIS Entreprise
                  </h3>
                  <p className="text-slate-300 mb-8 text-lg">
                    Installation complète, paramétrage personnalisé, formation équipe
                  </p>

                  <div className="mb-8">
                    <div className="text-6xl font-bold mb-2">
                      15 000 €
                    </div>
                    <div className="text-slate-400 text-lg">
                      Clé en main
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-8 mb-8 text-left">
                    <div className="font-semibold mb-4 text-lg">Ce qui est inclus :</div>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent-primary flex-shrink-0" />
                        <span>Installation et configuration complète</span>
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
                  <div className="font-semibold text-slate-900 mb-1">Satisfaction garantie</div>
                  <div className="text-sm text-slate-600">30 jours pour tester</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="font-semibold text-slate-900 mb-1">Livraison rapide</div>
                  <div className="text-sm text-slate-600">Généralement sous 7 jours</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="font-semibold text-slate-900 mb-1">Accompagnement</div>
                  <div className="text-sm text-slate-600">Support dédié inclus</div>
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
                    Installation complète généralement en <strong>7 jours ouvrés</strong>. Vous aurez vos premiers insights 
                    dès la connexion de vos données. Les alertes précoces apparaissent après 2-3 semaines d'utilisation, 
                    selon la complexité de votre infrastructure.
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
