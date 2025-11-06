/**
 * Pusher Client Configuration
 * Real-time collaboration pour FinSight Dashboard
 */

import Pusher from 'pusher-js';

// Configuration Pusher
const PUSHER_CONFIG = {
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
    authEndpoint: '/api/pusher/auth',
};

let pusherInstance: Pusher | null = null;

/**
 * Get or create Pusher client instance (singleton)
 */
export function getPusherClient(): Pusher {
    if (pusherInstance) {
        return pusherInstance;
    }

    pusherInstance = new Pusher(PUSHER_CONFIG.key, {
        cluster: PUSHER_CONFIG.cluster,
        authEndpoint: PUSHER_CONFIG.authEndpoint,
        // Enable logging in development
        enabledTransports: ['ws', 'wss'],
    });

    // Debug logs in development
    if (process.env.NODE_ENV === 'development') {
        Pusher.logToConsole = true;
    }

    return pusherInstance;
}

/**
 * Disconnect Pusher client
 */
export function disconnectPusher(): void {
    if (pusherInstance) {
        pusherInstance.disconnect();
        pusherInstance = null;
    }
}

/**
 * Channel names constants
 */
export const CHANNELS = {
    PRESENCE: 'presence-dashboard',
    DASHBOARD: 'private-dashboard',
    NOTIFICATIONS: 'notifications',
} as const;

/**
 * Event names constants
 */
export const EVENTS = {
    // Presence events
    MEMBER_ADDED: 'pusher:member_added',
    MEMBER_REMOVED: 'pusher:member_removed',

    // Dashboard events
    KPI_UPDATED: 'kpi-updated',
    FILE_UPLOADED: 'file-uploaded',
    DRILL_DOWN: 'drill-down',
    ANOMALY_DETECTED: 'anomaly-detected',

    // Cursor tracking
    CURSOR_MOVE: 'cursor-move',
    CURSOR_IDLE: 'cursor-idle',
} as const;

// Types
export interface PresenceMember {
    id: string;
    name: string;
    color: string;
    cursor?: { x: number; y: number };
}

export interface KPIUpdateEvent {
    userId: string;
    timestamp: number;
    kpiType: string;
    value: number;
}

export interface FileUploadEvent {
    userId: string;
    userName: string;
    fileName: string;
    fileSize: number;
    timestamp: number;
}

export interface CursorMoveEvent {
    userId: string;
    x: number;
    y: number;
    timestamp: number;
}
