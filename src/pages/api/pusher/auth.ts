/**
 * API Route: Pusher Authentication
 * Authentifie les connexions Pusher pour channels privés/presence
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { authenticatePusherChannel } from '@/lib/realtime/pusherServer';
import { logger } from '@/lib/logger';

// Générer une couleur aléatoire pour l'utilisateur
function generateUserColor(): string {
    const colors = [
        '#3B82F6', // blue
        '#10B981', // green
        '#F59E0B', // amber
        '#EF4444', // red
        '#8B5CF6', // purple
        '#EC4899', // pink
        '#14B8A6', // teal
        '#F97316', // orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Générer un nom utilisateur anonyme
function generateUserName(): string {
    const adjectives = ['Analyste', 'Expert', 'Consultant', 'Directeur', 'Manager'];
    const nouns = ['Finance', 'Tréso', 'Budget', 'Compta', 'Contrôle'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 99) + 1;
    return `${adj} ${noun} ${num}`;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only POST method
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { socket_id, channel_name } = req.body;

        if (!socket_id || !channel_name) {
            return res.status(400).json({ error: 'Missing socket_id or channel_name' });
        }

        // Generate user info (in production, get from session/JWT)
        const userId = `user-${Math.random().toString(36).substr(2, 9)}`;
        const userName = generateUserName();
        const userColor = generateUserColor();

        // Authenticate channel
        let authResponse;

        if (channel_name.startsWith('presence-')) {
            // Presence channel with user info
            authResponse = authenticatePusherChannel(socket_id, channel_name, {
                user_id: userId,
                user_info: {
                    name: userName,
                    color: userColor,
                },
            });
        } else if (channel_name.startsWith('private-')) {
            // Private channel
            authResponse = authenticatePusherChannel(socket_id, channel_name);
        } else {
            return res.status(403).json({ error: 'Channel not authorized' });
        }

        logger.debug(`✅ Pusher auth: ${userName} → ${channel_name}`);

        return res.status(200).json(authResponse);
    } catch (error) {
        logger.error('❌ Pusher auth error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
    }
}
