/**
 * TRESORIS - Google Sheets Integration (Simplified)
 * ==================================================
 * 
 * Version simplifiée : le Sheet est un INPUT de données.
 * Toute l'intelligence est dans l'agent TRESORIS.
 * 
 * FLUX:
 * 1. Utilisateur modifie une facture
 * 2. Trigger onEdit détecte le changement
 * 3. Les données sont envoyées à l'API TRESORIS
 * 4. L'agent analyse avec ses 13 engines
 * 5. La page HTML affiche les résultats
 * 
 * INSTALLATION:
 * 1. Ouvrir le Google Sheet
 * 2. Extensions > Apps Script
 * 3. Coller ce code
 * 4. Exécuter setupTresoris() une fois
 * 5. C'est tout !
 * 
 * @author TRESORIS Team
 * @version 2.0.0 - Simplified
 * @date Février 2026
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // URL de l'API TRESORIS (ngrok pour accès depuis Google Apps Script)
  TRESORIS_API_URL: "https://generally-unsupervisory-felicitas.ngrok-free.dev/api/v1",
  
  // Clé API
  API_KEY: "tre_oqDVU4R-LDlfK7qqJjmVw9sUPO2xYuSOLPbaib02cxs",
  
  // Noms des onglets (seulement les données)
  SHEETS: {
    FACTURES: "Factures",
    ENCAISSEMENTS: "Encaissements"
  },
  
  // Délai minimum entre deux analyses (en secondes)
  COOLDOWN_SECONDS: 30,
  
  // Mode debug
  DEBUG: true
};


// ═══════════════════════════════════════════════════════════════════════════════
// SETUP INITIAL (à exécuter une seule fois)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Configuration initiale du Sheet TRESORIS.
 * À exécuter une seule fois.
 */
function setupTresoris() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Créer/configurer l'onglet Factures
  let facturesSheet = ss.getSheetByName(CONFIG.SHEETS.FACTURES);
  if (!facturesSheet) {
    facturesSheet = ss.insertSheet(CONFIG.SHEETS.FACTURES);
  }
  setupFacturesSheet(facturesSheet);
  
  // 2. Créer/configurer l'onglet Encaissements (optionnel)
  let encaissementsSheet = ss.getSheetByName(CONFIG.SHEETS.ENCAISSEMENTS);
  if (!encaissementsSheet) {
    encaissementsSheet = ss.insertSheet(CONFIG.SHEETS.ENCAISSEMENTS);
  }
  setupEncaissementsSheet(encaissementsSheet);
  
  // 3. Configurer le trigger automatique
  setupTrigger();
  
  // 4. Message de confirmation
  SpreadsheetApp.getUi().alert(
    "✅ TRESORIS Configuré",
    "Le Sheet est maintenant connecté à l'agent TRESORIS.\n\n" +
    "Modifiez une facture pour déclencher l'analyse automatique.\n" +
    "Les résultats s'affichent sur la page TRESORIS Live.",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
  
  log("Setup terminé avec succès");
}


/**
 * ⚡ SYNC MANUEL - Force l'envoi immédiat à TRESORIS
 * À utiliser depuis le menu: TRESORIS > Synchroniser maintenant
 */
