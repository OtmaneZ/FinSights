import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface TopExpenseCategoriesChartProps {
    data: Array<{
        category: string;
        amount: number;
        percentage: number;
    }>;
}

const COLORS = ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'];

export const TopExpenseCategoriesChart: React.FC<TopExpenseCategoriesChartProps> = ({ data }) => {
    // Prendre le top 5
    const top5 = data.slice(0, 5);

    const formatCurrency = (value: number) => {
        return `${Math.round(value / 1000)}k€`;
    };

    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart
                data={top5}
                layout="horizontal"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    type="number"
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                    tickFormatter={formatCurrency}
                />
                <YAxis
                    type="category"
                    dataKey="category"
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                    width={100}
                />
                <Tooltip
                    formatter={(value: number) => `${value.toLocaleString('fr-FR')} €`}
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                />
                <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                    {top5.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};
