import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDatabase } from './database';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export class AIService {
  static async getGeminiResponse(prompt: string, contextData: string) {
    if (!GEMINI_API_KEY) {
      return "Clé API manquante. Veuillez configurer EXPO_PUBLIC_GEMINI_API_KEY dans votre fichier .env.";
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `
      Tu es DeepVital, un expert en intelligence biomédicale.
      Tu as accès aux données de santé de l'utilisateur stockées dans une base SQLite.
      Voici le schéma de la base :
      - user_profile (question_id, answer, category)
      - health_logs (type, value, unit, metadata, timestamp)

      Contexte de l'utilisateur : ${contextData}

      Réponds aux questions de l'utilisateur de manière précise, scientifique et encourageante.
      Si l'utilisateur pose une question nécessitant des données, suggère la requête SQL à effectuer.
      FORMAT SQL : [SQL: SELECT ... FROM ...]
      SÉCURITÉ : Tu ne dois JAMAIS suggérer de requêtes destructives (DELETE, DROP, UPDATE, INSERT). UNIQUEMENT du SELECT.
    `;

    try {
      const result = await model.generateContent([systemPrompt, prompt]);
      return result.response.text();
    } catch (e) {
      console.error("Gemini Error:", e);
      return "Désolé, je rencontre des difficultés à me connecter à mon cerveau cloud.";
    }
  }

  static async getLocalResponse(prompt: string) {
    return "En mode 100% local (Llama 3.2), je peux analyser vos tendances basiques sans envoyer de données sur le cloud. Pour une analyse poussée, repassez en mode Performance.";
  }

  static async processAgenticWorkflow(userMessage: string, isLocal: boolean = false) {
    if (isLocal) {
      return await this.getLocalResponse(userMessage);
    }

    const db = await getDatabase();

    // 1. Get User Context
    const profile = await db.getAllAsync<{ question_id: string, answer: string }>('SELECT question_id, answer FROM user_profile');
    const contextData = JSON.stringify(profile);

    // 2. Initial AI Analysis
    const initialResponse = await this.getGeminiResponse(userMessage, contextData);

    // 3. Detect SQL Suggestion
    const sqlMatch = initialResponse.match(/\[SQL: (SELECT .*?)\]/i);
    if (sqlMatch) {
      const sql = sqlMatch[1];
      try {
        // Security check: Only allow SELECT
        if (!sql.trim().toUpperCase().startsWith('SELECT')) {
          return initialResponse;
        }

        const data = await db.getAllAsync(sql);
        // 4. Second pass with real data
        const finalPrompt = `Voici les données extraites de la base pour répondre à la question : ${JSON.stringify(data)}.
        Analyse-les et formule une réponse complète et utile pour : ${userMessage}`;
        return await this.getGeminiResponse(finalPrompt, contextData);
      } catch (e) {
        console.error("SQL Execution Error in AI Agent:", e);
        return initialResponse;
      }
    }

    return initialResponse;
  }
}
