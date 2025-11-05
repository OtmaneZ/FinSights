import { useState, useCallback } from 'react';

/**
 * Hook pour gérer l'état du drill-down interactif sur les KPIs
 *
 * Flow: KPI Card → Level 1 (Clients/Catégories agrégés) → Level 2 (Factures) → Level 3 (Détail facture)
 */

export type DrillDownLevel = 'kpi' | 'aggregated' | 'invoices' | 'detail';

export interface DrillDownState {
    isOpen: boolean;
    selectedKPI: string | null; // Titre du KPI (ex: "Chiffre d'Affaires", "DSO")
    currentLevel: DrillDownLevel;
    selectedEntity: string | null; // Client ou catégorie sélectionné au niveau 1
    selectedInvoice: string | null; // ID facture sélectionnée au niveau 2
    breadcrumb: string[]; // Fil d'Ariane pour navigation
}

export interface DrillDownActions {
    openDrillDown: (kpiTitle: string) => void;
    closeDrillDown: () => void;
    navigateToLevel: (level: DrillDownLevel, entity?: string) => void;
    selectEntity: (entityName: string) => void;
    selectInvoice: (invoiceId: string) => void;
    goBack: () => void;
}

export function useDrilldown(): [DrillDownState, DrillDownActions] {
    const [state, setState] = useState<DrillDownState>({
        isOpen: false,
        selectedKPI: null,
        currentLevel: 'kpi',
        selectedEntity: null,
        selectedInvoice: null,
        breadcrumb: []
    });

    // Ouvrir drill-down depuis un KPI
    const openDrillDown = useCallback((kpiTitle: string) => {
        setState({
            isOpen: true,
            selectedKPI: kpiTitle,
            currentLevel: 'aggregated',
            selectedEntity: null,
            selectedInvoice: null,
            breadcrumb: [kpiTitle]
        });
    }, []);

    // Fermer drill-down
    const closeDrillDown = useCallback(() => {
        setState({
            isOpen: false,
            selectedKPI: null,
            currentLevel: 'kpi',
            selectedEntity: null,
            selectedInvoice: null,
            breadcrumb: []
        });
    }, []);

    // Naviguer vers un niveau spécifique
    const navigateToLevel = useCallback((level: DrillDownLevel, entity?: string) => {
        setState(prev => {
            let newBreadcrumb = [...prev.breadcrumb];

            // Mettre à jour breadcrumb selon le niveau
            switch (level) {
                case 'aggregated':
                    newBreadcrumb = [prev.selectedKPI || ''];
                    break;
                case 'invoices':
                    if (entity) {
                        newBreadcrumb = [prev.selectedKPI || '', entity];
                    }
                    break;
                case 'detail':
                    if (entity) {
                        newBreadcrumb = [prev.selectedKPI || '', prev.selectedEntity || '', entity];
                    }
                    break;
                default:
                    newBreadcrumb = [];
            }

            return {
                ...prev,
                currentLevel: level,
                breadcrumb: newBreadcrumb
            };
        });
    }, []);

    // Sélectionner une entité (client/catégorie) au niveau 1
    const selectEntity = useCallback((entityName: string) => {
        setState(prev => ({
            ...prev,
            selectedEntity: entityName,
            currentLevel: 'invoices',
            breadcrumb: [prev.selectedKPI || '', entityName]
        }));
    }, []);

    // Sélectionner une facture au niveau 2
    const selectInvoice = useCallback((invoiceId: string) => {
        setState(prev => ({
            ...prev,
            selectedInvoice: invoiceId,
            currentLevel: 'detail',
            breadcrumb: [...prev.breadcrumb, `Facture ${invoiceId}`]
        }));
    }, []);

    // Revenir en arrière
    const goBack = useCallback(() => {
        setState(prev => {
            let newLevel: DrillDownLevel = 'kpi';
            let newBreadcrumb = [...prev.breadcrumb];
            newBreadcrumb.pop();

            // Déterminer le niveau précédent
            if (prev.currentLevel === 'detail') {
                newLevel = 'invoices';
            } else if (prev.currentLevel === 'invoices') {
                newLevel = 'aggregated';
            } else if (prev.currentLevel === 'aggregated') {
                // Fermer le modal
                return {
                    isOpen: false,
                    selectedKPI: null,
                    currentLevel: 'kpi',
                    selectedEntity: null,
                    selectedInvoice: null,
                    breadcrumb: []
                };
            }

            return {
                ...prev,
                currentLevel: newLevel,
                breadcrumb: newBreadcrumb,
                selectedInvoice: prev.currentLevel === 'detail' ? null : prev.selectedInvoice
            };
        });
    }, []);

    const actions: DrillDownActions = {
        openDrillDown,
        closeDrillDown,
        navigateToLevel,
        selectEntity,
        selectInvoice,
        goBack
    };

    return [state, actions];
}
