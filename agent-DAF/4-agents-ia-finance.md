# Les 4 Agents IA Financiers pour DAF et CEO

## Pourquoi 4 agents (et pas 5 ou 6) ?

**Raison business, pas technique.**

Le cerveau humain gère **4 options maximum** sans fatigue cognitive.

Un dirigeant veut :
- Comprendre vite
- Choisir sans stress
- Sentir qu'il ne se trompe pas

**4 = choix maîtrisé, pas buffet.**

---

## Les 4 Agents Retenus

TRESORIS a prouvé qu'un agent hyper-spécialisé transforme le bruit en signal.

Voici les **3 autres agents** qui complètent l'arsenal du DAF/CEO moderne.

---

## 🧠 1. TRESORIS - Cash & Risque Trésorerie

### Agent central - Non négociable

**Question posée :** "Est-ce que je vais me prendre un mur de cash sans le voir venir ?"

**Mission**

Surveiller la trésorerie en continu, requalifier les risques (26 situations → 2-5 vrais risques), proposer des décisions cash prioritaires.

**Pourquoi c'est l'agent #1**

- C'est le **pain point n°1** de tout dirigeant de PME
- Sans trésorerie, rien d'autre ne compte
- **L'aimant principal** de toute la proposition de valeur

**Cycle autonome**

1. **Surveillance** : fichiers de transactions, factures, échéanciers
2. **Calcul** : position trésorerie, runway, prévisions 4/8/13 semaines
3. **Détection** : 26 situations anormales détectées
4. **Requalification** : tri en Certain / Incertain / Critique (2-5 vrais risques)
5. **Recommandations** : 3 actions prioritaires, chiffrées, avec deadline
6. **STOP** : validation DAF requise

**Statut :** ✅ Déjà développé (V1 opérationnelle)

**Autonomie :** Fonctionne seul. **Très fort** en combo avec SCORIS ou MARGIS.

---

## 💰 2. MARGIS - Vérité sur la Rentabilité

### Agent de lucidité économique

**Question posée :** "Où est-ce que je gagne vraiment de l'argent ?"

**Le Problème**

La plupart des PME connaissent leur **marge globale** (42% par exemple), mais ignorent la **répartition réelle** :
- Quels produits/services génèrent du profit ?
- Quels clients sont rentables vs. destructeurs de marge ?
- Où sont les coûts cachés ?

**Constat terrain :** 20% des produits génèrent 80% de la marge, mais personne ne les identifie clairement.

**Mission**

Analyser la rentabilité réelle par produit, service et client, puis proposer des arbitrages.

**Cycle autonome**

1. **Collecte** : ventes, coûts directs, temps passé, frais généraux alloués
2. **Calcul** : marge brute et marge nette par produit/client
3. **Détection** : produits/clients déficitaires ou sous-performants
4. **Contextualisation** : volume vs. rentabilité, stratégique vs. tactique
5. **Recommandations** : arrêter produit X, renégocier client Y, augmenter prix Z
6. **STOP** : validation CEO/DAF requise

**Exemple concret**

```
Analyse MARGIS - 23 janvier 2026

📊 Produits analysés : 18
📉 Produits déficitaires : 3 (12% du CA)
💰 Top 5 produits : 68% de la marge totale

🔴 ALERTE : Produit "Formation Standard"
• CA généré : 120 000 €/an
• Marge brute : 18% (vs 42% moyenne)
• Temps formateur : 340h à 200€, coût réel 280€/h
• Verdict : perte de 27 200 €/an

💡 Recommandation P1 : Augmenter prix de 35% ou arrêter
Impact attendu : +27 200 €/an ou réaffectation 340h
```

**Livrables**

- Heatmap rentabilité (produit × client)
- Top 10 clients rentables vs. Top 5 destructeurs
- Scénarios de réallocation

**Pourquoi c'est fort**

- **Très fort seul** : révèle où sont les vraies marges
- **Encore plus fort avec TRESORIS** : cash + rentabilité = vision complète

