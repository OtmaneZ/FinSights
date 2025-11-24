/**
 * GÉNÉRATION D'EMBEDDINGS avec OpenAI + Cache KV
 *
 * Convertit du texte en vecteurs pour la recherche sémantique
 * Cache les embeddings pour économiser 80% des coûts API
 */

import OpenAI from 'openai';
import { getCachedEmbedding, setCachedEmbedding } from '../rateLimitKV';

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
 * Génère un embedding pour du texte (avec cache)
 * @param text - Texte à convertir en vecteur
 * @returns Vecteur de 1536 dimensions
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const openai = getOpenAIClient();
    const preparedText = text.slice(0, 8000);

    try {
        // 🚀 Vérifier le cache d'abord
        const cached = await getCachedEmbedding(preparedText);
        if (cached) {
            return cached;
        }

        // ❌ Cache miss → Appel API OpenAI
        console.log('⚠️ Embedding cache MISS - Calling OpenAI API');
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: preparedText,
        });

        const embedding = response.data[0].embedding;

        // 💾 Sauvegarder dans le cache
        await setCachedEmbedding(preparedText, embedding);

        return embedding;
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
