# 🔍 AUDIT COMPLET - Problèmes Détectés

**Date**: 5 décembre 2025
**Commit actuel**: `ff214c4` (version sans IA)
**Contexte**: Après reset hard pour revenir à une version stable

---

## ❌ PROBLÈME MAJEUR #1 : Tous les KPIs s'affichent même sans données valides

### Description

Le dashboard affiche **TOUS les KPIs** (15 cards) même quand les données sont nulles, incomplètes ou non pertinentes.

### Exemple

Fichier `data_visites_clients.csv` (données marketing, pas financières) :

- ✅ Affiche "9 699 €" de revenus (OK)
- ❌ Affiche "0 €" de charges (pas normal, devrait être masqué)
- ❌ Affiche "100% de marge" (aberrant)
- ❌ Affiche DSO, BFR, etc. même sans données

### Cause Racine

**Fichier**: `src/components/FinancialDashboardV2.tsx` ligne 1065

```tsx
{(simulatedKPIs.length > 0 ? simulatedKPIs : kpis).map((kpi, index) => (
```

**Problème**: Pas de `.filter()` pour vérifier `isAvailable`

**Devrait être**:

```tsx
{(simulatedKPIs.length > 0 ? simulatedKPIs : kpis)
  .filter(kpi => kpi.isAvailable !== false)
  .map((kpi, index) => (
```

### Impact

- ❌ Dashboard pollué avec 15 KPIs même pour données simples
- ❌ KPIs à "0 €" ou "N/A" affichés quand même
- ❌ Mauvaise UX : l'utilisateur voit des données non pertinentes

---

## ❌ PROBLÈME MAJEUR #2 : Interface KPI manque le champ `isAvailable`

### Description

Le type TypeScript `KPI` n'a pas de propriété `isAvailable` pour indiquer si un KPI doit être affiché.

### Fichier

**Fichier**: `src/components/FinancialDashboardV2.tsx` ligne 88

```tsx
interface KPI {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
    description: string
    // ❌ MANQUE: isAvailable?: boolean
    // ❌ MANQUE: missingData?: string
}
```

### Solution

```tsx
interface KPI {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
    description: string
    isAvailable?: boolean     // ✅ Flag pour masquer les KPIs sans données
    missingData?: string      // ✅ Raison si données manquantes
}
```

### Impact

- ❌ Impossible de filtrer les KPIs programmatiquement
- ❌ Erreur TypeScript si on essaie d'utiliser `.filter(kpi => kpi.isAvailable)`

---

## ❌ PROBLÈME MAJEUR #3 : Fonction KPIs incorrecte utilisée

### Description

Le dashboard utilise `generateDashboardKPIs()` qui retourne **4 KPIs fixes**, au lieu de `generateAdaptiveKPIs()` qui génère des KPIs adaptatifs selon les données.

### Fichier

**Fichier**: `src/components/FinancialDashboardV2.tsx` ligne 740-748

```tsx
const { parseCSV, generateDashboardKPIs } = await import('@/lib/dataParser');
// ...
const kpis = generateDashboardKPIs(processedData);
```

**Problème**: `generateDashboardKPIs()` existe dans `dataParser.ts` ligne 809 et retourne TOUJOURS 4 KPIs (Revenus, Charges, Marge, Cash).

### Solution

**Fichier**: `src/lib/dashboardConfig.ts` ligne 121

La fonction `generateAdaptiveKPIs()` existe déjà et fait la détection intelligente :

- Affiche Marge Brute seulement si COGS > 0
- Affiche DSO seulement si dates d'échéance présentes
- Affiche BFR seulement si > 10 transactions
- Etc.

**MAIS elle n'est JAMAIS appelée !**

### Impact

- ❌ Le système adaptatif existe mais n'est pas utilisé
- ❌ Les KPIs s'affichent tous même sans données pertinentes
- ❌ Code mort : `generateAdaptiveKPIs()` importé mais jamais appelé

---

## ❌ PROBLÈME MAJEUR #4 : KPIs générés sans flag `isAvailable`

### Description

Même si on appelle `generateAdaptiveKPIs()`, les KPIs retournés n'ont PAS de propriété `isAvailable`.

### Fichier

**Fichier**: `src/lib/dashboardConfig.ts` lignes 121-212

