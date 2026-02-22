import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { put } from '@vercel/blob'
import { resend, FROM_EMAIL, REPLY_TO_EMAIL } from '@/lib/emails/resend'

const SITE_URL = 'https://finsight.zineinsight.com'
const EXPIRY_DAYS = 30

// ---------------------------------------------------------------------------
// POST /api/diagnostic/report
// Body: { email, newsletterOptIn, sector, totalScore, pillarScores, synthesis, results }
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      email,
      newsletterOptIn = false,
      sector = 'autre',
      totalScore,
      pillarScores,
      synthesis,
      results,
    } = body

    // Validate
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }
    if (totalScore === undefined || !pillarScores || !synthesis) {
      return NextResponse.json({ error: 'Données diagnostic manquantes' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString()
    const createdAt = new Date().toISOString()
    const reportUrl = `${SITE_URL}/rapport/${token}`

    // Rapport payload
    const reportData = {
      token,
      email: cleanEmail,
      newsletterOptIn,
      sector,
      totalScore,
      pillarScores,
      synthesis,
      results: results || {},
      expiresAt,
      createdAt,
    }

    // Store in Vercel Blob as JSON
    await put(`reports/${token}.json`, JSON.stringify(reportData), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    })

    // Score level label
    const level =
      totalScore >= 75 ? 'Solide'
      : totalScore >= 55 ? 'Favorable'
      : totalScore >= 35 ? 'Vigilance'
      : 'Critique'

    const scoreColor =
      totalScore >= 75 ? '#10b981'
      : totalScore >= 55 ? '#3b82f6'
      : totalScore >= 35 ? '#f59e0b'
      : '#ef4444'

    // Build pillar summary for email
    const pillarRows = [
      { label: 'CASH — Trésorerie', score: pillarScores.cash },
      { label: 'MARGIN — Rentabilité', score: pillarScores.margin },
      { label: 'RESILIENCE — Stabilité', score: pillarScores.resilience },
      { label: 'RISQUES — Anomalies', score: pillarScores.risk },
    ]
      .filter((p) => p.score !== null && p.score !== undefined)
      .map(
        (p) =>
          `<tr>
            <td style="padding:6px 0;color:#94a3b8;font-size:13px;">${p.label}</td>
            <td style="padding:6px 0;text-align:right;font-weight:700;color:#f8fafc;font-size:13px;">${p.score}/25</td>
          </tr>`
      )
      .join('')

    const forcesHtml = (synthesis.forces || [])
      .slice(0, 3)
      .map((f: string) => `<li style="margin-bottom:6px;color:#86efac;font-size:13px;">✓ ${f}</li>`)
      .join('')

    const vulnsHtml = (synthesis.vulnerabilites || [])
      .slice(0, 3)
      .map((v: string) => `<li style="margin-bottom:6px;color:#fca5a5;font-size:13px;">⚠ ${v}</li>`)
      .join('')

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      replyTo: REPLY_TO_EMAIL,
      to: [cleanEmail],
      subject: `Votre rapport Score FinSight™ ${totalScore}/100 — ${level}`,
      html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0b0f1a;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b0f1a;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#0f172a;border-radius:12px 12px 0 0;padding:32px 36px;border-bottom:1px solid #1e293b;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.12em;color:#64748b;text-transform:uppercase;">
              Score FinSight™ · Rapport confidentiel
            </p>
            <h1 style="margin:0;font-size:26px;font-weight:700;color:#f8fafc;line-height:1.2;">
              Votre diagnostic financier
            </h1>
          </td>
        </tr>

        <!-- Score block -->
        <tr>
          <td style="background:#0f172a;padding:28px 36px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#1e293b;border-radius:10px;padding:20px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin:0 0 2px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Score global</p>
                        <p style="margin:0;font-size:40px;font-weight:700;color:${scoreColor};line-height:1;">
                          ${totalScore}<span style="font-size:20px;color:#64748b;">/100</span>
                        </p>
                        <p style="margin:4px 0 0;font-size:13px;font-weight:600;color:${scoreColor};">${synthesis.level || level}</p>
                      </td>
                      <td style="text-align:right;vertical-align:top;">
                        <p style="margin:0 0 4px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Secteur</p>
                        <p style="margin:0;font-size:13px;color:#94a3b8;font-weight:600;">${sector}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Pillar scores -->
        <tr>
          <td style="background:#0f172a;padding:20px 36px 0;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.1em;color:#64748b;text-transform:uppercase;">
              Détail par pilier
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1e293b;">
              ${pillarRows}
            </table>
          </td>
        </tr>

        <!-- Forces / Vulns -->
        ${forcesHtml || vulnsHtml ? `
        <tr>
          <td style="background:#0f172a;padding:20px 36px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                ${forcesHtml ? `
                <td style="vertical-align:top;width:50%;padding-right:12px;">
                  <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;color:#64748b;text-transform:uppercase;">Points forts</p>
                  <ul style="margin:0;padding-left:0;list-style:none;">${forcesHtml}</ul>
                </td>` : ''}
                ${vulnsHtml ? `
                <td style="vertical-align:top;width:50%;padding-left:12px;">
                  <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;color:#64748b;text-transform:uppercase;">Points de vigilance</p>
                  <ul style="margin:0;padding-left:0;list-style:none;">${vulnsHtml}</ul>
                </td>` : ''}
              </tr>
            </table>
          </td>
        </tr>` : ''}

        <!-- Priorité -->
        ${synthesis.priorite ? `
        <tr>
          <td style="background:#0f172a;padding:20px 36px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#1e293b;border-left:3px solid ${scoreColor};border-radius:0 8px 8px 0;padding:12px 16px;">
                  <p style="margin:0 0 3px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:#64748b;text-transform:uppercase;">Priorité d'action</p>
                  <p style="margin:0;font-size:13px;color:#e2e8f0;line-height:1.5;">${synthesis.priorite}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>` : ''}

        <!-- CTA -->
        <tr>
          <td style="background:#0f172a;padding:28px 36px 32px;text-align:center;">
            <a href="${reportUrl}"
               style="display:inline-block;background:#f8fafc;color:#0f172a;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;letter-spacing:0.02em;">
              Consulter le rapport complet →
            </a>
            <p style="margin:14px 0 0;font-size:11px;color:#475569;">
              Rapport disponible pendant ${EXPIRY_DAYS} jours · Lien personnel et confidentiel
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0f172a;border-top:1px solid #1e293b;border-radius:0 0 12px 12px;padding:20px 36px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;color:#334155;font-weight:600;">FinSight · Direction Financière Externalisée</p>
            <p style="margin:0;font-size:11px;color:#1e293b;">
              <a href="${SITE_URL}/politique-confidentialite" style="color:#334155;text-decoration:underline;">Se désinscrire</a>
              &nbsp;·&nbsp;
              <a href="https://calendly.com/zineinsight" style="color:#334155;text-decoration:underline;">Échange stratégique 30 min</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
      tags: [
        { name: 'source', value: 'diagnostic_report' },
        { name: 'score', value: String(totalScore) },
      ],
    })

    if (error) {
      console.error('[diagnostic/report] Resend error:', error)
      // Don't fail the request — report is saved, email can be retried
    }

    return NextResponse.json({ success: true, token, reportUrl }, { status: 200 })
  } catch (err) {
    console.error('[diagnostic/report] Error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
