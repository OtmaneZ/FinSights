/**
 * RealtimeToast - Notifications temps réel pour événements collaboration
 */

'use client';

import { useState, useEffect } from 'react';
import {
    DocumentArrowUpIcon,
    ChartBarIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
    CheckCircleIcon,
    InformationCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

export interface ToastNotification {
    id: string;
    type: 'file-upload' | 'kpi-update' | 'anomaly' | 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    duration?: number; // ms
}

interface RealtimeToastProps {
    notifications: ToastNotification[];
    onDismiss: (id: string) => void;
}

export default function RealtimeToast({ notifications, onDismiss }: RealtimeToastProps) {
    // Debug: log notifications
    useEffect(() => {
        if (notifications.length > 0) {
            console.log('🔔 RealtimeToast received notifications:', notifications);
        }
    }, [notifications]);

    // Auto-dismiss after duration
    useEffect(() => {
        if (notifications.length === 0) return;

        const timers: NodeJS.Timeout[] = [];

        notifications.forEach((notification) => {
            const duration = notification.duration || 5000;
            const timer = setTimeout(() => {
                onDismiss(notification.id);
            }, duration);
            timers.push(timer);
        });

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [notifications, onDismiss]);

    console.log('🎨 RealtimeToast render:', { count: notifications.length, notifications });

    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className="surface dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-start gap-3 animate-slideInRight"
                >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        {notification.type === 'file-upload' && (
                            <DocumentArrowUpIcon className="w-6 h-6 text-accent-primary dark:text-blue-400" />
                        )}
                        {notification.type === 'kpi-update' && (
                            <ChartBarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        )}
                        {notification.type === 'anomaly' && (
                            <ExclamationTriangleIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        )}
                        {notification.type === 'warning' && (
                            <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        )}
                        {notification.type === 'error' && (
                            <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                        )}
                        {notification.type === 'success' && (
                            <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        )}
                        {notification.type === 'info' && (
                            <InformationCircleIcon className="w-6 h-6 text-accent-primary dark:text-blue-400" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.message}
                        </p>
                    </div>

                    {/* Dismiss button */}
                    <button
                        onClick={() => onDismiss(notification.id)}
                        className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                        <XMarkIcon className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            ))}
        </div>
    );
}
