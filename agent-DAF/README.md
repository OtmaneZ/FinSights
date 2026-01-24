# agent-DAF — Écosystème d'Agents IA Financiers

> **4 agents IA hyper-spécialisés pour DAF/CEO**
>
> - ✅ **TRESORIS V2** (Production - ✨ NOUVEAU) — Cash & Risque Trésorerie Prédictif
> - 📋 **MARGIS** (Backlog P1) — Vérité sur la Rentabilité
> - 📋 **SCORIS** (Backlog P2) — Risque Clients & Impayés
> - 📋 **SCENARIS** (Backlog P3) — Décisions Sous Incertitude

Chaque agent exécute **seul** un cycle autonome, produit des livrables chiffrés, et s'arrête avant la décision (100% du pouvoir chez le DAF/CEO).

---

## 🚀 TRESORIS V2 - Validation Complète ✅

**Version 2.0 lancée le 24/01/2026** avec **100% de validation** :

| Métrique | Objectif | Résultat | Statut |
|----------|----------|----------|--------|
| **Précision détection** | ≥85% | **100%** | ✅ |
| **Détection précoce** | ≥80% (>15j avance) | **100%** | ✅ |
| **Taux faux positifs** | ≤15% | **0%** | ✅ |
| **Pertinence actions** | ≥90% | **100%** | ✅ |

### 📚 Documentation V2
- **[Guide Utilisation](backend/GUIDE_UTILISATION.md)** - Démarrage rapide + cas d'usage
- **[Documentation Technique](backend/engine/README.md)** - API des 6 engines
- **[Architecture V2](backend/ARCHITECTURE_V2.md)** - Diagrammes système

### 🎯 Nouveautés V2
```
✨ 6 Engines Spécialisés:
  1. Payment Patterns - Analyse comportementale clients
  2. Client Scoring - Rating A/B/C/D + score 0-100
  3. Smart Forecast - Prévisions paiement avec confiance
  4. Early Warning - Signaux faibles 15-60j d'avance
  5. Action Optimizer - Priorisation impact×facilité
  6. Seasonality - Ajustements saisonniers

✅ Production-Ready:
  • 2500+ lignes de code moteurs
  • 529 lignes tests validation
  • 100% métriques validées
  • Seuils calibrés empiriquement
```

---

## 🎯 Commencer

### 🔥 NOUVEAU : Où tu en es vraiment ?
→ **`OU_TU_EN_ES.md`** (lecture 10 min) ⭐ LIS ÇA EN PREMIER
- 📊 Score actuel : **42% "Prêt à Vendre"** (Backend 75%, Packaging client 25%)
- 🔴 Les 4 bloquants vente (Landing, Deploy, Import, Emails)
- 🚀 Roadmap 4-6 semaines pour être vendable
- 💰 Budget réaliste : 100€/mois

### 🆕 Solo Dev qui veut vendre TRESORIS ?
→ **`PRIORITES_SOLO_DEV.md`** (lecture 10 min)
- 🎯 Les 3 vraies priorités (pas 50)
- ✅ Ce qui suffit pour vendre aux PME
- 💰 Roadmap réaliste 12 mois (bootstrap)
- ❌ Ce qu'il faut IGNORER pour l'instant

### 📚 Analyses détaillées (si tu veux tout comprendre)
- **`GAP_ANALYSIS.md`** (5 min) - Vue d'ensemble
- **`ANALYSE_ETAT_VS_IDEAL.md`** (50 pages) - Analyse complète
  ⚠️ Utile si tu veux lever des fonds ou recruter une équipe
  
### 📖 Documentation générale
1. **`GETTING_STARTED.md`** (5 min overview)
2. **`4-agents-ia-finance.md`** (stratégie produit)
3. **`STRUCTURE.md`** (organisation du projet)

### 👨‍💼 Product Owner ?
→ **`4-agents-ia-finance.md`** (vision, roadmap, business model)

### 👨‍💻 Dev ?
→ **`STRUCTURE.md`** (où coder quoi) + **`agents/[agent]/spec.md`** (détails techniques)

---

## ✨ Fonctionnalités par agent

### 🧠 TRESORIS — Cash & Risque (✅ Production)

### ✅ Ce que fait l'Agent
- **Se déclenche sans prompt** - Exécution autonome du workflow complet
- **Calculs déterministes** - Tous les chiffres sont recalculables à la main
- **IA pour expliquer** - Claude génère les explications, jamais les chiffres
- **STOP avant décision** - L'agent propose, le DAF décide

### 📊 Livrables produits
1. **Position de trésorerie** - Solde actuel, encours, runway
2. **Prévisions 4/8/13 semaines** - Projections pondérées par probabilité
3. **Risques détectés** - Scorés et priorisés automatiquement
4. **Note Direction Générale** - Synthèse professionnelle en Markdown
5. **Plan d'actions priorisé** - Actions concrètes avec deadlines

