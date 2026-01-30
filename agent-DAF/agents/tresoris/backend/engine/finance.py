"""
Finance Engine - Moteur de calculs déterministes pour l'Agent DAF
Tous les chiffres sont calculables à la main, aucun LLM ici.
"""

import pandas as pd
import yaml
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field, asdict
import os


@dataclass
class TreasuryPosition:
    """Position de trésorerie actuelle"""
    current_balance: float
    as_of_date: str
    total_inflows_mtd: float  # Month to date
    total_outflows_mtd: float
    pending_client_payments: float
    pending_supplier_payments: float
    cash_runway_days: int  # Nombre de jours de trésorerie disponibles
    status: str  # safe, warning, critical


@dataclass
class CashForecast:
    """Prévision de trésorerie pour un horizon donné"""
    horizon_weeks: int
    horizon_label: str
    start_balance: float
    projected_inflows: float
    projected_outflows: float
    end_balance: float
    min_balance: float  # Minimum atteint pendant la période
    min_balance_date: str
    probability_weighted_balance: float  # Balance pondérée par probabilité
    status: str
    weekly_breakdown: List[Dict] = field(default_factory=list)


@dataclass
class RiskItem:
    """Élément de risque détecté"""
    id: str
    category: str  # client_payment, supplier, cash_tension, concentration
    severity: str  # low, medium, high, critical
    score: int  # 0-100
    title: str
    description: str
    amount_at_risk: float
    due_date: Optional[str]
    entity_id: Optional[str]
    entity_name: Optional[str]
    days_overdue: Optional[int]
    recommended_action: str


@dataclass
class ActionItem:
    """Action recommandée"""
    id: str
    priority: int  # 1 = plus urgent
    category: str
    action: str
    expected_impact: float
    deadline: str
    effort: str  # low, medium, high
    risk_ids: List[str] = field(default_factory=list)


