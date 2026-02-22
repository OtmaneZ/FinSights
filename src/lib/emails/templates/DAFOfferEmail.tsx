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

interface DAFOfferEmailProps {
    userName: string
}

export const DAFOfferEmail = ({
    userName = 'Jean',
}: DAFOfferEmailProps) => (
    <Html>
        <Head />
        <Preview>DAF Externalisé : Les 3 formules adaptées aux PME/ETI (tarifs transparents)</Preview>
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
                        💼 Comment je peux vous aider (sans bullsh*t)
                    </Heading>

                    <Text style={text}>
                        Bonjour {userName},
                    </Text>

                    <Text style={text}>
                        Ces 3 dernières semaines, je vous ai partagé :
                    </Text>

                    <ul style={recapList}>
                        <li style={recapItem}>✅ Le template prévisionnel 90j</li>
                        <li style={recapItem}>✅ Un tutoriel pour l'utiliser</li>
                        <li style={recapItem}>✅ Un cas client qui a résolu sa trésorerie en 60j</li>
                        <li style={recapItem}>✅ Les 3 signaux d'alerte à surveiller</li>
                    </ul>

                    <Text style={text}>
                        Si vous avez appliqué ces conseils : <strong>félicitations</strong>,
                        vous êtes dans le top 10% des dirigeants qui agissent.
                    </Text>

                    <Text style={text}>
                        Mais soyons honnêtes : <strong>vous manquez de temps</strong>.
                    </Text>

                    <Text style={text}>
                        Entre le commercial, l'opérationnel, le management, les urgences quotidiennes...
                        <strong>la finance passe au second plan</strong>.
                    </Text>

                    <Text style={text}>
                        Jusqu'au jour où un problème de trésorerie met l'entreprise en danger.
                    </Text>

                    {/* Problem section */}
                    <Section style={problemSection}>
                        <Heading style={h2}>🎯 Le vrai problème</Heading>
                        
                        <Text style={text}>
                            Ce n'est pas que vous ne <em>savez pas</em> gérer la finance.
                        </Text>
                        <Text style={text}>
                            C'est que vous n'avez <strong>ni le temps</strong> ni <strong>l'expertise pointue</strong>
                            pour piloter finement trésorerie, rentabilité, levée de fonds, négociation banque...
                        </Text>
                        <Text style={text}>
                            <strong>Recruter un DAF temps plein ?</strong>
                        </Text>
                        <ul style={problemList}>
                            <li style={problemItem}>💰 Coût : 80-150k€/an (salaire + charges + avantages)</li>
                            <li style={problemItem}>⏰ Temps : 3-6 mois de recrutement</li>
                            <li style={problemItem}>🎲 Risque : Mauvaise embauche = catastrophe</li>
                            <li style={problemItem}>📊 Surqualifié : Besoin de 2j/semaine, pas temps plein</li>
                        </ul>
                    </Section>

                    {/* Solution intro */}
                    <Section style={solutionIntro}>
                        <Heading style={h2}>✅ La solution : DAF Externalisé</Heading>
                        <Text style={text}>
                            Même expertise qu'un DAF senior (15+ ans expérience), <strong>sans les contraintes</strong> :
                        </Text>
                        <Section style={benefitGrid}>
                            <Section style={benefitCard}>
                                <Text style={benefitEmoji}>💰</Text>
                                <Text style={benefitTitle}>Coût divisé par 3</Text>
                                <Text style={benefitText}>1 500-6 500€/mois vs 80-150k€/an</Text>
                            </Section>
                            <Section style={benefitCard}>
                                <Text style={benefitEmoji}>⚡</Text>
                                <Text style={benefitTitle}>Démarrage immédiat</Text>
                                <Text style={benefitText}>Opérationnel en 7 jours vs 3-6 mois</Text>
                            </Section>
                            <Section style={benefitCard}>
                                <Text style={benefitEmoji}>🎯</Text>
                                <Text style={benefitTitle}>Flexibilité totale</Text>
                                <Text style={benefitText}>2j/mois ou 3j/semaine selon besoin</Text>
                            </Section>
                            <Section style={benefitCard}>
                                <Text style={benefitEmoji}>📈</Text>
                                <Text style={benefitTitle}>Résultats rapides</Text>
                                <Text style={benefitText}>ROI visible dès le 1er mois</Text>
                            </Section>
                        </Section>
                    </Section>

                    {/* Offers */}
                    <Section style={offersSection}>
                        <Heading style={h2}>📦 Mes 3 formules</Heading>

                        {/* Formule 1: Diagnostic */}
                        <Section style={offerCard}>
                            <Section style={offerHeader1}>
                                <Text style={offerLabel}>🔍 DIAGNOSTIC</Text>
                                <Text style={offerPrice}>1 990€ HT</Text>
                                <Text style={offerDuration}>Ponctuel (3-5 jours)</Text>
                            </Section>
                            <Section style={offerBody}>
                                <Text style={offerTitle}>Pour qui ?</Text>
                                <Text style={offerText}>
                                    Vous avez un doute, un problème ponctuel, besoin d'un regard expert rapide.
                                </Text>
                                <Text style={offerTitle}>Livraisons :</Text>
                                <ul style={offerList}>
                                    <li style={offerItem}>✅ Analyse complète trésorerie + rentabilité</li>
                                    <li style={offerItem}>✅ Identification 5-10 quick wins</li>
                                    <li style={offerItem}>✅ Prévisionnel 12 mois + scénarios</li>
                                    <li style={offerItem}>✅ Rapport exécutif 15 pages</li>
                                    <li style={offerItem}>✅ Restitution 1h (visio)</li>
                                </ul>
                                <Button style={buttonWhite} href="https://calendly.com/zineinsight/15min">
                                    📞 Réserver le diagnostic
                                </Button>
                            </Section>
                        </Section>

                        {/* Formule 2: Récurrent */}
                        <Section style={offerCard}>
                            <Section style={offerHeader2}>
                                <Text style={offerLabel}>💼 DAF RÉCURRENT</Text>
                                <Text style={offerPrice}>1 500 - 6 500€ HT/mois</Text>
                                <Text style={offerDuration}>Engagement 6 mois minimum</Text>
                            </Section>
                            <Section style={offerBody}>
                                <Text style={offerTitle}>Pour qui ?</Text>
                                <Text style={offerText}>
                                    CA 1-20M€, besoin d'un DAF régulier sans recruter temps plein.
                                    2j/mois → 3j/semaine selon intensité.
                                </Text>
                                <Text style={offerTitle}>Missions typiques :</Text>
                                <ul style={offerList}>
                                    <li style={offerItem}>✅ Pilotage trésorerie 90j (hebdo)</li>
                                    <li style={offerItem}>✅ Business Reviews mensuelles avec DG</li>
                                    <li style={offerItem}>✅ Optimisation BFR + rentabilité clients</li>
                                    <li style={offerItem}>✅ Préparation levée fonds / financement</li>
                                    <li style={offerItem}>✅ Négociation bancaire (ligne crédit, prêt)</li>
                                    <li style={offerItem}>✅ Recrutement + management contrôleur gestion</li>
                                </ul>
                                <Section style={pricingDetails}>
                                    <Text style={pricingTitle}>💰 Tarification :</Text>
                                    <ul style={pricingList}>
                                        <li style={pricingItem}><strong>2j/mois</strong> : 1 500€/mois (PME 1-5M€)</li>
                                        <li style={pricingItem}><strong>1j/semaine</strong> : 3 500€/mois (PME 5-10M€)</li>
                                        <li style={pricingItem}><strong>2j/semaine</strong> : 6 500€/mois (ETI 10-20M€)</li>
                                    </ul>
                                </Section>
                                <Button style={buttonGreen} href="https://calendly.com/zineinsight/15min">
                                    💬 Discuter de mon besoin
                                </Button>
                            </Section>
                        </Section>

                        {/* Formule 3: Projet */}
                        <Section style={offerCard}>
                            <Section style={offerHeader3}>
                                <Text style={offerLabel}>🚀 PROJET TRANSFORMATION</Text>
                                <Text style={offerPrice}>9 900 - 25 000€ HT</Text>
                                <Text style={offerDuration}>Forfait 6-12 semaines</Text>
                            </Section>
                            <Section style={offerBody}>
                                <Text style={offerTitle}>Pour qui ?</Text>
                                <Text style={offerText}>
                                    Levée de fonds, restructuration, M&A, mise en place ERP financier,
                                    optimisation structure capitalistique.
                                </Text>
                                <Text style={offerTitle}>Exemples projets :</Text>
                                <ul style={offerList}>
                                    <li style={offerItem}>✅ <strong>Levée de fonds</strong> : Business Plan, modèle financier 5 ans, pitch deck, due diligence</li>
                                    <li style={offerItem}>✅ <strong>Mise en place ERP</strong> : Sélection, intégration, formation équipe</li>
                                    <li style={offerItem}>✅ <strong>Restructuration</strong> : Plan retournement, négociation créanciers, PGE</li>
                                    <li style={offerItem}>✅ <strong>M&A</strong> : Valorisation, due diligence acheteur/vendeur, structuration deal</li>
                                </ul>
                                <Button style={buttonBlue} href="https://calendly.com/zineinsight/15min">
                                    🎯 Parler de mon projet
                                </Button>
                            </Section>
                        </Section>
                    </Section>

                    {/* Social proof */}
                    <Section style={proofSection}>
                        <Heading style={h2}>💬 Ce que disent mes clients</Heading>
                        
                        <Section style={testimonialCard}>
                            <Text style={testimonialText}>
                                "En 3 mois avec Otmane : DSO -22 jours, trésorerie +180k€, stress divisé par 10.
                                Le ROI est évident : économie 25k€/an agios + visibilité retrouvée."
                            </Text>
                            <Text style={testimonialAuthor}>
                                <strong>Thomas M.</strong>, Dirigeant Agence Conseil (8M€ CA)
                            </Text>
                        </Section>

                        <Section style={testimonialCard}>
                            <Text style={testimonialText}>
                                "Otmane nous a accompagnés sur notre levée Série A (2M€). Business plan béton,
                                modèle financier crédible, due diligence sans accroc. Levée bouclée en 4 mois."
                            </Text>
                            <Text style={testimonialAuthor}>
                                <strong>Sophie L.</strong>, CEO SaaS B2B (3M€ ARR)
                            </Text>
                        </Section>

                        <Section style={testimonialCard}>
                            <Text style={testimonialText}>
                                "Nous avons hésité à recruter un DAF temps plein. Otmane nous coûte 3x moins cher
                                pour un niveau d'expertise senior. Meilleure décision de 2025."
                            </Text>
                            <Text style={testimonialAuthor}>
                                <strong>Marc D.</strong>, Co-fondateur E-commerce (12M€ CA)
                            </Text>
                        </Section>
                    </Section>

                    {/* FAQ */}
                    <Section style={faqSection}>
                        <Heading style={h2}>❓ FAQ</Heading>
                        
                        <Section style={faqItem}>
                            <Text style={faqQuestion}>Pourquoi pas un expert-comptable ?</Text>
                            <Text style={faqAnswer}>
                                L'expert-comptable = passé (bilan, conformité). Le DAF = futur (prévisionnel,
                                stratégie, levée fonds). Les deux sont complémentaires, pas substituables.
                            </Text>
                        </Section>

                        <Section style={faqItem}>
                            <Text style={faqQuestion}>Vous travaillez à distance ?</Text>
                            <Text style={faqAnswer}>
                                Oui, 90% des missions en remote (visio + outils collabo). Déplacements possibles
                                si nécessaire (Paris, régions).
                            </Text>
                        </Section>

                        <Section style={faqItem}>
                            <Text style={faqQuestion}>Engagement minimum ?</Text>
                            <Text style={faqAnswer}>
                                Diagnostic : ponctuel. Récurrent : 6 mois (résiliable avec préavis 1 mois).
                                Projet : forfait fixe.
                            </Text>
                        </Section>

                        <Section style={faqItem}>
                            <Text style={faqQuestion}>Quel ROI puis-je attendre ?</Text>
                            <Text style={faqAnswer}>
                                Selon nos 50+ missions : ROI moyen x5-10 la première année (économies agios,
                                optimisation BFR, négociations bancaires, évitement erreurs coûteuses).
                            </Text>
                        </Section>
                    </Section>

                    {/* Final CTA */}
                    <Section style={finalCta}>
                        <Heading style={h2}>🎯 Prochaine étape</Heading>
                        <Text style={text}>
                            Réservez un appel découverte <strong>gratuit de 30 minutes</strong>.
                        </Text>
                        <Text style={text}>
                            On regarde votre situation, je vous dis si/comment je peux vous aider,
                            et vous décidez si ça fait sens.
                        </Text>
                        <Text style={text}>
                            <strong>Zéro pression commerciale.</strong> Si ce n'est pas le bon moment
                            ou la bonne personne, je vous le dirai franchement.
                        </Text>
                        <Button style={buttonFinal} href="https://calendly.com/zineinsight/15min">
                            📅 Réserver mon appel gratuit (15 min)
                        </Button>
                        <Text style={guaranteeText}>
                            ✅ Sans engagement • ✅ Confidentialité totale • ✅ Conseil actionnable même si on ne travaille pas ensemble
                        </Text>
                    </Section>

                    {/* Signature */}
                    <Section style={signature}>
                        <Text style={signatureText}>
                            Au plaisir d'échanger,<br />
                            <strong>Otmane Boulahia</strong><br />
                            DAF Externalisé & Fondateur FinSight<br />
                            📧 <Link href="mailto:otmane@zineinsight.com" style={link}>
                                otmane@zineinsight.com
                            </Link><br />
                            📞 Répondez à cet email pour toute question
                        </Text>
                    </Section>

                    {/* PS */}
                    <Section style={psSection}>
                        <Text style={psText}>
                            <strong>P.S.</strong> Si vous n'êtes pas prêt maintenant, pas de souci.
                            Gardez mes coordonnées. Quand un problème de trésorerie/financement surgira
                            (et il surgira), vous saurez qui appeler.
                        </Text>
                    </Section>
                </Section>

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>
                        FinSight - DAF Externalisé pour PME/ETI ambitieuses
                    </Text>
                    <Text style={footerText}>
                        <Link href="https://finsight.zineinsight.com" style={footerLink}>
                            Site web
                        </Link>
                        {' • '}
                        <Link href="https://finsight.zineinsight.com/consulting" style={footerLink}>
                            Services
                        </Link>
                        {' • '}
                        <Link href="https://finsight.zineinsight.com/blog" style={footerLink}>
                            Blog
                        </Link>
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
)

