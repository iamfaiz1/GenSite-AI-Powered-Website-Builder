import { GoogleGenAI } from "@google/genai";

export const gemini31FlashLite = async (prompt) => {  
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-64k",
      contents: prompt,
      config: {
        temperature: 0.2,
        systemInstruction: "You must return ONLY valid raw JSON.",
      },
    });
    // console.log("Gemini raw response:", response);
    return response.text;
  } catch (err) {
    throw new Error("Gemini error: " + err.message);
  }
};




