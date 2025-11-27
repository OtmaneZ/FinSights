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

interface UpgradeSuccessEmailProps {
    userName: string
    plan: 'PRO' | 'SCALE'
    amount: number
    nextBillingDate: string
    dashboardUrl: string
}

export const UpgradeSuccessEmail = ({
    userName,
    plan,
    amount,
    nextBillingDate,
    dashboardUrl,
}: UpgradeSuccessEmailProps) => {
    const planFeatures = {
        PRO: [
            '🚀 Requêtes IA Copilot illimitées',
            '💾 Sauvegarde cloud illimitée',
            '📊 Dashboards illimités',
            '🔄 Synchronisation temps réel',
            '📧 Support prioritaire',
        ],
        SCALE: [
            '🔌 API REST complète',
            '🔑 10 000 appels API/mois',
            '🎯 Webhooks personnalisés',
            '🤝 Multi-utilisateurs (5 sièges)',
            '⚡ Support premium 24/7',
            '🔒 SLA 99.9% uptime',
        ],
    }

    return (
        <Html>
            <Head />
            <Preview>Bienvenue dans le plan {plan} de FinSight 🎉</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Logo & Header */}
                    <Section style={logoSection}>
                        <Img
                            src="https://finsight.zineinsight.com/icon.svg"
                            width="48"
                            height="48"
                            alt="FinSight"
                            style={logo}
                        />
                        <Heading style={h1}>Passage au plan {plan} réussi ! 🚀</Heading>
                    </Section>

                    {/* Main Content */}
                    <Text style={text}>
                        Bonjour <strong>{userName}</strong>,
                    </Text>

                    <Text style={text}>
                        Votre passage au plan <strong>{plan}</strong> a été confirmé. Vous avez
                        maintenant accès à toutes les fonctionnalités premium !
                    </Text>

                    {/* Billing Info */}
                    <Section style={billingBox}>
                        <Text style={billingTitle}>Détails de votre abonnement</Text>
                        <Text style={billingItem}>
                            <strong>Plan :</strong> {plan}
                        </Text>
                        <Text style={billingItem}>
                            <strong>Montant :</strong> {amount}€/mois
                        </Text>
                        <Text style={billingItem}>
                            <strong>Prochain paiement :</strong> {nextBillingDate}
                        </Text>
                    </Section>

                    <Section style={buttonContainer}>
                        <Button style={button} href={dashboardUrl}>
                            Découvrir mes nouvelles fonctionnalités
                        </Button>
                    </Section>

                    {/* Features List */}
                    <Text style={featuresTitle}>Vos nouveaux avantages {plan} :</Text>
                    <ul style={featuresList}>
                        {planFeatures[plan].map((feature, index) => (
                            <li key={index} style={featuresItem}>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <Hr style={hr} />

                    {/* Footer */}
                    <Text style={footer}>
                        Vous pouvez gérer votre abonnement à tout moment depuis{' '}
                        <Link
                            href="https://finsight.zineinsight.com/account/billing"
                            style={link}
                        >
                            votre espace compte
                        </Link>
                        .
                    </Text>

                    <Text style={footer}>
                        Des questions ? Contactez-nous à{' '}
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
}

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
    marginBottom: '32px',
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

const text = {
    color: '#495057',
    fontSize: '16px',
    lineHeight: '24px',
    marginBottom: '16px',
}

const billingBox = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
}

const billingTitle = {
    color: '#212529',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px',
    marginTop: '0',
}

const billingItem = {
    color: '#495057',
    fontSize: '15px',
    lineHeight: '24px',
    margin: '8px 0',
}

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '32px 0',
}

const button = {
    backgroundColor: '#0078d4',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '14px 32px',
}

const featuresTitle = {
    color: '#212529',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '32px',
    marginBottom: '12px',
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

export default UpgradeSuccessEmail
