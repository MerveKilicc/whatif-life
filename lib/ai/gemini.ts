import { GoogleGenerativeAI } from "@google/generative-ai";
import { NatalChart } from "../astrology/calculator";
import { SYSTEM_PROMPT, generateStartPrompt, generateContinuePrompt, generateFinalLetterPrompt } from "./prompts";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest", // Using the latest available flash model from the list
  systemInstruction: SYSTEM_PROMPT,
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export interface SimulationResponse {
  title: string;
  period: string;
  age: number;
  story_text: string;
  stats_change: {
    happiness: number;
    money: number;
    health: number;
  };
  mini_choice?: {
    question: string;
    options: string[];
  };
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

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();
    
    // Parse JSON safely
    try {
        // Clean markdown code blocks if present (common LLM behavior)
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText) as SimulationResponse;
    } catch (e) {
        console.error("JSON Parse Error. Raw Text:", responseText);
        throw new Error("Failed to parse AI response. See server logs for raw output.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
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

  try {
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
        console.error("JSON Parse Error:", e);
        throw new Error("Failed to parse AI response");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function generateFinalLetter(
  name: string,
  birthYear: number,
  history: SimulationResponse[],
  stats: { happiness: number; money: number; health: number }
): Promise<string> {
  const historySummary = history.map(h => `[Age ${h.age}]: ${h.story_text}`).join("\n");
  
  const prompt = generateFinalLetterPrompt(name, birthYear, historySummary, stats);

  const letterModel = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: SYSTEM_PROMPT + "\n IMPORTANT: Return ONLY the raw text of the letter. No JSON.",
  });

  try {
    const result = await letterModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Letter Error:", error);
    throw error;
  }
}
