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

interface UsageAlertEmailProps {
    userName: string
    plan: 'FREE' | 'PRO' | 'SCALE'
    resource: 'copilot_queries' | 'api_calls' | 'storage'
    currentUsage: number
    limit: number
    percentage: number
    upgradeUrl: string
}

export const UsageAlertEmail = ({
    userName,
    plan,
    resource,
    currentUsage,
    limit,
    percentage,
    upgradeUrl,
}: UsageAlertEmailProps) => {
    const resourceLabels = {
        copilot_queries: 'requêtes IA Copilot',
        api_calls: "appels API",
        storage: 'espace de stockage',
    }

    const resourceEmojis = {
        copilot_queries: '🤖',
        api_calls: '🔌',
        storage: '💾',
    }

    const thresholdColor = percentage >= 90 ? '#dc3545' : '#ffc107'
    const thresholdBg = percentage >= 90 ? '#f8d7da' : '#fff3cd'
    const thresholdBorder = percentage >= 90 ? '#f5c6cb' : '#ffc107'

    return (
        <Html>
            <Head />
            <Preview>Alerte d'utilisation FinSight - {percentage.toString()}% atteint</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Logo & Header */}
                    <Section style={logoSection}>
                        <Img
                            src="https://getfinsight.fr/images/zineinsights_logo.jpeg"
                            width="48"
                            height="48"
                            alt="FinSight"
                            style={logo}
                        />
                        <Heading style={h1}>
                            {resourceEmojis[resource]} Alerte d'utilisation
                        </Heading>
                    </Section>

                    {/* Alert Box */}
                    <Section
                        style={{
                            ...alertBox,
                            backgroundColor: thresholdBg,
                            border: `2px solid ${thresholdBorder}`,
                        }}
                    >
                        <Text style={{ ...alertText, color: thresholdColor }}>
                            ⚠️ {percentage}% de votre quota atteint
                        </Text>
                    </Section>

                    {/* Main Content */}
                    <Text style={text}>
                        Bonjour <strong>{userName}</strong>,
                    </Text>

                    <Text style={text}>
                        Vous avez utilisé <strong>{percentage}%</strong> de votre quota mensuel de{' '}
                        {resourceLabels[resource]}.
                    </Text>

                    {/* Usage Stats */}
                    <Section style={statsBox}>
                        <Text style={statsTitle}>Utilisation actuelle</Text>
                        <Section style={progressBarContainer}>
                            <Section
                                style={{
                                    ...progressBarFill,
                                    width: `${percentage}%`,
                                    backgroundColor: thresholdColor,
                                }}
                            />
                        </Section>
                        <Text style={statsText}>
                            <strong>
                                {currentUsage.toLocaleString('fr-FR')} / {limit.toLocaleString('fr-FR')}
                            </strong>{' '}
                            {resourceLabels[resource]}
                        </Text>
                    </Section>

                    {plan === 'FREE' && (
                        <>
                            <Text style={text}>
                                Pour continuer sans interruption, passez au{' '}
                                <strong>plan PRO</strong> et bénéficiez de :
                            </Text>

                            <ul style={featuresList}>
                                {resource === 'copilot_queries' && (
                                    <>
                                        <li style={featuresItem}>
                                            🚀 Requêtes IA Copilot <strong>illimitées</strong>
                                        </li>
                                        <li style={featuresItem}>💾 Sauvegarde cloud illimitée</li>
                                        <li style={featuresItem}>📊 Dashboards illimités</li>
                                    </>
                                )}
                                {resource === 'storage' && (
                                    <>
                                        <li style={featuresItem}>
                                            💾 Stockage <strong>illimité</strong>
                                        </li>
                                        <li style={featuresItem}>🤖 IA Copilot illimitée</li>
                                        <li style={featuresItem}>📈 Analytics avancées</li>
                                    </>
                                )}
                            </ul>

                            <Section style={buttonContainer}>
                                <Button style={button} href={upgradeUrl}>
                                    Passer au plan Business (99€/mois)
                                </Button>
                            </Section>
                        </>
                    )}

                    {plan === 'PRO' && resource === 'storage' && (
                        <>
                            <Text style={text}>
                                Besoin de plus d'espace ? Le <strong>plan SCALE</strong> vous
                                offre :
                            </Text>

                            <ul style={featuresList}>
                                <li style={featuresItem}>💾 Stockage premium augmenté</li>
                                <li style={featuresItem}>🔌 API REST complète</li>
                                <li style={featuresItem}>🎯 Webhooks personnalisés</li>
                                <li style={featuresItem}>🤝 Multi-utilisateurs (5 sièges)</li>
                            </ul>

                            <Section style={buttonContainer}>
                                <Button style={button} href={upgradeUrl}>
                                    Passer au plan SCALE (199€/mois)
                                </Button>
                            </Section>
                        </>
                    )}

                    {plan === 'SCALE' && resource === 'api_calls' && (
                        <>
                            <Text style={text}>
                                Vous approchez de votre limite de 10 000 appels API/mois.
                            </Text>

                            <Text style={text}>
                                Pour un quota personnalisé adapté à vos besoins, contactez notre
                                équipe ENTERPRISE.
                            </Text>

                            <Section style={buttonContainer}>
                                <Button style={button} href="mailto:enterprise@zineinsight.com">
                                    Contacter l'équipe ENTERPRISE
                                </Button>
                            </Section>
                        </>
                    )}

                    <Hr style={hr} />

                    {/* Footer */}
                    <Text style={footer}>
                        Vos quotas se réinitialisent automatiquement chaque mois.
                    </Text>

                    <Text style={footer}>
                        Questions ? Contactez-nous à{' '}
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

const alertBox = {
    borderRadius: '8px',
    padding: '16px',
    margin: '24px 0',
    textAlign: 'center' as const,
}

const alertText = {
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

const statsBox = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
}

const statsTitle = {
    color: '#212529',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    marginTop: '0',
    textAlign: 'center' as const,
}

const progressBarContainer = {
    width: '100%',
    height: '24px',
    backgroundColor: '#e9ecef',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '12px',
}

const progressBarFill = {
    height: '100%',
    transition: 'width 0.3s ease',
    borderRadius: '12px',
}

const statsText = {
    color: '#495057',
    fontSize: '15px',
    textAlign: 'center' as const,
    margin: '0',
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

export default UsageAlertEmail
