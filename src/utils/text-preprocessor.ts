export const prepareTextForAI = (rawText: string) => {
  const cleanedText = rawText
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E\n]/g, ' ')
    .trim();

  return cleanedText.slice(0, 12000);
};
