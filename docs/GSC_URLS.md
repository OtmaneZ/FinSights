# URLs à indexer dans Google Search Console

## Pages principales
- https://finsight.zineinsight.com/
- https://finsight.zineinsight.com/pricing
- https://finsight.zineinsight.com/faq
- https://finsight.zineinsight.com/blog
- https://finsight.zineinsight.com/ressources

## Calculateurs (KPIs)
- https://finsight.zineinsight.com/calculateurs/dso
- https://finsight.zineinsight.com/calculateurs/bfr

## Articles de blog (10)
- https://finsight.zineinsight.com/blog/calcul-dso-formule-2025
- https://finsight.zineinsight.com/blog/5-kpis-financiers-pme
- https://finsight.zineinsight.com/blog/tableau-flux-tresorerie-guide
- https://finsight.zineinsight.com/blog/budget-previsionnel-startup
- https://finsight.zineinsight.com/blog/bfr-besoin-fonds-roulement
- https://finsight.zineinsight.com/blog/ratio-liquidite-generale
- https://finsight.zineinsight.com/blog/marge-brute-calcul
- https://finsight.zineinsight.com/blog/seuil-rentabilite-calcul
- https://finsight.zineinsight.com/blog/tableau-bord-financier-cfo
- https://finsight.zineinsight.com/blog/analyse-ecarts-budgetaires

## Sitemap
- https://finsight.zineinsight.com/sitemap.xml

---

## Instructions Google Search Console

### 1. Vérification propriété

**Option A : DNS (Vercel)**
1. GSC → Ajouter propriété → Type "Domaine"
2. Copie le TXT record fourni par Google
3. Vercel Dashboard → Settings → Domains → DNS
4. Ajoute TXT record : `google-site-verification=XXXXXXX`

**Option B : Meta tag**
1. GSC → Ajouter propriété → Type "Préfixe URL"
2. Méthode "Balise HTML"
3. Je peux ajouter le meta tag dans `src/app/layout.tsx`

### 2. Soumettre sitemap
```
Sitemaps → Add sitemap → sitemap.xml
```

### 3. Indexation manuelle (prioritaire)
Pour chaque URL ci-dessus :
1. Barre de recherche GSC → Colle l'URL
2. "Demander une indexation"
3. Attends ~3-7 jours

### 4. Vérifier robots.txt
```
https://finsight.zineinsight.com/robots.txt
```
Doit être accessible et autoriser Googlebot.

### 5. Monitoring (hebdomadaire)
- **Couverture** : Pages indexées vs erreurs
- **Performances** : Clics, impressions, CTR
- **Core Web Vitals** : LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Améliorations** : Problèmes mobiles, données structurées

---

## Métriques cibles (3 mois)

| Métrique | Objectif |
|----------|----------|
| Pages indexées | 17/17 (100%) |
| Impressions/mois | 500+ |
| Clics/mois | 50+ |
| CTR moyen | 10%+ |
| Position moyenne | < 20 |

### Requêtes cibles SEO
- "calculer DSO" → Calculateur DSO
- "tableau flux trésorerie" → Article tableau flux
- "KPI financier PME" → Article 5 KPIs
- "budget prévisionnel startup" → Article budget
- "BFR calcul" → Calculateur BFR
- "dashboard financier CFO" → Homepage

---

## Actions prioritaires

1. **Aujourd'hui** : Vérifier propriété GSC + soumettre sitemap
2. **J+1** : Indexer manuellement 5 pages principales
3. **J+2** : Indexer manuellement 10 articles blog
4. **J+7** : Vérifier indexation (command: `site:finsight.zineinsight.com`)
5. **J+14** : Analyser premières impressions
6. **J+30** : Optimiser titres/descriptions selon CTR

---

## Commande vérification indexation Google

```bash
# Dans Google.com
site:finsight.zineinsight.com

# Vérifier URL spécifique
site:finsight.zineinsight.com/blog/calcul-dso-formule-2025
```

Si 0 résultat après 7 jours → problème robots.txt ou pénalité.
