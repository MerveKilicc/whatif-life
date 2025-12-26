import { GoogleGenerativeAI } from "@google/generative-ai";
import { NatalChart } from "../astrology/calculator";
import { SYSTEM_PROMPT, generateStartPrompt, generateContinuePrompt, generateFinalLetterPrompt } from "./prompts";

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Helper to get ALL available API keys
function getAllApiKeys(): string[] {
  const keys: string[] = [];
  
  // Check standard key
  if (process.env.GEMINI_API_KEY) keys.push(process.env.GEMINI_API_KEY);
  
  // Check for numbered keys (GEMINI_API_KEY_2, GEMINI_API_KEY_3, etc.)
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('GEMINI_API_KEY_') && process.env[key]) {
      keys.push(process.env[key] as string);
    }
  });

  if (keys.length === 0) {
    console.error("No GEMINI_API_KEY found!");
    return [];
  }
  
  return keys;
}

// Fisher-Yates shuffle to randomize key order
function shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// List of models to try in order of preference
const MODELS_TO_TRY = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite-preview-02-05", // Often has separate quota
  "gemini-1.5-flash", // Stable fallback
  "gemini-2.0-flash"  // Another option
];

// Generic Retry Wrapper with Model Fallback
async function executeWithRetry<T>(
    operationName: string,
    operation: (apiKey: string, modelName: string) => Promise<T>
): Promise<T> {
    const keys = shuffleArray(getAllApiKeys());
    let lastError: any;

    // Iterate through keys first (or models first? Keys first usually better to spread load)
    // Actually, let's try: For each Key, try all Models.
    // This way if one key is totally dead, we move to next. 
    // If one key has quota on model B but not A, we find it.

    for (const apiKey of keys) {
        for (const modelName of MODELS_TO_TRY) {
            try {
                console.log(`[${operationName}] Trying API Key ...${apiKey.slice(-4)} with Model: ${modelName}`);
                return await operation(apiKey, modelName);
            } catch (error: any) {
                // Check if it's a quota error or not found error
                const isQuotaError = error.message?.includes("429") || error.message?.includes("Quota exceeded");
                const isNotFoundError = error.message?.includes("404") || error.message?.includes("not found");

                if (isQuotaError || isNotFoundError) {
                     console.warn(`[${operationName}] Failed key ...${apiKey.slice(-4)} / model ${modelName}. Reason: ${isQuotaError ? 'Quota' : 'Not Found'}`);
                     lastError = error;
                     continue; // Try next model/key
                }

                // If it's another error (e.g. parsing, bad request), maybe we should stop?
                // But for robustness let's just log and continue for now.
                console.warn(`[${operationName}] Unexpected error with ...${apiKey.slice(-4)} / ${modelName}: ${error.message}`);
                lastError = error;
            }
        }
    }

    console.error(`[${operationName}] All API keys and models failed.`);
    throw lastError || new Error(`All API keys and models failed for ${operationName}`);
}

export async function startSimulation(
  name: string,
  birthYear: number,
  chart: NatalChart,
  choice: { category: string; text: string }
): Promise<SimulationResponse> {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  const prompt = generateStartPrompt(name, age, chart, choice);

  return executeWithRetry("StartSimulation", async (apiKey, modelName) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName, 
      systemInstruction: SYSTEM_PROMPT,
    });

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();
    
    try {
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText) as SimulationResponse;
    } catch (e) {
        throw new Error("Failed to parse AI response JSON: " + responseText);
    }
  });
}

export async function continueSimulation(
  name: string,
  currentAge: number,
  currentStats: { happiness: number; money: number; health: number },
  lastChoice: string | null,
  history: SimulationResponse[]
): Promise<SimulationResponse> {
  const historySummary = history.slice(-2).map(h => `[Age ${h.age}]: ${h.story_text}`).join("\n");
  const prompt = generateContinuePrompt(name, currentAge, currentStats, lastChoice, historySummary);

  return executeWithRetry("ContinueSimulation", async (apiKey, modelName) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName, 
      systemInstruction: SYSTEM_PROMPT,
    });

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();
    
    try {
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText) as SimulationResponse;
    } catch (e) {
        throw new Error("Failed to parse AI response JSON");
    }
  });
}

export async function generateFinalLetter(
  name: string,
  birthYear: number,
  history: SimulationResponse[],
  stats: { happiness: number; money: number; health: number }
): Promise<string> {
  const historySummary = history.map(h => `[Age ${h.age}]: ${h.story_text}`).join("\n");
  const prompt = generateFinalLetterPrompt(name, birthYear, historySummary, stats);

  return executeWithRetry("GenerateLetter", async (apiKey, modelName) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const letterModel = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT + "\n IMPORTANT: Return ONLY the raw text of the letter. No JSON.",
    });

    const result = await letterModel.generateContent(prompt);
    return result.response.text();
  });
}