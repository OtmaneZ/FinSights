import React, { useMemo } from 'react';
import {
    DocumentTextIcon,
    CalendarIcon,
    UsersIcon,
    BanknotesIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface DataPreviewPanelProps {
    rawData: Array<{
        date: Date;
        amount: number;
        type?: 'income' | 'expense';
        counterparty?: string;
        category?: string;
        description?: string;
    }>;
    companyName?: string;
}

export const DataPreviewPanel: React.FC<DataPreviewPanelProps> = ({ rawData, companyName }) => {
    const stats = useMemo(() => {
        if (!rawData || rawData.length === 0) {
            return null;
        }

        const dates = rawData.map((d) => new Date(d.date)).sort((a, b) => a.getTime() - b.getTime());
        const startDate = dates[0];
        const endDate = dates[dates.length - 1];

        const uniqueClients = new Set(
            rawData.filter((d) => d.counterparty).map((d) => d.counterparty)
        );

        // ✅ FIX: Utiliser record.type au lieu de record.amount (qui est toujours positif)
        const totalRevenue = rawData
            .filter((d) => d.type === 'income')
            .reduce((sum, d) => sum + d.amount, 0);

        const totalExpenses = rawData
            .filter((d) => d.type === 'expense')
            .reduce((sum, d) => sum + d.amount, 0);

        const categories = new Set(rawData.filter((d) => d.category).map((d) => d.category));

        const daysDiff = Math.round(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const monthsDiff = Math.round(daysDiff / 30);

        return {
            transactionCount: rawData.length,
            startDate,
            endDate,
            periodDays: daysDiff,
            periodMonths: monthsDiff,
            uniqueClients: uniqueClients.size,
            totalRevenue,
            totalExpenses,
            netCashFlow: totalRevenue - totalExpenses,
            categoriesCount: categories.size,
        };
    }, [rawData]);

    const firstFiveRows = useMemo(() => {
        return rawData.slice(0, 5).map((row) => ({
            date: new Date(row.date).toLocaleDateString('fr-FR'),
            amount: row.amount,
            counterparty: row.counterparty || '-',
            category: row.category || '-',
            description: row.description || '-',
        }));
    }, [rawData]);

    if (!stats) {
        return null;
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-8 h-8 text-emerald-600" />
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Données importées {companyName && `- ${companyName}`}
                        </h2>
                        <p className="text-sm text-slate-600">Aperçu et statistiques</p>
                    </div>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                        <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700 uppercase">
                            Transactions
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                        {stats.transactionCount.toLocaleString('fr-FR')}
                    </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                        <CalendarIcon className="w-5 h-5 text-purple-600" />
                        <span className="text-xs font-semibold text-purple-700 uppercase">Période</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                        {stats.periodMonths} mois
                    </div>
                    <div className="text-xs text-purple-600 mt-1">
                        {stats.startDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                        {' → '}
                        {stats.endDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                    </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                        <UsersIcon className="w-5 h-5 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-700 uppercase">
                            Clients/Tiers
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-900">{stats.uniqueClients}</div>
                </div>

                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                        <BanknotesIcon className="w-5 h-5 text-orange-600" />
                        <span className="text-xs font-semibold text-orange-700 uppercase">
                            Cash Flow Net
                        </span>
                    </div>
                    <div
                        className={`text-xl font-bold ${stats.netCashFlow >= 0 ? 'text-emerald-900' : 'text-red-900'
                            }`}
                    >
                        {formatCurrency(stats.netCashFlow)}
                    </div>
                    <div className="text-xs text-orange-600 mt-1">
                        Charges: {formatCurrency(stats.totalExpenses)}
                    </div>
                </div>
            </div>

            {/* Table Preview */}
            <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Aperçu des données (5 premières lignes)
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-100 border-b-2 border-slate-300">
                                <th className="text-left p-3 font-semibold text-slate-700">Date</th>
                                <th className="text-right p-3 font-semibold text-slate-700">Montant</th>
                                <th className="text-left p-3 font-semibold text-slate-700">Tiers</th>
                                <th className="text-left p-3 font-semibold text-slate-700">Catégorie</th>
                                <th className="text-left p-3 font-semibold text-slate-700 hidden md:table-cell">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {firstFiveRows.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                                >
                                    <td className="p-3 text-slate-600">{row.date}</td>
                                    <td
                                        className={`p-3 text-right font-semibold ${row.amount >= 0 ? 'text-emerald-600' : 'text-red-600'
                                            }`}
                                    >
                                        {formatCurrency(row.amount)}
                                    </td>
                                    <td className="p-3 text-slate-600 max-w-[150px] truncate">
                                        {row.counterparty}
                                    </td>
                                    <td className="p-3 text-slate-600 max-w-[120px] truncate">{row.category}</td>
                                    <td className="p-3 text-slate-500 max-w-[200px] truncate hidden md:table-cell">
                                        {row.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {rawData.length > 5 && (
                    <div className="mt-3 text-center text-xs text-slate-500">
                        ... et {rawData.length - 5} autres transactions
                    </div>
                )}
            </div>
        </div>
    );
};
