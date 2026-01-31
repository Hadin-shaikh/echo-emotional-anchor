
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateMorningBriefing(patientName: string, schedule: string[]): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a warm, conversational morning briefing for ${patientName}. 
      Schedule: ${schedule.join(', ')}. 
      Focus on safety and love. Max 80 words.`,
      config: {
        systemInstruction: "You are an empathetic emotional anchor for a person with dementia.",
      },
    });
    return response.text || "Good morning! You are safe and loved.";
  } catch (error) {
    return "Good morning! It's a beautiful day.";
  }
}

export async function parseTaskFromText(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract a task from this text: "${text}". 
      Return the details as JSON. Ensure the date is in YYYY-MM-DD format based on today being ${new Date().toISOString().split('T')[0]}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            time: { type: Type.STRING, description: "Format: HH:MM AM/PM" },
            date: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['MEDICINE', 'MEAL', 'APPOINTMENT', 'OTHER'] }
          },
          required: ["title", "time", "date", "type"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Task parsing error:", error);
    return null;
  }
}
