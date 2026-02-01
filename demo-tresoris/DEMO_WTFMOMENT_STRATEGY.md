# 🚀 TRESORIS - Stratégie de Démo "WTF Moment"

> **Objectif** : Créer une démo tellement impressionnante que les gens se demandent "Comment a-t-il réussi à faire ça ?!"
> 
> **Date** : Février 2026  
> **Statut** : Stratégie complète pour demo killer

---

## 🎯 LES 3 PILIERS DE LA DÉMO

### 1️⃣ Google Sheet Agicap-Style (Interface vivante)
### 2️⃣ Agent Tresoris Surpuissant (Contrôleur de gestion IA)
### 3️⃣ Page PWA dédiée (DAF Senior virtuel)

---

# 📊 PILIER 1 : GOOGLE SHEET ULTRA-RÉALISTE

## Benchmark Agicap (analysé)

**Ce qu'ils font :**
- Connectivité temps réel (banques + ERP)
- Prévisionnel trésorerie synchronisé
- Poste clients avec DSO réel par client
- Poste fournisseurs avec planification paiements
- Réconciliation comptable automatique
- Reporting centralisé

**Notre différentiation :**
- **Sheet → IA autonome** (pas juste un dashboard)
- **L'agent RÉAGIT** en temps réel à chaque ligne ajoutée
- **Anticipation proactive** (signaux faibles avant crise)

## Structure du Google Sheet "Trésorerie Live"

### 📋 Onglet 1 : "Factures Clients"
```
| Date Facture | N° Facture | Client          | Montant  | Date Échéance | Status      | Retard | Rating Client | DSO Moyen Client |
|--------------|------------|-----------------|----------|---------------|-------------|--------|---------------|------------------|
| 01/02/2026   | F-2026-042 | Acme Corp       | 25 000 € | 01/03/2026    | En attente  | 0j     | B             | 42j              |
| 28/01/2026   | F-2026-038 | TechStart SAS   | 8 500 €  | 27/02/2026    | En attente  | 0j     | A             | 18j              |
| 15/01/2026   | F-2026-021 | BigRetail SA    | 65 000 € | 14/02/2026    | DÉPASSÉE    | 18j    | C             | 67j              |
| 10/01/2026   | F-2026-015 | PME Services    | 12 000 € | 09/02/2026    | DÉPASSÉE    | 23j    | C             | 71j              |
```

**Colonnes calculées automatiques :**
- `Retard` : `=SI(AUJOURDHUI() > Date_Échéance; AUJOURDHUI() - Date_Échéance; 0)`
- `Status` : Formule IF conditionnelle avec couleurs
- `Rating Client` : Pull depuis onglet "Clients DB"

### 📋 Onglet 2 : "Position Trésorerie"
```
| Date       | Solde Banque | Encaissements J | Décaissements J | Solde Fin Journée | Runway | Prévision J+7 | Prévision J+30 |
|------------|--------------|-----------------|-----------------|-------------------|--------|---------------|----------------|
| 01/02/2026 | 185 000 €    | 12 500 €        | 45 000 €        | 152 500 €         | 87j    | 125 000 €     | 89 000 €       |
| 02/02/2026 | 152 500 €    | 8 500 €         | 15 200 €        | 145 800 €         | 82j    | 118 000 €     | 82 000 €       |
```

**Formules clés :**
- `Runway` : `=Solde_Banque / Charges_Mensuelles * 30`
- `Alerte visuelle` : Cellule ROUGE si Runway < 60j

### 📋 Onglet 3 : "Charges Prévisionnelles"
```
| Date       | Type         | Bénéficiaire       | Montant  | Priorité | Report possible? | Impact Runway |
|------------|--------------|---------------------|----------|----------|------------------|---------------|
| 05/02/2026 | Salaires     | Paie janvier        | 42 000 € | P0       | NON              | -23j          |
| 10/02/2026 | Fournisseur  | OVH Cloud           | 2 800 €  | P1       | 7j               | -2j           |
| 15/02/2026 | Fournisseur  | Bureau Location     | 5 500 €  | P2       | 15j              | -3j           |
| 28/02/2026 | Charges      | URSSAF              | 15 600 € | P0       | NON              | -9j           |
```

### 📋 Onglet 4 : "Dashboard Tresoris"
```
┌─────────────────────────────────────────────────────────┐
│  🎯 INDICATEURS CRITIQUES (Auto-refresh)                │
├─────────────────────────────────────────────────────────┤
│  Position actuelle       : 152 500 €                    │
│  Runway                  : 82 jours                     │
│  DSO moyen               : 58 jours (+12 vs objectif)   │
│  Taux recouvrement       : 67% (⚠️ sous objectif 80%)   │
│  Concentration top 3     : 42% (⚠️ risque)              │
│                                                          │
│  🚨 ALERTES ACTIVES (3)                                 │
│  1. BigRetail SA : 65k€ en retard 18j [CRITIQUE]       │
│  2. PME Services : Dégradation pattern paiement         │
│  3. Runway < 90j : Tension trésorerie détectée          │
│                                                          │
│  💡 ACTIONS RECOMMANDÉES PAR TRESORIS                   │
│  [P1] Relancer BigRetail immédiatement (impact +18j)   │
│  [P2] Négocier délai URSSAF +15j (impact +9j)          │
│  [P3] Reporter charges non-critiques (impact +5j)      │
└─────────────────────────────────────────────────────────┘
```

## 🔌 Connexion Google Sheets → Tresoris

