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
                'primary': 'var(--text-primary)',
                'secondary': 'var(--text-secondary)',
                'tertiary': 'var(--text-tertiary)',
                'disabled': 'var(--text-disabled)',

                // Design System - Surfaces
                'surface': 'var(--surface-elevated)',

                // Design System - Accents (Corporate Theme)
                'accent-primary': {
                    DEFAULT: 'var(--accent-primary)',
                    hover: 'var(--accent-primary-hover)',
                    subtle: 'var(--accent-primary-subtle)',
                    border: 'var(--accent-primary-border)',
                },
                'accent-success': {
                    DEFAULT: 'var(--accent-success)',
                    hover: 'var(--accent-success-hover)',
                    subtle: 'var(--accent-success-subtle)',
                    border: 'var(--accent-success-border)',
                },
                'accent-warning': {
                    DEFAULT: 'var(--accent-warning)',
                    hover: 'var(--accent-warning-hover)',
                    subtle: 'var(--accent-warning-subtle)',
                    border: 'var(--accent-warning-border)',
                },
                'accent-danger': {
                    DEFAULT: 'var(--accent-danger)',
                    hover: 'var(--accent-danger-hover)',
                    subtle: 'var(--accent-danger-subtle)',
                    border: 'var(--accent-danger-border)',
                },
                'accent-info': {
                    DEFAULT: 'var(--accent-info)',
                    hover: 'var(--accent-info-hover)',
                    subtle: 'var(--accent-info-subtle)',
                    border: 'var(--accent-info-border)',
                },

                // Legacy financial colors (backward compatible)
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