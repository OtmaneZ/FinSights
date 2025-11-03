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
                    domain={[0, 100]}
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
                <Line
                    type="monotone"
                    dataKey="marginPercentage"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Marge Nette (%)"
                    dot={{ r: 5, fill: '#3b82f6' }}
                    activeDot={{ r: 7 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};
