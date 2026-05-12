/**
 * Template email Magic Link — Accès Simulateurs FinSight
 */

export function buildMagicLinkEmail(magicUrl: string, email: string): { subject: string; html: string } {
    const subject = 'Votre lien d\'accès aux simulateurs FinSight'

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0f172a;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#d4af37;letter-spacing:-0.5px;">FinSight</p>
              <p style="margin:6px 0 0;font-size:12px;color:#94a3b8;letter-spacing:0.5px;text-transform:uppercase;">Pilotage financier pour dirigeants</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#0f172a;line-height:1.3;">
                Votre accès est prêt
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
                Cliquez sur le bouton ci-dessous pour accéder aux simulateurs financiers FinSight. 
                Ce lien est valable <strong>24 heures</strong> et à usage unique.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr>
                  <td style="background:#d4af37;border-radius:10px;text-align:center;">
                    <a href="${magicUrl}" target="_blank" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#0f172a;text-decoration:none;letter-spacing:-0.2px;">
                      Accéder aux simulateurs →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Info box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#334155;">Ce qui vous attend</p>
                    <ul style="margin:8px 0 0;padding-left:20px;font-size:13px;color:#64748b;line-height:1.7;">
                      <li>Simulateur coût réel d'un salarié (charges incluses)</li>
                      <li>Simulateur trésorerie à 90 jours <span style="color:#94a3b8;">(bientôt)</span></li>
                      <li>Simulateur impact DSO <span style="color:#94a3b8;">(bientôt)</span></li>
                      <li>Simulateur dilution / levée de fonds <span style="color:#94a3b8;">(bientôt)</span></li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                Si vous n'avez pas demandé cet accès, ignorez simplement cet email.<br/>
                Ce lien expire dans 24h. En cas de problème, répondez directement à cet email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:11px;color:#94a3b8;text-align:center;line-height:1.6;">
                FinSight · finsight.zineinsight.com<br/>
                Vous recevez cet email car vous avez demandé un accès aux simulateurs.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
    return { subject, html }
}
