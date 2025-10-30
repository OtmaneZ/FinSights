# 🚀 Roadmap FinSight v1.0 — Octobre à Décembre 2025
**Objectif global :** Passer de MVP fonctionnel à produit démontrable et vendable (FinSight v1.0)

---

## ✅ Phase 1 — Fonctionnalité cœur (terminée)
**But :** connecter la donnée réelle au dashboard

### Ce qui est déjà en place :
- [x] `dataParser.ts` → Parsing CSV intelligent
- [x] `upload.ts` → API upload réelle
- [x] `FinancialDashboard.tsx` → Upload connecté
- [x] Fichier test réaliste `test-data.csv`

### Ce que cela permet :
1. [x] Upload d’un vrai CSV
2. [x] Parsing automatique des colonnes
3. [x] Génération de vrais KPIs
4. [x] Mise à jour du dashboard en temps réel

---

## 🧠 Phase 2 — Pipeline Data & IA (en cours)
**But :** transformer les données importées en intelligence exploitable

### Étapes techniques :
- [ ] Ajouter une couche de **nettoyage automatique tolérant** (ex: détection colonnes “montant/date/client”)
- [ ] Créer un modèle interne de données (`dataModel.ts`) pour uniformiser les structures
- [ ] Connecter le **Copilote IA** au JSON du dashboard
- [ ] Endpoint `/api/insights` pour générer les analyses textuelles automatiques
- [ ] Gestion d’un **cache mémoire / DuckDB local** pour requêtes rapides

### Résultat attendu :
> FinSight comprend les données brutes, les nettoie légèrement, puis en tire des insights IA contextuels.

---

## 🧱 Phase 3 — Produit & UX (novembre)
**But :** rendre FinSight vendable et agréable à utiliser

### Tâches :
- [ ] Ajouter un loader / animation “Analyse en cours…” après upload
- [ ] Créer une **page “Historique des fichiers”**
- [ ] Interface de prévisualisation avant dashboard
- [ ] Intégration visuelle du **Copilote IA FinSight**
- [ ] Amélioration responsive (mobile & tablette)

---

## 💼 Phase 4 — Démo & Validation marché (fin novembre)
**But :** tester FinSight sur de vraies données d’entreprise

### Actions :
- [ ] Sélectionner 3 fichiers PME réels (compta, ventes, trésorerie)
- [ ] Faire 3 sessions de test en direct (DAF / cabinet)
- [ ] Collecter les feedbacks : pertinence, vitesse, compréhension IA
- [ ] Enregistrer une **vidéo de démo officielle**
- [ ] Mettre en ligne une **version démo publique** (Vercel)

---

## 💰 Phase 5 — Offre commerciale (décembre)
**But :** transformer FinSight en produit monétisable

### Livrables :
- [ ] Page “Offre” : *Dashboard IA livré en 48h*
- [ ] Pack “Audit gratuit + démo live”
- [ ] Formulaire de contact + upload sécurisé
- [ ] Landing pro sur [zineinsight.com/finsight](https://zineinsight.com/finsight)
- [ ] Documentation produit (README + PDF de présentation)

---

## 🔮 Phase 6 — Vision 2026 (préparation)
**But :** construire la base du futur SaaS FinSight

### Prévisions :
- [ ] Hébergement data stable (Supabase ou Cloudflare KV)
- [ ] Comptes utilisateurs et sessions
- [ ] Intégration API comptable (Pennylane, QuickBooks)
- [ ] Mode “FinSight as a Service”
- [ ] Tableau de bord multi-entreprises (cabinet comptable)

---

## 📊 Indicateurs de succès
| Indicateur | Objectif | État |
|-------------|-----------|------|
| Upload CSV → Dashboard fonctionnel | 100 % | ✅ |
| Insight IA sur données réelles | 100 % | 🔄 En cours |
| 3 démos clients réussies | ≥ 3 | 🔜 Novembre |
| Site + landing publique | 1 en ligne | 🔜 Décembre |
| Premiers leads / RDV DAF | ≥ 5 | 🔜 Décembre |

---

### 🧩 Synthèse
> FinSight v1.0 est à 80 % complet techniquement.
> Les 20 % restants (pipeline IA, UX, démo clients) feront la différence entre un **prototype inspirant** et un **produit vendable**.
> Tu es à 6 à 8 semaines d’une version professionnelle présentable au marché.

---