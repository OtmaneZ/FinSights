'use client';

interface TopClientsVerticalChartProps {
    data: Array<{
        name: string;
        value: number;
    }>;
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

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

    // Find max value for bar scaling
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="w-full space-y-3">
            {data.slice(0, 8).map((client, index) => (
                <div key={client.name} className="flex items-center gap-3">
                    {/* Client name */}
                    <div className="w-32 text-sm text-gray-600 truncate" title={client.name}>
                        {client.name.length > 15 ? client.name.slice(0, 15) + '...' : client.name}
                    </div>
                    
                    {/* Progress bar */}
                    <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                        <div
                            className="h-full rounded-lg transition-all duration-500 ease-out"
                            style={{
                                width: `${(client.value / maxValue) * 100}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                            }}
                        />
                    </div>
                    
                    {/* Value */}
                    <div className="w-24 text-right text-sm font-medium text-gray-700">
                        {formatCurrency(client.value)}
                    </div>
                </div>
            ))}
        </div>
    );
}
