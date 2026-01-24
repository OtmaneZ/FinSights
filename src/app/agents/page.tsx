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
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
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
              3 Agents IA
              <span className="block text-accent-primary mt-2">
                pour piloter votre PME
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Des assistants autonomes qui surveillent votre trésorerie, analysent votre rentabilité 
              et simulent vos décisions stratégiques. 24h/24, sans intervention humaine.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">26</div>
                <div className="text-sm text-slate-400">Situations surveillées</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-slate-400">Surveillance continue</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">3</div>
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
              Trois agents, une vision complète
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Chaque agent est autonome et hyper-spécialisé. Ensemble, ils offrent 
              une vision 360° de la santé financière de votre entreprise.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* TRESORIS Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">TRESORIS</h3>
              <p className="text-slate-500 text-sm font-medium mb-4">Agent de surveillance trésorerie</p>
              <p className="text-slate-600 mb-6">
                Surveille votre cash 24h/24, détecte les risques avant qu&apos;ils ne deviennent critiques, 
                et propose des actions prioritaires chiffrées.
              </p>
              <Link
                href="/agents/tresoris"
                className="inline-flex items-center text-slate-900 font-semibold hover:text-accent-primary transition-colors"
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
              <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center mb-6">
                <PieChart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">MARGIS</h3>
              <p className="text-slate-500 text-sm font-medium mb-4">Agent de rentabilité réelle</p>
              <p className="text-slate-600 mb-6">
                Révèle où vous gagnez vraiment de l&apos;argent. Identifie les produits rentables 
                et les clients destructeurs de marge.
              </p>
              <a
                href="#margis"
                className="inline-flex items-center text-slate-900 font-semibold hover:text-accent-primary transition-colors"
              >
                En savoir plus
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            {/* SCENARIS Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group relative bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center mb-6">
                <GitBranch className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">SCENARIS</h3>
              <p className="text-slate-500 text-sm font-medium mb-4">Agent de simulation stratégique</p>
              <p className="text-slate-600 mb-6">
                Simule vos décisions avant de les prendre. Compare les scénarios 
                et identifie l&apos;option la moins risquée.
              </p>
              <a
                href="#scenaris"
                className="inline-flex items-center text-slate-900 font-semibold hover:text-accent-primary transition-colors"
              >
                En savoir plus
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRESORIS Section */}
      <section id="tresoris" className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Shield className="w-4 h-4 text-accent-primary" />
                <span className="text-sm text-white/90 font-medium">Agent Central</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                TRESORIS
              </h2>
              <p className="text-xl text-accent-primary font-medium mb-6">
                Surveillance Cash et Risque Trésorerie
              </p>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                &ldquo;Est-ce que je vais me prendre un mur de cash sans le voir venir ?&rdquo;
                <br /><br />
                TRESORIS surveille votre trésorerie en continu, requalifie les 26 situations 
                détectées en 2-5 vrais risques, et propose des décisions cash prioritaires.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-300">
                    <span className="text-white font-medium">Prévisions 4/8/13 semaines</span> — Anticipez les tensions de trésorerie
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-300">
                    <span className="text-white font-medium">26 situations surveillées</span> — Tri automatique en Certain / Incertain / Critique
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-300">
                    <span className="text-white font-medium">3 actions prioritaires</span> — Recommandations chiffrées avec deadline
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
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span className="text-white font-semibold">Alerte TRESORIS — 23 janvier 2026</span>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                  <p className="text-red-400 font-semibold mb-2">Risque de tension cash</p>
                  <p className="text-slate-300">Prévision semaine 8 : -42 000 € de trésorerie disponible</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-slate-400 font-medium">Contexte identifié :</p>
                  <ul className="space-y-1 text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                      Facture client #1247 : 68 000 € en retard de 12 jours
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                      Échéance TVA : 23 500 € le 15/02
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                      Masse salariale : 87 000 € le 28/02
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-accent-primary/10 rounded-xl border border-accent-primary/20">
                  <p className="text-accent-primary font-semibold mb-2">Recommandation P1</p>
                  <p className="text-slate-300">Relance immédiate client #1247 + négociation délai TVA</p>
                  <p className="text-slate-400 text-xs mt-2">Impact attendu : +58 000 € de marge de sécurité</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MARGIS Section */}
      <section id="margis" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Example Output - Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1 bg-slate-50 rounded-2xl p-8 border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5 text-slate-900" />
                <span className="text-slate-900 font-semibold">Analyse MARGIS — 23 janvier 2026</span>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                    <p className="text-2xl font-bold text-slate-900">18</p>
                    <p className="text-slate-500 text-xs">Produits analysés</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                    <p className="text-2xl font-bold text-red-600">3</p>
                    <p className="text-slate-500 text-xs">Déficitaires</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                    <p className="text-2xl font-bold text-emerald-600">68%</p>
                    <p className="text-slate-500 text-xs">Marge Top 5</p>
                  </div>
                </div>
                
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-red-700 font-semibold mb-2">ALERTE : Produit &ldquo;Formation Standard&rdquo;</p>
                  <ul className="space-y-1 text-slate-600">
                    <li>CA généré : 120 000 €/an</li>
                    <li>Marge brute : 18% (vs 42% moyenne)</li>
                    <li>Verdict : perte de 27 200 €/an</li>
                  </ul>
                </div>

                <div className="p-4 bg-accent-primary/5 rounded-xl border border-accent-primary/20">
                  <p className="text-accent-primary font-semibold mb-2">Recommandation P1</p>
                  <p className="text-slate-600">Augmenter prix de 35% ou arrêter</p>
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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 mb-6">
                <PieChart className="w-4 h-4 text-slate-700" />
                <span className="text-sm text-slate-700 font-medium">Agent de Lucidité</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                MARGIS
              </h2>
              <p className="text-xl text-accent-primary font-medium mb-6">
                Vérité sur la Rentabilité
              </p>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                &ldquo;Où est-ce que je gagne vraiment de l&apos;argent ?&rdquo;
                <br /><br />
                La plupart des PME connaissent leur marge globale (42% par exemple), 
                mais ignorent la répartition réelle. MARGIS révèle les produits rentables 
                et les clients destructeurs de marge.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-700" />
                  </div>
                  <p className="text-slate-600">
                    <span className="text-slate-900 font-medium">Heatmap rentabilité</span> — Vue produit × client instantanée
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-700" />
                  </div>
                  <p className="text-slate-600">
                    <span className="text-slate-900 font-medium">Top 10 vs. Top 5</span> — Clients rentables vs. destructeurs identifiés
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-700" />
                  </div>
                  <p className="text-slate-600">
                    <span className="text-slate-900 font-medium">Scénarios de réallocation</span> — Optimisez vos ressources
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SCENARIS Section */}
      <section id="scenaris" className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0">
          <Image
            src="/images/moi-classe.png"
            alt="Background"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-900/95 via-slate-900/80 to-slate-900/95" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <GitBranch className="w-4 h-4 text-accent-primary" />
                <span className="text-sm text-white/90 font-medium">Agent Stratégique</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                SCENARIS
              </h2>
              <p className="text-xl text-accent-primary font-medium mb-6">
                Décisions Sous Incertitude
              </p>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                &ldquo;Quelle option est la moins risquée maintenant ?&rdquo;
                <br /><br />
                Et si on perd notre client n°1 ? Et si les taux augmentent de 2 points ? 
                Et si on recrute 3 personnes au lieu de 2 ? SCENARIS génère et compare 
                des scénarios financiers pour éclairer vos décisions.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-300">
                    <span className="text-white font-medium">Comparaison 3-5 scénarios</span> — Optimiste, réaliste, pessimiste
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-300">
                    <span className="text-white font-medium">Impact simulé sur 12-24 mois</span> — Trésorerie, rentabilité, runway
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-slate-300">
                    <span className="text-white font-medium">Recommandation optimale</span> — Selon votre objectif (croissance, stabilité)
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
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <LineChart className="w-5 h-5 text-accent-primary" />
                <span className="text-white font-semibold">Simulation SCENARIS — Recrutement 2026</span>
              </div>
              
              <p className="text-slate-400 mb-4">Question : Recruter 2 ou 3 commerciaux en T1 ?</p>
              
              <div className="space-y-3 mb-6">
                <div className="p-4 bg-slate-700/50 rounded-xl">
                  <p className="text-white font-medium mb-2">Scénario 1 : 2 commerciaux</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div><span className="text-slate-400">Coût</span><br/><span className="text-slate-200">+120k€</span></div>
                    <div><span className="text-slate-400">CA attendu</span><br/><span className="text-slate-200">+180k€</span></div>
                    <div><span className="text-slate-400">Runway</span><br/><span className="text-slate-200">38j → 52j</span></div>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-700/50 rounded-xl">
                  <p className="text-white font-medium mb-2">Scénario 2 : 3 commerciaux</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div><span className="text-slate-400">Coût</span><br/><span className="text-slate-200">+180k€</span></div>
                    <div><span className="text-slate-400">CA attendu</span><br/><span className="text-slate-200">+240k€</span></div>
                    <div><span className="text-slate-400">Runway</span><br/><span className="text-amber-400">31j → 48j</span></div>
                  </div>
                </div>
                
                <div className="p-4 bg-accent-primary/10 rounded-xl border border-accent-primary/30">
                  <p className="text-accent-primary font-medium mb-2">Scénario 3 : 2 en T1 + 1 en T3 (Optimal)</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div><span className="text-slate-400">Coût</span><br/><span className="text-slate-200">+165k€</span></div>
                    <div><span className="text-slate-400">CA attendu</span><br/><span className="text-slate-200">+210k€</span></div>
                    <div><span className="text-slate-400">Runway</span><br/><span className="text-emerald-400">38j → 54j</span></div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-emerald-400 text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Recommandation : Scénario 3 — Runway &gt;30j en permanence
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Combinaisons Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Des combinaisons puissantes
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Chaque agent fonctionne seul, mais les combinaisons 
              décuplent leur valeur.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 bg-slate-50 rounded-2xl border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-400 font-bold">+</span>
                <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">TRESORIS + MARGIS</h3>
              <p className="text-accent-primary font-medium mb-3">Cash + Rentabilité</p>
              <p className="text-slate-600">
                Où va le cash + où sont les marges = pilotage financier complet. 
                La combinaison idéale pour les DAF opérationnels.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8 bg-slate-50 rounded-2xl border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-400 font-bold">+</span>
                <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">TRESORIS + SCENARIS</h3>
              <p className="text-accent-primary font-medium mb-3">Cash + Stratégie</p>
              <p className="text-slate-600">
                Cash actuel + scénarios futurs = décisions éclairées. 
                Parfait pour les CEO qui prennent des décisions structurantes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-2 p-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
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
              <h3 className="text-xl font-bold text-white mb-2">Le Trio Complet</h3>
              <p className="text-accent-primary font-medium mb-3">Cash + Rentabilité + Stratégie</p>
              <p className="text-slate-300">
                Vision 360° de la santé financière. Pour les dirigeants qui veulent 
                un copilote financier complet et autonome.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0">
          <Image
            src="/images/bureau.png"
            alt="Background"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/90" />
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
              Une offre clé en main
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
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
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Pack 3 Agents</h3>
                <p className="text-slate-500 mb-6">TRESORIS + MARGIS + SCENARIS</p>
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Prêt à automatiser votre pilotage financier ?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Découvrez comment TRESORIS, MARGIS et SCENARIS peuvent transformer 
              la gestion financière de votre PME. Démo gratuite de 30 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://calendly.com/zineinsight"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
              >
                Réserver ma démo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="https://calendly.com/zineinsight"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 text-slate-900 font-semibold rounded-xl border border-slate-200 hover:bg-slate-200 transition-all duration-300"
              >
                Découvrir le consulting
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
