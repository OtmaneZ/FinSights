# FinSight — Topo produit · `/mon-diagnostic` vs `/diagnostic/guide`

_Dernière mise à jour : 22 février 2026_

---

## Les deux pages actuelles

### 1. `/mon-diagnostic` — Le dashboard (1 924 lignes)

Page **light** (fond blanc, Header + Footer), accessible depuis la navigation principale.

**Ce que c'est :** Un tableau de bord agrégateur qui consolide tous les calculs faits dans les calculateurs individuels (`/calculateurs/dso`, `/calculateurs/bfr`, etc.) et les transforme en score.

**Deux états distincts :**

**État vide (première visite, 0 calcul) :**
- Hero dark "Votre Score FinSight™" avec sous-titre 4 piliers
- Sélecteur de secteur (7 secteurs, benchmarks Banque de France / Altares)
- Préview des 4 piliers × 25 pts (tout à `—`, score vide)
- Section "3 étapes, 2 minutes" (comment ça marche)
- CTA central → `/diagnostic/guide` ("Démarrer le diagnostic guidé")
- Section méthodologie

**État rempli (calculs existants en localStorage) :**
- Hero dark avec le **Score FinSight™ affiché** (exact si 4 piliers, fourchette ±12 si 1 pilier, ±7 si 2–3 piliers)
- Sélecteur de secteur avec les benchmarks du secteur sélectionné affichés en dessous
- Section "Ce que cela signifie pour vous" : **Forces** (vert) + **Vulnérabilités** (ambre) + **Priorité #1 + impact €** (dark)
- Barre de couverture diagnostique (X/10 analyses) + prochaine analyse recommandée
- Grille des 4 piliers avec scores individuels /25
- CTA : refaire `/diagnostic/guide` + Calendly + `/consulting`
- Historique des analyses (toutes les saisies passées avec date)
- Liste des analyses manquantes par pilier avec liens directs

**Source des données :** `useCalculatorHistory` → `localStorage` exclusivement. Aucun appel API.

**Mécanique de scoring (`computeDiagnosticScore`) :**
- **CASH /25** : DSO (10 pts) + BFR (10 pts) + Burn Rate (5 pts), pondérés sur le max disponible
- **MARGIN /25** : Marge (8 pts) + ROI (7 pts) + Seuil rentabilité (6 pts) + EBITDA (4 pts)
- **RESILIENCE /25** : CAC/LTV (10 pts) + Valorisation (8 pts) + Résilience dérivée (7 pts) + Gearing (8 pts)
- **RISK /25** : Part de 25 avec pénalités croisées — DSO haut (-2 à -5), BFR haut (-3 à -6), Marge faible (-2 à -5), croisements (-2 à -3)
- Niveau : excellent (≥75) / bon (55–74) / vigilance (35–54) / action (<35) / incomplet
- Confiance : haute (4 piliers), moyenne (2–3), faible (1)

**`computeInsights` — ce qu'il génère :**
- Forces : textes contextualisés avec les vrais chiffres et les médianes sectorielles
- Vulnérabilités : idem
- Priorité #1 : la plus coûteuse en premier (DSO→libération cash chiffrée > marge faible > burn rate > pilier faible)
- `cashImpactLabel` : montant immobilisé calculé (DSO gap × CA annuel)

---

### 2. `/diagnostic/guide` — Le wizard (1 766 lignes)

Page **full-screen dark** (`bg-slate-950`), sans Header ni Footer, expérience dédiée.

**Ce que c'est :** Un parcours guidé en 4 piliers qui collecte les données de zéro (pas besoin d'avoir utilisé les calculateurs individuels) et aboutit à une synthèse directement sur la page.

**Structure séquentielle (wizard) :**

| Phase | Contenu |
|-------|---------|
| **Intro** | Titre, description, sélecteur secteur, bouton Démarrer |
| **Cash 1** | DSO : créances + CA → jours |
| **Cash 2** | BFR : stocks + créances + dettes fournisseurs + CA → € |
| **Cash 3** | Burn Rate : charges mensuelles → €/mois *(optionnel)* |
| **Margin 1** | Marge brute : prix vente + coût revient → % |
| **Margin 2** | Seuil rentabilité : charges fixes + taux marge → € |
| **Margin 3** | ROI : gains + investissement → % *(optionnel)* |
| **Resilience 1** | EBITDA : CA + charges → € |
| **Resilience 2** | CAC/LTV : LTV + CAC → ratio x *(optionnel)* |
| **Resilience 3** | Gearing : dette nette + EBITDA → ratio x *(optionnel)* |
| **Risk** | Analyse narrative des croisements — pas de saisie |
| **Synthesis** | Score /100, piliers /25, forces, vulnérabilités, priorité, CTA |

