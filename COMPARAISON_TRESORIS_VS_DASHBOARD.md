# 🔬 Comparaison Approfondie : TRESORIS (Agent DAF) vs Financial Dashboard V2

> **Date d'analyse** : 29 janvier 2026  
> **Contexte** : Analyse comparative des deux systèmes financiers du projet FinSights  
> **Objectif** : Identifier synergies, différences architecturales et opportunités d'intégration

---

## 📊 Vue d'Ensemble Exécutive

### Positionnement Stratégique

| Aspect | **TRESORIS (Agent DAF)** | **Financial Dashboard V2** |
|--------|--------------------------|----------------------------|
| **Nature** | Agent IA autonome backend (Python) | Dashboard interactif frontend (TypeScript/React) |
| **Rôle** | Système expert prédictif | Interface de visualisation |
| **Utilisateur cible** | DAF/CFO (automatisation) | Utilisateur final (visualisation) |
| **Mode opératoire** | Surveillance continue autonome | Analyse à la demande (upload) |
| **Architecture** | Backend FastAPI + 6 engines ML | Frontend Next.js + composants React |

---

## 🏗️ Architecture Technique

### TRESORIS - Backend Python

```
┌─────────────────────────────────────────────────────┐
│           TRESORIS V2 Architecture                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  FastAPI Backend (main.py)                          │
│    ├─ WebSocket temps réel (/ws)                    │
│    ├─ REST API endpoints                            │
│    └─ RiskRequalificationAgent                      │
│                                                      │
│  6 Engines ML Spécialisés:                          │
│    1. ClientPaymentAnalyzer (patterns paiement)     │
│    2. ClientRiskScorer (scoring 0-100, A/B/C/D)     │
│    3. SmartForecaster (prédictions intelligentes)   │
│    4. EarlyWarningDetector (signaux faibles)        │
│    5. ActionPrioritizer (priorisation actions)      │
│    6. SeasonalityAdjuster (ajustements saisonniers) │
│                                                      │
│  Memory System (TresorisMemory):                    │
│    ├─ Analyses historiques                          │
│    ├─ Décisions DAF                                 │
│    ├─ Audit trail                                   │
│    └─ Intelligence metrics                          │
│                                                      │
│  Data Processing:                                   │
│    ├─ Pandas DataFrames                             │
│    ├─ NumPy calculs                                 │
│    └─ CSV/Excel parsing                             │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Financial Dashboard V2 - Frontend TypeScript

```
┌─────────────────────────────────────────────────────┐
│        Financial Dashboard V2 Architecture          │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Next.js Frontend (FinancialDashboardV2.tsx)        │
│    ├─ React components                              │
│    ├─ Real-time updates (Pusher)                    │
│    └─ AI Copilot integration                        │
│                                                      │
│  Visualisation:                                     │
│    ├─ Recharts (cash flow, marges, clients)        │
│    ├─ D3.js (Sankey, Sunburst, Radar)              │
│    └─ Custom charts components                      │
│                                                      │
│  Calculs Financiers (lib/):                         │
│    ├─ financialFormulas.ts (DSO, BFR, marges)      │
│    ├─ dataParser.ts (parsing CSV intelligent)      │
│    ├─ finSightScore.ts (scoring 0-100)             │
│    └─ saasMetrics.ts (MRR, CAC, LTV...)            │
│                                                      │
│  Features Interactives:                             │
│    ├─ What-If Simulations                           │
│    ├─ Drill-down KPIs                               │
│    ├─ Export PDF/Excel                              │
│    ├─ Predictions ML (cash flow)                    │
│    └─ Anomaly detection                             │
│                                                      │
│  State Management:                                  │
│    ├─ React hooks (useState, useMemo)               │
│    ├─ Context providers                             │
│    └─ useFinancialData custom hook                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 🔍 Analyse Fonctionnelle Détaillée

### 1. 📈 Calculs Financiers

#### TRESORIS (Backend Python)