### 🔄 Interactions possibles
- Approfondir un risque spécifique
- Comparer des scénarios de stress
- Régénérer les recommandations

---

## 🚀 Démarrage rapide

### Prérequis
- Python 3.10+
- Node.js 18+
- Clé API OpenRouter (dans `.env`)

### Installation

```bash
# 1. Cloner le repo
cd agent-DAF

# 2. Backend - Installer les dépendances
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Frontend - Installer les dépendances
cd ../frontend
npm install

# 4. Configurer l'environnement
# Vérifier que .env contient:
# OPENROUTER_API_KEY=sk-or-v1-...
# LLM_MODEL=anthropic/claude-3.5-sonnet
```

### Lancement

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Ouvrir **http://localhost:5173** dans le navigateur.

---

## 📁 Structure du projet

```
agent-DAF/
├── .env                    # Clés API (NE PAS COMMIT)
├── README.md
│
├── data/                   # Données sources
│   ├── bank_transactions.csv
│   ├── customer_invoices.csv
│   ├── supplier_invoices.csv
│   ├── payment_schedule.csv
│   └── rules.yaml          # Règles métier configurables
│
├── backend/                # FastAPI + Agent
│   ├── main.py             # API principale
│   ├── requirements.txt
│   ├── agent/
│   │   ├── __init__.py
│   │   └── runner.py       # Orchestrateur agent
│   ├── engine/
│   │   ├── __init__.py
│   │   └── finance.py      # Calculs déterministes
│   └── llm/
│       ├── __init__.py
│       └── claude.py       # Intégration Claude/OpenRouter
│
└── frontend/               # React + Vite
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        └── components/
            ├── Timeline.jsx
            ├── TreasuryCard.jsx
            ├── RisksCard.jsx
            ├── DGNoteCard.jsx
            ├── ActionsCard.jsx
            └── InteractionPanel.jsx
```

---

## 🎬 Démo BPI (5 minutes)

### Scénario recommandé

1. **Intro (30s)**
   - "Agent IA DAF autonome - pas un chatbot"
   - Montrer l'interface au repos

2. **Démarrage agent (2min)**
   - Cliquer "Démarrer l'analyse"
   - Montrer la timeline qui s'anime en temps réel
   - Pointer les logs qui apparaissent

3. **Livrables (1min30)**
   - Position de trésorerie avec statut
   - Prévisions 4/8/13 semaines
   - Liste des risques (filtrer par catégorie)
   - Note DG générée par IA

4. **Interaction (1min)**
   - Cliquer sur un risque critique → Analyse approfondie
   - "Comparer scénarios" → Stress test

5. **Conclusion**
   - "L'agent propose, le DAF décide"
   - STOP visible = gouvernance humaine

### Tips pour OBS
- Résolution 1920x1080
- Zoom navigateur 100%
- Désactiver les notifications
- Préparer un script écrit

---

## 🔧 Configuration

### Règles métier (`data/rules.yaml`)

```yaml
treasury:
  absolute_minimum: 500000    # Seuil critique
  comfort_level: 2000000      # Niveau confortable

clients:
  late_payment_days: 45       # Retard standard
  critical_late_days: 90      # Retard critique
  max_client_concentration: 25  # % max un client
```

### Variables d'environnement (`.env`)

```env
OPENROUTER_API_KEY=sk-or-v1-...
LLM_MODEL=anthropic/claude-3.5-sonnet
```

---

## 🚢 Déploiement Vercel

### Backend (API)
Le backend FastAPI doit être déployé séparément (Railway, Render, ou VPS).

### Frontend

```bash
cd frontend
npm run build
# Déployer le dossier dist/ sur Vercel
```

Configurer les variables d'environnement sur Vercel:
- `VITE_API_URL` = URL de votre backend

---

## 📋 Roadmap V2

- [ ] Connexion ERP réelle (API bancaire, Sage, etc.)
- [ ] Mémoire des décisions passées
- [ ] Alertes automatiques par email
- [ ] Multi-entreprises
- [ ] Export PDF des livrables

---

## 🔒 Sécurité

- ❌ L'agent NE décide JAMAIS à la place du DAF
- ❌ L'agent NE peut PAS exécuter de paiements
- ❌ L'agent NE modifie PAS les données sources
- ✅ Tous les calculs sont auditables
- ✅ L'IA est disciplinée (pas de chiffres générés)

---

## 📄 Licence

Propriétaire - Tous droits réservés

---

**Agent DAF v1.0** — *L'agent propose, le DAF décide.* 🎯
