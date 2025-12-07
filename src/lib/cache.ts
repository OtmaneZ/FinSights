/**
 * FinSight Cache Manager - Gestion du cache localStorage
 * Permet de persister les données financières entre sessions
 */

import { FinSightDataModel } from './dataModel';
import { logger } from '@/lib/logger';

const CACHE_KEY = 'finsight_data';
const CACHE_HISTORY_KEY = 'finsight_history';
const MAX_HISTORY_ITEMS = 10;

export interface CacheEntry {
    id: string;
    timestamp: string;
    fileName: string;
    recordCount: number;
    preview: {
        revenue: string;
        margin: string;
        period: string;
    };
    data: FinSightDataModel;
}

export interface CacheHistory {
    entries: CacheEntry[];
    currentId?: string;
}

export class FinSightCache {
    private static instance: FinSightCache;

    static getInstance(): FinSightCache {
        if (!FinSightCache.instance) {
            FinSightCache.instance = new FinSightCache();
        }
        return FinSightCache.instance;
    }

    // ===== GESTION DONNÉES COURANTES =====

    /**
     * Sauvegarde les données actuelles dans le cache
     */
    saveCurrentData(data: FinSightDataModel): void {
        try {
            const cacheEntry: CacheEntry = {
                id: data.id,
                timestamp: data.timestamp,
                fileName: data.fileName,
                recordCount: data.recordCount,
                preview: {
                    revenue: data.kpis.revenue.formatted,
                    margin: data.kpis.margin.formatted,
                    period: data.period.label
                },
                data
            };

            // Sauver comme données courantes
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));

            // Ajouter à l'historique
            this.addToHistory(cacheEntry);

