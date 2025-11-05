'use client'

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
    createTooltip,
    showTooltip,
    hideTooltip,
    formatCurrency,
    formatPercent,
    setResponsiveViewBox,
    getColorByIndex,
    standardTransition,
    FINSIGHT_COLORS
} from '@/lib/d3-helpers';

export interface SunburstNode {
    name: string;
    value?: number;
    children?: SunburstNode[];
}

interface SunburstExpensesChartProps {
    data: SunburstNode;
    width?: number;
    height?: number;
}

export function SunburstExpensesChart({ data, width = 600, height = 600 }: SunburstExpensesChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!svgRef.current || !containerRef.current || !data) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current);
        const radius = Math.min(width, height) / 2;

        // Set responsive viewBox
        setResponsiveViewBox(svg, width, height);

        // Create tooltip
        const tooltip = createTooltip(containerRef.current);

        // Main group centered
        const g = svg.append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        // Create hierarchy
        const root = d3.hierarchy(data)
            .sum(d => d.value || 0)
            .sort((a, b) => (b.value || 0) - (a.value || 0));

        // Create partition layout
        const partition = d3.partition<SunburstNode>()
            .size([2 * Math.PI, radius]);

        partition(root);

        // Arc generator
        const arc = d3.arc<d3.HierarchyRectangularNode<SunburstNode>>()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .innerRadius(d => d.y0)
            .outerRadius(d => d.y1)
            .padAngle(0.005)
            .padRadius(radius / 2)
            .cornerRadius(3);

        // Color scale
        const color = d3.scaleOrdinal<string>()
            .domain(root.children?.map(d => d.data.name) || [])
            .range([
                '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
                '#10b981', '#3b82f6', '#06b6d4', '#f97316'
            ]);

        // Calculate total for percentages
        const total = root.value || 1;

        // Draw arcs
        const path = g.append('g')
            .selectAll('path')
            .data(root.descendants().filter(d => d.depth > 0))
            .join('path')
            .attr('fill', d => {
                // Use parent color for children
                let node = d;
                while (node.depth > 1) node = node.parent!;
                return d3.color(color(node.data.name))!.darker(d.depth * 0.3).toString();
            })
            .attr('fill-opacity', 0.9)
            .attr('d', d => arc(d as any))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .attr('fill-opacity', 1)
                    .attr('stroke-width', 3);

                const percentage = ((d.value || 0) / total) * 100;
                const ancestors = d.ancestors().map(a => a.data.name).reverse().slice(1);

                showTooltip(
                    tooltip,
                    `<strong style="font-size: 14px">${ancestors.join(' › ')}</strong><br/>` +
                    `Montant: ${formatCurrency(d.value || 0)}<br/>` +
                    `Part: ${formatPercent(percentage)}`,
                    event
                );
            })
            .on('mousemove', (event) => {
                tooltip
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 10}px`);
            })
            .on('mouseout', function () {
                d3.select(this)
                    .attr('fill-opacity', 0.9)
                    .attr('stroke-width', 2);
                hideTooltip(tooltip);
            })
            .on('click', (event, d) => {
                // Focus on clicked segment
                event.stopPropagation();
                focus(d as any);
            });

        // Add center label
        const centerText = g.append('g')
            .attr('pointer-events', 'none')
            .attr('text-anchor', 'middle');

        centerText.append('text')
            .attr('y', -10)
            .attr('font-size', '16px')
            .attr('font-weight', '700')
            .attr('fill', '#e2e8f0')
            .text('Total Dépenses');

        centerText.append('text')
            .attr('y', 15)
            .attr('font-size', '24px')
            .attr('font-weight', '700')
            .attr('fill', FINSIGHT_COLORS.primary)
            .text(formatCurrency(total));

        // Focus function for drill-down
        function focus(p: any) {
            root.each((d: any) => {
                const target = {
                    x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                    x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                    y0: Math.max(0, d.y0 - p.depth),
                    y1: Math.max(0, d.y1 - p.depth)
                };
                d.target = target;
            });

            const t = standardTransition();

            path.transition(t as any)
                .tween('data', function (d: any) {
                    const i = d3.interpolate(d.current, d.target);
                    return function (t) {
                        d.current = i(t);
                    };
                })
                .attrTween('d', function (d: any) {
                    return () => arc(d as any) || '';
                });

            // Update center text
            centerText.selectAll('text')
                .transition(t as any)
                .on('end', function () {
                    if (p.depth === 0) {
                        d3.select(this)
                            .filter(':first-child')
                            .text('Total Dépenses');
                        d3.select(this)
                            .filter(':last-child')
                            .text(formatCurrency(total));
                    } else {
                        d3.select(this)
                            .filter(':first-child')
                            .text(p.data.name);
                        d3.select(this)
                            .filter(':last-child')
                            .text(formatCurrency(p.value || 0));
                    }
                });
        }

        // Initialize current positions
        root.each((d: any) => d.current = { x0: d.x0, x1: d.x1, y0: d.y0, y1: d.y1 });

        // Click on center to reset
        svg.on('click', () => focus(root as any));

        // Cleanup
        return () => {
            tooltip.remove();
        };
    }, [data, width, height]);

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
            <svg ref={svgRef} style={{ width: '100%', height: 'auto' }} />
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '11px',
                color: '#94a3b8',
                textAlign: 'center'
            }}>
                💡 Cliquez sur un segment pour zoomer
            </div>
        </div>
    );
}
