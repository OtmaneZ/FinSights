/**
 * API Route: POST /api/invitations
 * Inviter un utilisateur à rejoindre une entreprise
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient, Role } from '@prisma/client';
import { Resend } from 'resend';
import crypto from 'crypto';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface InvitationRequest {
    companyId: string;
    email: string;
    role: Role;
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const body: InvitationRequest = await req.json();
        const { companyId, email, role } = body;

        // Validation
        if (!companyId || !email || !role) {
            return NextResponse.json(
                { error: 'companyId, email et role requis' },
                { status: 400 }
            );
        }

        // Vérifier que l'email est valide
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
        }

        // Vérifier que le role est valide
        if (!['VIEWER', 'EDITOR', 'ADMIN'].includes(role)) {
            return NextResponse.json(
                { error: 'Role invalide. Valeurs autorisées: VIEWER, EDITOR, ADMIN' },
                { status: 400 }
            );
        }

        // Vérifier que l'utilisateur a les droits (OWNER ou ADMIN)
        const member = await prisma.companyMember.findFirst({
            where: {
                companyId,
                userId: session.user.id,
                role: { in: ['OWNER', 'ADMIN'] },
            },
        });

        if (!member) {
            return NextResponse.json(
                { error: 'Droits insuffisants. Seuls les OWNER et ADMIN peuvent inviter.' },
                { status: 403 }
            );
        }

        // Vérifier que l'utilisateur n'est pas déjà membre
        const existingMember = await prisma.companyMember.findFirst({
            where: {
                companyId,
                user: { email },
            },
            include: { user: true },
        });

        if (existingMember) {
            return NextResponse.json(
                { error: `${email} est déjà membre de cette entreprise` },
                { status: 409 }
            );
        }

        // Vérifier qu'il n'y a pas déjà une invitation en attente
        const existingInvitation = await prisma.invitation.findFirst({
            where: {
                companyId,
                email,
                status: 'PENDING',
                expiresAt: { gt: new Date() },
            },
        });

        if (existingInvitation) {
            return NextResponse.json(
                { error: 'Une invitation est déjà en attente pour cet email' },
                { status: 409 }
            );
        }

        // Générer un token unique
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Expire dans 7 jours

        // Créer l'invitation
        const invitation = await prisma.invitation.create({
            data: {
                email,
                role,
                companyId,
                invitedBy: session.user.id,
                token,
                expiresAt,
            },
            include: {
                company: true,
                inviter: { select: { name: true, email: true } },
            },
        });

        // Envoyer l'email d'invitation
        const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invitations/${token}`;

        try {
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'notifications@finsights.fr',
                to: email,
                subject: `Invitation à rejoindre ${invitation.company.name} sur FinSights`,
                html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Invitation FinSights</h1>
        </div>
        <div class="content">
            <p>Bonjour,</p>
            <p><strong>${invitation.inviter.name || invitation.inviter.email}</strong> vous invite à rejoindre <strong>${invitation.company.name}</strong> sur FinSights.</p>
            <p>Votre rôle sera : <strong>${getRoleLabel(role)}</strong></p>
            <p>
                <a href="${inviteUrl}" class="button">Accepter l'invitation</a>
            </p>
            <p style="color: #666; font-size: 14px;">
                Ou copiez ce lien dans votre navigateur :<br>
                <code style="background: #e0e0e0; padding: 5px 10px; border-radius: 3px;">${inviteUrl}</code>
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
                Cette invitation expire le ${expiresAt.toLocaleDateString('fr-FR', { dateStyle: 'long' })}.
            </p>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} FinSights - CFO Virtuel pour PME</p>
        </div>
    </div>
</body>
</html>
                `,
            });
        } catch (emailError) {
            console.error('Erreur envoi email:', emailError);
            // Ne pas bloquer la création de l'invitation si l'email échoue
        }

        return NextResponse.json(
            {
                success: true,
                invitation: {
                    id: invitation.id,
                    email: invitation.email,
                    role: invitation.role,
                    status: invitation.status,
                    expiresAt: invitation.expiresAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Erreur création invitation:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création de l\'invitation' },
            { status: 500 }
        );
    }
}

/**
 * API Route: GET /api/invitations
 * Lister les invitations envoyées pour une entreprise
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const companyId = searchParams.get('companyId');

        if (!companyId) {
            return NextResponse.json({ error: 'companyId requis' }, { status: 400 });
        }

        // Vérifier que l'utilisateur est membre de l'entreprise
        const member = await prisma.companyMember.findFirst({
            where: {
                companyId,
                userId: session.user.id,
            },
        });

        if (!member) {
            return NextResponse.json(
                { error: 'Vous n\'êtes pas membre de cette entreprise' },
                { status: 403 }
            );
        }

        // Récupérer les invitations
        const invitations = await prisma.invitation.findMany({
            where: { companyId },
            include: {
                inviter: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ invitations });
    } catch (error) {
        console.error('Erreur récupération invitations:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des invitations' },
            { status: 500 }
        );
    }
}

// Helper: Traduire le rôle en français
function getRoleLabel(role: Role): string {
    const labels = {
        OWNER: 'Propriétaire',
        ADMIN: 'Administrateur',
        EDITOR: 'Éditeur',
        VIEWER: 'Lecteur',
    };
    return labels[role] || role;
}
