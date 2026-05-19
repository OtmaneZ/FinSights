/**
 * Prompts Engineering pour Copilot IA FinSight
 * Système de prompts pour GPT-4o-mini
 */

export const SYSTEM_PROMPT = `Vous êtes un CFO expert français spécialisé dans l'analyse financière pour TPE et PME.
Votre rôle est d'analyser des données financières réelles et de donner des conseils actionnables.

⚠️ RÈGLE CRITIQUE - DONNÉES OBLIGATOIRES:
- SI le contexte indique "Aucune donnée financière disponible", VOUS DEVEZ REFUSER de répondre aux questions d'analyse financière
- Dans ce cas, redirigez TOUJOURS vers : "❌ Je ne peux pas analyser sans données. Importez d'abord votre fichier CSV via le bouton 'Import Données' ci-dessus."
- Vous POUVEZ répondre aux questions générales sur la finance (ex: "C'est quoi le DSO ?"), mais JAMAIS inventer de chiffres
- JAMAIS halluciner des montants, pourcentages ou recommandations sans vraies données
- VOUS DISPOSEZ d'une mémoire vectorielle qui enrichit vos réponses avec le contexte des conversations passées

RÈGLES DE COMMUNICATION:
- Réponses concises et directes (max 250 mots)
- Toujours citer les chiffres exacts issus des données
- Format structuré: 📊 Constat → 🔍 Analyse → 💡 Action
- Utilise des emojis pour la lisibilité: 📊 KPI, ⚠️ Alerte, 💡 Conseil, 🎯 Objectif
- Vouvoiement professionnel
- Langage finance français (CA, trésorerie, DSO, marge nette)

MÉTHODOLOGIE D'ANALYSE:
1. Identifier les données clés pertinentes
2. Calculer les ratios financiers appropriés
3. Détecter les anomalies ou points d'attention
4. Proposer 2-3 actions concrètes et priorisées

CAPACITÉS ADAPTATIVES (selon données disponibles):
- Si "dueDate" présent → Calculer DSO + alertes créances en retard
- Si "category" présent → Analyser structure des coûts
- Si plusieurs clients → Analyser concentration commerciale + risque dépendance
- Si historique >3 mois → Identifier tendances et projections
- Si marges disponibles → Calculer rentabilité par segment

STYLE DE RÉPONSE:
- Éviter le jargon inutile, privilégier clarté
- Quantifier systématiquement (%, €, jours)
- Contextualiser (vs période précédente, vs benchmark secteur si pertinent)
- Proposer des actions SMART (Spécifiques, Mesurables, Actionnables)

EXEMPLES DE BONNES RÉPONSES:

Question: "Quel est mon DSO ?" (AVEC DONNÉES)
Réponse: "📊 **Votre DSO actuel : 45 jours**

🔍 **Analyse** :
- Benchmark secteur B2B SaaS : 30-35 jours
- Vous êtes **+33% au-dessus** de la norme
- Impact trésorerie : ~35k€ immobilisés

💡 **Actions prioritaires** :
1. Relancer les 3 créances >30j (total 46k€)
2. Mettre en place rappels automatiques J-7 avant échéance
3. Proposer escompte 2% si paiement <15j

🎯 **Objectif** : Ramener DSO à 35j → libère 15k€ de tréso"

Question: "Quel est mon DSO ?" (SANS DONNÉES)
Réponse: "❌ **Je ne peux pas calculer votre DSO sans données**

📁 **Importez d'abord votre fichier CSV** via le bouton "Import Données" ci-dessus.

Une fois vos données chargées, je pourrai :
✅ Calculer votre DSO réel
✅ Identifier les créances en retard
✅ Vous donner des recommandations personnalisées
✅ Me souvenir de nos échanges grâce à ma mémoire vectorielle

💡 **Rappel** : Le DSO (Days Sales Outstanding) mesure le délai moyen entre facturation et encaissement."

Question: "Comment va ma trésorerie ?" (AVEC DONNÉES)
Réponse: "💰 **Trésorerie actuelle : 98 450 €**

📈 **Évolution** : +34% vs mois dernier (+25k€)
✅ **Runway** : ~4 mois de charges couvertes

⚠️ **Points d'attention** :
- 127k€ de créances en attente (dont 46k€ >30j)
- Pic de charges prévu Oct-Nov : 32k€/mois

💡 **Recommandations** :
1. Accélérer recouvrement créances (cf. relances)
2. Négocier échéancier fournisseur principal
3. Prévoir financement court terme si retards clients"

Question: "Comment améliorer ma trésorerie ?" (SANS DONNÉES)
Réponse: "❌ **Je ne peux pas analyser votre trésorerie sans données**

📁 **Importez d'abord votre fichier CSV** pour que je puisse :
✅ Analyser vos flux de trésorerie réels
✅ Identifier les créances à recouvrer en priorité
✅ Calculer votre runway et votre besoin de financement
✅ Vous proposer un plan d'action personnalisé
✅ Me souvenir de nos échanges pour un suivi personnalisé

💡 **En général**, pour améliorer la trésorerie :
- Réduire le DSO (délais paiement clients)
- Négocier les délais fournisseurs
- Optimiser la structure de coûts
Mais j'ai besoin de VOS chiffres pour vous conseiller précisément !

🧠 **Bonne nouvelle** : Je dispose d'une mémoire vectorielle qui me permet de retenir le contexte de nos conversations pour des analyses plus pertinentes !"`;

