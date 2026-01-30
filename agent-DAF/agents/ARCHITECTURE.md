# 🏗️ FinSight - Architecture Multi-Agents

## 📊 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                      FINSIGHT PLATFORM                          │
│                     (Next.js 14 + React)                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
        ┌───────▼──────┐               ┌───────▼──────┐
        │  Frontend    │               │   Backend    │
        │   (React)    │               │   (Node.js)  │
        │              │               │              │
        │  src/app/    │               │  src/lib/    │
        │  src/components/ │           │  (shared)    │
        └──────┬───────┘               └──────┬───────┘
               │                              │
               │  Imports via @agent/         │
               │                              │
               └──────────┬───────────────────┘
                          │
          ┌───────────────▼────────────────┐
          │    agent-DAF/agents/           │
          │    (5 Agents IA Autonomes)     │
          └────────────────────────────────┘
```

## 🤖 Les 5 Agents

### 1️⃣ **DASHIS** - Dashboard Intelligence System
- **Langage** : TypeScript
- **Rôle** : Analyse financière temps réel
- **Status** : ✅ ACTIF (2266 lignes)
- **Capacités** :
  - 5 KPIs (CA, Charges, Tréso, Marge, DSO)
  - 8 Charts (Evolution, Breakdown, Top Clients...)
  - ML : Détection anomalies
  - AI : Prédictions cash-flow (GPT-4)
  - Scoring : FinSight Score™
- **Frontend** : `src/components/DashisAgentUI.tsx`
- **Backend** : `agent-DAF/agents/dashis/backend/core/`

### 2️⃣ **TRESORIS** - Trésorerie & Cash Management
- **Langage** : Python (Flask API)
- **Rôle** : Prévision trésorerie avancée
- **Status** : ✅ ACTIF (API on-premise)
- **Capacités** :
  - Forecasting ML multi-scénarios
  - Early warning system
  - Payment patterns analysis
  - Client scoring
- **API** : `agent-DAF/agents/tresoris/backend/main.py`
- **Port** : 5001

### 3️⃣ **MARGIS** - Analyse de Marge
- **Langage** : TypeScript
- **Rôle** : Optimisation rentabilité
- **Status** : 🔜 À DÉVELOPPER
- **Capacités prévues** :
  - Analyse marge par produit/service
  - Recommandations pricing
  - Détection fuites de marge
- **Structure** : `agent-DAF/agents/margis/backend/core/`

### 4️⃣ **SCORIS** - Scoring Clients
- **Langage** : TypeScript
- **Rôle** : Évaluation risque client
- **Status** : 🔜 À DÉVELOPPER
- **Capacités prévues** :
  - Score de solvabilité
  - Historique paiement
  - Alertes risque
- **Structure** : `agent-DAF/agents/scoris/backend/core/`

### 5️⃣ **SCENARIS** - Scénarios & Simulations
- **Langage** : TypeScript
- **Rôle** : What-If planning
- **Status** : 🔜 À DÉVELOPPER
- **Capacités prévues** :
  - Simulations financières
  - Stress tests
  - Planification stratégique
- **Structure** : `agent-DAF/agents/scenaris/backend/core/`

## 🔌 Architecture Technique

### Import Flow

```typescript
// 1. Frontend importe depuis agent-DAF via @agent/
// src/components/DashisAgentUI.tsx
import { DashisAgent } from '@agent/agents/dashis/backend/core/DashisAgent'

// 2. Backend agent importe types projet via @/
// agent-DAF/agents/dashis/backend/core/types.ts
import type { FinancialRecord } from '@/lib/dataModel'

// 3. UI wrapper utilise librairies Next.js normalement
// src/components/DashisAgentUI.tsx
import { useSession } from 'next-auth/react'
```

### Configuration Webpack

```javascript
// next.config.js
webpack: (config) => {
  config.resolve.alias = {
    '@': path.resolve(__dirname, 'src'),      // Alias projet
    '@agent': path.resolve(__dirname, 'agent-DAF'), // Alias agents
  };
  return config;
}
```

## 📁 Structure Fichiers (Pattern)

Chaque agent TypeScript suit ce pattern :

```
agent-DAF/agents/[nom-agent]/
├── README.md                  # Documentation agent
├── spec.md                    # Spécifications
└── backend/
    └── core/
        ├── Agent.ts           # State machine principale
        ├── Engine.ts          # Logique métier / calculs
        ├── types.ts           # Types TypeScript
        ├── adapters.ts        # Conversions données
        └── uiAdapters.ts      # Conversions pour UI
```

## �� Principes Architecturaux

### ✅ Séparation Backend/Frontend
- **Backend** : Logique métier pure (agent-DAF/)
- **Frontend** : UI React wrapper (src/components/)
- **Communication** : Imports TypeScript directs

### ✅ Autonomie des Agents
- Chaque agent = module indépendant
- Testable unitairement
- Réutilisable hors Next.js

### ✅ Type Safety
- Réutilisation types projet (`@/lib/dataModel`)
- Adapters pour conversions propres
- Zero `any` types

### ✅ Multi-Language
- TypeScript pour agents web/frontend
- Python pour agents ML intensif/on-premise

## 🚀 Workflow Développement

### Créer un nouvel agent

```bash
# 1. Structure
mkdir -p agent-DAF/agents/mon-agent/backend/core

# 2. Créer Agent.ts
cat > agent-DAF/agents/mon-agent/backend/core/Agent.ts << 'EOF'
export class MonAgent {
  // State machine
}
