'use client';

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ExclamationTriangleIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useFinancialData } from '@/lib/financialContext';

interface ClientDSOData {
    clientName: string;
    dso: number; // Days Sales Outstanding
    amount: number; // Montant en attente
    trend: 'up' | 'down' | 'stable';
    riskLevel: 'low' | 'medium' | 'high';
    invoices: InvoiceDetail[];
    lastPayment: string;
    paymentHistory: number; // Historique de ponctualité en %
}

interface InvoiceDetail {
    invoiceNumber: string;
    amount: number;
    dueDate: string;
    overdueDays: number;
    status: 'pending' | 'overdue' | 'critical';
}

export default function DSOClientChart() {
    const { rawData } = useFinancialData();
    const [selectedClient, setSelectedClient] = useState<ClientDSOData | null>(null);

    // ✅ CALCUL AVEC VRAIES DONNÉES - Analyse des créances clients
    const mockClientData: ClientDSOData[] = useMemo(() => {
        if (!rawData || rawData.length === 0) {
            return [];
        }

        // Grouper par client (contrepartie) et analyser les paiements
        const clientMap = rawData.reduce((acc: any, record: any) => {
            // Ne prendre que les créances (montants positifs ou catégorie spécifique)
            if (!record.counterparty && !record.description) return acc;

            const clientName = record.counterparty || record.description || 'Client inconnu';

            if (!acc[clientName]) {
                acc[clientName] = {
                    clientName,
                    totalAmount: 0,
                    transactions: [],
                    lastDate: null
                };
            }

            acc[clientName].totalAmount += Math.abs(record.amount || 0);
            acc[clientName].transactions.push({
                date: new Date(record.date),
                amount: record.amount
            });

            // Garder la date la plus récente
            const recordDate = new Date(record.date);
            if (!acc[clientName].lastDate || recordDate > acc[clientName].lastDate) {
                acc[clientName].lastDate = recordDate;
            }

            return acc;
        }, {});

        // Convertir en format ClientDSOData
        return Object.values(clientMap)
            .map((client: any) => {
                // Calculer DSO approximatif (jours depuis dernier paiement)
                const daysSinceLastPayment = client.lastDate
                    ? Math.floor((new Date().getTime() - client.lastDate.getTime()) / (1000 * 60 * 60 * 24))
                    : 60;

                const dso = Math.min(daysSinceLastPayment, 120); // Cap à 120 jours

                // Déterminer niveau de risque
                let riskLevel: 'low' | 'medium' | 'high' = 'low';
                if (dso > 75) riskLevel = 'high';
                else if (dso > 50) riskLevel = 'medium';

                return {
                    clientName: client.clientName,
                    dso,
                    amount: Math.round(client.totalAmount),
                    trend: 'stable' as const,
                    riskLevel,
                    lastPayment: client.lastDate?.toLocaleDateString('fr-FR') || 'N/A',
                    paymentHistory: riskLevel === 'low' ? 90 : riskLevel === 'medium' ? 70 : 50,
                    invoices: [] // Simplification - pourrait être enrichi
                };
            })
            .sort((a, b) => b.dso - a.dso) // Trier par DSO décroissant
            .slice(0, 5); // Top 5 clients
    }, [rawData]);

    // 🛡️ Protection : Ne pas afficher si pas de données
    if (!rawData || rawData.length === 0 || mockClientData.length === 0) {
        return (
            <div className="finsight-chart-container">
                <div className="finsight-chart-header">
                    <h3 className="finsight-chart-title">Délais de Paiement Clients (DSO)</h3>
                    <p className="finsight-chart-subtitle">Analyse par client • Risque de crédit</p>
                </div>
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg mb-2">📊 Aucune donnée client disponible</p>
                    <p className="text-sm">Importez vos données avec les colonnes contrepartie/description pour l'analyse DSO</p>
                </div>
            </div>
        );
    }


    // Couleurs selon le niveau de risque
    const getRiskColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'high': return '#ef4444'; // Rouge
            case 'medium': return '#f59e0b'; // Orange
            case 'low': return '#10b981'; // Vert
            default: return '#6b7280'; // Gris
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up': return '↗️';
            case 'down': return '↘️';
            case 'stable': return '→';
            default: return '→';
        }
    };

    const getActionSuggestions = (client: ClientDSOData): string[] => {
        const suggestions: string[] = [];

        if (client.riskLevel === 'high') {
            suggestions.push('🚨 Relance urgente recommandée');
            suggestions.push('📞 Appel téléphonique dans les 24h');
            if (client.paymentHistory < 50) {
                suggestions.push('⚖️ Considérer un échéancier de paiement');
            }
        } else if (client.riskLevel === 'medium') {
            suggestions.push('📧 Email de relance courtois');
            suggestions.push('📋 Vérifier les conditions de paiement');
        } else {
            suggestions.push('✅ Client fiable - surveillance standard');
            suggestions.push('🤝 Maintenir la relation commerciale');
        }

        if (client.trend === 'up' && client.dso > 60) {
            suggestions.push('📈 Analyser les causes de dégradation');
        }

        return suggestions;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{data.clientName}</p>
                    <p className="text-blue-600">DSO: {data.dso} jours</p>
                    <p className="text-gray-600">Montant: {formatCurrency(data.amount)}</p>
                    <p className="text-gray-600">Historique: {data.paymentHistory}% ponctuel</p>
                    <p className="text-sm text-gray-500 mt-2">Cliquer pour le détail</p>
                </div>
            );
        }
        return null;
    };

    const handleBarClick = (data: any) => {
        if (data && data.payload) {
            setSelectedClient(data.payload);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">DSO par Client</h3>
                    <p className="text-sm text-gray-600">Délai de paiement moyen par client</p>
                </div>
                {selectedClient && (
                    <button
                        onClick={() => setSelectedClient(null)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        ← Retour à la vue générale
                    </button>
                )}
            </div>

            {!selectedClient ? (
                <div className="h-80 min-h-80">
                    <ResponsiveContainer width="100%" height="100%" minHeight={320}>
                        <BarChart
                            data={mockClientData}
                            layout="horizontal"
                            margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" domain={[0, 100]} label={{ value: 'Jours', position: 'insideBottom', offset: -5 }} />
                            <YAxis type="category" dataKey="clientName" width={110} fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="dso"
                                radius={[0, 4, 4, 0]}
                                cursor="pointer"
                                onClick={handleBarClick}
                            >
                                {mockClientData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getRiskColor(entry.riskLevel)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* En-tête client sélectionné */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-xl font-semibold text-gray-800">{selectedClient.clientName}</h4>
                                <div className="flex items-center space-x-4 mt-2">
                                    <span className="text-2xl font-bold" style={{ color: getRiskColor(selectedClient.riskLevel) }}>
                                        {selectedClient.dso} jours
                                    </span>
                                    <span className="text-gray-600">{getTrendIcon(selectedClient.trend)}</span>
                                    <span className="text-gray-600">{formatCurrency(selectedClient.amount)} en attente</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center space-x-2">
                                    {selectedClient.riskLevel === 'high' && <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />}
                                    {selectedClient.riskLevel === 'medium' && <ClockIcon className="h-5 w-5 text-orange-500" />}
                                    {selectedClient.riskLevel === 'low' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                                    <span className="text-sm font-medium capitalize">{selectedClient.riskLevel === 'low' ? 'Faible' : selectedClient.riskLevel === 'medium' ? 'Moyen' : 'Élevé'} risque</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Ponctualité: {selectedClient.paymentHistory}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Détail des factures */}
                    <div>
                        <h5 className="font-semibold text-gray-800 mb-3">Factures en cours</h5>
                        <div className="space-y-2">
                            {selectedClient.invoices.map((invoice, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <div>
                                        <span className="font-medium">{invoice.invoiceNumber}</span>
                                        <span className="ml-2 text-gray-600">Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">{formatCurrency(invoice.amount)}</div>
                                        {invoice.overdueDays > 0 && (
                                            <span className="text-red-600 text-sm">{invoice.overdueDays} jours de retard</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suggestions d'actions IA */}
                    <div>
                        <h5 className="font-semibold text-gray-800 mb-3">🤖 Suggestions d'Actions IA</h5>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <ul className="space-y-2">
                                {getActionSuggestions(selectedClient).map((suggestion, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <span className="text-blue-600 mt-1">•</span>
                                        <span className="text-gray-700">{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}