/**
 * Construit le contexte financier à partir des données brutes
 */
export function buildFinancialContext(rawData: any[]): string {
    if (!rawData || rawData.length === 0) {
        return "Aucune donnée financière disponible.";
    }

    // Séparer revenus et charges
    const revenus = rawData.filter(r => r.type === 'income');
    const charges = rawData.filter(r => r.type === 'expense');

    // Calculs de base
    const totalCA = revenus.reduce((sum, r) => sum + r.amount, 0);
    const totalCharges = charges.reduce((sum, r) => sum + r.amount, 0);
    const cashFlow = totalCA - totalCharges;
    const margeNette = totalCA > 0 ? ((cashFlow / totalCA) * 100) : 0;

    // Analyse créances
    const creances = revenus.filter(r =>
        r.paymentStatus === 'En attente' || r.paymentStatus === 'En cours'
    );
    const totalCreances = creances.reduce((sum, r) => sum + r.amount, 0);
    const creancesEnRetard = creances.filter(r => r.daysLate && r.daysLate > 30);
    const totalCreancesRetard = creancesEnRetard.reduce((sum, r) => sum + r.amount, 0);

    // Top clients
    const clientTotals = revenus.reduce((acc: any, r: any) => {
        const client = r.counterparty || 'Client inconnu';
        acc[client] = (acc[client] || 0) + r.amount;
        return acc;
    }, {});
    const topClients = Object.entries(clientTotals)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 5)
        .map(([client, montant]) => `${client}: ${(montant as number).toLocaleString('fr-FR')} €`);

    // Catégories de charges
    const categories = charges.reduce((acc: any, r: any) => {
        const cat = r.category || 'Autres';
        acc[cat] = (acc[cat] || 0) + r.amount;
        return acc;
    }, {});
    const topCategories = Object.entries(categories)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 5)
        .map(([cat, montant]) => {
            const pct = ((montant as number / totalCharges) * 100).toFixed(1);
            return `${cat}: ${(montant as number).toLocaleString('fr-FR')} € (${pct}%)`;
        });

    // Période
    const dates = rawData.map(r => new Date(r.date)).filter(d => !isNaN(d.getTime()));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const periode = `${minDate.toLocaleDateString('fr-FR')} au ${maxDate.toLocaleDateString('fr-FR')}`;

    // Construction du contexte
    return `DONNÉES FINANCIÈRES DISPONIBLES:

📅 **Période**: ${periode}
📊 **Transactions**: ${rawData.length} (${revenus.length} revenus, ${charges.length} charges)

💰 **SYNTHÈSE FINANCIÈRE**:
- Chiffre d'affaires: ${totalCA.toLocaleString('fr-FR')} €
- Charges totales: ${totalCharges.toLocaleString('fr-FR')} €
- Cash flow net: ${cashFlow.toLocaleString('fr-FR')} €
- Marge nette: ${margeNette.toFixed(1)}%

💳 **CRÉANCES**:
- Total en attente: ${totalCreances.toLocaleString('fr-FR')} € (${creances.length} factures)
- Créances >30 jours: ${totalCreancesRetard.toLocaleString('fr-FR')} € (${creancesEnRetard.length} factures)
${creancesEnRetard.length > 0 ? `- Créances urgentes: ${creancesEnRetard.slice(0, 3).map(c => `${c.counterparty}: ${c.amount.toLocaleString('fr-FR')} € (${c.daysLate}j retard)`).join(', ')}` : ''}

👥 **TOP 5 CLIENTS**:
${topClients.join('\n')}
- Concentration Top 5: ${((topClients.length > 0 ? (Object.values(clientTotals).slice(0, 5).reduce((a, b) => (a as number) + (b as number), 0) as number) : 0) / totalCA * 100).toFixed(1)}% du CA

📦 **STRUCTURE DES CHARGES**:
${topCategories.join('\n')}

💡 **CAPACITÉS D'ANALYSE DISPONIBLES**:
${creances.length > 0 && creances[0].dueDate ? '✅ Calcul DSO (dates échéances disponibles)' : '❌ DSO non calculable (dates échéances manquantes)'}
${Object.keys(categories).length > 1 ? '✅ Analyse structure de coûts par catégorie' : '❌ Catégorisation limitée'}
${Object.keys(clientTotals).length > 5 ? '✅ Analyse concentration commerciale' : '⚠️ Peu de diversification clients'}
${dates.length > 30 ? '✅ Analyse de tendances (historique >1 mois)' : '⚠️ Historique limité'}`;
}

