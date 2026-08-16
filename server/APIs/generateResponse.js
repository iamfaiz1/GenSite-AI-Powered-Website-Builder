import generateWithGemini from "./gemini_APIs.js";

const generateResponse = async (prompt) => {

    try {
        console.log("Starting Gemini fallback chain...");
        return await generateWithGemini(prompt);

    } catch (geminiError) {
        console.error("All Gemini models failed:");
        console.error(geminiError);

        // Later you can put OpenRouter here
        /*
        try {
            return await openRouter(prompt);
        } catch (openRouterError) {
            console.error(openRouterError);
        }
        */

        throw new Error(
            "All AI providers are currently unavailable."
        );
    }
};

export default generateResponse;