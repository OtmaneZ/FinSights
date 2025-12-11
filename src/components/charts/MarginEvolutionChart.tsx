import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

interface MarginEvolutionChartProps {
    data: Array<{
        month: string;
        marginPercentage: number;
    }>;
}

export const MarginEvolutionChart: React.FC<MarginEvolutionChartProps> = ({ data }) => {
    const formatPercentage = (value: number) => {
        return `${value.toFixed(1)}%`;
    };

    // 🆕 Calculer le domaine dynamique pour supporter les marges négatives
    const allMargins = data.map(d => d.marginPercentage);
    const minMargin = Math.min(...allMargins);
    const maxMargin = Math.max(...allMargins);

    // Définir le domaine : si toutes les marges sont négatives, domaine négatif
    const yDomain: [number, number] = minMargin < 0 && maxMargin < 0
        ? [Math.floor(minMargin / 10) * 10 - 10, 0] // Ex: -150 à 0
        : minMargin < 0
            ? [Math.floor(minMargin / 10) * 10 - 10, Math.ceil(maxMargin / 10) * 10 + 10] // Ex: -150 à 50
            : [0, Math.min(100, Math.ceil(maxMargin / 10) * 10 + 10)]; // Ex: 0 à 100

    return (
        <ResponsiveContainer width="100%" height={280}>
            <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="month"
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                    tickFormatter={formatPercentage}
                    domain={yDomain}
                />
                <Tooltip
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                />
                <Legend
                    wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                />
                {/* ✅ Ligne objectif à 80% (seulement si dans le range) */}
                {yDomain[1] >= 80 && (
                    <ReferenceLine
                        y={80}
                        stroke="#10b981"
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        label={{
                            value: 'Objectif',
                            position: 'top',
                            fill: '#10b981',
                            fontSize: 13,
                            fontWeight: 600,
                            offset: 10
                        }}
                    />
                )}
                {/* 🆕 Ligne de référence 0% si marges négatives */}
                {minMargin < 0 && (
                    <ReferenceLine
                        y={0}
                        stroke="#94a3b8"
                        strokeDasharray="3 3"
                        strokeWidth={1.5}
                        label={{
                            value: 'Seuil rentabilité',
                            position: 'insideTopRight',
                            fill: '#64748b',
                            fontSize: 11,
                            offset: 5
                        }}
                    />
                )}
                <Line
                    type="monotone"
                    dataKey="marginPercentage"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Marge Nette (%)"
                    dot={{ r: 5, fill: '#3b82f6' }}
                    activeDot={{ r: 7 }}
                    animationDuration={1200}
                    animationBegin={0}
                    isAnimationActive={true}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};
