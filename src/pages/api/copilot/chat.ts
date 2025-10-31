import type { NextApiRequest, NextApiResponse } from 'next'
import { analyzeDataCapabilities, generateAdaptiveResponse } from '@/lib/adaptiveCapabilities'

// Types pour les requêtes copilot
interface CopilotRequest {
    message: string
    context?: {
        finSightData?: any
        rawData?: any[]
        conversationHistory?: Array<{
            role: 'user' | 'assistant'
            content: string
            timestamp: string
        }>
    }
}

interface CopilotResponse {
    success: boolean
    response?: string
    suggestions?: string[]
    actions?: Array<{
        type: string
        label: string
        data: any
    }>
    error?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CopilotResponse>
) {
    // Validation méthode
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Méthode non autorisée. Utilisez POST.'
        })
    }

    try {
        const { message, context }: CopilotRequest = req.body

        // Validation du message
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Message requis et non vide.'
            })
        }

        console.log('🤖 Copilot - Requête reçue:', {
            message: message.substring(0, 100) + '...',
            hasContext: !!context,
            hasFinSightData: !!context?.finSightData,
            hasRawData: !!context?.rawData
        })

        // ✨ NOUVEAU MOTEUR ADAPTATIF
        if (context?.finSightData && context?.rawData) {
            const capabilities = analyzeDataCapabilities(context.finSightData, context.rawData)
            console.log('🧠 Capacités détectées:', capabilities)

            const adaptiveResponse = generateAdaptiveResponse(message, capabilities, context.finSightData, context.rawData)

            return res.status(200).json({
                success: true,
                response: adaptiveResponse,
                suggestions: generateSuggestions(message, capabilities),
                actions: []
            })
        }

        // Fallback pour compatibilité (ancien système)
        console.log('⚠️ Fallback vers ancien système')

        // Analyse du contexte financier
        const financialContext = context?.finSightData ? analyzeFinancialContext(context.finSightData) : null

        // Génération de la réponse basée sur le contexte
        const response = await generateResponse(message, financialContext, context?.finSightData, context?.conversationHistory)

        // Génération de suggestions contextuelles
        const suggestions = generateSuggestions(message, financialContext)

        // Génération d'actions possibles
        const actions = generateActions(message, financialContext)

        return res.status(200).json({
            success: true,
            response,
            suggestions,
            actions
        })

    } catch (error) {
        console.error('❌ Erreur Copilot:', error)

        return res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur lors de la génération de la réponse.'
        })
    }
}

/**
 * Analyse le contexte financier pour extraire les informations clés
 */
function analyzeFinancialContext(finSightData: any): string {
    if (!finSightData) return ''

    const contextParts: string[] = []

    // Informations sur la période
    if (finSightData.period) {
        contextParts.push(`Période analysée: ${finSightData.period.label}`)
    }

    // KPIs principaux
    if (finSightData.kpis) {
        const kpis = finSightData.kpis

        if (kpis.revenue) {
            contextParts.push(`Chiffre d'affaires: ${kpis.revenue.formatted} (${kpis.revenue.changeFormatted})`)
        }

        if (kpis.cashFlow) {
            contextParts.push(`Trésorerie: ${kpis.cashFlow.formatted} (${kpis.cashFlow.changeFormatted})`)
        }

        if (kpis.margin) {
            contextParts.push(`Marge: ${kpis.margin.formatted} (${kpis.margin.changeFormatted})`)
        }

        if (kpis.dso) {
            contextParts.push(`DSO: ${kpis.dso.formatted} (${kpis.dso.changeFormatted})`)
        }
    }

    // Informations sur les données
    if (finSightData.recordCount) {
        contextParts.push(`${finSightData.recordCount} transactions analysées`)
    }

    // Niveau de données détecté
    if (finSightData.levelInfo) {
        contextParts.push(`Niveau de données: ${finSightData.levelInfo.description}`)
    }

    return contextParts.join('. ')
}

/**
 * Génère une réponse contextualisée basée sur les données financières
 */
async function generateResponse(message: string, financialContext: string | null, finSightData?: any, history?: any[]): Promise<string> {
    const messageLower = message.toLowerCase()

    // Réponses spécialisées selon le contexte
    if (!financialContext) {
        return generateNoDataResponse(message)
    }

    // Analyse des KPIs
    if (messageLower.includes('chiffre') || messageLower.includes('revenue') || messageLower.includes('ca')) {
        return generateRevenueAnalysis(financialContext)
    }

    if (messageLower.includes('trésorerie') || messageLower.includes('cash') || messageLower.includes('liquidité')) {
        return generateCashFlowAnalysis(financialContext)
    }

    if (messageLower.includes('marge') || messageLower.includes('margin') || messageLower.includes('rentabilité')) {
        return generateMarginAnalysis(financialContext)
    }

    if (messageLower.includes('dso') || messageLower.includes('délai') || messageLower.includes('paiement')) {
        return generateDSOAnalysis(financialContext, finSightData)
    }

    if (messageLower.includes('recommandation') || messageLower.includes('conseil') || messageLower.includes('action')) {
        return generateRecommendations(financialContext)
    }

    // Analyse générale
    return generateGeneralAnalysis(message, financialContext, finSightData)
}

