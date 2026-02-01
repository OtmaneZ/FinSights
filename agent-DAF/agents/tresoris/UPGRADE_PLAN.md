# 🚀 TRESORIS - Plan de Mise à Niveau V3 Powerhouse

## 🎯 OBJECTIF
Exploiter les 13 engines existants pour transformer TRESORIS d'un **dashboard passif** en **copilote décisionnel actif**.

---

## ⚡ PHASE 1: CONNECTER LES ENGINES (2-3 jours)

### 1.1 Ajouter Endpoint Stress Test ✅

**Fichier**: `backend/api/analysis_router.py`

```python
@router.get("/v3/stress-test")
async def run_stress_test(
    spreadsheet_id: str,
    simulations: int = 10000,
    safety_threshold: float = 50000
):
    """
    Lance Monte Carlo simulation sur trésorerie
    
    Returns:
        - probability_negative_cash: float
        - runway_p5: float (worst case 5%)
        - var_95: float (Value at Risk)
        - recommended_actions: List[str]
    """
    from engine.stress_tester import StressTester, StressType
    
    # Récupérer données
    data = await get_latest_data(spreadsheet_id)
    
    # Lancer simulation
    tester = StressTester()
    result = tester.run_monte_carlo(
        invoices=data['factures'],
        current_cash=data['kpis']['montant_total'],
        burn_rate_monthly=50000,  # À calculer depuis historique
        simulations=simulations
    )
    
    return {
        "monte_carlo": result.to_dict(),
        "status": "CRITICAL" if result.prob_negative_cash > 0.15 else "OK",
        "recommendation": generate_recommendation(result)
    }
```

**Impact Frontend**:
```javascript
// Dans tresoris-live-v2.html
async function refreshStressTest() {
    const response = await fetch(`${API_BASE}/api/v1/analysis/v3/stress-test?spreadsheet_id=${SPREADSHEET_ID}`);
    const data = await response.json();
    
    document.getElementById('stress-pct').textContent = `${(data.monte_carlo.prob_negative_cash * 100).toFixed(1)}%`;
    document.getElementById('stress-insight').textContent = data.recommendation;
    
    // Couleur dynamique
    const stressCard = document.querySelector('.v3-card.stress');
    if (data.monte_carlo.prob_negative_cash > 0.15) {
        stressCard.style.borderColor = '#ef4444'; // Rouge
    }
}
```

---

### 1.2 Exploiter Variance Analyzer ✅

**Fichier**: `backend/api/analysis_router.py`

```python
@router.get("/v3/variance")
async def analyze_variance(
    spreadsheet_id: str,
    period: str = "month"  # month, quarter, year
):
    """
    Analyse écarts vs période précédente
    Explique les 3-5 drivers principaux
    """
    from engine.variance_analyzer import VarianceAnalyzer
    
    analyzer = VarianceAnalyzer()
    result = analyzer.analyze_period_over_period(
        current_data=get_current_period(),
        previous_data=get_previous_period()
    )
    
    return {
        "variance_pct": result.total_variance_pct,
        "status": result.status,  # favorable, unfavorable, critical
        "top_drivers": result.top_3_drivers,  # ["CA +12%", "Coûts fixes +8%", "DSO +5j"]
        "explanation": result.narrative,  # Généré par LLM
        "corrective_actions": result.recommended_actions
    }
```

**Impact Dashboard**:
- Remplacer "-37.6% vs mois précédent" par:
  - "📉 -37.6% expliqué par: Perte MegaCorp (-28%), Retards +5j (-9%)"
  - Tooltip avec top 3 drivers
  - Badge rouge si unfavorable > -15%

---

### 1.3 Activer Signaux Faibles ✅

**Fichier**: `backend/engine/early_warning.py` (déjà existe!)

```python
# Dans create_dashboard_data() - gsheet_router.py
from engine.early_warning import EarlyWarningSystem

ews = EarlyWarningSystem()
weak_signals = ews.detect_weak_signals(
    invoices=invoices_df,
    patterns=client_patterns,
    current_kpis=kpis
)

# Ajouter au dashboard
dashboard_data["weak_signals"] = [
    {
        "type": signal.signal_type,  # "trend_degradation", "payment_slowdown"
        "severity": signal.severity,  # "low", "medium", "high"
        "message": signal.description,
        "client": signal.client_name,
        "probability": signal.probability
    }
    for signal in weak_signals
    if signal.severity in ["medium", "high"]  # Filtrer bruit
]
```