export default DAFOfferEmail

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

const recapList = {
    paddingLeft: '20px',
    marginTop: '12px',
    marginBottom: '20px',
}

const recapItem = {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '26px',
    marginBottom: '8px',
}

const problemSection = {
    backgroundColor: '#fef2f2',
    padding: '24px',
    borderRadius: '8px',
    marginTop: '24px',
    marginBottom: '32px',
}

const problemList = {
    paddingLeft: '20px',
    marginTop: '12px',
}

const problemItem = {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '24px',
    marginBottom: '8px',
}

const solutionIntro = {
    backgroundColor: '#ecfdf5',
    padding: '24px',
    borderRadius: '8px',
    marginTop: '32px',
    marginBottom: '32px',
}

const benefitGrid = {
    marginTop: '20px',
}

const benefitCard = {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
    textAlign: 'center' as const,
}

const benefitEmoji = {
    fontSize: '32px',
    marginBottom: '8px',
}

const benefitTitle = {
    color: '#1f2937',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '4px',
    marginTop: '0',
}

const benefitText = {
    color: '#6b7280',
    fontSize: '13px',
    marginTop: '0',
    marginBottom: '0',
}

const offersSection = {
    marginTop: '40px',
    marginBottom: '32px',
}

const offerCard = {
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    marginBottom: '24px',
    overflow: 'hidden',
    border: '2px solid #e5e7eb',
}

