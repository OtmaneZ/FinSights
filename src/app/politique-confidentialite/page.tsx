import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
    title: 'Politique de confidentialité - FinSight',
    description: 'Politique de confidentialité et protection des données personnelles de FinSight'
}

export default function PolitiqueConfidentialite() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Politique de confidentialité
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">
                        Dernière mise à jour : 28 novembre 2025
                    </p>

                    <div className="prose prose-lg max-w-none">
                        {/* Introduction */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                FinSight (ci-après "nous", "notre" ou "nos") s'engage à protéger et respecter votre vie privée.
                                Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons
                                vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                <strong>Responsable du traitement :</strong><br />
                                FinSight<br />
                                Email : contact@finsight.zineinsight.com
                            </p>
                        </section>

                        {/* Données collectées */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Données que nous collectons</h2>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 Données d'inscription</h3>
                            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                                <li>Nom et prénom</li>
                                <li>Adresse email</li>
                                <li>Entreprise et poste</li>
                                <li>Mot de passe (chiffré)</li>
                            </ul>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 Données d'utilisation</h3>
                            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                                <li>Adresse IP</li>
                                <li>Type de navigateur et appareil</li>
                                <li>Pages visitées et temps passé</li>
                                <li>Actions effectuées sur la plateforme</li>
                            </ul>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">2.3 Données financières</h3>
                            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                                <li>Fichiers CSV/Excel importés (données comptables)</li>
                                <li>Analyses et rapports générés</li>
                                <li>Informations de l'entreprise (CA, marges, etc.)</li>
                            </ul>
                        </section>

                        {/* Utilisation des données */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Comment nous utilisons vos données</h2>
                            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                                <li><strong>Fourniture du service :</strong> Traiter vos données financières, générer des analyses et rapports</li>
                                <li><strong>Authentification :</strong> Gérer votre compte et sécuriser votre accès</li>
                                <li><strong>Communication :</strong> Vous envoyer des emails transactionnels (confirmation d'inscription, alertes)</li>
                                <li><strong>Amélioration :</strong> Analyser l'utilisation pour améliorer notre plateforme</li>
                                <li><strong>Support :</strong> Répondre à vos questions et résoudre les problèmes techniques</li>
                            </ul>
                        </section>

                        {/* Cookies */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookies et technologies similaires</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences via notre
                                <a href="/cookies" className="text-primary hover:underline ml-1">politique des cookies</a>.
                            </p>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">4.1 Cookies nécessaires</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Essentiels au fonctionnement du site (authentification, sécurité, préférences).
                                Ces cookies ne peuvent pas être désactivés.
                            </p>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">4.2 Cookies analytiques</h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Utilisés pour comprendre comment vous utilisez notre site :
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                                <li><strong>Google Analytics 4 :</strong> Analyse du trafic et comportement utilisateur</li>
                                <li><strong>Microsoft Clarity :</strong> Enregistrements de sessions et heatmaps</li>
                                <li><strong>Google Tag Manager :</strong> Gestion des balises de suivi</li>
                            </ul>
                        </section>

                        {/* Partage des données */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Partage de vos données</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Nous ne vendons jamais vos données. Nous les partageons uniquement avec :
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                                <li><strong>Fournisseurs de services :</strong> Vercel (hébergement), OpenAI (IA), Resend (emails)</li>
                                <li><strong>Outils analytiques :</strong> Google Analytics, Microsoft Clarity</li>
                                <li><strong>Obligations légales :</strong> Si requis par la loi ou une autorité compétente</li>
                            </ul>
                        </section>

                        {/* Sécurité */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Sécurité de vos données</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles :
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                                <li>Chiffrement SSL/TLS pour toutes les communications</li>
                                <li>Mots de passe hashés avec bcrypt</li>
                                <li>Accès restreint aux données (principe du moindre privilège)</li>
                                <li>Sauvegardes régulières et sécurisées</li>
                                <li>Surveillance continue des menaces</li>
                            </ul>
                        </section>

                        {/* Vos droits */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Vos droits RGPD</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Conformément au RGPD, vous disposez des droits suivants :
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                                <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données personnelles</li>
                                <li><strong>Droit de rectification :</strong> Corriger des données inexactes</li>
                                <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
                                <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
                                <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
                                <li><strong>Droit de limitation :</strong> Demander la limitation du traitement</li>
                            </ul>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Pour exercer vos droits, contactez-nous à :
                                <a href="mailto:contact@finsight.zineinsight.com" className="text-primary hover:underline ml-1">
                                    contact@finsight.zineinsight.com
                                </a>
                            </p>
                        </section>

                        {/* Conservation des données */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Conservation des données</h2>
                            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                                <li><strong>Données de compte :</strong> Conservées tant que votre compte est actif</li>
                                <li><strong>Données financières :</strong> Conservées tant que vous utilisez le service</li>
                                <li><strong>Logs et analytics :</strong> 25 mois maximum (conformément CNIL)</li>
                                <li><strong>Après suppression du compte :</strong> Données anonymisées ou supprimées sous 30 jours</li>
                            </ul>
                        </section>

                        {/* Modifications */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Modifications de cette politique</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Nous pouvons modifier cette politique de confidentialité. Les changements importants vous seront notifiés
                                par email ou via une notification sur la plateforme. La date de "dernière mise à jour" sera mise à jour
                                en haut de cette page.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Nous contacter</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-900 font-medium mb-2">FinSight</p>
                                <p className="text-gray-600">
                                    Email :
                                    <a href="mailto:contact@finsight.zineinsight.com" className="text-primary hover:underline ml-1">
                                        contact@finsight.zineinsight.com
                                    </a>
                                </p>
                                <p className="text-gray-600 mt-4 text-sm">
                                    Vous avez également le droit de déposer une plainte auprès de la CNIL (Commission Nationale de
                                    l'Informatique et des Libertés) si vous estimez que vos droits ne sont pas respectés.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
