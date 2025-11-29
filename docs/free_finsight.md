# Stratégie Contenu Gratuit FinSight - Audit & Expansion

**Date**: 27 novembre 2025
**Objectif**: Maximiser la traction via contenu gratuit de haute qualité
**Philosophie**: Zéro friction - Pas de collecte email, 100% libre accès

---

## 📊 1. AUDIT DE L'EXISTANT

### 1.1 Calculateurs (2 actifs)

#### **Calculateur DSO** (`/calculateurs/dso`)

- **Qualité**: ⭐⭐⭐⭐⭐ (9/10)
- **Fonctionnalités**:
  - ✅ Inputs: Créances clients, CA annuel
  - ✅ 4 secteurs: Services, Commerce, Industrie, SaaS
  - ✅ Résultat: DSO en jours + interprétation intelligente
  - ✅ Benchmarks sectoriels visuels (BenchmarkBar)
  - ✅ 5 recommandations actionnables selon le score
  - ✅ CTA FinSight contextualisé (suivi automatique)
  - ✅ Liens vers articles blog connexes
  - ✅ Structured Data (HowTo schema) pour SEO
  - ✅ Analytics tracking (trackCalculatorUse)
- **UX**: Animation `.surface-hover`, design premium, responsive
- **SEO**: Meta title optimisé, description rich, schema markup
- **Points forts**:
  - Interprétation à 4 niveaux (excellent/bon/surveiller/critique)
  - Seuils adaptés par secteur (ex: SaaS excellent <15j, Industrie <60j)
  - Recommandations concrètes (relances J+15, escompte 2%, facturation électronique)
- **Points d'amélioration mineurs**:
  - Ajouter export PDF du résultat (pour partage/sauvegarde)
  - Historique des calculs (localStorage) pour suivre évolution

#### **Calculateur BFR** (`/calculateurs/bfr`)

- **Qualité**: ⭐⭐⭐⭐⭐ (9.5/10)
- **Fonctionnalités**:
  - ✅ Inputs: Stocks, Créances, Dettes, CA (optionnel)
  - ✅ Résultat: BFR en € + jours de CA
  - ✅ Interprétation à 5 niveaux (négatif = excellent)
  - ✅ Analyse détaillée avec % par composante
  - ✅ Estimation DSO automatique si CA renseigné
  - ✅ 5 leviers d'optimisation (stocks, relances, négociation fournisseurs)
  - ✅ Structured Data + Analytics
- **UX**: Grille 3 colonnes, visualisation des composantes (bleu/vert/rouge)
- **SEO**: Excellente, avec section "Qu'est-ce que le BFR ?" éducative
- **Points forts**:
  - Pédagogie exceptionnelle (formule expliquée, code snippet)
  - Gestion BFR négatif (cas idéal bien expliqué)
  - Cross-selling intelligent (lien vers calculateur DSO)
- **Perfection atteinte**: Meilleur calculateur BFR du marché FR

### 1.2 Templates Excel (`/ressources/templates`)

#### **Page Templates**

- **Qualité**: ⭐⭐⭐⭐ (8/10)
- **Offre actuelle**: 3 templates
  1. **Budget Prévisionnel 2025** 🔥 Badge "Le plus téléchargé"
     - 12 mois de prévisions CA/Charges
     - Formules automatiques + graphiques
     - Compatible import FinSight
  2. **Tracker DSO Clients**
     - Liste clients + factures
     - Calcul DSO automatique
     - Alertes conditionnelles (>60j)
  3. **Dashboard Cash Flow**
     - Encaissements vs Décaissements
     - Projection 6 mois glissants
     - Indicateurs de seuil

- **Format**: Excel (.xlsx) + PDF
- **Download**: Direct download sans email gate ✅
- **UX**: Grille 3 colonnes, gradients colorés (bleu/vert/violet)
- **Compatibilité**: Excel 2016+ / Google Sheets
- **Points forts**:
  - 3 value props claires: ⚡ Prêts à l'emploi, 🔄 Import FinSight, 🎓 100% Finance FR
  - FAQ section (4 questions)
  - Double CTA: "Essayer FinSight" + "Voir la démo"

- **Points d'amélioration**:
  - ❌ **Templates non existants physiquement** (URLs fictifs)
  - ❌ Pas de preview/screenshot des templates
  - ❌ Manque templates sectoriels (retail, SaaS, industrie)
  - ❌ Pas de vidéo tutoriel "Comment l'utiliser"
  - Opportunité: Templates spécialisés (levée fonds, due diligence)

