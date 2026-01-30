# DASHIS - Agent IA Frontend/Backend Hybride

**Agent #5** : Dashboard Intelligence System

## 🎯 Rôle
Agent IA hybride combinant frontend interactif et moteurs backend pour l'analyse financière intelligente en temps réel.

## 🧠 Capacités IA

### Backend (TypeScript/Node.js)
- **ML - Détection d'anomalies** (`backend/ml/anomalyDetector.ts`)
  - Identifie patterns suspects dans transactions
  - Détection automatique de valeurs aberrantes
  
- **AI - Prédictions cash-flow** (`backend/ai/predictions.ts`)
  - Forecasting 3-6 mois via GPT-4
  - Alertes prédictives de tensions de trésorerie
  
- **AI - Patterns avancés** (`backend/ai/patterns.ts`)
  - Analyse comportements clients (retards paiement, saisonnalité)
  - Détection tendances cachées
  
- **Scoring - FinSight Score™** (`backend/scoring/finSightScore.ts`)
  - Note santé financière 0-100
  - Benchmark sectoriel automatique
  
- **AI - Copilot** (`backend/ai/copilot.ts`)
  - Chat GPT-4 pour questions naturelles
  - Auto-summary des données importées

### Frontend (React/TypeScript)
- **Dashboard orchestrateur** (`frontend/FinancialDashboardV2.tsx`)
  - 1954 lignes, hub central d'analyse
  - KPIs temps réel : CA, marge, tréso, DSO
  
- **Visualisations avancées** (`frontend/charts/`)
  - 8 composants Recharts + D3.js
  - Sankey, Sunburst, évolutions temporelles
  
- **Simulations What-If**
  - Scénarios réduction charges, accélération paiements
  - Impact instantané sur KPIs

## 🔧 Moteurs de calcul
- Métriques SaaS (MRR, Churn, LTV/CAC)
- Exports intelligents (PDF/Excel avec insights)
- Détection automatique capacités données

## 📊 Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Recharts
- **AI**: OpenAI GPT-4, TensorFlow.js
- **Real-time**: Pusher WebSockets

## 🏗️ Architecture
```
dashis/
├── backend/           # Moteurs IA/ML (source de vérité)
│   ├── ai/           # GPT-4 predictions + copilot
│   ├── ml/           # Anomaly detection
│   └── scoring/      # FinSight Score™
└── frontend/         # Symlinks vers src/components/
    ├── FinancialDashboardV2.tsx → ../../../../src/components/
    ├── AICopilot.tsx → ../../../../src/components/
    └── charts/ → ../../../../src/components/charts/
```

**Note**: `src/lib/` contient des symlinks vers `backend/` pour compatibilité Next.js imports.

## 🚀 Statut
✅ **PRODUCTION** - Agent actif, utilisé par le site demo

## 🔗 Interactions
- Utilise `shared/engine/finance.py` pour benchmarks sectoriels
- Appelle API TRESORIS pour consolidation données trésorerie (futur)