/**
 * Réponse quand aucune donnée n'est disponible
 */
function generateNoDataResponse(message: string): string {
    return `🤖 **Copilote FinSight**

Bonjour ! Je suis votre assistant financier IA, mais je n'ai pas encore accès à vos données financières.

**Pour une analyse personnalisée :**
1. 📁 Importez votre fichier CSV via le bouton "Import Données"
2. 📊 Vos KPIs s'afficheront automatiquement
3. 💬 Je pourrai alors répondre à vos questions avec vos vraies données

**Exemples de questions que je peux traiter :**
- "Analyse mon chiffre d'affaires"
- "Comment améliorer ma trésorerie ?"
- "Quelles sont mes recommandations prioritaires ?"

**En attendant, posez-moi une question générale sur la gestion financière !** 💡`
}

/**
 * Analyse du chiffre d'affaires
 */
function generateRevenueAnalysis(context: string): string {
    return `📊 **Analyse Chiffre d'Affaires**

Basé sur vos données actuelles :
${context}

**Points clés :**
- 📈 Évolution du CA par rapport à la période précédente
- 🎯 Performance vs objectifs
- 📅 Saisonnalité et tendances

**Recommandations :**
- Analyser les facteurs de croissance/décroissance
- Identifier les segments les plus performants
- Planifier les actions commerciales pour les prochains mois

Souhaitez-vous que j'approfondisse un aspect particulier ?`
}

/**
 * Analyse de la trésorerie
 */
function generateCashFlowAnalysis(context: string): string {
    return `💰 **Analyse Trésorerie**

Situation actuelle :
${context}

**Éléments d'analyse :**
- 🔄 Flux entrants vs sortants
- ⏰ Délais de paiement clients/fournisseurs
- 📈 Projection à 30/60/90 jours

**Actions prioritaires :**
- Optimiser le recouvrement clients
- Négocier les délais fournisseurs
- Anticiper les besoins de financement

Voulez-vous une projection de trésorerie détaillée ?`
}

/**
 * Analyse de la marge
 */
function generateMarginAnalysis(context: string): string {
    return `📉 **Analyse Rentabilité**

Vos marges actuelles :
${context}

**Leviers d'optimisation :**
- 💰 Prix de vente et politique tarifaire
- 📦 Coûts d'achat et négociation fournisseurs
- ⚡ Efficacité opérationnelle

**Benchmark secteur :**
- Comparer vos marges aux standards du marché
- Identifier les écarts de performance

Souhaitez-vous une analyse détaillée par produit/service ?`
}

/**
 * Analyse DSO avec vraies données
 */
function generateDSOAnalysis(context: string, finSightData: any): string {
    // Extraire les vraies données DSO
    let dsoValue = 'Non calculé';
    let dsoChange = '';
    let recordCount = 0;
    let periodLabel = 'Période inconnue';
    let canCalculateDSO = false;

    if (finSightData?.kpis?.dso) {
        dsoValue = finSightData.kpis.dso.formatted || finSightData.kpis.dso.value;
        dsoChange = finSightData.kpis.dso.changeFormatted || '';
        canCalculateDSO = true;
    }

    if (finSightData?.recordCount) {
        recordCount = finSightData.recordCount;
    }

    if (finSightData?.period?.label) {
        periodLabel = finSightData.period.label;
    }

    // Si on ne peut pas calculer le DSO, expliquer pourquoi
    if (!canCalculateDSO) {
        return `⏱️ **Analyse Délais de Paiement**

❌ **Je ne peux pas calculer votre DSO avec ces données**

📊 **Données disponibles** : ${recordCount} transactions • ${periodLabel}

**Il me manque pour calculer le DSO :**
- 📅 **Dates d'échéance** des factures clients
- 💰 **Statut des paiements** (payé/impayé/en retard)
- 📋 **Distinction claire** entre factures et encaissements

**Pour obtenir votre DSO, ajoutez ces colonnes à votre CSV :**
- \`Date_facture\`, \`Date_echeance\`, \`Date_paiement\`, \`Statut\`
- Ou \`Facture_numero\`, \`Client\`, \`Echeance\`, \`Paye\`

**Ce que je peux analyser actuellement :**
- 💰 Chiffre d'affaires et flux de trésorerie
- 📊 Répartition par clients et montants
- 📈 Évolution mensuelle des ventes

Voulez-vous que j'analyse un autre aspect de vos finances ?`;
    }

    // Si on peut calculer le DSO (code existant)
    let impactEstimate = '';
    if (finSightData?.kpis?.revenue?.value && typeof finSightData.kpis.revenue.value === 'number') {
        const monthlyRevenue = finSightData.kpis.revenue.value;
        const impactReduction10j = Math.round((monthlyRevenue / 30) * 10);
        impactEstimate = `- Une réduction de 10 jours libérerait environ ${impactReduction10j.toLocaleString('fr-FR')} € de trésorerie`;
    } else {
        impactEstimate = '- Une réduction de 10 jours libère de la trésorerie';
    }

    return `⏱️ **Analyse Délais de Paiement**

**Votre DSO actuel : ${dsoValue}** ${dsoChange ? `(${dsoChange})` : ''}
📊 Période analysée: ${periodLabel}
📈 ${recordCount} transactions analysées
${finSightData?.levelInfo?.description ? `💡 ${finSightData.levelInfo.description}` : ''}

**Impact trésorerie :**
${impactEstimate}
- Amélioration du BFR et du cash-flow opérationnel

**Actions concrètes recommandées :**
- 📞 Relances clients systématiques dès J+15
- 💳 Faciliter les paiements (CB, virement instantané)
- 📋 Réviser conditions de paiement (30j → 15j nets)
- 🎯 Focus sur les gros montants en retard

${recordCount < 50 ? '💡 **Conseil** : Importez plus de données historiques pour des recommandations personnalisées.' : ''}

Voulez-vous un plan d'action détaillé pour réduire votre DSO ?`
}

