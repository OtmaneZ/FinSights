import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight, Calculator } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FINANCIAL_GLOSSARY, FinancialGlossaryEntry } from "@/lib/financialGlossary";

export const metadata: Metadata = {
  title: "Glossaire Finance PME 2026 - 50 définitions essentielles | FinSight",
  description:
    "DSO, BFR, EBITDA, WACC, EVA, covenant… 50 définitions claires avec formules et benchmarks pour dirigeants PME.",
  openGraph: {
    title: "Glossaire Finance PME 2026 - 50 définitions essentielles",
    description:
      "DSO, BFR, EBITDA, WACC, EVA, covenant… 50 définitions claires avec formules et benchmarks pour dirigeants PME.",
  },
};

// ─── Lien calculateur associé à certains termes ───
const CALCULATOR_LINKS: Record<string, string> = {
  DSO: "/calculateurs/dso",
  BFR: "/calculateurs/bfr",
  MARGE_BRUTE: "/calculateurs/marge",
  MARGE_NETTE: "/calculateurs/marge",
  EBITDA: "/calculateurs/ebitda",
  EBITDA_MARGIN: "/calculateurs/ebitda",
  ROI: "/calculateurs/roi",
  BURN_RATE: "/calculateurs/burn-rate",
  RUNWAY: "/calculateurs/burn-rate",
  CAC: "/calculateurs/cac-ltv",
  LTV: "/calculateurs/cac-ltv",
  SEUIL_RENTABILITE: "/calculateurs/seuil-rentabilite",
  POINT_MORT: "/calculateurs/seuil-rentabilite",
  MULTIPLE_EBITDA: "/calculateurs/valorisation",
};

// ─── Sections thématiques ───
const SECTIONS: {
  id: FinancialGlossaryEntry["category"];
  label: string;
  eyebrow: string;
  color: string;
}[] = [
  {
    id: "tresorerie",
    label: "Trésorerie",
    eyebrow: "LIQUIDITÉ · CASH · CYCLES",
    color: "bg-blue-500",
  },
  {
    id: "rentabilite",
    label: "Rentabilité",
    eyebrow: "MARGES · RÉSULTATS · VALEUR",
    color: "bg-emerald-500",
  },
  {
    id: "activite",
    label: "Activité",
    eyebrow: "CROISSANCE · CLIENTS · RH",
    color: "bg-orange-500",
  },
  {
    id: "financement",
    label: "Financement",
    eyebrow: "DETTE · CAPITAL · COVENANTS",
    color: "bg-purple-500",
  },
  {
    id: "valorisation",
    label: "Valorisation",
    eyebrow: "MULTIPLES · DCF · M&A",
    color: "bg-rose-500",
  },
];

// ─── Badges couleur pour les niveaux d'interprétation ───
const LEVEL_STYLES = {
  excellent: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  good: "bg-blue-50 text-blue-700 border border-blue-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  critical: "bg-red-50 text-red-700 border border-red-200",
};

const LEVEL_LABELS = {
  excellent: "✅ Excellent",
  good: "🔵 Correct",
  warning: "⚠️ Vigilance",
  critical: "🔴 Critique",
};

function TermCard({ entry }: { entry: FinancialGlossaryEntry }) {
  const calcLink = CALCULATOR_LINKS[entry.id];

  return (
    <article className="py-8 border-b border-gray-100 last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
        {calcLink && (
          <Link
            href={calcLink}
            className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:underline whitespace-nowrap flex-shrink-0"
          >
            <Calculator className="w-3.5 h-3.5" />
            Calculer →
          </Link>
        )}
      </div>

      <p className="text-gray-600 leading-relaxed mb-4">{entry.definition}</p>

      {entry.formula && (
        <div className="bg-gray-50 rounded-lg px-4 py-3 font-mono text-sm text-gray-700 border-l-2 border-emerald-500 mb-4">
          {entry.formula}
        </div>
      )}

      {entry.interpretation && (
        <div className="grid sm:grid-cols-2 gap-2 mb-4">
          {(
            Object.entries(entry.interpretation) as [
              keyof typeof LEVEL_STYLES,
              string
            ][]
          ).map(([level, text]) => (
            <div
              key={level}
              className={`rounded-lg px-3 py-2 text-xs leading-snug ${LEVEL_STYLES[level]}`}
            >
              <span className="font-semibold">{LEVEL_LABELS[level]}</span>
              <span className="block mt-0.5 text-gray-600">{text}</span>
            </div>
          ))}
        </div>
      )}

      {entry.example && (
        <p className="text-xs text-gray-500 italic">
          <span className="font-medium not-italic text-gray-600">Exemple : </span>
          {entry.example}
        </p>
      )}
    </article>
  );
}

export default function GlossairePage() {
  const termsByCategory = SECTIONS.map((section) => ({
    ...section,
    terms: Object.values(FINANCIAL_GLOSSARY).filter(
      (e) => e.category === section.id
    ),
  }));

  const totalTerms = Object.keys(FINANCIAL_GLOSSARY).length;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <p className="text-xs tracking-widest uppercase text-emerald-400 font-medium mb-4">
              FONDAMENTAUX · GLOSSAIRE
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5">
              Glossaire Finance PME
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {totalTerms} définitions essentielles avec formules, benchmarks et
              interprétations concrètes - conçues pour les dirigeants, pas pour
              les comptables.
            </p>
          </div>
        </section>

        {/* ── Navigation thématique sticky ── */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Sections thématiques ── */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-16 space-y-20">
          {termsByCategory.map((section) => (
            <section key={section.id} id={section.id}>
              {/* En-tête de section */}
              <div className="mb-8">
                <p className="text-xs tracking-widest uppercase text-emerald-600 font-medium mb-1">
                  {section.eyebrow}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-1 h-8 rounded-full ${section.color}`}
                  />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {section.label}
                  </h2>
                  <span className="ml-auto text-sm text-gray-400">
                    {section.terms.length} terme
                    {section.terms.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Termes */}
              <div>
                {section.terms.map((term) => (
                  <TermCard key={term.id} entry={term} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* ── CTA bas de page ── */}
        <section className="bg-slate-900 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white/90 font-medium">
                Aller plus loin que les définitions
              </span>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Vous voulez aller plus loin que les définitions ?
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Score FinSight™ - diagnostic 4 piliers sur vos données réelles.
              Trésorerie, rentabilité, activité, financement : obtenez une
              lecture instantanée de la santé financière de votre entreprise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/mon-diagnostic"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg"
              >
                Lancer mon diagnostic
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/fondamentaux"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
              >
                Voir les modules fondamentaux
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
