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

interface TutorialEmailProps {
    userName: string
    templateName: string
    videoUrl?: string
}

export const TutorialEmail = ({
    userName = 'Jean',
    templateName = 'Prévisionnel Trésorerie 90j',
    videoUrl = 'https://finsight.zineinsight.com/tutorials/tresorerie-90j',
}: TutorialEmailProps) => (
    <Html>
        <Head />
        <Preview>Tutoriel vidéo : Utiliser votre {templateName} comme un pro (3 min)</Preview>
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
                        🎬 Tutoriel : Maîtrisez votre {templateName}
                    </Heading>

                    <Text style={text}>
                        Bonjour {userName},
                    </Text>

                    <Text style={text}>
                        Il y a 2 jours, vous avez téléchargé le template <strong>{templateName}</strong>.
                        J'espère que vous avez pu commencer à l'explorer !
                    </Text>

                    <Text style={text}>
                        Aujourd'hui, je vous partage un <strong>tutoriel vidéo de 3 minutes</strong> qui
                        vous montre exactement comment l'utiliser pour piloter votre trésorerie efficacement.
                    </Text>

                    {/* Video thumbnail placeholder */}
                    <Section style={videoSection}>
                        <Img
                            src="https://finsight.zineinsight.com/images/tutorial-thumbnail.jpg"
                            width="520"
                            height="292"
                            alt="Tutoriel vidéo"
                            style={videoThumbnail}
                        />
                        <Button style={button} href={videoUrl}>
                            ▶️ Voir le tutoriel (3 min)
                        </Button>
                    </Section>

                    {/* Key points */}
                    <Section style={keyPointsSection}>
                        <Heading style={h2}>🎯 Ce que vous allez apprendre</Heading>
                        
                        <Section style={pointItem}>
                            <Text style={pointNumber}>1.</Text>
                            <Text style={pointText}>
                                <strong>Remplir vos données en 10 minutes</strong><br />
                                Solde initial, encaissements prévus, décaissements fixes et variables
                            </Text>
                        </Section>

                        <Section style={pointItem}>
                            <Text style={pointNumber}>2.</Text>
                            <Text style={pointText}>
                                <strong>Interpréter le graphique de trésorerie</strong><br />
                                Point bas, seuil d'alerte, zones de confort et de tension
                            </Text>
                        </Section>

                        <Section style={pointItem}>
                            <Text style={pointNumber}>3.</Text>
                            <Text style={pointText}>
                                <strong>Activer les alertes automatiques</strong><br />
                                Recevoir un email quand vous approchez du seuil critique
                            </Text>
                        </Section>

                        <Section style={pointItem}>
                            <Text style={pointNumber}>4.</Text>
                            <Text style={pointText}>
                                <strong>Rituel hebdomadaire 30 minutes</strong><br />
                                Mise à jour, détection des écarts, actions préventives
                            </Text>
                        </Section>
                    </Section>

                    {/* Cas pratique */}
                    <Section style={exampleSection}>
                        <Heading style={h2}>💼 Exemple pratique</Heading>
                        <Text style={text}>
                            Dans la vidéo, je vous montre le cas d'une <strong>PME Services 8M€ CA</strong>
                            qui a détecté un point bas à 36 000€ le 19 février (sous seuil de 50 000€).
                        </Text>
                        <Text style={text}>
                            Grâce au prévisionnel 90j :
                        </Text>
                        <ul style={list}>
                            <li style={listItem}>✅ Anticipation 13 jours à l'avance</li>
                            <li style={listItem}>✅ Négociation report fournisseur 15 000€</li>
                            <li style={listItem}>✅ Relance client prioritaire</li>
                            <li style={listItem}>✅ Résultat : crise évitée, économie 1 500€ agios</li>
                        </ul>
                    </Section>

                    {/* Resources */}
                    <Section style={resourcesSection}>
                        <Heading style={h2}>📚 Ressources complémentaires</Heading>
                        <Text style={resourceItem}>
                            📄 <Link href="https://finsight.zineinsight.com/blog/pilotage-tresorerie-90-jours-methode" style={link}>
                                Article : Pilotage Trésorerie 90 Jours - Méthode Complète
                            </Link>
                        </Text>
                        <Text style={resourceItem}>
                            🧮 <Link href="https://finsight.zineinsight.com/calculateurs/dso" style={link}>
                                Calculateur : Délai de Paiement Clients (DSO)
                            </Link>
                        </Text>
                        <Text style={resourceItem}>
                            📊 <Link href="https://finsight.zineinsight.com/blog/probleme-tresorerie-pme-10-signes" style={link}>
                                Guide : 10 Signaux d'Alerte Trésorerie PME
                            </Link>
                        </Text>
                    </Section>

                    {/* CTA */}
                    <Section style={ctaSection}>
                        <Text style={ctaText}>
                            <strong>❓ Questions ? Blocages ?</strong>
                        </Text>
                        <Text style={text}>
                            Je propose des sessions d'accompagnement personnalisées pour vous aider
                            à mettre en place votre pilotage trésorerie.
                        </Text>
                        <Button style={buttonSecondary} href="https://calendly.com/zineinsight/15min">
                            📞 Réserver un appel (gratuit)
                        </Button>
                    </Section>

                    {/* Signature */}
                    <Section style={signature}>
                        <Text style={signatureText}>
                            Bon pilotage,<br />
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
                            🔜 <strong>Dans 3 jours</strong> : Je vous partage le cas d'une PME
                            qui a résolu ses problèmes de trésorerie en 60 jours.
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

export default TutorialEmail

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

const button = {
    backgroundColor: '#ef4444',
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

const videoSection = {
    marginTop: '24px',
    marginBottom: '32px',
    textAlign: 'center' as const,
}

const videoThumbnail = {
    width: '100%',
    borderRadius: '8px',
    marginBottom: '16px',
}

const keyPointsSection = {
    backgroundColor: '#f9fafb',
    padding: '24px',
    borderRadius: '8px',
    marginTop: '32px',
    marginBottom: '32px',
}

const pointItem = {
    display: 'flex',
    marginBottom: '16px',
}

const pointNumber = {
    color: '#3b82f6',
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: '12px',
    minWidth: '24px',
}

const pointText = {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '22px',
    marginTop: '0',
    marginBottom: '0',
}

const exampleSection = {
    backgroundColor: '#ecfdf5',
    padding: '24px',
    borderRadius: '8px',
    marginTop: '32px',
    marginBottom: '32px',
    borderLeft: '4px solid #10b981',
}

const list = {
    paddingLeft: '20px',
    marginTop: '12px',
}

const listItem = {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '24px',
    marginBottom: '8px',
}

const resourcesSection = {
    marginTop: '32px',
    marginBottom: '32px',
}

const resourceItem = {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '24px',
    marginBottom: '12px',
}

const ctaSection = {
    backgroundColor: '#fef3c7',
    padding: '24px',
    borderRadius: '8px',
    marginTop: '32px',
    marginBottom: '32px',
    textAlign: 'center' as const,
}

const ctaText = {
    color: '#1f2937',
    fontSize: '18px',
    marginBottom: '12px',
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
