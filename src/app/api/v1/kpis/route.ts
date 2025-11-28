/**
 * API v1 - KPIs Endpoint
 * GET /api/v1/kpis - Get aggregated KPIs across dashboards
 *
 * Authentication: Bearer token (API key required)
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, apiError, apiSuccess } from '@/lib/apiAuth';

/**
 * GET /api/v1/kpis - Get KPIs with optional filtering
 *
 * Query parameters:
 * - companyId: Filter by company ID
 * - dashboardId: Get KPIs for specific dashboard
 * - metrics: Comma-separated list of metrics to include
 *   (revenue, margin, cashflow, dso, bfr, all)
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "dashboardId": "xxx",
 *     "companyId": "xxx",
 *     "metrics": { revenue, margin, cashflow, dso, bfr }
 *   }
 * }
 */
export async function GET(request: NextRequest) {
    const { auth, error } = await authenticateRequest(request);
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);

        const companyId = searchParams.get('companyId');
        const dashboardId = searchParams.get('dashboardId');
        const metricsParam = searchParams.get('metrics') || 'all';

        // Parse requested metrics
        const requestedMetrics = metricsParam === 'all'
            ? ['revenue', 'margin', 'cashflow', 'dso', 'bfr']
            : metricsParam.split(',').map((m) => m.trim());

        // Validate metrics
        const validMetrics = ['revenue', 'margin', 'cashflow', 'dso', 'bfr'];
        const invalidMetrics = requestedMetrics.filter(
            (m) => !validMetrics.includes(m)
        );
        if (invalidMetrics.length > 0) {
            return apiError(
                `Invalid metrics: ${invalidMetrics.join(', ')}. Allowed: ${validMetrics.join(', ')}`,
                'INVALID_METRICS',
                400
            );
        }

        // Build query
        const where: any = { userId: auth!.userId };

        if (dashboardId) {
            // Get specific dashboard KPIs
            const dashboard = await prisma.dashboard.findFirst({
                where: {
                    id: dashboardId,
                    userId: auth!.userId,
                },
                include: {
                    company: {
                        select: {
                            id: true,
                            name: true,
                            sector: true,
                        },
                    },
                },
            });

            if (!dashboard) {
                return apiError(
                    'Dashboard not found or access denied',
                    'DASHBOARD_NOT_FOUND',
                    404
                );
            }

            // Extract and filter KPIs
            const kpis = dashboard.kpis as any;
            const filteredKpis = filterKpis(kpis, requestedMetrics);

            return apiSuccess({
                dashboardId: dashboard.id,
                companyId: dashboard.companyId,
                company: dashboard.company,
                metrics: filteredKpis,
                updatedAt: dashboard.updatedAt.toISOString(),
            });
        }

        if (companyId) {
            // Verify user owns this company
            const company = await prisma.company.findFirst({
                where: { id: companyId, userId: auth!.userId },
            });

            if (!company) {
                return apiError(
                    'Company not found or access denied',
                    'COMPANY_NOT_FOUND',
                    404
                );
            }

            where.companyId = companyId;
        }

        // Get all dashboards for aggregation
        const dashboards = await prisma.dashboard.findMany({
            where,
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        sector: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (dashboards.length === 0) {
            return apiSuccess({
                message: 'No dashboards found',
                metrics: {},
            });
        }

        // Aggregate KPIs across dashboards
        const aggregatedKpis = aggregateKpis(dashboards, requestedMetrics);

        return apiSuccess({
            companyId: companyId || null,
            dashboardCount: dashboards.length,
            metrics: aggregatedKpis,
            companies: Array.from(
                new Set(dashboards.map((d) => d.company.name))
            ),
        });
    } catch (error) {
        console.error('API v1 KPIs error:', error);
        return apiError('Failed to fetch KPIs', 'FETCH_ERROR', 500);
    }
}

/**
 * Filter KPIs to include only requested metrics
 */
function filterKpis(kpis: any, requestedMetrics: string[]): any {
    const filtered: any = {};

    for (const metric of requestedMetrics) {
        if (kpis[metric] !== undefined) {
            filtered[metric] = kpis[metric];
        }
    }

    return filtered;
}

/**
 * Aggregate KPIs across multiple dashboards
 * Returns average values for numeric metrics
 */
function aggregateKpis(dashboards: any[], requestedMetrics: string[]): any {
    const aggregated: any = {};

    for (const metric of requestedMetrics) {
        const values: number[] = [];

        for (const dashboard of dashboards) {
            const kpis = dashboard.kpis as any;
            if (kpis[metric] !== undefined && typeof kpis[metric] === 'number') {
                values.push(kpis[metric]);
            } else if (
                kpis[metric] !== undefined &&
                typeof kpis[metric] === 'object' &&
                kpis[metric].value !== undefined
            ) {
                values.push(kpis[metric].value);
            }
        }

        if (values.length > 0) {
            aggregated[metric] = {
                average: values.reduce((a, b) => a + b, 0) / values.length,
                min: Math.min(...values),
                max: Math.max(...values),
                count: values.length,
            };
        }
    }

    return aggregated;
}
