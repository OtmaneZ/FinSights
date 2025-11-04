'use client';

import { useTheme } from '@/lib/themeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl group"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
            {theme === 'dark' ? (
                <SunIcon className="w-6 h-6 text-yellow-400 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
                <MoonIcon className="w-6 h-6 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
            )}
        </button>
    );
}
