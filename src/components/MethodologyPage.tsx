'use client'

import React from 'react'
import {
    ClockIcon,
    DocumentTextIcon,
    CogIcon,
    CheckCircleIcon,
    PlayIcon,
    AcademicCapIcon,
    ChatBubbleLeftRightIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline'

export default function MethodologyPage() {
    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Méthodologie FinSight
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Découvrez comment je transforme vos données financières en
                    tableau de bord décisionnel en 2-3 jours seulement.
                </p>
                <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-accent-primary mr-2" />
                    <span className="text-blue-800 font-medium">Livraison garantie en 72h</span>
                </div>
            </div>

            {/* Process Overview */}
            <div className="surface rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                    Process en 4 Étapes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="bg-blue-100 rounded-lg p-4 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                            <ChatBubbleLeftRightIcon className="h-8 w-8 text-accent-primary" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">1. Audit Express</h4>
                        <p className="text-sm text-gray-600">
                            Call de 60min pour comprendre vos besoins et données disponibles
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="bg-green-100 rounded-lg p-4 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                            <CogIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">2. Développement</h4>
                        <p className="text-sm text-gray-600">
                            Création de votre dashboard personnalisé en 24-48h
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="bg-purple-100 rounded-lg p-4 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                            <PlayIcon className="h-8 w-8 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">3. Livraison</h4>
                        <p className="text-sm text-gray-600">
                            Présentation de votre solution et formation utilisateur
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="bg-orange-100 rounded-lg p-4 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                            <CheckCircleIcon className="h-8 w-8 text-orange-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">4. Support</h4>
                        <p className="text-sm text-gray-600">
                            Garantie 30 jours + ajustements si nécessaire
                        </p>
                    </div>
                </div>
            </div>

            {/* Detailed Approach */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="surface rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <DocumentTextIcon className="h-6 w-6 text-accent-primary mr-2" />
                        Livrables Inclus
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                                <strong>Dashboard interactif</strong> avec vos KPIs métier
                            </span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                                <strong>Connexions automatisées</strong> à vos sources de données
                            </span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                                <strong>Insights IA</strong> personnalisés selon votre secteur
                            </span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                                <strong>Export PDF</strong> automatique pour vos reportings
                            </span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                                <strong>Formation équipe</strong> (2h) + documentation
                            </span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                                <strong>Code source</strong> complet et commenté
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="surface rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <ChartBarIcon className="h-6 w-6 text-green-600 mr-2" />
                        Expertise Technique
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <div className="bg-blue-100 rounded p-1 mr-3 mt-0.5">
                                <span className="text-xs font-mono text-blue-800">JS</span>
                            </div>
                            <span className="text-gray-700">
                                <strong>Frontend moderne :</strong> Next.js, React, TypeScript
                            </span>
                        </li>
                        <li className="flex items-start">
                            <div className="bg-green-100 rounded p-1 mr-3 mt-0.5">
                                <span className="text-xs font-mono text-green-800">API</span>
                            </div>
                            <span className="text-gray-700">
                                <strong>Intégrations :</strong> REST APIs, bases de données, Excel
                            </span>
                        </li>
                        <li className="flex items-start">
                            <div className="bg-purple-100 rounded p-1 mr-3 mt-0.5">
                                <span className="text-xs font-mono text-purple-800">IA</span>
                            </div>
                            <span className="text-gray-700">
                                <strong>Intelligence artificielle :</strong> Analyse prédictive
                            </span>
                        </li>
                        <li className="flex items-start">
                            <div className="bg-orange-100 rounded p-1 mr-3 mt-0.5">
                                <span className="text-xs font-mono text-orange-800">VIZ</span>
                            </div>
                            <span className="text-gray-700">
                                <strong>Visualisations :</strong> Recharts, D3.js, interactivité
                            </span>
                        </li>
                        <li className="flex items-start">
                            <div className="bg-gray-100 rounded p-1 mr-3 mt-0.5">
                                <span className="text-xs font-mono text-gray-800">OPS</span>
                            </div>
                            <span className="text-gray-700">
                                <strong>Déploiement :</strong> Cloud, sécurité, performance
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Pricing and Packages */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                    Formules & Tarification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="surface rounded-lg p-6 shadow-md">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Express</h4>
                        <div className="text-3xl font-bold text-accent-primary mb-4">1 800€</div>
                        <ul className="space-y-2 text-sm text-gray-600 mb-6">
                            <li>• Dashboard 3-5 KPIs</li>
                            <li>• 1 source de données</li>
                            <li>• Formation 1h</li>
                            <li>• Livraison 48h</li>
                        </ul>
                        <div className="text-center">
                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                PME &lt; 10M€ CA
                            </span>
                        </div>
                    </div>

                    <div className="surface rounded-lg p-6 shadow-md border-2 border-blue-500 relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">Populaire</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Pro</h4>
                        <div className="text-3xl font-bold text-accent-primary mb-4">2 800€</div>
                        <ul className="space-y-2 text-sm text-gray-600 mb-6">
                            <li>• Dashboard complet 6-10 KPIs</li>
                            <li>• 2-3 sources de données</li>
                            <li>• IA insights personnalisés</li>
                            <li>• Formation équipe 2h</li>
                            <li>• Support 30j</li>
                        </ul>
                        <div className="text-center">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                PME 10-50M€ CA
                            </span>
                        </div>
                    </div>

                    <div className="surface rounded-lg p-6 shadow-md">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Solution Custom</h4>
                        <div className="text-3xl font-bold text-accent-primary mb-4">Sur devis</div>
                        <ul className="space-y-2 text-sm text-gray-600 mb-6">
                            <li>• Développement sur-mesure</li>
                            <li>• Multi-sources complexes</li>
                            <li>• Intégrations avancées</li>
                            <li>• Formation + accompagnement</li>
                            <li>• Support prioritaire</li>
                        </ul>
                        <div className="text-center">
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                Entreprises &gt; 50M€
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose FinSight */}
            <div className="surface rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                    Pourquoi Choisir FinSight ?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">🎯 Expertise Finance + Tech</h4>
                        <p className="text-gray-600 mb-4">
                            Double compétence rare : 10 ans d'expérience finance corporate +
                            expertise data science. Je parle le langage des DAF ET je maîtrise
                            la technologie.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• Formation Le Wagon Data Science</li>
                            <li>• Expérience finance dans plusieurs secteurs</li>
                            <li>• Spécialisation TPE/PME françaises</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">⚡ Livraison Ultra-Rapide</h4>
                        <p className="text-gray-600 mb-4">
                            Là où les agences prennent 2-6 semaines, je livre en 2-3 jours.
                            Méthodologie éprouvée et stack technique optimisée pour la rapidité.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• Templates pré-construits finance</li>
                            <li>• Process automatisé de déploiement</li>
                            <li>• Focus sur l'essentiel sans superflu</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="text-center bg-gradient-to-r from-accent-primary to-indigo-600 rounded-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Prêt à Transformer Vos Données ?</h3>
                <p className="text-xl mb-6 opacity-90">
                    Discutons de vos besoins lors d'un audit gratuit de 30 minutes
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="https://calendly.com/zineinsight"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="surface text-accent-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        � Prendre rendez-vous
                    </a>
                    <a
                        href="https://calendly.com/otmane-zineinsight/audit-dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-accent-primary transition-colors"
                    >
                        📅 Réserver un Créneau
                    </a>
                </div>
                <p className="text-sm mt-4 opacity-75">
                    Réponse garantie sous 24h • Sans engagement
                </p>
            </div>
        </div>
    )
}