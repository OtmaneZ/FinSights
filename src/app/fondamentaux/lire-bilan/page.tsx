"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";

export default function LireBilanPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Article JSON-LD */}
      <StructuredData data={generateArticleJsonLd({
        title: 'Lire un bilan comptable : guide pratique',
        description: 'Le bilan est la photo de votre entreprise à un instant T. Apprenez à le décrypter en 15 minutes.',
        slug: 'lire-bilan',
        publishedDate: '25 janvier 2026',
        category: 'Fondamentaux'
      })} />
      
      {/* Breadcrumb JSON-LD */}
      <StructuredData data={generateBreadcrumbJsonLd([
        { name: 'Accueil', path: '/' },
        { name: 'Fondamentaux', path: '/fondamentaux' },
        { name: 'Lire un bilan comptable', path: '/fondamentaux/lire-bilan' }
      ])} />
      
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-16">
          <div className="absolute inset-0">
            <Image
              src="/images/bureau-nuit.png"
              alt="Background"
              fill
              className="object-cover opacity-15"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              {/* Breadcrumb */}
              <Link
                href="/fondamentaux"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux fondamentaux
              </Link>

              {/* Badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full">
                    Module 1 • Débutant
                  </span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Lire un bilan comptable
              </h1>

              <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl">
                Le bilan est la photo de votre entreprise à un instant T. 
                Apprenez à le décrypter en 15 minutes.
              </p>

              <div className="flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>15 min de lecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>4 sections</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              {/* Article Content */}
              <article className="prose prose-lg prose-slate max-w-none">
                
                {/* Introduction */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Chaque année, vous recevez un bilan de votre expert-comptable. 
                    50 pages de chiffres, des comptes numérotés... et vous ne comprenez rien. 
                    <strong> C&apos;est normal.</strong> Ce guide va changer ça.
                  </p>
                </motion.div>

                {/* Section 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</span>
                    Le bilan en une phrase
                  </h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-slate-800 font-medium mb-2">La règle d&apos;or du bilan :</p>
                        <p className="text-slate-700">
                          <strong>ACTIF</strong> (ce que vous possédez) = <strong>PASSIF</strong> (comment c&apos;est financé)
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-4">
                    Le bilan se compose de deux colonnes équilibrées :
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">📥 ACTIF (gauche)</h4>
                      <p className="text-slate-600 text-sm">Ce que l&apos;entreprise possède : locaux, machines, stocks, créances clients, trésorerie...</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">📤 PASSIF (droite)</h4>
                      <p className="text-slate-600 text-sm">Comment c&apos;est financé : capitaux propres (actionnaires) + dettes (banques, fournisseurs...)</p>
                    </div>
                  </div>
                </motion.div>

                {/* Section 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">2</span>
                    Détail de l&apos;ACTIF
                  </h2>

                  <p className="text-slate-600 mb-6">
                    L&apos;actif se divise en deux grandes catégories :
                  </p>

                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="text-left p-4 font-semibold text-slate-900 border border-slate-200">Type</th>
                          <th className="text-left p-4 font-semibold text-slate-900 border border-slate-200">Définition</th>
                          <th className="text-left p-4 font-semibold text-slate-900 border border-slate-200">Exemples</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-4 border border-slate-200 font-medium text-slate-900">Actif immobilisé</td>
                          <td className="p-4 border border-slate-200 text-slate-600">Biens durables (&gt;1 an)</td>
                          <td className="p-4 border border-slate-200 text-slate-600">Locaux, machines, véhicules, logiciels</td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="p-4 border border-slate-200 font-medium text-slate-900">Actif circulant</td>
                          <td className="p-4 border border-slate-200 text-slate-600">Biens court terme (&lt;1 an)</td>
                          <td className="p-4 border border-slate-200 text-slate-600">Stocks, créances clients, trésorerie</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                    <p className="text-slate-800 font-medium mb-3">💡 Exemple concret - PME de distribution :</p>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>Entrepôt : 500 k€ (actif immobilisé)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>Stocks de marchandises : 200 k€ (actif circulant)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>Trésorerie en banque : 80 k€ (actif circulant)</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>

                {/* Section 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">3</span>
                    Détail du PASSIF
                  </h2>

                  <p className="text-slate-600 mb-6">
                    Le passif répond à la question : <strong>&quot;Qui a financé ce que vous possédez ?&quot;</strong>
                  </p>

                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="text-left p-4 font-semibold text-slate-900 border border-slate-200">Type</th>
                          <th className="text-left p-4 font-semibold text-slate-900 border border-slate-200">Définition</th>
                          <th className="text-left p-4 font-semibold text-slate-900 border border-slate-200">Exemples</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-4 border border-slate-200 font-medium text-slate-900">Capitaux propres</td>
                          <td className="p-4 border border-slate-200 text-slate-600">Argent des actionnaires + bénéfices</td>
                          <td className="p-4 border border-slate-200 text-slate-600">Capital social, réserves, résultat</td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="p-4 border border-slate-200 font-medium text-slate-900">Dettes</td>
                          <td className="p-4 border border-slate-200 text-slate-600">Argent emprunté ou dû</td>
                          <td className="p-4 border border-slate-200 text-slate-600">Emprunts, dettes fournisseurs, charges</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <p className="text-slate-800 font-medium mb-3">🏠 Analogie simple - Achat d&apos;une maison :</p>
                    <ul className="space-y-2 text-slate-700">
                      <li>Maison de 300 k€ = <strong>ACTIF</strong></li>
                      <li>Votre apport 100 k€ = <strong>Capitaux propres</strong></li>
                      <li>Crédit bancaire 200 k€ = <strong>Dette</strong></li>
                      <li className="font-medium text-purple-700 pt-2">
                        300 k€ (actif) = 100 k€ (propres) + 200 k€ (dette) ✓
                      </li>
                    </ul>
                  </div>
                </motion.div>

                {/* Section 4 - Signaux d'alerte */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">4</span>
                    Les 5 lignes clés à surveiller
                  </h2>

                  <div className="space-y-4">
                    {/* Alert 1 */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">1. Trésorerie</h4>
                      <p className="text-slate-600 text-sm mb-2">
                        Combien d&apos;argent réel en banque ? Seuil critique : &lt; 1 mois de charges fixes.
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded">🚨 &lt; 1 mois</span>
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">⚠️ 1-2 mois</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">✅ &gt; 3 mois</span>
                      </div>
                    </div>

                    {/* Alert 2 */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">2. Créances clients</h4>
                      <p className="text-slate-600 text-sm">
                        Factures non payées. Si elles augmentent plus vite que le CA → problème de recouvrement.
                      </p>
                    </div>

                    {/* Alert 3 */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">3. Dettes fournisseurs</h4>
                      <p className="text-slate-600 text-sm">
                        Factures que vous devez payer. Une explosion soudaine = difficulté de paiement.
                      </p>
                    </div>

                    {/* Alert 4 */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">4. Capitaux propres</h4>
                      <p className="text-slate-600 text-sm mb-2">
                        La valeur nette de l&apos;entreprise. Si négatifs → situation de faillite juridique.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <p className="text-red-700 text-sm">
                            Capitaux propres négatifs = Dissolution obligatoire si non régularisés sous 2 ans
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Alert 5 */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">5. Dettes bancaires</h4>
                      <p className="text-slate-600 text-sm">
                        Ratio clé : Dettes / Capitaux propres. Au-delà de 2× → surendettement, difficile d&apos;emprunter.
                      </p>
                    </div>
                  </div>
                </motion.div>

              </article>

              {/* Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 pt-8 border-t border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href="/fondamentaux"
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Tous les modules
                  </Link>
                  <Link
                    href="/fondamentaux/lire-compte-resultat"
                    className="flex items-center gap-2 px-6 py-3 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-colors"
                  >
                    Module suivant
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
