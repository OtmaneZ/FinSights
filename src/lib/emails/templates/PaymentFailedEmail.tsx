import * as React from 'react'
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components'

interface PaymentFailedEmailProps {
    userName: string
    plan: 'PRO' | 'SCALE'
    amount: number
    invoiceUrl: string
    updatePaymentUrl: string
}

export const PaymentFailedEmail = ({
    userName,
    plan,
    amount,
    invoiceUrl,
    updatePaymentUrl,
}: PaymentFailedEmailProps) => (
    <Html>
        <Head />
        <Preview>Échec du paiement FinSight - Action requise</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Logo & Header */}
                <Section style={logoSection}>
                    <Img
                        src="https://finsight.zineinsight.com/images/zineinsights_logo.jpeg"
                        width="48"
                        height="48"
                        alt="FinSight"
                        style={logo}
                    />
                    <Heading style={h1}>Échec du paiement</Heading>
                </Section>

                {/* Warning Box */}
                <Section style={warningBox}>
                    <Text style={warningText}>⚠️ Action requise</Text>
                </Section>

                {/* Main Content */}
                <Text style={text}>
                    Bonjour <strong>{userName}</strong>,
                </Text>

                <Text style={text}>
                    Le paiement de votre abonnement <strong>{plan}</strong> ({amount}€/mois) n'a
                    pas pu être traité.
                </Text>

                <Text style={text}>
                    <strong>Raisons possibles :</strong>
                </Text>
                <ul style={featuresList}>
                    <li style={featuresItem}>Carte bancaire expirée</li>
                    <li style={featuresItem}>Fonds insuffisants</li>
                    <li style={featuresItem}>Refus de la banque</li>
                    <li style={featuresItem}>Limite de paiement atteinte</li>
                </ul>

                <Text style={text}>
                    Pour continuer à profiter de vos fonctionnalités {plan}, veuillez mettre à jour
                    votre moyen de paiement dans les <strong>7 jours</strong>.
                </Text>

                <Section style={buttonContainer}>
                    <Button style={buttonPrimary} href={updatePaymentUrl}>
                        Mettre à jour mon paiement
                    </Button>
                </Section>

                <Section style={buttonContainer}>
                    <Button style={buttonSecondary} href={invoiceUrl}>
                        Voir la facture
                    </Button>
                </Section>

                <Hr style={hr} />

                {/* Info Box */}
                <Section style={infoBox}>
                    <Text style={infoTitle}>Que se passe-t-il si je ne paie pas ?</Text>
                    <Text style={infoText}>
                        • <strong>Jour 1-7 :</strong> Votre compte reste actif
                        <br />
                        • <strong>Jour 8 :</strong> Passage au plan FREE
                        <br />• <strong>Jour 30 :</strong> Suppression des données non
                        sauvegardées
                    </Text>
                </Section>

                {/* Footer */}
                <Text style={footer}>
                    Besoin d'aide ? Contactez notre équipe support à{' '}
                    <Link href="mailto:support@zineinsight.com" style={link}>
                        support@zineinsight.com
                    </Link>
                </Text>

                <Text style={footer}>
                    FinSight - L'analyse financière simplifiée par IA
                    <br />
                    Paris, France
                </Text>
            </Container>
        </Body>
    </Html>
)

// Styles
const main = {
    backgroundColor: '#f0f2f5',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
}

const container = {
    backgroundColor: '#ffffff',
    margin: '40px auto',
    padding: '40px',
    borderRadius: '12px',
    maxWidth: '600px',
}

const logoSection = {
    textAlign: 'center' as const,
    marginBottom: '24px',
}

const logo = {
    margin: '0 auto 16px',
}

const h1 = {
    color: '#212529',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0',
}

const warningBox = {
    backgroundColor: '#fff3cd',
    border: '2px solid #ffc107',
    borderRadius: '8px',
    padding: '16px',
    margin: '24px 0',
    textAlign: 'center' as const,
}

const warningText = {
    color: '#856404',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0',
}

const text = {
    color: '#495057',
    fontSize: '16px',
    lineHeight: '24px',
    marginBottom: '16px',
}

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '16px 0',
}

const buttonPrimary = {
    backgroundColor: '#dc3545',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '14px 32px',
}

const buttonSecondary = {
    backgroundColor: 'transparent',
    border: '2px solid #0078d4',
    borderRadius: '8px',
    color: '#0078d4',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 32px',
}

const featuresList = {
    color: '#495057',
    fontSize: '15px',
    lineHeight: '24px',
    paddingLeft: '20px',
    marginBottom: '24px',
}

const featuresItem = {
    marginBottom: '8px',
}

const infoBox = {
    backgroundColor: '#e7f3ff',
    border: '1px solid #b3d9ff',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
}

const infoTitle = {
    color: '#004085',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px',
    marginTop: '0',
}

const infoText = {
    color: '#004085',
    fontSize: '14px',
    lineHeight: '22px',
    margin: '0',
}

const hr = {
    borderColor: '#e9ecef',
    margin: '32px 0',
}

const footer = {
    color: '#6c757d',
    fontSize: '14px',
    lineHeight: '20px',
    textAlign: 'center' as const,
    marginTop: '16px',
}

const link = {
    color: '#0078d4',
    textDecoration: 'underline',
}

export default PaymentFailedEmail
