"""
TRESORIS V3 - Margin Analyzer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyse de la marge par client et par produit/service.
Identifie les clients rentables vs destructeurs de cash.

Effet démo visé :
"Ce client génère 12% du CA mais détruit 18% de votre marge."
"En perdant ce client, vous gagneriez 8k€/an."
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from enum import Enum
import pandas as pd
import numpy as np


class ClientProfitability(str, Enum):
    """Classification de rentabilité client"""
    STAR = "star"              # CA élevé + Marge élevée
    CASH_COW = "cash_cow"      # CA stable + Bonne marge
    PROMISING = "promising"    # Petit CA + Bonne marge (potentiel)
    RISKY = "risky"            # Bon CA + Marge faible
    DESTROYER = "destroyer"    # Détruit de la valeur (marge négative ou très faible + coûts cachés)


@dataclass
class ClientMarginProfile:
    """Profil de marge d'un client"""
    client_id: str
    client_name: str
    
    # Chiffres bruts
    revenue: float                    # CA total
    direct_costs: float               # Coûts directs (COGS)
    gross_margin: float               # Marge brute = Revenue - Direct Costs
    gross_margin_pct: float           # Marge brute %
    
    # Coûts cachés (ce qui rend l'analyse puissante)
    financing_cost: float             # Coût de financement (DSO × taux)
    collection_cost: float            # Coût de recouvrement (temps équipe)
    support_cost: float               # Coût support/SAV
    hidden_costs_total: float         # Total coûts cachés
    
    # Marge contributive réelle
    contribution_margin: float        # Marge après coûts cachés
    contribution_margin_pct: float    # Marge contributive %
    
    # Classification
    profitability_class: ClientProfitability
    
    # Comparaison
    revenue_share_pct: float          # % du CA total
    margin_share_pct: float           # % de la marge totale
    is_margin_destroyer: bool         # Détruit plus de marge qu'il n'en apporte
    
    # Recommandation
    recommendation: str
    potential_gain_if_action: float   # Gain potentiel si action
    
    # Détails
    dso_days: int
    payment_reliability: float        # 0-1
    
    def to_dict(self) -> Dict:
        return {
            "client_id": self.client_id,
            "client_name": self.client_name,
            "revenue": self.revenue,
            "direct_costs": self.direct_costs,
            "gross_margin": self.gross_margin,
            "gross_margin_pct": round(self.gross_margin_pct * 100, 1),
            "financing_cost": self.financing_cost,
            "collection_cost": self.collection_cost,
            "support_cost": self.support_cost,
            "hidden_costs_total": self.hidden_costs_total,
            "contribution_margin": self.contribution_margin,
            "contribution_margin_pct": round(self.contribution_margin_pct * 100, 1),
            "profitability_class": self.profitability_class.value,
            "revenue_share_pct": round(self.revenue_share_pct * 100, 1),
            "margin_share_pct": round(self.margin_share_pct * 100, 1),
            "is_margin_destroyer": self.is_margin_destroyer,
            "recommendation": self.recommendation,
            "potential_gain_if_action": self.potential_gain_if_action,
            "dso_days": self.dso_days,
            "payment_reliability": round(self.payment_reliability * 100, 1)
        }