class FinanceEngine:
    """
    Moteur de calculs financiers déterministes.
    Parse les CSV, calcule la trésorerie, projections et détecte les risques.
    """
    
    def __init__(self, data_path: str = None):
        if data_path is None:
            # Chemin par défaut relatif au fichier
            data_path = Path(__file__).parent.parent.parent / "data"
        self.data_path = Path(data_path)
        self.rules: Dict = {}
        self.bank_transactions: Optional[pd.DataFrame] = None
        self.customer_invoices: Optional[pd.DataFrame] = None
        self.supplier_invoices: Optional[pd.DataFrame] = None
        self.payment_schedule: Optional[pd.DataFrame] = None
        self.today = datetime.now().date()
    
    def load_rules(self) -> Dict:
        """Charge les règles métier depuis rules.yaml"""
        rules_path = self.data_path / "rules.yaml"
        with open(rules_path, 'r', encoding='utf-8') as f:
            self.rules = yaml.safe_load(f)
        return self.rules
    
    def load_data(self) -> Dict[str, pd.DataFrame]:
        """Charge toutes les données CSV"""
        # Transactions bancaires
        self.bank_transactions = pd.read_csv(
            self.data_path / "bank_transactions.csv",
            parse_dates=['date']
        )
        self.bank_transactions['date'] = pd.to_datetime(self.bank_transactions['date']).dt.date
        
        # Factures clients
        self.customer_invoices = pd.read_csv(
            self.data_path / "customer_invoices.csv",
            parse_dates=['invoice_date', 'due_date', 'payment_date']
        )
        for col in ['invoice_date', 'due_date', 'payment_date']:
            self.customer_invoices[col] = pd.to_datetime(self.customer_invoices[col]).dt.date
        
        # Factures fournisseurs
        self.supplier_invoices = pd.read_csv(
            self.data_path / "supplier_invoices.csv",
            parse_dates=['invoice_date', 'due_date', 'payment_date']
        )
        for col in ['invoice_date', 'due_date', 'payment_date']:
            self.supplier_invoices[col] = pd.to_datetime(self.supplier_invoices[col]).dt.date
        
        # Échéancier prévu
        self.payment_schedule = pd.read_csv(
            self.data_path / "payment_schedule.csv",
            parse_dates=['date']
        )
        self.payment_schedule['date'] = pd.to_datetime(self.payment_schedule['date']).dt.date
        
        return {
            "bank_transactions": len(self.bank_transactions),
            "customer_invoices": len(self.customer_invoices),
            "supplier_invoices": len(self.supplier_invoices),
            "payment_schedule": len(self.payment_schedule)
        }
    
    def normalize_data(self) -> Dict:
        """Normalise et valide les données"""
        stats = {
            "total_records": 0,
            "validated": 0,
            "warnings": []
        }
        
        # Validation des transactions bancaires
        if self.bank_transactions is not None:
            stats["total_records"] += len(self.bank_transactions)
            # Vérifier les montants non nuls
            valid_txn = self.bank_transactions['amount'].notna().sum()
            stats["validated"] += valid_txn
            
        # Recalculer les jours de retard pour les factures clients
        if self.customer_invoices is not None:
            stats["total_records"] += len(self.customer_invoices)
            # Recalcul dynamique des jours de retard
            self.customer_invoices['days_overdue_calc'] = self.customer_invoices.apply(
                lambda row: (self.today - row['due_date']).days 
                if row['status'] != 'paid' and row['due_date'] < self.today 
                else 0,
                axis=1
            )
            stats["validated"] += len(self.customer_invoices)
        
        # Validation fournisseurs
        if self.supplier_invoices is not None:
            stats["total_records"] += len(self.supplier_invoices)
            stats["validated"] += len(self.supplier_invoices)
        
        return stats
    
    def calculate_treasury_position(self) -> TreasuryPosition:
        """Calcule la position de trésorerie actuelle"""
        # Solde actuel = dernière ligne d'ouverture + somme des mouvements
        opening = self.bank_transactions[
            self.bank_transactions['category'] == 'opening_balance'
        ]['amount'].sum()
        
        movements = self.bank_transactions[
            self.bank_transactions['category'] != 'opening_balance'
        ]['amount'].sum()
        
        current_balance = opening + movements
        
        # Encaissements/décaissements du mois
        current_month = self.today.month
        current_year = self.today.year
        
        mtd_txn = self.bank_transactions[
            (self.bank_transactions['date'].apply(lambda x: x.month) == current_month) &
            (self.bank_transactions['date'].apply(lambda x: x.year) == current_year) &
            (self.bank_transactions['category'] != 'opening_balance')
        ]
        
        inflows_mtd = mtd_txn[mtd_txn['amount'] > 0]['amount'].sum()
        outflows_mtd = abs(mtd_txn[mtd_txn['amount'] < 0]['amount'].sum())
        
        # Encours clients (factures pending)
        pending_clients = self.customer_invoices[
            self.customer_invoices['status'].isin(['pending', 'overdue'])
        ]['amount'].sum()
        
        # Encours fournisseurs (factures pending)
        pending_suppliers = self.supplier_invoices[
            self.supplier_invoices['status'].isin(['pending', 'overdue'])
        ]['amount'].sum()
        
        # Calcul du runway (jours de trésorerie)
        avg_daily_outflow = outflows_mtd / max(self.today.day, 1)
        cash_runway = int(current_balance / avg_daily_outflow) if avg_daily_outflow > 0 else 999
        
        # Détermination du statut
        min_cash = self.rules.get('treasury', {}).get('absolute_minimum', 500000)
        comfort_level = self.rules.get('treasury', {}).get('comfort_level', 2000000)
        
        if current_balance < min_cash:
            status = "critical"
        elif current_balance < comfort_level:
            status = "warning"
        else:
            status = "safe"
        
        return TreasuryPosition(
            current_balance=round(current_balance, 2),
            as_of_date=self.today.isoformat(),
            total_inflows_mtd=round(inflows_mtd, 2),
            total_outflows_mtd=round(outflows_mtd, 2),
            pending_client_payments=round(pending_clients, 2),
            pending_supplier_payments=round(pending_suppliers, 2),
            cash_runway_days=cash_runway,
            status=status
        )
    
    def calculate_forecast(self, horizon_weeks: int) -> CashForecast:
        """Calcule les prévisions de trésorerie pour un horizon donné"""
        treasury = self.calculate_treasury_position()
        start_balance = treasury.current_balance
        
        end_date = self.today + timedelta(weeks=horizon_weeks)
        
        # Filtrer les flux prévus dans l'horizon
        scheduled = self.payment_schedule[
            (self.payment_schedule['date'] >= self.today) &
            (self.payment_schedule['date'] <= end_date)
        ].copy()
        
        # Calculs avec pondération par probabilité
        inflows = scheduled[scheduled['type'] == 'inflow']
        outflows = scheduled[scheduled['type'] == 'outflow']
        
        projected_inflows = (inflows['amount'] * inflows['probability']).sum()
        projected_outflows = abs((outflows['amount'] * outflows['probability']).sum())
        
        # Calcul semaine par semaine pour trouver le minimum
        weekly_breakdown = []
        running_balance = start_balance
        min_balance = start_balance
        min_balance_date = self.today.isoformat()
        
        for week in range(horizon_weeks):
            week_start = self.today + timedelta(weeks=week)
            week_end = self.today + timedelta(weeks=week + 1)
            
            week_flows = scheduled[
                (scheduled['date'] >= week_start) &
                (scheduled['date'] < week_end)
            ]
            
            week_in = (week_flows[week_flows['type'] == 'inflow']['amount'] * 
                      week_flows[week_flows['type'] == 'inflow']['probability']).sum()
            week_out = abs((week_flows[week_flows['type'] == 'outflow']['amount'] * 
                           week_flows[week_flows['type'] == 'outflow']['probability']).sum())
            
            running_balance += week_in - week_out
            
            if running_balance < min_balance:
                min_balance = running_balance
                min_balance_date = week_end.isoformat()
            
            weekly_breakdown.append({
                "week": week + 1,
                "start_date": week_start.isoformat(),
                "end_date": week_end.isoformat(),
                "inflows": round(week_in, 2),
                "outflows": round(week_out, 2),
                "net_flow": round(week_in - week_out, 2),
                "end_balance": round(running_balance, 2)
            })
        
        end_balance = running_balance
        
        # Détermination du statut
        min_cash = self.rules.get('treasury', {}).get('absolute_minimum', 500000)
        comfort_level = self.rules.get('treasury', {}).get('comfort_level', 2000000)
        
        if min_balance < min_cash:
            status = "critical"
        elif min_balance < comfort_level:
            status = "warning"
        else:
            status = "safe"
        
        horizon_labels = {4: "Court terme (4 sem.)", 8: "Moyen terme (8 sem.)", 13: "Long terme (13 sem.)"}
        
        return CashForecast(
            horizon_weeks=horizon_weeks,
            horizon_label=horizon_labels.get(horizon_weeks, f"{horizon_weeks} semaines"),
            start_balance=round(start_balance, 2),
            projected_inflows=round(projected_inflows, 2),
            projected_outflows=round(projected_outflows, 2),
            end_balance=round(end_balance, 2),
            min_balance=round(min_balance, 2),
            min_balance_date=min_balance_date,
            probability_weighted_balance=round(end_balance, 2),
            status=status,
            weekly_breakdown=weekly_breakdown
        )
    
    def detect_risks(self) -> List[RiskItem]:
        """Détecte tous les risques basés sur les règles métier"""
        risks = []
        risk_counter = 0
        
        # A) Risques clients - Retards de paiement
        late_threshold = self.rules.get('clients', {}).get('late_payment_days', 45)
        critical_threshold = self.rules.get('clients', {}).get('critical_late_days', 90)
        
        overdue_invoices = self.customer_invoices[
            self.customer_invoices['status'] == 'overdue'
        ].copy()
        
        for _, inv in overdue_invoices.iterrows():
            days_late = (self.today - inv['due_date']).days
            
            if days_late >= critical_threshold:
                severity = "critical"
                score = 90 + min(days_late - critical_threshold, 10)
            elif days_late >= late_threshold:
                severity = "high"
                score = 70 + int((days_late - late_threshold) / (critical_threshold - late_threshold) * 20)
            else:
                severity = "medium"
                score = 40 + int(days_late / late_threshold * 30)
            
            risk_counter += 1
            risks.append(RiskItem(
                id=f"RISK-{risk_counter:03d}",
                category="client_payment",
                severity=severity,
                score=min(score, 100),
                title=f"Retard paiement {inv['client_name']}",
                description=f"Facture {inv['invoice_id']} en retard de {days_late} jours",
                amount_at_risk=inv['amount'],
                due_date=inv['due_date'].isoformat() if inv['due_date'] else None,
                entity_id=inv['client_id'],
                entity_name=inv['client_name'],
                days_overdue=days_late,
                recommended_action=f"Relancer {inv['client_name']} - priorité {'immédiate' if severity == 'critical' else 'haute'}"
            ))
        
        # B) Risques fournisseurs - Factures impayées
        overdue_suppliers = self.supplier_invoices[
            self.supplier_invoices['status'] == 'overdue'
        ]
        
        for _, inv in overdue_suppliers.iterrows():
            days_late = (self.today - inv['due_date']).days
            priority = inv.get('priority', 'normal')
            
            if priority == 'critical' or days_late > 30:
                severity = "high"
                score = 75
            elif priority == 'high' or days_late > 15:
                severity = "medium"
                score = 55
            else:
                severity = "low"
                score = 35
            
            risk_counter += 1
            risks.append(RiskItem(
                id=f"RISK-{risk_counter:03d}",
                category="supplier",
                severity=severity,
                score=score,
                title=f"Facture fournisseur impayée - {inv['supplier_name']}",
                description=f"Facture {inv['invoice_id']} en retard de {days_late} jours",
                amount_at_risk=inv['amount'],
                due_date=inv['due_date'].isoformat() if inv['due_date'] else None,
                entity_id=inv['supplier_id'],
                entity_name=inv['supplier_name'],
                days_overdue=days_late,
                recommended_action=f"Régulariser le paiement de {inv['supplier_name']}"
            ))
        
        # C) Risque de tension de trésorerie
        forecasts = [self.calculate_forecast(w) for w in [4, 8, 13]]
        min_cash = self.rules.get('treasury', {}).get('absolute_minimum', 500000)
        
        for forecast in forecasts:
            if forecast.min_balance < min_cash:
                risk_counter += 1
                severity = "critical" if forecast.min_balance < min_cash * 0.5 else "high"
                score = 95 if severity == "critical" else 80
                
                risks.append(RiskItem(
                    id=f"RISK-{risk_counter:03d}",
                    category="cash_tension",
                    severity=severity,
                    score=score,
                    title=f"Tension de trésorerie à {forecast.horizon_weeks} semaines",
                    description=f"Solde minimum prévu: {forecast.min_balance:,.0f}€ (seuil: {min_cash:,.0f}€)",
                    amount_at_risk=min_cash - forecast.min_balance,
                    due_date=forecast.min_balance_date,
                    entity_id=None,
                    entity_name=None,
                    days_overdue=None,
                    recommended_action="Accélérer les encaissements ou différer les décaissements"
                ))
        
        # D) Risque de concentration client
        max_concentration = self.rules.get('clients', {}).get('max_client_concentration', 25)
        
        pending_by_client = self.customer_invoices[
            self.customer_invoices['status'].isin(['pending', 'overdue'])
        ].groupby('client_id')['amount'].sum()
        
        total_pending = pending_by_client.sum()
        
        if total_pending > 0:
            for client_id, amount in pending_by_client.items():
                concentration = (amount / total_pending) * 100
                if concentration > max_concentration:
                    client_name = self.customer_invoices[
                        self.customer_invoices['client_id'] == client_id
                    ]['client_name'].iloc[0]
                    
                    risk_counter += 1
                    risks.append(RiskItem(
                        id=f"RISK-{risk_counter:03d}",
                        category="concentration",
                        severity="medium",
                        score=60,
                        title=f"Concentration client élevée - {client_name}",
                        description=f"{concentration:.1f}% de l'encours total (seuil: {max_concentration}%)",
                        amount_at_risk=amount,
                        due_date=None,
                        entity_id=client_id,
                        entity_name=client_name,
                        days_overdue=None,
                        recommended_action="Diversifier le portefeuille client"
                    ))
        
        # Trier par score décroissant
        risks.sort(key=lambda x: x.score, reverse=True)
        
        return risks
    
    def generate_action_plan(self, risks: List[RiskItem]) -> List[ActionItem]:
        """Génère un plan d'actions priorisé basé sur les risques détectés - NIVEAU DAF (pilotage, pas opérationnel)"""
        actions = []
        action_counter = 0
        
        # Regrouper les risques par catégorie
        critical_risks = [r for r in risks if r.severity == 'critical']
        high_risks = [r for r in risks if r.severity == 'high']
        all_severe_risks = critical_risks + high_risks
        
        # DÉCISION 1 : Requalification des encaissements si risques critiques
        if critical_risks:
            action_counter += 1
            critical_amount = sum(r.amount_at_risk for r in critical_risks)
            
            # Trier les risques critiques par montant décroissant
            sorted_critical_risks = sorted(critical_risks, key=lambda r: r.amount_at_risk, reverse=True)
            
            # Construire le message avec les clients critiques
            num_clients = len(sorted_critical_risks)
            if num_clients >= 2:
                # Format: décision principale claire + exposition en ligne séparée
                # Format français avec espaces (1 375 K€)
                exposure_total = f"{critical_amount/1000:,.0f} K€".replace(',', ' ')
                action_text = f"Requalifier les encaissements clients critiques ({num_clients} dossiers) : CERTAIN → INCERTAIN\nExposition totale reclassée : {exposure_total}"
                
                # Ajouter les détails des clients critiques avec jours de retard
                def format_client(r):
                    days = getattr(r, 'days_overdue', None) or 0
                    amount_formatted = f"{r.amount_at_risk/1000:,.0f}".replace(',', ' ')
                    return f"  • {r.entity_name}: {amount_formatted} K€ ({days}j de retard)"
                
                client_details = "\n".join([format_client(r) for r in sorted_critical_risks[:2]])
                action_text += f"\n\n{client_details}"
            else:
                # Format: 1 seul client avec montant formaté français
                top_risk = sorted_critical_risks[0]
                amount_formatted = f"{critical_amount/1000:,.0f}".replace(',', ' ')
                action_text = f"Requalifier l'encaissement {top_risk.entity_name} : CERTAIN → INCERTAIN ({amount_formatted} K€ à risque)"
            
            actions.append(ActionItem(
                id=f"ACTION-{action_counter:03d}",
                priority=1,
                category="pilotage",
                action=action_text,
                expected_impact=critical_amount,
                deadline=(self.today + timedelta(days=2)).isoformat(),
                effort="low",
                risk_ids=[r.id for r in critical_risks]
            ))
        
        # DÉCISION 2 : Ajustement forecast si exposition significative (>500K€)
        total_severe_exposure = sum(r.amount_at_risk for r in all_severe_risks)
        if total_severe_exposure > 500000:
            action_counter += 1
            
            # Calculer l'horizon d'impact (approximatif)
            avg_days_overdue = sum(r.days_overdue for r in all_severe_risks if hasattr(r, 'days_overdue')) / len(all_severe_risks) if all_severe_risks else 30
            impact_horizon_weeks = min(8, max(2, int(avg_days_overdue / 7)))
            
            actions.append(ActionItem(
                id=f"ACTION-{action_counter:03d}",
                priority=1,
                category="forecast",
                action=f"Acter une dégradation de scénario trésorerie : -{total_severe_exposure/1000:.0f}K€ sur {impact_horizon_weeks} semaines (recouvrement structurellement dégradé)",
                expected_impact=total_severe_exposure,
                deadline=(self.today + timedelta(days=1)).isoformat(),
                effort="low",
                risk_ids=[r.id for r in all_severe_risks]
            ))
        
        # DÉCISION 3 : Passage en mode vigilance si runway <120j ou exposition critique
        treasury = self.calculate_treasury_position()
        runway_days = treasury.cash_runway_days
        
        if runway_days < 120 or len(critical_risks) >= 2:
            action_counter += 1
            reason = f"Runway {runway_days}j" if runway_days < 120 else f"{len(critical_risks)} expositions critiques"
            
            actions.append(ActionItem(
                id=f"ACTION-{action_counter:03d}",
                priority=2,
                category="gouvernance",
                action=f"Passage en mode VIGILANCE CASH ({reason}) - Validation DAF requise sur décaissements >50K€",
                expected_impact=0,
                deadline=(self.today + timedelta(days=1)).isoformat(),
                effort="low",
                risk_ids=[r.id for r in critical_risks] if critical_risks else [r.id for r in high_risks[:2]]
            ))
        
        # DÉCISION 4 : Recommandation suspension si client défaillant
        very_late_risks = [r for r in all_severe_risks if hasattr(r, 'days_overdue') and r.days_overdue > 90]
        if very_late_risks:
            action_counter += 1
            top_late = max(very_late_risks, key=lambda r: r.amount_at_risk)
            
            actions.append(ActionItem(
                id=f"ACTION-{action_counter:03d}",
                priority=2,
                category="risque",
                action=f"Recommandation : Bloquer nouvelles commandes {top_late.entity_name} (retard {getattr(top_late, 'days_overdue', 0)}j)",
                expected_impact=top_late.amount_at_risk * 0.5,  # Prévention de doublage du risque
                deadline=(self.today + timedelta(days=3)).isoformat(),
                effort="medium",
                risk_ids=[r.id for r in very_late_risks]
            ))
        
        # DÉCISION 5 : Provision comptable si scénario pessimiste probable
        if len(critical_risks) >= 1:
            action_counter += 1
            provision_amount = sum(r.amount_at_risk * 0.3 for r in critical_risks)  # 30% du risque critique
            
            actions.append(ActionItem(
                id=f"ACTION-{action_counter:03d}",
                priority=3,
                category="comptable",
                action=f"Provisionner {provision_amount/1000:.0f}K€ sur créances douteuses (scénario pessimiste 30%)",
                expected_impact=provision_amount,
                deadline=(self.today + timedelta(days=7)).isoformat(),
                effort="low",
                risk_ids=[r.id for r in critical_risks]
            ))
        
        # Trier par priorité
        actions.sort(key=lambda x: x.priority)
        
        return actions
    
    def get_summary_stats(self) -> Dict:
        """Retourne les statistiques globales pour le dashboard"""
        treasury = self.calculate_treasury_position()
        risks = self.detect_risks()
        
        return {
            "treasury": asdict(treasury),
            "forecasts": {
                "4_weeks": asdict(self.calculate_forecast(4)),
                "8_weeks": asdict(self.calculate_forecast(8)),
                "13_weeks": asdict(self.calculate_forecast(13))
            },
            "risks_summary": {
                "total": len(risks),
                "critical": len([r for r in risks if r.severity == 'critical']),
                "high": len([r for r in risks if r.severity == 'high']),
                "medium": len([r for r in risks if r.severity == 'medium']),
                "low": len([r for r in risks if r.severity == 'low']),
                "total_amount_at_risk": sum(r.amount_at_risk for r in risks)
            },
            "company": self.rules.get('company', {})
        }
