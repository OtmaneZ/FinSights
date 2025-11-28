'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { additionalArticles } from './additionalArticles'
import { moreArticles } from './moreArticles'
import { finalArticles } from './finalArticles'

interface BlogArticle {
    slug: string
    title: string
    description: string
    date: string
    readTime: string
    category: string
    content: React.ReactNode
}

const baseArticles: Record<string, BlogArticle> = {
    'calcul-dso-formule-2025': {
        slug: 'calcul-dso-formule-2025',
        title: 'Comment calculer son DSO (formule PCG 2025)',
        description: 'Guide complet pour calculer le DSO avec exemples pratiques et benchmarks sectoriels',
        date: '28 novembre 2025',
        readTime: '8 min',
        category: 'KPIs',
        content: (
            <>
                <p className="lead">
                    Le DSO (Days Sales Outstanding) est l'un des indicateurs financiers les plus importants pour les PME. 
                    Il mesure le délai moyen de paiement de vos clients et impacte directement votre trésorerie.
                </p>

                <h2>Qu'est-ce que le DSO ?</h2>
                <p>
                    Le DSO (Days Sales Outstanding), ou "délai moyen de paiement clients" en français, 
                    représente le nombre de jours moyen qu'il faut pour encaisser une créance client après 
                    l'émission d'une facture.
                </p>

                <div className="info-box">
                    <strong>💡 Exemple concret</strong>
                    <p>
                        Si votre DSO est de 45 jours, cela signifie qu'en moyenne, vos clients vous paient 45 jours 
                        après la facturation. Un DSO élevé signale un problème de recouvrement.
                    </p>
                </div>

                <h2>Formule de calcul du DSO</h2>
                <p>La formule standard conforme au Plan Comptable Général (PCG) 2025 est :</p>

                <div className="formula-box">
                    <code>DSO = (Créances clients / Chiffre d'affaires) × 365</code>
                </div>

                <p><strong>Détail des composants :</strong></p>
                <ul>
                    <li><strong>Créances clients</strong> : Montant total des factures émises non encore encaissées (en €)</li>
                    <li><strong>Chiffre d'affaires</strong> : CA annuel ou annualisé sur la période (en €)</li>
                    <li><strong>365</strong> : Nombre de jours dans l'année</li>
                </ul>

                <h2>Exemple de calcul pratique</h2>
                <p>Prenons l'exemple d'une PME de services :</p>

                <div className="example-box">
                    <p><strong>Données :</strong></p>
                    <ul>
                        <li>Créances clients en attente : <strong>150 000 €</strong></li>
                        <li>Chiffre d'affaires annuel : <strong>1 200 000 €</strong></li>
                    </ul>

                    <p><strong>Calcul :</strong></p>
                    <code>DSO = (150 000 / 1 200 000) × 365 = 45,6 jours</code>

                    <p className="result">
                        <strong>Résultat : DSO = 46 jours</strong> (arrondi)
                    </p>
                </div>

                <h2>Benchmarks sectoriels France</h2>
                <p>Voici les délais de paiement moyens constatés par secteur en 2025 :</p>

                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>Secteur</th>
                            <th>DSO Excellent</th>
                            <th>DSO Bon</th>
                            <th>DSO À surveiller</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Services B2B</td>
                            <td>&lt; 30 jours</td>
                            <td>30-45 jours</td>
                            <td>&gt; 45 jours</td>
                        </tr>
                        <tr>
                            <td>Commerce</td>
                            <td>&lt; 45 jours</td>
                            <td>45-60 jours</td>
                            <td>&gt; 60 jours</td>
                        </tr>
                        <tr>
                            <td>Industrie</td>
                            <td>&lt; 60 jours</td>
                            <td>60-90 jours</td>
                            <td>&gt; 90 jours</td>
                        </tr>
                        <tr>
                            <td>SaaS B2B</td>
                            <td>&lt; 15 jours</td>
                            <td>15-30 jours</td>
                            <td>&gt; 30 jours</td>
                        </tr>
                    </tbody>
                </table>

                <h2>Comment améliorer votre DSO ?</h2>
                <p>Si votre DSO est trop élevé, voici 5 actions concrètes :</p>

                <ol>
                    <li>
                        <strong>Automatiser les relances</strong>
                        <p>Mettez en place des relances automatiques à J+15, J+30, et J+45 après l'échéance</p>
                    </li>
                    <li>
                        <strong>Négocier un escompte</strong>
                        <p>Proposez 2% de remise pour paiement anticipé (sous 8 jours)</p>
                    </li>
                    <li>
                        <strong>Facturation électronique</strong>
                        <p>Obligatoire en 2026 pour toutes les PME, elle accélère le traitement</p>
                    </li>
                    <li>
                        <strong>Acomptes à la commande</strong>
                        <p>Demandez 30-50% d'acompte pour les prestations longues</p>
                    </li>
                    <li>
                        <strong>Suivre en temps réel</strong>
                        <p>Utilisez un dashboard comme FinSight pour suivre votre DSO quotidiennement</p>
                    </li>
                </ol>

                <div className="warning-box">
                    <strong>⚠️ Attention légale</strong>
                    <p>
                        En France, la loi LME fixe un délai de paiement maximum de <strong>60 jours</strong> après 
                        la date d'émission de la facture. Au-delà, vous êtes en droit d'appliquer des pénalités de retard.
                    </p>
                </div>

                <h2>Calculez votre DSO automatiquement</h2>
                <p>
                    FinSight calcule votre DSO en temps réel depuis vos exports comptables (Sage, Cegid, Excel). 
                    Plus besoin de formules manuelles ni de tableaux Excel.
                </p>

                <div className="cta-box">
                    <h3>🚀 Essayez FinSight gratuitement</h3>
                    <ul>
                        <li>✅ DSO calculé automatiquement</li>
                        <li>✅ Alertes quand le DSO dépasse votre seuil</li>
                        <li>✅ Benchmarks sectoriels intégrés</li>
                        <li>✅ Liste des factures en retard</li>
                    </ul>
                    <Link href="/dashboard" className="cta-button">
                        Analyser mes données →
                    </Link>
                </div>
            </>
        )
    },
    '5-kpis-financiers-pme': {
        slug: '5-kpis-financiers-pme',
        title: 'Les 5 KPIs financiers essentiels pour PME',
        description: 'Découvrez les indicateurs clés que tout dirigeant de PME devrait suivre mensuellement',
        date: '28 novembre 2025',
        readTime: '6 min',
        category: 'Gestion',
        content: (
            <>
                <p className="lead">
                    Vous dirigez une PME et vous êtes noyé sous les chiffres ? Voici les 5 indicateurs financiers 
                    essentiels à suivre chaque mois pour piloter efficacement votre entreprise.
                </p>

                <h2>1. Chiffre d'affaires (CA)</h2>
                <p>
                    Le chiffre d'affaires représente le montant total des ventes sur une période donnée. 
                    C'est le point de départ de toute analyse financière.
                </p>

                <div className="kpi-box">
                    <strong>💰 Formule :</strong>
                    <code>CA = Σ (Quantité vendue × Prix de vente)</code>
                    
                    <p><strong>Ce qu'il faut surveiller :</strong></p>
                    <ul>
                        <li>Évolution mois par mois (croissance ou baisse ?)</li>
                        <li>Saisonnalité (mois forts vs mois creux)</li>
                        <li>CA par client (concentration du risque)</li>
                    </ul>

                    <p><strong>Benchmark PME France :</strong> Croissance annuelle de 10-15% = bonne santé</p>
                </div>

                <h2>2. Marge nette</h2>
                <p>
                    La marge nette indique le pourcentage de bénéfice réel après déduction de TOUTES les charges 
                    (coûts directs + frais généraux + impôts).
                </p>

                <div className="kpi-box">
                    <strong>📊 Formule :</strong>
                    <code>Marge nette = (Résultat net / CA) × 100</code>
                    
                    <p><strong>Benchmarks sectoriels :</strong></p>
                    <ul>
                        <li><strong>Services B2B :</strong> 10-20% = saine</li>
                        <li><strong>Commerce :</strong> 3-8% = normale</li>
                        <li><strong>SaaS :</strong> 20-40% = excellente</li>
                        <li><strong>Industrie :</strong> 5-12% = correcte</li>
                    </ul>

                    <p className="warning">
                        ⚠️ Une marge nette &lt; 5% signale un problème de rentabilité à résoudre rapidement.
                    </p>
                </div>

                <h2>3. DSO (Days Sales Outstanding)</h2>
                <p>
                    Le DSO mesure le délai moyen de paiement de vos clients. Un DSO élevé = trésorerie bloquée.
                </p>

                <div className="kpi-box">
                    <strong>⏱️ Formule :</strong>
                    <code>DSO = (Créances clients / CA) × 365</code>
                    
                    <p><strong>Seuils d'alerte :</strong></p>
                    <ul>
                        <li>DSO &lt; 30 jours = ✅ Excellent</li>
                        <li>DSO 30-45 jours = ✅ Bon (standard B2B)</li>
                        <li>DSO 45-60 jours = ⚠️ À surveiller</li>
                        <li>DSO &gt; 60 jours = 🚨 Critique (risque cash)</li>
                    </ul>

                    <p>
                        <Link href="/blog/calcul-dso-formule-2025" className="inline-link">
                            → Lire notre guide complet sur le calcul du DSO
                        </Link>
                    </p>
                </div>

                <h2>4. BFR (Besoin en Fonds de Roulement)</h2>
                <p>
                    Le BFR représente l'argent immobilisé dans le cycle d'exploitation de votre entreprise 
                    (stocks + créances clients - dettes fournisseurs).
                </p>

                <div className="kpi-box">
                    <strong>💵 Formule simplifiée :</strong>
                    <code>BFR = Stocks + Créances clients - Dettes fournisseurs</code>
                    
                    <p><strong>Interprétation :</strong></p>
                    <ul>
                        <li><strong>BFR positif</strong> : Vous devez financer votre activité (normal en B2B)</li>
                        <li><strong>BFR négatif</strong> : Vos fournisseurs financent votre activité (idéal !)</li>
                        <li><strong>BFR croissant</strong> : Attention, besoin de trésorerie qui augmente</li>
                    </ul>

                    <p className="tip">
                        💡 <strong>Astuce :</strong> Un BFR qui représente plus de 90 jours de CA = signal d'alerte
                    </p>
                </div>

                <h2>5. Trésorerie nette</h2>
                <p>
                    La trésorerie nette indique combien d'argent disponible vous avez réellement en banque 
                    à un instant T.
                </p>

                <div className="kpi-box">
                    <strong>💰 Formule :</strong>
                    <code>Trésorerie nette = Soldes bancaires + Placements court terme - Dettes court terme</code>
                    
                    <p><strong>Règles de gestion :</strong></p>
                    <ul>
                        <li><strong>Minimum vital :</strong> 1 mois de charges fixes</li>
                        <li><strong>Confortable :</strong> 2-3 mois de charges</li>
                        <li><strong>Trésorerie négative</strong> : Situation critique, agir immédiatement</li>
                    </ul>

                    <p className="example">
                        <strong>Exemple :</strong> PME avec 50k€ de charges mensuelles → minimum 50k€ de trésorerie nette
                    </p>
                </div>

                <h2>Pourquoi ces 5 KPIs suffisent ?</h2>
                <p>
                    Ces 5 indicateurs couvrent les 3 piliers de la santé financière d'une PME :
                </p>

                <ol>
                    <li><strong>Performance commerciale</strong> → CA + Marge nette</li>
                    <li><strong>Gestion du cash</strong> → DSO + Trésorerie</li>
                    <li><strong>Efficacité opérationnelle</strong> → BFR</li>
                </ol>

                <p>
                    Pas besoin de suivre 50 KPIs. Ces 5 indicateurs, calculés mensuellement, 
                    vous donnent une vision complète de votre situation financière.
                </p>

                <h2>Automatisez le suivi de vos KPIs</h2>
                <p>
                    Calculer manuellement ces KPIs chaque mois dans Excel prend du temps et génère des erreurs. 
                    FinSight automatise ces calculs depuis vos exports comptables.
                </p>

                <div className="cta-box">
                    <h3>🚀 FinSight calcule vos 5 KPIs automatiquement</h3>
                    <ul>
                        <li>✅ Import CSV/Excel en 2 clics</li>
                        <li>✅ 15 KPIs calculés en temps réel (dont ces 5 essentiels)</li>
                        <li>✅ Alertes automatiques si seuil dépassé</li>
                        <li>✅ Visualisations graphiques claires</li>
                        <li>✅ Export PDF/Excel pour votre banquier</li>
                    </ul>
                    <Link href="/dashboard" className="cta-button">
                        Essayer gratuitement →
                    </Link>
                </div>
            </>
        )
    },
    'bfr-formule-optimisation': {
        slug: 'bfr-formule-optimisation',
        title: 'BFR : formule de calcul et optimisation 2025',
        description: 'Tout savoir sur le Besoin en Fonds de Roulement : calcul, interprétation et leviers d\'optimisation pour PME',
        date: '28 novembre 2025',
        readTime: '10 min',
        category: 'Trésorerie',
        content: (
            <>
                <p className="lead">
                    Le BFR (Besoin en Fonds de Roulement) est un indicateur crucial pour la gestion de votre trésorerie. 
                    Découvrez comment le calculer, l'interpréter et surtout comment l'optimiser pour libérer du cash.
                </p>

                <h2>Qu'est-ce que le BFR ?</h2>
                <p>
                    Le BFR représente l'argent que votre entreprise doit immobiliser pour financer son cycle d'exploitation 
                    quotidien. C'est la différence entre ce que vous devez financer (stocks + créances clients) et 
                    ce qui finance automatiquement votre activité (dettes fournisseurs).
                </p>

                <div className="info-box">
                    <strong>💡 En d'autres termes</strong>
                    <p>
                        Le BFR, c'est l'argent "coincé" dans votre entreprise entre le moment où vous payez vos 
                        fournisseurs et le moment où vos clients vous paient. Plus ce décalage est long, plus votre 
                        BFR est élevé.
                    </p>
                </div>

                <h2>Formule de calcul du BFR</h2>
                <p>La formule standard conforme au Plan Comptable Général (PCG) 2025 :</p>

                <div className="formula-box">
                    <code>BFR = Stocks + Créances clients - Dettes fournisseurs</code>
                </div>

                <p><strong>Détail des composants :</strong></p>
                <ul>
                    <li><strong>Stocks</strong> : Valeur de vos stocks (matières premières, marchandises, produits finis)</li>
                    <li><strong>Créances clients</strong> : Factures émises non encore encaissées</li>
                    <li><strong>Dettes fournisseurs</strong> : Factures fournisseurs non encore réglées</li>
                </ul>

                <h2>Exemple de calcul pratique</h2>
                <p>Prenons l'exemple d'une PME de distribution :</p>

                <div className="example-box">
                    <p><strong>Données au 31/12/2025 :</strong></p>
                    <ul>
                        <li>Stocks : <strong>80 000 €</strong></li>
                        <li>Créances clients : <strong>150 000 €</strong></li>
                        <li>Dettes fournisseurs : <strong>100 000 €</strong></li>
                        <li>CA annuel : <strong>1 200 000 €</strong></li>
                    </ul>

                    <p><strong>Calcul du BFR :</strong></p>
                    <code>BFR = 80 000 + 150 000 - 100 000 = 130 000 €</code>

                    <p><strong>En jours de CA :</strong></p>
                    <code>BFR en jours = (130 000 / 1 200 000) × 365 = 39,5 jours</code>

                    <p className="result">
                        <strong>Résultat : BFR de 130 000 € soit 40 jours de CA</strong>
                    </p>
                </div>

                <h2>Comment interpréter votre BFR ?</h2>

                <h3>BFR positif (le cas le plus fréquent)</h3>
                <p>
                    Un BFR positif signifie que vous devez financer votre cycle d'exploitation. C'est normal pour 
                    la plupart des PME B2B. L'important est de surveiller son évolution :
                </p>

                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>BFR en jours de CA</th>
                            <th>Interprétation</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>&lt; 30 jours</td>
                            <td>✅ Excellent</td>
                            <td>Continuez cette gestion</td>
                        </tr>
                        <tr>
                            <td>30-60 jours</td>
                            <td>✅ Bon</td>
                            <td>Surveillez régulièrement</td>
                        </tr>
                        <tr>
                            <td>60-90 jours</td>
                            <td>⚠️ À surveiller</td>
                            <td>Identifiez les leviers d'amélioration</td>
                        </tr>
                        <tr>
                            <td>&gt; 90 jours</td>
                            <td>🚨 Critique</td>
                            <td>Action immédiate requise</td>
                        </tr>
                    </tbody>
                </table>

                <h3>BFR négatif (situation idéale)</h3>
                <p>
                    Un BFR négatif signifie que vos fournisseurs financent votre activité ! Vous encaissez vos clients 
                    avant de payer vos fournisseurs. C'est le cas typique de :
                </p>

                <ul>
                    <li><strong>Grande distribution</strong> : Clients paient comptant, fournisseurs à 60 jours</li>
                    <li><strong>E-commerce</strong> : Paiement CB immédiat, stocks faibles, fournisseurs en différé</li>
                    <li><strong>SaaS/Abonnements</strong> : Paiement anticipé, peu de stocks, services cloud à 30j</li>
                </ul>

                <div className="info-box">
                    <strong>💰 Avantage cash</strong>
                    <p>
                        Un BFR négatif génère un <strong>excédent de trésorerie</strong> qui peut financer votre croissance 
                        sans recourir au crédit bancaire. C'est l'objectif idéal à viser !
                    </p>
                </div>

                <h2>Les 5 leviers pour optimiser votre BFR</h2>

                <h3>1. Réduire le délai de paiement clients (DSO)</h3>
                <p>Chaque jour gagné sur le DSO réduit directement votre BFR.</p>
                <ul>
                    <li>Automatisez les relances à J+15, J+30, J+45</li>
                    <li>Proposez un escompte 2% pour paiement sous 8 jours</li>
                    <li>Facturez électroniquement (obligatoire 2026)</li>
                    <li>Demandez des acomptes (30-50% à la commande)</li>
                </ul>

                <p>
                    <Link href="/blog/calcul-dso-formule-2025" className="inline-link">
                        → Lire notre guide complet sur le calcul du DSO
                    </Link>
                </p>

                <h3>2. Optimiser la gestion des stocks</h3>
                <p>Les stocks immobilisent du cash. Réduisez-les sans pénaliser les ventes :</p>
                <ul>
                    <li><strong>Rotation des stocks</strong> : Visez 8-12 rotations/an (= 30-45 jours)</li>
                    <li><strong>Méthode ABC</strong> : Concentrez-vous sur les 20% de produits qui font 80% du CA</li>
                    <li><strong>Just-in-time</strong> : Commandez au plus près du besoin réel</li>
                    <li><strong>Déstockage</strong> : Liquidez les stocks dormants (promotions, ventes flash)</li>
                </ul>

                <h3>3. Négocier de meilleurs délais fournisseurs</h3>
                <p>Allongez vos délais de paiement fournisseurs légalement :</p>
                <ul>
                    <li>Négociez 60 jours au lieu de 30 (légal en France)</li>
                    <li>Consolidez vos achats pour obtenir de meilleurs termes</li>
                    <li>Payez à date fixe (ex: le 15 du mois) pour lisser la trésorerie</li>
                </ul>

                <div className="warning-box">
                    <strong>⚠️ Attention légale</strong>
                    <p>
                        En France, la <strong>loi LME</strong> fixe un délai maximum de <strong>60 jours</strong> après 
                        émission de facture. Tout dépassement expose à des sanctions. Négociez dans ce cadre légal.
                    </p>
                </div>

                <h3>4. Adapter votre modèle de paiement</h3>
                <p>Changez vos conditions commerciales pour réduire le BFR :</p>
                <ul>
                    <li><strong>Paiement comptant</strong> : CB/virement immédiat (-30 jours de BFR)</li>
                    <li><strong>Prélèvement automatique</strong> : Réduit les retards de paiement</li>
                    <li><strong>Abonnements/récurrent</strong> : Prévisibilité du cash flow</li>
                    <li><strong>Affacturage</strong> : Transformez vos créances en cash immédiat (coût 1-3%)</li>
                </ul>

                <h3>5. Piloter le BFR mensuellement</h3>
                <p>Suivez l'évolution de votre BFR comme un KPI critique :</p>
                <ul>
                    <li>Calculez le BFR tous les mois (ou en temps réel avec FinSight)</li>
                    <li>Identifiez les variations anormales (stocks qui gonflent, DSO qui monte)</li>
                    <li>Fixez un objectif chiffré (ex: "Réduire le BFR de 90 à 60 jours d'ici 6 mois")</li>
                    <li>Mesurez l'impact de chaque action corrective</li>
                </ul>

                <h2>Cas pratique : réduire son BFR de 40%</h2>
                <p>PME services B2B, CA 1,2M€, BFR initial de 130k€ (40 jours) :</p>

                <div className="example-box">
                    <p><strong>État initial :</strong></p>
                    <ul>
                        <li>Stocks : 80k€ (25 jours)</li>
                        <li>Créances clients : 150k€ (DSO 45 jours)</li>
                        <li>Dettes fournisseurs : 100k€ (30 jours)</li>
                        <li><strong>BFR = 130k€ (40 jours)</strong></li>
                    </ul>

                    <p><strong>Actions mises en place :</strong></p>
                    <ol>
                        <li>Réduction stocks : 80k€ → 50k€ (rotation améliorée)</li>
                        <li>DSO réduit : 45 → 35 jours (relances auto + escompte)</li>
                        <li>Créances clients : 150k€ → 115k€</li>
                        <li>Délai fournisseurs négocié : 30 → 45 jours</li>
                        <li>Dettes fournisseurs : 100k€ → 150k€</li>
                    </ol>

                    <p><strong>Résultat :</strong></p>
                    <code>BFR final = 50k€ + 115k€ - 150k€ = 15k€ (4,5 jours)</code>

                    <p className="result">
                        <strong>💰 Cash libéré : 115k€ (réduction de 88%)</strong>
                    </p>
                </div>

                <h2>BFR et croissance : l'équation critique</h2>
                <p>
                    Plus vous croissez rapidement, plus votre BFR augmente. C'est mathématique : si votre CA double, 
                    vos stocks et créances doublent aussi (mais pas forcément vos dettes fournisseurs).
                </p>

                <div className="warning-box">
                    <strong>⚠️ Croissance trop rapide = risque de faillite</strong>
                    <p>
                        Beaucoup de PME en forte croissance font faillite par <strong>manque de trésorerie</strong>, 
                        pas par manque de rentabilité. Le BFR explose et elles n'arrivent plus à le financer.
                    </p>
                    <p>
                        <strong>Solution :</strong> Anticipez le besoin de financement (crédit court terme, affacturage, 
                        augmentation capital) AVANT la crise de cash.
                    </p>
                </div>

                <h2>Calculez votre BFR automatiquement</h2>
                <p>
                    FinSight calcule votre BFR en temps réel depuis vos exports comptables et vous alerte 
                    si des actions correctives sont nécessaires.
                </p>

                <div className="cta-box">
                    <h3>🚀 Optimisez votre BFR avec FinSight</h3>
                    <ul>
                        <li>✅ Calculateur BFR gratuit en ligne</li>
                        <li>✅ Suivi du BFR en temps réel (jours de CA)</li>
                        <li>✅ Alertes si BFR dépasse votre seuil</li>
                        <li>✅ Comparaison vs benchmarks sectoriels</li>
                        <li>✅ Recommandations d'optimisation personnalisées</li>
                    </ul>
                    <Link href="/calculateurs/bfr" className="cta-button">
                        Calculer mon BFR gratuitement →
                    </Link>
                </div>
            </>
        )
    },
    'marge-nette-vs-brute': {
        slug: 'marge-nette-vs-brute',
        title: 'Marge nette vs marge brute : différences et calculs',
        description: 'Comprenez la différence entre marge brute et marge nette, avec formules de calcul et benchmarks sectoriels',
        date: '28 novembre 2025',
        readTime: '7 min',
        category: 'Rentabilité',
        content: (
            <>
                <p className="lead">
                    Marge brute, marge nette, EBITDA... ces termes financiers sont souvent confondus. Pourtant, bien les 
                    comprendre est essentiel pour piloter la rentabilité de votre entreprise. Décryptage complet avec exemples.
                </p>

                <h2>Marge brute : la rentabilité commerciale</h2>
                <p>
                    La <strong>marge brute</strong> mesure la rentabilité de votre activité commerciale AVANT déduction 
                    des frais généraux (loyers, salaires administratifs, marketing, etc.). Elle répond à la question : 
                    "Combien je gagne sur chaque vente ?"
                </p>

                <div className="formula-box">
                    <code>Marge brute = Chiffre d'affaires - Coût des ventes</code>
                    <br />
                    <code>Taux de marge brute (%) = (Marge brute / CA) × 100</code>
                </div>

                <p><strong>Coût des ventes (ou coût d'achat des marchandises vendues) :</strong></p>
                <ul>
                    <li>Pour le <strong>commerce</strong> : Prix d'achat des marchandises revendues</li>
                    <li>Pour l'<strong>industrie</strong> : Matières premières + coûts de production directs</li>
                    <li>Pour les <strong>services</strong> : Coûts directement liés à la prestation (sous-traitance, freelances)</li>
                </ul>

                <div className="example-box">
                    <p><strong>Exemple : Boutique e-commerce</strong></p>
                    <ul>
                        <li>CA mensuel : <strong>50 000 €</strong></li>
                        <li>Achat marchandises : <strong>30 000 €</strong></li>
                    </ul>
                    <code>Marge brute = 50 000 - 30 000 = 20 000 €</code>
                    <code>Taux de marge brute = (20 000 / 50 000) × 100 = 40%</code>
                    <p className="result">
                        <strong>Résultat : 40% de marge brute</strong>
                    </p>
                </div>

                <h2>Marge nette : la rentabilité réelle</h2>
                <p>
                    La <strong>marge nette</strong> mesure le bénéfice FINAL après déduction de TOUTES les charges 
                    (coûts directs + frais généraux + impôts + charges financières). C'est le profit réel qui reste 
                    dans votre poche.
                </p>

                <div className="formula-box">
                    <code>Marge nette = Résultat net / Chiffre d'affaires × 100</code>
                </div>

                <p><strong>Résultat net</strong> = CA - Coût des ventes - Frais généraux - Charges financières - Impôts</p>

                <ul>
                    <li><strong>Frais généraux</strong> : Loyers, salaires administratifs, marketing, assurances, comptabilité</li>
                    <li><strong>Charges financières</strong> : Intérêts d'emprunt</li>
                    <li><strong>Impôts</strong> : IS (Impôt sur les Sociétés)</li>
                </ul>

                <div className="example-box">
                    <p><strong>Suite exemple boutique e-commerce :</strong></p>
                    <ul>
                        <li>Marge brute : <strong>20 000 €</strong></li>
                        <li>Frais généraux : <strong>12 000 €</strong> (loyer 2k€, salaires 8k€, marketing 2k€)</li>
                        <li>Charges financières : <strong>500 €</strong></li>
                        <li>Impôts (25%) : <strong>1 875 €</strong></li>
                    </ul>
                    <code>Résultat net = 20 000 - 12 000 - 500 - 1 875 = 5 625 €</code>
                    <code>Marge nette = (5 625 / 50 000) × 100 = 11,25%</code>
                    <p className="result">
                        <strong>Résultat : 11,25% de marge nette</strong>
                    </p>
                </div>

                <h2>Différence clé : du commercial au financier</h2>

                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>Critère</th>
                            <th>Marge brute</th>
                            <th>Marge nette</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Niveau</strong></td>
                            <td>Commercial</td>
                            <td>Financier global</td>
                        </tr>
                        <tr>
                            <td><strong>Question</strong></td>
                            <td>"Combien je gagne par vente ?"</td>
                            <td>"Combien il reste à la fin ?"</td>
                        </tr>
                        <tr>
                            <td><strong>Utilité</strong></td>
                            <td>Piloter les prix et achats</td>
                            <td>Mesurer rentabilité réelle</td>
                        </tr>
                        <tr>
                            <td><strong>Décisions</strong></td>
                            <td>Stratégie tarifaire, négociations fournisseurs</td>
                            <td>Viabilité modèle économique</td>
                        </tr>
                        <tr>
                            <td><strong>Charges incluses</strong></td>
                            <td>Coûts directs uniquement</td>
                            <td>TOUTES les charges</td>
                        </tr>
                    </tbody>
                </table>

                <div className="info-box">
                    <strong>💡 Mémo simple</strong>
                    <p>
                        <strong>Marge brute</strong> = Ce que vous gagnez sur vos ventes<br />
                        <strong>Marge nette</strong> = Ce qu'il reste après avoir payé toutes les factures
                    </p>
                </div>

                <h2>Benchmarks sectoriels France 2025</h2>

                <h3>Marge brute par secteur</h3>
                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>Secteur</th>
                            <th>Marge brute typique</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Commerce (retail)</td>
                            <td>30-50%</td>
                        </tr>
                        <tr>
                            <td>E-commerce</td>
                            <td>35-60%</td>
                        </tr>
                        <tr>
                            <td>Services B2B</td>
                            <td>50-70%</td>
                        </tr>
                        <tr>
                            <td>SaaS</td>
                            <td>75-90%</td>
                        </tr>
                        <tr>
                            <td>Industrie</td>
                            <td>25-40%</td>
                        </tr>
                        <tr>
                            <td>Restauration</td>
                            <td>60-70%</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Marge nette par secteur</h3>
                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>Secteur</th>
                            <th>Marge nette typique</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Commerce (retail)</td>
                            <td>3-8%</td>
                        </tr>
                        <tr>
                            <td>E-commerce</td>
                            <td>5-12%</td>
                        </tr>
                        <tr>
                            <td>Services B2B</td>
                            <td>10-20%</td>
                        </tr>
                        <tr>
                            <td>SaaS</td>
                            <td>20-40%</td>
                        </tr>
                        <tr>
                            <td>Industrie</td>
                            <td>5-12%</td>
                        </tr>
                        <tr>
                            <td>Restauration</td>
                            <td>5-10%</td>
                        </tr>
                    </tbody>
                </table>

                <div className="warning-box">
                    <strong>⚠️ Seuil d'alerte</strong>
                    <p>
                        Une marge nette <strong>&lt; 5%</strong> signale un problème structurel de rentabilité. 
                        Actions correctives urgentes nécessaires.
                    </p>
                </div>

                <h2>Comment améliorer vos marges ?</h2>

                <h3>Augmenter la marge brute</h3>
                <ol>
                    <li>
                        <strong>Augmenter vos prix</strong>
                        <p>Test A/B pricing, positionnement premium, valeur ajoutée perçue</p>
                    </li>
                    <li>
                        <strong>Réduire coûts d'achat</strong>
                        <p>Négociation fournisseurs, volumes, sourcing alternatif</p>
                    </li>
                    <li>
                        <strong>Mix produits</strong>
                        <p>Pousser les produits à forte marge, upsell, cross-sell</p>
                    </li>
                    <li>
                        <strong>Optimiser production</strong>
                        <p>Automatisation, économies d'échelle, réduction gaspillage</p>
                    </li>
                </ol>

                <h3>Améliorer la marge nette</h3>
                <ol>
                    <li>
                        <strong>Contrôler les frais généraux</strong>
                        <p>Budget rigoureux, négociation contrats (loyers, assurances), remote first</p>
                    </li>
                    <li>
                        <strong>Optimiser masse salariale</strong>
                        <p>Freelances vs CDI, externalisation, productivité, automatisation</p>
                    </li>
                    <li>
                        <strong>Réduire marketing inefficace</strong>
                        <p>ROI par canal, arrêt campagnes non rentables, SEO vs SEA</p>
                    </li>
                    <li>
                        <strong>Optimisation fiscale légale</strong>
                        <p>Statut juridique, crédits d'impôt (CIR, innovation), TVA</p>
                    </li>
                </ol>

                <h2>EBITDA : la marge opérationnelle</h2>
                <p>
                    L'<strong>EBITDA</strong> (Earnings Before Interest, Taxes, Depreciation and Amortization) mesure 
                    la rentabilité opérationnelle avant charges financières, impôts et amortissements.
                </p>

                <div className="formula-box">
                    <code>EBITDA = Résultat d'exploitation + Dotations aux amortissements</code>
                </div>

                <p><strong>Utilité de l'EBITDA :</strong></p>
                <ul>
                    <li>Compare facilement des entreprises de secteurs différents</li>
                    <li>Ignore les différences de structure financière (endettement)</li>
                    <li>Mesure la capacité à générer du cash opérationnel</li>
                    <li>KPI clé pour levées de fonds et valorisations (multiples d'EBITDA)</li>
                </ul>

                <div className="kpi-box">
                    <strong>📊 Benchmarks EBITDA</strong>
                    <ul>
                        <li><strong>SaaS mature</strong> : 25-40%</li>
                        <li><strong>Services B2B</strong> : 15-25%</li>
                        <li><strong>Industrie</strong> : 10-20%</li>
                        <li><strong>Commerce</strong> : 5-10%</li>
                    </ul>
                </div>

                <h2>Suivez vos marges en temps réel</h2>
                <p>
                    FinSight calcule automatiquement votre marge brute, marge nette et EBITDA depuis vos données 
                    comptables. Plus besoin de tableaux Excel complexes.
                </p>

                <div className="cta-box">
                    <h3>🚀 Pilotez votre rentabilité avec FinSight</h3>
                    <ul>
                        <li>✅ Calcul automatique marge brute et nette</li>
                        <li>✅ Évolution mois par mois</li>
                        <li>✅ Comparaison vs benchmarks sectoriels</li>
                        <li>✅ Alertes si marges en baisse</li>
                        <li>✅ Analyse détaillée par produit/client</li>
                    </ul>
                    <Link href="/dashboard" className="cta-button">
                        Analyser ma rentabilité →
                    </Link>
                </div>
            </>
        )
    },
    'cash-flow-previsionnel-pme': {
        slug: 'cash-flow-previsionnel-pme',
        title: 'Cash flow prévisionnel : méthode pratique pour PME',
        description: 'Guide complet pour construire un cash flow prévisionnel fiable et anticiper vos besoins de trésorerie',
        date: '28 novembre 2025',
        readTime: '9 min',
        category: 'Trésorerie',
        content: (
            <>
                <p className="lead">
                    Le cash flow prévisionnel est l'outil indispensable pour éviter les crises de trésorerie. 
                    Apprenez à le construire pas à pas avec une méthode simple et des exemples concrets.
                </p>

                <h2>Pourquoi faire un cash flow prévisionnel ?</h2>
                <p>
                    Le cash flow prévisionnel (ou plan de trésorerie) vous permet d'<strong>anticiper</strong> 
                    vos entrées et sorties d'argent sur les prochains mois. C'est vital pour :
                </p>

                <ul>
                    <li>✅ <strong>Éviter les découverts bancaires</strong> coûteux</li>
                    <li>✅ <strong>Négocier un crédit à l'avance</strong> (pas en urgence)</li>
                    <li>✅ <strong>Identifier les mois tendus</strong> et prendre des mesures correctives</li>
                    <li>✅ <strong>Planifier vos investissements</strong> au bon moment</li>
                    <li>✅ <strong>Convaincre votre banquier</strong> de votre sérieux</li>
                </ul>

                <div className="warning-box">
                    <strong>⚠️ 25% des faillites de PME</strong>
                    <p>
                        sont dues à un <strong>manque de trésorerie</strong>, pas à un manque de rentabilité. 
                        Beaucoup d'entreprises rentables font faillite par manque d'anticipation.
                    </p>
                </div>

                <h2>Les 3 composantes du cash flow</h2>

                <h3>1. Cash flow opérationnel (exploitation)</h3>
                <p>Flux liés à votre activité quotidienne :</p>
                <ul>
                    <li><strong>Entrées</strong> : Encaissements clients (TTC)</li>
                    <li><strong>Sorties</strong> : Paiements fournisseurs, salaires, charges sociales, loyers, marketing</li>
                </ul>

                <h3>2. Cash flow d'investissement</h3>
                <p>Flux liés aux actifs immobilisés :</p>
                <ul>
                    <li><strong>Sorties</strong> : Achat machines, véhicules, locaux, logiciels</li>
                    <li><strong>Entrées</strong> : Revente d'actifs</li>
                </ul>

                <h3>3. Cash flow de financement</h3>
                <p>Flux liés au financement :</p>
                <ul>
                    <li><strong>Entrées</strong> : Apports en capital, emprunts bancaires, subventions</li>
                    <li><strong>Sorties</strong> : Remboursement emprunts, dividendes</li>
                </ul>

                <div className="formula-box">
                    <code>Trésorerie finale = Trésorerie initiale + Cash flow net</code>
                    <br />
                    <code>Cash flow net = Entrées - Sorties (des 3 catégories)</code>
                </div>

                <h2>Méthode pas à pas : construire son prévisionnel</h2>

                <h3>Étape 1 : Collecter les données</h3>
                <p>Rassemblez les informations suivantes :</p>

                <ul>
                    <li><strong>Trésorerie actuelle</strong> : Soldes bancaires au jour J</li>
                    <li><strong>Factures clients en attente</strong> : Liste avec dates d'échéance</li>
                    <li><strong>Factures fournisseurs à payer</strong> : Montants et dates</li>
                    <li><strong>Salaires et charges</strong> : Dates de paiement mensuelles</li>
                    <li><strong>Loyers et abonnements</strong> : Montants récurrents</li>
                    <li><strong>Emprunts</strong> : Échéancier de remboursement</li>
                    <li><strong>TVA</strong> : Dates de déclaration (mensuelle/trimestrielle)</li>
                </ul>

                <h3>Étape 2 : Construire le tableau (Excel ou outil)</h3>
                <p>Créez un tableau mensuel sur 12 mois minimum :</p>

                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>Ligne</th>
                            <th>Jan</th>
                            <th>Fév</th>
                            <th>Mar</th>
                            <th>...</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Trésorerie début</strong></td>
                            <td>50 000</td>
                            <td>42 000</td>
                            <td>38 500</td>
                            <td>...</td>
                        </tr>
                        <tr>
                            <td colSpan={5}><strong>ENCAISSEMENTS</strong></td>
                        </tr>
                        <tr>
                            <td>Ventes comptant</td>
                            <td>20 000</td>
                            <td>22 000</td>
                            <td>25 000</td>
                            <td>...</td>
                        </tr>
                        <tr>
                            <td>Créances clients</td>
                            <td>30 000</td>
                            <td>28 000</td>
                            <td>32 000</td>
                            <td>...</td>
                        </tr>
                        <tr>
                            <td><strong>Total entrées</strong></td>
                            <td>50 000</td>
                            <td>50 000</td>
                            <td>57 000</td>
                            <td>...</td>
                        </tr>
                        <tr>
                            <td colSpan={5}><strong>DÉCAISSEMENTS</strong></td>
                        </tr>
                        <tr>
                            <td>Fournisseurs</td>
                            <td>25 000</td>
                            <td>23 000</td>
                            <td>28 000</td>
                            <td>...</td>
                        </tr>
                        <tr>
                            <td>Salaires + charges</td>
                            <td>28 000</td>
                            <td>28 000</td>
                            <td>28 000</td>
                            <td>...</td>
                        </tr>
                        <tr>
                            <td>Loyer + charges fixes</td>
                            <td>5 000</td>
                            <td>5 000</td>
                            <td>5 000</td>
                            <td>...</td>
                        </tr>
                        <tr>
                            <td><strong>Total sorties</strong></td>
                            <td>58 000</td>
                            <td>56 000</td>
                            <td>61 000</td>
                            <td>...</td>
                        </tr>
                        <tr>
                            <td><strong>Cash flow net</strong></td>
                            <td>-8 000</td>
                            <td>-6 000</td>
                            <td>-4 000</td>
                            <td>...</td>
                        </tr>
                        <tr>
                            <td><strong>Trésorerie fin</strong></td>
                            <td>42 000</td>
                            <td>36 000</td>
                            <td>32 000</td>
                            <td>...</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Étape 3 : Ajuster les décalages de paiement</h3>
                <p>Point crucial : ne confondez pas <strong>facturation</strong> et <strong>encaissement</strong> !</p>

                <div className="info-box">
                    <strong>💡 Exemple concret</strong>
                    <p>
                        <strong>Facture émise</strong> : 15 janvier 2025, 10 000 € TTC<br />
                        <strong>Délai de paiement</strong> : 45 jours<br />
                        <strong>Encaissement réel</strong> : Fin février/début mars 2025
                    </p>
                    <p>
                        Dans votre prévisionnel, vous devez enregistrer les <strong>10 000 € en mars</strong>, 
                        pas en janvier !
                    </p>
                </div>

                <p><strong>Décalages typiques à intégrer :</strong></p>
                <ul>
                    <li>Clients B2B : 30-60 jours après facturation</li>
                    <li>Clients B2C : Comptant ou CB (0-3 jours)</li>
                    <li>Fournisseurs : 30-60 jours après réception facture</li>
                    <li>Salaires : Fin de mois ou début mois suivant</li>
                    <li>Charges sociales : Trimestre + 1 mois (URSSAF)</li>
                    <li>TVA : Mois + 1 (régime réel mensuel)</li>
                </ul>

                <h3>Étape 4 : Identifier les mois critiques</h3>
                <p>Repérez les mois où la trésorerie devient négative ou trop basse (&lt; 1 mois de charges) :</p>

                <div className="warning-box">
                    <strong>🚨 Signaux d'alerte</strong>
                    <ul>
                        <li>Trésorerie &lt; 0 € = Découvert bancaire (coût 8-12% TAEG)</li>
                        <li>Trésorerie &lt; 1 mois de charges = Zone dangereuse</li>
                        <li>Cash flow négatif 3 mois consécutifs = Tendance inquiétante</li>
                    </ul>
                </div>

                <h3>Étape 5 : Prendre des mesures correctives</h3>
                <p>Si vous identifiez un risque, agissez AVANT la crise :</p>

                <ol>
                    <li>
                        <strong>Court terme (0-3 mois)</strong>
                        <ul>
                            <li>Accélérer relances clients (escompte 2% paiement anticipé)</li>
                            <li>Négocier délais fournisseurs supplémentaires</li>
                            <li>Reporter investissements non urgents</li>
                            <li>Demander découvert autorisé à votre banque</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Moyen terme (3-6 mois)</strong>
                        <ul>
                            <li>Affacturage (transformez créances en cash immédiat)</li>
                            <li>Crédit court terme (Dailly, facilité de caisse)</li>
                            <li>Réduire stocks excédentaires (promotions)</li>
                            <li>Optimiser BFR (voir <Link href="/blog/bfr-formule-optimisation" className="inline-link">notre guide BFR</Link>)</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Long terme (6-12 mois)</strong>
                        <ul>
                            <li>Augmentation de capital (associés, investisseurs)</li>
                            <li>Prêt bancaire moyen terme</li>
                            <li>Aides publiques (BPI France, subventions)</li>
                        </ul>
                    </li>
                </ol>

                <h2>Cas pratique : startup SaaS en croissance</h2>
                <p>Situation : Startup B2B SaaS, CA 80k€/mois, croissance 30%/an</p>

                <div className="example-box">
                    <p><strong>Prévisionnel 6 mois :</strong></p>
                    <table className="benchmark-table">
                        <tbody>
                            <tr>
                                <td><strong>Mois</strong></td>
                                <td>Jan</td>
                                <td>Fév</td>
                                <td>Mar</td>
                                <td>Avr</td>
                                <td>Mai</td>
                                <td>Jun</td>
                            </tr>
                            <tr>
                                <td>Tréso début</td>
                                <td>100k</td>
                                <td>88k</td>
                                <td>74k</td>
                                <td>58k</td>
                                <td>40k</td>
                                <td>20k</td>
                            </tr>
                            <tr>
                                <td>MRR encaissé</td>
                                <td>75k</td>
                                <td>78k</td>
                                <td>82k</td>
                                <td>85k</td>
                                <td>89k</td>
                                <td>93k</td>
                            </tr>
                            <tr>
                                <td>Salaires</td>
                                <td>-50k</td>
                                <td>-50k</td>
                                <td>-60k</td>
                                <td>-60k</td>
                                <td>-60k</td>
                                <td>-70k</td>
                            </tr>
                            <tr>
                                <td>Cloud/SaaS</td>
                                <td>-8k</td>
                                <td>-9k</td>
                                <td>-10k</td>
                                <td>-11k</td>
                                <td>-12k</td>
                                <td>-13k</td>
                            </tr>
                            <tr>
                                <td>Marketing</td>
                                <td>-15k</td>
                                <td>-18k</td>
                                <td>-20k</td>
                                <td>-20k</td>
                                <td>-25k</td>
                                <td>-25k</td>
                            </tr>
                            <tr>
                                <td>Fixes</td>
                                <td>-14k</td>
                                <td>-14k</td>
                                <td>-14k</td>
                                <td>-14k</td>
                                <td>-14k</td>
                                <td>-14k</td>
                            </tr>
                            <tr>
                                <td><strong>Cash flow</strong></td>
                                <td>-12k</td>
                                <td>-14k</td>
                                <td>-16k</td>
                                <td>-18k</td>
                                <td>-20k</td>
                                <td>-29k</td>
                            </tr>
                            <tr>
                                <td><strong>Tréso fin</strong></td>
                                <td>88k</td>
                                <td>74k</td>
                                <td>58k</td>
                                <td>40k</td>
                                <td>20k</td>
                                <td className="warning">-9k</td>
                            </tr>
                        </tbody>
                    </table>

                    <p className="warning">
                        <strong>⚠️ Alerte détectée :</strong> Trésorerie négative en juin malgré croissance du CA
                    </p>

                    <p><strong>Actions correctives (prises en mars) :</strong></p>
                    <ul>
                        <li>✅ Levée de fonds 200k€ (avril) → Trésorerie juin = +191k€</li>
                        <li>✅ OU crédit court terme 100k€ → Permet de tenir 6 mois</li>
                    </ul>
                </div>

                <h2>Outils pour automatiser votre prévisionnel</h2>

                <h3>Solution simple : Excel/Google Sheets</h3>
                <p>Avantages : Gratuit, flexible, personnalisable</p>
                <p>Inconvénients : Chronophage, erreurs manuelles, pas de mise à jour auto</p>

                <h3>Solution moderne : FinSight</h3>
                <p>
                    FinSight génère automatiquement votre prévisionnel de trésorerie depuis vos données comptables 
                    et vous alerte des tensions à venir.
                </p>

                <div className="cta-box">
                    <h3>🚀 Anticipez votre trésorerie avec FinSight</h3>
                    <ul>
                        <li>✅ Prévisionnel auto sur 12 mois (scénarios optimiste/réaliste/pessimiste)</li>
                        <li>✅ Alertes si trésorerie &lt; seuil critique</li>
                        <li>✅ Simulation d'impact (recrutement, investissement)</li>
                        <li>✅ Export PDF pour banquier</li>
                        <li>✅ Mise à jour automatique depuis vos comptes</li>
                    </ul>
                    <Link href="/dashboard" className="cta-button">
                        Créer mon prévisionnel →
                    </Link>
                </div>

                <h2>FAQ Prévisionnel de trésorerie</h2>

                <div className="kpi-box">
                    <p><strong>À quelle fréquence mettre à jour le prévisionnel ?</strong></p>
                    <p>
                        <strong>Mensuel minimum</strong> pour les PME stables. <strong>Hebdomadaire</strong> pour 
                        les startups en croissance ou les entreprises en difficulté.
                    </p>

                    <p><strong>Quelle marge de sécurité avoir ?</strong></p>
                    <p>
                        Minimum <strong>1 mois de charges fixes</strong> en trésorerie. Idéal : <strong>2-3 mois</strong>.
                    </p>

                    <p><strong>Comment gérer l'incertitude ?</strong></p>
                    <p>
                        Créez <strong>3 scénarios</strong> : optimiste (+20% CA), réaliste (tendance actuelle), 
                        pessimiste (-20% CA). Préparez-vous au pire.
                    </p>
                </div>
            </>
        )
    }
}

export default function BlogArticlePage() {
    const params = useParams()
    const slug = params?.slug as string
    const article = articles[slug]

    if (!article) {
        return (
            <div className="min-h-screen bg-primary text-primary font-sans">
                <Header />
                <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                    <h1 className="text-4xl font-bold mb-4">Article non trouvé</h1>
                    <Link href="/blog" className="text-accent-primary hover:underline">
                        ← Retour au blog
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-primary text-primary font-sans">
            <Header />

            <article className="max-w-3xl mx-auto px-6 py-12">
                {/* Breadcrumb */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-secondary hover:text-accent-primary transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour au blog
                </Link>

                {/* Article Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-accent-primary-subtle text-accent-primary text-xs font-medium rounded-full">
                            {article.category}
                        </span>
                        <span className="flex items-center gap-2 text-tertiary text-sm">
                            <Calendar className="w-4 h-4" />
                            {article.date}
                        </span>
                        <span className="flex items-center gap-2 text-tertiary text-sm">
                            <Clock className="w-4 h-4" />
                            {article.readTime}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        {article.title}
                    </h1>

                    <p className="text-xl text-secondary leading-relaxed">
                        {article.description}
                    </p>
                </header>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none article-content">
                    {article.content}
                </div>

                {/* Article Footer */}
                <footer className="mt-16 pt-8 border-t border-border-subtle">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-secondary hover:text-accent-primary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Tous les articles
                        </Link>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-white rounded-lg font-semibold transition-all"
                        >
                            Essayer FinSight
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </footer>
            </article>

            <Footer />

            <style jsx global>{`
                .article-content {
                    color: var(--color-text-primary);
                }

                .article-content .lead {
                    font-size: 1.25rem;
                    line-height: 1.75;
                    color: var(--color-text-secondary);
                    margin-bottom: 2rem;
                    padding-left: 1rem;
                    border-left: 4px solid var(--color-accent-primary);
                }

                .article-content h2 {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-top: 3rem;
                    margin-bottom: 1.5rem;
                    color: var(--color-text-primary);
                }

                .article-content p {
                    margin-bottom: 1.5rem;
                    line-height: 1.75;
                    color: var(--color-text-secondary);
                }

                .article-content ul, .article-content ol {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                }

                .article-content li {
                    margin-bottom: 0.75rem;
                    line-height: 1.75;
                    color: var(--color-text-secondary);
                }

                .article-content strong {
                    color: var(--color-text-primary);
                    font-weight: 600;
                }

                .article-content code {
                    display: block;
                    background: var(--color-surface-elevated);
                    border: 1px solid var(--color-border-default);
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    font-family: 'Monaco', 'Courier New', monospace;
                    font-size: 0.95rem;
                    margin: 1.5rem 0;
                    color: var(--color-accent-primary);
                }

                .article-content .info-box,
                .article-content .warning-box,
                .article-content .example-box,
                .article-content .kpi-box,
                .article-content .cta-box {
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                    margin: 2rem 0;
                    border-left: 4px solid;
                }

                .article-content .info-box {
                    background: rgba(59, 130, 246, 0.1);
                    border-color: #3b82f6;
                }

                .article-content .warning-box {
                    background: rgba(251, 191, 36, 0.1);
                    border-color: #fbbf24;
                }

                .article-content .example-box {
                    background: var(--color-surface-elevated);
                    border-color: var(--color-accent-primary);
                }

                .article-content .kpi-box {
                    background: var(--color-surface-elevated);
                    border-color: var(--color-accent-primary);
                }

                .article-content .kpi-box code {
                    margin: 1rem 0;
                }

                .article-content .cta-box {
                    background: var(--color-accent-primary-subtle);
                    border-color: var(--color-accent-primary);
                    text-align: center;
                }

                .article-content .cta-box h3 {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    color: var(--color-text-primary);
                }

                .article-content .cta-box ul {
                    text-align: left;
                    max-width: 400px;
                    margin: 1.5rem auto;
                }

                .article-content .cta-button {
                    display: inline-block;
                    padding: 0.75rem 2rem;
                    background: var(--color-accent-primary);
                    color: white;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s;
                    margin-top: 1rem;
                }

                .article-content .cta-button:hover {
                    background: var(--color-accent-primary-hover);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
                }

                .article-content .formula-box {
                    background: var(--color-surface-elevated);
                    border: 2px solid var(--color-accent-primary);
                    padding: 2rem;
                    border-radius: 0.75rem;
                    text-align: center;
                    margin: 2rem 0;
                }

                .article-content .formula-box code {
                    font-size: 1.25rem;
                    font-weight: 600;
                    display: inline-block;
                    background: none;
                    border: none;
                    padding: 0;
                }

                .article-content .benchmark-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 2rem 0;
                }

                .article-content .benchmark-table th,
                .article-content .benchmark-table td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid var(--color-border-default);
                }

                .article-content .benchmark-table th {
                    background: var(--color-surface-elevated);
                    font-weight: 600;
                    color: var(--color-text-primary);
                }

                .article-content .benchmark-table td {
                    color: var(--color-text-secondary);
                }

                .article-content .result {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--color-accent-primary);
                    margin-top: 1rem;
                }

                .article-content .inline-link {
                    color: var(--color-accent-primary);
                    text-decoration: underline;
                }

                .article-content .inline-link:hover {
                    opacity: 0.8;
                }

                .article-content .tip {
                    font-style: italic;
                    color: var(--color-text-secondary);
                }

                .article-content .warning {
                    color: #f59e0b;
                    font-weight: 600;
                }
            `}</style>
        </div>
    )
}

// Merge all articles from different files
const articles: Record<string, BlogArticle> = {
    ...baseArticles,
    ...additionalArticles,
    ...moreArticles,
    ...finalArticles
}