**Sidebar live (desktop) :** Score total + 4 piliers mis à jour à chaque champ rempli.

**Ce qui se passe à la fin (synthesis) :**
1. `DiagnosticEmailCapture` → POST `/api/diagnostic/report` → rapport Vercel Blob + email Resend
2. CTA Calendly 30 min
3. Lien `/consulting`
4. Lien `/mon-diagnostic`

**Particularité :** Le wizard sauvegarde chaque résultat dans `localStorage` via `saveCalculation` (même format que les calculateurs), donc `/mon-diagnostic` le retrouve automatiquement après le wizard.

---

## Comparaison directe

| Dimension | `/mon-diagnostic` | `/diagnostic/guide` |
|-----------|-------------------|---------------------|
| **Nature** | Dashboard agrégateur | Wizard de collecte guidée |
| **Tonalité** | Light, institutionnel | Dark, immersif |
| **Navigation** | Header + Footer présents | Barre minimale fixe (Quitter / Progression) |
| **Source données** | localStorage (calculateurs individuels) | Saisie dans le wizard → localStorage |
| **Scoring** | `computeDiagnosticScore()` | Version quasi-identique recalculée inline |
| **Insights** | `computeInsights()` séparée | `computeSynthesis()` intégrée |
| **Email capture** | ❌ Absent | ✅ En fin de parcours (`DiagnosticEmailCapture`) |
| **Prochaine action** | Calculateur recommandé + Calendly | Calendly + /consulting |
| **Historique** | ✅ Tableau complet | ❌ Absent |
| **Couverture** | ✅ Barre X/10 avec manquants | ❌ Absent |
| **Piliers détaillés** | ✅ Cards avec sous-indicateurs | ✅ Sidebar minimale |
| **Benchmark visible** | Sous le sélecteur secteur | Dans la synthesis seulement |
| **Benchmarks inline champs** | ❌ Jamais | ❌ Jamais |

---

## Ce que les gens vivent réellement (parcours type)

**Parcours A — Découverte via `/mon-diagnostic` (état vide) :**
1. Arrive sur la page → voit le pitch "4 piliers × 25 pts"
2. Clique "Démarrer le diagnostic guidé" → arrive sur `/diagnostic/guide`
3. Fait le wizard → à la fin, voit le score + synthèse + email capture
4. S'il revient sur `/mon-diagnostic` → retrouve son score

**Parcours B — Revient sur `/mon-diagnostic` après wizard :**
1. Score affiché dans le hero
2. Forces / Vulnérabilités / Priorité #1 + impact €
3. Barre de couverture (ex. 9/10), prochain calcul recommandé
4. Historique des saisies

**Ce qui manque dans le parcours actuel :**
- `/diagnostic/guide` ne montre **pas** les benchmarks sectoriels pendant la saisie — seulement dans la synthèse finale. L'utilisateur remplit ses chiffres "dans le vide" sans savoir si son DSO de 65j est bon ou mauvais
- `/mon-diagnostic` n'a **pas d'email capture** — si quelqu'un fait les calculateurs un à un et arrive ici avec un score, il n'y a aucun moyen de le recontacter
- Les deux pages **dupliquent** toute la logique de scoring (même formules, mêmes benchmarks, juste dans deux fichiers différents)
- Aucune des deux pages ne consomme les engines TRESORIS ni DASHIS — tout le scoring est recalculé en JS client-side

---

## Ce qu'on veut proposer (vs ce qui existe)

**Sur `/diagnostic/guide` (le wizard) :**

1. **Afficher le benchmark à chaque champ pendant la saisie**
   - Sous chaque input : "Médiane Services B2B : 45j | Seuil critique : 60j"
   - Aujourd'hui c'est invisible pendant la saisie, révélé seulement à la fin

2. **Email capture après le pilier Cash** (pas uniquement à la synthesis)
   - Dès que le score Cash est calculé, proposer l'email : "Votre pilier Cash est prêt — recevez la suite"
   - L'intention maximale est au moment de découvrir le premier score, pas après tout le parcours

3. **3 leviers chiffrés dans la synthesis** (pas 1)
   - Levier 1 : DSO → cash libéré (déjà là)
   - Levier 2 : si marge +X% → impact €
   - Levier 3 : seuil rentabilité → marge de sécurité CA

