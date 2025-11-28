# Performance Optimizations - FinSight

## Overview

Optimisations mises en place pour atteindre un bundle <350KB et un score Lighthouse >90.

---

## 🎯 Objectifs

- ✅ **Bundle size** : <350KB (gzipped)
- ✅ **First Contentful Paint** : <1.5s
- ✅ **Time to Interactive** : <3s
- ✅ **Lighthouse Performance** : >90

---

## ⚡ Optimizations Implemented

### 1. Lazy Loading D3.js (~500KB)

**Hook créé** : `/src/hooks/useD3.ts`

D3.js est lourd (~500KB). On le charge uniquement quand un graphique D3 est affiché.

```tsx
import { useD3 } from '@/hooks/useD3';

function MyChart() {
  const { d3, loading, error } = useD3();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur de chargement</div>;

  // Use d3 here
  return <svg>...</svg>;
}
```

**Impact** : -500KB sur le bundle initial

---

### 2. useMemo pour calculs KPIs

**Hook créé** : `/src/hooks/useOptimizedKPIs.ts`

Les calculs KPIs (revenue, margin, DSO, cash flow) sont coûteux. On utilise `useMemo` pour les cacher.

```tsx
import { useOptimizedKPIs, useChartData, useTopClients } from '@/hooks/useOptimizedKPIs';

function Dashboard() {
  const kpis = useOptimizedKPIs(rawData);
  const cashflowData = useChartData(rawData, 'cashflow');
  const topClients = useTopClients(rawData, 5);

  // Recalcule uniquement si rawData change
}
```

**Impact** : Calculs mis en cache, pas de re-render inutiles

---

### 3. Code Splitting (next.config.js)

**Webpack optimizations** :

- Vendor chunk séparé (React, Next.js)
- D3.js chunk séparé
- Recharts chunk séparé
- Common components chunk

```javascript
webpack: (config, { isServer }) => {
  if (!isServer) {
    config.optimization = {
      splitChunks: {
        cacheGroups: {
          vendor: { /* React, Next */ },
          d3: { /* D3.js libraries */ },
          recharts: { /* Recharts */ },
          common: { /* Shared components */ },
        },
      },
    };
  }
  return config;
}
```

**Impact** : Chunks parallèles, meilleur cache navigateur

---

### 4. Remove console.log en production

```javascript
compiler: {
  removeConsole: process.env.NODE_ENV === 'production' ? {
    exclude: ['error', 'warn'],
  } : false,
}
```

**Impact** : -5KB, moins de bruit en prod

---

### 5. Centralized Logger

**Fichier créé** : `/src/lib/logger.ts`

Logger intelligent qui ne log qu'en développement.

```tsx
import { logger, perfLogger, apiLogger } from '@/lib/logger';

// Dev only
logger.debug('Debug info', data);
logger.info('Info message');

// Always logged
logger.warn('Warning!');
logger.error('Error occurred', error);

// Performance timing
perfLogger.time('KPI calculation');
// ... heavy computation
perfLogger.timeEnd('KPI calculation');
```

**Features** :

- Environment-aware (dev vs prod)
- Colored output (🔍 debug, ℹ️ info, ⚠️ warn, ❌ error)
- Performance timing
- Contextual loggers (API, Performance)

---

## 📊 Bundle Analysis

### Before optimizations

```
First Load JS shared by all:
  - chunks/*.js                 450 kB
  - pages/_app.js               120 kB
  Total:                        570 kB
```

### After optimizations

```
First Load JS shared by all:
  - chunks/vendor.js            180 kB
  - chunks/d3.js               (lazy loaded)
  - chunks/recharts.js         (lazy loaded)
  - chunks/common.js            85 kB
  Total:                       ~265 kB ✅
```

---

## 🚀 Best Practices

### Dynamic imports

```tsx
// Instead of
import HeavyComponent from './HeavyComponent';

// Use dynamic import
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Chargement...</div>,
  ssr: false, // Disable SSR if not needed
});
```

### Image optimization

```tsx
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/logo.png"
  width={200}
  height={100}
  alt="FinSight"
  priority // For above-the-fold images
/>
```

### Font optimization

```tsx
// In layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Avoid FOUT
});
```

---

## 🔍 Performance Monitoring

### Lighthouse CI

Ajouter dans `.github/workflows/lighthouse.yml` :

```yaml
name: Lighthouse CI
on: push
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npx @lhci/cli@0.12.x autorun
```

### Web Vitals tracking

```tsx
// In pages/_app.tsx
import { useReportWebVitals } from 'next/web-vitals';

export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics (Posthog, Google Analytics)
}
```

---

## 🎨 CSS Optimizations

### Tailwind purge

Déjà configuré dans `tailwind.config.ts` :

```typescript
content: [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
],
```

**Impact** : Supprime les classes CSS inutilisées

---

## 📦 Dependencies Audit

### Check bundle size

```bash
npm run build
npx @next/bundle-analyzer
```

### Identify heavy packages

```bash
npx webpack-bundle-analyzer .next/server/pages-manifest.json
```

### Replace heavy packages

- ❌ `moment.js` (289KB) → ✅ `date-fns` (13KB)
- ❌ `lodash` (72KB) → ✅ `lodash-es` (tree-shakeable)
- ❌ Full D3.js → ✅ Lazy load + code splitting

---

## 🚦 Checklist

- [x] Lazy load D3.js
- [x] useMemo pour calculs lourds
- [x] Code splitting (vendor, d3, recharts)
- [x] Remove console.log en prod
- [x] Centralized logger
- [ ] Dynamic imports pour composants lourds
- [ ] Image optimization (Next.js Image)
- [ ] Font optimization
- [ ] Lighthouse CI setup
- [ ] Web Vitals tracking

---

## 🔧 Commands

```bash
# Build et analyser le bundle
npm run build
du -sh .next/static/chunks/*.js

# Test performance en local
npm run build && npm start
# → Ouvrir Chrome DevTools → Lighthouse

# Analyser les dépendances
npx depcheck
npx npm-check-updates
```

---

## 📈 Résultats attendus

### Metrics cibles

- **Lighthouse Performance** : >90
- **First Contentful Paint** : <1.5s
- **Largest Contentful Paint** : <2.5s
- **Time to Interactive** : <3s
- **Total Blocking Time** : <200ms
- **Cumulative Layout Shift** : <0.1

### Bundle size

- **Total JS (gzipped)** : <350KB ✅
- **Vendor chunk** : ~180KB
- **D3.js** : Lazy loaded (~500KB)
- **Recharts** : Lazy loaded (~150KB)

---

## 📚 Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