**Autonomie :** Fonctionne seul. Combo naturel avec TRESORIS.

---

## 🧾 3. SCORIS - Risque Clients & Impayés

### Agent de sécurité cash

**Question posée :** "Qui va payer en retard… ou pas du tout ?"

**Le Problème**

Les créances clients représentent 30-50% du BFR d'une PME. Mais qui va vraiment payer ? Qui est à risque ?

**Constat terrain :** Les DAF découvrent les impayés **après** qu'ils soient critiques (>90 jours). Trop tard pour agir.

**Mission**

Scorer chaque client (0-100) selon sa probabilité de payer à temps, et alerter sur les risques d'impayés.

**Cycle autonome**

1. **Collecte** : historique paiements, DSO par client, montants en cours, secteur
2. **Scoring ML** : modèle prédictif (XGBoost) entraîné sur historique
3. **Détection** : clients score <50 (risque élevé) ou dégradation récente
4. **Contextualisation** : montant exposé, impact trésorerie, historique
5. **Recommandations** : relance immédiate, mise en demeure, suspension livraisons
6. **STOP** : validation DAF requise

**Exemple concret**

```
Alerte SCORIS - 23 janvier 2026

🚨 Client "Pharma Solutions SAS"
• Score actuel : 38/100 (était 72 il y a 3 mois)
• Créances en cours : 85 000 €
• Retard moyen : 68 jours (vs 45 jours contractuel)
• Facteurs de risque :
  - 2 paiements partiels récents (50%)
  - DSO en hausse : +23 jours sur 6 mois
  - Secteur pharma : délais longs mais normalement fiable

💡 Recommandation P1 : Relance + suspension nouvelles commandes
Impact si impayé total : -85 000 € (runway -12 jours)
Probabilité d'impayé : 62%
```

**Livrables**

- Dashboard scoring clients (vert/orange/rouge)
- Prévisions d'encaissements pondérées par probabilité
- Alertes proactives avant criticité

**Pourquoi c'est fort**

- **Autonome** : fonctionne seul
- **Binôme naturel avec TRESORIS** : trésorerie + créances = vision cash complète

**Autonomie :** Fonctionne seul. Combo puissant avec TRESORIS.

---

## 🔮 4. SCENARIS - Décisions Sous Incertitude

### Agent stratégique

**Question posée :** "Quelle option est la moins risquée maintenant ?"

**Le Problème**

"Et si on perd notre client n°1 ?"
"Et si les taux augmentent de 2 points ?"
"Et si on recrute 3 personnes au lieu de 2 ?"

**Constat terrain :** Les CEO/DAF font ces simulations mentalement ou dans Excel... et se trompent souvent.

**Mission**

Générer et comparer des scénarios financiers (optimiste, réaliste, pessimiste) pour éclairer les décisions stratégiques.

**Cycle autonome**

1. **Collecte** : données actuelles (CA, charges, trésorerie, BFR)
2. **Définition scénarios** : variations CA, coûts, délais paiement, investissements
3. **Simulation** : impact trésorerie, rentabilité, runway sur 12-24 mois
4. **Comparaison** : scénario A vs. B vs. C (avec probabilités pondérées)
5. **Recommandations** : meilleur scénario selon objectif (croissance, stabilité, rentabilité)
6. **STOP** : validation CEO/DAF requise

**Exemple concret**

```
Simulation SCENARIS - Recrutement 2026

Question : Recruter 2 ou 3 commerciaux en T1 ?

📊 Scénario 1 : 2 commerciaux
• Coût : +120 000 €/an
• CA attendu : +180 000 €/an
• Runway : 45j → 38j (T1), puis 52j (T4)

📊 Scénario 2 : 3 commerciaux
• Coût : +180 000 €/an
• CA attendu : +240 000 €/an
• Runway : 45j → 31j (T1), puis 48j (T4)

📊 Scénario 3 : 2 en T1 + 1 en T3
• Coût : +165 000 €/an
• CA attendu : +210 000 €/an
• Runway : 45j → 38j (T1), 36j (T3), puis 54j (T4)

🎯 Recommandation : Scénario 3 (optimal)
• Réduit risque tension T1-T2
• Runway >30j en permanence
• CA à 87% du scénario 2, coût à 92%
```

