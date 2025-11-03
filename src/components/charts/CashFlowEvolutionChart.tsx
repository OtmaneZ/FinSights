import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface CashFlowEvolutionChartProps {
    data: Array<{
        month: string;
        revenue: number;
        expenses: number;
        cashFlow: number;
    }>;
}

export const CashFlowEvolutionChart: React.FC<CashFlowEvolutionChartProps> = ({ data }) => {
    const formatCurrency = (value: number) => {
        return `${Math.round(value / 1000)}k€`;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
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
                    tickFormatter={formatCurrency}
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
                <Legend
                    wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                />
                <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Revenus"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Charges"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="cashFlow"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    name="Cash Flow Net"
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};
