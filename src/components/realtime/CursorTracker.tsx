/**
 * CursorTracker - Affiche les curseurs des autres utilisateurs
 * Broadcast position souris + affiche curseurs temps réel
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getPusherClient, CHANNELS, EVENTS, CursorMoveEvent } from '@/lib/realtime/pusherClient';
import { CursorArrowRaysIcon } from '@heroicons/react/24/solid';

interface Cursor {
    userId: string;
    userName: string;
    color: string;
    x: number;
    y: number;
    lastUpdate: number;
}

interface CursorTrackerProps {
    enabled?: boolean;
    userName?: string;
    userColor?: string;
}

export default function CursorTracker({
    enabled = true,
    userName = 'Anonymous',
    userColor = '#3B82F6'
}: CursorTrackerProps) {
    const [cursors, setCursors] = useState<Record<string, Cursor>>({});
    const channelRef = useRef<any>(null);
    const throttleRef = useRef<number | null>(null);

    // Throttled broadcast mouse position (200ms)
    const broadcastCursorPosition = useCallback((x: number, y: number) => {
        if (!channelRef.current) return;

        // Throttle to 200ms (reduced Pusher message consumption)
        if (throttleRef.current) return;

        throttleRef.current = window.setTimeout(() => {
            throttleRef.current = null;
        }, 200);

        const event: CursorMoveEvent = {
            userId: 'me', // Will be replaced by Pusher with socket_id
            x: (x / window.innerWidth) * 100, // Percentage for responsive
            y: (y / window.innerHeight) * 100,
            timestamp: Date.now(),
        };

        channelRef.current.trigger('client-cursor-move', event);
    }, []);

    // Mouse move handler
    useEffect(() => {
        if (!enabled) return;

        const handleMouseMove = (e: MouseEvent) => {
            broadcastCursorPosition(e.clientX, e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [enabled, broadcastCursorPosition]);

    // Pusher subscription
    useEffect(() => {
        if (!enabled) return;

        // Check if Pusher is configured
        const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
        if (!pusherKey || pusherKey === 'TEST_KEY') {
            return;
        }

        const pusher = getPusherClient();
        const presenceChannel = pusher.subscribe(CHANNELS.PRESENCE);

        channelRef.current = presenceChannel;

        // Listen to cursor movements from other users
        presenceChannel.bind('client-cursor-move', (data: CursorMoveEvent & { userName?: string; userColor?: string }) => {
            const userId = data.userId;

            setCursors(prev => ({
                ...prev,
                [userId]: {
                    userId,
                    userName: data.userName || 'User',
                    color: data.userColor || '#3B82F6',
                    x: data.x,
                    y: data.y,
                    lastUpdate: Date.now(),
                },
            }));
        });

        // Clean up idle cursors every 2 seconds
        const cleanupInterval = setInterval(() => {
            const now = Date.now();
            setCursors(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(userId => {
                    if (now - updated[userId].lastUpdate > 2000) {
                        delete updated[userId];
                    }
                });
                return updated;
            });
        }, 2000);

        return () => {
            clearInterval(cleanupInterval);
            presenceChannel.unbind('client-cursor-move');
            channelRef.current = null;
        };
    }, [enabled]);

    // Don't render if disabled or Pusher not configured
    if (!enabled || !process.env.NEXT_PUBLIC_PUSHER_KEY || process.env.NEXT_PUBLIC_PUSHER_KEY === 'TEST_KEY') {
        return null;
    }

    return (
        <>
            {Object.values(cursors).map((cursor) => (
                <div
                    key={cursor.userId}
                    className="fixed pointer-events-none z-50 transition-all duration-75 ease-out"
                    style={{
                        left: `${cursor.x}%`,
                        top: `${cursor.y}%`,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    {/* Cursor icon */}
                    <CursorArrowRaysIcon
                        className="w-6 h-6 drop-shadow-lg"
                        style={{ color: cursor.color }}
                    />

                    {/* User name label */}
                    <div
                        className="absolute top-6 left-2 px-2 py-1 rounded-md text-white text-xs font-medium shadow-lg whitespace-nowrap"
                        style={{ backgroundColor: cursor.color }}
                    >
                        {cursor.userName}
                    </div>
                </div>
            ))}
        </>
    );
}
