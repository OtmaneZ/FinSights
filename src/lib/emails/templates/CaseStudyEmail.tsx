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

interface CaseStudyEmailProps {
    userName: string
    caseStudyUrl?: string
}

export const CaseStudyEmail = ({
    userName = 'Jean',
    caseStudyUrl = 'https://finsight.zineinsight.com/case-studies/pme-services-8m',
}: CaseStudyEmailProps) => (
    <Html>
        <Head />
        <Preview>Cas client : PME Services 8M€ - De 30j de visibilité à 120j en 60 jours</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Header */}
                <Section style={header}>
                    <Img
                        src="https://finsight.zineinsight.com/images/logo-white.png"
                        width="120"
                        height="40"
                        alt="FinSight"
                        style={logo}
                    />
                </Section>

                {/* Content */}
                <Section style={content}>
                    <Heading style={h1}>
                        💼 Cas client : Comment une PME Services a résolu sa trésorerie
                    </Heading>

                    <Text style={text}>
                        Bonjour {userName},
                    </Text>

                    <Text style={text}>
                        Aujourd'hui, je vous partage l'histoire de <strong>Thomas Mercier</strong>,
                        dirigeant d'une agence de conseil B2B (8M€ CA, 25 salariés).
                    </Text>

                    <Text style={text}>
                        Situation en <strong>octobre 2025</strong> : stress trésorerie permanent,
                        découverts récurrents, aucune visibilité au-delà de 30 jours.
                    </Text>

                    {/* Problem section */}
                    <Section style={problemSection}>
                        <Heading style={h2}>🚨 Le problème initial</Heading>
                        
                        <Section style={metricBox}>
                            <Text style={metricValue}>3-4 fois/mois</Text>
                            <Text style={metricLabel}>Découverts bancaires</Text>
                        </Section>

                        <Section style={metricBox}>
                            <Text style={metricValue}>19 500€/an</Text>
                            <Text style={metricLabel}>Coût agios + pénalités</Text>
                        </Section>

                        <Section style={metricBox}>
                            <Text style={metricValue}>DSO 68 jours</Text>
                            <Text style={metricLabel}>Délai encaissement (benchmark 45j)</Text>
                        </Section>

                        <Section style={metricBox}>
                            <Text style={metricValue}>0 visibilité</Text>
                            <Text style={metricLabel}>Au-delà de 30 jours</Text>
                        </Section>

                        <Text style={quoteText}>
                            « Je gérais la trésorerie au jour le jour. Chaque début de mois,
                            c'était l'angoisse. Je découvrais les problèmes quand il était trop tard. »
                        </Text>
                        <Text style={quoteName}>— Thomas Mercier, Dirigeant</Text>
                    </Section>

                    {/* Solution section */}
                    <Section style={solutionSection}>
                        <Heading style={h2}>✅ Les actions mises en place</Heading>
                        
                        <Section style={actionItem}>
                            <Text style={actionWeek}>Semaine 1-2</Text>
                            <Text style={actionTitle}>Diagnostic & Prévisionnel 90j</Text>
                            <ul style={actionList}>
                                <li style={actionPoint}>Mise en place template Excel prévisionnel 90 jours</li>
                                <li style={actionPoint}>Identification du point bas récurrent : 19 du mois (TVA)</li>
                                <li style={actionPoint}>Seuil d'alerte défini : 50 000€ (2 mois charges fixes)</li>
                            </ul>
                        </Section>

                        <Section style={actionItem}>
                            <Text style={actionWeek}>Semaine 3-4</Text>
                            <Text style={actionTitle}>Optimisation Encaissements</Text>
                            <ul style={actionList}>
                                <li style={actionPoint}>Négociation CGV : paiement à 30j (était 45j)</li>
                                <li style={actionPoint}>Relances systématiques J-3 avant échéance</li>
                                <li style={actionPoint}>3 gros clients : prélèvement automatique activé</li>
                            </ul>
                        </Section>

                        <Section style={actionItem}>
                            <Text style={actionWeek}>Semaine 5-8</Text>
                            <Text style={actionTitle}>Rituel Hebdomadaire + Alertes</Text>
                            <ul style={actionList}>
                                <li style={actionPoint}>Lundi 9h : Revue trésorerie 30 min (non négociable)</li>
                                <li style={actionPoint}>Alertes automatiques Excel (email si seuil &lt; 60k€)</li>
                                <li style={actionPoint}>Négociation ligne crédit préventive : 100k€ (jamais utilisée)</li>
                            </ul>
                        </Section>
                    </Section>

                    {/* Results section */}
                    <Section style={resultsSection}>
                        <Heading style={h2}>📈 Résultats après 60 jours</Heading>
                        
                        <Section style={resultGrid}>
                            <Section style={resultCard}>
                                <Text style={resultEmoji}>📊</Text>
                                <Text style={resultBefore}>DSO 68j</Text>
                                <Text style={resultArrow}>→</Text>
                                <Text style={resultAfter}>DSO 49j</Text>
                                <Text style={resultImpact}>-19 jours</Text>
                            </Section>

                            <Section style={resultCard}>
                                <Text style={resultEmoji}>💰</Text>
                                <Text style={resultBefore}>3-4 découverts/mois</Text>
                                <Text style={resultArrow}>→</Text>
                                <Text style={resultAfter}>0 découvert</Text>
                                <Text style={resultImpact}>100% résolu</Text>
                            </Section>

                            <Section style={resultCard}>
                                <Text style={resultEmoji}>💡</Text>
                                <Text style={resultBefore}>Visibilité 30j</Text>
                                <Text style={resultArrow}>→</Text>
                                <Text style={resultAfter}>Visibilité 120j</Text>
                                <Text style={resultImpact}>+90 jours</Text>
                            </Section>

                            <Section style={resultCard}>
                                <Text style={resultEmoji}>💵</Text>
                                <Text style={resultBefore}>19 500€ agios/an</Text>
                                <Text style={resultArrow}>→</Text>
                                <Text style={resultAfter}>0€ agios</Text>
                                <Text style={resultImpact}>Économie totale</Text>
                            </Section>
                        </Section>

                        <Text style={quoteText}>
                            « En 2 mois, j'ai retrouvé la sérénité. Je peux maintenant prendre
                            des décisions stratégiques (recrutement, investissement) en sachant
                            où j'en suis. Le ROI est évident : économie 20k€ + stress divisé par 10. »
                        </Text>
                        <Text style={quoteName}>— Thomas Mercier, 60 jours après</Text>
                    </Section>

                    {/* Key lessons */}
                    <Section style={lessonsSection}>
                        <Heading style={h2}>🎓 3 leçons clés</Heading>
                        
                        <Section style={lessonItem}>
                            <Text style={lessonNumber}>1️⃣</Text>
                            <Section>
                                <Text style={lessonTitle}>Visibilité &gt; Optimisation</Text>
                                <Text style={lessonText}>
                                    Avant d'optimiser, il faut voir. Le prévisionnel 90j a révélé
                                    les problèmes structurels cachés.
                                </Text>
                            </Section>
                        </Section>

                        <Section style={lessonItem}>
                            <Text style={lessonNumber}>2️⃣</Text>
                            <Section>
                                <Text style={lessonTitle}>Rituel &gt; Outils</Text>
                                <Text style={lessonText}>
                                    Le lundi 9h est sacré. Sans discipline, même le meilleur
                                    template ne sert à rien.
                                </Text>
                            </Section>
                        </Section>

                        <Section style={lessonItem}>
                            <Text style={lessonNumber}>3️⃣</Text>
                            <Section>
                                <Text style={lessonTitle}>Anticipation = Pouvoir de négociation</Text>
                                <Text style={lessonText}>
                                    Demander une ligne crédit AVANT le besoin change tout.
                                    La banque accepte plus facilement.
                                </Text>
                            </Section>
                        </Section>
                    </Section>

                    {/* CTA */}
                    <Section style={ctaSection}>
                        <Heading style={h2}>💬 Votre situation ressemble ?</Heading>
                        <Text style={text}>
                            Si vous vivez les mêmes problèmes que Thomas (découverts, stress trésorerie,
                            manque de visibilité), je peux vous aider à mettre en place la même solution.
                        </Text>
                        <Text style={text}>
                            <strong>Diagnostic gratuit 30 minutes</strong> : j'analyse votre situation,
                            j'identifie vos quick wins, et je vous montre le plan d'action adapté.
                        </Text>
                        <Button style={button} href="https://calendly.com/zineinsight/15min">
                            📅 Réserver mon diagnostic gratuit
                        </Button>
                        <Text style={guaranteeText}>
                            ✅ Sans engagement • ✅ 30 minutes • ✅ Plan d'action concret
                        </Text>
                    </Section>

                    {/* Signature */}
                    <Section style={signature}>
                        <Text style={signatureText}>
                            À votre succès,<br />
                            <strong>Otmane Boulahia</strong><br />
                            DAF Externalisé & Fondateur FinSight<br />
                            <Link href="mailto:otmane@zineinsight.com" style={link}>
                                otmane@zineinsight.com
                            </Link>
                        </Text>
                    </Section>

                    {/* Next email teaser */}
                    <Section style={teaserSection}>
                        <Text style={teaserText}>
                            🔜 <strong>Dans 5 jours</strong> : Les 3 signaux d'alerte trésorerie
                            que 90% des dirigeants ignorent (jusqu'à ce qu'il soit trop tard).
                        </Text>
                    </Section>
                </Section>

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>
                        FinSight - Pilotage financier simplifié pour PME/ETI
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
                            Services DAF
                        </Link>
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
)

