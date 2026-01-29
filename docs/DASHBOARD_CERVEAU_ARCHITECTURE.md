# 🧠 Architecture du "Cerveau" - Dashboard vs TRESORIS

## 📌 Question clé : "Le Dashboard a-t-il son propre cerveau ?"

**Réponse : OUI, mais limité. Il a 2 modes d'intelligence.**

---

## 🎯 Dashboard V2 - Intelligence Basique

### Mode 1 : Alertes Automatiques (Cerveau Basique)
Le Dashboard génère automatiquement des alertes basées sur **4 règles fixes** :

```typescript
// AlertsPanel.tsx - generateAlerts()

1. DSO > 60 jours
   → ⚠️ "Risque de tension de trésorerie"
   → Actions : Relancer factures, pénalités retard, escompte

2. Cash Flow < 0€
   → 🚨 "Risque de rupture cash immédiat" (CRITIQUE)
   → Actions : Plan tréso 90j, négo fournisseurs, ligne crédit

3. Marge nette < 10%
   → ⚠️ "Erosion de marge" (< 5% = CRITIQUE)
   → Actions : Analyser charges, revoir tarifs, renégocier fournisseurs

4. BFR > 30 jours CA
   → ⏱️ "Cycle de conversion cash ralenti"
   → Actions : Réduire stocks, accélérer encaissements
```

**Limites du cerveau basique :**
- ❌ Ne détecte PAS la saisonnalité (80% Q4)
- ❌ Ne détecte PAS la concentration client (42% sur 1 client)
- ❌ Ne détecte PAS les patterns de dépenses
- ❌ Ne fait PAS de prévisions ML
- ❌ Ne score PAS les clients (A/B/C/D)

---

### Mode 2 : Alertes Riches JSON (Mode Démo)
Pour les démos, le Dashboard utilise des **alertes pré-calculées** dans `/public/demo-configs/*.json` :

```json
// pme-saisonnalite.json
"alerts": [
  {
    "type": "critical",
    "title": "🚨 URGENCE: Runway critique < 1 mois",
    "description": "Avec 20k€ de cash et un burn de 22k€/mois...",
    "value": 0.9,
    "threshold": 3,
    "actions": [
      "🔴 ACTION IMMÉDIATE: Négocier ligne crédit 50-80k€",
      "Contacter banquier CETTE SEMAINE",
      "Calculer besoin financement: 156k€ pour Q1-Q3"
    ]
  }
]
```

