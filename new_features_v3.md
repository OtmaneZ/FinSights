# 🎯 Roadmap Features V3 - Moteur d'Intelligence Financière CFO

**Objectif** : Passer de "Dashboard IA" à "Moteur d'Intelligence Financière pour Dirigeants"

---

## 📊 État des lieux actuel (Ce qui existe déjà)

### ✅ EXCELLENTES BASES (80% du code réutilisable)

**1. Analyse Financière**
- ✅ Score FinSight™ 0-100 (4 piliers: Cash, Margin, Resilience, Risk)
- ✅ 15+ KPIs calculés automatiquement (DSO, BFR, marges, cash flow)
- ✅ ML Anomaly Detection (Z-Score, IQR, retards paiement)
- ✅ Signaux faibles (vocabulaire V3 activé)
- ✅ Benchmarks sectoriels

**2. Simulation basique**
- ⚠️ What-If existant (3 sliders: charges, paiements, prix)
- ⚠️ Calcul impact immédiat sur KPIs
- ❌ Mais: pas de projection temporelle (3-12 mois)
- ❌ Pas de stress tests structurés
- ❌ Pas de scénarios multiples sauvegardés

**3. CFO Virtuel (embryon)**
- ✅ AI Copilot (questions NLP sur données)
- ✅ Recommandations dans alertes
- ❌ Mais: pas de plans d'action automatiques structurés
- ❌ Pas de synthèse PDF "consultant"
- ❌ Pas de priorisation intelligente

**4. Infrastructure technique**
- ✅ Real-time collaboration (Pusher)
- ✅ Export PDF/Excel
- ✅ Drill-down détaillé par KPI
- ✅ Auth + multi-entreprises
- ✅ API v1 (dashboards, KPIs)

---

## 🚀 Features CRITIQUES à ajouter (V3 Pure)

### 🔥 PRIORITÉ 1 - Prévisions & Scénarios (Semaines 1-2)

