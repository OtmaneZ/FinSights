'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, TrendingUp, DollarSign, Target, PieChart, BarChart3, X, CheckCircle, AlertCircle } from 'lucide-react'
import { BenchmarkBar } from '@/components/BenchmarkBar'
import { trackCalculatorUse } from '@/lib/analytics'

interface CalculatorConfig {
    id: string
    title: string
    description: string
    icon: any
    color: string
    dedicatedPage?: string // URL de la page dédiée si elle existe
    inputs: InputConfig[]
    calculate: (inputs: Record<string, number>) => CalculatorResult
}

interface InputConfig {
    key: string
    label: string
    placeholder: string
    unit?: string
    tooltip?: string
    optional?: boolean
}

interface CalculatorResult {
    value: number
    unit: string
    interpretation: {
        niveau: string
        icone: any
        titre: string
        couleur: string
        bgCouleur: string
        message: string
    }
    details?: { label: string; value: string }[]
    recommendations?: string[]
}

// Calculateurs configurations
const calculators: CalculatorConfig[] = [
    {
        id: 'dso',
        title: 'Calculateur DSO',
        description: 'Days Sales Outstanding - Délai moyen de paiement clients',
        icon: TrendingUp,
        color: 'from-slate-700 to-slate-900',
        dedicatedPage: '/calculateurs/dso',
        inputs: [
            { key: 'creances', label: 'Créances clients', placeholder: '150000', unit: '€', tooltip: 'Factures non encore encaissées' },
            { key: 'ca', label: 'Chiffre d\'affaires annuel', placeholder: '1200000', unit: '€' }
        ],
        calculate: (inputs) => {
            const dso = Math.round((inputs.creances / inputs.ca) * 365)

            let interpretation
            if (dso < 30) {
                interpretation = {
                    niveau: 'excellent',
                    icone: CheckCircle,
                    titre: 'Excellent',
                    couleur: 'text-green-600',
                    bgCouleur: 'bg-green-50 border-green-200',
                    message: 'Vos clients paient rapidement. Trésorerie optimale !'
                }
            } else if (dso < 60) {
                interpretation = {
                    niveau: 'bon',
                    icone: CheckCircle,
                    titre: 'Bon',
                    couleur: 'text-accent-primary',
                    bgCouleur: 'bg-blue-50 border-blue-200',
                    message: 'DSO dans la norme. Continuez ce rythme !'
                }
            } else if (dso < 90) {
                interpretation = {
                    niveau: 'surveiller',
                    icone: AlertCircle,
                    titre: 'À surveiller',
                    couleur: 'text-amber-600',
                    bgCouleur: 'bg-amber-50 border-amber-200',
                    message: 'DSO élevé. Accélérez les relances clients.'
                }
            } else {
                interpretation = {
                    niveau: 'critique',
                    icone: AlertCircle,
                    titre: 'Critique',
                    couleur: 'text-red-600',
                    bgCouleur: 'bg-red-50 border-red-200',
                    message: 'DSO trop élevé ! Risque trésorerie important.'
                }
            }

            return {
                value: dso,
                unit: 'jours',
                interpretation,
                recommendations: [
                    'Automatisez vos relances à J+15, J+30, J+45',
                    'Proposez 2% d\'escompte pour paiement sous 8 jours',
                    'Passez à la facture électronique (obligatoire 2026)',
                    'Demandez des acomptes 30-50% à la commande'
                ]
            }
        }
    },
    {
        id: 'bfr',
        title: 'Calculateur BFR',
        description: 'Besoin en Fonds de Roulement - Trésorerie immobilisée',
        icon: DollarSign,
        color: 'from-slate-700 to-slate-900',
        dedicatedPage: '/calculateurs/bfr',
        inputs: [
            { key: 'stocks', label: 'Stocks', placeholder: '50000', unit: '€' },
            { key: 'creances', label: 'Créances clients', placeholder: '150000', unit: '€' },
            { key: 'dettes', label: 'Dettes fournisseurs', placeholder: '80000', unit: '€' },
            { key: 'ca', label: 'CA annuel', placeholder: '1200000', unit: '€', optional: true }
        ],
        calculate: (inputs) => {
            const bfr = inputs.stocks + inputs.creances - inputs.dettes
            const joursCA = inputs.ca ? Math.round((bfr / inputs.ca) * 365) : null

            let interpretation
            if (bfr < 0) {
                interpretation = {
                    niveau: 'excellent',
                    icone: CheckCircle,
                    titre: 'Excellent - BFR négatif',
                    couleur: 'text-green-600',
                    bgCouleur: 'bg-green-50 border-green-200',
                    message: 'Situation idéale ! Vos fournisseurs financent votre activité.'
                }
            } else if (!joursCA || joursCA < 30) {
                interpretation = {
                    niveau: 'bon',
                    icone: CheckCircle,
                    titre: 'BFR maîtrisé',
                    couleur: 'text-accent-primary',
                    bgCouleur: 'bg-blue-50 border-blue-200',
                    message: 'BFR représente moins d\'un mois de CA. Bonne gestion !'
                }
            } else if (joursCA < 60) {
                interpretation = {
                    niveau: 'surveiller',
                    icone: AlertCircle,
                    titre: 'À surveiller',
                    couleur: 'text-amber-600',
                    bgCouleur: 'bg-amber-50 border-amber-200',
                    message: `BFR = ${joursCA} jours de CA. Optimisez vos délais.`
                }
            } else {
                interpretation = {
                    niveau: 'critique',
                    icone: AlertCircle,
                    titre: 'Critique',
                    couleur: 'text-red-600',
                    bgCouleur: 'bg-red-50 border-red-200',
                    message: `BFR très élevé (${joursCA} jours). Action urgente requise !`
                }
            }

            return {
                value: bfr,
                unit: '€',
                interpretation,
                details: joursCA ? [{ label: 'En jours de CA', value: `${joursCA} jours` }] : undefined,
                recommendations: bfr > 0 ? [
                    'Réduisez vos stocks (optimisez rotations)',
                    'Accélérez encaissements clients (réduire DSO)',
                    'Négociez délais fournisseurs (45-60j au lieu de 30j)',
                    'Suivez votre BFR mensuellement'
                ] : undefined
            }
        }
    },
    {
        id: 'roi',
        title: 'Calculateur ROI',
        description: 'Return on Investment - Rentabilité d\'un investissement',
        icon: Target,
        color: 'from-slate-700 to-slate-900',
        dedicatedPage: '/calculateurs/roi',
        inputs: [
            { key: 'investissement', label: 'Investissement initial', placeholder: '50000', unit: '€' },
            { key: 'gains', label: 'Gains annuels générés', placeholder: '15000', unit: '€' }
        ],
        calculate: (inputs) => {
            const roi = Math.round(((inputs.gains - inputs.investissement) / inputs.investissement) * 100)
            const payback = inputs.gains > 0 ? Math.round((inputs.investissement / inputs.gains) * 12) : 0

            let interpretation
            if (roi > 50) {
                interpretation = {
                    niveau: 'excellent',
                    icone: CheckCircle,
                    titre: 'ROI Excellent',
                    couleur: 'text-green-600',
                    bgCouleur: 'bg-green-50 border-green-200',
                    message: 'Investissement très rentable ! ROI supérieur à 50%.'
                }
            } else if (roi > 20) {
                interpretation = {
                    niveau: 'bon',
                    icone: CheckCircle,
                    titre: 'ROI Positif',
                    couleur: 'text-accent-primary',
                    bgCouleur: 'bg-blue-50 border-blue-200',
                    message: 'Bon retour sur investissement. Projet viable.'
                }
            } else if (roi > 0) {
                interpretation = {
                    niveau: 'moyen',
                    icone: AlertCircle,
                    titre: 'ROI Faible',
                    couleur: 'text-amber-600',
                    bgCouleur: 'bg-amber-50 border-amber-200',
                    message: 'ROI positif mais faible. Évaluez d\'autres options.'
                }
            } else {
                interpretation = {
                    niveau: 'negatif',
                    icone: AlertCircle,
                    titre: 'ROI Négatif',
                    couleur: 'text-red-600',
                    bgCouleur: 'bg-red-50 border-red-200',
                    message: 'Investissement non rentable. Reconsidérez le projet.'
                }
            }

            return {
                value: roi,
                unit: '%',
                interpretation,
                details: [
                    { label: 'Délai de retour', value: `${payback} mois` },
                    { label: 'Gain net', value: `${(inputs.gains - inputs.investissement).toLocaleString('fr-FR')} €` }
                ]
            }
        }
    },
    {
        id: 'marge',
        title: 'Calculateur Marge',
        description: 'Marge commerciale - Taux de marge et taux de marque',
        icon: PieChart,
        color: 'from-slate-600 to-slate-800',
        dedicatedPage: '/calculateurs/marge',
        inputs: [
            { key: 'prixAchat', label: 'Prix d\'achat HT', placeholder: '100', unit: '€' },
            { key: 'prixVente', label: 'Prix de vente HT', placeholder: '150', unit: '€' }
        ],
        calculate: (inputs) => {
            const margeEuros = inputs.prixVente - inputs.prixAchat
            const tauxMarge = Math.round((margeEuros / inputs.prixAchat) * 100)
            const tauxMarque = Math.round((margeEuros / inputs.prixVente) * 100)

            let interpretation
            if (tauxMarge > 100) {
                interpretation = {
                    niveau: 'excellent',
                    icone: CheckCircle,
                    titre: 'Marge Excellente',
                    couleur: 'text-green-600',
                    bgCouleur: 'bg-green-50 border-green-200',
                    message: 'Taux de marge supérieur à 100% ! Très rentable.'
                }
            } else if (tauxMarge > 50) {
                interpretation = {
                    niveau: 'bon',
                    icone: CheckCircle,
                    titre: 'Bonne Marge',
                    couleur: 'text-accent-primary',
                    bgCouleur: 'bg-blue-50 border-blue-200',
                    message: 'Marge saine entre 50-100%. Rentabilité correcte.'
                }
            } else if (tauxMarge > 20) {
                interpretation = {
                    niveau: 'moyen',
                    icone: AlertCircle,
                    titre: 'Marge Moyenne',
                    couleur: 'text-amber-600',
                    bgCouleur: 'bg-amber-50 border-amber-200',
                    message: 'Marge 20-50%. Attention aux charges fixes.'
                }
            } else {
                interpretation = {
                    niveau: 'faible',
                    icone: AlertCircle,
                    titre: 'Marge Faible',
                    couleur: 'text-red-600',
                    bgCouleur: 'bg-red-50 border-red-200',
                    message: 'Marge < 20%. Risque de non-rentabilité.'
                }
            }

            return {
                value: tauxMarge,
                unit: '%',
                interpretation,
                details: [
                    { label: 'Marge en €', value: `${margeEuros.toLocaleString('fr-FR')} €` },
                    { label: 'Taux de marque', value: `${tauxMarque}%` }
                ],
                recommendations: tauxMarge < 50 ? [
                    'Renégociez prix fournisseurs (-10% = doublement marge)',
                    'Optimisez coûts logistiques',
                    'Valorisez votre offre (packaging, service)',
                    'Analysez prix concurrence'
                ] : undefined
            }
        }
    },
    {
        id: 'seuil',
        title: 'Seuil de Rentabilité',
        description: 'Point mort - CA minimum pour être rentable',
        icon: BarChart3,
        color: 'from-slate-600 to-slate-800',
        dedicatedPage: '/calculateurs/seuil-rentabilite',
        inputs: [
            { key: 'chargesFixes', label: 'Charges fixes mensuelles', placeholder: '50000', unit: '€', tooltip: 'Loyers, salaires, abonnements...' },
            { key: 'tauxMarge', label: 'Taux de marge variable', placeholder: '40', unit: '%', tooltip: '(Prix vente - Coût variable) / Prix vente' }
        ],
        calculate: (inputs) => {
            const seuilCA = Math.round(inputs.chargesFixes / (inputs.tauxMarge / 100))
            const seuilAnnuel = seuilCA * 12

            let interpretation
            if (inputs.tauxMarge > 50) {
                interpretation = {
                    niveau: 'bon',
                    icone: CheckCircle,
                    titre: 'Modèle Solide',
                    couleur: 'text-green-600',
                    bgCouleur: 'bg-green-50 border-green-200',
                    message: 'Taux de marge >50%. Seuil de rentabilité atteignable.'
                }
            } else if (inputs.tauxMarge > 30) {
                interpretation = {
                    niveau: 'moyen',
                    icone: CheckCircle,
                    titre: 'Modèle Moyen',
                    couleur: 'text-amber-600',
                    bgCouleur: 'bg-amber-50 border-amber-200',
                    message: 'Marge 30-50%. Surveillez vos charges fixes.'
                }
            } else {
                interpretation = {
                    niveau: 'risque',
                    icone: AlertCircle,
                    titre: 'Modèle Risqué',
                    couleur: 'text-red-600',
                    bgCouleur: 'bg-red-50 border-red-200',
                    message: 'Marge <30%. Seuil difficile à atteindre.'
                }
            }

            return {
                value: seuilCA,
                unit: '€/mois',
                interpretation,
                details: [
                    { label: 'Seuil annuel', value: `${seuilAnnuel.toLocaleString('fr-FR')} €` },
                    { label: 'CA journalier nécessaire', value: `${Math.round(seuilCA / 22).toLocaleString('fr-FR')} €` }
                ],
                recommendations: [
                    'Réduisez charges fixes (télétravail, freelances)',
                    'Augmentez taux de marge (pricing, fournisseurs)',
                    'Calculez marge contribution par produit',
                    'Suivez votre break-even mensuel'
                ]
            }
        }
    },
    {
        id: 'ebitda',
        title: 'Calculateur EBITDA',
        description: 'Earnings Before Interest, Taxes, Depreciation & Amortization',
        icon: Calculator,
        color: 'from-slate-700 to-slate-900',
        inputs: [
            { key: 'resultatNet', label: 'Résultat net', placeholder: '100000', unit: '€' },
            { key: 'impots', label: 'Impôts sur bénéfices', placeholder: '30000', unit: '€' },
            { key: 'interets', label: 'Charges financières', placeholder: '10000', unit: '€' },
            { key: 'amortissements', label: 'Amortissements', placeholder: '20000', unit: '€' }
        ],
        calculate: (inputs) => {
            const ebitda = inputs.resultatNet + inputs.impots + inputs.interets + inputs.amortissements

            let interpretation
            if (ebitda > 200000) {
                interpretation = {
                    niveau: 'excellent',
                    icone: CheckCircle,
                    titre: 'EBITDA Solide',
                    couleur: 'text-green-600',
                    bgCouleur: 'bg-green-50 border-green-200',
                    message: 'Capacité bénéficiaire forte. Entreprise valorisable.'
                }
            } else if (ebitda > 50000) {
                interpretation = {
                    niveau: 'bon',
                    icone: CheckCircle,
                    titre: 'EBITDA Positif',
                    couleur: 'text-accent-primary',
                    bgCouleur: 'bg-blue-50 border-blue-200',
                    message: 'EBITDA positif. Activité rentable avant financement.'
                }
            } else if (ebitda > 0) {
                interpretation = {
                    niveau: 'faible',
                    icone: AlertCircle,
                    titre: 'EBITDA Faible',
                    couleur: 'text-amber-600',
                    bgCouleur: 'bg-amber-50 border-amber-200',
                    message: 'EBITDA faible. Marges opérationnelles à améliorer.'
                }
            } else {
                interpretation = {
                    niveau: 'negatif',
                    icone: AlertCircle,
                    titre: 'EBITDA Négatif',
                    couleur: 'text-red-600',
                    bgCouleur: 'bg-red-50 border-red-200',
                    message: 'Activité non rentable avant financement. Restructuration nécessaire.'
                }
            }

            return {
                value: ebitda,
                unit: '€',
                interpretation,
                details: [
                    { label: 'Marge EBITDA', value: inputs.resultatNet > 0 ? `${Math.round((ebitda / (inputs.resultatNet * 1.5)) * 100)}%` : 'N/A' }
                ]
            }
        }
    },
    {
        id: 'cac-ltv',
        title: 'CAC/LTV (SaaS)',
        description: 'Customer Acquisition Cost & Lifetime Value',
        icon: Target,
        color: 'from-slate-600 to-slate-800',
        inputs: [
            { key: 'cac', label: 'Coût d\'acquisition client (CAC)', placeholder: '500', unit: '€', tooltip: 'Marketing + Sales / Nb nouveaux clients' },
            { key: 'arpu', label: 'ARPU mensuel', placeholder: '99', unit: '€', tooltip: 'Average Revenue Per User' },
            { key: 'churn', label: 'Churn mensuel', placeholder: '3', unit: '%', tooltip: 'Taux de départ clients/mois' }
        ],
        calculate: (inputs) => {
            const churnDecimal = inputs.churn / 100
            const ltv = churnDecimal > 0 ? Math.round(inputs.arpu / churnDecimal) : 0
            const ratio = inputs.cac > 0 ? (ltv / inputs.cac).toFixed(1) : 0
            const paybackMonths = inputs.arpu > 0 ? Math.round(inputs.cac / inputs.arpu) : 0

            let interpretation
            if (Number(ratio) >= 3) {
                interpretation = {
                    niveau: 'excellent',
                    icone: CheckCircle,
                    titre: 'Excellent Ratio LTV/CAC',
                    couleur: 'text-green-600',
                    bgCouleur: 'bg-green-50 border-green-200',
                    message: `Ratio ${ratio}:1 = Excellent ! Modèle SaaS très rentable.`
                }
            } else if (Number(ratio) >= 2) {
                interpretation = {
                    niveau: 'bon',
                    icone: CheckCircle,
                    titre: 'Bon Ratio',
                    couleur: 'text-accent-primary',
                    bgCouleur: 'bg-blue-50 border-blue-200',
                    message: `Ratio ${ratio}:1 = Viable. Continuez à optimiser le CAC.`
                }
            } else if (Number(ratio) >= 1) {
                interpretation = {
                    niveau: 'limite',
                    icone: AlertCircle,
                    titre: 'Ratio Limite',
                    couleur: 'text-amber-600',
                    bgCouleur: 'bg-amber-50 border-amber-200',
                    message: `Ratio ${ratio}:1 = Juste équilibré. Réduisez CAC ou augmentez LTV.`
                }
            } else {
                interpretation = {
                    niveau: 'critique',
                    icone: AlertCircle,
                    titre: 'Ratio Critique',
                    couleur: 'text-red-600',
                    bgCouleur: 'bg-red-50 border-red-200',
                    message: `Ratio ${ratio}:1 = Non rentable ! CAC trop élevé vs LTV.`
                }
            }

            return {
                value: Number(ratio),
                unit: ':1',
                interpretation,
                details: [
                    { label: 'LTV', value: `${ltv.toLocaleString('fr-FR')} €` },
                    { label: 'Payback period', value: `${paybackMonths} mois` },
                    { label: 'Marge brute client', value: `${(ltv - inputs.cac).toLocaleString('fr-FR')} €` }
                ],
                recommendations: Number(ratio) < 3 ? [
                    'Réduisez CAC : optimisez canaux acquisition (SEO > Ads)',
                    'Augmentez LTV : upsell, cross-sell, annual plans',
                    'Réduisez churn : onboarding, customer success',
                    'Target : Ratio LTV/CAC > 3:1 et Payback < 12 mois'
                ] : undefined
            }
        }
    },
    {
        id: 'burn-rate',
        title: 'Burn Rate & Runway',
        description: 'Trésorerie & mois avant rupture de cash',
        icon: TrendingUp,
        color: 'from-slate-700 to-slate-900',
        inputs: [
            { key: 'tresorerie', label: 'Trésorerie actuelle', placeholder: '500000', unit: '€' },
            { key: 'depenses', label: 'Dépenses mensuelles', placeholder: '80000', unit: '€' },
            { key: 'revenus', label: 'Revenus mensuels', placeholder: '50000', unit: '€' }
        ],
        calculate: (inputs) => {
            const burnRate = inputs.depenses - inputs.revenus
            const runway = burnRate > 0 ? Math.round(inputs.tresorerie / burnRate) : 999
            const runwayDate = new Date()
            runwayDate.setMonth(runwayDate.getMonth() + runway)

            let interpretation
            if (burnRate <= 0) {
                interpretation = {
                    niveau: 'excellent',
                    icone: CheckCircle,
                    titre: 'Cashflow Positif',
                    couleur: 'text-green-600',
                    bgCouleur: 'bg-green-50 border-green-200',
                    message: 'Revenus > Dépenses. Pas de burn, croissance auto-financée !'
                }
            } else if (runway >= 18) {
                interpretation = {
                    niveau: 'confortable',
                    icone: CheckCircle,
                    titre: 'Runway Confortable',
                    couleur: 'text-accent-primary',
                    bgCouleur: 'bg-blue-50 border-blue-200',
                    message: `${runway} mois de runway. Situation saine pour lever fonds.`
                }
            } else if (runway >= 12) {
                interpretation = {
                    niveau: 'surveiller',
                    icone: AlertCircle,
                    titre: 'À Surveiller',
                    couleur: 'text-amber-600',
                    bgCouleur: 'bg-amber-50 border-amber-200',
                    message: `${runway} mois de runway. Commencez à lever ou réduire burn.`
                }
            } else if (runway >= 6) {
                interpretation = {
                    niveau: 'urgent',
                    icone: AlertCircle,
                    titre: 'Urgent',
                    couleur: 'text-orange-600',
                    bgCouleur: 'bg-orange-50 border-orange-200',
                    message: `${runway} mois de runway. Levée urgente ou pivot nécessaire !`
                }
            } else {
                interpretation = {
                    niveau: 'critique',
                    icone: AlertCircle,
                    titre: 'Critique',
                    couleur: 'text-red-600',
                    bgCouleur: 'bg-red-50 border-red-200',
                    message: `${runway} mois de runway. Action immédiate requise !`
                }
            }

            return {
                value: burnRate,
                unit: '€/mois',
                interpretation,
                details: [
                    { label: 'Runway', value: `${runway} mois` },
                    { label: 'Date rupture cash', value: runway < 999 ? runwayDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Infini' },
                    { label: 'Burn rate journalier', value: `${Math.round(burnRate / 30).toLocaleString('fr-FR')} €` }
                ],
                recommendations: burnRate > 0 ? [
                    'Réduisez dépenses : team lean, remote, freelances',
                    'Accélérez revenus : sales agressif, pricing higher',
                    'Levée fonds : commencez 6-9 mois avant runway 0',
                    'Plan B : pivot, acquisition, shutdown gracieux'
                ] : undefined
            }
        }
    },
    {
        id: 'valorisation',
        title: 'Valorisation Entreprise',
        description: 'Estimation par multiple EBITDA',
        icon: Calculator,
        color: 'from-slate-600 to-slate-800',
        inputs: [
            { key: 'ebitda', label: 'EBITDA annuel', placeholder: '500000', unit: '€' },
            { key: 'secteur', label: 'Secteur', placeholder: 'services', tooltip: 'Services, SaaS, Industrie, Commerce' }
        ],
        calculate: (inputs) => {
            // Multiples moyens par secteur (marché FR 2025)
            const multiples: Record<string, { min: number, max: number }> = {
                'services': { min: 4, max: 7 },
                'saas': { min: 8, max: 15 },
                'industrie': { min: 5, max: 9 },
                'commerce': { min: 3, max: 6 },
                'tech': { min: 10, max: 20 }
            }

            const secteurKey = inputs.secteur?.toString().toLowerCase() || 'services'
            const multiple = multiples[secteurKey] || multiples['services']

            const valorisationMin = Math.round(inputs.ebitda * multiple.min)
            const valorisationMax = Math.round(inputs.ebitda * multiple.max)
            const valorisationMoyenne = Math.round((valorisationMin + valorisationMax) / 2)

            let interpretation
            if (inputs.ebitda > 1000000) {
                interpretation = {
                    niveau: 'high-value',
                    icone: CheckCircle,
                    titre: 'Entreprise Valorisable',
                    couleur: 'text-green-600',
                    bgCouleur: 'bg-green-50 border-green-200',
                    message: `EBITDA ${(inputs.ebitda / 1000000).toFixed(1)}M€. Attractive pour investisseurs.`
                }
            } else if (inputs.ebitda > 200000) {
                interpretation = {
                    niveau: 'mid-value',
                    icone: CheckCircle,
                    titre: 'PME Rentable',
                    couleur: 'text-accent-primary',
                    bgCouleur: 'bg-blue-50 border-blue-200',
                    message: 'EBITDA solide. Valorisation intéressante pour acquéreur stratégique.'
                }
            } else if (inputs.ebitda > 0) {
                interpretation = {
                    niveau: 'low-value',
                    icone: AlertCircle,
                    titre: 'EBITDA Faible',
                    couleur: 'text-amber-600',
                    bgCouleur: 'bg-amber-50 border-amber-200',
                    message: 'EBITDA modeste. Valorisation limitée, focus sur croissance rentable.'
                }
            } else {
                interpretation = {
                    niveau: 'negative',
                    icone: AlertCircle,
                    titre: 'EBITDA Négatif',
                    couleur: 'text-red-600',
                    bgCouleur: 'bg-red-50 border-red-200',
                    message: 'Activité non rentable. Valorisation complexe (actifs, potentiel).'
                }
            }

            return {
                value: valorisationMoyenne,
                unit: '€',
                interpretation,
                details: [
                    { label: 'Fourchette basse', value: `${valorisationMin.toLocaleString('fr-FR')} €` },
                    { label: 'Fourchette haute', value: `${valorisationMax.toLocaleString('fr-FR')} €` },
                    { label: 'Multiple appliqué', value: `${multiple.min}x - ${multiple.max}x EBITDA` },
                    { label: 'Secteur', value: secteurKey.charAt(0).toUpperCase() + secteurKey.slice(1) }
                ],
                recommendations: [
                    'Augmentez EBITDA : croissance + marges opérationnelles',
                    'Due diligence : préparez 3 ans historiques + prévisionnel',
                    'Multiple varie selon : croissance, récurrence, dépendance fondateur',
                    'Conseil : faites évaluer par expert M&A pour précision'
                ]
            }
        }
    }
]

export function CalculatorHub() {
    const [selectedCalculator, setSelectedCalculator] = useState<CalculatorConfig | null>(null)
    const [inputs, setInputs] = useState<Record<string, string>>({})
    const [result, setResult] = useState<CalculatorResult | null>(null)

    const handleCalculate = () => {
        if (!selectedCalculator) return

        const numericInputs: Record<string, number> = {}
        let isValid = true

        selectedCalculator.inputs.forEach(input => {
            const value = parseFloat(inputs[input.key] || '0')
            if (isNaN(value) || (!input.optional && value <= 0)) {
                isValid = false
            }
            numericInputs[input.key] = value || 0
        })

        if (isValid) {
            const calculatedResult = selectedCalculator.calculate(numericInputs)
            setResult(calculatedResult)

            // Track usage
            trackCalculatorUse(selectedCalculator.id, calculatedResult.value, numericInputs)
        }
    }

    const handleReset = () => {
        setInputs({})
        setResult(null)
    }

    const handleClose = () => {
        setSelectedCalculator(null)
        setInputs({})
        setResult(null)
    }

    return (
        <>
            {/* Calculators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {calculators.map((calc) => {
                    const Icon = calc.icon
                    
                    // Si page dédiée existe, on redirige au lieu d'ouvrir modal
                    if (calc.dedicatedPage) {
                        return (
                            <Link
                                key={calc.id}
                                href={calc.dedicatedPage}
                                className="surface rounded-2xl p-8 border-2 border-border-default hover:border-accent-primary transition-all text-left group surface-hover block"
                            >
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${calc.color} mb-4`}>
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-accent-primary transition-colors">
                                    {calc.title}
                                </h3>
                                <p className="text-sm text-secondary mb-4">
                                    {calc.description}
                                </p>
                                <div className="flex items-center gap-2 text-accent-primary font-semibold">
                                    {calc.id === 'dso' && 'Vérifier mon délai réel'}
                                    {calc.id === 'bfr' && 'Mesurer mon cash immobilisé'}
                                    {calc.id === 'roi' && 'Tester la rentabilité'}
                                    {calc.id === 'marge' && 'Diagnostiquer ma marge'}
                                    {calc.id === 'seuil' && 'Suis-je vraiment rentable ?'}
                                    {calc.id === 'ebitda' && 'Calculer mon EBITDA'}
                                    {calc.id === 'cac-ltv' && 'Analyser ma rentabilité client'}
                                    {calc.id === 'burn-rate' && 'Mesurer ma consommation cash'}
                                    {calc.id === 'valorisation' && 'Estimer ma valorisation'}
                                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        )
                    }
                    
                    // Sinon, on ouvre le modal (calculateurs sans page dédiée)
                    return (
                        <button
                            key={calc.id}
                            onClick={() => setSelectedCalculator(calc)}
                            className="surface rounded-2xl p-8 border-2 border-border-default hover:border-accent-primary transition-all text-left group surface-hover"
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${calc.color} mb-4`}>
                                <Icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-accent-primary transition-colors">
                                {calc.title}
                            </h3>
                            <p className="text-sm text-secondary mb-4">
                                {calc.description}
                            </p>
                            <div className="flex items-center gap-2 text-accent-primary font-semibold">
                                {calc.id === 'dso' && 'Vérifier mon délai réel'}
                                {calc.id === 'bfr' && 'Mesurer mon cash immobilisé'}
                                {calc.id === 'roi' && 'Tester la rentabilité'}
                                {calc.id === 'marge' && 'Diagnostiquer ma marge'}
                                {calc.id === 'seuil' && 'Suis-je vraiment rentable ?'}
                                {calc.id === 'ebitda' && 'Calculer mon EBITDA'}
                                {calc.id === 'cac-ltv' && 'Analyser ma rentabilité client'}
                                {calc.id === 'burn-rate' && 'Mesurer ma consommation cash'}
                                {calc.id === 'valorisation' && 'Estimer ma valorisation'}
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Modal */}
            {selectedCalculator && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-accent-primary-border">
                        {/* Header */}
                        <div className="sticky top-0 surface border-b-2 border-border-default p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${selectedCalculator.color}`}>
                                    <selectedCalculator.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedCalculator.title}</h2>
                                    <p className="text-sm text-secondary">{selectedCalculator.description}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-surface-elevated rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            {!result ? (
                                <>
                                    {/* Inputs */}
                                    <div className="space-y-4 mb-6">
                                        {selectedCalculator.inputs.map(input => (
                                            <div key={input.key}>
                                                <label className="block text-sm font-medium mb-2">
                                                    {input.label}
                                                    {input.optional && <span className="text-tertiary ml-1">(optionnel)</span>}
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={inputs[input.key] || ''}
                                                        onChange={(e) => setInputs({ ...inputs, [input.key]: e.target.value })}
                                                        placeholder={input.placeholder}
                                                        className="w-full px-4 py-3 border border-border-default rounded-lg bg-surface-elevated focus:border-accent-primary focus:ring-2 focus:ring-accent-primary-subtle outline-none transition-all"
                                                    />
                                                    {input.unit && (
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary">
                                                            {input.unit}
                                                        </span>
                                                    )}
                                                </div>
                                                {input.tooltip && (
                                                    <p className="text-xs text-tertiary mt-1">{input.tooltip}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleCalculate}
                                            className="flex-1 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all"
                                        >
                                            Calculer
                                        </button>
                                        <button
                                            onClick={handleClose}
                                            className="px-6 py-3 border-2 border-border-default hover:border-accent-primary rounded-lg font-semibold transition-all"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Result */}
                                    <div className="space-y-6">
                                        <div className="text-center p-8 surface-elevated rounded-xl border-2 border-accent-primary">
                                            <p className="text-secondary mb-2">Résultat</p>
                                            <p className="text-6xl font-bold text-accent-primary mb-2">
                                                {result.value.toLocaleString('fr-FR')}
                                                <span className="text-3xl ml-2">{result.unit}</span>
                                            </p>
                                            {result.details && (
                                                <div className="mt-4 pt-4 border-t-2 border-border-default">
                                                    {result.details.map((detail, idx) => (
                                                        <div key={idx} className="flex justify-between text-sm mb-2">
                                                            <span className="text-secondary">{detail.label}</span>
                                                            <span className="font-semibold">{detail.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Interpretation */}
                                        <div className={`p-4 rounded-lg border-2 ${result.interpretation.bgCouleur}`}>
                                            <div className="flex items-start gap-3">
                                                <result.interpretation.icone className={`w-6 h-6 flex-shrink-0 ${result.interpretation.couleur}`} />
                                                <div className="flex-1">
                                                    <h3 className={`text-lg font-bold mb-1 ${result.interpretation.couleur}`}>
                                                        {result.interpretation.titre}
                                                    </h3>
                                                    <p className="text-sm text-secondary">
                                                        {result.interpretation.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recommendations */}
                                        {result.recommendations && result.recommendations.length > 0 && (
                                            <div className="surface-elevated rounded-xl p-6 border border-border-default">
                                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                                    <TrendingUp className="w-5 h-5 text-accent-primary" />
                                                    Recommandations
                                                </h4>
                                                <ul className="space-y-2">
                                                    {result.recommendations.map((rec, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                                            <span className="text-accent-primary font-bold">{idx + 1}.</span>
                                                            <span className="text-secondary">{rec}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleReset}
                                                className="flex-1 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all"
                                            >
                                                Nouveau calcul
                                            </button>
                                            <button
                                                onClick={handleClose}
                                                className="px-6 py-3 border-2 border-border-default hover:border-accent-primary rounded-lg font-semibold transition-all"
                                            >
                                                Fermer
                                            </button>
                                        </div>

                                        {/* CTA FinSight */}
                                        <div className="bg-accent-primary-subtle border-2 border-accent-primary-border rounded-xl p-6 text-center">
                                            <p className="font-semibold mb-2">
                                                Automatisez ce calcul avec FinSight
                                            </p>
                                            <p className="text-sm text-secondary mb-4">
                                                Plus besoin de calculer manuellement. FinSight analyse vos données et calcule tous vos KPIs automatiquement.
                                            </p>
                                            <a
                                                href="/dashboard"
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all"
                                            >
                                                Demander une démo
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
