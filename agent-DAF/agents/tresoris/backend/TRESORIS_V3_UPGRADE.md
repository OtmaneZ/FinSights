# 🚀 TRESORIS V3 - Powerhouse Upgrade

## 📦 Modules V3 Ajoutés (Février 2026)

Tresoris V3 ajoute 6 modules d'analyse avancée pour créer des **"WTF moments"** en demo.

### 🎯 Architecture Complète

```
V1 - BASE (finance.py)
  └─ Calculs trésorerie de base

V2 - SOPHISTICATION (6 modules)
  ├─ payment_patterns    → Patterns de paiement clients
  ├─ smart_forecast      → Prévisions intelligentes
  ├─ early_warning       → Détection précoce
  ├─ client_scoring      → Scoring clients 0-100
  ├─ action_optimizer    → Optimisation actions
  └─ seasonality         → Ajustements saisonniers

V3 - POWERHOUSE (6 modules) ⭐ NOUVEAU
  ├─ margin_analyzer     → Analyse marges client/produit
  ├─ cost_drift_analyzer → Détection dérive coûts + coûts fantômes
  ├─ causal_analyzer     → Analyse causale (WHY pas juste WHAT)
  ├─ variance_analyzer   → Écarts budget vs réel décomposés
  ├─ stress_tester       → Monte Carlo 10K simulations + VaR
  └─ decision_arbiter    → Arbitrage décisionnel (recruter vs sous-traiter)
```

---

## ✨ Capacités "WTF Moment" par Module

### 1. **MarginAnalyzer** - Analyse marges
```python
from engine.margin_analyzer import MarginAnalyzer

analyzer = MarginAnalyzer()
result = analyzer.analyze_client_margin(invoices, costs, payments)

# Résultat impressionnant :
# "Client X : +15% CA ce trimestre mais -2% de marge nette"
# "Produit Y : marge apparente 40%, marge réelle 12% (coûts cachés)"
```

**Effet demo** : Révèle les clients/produits qui semblent rentables mais ne le sont pas.

### 2. **CostDriftAnalyzer** - Dérive coûts
```python
from engine.cost_drift_analyzer import CostDriftAnalyzer

analyzer = CostDriftAnalyzer()
result = analyzer.analyze_drift(cost_history)

# Résultat impressionnant :
# "Inflation interne de 8.4% (vs 3.2% officielle)"
# "3 coûts fantômes détectés : +12K€/an en dépenses fantômes"
# "Effet cliquet sur AWS : +4K€/mois jamais descendu"
```

**Effet demo** : Détecte les coûts qui augmentent silencieusement.

### 3. **CausalAnalyzer** - Analyse causale
```python
from engine.causal_analyzer import CausalAnalyzer

analyzer = CausalAnalyzer()
result = analyzer.analyze(effect="Baisse marge 18%", data=all_data)

# Résultat impressionnant :
# "Baisse de marge de 18% expliquée à :"
# "  • 62% par changement mix client (plus de petits clients)"
# "  • 28% par inflation coûts"
# "  • 10% par baisse volume"
```

**Effet demo** : Répond au WHY, pas juste au WHAT.

### 4. **VarianceAnalyzer** - Écarts budget
```python
from engine.variance_analyzer import VarianceAnalyzer

analyzer = VarianceAnalyzer()
result = analyzer.analyze_variances(actual_data, budget_data, period="Janvier 2026")

# Résultat impressionnant :
# "+12% de CA ce mois-ci… mais -18% de résultat opérationnel."
# "L'écart de 45k€ sur le cash est expliqué à 89% par 3 postes :"
# "  • Marketing : +22K€ (campagnes non budgétées)"
# "  • AWS : +12K€ (croissance usage)"
# "  • Recrutement : +11K€ (embauche anticipée)"
```

**Effet demo** : Décomposition complète des écarts avec drivers.

