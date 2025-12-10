/**
 * Skip Navigation Link
 *
 * Allows keyboard users to skip repetitive navigation
 * WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks)
 */

'use client';

import Link from 'next/link';

export default function SkipLink() {
    return (
        <Link
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-primary focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
            Aller au contenu principal
        </Link>
    );
}