**Livrables**

- Comparaison visuelle 3-5 scénarios (tableaux + graphiques)
- Impact trésorerie, rentabilité, runway
- Probabilité de chaque scénario

**Pourquoi c'est fort**

- **Utilisé ponctuellement** : pas quotidien, mais critique pour grandes décisions
- **Très premium** : valorisation élevée (stratégique > opérationnel)

**Autonomie :** Fonctionne seul. Complète TRESORIS pour les décisions long terme.

---

## Agents Écartés Volontairement (et Pourquoi)

### ❌ BUDGETIS - Analyse Écarts Budget vs. Réel

**Pourquoi écarté :**
- Utile, mais trop "contrôle"
- Pas assez différenciant IA (Excel fait déjà ça)
- Se vend moins bien seul

**Statut :** Reviendra plus tard comme **feature**, pas comme agent.

---

### ❌ INVESTIS - Évaluation ROI Investissements

**Pourquoi écarté :**
- Très bon, mais **trop situationnel**
- Moins fréquent (investissements = ponctuels)
- Mieux intégré dans **SCENARIS V1** ("scénario investissement")

**Statut :** Fonctionnalité de SCENARIS, pas agent standalone.

---

## Logique de Combinaisons

### Principe

Chaque agent peut s'**auto-suffire**, mais les combinaisons sont **naturelles**.

### 🔗 Duo (combinaisons recommandées)

**TRESORIS + SCORIS → Sécurité cash**
- Trésorerie + créances clients = vision complète du risque cash

**TRESORIS + MARGIS → Cash + rentabilité**
- Où va le cash + où sont les marges = pilotage complet

**TRESORIS + SCENARIS → Pilotage stratégique**
- Cash actuel + scénarios futurs = décisions éclairées

---

### 🔗 Trio (packages naturels)

**TRESORIS + SCORIS + MARGIS**
- Vision : Cash + Créances + Rentabilité
- Cible : DAF qui veut une vision 360° opérationnelle

**TRESORIS + MARGIS + SCENARIS**
- Vision : Cash + Rentabilité + Stratégie
- Cible : CEO qui prend des décisions structurantes

---

### 🔗 Quatuor (suite complète)

**Les 4 agents : TRESORIS + MARGIS + SCORIS + SCENARIS**
- Vision : DAF augmenté complet (sans bullshit)
- Cible : PME >5M€ CA, holdings, cabinets DAF

---

## Récapitulatif : Les 4 Agents

| Agent | Question | Force principale | Autonomie | Combo naturel |
|-------|----------|------------------|-----------|---------------|
| **TRESORIS** | Est-ce que je vais me prendre un mur de cash ? | Requalification risques trésorerie | ⭐⭐⭐ Seul | + SCORIS ou MARGIS |
| **MARGIS** | Où est-ce que je gagne vraiment ? | Révèle marges cachées | ⭐⭐⭐ Seul | + TRESORIS |
| **SCORIS** | Qui va payer en retard ou pas ? | Anticipation impayés | ⭐⭐⭐ Seul | + TRESORIS |
| **SCENARIS** | Quelle option est la moins risquée ? | Simulation décisions stratégiques | ⭐⭐ Ponctuel | + TRESORIS |

---

## Philosophie Commune des 4 Agents

### 1. Hyper-spécialisation

Chaque agent fait **une seule chose**, mais la fait **mieux qu'un humain** (continuité, rigueur, exhaustivité).

### 2. Cycle autonome avec STOP

```
Collecte → Analyse → Détection → Contextualisation → Recommandations → STOP
```

