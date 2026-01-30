import OpenAI from 'openai';
import { FinancialRecord, ProcessedData } from '@/lib/dataModel';
import { logger } from '@/lib/logger';

// Client OpenAI initialisé de façon lazy (seulement si clé API présente)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
    if (!process.env.OPENAI_API_KEY) {
        return null;
    }
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: 'https://openrouter.ai/api/v1',
            defaultHeaders: {
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://finsights.app',
                'X-Title': 'FinSight',
            }
        });
    }
    return openaiClient;
}

// Modèles disponibles par taille de fichier
const AI_MODELS = {
    SMALL_FILE: 'google/gemini-2.0-flash-exp:free',  // < 500 lignes : Gratuit + nettoyage intelligent
    LARGE_FILE: 'google/gemini-2.0-flash-exp:free',  // > 500 lignes : Échantillon pour catégories
} as const;

// Définir une structure de retour pour notre parser IA
interface AIParseResult {
    success: boolean;
    data?: ProcessedData;
    error?: string;
    rawResponse?: string; // Pour le débogage
}

/**
 * Analyse le contenu textuel d'un fichier financier (format CSV) en utilisant l'IA
 * pour le transformer en un format de données structuré.
 * @param textContent Le contenu brut du fichier.
 * @param mode Mode de parsing : 'full' (tout le fichier) ou 'sample' (échantillon pour enrichissement)
 * @returns Une promesse qui se résout en un objet AIParseResult.
 */