**Méthodes de calcul :**
- **DSO** : Calculé via `ClientPaymentAnalyzer`
  - Moyenne des délais réels par client
  - Trend detection (slope régression linéaire)
  - Scoring comportemental 0-100
  
- **Risk Scoring** : Formule multi-facteurs
  ```python
  risk_score = (
      payment_behavior × 0.40 +
      trend × 0.30 +
      stability × 0.20 +
      amount × 0.15
  )
  ```

- **Prévisions** : `SmartForecaster`
  - Probabilités paiement (on_time, late, very_late, default)
  - Dates attendues ajustées par pattern client
  - Confiance (high/medium/low)

**Forces :**
- ✅ Analyse historique profonde (6-12 mois)
- ✅ Détection patterns comportementaux
- ✅ Prédictions basées sur ML
- ✅ Ajustements saisonniers automatiques

**Limites :**
- ⚠️ Nécessite historique long (>6 mois)
- ⚠️ Complexe à débugger
- ⚠️ Pas de visualisation directe

---

#### Financial Dashboard V2 (Frontend TypeScript)

**Méthodes de calcul :**
- **DSO** : `calculateDSOFromTransactions()`
  ```typescript
  // Méthode 1 : Si dueDate disponible
  avgDelay = mean(payment_date - due_date)
  
  // Méthode 2 : Estimation
  estimatedReceivables = dailyRevenue × 30
  dso = (estimatedReceivables / annualizedRevenue) × 365
  ```

- **BFR** : `calculateEstimatedBFR()`
  ```typescript
  estimatedReceivables = (dso / 365) × annualRevenue
  estimatedPayables = (30 / 365) × annualExpenses  // ⚠️ DPO fixe 30j
  bfr = stocks + receivables - payables
  ```

- **Marges** : `calculateNetMargin()`, `calculateGrossMargin()`
  ```typescript
  grossMargin = ((revenue - cogs) / revenue) × 100
  netMargin = ((revenue - totalExpenses) / revenue) × 100
  ```