/**
 * Génère un résumé automatique des données (auto-summary)
 */
export function generateAutoSummary(rawData: any[]): string {
    if (!rawData || rawData.length === 0) {
        return "Aucune donnée à analyser. Uploadez votre fichier CSV pour commencer.";
    }

    // 🆕 Si config démo disponible, utiliser les valeurs pré-calculées
    if (typeof window !== 'undefined' && (window as any).__demoChartData?.kpis) {
        const kpis = (window as any).__demoChartData.kpis;
        const totalCA = kpis.revenue.value;
        const totalCharges = kpis.expenses.value;
        const margeNette = kpis.netMargin;
        const cashFlow = kpis.cashFlow.value;

        const alertes = [];
        if (cashFlow < 0) {
            const runway = kpis.cashFlow.runway;
            alertes.push(`Trésorerie négative : ${cashFlow.toLocaleString('fr-FR')} € (runway: ${runway} mois)`);
        }
        if (margeNette < -100) {
            alertes.push(`Marge nette critique : ${margeNette.toFixed(1)}% (burn rate élevé)`);
        }

        return `🔍 **Analyse automatique terminée**

📊 **Vue d'ensemble** : ${rawData.length} transactions analysées
💰 **CA total** : ${totalCA.toLocaleString('fr-FR')} €
📈 **Marge nette** : ${margeNette.toFixed(1)}%
💸 **Cash Flow** : ${cashFlow.toLocaleString('fr-FR')} €

${alertes.length > 0 ? `⚠️ **${alertes.length} alerte${alertes.length > 1 ? 's' : ''} détectée${alertes.length > 1 ? 's' : ''}** :
${alertes.map(a => `   • ${a}`).join('\n')}` : '✅ **Aucune alerte majeure détectée**'}

💡 **Posez-moi vos questions ci-dessous** pour analyser vos données en profondeur.`;
    }

    // Calcul standard depuis rawData
    const revenus = rawData.filter(r => r.type === 'income');
    const charges = rawData.filter(r => r.type === 'expense');
    const totalCA = revenus.reduce((sum, r) => sum + r.amount, 0);
    const totalCharges = charges.reduce((sum, r) => sum + r.amount, 0);
    const margeNette = totalCA > 0 ? ((totalCA - totalCharges) / totalCA * 100) : 0;

    const creancesEnRetard = revenus.filter(r =>
        (r.paymentStatus === 'En attente' || r.paymentStatus === 'En cours') &&
        r.daysLate && r.daysLate > 30
    );
    const totalCreancesRetard = creancesEnRetard.reduce((sum, r) => sum + r.amount, 0);

    // Détection alertes
    const alertes = [];
    if (creancesEnRetard.length > 0) {
        alertes.push(`${creancesEnRetard.length} créances >30j à relancer (${totalCreancesRetard.toLocaleString('fr-FR')} €)`);
    }
    if (margeNette < 20) {
        alertes.push(`Marge nette faible : ${margeNette.toFixed(1)}% (objectif >30%)`);
    }

    // Top client (risque concentration)
    const clientTotals = revenus.reduce((acc: any, r: any) => {
        const client = r.counterparty || 'Client inconnu';
        acc[client] = (acc[client] || 0) + r.amount;
        return acc;
    }, {});
    const topClient = Object.entries(clientTotals)
        .sort(([, a]: any, [, b]: any) => b - a)[0];
    if (topClient) {
        const [client, montant] = topClient;
        const concentration = (montant as number / totalCA) * 100;
        if (concentration > 30) {
            alertes.push(`Dépendance client ${client} : ${concentration.toFixed(0)}% du CA (risque)`);
        }
    }

    return `🔍 **Analyse automatique terminée**

📊 **Vue d'ensemble** : ${rawData.length} transactions analysées
💰 **CA total** : ${totalCA.toLocaleString('fr-FR')} €
📈 **Marge nette** : ${margeNette.toFixed(1)}%

${alertes.length > 0 ? `⚠️ **${alertes.length} alerte${alertes.length > 1 ? 's' : ''} détectée${alertes.length > 1 ? 's' : ''}** :
${alertes.map(a => `   • ${a}`).join('\n')}` : '✅ **Aucune alerte majeure détectée**'}

💡 **Posez-moi vos questions ci-dessous** pour analyser vos données en profondeur.`;
}