### 1.3 Hub Ressources (`/ressources/page.tsx`)

- **Qualité**: ⭐⭐⭐⭐ (8/10)
- **Structure actuelle**:
  1. Section Templates Excel (3 cards avec extraits)
  2. Section Calculateurs (2 cards DSO/BFR)
  3. Section Articles Blog (groupés par catégorie)
  4. CTA final Dashboard
- **Points forts**:
  - Architecture claire et navigable
  - Intégration intelligente avec `BLOG_ARTICLES` (import depuis `/lib/seo`)
  - Cross-linking entre ressources
- **Points d'amélioration**:
  - Manque section "Guides PDF" (future)
  - Pas de filtre par secteur (PME commerce vs SaaS)
  - Opportunité: Search bar pour ressources

---

## 🎯 2. BENCHMARK CONCURRENTIEL

### 2.1 Agicap (Leader Finance PME FR)

**Contenu gratuit**:

- ❌ Pas de calculateurs interactifs
- ✅ Templates Excel (plan trésorerie, budget prévisionnel)
- ✅ Guides PDF longs (30-50 pages)
- ⚠️ Email gate sur 90% du contenu

**Notre avantage**: Calculateurs interactifs 100% gratuits, zéro friction

### 2.2 Pennylane (Comptabilité SaaS)

**Contenu gratuit**:

- ✅ Blog très dense (150+ articles SEO)
- ✅ Calculateurs: TVA, charges sociales
- ❌ Peu de calculateurs financiers CFO/DAF
- ⚠️ Email gate sur simulateurs avancés

**Notre avantage**: Focus CFO/DAF (pas comptable), calculateurs métiers premium

### 2.3 Finom (Banque + Compta)

**Contenu gratuit**:

- ✅ Templates facture/devis (focus micro-entrepreneurs)
- ❌ Zéro calculateurs financiers
- ❌ Contenu peu technique

**Notre avantage**: Positionnement PME 1-10M€ CA, outils sophistiqués

### 2.4 Stripe (Référence internationale)

**Contenu gratuit référence**:

- ✅ Calculateurs revenus récurrents (MRR/ARR)
- ✅ Simulateurs pricing SaaS
- ✅ Guides PDF ultra-premium
- ✅ 100% gratuit, zéro friction

**Inspiration**: Architecture ressources, niveau de polish, pédagogie

---

## 🚀 3. STRATÉGIE D'EXPANSION

### 3.1 Objectifs Quantifiables

- **Court terme (3 mois)**:
  - 8-10 calculateurs actifs (vs 2 actuels)
  - 6 templates Excel réels + downloadables (vs 0 actuels)
  - 500 utilisations calculateurs/mois
  - 200 downloads templates/mois

- **Moyen terme (6 mois)**:
  - 15 calculateurs couvrant tous KPIs CFO
  - 3-5 guides PDF premium (20-30 pages)
  - 2000 utilisations calculateurs/mois
  - SEO: Top 3 Google pour 10+ requêtes "calculateur [KPI] gratuit"

### 3.2 Nouveaux Calculateurs (Priorité Haute)

#### **Tier 1 - Quick Wins (2 semaines)**

1. **Calculateur ROI** `/calculateurs/roi`
   - Inputs: Investissement initial, Gains annuels, Durée
   - Output: ROI %, Délai de retour sur investissement
   - Use case: Justifier investissement software/équipement
   - SEO: "calculateur ROI gratuit" (8100 recherches/mois FR)

2. **Calculateur Seuil de Rentabilité** `/calculateurs/seuil-rentabilite`
   - Inputs: Charges fixes, Prix vente unitaire, Coût variable unitaire
   - Output: Quantité à vendre pour rentabilité, CA seuil
   - Use case: Lancement nouveau produit/service
   - SEO: "calculer seuil de rentabilité" (5400 recherches/mois)

3. **Calculateur Marge** `/calculateurs/marge`
   - Inputs: Prix achat HT, Prix vente HT
   - Output: Marge brute €, Taux de marge %, Taux de marque %
   - Use case: Pricing produits retail/commerce
   - SEO: "calculateur marge commerciale" (4400 recherches/mois)

