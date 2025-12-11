'use client'

import { useState } from 'react'
import TemplateDownload from './TemplateDownload'

interface EmptyDashboardStateProps {
    onDemoLoad: (scenario: 'saine' | 'difficulte' | 'croissance') => void
}

export default function EmptyDashboardStateV2({ onDemoLoad }: EmptyDashboardStateProps) {
    return (
        <>
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary-subtle border border-accent-primary-border rounded-full mb-6">
                        <span className="text-accent-primary text-sm font-semibold">Dashboard Adaptatif</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 text-primary">
                        Votre Dashboard s'adapte à vos données
                    </h2>
                    <p className="text-lg text-secondary max-w-2xl mx-auto">
                        FinSight analyse automatiquement votre fichier et génère les KPIs pertinents.
                    </p>
                </div>

                {/* Scénarios de Démonstration */}
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-center mb-3 text-primary">
                        Choisissez un scénario de démonstration
                    </h3>
                    <p className="text-center text-secondary mb-8">
                        3 scénarios réalistes : Scale-up Hypercroissance • Startup SaaS • Scale-up Tech
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Scale-up Hypercroissance - CA +180% mais burn élevé */}
                        <button
                            onClick={() => onDemoLoad('saine')}
                            className="surface rounded-xl p-6 surface-hover group text-left transition-all hover:scale-[1.02]"
                        >
                            <h4 className="text-xl font-bold mb-2 text-primary">Scale-up Hypercroissance</h4>
                            <p className="text-accent-warning font-semibold mb-4 text-sm">CA +180% mais marge négative</p>
                            <div className="text-sm text-secondary space-y-1">
                                <p>• 850k€ CA • Marge -8.2%</p>
                                <p>• Cash flow: -70k€/mois</p>
                                <p>• Sales & Marketing: 53%</p>
                            </div>
                        </button>

                        {/* Startup SaaS - Difficulté trésorerie */}
                        <button
                            onClick={() => onDemoLoad('difficulte')}
                            className="surface rounded-xl p-6 surface-hover group text-left transition-all hover:scale-[1.02]"
                        >
                            <h4 className="text-xl font-bold mb-2 text-primary">Startup SaaS</h4>
                            <p className="text-accent-warning font-semibold mb-4 text-sm">Difficulté trésorerie</p>
                            <div className="text-sm text-secondary space-y-1">
                                <p>• 20k€ CA • Marge -135%</p>
                                <p>• Cash flow: -27k€</p>
                                <p>• Runway critique</p>
                            </div>
                        </button>

                        {/* Scale-up Tech - Phase de scale profitable */}
                        <button
                            onClick={() => onDemoLoad('croissance')}
                            className="surface rounded-xl p-6 surface-hover group text-left transition-all hover:scale-[1.02]"
                        >
                            <h4 className="text-xl font-bold mb-2 text-primary">Scale-up Tech</h4>
                            <p className="text-accent-primary font-semibold mb-4 text-sm">Phase de scale profitable</p>
                            <div className="text-sm text-secondary space-y-1">
                                <p>• 900k€ CA • Série A 350k€</p>
                                <p>• Marge 65% • +195% YoY</p>
                                <p>• Cash flow: 580k€</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Upload Zone */}
                <div className="surface rounded-2xl p-10 text-center">
                    <h3 className="text-xl font-bold mb-3 text-primary">Ou importez vos propres données</h3>
                    <p className="text-secondary mb-6">
                        Glissez votre fichier CSV/Excel ou cliquez pour sélectionner
                    </p>

                    <div className="relative mb-6">
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="border-2 border-dashed border-border-default rounded-xl p-16 hover:border-accent-primary-border hover:bg-surface-elevated transition-all">
                                <div className="text-accent-primary font-semibold text-xl mb-2">
                                    Cliquez ici ou glissez votre fichier
                                </div>
                                <div className="text-sm text-tertiary">
                                    Formats supportés : .xlsx, .xls, .csv (max 10MB)
                                </div>
                            </div>
                            <input
                                id="file-upload"
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        // Dispatch custom event pour le dashboard
                                        const event = new CustomEvent('fileUpload', {
                                            detail: e.target.files
                                        })
                                        window.dispatchEvent(event)
                                    }
                                }}
                            />
                        </label>
                    </div>

                    {/* Message rassurant + infos qualité */}
                    <div className="mb-6 p-4 border-l-4 border-accent-primary-border bg-surface-elevated border border-border-default rounded-lg">
                        <p className="text-sm text-primary font-semibold mb-2 flex items-center gap-2 justify-center">
                            <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Aucun compte requis • Analyse instantanée
                        </p>
                        <p className="text-xs text-secondary text-center font-medium">
                            Minimum : 10 transactions avec dates, montants et types (revenus/charges)
                        </p>
                    </div>

                    <div className="flex justify-center gap-8 text-sm text-secondary">
                        <span>100% sécurisé</span>
                        <span>Analyse instantanée</span>
                        <span>KPIs auto-générés</span>
                    </div>
                </div>

                {/* Templates Download Section - Sous l'upload */}
                <div className="mt-16">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-3">Pas de fichier prêt ?</h3>
                        <p className="text-secondary">
                            Téléchargez un template compatible avec votre logiciel comptable
                        </p>
                    </div>
                    <TemplateDownload />
                </div>
            </div>
        </>
    )
}
