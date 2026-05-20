'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, AlertTriangle, ChevronDown, HelpCircle, Lock, Mail } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
} from 'recharts'

// ─── Constantes légales 2026 ─────────────────────────────────────────
const SMIC_MENSUEL_2026 = 1823.03
const SMIC_ANNUEL_2026 = SMIC_MENSUEL_2026 * 12
const PLAFOND_SS_MENSUEL_2026 = 4005
const TAUX_BRUT_PATRONAL_SOUS_PLAFOND = 0.45
const TAUX_BRUT_PATRONAL_SUR_PLAFOND = 0.25
const TMIN = 0.0200
const TDELTA_FNAL_SMALL = 0.3781
const TDELTA_FNAL_LARGE = 0.3821
const P = 1.75
const TAUX_NET_BRUT = 0.775
const MUTUELLE_EMPLOYEUR = 50

const SLIDER_MIN = Math.round(SMIC_MENSUEL_2026)
const SLIDER_MAX = 10000

const GRILLE_ALTERNANCE: Record<string, Record<number, number>> = {
    moins18: { 1: 0.27, 2: 0.39, 3: 0.55 },
    '18-20': { 1: 0.43, 2: 0.51, 3: 0.67 },
    '21-25': { 1: 0.53, 2: 0.61, 3: 0.78 },
    '26plus': { 1: 1.0, 2: 1.0, 3: 1.0 },
}

type TailleEntreprise = 'small' | 'large'
type TrancheAgeAlternance = keyof typeof GRILLE_ALTERNANCE

export interface VentilationCharges {
    maladie: number
    retraite: number
    chomage: number
    formation: number
    autres: number
}

export interface CalculCoutResult {
    coutMois: number
    coutAnnuel: number
    netMensuel: number
    netAnnuel: number
    chargesBrutes: number
    chargesNettes: number
    reductionRGDU: number
    tauxEffectif: number
    mutuelle: number
    ventilation: VentilationCharges
    ratio: number
}

const formatEur = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

function calculateRGDU(salaireBrutMensuel: number, tdelta: number): number {
    const RAB = salaireBrutMensuel * 12
    if (RAB >= SMIC_ANNUEL_2026 * 3) {
        return Math.round((TMIN * RAB) / 12)
    }
    const T = (1 / 2) * (3 * SMIC_ANNUEL_2026 / RAB - 1)
    const coeff = TMIN + tdelta * Math.pow(T, P)
    const coeffFinal = Math.min(Math.max(coeff, TMIN), TMIN + tdelta)
    return Math.round((coeffFinal * RAB) / 12)
}

function calculateChargesBrutes(salaireBrutMensuel: number): number {
    const sousPlafond = Math.min(salaireBrutMensuel, PLAFOND_SS_MENSUEL_2026)
    const surPlafond = Math.max(0, salaireBrutMensuel - PLAFOND_SS_MENSUEL_2026)
    return Math.round(
        sousPlafond * TAUX_BRUT_PATRONAL_SOUS_PLAFOND +
            surPlafond * TAUX_BRUT_PATRONAL_SUR_PLAFOND
    )
}

function buildVentilation(salaireBrutMensuel: number, chargesNettes: number): VentilationCharges {
    const maladie = Math.round(salaireBrutMensuel * 0.13)
    const retraite = Math.round(salaireBrutMensuel * 0.17)
    const chomage = Math.round(salaireBrutMensuel * 0.0405)
    const formation = Math.round(salaireBrutMensuel * 0.0155)
    const autres = chargesNettes - maladie - retraite - chomage - formation
    return { maladie, retraite, chomage, formation, autres }
}

function calculateCout(
    salaireBrutMensuel: number,
    mutuelleActive: boolean,
    tdelta: number,
    options?: { exonerationCharges?: boolean }
): CalculCoutResult {
    const chargesBrutes = options?.exonerationCharges
        ? 0
        : calculateChargesBrutes(salaireBrutMensuel)
    const reductionRGDU = options?.exonerationCharges
        ? 0
        : calculateRGDU(salaireBrutMensuel, tdelta)
    const chargesNettes = Math.max(0, chargesBrutes - reductionRGDU)
    const mutuelle = mutuelleActive ? MUTUELLE_EMPLOYEUR : 0
    const coutMois = salaireBrutMensuel + chargesNettes + mutuelle
    const coutAnnuel = coutMois * 12
    const netMensuel = Math.round(salaireBrutMensuel * TAUX_NET_BRUT)
    const netAnnuel = netMensuel * 12
    const ratio = netMensuel > 0 ? coutMois / netMensuel : 0
    const tauxEffectif =
        salaireBrutMensuel > 0 ? Math.round((chargesNettes / salaireBrutMensuel) * 100) : 0
    const ventilation = buildVentilation(salaireBrutMensuel, chargesNettes)

    return {
        coutMois,
        coutAnnuel,
        netMensuel,
        netAnnuel,
        chargesBrutes,
        chargesNettes,
        reductionRGDU,
        tauxEffectif,
        mutuelle,
        ventilation,
        ratio,
    }
}

