# SCENARIS - Décisions Sous Incertitude

## Agent #4 | En Backlog 📋

### Question
**"Quelle option est la moins risquée maintenant ?"**

### Status
- 📋 **En backlog**
- Priorité : P3 (après MARGIS + SCORIS)
- Complexité : Élevée (6-8 semaines)
- Valeur : Très haute (stratégique, premium)

### Problème à résoudre

CEO/DAF font des simulations mentalement ou Excel et se trompent.

Questions typiques :
- "Et si on perd notre client n°1 ?"
- "Et si les taux augmentent de 2 points ?"
- "Et si on recrute 3 personnes au lieu de 2 ?"

### Structure du dossier

```
scenaris/
├── README.md                    # Ce fichier
├── spec.md                      # Spécifications
├── backlog.md                   # User stories
├── models/                      # Modèles simulation
└── mockups/                     # Designs UI/UX
```

### Cycle autonome prévu

1. **Collecte** : données actuelles (CA, charges, trésorerie, BFR)
2. **Définition scénarios** : variations CA, coûts, délais paiement
3. **Simulation** : impact trésorerie, rentabilité, runway 12-24 mois
4. **Comparaison** : scénario A vs. B vs. C (probabilités)
5. **Recommandations** : meilleur scénario selon objectif
6. **STOP** : validation CEO/DAF requise

### Livrables

- Comparaison 3-5 scénarios (tableaux + graphiques)
- Impact trésorerie, rentabilité, runway
- Probabilité scénarios
- Sensibilité variables clés

### Prochaines étapes

- [ ] Finir spec modèle financier
- [ ] Définir scénarios templates (recruitement, perte client, taux, etc)
- [ ] Prototype simulation
- [ ] UX/UI (visuelle comparaison)
- [ ] Tests avec 3-5 CEO

---

**Créé : 23 janvier 2026**  
**Owner : À définir**  
**Début estimé : Avril 2026**