**Avantages du mode démo :**
- ✅ Détecte saisonnalité, concentration, patterns
- ✅ Alertes contextuelles et actionnables
- ✅ Pré-calculées = cohérence garantie avec KPIs
- ✅ 100% fiables (pas d'hallucination ML)

**Limites :**
- ❌ Statique (ne s'adapte pas aux nouvelles données)
- ❌ Nécessite recalcul manuel des JSON

---

## 🚀 TRESORIS - Intelligence Avancée (6 ML Engines)

TRESORIS est un **backend Python FastAPI** avec 6 moteurs ML spécialisés :

### 1. 🔍 **ClientPaymentAnalyzer**
```python
# Analyse comportement paiement par client
- Délai moyen réel vs délai contractuel
- Tendance (amélioration/dégradation)
- Historique des retards
```

### 2. 🎯 **ClientRiskScorer**
```python
# Score A/B/C/D par client
A: Excellent (DSO < 30j, fiable)
B: Bon (DSO 30-45j, acceptable)
C: À surveiller (DSO 45-60j, retards)
D: Risque (DSO > 60j, impayés fréquents)

→ Prioritisation automatique des relances
```

### 3. 📈 **SmartForecaster**
```python
# Prévisions ML cash flow 3-6 mois
- SARIMA pour saisonnalité
- Prophet pour tendances
- Confidence intervals (P10/P50/P90)

→ Runway prédictif avec scénarios
```

### 4. ⚠️ **EarlyWarningDetector**
```python
# Détection signaux faibles
- Concentration client > 30% CA
- Saisonnalité extrême > 60% Q4
- Dégradation DSO sur 3 mois
- Burn rate accéléré (>+20%/mois)

→ Alertes avant rupture cash
```

### 5. 🎬 **ActionPrioritizer**
```python
# Priorisation automatique des actions
Score = Impact €€€ × Urgence × Faisabilité

Exemple:
1. Relancer Client X (42% CA) → Impact 50k€
2. Réduire charge Y (10% budget) → Impact 12k€
3. Négocier fournisseur Z → Impact 8k€
```

### 6. 📊 **SeasonalityAdjuster**
```python
# Ajustement prévisions par saisonnalité
- Détecte cycles (mensuel, trimestriel, annuel)
- Corrige BFR par période
- Recommande timing facturations

→ Optimise runway saisonnier
```

---

## 🔀 Comparaison Technique

| Capacité | Dashboard Basique | Dashboard Démo | TRESORIS |
|----------|-------------------|----------------|----------|
| **Alertes seuils fixes** | ✅ 4 règles | ❌ | ✅ + ML |
| **Alertes contextuelles** | ❌ | ✅ Statique | ✅ Temps réel |
| **Détection saisonnalité** | ❌ | ✅ | ✅ + Prévisions |
| **Scoring clients** | ❌ | ❌ | ✅ A/B/C/D |
| **Prévisions ML** | ❌ | ❌ | ✅ 3-6 mois |
| **Priorisation actions** | ❌ | ❌ | ✅ Score Impact |
| **Adaptation données** | ✅ | ❌ | ✅ Auto |
| **Latence** | Instantané | Instantané | 2-5s |
| **Coût compute** | 0€ | 0€ | ~50€/mois |

---

## 💰 Modèle Économique

### **Dashboard Gratuit**
- Cerveau basique (4 règles)
- Mode démo avec alertes JSON
- Export PDF/Excel
- **Prix : 0€**

### **Dashboard + TRESORIS Premium**
- Tout Dashboard gratuit
- + 6 ML engines temps réel
- + Scoring clients A/B/C/D
- + Prévisions 3-6 mois
- + Détection patterns avancée
- **Prix : 200-500€/mois** (selon volume)

---

## 🎯 Cas d'Usage

### Utilisez Dashboard Basique si :
- ✅ Vous avez < 50 transactions/mois
- ✅ Vous voulez du monitoring simple
- ✅ Pas de saisonnalité complexe
- ✅ Budget : 0€

### Utilisez Dashboard + TRESORIS si :
- ✅ > 500 transactions/mois
- ✅ Saisonnalité forte (commerce, e-commerce)
- ✅ Besoin prévisions cash flow
- ✅ Scoring clients pour prioriser relances
- ✅ Budget : 200-500€/mois

---

## 🔧 Implémentation Actuelle

### ✅ Ce qui fonctionne aujourd'hui :
- Dashboard V2 avec cerveau basique (4 règles)
- Mode démo avec alertes JSON riches
- Export PDF/Excel
- Calcul KPIs automatique (revenue, margin, DSO, BFR)

### 🚧 En développement :
- Intégration API TRESORIS
- Endpoint `/api/tresoris/analyze` pour analyse ML
- Affichage scoring clients dans Dashboard
- Prévisions cash flow avec Prophet

### 🎯 Roadmap :
1. **Phase 1** : Dashboard gratuit (DONE ✅)
2. **Phase 2** : Intégration TRESORIS API (En cours)
3. **Phase 3** : Scoring clients A/B/C/D
4. **Phase 4** : Prévisions ML 3-6 mois
5. **Phase 5** : Priorisation actions automatique

---

## 📝 Conclusion

**Le Dashboard a-t-il un cerveau ?**
- **OUI** pour les seuils simples (4 règles fixes)
- **OUI** pour les démos (alertes JSON pré-calculées)
- **NON** pour l'analyse ML avancée → nécessite TRESORIS

**Positionnement produit :**
- **Dashboard = Frontend intelligent** (gratuit, 80% des besoins)
- **TRESORIS = Backend ML** (premium, 20% besoins avancés)
- **Ensemble = Licorne** 🦄 (CFO pro avec IA)

**Valeur différenciée :**
- Dashboard gratuit → acquisition
- TRESORIS premium → monétisation
- Intégration fluide → rétention
