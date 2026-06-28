import { openAiGptOSSFree } from './openRouter.js'
import { gemini31FlashLite } from './geminiflash3.1Lite.js'

const generateResponse = async (prompt) => {
    try {
        console.log("Using Gemini")
        return await gemini31FlashLite(prompt)

    } catch (geminiError) {
        console.error("Gemini Failed: trying OpenRouter", geminiError)
        try {
            console.log("Using OpenRouter")
            return await openAiGptOSSFree(prompt)

        } catch (openRouterError) {
            console.error(
                "OpenRouter Failed:",
                openRouterError
            )

            throw new Error(
                "All AI providers are currently unavailable."
            )
        }
    }
}

export default generateResponse