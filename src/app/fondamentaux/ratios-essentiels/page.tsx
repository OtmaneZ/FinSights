'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Calculator,
  Target,
  TrendingUp,
  Shield,
  Gauge,
  BarChart3,
  Zap
} from 'lucide-react';

export default function RatiosEssentielsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-slate-900 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: 'url(/images/bureau.png)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-900" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/fondamentaux" 
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux fondamentaux
            </Link>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
              <Calculator className="w-4 h-4" />
              Module 4 sur 5
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Les <span className="text-emerald-400">Ratios Essentiels</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 mb-8 max-w-2xl"
          >
            Les 15 ratios que tout dirigeant doit connaître. Formules, interprétations, 
            seuils d&apos;alerte et benchmarks par secteur.
          </motion.p>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-6 text-slate-400"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>30 min de lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <span>Niveau intermédiaire</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Learning Objectives */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              Ce que vous allez apprendre
            </h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {[
                'Ratios de rentabilité (marge, ROE, ROCE)',
                'Ratios de solvabilité et endettement',
                'Ratios de liquidité et BFR',
                'Ratios d\'activité (rotation, DSO, DPO)',
                'Benchmarks par secteur d\'activité',
                'Quand s\'alarmer, quand se rassurer'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-lg text-slate-600 mb-6">
              Les ratios financiers transforment des chiffres bruts en indicateurs 
              comparables et actionnables. Ils permettent de se comparer dans le temps, 
              à son secteur, et d&apos;identifier rapidement les zones de vigilance.
            </p>

            {/* Warning Box */}
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-800 mb-2">
                    Un ratio seul ne dit rien
                  </p>
                  <p className="text-amber-700">
                    Analysez toujours les ratios en tendance (sur 3-5 ans) et en 
                    comparaison sectorielle. Un ratio &ldquo;mauvais&rdquo; peut être normal 
                    dans certains secteurs.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 1: Ratios de Rentabilité */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Ratios de Rentabilité
              </h2>
            </div>

            <p className="text-slate-600 mb-8">
              Ces ratios mesurent la capacité de l&apos;entreprise à générer des profits 
              par rapport à différentes bases (CA, capitaux, actifs).
            </p>

            {/* Ratio Cards */}
            <div className="space-y-6">
              {/* Marge brute */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Marge brute</h3>
                    <p className="text-slate-500">Rentabilité après coûts directs</p>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg px-4 py-2 font-mono text-sm">
                    (CA - Coûts directs) / CA × 100
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Services</p>
                    <p className="font-bold text-emerald-600">60-80%</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Distribution</p>
                    <p className="font-bold text-emerald-600">25-40%</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Industrie</p>
                    <p className="font-bold text-emerald-600">30-50%</p>
                  </div>
                </div>
              </div>

              {/* Marge nette */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Marge nette</h3>
                    <p className="text-slate-500">Part du CA qui reste en bénéfice</p>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg px-4 py-2 font-mono text-sm">
                    Résultat net / CA × 100
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Excellent</p>
                    <p className="font-bold text-emerald-600">&gt; 10%</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Correct</p>
                    <p className="font-bold text-amber-600">5-10%</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Vigilance</p>
                    <p className="font-bold text-red-600">&lt; 5%</p>
                  </div>
                </div>
              </div>

              {/* ROE */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">ROE (Return on Equity)</h3>
                    <p className="text-slate-500">Rentabilité des capitaux propres</p>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg px-4 py-2 font-mono text-sm">
                    Résultat net / Capitaux propres × 100
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  Mesure le rendement pour les actionnaires. À comparer au coût du capital.
                </p>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-emerald-700">
                    <strong>Benchmark PME :</strong> Un ROE de 15-20% est considéré comme excellent. 
                    En dessous de 8%, les actionnaires feraient mieux de placer ailleurs.
                  </p>
                </div>
              </div>

              {/* ROCE */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">ROCE (Return on Capital Employed)</h3>
                    <p className="text-slate-500">Rentabilité des capitaux investis</p>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg px-4 py-2 font-mono text-sm">
                    EBIT / (CP + Dette nette) × 100
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  Plus pertinent que le ROE car il intègre l&apos;endettement. 
                  Un ROCE &gt; WACC indique une création de valeur.
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-700">
                    <strong>Règle d&apos;or :</strong> ROCE doit être supérieur au coût moyen 
                    pondéré du capital (WACC, généralement 7-12% pour une PME).
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Ratios de Solvabilité */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Ratios de Solvabilité
              </h2>
            </div>

            <p className="text-slate-600 mb-8">
              Ces ratios évaluent la solidité financière et la capacité à faire face 
              aux engagements long terme.
            </p>

            <div className="space-y-6">
              {/* Ratio d'endettement */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Gearing (ratio d&apos;endettement)</h3>
                    <p className="text-slate-500">Poids de la dette vs fonds propres</p>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg px-4 py-2 font-mono text-sm">
                    Dettes financières / Capitaux propres
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-emerald-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-500 mb-1">Sain</p>
                    <p className="font-bold text-emerald-600">&lt; 0.5</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-500 mb-1">Acceptable</p>
                    <p className="font-bold text-amber-600">0.5 - 1</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-500 mb-1">Risqué</p>
                    <p className="font-bold text-red-600">&gt; 1</p>
                  </div>
                </div>
              </div>

              {/* Autonomie financière */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Autonomie financière</h3>
                    <p className="text-slate-500">Indépendance vis-à-vis des créanciers</p>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg px-4 py-2 font-mono text-sm">
                    Capitaux propres / Total bilan × 100
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  Plus ce ratio est élevé, plus l&apos;entreprise peut résister aux chocs.
                </p>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700">
                    <strong>Seuil bancaire :</strong> Les banques exigent généralement 
                    un ratio &gt; 20-25% pour accorder des crédits.
                  </p>
                </div>
              </div>

              {/* Capacité de remboursement */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Capacité de remboursement</h3>
                    <p className="text-slate-500">Années pour rembourser la dette</p>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg px-4 py-2 font-mono text-sm">
                    Dette nette / EBITDA
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-emerald-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-500 mb-1">Excellent</p>
                    <p className="font-bold text-emerald-600">&lt; 2 ans</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-500 mb-1">Acceptable</p>
                    <p className="font-bold text-amber-600">2-4 ans</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-500 mb-1">Critique</p>
                    <p className="font-bold text-red-600">&gt; 5 ans</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 3: Ratios de Liquidité */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Gauge className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Ratios de Liquidité
              </h2>
            </div>

            <p className="text-slate-600 mb-8">
              Ces ratios mesurent la capacité à faire face aux échéances court terme.
            </p>

            <div className="space-y-6">
              {/* Ratio courant */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Ratio de liquidité générale</h3>
                    <p className="text-slate-500">(Current Ratio)</p>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg px-4 py-2 font-mono text-sm">
                    Actif circulant / Passif circulant
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  Indique si l&apos;entreprise peut payer ses dettes court terme avec ses actifs court terme.
                </p>
                <div className="flex gap-4">
                  <div className="flex-1 bg-emerald-50 rounded-lg p-4 text-center">
                    <p className="font-bold text-emerald-600">&gt; 1.5</p>
                    <p className="text-sm text-emerald-700">Confortable</p>
                  </div>
                  <div className="flex-1 bg-amber-50 rounded-lg p-4 text-center">
                    <p className="font-bold text-amber-600">1 - 1.5</p>
                    <p className="text-sm text-amber-700">À surveiller</p>
                  </div>
                  <div className="flex-1 bg-red-50 rounded-lg p-4 text-center">
                    <p className="font-bold text-red-600">&lt; 1</p>
                    <p className="text-sm text-red-700">Risque</p>
                  </div>
                </div>
              </div>

              {/* Ratio rapide */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Ratio de liquidité réduite</h3>
                    <p className="text-slate-500">(Quick Ratio / Acid Test)</p>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg px-4 py-2 font-mono text-sm">
                    (AC - Stocks) / Passif circulant
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  Plus conservateur car exclut les stocks (moins liquides).
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-700">
                    <strong>Objectif :</strong> &gt; 0.8 pour être à l&apos;aise. 
                    Particulièrement important dans l&apos;industrie où les stocks sont significatifs.
                  </p>
                </div>
              </div>

              {/* BFR en jours de CA */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">BFR en jours de CA</h3>
                    <p className="text-slate-500">Besoin de financement du cycle d&apos;exploitation</p>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg px-4 py-2 font-mono text-sm">
                    BFR / (CA / 365)
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Services</p>
                    <p className="font-bold text-slate-700">30-60 jours</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Distribution</p>
                    <p className="font-bold text-slate-700">15-45 jours</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Industrie</p>
                    <p className="font-bold text-slate-700">60-120 jours</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 4: Ratios d'Activité */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Ratios d&apos;Activité
              </h2>
            </div>

            <p className="text-slate-600 mb-8">
              Ces ratios mesurent l&apos;efficacité de gestion des actifs et du cycle d&apos;exploitation.
            </p>

            <div className="space-y-6">
              {/* DSO */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">DSO (Days Sales Outstanding)</h3>
                    <p className="text-slate-500">Délai moyen de paiement clients</p>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg px-4 py-2 font-mono text-sm">
                    (Créances clients / CA TTC) × 365
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  Combien de jours en moyenne pour être payé par vos clients.
                </p>
                <div className="flex gap-4">
                  <div className="flex-1 bg-emerald-50 rounded-lg p-4 text-center">
                    <p className="font-bold text-emerald-600">&lt; 45j</p>
                    <p className="text-sm text-emerald-700">Excellent</p>
                  </div>
                  <div className="flex-1 bg-amber-50 rounded-lg p-4 text-center">
                    <p className="font-bold text-amber-600">45-60j</p>
                    <p className="text-sm text-amber-700">Normal B2B</p>
                  </div>
                  <div className="flex-1 bg-red-50 rounded-lg p-4 text-center">
                    <p className="font-bold text-red-600">&gt; 70j</p>
                    <p className="text-sm text-red-700">À optimiser</p>
                  </div>
                </div>
              </div>

              {/* DPO */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">DPO (Days Payables Outstanding)</h3>
                    <p className="text-slate-500">Délai moyen de paiement fournisseurs</p>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg px-4 py-2 font-mono text-sm">
                    (Dettes fournisseurs / Achats TTC) × 365
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  Combien de jours en moyenne pour payer vos fournisseurs.
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4">
                  <p className="text-amber-700">
                    <strong>LME :</strong> Légalement plafonné à 60 jours date de facture 
                    (ou 45 jours fin de mois) en France.
                  </p>
                </div>
              </div>

              {/* DIO */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">DIO (Days Inventory Outstanding)</h3>
                    <p className="text-slate-500">Durée moyenne de stockage</p>
                  </div>
                  <div className="bg-slate-900 text-white rounded-lg px-4 py-2 font-mono text-sm">
                    (Stocks moyens / Coût des ventes) × 365
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  Combien de jours le stock reste en moyenne avant d&apos;être vendu.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Alimentaire</p>
                    <p className="font-bold text-slate-700">5-15 jours</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Distribution</p>
                    <p className="font-bold text-slate-700">30-60 jours</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Industrie</p>
                    <p className="font-bold text-slate-700">60-120 jours</p>
                  </div>
                </div>
              </div>

              {/* Cycle de conversion */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  Le Cycle de Conversion de Trésorerie
                </h3>
                <div className="bg-slate-800/50 rounded-lg p-4 font-mono text-center mb-4">
                  <span className="text-emerald-400">CCC</span> = DSO + DIO - DPO
                </div>
                <p className="text-slate-300 mb-4">
                  Nombre de jours entre le décaissement pour les achats et l&apos;encaissement des ventes.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-emerald-500/20 rounded-lg p-4">
                    <p className="text-emerald-400 font-semibold">CCC négatif = idéal</p>
                    <p className="text-sm text-slate-300">
                      Vous encaissez avant de décaisser (modèle Amazon, grande distribution)
                    </p>
                  </div>
                  <div className="bg-amber-500/20 rounded-lg p-4">
                    <p className="text-amber-400 font-semibold">CCC positif = à financer</p>
                    <p className="text-sm text-slate-300">
                      Plus le CCC est élevé, plus le BFR pèse sur la trésorerie
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tableau récapitulatif */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Tableau récapitulatif
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left p-4">Ratio</th>
                    <th className="text-center p-4">Bon</th>
                    <th className="text-center p-4">Attention</th>
                    <th className="text-center p-4">Critique</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-4 font-medium">Marge nette</td>
                    <td className="p-4 text-center text-emerald-600 font-semibold">&gt; 10%</td>
                    <td className="p-4 text-center text-amber-600">5-10%</td>
                    <td className="p-4 text-center text-red-600 font-semibold">&lt; 5%</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-4 font-medium">ROE</td>
                    <td className="p-4 text-center text-emerald-600 font-semibold">&gt; 15%</td>
                    <td className="p-4 text-center text-amber-600">8-15%</td>
                    <td className="p-4 text-center text-red-600 font-semibold">&lt; 8%</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Gearing</td>
                    <td className="p-4 text-center text-emerald-600 font-semibold">&lt; 0.5</td>
                    <td className="p-4 text-center text-amber-600">0.5-1</td>
                    <td className="p-4 text-center text-red-600 font-semibold">&gt; 1</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-4 font-medium">Dette/EBITDA</td>
                    <td className="p-4 text-center text-emerald-600 font-semibold">&lt; 2</td>
                    <td className="p-4 text-center text-amber-600">2-4</td>
                    <td className="p-4 text-center text-red-600 font-semibold">&gt; 5</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Current ratio</td>
                    <td className="p-4 text-center text-emerald-600 font-semibold">&gt; 1.5</td>
                    <td className="p-4 text-center text-amber-600">1-1.5</td>
                    <td className="p-4 text-center text-red-600 font-semibold">&lt; 1</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-4 font-medium">DSO</td>
                    <td className="p-4 text-center text-emerald-600 font-semibold">&lt; 45j</td>
                    <td className="p-4 text-center text-amber-600">45-60j</td>
                    <td className="p-4 text-center text-red-600 font-semibold">&gt; 70j</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Key Takeaways */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">À retenir</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 font-bold">1</span>
                  </div>
                  <p className="text-slate-300">
                    <strong className="text-white">Comparez dans le temps</strong> : 
                    La tendance compte plus que le niveau absolu
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 font-bold">2</span>
                  </div>
                  <p className="text-slate-300">
                    <strong className="text-white">Comparez au secteur</strong> : 
                    Les normes varient selon l&apos;activité
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 font-bold">3</span>
                  </div>
                  <p className="text-slate-300">
                    <strong className="text-white">Croisez les ratios</strong> : 
                    Un seul ratio ne raconte pas toute l&apos;histoire
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 font-bold">4</span>
                  </div>
                  <p className="text-slate-300">
                    <strong className="text-white">Focus sur 5-6 ratios clés</strong> : 
                    Mieux vaut maîtriser quelques indicateurs
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-between gap-4"
          >
            <Link 
              href="/fondamentaux/comprendre-cash-flow"
              className="flex items-center gap-3 px-6 py-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
              <div>
                <p className="text-sm text-slate-500">Module précédent</p>
                <p className="font-semibold text-slate-900">Comprendre le cash-flow</p>
              </div>
            </Link>
            <Link 
              href="/fondamentaux/questions-comptable"
              className="flex items-center gap-3 px-6 py-4 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all group"
            >
              <div className="text-right">
                <p className="text-sm text-emerald-100">Module suivant</p>
                <p className="font-semibold">Questions à poser à son comptable</p>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