### Méthode 1 : Google Apps Script (Webhook)
```javascript
// Script attaché au Google Sheet
// Extensions > Apps Script

const TRESORIS_API = "https://your-domain.com/api/tresoris/webhook";

function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const sheetName = sheet.getName();
  
  // Seulement trigger sur onglet "Factures Clients"
  if (sheetName !== "Factures Clients") return;
  
  const row = e.range.getRow();
  if (row === 1) return; // Header
  
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const payload = {
    event_type: "new_invoice",
    timestamp: new Date().toISOString(),
    data: {
      invoice_date: formatDate(rowData[0]),
      invoice_number: rowData[1],
      client_name: rowData[2],
      amount: parseFloat(rowData[3]),
      due_date: formatDate(rowData[4]),
      status: rowData[5]
    },
    metadata: {
      sheet_id: e.source.getId(),
      sheet_name: sheetName,
      row_number: row
    }
  };
  
  // Envoyer vers Tresoris
  const options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(TRESORIS_API, options);
    const result = JSON.parse(response.getContentText());
    
    // Feedback visuel dans le sheet
    if (result.alert_level === "critical") {
      sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground("#FFE5E5");
      Browser.msgBox("⚠️ ALERTE TRESORIS", result.message, Browser.Buttons.OK);
    }
    
    // Update colonne "Agent Status"
    sheet.getRange(row, 10).setValue("✅ Analysé par Tresoris");
    
  } catch (error) {
    Logger.log("Erreur Tresoris: " + error);
    sheet.getRange(row, 10).setValue("❌ Erreur analyse");
  }
}

function formatDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
}

// Trigger automatique toutes les 5 minutes (polling)
function checkForUpdates() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Factures Clients");
  const lastRow = sheet.getLastRow();
  
  // Vérifier si nouvelles lignes depuis dernier check
  const lastChecked = PropertiesService.getScriptProperties().getProperty("lastCheckedRow");
  
  if (lastRow > parseInt(lastChecked || 1)) {
    // Nouvelles lignes détectées
    const newRows = sheet.getRange(parseInt(lastChecked) + 1, 1, lastRow - parseInt(lastChecked), sheet.getLastColumn()).getValues();
    
    newRows.forEach((row, index) => {
      // Process chaque nouvelle ligne
      sendToTresoris(row, parseInt(lastChecked) + index + 1);
    });
    
    PropertiesService.getScriptProperties().setProperty("lastCheckedRow", lastRow.toString());
  }
}
```

### Méthode 2 : API Google Sheets (Backend polling)
```typescript
// src/lib/tresoris/google-sheets-watcher.ts

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class GoogleSheetsWatcher {
  private sheets: any;
  private oauth2Client: OAuth2Client;
  private lastCheckTimestamp: Date;
  private pollingInterval: NodeJS.Timeout | null = null;
  
  constructor(
    private spreadsheetId: string,
    private credentials: any
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri
    );
    
    this.oauth2Client.setCredentials(credentials.tokens);
    this.sheets = google.sheets({ version: 'v4', auth: this.oauth2Client });
    this.lastCheckTimestamp = new Date();
  }
  
  async startWatching(intervalMs: number = 5000) {
    console.log("🔍 Démarrage surveillance Google Sheet...");
    
    this.pollingInterval = setInterval(async () => {
      try {
        const newInvoices = await this.checkForNewInvoices();
        
        if (newInvoices.length > 0) {
          console.log(`✨ ${newInvoices.length} nouvelle(s) facture(s) détectée(s)`);
          
          for (const invoice of newInvoices) {
            await this.processNewInvoice(invoice);
          }
        }
      } catch (error) {
        console.error("❌ Erreur surveillance:", error);
      }
    }, intervalMs);
  }
  
  async checkForNewInvoices(): Promise<any[]> {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Factures Clients!A2:I',  // Skip header
    });
    
    const rows = response.data.values || [];
    const newInvoices: any[] = [];
    
    // Détecter nouvelles lignes (celles ajoutées après lastCheckTimestamp)
    for (const row of rows) {
      const invoiceDate = new Date(row[0]);
      
      if (invoiceDate > this.lastCheckTimestamp) {
        newInvoices.push({
          invoice_date: row[0],
          invoice_number: row[1],
          client_name: row[2],
          amount: parseFloat(row[3].replace(/[€\s]/g, '')),
          due_date: row[4],
          status: row[5],
          days_overdue: parseInt(row[6]) || 0,
          client_rating: row[7],
          client_dso: parseInt(row[8]) || 0
        });
      }
    }
    
    if (newInvoices.length > 0) {
      this.lastCheckTimestamp = new Date();
    }
    
    return newInvoices;
  }
  
  async processNewInvoice(invoice: any) {
    console.log(`📋 Traitement facture ${invoice.invoice_number}...`);
    
    // Appeler API Tresoris pour analyse
    const response = await fetch('http://localhost:5001/agent/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: invoice.client_name,
        amount: invoice.amount,
        days_overdue: invoice.days_overdue,
        due_date: invoice.due_date
      })
    });
    
    const analysis = await response.json();
    
    // Notifier via WebSocket
    this.notifyDashboard({
      type: 'new_invoice_analyzed',
      invoice: invoice,
      analysis: analysis,
      timestamp: new Date().toISOString()
    });
    
    // Update Google Sheet avec résultat analyse
    await this.updateSheetWithAnalysis(invoice.invoice_number, analysis);
  }
  
  async updateSheetWithAnalysis(invoiceNumber: string, analysis: any) {
    // Trouver la ligne de la facture
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Factures Clients!B2:B',
    });
    
    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row: any[]) => row[0] === invoiceNumber);
    
    if (rowIndex !== -1) {
      // Update colonne "Agent Status" (colonne J)
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `Factures Clients!J${rowIndex + 2}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[`✅ Analysé | Impact: ${analysis.runway_impact}j | Risque: ${analysis.risk_level}`]]
        }
      });
      
      // Si critique, ajouter couleur de fond rouge
      if (analysis.risk_level === 'critical') {
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          resource: {
            requests: [{
              repeatCell: {
                range: {
                  sheetId: 0,  // ID de l'onglet
                  startRowIndex: rowIndex + 1,
                  endRowIndex: rowIndex + 2,
                  startColumnIndex: 0,
                  endColumnIndex: 10
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 1.0,
                      green: 0.9,
                      blue: 0.9
                    }
                  }
                },
                fields: 'userEnteredFormat.backgroundColor'
              }
            }]
          }
        });
      }
    }
  }
  
  notifyDashboard(event: any) {
    // Envoyer via WebSocket vers dashboard
    // Implementation dépend de votre setup WebSocket
    console.log("📡 Notification dashboard:", event);
  }
  
  stopWatching() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      console.log("⏹️  Surveillance arrêtée");
    }
  }
}
```

## 🎬 Scénarios de Démo Killer

### Scénario 1 : "La Facture Qui Tue" 💀
**Setup** : Dashboard stable, runway 120j, tout va bien  
**Action** : Ajouter dans Google Sheet → `BigCorp SA | 150 000€ | Échéance 15/03 | En attente`

**Réaction Tresoris (< 3 secondes) :**
```
🚨 ALERTE CRITIQUE DÉTECTÉE