const offerHeader1 = {
    backgroundColor: '#dbeafe',
    padding: '20px',
    textAlign: 'center' as const,
}

const offerHeader2 = {
    backgroundColor: '#d1fae5',
    padding: '20px',
    textAlign: 'center' as const,
}

const offerHeader3 = {
    backgroundColor: '#fef3c7',
    padding: '20px',
    textAlign: 'center' as const,
}

const offerLabel = {
    color: '#1f2937',
    fontSize: '14px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    marginBottom: '8px',
    marginTop: '0',
}

const offerPrice = {
    color: '#1f2937',
    fontSize: '32px',
    fontWeight: 'bold',
    marginTop: '0',
    marginBottom: '4px',
}

const offerDuration = {
    color: '#6b7280',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
}

const offerBody = {
    padding: '24px',
}

const offerTitle = {
    color: '#1f2937',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '16px',
    marginBottom: '8px',
}

const offerText = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '12px',
}

const offerList = {
    paddingLeft: '20px',
    marginTop: '8px',
    marginBottom: '16px',
}

const offerItem = {
    color: '#374151',
    fontSize: '14px',
    lineHeight: '22px',
    marginBottom: '6px',
}

const pricingDetails = {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '16px',
    marginBottom: '16px',
}

const pricingTitle = {
    color: '#1f2937',
    fontSize: '15px',
    fontWeight: 'bold',
    marginBottom: '8px',
    marginTop: '0',
}

