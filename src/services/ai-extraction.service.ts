import { aiClient } from '../config/ai-client';
import { env } from '../config/env';
import { logger } from '../config/logger';

export const extractStructuredDocumentData = async (text: string) => {
  const prompt = `
You are an advanced AI document intelligence engine specialized in extracting high-value structured business insights from uploaded documents.

STRICT OUTPUT RULES:
- Return ONLY valid parsable JSON.
- No markdown.
- No code fences.
- No explanation.
- No introductory text.
- No trailing text.
- If data is unavailable, return empty arrays or empty string.
- Do NOT hallucinate or invent facts not present in the document.

Expected JSON schema:
{
  "documentType": "string",
  "summary": "string",
  "importantEntities": ["string"],
  "keyInsights": ["string"],
  "importantDates": ["string"],
  "monetaryValues": ["string"],
  "actionItems": ["string"],
  "riskFlags": ["string"],
  "sentiment": "string"
}

Extraction Instructions:
- documentType: classify the document as specifically as possible.
- summary: provide a concise but meaningful executive summary.
- importantEntities: extract important names of people, organizations, locations, programs, brands, or products.
- keyInsights: extract the most critical informational findings.
- importantDates: list all major dates, deadlines, validity periods, or event references, and the reason for why those dates are important.
- monetaryValues: extract any currency, grant, invoice, salary, budget, or funding values.
- actionItems: identify obligations, next steps, recommendations, or tasks if present.
- riskFlags: identify warnings, legal obligations, compliance issues, urgent notices, or critical concerns.
- sentiment: classify overall tone such as informational, legal, promotional, analytical, warning, formal, etc.

Document Text:
${text}
`;

  const response = await aiClient.chat.completions.create({
    model: env.GROQ_MODEL,
    temperature: 0.1,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const rawOutput = response.choices[0].message.content || '';

  logger.info(`Raw AI output received: ${rawOutput.slice(0, 300)}`);

  const sanitizedOutput = rawOutput
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .replace(/^[^{]*/, '')
    .replace(/[^}]*$/, '')
    .trim();

  try {
    return JSON.parse(sanitizedOutput);
  } catch (error) {
    logger.error({ rawOutput, error }, 'Failed to parse AI JSON response');
    throw new Error('Invalid AI JSON response', { cause: error });
  }
};
