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
    const renderLabel = (entry: any) => {
        return `${entry.percentage}%`;
    };

    return (
        <ResponsiveContainer width="100%" height={280}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={90}
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
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};
