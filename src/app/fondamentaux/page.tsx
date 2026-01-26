"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  TrendingUp,
  Calculator,
  MessageCircleQuestion,
  Banknote,
  GraduationCap,
  CheckCircle2,
  Clock,
  Target,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Configuration des modules fondamentaux
const fondamentaux = [
  {
    id: "lire-bilan",
    title: "Lire un bilan",
    description:
      "Décryptez votre bilan comptable : actif, passif, capitaux propres. Comprenez ce que vous possédez et comment c'est financé.",
    icon: FileText,
    color: "bg-blue-500",
    duration: "15 min",
    level: "Débutant",
    href: "/fondamentaux/lire-bilan",
    image: "/images/bilan-comptable.png",
    topics: [
      "Actif immobilisé vs circulant",
      "Capitaux propres et dettes",
      "Règle d'équilibre du bilan",
      "5 lignes clés à surveiller",
    ],
  },
  {
    id: "lire-compte-resultat",
    title: "Lire un compte de résultat",
    description:
      "Du chiffre d'affaires au résultat net : comprenez comment votre entreprise génère (ou perd) de l'argent.",
    icon: TrendingUp,
    color: "bg-emerald-500",
    duration: "12 min",
    level: "Débutant",
    href: "/fondamentaux/lire-compte-resultat",
    image: "/images/compte-resultat.png",
    topics: [
      "Structure en cascade",
      "Marge brute et marge nette",
      "Résultat d'exploitation vs financier",
      "Piège : Résultat ≠ Trésorerie",
    ],
  },
  {
    id: "comprendre-cash-flow",
    title: "Comprendre un cash-flow",
    description:
      "Maîtrisez les flux de trésorerie : pourquoi une entreprise rentable peut manquer de cash et comment l'éviter.",
    icon: Banknote,
    color: "bg-purple-500",
    duration: "15 min",
    level: "Intermédiaire",
    href: "/fondamentaux/comprendre-cash-flow",
    image: "/images/cash-flow-prev.png",
    topics: [
      "Cash-flow opérationnel",
      "Cash-flow d'investissement",
      "Cash-flow de financement",
      "Tableau des flux de trésorerie",
    ],
  },
  {
    id: "ratios-essentiels",
    title: "Les ratios essentiels",
    description:
      "Les 10 ratios financiers indispensables pour évaluer la santé de votre entreprise en 5 minutes.",
    icon: Calculator,
    color: "bg-orange-500",
    duration: "18 min",
    level: "Intermédiaire",
    href: "/fondamentaux/ratios-essentiels",
    image: "/images/ratios-financiers.png",
    topics: [
      "Ratios de liquidité",
      "Ratios d'endettement",
      "Ratios de rentabilité",
      "Ratios d'activité (DSO, DPO, rotation)",
    ],
  },
  {
    id: "questions-comptable",
    title: "Questions à poser à son comptable",
    description:
      "Les 15 questions essentielles à poser lors de la remise de vos comptes. Ne restez plus dans le flou.",
    icon: MessageCircleQuestion,
    color: "bg-rose-500",
    duration: "10 min",
    level: "Débutant",
    href: "/fondamentaux/questions-comptable",
    image: "/images/comptable-discussion.png",
    topics: [
      "Questions sur le bilan",
      "Questions sur le résultat",
      "Questions sur la trésorerie",
      "Red flags à détecter",
    ],
  },
];

