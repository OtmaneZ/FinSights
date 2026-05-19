import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface WeeklyNewsletterEmailProps {
  recipientName?: string
  articleTitle: string
  articleUrl: string
  summary: string
  unsubscribeUrl: string
}

export const WeeklyNewsletterEmail = ({
  recipientName = 'abonne',
  articleTitle,
  articleUrl,
  summary,
  unsubscribeUrl,
}: WeeklyNewsletterEmailProps) => (
  <Html>
    <Head />
    <Preview>Le Pilote FinSight - 1 article par semaine</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src="https://finsight.zineinsight.com/images/zineinsights_logo.jpeg"
            width="44"
            height="44"
            alt="FinSight"
            style={logo}
          />
          <Text style={headerEyebrow}>Le Pilote FinSight</Text>
          <Heading style={headerTitle}>Votre article de la semaine</Heading>
        </Section>

        <Section style={content}>
          <Text style={text}>Bonjour {recipientName},</Text>
          <Text style={text}>
            Voici votre article hebdomadaire pour piloter votre finance avec plus de clarte.
          </Text>

          <Section style={articleCard}>
            <Text style={articleLabel}>Article de la semaine</Text>
            <Heading style={articleTitleStyle}>{articleTitle}</Heading>
            <Text style={articleSummary}>{summary}</Text>
            <Button style={button} href={articleUrl}>
              Lire l&apos;article
            </Button>
          </Section>

          <Text style={text}>A tres bientot,</Text>
          <Text style={signature}>
            <strong>Otmane BOULAHIA</strong>
            <br />
            Consultant BI Finance · TPE et PME
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            FinSight - finsight.zineinsight.com
            <br />
            <a href={unsubscribeUrl} style={footerLink}>Se desinscrire</a>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default WeeklyNewsletterEmail

const main = {
  backgroundColor: '#eef2f7',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '24px auto',
  borderRadius: '14px',
  overflow: 'hidden',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#1B3A5C',
  textAlign: 'center' as const,
  padding: '28px 20px',
}

const logo = {
  margin: '0 auto 10px',
  borderRadius: '8px',
}

const headerEyebrow = {
  margin: '0',
  color: '#a9c3dd',
  fontSize: '12px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  fontWeight: '700',
}

const headerTitle = {
  margin: '6px 0 0',
  color: '#ffffff',
  fontSize: '26px',
  fontWeight: '700',
}

const content = {
  padding: '28px 30px',
}

const text = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 14px',
}

const articleCard = {
  margin: '16px 0 20px',
  border: '1px solid #dbe6f2',
  borderRadius: '12px',
  backgroundColor: '#f8fbff',
  padding: '18px',
}

const articleLabel = {
  margin: '0 0 8px',
  color: '#1B3A5C',
  fontSize: '12px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
}

const articleTitleStyle = {
  margin: '0 0 10px',
  color: '#0f172a',
  fontSize: '22px',
  lineHeight: '1.3',
}

const articleSummary = {
  margin: '0 0 16px',
  color: '#475569',
  fontSize: '14px',
  lineHeight: '22px',
}

const button = {
  backgroundColor: '#1B3A5C',
  color: '#ffffff',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '700',
  fontSize: '14px',
  padding: '12px 18px',
}

const signature = {
  color: '#334155',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
}

const footer = {
  backgroundColor: '#f8fafc',
  borderTop: '1px solid #e2e8f0',
  padding: '18px 22px',
}

const footerText = {
  margin: '0',
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '18px',
  textAlign: 'center' as const,
}

const footerLink = {
  color: '#1B3A5C',
  textDecoration: 'underline',
}
