# 🎨 FinSight - Guide Visuel du Workflow

## 📱 Interface Utilisateur - Étapes Visuelles

```
┌─────────────────────────────────────────────────────────────────┐
│                  🏠 HOMEPAGE - État Initial                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ╔═══════════════════════════════════════════════════════╗    │
│   ║  📊 Tableau de Bord Financier                          ║    │
│   ║                                                         ║    │
│   ║  [Export PDF] [📤 Importer Données]                    ║    │
│   ╚═══════════════════════════════════════════════════════╝    │
│                                                                  │
│   ┌───────────────────────────────────────────────────────┐    │
│   │  💡 Aucune donnée chargée                              │    │
│   │                                                         │    │
│   │  Importez vos données financières pour commencer       │    │
│   │  Formats supportés : CSV, Excel (.xlsx, .xls)          │    │
│   │                                                         │    │
│   │  [Cliquez pour uploader votre fichier]                 │    │
│   └───────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📤 ÉTAPE 1 : Upload Fichier

```
┌─────────────────────────────────────────────────────────────────┐
│              Zone d'Upload Activée                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌───────────────────────────────────────────────────────┐    │
│   │ 📁 Importer vos données financières                    │    │
│   │                                                         │    │
│   │ ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐  │    │
│   │ ┆  📄 Déposez vos fichiers ici                      ┆  │    │
│   │ ┆  ou cliquez pour sélectionner                     ┆  │    │
│   │ ┆                                                    ┆  │    │
│   │ ┆  Formats : .xlsx, .xls, .csv (max 10MB)           ┆  │    │
│   │ └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘  │    │
│   └───────────────────────────────────────────────────────┘    │
│                                                                  │
│   Fichier uploadé : "export_comptable_2025.xlsx"                │
│   ⏳ Traitement en cours...                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏢 ÉTAPE 2 : Modal Secteur (Auto après upload)

```
┌─────────────────────────────────────────────────────────────────┐
│                 🏢 Informations Entreprise                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Nom de votre entreprise *                                     │
│   ┌───────────────────────────────────────────────────────┐    │
│   │ FinSight SAS                                           │    │
│   └───────────────────────────────────────────────────────┘    │
│                                                                  │
│   Secteur d'activité *                                          │
│   ┌──────────────────┐  ┌──────────────────┐                   │
│   │ 📋 Services      │  │ 🛒 Commerce      │                   │
│   │ Conseil, agences │  │ Vente, retail    │                   │
│   └──────────────────┘  └──────────────────┘                   │
│   ┌──────────────────┐  ┌──────────────────┐                   │
│   │ 🏭 Industrie     │  │ 💻 SaaS / Tech   │                   │
│   │ Fabrication      │  │ Logiciel, app    │                   │
│   └──────────────────┘  └──────────────────┘                   │
│                                                                  │
│   💡 Pourquoi ? Pour comparer vos KPIs aux standards            │
│   de votre secteur et vous donner des recommandations           │
│   pertinentes.                                                  │
│                                                                  │
│   [Annuler]  [✅ Valider]                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 ÉTAPE 3 : Dashboard avec Preview + KPIs + Benchmarks

```
┌─────────────────────────────────────────────────────────────────┐
│           📊 Tableau de Bord - FinSight SAS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ✅ Données importées - FinSight SAS                          │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ 📄 Transactions: 324   📅 Période: 8 mois                   │ │
│ │ 👥 Clients: 45         💰 Cash Flow: +125 450€              │ │
│ │                                                              │ │
│ │ Aperçu (5 premières lignes):                                │ │
│ │ ┌──────────┬──────────┬──────────┬──────────┬────────────┐ │ │
│ │ │ Date     │ Montant  │ Tiers    │ Catég.   │ Descr.     │ │ │
│ │ ├──────────┼──────────┼──────────┼──────────┼────────────┤ │ │
│ │ │ 15/01/25 │ +1 500€  │ Client A │ Ventes   │ Fact. 001  │ │ │
│ │ │ 20/01/25 │ -850€    │ Fourniss.│ Achats   │ Fact. 525  │ │ │
│ │ └──────────┴──────────┴──────────┴──────────┴────────────┘ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 💡 Alertes & Recommandations                                 │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ ⚠️ Délai de paiement client élevé                            │ │
│ │ Vos clients paient en moyenne à 62 jours (seuil: 60j)       │ │
│ │                                                              │ │
│ │ Actions recommandées:                                        │ │
│ │ • Relancer factures > 30 jours                              │ │
│ │ • Proposer escompte 2% à 10j                                │ │
│ │ • Analyser top 3 retardataires                              │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ KPIs Grid:                                                       │
│ ┌─────────────┬─────────────┬─────────────┬─────────────┐      │
│ │ DSO Clients │ BFR         │ Marge Nette │ Cash Flow   │      │
│ ├─────────────┼─────────────┼─────────────┼─────────────┤      │
│ │ 62 jours    │ 28 jours    │ 12.5%       │ +125k€      │      │
│ │ ↗ +5j       │ ↘ -3j       │ ↗ +2%       │ ↗ +15%      │      │
│ │                                                         │      │
│ │ Benchmark Services:                                     │      │
│ │ ├──────────────────────────────────────────────────┤   │      │
│ │ ●─────────────────────●───────────────────────────●   │      │
│ │ 30j             45j (médiane)                    60j   │      │
│ │         Votre entreprise: 62j ⚠️ À surveiller          │      │
│ └─────────────┴─────────────┴─────────────┴─────────────┘      │
│                                                                  │
│ [📄 Export PDF]  [🔄 Actualiser]                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📈 Détail Benchmark Bar

