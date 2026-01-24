# 📊 ANALYSE : État Actuel vs Agent Idéal
**Date:** 24 janvier 2026  
**Projet:** Agent DAF / TRESORIS  
**Référence:** Comparaison avec `tresoris_end.md` (spécifications agent autonome idéal)

---

## 🎯 RÉSUMÉ EXÉCUTIF

### État Global
- ✅ **TRESORIS V1 opérationnel** (agent de requalification des risques)
- ⚠️ **30-40% des features de l'agent idéal implémentées**
- 🔴 **Manque majeur:** Connexions temps réel, prédictions ML, autonomie décisionnelle

### Roadmap Estimée
- **Phase 1 (Q1 2026):** 3-4 mois → Foundation Layer
- **Phase 2 (Q2-Q3 2026):** 5-6 mois → Intelligence Layer
- **Phase 3 (Q4 2026):** 3-4 mois → Autonomie Layer

**→ Agent idéal complet = 12-14 mois de développement**

---

## 1. BACKEND — Le cerveau autonome

### A. Connexion & ingestion des données (temps réel)

#### ✅ CE QUI EXISTE ACTUELLEMENT

```python
# Ingestion manuelle via CSV
- ✅ Import CSV transactions bancaires (bank_transactions.csv)
- ✅ Import CSV factures clients (customer_invoices.csv)
- ✅ Import CSV factures fournisseurs (supplier_invoices.csv)
- ✅ Import CSV échéancier paiements (payment_schedule.csv)
- ✅ Normalisation automatique des données (finance.py)
```

**Fichiers:**
- `backend/engine/finance.py` (lignes 99-136): `load_data()`, `normalize_data()`
- `backend/data/` : Fichiers CSV statiques

#### 🔴 CE QUI MANQUE

```
❌ Connexion bancaire (Open Banking / agrégateurs)
❌ Synchronisation quotidienne / intra-journalière automatique
❌ API connections (ERP, CRM)
❌ Import automatique depuis Pennylane, QuickBooks, Sage
❌ Webhook/polling pour mises à jour temps réel
❌ Gestion des authentifications OAuth
❌ Système de retry et logs d'erreurs d'import
❌ Détection automatique du format (CSV, Excel, PDF, API)
```

**Complexité:** 🔴 Élevée (6-8 semaines)  
**Impact business:** 🟢 CRITIQUE (sans ça, pas de "temps réel")

---

### B. Moteur de classification intelligente

#### ✅ CE QUI EXISTE

```python
# Classification basique existante
- ✅ Catégorisation inflow/outflow (payment_schedule.csv)
- ✅ Détection statut (pending, overdue, paid)
- ✅ Règles métier YAML (rules.yaml)
```

**Fichiers:**
- `backend/data/rules.yaml` : Seuils & règles métier

#### 🔴 CE QUI MANQUE

```
❌ Classification automatique des flux (ML-based)
❌ Reconnaissance récurrent vs. non récurrent
❌ Détection d'anomalies de flux (isolation forest, z-score)
❌ Apprentissage progressif par correction utilisateur
❌ Tagging stratégique (essentiel / compressible / critique)
❌ Enrichissement automatique (API services tiers)
❌ Détection de doublons et consolidation
```

**Complexité:** 🟡 Moyenne (3-4 semaines)  
**Impact business:** 🟢 Élevé (différenciation IA)

---

### C. Modèle de trésorerie temps réel

#### ✅ CE QUI EXISTE

```python
# Calculs déterministes actuels
- ✅ Cash disponible réel (calculate_treasury_position)
- ✅ Projection 4/8/13 semaines (calculate_forecast)
- ✅ Cash runway en jours
- ✅ Séparation encaissements/décaissements
- ✅ Pondération par probabilité (basique)
```

**Fichiers:**
- `backend/engine/finance.py` (lignes 172-315): Calculs trésorerie
- Structures: `TreasuryPosition`, `CashForecast`

#### 🔴 CE QUI MANQUE

