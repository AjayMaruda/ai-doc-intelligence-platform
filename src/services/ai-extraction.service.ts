import { aiClient } from '../config/ai-client';
import { env } from '../config/env';

export const extractStructuredDocumentData = async (text: string) => {
  const prompt = `
You are an AI document intelligence engine.

STRICT RULES:
- Return ONLY valid parsable JSON.
- No markdown.
- No code fences.
- No explanation text.

Expected JSON schema:
{
  "summary": "string",
  "importantEntities": ["string"],
  "documentType": "string",
  "keyInsights": ["string"]
}

Document Text:
${text.slice(0, 10000)}
`;

  const response = await aiClient.chat.completions.create({
    model: env.GROQ_MODEL,
    temperature: 0.2,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content || '';
};