Nouvelle facture analysée : BigCorp SA - 150 000€

IMPACT TRÉSORERIE :
├─ Runway actuel : 120j → 78j (-42 jours) ⚠️
├─ Position minimale prévisionnelle : 18 500€ (zone rouge)
├─ Date critique : 28/02/2026 (dans 27 jours)

ANALYSE CLIENT BigCorp SA :
├─ Rating : C (risque élevé)
├─ DSO moyen historique : 78 jours
├─ Tendance : Dégradation progressive (-15j sur 6 mois)
├─ Taux retard : 67% des factures payées en retard
├─ Probabilité paiement à échéance : 12% ❌
├─ Probabilité retard >30j : 71% 🔴

SIGNAUX FAIBLES DÉTECTÉS :
1. Client a récemment espacé ses paiements (+18j entre 2 factures)
2. Concentration portefeuille : 48% sur top 3 clients (seuil 40%)
3. Saisonnalité : Mars = période historique de tensions (-15% encaissements)

ACTIONS RECOMMANDÉES (par priorité) :
┌─────────────────────────────────────────────────────────┐
│ [P0] IMMÉDIAT - Dans les 24h                            │
│ ├─ Appel téléphonique BigCorp (contact: Marie Dubois)  │
│ ├─ Demander acompte 50% = 75 000€                       │
│ └─ Impact si succès : +28j runway                       │
│                                                          │
│ [P1] CETTE SEMAINE                                      │
│ ├─ Négocier report charges URSSAF +21j                  │
│ ├─ Reporter investissement non-critique (15k€)          │
│ └─ Impact cumulé : +12j runway                          │
│                                                          │
│ [P2] SOUS 2 SEMAINES                                    │
│ ├─ Diversifier portefeuille (recruter 2 clients PME)   │
│ ├─ Activer ligne crédit 50k€ si nécessaire             │
│ └─ Impact préventif : sécurisation 45j                  │
└─────────────────────────────────────────────────────────┘

SIMULATION SCÉNARIOS :
├─ Scénario optimiste (acompte obtenu) : Runway 106j ✅
├─ Scénario nominal (paiement J+45) : Runway 78j ⚠️
├─ Scénario pessimiste (paiement J+78) : Runway 42j 🔴
└─ Probabilité zone critique (<60j) : 68%

RECOMMANDATION FINALE :
Ne pas attendre. Agir dans les 48h pour sécuriser acompte.
Sinon risque sérieux de tension mars.
```

### Scénario 2 : "L'Effet Domino" 🎲
**Setup** : 3 clients moyens, situation normale  
**Action** : Ajouter 3 factures rapidement :
- Client A : 25k€
- Client B : 30k€  
- Client C : 28k€

**Réaction Tresoris :**
```
⚠️ PATTERN INHABITUEL DÉTECTÉ

3 nouvelles factures ajoutées en 2 minutes.
Analyse consolidée en cours...

CONCENTRATION RISQUE :
├─ 83 000€ d'encours sur 3 clients
├─ Représente 54% du portefeuille total ⚠️
├─ Seuil d'alerte concentration : 40%
├─ DÉPASSEMENT : +14 points

PROFIL DES CLIENTS :
├─ Client A : Rating B | DSO 42j | Fiable ✅
├─ Client B : Rating C | DSO 68j | Risque moyen ⚠️
└─ Client C : NOUVEAU CLIENT | Pas d'historique ❓

SCÉNARIO LE PLUS PROBABLE :
Si Client B + C retardent (probabilité 68%) :
├─ Manque encaissements : 58 000€
├─ Runway : 120j → 71j
└─ Zone rouge atteinte le : 12/03/2026

ACTIONS PRÉVENTIVES :
[P0] Client C (nouveau) : Demander acompte 50% AVANT livraison
[P1] Client B : Relance préventive J-7 avant échéance
[P2] Diversification : Activer prospection pour réduire concentration
```

---

# 🤖 PILIER 2 : AGENT TRESORIS SURPUISSANT

## Capacités Actuelles (V2)

✅ **Payment Patterns** : Analyse historique clients  
✅ **Smart Forecast** : Prévisions probabilistes  
✅ **Early Warning** : Détection signaux faibles  
✅ **Client Scoring** : Rating A/B/C/D  
✅ **Action Optimizer** : Priorisation impact×facilité  
✅ **Seasonality** : Ajustements saisonniers  

## 🚀 Capacités à Ajouter (Niveau Contrôleur de Gestion Senior)

### 2.1 Cash Flow Statement Automatique
```python
# engine/cash_flow_analyzer.py

