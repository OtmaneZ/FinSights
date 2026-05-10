'use client'

import React, { useEffect, useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowLeft, ArrowRight, BookOpen, ChevronRight, Share2, Bookmark, TrendingUp, BarChart3, Wallet, PiggyBank, FileText, Shield } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import BlogCTA from '@/components/BlogCTA'
import { generateArticleJsonLd, generateBreadcrumbJsonLd, getArticleBySlug } from '@/lib/seo'
import { trackArticleView, trackArticleReadTime, trackCTAClick } from '@/lib/analytics'
import { additionalArticles } from './additionalArticles'
import { moreArticles } from './moreArticles'
import { finalArticles } from './finalArticles'
import { seoArticles } from './seoArticles'
import { strategicArticles } from './strategicArticles'
import { caseStudyArticles } from './caseStudyArticles'
import { ARTICLE_CALCULATOR_MAP } from '@/lib/blog/calculatorMapping'

interface BlogArticle {
    slug: string
    title: string
    description: string
    date: string
    readTime: string
    category: string
    content: React.ReactNode
    image?: string
}

// Configuration des catégories avec icônes et couleurs
const categoryConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
    'Note Stratégique': { icon: Shield, color: 'text-slate-300', bgColor: 'bg-slate-700/50' },
    'Étude de cas': { icon: TrendingUp, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
    'KPIs': { icon: TrendingUp, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    'Trésorerie': { icon: Wallet, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
    'Analyse': { icon: BarChart3, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    'Gestion': { icon: FileText, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
    'Rentabilité': { icon: PiggyBank, color: 'text-pink-400', bgColor: 'bg-pink-500/20' }
}

// Images hero par catégorie
const categoryImages: Record<string, string> = {
    'Note Stratégique': '/images/bureau-nuit.png',
    'Étude de cas': '/images/bureau.png',
    'KPIs': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
    'Trésorerie': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop',
    'Analyse': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
    'Gestion': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
    'Rentabilité': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=600&fit=crop'
}

const baseArticles: Record<string, BlogArticle> = {
    'lire-bilan-compte-resultat-guide-pratique': {
        slug: 'lire-bilan-compte-resultat-guide-pratique',
        title: 'Lire un bilan et un compte de résultat : guide pratique',
        description: 'Apprenez à décrypter vos états financiers en 15 minutes : bilan, compte de résultat, signaux d\'alerte et questions à poser à votre comptable',
        date: '25 janvier 2026',
        readTime: '12 min',
        category: 'Gestion',
        image: '/images/bureau-nuit.png',
        content: (
            <>
                <p className="lead">
                    Vous recevez le bilan de votre expert-comptable : 50 pages de chiffres, des comptes numérotés, 
                    des totaux partout... et vous ne comprenez <strong>rien</strong>. C'est normal. 
                    En 15 minutes, vous allez apprendre à lire un bilan et un compte de résultat comme un pro.
                </p>

                <h2>Le syndrome du bilan illisible</h2>
                <p>
                    Chaque année, des milliers de dirigeants de PME reçoivent leurs états financiers et se retrouvent 
                    face au même problème : <strong>comment interpréter ces chiffres ?</strong>
                </p>

                <div className="warning-box">
                    <strong>🤯 La réalité :</strong>
                    <ul>
                        <li>80% des dirigeants de PME ne savent pas lire un bilan</li>
                        <li>60% confondent résultat et trésorerie</li>
                        <li>La plupart signent leurs comptes annuels sans les comprendre</li>
                    </ul>
                    <p>
                        <strong>Ce n'est pas de votre faute.</strong> Les états financiers sont conçus pour les comptables, 
                        pas pour les chefs d'entreprise. C'est comme recevoir un manuel technique de voiture en chinois.
                    </p>
                </div>

                <h2>Ce que vous allez apprendre</h2>
                <p>Dans ce guide pratico-pratique, vous allez découvrir :</p>

                <ul>
                    <li>✅ Les 3 blocs du bilan expliqués simplement</li>
                    <li>✅ Les 5 lignes clés à surveiller en priorité</li>
                    <li>✅ Comment lire le compte de résultat du CA au résultat net</li>
                    <li>✅ Les 7 signaux d'alerte qui doivent vous inquiéter</li>
                    <li>✅ Les questions essentielles à poser à votre expert-comptable</li>
                    <li>✅ Un cas pratique avec un vrai bilan décrypté ligne par ligne</li>
                </ul>

                <h2>Le bilan en 3 blocs simples</h2>
                <p>
                    Le bilan, c'est la <strong>photo de votre entreprise à un instant T</strong> (généralement le 31 décembre). 
                    Il se compose de 2 grandes colonnes :
                </p>

                <div className="info-box">
                    <strong>📸 Le bilan en une phrase :</strong>
                    <p>
                        <strong>ACTIF</strong> (colonne gauche) = Ce que vous possédez<br />
                        <strong>PASSIF</strong> (colonne droite) = Comment c'est financé
                    </p>
                    <p className="result">
                        <strong>Règle d'or :</strong> ACTIF = PASSIF (équilibre obligatoire)
                    </p>
                </div>

                <h3>Bloc 1 : L'ACTIF (ce que vous possédez)</h3>

                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>Type d'actif</th>
                            <th>Ce que c'est</th>
                            <th>Exemples concrets</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Actif immobilisé</strong></td>
                            <td>Biens durables (&gt; 1 an)</td>
                            <td>Locaux, machines, véhicules, logiciels, brevets</td>
                        </tr>
                        <tr>
                            <td><strong>Actif circulant</strong></td>
                            <td>Biens à court terme (&lt; 1 an)</td>
                            <td>Stocks, créances clients, trésorerie</td>
                        </tr>
                    </tbody>
                </table>

                <div className="example-box">
                    <p><strong>💡 Exemple concret - PME de distribution :</strong></p>
                    <p><strong>Actif immobilisé :</strong></p>
                    <ul>
                        <li>Entrepôt : 500 k€</li>
                        <li>Camions de livraison : 150 k€</li>
                        <li>Logiciel de gestion : 20 k€</li>
                        <li><strong>Total actif immobilisé : 670 k€</strong></li>
                    </ul>

                    <p><strong>Actif circulant :</strong></p>
                    <ul>
                        <li>Stocks de marchandises : 200 k€</li>
                        <li>Créances clients (factures non payées) : 180 k€</li>
                        <li>Trésorerie (banque) : 80 k€</li>
                        <li><strong>Total actif circulant : 460 k€</strong></li>
                    </ul>

                    <p className="result">
                        <strong>TOTAL ACTIF = 670 k€ + 460 k€ = 1 130 k€</strong>
                    </p>
                </div>

                <h3>Bloc 2 : Le PASSIF (comment c'est financé)</h3>

                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>Type de passif</th>
                            <th>Ce que c'est</th>
                            <th>Exemples concrets</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Capitaux propres</strong></td>
                            <td>Argent des actionnaires + bénéfices accumulés</td>
                            <td>Capital social, réserves, résultat de l'année</td>
                        </tr>
                        <tr>
                            <td><strong>Dettes</strong></td>
                            <td>Argent emprunté ou dû</td>
                            <td>Emprunts bancaires, dettes fournisseurs, charges sociales</td>
                        </tr>
                    </tbody>
                </table>

                <div className="example-box">
                    <p><strong>Suite exemple PME distribution :</strong></p>
                    <p><strong>Capitaux propres :</strong></p>
                    <ul>
                        <li>Capital social : 100 k€</li>
                        <li>Réserves (bénéfices passés) : 250 k€</li>
                        <li>Résultat de l'année : 80 k€</li>
                        <li><strong>Total capitaux propres : 430 k€</strong></li>
                    </ul>

                    <p><strong>Dettes :</strong></p>
                    <ul>
                        <li>Emprunt bancaire : 400 k€</li>
                        <li>Dettes fournisseurs : 250 k€</li>
                        <li>Charges sociales à payer : 50 k€</li>
                        <li><strong>Total dettes : 700 k€</strong></li>
                    </ul>

                    <p className="result">
                        <strong>TOTAL PASSIF = 430 k€ + 700 k€ = 1 130 k€</strong>
                        <br />
                        ✅ ACTIF (1 130 k€) = PASSIF (1 130 k€) → Le bilan est équilibré !
                    </p>
                </div>

                <h3>Bloc 3 : La règle de l'équilibre</h3>

                <div className="info-box">
                    <strong>💡 Comprendre l'équilibre du bilan :</strong>
                    <p>
                        Imaginez que vous achetez une maison de 300 k€ :
                    </p>
                    <ul>
                        <li><strong>ACTIF</strong> : Vous possédez une maison de 300 k€</li>
                        <li><strong>PASSIF</strong> : Financée par :
                            <ul>
                                <li>Votre apport personnel (capitaux propres) : 100 k€</li>
                                <li>Emprunt bancaire (dette) : 200 k€</li>
                            </ul>
                        </li>
                    </ul>
                    <p>
                        <strong>300 k€ (actif) = 100 k€ (capitaux propres) + 200 k€ (dette)</strong>
                    </p>
                    <p>
                        C'est exactement le même principe pour une entreprise !
                    </p>
                </div>

                <h2>Les 5 lignes clés du bilan à surveiller</h2>

                <h3>1. Trésorerie : "Combien d'argent RÉEL j'ai ?"</h3>
                <div className="kpi-box">
                    <p><strong>Où la trouver :</strong> ACTIF → Actif circulant → Disponibilités</p>
                    <p><strong>Ce que c'est :</strong> Solde de vos comptes bancaires + caisse</p>
                    
                    <p><strong>Seuils d'alerte :</strong></p>
                    <ul>
                        <li>Trésorerie &lt; 1 mois de charges fixes : 🚨 <strong>Critique</strong></li>
                        <li>Trésorerie = 1-2 mois de charges : ⚠️ <strong>À surveiller</strong></li>
                        <li>Trésorerie &gt; 3 mois de charges : ✅ <strong>Confortable</strong></li>
                    </ul>

                    <p className="example">
                        <strong>Exemple :</strong> PME avec 50 k€ de charges mensuelles
                        <ul>
                            <li>Trésorerie 30 k€ → 🚨 Moins d'un mois de survie</li>
                            <li>Trésorerie 80 k€ → ⚠️ 1,6 mois (juste)</li>
                            <li>Trésorerie 200 k€ → ✅ 4 mois (sécurisé)</li>
                        </ul>
                    </p>
                </div>

                <h3>2. Créances clients : "Combien on me doit ?"</h3>
                <div className="kpi-box">
                    <p><strong>Où la trouver :</strong> ACTIF → Actif circulant → Créances clients</p>
                    <p><strong>Ce que c'est :</strong> Factures émises mais pas encore encaissées</p>
                    
                    <p><strong>Signal d'alerte :</strong></p>
                    <ul>
                        <li>Créances qui augmentent plus vite que le CA : 🚨 <strong>Clients qui paient mal</strong></li>
                        <li>Créances &gt; 3 mois de CA : ⚠️ <strong>DSO trop élevé</strong></li>
                    </ul>

                    <p className="example">
                        <strong>Exemple :</strong> CA annuel 1,2 M€ → Créances normales : 100-150 k€ (1-1,5 mois)
                        <br />
                        Si créances = 400 k€ → 🚨 Problème grave de recouvrement (DSO 122 jours)
                    </p>
                </div>

                <h3>3. Dettes fournisseurs : "Combien je dois ?"</h3>
                <div className="kpi-box">
                    <p><strong>Où la trouver :</strong> PASSIF → Dettes → Dettes fournisseurs</p>
                    <p><strong>Ce que c'est :</strong> Factures fournisseurs reçues mais pas encore payées</p>
                    
                    <p><strong>Bon à savoir :</strong></p>
                    <ul>
                        <li>Dettes fournisseurs = financement gratuit (tant que vous respectez les délais)</li>
                        <li>Délai légal maximum en France : 60 jours</li>
                    </ul>

                    <p className="warning">
                        ⚠️ <strong>Attention :</strong> Si vos dettes fournisseurs explosent soudainement, 
                        c'est souvent que vous n'arrivez plus à payer à temps (problème de trésorerie).
                    </p>
                </div>

                <h3>4. Capitaux propres : "La valeur nette de mon entreprise"</h3>
                <div className="kpi-box">
                    <p><strong>Où les trouver :</strong> PASSIF → Capitaux propres → Total</p>
                    <p><strong>Ce que c'est :</strong> Ce qui reste si vous vendez tout et remboursez toutes les dettes</p>
                    
                    <div className="formula-box">
                        <code>Capitaux propres = Actif total - Dettes totales</code>
                    </div>

                    <p><strong>Signaux d'alerte :</strong></p>
                    <ul>
                        <li>Capitaux propres <strong>négatifs</strong> : 🚨 <strong>Situation de faillite juridique</strong></li>
                        <li>Capitaux propres en baisse 2 années consécutives : ⚠️ <strong>Érosion de la valeur</strong></li>
                        <li>Capitaux propres &lt; 10% du total bilan : ⚠️ <strong>Sous-capitalisation</strong></li>
                    </ul>

                    <p className="example">
                        <strong>Exemple :</strong>
                        <ul>
                            <li>Actif total : 1 M€</li>
                            <li>Dettes totales : 800 k€</li>
                            <li>Capitaux propres : 1 M€ - 800 k€ = 200 k€ (20% du bilan) ✅</li>
                        </ul>
                    </p>
                </div>

                <h3>5. Dettes bancaires : "Mon niveau d'endettement"</h3>
                <div className="kpi-box">
                    <p><strong>Où les trouver :</strong> PASSIF → Dettes financières → Emprunts</p>
                    <p><strong>Ce que c'est :</strong> Crédits bancaires à rembourser</p>
                    
                    <p><strong>Ratio clé à calculer :</strong></p>
                    <div className="formula-box">
                        <code>Ratio d'endettement = Dettes bancaires / Capitaux propres</code>
                    </div>

                    <table className="benchmark-table">
                        <thead>
                            <tr>
                                <th>Ratio</th>
                                <th>Interprétation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>&lt; 0,5</td>
                                <td>✅ Faible endettement (capacité d'emprunt)</td>
                            </tr>
                            <tr>
                                <td>0,5 - 1</td>
                                <td>✅ Endettement raisonnable</td>
                            </tr>
                            <tr>
                                <td>1 - 2</td>
                                <td>⚠️ Endettement élevé (surveiller)</td>
                            </tr>
                            <tr>
                                <td>&gt; 2</td>
                                <td>🚨 Surendettement (difficulté à emprunter)</td>
                            </tr>
                        </tbody>
                    </table>

                    <p className="example">
                        <strong>Exemple :</strong>
                        <ul>
                            <li>Dettes bancaires : 300 k€</li>
                            <li>Capitaux propres : 200 k€</li>
                            <li>Ratio = 300 / 200 = 1,5 → ⚠️ Endettement élevé mais gérable</li>
                        </ul>
                    </p>
                </div>

                <h2>Le compte de résultat : du CA au résultat net</h2>

                <p>
                    Le compte de résultat, c'est le <strong>film de votre activité sur l'année</strong>. 
                    Contrairement au bilan (photo), il montre les flux (entrées/sorties).
                </p>

                <h3>Structure en cascade</h3>

                <div className="formula-box">
                    <p><strong>Chiffre d'affaires (CA)</strong></p>
                    <p>- Coût des ventes (achats, marchandises, production)</p>
                    <p>= <strong>Marge brute</strong></p>
                    <p>- Charges d'exploitation (salaires, loyers, marketing...)</p>
                    <p>= <strong>Résultat d'exploitation (EBIT)</strong></p>
                    <p>- Charges financières (intérêts d'emprunt)</p>
                    <p>+/- Résultat exceptionnel</p>
                    <p>- Impôt sur les sociétés</p>
                    <p>= <strong>RÉSULTAT NET</strong></p>
                </div>

                <h3>Exemple chiffré - PME e-commerce</h3>

                <div className="example-box">
                    <table className="benchmark-table">
                        <tbody>
                            <tr>
                                <td><strong>Chiffre d'affaires</strong></td>
                                <td className="text-right">2 000 k€</td>
                            </tr>
                            <tr>
                                <td>- Coût des marchandises vendues</td>
                                <td className="text-right">-1 200 k€</td>
                            </tr>
                            <tr>
                                <td><strong>= Marge brute (40%)</strong></td>
                                <td className="text-right"><strong>800 k€</strong></td>
                            </tr>
                            <tr>
                                <td>- Salaires et charges sociales</td>
                                <td className="text-right">-400 k€</td>
                            </tr>
                            <tr>
                                <td>- Loyers et charges</td>
                                <td className="text-right">-80 k€</td>
                            </tr>
                            <tr>
                                <td>- Marketing et publicité</td>
                                <td className="text-right">-150 k€</td>
                            </tr>
                            <tr>
                                <td>- Autres charges d'exploitation</td>
                                <td className="text-right">-70 k€</td>
                            </tr>
                            <tr>
                                <td><strong>= Résultat d'exploitation</strong></td>
                                <td className="text-right"><strong>100 k€</strong></td>
                            </tr>
                            <tr>
                                <td>- Intérêts d'emprunt</td>
                                <td className="text-right">-20 k€</td>
                            </tr>
                            <tr>
                                <td>+/- Résultat exceptionnel</td>
                                <td className="text-right">0 k€</td>
                            </tr>
                            <tr>
                                <td>- Impôt sur les sociétés (25%)</td>
                                <td className="text-right">-20 k€</td>
                            </tr>
                            <tr>
                                <td><strong>= RÉSULTAT NET</strong></td>
                                <td className="text-right"><strong>60 k€</strong></td>
                            </tr>
                        </tbody>
                    </table>

                    <p className="result">
                        <strong>Marge nette = 60 k€ / 2 000 k€ = 3%</strong>
                    </p>
                </div>

                <h3>Les 3 types de résultats</h3>

                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>Type de résultat</th>
                            <th>Ce qu'il mesure</th>
                            <th>Pourquoi c'est important</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Résultat d'exploitation</strong></td>
                            <td>Rentabilité de votre activité principale</td>
                            <td>Indicateur de performance opérationnelle (hors finance)</td>
                        </tr>
                        <tr>
                            <td><strong>Résultat financier</strong></td>
                            <td>Coût de l'endettement</td>
                            <td>Impact des intérêts d'emprunt</td>
                        </tr>
                        <tr>
                            <td><strong>Résultat exceptionnel</strong></td>
                            <td>Événements rares (vente actif, litige...)</td>
                            <td>Ne se reproduit pas (ignorer pour tendance)</td>
                        </tr>
                    </tbody>
                </table>

                <h2>⚠️ PIÈGE MORTEL : Résultat ≠ Trésorerie</h2>

                <div className="warning-box">
                    <strong>🚨 L'erreur que font 60% des dirigeants :</strong>
                    <p>
                        <strong>"J'ai 100 k€ de résultat net, donc j'ai 100 k€ en banque"</strong>
                        <br /><br />
                        <strong>FAUX !</strong> Le résultat est comptable, pas du cash réel.
                    </p>

                    <p><strong>Pourquoi résultat ≠ trésorerie ?</strong></p>
                    <ol>
                        <li><strong>Décalages de paiement</strong> : Vous avez facturé 100 k€, mais les clients n'ont pas encore payé</li>
                        <li><strong>Investissements</strong> : Vous avez acheté une machine 50 k€ (pas dans le résultat, mais sorti du compte)</li>
                        <li><strong>Remboursements d'emprunt</strong> : Vous remboursez 30 k€ de crédit (pas une charge, mais du cash qui sort)</li>
                        <li><strong>Stocks</strong> : Vous avez acheté 80 k€ de marchandises pas encore vendues (cash sorti, pas dans le résultat)</li>
                    </ol>

                    <p className="example">
                        <strong>Exemple concret :</strong>
                        <ul>
                            <li>Résultat net : 100 k€</li>
                            <li>Créances clients non encaissées : -80 k€</li>
                            <li>Investissements machines : -50 k€</li>
                            <li>Remboursement emprunt : -30 k€</li>
                            <li>Augmentation stocks : -40 k€</li>
                        </ul>
                        <p className="result">
                            <strong>Trésorerie réelle = 100 k€ - 80 k€ - 50 k€ - 30 k€ - 40 k€ = -100 k€</strong>
                            <br />
                            🚨 L'entreprise est rentable (+100k€) mais en difficulté de trésorerie (-100k€) !
                        </p>
                    </p>
                </div>

                <h2>Les 7 signaux d'alerte à repérer immédiatement</h2>

                <h3>1. Capitaux propres négatifs</h3>
                <div className="warning-box">
                    <p><strong>🚨 Situation de faillite juridique</strong></p>
                    <p>
                        Si vos capitaux propres sont négatifs, cela signifie que vos dettes sont supérieures 
                        à vos actifs. Juridiquement, c'est une situation de "fonds propres insuffisants" 
                        qui peut entraîner une dissolution de la société.
                    </p>
                    <p><strong>Action :</strong> Augmentation de capital urgente ou restructuration</p>
                </div>

                <h3>2. Trésorerie &lt; 1 mois de charges</h3>
                <div className="warning-box">
                    <p><strong>🚨 Risque d'asphyxie immédiate</strong></p>
                    <p>
                        Avec moins d'un mois de trésorerie, un simple retard de paiement d'un gros client 
                        peut vous mettre en difficulté pour payer les salaires.
                    </p>
                    <p><strong>Action :</strong> Relance clients agressive, négociation délais fournisseurs, crédit court terme</p>
                </div>

                <h3>3. Créances clients &gt; Dettes fournisseurs</h3>
                <div className="warning-box">
                    <p><strong>⚠️ BFR qui explose</strong></p>
                    <p>
                        Vous financez vos clients alors qu'ils devraient vous payer avant que vous ne payiez vos fournisseurs. 
                        Votre cash est bloqué.
                    </p>
                    <p><strong>Action :</strong> Réduire DSO (délai clients), négocier délais fournisseurs plus longs</p>
                </div>

                <h3>4. Résultat négatif 2 années consécutives</h3>
                <div className="warning-box">
                    <p><strong>🚨 Modèle économique non viable</strong></p>
                    <p>
                        Un résultat négatif ponctuel peut s'expliquer (investissements, crise...). 
                        Deux années consécutives = problème structurel de rentabilité.
                    </p>
                    <p><strong>Action :</strong> Revoir tarifs, réduire coûts, pivoter modèle économique</p>
                </div>

                <h3>5. Dettes bancaires &gt; 2× Capitaux propres</h3>
                <div className="warning-box">
                    <p><strong>⚠️ Surendettement</strong></p>
                    <p>
                        Ratio d'endettement supérieur à 2 = banque considère que vous êtes trop endetté 
                        pour emprunter davantage.
                    </p>
                    <p><strong>Action :</strong> Rembourser rapidement, augmenter capitaux propres, éviter nouveaux emprunts</p>
                </div>

                <h3>6. Stocks qui augmentent plus vite que le CA</h3>
                <div className="warning-box">
                    <p><strong>⚠️ Surstockage ou invendus</strong></p>
                    <p>
                        CA +10%, stocks +40% = vous achetez trop ou vous ne vendez pas assez. 
                        Cash immobilisé + risque d'obsolescence.
                    </p>
                    <p><strong>Action :</strong> Promotions, déstockage, réduire commandes fournisseurs</p>
                </div>

                <h3>7. Charges financières &gt; 5% du CA</h3>
                <div className="warning-box">
                    <p><strong>⚠️ Endettement trop coûteux</strong></p>
                    <p>
                        Si vos intérêts d'emprunt représentent plus de 5% de votre CA, c'est que vous payez 
                        trop cher votre dette. Votre rentabilité est plombée par le coût du financement.
                    </p>
                    <p><strong>Action :</strong> Renégocier taux, racheter crédits coûteux, désendetter</p>
                </div>

                <h2>Les 3 ratios de base à calculer en 2 minutes</h2>

                <h3>1. Ratio de liquidité générale</h3>
                <div className="formula-box">
                    <code>Liquidité générale = Actif circulant / Dettes court terme</code>
                </div>
                <ul>
                    <li><strong>&lt; 1</strong> : 🚨 Vous ne pouvez pas payer vos dettes court terme</li>
                    <li><strong>1 - 1,5</strong> : ⚠️ Juste suffisant</li>
                    <li><strong>&gt; 1,5</strong> : ✅ Bonne capacité de paiement</li>
                </ul>

                <h3>2. Ratio d'endettement</h3>
                <div className="formula-box">
                    <code>Endettement = Dettes totales / Capitaux propres</code>
                </div>
                <ul>
                    <li><strong>&lt; 1</strong> : ✅ Faible endettement</li>
                    <li><strong>1 - 2</strong> : ✅ Endettement raisonnable</li>
                    <li><strong>&gt; 2</strong> : 🚨 Surendettement</li>
                </ul>

                <h3>3. Ratio d'autonomie financière</h3>
                <div className="formula-box">
                    <code>Autonomie = Capitaux propres / Total passif × 100</code>
                </div>
                <ul>
                    <li><strong>&lt; 20%</strong> : 🚨 Sous-capitalisation dangereuse</li>
                    <li><strong>20-40%</strong> : ⚠️ Autonomie moyenne</li>
                    <li><strong>&gt; 40%</strong> : ✅ Bonne autonomie financière</li>
                </ul>

                <h2>Cas pratique : décrypter un vrai bilan</h2>

                <p>Analysons ensemble le bilan d'une PME e-commerce :</p>

                <div className="example-box">
                    <p><strong>📊 Bilan simplifié - PME E-commerce "ShopTech"</strong></p>

                    <table className="benchmark-table">
                        <thead>
                            <tr>
                                <th colSpan={2}><strong>ACTIF</strong></th>
                                <th colSpan={2}><strong>PASSIF</strong></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={2}><strong>Actif immobilisé</strong></td>
                                <td colSpan={2}><strong>Capitaux propres</strong></td>
                            </tr>
                            <tr>
                                <td>Matériel informatique</td>
                                <td className="text-right">50 k€</td>
                                <td>Capital social</td>
                                <td className="text-right">50 k€</td>
                            </tr>
                            <tr>
                                <td>Aménagements</td>
                                <td className="text-right">30 k€</td>
                                <td>Réserves</td>
                                <td className="text-right">80 k€</td>
                            </tr>
                            <tr>
                                <td><strong>Sous-total</strong></td>
                                <td className="text-right"><strong>80 k€</strong></td>
                                <td>Résultat de l'année</td>
                                <td className="text-right">-20 k€</td>
                            </tr>
                            <tr>
                                <td colSpan={2}></td>
                                <td><strong>Sous-total</strong></td>
                                <td className="text-right"><strong>110 k€</strong></td>
                            </tr>
                            <tr>
                                <td colSpan={2}><strong>Actif circulant</strong></td>
                                <td colSpan={2}><strong>Dettes</strong></td>
                            </tr>
                            <tr>
                                <td>Stocks</td>
                                <td className="text-right">250 k€</td>
                                <td>Emprunt bancaire</td>
                                <td className="text-right">180 k€</td>
                            </tr>
                            <tr>
                                <td>Créances clients</td>
                                <td className="text-right">180 k€</td>
                                <td>Dettes fournisseurs</td>
                                <td className="text-right">120 k€</td>
                            </tr>
                            <tr>
                                <td>Trésorerie</td>
                                <td className="text-right">40 k€</td>
                                <td>Charges sociales</td>
                                <td className="text-right">60 k€</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>Autres dettes CT</td>
                                <td className="text-right">80 k€</td>
                            </tr>
                            <tr>
                                <td><strong>Sous-total</strong></td>
                                <td className="text-right"><strong>470 k€</strong></td>
                                <td><strong>Sous-total</strong></td>
                                <td className="text-right"><strong>440 k€</strong></td>
                            </tr>
                            <tr>
                                <td><strong>TOTAL ACTIF</strong></td>
                                <td className="text-right"><strong>550 k€</strong></td>
                                <td><strong>TOTAL PASSIF</strong></td>
                                <td className="text-right"><strong>550 k€</strong></td>
                            </tr>
                        </tbody>
                    </table>

                    <p><strong>📈 Analyse détaillée :</strong></p>

                    <div className="warning-box">
                        <p><strong>🚨 Signaux d'alerte détectés :</strong></p>
                        <ol>
                            <li>
                                <strong>Résultat négatif -20 k€</strong>
                                <p>L'entreprise perd de l'argent. Si c'est la 2e année consécutive → problème grave</p>
                            </li>
                            <li>
                                <strong>Trésorerie 40 k€</strong>
                                <p>Si charges mensuelles = 50 k€ → moins d'1 mois de survie 🚨</p>
                            </li>
                            <li>
                                <strong>Créances 180 k€ &gt; Dettes fournisseurs 120 k€</strong>
                                <p>BFR positif de 60 k€ (180 - 120) = cash bloqué chez les clients</p>
                            </li>
                            <li>
                                <strong>Stocks 250 k€</strong>
                                <p>Si CA annuel = 1,2 M€ → stocks = 3 mois de ventes. Beaucoup trop élevé (normal = 1-1,5 mois)</p>
                            </li>
                            <li>
                                <strong>Ratio d'endettement = 440 k€ / 110 k€ = 4</strong>
                                <p>🚨 Surendettement critique (dettes = 4× capitaux propres)</p>
                            </li>
                            <li>
                                <strong>Autonomie financière = 110 / 550 = 20%</strong>
                                <p>⚠️ Juste à la limite acceptable (minimum 20%)</p>
                            </li>
                        </ol>

                        <p className="result">
                            <strong>Diagnostic : Entreprise en grande difficulté</strong>
                            <br />
                            Actions urgentes : réduire stocks (promotions), accélérer recouvrement clients, 
                            négocier étalement dettes, augmentation de capital ou restructuration.
                        </p>
                    </div>
                </div>

                <h2>Les questions à poser à votre expert-comptable</h2>

                <p>Ne restez pas dans le flou. Voici les questions essentielles à poser lors de la remise du bilan :</p>

                <div className="kpi-box">
                    <h3><strong>Questions sur le bilan :</strong></h3>
                    <ol>
                        <li>
                            <strong>"Pourquoi mes capitaux propres ont diminué/augmenté ?"</strong>
                            <p>Comprendre si c'est dû au résultat, à des retraits, ou à une augmentation de capital</p>
                        </li>
                        <li>
                            <strong>"Mon niveau de trésorerie est-il suffisant pour mon activité ?"</strong>
                            <p>Comparer aux charges mensuelles (objectif : 2-3 mois minimum)</p>
                        </li>
                        <li>
                            <strong>"Est-ce que mon ratio d'endettement est normal pour mon secteur ?"</strong>
                            <p>Benchmarker vs secteur d'activité</p>
                        </li>
                        <li>
                            <strong>"Pourquoi mes créances clients ont augmenté ?"</strong>
                            <p>Identifier si c'est dû à la croissance ou à un problème de recouvrement</p>
                        </li>
                        <li>
                            <strong>"Mes stocks sont-ils normaux ou trop élevés ?"</strong>
                            <p>Calculer la rotation des stocks (objectif : 8-12 rotations/an selon secteur)</p>
                        </li>
                    </ol>

                    <h3><strong>Questions sur le compte de résultat :</strong></h3>
                    <ol>
                        <li>
                            <strong>"Quelle est ma marge brute et est-elle en ligne avec mon secteur ?"</strong>
                            <p>Benchmarker pour identifier si le problème vient des achats ou des prix de vente</p>
                        </li>
                        <li>
                            <strong>"Pourquoi j'ai un résultat positif mais pas de trésorerie ?"</strong>
                            <p>Comprendre les décalages (BFR, investissements, remboursements)</p>
                        </li>
                        <li>
                            <strong>"Quelles sont mes charges qui ont le plus augmenté ?"</strong>
                            <p>Identifier les dérives de coûts (salaires, marketing, loyers...)</p>
                        </li>
                        <li>
                            <strong>"Mon résultat exceptionnel vient de quoi ?"</strong>
                            <p>Vérifier que ce n'est pas artificiel (cession d'actif, abandon de créance...)</p>
                        </li>
                    </ol>
                </div>

                <h2>Automatisez la lecture de vos états financiers</h2>

                <p>
                    Lire manuellement un bilan prend du temps et vous risquez de passer à côté de signaux d'alerte. 
                    <strong>TRESORIS</strong> analyse automatiquement vos états financiers et vous alerte en temps réel.
                </p>

                <BlogCTA variant="platform" />

                <h2>Conclusion : de l'illisible à l'actionnable</h2>

                <p>
                    Vous savez maintenant lire un bilan et un compte de résultat. Plus important encore, 
                    vous savez repérer les signaux d'alerte et poser les bonnes questions à votre comptable.
                </p>

                <div className="info-box">
                    <p><strong>🎯 Les 5 points clés à retenir :</strong></p>
                    <ol>
                        <li><strong>Bilan = photo</strong> (ce que vous possédez vs comment c'est financé)</li>
                        <li><strong>Compte de résultat = film</strong> (du CA au résultat net)</li>
                        <li><strong>Résultat ≠ Trésorerie</strong> (piège mortel à éviter)</li>
                        <li><strong>7 signaux d'alerte</strong> à surveiller (capitaux propres négatifs, trésorerie faible...)</li>
                        <li><strong>3 ratios essentiels</strong> : liquidité, endettement, autonomie</li>
                    </ol>
                </div>

                <p>
                    Ne laissez plus votre expert-comptable être le seul à comprendre vos chiffres. 
                    Reprenez le contrôle de vos finances en comprenant ce qui compte vraiment.
                </p>
            </>
        )
    },
    'eva-roic-illusion-performance': {
        slug: 'eva-roic-illusion-performance',
        title: 'Pourquoi une entreprise rentable peut détruire de la valeur',
        description: 'EVA, ROIC et WACC : découvrez pourquoi la rentabilité comptable ne suffit pas et comment mesurer la création de valeur réelle',
        date: '25 janvier 2026',
        readTime: '14 min',
        category: 'Analyse',
        image: '/images/bureau.png',
        content: (
            <>
                <p className="lead">
                    Vous avez une marge nette positive, un résultat en croissance, des investisseurs satisfaits... 
                    et pourtant, vous détruisez peut-être de la valeur. Découvrez l'EVA et le ROIC, les indicateurs 
                    qui révèlent la <strong>création de valeur réelle</strong> au-delà des illusions comptables.
                </p>

                <h2>Le paradoxe de la rentabilité comptable</h2>
                <p>
                    Imaginez deux entreprises de e-commerce :
                </p>

                <div className="example-box">
                    <p><strong>Entreprise A :</strong></p>
                    <ul>
                        <li>CA : 5 M€</li>
                        <li>Résultat net : 500 k€ (marge nette 10%)</li>
                        <li>Capitaux investis : 2 M€</li>
                        <li>Coût du capital : 8%</li>
                    </ul>

                    <p><strong>Entreprise B :</strong></p>
                    <ul>
                        <li>CA : 3 M€</li>
                        <li>Résultat net : 300 k€ (marge nette 10%)</li>
                        <li>Capitaux investis : 1 M€</li>
                        <li>Coût du capital : 8%</li>
                    </ul>

                    <p className="warning">
                        <strong>Question :</strong> Laquelle crée le plus de valeur ?
                    </p>
                </div>

                <p>
                    À première vue, l'entreprise A semble meilleure (500k€ vs 300k€ de profit). 
                    Mais en réalité, <strong>seule l'entreprise B crée de la valeur</strong>. Pourquoi ? 
                    Parce que le profit comptable ne tient pas compte du <strong>coût d'opportunité du capital</strong>.
                </p>

                <h2>Qu'est-ce que l'EVA (Economic Value Added) ?</h2>
                <p>
                    L'<strong>EVA</strong> (Economic Value Added), ou Valeur Économique Ajoutée, mesure le profit 
                    économique réel après déduction du coût du capital investi. C'est l'indicateur développé par 
                    Stern Stewart & Co. dans les années 90.
                </p>

                <div className="formula-box">
                    <code>EVA = NOPAT - (Capital investi × WACC)</code>
                    <br /><br />
                    <p><strong>Où :</strong></p>
                    <ul>
                        <li><strong>NOPAT</strong> = Net Operating Profit After Tax (résultat opérationnel après impôt)</li>
                        <li><strong>Capital investi</strong> = Actif économique (immobilisations + BFR)</li>
                        <li><strong>WACC</strong> = Weighted Average Cost of Capital (coût moyen pondéré du capital)</li>
                    </ul>
                </div>

                <div className="info-box">
                    <strong>💡 En français simple</strong>
                    <p>
                        L'EVA répond à la question : <strong>"Combien ai-je gagné au-delà du coût de financement ?"</strong>
                        <br /><br />
                        Si vous empruntez à 5% et investissez dans un projet qui rapporte 7%, vous créez 2% de valeur. 
                        Si le projet rapporte 3%, vous détruisez 2% de valeur, même si vous êtes "rentable" comptablement.
                    </p>
                </div>

                <h2>Reprenons notre exemple</h2>

                <div className="example-box">
                    <p><strong>Entreprise A :</strong></p>
                    <ul>
                        <li>NOPAT : 500 k€</li>
                        <li>Capital investi : 2 M€</li>
                        <li>WACC : 8%</li>
                        <li>Charge de capital : 2 M€ × 8% = <strong>160 k€</strong></li>
                    </ul>
                    <code className="result">EVA = 500 k€ - 160 k€ = <strong>+340 k€</strong></code>

                    <p><strong>Entreprise B :</strong></p>
                    <ul>
                        <li>NOPAT : 300 k€</li>
                        <li>Capital investi : 1 M€</li>
                        <li>WACC : 8%</li>
                        <li>Charge de capital : 1 M€ × 8% = <strong>80 k€</strong></li>
                    </ul>
                    <code className="result">EVA = 300 k€ - 80 k€ = <strong>+220 k€</strong></code>

                    <p className="result">
                        <strong>✅ Verdict :</strong> Entreprise A crée plus de valeur (+340k€ vs +220k€)
                    </p>
                </div>

                <p>
                    Mais attention : si l'entreprise A avait investi 7 M€ pour générer 500 k€ de NOPAT :
                </p>

                <div className="warning-box">
                    <p><strong>EVA = 500 k€ - (7 M€ × 8%) = 500 k€ - 560 k€ = <span className="text-red-600">-60 k€</span></strong></p>
                    <p>
                        🚨 L'entreprise est comptablement rentable (+500k€), mais économiquement 
                        elle <strong>détruit 60 k€ de valeur</strong> car elle mobilise trop de capital 
                        pour un rendement trop faible.
                    </p>
                </div>

                <h2>Le ROIC : mesurer l'efficacité du capital</h2>
                <p>
                    Le <strong>ROIC</strong> (Return On Invested Capital) mesure la rentabilité économique 
                    du capital investi. C'est le pendant "ratio" de l'EVA.
                </p>

                <div className="formula-box">
                    <code>ROIC = NOPAT / Capital investi × 100</code>
                </div>

                <p><strong>Règle de création de valeur :</strong></p>

                <div className="info-box">
                    <ul>
                        <li><strong>ROIC &gt; WACC</strong> → ✅ Création de valeur</li>
                        <li><strong>ROIC = WACC</strong> → ⚖️ Équilibre (pas de création, pas de destruction)</li>
                        <li><strong>ROIC &lt; WACC</strong> → 🚨 Destruction de valeur</li>
                    </ul>
                </div>

                <h2>Exemple pratique : Scale-up SaaS B2B</h2>

                <div className="example-box">
                    <p><strong>Situation :</strong></p>
                    <ul>
                        <li>CA annuel : 2,5 M€</li>
                        <li>EBITDA : 600 k€</li>
                        <li>Résultat opérationnel (EBIT) : 500 k€</li>
                        <li>Impôt (25%) : 125 k€</li>
                        <li><strong>NOPAT = 500 k€ - 125 k€ = 375 k€</strong></li>
                    </ul>

                    <p><strong>Capitaux investis :</strong></p>
                    <ul>
                        <li>Immobilisations nettes : 200 k€</li>
                        <li>BFR (créances - dettes) : 150 k€</li>
                        <li><strong>Capital investi = 350 k€</strong></li>
                    </ul>

                    <p><strong>Calcul ROIC :</strong></p>
                    <code>ROIC = 375 k€ / 350 k€ = 107%</code>

                    <p><strong>WACC estimé pour une scale-up SaaS :</strong></p>
                    <ul>
                        <li>Coût de la dette : 5% (emprunt BPI)</li>
                        <li>Coût des fonds propres : 15% (attente investisseurs)</li>
                        <li>Structure : 30% dette / 70% equity</li>
                        <li><strong>WACC = (30% × 5%) + (70% × 15%) = 12%</strong></li>
                    </ul>

                    <p className="result">
                        <strong>✅ ROIC (107%) &gt;&gt; WACC (12%)</strong>
                        <br />
                        Cette entreprise crée massivement de la valeur. Elle devrait lever des fonds 
                        pour accélérer sa croissance.
                    </p>

                    <p><strong>EVA :</strong></p>
                    <code>EVA = 375 k€ - (350 k€ × 12%) = 375 k€ - 42 k€ = <strong>+333 k€</strong></code>
                </div>

                <h2>Cas d'école : la destruction de valeur invisible</h2>
                <p>
                    Prenons maintenant une PME industrielle rentable qui détruit de la valeur :
                </p>

                <div className="warning-box">
                    <p><strong>PME Industrie :</strong></p>
                    <ul>
                        <li>CA : 8 M€</li>
                        <li>Marge nette : 6% (480 k€)</li>
                        <li>Capitaux propres : 3 M€</li>
                        <li>Dettes : 2 M€</li>
                        <li><strong>Capital total : 5 M€</strong></li>
                        <li>NOPAT : 500 k€</li>
                    </ul>

                    <p><strong>WACC :</strong></p>
                    <ul>
                        <li>Coût dette : 4%</li>
                        <li>Coût fonds propres : 10%</li>
                        <li>WACC = (40% × 4%) + (60% × 10%) = 7,6%</li>
                    </ul>

                    <p><strong>Calcul :</strong></p>
                    <code>ROIC = 500 k€ / 5 M€ = 10%</code>
                    <br />
                    <code>EVA = 500 k€ - (5 M€ × 7,6%) = 500 k€ - 380 k€ = <strong>+120 k€</strong></code>

                    <p className="result">
                        <strong>✅ Création de valeur modeste (+120k€)</strong>
                    </p>

                    <p><strong>Mais... si l'entreprise investit 3 M€ dans une nouvelle usine :</strong></p>
                    <ul>
                        <li>Nouveau capital investi : 8 M€</li>
                        <li>NOPAT projeté : 650 k€ (+30%)</li>
                    </ul>

                    <code>Nouveau ROIC = 650 k€ / 8 M€ = 8,1%</code>
                    <br />
                    <code>Nouvelle EVA = 650 k€ - (8 M€ × 7,6%) = 650 k€ - 608 k€ = <strong>+42 k€</strong></code>

                    <p className="warning">
                        🚨 <strong>Alerte destruction de valeur !</strong>
                        <br />
                        L'investissement de 3 M€ fait passer l'EVA de +120 k€ à +42 k€. 
                        La rentabilité comptable augmente (+170k€), mais la valeur créée <strong>diminue de 78 k€</strong>.
                        <br /><br />
                        <strong>Décision :</strong> Cet investissement devrait être refusé ou repensé.
                    </p>
                </div>

                <h2>Comment calculer le WACC simplement ?</h2>
                <p>
                    Le <strong>WACC</strong> (Weighted Average Cost of Capital) est le coût moyen pondéré 
                    de l'ensemble de vos sources de financement.
                </p>

                <div className="formula-box">
                    <code>WACC = (% Dette × Coût dette × (1 - Taux IS)) + (% Equity × Coût equity)</code>
                </div>

                <p><strong>Détail des composants :</strong></p>

                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>Composant</th>
                            <th>Comment le trouver ?</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>% Dette</strong></td>
                            <td>Dette financière / (Dette + Capitaux propres)</td>
                        </tr>
                        <tr>
                            <td><strong>Coût dette</strong></td>
                            <td>Taux d'intérêt moyen de vos emprunts (ex: 4%)</td>
                        </tr>
                        <tr>
                            <td><strong>Taux IS</strong></td>
                            <td>Impôt sur les sociétés en France : 25%</td>
                        </tr>
                        <tr>
                            <td><strong>% Equity</strong></td>
                            <td>Capitaux propres / (Dette + Capitaux propres)</td>
                        </tr>
                        <tr>
                            <td><strong>Coût equity</strong></td>
                            <td>Rentabilité attendue par actionnaires (8-15% PME, 15-25% startup)</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Exemple de calcul WACC pour une PME</h3>

                <div className="example-box">
                    <p><strong>Structure financière :</strong></p>
                    <ul>
                        <li>Dette bancaire : 1 M€ à 4,5%</li>
                        <li>Capitaux propres : 2 M€</li>
                        <li>Rentabilité attendue actionnaires : 12%</li>
                    </ul>

                    <p><strong>Calcul :</strong></p>
                    <ul>
                        <li>% Dette = 1 M€ / 3 M€ = 33%</li>
                        <li>% Equity = 2 M€ / 3 M€ = 67%</li>
                        <li>Coût dette après IS = 4,5% × (1 - 25%) = 3,375%</li>
                    </ul>

                    <code>WACC = (33% × 3,375%) + (67% × 12%) = 1,11% + 8,04% = <strong>9,15%</strong></code>

                    <p className="result">
                        Pour créer de la valeur, cette PME doit générer un ROIC &gt; 9,15%
                    </p>
                </div>

                <h2>Benchmarks ROIC par secteur</h2>
                <p>Voici les ROIC moyens observés en France (2025) :</p>

                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>Secteur</th>
                            <th>ROIC Faible</th>
                            <th>ROIC Moyen</th>
                            <th>ROIC Excellent</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>SaaS B2B</td>
                            <td>&lt; 20%</td>
                            <td>20-50%</td>
                            <td>&gt; 50%</td>
                        </tr>
                        <tr>
                            <td>E-commerce</td>
                            <td>&lt; 15%</td>
                            <td>15-30%</td>
                            <td>&gt; 30%</td>
                        </tr>
                        <tr>
                            <td>Services B2B</td>
                            <td>&lt; 12%</td>
                            <td>12-25%</td>
                            <td>&gt; 25%</td>
                        </tr>
                        <tr>
                            <td>Industrie</td>
                            <td>&lt; 8%</td>
                            <td>8-15%</td>
                            <td>&gt; 15%</td>
                        </tr>
                        <tr>
                            <td>Commerce retail</td>
                            <td>&lt; 10%</td>
                            <td>10-20%</td>
                            <td>&gt; 20%</td>
                        </tr>
                        <tr>
                            <td>BTP</td>
                            <td>&lt; 8%</td>
                            <td>8-12%</td>
                            <td>&gt; 12%</td>
                        </tr>
                    </tbody>
                </table>

                <h2>Les 5 leviers pour améliorer votre ROIC</h2>

                <p>Le ROIC se décompose en deux facteurs clés :</p>

                <div className="formula-box">
                    <code>ROIC = (NOPAT / CA) × (CA / Capital investi)</code>
                    <br /><br />
                    <p>= <strong>Marge opérationnelle</strong> × <strong>Rotation du capital</strong></p>
                </div>

                <h3>Levier 1 : Augmenter la marge opérationnelle</h3>
                <ul>
                    <li>✅ Optimiser la structure de coûts (automatisation, outsourcing)</li>
                    <li>✅ Augmenter les prix (repositionnement premium, valeur perçue)</li>
                    <li>✅ Améliorer le mix produit (pousser les offres à forte marge)</li>
                    <li>✅ Négocier avec les fournisseurs (volumes, délais)</li>
                </ul>

                <h3>Levier 2 : Accélérer la rotation du capital</h3>
                <ul>
                    <li>✅ Réduire le BFR (DSO, stocks, délais fournisseurs)</li>
                    <li>✅ Optimiser l'utilisation des actifs (taux de remplissage, capacité)</li>
                    <li>✅ Externaliser les actifs lourds (leasing vs achat)</li>
                </ul>

                <h3>Levier 3 : Arbitrer les investissements</h3>
                <ul>
                    <li>✅ Calculer le ROIC prévisionnel de chaque projet</li>
                    <li>✅ Prioriser les projets avec ROIC &gt; WACC + marge de sécurité</li>
                    <li>✅ Désinvestir des actifs à faible ROIC</li>
                </ul>

                <h3>Levier 4 : Optimiser la structure financière</h3>
                <ul>
                    <li>✅ Endettement optimal : utiliser la dette (moins chère) si ROIC &gt; coût dette</li>
                    <li>✅ Lever des fonds si ROIC &gt;&gt; coût equity (forte création de valeur)</li>
                    <li>✅ Renégocier le coût de la dette (taux, garanties)</li>
                </ul>

                <h3>Levier 5 : Piloter avec MARGIS</h3>
                <p>
                    L'agent IA <strong>MARGIS</strong> calcule automatiquement votre ROIC par produit, 
                    client, et segment d'activité. Il identifie où vous créez vraiment de la valeur.
                </p>

                <div className="info-box">
                    <strong>💡 Exemple MARGIS</strong>
                    <p>
                        Une PME industrielle découvre grâce à MARGIS que :
                    </p>
                    <ul>
                        <li>Produit A : ROIC 25% → ✅ À développer</li>
                        <li>Produit B : ROIC 8% (WACC 10%) → 🚨 Destructeur de valeur</li>
                        <li>Client X : ROIC 30% → ✅ Client stratégique</li>
                        <li>Client Y : ROIC 5% (WACC 10%) → 🚨 Renégocier ou abandonner</li>
                    </ul>
                    <p>
                        <strong>Décision :</strong> Arrêter le Produit B, refuser Client Y, doubler la production de A.
                    </p>
                </div>

                <h2>EVA vs ROE vs ROA : quelles différences ?</h2>

                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>Indicateur</th>
                            <th>Formule</th>
                            <th>Ce qu'il mesure</th>
                            <th>Limite</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>ROE</strong></td>
                            <td>Résultat net / Capitaux propres</td>
                            <td>Rentabilité pour actionnaires</td>
                            <td>Ignore le coût des fonds propres</td>
                        </tr>
                        <tr>
                            <td><strong>ROA</strong></td>
                            <td>Résultat net / Total actif</td>
                            <td>Rentabilité globale des actifs</td>
                            <td>Ignore la structure financière</td>
                        </tr>
                        <tr>
                            <td><strong>ROIC</strong></td>
                            <td>NOPAT / Capital investi</td>
                            <td>Rentabilité économique opérationnelle</td>
                            <td>Ne donne pas la valeur absolue créée</td>
                        </tr>
                        <tr>
                            <td><strong>EVA</strong></td>
                            <td>NOPAT - (Capital × WACC)</td>
                            <td>Valeur économique créée (€)</td>
                            <td>Calcul WACC parfois complexe</td>
                        </tr>
                    </tbody>
                </table>

                <div className="info-box">
                    <strong>💡 Quel indicateur utiliser ?</strong>
                    <ul>
                        <li><strong>ROE</strong> : Pour comparer la rentabilité actionnaires entre entreprises</li>
                        <li><strong>ROIC</strong> : Pour mesurer l'efficacité opérationnelle (indépendant de la structure financière)</li>
                        <li><strong>EVA</strong> : Pour piloter la création de valeur et arbitrer les investissements</li>
                    </ul>
                </div>

                <h2>Cas réel : pourquoi WeWork a détruit de la valeur</h2>

                <div className="warning-box">
                    <p><strong>WeWork (2019) :</strong></p>
                    <ul>
                        <li>Valorisation visée IPO : 47 Md$</li>
                        <li>CA : 1,8 Md$</li>
                        <li>Pertes : -1,9 Md$</li>
                        <li>Capital investi : &gt; 12 Md$ (levées + dette)</li>
                    </ul>

                    <p><strong>Calcul EVA simplifié :</strong></p>
                    <ul>
                        <li>NOPAT : -1,9 Md$ (perte opérationnelle)</li>
                        <li>Charge de capital : 12 Md$ × 15% = 1,8 Md$</li>
                    </ul>

                    <code>EVA = -1,9 Md$ - 1,8 Md$ = <strong className="text-red-600">-3,7 Md$ de destruction de valeur annuelle</strong></code>

                    <p className="warning">
                        🚨 WeWork avait une <strong>croissance forte</strong> (+100%/an), un <strong>CA massif</strong> (1,8Md$), 
                        une <strong>valorisation élevée</strong> (47Md$)... mais détruisait massivement de la valeur 
                        car le ROIC était négatif et très inférieur au coût du capital.
                        <br /><br />
                        <strong>Leçon :</strong> Croissance ≠ Création de valeur
                    </p>
                </div>

                <h2>Comment piloter avec EVA et ROIC au quotidien ?</h2>

                <h3>Tableau de bord recommandé</h3>

                <div className="kpi-box">
                    <p><strong>KPIs à suivre mensuellement :</strong></p>
                    <ol>
                        <li>
                            <strong>ROIC global</strong>
                            <p>Objectif : &gt; WACC + 5 points (marge de sécurité)</p>
                        </li>
                        <li>
                            <strong>ROIC par segment</strong>
                            <p>Identifier les activités créatrices vs destructrices de valeur</p>
                        </li>
                        <li>
                            <strong>EVA mensuelle</strong>
                            <p>Tendance : croissante ou décroissante ?</p>
                        </li>
                        <li>
                            <strong>WACC</strong>
                            <p>Recalculer tous les 6 mois (évolution taux, structure financière)</p>
                        </li>
                        <li>
                            <strong>Rotation du capital</strong>
                            <p>CA / Capital investi (objectif : amélioration continue)</p>
                        </li>
                    </ol>
                </div>

                <h3>Intégration dans les décisions stratégiques</h3>

                <table className="benchmark-table">
                    <thead>
                        <tr>
                            <th>Décision</th>
                            <th>Question EVA/ROIC</th>
                            <th>Règle de décision</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Investissement</td>
                            <td>ROIC projet &gt; WACC ?</td>
                            <td>OUI → GO / NON → STOP</td>
                        </tr>
                        <tr>
                            <td>Acquisition</td>
                            <td>ROIC cible + synergies &gt; WACC ?</td>
                            <td>Valoriser selon EVA future</td>
                        </tr>
                        <tr>
                            <td>Nouveau produit</td>
                            <td>Marge × Rotation capital &gt; WACC ?</td>
                            <td>Priorité aux produits à fort ROIC</td>
                        </tr>
                        <tr>
                            <td>Client</td>
                            <td>ROIC client (marge/BFR) &gt; WACC ?</td>
                            <td>Refuser clients destructeurs</td>
                        </tr>
                        <tr>
                            <td>Levée de fonds</td>
                            <td>ROIC actuel &gt;&gt; Coût nouveau capital ?</td>
                            <td>Lever si forte création valeur</td>
                        </tr>
                    </tbody>
                </table>

                <h2>Les 3 erreurs fatales avec EVA/ROIC</h2>

                <h3>Erreur 1 : Confondre rentabilité comptable et création de valeur</h3>
                <div className="warning-box">
                    <p>
                        🚨 <strong>"On a 15% de marge nette, on est super rentables !"</strong>
                        <br /><br />
                        Oui, mais si vous mobilisez 10 M€ de capital pour générer 200 k€ de profit, 
                        votre ROIC est de 2%... très probablement inférieur à votre WACC (8-12%).
                        <br /><br />
                        <strong>✅ Bonne pratique :</strong> Toujours croiser marge nette ET ROIC
                    </p>
                </div>

                <h3>Erreur 2 : Ignorer le coût des fonds propres</h3>
                <div className="warning-box">
                    <p>
                        🚨 <strong>"On n'a pas de dette, donc pas de coût du capital"</strong>
                        <br /><br />
                        FAUX. Les fonds propres ont un coût (coût d'opportunité pour les actionnaires). 
                        Si vous générez 8% de rentabilité alors que vos actionnaires pourraient placer 
                        leur argent à 12% ailleurs, vous détruisez de la valeur.
                        <br /><br />
                        <strong>✅ Bonne pratique :</strong> Estimer le coût des fonds propres (8-15% PME)
                    </p>
                </div>

                <h3>Erreur 3 : Optimiser le ROIC court terme au détriment du long terme</h3>
                <div className="warning-box">
                    <p>
                        🚨 <strong>"On coupe la R&D et le marketing pour améliorer le ROIC"</strong>
                        <br /><br />
                        Attention : réduire les investissements améliore le ROIC court terme, 
                        mais peut détruire la valeur future (perte compétitivité, innovation).
                        <br /><br />
                        <strong>✅ Bonne pratique :</strong> Piloter le ROIC sur un horizon 3-5 ans, pas trimestre par trimestre
                    </p>
                </div>

                <h2>MARGIS & SCENARIS : vos agents IA pour piloter la création de valeur</h2>

                <p>
                    Calculer l'EVA et le ROIC manuellement sur Excel prend du temps et génère des erreurs. 
                    Nos agents IA automatisent ces calculs et vous alertent des actions prioritaires.
                </p>

                <div className="kpi-box">
                    <h3><strong>MARGIS</strong> - Agent de rentabilité réelle</h3>
                    <ul>
                        <li>✅ Calcul automatique du ROIC par produit, client, segment</li>
                        <li>✅ Identification des activités créatrices vs destructrices de valeur</li>
                        <li>✅ Simulation d'impact sur EVA si vous arrêtez une activité</li>
                        <li>✅ Alertes si ROIC &lt; WACC sur un segment</li>
                    </ul>

                    <h3><strong>SCENARIS</strong> - Agent de simulation stratégique</h3>
                    <ul>
                        <li>✅ Simulation ROIC et EVA avant investissement</li>
                        <li>✅ Comparaison de scénarios (investir vs ne rien faire)</li>
                        <li>✅ Analyse de sensibilité (impact variations CA, marge, WACC)</li>
                        <li>✅ Recommandation : GO / NO GO / REVOIR basé sur création de valeur</li>
                    </ul>
                </div>

                <h2>Conclusion : passez de la rentabilité à la création de valeur</h2>

                <p>
                    L'EVA et le ROIC sont les indicateurs qui révèlent la <strong>création de valeur réelle</strong>, 
                    au-delà des illusions de la comptabilité traditionnelle.
                </p>

                <div className="info-box">
                    <p><strong>🎯 Les 3 règles d'or :</strong></p>
                    <ol>
                        <li><strong>ROIC &gt; WACC</strong> → Vous créez de la valeur (continuez !)</li>
                        <li><strong>ROIC &lt; WACC</strong> → Vous détruisez de la valeur (pivotez !)</li>
                        <li><strong>Croissance ≠ Valeur</strong> → Croître en détruisant de la valeur mène à la faillite</li>
                    </ol>
                </div>

                <p>
                    Ne vous contentez plus d'un résultat net positif. Mesurez la valeur économique 
                    réelle que vous créez pour vos actionnaires, vos salariés, et votre entreprise.
                </p>

                <div className="cta-box">
                    <h3>🚀 Calculez votre EVA et ROIC avec MARGIS</h3>
                    <ul>
                        <li>✅ Calcul automatique EVA et ROIC depuis vos exports comptables</li>
                        <li>✅ ROIC par produit, client, segment d'activité</li>
                        <li>✅ Benchmarks sectoriels et alertes si ROIC &lt; WACC</li>
                        <li>✅ Simulation d'impact investissements avec SCENARIS</li>
                        <li>✅ Reporting Excel/PDF pour investisseurs et banquiers</li>
                    </ul>
                    <Link href="/agents" className="cta-button">
                        Découvrir MARGIS & SCENARIS →
                    </Link>
                </div>
            </>
        )
    },
    'calcul-dso-formule-2025': {
        slug: 'calcul-dso-formule-2025',
        title: 'Comment calculer son DSO (formule PCG 2025)',
        description: 'Guide complet pour calculer le DSO avec exemples pratiques et benchmarks sectoriels',
        date: '28 novembre 2025',
        readTime: '8 min',
        category: 'KPIs',
        image: '/images/vue-NY.png',
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

                <BlogCTA variant="consultation" />
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
        image: '/images/bureau.png',
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
                    <Link href="/consulting" className="cta-button">
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
        image: '/images/bfr.png',
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
        image: '/images/marge.png',
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
                    <Link href="/consulting" className="cta-button">
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
        image: '/images/cash-flow-prev.png',
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
                    <Link href="/consulting" className="cta-button">
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

// Merge all articles from different files
const articles: Record<string, BlogArticle> = {
    ...baseArticles,
    ...additionalArticles,
    ...moreArticles,
    ...finalArticles,
    ...seoArticles,
    ...strategicArticles,
    ...caseStudyArticles
}

// Composant Table des Matières
function TableOfContents({ headings }: { headings: string[] }) {
    const [activeId, setActiveId] = useState<string>('')

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: '-100px 0px -70% 0px' }
        )

        headings.forEach((heading) => {
            const id = heading.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
            const element = document.getElementById(id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [headings])

    if (headings.length === 0) return null

    return (
        <nav className="hidden xl:block">
            <div className="sticky top-24">
                <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
                        <BookOpen className="w-4 h-4 text-accent-primary" />
                        Table des matières
                    </h3>
                    <ul className="space-y-2">
                        {headings.map((heading, index) => {
                            const id = heading.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
                            const isActive = activeId === id
                            return (
                                <li key={index}>
                                    <a
                                        href={`#${id}`}
                                        className={`block text-sm py-1.5 px-3 rounded-lg transition-all ${
                                            isActive
                                                ? 'bg-accent-primary/20 text-accent-primary font-medium'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                        }`}
                                    >
                                        {heading}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

// Composant Articles Connexes
function RelatedArticles({ currentSlug, category }: { currentSlug: string; category: string }) {
    const relatedArticles = useMemo(() => {
        return Object.values(articles)
            .filter(a => a.slug !== currentSlug && a.category === category)
            .slice(0, 3)
    }, [currentSlug, category])

    // Si pas assez d'articles dans la même catégorie, ajouter d'autres articles
    const allRelated = useMemo(() => {
        if (relatedArticles.length >= 3) return relatedArticles
        const others = Object.values(articles)
            .filter(a => a.slug !== currentSlug && a.category !== category)
            .slice(0, 3 - relatedArticles.length)
        return [...relatedArticles, ...others]
    }, [relatedArticles, currentSlug, category])

    if (allRelated.length === 0) return null

    return (
        <section className="mt-20 pt-16 border-t border-slate-700/50">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Articles connexes</h2>
                <p className="text-slate-400">Continuez votre lecture</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {allRelated.map((article, index) => {
                    const config = categoryConfig[article.category] || categoryConfig['KPIs']
                    const CategoryIcon = config.icon
                    return (
                        <motion.article
                            key={article.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={`/blog/${article.slug}`}
                                className="group block h-full p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-accent-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-primary/10"
                            >
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} ${config.color} text-xs font-medium mb-4`}>
                                    <CategoryIcon className="w-3.5 h-3.5" />
                                    {article.category}
                                </div>
                                <h3 className="font-bold text-white group-hover:text-accent-primary transition-colors mb-3 line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                                    {article.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {article.readTime}
                                    </span>
                                </div>
                            </Link>
                        </motion.article>
                    )
                })}
            </div>
        </section>
    )
}

// Composant CTA mid-article
function MidArticleCTA() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="not-prose my-12 p-8 rounded-2xl bg-gradient-to-r from-accent-primary/20 via-accent-primary/10 to-transparent border border-accent-primary/30"
        >
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                        🚀 Passez à l'action avec FinSight
                    </h3>
                    <p className="text-slate-300">
                        Importez vos données comptables et obtenez vos KPIs en 30 secondes. 
                        Gratuit, sans inscription.
                    </p>
                </div>
                <Link
                    href="/consulting"
                    onClick={() => trackCTAClick('mid-article-cta', 'blog-article')}
                    className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-slate-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-accent-primary/30"
                >
                    Analyser mes finances
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </motion.div>
    )
}

export function BlogArticlePageClient({ slug }: { slug: string }) {
    const article = articles[slug]
    const startTimeRef = useRef<number>(Date.now())
    const [headings, setHeadings] = useState<string[]>([])

    // Extraire les headings pour la table des matières
    useEffect(() => {
        const timer = setTimeout(() => {
            const articleContent = document.querySelector('.article-content')
            if (articleContent) {
                const h2Elements = articleContent.querySelectorAll('h2')
                const extractedHeadings = Array.from(h2Elements).map((h2, index) => {
                    const text = h2.textContent || `Section ${index + 1}`
                    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
                    h2.id = id
                    return text
                })
                setHeadings(extractedHeadings)
                
                // Injecter le CTA mid-article après le h2 du milieu
                if (h2Elements.length >= 3 && !document.querySelector('#mid-article-cta-inserted')) {
                    const middleIndex = Math.floor(h2Elements.length / 2)
                    const middleH2 = h2Elements[middleIndex]
                    
                    // Trouver le prochain élément après ce h2
                    let nextElement = middleH2.nextElementSibling
                    // Chercher la fin de cette section (avant le prochain h2 ou à la fin)
                    while (nextElement && nextElement.tagName !== 'H2' && nextElement.nextElementSibling) {
                        if (nextElement.nextElementSibling.tagName === 'H2') {
                            break
                        }
                        nextElement = nextElement.nextElementSibling
                    }
                    
                    // Créer le CTA
                    const ctaContainer = document.createElement('div')
                    ctaContainer.id = 'mid-article-cta-inserted'
                    ctaContainer.className = 'not-prose my-12'
                    ctaContainer.innerHTML = `
                        <div style="padding: 2rem; border-radius: 1rem; background: linear-gradient(to right, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1), transparent); border: 1px solid rgba(212, 175, 55, 0.3);">
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
                                <div style="flex: 1;">
                                    <h3 style="font-size: 1.25rem; font-weight: 700; color: white; margin-bottom: 0.5rem;">
                                        🚀 Passez à l'action avec FinSight
                                    </h3>
                                    <p style="color: #cbd5e1;">
                                        Importez vos données comptables et obtenez vos KPIs en 30 secondes. 
                                        Gratuit, sans inscription.
                                    </p>
                                </div>
                                <a 
                                    href="/consulting"
                                    style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: var(--color-accent-primary); color: #0f172a; font-weight: 600; border-radius: 0.75rem; transition: all 0.3s; text-decoration: none;"
                                >
                                    Analyser mes finances
                                    <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    `
                    
                    // Insérer le CTA après l'élément trouvé
                    if (nextElement && nextElement.parentNode) {
                        nextElement.parentNode.insertBefore(ctaContainer, nextElement.nextSibling)
                    }
                }
            }
        }, 100)
        return () => clearTimeout(timer)
    }, [article])

    // Track article view on mount
    useEffect(() => {
        if (article) {
            trackArticleView(article.slug, article.title, article.category)
        }
    }, [article])

    // Track read time on unmount
    useEffect(() => {
        const startTime = startTimeRef.current
        return () => {
            if (article) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000)
                trackArticleReadTime(article.slug, timeSpent)
            }
        }
    }, [article])

    if (!article) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
                <Header />
                <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold mb-4">Article non trouvé</h1>
                        <p className="text-slate-400 mb-8">Cet article n'existe pas ou a été déplacé.</p>
                        <Link 
                            href="/blog" 
                            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary-hover text-slate-900 font-semibold rounded-xl transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour au blog
                        </Link>
                    </motion.div>
                </div>
                <Footer />
            </div>
        )
    }

    const config = categoryConfig[article.category] || categoryConfig['KPIs']
    const CategoryIcon = config.icon
    const heroImage = article.image || categoryImages[article.category] || categoryImages['KPIs']

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
            {/* Article JSON-LD */}
            <StructuredData data={generateArticleJsonLd({
                title: article.title,
                description: article.description,
                slug: article.slug,
                publishedDate: article.date,
                category: article.category
            })} />
            
            {/* Breadcrumb JSON-LD */}
            <StructuredData data={generateBreadcrumbJsonLd([
                { name: 'Accueil', path: '/' },
                { name: 'Blog', path: '/blog' },
                { name: article.category, path: `/blog?category=${article.category}` },
                { name: article.title, path: `/blog/${article.slug}` }
            ])} />
            
            <Header />

            {/* Hero Section Premium */}
            <section className="relative pt-24 pb-16 overflow-hidden">
                {/* Background avec image */}
                <div className="absolute inset-0">
                    <Image
                        src={heroImage}
                        alt=""
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-900" />
                </div>

                {/* Decorative elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-accent-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-5xl mx-auto px-6">
                    {/* Breadcrumb */}
                    <motion.nav
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm text-slate-400 mb-8"
                    >
                        <Link href="/blog" className="hover:text-white transition-colors">
                            Blog
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className={config.color}>{article.category}</span>
                    </motion.nav>

                    {/* Article Header */}
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bgColor} ${config.color} text-sm font-medium`}>
                                <CategoryIcon className="w-4 h-4" />
                                {article.category}
                            </span>
                            <span className="flex items-center gap-2 text-slate-400 text-sm">
                                <Calendar className="w-4 h-4" />
                                {article.date}
                            </span>
                            <span className="flex items-center gap-2 text-slate-400 text-sm">
                                <Clock className="w-4 h-4" />
                                {article.readTime}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            {article.title}
                        </h1>

                        <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
                            {article.description}
                        </p>

                        {/* Share buttons */}
                        <div className="flex items-center gap-4 mt-8">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600 transition-all">
                                <Share2 className="w-4 h-4" />
                                <span className="text-sm">Partager</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600 transition-all">
                                <Bookmark className="w-4 h-4" />
                                <span className="text-sm">Sauvegarder</span>
                            </button>
                        </div>
                    </motion.header>
                </div>
            </section>

            {/* Article Content avec layout 2 colonnes */}
            <section className="relative max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-12">
                    {/* Main Content */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-3xl"
                    >
                        <div className="prose prose-lg prose-invert max-w-none article-content">
                            {article.content}
                        </div>

                        {/* CTA en fin d'article - adapté selon catégorie */}
                        {(article.category === 'Note Stratégique' || article.category === 'Étude de cas') ? (
                            <div className="mt-16 p-8 rounded-xl bg-slate-800/50 border border-slate-700">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white font-serif">
                                            Vous vous reconnaissez dans cette situation ?
                                        </h3>
                                        <p className="text-sm text-slate-400 mt-1">
                                            Cette note pose le diagnostic. Passons aux décisions.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <a
                                        href="https://calendly.com/zineinsight/15min"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg transition-all hover:bg-slate-100"
                                    >
                                        Identifier mes leviers financiers
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                    <Link
                                        href="/diagnostic/guide"
                                        className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 text-white hover:bg-slate-800 rounded-lg transition-all"
                                    >
                                        Lancer mon diagnostic
                                    </Link>
                                    <Link
                                        href="/blog"
                                        className="inline-flex items-center gap-2 px-6 py-3 border border-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Toutes les notes
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-accent-primary/20 via-accent-primary/10 to-transparent border border-accent-primary/30">
                                <h3 className="text-2xl font-bold text-white mb-4 font-serif">
                                    Perdez-vous de l&apos;argent sans le voir ?
                                </h3>
                                <p className="text-slate-300 mb-6">
                                    DSO au-dessus de la médiane, BFR qui dérive, marges qui s&apos;érodent -
                                    le diagnostic FinSight identifie vos fuites de cash en 5 minutes.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        href="/diagnostic/guide"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl transition-all duration-300 hover:bg-slate-100"
                                    >
                                        Lancer mon diagnostic
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <a
                                        href="https://calendly.com/zineinsight/15min"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 text-white hover:bg-slate-800/50 rounded-xl transition-all"
                                    >
                                        Échanger sur ma situation
                                    </a>
                                    <Link
                                        href="/blog"
                                        className="inline-flex items-center gap-2 px-6 py-3 border border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Tous les articles
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Calculator CTA */}
                        {(() => {
                            const calculator = ARTICLE_CALCULATOR_MAP[article.slug]
                            if (!calculator) return null
                            return (
                                <div className="my-10 p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-medium tracking-widest uppercase text-accent-primary mb-1">
                                            OUTIL ASSOCIÉ
                                        </p>
                                        <p className="font-semibold text-gray-900 text-sm">
                                            {calculator.label}
                                        </p>
                                        <p className="text-gray-500 text-sm mt-0.5">
                                            {calculator.description}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/calculateurs/${calculator.slug}`}
                                        className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all duration-200 whitespace-nowrap"
                                    >
                                        Calculer maintenant →
                                    </Link>
                                </div>
                            )
                        })()}

                        {/* Related Articles */}
                        <RelatedArticles currentSlug={article.slug} category={article.category} />
                    </motion.article>

                    {/* Sidebar - Table of Contents */}
                    <TableOfContents headings={headings} />
                </div>
            </section>

            <Footer />

            <style jsx global>{`
                .article-content {
                    color: #e2e8f0;
                }

                .article-content .lead {
                    font-size: 1.25rem;
                    line-height: 1.75;
                    color: #94a3b8;
                    margin-bottom: 2rem;
                    padding-left: 1.5rem;
                    border-left: 4px solid var(--color-accent-primary);
                    background: linear-gradient(to right, rgba(212, 175, 55, 0.1), transparent);
                    padding: 1.5rem;
                    border-radius: 0 0.75rem 0.75rem 0;
                }

                .article-content h2 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin-top: 3rem;
                    margin-bottom: 1.5rem;
                    color: #f8fafc;
                    scroll-margin-top: 100px;
                }

                .article-content h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    color: #f1f5f9;
                }

                .article-content p {
                    margin-bottom: 1.5rem;
                    line-height: 1.8;
                    color: #cbd5e1;
                }

                .article-content ul, .article-content ol {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                }

                .article-content li {
                    margin-bottom: 0.75rem;
                    line-height: 1.8;
                    color: #cbd5e1;
                }

                .article-content strong {
                    color: #f8fafc;
                    font-weight: 600;
                }

                .article-content code {
                    display: block;
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(71, 85, 105, 0.5);
                    padding: 1rem 1.5rem;
                    border-radius: 0.75rem;
                    font-family: 'Monaco', 'Courier New', monospace;
                    font-size: 0.9rem;
                    margin: 1.5rem 0;
                    color: var(--color-accent-primary);
                    backdrop-filter: blur(8px);
                }

                .article-content .info-box,
                .article-content .warning-box,
                .article-content .example-box,
                .article-content .kpi-box,
                .article-content .cta-box {
                    padding: 1.5rem 2rem;
                    border-radius: 1rem;
                    margin: 2rem 0;
                    border-left: 4px solid;
                    backdrop-filter: blur(8px);
                }

                .article-content .info-box {
                    background: rgba(59, 130, 246, 0.15);
                    border-color: #3b82f6;
                    border: 1px solid rgba(59, 130, 246, 0.3);
                    border-left: 4px solid #3b82f6;
                }

                .article-content .warning-box {
                    background: rgba(251, 191, 36, 0.15);
                    border-color: #fbbf24;
                    border: 1px solid rgba(251, 191, 36, 0.3);
                    border-left: 4px solid #fbbf24;
                }

                .article-content .example-box {
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(71, 85, 105, 0.5);
                    border-left: 4px solid var(--color-accent-primary);
                }

                .article-content .kpi-box {
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(71, 85, 105, 0.5);
                    border-left: 4px solid var(--color-accent-primary);
                }

                .article-content .kpi-box code {
                    margin: 1rem 0;
                }

                .article-content .cta-box {
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.05));
                    border: 1px solid rgba(212, 175, 55, 0.3);
                    border-left: 4px solid var(--color-accent-primary);
                    text-align: center;
                }

                .article-content .cta-box h3 {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    color: #f8fafc;
                }

                .article-content .cta-box ul {
                    text-align: left;
                    max-width: 400px;
                    margin: 1.5rem auto;
                }

                .article-content .cta-button {
                    display: inline-block;
                    padding: 0.875rem 2rem;
                    background: var(--color-accent-primary);
                    color: #0f172a;
                    border-radius: 0.75rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s;
                    margin-top: 1rem;
                }

                .article-content .cta-button:hover {
                    background: var(--color-accent-primary-hover);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4);
                }

                .article-content .formula-box {
                    background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(30, 41, 59, 0.4));
                    border: 2px solid var(--color-accent-primary);
                    padding: 2rem;
                    border-radius: 1rem;
                    text-align: center;
                    margin: 2rem 0;
                    backdrop-filter: blur(8px);
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
                    border-radius: 1rem;
                    overflow: hidden;
                }

                .article-content .benchmark-table th,
                .article-content .benchmark-table td {
                    padding: 1rem 1.25rem;
                    text-align: left;
                    border-bottom: 1px solid rgba(71, 85, 105, 0.5);
                }

                .article-content .benchmark-table th {
                    background: rgba(30, 41, 59, 0.8);
                    font-weight: 600;
                    color: #f8fafc;
                }

                .article-content .benchmark-table td {
                    color: #cbd5e1;
                    background: rgba(30, 41, 59, 0.4);
                }

                .article-content .benchmark-table tr:hover td {
                    background: rgba(30, 41, 59, 0.6);
                }

                .article-content .result {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--color-accent-primary);
                    margin-top: 1rem;
                    padding: 0.75rem 1rem;
                    background: rgba(212, 175, 55, 0.1);
                    border-radius: 0.5rem;
                    display: inline-block;
                }

                .article-content .inline-link {
                    color: var(--color-accent-primary);
                    text-decoration: underline;
                    text-underline-offset: 3px;
                    transition: opacity 0.2s;
                }

                .article-content .inline-link:hover {
                    opacity: 0.8;
                }

                .article-content .tip {
                    font-style: italic;
                    color: #94a3b8;
                }

                .article-content .warning {
                    color: #fbbf24;
                    font-weight: 600;
                }
            `}</style>
        </div>
    )
}
