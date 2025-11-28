/**
 * FinSight API v1 - TypeScript Types & SDK
 * Type-safe client for the FinSight REST API
 */

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
    success: true;
    data: T;
    timestamp: string;
}

export interface ApiPaginatedResponse<T> extends ApiResponse<T[]> {
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
    };
}

export interface ApiError {
    error: string;
    code: string;
    timestamp: string;
}

// ============================================
// Domain Types
// ============================================

export interface Company {
    id: string;
    name: string;
    sector: 'services' | 'commerce' | 'industrie' | 'saas' | null;
}

export interface KPIs {
    revenue?: number;
    margin?: number;
    cashflow?: number;
    dso?: number;
    bfr?: number;
    [key: string]: number | undefined;
}

export interface Dashboard {
    id: string;
    fileName: string;
    fileUrl: string;
    company: Company;
    kpis: KPIs;
    createdAt: string;
    updatedAt: string;
    rawData?: any[]; // Only included if includeRawData=true
}

export interface AggregatedMetric {
    average: number;
    min: number;
    max: number;
    count: number;
}

export interface KPIsResponse {
    dashboardId?: string;
    companyId?: string | null;
    company?: Company;
    metrics: KPIs | Record<string, AggregatedMetric>;
    dashboardCount?: number;
    companies?: string[];
    updatedAt?: string;
}

// ============================================
// API Client Configuration
// ============================================

export interface ApiClientConfig {
    apiKey: string;
    baseUrl?: string;
}

// ============================================
// Query Parameters
// ============================================

export interface DashboardsQueryParams {
    page?: number;
    limit?: number;
    companyId?: string;
    sortBy?: 'createdAt' | 'updatedAt' | 'fileName';
    sortOrder?: 'asc' | 'desc';
}

export interface DashboardDetailParams {
    includeRawData?: boolean;
}

export interface KPIsQueryParams {
    companyId?: string;
    dashboardId?: string;
    metrics?: 'all' | string; // 'revenue,margin,cashflow' or 'all'
}

// ============================================
// Type-Safe API Client
// ============================================

export class FinSightAPI {
    private apiKey: string;
    private baseUrl: string;

    constructor(config: ApiClientConfig) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || 'https://finsight.app/api/v1';
    }

    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(data.error, data.code);
        }

        return data;
    }

    /**
     * List dashboards with pagination and filtering
     */
    async listDashboards(
        params?: DashboardsQueryParams
    ): Promise<ApiPaginatedResponse<Dashboard>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        if (params?.companyId) queryParams.set('companyId', params.companyId);
        if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
        if (params?.sortOrder) queryParams.set('sortOrder', params.sortOrder);

        const query = queryParams.toString();
        return this.request<ApiPaginatedResponse<Dashboard>>(
            `/dashboards${query ? `?${query}` : ''}`
        );
    }

    /**
     * Get specific dashboard by ID
     */
    async getDashboard(
        id: string,
        params?: DashboardDetailParams
    ): Promise<ApiResponse<Dashboard>> {
        const queryParams = new URLSearchParams();
        if (params?.includeRawData) {
            queryParams.set('includeRawData', 'true');
        }

        const query = queryParams.toString();
        return this.request<ApiResponse<Dashboard>>(
            `/dashboards/${id}${query ? `?${query}` : ''}`
        );
    }

    /**
     * Get KPIs with optional filtering
     */
    async getKPIs(
        params?: KPIsQueryParams
    ): Promise<ApiResponse<KPIsResponse>> {
        const queryParams = new URLSearchParams();
        if (params?.companyId) queryParams.set('companyId', params.companyId);
        if (params?.dashboardId) {
            queryParams.set('dashboardId', params.dashboardId);
        }
        if (params?.metrics) queryParams.set('metrics', params.metrics);

        const query = queryParams.toString();
        return this.request<ApiResponse<KPIsResponse>>(
            `/kpis${query ? `?${query}` : ''}`
        );
    }
}

// ============================================
// Custom Error Class
// ============================================

export class ApiError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode?: number
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// ============================================
// Example Usage
// ============================================

/**
 * Example usage:
 *
 * ```typescript
 * import { FinSightAPI } from '@/lib/api-v1-client';
 *
 * const api = new FinSightAPI({
 *   apiKey: 'fsk_live_your_api_key',
 * });
 *
 * // List dashboards
 * const dashboards = await api.listDashboards({
 *   page: 1,
 *   limit: 10,
 *   sortBy: 'createdAt',
 *   sortOrder: 'desc',
 * });
 *
 * // Get specific dashboard
 * const dashboard = await api.getDashboard('cly123abc', {
 *   includeRawData: true,
 * });
 *
 * // Get KPIs
 * const kpis = await api.getKPIs({
 *   dashboardId: 'cly123abc',
 *   metrics: 'revenue,margin,cashflow',
 * });
 * ```
 */
