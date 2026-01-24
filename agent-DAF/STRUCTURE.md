# Structure du Projet agent-DAF

## 📁 Organisation complète

```
agent-DAF/
│
├── 4-agents-ia-finance.md              ⭐ Stratégie produit principale
├── README.md                            # Vue d'ensemble
├── STRUCTURE.md                         # Ce fichier
│
├── 📂 docs/                             # Documentation statique
│   ├── presentation-otmane.md           # Bio personnelle (4 versions)
│   ├── specialisation-tresoris.md       # Positionnement TRESORIS
│   └── indicateurs-financiers.html      # 10 indicateurs financiers
│
├── 📂 agents/                           # Dossiers par agent
│   │
│   ├── tresoris/                        # ✅ Agent #1 — Production
│   │   ├── README.md
│   │   ├── spec.md
│   │   └── presentation/
│   │
│   ├── margis/                          # 📋 Agent #2 — Backlog (P1)
│   │   ├── README.md
│   │   ├── spec.md
│   │   └── backlog.md
│   │
│   ├── scoris/                          # 📋 Agent #3 — Backlog (P2)
│   │   ├── README.md
│   │   ├── spec.md
│   │   └── backlog.md
│   │
│   └── scenaris/                        # 📋 Agent #4 — Backlog (P3)
│       ├── README.md
│       ├── spec.md
│       └── backlog.md
│
├── 📂 backend/                          # Codebase FastAPI partagée
│   ├── main.py
│   ├── requirements.txt
│   ├── agent/
│   │   ├── risk_agent.py                # TRESORIS
│   │   ├── margin_agent.py              # MARGIS (future)
│   │   ├── client_agent.py              # SCORIS (future)
│   │   └── scenario_agent.py            # SCENARIS (future)
│   ├── engine/
│   │   ├── finance.py
│   │   └── ...
│   ├── llm/
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
