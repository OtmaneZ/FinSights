'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import {
    Building2,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    Info,
    ChevronDown,
    ChevronUp,
} from 'lucide-react'
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
    MARGE_BDF_LABEL,
    computeEbitdaAddBack,
    computeEbitdaNormalise,
    computeEbitdaTopDown,
    computeMargeGapVendeur,
    computeMargePct,
    validateEbitdaInputs,
    type EbitdaCalcMode,
} from '@/lib/ebitdaFormula'

const SECTEUR_OPTIONS = getSecteurLabels()
const DEFAULT_SECTEUR = SECTEUR_OPTIONS.includes('Tech & Informatique')
    ? 'Tech & Informatique'
    : SECTEUR_OPTIONS[0] ?? 'Industrie'

const CHARGE_FIELD_TOOLTIP =
    "N'incluez pas vos charges financières ici — elles sont hors EBITDA (compte 66x)."

interface EbitdaResult {
    ebitda: number
    marge: number
    ebitdaNormalise: number | null
    mode: EbitdaCalcMode
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
                    className="absolute z-20 left-0 top-6 w-64 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg"
                >
                    {text}
                </span>
            )}
        </span>
    )
}

function NumberField({
    id,
    label,
    value,
    onChange,
    placeholder,
    tooltip,
    required,
}: {
    id: string
    label: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
    tooltip?: string
    required?: boolean
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-semibold text-slate-800 mb-2">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
                {tooltip ? <FieldTooltip text={tooltip} /> : null}
            </label>
            <input
                id={id}
                type="number"
                inputMode="decimal"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl"
            />
        </div>
    )
}

