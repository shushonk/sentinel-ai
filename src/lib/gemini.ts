import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function generateAgentResponse(messages: any[], systemInstruction: string) {
  const response = await genAI.models.generateContent({
    model: "gemini-3.8-flash",
    contents: messages,
    config: {
      systemInstruction,
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    }
  });

  return response.text;
}
