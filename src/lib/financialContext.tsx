// Context pour partager les données financières entre composants
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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

    // 💾 Persistance des données (SessionStorage)
    useEffect(() => {
        // Vérifier que nous sommes côté client
        if (typeof window === 'undefined') return
        
        // Charger les données au démarrage
        const savedRawData = sessionStorage.getItem('finsight_rawData')
        const savedFinSightData = sessionStorage.getItem('finsight_data')
        
        if (savedRawData) {
            try {
                setRawData(JSON.parse(savedRawData))
                setIsDataLoaded(true)
            } catch (e) {
                console.error('Erreur chargement rawData', e)
            }
        }

        if (savedFinSightData) {
            try {
                setFinSightData(JSON.parse(savedFinSightData))
            } catch (e) {
                console.error('Erreur chargement finSightData', e)
            }
        }
    }, [])

    useEffect(() => {
        // Vérifier que nous sommes côté client
        if (typeof window === 'undefined') return
        
        // Sauvegarder les changements
        if (rawData) {
            sessionStorage.setItem('finsight_rawData', JSON.stringify(rawData))
        }
        if (finSightData) {
            sessionStorage.setItem('finsight_data', JSON.stringify(finSightData))
        }
    }, [rawData, finSightData])

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