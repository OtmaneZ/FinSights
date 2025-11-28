/**
 * Accessibility (A11Y) Utilities
 *
 * Helpers for WCAG compliance:
 * - Color contrast validation (AA/AAA)
 * - Aria-label helpers
 * - Keyboard navigation
 * - Screen reader utilities
 */

// ============================================
// COLOR CONTRAST (WCAG 2.1)
// ============================================

/**
 * Calculate relative luminance of a color
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return 1;

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standard
 * - Normal text: 4.5:1
 * - Large text (18pt+): 3:1
 */
export function meetsWCAG_AA(
    foreground: string,
    background: string,
    isLargeText: boolean = false
): boolean {
    const ratio = getContrastRatio(foreground, background);
    const minRatio = isLargeText ? 3 : 4.5;
    return ratio >= minRatio;
}

/**
 * Check if contrast ratio meets WCAG AAA standard
 * - Normal text: 7:1
 * - Large text (18pt+): 4.5:1
 */
export function meetsWCAG_AAA(
    foreground: string,
    background: string,
    isLargeText: boolean = false
): boolean {
    const ratio = getContrastRatio(foreground, background);
    const minRatio = isLargeText ? 4.5 : 7;
    return ratio >= minRatio;
}

// ============================================
// ARIA HELPERS
// ============================================

/**
 * Generate aria-label for interactive elements
 */
export function ariaLabel(label: string, description?: string): {
    'aria-label': string;
    'aria-describedby'?: string;
} {
    return {
        'aria-label': label,
        ...(description && { 'aria-describedby': description }),
    };
}

/**
 * Generate aria attributes for loading state
 */
export function ariaLoading(isLoading: boolean) {
    return {
        'aria-busy': isLoading,
        'aria-live': 'polite' as const,
    };
}

/**
 * Generate aria attributes for errors
 */
export function ariaError(hasError: boolean, errorId?: string) {
    return {
        'aria-invalid': hasError,
        ...(hasError && errorId && { 'aria-describedby': errorId }),
    };
}

/**
 * Generate aria attributes for modals
 */
export function ariaModal() {
    return {
        role: 'dialog',
        'aria-modal': true,
    };
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

/**
 * Handle keyboard navigation (Tab, Enter, Escape)
 */
export function onKeyDown(
    e: React.KeyboardEvent,
    handlers: {
        onEnter?: () => void;
        onEscape?: () => void;
        onTab?: () => void;
        onSpace?: () => void;
    }
) {
    switch (e.key) {
        case 'Enter':
            e.preventDefault();
            handlers.onEnter?.();
            break;
        case 'Escape':
            e.preventDefault();
            handlers.onEscape?.();
            break;
        case 'Tab':
            handlers.onTab?.();
            break;
        case ' ':
            e.preventDefault();
            handlers.onSpace?.();
            break;
    }
}

/**
 * Focus first element in container
 */
export function focusFirst(container: HTMLElement | null) {
    if (!container) return;

    const focusable = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusable.length > 0) {
        focusable[0].focus();
    }
}

/**
 * Trap focus within element (for modals)
 */
export function trapFocus(container: HTMLElement | null) {
    if (!container) return () => { };

    const focusable = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Focus first element
    firstFocusable?.focus();

    return () => {
        container.removeEventListener('keydown', handleKeyDown);
    };
}

// ============================================
// SCREEN READER UTILITIES
// ============================================

/**
 * Visually hidden but accessible to screen readers
 */
export const srOnly: React.CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
};

/**
 * Announce to screen readers
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = Object.entries(srOnly)
        .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${value}`)
        .join(';');
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate color palette for WCAG compliance
 */
export function validateColorPalette(colors: {
    primary: string;
    background: string;
    text: string;
}): {
    valid: boolean;
    issues: string[];
} {
    const issues: string[] = [];

    // Check text on background
    if (!meetsWCAG_AA(colors.text, colors.background)) {
        const ratio = getContrastRatio(colors.text, colors.background).toFixed(2);
        issues.push(`Text/Background contrast too low: ${ratio}:1 (min 4.5:1)`);
    }

    // Check primary on background
    if (!meetsWCAG_AA(colors.primary, colors.background)) {
        const ratio = getContrastRatio(colors.primary, colors.background).toFixed(2);
        issues.push(`Primary/Background contrast too low: ${ratio}:1 (min 4.5:1)`);
    }

    return {
        valid: issues.length === 0,
        issues,
    };
}
