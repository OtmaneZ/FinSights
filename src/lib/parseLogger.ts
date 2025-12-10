/**
 * Parse Logger - Tracking upload & parsing analytics
 * Logs all upload attempts for monitoring and improvement
 */

import { prisma } from './prisma';
import { logger } from './logger';

export type ParseMethod = 'AI' | 'CLASSIC' | 'ERROR';

export interface ParseLogData {
    userId?: string;
    fileName: string;
    fileSize: number;
    mimeType?: string;
    parseMethod: ParseMethod;
    success: boolean;
    error?: string;
    executionTime?: number;
    tokensUsed?: number;
    recordsFound?: number;
    aiModel?: string;
    fallbackUsed?: boolean;
}

/**
 * Log a parse attempt to database for analytics
 * Non-blocking - errors are caught and logged but don't interrupt the flow
 */
export async function logParseAttempt(data: ParseLogData): Promise<void> {
    try {
        await prisma.parseLog.create({
            data: {
                userId: data.userId || null,
                fileName: data.fileName,
                fileSize: data.fileSize,
                mimeType: data.mimeType || null,
                parseMethod: data.parseMethod,
                success: data.success,
                error: data.error || null,
                executionTime: data.executionTime || null,
                tokensUsed: data.tokensUsed || null,
                recordsFound: data.recordsFound || null,
                aiModel: data.aiModel || null,
                fallbackUsed: data.fallbackUsed || false,
            }
        });

        logger.debug(`[ParseLogger] ✅ Logged ${data.parseMethod} parse attempt (success: ${data.success})`);
    } catch (error) {
        // Don't fail the upload if logging fails
        logger.error('[ParseLogger] ⚠️ Failed to log parse attempt:', error);
    }
}

/**
 * Get parse statistics for analytics dashboard
 */
export async function getParseStats(userId?: string) {
    try {
        const where = userId ? { userId } : {};

        const [total, successful, failed, aiCount, classicCount] = await Promise.all([
            prisma.parseLog.count({ where }),
            prisma.parseLog.count({ where: { ...where, success: true } }),
            prisma.parseLog.count({ where: { ...where, success: false } }),
            prisma.parseLog.count({ where: { ...where, parseMethod: 'AI' } }),
            prisma.parseLog.count({ where: { ...where, parseMethod: 'CLASSIC' } }),
        ]);

        const avgExecutionTime = await prisma.parseLog.aggregate({
            where: { ...where, executionTime: { not: null } },
            _avg: { executionTime: true }
        });

        return {
            total,
            successful,
            failed,
            successRate: total > 0 ? (successful / total) * 100 : 0,
            aiCount,
            classicCount,
            fallbackRate: aiCount > 0 ? (classicCount / aiCount) * 100 : 0,
            avgExecutionTime: avgExecutionTime._avg.executionTime || 0
        };
    } catch (error) {
        logger.error('[ParseLogger] Failed to get parse stats:', error);
        return null;
    }
}
