"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
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

export default function LireCompteResultatPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Article JSON-LD */}
      <StructuredData data={generateArticleJsonLd({
        title: 'Lire un compte de résultat : guide pratique',
        description: 'Comprendre le compte de résultat de votre entreprise en 15 minutes : du chiffre d\'affaires au résultat net.',
        slug: 'lire-compte-resultat',
        publishedDate: '25 janvier 2026',
        category: 'Fondamentaux'
      })} />
      
      {/* Breadcrumb JSON-LD */}
      <StructuredData data={generateBreadcrumbJsonLd([
        { name: 'Accueil', path: '/' },
        { name: 'Fondamentaux', path: '/fondamentaux' },
        { name: 'Lire un compte de résultat', path: '/fondamentaux/lire-compte-resultat' }
      ])} />
      
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-16">
          <div className="absolute inset-0">
            <Image
              src="/images/bureau.png"
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
              <Link
                href="/fondamentaux"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux fondamentaux
              </Link>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full">
                    Module 2 • Débutant
                  </span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Lire un compte de résultat
              </h1>

              <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl">
                Du chiffre d&apos;affaires au résultat net : comprenez comment votre 
                entreprise génère (ou perd) de l&apos;argent.
              </p>

              <div className="flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>12 min de lecture</span>
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
              <article className="prose prose-lg prose-slate max-w-none">
                
                {/* Introduction */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Si le bilan est une <strong>photo</strong> de votre entreprise, le compte de résultat 
                    est un <strong>film</strong> : il montre ce qui s&apos;est passé pendant l&apos;année.
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
                    <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">1</span>
                    La structure en cascade
                  </h2>

                  <p className="text-slate-600 mb-6">
                    Le compte de résultat se lit de haut en bas, comme une cascade où l&apos;on retire 
                    progressivement les charges :
                  </p>

                  <div className="bg-slate-900 text-white rounded-xl p-6 font-mono text-sm mb-6">
                    <div className="space-y-2">
                      <p className="text-emerald-400 font-bold">Chiffre d&apos;affaires (CA)</p>
                      <p className="text-slate-400 pl-4">- Coût des ventes</p>
                      <p className="text-blue-400 font-bold">= MARGE BRUTE</p>
                      <p className="text-slate-400 pl-4">- Charges d&apos;exploitation</p>
                      <p className="text-purple-400 font-bold">= RÉSULTAT D&apos;EXPLOITATION</p>
                      <p className="text-slate-400 pl-4">- Charges financières</p>
                      <p className="text-slate-400 pl-4">+/- Résultat exceptionnel</p>
                      <p className="text-slate-400 pl-4">- Impôt sur les sociétés</p>
                      <p className="text-yellow-400 font-bold">= RÉSULTAT NET</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-slate-800 font-medium mb-2">En résumé :</p>
                        <p className="text-slate-700">
                          <strong>CA</strong> - ce que vous vendez<br />
                          <strong>Charges</strong> - ce que vous dépensez<br />
                          <strong>= Résultat</strong> - ce qu&apos;il reste (profit ou perte)
                        </p>
                      </div>
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
                    <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">2</span>
                    Exemple chiffré
                  </h2>

                  <p className="text-slate-600 mb-6">
                    Prenons l&apos;exemple d&apos;une PME e-commerce avec 2 M€ de CA :
                  </p>

                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr className="bg-emerald-50">
                          <td className="p-4 border border-slate-200 font-bold text-slate-900">Chiffre d&apos;affaires</td>
                          <td className="p-4 border border-slate-200 text-right font-bold text-slate-900">2 000 k€</td>
                        </tr>
                        <tr>
                          <td className="p-4 border border-slate-200 text-slate-600 pl-8">- Coût des marchandises</td>
                          <td className="p-4 border border-slate-200 text-right text-slate-600">-1 200 k€</td>
                        </tr>
                        <tr className="bg-blue-50">
                          <td className="p-4 border border-slate-200 font-bold text-blue-700">= Marge brute (40%)</td>
                          <td className="p-4 border border-slate-200 text-right font-bold text-blue-700">800 k€</td>
                        </tr>
                        <tr>
                          <td className="p-4 border border-slate-200 text-slate-600 pl-8">- Salaires et charges</td>
                          <td className="p-4 border border-slate-200 text-right text-slate-600">-400 k€</td>
                        </tr>
                        <tr>
                          <td className="p-4 border border-slate-200 text-slate-600 pl-8">- Loyers et charges</td>
                          <td className="p-4 border border-slate-200 text-right text-slate-600">-80 k€</td>
                        </tr>
                        <tr>
                          <td className="p-4 border border-slate-200 text-slate-600 pl-8">- Marketing</td>
                          <td className="p-4 border border-slate-200 text-right text-slate-600">-150 k€</td>
                        </tr>
                        <tr>
                          <td className="p-4 border border-slate-200 text-slate-600 pl-8">- Autres charges</td>
                          <td className="p-4 border border-slate-200 text-right text-slate-600">-70 k€</td>
                        </tr>
                        <tr className="bg-purple-50">
                          <td className="p-4 border border-slate-200 font-bold text-purple-700">= Résultat d&apos;exploitation</td>
                          <td className="p-4 border border-slate-200 text-right font-bold text-purple-700">100 k€</td>
                        </tr>
                        <tr>
                          <td className="p-4 border border-slate-200 text-slate-600 pl-8">- Intérêts d&apos;emprunt</td>
                          <td className="p-4 border border-slate-200 text-right text-slate-600">-20 k€</td>
                        </tr>
                        <tr>
                          <td className="p-4 border border-slate-200 text-slate-600 pl-8">- Impôt (25%)</td>
                          <td className="p-4 border border-slate-200 text-right text-slate-600">-20 k€</td>
                        </tr>
                        <tr className="bg-yellow-50">
                          <td className="p-4 border border-slate-200 font-bold text-yellow-700">= RÉSULTAT NET</td>
                          <td className="p-4 border border-slate-200 text-right font-bold text-yellow-700">60 k€</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <p className="text-sm text-slate-500 mb-1">Marge brute</p>
                      <p className="text-2xl font-bold text-slate-900">40%</p>
                      <p className="text-sm text-slate-600">800k€ / 2 000k€</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <p className="text-sm text-slate-500 mb-1">Marge nette</p>
                      <p className="text-2xl font-bold text-slate-900">3%</p>
                      <p className="text-sm text-slate-600">60k€ / 2 000k€</p>
                    </div>
                  </div>
                </motion.div>

                {/* Section 3 - Piège */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">3</span>
                    ⚠️ Le piège mortel
                  </h2>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-red-800 font-bold mb-2">
                          RÉSULTAT ≠ TRÉSORERIE
                        </p>
                        <p className="text-red-700 mb-4">
                          60% des dirigeants font cette erreur : &quot;J&apos;ai 100k€ de résultat, 
                          donc j&apos;ai 100k€ en banque&quot;. <strong>C&apos;est faux !</strong>
                        </p>
                        <p className="text-red-700 font-medium">Pourquoi ?</p>
                        <ul className="mt-2 space-y-1 text-red-700">
                          <li>• Vos clients n&apos;ont pas encore payé leurs factures</li>
                          <li>• Vous avez acheté des stocks pas encore vendus</li>
                          <li>• Vous remboursez un emprunt (pas une charge !)</li>
                          <li>• Vous avez investi dans du matériel</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white rounded-xl p-6 font-mono text-sm">
                    <p className="text-slate-400 mb-2">Exemple concret :</p>
                    <div className="space-y-1">
                      <p>Résultat net : <span className="text-emerald-400">+100 k€</span></p>
                      <p>- Créances clients non payées : <span className="text-red-400">-80 k€</span></p>
                      <p>- Achat machine : <span className="text-red-400">-50 k€</span></p>
                      <p>- Remboursement emprunt : <span className="text-red-400">-30 k€</span></p>
                      <p>- Augmentation stocks : <span className="text-red-400">-40 k€</span></p>
                      <p className="pt-2 border-t border-slate-700">
                        = Trésorerie réelle : <span className="text-red-400 font-bold">-100 k€</span>
                      </p>
                    </div>
                    <p className="mt-4 text-yellow-400">
                      🚨 Entreprise rentable mais en difficulté de trésorerie !
                    </p>
                  </div>
                </motion.div>

                {/* Section 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">4</span>
                    Les 3 types de résultats
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">1</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">Résultat d&apos;exploitation</h4>
                          <p className="text-slate-600 text-sm">
                            La rentabilité de votre <strong>activité principale</strong>, 
                            avant charges financières. C&apos;est le plus important !
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">Résultat financier</h4>
                          <p className="text-slate-600 text-sm">
                            Le coût de votre <strong>endettement</strong> (intérêts payés). 
                            Négatif = vous payez des intérêts.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">Résultat exceptionnel</h4>
                          <p className="text-slate-600 text-sm">
                            Événements <strong>non récurrents</strong> : vente d&apos;actif, litige gagné, 
                            subvention. À ignorer pour analyser la tendance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mt-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-slate-800 font-medium mb-2">À retenir :</p>
                        <p className="text-slate-700">
                          Focalisez-vous sur le <strong>résultat d&apos;exploitation</strong>. 
                          S&apos;il est positif et croissant, votre activité est saine. 
                          Le reste est du &quot;bruit&quot; financier ou exceptionnel.
                        </p>
                      </div>
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
                    href="/fondamentaux/lire-bilan"
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Module précédent
                  </Link>
                  <Link
                    href="/fondamentaux/comprendre-cash-flow"
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
