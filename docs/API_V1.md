# FinSight REST API v1 - Documentation

## Vue d'ensemble

L'API REST FinSight v1 permet d'accéder programmatiquement à vos dashboards financiers et KPIs. Elle est conçue pour s'intégrer dans vos outils BI, notebooks Python, scripts d'automatisation, ou applications tierces.

## 🔐 Authentification

Toutes les requêtes nécessitent une clé API dans l'en-tête `Authorization` :

```bash
Authorization: Bearer fsk_live_your_api_key_here
```

### Générer une clé API

1. Connectez-vous à votre [Dashboard](https://finsight.app/dashboard)
2. Allez dans **Clés API** depuis le menu utilisateur
3. Cliquez sur **Générer une clé**
4. Copiez la clé (elle ne sera affichée qu'une seule fois)

⚠️ **Important** : Les clés API ne sont disponibles que pour les plans **PRO**, **SCALE** et **ENTERPRISE**.

## 🌐 Base URL

```
https://finsight.app/api/v1
```

En développement local :

```
http://localhost:3000/api/v1
```

## 📊 Rate Limits

| Plan | Limite quotidienne |
|------|-------------------|
| PRO | 1,000 requêtes/jour |
| SCALE | 10,000 requêtes/jour |
| ENTERPRISE | Illimité |

## 📝 Endpoints

### GET /dashboards

Liste tous vos dashboards avec pagination et filtres.

**Query Parameters:**

- `page` (number): Numéro de page (défaut: 1)
- `limit` (number): Éléments par page (défaut: 10, max: 100)
- `companyId` (string): Filtrer par entreprise
- `sortBy` (string): Champ de tri (`createdAt`, `updatedAt`, `fileName`)
- `sortOrder` (string): Direction du tri (`asc`, `desc`)

**Exemple:**

```bash
curl -X GET "https://finsight.app/api/v1/dashboards?page=1&limit=10" \
  -H "Authorization: Bearer fsk_live_your_api_key"
```

**Réponse:**

```json
{
  "success": true,
  "data": [
    {
      "id": "cly123abc",
      "fileName": "financial-data-2025.csv",
      "fileUrl": "https://...",
      "company": {
        "id": "cly456def",
        "name": "My Company SAS",
        "sector": "saas"
      },
      "kpis": {
        "revenue": 150000,
        "margin": 25.5,
        "cashflow": 45000,
        "dso": 35,
        "bfr": 12000
      },
      "createdAt": "2025-11-28T10:00:00.000Z",
      "updatedAt": "2025-11-28T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasMore": true
  },
  "timestamp": "2025-11-28T10:00:00.000Z"
}
```

### GET /dashboards/:id

Récupère un dashboard spécifique avec toutes ses données.

**Path Parameters:**

- `id` (string): ID du dashboard

**Query Parameters:**

- `includeRawData` (boolean): Inclure les données brutes de transactions (défaut: false)

**Exemple:**

```bash
curl -X GET "https://finsight.app/api/v1/dashboards/cly123abc?includeRawData=true" \
  -H "Authorization: Bearer fsk_live_your_api_key"
```

**Réponse:**

```json
{
  "success": true,
  "data": {
    "id": "cly123abc",
    "fileName": "financial-data-2025.csv",
    "fileUrl": "https://...",
    "company": {
      "id": "cly456def",
      "name": "My Company SAS",
      "sector": "saas"
    },
    "kpis": { ... },
    "rawData": [ ... ], // Si includeRawData=true
    "createdAt": "2025-11-28T10:00:00.000Z",
    "updatedAt": "2025-11-28T10:00:00.000Z"
  },
  "timestamp": "2025-11-28T10:00:00.000Z"
}
```

### GET /kpis

Récupère les KPIs agrégés ou spécifiques avec filtres.

**Query Parameters:**

- `companyId` (string): Filtrer par entreprise
- `dashboardId` (string): KPIs d'un dashboard spécifique
- `metrics` (string): Métriques séparées par virgules (`revenue,margin,cashflow,dso,bfr` ou `all`)

**Exemple 1 - KPIs d'un dashboard:**

```bash
curl -X GET "https://finsight.app/api/v1/kpis?dashboardId=cly123abc&metrics=revenue,margin" \
  -H "Authorization: Bearer fsk_live_your_api_key"
```

**Exemple 2 - KPIs agrégés par entreprise:**

```bash
curl -X GET "https://finsight.app/api/v1/kpis?companyId=cly456def&metrics=all" \
  -H "Authorization: Bearer fsk_live_your_api_key"
```

**Réponse (dashboard spécifique):**

```json
{
  "success": true,
  "data": {
    "dashboardId": "cly123abc",
    "companyId": "cly456def",
    "company": { ... },
    "metrics": {
      "revenue": 150000,
      "margin": 25.5
    },
    "updatedAt": "2025-11-28T10:00:00.000Z"
  },
  "timestamp": "2025-11-28T10:00:00.000Z"
}
```

**Réponse (agrégation):**

```json
{
  "success": true,
  "data": {
    "companyId": "cly456def",
    "dashboardCount": 5,
    "metrics": {
      "revenue": {
        "average": 145000,
        "min": 100000,
        "max": 200000,
        "count": 5
      },
      "margin": {
        "average": 24.5,
        "min": 20,
        "max": 30,
        "count": 5
      }
    },
    "companies": ["My Company SAS"]
  },
  "timestamp": "2025-11-28T10:00:00.000Z"
}
```

## 🚨 Codes d'erreur

Toutes les erreurs suivent ce format :

```json
{
  "error": "Message d'erreur",
  "code": "ERROR_CODE",
  "timestamp": "2025-11-28T10:00:00.000Z"
}
```

| Code | Description |
|------|-------------|
| `INVALID_API_KEY` | Clé API invalide ou manquante |
| `COMPANY_NOT_FOUND` | Entreprise introuvable ou accès refusé |
| `DASHBOARD_NOT_FOUND` | Dashboard introuvable ou accès refusé |
| `INVALID_SORT_FIELD` | Champ de tri invalide |
| `INVALID_METRICS` | Nom de métrique invalide |
| `FETCH_ERROR` | Erreur serveur |

## 💻 Exemples de code

### JavaScript / TypeScript

```javascript
const API_KEY = 'fsk_live_your_api_key';
const BASE_URL = 'https://finsight.app/api/v1';

// Récupérer tous les dashboards
async function getDashboards() {
  const response = await fetch(`${BASE_URL}/dashboards`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });
  const data = await response.json();
  return data.data; // Array of dashboards
}

// Récupérer un dashboard spécifique
async function getDashboard(id) {
  const response = await fetch(`${BASE_URL}/dashboards/${id}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });
  const data = await response.json();
  return data.data; // Dashboard object
}

