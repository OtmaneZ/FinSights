/**
 * Lazy Load D3.js Hook
 *
 * D3.js is ~500KB, so we load it only when needed
 * This hook handles dynamic import with loading state
 */

'use client';

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

type D3Module = typeof import('d3');

export function useD3() {
    const [d3, setD3] = useState<D3Module | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;

        async function loadD3() {
            try {
                logger.time('D3.js load');
                const d3Module = await import('d3');
                logger.timeEnd('D3.js load');

                if (mounted) {
                    setD3(d3Module);
                    setLoading(false);
                }
            } catch (err) {
                logger.error('Failed to load D3.js', err);
                if (mounted) {
                    setError(err as Error);
                    setLoading(false);
                }
            }
        }

        loadD3();

        return () => {
            mounted = false;
        };
    }, []);

    return { d3, loading, error };
}
