/**
 * useRealtimeSync - Hook pour synchroniser état dashboard en temps réel
 * Broadcast + Listen KPI updates, file uploads, drill-down events
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { getPusherClient, CHANNELS, KPIUpdateEvent, FileUploadEvent } from '@/lib/realtime/pusherClient';
import { triggerPusherEvent } from '@/lib/realtime/pusherServer';
import { logger } from '@/lib/logger';

export interface UseRealtimeSyncOptions {
    enabled?: boolean;
    onKPIUpdate?: (event: KPIUpdateEvent) => void;
    onFileUpload?: (event: FileUploadEvent) => void;
    onDrillDown?: (data: any) => void;
    onAnomalyDetected?: (data: any) => void;
}

export function useRealtimeSync(options: UseRealtimeSyncOptions) {
    const {
        enabled = true,
        onKPIUpdate,
        onFileUpload,
        onDrillDown,
        onAnomalyDetected,
    } = options;

    const channelRef = useRef<any>(null);
    const lastBroadcastRef = useRef<number>(0);

    // Broadcast KPI update
    const broadcastKPIUpdate = useCallback(async (kpiType: string, value: number) => {
        if (!enabled) return;

        // Throttle broadcasts (max 1 per second per KPI)
        const now = Date.now();
        if (now - lastBroadcastRef.current < 1000) {
            return;
        }
        lastBroadcastRef.current = now;

        const event: KPIUpdateEvent = {
            userId: 'me',
            timestamp: now,
            kpiType,
            value,
        };

        try {
            await fetch('/api/pusher/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    channel: CHANNELS.DASHBOARD,
                    event: 'kpi-updated',
                    data: event,
                }),
            });
            logger.debug(`📊 KPI update broadcasted: ${kpiType} = ${value}`);
        } catch (error) {
            logger.error('❌ Failed to broadcast KPI update:', error);
        }
    }, [enabled]);

    // Broadcast file upload
    const broadcastFileUpload = useCallback(async (fileName: string, fileSize: number, userName: string = 'Utilisateur') => {
        if (!enabled) return;

        const event: FileUploadEvent = {
            userId: 'me',
            userName,
            fileName,
            fileSize,
            timestamp: Date.now(),
        };

        try {
            await fetch('/api/pusher/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    channel: CHANNELS.DASHBOARD,
                    event: 'file-uploaded',
                    data: event,
                }),
            });
            logger.debug(`📁 File upload broadcasted: ${fileName}`);
        } catch (error) {
            logger.error('❌ Failed to broadcast file upload:', error);
        }
    }, [enabled]);

    // Broadcast drill-down event
    const broadcastDrillDown = useCallback(async (kpiName: string, level: number) => {
        if (!enabled) return;

        try {
            await fetch('/api/pusher/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    channel: CHANNELS.DASHBOARD,
                    event: 'drill-down',
                    data: { kpiName, level, timestamp: Date.now() },
                }),
            });
            logger.debug(`🔍 Drill-down broadcasted: ${kpiName} level ${level}`);
        } catch (error) {
            logger.error('❌ Failed to broadcast drill-down:', error);
        }
    }, [enabled]);

    // Subscribe to dashboard events
    useEffect(() => {
        if (!enabled) return;

        // Check if Pusher is configured
        const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
        if (!pusherKey || pusherKey === 'TEST_KEY') {
            logger.debug('⚠️ Pusher not configured - Skipping realtime sync');
            return;
        }

        const pusher = getPusherClient();
        const dashboardChannel = pusher.subscribe(CHANNELS.DASHBOARD);

        channelRef.current = dashboardChannel;

        // Listen to KPI updates
        dashboardChannel.bind('kpi-updated', (data: KPIUpdateEvent) => {
            logger.debug('📊 KPI update received:', data);
            if (onKPIUpdate) {
                onKPIUpdate(data);
            }
        });

        // Listen to file uploads
        dashboardChannel.bind('file-uploaded', (data: FileUploadEvent) => {
            logger.debug('📁 File upload received:', data);
            if (onFileUpload) {
                onFileUpload(data);
            }
        });

        // Listen to drill-down events
        dashboardChannel.bind('drill-down', (data: any) => {
            logger.debug('🔍 Drill-down received:', data);
            if (onDrillDown) {
                onDrillDown(data);
            }
        });

        // Listen to anomaly detections
        dashboardChannel.bind('anomaly-detected', (data: any) => {
            logger.debug('🚨 Anomaly detected:', data);
            if (onAnomalyDetected) {
                onAnomalyDetected(data);
            }
        });

        return () => {
            dashboardChannel.unbind_all();
            pusher.unsubscribe(CHANNELS.DASHBOARD);
            channelRef.current = null;
        };
    }, [enabled, onKPIUpdate, onFileUpload, onDrillDown, onAnomalyDetected]);

    return {
        broadcastKPIUpdate,
        broadcastFileUpload,
        broadcastDrillDown,
        isConnected: !!channelRef.current,
    };
}
