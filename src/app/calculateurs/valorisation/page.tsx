'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Info, Landmark } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { generateHowToJsonLd } from '@/lib/seo'
import { trackCalculatorUse } from '@/lib/analytics'
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory'
import EmailCaptureModal from '@/components/EmailCaptureModal'
import PremiumUpsellCard from '@/components/PremiumUpsellCard'
import NafInput from '@/components/NafInput'
import {
    BDF_FIBEN_SOURCE_PREFIX,
    getBenchmarkBySecteur,
    getSecteurLabels,
} from '@/lib/benchmarks/bdf-sectoriels'
import type { NafResolutionResult } from '@/lib/benchmarks/nafResolver'
import {
    describeMargeVsQuartiles,
    encodeQualificationMultiple,
    getMultipleSuggere,
    getMultiplesByBdfCode,
    MULTIPLES_MA_METHODOLOGIE,
    SOURCE_MULTIPLES_MA,
    type MultipleSuggereResult,
} from '@/lib/benchmarks/multiples-valorisation'

const SECTEUR_OPTIONS = getSecteurLabels()
const MANUAL_SECTEUR_VALUE = ''

interface ValorisationResult {
    ev: number
    equity: number
    low: number
    high: number
    lowEV: number
    highEV: number
    ebitdaUtilise: number
    margePct: number | null
    multipleUtilise: number
    multipleSuggere: MultipleSuggereResult | null
    modeSectoriel: boolean
}

function formatEuro(value: number): string {
    return `${Math.round(value).toLocaleString('fr-FR')} €`
}

function FieldTooltip({ text }: { text: string }) {
    const [open, setOpen] = useState(false)
    return (
        <span className="relative inline-flex ml-1 align-middle">
            <button
                type="button"
                className="text-slate-400 hover:text-slate-600"
                aria-label="Plus d'informations"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
            >
                <Info className="w-4 h-4" aria-hidden />
            </button>
            {open && (
                <span
                    role="tooltip"
                    className="absolute z-20 left-0 top-6 w-72 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg"
                >
                    {text}
                </span>
            )}
        </span>
    )
}