export default CaseStudyEmail

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
    marginBottom: '16px',
    marginTop: '32px',
}

const text = {
    color: '#374151',
    fontSize: '16px',
    lineHeight: '24px',
    marginBottom: '16px',
}

const problemSection = {
    backgroundColor: '#fef2f2',
    padding: '24px',
    borderRadius: '8px',
    marginTop: '24px',
    marginBottom: '32px',
    borderLeft: '4px solid #ef4444',
}

const metricBox = {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
    textAlign: 'center' as const,
}

const metricValue = {
    color: '#ef4444',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '4px',
}

const metricLabel = {
    color: '#6b7280',
    fontSize: '13px',
    marginTop: '0',
    marginBottom: '0',
}

const quoteText = {
    color: '#374151',
    fontSize: '16px',
    lineHeight: '24px',
    fontStyle: 'italic',
    marginTop: '20px',
    marginBottom: '8px',
    paddingLeft: '16px',
    borderLeft: '3px solid #3b82f6',
}

const quoteName = {
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '0',
    marginBottom: '0',
    paddingLeft: '16px',
}

const solutionSection = {
    marginTop: '32px',
    marginBottom: '32px',
}

const actionItem = {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '16px',
}

const actionWeek = {
    color: '#3b82f6',
    fontSize: '13px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    marginBottom: '8px',
    marginTop: '0',
}

