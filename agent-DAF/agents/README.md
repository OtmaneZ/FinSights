# FinSight - Architecture Multi-Agents IA

## 🏗️ Structure Unifiée des 5 Agents

Tous les agents IA de FinSight sont organisés dans ce dossier unique.

### �� Organisation

```
agent-DAF/agents/
├── dashis/          # Agent #1 - Dashboard Intelligence System (TypeScript)
│   └── backend/     # Moteur d'analyse FinancialDashboardV2
│
├── tresoris/        # Agent #2 - Trésorerie & Cash Management (Python)
│   └── backend/     # API Flask + ML forecasting
│
├── margis/          # Agent #3 - Marge & Rentabilité (TypeScript)
│   └── backend/     # À développer
│
├── scoris/          # Agent #4 - Scoring Clients (TypeScript)
│   └── backend/     # À développer
│
└── scenaris/        # Agent #5 - Scénarios & Simulations (TypeScript)
    └── backend/     # À développer
```

## 🔧 Utilisation dans Next.js

### Import depuis le frontend

Tous les agents sont accessibles via l'alias `@agent/` :

```typescript
// Frontend: src/components/DashisAgentUI.tsx
import { DashisAgent } from '@agent/agents/dashis/backend/core/DashisAgent'
import type { DashisState, KPI } from '@agent/agents/dashis/backend/core/types'
```

### Configuration Webpack

L'alias est défini dans `next.config.js` :

```javascript
webpack: (config) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@agent': require('path').resolve(__dirname, 'agent-DAF'),
  };
  return config;
}
```

## 🎯 Principes Architecturaux

### 1. **Backend Autonome**
Chaque agent a son backend indépendant, testable et réutilisable.

### 2. **Frontend Wrapper**
Les UI React wrappent les backends (ex: `DashisAgentUI.tsx` → `DashisAgent.ts`)

### 3. **Séparation des Langages**
- **TypeScript** : Agents frontend/web (DASHIS, MARGIS, SCORIS, SCENARIS)
- **Python** : Agents on-premise/ML intensif (TRESORIS)

### 4. **Types Robustes**
Les agents réutilisent les types du projet (`@/lib/dataModel`)

## 📦 Développement

### Créer un nouvel agent

1. **Créer la structure** :
```bash
mkdir -p agent-DAF/agents/mon-agent/backend/core
```

2. **Créer les fichiers backend** :
- `Agent.ts` - State machine principale
- `Engine.ts` - Logique métier
- `types.ts` - Types TypeScript
- `adapters.ts` - Conversions de données

3. **Créer le wrapper UI** :
```typescript
// src/components/MonAgentUI.tsx
import { MonAgent } from '@agent/agents/mon-agent/backend/core/Agent'
```

4. **Tester** :
```bash
npm run build  # Vérifie que Webpack résout les imports
```

## ✅ Avantages

- ✅ **Clarté** : 5 agents, 1 dossier
- ✅ **Cohérence** : Structure identique pour tous
- ✅ **Scalabilité** : Facile d'ajouter de nouveaux agents
- ✅ **Testabilité** : Backends isolés et testables
- ✅ **Réutilisabilité** : Code backend indépendant du framework

---

**Dernière mise à jour** : 30 janvier 2026
