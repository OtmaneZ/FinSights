import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Legacy (à supprimer progressivement)
                background: "var(--background)",
                foreground: "var(--foreground)",

                // Design System - Backgrounds
                'bg-primary': 'var(--background-primary)',
                'bg-secondary': 'var(--background-secondary)',
                'surface-elevated': 'var(--surface-elevated)',
                'surface-hover': 'var(--surface-hover)',

                // Design System - Borders
                'border-subtle': 'var(--border-subtle)',
                'border-default': 'var(--border-default)',
                'border-strong': 'var(--border-strong)',

                // Design System - Text
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'text-tertiary': 'var(--text-tertiary)',
                'text-disabled': 'var(--text-disabled)',

                // Design System - Accents
                'accent-gold': {
                    DEFAULT: 'var(--accent-gold)',
                    hover: 'var(--accent-gold-hover)',
                    subtle: 'var(--accent-gold-subtle)',
                    border: 'var(--accent-gold-border)',
                },
                'accent-green': {
                    DEFAULT: 'var(--accent-green)',
                    hover: 'var(--accent-green-hover)',
                    subtle: 'var(--accent-green-subtle)',
                    border: 'var(--accent-green-border)',
                },
                'accent-red': {
                    DEFAULT: 'var(--accent-red)',
                    hover: 'var(--accent-red-hover)',
                    subtle: 'var(--accent-red-subtle)',
                    border: 'var(--accent-red-border)',
                },
                'accent-orange': {
                    DEFAULT: 'var(--accent-orange)',
                    hover: 'var(--accent-orange-hover)',
                    subtle: 'var(--accent-orange-subtle)',
                    border: 'var(--accent-orange-border)',
                },
                'accent-blue': {
                    DEFAULT: 'var(--accent-blue)',
                    hover: 'var(--accent-blue-hover)',
                    subtle: 'var(--accent-blue-subtle)',
                    border: 'var(--accent-blue-border)',
                },

                // Legacy financial (compatible)
                primary: {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                },
                financial: {
                    green: '#10b981',
                    red: '#ef4444',
                    orange: '#f59e0b',
                }
            },
            fontFamily: {
                sans: ['var(--font-sans)'],
                mono: ['var(--font-mono)'],
            },
            boxShadow: {
                'sm': 'var(--shadow-sm)',
                'md': 'var(--shadow-md)',
                'lg': 'var(--shadow-lg)',
                'xl': 'var(--shadow-xl)',
                '2xl': 'var(--shadow-2xl)',
            },
            borderRadius: {
                'sm': 'var(--radius-sm)',
                'md': 'var(--radius-md)',
                'lg': 'var(--radius-lg)',
                'xl': 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
                'full': 'var(--radius-full)',
            },
            spacing: {
                '1': 'var(--space-1)',
                '2': 'var(--space-2)',
                '3': 'var(--space-3)',
                '4': 'var(--space-4)',
                '5': 'var(--space-5)',
                '6': 'var(--space-6)',
                '8': 'var(--space-8)',
                '10': 'var(--space-10)',
                '12': 'var(--space-12)',
                '16': 'var(--space-16)',
                '20': 'var(--space-20)',
                '24': 'var(--space-24)',
                '32': 'var(--space-32)',
            },
        },
    },
    plugins: [],
}
export default config