```tsx
export function generateAdaptiveKPIs(data: any, capabilities: ReturnType<typeof detectCapabilities>) {
    const kpis = [];

    // KPI 1 : Revenus (TOUJOURS affiché)
    kpis.push({
        title: 'Revenus & Croissance',
        value: `${Math.round(data.kpis.revenue).toLocaleString('fr-FR')} €`,
        // ...
        // ❌ MANQUE: isAvailable: true
    });

    // KPI 3 : Marge Brute (conditionnelle)
    if (cogsData.cogs > 0) {
        kpis.push({
            title: 'Marge Brute & Rentabilité',
            // ...
            // ❌ MANQUE: isAvailable: true
        });
    }
    // ❌ PROBLÈME: Si condition fausse, rien n'est ajouté
    // Devrait ajouter avec isAvailable: false pour afficher message

    return kpis;
}
```

### Solution

**Option A - Retourner TOUS les KPIs avec flag**:

```tsx
const kpis = [
    {
        title: 'Revenus & Croissance',
        value: data.kpis.revenue ? `${Math.round(data.kpis.revenue).toLocaleString('fr-FR')} €` : 'N/A',
        isAvailable: data.kpis.revenue > 0,
        missingData: data.kpis.revenue > 0 ? undefined : 'Aucun revenu détecté'
    },
    {
        title: 'Marge Brute',
        value: cogsData.cogs > 0 ? `${grossMarginPercent.toFixed(1)}%` : 'N/A',
        isAvailable: cogsData.cogs > 0,
        missingData: cogsData.cogs > 0 ? undefined : 'COGS non détectés'
    }
    // etc.
];
```

**Option B - Filtrer à la source** (actuel mais incomplet):

```tsx
// Ajouter seulement si conditions valides (méthode actuelle)
if (cogsData.cogs > 0) {
    kpis.push({ title: 'Marge Brute', ... });
}
```

### Impact

- ❌ Impossible de filtrer les KPIs invalides dans le dashboard
- ❌ Pas de feedback utilisateur sur pourquoi un KPI manque

---

## ⚠️ PROBLÈME SECONDAIRE #5 : Parser ne gère pas les formats non-standard

### Description

Le parser heuristique actuel (sans IA) cherche des colonnes spécifiques :

- `date`, `montant`, `amount`, `transaction`
- `type`, `expense`, `income`
- `client`, `counterparty`, `tiers`

### Exemple d'échec

**Fichier**: `data_visites_clients.csv`

```csv
date,client,chiffre_affaires,visites,taux_rebond_pct
2023-07-01,TechCorp,1185,120,40.9
```

**Problème**:

- ❌ Colonne `chiffre_affaires` non reconnue (cherche `montant` ou `amount`)
- ❌ Aucune distinction income/expense → tout traité comme revenu
- ❌ Colonnes `visites`, `taux_rebond_pct` ignorées mais pas documentées

### Fichier

**Fichier**: `src/lib/dataParser.ts` ligne 190+ (fonction `detectColumns`)

```tsx
function detectColumns(headers: string[], sampleRows: string[][], config: ParseConfig): ColumnMapping[] {
    const mappings: ColumnMapping[] = [];

    // Détection date
    const datePattern = /date|datum|fecha|data/i;
    const dateIndex = headers.findIndex(h => datePattern.test(h));

    // Détection montant
    const amountPattern = /montant|amount|valeur|value|prix|price|sum|total/i;
    const amountIndex = headers.findIndex(h => amountPattern.test(h));

    // ❌ MANQUE: chiffre_affaires, CA, revenue, etc.
}
```

### Impact

- ❌ Formats comptables non-standard non supportés
- ❌ Pas de message d'erreur explicite sur colonnes non reconnues
- ❌ Utilisateur pense que son fichier est valide alors qu'il est mal parsé

---

## ⚠️ PROBLÈME SECONDAIRE #6 : Détection `capabilities` non propagée

### Description

Le système `detectCapabilities()` analyse correctement les données et détecte ce qui peut être affiché, MAIS cette info n'est pas utilisée dans le dashboard.

### Fichier

**Fichier**: `src/lib/dataParser.ts` lignes 105-110

```tsx
const capabilities = detectCapabilities(detectedMappings, records);
console.log('🔍 Parser - Capacités détectées:', capabilities);

const dashboardConfig = getDashboardConfig(capabilities);
console.log('🔍 Parser - Config granulaire:', dashboardConfig);
```

