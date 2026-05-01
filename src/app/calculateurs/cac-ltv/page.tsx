'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowRight, Calculator, CheckCircle, Target } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { generateHowToJsonLd } from '@/lib/seo'
import { trackCalculatorUse } from '@/lib/analytics'
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory'
import EmailCaptureModal from '@/components/EmailCaptureModal'
import PremiumUpsellCard from '@/components/PremiumUpsellCard'

export default function CalculateurCacLtv() {
    const [depenses, setDepenses] = useState('')
    const [nouveauxClients, setNouveauxClients] = useState('')
    const [revenuMoyen, setRevenuMoyen] = useState('')
    const [dureeVie, setDureeVie] = useState('')
    const [margeBrute, setMargeBrute] = useState('')
    const [result, setResult] = useState<{ cac: number; ltv: number; ratio: number } | null>(null)
    const { saveCalculation } = useCalculatorHistory()

    const structuredData = generateHowToJsonLd({
        name: 'Calculateur CAC LTV',
        description: 'Calculez CAC, LTV et ratio LTV/CAC pour piloter votre acquisition',
        slug: 'cac-ltv',
        steps: [
            { name: 'Renseigner les dépenses marketing/sales', text: 'Montant total sur la période.' },
            { name: 'Indiquer les nouveaux clients', text: 'Nombre de clients acquis sur la même période.' },
            { name: 'Saisir revenu moyen, durée de vie et marge brute', text: 'Permet de calculer LTV.' },
            { name: 'Analyser le ratio', text: 'LTV/CAC < 1 danger, 1-3 attention, >3 sain.' },
        ],
    })

    const interpretation = useMemo(() => {
        if (!result) return null
        if (result.ratio < 1) return { title: 'Danger', cls: 'bg-red-50 border-red-200 text-red-700', icon: AlertCircle, text: 'Votre acquisition détruit de la valeur (LTV/CAC < 1).' }
        if (result.ratio <= 3) return { title: 'Attention', cls: 'bg-amber-50 border-amber-200 text-amber-700', icon: AlertCircle, text: 'Ratio intermédiaire : optimisez CAC ou rétention.' }
        return { title: 'Sain', cls: 'bg-green-50 border-green-200 text-green-700', icon: CheckCircle, text: 'Modèle d’acquisition solide (LTV/CAC > 3).' }
    }, [result])

    const reportInputs = useMemo(() => {
        if (!result) return {}
        return {
            depenses: parseFloat(depenses) || 0,
            nouveauxClients: parseFloat(nouveauxClients) || 0,
            revenuMoyen: parseFloat(revenuMoyen) || 0,
            dureeVie: parseFloat(dureeVie) || 0,
            margeBrute: parseFloat(margeBrute) || 0,
        }
    }, [result, depenses, nouveauxClients, revenuMoyen, dureeVie, margeBrute])

    const reportResult = useMemo(() => {
        if (!result || !interpretation) return {}
        return {
            ratio: result.ratio,
            cac: result.cac,
            ltv: result.ltv,
            niveau: interpretation.title,
            interpretationLines: [interpretation.text],
            summary: [
                { label: 'LTV / CAC', value: `${result.ratio.toFixed(2)}x` },
                { label: 'CAC', value: `${Math.round(result.cac).toLocaleString('fr-FR')} €` },
                { label: 'LTV', value: `${Math.round(result.ltv).toLocaleString('fr-FR')} €` },
            ],
        }
    }, [result, interpretation])

    const calculer = () => {
        const depensesN = parseFloat(depenses) || 0
        const clientsN = parseFloat(nouveauxClients) || 0
        const revenuMoyenN = parseFloat(revenuMoyen) || 0
        const dureeVieN = parseFloat(dureeVie) || 0
        const margeBruteN = parseFloat(margeBrute) || 0
        if (clientsN <= 0) return

        const cac = depensesN / clientsN
        const ltv = revenuMoyenN * dureeVieN * (margeBruteN / 100)
        const ratio = cac > 0 ? ltv / cac : 0
        setResult({ cac, ltv, ratio })

        trackCalculatorUse('CAC-LTV', ratio, { depenses: depensesN, nouveauxClients: clientsN, revenuMoyen: revenuMoyenN, dureeVie: dureeVieN, margeBrute: margeBruteN })

        saveCalculation({
            type: 'cac-ltv',
            value: Number(ratio.toFixed(2)),
            inputs: { depenses: depensesN, nouveauxClients: clientsN, revenuMoyen: revenuMoyenN, dureeVie: dureeVieN, margeBrute: margeBruteN, cac, ltv },
            unit: 'x',
        })
    }

    return (
        <div className="min-h-screen bg-white">
            <StructuredData data={structuredData} />
            <Header />
            <main>
                <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white pt-32 pb-16">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-4xl font-bold">Calculateur CAC / LTV</h1>
                        <p className="text-slate-300 mt-4">Mesurez la rentabilité de votre acquisition client en 30 secondes.</p>
                    </div>
                </section>

                <section className="py-12 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-6 bg-white border border-slate-200 rounded-2xl p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            {([
                                ['Dépenses marketing & sales (€)', depenses, setDepenses],
                                ['Nouveaux clients acquis', nouveauxClients, setNouveauxClients],
                                ['Revenu moyen/client/an (€)', revenuMoyen, setRevenuMoyen],
                                ['Durée de vie client (années)', dureeVie, setDureeVie],
                                ['Marge brute (%)', margeBrute, setMargeBrute],
                            ] as const).map(([label, value, setter]) => (
                                <div key={label}>
                                    <label className="block text-sm font-semibold text-slate-800 mb-2">{label}</label>
                                    <input type="number" value={value as string} onChange={(e) => (setter as (v: string) => void)(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl" />
                                </div>
                            ))}
                        </div>
                        <button onClick={calculer} className="mt-6 w-full px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold">Calculer CAC / LTV</button>
                    </div>
                </section>

                {result && interpretation && (
                    <section className="py-10 bg-white">
                        <div className="max-w-4xl mx-auto px-6 space-y-4">
                            <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
                                <p className="text-slate-300">Ratio LTV / CAC</p>
                                <p className="text-5xl font-bold mt-2">{result.ratio.toFixed(2)}x</p>
                                <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
                                    <div>CAC: <strong>{Math.round(result.cac).toLocaleString('fr-FR')} €</strong></div>
                                    <div>LTV: <strong>{Math.round(result.ltv).toLocaleString('fr-FR')} €</strong></div>
                                </div>
                            </div>

                            <div className={`border rounded-xl p-4 ${interpretation.cls}`}>
                                <div className="flex items-center gap-2 font-semibold"><interpretation.icon className="w-5 h-5" />{interpretation.title}</div>
                                <p className="text-sm mt-1">{interpretation.text}</p>
                                <p className="text-xs mt-2">Règle: LTV/CAC &lt; 1 = danger · 1-3 = attention · &gt; 3 = sain</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="/mon-diagnostic" className="flex-1 px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold text-center inline-flex items-center justify-center gap-2">Voir mon Score FinSight™ <ArrowRight className="w-4 h-4" /></Link>
                                <Link href="/contact" className="flex-1 px-6 py-3 border border-slate-300 rounded-xl font-semibold text-center inline-flex items-center justify-center gap-2"><Target className="w-4 h-4" />Parler à un expert</Link>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <EmailCaptureModal
                calculatorType="cac-ltv"
                hasResult={!!result}
                result={reportResult}
                inputs={reportInputs}
            />

            <div className="max-w-4xl mx-auto px-6 pb-10">
                <PremiumUpsellCard
                    calculatorType="cac-ltv"
                    hasResult={!!result}
                    result={reportResult}
                    inputs={reportInputs}
                />
            </div>

            <Footer />
        </div>
    )
}
