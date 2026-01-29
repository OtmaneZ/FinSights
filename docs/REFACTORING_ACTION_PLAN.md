# 🎯 PLAN D'ACTION REFACTORING - Étape par Étape

**Date de début** : 29 janvier 2026  
**Durée estimée** : 2-3 semaines (progressif)  
**Stratégie** : Feature-based migration (pas de breaking changes)

---

## 📋 CHECKLIST GLOBALE

- [ ] Phase 1 : Setup architecture (1 jour)
- [ ] Phase 2 : Feature "Demo" (2 jours)
- [ ] Phase 3 : Feature "Upload" (2 jours)
- [ ] Phase 4 : Feature "Dashboard" (3 jours)
- [ ] Phase 5 : Feature "AI Copilot" (2 jours)
- [ ] Phase 6 : Feature "Export" (1 jour)
- [ ] Phase 7 : Shared & Lib (2 jours)
- [ ] Phase 8 : Tests & Docs (2 jours)
- [ ] Phase 9 : Cleanup final (1 jour)

---

## 🚀 PHASE 1 : Setup Architecture (Jour 1)

### Objectif
Créer la structure de dossiers cible sans casser l'existant.

### Actions

#### 1.1 Créer la structure `/features`

```bash
mkdir -p src/features/demo/{components,hooks,services}
mkdir -p src/features/upload/{components,hooks,services}
mkdir -p src/features/dashboard/{components,hooks,services}
mkdir -p src/features/ai-copilot/{components,hooks,services}
mkdir -p src/features/export/{hooks,services}
mkdir -p src/features/charts/components
```

#### 1.2 Créer la structure `/shared`

```bash
mkdir -p src/shared/components/{ui,layout}
mkdir -p src/shared/hooks
mkdir -p src/shared/contexts
mkdir -p src/shared/utils
mkdir -p src/shared/services
```

#### 1.3 Réorganiser `/lib`

```bash
mkdir -p src/lib/types
mkdir -p src/lib/api
mkdir -p src/lib/config
```

#### 1.4 Créer fichiers index.ts (barrel exports)

```bash
touch src/features/demo/index.ts
touch src/features/upload/index.ts
touch src/features/dashboard/index.ts
touch src/features/ai-copilot/index.ts
touch src/features/export/index.ts
touch src/features/charts/index.ts
touch src/shared/index.ts
```

### Checklist Phase 1
- [ ] Structure de dossiers créée
- [ ] Fichiers index.ts créés
- [ ] Aucun import cassé (ancien code fonctionne toujours)

---

## 🎭 PHASE 2 : Feature "Demo" (Jours 2-3)

### Objectif
Extraire toute la logique de chargement des démos.

### 2.1 Créer les types

**Fichier** : `src/features/demo/types.ts`

```typescript
export type DemoScenario = 'hypercroissance' | 'difficulte' | 'saisonnalite';

export interface DemoConfig {
  id: string;
  company: string;
  sector: 'services' | 'commerce' | 'industrie' | 'saas';
  description: string;
  kpis: any; // TODO: typer
  charts: any; // TODO: typer
  anomalies: any[];
  alerts: any[];
  period: { start: string; end: string; months: number };
  dataQuality: { confidence: number; transactionCount: number; clientsCount: number };
}

export interface DemoState {
  loading: boolean;
  progress: number;
  message: string;
  data: DemoConfig | null;
  error: string | null;
}
```

### 2.2 Créer le service

**Fichier** : `src/features/demo/services/demoService.ts`

