# SCORIS - Risque Clients & Impayés

## Agent #3 | En Backlog 📋

### Question
**"Qui va payer en retard… ou pas du tout ?"**

### Status
- 📋 **En backlog**
- Priorité : P2 (après MARGIS)
- Complexité : Élevée (6-8 semaines)
- Valeur : Haute (anticipation impayés)

### Problème à résoudre

Les créances clients = 30-50% du BFR d'une PME. Mais qui va vraiment payer ?

**Constat** : DAF découvre impayés **après** criticité (>90 jours). Trop tard.

### Structure du dossier

```
scoris/
├── README.md                    # Ce fichier
├── spec.md                      # Spécifications
├── backlog.md                   # User stories
├── ml_model/                    # Modèle scoring
└── mockups/                     # Designs UI/UX
```

### Cycle autonome prévu

1. **Collecte** : historique paiements, DSO, montants, secteur
2. **Scoring ML** : modèle prédictif (XGBoost) sur historique
3. **Détection** : clients risque élevé ou dégradation récente
4. **Contextualisation** : montant exposé, impact trésorerie
5. **Recommandations** : relance, suspension, mise en demeure
6. **STOP** : validation DAF requise

### Livrables

- Dashboard scoring clients (vert/orange/rouge)
- Prévisions encaissements pondérées
- Alertes proactives

### Prochaines étapes

- [ ] Finir spec ML
- [ ] Collecter données training (historique 24 mois)
- [ ] Entraîner modèle XGBoost
- [ ] Validation prédictions
- [ ] UX/UI dashboard
- [ ] Tests pilotes

---

**Créé : 23 janvier 2026**  
**Owner : À définir**  
**Début estimé : Mars 2026**
