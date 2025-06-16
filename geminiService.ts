
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';
import type { GeminiResponse } from '../types';

// Ensure API_KEY is accessed via process.env as per instructions
// In a typical Vite/CRA React app, this would be process.env.VITE_API_KEY or process.env.REACT_APP_API_KEY
// For this environment, we assume process.env.API_KEY is directly available.
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY environment variable not set. Gemini API calls will fail.");
  // Potentially throw an error or have a fallback, but per instructions, assume it's set.
}

const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" }); // Provide a fallback for type safety if needed, though instructions imply it's always there.

/**
 * Generates content using the Gemini API.
 * @param prompt The text prompt to send to the model.
 * @returns A Promise resolving to a GeminiResponse object.
 */
export const generateText = async (prompt: string): Promise<GeminiResponse> => {
  if (!apiKey) {
    return { text: "Error: Gemini API Key not configured." };
  }
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL, // Use the constant for the model name
      contents: prompt,
      config: {
        // Example: Disable thinking for low latency if needed, otherwise omit for higher quality.
        // thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    
    // Directly access the .text property as per guidelines
    const textOutput = response.text;
    
    return { text: textOutput };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return { text: `Error generating content: ${error.message}` };
    }
    return { text: "An unknown error occurred while generating content." };
  }
};


/**
 * Example function to get a description for a topic using Gemini.
 * This function is not directly used by the main GEE app logic but serves as an example
 * of how to use the Gemini service.
 */
export const getMockDescriptionFromGemini = async (topic: string): Promise<string> => {
  const prompt = `Provide a brief, engaging description for the following geographic topic: ${topic}. Keep it under 50 words.`;
  try {
    const result = await generateText(prompt);
    return result.text;
  } catch (error) {
    console.error(`Error fetching description for ${topic}:`, error);
    return `Could not fetch description for ${topic}.`;
  }
};

// Add other Gemini API functions as needed (e.g., generateImages, chat, etc.)
// adhering to the provided guidelines.