const pricingList = {
    paddingLeft: '20px',
    marginTop: '8px',
    marginBottom: '0',
}

const pricingItem = {
    color: '#374151',
    fontSize: '14px',
    lineHeight: '22px',
    marginBottom: '6px',
}

const buttonWhite = {
    backgroundColor: '#3b82f6',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '12px 20px',
    marginTop: '16px',
}

const buttonGreen = {
    backgroundColor: '#10b981',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '12px 20px',
    marginTop: '16px',
}

const buttonBlue = {
    backgroundColor: '#3b82f6',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '12px 20px',
    marginTop: '16px',
}

const proofSection = {
    marginTop: '40px',
    marginBottom: '32px',
}

const testimonialCard = {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '16px',
    borderLeft: '4px solid #10b981',
}

const testimonialText = {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '22px',
    fontStyle: 'italic',
    marginBottom: '12px',
}

const testimonialAuthor = {
    color: '#6b7280',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
}

const faqSection = {
    marginTop: '40px',
    marginBottom: '32px',
}

const faqItem = {
    marginBottom: '20px',
}

const faqQuestion = {
    color: '#1f2937',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '6px',
    marginTop: '0',
}

const faqAnswer = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '20px',
    marginTop: '0',
    marginBottom: '0',
}

const finalCta = {
    backgroundColor: '#fef3c7',
    padding: '32px 24px',
    borderRadius: '8px',
    marginTop: '40px',
    marginBottom: '32px',
    textAlign: 'center' as const,
}

const buttonFinal = {
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
    fontSize: '13px',
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
