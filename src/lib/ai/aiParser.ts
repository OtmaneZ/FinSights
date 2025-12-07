import OpenAI from 'openai';
import { FinancialRecord, ProcessedData } from '@/lib/dataModel';

// Initialiser le client OpenAI configuré pour OpenRouter
// OpenRouter est compatible avec l'API OpenAI, il suffit de changer l'URL de base
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Votre clé OpenRouter
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://finsights.app',
        'X-Title': 'FinSight',
    }
});

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
 * @returns Une promesse qui se résout en un objet AIParseResult.
 */
export async function parseWithAI(textContent: string): Promise<AIParseResult> {
    console.log('[AI Parser] Début du parsing avec IA...');

    // Tronquer le contenu si trop long pour éviter de dépasser les limites de tokens
    const MAX_INPUT_LENGTH = 15000; // Environ 4k tokens, sécurité
    const truncatedContent = textContent.length > MAX_INPUT_LENGTH
        ? textContent.substring(0, MAX_INPUT_LENGTH)
        : textContent;

    const systemPrompt = `
        Tu es un expert en analyse de données financières pour une application SaaS nommée FinSight.
        Ta tâche est de convertir le contenu brut d'un fichier (probablement un export CSV) en un tableau d'objets JSON structuré.
        Le JSON doit être un tableau d'enregistrements financiers.

        Voici la structure EXACTE que chaque objet JSON doit respecter :
        - "date": string (la date de la transaction au format YYYY-MM-DD. Si l'année n'est pas présente, utilise l'année en cours: ${new Date().getFullYear()})
        - "amount": number (le montant de la transaction. Les dépenses doivent être des nombres négatifs, les revenus des nombres positifs)
        - "description": string (le libellé ou la description de la transaction)
        - "counterparty": string | null (le client, fournisseur, ou autre tiers. Si non identifiable, mettre null)
        - "category": string | null (la catégorie de la transaction. Si non identifiable, mettre null)

        Règles importantes à suivre :
        1.  Analyse les en-têtes et les premières lignes pour comprendre la structure du fichier.
        2.  Identifie les colonnes correspondant à la date, la description et le montant. C'est le minimum requis.
        3.  Détermine si les montants sont dans une seule colonne (avec des signes +/-) ou dans deux colonnes (débit/crédit). Si deux colonnes, combine-les en une seule colonne "amount" avec les signes corrects.
        4.  Ignore les lignes qui ne sont pas des transactions (en-têtes, lignes de total, lignes vides, etc.).
        5.  Normalise les dates au format YYYY-MM-DD.
        6.  Nettoie les montants pour ne garder que les nombres (ex: "1,234.56 €" -> 1234.56).
        7.  Ta réponse DOIT être UNIQUEMENT le tableau JSON, sans aucun texte ou explication supplémentaire.
    `;

    try {
        console.log('[AI Parser] Envoi de la requête à OpenRouter...');
        const response = await openai.chat.completions.create({
            model: "openai/gpt-4-turbo-preview", // Format OpenRouter: provider/model
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
        console.log('[AI Parser] Réponse JSON brute reçue de OpenRouter.');

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

        console.log(`[AI Parser] Parsing réussi. ${records.length} enregistrements trouvés.`);

        // Ici, nous pourrions ajouter une étape de validation/nettoyage sur les 'records' si nécessaire

        // Construire l'objet ProcessedData attendu par le reste de l'application
        // Note: summary, kpis, et qualityMetrics seront calculés dans une étape ultérieure.
        const processedData: Pick<ProcessedData, 'records'> = {
            records: records.map(r => ({
                ...r,
                id: `ai-${Date.now()}-${Math.random()}`, // Générer un ID unique
                type: r.amount >= 0 ? 'income' : 'expense',
                date: new Date(r.date), // Assurer que la date est un objet Date
                confidence: 0.85, // Confiance par défaut pour les données parsées par IA
                sourceId: 'ai-parser'
            })),
        };

        return {
            success: true,
            data: processedData as ProcessedData, // Cast temporaire, les autres champs seront ajoutés
            rawResponse: rawJson,
        };

    } catch (error) {
        console.error("[AI Parser] Erreur lors de l'appel à l'API OpenAI:", error);
        if (error instanceof OpenAI.APIError) {
            // Gérer les erreurs spécifiques à l'API OpenAI (clé invalide, etc.)
            return { success: false, error: `Erreur API OpenAI: ${error.status} ${error.name} - ${error.message}` };
        }
        return { success: false, error: "Une erreur inattendue est survenue lors du parsing IA." };
    }
}
