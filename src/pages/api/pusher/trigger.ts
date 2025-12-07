/**
 * API Route: Pusher Trigger
 * Permet au client de broadcaster des events via le serveur
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { triggerPusherEvent } from '@/lib/realtime/pusherServer';
import { logger } from '@/lib/logger';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only POST method
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { channel, event, data } = req.body;

        if (!channel || !event) {
            return res.status(400).json({ error: 'Missing channel or event' });
        }

        // Trigger event via Pusher
        await triggerPusherEvent(channel, event, data || {});

        return res.status(200).json({ success: true });
    } catch (error) {
        logger.error('❌ Pusher trigger error:', error);
        return res.status(500).json({ error: 'Failed to trigger event' });
    }
}