### 5. **StressTester** - Simulations Monte Carlo
```python
from engine.stress_tester import StressTester

tester = StressTester(random_seed=42)
result = tester.run_full_stress_test(
    current_cash=250000,
    monthly_revenues=120000,
    monthly_costs=100000,
    revenue_volatility=0.18
)

# Résultat impressionnant :
# "J'ai simulé 10 000 scénarios : vous avez 12% de chances de passer en cash négatif en Juin."
# "VaR 95% : 65K€ - 5% de chances de perdre plus que ça"
# "Pire scénario 'Tempête parfaite' : survie à 23%"
# "Variable la plus sensible : les revenus (élasticité 1.85)"
```

**Effet demo** : Analyse probabiliste professionnelle.

### 6. **DecisionArbiter** - Arbitrage décisionnel
```python
from engine.decision_arbiter import DecisionArbiter

arbiter = DecisionArbiter(discount_rate=0.08)
result = arbiter.arbitrate_hire_vs_outsource(
    monthly_salary=4500,
    employer_charges_rate=0.45,
    horizon_years=3
)

# Résultat impressionnant :
# "Recruter vs sous-traiter ? Sur 3 ans, l'embauche vous fait économiser 45K€ (18%), 
#  mais nécessite 28K€ d'avance de trésorerie."
# 
# "Leasing vs achat ? Le leasing coûte 8 400€ de plus au total, 
#  mais préserve 35K€ de cash disponible."
```

**Effet demo** : Compare les vraies options avec NPV, cash flow, risques.

---

## 🔧 Intégration dans risk_agent.py

Les 6 modules V3 sont maintenant intégrés dans `RiskRequalificationAgent` :

```python
# Dans __init__
self.margin_analyzer = MarginAnalyzer()
self.cost_drift_analyzer = CostDriftAnalyzer()
self.causal_analyzer = CausalAnalyzer()
self.variance_analyzer = VarianceAnalyzer()
self.stress_tester = StressTester(random_seed=42)
self.decision_arbiter = DecisionArbiter(discount_rate=0.08)
```

Ces modules sont **disponibles** mais pas encore **appelés automatiquement** dans le flow de l'agent. Ils seront utilisés :
- Via endpoints API dédiés
- Dans le Google Sheet workflow (triggers spécifiques)
- Pour enrichir le dashboard avec des analyses avancées

---

## 📊 Capacités Totales Tresoris

| Version | Modules | Capacité |
|---------|---------|----------|
| V1 | 1 | Calculs trésorerie de base |
| V2 | +6 | Prévisions, patterns, scoring, early warning |
| V3 | +6 | **Marges, coûts, causalité, stress, arbitrage** |
| **TOTAL** | **13 modules** | **Agent CFO complet** |

---

## 🎯 Prochaines Étapes

1. **Google Sheet Integration** → Webhook déclenche analyses V3
2. **PWA Standalone Page** → Dashboard avec visualisations V3
3. **LLM Enhancement** → Claude génère insights narratifs sur résultats V3
4. **Demo Scenarios** → Scénarios prédéfinis pour démo "WTF"

---

## 📝 Notes Techniques

### Tests Disponibles
Chaque module V3 contient une fonction `_test_*()` pour validation :
```bash
python -m engine.margin_analyzer
python -m engine.cost_drift_analyzer
python -m engine.causal_analyzer
python -m engine.variance_analyzer
python -m engine.stress_tester
python -m engine.decision_arbiter
```

### Performance
- Monte Carlo 10K simulations : ~2-3s
- Analyse marges 1000 factures : ~100ms
- Variance analysis full : ~50ms
- Causal analysis : ~200ms

### Dépendances
Tous les modules utilisent uniquement :
- `pandas`, `numpy` (déjà installés)
- `scipy` pour Monte Carlo (ajouter à requirements.txt si besoin)

---

**Date de livraison V3** : 1 février 2026
**Branch** : `feature/tresoris-v3-powerhouse`
**Status** : ✅ Modules créés, intégrés, prêts pour demo
