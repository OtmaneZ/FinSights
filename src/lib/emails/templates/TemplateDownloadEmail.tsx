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

export interface TemplateDownloadEmailProps {
  firstName: string
  templateName: string
  calculatorsUrl: string
  privacyUrl: string
}

export const TemplateDownloadEmail = ({
  firstName,
  templateName,
  calculatorsUrl,
  privacyUrl,
}: TemplateDownloadEmailProps) => (
  <Html>
    <Head />
    <Preview>Votre template Excel {templateName} — FinSight</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img
            src="https://finsight.zineinsight.com/images/zineinsights_logo.jpeg"
            width="48"
            height="48"
            alt="FinSight"
            style={logo}
          />
          <Heading style={h1}>Votre template Excel</Heading>
        </Section>

        <Text style={text}>Bonjour {firstName},</Text>

        <Text style={text}>
          Voici votre <strong>{templateName}</strong> FinSight.
        </Text>

        <Text style={text}>Le fichier est en pièce jointe.</Text>

        <Section style={buttonContainer}>
          <Button style={button} href={calculatorsUrl}>
            Découvrir les autres outils gratuits →
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={footerMuted}>
          Vous recevez cet email suite à votre demande sur FinSight. Pour ne plus recevoir nos emails
          utiles sur le pilotage financier, répondez à ce message ou consultez notre{' '}
          <Link href={privacyUrl} style={link}>
            politique de confidentialité
          </Link>
          .
        </Text>

        <Text style={footer}>
          FinSight™ —{' '}
          <Link href="https://finsight.zineinsight.com" style={link}>
            finsight.zineinsight.com
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

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
  fontSize: '24px',
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
  margin: '28px 0',
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
}

const hr = {
  borderColor: '#e9ecef',
  margin: '28px 0',
}

const footerMuted = {
  color: '#6c757d',
  fontSize: '13px',
  lineHeight: '20px',
  marginTop: '8px',
}

const footer = {
  color: '#6c757d',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  marginTop: '20px',
}

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
}
