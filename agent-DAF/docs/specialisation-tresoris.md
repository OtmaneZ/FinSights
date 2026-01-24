# TRESORIS - Spécialisation Actuelle

## La Mutation : De "Treasury Agent" à "Risk Requalification Agent"

### Avant (Vision initiale - trop large)
- Agent généraliste de surveillance trésorerie
- Tous les risques = même poids
- Dashboard avec 26 situations "risques"
- Scoring brut sans contexte métier
- Cible : tout le monde (trop vague)

### Maintenant (Spécialisation resserrée - hyper-fokus)
**TRESORIS = Agent spécialisé en REQUALIFICATION DE RISQUES DE TRÉSORERIE**

---

## 1. Le Cœur : Requalification des Risques

### Qu'est-ce que c'est ?
TRESORIS analyse les écarts entre :
- **La perception naïve** : "J'ai 26 situations anormales"
- **La réalité matérielle** : "En vrai, 2-5 posent un risque réel"

C'est du **tri intelligent** : transformer du bruit en signal.

### Les 3 étapes de requalification

#### Étape 1 : Détecter les anomalies
```
Source : données brutes (transactions, factures, échéanciers)
Action : identifier les écarts aux normes
Résultat : liste initiale de 26 situations "anormales"
```

#### Étape 2 : Qualifier le risque
```
Pour chaque anomalie, calculer :
- Montant exposé
- Probabilité d'impact
- Horizon temporel
- Criticité pour la trésorerie

Score = f(montant, probabilité, urgence)
```

#### Étape 3 : Requalifier en risque ou normal
```
Critique (score > 75)  →  Besoin d'action immédiate
Incertain (score 50-75) →  À surveiller, préparer contingence
Certain (score < 50)    →  Situation normale, pas d'action
```

**Résultat final : 26 → 2-5 vrais risques**

---

## 2. Les Cas de Requalification (Exemples Concrets)

### Cas 1 : Retard client de 45 jours
**Perception naïve :** "Risque ! Alerte rouge !"

**Requalification :**
- Montant : 50 000 €
- Client : Groupe pharmaceutique AAA (paye toujours)
- Historique : retard régulier mais toujours payé
- Probabilité réelle de non-paiement : 5%
- Urgence : modérée (retard cyclique connu)

**Verdict :** CERTAIN (normal opérationnel) → Pas de risque trésorerie

---

### Cas 2 : Retard fournisseur dans livraison
**Perception naïve :** "Problème logistique, pas grave"

**Requalification :**
- Impact cash : retard de 2 semaines dans encaissement prévus
- Montant en suspension : 300 000 €
- Runway actuel : 45 jours
- Impact runway : 45 → 31 jours
- Probabilité d'impact : 80% (fournisseur historiquement fiable mais retard confirmé)

**Verdict :** CRITIQUE → Action immédiate requise

---

### Cas 3 : Concentration client élevée
**Perception naïve :** "Concentration normale pour PME"

**Requalification :**
- Top 3 clients = 60% du CA
- Top 1 client = 35% du CA
- Retard client #1 = risque de chute de 35% des encaissements
- Runway si perte client #1 : 8 jours
- Contrat : renouvelé annuellement (risque résiliation = 15%)

**Verdict :** CRITIQUE → Risque de liquidité extrême

---

### Cas 4 : DSO qui dérive de 5 jours
**Perception naïve :** "Variation normale"

**Requalification :**
- DSO : 55 → 60 jours (+5 jours) sur 1 mois
- Si tendance continue : DSO = 80 jours dans 5 mois
- Impact cash : immobilisation supplémentaire de 200 000 €
- Runway impacté : 45 → 40 jours
- Cause identifiée : 2 clients en retard, pas 1 problème systémique

**Verdict :** INCERTAIN → À monitorer, mais pas d'action d'urgence

---

## 3. Le Cycle Autonome de TRESORIS

```
JOUR 1
├─ Collecte données (fichiers, API, uploads)
├─ Normalisation & validation
└─ Calcul position trésorerie

JOUR 2
├─ Analyse prévisions (4, 8, 13 semaines)
├─ Détection d'anomalies
└─ Score initial des 26 situations

JOUR 3-4
├─ Contextualisation de chaque anomalie
├─ Requalification (Certain / Incertain / Critique)
├─ Analyse d'impact sur trésorerie
└─ Priorisation des risques réels

JOUR 5
├─ Rédaction recommandations
├─ Estimation effort vs. impact
└─ STOP - Attente validation DAF

DAF DECIDE
├─ Approuve / Rejette les recommandations
└─ Exécute (TRESORIS ne touche rien)
```

---

## 4. Livrables Spécialisés

### Dashboard Minimaliste
```
Carte 1 : Situations analysées (26)
Carte 2 : Risques réels (Critique + Incertain) (2-5)
Carte 3 : Actions proposées (3 max)
Carte 4 : En attente validation
```

### Table des Risques Critiques/Incertains
```
Colonne 1 : Statut (Critique / Incertain)
Colonne 2 : Client ou thème
Colonne 3 : Montant exposé
Colonne 4 : Retard / Urgence
Colonne 5 : Justification & recommandation
```