class CashFlowAnalyzer:
    """
    Génère un tableau de flux de trésorerie complet
    comme un contrôleur de gestion pro.
    """
    
    def generate_cash_flow_statement(
        self,
        period_start: datetime,
        period_end: datetime
    ) -> CashFlowStatement:
        """
        Tableau de flux complet avec 3 sections :
        - Flux opérationnels
        - Flux d'investissement
        - Flux de financement
        """
        return {
            "operating_activities": {
                "ebitda": self._calculate_ebitda(),
                "working_capital_change": self._calculate_wc_change(),
                "taxes_paid": self._get_taxes_paid(),
                "operating_cash_flow": ...  # Formule standard
            },
            "investing_activities": {
                "capex": self._get_capex(),
                "asset_sales": self._get_asset_sales(),
                "investing_cash_flow": ...
            },
            "financing_activities": {
                "debt_drawdown": self._get_debt_changes(),
                "equity_raised": self._get_equity_changes(),
                "dividends_paid": self._get_dividends(),
                "financing_cash_flow": ...
            },
            "net_cash_change": ...,
            "opening_cash": ...,
            "closing_cash": ...,
            
            # BONUS : Analyse qualitative
            "analysis": {
                "cash_conversion_score": 85,  # 0-100
                "burn_rate_trend": "stable",
                "quality_earnings": "high",  # cash vs profit alignment
                "red_flags": []
            }
        }
```

### 2.2 Working Capital Deep Dive
```python
class WorkingCapitalAnalyzer:
    """
    Analyse détaillée du BFR (Besoin en Fonds de Roulement)
    """
    
    def analyze_working_capital(self) -> Dict:
        """
        Décompose BFR en composants actionables
        """
        return {
            # Poste clients
            "receivables": {
                "total": 285000,
                "dso": 58,  # Days Sales Outstanding
                "target_dso": 45,
                "excess_days": 13,
                "cash_trapped": 85000,  # Si on passait à target
                "improvement_potential": "HIGH",
                "top_slow_payers": [...]  # Clients à cibler
            },
            
            # Stock (si applicable)
            "inventory": {
                "total": 120000,
                "dio": 35,  # Days Inventory Outstanding
                "target_dio": 28,
                "excess_days": 7,
                "cash_trapped": 22000,
                "slow_moving_items": [...]
            },
            
            # Fournisseurs
            "payables": {
                "total": 150000,
                "dpo": 42,  # Days Payables Outstanding
                "optimal_dpo": 52,  # Négociable
                "cash_optimization": 28000,  # Si on allonge
                "vendors_to_negotiate": [...]
            },
            
            # Cash Conversion Cycle
            "ccc": {
                "current": 51,  # DSO + DIO - DPO
                "target": 35,
                "industry_benchmark": 38,
                "vs_benchmark": "+13 jours (⚠️)",
                "cash_impact": 135000  # Si on atteint target
            },
            
            # Recommandations
            "quick_wins": [
                {
                    "action": "Relancer top 5 slow payers",
                    "impact": "45k€ in 7 days",
                    "effort": "low"
                },
                {
                    "action": "Négocier DPO +10j avec fournisseurs clés",
                    "impact": "28k€ runway extension",
                    "effort": "medium"
                }
            ]
        }
```

### 2.3 Variance Analysis (Écarts Réel vs Budget)
```python
class VarianceAnalyzer:
    """
    Analyse écarts réalisé vs budget/prévisions
    Comme un contrôleur de gestion classique
    """
    
    def analyze_variances(
        self,
        actual_data: pd.DataFrame,
        budget_data: pd.DataFrame,
        period: str = "monthly"
    ) -> VarianceReport:
        """
        Compare réalisé vs budget avec explications
        """
        return {
            "revenue_variance": {
                "actual": 485000,
                "budget": 520000,
                "variance": -35000,
                "variance_pct": -6.7,
                "status": "UNFAVORABLE",
                "drivers": [
                    "Client A delayed order: -25k€",
                    "Lost deal with Prospect X: -15k€",
                    "Upsell Client B: +5k€"
                ],
                "forecast_impact": "Q1 target at risk (-85k€)"
            },
            
            "cost_variance": {
                "actual": 380000,
                "budget": 365000,
                "variance": 15000,
                "variance_pct": 4.1,
                "status": "UNFAVORABLE",
                "breakdown": {
                    "salaries": {"variance": 0, "status": "ON_TARGET"},
                    "marketing": {"variance": 12000, "status": "OVER"},
                    "cloud_costs": {"variance": 3000, "status": "OVER"}
                },
                "drivers": [
                    "Marketing campaign overrun: +12k€",
                    "AWS unexpected spike: +3k€"
                ]
            },
            
            "cash_variance": {
                "actual_runway": 78,
                "budgeted_runway": 95,
                "variance_days": -17,
                "critical": True,
                "root_causes": [
                    "Revenue shortfall (-35k€)",
                    "Cost overrun (+15k€)",
                    "Client payment delays (+28k€ stuck)"
                ],
                "corrective_actions": [
                    "Freeze non-essential spending",
                    "Accelerate collections (target 45k€)",
                    "Delay capex 30 days"
                ]
            },
            
            # Analyse tendancielle
            "trends": {
                "3_month_trend": "worsening",
                "variance_volatility": "high",
                "predictability_score": 42,  # 0-100
                "recommendation": "Revoir processus budgétaire + forecast rolling"
            }
        }
