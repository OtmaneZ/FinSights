# DASHIS Frontend - Interface Utilisateur

Composants React/TypeScript pour l'interface du dashboard IA.

## 📁 Structure (Symlinks)

Tous les fichiers ci-dessous sont des **symlinks** vers `src/components/` :

- `FinancialDashboardV2.tsx` → Hub central, 1954 lignes
- `AICopilot.tsx` → Chat GPT-4
- `charts/` → 8 composants de visualisation

## 🎨 Composants Charts
- `CashFlowEvolutionChart.tsx` - Évolution trésorerie
- `ExpenseBreakdownChart.tsx` - Répartition charges
- `MarginEvolutionChart.tsx` - Évolution marges
- `TopClientsVerticalChart.tsx` - Top clients
- `OutstandingInvoicesChart.tsx` - Factures impayées
- `PaymentStatusChart.tsx` - Statuts paiements
- `SankeyFlowChart.tsx` - Flux financiers (D3.js)
- `SunburstExpensesChart.tsx` - Charges hiérarchiques (D3.js)

## 🔗 Pourquoi des symlinks ?
- **Source unique** : Code réel dans `src/components/` (utilisé par Next.js)
- **Visibilité** : Rendre visible que DASHIS a une interface frontend
- **Zéro duplication** : Pas de copie de code

## ⚠️ Modification
Pour éditer ces composants, modifier directement dans `src/components/`.