### Note au DAF
```
Format : 1 page executive
Contenu :
- Position de trésorerie actuelle
- Prévisions 4/8/13 semaines (en 1 graphique)
- Risques réels identifiés (3 max)
- Actions recommandées avec deadline & impact
- Pas de données brutes, juste du contexte décisionnel
```

---

## 5. Les 3 Règles de Requalification

### Règle 1 : Matérialité
```
Si montant < seuil de matérialité (ex: 2% du CA)
→ Requalifier en CERTAIN (normal), pas d'alerte
```

### Règle 2 : Probabilité contextuelle
```
Retard de client AAA payeur depuis 10 ans ?
→ Probabilité réelle de non-paiement = très faible
→ Requalifier en CERTAIN
```

### Règle 3 : Impact trésorerie
```
Anomalie sans impact sur runway / couverture de dette ?
→ Requalifier en CERTAIN (peut attendre)
```

---

## 6. Ce que TRESORIS N'EST PAS

❌ **Générateur d'alertes brutes** (c'est fait)
❌ **Système d'audit comptable** (pas son rôle)
❌ **Outil de forecasting à long terme** (5 ans+)
❌ **Système d'exécution bancaire** (0 accès, 0 intégration)
❌ **Remplaçant du DAF** (impossible et indésirable)

---

## 7. Ce que TRESORIS EST

✅ **Filtre de bruit vs signal**
- 26 situations → 2-5 vraies décisions

✅ **Contextualisateur intelligent**
- Anomalie brute → Risque requalifié avec contexte

✅ **Machine à recommandations priorisées**
- Chaque risque = action claire, chiffrée, traçable

✅ **Auditeur interne continu**
- Trace de chaque analyse, décision, action

✅ **Assistant décisionnel du DAF**
- Réduit le temps d'analyse de 2h à 15 min

---

## 8. Qui devrait utiliser TRESORIS ?

### Profil 1 : DAF PME (50-500 personnes)
```
Problème : "Je dois piloter la trésorerie mais je n'ai que 4h/semaine"
Solution : TRESORIS fait l'analyse lourde, DAF ne regarde que les 2-5 vraies décisions
ROI : 8h/mois récupérées
```

### Profil 2 : DAF collectif (clusters, holdings)
```
Problème : "Je gère 10 entités, 10 tableaux de bord différents"
Solution : TRESORIS centralise et requalifie les risques par entité
ROI : 20h/mois (audit décentralisé vs. centralisé)
```

### Profil 3 : Président/PDG exigeant
```
Problème : "Je veux un résumé 100% fiable en 2 pages"
Solution : Note TRESORIS = signal vs. bruit, décisions claires
ROI : confiance accrue, décisions plus rapides
```

### Profil 4 : Auditeur externe / Investisseur
```
Problème : "Comment évaluer le risque de liquidité d'une PME ?"
Solution : TRESORIS génère trace d'analyse continue
ROI : due diligence plus robuste
```

---

## 9. Métriques de Succès

### Pour le DAF
```
Avant TRESORIS : 2h pour analyser la trésorerie
Après TRESORIS : 15 min pour décider
Gain : 1h45 par jour × 20 jours = 35h/mois
```

### Pour l'entreprise
```
Avant : décisions de trésorerie = réactives (crise)
Après : décisions = proactives (anticipation)
Impact : réduction du stress cash, meilleure négociation fournisseurs
```

### Pour les parties prenantes
```
Avant : rarement du reporting trésorerie (trop compliqué)
Après : note mensuelle simple et contextuelle
Impact : gouvernance plus transparente
```

---

## 10. Roadmap Possible (Futures Améliorations)

### Court terme (3 mois)
```
- API pour intégration directe comptabilité (ex: Sage, QBOnline)
- Alertes SMS pour risques CRITIQUE
- Scenario "What if" interactif
```

### Moyen terme (6 mois)
```
- Recommandations d'optimisation DPO/DSO
- Benchmark de trésorerie par secteur
- Prévisions pondérées par probabilité (scénarios)
```

### Long terme (12 mois)
```
- Scoring de solvabilité pour ratios banquiers
- Intégration calendrier de maturité (prêts, lignes de crédit)
- Simulation de stress test réglementaires
```

---

## Conclusion

### La Spécialisation en Une Phrase
**TRESORIS = L'agent qui transforme 26 alertes en 3 décisions.**

### Son Superpouvr
1. **Voir ce que le DAF ne voit pas** (analyse continue, 24/7)
2. **Dire ce qui compte vraiment** (requalification intelligente)
3. **Proposer des actions décidables** (chiffrées, tracées, hiérarchisées)

### Son Limitation Volontaire
TRESORIS s'arrête avant la décision. C'est par design. Le DAF garde 100% du pouvoir.

### Pour qui, pour quoi
- **PME > 50M€ CA** avec trésorerie complexe
- **Holdings / clusters** avec multi-entités
- **Entreprises en croissance rapide** (BFR explosif)
- **Environnement volatil** (taux, devise, crédit client)

---

**Créé : 23 janvier 2026**
**Produit par : ZineInsights**
**Pour : DAF, Président, Auditeurs**
