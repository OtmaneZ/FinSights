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

export interface CalculatorReportEmailProps {
  calculatorName: string
  summary: { label: string; value: string }[]
  diagnosticUrl: string
}

export const CalculatorReportEmail = ({
  calculatorName,
  summary,
  diagnosticUrl,
}: CalculatorReportEmailProps) => (
  <Html>
    <Head />
    <Preview>Votre rapport {calculatorName} — FinSight™</Preview>
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
          <Heading style={h1}>Votre rapport {calculatorName}</Heading>
        </Section>

        <Text style={text}>Bonjour,</Text>
        <Text style={text}>
          Voici votre rapport <strong>{calculatorName}</strong> personnalisé en pièce jointe (PDF).
        </Text>

        <Text style={muted}>Indicateurs clés</Text>
        <Section style={cards}>
          {summary.slice(0, 3).map((row) => (
            <Section key={row.label} style={card}>
              <Text style={cardLabel}>{row.label}</Text>
              <Text style={cardValue}>{row.value}</Text>
            </Section>
          ))}
        </Section>

        <Section style={buttonContainer}>
          <Button style={button} href={diagnosticUrl}>
            Voir mon Score FinSight™ complet
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={text}>
          À très vite,
          <br />
          <strong>Otmane Boulahia</strong>
          <br />
          Fondateur, ZineInsight
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
  marginBottom: '24px',
}

const logo = {
  margin: '0 auto 12px',
}

const h1 = {
  color: '#0f172a',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0',
}

const text = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const muted = {
  color: '#64748b',
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '0 0 10px',
}

const cards = {
  margin: '0 0 18px',
}

const card = {
  border: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
  borderRadius: '10px',
  padding: '14px 16px',
  margin: '0 0 10px',
}

const cardLabel = {
  margin: '0',
  color: '#64748b',
  fontSize: '12px',
  fontWeight: '600',
}

const cardValue = {
  margin: '6px 0 0',
  color: '#0f172a',
  fontSize: '18px',
  fontWeight: '800',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '22px 0 8px',
}

const button = {
  backgroundColor: '#0052cc',
  borderRadius: '10px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 18px',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '22px 0',
}

const footer = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: '0',
}

const link = {
  color: '#0052cc',
  textDecoration: 'underline',
}
