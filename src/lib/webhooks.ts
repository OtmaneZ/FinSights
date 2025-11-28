/**
 * Webhooks System - Delivery & Retry Logic
 *
 * Features:
 * - Event triggering with payload
 * - Webhook signature verification (HMAC SHA256)
 * - Exponential backoff retry (3 attempts max)
 * - Delivery logs with success/failure tracking
 *
 * Supported Events:
 * - dashboard.created
 * - dashboard.updated
 * - dashboard.deleted
 * - kpi.threshold_reached
 * - company.created
 * - company.updated
 */

import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// ============================================
// TYPES
// ============================================

export type WebhookEvent =
    | 'dashboard.created'
    | 'dashboard.updated'
    | 'dashboard.deleted'
    | 'kpi.threshold_reached'
    | 'company.created'
    | 'company.updated';

export interface WebhookPayload {
    event: WebhookEvent;
    timestamp: string;
    data: any;
    userId: string;
}

export interface WebhookDeliveryResult {
    success: boolean;
    statusCode?: number;
    response?: string;
    errorReason?: string;
    attempts: number;
}

// ============================================
// WEBHOOK SIGNATURE
// ============================================

/**
 * Generate HMAC SHA256 signature for webhook payload
 */
export function generateWebhookSignature(payload: string, secret: string): string {
    return crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
): boolean {
    const expectedSignature = generateWebhookSignature(payload, secret);
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

// ============================================
// WEBHOOK DELIVERY
// ============================================

/**
 * Deliver webhook with retry logic (exponential backoff)
 * Max 3 attempts: 0s, 5s, 25s
 */
async function deliverWebhookWithRetry(
    url: string,
    payload: WebhookPayload,
    secret: string,
    maxAttempts: number = 3
): Promise<WebhookDeliveryResult> {
    const payloadString = JSON.stringify(payload);
    const signature = generateWebhookSignature(payloadString, secret);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            // Exponential backoff: 0s, 5s, 25s
            if (attempt > 1) {
                const delayMs = Math.pow(5, attempt - 1) * 1000;
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-FinSight-Signature': signature,
                    'X-FinSight-Event': payload.event,
                    'User-Agent': 'FinSight-Webhooks/1.0',
                },
                body: payloadString,
                signal: AbortSignal.timeout(10000), // 10s timeout
            });

            const responseText = await response.text();

            // Success: 2xx status codes
            if (response.ok) {
                return {
                    success: true,
                    statusCode: response.status,
                    response: responseText.slice(0, 500), // Limit response size
                    attempts: attempt,
                };
            }

            // Server error (5xx): retry
            if (response.status >= 500 && attempt < maxAttempts) {
                continue;
            }

            // Client error (4xx): don't retry
            return {
                success: false,
                statusCode: response.status,
                response: responseText.slice(0, 500),
                errorReason: `HTTP ${response.status}: ${response.statusText}`,
                attempts: attempt,
            };
        } catch (error: any) {
            // Network error: retry
            if (attempt < maxAttempts) {
                continue;
            }

            return {
                success: false,
                errorReason: error.message || 'Network error',
                attempts: attempt,
            };
        }
    }

    return {
        success: false,
        errorReason: `Failed after ${maxAttempts} attempts`,
        attempts: maxAttempts,
    };
}

// ============================================
// WEBHOOK TRIGGER
// ============================================

/**
 * Trigger webhook event for all subscribed webhooks
 */
export async function triggerWebhook(
    userId: string,
    event: WebhookEvent,
    data: any
): Promise<void> {
    // Find active webhooks subscribed to this event
    const webhooks = await prisma.webhook.findMany({
        where: {
            userId,
            active: true,
            events: {
                has: event,
            },
        },
    });

    if (webhooks.length === 0) {
        return;
    }

    // Build payload
    const payload: WebhookPayload = {
        event,
        timestamp: new Date().toISOString(),
        data,
        userId,
    };

    // Deliver to all webhooks (parallel)
    const deliveryPromises = webhooks.map(async (webhook) => {
        const result = await deliverWebhookWithRetry(
            webhook.url,
            payload,
            webhook.secret
        );

        // Log delivery
        await prisma.webhookLog.create({
            data: {
                webhookId: webhook.id,
                event,
                payload,
                statusCode: result.statusCode,
                response: result.response,
                success: result.success,
                attempts: result.attempts,
                errorReason: result.errorReason,
            },
        });

        // Update webhook lastTriggered
        await prisma.webhook.update({
            where: { id: webhook.id },
            data: { lastTriggered: new Date() },
        });

        return result;
    });

    await Promise.allSettled(deliveryPromises);
}

// ============================================
// WEBHOOK SECRET GENERATION
// ============================================

/**
 * Generate secure webhook secret (whsec_xxx format)
 */
export function generateWebhookSecret(): string {
    const randomBytes = crypto.randomBytes(32);
    const secret = randomBytes.toString('base64url');
    return `whsec_${secret}`;
}
