# 🗺️ CARTOGRAPHIE VISUELLE - Architecture Actuelle vs Cible

## 📊 ARCHITECTURE ACTUELLE (Spaghetti)

```
┌─────────────────────────────────────────────────────────────────┐
│                    /src/app/demo/page.tsx                       │
│                       (Simple wrapper)                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│        FinancialDashboardV2.tsx (1954 LIGNES) 🔴                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ • 30+ états React                                        │   │
│  │ • 35+ imports                                            │   │
│  │ • Upload + Démo + Export + ML + AI + Real-time          │   │
│  │ • Calcul KPIs inline                                     │   │
│  │ • Préparation données charts (useMemo)                   │   │
│  │ • Gestion modales                                        │   │
│  │ • Keyboard shortcuts                                     │   │
│  │ • What-If simulations                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┘
   │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │
   ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼
┌─────────────────────────────────────────────────────────────────┐
│                   IMPORTS PARTOUT (35+)                         │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────┤
│   Charts    │  Components │     AI      │     Lib     │  Hooks  │
│   (8)       │    (12)     │    (3)      │    (15)     │   (5)   │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────┤
│ CashFlow    │ BenchmarkBar│ AICopilot   │ dataParser  │ useDrill│
│ Expense     │ AlertsPanel │ Predictions │ formulas    │ useKbd  │
│ Margin      │ CompanyModal│ SaaS        │ demoLoader  │ useTheme│
│ TopClients  │ DataPreview │             │ pdfExporter │ useRealT│
│ Sankey      │ Anomaly     │             │ scoring     │ useSync │
│ Sunburst    │ CommandPal  │             │ ml/anomaly  │         │
│ Invoices    │ AuthBanner  │             │ ai/patterns │         │
│ Payment     │ Upload      │             │ forecasting │         │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Routes (15+)                             │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│   /upload    │  /copilot    │     /ai      │   /dashboards      │
│   (1)        │    (1)       │    (3)       │      (3)           │
├──────────────┼──────────────┼──────────────┼────────────────────┤
│ • Parsing    │ • Chat GPT-4 │ • Predictions│ • CRUD             │
│ • Validation │ • Context    │ • Patterns   │ • List             │
│ • KPIs calc  │ • History    │ • Recommends │ • Load/Save        │
└──────────────┴──────────────┴──────────────┴────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Contextes Globaux (3)                          │
├─────────────────────┬──────────────────────┬────────────────────┤
│ financialContext    │  companyContext      │  themeContext      │
│ (Global state data) │  (Active company)    │  (Dark/Light)      │
└─────────────────────┴──────────────────────┴────────────────────┘
```

