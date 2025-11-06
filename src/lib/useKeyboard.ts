/**
 * useKeyboard - Hook pour gérer les raccourcis clavier globaux
 */

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
    key: string;
    metaKey?: boolean;
    shiftKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    action: () => void;
    description: string;
}

export interface UseKeyboardOptions {
    shortcuts: KeyboardShortcut[];
    enabled?: boolean;
}

/**
 * Hook pour gérer les raccourcis clavier
 * Usage:
 *
 * useKeyboard({
 *   shortcuts: [
 *     { key: 'k', metaKey: true, action: openCommandPalette, description: 'Ouvrir palette' },
 *     { key: 'e', metaKey: true, action: exportPDF, description: 'Exporter PDF' }
 *   ]
 * });
 */
export function useKeyboard({ shortcuts, enabled = true }: UseKeyboardOptions) {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!enabled) return;

            // Find matching shortcut
            const shortcut = shortcuts.find((s) => {
                const keyMatch = s.key.toLowerCase() === event.key.toLowerCase();
                const metaMatch = s.metaKey === undefined || s.metaKey === (event.metaKey || event.ctrlKey);
                const shiftMatch = s.shiftKey === undefined || s.shiftKey === event.shiftKey;
                const ctrlMatch = s.ctrlKey === undefined || s.ctrlKey === event.ctrlKey;
                const altMatch = s.altKey === undefined || s.altKey === event.altKey;

                return keyMatch && metaMatch && shiftMatch && ctrlMatch && altMatch;
            });

            if (shortcut) {
                // Prevent default browser behavior
                event.preventDefault();
                event.stopPropagation();

                // Execute action
                shortcut.action();
            }
        },
        [shortcuts, enabled]
    );

    useEffect(() => {
        if (!enabled) return;

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown, enabled]);

    return null;
}

/**
 * Utility: Format shortcut for display
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];

    if (shortcut.metaKey) parts.push('⌘');
    if (shortcut.shiftKey) parts.push('⇧');
    if (shortcut.ctrlKey) parts.push('⌃');
    if (shortcut.altKey) parts.push('⌥');

    parts.push(shortcut.key.toUpperCase());

    return parts.join('');
}

/**
 * Utility: Check if Mac
 */
export function isMac(): boolean {
    if (typeof window === 'undefined') return false;
    return window.navigator.platform.toLowerCase().includes('mac');
}

/**
 * Utility: Get modifier key symbol (⌘ on Mac, Ctrl on Windows)
 */
export function getModifierSymbol(): string {
    return isMac() ? '⌘' : 'Ctrl';
}
