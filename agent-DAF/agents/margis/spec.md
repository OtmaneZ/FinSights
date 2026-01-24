# MARGIS — Spécifications Techniques

## Vision
Analyser la rentabilité réelle par produit, service et client, puis proposer des arbitrages pour optimiser les marges.

## Cycle Autonome

```
Collecte (ventes, coûts)
    ↓
Calcul (marge brute/nette)
    ↓
Détection (produits/clients faibles)
    ↓
Contextualisation (volume, stratégie)
    ↓
Recommandations (optimiser mix produit)
    ↓
STOP (validation CEO/DAF)
```

## Données d'entrée

- Factures de vente (produit/client, montant, date)
- Coûts de production/service (directs)
- Temps passé (pour services)
- Frais généraux par catégorie
- Volume produit/client

## Sorties

### Dashboard
- Heatmap rentabilité (produit × client)
- Top 10 produits par marge
- Top 5 clients destructeurs
- Marges par catégorie

### Rapports
- Analyse détaillée produit (inclus coût caché)
- Recommandations prix
- Scénarios optimisation marge

## Règles métier

### Calcul marge

```
Marge brute = (Prix vente - Coût direct) / Prix vente × 100

Marge nette = (Marge brute € - Part frais généraux) / Prix vente × 100
```

### Classification

- **Très rentable** : Marge nette > moyenne + 20%
- **Rentable** : Marge nette > moyenne
- **Limite** : Marge nette = moyenne ± 10%
- **Déficitaire** : Marge nette < 0

### Alertes

🔴 **Critique** :
- Produit déficitaire (marge < -5%)
- Client cause perte structurelle

🟠 **À suivre** :
- Marge dégradée vs. historique
- Coûts cachés significatifs

## Stack Technique

- **Backend** : FastAPI + Pandas (analyse)
- **Calcul** : Numpy (matrices coûts)
- **LLM** : Claude (contextualisation arbitrages)
- **Frontend** : React + Recharts (heatmaps)

## Données de test

Nécessaire pour développement :
- Exemple 10 produits, 20 clients
- Historique 12 mois ventes
- Structure coûts détaillée

---

**Dernière mise à jour : 23 janvier 2026**
