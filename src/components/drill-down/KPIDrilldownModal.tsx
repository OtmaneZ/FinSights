'use client'

import React, { useMemo } from 'react';
import { DrillDownState, DrillDownActions } from '@/hooks/useDrilldown';
import {
    aggregateByClient,
    aggregateByCategory,
    getDrillDownType,
    calculateDrillDownStats,
    formatCurrency,
    getInvoicesForEntity,
    AggregatedEntity
} from '@/lib/drillDownHelpers';
import { InvoiceDetailView } from './InvoiceDetailView';

interface KPIDrilldownModalProps {
    state: DrillDownState;
    actions: DrillDownActions;
    rawData: any[];
}

export function KPIDrilldownModal({ state, actions, rawData }: KPIDrilldownModalProps) {
    // ⚠️ Hooks MUST be called before any conditional return

    // Déterminer le type d'agrégation selon le KPI
    const drillDownType = state.selectedKPI ? getDrillDownType(state.selectedKPI) : 'client';

    // Calculer les données agrégées
    const aggregatedData = useMemo(() => {
        if (!state.selectedKPI) return [];
        if (drillDownType === 'client') {
            return aggregateByClient(rawData, state.selectedKPI);
        } else if (drillDownType === 'category') {
            return aggregateByCategory(rawData, state.selectedKPI);
        } else {
            // Pour 'both', afficher les clients par défaut (possibilité de toggle plus tard)
            return aggregateByClient(rawData, state.selectedKPI);
        }
    }, [rawData, state.selectedKPI, drillDownType]);

    // Statistiques globales
    const stats = useMemo(() => calculateDrillDownStats(aggregatedData), [aggregatedData]);

    // Factures pour l'entité sélectionnée (niveau 2)
    const invoices = useMemo(() => {
        if (state.currentLevel === 'invoices' && state.selectedEntity && state.selectedKPI) {
            return getInvoicesForEntity(rawData, state.selectedEntity, state.selectedKPI);
        }
        return [];
    }, [rawData, state.selectedEntity, state.selectedKPI, state.currentLevel]);

    // Handler click sur une entité
    const handleEntityClick = (entity: AggregatedEntity) => {
        actions.selectEntity(entity.name);
    };

    // Early return AFTER all hooks
    if (!state.isOpen || !state.selectedKPI) return null;

    return (
        <div
            className="drill-down-backdrop"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                padding: '20px'
            }}
            onClick={actions.closeDrillDown}
        >
            <div
                className="drill-down-modal"
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    borderRadius: '16px',
                    maxWidth: '900px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Affichage conditionnel selon le niveau */}
                {state.currentLevel === 'invoices' && state.selectedEntity ? (
                    // Niveau 2: Liste des factures
                    <InvoiceDetailView
                        invoices={invoices}
                        entityName={state.selectedEntity}
                        onBack={actions.goBack}
                    />
                ) : (
                    // Niveau 1: Liste agrégée (clients/catégories)
                    <>
                        {/* Header */}
                        <div style={{
                            padding: '24px 32px',
                            borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    {/* Breadcrumb */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        {state.breadcrumb.map((crumb, index) => (
                                            <React.Fragment key={index}>
                                                {index > 0 && <span style={{ color: '#64748b', fontSize: '14px' }}>›</span>}
                                                <span style={{
                                                    fontSize: index === state.breadcrumb.length - 1 ? '16px' : '14px',
                                                    fontWeight: index === state.breadcrumb.length - 1 ? '700' : '500',
                                                    color: index === state.breadcrumb.length - 1 ? '#e2e8f0' : '#94a3b8'
                                                }}>
                                                    {crumb}
                                                </span>
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: '0 0 8px 0' }}>
                                        Analyse détaillée
                                    </h2>
                                    <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                                        {drillDownType === 'client' ? 'Répartition par client' : 'Répartition par catégorie'}
                                    </p>
                                </div>

                                {/* Bouton fermer */}
                                <button
                                    onClick={actions.closeDrillDown}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: '#94a3b8',
                                        fontSize: '20px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.color = '#fff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        e.currentTarget.style.color = '#94a3b8';
                                    }}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Stats globales */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: '16px',
                                marginTop: '20px'
                            }}>
                                <div style={{
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    borderRadius: '10px',
                                    padding: '12px 16px',
                                    border: '1px solid rgba(99, 102, 241, 0.15)'
                                }}>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Total</div>
                                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
                                        {formatCurrency(stats.totalAmount)}
                                    </div>
                                </div>

                                <div style={{
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    borderRadius: '10px',
                                    padding: '12px 16px',
                                    border: '1px solid rgba(99, 102, 241, 0.15)'
                                }}>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Nombre</div>
                                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
                                        {stats.totalCount}
                                    </div>
                                </div>

                                <div style={{
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    borderRadius: '10px',
                                    padding: '12px 16px',
                                    border: '1px solid rgba(99, 102, 241, 0.15)'
                                }}>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Concentration Top 3</div>
                                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#fbbf24' }}>
                                        {stats.concentration.toFixed(0)}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Liste des entités agrégées */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '24px 32px'
                        }}>
                            {aggregatedData.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '60px 20px',
                                    color: '#64748b'
                                }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                                    <p style={{ fontSize: '16px', margin: 0 }}>Aucune donnée disponible</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {aggregatedData.map((entity, index) => (
                                        <div
                                            key={index}
                                            className="drill-down-item"
                                            onClick={() => handleEntityClick(entity)}
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                                                borderRadius: '12px',
                                                padding: '20px',
                                                border: '1px solid rgba(99, 102, 241, 0.15)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateX(4px)';
                                                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.15)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateX(0)';
                                                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.15)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            {/* Barre de progression en fond */}
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                width: `${entity.percentage}%`,
                                                background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                                                transition: 'width 0.3s ease'
                                            }} />

                                            <div style={{ position: 'relative', zIndex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <span style={{ fontSize: '24px' }}>
                                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📌'}
                                                            </span>
                                                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>
                                                                {entity.name}
                                                            </h3>
                                                        </div>
                                                        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '6px 0 0 36px' }}>
                                                            {entity.count} transaction{entity.count > 1 ? 's' : ''}
                                                        </p>
                                                    </div>

                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '22px', fontWeight: '700', color: '#6366f1', marginBottom: '4px' }}>
                                                            {formatCurrency(entity.value)}
                                                        </div>
                                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#fbbf24' }}>
                                                            {entity.percentage?.toFixed(1)}%
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Indicateur "voir détails" */}
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-end',
                                                    gap: '6px',
                                                    fontSize: '13px',
                                                    color: '#6366f1',
                                                    fontWeight: '600'
                                                }}>
                                                    Voir les factures <span style={{ fontSize: '10px' }}>›</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
