# 🎯 ROADMAP FINSIGHT - VERSION PROFESSIONNELLE
**Objectif :** Transformer la démo technique en outil utilisable par des DAF/CFO

---

## 📊 **ÉTAT ACTUEL : 38/100**

### ✅ **Points forts**
- Architecture code propre (TypeScript, modulaire)
- Upload CSV fonctionnel avec états bien gérés
- Empty state pédagogique (3 niveaux, templates téléchargeables)
- Dark theme moderne et cohérent
- Système adaptatif intelligent (concept validé)

### ❌ **Blockers critiques**
1. **Graphiques = fake data** (pas connectés aux vraies données uploadées)
2. **Formules KPIs incorrectes** (DSO calculé avec `fréquence × 30` au lieu de `Créances/CA × 365`)
3. **Pas de crédibilité métier finance** (termes approximatifs, calculs non-standard)
4. **Export PDF trop basique** (pas de logo, pas de méthodologie)
5. **Copilot IA non validé** sur questions métier réelles

---

## 🚀 **PHASE URGENTE (1-2 semaines) - Objectif : 70/100**

### **1. Connecter TOUS les graphiques aux vraies données** 🔥🔥🔥
**Fichiers à modifier :**
- `/src/components/charts/CashFlowChart.tsx` → Remplacer `cashFlowData` hardcodé
- `/src/components/charts/DSOClientChart.tsx` → Utiliser `rawData` du contexte
- `/src/components/charts/MarginAnalysisChart.tsx` → Calculer marges réelles
- `/src/components/charts/WhatIfSimulator.tsx` → Simulations sur vraies données

**Résultat attendu :**
```tsx
// AVANT ❌
const cashFlowData = [
    { month: 'Avr 24', actual: 180000 }, // FAKE
];

// APRÈS ✅
const cashFlowData = useMemo(() => {
    return rawData.map(record => ({
        month: formatMonth(record.date),
        actual: calculateCumulativeCash(record)
    }));
}, [rawData]);
```

---

### **2. Corriger formules KPIs financiers** 🔥🔥🔥
**Fichier à modifier :** `/src/lib/dashboardConfig.ts`

**Formules à implémenter correctement :**

#### **DSO (Days Sales Outstanding)**
```ts
// ❌ INCORRECT (actuel)
value: `${Math.round(transactionFrequency * 30)} jours`

// ✅ CORRECT
const dso = (creancesClients / chiffreAffaires) * 365;
// Créances clients = Σ factures non encaissées avec date_échéance dépassée
```

#### **Marge Brute**
```ts
// ❌ INCORRECT (actuel)
// Pas de calcul de marge

// ✅ CORRECT
const margeBrute = ((chiffreAffaires - coutAchat) / chiffreAffaires) * 100;
// Nécessite colonnes: Prix_vente, Cout_unitaire OU Categorie="Achat"
```

#### **BFR (Besoin en Fonds de Roulement)**
```ts
// ✅ À AJOUTER
const bfr = stocksMoyens + creancesClients - detteFournisseurs;
```

#### **Rotation des Stocks**
```ts
// ✅ À AJOUTER
const rotationStocks = coutAchatAnnuel / stockMoyen;
```

**Références :** [Normes comptables françaises PCG 2025]

---

### **3. Ajouter lexique financier (tooltips)** 🔥🔥
**Fichier à créer :** `/src/lib/financialGlossary.ts`

```ts
export const glossary = {
    DSO: {
        title: "DSO - Days Sales Outstanding",
        definition: "Délai moyen de paiement des clients (en jours)",
        formula: "(Créances clients / CA) × 365",
        benchmark: "PME industrielle : 45-60j | Services : 30-45j",
        alert: "Au-delà de 60j, risque de trésorerie"
    },
    BFR: {
        title: "BFR - Besoin en Fonds de Roulement",
        definition: "Montant nécessaire pour financer le cycle d'exploitation",
        formula: "Stocks + Créances clients - Dettes fournisseurs",
        benchmark: "Idéal : < 20% du CA",
        alert: "BFR négatif = trésorerie structurellement positive"
    },
    // ... autres KPIs
};
```

**Intégration UI :**
```tsx
<Tooltip content={glossary.DSO}>
    <span className="underline-dotted">DSO</span>
</Tooltip>
```

---

### **4. Professionnaliser export PDF** 🔥🔥
**Fichier à modifier :** `/src/components/FinancialDashboard.tsx` (fonction `exportToPDF`)