```typescript
import type { DemoScenario, DemoConfig } from '../types';

export class DemoService {
  private scenarioMap: Record<DemoScenario, { file: string; jsonConfig: string; company: string; sector: string }> = {
    hypercroissance: {
      file: '/demo-scaleup-hypercroissance.csv',
      jsonConfig: '/demo-configs/scaleup-hypercroissance.json',
      company: 'Scale-up Hypercroissance',
      sector: 'saas'
    },
    difficulte: {
      file: '/demo-startup-difficulte.csv',
      jsonConfig: '/demo-configs/startup-difficulte.json',
      company: 'Startup SaaS',
      sector: 'saas'
    },
    saisonnalite: {
      file: '/demo-pme-saisonnalite.csv',
      jsonConfig: '/demo-configs/pme-saisonnalite.json',
      company: 'PME E-commerce Saisonnière',
      sector: 'commerce'
    }
  };

  async load(scenario: DemoScenario): Promise<DemoConfig> {
    const config = this.scenarioMap[scenario];
    if (!config) throw new Error(`Scenario inconnu: ${scenario}`);

    // Charger config JSON pré-calculée
    const response = await fetch(config.jsonConfig);
    if (!response.ok) throw new Error('Config démo introuvable');

    const demoConfig: DemoConfig = await response.json();
    return demoConfig;
  }

  async loadCSV(scenario: DemoScenario): Promise<string> {
    const config = this.scenarioMap[scenario];
    const response = await fetch(config.file);
    return response.text();
  }

  getScenarioInfo(scenario: DemoScenario) {
    return this.scenarioMap[scenario];
  }
}

export const demoService = new DemoService();
```

### 2.3 Créer le hook

**Fichier** : `src/features/demo/hooks/useDemoLoader.ts`

```typescript
import { useState } from 'react';
import { demoService } from '../services/demoService';
import type { DemoState, DemoScenario } from '../types';

const initialState: DemoState = {
  loading: false,
  progress: 0,
  message: '',
  data: null,
  error: null
};

export function useDemoLoader() {
  const [state, setState] = useState<DemoState>(initialState);

  const loadScenario = async (scenario: DemoScenario) => {
    setState({ ...initialState, loading: true, progress: 10 });

    try {
      // Step 1: Chargement config
      setState(prev => ({ ...prev, progress: 30, message: 'Chargement configuration...' }));
      await new Promise(resolve => setTimeout(resolve, 300));

      const config = await demoService.load(scenario);

      // Step 2: Traitement données
      setState(prev => ({ ...prev, progress: 60, message: 'Génération KPIs...' }));
      await new Promise(resolve => setTimeout(resolve, 400));

      // Step 3: Finalisation
      setState(prev => ({ ...prev, progress: 90, message: 'Finalisation...' }));
      await new Promise(resolve => setTimeout(resolve, 200));

      setState({
        loading: false,
        progress: 100,
        message: 'Dashboard prêt !',
        data: config,
        error: null
      });

      return config;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState({
        loading: false,
        progress: 0,
        message: '',
        data: null,
        error: errorMessage
      });
      throw error;
    }
  };

  const reset = () => setState(initialState);

  return {
    state,
    loadScenario,
    reset,
    isLoading: state.loading,
    progress: state.progress,
    error: state.error
  };
}
```

### 2.4 Créer le composant sélecteur

**Fichier** : `src/features/demo/components/DemoScenarioSelector.tsx`

