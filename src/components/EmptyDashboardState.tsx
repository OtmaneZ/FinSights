'use client'

import { CloudArrowUpIcon, DocumentArrowDownIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function EmptyDashboardState() {
    return (
        <div className="space-y-8 py-8">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
                    <SparklesIcon className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">Dashboard Adaptatif</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Votre dashboard s'adapte à vos données
                </h2>
                <p className="text-lg text-gray-600">
                    FinSight analyse automatiquement votre fichier et génère les KPIs pertinents.<br />
                    Plus vos données sont riches, plus les analyses sont puissantes.
                </p>
            </div>

            {/* Upload Zone */}
            <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8">
                    <div className="text-center">
                        <CloudArrowUpIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Commencez par uploader vos données
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Glissez votre fichier CSV/Excel ou cliquez pour sélectionner
                        </p>
                        
                        <div className="relative mb-4">
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    // Géré par le parent via props
                                    const event = new CustomEvent('fileSelected', { detail: e.target.files });
                                    window.dispatchEvent(event);
                                }}
                            />
                            <div className="border-2 border-dashed border-blue-300 rounded-lg p-12 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
                                <div className="text-blue-600 font-semibold text-lg">
                                    📂 Cliquez ici ou glissez votre fichier
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                    Formats supportés : .xlsx, .xls, .csv (max 10MB)
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-6 text-xs text-gray-500">
                            <span className="flex items-center gap-1">🔒 100% sécurisé</span>
                            <span className="flex items-center gap-1">⚡ Analyse instantanée</span>
                            <span className="flex items-center gap-1">🎯 KPIs auto-générés</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Niveaux d'Analyse */}
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        💡 3 Niveaux d'Analyse
                    </h3>
                    <p className="text-gray-600">
                        Le dashboard se construit automatiquement selon la richesse de vos données
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Niveau 1 */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-lg font-bold text-blue-600">1</span>
                            </div>
                            <h4 className="font-bold text-gray-900">Niveau Basique</h4>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-4 font-mono text-xs text-gray-700">
                            <div className="font-semibold mb-1">Colonnes requises :</div>
                            <div>• Date</div>
                            <div>• Montant</div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="text-gray-600 font-semibold mb-2">Vous obtenez :</div>
                            <div className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span className="text-gray-700">Solde actuel</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span className="text-gray-700">Total entrées/sorties</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span className="text-gray-700">Graphique d'évolution</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span className="text-gray-700">Export PDF basique</span>
                            </div>
                        </div>
                    </div>

                    {/* Niveau 2 */}
                    <div className="bg-white border-2 border-blue-300 rounded-xl p-6 shadow-lg relative">
                        <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Recommandé
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-lg font-bold text-white">2</span>
                            </div>
                            <h4 className="font-bold text-gray-900">Niveau Enrichi</h4>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-3 mb-4 font-mono text-xs text-gray-700 border border-blue-200">
                            <div className="font-semibold mb-1">Colonnes requises :</div>
                            <div>• Date, Montant</div>
                            <div className="text-blue-600 font-semibold">+ Catégorie</div>
                            <div className="text-blue-600 font-semibold">+ Contrepartie</div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="text-gray-600 font-semibold mb-2">Vous obtenez (Niveau 1 +) :</div>
                            <div className="flex items-start gap-2">
                                <span className="text-blue-500">✓</span>
                                <span className="text-gray-700"><strong>DSO</strong> (délais paiement)</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-blue-500">✓</span>
                                <span className="text-gray-700"><strong>Top clients</strong></span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-blue-500">✓</span>
                                <span className="text-gray-700"><strong>Analyse par catégorie</strong></span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-blue-500">✓</span>
                                <span className="text-gray-700">Graphiques avancés</span>
                            </div>
                        </div>
                    </div>

                    {/* Niveau 3 */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-6 hover:shadow-xl transition-all">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <span className="text-lg font-bold text-white">3</span>
                            </div>
                            <h4 className="font-bold text-gray-900">Niveau Complet</h4>
                        </div>
                        
                        <div className="bg-purple-100 rounded-lg p-3 mb-4 font-mono text-xs text-gray-700 border border-purple-300">
                            <div className="font-semibold mb-1">Colonnes requises :</div>
                            <div>• Niveau 2</div>
                            <div className="text-purple-600 font-semibold">+ Produit</div>
                            <div className="text-purple-600 font-semibold">+ Marge</div>
                            <div className="text-purple-600 font-semibold">+ Échéance</div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="text-gray-600 font-semibold mb-2">Vous obtenez (Niveau 2 +) :</div>
                            <div className="flex items-start gap-2">
                                <span className="text-purple-500">✓</span>
                                <span className="text-gray-700"><strong>Projection 90 jours</strong></span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-purple-500">✓</span>
                                <span className="text-gray-700"><strong>Analyse marges produit</strong></span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-purple-500">✓</span>
                                <span className="text-gray-700"><strong>Simulations What-If</strong></span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-purple-500">✓</span>
                                <span className="text-gray-700"><strong>IA Copilot avancé</strong></span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-purple-500">✓</span>
                                <span className="text-gray-700">Alertes prédictives</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Templates à télécharger */}
            <div className="max-w-3xl mx-auto bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <DocumentArrowDownIcon className="h-8 w-8 text-gray-600 flex-shrink-0" />
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">
                            📥 Pas de données sous la main ?
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                            Téléchargez un template CSV pré-formaté pour tester immédiatement
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button 
                                onClick={() => {
                                    // Génération template niveau 1
                                    const csv = "Date,Montant\n2024-01-01,1500\n2024-01-05,-800\n2024-01-10,2200";
                                    const blob = new Blob([csv], { type: 'text/csv' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'template-niveau1-basique.csv';
                                    a.click();
                                }}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                            >
                                📄 Template Niveau 1
                            </button>
                            <button 
                                onClick={() => {
                                    const csv = "Date,Montant,Catégorie,Contrepartie\n2024-01-01,1500,Vente,Client A\n2024-01-05,-800,Achat,Fournisseur B\n2024-01-10,2200,Vente,Client C";
                                    const blob = new Blob([csv], { type: 'text/csv' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'template-niveau2-enrichi.csv';
                                    a.click();
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                📊 Template Niveau 2 (Recommandé)
                            </button>
                            <button 
                                onClick={() => {
                                    const csv = "Date,Montant,Catégorie,Contrepartie,Produit,Marge,Échéance\n2024-01-01,1500,Vente,Client A,Produit X,45%,2024-02-01\n2024-01-05,-800,Achat,Fournisseur B,Matière Y,,2024-01-15\n2024-01-10,2200,Vente,Client C,Produit Z,38%,2024-02-10";
                                    const blob = new Blob([csv], { type: 'text/csv' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'template-niveau3-complet.csv';
                                    a.click();
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-sm"
                            >
                                🚀 Template Niveau 3 (Complet)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Rapide */}
            <div className="max-w-3xl mx-auto">
                <details className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        ❓ Mes données sont sensibles, sont-elles sécurisées ?
                    </summary>
                    <p className="mt-3 text-sm text-gray-600 pl-6">
                        ✅ Vos données restent dans votre navigateur et ne sont jamais stockées sur nos serveurs.<br />
                        ✅ Le traitement se fait côté client pour garantir une confidentialité maximale.<br />
                        ✅ Vous pouvez supprimer vos données à tout moment.
                    </p>
                </details>

                <details className="bg-white border border-gray-200 rounded-lg p-4 mt-3 hover:border-blue-300 transition-colors cursor-pointer">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        ❓ Combien de lignes minimum faut-il ?
                    </summary>
                    <p className="mt-3 text-sm text-gray-600 pl-6">
                        • <strong>Minimum</strong> : 10 lignes pour générer des KPIs basiques<br />
                        • <strong>Recommandé</strong> : 50+ lignes pour des analyses pertinentes<br />
                        • <strong>Optimal</strong> : 100+ lignes pour des projections fiables
                    </p>
                </details>

                <details className="bg-white border border-gray-200 rounded-lg p-4 mt-3 hover:border-blue-300 transition-colors cursor-pointer">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        ❓ Puis-je passer d'un niveau à l'autre ?
                    </summary>
                    <p className="mt-3 text-sm text-gray-600 pl-6">
                        ✅ Oui ! Uploadez un fichier enrichi pour débloquer plus d'analyses.<br />
                        Le dashboard se reconstruit automatiquement avec les nouveaux KPIs disponibles.
                    </p>
                </details>
            </div>
        </div>
    )
}
