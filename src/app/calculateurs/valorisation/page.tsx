'use client'

import { useCallback, useMemo, useState } from 'react'
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
    getMultipleSuggere,
    getMultiplesByBdfCode,
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
    ebitdaUtilise: number
    margePct: number | null
    multipleUtilise: number
    multipleSuggere: MultipleSuggereResult | null
    modeSectoriel: boolean
}

function formatEuro(value: number): string {
    return `${Math.round(value).toLocaleString('fr-FR')} €`
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
    const [tresorerie, setTresorerie] = useState('')
    const [result, setResult] = useState<ValorisationResult | null>(null)
    const { saveCalculation } = useCalculatorHistory()

    const modeSectoriel = secteur.length > 0
    const benchmark = useMemo(
        () => (modeSectoriel ? getBenchmarkBySecteur(secteur) : null),
        [modeSectoriel, secteur],
    )
    const multiplesSecteur = useMemo(
        () => (benchmark ? getMultiplesByBdfCode(benchmark.codeNaf) : null),
        [benchmark],
    )

    const ebitdaCalcule = useMemo(() => {
        const ebitdaDirect = parseFloat(ebitda)
        if (!Number.isNaN(ebitdaDirect) && ebitdaDirect > 0) return ebitdaDirect
        const caN = parseFloat(ca) || 0
        const margeN = parseFloat(margePct) || 0
        if (caN > 0 && margeN > 0) return (caN * margeN) / 100
        return 0
    }, [ebitda, ca, margePct])

    const margeEffective = useMemo(() => {
        const margeSaisie = parseFloat(margePct)
        if (!Number.isNaN(margeSaisie) && margeSaisie > 0) return margeSaisie
        const caN = parseFloat(ca) || 0
        if (caN > 0 && ebitdaCalcule > 0) return (ebitdaCalcule / caN) * 100
        return null
    }, [margePct, ca, ebitdaCalcule])

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
        if (ebitdaN <= 0) return

        const detteNetteN = parseFloat(detteNette) || 0
        const tresorerieN = parseFloat(tresorerie) || 0
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
        const equity = ev - detteNetteN + tresorerieN
        const low = ebitdaN * lowM - detteNetteN + tresorerieN
        const high = ebitdaN * highM - detteNetteN + tresorerieN

        const suggere =
            benchmark && margeEffective != null
                ? getMultipleSuggere(benchmark.codeNaf, margeEffective)
                : null

        const payload: ValorisationResult = {
            ev,
            equity,
            low,
            high,
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
            tresorerie: tresorerieN,
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
                tresorerie: tresorerieN,
                valeurEntreprise: ev,
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
            tresorerie: parseFloat(tresorerie) || 0,
            secteur: secteur || undefined,
            margeEbitdaPct: result.margePct ?? undefined,
        }
    }, [result, detteNette, tresorerie, secteur])

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
            multipleLow: fourchetteMultiples.min,
            multipleHigh: fourchetteMultiples.max,
            qualification: result.multipleSuggere?.qualification,
            interpretationLines: [label, result.multipleSuggere?.raisonnement].filter(Boolean),
            summary: [
                { label: 'EV (multiple)', value: formatEuro(result.ev) },
                { label: 'Fonds propres', value: formatEuro(result.equity) },
                { label: 'Fourchette', value: `${formatEuro(result.low)} → ${formatEuro(result.high)}` },
            ],
        }
    }, [result, multiplesSecteur, label])

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
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-800 mb-2">
                                    EBITDA annuel (€)
                                </label>
                                <input
                                    type="number"
                                    value={ebitda}
                                    onChange={(e) => setEbitda(e.target.value)}
                                    placeholder="Ou laissez vide si CA + marge"
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
                                </label>
                                <input
                                    type="number"
                                    value={margePct}
                                    onChange={(e) => setMargePct(e.target.value)}
                                    placeholder="Ex. 14,2"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                                />
                            </div>
                            {ebitdaCalcule > 0 && !ebitda && (
                                <p className="md:col-span-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                                    EBITDA déduit : {formatEuro(ebitdaCalcule)} (CA × marge)
                                </p>
                            )}
                            <div>
                                <label className="block text-sm font-semibold text-slate-800 mb-2">
                                    Dette nette (€)
                                </label>
                                <input
                                    type="number"
                                    value={detteNette}
                                    onChange={(e) => setDetteNette(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-800 mb-2">
                                    Trésorerie (€)
                                </label>
                                <input
                                    type="number"
                                    value={tresorerie}
                                    onChange={(e) => setTresorerie(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                                />
                            </div>
                        </div>

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
                                <div className="border-t border-slate-700 mt-6 pt-6 text-center">
                                    <p className="text-slate-300">Valorisation centrale (EV)</p>
                                    <p className="text-5xl font-bold mt-2">{formatEuro(result.ev)}</p>
                                    <p className="text-slate-300 mt-4">
                                        Fonds propres :{' '}
                                        <strong>{formatEuro(result.equity)}</strong>
                                    </p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700">
                                    <div>
                                        <p className="text-xs text-slate-400">Fourchette basse</p>
                                        <p className="text-xl font-bold">{formatEuro(result.low)}</p>
                                        {result.modeSectoriel && multiplesSecteur && (
                                            <p className="text-xs text-slate-500">{multiplesSecteur.multipleMin}x</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Fourchette haute</p>
                                        <p className="text-xl font-bold">{formatEuro(result.high)}</p>
                                        {result.modeSectoriel && multiplesSecteur && (
                                            <p className="text-xs text-slate-500">{multiplesSecteur.multipleMax}x</p>
                                        )}
                                    </div>
                                </div>
                                {result.modeSectoriel && (
                                    <p className="text-[11px] text-slate-500 mt-4 text-center border-t border-slate-700 pt-4">
                                        Source multiples : {SOURCE_MULTIPLES_MA}
                                        <br />
                                        Source marges : {BDF_FIBEN_SOURCE_PREFIX}
                                    </p>
                                )}
                            </div>

                            <p className="text-sm text-slate-600 border border-slate-200 rounded-xl p-4">{label}</p>

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