#### **Feature 1.1: Cash Flow Forecast 3-12 mois**
**Status**: ❌ À créer  
**Impact**: 🔥🔥🔥 CRITIQUE (différenciation #1)

**Spec**:
```typescript
// Nouveau fichier: src/lib/forecasting/cashFlowForecast.ts
interface CashFlowForecast {
  months: Date[];
  predicted: number[];      // Prévision centrale
  pessimistic: number[];    // -20% scénario
  optimistic: number[];     // +15% scénario
  confidence: number[];     // 0-1 par mois
  runway: number;           // Mois avant rupture
  breakEvenMonth: Date | null;
}

function forecastCashFlow(
  historicalData: FinancialRecord[],
  horizon: 3 | 6 | 12
): CashFlowForecast
```

**Algorithme**:
1. **Régression linéaire améliorée** (déjà dans utils.ts à étendre)
2. **Saisonnalité** (détection patterns mensuels)
3. **Tendance expenses vs revenue** (séparé)
4. **Scénarios**: baseline, +15%, -20%

**UI**: 
- Nouveau composant `CashFlowForecastChart.tsx`
- Graphique ligne avec 3 courbes (optimiste/baseline/pessimiste)
- Zone rouge si runway < 3 mois
- Tooltips détaillés par mois

**Effort**: 8-12h

---

#### **Feature 1.2: Stress Tests Structurés**
**Status**: ❌ À créer  
**Impact**: 🔥🔥 TRÈS IMPORTANT

**Spec**:
```typescript
// src/lib/forecasting/stressTests.ts
interface StressTestScenario {
  name: string;
  description: string;
  impacts: {
    revenueChange: number;      // -10%, -20%, -30%
    expenseChange: number;       // +5%, +10%
    paymentDelayDays: number;    // +15, +30 jours
  };
  results: {
    cashFlowImpact: number;
    runwayImpact: number;        // Mois perdus
    scoreDrop: number;           // Points Score FinSight™
    criticalityLevel: 'safe' | 'warning' | 'critical';
  };
}

const PREDEFINED_TESTS: StressTestScenario[] = [
  { name: "Récession modérée", revenueChange: -10, ... },
  { name: "Crise sectorielle", revenueChange: -20, ... },
  { name: "Choc économique", revenueChange: -30, ... },
  { name: "Retards clients +30j", paymentDelayDays: 30, ... },
  { name: "Inflation charges +10%", expenseChange: 10, ... }
]
```

**UI**:
- Nouveau composant `StressTestPanel.tsx`
- Boutons scénarios prédéfinis
- Table comparaison: Aujourd'hui vs Après choc
- Graphique impact Score FinSight™

**Effort**: 6-8h

---

#### **Feature 1.3: Simulation Multi-Scénarios Sauvegardés**
**Status**: ⚠️ Améliorer l'existant  
**Impact**: 🔥 IMPORTANT

**Upgrade du What-If actuel**:
- ✅ Conserver les 3 sliders existants
- ➕ Ajouter: durée simulation (1-12 mois)
- ➕ Ajouter: évolution progressive (linéaire/par paliers)
- ➕ Bouton "Sauvegarder scénario" → DB
- ➕ Liste scénarios sauvegardés (comme bookmarks)

**Prisma schema ajout**:
```prisma
model Scenario {
  id          String   @id @default(cuid())
  dashboardId String
  name        String
  parameters  Json     // { charges: -15, paiements: -10, ... }
  results     Json     // KPIs projetés
  createdAt   DateTime @default(now())
  dashboard   Dashboard @relation(fields: [dashboardId], references: [id])
}
```

**Effort**: 4-6h

---

### 🧠 PRIORITÉ 2 - CFO Virtuel Avancé (Semaines 2-3)

#### **Feature 2.1: Plans d'Action Automatiques**
**Status**: ❌ À créer  
**Impact**: 🔥🔥 TRÈS IMPORTANT (USP forte)

**Spec**:
```typescript
// src/lib/cfo-virtual/actionPlans.ts
interface ActionItem {
  id: string;
  priority: 'P0' | 'P1' | 'P2';  // P0=urgent, P2=long terme
  category: 'cash' | 'margin' | 'resilience' | 'risk';
  title: string;
  description: string;
  expectedImpact: {
    scoreIncrease: number;      // +5 à +20 points
    cashImpact: number;         // € libérés
    timeframe: string;          // "7 jours", "1 mois"
  };
  steps: string[];              // Étapes concrètes
  difficulty: 'easy' | 'medium' | 'hard';
}

function generateActionPlan(
  score: FinSightScore,
  financialData: ProcessedData
): ActionItem[]
```

**Logique génération**:
1. Analyser breakdown Score FinSight™
2. Identifier 2-3 piliers les plus faibles
3. Proposer 5-8 actions priorisées (P0 > P1 > P2)
4. Calculer ROI estimé (impact vs effort)

**UI**: 
- Nouveau composant `ActionPlanPanel.tsx`
- Cards actions avec badges priorité
- Checklist étapes
- Bouton "Marquer terminé" + tracking

**Effort**: 10-12h

---

#### **Feature 2.2: Synthèse PDF "Consultant CFO"**
**Status**: ⚠️ Améliorer l'existant (PDF export basique existe)  
**Impact**: 🔥 IMPORTANT (positionnement premium)

**Upgrade du PDF actuel**:
- ✅ Garder KPIs + charts existants
- ➕ Page 1: Executive Summary (1 page, bullets)
  - Score FinSight™ + évolution
  - Top 3 insights
  - Top 3 risques
- ➕ Page 2-3: Analyse détaillée par pilier
- ➕ Page 4: Plan d'action priorisé (Feature 2.1)
- ➕ Page 5: Prévisions 6 mois (Feature 1.1)
- ➕ Style: Template "cabinet conseil" (pas dashboard)

**Template design**:
- Header avec logo + date
- Couleurs corporate (bleu marine + gris)
- Graphiques épurés (pas colorés)
- Typographie pro (pas Comic Sans 😅)

**Effort**: 6-8h

---

#### **Feature 2.3: Analyse Comparative Temporelle**
**Status**: ❌ À créer  
**Impact**: 🔥 IMPORTANT

**Spec**:
```typescript
// Nouveau: Comparer 2 périodes (mois M vs M-1, trim vs trim)
interface PeriodComparison {
  period1: { start: Date; end: Date };
  period2: { start: Date; end: Date };
  metrics: {
    [kpiName: string]: {
      before: number;
      after: number;
      change: number;
      changePercent: number;
      trend: 'improving' | 'declining' | 'stable';
    }
  };
  scoreEvolution: {
    before: number;
    after: number;
    delta: number;
  };
  narrative: string;  // "Votre marge s'est améliorée de 3 points..."
}
```

**UI**:
- Nouveau tab "Évolution Temporelle"
- Sélecteur période (M-1, M-3, M-6, M-12)
- Table comparaison avec flèches ↗↘
- Mini-graphiques sparkline par KPI

**Effort**: 5-7h

---

### 🛡️ PRIORITÉ 3 - Risque Intelligent (Semaines 3-4)

#### **Feature 3.1: Dépendance Clients Détaillée**
**Status**: ⚠️ Calcul existe (dans finSightScore.ts), UI à créer  
**Impact**: 🔥 IMPORTANT

**UI**:
- Nouveau composant `ClientDependencyAnalysis.tsx`
- **Graphique Pareto**: Top 10 clients (% CA cumulé)
- **Matrice risque**: Volume × Retard paiement
- **Alerte automatique** si 1 client > 35% CA

**Calcul enrichi**:
```typescript
interface ClientRiskProfile {
  name: string;
  revenueShare: number;      // % du CA
  averagePaymentDelay: number; // jours
  volatility: number;        // écart-type montants
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
}
```

**Effort**: 4-6h

---

#### **Feature 3.2: Créances Vieillissantes (Aging Report)**
**Status**: ❌ À créer  
**Impact**: 🔥 IMPORTANT

**Spec**:
```typescript
interface AgingReport {
  ranges: {
    '0-30j': { count: number; amount: number };
    '31-60j': { count: number; amount: number };
    '61-90j': { count: number; amount: number };
    '90j+': { count: number; amount: number };
  };
  criticalInvoices: {
    client: string;
    amount: number;
    daysLate: number;
    risk: 'high' | 'critical';
  }[];
}
```

**UI**:
- Graphique colonnes empilées par tranche
- Table factures > 90j avec bouton "Relancer"
- Indicateur "Dette cachée potentielle"

**Effort**: 5-7h

---

#### **Feature 3.3: Volatilité Charges & Revenus**
**Status**: ⚠️ Calcul existe (volatility dans finSightScore.ts), UI à créer  
**Impact**: 🔥 MOYEN

**UI**:
- Graphique "Rolling Volatility" (3 mois glissants)
- Coefficient de variation (CV) par catégorie
- Benchmark secteur
- Recommandation si CV > 50%: "Lisser revenus (abonnements)"

**Effort**: 3-4h

---

### 📈 PRIORITÉ 4 - Analytics Avancées (Semaines 4-5)

#### **Feature 4.1: Décomposition Waterfall Marge**
**Status**: ❌ À créer  
**Impact**: 🔥 MOYEN (mais très premium)

**Spec**:
- Graphique Waterfall (cascade)
- CA brut → Marge brute → Marge opé → Marge nette
- Étapes: CA - COGS - Charges fixes - Charges variables - Impôts

**UI**: Chart D3.js (comme SankeyFlow existant)

**Effort**: 4-6h

---

#### **Feature 4.2: Cohort Analysis Clients**
**Status**: ❌ À créer  
**Impact**: 🔥 FAIBLE (nice-to-have)

**Spec**:
- Grouper clients par mois d'acquisition
- Analyser rétention + LTV par cohorte
- Table heatmap (comme analytics SaaS)

**Effort**: 6-8h (optionnel)

---

## 📅 Planning Suggéré (4-5 semaines)

### **Semaine 1: Prévisions Foundation**
- [ ] Feature 1.1: Cash Flow Forecast 3-12 mois (8-12h)
- [ ] Feature 1.2: Stress Tests (6-8h)

### **Semaine 2: CFO Virtuel Core**
- [ ] Feature 2.1: Plans d'Action Automatiques (10-12h)
- [ ] Feature 1.3: Multi-scénarios sauvegardés (4-6h)

### **Semaine 3: Risque + PDF Premium**
- [ ] Feature 2.2: Synthèse PDF Consultant (6-8h)
- [ ] Feature 3.1: Dépendance clients UI (4-6h)
- [ ] Feature 3.2: Aging Report (5-7h)

### **Semaine 4: Polish + Analytics**
- [ ] Feature 2.3: Analyse comparative (5-7h)
- [ ] Feature 3.3: Volatilité UI (3-4h)
- [ ] Feature 4.1: Waterfall marge (4-6h)

### **Semaine 5: Tests + Docs**
- [ ] Tests E2E nouvelles features
- [ ] Documentation utilisateur
- [ ] Vidéos démo
- [ ] Update homepage avec nouvelles features

---

## 🎯 Impact Business Attendu

### **Positionnement Market**
- ❌ Avant: "Dashboard financier automatisé" (compétiteurs: 50+)
- ✅ Après: "Moteur d'intelligence financière CFO" (compétiteurs: ~5)

### **Pricing Justifié**
- Avec ces features → **49-99€/mois** justifié (vs 15-29€ actuellement)
- CFO freelance = 500-800€/jour → ROI évident
- Cabinet conseil = 2000€/jour → ROI encore plus évident

### **Acquisition**
- SEO: "prévisions trésorerie", "stress test financier", "CFO virtuel"
- Inbound: contenu éducatif sur forecasting (vs "upload Excel")
- Partenariats: cabinets comptables (outil recommandé clients)

### **Rétention**
- Scénarios sauvegardés → lock-in
- Analyse comparative temporelle → usage hebdomadaire (vs mensuel)
- Plans d'action → engagement quotidien

---

## 🔥 Quick Wins (Si temps limité)

**Si tu as 1 semaine → Fais ça:**
1. ✅ Feature 1.1: Cash Flow Forecast (MUST)
2. ✅ Feature 2.1: Plans d'Action (MUST)
3. ⚠️ Feature 1.2: Stress Tests (SHOULD)

**Ces 3 features seules = 80% de l'impact perçu**

---

## 🛠️ Stack Technique (Réutilisation maximale)

**Frontend**:
- React + TypeScript (existant)
- Recharts (existant) + D3.js (déjà utilisé pour Sankey)
- Tailwind CSS (existant)

**Backend**:
- Next.js API routes (existant)
- Prisma + PostgreSQL (existant)
- Aucune infra nouvelle requise ✅

**AI/ML**:
- OpenAI GPT-4 (existant pour Copilot) → réutiliser pour plans d'action
- Calculs prévisions: régression linéaire pure (pas de lib ML lourde)

**Effort total estimé: 80-120h** (2-3 semaines full-time ou 4-5 semaines mi-temps)

---

## 💡 Remarques Stratégiques

1. **Ne pas toucher au Score FinSight™** → C'est parfait, c'est ton ancrage
2. **Vocabulaire V3 partout** → "Prévisions stratégiques" pas "forecast", "Plans CFO" pas "todo list"
3. **UI sobre, pas flashy** → Tu cibles CFO 45-60 ans, pas startuppers 25 ans
4. **Preuves sociales** → "Utilisé par 50+ CFO PME" (même si beta testers)
5. **Comparaison consultant** → "Cette analyse vous coûterait 2000€ chez un cabinet"

---

## 🚫 Ce qu'il NE FAUT PAS faire

❌ **Ajouter de la compta** (factures, écritures, plan comptable)  
→ Tu n'es pas un ERP, reste stratégique

❌ **Connexions bancaires live**  
→ Complexité légale/technique énorme, ROI faible

❌ **Dashboard customisable à l'infini**  
→ Paralysie du choix, garde une vision opinionated

❌ **Gamification/badges**  
→ Ton user est CFO, pas gamer

❌ **Mobile app native**  
→ PWA suffit, ils utilisent sur desktop

---

## ✅ Critères de Succès V3

**Metric 1**: Utilisateur moyen passe de **5min/semaine** à **20min/semaine** (engagement)  
**Metric 2**: 80%+ utilisateurs créent ≥1 scénario sauvegardé (activation feature)  
**Metric 3**: Temps moyen avant upgrade FREE→PRO passe de **jamais** à **14 jours**  
**Metric 4**: NPS > 50 (recommendation)  
**Metric 5**: "moteur intelligence financière" dans 70%+ des retours users

---

**Prêt à attaquer Feature 1.1 (Cash Flow Forecast) ?** 🚀
