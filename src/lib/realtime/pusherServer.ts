/**
 * Pusher Server Configuration
 * Backend pour trigger events real-time
 */

import Pusher from 'pusher';
import { logger } from '@/lib/logger';

// Configuration Pusher Server
const pusherConfig = {
    appId: process.env.PUSHER_APP_ID || '',
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
    secret: process.env.PUSHER_SECRET || '',
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
    useTLS: true,
};

let pusherServerInstance: Pusher | null = null;

/**
 * Get or create Pusher server instance (singleton)
 */
export function getPusherServer(): Pusher {
    if (pusherServerInstance) {
        return pusherServerInstance;
    }

    pusherServerInstance = new Pusher(pusherConfig);

    return pusherServerInstance;
}

/**
 * Trigger event to specific channel
 */
export async function triggerPusherEvent(
    channel: string,
    event: string,
    data: any
): Promise<void> {
    const pusher = getPusherServer();

    try {
        await pusher.trigger(channel, event, data);
        logger.debug(`✅ Pusher event triggered: ${event} on ${channel}`);
    } catch (error) {
        logger.error('❌ Pusher trigger error:', error);
        throw error;
    }
}

/**
 * Trigger event to multiple channels
 */
export async function triggerPusherEventMultiple(
    channels: string[],
    event: string,
    data: any
): Promise<void> {
    const pusher = getPusherServer();

    try {
        await pusher.trigger(channels, event, data);
        logger.debug(`✅ Pusher event triggered: ${event} on ${channels.length} channels`);
    } catch (error) {
        logger.error('❌ Pusher trigger error:', error);
        throw error;
    }
}

/**
 * Authenticate private/presence channel
 */
export function authenticatePusherChannel(
    socketId: string,
    channel: string,
    presenceData?: {
        user_id: string;
        user_info: {
            name: string;
            color: string;
        };
    }
): any {
    const pusher = getPusherServer();

    if (channel.startsWith('presence-')) {
        // Presence channel authentication
        return pusher.authorizeChannel(socketId, channel, presenceData);
    } else {
        // Private channel authentication
        return pusher.authorizeChannel(socketId, channel);
    }
}
