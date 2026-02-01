/**
 * TRESORIS - Google Sheets Integration
 * =====================================
 * 
 * Script Apps Script pour connecter un Google Sheet à l'agent TRESORIS.
 * 
 * FONCTIONNALITÉS:
 * - Détection automatique des modifications
 * - Envoi des données à l'API TRESORIS
 * - Réception et affichage des alertes
 * - Dashboard temps réel dans le Sheet
 * 
 * INSTALLATION:
 * 1. Ouvrir le Google Sheet
 * 2. Extensions > Apps Script
 * 3. Coller ce code
 * 4. Configurer TRESORIS_API_URL et API_KEY
 * 5. Exécuter setupTriggers()
 * 
 * @author TRESORIS Team
 * @version 1.0.0
 * @date Février 2026
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // URL de l'API TRESORIS (à configurer)
  TRESORIS_API_URL: "https://your-api.finsights.io/api/v1",
  
  // Clé API (à configurer dans les propriétés du script)
  // PropertiesService.getScriptProperties().setProperty('TRESORIS_API_KEY', 'your-key')
  
  // Noms des onglets
  SHEETS: {
    FACTURES: "Factures",
    ENCAISSEMENTS: "Encaissements", 
    PARAMETRES: "Paramètres",
    ALERTES: "Alertes TRESORIS",
    DASHBOARD: "Dashboard"
  },
  
  // Délai minimum entre deux analyses (en minutes)
  ANALYSIS_COOLDOWN: 5,
  
  // Mode debug
  DEBUG: true
};


// ═══════════════════════════════════════════════════════════════════════════════
// SETUP & TRIGGERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialise le Google Sheet avec la structure TRESORIS
 * À exécuter une seule fois lors de la première installation
 */
function setupTresorisSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Créer l'onglet Factures
  let facturesSheet = ss.getSheetByName(CONFIG.SHEETS.FACTURES);
  if (!facturesSheet) {
    facturesSheet = ss.insertSheet(CONFIG.SHEETS.FACTURES);
  }
  setupFacturesSheet(facturesSheet);
  
  // 2. Créer l'onglet Encaissements
  let encaissementsSheet = ss.getSheetByName(CONFIG.SHEETS.ENCAISSEMENTS);
  if (!encaissementsSheet) {
    encaissementsSheet = ss.insertSheet(CONFIG.SHEETS.ENCAISSEMENTS);
  }
  setupEncaissementsSheet(encaissementsSheet);
  
  // 3. Créer l'onglet Paramètres
  let paramsSheet = ss.getSheetByName(CONFIG.SHEETS.PARAMETRES);
  if (!paramsSheet) {
    paramsSheet = ss.insertSheet(CONFIG.SHEETS.PARAMETRES);
  }
  setupParametresSheet(paramsSheet);
  
  // 4. Créer l'onglet Alertes
  let alertesSheet = ss.getSheetByName(CONFIG.SHEETS.ALERTES);
  if (!alertesSheet) {
    alertesSheet = ss.insertSheet(CONFIG.SHEETS.ALERTES);
  }
  setupAlertesSheet(alertesSheet);
  
  // 5. Créer l'onglet Dashboard
  let dashboardSheet = ss.getSheetByName(CONFIG.SHEETS.DASHBOARD);
  if (!dashboardSheet) {
    dashboardSheet = ss.insertSheet(CONFIG.SHEETS.DASHBOARD);
  }
  setupDashboardSheet(dashboardSheet);
  
  // 6. Configurer les triggers
  setupTriggers();
  
  SpreadsheetApp.getUi().alert(
    "TRESORIS Setup Complete",
    "Le Google Sheet est maintenant connecté à TRESORIS.\n\n" +
    "Prochaines étapes:\n" +
    "1. Configurer votre API Key dans l'onglet Paramètres\n" +
    "2. Importer vos factures\n" +
    "3. TRESORIS analysera automatiquement les changements",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}


/**
 * Configure les triggers automatiques
 */
function setupTriggers() {
  // Supprimer les anciens triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onEditTrigger' || 
        trigger.getHandlerFunction() === 'scheduledAnalysis') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Trigger sur modification
  ScriptApp.newTrigger('onEditTrigger')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
  
  // Trigger horaire pour analyse planifiée
  ScriptApp.newTrigger('scheduledAnalysis')
    .timeBased()
    .everyHours(1)
    .create();
  
  log("Triggers configurés avec succès");
}


