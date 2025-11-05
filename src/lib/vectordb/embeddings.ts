/**
 * GÉNÉRATION D'EMBEDDINGS avec OpenAI
 *
 * Convertit du texte en vecteurs pour la recherche sémantique
 */

import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
    if (openaiInstance) {
        return openaiInstance;
    }

    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY manquante dans .env.local');
    }

    openaiInstance = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    return openaiInstance;
}

/**
 * Génère un embedding pour du texte
 * @param text - Texte à convertir en vecteur
 * @returns Vecteur de 1536 dimensions
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const openai = getOpenAIClient();

    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text.slice(0, 8000), // Limite OpenAI
        });

        return response.data[0].embedding;
    } catch (error) {
        console.error('Erreur génération embedding:', error);
        throw new Error('Impossible de générer l\'embedding');
    }
}

/**
 * Génère des embeddings pour plusieurs textes
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    const openai = getOpenAIClient();

    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: texts.map(t => t.slice(0, 8000)),
        });

        return response.data.map(item => item.embedding);
    } catch (error) {
        console.error('Erreur génération embeddings batch:', error);
        throw new Error('Impossible de générer les embeddings');
    }
}

/**
 * Prépare du texte pour l'embedding (nettoyage)
 */
export function prepareTextForEmbedding(text: string): string {
    return text
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, ' ')
        .slice(0, 8000);
}
