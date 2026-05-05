export const parseAiResponse = (aiText: string) => {
  try {
    const cleaned = aiText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/^[^{[]*/, '')
      .trim();

    return JSON.parse(cleaned);
  } catch {
    return {
      rawAiResponse: aiText,
    };
  }
};
