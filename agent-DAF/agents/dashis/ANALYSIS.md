# 🔬 ANALYSE APPROFONDIE : FinancialDashboardV2 → DASHIS Agent

**Date** : 30 janvier 2026  
**Fichier analysé** : `/src/components/FinancialDashboardV2.tsx` (1991 lignes)  
**Objectif** : Transformer en agent IA autonome et indépendant

---

## 📊 MÉTRIQUES CODE

| Métrique | Valeur | Status |
|----------|--------|--------|
| Lignes totales | 1991 | 🔴 Trop volumineux |
| Imports | 46 | 🔴 Trop de dépendances |
| Hooks React | 44 | 🔴 État trop dispersé |
| useState | 34 | 🔴 Complexité élevée |
| useEffect | 7 | ⚠️ Effets de bord multiples |
| useMemo | 9 | ✅ Optimisations présentes |
| Composants charts | 8 | ✅ Bien externalisés |

---

## 🎯 PAGES UTILISANT FinancialDashboardV2

1. **`/src/app/demo/page.tsx`** ✅ PROD
   - Usage : Demo publique (aucune auth)
   - Import : `import FinancialDashboardV2 from '@/components/FinancialDashboardV2'`
   
2. **`/src/app/dashboard/results/page.tsx`** ✅ PROD
   - Usage : Après upload fichier (auth requise)
   - Import : `import FinancialDashboardV2 from '@/components/FinancialDashboardV2'`

3. **Symlink `/agent-DAF/agents/dashis/frontend/FinancialDashboardV2.tsx`**
   - Pointe vers `/src/components/FinancialDashboardV2.tsx`

---

## 🧩 ARCHITECTURE ACTUELLE

### **Dépendances externes critiques**

```typescript
// Contextes Next.js
useSession()          // next-auth - Auth utilisateur
useRouter()           // next/navigation - Navigation
useSearchParams()     // next/navigation - Query params

// Contextes custom
useFinancialData()    // Context global données financières
useActiveCompany()    // Context entreprise active
useTheme()            // Context thème dark/light
useRealtimeSync()     // Context Pusher WebSocket (désactivé en prod)

// Hooks métier
useDrilldown()        // Modal drill-down KPIs
useKeyboard()         // Shortcuts clavier
```

**🚨 Problème** : Forte couplage avec contextes Next.js et contextes custom → Pas autonome

---

## 📦 COMPOSANTS IMPORTÉS (20+)

### **Charts (8)** ✅ Bien externalisés
- CashFlowEvolutionChart, ExpenseBreakdownChart, MarginEvolutionChart
- TopClientsVerticalChart, OutstandingInvoicesChart, PaymentStatusChart
- SankeyFlowChart (D3.js), SunburstExpensesChart (D3.js)

### **UI Components (10+)**
- BenchmarkBar, AlertsPanel, CompanyInfoModal, DataPreviewPanel
- AnomalyPanel, CommandPalette, AICopilot, EmptyDashboardStateV2
- FinSightScoreCard, UploadSuccessBanner, CashFlowPredictions
- AuthBanner, ConsultingBanner, DataSourcesPanel
- PresenceIndicator, RealtimeToast, AlertSettings, SaaSMetricsSection
- KPIDrilldownModal

**✅ Point positif** : UI bien composée, pas de JSX monolithique

---

## 🧠 MOTEURS IA/ML (Backend)

### **Déjà externalisés dans `/backend/`**
```typescript
// ML
import { detectAnomalies } from '@/lib/ml/anomalyDetector'
import type { Anomaly } from '@/lib/ml/types'

// AI
import { generateCashFlowPredictions } from '@/lib/ai/predictions'
import { detectAdvancedPatterns } from '@/lib/ai/patterns'

// Scoring
import { calculateFinSightScore } from '@/lib/scoring/finSightScore'
```

**✅ Point positif** : Logique IA/ML déjà séparée (via symlinks → `dashis/backend/`)

---

## 🔄 FLUX DE DONNÉES PRINCIPAL

