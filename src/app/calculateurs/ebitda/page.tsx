'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BarChart3, Building2, Calculator, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { generateHowToJsonLd } from '@/lib/seo'
import { trackCalculatorUse } from '@/lib/analytics'
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory'
import EmailCaptureModal from '@/components/EmailCaptureModal'
import PremiumUpsellCard from '@/components/PremiumUpsellCard'

type Sector = 'industrie' | 'services' | 'commerce'

const BENCHMARKS: Record<Sector, { good: number; warning: number }> = {
    industrie: { good: 15, warning: 8 },
    services: { good: 20, warning: 12 },
    commerce: { good: 10, warning: 5 },
}

export default function CalculateurEBITDA() {
    const [ca, setCA] = useState('')
    const [achats, setAchats] = useState('')
    const [chargesExternes, setChargesExternes] = useState('')
    const [impotsTaxes, setImpotsTaxes] = useState('')
    const [chargesPersonnel, setChargesPersonnel] = useState('')
    const [dotations, setDotations] = useState('')
    const [secteur, setSecteur] = useState<Sector>('services')
    const [result, setResult] = useState<{ ebitda: number; marge: number } | null>(null)
    const { saveCalculation } = useCalculatorHistory()

    const structuredData = generateHowToJsonLd({
        name: 'Calculateur EBITDA PME',
        description: 'Calculez votre EBITDA et votre marge EBITDA avec benchmark sectoriel',
        slug: 'ebitda',
        steps: [
            { name: 'Renseigner CA', text: 'Entrez votre chiffre d’affaires annuel HT.' },
            { name: 'Ajouter les charges', text: 'Achats, charges externes, impôts/taxes et charges de personnel.' },
            { name: 'Calculer EBITDA', text: 'EBITDA = CA - achats - charges externes - impôts - charges personnel.' },
            { name: 'Analyser la marge', text: 'Comparez votre marge EBITDA au benchmark de votre secteur.' },
        ],
    })

    const interpretation = useMemo(() => {
        if (!result) return null
        const b = BENCHMARKS[secteur]
        if (result.marge >= b.good) {
            return {
                title: 'EBITDA solide',
                cls: 'bg-green-50 border-green-200 text-green-700',
                icon: CheckCircle,
                text: `Votre marge EBITDA (${result.marge.toFixed(1)}%) est au-dessus du benchmark ${secteur}.`,
            }
        }
        if (result.marge >= b.warning) {
            return {
                title: 'EBITDA en vigilance',
                cls: 'bg-amber-50 border-amber-200 text-amber-700',
                icon: AlertCircle,
                text: `Votre marge EBITDA (${result.marge.toFixed(1)}%) est dans une zone intermédiaire pour ${secteur}.`,
            }
        }
        return {
            title: 'EBITDA faible',
            cls: 'bg-red-50 border-red-200 text-red-700',
            icon: AlertCircle,
            text: `Votre marge EBITDA (${result.marge.toFixed(1)}%) est sous le seuil recommandé pour ${secteur}.`,
        }
    }, [result, secteur])

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
        if (!result || !interpretation) return {}
        const b = BENCHMARKS[secteur]
        return {
            ebitda: result.ebitda,
            margeEbitdaPct: result.marge,
            secteur,
            benchmarkGood: b.good,
            benchmarkWarning: b.warning,
            niveau: interpretation.title,
            interpretationLines: [interpretation.text],
            summary: [
                { label: 'EBITDA', value: `${Math.round(result.ebitda).toLocaleString('fr-FR')} €` },
                { label: 'Marge EBITDA', value: `${result.marge.toFixed(1)}%` },
                { label: 'Secteur', value: secteur },
            ],
        }
    }, [result, interpretation, secteur])

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

        trackCalculatorUse('EBITDA', ebitda, { ca: caN, achats: achatsN, chargesExternes: chargesExternesN, impotsTaxes: impotsTaxesN, chargesPersonnel: chargesPersonnelN, dotations: dotationsN, secteur })

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
                        <p className="text-slate-300 mt-4">Calculez votre EBITDA, votre marge et comparez-vous à votre secteur.</p>
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

                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-slate-800 mb-2">Secteur</label>
                            <div className="flex flex-wrap gap-2">
                                {(['industrie', 'services', 'commerce'] as Sector[]).map((s) => (
                                    <button key={s} onClick={() => setSecteur(s)} className={`px-4 py-2 rounded-lg border ${secteur === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button onClick={calculer} className="mt-6 w-full px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold">
                            Calculer mon EBITDA
                        </button>
                    </div>
                </section>

                {result && interpretation && (
                    <section className="py-10 bg-white">
                        <div className="max-w-4xl mx-auto px-6 space-y-4">
                            <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
                                <p className="text-slate-300">EBITDA</p>
                                <p className="text-5xl font-bold mt-2">{Math.round(result.ebitda).toLocaleString('fr-FR')} €</p>
                                <p className="text-slate-300 mt-3">Marge EBITDA: {result.marge.toFixed(1)}%</p>
                                <p className="text-slate-400 text-sm mt-2">EBITDA = CA - achats - charges externes - impôts/taxes - charges personnel</p>
                            </div>

                            <div className={`border rounded-xl p-4 ${interpretation.cls}`}>
                                <div className="flex items-center gap-2 font-semibold">
                                    <interpretation.icon className="w-5 h-5" />
                                    <span>{interpretation.title}</span>
                                </div>
                                <p className="text-sm mt-1">{interpretation.text}</p>
                                <div className="text-xs mt-2">
                                    Benchmark {secteur}: bon ≥ {BENCHMARKS[secteur].good}% · vigilance ≥ {BENCHMARKS[secteur].warning}%
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="/mon-diagnostic" className="flex-1 px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold text-center inline-flex items-center justify-center gap-2">Voir mon Score FinSight™ <ArrowRight className="w-4 h-4" /></Link>
                                <Link href="/contact" className="flex-1 px-6 py-3 border border-slate-300 rounded-xl font-semibold text-center inline-flex items-center justify-center gap-2"><Building2 className="w-4 h-4" />Parler à un expert</Link>
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
