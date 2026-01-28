'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Building,
  Coins,
  RefreshCw,
  Target,
  Zap
} from 'lucide-react';

export default function ComprendreCashFlowPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Article JSON-LD */}
      <StructuredData data={generateArticleJsonLd({
        title: 'Comprendre le cash flow : guide complet',
        description: 'Maîtrisez le cash flow de votre entreprise : définition, calcul, optimisation et gestion au quotidien.',
        slug: 'comprendre-cash-flow',
        publishedDate: '25 janvier 2026',
        category: 'Fondamentaux'
      })} />
      
      {/* Breadcrumb JSON-LD */}
      <StructuredData data={generateBreadcrumbJsonLd([
        { name: 'Accueil', path: '/' },
        { name: 'Fondamentaux', path: '/fondamentaux' },
        { name: 'Comprendre le cash flow', path: '/fondamentaux/comprendre-cash-flow' }
      ])} />
      
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
              <TrendingUp className="w-4 h-4" />
              Module 3 sur 5
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Comprendre le <span className="text-emerald-400">Cash-Flow</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 mb-8 max-w-2xl"
          >
            Le cash-flow, c&apos;est l&apos;oxygène de votre entreprise. Apprenez à lire et 
            interpréter le tableau des flux de trésorerie pour anticiper les problèmes 
            et saisir les opportunités.
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
              <span>25 min de lecture</span>
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
                'Différence entre résultat et trésorerie',
                'Les 3 types de flux de trésorerie',
                'Interpréter un tableau de flux',
                'Calculer le free cash-flow',
                'Anticiper les tensions de trésorerie',
                'Les signaux d\'alerte à surveiller'
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
          
          {/* Section 1: Pourquoi le cash-flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Pourquoi le cash-flow est crucial
            </h2>
            
            {/* Warning Box */}
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-800 mb-2">
                    Le piège classique du dirigeant
                  </p>
                  <p className="text-amber-700">
                    &ldquo;Mon entreprise est rentable, pourquoi je n&apos;ai pas de trésorerie ?&rdquo; 
                    Le résultat comptable et la trésorerie sont deux choses différentes. 
                    Une entreprise peut être rentable et en cessation de paiement.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600 mb-6">
                Le cash-flow (ou flux de trésorerie) mesure les mouvements réels d&apos;argent 
                dans votre entreprise. Contrairement au résultat comptable qui inclut des 
                écritures non-cash (amortissements, provisions), le cash-flow vous dit 
                combien d&apos;argent entre et sort réellement.
              </p>

              <div className="bg-slate-900 text-white rounded-xl p-6 font-mono text-sm mb-6">
                <p className="text-slate-400 mb-2">La différence fondamentale :</p>
                <div className="space-y-2">
                  <p><span className="text-emerald-400">Résultat net</span> = Produits - Charges <span className="text-slate-400">(comptable)</span></p>
                  <p><span className="text-emerald-400">Cash-flow</span> = Encaissements - Décaissements <span className="text-slate-400">(trésorerie)</span></p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">
                Exemple concret
              </h3>
              <p className="text-slate-600 mb-4">
                Vous vendez pour 100 000 € en janvier avec un paiement à 60 jours :
              </p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span><strong>Résultat janvier</strong> : +100 000 € (la vente est comptabilisée)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Cash-flow janvier</strong> : 0 € (rien n&apos;a été encaissé)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span><strong>Cash-flow mars</strong> : +100 000 € (le client paie enfin)</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Section 2: Les 3 types de flux */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Les 3 types de flux de trésorerie
            </h2>

            <p className="text-lg text-slate-600 mb-8">
              Le tableau des flux de trésorerie se divise en trois catégories qui 
              racontent chacune une histoire différente sur votre entreprise.
            </p>

            {/* Flux Cards */}
            <div className="space-y-6">
              {/* Flux d'exploitation */}
              <div className="bg-white rounded-xl border-2 border-emerald-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      1. Flux d&apos;exploitation (Operating Cash Flow)
                    </h3>
                    <p className="text-slate-600 mb-4">
                      L&apos;argent généré par l&apos;activité principale de l&apos;entreprise. 
                      C&apos;est le plus important : il montre si votre business model génère du cash.
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="font-semibold text-slate-900 mb-2">Comprend :</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Encaissements clients</li>
                        <li>• Paiements fournisseurs</li>
                        <li>• Salaires et charges sociales</li>
                        <li>• Impôts et taxes</li>
                      </ul>
                    </div>
                    <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                      <p className="text-sm text-emerald-700">
                        <strong>Signal positif :</strong> Flux d&apos;exploitation &gt; Résultat net 
                        = bonne gestion du BFR
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flux d'investissement */}
              <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      2. Flux d&apos;investissement (Investing Cash Flow)
                    </h3>
                    <p className="text-slate-600 mb-4">
                      L&apos;argent dépensé ou récupéré via les investissements. 
                      Généralement négatif pour une entreprise en croissance.
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="font-semibold text-slate-900 mb-2">Comprend :</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Achats d&apos;équipements et immobilisations</li>
                        <li>• Ventes d&apos;actifs</li>
                        <li>• Acquisitions de filiales</li>
                        <li>• Placements financiers</li>
                      </ul>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>À analyser :</strong> Des investissements réguliers montrent 
                        une entreprise qui prépare l&apos;avenir
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flux de financement */}
              <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Coins className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      3. Flux de financement (Financing Cash Flow)
                    </h3>
                    <p className="text-slate-600 mb-4">
                      L&apos;argent échangé avec les actionnaires et les prêteurs. 
                      Reflète les choix de structure financière.
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="font-semibold text-slate-900 mb-2">Comprend :</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Emprunts nouveaux / Remboursements</li>
                        <li>• Augmentations de capital</li>
                        <li>• Dividendes versés</li>
                        <li>• Rachats d&apos;actions</li>
                      </ul>
                    </div>
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-700">
                        <strong>Attention :</strong> Des dividendes supérieurs au résultat 
                        = puiser dans les réserves
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 3: Lire un tableau de flux */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Lire un tableau des flux de trésorerie
            </h2>

            <p className="text-lg text-slate-600 mb-8">
              Voici un exemple simplifié pour comprendre la logique :
            </p>

            {/* Example Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left p-4 font-semibold">Poste</th>
                    <th className="text-right p-4 font-semibold">Montant (k€)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-emerald-50">
                    <td colSpan={2} className="p-4 font-bold text-emerald-700">
                      FLUX D&apos;EXPLOITATION
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-8 text-slate-600">Résultat net</td>
                    <td className="p-4 text-right font-mono">+150</td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-8 text-slate-600">+ Amortissements (non-cash)</td>
                    <td className="p-4 text-right font-mono">+80</td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-8 text-slate-600">- Variation BFR</td>
                    <td className="p-4 text-right font-mono text-red-600">-50</td>
                  </tr>
                  <tr className="bg-emerald-100">
                    <td className="p-4 pl-8 font-semibold text-emerald-800">= Flux d&apos;exploitation</td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-700">+180</td>
                  </tr>

                  <tr className="bg-blue-50">
                    <td colSpan={2} className="p-4 font-bold text-blue-700">
                      FLUX D&apos;INVESTISSEMENT
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-8 text-slate-600">Achats d&apos;immobilisations</td>
                    <td className="p-4 text-right font-mono text-red-600">-120</td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-8 text-slate-600">Cessions d&apos;actifs</td>
                    <td className="p-4 text-right font-mono">+20</td>
                  </tr>
                  <tr className="bg-blue-100">
                    <td className="p-4 pl-8 font-semibold text-blue-800">= Flux d&apos;investissement</td>
                    <td className="p-4 text-right font-mono font-bold text-blue-700">-100</td>
                  </tr>

                  <tr className="bg-purple-50">
                    <td colSpan={2} className="p-4 font-bold text-purple-700">
                      FLUX DE FINANCEMENT
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-8 text-slate-600">Nouveaux emprunts</td>
                    <td className="p-4 text-right font-mono">+50</td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-8 text-slate-600">Remboursements</td>
                    <td className="p-4 text-right font-mono text-red-600">-30</td>
                  </tr>
                  <tr>
                    <td className="p-4 pl-8 text-slate-600">Dividendes versés</td>
                    <td className="p-4 text-right font-mono text-red-600">-40</td>
                  </tr>
                  <tr className="bg-purple-100">
                    <td className="p-4 pl-8 font-semibold text-purple-800">= Flux de financement</td>
                    <td className="p-4 text-right font-mono font-bold text-purple-700">-20</td>
                  </tr>

                  <tr className="bg-slate-900 text-white">
                    <td className="p-4 font-bold">VARIATION DE TRÉSORERIE</td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-400">+60</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Interpretation */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <h3 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Interprétation
              </h3>
              <p className="text-emerald-700">
                Cette entreprise génère <strong>180 k€</strong> par son activité, en investit 
                <strong> 100 k€</strong> pour sa croissance, et après avoir servi sa dette et 
                ses actionnaires, sa trésorerie augmente de <strong>60 k€</strong>. 
                C&apos;est un profil sain : l&apos;exploitation finance les investissements 
                et les dividendes.
              </p>
            </div>
          </motion.div>

          {/* Section 4: Free Cash Flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Le Free Cash-Flow (FCF)
            </h2>

            <p className="text-lg text-slate-600 mb-6">
              Le <strong>Free Cash-Flow</strong> est l&apos;indicateur roi pour les investisseurs. 
              Il représente l&apos;argent réellement disponible après avoir financé l&apos;activité 
              et les investissements nécessaires.
            </p>

            <div className="bg-slate-900 text-white rounded-xl p-6 font-mono text-sm mb-8">
              <p className="text-slate-400 mb-4">Formule du Free Cash-Flow :</p>
              <div className="space-y-2">
                <p><span className="text-emerald-400">FCF</span> = Flux d&apos;exploitation - Investissements de maintenance</p>
                <p className="text-slate-400 text-xs mt-4">ou version simplifiée :</p>
                <p><span className="text-emerald-400">FCF</span> = EBITDA - Impôts - Δ BFR - Capex</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 rounded-xl p-6">
                <h4 className="font-bold text-emerald-800 mb-3">FCF positif = Options</h4>
                <ul className="text-emerald-700 space-y-2 text-sm">
                  <li>• Rembourser la dette plus vite</li>
                  <li>• Verser des dividendes</li>
                  <li>• Faire des acquisitions</li>
                  <li>• Racheter des actions</li>
                  <li>• Constituer une réserve</li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-xl p-6">
                <h4 className="font-bold text-red-800 mb-3">FCF négatif = Vigilance</h4>
                <ul className="text-red-700 space-y-2 text-sm">
                  <li>• Phase d&apos;investissement intense (normal si temporaire)</li>
                  <li>• Croissance qui consomme du cash</li>
                  <li>• Problème de profitabilité</li>
                  <li>• BFR mal maîtrisé</li>
                  <li>• Besoin de financement externe</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Section 5: Signaux d'alerte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Les signaux d&apos;alerte à surveiller
            </h2>

            <div className="space-y-4">
              {[
                {
                  signal: 'Flux d\'exploitation négatif plusieurs trimestres',
                  explication: 'L\'activité ne génère pas de cash. Situation intenable à moyen terme.',
                  gravite: 'critique'
                },
                {
                  signal: 'FCF < 0 alors que l\'entreprise verse des dividendes',
                  explication: 'On distribue de l\'argent qu\'on ne génère pas. Financement par dette ou réserves.',
                  gravite: 'critique'
                },
                {
                  signal: 'Variation BFR > Résultat net',
                  explication: 'La croissance consomme tout le résultat en stocks/créances. Risque de tension.',
                  gravite: 'attention'
                },
                {
                  signal: 'Investissements en baisse continue',
                  explication: 'L\'entreprise n\'investit plus dans son avenir. À surveiller sur le long terme.',
                  gravite: 'attention'
                },
                {
                  signal: 'Dépendance au financement externe',
                  explication: 'Les flux de financement comblent systématiquement les déficits d\'exploitation.',
                  gravite: 'critique'
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`rounded-xl p-5 border-l-4 ${
                    item.gravite === 'critique' 
                      ? 'bg-red-50 border-red-500' 
                      : 'bg-amber-50 border-amber-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      item.gravite === 'critique' ? 'text-red-500' : 'text-amber-500'
                    }`} />
                    <div>
                      <p className={`font-semibold mb-1 ${
                        item.gravite === 'critique' ? 'text-red-800' : 'text-amber-800'
                      }`}>
                        {item.signal}
                      </p>
                      <p className={`text-sm ${
                        item.gravite === 'critique' ? 'text-red-700' : 'text-amber-700'
                      }`}>
                        {item.explication}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
                    <strong className="text-white">Résultat ≠ Trésorerie</strong> : 
                    Une entreprise rentable peut manquer de cash
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 font-bold">2</span>
                  </div>
                  <p className="text-slate-300">
                    <strong className="text-white">Le flux d&apos;exploitation est roi</strong> : 
                    C&apos;est lui qui doit financer le reste
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 font-bold">3</span>
                  </div>
                  <p className="text-slate-300">
                    <strong className="text-white">FCF = liberté financière</strong> : 
                    L&apos;argent vraiment disponible pour décider
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 font-bold">4</span>
                  </div>
                  <p className="text-slate-300">
                    <strong className="text-white">Analysez les tendances</strong> : 
                    Un trimestre ne fait pas une tendance
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
              href="/fondamentaux/lire-compte-resultat"
              className="flex items-center gap-3 px-6 py-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
              <div>
                <p className="text-sm text-slate-500">Module précédent</p>
                <p className="font-semibold text-slate-900">Lire un compte de résultat</p>
              </div>
            </Link>
            <Link 
              href="/fondamentaux/ratios-essentiels"
              className="flex items-center gap-3 px-6 py-4 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all group"
            >
              <div className="text-right">
                <p className="text-sm text-emerald-100">Module suivant</p>
                <p className="font-semibold">Les ratios essentiels</p>
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
