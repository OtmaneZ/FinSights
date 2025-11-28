'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface BlogArticle {
    slug: string
    title: string
    description: string
    date: string
    readTime: string
    category: string
    content: React.ReactNode
}

const articles: Record<string, BlogArticle> = {
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
