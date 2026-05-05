import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';
import { logger } from '../config/logger';

export const extractTextFromFile = async (
  filePath: string,
  mimeType: string,
) => {
  logger.info({ filePath, mimeType }, 'Starting file text extraction');

  const fileBuffer = await fs.readFile(filePath);

  if (mimeType === 'application/pdf') {
    try {
      logger.info('Parsing PDF file...');
      const parser = new PDFParse({ data: fileBuffer });
      const data = await parser.getText();

      logger.info(
        {
          pages: data.total,
          textLength: data.text?.length,
        },
        'PDF parsed successfully',
      );

      return data.text;
    } catch (error) {
      logger.error({ error }, 'Error parsing PDF file');
      throw error;
    }
  }

  logger.info('Reading file as UTF-8 string');
  return fileBuffer.toString('utf-8');
};