### **1. Upload fichier**
```
handleFileUpload() 
  → FileReader.readAsText()
  → POST /api/upload (avec fileContent, fileName, fileType)
  → Réponse: { kpis, records, financialData, dashboardConfig }
  → setKpis(), setRawData(), setFinSightData()
  → calculateFinSightScore()
  → generateCashFlowPredictions()
  → detectAdvancedPatterns()
  → detectAnomalies()
```

### **2. Calculs en temps réel (useMemo)**
- `monthlyData` → Agrégation mensuelle CA/Charges/CashFlow
- `categoryBreakdown` → Répartition charges par catégorie
- `marginData` → Évolution marges mensuelles
- `topClients` → Top clients par CA
- `outstandingInvoices` → Factures impayées
- `paymentStatus` → Répartition statuts paiements
- `sankeyData` → Flux financiers pour Sankey D3
- `sunburstData` → Données hiérarchiques charges

**✅ Point positif** : Calculs optimisés avec useMemo

---

## 🎛️ ÉTATS (34 useState)

### **Catégories d'état**

| Catégorie | États | Problème |
|-----------|-------|----------|
| **Données** | kpis, rawData, finSightData, anomalies, aiPatterns, cashFlowPredictions, predictionAlerts, saasMetrics | ✅ Logique |
| **Upload** | uploadStep, uploadProgress, isUploadingFile | ✅ Machine à états basique |
| **UI Modals** | showCompanyModal, showAnomalies, showAlertSettings, showSimulation, isCommandPaletteOpen, drillDownState | ⚠️ Trop dispersé |
| **Loading** | isLoadingDemo, loadingProgress, loadingMessage, isLoadingPatterns, isLoadingPredictions | 🔴 Redondant |
| **Config** | companyName, companySector, selectedPeriod, dashboardConfig, demoAlerts | ✅ Métadonnées |
| **Simulations** | chargesReduction, paiementsAcceleration, prixAugmentation, simulatedKPIs | ✅ What-If engine |
| **Real-time** | toastNotifications, showUploadBanner | ⚠️ Pusher désactivé en prod |
| **Export** | isExporting | ✅ Minimal |

**🚨 Problème principal** : Pas de state machine unifiée → États dispersés, gestion complexe

---

## 🐛 PROBLÈMES IDENTIFIÉS

### **1. Nommage**
- ❌ "V2" dans le nom → Amateur
- ❌ Variables français/anglais mélangées (`chargesReduction`, `paiementsAcceleration`)
- ❌ Noms génériques (`result`, `data`, `processedData`)

### **2. Architecture**
- ❌ Monolithe 1991 lignes → Difficile à maintenir
- ❌ 34 useState dispersés → Pas de source unique de vérité
- ❌ Logique métier mélangée avec UI
- ❌ Dépendances circulaires (useFinancialData, useActiveCompany)

### **3. Performance**
- ⚠️ 9 useMemo → Bon, mais calculs dans le composant (devrait être dans backend)
- ⚠️ 7 useEffect → Effets de bord multiples, hard to debug
- ⚠️ Real-time Pusher désactivé en commentaire → Code mort

### **4. Autonomie**
- ❌ Dépend de `useSession()` → Couplé à next-auth
- ❌ Dépend de `useRouter()` → Couplé à Next.js
- ❌ Dépend de `useFinancialData()` → Context global externe
- ❌ Dépend de `useActiveCompany()` → Context global externe

### **5. Code mort**
- ❌ `loadingSavedDashboard`, `loadedDashboardId` → Non utilisés ?
- ❌ `CursorTracker` importé mais commenté
- ❌ `useRealtimeSync` appelé mais Pusher désactivé
- ❌ Variables demo (`isLoadingDemo`, `loadingProgress`, `loadingMessage`)

---

## 🎯 OBJECTIF : Agent DASHIS Autonome

### **Définition "Agent Autonome"**
1. **Indépendant des contextes Next.js** (session, router peuvent être optionnels)
2. **Source unique de vérité** (state machine, pas 34 useState)
3. **Logique métier externalisée** (calculs dans backend, pas dans composant)
4. **Cycle autonome** : Upload → Analyze → Monitor → Alert
5. **API claire** : Props d'entrée minimales, callbacks de sortie

