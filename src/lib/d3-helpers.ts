/**
 * Utilitaires D3.js réutilisables pour les charts FinSight
 * Helpers pour scales, axes, transitions, gradients, tooltips
 */

import * as d3 from 'd3';

/**
 * Couleurs thématiques FinSight
 */
export const FINSIGHT_COLORS = {
    primary: '#6366f1', // Indigo
    secondary: '#8b5cf6', // Purple
    success: '#10b981', // Green
    warning: '#fbbf24', // Amber
    danger: '#ef4444', // Red
    info: '#3b82f6', // Blue
    dark: '#0f172a', // Slate-900
    light: '#e2e8f0', // Slate-200
};

/**
 * Palette de couleurs pour catégories multiples
 */
export const CATEGORY_COLORS = [
    '#6366f1', // Indigo
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#10b981', // Green
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#84cc16', // Lime
];

/**
 * Crée un gradient linéaire SVG
 */
export function createLinearGradient(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    id: string,
    color1: string,
    color2: string,
    angle: number = 0
): void {
    const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');

    const gradient = defs.append('linearGradient')
        .attr('id', id)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', angle === 90 ? '0%' : '100%')
        .attr('y2', angle === 90 ? '100%' : '0%');

    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color1);

    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color2);
}

/**
 * Formate un montant en euros
 */
export function formatCurrency(value: number): string {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M€`;
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}k€`;
    }
    return `${Math.round(value)}€`;
}

/**
 * Formate un pourcentage
 */
export function formatPercent(value: number): string {
    return `${value.toFixed(1)}%`;
}

/**
 * Crée un tooltip D3.js stylisé
 */
export function createTooltip(container: HTMLElement): d3.Selection<HTMLDivElement, unknown, null, undefined> {
    return d3.select(container)
        .append('div')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background', 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)')
        .style('color', '#fff')
        .style('padding', '12px 16px')
        .style('border-radius', '8px')
        .style('font-size', '13px')
        .style('font-weight', '600')
        .style('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.3)')
        .style('border', '1px solid rgba(99, 102, 241, 0.3)')
        .style('pointer-events', 'none')
        .style('z-index', '1000')
        .style('max-width', '250px')
        .style('line-height', '1.5');
}

/**
 * Affiche le tooltip à une position donnée
 */
export function showTooltip(
    tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>,
    html: string,
    event: MouseEvent
): void {
    tooltip
        .style('visibility', 'visible')
        .html(html)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 10}px`);
}

/**
 * Cache le tooltip
 */
export function hideTooltip(tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>): void {
    tooltip.style('visibility', 'hidden');
}

/**
 * Transition standard pour les animations
 */
export function standardTransition(): d3.Transition<d3.BaseType, unknown, null, undefined> {
    return d3.transition()
        .duration(750)
        .ease(d3.easeCubicOut);
}

/**
 * Génère une couleur à partir d'un index
 */
export function getColorByIndex(index: number): string {
    return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}

/**
 * Génère une échelle de couleurs pour un domaine
 */
export function createColorScale(domain: string[]): d3.ScaleOrdinal<string, string, never> {
    return d3.scaleOrdinal<string>()
        .domain(domain)
        .range(CATEGORY_COLORS);
}

/**
 * Wraps long text in SVG
 */
export function wrapText(
    text: d3.Selection<SVGTextElement, unknown, null, undefined>,
    width: number
): void {
    text.each(function () {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word;
        let line: string[] = [];
        let lineNumber = 0;
        const lineHeight = 1.1; // ems
        const y = text.attr('y');
        const dy = parseFloat(text.attr('dy') || '0');
        let tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', `${dy}em`);

        while ((word = words.pop())) {
            line.push(word);
            tspan.text(line.join(' '));
            if (tspan.node()!.getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(' '));
                line = [word];
                tspan = text.append('tspan')
                    .attr('x', 0)
                    .attr('y', y)
                    .attr('dy', `${++lineNumber * lineHeight + dy}em`)
                    .text(word);
            }
        }
    });
}

/**
 * Responsive SVG viewBox setter
 */
export function setResponsiveViewBox(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    width: number,
    height: number
): void {
    svg
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .style('width', '100%')
        .style('height', 'auto');
}

/**
 * Ajoute une ombre portée SVG
 */
export function addDropShadow(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    id: string = 'drop-shadow'
): void {
    const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');

    const filter = defs.append('filter')
        .attr('id', id)
        .attr('height', '130%');

    filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', 3);

    filter.append('feOffset')
        .attr('dx', 0)
        .attr('dy', 2)
        .attr('result', 'offsetblur');

    filter.append('feComponentTransfer')
        .append('feFuncA')
        .attr('type', 'linear')
        .attr('slope', 0.3);

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
}
