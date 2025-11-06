/**
 * Email Templates HTML pour les alertes FinSight
 * Templates responsive et professionnels pour Resend
 */

export interface AlertEmailData {
    companyName: string;
    userName?: string;
    alertType: 'tresorerie' | 'anomalie' | 'echeance' | 'dso' | 'marge';
    severity: 'critical' | 'warning' | 'info';
    value?: number;
    threshold?: number;
    details?: string;
    actionUrl?: string;
}

const baseStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #1f2937;
    margin: 0;
    padding: 0;
    background-color: #f3f4f6;
  }
  .container {
    max-width: 600px;
    margin: 40px auto;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .header {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    padding: 32px 24px;
    text-align: center;
  }
  .header h1 {
    color: white;
    margin: 0;
    font-size: 24px;
    font-weight: 700;
  }
  .header .subtitle {
    color: rgba(255, 255, 255, 0.9);
    margin: 8px 0 0 0;
    font-size: 14px;
  }
  .content {
    padding: 32px 24px;
  }
  .alert-badge {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
  }
  .alert-critical {
    background: #fee2e2;
    color: #991b1b;
  }
  .alert-warning {
    background: #fef3c7;
    color: #92400e;
  }
  .alert-info {
    background: #dbeafe;
    color: #1e40af;
  }
  .metric-box {
    background: #f9fafb;
    border-left: 4px solid #3b82f6;
    padding: 20px;
    margin: 24px 0;
    border-radius: 8px;
  }
  .metric-box .label {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
  }
  .metric-box .value {
    font-size: 32px;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }
  .metric-box .threshold {
    font-size: 14px;
    color: #9ca3af;
    margin-top: 4px;
  }
  .details {
    background: #fffbeb;
    border: 1px solid #fbbf24;
    padding: 16px;
    border-radius: 8px;
    margin: 24px 0;
  }
  .details p {
    margin: 0;
    color: #92400e;
  }
  .cta {
    text-align: center;
    margin: 32px 0;
  }
  .cta-button {
    display: inline-block;
    background: #3b82f6;
    color: white !important;
    padding: 14px 32px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: background 0.2s;
  }
  .cta-button:hover {
    background: #2563eb;
  }
  .footer {
    background: #f9fafb;
    padding: 24px;
    text-align: center;
    font-size: 12px;
    color: #6b7280;
  }
  .footer a {
    color: #3b82f6;
    text-decoration: none;
  }
`;

/**
 * Template: Alerte Trésorerie Critique
 */
export function getTresorerieAlertEmail(data: AlertEmailData): string {
    const formattedValue = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(data.value || 0);

    const formattedThreshold = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(data.threshold || 10000);

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🚨 Alerte Trésorerie Critique - FinSight</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚨 Alerte Trésorerie Critique</h1>
      <p class="subtitle">${data.companyName}</p>
    </div>

    <div class="content">
      <span class="alert-badge alert-critical">⚠️ CRITIQUE</span>

      <h2 style="margin-top: 0;">Votre trésorerie nécessite une attention immédiate</h2>

      <div class="metric-box">
        <div class="label">Trésorerie actuelle</div>
        <div class="value" style="color: #dc2626;">${formattedValue}</div>
        <div class="threshold">Seuil d'alerte : ${formattedThreshold}</div>
      </div>

      <div class="details">
        <p><strong>⚠️ Recommandation :</strong></p>
        <p>${data.details || 'Votre trésorerie est en dessous du seuil critique. Vérifiez vos créances clients et planifiez vos prochains encaissements.'}</p>
      </div>

      <p>Actions recommandées :</p>
      <ul style="color: #4b5563; line-height: 1.8;">
        <li>📞 Relancer les factures en retard (DSO)</li>
        <li>📊 Analyser les dépenses non essentielles</li>
        <li>💰 Vérifier les lignes de crédit disponibles</li>
        <li>📈 Planifier les encaissements à venir</li>
      </ul>

      <div class="cta">
        <a href="${data.actionUrl || 'https://finsights.vercel.app/dashboard'}" class="cta-button">
          📊 Voir le Dashboard
        </a>
      </div>

      <p style="font-size: 14px; color: #6b7280; margin-top: 32px;">
        Cette alerte a été générée automatiquement par FinSight.
        ${data.userName ? `Destinataire : ${data.userName}` : ''}
      </p>
    </div>

    <div class="footer">
      <p>FinSight - Analyse Financière Intelligente</p>
      <p><a href="https://finsights.vercel.app">finsights.vercel.app</a></p>
      <p style="margin-top: 12px;">
        <a href="#">Gérer mes alertes</a> • <a href="#">Se désabonner</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Template: Anomalie ML Détectée
 */
export function getAnomalieAlertEmail(data: AlertEmailData): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🔍 Anomalie Détectée - FinSight</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔍 Anomalie Détectée par IA</h1>
      <p class="subtitle">${data.companyName}</p>
    </div>

    <div class="content">
      <span class="alert-badge alert-${data.severity === 'critical' ? 'critical' : 'warning'}">
        ${data.severity === 'critical' ? '🚨 CRITIQUE' : '⚠️ ATTENTION'}
      </span>

      <h2 style="margin-top: 0;">Transaction inhabituelle identifiée</h2>

      <p>Notre algorithme de Machine Learning (Isolation Forest) a détecté une transaction sortant des patterns habituels de votre activité.</p>

      <div class="metric-box">
        <div class="label">Montant de la transaction</div>
        <div class="value">${data.value ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(data.value) : 'N/A'}</div>
        <div class="threshold">Score d'anomalie : Élevé</div>
      </div>

      <div class="details">
        <p><strong>📋 Détails :</strong></p>
        <p>${data.details || 'Cette transaction présente des caractéristiques inhabituelles par rapport à votre historique financier.'}</p>
      </div>

      <p>Vérifications recommandées :</p>
      <ul style="color: #4b5563; line-height: 1.8;">
        <li>✅ Confirmer la légitimité de la transaction</li>
        <li>📝 Vérifier le libellé et le tiers</li>
        <li>🔍 Comparer avec les transactions similaires</li>
        <li>📞 Contacter le fournisseur si nécessaire</li>
      </ul>

      <div class="cta">
        <a href="${data.actionUrl || 'https://finsights.vercel.app/dashboard'}" class="cta-button">
          🔍 Analyser l'Anomalie
        </a>
      </div>

      <p style="font-size: 14px; color: #6b7280; margin-top: 32px;">
        Détection automatique par FinSight AI • ${new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })}
      </p>
    </div>

    <div class="footer">
      <p>FinSight - Analyse Financière Intelligente</p>
      <p><a href="https://finsights.vercel.app">finsights.vercel.app</a></p>
      <p style="margin-top: 12px;">
        <a href="#">Gérer mes alertes</a> • <a href="#">Se désabonner</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Template: Échéance Paiement J-3
 */
export function getEcheanceAlertEmail(data: AlertEmailData): string {
    const formattedValue = data.value ? new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(data.value) : 'N/A';

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>📅 Rappel Échéance - FinSight</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📅 Rappel d'Échéance</h1>
      <p class="subtitle">${data.companyName}</p>
    </div>

    <div class="content">
      <span class="alert-badge alert-warning">⏰ À VENIR</span>

      <h2 style="margin-top: 0;">Factures à échéance dans 3 jours</h2>

      <p>Vous avez des factures clients arrivant à échéance prochainement. Une relance préventive peut améliorer votre DSO.</p>

      <div class="metric-box">
        <div class="label">Montant total des échéances</div>
        <div class="value" style="color: #f59e0b;">${formattedValue}</div>
        <div class="threshold">Échéance : ${data.details || 'Dans 3 jours'}</div>
      </div>

      <p>Actions suggérées :</p>
      <ul style="color: #4b5563; line-height: 1.8;">
        <li>📧 Envoyer un rappel amical aux clients</li>
        <li>📞 Confirmer la réception des factures</li>
        <li>💳 Proposer des facilités de paiement</li>
        <li>📊 Mettre à jour vos prévisions de trésorerie</li>
      </ul>

      <div class="cta">
        <a href="${data.actionUrl || 'https://finsights.vercel.app/dashboard'}" class="cta-button">
          📋 Voir les Échéances
        </a>
      </div>

      <p style="font-size: 14px; color: #6b7280; margin-top: 32px;">
        Rappel automatique FinSight • Configurez la fréquence dans vos préférences
      </p>
    </div>

    <div class="footer">
      <p>FinSight - Analyse Financière Intelligente</p>
      <p><a href="https://finsights.vercel.app">finsights.vercel.app</a></p>
      <p style="margin-top: 12px;">
        <a href="#">Gérer mes alertes</a> • <a href="#">Se désabonner</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Sélectionne le template approprié selon le type d'alerte
 */
export function getEmailTemplate(data: AlertEmailData): string {
    switch (data.alertType) {
        case 'tresorerie':
            return getTresorerieAlertEmail(data);
        case 'anomalie':
            return getAnomalieAlertEmail(data);
        case 'echeance':
            return getEcheanceAlertEmail(data);
        default:
            return getTresorerieAlertEmail(data);
    }
}

/**
 * Génère le sujet de l'email selon le type d'alerte
 */
export function getEmailSubject(data: AlertEmailData): string {
    const severity = data.severity === 'critical' ? '🚨 URGENT' : '⚠️';

    switch (data.alertType) {
        case 'tresorerie':
            return `${severity} Alerte Trésorerie - ${data.companyName}`;
        case 'anomalie':
            return `${severity} Anomalie Détectée - ${data.companyName}`;
        case 'echeance':
            return `📅 Échéances J-3 - ${data.companyName}`;
        case 'dso':
            return `⏱️ DSO Élevé - ${data.companyName}`;
        case 'marge':
            return `📉 Alerte Marge - ${data.companyName}`;
        default:
            return `${severity} Alerte FinSight - ${data.companyName}`;
    }
}
