'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ExclamationTriangleIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

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

// Données de démonstration
const mockClientData: ClientDSOData[] = [
    {
        clientName: 'TechCorp Solutions',
        dso: 45,
        amount: 125000,
        trend: 'stable',
        riskLevel: 'low',
        lastPayment: '2024-10-15',
        paymentHistory: 95,
        invoices: [
            { invoiceNumber: 'INV-2024-001', amount: 45000, dueDate: '2024-11-15', overdueDays: 0, status: 'pending' },
            { invoiceNumber: 'INV-2024-002', amount: 80000, dueDate: '2024-11-30', overdueDays: 0, status: 'pending' }
        ]
    },
    {
        clientName: 'Global Industries',
        dso: 67,
        amount: 89000,
        trend: 'up',
        riskLevel: 'medium',
        lastPayment: '2024-09-20',
        paymentHistory: 78,
        invoices: [
            { invoiceNumber: 'INV-2024-003', amount: 35000, dueDate: '2024-10-20', overdueDays: 8, status: 'overdue' },
            { invoiceNumber: 'INV-2024-004', amount: 54000, dueDate: '2024-11-05', overdueDays: 0, status: 'pending' }
        ]
    },
    {
        clientName: 'Startup Innovation',
        dso: 89,
        amount: 156000,
        trend: 'up',
        riskLevel: 'high',
        lastPayment: '2024-08-15',
        paymentHistory: 45,
        invoices: [
            { invoiceNumber: 'INV-2024-005', amount: 67000, dueDate: '2024-09-30', overdueDays: 28, status: 'critical' },
            { invoiceNumber: 'INV-2024-006', amount: 89000, dueDate: '2024-10-15', overdueDays: 13, status: 'overdue' }
        ]
    },
    {
        clientName: 'Retail Masters',
        dso: 38,
        amount: 72000,
        trend: 'down',
        riskLevel: 'low',
        lastPayment: '2024-10-22',
        paymentHistory: 92,
        invoices: [
            { invoiceNumber: 'INV-2024-007', amount: 72000, dueDate: '2024-11-20', overdueDays: 0, status: 'pending' }
        ]
    },
    {
        clientName: 'Manufacturing Pro',
        dso: 73,
        amount: 203000,
        trend: 'stable',
        riskLevel: 'medium',
        lastPayment: '2024-10-08',
        paymentHistory: 68,
        invoices: [
            { invoiceNumber: 'INV-2024-008', amount: 120000, dueDate: '2024-10-25', overdueDays: 3, status: 'overdue' },
            { invoiceNumber: 'INV-2024-009', amount: 83000, dueDate: '2024-11-10', overdueDays: 0, status: 'pending' }
        ]
    }
];

export default function DSOClientChart() {
    const [selectedClient, setSelectedClient] = useState<ClientDSOData | null>(null);

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
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
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