### 🔴 Problèmes :
- **1 fichier = 1954 lignes** (God component)
- **Dépendances circulaires** (contextes ↔ composants)
- **Logique métier dans UI** (calculs KPIs inline)
- **Impossible à tester** (trop couplé)
- **Pas de lazy loading** (tout chargé d'un coup)

---

## ✅ ARCHITECTURE CIBLE (Clean)

```
┌─────────────────────────────────────────────────────────────────┐
│                    /src/app/demo/page.tsx                       │
│                  (Wrapper simple < 50 lignes)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│        FinancialDashboard.tsx (< 300 LIGNES) 🟢                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Orchestration uniquement :                               │   │
│  │ • useDemo() hook                                         │   │
│  │ • useUpload() hook                                       │   │
│  │ • useDashboardData() hook                                │   │
│  │ • Compose 5-8 composants                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────┬───────────────┬───────────────┬───────────────┬────────┘
         │               │               │               │
         ▼               ▼               ▼               ▼
┌────────────────┐ ┌──────────────┐ ┌─────────────┐ ┌──────────┐
│ DashboardKPIs  │ │ DashboardCharts│ │DashboardHead│ │ AICopilot│
│  (Feature)     │ │   (Feature)    │ │  (Feature)  │ │ (Feature)│
└────────┬───────┘ └──────┬─────────┘ └──────┬──────┘ └────┬─────┘
         │                │                   │              │
         ▼                ▼                   ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FEATURES (Modules isolés)                      │
├──────────────┬──────────────┬──────────────┬──────────────┬─────┤
│   /demo      │  /dashboard  │   /upload    │ /ai-copilot  │ ... │
│              │              │              │              │     │
│ ├─components │ ├─components │ ├─components │ ├─components │     │
│ ├─hooks      │ ├─hooks      │ ├─hooks      │ ├─hooks      │     │
│ ├─services   │ ├─services   │ ├─services   │ ├─services   │     │
│ └─types.ts   │ └─types.ts   │ └─types.ts   │ └─types.ts   │     │
└──────────────┴──────────────┴──────────────┴──────────────┴─────┘
         │                │                   │              │
         ▼                ▼                   ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SHARED (Code réutilisable)                     │
├────────────────────┬──────────────────┬────────────────────────┤
│   /components      │    /hooks        │    /contexts           │
│   (UI génériques)  │  (Transverses)   │   (Global state)       │
├────────────────────┼──────────────────┼────────────────────────┤
│ • Button           │ • useKeyboard    │ • FinancialContext     │
│ • Modal            │ • useTheme       │ • CompanyContext       │
│ • Toast            │ • useRealtimeSync│ • AuthContext          │
│ • Loader           │                  │                        │
└────────────────────┴──────────────────┴────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LIB (Utilitaires purs)                       │
├─────────────────┬─────────────────┬─────────────────┬──────────┤
│   /types        │    /utils       │     /api        │ /config  │
│ (Types globaux) │  (Helpers)      │  (Clients)      │ (Env)    │
├─────────────────┼─────────────────┼─────────────────┼──────────┤
│ • KPI           │ • formatCurrency│ • apiClient.ts  │ • env.ts │
│ • FinancialData │ • logger.ts     │ • copilotAPI.ts │          │
│ • Chart         │ • validators.ts │ • uploadAPI.ts  │          │
└─────────────────┴─────────────────┴─────────────────┴──────────┘
```

### ✅ Avantages :
- **Feature-based** : Chaque feature = module isolé
- **Lazy loading** : Charge uniquement ce qui est nécessaire
- **Testable** : Services/hooks testables unitairement
- **Scalable** : Ajouter feature = nouveau dossier
- **Maintenable** : Structure claire, responsabilités séparées

---

## 🔄 FLUX DE DONNÉES - AVANT/APRÈS

### 🔴 AVANT (Spaghetti)

```
User Action
    │
    ▼
FinancialDashboardV2 (1954 lignes)
    │
    ├─► useState (30+ états)
    ├─► useMemo (calculs inline)
    ├─► useEffect (side effects partout)
    ├─► fetch API (inline)
    ├─► Calculs KPIs (inline)
    └─► Mise à jour UI
```

### ✅ APRÈS (Clean)

```
User Action
    │
    ▼
Feature Component (< 200 lignes)
    │
    ├─► useFeatureHook() ──► Feature Service
    │                             │
    │                             ├─► API Client
    │                             ├─► Data Processing
    │                             └─► Return clean data
    │
    └─► UI Component (props)
```

---

## 📦 EXEMPLE CONCRET : Feature "Demo"

### 🔴 AVANT

```typescript
// Tout dans FinancialDashboardV2.tsx (lignes 959-1240)

const [isLoadingDemo, setIsLoadingDemo] = useState(false);
const [loadingProgress, setLoadingProgress] = useState(0);
const [loadingMessage, setLoadingMessage] = useState('');

const loadDemoScenario = async (scenario: 'saine' | 'difficulte' | 'croissance') => {
  setIsLoadingDemo(true);
  setLoadingProgress(0);
  
  const scenarioConfig = { /* ... */ };
  const config = scenarioConfig[scenario];
  
  try {
    const { isDemoFile, loadDemo } = await import('@/lib/demoDataLoader');
    // ... 280 lignes de logique ...
  } catch (error) {
    // ...
  } finally {
    // ...
  }
}

// Appelé depuis EmptyDashboardStateV2
<EmptyDashboardStateV2 onDemoLoad={loadDemoScenario} />
```

### ✅ APRÈS

```typescript
// features/demo/hooks/useDemoLoader.ts (50 lignes)
export function useDemoLoader() {
  const [state, setState] = useState(initialState);
  
  const loadScenario = async (scenario: DemoScenario) => {
    setState({ loading: true, progress: 0 });
    const data = await demoService.load(scenario);
    setState({ loading: false, data });
  };
  
  return { state, loadScenario };
}

// features/demo/services/demoService.ts (80 lignes)
export const demoService = {
  async load(scenario: DemoScenario): Promise<DemoData> {
    const config = await this.fetchConfig(scenario);
    const data = await this.processData(config);
    return data;
  },
  // ...
};

// features/demo/components/DemoScenarioSelector.tsx (100 lignes)
export function DemoScenarioSelector() {
  const { loadScenario } = useDemoLoader();
  
  return (
    <div>
      <button onClick={() => loadScenario('hypercroissance')}>
        Scale-up
      </button>
      {/* ... */}
    </div>
  );
}

// FinancialDashboard.tsx (orchestration)
import { DemoScenarioSelector } from '@/features/demo';

export function FinancialDashboard() {
  return (
    <div>
      {!hasData && <DemoScenarioSelector />}
      {hasData && <DashboardContent />}
    </div>
  );
}
```

**Résultat** :
- `FinancialDashboard.tsx` : **280 lignes → 20 lignes** ✅
- Logique isolée dans `/features/demo/`
- Testable unitairement
- Réutilisable ailleurs

---

## 🎯 ROADMAP REFACTORING

```
Semaine 1 : Features Core
├─ Jour 1-2 : Feature "demo"
│   └─ Extract loadDemoScenario → useDemoLoader
├─ Jour 3-4 : Feature "upload"
│   └─ Extract handleFileUpload → useFileUpload
└─ Jour 5 : Feature "dashboard"
    └─ Extract KPIs/Charts → Composants séparés

Semaine 2 : Features Avancées
├─ Jour 1-2 : Feature "ai-copilot"
│   └─ Extract AICopilot → Module isolé
├─ Jour 3-4 : Feature "export"
│   └─ Extract PDF/Excel → Services
└─ Jour 5 : Feature "charts"
    └─ Regroup tous les charts

Semaine 3 : Shared & Lib
├─ Jour 1-2 : Shared components/hooks
├─ Jour 3-4 : Lib utilities/types
└─ Jour 5 : Tests + Documentation
```

---

## 📊 IMPACT ESTIMÉ

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| Complexité cyclomatique | 250+ | < 50 | **-80%** |
| Temps compréhension code | 4h | 30min | **-87%** |
| Temps ajout feature | 2 jours | 4h | **-75%** |
| Risque de bug | 🔴 Élevé | 🟢 Faible | **-60%** |
| Couverture tests | 0% | 80% | **+80%** |
| Bundle size (lazy load) | 2.5MB | 800KB | **-68%** |

---

## 🚀 PRÊT POUR LE REFACTORING ?

**Options** :

1. **🟢 Refactoring progressif** (recommandé)
   - Feature par feature
   - Pas de breaking changes
   - 2-3 semaines

2. **🟡 Refactoring complet**
   - Réécriture totale
   - Breaking changes acceptés
   - 1 semaine intensive

3. **🔴 Ne rien faire**
   - Dette technique augmente
   - Code devient inmaintenable
   - Risque de réécriture forcée

**Ma recommandation** : **Option 1** (progressif)

Tu veux que je commence ? 🎯
