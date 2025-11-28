/**
 * API v1 - Documentation Endpoint
 * GET /api/v1/docs - OpenAPI/Swagger documentation
 */

import { NextResponse } from 'next/server';
import { openApiSpec } from '@/lib/openapi';

/**
 * GET /api/v1/docs - Return OpenAPI specification
 */
export async function GET() {
    return NextResponse.json(openApiSpec);
}