/**
 * Génère des suggestions contextuelles basées sur les vraies données
 */
export function generateSmartSuggestions(rawData: any[]): string[] {
    if (!rawData || rawData.length === 0) {
        return [
            "Comment fonctionne FinSight ?",
            "Quelles données puis-je analyser ?"
        ];
    }

    const suggestions: string[] = [];
    const revenus = rawData.filter(r => r.type === 'income');
    const charges = rawData.filter(r => r.type === 'expense');

    // Créances en retard
    const creancesEnRetard = revenus.filter(r =>
        (r.paymentStatus === 'En attente' || r.paymentStatus === 'En cours') &&
        r.daysLate && r.daysLate > 30
    );
    if (creancesEnRetard.length > 0) {
        const topCreance = creancesEnRetard.sort((a, b) => b.amount - a.amount)[0];
        suggestions.push(`${topCreance.counterparty} doit ${topCreance.amount.toLocaleString('fr-FR')} € depuis ${topCreance.daysLate}j, comment relancer ?`);
    }

    // DSO si disponible
    if (revenus.length > 0 && revenus[0].dueDate) {
        suggestions.push("Analysez le cycle de paiement client");
    }

    // Concentration client
    const clientTotals = revenus.reduce((acc: any, r: any) => {
        const client = r.counterparty || 'Client inconnu';
        acc[client] = (acc[client] || 0) + r.amount;
        return acc;
    }, {});
    const topClient = Object.entries(clientTotals).sort(([, a]: any, [, b]: any) => b - a)[0];
    if (topClient) {
        const [client] = topClient;
        suggestions.push(`Quelle est la part de ${client} dans le CA ?`);
    }

    // Structure de coûts
    if (charges.length > 0) {
        suggestions.push("Quels sont les 3 plus gros postes de dépenses ?");
    }

    // Marge
    suggestions.push("La marge nette est-elle bonne pour le secteur ?");

    // Toujours proposer benchmark
    suggestions.push("Comment se comparer au benchmark SaaS B2B ?");

    return suggestions.slice(0, 6); // Max 6 suggestions
}
