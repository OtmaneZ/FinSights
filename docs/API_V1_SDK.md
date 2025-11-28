# FinSight API v1 - Client SDK

SDK TypeScript type-safe pour l'API REST FinSight v1.

## Installation

Le SDK est inclus dans le projet. Importez-le simplement :

```typescript
import { FinSightAPI } from '@/lib/api-v1-client';
```

## Configuration

```typescript
const api = new FinSightAPI({
  apiKey: 'fsk_live_your_api_key',
  baseUrl: 'https://finsight.app/api/v1', // Optional, defaults to production
});
```

## Utilisation

### Lister les dashboards

```typescript
const response = await api.listDashboards({
  page: 1,
  limit: 10,
  companyId: 'cly123abc', // Optional
  sortBy: 'createdAt',
  sortOrder: 'desc',
});

console.log(response.data); // Dashboard[]
console.log(response.meta); // { total, page, limit, totalPages, hasMore }
```

### Récupérer un dashboard spécifique

```typescript
const response = await api.getDashboard('cly123abc', {
  includeRawData: true, // Optional, defaults to false
});

console.log(response.data); // Dashboard with full data
```

### Récupérer les KPIs

```typescript
// KPIs d'un dashboard spécifique
const response = await api.getKPIs({
  dashboardId: 'cly123abc',
  metrics: 'revenue,margin,cashflow',
});

console.log(response.data.metrics); // { revenue, margin, cashflow }

// KPIs agrégés par entreprise
const aggregated = await api.getKPIs({
  companyId: 'cly456def',
  metrics: 'all',
});

console.log(aggregated.data.metrics); // { revenue: { average, min, max, count }, ... }
```

## Gestion des erreurs

```typescript
import { ApiError } from '@/lib/api-v1-client';

try {
  const response = await api.getDashboard('invalid-id');
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error: ${error.message}`);
    console.error(`Code: ${error.code}`);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Types disponibles

```typescript
import type {
  Dashboard,
  KPIs,
  Company,
  ApiResponse,
  ApiPaginatedResponse,
  DashboardsQueryParams,
  KPIsQueryParams,
} from '@/lib/api-v1-client';
```

## Exemple complet

```typescript
import { FinSightAPI } from '@/lib/api-v1-client';

async function analyzeFinancialData() {
  const api = new FinSightAPI({
    apiKey: process.env.FINSIGHT_API_KEY!,
  });

  try {
    // Récupérer tous les dashboards
    const dashboards = await api.listDashboards({
      limit: 100,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    console.log(`Total dashboards: ${dashboards.meta.total}`);

    // Analyser les KPIs de chaque dashboard
    for (const dashboard of dashboards.data) {
      const kpis = await api.getKPIs({
        dashboardId: dashboard.id,
        metrics: 'all',
      });

      console.log(`${dashboard.fileName}:`);
      console.log(`  Revenue: ${kpis.data.metrics.revenue}`);
      console.log(`  Margin: ${kpis.data.metrics.margin}%`);
    }
  } catch (error) {
    console.error('Analysis failed:', error);
  }
}
```

## Documentation complète

Pour la documentation complète de l'API, consultez :

- [Documentation interactive](https://finsight.app/dashboard/api-docs)
- [OpenAPI Spec](https://finsight.app/api/v1/docs)
- [Guide complet](/docs/API_V1.md)