```
❌ Cash burn / cash build dynamique
❌ Solde plancher de survie (runway réel vs contractuel)
❌ Séparation cash opérationnel vs cash stratégique
❌ Calcul BFR normatif et tendanciel
❌ Détection des variations intra-semaine
❌ Prévisions J+7 granulaires (jour par jour)
❌ Ratios financiers avancés (Quick ratio, Cash ratio, etc.)
```

**Complexité:** 🟡 Moyenne (2-3 semaines)  
**Impact business:** 🟡 Moyen (amélioration qualité)

---

### D. Moteur prédictif & scénarios

#### ✅ CE QUI EXISTE

```python
# Prévisions basiques
- ✅ Prévisions encaissements (pondération probabilité basique)
- ✅ Prévisions décaissements (échéancier fixe)
- ✅ 3 horizons (4/8/13 semaines)
- ✅ Détection seuils critiques
```

**Fichiers:**
- `backend/engine/finance.py` (lignes 234-315): `calculate_forecast()`

#### 🔴 CE QUI MANQUE

```
❌ Prévision ML encaissements clients (retards probables)
❌ Simulation stress (-10%, -20%, -30% CA)
❌ Simulation Monte Carlo (1000+ scénarios)
❌ Détection de points de rupture cash
❌ Score probabilité de défaut de trésorerie
❌ Modèle saisonnier (règles.yaml existe mais non utilisé)
❌ Apprentissage patterns de paiement par client
❌ Intégration facteurs externes (secteur, macro)
```

**Complexité:** 🔴 Élevée (6-8 semaines)  
**Impact business:** 🟢 TRÈS ÉLEVÉ (cœur de la valeur prédictive)

---

### E. Moteur décisionnel autonome (cœur IA)

#### ✅ CE QUI EXISTE

```python
# Recommandations actuelles
- ✅ Détection 26 situations anormales (detect_risks)
- ✅ Requalification CERTAIN/UNCERTAIN/CRITICAL (risk_agent.py)
- ✅ Propositions d'actions P1/P2/P3 (max 3 actions)
- ✅ STOP avant décision (validation DAF requise)
- ✅ Justifications textuelles (via Claude)
```

**Fichiers:**
- `backend/agent/risk_agent.py` (lignes 551-650): `propose_actions()`
- `backend/engine/finance.py` (lignes 459-589): `generate_action_plan()`

#### 🔴 CE QUI MANQUE

```
❌ Priorisation AUTOMATIQUE des paiements (règles complexes)
❌ Décision algorithmique : payer / retarder / renégocier
❌ Arbitrage court terme (liquidité > rentabilité)
❌ Moteur de règles personnalisables par utilisateur
❌ Option full autonome (exécution directe)
❌ Optimisation multi-objectifs (cash + relation client + coût)
❌ Historique décisions IA vs résultats réels
```

**Complexité:** 🔴 Très élevée (8-10 semaines)  
**Impact business:** 🟢 GAME CHANGER (autonomie réelle)

**⚠️ Note:** L'option full autonome (exécution bancaire) nécessite:
- Partenariats bancaires
- Conformité réglementaire (DSP2)
- Assurance & responsabilité juridique
- **Timeline:** +6-12 mois supplémentaires

---

### F. Système d'alertes intelligentes

#### ✅ CE QUI EXISTE

```python
# Alertes basiques
- ✅ Détection tension cash imminente (seuils YAML)
- ✅ Alerte charge dangereuse
- ✅ Websocket temps réel (main.py)
- ✅ Events: heartbeat, analysis_completed, action_validated
```

**Fichiers:**
- `backend/main.py` (lignes 66-79): `broadcast_event()`
- `backend/agent/risk_agent.py` (lignes 187-202): `emit_event()`

#### 🔴 CE QUI MANQUE

```
❌ Alerte client à risque (retard probable AVANT le retard)
❌ Escalade automatique (mail / SMS / Slack)
❌ Personnalisation seuils par utilisateur
❌ Digests hebdomadaires automatiques
❌ Alertes multi-canaux (push, email, Slack, Teams)
❌ Système de "snooze" intelligent
❌ Priorisation alertes par criticité + contexte
```

