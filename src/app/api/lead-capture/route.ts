import { NextRequest, NextResponse } from 'next/server'
import { resend, FROM_EMAIL, REPLY_TO_EMAIL } from '@/lib/emails/resend'

// Simple email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

// Lead magnet email content per source
function getEmailContent(source: string, leadMagnet: string | undefined, score?: number) {
  if (source === 'diagnostic_guide') {
    return {
      subject: `Votre rapport Score FinSight™ ${score ?? 0}/100`,
      html: `
        <!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:#0f172a;padding:30px;text-align:center;border-radius:10px 10px 0 0;">
            <h1 style="color:white;margin:0;font-size:24px;">Votre Score FinSight™ : ${score ?? 0}/100</h1>
          </div>
          <div style="background:#f9fafb;padding:30px;border-radius:0 0 10px 10px;">
            <p>Bonjour,</p>
            <p>Voici le résumé de votre diagnostic financier FinSight™.</p>
            <p>Votre score de <strong>${score ?? 0}/100</strong> a été calculé sur 4 piliers : Rentabilité, Trésorerie, Structure et Croissance.</p>
            <div style="text-align:center;margin:30px 0;">
              <a href="https://finsight.zineinsight.com/diagnostic/guide" style="display:inline-block;background:#0f172a;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;">
                Consulter le diagnostic complet →
              </a>
            </div>
            <p>Pour transformer ce diagnostic en plan d'action concret :</p>
            <a href="https://calendly.com/zineinsight" style="color:#2563eb;">Réserver un échange stratégique 30 min</a>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;">
            <p style="font-size:12px;color:#666;text-align:center;">
              FinSight · Direction Financière Externalisée pour PME<br>
              <a href="https://finsight.zineinsight.com/politique-confidentialite" style="color:#666;">Se désinscrire</a>
            </p>
          </div>
        </body></html>
      `,
    }
  }

  // exit_intent — Guide Cash Flow PDF
  if (source === 'exit_intent') {
    return {
      subject: '📄 Votre guide PDF : Optimisez votre Cash Flow — 7 leviers pour PME',
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Votre guide PDF FinSight</title>
        </head>
        <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                <!-- Header -->
                <tr>
                  <td style="background:#0f172a;border-radius:12px 12px 0 0;padding:32px 40px 28px;">
                    <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">FinSight · Direction Financière Externalisée</p>
                    <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">
                      Votre guide est prêt à télécharger 📄
                    </h1>
                    <p style="margin:10px 0 0;color:#93c5fd;font-size:14px;">
                      Optimisez votre Cash Flow — Guide complet pour PME
                    </p>
                  </td>
                </tr>

                <!-- Blue accent bar -->
                <tr><td style="height:4px;background:#2563eb;"></td></tr>

                <!-- Body -->
                <tr>
                  <td style="background:#ffffff;padding:36px 40px;">
                    <p style="margin:0 0 20px;color:#334155;font-size:15px;line-height:1.6;">
                      Merci pour votre intérêt. Voici votre guide PDF de 15 pages avec les benchmarks Banque de France 2024 et un plan d'action immédiatement actionnable.
                    </p>

                    <!-- CTA principal -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                      <tr>
                        <td align="center">
                          <a href="https://finsight.zineinsight.com/ressources/guides/guide-optimiser-cash-flow-pme.pdf"
                             style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:16px 36px;border-radius:8px;letter-spacing:0.3px;">
                            ↓ Télécharger le guide PDF (15 pages)
                          </a>
                          <p style="margin:10px 0 0;color:#94a3b8;font-size:12px;">
                            PDF · 34 KB · Benchmarks Banque de France 2024
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Ce que contient le guide -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:28px;">
                      <tr>
                        <td style="padding:20px 24px;">
                          <p style="margin:0 0 14px;color:#0f172a;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Ce que vous trouverez dans ce guide</p>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            ${[
                              ['📊', 'Les 3 flux du cash flow expliqués avec exemples chiffrés'],
                              ['📐', 'Calculer votre BFR et le comparer aux benchmarks sectoriels BdF 2024'],
                              ['⏱️', 'Benchmarks DSO / BFR par secteur (services, industrie, BTP, tech…)'],
                              ['⚡', '7 leviers actionnables pour réduire votre BFR et libérer du cash'],
                              ['📋', 'Template de suivi de trésorerie 12 semaines (version Excel disponible)'],
                              ['🗺️', 'Plan d\'action en 7 étapes — roadmap 90 jours PME 2–20 M€'],
                            ].map(([icon, text]) => `
                            <tr>
                              <td style="padding:5px 0;vertical-align:top;width:28px;font-size:15px;">${icon}</td>
                              <td style="padding:5px 0;color:#334155;font-size:13.5px;line-height:1.5;">${text}</td>
                            </tr>`).join('')}
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Separateur -->
                    <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px;">

                    <!-- Diagnostic -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:8px;margin-bottom:28px;">
                      <tr>
                        <td style="padding:24px 28px;">
                          <p style="margin:0 0 6px;color:#93c5fd;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">Étape suivante recommandée</p>
                          <p style="margin:0 0 12px;color:#ffffff;font-size:15px;font-weight:600;line-height:1.4;">Diagnostiquez votre situation en 10 minutes</p>
                          <p style="margin:0 0 18px;color:#94a3b8;font-size:13px;line-height:1.6;">
                            Notre diagnostic en ligne évalue votre PME sur 4 piliers : Rentabilité, Trésorerie, Structure financière et Croissance. Score sur 100 + 3 leviers prioritaires chiffrés.
                          </p>
                          <a href="https://finsight.zineinsight.com/diagnostic/guide"
                             style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;padding:12px 24px;border-radius:6px;">
                            Faire le diagnostic gratuit →
                          </a>
                          <a href="https://calendly.com/zineinsight"
                             style="display:inline-block;margin-left:12px;color:#93c5fd;text-decoration:none;font-size:13px;">
                            Ou réserver 30 min →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Outils gratuits -->
                    <p style="margin:0 0 10px;color:#0f172a;font-size:13px;font-weight:600;">Outils gratuits disponibles sur FinSight :</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${[
                        ['Calculateur DSO', 'https://finsight.zineinsight.com/calculateurs/dso'],
                        ['Calculateur BFR', 'https://finsight.zineinsight.com/calculateurs/bfr'],
                        ['Calculateur de marge', 'https://finsight.zineinsight.com/calculateurs/marge'],
                        ['Template trésorerie Excel 90J', 'https://finsight.zineinsight.com/templates/previsionnel-tresorerie-90j'],
                      ].map(([label, url]) => `
                      <tr>
                        <td style="padding:4px 0;">
                          <span style="color:#94a3b8;margin-right:6px;">→</span>
                          <a href="${url}" style="color:#2563eb;text-decoration:none;font-size:13px;">${label}</a>
                        </td>
                      </tr>`).join('')}
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
                    <p style="margin:0;color:#94a3b8;font-size:11px;line-height:1.6;">
                      FinSight · Direction Financière Externalisée pour PME 2–20 M€<br>
                      <a href="mailto:otmane@zineinsight.com" style="color:#64748b;">otmane@zineinsight.com</a> ·
                      <a href="https://finsight.zineinsight.com" style="color:#64748b;">finsight.zineinsight.com</a><br>
                      <a href="https://finsight.zineinsight.com/politique-confidentialite" style="color:#94a3b8;">Se désinscrire</a> · Conformément au RGPD
                    </p>
                  </td>
                </tr>

              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    }
  }

  // calculator benchmarks
  const titles: Record<string, string> = {
    calculator_dso: 'Votre benchmark DSO — Banque de France 2024',
    calculator_bfr: 'Votre benchmark BFR — Banque de France 2024',
  }
  const subject = titles[source] ?? 'Vos ressources FinSight'

  return {
    subject,
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:#0f172a;padding:30px;text-align:center;border-radius:10px 10px 0 0;">
          <h1 style="color:white;margin:0;font-size:22px;">FinSight</h1>
          <p style="color:#94a3b8;margin:8px 0 0;">Direction Financière Externalisée · PME 2–20M€</p>
        </div>
        <div style="background:#f9fafb;padding:30px;border-radius:0 0 10px 10px;">
          <p>Bonjour,</p>
          <p>Merci pour votre intérêt. Voici les ressources que vous avez demandées.</p>
          <ul style="padding-left:20px;">
            <li>📊 Benchmarks sectoriels Banque de France 2024 (DSO, BFR)</li>
            <li>💡 7 leviers pour libérer du cash dans une PME</li>
            <li>📋 Template de suivi de trésorerie</li>
          </ul>
          <div style="text-align:center;margin:30px 0;">
            <a href="https://finsight.zineinsight.com/ressources" style="display:inline-block;background:#0f172a;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;">
              Accéder aux ressources →
            </a>
          </div>
          <p>Et si vous voulez aller plus loin :</p>
          <a href="https://calendly.com/zineinsight" style="color:#2563eb;">Échange stratégique 30 min — gratuit, sans engagement</a>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;">
          <p style="font-size:12px;color:#666;text-align:center;">
            FinSight · otmane@zineinsight.com<br>
            <a href="https://finsight.zineinsight.com/politique-confidentialite" style="color:#666;">Se désinscrire</a>
          </p>
        </div>
      </body></html>
    `,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, source, leadMagnet, newsletterOptIn, score } = body

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()

    const { subject, html } = getEmailContent(source, leadMagnet, score)

    const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        replyTo: REPLY_TO_EMAIL,
        to: [cleanEmail],
        subject,
        html,
        tags: [
          { name: 'source', value: source || 'unknown' },
          { name: 'lead_magnet', value: leadMagnet || 'none' },
          { name: 'newsletter_opt_in', value: newsletterOptIn ? 'true' : 'false' },
        ],
      })

      if (error) {
        console.error('[lead-capture] Resend error:', error)
        return NextResponse.json({ error: 'Erreur envoi email' }, { status: 500 })
      }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