**Améliorations à ajouter :**
```tsx
// Page de couverture
pdf.addImage(logoFinSight, 'PNG', 20, 20, 50, 15);
pdf.setFontSize(24);
pdf.text('Rapport Financier FinSight', 20, 50);
pdf.text(nomEntreprise, 20, 60); // À demander à l'utilisateur
pdf.setFontSize(12);
pdf.text(`Période analysée : ${dateDebut} - ${dateFin}`, 20, 70);
pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 20, 80);

// Footer sur chaque page
const addFooter = (pageNum: number) => {
    pdf.setFontSize(8);
    pdf.text(`FinSight © 2025 - Page ${pageNum}`, 20, pdfHeight - 10);
    pdf.text('Confidentiel - Usage interne uniquement', pdfWidth - 80, pdfHeight - 10);
};

// Table des matières
pdf.text('Sommaire', 20, 100);
pdf.text('1. KPIs principaux ..................... p.2', 30, 110);
pdf.text('2. Évolution trésorerie ............... p.3', 30, 115);
pdf.text('3. Analyse marges ...................... p.4', 30, 120);
pdf.text('4. Méthodologie ........................ p.5', 30, 125);
```

---

### **5. Tests avec vrais exports comptables** 🔥🔥
**Fichiers de test à créer :** `/test-data/`

- `sage-export-sample.csv` (format Sage Compta)
- `cegid-export-sample.xlsx` (format Cegid)
- `quickbooks-export-sample.csv` (format QuickBooks)
- `excel-entreprise-sample.xlsx` (export manuel avec incohérences)

**Tests à faire :**
1. Dates françaises (01/10/2024 vs 2024-10-01)
2. Montants avec espaces (150 000,00 vs 150000.00)
3. Devises multiples (EUR, $, £)
4. Colonnes manquantes/renommées
5. Lignes vides ou doublons
6. Caractères spéciaux (accents, symboles)

**Script de test automatisé :**
```bash
npm run test:parsers
# → Upload chaque fichier
# → Vérifie que ça ne plante pas
# → Compare KPIs générés vs attendus
```

---

## 🎯 **PHASE IMPORTANTE (2-3 semaines) - Objectif : 85/100**

### **6. Benchmarks sectoriels**
**Fichier à créer :** `/src/lib/benchmarks.ts`

```ts
export const sectorialBenchmarks = {
    INDUSTRIE: {
        DSO: { min: 45, median: 60, max: 75 },
        margeBrute: { min: 25, median: 35, max: 45 },
        rotationStocks: { min: 6, median: 8, max: 12 }
    },
    SERVICES: {
        DSO: { min: 30, median: 45, max: 60 },
        margeBrute: { min: 40, median: 55, max: 70 },
        rotationStocks: null // N/A
    },
    // ... autres secteurs
};
```

**Affichage dans KPI :**
```tsx
<div className="benchmark-indicator">
    <span>Votre DSO : 47j</span>
    <ProgressBar value={47} min={30} median={45} max={60} />
    <span className="text-green">✅ Dans la moyenne sectorielle</span>
</div>
```

---

### **7. Alertes intelligentes prédictives**
**Fichier à créer :** `/src/lib/alerts.ts`

```ts
export function generateAlerts(data: ProcessedData, config: DashboardConfig) {
    const alerts = [];

    // Alerte trésorerie
    if (data.kpis.projectedCash90d < 50000) {
        alerts.push({
            severity: 'critical',
            title: '⚠️ Risque de trésorerie',
            message: `Votre cash descendra sous 50k€ dans ${data.daysUntilCritical} jours`,
            actions: [
                'Relancer factures en retard (85k€)',
                'Négocier délai paiement fournisseurs',
                'Activer ligne de crédit court terme'
            ]
        });
    }

    // Alerte DSO dégradé
    if (data.kpis.dsoTrend > 0 && data.kpis.dso > 60) {
        alerts.push({
            severity: 'warning',
            title: '📈 DSO en dégradation',
            message: `+${data.kpis.dsoTrend}j en 3 mois → Impact -${calculateCashImpact()}€`,
            actions: [
                'Audit des conditions de paiement',
                'Automatiser relances J+30',
                'Pénalités de retard contractuelles'
            ]
        });
    }

    return alerts;
}
```

---