**Impact Frontend**:
```javascript
// Section "🔮 Signaux Faibles"
if (analysis.weak_signals && analysis.weak_signals.length > 0) {
    html = analysis.weak_signals.map(s => `
        <div class="weak-signal ${s.severity}">
            <span class="signal-icon">${getSignalIcon(s.type)}</span>
            <div>
                <strong>${s.client}</strong>
                <p>${s.message}</p>
                <span class="probability">${(s.probability * 100).toFixed(0)}% de probabilité</span>
            </div>
        </div>
    `).join('');
} else {
    html = '✅ Aucun signal faible';
}
```

---

### 1.4 Margin Analysis Détaillée ✅

**Fichier**: `backend/engine/margin_analyzer.py` (existe)

**Endpoint**:
```python
@router.get("/v3/margin-analysis")
async def analyze_margins(spreadsheet_id: str):
    """
    Analyse marges par client/produit/segment
    Identifie les clients les plus/moins rentables
    """
    from engine.margin_analyzer import MarginAnalyzer
    
    analyzer = MarginAnalyzer()
    result = analyzer.analyze_client_profitability(
        invoices=invoices_df,
        costs=costs_df  # Si disponible
    )
    
    return {
        "top_clients": result.most_profitable[:5],
        "bottom_clients": result.least_profitable[:5],
        "margin_trends": result.margin_evolution_12m,
        "recommendations": [
            "Prioriser relances sur clients haute marge",
            "Renegocier contrats clients < 15% marge"
        ]
    }
```

**Impact Dashboard**:
- Remplacer "6 Analyse des marges terminée" par:
  - "Top client: MegaCorp (marge 42%)"
  - "Bottom: PetitClient (marge 8%)"
  - Badge "Optimiser" si marge moyenne < 20%

---

## ⚡ PHASE 2: CHAT INTELLIGENT (1 jour)

### 2.1 Enrichir le Contexte LLM ✅

**Fichier**: `backend/main.py` - Fonction `generate_chat_response()`

```python
async def generate_chat_response(question: str, context: Dict) -> str:
    """Contexte ENRICHI avec tous les engines"""
    
    kpis = context.get("kpis", {})
    
    # 🔥 NOUVEAU: Récupérer analyses V3
    stress_test = await get_stress_test_cached()
    variance = await get_variance_cached()
    weak_signals = context.get("weak_signals", [])
    margin_analysis = await get_margin_analysis_cached()
    
    system_prompt = f"""Tu es TRESORIS, CFO IA expert.

CONTEXTE FINANCIER:
- Cash à recevoir: {kpis.get('montant_total', 0):,.0f}€
- Factures en retard: {kpis.get('factures_en_retard', 0)} ({kpis.get('montant_en_retard', 0):,.0f}€)
- DSO: {kpis.get('dso_jours', 0):.0f}j | Runway: {kpis.get('runway_jours', 0)}j
- Score santé: {context.get('health_score', 0):.0f}/100
- Concentration: {context.get('concentration', {}).get('top_client_pct', 0):.0f}%

ANALYSES V3 POWERHOUSE:
- Monte Carlo: {stress_test['prob_negative_cash']*100:.1f}% de risque cash négatif (10K simulations)
- Variance M/M: {variance['variance_pct']}% ({variance['status']})
  → Top drivers: {', '.join(variance['top_drivers'])}
- Signaux faibles: {len(weak_signals)} détectés
  → {weak_signals[0]['message'] if weak_signals else 'Aucun'}
- Marges: Top client {margin_analysis['top_clients'][0]['name']} ({margin_analysis['top_clients'][0]['margin']:.0f}%)

INSTRUCTIONS:
- Utilise ces analyses pour des réponses précises et actionnables
- Si question sur risque → cite Monte Carlo
- Si question sur évolution → cite Variance
- Propose des actions concrètes basées sur les engines
- Max 3-4 phrases, style CFO bienveillant
"""
    
    # ... reste du code
```

**Impact**:
- Chat répond avec données des 13 engines
- "Quelle est ma situation?" → Mentionne Monte Carlo 30% + variance -37.6% + MegaCorp en retard
- "Conseils?" → "Avec 30% de risque cash négatif, je recommande: 1) Relancer MegaCorp (274K€), 2) Négocier paiements échelonnés"

---

### 2.2 Suggestions Intelligentes Dynamiques ✅

**Frontend**: `tresoris-live-v2.html`