**Complexité:** 🟡 Moyenne (3-4 semaines)  
**Impact business:** 🟡 Moyen (UX et engagement)

---

### G. Apprentissage & amélioration continue

#### ✅ CE QUI EXISTE

```python
# Mémoire basique
- ✅ Stockage analyses (storage/memory_v2/)
- ✅ Historique décisions DAF (validate_action)
- ✅ Traçabilité complète (logs JSON)
```

**Fichiers:**
- `backend/agent/memory_v2.py` : Système de mémoire
- `backend/agent/risk_agent.py` (lignes 909-965): `validate_action()`

#### 🔴 CE QUI MANQUE

```
❌ Feedback loop utilisateur (rating décisions)
❌ Ajustement automatique des seuils (apprentissage)
❌ Modèles ML entraînés sur historique
❌ Scoring fiabilité des prévisions (track accuracy)
❌ Mémoire stratégique entreprise (ADN financier)
❌ Détection dérive des modèles
❌ A/B testing des recommandations
❌ Tableaux de bord "learning metrics"
```

**Complexité:** 🔴 Élevée (6-8 semaines)  
**Impact business:** 🟢 Très élevé (amélioration continue = compétitivité long terme)

---

### H. Sécurité & gouvernance

#### ✅ CE QUI EXISTE

```python
# Gouvernance actuelle
- ✅ Logs de décisions IA (memory_v2)
- ✅ Justification explicable (justification fields)
- ✅ Mode shadow/monitoring (AgentMode enum)
- ✅ Validation DAF requise (STOP avant décision)
- ✅ Aucun accès bancaire (lecture seule CSV)
```

**Fichiers:**
- `backend/agent/risk_agent.py` (lignes 40-45): Enums AgentMode
- Architecture complète décrite dans `README.md`

#### 🔴 CE QUI MANQUE

```
❌ Droits utilisateurs (CEO, DAF, expert, auditeur)
❌ Mode semi-autonome / full autonome configurable
❌ Kill switch humain immédiat (API endpoint)
❌ Audit trail complet (qui a fait quoi quand)
❌ Certification conformité (ISO, RGPD)
❌ Chiffrement données sensibles
❌ Gestion secrets (vault)
❌ Limits de responsabilité (légal)
```

**Complexité:** 🟡 Moyenne (4-5 semaines)  
**Impact business:** 🟢 CRITIQUE (confiance utilisateurs)

---

## 2. FRONTEND — Le cockpit du dirigeant

### A. Dashboard principal (1 écran = 1 vérité)

#### ✅ CE QUI EXISTE

```typescript
// Frontend Next.js existant
- ✅ Cash disponible aujourd'hui
- ✅ Projection J+30 / J+90 (via horizons 4/8 semaines)
- ✅ Runway en mois
- ✅ Stress level visuel (vert / orange / rouge)
```

**Fichiers:**
- `tresoris-dashboard/` : Frontend Next.js complet
- `frontend-bpi/` : Version Vite/React

#### 🔴 CE QUI MANQUE

```
❌ Message clair de l'agent (synthèse narrative)
❌ KPIs temps réel (auto-refresh)
❌ Comparaison vs. mois précédent
❌ Graphe évolution runway (timeline)
❌ Indicateurs secteur (benchmarking)
❌ Mode "Vue CEO" simplifiée vs "Vue DAF" détaillée
```

**Complexité:** 🟢 Faible (1-2 semaines)  
**Impact business:** 🟡 Moyen (clarté décisionnelle)

---

### B. Vue trésorerie détaillée

#### ✅ CE QUI EXISTE

```typescript
- ✅ Encaissements vs décaissements (forecast API)
- ✅ Timeline semaines (weekly_breakdown)
- ✅ Visualisation seuils critiques
```

#### 🔴 CE QUI MANQUE

