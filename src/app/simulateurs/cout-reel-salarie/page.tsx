'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Users, Info, AlertTriangle } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// ─── Constantes de calcul ───────────────────────────────────────────
const CHARGES_NON_CADRE = 0.42
const CHARGES_CADRE = 0.45
const TAUX_NET_BRUT = 0.775   // ~22.5% de cotisations salariales → net ≈ 77.5% du brut
const MUTUELLE_EMPLOYEUR = 50  // €/mois

const formatEur = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

// ─── Tooltip recharts custom ────────────────────────────────────────
function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-xl text-sm">
                <p className="text-slate-300 font-semibold mb-1">{payload[0].payload.name}</p>
                <p className="text-white font-bold text-lg">{formatEur(payload[0].value)}</p>
                <p className="text-slate-400 text-xs">{payload[0].payload.label}</p>
            </div>
        )
    }
    return null
}

export default function SimulateurCoutSalarie() {
    const [brutMensuel, setBrutMensuel] = useState(3000)
    const [isCadre, setIsCadre] = useState(false)
    const [mutuellActive, setMutuelleActive] = useState(true)

    const calcul = useMemo(() => {
        const tauxCharges = isCadre ? CHARGES_CADRE : CHARGES_NON_CADRE
        const chargesPatronales = Math.round(brutMensuel * tauxCharges)
        const mutuelle = mutuellActive ? MUTUELLE_EMPLOYEUR : 0
        const coutMois = brutMensuel + chargesPatronales + mutuelle
        const coutAn = coutMois * 12
        const netMensuel = Math.round(brutMensuel * TAUX_NET_BRUT)
        const ratio = coutMois / netMensuel

        return { chargesPatronales, mutuelle, coutMois, coutAn, netMensuel, ratio }
    }, [brutMensuel, isCadre, mutuellActive])

    const chartData = [
        { name: 'Salaire net', value: calcul.netMensuel, color: '#10b981', label: 'Ce que perçoit le salarié' },
        { name: 'Salaire brut', value: brutMensuel, color: '#f59e0b', label: 'Base de calcul des charges' },
        { name: 'Coût employeur', value: calcul.coutMois, color: '#d4af37', label: 'Ce que ça coûte réellement' },
    ]

    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <div className="max-w-5xl mx-auto px-6 py-16">

                {/* Retour */}
                <Link
                    href="/simulateurs"
                    className="inline-flex items-center gap-2 text-secondary hover:text-accent-primary transition-colors mb-8 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux simulateurs
                </Link>

                {/* En-tête */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <Users className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full">
                            Recrutement
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-3">
                        Simulateur coût réel d&apos;un salarié
                    </h1>
                    <p className="text-secondary text-lg max-w-2xl">
                        Ajustez le salaire brut et obtenez instantanément le vrai coût pour votre entreprise —
                        charges patronales, mutuelle et coût annuel inclus.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">

                    {/* ─── Colonne gauche : Inputs ─── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Slider salaire brut */}
                        <div className="surface rounded-2xl p-6 border border-slate-200">
                            <label className="block text-sm font-semibold text-primary mb-1">
                                Salaire brut mensuel
                            </label>
                            <div className="text-3xl font-bold text-accent-primary mb-4">
                                {formatEur(brutMensuel)}
                            </div>
                            <input
                                type="range"
                                min={1500}
                                max={10000}
                                step={100}
                                value={brutMensuel}
                                onChange={(e) => setBrutMensuel(Number(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-400"
                                style={{
                                    background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${((brutMensuel - 1500) / 8500) * 100}%, #e2e8f0 ${((brutMensuel - 1500) / 8500) * 100}%, #e2e8f0 100%)`
                                }}
                            />
                            <div className="flex justify-between text-xs text-tertiary mt-2">
                                <span>1 500 €</span>
                                <span>10 000 €</span>
                            </div>
                        </div>

                        {/* Toggle Cadre / Non-cadre */}
                        <div className="surface rounded-2xl p-6 border border-slate-200">
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-sm font-semibold text-primary">Statut</label>
                                <div className="flex items-center gap-1 text-xs text-tertiary">
                                    <Info className="w-3 h-3" />
                                    <span>Convention SYNTEC</span>
                                </div>
                            </div>
                            <div className="flex rounded-xl overflow-hidden border border-slate-200 mt-3">
                                <button
                                    onClick={() => setIsCadre(false)}
                                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                                        !isCadre
                                            ? 'bg-accent-primary text-slate-900'
                                            : 'text-secondary hover:bg-slate-50'
                                    }`}
                                >
                                    Non-cadre
                                </button>
                                <button
                                    onClick={() => setIsCadre(true)}
                                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                                        isCadre
                                            ? 'bg-accent-primary text-slate-900'
                                            : 'text-secondary hover:bg-slate-50'
                                    }`}
                                >
                                    Cadre
                                </button>
                            </div>
                            <p className="text-xs text-tertiary mt-2">
                                Taux charges : {isCadre ? '~45%' : '~42%'} du brut
                            </p>
                        </div>

                        {/* Toggle Mutuelle */}
                        <div className="surface rounded-2xl p-6 border border-slate-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-semibold text-primary block">
                                        Mutuelle employeur
                                    </label>
                                    <span className="text-xs text-tertiary">Part patronale moyenne : 50 €/mois</span>
                                </div>
                                <button
                                    onClick={() => setMutuelleActive(!mutuellActive)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        mutuellActive ? 'bg-accent-primary' : 'bg-slate-200'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                            mutuellActive ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ─── Colonne droite : Outputs ─── */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Résultats chiffrés */}
                        <div className="surface rounded-2xl p-6 border border-slate-200">
                            <h2 className="text-sm font-semibold text-tertiary uppercase tracking-wider mb-5">
                                Décomposition du coût mensuel
                            </h2>

                            <div className="space-y-3">
                                {/* Salaire brut */}
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-secondary text-sm">Salaire brut</span>
                                    <span className="font-semibold text-primary">{formatEur(brutMensuel)}</span>
                                </div>
                                {/* Charges patronales */}
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className="text-secondary text-sm">
                                        Charges patronales ({isCadre ? '45%' : '42%'})
                                    </span>
                                    <span className="font-semibold text-orange-600">+ {formatEur(calcul.chargesPatronales)}</span>
                                </div>
                                {/* Mutuelle */}
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <span className={`text-sm ${mutuellActive ? 'text-secondary' : 'text-tertiary line-through'}`}>
                                        Mutuelle employeur
                                    </span>
                                    <span className={`font-semibold ${mutuellActive ? 'text-orange-600' : 'text-tertiary'}`}>
                                        {mutuellActive ? `+ ${formatEur(calcul.mutuelle)}` : '—'}
                                    </span>
                                </div>

                                {/* Total mois */}
                                <div className="flex items-center justify-between pt-3">
                                    <span className="font-bold text-primary">Coût employeur / mois</span>
                                    <span className="text-2xl font-bold text-accent-primary">{formatEur(calcul.coutMois)}</span>
                                </div>
                                {/* Total an */}
                                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                    <span className="font-bold text-primary">Coût employeur / an</span>
                                    <span className="text-xl font-bold text-primary">{formatEur(calcul.coutAn)}</span>
                                </div>

                                {/* Ratio */}
                                <div className="flex items-start justify-between pt-3 bg-slate-50 rounded-xl p-4 -mx-1">
                                    <div>
                                        <span className="text-sm font-semibold text-slate-700 block">Ratio coût / net perçu</span>
                                        <span className="text-xs text-tertiary">
                                            Salaire net estimé : {formatEur(calcul.netMensuel)}/mois
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-slate-800">
                                            ×&nbsp;{calcul.ratio.toFixed(2)}
                                        </span>
                                        <span className="text-xs text-tertiary block">
                                            Pour 1€ net, vous payez {formatEur(calcul.ratio)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Graphique */}
                        <div className="surface rounded-2xl p-6 border border-slate-200">
                            <h2 className="text-sm font-semibold text-tertiary uppercase tracking-wider mb-5">
                                Comparaison net / brut / coût employeur
                            </h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={chartData} barCategoryGap="30%">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100,116,139,0.05)' }} />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap gap-4 mt-4">
                                {chartData.map((d) => (
                                    <div key={d.name} className="flex items-center gap-2 text-xs text-secondary">
                                        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                                        {d.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 flex items-start gap-3 p-5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p>
                        <strong>Estimation indicative.</strong> Ces calculs sont basés sur des taux moyens de charges patronales.
                        Le coût réel dépend de votre convention collective, de votre secteur et de vos accords d&apos;entreprise.
                        Consultez votre expert-comptable pour une simulation précise.
                    </p>
                </div>

                {/* CTA */}
                <div className="mt-8 grid sm:grid-cols-2 gap-5">
                    {/* CTA affilié PayFit */}
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
                            Découvrir PayFit — 2 mois offerts
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* CTA FinSight */}
                    <div className="surface rounded-2xl p-6 border border-slate-200 bg-slate-900">
                        <p className="font-bold text-white mb-1">Recrutement, trésorerie, marges...</p>
                        <p className="text-sm text-slate-300 mb-4">
                            Un DAF externalisé vous aide à modéliser l&apos;impact réel avant de signer.
                        </p>
                        <Link
                            href="/consulting"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-primary text-slate-900 font-semibold rounded-xl hover:bg-accent-primary-hover transition-colors text-sm"
                        >
                            Parler à un DAF externalisé
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    )
}
