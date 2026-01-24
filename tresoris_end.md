# 📋 TRESORIS - Spécifications Agent Idéal
**Version finale des features pour agent IA autonome de trésorerie temps réel**

> **📊 ANALYSE COMPARATIVE DISPONIBLE**  
> **3 lectures au choix selon ton temps :**
> 
> - **5 min** : [`agent-DAF/GAP_ANALYSIS.md`](./agent-DAF/GAP_ANALYSIS.md) - Vue d'ensemble visuelle
> - **10 min** : [`agent-DAF/ETAT_DES_LIEUX.md`](./agent-DAF/ETAT_DES_LIEUX.md) - État + roadmap + métriques
> - **45 min** : [`agent-DAF/ANALYSE_ETAT_VS_IDEAL.md`](./agent-DAF/ANALYSE_ETAT_VS_IDEAL.md) - Analyse détaillée complète
>
> **Ce qui existe :** ✅ TRESORIS V1 opérationnel (37% de l'agent idéal)  
> **Ce qui manque :** � Connexions temps réel, ML prédictif, autonomie avancée  
> **Pour y arriver :** 🚀 12-14 mois, 200K€, 4 phases (Production → Temps Réel → Prédictif → Autonomie)

---

Voici une liste structurée, exhaustive et réaliste des features nécessaires pour un agent IA full autonome de gestion de trésorerie temps réel pour PME, en distinguant Backend (cerveau, données, décisions) et Frontend (pilotage, lisibilité, contrôle humain).
Je reste volontairement produit-centré et non technique (pas de code), dans une logique FinSight-compatible.

⸻

1. BACKEND — Le cerveau autonome

A. Connexion & ingestion des données (temps réel)
	•	Connexion bancaire (Open Banking / agrégateurs)
	•	Synchronisation quotidienne / intra-journalière des comptes
	•	Import factures clients (ERP, CRM, Excel, API)
	•	Import factures fournisseurs
	•	Import paie, charges sociales, TVA, impôts
	•	Historique bancaire nettoyé (normalisation, libellés)

⸻

B. Moteur de classification intelligente
	•	Catégorisation automatique des flux (clients, charges fixes, variables, exceptionnelles)
	•	Reconnaissance récurrent / non récurrent
	•	Détection d’anomalies de flux
	•	Apprentissage progressif par correction utilisateur
	•	Tagging stratégique (essentiel / compressible / critique)

⸻

C. Modèle de trésorerie temps réel
	•	Calcul du cash disponible réel (et non comptable)
	•	Projection glissante J+7 / J+30 / J+90
	•	Cash burn / cash build dynamique
	•	Solde plancher de survie (runway réel)
	•	Séparation cash opérationnel vs cash stratégique

⸻

D. Moteur prédictif & scénarios
	•	Prévision encaissements clients (retards probables)
	•	Prévision décaissements (charges incompressibles)
	•	Simulation stress (-10 %, -20 %, -30 % CA)
	•	Détection de points de rupture cash
	•	Score de probabilité de défaut de trésorerie

⸻

E. Moteur décisionnel autonome (cœur IA)
	•	Priorisation automatique des paiements
	•	Décision : payer / retarder / renégocier
	•	Recommandations d’actions correctives
	•	Arbitrage court terme (liquidité > rentabilité)
	•	Moteur de règles personnalisables (seuils, contraintes)

⚠️ Option full autonome :
L’agent exécute directement certaines décisions validées à l’avance.

⸻

F. Système d’alertes intelligentes
	•	Alerte tension cash imminente
	•	Alerte client à risque (retard probable)
	•	Alerte charge dangereuse
	•	Alerte seuil critique franchi
	•	Escalade automatique (mail / SMS / Slack)

⸻

G. Apprentissage & amélioration continue
	•	Feedback loop utilisateur
	•	Ajustement des modèles prédictifs
	•	Historique des décisions IA vs résultats
	•	Scoring de fiabilité des prévisions
	•	Mémoire stratégique entreprise (ADN financier)

⸻

H. Sécurité & gouvernance
	•	Logs de décisions IA
	•	Justification explicable (XAI)
	•	Droits utilisateurs (CEO, DAF, expert)
	•	Mode shadow / semi-autonome / full autonome
	•	Kill switch humain immédiat

⸻

2. FRONTEND — Le cockpit du dirigeant

A. Dashboard principal (1 écran = 1 vérité)
	•	Cash disponible aujourd’hui
	•	Projection J+30 / J+90
	•	Runway en mois
	•	Stress level visuel (vert / orange / rouge)
	•	Message clair de l’agent (“Situation sous contrôle / à risque”)

⸻

B. Vue trésorerie détaillée
	•	Timeline des flux futurs
	•	Encaissements vs décaissements
	•	Charges fixes / variables
	•	Cash minimum atteint prévu
	•	Visualisation des goulets d’étranglement

⸻

C. Centre de décisions IA
	•	Recommandations proposées
	•	Décisions prises automatiquement
	•	Décisions en attente de validation
	•	Justifications en langage naturel
	•	Historique & impact mesuré

⸻

D. Scénarios interactifs
	•	Slider CA / délais clients
	•	Test suppression / report de charges
	•	Visualisation instantanée impact cash
	•	Comparaison scénario réel vs stress

⸻

E. Alertes & actions
	•	Centre d’alertes priorisées
	•	Actions suggérées en 1 clic
	•	Marquage “traité / ignoré / différé”
	•	Escalade automatique configurable

⸻

F. Paramétrage stratégique
	•	Seuil cash minimal
	•	Priorités de paiement
	•	Tolérance au risque
	•	Mode autonomie IA
	•	Contraintes légales / éthiques

⸻

G. Interface confiance & contrôle
	•	Journal des décisions IA
	•	Explication simple du raisonnement
	•	Mode audit (expert-comptable, investisseur)
	•	Export rapports (PDF, board, banque)

⸻

3. FEATURES DIFFÉRENCIANTES (haut de gamme)
	•	CFO virtuel narratif : synthèse hebdomadaire écrite
	•	Score FinSight™ Trésorerie (lisible, comparable)
	•	Agent conversationnel cash-centric
	•	Détection signaux faibles (avant la crise)
	•	Recommandations non évidentes (contre-intuitives)

⸻

4. Ce qui fait la vraie différence (vérité terrain)

❌ Ce n'est pas la data
❌ Ce n'est pas l'IA brute
✅ C'est la capacité à décider sous contrainte de cash

Un bon agent trésorerie sacrifie la rentabilité pour survivre,
un excellent agent anticipe pour ne jamais sacrifier.

---

## 📊 ÉTAT ACTUEL vs IDÉAL

### ✅ TRESORIS V1 (Janvier 2026) - Ce qui existe
- ✅ **Architecture solide** : FastAPI + Next.js + Claude LLM
- ✅ **Cycle autonome** : Monitoring → Trigger → Requalification → Actions → STOP
- ✅ **Requalification risques** : 26 situations → 2-5 vrais risques (CERTAIN/UNCERTAIN/CRITICAL)
- ✅ **Calculs déterministes** : Position trésorerie, runway, prévisions 4/8/13 semaines
- ✅ **Propositions actions** : P1/P2/P3 avec justifications
- ✅ **Gouvernance stricte** : Validation DAF requise, 0 accès bancaire
- ✅ **Frontend MVP** : Dashboard fonctionnel avec visualisations

### 🔴 Ce qui manque pour l'agent idéal
**Connexions temps réel (Backend A)**
- ❌ Open Banking / agrégateurs bancaires
- ❌ API ERP (Pennylane, QuickBooks, Sage)
- ❌ Synchronisation automatique quotidienne

**Intelligence prédictive (Backend D)**
- ❌ Modèles ML retards clients
- ❌ Simulation Monte Carlo
- ❌ Stress tests automatiques (-10%, -20%, -30%)

**Autonomie décisionnelle (Backend E)**
- ❌ Priorisation automatique paiements
- ❌ Mode semi-autonome / full autonome
- ❌ Optimisation multi-objectifs

**Apprentissage continu (Backend G)**
- ❌ Feedback loop utilisateur
- ❌ Ajustement automatique seuils
- ❌ Track accuracy prévisions vs réel

**Frontend avancé**
- ❌ Scénarios interactifs (sliders, simulations)
- ❌ CFO virtuel narratif (synthèses hebdo)
- ❌ Mode audit complet
- ❌ Centre décisions avec historique impact

### 📈 Score Global : **37% de l'agent idéal**

### 🚀 Pour atteindre 100%
**Timeline estimée :** 12-14 mois
**Effort estimé :** 1900-2300h développement
**Coût estimé :** ~200K€ (équipe 2-3 personnes)

**Phases recommandées :**
1. **Q1 2026** (3 mois) : Production Ready (BDD, tests, monitoring, CI/CD)
2. **Q2 2026** (3 mois) : Temps Réel (Open Banking, ERP, classification ML)
3. **Q3 2026** (3 mois) : Prédictif (ML, Monte Carlo, scénarios interactifs)
4. **Q4 2026** (3 mois) : Autonomie (décisions avancées, CFO virtuel, apprentissage)

---

**💡 Voir `agent-DAF/ANALYSE_ETAT_VS_IDEAL.md` pour le détail complet de l'analyse comparative.**
