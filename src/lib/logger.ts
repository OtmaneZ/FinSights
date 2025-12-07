/**
 * Centralized Logger Utility
 *
 * Features:
 * - Environment-aware logging (dev vs prod)
 * - Colored console output
 * - Log levels (debug, info, warn, error)
 * - Performance timing
 * - Conditional logging based on env
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = process.env.NODE_ENV === 'development';

class Logger {
    private context: string;

    constructor(context: string = 'App') {
        this.context = context;
    }

    /**
     * Debug logs (only in development)
     */
    debug(message: string, ...args: any[]) {
        if (!isDev) return;
        logger.debug(`🔍 [${this.context}]`, message, ...args);
    }

    /**
     * Info logs
     */
    info(message: string, ...args: any[]) {
        if (!isDev) return;
        logger.debug(`ℹ️ [${this.context}]`, message, ...args);
    }

    /**
     * Warning logs
     */
    warn(message: string, ...args: any[]) {
        logger.warn(`⚠️ [${this.context}]`, message, ...args);
    }

    /**
     * Error logs (always logged)
     */
    error(message: string, error?: any, ...args: any[]) {
        logger.error(`❌ [${this.context}]`, message, error, ...args);
    }

    /**
     * Performance timing
     */
    time(label: string) {
        if (!isDev) return;
        console.time(`⏱️ [${this.context}] ${label}`);
    }

    timeEnd(label: string) {
        if (!isDev) return;
        console.timeEnd(`⏱️ [${this.context}] ${label}`);
    }

    /**
     * Group logs
     */
    group(label: string) {
        if (!isDev) return;
        console.group(`📦 [${this.context}] ${label}`);
    }

    groupEnd() {
        if (!isDev) return;
        console.groupEnd();
    }

    /**
     * Table display (useful for arrays/objects)
     */
    table(data: any) {
        if (!isDev) return;
        console.table(data);
    }
}

/**
 * Create logger instance
 */
export function createLogger(context: string): Logger {
    return new Logger(context);
}

/**
 * Default logger
 */
export const logger = new Logger('FinSight');

/**
 * API logger
 */
export const apiLogger = new Logger('API');

/**
 * Performance logger
 */
export const perfLogger = new Logger('Performance');
