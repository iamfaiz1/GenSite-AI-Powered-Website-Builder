import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODELS = [
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
];

const generateWithGemini = async (prompt) => {
    let lastError = null;
    
    for (const model of GEMINI_MODELS) {
        try {
            console.log(`Trying ${model}...`);
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
                config: {
                    systemInstruction:
                        "You must return ONLY valid raw JSON.",
                },
            });

            console.log(`SUCCESS: ${model}`);
            return response.text;

        } catch (error) {
            lastError = error;

            console.error(`FAILED: ${model}`);
            console.error(error.message);

            const message = error.message?.toLowerCase() || "";
            const quotaError =
                message.includes("429") ||
                message.includes("resource_exhausted") ||
                message.includes("quota");

            const temporaryError =
                message.includes("503") ||
                message.includes("unavailable");

            if (quotaError || temporaryError) {
                console.log(`Falling back from ${model}...`);
                continue;
            }

            // Don't fallback for invalid requests,
            // authentication errors, etc.
            throw error;
        }
    }

    throw new Error(
        `All Gemini models failed. Last error: ${lastError?.message}`
    );
};

export default generateWithGemini;