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

interface WelcomeEmailProps {
    userName: string
    userEmail: string
    loginUrl: string
}

export const WelcomeEmail = ({
    userName,
    userEmail,
    loginUrl,
}: WelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>Bienvenue sur FinSight - Votre analyse financière commence maintenant</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Logo */}
                <Section style={logoSection}>
                    <Img
                        src="https://finsight.zineinsight.com/images/zineinsights_logo.jpeg"
                        width="48"
                        height="48"
                        alt="FinSight"
                        style={logo}
                    />
                    <Heading style={h1}>Bienvenue sur FinSight 🎉</Heading>
                </Section>

                {/* Main Content */}
                <Text style={text}>
                    Bonjour <strong>{userName}</strong>,
                </Text>

                <Text style={text}>
                    Votre compte FinSight est prêt ! Vous pouvez maintenant analyser vos données
                    financières en quelques secondes grâce à notre IA.
                </Text>

                <Section style={buttonContainer}>
                    <Button style={button} href={loginUrl}>
                        Accéder au dashboard
                    </Button>
                </Section>

                {/* Features List */}
                <Text style={featuresTitle}>Ce que vous pouvez faire dès maintenant :</Text>
                <ul style={featuresList}>
                    <li style={featuresItem}>📊 Importer vos fichiers CSV/Excel</li>
                    <li style={featuresItem}>🤖 Interroger l'IA Copilot sur vos KPIs</li>
                    <li style={featuresItem}>📈 Visualiser 15+ indicateurs en temps réel</li>
                    <li style={featuresItem}>💾 Sauvegarder et partager vos dashboards</li>
                </ul>

                <Hr style={hr} />

                {/* Footer */}
                <Text style={footer}>
                    Besoin d'aide ? Consultez notre{' '}
                    <Link href="https://finsight.zineinsight.com/faq" style={link}>
                        FAQ
                    </Link>{' '}
                    ou contactez-nous à{' '}
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

export default WelcomeEmail