export default function FondamentauxPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-24">
          {/* Background Image */}
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

          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-72 h-72 bg-accent-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
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
                <GraduationCap className="w-4 h-4 text-accent-primary" />
                <span className="text-sm text-white/90 font-medium">
                  Formation Finance pour Dirigeants
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Les Fondamentaux
                <span className="block text-accent-primary mt-2">
                  de la Finance d&apos;Entreprise
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Maîtrisez les bases comptables et financières en moins d&apos;une heure. 
                Des guides pratiques conçus pour les dirigeants, pas pour les comptables.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">5</div>
                  <div className="text-sm text-slate-400">Modules essentiels</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">~1h</div>
                  <div className="text-sm text-slate-400">Temps total</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">100%</div>
                  <div className="text-sm text-slate-400">Pratique</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#modules"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                >
                  Commencer la formation
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  href="/blog/lire-bilan-compte-resultat-guide-pratique"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <BookOpen className="w-5 h-5" />
                  Lire le guide complet
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Pourquoi maîtriser les fondamentaux ?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                80% des dirigeants de PME ne savent pas lire un bilan. 
                Ne soyez plus dépendant de votre comptable pour comprendre vos chiffres.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Benefit 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Prenez les bonnes décisions
                </h3>
                <p className="text-slate-600">
                  Comprenez l&apos;impact financier de vos choix stratégiques avant de les prendre.
                </p>
              </motion.div>

              {/* Benefit 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Détectez les problèmes tôt
                </h3>
                <p className="text-slate-600">
                  Repérez les signaux d&apos;alerte avant qu&apos;ils ne deviennent des crises.
                </p>
              </motion.div>

              {/* Benefit 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Dialoguez d&apos;égal à égal
                </h3>
                <p className="text-slate-600">
                  Posez les bonnes questions à votre comptable, banquier ou investisseur.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section id="modules" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                5 modules pour tout comprendre
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Chaque module est autonome et peut être lu indépendamment. 
                Commencez par celui qui correspond à votre besoin immédiat.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fondamentaux.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={module.href}
                    className="group block h-full bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Image Background Section */}
                    <div className="relative h-48 overflow-hidden bg-slate-900">
                      <Image
                        src={module.image}
                        alt={module.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/40 to-slate-900/70" />
                      
                      {/* Icon overlay on image */}
                      <div className="absolute top-4 left-4">
                        <div
                          className={`w-12 h-12 rounded-xl ${module.color} flex items-center justify-center shadow-lg`}
                        >
                          <module.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      {/* Level badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium rounded-full shadow-sm">
                          {module.level}
                        </span>
                      </div>

                      {/* Title on image */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                          {module.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{module.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                        {module.description}
                      </p>

                      {/* Topics */}
                      <div className="border-t border-slate-100 pt-4 mb-4">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                          Ce que vous apprendrez
                        </p>
                        <ul className="space-y-2">
                          {module.topics.map((topic, topicIndex) => (
                            <li
                              key={topicIndex}
                              className="flex items-start gap-2 text-sm text-slate-600"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-accent-primary font-semibold group-hover:gap-3 transition-all">
                        Commencer le module
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Path Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Parcours recommandé
                </h2>
                <p className="text-lg text-slate-600">
                  Si vous débutez, suivez cet ordre pour une progression logique
                </p>
              </div>

              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block" />

                {/* Steps */}
                <div className="space-y-8">
                  {fondamentaux.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative flex items-start gap-6"
                    >
                      {/* Number circle */}
                      <div
                        className={`relative z-10 w-16 h-16 rounded-full ${module.color} flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}
                      >
                        {index + 1}
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                              {module.title}
                            </h3>
                            <p className="text-slate-600 text-sm">
                              {module.description}
                            </p>
                          </div>
                          <Link
                            href={module.href}
                            className="flex items-center gap-1 text-accent-primary font-semibold text-sm hover:gap-2 transition-all whitespace-nowrap ml-4"
                          >
                            Lire
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <BookOpen className="w-4 h-4 text-accent-primary" />
                <span className="text-sm text-white/90 font-medium">
                  Prêt à aller plus loin ?
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Pilotez vos décisions financières avec méthode
              </h2>

              <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                Que vous ayez besoin de l'accompagnement d'un expert 
                ou de vous appuyer sur des agents IA décisionnels, FinSight vous aide à anticiper, arbitrer et décider au bon moment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/consulting"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                >
                  Prenez le contrôle de votre pilotage financier
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/agents"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary-hover transition-all duration-300 shadow-lg shadow-accent-primary/25"
                >
                  Découvrez nos agents IA décisionnels
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Explorer le blog
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Contactez-nous
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
