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

interface AlertSignalsEmailProps {
    userName: string
}

export const AlertSignalsEmail = ({
    userName = 'Jean',
}: AlertSignalsEmailProps) => (
    <Html>
        <Head />
        <Preview>🚨 3 signaux d'alerte trésorerie que vous devez surveiller maintenant</Preview>
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
                        🚨 3 signaux d'alerte trésorerie (avant la crise)
                    </Heading>

                    <Text style={text}>
                        Bonjour {userName},
                    </Text>

                    <Text style={text}>
                        J'ai accompagné 50+ PME/ETI en difficulté de trésorerie.
                    </Text>

                    <Text style={text}>
                        À chaque fois, les mêmes signaux apparaissent <strong>3 à 6 mois avant la crise</strong>.
                        Le problème ? <strong>90% des dirigeants les ignorent</strong> jusqu'au point de non-retour.
                    </Text>

                    <Text style={text}>
                        Voici les <strong>3 signaux que vous devez surveiller dès maintenant</strong> :
                    </Text>

                    {/* Signal 1 */}
                    <Section style={signalSection}>
                        <Section style={signalHeader}>
                            <Text style={signalEmoji}>🔴</Text>
                            <Heading style={signalTitle}>Signal #1 : DSO qui monte silencieusement</Heading>
                        </Section>

                        <Text style={signalDescription}>
                            <strong>Qu'est-ce que c'est ?</strong><br />
                            Le DSO (Days Sales Outstanding) mesure votre délai d'encaissement client.
                        </Text>

                        <Section style={warningBox}>
                            <Text style={warningTitle}>⚠️ Seuil critique</Text>
                            <Text style={warningText}>
                                Si votre DSO augmente de <strong>+10 jours en 3 mois</strong> sans action :
                            </Text>
                            <ul style={warningList}>
                                <li style={warningItem}>Mois 1 : DSO 45 jours (normal)</li>
                                <li style={warningItem}>Mois 2 : DSO 52 jours (attention)</li>
                                <li style={warningItem}>Mois 3 : DSO 58 jours (crise en approche)</li>
                            </ul>
                        </Section>

                        <Text style={impactText}>
                            <strong>Impact réel :</strong> +13 jours DSO = 180 000€ immobilisés (PME 5M€ CA)
                        </Text>

                        <Section style={actionBox}>
                            <Text style={actionTitle}>✅ Action immédiate</Text>
                            <Text style={actionText}>
                                Calculez votre DSO actuel → Comparez vs 3 mois avant → Si +7j, relances urgentes
                            </Text>
                            <Button style={buttonSmall} href="https://finsight.zineinsight.com/calculateurs/dso">
                                🧮 Calculer mon DSO (2 min)
                            </Button>
                        </Section>
                    </Section>

                    {/* Signal 2 */}
                    <Section style={signalSection}>
                        <Section style={signalHeader}>
                            <Text style={signalEmoji}>🟠</Text>
                            <Heading style={signalTitle}>Signal #2 : Retards fournisseurs récurrents</Heading>
                        </Section>

                        <Text style={signalDescription}>
                            <strong>Le piège</strong><br />
                            Vous pensez : "Je négocie, j'allonge mes délais de paiement, c'est malin."<br />
                            <strong>Réalité</strong> : Vous détruisez votre crédit fournisseur.
                        </Text>

                        <Section style={warningBox}>
                            <Text style={warningTitle}>⚠️ Cascade mortelle</Text>
                            <ul style={warningList}>
                                <li style={warningItem}><strong>Mois 1</strong> : Vous payez à J+45 (au lieu de J+30)</li>
                                <li style={warningItem}><strong>Mois 2</strong> : Fournisseur exige paiement comptant</li>
                                <li style={warningItem}><strong>Mois 3</strong> : Arrêt livraisons = rupture production</li>
                                <li style={warningItem}><strong>Mois 4</strong> : Perte chiffre d'affaires = spirale négative</li>
                            </ul>
                        </Section>

                        <Text style={impactText}>
                            <strong>Coût caché :</strong> Perte de confiance = restrictions crédit = BFR explose
                        </Text>

                        <Section style={actionBox}>
                            <Text style={actionTitle}>✅ Action immédiate</Text>
                            <Text style={actionText}>
                                Listez vos 10 plus gros fournisseurs → Vérifiez si retards &gt; 10j sur 3 derniers mois
                                → Appelez-les AVANT qu'ils ne vous coupent
                            </Text>
                        </Section>
                    </Section>

                    {/* Signal 3 */}
                    <Section style={signalSection}>
                        <Section style={signalHeader}>
                            <Text style={signalEmoji}>🔴</Text>
                            <Heading style={signalTitle}>Signal #3 : Découverts répétés (même légers)</Heading>
                        </Section>

                        <Text style={signalDescription}>
                            <strong>Le mensonge qu'on se raconte</strong><br />
                            "C'est juste 3 jours de découvert, ce n'est pas grave."
                        </Text>

                        <Section style={warningBox}>
                            <Text style={warningTitle}>⚠️ Progression classique</Text>
                            <ul style={warningList}>
                                <li style={warningItem}><strong>Trimestre 1</strong> : 1 découvert/trimestre (ok)</li>
                                <li style={warningItem}><strong>Trimestre 2</strong> : 3 découverts/trimestre (attention)</li>
                                <li style={warningItem}><strong>Trimestre 3</strong> : Découvert permanent (crise)</li>
                            </ul>
                        </Section>

                        <Text style={impactText}>
                            <strong>Coût réel :</strong> 3 découverts/mois × 12 mois = 15-25k€/an en agios
                            + stress permanent + décisions bloquées
                        </Text>

                        <Section style={actionBox}>
                            <Text style={actionTitle}>✅ Action immédiate</Text>
                            <Text style={actionText}>
                                Vérifiez vos 3 derniers relevés bancaires → Comptez les jours de découvert →
                                Si &gt; 5 jours/mois, urgence prévisionnel 90j
                            </Text>
                            <Button style={buttonSmall} href="https://finsight.zineinsight.com/templates/previsionnel-tresorerie-90j">
                                📥 Template Prévisionnel 90j
                            </Button>
                        </Section>
                    </Section>

                    {/* Self-assessment */}
                    <Section style={assessmentSection}>
                        <Heading style={h2}>🎯 Votre situation en 30 secondes</Heading>
                        
                        <Text style={text}>
                            <strong>Cochez mentalement les cases qui s'appliquent :</strong>
                        </Text>

                        <ul style={checklistUl}>
                            <li style={checklistLi}>❌ Mon DSO a augmenté de +7 jours en 3 mois</li>
                            <li style={checklistLi}>❌ J'ai retardé des paiements fournisseurs ce trimestre</li>
                            <li style={checklistLi}>❌ J'ai été en découvert 2+ fois ce mois-ci</li>
                            <li style={checklistLi}>❌ Je n'ai pas de visibilité trésorerie &gt; 60 jours</li>
                            <li style={checklistLi}>❌ Je stresse chaque début de mois pour les salaires</li>
                        </ul>

                        <Section style={scoreBox}>
                            <Text style={scoreTitle}>📊 Interprétation</Text>
                            <ul style={scoreList}>
                                <li style={scoreItem}><strong>0-1 case</strong> : Situation saine, continuez ✅</li>
                                <li style={scoreItem}><strong>2-3 cases</strong> : Tension détectée, agissez maintenant ⚠️</li>
                                <li style={scoreItem}><strong>4-5 cases</strong> : Crise imminente, aide externe requise 🚨</li>
                            </ul>
                        </Section>
                    </Section>

                    {/* CTA */}
                    <Section style={ctaSection}>
                        <Heading style={h2}>💬 Vous avez coché 2+ cases ?</Heading>
                        <Text style={text}>
                            Ne laissez pas ces signaux devenir une crise.
                        </Text>
                        <Text style={text}>
                            <strong>Diagnostic gratuit 30 minutes</strong> :<br />
                            Je regarde votre situation, j'identifie les urgences,
                            je vous donne un plan d'action concret.
                        </Text>
                        <Button style={button} href="https://calendly.com/zineinsight/15min">
                            📞 Réserver mon diagnostic (gratuit)
                        </Button>
                        <Text style={guaranteeText}>
                            ✅ Sans engagement • ✅ Confidentialité totale • ✅ 30 minutes chrono
                        </Text>
                    </Section>

                    {/* Resources */}
                    <Section style={resourcesSection}>
                        <Heading style={h2}>📚 Ressources pour agir maintenant</Heading>
                        <Text style={resourceItem}>
                            📄 <Link href="https://finsight.zineinsight.com/blog/probleme-tresorerie-pme-10-signes" style={link}>
                                Article : 10 Signaux d'Alerte Trésorerie (guide complet)
                            </Link>
                        </Text>
                        <Text style={resourceItem}>
                            📊 <Link href="https://finsight.zineinsight.com/templates/previsionnel-tresorerie-90j" style={link}>
                                Template : Prévisionnel Trésorerie 90 Jours
                            </Link>
                        </Text>
                        <Text style={resourceItem}>
                            🧮 <Link href="https://finsight.zineinsight.com/calculateurs/bfr" style={link}>
                                Calculateur : Besoin en Fonds de Roulement
                            </Link>
                        </Text>
                    </Section>

                    {/* Signature */}
                    <Section style={signature}>
                        <Text style={signatureText}>
                            N'attendez pas la crise,<br />
                            <strong>Otmane Boulahia</strong><br />
                            DAF Externalisé & Fondateur FinSight<br />
                            <Link href="mailto:otmane@zineinsight.com" style={link}>
                                otmane@zineinsight.com
                            </Link>
                        </Text>
                    </Section>

                    {/* PS */}
                    <Section style={psSection}>
                        <Text style={psText}>
                            <strong>P.S.</strong> J'envoie un dernier email dans 10 jours avec les détails
                            de mon accompagnement DAF externalisé. Si vous voulez anticiper, répondez à cet email.
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

export default AlertSignalsEmail

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
    backgroundColor: '#ef4444',
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

const signalSection = {
    backgroundColor: '#f9fafb',
    padding: '24px',
    borderRadius: '8px',
    marginTop: '24px',
    marginBottom: '24px',
    borderLeft: '4px solid #ef4444',
}

const signalHeader = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
}