```
❌ Charges fixes / variables (séparation)
❌ Cash minimum atteint prévu (avec date exacte)
❌ Visualisation des goulets d'étranglement
❌ Graphe waterfall (bridge chart)
❌ Drill-down par catégorie de flux
❌ Export Excel/PDF
```

**Complexité:** 🟡 Moyenne (2-3 semaines)  
**Impact business:** 🟡 Moyen (analyse approfondie)

---

### C. Centre de décisions IA

#### ✅ CE QUI EXISTE

```typescript
- ✅ Recommandations proposées (actions P1/P2/P3)
- ✅ Justifications en langage naturel
- ✅ Validation DAF (API validate_action)
```

#### 🔴 CE QUI MANQUE

```
❌ Décisions prises automatiquement (historique)
❌ Décisions en attente de validation (inbox)
❌ Historique & impact mesuré (avant/après)
❌ Rating des décisions passées
❌ Temps moyen de réaction DAF
❌ Dashboard efficacité des actions
```

**Complexité:** 🟡 Moyenne (3-4 semaines)  
**Impact business:** 🟢 Élevé (transparence + confiance)

---

### D. Scénarios interactifs

#### ✅ CE QUI EXISTE

```typescript
- ✅ 3 horizons de prévisions (4/8/13 semaines)
```

#### 🔴 CE QUI MANQUE

```
❌ Slider CA / délais clients (simulation interactive)
❌ Test suppression / report de charges
❌ Visualisation instantanée impact cash
❌ Comparaison scénario réel vs stress
❌ Sauvegarde scénarios personnalisés
❌ Export scénarios (board, investisseurs)
```

**Complexité:** 🟡 Moyenne (3-4 semaines)  
**Impact business:** 🟢 TRÈS ÉLEVÉ (aide décision stratégique)

---

### E. Alertes & actions

#### ✅ CE QUI EXISTE

```typescript
- ✅ WebSocket temps réel (events)
- ✅ Affichage alertes basique
```

#### 🔴 CE QUI MANQUE

```
❌ Centre d'alertes priorisées (inbox style)
❌ Actions suggérées en 1 clic
❌ Marquage "traité / ignoré / différé"
❌ Escalade automatique configurable
❌ Notifications push / email
❌ Historique alertes (archive)
```

**Complexité:** 🟢 Faible (2-3 semaines)  
**Impact business:** 🟡 Moyen (réactivité utilisateur)

---

### F. Paramétrage stratégique

#### ✅ CE QUI EXISTE

```yaml
# Règles YAML (backend)
- ✅ Seuil cash minimal (rules.yaml)
- ✅ Priorités de base (thresholds)
```

#### 🔴 CE QUI MANQUE

```
❌ Interface UI de configuration
❌ Tolérance au risque (slider)
❌ Mode autonomie IA (shadow/semi/full)
❌ Contraintes légales / éthiques (checkboxes)
❌ Seuils personnalisés par utilisateur
❌ Gestion des règles métier (no-code)
```

**Complexité:** 🟡 Moyenne (3-4 semaines)  
**Impact business:** 🟢 Élevé (personnalisation = adoption)

---

### G. Interface confiance & contrôle

#### ✅ CE QUI EXISTE

```typescript
- ✅ Journal des décisions IA (memory_v2)
- ✅ Explication simple du raisonnement (justifications)
```

#### 🔴 CE QUI MANQUE

```
❌ Mode audit (expert-comptable, investisseur)
❌ Export rapports (PDF, board, banque)
❌ Timeline complète des événements
❌ Certification des calculs (traçabilité)
❌ Comparaison prévisions vs réel (track accuracy)
```

**Complexité:** 🟡 Moyenne (3-4 semaines)  
**Impact business:** 🟢 CRITIQUE (confiance = adoption)

---

## 3. FEATURES DIFFÉRENCIANTES (haut de gamme)

### ✅ CE QUI EXISTE

```
- ✅ Agent conversationnel (via Claude LLM)
- ✅ Requalification risques (26 situations → 2-5 vrais risques)
- ✅ Cycle autonome (monitoring + trigger)
```

