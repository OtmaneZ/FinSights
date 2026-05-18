'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { Building2, CheckCircle, AlertCircle, ArrowRight, Info } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { generateHowToJsonLd } from '@/lib/seo'
import { trackCalculatorUse } from '@/lib/analytics'
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory'
import EmailCaptureModal from '@/components/EmailCaptureModal'
import PremiumUpsellCard from '@/components/PremiumUpsellCard'
import EbitdaQuartileBar from '@/components/benchmarks/EbitdaQuartileBar'
import NafInput from '@/components/NafInput'
import type { NafResolutionResult } from '@/lib/benchmarks/nafResolver'
import {
    getBenchmarkBySecteur,
    getInterpretationEbitda,
    getPositionnementEbitda,
    getSecteurLabels,
} from '@/lib/benchmarks/bdf-sectoriels'
import {
    EBITDA_FORMULA_CANONICAL,
    EBITDA_FORMULA_TOP_DOWN_PME,
    EBITDA_NOTE_TOP_DOWN,
} from '@/lib/ebitdaFormula'

const SECTEUR_OPTIONS = getSecteurLabels()
const DEFAULT_SECTEUR = SECTEUR_OPTIONS.includes('Tech & Informatique')
    ? 'Tech & Informatique'
    : SECTEUR_OPTIONS[0] ?? 'Industrie'