```javascript
function generateSmartSuggestions(analysis) {
    const suggestions = [];
    
    // Suggestion basée sur stress test
    if (analysis.stress_test?.prob_negative_cash > 0.15) {
        suggestions.push({
            icon: '🚨',
            text: 'Lancer scénario sauvetage',
            question: 'Quelles actions prioritaires pour réduire le risque à <10%?'
        });
    }
    
    // Suggestion basée sur variance
    if (analysis.variance_analysis?.status === 'unfavorable') {
        suggestions.push({
            icon: '📉',
            text: 'Expliquer la baisse',
            question: `Pourquoi ${analysis.variance_analysis.variance_pct}% de baisse ce mois?`
        });
    }
    
    // Suggestion basée sur signaux faibles
    if (analysis.weak_signals?.length > 0) {
        const signal = analysis.weak_signals[0];
        suggestions.push({
            icon: '👀',
            text: `Signal ${signal.client}`,
            question: `Que faire avec ${signal.client}? ${signal.message}`
        });
    }
    
    // Suggestion basée sur concentration
    if (analysis.concentration?.top_client_pct > 50) {
        suggestions.push({
            icon: '🎯',
            text: 'Plan diversification',
            question: 'Comment réduire la dépendance à un seul client?'
        });
    }
    
    return suggestions.slice(0, 4); // Max 4 suggestions
}

// Mettre à jour les boutons
function updateChatSuggestions(analysis) {
    const container = document.querySelector('.chat-suggestions');
    const suggestions = generateSmartSuggestions(analysis);
    
    container.innerHTML = suggestions.map(s => `
        <button class="suggestion-btn" onclick="askSuggestion('${s.question.replace("'", "\\'")}')">
            ${s.icon} ${s.text}
        </button>
    `).join('');
}
```

**Impact**:
- Suggestions changent selon situation
- Si risque élevé → "🚨 Lancer scénario sauvetage"
- Si retards → "⏰ Stratégie recouvrement"
- Si baisse variance → "📉 Expliquer la baisse"

---

## ⚡ PHASE 3: ACTIONS DÉCLENCHABLES (1 jour)

### 3.1 Boutons d'Action dans Dashboard ✅

**Frontend**: Ajouter dans section Alertes

```html
<div class="action-buttons">
    <button class="action-btn primary" onclick="launchStressTest()">
        🎲 Lancer Simulation 10K
    </button>
    <button class="action-btn secondary" onclick="generateRecoveryPlan()">
        📋 Plan de Recouvrement
    </button>
    <button class="action-btn secondary" onclick="exportReport()">
        📄 Export Rapport CFO
    </button>
</div>
```