#### **Tier 2 - Valeur Ajoutée (1 mois)**

4. **Calculateur EBITDA** `/calculateurs/ebitda`
   - Inputs: Résultat net, Impôts, Intérêts, Amortissements
   - Output: EBITDA, Multiple EBITDA (valorisation)
   - Use case: Préparation levée fonds, due diligence
   - Target: Startups scale-up
   - SEO: "calculer ebitda" (2900 recherches/mois)

5. **Calculateur Trésorerie Nette** `/calculateurs/tresorerie`
   - Inputs: Tréso début mois, Encaissements, Décaissements, Charges exceptionnelles
   - Output: Tréso fin mois, Projection 3-6-12 mois
   - Use case: Pilotage mensuel, anticipation tensions
   - SEO: "calculateur trésorerie" (1600 recherches/mois)

6. **Calculateur Point Mort** `/calculateurs/point-mort`
   - Inputs: Charges fixes totales, Taux marge variable
   - Output: CA point mort, Mois de couverture
   - Use case: Budget prévisionnel, business plan
   - SEO: "calculer point mort" (3200 recherches/mois)

#### **Tier 3 - Premium Différenciation (2 mois)**

7. **Calculateur CAC/LTV (SaaS)** `/calculateurs/cac-ltv`
   - Inputs: Coût acquisition client, Churn mensuel, ARPU
   - Output: LTV, Ratio LTV/CAC, Mois de payback
   - Target: SaaS, abonnement
   - Différenciant: Segment très prisé (levées fonds)
   - SEO: "calculateur ltv saas" (1200 recherches/mois)

8. **Calculateur MRR/ARR Growth** `/calculateurs/mrr-arr`
   - Inputs: MRR début, Nouveaux clients, Churn, Expansion revenue
   - Output: Net MRR movement, ARR projeté, Growth rate
   - Target: SaaS, licences logiciel
   - Inspiration: Stripe revenue recognition calculator
   - SEO: "calculateur mrr" (890 recherches/mois)

9. **Calculateur Burn Rate** `/calculateurs/burn-rate`
   - Inputs: Tréso actuelle, Dépenses mensuelles, Revenus mensuels
   - Output: Burn rate net, Runway (mois avant 0€)
   - Use case: Startups pré-rentabilité
   - SEO: "calculer burn rate" (720 recherches/mois)

10. **Calculateur Ratio Liquidité** `/calculateurs/ratio-liquidite`
    - Inputs: Actif circulant, Passif circulant, Tréso disponible
    - Output: Ratio liquidité générale, Ratio liquidité immédiate
    - Use case: Analyse crédit, demande financement bancaire
    - Target: PME en recherche financement
    - SEO: "ratio liquidité calcul" (1100 recherches/mois)

### 3.3 Templates Excel à Créer (Priorité Critique)

**Action urgente**: Les 3 templates actuels sont fictifs (URLs non valides)

#### **Phase 1 - Créer les 3 Promis (1 semaine)**

1. **Budget Prévisionnel 2025** (`/public/templates/excel/budget-previsionnel-2025.xlsx`)
   - Fichier Excel professionnel 12 mois
   - Onglets: Hypothèses, CA mensuel, Charges, Synthèse, Graphiques
   - Formules: SUM, IF, VLOOKUP pour scénarios optimiste/pessimiste
   - Conditionnelles: Alertes rouges si marge <10%
   - Version PDF: Export du dashboard synthèse

2. **Tracker DSO Clients** (`/public/templates/excel/tracker-dso.xlsx`)
   - Liste clients (50 lignes exemple)
   - Colonnes: Client, Facture n°, Date émission, Montant, Date paiement prévue, Statut
   - Formules: =DAYS(TODAY(), Date_émission), Alerte >60j
   - Dashboard: DSO moyen, Top 5 retards, Créances par ancienneté
   - Version PDF: Rapport synthèse 1 page

3. **Dashboard Cash Flow** (`/public/templates/excel/dashboard-cashflow.xlsx`)
   - Projection 12 mois avec actualisation mensuelle
   - Catégories: Ventes encaissées, Achats décaissés, Salaires, Charges fixes, Investissements
   - Graphique waterfall chart (encaissements vs décaissements)
   - Indicateurs: Trésorerie minimale, Mois critiques, Buffer recommandé
   - Version PDF: Graphique + top insights

