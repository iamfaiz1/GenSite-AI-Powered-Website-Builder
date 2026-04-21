const extractJson = async (raw) => {
    if (!raw) {
        return null;
    }

    const cleaned = raw
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) {
        return null;
    }

    const jsonString = cleaned.slice(firstBrace, lastBrace + 1);
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        return null;
    }
};

export default extractJson