---

## 📋 PLAN DE REFACTORISATION

### **Phase 1 : Extraction backend (Sans toucher au code actuel)**
**Durée** : 3-4h  
**Objectif** : Créer classes backend pour logique métier

```
agent-DAF/agents/dashis/backend/core/
├── DashisAgent.ts           ← State machine + orchestration
├── KPIEngine.ts             ← Tous calculs KPIs (extrait des useMemo)
├── DataProcessor.ts         ← Préparation données charts
├── SimulationEngine.ts      ← What-If scenarios
└── types.ts                 ← Types centralisés
```

**Actions** :
1. Créer `DashisAgent.ts` avec state machine :
   ```typescript
   type DashisState = 'idle' | 'loading' | 'analyzing' | 'ready' | 'simulating' | 'error'
   ```

2. Extraire tous les `useMemo` vers `KPIEngine.ts` :
   - `calculateMonthlyData(rawData)`
   - `calculateCategoryBreakdown(rawData)`
   - `calculateMarginData(rawData)`
   - `calculateTopClients(rawData)`
   - etc.

3. Extraire logique simulations vers `SimulationEngine.ts` :
   - `simulateChargesReduction(kpis, percentage)`
   - `simulatePaiementsAcceleration(kpis, days)`
   - `simulatePrixAugmentation(kpis, percentage)`

**⚠️ Important** : Ne PAS toucher à `FinancialDashboardV2.tsx` pour l'instant

---

### **Phase 2 : Création composant wrapper (Cohabitation)**
**Durée** : 2h  
**Objectif** : Créer `DashisAgent.tsx` qui utilise le backend, garde `FinancialDashboardV2.tsx` intact

```
src/components/dashis/
├── DashisAgent.tsx          ← Nouveau wrapper utilisant DashisAgent backend
└── ui/
    ├── KPIGrid.tsx
    ├── ChartsGrid.tsx
    └── ...
```

**Actions** :
1. Créer `DashisAgent.tsx` minimal qui utilise `DashisAgent.ts` backend
2. Tester sur page `/demo-new` (ne pas toucher `/demo`)
3. Valider que tout fonctionne

---

### **Phase 3 : Migration progressive (Si Phase 2 OK)**
**Durée** : 4h  
**Objectif** : Remplacer `FinancialDashboardV2.tsx` par `DashisAgent.tsx`

**Actions** :
1. Créer branche Git `feature/dashis-refactor`
2. Remplacer imports dans `/demo/page.tsx`
3. Tests complets
4. Si OK, merger

---

### **Phase 4 : Cleanup final**
**Durée** : 1h  
**Objectif** : Supprimer ancien code, renommer

**Actions** :
1. Supprimer `FinancialDashboardV2.tsx`
2. Renommer `DashisAgent.tsx` → composant principal
3. Cleanup imports, code mort
4. Documentation

---

## ✅ VALIDATION AVANT REFACTORISATION

### **Checklist pré-requis**
- [ ] Tests manuels page `/demo` : Upload CSV → Dashboard OK
- [ ] Tests manuels page `/dashboard/results` : Idem
- [ ] Identifier tous les appels à `FinancialDashboardV2` dans le repo
- [ ] Backup branche Git actuelle
- [ ] Créer branche `feature/dashis-refactor`

### **Critères de succès**
- ✅ Page `/demo` fonctionne identique
- ✅ Upload CSV → KPIs calculés
- ✅ Charts affichés correctement
- ✅ Simulations What-If fonctionnent
- ✅ Export PDF/Excel OK
- ✅ Score FinSight™ calculé
- ✅ Prédictions AI/ML opérationnelles

---

## 🚀 NEXT STEPS

**Attendre validation utilisateur avant de procéder.**

Options :
1. **Option A (Safe)** : Phase 1 uniquement (extraction backend, 0 risque)
2. **Option B (Progressive)** : Phase 1 + Phase 2 (nouveau composant cohabite)
3. **Option C (Full refactor)** : Phases 1-4 complètes

**Recommandation** : **Option A** pour commencer, valider que l'extraction backend fonctionne, puis Phase 2 si OK.