export default function CalculateurValorisation() {
    const [ebitda, setEbitda] = useState('')
    const [ca, setCa] = useState('')
    const [margePct, setMargePct] = useState('')
    const [multiple, setMultiple] = useState(6)
    const [manualMultipleOverride, setManualMultipleOverride] = useState(false)
    const [secteur, setSecteur] = useState(MANUAL_SECTEUR_VALUE)
    const [useNafInput, setUseNafInput] = useState(false)
    const [nafResolution, setNafResolution] = useState<NafResolutionResult | null>(null)
    const [detteNette, setDetteNette] = useState('')
    const [validationError, setValidationError] = useState<string | null>(null)
    const [result, setResult] = useState<ValorisationResult | null>(null)
    const [ebitdaPrefillBanner, setEbitdaPrefillBanner] = useState(false)
    const [useEbitdaNormalise, setUseEbitdaNormalise] = useState(false)
    const [ebitdaBrutHistory, setEbitdaBrutHistory] = useState<number | null>(null)
    const [ebitdaNormaliseHistory, setEbitdaNormaliseHistory] = useState<number | null>(null)
    const prefillDone = useRef(false)
    const { saveCalculation, history } = useCalculatorHistory()

    const modeSectoriel = secteur.length > 0
    const benchmark = useMemo(
        () => (modeSectoriel ? getBenchmarkBySecteur(secteur) : null),
        [modeSectoriel, secteur],
    )
    const multiplesSecteur = useMemo(
        () => (benchmark ? getMultiplesByBdfCode(benchmark.codeNaf) : null),
        [benchmark],
    )

    useEffect(() => {
        if (prefillDone.current) return
        const latestEbitda = history.find((c) => c.type === 'ebitda')
        if (!latestEbitda) return
        prefillDone.current = true

        const brut = latestEbitda.value
        const normalise = latestEbitda.inputs.ebitdaNormalise
        if (normalise != null && normalise > 0 && brut > 0) {
            setEbitdaBrutHistory(brut)
            setEbitdaNormaliseHistory(normalise)
            setUseEbitdaNormalise(true)
            setEbitda(String(normalise))
        } else if (brut > 0) {
            setEbitda(String(brut))
        }

        if (latestEbitda.inputs.ca > 0) setCa(String(latestEbitda.inputs.ca))
        if (latestEbitda.inputs.marge > 0) setMargePct(String(latestEbitda.inputs.marge))

        setEbitdaPrefillBanner(true)
    }, [history])

    const ebitdaCalcule = useMemo(() => {
        const ebitdaDirect = parseFloat(ebitda)
        if (!Number.isNaN(ebitdaDirect) && ebitdaDirect > 0) return ebitdaDirect
        const caN = parseFloat(ca) || 0
        const margeRaw = margePct.trim()
        if (caN > 0 && margeRaw !== '') {
            const margeN = parseFloat(margePct)
            if (!Number.isNaN(margeN) && margeN >= 0) return (caN * margeN) / 100
        }
        return 0
    }, [ebitda, ca, margePct])

    const margeEffective = useMemo(() => {
        const margeRaw = margePct.trim()
        if (margeRaw !== '') {
            const margeSaisie = parseFloat(margePct)
            if (!Number.isNaN(margeSaisie)) return margeSaisie
        }
        const caN = parseFloat(ca) || 0
        if (caN > 0 && ebitdaCalcule > 0) return (ebitdaCalcule / caN) * 100
        return null
    }, [margePct, ca, ebitdaCalcule])

    const margeZeroWarning = margePct.trim() !== '' && parseFloat(margePct) === 0

    const multipleSuggerePreview = useMemo(() => {
        if (!benchmark || margeEffective == null) return null
        return getMultipleSuggere(benchmark.codeNaf, margeEffective)
    }, [benchmark, margeEffective])

    const multipleEffectif = modeSectoriel
        ? manualMultipleOverride
            ? multiple
            : (multipleSuggerePreview?.multiple ?? multiplesSecteur?.multipleMedian ?? multiple)
        : multiple

    const handleNafResolved = useCallback((resolution: NafResolutionResult | null) => {
        setNafResolution(resolution)
        if (resolution?.secteurLabel) {
            setSecteur(resolution.secteurLabel)
            setManualMultipleOverride(false)
        }
    }, [])

    const structuredData = generateHowToJsonLd({
        name: 'Calculateur valorisation entreprise',
        description:
            'Estimez la valeur d’entreprise avec multiples EBITDA sectoriels M&A et qualification via marges BDF',
        slug: 'valorisation',
        steps: [
            { name: 'Saisir EBITDA ou CA + marge', text: 'Utilisez votre EBITDA normalisé ou déduisez-le du CA.' },
            { name: 'Choisir le secteur', text: 'Sélectionnez votre secteur ou renseignez votre code NAF.' },
            { name: 'Multiple suggéré', text: 'Le multiple est ajusté selon votre marge vs quartiles BDF.' },
            { name: 'Lire la fourchette', text: 'Fourchette basse/haute selon les multiples de marché du secteur.' },
        ],
    })

    const calculer = () => {
        const ebitdaN = ebitdaCalcule
        if (ebitdaN <= 0) {
            setValidationError(
                "L'EBITDA doit être positif pour calculer une valorisation. Vérifiez vos données ou utilisez le calculateur EBITDA.",
            )
            setResult(null)
            return
        }
        setValidationError(null)

        const detteNetteN = parseFloat(detteNette) || 0
        const mult = multipleEffectif

        let lowM: number
        let highM: number
        if (modeSectoriel && multiplesSecteur) {
            lowM = multiplesSecteur.multipleMin
            highM = multiplesSecteur.multipleMax
        } else {
            lowM = Math.max(3, mult - 2)
            highM = Math.min(12, mult + 2)
        }

        const ev = ebitdaN * mult
        const equity = ev - detteNetteN
        const lowEV = ebitdaN * lowM
        const highEV = ebitdaN * highM
        const low = lowEV - detteNetteN
        const high = highEV - detteNetteN

        const suggere =
            benchmark && margeEffective != null
                ? getMultipleSuggere(benchmark.codeNaf, margeEffective)
                : null

        const payload: ValorisationResult = {
            ev,
            equity,
            low,
            high,
            lowEV,
            highEV,
            ebitdaUtilise: ebitdaN,
            margePct: margeEffective,
            multipleUtilise: mult,
            multipleSuggere: suggere,
            modeSectoriel,
        }

        setResult(payload)
        trackCalculatorUse('VALORISATION', equity, {
            ebitda: ebitdaN,
            multiple: mult,
            detteNette: detteNetteN,
            ev,
            ...(secteur ? { secteur } : {}),
            ...(suggere ? { qualification: suggere.qualification } : {}),
        })
        saveCalculation({
            type: 'valorisation',
            value: Math.round(equity),
            inputs: {
                ebitda: ebitdaN,
                multiple: mult,
                detteNette: detteNetteN,
                ev,
                equity,
                low,
                high,
                lowEV,
                highEV,
                margePct: margeEffective ?? 0,
                qualification: encodeQualificationMultiple(suggere?.qualification),
            },
            ...(secteur ? { secteur } : {}),
            unit: '€',
        })
    }

    const label = useMemo(() => {
        if (!result) return ''
        if (result.equity <= 0) return 'Valorisation prudente : dette élevée vs création de valeur.'
        if (result.multipleSuggere?.qualification === 'prime') {
            return 'Profil « prime » : marge EBITDA au-dessus des pairs BDF — multiple tend vers le haut de marché.'
        }
        if (result.multipleSuggere?.qualification === 'discount') {
            return 'Profil « discount » : marge sous la médiane sectorielle — décote sur le multiple.'
        }
        if (result.modeSectoriel) return 'Hypothèse alignée sur les multiples M&A sectoriels et votre marge BDF.'
        if (result.multipleUtilise >= 9) return 'Hypothèse de croissance forte (multiple élevé).'
        return 'Hypothèse médiane de marché (mode manuel).'
    }, [result])

    const reportInputs = useMemo(() => {
        if (!result) return {}
        return {
            ebitda: result.ebitdaUtilise,
            multiple: result.multipleUtilise,
            detteNette: parseFloat(detteNette) || 0,
            secteur: secteur || undefined,
            margeEbitdaPct: result.margePct ?? undefined,
        }
    }, [result, detteNette, secteur])

    const reportResult = useMemo(() => {
        if (!result) return {}
        const fourchetteMultiples = result.modeSectoriel && multiplesSecteur
            ? { min: multiplesSecteur.multipleMin, max: multiplesSecteur.multipleMax }
            : {
                  min: Math.max(3, result.multipleUtilise - 2),
                  max: Math.min(12, result.multipleUtilise + 2),
              }
        return {
            enterpriseValue: result.ev,
            equityValue: result.equity,
            lowEquity: result.low,
            highEquity: result.high,
            lowEV: result.lowEV,
            highEV: result.highEV,
            multipleLow: fourchetteMultiples.min,
            multipleHigh: fourchetteMultiples.max,
            qualification: result.multipleSuggere?.qualification,
            interpretationLines: [label, result.multipleSuggere?.raisonnement].filter(Boolean),
            summary: [
                { label: 'Valeur d\'entreprise (EV)', value: formatEuro(result.ev) },
                { label: 'Fonds propres', value: formatEuro(result.equity) },
                {
                    label: 'Fourchette fonds propres',
                    value: `${formatEuro(result.low)} → ${formatEuro(result.high)}`,
                },
            ],
        }
    }, [result, multiplesSecteur, label])

    const scenarioTable = useMemo(() => {
        if (!result || !benchmark || !multiplesSecteur) return null
        const caN = parseFloat(ca) || 0
        if (caN <= 0 || result.margePct == null) return null

        const { Q2, Q3 } = benchmark.quartiles
        if (result.margePct >= Q3) {
            return { type: 'top_quartile' as const }
        }

        const detteNetteN = parseFloat(detteNette) || 0
        const ebitdaMedian = (caN * Q2) / 100
        const ebitdaQ3 = (caN * Q3) / 100
        const evMedian = ebitdaMedian * multiplesSecteur.multipleMedian
        const evQ3 = ebitdaQ3 * multiplesSecteur.multipleMax
        const gainMedian = evMedian - result.ev
        const gainQ3 = evQ3 - result.ev

        return {
            type: 'scenarios' as const,
            caN,
            Q2,
            Q3,
            rows: [
                {
                    label: 'Situation actuelle',
                    marge: result.margePct,
                    ebitda: result.ebitdaUtilise,
                    multiple: result.multipleUtilise,
                    ev: result.ev,
                    gainEv: 0,
                    gainPct: 0,
                },
                {
                    label: 'Médiane secteur',
                    marge: Q2,
                    ebitda: ebitdaMedian,
                    multiple: multiplesSecteur.multipleMedian,
                    ev: evMedian,
                    gainEv: gainMedian,
                    gainPct: result.ev > 0 ? (gainMedian / result.ev) * 100 : 0,
                },
                {
                    label: 'Top 25% (Q3)',
                    marge: Q3,
                    ebitda: ebitdaQ3,
                    multiple: multiplesSecteur.multipleMax,
                    ev: evQ3,
                    gainEv: gainQ3,
                    gainPct: result.ev > 0 ? (gainQ3 / result.ev) * 100 : 0,
                },
            ],
            detteNetteN,
        }
    }, [result, benchmark, multiplesSecteur, ca, detteNette])

    return (
        <div className="min-h-screen bg-white">
            <StructuredData data={structuredData} />
            <Header />
            <main>
                <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white pt-32 pb-16">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-4xl font-bold">Calculateur Valorisation</h1>
                        <p className="text-slate-300 mt-4">
                            Estimez la valeur de votre entreprise via multiples EBITDA sectoriels et marges BDF.
                        </p>
                    </div>
                </section>

                <section className="py-12 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
                        {ebitdaPrefillBanner && (
                            <p className="text-xs text-blue-800 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                                Données pré-remplies depuis votre dernier calcul EBITDA
                            </p>
                        )}

                        {ebitdaBrutHistory != null && ebitdaNormaliseHistory != null && (
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUseEbitdaNormalise(false)
                                        setEbitda(String(ebitdaBrutHistory))
                                    }}
                                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                                        !useEbitdaNormalise
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white border-slate-200 text-slate-700'
                                    }`}
                                >
                                    EBITDA brut ({formatEuro(ebitdaBrutHistory)})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUseEbitdaNormalise(true)
                                        setEbitda(String(ebitdaNormaliseHistory))
                                    }}
                                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                                        useEbitdaNormalise
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white border-slate-200 text-slate-700'
                                    }`}
                                >
                                    EBITDA normalisé ({formatEuro(ebitdaNormaliseHistory)})
                                </button>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-800 mb-2">
                                    EBITDA annuel (€)
                                </label>
                                <input
                                    type="number"
                                    value={ebitda}
                                    onChange={(e) => setEbitda(e.target.value)}
                                    placeholder="Ex. 450 000 — ou laissez vide si CA + marge"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-800 mb-2">
                                    CA annuel HT (€) — optionnel
                                </label>
                                <input
                                    type="number"
                                    value={ca}
                                    onChange={(e) => setCa(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-800 mb-2">
                                    Marge EBITDA/CA (%) — optionnel
                                    <FieldTooltip text="Une marge nulle produit un EBITDA nul — vérifiez vos charges." />
                                </label>
                                <input
                                    type="number"
                                    value={margePct}
                                    onChange={(e) => setMargePct(e.target.value)}
                                    placeholder="Ex. 14,2"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                                />
                                {margeZeroWarning && (
                                    <p className="text-xs text-amber-700 mt-1">
                                        Une marge nulle produit un EBITDA nul — vérifiez vos charges.
                                    </p>
                                )}
                            </div>
                            {ebitdaCalcule > 0 && !ebitda && (
                                <p className="md:col-span-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                                    EBITDA déduit : {formatEuro(ebitdaCalcule)} (CA × marge)
                                </p>
                            )}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-800 mb-2">
                                    Dette nette (€)
                                    <FieldTooltip text="Dette nette = dettes financières brutes − trésorerie disponible. Si votre trésorerie dépasse vos dettes : saisissez un montant négatif. Exemple : 200k€ de dettes, 50k€ de cash → dette nette = 150 000" />
                                </label>
                                <input
                                    type="number"
                                    value={detteNette}
                                    onChange={(e) => setDetteNette(e.target.value)}
                                    placeholder="Ex. 150 000 (ou −20 000 si trésorerie nette positive)"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                                />
                            </div>
                        </div>

                        {validationError && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {validationError}
                            </p>
                        )}

                        {modeSectoriel && margeEffective == null && (
                            <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                                Saisissez votre marge EBITDA/CA pour obtenir un multiple personnalisé. Sans marge, le
                                multiple médian sectoriel est appliqué.
                            </p>
                        )}

                        <div className="border-t border-slate-100 pt-6 space-y-4">
                            <p className="text-sm font-semibold text-slate-800">Secteur d&apos;activité (optionnel)</p>
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

                            <select
                                value={secteur}
                                onChange={(e) => {
                                    setSecteur(e.target.value)
                                    setNafResolution(null)
                                    setManualMultipleOverride(false)
                                    if (!e.target.value) setResult(null)
                                }}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900"
                            >
                                <option value="">Multiple manuel (sans secteur)</option>
                                {SECTEUR_OPTIONS.map((label) => (
                                    <option key={label} value={label}>
                                        {label}
                                    </option>
                                ))}
                            </select>

                            {modeSectoriel && multiplesSecteur && (
                                <p className="text-xs text-slate-500">
                                    Fourchette marché {multiplesSecteur.label} : {multiplesSecteur.multipleMin}x –{' '}
                                    {multiplesSecteur.multipleMax}x (médiane {multiplesSecteur.multipleMedian}x) —{' '}
                                    {multiplesSecteur.note}
                                </p>
                            )}

                            {benchmark?.avertissementComparabilite && (
                                <div
                                    role="note"
                                    className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
                                >
                                    <Info className="w-4 h-4 shrink-0" aria-hidden />
                                    <p>{benchmark.avertissementComparabilite}</p>
                                </div>
                            )}

                            {secteur === 'Immobilier' && (
                                <div
                                    role="note"
                                    className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
                                >
                                    <Info className="w-4 h-4 shrink-0" aria-hidden />
                                    <p>
                                        Valorisation immobilière — méthode patrimoniale recommandée en complément du
                                        multiple EBITDA.
                                    </p>
                                </div>
                            )}

                            {nafResolution?.confidence === 'section' && nafResolution.approximationNote && (
                                <p className="text-xs text-blue-800 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                                    {nafResolution.approximationNote}
                                </p>
                            )}
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            {modeSectoriel && multipleSuggerePreview ? (
                                <div className="space-y-3">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Multiple suggéré :{' '}
                                        <span className="text-accent-primary">
                                            {multipleSuggerePreview.multiple}x
                                        </span>
                                        <span className="font-normal text-slate-500 ml-2">
                                            (fourchette {multipleSuggerePreview.fourchette.min}x –{' '}
                                            {multipleSuggerePreview.fourchette.max}x)
                                        </span>
                                    </p>
                                    <p className="text-xs text-slate-600">{multipleSuggerePreview.raisonnement}</p>
                                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={manualMultipleOverride}
                                            onChange={(e) => {
                                                setManualMultipleOverride(e.target.checked)
                                                if (e.target.checked) {
                                                    setMultiple(multipleSuggerePreview.multiple)
                                                }
                                            }}
                                            className="rounded border-slate-300"
                                        />
                                        Ajuster le multiple manuellement
                                    </label>
                                    {manualMultipleOverride && (
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-2">
                                                Multiple ajusté : {multiple}x
                                            </label>
                                            <input
                                                type="range"
                                                min={multiplesSecteur?.multipleMin ?? 3}
                                                max={multiplesSecteur?.multipleMax ?? 12}
                                                step={0.5}
                                                value={multiple}
                                                onChange={(e) => setMultiple(parseFloat(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                                        Multiple EBITDA : {multiple}x
                                    </label>
                                    <input
                                        type="range"
                                        min={3}
                                        max={12}
                                        step={0.5}
                                        value={multiple}
                                        onChange={(e) => setMultiple(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Fourchette simulée : {Math.max(3, multiple - 2)}x à{' '}
                                        {Math.min(12, multiple + 2)}x
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={calculer}
                            className="w-full px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold"
                        >
                            Calculer ma valorisation
                        </button>
                    </div>
                </section>

                {result && (
                    <section className="py-10 bg-white">
                        <div className="max-w-4xl mx-auto px-6 space-y-4">
                            <div className="bg-slate-900 text-white rounded-2xl p-8">
                                <p className="text-slate-400 text-sm uppercase tracking-wide mb-4">
                                    Valorisation estimée
                                </p>
                                <div className="border-t border-slate-700 pt-4 space-y-2 text-sm font-mono">
                                    <p>
                                        <span className="text-slate-400">EBITDA saisi</span>
                                        <span className="float-right text-white">
                                            {formatEuro(result.ebitdaUtilise)}
                                        </span>
                                    </p>
                                    {result.modeSectoriel && secteur && (
                                        <p>
                                            <span className="text-slate-400">Secteur</span>
                                            <span className="float-right text-white">{secteur}</span>
                                        </p>
                                    )}
                                    {result.margePct != null && result.multipleSuggere && (
                                        <>
                                            <p>
                                                <span className="text-slate-400">Votre marge EBITDA/CA</span>
                                                <span className="float-right text-white">
                                                    {result.margePct.toFixed(1)}% →{' '}
                                                    {describeMargeVsQuartiles(
                                                        result.margePct,
                                                        result.multipleSuggere.quartilesBdf,
                                                    )}
                                                </span>
                                            </p>
                                            <p>
                                                <span className="text-slate-400">Qualification</span>
                                                <span className="float-right text-emerald-300 capitalize">
                                                    {result.multipleSuggere.qualificationDetail}
                                                </span>
                                            </p>
                                        </>
                                    )}
                                    <p>
                                        <span className="text-slate-400">Multiple suggéré</span>
                                        <span className="float-right text-white">
                                            {result.multipleUtilise}x
                                            {result.modeSectoriel && multiplesSecteur && (
                                                <span className="text-slate-400 text-xs ml-1">
                                                    (marché {multiplesSecteur.multipleMin}x –{' '}
                                                    {multiplesSecteur.multipleMax}x)
                                                </span>
                                            )}
                                        </span>
                                    </p>
                                </div>
                                <div className="border-t border-slate-700 mt-6 pt-6">
                                    <div className="grid md:grid-cols-2 gap-6 text-center">
                                        <div>
                                            <p className="text-slate-400 text-sm">Valeur d&apos;entreprise (EV)</p>
                                            <p className="text-4xl font-bold mt-2">{formatEuro(result.ev)}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-sm">Valeur des fonds propres</p>
                                            <p className="text-4xl font-bold mt-2">{formatEuro(result.equity)}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 text-center mt-4">
                                        EV − dette nette ({formatEuro(parseFloat(detteNette) || 0)}) = valeur des
                                        fonds propres
                                    </p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide">Fourchette EV</p>
                                        <p className="text-lg font-semibold mt-1">
                                            {formatEuro(result.lowEV)} → {formatEuro(result.highEV)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide">
                                            Fourchette fonds propres
                                        </p>
                                        <p className="text-lg font-semibold mt-1">
                                            {formatEuro(result.low)} → {formatEuro(result.high)}
                                        </p>
                                    </div>
                                </div>
                                {result.modeSectoriel && (
                                    <p className="text-[11px] text-slate-500 mt-4 text-center border-t border-slate-700 pt-4">
                                        <span className="inline-flex items-center justify-center gap-1 flex-wrap">
                                            Source multiples : {SOURCE_MULTIPLES_MA}
                                            <FieldTooltip text={MULTIPLES_MA_METHODOLOGIE} />
                                        </span>
                                        <br />
                                        Source marges : {BDF_FIBEN_SOURCE_PREFIX}
                                    </p>
                                )}
                            </div>

                            {result.equity <= 0 && (
                                <div
                                    role="alert"
                                    className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900"
                                >
                                    Les fonds propres ressortent négatifs — votre dette dépasse la valeur
                                    d&apos;entreprise. Valorisation patrimoniale à expertiser.
                                </div>
                            )}

                            <p className="text-sm text-slate-600 border border-slate-200 rounded-xl p-4">{label}</p>

                            {scenarioTable?.type === 'top_quartile' && (
                                <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                    Vous êtes déjà dans le top 25% de votre secteur (marge au-dessus du 3ᵉ quartile
                                    BDF).
                                </p>
                            )}

                            {scenarioTable?.type === 'scenarios' && (
                                <div className="border border-slate-200 rounded-2xl p-6 space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Et si vous améliorez votre marge ?
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Scénarios en lecture seule (CA {formatEuro(scenarioTable.caN)} conservé).
                                    </p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead>
                                                <tr className="border-b border-slate-200 text-slate-500">
                                                    <th className="py-2 pr-4 font-medium" />
                                                    <th className="py-2 px-2 font-medium">Situation actuelle</th>
                                                    <th className="py-2 px-2 font-medium">Médiane secteur</th>
                                                    <th className="py-2 px-2 font-medium">Top 25%</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-slate-800">
                                                <tr className="border-b border-slate-100">
                                                    <td className="py-2 pr-4 text-slate-500">Marge EBITDA/CA</td>
                                                    {scenarioTable.rows.map((row) => (
                                                        <td key={`m-${row.label}`} className="py-2 px-2">
                                                            {row.marge.toFixed(1)}%
                                                        </td>
                                                    ))}
                                                </tr>
                                                <tr className="border-b border-slate-100">
                                                    <td className="py-2 pr-4 text-slate-500">EBITDA</td>
                                                    {scenarioTable.rows.map((row) => (
                                                        <td key={`e-${row.label}`} className="py-2 px-2">
                                                            {formatEuro(row.ebitda)}
                                                        </td>
                                                    ))}
                                                </tr>
                                                <tr className="border-b border-slate-100">
                                                    <td className="py-2 pr-4 text-slate-500">Multiple</td>
                                                    {scenarioTable.rows.map((row) => (
                                                        <td key={`x-${row.label}`} className="py-2 px-2">
                                                            {row.multiple}x
                                                        </td>
                                                    ))}
                                                </tr>
                                                <tr className="border-b border-slate-100">
                                                    <td className="py-2 pr-4 text-slate-500 font-medium">EV cible</td>
                                                    {scenarioTable.rows.map((row) => (
                                                        <td key={`v-${row.label}`} className="py-2 px-2 font-semibold">
                                                            {formatEuro(row.ev)}
                                                        </td>
                                                    ))}
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 text-slate-500">Gain EV vs actuel</td>
                                                    {scenarioTable.rows.map((row) => (
                                                        <td
                                                            key={`g-${row.label}`}
                                                            className={`py-2 px-2 ${
                                                                row.gainEv > 0 ? 'text-emerald-700' : 'text-slate-500'
                                                            }`}
                                                        >
                                                            {row.gainEv === 0
                                                                ? '—'
                                                                : `+${formatEuro(row.gainEv)} (+${row.gainPct.toFixed(0)}%)`}
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

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
                                    <Landmark className="w-4 h-4" />
                                    Parler à un expert
                                </Link>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <EmailCaptureModal
                calculatorType="valorisation"
                hasResult={!!result}
                result={reportResult}
                inputs={reportInputs}
            />

            <div className="max-w-4xl mx-auto px-6 pb-10">
                <section
                    aria-label="Ressources liées"
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6"
                >
                    <p className="font-semibold text-gray-900 text-sm mb-3">Aller plus loin</p>
                    <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Article lié</p>
                        <Link
                            href="/blog/pourquoi-entreprise-rentable-detruit-valeur"
                            className="text-accent-primary text-sm hover:underline block"
                        >
                            Pourquoi une entreprise rentable peut détruire de la valeur ?
                        </Link>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Calculateurs complémentaires
                        </p>
                        <div className="flex flex-col gap-1">
                            <Link href="/calculateurs/ebitda" className="text-accent-primary text-sm hover:underline">
                                Calculateur EBITDA
                            </Link>
                            <Link href="/calculateurs/roi" className="text-accent-primary text-sm hover:underline">
                                Calculateur ROI
                            </Link>
                            <Link
                                href="/pilotage-financier-pme"
                                className="text-accent-primary text-sm hover:underline"
                            >
                                Guide : Pilotage financier PME
                            </Link>
                        </div>
                    </div>
                </section>
                <PremiumUpsellCard
                    calculatorType="valorisation"
                    hasResult={!!result}
                    result={reportResult}
                    inputs={reportInputs}
                />
            </div>

            <Footer />
        </div>
    )
}
