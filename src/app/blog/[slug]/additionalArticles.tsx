/**
 * ADDITIONAL BLOG ARTICLES CONTENT
 * Articles 6-10 pour FinSight Blog
 */

export const additionalArticles = {
    'top-7-kpis-startups-saas': {
        slug: 'top-7-kpis-startups-saas',
        title: 'Top 7 KPIs financiers pour startups SaaS',
        description: 'Les indicateurs essentiels à suivre pour piloter efficacement une startup SaaS : MRR, Churn, CAC, LTV',
        date: '28 novembre 2025',
        readTime: '8 min',
        category: 'SaaS',
        content: (
            <>
                <p className="lead">
                    Piloter une startup SaaS nécessite de suivre des KPIs spécifiques différents des PME traditionnelles. 
                    Voici les 7 indicateurs indispensables pour optimiser votre croissance et convaincre vos investisseurs.
                </p>

                <h2>1. MRR (Monthly Recurring Revenue)</h2>
                <p>
                    Le <strong>MRR</strong> (Revenu Récurrent Mensuel) est le KPI #1 des SaaS. Il mesure le chiffre d'affaires 
                    prévisible généré par les abonnements chaque mois.
                </p>

                <div className="formula-box">
                    <code>MRR = Nombre d'abonnés actifs × Prix moyen mensuel</code>
                </div>

                <p><strong>Décomposition du MRR :</strong></p>
                <ul>
                    <li><strong>New MRR</strong> : Nouveaux clients du mois</li>
                    <li><strong>Expansion MRR</strong> : Upsell/cross-sell clients existants</li>
                    <li><strong>Churned MRR</strong> : Clients perdus</li>
                    <li><strong>Net New MRR</strong> : New + Expansion - Churned</li>
                </ul>

                <div className="example-box">
                    <p><strong>Exemple SaaS B2B :</strong></p>
                    <ul>
                        <li>150 clients actifs</li>
                        <li>Prix moyen : 99 €/mois</li>
                    </ul>
                    <code>MRR = 150 × 99 = 14 850 €</code>
                    <code>ARR (Annual) = MRR × 12 = 178 200 €</code>
                </div>

                <h2>2. Churn Rate (Taux d'attrition)</h2>
                <p>
                    Le <strong>Churn</strong> mesure le pourcentage de clients qui annulent leur abonnement chaque mois. 
                    C'est le KPI le plus critique pour la survie d'un SaaS.
                </p>

                <div className="formula-box">
                    <code>Churn Rate = (Clients perdus / Clients début période) × 100</code>
                </div>

                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>Churn mensuel</th>
                            <th>Interprétation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>&lt; 2%</td>
                            <td>✅ Excellent (SaaS mature)</td>
                        </tr>
                        <tr>
                            <td>2-5%</td>
                            <td>✅ Bon (standard B2B)</td>
                        </tr>
                        <tr>
                            <td>5-10%</td>
                            <td>⚠️ À améliorer</td>
                        </tr>
                        <tr>
                            <td>&gt; 10%</td>
                            <td>🚨 Critique (problème produit/marché)</td>
                        </tr>
                    </tbody>
                </table>

                <div className="warning-box">
                    <strong>⚠️ Règle des 5%</strong>
                    <p>
                        Avec un churn de <strong>5%/mois</strong>, vous perdez <strong>100% de vos clients en 20 mois</strong>. 
                        Il faut acquérir 5% de nouveaux clients chaque mois juste pour rester stable !
                    </p>
                </div>

                <h2>3. CAC (Customer Acquisition Cost)</h2>
                <p>
                    Le <strong>CAC</strong> représente combien il vous coûte pour acquérir un nouveau client (marketing + sales).
                </p>

                <div className="formula-box">
                    <code>CAC = (Dépenses Marketing + Sales) / Nombre nouveaux clients</code>
                </div>

                <div className="example-box">
                    <p><strong>Exemple :</strong></p>
                    <ul>
                        <li>Budget marketing : 10 000 €/mois</li>
                        <li>Salaires commerciaux : 15 000 €/mois</li>
                        <li>Nouveaux clients : 25</li>
                    </ul>
                    <code>CAC = (10 000 + 15 000) / 25 = 1 000 € par client</code>
                </div>

                <p><strong>Benchmarks CAC par canal :</strong></p>
                <ul>
                    <li><strong>SEO/Content</strong> : 200-500 €</li>
                    <li><strong>Ads (Google/LinkedIn)</strong> : 500-2000 €</li>
                    <li><strong>Sales outbound</strong> : 1000-5000 €</li>
                </ul>

                <h2>4. LTV (Lifetime Value)</h2>
                <p>
                    La <strong>LTV</strong> estime le revenu total qu'un client génèrera sur toute sa durée de vie.
                </p>

                <div className="formula-box">
                    <code>LTV = ARPA × (1 / Churn Rate)</code>
                    <br />
                    <code>Ou simplifié : LTV = Prix mensuel × Durée vie moyenne (mois)</code>
                </div>

                <div className="example-box">
                    <p><strong>Calcul :</strong></p>
                    <ul>
                        <li>Prix moyen : 99 €/mois</li>
                        <li>Churn : 3%/mois → Durée vie moyenne = 1/0.03 = 33 mois</li>
                    </ul>
                    <code>LTV = 99 × 33 = 3 267 €</code>
                </div>

                <h2>5. Ratio LTV/CAC</h2>
                <p>
                    Le ratio <strong>LTV/CAC</strong> indique si votre modèle d'acquisition est rentable.
                </p>

                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>Ratio LTV/CAC</th>
                            <th>Interprétation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>&lt; 1</td>
                            <td>🚨 Modèle non viable (perte sur chaque client)</td>
                        </tr>
                        <tr>
                            <td>1-3</td>
                            <td>⚠️ Limite de rentabilité</td>
                        </tr>
                        <tr>
                            <td>3-5</td>
                            <td>✅ Bon équilibre (standard SaaS)</td>
                        </tr>
                        <tr>
                            <td>&gt; 5</td>
                            <td>✅ Excellent (mais peut signaler sous-investissement marketing)</td>
                        </tr>
                    </tbody>
                </table>

                <div className="info-box">
                    <strong>💡 Règle d'or</strong>
                    <p>
                        Visez un ratio <strong>LTV/CAC = 3</strong>. Cela signifie que chaque euro dépensé en acquisition 
                        génère 3€ de revenu, assurant marge et croissance durable.
                    </p>
                </div>

                <h2>6. Payback Period (Temps de récupération CAC)</h2>
                <p>
                    Le <strong>Payback Period</strong> mesure combien de mois il faut pour récupérer le coût d'acquisition 
                    d'un client via ses paiements mensuels.
                </p>

                <div className="formula-box">
                    <code>Payback Period = CAC / MRR moyen par client</code>
                </div>

                <div className="example-box">
                    <p><strong>Calcul :</strong></p>
                    <ul>
                        <li>CAC : 1 000 €</li>
                        <li>MRR moyen : 99 €/mois</li>
                    </ul>
                    <code>Payback = 1 000 / 99 = 10,1 mois</code>
                    <p className="result">Il faut 10 mois pour récupérer l'investissement initial</p>
                </div>

                <p><strong>Benchmarks Payback Period :</strong></p>
                <ul>
                    <li><strong>&lt; 6 mois</strong> : ✅ Excellent (croissance rapide possible)</li>
                    <li><strong>6-12 mois</strong> : ✅ Bon (standard SaaS B2B)</li>
                    <li><strong>12-18 mois</strong> : ⚠️ Acceptable si LTV élevée</li>
                    <li><strong>&gt; 18 mois</strong> : 🚨 Besoin de beaucoup de cash pour croître</li>
                </ul>

                <h2>7. Net Dollar Retention (NDR)</h2>
                <p>
                    Le <strong>NDR</strong> mesure l'évolution du revenu d'une cohorte de clients sur 12 mois, 
                    incluant expansion et churn.
                </p>

                <div className="formula-box">
                    <code>NDR = (MRR début + Expansion - Churn - Contraction) / MRR début × 100</code>
                </div>

                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>NDR</th>
                            <th>Signification</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>&lt; 100%</td>
                            <td>⚠️ Vous perdez du revenu sur vos clients existants</td>
                        </tr>
                        <tr>
                            <td>100-110%</td>
                            <td>✅ Stable avec légère croissance</td>
                        </tr>
                        <tr>
                            <td>110-130%</td>
                            <td>✅ Excellent (expansion compense le churn)</td>
                        </tr>
                        <tr>
                            <td>&gt; 130%</td>
                            <td>🔥 Exceptionnel (Slack, Snowflake niveau)</td>
                        </tr>
                    </tbody>
                </table>

                <div className="info-box">
                    <strong>💰 NDR &gt; 100% = Croissance sans acquisition</strong>
                    <p>
                        Un NDR supérieur à 100% signifie que vos clients existants génèrent plus de revenu qu'au début, 
                        même sans nouveaux clients. C'est le Graal du SaaS !
                    </p>
                </div>

                <h2>Dashboard SaaS : les 7 KPIs en un coup d'œil</h2>
                <p>
                    Pour piloter efficacement, suivez ces 7 métriques hebdomadairement :
                </p>

                <div className="kpi-box">
                    <strong>🎯 Dashboard idéal startup SaaS</strong>
                    <ol>
                        <li><strong>MRR</strong> : 14 850 € (+12% MoM)</li>
                        <li><strong>ARR</strong> : 178 200 €</li>
                        <li><strong>Churn</strong> : 3,2%/mois</li>
                        <li><strong>CAC</strong> : 1 000 €</li>
                        <li><strong>LTV</strong> : 3 267 €</li>
                        <li><strong>LTV/CAC</strong> : 3,27 ✅</li>
                        <li><strong>NDR</strong> : 115%</li>
                    </ol>
                </div>

                <div className="cta-box">
                    <h3>🚀 Calculez vos KPIs SaaS automatiquement</h3>
                    <p>
                        FinSight calcule automatiquement vos métriques SaaS depuis vos données Stripe, 
                        Chargebee ou exports CSV.
                    </p>
                    <ul>
                        <li>✅ MRR, ARR, Churn en temps réel</li>
                        <li>✅ Cohortes clients et NDR</li>
                        <li>✅ CAC par canal d'acquisition</li>
                        <li>✅ Alertes si métriques dégradées</li>
                    </ul>
                </div>
            </>
        )
    }
}
