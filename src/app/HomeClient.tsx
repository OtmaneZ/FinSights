"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Linkedin,
  Calendar,
  ArrowRight,
  BarChart3,
  Layers,
  Briefcase,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import NewsletterPopup from "@/components/NewsletterPopup";
import FadeIn, { StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";
import CinematicHero from "@/components/landing/CinematicHero";
import CalculatorsHubGrid from "@/components/landing/CalculatorsHubGrid";
import LatestResourcesBlock from "@/components/landing/LatestResourcesBlock";

export default function HomeClient() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />

      {/* Section 1 - Hero */}
      <CinematicHero />

      {/* Section 1b - Ce que je livre */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <span className="text-accent-primary text-sm font-medium tracking-widest uppercase">
              Missions techniques
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-gray-900 mt-4">
              Ce que je livre
            </h2>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {[
              {
                title: "Audit Power BI",
                desc: "Audit complet d'un modèle existant. Mesures DAX, relations, performance, fiabilité.",
                detail: "5 jours ouvrés · Forfait 2 490€ HT",
                icon: BarChart3,
              },
              {
                title: "Modélisation",
                desc: "Construction d'un modèle de données financier mono ou multi-entités. Power Query, DAX, connecteurs.",
                detail: "2–4 semaines · Sur devis",
                icon: Layers,
                featured: true,
              },
              {
                title: "Mission longue",
                desc: "Régie au jour pour missions de 2 semaines à 3 mois. Stack Power BI + Python + SQL.",
                detail: "TJM 700€ HT via Malt",
                icon: Briefcase,
              },
            ].map((card) => (
              <StaggerItem key={card.title}>
                <div className={`rounded-xl p-8 border h-full flex flex-col ${card.featured ? "border-accent-primary/40 bg-slate-50 shadow-sm" : "border-gray-200 bg-white"}`}>
                  <card.icon className="w-8 h-8 text-accent-primary mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">{card.desc}</p>
                  <p className="text-sm font-medium text-gray-900 mt-6 pt-4 border-t border-gray-100">{card.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Section 2 - Grille calculateurs */}
      <CalculatorsHubGrid />

      {/* Section 3 - Score FinSight™ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn className="text-center mb-10 lg:mb-12">
            <span className="text-accent-primary text-sm font-medium tracking-widest uppercase">
              DIAGNOSTIC COMPLET · 49€
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-gray-900 mt-4 mb-5">
              Score FinSight™ - votre santé financière en un chiffre
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
              Quatre piliers analysés - Cash, Marges, Résilience, Risques.
              Diagnostic objectif, recommandations IA, rapport 6 pages.
            </p>
          </FadeIn>

          <FadeIn>
            <div className="bg-white rounded-2xl p-10 lg:p-14 border border-gray-200 shadow-sm">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-slate-950 flex items-center justify-center">
                    <span className="text-white font-serif text-4xl font-medium">72</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm flex-shrink-0 max-w-[280px]">
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

              <div className="mt-10 flex flex-col items-center">
                <Link
                  href="/mon-diagnostic"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-white font-semibold text-center transition-all duration-200"
                >
                  Lancer mon Score FinSight™
                </Link>
                <p className="text-sm text-gray-500 mt-3">
                  49€ · Résultat en 7 minutes · PDF complet par email
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 4 - Ressources */}
      <LatestResourcesBlock />

      {/* Section 5 - Profil expert */}
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
                    Consultant BI Finance · Master 2 Finance + stack data moderne
                  </p>
                </div>

                <div className="p-6 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-accent-primary uppercase tracking-wider mb-2">
                    Mission récente
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Audit Power BI d&apos;un réseau multisites de 30 sites : 80 mesures DAX auditées,
                    11 anomalies structurelles identifiées, rapport technique livré.
                  </p>
                </div>

                <blockquote className="border-l-2 border-gray-300 pl-6 py-2">
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-medium">
                      &quot;Un dashboard qui marche depuis 3 ans peut cacher 10 anomalies invisibles.
                      Le BI n&apos;est pas un livrable graphique — c&apos;est une infrastructure qui doit tenir.&quot;
                    </span>
                  </p>
                  <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                    J&apos;interviens sur l&apos;audit, la modélisation et l&apos;automatisation —
                    avec la rigueur d&apos;un rapport technique, pas d&apos;un coaching dirigeant.
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

      {/* Section 6 - Offres */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <span className="text-accent-primary text-sm font-medium tracking-widest uppercase">
              FORFAITS TECHNIQUES
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-medium text-gray-900 mt-4 mb-5">
              Trois façons de travailler ensemble
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Audit packagé, modélisation sur devis ou mission longue en régie
            </p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            <StaggerItem>
              <div className="rounded-xl p-8 border border-gray-200 h-full flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Audit Power BI</h3>
                <p className="text-sm text-gray-500 mb-4">Auditer un modèle existant</p>
                <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                  Audit complet du modèle .pbix, analyse DAX, relations, performance.
                  Rapport technique + restitution 1h. Livré en 5 jours ouvrés.
                </p>
                <p className="text-2xl font-semibold text-gray-900 mt-6">2 490€ HT</p>
                <Link href="/consulting" className="mt-4 text-sm font-medium text-accent-primary hover:underline">
                  En savoir plus →
                </Link>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="relative rounded-xl p-8 border border-accent-primary/40 bg-slate-50 h-full flex flex-col">
                <span className="absolute -top-3 left-6 px-3 py-1 bg-accent-primary text-white text-xs font-medium rounded-full">Recommandé</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-1 mt-2">Modélisation Power BI</h3>
                <p className="text-sm text-gray-500 mb-4">Construire un modèle from scratch</p>
                <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                  Cadrage, modèle dimensionnel, mesures DAX documentées, connecteurs Sage/Cegid/FEC.
                  Livré en 2 à 4 semaines.
                </p>
                <p className="text-2xl font-semibold text-gray-900 mt-6">Sur devis</p>
                <Link href="/consulting" className="mt-4 text-sm font-medium text-accent-primary hover:underline">
                  En savoir plus →
                </Link>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-xl p-8 border border-gray-200 h-full flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Mission longue</h3>
                <p className="text-sm text-gray-500 mb-4">Régie au jour via Malt</p>
                <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                  Missions de 2 semaines à 3 mois : audit, modélisation, pipeline Python,
                  transfert de compétences.
                </p>
                <p className="text-2xl font-semibold text-gray-900 mt-6">700€ HT / jour</p>
                <a href="https://www.malt.fr/" target="_blank" rel="noopener noreferrer" className="mt-4 text-sm font-medium text-accent-primary hover:underline">
                  Profil Malt →
                </a>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Section 7 - Mission de référence */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <span className="text-accent-primary text-sm font-medium tracking-widest uppercase">
              Étude de cas
            </span>
            <h2 className="font-serif text-4xl font-medium text-gray-900 mt-4 mb-4">
              Mission de référence
            </h2>
            <p className="text-gray-500">Réseau multisites santé animale (client anonymisé — Fovéa)</p>
          </FadeIn>
          <FadeIn>
            <div className="bg-white rounded-2xl p-8 lg:p-10 border border-gray-200 space-y-6">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Problématique</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Modèle Power BI consolidé existant. Doutes sur la fiabilité des mesures, performance dégradante,
                  dépendance à une manipulation manuelle mensuelle.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Solution</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Audit complet : 20 tables, 80 mesures DAX, 16 requêtes Power Query, 9 relations.
                  Extraction via pbixray (Python). Rapport technique structuré.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Résultat</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  11 anomalies structurelles identifiées : clé composite fragile, 8 colonnes calculées en O(n²) (boucles EARLIER),
                  doublons de mesures confirmés, RLS inopérant en local. Plan de remédiation par ordre de priorité.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Audit Power BI', 'DAX', 'Multi-sites'].map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 8 - CTA final */}
      <section className="py-36 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/vue-NY.png" alt="" fill className="object-cover opacity-10" />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif text-4xl lg:text-5xl font-medium text-white mb-8 leading-tight">
              Un modèle Power BI à auditer ?
            </h2>
            <p className="text-lg text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
              15 minutes pour cadrer votre contexte technique — sans engagement.
            </p>
            <a
              href="https://calendly.com/zineinsight/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              Demander un audit Power BI
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
      <NewsletterPopup />
      <ExitIntentPopup />
    </div>
  );
}
