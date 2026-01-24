# 🚀 Getting Started — agent-DAF

## Bienvenue !

Ce projet contient **TRESORIS** (produit en production) + **3 agents en backlog** (MARGIS, SCORIS, SCENARIS).

---

## 📖 Démarrer en 5 min

### 1. Comprendre la stratégie

**Fichier principal :** `4-agents-ia-finance.md`

Lis les 5 premières sections pour comprendre :
- Pourquoi 4 agents (pas 5 ou 6)
- Quelle question résout chaque agent
- Logique de combinaisons

**Temps estimé : 10 min**

---

### 2. Comprendre TRESORIS (production)

**Fichier :** `agents/tresoris/spec.md`

TRESORIS est l'agent central qui transforme :
- 26 situations de trésorerie détectées
- En 2-5 vrais risques à traiter

**Architecture simplifiée :**

```
Données (transactions, factures)
    ↓
Calcul (position trésorerie, runway)
    ↓
Détection (26 situations anormales)
    ↓
Requalification (Certain / Incertain / Critique)
    ↓
Dashboard + Alertes
    ↓
DAF/CEO décide
```

**Temps estimé : 15 min**

---

### 3. Explorer le code TRESORIS

**Backend :**
```bash
cd backend/agent/
# Voir risk_agent.py → logique détection/requalification
```

**Frontend :**
```bash
cd frontend-bpi/src/pages/tresoris/
# Voir composants dashboard
```

**Temps estimé : 20 min**

---

### 4. Lancer TRESORIS localement

**Backend (port 8000) :**
```bash
cd backend
python main.py
```

**Frontend (port 3000) :**
```bash
cd frontend-bpi
npm install
npm run dev
```

Puis ouvre : `http://localhost:3000`

**Temps estimé : 5 min**

---

## 📚 Pour développer un agent (MARGIS, SCORIS, SCENARIS)

### Étape 1 : Lire la spec

Exemple pour MARGIS :
```bash
open agents/margis/spec.md
```

Tu y trouveras :
- Vision et questions
- Cycle autonome (collecte → calcul → détection → recommandations)
- Données d'entrée/sortie
- Règles métier
- Stack technique

**Temps estimé : 30 min**

---

### Étape 2 : Créer l'agent backend

Exemple pour MARGIS :

```python
# backend/agent/margin_agent.py

from fastapi import APIRouter
from engine.finance import calculate_margins

router = APIRouter(prefix="/api/margis", tags=["margis"])

@router.post("/analyze")
async def analyze_margins(data):
    """
    Analyser rentabilité par produit/client
    
    Cycle : Collecte → Calcul → Détection → Recommandations
    """
    # 1. Collecte & calcul
    margins = calculate_margins(data)
    
    # 2. Détection (produits déficitaires)
    deficits = [m for m in margins if m["net_margin"] < 0]
    
    # 3. Contextualisation & recommandations
    recommendations = generate_recommendations(deficits)
    
    return {
        "margins": margins,
        "alerts": deficits,
        "recommendations": recommendations
    }
```

**Temps estimé : 4-6 semaines par agent**

---

### Étape 3 : Créer le dashboard frontend

Exemple pour MARGIS :

```typescript
// frontend-bpi/src/pages/margis/index.tsx

import { HeatmapChart } from "@/components/HeatmapChart"
import { RecommendationsList } from "@/components/RecommendationsList"

export default function MargisDashboard() {
  const [margins, setMargins] = useState(null)
  
  useEffect(() => {
    // Appeler API MARGIS
    fetch("/api/margis/analyze")
      .then(r => r.json())
      .then(setMargins)
  }, [])
  
  return (
    <div>
      <HeatmapChart data={margins?.heatmap} />
      <RecommendationsList items={margins?.recommendations} />
    </div>
  )
}
```

**Temps estimé : 2-3 semaines design + dev**

---

## 🎯 Roadmap d'implémentation

| Agent | Priorité | Début | Durée | Statut |
|-------|----------|-------|-------|--------|
| **TRESORIS** | P0 | ✅ Fait | - | ✅ Production |
| **MARGIS** | P1 | Février | 5-6 sem | 📋 Backlog |
| **SCORIS** | P2 | Mars | 7-8 sem | 📋 Backlog |
| **SCENARIS** | P3 | Avril | 7-8 sem | 📋 Backlog |

---

## 📞 Points de contact par domaine

| Domaine | Fichiers à consulter |
|---------|---------------------|
| **Stratégie produit** | `4-agents-ia-finance.md` |
| **Architecture backend** | `backend/main.py` + `agents/*/spec.md` |
| **Architecture frontend** | `frontend-bpi/src/pages/tresoris/` |
| **Données/ML** | `agents/scoris/spec.md` |
| **Calculs financiers** | `backend/engine/finance.py` |
| **Documentation** | `docs/` |

---

## ❓ FAQ

### Q: Par où commencer si je suis nouveau ?
**R:** Lis d'abord `4-agents-ia-finance.md` (10 min), puis `agents/tresoris/spec.md` (15 min). Tu auras la vue d'ensemble.

### Q: TRESORIS marche vraiment ?
**R:** Oui, ✅ en production. Lance `npm run dev` + `python main.py` pour voir.

### Q: Je dois développer MARGIS, par où ?
**R:** 
1. Lis `agents/margis/spec.md`
2. Crée `backend/agent/margin_agent.py`
3. Crée `/frontend-bpi/src/pages/margis/`
4. Voir checklist "Avant de lancer MARGIS" dans `STRUCTURE.md`

### Q: Quel est le modèle commercial ?
**R:** Voir `4-agents-ia-finance.md`, section "Modèle Commercial Possible". Packs : standalone 150-300€/mois, combos 400-900€/mois.

### Q: Qui valide les décisions ?
**R:** **Toujours le DAF/CEO**. Les agents ne font que recommander.

---

## 🎓 Ressources complémentaires

- **Indicateurs financiers** : `docs/indicateurs-financiers.html`
- **Spécialisation TRESORIS** : `docs/specialisation-tresoris.md`
- **Bio personnelle** : `docs/presentation-otmane.md`

---

**Créé : 23 janvier 2026**  
**Maintenu par : Otmane Boulahia**  

Besoin d'aide ? Consulte `STRUCTURE.md` ou les specs directement. 🚀