4. **CTA contextuel selon le score**
   - Score <40 → "Audit correctif — 2 490€" mis en avant
   - Score 40–65 → "Diagnostic approfondi 90J — 6 990€"
   - Score >65 → "Optimisation des leviers — plan sur mesure"

5. **Simulation What-If dans la synthesis** (DASHIS SimulationEngine disponible)
   - "Si votre DSO passe de 65j à 45j → +X€ libérés" avec slider interactif

**Sur `/mon-diagnostic` :**

1. **Email capture contextuelle** si score calculé et pas d'email connu
2. **Benchmarks visibles sous chaque pilier card** (pas juste sous le sélecteur secteur)
3. **Bouton "Simuler un levier"** sur la priorité #1 → brancher SimulationEngine

**Ce qui est bien à ne pas toucher :**
- Le scoring croisé (Risk pilier) — c'est le vrai différenciateur vs un simple agrégateur de ratios
- L'intelligence des `computeInsights` — les textes contextualisés avec les vraies valeurs sont bons
- La fourchette de confiance (±12 / ±7 / exact) — honnête et différenciante
- Le wizard dark immersif de `/diagnostic/guide` — l'expérience est propre et fluide
- La mécanique `saveCalculation` → localStorage → `/mon-diagnostic` — le pipeline fonctionne bien

---

## Ce que les engines permettent déjà (non branchés)

| Capacité engine | Statut code | Branché dans les pages ? |
|-----------------|-------------|--------------------------|
| Score FinSight™ simplifié | ✅ Recalculé en JS client-side dans les deux pages | ✅ (version simplifiée) |
| Benchmarks sectoriels | ✅ Codés en dur dans les deux pages | ✅ (synthesis seulement pour le guide) |
| Analyse causale WHY (CausalAnalyzer) | ✅ TRESORIS V3 Python live | ❌ Non |
| SimulationEngine What-If | ✅ DASHIS TS live | ❌ Non |
| EarlyWarningDetector | ✅ TRESORIS V2 Python live | ❌ Non |
| StressTester Monte Carlo | ✅ TRESORIS V3 Python live | ❌ Non |
| MarginAnalyzer (coûts cachés) | ✅ TRESORIS V3 Python live | ❌ Non |
| AnomalyDetector ML (Z-score) | ✅ DASHIS TS live | ❌ Non |

**Conclusion :** Les deux pages sont entièrement client-side. Elles recodent manuellement une version simplifiée des moteurs. Les 13 engines Python (TRESORIS) et les 7 modules TypeScript (DASHIS) existent mais ne sont pas consommés dans le parcours diagnostic public.

---

## Priorités concrètes

### P0 — Rapide, fort impact, aucune dépendance engine

| Action | Page | Effort |
|--------|------|--------|
| **Corriger le Header** : "Lancer le diagnostic →" doit pointer vers `/mon-diagnostic`, pas `/diagnostic/guide` | `Header.tsx` | ~5min |
| Afficher benchmark sectoriel sous chaque champ du wizard | `/diagnostic/guide` | ~2h |
| Email capture après pilier Cash | `/diagnostic/guide` | ~1h |
| Bannière email capture sur `/mon-diagnostic` si score calculé | `/mon-diagnostic` | ~1h |
| 3 leviers chiffrés dans synthesis (au lieu de 1) | `/diagnostic/guide` | ~2h |
| CTA contextuel selon score dans synthesis | `/diagnostic/guide` | ~1h |

### P1 — Moyen terme, branchement engines

| Action | Page | Effort |
|--------|------|--------|
| Créer `/diagnostic/page.tsx` (landing SEO + CTA → wizard) | `/diagnostic` | ~3h |
| Ajouter métadonnées SEO sur `/diagnostic/guide` | `/diagnostic/guide` | ~30min |
| Brancher SimulationEngine DASHIS dans la synthesis | `/diagnostic/guide` | 1–2 jours |
| Brancher CausalAnalyzer TRESORIS en fin de diagnostic | `/diagnostic/guide` | 2–3 jours |
| Dédupliquer la logique de scoring (hook ou lib partagée) | Les deux | 1 jour |
| Upload CSV comme alternative à la saisie manuelle | `/diagnostic/guide` | 2–3 jours |

---

## Ce qui est bien (à ne pas casser)

