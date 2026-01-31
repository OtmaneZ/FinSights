"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Target,
  PieChart,
  Sparkles,
  Calculator,
  LineChart,
  DollarSign,
  Clock,
  Percent,
  Wallet,
  Users,
  Activity,
  Layers,
  GitBranch,
  Brain,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DashisPage() {
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/20 backdrop-blur-sm border border-accent-primary/30 mb-8">
                <BarChart3 className="w-4 h-4 text-accent-primary" />
                <span className="text-sm text-white/90 font-medium">
                  Agent IA — Vision 360°
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                DASHIS
                <span className="block text-accent-primary mt-2">
                  Dashboard Intelligence System
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Obtenez une <span className="text-white font-semibold">vue 360° de votre santé financière</span> en 30 secondes.
                5 KPIs essentiels, détection d&apos;anomalies ML, prédictions IA et Score FinSight™.
              </p>

              {/* Validation Badges */}
              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-medium">5 KPIs en temps réel</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-medium">4 moteurs AI/ML intégrés</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                  <Target className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-medium">Score FinSight™ 0-100</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/demo-dashis"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                >
                  Tester DASHIS gratuitement
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="https://calendly.com/zineinsight"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Demander une démo personnalisée
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problème / Solution */}
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
                  Avoir une <span className="text-accent-primary font-semibold">vision claire et instantanée</span> de la santé financière de son entreprise
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
                    Sans DASHIS
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 mt-1">❌</span>
                      <span>Vous passez des <strong>heures sur Excel</strong> à consolider vos chiffres</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 mt-1">❌</span>
                      <span>Vous n&apos;avez <strong>pas de vue d&apos;ensemble</strong> en temps réel</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 mt-1">❌</span>
                      <span>Les <strong>anomalies passent inaperçues</strong> jusqu&apos;à l&apos;impact</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 mt-1">❌</span>
                      <span>Impossible de <strong>simuler des scénarios</strong> rapidement</span>
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
                    Avec DASHIS
                  </h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✅</span>
                      <span><strong>30 secondes</strong> pour un diagnostic complet</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✅</span>
                      <span><strong>5 KPIs essentiels</strong> calculés automatiquement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✅</span>
                      <span><strong>Détection ML</strong> des transactions anormales</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 mt-1">✅</span>
                      <span><strong>Score FinSight™</strong> pour benchmarker votre santé</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Les 5 KPIs */}
        <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  5 KPIs essentiels en temps réel
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Les indicateurs fondamentaux pour piloter votre entreprise
                </p>
              </motion.div>

              <div className="grid md:grid-cols-5 gap-6">
                {/* KPI 1: CA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Chiffre d&apos;Affaires</h3>
                  <p className="text-slate-400 text-sm">Total des revenus avec évolution période précédente</p>
                </motion.div>

                {/* KPI 2: Charges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Charges</h3>
                  <p className="text-slate-400 text-sm">Total des dépenses ventilées par catégorie</p>
                </motion.div>

                {/* KPI 3: Marge Nette */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Percent className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Marge Nette</h3>
                  <p className="text-slate-400 text-sm">Rentabilité nette avec seuil de santé</p>
                </motion.div>

                {/* KPI 4: Cash Flow */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Cash Flow</h3>
                  <p className="text-slate-400 text-sm">Flux de trésorerie net positif/négatif</p>
                </motion.div>

                {/* KPI 5: DSO */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">DSO</h3>
                  <p className="text-slate-400 text-sm">Délai moyen de paiement clients en jours</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Moteurs AI/ML */}
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
                  4 moteurs d&apos;intelligence artificielle
                </h2>
                <p className="text-xl text-slate-600">
                  L&apos;IA au service de votre compréhension financière
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Moteur 1: Anomaly Detection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center mb-6">
                    <AlertTriangle className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Détection d&apos;Anomalies ML
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Algorithme de Machine Learning qui analyse chaque transaction et identifie 
                    les valeurs aberrantes. Détection automatique des patterns suspects.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Z-Score statistique configurable</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Classification par type (achat, vente, salaire)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Alerte visuelle avec explication</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Moteur 2: Cash Flow Predictions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                    <LineChart className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Prédictions Cash-Flow GPT-4
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Intelligence artificielle GPT-4 qui analyse vos données historiques 
                    et génère des prédictions de trésorerie sur 3 à 6 mois.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Forecasting 3-6 mois</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Alertes prédictives de tensions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Confiance niveau par prédiction</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Moteur 3: Advanced Patterns */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
                    <Activity className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Patterns Avancés IA
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Détection des comportements clients, saisonnalité des revenus, 
                    tendances cachées dans vos données financières.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Analyse comportements clients</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Détection saisonnalité</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Tendances cachées identifiées</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Moteur 4: FinSight Score */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Score FinSight™
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Note de santé financière de 0 à 100, calculée à partir de vos KPIs 
                    et comparée aux benchmarks sectoriels (Xerfi, Banque de France).
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Score 0-100 instantané</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Benchmark sectoriel automatique</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Recommandations personnalisées</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 8 Visualisations */}
        <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  8 visualisations interactives
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Des graphiques professionnels pour comprendre vos données en un coup d&apos;œil
                </p>
              </motion.div>

              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { icon: LineChart, name: "Évolution Cash-Flow", desc: "Courbe temporelle" },
                  { icon: PieChart, name: "Répartition Charges", desc: "Camembert catégories" },
                  { icon: TrendingUp, name: "Évolution Marge", desc: "Tendance mensuelle" },
                  { icon: Users, name: "Top Clients", desc: "Classement revenus" },
                  { icon: GitBranch, name: "Flux Sankey", desc: "Revenus → Dépenses" },
                  { icon: Layers, name: "Sunburst Dépenses", desc: "Hiérarchie catégories" },
                  { icon: Clock, name: "Factures en Attente", desc: "Encours par ancienneté" },
                  { icon: Zap, name: "Statuts Paiement", desc: "Payé/En attente/Retard" },
                ].map((chart, index) => (
                  <motion.div
                    key={chart.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 text-center"
                  >
                    <chart.icon className="w-8 h-8 text-accent-primary mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-1">{chart.name}</h3>
                    <p className="text-slate-400 text-xs">{chart.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Simulations What-If */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 mb-6">
                    <Calculator className="w-4 h-4 text-accent-primary" />
                    <span className="text-sm text-accent-primary font-medium">Simulation Engine</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                    Simulations What-If
                  </h2>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    Testez l&apos;impact de vos décisions avant de les prendre.
                    Visualisez instantanément comment vos KPIs évoluent selon différents scénarios.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Wallet className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Réduction des charges</h4>
                        <p className="text-slate-600 text-sm">Simulez l&apos;impact d&apos;une réduction de X% sur votre marge</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Accélération des paiements</h4>
                        <p className="text-slate-600 text-sm">Visualisez le cash libéré en réduisant les délais de paiement</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Augmentation des prix</h4>
                        <p className="text-slate-600 text-sm">Mesurez l&apos;impact sur le chiffre d&apos;affaires et la marge</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Illustration */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-50 rounded-2xl p-8 border border-slate-200"
                >
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <span className="text-sm text-slate-500 font-medium">Exemple de simulation</span>
                    </div>
                    
                    {/* Slider example */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Réduction charges</span>
                        <span className="font-bold text-accent-primary">-10%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-accent-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>

                    {/* Impact */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                      <div className="text-center p-4 bg-white rounded-xl">
                        <p className="text-2xl font-bold text-green-600">+4.2%</p>
                        <p className="text-slate-500 text-xs">Marge nette</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl">
                        <p className="text-2xl font-bold text-green-600">+127K€</p>
                        <p className="text-slate-500 text-xs">Cash flow annuel</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Technique */}
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
                  Architecture technique
                </h2>
                <p className="text-xl text-slate-600">
                  Un agent IA autonome et modulaire
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg"
              >
                <div className="space-y-6">
                  {/* Engines */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-accent-primary" />
                      4 Engines Backend
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl text-center">
                        <p className="font-semibold text-slate-900">DataProcessor</p>
                        <p className="text-xs text-slate-500">Validation & enrichissement</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl text-center">
                        <p className="font-semibold text-slate-900">KPIEngine</p>
                        <p className="text-xs text-slate-500">Calculs financiers</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl text-center">
                        <p className="font-semibold text-slate-900">SimulationEngine</p>
                        <p className="text-xs text-slate-500">Scénarios What-If</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl text-center">
                        <p className="font-semibold text-slate-900">AnalysisOrchestrator</p>
                        <p className="text-xs text-slate-500">Orchestration AI/ML</p>
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-accent-primary" />
                      Stack Technologique
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {[
                        "Next.js 14",
                        "TypeScript",
                        "React",
                        "TensorFlow.js",
                        "GPT-4",
                        "Recharts",
                        "D3.js",
                        "Tailwind CSS"
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Prêt à avoir une vision 360° de vos finances ?
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Testez DASHIS gratuitement avec vos propres données comptables.
                Diagnostic complet en 30 secondes, sans engagement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/demo-dashis"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                >
                  <Sparkles className="w-5 h-5" />
                  Tester DASHIS maintenant
                </Link>
                <Link
                  href="https://calendly.com/zineinsight"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Demander une démo
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
