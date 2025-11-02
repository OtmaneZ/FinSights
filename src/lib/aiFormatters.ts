/**
 * Formatters pour générer les réponses de l'IA Copilot
 * Utilise les KPIs déjà calculés (pas de duplication de logique)
 */

import { FinSightDataModel, KPIMetric } from './dataModel'

/**
 * Formate la réponse sur la trésorerie
 */
export function formatTresorerieResponse(kpi: KPIMetric): string {
    return `💰 Votre position de trésorerie actuelle est de ${kpi.formatted}. ` +
        `Variation ce mois : ${kpi.changeFormatted}. ` +
        `Tendance : ${kpi.changeType === 'positive' ? '📈 En amélioration' :
            kpi.changeType === 'negative' ? '📉 En dégradation' : '➡️ Stable'}.`
}

/**
 * Formate la réponse sur la marge
 */
export function formatMargeResponse(kpi: KPIMetric): string {
    return `📊 Votre marge brute s'établit à ${kpi.formatted}. ` +
        `Évolution : ${kpi.changeFormatted}. ` +
        `Cette marge est ${kpi.changeType === 'positive' ? 'en progression' :
            kpi.changeType === 'negative' ? 'en baisse' : 'stable'} par rapport à la période précédente.`
}

/**
 * Formate la réponse sur le DSO
 */
export function formatDSOResponse(kpi: KPIMetric): string {
    return `⏰ Le délai moyen de paiement client (DSO) est de ${kpi.formatted}. ` +
        `Évolution : ${kpi.changeFormatted}. ` +
        `${kpi.changeType === 'negative' ? 'Bonne nouvelle, vos encaissements s\'accélérent.' :
            kpi.changeType === 'positive' ? 'Attention, vos clients paient plus lentement.' : 'Délais stables.'}`
}

/**
 * Analyse globale de performance
 */
export function formatPerformanceAnalysis(data: FinSightDataModel): string {
    const kpis = data.kpis
    const kpiArray = [kpis.revenue, kpis.margin, kpis.cashFlow, kpis.dso, kpis.ebitda]
    const positifs = kpiArray.filter(k => k.changeType === 'positive').length
    const negatifs = kpiArray.filter(k => k.changeType === 'negative').length

    let status = "stable"
    if (positifs > negatifs) status = "en progression"
    if (negatifs > positifs) status = "à surveiller"

    return `📈 Performance globale : ${status}. ` +
        `${positifs} indicateurs en amélioration, ${negatifs} en dégradation. ` +
        `Analyse basée sur ${data.recordCount} transactions de la période ${data.period.label}.`
}

/**
 * Détecte les risques financiers
 */
export function formatRisqueDetection(data: FinSightDataModel): string {
    const risques: string[] = []

    // Risque trésorerie
    const cashflowKPI = data.kpis.cashFlow
    if (cashflowKPI.changeType === 'negative' && Math.abs(cashflowKPI.changeValue) > cashflowKPI.value * 0.2) {
        risques.push("dégradation forte de la trésorerie (-" + Math.round(Math.abs(cashflowKPI.changeValue / cashflowKPI.value * 100)) + "%)")
    }

    // Risque marge
    const margeKPI = data.kpis.margin
    if (margeKPI.changeType === 'negative' && Math.abs(margeKPI.changeValue) > margeKPI.value * 0.1) {
        risques.push("érosion des marges (-" + Math.round(Math.abs(margeKPI.changeValue)) + " points)")
    }

    // Risque DSO
    const dsoKPI = data.kpis.dso
    if (dsoKPI.changeType === 'positive' && dsoKPI.changeValue > 5) {
        risques.push("allongement des délais de paiement (+" + Math.round(dsoKPI.changeValue) + " jours)")
    }

    if (risques.length === 0) {
        return "✅ Aucun risque majeur détecté dans vos données financières actuelles."
    }

    return `⚠️ Risques détectés : ${risques.join(', ')}. ` +
        `Je recommande un suivi renforcé de ces indicateurs.`
}

/**
 * Simule un scénario What-If
 */
export function formatScenarioSimulation(
    type: 'dso' | 'marge' | 'ca',
    currentValue: number,
    variation: number,
    unit: string = ''
): string {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)

    switch (type) {
        case 'dso':
            const nouveauDSO = Math.max(0, currentValue - variation)
            const impactTreso = (currentValue - nouveauDSO) * 1000 // Estimation simplifiée
            return `💡 Simulation DSO : Réduire de ${variation} jours (${Math.round(currentValue)}j → ${Math.round(nouveauDSO)}j) ` +
                `améliorerait votre trésorerie d'environ ${formatCurrency(impactTreso)}.`

        case 'marge':
            const nouvelleMarge = currentValue + variation
            return `💡 Simulation marge : Augmenter de ${variation}% (${currentValue.toFixed(1)}% → ${nouvelleMarge.toFixed(1)}%) ` +
                `améliorerait significativement votre rentabilité.`

        case 'ca':
            const nouveauCA = currentValue * (1 + variation / 100)
            const delta = nouveauCA - currentValue
            return `💡 Simulation CA : Une variation de ${variation > 0 ? '+' : ''}${variation}% porterait votre CA de ` +
                `${formatCurrency(currentValue)} à ${formatCurrency(nouveauCA)} (${variation > 0 ? '+' : ''}${formatCurrency(delta)}).`

        default:
            return `🤖 Type de simulation "${type}" non reconnu. Essayez "dso", "marge" ou "ca".`
    }
}

/**
 * Génère un résumé exécutif
 */
export function formatExecutiveSummary(data: FinSightDataModel): string {
    const kpis = data.kpis

    return `📊 **Résumé Exécutif** (${data.period.label})

**Revenus** : ${kpis.revenue.formatted} (${kpis.revenue.changeFormatted})
**Trésorerie** : ${kpis.cashFlow.formatted} (${kpis.cashFlow.changeFormatted})
**Marge** : ${kpis.margin.formatted} (${kpis.margin.changeFormatted})
**DSO** : ${kpis.dso.formatted} (${kpis.dso.changeFormatted})
**EBITDA** : ${kpis.ebitda.formatted} (${kpis.ebitda.changeFormatted})

Basé sur ${data.recordCount} transactions analysées.`
}