#### **Phase 2 - Templates Avancés (1 mois)**

4. **Business Plan Financier 3 ans** (levée fonds)
5. **Tableau de Bord CFO Mensuel** (15 KPIs synthétiques)
6. **Simulateur Prix de Vente** (pricing produits/services)
7. **Prévisionnel Embauches** (coûts salariaux complets)
8. **Tracker Charges Récurrentes** (abonnements SaaS, loyers)

### 3.4 Guides PDF Premium (Moyen Terme)

**Format**: 20-30 pages A4, design professionnel Canva/Figma

1. **"15 KPIs Financiers pour Piloter sa PME"** (lead magnet principal)
2. **"Guide Trésorerie 2025 : Anticiper et Piloter"** (focus DSO/BFR)
3. **"Finance SaaS : Métriques ARR/MRR/Churn"** (segment startups)
4. **"Préparer sa Levée de Fonds : Financial Model"** (Series A)
5. **"Dashboard CFO : De l'Excel au BI Automatisé"** (transformation digitale)

**Distribution**: Download direct, pas d'email gate (cohérent philosophie)

---

## 🏗️ 4. ARCHITECTURE RECOMMANDÉE

### 4.1 Option A - Hub Unifié `/ressources` (RECOMMANDÉ ⭐)

**Structure proposée**:

```
/ressources
├── Hero: "Centre de Ressources Gratuites pour CFO/DAF"
├── Navigation tabs: Calculateurs | Templates | Guides | Blog
├── Section 1: Calculateurs (10 cards grid)
│   ├── Filtre: Tous | Trésorerie | Marges | SaaS | Valorisation
│   └── Cards: DSO, BFR, ROI, Seuil rentabilité, EBITDA...
├── Section 2: Templates Excel (6-8 cards)
│   ├── Preview modal avec screenshots
│   └── Download Excel + PDF
├── Section 3: Guides PDF (3-5 cards)
│   └── Download direct
└── CTA: "Automatisez tout ça avec FinSight"
```

**Avantages**:

- ✅ SEO: Page unique forte pour "ressources financières gratuites"
- ✅ UX: Point d'entrée unique, navigation intuitive
- ✅ Conversion: Tous les chemins mènent au CTA FinSight
- ✅ Maintenance: Code centralisé, facile à étendre

**Inconvénients**:

- ⚠️ Longue page (optimiser lazy loading)
- ⚠️ Perd URLs dédiées pour SEO longtail

### 4.2 Option B - Pages Dédiées (Actuel)

**Garder structure actuelle**:

- `/calculateurs` → Landing page calculateurs
- `/calculateurs/dso`, `/calculateurs/bfr`... → Pages individuelles
- `/ressources/templates` → Landing templates
- `/ressources` → Hub léger avec liens

**Avantages**:

- ✅ SEO longtail: Chaque calculateur = page dédiée
- ✅ Chargement rapide par page
- ✅ Cohérent avec structure actuelle

**Inconvénients**:

- ⚠️ Navigation fragmentée
- ⚠️ Maintenance: 15+ pages à gérer

### 4.3 Recommandation Finale: **Hybride** 🎯

**Architecture optimale**:

1. **Garder pages dédiées calculateurs** (SEO longtail)
   - `/calculateurs/dso`, `/calculateurs/bfr`...
   - Chaque page = article SEO standalone

2. **Créer hub `/ressources` amélioré** (découvrabilité)
   - Grid complète tous calculateurs (10-15 cards)
   - Grid templates avec previews
   - Section guides PDF
   - Search bar pour filtrer

3. **Créer landing `/calculateurs`** (catégorie)
   - Hero: "10 Calculateurs Financiers Gratuits"
   - Grid avec filtres (Trésorerie, Marges, SaaS...)
   - Liens vers pages dédiées

**Bénéfice**: Best of both worlds (SEO + UX)

---

## 📈 5. MÉTRIQUES DE SUCCÈS

### 5.1 KPIs Court Terme (3 mois)

| Métrique | Baseline | Objectif 3 mois | Tracking |
|----------|----------|-----------------|----------|
| **Calculateurs actifs** | 2 | 10 | `/calculateurs/*` |
| **Templates downloadables** | 0 | 6 | `/public/templates/` |
| **Utilisations calculateurs/mois** | 0 | 500 | PostHog `calculator_used` event |
| **Downloads templates/mois** | 0 | 200 | PostHog `template_downloaded` event |
| **Trafic organique /ressources** | ? | +200% | Google Analytics |
| **Conversions Dashboard depuis ressources** | ? | 5% | Funnel analysis |