// ═══════════════════════════════════════════════════════════════════════════════
// STRUCTURE DES ONGLETS
// ═══════════════════════════════════════════════════════════════════════════════

function setupFacturesSheet(sheet) {
  const headers = [
    "ID Facture",
    "Date Facture", 
    "Client",
    "Montant HT",
    "TVA",
    "Montant TTC",
    "Date Échéance",
    "Statut",
    "Date Paiement",
    "Montant Payé",
    "Jours Retard",
    "Catégorie",
    "Notes"
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground("#1e3a5f")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  
  // Largeurs de colonnes
  sheet.setColumnWidth(1, 100);  // ID
  sheet.setColumnWidth(2, 100);  // Date
  sheet.setColumnWidth(3, 150);  // Client
  sheet.setColumnWidth(4, 100);  // Montant HT
  sheet.setColumnWidth(5, 80);   // TVA
  sheet.setColumnWidth(6, 100);  // TTC
  sheet.setColumnWidth(7, 100);  // Échéance
  sheet.setColumnWidth(8, 100);  // Statut
  sheet.setColumnWidth(9, 100);  // Date Paiement
  sheet.setColumnWidth(10, 100); // Montant Payé
  sheet.setColumnWidth(11, 80);  // Jours Retard
  sheet.setColumnWidth(12, 100); // Catégorie
  sheet.setColumnWidth(13, 200); // Notes
  
  // Validation pour Statut
  const statutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["En attente", "Payée", "En retard", "Litige", "Annulée"], true)
    .build();
  sheet.getRange("H2:H1000").setDataValidation(statutRule);
  
  // Format dates
  sheet.getRange("B2:B1000").setNumberFormat("dd/mm/yyyy");
  sheet.getRange("G2:G1000").setNumberFormat("dd/mm/yyyy");
  sheet.getRange("I2:I1000").setNumberFormat("dd/mm/yyyy");
  
  // Format monétaires
  sheet.getRange("D2:D1000").setNumberFormat("#,##0.00 €");
  sheet.getRange("E2:E1000").setNumberFormat("#,##0.00 €");
  sheet.getRange("F2:F1000").setNumberFormat("#,##0.00 €");
  sheet.getRange("J2:J1000").setNumberFormat("#,##0.00 €");
  
  // Figer la première ligne
  sheet.setFrozenRows(1);
}


function setupEncaissementsSheet(sheet) {
  const headers = [
    "Date",
    "Référence",
    "Client",
    "Montant",
    "Mode Paiement",
    "Facture(s) Associée(s)",
    "Notes"
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground("#1e3a5f")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  
  sheet.getRange("A2:A1000").setNumberFormat("dd/mm/yyyy");
  sheet.getRange("D2:D1000").setNumberFormat("#,##0.00 €");
  
  sheet.setFrozenRows(1);
}


function setupParametresSheet(sheet) {
  const params = [
    ["CONFIGURATION TRESORIS", ""],
    ["", ""],
    ["API Key", ""],
    ["URL API", CONFIG.TRESORIS_API_URL],
    ["Email Alertes", ""],
    ["", ""],
    ["PARAMÈTRES ENTREPRISE", ""],
    ["Nom Entreprise", ""],
    ["Secteur", ""],
    ["Seuil Alerte Cash (€)", "50000"],
    ["DSO Cible (jours)", "45"],
    ["", ""],
    ["NOTIFICATIONS", ""],
    ["Alertes Email", "OUI"],
    ["Alertes Sheet", "OUI"],
    ["Fréquence Analyse", "À chaque modification"]
  ];
  
  sheet.getRange(1, 1, params.length, 2).setValues(params);
  
  // Style headers
  sheet.getRange("A1").setBackground("#1e3a5f").setFontColor("#ffffff").setFontWeight("bold");
  sheet.getRange("A7").setBackground("#1e3a5f").setFontColor("#ffffff").setFontWeight("bold");
  sheet.getRange("A13").setBackground("#1e3a5f").setFontColor("#ffffff").setFontWeight("bold");
  
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 300);
}


