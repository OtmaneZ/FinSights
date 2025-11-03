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

interface PaymentTermsChartProps {
    data: {
        dso: number | null;  // Days Sales Outstanding (délai clients)
        dpo: number | null;  // Days Payable Outstanding (délai fournisseurs)
    };
}

export const PaymentTermsChart: React.FC<PaymentTermsChartProps> = ({ data }) => {
    // Si pas de données, afficher message
    if (!data.dso && !data.dpo) {
        return (
            <div className="h-[280px] flex flex-col items-center justify-center text-gray-400">
                <p className="text-sm">💡 Données insuffisantes pour calculer DSO/DPO</p>
                <p className="text-xs mt-2">Ajoutez des dates d'échéance dans votre CSV</p>
            </div>
        );
    }

    const chartData = [
        { name: 'DSO Clients', value: data.dso || 0, color: '#f59e0b' },
        { name: 'DPO Fournisseurs', value: data.dpo || 0, color: '#10b981' }
    ].filter(item => item.value > 0);

    const formatDays = (value: number) => {
        return `${Math.round(value)}j`;
    };

    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                    tickFormatter={formatDays}
                />
                <Tooltip
                    formatter={(value: number) => `${Math.round(value)} jours`}
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};
