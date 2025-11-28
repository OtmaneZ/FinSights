/**
 * API v1 - Dashboards Endpoint
 * GET /api/v1/dashboards - List user's dashboards
 * GET /api/v1/dashboards/:id - Get specific dashboard
 *
 * Authentication: Bearer token (API key required)
 * Rate limit: Based on user plan
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
    authenticateRequest,
    apiError,
    apiPaginatedSuccess,
    apiSuccess,
} from '@/lib/apiAuth';

/**
 * GET /api/v1/dashboards - List dashboards with pagination
 *
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 100)
 * - companyId: Filter by company ID
 * - sortBy: Sort field (createdAt, updatedAt, fileName)
 * - sortOrder: Sort direction (asc, desc)
 *
 * Response:
 * {
 *   "success": true,
 *   "data": [...],
 *   "meta": { total, page, limit, totalPages, hasMore }
 * }
 */
export async function GET(request: NextRequest) {
    // Authenticate request
    const { auth, error } = await authenticateRequest(request);
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);

        // Parse pagination parameters
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.min(
            100,
            Math.max(1, parseInt(searchParams.get('limit') || '10', 10))
        );
        const skip = (page - 1) * limit;

        // Parse filter parameters
        const companyId = searchParams.get('companyId');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Validate sortBy
        const validSortFields = ['createdAt', 'updatedAt', 'fileName'];
        if (!validSortFields.includes(sortBy)) {
            return apiError(
                `Invalid sortBy field. Allowed: ${validSortFields.join(', ')}`,
                'INVALID_SORT_FIELD',
                400
            );
        }

        // Build query
        const where: any = { userId: auth!.userId };
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

        // Count total
        const total = await prisma.dashboard.count({ where });

        // Fetch dashboards
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
            orderBy: { [sortBy]: sortOrder },
            skip,
            take: limit,
        });

        // Transform response (exclude raw data for list view)
        const items = dashboards.map((dashboard) => ({
            id: dashboard.id,
            fileName: dashboard.fileName,
            fileUrl: dashboard.fileUrl,
            company: dashboard.company,
            kpis: dashboard.kpis, // Include KPIs summary
            createdAt: dashboard.createdAt.toISOString(),
            updatedAt: dashboard.updatedAt.toISOString(),
        }));

        return apiPaginatedSuccess(items, total, page, limit);
    } catch (error) {
        console.error('API v1 dashboards list error:', error);
        return apiError('Failed to fetch dashboards', 'FETCH_ERROR', 500);
    }
}

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
 * 
 * NOTE: This route is now handled by /api/v1/dashboards/[id]/route.ts
 */
/*
export async function GET_BY_ID(request: NextRequest) {
    const { auth, error } = await authenticateRequest(request);
    if (error) return error;

    try {
        const { searchParams, pathname } = new URL(request.url);
        const dashboardId = pathname.split('/').pop();

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
*/
