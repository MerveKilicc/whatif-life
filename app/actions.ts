"use server";

import { startSimulation, continueSimulation, SimulationResponse } from "@/lib/ai/gemini";
import { NatalChart } from "@/lib/astrology/calculator";

export async function startSimulationAction(
  name: string,
  birthYear: number,
  chart: NatalChart,
  choice: { category: string; text: string }
) {
  // Debug Log
  console.log("Starting Simulation Action...");
  if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL: GEMINI_API_KEY is missing in environment variables!");
    return { success: false, error: "Server Configuration Error: API Key missing." };
  }

  try {
    const result = await startSimulation(name, birthYear, chart, choice);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Simulation Action Error Detailed:", error?.message || error);
    return { success: false, error: error?.message || "Failed to generate simulation" };
  }
}

export async function continueSimulationAction(
  name: string,
  currentAge: number,
  currentStats: { happiness: number; money: number; health: number },
  lastChoice: string | null,
  history: SimulationResponse[]
) {
  try {
    const result = await continueSimulation(name, currentAge, currentStats, lastChoice, history);
    return { success: true, data: result };
  } catch (error) {
    console.error("Continue Action Error:", error);
    return { success: false, error: "Failed to continue simulation" };
  }
}

export async function generateFinalLetterAction(
  name: string,
  birthYear: number,
  history: any[],
  stats: { happiness: number; money: number; health: number }
) {
  try {
    // Dynamic import to avoid circular dependencies if any, or just import from gemini
    const { generateFinalLetter } = await import("@/lib/ai/gemini");
    const result = await generateFinalLetter(name, birthYear, history, stats);
    return { success: true, data: result };
  } catch (error) {
    console.error("Letter Action Error:", error);
    return { success: false, error: "Failed to generate letter" };
  }
}
