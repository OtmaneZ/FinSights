'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowRight, CalendarClock, CheckCircle, Flame } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { generateHowToJsonLd } from '@/lib/seo'
import { trackCalculatorUse } from '@/lib/analytics'
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory'
import EmailCaptureModal from '@/components/EmailCaptureModal'
import PremiumUpsellCard from '@/components/PremiumUpsellCard'

export default function CalculateurBurnRate() {
    const [tresorerie, setTresorerie] = useState('')
    const [depenses, setDepenses] = useState('')
    const [revenus, setRevenus] = useState('')
    const [result, setResult] = useState<{ burnNet: number; runway: number | null; rupture: string | null } | null>(null)
    const { saveCalculation } = useCalculatorHistory()

    const structuredData = generateHowToJsonLd({
        name: 'Calculateur Burn Rate et Runway',
        description: 'Calculez votre burn rate net, votre runway et votre date de rupture cash',
        slug: 'burn-rate',
        steps: [
            { name: 'Saisir trésorerie', text: 'Solde de cash disponible en début de mois.' },
            { name: 'Saisir dépenses et revenus', text: 'Montants mensuels récurrents.' },
            { name: 'Calculer burn net', text: 'Burn net = dépenses - revenus.' },
            { name: 'Calculer runway', text: 'Runway = trésorerie / burn net (si burn positif).' },
        ],
    })

    const interpretation = useMemo(() => {
        if (!result) return null
        if (result.burnNet <= 0) return { title: 'Vert', cls: 'bg-green-50 border-green-200 text-green-700', icon: CheckCircle, text: 'Cash-flow net positif ou neutre: pas de rupture à horizon prévisible.' }
        if ((result.runway ?? 0) >= 9) return { title: 'Vert', cls: 'bg-green-50 border-green-200 text-green-700', icon: CheckCircle, text: `Runway confortable: ${result.runway} mois.` }
        if ((result.runway ?? 0) >= 4) return { title: 'Orange', cls: 'bg-amber-50 border-amber-200 text-amber-700', icon: AlertCircle, text: `Runway limité: ${result.runway} mois. Priorisez l’optimisation cash.` }
        return { title: 'Rouge', cls: 'bg-red-50 border-red-200 text-red-700', icon: AlertCircle, text: `Runway critique: ${result.runway} mois. Action immédiate requise.` }
    }, [result])

    const reportInputs = useMemo(() => {
        if (!result) return {}
        return {
            tresorerie: parseFloat(tresorerie) || 0,
            depenses: parseFloat(depenses) || 0,
            revenus: parseFloat(revenus) || 0,
        }
    }, [result, tresorerie, depenses, revenus])

    const reportResult = useMemo(() => {
        if (!result || !interpretation) return {}
        return {
            burnNet: result.burnNet,
            runway: result.runway,
            rupture: result.rupture,
            niveau: interpretation.title,
            interpretationLines: [interpretation.text],
            summary: [
                { label: 'Burn net (mois)', value: `${Math.round(result.burnNet).toLocaleString('fr-FR')} €` },
                { label: 'Runway', value: result.runway === null ? 'Non limité' : `${result.runway} mois` },
                { label: 'Rupture cash', value: result.rupture ?? 'N/A' },
            ],
        }
    }, [result, interpretation])

    const calculer = () => {
        const tresorerieN = parseFloat(tresorerie) || 0
        const depensesN = parseFloat(depenses) || 0
        const revenusN = parseFloat(revenus) || 0
        const burnNet = depensesN - revenusN

        let runway: number | null = null
        let rupture: string | null = null
        if (burnNet > 0) {
            runway = Math.max(0, Math.floor(tresorerieN / burnNet))
            const d = new Date()
            d.setMonth(d.getMonth() + runway)
            rupture = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
        }

        setResult({ burnNet, runway, rupture })
        trackCalculatorUse('BURN_RATE', burnNet, { tresorerie: tresorerieN, depenses: depensesN, revenus: revenusN, runway: runway ?? -1 })

        saveCalculation({
            type: 'burn-rate',
            value: Math.round(burnNet),
            inputs: { tresorerieDebutMois: tresorerieN, depensesMensuelles: depensesN, revenusMensuels: revenusN, runwayMois: runway ?? 0 },
            unit: '€/mois',
        })
    }

    return (
        <div className="min-h-screen bg-white">
            <StructuredData data={structuredData} />
            <Header />
            <main>
                <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white pt-32 pb-16">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-4xl font-bold">Calculateur Burn Rate & Runway</h1>
                        <p className="text-slate-300 mt-4">Anticipez votre rupture cash avant qu’elle n’arrive.</p>
                    </div>
                </section>

                <section className="py-12 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-6 bg-white border border-slate-200 rounded-2xl p-6">
                        <div className="grid md:grid-cols-3 gap-4">
                            {([
                                ['Trésorerie début de mois (€)', tresorerie, setTresorerie],
                                ['Dépenses opérationnelles mensuelles (€)', depenses, setDepenses],
                                ['Revenus mensuels (€)', revenus, setRevenus],
                            ] as const).map(([label, value, setter]) => (
                                <div key={label}>
                                    <label className="block text-sm font-semibold text-slate-800 mb-2">{label}</label>
                                    <input type="number" value={value as string} onChange={(e) => (setter as (v: string) => void)(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                                </div>
                            ))}
                        </div>
                        <button onClick={calculer} className="mt-6 w-full px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold">Calculer burn rate</button>
                    </div>
                </section>

                {result && interpretation && (
                    <section className="py-10 bg-white">
                        <div className="max-w-4xl mx-auto px-6 space-y-4">
                            <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
                                <p className="text-slate-300">Burn rate net mensuel</p>
                                <p className="text-5xl font-bold mt-2">{Math.round(result.burnNet).toLocaleString('fr-FR')} €</p>
                                <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
                                    <div>Runway: <strong>{result.runway === null ? 'Non limité (burn ≤ 0)' : `${result.runway} mois`}</strong></div>
                                    <div>Date rupture cash: <strong>{result.rupture ?? 'N/A'}</strong></div>
                                </div>
                            </div>

                            <div className={`border rounded-xl p-4 ${interpretation.cls}`}>
                                <div className="flex items-center gap-2 font-semibold"><interpretation.icon className="w-5 h-5" />Niveau d’alerte {interpretation.title}</div>
                                <p className="text-sm mt-1">{interpretation.text}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="/mon-diagnostic" className="flex-1 px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold text-center inline-flex items-center justify-center gap-2">Voir mon Score FinSight™ <ArrowRight className="w-4 h-4" /></Link>
                                <Link href="/contact" className="flex-1 px-6 py-3 border border-slate-300 rounded-xl font-semibold text-center inline-flex items-center justify-center gap-2"><CalendarClock className="w-4 h-4" />Parler à un expert</Link>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <EmailCaptureModal
                calculatorType="burn-rate"
                hasResult={!!result}
                result={reportResult}
                inputs={reportInputs}
            />

            <div className="max-w-4xl mx-auto px-6 pb-10">
                <section aria-label="Ressources liées" className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
                    <p className="font-semibold text-gray-900 text-sm mb-3">Aller plus loin</p>
                    <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Article lié</p>
                        <Link href="/blog/tresorerie-pme-5-erreurs-eviter" className="text-accent-primary text-sm hover:underline block">
                            Trésorerie PME : 5 erreurs à éviter
                        </Link>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Calculateurs complémentaires</p>
                        <div className="flex flex-col gap-1">
                            <Link href="/calculateurs/bfr" className="text-accent-primary text-sm hover:underline">Calculateur BFR</Link>
                            <Link href="/calculateurs/cac-ltv" className="text-accent-primary text-sm hover:underline">Calculateur CAC &amp; LTV</Link>
                            <Link href="/fondamentaux" className="text-accent-primary text-sm hover:underline">Guide : Fondamentaux financiers</Link>
                        </div>
                    </div>
                </section>
                <PremiumUpsellCard
                    calculatorType="burn-rate"
                    hasResult={!!result}
                    result={reportResult}
                    inputs={reportInputs}
                />
            </div>

            <Footer />
        </div>
    )
}
