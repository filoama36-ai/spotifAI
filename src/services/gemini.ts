import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface PlaylistSuggestion {
  name: string;
  description: string;
  tracks: {
    title: string;
    artist: string;
  }[];
}

export const geminiService = {
  async generatePlaylistSuggestions(prompt: string): Promise<PlaylistSuggestion> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a music playlist based on this prompt: "${prompt}". 
      Return a JSON object with a 'name' for the playlist, a 'description', and a list of 10-15 'tracks' (each with 'title' and 'artist').`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            tracks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  artist: { type: Type.STRING }
                },
                required: ["title", "artist"]
              }
            }
          },
          required: ["name", "description", "tracks"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  }
};
