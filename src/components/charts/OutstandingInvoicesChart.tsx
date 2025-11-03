'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface OutstandingInvoicesChartProps {
    data: Array<{
        name: string;
        value: number;
        daysLate?: number;
        isLate?: boolean;
        dueDate?: string;
    }>;
}

// Couleurs selon urgence
const getBarColor = (invoice: any): string => {
    // Vérifier si daysLate existe (peut être 0, positif ou négatif)
    if (invoice.daysLate === undefined || invoice.daysLate === null) {
        return '#6b7280'; // Gris = pas de date d'échéance
    }

    if (invoice.daysLate > 30) return '#ef4444'; // Rouge = retard > 30j
    if (invoice.daysLate > 7) return '#f59e0b'; // Orange = retard 8-30j
    if (invoice.daysLate > 0) return '#fb923c'; // Orange clair = retard 1-7j
    return '#10b981'; // Vert = pas encore échu (daysLate <= 0)
};

export function OutstandingInvoicesChart({ data }: OutstandingInvoicesChartProps) {
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
                    formatter={(value: number, name: string, props: any) => {
                        const invoice = props.payload;
                        return [
                            formatCurrency(value),
                            invoice.daysLate > 0
                                ? `Retard: ${invoice.daysLate}j (échéance: ${invoice.dueDate})`
                                : `Échéance: ${invoice.dueDate}`
                        ];
                    }}
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.96)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
