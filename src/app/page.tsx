"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Zap,
  DollarSign,
  BarChart3,
  AlertTriangle,
  Linkedin,
  Calendar,
  ArrowRight,
  TrendingUp,
  Target,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import NewsletterPopup from "@/components/NewsletterPopup";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Pourquoi faire appel à un DAF externalisé pour sa PME ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un DAF externalisé apporte l'expertise stratégique d'un directeur financier senior sans le coût d'un recrutement fixe. Il aide les dirigeants de PME (1-100M€ CA) à sécuriser leur trésorerie, optimiser leurs marges et piloter leur croissance avec des données fiables.",
      },
    },
    {
      "@type": "Question",
      name: "Qu'est-ce que le Score FinSight™ ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le Score FinSight™ est un indicateur exclusif de santé financière noté sur 100. Il analyse 4 piliers critiques de votre entreprise : Cash, Marges, Résilience et Risques, pour vous permettre de décider avec 3 mois d'avance.",
      },
    },
    {
      "@type": "Question",
      name: "Comment se déroule un diagnostic financier avec FinSight ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le diagnostic débute par un échange gratuit de 30 minutes pour identifier vos enjeux. Nous réalisons ensuite un audit flash en 5 jours pour détecter vos fuites de cash et établir un plan d'action immédiat avec 3 recommandations chiffrées.",
      },
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      <NewsletterPopup />

      {/* HERO */}
      <section className="relative bg-slate-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,120,212,0.08)_0%,_transparent_60%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 lg:pt-44 lg:pb-36">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="space-y-10">
              <FadeIn delay={0.1} direction="none">
                <span className="inline-block text-accent-primary text-sm font-medium tracking-widest uppercase">
                  Direction Financière Externalisée
                </span>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h1 className="font-serif text-5xl lg:text-7xl font-medium leading-[1.05] tracking-tight text-white">
                  Décidez avec
                  <br />
                  trois mois d&apos;avance.
                </h1>
              </FadeIn>

              <FadeIn delay={0.35}>
                <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
                  Structurez votre pilotage financier, anticipez vos décisions
                  et sécurisez votre croissance.{" "}
                  <span className="text-gray-300">
                    Pour dirigeants PME ambitieux, de 1M€ à 100M€.
                  </span>
                </p>
              </FadeIn>

              <FadeIn delay={0.45}>
                <p className="text-sm text-gray-500 leading-relaxed max-w-lg border-l border-gray-700 pl-4">
                  Vision cash à 90 jours · Marges réelles par activité ·
                  Scénarios de croissance simulés avant décision
                </p>
              </FadeIn>

              <FadeIn delay={0.55}>
                <div className="flex flex-col sm:flex-row items-start gap-6 pt-2">
                  <a
                    href="https://calendly.com/zineinsight"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 text-base font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300"
                  >
                    Réserver un échange stratégique
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span>30 min · Confidentiel · Sans engagement</span>
                  </div>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.3} direction="none" className="relative lg:block hidden">
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/images/moi-bureau.png"
                  alt="Otmane Boulahia - Direction Financière Externalisée"
                  width={600}
                  height={500}
                  className="object-cover w-full"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-white font-medium">Otmane Boulahia</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Finance &amp; Stratégie Data · 10+ ans d&apos;expertise
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
      </section>

      {/* SCORE FINSIGHT */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="bg-white rounded-2xl p-10 lg:p-14 border border-gray-200 shadow-sm">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-slate-950 flex items-center justify-center">
                    <span className="text-white font-serif text-4xl font-medium">72</span>
                  </div>
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="font-serif text-3xl lg:text-4xl font-medium text-gray-900 mb-3">
                    Score FinSight™
                  </h2>
                  <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
                    Votre santé financière en un chiffre. Quatre piliers analysés
                    — Cash, Marges, Résilience, Risques — pour un diagnostic
                    objectif et des décisions éclairées.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm flex-shrink-0">
                  {["Cash", "Marges", "Résilience", "Risques"].map((pillar) => (
                    <div
                      key={pillar}
                      className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-700 font-medium"
                    >
                      {pillar}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PRE-DIAGNOSTIC */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <span className="text-accent-primary text-sm font-medium tracking-widest uppercase">
              Pré-diagnostic stratégique
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-medium text-gray-900 mt-4 mb-5">
              Mesurez votre performance{" "}
              <span className="text-accent-primary">avant de décider</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Les mêmes outils que nous utilisons en mission DAF. Obtenez un
              premier niveau de lecture de votre situation financière.
            </p>
            <p className="text-base text-gray-400 max-w-xl mx-auto mt-4 italic">
              Beaucoup de dirigeants pensent piloter correctement leur cash…
              jusqu&apos;à ce qu&apos;on mette les chiffres en face.
            </p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" staggerDelay={0.15}>
            <StaggerItem>
              <Link
                href="/calculateurs/dso"
                className="group block bg-white rounded-xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-gray-600" />
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full uppercase tracking-wide">
                    Délai de paiement
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-accent-primary transition-colors">
                  Analyse DSO
                </h3>
                <p className="text-gray-500 mb-6 leading-relaxed text-sm">
                  Évaluez votre délai moyen d&apos;encaissement. Benchmark sectoriel,
                  interprétation et leviers d&apos;optimisation identifiés.
                </p>
                <span className="inline-flex items-center gap-2 text-accent-primary font-medium text-sm">
                  Lancer l&apos;analyse
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </StaggerItem>

            <StaggerItem>
              <Link
                href="/calculateurs/bfr"
                className="group block bg-white rounded-xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-gray-600" />
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full uppercase tracking-wide">
                    Fonds de roulement
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-accent-primary transition-colors">
                  Analyse BFR
                </h3>
                <p className="text-gray-500 mb-6 leading-relaxed text-sm">
                  Quantifiez votre Besoin en Fonds de Roulement. Stocks,
                  créances, dettes analysés. Pistes de déblocage de cash.
                </p>
                <span className="inline-flex items-center gap-2 text-accent-primary font-medium text-sm">
                  Lancer l&apos;analyse
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/bureau-nuit.png"
                  alt="Bureau Otmane Boulahia - Workspace"
                  width={600}
                  height={400}
                  className="object-cover w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-white/70 text-sm italic">
                    &quot;Là où vos données deviennent des décisions&quot;
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="space-y-8">
                <div>
                  <span className="text-accent-primary text-sm font-medium tracking-widest uppercase">
                    Votre expert
                  </span>
                  <h2 className="font-serif text-4xl font-medium text-gray-900 mt-3 mb-2">
                    Otmane Boulahia
                  </h2>
                  <p className="text-lg text-gray-500">
                    Direction Financière &amp; Stratégie Data
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "−28 jours", label: "DSO réduit · PME Services" },
                    { value: "+340k€", label: "Cash libéré · PME BTP" },
                    { value: "+6 pts", label: "Marge nette · Groupe 500M€" },
                    { value: "50+", label: "Dirigeants accompagnés" },
                  ].map((metric) => (
                    <div
                      key={metric.value}
                      className="p-4 bg-white rounded-lg border border-gray-200"
                    >
                      <p className="font-semibold text-gray-900 text-xl leading-tight">
                        {metric.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{metric.label}</p>
                    </div>
                  ))}
                </div>

                <blockquote className="border-l-2 border-gray-300 pl-6 py-2">
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-medium">
                      &quot;Un dirigeant ne devrait jamais prendre une décision
                      stratégique sans vision claire de son cash à 90 jours.&quot;
                    </span>
                  </p>
                  <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                    Ma mission : structurer votre pilotage financier pour que
                    chaque décision s&apos;appuie sur des données fiables — avec la
                    rigueur d&apos;un cabinet d&apos;audit et la réactivité d&apos;un expert terrain.
                  </p>
                </blockquote>

                <a
                  href="https://www.linkedin.com/in/otmane-boulahia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent-primary transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  Voir le profil LinkedIn
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* OFFRES */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl font-medium text-gray-900 mb-5">
              Une méthode structurée,{" "}
              <span className="text-accent-primary">des résultats mesurables</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Deux niveaux d&apos;accompagnement selon votre maturité financière
            </p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 gap-8" staggerDelay={0.2}>
            <StaggerItem>
              <div className="relative bg-white rounded-xl p-8 lg:p-10 border border-accent-primary/30 shadow-sm h-full flex flex-col">
                <div className="absolute -top-3 left-8">
                  <span className="px-3 py-1 bg-accent-primary text-white text-xs font-medium rounded-full tracking-wide">
                    Recommandé
                  </span>
                </div>

                <div className="mt-2 mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Audit &amp; Pilotage
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    Une lecture claire et fiable de votre situation financière.
                    Score FinSight™, plan d&apos;action chiffré et cadre de pilotage durable.
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Score FinSight™ (0-100) + benchmark sectoriel
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Analyse cash, marges, risques cachés
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Plan d&apos;action chiffré en 5 jours
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Tableau de bord personnalisé
                  </li>
                </ul>

                <div className="pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">À partir de</p>
                  <p className="text-3xl font-semibold text-gray-900 mb-5">1 990€</p>
                  <Link
                    href="/consulting"
                    className="block w-full px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-medium text-center transition-all duration-200"
                  >
                    Découvrir l&apos;accompagnement
                  </Link>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-slate-950 rounded-xl p-8 lg:p-10 border border-gray-800 h-full flex flex-col">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    Pilotage Augmenté
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    Prolongez votre audit avec un monitoring continu. 3 agents IA
                    spécialisés surveillent votre trésorerie, vos marges et vos
                    scénarios — en temps réel.
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-accent-primary rounded-full flex-shrink-0" />
                    <span><span className="text-white font-medium">TRESORIS</span> — Surveillance trésorerie</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-accent-primary rounded-full flex-shrink-0" />
                    <span><span className="text-white font-medium">MARGIS</span> — Rentabilité réelle</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-accent-primary rounded-full flex-shrink-0" />
                    <span><span className="text-white font-medium">SCENARIS</span> — Scénarios what-if</span>
                  </li>
                </ul>

                <div className="pt-6 border-t border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Investissement</p>
                  <p className="text-2xl font-semibold text-white mb-5">
                    Sur mesure
                    <span className="text-sm text-gray-500 font-normal ml-2">· Extension Audit</span>
                  </p>
                  <Link
                    href="/agents"
                    className="block w-full px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg font-medium text-center transition-all duration-200"
                  >
                    Explorer le pilotage augmenté
                  </Link>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl font-medium text-gray-900 mb-5">
              Ils pilotent mieux,{" "}
              <span className="text-accent-primary">ils témoignent</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Ce que disent les dirigeants qui ont structuré leur pilotage financier
            </p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            <StaggerItem>
              <div className="bg-white rounded-xl p-8 border border-gray-200 h-full flex flex-col">
                <span className="text-5xl text-gray-200 font-serif leading-none mb-4">&ldquo;</span>
                <p className="text-gray-600 leading-relaxed text-sm flex-1">
                  Nous disposons désormais d&apos;un cadre de pilotage financier
                  fiable et homogène, aligné avec nos enjeux métiers et
                  utilisable au quotidien.
                </p>
                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500 font-medium text-sm">DA</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Directrice Administrative</p>
                    <p className="text-xs text-gray-500">Groupe Formation (500M€)</p>
                  </div>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white rounded-xl p-8 border border-gray-200 h-full flex flex-col">
                <span className="text-5xl text-gray-200 font-serif leading-none mb-4">&ldquo;</span>
                <p className="text-gray-600 leading-relaxed text-sm flex-1">
                  Nous avons enfin une vision exploitable de nos chantiers, du
                  cash et des marges, ce qui nous permet d&apos;arbitrer rapidement
                  et d&apos;agir là où c&apos;est nécessaire.
                </p>
                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500 font-medium text-sm">LB</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Dirigeant</p>
                    <p className="text-xs text-gray-500">PME BTP / Services (7M€)</p>
                  </div>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white rounded-xl p-8 border border-gray-200 h-full flex flex-col">
                <span className="text-5xl text-gray-200 font-serif leading-none mb-4">&ldquo;</span>
                <p className="text-gray-600 leading-relaxed text-sm flex-1">
                  Le travail réalisé a permis de structurer un cadre de
                  pilotage robuste et automatisé, avec des indicateurs
                  exploitables en comité de direction.
                </p>
                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500 font-medium text-sm">MC</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">CFO</p>
                    <p className="text-xs text-gray-500">PME Services / Conseil</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-36 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/vue-NY.png"
            alt=""
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif text-4xl lg:text-6xl font-medium text-white mb-8 leading-tight">
              Et si vous décidiez
              <br />
              avec trois mois d&apos;avance ?
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
              Un échange stratégique de 30 minutes pour identifier vos leviers
              immédiats : cash, marges, risques cachés.
            </p>
          </FadeIn>

          <FadeIn delay={0.35}>
            <a
              href="https://calendly.com/zineinsight"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              Réserver un échange stratégique
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </FadeIn>

          <FadeIn delay={0.45}>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mt-10">
              <span>Réponse sous 24h</span>
              <span className="text-gray-700">·</span>
              <span>100% confidentiel</span>
              <span className="text-gray-700">·</span>
              <span>PME de 1M€ à 100M€</span>
            </div>
          </FadeIn>
        </div>
      </section>

      <StructuredData data={faqSchema} />
      <Footer />
    </div>
  );
}