@dataclass
class MarginAnalysisResult:
    """Résultat complet de l'analyse de marge"""
    timestamp: datetime
    period: str                       # "2026-01" ou "Q1-2026"
    
    # Métriques globales
    total_revenue: float
    total_gross_margin: float
    total_gross_margin_pct: float
    total_contribution_margin: float
    total_contribution_margin_pct: float
    total_hidden_costs: float
    
    # Clients analysés
    client_profiles: List[ClientMarginProfile]
    
    # Insights clés
    stars: List[str]                  # Clients stars
    destroyers: List[str]             # Clients destructeurs
    
    # Concentration
    top3_revenue_concentration: float  # % CA des 3 premiers
    top3_margin_concentration: float   # % Marge des 3 premiers
    
    # Effet volume vs prix
    volume_effect: float              # Impact changement volume
    price_effect: float               # Impact changement prix
    mix_effect: float                 # Impact changement mix produits
    
    # Diagnostic
    diagnosis: str
    key_findings: List[str]
    recommended_actions: List[Dict]
    
    def to_dict(self) -> Dict:
        return {
            "timestamp": self.timestamp.isoformat(),
            "period": self.period,
            "total_revenue": self.total_revenue,
            "total_gross_margin": self.total_gross_margin,
            "total_gross_margin_pct": round(self.total_gross_margin_pct * 100, 1),
            "total_contribution_margin": self.total_contribution_margin,
            "total_contribution_margin_pct": round(self.total_contribution_margin_pct * 100, 1),
            "total_hidden_costs": self.total_hidden_costs,
            "client_profiles": [p.to_dict() for p in self.client_profiles],
            "stars": self.stars,
            "destroyers": self.destroyers,
            "top3_revenue_concentration": round(self.top3_revenue_concentration * 100, 1),
            "top3_margin_concentration": round(self.top3_margin_concentration * 100, 1),
            "volume_effect": self.volume_effect,
            "price_effect": self.price_effect,
            "mix_effect": self.mix_effect,
            "diagnosis": self.diagnosis,
            "key_findings": self.key_findings,
            "recommended_actions": self.recommended_actions
        }