```

### 2.4 Scenario Planning & Stress Tests
```python
class ScenarioPlanner:
    """
    Simulations what-if pour anticiper crises
    """
    
    def run_stress_tests(self) -> Dict:
        """
        Teste résistance à différents chocs
        """
        return {
            "baseline": {
                "runway": 95,
                "min_balance": 45000,
                "risk_level": "safe"
            },
            
            "scenario_1_revenue_shock": {
                "assumption": "Revenue -20% pendant 2 mois",
                "runway": 67,
                "min_balance": 12000,
                "risk_level": "critical",
                "probability": 0.15,
                "mitigation": "Cut costs 15% + activate credit line"
            },
            
            "scenario_2_client_default": {
                "assumption": "Top client (85k€) fait défaut",
                "runway": 52,
                "min_balance": -8000,  # NÉGATIF !
                "risk_level": "catastrophic",
                "probability": 0.05,
                "mitigation": "Immediate equity raise or bridge loan"
            },
            
            "scenario_3_payment_delays": {
                "assumption": "DSO passe de 58j à 75j",
                "runway": 71,
                "min_balance": 28000,
                "risk_level": "warning",
                "probability": 0.35,
                "mitigation": "Aggressive collections + negotiate DPO"
            },
            
            "scenario_4_growth_acceleration": {
                "assumption": "Revenue +30% mais DSO stable",
                "runway": 110,
                "min_balance": 65000,
                "risk_level": "safe",
                "note": "Attention au BFR : croissance = cash burn initial"
            },
            
            # Monte Carlo sur 1000 simulations
            "monte_carlo_summary": {
                "probability_critical": 0.23,  # 23% chance runway <60j
                "probability_safe": 0.68,
                "var_95": 58,  # Value at Risk : 95% confident runway >58j
                "expected_runway": 82
            }
        }
    
    def simulate_investment_decision(
        self,
        investment_amount: float,
        expected_roi: float,
        payback_months: int
    ) -> Dict:
        """
        Simule impact d'un investissement sur tréso
        """
        return {
            "immediate_impact": {
                "cash_out": investment_amount,
                "runway_reduction": 15,  # jours
                "new_min_balance": 32000
            },
            "projected_returns": {
                "month_3": 8000,
                "month_6": 28000,
                "month_12": 85000,
                "irr": 0.42,  # 42% annualized
                "npv": 65000
            },
            "risk_assessment": {
                "probability_breakeven": 0.78,
                "downside_scenario": "Lost investment + 6 months runway",
                "recommendation": "GO" if safe else "DEFER",
                "conditions": [
                    "Secure 50k€ credit line first",
                    "Lock in 2 new clients (30k€ ARR) before investing"
                ]
            }
        }
```

### 2.5 Benchmarking & Industry Standards
```python
class BenchmarkAnalyzer:
    """
    Compare métriques vs standards industrie
    """
    
    INDUSTRY_BENCHMARKS = {
        "saas": {
            "dso": {"p25": 35, "p50": 45, "p75": 60},
            "gross_margin": {"p25": 0.70, "p50": 0.75, "p75": 0.82},
            "burn_multiple": {"p25": 1.2, "p50": 1.5, "p75": 2.0},
            "runway_months": {"p25": 12, "p50": 18, "p75": 24},
            "cac_payback": {"p25": 12, "p50": 18, "p75": 24}
        },
        "ecommerce": {
            "dso": {"p25": 25, "p50": 35, "p75": 45},
            "gross_margin": {"p25": 0.30, "p50": 0.40, "p75": 0.50},
            "inventory_turns": {"p25": 6, "p50": 8, "p75": 12}
        },
        "manufacturing": {
            "dso": {"p25": 50, "p50": 65, "p75": 85},
            "dio": {"p25": 45, "p50": 60, "p75": 90},
            "current_ratio": {"p25": 1.2, "p50": 1.5, "p75": 2.0}
        }
    }
    
    def benchmark_company(
        self,
        company_metrics: Dict,
        industry: str
    ) -> BenchmarkReport:
        """
        Positionne entreprise vs concurrents
        """
        benchmarks = self.INDUSTRY_BENCHMARKS[industry]
        
        return {
            "dso_analysis": {
                "company_value": 58,
                "industry_p50": benchmarks["dso"]["p50"],
                "percentile_rank": 62,  # Pire que 62% du marché
                "verdict": "BELOW_AVERAGE",
                "improvement_target": benchmarks["dso"]["p50"],
                "cash_opportunity": "45k€ si atteinte P50"
            },
            
            "overall_health_score": {
                "score": 68,  # /100
                "vs_industry_avg": -12,
                "grade": "C+",
                "strengths": [
                    "Gross margin P75 (excellent)",
                    "Burn multiple P40 (bon)"
                ],
                "weaknesses": [
                    "DSO P62 (mauvais)",
                    "Runway P30 (sous-optimal)"
                ],
                "priority_improvements": [
                    "Collections process (impact: +15 pts)",
                    "Working capital optimization (impact: +8 pts)"
                ]
            }
        }
