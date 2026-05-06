import { PDFParse } from 'pdf-parse';
import { logger } from '../config/logger';

export const extractTextFromBuffer = async (
  fileBuffer: Buffer,
  mimeType: string,
) => {
  logger.info({ mimeType }, 'Starting file text extraction');

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
