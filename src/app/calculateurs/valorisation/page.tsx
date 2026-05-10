'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calculator, Landmark, TrendingUp } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { generateHowToJsonLd } from '@/lib/seo'
import { trackCalculatorUse } from '@/lib/analytics'
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory'
import EmailCaptureModal from '@/components/EmailCaptureModal'
import PremiumUpsellCard from '@/components/PremiumUpsellCard'

export default function CalculateurValorisation() {
    const [ebitda, setEbitda] = useState('')
    const [multiple, setMultiple] = useState(6)
    const [detteNette, setDetteNette] = useState('')
    const [tresorerie, setTresorerie] = useState('')
    const [result, setResult] = useState<{ ev: number; equity: number; low: number; high: number } | null>(null)
    const { saveCalculation } = useCalculatorHistory()

    const structuredData = generateHowToJsonLd({
        name: 'Calculateur valorisation entreprise',
        description: 'Estimez la valeur d’entreprise et la valeur des fonds propres avec multiple EBITDA',
        slug: 'valorisation',
        steps: [
            { name: 'Saisir EBITDA', text: 'Utilisez votre EBITDA annuel normalisé.' },
            { name: 'Choisir le multiple', text: 'Ajustez entre 3x et 12x selon votre marché.' },
            { name: 'Ajouter dette nette et trésorerie', text: 'Permet de passer de EV à Equity Value.' },
            { name: 'Lire la fourchette', text: 'Affiche estimation basse/haute sur multiple ±2.' },
        ],
    })

    const calculer = () => {
        const ebitdaN = parseFloat(ebitda) || 0
        const detteNetteN = parseFloat(detteNette) || 0
        const tresorerieN = parseFloat(tresorerie) || 0
        const ev = ebitdaN * multiple
        const equity = ev - detteNetteN + tresorerieN
        const lowM = Math.max(3, multiple - 2)
        const highM = Math.min(12, multiple + 2)
        const low = ebitdaN * lowM - detteNetteN + tresorerieN
        const high = ebitdaN * highM - detteNetteN + tresorerieN

        setResult({ ev, equity, low, high })
        trackCalculatorUse('VALORISATION', equity, { ebitda: ebitdaN, multiple, detteNette: detteNetteN, tresorerie: tresorerieN, ev })
        saveCalculation({
            type: 'valorisation',
            value: Math.round(equity),
            inputs: { ebitda: ebitdaN, multiple, detteNette: detteNetteN, tresorerie: tresorerieN, valeurEntreprise: ev },
            unit: '€',
        })
    }

    const label = useMemo(() => {
        if (!result) return ''
        if (result.equity <= 0) return 'Valorisation prudente: dette élevée vs création de valeur.'
        if (multiple >= 9) return 'Hypothèse de croissance forte (multiple élevé).'
        return 'Hypothèse médiane de marché.'
    }, [result, multiple])

    const reportInputs = useMemo(() => {
        if (!result) return {}
        return {
            ebitda: parseFloat(ebitda) || 0,
            multiple,
            detteNette: parseFloat(detteNette) || 0,
            tresorerie: parseFloat(tresorerie) || 0,
        }
    }, [result, ebitda, multiple, detteNette, tresorerie])

    const reportResult = useMemo(() => {
        if (!result) return {}
        const ebitdaN = parseFloat(ebitda) || 0
        const lowM = Math.max(3, multiple - 2)
        const highM = Math.min(12, multiple + 2)
        return {
            enterpriseValue: result.ev,
            equityValue: result.equity,
            lowEquity: result.low,
            highEquity: result.high,
            multipleLow: lowM,
            multipleHigh: highM,
            interpretationLines: [label],
            summary: [
                { label: 'EV (multiple)', value: `${Math.round(result.ev).toLocaleString('fr-FR')} €` },
                { label: 'Fonds propres', value: `${Math.round(result.equity).toLocaleString('fr-FR')} €` },
                { label: 'Fourchette', value: `${Math.round(result.low).toLocaleString('fr-FR')} € → ${Math.round(result.high).toLocaleString('fr-FR')} €` },
            ],
        }
    }, [result, ebitda, multiple, label])

    return (
        <div className="min-h-screen bg-white">
            <StructuredData data={structuredData} />
            <Header />
            <main>
                <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white pt-32 pb-16">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-4xl font-bold">Calculateur Valorisation</h1>
                        <p className="text-slate-300 mt-4">Estimez la valeur de votre entreprise via multiple EBITDA.</p>
                    </div>
                </section>

                <section className="py-12 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-6 bg-white border border-slate-200 rounded-2xl p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            {([
                                ['EBITDA annuel (€)', ebitda, setEbitda],
                                ['Dette nette (€)', detteNette, setDetteNette],
                                ['Trésorerie (€)', tresorerie, setTresorerie],
                            ] as const).map(([labelText, value, setter]) => (
                                <div key={labelText}>
                                    <label className="block text-sm font-semibold text-slate-800 mb-2">{labelText}</label>
                                    <input type="number" value={value as string} onChange={(e) => (setter as (v: string) => void)(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm font-semibold text-slate-800 mb-2">Multiple sectoriel: {multiple}x</label>
                                <input type="range" min={3} max={12} value={multiple} onChange={(e) => setMultiple(parseInt(e.target.value, 10))} className="w-full" />
                                <p className="text-xs text-slate-500 mt-1">Fourchette simulée: {Math.max(3, multiple - 2)}x à {Math.min(12, multiple + 2)}x</p>
                            </div>
                        </div>
                        <button onClick={calculer} className="mt-6 w-full px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold">Calculer ma valorisation</button>
                    </div>
                </section>

                {result && (
                    <section className="py-10 bg-white">
                        <div className="max-w-4xl mx-auto px-6 space-y-4">
                            <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
                                <p className="text-slate-300">Valeur d’entreprise (EV)</p>
                                <p className="text-5xl font-bold mt-2">{Math.round(result.ev).toLocaleString('fr-FR')} €</p>
                                <p className="text-slate-300 mt-4">Valeur des fonds propres: <strong>{Math.round(result.equity).toLocaleString('fr-FR')} €</strong></p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="border border-slate-200 rounded-xl p-4">
                                    <p className="text-sm text-slate-500">Fourchette basse</p>
                                    <p className="text-2xl font-bold text-slate-900">{Math.round(result.low).toLocaleString('fr-FR')} €</p>
                                </div>
                                <div className="border border-slate-200 rounded-xl p-4">
                                    <p className="text-sm text-slate-500">Fourchette haute</p>
                                    <p className="text-2xl font-bold text-slate-900">{Math.round(result.high).toLocaleString('fr-FR')} €</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 border border-slate-200 rounded-xl p-4">{label}</p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="/mon-diagnostic" className="flex-1 px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold text-center inline-flex items-center justify-center gap-2">Voir mon Score FinSight™ <ArrowRight className="w-4 h-4" /></Link>
                                <Link href="/contact" className="flex-1 px-6 py-3 border border-slate-300 rounded-xl font-semibold text-center inline-flex items-center justify-center gap-2"><Landmark className="w-4 h-4" />Parler à un expert</Link>
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
                <section aria-label="Ressources liées" className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
                    <p className="font-semibold text-gray-900 text-sm mb-3">Aller plus loin</p>
                    <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Article lié</p>
                        <Link href="/blog/pourquoi-entreprise-rentable-detruit-valeur" className="text-accent-primary text-sm hover:underline block">
                            Pourquoi une entreprise rentable peut détruire de la valeur ?
                        </Link>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Calculateurs complémentaires</p>
                        <div className="flex flex-col gap-1">
                            <Link href="/calculateurs/ebitda" className="text-accent-primary text-sm hover:underline">Calculateur EBITDA</Link>
                            <Link href="/calculateurs/roi" className="text-accent-primary text-sm hover:underline">Calculateur ROI</Link>
                            <Link href="/pilotage-financier-pme" className="text-accent-primary text-sm hover:underline">Guide : Pilotage financier PME</Link>
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
