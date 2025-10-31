// Context pour partager les données financières entre composants
'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { FinSightDataModel } from './dataModel'

interface FinancialDataContextType {
    finSightData: FinSightDataModel | null
    setFinSightData: (data: FinSightDataModel | null) => void
    isDataLoaded: boolean
    setIsDataLoaded: (loaded: boolean) => void
    rawData: any[] | null
    setRawData: (data: any[] | null) => void
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined)

export function FinancialDataProvider({ children }: { children: ReactNode }) {
    const [finSightData, setFinSightData] = useState<FinSightDataModel | null>(null)
    const [isDataLoaded, setIsDataLoaded] = useState(false)
    const [rawData, setRawData] = useState<any[] | null>(null)

    return (
        <FinancialDataContext.Provider
            value={{
                finSightData,
                setFinSightData,
                isDataLoaded,
                setIsDataLoaded,
                rawData,
                setRawData
            }}
        >
            {children}
        </FinancialDataContext.Provider>
    )
}

export function useFinancialData() {
    const context = useContext(FinancialDataContext)
    if (context === undefined) {
        throw new Error('useFinancialData must be used within a FinancialDataProvider')
    }
    return context
}

// Fonctions de calcul pour le copilote
export class FinancialCalculator {
    private data: FinSightDataModel | null
    private rawData: any[] | null

    constructor(finSightData: FinSightDataModel | null, rawData: any[] | null) {
        this.data = finSightData
        this.rawData = rawData
    }

    calculerTresorerie(): string {
        if (!this.data) return "Aucune donnée disponible pour calculer la trésorerie."

        const cashFlowKPI = this.data.kpis.cashFlow
        const variation = cashFlowKPI.changeValue

        return `💰 Votre position de trésorerie actuelle est de ${cashFlowKPI.formatted}. ` +
            `Variation ce mois : ${cashFlowKPI.changeFormatted}. ` +
            `Tendance : ${cashFlowKPI.changeType === 'positive' ? '📈 En amélioration' :
                cashFlowKPI.changeType === 'negative' ? '📉 En dégradation' : '➡️ Stable'}.`
    }

    calculerMarge(): string {
        if (!this.data) return "Aucune donnée disponible pour calculer la marge."

        const margeKPI = this.data.kpis.margin

        return `📊 Votre marge brute s'établit à ${margeKPI.formatted}. ` +
            `Évolution : ${margeKPI.changeFormatted}. ` +
            `Cette marge est ${margeKPI.changeType === 'positive' ? 'en progression' :
                margeKPI.changeType === 'negative' ? 'en baisse' : 'stable'} par rapport à la période précédente.`
    }

    calculerDSO(): string {
        if (!this.data) return "Aucune donnée disponible pour calculer le DSO."

        const dsoKPI = this.data.kpis.dso

        return `⏰ Le délai moyen de paiement client (DSO) est de ${dsoKPI.formatted}. ` +
            `Évolution : ${dsoKPI.changeFormatted}. ` +
            `${dsoKPI.changeType === 'negative' ? 'Bonne nouvelle, vos encaissements s\'accélérent.' :
                dsoKPI.changeType === 'positive' ? 'Attention, vos clients paient plus lentement.' : 'Délais stables.'}`
    }

    analyserPerformance(): string {
        if (!this.data) return "Aucune donnée disponible pour analyser la performance."

        const kpis = this.data.kpis
        const kpiArray = [kpis.revenue, kpis.margin, kpis.cashFlow, kpis.dso, kpis.ebitda]
        const positifs = kpiArray.filter(k => k.changeType === 'positive').length
        const negatifs = kpiArray.filter(k => k.changeType === 'negative').length

        let status = "stable"
        if (positifs > negatifs) status = "en progression"
        if (negatifs > positifs) status = "à surveiller"

        return `📈 Performance globale : ${status}. ` +
            `${positifs} indicateurs en amélioration, ${negatifs} en dégradation. ` +
            `Analyse basée sur ${this.data.recordCount} transactions de la période ${this.data.period.label}.`
    }

    detecterRisques(): string {
        if (!this.data) return "Aucune donnée disponible pour détecter les risques."

        const risques = []

        // Risque trésorerie
        const cashflowKPI = this.data.kpis.cashFlow
        if (cashflowKPI.changeType === 'negative' && Math.abs(cashflowKPI.changeValue) > cashflowKPI.value * 0.2) {
            risques.push("dégradation forte de la trésorerie")
        }

        // Risque marge
        const margeKPI = this.data.kpis.margin
        if (margeKPI.changeType === 'negative' && Math.abs(margeKPI.changeValue) > margeKPI.value * 0.1) {
            risques.push("érosion des marges")
        }

        // Risque DSO
        const dsoKPI = this.data.kpis.dso
        if (dsoKPI.changeType === 'positive' && dsoKPI.changeValue > 5) {
            risques.push("allongement des délais de paiement")
        }

        if (risques.length === 0) {
            return "✅ Aucun risque majeur détecté dans vos données financières actuelles."
        }

        return `⚠️ Risques détectés : ${risques.join(', ')}. ` +
            `Je recommande un suivi renforcé de ces indicateurs.`
    }

    simulerScenario(type: string, variation: number): string {
        if (!this.data) return "Aucune donnée disponible pour la simulation."

        switch (type.toLowerCase()) {
            case 'dso':
                const dsoActuel = this.data.kpis.dso.value
                const nouveauDSO = Math.max(0, dsoActuel - variation)
                const impactTreso = (dsoActuel - nouveauDSO) * 1000 // Estimation simplifiée

                return `💡 Simulation DSO : Réduire de ${variation} jours (${dsoActuel}j → ${nouveauDSO}j) ` +
                    `améliorerait votre trésorerie d'environ ${this.formatCurrency(impactTreso)}.`

            case 'marge':
                const margeActuelle = this.data.kpis.margin.value
                const nouvelleMarge = margeActuelle + variation

                return `💡 Simulation marge : Augmenter de ${variation}% (${margeActuelle}% → ${nouvelleMarge}%) ` +
                    `améliorerait significativement votre rentabilité.`

            default:
                return `🤖 Type de simulation "${type}" non reconnu. Essayez "DSO" ou "marge".`
        }
    }

    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount)
    }
}