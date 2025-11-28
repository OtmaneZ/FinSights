/**
 * API v1 - Dashboard Detail Endpoint
 * GET /api/v1/dashboards/:id - Get specific dashboard
 *
 * Authentication: Bearer token (API key required)
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, apiError, apiSuccess } from '@/lib/apiAuth';

/**
 * GET /api/v1/dashboards/:id - Get specific dashboard with full data
 *
 * Path parameter:
 * - id: Dashboard ID
 *
 * Query parameter:
 * - includeRawData: Include raw transaction data (default: false)
 *
 * Response:
 * {
 *   "success": true,
 *   "data": { id, fileName, kpis, rawData?, company, ... }
 * }
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { auth, error } = await authenticateRequest(request);
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);
        const dashboardId = params.id;

        if (!dashboardId) {
            return apiError('Dashboard ID is required', 'MISSING_ID', 400);
        }

        const includeRawData = searchParams.get('includeRawData') === 'true';

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

        // Build response
        const response: any = {
            id: dashboard.id,
            fileName: dashboard.fileName,
            fileUrl: dashboard.fileUrl,
            company: dashboard.company,
            kpis: dashboard.kpis,
            createdAt: dashboard.createdAt.toISOString(),
            updatedAt: dashboard.updatedAt.toISOString(),
        };

        if (includeRawData) {
            response.rawData = dashboard.rawData;
        }

        return apiSuccess(response);
    } catch (error) {
        console.error('API v1 dashboard detail error:', error);
        return apiError('Failed to fetch dashboard', 'FETCH_ERROR', 500);
    }
}