**JavaScript**:
```javascript
async function launchStressTest() {
    showLoader('Simulation de 10,000 scénarios en cours...');
    
    const response = await fetch(`${API_BASE}/api/v1/analysis/v3/stress-test?spreadsheet_id=${SPREADSHEET_ID}&simulations=10000`);
    const data = await response.json();
    
    hideLoader();
    
    // Afficher modal avec résultats
    showModal({
        title: '🎲 Résultats Simulation Monte Carlo',
        content: `
            <div class="monte-carlo-results">
                <div class="result-card critical">
                    <h4>Probabilité Cash Négatif</h4>
                    <p class="big-number">${(data.monte_carlo.prob_negative_cash * 100).toFixed(1)}%</p>
                </div>
                <div class="result-card">
                    <h4>Runway Worst Case (P5)</h4>
                    <p class="big-number">${data.monte_carlo.runway_p5.toFixed(0)} jours</p>
                </div>
                <div class="result-card">
                    <h4>Value at Risk 95%</h4>
                    <p class="big-number">${formatCurrency(data.monte_carlo.var_95)}</p>
                </div>
            </div>
            <div class="recommendations">
                <h4>📋 Recommandations</h4>
                <ul>
                    ${data.recommendations.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
        `
    });
}

async function generateRecoveryPlan() {
    showLoader('Génération du plan avec Gemini...');
    
    const response = await fetch(`${API_BASE}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            question: `Génère un plan d'action détaillé en 5 étapes pour maximiser mes encaissements dans les 30 jours. Priorise par impact€ × facilité.`,
            spreadsheet_id: SPREADSHEET_ID
        })
    });
    
    const data = await response.json();
    
    hideLoader();
    showModal({
        title: '📋 Plan de Recouvrement Optimisé',
        content: `<div class="recovery-plan">${data.response}</div>`
    });
}
```

---

## 🎯 PRIORITÉS ORDRE D'IMPLÉMENTATION

### **JOUR 1** (Quick Wins Maximum Impact)
1. ✅ **Connecter Stress Test** → Endpoint + Frontend (3h)
2. ✅ **Activer Signaux Faibles** → early_warning.py → Dashboard (2h)
3. ✅ **Enrichir Contexte Chat** → system_prompt avec 13 engines (2h)

**Impact**: Dashboard passe de passif à prédictif avec 3 changements

---

### **JOUR 2** (Intelligence Augmentée)
4. ✅ **Variance Analysis Détaillée** → Top 3 drivers + explication (3h)
5. ✅ **Margin Analysis** → Top/Bottom clients rentabilité (2h)
6. ✅ **Suggestions Dynamiques** → Boutons chat adaptatifs (2h)

**Impact**: Chat devient contextuel et proactif

---

### **JOUR 3** (Actions & Polish)
7. ✅ **Boutons Action** → Lancer simulation, Plan recouvrement (3h)
8. ✅ **Modal Résultats** → Affichage Monte Carlo détaillé (2h)
9. ✅ **Polish UI** → Animations, tooltips, loading states (2h)

**Impact**: Dashboard devient **outil décisionnel actionnable**

---

## 📊 IMPACT ATTENDU

### **AVANT**
- Dashboard montre "En retard: 0 / 0€" (bug)
- Chat répond en 2 phrases génériques
- Signaux faibles: 0 (non exploité)
- Monte Carlo: Visible mais pas accessible
- Utilisateur: **Spectateur passif**

### **APRÈS** (3 jours)
- Dashboard: "⚠️ 30% risque cash négatif (Monte Carlo 10K sim)"
- Chat: "Avec 274K€ en retard chez MegaCorp (83% concentration) + variance -37.6%, je recommande: 1) Relance urgente, 2) Plan échelonné, 3) Diversification Q2"
- Signaux faibles: 3 détectés (MegaCorp trend, StartupXYZ partial pay, RetardChronique chronic)
- Boutons: "🎲 Lancer Simulation", "📋 Plan Recouvrement"
- Utilisateur: **Copilote décisionnel actif**

---

## 🚀 AU-DELÀ (Semaine 2+)

### **Phase 4: Scénarios Interactifs**
- "What-if MegaCorp part?" → Impact runway calculé en 2 sec
- Slider: "Réduction coûts -15%" → Cash flow +45K€
- Compare 3 scénarios: Optimiste, Réaliste, Pessimiste

### **Phase 5: Agents Collaboratifs**
- TRESORIS détecte risque → Appelle SCORIS pour scoring client → Appelle SCENARIS pour simulation
- "MegaCorp en retard + rating dégradé → Lancer scenario_loss_client_20pct"

### **Phase 6: Learning Loop**
- Tracking actions proposées vs exécutées
- "Vous avez ignoré ma recommandation d'il y a 3 semaines. Résultat: -12% de cash. Voulez-vous que j'insiste plus fort à l'avenir?"

---

## ✅ CHECKLIST IMPLÉMENTATION

### Backend
- [ ] `/api/v1/analysis/v3/stress-test` endpoint
- [ ] `/api/v1/analysis/v3/variance` endpoint
- [ ] `/api/v1/analysis/v3/margin-analysis` endpoint
- [ ] Intégrer `early_warning.py` dans `create_dashboard_data()`
- [ ] Enrichir contexte LLM avec données V3
- [ ] Cache pour éviter recalcul (Redis ou in-memory avec TTL)

### Frontend
- [ ] Fetch + display stress test results
- [ ] Fetch + display variance drivers
- [ ] Fetch + display weak signals
- [ ] Fetch + display margin analysis
- [ ] Suggestions dynamiques basées sur contexte
- [ ] Boutons action (Simulation, Plan, Export)
- [ ] Modals pour résultats détaillés
- [ ] Loading states & error handling

### Testing
- [ ] Tester avec 11 invoices test-facture.csv
- [ ] Vérifier Monte Carlo donne ~30% avec MegaCorp scenario
- [ ] Vérifier variance explique -37.6%
- [ ] Vérifier chat utilise contexte V3
- [ ] Vérifier suggestions changent selon situation

---

**Dernière mise à jour**: 1 février 2026  
**Auteur**: GitHub Copilot  
**Status**: 🚧 PRÊT À IMPLÉMENTER