```typescript
'use client';

import { useDemoLoader } from '../hooks/useDemoLoader';
import type { DemoScenario } from '../types';

interface DemoScenarioSelectorProps {
  onDemoLoaded: (config: any) => void;
}

export function DemoScenarioSelector({ onDemoLoaded }: DemoScenarioSelectorProps) {
  const { loadScenario, isLoading, progress, state } = useDemoLoader();

  const handleLoadDemo = async (scenario: DemoScenario) => {
    try {
      const config = await loadScenario(scenario);
      onDemoLoaded(config);
    } catch (error) {
      console.error('Erreur chargement démo:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 border-4 border-accent-primary-border border-t-accent-primary rounded-full animate-spin"></div>
        <div className="text-center w-full max-w-md">
          <h3 className="text-2xl font-bold mb-2">{state.message}</h3>
          <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-accent-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-secondary mt-3">{progress}% complété</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-primary">
          Choisissez un scénario de démonstration
        </h2>
        <p className="text-lg text-secondary max-w-2xl mx-auto">
          3 scénarios réalistes : Scale-up • Startup • PME Saisonnalité
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scale-up */}
        <button
          onClick={() => handleLoadDemo('hypercroissance')}
          className="surface rounded-xl p-6 surface-hover text-left transition-all hover:scale-[1.02]"
        >
          <h4 className="text-xl font-bold mb-2">Scale-up Hypercroissance</h4>
          <p className="text-accent-warning font-semibold mb-4 text-sm">CA +180% mais marge négative</p>
          <div className="text-sm text-secondary space-y-1">
            <p>• 850k€ CA • Marge -8.2%</p>
            <p>• Cash flow: -70k€/mois</p>
            <p>• Sales & Marketing: 53%</p>
          </div>
        </button>

        {/* Startup */}
        <button
          onClick={() => handleLoadDemo('difficulte')}
          className="surface rounded-xl p-6 surface-hover text-left transition-all hover:scale-[1.02]"
        >
          <h4 className="text-xl font-bold mb-2">Startup SaaS</h4>
          <p className="text-accent-warning font-semibold mb-4 text-sm">Difficulté trésorerie</p>
          <div className="text-sm text-secondary space-y-1">
            <p>• 20k€ CA • Marge -135%</p>
            <p>• Cash flow: -27k€</p>
            <p>• Runway critique</p>
          </div>
        </button>

        {/* PME */}
        <button
          onClick={() => handleLoadDemo('saisonnalite')}
          className="surface rounded-xl p-6 surface-hover text-left transition-all hover:scale-[1.02]"
        >
          <h4 className="text-xl font-bold mb-2">PME Saisonnalité</h4>
          <p className="text-accent-primary font-semibold mb-4 text-sm">80% CA en Q4</p>
          <div className="text-sm text-secondary space-y-1">
            <p>• 285k€ CA (+45%) • Marge 7%</p>
            <p>• DSO 8j • BFR contrôlé</p>
            <p>• Cash: -8k€ → +46k€ (Q4)</p>
          </div>
        </button>
      </div>
    </div>
  );
}
```

### 2.5 Créer le barrel export

**Fichier** : `src/features/demo/index.ts`

```typescript
export * from './types';
export * from './hooks/useDemoLoader';
export * from './services/demoService';
export * from './components/DemoScenarioSelector';
```

### 2.6 Migrer dans FinancialDashboardV2

**Avant** (lignes 959-1240 = 280 lignes) :
```typescript
const loadDemoScenario = async (scenario: 'saine' | 'difficulte' | 'croissance') => {
  // ... 280 lignes ...
}
```

**Après** (< 10 lignes) :
```typescript
import { useDemoLoader } from '@/features/demo';

// Dans le composant
const { loadScenario } = useDemoLoader();

const handleDemoLoaded = (config: any) => {
  // Mise à jour state avec config
  setKpis(config.kpis);
  setFinSightData(config);
  // ...
};
```

### Checklist Phase 2
- [ ] Types créés (`demo/types.ts`)
- [ ] Service créé (`demo/services/demoService.ts`)
- [ ] Hook créé (`demo/hooks/useDemoLoader.ts`)
- [ ] Composant créé (`demo/components/DemoScenarioSelector.tsx`)
- [ ] Barrel export créé (`demo/index.ts`)
- [ ] Migration dans `FinancialDashboardV2` effectuée
- [ ] Tests manuels : 3 démos fonctionnent
- [ ] **Gain : -280 lignes dans FinancialDashboardV2** ✅

---

## 📤 PHASE 3 : Feature "Upload" (Jours 4-5)

### Objectif
Extraire la logique d'upload de fichiers.

### 3.1 Créer les types

**Fichier** : `src/features/upload/types.ts`