```

### 2.6 LLM-Powered Insights (GPT-4 contextuel)
```python
class TresorisLLM:
    """
    Génère analyses textuelles niveau DAF Senior
    """
    
    def generate_executive_summary(
        self,
        financial_data: Dict,
        context: str = "monthly_review"
    ) -> str:
        """
        Rédige note de synthèse comme un DAF
        """
        
        prompt = f"""
Tu es un DAF senior avec 15 ans d'expérience.
Rédige une note de trésorerie pour le CEO.

Données actuelles :
- Position cash : {financial_data['cash_balance']}€
- Runway : {financial_data['runway']} jours
- DSO : {financial_data['dso']} jours
- Encours clients : {financial_data['ar_total']}€
- Top risques : {financial_data['top_risks']}

Contexte : {context}

Style attendu :
- Synthétique (max 300 mots)
- Chiffré et factuel
- 3 sections : Situation / Risques / Actions
- Ton professionnel mais direct
- Pas de jargon inutile
"""
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Tu es un DAF senior expert en trésorerie."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,  # Factuel, peu créatif
            max_tokens=500
        )
        
        return response.choices[0].message.content
    
    # Exemple de sortie :
    """
    SITUATION TRÉSORERIE - Février 2026
    
    Position actuelle : 152k€ (-18% vs janvier)
    Runway : 82 jours (zone orange, seuil alerte 90j)
    
    TENSION IDENTIFIÉE
    Le DSO a dérivé à 58j (+12j vs objectif). Cause principale : 
    2 clients majeurs (BigRetail 65k€, PME Services 12k€) cumulent 
    41j de retard moyen. Impact : 77k€ bloqués qui devraient être 
    en banque.
    
    RISQUES IMMÉDIATS
    1. BigRetail (65k€, retard 18j) : historique dégradé, probabilité 
       paiement mars seulement 45%. Si glissement avril → runway tombe 
       à 64j (rouge).
    2. Concentration : Top 3 clients = 48% portefeuille (seuil 40%). 
       Fragilité structurelle.
    
    PLAN D'ACTION (priorités)
    [CETTE SEMAINE]
    - Appel CEO BigRetail (contact direct, escalade)
    - Exiger acompte 50% ou paiement partiel immédiat
    - Objectif : débloquer 30k€ minimum
    
    [SOUS 10 JOURS]
    - Négocier URSSAF : report charges 21j (+15k€ respiratio)
    - Geler investissements non-critiques (budget 25k€)
    
    Si actions réussies : runway remonte à 95j (vert).
    Sans action : risque sérieux mi-mars.
    
    Recommandation : Traiter BigRetail en urgence absolue.
    """
```

## 📊 Tableau Comparatif : Avant / Après

| Capacité | Agent V1 (Actuel) | Agent V2 (Objectif) |
|----------|-------------------|---------------------|
| **Analyse clients** | DSO moyen, retards | Patterns, trends, scoring, probabilités |
| **Prévisions** | Scénario unique | 3 scénarios + Monte Carlo + confidence |
| **Actions** | Liste générique | Priorisées (impact×facilité), chiffrées |
| **Reporting** | JSON brut | Cash Flow Statement, Variance Analysis, Executive Summary |
| **Working Capital** | Calcul DSO | BFR détaillé, DIO, DPO, CCC, optimisations |
| **Benchmarking** | ❌ Absent | ✅ Industrie, percentiles, gap analysis |
| **Stress Tests** | ❌ Absent | ✅ 5+ scénarios, Monte Carlo, VaR |
| **LLM Integration** | ❌ Absent | ✅ Notes DAF-style, contextuelles, prose pro |
| **Niveau expertise** | Junior analyst | **Senior controller / DAF** |

---

# 🎨 PILIER 3 : PAGE PWA DÉDIÉE "TRESORIS LIVE"

## Concept : Interface conversationnelle avec agent DAF

### Design visuel

```
┌─────────────────────────────────────────────────────────────────┐
│  TRESORIS                                   🟢 Agent actif      │
│  Surveillance Trésorerie Autonome                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  💼 Michel Trésoris - DAF Senior IA                      │  │
│  │  ────────────────────────────────────────────────────────│  │
│  │                                                           │  │
│  │  [Avatar animé style Midjourney : homme 50 ans,         │  │
│  │   costume gris, lunettes, air bienveillant mais sérieux]│  │
│  │                                                           │  │
│  │  "Bonjour. Je surveille votre trésorerie en continu.    │  │
│  │   Actuellement, tout est sous contrôle."                 │  │
│  │                                                           │  │
│  │  Position : 152 500€ | Runway : 82 jours ⚠️              │  │
│  │  Dernière analyse : Il y a 3 minutes                     │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────┐        │  │
│  │  │  🚨 1 alerte active                          │        │  │
│  │  │  BigRetail SA : 65k€ en retard 18 jours     │        │  │
│  │  │                                              │        │  │
│  │  │  [Voir détails] [Que faire ?]               │        │  │
│  │  └─────────────────────────────────────────────┘        │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  💬 Chat avec Michel                                      │  │
│  │  ──────────────────────────────────────────────────────  │  │
│  │                                                           │  │
│  │  Vous : "Que se passe-t-il si BigRetail paie en avril ?" │  │
│  │                                                           │  │
│  │  Michel : "J'ai simulé ce scénario. Si BigRetail        │  │
│  │           glisse à avril :                                │  │
│  │                                                           │  │
│  │           • Votre runway tombe à 64 jours                │  │
│  │           • Position minimale : 12 400€ (zone rouge)     │  │
│  │           • Date critique : 18 mars                      │  │
│  │                                                           │  │
│  │           Je recommande VIVEMENT d'appeler leur DAF      │  │
│  │           cette semaine. Demandez un acompte 50%.        │  │
│  │                                                           │  │
│  │           Voulez-vous que je vous prépare un script      │  │
│  │           de relance ?"                                   │  │
│  │                                                           │  │
│  │  [Oui, prépare le script] [Simule autre scénario]       │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📊 Dashboard Live                                        │  │
│  │  ──────────────────────────────────────────────────────  │  │
│  │                                                           │  │
│  │  [Graphique temps réel : Position tréso J-30 → J+30]    │  │
│  │  [Graphique : Top 5 clients à risque avec barres]       │  │
│  │  [Timeline : Prochains mouvements majeurs]              │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🎯 Actions proposées par Michel                          │  │
│  │  ──────────────────────────────────────────────────────  │  │
│  │                                                           │  │
│  │  ✅ [P0] Relancer BigRetail (fait il y a 2h)             │  │
│  │  🔄 [P1] Négocier URSSAF (en attente validation)         │  │
│  │  ⏳ [P2] Diversifier portefeuille (deadline: 15/02)      │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Fonctionnalités Wow

