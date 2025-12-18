import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email requis' },
                { status: 400 }
            )
        }

        // For security, always return success to prevent email enumeration
        // In production, this would:
        // 1. Check if user exists
        // 2. Generate a reset token
        // 3. Store token in database
        // 4. Send email with reset link
        
        // Log pour debug (en production, ceci sera supprimé)
        if (process.env.NODE_ENV === 'development') {
            console.log(`Password reset requested for: ${email}`);
        }

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500))

        return NextResponse.json({
            message: 'Si un compte existe avec cette adresse, un email de réinitialisation a été envoyé.'
        })

    } catch (error) {
        // Ne pas logger les emails en production pour la sécurité
        return NextResponse.json(
            { error: 'Une erreur est survenue' },
            { status: 500 }
        )
    }
}