            logger.debug('✅ Données sauvegardées dans le cache:', data.fileName);
        } catch (error) {
            logger.error('❌ Erreur de sauvegarde cache:', error);
        }
    }

    /**
     * Récupère les données actuelles du cache
     */
    getCurrentData(): FinSightDataModel | null {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const cacheEntry: CacheEntry = JSON.parse(cached);
            return cacheEntry.data;
        } catch (error) {
            logger.error('❌ Erreur de lecture cache:', error);
            return null;
        }
    }

    /**
     * Vérifie si des données sont en cache
     */
    hasCurrentData(): boolean {
        return localStorage.getItem(CACHE_KEY) !== null;
    }

    /**
     * Supprime les données courantes
     */
    clearCurrentData(): void {
        localStorage.removeItem(CACHE_KEY);
        logger.debug('🗑️ Cache courant effacé');
    }

    // ===== GESTION HISTORIQUE =====

    /**
     * Ajoute une entrée à l'historique
     */
    private addToHistory(entry: CacheEntry): void {
        try {
            const history = this.getHistory();

            // Éviter les doublons
            const existingIndex = history.entries.findIndex(e => e.id === entry.id);
            if (existingIndex >= 0) {
                history.entries[existingIndex] = entry;
            } else {
                history.entries.unshift(entry);
            }

            // Limiter la taille de l'historique
            if (history.entries.length > MAX_HISTORY_ITEMS) {
                history.entries = history.entries.slice(0, MAX_HISTORY_ITEMS);
            }

            history.currentId = entry.id;

            localStorage.setItem(CACHE_HISTORY_KEY, JSON.stringify(history));
        } catch (error) {
            logger.error('❌ Erreur ajout historique:', error);
        }
    }

    /**
     * Récupère l'historique complet
     */
    getHistory(): CacheHistory {
        try {
            const cached = localStorage.getItem(CACHE_HISTORY_KEY);
            if (!cached) {
                return { entries: [] };
            }
            return JSON.parse(cached);
        } catch (error) {
            logger.error('❌ Erreur lecture historique:', error);
            return { entries: [] };
        }
    }

    /**
     * Récupère une entrée spécifique de l'historique
     */
    getHistoryEntry(id: string): CacheEntry | null {
        const history = this.getHistory();
        return history.entries.find(e => e.id === id) || null;
    }

    /**
     * Charge une entrée depuis l'historique comme données courantes
     */
    loadFromHistory(id: string): FinSightDataModel | null {
        const entry = this.getHistoryEntry(id);
        if (!entry) return null;

        // Mettre à jour comme données courantes
        localStorage.setItem(CACHE_KEY, JSON.stringify(entry));

        const history = this.getHistory();
        history.currentId = id;
        localStorage.setItem(CACHE_HISTORY_KEY, JSON.stringify(history));

        logger.debug('🔄 Données chargées depuis l\'historique:', entry.fileName);
        return entry.data;
    }

    /**
     * Supprime une entrée de l'historique
     */
    removeFromHistory(id: string): void {
        try {
            const history = this.getHistory();
            history.entries = history.entries.filter(e => e.id !== id);

            if (history.currentId === id) {
                history.currentId = history.entries[0]?.id;
                // Si c'était l'entrée courante, la supprimer aussi
                if (history.currentId) {
                    const newCurrent = history.entries[0];
                    localStorage.setItem(CACHE_KEY, JSON.stringify(newCurrent));
                } else {
                    this.clearCurrentData();
                }
            }

            localStorage.setItem(CACHE_HISTORY_KEY, JSON.stringify(history));
            logger.debug('🗑️ Entrée supprimée de l\'historique:', id);
        } catch (error) {
            logger.error('❌ Erreur suppression historique:', error);
        }
    }

    /**
     * Vide tout l'historique
     */
    clearHistory(): void {
        localStorage.removeItem(CACHE_HISTORY_KEY);
        logger.debug('🗑️ Historique effacé');
    }

    // ===== UTILITAIRES =====

    /**
     * Récupère les informations sur l'utilisation du cache
     */
    getCacheInfo(): {
        hasCurrentData: boolean;
        historyCount: number;
        storageUsed: string;
        lastUpdated?: string;
    } {
        const hasCurrentData = this.hasCurrentData();
        const history = this.getHistory();

        // Calcul approximatif de l'espace utilisé
        const currentSize = localStorage.getItem(CACHE_KEY)?.length || 0;
        const historySize = localStorage.getItem(CACHE_HISTORY_KEY)?.length || 0;
        const totalBytes = currentSize + historySize;
        const totalKB = (totalBytes / 1024).toFixed(1);

        return {
            hasCurrentData,
            historyCount: history.entries.length,
            storageUsed: `${totalKB} KB`,
            lastUpdated: history.currentId
                ? history.entries.find(e => e.id === history.currentId)?.timestamp
                : undefined
        };
    }

    /**
     * Nettoie le cache si nécessaire (limite de taille)
     */
    cleanupIfNeeded(): void {
        try {
            const info = this.getCacheInfo();
            const totalSize = parseInt(info.storageUsed);

            // Si plus de 5MB, nettoyer l'historique
            if (totalSize > 5000) {
                const history = this.getHistory();
                history.entries = history.entries.slice(0, 5); // Garder seulement 5 entrées
                localStorage.setItem(CACHE_HISTORY_KEY, JSON.stringify(history));
                logger.debug('🧹 Cache nettoyé automatiquement');
            }
        } catch (error) {
            logger.error('❌ Erreur nettoyage cache:', error);
        }
    }

    /**
     * Export des données pour sauvegarde externe
     */
    exportData(): string {
        const current = localStorage.getItem(CACHE_KEY);
        const history = localStorage.getItem(CACHE_HISTORY_KEY);

        return JSON.stringify({
            current: current ? JSON.parse(current) : null,
            history: history ? JSON.parse(history) : { entries: [] },
            exportDate: new Date().toISOString(),
            version: '1.0'
        });
    }

    /**
     * Import de données depuis sauvegarde externe
     */
    importData(exportedData: string): boolean {
        try {
            const data = JSON.parse(exportedData);

            if (data.current) {
                localStorage.setItem(CACHE_KEY, JSON.stringify(data.current));
            }

            if (data.history) {
                localStorage.setItem(CACHE_HISTORY_KEY, JSON.stringify(data.history));
            }

            logger.debug('📥 Données importées avec succès');
            return true;
        } catch (error) {
            logger.error('❌ Erreur import données:', error);
            return false;
        }
    }
}

// Instance globale
export const finSightCache = FinSightCache.getInstance();

// ===== HOOKS REACT =====

/**
 * Hook React pour utiliser le cache dans les composants
 */
export function useFinSightCache() {
    const cache = FinSightCache.getInstance();

    const saveData = (data: FinSightDataModel) => {
        cache.saveCurrentData(data);
    };

    const loadData = (): FinSightDataModel | null => {
        return cache.getCurrentData();
    };

    const hasData = (): boolean => {
        return cache.hasCurrentData();
    };

    const clearData = () => {
        cache.clearCurrentData();
    };

    const getInfo = () => {
        return cache.getCacheInfo();
    };

    return {
        saveData,
        loadData,
        hasData,
        clearData,
        getInfo,
        getHistory: () => cache.getHistory(),
        loadFromHistory: (id: string) => cache.loadFromHistory(id),
        removeFromHistory: (id: string) => cache.removeFromHistory(id)
    };
}

// ===== AUTO-CLEANUP =====

// Nettoyer automatiquement au chargement
if (typeof window !== 'undefined') {
    finSightCache.cleanupIfNeeded();
}