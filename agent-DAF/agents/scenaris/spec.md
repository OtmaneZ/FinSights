# SCENARIS — Spécifications Techniques

## Vision
Générer et comparer des scénarios financiers (optimiste, réaliste, pessimiste) pour éclairer décisions stratégiques.

## Cycle Autonome

```
Collecte (données actuelles)
    ↓
Définition scénarios (variations key drivers)
    ↓
Simulation (12-24 mois)
    ↓
Calcul impact (trésorerie, rentabilité, runway)
    ↓
Comparaison (scénario A vs B vs C)
    ↓
Recommandations (optimisation vs objectif)
    ↓
STOP (validation CEO)
```

## Données d'entrée

- Données actuelles : CA, charges, trésorerie, BFR
- Historique 12 mois (trends)
- Prévisions ventes (base scenario)
- Structure coûts (fixes, variables, mixtes)
- Contrats fournisseurs/clients

## Variables simulées

### Scénarios classiques

1. **Recruitement** : impact coûts, délai productivité, CA additionnel
2. **Perte client** : % CA perdu, délai replacement
3. **Taux** : variation taux emprunt, impact charges
4. **Saisonnalité** : variations CA par trimestre/saison
5. **Prix** : augmentation/baisse prix de vente

### Paramètres par variable

```json
{
  "recruitement": {
    "nombre_personnes": [1, 2, 3],
    "coût_mensuel": [3500, 4000, 4500],
    "délai_productivité": [3, 6, 12],
    "ca_additionnel": [0.15, 0.20, 0.25]
  },
  "perte_client": {
    "ca_perdu": [0.05, 0.10, 0.20],
    "délai_replacement": [0, 3, 6, 12]
  },
  "taux": {
    "variation": [-1, 0, +1, +2],
    "montant_dette": "from_data"
  }
}
```

## Sorties

### Dashboard
- Comparaison visuelle 3-5 scénarios
- Impact sur KPIs clés (CA, EBITDA, trésorerie, runway)
- Heatmap sensibilité variables
- Timeline impact mois par mois

### Rapports
- Export Excel comparaison détaillée
- Graphiques tendances 12-24 mois
- Probabilité de chaque scénario

## Calcul impact

### Formules clés

```
Trésorerie(t) = Trésorerie(t-1) + Encaissements(t) - Décaissements(t)

Cash runway (semaines) = Trésorerie actuelle / Burn rate weekly

EBITDA = CA - Charges opérationnelles (hors D&A, finance)

BFR = (Créances clients + Stock) - Dettes fournisseurs
```

## Stack Technique

- **Backend** : FastAPI + Pandas
- **Simulation** : NumPy (calculs matriciels)
- **Viz** : Recharts / D3.js (comparaison scénarios)
- **LLM** : Claude (interprétation résultats)
- **Export** : openpyxl (Excel)

## Templates scénarios

À pré-configurer :
- **Croissance +30%** : CA +30%, délai paiement stable, coûts +15%
- **Perte client 20%** : CA -20%, délai 3 mois replacement
- **Crise taux +2%** : taux emprunt +2%, impact mensuel charges
- **Recruitement** : 2 commerciaux, coût +120k, CA +180k
- **Diversification** : nouveau produit, CA +15%, marge 30%

---

**Dernière mise à jour : 23 janvier 2026**
