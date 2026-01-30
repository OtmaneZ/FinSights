# 📂 Structure du Projet FinSights

**Date** : 30 janvier 2026  
**Status** : Post-refactorisation (5 Agents IA Autonomes)

---

## 🎯 Architecture Globale

```
finsights/
│
├── README.md                         ← Documentation principale
│
├── src/                              ← SITE WEB (Next.js 14)
│   ├── app/                          ← Pages & routing
│   │   ├── page.tsx                  ← Landing page
│   │   ├── agents/                   ← Pages présentation agents
│   │   └── dashboard/                ← Page dashboard utilisateur
│   │
│   ├── components/                   ← Composants UI généraux (+ DASHIS frontend)
│   │   ├── FinancialDashboardV2.tsx  ← Hub DASHIS (1954 lignes)
│   │   ├── AICopilot.tsx             ← Chat GPT-4
│   │   └── charts/                   ← 8 composants de visualisation
│   │
│   └── lib/                          ← Utils généraux site web
│       ├── ml/      → symlink vers agent-DAF/agents/dashis/backend/ml/
│       ├── ai/      → symlink vers agent-DAF/agents/dashis/backend/ai/
│       └── scoring/ → symlink vers agent-DAF/agents/dashis/backend/scoring/
│
├── agent-DAF/                        ← 5 AGENTS IA + SHARED
│   │
│   ├── shared/                       ← MODULES COMMUNS
│   │   ├── engine/                   ← Calculs financiers de base
│   │   │   └── finance.py
│   │   ├── llm/                      ← Intégration Claude/GPT
│   │   └── utils/                    ← Helpers communs
│   │
│   ├── agents/                       ← 5 AGENTS IA AUTONOMES
│   │   │
│   │   ├── tresoris/                 ← AGENT #1 - Trésorerie
│   │   │   ├── README.md
│   │   │   ├── spec.md
│   │   │   └── backend/              ← Backend Python TRESORIS
│   │   │       ├── agent/
│   │   │       │   ├── risk_agent.py (1397 lignes)
│   │   │       │   └── memory_v2.py
│   │   │       ├── engine/           ← 6 moteurs ML spécifiques
│   │   │       │   ├── payment_patterns.py
│   │   │       │   ├── smart_forecast.py
│   │   │       │   ├── client_scoring.py
│   │   │       │   ├── early_warning.py
│   │   │       │   ├── action_optimizer.py
│   │   │       │   └── seasonality.py
│   │   │       ├── main.py
│   │   │       ├── requirements.txt
│   │   │       └── tests/
│   │   │
│   │   ├── margis/                   ← AGENT #2 - Marges
│   │   │   ├── README.md
│   │   │   ├── spec.md
│   │   │   └── backend/              ← Structure prête (vide)
│   │   │       ├── agent/
│   │   │       └── engine/
│   │   │
│   │   ├── scoris/                   ← AGENT #3 - Scoring Clients
│   │   │   ├── README.md
│   │   │   ├── spec.md
│   │   │   └── backend/              ← Structure prête (vide)
│   │   │       ├── agent/
│   │   │       └── engine/
│   │   │
│   │   ├── scenaris/                 ← AGENT #4 - Scénarios
│   │   │   ├── README.md
│   │   │   ├── spec.md
│   │   │   └── backend/              ← Structure prête (vide)
│   │   │       ├── agent/
│   │   │       └── engine/
│   │   │
│   │   └── dashis/                   ← AGENT #5 - Dashboard Intelligence System
│   │       ├── README.md
│   │       ├── backend/              ← Moteurs IA/ML (source de vérité)
│   │       │   ├── ai/               ← GPT-4 prédictions + copilot
│   │       │   │   ├── predictions.ts
│   │       │   │   ├── patterns.ts
│   │       │   │   └── copilot.ts
│   │       │   ├── ml/               ← Anomaly detection (TensorFlow.js)
│   │       │   │   ├── anomalyDetector.ts
│   │       │   │   └── types.ts
│   │       │   └── scoring/          ← FinSight Score™
│   │       │       └── finSightScore.ts
│   │       │
│   │       └── frontend/             ← Symlinks vers src/components/
│   │           ├── FinancialDashboardV2.tsx → ../../../../src/components/
│   │           ├── AICopilot.tsx → ../../../../src/components/
│   │           └── charts/ → ../../../../src/components/charts/
│   │
│   ├── README.md                     ← Doc générale agents
│   ├── STRUCTURE.md                  ← Ce fichier
│   ├── VISION_2026.md                ← Roadmap Q1-Q4 2026
│   └── 4-agents-ia-finance.md        ← Stratégie produit
│
├── docs/                             ← Documentation technique (6 fichiers)
│   ├── API_V1.md
│   ├── AUTH_SETUP.md
│   └── [4 autres fichiers]
│
├── prisma/                           ← Database schema
├── public/                           ← Assets statiques
└── [config files]
```