function FieldTooltip({ text }: { text: string }) {
    return (
        <span className="inline-flex ml-1.5 align-middle cursor-help" title={text}>
            <HelpCircle className="w-3.5 h-3.5 text-tertiary" aria-hidden />
        </span>
    )
}

function CollapsibleSection({
    title,
    defaultOpen = false,
    children,
}: {
    title: string
    defaultOpen?: boolean
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className="surface rounded-2xl border border-slate-200 overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50/80 transition-colors"
            >
                <span className="text-sm font-semibold text-primary">{title}</span>
                <ChevronDown
                    className={`w-5 h-5 text-tertiary transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && <div className="px-6 pb-6 border-t border-slate-100">{children}</div>}
        </div>
    )
}

function ResultRow({
    label,
    value,
    bold,
    highlight,
    negative,
    muted,
}: {
    label: string
    value: string
    bold?: boolean
    highlight?: boolean
    negative?: boolean
    muted?: boolean
}) {
    return (
        <div
            className={`flex items-center justify-between py-3 border-b border-slate-100 ${
                highlight ? 'bg-emerald-50/60 rounded-lg px-2 -mx-2' : ''
            } ${muted ? 'opacity-50' : ''}`}
        >
            <span
                className={`text-sm ${bold ? 'font-bold text-primary' : highlight ? 'font-medium text-emerald-700' : 'text-secondary'}`}
            >
                {label}
            </span>
            <span
                className={`font-semibold ${
                    bold
                        ? 'text-xl text-accent-primary'
                        : negative
                          ? 'text-emerald-600'
                          : highlight
                            ? 'text-emerald-600'
                            : 'text-primary'
                }`}
            >
                {value}
            </span>
        </div>
    )
}

function InlineGateBlock({
    gateEmail,
    setGateEmail,
    gateSending,
    gateSent,
    gateError,
    onSubmit,
}: {
    gateEmail: string
    setGateEmail: (v: string) => void
    gateSending: boolean
    gateSent: boolean
    gateError: string
    onSubmit: (e: React.FormEvent) => void
}) {
    if (gateSent) {
        return (
            <div className="text-center py-6">
                <Mail className="w-10 h-10 text-accent-primary mx-auto mb-4" />
                <p className="text-sm font-semibold text-primary mb-2">Vérifiez votre email</p>
                <p className="text-sm text-secondary">
                    Lien envoyé à <strong className="text-primary">{gateEmail}</strong>. Cliquez pour débloquer
                    l&apos;analyse complète sur cette page.
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4 max-w-md mx-auto">
            {gateError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                    {gateError}
                </p>
            )}
            <div>
                <label htmlFor="gate-email" className="block text-sm font-medium text-secondary mb-1.5">
                    Email professionnel
                </label>
                <input
                    id="gate-email"
                    type="email"
                    value={gateEmail}
                    onChange={(e) => setGateEmail(e.target.value)}
                    placeholder="vous@entreprise.com"
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary"
                />
            </div>
            <button
                type="submit"
                disabled={gateSending || !gateEmail}
                className="w-full bg-accent-primary hover:bg-accent-primary-hover disabled:opacity-50 text-slate-900 font-bold rounded-xl py-3 text-sm transition-colors"
            >
                {gateSending ? 'Envoi en cours…' : 'Recevoir mon analyse gratuite →'}
            </button>
            <p className="text-xs text-tertiary text-center">
                Lien valable 24h · Aucun spam · Accès immédiat
            </p>
        </form>
    )
}

interface SimulateurCoutSalarieContentProps {
    hasAccess: boolean
}

export default function SimulateurCoutSalarieContent({ hasAccess }: SimulateurCoutSalarieContentProps) {
    const [hasFullAccess, setHasFullAccess] = useState(hasAccess)
    const [brutMensuel, setBrutMensuel] = useState(3000)
    const [mutuelleActive, setMutuelleActive] = useState(true)
    const [tailleEntreprise, setTailleEntreprise] = useState<TailleEntreprise>('small')
    const [trancheAgeAlternance, setTrancheAgeAlternance] = useState<TrancheAgeAlternance>('21-25')
    const [anneeContrat, setAnneeContrat] = useState<1 | 2 | 3>(1)
    const [tjm, setTjm] = useState(500)
    const [joursMois, setJoursMois] = useState(18)
    const [augmentationPct, setAugmentationPct] = useState(5)

    const [gateEmail, setGateEmail] = useState('')
    const [gateSending, setGateSending] = useState(false)
    const [gateSent, setGateSent] = useState(false)
    const [gateError, setGateError] = useState('')

    useEffect(() => {
        setHasFullAccess(hasAccess)
    }, [hasAccess])

    const tdelta = tailleEntreprise === 'small' ? TDELTA_FNAL_SMALL : TDELTA_FNAL_LARGE

    const calcul = useMemo(
        () => calculateCout(brutMensuel, mutuelleActive, tdelta),
        [brutMensuel, mutuelleActive, tdelta]
    )

    const calculSmic = useMemo(
        () => calculateCout(SMIC_MENSUEL_2026, false, tdelta),
        [tdelta]
    )

    const pctRgduCharges =
        calcul.chargesBrutes > 0
            ? Math.round((calcul.reductionRGDU / calcul.chargesBrutes) * 100)
            : 0

    const pctRgduSmic =
        calculSmic.chargesBrutes > 0
            ? Math.round((calculSmic.reductionRGDU / calculSmic.chargesBrutes) * 100)
            : 0

    const alternanceBrut = useMemo(() => {
        const pct = GRILLE_ALTERNANCE[trancheAgeAlternance][anneeContrat]
        return Math.round(SMIC_MENSUEL_2026 * pct * 100) / 100
    }, [trancheAgeAlternance, anneeContrat])

    const calculAlternance = useMemo(() => {
        const exoneration = alternanceBrut < SMIC_MENSUEL_2026
        return calculateCout(alternanceBrut, mutuelleActive, tdelta, {
            exonerationCharges: exoneration,
        })
    }, [alternanceBrut, mutuelleActive, tdelta])

    const calculAugmentation = useMemo(() => {
        const nouveauBrut = Math.round(brutMensuel * (1 + augmentationPct / 100))
        const nouveau = calculateCout(nouveauBrut, mutuelleActive, tdelta)
        const deltaMois = nouveau.coutMois - calcul.coutMois
        const deltaAn = deltaMois * 12
        return { nouveauBrut, nouveau, deltaMois, deltaAn }
    }, [brutMensuel, augmentationPct, mutuelleActive, tdelta, calcul.coutMois])

    const coutFreelanceMois = tjm * joursMois
    const coutFreelanceAn = coutFreelanceMois * 12
    const equivalentBrutMensuelFreelance =
        calcul.ratio > 0 ? Math.round(coutFreelanceMois / calcul.ratio) : 0
    const ratioFreelanceVsCdi = calcul.coutMois > 0 ? coutFreelanceMois / calcul.coutMois : 0

    const chargesGlobales = calcul.chargesNettes + calcul.mutuelle

    const chartSimpleData = [
        { name: 'Salaire net', value: calcul.netMensuel, color: '#10b981' },
        { name: 'Charges', value: chargesGlobales, color: '#f97316' },
    ]

    const sliderPct = ((brutMensuel - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100

    const scrollToZoneB = useCallback(() => {
        document.getElementById('analyse-complete')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, [])

    async function handleGateSubmit(e: React.FormEvent) {
        e.preventDefault()
        setGateSending(true)
        setGateError('')
        try {
            const res = await fetch('/api/simulateurs/request-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: gateEmail.trim().toLowerCase() }),
            })
            const data = await res.json()
            if (!res.ok) {
                setGateError(data.error || 'Erreur inconnue.')
            } else {
                setGateSent(true)
            }
        } catch {
            setGateError('Erreur réseau. Vérifiez votre connexion.')
        } finally {
            setGateSending(false)
        }
    }

    return (
        <>
            <div className="grid lg:grid-cols-5 gap-8">
                {/* ─── Inputs (libres) ─── */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="surface rounded-2xl p-6 border border-slate-200">
                        <label className="block text-sm font-semibold text-primary mb-1">
                            Salaire brut mensuel
                        </label>
                        <div className="text-3xl font-bold text-accent-primary mb-4">
                            {formatEur(brutMensuel)}
                        </div>
                        <input
                            type="range"
                            min={SLIDER_MIN}
                            max={SLIDER_MAX}
                            step={100}
                            value={brutMensuel}
                            onChange={(e) => setBrutMensuel(Number(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-400"
                            style={{
                                background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${sliderPct}%, #e2e8f0 ${sliderPct}%, #e2e8f0 100%)`,
                            }}
                        />
                        <div className="flex justify-between text-xs text-tertiary mt-2">
                            <span>1 823 € (SMIC)</span>
                            <span>10 000 €</span>
                        </div>
                        {Math.round(brutMensuel) < Math.round(SMIC_MENSUEL_2026) && (
                            <p className="mt-3 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 leading-relaxed">
                                <strong>Attention :</strong> ce salaire est inférieur au SMIC 2026 (1 823 €/mois).
                                Applicable uniquement en temps partiel ou apprentissage.
                            </p>
                        )}
                        {brutMensuel >= SLIDER_MAX && (
                            <p className="mt-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 leading-relaxed">
                                Au-delà de 10 000 €/mois, consultez un expert-comptable pour les cotisations
                                spécifiques cadres dirigeants.
                            </p>
                        )}
                    </div>

                    <div className="surface rounded-2xl p-6 border border-slate-200">
                        <label className="text-sm font-semibold text-primary block mb-3">
                            Taille de l&apos;entreprise
                            <FieldTooltip text="Détermine le taux FNAL applicable et le barème RGDU (réduction générale Fillon)." />
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setTailleEntreprise('small')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                    tailleEntreprise === 'small'
                                        ? 'bg-accent-primary text-slate-900'
                                        : 'bg-slate-100 text-secondary hover:bg-slate-200'
                                }`}
                            >
                                &lt; 250 salariés
                            </button>
                            <button
                                type="button"
                                onClick={() => setTailleEntreprise('large')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                    tailleEntreprise === 'large'
                                        ? 'bg-accent-primary text-slate-900'
                                        : 'bg-slate-100 text-secondary hover:bg-slate-200'
                                }`}
                            >
                                ≥ 250 salariés
                            </button>
                        </div>
                        <p className="text-xs text-tertiary mt-2">
                            FNAL {tailleEntreprise === 'small' ? '0,10 %' : '0,50 %'}
                        </p>
                    </div>

                    <div className="surface rounded-2xl p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-semibold text-primary block">
                                    Mutuelle employeur
                                </label>
                                <span className="text-xs text-tertiary">Part patronale moyenne : 50 €/mois</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMutuelleActive(!mutuelleActive)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    mutuelleActive ? 'bg-accent-primary' : 'bg-slate-200'
                                }`}
                                aria-pressed={mutuelleActive}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                        mutuelleActive ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ─── Zone A : résultats publics ─── */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="surface rounded-2xl p-6 border border-slate-200">
                        <p className="text-xs font-semibold text-tertiary uppercase tracking-wider mb-2">
                            Coût employeur estimé
                        </p>
                        <p className="text-4xl sm:text-5xl font-bold text-accent-primary mb-1">
                            {formatEur(calcul.coutMois)}
                            <span className="text-lg font-semibold text-tertiary ml-2">/ mois</span>
                        </p>
                        <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                            <div>
                                <p className="text-xs text-tertiary mb-1">Coût annuel</p>
                                <p className="text-lg font-bold text-primary">{formatEur(calcul.coutAnnuel)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-tertiary mb-1">Salaire net estimé</p>
                                <p className="text-lg font-bold text-primary">{formatEur(calcul.netMensuel)}/mois</p>
                            </div>
                            <div>
                                <p className="text-xs text-tertiary mb-1">Ratio coût / net</p>
                                <p className="text-lg font-bold text-primary">× {calcul.ratio.toFixed(1)}</p>
                            </div>
                        </div>
                        <p className="mt-5 text-sm text-secondary leading-relaxed">
                            Pour <strong>{formatEur(brutMensuel)}</strong> brut, vous payez{' '}
                            <strong>{formatEur(calcul.coutMois)}/mois</strong> de coût employeur total
                            (charges incluses).
                        </p>
                        {!hasFullAccess && calcul.reductionRGDU > 0 && (
                            <button
                                type="button"
                                onClick={scrollToZoneB}
                                className="mt-3 text-sm text-emerald-700 font-medium hover:text-emerald-800 transition-colors"
                            >
                                Dont {formatEur(calcul.reductionRGDU)} de réduction RGDU — voir le détail →
                            </button>
                        )}
                    </div>

                    <div className="surface rounded-2xl p-6 border border-slate-200">
                        <h2 className="text-sm font-semibold text-tertiary uppercase tracking-wider mb-4">
                            Net vs charges (mensuel)
                        </h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={chartSimpleData} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`}
                                />
                                <Tooltip
                                    formatter={(value: number) => formatEur(value)}
                                    cursor={{ fill: 'rgba(100,116,139,0.05)' }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={56}>
                                    <LabelList
                                        dataKey="value"
                                        position="top"
                                        formatter={(v) => {
                                            const n = typeof v === 'number' ? v : Number(v)
                                            return n >= 300 ? formatEur(n) : ''
                                        }}
                                        style={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                                    />
                                    {chartSimpleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ─── Zone B : analyse complète ou gate inline ─── */}
            <div id="analyse-complete" className="mt-10 scroll-mt-8">
                {hasFullAccess ? (
                    <div className="space-y-6">
                        <div className="surface rounded-2xl p-6 border border-slate-200">
                            <h2 className="text-sm font-semibold text-tertiary uppercase tracking-wider mb-5">
                                Décomposition du coût employeur
                            </h2>
                            <div className="space-y-0">
                                <ResultRow label="Salaire brut" value={formatEur(brutMensuel)} />
                                <ResultRow
                                    label="Maladie / AT / Famille"
                                    value={`+ ${formatEur(calcul.ventilation.maladie)}`}
                                />
                                <ResultRow
                                    label="Retraite (base + complémentaire)"
                                    value={`+ ${formatEur(calcul.ventilation.retraite)}`}
                                />
                                <ResultRow label="Chômage" value={`+ ${formatEur(calcul.ventilation.chomage)}`} />
                                <ResultRow
                                    label="Formation / Apprentissage"
                                    value={`+ ${formatEur(calcul.ventilation.formation)}`}
                                />
                                <ResultRow
                                    label="Autres cotisations"
                                    value={`+ ${formatEur(calcul.ventilation.autres)}`}
                                />
                                <ResultRow
                                    label="Charges brutes total"
                                    value={`+ ${formatEur(calcul.chargesBrutes)}`}
                                    bold
                                />
                                <ResultRow
                                    label="Réduction RGDU"
                                    value={`− ${formatEur(calcul.reductionRGDU)}`}
                                    highlight
                                    negative
                                />
                                <ResultRow
                                    label="Mutuelle employeur"
                                    value={mutuelleActive ? `+ ${formatEur(calcul.mutuelle)}` : '—'}
                                    muted={!mutuelleActive}
                                />
                                <ResultRow
                                    label="Coût employeur total"
                                    value={formatEur(calcul.coutMois)}
                                    bold
                                />
                                <ResultRow label="Salaire net estimé" value={formatEur(calcul.netMensuel)} />
                            </div>

                            <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                <p className="text-sm font-semibold text-emerald-800 mb-1">Réduction RGDU détaillée</p>
                                <p className="text-sm text-emerald-700">
                                    <strong>{formatEur(calcul.reductionRGDU)}/mois</strong> soit{' '}
                                    <strong>{pctRgduCharges}%</strong> de vos charges brutes ({formatEur(calcul.chargesBrutes)}).
                                </p>
                                <p className="text-xs text-emerald-600 mt-2">
                                    Au SMIC : {formatEur(calculSmic.reductionRGDU)}/mois ({pctRgduSmic}% des charges brutes) ·
                                    Taux effectif charges nettes : {calcul.tauxEffectif}%
                                </p>
                            </div>

                            <p className="text-xs text-tertiary mt-4 leading-relaxed border-t border-slate-100 pt-4">
                                Simulation indicative basée sur les barèmes LFSS 2026. Hors prévoyance obligatoire
                                cadres, APEC, et spécificités conventionnelles. Consultez votre expert-comptable pour
                                un calcul de paie précis.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <CollapsibleSection title="Comparer avec d'autres formes d'emploi">
                                <div className="space-y-6 pt-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-primary mb-3">Alternance (apprenti)</h3>
                                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-xs font-medium text-secondary mb-1.5">
                                                    Tranche d&apos;âge
                                                    <FieldTooltip text="Détermine le % du SMIC légal pour la rémunération minimale de l'apprenti." />
                                                </label>
                                                <select
                                                    value={trancheAgeAlternance}
                                                    onChange={(e) =>
                                                        setTrancheAgeAlternance(
                                                            e.target.value as TrancheAgeAlternance
                                                        )
                                                    }
                                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
                                                >
                                                    <option value="moins18">Moins de 18 ans</option>
                                                    <option value="18-20">18 à 20 ans</option>
                                                    <option value="21-25">21 à 25 ans</option>
                                                    <option value="26plus">26 ans et plus</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-secondary mb-1.5">
                                                    Année de contrat
                                                </label>
                                                <select
                                                    value={anneeContrat}
                                                    onChange={(e) =>
                                                        setAnneeContrat(Number(e.target.value) as 1 | 2 | 3)
                                                    }
                                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
                                                >
                                                    <option value={1}>1ère année</option>
                                                    <option value={2}>2ème année</option>
                                                    <option value={3}>3ème année</option>
                                                </select>
                                            </div>
                                        </div>
                                        {alternanceBrut < SMIC_MENSUEL_2026 && (
                                            <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-3">
                                                Exonération totale des charges patronales (rémunération &lt; 1 SMIC).
                                            </p>
                                        )}
                                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                <p className="text-xs text-tertiary uppercase tracking-wider mb-2">
                                                    CDI (cible)
                                                </p>
                                                <p className="text-secondary">Brut : {formatEur(brutMensuel)}</p>
                                                <p className="font-bold text-primary mt-1">
                                                    Coût : {formatEur(calcul.coutMois)}/mois
                                                </p>
                                            </div>
                                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                                <p className="text-xs text-emerald-700 uppercase tracking-wider mb-2">
                                                    Alternance
                                                </p>
                                                <p className="text-emerald-800">Brut : {formatEur(alternanceBrut)}</p>
                                                <p className="font-bold text-emerald-900 mt-1">
                                                    Coût : {formatEur(calculAlternance.coutMois)}/mois
                                                </p>
                                                <p className="text-xs text-emerald-700 mt-2">
                                                    Économie vs CDI :{' '}
                                                    {formatEur(
                                                        Math.max(0, calcul.coutMois - calculAlternance.coutMois)
                                                    )}
                                                    /mois
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 pt-6">
                                        <h3 className="text-sm font-semibold text-primary mb-3">Freelance / portage</h3>
                                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-xs font-medium text-secondary mb-1.5">
                                                    TJM (€/jour)
                                                    <FieldTooltip text="Tarif journalier moyen facturé en portage salarial ou freelance." />
                                                </label>
                                                <input
                                                    type="number"
                                                    min={200}
                                                    max={2000}
                                                    step={50}
                                                    value={tjm}
                                                    onChange={(e) => setTjm(Number(e.target.value) || 0)}
                                                    placeholder="500"
                                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-secondary mb-1.5">
                                                    Jours facturés / mois
                                                    <FieldTooltip text="Nombre de jours travaillés et facturés par mois (défaut : 18)." />
                                                </label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={22}
                                                    value={joursMois}
                                                    onChange={(e) => setJoursMois(Number(e.target.value) || 18)}
                                                    placeholder="18"
                                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm space-y-1">
                                            <p>
                                                <span className="text-secondary">Coût mensuel estimé :</span>{' '}
                                                <strong>{formatEur(coutFreelanceMois)}</strong>
                                            </p>
                                            <p>
                                                <span className="text-secondary">Coût annuel :</span>{' '}
                                                <strong>{formatEur(coutFreelanceAn)}</strong>
                                            </p>
                                            <p>
                                                <span className="text-secondary">
                                                    Équivalent brut mensuel (vs ratio CDI) :
                                                </span>{' '}
                                                <strong>{formatEur(equivalentBrutMensuelFreelance)}</strong>
                                            </p>
                                            <p>
                                                <span className="text-secondary">Ratio vs coût CDI actuel :</span>{' '}
                                                <strong>× {ratioFreelanceVsCdi.toFixed(2)}</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleSection>

                            <CollapsibleSection title="Simuler une augmentation">
                                <div className="pt-4 space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-primary block mb-2">
                                            Augmentation : +{augmentationPct}%
                                        </label>
                                        <input
                                            type="range"
                                            min={1}
                                            max={30}
                                            step={1}
                                            value={augmentationPct}
                                            onChange={(e) => setAugmentationPct(Number(e.target.value))}
                                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-400"
                                        />
                                        <div className="flex justify-between text-xs text-tertiary mt-1">
                                            <span>+1%</span>
                                            <span>+30%</span>
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-xs text-tertiary mb-1">Nouveau brut</p>
                                            <p className="font-bold text-lg">
                                                {formatEur(calculAugmentation.nouveauBrut)}
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-xs text-tertiary mb-1">Nouveau coût employeur</p>
                                            <p className="font-bold text-lg">
                                                {formatEur(calculAugmentation.nouveau.coutMois)}/mois
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-primary bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                                        Une augmentation de <strong>{augmentationPct}%</strong> représente{' '}
                                        <strong>{formatEur(calculAugmentation.deltaMois)}/mois</strong> de coût
                                        supplémentaire pour l&apos;entreprise (
                                        {formatEur(calculAugmentation.deltaAn)}/an).
                                    </p>
                                </div>
                            </CollapsibleSection>

                            <div className="surface rounded-2xl p-6 border border-slate-200 border-dashed">
                                <p className="text-sm font-semibold text-primary mb-1">Export PDF</p>
                                <p className="text-xs text-tertiary mb-3">
                                    Téléchargez une synthèse partageable avec votre expert-comptable.
                                </p>
                                <button
                                    type="button"
                                    disabled
                                    className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-100 text-tertiary cursor-not-allowed"
                                >
                                    Bientôt disponible
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="surface rounded-2xl p-8 md:p-10 border border-slate-200 bg-gray-50/80">
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto mb-5">
                                <Lock className="w-5 h-5 text-tertiary" />
                            </div>
                            <h2 className="text-xl font-bold text-primary mb-2">
                                Débloquez l&apos;analyse complète
                            </h2>
                            <p className="text-sm text-secondary max-w-lg mx-auto leading-relaxed">
                                Ventilation des charges, comparateur CDI/alternance/freelance, simulation
                                d&apos;augmentation et export PDF.
                            </p>
                        </div>
                        <InlineGateBlock
                            gateEmail={gateEmail}
                            setGateEmail={setGateEmail}
                            gateSending={gateSending}
                            gateSent={gateSent}
                            gateError={gateError}
                            onSubmit={handleGateSubmit}
                        />
                    </div>
                )}
            </div>

            <div className="mt-8 flex items-start gap-3 p-5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p>
                    <strong>Estimation indicative.</strong> Calcul basé sur la <strong>RGDU 2026</strong> (ex-réduction
                    Fillon), entrée en vigueur le 1er janvier 2026. Valable pour les entreprises au{' '}
                    <strong>FNAL 0,10 %</strong> (généralement &lt;250 salariés) ou FNAL 0,50 % selon votre sélection.
                    Plafond SS 2026 : {formatEur(PLAFOND_SS_MENSUEL_2026)}/mois. Le coût réel dépend de votre convention
                    collective. Non-cadre par défaut — cadres : APEC et prévoyance (+30 à +80 €/mois estimés).{' '}
                    <span className="text-amber-700">
                        Source : service-public.fr, décret n°2025-1446 du 31 décembre 2025.
                    </span>
                </p>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-5">
                <div className="surface rounded-2xl p-6 border border-emerald-200 bg-emerald-50">
                    <p className="font-bold text-emerald-900 mb-1">Vous recrutez votre premier salarié ?</p>
                    <p className="text-sm text-emerald-800 mb-4">
                        Découvrez PayFit pour automatiser vos fiches de paie dès le premier mois.
                    </p>
                    <Link
                        href="https://payfit.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors text-sm"
                    >
                        Découvrir PayFit - 2 mois offerts
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="surface rounded-2xl p-6 border border-slate-200 bg-slate-900">
                    <p className="font-bold text-white mb-1">Recrutement, trésorerie, marges...</p>
                    <p className="text-sm text-slate-300 mb-4">
                        Un consultant BI Finance vous aide à modéliser l&apos;impact réel avant de signer.
                    </p>
                    <Link
                        href="/consulting"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-primary text-slate-900 font-semibold rounded-xl hover:bg-accent-primary-hover transition-colors text-sm"
                    >
                        Demander un devis BI Finance
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </>
    )
}
