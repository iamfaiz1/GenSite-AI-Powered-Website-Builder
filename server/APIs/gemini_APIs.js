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

// Model -> timestamp until which it should be skipped
const modelCooldowns = new Map();
const COOLDOWN_MS = 5* 60* 60 * 1000; // 5 hours


const isOnCooldown = (model) => {
    const cooldownUntil = modelCooldowns.get(model);
    if (!cooldownUntil) {
        return false;
    }

    // Cooldown expired
    if (Date.now() >= cooldownUntil) {
        modelCooldowns.delete(model);
        return false;
    }

    return true;
};


const putOnCooldown = (model) => {
    const cooldownUntil = Date.now() + COOLDOWN_MS;
    modelCooldowns.set(model, cooldownUntil);
    console.log(
        `${model} is on cooldown for ${COOLDOWN_MS / 1000}s`
    );
};


const generateWithGemini = async (prompt) => {
    let lastError = null;
    for (const model of GEMINI_MODELS) {

        // Skip temporarily unavailable models
        if (isOnCooldown(model)) {
            console.log(`Skipping ${model} - currently on cooldown`);
            continue;
        }

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

            // Temporary Google service problem
            if (temporaryError) {
                putOnCooldown(model);

                console.log(
                    `Falling back from ${model} because it is unavailable...`
                );

                continue;
            }

            // Quota/rate-limit problem
            if (quotaError) {
                console.log(
                    `Falling back from ${model} because of quota/rate limit...`
                );

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