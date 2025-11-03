import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';

interface ExpenseBreakdownChartProps {
    data: Array<{
        name: string;
        value: number;
        percentage: string;
    }>;
}

const COLORS = [
    '#f59e0b', // Orange (principal)
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#14b8a6', // Teal
    '#f97316', // Orange foncé
    '#64748b'  // Slate (autres)
];

export const ExpenseBreakdownChart: React.FC<ExpenseBreakdownChartProps> = ({ data }) => {
    // ✅ Custom label avec position ajustée pour Masse Salariale
    const renderLabel = (entry: any) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, outerRadius, name, percentage } = entry;

        // Position du label
        let radius = outerRadius + 25;
        let x = cx + radius * Math.cos(-midAngle * RADIAN);
        let y = cy + radius * Math.sin(-midAngle * RADIAN);

        // ✅ Ajustement spécial pour Masse Salariale (en haut)
        if (name === 'Masse Salariale') {
            // Décaler vers la gauche et un peu plus bas
            x = cx - 40;
            y = cy - outerRadius - 10;
        }

        return (
            <text
                x={x}
                y={y}
                fill="#1f2937"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                style={{ fontSize: '14px', fontWeight: '600' }}
            >
                {`${percentage}%`}
            </text>
        );
    };

    // Calculer le total des dépenses
    const totalExpenses = data.reduce((sum, item) => sum + item.value, 0);

    // ✅ Custom Legend Component (à droite)
    const CustomLegend = () => (
        <div className="flex flex-col justify-center gap-2 pr-4">
            {data.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-xs text-gray-700">{item.name}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex items-center" style={{ height: '280px' }}>
            {/* ✅ Donut à gauche (70% de l'espace) */}
            <div style={{ width: '70%', height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderLabel}
                            innerRadius={70}
                            outerRadius={110}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => `${value.toLocaleString('fr-FR')} €`}
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        {/* ✅ Total au centre du donut */}
                        <text
                            x="50%"
                            y="48%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                fill: '#1f2937'
                            }}
                        >
                            {totalExpenses.toLocaleString('fr-FR')} €
                        </text>
                        <text
                            x="50%"
                            y="58%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{
                                fontSize: '12px',
                                fill: '#6b7280'
                            }}
                        >
                            Total dépenses
                        </text>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* ✅ Légende à droite (30% de l'espace) */}
            <div style={{ width: '30%', height: '100%' }}>
                <CustomLegend />
            </div>
        </div>
    );
};