// Récupérer les KPIs
async function getKPIs(dashboardId) {
  const response = await fetch(
    `${BASE_URL}/kpis?dashboardId=${dashboardId}&metrics=all`,
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    }
  );
  const data = await response.json();
  return data.data.metrics; // KPIs object
}
```

### Python

```python
import requests

API_KEY = 'fsk_live_your_api_key'
BASE_URL = 'https://finsight.app/api/v1'
HEADERS = {
    'Authorization': f'Bearer {API_KEY}'
}

# Récupérer tous les dashboards
def get_dashboards(page=1, limit=10):
    response = requests.get(
        f'{BASE_URL}/dashboards',
        params={'page': page, 'limit': limit},
        headers=HEADERS
    )
    return response.json()['data']

# Récupérer un dashboard spécifique
def get_dashboard(dashboard_id, include_raw=False):
    response = requests.get(
        f'{BASE_URL}/dashboards/{dashboard_id}',
        params={'includeRawData': include_raw},
        headers=HEADERS
    )
    return response.json()['data']

# Récupérer les KPIs
def get_kpis(dashboard_id=None, company_id=None, metrics='all'):
    params = {'metrics': metrics}
    if dashboard_id:
        params['dashboardId'] = dashboard_id
    if company_id:
        params['companyId'] = company_id

    response = requests.get(
        f'{BASE_URL}/kpis',
        params=params,
        headers=HEADERS
    )
    return response.json()['data']['metrics']
```

### cURL

```bash
# Liste des dashboards
curl -X GET "https://finsight.app/api/v1/dashboards?page=1&limit=10" \
  -H "Authorization: Bearer fsk_live_your_api_key"

# Dashboard spécifique avec données brutes
curl -X GET "https://finsight.app/api/v1/dashboards/cly123abc?includeRawData=true" \
  -H "Authorization: Bearer fsk_live_your_api_key"

# KPIs agrégés
curl -X GET "https://finsight.app/api/v1/kpis?metrics=revenue,margin,cashflow" \
  -H "Authorization: Bearer fsk_live_your_api_key"
```

## 📚 Documentation interactive

Pour une documentation interactive complète avec Swagger UI, visitez :

👉 **[https://finsight.app/dashboard/api-docs](https://finsight.app/dashboard/api-docs)**

## 🔗 OpenAPI Specification

Le schéma OpenAPI 3.0 complet est disponible à :

👉 **[https://finsight.app/api/v1/docs](https://finsight.app/api/v1/docs)**

## 🆘 Support

- **Documentation** : [https://finsight.app/dashboard/api-docs](https://finsight.app/dashboard/api-docs)
- **Email** : <support@finsight.app>
- **FAQ** : [https://finsight.app/faq](https://finsight.app/faq)

## 📋 Changelog

### v1.0.0 (2025-11-28)

- ✅ Endpoints `/dashboards` (list + détail)
- ✅ Endpoint `/kpis` (agrégation + filtres)
- ✅ Authentification Bearer token
- ✅ Pagination et filtres
- ✅ Documentation OpenAPI/Swagger
- ✅ Rate limiting par plan