export async function parseWithAI(textContent: string, mode: 'full' | 'sample' = 'full'): Promise<AIParseResult> {
    logger.debug(`[AI Parser] Début du parsing avec IA (mode: ${mode})...`);

    // ⚠️ Si pas de clé API, retourner erreur (fallback sera utilisé)
    if (!process.env.OPENAI_API_KEY) {
        logger.warn('[AI Parser] ⚠️ OPENAI_API_KEY non définie, skip parsing IA');
        return {
            success: false,
            error: 'IA indisponible (clé API manquante)',
        };
    }

    // Stratégie adaptative selon la taille du fichier
    const MAX_INPUT_LENGTH = mode === 'sample' ? 15000 : 50000;
    const truncatedContent = textContent.length > MAX_INPUT_LENGTH
        ? textContent.substring(0, MAX_INPUT_LENGTH)
        : textContent;

    const systemPrompt = `
        Tu es un expert en analyse de données financières pour une application SaaS nommée FinSight.
        Ta tâche est de convertir le contenu brut d'un fichier (probablement un export CSV) en un tableau d'objets JSON structuré.
        Le JSON doit être un tableau d'enregistrements financiers.

        Voici la structure EXACTE que chaque objet JSON doit respecter :
        - "date": string (la date de la transaction au format YYYY-MM-DD. Si l'année n'est pas présente, utilise l'année en cours: ${new Date().getFullYear()})
        - "amount": number (le montant ABSOLU de la transaction, toujours positif. Ex: 1500.50)
        - "type": string ("income" pour les revenus, "expense" pour les dépenses)
        - "description": string (le libellé ou la description de la transaction)
        - "counterparty": string | null (le client, fournisseur, ou autre tiers. Si non identifiable, mettre null)
        - "category": string | null (la catégorie de la transaction. Si non identifiable, mettre null)

        Règles importantes à suivre :
        1.  Analyse les en-têtes et les premières lignes pour comprendre la structure du fichier.
        2.  Identifie les colonnes correspondant à la date, la description et le montant. C'est le minimum requis.
        3.  Détermine si les montants sont dans une seule colonne (avec des signes +/-) ou dans deux colonnes (débit/crédit).
        4.  Pour le champ "type": Si c'est une recette/vente/revenu, mets "income". Si c'est une dépense/charge/achat, mets "expense".
        5.  Pour le champ "amount": Utilise toujours la VALEUR ABSOLUE du montant (nombre positif).
        6.  Ignore les lignes qui ne sont pas des transactions (en-têtes, lignes de total, lignes vides, etc.).
        7.  Normalise les dates au format YYYY-MM-DD.
        8.  Nettoie les montants pour ne garder que les nombres (ex: "1,234.56 €" -> 1234.56).
        9.  Ta réponse DOIT être un objet JSON avec une clé "transactions" contenant le tableau, sans aucun texte supplémentaire.

        NETTOYAGE INTELLIGENT (nouvelles règles) :
        10. Corrige les fautes de frappe courantes dans les descriptions et contreparties :
            - "Societe Genrale" → "Société Générale"
            - "Amzon Web Services" → "Amazon Web Services"
            - Supprime les espaces en trop, normalise la casse
        11. Détecte et corrige les montants aberrants :
            - Si montant = 1000000 et contexte suggère 1000.00 → corrige
            - Si séparateurs décimaux incohérents (1,234.56 vs 1.234,56) → normalise
        12. Déduis les catégories manquantes par analyse contextuelle :
            - "Loyer bureau Paris" → category: "Charges locatives"
            - "Salaire développeur" → category: "Charges de personnel"
            - "Facture Google Ads" → category: "Marketing digital"
            - "Vente logiciel SaaS" → category: "Revenus récurrents"
        13. Enrichis les contreparties quand possible :
            - "SG" → "Société Générale"
            - "AWS" → "Amazon Web Services"
            - Si SIRET/SIREN présent dans description, extrais-le dans metadata
    `;

    try {
        // Obtenir le client OpenAI (lazy init)
        const openai = getOpenAIClient();
        if (!openai) {
            return {
                success: false,
                error: 'IA indisponible (client non initialisé)',
            };
        }

        // Sélectionner le modèle optimal selon la taille
        const lineCount = textContent.split('\n').length;
        const selectedModel = lineCount > 500 ? AI_MODELS.LARGE_FILE : AI_MODELS.SMALL_FILE;

        logger.debug(`[AI Parser] Envoi de la requête à OpenRouter (${selectedModel}, ${lineCount} lignes)...`);
        const response = await openai.chat.completions.create({
            model: selectedModel, // Gemini 2.0 Flash : rapide + gratuit
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: truncatedContent,
                },
            ],
            response_format: { type: "json_object" }, // Activer le mode JSON pour une sortie garantie
        });

        const rawJson = response.choices[0].message.content;
        logger.debug('[AI Parser] Réponse JSON brute reçue de OpenRouter.');

        if (!rawJson) {
            return { success: false, error: "La réponse de l'IA est vide." };
        }

        // L'IA peut renvoyer un objet { "records": [...] }, nous devons extraire le tableau.
        let records: FinancialRecord[];
        try {
            const parsedObject = JSON.parse(rawJson);
            // Chercher une clé qui contient un tableau (ex: "records", "transactions", "data")
            const arrayKey = Object.keys(parsedObject).find(key => Array.isArray(parsedObject[key]));
            if (!arrayKey) {
                return { success: false, error: "Le JSON de l'IA ne contient pas de tableau de transactions.", rawResponse: rawJson };
            }
            records = parsedObject[arrayKey];
        } catch (e) {
            return { success: false, error: "Impossible de parser la réponse JSON de l'IA.", rawResponse: rawJson };
        }


        if (!Array.isArray(records)) {
            return { success: false, error: "La réponse de l'IA n'est pas un tableau JSON.", rawResponse: rawJson };
        }

        logger.debug(`[AI Parser] Parsing réussi. ${records.length} enregistrements trouvés.`);

        // Validation et nettoyage des données de l'IA
        const validatedRecords = records
            .filter(r => {
                // Filtrer les enregistrements invalides
                return r.date && r.description && typeof r.amount === 'number' && !isNaN(r.amount);
            })
            .map(r => ({
                id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID unique
                date: new Date(r.date), // Convertir la date string en objet Date
                description: String(r.description).trim(),
                amount: Math.abs(r.amount), // S'assurer que le montant est positif
                type: (r.type === 'expense' || r.type === 'income') ? r.type : (r.amount < 0 ? 'expense' : 'income'), // Valider le type
                category: r.category ? String(r.category).trim() : undefined,
                counterparty: r.counterparty ? String(r.counterparty).trim() : undefined,
                sourceId: 'ai-parser',
                confidence: 0.85, // Confiance par défaut pour les données parsées par IA
            } as FinancialRecord));

        if (validatedRecords.length === 0) {
            return { success: false, error: "Aucune transaction valide trouvée après validation." };
        }

        // Construire l'objet ProcessedData attendu par le reste de l'application
        // Note: summary, kpis, et qualityMetrics seront calculés par processFinancialData
        const processedData: Pick<ProcessedData, 'records'> = {
            records: validatedRecords,
        };

        return {
            success: true,
            data: processedData as ProcessedData, // Cast temporaire, les autres champs seront ajoutés
            rawResponse: rawJson,
        };

    } catch (error) {
        logger.error("[AI Parser] Erreur lors de l'appel à l'API OpenAI:", error);
        if (error instanceof OpenAI.APIError) {
            // Gérer les erreurs spécifiques à l'API OpenAI (clé invalide, etc.)
            return { success: false, error: `Erreur API OpenAI: ${error.status} ${error.name} - ${error.message}` };
        }
        return { success: false, error: "Une erreur inattendue est survenue lors du parsing IA." };
    }
}