class MarginAnalyzer:
    """
    Analyseur de marge par client/produit.
    
    Ce qui le rend puissant :
    1. Calcule les VRAIS coûts (pas juste marge brute)
    2. Inclut coûts de financement (DSO × taux)
    3. Inclut coûts de recouvrement
    4. Classifie les clients (Star → Destroyer)
    5. Calcule l'effet volume/prix/mix
    """
    
    # Paramètres par défaut
    DEFAULT_FINANCING_RATE = 0.05     # 5% coût du capital annuel
    DEFAULT_COLLECTION_COST_PER_DAY = 50  # 50€/jour de recouvrement
    DEFAULT_SUPPORT_COST_RATIO = 0.02  # 2% du CA en support moyen
    
    # Seuils de classification
    HIGH_MARGIN_THRESHOLD = 0.30      # >30% = bonne marge
    LOW_MARGIN_THRESHOLD = 0.10       # <10% = marge faible
    HIGH_REVENUE_THRESHOLD = 0.15     # >15% du CA = gros client
    
    def __init__(
        self,
        financing_rate: float = DEFAULT_FINANCING_RATE,
        collection_cost_per_day: float = DEFAULT_COLLECTION_COST_PER_DAY,
        support_cost_ratio: float = DEFAULT_SUPPORT_COST_RATIO
    ):
        self.financing_rate = financing_rate
        self.collection_cost_per_day = collection_cost_per_day
        self.support_cost_ratio = support_cost_ratio
    
    def analyze_client_margins(
        self,
        revenue_data: pd.DataFrame,
        cost_data: Optional[pd.DataFrame] = None,
        payment_data: Optional[pd.DataFrame] = None,
        period: str = None
    ) -> MarginAnalysisResult:
        """
        Analyse complète des marges par client.
        
        Args:
            revenue_data: DataFrame avec colonnes [client_id, client_name, revenue, (optional) direct_costs]
            cost_data: DataFrame optionnel avec coûts directs par client
            payment_data: DataFrame optionnel avec DSO et historique paiement par client
            period: Période d'analyse ("2026-01", "Q1-2026", etc.)
            
        Returns:
            MarginAnalysisResult complet
        """
        if period is None:
            period = datetime.now().strftime("%Y-%m")
        
        # Fusionner les données
        df = self._prepare_data(revenue_data, cost_data, payment_data)
        
        # Calculer métriques globales
        total_revenue = df['revenue'].sum()
        
        # Analyser chaque client
        client_profiles = []
        
        for _, row in df.iterrows():
            profile = self._analyze_client(row, total_revenue)
            client_profiles.append(profile)
        
        # Trier par contribution margin (desc)
        client_profiles.sort(key=lambda x: x.contribution_margin, reverse=True)
        
        # Calculer métriques agrégées
        total_gross_margin = sum(p.gross_margin for p in client_profiles)
        total_hidden_costs = sum(p.hidden_costs_total for p in client_profiles)
        total_contribution_margin = sum(p.contribution_margin for p in client_profiles)
        
        # Identifier stars et destroyers
        stars = [p.client_name for p in client_profiles if p.profitability_class == ClientProfitability.STAR]
        destroyers = [p.client_name for p in client_profiles if p.profitability_class == ClientProfitability.DESTROYER]
        
        # Calculer concentration
        sorted_by_revenue = sorted(client_profiles, key=lambda x: x.revenue, reverse=True)
        top3_revenue = sum(p.revenue for p in sorted_by_revenue[:3])
        top3_revenue_concentration = top3_revenue / total_revenue if total_revenue > 0 else 0
        
        sorted_by_margin = sorted(client_profiles, key=lambda x: x.contribution_margin, reverse=True)
        top3_margin = sum(p.contribution_margin for p in sorted_by_margin[:3])
        top3_margin_concentration = top3_margin / total_contribution_margin if total_contribution_margin > 0 else 0
        
        # Calculer effets volume/prix/mix (simplifié pour V1)
        volume_effect, price_effect, mix_effect = self._calculate_effects(df)
        
        # Générer diagnostic
        diagnosis, key_findings = self._generate_diagnosis(
            client_profiles, total_revenue, total_contribution_margin, destroyers
        )
        
        # Générer actions recommandées
        recommended_actions = self._generate_actions(client_profiles, destroyers)
        
        return MarginAnalysisResult(
            timestamp=datetime.now(),
            period=period,
            total_revenue=total_revenue,
            total_gross_margin=total_gross_margin,
            total_gross_margin_pct=total_gross_margin / total_revenue if total_revenue > 0 else 0,
            total_contribution_margin=total_contribution_margin,
            total_contribution_margin_pct=total_contribution_margin / total_revenue if total_revenue > 0 else 0,
            total_hidden_costs=total_hidden_costs,
            client_profiles=client_profiles,
            stars=stars,
            destroyers=destroyers,
            top3_revenue_concentration=top3_revenue_concentration,
            top3_margin_concentration=top3_margin_concentration,
            volume_effect=volume_effect,
            price_effect=price_effect,
            mix_effect=mix_effect,
            diagnosis=diagnosis,
            key_findings=key_findings,
            recommended_actions=recommended_actions
        )
    
    def _prepare_data(
        self,
        revenue_data: pd.DataFrame,
        cost_data: Optional[pd.DataFrame],
        payment_data: Optional[pd.DataFrame]
    ) -> pd.DataFrame:
        """Prépare et fusionne les données"""
        df = revenue_data.copy()
        
        # S'assurer des colonnes requises
        if 'client_id' not in df.columns:
            df['client_id'] = df.index.astype(str)
        if 'client_name' not in df.columns:
            df['client_name'] = df['client_id']
        
        # Ajouter coûts directs si pas présents
        if 'direct_costs' not in df.columns:
            if cost_data is not None and 'direct_costs' in cost_data.columns:
                df = df.merge(cost_data[['client_id', 'direct_costs']], on='client_id', how='left')
            else:
                # Estimer à 60% du CA par défaut
                df['direct_costs'] = df['revenue'] * 0.60
        
        # Ajouter données paiement si disponibles
        if payment_data is not None:
            payment_cols = ['client_id']
            if 'dso_days' in payment_data.columns:
                payment_cols.append('dso_days')
            if 'payment_reliability' in payment_data.columns:
                payment_cols.append('payment_reliability')
            if 'days_overdue' in payment_data.columns:
                payment_cols.append('days_overdue')
            
            df = df.merge(payment_data[payment_cols], on='client_id', how='left')
        
        # Valeurs par défaut
        if 'dso_days' not in df.columns:
            df['dso_days'] = 45  # DSO moyen par défaut
        if 'payment_reliability' not in df.columns:
            df['payment_reliability'] = 0.8  # 80% fiabilité par défaut
        if 'days_overdue' not in df.columns:
            df['days_overdue'] = 0
        
        # Remplir NaN
        df['direct_costs'] = df['direct_costs'].fillna(df['revenue'] * 0.60)
        df['dso_days'] = df['dso_days'].fillna(45)
        df['payment_reliability'] = df['payment_reliability'].fillna(0.8)
        df['days_overdue'] = df['days_overdue'].fillna(0)
        
        return df
    
    def _analyze_client(self, row: pd.Series, total_revenue: float) -> ClientMarginProfile:
        """Analyse un client individuel"""
        client_id = str(row['client_id'])
        client_name = str(row.get('client_name', client_id))
        revenue = float(row['revenue'])
        direct_costs = float(row['direct_costs'])
        dso_days = int(row.get('dso_days', 45))
        days_overdue = int(row.get('days_overdue', 0))
        payment_reliability = float(row.get('payment_reliability', 0.8))
        
        # Marge brute
        gross_margin = revenue - direct_costs
        gross_margin_pct = gross_margin / revenue if revenue > 0 else 0
        
        # Coûts cachés
        # 1. Coût de financement = (DSO / 365) × Revenue × Taux annuel
        financing_cost = (dso_days / 365) * revenue * self.financing_rate
        
        # 2. Coût de recouvrement (si retard)
        collection_cost = days_overdue * self.collection_cost_per_day if days_overdue > 0 else 0
        
        # 3. Coût support (proportionnel au CA, ajusté par fiabilité)
        # Clients peu fiables = plus de support
        reliability_multiplier = 1 + (1 - payment_reliability)  # 1.0 à 2.0
        support_cost = revenue * self.support_cost_ratio * reliability_multiplier
        
        hidden_costs_total = financing_cost + collection_cost + support_cost
        
        # Marge contributive réelle
        contribution_margin = gross_margin - hidden_costs_total
        contribution_margin_pct = contribution_margin / revenue if revenue > 0 else 0
        
        # Parts dans le total
        revenue_share = revenue / total_revenue if total_revenue > 0 else 0
        
        # Classification
        profitability_class = self._classify_client(
            revenue_share, contribution_margin_pct, gross_margin_pct
        )
        
        # Est-ce un destructeur de marge ?
        is_destroyer = contribution_margin < 0 or (
            revenue_share > 0.10 and contribution_margin_pct < 0.05
        )
        
        # Recommandation
        recommendation, potential_gain = self._generate_client_recommendation(
            profitability_class, revenue, contribution_margin, 
            contribution_margin_pct, dso_days, hidden_costs_total
        )
        
        return ClientMarginProfile(
            client_id=client_id,
            client_name=client_name,
            revenue=revenue,
            direct_costs=direct_costs,
            gross_margin=gross_margin,
            gross_margin_pct=gross_margin_pct,
            financing_cost=financing_cost,
            collection_cost=collection_cost,
            support_cost=support_cost,
            hidden_costs_total=hidden_costs_total,
            contribution_margin=contribution_margin,
            contribution_margin_pct=contribution_margin_pct,
            profitability_class=profitability_class,
            revenue_share_pct=revenue_share,
            margin_share_pct=0,  # Calculé après dans l'agrégation
            is_margin_destroyer=is_destroyer,
            recommendation=recommendation,
            potential_gain_if_action=potential_gain,
            dso_days=dso_days,
            payment_reliability=payment_reliability
        )
    
    def _classify_client(
        self,
        revenue_share: float,
        contribution_margin_pct: float,
        gross_margin_pct: float
    ) -> ClientProfitability:
        """Classifie un client selon sa rentabilité"""
        is_high_revenue = revenue_share >= self.HIGH_REVENUE_THRESHOLD
        is_high_margin = contribution_margin_pct >= self.HIGH_MARGIN_THRESHOLD
        is_low_margin = contribution_margin_pct < self.LOW_MARGIN_THRESHOLD
        is_negative = contribution_margin_pct < 0
        
        if is_negative:
            return ClientProfitability.DESTROYER
        elif is_high_revenue and is_high_margin:
            return ClientProfitability.STAR
        elif not is_high_revenue and is_high_margin:
            return ClientProfitability.PROMISING
        elif is_high_revenue and is_low_margin:
            return ClientProfitability.RISKY
        else:
            return ClientProfitability.CASH_COW
    
    def _generate_client_recommendation(
        self,
        profitability_class: ClientProfitability,
        revenue: float,
        contribution_margin: float,
        contribution_margin_pct: float,
        dso_days: int,
        hidden_costs: float
    ) -> Tuple[str, float]:
        """Génère recommandation et gain potentiel pour un client"""
        
        if profitability_class == ClientProfitability.DESTROYER:
            potential_gain = abs(contribution_margin) + hidden_costs * 0.5
            return (
                f"Client destructeur de valeur. Renégocier tarifs (+20%) ou résilier. "
                f"Coûts cachés: {hidden_costs:,.0f}€",
                potential_gain
            )
        
        elif profitability_class == ClientProfitability.RISKY:
            # Si on ramène DSO de X à 45j, gain = ?
            target_dso = 45
            if dso_days > target_dso:
                dso_gain = ((dso_days - target_dso) / 365) * revenue * self.financing_rate
                return (
                    f"Réduire DSO de {dso_days}j à {target_dso}j. "
                    f"Renégocier conditions paiement.",
                    dso_gain
                )
            else:
                price_increase_gain = revenue * 0.10  # +10% prix
                return (
                    f"Marge faible. Augmenter prix de 10% ou réduire services.",
                    price_increase_gain
                )
        
        elif profitability_class == ClientProfitability.PROMISING:
            potential_gain = revenue * 0.5  # Potentiel de doublement
            return (
                f"Client à développer. Bonne marge, potentiel CA. "
                f"Proposer upsell/cross-sell.",
                potential_gain
            )
        
        elif profitability_class == ClientProfitability.STAR:
            return (
                f"Client star. Fidéliser et protéger. "
                f"Surveiller la concurrence.",
                0
            )
        
        else:  # CASH_COW
            return (
                f"Client stable. Maintenir la relation. "
                f"Optimiser les coûts de service.",
                hidden_costs * 0.2
            )
    
    def _calculate_effects(self, df: pd.DataFrame) -> Tuple[float, float, float]:
        """
        Calcule les effets volume, prix et mix.
        Simplifié pour V1 - retourne 0 si pas de données historiques.
        """
        # TODO: Implémenter avec données N-1 pour comparaison
        return (0.0, 0.0, 0.0)
    
    def _generate_diagnosis(
        self,
        profiles: List[ClientMarginProfile],
        total_revenue: float,
        total_contribution: float,
        destroyers: List[str]
    ) -> Tuple[str, List[str]]:
        """Génère diagnostic textuel"""
        
        findings = []
        
        # Marge globale
        margin_pct = (total_contribution / total_revenue * 100) if total_revenue > 0 else 0
        if margin_pct < 10:
            findings.append(f"⚠️ Marge contributive critique: {margin_pct:.1f}%")
        elif margin_pct < 20:
            findings.append(f"🟡 Marge contributive faible: {margin_pct:.1f}%")
        else:
            findings.append(f"✅ Marge contributive saine: {margin_pct:.1f}%")
        
        # Destructeurs
        if destroyers:
            destroyer_revenue = sum(p.revenue for p in profiles if p.client_name in destroyers)
            destroyer_pct = (destroyer_revenue / total_revenue * 100) if total_revenue > 0 else 0
            findings.append(
                f"🔴 {len(destroyers)} client(s) destructeur(s) de valeur "
                f"({destroyer_pct:.1f}% du CA): {', '.join(destroyers[:3])}"
            )
        
        # Coûts cachés
        total_hidden = sum(p.hidden_costs_total for p in profiles)
        hidden_pct = (total_hidden / total_revenue * 100) if total_revenue > 0 else 0
        if hidden_pct > 5:
            findings.append(f"⚠️ Coûts cachés élevés: {total_hidden:,.0f}€ ({hidden_pct:.1f}% du CA)")
        
        # Concentration
        sorted_profiles = sorted(profiles, key=lambda x: x.revenue, reverse=True)
        if sorted_profiles:
            top1_pct = sorted_profiles[0].revenue_share_pct * 100
            if top1_pct > 30:
                findings.append(
                    f"🔴 Dépendance critique: {sorted_profiles[0].client_name} = {top1_pct:.0f}% du CA"
                )
        
        # Diagnostic principal
        if destroyers:
            diagnosis = (
                f"Portefeuille avec {len(destroyers)} client(s) toxique(s). "
                f"Action urgente requise pour restaurer la marge."
            )
        elif margin_pct < 15:
            diagnosis = (
                f"Marge sous pression. Revoir pricing et coûts de service. "
                f"Potentiel d'amélioration significatif."
            )
        else:
            diagnosis = (
                f"Portefeuille globalement sain. "
                f"Focus sur développement des clients prometteurs."
            )
        
        return diagnosis, findings
    
    def _generate_actions(
        self,
        profiles: List[ClientMarginProfile],
        destroyers: List[str]
    ) -> List[Dict]:
        """Génère liste d'actions prioritaires"""
        
        actions = []
        
        # Action sur destructeurs
        for profile in profiles:
            if profile.client_name in destroyers:
                actions.append({
                    "priority": "P0",
                    "type": "margin_recovery",
                    "client": profile.client_name,
                    "action": f"Renégocier ou résilier",
                    "description": profile.recommendation,
                    "potential_gain": profile.potential_gain_if_action,
                    "deadline": "Cette semaine"
                })
        
        # Actions sur clients risqués
        risky = [p for p in profiles if p.profitability_class == ClientProfitability.RISKY]
        for profile in risky[:3]:  # Top 3
            actions.append({
                "priority": "P1",
                "type": "margin_optimization",
                "client": profile.client_name,
                "action": "Optimiser conditions",
                "description": profile.recommendation,
                "potential_gain": profile.potential_gain_if_action,
                "deadline": "Sous 2 semaines"
            })
        
        # Actions sur clients prometteurs
        promising = [p for p in profiles if p.profitability_class == ClientProfitability.PROMISING]
        for profile in promising[:2]:  # Top 2
            actions.append({
                "priority": "P2",
                "type": "growth",
                "client": profile.client_name,
                "action": "Développer le compte",
                "description": profile.recommendation,
                "potential_gain": profile.potential_gain_if_action,
                "deadline": "Ce mois"
            })
        
        return actions


