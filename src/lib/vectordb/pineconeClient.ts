/**
 * CLIENT PINECONE - Mémoire Vectorielle
 *
 * Permet de stocker et rechercher :
 * - Historique des conversations avec le copilot
 * - Transactions similaires
 * - Insights financiers passés
 */

import { Pinecone } from '@pinecone-database/pinecone';

let pineconeInstance: Pinecone | null = null;

/**
 * Initialise le client Pinecone (singleton)
 */
export async function getPineconeClient(): Promise<Pinecone> {
    if (pineconeInstance) {
        return pineconeInstance;
    }

    if (!process.env.PINECONE_API_KEY) {
        throw new Error('PINECONE_API_KEY manquante dans .env.local');
    }

    pineconeInstance = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });

    return pineconeInstance;
}

/**
 * Nom de l'index Pinecone
 */
export const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'finsight-memory';

/**
 * Namespaces pour organiser les données
 */
export const NAMESPACES = {
    CONVERSATIONS: 'conversations',    // Historique chat copilot
    TRANSACTIONS: 'transactions',      // Transactions similaires
    INSIGHTS: 'insights',              // Insights générés
    COMPANY_PROFILES: 'companies'      // Profils d'entreprises
} as const;

/**
 * Dimension des embeddings OpenAI (text-embedding-3-small)
 */
export const EMBEDDING_DIMENSION = 1536;