export default function CalculateurEBITDA() {
    const [calcMode, setCalcMode] = useState<EbitdaCalcMode>('topdown')
    const [ca, setCA] = useState('')
    const [achats, setAchats] = useState('')
    const [chargesExternes, setChargesExternes] = useState('')
    const [impotsTaxes, setImpotsTaxes] = useState('')
    const [chargesPersonnel, setChargesPersonnel] = useState('')
    const [autresProduits, setAutresProduits] = useState('')
    const [autresCharges, setAutresCharges] = useState('')
    const [resultatNet, setResultatNet] = useState('')
    const [resultatExceptionnel, setResultatExceptionnel] = useState('')
    const [impotsSocietes, setImpotsSocietes] = useState('')
    const [chargesFinancieres, setChargesFinancieres] = useState('')
    const [dotations, setDotations] = useState('')
    const [retraitementDirigeant, setRetraitementDirigeant] = useState('')
    const [oneOffs, setOneOffs] = useState('')
    const [showRetraitements, setShowRetraitements] = useState(false)
    const [secteur, setSecteur] = useState(DEFAULT_SECTEUR)
    const [useNafInput, setUseNafInput] = useState(false)
    const [nafResolution, setNafResolution] = useState<NafResolutionResult | null>(null)
    const [result, setResult] = useState<EbitdaResult | null>(null)
    const [validationError, setValidationError] = useState<string | null>(null)
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
        description:
            'Calculez votre EBITDA et votre marge EBITDA avec benchmark sectoriel Banque de France (FIBEN)',
        slug: 'ebitda',
        steps: [
            { name: 'Choisir le mode', text: 'Top-down (charges) ou add-back (compte de résultat).' },
            { name: 'Renseigner CA', text: 'Entrez votre chiffre d’affaires annuel HT.' },
            {
                name: 'Calculer EBITDA',
                text: `Top-down : ${EBITDA_FORMULA_TOP_DOWN_PME}. Add-back : ${EBITDA_FORMULA_CANONICAL}.`,
            },
            {
                name: 'Analyser la marge',
                text: `Comparez votre ${MARGE_BDF_LABEL} aux quartiles FIBEN de votre secteur.`,
            },
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

    const gapVendeur = useMemo(() => {
        if (!result || !benchmark) return null
        const caN = parseFloat(ca) || 0
        return computeMargeGapVendeur(caN, result.marge, benchmark.quartiles.Q2)
    }, [result, benchmark, ca])

    const reportInputs = useMemo(() => {
        if (!result) return {}
        return {
            ca: parseFloat(ca) || 0,
            mode: result.mode,
            achats: parseFloat(achats) || 0,
            chargesExternes: parseFloat(chargesExternes) || 0,
            impotsTaxes: parseFloat(impotsTaxes) || 0,
            chargesPersonnel: parseFloat(chargesPersonnel) || 0,
            autresProduits: parseFloat(autresProduits) || 0,
            autresCharges: parseFloat(autresCharges) || 0,
            resultatNet: parseFloat(resultatNet) || 0,
            resultatExceptionnel: parseFloat(resultatExceptionnel) || 0,
            impotsSocietes: parseFloat(impotsSocietes) || 0,
            chargesFinancieres: parseFloat(chargesFinancieres) || 0,
            dotations: parseFloat(dotations) || 0,
            retraitementDirigeant: parseFloat(retraitementDirigeant) || 0,
            oneOffs: parseFloat(oneOffs) || 0,
            secteur,
        }
    }, [
        result,
        ca,
        achats,
        chargesExternes,
        impotsTaxes,
        chargesPersonnel,
        autresProduits,
        autresCharges,
        resultatNet,
        resultatExceptionnel,
        impotsSocietes,
        chargesFinancieres,
        dotations,
        retraitementDirigeant,
        oneOffs,
        secteur,
    ])

    const reportResult = useMemo(() => {
        if (!result || !interpretation || !benchmark) return {}
        const { quartiles } = benchmark
        const summary = [
            { label: 'EBITDA', value: `${Math.round(result.ebitda).toLocaleString('fr-FR')} €` },
            { label: MARGE_BDF_LABEL, value: `${result.marge.toFixed(1)}%` },
            { label: 'Secteur', value: secteur },
        ]
        if (result.ebitdaNormalise != null) {
            summary.splice(1, 0, {
                label: 'EBITDA normalisé',
                value: `${Math.round(result.ebitdaNormalise).toLocaleString('fr-FR')} €`,
            })
        }
        return {
            ebitda: result.ebitda,
            ebitdaNormalise: result.ebitdaNormalise,
            margeEbitdaPct: result.marge,
            secteur,
            benchmarkQ1: quartiles.Q1,
            benchmarkMedian: quartiles.Q2,
            benchmarkQ3: quartiles.Q3,
            sourceBdf: benchmark.sourceCitation,
            niveau: interpretation.title,
            interpretationLines: [interpretation.text, benchmark.interpretationMediane].filter(Boolean),
            summary,
        }
    }, [result, interpretation, benchmark, secteur])

    const calculer = () => {
        setValidationError(null)

        const caN = parseFloat(ca) || 0
        let ebitda: number
        let chargesFinN: number | null = null

        if (calcMode === 'topdown') {
            ebitda = computeEbitdaTopDown({
                ca: caN,
                achats: parseFloat(achats) || 0,
                chargesExternes: parseFloat(chargesExternes) || 0,
                impotsTaxes: parseFloat(impotsTaxes) || 0,
                chargesPersonnel: parseFloat(chargesPersonnel) || 0,
                autresProduits: parseFloat(autresProduits) || 0,
                autresCharges: parseFloat(autresCharges) || 0,
            })
        } else {
            const chargesFinStr = chargesFinancieres.trim()
            if (!chargesFinStr) {
                setValidationError(
                    'Les charges financières nettes sont obligatoires en mode compte de résultat.',
                )
                setResult(null)
                return
            }
            chargesFinN = parseFloat(chargesFinStr)
            if (Number.isNaN(chargesFinN)) {
                setValidationError(
                    'Les charges financières nettes sont obligatoires en mode compte de résultat.',
                )
                setResult(null)
                return
            }

            ebitda = computeEbitdaAddBack({
                ca: caN,
                resultatNet: parseFloat(resultatNet) || 0,
                resultatExceptionnelNet: parseFloat(resultatExceptionnel) || 0,
                impotsSocietes: parseFloat(impotsSocietes) || 0,
                chargesFinancieresNettes: chargesFinN,
                dotationsAmortissements: parseFloat(dotations) || 0,
            })
        }

        const marge = computeMargePct(ebitda, caN)
        const validation = validateEbitdaInputs(calcMode, caN, chargesFinN, marge)
        if (validation) {
            setValidationError(validation.message)
            setResult(null)
            return
        }

        const retraitDir = parseFloat(retraitementDirigeant) || 0
        const oneOffsN = parseFloat(oneOffs) || 0
        const hasNormalisation =
            showRetraitements && (retraitDir !== 0 || oneOffsN !== 0)
        const ebitdaNormalise = hasNormalisation
            ? computeEbitdaNormalise(ebitda, {
                  retraitementDirigeant: retraitDir,
                  oneOffs: oneOffsN,
              })
            : null

        const nextResult: EbitdaResult = {
            ebitda,
            marge,
            ebitdaNormalise,
            mode: calcMode,
        }
        setResult(nextResult)

        trackCalculatorUse('EBITDA', ebitda, {
            ca: caN,
            mode: calcMode,
            marge,
            secteur,
        })

        saveCalculation({
            type: 'ebitda',
            value: Math.round(ebitda),
            inputs: {
                ca: caN,
                /** 0 = topdown, 1 = addback */
                calcMode: calcMode === 'topdown' ? 0 : 1,
                marge,
                ...(ebitdaNormalise != null ? { ebitdaNormalise } : {}),
                achats: parseFloat(achats) || 0,
                chargesExternes: parseFloat(chargesExternes) || 0,
                impotsTaxes: parseFloat(impotsTaxes) || 0,
                chargesPersonnel: parseFloat(chargesPersonnel) || 0,
                autresProduits: parseFloat(autresProduits) || 0,
                autresCharges: parseFloat(autresCharges) || 0,
                resultatNet: parseFloat(resultatNet) || 0,
                resultatExceptionnelNet: parseFloat(resultatExceptionnel) || 0,
                impotsSocietes: parseFloat(impotsSocietes) || 0,
                chargesFinancieres: chargesFinN ?? 0,
                dotationsAmortissements: parseFloat(dotations) || 0,
            },
            secteur,
            unit: '€',
        })
    }

    const activeFormula =
        calcMode === 'topdown' ? EBITDA_FORMULA_TOP_DOWN_PME : EBITDA_FORMULA_CANONICAL

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
                    </div>
                </section>

                <section className="py-12 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-6 bg-white border border-slate-200 rounded-2xl p-6">
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-slate-800 mb-2">Mode de calcul</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCalcMode('topdown')
                                        setValidationError(null)
                                    }}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                                        calcMode === 'topdown'
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white border-slate-200 text-slate-700'
                                    }`}
                                >
                                    Je saisis mes charges
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCalcMode('addback')
                                        setValidationError(null)
                                    }}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                                        calcMode === 'addback'
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white border-slate-200 text-slate-700'
                                    }`}
                                >
                                    J&apos;ai mon compte de résultat
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 font-mono">{activeFormula}</p>
                            {calcMode === 'topdown' && (
                                <p className="text-xs text-slate-600 mt-1">{EBITDA_NOTE_TOP_DOWN}</p>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <NumberField
                                id="ca"
                                label="Chiffre d'affaires annuel HT (€)"
                                value={ca}
                                onChange={setCA}
                                placeholder="Ex. 850000"
                                required
                            />

                            {calcMode === 'topdown' ? (
                                <>
                                    <NumberField
                                        id="achats"
                                        label="Achats (€)"
                                        value={achats}
                                        onChange={setAchats}
                                        placeholder="Ex. 320000"
                                        tooltip={CHARGE_FIELD_TOOLTIP}
                                    />
                                    <NumberField
                                        id="charges-externes"
                                        label="Charges externes (€)"
                                        value={chargesExternes}
                                        onChange={setChargesExternes}
                                        placeholder="Ex. 95000"
                                        tooltip={CHARGE_FIELD_TOOLTIP}
                                    />
                                    <NumberField
                                        id="impots-taxes"
                                        label="Impôts & taxes (€)"
                                        value={impotsTaxes}
                                        onChange={setImpotsTaxes}
                                        placeholder="Ex. 12000"
                                        tooltip={CHARGE_FIELD_TOOLTIP}
                                    />
                                    <NumberField
                                        id="charges-personnel"
                                        label="Charges de personnel (€)"
                                        value={chargesPersonnel}
                                        onChange={setChargesPersonnel}
                                        placeholder="Ex. 280000"
                                        tooltip={CHARGE_FIELD_TOOLTIP}
                                    />
                                    <NumberField
                                        id="autres-produits"
                                        label="Autres produits d'exploitation (€)"
                                        value={autresProduits}
                                        onChange={setAutresProduits}
                                        placeholder="Ex. 12000"
                                        tooltip="Subventions d'exploitation (74x), produits de gestion courante (75x), refacturations. Laisser vide si non applicable."
                                    />
                                    <NumberField
                                        id="autres-charges"
                                        label="Autres charges d'exploitation (€)"
                                        value={autresCharges}
                                        onChange={setAutresCharges}
                                        placeholder="Ex. 8000"
                                        tooltip="Redevances de crédit-bail (612x), pertes sur créances clients (654x), charges de gestion courante (65x). Laisser vide si non applicable."
                                    />
                                </>
                            ) : (
                                <>
                                    <NumberField
                                        id="resultat-net"
                                        label="Résultat net (€)"
                                        value={resultatNet}
                                        onChange={setResultatNet}
                                        placeholder="Ex. 45000"
                                    />
                                    <NumberField
                                        id="resultat-exceptionnel"
                                        label="Résultat exceptionnel net (€)"
                                        value={resultatExceptionnel}
                                        onChange={setResultatExceptionnel}
                                        placeholder="Ex. -8000"
                                        tooltip="Si votre résultat net inclut des éléments exceptionnels non récurrents (cession d'actif, indemnité, sinistre...), indiquez leur montant net. Il sera soustrait pour obtenir un EBITDA opérationnel pur. Laisser vide si non applicable."
                                    />
                                    <NumberField
                                        id="impots-societes"
                                        label="Impôts sur les sociétés (€)"
                                        value={impotsSocietes}
                                        onChange={setImpotsSocietes}
                                        placeholder="Ex. 18000"
                                    />
                                    <NumberField
                                        id="charges-financieres"
                                        label="Charges financières nettes (intérêts d'emprunt, compte 66x) (€)"
                                        value={chargesFinancieres}
                                        onChange={setChargesFinancieres}
                                        placeholder="Ex. 15000"
                                        tooltip="Intérêts d'emprunt et charges financières nettes (compte 66x), à ajouter au résultat net pour retrouver l'EBITDA."
                                        required
                                    />
                                    <NumberField
                                        id="dotations"
                                        label="Dotations aux amortissements (€)"
                                        value={dotations}
                                        onChange={setDotations}
                                        placeholder="Ex. 42000"
                                        tooltip="Amortissements et dépréciations — nécessaires en mode add-back pour reconstituer l'EBITDA."
                                    />
                                </>
                            )}
                        </div>

                        <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setShowRetraitements((v) => !v)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 text-sm font-semibold text-slate-800"
                            >
                                Retraitements (optionnel)
                                {showRetraitements ? (
                                    <ChevronUp className="w-4 h-4" aria-hidden />
                                ) : (
                                    <ChevronDown className="w-4 h-4" aria-hidden />
                                )}
                            </button>
                            {showRetraitements && (
                                <div className="p-4 grid md:grid-cols-2 gap-4 border-t border-slate-200">
                                    <NumberField
                                        id="retraitement-dirigeant"
                                        label="Salaire dirigeant vs marché (€)"
                                        value={retraitementDirigeant}
                                        onChange={setRetraitementDirigeant}
                                        placeholder="Ex. 25000"
                                        tooltip="Différence entre votre rémunération réelle et un salaire de marché équivalent. Positif si vous êtes sous-payé vs marché."
                                    />
                                    <NumberField
                                        id="one-offs"
                                        label="One-offs (charges ou produits exceptionnels) (€)"
                                        value={oneOffs}
                                        onChange={setOneOffs}
                                        placeholder="Ex. -8000"
                                        tooltip="Charges exceptionnelles non récurrentes (montant négatif) ou produits exceptionnels (montant positif)."
                                    />
                                    <p className="md:col-span-2 text-xs text-slate-600">
                                        EBITDA normalisé = EBITDA + retraitement dirigeant + one-offs
                                    </p>
                                </div>
                            )}
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
                                    Médiane secteur (EBG/CA) : {benchmark.quartiles.Q2}% —{' '}
                                    {benchmark.sourceCitation}
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

                        {validationError && (
                            <div
                                role="alert"
                                className="mt-4 flex gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
                                <p>{validationError}</p>
                            </div>
                        )}

                        <button
                            type="button"
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
                                <p className="text-slate-300">EBITDA brut</p>
                                <p className="text-5xl font-bold mt-2">
                                    {Math.round(result.ebitda).toLocaleString('fr-FR')} €
                                </p>
                                <p className="text-slate-300 mt-3">
                                    {MARGE_BDF_LABEL} : {result.marge.toFixed(1)}%
                                </p>
                                {result.ebitdaNormalise != null && (
                                    <p className="text-emerald-300 mt-3 text-lg font-semibold">
                                        EBITDA normalisé :{' '}
                                        {Math.round(result.ebitdaNormalise).toLocaleString('fr-FR')} €
                                    </p>
                                )}
                                <p className="text-slate-400 text-sm mt-2 font-mono">{activeFormula}</p>
                            </div>

                            {result.ebitda < 0 && (
                                <div
                                    role="alert"
                                    className="flex gap-3 rounded-xl border border-orange-300 bg-orange-50 px-4 py-3 text-sm text-orange-950"
                                >
                                    <AlertCircle className="w-5 h-5 shrink-0 text-orange-600" aria-hidden />
                                    <div>
                                        <p className="font-semibold">Perte opérationnelle détectée</p>
                                        <p className="mt-1">
                                            Votre EBITDA est négatif : l&apos;activité courante ne couvre pas
                                            l&apos;ensemble des charges d&apos;exploitation saisies. Avant toute
                                            comparaison sectorielle, identifiez les postes de charges à restructurer
                                            ou les leviers de marge à activer.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <EbitdaQuartileBar
                                currentValue={result.marge}
                                quartiles={benchmark.quartiles}
                                secteurLabel={benchmark.labelCourt}
                                sourceCitation={benchmark.sourceCitation}
                            />

                            {gapVendeur && (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                                    {gapVendeur.sousMediane ? (
                                        <p>
                                            Votre marge est{' '}
                                            <strong>{gapVendeur.ecartPoints.toFixed(1)} pts</strong> sous la médiane
                                            de votre secteur. Sur votre CA, cela représente{' '}
                                            <strong>{gapVendeur.montantEuro.toLocaleString('fr-FR')} €</strong>{' '}
                                            d&apos;EBITDA potentiel.
                                        </p>
                                    ) : (
                                        <p>
                                            Vous surpassez la médiane sectorielle de{' '}
                                            <strong>{gapVendeur.ecartPoints.toFixed(1)} pts</strong>, soit{' '}
                                            <strong>{gapVendeur.montantEuro.toLocaleString('fr-FR')} €</strong>{' '}
                                            d&apos;EBITDA supplémentaire vs un concurrent médian.
                                        </p>
                                    )}
                                </div>
                            )}

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