### 1. Notifications Push (PWA)
```typescript
// Alerte temps réel quand nouvelle ligne Google Sheet
"🚨 Nouvelle facture détectée : Acme Corp 25k€
Impact runway : -12 jours
Michel a détecté un risque moyen.
[Ouvrir Tresoris]"
```

### 2. Mode Voice (Speech-to-Text)
```
Vous : "Michel, dis-moi la situation"

Michel (voix synthétique pro) : 
"Situation stable. Position 152k, runway 82 jours. 
Une alerte active sur BigRetail. Voulez-vous les détails ?"
```

### 3. Rapports PDF générés par l'agent
```
Michel génère automatiquement :
- Note hebdomadaire CEO (1 page)
- Rapport trésorerie mensuel (5 pages)
- Tableau de bord investisseurs
```

### 4. Mode "Explain Like I'm 5"
```
CEO : "Michel, explique-moi le DSO comme si j'avais 5 ans"

Michel : "Imaginez que vous prêtez des jouets à vos amis.
Le DSO, c'est le temps moyen qu'ils mettent à vous les rendre.
Là, vos amis mettent 58 jours. C'est un peu long.
Si ils rendaient plus vite (45 jours), vous auriez 45 000€ 
de plus pour acheter de nouveaux jouets (investir).
C'est pour ça qu'on doit leur rappeler gentiment."
```

### 5. Timeline Interactive
```
Visualisation type "Gantt" :
├─ 01/02 : Position actuelle (152k€)
├─ 05/02 : Salaires -42k€ → 110k€
├─ 10/02 : Encaissement prévu TechStart +8.5k€ → 118.5k€
├─ 15/02 : ⚠️ BigRetail devrait payer (65k€) mais risque retard
├─ 28/02 : URSSAF -15.6k€ → Tension
└─ 15/03 : DATE CRITIQUE si pas encaissement

Cliquer sur chaque événement → Michel explique
```

---

# 🎬 SCÉNARIO DE DÉMO COMPLET (15 minutes)

## Minute 0-2 : Introduction
**Vous** : "Je vais vous montrer Tresoris, mon agent DAF autonome."

**Action** : Ouvrir page PWA Tresoris  
**Effet** : Avatar Michel apparaît, dit "Bonjour, je surveille activement 3 entreprises"

## Minute 2-5 : Situation normale
**Vous** : "Voici la situation d'une PME SaaS. Tout va bien."  
**Dashboard** : 
- Runway 120j (vert)
- 0 alerte
- Michel : "Situation stable, aucune action requise"

**Vous** : "Michel, fais-moi un point tréso rapide"  
**Michel** (vocal) : 
"Position 285k€, runway confortable 120 jours. DSO légèrement 
au-dessus objectif mais pas inquiétant. Prochain mouvement 
majeur : salaires dans 3 jours."

## Minute 5-8 : Le choc (Google Sheet)
**Vous** : "Un gros client vient de commander. J'ajoute la facture."

**Action** : Ouvrir Google Sheet, ajouter ligne :
```
MegaCorp | 180 000€ | Échéance 15/03 | En attente
```

**Effet immédiat (< 5 secondes)** :
1. Notification push sur votre téléphone 🔔
2. Page Tresoris : Michel change d'expression (sérieux)
3. Alerte rouge apparaît

**Michel** (animation vocale) :
"⚠️ Attention. Nouvelle facture 180k€ analysée.
J'ai détecté plusieurs risques. Regardons ensemble."

**Dashboard s'anime** :
- Runway : 120j → 73j (-47 jours) 🔴
- Graphique position : chute visible en mars
- MegaCorp apparaît dans "Clients à risque" avec rating D

**Michel explique** :
"MegaCorp représente maintenant 52% de votre portefeuille.
C'est beaucoup trop. Leur historique de paiement est mauvais :
DSO moyen 89 jours, 78% des factures payées en retard.
Probabilité qu'ils paient à temps ? Seulement 8%.
Si ils glissent à mai, vous êtes en zone rouge fin mars."

## Minute 8-11 : L'intelligence de l'agent
**Vous** : "Michel, que dois-je faire ?"

**Michel affiche Plan d'action** :
```
[P0] CETTE SEMAINE - Critique
├─ Appel CEO MegaCorp (contact: Jean Dupont, 06...)
├─ Exiger acompte 50% avant livraison = 90k€
├─ Si refus : revoir conditions (paiement comptant ou annuler)
└─ Impact si succès : runway remonte à 98j ✅

[P1] SOUS 10 JOURS - Important
├─ Activer ligne crédit 80k€ en backup
├─ Négocier report URSSAF +21j
└─ Impact cumulé : +15j runway

[P2] CE MOIS - Stratégique
├─ Diversifier portefeuille (recruter 3 clients PME)
├─ Objectif : aucun client >25% du CA
└─ Impact : résilience long terme
```

**Vous** : "Simule si j'obtiens l'acompte"

**Michel** (calcul temps réel) :
"Avec acompte 90k€ encaissé le 10/02 :
• Runway : 98 jours (safe)
• Position minimale : 58k€ (correct)
• Risque résiduel : moyen (surveiller les 90k€ restants)
Scénario acceptable. Je recommande cette approche."

## Minute 11-13 : Deep Dive
**Vous** : "Michel, fais-moi une vraie analyse contrôleur de gestion"

