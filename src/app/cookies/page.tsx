import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
    title: 'Politique des cookies - FinSight',
    description: 'Politique des cookies et gestion des préférences sur FinSight'
}

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Politique des cookies
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">
                        Dernière mise à jour : 28 novembre 2025
                    </p>

                    <div className="prose prose-lg max-w-none">
                        {/* Introduction */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette, smartphone)
                                lorsque vous visitez un site web. Les cookies permettent au site de reconnaître votre appareil et
                                de mémoriser vos préférences et actions.
                            </p>
                        </section>

                        {/* Types de cookies */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Types de cookies que nous utilisons</h2>

                            {/* Cookies nécessaires */}
                            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6 rounded-r-lg">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    Cookies nécessaires (Toujours actifs)
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Ces cookies sont essentiels au fonctionnement du site. Ils ne peuvent pas être désactivés.
                                </p>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cookie</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Finalité</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Durée</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-4 py-3 text-sm text-gray-900 font-mono">next-auth.session-token</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">Authentification de l'utilisateur</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">30 jours</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-sm text-gray-900 font-mono">cookie-consent</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">Enregistre vos préférences cookies</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">12 mois</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Cookies analytiques */}
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded-r-lg">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-blue-600">📊</span>
                                    Cookies analytiques (Optionnels - Nécessitent votre consentement)
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Ces cookies nous aident à comprendre comment vous utilisez notre site afin de l'améliorer.
                                    Aucune donnée personnelle identifiable n'est collectée.
                                </p>

                                <div className="space-y-6">
                                    {/* Google Analytics */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Google Analytics 4</h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Service d'analyse de trafic web fourni par Google LLC.
                                        </p>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cookie</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Finalité</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Durée</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    <tr>
                                                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">_ga</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">Distingue les visiteurs uniques</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">2 ans</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">_ga_*</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">Maintient l'état de la session</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">2 ans</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            En savoir plus :
                                            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                                                Politique de confidentialité Google
                                            </a>
                                        </p>
                                    </div>

                                    {/* Microsoft Clarity */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Microsoft Clarity</h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Outil d'analyse comportementale fourni par Microsoft Corporation.
                                        </p>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cookie</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Finalité</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Durée</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    <tr>
                                                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">_clck</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">Identifiant utilisateur unique</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">1 an</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">_clsk</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">Regroupe les pages vues dans une session</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">1 jour</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            En savoir plus :
                                            <a href="https://privacy.microsoft.com/fr-fr/privacystatement" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                                                Politique de confidentialité Microsoft
                                            </a>
                                        </p>
                                    </div>

                                    {/* Google Tag Manager */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Google Tag Manager</h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Système de gestion des balises fourni par Google LLC.
                                        </p>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cookie</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Finalité</th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Durée</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    <tr>
                                                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">_gtm_*</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">Gestion et déclenchement des balises</td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">Session</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Gestion des cookies */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Comment gérer vos préférences ?</h2>

                            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Via notre banner de cookies</h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Lors de votre première visite, un banner apparaît vous permettant de :
                                </p>
                                <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                                    <li>Accepter tous les cookies</li>
                                    <li>Refuser tous les cookies (sauf les nécessaires)</li>
                                    <li>Personnaliser vos préférences</li>
                                </ul>
                                <p className="text-gray-600 leading-relaxed">
                                    Vous pouvez modifier vos préférences à tout moment en supprimant le cookie <code className="bg-gray-200 px-2 py-1 rounded text-sm">cookie-consent</code>
                                    de votre navigateur, le banner réapparaîtra.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Via votre navigateur</h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Vous pouvez également configurer votre navigateur pour bloquer ou supprimer les cookies :
                                </p>
                                <ul className="space-y-2 text-gray-600">
                                    <li>
                                        <strong>Chrome :</strong>
                                        <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                                            Guide de gestion des cookies
                                        </a>
                                    </li>
                                    <li>
                                        <strong>Firefox :</strong>
                                        <a href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                                            Guide de gestion des cookies
                                        </a>
                                    </li>
                                    <li>
                                        <strong>Safari :</strong>
                                        <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                                            Guide de gestion des cookies
                                        </a>
                                    </li>
                                    <li>
                                        <strong>Edge :</strong>
                                        <a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                                            Guide de gestion des cookies
                                        </a>
                                    </li>
                                </ul>
                                <p className="text-sm text-gray-500 mt-4">
                                    ⚠️ Attention : Bloquer tous les cookies peut affecter le fonctionnement de certaines fonctionnalités du site.
                                </p>
                            </div>
                        </section>

                        {/* Impact du refus */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Impact du refus des cookies</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Si vous refusez les cookies analytiques :
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                                <li>✅ Vous pourrez continuer à utiliser toutes les fonctionnalités de FinSight</li>
                                <li>✅ Votre authentification fonctionnera normalement</li>
                                <li>❌ Nous ne pourrons pas améliorer l'expérience utilisateur en fonction des usages</li>
                                <li>❌ Nous ne pourrons pas mesurer l'audience du site</li>
                            </ul>
                        </section>

                        {/* Contact */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Questions ?</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Pour toute question concernant notre utilisation des cookies :
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-900 font-medium mb-2">FinSight</p>
                                <p className="text-gray-600">
                                    Email :
                                    <a href="mailto:contact@finsight.zineinsight.com" className="text-primary hover:underline ml-1">
                                        contact@finsight.zineinsight.com
                                    </a>
                                </p>
                            </div>
                        </section>

                        {/* Liens utiles */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Liens utiles</h2>
                            <ul className="space-y-2 text-gray-600">
                                <li>
                                    <a href="/politique-confidentialite" className="text-primary hover:underline">
                                        → Politique de confidentialité
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        → Guide CNIL sur les cookies
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.youronlinechoices.com/fr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        → Your Online Choices (gestion de la publicité comportementale)
                                    </a>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
