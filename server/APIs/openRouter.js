const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions'

const model = "openai/gpt-oss-120b:free"

export const openAiGptOSSFree = async (prompt) => {
    const res = await fetch(openRouterUrl, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + process.env.OPEN_ROUTER_API_KEY,
            'HTTP-Referer': process.env.YOUR_SITE_URL,
            'X-OpenRouter-Title': process.env.YOUR_SITE_NAME,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {role:'system', content:'You must return ONLY valid raw JSON.'},
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.2
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error('OpenRouter error: ' + err);
    }

    const data = await res.json();
    return data.choices[0].message.content
}