### 🔴 CE QUI MANQUE

```
❌ CFO virtuel narratif (synthèse hebdomadaire écrite)
❌ Score FinSight™ Trésorerie (lisible, comparable)
❌ Agent conversationnel cash-centric (Q&A dédié)
❌ Détection signaux faibles (avant la crise)
❌ Recommandations non évidentes (contre-intuitives)
❌ Benchmark secteur temps réel
❌ Prévisions macroéconomiques intégrées
```

**Complexité:** 🔴 Très élevée (8-12 semaines)  
**Impact business:** 🟢 TRÈS ÉLEVÉ (différenciation premium)

---

## 4. ARCHITECTURE & INFRASTRUCTURE

### ✅ CE QUI EXISTE

```python
# Stack actuel
- ✅ Backend: FastAPI (Python)
- ✅ LLM: Claude 3.5 Sonnet (via OpenRouter)
- ✅ Data: Pandas, NumPy
- ✅ Frontend: Next.js 14 + Tailwind CSS
- ✅ WebSocket: Temps réel natif FastAPI
- ✅ Storage: JSON local (memory_v2)
```

### 🔴 CE QUI MANQUE

```
❌ Base de données production (PostgreSQL, TimescaleDB)
❌ Cache Redis (performance)
❌ Queue système (Celery, RabbitMQ)
❌ Monitoring & observabilité (Sentry, Datadog)
❌ CI/CD automatisé
❌ Tests automatisés (unitaires, intégration, E2E)
❌ Documentation API (Swagger complet)
❌ Containerization (Docker, Kubernetes)
❌ Infrastructure as Code (Terraform)
❌ Backup & disaster recovery
```

**Complexité:** 🔴 Élevée (6-8 semaines)  
**Impact business:** 🟢 CRITIQUE (scalabilité + fiabilité)

---

## 📊 SCORECARD GLOBAL

### Complétude par Catégorie

| Catégorie | Actuellement | Idéal | Score | Gap |
|-----------|--------------|-------|-------|-----|
| **Backend - Ingestion données** | CSV manuel | Connexions temps réel | 30% | 🔴 Critique |
| **Backend - Classification** | Règles YAML | ML + apprentissage | 40% | 🟡 Moyen |
| **Backend - Modèle trésorerie** | Calculs basiques | Prédictif avancé | 60% | 🟡 Moyen |
| **Backend - Prédictions** | Pondération simple | ML + Monte Carlo | 25% | 🔴 Critique |
| **Backend - Décisions** | Recommandations | Autonomie configurable | 50% | 🟡 Moyen |
| **Backend - Alertes** | WebSocket basique | Multi-canal intelligent | 40% | 🟡 Moyen |
| **Backend - Apprentissage** | Mémoire passive | ML actif + feedback | 20% | 🔴 Critique |
| **Backend - Sécurité** | Basique | Enterprise-grade | 50% | 🟡 Moyen |
| **Frontend - Dashboard** | MVP fonctionnel | Rich & interactif | 50% | 🟡 Moyen |
| **Frontend - Scénarios** | Horizons fixes | Simulation interactive | 20% | 🔴 Critique |
| **Frontend - Contrôle** | Basique | Audit complet | 40% | 🟡 Moyen |
| **Features différenciantes** | Requalification | CFO virtuel complet | 30% | 🔴 Critique |
| **Infrastructure** | Dev local | Production ready | 25% | 🔴 Critique |

### **Score Global: 37% de l'agent idéal**

---

## 🚀 ROADMAP PRIORISÉE

### Phase 1: PRODUCTION READY (Q1 2026 - 3 mois)
**Objectif:** Déployer en production fiable

```
P0 (Bloquant):
✅ Base de données PostgreSQL
✅ Tests automatisés (unitaires + intégration)
✅ Monitoring (Sentry)
✅ CI/CD (GitHub Actions)
✅ Docker + orchestration
✅ Documentation API complète

Effort: 8-10 semaines
Impact business: BLOQUANT pour commercialisation
```