---

## 🤖 LES 5 AGENTS IA

### 1️⃣ TRESORIS - Agent Trésorerie (Backend Python)
**Localisation** : `agent-DAF/agents/tresoris/backend/`  
**Status** : ✅ V1 Opérationnel (37% de l'idéal)  
**Type** : Agent autonome 24/7

**Architecture** :
```
MONITOR → TRIGGER → REQUALIFY → PROPOSE → STOP
26 situations → 2-5 vrais risques
```

**6 Engines ML** :
- payment_patterns.py
- smart_forecast.py
- client_scoring.py
- early_warning.py
- action_optimizer.py
- seasonality.py

**Tech** : Python 3.10+, FastAPI, pandas, scikit-learn, Claude 3.5

---

### 2️⃣ MARGIS - Agent Marges (Backend Python)
**Localisation** : `agent-DAF/agents/margis/backend/`  
**Status** : 📋 Spec complète, backend prêt (vide)  
**Objectif** : Analyse marges cachées par produit/client

---

### 3️⃣ SCORIS - Agent Scoring Clients (Backend Python)
**Localisation** : `agent-DAF/agents/scoris/backend/`  
**Status** : 📋 Spec complète, backend prêt (vide)  
**Objectif** : Scoring clients pour anticiper impayés

---

### 4️⃣ SCENARIS - Agent Scénarios (Backend Python)
**Localisation** : `agent-DAF/agents/scenaris/backend/`  
**Status** : 📋 Spec complète, backend prêt (vide)  
**Objectif** : Simulations scénarios stratégiques

---

### 5️⃣ DASHIS - Dashboard Intelligence System (Hybride Frontend/Backend)
**Localisation** : `agent-DAF/agents/dashis/`  
**Status** : ✅ V1 PRODUCTION  
**Type** : Agent IA hybride (Frontend React + Backend TypeScript)

**Architecture** :
- `backend/` : Moteurs IA/ML (source de vérité)
  - `ai/` : GPT-4 prédictions + copilot
  - `ml/` : Anomaly detection (TensorFlow.js)
  - `scoring/` : FinSight Score™
- `frontend/` : Symlinks vers `src/components/`

**Capacités IA Backend** :
- ML Anomaly Detection (détection patterns suspects)
- AI Cash Flow Predictions (forecasting 3-6 mois GPT-4)
- AI Advanced Patterns (comportements clients)
- Score FinSight™ (santé financière 0-100)
- AI Copilot (chat GPT-4 requêtes naturelles)

**Capacités Frontend** :
- Dashboard orchestrateur (FinancialDashboardV2.tsx, 1954 lignes)
- 8 composants visualisation (Recharts + D3.js)
- Simulations What-If temps réel
- Métriques SaaS (MRR, Churn, LTV/CAC)

**Tech** : Next.js 14, React, TypeScript, GPT-4, TensorFlow.js

**Note** : Code frontend dans `src/components/` (utilisé par Next.js), backend dans `agent-DAF/agents/dashis/backend/` (source unique via symlinks).

---

## 📊 TABLEAU COMPARATIF

| Agent | Type | Tech | Status | Mode |
|-------|------|------|--------|------|
| **TRESORIS** | Backend | Python + Claude | ✅ V1 PROD | Autonome 24/7 |
| **MARGIS** | Backend | Python | 📋 Spec | Autonome |
| **SCORIS** | Backend | Python | 📋 Spec | Autonome |
| **SCENARIS** | Backend | Python | 📋 Spec | Autonome |
| **DASHIS** | Hybride | TypeScript + GPT-4 | ✅ V1 PROD | Manuel (user) |

---

## 🔗 MODULES PARTAGÉS

**`shared/`** contient les modules communs à tous les agents :
- `engine/finance.py` : Calculs financiers de base (KPIs, ratios)
- `llm/` : Intégration Claude/GPT (futur)
- `utils/` : Helpers communs

**Avantage** : Évite duplication code, facilite maintenance

---

## 📊 Métriques Code

| Composant | Lignes Code | Status |
|-----------|-------------|--------|
| Site web Next.js | ~15K TS | ✅ Opérationnel |
| TRESORIS Backend | ~8K Python | ✅ V1 PROD |
| DASHIS (Backend + Frontend) | ~2K TS | ✅ V1 PROD |
| MARGIS/SCORIS/SCENARIS | 0 | 📋 Structure prête |
| Shared | ~500 Python | ✅ Commun |
| **TOTAL** | **~25K lignes** | **40% fonctionnel** |

---

## 🎯 PRINCIPES ARCHITECTURE

### Autonomie des Agents
✅ Chaque agent a son propre dossier `backend/`  
✅ Chaque agent peut fonctionner indépendamment  
✅ Code commun centralisé dans `shared/`

### Séparation Frontend/Backend
✅ Agents backend (TRESORIS, MARGIS, SCORIS, SCENARIS) : Python  
✅ Agent hybride (DASHIS) : Backend TypeScript/Node.js + Frontend React  
✅ Communication future : API REST + WebSocket

### Architecture Hybride DASHIS
✅ Backend dans `agent-DAF/agents/dashis/backend/` (moteurs IA/ML)  
✅ Frontend dans `src/components/` (symlinks depuis `dashis/frontend/`)  
✅ Imports Next.js via symlinks `src/lib/` → `dashis/backend/`  
✅ Zero duplication, source unique de vérité

### Scalabilité
✅ Ajout nouveau agent = nouveau dossier `agents/[nom]/`  
✅ Structure standardisée `backend/agent/` + `backend/engine/`  
✅ Tests isolés par agent

---

## 📚 Documentation

**Essentiels** :
- `/README.md` - Vue d'ensemble projet
- `/agent-DAF/README.md` - Agents IA
- `/agent-DAF/STRUCTURE.md` - Ce fichier
- `/agent-DAF/VISION_2026.md` - Roadmap

**Par Agent** :
- `/agent-DAF/agents/tresoris/README.md`
- `/agent-DAF/agents/margis/README.md`
- `/agent-DAF/agents/scoris/README.md`
- `/agent-DAF/agents/scenaris/README.md`
- `/agent-DAF/agents/dashis/README.md`

**Specs Techniques** :
- `/agent-DAF/agents/[nom]/spec.md` (pour chaque agent)

---

**Dernière maj** : 30 janvier 2026 (post-refactorisation 5 agents)

---

## 🎯 Architecture Globale

```
finsights/
│
├── README.md                         ← Documentation principale
│
├── src/                              ← SITE WEB (Next.js 14)
│   ├── app/                          ← Pages & routing
│   │   ├── page.tsx                  ← Landing page
│   │   ├── agents/                   ← Pages présentation agents
│   │   │   ├── page.tsx              ← Liste 4 agents IA
│   │   │   └── tresoris/page.tsx     ← Page TRESORIS
│   │   └── dashboard/                ← Dashboard utilisateur
│   │       └── page.tsx              ← Financial Dashboard V2
│   │
│   ├── components/
│   │   ├── FinancialDashboardV2.tsx  ← Orchestrateur principal (1954 lignes)
│   │   │
│   │   ├── financial-dashboard/      ← MODULE DASHBOARD V2
│   │   │   ├── README.md             ← Doc module
│   │   │   ├── sections/             ← Composants UI
│   │   │   │   ├── KPIsSection.tsx
│   │   │   │   ├── ChartsSection.tsx
│   │   │   │   ├── SimulationPanel.tsx
│   │   │   │   └── PredictionsPanel.tsx
│   │   │   ├── hooks/                ← Hooks métier
│   │   │   │   ├── useDashboardState.ts
│   │   │   │   ├── useFileProcessing.ts
│   │   │   │   └── useDataCalculations.ts
│   │   │   └── utils/                ← Utils pures
│   │   │       ├── kpiCalculators.ts
│   │   │       └── chartDataPreparers.ts
│   │   │
│   │   ├── charts/                   ← 8 graphiques financiers
│   │   │   ├── CashFlowEvolutionChart.tsx
│   │   │   ├── ExpenseBreakdownChart.tsx
│   │   │   ├── MarginEvolutionChart.tsx
│   │   │   ├── TopClientsVerticalChart.tsx
│   │   │   ├── OutstandingInvoicesChart.tsx
│   │   │   ├── PaymentStatusChart.tsx
│   │   │   ├── SankeyFlowChart.tsx   ← D3.js
│   │   │   └── SunburstExpensesChart.tsx ← D3.js
│   │   │
│   │   └── [autres composants UI]    ← AICopilot, AlertsPanel, etc.
│   │
│   └── lib/                          ← Utils, parsing, ML, scoring
│       ├── dataParser.ts             ← Parsing CSV/Excel
│       ├── ml/                       ← ML Anomaly Detection
│       ├── ai/                       ← AI Predictions & Patterns
│       └── scoring/                  ← Score FinSight™
│
├── agent-DAF/                        ← BACKEND AGENTS IA (Python)
│   │
│   ├── backend/                      ← Code Python FastAPI
│   │   │
│   │   ├── agent/                    ← TRESORIS AGENT (Opérationnel)
│   │   │   ├── risk_agent.py         ← 1397 lignes - Agent principal
│   │   │   └── memory_v2.py          ← Mémoire persistante
│   │   │
│   │   ├── engine/                   ← 6 MOTEURS ML TRESORIS
│   │   │   ├── payment_patterns.py   ← Analyse paiements clients
│   │   │   ├── smart_forecast.py     ← Prévisions tréso 4-13 sem
│   │   │   ├── client_scoring.py     ← Scoring risque clients
│   │   │   ├── early_warning.py      ← Alertes précoces tensions
│   │   │   ├── action_optimizer.py   ← Priorisation P1/P2/P3
│   │   │   └── seasonality.py        ← Détection saisonnalité
│   │   │
│   │   ├── main.py                   ← API FastAPI
│   │   ├── requirements.txt          ← Dépendances Python
│   │   └── [autres modules]
│   │
│   ├── agents/                       ← SPECS DES 4 AGENTS
│   │   ├── tresoris/                 ← Agent #1 (PROD)
│   │   │   ├── README.md
│   │   │   └── spec.md
│   │   ├── margis/                   ← Agent #2 (spec only)
│   │   │   ├── README.md
│   │   │   └── spec.md
│   │   ├── scoris/                   ← Agent #3 (spec only)
│   │   │   ├── README.md
│   │   │   └── spec.md
│   │   └── scenaris/                 ← Agent #4 (spec only)
│   │       ├── README.md
│   │       └── spec.md
│   │
│   ├── README.md                     ← Doc générale agents
│   ├── STRUCTURE.md                  ← Ce fichier
│   ├── VISION_2026.md                ← Roadmap Q1-Q4 2026
│   └── 4-agents-ia-finance.md        ← Stratégie produit
│
├── docs/                             ← Documentation technique (6 fichiers)
│   ├── API_V1.md
│   ├── API_PROTECTION.md
│   ├── API_V1_SDK.md
│   ├── AUTH_SETUP.md
│   ├── DESIGN.md
│   └── SEO_ANALYTICS_GUIDE.md
│
├── prisma/                           ← Database schema
├── public/                           ← Assets statiques
└── [config files]                    ← next.config.js, tsconfig.json, etc.
```

---

## 🤖 CLARTÉ PAR COMPOSANT

### 1️⃣ Financial Dashboard V2 (Frontend React)
**Localisation** : `src/components/`  
**Type** : Module autonome d'analyse financière  
**Lignes** : ~2000 (à refactoriser → ~300)

**Responsabilités** :
- Upload CSV/Excel
- Calcul 15+ KPIs
- Affichage 8 graphiques
- ML Anomaly Detection
- Simulations What-If
- Export PDF/Excel

**Tech** : React, TypeScript, Recharts, D3.js, GPT-4

---

### 2️⃣ TRESORIS Agent (Backend Python)
**Localisation** : `agent-DAF/backend/`  
**Type** : Agent IA autonome surveillance trésorerie  
**Lignes** : ~8000 Python

**Architecture** :
```
MONITOR → TRIGGER → REQUALIFY → PROPOSE → STOP
```

**6 Engines ML** :
1. `payment_patterns.py` → Analyse patterns paiements
2. `smart_forecast.py` → Prévisions 4-13 semaines
3. `client_scoring.py` → Scoring risque clients
4. `early_warning.py` → Alertes précoces
5. `action_optimizer.py` → Priorisation actions
6. `seasonality.py` → Détection saisonnalité

**Tech** : Python 3.10+, FastAPI, pandas, scikit-learn, Claude 3.5

---

### 3️⃣ MARGIS Agent (Spec only)
**Localisation** : `agent-DAF/agents/margis/`  
**Status** : 📋 Spec complète, aucun code  
**Objectif** : Analyse marges cachées par produit/client

---

### 4️⃣ SCORIS Agent (Spec only)
**Localisation** : `agent-DAF/agents/scoris/`  
**Status** : 📋 Spec complète, aucun code  
**Objectif** : Scoring clients pour anticiper impayés

---

### 5️⃣ SCENARIS Agent (Spec only)
**Localisation** : `agent-DAF/agents/scenaris/`  
**Status** : 📋 Spec complète, aucun code  
**Objectif** : Simulations scénarios stratégiques

---

## ⚠️ DISTINCTION IMPORTANTE

### Dashboard V2 ≠ TRESORIS

| Critère | Dashboard V2 | TRESORIS Agent |
|---------|--------------|----------------|
| **Type** | Frontend React | Backend Python |
| **Fonction** | Analyse manuelle CSV | Surveillance auto 24/7 |
| **Déclenchement** | Par utilisateur | Autonome (cron) |
| **Données** | Upload fichier | Connexion API (future) |
| **Output** | Visualisations UI | Actions prioritaires |
| **IA** | GPT-4 Copilot | Claude 3.5 Sonnet |
| **Status** | ✅ Opérationnel | ✅ V1 opérationnel (37%) |

### Intégration Future

Dashboard V2 et TRESORIS seront connectés via :
- ✅ Base PostgreSQL unifiée
- ✅ API REST endpoints
- ✅ WebSocket real-time
- ✅ Pusher notifications

**Status actuel** : Non connectés (fonctionnent indépendamment)

---

## 📊 Métriques Code

| Composant | Lignes Code | Status |
|-----------|-------------|--------|
| Site web Next.js | ~15K TS | ✅ Opérationnel |
| Dashboard V2 | ~2K TS | ⚠️ À refactoriser |
| TRESORIS Backend | ~8K Python | ✅ V1 PROD |
| MARGIS/SCORIS/SCENARIS | 0 | 📋 Specs seulement |
| **TOTAL** | **~25K lignes** | **60% fonctionnel** |

---

## 📚 Documentation

**Essentiels** :
- `/README.md` - Vue d'ensemble projet
- `/agent-DAF/README.md` - Agents IA
- `/agent-DAF/STRUCTURE.md` - Ce fichier
- `/agent-DAF/VISION_2026.md` - Roadmap
- `/src/components/financial-dashboard/README.md` - Module Dashboard

**Technique** :
- `/docs/API_V1.md` - API REST
- `/docs/AUTH_SETUP.md` - NextAuth
- `/docs/DESIGN.md` - Design system

**Specs Agents** :
- `/agent-DAF/agents/tresoris/spec.md`
- `/agent-DAF/agents/margis/spec.md`
- `/agent-DAF/agents/scoris/spec.md`
- `/agent-DAF/agents/scenaris/spec.md`

---

**Dernière maj** : 30 janvier 2026 (post-nettoyage massif)
│   │   └── claude.py
│   ├── storage/
│   │   ├── memory/
│   │   └── memory_v2/
│   └── tests/
│
├── 📂 frontend-bpi/                     # Frontend Next.js partagée
│   ├── package.json
│   ├── src/
│   │   ├── pages/
│   │   │   ├── tresoris/                # Dashboard TRESORIS
│   │   │   ├── margis/                  # Dashboard MARGIS (future)
│   │   │   ├── scoris/                  # Dashboard SCORIS (future)
│   │   │   └── scenaris/                # Dashboard SCENARIS (future)
│   │   └── components/
│   └── ...
│
├── 📂 tresoris-presentation/            # Landing page TRESORIS (public)
│   ├── index.html
│   ├── indicateurs-financiers.html
│   └── ...
│
├── 📂 tresoris-dashboard/               # 🚀 Frontend Next.js déployé
│   ├── (miroir frontend-bpi)
│   └── ...
│
├── 📂 audit-demo/                       # Demo/tests
│   └── index.html
│
└── 📂 _archive/                         # Ancien contenu
    ├── 5-agents-ia-finance.md           # Version antérieure (5 agents)
    ├── moi.md
    ├── AUDIT_FRONTEND.md
    └── backend_v1/

```

---

## 🎯 Guide par rôle

### 👨‍💼 **Product Owner / CEO**

Fichier de référence : **`4-agents-ia-finance.md`**
- Vue d'ensemble 4 agents
- Stratégie produit et business
- Roadmap et priorités
- Modèle commercial

### 👨‍💻 **Dev Backend**

Dossiers :
- `/backend/agent/` → Ajouter `margin_agent.py`, `client_agent.py`, `scenario_agent.py`
- `/backend/engine/` → Étendre calculs financiers

Specs :
- `agents/margis/spec.md` → Détails implémentation MARGIS
- `agents/scoris/spec.md` → Détails implémentation SCORIS
- `agents/scenaris/spec.md` → Détails implémentation SCENARIS

### 👨‍🎨 **Dev Frontend**

Dossiers :
- `/frontend-bpi/src/pages/` → Créer `margis/`, `scoris/`, `scenaris/`
- `/frontend-bpi/src/components/` → Réutiliser composants TRESORIS

Specs :
- Voir chaque `agents/[agent]/spec.md` → UI/UX requirements

### 📊 **Data Scientist (SCORIS)**

Fichier : `agents/scoris/spec.md`
- Modèle ML XGBoost
- Feature engineering
- Évaluation (Recall > 90% des vrais impayés)

### 🎓 **Documentaliste / Content**

Dossiers :
- `/docs/` → Ajouter cas d'usage concrets, guides utilisateurs
- `/agents/[agent]/examples/` → Exemples détaillés

---

## ✅ Checklists de lancement

### Avant de lancer MARGIS (P1)

- [ ] Finir `agents/margis/spec.md` → détails calcul coûts
- [ ] Créer `backend/agent/margin_agent.py`
- [ ] Créer `/frontend-bpi/src/pages/margis/`
- [ ] Ajouter routes API MARGIS
- [ ] Tests unitaires calcul marge
- [ ] Design dashboard rentabilité
- [ ] Tester avec 2 clients pilotes

### Avant de lancer SCORIS (P2)

- [ ] Collecter données training (24 mois min)
- [ ] Finir spec ML (`agents/scoris/spec.md`)
- [ ] Entraîner modèle XGBoost
- [ ] Validation prédictions
- [ ] Créer `backend/agent/client_agent.py`
- [ ] Créer `/frontend-bpi/src/pages/scoris/`
- [ ] Tests avec vrais données client

### Avant de lancer SCENARIS (P3)

- [ ] Finir modèle financier (`agents/scenaris/spec.md`)
- [ ] Créer templates scénarios
- [ ] Créer `backend/agent/scenario_agent.py`
- [ ] UX/UI comparaison visuelle
- [ ] Tests sensibilité variables

---

## 🚀 Commandes de développement

### Démarrer le backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Démarrer le frontend

```bash
cd frontend-bpi
npm install
npm run dev
```

### Lancer les tests

```bash
cd backend
pytest tests/
```

---

## 📚 Ressources clés

- **Stratégie** : `4-agents-ia-finance.md`
- **TRESORIS** : `agents/tresoris/spec.md` + `/backend/agent/risk_agent.py`
- **MARGIS** : `agents/margis/spec.md`
- **SCORIS** : `agents/scoris/spec.md`
- **SCENARIS** : `agents/scenaris/spec.md`
- **Perso** : `docs/presentation-otmane.md`

---

**Dernière mise à jour : 23 janvier 2026**  
**Créé par : Otmane Boulahia**