L'agent s'arrête avant la décision. **Le DAF/CEO décide toujours.**

### 3. Pas de bruit, que du signal

Fini les rapports de 50 pages. Chaque agent livre :
- 2-5 alertes critiques maximum
- 3 recommandations hiérarchisées
- Des chiffres actionnables (montants, impacts, délais)

### 4. Gouvernance stricte

- Aucun accès aux systèmes bancaires ou ERP d'exécution
- Aucun engagement automatique
- 100% du pouvoir reste chez le DAF/CEO

### 5. Auto-suffisance

**Chaque agent doit :**
- Répondre à **UNE question claire**
- Livrer **2-5 décisions max**
- Ne dépendre d'**aucun autre pour être utile**

---

## Faisabilité Technique

### Stack commun (réutilisable)

```
Backend : FastAPI (Python)
Data : Pandas, NumPy pour calculs
ML : Scikit-learn, XGBoost (pour SCORIS)
LLM : Claude 3.5 Sonnet (contextualisation)
Frontend : Next.js 14 + TypeScript + Tailwind
Viz : Recharts, D3.js
Temps réel : WebSocket
```

### Complexité par agent

| Agent | Complexité | Temps dev estimé | Valeur business | Priorité |
|-------|-----------|------------------|-----------------|----------|
| TRESORIS | Moyenne | ✅ Fait | Très haute | P0 (fait) |
| MARGIS | Moyenne | 4-5 semaines | Très haute | P1 |
| SCORIS | Élevée | 6-8 semaines | Haute | P2 |
| SCENARIS | Élevée | 6-8 semaines | Très haute | P3 |

---

## Modèle Commercial Possible

### Option 1 : Agent standalone

- 1 agent = 150-300 €/mois
- Cible : PME 1-5M€ CA avec besoin spécifique

### Option 2 : Duo (recommandé)

- Pack Cash : TRESORIS + SCORIS = 400 €/mois
- Pack Pilotage : TRESORIS + MARGIS = 450 €/mois
- Pack Stratégie : TRESORIS + SCENARIS = 500 €/mois

### Option 3 : Trio

- Pack DAF Pro : TRESORIS + SCORIS + MARGIS = 600 €/mois
- Pack CEO : TRESORIS + MARGIS + SCENARIS = 650 €/mois

### Option 4 : Suite complète (4 agents)

- All-in : 900 €/mois
- Cible : PME 10M€+ ou holdings multi-entités

### Option 5 : White-label pour cabinets DAF

- Licence cabinet : 2000-3000 €/mois
- Utilisation illimitée pour tous les clients du cabinet

---

## Roadmap

### Court terme (3 mois)

1. ✅ Finaliser TRESORIS (V1 production-ready)
2. Développer MARGIS (valeur très élevée, relativement simple)
3. Tester avec 3-5 clients pilotes

### Moyen terme (6 mois)

4. Développer SCORIS (anticipation impayés = gros pain point)
5. Intégration TRESORIS + SCORIS (alerte trésorerie + créances)
6. Lancement packs Duo

### Long terme (12 mois)

7. Développer SCENARIS (stratégique, premium)
8. Suite complète disponible
9. White-label pour cabinets

---

## Conclusion

TRESORIS a prouvé qu'un agent IA hyper-spécialisé peut **retirer de la peine** au DAF/CEO en transformant le bruit en signal.

Ces **3 agents complémentaires** étendent cette philosophie :
- **MARGIS** : Où sont mes vraies marges ?
- **SCORIS** : Qui va payer ou non ?
- **SCENARIS** : Quelle option choisir ?

**Ensemble, ils forment un "DAF augmenté"** :
- L'analyse lourde est faite par l'IA
- Les décisions stratégiques restent humaines

**4 agents = choix maîtrisé, pas buffet.**

---

**Créé : 23 janvier 2026**  
**Par : Otmane Boulahia | ZineInsights**  
**Pour : DAF, CEO, Cabinets d'expertise comptable**
