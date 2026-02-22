import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

  // Default: exit_intent or calculator benchmark
  const titles: Record<string, string> = {
    calculator_dso: 'Votre benchmark DSO — Banque de France 2024',
    calculator_bfr: 'Votre benchmark BFR — Banque de France 2024',
    exit_intent: 'Votre guide : Optimiser le Cash Flow de votre PME',
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

    // Send email via Resend (same pattern as /api/newsletter/subscribe)
    if (process.env.RESEND_API_KEY) {
      const { subject, html } = getEmailContent(source, leadMagnet, score)

      const { error } = await resend.emails.send({
        from: 'FinSight <otmane@zineinsight.com>',
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
    } else {
      // Fallback log if Resend not configured
      console.log('[lead-capture] RESEND_API_KEY manquante — lead enregistré localement:', {
        email: cleanEmail, source, leadMagnet, newsletterOptIn, score,
        capturedAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
