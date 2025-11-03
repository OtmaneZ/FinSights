'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TopClientsVerticalChartProps {
    data: Array<{
        name: string;
        value: number;
    }>;
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export function TopClientsVerticalChart({ data }: TopClientsVerticalChartProps) {
    // Formatter pour afficher les montants en euros
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <ResponsiveContainer width="100%" height={320}>
            <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 20, bottom: 80 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    stroke="#6b7280"
                    interval={0}
                />
                <YAxis
                    tickFormatter={formatCurrency}
                    stroke="#6b7280"
                />
                <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.96)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