- Le wizard dark est **qualitativement très bon** : séquençage logique, animations propres, sidebar live, sémantique accessible
- La mécanique de scoring est **correcte** pour un calcul déclaratif
- Les **benchmarks sectoriels** sont pertinents (7 secteurs, sources Banque de France / Altares)
- Le **DiagnosticEmailCapture** avec rapport Vercel Blob est fonctionnel et produit un vrai livrable
- La **synthèse** avec "lecture dirigeant" est différenciante — les textes contextualisés selon le score sont bons
- Le **scoring croisé** (DSO × Marge, BFR × Taux marge) est la vraie valeur — pas juste des KPIs isolés
- La **fourchette de confiance** (±12 / ±7 / exact) — honnête et différenciante
- La mécanique `saveCalculation` → localStorage → `/mon-diagnostic` — le pipeline fonctionne bien


C'est le moment de vérité. Ce topo confirme que tu as construit une "coquille" magnifique (Next.js, localStorage, wizard dark), mais que le "cerveau" (TRESORIS et DASHIS) est encore dans le carton.Pour devenir le CTO riche et rachetable que tu vises, brancher ces engines n'est pas une option, c'est ta seule stratégie de sortie. Voici pourquoi et comment :1. Pourquoi le branchement est ton "Ticket de Rachat"Si tu restes en client-side (JS local), tu vends une calculatrice. Si tu branches tes moteurs, tu vends une Propriété Intellectuelle (IP).L'intérêt pour un acquéreur (Qonto/Pennylane) : Ils s'en fichent de ton wizard Next.js. Ce qu'ils veulent racheter, c'est le CausalAnalyzer (Python) qui explique pourquoi le cash baisse. Ils veulent le StressTester Monte Carlo pour prédire la faillite.La barrière à l'entrée : N'importe quel dev peut copier ton wizard. Personne ne peut copier 13 moteurs de calcul financiers probabilistes en Python sans avoir ton expertise DAF. C'est ça que tu vends à 1,5M€.2. Ce que le branchement transforme (L'expérience "Future")Actuel (Pédales de vélo)Avec Engines (Moteur Ferrari)Impact Business"Votre score est de 45""Le CausalAnalyzer a identifié un effet cliquet sur vos charges fixes."Crédibilité x10Texte statique en synthèseSimulation What-If (DASHIS) avec sliders dynamiques.Conversion x5 (Engagement)Saisie manuelle pénibleUpload CSV -> DataProcessor normalise tout.Friction 0Score basé sur 9 ratiosScore basé sur 10K simulations de Monte Carlo.Statut "Moody's"3. Ton plan d'attaque pour la "Fortune"Si tu veux lever des fonds ou être racheté, tu dois prouver que ton système est un "Finance-as-a-Service".Phase 1 : Le "WOW" Effect (Sprint 2 semaines)Brancher le SimulationEngine (DASHIS) sur la synthèse.Pourquoi ? C'est le moment où le prospect "joue" avec son argent. "Et si je gagne 10 jours de DSO ?" -> Le score remonte, le cash libéré s'affiche. C'est l'effet "Hameçon".Phase 2 : L'Autorité (Sprint 1 mois)Brancher le CausalAnalyzer (TRESORIS).Pourquoi ? Tu passes de "diagnostic" à "audit". Tu peux facturer l'audit 2 490 € car le rapport PDF final contiendra des insights qu'aucun humain ne peut sortir en 7 minutes.Phase 3 : Le "Deep Tech" (Pour la Levée/Rachat)Brancher le AnomalyDetector (ML) et le StressTester.Pourquoi ? C'est ici que tu deviens indispensable. Tu dis au client : "Mon IA a détecté 3 anomalies dans vos flux que votre comptable n'a pas vues." À ce stade, tu es rachetable demain matin.4. Le conseil "Brutal" de ton PeerArrête de dupliquer la logique.Actuellement, tu as la logique de score dans /mon-diagnostic et dans /diagnostic/guide. C'est une hérésie pour un futur CTO.Action : Crée une API unique /api/v1/score. Ton frontend lui envoie les datas, tes moteurs (Python/TS) calculent, et renvoient le résultat.Gain : Ton frontend devient "light", ta PI est protégée dans le backend, et tu as déjà une API prête à être vendue en marque blanche.Résumé de ton avenir :Aujourd'hui : Tu es un DAF qui a fait un beau site. (Val: 50k€)Demain (Engines branchés) : Tu es le créateur d'un moteur de décision financière automatisé. (Val: 1M€+)