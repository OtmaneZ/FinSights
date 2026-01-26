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
  HelpCircle,
  Target,
  MessageCircle,
  TrendingUp,
  Shield,
  AlertTriangle,
  Calendar,
  FileText,
  PiggyBank,
  Users,
  Scale,
  Lightbulb
} from 'lucide-react';

export default function QuestionsComptablePage() {
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
              <HelpCircle className="w-4 h-4" />
              Module 5 sur 5
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Les Questions à Poser à <span className="text-emerald-400">Votre Comptable</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 mb-8 max-w-2xl"
          >
            30 questions essentielles pour transformer votre relation comptable 
            en véritable partenariat stratégique. Passez du reporting subi au pilotage actif.
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
              <span>15 min de lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <span>Niveau débutant</span>
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
                'Questions mensuelles indispensables',
                'Questions de clôture annuelle',
                'Questions fiscales et optimisation',
                'Questions sur le BFR et la trésorerie',
                'Questions stratégiques pour grandir',
                'Ce que votre comptable devrait vous dire'
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
              Votre comptable ou expert-comptable détient une mine d&apos;informations sur votre entreprise. 
              Mais sans les bonnes questions, vous n&apos;obtiendrez que des déclarations fiscales 
              et un bilan annuel. Voici comment extraire de la vraie valeur de cette relation.
            </p>

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-800 mb-2">
                    Le bon réflexe
                  </p>
                  <p className="text-blue-700">
                    Planifiez un RDV mensuel de 30 minutes avec votre comptable. 
                    Pas pour valider des factures, mais pour piloter. 
                    Préparez vos questions à l&apos;avance.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 1: Questions Mensuelles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Questions Mensuelles
              </h2>
            </div>

            <p className="text-slate-600 mb-8">
              À poser chaque mois pour garder le contrôle de votre activité.
            </p>

            <div className="space-y-4">
              {[
                {
                  question: "Quel est mon résultat du mois ? Et cumulé depuis janvier ?",
                  pourquoi: "Base du pilotage. Comparez au budget et à N-1.",
                  icon: TrendingUp
                },
                {
                  question: "Ma marge brute a-t-elle évolué ? Pourquoi ?",
                  pourquoi: "Détecte les dérives de coûts ou de prix de vente.",
                  icon: TrendingUp
                },
                {
                  question: "Quel est le solde de ma trésorerie et son évolution sur 30 jours ?",
                  pourquoi: "Anticipe les tensions. Cash is king.",
                  icon: PiggyBank
                },
                {
                  question: "Y a-t-il des factures clients en retard ? Lesquelles ?",
                  pourquoi: "Le DSO se gère au quotidien, pas en fin d'année.",
                  icon: FileText
                },
                {
                  question: "Ai-je des fournisseurs que j'ai payé en retard ?",
                  pourquoi: "Préserve les relations et évite les pénalités.",
                  icon: Users
                },
                {
                  question: "Y a-t-il des écarts significatifs avec le budget prévu ?",
                  pourquoi: "Permet de réagir vite, pas de subir en fin d'année.",
                  icon: AlertTriangle
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">
                        &ldquo;{item.question}&rdquo;
                      </p>
                      <p className="text-sm text-slate-500">
                        <strong>Pourquoi :</strong> {item.pourquoi}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 2: Questions Annuelles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Questions de Clôture Annuelle
              </h2>
            </div>

            <p className="text-slate-600 mb-8">
              À poser avant et après la clôture des comptes.
            </p>

            <div className="space-y-4">
              {[
                {
                  question: "Quels sont les 3 points forts et les 3 points faibles de mes comptes cette année ?",
                  pourquoi: "Synthèse stratégique que peu de dirigeants demandent.",
                  icon: Target
                },
                {
                  question: "Ma structure de coûts est-elle cohérente avec mon secteur ?",
                  pourquoi: "Détecte les postes où vous sur-dépensez.",
                  icon: Scale
                },
                {
                  question: "Y a-t-il des provisions ou dépréciations à anticiper ?",
                  pourquoi: "Évite les mauvaises surprises de dernière minute.",
                  icon: AlertTriangle
                },
                {
                  question: "Quel est mon taux de charges externes vs CA ? Est-il stable ?",
                  pourquoi: "Les frais généraux ont tendance à dériver silencieusement.",
                  icon: TrendingUp
                },
                {
                  question: "Ma capacité d'autofinancement est-elle suffisante pour mes projets ?",
                  pourquoi: "Valide si vous pouvez investir sans vous endetter.",
                  icon: PiggyBank
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">
                        &ldquo;{item.question}&rdquo;
                      </p>
                      <p className="text-sm text-slate-500">
                        <strong>Pourquoi :</strong> {item.pourquoi}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 3: Questions Fiscales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Scale className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Questions Fiscales et Optimisation
              </h2>
            </div>

            <p className="text-slate-600 mb-8">
              L&apos;optimisation fiscale est légale et fait partie du rôle de conseil de votre expert-comptable.
            </p>

            <div className="space-y-4">
              {[
                {
                  question: "Quelle est ma charge fiscale globale (IS + charges sociales dirigeant) ?",
                  pourquoi: "Vision complète avant d'optimiser.",
                  icon: Scale
                },
                {
                  question: "Est-il plus intéressant de me verser un salaire ou des dividendes cette année ?",
                  pourquoi: "L'optimum change selon le résultat et votre situation personnelle.",
                  icon: PiggyBank
                },
                {
                  question: "Y a-t-il des crédits d'impôt ou aides auxquels je suis éligible ?",
                  pourquoi: "CIR, CII, aides régionales... souvent oubliés.",
                  icon: FileText
                },
                {
                  question: "Dois-je provisionner quelque chose pour réduire mon résultat imposable ?",
                  pourquoi: "Provisions pour risques, dépréciation de créances douteuses, etc.",
                  icon: AlertTriangle
                },
                {
                  question: "Mon statut juridique est-il toujours adapté à mon activité ?",
                  pourquoi: "SARL vs SAS, holding, option IS... à revoir régulièrement.",
                  icon: Target
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">
                        &ldquo;{item.question}&rdquo;
                      </p>
                      <p className="text-sm text-slate-500">
                        <strong>Pourquoi :</strong> {item.pourquoi}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 4: Questions BFR/Trésorerie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Questions BFR et Trésorerie
              </h2>
            </div>

            <p className="text-slate-600 mb-8">
              La trésorerie, c&apos;est l&apos;oxygène. Ces questions vous évitent l&apos;asphyxie.
            </p>

            <div className="space-y-4">
              {[
                {
                  question: "Quel est mon délai moyen de paiement clients (DSO) ?",
                  pourquoi: "Chaque jour gagné = trésorerie en plus.",
                  icon: Clock
                },
                {
                  question: "Quels clients me paient systématiquement en retard ?",
                  pourquoi: "Ciblez vos relances, négociez ou refusez les commandes.",
                  icon: Users
                },
                {
                  question: "Mon BFR augmente-t-il plus vite que mon CA ?",
                  pourquoi: "Signal d'une croissance qui s'essouffle.",
                  icon: AlertTriangle
                },
                {
                  question: "Ai-je une ligne de crédit court terme non utilisée ?",
                  pourquoi: "Sécurise les pics de BFR.",
                  icon: Shield
                },
                {
                  question: "À quel moment de l'année ma trésorerie est-elle la plus tendue ?",
                  pourquoi: "Anticipez (vacances, saisonnalité, paiements annuels).",
                  icon: Calendar
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">
                        &ldquo;{item.question}&rdquo;
                      </p>
                      <p className="text-sm text-slate-500">
                        <strong>Pourquoi :</strong> {item.pourquoi}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 5: Questions Stratégiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-rose-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Questions Stratégiques
              </h2>
            </div>

            <p className="text-slate-600 mb-8">
              Pour préparer vos décisions de croissance, d&apos;investissement ou de cession.
            </p>

            <div className="space-y-4">
              {[
                {
                  question: "Si je voulais vendre mon entreprise, quelle valorisation approximative ?",
                  pourquoi: "Donne une perspective, même sans projet de cession.",
                  icon: TrendingUp
                },
                {
                  question: "Puis-je me permettre d'embaucher ? Quel impact sur ma rentabilité ?",
                  pourquoi: "Simulation avant engagement (charges = 1.5x salaire brut).",
                  icon: Users
                },
                {
                  question: "Si j'investis 100k€, en combien de temps puis-je le rembourser ?",
                  pourquoi: "Calcul de la capacité de remboursement.",
                  icon: PiggyBank
                },
                {
                  question: "Quelle est ma capacité d'endettement supplémentaire ?",
                  pourquoi: "Prépare les dossiers bancaires.",
                  icon: Shield
                },
                {
                  question: "Quels KPIs devrais-je suivre mensuellement ?",
                  pourquoi: "Votre comptable connaît votre secteur et vos enjeux.",
                  icon: Target
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">
                        &ldquo;{item.question}&rdquo;
                      </p>
                      <p className="text-sm text-slate-500">
                        <strong>Pourquoi :</strong> {item.pourquoi}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 6: Ce que votre comptable devrait vous dire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Ce que votre comptable devrait vous dire (sans que vous demandiez)
            </h2>

            <p className="text-slate-600 mb-8">
              Un bon expert-comptable est proactif. S&apos;il ne vous alerte jamais sur ces points, 
              posez-vous des questions sur la qualité du conseil.
            </p>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    titre: "Alertes de trésorerie",
                    description: "Prévision à 3 mois et signaux de tension"
                  },
                  {
                    titre: "Échéances fiscales",
                    description: "Rappels et montants estimés"
                  },
                  {
                    titre: "Dérive des charges",
                    description: "Postes qui augmentent anormalement"
                  },
                  {
                    titre: "Opportunités d'optimisation",
                    description: "Crédits d'impôt, aides, montages"
                  },
                  {
                    titre: "Ratios dégradés",
                    description: "Alertes sur les indicateurs clés"
                  },
                  {
                    titre: "Comparaison sectorielle",
                    description: "Votre positionnement vs concurrents"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-white">{item.titre}</p>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Warning Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-800 mb-2">
                    Signes d&apos;un accompagnement insuffisant
                  </p>
                  <ul className="text-amber-700 space-y-2">
                    <li>• Vous ne recevez vos chiffres qu&apos;une fois par an (au bilan)</li>
                    <li>• Votre comptable ne vous a jamais proposé d&apos;optimisation</li>
                    <li>• Vous découvrez votre IS en dernière minute</li>
                    <li>• Aucun tableau de bord ou situation intermédiaire</li>
                    <li>• Jamais de benchmark ou comparaison sectorielle</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Takeaways */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">À retenir</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <p className="text-emerald-50">
                    <strong className="text-white">RDV mensuel de 30 min</strong> : 
                    Instituez un rituel de pilotage, pas de validation
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <p className="text-emerald-50">
                    <strong className="text-white">Préparez vos questions</strong> : 
                    Envoyez-les en amont pour des réponses précises
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <p className="text-emerald-50">
                    <strong className="text-white">Exigez du conseil</strong> : 
                    La conformité c&apos;est le minimum, le conseil c&apos;est la valeur ajoutée
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <p className="text-emerald-50">
                    <strong className="text-white">Formez-vous</strong> : 
                    Plus vous comprenez, meilleures sont vos questions
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
            className="flex flex-col sm:flex-row justify-between gap-4 mb-12"
          >
            <Link 
              href="/fondamentaux/ratios-essentiels"
              className="flex items-center gap-3 px-6 py-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
              <div>
                <p className="text-sm text-slate-500">Module précédent</p>
                <p className="font-semibold text-slate-900">Les ratios essentiels</p>
              </div>
            </Link>
            <Link 
              href="/fondamentaux"
              className="flex items-center gap-3 px-6 py-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all group"
            >
              <div className="text-right">
                <p className="text-sm text-slate-400">Formation terminée</p>
                <p className="font-semibold">Retour aux fondamentaux</p>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* CTA Final */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-2xl p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-6">
              <MessageCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Besoin d&apos;un copilote financier ?
            </h2>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">
              Nos agents IA analysent vos données comptables et vous alertent 
              automatiquement sur les points de vigilance. Comme un DAF, mais 24/7.
            </p>
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
            >
              Découvrir nos agents IA
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