**Michel génère rapport live** :
```
WORKING CAPITAL ANALYSIS
========================

Current situation:
├─ DSO : 58 jours (vs objectif 45j)
├─ Cash trapped in AR : 125k€
├─ CCC (Cash Conversion Cycle) : 51 jours
└─ Industry benchmark (SaaS) : 38 jours

GAP : +13 jours = 68k€ surconsommation cash

Top opportunities:
1. Top 5 slow payers : 85k€, avg 78j DSO
   → Collections process + relances : 45k€ libérables
   
2. Négocier DPO fournisseurs de 42j à 52j
   → 28k€ runway extension
   
3. Factoring MegaCorp (si acompte refusé)
   → 150k€ immédiat, coût 3.5% = 6.3k€

STRESS TESTS
============
J'ai simulé 1000 scénarios Monte Carlo.

Probabilités :
├─ Situation safe (runway >90j) : 58%
├─ Zone warning (60-90j) : 28%
└─ Zone critique (<60j) : 14% ⚠️

Recommandation : Sécuriser acompte = probabilité critique 
tombe à 3%.
```

**Effet** : Audience impressionnée par niveau de détail

## Minute 13-15 : Closer
**Vous** : "Michel, rédige-moi la note pour mon CEO"

**Michel génère (GPT-4)** :
```
NOTE TRÉSORERIE - Février 2026

SITUATION
Commande majeure MegaCorp (180k€) change la donne.
Position passe de confortable (120j runway) à tendue (73j).

RISQUE IDENTIFIÉ
MegaCorp = 52% du portefeuille. Profil payeur mauvais 
(DSO 89j, fiabilité 22%). Si glissement paiement, 
tension sérieuse mi-mars.

DÉCISION REQUISE CETTE SEMAINE
Négocier acompte 50% (90k€) AVANT livraison.
Alternative : revoir conditions ou refuser commande.

Sans acompte : risque cash 14% (inacceptable).
Avec acompte : risque cash 3% (gérable).

Je recommande d'appeler Jean Dupont (CEO MegaCorp) 
directement demain matin.

Michel Trésoris
Agent DAF Autonome
```

**Vous** : "Et voilà. Tresoris."

**Effet final** : Public sous le choc. "WTF moment" atteint.

---

# 🎯 RÉCAPITULATIF : Pourquoi c'est impressionnant

## 10 "Wow Moments" garantis

1. **Sheet → Agent réaction < 5 sec** (temps réel bluffant)
2. **Rating client instantané** (A/B/C/D avec justification)
3. **Calcul runway précis** (impact au jour près)
4. **Plans d'action chiffrés** (pas du blabla, des €)
5. **Simulations interactives** (what-if en live)
6. **Analyse contrôleur de gestion** (Working Capital, CCC, etc.)
7. **Stress tests Monte Carlo** (sophistication math)
8. **Avatar qui parle** (humanisation)
9. **Rédaction notes DAF** (prose professionnelle)
10. **PWA avec push** (native app experience)

## Ce que personne d'autre ne fait

❌ **Agicap** : Dashboard statique, pas d'IA décisionnelle  
❌ **Fygr** : Prévisions simples, pas de requalification  
❌ **Pennylane** : Compta, pas de tréso prédictive  

✅ **Tresoris** : 
- Agent **autonome** qui pense
- **Réagit** en temps réel aux données
- **Explique** ses raisonnements
- **Propose** des actions concrètes
- **Anticipe** 4-8 semaines avant
- Niveau expertise **DAF Senior**

---

# 📅 ROADMAP IMPLÉMENTATION (4 semaines)

## Semaine 1 : Google Sheet + Webhook
- [ ] Template Google Sheet Agicap-style
- [ ] Google Apps Script webhook
- [ ] Endpoint API `/webhook/google-sheets`
- [ ] Tests ajout facture → réaction agent

## Semaine 2 : Agent V2 Capacités
- [ ] Cash Flow Analyzer
- [ ] Working Capital Analyzer
- [ ] Variance Analyzer
- [ ] Scenario Planner
- [ ] Benchmark Analyzer
- [ ] Integration GPT-4 pour prose

## Semaine 3 : Page PWA
- [ ] Design interface Michel avatar
- [ ] Chat conversationnel
- [ ] Dashboard live
- [ ] Notifications push
- [ ] Mode voice (optionnel)

## Semaine 4 : Polish & Démo
- [ ] Scénarios de démo scriptés
- [ ] Données de test réalistes
- [ ] Transitions animations smooth
- [ ] Vidéo teaser 60 secondes
- [ ] Landing page dédiée

---

# 💰 IMPACT BUSINESS ATTENDU

**Réactions cibles** :
- "Comment as-tu fait ça ?!" ✅
- "C'est de la vraie IA, pas du fake" ✅
- "Je veux ça pour ma boîte" ✅
- "Combien tu factures ?" ✅

**Positionnement** :
- Pas un "dashboard de plus"
- Pas un "outil tréso"
- Un **DAF virtuel** qui travaille 24/7

**Pricing indicatif** :
- Solo / PME : 199€/mois (vs DAF temps partiel 2000€/mois)
- Scale-up : 499€/mois
- Entreprise : 999€/mois + intégrations

**ROI client** :
- Économie 1 ETP contrôleur : 50k€/an
- Évite 1 crise tréso : 100k€+
- Optimisation BFR : 50-200k€ cash libéré

---

# 🚀 NEXT STEPS IMMÉDIATS

1. **Valider cette vision avec toi**
2. **Prioriser les 3 quick wins** (impact max, effort min)
3. **Commencer par le Google Sheet** (fondation)
4. **Prototyper interface Michel** (design puis code)
5. **Tourner vidéo démo 60 sec** (pour teasing)

**Deadline cible** : 28 février 2026 (4 semaines)

---

**Tu es prêt à construire ça ? 🔥**
