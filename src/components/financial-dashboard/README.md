# 📊 Financial Dashboard V2 - Module Autonome

## Structure Modulaire

Ce dossier contient le **Financial Dashboard V2**, un module **INDÉPENDANT** de gestion financière interactive.

### ⚠️ IMPORTANT
Ce dashboard **N'EST PAS** l'agent TRESORIS. Ce sont 2 composants séparés :

- **Financial Dashboard V2** (ici) : Frontend React pour analyse CSV/Excel
- **TRESORIS Agent** : Backend Python FastAPI pour surveillance trésorerie autonome

---

## 📁 Organisation

```
financial-dashboard/
├── sections/               → Composants UI des différentes sections
│   ├── KPIsSection.tsx     → Affichage 4 KPIs principaux
│   ├── ChartsSection.tsx   → Grille 8 graphiques (Recharts + D3)
│   ├── SimulationPanel.tsx → Simulateur What-If
│   └── PredictionsPanel.tsx → Prédictions cash flow IA
│
├── hooks/                  → Hooks React pour logique métier
│   ├── useDashboardState.ts    → États (kpis, data, loading)
│   ├── useFileProcessing.ts    → Upload + parsing fichiers
│   └── useDataCalculations.ts  → Calculs KPIs + charts
│
└── utils/                  → Fonctions utilitaires pures
    ├── kpiCalculators.ts       → Calcul des 15+ KPIs
    └── chartDataPreparers.ts   → Préparation données graphiques
```

---

## 🎯 Fonctionnalités

### Core Features
✅ Upload CSV/Excel → Parsing automatique  
✅ Calcul 15+ KPIs financiers  
✅ 8 graphiques interactifs (Recharts + D3.js)  
✅ ML Anomaly Detection  
✅ Score FinSight™ (0-100)  
✅ AI Copilot (GPT-4)

### Advanced Features
✅ Simulations What-If (3 paramètres)  
✅ Prédictions cash flow IA (3-12 mois)  
✅ Export PDF/Excel  
✅ Real-time collaboration (Pusher)  
✅ 3 démos pré-chargées

---

## 🔧 Utilisation

### Composant principal
```tsx
import FinancialDashboardV2 from '@/components/FinancialDashboardV2'

<FinancialDashboardV2 />
```

### Hooks individuels
```tsx
import { useDashboardState } from './hooks/useDashboardState'
import { useFileProcessing } from './hooks/useFileProcessing'

const { kpis, finSightScore, isLoading } = useDashboardState()
const { handleUpload, uploadProgress } = useFileProcessing()
```

---

## 🧠 Logique Métier

### Calcul KPIs
Les 15 KPIs sont calculés dans `utils/kpiCalculators.ts` :
- Chiffre d'affaires
- Charges totales
- Marge brute/nette
- Cash Flow
- DSO (Days Sales Outstanding)
- BFR (Besoin en Fonds de Roulement)
- Taux de marge
- etc.

### Préparation Graphiques
Les données des 8 charts sont préparées dans `utils/chartDataPreparers.ts` :
- Cash Flow Evolution (line chart)
- Expense Breakdown (pie chart)
- Margin Evolution (area chart)
- Top Clients (bar chart)
- Outstanding Invoices (bar chart)
- Payment Status (donut chart)
- Sankey Flow (D3 Sankey)
- Sunburst Expenses (D3 Sunburst)

---

## 🔗 Intégration TRESORIS (Future)

Ce dashboard sera connecté à TRESORIS Agent via :
- WebSocket real-time
- API REST endpoints
- Base de données partagée PostgreSQL

**Status actuel** : Non connecté (fonctionne de manière autonome)

---

**Dernière maj** : 30 janvier 2026  
**Lignes de code** : ~2000 → cible ~300 (après refacto)
