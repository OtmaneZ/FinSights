'use client'

import React from 'react';
import { InvoiceDetail, formatCurrency, formatDate } from '@/lib/drillDownHelpers';

interface InvoiceDetailViewProps {
    invoices: InvoiceDetail[];
    entityName: string;
    onBack: () => void;
}

export function InvoiceDetailView({ invoices, entityName, onBack }: InvoiceDetailViewProps) {
    // Statistiques des factures
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidInvoices = invoices.filter(inv => inv.status === 'Payé' || inv.status === 'Paid');
    const pendingInvoices = invoices.filter(inv => inv.status === 'En attente' || inv.status === 'Pending');
    const overdueInvoices = invoices.filter(inv => inv.daysOverdue && inv.daysOverdue > 0);

    const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            {/* Header avec bouton retour */}
            <div style={{
                padding: '24px 32px',
                borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)'
            }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        color: '#a5b4fc',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginBottom: '16px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                        e.currentTarget.style.color = '#a5b4fc';
                    }}
                >
                    <span style={{ fontSize: '16px' }}>←</span> Retour
                </button>

                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: '0 0 8px 0' }}>
                    Factures de {entityName}
                </h2>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                    {invoices.length} facture{invoices.length > 1 ? 's' : ''} au total
                </p>

                {/* Stats résumées */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '12px',
                    marginTop: '20px'
                }}>
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        border: '1px solid rgba(99, 102, 241, 0.15)'
                    }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Total</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                            {formatCurrency(totalAmount)}
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Payées</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
                            {paidInvoices.length}
                        </div>
                        <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>
                            {formatCurrency(totalPaid)}
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        border: '1px solid rgba(251, 191, 36, 0.3)'
                    }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>En attente</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#fbbf24' }}>
                            {pendingInvoices.length}
                        </div>
                        <div style={{ fontSize: '11px', color: '#fbbf24', marginTop: '2px' }}>
                            {formatCurrency(totalPending)}
                        </div>
                    </div>

                    {overdueInvoices.length > 0 && (
                        <div style={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            borderRadius: '10px',
                            padding: '12px 16px',
                            border: '1px solid rgba(239, 68, 68, 0.3)'
                        }}>
                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>En retard</div>
                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444' }}>
                                {overdueInvoices.length}
                            </div>
                            <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '2px' }}>
                                {Math.max(...overdueInvoices.map(i => i.daysOverdue || 0))}j max
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Liste des factures */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 32px'
            }}>
                {invoices.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: '#64748b'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                        <p style={{ fontSize: '16px', margin: 0 }}>Aucune facture trouvée</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {invoices.map((invoice, index) => {
                            // Déterminer la couleur selon le statut
                            let statusColor = '#10b981'; // Vert par défaut (payé)
                            let statusBg = 'rgba(16, 185, 129, 0.1)';
                            let statusBorder = 'rgba(16, 185, 129, 0.3)';

                            if (invoice.status === 'En attente' || invoice.status === 'Pending') {
                                statusColor = '#fbbf24'; // Jaune
                                statusBg = 'rgba(251, 191, 36, 0.1)';
                                statusBorder = 'rgba(251, 191, 36, 0.3)';
                            }

                            if (invoice.daysOverdue && invoice.daysOverdue > 0) {
                                statusColor = '#ef4444'; // Rouge
                                statusBg = 'rgba(239, 68, 68, 0.1)';
                                statusBorder = 'rgba(239, 68, 68, 0.3)';
                            }

                            return (
                                <div
                                    key={invoice.id}
                                    className="drill-down-item"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        border: `1px solid ${statusBorder}`,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '12px'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                marginBottom: '8px'
                                            }}>
                                                <span style={{ fontSize: '20px' }}>📄</span>
                                                <h4 style={{
                                                    fontSize: '16px',
                                                    fontWeight: '700',
                                                    color: '#fff',
                                                    margin: 0
                                                }}>
                                                    {invoice.description}
                                                </h4>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '16px',
                                                flexWrap: 'wrap'
                                            }}>
                                                <div style={{
                                                    fontSize: '13px',
                                                    color: '#94a3b8',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}>
                                                    <span>📅</span>
                                                    {formatDate(invoice.date)}
                                                </div>

                                                {invoice.category && (
                                                    <div style={{
                                                        fontSize: '13px',
                                                        color: '#94a3b8',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}>
                                                        <span>🏷️</span>
                                                        {invoice.category}
                                                    </div>
                                                )}

                                                {invoice.daysOverdue && invoice.daysOverdue > 0 && (
                                                    <div style={{
                                                        fontSize: '13px',
                                                        color: '#ef4444',
                                                        fontWeight: '600',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}>
                                                        <span>⚠️</span>
                                                        Retard de {invoice.daysOverdue}j
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{
                                                fontSize: '20px',
                                                fontWeight: '700',
                                                color: '#fff',
                                                marginBottom: '6px'
                                            }}>
                                                {formatCurrency(invoice.amount)}
                                            </div>

                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '4px 12px',
                                                background: statusBg,
                                                border: `1px solid ${statusBorder}`,
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: statusColor
                                            }}>
                                                {invoice.status === 'Payé' || invoice.status === 'Paid' ? '✓' : '⏳'}
                                                {' '}
                                                {invoice.status}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Barre de progression pour factures en attente */}
                                    {(invoice.status === 'En attente' || invoice.status === 'Pending') && invoice.daysOverdue !== undefined && (
                                        <div style={{ marginTop: '12px' }}>
                                            <div style={{
                                                height: '4px',
                                                background: 'rgba(99, 102, 241, 0.1)',
                                                borderRadius: '2px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    height: '100%',
                                                    width: `${Math.min((invoice.daysOverdue / 60) * 100, 100)}%`,
                                                    background: invoice.daysOverdue > 30 ? '#ef4444' : '#fbbf24',
                                                    transition: 'width 0.3s ease'
                                                }} />
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginTop: '4px',
                                                fontSize: '11px',
                                                color: '#64748b'
                                            }}>
                                                <span>Émise il y a {invoice.daysOverdue}j</span>
                                                <span>DSO cible: 30-45j</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