**Forces :**
- ✅ Calcul instantané (pas d'attente backend)
- ✅ Formules standards françaises (PCG 2025)
- ✅ Fallback intelligent si données manquantes
- ✅ Annotations de confiance

**Limites :**
- ⚠️ Moins sophistiqué que TRESORIS
- ⚠️ Pas d'apprentissage automatique
- ⚠️ Approximations (ex: DPO fixe 30j)

---

### 2. 🎯 Détection d'Anomalies

#### TRESORIS (Backend)

**Système d'Early Warning :**
- **26 situations détectées** → **Requalifiées en 2-5 risques critiques**

**Types de warnings :**
1. **Progressive Delay** : Délais croissants sur 3 factures
2. **Concentration Risk** : Client > 30% du portefeuille
3. **Seasonal Risk** : Période à risque (août, décembre)
4. **Partial Payments** : Historique paiements incomplets
5. **Pattern Degradation** : Changement comportement client

**Scoring de sévérité :**
```python
severity = "critical" if (
    days_overdue > 90 or 
    risk_score > 75 or
    amount > 500000
) else "uncertain" if (
    days_overdue > 45 or
    risk_score > 50
) else "certain"
```

**Output :**
```python
EarlyWarning:
  - type: "progressive_delay"
  - severity: "critical"
  - days_advance: 45  # Anticipation 45 jours
  - amount_at_risk: 250000
  - explanation: "Client X retards croissants 15j → 30j → 45j"
```

---

#### Financial Dashboard V2 (Frontend)

**Système `detectAnomaliesFromData()` :**
- Analyse via API `/api/ml/anomalies`
- Méthode statistique (IQR - Interquartile Range)

**Types d'anomalies :**
1. **Outliers montants** : Transactions > Q3 + 1.5×IQR
2. **Variations temporelles** : Patterns inhabituels
3. **Seuils KPIs** : DSO > 60j, Marge < 10%

**Affichage :**
```tsx
<AnomalyPanel
  anomalies={[
    {
      type: "dso_high",
      severity: "warning",
      message: "DSO à 67j (seuil: 60j)",
      impact: "Tension trésorerie potentielle"
    }
  ]}
/>
```

**Forces :**
- ✅ Visuel immédiat
- ✅ Contextuel (drill-down)

**Limites :**
- ⚠️ Moins prédictif
- ⚠️ Seuils fixes (pas adaptatifs)

---

### 3. 🔮 Prédictions & Forecasting

#### TRESORIS

**SmartForecaster :**
- **Input** : Facture + Pattern client + Saison
- **Output** : 
  ```python
  SmartForecast:
    - expected_payment_date: 2026-03-15
    - earliest_date: 2026-03-10 (optimiste)
    - latest_date: 2026-03-25 (pessimiste)
    - probability_on_time: 0.35
    - probability_late: 0.45
    - probability_very_late: 0.15
    - probability_default: 0.05
    - confidence_level: "high"
  ```

**Méthode :**
- Régression basée historique client
- Ajustement saisonnier (×1.3 en août)
- Calcul de confiance selon taille échantillon

**Horizon** : 4-8 semaines

---

#### Financial Dashboard V2

**CashFlowPredictions :**
- API `/api/ai/predict-cashflow`
- GPT-4 + données historiques
- **Horizon** : 13 semaines (3 mois)

**Output :**
```tsx
<CashFlowPredictions
  predictions={[
    { week: 1, predicted: 125000, confidence: 0.85 },
    { week: 2, predicted: 98000, confidence: 0.82 },
    ...
  ]}
  alerts={[
    { type: "low_cash", week: 6, amount: 15000 }
  ]}
  seasonalityDetected={true}
/>
```

**Forces :**
- ✅ Visualisation graphique
- ✅ Alertes anticipées
- ✅ IA générative (explications naturelles)

**Limites :**
- ⚠️ Moins précis que TRESORIS sur patterns clients
- ⚠️ Coût API GPT-4

---

### 4. 📊 KPIs Calculés

| KPI | **TRESORIS** | **Dashboard V2** |
|-----|-------------|------------------|
| **DSO** | ✅ Pattern-based, par client | ✅ Moyenné global + estimation |
| **BFR** | ❌ Non calculé | ✅ Estimé (avec warning) |
| **Marge Brute** | ❌ Non calculé | ✅ (Revenue - COGS) / Revenue |
| **Marge Nette** | ❌ Non calculé | ✅ (Revenue - Total Expenses) / Revenue |
| **Cash Flow** | ✅ Prévisionnel 4-8 semaines | ✅ Historique + prédictif 13 semaines |
| **Runway** | ✅ Calculé (4, 8, 13 semaines) | ❌ Non affiché |
| **Client Risk Score** | ✅ 0-100 + rating A/B/C/D | ❌ Non calculé |
| **Action Priority** | ✅ P0/P1/P2/P3 (impact×ease) | ❌ Non calculé |
| **SaaS Metrics** | ❌ Non géré | ✅ MRR, CAC, LTV, Churn |

---

### 5. 🎨 Visualisations

#### TRESORIS
- ❌ **Aucune visualisation native**
- ✅ API REST pour consommation externe
- ✅ WebSocket pour updates temps réel
- 💡 **Besoin** : Dashboard dédié Streamlit (TODO)

#### Financial Dashboard V2
- ✅ **10+ types de charts**
  - Cash Flow Evolution (Recharts line)
  - Expense Breakdown (Recharts pie)
  - Margin Evolution (Recharts area)
  - Top Clients (Recharts bar)
  - Sankey Flow (D3.js)
  - Sunburst (D3.js)
  - Radar comparaison (D3.js)
- ✅ Drill-down interactif
- ✅ Export PDF/Excel
- ✅ What-If Simulations (sliders temps réel)

---

## 🔗 Synergies & Opportunités d'Intégration

### Scénario 1 : TRESORIS comme Backend de Dashboard V2

**Architecture cible :**
```
Dashboard V2 (Frontend)
       ↓ API calls
TRESORIS (Backend)
       ↓ Calculs avancés
6 Engines ML + Memory
```

**Bénéfices :**
- ✅ Dashboard V2 délègue calculs complexes à TRESORIS
- ✅ Prédictions ML dans l'interface utilisateur
- ✅ Scoring clients A/B/C/D affiché visuellement
- ✅ Actions priorisées P0/P1/P2/P3 dans un panneau

**Intégrations concrètes :**

1. **KPI "Client Risk Score"** → Appel `GET /agent/risks`
   ```tsx
   const clientScores = await fetch('/agent/risks')
   <ClientRiskCard score={scores.find(c => c.client_id === 'ABC')} />
   ```

2. **Prédictions Cash Flow** → Appel `GET /agent/analysis/forecast`
   ```tsx
   const forecast = await fetch('/agent/analysis/forecast')
   <CashFlowPredictions data={forecast.predictions} />
   ```

3. **Alertes Early Warning** → WebSocket `/ws`
   ```tsx
   useEffect(() => {
     const ws = new WebSocket('ws://localhost:8000/ws')
     ws.onmessage = (event) => {
       if (event.data.type === 'early_warning') {
         addToast({ type: 'warning', ...event.data })
       }
     }
   }, [])
   ```

4. **Actions Recommandées** → Panneau dédié
   ```tsx
   <ActionsPanelV2>
     {actions.map(a => (
       <ActionCard
         priority={a.priority_level}  // P0/P1/P2/P3
         title={a.title}
         impact={a.impact_amount}
         onClick={() => validateAction(a.id)}
       />
     ))}
   </ActionsPanelV2>
   ```

---

### Scénario 2 : Dashboard V2 envoie données à TRESORIS pour apprentissage

**Architecture :**
```
Dashboard V2 → POST /agent/data/train
                  ↓
            TRESORIS Memory
                  ↓
          Amélioration patterns
```

**Bénéfices :**
- ✅ TRESORIS apprend des décisions utilisateur Dashboard
- ✅ Amélioration continue du scoring
- ✅ Boucle de feedback

---

### Scénario 3 : Co-existence avec spécialisation

**Répartition :**
- **TRESORIS** : Backend expert (prédictions, scoring, risques)
- **Dashboard V2** : Frontend visualisation (charts, simulations, export)

**Communication :**
- REST API pour requêtes ponctuelles
- WebSocket pour temps réel
- GraphQL pour requêtes complexes (optionnel)

---

## 🆚 Différences Clés

### Architecture

| Aspect | TRESORIS | Dashboard V2 |
|--------|----------|--------------|
| **Langage** | Python 3.11 | TypeScript/JavaScript |
| **Framework** | FastAPI | Next.js 14 |
| **Paradigme** | Event-driven autonome | User-triggered |
| **Stockage** | JSON local + Memory | Context providers React |
| **API** | REST + WebSocket | API Routes Next.js |

---

### Philosophie

| Aspect | TRESORIS | Dashboard V2 |
|--------|----------|--------------|
| **Objectif** | Autonomie - "Agent qui surveille" | Empowerment - "Tableau de bord CFO" |
| **Déclenchement** | Automatique (toutes les 30s) | Manuel (upload fichier) |
| **Décisions** | Propositions → Validation DAF | Simulation → Décision utilisateur |
| **Mode** | Proactif | Réactif |

---

### Données

| Aspect | TRESORIS | Dashboard V2 |
|--------|----------|--------------|
| **Source** | CSV/Excel → DataFrame pandas | CSV/Excel → Parse TypeScript |
| **Validation** | Stricte (colonnes requises) | Flexible (détection auto) |
| **Historique** | Nécessaire (>6 mois) | Optionnel (min 10 transactions) |
| **Stockage** | TresorisMemory persistant | State React éphémère |

---

### Calculs

| Métrique | TRESORIS | Dashboard V2 |
|----------|----------|--------------|
| **DSO** | Par client, pattern-based | Global, moyenné |
| **Prédictions** | ML + patterns | GPT-4 + stats |
| **Scoring** | 0-100 (4 composants) | 0-100 (score global) |
| **Anomalies** | 26 situations → 5 risques | Seuils fixes |

---

## 💡 Recommandations Stratégiques

### Court Terme (1-2 semaines)

1. **Créer API Bridge** `/api/tresoris/*` dans Dashboard V2
   - Proxy vers TRESORIS backend
   - Authentication partagée
   - Error handling unifié

2. **Afficher Client Risk Scores** dans Dashboard
   - Nouvelle KPI Card "Clients à Risque"
   - Drill-down sur détails scoring
   - Actions recommandées visibles

3. **Intégrer Early Warnings** dans AlertsPanel
   - WebSocket notifications
   - Toast temps réel
   - Filtrage par sévérité

---

### Moyen Terme (1 mois)

4. **Remplacer calculs DSO/BFR Dashboard** par appels TRESORIS
   - Plus précis
   - Pattern-based
   - Moins d'approximations

5. **Dashboard TRESORIS dédié** (Streamlit ou React)
   - Contrôle agent (start/stop)
   - Visualisation 6 engines
   - Audit trail

6. **Boucle de feedback** Dashboard → TRESORIS
   - Validation actions
   - Outcomes réels
   - Amélioration continue

---

### Long Terme (2-3 mois)

7. **Architecture hybride unifiée**
   ```
   FinSights Platform
        ├─ Dashboard V2 (Frontend)
        ├─ TRESORIS Agent (Backend)
        ├─ Shared Database (PostgreSQL)
        └─ Event Bus (Redis/Kafka)
   ```

8. **Intelligence partagée**
   - TRESORIS apprend de Dashboard
   - Dashboard affiche insights TRESORIS
   - Historique unifié

9. **White-label Consulting**
   - TRESORIS pour cabinets DAF
   - Dashboard V2 pour clients finaux
   - Synchronisation bidirectionnelle

---

## 📊 Matrice de Complémentarité

| Fonctionnalité | Meilleur choix | Justification |
|----------------|----------------|---------------|
| **Prédictions cash flow** | TRESORIS | ML patterns + saisonnalité |
| **Visualisation charts** | Dashboard V2 | Recharts + D3.js |
| **Scoring clients** | TRESORIS | 6 engines sophistiqués |
| **Simulations What-If** | Dashboard V2 | Sliders temps réel |
| **Détection anomalies** | TRESORIS | 26 situations → 5 risques |
| **Export PDF/Excel** | Dashboard V2 | html2canvas + SheetJS |
| **Calcul marges** | Dashboard V2 | Formules standards PCG |
| **Priorisation actions** | TRESORIS | Impact × Ease algorithm |
| **Interface utilisateur** | Dashboard V2 | React + Tailwind CSS |
| **Autonomie** | TRESORIS | Surveillance continue |

---

## 🚧 Points d'Attention

### TRESORIS

**Forces :**
- ✅ Sophistication ML
- ✅ Autonomie complète
- ✅ Mémoire persistante
- ✅ Scoring multi-facteurs
- ✅ Production-ready (4/4 métriques)

**Faiblesses :**
- ❌ Pas d'interface visuelle native
- ⚠️ Complexité débogage
- ⚠️ Nécessite historique long
- ⚠️ Coûts compute (pandas/numpy)

---

### Financial Dashboard V2

**Forces :**
- ✅ UX/UI professionnelle
- ✅ Visualisations riches
- ✅ Simulations temps réel
- ✅ Export multi-format
- ✅ Calculs instantanés

**Faiblesses :**
- ❌ Moins sophistiqué que TRESORIS
- ⚠️ Approximations (DPO fixe)
- ⚠️ Pas d'apprentissage automatique
- ⚠️ State éphémère (pas de mémoire)

---

## 🎯 Conclusion Stratégique

### Vision Unifiée Recommandée

```
┌──────────────────────────────────────────────────┐
│         FinSights Platform Unifiée               │
├──────────────────────────────────────────────────┤
│                                                   │
│  Frontend (Dashboard V2)                         │
│    ├─ Visualisations                             │
│    ├─ Simulations                                │
│    └─ Export                                     │
│           ↕ API/WebSocket                        │
│  Backend (TRESORIS)                              │
│    ├─ 6 Engines ML                               │
│    ├─ Prédictions                                │
│    ├─ Scoring                                    │
│    └─ Memory                                     │
│                                                   │
│  Database (PostgreSQL)                           │
│    ├─ Transactions                               │
│    ├─ Analyses                                   │
│    └─ Decisions                                  │
│                                                   │
└──────────────────────────────────────────────────┘
```

**Proposition :**
1. **TRESORIS** = Cerveau analytique (backend)
2. **Dashboard V2** = Interface utilisateur (frontend)
3. **Communication** = REST API + WebSocket
4. **Synergie** = Dashboard affiche insights TRESORIS avec visualisations riches

**Roadmap d'intégration :**
- ✅ **Phase 1** : API Bridge (1 semaine)
- ✅ **Phase 2** : Client Risk Cards (2 semaines)
- ✅ **Phase 3** : Early Warnings Panel (1 semaine)
- 🔄 **Phase 4** : Unified Database (1 mois)
- 🔮 **Phase 5** : Feedback Loop (1 mois)

---

## 📚 Annexes

### Comparaison Code

**TRESORIS - Calcul DSO (Python)**
```python
def analyze_client(self, client_id: str) -> ClientPaymentPattern:
    client_invoices = self.paid_invoices[
        self.paid_invoices['client_id'] == client_id
    ].copy()
    
    # Calculs statistiques
    delays = client_invoices['delay_days']
    avg_delay = delays.mean()
    std_delay = delays.std()
    median_delay = delays.median()
    
    # Trend detection (régression linéaire)
    trend_slope = self._calculate_trend(delays)
    
    # Reliability score (0-100)
    reliability = self._calculate_reliability_score(
        on_time_rate, late_rate, very_late_rate, avg_delay
    )
    
    return ClientPaymentPattern(
        client_id=client_id,
        avg_delay_days=avg_delay,
        reliability_score=reliability,
        trend="worsening" if trend_slope > 2 else "stable"
    )
```

**Dashboard V2 - Calcul DSO (TypeScript)**
```typescript
export function calculateDSOFromTransactions(
  records: FinancialRecord[]
): number | null {
  const incomeRecords = records.filter(r => 
    r.type === 'income' && r.amount > 0
  );
  
  if (incomeRecords.length < 3) return null;
  
  // Méthode 1 : Si dueDate disponible
  const recordsWithDueDate = incomeRecords.filter(r => r.dueDate);
  if (recordsWithDueDate.length >= 3) {
    const delays = recordsWithDueDate.map(r => {
      const daysDiff = Math.floor(
        (r.dueDate!.getTime() - r.date.getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      return Math.max(0, daysDiff);
    });
    
    const avgDelay = delays.reduce((sum, d) => sum + d, 0) / delays.length;
    return Math.round(avgDelay);
  }
  
  // Méthode 2 : Estimation
  const totalRevenue = incomeRecords.reduce((sum, r) => sum + r.amount, 0);
  const periodDays = calculatePeriodDays(incomeRecords);
  const annualizedRevenue = totalRevenue * (365 / periodDays);
  const estimatedReceivables = (totalRevenue / periodDays) * 30;
  
  return Math.round((estimatedReceivables / annualizedRevenue) * 365);
}
```

---

**Document généré le 29 janvier 2026**  
**Auteur : Analyse comparative FinSights**