```
┌─────────────────────────────────────────────────────────────────┐
│            Benchmark Bar - DSO (Délai Paiement)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📊 Benchmark Services                      ⚠️ À surveiller     │
│                                                                  │
│  Barre de progression:                                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ │
│  │          ●             ●              ●                ●   │ │
│  └────────────────────────────────────────────────────────────┘ │
│   0j      30j         45j           60j              90j        │
│   Min    Bon      Médiane      À surveiller        Max          │
│                                                                  │
│  Votre entreprise: 62 jours                                     │
│  Position: Zone Orange (entre médiane et max)                   │
│                                                                  │
│  Couleurs:                                                       │
│  ░░░ Vert  = Excellent (< médiane)                              │
│  ▓▓▓ Orange = À surveiller (médiane → max)                      │
│  ▒▒▒ Rouge  = Critique (> max)                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📄 ÉTAPE 4 : Export PDF Multi-Pages

```
┌─────────────────────────────────────────────────────────────────┐
│                     PDF Généré (5 pages)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Page 1 : Couverture                                             │
│  ┌───────────────────────────────────────────────────────┐      │
│  │                                                        │      │
│  │              ⚡ (Logo FinSight)                         │      │
│  │                                                        │      │
│  │          Rapport Financier                             │      │
│  │          FinSight SAS                                  │      │
│  │                                                        │      │
│  │          Période: Jan-Août 2025                        │      │
│  │          Généré le 1 nov 2025                          │      │
│  │                                                        │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                  │
│  Page 2 : Table des Matières                                    │
│  Page 3 : KPIs (grille 2×2)                                     │
│  Page 4 : Graphiques (3 charts capturés)                        │
│  Page 5 : Méthodologie                                          │
│                                                                  │
│  Footer chaque page : "FinSight © 2025 | CONFIDENTIEL | Page X" │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Workflow Complet Résumé

```
                    ┌─────────────────┐
                    │  1. Homepage    │
                    │  État vide      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  2. Upload      │
                    │  CSV ou Excel   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  3. Modal       │
                    │  Secteur        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  4. Preview     │
                    │  Données        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  5. KPIs        │
                    │  + Benchmarks   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  6. Alertes     │
                    │  Intelligentes  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  7. Graphiques  │
                    │  Interactifs    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  8. Export PDF  │
                    │  Multi-pages    │
                    └─────────────────┘
```

---

## 🎨 Codes Couleur Système

### KPIs Trends
- 🟢 **Vert** (`↗`) : Amélioration positive
- 🔴 **Rouge** (`↘`) : Dégradation négative
- ⚪ **Gris** (`→`) : Stable / Neutre

### Benchmarks
- 🟩 **Vert** : Entreprise < médiane (excellent)
- 🟧 **Orange** : Médiane < Entreprise < max (à surveiller)
- 🟥 **Rouge** : Entreprise > max (critique)

### Alertes
- 🔴 **Critique** : Action urgente requise (cash négatif)
- 🟠 **Warning** : Attention nécessaire (DSO élevé)
- 🟢 **Success** : Tout va bien

### Montants
- 🟢 **Vert** : Revenus / Encaissements (positif)
- 🔴 **Rouge** : Dépenses / Décaissements (négatif)

---

## 📱 Responsive Design

### Desktop (> 1024px)
- KPIs : 4 colonnes
- Graphiques : 2 colonnes
- Tableau : Toutes colonnes visibles

### Tablet (768-1024px)
- KPIs : 2 colonnes
- Graphiques : 1 colonne
- Tableau : Description masquée

### Mobile (< 768px)
- KPIs : 1 colonne
- Graphiques : 1 colonne empilée
- Tableau : Horizontal scroll

---

## 🎯 Points d'Attention UX

### Upload Zone
- ✅ Drag & drop support
- ✅ Click to upload
- ✅ États visuels : idle / uploading / success / error
- ✅ Feedback immédiat (spinner + messages)

### Modal Secteur
- ✅ Auto-focus sur champ nom
- ✅ Fermeture au clic backdrop
- ✅ Validation inline
- ✅ Messages d'erreur contextuels

### Benchmarks
- ✅ Animation de progression (500ms)
- ✅ Tooltip au survol
- ✅ Responsive (adapte taille mobile)

### Alertes
- ✅ Hiérarchie visuelle (critical > warning)
- ✅ Actions cliquables
- ✅ Collapse/Expand sur mobile

### Export PDF
- ✅ Loader pendant génération
- ✅ Preview auto (téléchargement automatique)
- ✅ Nom fichier daté : rapport-financier-2025-11-01.pdf

---

**🎨 Design System Ready for Production! 🚀**