### **8. Drill-down sur KPIs**
**Comportement attendu :**
```
[Clic sur KPI "DSO 47j"]
    ↓
Modal s'ouvre :
┌─────────────────────────────────────┐
│ DSO - Détail par client             │
│                                     │
│ Client A : 65j (120k€ en retard)   │
│ Client B : 42j (OK)                │
│ Client C : 78j (85k€ CRITIQUE)     │
│                                     │
│ [Exporter liste] [Relancer tous]   │
└─────────────────────────────────────┘
```

**Fichier à créer :** `/src/components/KPIDrilldown.tsx`

---

## 🌟 **PHASE NICE-TO-HAVE (4+ semaines) - Objectif : 95/100**

### **9. Multi-devises & Multi-entités**
- Conversion automatique EUR/USD/GBP
- Consolidation de plusieurs fichiers (filiale A + filiale B)
- Éliminations inter-compagnies

### **10. Scénarios What-If calculés**
```tsx
<WhatIfSimulator>
    Si je relance clients en retard (-15j DSO)
    → +120k€ de cash immédiat
    → BFR réduit de 8%
</WhatIfSimulator>
```

### **11. Dashboard mobile responsive**
- Progressive Web App (PWA)
- Graphiques adaptés tactile
- Notifications push (alertes)

### **12. Intégration API bancaires**
- Budget Insight / Powens
- Synchronisation automatique transactions
- Rapprochement bancaire automatique

---

## 📅 **PLANNING PROPOSÉ**

| Semaine | Tâches | Livrable |
|---------|--------|----------|
| **S1** (1-7 nov) | Graphiques + Formules KPIs | Dashboard avec vraies données |
| **S2** (8-14 nov) | Lexique + Export PDF + Tests | Version testable par PME |
| **S3** (15-21 nov) | Benchmarks + Alertes | Version intelligente |
| **S4** (22-28 nov) | Drill-down + Polish UX | Version présentable DFCG |

**Date cible pitch DFCG :** 1er décembre 2025 ✅

---

## 🎯 **CRITÈRES DE VALIDATION (Checklist DAF)**

Avant de présenter à un DAF, l'outil DOIT :

- [ ] Afficher des **graphiques basés sur SES vraies données**
- [ ] Calculer DSO/BFR/Marge avec **formules standard comptables**
- [ ] Permettre **export PDF pro** (logo, méthodologie, footer)
- [ ] Avoir un **lexique** explicatif pour chaque KPI
- [ ] **Benchmarker** vs moyenne sectorielle
- [ ] Générer des **alertes actionnables** (pas juste "ça baisse")
- [ ] Permettre **drill-down** sur chaque KPI (voir le détail)
- [ ] Gérer des **formats de fichiers variés** (Sage, Cegid, Excel)
- [ ] Avoir une **démo vidéo** de 2min max
- [ ] Fournir un **guide utilisateur** PDF (10 pages max)

---

## 💬 **STRATÉGIE GO-TO-MARKET RÉVISÉE**

### ❌ **NE PAS FAIRE :**
- Pitcher à la DFCG maintenant (crédibilité = 0)
- Promettre des fonctionnalités non implémentées
- Montrer des fake data en démo

### ✅ **À FAIRE :**
1. **Trouver 2-3 PME test** (pas des grands comptes)
2. **Uploader LEURS vrais exports** Sage/Cegid
3. **Itérer 3-4 fois** jusqu'à "OK c'est fiable"
4. **Faire une vidéo témoignage** (30sec : "J'ai uploadé mon export Sage, ça marche")
5. **ENSUITE** présenter à la DFCG avec cas d'usage réel

### 📹 **Pitch DFCG (structure 10min) :**
```
1. Problème (2min) : "DAF perd 4h/semaine sur Excel"
2. Solution (3min) : Démo live avec VRAI export comptable
3. Différenciation (2min) : "Formules CFO-grade, pas d'approximations"
4. Cas client (2min) : Témoignage PME test
5. Roadmap (1min) : "Voici la v2 dans 3 mois"
```

---

## 🔥 **PRIORITÉ ABSOLUE SEMAINE 1**

**Lundi-Mardi :** Connecter graphiques CashFlow + DSO aux vraies données
**Mercredi-Jeudi :** Corriger formules DSO + BFR + Marge
**Vendredi :** Tests avec exports Sage/Cegid réels

**Objectif fin semaine :** Dashboard qui affiche VRAIES DONNÉES sans fake data

---

**Dernière mise à jour :** 31 octobre 2025
**Prochaine revue :** 7 novembre 2025 (fin sprint 1)
