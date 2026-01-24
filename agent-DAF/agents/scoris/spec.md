# SCORIS — Spécifications Techniques

## Vision
Scorer chaque client (0-100) selon probabilité de payer à temps, et alerter sur risques d'impayés.

## Cycle Autonome

```
Collecte (historique paiements)
    ↓
Feature engineering (DSO, volatilité, trends)
    ↓
Scoring ML (XGBoost, 0-100)
    ↓
Détection (clients risque ou dégradation)
    ↓
Contextualisation (montant, impact trésorerie)
    ↓
Recommandations (actions client)
    ↓
STOP (validation DAF)
```

## Données d'entrée

- Historique factures clients (dates, montants)
- Historique paiements (dates, montants)
- Secteur d'activité client
- Volume annuel client
- Contrats/conditions de paiement

## Features du modèle ML

### Comportement paiement
- DSO (Days Sales Outstanding) historique
- DSO trend (3, 6, 12 mois)
- Variance paiements
- Taux paiements à temps
- Nombre paiements partiels

### Profil client
- Secteur d'activité (risque par secteur)
- Ancienneté relation
- Volume annuel
- Montant facteurs

### Signaux d'alerte
- Dégradation récente DSO
- Augmentation paiements partiels
- Retards croissants
- Changement pattern paiement

## Sorties

### Dashboard
- Heatmap clients scoring (vert/orange/rouge)
- Clients nouveaux risques (dégradation)
- Prévisions cash pondérées par probabilité

### Rapports
- Scoring détaillé par client
- Alertes impayés probables
- Recommandations par client

## Classification clients

- 🟢 **Vert** (Score > 70) : Très fiable, DSO normal
- 🟡 **Orange** (Score 40-70) : À surveiller, DSO dégradé
- 🔴 **Rouge** (Score < 40) : Risque élevé, probablement retard

## Stack Technique

- **Backend** : FastAPI + Pandas
- **ML** : XGBoost (modèle scoring)
- **Feature engineering** : Scikit-learn
- **LLM** : Claude (contextualisation alertes)
- **Frontend** : React + D3.js (heatmaps)

## Données de training

Requis pour modèle robuste :
- Historique paiements 24-36 mois minimum
- 50+ clients (meilleur avec 100+)
- Impayés réels connus (labels)
- Secteur d'activité diversifié

## Évaluation modèle

Métriques clés :
- Recall : détecter 90%+ des vrais impayés
- Precision : minimiser faux positifs
- AUC-ROC : discrimination clients risque

---

**Dernière mise à jour : 23 janvier 2026**
