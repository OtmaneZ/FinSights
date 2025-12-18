'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light'); // Default light pour éviter flash
    const [mounted, setMounted] = useState(false);

    // Charger le thème depuis localStorage au montage
    useEffect(() => {
        const savedTheme = localStorage.getItem('finsight-theme') as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            // Détecter la préférence système
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'dark' : 'light');
        }
        setMounted(true);
    }, []);

    // Appliquer le thème au document
    useEffect(() => {
        if (mounted) {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(theme);
            localStorage.setItem('finsight-theme', theme);
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    // Toujours rendre les enfants pour éviter les erreurs d'hydratation
    // Le thème sera appliqué correctement après le montage côté client
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
