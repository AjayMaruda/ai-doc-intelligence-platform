import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';

export const extractTextFromFile = async (
  filePath: string,
  mimeType: string,
) => {
  const fileBuffer = await fs.readFile(filePath);

  if (mimeType === 'application/pdf') {
    const parser = new PDFParse({ data: fileBuffer });
    const pdfData = await parser.getText();
    return pdfData.text;
  }

  return fileBuffer.toString('utf-8');
};
