/**
 * MOTEUR DE CAPACITÉS DYNAMIQUES
 * Analyse automatiquement ce que l'IA peut/ne peut pas faire selon les données disponibles
 */

export interface DataCapabilities {
    // Capacités de calcul
    canCalculateDSO: boolean
    canCalculateRevenue: boolean
    canCalculateMargin: boolean
    canAnalyzeClients: boolean
    canTrackCashFlow: boolean
    canProjectFuture: boolean
    canDetectTrends: boolean
    canBenchmark: boolean

    // Blockers (pourquoi on ne peut pas)
    dsoBlockers: string[]
    marginBlockers: string[]
    projectionBlockers: string[]

    // Données disponibles
    availableMetrics: string[]
    dataQuality: 'excellent' | 'good' | 'basic' | 'insufficient'
    recordCount: number
    timeSpan: string

    // Suggestions d'amélioration
    suggestions: string[]
}

/**
 * ANALYSE PRINCIPALE - Détermine toutes les capacités selon les données
 */
export function analyzeDataCapabilities(finSightData: any, rawData: any[]): DataCapabilities {
    const capabilities: DataCapabilities = {
        canCalculateDSO: false,
        canCalculateRevenue: false,
        canCalculateMargin: false,
        canAnalyzeClients: false,
        canTrackCashFlow: false,
        canProjectFuture: false,
        canDetectTrends: false,
        canBenchmark: false,
        dsoBlockers: [],
        marginBlockers: [],
        projectionBlockers: [],
        availableMetrics: [],
        dataQuality: 'insufficient',
        recordCount: rawData?.length || 0,
        timeSpan: '',
        suggestions: []
    }

    if (!rawData || rawData.length === 0) {
        capabilities.suggestions.push('Importez des données CSV pour commencer l\'analyse')
        return capabilities
    }

    // Analyser les colonnes disponibles
    const columns = Object.keys(rawData[0] || {}).map(col => col.toLowerCase())

    // CAPACITÉ : Calcul du Chiffre d'Affaires
    if (hasColumn(columns, ['montant', 'amount']) && hasColumn(columns, ['date'])) {
        capabilities.canCalculateRevenue = true
        capabilities.availableMetrics.push('Chiffre d\'affaires')
    }

    // CAPACITÉ : Analyse Clients
    if (hasColumn(columns, ['client', 'customer', 'counterparty']) && capabilities.canCalculateRevenue) {
        capabilities.canAnalyzeClients = true
        capabilities.availableMetrics.push('Analyse par clients')
    }

    // CAPACITÉ : Calcul DSO (très strict)
    const hasDates = hasColumn(columns, ['date', 'date_facture', 'invoice_date'])
    const hasEcheances = hasColumn(columns, ['echeance', 'due_date', 'date_echeance'])
    const hasStatut = hasColumn(columns, ['statut', 'status', 'paye', 'paid'])

    if (hasDates && hasEcheances && hasStatut) {
        capabilities.canCalculateDSO = true
        capabilities.availableMetrics.push('DSO (Délais de paiement)')
    } else {
        if (!hasEcheances) capabilities.dsoBlockers.push('dates d\'échéance manquantes')
        if (!hasStatut) capabilities.dsoBlockers.push('statut des paiements manquant')
        if (!hasDates) capabilities.dsoBlockers.push('dates de factures manquantes')
    }

    // CAPACITÉ : Analyse des Charges (montants négatifs)
    const hasNegativeAmounts = rawData.some(row => {
        const amount = parseFloat(row.montant || row.amount || row.Montant || '0')
        return amount < 0
    })

    if (hasNegativeAmounts && capabilities.canCalculateRevenue) {
        capabilities.availableMetrics.push('Analyse des charges')
    }

    // CAPACITÉ : Calcul Marges (revenus - charges)
    const hasCosts = hasColumn(columns, ['cout', 'cost', 'prix_achat', 'cout_unitaire'])
    const hasPrices = hasColumn(columns, ['prix', 'price', 'prix_vente'])

    if ((hasCosts && hasPrices) || (hasNegativeAmounts && capabilities.canCalculateRevenue)) {
        capabilities.canCalculateMargin = true
        capabilities.availableMetrics.push('Analyse de rentabilité')
    } else {
        if (!hasCosts && !hasNegativeAmounts) capabilities.marginBlockers.push('coûts ou charges manquants')
        if (!hasPrices && !capabilities.canCalculateRevenue) capabilities.marginBlockers.push('revenus manquants')
    }

    // CAPACITÉ : Projections (besoin d'historique)
    const timeSpan = calculateTimeSpan(rawData)
    capabilities.timeSpan = timeSpan

    if (capabilities.recordCount >= 30 && timeSpan.includes('mois')) {
        capabilities.canProjectFuture = true
        capabilities.canDetectTrends = true
        capabilities.availableMetrics.push('Projections', 'Analyse de tendances')
    } else {
        if (capabilities.recordCount < 30) capabilities.projectionBlockers.push(`seulement ${capabilities.recordCount} transactions (min 30)`)
        if (!timeSpan.includes('mois')) capabilities.projectionBlockers.push('historique insuffisant (min 2 mois)')
    }

    // CAPACITÉ : Cashflow
    if (capabilities.canCalculateRevenue && capabilities.recordCount >= 10) {
        capabilities.canTrackCashFlow = true
        capabilities.availableMetrics.push('Suivi de trésorerie')
    }

    // QUALITÉ DES DONNÉES
    if (capabilities.availableMetrics.length >= 4) capabilities.dataQuality = 'excellent'
    else if (capabilities.availableMetrics.length >= 2) capabilities.dataQuality = 'good'
    else if (capabilities.availableMetrics.length >= 1) capabilities.dataQuality = 'basic'

    // SUGGESTIONS D'AMÉLIORATION
    if (!capabilities.canCalculateDSO) {
        capabilities.suggestions.push('Ajoutez colonnes Date_echeance et Statut_paiement pour le DSO')
    }
    if (!capabilities.canCalculateMargin) {
        capabilities.suggestions.push('Ajoutez colonnes Cout_unitaire et Prix_vente pour les marges')
    }
    if (!capabilities.canProjectFuture) {
        capabilities.suggestions.push('Importez plus d\'historique (2+ mois) pour les projections')
    }

    return capabilities
}