### Phase 2: TEMPS RÉEL (Q2 2026 - 3 mois)
**Objectif:** Connexions bancaires & ERP

```
P1 (Différenciant):
✅ Connexion Open Banking (API)
✅ Intégration Pennylane/QuickBooks
✅ Synchronisation automatique quotidienne
✅ Classification ML des flux
✅ Détection anomalies

Effort: 10-12 semaines
Impact business: GAME CHANGER (vraiment "temps réel")
```

### Phase 3: PRÉDICTIF (Q3 2026 - 3 mois)
**Objectif:** Intelligence prédictive

```
P1 (Différenciant):
✅ Modèle ML retards clients
✅ Simulation Monte Carlo
✅ Stress tests automatiques
✅ Score probabilité défaut
✅ Scénarios interactifs (frontend)

Effort: 10-12 semaines
Impact business: TRÈS ÉLEVÉ (valeur perçue premium)
```

### Phase 4: AUTONOMIE (Q4 2026 - 3 mois)
**Objectif:** Agent décisionnel autonome

```
P2 (Premium):
✅ Moteur décisionnel avancé
✅ Priorisation automatique paiements
✅ Mode semi-autonome
✅ Apprentissage feedback loop
✅ CFO virtuel narratif
✅ Score FinSight™

Effort: 10-12 semaines
Impact business: DIFFÉRENCIATION MAJEURE
```

---

## 💰 ESTIMATION EFFORT TOTAL

### Développement Core
- Phase 1 (Production Ready): **8-10 semaines** (400-500h)
- Phase 2 (Temps Réel): **10-12 semaines** (500-600h)
- Phase 3 (Prédictif): **10-12 semaines** (500-600h)
- Phase 4 (Autonomie): **10-12 semaines** (500-600h)

**TOTAL: 38-46 semaines (1900-2300h)**

### Équipe Recommandée
- 1 Backend Senior (Python/FastAPI/ML)
- 1 Frontend Senior (Next.js/TypeScript)
- 1 Data Scientist (ML/prédictions)
- 0.5 DevOps (infra/monitoring)

**Coût estimé (freelance/externe):**
- 2300h × 600€/jour (senior) ÷ 7h = **~200K€**

**Timeline réaliste: 10-12 mois** (avec équipe 2-3 personnes)

---

## 🎯 RECOMMANDATIONS STRATÉGIQUES

### Option A: MVP Commercial (6 mois)
**Focus:** Phase 1 + Phase 2 (Production + Temps Réel)
- Permet de commercialiser rapidement
- Différenciation suffisante vs. concurrence
- **Coût:** ~100K€

### Option B: Agent Complet (12 mois)
**Focus:** Phases 1-4 complètes
- Agent autonome pleinement différencié
- Premium pricing justifié
- **Coût:** ~200K€

### Option C: Approche Modulaire (18 mois)
**Focus:** TRESORIS → MARGIS → SCORIS → SCENARIS
- Déploiement progressif des 4 agents
- Apprentissages incrémentaux
- **Coût:** ~300K€

---

## ✅ CONCLUSION

### Forces Actuelles
1. ✅ Architecture solide (FastAPI + Next.js)
2. ✅ Cycle autonome fonctionnel
3. ✅ Requalification risques opérationnelle
4. ✅ Gouvernance stricte (STOP avant décision)
5. ✅ Frontend MVP clean

### Gaps Critiques
1. 🔴 Pas de connexions temps réel (bloquant "temps réel")
2. 🔴 Pas de ML prédictif (manque valeur perçue)
3. 🔴 Pas d'infra production (non scalable)
4. 🔴 Scénarios non interactifs (manque aide décision)

### Verdict
**TRESORIS V1 = Excellent MVP technique**  
**Agent idéal = 12-14 mois de développement supplémentaire**

**Recommandation:** Option A (MVP Commercial) pour tester le marché rapidement, puis Option B si traction confirmée.

---

**Dernière mise à jour:** 24 janvier 2026  
**Auteur:** Analyse comparative agent-DAF vs tresoris_end.md
