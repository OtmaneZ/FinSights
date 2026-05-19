import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components'
import * as React from 'react'

interface TemplateWelcomeEmailProps {
    userName: string
    userEmail: string
    templateName: string
    downloadUrl: string
}

export const TemplateWelcomeEmail = ({
    userName = 'Jean',
    userEmail = 'jean@exemple.fr',
    templateName = 'Prévisionnel Trésorerie 90j',
    downloadUrl = 'https://finsight.zineinsight.com/templates/download',
}: TemplateWelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>Votre template {templateName} est prêt + 3 bonus exclusifs</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Header avec logo */}
                <Section style={header}>
                    <Img
                        src="https://finsight.zineinsight.com/images/logo-white.png"
                        width="120"
                        height="40"
                        alt="FinSight"
                        style={logo}
                    />
                </Section>

                {/* Hero section */}
                <Section style={content}>
                    <Heading style={h1}>
                        🎉 Votre template est prêt, {userName} !
                    </Heading>

                    <Text style={text}>
                        Merci d'avoir téléchargé le <strong>{templateName}</strong>.
                        Vous avez fait le premier pas vers un pilotage trésorerie serein.
                    </Text>

                    {/* CTA principal */}
                    <Button style={button} href={downloadUrl}>
                        📥 Télécharger mon template Excel
                    </Button>

                    {/* Section bonus */}
                    <Section style={bonusSection}>
                        <Heading style={h2}>🎁 Bonus exclusifs offerts</Heading>
                        
                        <Section style={bonusItem}>
                            <Text style={bonusTitle}>1️⃣ Checklist 10 signaux d'alerte trésorerie</Text>
                            <Text style={bonusDescription}>
                                PDF 2 pages : les signaux qui doivent vous alerter (retards fournisseurs,
                                DSO qui monte, découverts récurrents...)
                            </Text>
                        </Section>

                        <Section style={bonusItem}>
                            <Text style={bonusTitle}>2️⃣ Calculateur BFR automatique</Text>
                            <Text style={bonusDescription}>
                                Outil en ligne gratuit pour calculer votre Besoin en Fonds de Roulement
                                en 2 minutes : <Link href="https://finsight.zineinsight.com/calculateurs/bfr" style={link}>Accéder au calculateur</Link>
                            </Text>
                        </Section>

                        <Section style={bonusItem}>
                            <Text style={bonusTitle}>3️⃣ Articles experts trésorerie</Text>
                            <Text style={bonusDescription}>
                                Accès à notre bibliothèque d'articles : pilotage 90j, optimisation BFR,
                                relances clients efficaces.
                            </Text>
                        </Section>
                    </Section>

                    {/* Next steps */}
                    <Section style={stepsSection}>
                        <Heading style={h2}>📋 Prochaines étapes</Heading>
                        <Text style={stepText}>
                            <strong>Aujourd'hui</strong> : Télécharger le template + remplir vos données
                        </Text>
                        <Text style={stepText}>
                            <strong>Dans 2 jours</strong> : Je vous envoie un tutoriel vidéo (3 min)
                            pour utiliser le template comme un pro
                        </Text>
                        <Text style={stepText}>
                            <strong>Dans 5 jours</strong> : Cas client réel d'une PME qui a transformé
                            sa trésorerie avec cette méthode
                        </Text>
                    </Section>

                    {/* CTA secondaire */}
                    <Section style={ctaSection}>
                        <Text style={text}>
                            <strong>Besoin d'aide personnalisée ?</strong>
                        </Text>
                        <Text style={text}>
                            Je propose des diagnostics gratuits de 30 min pour identifier
                            vos quick wins trésorerie.
                        </Text>
                        <Button style={buttonSecondary} href="https://calendly.com/zineinsight/15min">
                            📅 Réserver un créneau gratuit
                        </Button>
                    </Section>

                    {/* Signature */}
                    <Section style={signature}>
                        <Text style={signatureText}>
                            À très vite,<br />
                            <strong>Otmane Boulahia</strong><br />
                            Consultant BI Finance & Fondateur FinSight<br />
                            <Link href="mailto:otmane@zineinsight.com" style={link}>
                                otmane@zineinsight.com
                            </Link>
                        </Text>
                    </Section>

                    {/* PS */}
                    <Section style={psSection}>
                        <Text style={psText}>
                            <strong>P.S.</strong> Vous recevez cet email car vous avez téléchargé
                            un template FinSight. Si vous avez des questions, répondez directement
                            à cet email - je lis et réponds personnellement à tous les messages.
                        </Text>
                    </Section>
                </Section>

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>
                        FinSight - Audit Power BI · FinSight™
                    </Text>
                    <Text style={footerText}>
                        <Link href="https://finsight.zineinsight.com" style={footerLink}>
                            Site web
                        </Link>
                        {' • '}
                        <Link href="https://finsight.zineinsight.com/blog" style={footerLink}>
                            Blog
                        </Link>
                        {' • '}
                        <Link href="https://finsight.zineinsight.com/consulting" style={footerLink}>
                            Consulting BI Finance
                        </Link>
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
)

export default TemplateWelcomeEmail

// ============================================================================
// STYLES
// ============================================================================

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    maxWidth: '600px',
}

const header = {
    backgroundColor: '#3b82f6',
    padding: '24px',
    textAlign: 'center' as const,
}

const logo = {
    margin: '0 auto',
}

const content = {
    padding: '32px 40px',
}

const h1 = {
    color: '#1f2937',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '16px',
    lineHeight: '1.3',
}

const h2 = {
    color: '#1f2937',
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '12px',
    marginTop: '32px',
}

const text = {
    color: '#374151',
    fontSize: '16px',
    lineHeight: '24px',
    marginBottom: '16px',
}

const button = {
    backgroundColor: '#3b82f6',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '14px 20px',
    marginTop: '24px',
    marginBottom: '24px',
}

const buttonSecondary = {
    backgroundColor: '#10b981',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '14px 20px',
    marginTop: '16px',
    marginBottom: '16px',
}

const bonusSection = {
    backgroundColor: '#f9fafb',
    padding: '24px',
    borderRadius: '8px',
    marginTop: '32px',
    marginBottom: '32px',
}

const bonusItem = {
    marginBottom: '20px',
}

const bonusTitle = {
    color: '#1f2937',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '6px',
    marginTop: '0',
}

const bonusDescription = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '20px',
    marginTop: '4px',
    marginBottom: '0',
}

const stepsSection = {
    marginTop: '32px',
    marginBottom: '32px',
}

const stepText = {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '22px',
    marginBottom: '12px',
    paddingLeft: '8px',
    borderLeft: '3px solid #3b82f6',
}

const ctaSection = {
    backgroundColor: '#fef3c7',
    padding: '24px',
    borderRadius: '8px',
    marginTop: '32px',
    marginBottom: '32px',
    textAlign: 'center' as const,
}

const signature = {
    marginTop: '40px',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb',
}

const signatureText = {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '22px',
}

const psSection = {
    marginTop: '32px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
}

const psText = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '20px',
    fontStyle: 'italic',
}

const link = {
    color: '#3b82f6',
    textDecoration: 'underline',
}

const footer = {
    padding: '0 40px',
    marginTop: '32px',
    textAlign: 'center' as const,
}

const footerText = {
    color: '#6b7280',
    fontSize: '13px',
    lineHeight: '20px',
    marginTop: '8px',
}

const footerLink = {
    color: '#3b82f6',
    textDecoration: 'none',
}