/**
 * UTILITAIRES
 */
function hasColumn(columns: string[], searchTerms: string[]): boolean {
    return searchTerms.some(term =>
        columns.some(col => col.includes(term.toLowerCase()))
    )
}

function calculateTimeSpan(data: any[]): string {
    if (!data || data.length === 0) return 'Aucune donnée'

    // Simplification : on retourne selon le nombre de records
    if (data.length >= 100) return '3+ mois'
    if (data.length >= 50) return '2+ mois'
    if (data.length >= 20) return '1 mois'
    return 'Moins d\'1 mois'
}

/**
 * GÉNÉRATEUR DE RÉPONSES ADAPTATIVES
 */
export function generateAdaptiveResponse(question: string, capabilities: DataCapabilities, finSightData: any, rawData?: any[]): string {
    const lowerQuestion = question.toLowerCase()

    // ANALYSE DSO
    if (lowerQuestion.includes('dso') || lowerQuestion.includes('délai') || lowerQuestion.includes('paiement')) {
        if (capabilities.canCalculateDSO) {
            const dso = finSightData?.kpis?.dso?.formatted || 'Calculé'
            return `⏱️ **Votre DSO : ${dso}**\n\n✅ Calcul possible car vos données contiennent les éléments requis.\n\n📊 ${capabilities.recordCount} transactions analysées`
        } else {
            return `❌ **Je ne peux pas calculer votre DSO**\n\n**Il manque :** ${capabilities.dsoBlockers.join(', ')}\n\n💡 **Pour débloquer :** ${capabilities.suggestions.filter(s => s.includes('DSO')).join('\n')}\n\n📊 Données disponibles : ${capabilities.recordCount} transactions`
        }
    }

    // ANALYSE CHIFFRE D'AFFAIRES
    if (lowerQuestion.includes('chiffre') || lowerQuestion.includes('ca') || lowerQuestion.includes('revenue')) {
        if (capabilities.canCalculateRevenue) {
            // 🔥 CALCUL DIRECT avec rawData si finSightData n'a pas la valeur
            let caValue = finSightData?.kpis?.revenue?.formatted;

            if (!caValue && rawData && rawData.length > 0) {
                // Calculer directement depuis rawData
                const totalRevenue = rawData
                    .filter(row => {
                        const amount = parseFloat(row.montant || row.amount || row.Montant || '0');
                        return amount > 0; // Seulement les entrées positives
                    })
                    .reduce((sum, row) => {
                        const amount = parseFloat(row.montant || row.amount || row.Montant || '0');
                        return sum + amount;
                    }, 0);

                caValue = new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                }).format(totalRevenue);
            }

            caValue = caValue || 'Calcul en cours...';

            return `📊 **Votre Chiffre d'Affaires : ${caValue}**\n\n✅ Calculé sur ${capabilities.recordCount} transactions\n📈 Période : ${capabilities.timeSpan}\n\n${capabilities.canAnalyzeClients ? '🎯 Analyse par clients disponible' : ''}`
        } else {
            return `❌ **Je ne peux pas calculer votre CA**\n\nIl manque des colonnes Montant et Date dans vos données.\n\n📊 ${capabilities.recordCount} transactions trouvées`
        }
    }

    // ANALYSE DES CLIENTS
    if (lowerQuestion.includes('client') || lowerQuestion.includes('customer') || lowerQuestion.includes('meilleur')) {
        if (capabilities.canAnalyzeClients && rawData && rawData.length > 0) {
            // Calculer CA par client
            const clientAnalysis = rawData
                .filter(row => {
                    const amount = parseFloat(row.montant || row.amount || row.Montant || '0');
                    return amount > 0;
                })
                .reduce((acc, row) => {
                    const client = row.client || row.Customer || row.counterparty || 'Client inconnu';
                    const amount = parseFloat(row.montant || row.amount || row.Montant || '0');
                    acc[client] = (acc[client] || 0) + amount;
                    return acc;
                }, {} as Record<string, number>);

            const topClients = Object.entries(clientAnalysis)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 5)
                .map(([client, amount], index) => {
                    const formatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount as number);
                    return `${index + 1}. **${client}** : ${formatted}`;
                });

            return `🎯 **Analyse de vos clients**\n\n👥 **Top 5 clients :**\n${topClients.join('\n')}\n\n📊 ${Object.keys(clientAnalysis).length} clients analysés\n📈 Période : ${capabilities.timeSpan}`;
        } else {
            return `❌ **Je ne peux pas analyser vos clients**\n\nIl manque une colonne Client dans vos données.\n\n📊 ${capabilities.recordCount} transactions trouvées`;
        }
    }

    // ANALYSE DES CHARGES
    if (lowerQuestion.includes('charge') || lowerQuestion.includes('dépense') || lowerQuestion.includes('coût') || lowerQuestion.includes('frais')) {
        if (rawData && rawData.length > 0) {
            const charges = rawData
                .filter(row => {
                    const amount = parseFloat(row.montant || row.amount || row.Montant || '0');
                    return amount < 0;
                })
                .reduce((sum, row) => {
                    const amount = parseFloat(row.montant || row.amount || row.Montant || '0');
                    return sum + Math.abs(amount);
                }, 0);

            if (charges > 0) {
                const chargesFormatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(charges);
                const chargesCount = rawData.filter(row => parseFloat(row.montant || row.amount || row.Montant || '0') < 0).length;

                return `💰 **Vos Charges : ${chargesFormatted}**\n\n📉 ${chargesCount} transactions de charges\n📈 Période : ${capabilities.timeSpan}\n\n${capabilities.canCalculateMargin ? '💡 Analyse de rentabilité disponible' : ''}`;
            } else {
                return `✅ **Aucune charge détectée**\n\nToutes vos transactions sont des revenus positifs.\n\n📊 ${capabilities.recordCount} transactions analysées`;
            }
        } else {
            return `❌ **Impossible d'analyser les charges**\n\nAucune donnée disponible.\n\n💡 Importez vos données CSV`;
        }
    }

    // ANALYSE DES MARGES
    if (lowerQuestion.includes('marge') || lowerQuestion.includes('rentabilité') || lowerQuestion.includes('bénéfice') || lowerQuestion.includes('profit')) {
        if (capabilities.canCalculateMargin && rawData && rawData.length > 0) {
            const revenus = rawData
                .filter(row => parseFloat(row.montant || row.amount || row.Montant || '0') > 0)
                .reduce((sum, row) => sum + parseFloat(row.montant || row.amount || row.Montant || '0'), 0);

            const charges = rawData
                .filter(row => parseFloat(row.montant || row.amount || row.Montant || '0') < 0)
                .reduce((sum, row) => sum + Math.abs(parseFloat(row.montant || row.amount || row.Montant || '0')), 0);

            const marge = revenus - charges;
            const tauxMarge = revenus > 0 ? (marge / revenus * 100) : 0;

            const margeFormatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(marge);
            const revenusFormatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(revenus);
            const chargesFormatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(charges);

            const emoji = tauxMarge > 20 ? '🚀' : tauxMarge > 10 ? '📈' : tauxMarge > 0 ? '⚖️' : '⚠️';

            return `${emoji} **Analyse de Rentabilité**\n\n💰 **Revenus** : ${revenusFormatted}\n💸 **Charges** : ${chargesFormatted}\n📊 **Marge** : ${margeFormatted}\n📈 **Taux de marge** : ${tauxMarge.toFixed(1)}%\n\n📅 Période : ${capabilities.timeSpan}`;
        } else {
            return `❌ **Je ne peux pas calculer la rentabilité**\n\n**Il manque :** ${capabilities.marginBlockers.join(', ')}\n\n📊 ${capabilities.recordCount} transactions disponibles`;
        }
    }

    // ANALYSE CASHFLOW
    if (lowerQuestion.includes('cashflow') || lowerQuestion.includes('trésorerie') || lowerQuestion.includes('flux') || lowerQuestion.includes('liquidité')) {
        if (capabilities.canTrackCashFlow && rawData && rawData.length > 0) {
            // Calculer l'évolution mensuelle
            const monthlyFlow = rawData.reduce((acc, row) => {
                const dateStr = row.date || row.Date || '';
                const amount = parseFloat(row.montant || row.amount || row.Montant || '0');

                if (dateStr && amount !== 0) {
                    const month = dateStr.slice(0, 7); // YYYY-MM format
                    acc[month] = (acc[month] || 0) + amount;
                }
                return acc;
            }, {} as Record<string, number>);

            const months = Object.keys(monthlyFlow).sort();
            const currentFlow = Object.values(monthlyFlow).reduce((sum: number, val: unknown) => sum + (val as number), 0);
            const avgMonthly = months.length > 0 ? currentFlow / months.length : 0;

            const currentFormatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(currentFlow);
            const avgFormatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(avgMonthly);

            const trend = months.length >= 2 ?
                (monthlyFlow[months[months.length - 1]] > monthlyFlow[months[months.length - 2]] ? '📈 En amélioration' : '📉 En baisse') :
                '➡️ Stable';

            return `💧 **Analyse de Trésorerie**\n\n💰 **Flux total** : ${currentFormatted}\n📅 **Moyenne mensuelle** : ${avgFormatted}\n📊 **Tendance** : ${trend}\n\n📈 ${months.length} mois analysés • ${capabilities.recordCount} transactions`;
        } else {
            return `❌ **Je ne peux pas analyser la trésorerie**\n\nIl faut au moins 10 transactions avec des dates.\n\n📊 ${capabilities.recordCount} transactions disponibles`;
        }
    }

    // ANALYSE GÉNÉRALE DES CAPACITÉS
    return `🤖 **Analyse de vos capacités financières**\n\n✅ **Ce que je peux analyser :**\n${capabilities.availableMetrics.map(m => `• ${m}`).join('\n')}\n\n💡 **Suggestions d'amélioration :**\n${capabilities.suggestions.map(s => `• ${s}`).join('\n')}\n\n📊 Qualité des données : ${capabilities.dataQuality}\n📈 ${capabilities.recordCount} transactions • ${capabilities.timeSpan}`
}