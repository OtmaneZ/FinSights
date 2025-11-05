'use client'

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from 'd3-sankey';
import {
    createTooltip,
    showTooltip,
    hideTooltip,
    formatCurrency,
    setResponsiveViewBox,
    createLinearGradient,
    FINSIGHT_COLORS
} from '@/lib/d3-helpers';

export interface SankeyData {
    nodes: { name: string }[];
    links: { source: number; target: number; value: number }[];
}

interface SankeyFlowChartProps {
    data: SankeyData;
    width?: number;
    height?: number;
}

export function SankeyFlowChart({ data, width = 800, height = 400 }: SankeyFlowChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!svgRef.current || !containerRef.current || !data.nodes.length) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current);
        const margin = { top: 20, right: 150, bottom: 20, left: 150 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Set responsive viewBox
        setResponsiveViewBox(svg, width, height);

        // Create gradients
        createLinearGradient(svg, 'revenue-gradient', FINSIGHT_COLORS.success, '#059669', 0);
        createLinearGradient(svg, 'expense-gradient', FINSIGHT_COLORS.danger, '#dc2626', 0);
        createLinearGradient(svg, 'cashflow-gradient', FINSIGHT_COLORS.primary, FINSIGHT_COLORS.secondary, 0);

        // Create tooltip
        const tooltip = createTooltip(containerRef.current);

        // Main group
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create Sankey generator
        const sankeyGenerator = sankey<{ name: string }, { source: number; target: number; value: number }>()
            .nodeWidth(20)
            .nodePadding(20)
            .extent([[0, 0], [innerWidth, innerHeight]]);

        // Generate layout
        const { nodes, links } = sankeyGenerator({
            nodes: data.nodes.map(d => ({ ...d })),
            links: data.links.map(d => ({ ...d }))
        });

        // Color function based on node index
        const getNodeColor = (node: SankeyNode<{ name: string }, { source: number; target: number; value: number }>) => {
            const nodeIndex = nodes.indexOf(node);
            if (nodeIndex === 0) return 'url(#revenue-gradient)'; // Revenus
            if (node.name.includes('Cash')) return 'url(#cashflow-gradient)'; // Cash Flow
            return 'url(#expense-gradient)'; // Dépenses
        };

        const getLinkColor = (link: SankeyLink<{ name: string }, { source: number; target: number; value: number }>) => {
            const sourceNode = link.source as SankeyNode<{ name: string }, { source: number; target: number; value: number }>;
            const nodeIndex = nodes.indexOf(sourceNode);
            if (nodeIndex === 0) return FINSIGHT_COLORS.success; // From Revenus
            return FINSIGHT_COLORS.danger; // From Dépenses
        };

        // Draw links
        const link = g.append('g')
            .selectAll('.link')
            .data(links)
            .join('path')
            .attr('class', 'link')
            .attr('d', sankeyLinkHorizontal())
            .attr('stroke', d => getLinkColor(d))
            .attr('stroke-width', d => Math.max(1, d.width || 0))
            .attr('fill', 'none')
            .attr('opacity', 0.4)
            .on('mouseover', function (event, d) {
                d3.select(this).attr('opacity', 0.7);
                const sourceNode = d.source as SankeyNode<{ name: string }, { source: number; target: number; value: number }>;
                const targetNode = d.target as SankeyNode<{ name: string }, { source: number; target: number; value: number }>;
                showTooltip(
                    tooltip,
                    `<strong>${sourceNode.name}</strong> → <strong>${targetNode.name}</strong><br/>` +
                    `Montant: ${formatCurrency(d.value || 0)}`,
                    event
                );
            })
            .on('mousemove', (event) => {
                tooltip
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 10}px`);
            })
            .on('mouseout', function () {
                d3.select(this).attr('opacity', 0.4);
                hideTooltip(tooltip);
            });

        // Draw nodes
        const node = g.append('g')
            .selectAll('.node')
            .data(nodes)
            .join('g')
            .attr('class', 'node');

        node.append('rect')
            .attr('x', d => d.x0 || 0)
            .attr('y', d => d.y0 || 0)
            .attr('height', d => (d.y1 || 0) - (d.y0 || 0))
            .attr('width', d => (d.x1 || 0) - (d.x0 || 0))
            .attr('fill', d => getNodeColor(d))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .attr('rx', 4)
            .style('cursor', 'pointer')
            .on('mouseover', function (event, d) {
                d3.select(this).attr('opacity', 0.8);
                const incoming = (d.value || 0);
                const outgoing = d.sourceLinks?.reduce((sum, l) => sum + (l.value || 0), 0) || 0;
                showTooltip(
                    tooltip,
                    `<strong style="font-size: 14px">${d.name}</strong><br/>` +
                    `Total: ${formatCurrency(incoming)}<br/>` +
                    (outgoing > 0 ? `Sortant: ${formatCurrency(outgoing)}<br/>` : '') +
                    (incoming - outgoing > 0 ? `<span style="color: ${FINSIGHT_COLORS.success}">Net: ${formatCurrency(incoming - outgoing)}</span>` : ''),
                    event
                );
            })
            .on('mousemove', (event) => {
                tooltip
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 10}px`);
            })
            .on('mouseout', function () {
                d3.select(this).attr('opacity', 1);
                hideTooltip(tooltip);
            });

        // Add node labels
        node.append('text')
            .attr('x', d => ((d.x0 || 0) < innerWidth / 2) ? (d.x1 || 0) + 8 : (d.x0 || 0) - 8)
            .attr('y', d => ((d.y1 || 0) + (d.y0 || 0)) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => ((d.x0 || 0) < innerWidth / 2) ? 'start' : 'end')
            .attr('font-size', '13px')
            .attr('font-weight', '600')
            .attr('fill', '#e2e8f0')
            .text(d => d.name);

        // Add value labels on nodes
        node.append('text')
            .attr('x', d => ((d.x0 || 0) < innerWidth / 2) ? (d.x1 || 0) + 8 : (d.x0 || 0) - 8)
            .attr('y', d => ((d.y1 || 0) + (d.y0 || 0)) / 2 + 16)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => ((d.x0 || 0) < innerWidth / 2) ? 'start' : 'end')
            .attr('font-size', '11px')
            .attr('font-weight', '500')
            .attr('fill', '#94a3b8')
            .text(d => formatCurrency(d.value || 0));

        // Cleanup
        return () => {
            tooltip.remove();
        };
    }, [data, width, height]);

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
            <svg ref={svgRef} style={{ width: '100%', height: 'auto' }} />
        </div>
    );
}