### 5.2 KPIs Moyen Terme (6 mois)

- **SEO Rankings**: Top 3 Google FR pour 10 requêtes "calculateur [KPI]"
- **Backlinks**: 20+ liens entrants vers ressources (autorité domain)
- **User retention**: 30% utilisateurs reviennent 2+ fois
- **Email signups from ressources**: 50/mois (si ajout soft gate futur)

### 5.3 Tracking Analytics

**Events PostHog à créer**:

```typescript
// /lib/analytics.ts (déjà existant, enrichir)
export const trackCalculatorUse = (calculatorName: string, result: number, inputs: any) => {
  posthog.capture('calculator_used', {
    calculator: calculatorName,
    result_value: result,
    ...inputs,
    $set: { last_calculator_used: calculatorName }
  })
}

export const trackTemplateDownload = (templateName: string, format: 'xlsx' | 'pdf') => {
  posthog.capture('template_downloaded', {
    template: templateName,
    format: format,
    $set: { templates_downloaded: { $increment: 1 } }
  })
}

export const trackResourceSearch = (searchQuery: string, resultsCount: number) => {
  posthog.capture('resource_searched', {
    query: searchQuery,
    results: resultsCount
  })
}
```

---

## ⚡ 6. PLAN D'IMPLÉMENTATION PRIORISÉ

### **Sprint 1 (Semaine 1) - CRITIQUE**

**Objectif**: Créer templates Excel promis (crédibilité)

- [ ] **Jour 1-2**: Créer Budget Prévisionnel 2025.xlsx (formules + graphiques)
- [ ] **Jour 3**: Créer Tracker DSO.xlsx (alertes conditionnelles)
- [ ] **Jour 4**: Créer Dashboard Cash Flow.xlsx (waterfall chart)
- [ ] **Jour 5**: Générer versions PDF des 3 templates
- [ ] **Jour 5**: Upload `/public/templates/excel/` + `/public/templates/pdf/`
- [ ] **Jour 5**: Tester download links, vérifier compatibilité Google Sheets

**Livrable**: 3 templates réels downloadables, page `/ressources/templates` fonctionnelle

### **Sprint 2 (Semaine 2) - Quick Wins Calculateurs**

**Objectif**: 3 nouveaux calculateurs Tier 1

- [ ] Calculateur ROI (2 jours)
- [ ] Calculateur Seuil Rentabilité (2 jours)
- [ ] Calculateur Marge Commerciale (1 jour)
- [ ] SEO: Meta titles/descriptions optimisés
- [ ] Analytics: Events tracking pour 3 nouveaux calculateurs

**Livrable**: 5 calculateurs actifs (vs 2), trafic organique +50%

### **Sprint 3 (Semaine 3-4) - Tier 2 Calculateurs**

- [ ] Calculateur EBITDA (2 jours)
- [ ] Calculateur Trésorerie Nette (3 jours)
- [ ] Calculateur Point Mort (2 jours)

**Livrable**: 8 calculateurs, coverage complète KPIs PME classiques

### **Sprint 4 (Mois 2) - Tier 3 + Hub Ressources**

- [ ] Calculateur CAC/LTV SaaS (3 jours)
- [ ] Calculateur MRR/ARR (3 jours)
- [ ] Calculateur Burn Rate (2 jours)
- [ ] Refonte `/ressources` avec navigation tabs + filtres (3 jours)
- [ ] Création landing `/calculateurs` avec grid complète (2 jours)

**Livrable**: 11 calculateurs, architecture ressources optimale

### **Sprint 5 (Mois 3) - Polish + SEO**

- [ ] Screenshots/previews templates (1 jour)
- [ ] Guide PDF "15 KPIs Financiers PME" (5 jours)
- [ ] Optimisation SEO on-page 15 pages ressources (2 jours)
- [ ] Backlink outreach (blog finance, LinkedIn) (continu)
- [ ] A/B testing CTAs conversions Dashboard (2 jours)

**Livrable**: Contenu premium complet, optimisation conversion

---

## 💰 7. POTENTIEL BUSINESS

### 7.1 Trafic Organique Estimé

