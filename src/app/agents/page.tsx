"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Target,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Layers,
  Eye,
  Calculator,
  GitBranch,
  LineChart,
  PieChart,
  Users,
  Banknote,
  Calendar,
  ArrowUpRight,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Comment les agents IA FinSight accèdent-ils à mes données financières ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nos agents (DASHIS, TRESORIS...) se connectent de manière sécurisée à vos outils existants : logiciels comptables, CRM et comptes bancaires via API. L'intégration est conçue pour être non-intrusive et respecte les plus hauts standards de sécurité RGPD."
      }
    },
    {
      "@type": "Question",
      "name": "Quelle est la différence entre un dashboard classique et l'agent DASHIS ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Un dashboard classique affiche le passé. DASHIS utilise l'IA (GPT-4 et Machine Learning) pour interpréter les chiffres en 30 secondes, détecter des anomalies de gestion et prédire votre cash-flow futur de manière autonome."
      }
    },
    {
      "@type": "Question",
      "name": "Quel est le délai de déploiement pour le Pack 4 Agents ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Le déploiement complet est une offre clé en main. Entre la configuration personnalisée sur vos données, l'intégration technique et la formation de votre équipe (DAF, CEO), vous êtes opérationnel en seulement 2 semaines."
      }
    },
    {
      "@type": "Question",
      "name": "Les agents IA remplacent-ils un DAF ou un expert-comptable ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Non, ils les augmentent. Les agents automatisent les tâches d'analyse chronophages (24h/24) pour permettre au DAF de se concentrer sur la prise de décision stratégique et le pilotage de la performance."
      }
    }
  ]
}

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <StructuredData data={faqSchema} />
      <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-24">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/vue-NY.png"
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
              <Zap className="w-4 h-4 text-accent-primary" />
              <span className="text-sm text-white/90 font-medium">
                Intelligence Artificielle pour la Finance
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              4 Agents IA
              <span className="block text-accent-primary mt-2">
                pour piloter votre PME
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Des assistants autonomes qui analysent vos finances, surveillent votre trésorerie, 
              et simulent vos décisions stratégiques. 24h/24, sans intervention humaine.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">26+</div>
                <div className="text-sm text-slate-400">Situations surveillées</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-slate-400">Surveillance continue</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">4</div>
                <div className="text-sm text-slate-400">Agents spécialisés</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://calendly.com/zineinsight"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
              >
                Demander une démo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#agents-overview"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Découvrir les agents
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Agents Overview Section */}
      <section id="agents-overview" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Quatre agents, une vision complète
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Chaque agent est autonome et hyper-spécialisé. Ensemble, ils offrent 
              une vision 360° de la santé financière de votre entreprise.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* DASHIS Card - NOUVEAU */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="group relative bg-gradient-to-br from-accent-primary/5 to-accent-primary/10 rounded-2xl p-8 border-2 border-accent-primary/30 hover:border-accent-primary hover:shadow-xl transition-all duration-300"
            >
              {/* Badge Bientôt */}
              <div className="absolute -top-3 left-6">
                <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-full shadow">
                  🚧 BIENTÔT
                </span>
              </div>
              
              <div className="w-14 h-14 rounded-xl bg-accent-primary flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">DASHIS</h3>
              <p className="text-accent-primary text-sm font-medium mb-4">Agent Dashboard IA 360°</p>
              <p className="text-slate-600 mb-6 text-sm">
                Analyse complète en 30s : 5 KPIs, ML anomalies, prédictions cash-flow GPT-4, 
                et Score FinSight™ de 0 à 100.
              </p>
              <Link
                href="/agents/dashis"
                className="inline-flex items-center text-accent-primary font-semibold hover:text-accent-primary-hover transition-colors"
              >
                En savoir plus
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* TRESORIS Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
            >
              {/* Badge Bientôt */}
              <div className="absolute -top-3 left-6">
                <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-full shadow">
                  🚧 BIENTÔT
                </span>
              </div>
              
              <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">TRESORIS</h3>
              <p className="text-slate-500 text-sm font-medium mb-4">Agent Expert Trésorerie</p>
              <p className="text-slate-600 mb-6 text-sm">
                Surveille votre cash 24h/24, détecte les risques avant qu&apos;ils ne deviennent critiques, 
                et propose des actions prioritaires.
              </p>
              <Link
                href="/agents/tresoris"
                className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
              >
                En savoir plus
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* MARGIS Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
            >
              {/* Badge Bientôt */}
              <div className="absolute -top-3 left-6">
                <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-full shadow">
                  🚧 BIENTÔT
                </span>
              </div>
              
              <div className="w-14 h-14 rounded-xl bg-slate-400 flex items-center justify-center mb-6">
                <PieChart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">MARGIS</h3>
              <p className="text-slate-500 text-sm font-medium mb-4">Agent Rentabilité Réelle</p>
              <p className="text-slate-600 mb-6 text-sm">
                Révèle où vous gagnez vraiment de l&apos;argent. Identifie les produits rentables 
                et les clients destructeurs de marge.
              </p>
              <span
                className="inline-flex items-center text-slate-400 font-semibold cursor-not-allowed"
              >
                Prochainement
                <Clock className="w-4 h-4 ml-2" />
              </span>
            </motion.div>

            {/* SCENARIS Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group relative bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
            >
              {/* Badge Bientôt */}
              <div className="absolute -top-3 left-6">
                <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-full shadow">
                  🚧 BIENTÔT
                </span>
              </div>
              
              <div className="w-14 h-14 rounded-xl bg-slate-400 flex items-center justify-center mb-6">
                <GitBranch className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">SCENARIS</h3>
              <p className="text-slate-500 text-sm font-medium mb-4">Agent Simulation Stratégique</p>
              <p className="text-slate-600 mb-6 text-sm">
                Simule vos décisions avant de les prendre. Compare les scénarios 
                et identifie l&apos;option la moins risquée.
              </p>
              <span
                className="inline-flex items-center text-slate-400 font-semibold cursor-not-allowed"
              >
                Prochainement
                <Clock className="w-4 h-4 ml-2" />
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DASHIS Section */}
      <section id="dashis" className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0">
          <Image
            src="/images/bureau-nuit.png"
            alt="Background"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/95" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content - Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <BarChart3 className="w-4 h-4 text-accent-primary" />
                <span className="text-sm text-white/90 font-medium">Agent Vision 360°</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                DASHIS
              </h2>
              <p className="text-xl text-accent-primary font-medium mb-6">
                Dashboard Intelligence System
              </p>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                &ldquo;Où en est vraiment ma boîte financièrement ?&rdquo;
                <br /><br />
                En 30 secondes, DASHIS analyse vos données comptables et génère un diagnostic complet : 
                7 KPIs essentiels, détection ML des anomalies, prédictions IA du cash-flow, 
                et un Score FinSight™ de 0 à 100 pour benchmarker votre santé financière.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-300">
                    <span className="text-white font-medium">7 KPIs en temps réel</span> - CA, Marge Brute/Nette, Cash, DSO, BFR, Charges
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-300">
                    <span className="text-white font-medium">Score FinSight™ 0-100</span> - Benchmark sectoriel automatique (Xerfi, BdF)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-300">
                    <span className="text-white font-medium">Copilot IA GPT-4</span> - Posez vos questions en langage naturel
                  </p>
                </div>
              </div>

              <Link
                href="/agents/dashis"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
              >
                En savoir plus sur DASHIS
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Example Output - Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-accent-primary" />
                <span className="text-white font-semibold">Dashboard DASHIS - Analyse instantanée</span>
              </div>
              
              <div className="space-y-4 text-sm">
                {/* KPIs Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-lg font-bold text-white">2.3M€</p>
                    <p className="text-slate-400 text-xs">Chiffre d&apos;affaires</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-lg font-bold text-emerald-400">48.7%</p>
                    <p className="text-slate-400 text-xs">Marge Nette</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-lg font-bold text-white">1.1M€</p>
                    <p className="text-slate-400 text-xs">Cash disponible</p>
                  </div>
                </div>
                
                {/* Score FinSight */}
                <div className="p-4 bg-gradient-to-r from-accent-primary/20 to-accent-primary/10 rounded-xl border border-accent-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-semibold">Score FinSight™</p>
                    <span className="text-2xl font-bold text-accent-primary">72/100</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-accent-primary h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <p className="text-slate-400 text-xs mt-2">Santé financière : Bonne • Benchmark Services : Top 30%</p>
                </div>

                {/* Insights */}
                <div className="space-y-2">
                  <p className="text-slate-400 font-medium text-xs uppercase tracking-wide">Insights IA détectés :</p>
                  <div className="flex items-center gap-2 p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <p className="text-slate-300 text-xs">Croissance CA +60.9% vs période précédente</p>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <p className="text-slate-300 text-xs">2 transactions d&apos;achat anormales détectées</p>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <TrendingUp className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <p className="text-slate-300 text-xs">Prédiction cash-flow : +552K€ en décembre</p>
                  </div>
                </div>

                {/* Copilot */}
                <div className="p-3 bg-slate-900/50 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-accent-primary flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium">Copilot IA</span>
                  </div>
                  <p className="text-slate-400 text-xs italic">&ldquo;Quelle est ma marge nette sur les 3 derniers mois ?&rdquo;</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRESORIS Section */}
      <section id="tresoris" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 mb-6">
                <Shield className="w-4 h-4 text-accent-primary" />
                <span className="text-sm text-accent-primary font-medium">Agent Central</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                TRESORIS
              </h2>
              <p className="text-xl text-accent-primary font-medium mb-6">
                Surveillance Cash et Risque Trésorerie
              </p>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                &ldquo;Est-ce que je vais me prendre un mur de cash sans le voir venir ?&rdquo;
                <br /><br />
                TRESORIS surveille votre trésorerie en continu, requalifie les 26 situations 
                détectées en 2-5 vrais risques, et propose des décisions cash prioritaires.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-600">
                    <span className="text-slate-900 font-medium">Prévisions 4/8/13 semaines</span> - Anticipez les tensions de trésorerie
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-600">
                    <span className="text-slate-900 font-medium">26 situations surveillées</span> - Tri automatique en Certain / Incertain / Critique
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-600">
                    <span className="text-slate-900 font-medium">3 actions prioritaires</span> - Recommandations chiffrées avec deadline
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Example Output */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="text-slate-900 font-semibold">Alerte TRESORIS - 23 janvier 2026</span>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-red-600 font-semibold mb-2">Risque de tension cash</p>
                  <p className="text-slate-600">Prévision semaine 8 : -42 000 € de trésorerie disponible</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-slate-500 font-medium">Contexte identifié :</p>
                  <ul className="space-y-1 text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      Facture client #1247 : 68 000 € en retard de 12 jours
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      Échéance TVA : 23 500 € le 15/02
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      Masse salariale : 87 000 € le 28/02
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-accent-primary/10 rounded-xl border border-accent-primary/20">
                  <p className="text-accent-primary font-semibold mb-2">Recommandation P1</p>
                  <p className="text-slate-600">Relance immédiate client #1247 + négociation délai TVA</p>
                  <p className="text-slate-500 text-xs mt-2">Impact attendu : +58 000 € de marge de sécurité</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA TRESORIS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Link
              href="/agents/tresoris"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
            >
              En savoir plus sur TRESORIS
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* MARGIS Section */}
      <section id="margis" className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0">
          <Image
            src="/images/bureau-nuit.png"
            alt="Background"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/95" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Example Output - Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Analyse MARGIS - 23 janvier 2026</span>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-2xl font-bold text-white">18</p>
                    <p className="text-slate-400 text-xs">Produits analysés</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-2xl font-bold text-red-400">3</p>
                    <p className="text-slate-400 text-xs">Déficitaires</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-2xl font-bold text-emerald-400">68%</p>
                    <p className="text-slate-400 text-xs">Marge Top 5</p>
                  </div>
                </div>
                
                <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                  <p className="text-red-400 font-semibold mb-2">ALERTE : Produit &ldquo;Formation Standard&rdquo;</p>
                  <ul className="space-y-1 text-slate-300">
                    <li>CA généré : 120 000 €/an</li>
                    <li>Marge brute : 18% (vs 42% moyenne)</li>
                    <li>Verdict : perte de 27 200 €/an</li>
                  </ul>
                </div>

                <div className="p-4 bg-accent-primary/10 rounded-xl border border-accent-primary/20">
                  <p className="text-accent-primary font-semibold mb-2">Recommandation P1</p>
                  <p className="text-slate-300">Augmenter prix de 35% ou arrêter</p>
                  <p className="text-slate-400 text-xs mt-2">Impact attendu : +27 200 €/an ou réaffectation 340h</p>
                </div>
              </div>
            </motion.div>

            {/* Content - Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <PieChart className="w-4 h-4 text-accent-primary" />
                <span className="text-sm text-white/90 font-medium">Agent de Lucidité</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                MARGIS
              </h2>
              <p className="text-xl text-accent-primary font-medium mb-6">
                Vérité sur la Rentabilité
              </p>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                &ldquo;Où est-ce que je gagne vraiment de l&apos;argent ?&rdquo;
                <br /><br />
                La plupart des PME connaissent leur marge globale (42% par exemple), 
                mais ignorent la répartition réelle. MARGIS révèle les produits rentables 
                et les clients destructeurs de marge.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-300">
                    <span className="text-white font-medium">Heatmap rentabilité</span> - Vue produit × client instantanée
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-300">
                    <span className="text-white font-medium">Top 10 vs. Top 5</span> - Clients rentables vs. destructeurs identifiés
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-300">
                    <span className="text-white font-medium">Scénarios de réallocation</span> - Optimisez vos ressources
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SCENARIS Section */}
      <section id="scenaris" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 mb-6">
                <GitBranch className="w-4 h-4 text-accent-primary" />
                <span className="text-sm text-accent-primary font-medium">Agent Stratégique</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                SCENARIS
              </h2>
              <p className="text-xl text-accent-primary font-medium mb-6">
                Décisions Sous Incertitude
              </p>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                &ldquo;Quelle option est la moins risquée maintenant ?&rdquo;
                <br /><br />
                Et si on perd notre client n°1 ? Et si les taux augmentent de 2 points ? 
                Et si on recrute 3 personnes au lieu de 2 ? SCENARIS génère et compare 
                des scénarios financiers pour éclairer vos décisions.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-600">
                    <span className="text-slate-900 font-medium">Comparaison 3-5 scénarios</span> - Optimiste, réaliste, pessimiste
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-600">
                    <span className="text-slate-900 font-medium">Impact simulé sur 12-24 mois</span> - Trésorerie, rentabilité, runway
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-600">
                    <span className="text-slate-900 font-medium">Recommandation optimale</span> - Selon votre objectif (croissance, stabilité)
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Example Output */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <LineChart className="w-5 h-5 text-accent-primary" />
                <span className="text-slate-900 font-semibold">Simulation SCENARIS - Recrutement 2026</span>
              </div>
              
              <p className="text-slate-600 mb-4">Question : Recruter 2 ou 3 commerciaux en T1 ?</p>
              
              <div className="space-y-3 mb-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-900 font-medium mb-2">Scénario 1 : 2 commerciaux</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div><span className="text-slate-500">Coût</span><br/><span className="text-slate-900">+120k€</span></div>
                    <div><span className="text-slate-500">CA attendu</span><br/><span className="text-slate-900">+180k€</span></div>
                    <div><span className="text-slate-500">Runway</span><br/><span className="text-slate-900">38j → 52j</span></div>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-900 font-medium mb-2">Scénario 2 : 3 commerciaux</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div><span className="text-slate-500">Coût</span><br/><span className="text-slate-900">+180k€</span></div>
                    <div><span className="text-slate-500">CA attendu</span><br/><span className="text-slate-900">+240k€</span></div>
                    <div><span className="text-slate-500">Runway</span><br/><span className="text-amber-600">31j → 48j</span></div>
                  </div>
                </div>
                
                <div className="p-4 bg-accent-primary/10 rounded-xl border border-accent-primary/30">
                  <p className="text-accent-primary font-medium mb-2">Scénario 3 : 2 en T1 + 1 en T3 (Optimal)</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div><span className="text-slate-500">Coût</span><br/><span className="text-slate-900">+165k€</span></div>
                    <div><span className="text-slate-500">CA attendu</span><br/><span className="text-slate-900">+210k€</span></div>
                    <div><span className="text-slate-500">Runway</span><br/><span className="text-emerald-600">38j → 54j</span></div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-emerald-600 text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Recommandation : Scénario 3 - Runway &gt;30j en permanence
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Combinaisons Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0">
          <Image
            src="/images/bureau-nuit.png"
            alt="Background"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/85 to-slate-900/95" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Des combinaisons puissantes
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Chaque agent fonctionne seul, mais les combinaisons 
              décuplent leur valeur.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* DASHIS + TRESORIS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-500 font-bold">+</span>
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">DASHIS + TRESORIS</h3>
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded">TOP</span>
              </div>
              <p className="text-blue-400 font-medium mb-3">Vision + Surveillance</p>
              <p className="text-slate-300">
                Vue d'ensemble 360° + surveillance cash temps réel. 
                Le duo fondamental pour tout DAF moderne.
              </p>
            </motion.div>

            {/* TRESORIS + MARGIS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-500 font-bold">+</span>
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">TRESORIS + MARGIS</h3>
              <p className="text-accent-primary font-medium mb-3">Cash + Rentabilité</p>
              <p className="text-slate-300">
                Où va le cash + où sont les marges = pilotage financier complet. 
                La combinaison idéale pour les DAF opérationnels.
              </p>
            </motion.div>

            {/* TRESORIS + SCENARIS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-500 font-bold">+</span>
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">TRESORIS + SCENARIS</h3>
              <p className="text-accent-primary font-medium mb-3">Cash + Stratégie</p>
              <p className="text-slate-300">
                Cash actuel + scénarios futurs = décisions éclairées. 
                Parfait pour les CEO qui prennent des décisions structurantes.
              </p>
            </motion.div>

            {/* Le Quatuor Complet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:col-span-3 p-8 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/30 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-400 font-bold">+</span>
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-400 font-bold">+</span>
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-400 font-bold">+</span>
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-white">Le Quatuor Complet</h3>
                <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded">PREMIUM</span>
              </div>
              <p className="text-blue-400 font-medium mb-3">Vision + Cash + Rentabilité + Stratégie</p>
              <p className="text-slate-300">
                Les 4 agents IA en synergie : DASHIS pilote la vue d'ensemble, TRESORIS surveille le cash, 
                MARGIS optimise les marges, SCENARIS simule les futurs. Votre direction financière augmentée.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Une offre clé en main
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Déploiement complet, configuration sur mesure, formation incluse. 
              Vous êtes opérationnel en 2 semaines.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <div className="relative bg-white rounded-2xl p-10 shadow-2xl">
              {/* Featured Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1.5 bg-accent-primary rounded-full text-white text-sm font-semibold">
                  Offre Complète
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Pack 4 Agents</h3>
                <p className="text-slate-500 mb-6">DASHIS + TRESORIS + MARGIS + SCENARIS</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-slate-900">49 000 €</span>
                  <span className="text-slate-500">clé en main</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary" />
                  </div>
                  <span className="text-slate-600">Configuration personnalisée sur vos données</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary" />
                  </div>
                  <span className="text-slate-600">Intégration avec vos outils (comptabilité, CRM)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary" />
                  </div>
                  <span className="text-slate-600">Formation équipe incluse (DAF, CEO)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary" />
                  </div>
                  <span className="text-slate-600">Support prioritaire 3 mois</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary" />
                  </div>
                  <span className="text-slate-600">Mises à jour incluses 12 mois</span>
                </div>
              </div>

              <Link
                href="https://calendly.com/zineinsight"
                className="flex items-center justify-center gap-2 w-full py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300"
              >
                Demander un devis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0">
          <Image
            src="/images/bureau-nuit.png"
            alt="Background"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/85 to-slate-900/95" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Prêt à automatiser votre pilotage financier ?
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Découvrez comment DASHIS, TRESORIS, MARGIS et SCENARIS peuvent transformer 
              la gestion financière de votre PME. Démo gratuite de 30 minutes.
            </p>
            <Link
              href="https://calendly.com/zineinsight"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
            >
              Réserver ma démo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