```typescript
export type UploadStep = 'idle' | 'validating' | 'ai-parsing' | 'processing' | 'done';

export interface UploadState {
  step: UploadStep;
  progress: number;
  fileName: string | null;
  error: string | null;
}

export interface UploadResult {
  success: boolean;
  data?: {
    kpis: any[];
    financialData: any;
    records: any[];
    dashboardConfig: any;
  };
  error?: string;
}
```

### 3.2 Créer le service

**Fichier** : `src/features/upload/services/uploadService.ts`

```typescript
import type { UploadResult } from '../types';

export class UploadService {
  async uploadFile(file: File, companyId?: string): Promise<UploadResult> {
    const fileContent = await this.readFile(file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileContent,
        fileName: file.name,
        fileType: file.type,
        companyId
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erreur upload');
    }

    return result;
  }

  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Erreur lecture fichier'));
      reader.readAsText(file);
    });
  }
}

export const uploadService = new UploadService();
```

### 3.3 Créer le hook

**Fichier** : `src/features/upload/hooks/useFileUpload.ts`

```typescript
import { useState } from 'react';
import { uploadService } from '../services/uploadService';
import type { UploadState, UploadStep } from '../types';

// ... similaire à useDemoLoader ...
```

### Checklist Phase 3
- [ ] Types créés
- [ ] Service créé
- [ ] Hook créé
- [ ] Migration effectuée
- [ ] **Gain : -150 lignes**

---

## 📊 PHASE 4 : Feature "Dashboard" (Jours 6-8)

### Objectif
Découper le God component en sous-composants.

### 4.1 Créer les composants

```
src/features/dashboard/components/
├── DashboardKPIs.tsx        ← Grille de KPIs
├── DashboardCharts.tsx      ← Tous les charts
├── DashboardHeader.tsx      ← Header + actions
└── DashboardContent.tsx     ← Orchestration
```

### 4.2 Créer le hook principal

**Fichier** : `src/features/dashboard/hooks/useDashboardData.ts`

```typescript
export function useDashboardData() {
  // Centralise tout le state management
  // Remplace les 30+ useState dans FinancialDashboardV2
}
```

### Checklist Phase 4
- [ ] DashboardKPIs créé
- [ ] DashboardCharts créé
- [ ] DashboardHeader créé
- [ ] useDashboardData créé
- [ ] **Gain : -800 lignes**

---

## 🤖 PHASE 5-9 : Voir fichier détaillé

*(Trop long pour ce document, voir REFACTORING_PHASES_DETAILLEES.md)*

---

## 📊 SUIVI PROGRESSION

| Phase | Gain lignes | Temps | Status |
|-------|-------------|-------|--------|
| 1. Setup | 0 | 1j | ⬜ À faire |
| 2. Demo | -280 | 2j | ⬜ À faire |
| 3. Upload | -150 | 2j | ⬜ À faire |
| 4. Dashboard | -800 | 3j | ⬜ À faire |
| 5. AI Copilot | -200 | 2j | ⬜ À faire |
| 6. Export | -100 | 1j | ⬜ À faire |
| 7. Shared | -150 | 2j | ⬜ À faire |
| 8. Tests | 0 | 2j | ⬜ À faire |
| 9. Cleanup | -100 | 1j | ⬜ À faire |
| **TOTAL** | **-1780** | **16j** | **0%** |

**Résultat attendu** : `FinancialDashboardV2.tsx` passe de **1954 → 174 lignes** (-91%) 🎯

---

## 🚀 COMMANDES RAPIDES

### Démarrer Phase 1
```bash
# Créer structure
npm run refactor:setup

# Vérifier
tree src/features src/shared -L 2
```

### Démarrer Phase 2
```bash
# Créer fichiers demo
npm run refactor:create-demo-feature
```

### Test après chaque phase
```bash
npm run dev
# Tester manuellement
# Vérifier console (pas d'erreurs)
```

---

**Prêt à démarrer Phase 1 ?** 🚀
