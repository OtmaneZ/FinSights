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

interface TopClientsChartProps {
    data: Array<{
        name: string;
        value: string; // Format: "21 000 €"
        total: number;  // Valeur numérique pour le chart
    }>;
}

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export const TopClientsChart: React.FC<TopClientsChartProps> = ({ data }) => {
    // Transformer les données pour le chart
    const chartData = data.map(client => ({
        name: client.name.length > 20 ? client.name.substring(0, 20) + '...' : client.name,
        fullName: client.name,
        value: client.total || parseFloat(client.value.replace(/[^\d,-]/g, '').replace(',', '.'))
    }));

    const formatCurrency = (value: number) => {
        return `${Math.round(value / 1000)}k€`;
    };

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
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
                    dataKey="name"
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                    width={95}
                />
                <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                        `${value.toLocaleString('fr-FR')} €`,
                        props.payload.fullName
                    ]}
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};