# ═══════════════════════════════════════════════════════════════════════════════
# TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def _test_margin_analyzer():
    """Test de l'analyseur de marge"""
    
    # Données de test
    revenue_data = pd.DataFrame({
        'client_id': ['C001', 'C002', 'C003', 'C004', 'C005'],
        'client_name': ['Acme Corp', 'TechStart', 'BigRetail', 'PME Services', 'NewClient'],
        'revenue': [150000, 45000, 280000, 35000, 12000],
        'direct_costs': [90000, 22000, 240000, 18000, 6000]
    })
    
    payment_data = pd.DataFrame({
        'client_id': ['C001', 'C002', 'C003', 'C004', 'C005'],
        'dso_days': [35, 28, 92, 75, 30],
        'payment_reliability': [0.95, 0.98, 0.45, 0.60, 0.90],
        'days_overdue': [0, 0, 45, 28, 0]
    })
    
    # Analyser
    analyzer = MarginAnalyzer()
    result = analyzer.analyze_client_margins(
        revenue_data=revenue_data,
        payment_data=payment_data,
        period="2026-02"
    )
    
    print("\n" + "="*60)
    print("MARGIN ANALYSIS TEST")
    print("="*60)
    
    print(f"\n📊 Résumé global:")
    print(f"   CA total: {result.total_revenue:,.0f}€")
    print(f"   Marge brute: {result.total_gross_margin:,.0f}€ ({result.total_gross_margin_pct*100:.1f}%)")
    print(f"   Coûts cachés: {result.total_hidden_costs:,.0f}€")
    print(f"   Marge contributive: {result.total_contribution_margin:,.0f}€ ({result.total_contribution_margin_pct*100:.1f}%)")
    
    print(f"\n⭐ Stars: {result.stars}")
    print(f"💀 Destroyers: {result.destroyers}")
    
    print(f"\n📈 Concentration:")
    print(f"   Top 3 CA: {result.top3_revenue_concentration*100:.1f}%")
    print(f"   Top 3 Marge: {result.top3_margin_concentration*100:.1f}%")
    
    print(f"\n🔍 Diagnostic: {result.diagnosis}")
    print(f"\n📋 Findings:")
    for f in result.key_findings:
        print(f"   {f}")
    
    print(f"\n🎯 Actions recommandées:")
    for action in result.recommended_actions[:5]:
        print(f"   [{action['priority']}] {action['client']}: {action['action']} (gain: {action['potential_gain']:,.0f}€)")
    
    return result


if __name__ == "__main__":
    _test_margin_analyzer()