/**
 * Recommandations générales
 */
function generateRecommendations(context: string): string {
    return `🎯 **Recommandations Prioritaires**

Basé sur votre situation :
${context}

**Actions immédiates (0-30 jours) :**
- 🔴 Urgent : Relancer les impayés > 45 jours
- 🟡 Important : Optimiser les processus de facturation

**Actions moyen terme (1-3 mois) :**
- 📊 Mettre en place un tableau de bord temps réel
- 🤝 Négocier avec les fournisseurs stratégiques

**Actions long terme (3-12 mois) :**
- 🚀 Développer de nouveaux segments clients
- 💡 Investir dans l'automatisation

Souhaitez-vous détailler l'une de ces recommandations ?`
}

/**
 * Analyse générale avec vraies données
 */
function generateGeneralAnalysis(message: string, context: string, finSightData?: any): string {
    let dataInsight = '';

    if (finSightData) {
        const recordCount = finSightData.recordCount || 0;
        const periodLabel = finSightData.period?.label || 'Période inconnue';
        const levelDescription = finSightData.levelInfo?.description || 'Analyse disponible';

        dataInsight = `📊 **Vos données** : ${recordCount} transactions • ${periodLabel}
💡 **Niveau d'analyse** : ${levelDescription}

`;
    }

    return `🤖 **Analyse FinSight**

Votre question : "${message}"

${dataInsight}**Contexte financier :**
${context}

**Éléments de réponse :**
- 📊 Analyse basée sur vos données réelles
- 🎯 Recommandations personnalisées selon votre profil
- 📈 Comparaison avec les bonnes pratiques sectorielles

**Pour aller plus loin :**
Posez-moi une question plus spécifique sur :
- 💰 Trésorerie et cash-flow
- 📊 Rentabilité et marges
- ⏰ Délais de paiement
- 🎯 Recommandations d'actions

Comment puis-je vous aider davantage ?`
}

/**
 * Génère des suggestions contextuelles selon les capacités
 */
function generateSuggestions(message: string, capabilities: any): string[] {
    const suggestions = []

    if (capabilities.canCalculateRevenue) {
        suggestions.push("Analyse mon chiffre d'affaires détaillé")
    }

    if (capabilities.canAnalyzeClients) {
        suggestions.push("Quels sont mes meilleurs clients ?")
    }

    if (capabilities.canCalculateDSO) {
        suggestions.push("Calcule mon délai de paiement moyen")
    } else {
        suggestions.push("Comment améliorer mes données pour le DSO ?")
    }

    if (capabilities.canProjectFuture) {
        suggestions.push("Projette ma trésorerie sur 3 mois")
    }

    suggestions.push("Quelles sont mes capacités d'analyse ?")

    return suggestions
}

/**
 * Génère des actions possibles
 */
function generateActions(message: string, financialContext: string | null): Array<{ type: string; label: string; data: any }> {
    const actions = []

    if (financialContext) {
        actions.push(
            {
                type: 'export_analysis',
                label: '📄 Exporter cette analyse',
                data: { format: 'pdf', include: ['kpis', 'recommendations'] }
            },
            {
                type: 'schedule_review',
                label: '📅 Programmer un point CFO',
                data: { duration: 15, topic: 'financial_review' }
            },
            {
                type: 'create_alert',
                label: '🔔 Créer une alerte KPI',
                data: { type: 'threshold', metric: 'cash_flow' }
            }
        )
    } else {
        actions.push(
            {
                type: 'upload_data',
                label: '📁 Importer mes données',
                data: { redirect: '/dashboard#upload' }
            }
        )
    }

    return actions
}