function setupAlertesSheet(sheet) {
  const headers = [
    "Date/Heure",
    "Niveau",
    "Type",
    "Message",
    "Client Concerné",
    "Impact Estimé",
    "Action Recommandée",
    "Statut"
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground("#1e3a5f")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  
  sheet.setColumnWidth(1, 140);
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 300);
  sheet.setColumnWidth(5, 150);
  sheet.setColumnWidth(6, 120);
  sheet.setColumnWidth(7, 250);
  sheet.setColumnWidth(8, 100);
  
  sheet.setFrozenRows(1);
}


function setupDashboardSheet(sheet) {
  sheet.getRange("A1").setValue("TRESORIS DASHBOARD")
    .setFontSize(18)
    .setFontWeight("bold")
    .setFontColor("#1e3a5f");
  
  sheet.getRange("A2").setValue("Dernière mise à jour: " + new Date().toLocaleString("fr-FR"));
  
  // KPIs
  const kpis = [
    ["", "", "", ""],
    ["INDICATEURS CLÉS", "", "", ""],
    ["Position Cash", "=SOMME(Encaissements!D:D)-SOMME(Factures!F:F)+SOMME(Factures!J:J)", "", ""],
    ["Factures en attente", "=NB.SI(Factures!H:H;\"En attente\")", "factures", ""],
    ["Factures en retard", "=NB.SI(Factures!H:H;\"En retard\")", "factures", ""],
    ["Montant en retard", "=SOMME.SI(Factures!H:H;\"En retard\";Factures!F:F)", "", ""],
    ["DSO Moyen", "", "jours", ""],
    ["", "", "", ""],
    ["TOP 5 CLIENTS EN RETARD", "", "", ""],
  ];
  
  sheet.getRange(3, 1, kpis.length, 4).setValues(kpis);
  
  sheet.getRange("A4").setBackground("#1e3a5f").setFontColor("#ffffff").setFontWeight("bold");
  sheet.getRange("A11").setBackground("#1e3a5f").setFontColor("#ffffff").setFontWeight("bold");
  
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 150);
}


// ═══════════════════════════════════════════════════════════════════════════════
// EVENT HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Déclenché à chaque modification du Sheet
 */
function onEditTrigger(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const sheetName = sheet.getName();
    
    // Ne réagir qu'aux onglets de données
    if (sheetName !== CONFIG.SHEETS.FACTURES && 
        sheetName !== CONFIG.SHEETS.ENCAISSEMENTS) {
      return;
    }
    
    // Vérifier le cooldown
    const lastAnalysis = PropertiesService.getScriptProperties().getProperty('LAST_ANALYSIS');
    if (lastAnalysis) {
      const lastTime = new Date(lastAnalysis);
      const now = new Date();
      const diffMinutes = (now - lastTime) / (1000 * 60);
      
      if (diffMinutes < CONFIG.ANALYSIS_COOLDOWN) {
        log(`Cooldown actif (${Math.round(CONFIG.ANALYSIS_COOLDOWN - diffMinutes)} min restantes)`);
        return;
      }
    }
    
    // Lancer l'analyse
    log(`Modification détectée dans ${sheetName} - Lancement analyse TRESORIS`);
    triggerTresorisAnalysis();
    
  } catch (error) {
    log(`Erreur onEdit: ${error.message}`, "ERROR");
  }
}


/**
 * Analyse planifiée (toutes les heures)
 */
function scheduledAnalysis() {
  log("Analyse planifiée démarrée");
  triggerTresorisAnalysis();
}


// ═══════════════════════════════════════════════════════════════════════════════
// COMMUNICATION API TRESORIS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Déclenche une analyse TRESORIS
 */
function triggerTresorisAnalysis() {
  try {
    // Récupérer les données
    const data = collectSheetData();
    
    // Appeler l'API
    const result = callTresorisAPI("/webhook/gsheet", data);
    
    if (result.success) {
      // Afficher les alertes
      if (result.alerts && result.alerts.length > 0) {
        addAlertsToSheet(result.alerts);
      }
      
      // Mettre à jour le dashboard
      if (result.dashboard) {
        updateDashboard(result.dashboard);
      }
      
      // Enregistrer timestamp
      PropertiesService.getScriptProperties().setProperty('LAST_ANALYSIS', new Date().toISOString());
      
      log(`Analyse terminée: ${result.alerts?.length || 0} alertes`);
    } else {
      log(`Erreur API: ${result.error}`, "ERROR");
    }
    
  } catch (error) {
    log(`Erreur analyse: ${error.message}`, "ERROR");
  }
}