const signalEmoji = {
    fontSize: '32px',
    marginRight: '12px',
}

const signalTitle = {
    color: '#1f2937',
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '0',
    marginBottom: '0',
}

const signalDescription = {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '22px',
    marginBottom: '16px',
}

const warningBox = {
    backgroundColor: '#fef2f2',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '16px',
    marginBottom: '16px',
}

const warningTitle = {
    color: '#ef4444',
    fontSize: '15px',
    fontWeight: 'bold',
    marginBottom: '8px',
    marginTop: '0',
}

const warningText = {
    color: '#374151',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '8px',
}

const warningList = {
    paddingLeft: '20px',
    marginTop: '8px',
    marginBottom: '0',
}

const warningItem = {
    color: '#374151',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '6px',
}

const impactText = {
    color: '#ef4444',
    fontSize: '15px',
    fontWeight: 'bold',
    marginTop: '16px',
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: '#fef2f2',
    borderRadius: '6px',
}

const actionBox = {
    backgroundColor: '#ecfdf5',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '16px',
}

const actionTitle = {
    color: '#10b981',
    fontSize: '15px',
    fontWeight: 'bold',
    marginBottom: '8px',
    marginTop: '0',
}

const actionText = {
    color: '#374151',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '12px',
}

const buttonSmall = {
    backgroundColor: '#10b981',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '10px 16px',
    marginTop: '8px',
}

const assessmentSection = {
    backgroundColor: '#fffbeb',
    padding: '24px',
    borderRadius: '8px',
    marginTop: '32px',
    marginBottom: '32px',
}

const checklistUl = {
    paddingLeft: '20px',
    marginTop: '16px',
    marginBottom: '20px',
}

const checklistLi = {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '28px',
    marginBottom: '8px',
}

const scoreBox = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px',
}

const scoreTitle = {
    color: '#1f2937',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '12px',
    marginTop: '0',
}

const scoreList = {
    paddingLeft: '20px',
    marginTop: '8px',
    marginBottom: '0',
}

const scoreItem = {
    color: '#374151',
    fontSize: '14px',
    lineHeight: '22px',
    marginBottom: '8px',
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
    backgroundColor: '#ef4444',
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