const actionTitle = {
    color: '#1f2937',
    fontSize: '17px',
    fontWeight: 'bold',
    marginBottom: '12px',
    marginTop: '0',
}

const actionList = {
    paddingLeft: '20px',
    marginTop: '8px',
    marginBottom: '0',
}

const actionPoint = {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '22px',
    marginBottom: '6px',
}

const resultsSection = {
    backgroundColor: '#ecfdf5',
    padding: '24px',
    borderRadius: '8px',
    marginTop: '32px',
    marginBottom: '32px',
    borderLeft: '4px solid #10b981',
}

const resultGrid = {
    marginTop: '20px',
    marginBottom: '24px',
}

const resultCard = {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
    textAlign: 'center' as const,
}

const resultEmoji = {
    fontSize: '32px',
    marginBottom: '12px',
}

const resultBefore = {
    color: '#6b7280',
    fontSize: '13px',
    marginBottom: '4px',
    textDecoration: 'line-through',
}

const resultArrow = {
    color: '#10b981',
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '4px',
    marginBottom: '4px',
}

const resultAfter = {
    color: '#1f2937',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '4px',
    marginBottom: '8px',
}

const resultImpact = {
    color: '#10b981',
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '0',
    marginBottom: '0',
}

const lessonsSection = {
    marginTop: '32px',
    marginBottom: '32px',
}

const lessonItem = {
    display: 'flex',
    marginBottom: '20px',
    alignItems: 'flex-start',
}

const lessonNumber = {
    fontSize: '28px',
    marginRight: '12px',
    minWidth: '40px',
}

const lessonTitle = {
    color: '#1f2937',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '6px',
    marginTop: '0',
}

const lessonText = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '20px',
    marginTop: '0',
    marginBottom: '0',
}

const ctaSection = {
    backgroundColor: '#fef3c7',
    padding: '32px 24px',
    borderRadius: '8px',
    marginTop: '40px',
    marginBottom: '32px',
    textAlign: 'center' as const,
}

const button = {
    backgroundColor: '#10b981',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '16px 24px',
    marginTop: '20px',
    marginBottom: '16px',
}

const guaranteeText = {
    color: '#6b7280',
    fontSize: '14px',
    marginTop: '12px',
    marginBottom: '0',
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

const teaserSection = {
    marginTop: '32px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
}

const teaserText = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '20px',
    textAlign: 'center' as const,
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