/**
 * Collecte toutes les données du Sheet
 */
function collectSheetData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Factures
  const facturesSheet = ss.getSheetByName(CONFIG.SHEETS.FACTURES);
  const facturesData = facturesSheet.getDataRange().getValues();
  const facturesHeaders = facturesData[0];
  const factures = facturesData.slice(1).filter(row => row[0]).map(row => {
    const obj = {};
    facturesHeaders.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
  
  // Encaissements
  const encaissementsSheet = ss.getSheetByName(CONFIG.SHEETS.ENCAISSEMENTS);
  const encaissementsData = encaissementsSheet.getDataRange().getValues();
  const encaissementsHeaders = encaissementsData[0];
  const encaissements = encaissementsData.slice(1).filter(row => row[0]).map(row => {
    const obj = {};
    encaissementsHeaders.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
  
  // Paramètres
  const paramsSheet = ss.getSheetByName(CONFIG.SHEETS.PARAMETRES);
  const paramsData = paramsSheet.getDataRange().getValues();
  const params = {};
  paramsData.forEach(row => {
    if (row[0] && row[1]) {
      params[row[0]] = row[1];
    }
  });
  
  return {
    timestamp: new Date().toISOString(),
    spreadsheet_id: ss.getId(),
    spreadsheet_name: ss.getName(),
    factures: factures,
    encaissements: encaissements,
    parametres: params,
    stats: {
      total_factures: factures.length,
      total_encaissements: encaissements.length,
      factures_en_attente: factures.filter(f => f["Statut"] === "En attente").length,
      factures_en_retard: factures.filter(f => f["Statut"] === "En retard").length,
      montant_total_factures: factures.reduce((sum, f) => sum + (parseFloat(f["Montant TTC"]) || 0), 0),
      montant_en_retard: factures.filter(f => f["Statut"] === "En retard")
        .reduce((sum, f) => sum + (parseFloat(f["Montant TTC"]) || 0), 0)
    }
  };
}


/**
 * Appelle l'API TRESORIS
 */
function callTresorisAPI(endpoint, data) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('TRESORIS_API_KEY');
  
  if (!apiKey) {
    return { success: false, error: "API Key non configurée" };
  }
  
  const url = CONFIG.TRESORIS_API_URL + endpoint;
  
  const options = {
    method: "POST",
    contentType: "application/json",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "X-Source": "google-sheets",
      "X-Spreadsheet-ID": SpreadsheetApp.getActiveSpreadsheet().getId()
    },
    payload: JSON.stringify(data),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (responseCode === 200) {
      return { success: true, ...JSON.parse(responseText) };
    } else {
      return { success: false, error: `HTTP ${responseCode}: ${responseText}` };
    }
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// AFFICHAGE DES RÉSULTATS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Ajoute les alertes TRESORIS dans l'onglet dédié
 */
function addAlertsToSheet(alerts) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEETS.ALERTES);
  
  if (!sheet) return;
  
  alerts.forEach(alert => {
    const row = [
      new Date(),
      alert.level || "INFO",
      alert.type || "Analyse",
      alert.message || "",
      alert.client || "",
      alert.impact || "",
      alert.action || "",
      "Nouveau"
    ];
    
    sheet.appendRow(row);
    
    // Colorer selon le niveau
    const lastRow = sheet.getLastRow();
    const levelCell = sheet.getRange(lastRow, 2);
    
    switch (alert.level) {
      case "CRITICAL":
        levelCell.setBackground("#fee2e2").setFontColor("#dc2626");
        break;
      case "WARNING":
        levelCell.setBackground("#fef3c7").setFontColor("#d97706");
        break;
      case "INFO":
        levelCell.setBackground("#dbeafe").setFontColor("#2563eb");
        break;
      default:
        levelCell.setBackground("#f3f4f6");
    }
  });
}


/**
 * Met à jour le dashboard avec les données TRESORIS
 */
function updateDashboard(dashboardData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEETS.DASHBOARD);
  
  if (!sheet || !dashboardData) return;
  
  // Mettre à jour le timestamp
  sheet.getRange("A2").setValue("Dernière mise à jour: " + new Date().toLocaleString("fr-FR"));
  
  // TODO: Ajouter plus de KPIs depuis l'API
}


