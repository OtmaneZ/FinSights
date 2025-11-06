'use client';

import { useTheme } from '@/lib/themeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-6 z-[100] p-3 rounded-full bg-surface-elevated border-2 border-accent-gold-border hover:border-accent-gold transition-all duration-300 shadow-xl hover:shadow-2xl group"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
            {theme === 'dark' ? (
                <SunIcon className="w-6 h-6 text-accent-gold group-hover:rotate-45 transition-transform duration-300" />
            ) : (
                <MoonIcon className="w-6 h-6 text-accent-gold group-hover:-rotate-12 transition-transform duration-300" />
            )}
        </button>
    );
}
