'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PaymentStatusChartProps {
    data: Array<{
        status: string;
        amount: number;
        count: number;
    }>;
}

const STATUS_COLORS: { [key: string]: string } = {
    'Payé': '#10b981',
    'En attente': '#f59e0b',
    'En cours': '#3b82f6'
};

export function PaymentStatusChart({ data }: PaymentStatusChartProps) {
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
                margin={{ top: 10, right: 30, left: 20, bottom: 60 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="status"
                    stroke="#6b7280"
                    interval={0}
                />
                <YAxis
                    tickFormatter={formatCurrency}
                    stroke="#6b7280"
                />
                <Tooltip
                    formatter={(value: number, name: string, props: any) => {
                        if (name === 'amount') {
                            return [formatCurrency(value), `Montant (${props.payload.count} transactions)`];
                        }
                        return value;
                    }}
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.96)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <Bar
                    dataKey="amount"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1000}
                    animationBegin={0}
                    isAnimationActive={true}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#6b7280'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
