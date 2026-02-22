'use client'

import Link from 'next/link'
import { ArrowRight, Calendar, Target } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function BusinessIntelligencePage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Header />
            
            {/* Prevent CLS: Reserve space for content */}
            <style jsx global>{`
                /* Prevent layout shift for SVG containers */
                .svg-container {
                    min-height: 400px;
                }
                @media (min-width: 768px) {
                    .svg-container {
                        min-height: 350px;
                    }
                }
                
                /* Prevent grid layout shifts */
                .grid-card {
                    min-height: 180px;
                }
                
                /* Reserve space for mission cards */
                .mission-card {
                    min-height: 320px;
                }
                
                /* Prevent metric cards layout shift */
                .metric-card {
                    min-height: 140px;
                }
            `}</style>

            {/* ─── HERO ─── */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(49,130,206,0.15),_transparent_60%)]" />
                <div className="relative max-w-[840px] mx-auto px-6 pt-28 pb-16 lg:pt-36 lg:pb-20">
                    <span className="inline-block text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-blue-300 border border-blue-400/40 px-3 py-1.5 rounded-sm mb-6">
                        Direction Financière & Pilotage
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-white mb-3">
                        Fiabiliser votre pilotage financier<br />multi-entités
                    </h1>
                    <p className="text-[0.95rem] text-blue-200/90 mb-2">
                        Consolidation groupe &mdash; Réconciliation comptable &mdash; Industrialisation du reporting
                    </p>
                    <p className="text-base text-gray-300 max-w-[640px] leading-relaxed font-light mt-6">
                        Quand votre reporting n&rsquo;est pas réconcilié, ce n&rsquo;est pas un problème BI.<br />
                        <span className="font-medium text-white">C&rsquo;est un risque financier.</span><br /><br />
                        Réconciliation comptable systématique, consolidation certifiable,
                        automatisation des flux, traçabilité audit et CAC.
                    </p>

                    {/* Metrics bar */}
                    <div className="mt-10 space-y-3">
                        <div className="grid grid-cols-2 lg:grid-cols-4 border border-white/10 rounded overflow-hidden">
                            {[
                                { value: '3 groupes', label: 'Multi-entités accompagnés' },
                                { value: 'Jusqu\'à -70%', label: 'Temps reporting' },
                                { value: '100%', label: 'Réconciliation validée' },
                                { value: '0', label: 'Extraction manuelle' },
                            ].map((m, i) => (
                                <div key={i} className={`text-center py-5 px-3 ${i < 3 ? 'border-r border-white/10' : ''} ${i < 2 ? 'border-b lg:border-b-0 border-white/10' : i === 2 ? 'border-b lg:border-b-0 border-white/10 lg:border-r' : ''}`}>
                                    <span className="block text-2xl font-bold text-white leading-none mb-1">{m.value}</span>
                                    <span className="text-[0.65rem] font-medium tracking-wider uppercase text-gray-400">{m.label}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[0.7rem] text-gray-400 text-center italic">
                            Métriques constatées sur missions récentes (2024-2026)
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── CAS CLIENT ANONYMISÉ ─── */}
            <section className="py-16 border-b border-gray-200 bg-slate-50">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Cas client — Groupe multi-sites (anonymisé)
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>

                    <p className="text-[0.9rem] text-gray-500 mb-10 max-w-[640px]">
                        Groupe français de services spécialisés, 12 entités juridiques,
                        activité multi-sites, reporting mensuel consolidé présenté en Codir.
                    </p>

                    <div className="bg-white border border-gray-200 rounded p-6 space-y-6">
                        {/* Contexte */}
                        <div>
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Contexte initial
                            </h3>
                            <ul className="space-y-1.5">
                                {[
                                    '12 entités juridiques consolidées mensuellement',
                                    '14 jours nécessaires pour produire le reporting groupe',
                                    '27 KPI calculés différemment selon les directions',
                                    'Retraitements Excel manuels avant chaque clôture',
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        className="text-[0.85rem] text-gray-600 leading-snug pl-3.5 relative before:content-['—'] before:absolute before:left-0 before:text-gray-300"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Intervention */}
                        <div>
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Intervention
                            </h3>
                            <ul className="space-y-1.5">
                                {[
                                    'Mise en place d’un référentiel unique de définitions KPI validé par la Finance',
                                    'Réconciliation systématique reporting / comptabilité',
                                    'Centralisation des flux ERP / CRM dans une base intermédiaire',
                                    'Automatisation complète de la production mensuelle',
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        className="text-[0.85rem] text-gray-600 leading-snug pl-3.5 relative before:content-['—'] before:absolute before:left-0 before:text-gray-300"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Résultats */}
                        <div className="bg-slate-900 text-white rounded p-5">
                            <h3 className="text-[0.8rem] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                Résultats obtenus
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6 text-center">
                                <div>
                                    <div className="text-2xl font-bold">14 → 4 jours</div>
                                    <div className="text-[0.7rem] text-gray-400 uppercase tracking-wider">
                                        Production reporting
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">100 %</div>
                                    <div className="text-[0.7rem] text-gray-400 uppercase tracking-wider">
                                        KPI réconciliés
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">0</div>
                                    <div className="text-[0.7rem] text-gray-400 uppercase tracking-wider">
                                        Fichier Excel consolidé
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── PROBLÈMES RÉSOLUS ─── */}
            <section className="py-16 border-b border-gray-200 bg-red-50/30">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Problèmes que je résous
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-10 max-w-[640px]">
                        Les enjeux récurrents des DAF et contrôleurs de gestion dans les structures
                        en croissance (PME, ETI, groupes multi-sites).
                    </p>

                    <div className="grid md:grid-cols-2 gap-5">
                        {[
                            {
                                probleme: 'Reporting non réconciliable',
                                desc: 'Les KPI du tableau de bord ne collent jamais avec les états comptables. Impossibilité de valider la cohérence des chiffres présentés en comité.',
                            },
                            {
                                probleme: 'KPI définis différemment',
                                desc: 'Finance, Opérations et DRH ne calculent pas la marge de la même manière. Divergences systématiques lors des arbitrages.',
                            },
                            {
                                probleme: 'Consolidation multi-entités fragile',
                                desc: 'Retraitements manuels pour agréger 10, 20, 30 structures. Risque d\'erreur élevé, temps de production mensuel démesuré.',
                            },
                            {
                                probleme: 'Dépendance aux extractions manuelles',
                                desc: 'Le CDG passe 3 jours par mois à exporter, nettoyer, coller des fichiers Excel pour produire le reporting groupe.',
                            },
                            {
                                probleme: 'Manque de traçabilité historique',
                                desc: 'Impossible de comparer les chiffres sur 24 mois avec confiance. Les définitions ont changé, les périmètres aussi, mais personne ne sait quand.',
                            },
                            {
                                probleme: 'Indicateurs non actionnables',
                                desc: 'Les tableaux de bord sont lourds, détaillés, mais personne ne sait quoi faire des alertes. Manque de lien clair avec les leviers opérationnels.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="grid-card bg-white border border-red-200/60 rounded p-5 hover:border-red-400 transition-colors">
                                <h3 className="text-[0.95rem] font-semibold text-red-900 mb-2">{item.probleme}</h3>
                                <p className="text-[0.8rem] text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-5 bg-slate-900 text-white rounded">
                        <p className="text-[0.88rem] leading-relaxed">
                            <span className="font-semibold">Le vrai problème n&rsquo;est jamais Power BI.</span><br />
                            C&rsquo;est l&rsquo;absence de socle de vérité analytique unique, validé par la Finance,
                            alimenté automatiquement, et réconciliable avec la comptabilité à chaque clôture.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── IMPACT MESURABLE ─── */}
            <section className="py-16 border-b border-gray-200 bg-green-50/30">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Impact mesurable
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-10 max-w-[640px]">
                        Les bénéfices concrets constatés après structuration du pilotage financier.
                    </p>

                    <div className="grid md:grid-cols-3 gap-5">
                        {[
                            {
                                metrique: 'Jusqu\'à −70 %',
                                label: 'Temps de production du reporting mensuel',
                                detail: 'Exemple : passage de 15 jours à 4 jours pour produire la consolidation groupe et les analyses par clinique.',
                            },
                            {
                                metrique: '100 %',
                                label: 'Réconciliation comptable automatique',
                                detail: 'Chaque KPI publié est réconciliable avec les états financiers. Validation formelle par le DAF à chaque clôture.',
                            },
                            {
                                metrique: '0',
                                label: 'Fichier Excel consolidé manuellement',
                                detail: 'Suppression des retraitements manuels. Collecte automatisée depuis les outils métier.',
                            },
                            {
                                metrique: '1',
                                label: 'Référentiel unique de définitions KPI',
                                detail: 'Finance, Opérations et DRH utilisent les mêmes définitions. Gouvernance formalisée et versionnée.',
                            },
                            {
                                metrique: 'Jusqu\'à 30',
                                label: 'Entités consolidées sans effort',
                                detail: 'Modèle évolutif permettant d\'intégrer de nouvelles structures sans refonte.',
                            },
                            {
                                metrique: '~3 mois',
                                label: 'Retour sur investissement moyen',
                                detail: 'Économie de temps CDG + fiabilisation décisionnelle = ROI constaté entre 2 et 4 trimestres selon complexité.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="metric-card bg-white border border-green-200/60 rounded p-5 hover:border-green-400 transition-colors">
                                <div className="text-3xl font-bold text-green-700 mb-1">{item.metrique}</div>
                                <h3 className="text-[0.85rem] font-semibold text-gray-900 mb-2">{item.label}</h3>
                                <p className="text-[0.75rem] text-gray-600 leading-snug">{item.detail}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-5 bg-slate-900 text-white rounded">
                        <p className="text-[0.88rem] leading-relaxed">
                            <span className="font-semibold">Un DAF pense en ROI.</span><br />
                            Le temps libéré au CDG, la confiance retrouvée en comité, la traçabilité garantie
                            lors des audits : ce sont des gains mesurables et durables.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── APPROCHE ET MÉTHODE ─── */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Approche et méthode
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-10 max-w-[640px]">
                        Une intervention structurée qui aligne enjeux financiers et infrastructure technique,
                        sans dépendance à une DSI externe.
                    </p>

                    <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                        <div>
                            <h3 className="text-[0.95rem] font-semibold text-slate-800 mb-2">Réconciliation comptable systématique</h3>
                            <p className="text-[0.85rem] text-gray-500 leading-relaxed">
                                Chaque indicateur publié dans le reporting est réconciliable avec
                                les états financiers. Validation formelle par la Direction Financière
                                à chaque clôture mensuelle.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-[0.95rem] font-semibold text-slate-800 mb-2">Élimination des extractions manuelles</h3>
                            <p className="text-[0.85rem] text-gray-500 leading-relaxed">
                                Automatisation complète de la collecte depuis les outils métier
                                (ERP, CRM, RH). Plus de fichiers Excel consolidés manuellement,
                                plus de retraitements hebdomadaires.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-[0.95rem] font-semibold text-slate-800 mb-2">Référentiel unique de définitions</h3>
                            <p className="text-[0.85rem] text-gray-500 leading-relaxed">
                                Centralisation et validation par la Finance de toutes les définitions KPI.
                                Finance, Opérations et DRH utilisent les mêmes calculs, les mêmes périmètres.
                                Gouvernance formalisée.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-[0.95rem] font-semibold text-slate-800 mb-2">Transfert de compétences garanti</h3>
                            <p className="text-[0.85rem] text-gray-500 leading-relaxed">
                                Documentation complète métier et technique, formation des équipes
                                Finance et Opérations, autonomie retrouvée sur la maintenance
                                et l&rsquo;évolution du système.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── TYPES DE MISSIONS ─── */}
            <section className="py-16 border-b border-gray-200 bg-gray-50/60">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Types de missions
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-10 max-w-[640px]">
                        Interventions structurées selon la maturité de pilotage et les enjeux prioritaires.
                    </p>

                    <div className="grid md:grid-cols-2 gap-5">
                        {/* Mission 1 */}
                        <div className="mission-card bg-white border border-gray-200 rounded p-6 hover:border-slate-400 transition-colors">
                            <div className="flex justify-between items-baseline mb-3">
                                <span className="text-[0.6rem] font-semibold tracking-[0.1em] uppercase text-slate-700">Diagnostic</span>
                                <span className="text-[0.6rem] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm">5-10 jours</span>
                            </div>
                            <h3 className="text-[0.95rem] font-semibold text-slate-800 mb-3">Audit de fiabilité du pilotage</h3>
                            <ul className="space-y-1.5">
                                {[
                                    'Analyse de la réconciliation reporting / comptabilité',
                                    'Identification des KPI divergents entre directions',
                                    'Cartographie des retraitements manuels',
                                    'Évaluation des risques de consolidation',
                                    'Feuille de route priorisée avec ROI estimé',
                                ].map((item, i) => (
                                    <li key={i} className="text-[0.8rem] text-gray-500 leading-snug pl-3.5 relative before:content-['—'] before:absolute before:left-0 before:text-gray-300 before:text-[0.7rem]">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 pt-3 border-t border-gray-100 text-[0.75rem] text-slate-700 font-medium">
                                Livrable : rapport d&rsquo;audit + recommandations chiffrées
                            </p>
                        </div>

                        {/* Mission 2 */}
                        <div className="mission-card bg-white border border-gray-200 rounded p-6 hover:border-slate-400 transition-colors">
                            <div className="flex justify-between items-baseline mb-3">
                                <span className="text-[0.6rem] font-semibold tracking-[0.1em] uppercase text-slate-700">Fiabilisation</span>
                                <span className="text-[0.6rem] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm">15-30 jours</span>
                            </div>
                            <h3 className="text-[0.95rem] font-semibold text-slate-800 mb-3">Sécurisation du reporting groupe</h3>
                            <ul className="space-y-1.5">
                                {[
                                    'Mise en réconciliation comptable systématique',
                                    'Harmonisation des définitions KPI validées Finance',
                                    'Référentiel unique multi-entités',
                                    'Tests de cohérence analytique',
                                    'Validation DAF sur période de référence',
                                ].map((item, i) => (
                                    <li key={i} className="text-[0.8rem] text-gray-500 leading-snug pl-3.5 relative before:content-['—'] before:absolute before:left-0 before:text-gray-300 before:text-[0.7rem]">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 pt-3 border-t border-gray-100 text-[0.75rem] text-slate-700 font-medium">
                                Livrable : reporting réconciliable + référentiel KPI
                            </p>
                        </div>

                        {/* Mission 3 */}
                        <div className="mission-card bg-white border border-gray-200 rounded p-6 hover:border-slate-400 transition-colors">
                            <div className="flex justify-between items-baseline mb-3">
                                <span className="text-[0.6rem] font-semibold tracking-[0.1em] uppercase text-slate-700">Industrialisation</span>
                                <span className="text-[0.6rem] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm">10-20 jours</span>
                            </div>
                            <h3 className="text-[0.95rem] font-semibold text-slate-800 mb-3">Automatisation des flux de données</h3>
                            <ul className="space-y-1.5">
                                {[
                                    'Suppression des extractions manuelles',
                                    'Connexion automatique ERP / CRM / Paie',
                                    'Collecte planifiée et sécurisée',
                                    'Monitoring des flux et alertes anomalies',
                                    'Gain temps CDG : 70 % du temps mensuel',
                                ].map((item, i) => (
                                    <li key={i} className="text-[0.8rem] text-gray-500 leading-snug pl-3.5 relative before:content-['—'] before:absolute before:left-0 before:text-gray-300 before:text-[0.7rem]">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 pt-3 border-t border-gray-100 text-[0.75rem] text-slate-700 font-medium">
                                Livrable : flux automatisés + documentation technique
                            </p>
                        </div>

                        {/* Mission 4 */}
                        <div className="mission-card bg-white border border-gray-200 rounded p-6 hover:border-slate-400 transition-colors">
                            <div className="flex justify-between items-baseline mb-3">
                                <span className="text-[0.6rem] font-semibold tracking-[0.1em] uppercase text-slate-700">Autonomie</span>
                                <span className="text-[0.6rem] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm">5-8 jours</span>
                            </div>
                            <h3 className="text-[0.95rem] font-semibold text-slate-800 mb-3">Transfert et gouvernance KPI</h3>
                            <ul className="space-y-1.5">
                                {[
                                    'Formation équipes Finance : maintenance, évolution',
                                    'Formation Opérations & DRH : navigation, interprétation',
                                    'Structuration de la gouvernance des définitions',
                                    'Documentation métier complète',
                                    'Autonomie garantie post-mission',
                                ].map((item, i) => (
                                    <li key={i} className="text-[0.8rem] text-gray-500 leading-snug pl-3.5 relative before:content-['—'] before:absolute before:left-0 before:text-gray-300 before:text-[0.7rem]">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 pt-3 border-t border-gray-100 text-[0.75rem] text-slate-700 font-medium">
                                Livrable : supports formation + guide gouvernance
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── GALERIE / EXEMPLES — SVG inline réalistes ─── */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Exemples de réalisations
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-10 max-w-[640px]">
                        Extraits anonymisés de tableaux de bord, modèles et architectures
                        livrés en contexte réel.
                    </p>

                    <div className="space-y-6">

                        {/* ═══ 1. DASHBOARD OVERVIEW — Full width ═══ */}
                        <div className="svg-container w-full bg-[#1b2a3d] rounded border border-gray-700 overflow-hidden">
                            {/* Title bar */}
                            <div className="flex items-center justify-between px-4 py-2 bg-[#14202e] border-b border-gray-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                    <span className="text-[0.7rem] font-semibold text-gray-300 tracking-wide">REPORTING CONSOLIDÉ — GROUPE</span>
                                </div>
                                <div className="flex items-center gap-3 text-[0.6rem] text-gray-500">
                                    <span>Période : Jan — Déc 2025</span>
                                    <span className="px-1.5 py-0.5 bg-green-900/40 text-green-400 rounded text-[0.55rem] font-semibold">LIVE</span>
                                    <span className="px-1.5 py-0.5 bg-blue-900/30 text-blue-400 rounded text-[0.55rem] italic">Extrait anonymisé</span>
                                </div>
                            </div>
                            {/* KPI Row */}
                            <div className="grid grid-cols-4 gap-px bg-gray-700/50 mx-4 mt-4 rounded overflow-hidden">
                                {[
                                    { label: 'CA Consolidé', value: '18.4M€', delta: '+6.8%', up: true },
                                    { label: 'Marge Brute Moy.', value: '61.2%', delta: '-3.4 pts', up: false },
                                    { label: 'Trésorerie Nette', value: '1.1M€', delta: '-380K€', up: false },
                                    { label: 'DSO Moyen', value: '57j', delta: '+8j', up: false },
                                ].map((kpi, i) => (
                                    <div key={i} className="bg-[#1e2f42] p-3 text-center">
                                        <span className="block text-[0.55rem] text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</span>
                                        <span className="block text-lg font-bold text-white leading-none mb-1">{kpi.value}</span>
                                        <span className={`text-[0.65rem] font-semibold ${kpi.up ? 'text-green-400' : 'text-red-400'}`}>{kpi.delta}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Chart area */}
                            <div className="px-4 pt-4 pb-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[0.6rem] text-gray-500 font-semibold uppercase tracking-wider">CA mensuel vs. objectif</span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-blue-500" /><span className="text-[0.55rem] text-gray-500">Réalisé</span></div>
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-gray-600" /><span className="text-[0.55rem] text-gray-500">Objectif</span></div>
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500" /><span className="text-[0.55rem] text-gray-500">Marge %</span></div>
                                    </div>
                                </div>
                                <svg viewBox="0 0 760 200" className="w-full" xmlns="http://www.w3.org/2000/svg">
                                    {/* Grid lines */}
                                    {[40, 80, 120, 160].map(y => (
                                        <line key={y} x1="30" y1={y} x2="750" y2={y} stroke="#2a3a4e" strokeWidth="0.5" />
                                    ))}
                                    {/* Y-axis labels */}
                                    {[
                                        { y: 40, label: '3M€' }, { y: 80, label: '2M€' }, { y: 120, label: '1M€' }, { y: 160, label: '0' }
                                    ].map((t, i) => (
                                        <text key={i} x="8" y={t.y + 3} fontSize="8" fill="#4a5568">{t.label}</text>
                                    ))}
                                    {/* Objective bars (background) */}
                                    {[65, 60, 72, 55, 68, 75, 50, 70, 80, 78, 85, 90].map((h, i) => (
                                        <rect key={`obj-${i}`} x={40 + i * 58} y={160 - h * 1.3} width="22" height={h * 1.3} rx="1" fill="#2a3a4e" />
                                    ))}
                                    {/* Realised bars */}
                                    {[60, 55, 75, 48, 72, 80, 45, 68, 82, 74, 88, 92].map((h, i) => (
                                        <rect key={`real-${i}`} x={40 + i * 58} y={160 - h * 1.3} width="22" height={h * 1.3} rx="1" fill="#3b82f6" opacity="0.85" />
                                    ))}
                                    {/* Margin line */}
                                    <polyline
                                        points={[60, 55, 75, 48, 72, 80, 45, 68, 82, 74, 88, 92].map((h, i) => `${51 + i * 58},${160 - h * 0.8}`).join(' ')}
                                        fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinejoin="round"
                                    />
                                    {[60, 55, 75, 48, 72, 80, 45, 68, 82, 74, 88, 92].map((h, i) => (
                                        <circle key={`dot-${i}`} cx={51 + i * 58} cy={160 - h * 0.8} r="2.5" fill="#eab308" />
                                    ))}
                                    {/* X-axis labels */}
                                    {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'].map((m, i) => (
                                        <text key={m} x={51 + i * 58} y="178" fontSize="7" fill="#4a5568" textAnchor="middle">{m}</text>
                                    ))}
                                </svg>
                            </div>
                            {/* Bottom bar */}
                            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-700/50 text-[0.55rem] text-gray-600">
                                <span>8 entités consolidées | Dernière actualisation : 17/02/2026 08:15</span>
                                <span>Power BI Service — Scheduled Refresh</span>
                            </div>
                        </div>

                        {/* ═══ 2 & 3. KPI FINANCE + AUTOMATISATION — Side by side ═══ */}
                        <div className="grid md:grid-cols-2 gap-6">

                            {/* 2. KPI FINANCE */}
                            <div className="bg-[#1b2a3d] rounded border border-gray-700 overflow-hidden">
                                <div className="flex items-center gap-2 px-4 py-2 bg-[#14202e] border-b border-gray-700">
                                    <div className="w-2 h-2 rounded-full bg-blue-500/80" />
                                    <span className="text-[0.65rem] font-semibold text-gray-300 tracking-wide">KPI FINANCE</span>
                                </div>
                                <div className="p-3 space-y-2.5">
                                    {[
                                        { label: 'Marge contributive', value: '58.7%', spark: [64, 61, 57, 62, 55, 59, 58], color: '#3b82f6', bg: 'bg-blue-500/10' },
                                        { label: 'Cash disponible', value: '1.1M€', spark: [48, 52, 44, 38, 31, 28, 35], color: '#22c55e', bg: 'bg-green-500/10' },
                                        { label: 'BFR / CA', value: '27.4%', spark: [21, 23, 25, 24, 27, 26, 27], color: '#f59e0b', bg: 'bg-yellow-500/10' },
                                        { label: 'Ratio Endettement', value: '0.78', spark: [60, 62, 68, 71, 74, 77, 78], color: '#ef4444', bg: 'bg-red-500/10' },
                                    ].map((kpi, i) => (
                                        <div key={i} className={`flex items-center justify-between p-2.5 rounded ${kpi.bg}`}>
                                            <div className="flex-1 min-w-0">
                                                <span className="block text-[0.6rem] text-gray-500 uppercase tracking-wider">{kpi.label}</span>
                                                <span className="block text-base font-bold text-white leading-tight">{kpi.value}</span>
                                            </div>
                                            <svg viewBox="0 0 70 28" className="w-16 h-7 flex-shrink-0">
                                                <polyline
                                                    points={kpi.spark.map((v, j) => `${j * 11 + 2},${28 - v * 0.45}`).join(' ')}
                                                    fill="none" stroke={kpi.color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"
                                                />
                                                <circle cx={2 + 6 * 11} cy={28 - kpi.spark[6] * 0.45} r="2" fill={kpi.color} />
                                            </svg>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-1.5 border-t border-gray-700/50 text-[0.5rem] text-gray-600 text-right">
                                    Actualisation hebdomadaire
                                </div>
                            </div>

                            {/* 3. AUTOMATISATION FLUX — Pipeline */}
                            <div className="bg-white rounded border border-gray-200 overflow-hidden">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
                                    <div className="w-2 h-2 rounded-full bg-green-500/80" />
                                    <span className="text-[0.65rem] font-semibold text-gray-600 tracking-wide">ARCHITECTURE FLUX AUTOMATISÉS</span>
                                </div>
                                <div className="p-4">
                                    <svg viewBox="0 0 380 280" className="w-full" xmlns="http://www.w3.org/2000/svg">
                                        {/* Sources column */}
                                        <text x="52" y="16" fontSize="7" fill="#94a3b8" fontWeight="600" textAnchor="middle">SOURCES</text>
                                        {[
                                            { y: 30, label: 'ERP / Compta', sub: 'API REST' },
                                            { y: 75, label: 'CRM / Ventes', sub: 'Webhook' },
                                            { y: 120, label: 'RH / Paie', sub: 'SFTP' },
                                            { y: 165, label: 'Ops / Terrain', sub: 'CSV Auto' },
                                        ].map((s, i) => (
                                            <g key={i}>
                                                <rect x="8" y={s.y} width="88" height="36" rx="3" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                                                <text x="52" y={s.y + 15} fontSize="7.5" fill="#334155" textAnchor="middle" fontWeight="500">{s.label}</text>
                                                <text x="52" y={s.y + 26} fontSize="6" fill="#94a3b8" textAnchor="middle">{s.sub}</text>
                                            </g>
                                        ))}

                                        {/* Arrows source → collecte */}
                                        {[48, 93, 138, 183].map((y, i) => (
                                            <g key={i}>
                                                <line x1="96" y1={y} x2="138" y2={130} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,2" />
                                                <circle cx="138" cy={130} r="2" fill="#cbd5e1" />
                                            </g>
                                        ))}

                                        {/* Collecte */}
                                        <text x="190" y="86" fontSize="7" fill="#94a3b8" fontWeight="600" textAnchor="middle">COLLECTE</text>
                                        <rect x="140" y="96" width="100" height="68" rx="4" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.2" />
                                        <text x="190" y="118" fontSize="8" fill="#1e40af" textAnchor="middle" fontWeight="600">Python Scripts</text>
                                        <text x="190" y="131" fontSize="6.5" fill="#3b82f6" textAnchor="middle">Planifiés (cron)</text>
                                        <line x1="155" y1="140" x2="225" y2="140" stroke="#bfdbfe" strokeWidth="0.5" />
                                        <text x="190" y="153" fontSize="6" fill="#64748b" textAnchor="middle">Validation + Nettoyage</text>

                                        {/* Arrow collecte → base */}
                                        <line x1="240" y1="130" x2="272" y2="130" stroke="#93c5fd" strokeWidth="1.2" markerEnd="url(#arrowBlue)" />
                                        <defs>
                                            <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                                <path d="M0,0 L6,3 L0,6 Z" fill="#93c5fd" />
                                            </marker>
                                            <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                                <path d="M0,0 L6,3 L0,6 Z" fill="#86efac" />
                                            </marker>
                                        </defs>

                                        {/* Base centralisée */}
                                        <text x="322" y="86" fontSize="7" fill="#94a3b8" fontWeight="600" textAnchor="middle">ENTREPÔT</text>
                                        <rect x="272" y="96" width="100" height="68" rx="4" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.2" />
                                        <text x="322" y="118" fontSize="8" fill="#166534" textAnchor="middle" fontWeight="600">PostgreSQL</text>
                                        <text x="322" y="131" fontSize="6.5" fill="#22c55e" textAnchor="middle">Modèle dimensionnel</text>
                                        <line x1="287" y1="140" x2="357" y2="140" stroke="#bbf7d0" strokeWidth="0.5" />
                                        <text x="322" y="153" fontSize="6" fill="#64748b" textAnchor="middle">Historisation + Traçabilité</text>

                                        {/* Arrow base → Power BI */}
                                        <line x1="322" y1="164" x2="322" y2="196" stroke="#86efac" strokeWidth="1.2" markerEnd="url(#arrowGreen)" />

                                        {/* Power BI */}
                                        <rect x="260" y="198" width="124" height="50" rx="4" fill="#fefce8" stroke="#fde68a" strokeWidth="1.2" />
                                        <text x="322" y="218" fontSize="9" fill="#92400e" textAnchor="middle" fontWeight="700">Power BI</text>
                                        <text x="322" y="231" fontSize="6" fill="#a16207" textAnchor="middle">Scheduled Refresh | RLS</text>
                                        <text x="322" y="242" fontSize="5.5" fill="#b45309" textAnchor="middle">Service Cloud</text>

                                        {/* Status indicators */}
                                        <circle cx="20" cy="218" r="3" fill="#22c55e" opacity="0.8" />
                                        <text x="28" y="221" fontSize="6" fill="#64748b">Tous les flux actifs</text>
                                        <circle cx="20" cy="234" r="3" fill="#3b82f6" opacity="0.8" />
                                        <text x="28" y="237" fontSize="6" fill="#64748b">Refresh : 06h00 quotidien</text>
                                        <circle cx="20" cy="250" r="3" fill="#a855f7" opacity="0.8" />
                                        <text x="28" y="253" fontSize="6" fill="#64748b">Alertes anomalies : Slack</text>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* ═══ 4 & 5. MODÈLE ÉTOILE + REPORTING OPS — Side by side ═══ */}
                        <div className="grid md:grid-cols-2 gap-6">

                            {/* 4. MODÈLE EN ÉTOILE */}
                            <div className="bg-white rounded border border-gray-200 overflow-hidden">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
                                    <div className="w-2 h-2 rounded-full bg-purple-500/80" />
                                    <span className="text-[0.65rem] font-semibold text-gray-600 tracking-wide">MODÈLE DIMENSIONNEL</span>
                                </div>
                                <div className="p-4">
                                    <svg viewBox="0 0 360 300" className="w-full" xmlns="http://www.w3.org/2000/svg">
                                        {/* Center: Fact table */}
                                        <rect x="120" y="100" width="120" height="100" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
                                        <text x="180" y="118" fontSize="7" fill="#3b82f6" textAnchor="middle" fontWeight="700">FAIT</text>
                                        <line x1="130" y1="124" x2="230" y2="124" stroke="#bfdbfe" strokeWidth="0.5" />
                                        <text x="180" y="137" fontSize="6.5" fill="#1e3a5f" textAnchor="middle" fontWeight="600">Fact_Transactions</text>
                                        {['id_clinique (FK)', 'id_periode (FK)', 'id_compte (FK)', 'montant_debit', 'montant_credit', 'quantite'].map((f, i) => (
                                            <text key={i} x="137" y={147 + i * 8.5} fontSize="5.5" fill="#64748b">{f}</text>
                                        ))}

                                        {/* Dimension: Clinique (top-left) */}
                                        <rect x="10" y="10" width="110" height="70" rx="3" fill="#fefce8" stroke="#fbbf24" strokeWidth="1" />
                                        <text x="65" y="26" fontSize="6.5" fill="#92400e" textAnchor="middle" fontWeight="600">Dim_Clinique</text>
                                        <line x1="20" y1="31" x2="110" y2="31" stroke="#fde68a" strokeWidth="0.5" />
                                        {['id_clinique (PK)', 'nom_clinique', 'region', 'directeur', 'date_ouverture'].map((f, i) => (
                                            <text key={i} x="22" y={41 + i * 8} fontSize="5" fill="#64748b">{f}</text>
                                        ))}
                                        <line x1="65" y1="80" x2="155" y2="100" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,2" />
                                        <circle cx="155" cy="100" r="2.5" fill="#fbbf24" />

                                        {/* Dimension: Période (top-right) */}
                                        <rect x="240" y="10" width="110" height="70" rx="3" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1" />
                                        <text x="295" y="26" fontSize="6.5" fill="#166534" textAnchor="middle" fontWeight="600">Dim_Periode</text>
                                        <line x1="250" y1="31" x2="340" y2="31" stroke="#bbf7d0" strokeWidth="0.5" />
                                        {['id_periode (PK)', 'date', 'mois', 'trimestre', 'annee_fiscale'].map((f, i) => (
                                            <text key={i} x="252" y={41 + i * 8} fontSize="5" fill="#64748b">{f}</text>
                                        ))}
                                        <line x1="295" y1="80" x2="210" y2="100" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,2" />
                                        <circle cx="210" cy="100" r="2.5" fill="#22c55e" />

                                        {/* Dimension: Compte (bottom-left) */}
                                        <rect x="10" y="220" width="110" height="70" rx="3" fill="#fdf2f8" stroke="#ec4899" strokeWidth="1" />
                                        <text x="65" y="236" fontSize="6.5" fill="#9d174d" textAnchor="middle" fontWeight="600">Dim_Compte</text>
                                        <line x1="20" y1="241" x2="110" y2="241" stroke="#fbcfe8" strokeWidth="0.5" />
                                        {['id_compte (PK)', 'num_compte', 'libelle', 'categorie', 'axe_analytique'].map((f, i) => (
                                            <text key={i} x="22" y={251 + i * 8} fontSize="5" fill="#64748b">{f}</text>
                                        ))}
                                        <line x1="90" y1="220" x2="155" y2="200" stroke="#ec4899" strokeWidth="1" strokeDasharray="4,2" />
                                        <circle cx="155" cy="200" r="2.5" fill="#ec4899" />

                                        {/* Dimension: Activité (bottom-right) */}
                                        <rect x="240" y="220" width="110" height="70" rx="3" fill="#f5f3ff" stroke="#8b5cf6" strokeWidth="1" />
                                        <text x="295" y="236" fontSize="6.5" fill="#5b21b6" textAnchor="middle" fontWeight="600">Dim_Activite</text>
                                        <line x1="250" y1="241" x2="340" y2="241" stroke="#ddd6fe" strokeWidth="0.5" />
                                        {['id_activite (PK)', 'type_acte', 'famille', 'tarif_ref', 'code_ccam'].map((f, i) => (
                                            <text key={i} x="252" y={251 + i * 8} fontSize="5" fill="#64748b">{f}</text>
                                        ))}
                                        <line x1="270" y1="220" x2="210" y2="200" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4,2" />
                                        <circle cx="210" cy="200" r="2.5" fill="#8b5cf6" />

                                        {/* Relation labels */}
                                        <text x="95" y="98" fontSize="5" fill="#b45309" textAnchor="middle">1:N</text>
                                        <text x="265" y="98" fontSize="5" fill="#15803d" textAnchor="middle">1:N</text>
                                        <text x="110" y="212" fontSize="5" fill="#be185d" textAnchor="middle">1:N</text>
                                        <text x="250" y="212" fontSize="5" fill="#7c3aed" textAnchor="middle">1:N</text>
                                    </svg>
                                </div>
                            </div>

                            {/* 5. REPORTING OPÉRATIONNEL */}
                            <div className="bg-[#1b2a3d] rounded border border-gray-700 overflow-hidden">
                                <div className="flex items-center gap-2 px-4 py-2 bg-[#14202e] border-b border-gray-700">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                                    <span className="text-[0.65rem] font-semibold text-gray-300 tracking-wide">REPORTING PAR SITE</span>
                                </div>
                                <div className="p-3">
                                    {/* Table header */}
                                    <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_1fr] gap-1 mb-1.5 px-2">
                                        {['Site', 'CA Mois', 'Marge', 'Perf. vs Obj.'].map((h, i) => (
                                            <span key={i} className="text-[0.55rem] text-gray-500 uppercase tracking-wider font-semibold">{h}</span>
                                        ))}
                                    </div>
                                    {/* Table rows */}
                                    {[
                                        { site: 'Paris — Bastille',     ca: '312K€', marge: '74.3%', perf: 112, color: '#22c55e' },
                                        { site: 'Lyon — Part-Dieu',     ca: '287K€', marge: '68.1%', perf: 103, color: '#22c55e' },
                                        { site: 'Marseille — Prado',    ca: '245K€', marge: '57.9%', perf: 91,  color: '#eab308' },
                                        { site: 'Bordeaux — Centre',    ca: '198K€', marge: '41.2%', perf: 74,  color: '#f97316' },
                                        { site: 'Toulouse — Capitole',  ca: '176K€', marge: '63.4%', perf: 88,  color: '#eab308' },
                                        { site: 'Nantes — Commerce',    ca: '112K€', marge: '12.8%', perf: 38,  color: '#ef4444' },
                                        { site: 'Lille — Grand Place',  ca: '98K€',  marge: '−4.1%', perf: 18,  color: '#dc2626' },
                                        { site: 'Strasbourg — Kléber',  ca: '141K€', marge: '69.7%', perf: 96,  color: '#eab308' },
                                    ].map((row, i) => (
                                        <div key={i} className={`grid grid-cols-[1.2fr_0.8fr_0.8fr_1fr] gap-1 items-center px-2 py-1.5 rounded ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                                            <span className="text-[0.7rem] text-gray-300 font-medium truncate">{row.site}</span>
                                            <span className="text-[0.7rem] text-white font-semibold">{row.ca}</span>
                                            <span className="text-[0.7rem] text-gray-400">{row.marge}</span>
                                            <div className="flex items-center gap-1.5">
                                                <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{ width: `${Math.min(row.perf, 110)}%`, backgroundColor: row.color }}
                                                    />
                                                </div>
                                                <span className="text-[0.6rem] font-semibold w-7 text-right" style={{ color: row.color }}>
                                                    {row.perf}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Total row */}
                                    <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_1fr] gap-1 items-center px-2 py-2 mt-1.5 border-t border-gray-700">
                                        <span className="text-[0.65rem] text-gray-400 font-semibold uppercase">Total groupe</span>
                                        <span className="text-[0.75rem] text-white font-bold">1.68M€</span>
                                        <span className="text-[0.75rem] text-gray-300 font-semibold">68.4%</span>
                                        <span className="text-[0.65rem] text-green-400 font-semibold">Moy. 95%</span>
                                    </div>
                                </div>
                                <div className="px-4 py-1.5 border-t border-gray-700/50 text-[0.5rem] text-gray-600 text-right">
                                    8 sites | Données mensuelles consolidées
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ─── ARCHITECTURES IT — 3 scénarios ─── */}
            <section className="py-16 border-b border-gray-200 bg-gray-50/60">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Options techniques selon le contexte
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-10 max-w-[640px]">
                        Architecture adaptée au nombre d&rsquo;entités, au volume de données et aux enjeux de gouvernance.
                    </p>

                    <div className="space-y-4">
                        {/* Option A */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <span className="text-[0.6rem] font-semibold tracking-[0.1em] uppercase text-slate-700">Scénario 1</span>
                                    <h3 className="text-[0.9rem] font-semibold text-slate-800">PME / 1-5 entités</h3>
                                </div>
                                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.05em] px-2 py-0.5 rounded-sm bg-green-50 text-green-700 border border-green-200">Quick Win</span>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 p-5">
                                <div>
                                    <h4 className="text-[0.65rem] font-semibold tracking-wider uppercase text-gray-400 mb-1.5">Contexte</h4>
                                    <p className="text-[0.78rem] text-gray-500 leading-snug">
                                        Reporting actuel en Excel, besoin de fiabilisation rapide et de standardisation des KPI sans refonte IT.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[0.65rem] font-semibold tracking-wider uppercase text-gray-400 mb-1.5">Solution</h4>
                                    <ul className="space-y-1">
                                        {['Collecte automatisée via SharePoint', 'Refresh planifié quotidien', 'Réconciliation comptable intégrée'].map((t, i) => (
                                            <li key={i} className="text-[0.78rem] text-gray-500 pl-2.5 relative before:content-['•'] before:absolute before:left-0 before:text-gray-300">{t}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-[0.65rem] font-semibold tracking-wider uppercase text-gray-400 mb-1.5">Bénéfices</h4>
                                    <ul className="space-y-1">
                                        {['Mise en place : 5 jours', 'Coût minimal', 'Autonomie équipe finance'].map((t, i) => (
                                            <li key={i} className="text-[0.78rem] text-gray-500 pl-2.5 relative before:content-['•'] before:absolute before:left-0 before:text-gray-300">{t}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Option B */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <span className="text-[0.6rem] font-semibold tracking-[0.1em] uppercase text-slate-700">Scénario 2</span>
                                    <h3 className="text-[0.9rem] font-semibold text-slate-800">ETI / 5-30 entités</h3>
                                </div>
                                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.05em] px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-200">Recommandé</span>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 p-5">
                                <div>
                                    <h4 className="text-[0.65rem] font-semibold tracking-wider uppercase text-gray-400 mb-1.5">Contexte</h4>
                                    <p className="text-[0.78rem] text-gray-500 leading-snug">
                                        Consolidation multi-sociétés, ERP hétérogènes, besoin d&rsquo;historisation et de traçabilité des retraitements.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[0.65rem] font-semibold tracking-wider uppercase text-gray-400 mb-1.5">Solution</h4>
                                    <ul className="space-y-1">
                                        {['Connexion automatique ERP via API', 'Base intermédiaire centralisée', 'Historisation complète (5+ ans)'].map((t, i) => (
                                            <li key={i} className="text-[0.78rem] text-gray-500 pl-2.5 relative before:content-['•'] before:absolute before:left-0 before:text-gray-300">{t}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-[0.65rem] font-semibold tracking-wider uppercase text-gray-400 mb-1.5">Bénéfices</h4>
                                    <ul className="space-y-1">
                                        {['Mise en place : 10-15 jours', 'Fréquence quotidienne', 'Traçabilité audit'].map((t, i) => (
                                            <li key={i} className="text-[0.78rem] text-gray-500 pl-2.5 relative before:content-['•'] before:absolute before:left-0 before:text-gray-300">{t}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Option C */}
                        <div className="bg-white border border-gray-200 rounded overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <span className="text-[0.6rem] font-semibold tracking-[0.1em] uppercase text-slate-700">Scénario 3</span>
                                    <h3 className="text-[0.9rem] font-semibold text-slate-800">Groupe / 30+ entités</h3>
                                </div>
                                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.05em] px-2 py-0.5 rounded-sm bg-purple-50 text-purple-700 border border-purple-200">Scalable</span>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 p-5">
                                <div>
                                    <h4 className="text-[0.65rem] font-semibold tracking-wider uppercase text-gray-400 mb-1.5">Contexte</h4>
                                    <p className="text-[0.78rem] text-gray-500 leading-snug">
                                        Périmètre groupe international, consolidation complexe, reporting réglementaire, enjeux de certification CAC.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[0.65rem] font-semibold tracking-wider uppercase text-gray-400 mb-1.5">Solution</h4>
                                    <ul className="space-y-1">
                                        {['Entrepôt de données cloud', 'Modèle dimensionnel groupe', 'Couche de transformation validée'].map((t, i) => (
                                            <li key={i} className="text-[0.78rem] text-gray-500 pl-2.5 relative before:content-['•'] before:absolute before:left-0 before:text-gray-300">{t}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-[0.65rem] font-semibold tracking-wider uppercase text-gray-400 mb-1.5">Bénéfices</h4>
                                    <ul className="space-y-1">
                                        {['Mise en place : 15-20 jours', 'Scalable sans limite', 'Traçabilité audit & CAC'].map((t, i) => (
                                            <li key={i} className="text-[0.78rem] text-gray-500 pl-2.5 relative before:content-['•'] before:absolute before:left-0 before:text-gray-300">{t}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── POSITIONNEMENT ─── */}
            <section className="py-16 border-b border-gray-200">
                <div className="max-w-[840px] mx-auto px-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5 pb-3 relative">
                        Positionnement
                        <span className="absolute bottom-0 left-0 w-9 h-0.5 bg-slate-800" />
                    </h2>
                    <div className="mt-8 bg-slate-900 text-white rounded p-8 lg:p-10">
                        <p className="text-[0.9rem] text-gray-300 leading-relaxed mb-4">
                            Ces missions ne relèvent pas du « développement Power BI »,
                            mais de la <span className="text-white font-medium">sécurisation du pilotage financier multi-entités</span>.
                        </p>
                        <p className="text-[0.9rem] text-gray-300 leading-relaxed mb-4">
                            La double compétence Finance (DAF externalisé, contrôle de gestion groupe)
                            et Data (Power BI, automatisation, architecture) permet de réconcilier
                            indicateurs opérationnels et comptabilité &mdash; sans dépendance à une DSI externe.
                        </p>
                        <p className="text-[0.9rem] text-gray-300 leading-relaxed">
                            L&rsquo;objectif : transformer le reporting actuel en
                            <span className="text-white font-medium"> outil stratégique certifiable</span>,
                            exploité avec confiance avant chaque Comex, Codir et Conseil.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="py-20 bg-gray-50/60">
                <div className="max-w-[640px] mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Un projet BI en tête ?
                    </h2>
                    <p className="text-[0.9rem] text-gray-500 mb-8 leading-relaxed">
                        Discutons de votre contexte, de vos sources de données et de vos objectifs
                        de pilotage lors d&rsquo;un échange de 30 minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://calendly.com/zineinsight"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded transition-all"
                        >
                            <Calendar className="w-4 h-4" />
                            Prendre rendez-vous
                        </a>
                        <Link
                            href="/consulting"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 hover:border-slate-400 text-gray-900 font-semibold rounded transition-all"
                        >
                            Voir le consulting Finance
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <p className="text-xs text-gray-400 mt-6">
                        Gratuit. Sans engagement. Réponse sous 24h.
                    </p>

                    {/* CTA diagnostic — qualifier le besoin avant la mission BI */}
                    <div className="mt-10 pt-10 border-t border-gray-200">
                        <p className="text-sm text-gray-400 mb-3">
                            Pas encore sûr de vos enjeux prioritaires ?
                        </p>
                        <Link
                            href="/diagnostic/guide"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-sm transition-all"
                        >
                            <Target className="w-4 h-4" />
                            Obtenir le Score FinSight™ gratuit — 7 min
                        </Link>
                        <p className="text-xs text-gray-400 mt-2">
                            Score 0–100 · 4 piliers · Sans inscription
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