**Résultat**:

```js
capabilities = {
    canShowKPIs: true,
    canShowTopClients: false,  // Seulement 1 client distinct
    canShowDSO: false,          // Pas de dates d'échéance
    canShowMonthlyTrends: true,
    // ...
}
```

**MAIS** ces infos sont retournées dans `ParseResult` puis **IGNORÉES** par le dashboard !

### Fichier

**Fichier**: `src/components/FinancialDashboardV2.tsx` ligne 748

```tsx
const parseResult = parseCSV(csvText);
const { data: processedData } = parseResult;

// ❌ PROBLÈME: parseResult.dashboardConfig existe mais n'est pas utilisé !
const kpis = generateDashboardKPIs(processedData);
// Devrait être:
// const kpis = generateAdaptiveKPIs(processedData, parseResult.capabilities);
```

### Impact

- ❌ Détection intelligente faite mais ignorée
- ❌ Dashboard affiche tout même si `canShowTopClients: false`
- ❌ Code mort : `capabilities` et `dashboardConfig` calculés pour rien

---

## 📊 RÉSUMÉ DES PROBLÈMES

| # | Priorité | Problème | Fichier | Ligne | Effort |
|---|----------|----------|---------|-------|--------|
| 1 | 🔴 CRITIQUE | Tous les KPIs s'affichent | `FinancialDashboardV2.tsx` | 1065 | 5 min |
| 2 | 🔴 CRITIQUE | Type `KPI` manque `isAvailable` | `FinancialDashboardV2.tsx` | 88 | 2 min |
| 3 | 🔴 CRITIQUE | Mauvaise fonction KPIs utilisée | `FinancialDashboardV2.tsx` | 740-748 | 10 min |
| 4 | 🟠 MAJEUR | KPIs générés sans `isAvailable` | `dashboardConfig.ts` | 121-212 | 30 min |
| 5 | 🟡 MOYEN | Parser ne gère pas formats custom | `dataParser.ts` | 190+ | 2h (ou IA) |
| 6 | 🟡 MOYEN | `capabilities` non propagé | `FinancialDashboardV2.tsx` | 748 | 15 min |

**Temps de fix estimé**: 1h (sans IA) ou 3h (avec IA pour formats custom)

---

## ✅ PLAN DE CORRECTION (Ordre Logique)

### Phase 1 : Fixes TypeScript (10 min)

1. ✅ Ajouter `isAvailable?: boolean` au type `KPI`
2. ✅ Ajouter filtre `.filter(kpi => kpi.isAvailable !== false)`

### Phase 2 : Utiliser le bon système (15 min)

3. ✅ Remplacer `generateDashboardKPIs()` par `generateAdaptiveKPIs()`
4. ✅ Passer `capabilities` à `generateAdaptiveKPIs()`

### Phase 3 : Corriger génération KPIs (30 min)

5. ✅ Modifier `generateAdaptiveKPIs()` pour retourner TOUS les KPIs avec `isAvailable`
6. ✅ Ajouter `missingData` message quand KPI non disponible

### Phase 4 : Améliorer parser (optionnel, 2h)

7. 🔄 Ajouter patterns supplémentaires : `chiffre_affaires`, `CA`, `revenue`
8. 🔄 OU réintégrer IA côté serveur uniquement pour uploads complexes

---

## 🎯 RÉSULTAT ATTENDU

**Avant (actuel)** :

- ❌ 15 KPIs affichés même avec données simples
- ❌ KPIs à "0 €" visibles
- ❌ Dashboard surchargé

**Après (fix)** :

- ✅ 4-7 KPIs affichés selon richesse des données
- ✅ Seulement KPIs pertinents visibles
- ✅ Message explicite si KPI manquant : "DSO indisponible - Dates d'échéance non détectées"
- ✅ Dashboard propre et adaptatif

---

## 📝 NOTES

- Code adaptatif **EXISTE** déjà (`detectCapabilities`, `generateAdaptiveKPIs`)
- Juste **MAL CÂBLÉ** : bonnes fonctions pas utilisées
- Fix rapide (1h) sans toucher à la logique métier
- IA parser optionnel (pour formats exotiques comme `data_visites_clients.csv`)
