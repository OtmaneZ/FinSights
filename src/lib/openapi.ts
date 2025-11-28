/**
 * FinSight API v1 - OpenAPI Specification
 * Public REST API for accessing financial dashboards and KPIs
 *
 * Authentication: Bearer token (API key from /dashboard/api-keys)
 * Base URL: https://finsight.app/api/v1
 */

export const openApiSpec = {
    openapi: '3.0.0',
    info: {
        title: 'FinSight API',
        version: '1.0.0',
        description: `
# FinSight REST API v1

Access your financial dashboards and KPIs programmatically.

## Authentication

All API requests require authentication using an API key in the Authorization header:

\`\`\`
Authorization: Bearer fsk_live_your_api_key_here
\`\`\`

Generate API keys from your [Dashboard Settings](https://finsight.app/dashboard/api-keys).

## Rate Limits

- **PRO Plan**: 1,000 requests/day
- **SCALE Plan**: 10,000 requests/day
- **ENTERPRISE Plan**: Unlimited

## Response Format

All responses follow this structure:

\`\`\`json
{
  "success": true,
  "data": { ... },
  "meta": { ... },
  "timestamp": "2025-11-28T10:00:00.000Z"
}
\`\`\`

## Error Codes

- \`INVALID_API_KEY\`: Invalid or missing API key
- \`COMPANY_NOT_FOUND\`: Company not found or access denied
- \`DASHBOARD_NOT_FOUND\`: Dashboard not found or access denied
- \`INVALID_SORT_FIELD\`: Invalid sort field
- \`INVALID_METRICS\`: Invalid metric names
- \`FETCH_ERROR\`: Server error
        `,
        contact: {
            name: 'FinSight Support',
            email: 'support@finsight.app',
            url: 'https://finsight.app',
        },
        license: {
            name: 'Proprietary',
            url: 'https://finsight.app/terms',
        },
    },
    servers: [
        {
            url: 'https://finsight.app/api/v1',
            description: 'Production',
        },
        {
            url: 'http://localhost:3000/api/v1',
            description: 'Development',
        },
    ],
    security: [
        {
            BearerAuth: [],
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'API Key',
                description: 'API key from FinSight dashboard (format: fsk_live_xxx)',
            },
        },
        schemas: {
            Error: {
                type: 'object',
                properties: {
                    error: {
                        type: 'string',
                        example: 'Dashboard not found',
                    },
                    code: {
                        type: 'string',
                        example: 'DASHBOARD_NOT_FOUND',
                    },
                    timestamp: {
                        type: 'string',
                        format: 'date-time',
                    },
                },
            },
            Company: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        example: 'cly123abc',
                    },
                    name: {
                        type: 'string',
                        example: 'My Company SAS',
                    },
                    sector: {
                        type: 'string',
                        nullable: true,
                        enum: ['services', 'commerce', 'industrie', 'saas'],
                        example: 'saas',
                    },
                },
            },
            KPIs: {
                type: 'object',
                properties: {
                    revenue: {
                        type: 'number',
                        description: 'Total revenue',
                        example: 150000,
                    },
                    margin: {
                        type: 'number',
                        description: 'Profit margin (%)',
                        example: 25.5,
                    },
                    cashflow: {
                        type: 'number',
                        description: 'Cash flow',
                        example: 45000,
                    },
                    dso: {
                        type: 'number',
                        description: 'Days Sales Outstanding',
                        example: 35,
                    },
                    bfr: {
                        type: 'number',
                        description: 'Besoin en Fonds de Roulement',
                        example: 12000,
                    },
                },
            },
            Dashboard: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        example: 'cly456def',
                    },
                    fileName: {
                        type: 'string',
                        example: 'financial-data-2025.csv',
                    },
                    fileUrl: {
                        type: 'string',
                        format: 'uri',
                        example: 'https://storage.finsight.app/files/xxx.csv',
                    },
                    company: {
                        $ref: '#/components/schemas/Company',
                    },
                    kpis: {
                        $ref: '#/components/schemas/KPIs',
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                    },
                },
            },
            PaginationMeta: {
                type: 'object',
                properties: {
                    total: {
                        type: 'integer',
                        example: 42,
                    },
                    page: {
                        type: 'integer',
                        example: 1,
                    },
                    limit: {
                        type: 'integer',
                        example: 10,
                    },
                    totalPages: {
                        type: 'integer',
                        example: 5,
                    },
                    hasMore: {
                        type: 'boolean',
                        example: true,
                    },
                },
            },
        },
    },
    paths: {
        '/dashboards': {
            get: {
                summary: 'List dashboards',
                description: 'Get paginated list of dashboards with filtering and sorting',
                tags: ['Dashboards'],
                parameters: [
                    {
                        name: 'page',
                        in: 'query',
                        description: 'Page number',
                        schema: {
                            type: 'integer',
                            default: 1,
                            minimum: 1,
                        },
                    },
                    {
                        name: 'limit',
                        in: 'query',
                        description: 'Items per page',
                        schema: {
                            type: 'integer',
                            default: 10,
                            minimum: 1,
                            maximum: 100,
                        },
                    },
                    {
                        name: 'companyId',
                        in: 'query',
                        description: 'Filter by company ID',
                        schema: {
                            type: 'string',
                        },
                    },
                    {
                        name: 'sortBy',
                        in: 'query',
                        description: 'Sort field',
                        schema: {
                            type: 'string',
                            enum: ['createdAt', 'updatedAt', 'fileName'],
                            default: 'createdAt',
                        },
                    },
                    {
                        name: 'sortOrder',
                        in: 'query',
                        description: 'Sort direction',
                        schema: {
                            type: 'string',
                            enum: ['asc', 'desc'],
                            default: 'desc',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true,
                                        },
                                        data: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/components/schemas/Dashboard',
                                            },
                                        },
                                        meta: {
                                            $ref: '#/components/schemas/PaginationMeta',
                                        },
                                        timestamp: {
                                            type: 'string',
                                            format: 'date-time',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Company not found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/dashboards/{id}': {
            get: {
                summary: 'Get dashboard details',
                description: 'Get specific dashboard with full KPIs and optional raw data',
                tags: ['Dashboards'],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        description: 'Dashboard ID',
                        schema: {
                            type: 'string',
                        },
                    },
                    {
                        name: 'includeRawData',
                        in: 'query',
                        description: 'Include raw transaction data',
                        schema: {
                            type: 'boolean',
                            default: false,
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true,
                                        },
                                        data: {
                                            $ref: '#/components/schemas/Dashboard',
                                        },
                                        timestamp: {
                                            type: 'string',
                                            format: 'date-time',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Dashboard not found',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/kpis': {
            get: {
                summary: 'Get KPIs',
                description: 'Get aggregated or specific KPIs with filtering',
                tags: ['KPIs'],
                parameters: [
                    {
                        name: 'companyId',
                        in: 'query',
                        description: 'Filter by company ID',
                        schema: {
                            type: 'string',
                        },
                    },
                    {
                        name: 'dashboardId',
                        in: 'query',
                        description: 'Get KPIs for specific dashboard',
                        schema: {
                            type: 'string',
                        },
                    },
                    {
                        name: 'metrics',
                        in: 'query',
                        description: 'Comma-separated list of metrics (or "all")',
                        schema: {
                            type: 'string',
                            default: 'all',
                            example: 'revenue,margin,cashflow',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true,
                                        },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                dashboardId: {
                                                    type: 'string',
                                                    nullable: true,
                                                },
                                                companyId: {
                                                    type: 'string',
                                                    nullable: true,
                                                },
                                                metrics: {
                                                    $ref: '#/components/schemas/KPIs',
                                                },
                                            },
                                        },
                                        timestamp: {
                                            type: 'string',
                                            format: 'date-time',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Invalid metrics',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                            },
                        },
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Error',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    tags: [
        {
            name: 'Dashboards',
            description: 'Dashboard management endpoints',
        },
        {
            name: 'KPIs',
            description: 'Financial KPIs and metrics',
        },
    ],
};