// ═══════════════════════════════════════════════════════════════════════════════
// MENU & UI
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Ajoute le menu TRESORIS
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('TRESORIS')
    .addItem('Lancer une analyse', 'manualAnalysis')
    .addSeparator()
    .addItem('Voir le dernier rapport', 'showLastReport')
    .addItem('Demander une recommandation', 'askRecommendation')
    .addSeparator()
    .addItem('Configuration initiale', 'setupTresorisSheet')
    .addItem('Configurer API Key', 'configureApiKey')
    .addToUi();
}


/**
 * Analyse manuelle
 */
function manualAnalysis() {
  const ui = SpreadsheetApp.getUi();
  
  ui.alert(
    "Analyse en cours...",
    "TRESORIS analyse vos données.\nLes alertes apparaîtront dans l'onglet 'Alertes TRESORIS'.",
    ui.ButtonSet.OK
  );
  
  triggerTresorisAnalysis();
}


/**
 * Affiche le dernier rapport
 */
function showLastReport() {
  const result = callTresorisAPI("/analysis/latest", {
    spreadsheet_id: SpreadsheetApp.getActiveSpreadsheet().getId()
  });
  
  if (result.success && result.report) {
    const html = HtmlService.createHtmlOutput(result.report)
      .setWidth(600)
      .setHeight(800);
    
    SpreadsheetApp.getUi().showModalDialog(html, 'Dernier Rapport TRESORIS');
  } else {
    SpreadsheetApp.getUi().alert("Aucun rapport disponible");
  }
}


/**
 * Demande une recommandation via chat
 */
function askRecommendation() {
  const ui = SpreadsheetApp.getUi();
  
  const response = ui.prompt(
    'Demander à TRESORIS',
    'Posez votre question (ex: "Pourquoi ma marge baisse ?", "Quels clients relancer en priorité ?"):',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() === ui.Button.OK) {
    const question = response.getResponseText();
    
    const result = callTresorisAPI("/chat", {
      question: question,
      spreadsheet_id: SpreadsheetApp.getActiveSpreadsheet().getId()
    });
    
    if (result.success && result.response) {
      const html = HtmlService.createHtmlOutput(
        `<div style="font-family: Arial, sans-serif; padding: 20px;">
          <h3 style="color: #1e3a5f;">Réponse TRESORIS</h3>
          <p style="white-space: pre-wrap;">${result.response}</p>
        </div>`
      ).setWidth(500).setHeight(400);
      
      ui.showModalDialog(html, 'Réponse TRESORIS');
    } else {
      ui.alert("Erreur: " + (result.error || "Impossible de contacter TRESORIS"));
    }
  }
}


/**
 * Configure l'API Key
 */
function configureApiKey() {
  const ui = SpreadsheetApp.getUi();
  
  const response = ui.prompt(
    'Configuration API Key',
    'Entrez votre clé API TRESORIS:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() === ui.Button.OK) {
    const apiKey = response.getResponseText().trim();
    PropertiesService.getScriptProperties().setProperty('TRESORIS_API_KEY', apiKey);
    ui.alert("API Key configurée avec succès !");
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Log avec niveau
 */
function log(message, level = "INFO") {
  if (CONFIG.DEBUG || level === "ERROR") {
    console.log(`[TRESORIS][${level}] ${new Date().toISOString()} - ${message}`);
  }
}


/**
 * Test de connexion à l'API
 */
function testConnection() {
  const result = callTresorisAPI("/health", {});
  
  if (result.success) {
    SpreadsheetApp.getUi().alert("Connexion réussie !", "TRESORIS est connecté et opérationnel.", SpreadsheetApp.getUi().ButtonSet.OK);
  } else {
    SpreadsheetApp.getUi().alert("Erreur de connexion", result.error, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}
