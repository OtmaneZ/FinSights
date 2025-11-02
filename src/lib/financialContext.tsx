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