**Calcul conservateur** (position moyenne 3-5 Google):

| Calculateur | Vol. recherche/mois FR | CTR 10% | Trafic/mois |
|-------------|------------------------|---------|-------------|
| DSO | 2400 | 10% | 240 |
| BFR | 1800 | 10% | 180 |
| ROI | 8100 | 10% | 810 |
| Seuil rentabilité | 5400 | 10% | 540 |
| Marge commerciale | 4400 | 10% | 440 |
| EBITDA | 2900 | 10% | 290 |
| Point mort | 3200 | 10% | 320 |
| Trésorerie | 1600 | 10% | 160 |
| **TOTAL 8 calculateurs** | **29,800** | - | **2,980/mois** |

**Projection 6 mois**: 3000 visiteurs/mois organiques via ressources

### 7.2 Conversion Dashboard

**Funnel**:

- 3000 visiteurs ressources/mois
- 5% cliquent CTA "Essayer Gratuitement" = 150 clics
- 30% créent compte Starter = **45 signups/mois**
- 10% upgradent Business (99€) dans 3 mois = **4.5 clients/mois**

**Revenu mensuel additionnel**: 4.5 × 99€ = **445€/mois** (+1 consulting lead/mois via crédibilité)

**ROI**:

- Investissement: 60h dev (10 calculateurs + templates + hub) ≈ 0€ (toi)
- Retour 12 mois: 445€ × 12 = **5,340€/an SaaS** + 6-12k€ consulting
- **ROI infini** si tu codes toi-même 🎯

### 7.3 Bénéfices Indirects

1. **SEO Authority**: Domain authority +10 points (backlinks ressources)
2. **Brand Awareness**: "FinSight, les meilleurs outils CFO gratuits"
3. **Product Demos**: Calculateurs = démo live du niveau de polish FinSight
4. **Hiring Signal**: Portfolio projet pour futurs recrutements
5. **Sales Collateral**: Consulting prospects voient expertise via outils

---

## 🎬 8. CONCLUSION & NEXT STEPS

### 8.1 Diagnostic Actuel

**Forces** ✅:

- 2 calculateurs existants de **qualité exceptionnelle** (DSO/BFR = 9/10)
- Architecture technique solide (analytics, SEO, UX premium)
- Philosophie zéro friction cohérente et différenciante
- Hub ressources existant avec bonne structure

**Faiblesses** ❌:

- Templates Excel fictifs = **problème crédibilité critique**
- Seulement 2 calculateurs = couverture insuffisante
- Pas de contenu long-form (guides PDF)
- SEO inexploité (30k recherches/mois disponibles)

### 8.2 Recommandation Stratégique

**Priorité ABSOLUE**: Créer les 3 templates Excel promis (Sprint 1)
**Raison**: Crédibilité > Growth. Mieux avoir 3 vrais templates que 10 faux.

**Quick Wins Suivants** (ordre):

1. Templates Excel réels (Semaine 1) ← **CRITIQUE**
2. 3 calculateurs Tier 1: ROI, Seuil rentabilité, Marge (Semaine 2)
3. Refonte hub `/ressources` avec filtres (Semaine 3)
4. 3 calculateurs Tier 2: EBITDA, Trésorerie, Point mort (Mois 2)
5. Guides PDF premium (Mois 3)

### 8.3 Success Metrics Recap

**3 mois**:

- ✅ 10 calculateurs actifs
- ✅ 6 templates réels downloadables
- ✅ 500 utilisations calculateurs/mois
- ✅ 45 signups Dashboard/mois via ressources

**6 mois**:

- ✅ Top 3 Google pour 10 requêtes calculateur
- ✅ 3000 visiteurs organiques/mois
- ✅ 5-10k€/an revenu additionnel

### 8.4 Philosophy Statement

> **"Contenu gratuit = Démo permanente de notre niveau d'excellence"**
>
> Chaque calculateur est une fenêtre sur la qualité FinSight.
> Pas d'email gate. Pas de friction. Juste de la valeur.
> Stratégie Stripe: donner gratuitement ce que les autres vendent.
> Résultat: Autorité + Traction + Conversions naturelles.

---

**Document créé le**: 27 novembre 2025
**Auteur**: GitHub Copilot + Otmane (FinSight)
**Prochaine révision**: Après Sprint 1 (templates Excel créés)
