import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("API Key not found in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init to get client
    // Actually the SDK doesn't have a direct 'listModels' on the instance easily exposed in all versions, 
    // but we can try the direct API call or look at the error message which suggested "Call ListModels".
    // The node SDK usually exposes `genAI.getGenerativeModel` but listing might be on the main class or manager.
    // Let's try to find it on the `GoogleGenerativeAI` instance or use a raw fetch.
    
    // Using raw fetch to be sure
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
        console.log("Available Models:");
        data.models.forEach(m => {
            if (m.name.includes("gemini")) {
                console.log(`- ${m.name} (${m.supportedGenerationMethods.join(", ")})`);
            }
        });
    } else {
        console.log("No models found or error:", data);
    }

  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
