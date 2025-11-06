/**
 * PresenceIndicator - Affiche les utilisateurs connectés en temps réel
 * Style Figma/Notion avec avatars + tooltip
 */

'use client';

import { useEffect, useState } from 'react';
import { getPusherClient, CHANNELS, EVENTS, PresenceMember } from '@/lib/realtime/pusherClient';
import { UserIcon } from '@heroicons/react/24/solid';

interface PresenceIndicatorProps {
    enabled?: boolean;
}

export default function PresenceIndicator({ enabled = true }: PresenceIndicatorProps) {
    const [members, setMembers] = useState<PresenceMember[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        // Check if Pusher is configured
        const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
        if (!pusherKey || pusherKey === 'TEST_KEY') {
            console.log('⚠️ Pusher not configured - Skipping presence');
            return;
        }

        const pusher = getPusherClient();
        const presenceChannel = pusher.subscribe(CHANNELS.PRESENCE);

        // Connection status
        pusher.connection.bind('connected', () => {
            setIsConnected(true);
            console.log('✅ Connected to Pusher');
        });

        pusher.connection.bind('disconnected', () => {
            setIsConnected(false);
            console.log('🔌 Disconnected from Pusher');
        });

        // Presence events
        presenceChannel.bind('pusher:subscription_succeeded', (data: any) => {
            const initialMembers: PresenceMember[] = [];
            data.members.each((member: any) => {
                initialMembers.push({
                    id: member.id,
                    name: member.info.name,
                    color: member.info.color,
                });
            });
            setMembers(initialMembers);
            console.log(`👥 ${initialMembers.length} users online`);
        });

        presenceChannel.bind('pusher:member_added', (member: any) => {
            const newMember: PresenceMember = {
                id: member.id,
                name: member.info.name,
                color: member.info.color,
            };
            setMembers(prev => [...prev, newMember]);
            console.log(`👋 ${member.info.name} joined`);
        });

        presenceChannel.bind('pusher:member_removed', (member: any) => {
            setMembers(prev => prev.filter(m => m.id !== member.id));
            console.log(`👋 ${member.info.name} left`);
        });

        return () => {
            presenceChannel.unbind_all();
            pusher.unsubscribe(CHANNELS.PRESENCE);
        };
    }, [enabled]);

    // Don't render if Pusher not configured or disabled
    if (!enabled || !process.env.NEXT_PUBLIC_PUSHER_KEY || process.env.NEXT_PUBLIC_PUSHER_KEY === 'TEST_KEY') {
        return null;
    }

    // Don't render if not connected
    if (!isConnected && members.length === 0) {
        return null;
    }

    // Show max 5 avatars + counter
    const displayedMembers = members.slice(0, 5);
    const extraCount = members.length - 5;

    return (
        <div className="flex items-center gap-2">
            {/* Connection status indicator */}
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {isConnected ? 'En ligne' : 'Hors ligne'}
                </span>
            </div>

            {/* Avatars */}
            <div className="flex items-center -space-x-2">
                {displayedMembers.map((member) => (
                    <div
                        key={member.id}
                        className="relative group"
                    >
                        {/* Avatar */}
                        <div
                            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-semibold shadow-lg cursor-pointer transition-transform hover:scale-110 hover:z-10"
                            style={{ backgroundColor: member.color }}
                        >
                            {getInitials(member.name)}
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                            <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                                {member.name}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                                    <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Extra count badge */}
                {extraCount > 0 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-semibold shadow-lg">
                        +{extraCount}
                    </div>
                )}
            </div>

            {/* Member count text */}
            <span className="text-xs text-gray-500 dark:text-gray-400">
                {members.length === 1 ? '1 utilisateur' : `${members.length} utilisateurs`}
            </span>
        </div>
    );
}

/**
 * Get initials from name (max 2 chars)
 */
function getInitials(name: string): string {
    const words = name.split(' ');
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}