function syncNow() {
  try {
    log("🚀 Synchronisation manuelle démarrée...");
    
    // Ignorer le cooldown pour le sync manuel
    const props = PropertiesService.getScriptProperties();
    props.deleteProperty('LAST_SYNC');
    
    // Envoyer les données
    sendToTresoris();
    
    SpreadsheetApp.getUi().alert(
      "✅ Synchronisation réussie",
      "Les données ont été envoyées à TRESORIS.\n" +
      "Consultez la page TRESORIS Live pour voir les résultats.",
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    
  } catch (error) {
    SpreadsheetApp.getUi().alert(
      "❌ Erreur de synchronisation",
      error.message,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    log(`Erreur sync manuel: ${error.message}`, "ERROR");
  }
}


/**
 * Crée le menu TRESORIS dans Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('TRESORIS')
    .addItem('⚙️ Configuration initiale', 'setupTresoris')
    .addItem('⚡ Synchroniser maintenant', 'syncNow')
    .addSeparator()
    .addItem('📊 Ouvrir Dashboard Live', 'openDashboard')
    .addToUi();
}


/**
 * Ouvre le dashboard TRESORIS Live dans un nouvel onglet
 */
function openDashboard() {
  const html = HtmlService.createHtmlOutput(
    '<script>window.open("file:///Users/otmaneboulahia/Documents/finsights/agent-DAF/agents/tresoris/frontend/tresoris-live-v2.html", "_blank"); google.script.host.close();</script>'
  );
  SpreadsheetApp.getUi().showModelessDialog(html, 'Ouverture...');
}


/**
 * Configure les headers de l'onglet Factures
 */
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
  
  // Headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground("#1e3a5f")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  
  // Validation pour Statut
  const statutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["En attente", "Payée", "En retard", "Litige", "Annulée"], true)
    .build();
  sheet.getRange("H2:H1000").setDataValidation(statutRule);
  
  // Format dates (FR)
  sheet.getRange("B2:B1000").setNumberFormat("dd/mm/yyyy");
  sheet.getRange("G2:G1000").setNumberFormat("dd/mm/yyyy");
  sheet.getRange("I2:I1000").setNumberFormat("dd/mm/yyyy");
  
  // Format monétaires
  sheet.getRange("D2:F1000").setNumberFormat("#,##0.00 €");
  sheet.getRange("J2:J1000").setNumberFormat("#,##0.00 €");
  
  // Figer la première ligne
  sheet.setFrozenRows(1);
  
  log("Onglet Factures configuré");
}


/**
 * Configure les headers de l'onglet Encaissements
 */
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
  
  log("Onglet Encaissements configuré");
}


/**
 * Configure le trigger automatique onEdit
 */
function setupTrigger() {
  // Supprimer les anciens triggers TRESORIS
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onSheetEdit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Créer le nouveau trigger
  ScriptApp.newTrigger('onSheetEdit')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
  
  log("Trigger onEdit configuré");
}


// ═══════════════════════════════════════════════════════════════════════════════
// TRIGGER - DÉTECTION DES MODIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Déclenché automatiquement à chaque modification du Sheet.
 * Envoie les données à l'agent TRESORIS.
 */
function onSheetEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const sheetName = sheet.getName();
    
    // Ne réagir qu'aux onglets de données
    if (sheetName !== CONFIG.SHEETS.FACTURES && 
        sheetName !== CONFIG.SHEETS.ENCAISSEMENTS) {
      return;
    }
    
    // Vérifier le cooldown
    const props = PropertiesService.getScriptProperties();
    const lastSync = props.getProperty('LAST_SYNC');
    
    if (lastSync) {
      const lastTime = new Date(lastSync);
      const now = new Date();
      const diffSeconds = (now - lastTime) / 1000;
      
      if (diffSeconds < CONFIG.COOLDOWN_SECONDS) {
        log(`Cooldown actif (${Math.round(CONFIG.COOLDOWN_SECONDS - diffSeconds)}s restantes)`);
        return;
      }
    }
    
    // Envoyer les données à TRESORIS
    log(`Modification dans ${sheetName} - Envoi à TRESORIS...`);
    sendToTresoris();
    
  } catch (error) {
    log(`Erreur onEdit: ${error.message}`, "ERROR");
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// ENVOI DES DONNÉES À L'API TRESORIS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Collecte et envoie les données à l'API TRESORIS.
 */
function sendToTresoris() {
  try {
    // 1. Collecter les données
    const data = collectData();
    
    log(`Envoi de ${data.factures.length} factures à TRESORIS...`);
    
    // 2. Appeler l'API
    const response = callAPI("/webhook/gsheet", data);
    
    if (response.success) {
      // Enregistrer timestamp
      PropertiesService.getScriptProperties().setProperty('LAST_SYNC', new Date().toISOString());
      
      log(`✅ Analyse terminée: ${response.alerts?.length || 0} alertes`);
      
      // Notification optionnelle
      if (response.alerts && response.alerts.length > 0) {
        const criticalAlerts = response.alerts.filter(a => a.level === "CRITICAL");
        if (criticalAlerts.length > 0) {
          SpreadsheetApp.getActiveSpreadsheet().toast(
            `⚠️ ${criticalAlerts.length} alerte(s) critique(s) détectée(s)`,
            "TRESORIS",
            5
          );
        }
      }
    } else {
      log(`❌ Erreur API: ${response.error}`, "ERROR");
    }
    
  } catch (error) {
    log(`Erreur sendToTresoris: ${error.message}`, "ERROR");
  }
}


/**
 * Collecte toutes les données du Sheet.
 */
function collectData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Factures
  const facturesSheet = ss.getSheetByName(CONFIG.SHEETS.FACTURES);
  const facturesData = facturesSheet.getDataRange().getValues();
  const facturesHeaders = facturesData[0];
  
  const factures = facturesData.slice(1)
    .filter(row => row[0] || row[2]) // ID ou Client non vide
    .map(row => {
      const obj = {};
      facturesHeaders.forEach((header, i) => {
        // Convertir les dates en string ISO
        if (row[i] instanceof Date) {
          obj[header] = row[i].toISOString().split('T')[0];
        } else {
          obj[header] = row[i];
        }
      });
      return obj;
    });
  
  // Encaissements (optionnel)
  let encaissements = [];
  const encaissementsSheet = ss.getSheetByName(CONFIG.SHEETS.ENCAISSEMENTS);
  if (encaissementsSheet) {
    const encData = encaissementsSheet.getDataRange().getValues();
    const encHeaders = encData[0];
    
    encaissements = encData.slice(1)
      .filter(row => row[0])
      .map(row => {
        const obj = {};
        encHeaders.forEach((header, i) => {
          if (row[i] instanceof Date) {
            obj[header] = row[i].toISOString().split('T')[0];
          } else {
            obj[header] = row[i];
          }
        });
        return obj;
      });
  }
  
  return {
    timestamp: new Date().toISOString(),
    spreadsheet_id: ss.getId(),
    spreadsheet_name: ss.getName(),
    factures: factures,
    encaissements: encaissements,
    parametres: {},
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
 * Appelle l'API TRESORIS.
 */
function callAPI(endpoint, data) {
  const url = CONFIG.TRESORIS_API_URL + endpoint;
  
  const options = {
    method: "POST",
    contentType: "application/json",
    headers: {
      "Authorization": `Bearer ${CONFIG.API_KEY}`,
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
// MENU & ACTIONS MANUELLES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Ajoute le menu TRESORIS
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🤖 TRESORIS')
    .addItem('▶️ Lancer analyse maintenant', 'manualSync')
    .addItem('🔗 Tester connexion', 'testConnection')
    .addSeparator()
    .addItem('⚙️ Configuration initiale', 'setupTresoris')
    .addToUi();
}


/**
 * Synchronisation manuelle
 */
function manualSync() {
  const ui = SpreadsheetApp.getUi();
  
  ui.alert(
    "🔄 Analyse en cours...",
    "TRESORIS analyse vos données.\nLes résultats s'afficheront sur la page TRESORIS Live.",
    ui.ButtonSet.OK
  );
  
  sendToTresoris();
}


/**
 * Test de connexion à l'API
 */
function testConnection() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const url = CONFIG.TRESORIS_API_URL + "/health";
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const code = response.getResponseCode();
    
    if (code === 200) {
      const data = JSON.parse(response.getContentText());
      ui.alert(
        "✅ Connexion réussie",
        `TRESORIS est opérationnel.\n\nVersion: ${data.version || 'N/A'}\nStatus: ${data.status || 'healthy'}`,
        ui.ButtonSet.OK
      );
    } else {
      ui.alert("❌ Erreur de connexion", `Code HTTP: ${code}`, ui.ButtonSet.OK);
    }
  } catch (error) {
    ui.alert("❌ Erreur de connexion", error.message, ui.ButtonSet.OK);
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