export default function CalculateurEBITDA() {
    const [ca, setCA] = useState('')
    const [achats, setAchats] = useState('')
    const [chargesExternes, setChargesExternes] = useState('')
    const [impotsTaxes, setImpotsTaxes] = useState('')
    const [chargesPersonnel, setChargesPersonnel] = useState('')
    const [dotations, setDotations] = useState('')
    const [secteur, setSecteur] = useState(DEFAULT_SECTEUR)
    const [useNafInput, setUseNafInput] = useState(false)
    const [nafResolution, setNafResolution] = useState<NafResolutionResult | null>(null)
    const [result, setResult] = useState<{ ebitda: number; marge: number } | null>(null)
    const { saveCalculation } = useCalculatorHistory()

    const benchmark = useMemo(() => getBenchmarkBySecteur(secteur), [secteur])

    const handleNafResolved = useCallback((resolution: NafResolutionResult | null) => {
        setNafResolution(resolution)
        if (resolution?.secteurLabel) {
            setSecteur(resolution.secteurLabel)
        }
    }, [])

    const structuredData = generateHowToJsonLd({
        name: 'Calculateur EBITDA PME',
        description: 'Calculez votre EBITDA et votre marge EBITDA avec benchmark sectoriel Banque de France (FIBEN)',
        slug: 'ebitda',
        steps: [
            { name: 'Renseigner CA', text: 'Entrez votre chiffre d’affaires annuel HT.' },
            { name: 'Ajouter les charges', text: 'Achats, charges externes, impôts/taxes et charges de personnel.' },
            {
                name: 'Calculer EBITDA',
                text: `Approche simplifiée PME (top-down) : ${EBITDA_FORMULA_TOP_DOWN_PME}. ${EBITDA_NOTE_TOP_DOWN}`,
            },
            { name: 'Analyser la marge', text: 'Comparez votre marge EBITDA/CA aux quartiles FIBEN de votre secteur.' },
        ],
    })

    const interpretation = useMemo(() => {
        if (!result || !benchmark) return null
        const interp = getInterpretationEbitda(result.marge, benchmark)
        const pos = getPositionnementEbitda(result.marge, benchmark.quartiles)
        const icon =
            pos === 'au_dessus_Q3' || pos === 'entre_Q2_et_Q3' ? CheckCircle : AlertCircle
        return { ...interp, icon }
    }, [result, benchmark])

    const reportInputs = useMemo(() => {
        if (!result) return {}
        return {
            ca: parseFloat(ca) || 0,
            achats: parseFloat(achats) || 0,
            chargesExternes: parseFloat(chargesExternes) || 0,
            impotsTaxes: parseFloat(impotsTaxes) || 0,
            chargesPersonnel: parseFloat(chargesPersonnel) || 0,
            dotations: parseFloat(dotations) || 0,
            secteur,
        }
    }, [result, ca, achats, chargesExternes, impotsTaxes, chargesPersonnel, dotations, secteur])

    const reportResult = useMemo(() => {
        if (!result || !interpretation || !benchmark) return {}
        const { quartiles } = benchmark
        return {
            ebitda: result.ebitda,
            margeEbitdaPct: result.marge,
            secteur,
            benchmarkQ1: quartiles.Q1,
            benchmarkMedian: quartiles.Q2,
            benchmarkQ3: quartiles.Q3,
            sourceBdf: benchmark.sourceCitation,
            niveau: interpretation.title,
            interpretationLines: [interpretation.text, benchmark.interpretationMediane].filter(Boolean),
            summary: [
                { label: 'EBITDA', value: `${Math.round(result.ebitda).toLocaleString('fr-FR')} €` },
                { label: 'Marge EBITDA/CA', value: `${result.marge.toFixed(1)}%` },
                { label: 'Secteur', value: secteur },
            ],
        }
    }, [result, interpretation, benchmark, secteur])

    const calculer = () => {
        const caN = parseFloat(ca) || 0
        const achatsN = parseFloat(achats) || 0
        const chargesExternesN = parseFloat(chargesExternes) || 0
        const impotsTaxesN = parseFloat(impotsTaxes) || 0
        const chargesPersonnelN = parseFloat(chargesPersonnel) || 0
        const dotationsN = parseFloat(dotations) || 0

        if (caN <= 0) return

        const ebitda = caN - achatsN - chargesExternesN - impotsTaxesN - chargesPersonnelN
        const marge = (ebitda / caN) * 100
        setResult({ ebitda, marge })

        trackCalculatorUse('EBITDA', ebitda, {
            ca: caN,
            achats: achatsN,
            chargesExternes: chargesExternesN,
            impotsTaxes: impotsTaxesN,
            chargesPersonnel: chargesPersonnelN,
            dotations: dotationsN,
            secteur,
        })

        saveCalculation({
            type: 'ebitda',
            value: Math.round(ebitda),
            inputs: {
                ca: caN,
                achats: achatsN,
                chargesExternes: chargesExternesN,
                impotsTaxes: impotsTaxesN,
                chargesPersonnel: chargesPersonnelN,
                dotationsAmortissements: dotationsN,
            },
            secteur,
            unit: '€',
        })
    }

    return (
        <div className="min-h-screen bg-white">
            <StructuredData data={structuredData} />
            <Header />
            <main>
                <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white pt-32 pb-16">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-4xl font-bold">Calculateur EBITDA PME</h1>
                        <p className="text-slate-300 mt-4">
                            Calculez votre EBITDA, votre marge et comparez-vous aux quartiles FIBEN de votre secteur.
                        </p>
                        <p className="text-slate-400 text-sm mt-4 font-mono">{EBITDA_FORMULA_CANONICAL}</p>
                    </div>
                </section>

                <section className="py-12 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-6 bg-white border border-slate-200 rounded-2xl p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            {([
                                ['CA annuel (€)', ca, setCA],
                                ['Achats (€)', achats, setAchats],
                                ['Charges externes (€)', chargesExternes, setChargesExternes],
                                ['Impôts & taxes (€)', impotsTaxes, setImpotsTaxes],
                                ['Charges de personnel (€)', chargesPersonnel, setChargesPersonnel],
                                ['Dotations amortissements (€)', dotations, setDotations],
                            ] as const).map(([label, value, setter]) => (
                                <div key={label}>
                                    <label className="block text-sm font-semibold text-slate-800 mb-2">{label}</label>
                                    <input
                                        type="number"
                                        value={value as string}
                                        onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUseNafInput(false)
                                        setNafResolution(null)
                                    }}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                                        !useNafInput
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white border-slate-200 text-slate-700'
                                    }`}
                                >
                                    Choisir mon secteur
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUseNafInput(true)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                                        useNafInput
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white border-slate-200 text-slate-700'
                                    }`}
                                >
                                    Renseigner mon code NAF
                                </button>
                            </div>

                            {useNafInput ? <NafInput onResolved={handleNafResolved} /> : null}

                            <label htmlFor="secteur-bdf" className="block text-sm font-semibold text-slate-800 mb-2">
                                Secteur d&apos;activité
                            </label>
                            <select
                                id="secteur-bdf"
                                value={secteur}
                                onChange={(e) => {
                                    setSecteur(e.target.value)
                                    setNafResolution(null)
                                }}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900"
                            >
                                {SECTEUR_OPTIONS.map((label) => (
                                    <option key={label} value={label}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            {benchmark && (
                                <p className="text-xs text-slate-500 mt-2">
                                    Médiane secteur (EBG/CA) : {benchmark.quartiles.Q2}% — {benchmark.sourceCitation}
                                </p>
                            )}
                            {benchmark?.avertissementComparabilite && (
                                <div
                                    role="note"
                                    className="mt-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
                                >
                                    <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
                                    <p>{benchmark.avertissementComparabilite}</p>
                                </div>
                            )}
                        </div>

                        <p className="mt-4 text-sm text-slate-600">
                            {EBITDA_NOTE_TOP_DOWN} Formule de référence : {EBITDA_FORMULA_CANONICAL}.
                        </p>

                        <button
                            onClick={calculer}
                            className="mt-6 w-full px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold"
                        >
                            Calculer mon EBITDA
                        </button>
                    </div>
                </section>

                {result && interpretation && benchmark && (
                    <section className="py-10 bg-white">
                        <div className="max-w-4xl mx-auto px-6 space-y-4">
                            <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
                                <p className="text-slate-300">EBITDA</p>
                                <p className="text-5xl font-bold mt-2">{Math.round(result.ebitda).toLocaleString('fr-FR')} €</p>
                                <p className="text-slate-300 mt-3">Marge EBITDA/CA : {result.marge.toFixed(1)}%</p>
                                <p className="text-slate-400 text-sm mt-2">
                                    Approche simplifiée PME (top-down) : {EBITDA_FORMULA_TOP_DOWN_PME}
                                </p>
                                <p className="text-slate-500 text-xs mt-2">{EBITDA_NOTE_TOP_DOWN}</p>
                            </div>

                            <EbitdaQuartileBar
                                currentValue={result.marge}
                                quartiles={benchmark.quartiles}
                                secteurLabel={benchmark.labelCourt}
                                sourceCitation={benchmark.sourceCitation}
                            />

                            {nafResolution?.confidence === 'section' && nafResolution.approximationNote && (
                                <div
                                    role="note"
                                    className="flex gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900"
                                >
                                    <Info className="w-5 h-5 shrink-0" aria-hidden />
                                    <p>{nafResolution.approximationNote}</p>
                                </div>
                            )}

                            {benchmark.avertissementComparabilite && (
                                <div
                                    role="note"
                                    className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                                >
                                    <Info className="w-5 h-5 shrink-0" aria-hidden />
                                    <p>{benchmark.avertissementComparabilite}</p>
                                </div>
                            )}

                            <div className={`border rounded-xl p-4 ${interpretation.cls}`}>
                                <div className="flex items-center gap-2 font-semibold">
                                    <interpretation.icon className="w-5 h-5" />
                                    <span>{interpretation.title}</span>
                                </div>
                                <p className="text-sm mt-1">{interpretation.text}</p>
                                {benchmark.interpretationMediane && (
                                    <p className="text-sm mt-2 opacity-90">{benchmark.interpretationMediane}</p>
                                )}
                                <p className="text-xs mt-2">
                                    Quartiles {secteur} (EBG/CA) : Q1 {benchmark.quartiles.Q1}% · médiane{' '}
                                    {benchmark.quartiles.Q2}% · Q3 {benchmark.quartiles.Q3}%
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="/mon-diagnostic"
                                    className="flex-1 px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold text-center inline-flex items-center justify-center gap-2"
                                >
                                    Voir mon Score FinSight™ <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="flex-1 px-6 py-3 border border-slate-300 rounded-xl font-semibold text-center inline-flex items-center justify-center gap-2"
                                >
                                    <Building2 className="w-4 h-4" />
                                    Parler à un expert
                                </Link>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <EmailCaptureModal
                calculatorType="ebitda"
                hasResult={!!result}
                result={reportResult}
                inputs={reportInputs}
            />

            <div className="max-w-4xl mx-auto px-6 pb-10">
                <section aria-label="Ressources liées" className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
                    <p className="font-semibold text-gray-900 text-sm mb-3">Aller plus loin</p>
                    <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Article lié</p>
                        <Link
                            href="/blog/5-kpis-financiers-essentiels-pme"
                            className="text-accent-primary text-sm hover:underline block"
                        >
                            5 KPIs financiers essentiels pour les PME
                        </Link>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Calculateurs complémentaires
                        </p>
                        <div className="flex flex-col gap-1">
                            <Link href="/calculateurs/marge" className="text-accent-primary text-sm hover:underline">
                                Calculateur Marge Brute &amp; Nette
                            </Link>
                            <Link href="/calculateurs/roi" className="text-accent-primary text-sm hover:underline">
                                Calculateur ROI
                            </Link>
                            <Link href="/fondamentaux" className="text-accent-primary text-sm hover:underline">
                                Guide : Fondamentaux financiers
                            </Link>
                        </div>
                    </div>
                </section>
                <PremiumUpsellCard
                    calculatorType="ebitda"
                    hasResult={!!result}
                    result={reportResult}
                    inputs={reportInputs}
                />
            </div>

            <Footer />
        </div>
    )
}
